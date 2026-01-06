import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Target, MessageCircle, Heart, Send, User, Volume2, Wand2, Video, Code, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../../../services/azureTableService';

interface Day8PageProps {
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

const DAY_COURSE_ID = 'ai-building-day8';

const Day8Page: React.FC<Day8PageProps> = ({ onBack, onNext }) => {
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

          if (progress && progress.completedDays.includes(8)) {
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
      const learningTimeMinutes = 80;

      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        8,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 8 완료! 다음 강의로 이동하세요!');
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

  // 영상 섹션 데이터 (4개)
  const videoSections = [
    {
      id: 'intro',
      icon: <Video size={20} color="#fbbf24" />,
      title: '🎙️ 인트로: 음성 생성 개요',
      badge: '개요',
      badgeColor: '#3b82f6',
      description: '콘텐츠 음성의 4가지 방법 소개: 직접 녹음, 목소리 변환, Text-to-Speech, AI 음성 복제',
      vimeoUrl: 'https://player.vimeo.com/video/1151323888?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      id: 'transform',
      icon: <Wand2 size={20} color="#fbbf24" />,
      title: '🎭 스피치 트랜스폼 (목소리 변환)',
      badge: '변환',
      badgeColor: '#8b5cf6',
      description: '녹음한 목소리를 헬륨 보이스, 캐릭터 음성 등으로 변환하는 방법',
      vimeoUrl: 'https://player.vimeo.com/video/1151496800?badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      id: 'google-tts-studio',
      icon: <Code size={20} color="#fbbf24" />,
      title: '🤖 Google AI Studio에서 TTS',
      badge: 'AI Studio',
      badgeColor: '#22c55e',
      description: 'Google AI Studio에서 간단하게 Text-to-Speech 사용하기',
      vimeoUrl: 'https://player.vimeo.com/video/1151759902?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      id: 'google-tts-opal',
      icon: <Sparkles size={20} color="#fbbf24" />,
      title: '🌟 Google OPAL에서 TTS 에이전트',
      badge: 'OPAL',
      badgeColor: '#06b6d4',
      description: 'Google OPAL로 대본과 오디오를 한번에 생성하는 에이전트 만들기',
      vimeoUrl: 'https://player.vimeo.com/video/1151904849?badge=0&autopause=0&player_id=0&app_id=58479',
    },
    {
      id: 'elevenlabs',
      icon: <Sparkles size={20} color="#fbbf24" />,
      title: '🎤 ElevenLabs + 내 목소리 AI 모델',
      badge: '음성 복제',
      badgeColor: '#f59e0b',
      description: 'ElevenLabs로 다양한 AI 음성 사용 & 내 목소리를 학습시켜 AI 모델 만들기',
      vimeoUrl: '', // 영상 URL 추가 예정
    }
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
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
              8
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.6rem', margin: 0, fontWeight: '700' }}>
                AI 음성 생성의 정석
              </h1>
              <p style={{ color: '#fbbf24', margin: '8px 0 0 0', fontSize: '1rem' }}>
                콘텐츠에 생명을 불어넣는 4가지 음성 제작 방법
              </p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                {isDayCompleted && (
                  <span style={{ color: '#ffd60a', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
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
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <h2 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#fbbf24',
            marginBottom: '20px',
            fontSize: '1.3rem',
            fontWeight: '700'
          }}>
            <Target size={24} /> 오늘의 학습 목표
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              '🎙️ 콘텐츠 제작에 필요한 4가지 음성 방법 이해하기',
              '🎭 목소리 변환 (Speech Transform) 사용법 익히기',
              '🤖 Google TTS (Colab + OPAL)로 텍스트를 음성으로 변환하기',
              '🎤 ElevenLabs로 내 목소리 AI 모델 만들기'
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
                  color: '#fbbf24',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                {obj}
              </div>
            ))}
          </div>
        </div>

        {/* 4개 영상 섹션 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          {videoSections.map((section, index) => (
            <div key={section.id}>
              {/* 섹션 헤더 */}
              <div style={{
                padding: '16px 24px',
                background: index === 0
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.15))'
                  : index === 1
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.15))'
                    : index === 2
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.15))'
                      : 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.15))',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {section.icon}
                  <span style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: '700' }}>{section.title}</span>
                </div>
                <span style={{
                  background: section.badgeColor,
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  {section.badge}
                </span>
              </div>

              {/* 영상 영역 */}
              <div style={{ padding: '20px' }}>
                <p style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '16px', lineHeight: '1.7' }}>
                  {section.description}
                </p>

                <div style={{
                  position: 'relative',
                  paddingTop: '56.25%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: `2px solid ${section.badgeColor}40`,
                  background: 'rgba(0,0,0,0.3)'
                }}>
                  {section.vimeoUrl ? (
                    <iframe
                      src={section.vimeoUrl}
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      title={section.title}
                    />
                  ) : (
                    // 영상 준비중 플레이스홀더
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                        {index === 0 ? '🎙️' : index === 1 ? '🎭' : index === 2 ? '🤖' : '🎤'}
                      </div>
                      <h3 style={{ color: '#fbbf24', fontSize: '1.2rem', margin: '0 0 8px 0', textAlign: 'center' }}>
                        {section.title.replace(/^[^\s]+\s/, '')}
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>영상 준비중...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🎯 음성 생성 4가지 방법 요약 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(30, 58, 138, 0.15))',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <h3 style={{
            color: '#e2e8f0',
            fontSize: '1.4rem',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Volume2 size={24} color="#fbbf24" /> 콘텐츠 음성 제작 4가지 방법 정리
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { num: 1, icon: '🎙️', title: '직접 녹음', desc: '마이크로 내 목소리 녹음', color: '#3b82f6' },
              { num: 2, icon: '🎭', title: '스피치 트랜스폼', desc: '녹음한 목소리 변환/필터', color: '#8b5cf6' },
              { num: 3, icon: '🤖', title: 'Google TTS', desc: '텍스트 → 음성 (무료)', color: '#22c55e' },
              { num: 4, icon: '🎤', title: 'ElevenLabs', desc: '내 목소리 AI 복제', color: '#f59e0b' }
            ].map((method) => (
              <div key={method.num} style={{
                background: `linear-gradient(135deg, ${method.color}20, ${method.color}10)`,
                padding: '20px',
                borderRadius: '14px',
                border: `2px solid ${method.color}40`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{method.icon}</div>
                <div style={{
                  background: method.color,
                  color: 'white',
                  padding: '2px 10px',
                  borderRadius: '10px',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}>
                  방법 {method.num}
                </div>
                <h4 style={{ color: 'white', margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '700' }}>{method.title}</h4>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>{method.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 🔗 유용한 링크 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h3 style={{
            color: '#fbbf24',
            fontSize: '1.2rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            🔗 유용한 링크
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🟢</span>
              <div>
                <div style={{ color: '#22c55e', fontWeight: '600', fontSize: '0.95rem' }}>Google AI Studio</div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>OPAL TTS 사용</div>
              </div>
            </a>

            <a
              href="https://colab.research.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📓</span>
              <div>
                <div style={{ color: '#3b82f6', fontWeight: '600', fontSize: '0.95rem' }}>Google Colab</div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>TTS 코드 실습</div>
              </div>
            </a>

            <a
              href="https://elevenlabs.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🎤</span>
              <div>
                <div style={{ color: '#f59e0b', fontWeight: '600', fontSize: '0.95rem' }}>ElevenLabs</div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>음성 복제 AI</div>
              </div>
            </a>
          </div>
        </div>

        {/* 토론 섹션 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <h3 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#fbbf24',
            marginBottom: '20px',
            fontSize: '1.2rem'
          }}>
            <MessageCircle size={24} /> Day 8 토론방
          </h3>

          {/* 댓글 작성 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="음성 생성에 대한 경험이나 질문을 공유해주세요! 🎙️"
              style={{
                width: '100%',
                minHeight: '100px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '15px',
                color: 'white',
                fontSize: '0.95rem',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={handleAddComment}
              disabled={isSubmitting || !newComment.trim()}
              style={{
                marginTop: '12px',
                background: isSubmitting ? '#64748b' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Send size={18} />
              {isSubmitting ? '작성 중...' : '댓글 작성'}
            </button>
          </div>

          {/* 댓글 목록 */}
          {isLoadingPosts ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              댓글을 불러오는 중...
            </div>
          ) : discussionPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요! 💬
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {discussionPosts.map((post) => (
                <div key={post.id} style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '12px',
                  padding: '18px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <User size={18} color="white" />
                      </div>
                      <div>
                        <div style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem' }}>{post.author}</div>
                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{formatTime(post.createdAt)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: post.isLiked ? '#f43f5e' : '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <Heart size={18} fill={post.isLiked ? '#f43f5e' : 'none'} />
                      {post.likes}
                    </button>
                  </div>
                  <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.7', fontSize: '0.95rem' }}>
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Step 1 커뮤니티 바로가기 */}
          <div
            onClick={() => navigate('/community/step1')}
            style={{
              marginTop: '20px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MessageCircle size={20} color="#fbbf24" />
              <span style={{ color: '#e2e8f0' }}>Step 1 전체 커뮤니티에서 더 많은 이야기 나누기</span>
            </div>
            <span style={{ color: '#fbbf24' }}>→</span>
          </div>
        </div>

        {/* 완료 버튼 */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '40px' }}>
          <button
            onClick={handleCompleteDay}
            disabled={isCompletingDay || isDayCompleted}
            style={{
              background: isDayCompleted
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              padding: '18px 50px',
              borderRadius: '15px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: isDayCompleted ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: isDayCompleted
                ? '0 8px 25px rgba(34, 197, 94, 0.4)'
                : '0 8px 25px rgba(245, 158, 11, 0.4)',
              transition: 'all 0.3s'
            }}
          >
            {isDayCompleted ? (
              <><CheckCircle size={24} /> Day 8 완료!</>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <><PlayCircle size={24} /> Day 8 완료하기</>
            )}
          </button>

          {onNext && (
            <button
              onClick={onNext}
              style={{
                background: 'linear-gradient(135deg, #1e3a5f, #0d1b2a)',
                color: 'white',
                border: '2px solid rgba(245, 158, 11, 0.3)',
                padding: '18px 40px',
                borderRadius: '15px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              Day 9로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day8Page;
