import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Target, MessageCircle, Heart, Send, User, BarChart3, Upload, TrendingUp, LineChart, Brain, Youtube, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../../../services/azureTableService';

interface Day9PageProps {
  onBack: () => void;
  onNext?: () => void;
}

interface DiscussionPost {
  id: string;
  author: string;
  authorEmail?: string;
  content: string;
  title?: string;
  createdAt: string;
  likes: number;
  likedBy?: string[];
  isLiked?: boolean;
}

const DAY_COURSE_ID = 'ai-building-day9';

const Day9Page: React.FC<Day9PageProps> = ({ onBack, onNext }) => {
  const navigate = useNavigate();
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


  const loadPosts = async (currentUserEmail?: string) => {
    try {
      setIsLoadingPosts(true);
      const posts = await AzureTableService.getPostsByCourse(DAY_COURSE_ID);

      const formattedPosts: DiscussionPost[] = posts.map((p: any) => {
        const likedByArray = p.likedBy ? JSON.parse(p.likedBy) : [];
        return {
          id: p.RowKey,
          author: p.authorName || '익명',
          authorEmail: p.authorEmail,
          content: p.content,
          title: p.title,
          createdAt: p.createdAt,
          likes: p.likes || 0,
          likedBy: likedByArray,
          isLiked: currentUserEmail ? likedByArray.includes(currentUserEmail) : false
        };
      });

      setDiscussionPosts(formattedPosts);
    } catch (error) {
      console.error('❌ 게시글 로드 실패:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const userInfo = sessionStorage.getItem('aicitybuilders_user_session');
        let currentEmail = '';

        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          currentEmail = parsed.email;
          setUserEmail(parsed.email);
          setUserName(parsed.name || parsed.email?.split('@')[0] || '익명');

          const progress = await AzureTableService.getCourseDayProgress(
            parsed.email,
            'ai-building-course'
          );

          if (progress && progress.completedDays.includes(9)) {
            setIsDayCompleted(true);
          }
        }

        await loadPosts(currentEmail);
      } catch (error) {
        console.error('❌ 진행 상황 로드 실패:', error);
      }
    };

    loadUserProgress();
  }, []);

  const handleCompleteDay = async () => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (isDayCompleted) {
      alert('이미 완료한 강의입니다!');
      return;
    }

    try {
      setIsCompletingDay(true);
      const learningTimeMinutes = 70;

      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        9,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 9 완료! 마지막 Day 10으로 이동하세요!');
      } else {
        alert('❌ Day 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ Day 완료 처리 오류:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await AzureTableService.createPost({
        courseId: DAY_COURSE_ID,
        title: newComment.substring(0, 50),
        content: newComment,
        authorEmail: userEmail,
        authorName: userName || '익명',
        category: 'share'
      });

      if (result.success) {
        setNewComment('');
        await loadPosts(userEmail);
      } else {
        alert('댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 댓글 작성 실패:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const success = await AzureTableService.likePost(DAY_COURSE_ID, postId, userEmail);

      if (success) {
        setDiscussionPosts(posts =>
          posts.map(post =>
            post.id === postId
              ? {
                ...post,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked
              }
              : post
          )
        );
      }
    } catch (error) {
      console.error('❌ 좋아요 처리 실패:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };


  // 영상 섹션 데이터
  const videoSections = [
    {
      id: 'hamzzi-analysis',
      icon: <Brain size={20} color="#f59e0b" />,
      title: '🐹 김햄찌 채널 분석: 1인 AI 기업의 성공 모델',
      badge: '핵심 분석',
      badgeColor: '#f59e0b',
      description: '김햄찌 채널이 어떻게 AI로 콘텐츠를 만들고 비즈니스를 확장했는지 분석합니다.',
      vimeoUrl: 'https://player.vimeo.com/video/1153255731?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      id: 'intro-upload',
      icon: <Upload size={20} color="#0891b2" />,
      title: '📤 인트로: 콘텐츠 업로드 가이드',
      badge: '업로드',
      badgeColor: '#0891b2',
      description: '유튜브에 첫 영상 업로드하기 - 제목, 설명, 태그, 썸네일 설정 완벽 가이드',
      vimeoUrl: 'https://player.vimeo.com/video/1152692067?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      id: 'youtube-studio',
      icon: <Youtube size={20} color="#dc2626" />,
      title: '🎬 YouTube Studio 핵심 기능',
      badge: 'Studio',
      badgeColor: '#dc2626',
      description: 'YouTube Studio의 핵심 기능 - 대시보드, 콘텐츠 관리, 재생목록, 자막 설정',
      vimeoUrl: 'https://player.vimeo.com/video/1152698458?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      id: 'analytics-basics',
      icon: <BarChart3 size={20} color="#16a34a" />,
      title: '📊 YouTube Analytics 기초',
      badge: '분석',
      badgeColor: '#16a34a',
      description: '핵심 지표 읽는 법 - 조회수, 시청 지속 시간, CTR, 구독자 분석',
      vimeoUrl: 'https://player.vimeo.com/video/1152720051?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      id: 'retention-deep',
      icon: <LineChart size={20} color="#7c3aed" />,
      title: '📉 시청자 유지율 심층 분석',
      badge: '유지율',
      badgeColor: '#7c3aed',
      description: '이탈 구간 파악하고 콘텐츠 개선하기 - 그래프 해석 방법',
      vimeoUrl: 'https://player.vimeo.com/video/1152720195?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      id: 'ai-sentiment',
      icon: <Brain size={20} color="#d97706" />,
      title: '🤖 AI로 댓글 감성 분석',
      badge: 'AI 분석',
      badgeColor: '#d97706',
      description: 'ChatGPT/Gemini로 시청자 댓글을 분석하여 콘텐츠 인사이트 도출하기',
      vimeoUrl: 'https://player.vimeo.com/video/1152720306?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      id: 'improvement',
      icon: <TrendingUp size={20} color="#db2777" />,
      title: '🚀 데이터 기반 콘텐츠 개선',
      badge: '개선 전략',
      badgeColor: '#db2777',
      description: '분석 결과를 바탕으로 다음 영상 기획 및 채널 성장 전략 수립',
      vimeoUrl: 'https://player.vimeo.com/video/1152720419?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '15px',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={20} />
            강의 목록으로
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              background: 'white',
              width: '60px',
              height: '60px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '800',
              color: '#16a34a',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
              9
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.5rem', margin: 0, fontWeight: '700' }}>
                [준공식] 콘텐츠 업로드 & 데이터 분석
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: '5px 0 0 0', fontSize: '0.95rem' }}>
                핵심 지표 읽는 법 | AI 감성 분석으로 건물 리모델링
              </p>
              {isDayCompleted && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  marginTop: '8px',
                  fontSize: '0.85rem',
                  color: 'white'
                }}>
                  <CheckCircle size={14} /> 완료됨
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>

        {/* 🎯 Day 9 미션 */}
        <div style={{
          background: '#fffbeb',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '2px solid #fbbf24'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{
              background: '#fbbf24',
              color: '#1f2937',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '1rem'
            }}>
              🎯 Day 9 미션
            </span>
            <span style={{
              background: '#dcfce7',
              color: '#16a34a',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              도전해보세요!
            </span>
            <span style={{
              background: '#ede9fe',
              color: '#7c3aed',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              ✅ 유튜브 코리아 인증
            </span>
          </div>

          <h3 style={{ color: '#1f2937', fontSize: '1.6rem', fontWeight: '800', marginBottom: '15px' }}>
            🐹 정서불안 김햄찌 - AI 콘텐츠의 이상적인 모델
          </h3>

          <p style={{ color: '#374151', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '20px' }}>
            제이 AI 멘토가 <strong style={{ color: '#d97706' }}>"정서불안 김햄찌"</strong>를 선택한 이유는 명확합니다.<br />
            이 채널은 <strong style={{ color: '#16a34a' }}>AI로 콘텐츠를 만든 이상적인 모델</strong>이기 때문입니다. 🚀
          </p>

          {/* 핵심 포인트 */}
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#16a34a', fontSize: '1.1rem', marginBottom: '12px', fontWeight: '700' }}>
              💡 왜 김햄찌인가?
            </h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                '💰 가성비 최고! 제작 비용은 최소로, 퀄리티와 재미는 극대화',
                '짧은 콘텐츠로 높은 조회수 달성 (가로형/세로형 모두 1분 이내)',
                '구글 유튜브 코리아 공식 인정 커뮤니티 멤버 (한국에 488명)',
                'AI로 만든 콘텐츠도 "좋은 콘텐츠"로 인정받은 증거',
                '편집 호흡(Cut Pacing)을 아주 잘 활용한 사례'
              ].map((point, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#1f2937' }}>
                  <span style={{ color: '#16a34a', fontWeight: '700' }}>✓</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shorts 채널 이미지 */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#1f2937', fontSize: '1rem', marginBottom: '10px', fontWeight: '600' }}>
              📱 Shorts로 구독자 67만+ 달성
            </h4>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid #e5e7eb',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <img src="/images/day9-shorts.png" alt="정서불안 김햄찌 Shorts 채널" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>

          {/* 제이 AI 멘토 인사이트 */}
          <div style={{
            background: '#eff6ff',
            border: '2px solid #3b82f6',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '45px',
                height: '45px',
                background: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem'
              }}>
                🧠
              </div>
              <div>
                <h4 style={{ color: '#1d4ed8', margin: 0, fontSize: '1.05rem', fontWeight: '700' }}>제이 AI 멘토의 인사이트</h4>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.85rem' }}>AI 1인 기업의 핵심 비즈니스 모델</p>
              </div>
            </div>

            <p style={{ color: '#1f2937', lineHeight: '1.7', marginBottom: '12px' }}>
              제가 생각하는 가장 좋은 구조는 <strong style={{ color: '#d97706' }}>광고 조회수만으로 수익을 내는 것이 아닙니다.</strong>
            </p>

            <div style={{ background: '#fef3c7', borderRadius: '10px', padding: '15px', marginBottom: '12px' }}>
              <p style={{ color: '#92400e', fontWeight: '700', margin: '0 0 8px 0', fontSize: '1rem' }}>
                📺 유튜브 = 브랜드화 홍보 수단
              </p>
              <p style={{ color: '#1f2937', margin: 0, lineHeight: '1.6' }}>
                유튜브 조회수 → <strong style={{ color: '#16a34a' }}>제품 판매</strong>, <strong style={{ color: '#7c3aed' }}>브랜디드 광고</strong>, <strong style={{ color: '#db2777' }}>서비스 판매</strong>로<br />
                AI 1인 기업의 가능성이 열립니다!
              </p>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
              💡 김햄찌는 아마 1인 기업 구조를 모르기 때문에 제품만 판매하는 것 같지만, 여러분은 처음부터 전략적으로 설계할 수 있습니다!
            </p>
          </div>

          {/* 제품 판매 이미지 */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#1f2937', fontSize: '1rem', marginBottom: '10px', fontWeight: '600' }}>
              🛒 유튜브 → 스마트스토어 제품 판매 연결
            </h4>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid #e5e7eb',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <img src="/images/day9-products.png" alt="김햄찌 스마트스토어 제품들" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>

          {/* 가로형 영상 이미지 */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#1f2937', fontSize: '1rem', marginBottom: '10px', fontWeight: '600' }}>
              📹 가로형 영상 - 사자성어 & 인생 교훈 콘텐츠
            </h4>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid #e5e7eb',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <img src="/images/day9-mission.png" alt="김햄찌 유튜브 채널 예시" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>

          {/* 편집 호흡 */}
          <div style={{
            background: '#fdf2f8',
            border: '1px solid #f9a8d4',
            borderRadius: '12px',
            padding: '18px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#db2777', fontSize: '1rem', marginBottom: '10px', fontWeight: '700' }}>
              ✂️ 핵심 비법: 편집 호흡 (Cut Pacing)
            </h4>
            <p style={{ color: '#1f2937', lineHeight: '1.7', margin: 0 }}>
              김햄찌가 성공한 <strong style={{ color: '#db2777' }}>가장 중요한 요소 중 하나</strong>가 바로 편집 호흡입니다.<br />
              짧은 컷으로 리듬감 있게 편집하면, 시청자가 지루해할 틈 없이 끝까지 시청합니다.<br />
              <strong style={{ color: '#d97706' }}>1분 이내 영상 + 빠른 편집 호흡 = 높은 시청자 유지율</strong>
            </p>
          </div>

          {/* 필요한 기술 스택 */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#1f2937', fontSize: '1rem', marginBottom: '12px', fontWeight: '600' }}>
              🛠️ 이런 채널을 만들려면 필요한 것들
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              {[
                { icon: '🎨', text: '이미지 생성', desc: 'Midjourney, DALL-E' },
                { icon: '🎬', text: '영상 생성', desc: 'Runway, Pika' },
                { icon: '✍️', text: '기획 (대본)', desc: 'ChatGPT, Claude' },
                { icon: '🎙️', text: '음성 생성', desc: 'TTS, 필터 변환' },
                { icon: '🖼️', text: '썸네일', desc: 'Canva, Figma' },
                { icon: '📝', text: '제목/설명/태그', desc: 'SEO 최적화' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '5px' }}>{item.icon}</span>
                  <span style={{ color: '#1f2937', fontWeight: '600', display: 'block', fontSize: '0.9rem' }}>{item.text}</span>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 마무리 메시지 */}
          <div style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            borderRadius: '12px',
            padding: '18px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'white', fontSize: '1rem', fontWeight: '700', margin: 0, lineHeight: '1.6' }}>
              🚀 오늘 Day 9에서 업로드 & 데이터 분석까지 마스터하면,<br />
              여러분도 AI 1인 기업가로서 첫 걸음을 내딛게 됩니다!
            </p>
          </div>
        </div>

        {/* 학습 목표 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1f2937', marginBottom: '15px', fontSize: '1.2rem' }}>
            <Target size={22} color="#16a34a" /> 오늘의 학습 목표
          </h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            {[
              '📤 YouTube에 첫 영상 업로드하고 최적화하기',
              '📊 YouTube Analytics 핵심 지표 이해하기',
              '📉 시청자 유지율 그래프 분석 방법 익히기',
              '🤖 AI로 댓글 감성 분석하고 인사이트 도출하기',
              '🚀 데이터 기반 콘텐츠 개선 전략 수립하기'
            ].map((obj, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#374151', fontSize: '0.95rem' }}>
                <span style={{ color: '#16a34a', fontWeight: '600' }}>{idx + 1}.</span>
                {obj}
              </div>
            ))}
          </div>
        </div>

        {/* 영상 섹션들 */}
        <div style={{ marginBottom: '25px' }}>
          {videoSections.map((section) => (
            <div key={section.id} style={{
              background: 'white',
              borderRadius: '16px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}>
              {/* 섹션 헤더 */}
              <div style={{
                padding: '15px 20px',
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {section.icon}
                  <span style={{ color: '#1f2937', fontSize: '1.05rem', fontWeight: '700' }}>{section.title}</span>
                </div>
                <span style={{
                  background: section.badgeColor,
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '15px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {section.badge}
                </span>
              </div>

              {/* 영상 영역 */}
              <div style={{ padding: '20px' }}>
                <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '15px', lineHeight: '1.6' }}>
                  {section.description}
                </p>
                <div style={{
                  position: 'relative',
                  paddingTop: '56.25%',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#f3f4f6'
                }}>
                  <iframe
                    src={section.vimeoUrl}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    title={section.title}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 핵심 지표 요약 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: '#1f2937', fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={22} color="#16a34a" /> YouTube 핵심 지표 (KPI) 정리
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {[
              { icon: '👁️', title: '조회수', desc: '도달 범위 측정', bg: '#eff6ff' },
              { icon: '⏱️', title: '시청 지속 시간', desc: '콘텐츠 품질 측정', bg: '#f0fdf4' },
              { icon: '📈', title: 'CTR (클릭률)', desc: '썸네일/제목 효과', bg: '#fffbeb' },
              { icon: '🔔', title: '구독 전환율', desc: '팬 확보 효율', bg: '#fdf2f8' },
              { icon: '📉', title: '시청자 유지율', desc: '콘텐츠 집중도', bg: '#f5f3ff' }
            ].map((kpi, idx) => (
              <div key={idx} style={{
                background: kpi.bg,
                padding: '15px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{kpi.icon}</div>
                <h4 style={{ color: '#1f2937', margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '700' }}>{kpi.title}</h4>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.8rem' }}>{kpi.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI 프롬프트 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: '#d97706', fontSize: '1.1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Brain size={22} /> AI 댓글 감성 분석 프롬프트
          </h3>
          <div style={{ background: '#1f2937', borderRadius: '10px', padding: '18px' }}>
            <pre style={{
              color: '#34d399',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              lineHeight: '1.7',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {`다음 YouTube 댓글들을 분석해주세요:

[댓글 목록 붙여넣기]

분석해줄 내용:
1. 긍정/부정/중립 비율
2. 가장 많이 언급된 키워드 TOP 5
3. 시청자가 원하는 콘텐츠 방향
4. 개선해야 할 점
5. 다음 영상 기획 아이디어 3가지`}
            </pre>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '12px' }}>
            💡 <strong>TIP:</strong> ChatGPT, Gemini, Claude 모두 사용 가능합니다. 댓글이 많으면 50-100개 정도 샘플링해서 분석하세요.
          </p>
        </div>

        {/* 유용한 링크 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: '#1f2937', fontSize: '1.1rem', marginBottom: '15px' }}>🔗 유용한 링크</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {[
              { href: 'https://studio.youtube.com', icon: '🎬', name: 'YouTube Studio', desc: '콘텐츠 관리', color: '#dc2626' },
              { href: 'https://www.youtube.com/analytics', icon: '📊', name: 'YouTube Analytics', desc: '데이터 분석', color: '#16a34a' },
              { href: 'https://chatgpt.com', icon: '🤖', name: 'ChatGPT', desc: 'AI 감성 분석', color: '#7c3aed' },
              { href: 'https://aistudio.google.com', icon: '✨', name: 'Google AI Studio', desc: 'Gemini 활용', color: '#d97706' }
            ].map((link, idx) => (
              <a key={idx} href={link.href} target="_blank" rel="noopener noreferrer" style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.3rem' }}>{link.icon}</span>
                <div>
                  <div style={{ color: link.color, fontWeight: '600', fontSize: '0.9rem' }}>{link.name}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{link.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 토론 섹션 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1f2937', marginBottom: '20px', fontSize: '1.1rem' }}>
            <MessageCircle size={22} color="#16a34a" /> Day 9 토론방
          </h3>

          {/* 댓글 작성 */}
          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '18px', marginBottom: '18px' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="데이터 분석 경험이나 첫 업로드 소감을 공유해주세요! 📊"
              style={{
                width: '100%',
                minHeight: '90px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px',
                color: '#1f2937',
                fontSize: '0.95rem',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={handleAddComment}
              disabled={isSubmitting || !newComment.trim()}
              style={{
                marginTop: '10px',
                background: isSubmitting ? '#9ca3af' : '#16a34a',
                border: 'none',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={16} />
              {isSubmitting ? '작성 중...' : '댓글 작성'}
            </button>
          </div>

          {/* 댓글 목록 */}
          {isLoadingPosts ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>댓글을 불러오는 중...</div>
          ) : discussionPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요! 💬</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {discussionPosts.map((post) => (
                <div key={post.id} style={{ background: '#f9fafb', borderRadius: '10px', padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: '#16a34a',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <User size={16} color="white" />
                      </div>
                      <div>
                        <div style={{ color: '#1f2937', fontWeight: '600', fontSize: '0.9rem' }}>{post.author}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{formatTime(post.createdAt)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: post.isLiked ? '#dc2626' : '#9ca3af',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <Heart size={16} fill={post.isLiked ? '#dc2626' : 'none'} />
                      {post.likes}
                    </button>
                  </div>
                  <p style={{ color: '#374151', margin: 0, lineHeight: '1.6', fontSize: '0.9rem' }}>{post.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* 커뮤니티 바로가기 */}
          <div
            onClick={() => navigate('/community/step1')}
            style={{
              marginTop: '18px',
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '10px',
              padding: '14px 18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} color="#16a34a" />
              <span style={{ color: '#16a34a', fontWeight: '600', fontSize: '0.9rem' }}>Step 1 커뮤니티에서 더 많은 토론 참여하기</span>
            </div>
            <span style={{ color: '#6b7280' }}>→</span>
          </div>
        </div>

        {/* Day 완료 버튼 */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleCompleteDay}
            disabled={isCompletingDay || isDayCompleted}
            style={{
              background: isDayCompleted ? '#16a34a' : 'linear-gradient(135deg, #16a34a, #15803d)',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: isDayCompleted ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'white',
              boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)'
            }}
          >
            {isDayCompleted ? (
              <><CheckCircle size={20} /> Day 9 완료!</>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <><PlayCircle size={20} /> Day 9 완료하기</>
            )}
          </button>

          {onNext && (
            <button
              onClick={onNext}
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#1f2937',
                border: 'none',
                padding: '15px 35px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
              }}
            >
              🏆 Day 10으로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day9Page;
