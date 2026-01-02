import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen, ExternalLink, Lightbulb, Target, MessageCircle, Heart, Send, User, Youtube, Image, Settings, Palette, Zap, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../../../services/azureTableService';

interface Day5PageProps {
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

const DAY_COURSE_ID = 'ai-building-day5';

// 캐릭터 생성 프롬프트
const CHARACTER_PROMPT = `A cute, highly stylized 3D caricature of [여기에 원하는 캐릭터 설명], featuring a slightly oversized head, big glossy eyes, and soft rounded facial features. Rendered in a clean Pixar-inspired style with smooth textures and gentle ambient lighting. Subtle shadows and a simple pastel background keep the focus entirely on the character's charm.`;

// 페라리 색상 테마
const COLORS = {
  ferrariRed: '#DC143C',
  ferrariRedLight: '#ff3b5c',
  navy: '#0d1b2a',
  navyLight: '#1b263b',
  yellow: '#ffd60a',
  yellowDark: '#e5c100',
  white: '#ffffff',
  lightGray: '#e2e8f0',
  text: '#f1f5f9'
};

const Day5Page: React.FC<Day5PageProps> = ({ onBack, onNext }) => {
  const navigate = useNavigate();
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

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

          if (progress && progress.completedDays.includes(5)) {
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
        5,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 5 완료! Part 1 완료! 다음 강의로 이동하세요!');
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

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(CHARACTER_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
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
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)` }}>
      {/* 헤더 */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)`,
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `2px solid ${COLORS.ferrariRed}`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: `1px solid ${COLORS.yellow}`,
              color: COLORS.yellow,
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '15px',
              transition: 'all 0.2s',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={20} />
            강의 목록으로
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.ferrariRed}, ${COLORS.ferrariRedLight})`,
              width: '65px',
              height: '65px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '800',
              color: 'white',
              boxShadow: `0 8px 25px rgba(220, 20, 60, 0.5)`
            }}>
              5
            </div>
            <div>
              <h1 style={{ color: COLORS.white, fontSize: '1.6rem', margin: 0, fontWeight: '700' }}>
                AI 건물주가 되기: 유튜브 채널 만들기
              </h1>
              <p style={{ color: COLORS.yellow, margin: '8px 0 0 0', fontSize: '1rem', fontWeight: '500' }}>
                유튜브 채널 생성부터 설정까지 완벽 가이드
              </p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                {isDayCompleted && (
                  <span style={{ color: COLORS.yellow, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', fontWeight: '600' }}>
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
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: `2px solid ${COLORS.yellow}`
        }}>
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: COLORS.yellow, 
            marginBottom: '20px',
            fontSize: '1.3rem',
            fontWeight: '700'
          }}>
            <Target size={24} /> 오늘의 학습 목표
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              '유튜브 채널 = 디지털 건물 개념 이해하기',
              '제미나이(Gemini)를 AI 직원처럼 활용하기',
              '유튜브 채널 생성 및 프로필/배너 만들기',
              '채널 설정 (키워드, 카테고리, 언어) 완료하기'
            ].map((obj, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                color: COLORS.white,
                fontSize: '1rem'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: COLORS.ferrariRed,
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
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '30px',
          border: `1px solid ${COLORS.ferrariRed}`
        }}>
          <div style={{ 
            padding: '16px 24px',
            background: `linear-gradient(90deg, ${COLORS.ferrariRed}, ${COLORS.ferrariRedLight})`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '700'
          }}>
            <BookOpen size={22} /> 강의 영상
            </div>

          <div style={{ padding: '20px' }}>
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe 
                src="https://player.vimeo.com/video/1150760443?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                title="Day5 강의 - 건물주"
              />
            </div>
          </div>
        </div>

        {/* 섹션 1: 핵심 개념 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <h3 style={{ 
            color: COLORS.yellow, 
            fontSize: '1.3rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '700'
          }}>
            🏢 유튜브 채널 = 디지털 건물
          </h3>
          
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: COLORS.white, fontSize: '1.05rem', margin: '0 0 16px 0', lineHeight: '1.8' }}>
              유튜브 채널을 만드는 것은 <strong style={{ color: COLORS.yellow }}>건물 하나를 만드는 것</strong>과 같습니다!
            </p>
            <ul style={{ color: COLORS.lightGray, margin: 0, paddingLeft: '20px', lineHeight: '2.2', fontSize: '1rem' }}>
              <li>건물을 만들면 → <strong style={{ color: COLORS.yellow }}>월세</strong>처럼 계속 수익이 들어옴</li>
              <li>콘텐츠 하나 만들면 → <strong style={{ color: COLORS.yellow }}>광고 수익</strong>이 계속 쌓임</li>
              <li>콘텐츠가 쌓이면 → 일하지 않아도 <strong style={{ color: COLORS.yellow }}>수익 증가</strong></li>
            </ul>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { emoji: '🏗️', title: '건물 만들기', desc: '= 채널 생성' },
              { emoji: '🪑', title: '인테리어', desc: '= 프로필/배너' },
              { emoji: '🏠', title: '방 채우기', desc: '= 콘텐츠 업로드' }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: `rgba(220, 20, 60, 0.15)`,
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${COLORS.ferrariRed}`
              }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>{item.emoji}</div>
                <p style={{ color: COLORS.yellow, fontWeight: '700', margin: '0 0 4px 0', fontSize: '1rem' }}>{item.title}</p>
                <p style={{ color: COLORS.lightGray, fontSize: '0.9rem', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 섹션 2: AI 직원 활용 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <h3 style={{ 
            color: COLORS.yellow, 
            fontSize: '1.3rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '700'
          }}>
            🤖 제미나이 = 나의 AI 직원
          </h3>

          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: COLORS.white, fontSize: '1rem', margin: '0 0 16px 0', lineHeight: '1.8' }}>
              인공지능을 <strong style={{ color: COLORS.yellow }}>직원처럼</strong> 활용하세요!
            </p>
            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                { role: '유튜브 PD', desc: '채널 기획, 콘텐츠 전략 수립' },
                { role: '디자이너', desc: '프로필, 배너, 썸네일 제작' },
                { role: '마케터', desc: '키워드 분석, SEO 최적화' },
                { role: '비서', desc: '채널 설정, 정보 입력 도우미' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(0,0,0,0.25)',
                  padding: '14px 18px',
                  borderRadius: '10px'
                }}>
                  <div style={{
                    background: COLORS.ferrariRed,
                    padding: '8px 14px',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.role}
                  </div>
                  <span style={{ color: COLORS.white, fontSize: '0.95rem' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: `linear-gradient(135deg, rgba(255, 214, 10, 0.15), rgba(255, 214, 10, 0.05))`,
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${COLORS.yellow}`
          }}>
            <h4 style={{ color: COLORS.yellow, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: '700' }}>
              <Lightbulb size={20} /> 왜 Gemini를 쓰나요?
            </h4>
            <p style={{ color: COLORS.white, margin: 0, lineHeight: '1.8', fontSize: '1rem' }}>
              <strong style={{ color: COLORS.yellow }}>유튜브가 구글 거잖아요!</strong><br/>
              Gemini는 유튜브의 데이터를 가장 많이 가지고 있어서,<br/>
              유튜브 채널 관련 질문에 가장 정확한 답변을 줍니다.
            </p>
          </div>
        </div>

        {/* 섹션 3: 유튜브 채널 생성 단계 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <h3 style={{ 
            color: COLORS.yellow, 
            fontSize: '1.3rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '700'
          }}>
            <Youtube size={24} /> 유튜브 채널 생성 단계
          </h3>

          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { step: 1, title: '구글 로그인', desc: 'YouTube 접속 → 오른쪽 위 프로필 → Switch Account → View All Channels' },
              { step: 2, title: 'Create Channel', desc: '채널 이름과 핸들(@username) 설정' },
              { step: 3, title: '프로필 사진', desc: 'Gemini로 캐릭터 생성 후 업로드' },
              { step: 4, title: 'YouTube Studio', desc: '채널 관리 페이지에서 상세 설정' }
            ].map((item) => (
              <div key={item.step} style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '20px',
                borderRadius: '12px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  background: `linear-gradient(135deg, ${COLORS.ferrariRed}, ${COLORS.ferrariRedLight})`,
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  color: 'white',
                  flexShrink: 0
                }}>
                  {item.step}
                </div>
                <div>
                  <h4 style={{ color: COLORS.yellow, margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '700' }}>{item.title}</h4>
                  <p style={{ color: COLORS.white, margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 섹션 4: 캐릭터/프로필 생성 프롬프트 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <h3 style={{ 
            color: COLORS.yellow, 
            fontSize: '1.3rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '700'
          }}>
            <Image size={24} /> 캐릭터 프로필 생성 프롬프트
          </h3>

          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '16px',
            border: `1px solid ${COLORS.yellow}`
          }}>
            <p style={{ color: COLORS.yellow, fontSize: '1rem', marginBottom: '12px', fontWeight: '600' }}>
              📋 아래 프롬프트를 복사해서 Gemini에 사용하세요!
            </p>
            <div style={{
              background: 'rgba(0,0,0,0.5)',
              padding: '18px',
              borderRadius: '10px',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: COLORS.white,
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {CHARACTER_PROMPT}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}>
              <button
                onClick={handleCopyPrompt}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: copiedPrompt ? COLORS.yellow : COLORS.ferrariRed,
                  border: 'none',
                  color: copiedPrompt ? COLORS.navy : 'white',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Copy size={18} /> {copiedPrompt ? '복사 완료!' : '프롬프트 복사하기'}
              </button>
              <a
                href="https://jaijung.notion.site/2c3b0dd7632380cba592ec1ae0571ba1"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  border: `1px solid ${COLORS.yellow}`,
                  color: COLORS.yellow,
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                <ExternalLink size={18} /> 노션에서 보기
              </a>
            </div>
          </div>

          <div style={{
            background: `linear-gradient(135deg, rgba(255, 214, 10, 0.15), rgba(255, 214, 10, 0.05))`,
            padding: '18px',
            borderRadius: '12px',
            border: `1px solid ${COLORS.yellow}`
          }}>
            <p style={{ color: COLORS.white, margin: 0, fontSize: '1rem', lineHeight: '1.8' }}>
              💡 <strong style={{ color: COLORS.yellow }}>사진이 없어도 OK!</strong><br/>
              "귀여운 남자 아기", "사랑스러운 강아지", "멋진 70대 여성" 등으로 원하는 캐릭터를 만들 수 있어요!
            </p>
          </div>
        </div>

        {/* 섹션 5: 채널 설정 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <h3 style={{ 
            color: COLORS.yellow, 
            fontSize: '1.3rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '700'
          }}>
            <Settings size={24} /> 채널 설정 (YouTube Studio)
          </h3>

          <p style={{ color: COLORS.white, marginBottom: '20px', fontSize: '1rem', lineHeight: '1.7' }}>
            유튜브 알고리즘이 채널의 정체성을 파악하는 <strong style={{ color: COLORS.yellow }}>주민등록증</strong> 같은 설정입니다!
          </p>

          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { title: '통화 설정 (Currency)', desc: '대한민국 원(KRW)으로 설정', path: 'Settings → General' },
              { title: '국가 & 키워드', desc: '거주 국가와 채널 키워드 설정 (알고리즘 학습용)', path: 'Settings → Channel → Basic Info' },
              { title: '아동용 콘텐츠 여부', desc: '아동용이 아니면 "No" 선택', path: 'Settings → Channel → Advanced' },
              { title: '업로드 기본값', desc: '제목 템플릿, 설명, 태그 미리 설정', path: 'Settings → Upload Defaults' },
              { title: '카테고리 & 언어', desc: '콘텐츠 카테고리와 영상 언어 설정', path: 'Settings → Upload Defaults → Advanced' }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '18px 20px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h4 style={{ color: COLORS.yellow, margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '700' }}>{item.title}</h4>
                  <p style={{ color: COLORS.lightGray, margin: 0, fontSize: '0.9rem' }}>{item.desc}</p>
                </div>
                <div style={{
                  background: COLORS.ferrariRed,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}>
                  {item.path}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(220, 20, 60, 0.2)',
            padding: '18px',
            borderRadius: '12px',
            marginTop: '16px',
            border: `1px solid ${COLORS.ferrariRed}`
          }}>
            <p style={{ color: COLORS.ferrariRedLight, margin: 0, fontSize: '1rem', fontWeight: '700' }}>
              ⚠️ 카테고리 설정이 중요한 이유
            </p>
            <p style={{ color: COLORS.white, margin: '10px 0 0 0', fontSize: '0.95rem', lineHeight: '1.7' }}>
              CPM이 높다고 다른 카테고리로 설정하면 안 됩니다!<br/>
              알고리즘이 잘못된 타겟에게 콘텐츠를 보내면, 시청자 이탈 → 채널 성장 저하
            </p>
          </div>
              </div>

        {/* 섹션 6: 배너 & 커스터마이제이션 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <h3 style={{ 
            color: COLORS.yellow, 
            fontSize: '1.3rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '700'
          }}>
            <Palette size={24} /> 배너 이미지 & 채널 꾸미기
          </h3>

          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <p style={{ color: COLORS.yellow, fontSize: '1rem', margin: '0 0 16px 0', fontWeight: '600' }}>
              📱 배너는 기기별로 다르게 보입니다!
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {[
                { device: 'TV', icon: '📺', desc: '전체 보임' },
                { device: 'PC', icon: '💻', desc: '중간 부분만' },
                { device: '모바일', icon: '📱', desc: '가운데만' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(0,0,0,0.25)',
                  padding: '18px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{item.icon}</div>
                  <p style={{ color: COLORS.yellow, margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '700' }}>{item.device}</p>
                  <p style={{ color: COLORS.lightGray, margin: 0, fontSize: '0.85rem' }}>{item.desc}</p>
              </div>
              ))}
            </div>
          </div>

          <div style={{
            background: `linear-gradient(135deg, rgba(255, 214, 10, 0.15), rgba(255, 214, 10, 0.05))`,
            padding: '18px',
            borderRadius: '12px',
            border: `1px solid ${COLORS.yellow}`
          }}>
            <p style={{ color: COLORS.white, margin: 0, fontSize: '1rem', lineHeight: '1.8' }}>
              💡 <strong style={{ color: COLORS.yellow }}>Gemini에게 배너 수정 요청하기:</strong><br/>
              "캐릭터와 텍스트를 모두 가운데로 모아줘", "마이크와 노트북 제거해줘"<br/>
              대화하듯이 요청하면 계속 수정해줍니다!
            </p>
          </div>
        </div>

        {/* 실습 미션 카드 */}
        <div style={{
          background: `linear-gradient(135deg, rgba(220, 20, 60, 0.2), rgba(220, 20, 60, 0.1))`,
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: `2px solid ${COLORS.ferrariRed}`
        }}>
          <h3 style={{ 
            color: COLORS.yellow, 
            fontSize: '1.4rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '800'
          }}>
            <Zap size={26} /> 오늘의 실습 미션
          </h3>

          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <ol style={{ color: COLORS.white, margin: 0, paddingLeft: '20px', lineHeight: '2.4', fontSize: '1rem' }}>
              <li><strong style={{ color: COLORS.yellow }}>유튜브 채널</strong> 새로 생성하기</li>
              <li><strong style={{ color: COLORS.yellow }}>Gemini로 캐릭터</strong> 프로필 사진 만들기</li>
              <li><strong style={{ color: COLORS.yellow }}>배너 이미지</strong> 만들어서 업로드하기</li>
              <li><strong style={{ color: COLORS.yellow }}>채널 설정</strong> 완료 (국가, 키워드, 카테고리)</li>
              <li>만든 채널 링크를 <strong style={{ color: COLORS.yellow }}>토론방에 공유</strong>하기!</li>
            </ol>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="https://studio.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: `linear-gradient(135deg, ${COLORS.ferrariRed}, ${COLORS.ferrariRedLight})`,
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 8px 25px rgba(220, 20, 60, 0.4)',
                flex: 1,
                minWidth: '200px'
              }}
            >
              <Youtube size={22} />
              YouTube Studio 열기
            </a>
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: COLORS.yellow,
                color: COLORS.navy,
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 8px 25px rgba(255, 214, 10, 0.4)',
                flex: 1,
                minWidth: '200px'
              }}
            >
              <ExternalLink size={20} />
              Gemini 열기
            </a>
          </div>

          <p style={{ 
            color: COLORS.lightGray, 
            textAlign: 'center', 
            marginTop: '18px',
            fontSize: '0.95rem'
          }}>
            * 만든 채널 링크를 아래 토론방에 자랑해주세요! 🎉
          </p>
        </div>

        {/* 핵심 메시지 */}
        <div style={{
          background: `linear-gradient(135deg, rgba(255, 214, 10, 0.1), rgba(255, 214, 10, 0.05))`,
          borderRadius: '20px',
          padding: '35px',
          marginBottom: '30px',
          textAlign: 'center',
          border: `2px solid ${COLORS.yellow}`
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏠</div>
          <h3 style={{ color: COLORS.yellow, fontSize: '1.5rem', marginBottom: '16px', fontWeight: '800' }}>
            축하합니다! AI 건물주가 되셨습니다!
          </h3>
          <p style={{ color: COLORS.white, lineHeight: '2', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto' }}>
            건물을 만들었으니, 이제 <strong style={{ color: COLORS.yellow }}>콘텐츠(방)를</strong> 채워야 해요.<br/>
            Part 2에서는 <strong style={{ color: COLORS.yellow }}>AI로 콘텐츠를 자동으로 만드는 방법</strong>을 배웁니다!
          </p>
          <p style={{ color: COLORS.lightGray, fontSize: '0.95rem', marginTop: '20px', fontStyle: 'italic' }}>
            "무료로 AI 건물을 만드는 게 좋지 않습니까?" - Jay
          </p>
        </div>

        {/* 💬 Day 5 토론방 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '20px',
          padding: 'clamp(20px, 5vw, 30px)',
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.15)'
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
              color: COLORS.yellow, 
              fontSize: '1.3rem', 
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: 0,
              fontWeight: '700'
            }}>
              <MessageCircle size={24} /> Day 5 토론방
            </h3>
            <button
              onClick={() => navigate('/community/step1')}
              style={{
                background: COLORS.ferrariRed,
                border: 'none',
                color: 'white',
                padding: '10px 18px',
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
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: 'clamp(14px, 3vw, 20px)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: `linear-gradient(135deg, ${COLORS.ferrariRed}, ${COLORS.ferrariRedLight})`,
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
                  placeholder="만든 채널 링크를 공유해주세요! 🎉"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.08)',
                    border: `1px solid ${COLORS.yellow}`,
                    borderRadius: '12px',
                    padding: '14px 16px',
                    color: COLORS.white,
                    fontSize: '0.95rem',
                    resize: 'none',
                    minHeight: '60px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmitting}
                    style={{
                      background: newComment.trim() && !isSubmitting
                        ? `linear-gradient(135deg, ${COLORS.ferrariRed}, ${COLORS.ferrariRedLight})` 
                        : 'rgba(100,100,100,0.3)',
                      border: 'none',
                      color: 'white',
                      padding: '12px 22px',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isLoadingPosts ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '30px',
                color: COLORS.lightGray
              }}>
                ⏳ 토론 내용을 불러오는 중...
              </div>
            ) : discussionPosts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '30px',
                color: COLORS.lightGray,
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px'
              }}>
                💬 아직 토론이 없습니다. 만든 채널을 첫 번째로 공유해보세요!
              </div>
            ) : discussionPosts.map((post) => (
              <div key={post.id} style={{
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                padding: 'clamp(14px, 3vw, 20px)'
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
                    background: `linear-gradient(135deg, ${COLORS.ferrariRed}, ${COLORS.ferrariRedLight})`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'white'
                  }}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div style={{ color: COLORS.yellow, fontWeight: '600', fontSize: '0.95rem' }}>
                      {post.author}
                    </div>
                    <div style={{ color: COLORS.lightGray, fontSize: '0.8rem' }}>
                      {formatTime(post.createdAt)}
          </div>
        </div>
      </div>
                <p style={{ 
                  color: COLORS.white, 
                  fontSize: '0.95rem', 
                  lineHeight: '1.7',
                  margin: '0 0 12px 0'
                }}>
                  {post.content}
                </p>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{
                    background: post.isLiked ? `rgba(220, 20, 60, 0.2)` : 'transparent',
                    border: post.isLiked ? `1px solid ${COLORS.ferrariRed}` : '1px solid rgba(255,255,255,0.2)',
                    color: post.isLiked ? COLORS.ferrariRedLight : COLORS.lightGray,
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '500'
                  }}
                >
                  <Heart size={14} fill={post.isLiked ? COLORS.ferrariRedLight : 'none'} /> {post.likes}
                </button>
              </div>
            ))}
        </div>

          {/* 더보기 */}
          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <button
              onClick={() => navigate('/community/step1')}
              style={{
                background: 'transparent',
                border: `1px solid ${COLORS.yellow}`,
                color: COLORS.yellow,
                padding: '12px 28px',
                borderRadius: '12px',
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              💬 더 많은 토론 보기
            </button>
          </div>
        </div>

        {/* 완료 버튼 */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleCompleteDay}
            disabled={isCompletingDay || isDayCompleted}
            style={{
              background: isDayCompleted 
                ? COLORS.yellow
                : `linear-gradient(135deg, ${COLORS.ferrariRed}, ${COLORS.ferrariRedLight})`,
              color: isDayCompleted ? COLORS.navy : 'white',
              border: 'none',
              padding: '18px 45px',
              borderRadius: '14px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: isDayCompleted ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: isDayCompleted 
                ? '0 6px 20px rgba(255, 214, 10, 0.4)'
                : '0 6px 20px rgba(220, 20, 60, 0.4)'
            }}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle size={22} /> Day 5 완료!
              </>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <>
                <PlayCircle size={22} /> Day 5 완료하기
              </>
            )}
          </button>
          
          {onNext && (
            <button
              onClick={onNext}
              style={{
                background: COLORS.yellow,
                color: COLORS.navy,
                border: 'none',
                padding: '18px 45px',
                borderRadius: '14px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 6px 20px rgba(255, 214, 10, 0.4)'
              }}
            >
              Part 2 시작 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day5Page;
