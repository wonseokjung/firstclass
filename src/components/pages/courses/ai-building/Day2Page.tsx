import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, BookOpen, ExternalLink, Lightbulb, Building2, Video, Rocket, Target, MessageCircle, Heart, Send, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../../../services/azureTableService';

interface Day2PageProps {
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

const DAY_COURSE_ID = 'ai-building-day2'; // Day 2 토론방 ID

const Day2Page: React.FC<Day2PageProps> = ({ onBack, onNext }) => {
  const navigate = useNavigate();
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'theory' | 'practice'>('theory');
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

          if (progress && progress.completedDays.includes(2)) {
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
      const learningTimeMinutes = 50;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        2,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 2 완료! 다음 강의로 이동하세요!');
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

  // 성장 사이클 단계 데이터
  const growthCycleSteps = [
    { step: 1, title: 'AI 콘텐츠', subtitle: '유튜브, 블로그, SNS', color: '#f43f5e', icon: '🎬' },
    { step: 2, title: '자동화 에이전트', subtitle: '콘텐츠 생산 자동화', color: '#a855f7', icon: '🤖' },
    { step: 3, title: '바이브코딩', subtitle: 'AI와 대화하며 개발', color: '#3b82f6', icon: '💻' },
    { step: 4, title: 'AI 1인 기업', subtitle: '수익화 & 스케일업', color: '#22c55e', icon: '🌐' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0f1a 0%, #1a1f2e 100%)' }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
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
              background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
              width: '65px',
              height: '65px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '800',
              color: 'white',
              boxShadow: '0 8px 25px rgba(244, 63, 94, 0.4)'
            }}>
              2
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.6rem', margin: 0, fontWeight: '700' }}>
                경제적 자유: 잠자는 동안에도 돈이 들어오는 구조
              </h1>
              <p style={{ color: '#e2e8f0', margin: '8px 0 0 0', fontSize: '1rem' }}>
                AI 기반 1인 기업 청사진 만들기
              </p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
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
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(168, 85, 247, 0.1))',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '40px',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: '#f43f5e', 
            marginBottom: '25px',
            fontSize: '1.4rem',
            fontWeight: '700'
          }}>
            <Target size={28} /> 오늘의 학습 목표
          </h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {[
              '경제적 자유(Financial Freedom)의 진정한 의미 이해하기',
              '부동산 vs 콘텐츠 수익화의 현실 비교하기',
              'AI 1인 기업 성장 사이클 이해하기',
              '나만의 1인 기업 청사진 만들기 (실습)'
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
                  background: 'linear-gradient(135deg, #f43f5e, #a855f7)',
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

        {/* 비디오 탭 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* 탭 헤더 */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(15, 23, 42, 0.5)'
          }}>
            <button
              onClick={() => setActiveTab('theory')}
              style={{
                flex: 1,
                padding: '18px 25px',
                background: activeTab === 'theory' 
                  ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(168, 85, 247, 0.2))' 
                  : 'transparent',
                border: 'none',
                color: activeTab === 'theory' ? '#f43f5e' : '#e2e8f0',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s',
                borderBottom: activeTab === 'theory' ? '3px solid #f43f5e' : '3px solid transparent'
              }}
            >
              <BookOpen size={22} /> 이론 강의
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              style={{
                flex: 1,
                padding: '18px 25px',
                background: activeTab === 'practice' 
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))' 
                  : 'transparent',
                border: 'none',
                color: activeTab === 'practice' ? '#22c55e' : '#e2e8f0',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s',
                borderBottom: activeTab === 'practice' ? '3px solid #22c55e' : '3px solid transparent'
              }}
            >
              <PlayCircle size={22} /> 실습 강의
            </button>
          </div>

          {/* 비디오 콘텐츠 */}
          <div style={{ padding: '25px' }}>
            {activeTab === 'theory' ? (
              <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden' }}>
                <iframe 
                  src="https://player.vimeo.com/video/1148246242?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  title="인공지능건물주되기데이2_이론"
                />
              </div>
            ) : (
              <div style={{ position: 'relative', paddingTop: '75%', borderRadius: '16px', overflow: 'hidden' }}>
                <iframe 
                  src="https://player.vimeo.com/video/1148248797?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  title="인공지능건물주되기데이2_실습"
                />
              </div>
            )}
          </div>
        </div>

        {/* 섹션 1: 경제적 자유란? */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '25px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ 
            color: '#ffd60a', 
            fontSize: '1.4rem', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            💰 경제적 자유(Financial Freedom)란?
          </h3>
          
          <div style={{
            background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
            padding: '30px',
            borderRadius: '16px',
            marginBottom: '25px',
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <p style={{ color: '#ffd60a', fontSize: '1.2rem', fontWeight: '700', margin: '0 0 15px 0' }}>
              "일하지 않아도, 잠잘 때도, 아플 때에도 들어오는 현금 흐름"
            </p>
            <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.8' }}>
              패시브 인컴(Passive Income)을 만들기 위해 노력해야 합니다.
              이것이 진정한 경제적 자유의 시작입니다.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '25px',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⏰</div>
              <h4 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>노동 소득</h4>
              <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.95rem', lineHeight: '1.7' }}>
                일한 만큼만 돈을 받음<br/>
                <strong style={{ color: '#ef4444' }}>시간 = 돈</strong>
              </p>
            </div>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              padding: '25px',
              borderRadius: '16px',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🔄</div>
              <h4 style={{ color: '#22c55e', margin: '0 0 10px 0' }}>패시브 인컴</h4>
              <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.95rem', lineHeight: '1.7' }}>
                시스템이 돈을 벌어줌<br/>
                <strong style={{ color: '#22c55e' }}>시간 ≠ 돈</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 섹션 2: 부동산 vs 디지털 콘텐츠 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '25px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ 
            color: '#0ea5e9', 
            fontSize: '1.4rem', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Building2 size={28} /> 부동산 vs 디지털 콘텐츠
          </h3>

          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '25px',
            borderRadius: '16px',
            marginBottom: '25px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <h4 style={{ color: '#ef4444', margin: '0 0 15px 0' }}>🏠 부동산의 현실</h4>
            <ul style={{ color: '#e2e8f0', margin: 0, paddingLeft: '20px', lineHeight: '2' }}>
              <li>최소 <strong style={{ color: '#ef4444' }}>10억 이상</strong> 필요 (작은 건물도)</li>
              <li>세금 40% + 높은 월세 비용 = 실제 저축 거의 불가능</li>
              <li>뉴욕 원룸 월 400만원, 강남 15평 월 500만원+</li>
              <li>1년에 1억 벌어도 집 사기 <strong style={{ color: '#ef4444' }}>거의 불가능</strong></li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <h4 style={{ color: '#22c55e', margin: '0 0 15px 0' }}>📱 디지털 콘텐츠의 기회</h4>
            <ul style={{ color: '#e2e8f0', margin: 0, paddingLeft: '20px', lineHeight: '2' }}>
              <li>초기 자본 <strong style={{ color: '#22c55e' }}>거의 0원</strong></li>
              <li>유튜브 광고, 책 인세 등 <strong style={{ color: '#22c55e' }}>패시브 인컴</strong> 가능</li>
              <li>AI로 <strong style={{ color: '#22c55e' }}>개인이 방송국</strong>이 될 수 있는 시대</li>
              <li>확장성 <strong style={{ color: '#22c55e' }}>무제한</strong></li>
          </ul>
          </div>
        </div>

        {/* 섹션 3: 유튜브 시장의 변화 */}
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
            <Video size={28} /> 유튜브 시장의 변화 & AI의 기회
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '25px' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '25px',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <h4 style={{ color: '#ef4444', margin: '0 0 15px 0' }}>❌ 과거 vs 현재</h4>
              <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.8', fontSize: '0.95rem' }}>
                초창기: 스마트폰 하나로 아마추어 콘텐츠<br/><br/>
                현재: SBS, KBS, MBC가 유튜브로 이동<br/>
                → 콘텐츠 퀄리티 경쟁 심화<br/>
                → 1세대 유튜버들 대부분 사라짐
              </p>
            </div>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              padding: '25px',
              borderRadius: '16px',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <h4 style={{ color: '#22c55e', margin: '0 0 15px 0' }}>✅ AI로 생존하는 법</h4>
              <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.8', fontSize: '0.95rem' }}>
                <strong style={{ color: '#22c55e' }}>니치(Niche) 주제</strong>를 찾아라!<br/><br/>
                방송국이 할 수 없는 것:<br/>
                • 나만의 전문성<br/>
                • 특정 관심사/취미<br/>
                • 탈북, 국봉 등 특이한 주제
              </p>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(59, 130, 246, 0.15))',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <h4 style={{ color: '#a855f7', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lightbulb size={22} /> 핵심 인사이트
            </h4>
            <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.9', fontSize: '1.05rem' }}>
              콘텐츠만 만들어서는 장기적으로 살아남을 수 없습니다.<br/>
              잘 나가는 유튜버들은 <strong style={{ color: '#ffd60a' }}>무조건 뭔가를 판매</strong>하고 있습니다.<br/>
              <strong style={{ color: '#a855f7' }}>제품 또는 서비스</strong>를 판매하는 1인 기업으로 성장해야 합니다.
            </p>
          </div>
        </div>

        {/* 섹션 4: AI 1인 기업 성장 사이클 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '25px',
          border: '1px solid rgba(255,255,255,0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />
          
          <h3 style={{ 
            color: 'white', 
            fontSize: '1.5rem', 
            marginBottom: '15px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            성공적인<br/>
            <span style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #22c55e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.8rem',
              fontWeight: '800'
            }}>
              AI 1인 기업을 위한
            </span><br/>
            <span style={{ color: '#22c55e', fontSize: '1.8rem', fontWeight: '800' }}>
              무한 성장 사이클
            </span>
          </h3>

          {/* 4단계 사이클 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginTop: '35px',
            position: 'relative',
            zIndex: 1
          }}>
            {growthCycleSteps.map((step, idx) => (
              <div key={step.step} style={{
                background: `linear-gradient(135deg, ${step.color}20, ${step.color}10)`,
                border: `2px solid ${step.color}50`,
                borderRadius: '20px',
                padding: '25px',
                position: 'relative',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '20px',
                  background: step.color,
                  color: 'white',
                  padding: '4px 12px',
            borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '700'
                }}>
                  STEP {step.step}
                </div>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px', marginTop: '10px' }}>
                  {step.icon}
                </div>
                <h4 style={{ color: step.color, margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '700' }}>
                  {step.title}
                </h4>
                <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem' }}>
                  {step.subtitle}
                </p>
                
                {/* 화살표 표시 */}
                {idx < 3 && (
                  <div style={{
                    position: 'absolute',
                    right: idx % 2 === 0 ? '-15px' : 'auto',
                    bottom: idx < 2 ? '-15px' : 'auto',
                    left: idx % 2 === 1 ? '-15px' : 'auto',
                    top: idx >= 2 ? '-15px' : 'auto',
                    color: '#94a3b8',
                    fontSize: '1.5rem'
                  }}>
                    {idx === 0 && '→'}
                    {idx === 1 && '↓'}
                    {idx === 2 && '←'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 순환 화살표 표시 */}
          <div style={{
            textAlign: 'center',
            marginTop: '25px',
            color: '#cbd5e1',
            fontSize: '0.95rem'
          }}>
            🔄 이 사이클을 반복하며 성장합니다
          </div>
        </div>

        {/* 섹션 5: 실습 - 청사진 만들기 */}
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
            <Rocket size={30} /> 실습: 나만의 1인 기업 청사진 만들기
          </h3>

          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '30px',
            borderRadius: '16px',
            marginBottom: '25px'
          }}>
            <h4 style={{ color: '#ffd60a', margin: '0 0 20px 0' }}>📝 에제르 AI 청사진 도구 사용법</h4>
            <ol style={{ color: '#e2e8f0', margin: 0, paddingLeft: '20px', lineHeight: '2.2' }}>
              <li><strong>관심 분야</strong> 입력: 요리, 영어, 반려견, 교육 등</li>
              <li><strong>경험/배경</strong> 입력: 10년차 선생님, 전직 요리사 등</li>
              <li><strong>청사진 생성</strong> 버튼 클릭</li>
              <li>AI가 4단계 성장 계획을 자동 생성!</li>
              <li><strong>PDF 다운로드</strong>로 저장하기</li>
            </ol>
          </div>

          <a
            href="https://www.ezerai.xyz/blueprint"
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
            🚀 청사진 만들러 가기 (에제르 AI)
          </a>

          <p style={{ 
            color: '#e2e8f0', 
            textAlign: 'center', 
            marginTop: '20px',
            fontSize: '0.9rem'
          }}>
            * 강의 수강생은 무료로 사용 가능합니다
          </p>
        </div>

        {/* 핵심 메시지 */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f, #0d1b2a)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '40px',
          textAlign: 'center',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🦄</div>
          <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>
            1인 기업 유니콘을 향해
          </h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.9', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 20px' }}>
            샘 올트먼(ChatGPT CEO)이 말한 것처럼,<br/>
            지금은 <strong style={{ color: '#ffd60a' }}>1인 기업의 전성시대</strong>입니다.<br/><br/>
            혼자서 AI 기업을 만들고, 유니콘 기업이 될 수 있는 시대.<br/>
            <strong style={{ color: '#22c55e' }}>여러분도 할 수 있습니다.</strong>
          </p>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
            "꿈을 멀리 보세요. 한 걸음 한 걸음 함께 걸어갑시다." - Jay
          </p>
        </div>

        {/* 💬 Day 2 토론방 */}
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
              color: '#f43f5e', 
              fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', 
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: 0
            }}>
              <MessageCircle size={26} /> Day 2 토론방
            </h3>
            <button
              onClick={() => navigate('/community/step2')}
              style={{
                background: 'rgba(244, 63, 94, 0.2)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: '#f43f5e',
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
                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
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
                  placeholder="이 강의에 대한 생각이나 질문을 남겨보세요..."
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
                        ? 'linear-gradient(135deg, #f43f5e, #ec4899)' 
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
                    background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
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
              onClick={() => navigate('/community/step2')}
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
                : 'linear-gradient(135deg, #f43f5e, #ec4899)',
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
                : '0 8px 25px rgba(244, 63, 94, 0.4)'
            }}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle size={24} /> Day 2 완료!
              </>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <>
                <PlayCircle size={24} /> Day 2 완료하기
              </>
            )}
          </button>
          
          {onNext && (
            <button
              onClick={onNext}
              style={{
                background: 'linear-gradient(135deg, #1e3a5f, #0d1b2a)',
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
              Day 3으로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day2Page;

