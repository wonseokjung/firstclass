import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen, ExternalLink, Lightbulb, Target, MessageCircle, Heart, Send, User, Sparkles, Palette, Code, Key, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../../../services/azureTableService';

interface Day6PageProps {
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

const DAY_COURSE_ID = 'ai-building-day6';

const Day6Page: React.FC<Day6PageProps> = ({ onBack, onNext }) => {
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

          if (progress && progress.completedDays.includes(6)) {
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
        6,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 6 완료! 다음 강의로 이동하세요!');
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0f1a 0%, #1a1f2e 100%)' }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #0d1b2a 100%)',
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
              background: 'linear-gradient(135deg, #e5c100, #d97706)',
              width: '65px',
              height: '65px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '800',
              color: 'white',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)'
            }}>
              6
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.6rem', margin: 0, fontWeight: '700' }}>
                프롬프트 엔지니어링 & 이미지 생성 AI
              </h1>
              <p style={{ color: '#e2e8f0', margin: '8px 0 0 0', fontSize: '1rem' }}>
                Google Colab으로 나노 바나나 마스터하기
              </p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                  <Clock size={16} /> 약 70분
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
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: '#e5c100', 
            marginBottom: '20px',
            fontSize: '1.3rem',
            fontWeight: '700'
          }}>
            <Target size={24} /> 오늘의 학습 목표
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              '이미지 생성 AI의 원리와 기초 이해하기',
              'Google Colab 사용법 익히기',
              '나노 바나나로 이미지 생성 & 편집하기',
              'API 키 설정 및 프롬프트 엔지니어링 실습'
            ].map((obj, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                color: '#cbd5e1',
                fontSize: '1rem'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#e5c100',
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
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ 
            padding: '16px 24px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#e5c100',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            <BookOpen size={20} /> 강의 영상
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe 
                src="https://player.vimeo.com/video/1149991512?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                title="Day6 강의 - 프롬프트 엔지니어링"
              />
            </div>
          </div>
        </div>

        {/* 섹션 1: 드디어 실습! */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h3 style={{ 
            color: '#e2e8f0', 
            fontSize: '1.2rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🎬 드디어 실습으로 들어갑니다!
          </h3>
          
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', margin: '0 0 16px 0', lineHeight: '1.8' }}>
              신나죠? 제가 여러분들에게 드리고 싶은 능력은 아주 <strong style={{ color: '#e5c100' }}>코어적인 거예요</strong>.
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: 0, lineHeight: '1.8' }}>
              인공지능은 너무나도 빠르게 변하고 있죠. 새로운 것들이 계속 나옵니다. 
              그래서 여러분이 새로운 게 나올 때마다 배우는 게 중요한 게 아니라, 
              <strong style={{ color: '#e5c100' }}>새로운 게 나와도 "아 이거 이거겠구나" 하면서 바로 이해할 수 있는 힘</strong>이 필요해요.
            </p>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <p style={{ color: '#e5c100', fontWeight: '600', margin: '0 0 8px 0' }}>
              💡 원리와 기초를 알아야 합니다!
            </p>
            <p style={{ color: '#cbd5e1', margin: 0, lineHeight: '1.7' }}>
              그걸 알려면 이 <strong style={{ color: '#e5c100' }}>원리와 기초</strong>를 알아야 돼요. 
              제가 여러분들을 위해서 이런 걸 준비했습니다.
            </p>
          </div>
        </div>

        {/* 섹션 2: Google Colab이란? */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h3 style={{ 
            color: '#e2e8f0', 
            fontSize: '1.2rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Code size={22} /> Google Colab이란?
          </h3>

          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: '0 0 16px 0', lineHeight: '1.8' }}>
              콜랩은 원래 <strong style={{ color: '#e5c100' }}>주피터 노트북</strong>이라는 거에서 유래되었어요.
              연구원들이 코드를 실험해보고 싶을 때 여기다가 코드를 작성하고 결과물들이 나오는데,
              이런 게 그냥 나갔다가 다시 들어와도 <strong style={{ color: '#e5c100' }}>결과물들이 계속 보이거든요</strong>.
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, lineHeight: '1.8' }}>
              그러니까 이렇게 바꿨다가 저렇게 바꿨다가... "어 이거 고양이 요 파란색 눈으로 해보면 어떨까", 
              "노란색 눈으로 해보면 어떨까"... 이런 식으로 하면서 밑에다가 계속 계속 해 나아가면서 
              그 프롬프트마다의 특징들을 <strong style={{ color: '#e5c100' }}>한눈에 볼 수가 있는 거예요</strong>.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { icon: '📓', title: '노트북처럼 기록', desc: '실험 결과가 차곡차곡 쌓임' },
              { icon: '🔄', title: '프롬프트 비교', desc: '여러 결과를 한눈에 확인' },
              { icon: '💾', title: '자동 저장', desc: '나갔다 들어와도 그대로' }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(245, 158, 11, 0.08)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(245, 158, 11, 0.15)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
                <strong style={{ color: '#e5c100', fontSize: '1rem' }}>{item.title}</strong>
                <p style={{ color: '#e2e8f0', margin: '8px 0 0 0', fontSize: '0.85rem' }}>{item.desc}</p>
          </div>
        ))}
          </div>
        </div>

        {/* 섹션 3: 쫄지 말자! */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h3 style={{ 
            color: '#e2e8f0', 
            fontSize: '1.2rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            💪 쫄지 말자! 무서워하지 말자!
          </h3>

          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: '0 0 16px 0', lineHeight: '1.8' }}>
              이렇게 보면 막 어떤 코드들이 나오는 거잖아요. 이게 컴퓨터 코드거든요.
              이거 보면 "어려워 보기 싫어" 이게 바로 나온단 말이에요. 어쩔 수 없어요.
            </p>
            <p style={{ color: '#e5c100', fontSize: '1rem', fontWeight: '600', margin: '0 0 12px 0' }}>
              근데 요게 좀 보다 보면 익숙해져요! 🔥
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, lineHeight: '1.8' }}>
              왜 익숙해져야 되냐? 나중에 여러분들이 AI로 1인 기업을 만들 때, 바이브 코딩을 해야 될 때 
              이런 것들을 굉장히 많이 보게 될 텐데, 그 전에 좀 연습을 해두는 거예요.
            </p>
          </div>

          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <p style={{ color: '#3b82f6', fontWeight: '600', margin: '0 0 8px 0' }}>
              🌍 언어 배우는 것과 똑같아요
            </p>
            <p style={{ color: '#cbd5e1', margin: 0, lineHeight: '1.7', fontSize: '0.95rem' }}>
              중국어 처음 들었을 때, 일본어 처음 들었을 때, 영어 처음 배울 때 엄청 어려울 거 아니에요.
              근데 미국인들한테 영어는 쉬운 거잖아요. 왜 쉽겠어요? <strong style={{ color: '#3b82f6' }}>많이 연습했으니까 쉽겠죠!</strong>
            </p>
          </div>
        </div>

        {/* 섹션 4: API 키 설정 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h3 style={{ 
            color: '#e2e8f0', 
            fontSize: '1.2rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Key size={22} /> API 키 설정하기
          </h3>

          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '0 0 16px 0' }}>
              콜랩을 실행하려면 <strong style={{ color: '#e5c100' }}>Google API 키</strong>라는 이름으로 시크릿을 설정해야 돼요.
              우리 Day 5강에서 그 API 키 받았었던 거 기억나죠?
            </p>
            
            <ol style={{ color: '#cbd5e1', margin: 0, paddingLeft: '20px', lineHeight: '2.2', fontSize: '0.9rem' }}>
              <li>Google에서 <strong style={{ color: '#e5c100' }}>AI Studio</strong> 검색해서 들어가기</li>
              <li><strong style={{ color: '#e5c100' }}>Copy API Key</strong> 누르기</li>
              <li>다시 콜랩으로 돌아가서 왼쪽에 <strong style={{ color: '#e5c100' }}>🔑 열쇠</strong> 아이콘 클릭</li>
              <li>보안 비밀에 API 키 붙여넣기</li>
              <li><strong style={{ color: '#e5c100' }}>액세스 권한 부여</strong> 체크하기</li>
            </ol>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.15)'
          }}>
            <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem', lineHeight: '1.7' }}>
              💡 <strong style={{ color: '#e5c100' }}>왜 이렇게 귀찮게 해 놨어요?</strong><br/>
              구글에서 여러분들의 API 키를 보호하기 위해서 이렇게 한 거예요!
            </p>
          </div>
        </div>

        {/* 섹션 5: 나노 바나나 이미지 생성 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h3 style={{ 
            color: '#e2e8f0', 
            fontSize: '1.2rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Palette size={22} /> 나노 바나나 이미지 생성
          </h3>

          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#e2e8f0', margin: '0 0 16px 0', fontSize: '0.95rem' }}>
              🐱 프롬프트 예시:
            </p>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '16px',
              borderRadius: '10px',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              color: '#cbd5e1',
              lineHeight: '1.7',
              marginBottom: '16px'
            }}>
              "한국의 전통 한옥 마을에서 한복을 입은 샴 고양이를 만들어 주세요. 
              초록색 왼쪽 눈과 파란색 오른쪽 눈을 가지고 있습니다."
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, lineHeight: '1.7' }}>
              재생 버튼 누르면 이미지가 생성돼요! 다운받고 싶으면 오른쪽 클릭 → 이미지를 다른 이름으로 저장하면 됩니다.
            </p>
          </div>

          {/* 이미지 편집 기능 */}
          <div style={{
            background: 'rgba(236, 72, 153, 0.1)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(236, 72, 153, 0.2)',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#ec4899', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>
              ✨ 캐릭터 일관성 유지하며 편집하기
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0 0 12px 0', lineHeight: '1.7' }}>
              나노 바나나의 진짜 재미있는 기능! 위에서 만든 이미지를 편집할 수 있어요:
            </p>
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#e2e8f0',
              marginBottom: '12px'
            }}>
              "이 고양이를 제주도 바닷가에서 아이스크림 먹고 있는 모습으로 바꿔주세요"
            </div>
            <p style={{ color: '#ec4899', fontSize: '0.9rem', margin: 0, fontWeight: '500' }}>
              → 고양이는 그대로 두고 바닷가와 아이스크림만 생성됨! 🎉
            </p>
          </div>

          {/* 비율 조정 */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <h4 style={{ color: '#3b82f6', margin: '0 0 16px 0', fontSize: '1.05rem' }}>
              📐 화면 비율 조정하기
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              {[
                { ratio: '1:1', use: '정사각형' },
                { ratio: '16:9', use: '유튜브' },
                { ratio: '9:16', use: '쇼츠/틱톡' },
                { ratio: '4:3', use: '프레젠테이션' },
                { ratio: '3:4', use: '인스타그램' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(0,0,0,0.2)',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#3b82f6', fontWeight: '700', fontSize: '1rem' }}>{item.ratio}</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.8rem', marginTop: '4px' }}>{item.use}</div>
                </div>
              ))}
            </div>
            <p style={{ color: '#e2e8f0', fontSize: '0.85rem', margin: 0 }}>
              프롬프트에 <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#3b82f6' }}>aspect_ratio: "16:9"</code> 추가하면 됩니다!
            </p>
          </div>
        </div>

        {/* 섹션 6: 왜 이걸 알아야 하나요? */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h3 style={{ 
            color: '#e2e8f0', 
            fontSize: '1.2rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Lightbulb size={22} /> 멘토님, 이걸 왜 알아야 되나요?
          </h3>

          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: '0 0 16px 0', lineHeight: '1.8' }}>
              저희가 이제 <strong style={{ color: '#e5c100' }}>자동화 에이전트</strong>를 배울 거잖아요.
              Step 2와 Step 3에서 자동화 에이전트를 만들 건데, 이 자동화 에이전트란 뭐냐면
              결국 이 대화형 인공지능에서 조금 더 <strong style={{ color: '#e5c100' }}>개발적으로 바뀌는 거예요</strong>.
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, lineHeight: '1.8' }}>
              여러 개의 인공지능들을 한 번에 협업시켜야 되는데, 이 원리와 구조를 알아야 
              <strong style={{ color: '#e5c100' }}> 워크플로우</strong>라는 걸 잘 만들 수가 있어요.
              이 워크플로우를 잘 만들어야 우리가 자동화 에이전트를 만들 수 있어요!
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.25)'
          }}>
            <p style={{ color: '#e5c100', fontWeight: '700', margin: '0 0 12px 0', fontSize: '1.05rem' }}>
              🧠 지금 배우는 원리가 엄청난 힘이 됩니다!
            </p>
            <p style={{ color: '#cbd5e1', margin: 0, lineHeight: '1.8', fontSize: '0.95rem' }}>
              특히 Step 3에서 바이브 코딩을 배우면서 자동화 에이전트를 만들거든요.
              그때 지금 이러한 원리를 배우는 게 여러분들에게 엄청난 힘이 될 겁니다.
            </p>
          </div>
        </div>

        {/* 실습 미션 카드 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <h3 style={{ 
            color: '#e5c100', 
            fontSize: '1.3rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Zap size={24} /> 오늘의 실습 미션
          </h3>

          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <ol style={{ color: '#cbd5e1', margin: 0, paddingLeft: '18px', lineHeight: '2.2', fontSize: '0.95rem' }}>
              <li><strong>Google Colab</strong> 링크 들어가서 재생 버튼 누르기</li>
              <li><strong>API 키</strong> 설정하기 (AI Studio에서 복사)</li>
              <li>프롬프트 넣어서 <strong>이미지 생성</strong>해보기</li>
              <li>생성된 이미지 <strong>편집</strong>해보기 (장소, 행동 바꾸기)</li>
              <li><strong>비율 조정</strong>해서 16:9, 9:16 만들어보기</li>
              <li>결과물을 아래 토론방에 <strong>공유</strong>!</li>
            </ol>
          </div>

          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#f87171', fontWeight: '600', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
              ⚠️ 이거 며칠 걸릴 수 있어요!
            </p>
            <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
              이번 강의를 하루 말고 한 2-3일 정도 잡고서 매일매일 쓱쓱쓱 보세요.
              우리가 옛날에 공부했던 것처럼!
            </p>
          </div>

          {/* 🍌 나노바나나 실습 링크 - 메인 CTA */}
          <a
            href="https://colab.research.google.com/drive/13EaU4hDOMJb4bNbL0-x2XEFUGXt6OyhU?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #e5c100, #ea580c)',
              color: 'white',
              padding: '20px 32px',
              borderRadius: '16px',
              fontSize: '1.2rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(245, 158, 11, 0.4)',
              marginBottom: '16px',
              border: '2px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🍌</span>
            나노바나나 실습 노트북 열기
            <ExternalLink size={20} />
          </a>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)'
              }}
            >
              <Key size={18} />
              AI Studio (API 키 발급)
            </a>
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                color: 'white',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(139, 92, 246, 0.3)'
              }}
            >
              <Sparkles size={18} />
              Gemini 열기
            </a>
          </div>
        </div>

        {/* 핵심 메시지 */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'center',
          border: '1px solid rgba(245, 158, 11, 0.15)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🚀</div>
          <h3 style={{ color: '#e2e8f0', fontSize: '1.3rem', marginBottom: '12px' }}>
            여러분 이거 하는 거 아무도 몰라요. 진짜로!
          </h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.8', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
            이런 작은 실행들이 쌓이고 쌓여서 여러분들이 진짜 AI로 1인 기업을 만들고 
            새로운 비즈니스를 할 수 있도록 도와줄 거예요.<br/><br/>
            <strong style={{ color: '#e5c100' }}>AI 건물주 되기</strong>에서는 여러분들이 
            이 흔한 컴맹을 벗어나게 해줄 겁니다. 여러분들은 이제 컴퓨터를 잘하는 사람이 될 거예요!
          </p>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '20px' }}>
            "절 믿어보세요. 제가 있잖아요. 제가 도와드릴게요." - Jay
          </p>
        </div>

        {/* 💬 Day 6 토론방 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: 'clamp(20px, 5vw, 30px)',
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              color: '#e2e8f0', 
              fontSize: '1.2rem', 
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: 0
            }}>
              <MessageCircle size={22} /> Day 6 토론방
            </h3>
            <button
              onClick={() => navigate('/community/step1')}
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                color: '#e5c100',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              전체 커뮤니티 →
            </button>
          </div>

          {/* 댓글 입력 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            padding: 'clamp(12px, 3vw, 18px)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #e5c100, #d97706)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={18} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="오늘 만든 이미지나 프롬프트를 공유해주세요! 🎨"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    color: 'white',
                    fontSize: '0.9rem',
                    resize: 'none',
                    minHeight: '50px',
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
                        ? 'linear-gradient(135deg, #e5c100, #d97706)' 
                        : 'rgba(100,100,100,0.3)',
                      border: 'none',
                      color: 'white',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      cursor: newComment.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Send size={14} /> {isSubmitting ? '작성 중...' : '댓글 작성'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isLoadingPosts ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '30px',
                color: '#64748b'
              }}>
                ⏳ 토론 내용을 불러오는 중...
              </div>
            ) : discussionPosts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '30px',
                color: '#64748b',
                background: 'rgba(15, 23, 42, 0.3)',
                borderRadius: '12px'
              }}>
                💬 아직 토론이 없습니다. 첫 번째 댓글을 남겨보세요!
              </div>
            ) : discussionPosts.map((post) => (
              <div key={post.id} style={{
                background: 'rgba(15, 23, 42, 0.4)',
                borderRadius: '12px',
                padding: 'clamp(12px, 3vw, 18px)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #e5c100, #d97706)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '0.9rem' }}>
                      {post.author}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {formatTime(post.createdAt)}
                    </div>
                  </div>
                </div>
                <p style={{ 
                  color: '#e2e8f0', 
                  fontSize: '0.9rem', 
                  lineHeight: '1.6',
                  margin: '0 0 10px 0'
                }}>
                  {post.content}
                </p>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{
                    background: post.isLiked ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    border: post.isLiked ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                    color: post.isLiked ? '#f87171' : '#64748b',
                    padding: '5px 10px',
                    borderRadius: '16px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Heart size={12} fill={post.isLiked ? '#f87171' : 'none'} /> {post.likes}
                </button>
              </div>
            ))}
          </div>

          {/* 더보기 */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              onClick={() => navigate('/community/step1')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#64748b',
                padding: '10px 24px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              💬 더 많은 토론 보기
            </button>
          </div>
        </div>

        {/* 완료 버튼 */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleCompleteDay}
            disabled={isCompletingDay || isDayCompleted}
            style={{
              background: isDayCompleted 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'linear-gradient(135deg, #e5c100, #d97706)',
              color: 'white',
              border: 'none',
              padding: '16px 40px',
              borderRadius: '12px',
              fontSize: '1.05rem',
              fontWeight: '600',
              cursor: isDayCompleted ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: isDayCompleted 
                ? '0 6px 20px rgba(34, 197, 94, 0.3)'
                : '0 6px 20px rgba(245, 158, 11, 0.3)'
            }}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle size={20} /> Day 6 완료!
              </>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <>
                <PlayCircle size={20} /> Day 6 완료하기
              </>
            )}
          </button>
          
          {onNext && (
            <button
              onClick={onNext}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.15)',
                padding: '16px 40px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Day 7로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day6Page;
