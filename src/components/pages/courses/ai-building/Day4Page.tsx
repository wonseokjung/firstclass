import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen, ExternalLink, Lightbulb, Target, MessageCircle, Heart, Send, User, Search, Key, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../../../services/azureTableService';

interface Day4PageProps {
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

const DAY_COURSE_ID = 'ai-building-day4';

const Day4Page: React.FC<Day4PageProps> = ({ onBack, onNext }) => {
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

          if (progress && progress.completedDays.includes(4)) {
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
      const learningTimeMinutes = 60;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        4,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 4 완료! 다음 강의로 이동하세요!');
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
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
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
              4
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.6rem', margin: 0, fontWeight: '700' }}>
                니치한 주제 찾기: AI 주제 분석기
              </h1>
              <p style={{ color: '#94a3b8', margin: '8px 0 0 0', fontSize: '1rem' }}>
                유튜브 주제 분석기로 경쟁 낮은 블루오션 찾기
              </p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                  <Clock size={16} /> 약 60분
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
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: '#3b82f6', 
            marginBottom: '20px',
            fontSize: '1.3rem',
            fontWeight: '700'
          }}>
            <Target size={24} /> 오늘의 학습 목표
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              '대중적 vs 니치 전략의 차이 이해하기',
              'Gemini API & YouTube API 키 발급받기',
              '유튜브 주제 분석기 사용법 익히기',
              '나만의 니치한 주제 찾아내기'
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
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#3b82f6',
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
            background: 'rgba(59, 130, 246, 0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#3b82f6',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            <BookOpen size={20} /> 강의 영상
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe 
                src="https://player.vimeo.com/video/1149691638?badge=0&autopause=0&player_id=0&app_id=58479" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                title="Day4 강의"
              />
            </div>
          </div>
        </div>

        {/* 섹션 1: 지난 시간 복습 */}
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
            📝 지난 시간 복습
          </h3>
          
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 12px 0' }}>
              Day 3에서 배운 것들:
            </p>
            <ul style={{ color: '#cbd5e1', margin: 0, paddingLeft: '20px', lineHeight: '2' }}>
              <li>디지털 건물에 <strong style={{ color: '#3b82f6' }}>어떤 사람들</strong>이 살지 결정</li>
              <li><strong style={{ color: '#3b82f6' }}>인종, 나라</strong> 그리고 <strong style={{ color: '#3b82f6' }}>카테고리</strong> (뷰티, 테크, 교육)</li>
              <li>나라별/콘텐츠별 CPM 차이 이해</li>
          </ul>
          </div>

          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <p style={{ color: '#3b82f6', fontWeight: '600', margin: '0 0 8px 0' }}>
              🎯 오늘은 더 깊게 들어갑니다!
            </p>
            <p style={{ color: '#cbd5e1', margin: 0, lineHeight: '1.7' }}>
              큰 카테고리 안에서 <strong style={{ color: '#3b82f6' }}>아주 니치한(틈새) 주제</strong>를 찾아내는 방법을 배웁니다.
            </p>
          </div>
        </div>

        {/* 섹션 2: 대중적 vs 니치 */}
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
            📊 대중적 vs 니치 전략
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* 대중적 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h4 style={{ color: '#cbd5e1', margin: '0 0 12px 0', fontSize: '1.1rem' }}>🏬 대중적 전략</h4>
              <p style={{ color: '#94a3b8', margin: '0 0 12px 0', fontSize: '0.9rem', lineHeight: '1.6' }}>
                한국에서 교육에 관심 있는 <strong style={{ color: '#e2e8f0' }}>모든 사람들</strong>을 위한 콘텐츠
              </p>
              <ul style={{ color: '#64748b', margin: 0, paddingLeft: '18px', lineHeight: '1.7', fontSize: '0.85rem' }}>
                <li>수능/내신 대비 학습법</li>
                <li>토익/토플/오픽 고득점 전략</li>
                <li>자기계발 및 동기부여 강연</li>
              </ul>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '10px 12px',
                borderRadius: '8px',
                marginTop: '12px'
              }}>
                <p style={{ color: '#f87171', margin: 0, fontSize: '0.8rem', fontWeight: '500' }}>
                  ⚠️ 경쟁 매우 높음
                </p>
              </div>
            </div>

            {/* 니치 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <h4 style={{ color: '#3b82f6', margin: '0 0 12px 0', fontSize: '1.1rem' }}>🎯 니치 전략</h4>
              <p style={{ color: '#94a3b8', margin: '0 0 12px 0', fontSize: '0.9rem', lineHeight: '1.6' }}>
                교육 중에서도 <strong style={{ color: '#e2e8f0' }}>특정 관심사</strong>를 가진 사람들을 위한 콘텐츠
              </p>
              <ul style={{ color: '#64748b', margin: 0, paddingLeft: '18px', lineHeight: '1.7', fontSize: '0.85rem' }}>
                <li>특정 프로그래밍 언어 심층 튜토리얼</li>
                <li>고전 게임 분석 및 역사 강의</li>
                <li>희귀 악기 연주 및 제작 강좌</li>
              </ul>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '10px 12px',
                borderRadius: '8px',
                marginTop: '12px'
              }}>
                <p style={{ color: '#3b82f6', margin: 0, fontSize: '0.8rem', fontWeight: '500' }}>
                  ✅ 경쟁 낮음, 선점 가능
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(59, 130, 246, 0.08)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.15)'
          }}>
            <h4 style={{ color: '#3b82f6', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <Lightbulb size={18} /> Jay의 전략
            </h4>
            <p style={{ color: '#cbd5e1', margin: 0, lineHeight: '1.8', fontSize: '0.95rem' }}>
              저는 <strong style={{ color: '#e2e8f0' }}>한국 → 교육 → 인공지능 → 수익화 → 자동화 에이전트</strong><br/>
              이렇게 아주 작은 카테고리로 시작해서, 점점 카테고리를 넓혀가는 전략을 쓰고 있습니다.
            </p>
          </div>
        </div>

        {/* 섹션 3: 유튜브 주제 분석기 */}
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
            <Search size={22} /> 유튜브 주제 분석기
          </h3>

          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0 0 16px 0' }}>
              🤖 AI 에이전트가 분석해주는 것들:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {[
                { icon: '📊', title: '트렌드 분석' },
                { icon: '💰', title: 'CPM 분석' },
                { icon: '🏆', title: '경쟁 분석' },
                { icon: '🎯', title: '니치 추천' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(59, 130, 246, 0.08)',
                  padding: '12px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '6px' }}>{item.icon}</div>
                  <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.85rem' }}>{item.title}</p>
          </div>
        ))}
            </div>
          </div>

          {/* 분석 결과 예시 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#94a3b8', margin: '0 0 12px 0', fontSize: '0.9rem' }}>📋 분석 결과 예시:</p>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>수능 내신 대비 학습법</span>
                <span style={{ color: '#f87171', fontWeight: '500', fontSize: '0.85rem' }}>경쟁 높음</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>토익/토플 고득점 전략</span>
                <span style={{ color: '#f87171', fontWeight: '500', fontSize: '0.85rem' }}>경쟁 높음</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <span style={{ color: '#3b82f6', fontSize: '0.9rem' }}>고전 게임 분석 & 역사 강의</span>
                <span style={{ color: '#3b82f6', fontWeight: '500', fontSize: '0.85rem' }}>🎯 니치!</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <span style={{ color: '#3b82f6', fontSize: '0.9rem' }}>희귀 악기 연주 및 제작 강좌</span>
                <span style={{ color: '#3b82f6', fontWeight: '500', fontSize: '0.85rem' }}>🎯 니치!</span>
              </div>
            </div>
          </div>

          {/* 스크린샷 이미지 */}
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
          }}>
            <img 
              src="/images/aicitybuilder/유튜브니치주제찾기.png"
              alt="유튜브 니치 주제 찾기 분석기"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        </div>

        {/* 섹션 4: API 키 발급 가이드 */}
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
            <Key size={22} /> API 키 발급 가이드
          </h3>

          <p style={{ color: '#94a3b8', marginBottom: '20px', lineHeight: '1.7', fontSize: '0.95rem' }}>
            유튜브 주제 분석기를 사용하려면 <strong style={{ color: '#e2e8f0' }}>2개의 API 키</strong>가 필요합니다.
          </p>

          {/* Gemini API */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <h4 style={{ color: '#cbd5e1', margin: '0 0 12px 0', fontSize: '1rem' }}>
              1. Gemini API 키 (Google AI)
            </h4>
            <ol style={{ color: '#94a3b8', margin: 0, paddingLeft: '18px', lineHeight: '2', fontSize: '0.9rem' }}>
              <li>Google에서 <strong style={{ color: '#e2e8f0' }}>"AI Studio"</strong> 검색</li>
              <li>Google AI Studio 접속 후 로그인</li>
              <li><strong style={{ color: '#3b82f6' }}>Get API Key</strong> 클릭</li>
              <li>Create API Key → 프로젝트 생성</li>
              <li>생성된 API 키 복사</li>
            </ol>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '500',
                textDecoration: 'none',
                marginTop: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <ExternalLink size={14} /> Google AI Studio
            </a>
          </div>

          {/* YouTube API */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px'
          }}>
            <h4 style={{ color: '#cbd5e1', margin: '0 0 12px 0', fontSize: '1rem' }}>
              2. YouTube Data API v3
            </h4>
            <ol style={{ color: '#94a3b8', margin: 0, paddingLeft: '18px', lineHeight: '2', fontSize: '0.9rem' }}>
              <li>Google에서 <strong style={{ color: '#e2e8f0' }}>"YouTube Data API v3"</strong> 검색</li>
              <li>Google Cloud Console에서 프로젝트 선택/생성</li>
              <li><strong style={{ color: '#3b82f6' }}>Enable</strong> 클릭하여 API 활성화</li>
              <li>Credentials → Create Credentials → API Key</li>
              <li>생성된 YouTube API 키 복사</li>
            </ol>
            <div style={{
              background: 'rgba(59, 130, 246, 0.08)',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '12px'
            }}>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>
                💡 처음 가입 시 <strong style={{ color: '#3b82f6' }}>$300 무료 크레딧</strong>이 제공됩니다!
              </p>
            </div>
          </div>
        </div>

        {/* 실습 미션 카드 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <h3 style={{ 
            color: '#3b82f6', 
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
              <li><strong>Gemini API 키</strong> 발급받기</li>
              <li><strong>YouTube Data API v3</strong> 키 발급받기</li>
              <li>유튜브 주제 분석기에서 <strong>타겟 국가 + 카테고리</strong> 설정</li>
              <li><strong>대중적/니치/둘 다</strong> 비교 분석해보기</li>
              <li>나만의 <strong>니치한 주제</strong> 찾아서 토론방에 공유!</li>
            </ol>
          </div>

          <a
            href="https://www.ezerai.xyz/youtube-topic"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
            }}
          >
            <Search size={20} />
            유튜브 주제 분석기 사용하기
          </a>

          <p style={{ 
            color: '#64748b', 
            textAlign: 'center', 
            marginTop: '16px',
            fontSize: '0.85rem'
          }}>
            * 분석 결과를 아래 토론방에 공유해주세요!
          </p>
        </div>

        {/* 핵심 메시지 */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'center',
          border: '1px solid rgba(59, 130, 246, 0.15)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔬</div>
          <h3 style={{ color: '#e2e8f0', fontSize: '1.3rem', marginBottom: '12px' }}>
            돋보기로 햇빛을 모으듯이
          </h3>
          <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
            처음부터 큰 카테고리로 가면 분산됩니다.<br/>
            아주 <strong style={{ color: '#3b82f6' }}>작은 니치</strong>부터 선점하고,<br/>
            점점 옆 카테고리로 확장하세요.
          </p>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '16px' }}>
            "작은 카테고리를 완전히 선점하면, 알고리즘이 옆집 이웃에게 보내줍니다." - Jay
          </p>
        </div>

        {/* 💬 Day 4 토론방 */}
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
              <MessageCircle size={22} /> Day 4 토론방
            </h3>
            <button
              onClick={() => navigate('/community/step1')}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
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
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
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
                  placeholder="분석기로 찾은 니치 주제를 공유해주세요!"
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
                        ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
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
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
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
                  color: '#94a3b8', 
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
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
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
                : '0 6px 20px rgba(59, 130, 246, 0.3)'
            }}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle size={20} /> Day 4 완료!
              </>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <>
                <PlayCircle size={20} /> Day 4 완료하기
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
              Day 5로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day4Page;
