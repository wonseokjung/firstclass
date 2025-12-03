/**
 * YouTube Data API v3 서비스
 * 
 * ⚠️ 할당량 정보:
 * - 일일 기본 할당량: 10,000 유닛
 * - 검색 요청: 100 유닛/요청 (하루 100회)
 * - 채널/비디오 조회: 1 유닛/요청 (하루 10,000회)
 * 
 * 💡 최적화 전략:
 * - 로컬 캐싱 (24시간 유효)
 * - 사용자별 일일 제한
 * - 검색 결과 재사용
 */

interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  country: string;
  customUrl?: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  channelTitle: string;
  channelId: string;
  duration?: string;
}

interface TrendAnalysis {
  channels: YouTubeChannel[];
  topVideos: YouTubeVideo[];
  insights: {
    commonKeywords: string[];
    avgViewCount: number;
    avgSubscriberCount: number;
    avgVideoViews: number;
    contentPatterns: string[];
    uploadFrequency: string;
    bestUploadTimes: string[];
  };
  cachedAt?: string;
  cacheExpiry?: string;
}

interface QuotaStatus {
  remaining: number;
  used: number;
  resetAt: string;
}

// 로컬 캐시 (메모리)
const CACHE: Map<string, { data: TrendAnalysis; expiry: number }> = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간

// 사용자별 일일 사용량 추적
const USER_USAGE: Map<string, { count: number; date: string }> = new Map();
const MAX_DAILY_SEARCHES = 5;

class YouTubeService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';
  private quotaUsed = 0;
  private quotaLimit = 10000;

  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('⚠️ YouTube API 키가 설정되지 않았습니다. 목업 데이터를 사용합니다.');
      console.info('💡 API 키 설정 방법:');
      console.info('   1. Google Cloud Console에서 프로젝트 생성');
      console.info('   2. YouTube Data API v3 활성화');
      console.info('   3. API 키 생성');
      console.info('   4. .env 파일에 REACT_APP_YOUTUBE_API_KEY=YOUR_KEY 추가');
    }
  }

  /**
   * 할당량 상태 조회
   */
  getQuotaStatus(): QuotaStatus {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return {
      remaining: this.quotaLimit - this.quotaUsed,
      used: this.quotaUsed,
      resetAt: tomorrow.toISOString()
    };
  }

  /**
   * 사용자별 사용 횟수 체크
   */
  checkUserLimit(userId: string): { allowed: boolean; remaining: number } {
    const today = new Date().toISOString().split('T')[0];
    const userUsage = USER_USAGE.get(userId);

    if (!userUsage || userUsage.date !== today) {
      USER_USAGE.set(userId, { count: 0, date: today });
      return { allowed: true, remaining: MAX_DAILY_SEARCHES };
    }

    return {
      allowed: userUsage.count < MAX_DAILY_SEARCHES,
      remaining: MAX_DAILY_SEARCHES - userUsage.count
    };
  }

  /**
   * 사용자 사용 횟수 증가
   */
  incrementUserUsage(userId: string): void {
    const today = new Date().toISOString().split('T')[0];
    const userUsage = USER_USAGE.get(userId);

    if (!userUsage || userUsage.date !== today) {
      USER_USAGE.set(userId, { count: 1, date: today });
    } else {
      userUsage.count++;
    }
  }

  /**
   * 캐시에서 데이터 조회
   */
  private getFromCache(topic: string): TrendAnalysis | null {
    const cacheKey = topic.toLowerCase().trim();
    const cached = CACHE.get(cacheKey);

    if (cached && cached.expiry > Date.now()) {
      console.log('✅ 캐시에서 데이터 반환:', cacheKey);
      return cached.data;
    }

    if (cached) {
      CACHE.delete(cacheKey);
    }
    return null;
  }

  /**
   * 캐시에 데이터 저장
   */
  private saveToCache(topic: string, data: TrendAnalysis): void {
    const cacheKey = topic.toLowerCase().trim();
    const now = new Date();
    const expiry = new Date(now.getTime() + CACHE_DURATION);

    data.cachedAt = now.toISOString();
    data.cacheExpiry = expiry.toISOString();

    CACHE.set(cacheKey, {
      data,
      expiry: Date.now() + CACHE_DURATION
    });
    console.log('💾 캐시에 데이터 저장:', cacheKey);
  }

  /**
   * 주제로 관련 채널 검색
   */
  async searchChannelsByTopic(topic: string, maxResults: number = 20): Promise<YouTubeChannel[]> {
    if (!this.apiKey) {
      return this.getMockChannels(topic, maxResults);
    }

    try {
      // 검색 요청: 100 유닛
      const searchUrl = `${this.baseUrl}/search?part=snippet&type=channel&q=${encodeURIComponent(topic + ' 유튜브')}&maxResults=${Math.min(maxResults, 25)}&key=${this.apiKey}&order=relevance&regionCode=KR&relevanceLanguage=ko`;
      
      console.log('🔍 YouTube 채널 검색 중...');
      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) {
        const errorData = await searchResponse.json();
        console.error('❌ YouTube API 오류:', errorData);
        if (errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
          throw new Error('YouTube API 할당량이 초과되었습니다. 내일 다시 시도해주세요.');
        }
        throw new Error(`YouTube API 오류: ${errorData.error?.message}`);
      }

      const searchData = await searchResponse.json();
      this.quotaUsed += 100;

      if (!searchData.items || searchData.items.length === 0) {
        console.log('⚠️ 검색 결과 없음, 목업 데이터 반환');
        return this.getMockChannels(topic, maxResults);
      }

      // 채널 ID 추출
      const channelIds = searchData.items.map((item: any) => item.snippet.channelId).join(',');
      
      // 채널 상세 정보: 1 유닛 * 채널 수
      const channelUrl = `${this.baseUrl}/channels?part=snippet,statistics,brandingSettings&id=${channelIds}&key=${this.apiKey}`;
      
      const channelResponse = await fetch(channelUrl);
      const channelData = await channelResponse.json();
      this.quotaUsed += channelData.items?.length || 0;

      return channelData.items?.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description?.substring(0, 300) || '',
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
        subscriberCount: parseInt(item.statistics?.subscriberCount || '0'),
        viewCount: parseInt(item.statistics?.viewCount || '0'),
        videoCount: parseInt(item.statistics?.videoCount || '0'),
        country: item.snippet.country || 'KR',
        customUrl: item.snippet.customUrl || ''
      })).sort((a: YouTubeChannel, b: YouTubeChannel) => b.subscriberCount - a.subscriberCount) || [];

    } catch (error) {
      console.error('❌ YouTube 채널 검색 실패:', error);
      return this.getMockChannels(topic, maxResults);
    }
  }

  /**
   * 주제로 인기 영상 검색
   */
  async searchTopVideosByTopic(topic: string, maxResults: number = 15): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      return this.getMockVideos(topic, maxResults);
    }

    try {
      // 최근 1년 이내 영상만
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const publishedAfter = oneYearAgo.toISOString();

      const searchUrl = `${this.baseUrl}/search?part=snippet&type=video&q=${encodeURIComponent(topic)}&maxResults=${Math.min(maxResults, 25)}&key=${this.apiKey}&order=viewCount&regionCode=KR&relevanceLanguage=ko&publishedAfter=${publishedAfter}`;
      
      console.log('🔍 YouTube 비디오 검색 중...');
      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) {
        throw new Error('YouTube API 오류');
      }

      const searchData = await searchResponse.json();
      this.quotaUsed += 100;

      if (!searchData.items || searchData.items.length === 0) {
        return this.getMockVideos(topic, maxResults);
      }

      // 비디오 상세 정보
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      const videoUrl = `${this.baseUrl}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${this.apiKey}`;
      
      const videoResponse = await fetch(videoUrl);
      const videoData = await videoResponse.json();
      this.quotaUsed += videoData.items?.length || 0;

      return videoData.items?.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description?.substring(0, 200) || '',
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
        viewCount: parseInt(item.statistics?.viewCount || '0'),
        likeCount: parseInt(item.statistics?.likeCount || '0'),
        commentCount: parseInt(item.statistics?.commentCount || '0'),
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        duration: item.contentDetails?.duration || ''
      })).sort((a: YouTubeVideo, b: YouTubeVideo) => b.viewCount - a.viewCount) || [];

    } catch (error) {
      console.error('❌ YouTube 비디오 검색 실패:', error);
      return this.getMockVideos(topic, maxResults);
    }
  }

  /**
   * 트렌드 분석 (메인 함수)
   * 캐싱 + 할당량 관리 포함
   */
  async analyzeTrend(topic: string, userId?: string): Promise<TrendAnalysis> {
    // 1. 사용자 제한 체크
    if (userId) {
      const limit = this.checkUserLimit(userId);
      if (!limit.allowed) {
        throw new Error(`일일 검색 한도(${MAX_DAILY_SEARCHES}회)에 도달했습니다. 내일 다시 시도해주세요.`);
      }
    }

    // 2. 캐시 확인
    const cached = this.getFromCache(topic);
    if (cached) {
      console.log('✅ 캐시된 데이터 반환 (API 호출 없음)');
      return cached;
    }

    // 3. 할당량 체크
    const quota = this.getQuotaStatus();
    if (quota.remaining < 300) {
      console.warn('⚠️ 할당량 부족, 목업 데이터 반환');
      return this.getMockTrendAnalysis(topic);
    }

    console.log('🚀 새로운 트렌드 분석 시작:', topic);

    // 4. API 호출
    const [channels, topVideos] = await Promise.all([
      this.searchChannelsByTopic(topic, 20),
      this.searchTopVideosByTopic(topic, 15)
    ]);

    // 5. 인사이트 계산
    const insights = this.calculateInsights(channels, topVideos);

    const result: TrendAnalysis = {
      channels,
      topVideos,
      insights
    };

    // 6. 캐시 저장
    this.saveToCache(topic, result);

    // 7. 사용자 사용량 증가
    if (userId) {
      this.incrementUserUsage(userId);
    }

    console.log('✅ 트렌드 분석 완료! 할당량 사용:', this.quotaUsed);
    return result;
  }

  /**
   * 인사이트 계산
   */
  private calculateInsights(channels: YouTubeChannel[], videos: YouTubeVideo[]) {
    // 평균 계산
    const avgSubscriberCount = channels.length > 0
      ? Math.round(channels.reduce((sum, ch) => sum + ch.subscriberCount, 0) / channels.length)
      : 0;

    const avgViewCount = channels.length > 0
      ? Math.round(channels.reduce((sum, ch) => sum + ch.viewCount, 0) / channels.length)
      : 0;

    const avgVideoViews = videos.length > 0
      ? Math.round(videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length)
      : 0;

    // 키워드 추출
    const allText = [
      ...channels.map(ch => ch.title + ' ' + ch.description),
      ...videos.map(v => v.title)
    ].join(' ');
    const commonKeywords = this.extractKeywords(allText);

    // 콘텐츠 패턴 분석
    const contentPatterns = this.analyzeContentPatterns(videos);

    // 업로드 빈도 분석
    const uploadFrequency = this.analyzeUploadFrequency(channels);

    // 최적 업로드 시간 (일반적인 추천)
    const bestUploadTimes = ['오후 6-8시 (퇴근 시간)', '오후 9-11시 (저녁 휴식)', '주말 오전 10-12시'];

    return {
      commonKeywords,
      avgViewCount,
      avgSubscriberCount,
      avgVideoViews,
      contentPatterns,
      uploadFrequency,
      bestUploadTimes
    };
  }

  /**
   * 키워드 추출
   */
  private extractKeywords(text: string): string[] {
    const stopWords = ['의', '가', '이', '은', '들', '는', '좀', '잘', '걍', '과', '도', '를', '으로', '자', '에', '와', '한', '하다'];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1 && !stopWords.includes(word));

    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => word);
  }

  /**
   * 콘텐츠 패턴 분석
   */
  private analyzeContentPatterns(videos: YouTubeVideo[]): string[] {
    if (videos.length === 0) return [];

    const patterns: string[] = [];

    // 제목 길이 분석
    const avgTitleLength = Math.round(videos.reduce((sum, v) => sum + v.title.length, 0) / videos.length);
    patterns.push(`📝 평균 제목 길이: ${avgTitleLength}자 (${avgTitleLength < 30 ? '짧고 임팩트' : avgTitleLength < 50 ? '적절한 길이' : '상세한 설명'})`);

    // 숫자 사용 비율
    const withNumbers = videos.filter(v => /\d+/.test(v.title)).length;
    const numberPercent = Math.round((withNumbers / videos.length) * 100);
    if (numberPercent > 40) {
      patterns.push(`🔢 ${numberPercent}%가 숫자 포함 (예: "TOP 10", "3가지 방법", "100만원")`);
    }

    // 물음표/느낌표 사용
    const withQuestion = videos.filter(v => v.title.includes('?')).length;
    const withExclamation = videos.filter(v => v.title.includes('!')).length;
    if (withQuestion > videos.length / 4) {
      patterns.push('❓ 물음표로 호기심 유발하는 제목 많음');
    }
    if (withExclamation > videos.length / 4) {
      patterns.push('❗ 느낌표로 강조하는 제목 많음');
    }

    // 이모지 사용
    const withEmoji = videos.filter(v => /[\u{1F300}-\u{1F9FF}]/u.test(v.title)).length;
    if (withEmoji > videos.length / 5) {
      patterns.push('😊 이모지를 활용한 시각적 제목');
    }

    // 한국어 vs 영어 제목
    const koreanOnly = videos.filter(v => /^[가-힣\s\d]+$/.test(v.title.replace(/[^\w가-힣\s]/g, ''))).length;
    if (koreanOnly < videos.length / 2) {
      patterns.push('🌍 영어/외래어를 적절히 혼합한 제목');
    }

    // 괄호 사용
    // eslint-disable-next-line no-useless-escape
    const withBrackets = videos.filter(v => /[\[\]()【】]/.test(v.title)).length;
    if (withBrackets > videos.length / 3) {
      patterns.push('📌 [카테고리] 등 괄호로 정보 분류');
    }

    return patterns;
  }

  /**
   * 업로드 빈도 분석
   */
  private analyzeUploadFrequency(channels: YouTubeChannel[]): string {
    if (channels.length === 0) return '데이터 없음';

    const avgVideos = Math.round(channels.reduce((sum, ch) => sum + ch.videoCount, 0) / channels.length);
    
    if (avgVideos > 1000) return '매일 업로드 (하루 1-2개)';
    if (avgVideos > 500) return '주 3-5회 업로드';
    if (avgVideos > 200) return '주 1-2회 업로드';
    return '월 2-4회 업로드';
  }

  /**
   * 목업 트렌드 분석 (API 키 없거나 할당량 부족시)
   */
  private getMockTrendAnalysis(topic: string): TrendAnalysis {
    return {
      channels: this.getMockChannels(topic, 20),
      topVideos: this.getMockVideos(topic, 15),
      insights: {
        commonKeywords: ['트렌드', '핫한', '인기', '추천', '꿀팁', '리뷰', '일상', '브이로그'],
        avgViewCount: 5000000,
        avgSubscriberCount: 150000,
        avgVideoViews: 300000,
        contentPatterns: [
          '📝 평균 제목 길이: 25-35자',
          '🔢 60%가 숫자 포함',
          '❓ 호기심 유발 제목 패턴',
          '😊 이모지로 시선 끌기'
        ],
        uploadFrequency: '주 2-3회 업로드',
        bestUploadTimes: ['오후 6-8시', '주말 오전']
      },
      cachedAt: new Date().toISOString()
    };
  }

  /**
   * 목업 채널 데이터
   */
  private getMockChannels(topic: string, count: number): YouTubeChannel[] {
    const channelNames = [
      `${topic} 마스터`, `${topic} 연구소`, `프로 ${topic}`, `${topic} TV`,
      `${topic} 스쿨`, `${topic} 아카데미`, `${topic} 유니버스`, `${topic} 클래스`,
      `리얼 ${topic}`, `${topic} 공식`, `${topic} 매니아`, `${topic} 월드`,
      `${topic} 허브`, `${topic} 스튜디오`, `${topic} 랩`, `${topic} 센터`,
      `${topic} 프렌즈`, `${topic} 가이드`, `${topic} 101`, `${topic} 킹덤`
    ];

    return channelNames.slice(0, count).map((name, i) => ({
      id: `mock-channel-${i}`,
      title: name,
      description: `${topic}에 관한 유익하고 재미있는 콘텐츠를 제공하는 채널입니다. 매주 새로운 영상으로 찾아뵙겠습니다!`,
      thumbnailUrl: `https://picsum.photos/seed/${topic}${i}/400/400`,
      subscriberCount: Math.floor(Math.random() * 900000) + 100000,
      viewCount: Math.floor(Math.random() * 50000000) + 1000000,
      videoCount: Math.floor(Math.random() * 800) + 100,
      country: 'KR',
      customUrl: `@${topic.replace(/\s/g, '')}${i}`
    })).sort((a, b) => b.subscriberCount - a.subscriberCount);
  }

  /**
   * 목업 비디오 데이터
   */
  private getMockVideos(topic: string, count: number): YouTubeVideo[] {
    const titlePatterns = [
      `${topic} 완벽 가이드 - 이것만 알면 됩니다!`,
      `[충격] ${topic}의 진실, 아무도 몰랐던 비밀`,
      `${topic} TOP 10 추천 (2024년 최신)`,
      `초보자를 위한 ${topic} 시작 가이드`,
      `${topic}로 월 100만원 버는 방법`,
      `전문가가 알려주는 ${topic} 핵심 팁 5가지`,
      `${topic} 하면 안되는 실수 7가지`,
      `${topic} 1년 해본 솔직 후기`,
      `${topic} vs 다른것 비교 분석`,
      `${topic} 트렌드 완전 정복!`,
      `${topic} 실제 수익 공개합니다`,
      `${topic}이 어려운 분들 꼭 보세요`,
      `${topic} 꿀팁 대방출 🍯`,
      `${topic} A to Z 완전 정리`,
      `${topic} 성공 사례 분석`
    ];

    return titlePatterns.slice(0, count).map((title, i) => ({
      id: `mock-video-${i}`,
      title,
      description: `${topic}에 대해 자세히 알아보는 영상입니다.`,
      thumbnailUrl: `https://picsum.photos/seed/video${topic}${i}/640/360`,
      viewCount: Math.floor(Math.random() * 2000000) + 50000,
      likeCount: Math.floor(Math.random() * 50000) + 1000,
      commentCount: Math.floor(Math.random() * 5000) + 100,
      publishedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      channelTitle: `${topic} 채널`,
      channelId: `mock-channel-${i % 5}`
    })).sort((a, b) => b.viewCount - a.viewCount);
  }
}

// 싱글톤 인스턴스 내보내기
const youtubeService = new YouTubeService();
export default youtubeService;
export type { YouTubeChannel, YouTubeVideo, TrendAnalysis, QuotaStatus };
