import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen, ExternalLink, Lightbulb, Globe, Video, Target, MessageCircle, Heart, Send, User, Calculator, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../../../services/azureTableService';

interface Day3PageProps {
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

const DAY_COURSE_ID = 'ai-building-day3'; // Day 3 토론방 ID

const Day3Page: React.FC<Day3PageProps> = ({ onBack, onNext }) => {
  const navigate = useNavigate();
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 게시글 로드
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

          if (progress && progress.completedDays.includes(3)) {
            setIsDayCompleted(true);
          }
        }
        
        // 게시글 로드
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
      const learningTimeMinutes = 45;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        3,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 3 완료! 다음 강의로 이동하세요!');
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

  // 댓글 추가 (Azure 저장)
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

  // 좋아요 토글 (Azure 연동)
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

  // 시간 포맷
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

  // 나라별 CPM 데이터
  const countryData = [
    { country: '🇺🇸 미국', cpm: '$4-5', color: '#3b82f6' },
    { country: '🇬🇧 영국', cpm: '$4-5', color: '#6366f1' },
    { country: '🇯🇵 일본', cpm: '$3', color: '#ec4899' },
    { country: '🇰🇷 한국', cpm: '$2.5', color: '#f43f5e' },
    { country: '🇧🇷 브라질', cpm: '$1.5', color: '#22c55e' },
    { country: '🇮🇳 인도', cpm: '$0.8', color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0f1a 0%, #1a1f2e 100%)' }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '15px',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={20} />
            강의 목록으로
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              width: '65px',
              height: '65px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '800',
              color: 'white',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
            }}>
              3
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.6rem', margin: 0, fontWeight: '700' }}>
                타겟팅 전략: 유튜브 = 디지털 부동산
              </h1>
              <p style={{ color: '#e2e8f0', margin: '8px 0 0 0', fontSize: '1rem' }}>
                맨해튼에서 배우는 콘텐츠 타겟팅의 비밀
              </p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                  <Clock size={16} /> 약 45분
                </span>
                {isDayCompleted && (
                  <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                    <CheckCircle size={16} /> 완료됨
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* 학습 목표 카드 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '40px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: '#3b82f6', 
            marginBottom: '25px',
            fontSize: '1.4rem',
            fontWeight: '700'
          }}>
            <Target size={28} /> 오늘의 학습 목표
          </h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {[
              '맨해튼과 유튜브의 유사성 이해하기',
              '나라별/콘텐츠별 CPM(광고 수익) 차이 파악하기',
              '유튜브 수익 계산기 사용법 익히기',
              '나만의 타겟팅 전략 수립하기'
            ].map((obj, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                color: '#e2e8f0',
                fontSize: '1.05rem'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: 'white',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                {obj}
              </div>
            ))}
          </div>
        </div>

        {/* 비디오 섹션 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* 비디오 헤더 */}
          <div style={{ 
            padding: '18px 25px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#3b82f6',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            <BookOpen size={22} /> 강의 영상
          </div>

          {/* 비디오 콘텐츠 */}
          <div style={{ padding: '25px' }}>
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden' }}>
              <iframe 
                src="https://player.vimeo.com/video/1149061122?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                title="데이3건물주되기수정"
              />
            </div>
          </div>
        </div>

        {/* 섹션 1: 맨해튼 = 유튜브 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '25px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ 
            color: '#fbbf24', 
            fontSize: '1.4rem', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            🏙️ 맨해튼 = 오프라인 유튜브
          </h3>
          
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            padding: '30px',
            borderRadius: '16px',
            marginBottom: '25px',
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <p style={{ color: '#fbbf24', fontSize: '1.2rem', fontWeight: '700', margin: '0 0 15px 0' }}>
              "맨해튼은 120개가 넘는 언어가 공존하는 곳"
            </p>
            <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.8' }}>
              전 세계의 사람들이 모여 살고, 다양한 문화와 음식, 놀거리가 공존합니다.
              이것은 유튜브와 완전히 똑같습니다!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '25px',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🏠</div>
              <h4 style={{ color: '#3b82f6', margin: '0 0 10px 0' }}>부동산 건물</h4>
              <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.95rem', lineHeight: '1.7' }}>
                이 건물에 누가 살까?<br/>
                어떤 나라 사람들을 타겟팅할까?<br/>
                <strong style={{ color: '#3b82f6' }}>1층에 뭘 넣을까?</strong>
              </p>
            </div>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '25px',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📺</div>
              <h4 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>유튜브 채널</h4>
              <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.95rem', lineHeight: '1.7' }}>
                누가 내 채널을 볼까?<br/>
                어떤 나라를 타겟팅할까?<br/>
                <strong style={{ color: '#ef4444' }}>어떤 콘텐츠를 만들까?</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 섹션 2: 타겟팅 예시 - 인도 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '25px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ 
            color: '#f59e0b', 
            fontSize: '1.4rem', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Globe size={28} /> 타겟팅 전략의 예시
          </h3>

          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '25px',
            borderRadius: '16px',
            marginBottom: '25px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <h4 style={{ color: '#f59e0b', margin: '0 0 15px 0' }}>🇮🇳 인도인 타겟팅 건물의 경우</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '15px',
                borderRadius: '12px',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <p style={{ color: '#22c55e', fontWeight: '700', margin: '0 0 5px 0' }}>✅ 장점</p>
                <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem' }}>
                  인구가 많아 빠르게 채워짐<br/>
                  공실률 낮음
                </p>
              </div>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '15px',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <p style={{ color: '#ef4444', fontWeight: '700', margin: '0 0 5px 0' }}>❌ 단점</p>
                <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem' }}>
                  월세를 낮게 책정해야 함<br/>
                  수익성 제한
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(59, 130, 246, 0.15))',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <h4 style={{ color: '#a855f7', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lightbulb size={22} /> 1층 전략: 할랄 푸드
            </h4>
            <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.9', fontSize: '1rem' }}>
              인도 사람들을 타겟으로 한다면 1층에 <strong style={{ color: '#fbbf24' }}>할랄 푸드(Halal Food)</strong> 식당을 넣습니다.<br/>
              그러면 위층에 살면서 1층에서 밥 먹기 편하니까 더 많이 입주하게 됩니다.<br/>
              <strong style={{ color: '#a855f7' }}>콘텐츠도 마찬가지!</strong> 타겟 시청자가 좋아하는 것을 제공해야 합니다.
            </p>
          </div>
        </div>

        {/* 섹션 3: 나라별 CPM 비교 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '25px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ 
            color: '#22c55e', 
            fontSize: '1.4rem', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <DollarSign size={28} /> 나라별 CPM (1,000뷰당 수익) 비교
          </h3>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '15px',
            marginBottom: '25px'
          }}>
            {countryData.map((item, idx) => (
              <div key={idx} style={{
                background: `${item.color}15`,
                padding: '20px',
                borderRadius: '16px',
                border: `1px solid ${item.color}40`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.country.split(' ')[0]}</div>
                <p style={{ color: '#e2e8f0', margin: '0 0 5px 0', fontSize: '0.9rem' }}>
                  {item.country.split(' ')[1]}
                </p>
                <p style={{ color: item.color, margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>
                  {item.cpm}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <p style={{ color: '#ef4444', margin: 0, fontWeight: '600', fontSize: '1rem' }}>
              ⚠️ 팔로워 수에 집착하지 마세요!
            </p>
            <p style={{ color: '#e2e8f0', margin: '10px 0 0 0', fontSize: '0.95rem', lineHeight: '1.7' }}>
              인도를 타겟으로 쇼츠만 만들면 팔로워는 빨리 늘지만,
              실제 수익은 매우 낮습니다. <strong style={{ color: '#ef4444' }}>수익 = CPM × 조회수</strong>
            </p>
          </div>
        </div>

        {/* 섹션 4: 콘텐츠 종류별 수익 배율 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '25px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ 
            color: '#a855f7', 
            fontSize: '1.4rem', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Video size={28} /> 콘텐츠 종류 & 영상 길이의 영향
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '25px' }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '25px',
              borderRadius: '16px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h4 style={{ color: '#3b82f6', margin: '0 0 15px 0' }}>📊 콘텐츠 종류별 배율</h4>
              <ul style={{ color: '#e2e8f0', margin: 0, paddingLeft: '20px', lineHeight: '2' }}>
                <li><strong style={{ color: '#22c55e' }}>금융/테크</strong>: 1.5배 (가장 높음)</li>
                <li><strong style={{ color: '#3b82f6' }}>교육/비즈니스</strong>: 1.3배</li>
                <li><strong style={{ color: '#fbbf24' }}>게임/엔터테인먼트</strong>: 1.0배</li>
                <li><strong style={{ color: '#94a3b8' }}>퀴즈/일반</strong>: 0.8배</li>
              </ul>
            </div>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              padding: '25px',
              borderRadius: '16px',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <h4 style={{ color: '#22c55e', margin: '0 0 15px 0' }}>⏱️ 영상 길이별 수익</h4>
              <ul style={{ color: '#e2e8f0', margin: 0, paddingLeft: '20px', lineHeight: '2' }}>
                <li><strong style={{ color: '#ef4444' }}>쇼츠 (1분 미만)</strong>: 가장 낮음</li>
                <li><strong style={{ color: '#fbbf24' }}>1-8분</strong>: 중간광고 불가</li>
                <li><strong style={{ color: '#3b82f6' }}>8-20분</strong>: 중간광고 1개</li>
                <li><strong style={{ color: '#22c55e' }}>20분 이상</strong>: 중간광고 여러 개</li>
          </ul>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15))',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <h4 style={{ color: '#fbbf24', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              💡 Jay의 경우
            </h4>
            <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.9', fontSize: '1.05rem' }}>
              한국 타겟 + 테크/교육 콘텐츠 + 긴 영상(실습)<br/>
              → <strong style={{ color: '#fbbf24' }}>1만 뷰당 약 9~12만원</strong> 수익<br/>
              평균보다 높은 이유: 테크 분야 + 긴 영상 + 교육 콘텐츠의 조합!
            </p>
          </div>
        </div>

        {/* 섹션 5: 실습 - 수익 계산기 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15))',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '40px',
          border: '2px solid rgba(34, 197, 94, 0.3)'
        }}>
          <h3 style={{ 
            color: '#22c55e', 
            fontSize: '1.5rem', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Calculator size={30} /> 실습: 유튜브 수익 계산기 사용하기
          </h3>

          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '30px',
            borderRadius: '16px',
            marginBottom: '25px'
          }}>
            <h4 style={{ color: '#fbbf24', margin: '0 0 20px 0' }}>📝 오늘의 미션</h4>
            <ol style={{ color: '#e2e8f0', margin: 0, paddingLeft: '20px', lineHeight: '2.2' }}>
              <li><strong>타겟 국가</strong> 선택하기 (미국, 일본, 한국 등)</li>
              <li><strong>콘텐츠 종류</strong> 선택하기 (테크, 교육, 게임 등)</li>
              <li><strong>영상 길이</strong> 설정하기 (쇼츠, 중간, 긴 영상)</li>
              <li>월간 조회수 목표 설정하기</li>
              <li><strong>월 100만원</strong>을 벌려면 어떻게 해야 할지 계산해보기!</li>
            </ol>
          </div>

          <a
            href="https://www.ezerai.xyz/youtube-calculator"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '16px',
              fontSize: '1.2rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <ExternalLink size={24} />
            🧮 유튜브 수익 계산기 (에제르 AI)
          </a>

          <p style={{ 
            color: '#e2e8f0', 
            textAlign: 'center', 
            marginTop: '20px',
            fontSize: '0.9rem'
          }}>
            * 계산 결과를 댓글로 공유해주세요!
          </p>
        </div>

        {/* 핵심 메시지 */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '40px',
          textAlign: 'center',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
          <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>
            전략적 타겟팅이 핵심입니다
          </h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.9', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 20px' }}>
            건물을 지을 때 <strong style={{ color: '#fbbf24' }}>누가 살 건지</strong> 미리 정하듯이,<br/>
            콘텐츠를 만들 때도 <strong style={{ color: '#22c55e' }}>누가 볼 건지</strong> 먼저 정해야 합니다.<br/><br/>
            나라, 콘텐츠 종류, 영상 길이를 전략적으로 선택하면<br/>
            <strong style={{ color: '#3b82f6' }}>같은 노력으로 더 많은 수익</strong>을 얻을 수 있습니다.
          </p>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
            "비즈니스적 상상을 계속해보세요." - Jay
          </p>
        </div>

        {/* 💬 Day 3 토론방 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          padding: 'clamp(25px, 5vw, 35px)',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '15px',
            marginBottom: '25px'
          }}>
            <h3 style={{ 
              color: '#3b82f6', 
              fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', 
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: 0
            }}>
              <MessageCircle size={26} /> Day 3 토론방
            </h3>
            <button
              onClick={() => navigate('/community/step3')}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#3b82f6',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              전체 커뮤니티 →
            </button>
          </div>

          {/* 댓글 입력 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '16px',
            padding: 'clamp(15px, 3vw, 20px)',
            marginBottom: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={20} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="여러분의 타겟 국가와 콘텐츠 종류, 예상 수익을 공유해주세요!"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    padding: '12px 15px',
                    color: 'white',
                    fontSize: '0.95rem',
                    resize: 'none',
                    minHeight: '60px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmitting}
                    style={{
                      background: newComment.trim() && !isSubmitting
                        ? 'linear-gradient(135deg, #3b82f6, #6366f1)' 
                        : 'rgba(100,100,100,0.3)',
                      border: 'none',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: newComment.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Send size={16} /> {isSubmitting ? '작성 중...' : '댓글 작성'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {isLoadingPosts ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#64748b'
              }}>
                ⏳ 토론 내용을 불러오는 중...
              </div>
            ) : discussionPosts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#64748b',
                background: 'rgba(15, 23, 42, 0.3)',
                borderRadius: '16px'
              }}>
                💬 아직 토론이 없습니다. 첫 번째 댓글을 남겨보세요!
              </div>
            ) : discussionPosts.map((post) => (
              <div key={post.id} style={{
                background: 'rgba(15, 23, 42, 0.4)',
                borderRadius: '16px',
                padding: 'clamp(15px, 3vw, 20px)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: 'white'
                  }}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.95rem' }}>
                      {post.author}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {formatTime(post.createdAt)}
                    </div>
                  </div>
                </div>
                <p style={{ 
                  color: '#e2e8f0', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.7',
                  margin: '0 0 12px 0'
                }}>
                  {post.content}
                </p>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{
                    background: post.isLiked ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                    border: post.isLiked ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                    color: post.isLiked ? '#ef4444' : '#94a3b8',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Heart size={14} fill={post.isLiked ? '#ef4444' : 'none'} /> {post.likes}
                </button>
          </div>
        ))}
          </div>

          {/* 더보기 */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => navigate('/community/step3')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#94a3b8',
                padding: '12px 30px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              💬 더 많은 토론 보기
            </button>
          </div>
        </div>

        {/* 완료 버튼 */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleCompleteDay}
            disabled={isCompletingDay || isDayCompleted}
            style={{
              background: isDayCompleted 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: 'white',
              border: 'none',
              padding: '18px 45px',
              borderRadius: '16px',
              fontSize: '1.15rem',
              fontWeight: '700',
              cursor: isDayCompleted ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: isDayCompleted 
                ? '0 8px 25px rgba(34, 197, 94, 0.4)'
                : '0 8px 25px rgba(59, 130, 246, 0.4)'
            }}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle size={24} /> Day 3 완료!
              </>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <>
                <PlayCircle size={24} /> Day 3 완료하기
              </>
            )}
          </button>
          
          {onNext && (
            <button
              onClick={onNext}
              style={{
                background: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '18px 45px',
                borderRadius: '16px',
                fontSize: '1.15rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              Day 4로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day3Page;
