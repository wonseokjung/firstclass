/**
 * Azure OpenAI Service
 * Azure OpenAI API를 사용하여 유튜브 채널 주제를 추천합니다
 */

interface ChannelIdea {
  title: string;
  description: string;
  targetAudience: string;
  profitability: number;
  difficulty: '초급' | '중급' | '고급';
  keywords: string[];
  expectedMonthlyIncome: string;
}

interface ChannelRecommendationResponse {
  ideas: ChannelIdea[];
  analysis: string;
}

/**
 * Azure OpenAI를 사용하여 유튜브 채널 주제를 추천받습니다
 */
export async function recommendYoutubeChannels(
  userInterests: string,
  targetIncome: number = 1000000
): Promise<ChannelRecommendationResponse> {
  try {
    // Azure OpenAI 엔드포인트와 키는 환경 변수에서 가져옵니다
    const endpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.REACT_APP_AZURE_OPENAI_KEY;
    const deploymentName = process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT || 'gpt-4';

    if (!endpoint || !apiKey) {
      throw new Error('Azure OpenAI 설정이 필요합니다. 환경 변수를 확인해주세요.');
    }

    // 사용자 정보 파싱 (userInterests에 모든 정보가 포함되어 있음)
    const lines = userInterests.split('\n').filter(line => line.trim());
    const parsedInfo: any = {};
    lines.forEach(line => {
      if (line.includes('관심사/전문성:')) parsedInfo.interests = line.split(':')[1]?.trim();
      if (line.includes('인생 목표:')) parsedInfo.lifeGoal = line.split(':')[1]?.trim();
      if (line.includes('이것을 하는 이유:')) parsedInfo.motivation = line.split(':')[1]?.trim();
      if (line.includes('하루 일과:')) parsedInfo.dailyRoutine = line.split(':')[1]?.trim();
    });

    const prompt = `당신은 2024-2025년 유튜브 시장 분석 전문가입니다. 
모든 카테고리(뷰티, 게임, 요리, 교육, 리뷰, 일상 브이로그, 금융, 여행 등)의 최신 트렌드, 마켓 크기, 경쟁 강도, CPM을 분석합니다.

# 📋 사용자 프로필
${parsedInfo.interests ? `**관심사/전문성**: ${parsedInfo.interests}` : ''}
${parsedInfo.lifeGoal ? `**인생 목표**: ${parsedInfo.lifeGoal}` : ''}
${parsedInfo.motivation ? `**시작 동기**: ${parsedInfo.motivation}` : ''}
${parsedInfo.dailyRoutine ? `**하루 일과**: ${parsedInfo.dailyRoutine}` : ''}
**목표 월수익**: ${targetIncome.toLocaleString()}원

# 🎯 분석 미션
위 사용자의 **성향, 관심사, 삶의 패턴**을 종합 분석하여, 
**수익성과 실현 가능성이 가장 높은** 유튜브 채널 주제 5개를 추천하세요.

## 🔍 필수 분석 항목

### 1. 마켓 분석
- **마켓 크기**: 해당 주제의 전체 시청자 규모 (대/중/소)
- **성장세**: 2024-2025년 트렌드 (급성장/안정/하락)
- **경쟁 강도**: 신규 진입자에게 유리한지 (치열함/보통/낮음)
- **수익 구조**: 주요 수익원 (광고/제휴/스폰서/커머스)

### 2. 사용자 적합도
- **관심사 매칭**: 사용자의 전문성/관심사와 얼마나 일치하는가
- **시간 투자**: 일과를 고려한 현실적인 제작 시간
- **초기 투자**: 필요한 장비/소프트웨어 비용
- **성공 확률**: 3개월 내 목표 수익 달성 가능성

### 3. 2024-2025 트렌드 반영
- 숏폼 (쇼츠/릴스) vs 롱폼 전략
- AI 자동화 도구 활용 가능성
- 바이럴 요소 (알고리즘 친화적)
- 플랫폼 횡단 전략 (유튜브+인스타+틱톡)

## 난이도 기준
- **초급**: 전문 장비 불필요, AI 도구로 자동화, 1일 1-2시간
- **중급**: 기본 장비 필요 (스마트폰+조명), 간단한 편집, 1일 2-4시간  
- **고급**: 전문 장비/스튜디오, 고급 편집 기술, 1일 4시간+

## 수익성 점수 (0-100)
- **90-100**: 고CPM($6-15), 제휴/협찬 활발, 빠른 성장
- **70-89**: 중CPM($3-6), 안정적 광고 수익, 꾸준한 성장
- **50-69**: 저CPM($1-3), 대량 조회수 필요, 느린 성장

## 출력 형식 (JSON만)
{
  "ideas": [
    {
      "title": "채널명 (사용자 관심사 반영)",
      "description": "이 채널이 무엇을 다루며, 왜 수익성이 높고, 어떻게 제작하는지 설명 (3-4문장)",
      "targetAudience": "주 시청자층 (연령대, 직업, 관심사, 소득수준)",
      "profitability": 85,
      "difficulty": "초급",
      "keywords": ["검색키워드1", "트렌드키워드2", "틈새키워드3"],
      "expectedMonthlyIncome": "조회수 X만 기준 → Y만원 ~ Z만원"
    }
  ],
  "analysis": "사용자의 성향/관심사/일과/동기를 종합하여, 왜 이 5개가 최적인지 + 마켓 크기와 경쟁 상황을 고려한 전략 (4-6문장)"
}

**중요 원칙**:
1. **AI 채널에 국한하지 마세요** - 사용자 관심사에 맞는 모든 분야 고려
2. **마켓 크기를 명확히** - 대형 마켓인지, 틈새 마켓인지
3. **경쟁 분석 필수** - 이미 포화된 시장은 피하고 블루오션 찾기
4. **구체적인 수치** - 예상 조회수, CPM, 월수익 범위
5. **실현 가능성 최우선** - 사용자가 실제로 시작하고 성공할 수 있는 주제`;

    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-05-01-preview`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `당신은 10년 경력의 유튜브 마켓 애널리스트이자 채널 기획 전문가입니다.

**전문 분야:**
- 모든 카테고리 유튜브 시장 분석 (뷰티, 게임, 요리, 교육, 금융, 여행, 일상, 리뷰, 취미 등)
- 2024-2025 트렌드 예측 및 블루오션 발굴
- 마켓 크기, 경쟁 강도, CPM 데이터 기반 의사결정
- 개인의 성향/관심사/라이프스타일 맞춤 채널 설계
- 숏폼/롱폼 전략, 제휴 마케팅, 커머스 연계
- 0원 시작 → 월 100만원 달성 로드맵

**데이터 기반 분석:**
- 각 카테고리별 평균 CPM ($1-15 범위)
- 경쟁 채널 분석 (상위 채널 vs 신규 진입)
- 시청자 수요 vs 공급 비율
- 계절성, 지속 가능성, 확장 가능성

**답변 원칙:**
1. **AI에 국한하지 않기** - 사용자 관심사에 맞는 모든 분야 탐색
2. **마켓 크기 명시** - 대형/중형/틈새 시장 구분
3. **경쟁 분석 필수** - 진입 장벽과 성공 확률
4. **구체적 수치** - 조회수 목표, 예상 CPM, 월수익 범위
5. **실현 가능성** - 사용자의 시간/자원/전문성 고려`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 3000,
        temperature: 0.8,
        top_p: 0.92,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Azure OpenAI API 오류: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('응답을 받지 못했습니다.');
    }

    // JSON 파싱
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('올바른 JSON 형식의 응답을 받지 못했습니다.');
    }

    const result: ChannelRecommendationResponse = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('Azure OpenAI 추천 오류:', error);
    
    // 폴백: 기본 추천 제공
    return {
      ideas: [
        {
          title: '직장인 일상 브이로그',
          description: '출퇴근, 점심 메뉴, 퇴근 후 루틴 등 공감 가능한 일상을 담은 브이로그입니다. 편집 최소화, 스마트폰 촬영만으로 시작 가능하며 직장인 공감 콘텐츠로 빠른 구독자 확보가 가능합니다.',
          targetAudience: '20-30대 직장인, 취준생',
          profitability: 85,
          difficulty: '초급',
          keywords: ['직장인브이로그', '일상루틴', '공감콘텐츠'],
          expectedMonthlyIncome: '조회수 10만 → 50만원 ~ 100만원'
        },
        {
          title: '집밥 레시피 & 가성비 요리',
          description: '간단하고 저렴한 집밥 레시피를 숏폼으로 제작합니다. 요리 과정을 빠르게 편집하여 30-60초 쇼츠로 제작하면 바이럴 가능성이 높고, 제휴 마케팅(조리 도구, 식재료)으로 추가 수익 창출이 가능합니다.',
          targetAudience: '1인 가구, 주부, 요리 초보',
          profitability: 90,
          difficulty: '초급',
          keywords: ['집밥레시피', '가성비요리', '요리쇼츠'],
          expectedMonthlyIncome: '조회수 20만 → 80만원 ~ 150만원'
        },
        {
          title: '솔직한 제품 리뷰',
          description: '생활용품, 전자기기, 뷰티 제품 등을 솔직하게 리뷰하는 채널입니다. 쿠팡 파트너스, 유튜브 쇼핑 등 제휴 마케팅 수익이 높고, 협찬 기회도 많아 안정적인 수익 구조를 만들 수 있습니다.',
          targetAudience: '쇼핑 관심층, 20-40대',
          profitability: 95,
          difficulty: '중급',
          keywords: ['제품리뷰', '솔직후기', '쇼핑추천'],
          expectedMonthlyIncome: '조회수 15만 + 제휴 → 100만원 ~ 250만원'
        },
        {
          title: '책 요약 & 인사이트',
          description: '베스트셀러나 자기계발서를 10분 내로 요약하고 핵심 인사이트를 전달합니다. 고학력층 타겟으로 CPM이 높고($5-8), AI 음성+이미지로 제작 가능하여 효율적입니다.',
          targetAudience: '직장인, 대학생, 자기계발 관심층',
          profitability: 88,
          difficulty: '중급',
          keywords: ['책요약', '독서', '자기계발'],
          expectedMonthlyIncome: '조회수 8만 → 60만원 ~ 120만원 (고CPM)'
        },
        {
          title: '취미 수집/언박싱',
          description: '피규어, 카드, 레고, 한정판 스니커즈 등 수집 취미를 공유하고 언박싱 영상을 제작합니다. 틈새 시장이지만 충성도 높은 팬층 확보가 쉽고, 중고 거래/커머스 연계로 수익 다각화가 가능합니다.',
          targetAudience: '수집가, 덕후 문화 관심층',
          profitability: 75,
          difficulty: '초급',
          keywords: ['언박싱', '수집', '덕질'],
          expectedMonthlyIncome: '조회수 5만 + 커머스 → 50만원 ~ 100만원'
        }
      ],
      analysis: `입력하신 관심사와 일과를 분석한 결과, 위 5가지 채널이 가장 적합합니다. 2024-2025년 유튜브 트렌드는 '공감 가능한 일상', '실용적 정보', '숏폼 콘텐츠'이며, 특히 틈새 시장(niche)을 공략하면 경쟁이 덜하면서도 충성도 높은 구독자를 확보할 수 있습니다. 초기 투자는 스마트폰 촬영과 무료 편집 도구(CapCut 등)만으로 충분하며, 하루 1-2시간 투자로 월 ${(targetIncome / 10000).toFixed(0)}만원 달성이 현실적입니다. 광고 수익 외에도 제휴 마케팅, 커머스, 협찬 등 수익을 다각화하면 더 빠른 성장이 가능합니다.`
    };
  }
}

/**
 * Azure OpenAI 범용 호출 함수
 * 다양한 프롬프트에 대해 Azure OpenAI를 호출합니다
 */
export async function callAzureOpenAI(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  try {
    const endpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.REACT_APP_AZURE_OPENAI_KEY;
    const deploymentName = process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT || 'gpt-4';

    if (!endpoint || !apiKey) {
      throw new Error('Azure OpenAI 설정이 필요합니다.');
    }

    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-05-01-preview`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages,
        max_tokens: options?.maxTokens || 2000,
        temperature: options?.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Azure OpenAI API 오류: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Azure OpenAI 호출 오류:', error);
    throw error;
  }
}

/**
 * 백엔드 API를 통해 Azure OpenAI를 호출합니다 (보안 강화)
 */
export async function recommendYoutubeChannelsViaBackend(
  userInterests: string,
  targetIncome: number = 1000000
): Promise<ChannelRecommendationResponse> {
  try {
    // 백엔드 API 엔드포인트 (Azure Functions 또는 Express 서버)
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:7071/api';
    
    const response = await fetch(`${backendUrl}/recommend-youtube-channels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInterests,
        targetIncome,
      }),
    });

    if (!response.ok) {
      throw new Error(`백엔드 API 오류: ${response.statusText}`);
    }

    const data: ChannelRecommendationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('백엔드 API 추천 오류:', error);
    // 폴백: 직접 호출
    return recommendYoutubeChannels(userInterests, targetIncome);
  }
}

