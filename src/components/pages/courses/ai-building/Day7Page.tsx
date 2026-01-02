import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, ExternalLink, Lightbulb, Target, MessageCircle, Heart, Send, User, Sparkles, Video, Code, Zap, Copy, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../../../services/azureTableService';

interface Day7PageProps {
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

const DAY_COURSE_ID = 'ai-building-day7';

// 예시 프롬프트들 (복붙만 해도 바로 사용 가능하도록 비율 정보 포함)
const EXAMPLE_PROMPTS = [
  {
    title: '자연 풍경 영상',
    prompt: '16:9 가로 영상으로 만들어줘. 해바라기 밭에서 노는 골든 리트리버의 클로즈업 샷. 햇살이 비치고 꽃잎이 바람에 흔들린다.',
    type: '16:9'
  },
  {
    title: '세로 영상 (숏츠용)',
    prompt: '9:16 세로 영상으로 만들어줘. 유니콘이 개선문 꼭대기에서 이륙하여 에펠탑으로 날아갑니다. 판타지 스타일, 마법 파티클 효과.',
    type: '9:16'
  },
  {
    title: '분위기 있는 조명',
    prompt: '16:9 가로 영상, 시네마틱 스타일. 드라마틱한 일몰을 배경으로 실루엣으로 보이는 고대 참나무. 황금빛 햇살이 나뭇가지 사이로 스며들고, 하늘은 오렌지에서 보라색으로 변합니다.',
    type: '16:9'
  }
];

// 🎬 시네마틱 고급 JSON 프롬프트
const CINEMATIC_JSON_PROMPT = `{
  "description": "Cinematic shot of a woman with short black hair leaning against a vintage red motorcycle at a weathered wooden bus stop in the desert. A gentle desert wind blows, causing her hair and leather jacket to move slightly. Dust motes dance in the golden hour light. The 'DESERT CROSSING' sign creaks in the wind. Heat haze shimmers in the distance. The atmosphere is solitary, gritty, and beautiful.",
  "style": "cinematic, road movie, gritty realism, 35mm film grain",
  "camera": "slow dolly zoom in (push-in) towards the woman, keeping the bus stop sign in frame",
  "lighting": "golden hour sunset, warm backlighting, dramatic shadows, cinematic lens flare",
  "environment": "vast open desert, dry brush, dilapidated wooden structure, dusty ground",
  "elements": [
    "Woman (subtle breathing, hair blowing in wind)",
    "Red Motorcycle (chrome reflecting sunset, slight engine vibration)",
    "Wooden Bus Stop (weathered texture, sign swaying slightly)",
    "Floating dust particles",
    "Tumbleweed rolling in background",
    "Heat haze on the horizon",
    "Lens flare from setting sun"
  ],
  "motion": "wind blowing hair and clothes, dust swirling, slow camera push, sign creaking movement",
  "ending": "The woman turns her head to look at the distant horizon as the sun dips lower",
  "text": "none",
  "keywords": [
    "biker",
    "desert sunset",
    "road trip",
    "melancholic",
    "freedom",
    "cinematic lighting",
    "motorcycle",
    "waiting"
  ]
}`;

const Day7Page: React.FC<Day7PageProps> = ({ onBack, onNext }) => {
  const navigate = useNavigate();
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

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

          if (progress && progress.completedDays.includes(7)) {
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
        7,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 7 완료! 다음 강의로 이동하세요!');
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

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(id);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
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
              background: 'linear-gradient(135deg, #1e3a8a, #0f2847)',
              width: '65px',
              height: '65px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '800',
              color: 'white',
              boxShadow: '0 8px 25px rgba(30, 58, 138, 0.4)'
            }}>
              7
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.6rem', margin: 0, fontWeight: '700' }}>
                AI 멘토 제이의 영상 생성의 정석
              </h1>
              <p style={{ color: '#e2e8f0', margin: '8px 0 0 0', fontSize: '1rem' }}>
                Google Veo로 텍스트만으로 영상 만들기
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
          border: '1px solid rgba(255, 214, 10, 0.3)'
        }}>
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: '#ffd60a', 
            marginBottom: '20px',
            fontSize: '1.3rem',
            fontWeight: '700'
          }}>
            <Target size={24} /> 오늘의 학습 목표
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              '🟢 초보: Gemini/OPAL에서 프롬프트로 쉽게 영상 만들기',
              '🟡 심화: Colab 코드로 상상과 AI의 갭 줄이기',
              '💰 API 비용 계산하는 방법 익히기',
              '🎬 이미지 → 영상 변환 & 영상 연장하기'
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
                  background: 'rgba(255, 214, 10, 0.2)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#ffd60a',
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
          {/* 📺 초보자 버전 영상 */}
          <div style={{ 
            padding: '16px 24px',
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(30, 58, 138, 0.15))',
            borderBottom: '1px solid rgba(255, 214, 10, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Video size={20} color="#ffd60a" />
              <span style={{ color: '#ffd60a', fontSize: '1.1rem', fontWeight: '700' }}>📺 초보자 버전</span>
            </div>
            <span style={{ 
              background: 'rgba(255, 214, 10, 0.2)', 
              color: '#ffd60a', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.75rem', 
              fontWeight: '700',
              border: '1px solid rgba(255, 214, 10, 0.3)'
            }}>
              무료 & 쉬움
            </span>
            </div>

          <div style={{ padding: '20px' }}>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '16px', lineHeight: '1.7' }}>
              <strong style={{ color: '#ffd60a' }}>Gemini / Google OPAL</strong>에서 프롬프트만 복붙해서 영상 만들기!<br/>
              코드 없이 누구나 쉽게 시작할 수 있어요.
            </p>
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255, 214, 10, 0.3)' }}>
              <iframe 
                src="https://player.vimeo.com/video/1150975948?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                title="Day7 강의 - 초보자 버전"
              />
          </div>
          </div>

          {/* 🟡 심화 버전 영상 */}
          <div style={{ 
            padding: '16px 24px',
            background: 'linear-gradient(135deg, rgba(255, 214, 10, 0.2), rgba(255, 214, 10, 0.1))',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            borderBottom: '1px solid rgba(255, 214, 10, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code size={20} color="#ffd60a" />
              <span style={{ color: '#ffd60a', fontSize: '1.1rem', fontWeight: '700' }}>🟡 심화 버전</span>
            </div>
            <span style={{ 
              background: '#ffd60a', 
              color: '#1e3a8a', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.75rem', 
              fontWeight: '700' 
            }}>
              Colab 코딩
            </span>
          </div>

          <div style={{ padding: '20px' }}>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '16px', lineHeight: '1.7' }}>
              <strong style={{ color: '#ffd60a' }}>Google Colab</strong>에서 코드로 세밀하게 컨트롤!<br/>
              영상 길이 조절, 이미지 합성, JSON 프롬프트 활용법을 배워요.
            </p>
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255, 214, 10, 0.3)' }}>
              <iframe 
                src="https://player.vimeo.com/video/1151002459?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                title="Day7 강의 - 심화 버전"
              />
            </div>
          </div>
        </div>

        {/* 🎯 두 가지 학습 방법 소개 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(30, 58, 138, 0.15))',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 214, 10, 0.3)'
        }}>
          <h3 style={{ 
            color: '#e2e8f0', 
            fontSize: '1.4rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Sparkles size={24} color="#ffd60a" /> 왜 심화 과정이 필요할까요?
          </h3>
          
          <div style={{
            background: 'rgba(30, 58, 138, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid rgba(30, 58, 138, 0.3)'
          }}>
            <p style={{ color: '#e2e8f0', fontSize: '1rem', margin: '0 0 12px 0', lineHeight: '1.8' }}>
              영상을 잘 만드는 방법은 <strong style={{ color: '#ffd60a' }}>우리의 상상</strong>과 
              <strong style={{ color: '#ffd60a' }}> AI가 학습한 것</strong>의 <strong style={{ color: '#ffd60a' }}>갭을 줄이는 과정</strong>이에요!
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0, lineHeight: '1.7' }}>
              그냥 "3D 캐릭터가 뛰어노는 영상 만들어줘"보다, 
              <strong style={{ color: '#ffd60a' }}> 이미지를 먼저 만들고</strong> 영상으로 변환하면 
              훨씬 더 원하는 결과를 얻을 수 있어요!
            </p>
          </div>
          
          <p style={{ color: '#cbd5e1', fontSize: '1rem', margin: '0 0 24px 0', lineHeight: '1.8' }}>
            <strong style={{ color: '#ffffff' }}>📺 초보자 버전</strong>부터 시작하고, 
            익숙해지면 <strong style={{ color: '#ffd60a' }}>🎬 심화 버전</strong>에 도전해보세요!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
{/* 쉬운 방법 카드 */}
            <div style={{
              background: 'rgba(30, 58, 138, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid rgba(255, 214, 10, 0.3)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '20px',
                background: '#ffd60a',
                color: '#1e3a8a',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                초보자 추천
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', marginTop: '8px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #1e3a8a, #0f2847)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={24} color="#ffd60a" />
                </div>
            <div>
                  <h4 style={{ color: '#ffd60a', margin: 0, fontSize: '1.1rem' }}>쉬운 방법</h4>
                  <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.85rem' }}>Gemini / Google OPAL</p>
              </div>
            </div>
              <ul style={{ color: '#e2e8f0', margin: 0, paddingLeft: '18px', lineHeight: '1.9', fontSize: '0.9rem' }}>
                <li>프롬프트만 복사해서 붙여넣기</li>
                <li>코드 필요 없음!</li>
                <li>바로 영상 생성 가능</li>
              </ul>
          </div>

            {/* 어려운 방법 카드 */}
            <div style={{
              background: 'rgba(255, 214, 10, 0.1)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid rgba(255, 214, 10, 0.3)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '20px',
                background: '#ffd60a',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}>
                고급 학습
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', marginTop: '8px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #1e3a8a, #0f2847)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Code size={24} color="white" />
                </div>
                <div>
                  <h4 style={{ color: '#ffd60a', margin: 0, fontSize: '1.1rem' }}>어려운 방법</h4>
                  <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.85rem' }}>Google Colab 코드 실습</p>
                </div>
              </div>
              <ul style={{ color: '#cbd5e1', margin: 0, paddingLeft: '18px', lineHeight: '1.9', fontSize: '0.9rem' }}>
                <li>코드로 원리 이해하기</li>
                <li>더 세밀한 컨트롤 가능</li>
                <li>자동화 에이전트 기초</li>
              </ul>
            </div>
        </div>
      </div>

        {/* ✅ 방법 1: 쉬운 방법 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '2px solid rgba(255, 214, 10, 0.3)'
        }}>
          <h3 style={{ 
            color: '#ffd60a', 
            fontSize: '1.3rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Sparkles size={24} /> 방법 1: 쉬운 방법 (Gemini / OPAL)
          </h3>
          
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', margin: '0 0 16px 0', lineHeight: '1.8' }}>
              가장 쉬운 방법이에요! <strong style={{ color: '#ffd60a' }}>프롬프트만 복사</strong>해서 
              Gemini나 Google OPAL에 붙여넣으면 바로 영상이 생성됩니다.
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: 0, lineHeight: '1.8' }}>
              코드를 전혀 몰라도 괜찮아요! 아래 프롬프트들을 복사해서 사용해보세요.
            </p>
        </div>

          {/* 예시 프롬프트들 */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#e2e8f0', marginBottom: '16px', fontSize: '1rem' }}>🎬 바로 사용할 수 있는 프롬프트:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {EXAMPLE_PROMPTS.map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(30, 58, 138, 0.15)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 214, 10, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#ffd60a', fontWeight: '600' }}>{item.title}</span>
                      <span style={{
                        background: 'rgba(255, 214, 10, 0.2)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        color: '#ffd60a'
                      }}>
                        {item.type}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.prompt, `prompt-${idx}`)}
                      style={{
                        background: copiedPrompt === `prompt-${idx}` ? '#ffd60a' : 'rgba(255, 214, 10, 0.2)',
                        border: 'none',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Copy size={14} />
                      {copiedPrompt === `prompt-${idx}` ? '복사됨!' : '복사'}
                    </button>
                  </div>
                  <p style={{ 
                    color: '#cbd5e1', 
                    margin: 0, 
                    fontSize: '0.9rem',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontFamily: 'inherit'
                  }}>
                    {item.prompt}
                  </p>
          </div>
        ))}
            </div>
          </div>

          {/* 🎬 시네마틱 JSON 프롬프트 (고급) */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(30, 58, 138, 0.15))',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '2px solid rgba(255, 214, 10, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1e3a8a, #0f2847)',
                padding: '8px',
                borderRadius: '10px'
              }}>
                <Film size={20} color="white" />
              </div>
            <div>
                <h4 style={{ color: '#ffd60a', margin: 0, fontSize: '1.1rem' }}>시네마틱 JSON 프롬프트</h4>
                <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.8rem' }}>영화 같은 퀄리티를 원할 때</p>
              </div>
              <span style={{
                marginLeft: 'auto',
                background: 'rgba(255, 214, 10, 0.2)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                color: '#ffd60a',
                fontWeight: '600'
              }}>
                PRO TIP
              </span>
            </div>
            
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.7' }}>
              JSON 형식으로 세부 사항을 지정하면 <strong style={{ color: '#ffd60a' }}>실사 영화 같은 퀄리티</strong>의 
              영상을 만들 수 있어요. 카메라 움직임, 조명, 분위기까지 모두 제어 가능!
            </p>

            <div style={{
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              overflowX: 'auto',
              position: 'relative'
            }}>
              <button
                onClick={() => copyToClipboard(CINEMATIC_JSON_PROMPT, 'cinematic')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: copiedPrompt === 'cinematic' ? '#ffd60a' : 'rgba(255, 214, 10, 0.8)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                {copiedPrompt === 'cinematic' ? '✓ 복사됨!' : <><Copy size={14} /> 복사</>}
          </button>
              <pre style={{
                color: '#e2e8f0',
                fontSize: '0.85rem',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: '1.7',
                fontFamily: 'Monaco, Consolas, monospace'
              }}>
                {CINEMATIC_JSON_PROMPT}
              </pre>
        </div>

            <div style={{
              background: 'rgba(30, 58, 138, 0.2)',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 214, 10, 0.2)'
            }}>
              <p style={{ color: '#ffd60a', fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>
                💡 이 JSON에 포함된 요소:
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: '8px', 
                marginTop: '10px' 
              }}>
                {['카메라 움직임', '조명 설정', '환경 묘사', '디테일 요소', '모션 효과', '엔딩 장면'].map((item, i) => (
                  <span key={i} style={{
                    background: 'rgba(255, 214, 10, 0.15)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: '#fbbf24'
                  }}>
                    {item}
                  </span>
                ))}
      </div>
    </div>
          </div>

          {/* 쉬운 방법 CTA 버튼들 */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/ai-video-generation-prompts')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                color: 'white',
                padding: '16px 28px',
                borderRadius: '14px',
                fontSize: '1.05rem',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(255, 214, 10, 0.3)'
              }}
            >
              <Film size={20} />
              전체 프롬프트 보기
              <ExternalLink size={16} />
            </button>
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #4285f4, #1a73e8)',
                color: 'white',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(66, 133, 244, 0.3)'
              }}
            >
              <Sparkles size={18} />
              Gemini 열기
            </a>
            <a
              href="https://opal.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #ea4335, #c5221f)',
                color: 'white',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(234, 67, 53, 0.3)'
              }}
            >
              <Video size={18} />
              Google OPAL 열기
            </a>
          </div>
        </div>

        {/* ⚡ 방법 2: 어려운 방법 (Colab) */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          border: '2px solid rgba(255, 214, 10, 0.3)'
        }}>
          <h3 style={{ 
            color: '#ffd60a', 
            fontSize: '1.3rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Code size={24} /> 방법 2: 어려운 방법 (Google Colab)
          </h3>
          
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', margin: '0 0 16px 0', lineHeight: '1.8' }}>
              코드로 직접 실습하면서 <strong style={{ color: '#ffd60a' }}>원리를 깊이 이해</strong>할 수 있어요!
              JSON보다 더 확실한 <strong style={{ color: '#ffd60a' }}>코드 형태</strong>로 AI에게 명령하는 방법을 배웁니다.
            </p>
            <div style={{ 
              background: 'rgba(30, 58, 138, 0.2)', 
              padding: '16px', 
              borderRadius: '10px',
              marginTop: '12px',
              border: '1px solid rgba(255, 214, 10, 0.2)'
            }}>
              <p style={{ color: '#ffd60a', fontWeight: '600', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
                💡 Colab 사용 팁
              </p>
              <ul style={{ color: '#e2e8f0', margin: 0, paddingLeft: '18px', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li><strong>파일 → 드라이브에 사본 저장</strong>하면 내 구글 드라이브에 저장돼요!</li>
                <li><strong>런타임 → 모두 실행</strong>하면 전체 코드를 한번에 실행할 수 있어요</li>
                <li>모르는 코드는 <strong>AI 버튼 → 코드 설명</strong>으로 배울 수 있어요</li>
              </ul>
            </div>
          </div>
          
          {/* 💰 API 비용 안내 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(30, 58, 138, 0.15))',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            border: '2px solid rgba(255, 214, 10, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span>
              <div>
                <h4 style={{ color: '#ffd60a', margin: 0, fontSize: '1.1rem' }}>API 비용 알고 가기!</h4>
                <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.8rem' }}>막무가내로 만들면 빈털터리 됩니다</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ color: '#fbbf24', fontSize: '0.75rem', margin: '0 0 4px 0' }}>Veo 3.1 Fast</p>
                <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>$0.15/초</p>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '4px 0 0 0' }}>8초 = 약 1,680원</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ color: '#fbbf24', fontSize: '0.75rem', margin: '0 0 4px 0' }}>Veo 3.1 Standard</p>
                <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>$0.40/초</p>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '4px 0 0 0' }}>8초 = 약 4,480원</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                <p style={{ color: '#ffd60a', fontSize: '0.75rem', margin: '0 0 4px 0' }}>10개 영상</p>
                <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>~$32</p>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '4px 0 0 0' }}>약 44,800원</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/gemini-api-calculator')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #1e3a8a, #0f2847)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🧮 API 가격 계산기로 미리 계산하기
            </button>
            
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '12px 0 0 0', lineHeight: '1.6' }}>
              💡 <strong>구글 클라우드 $300 무료 크레딧</strong>으로 연습하세요! 
              나중에 스타트업이 되면 더 많은 크레딧을 신청할 수 있어요.
            </p>
          </div>

          {/* Colab에서 배우는 것들 - 상세 */}
          <div style={{
            background: 'rgba(255, 214, 10, 0.08)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: '#ffd60a', marginBottom: '16px', fontSize: '1.1rem' }}>📚 Colab 심화 과정에서 배우는 것:</h4>
            
            {/* 핵심 개념들 */}
            <div style={{ display: 'grid', gap: '16px' }}>
              {/* 프롬프트 & Negative 프롬프트 */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>✏️</span>
                  <h5 style={{ color: '#ffd60a', margin: 0, fontSize: '1rem' }}>프롬프트 & Negative 프롬프트</h5>
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, lineHeight: '1.7' }}>
                  <strong>프롬프트</strong>: 만들고 싶은 영상 설명 (예: "해바라기 밭에서 뛰어노는 강아지")<br/>
                  <strong style={{ color: '#ffd60a' }}>Negative 프롬프트</strong>: 절대 생성하지 않을 것 (예: "흐릿한, 저품질, 글자")
                </p>
              </div>
              
              {/* 설정 옵션들 */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                  <h5 style={{ color: '#ffd60a', margin: 0, fontSize: '1rem' }}>설정 옵션</h5>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                  <span style={{ color: '#e2e8f0', fontSize: '0.85rem', background: 'rgba(255,214,10,0.1)', padding: '8px', borderRadius: '6px' }}>
                    📐 aspect_ratio: 16:9 / 9:16
                  </span>
                  <span style={{ color: '#e2e8f0', fontSize: '0.85rem', background: 'rgba(255,214,10,0.1)', padding: '8px', borderRadius: '6px' }}>
                    🎥 resolution: 720p / 1080p
                  </span>
                </div>
              </div>

              {/* 이미지 → 영상 */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🖼️</span>
                  <h5 style={{ color: '#ffd60a', margin: 0, fontSize: '1rem' }}>이미지 → 영상 변환</h5>
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, lineHeight: '1.7' }}>
                  내가 원하는 캐릭터/장면의 <strong style={{ color: '#ffd60a' }}>이미지를 먼저 생성</strong>하고,
                  그걸 영상으로 변환하면 <strong style={{ color: '#ffd60a' }}>훨씬 더 원하는 결과</strong>를 얻을 수 있어요!
                </p>
              </div>
              
              {/* 시작/끝 프레임 */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🎬</span>
                  <h5 style={{ color: '#ffd60a', margin: 0, fontSize: '1rem' }}>시작/끝 프레임 지정</h5>
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, lineHeight: '1.7' }}>
                  <strong>첫 장면</strong> 이미지와 <strong>끝 장면</strong> 이미지를 넣으면,
                  AI가 두 장면을 <strong style={{ color: '#ffd60a' }}>자연스럽게 연결</strong>하는 영상을 만들어줘요!
                </p>
              </div>
              
              {/* 영상 길이 늘리기 */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                  <h5 style={{ color: '#ffd60a', margin: 0, fontSize: '1rem' }}>영상 길이 늘리기</h5>
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, lineHeight: '1.7' }}>
                  <strong>8초 → 16초 → 24초</strong>... 계속 연장할 수 있어요!
                  재생 버튼을 누를 때마다 영상이 자연스럽게 이어져요.
                </p>
              </div>
            </div>
          </div>
          
          {/* 티어 시스템 안내 */}
          <div style={{
            background: 'rgba(30, 58, 138, 0.2)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 214, 10, 0.3)'
          }}>
            <p style={{ color: '#ffd60a', fontWeight: '600', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
              📊 할당량 (Quota) 시스템
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, lineHeight: '1.6' }}>
              하루에 만들 수 있는 영상 수가 정해져 있어요 (약 10~20개). 
              많이 사용할수록 <strong style={{ color: '#ffd60a' }}>티어 1 → 티어 2 → 티어 3</strong>로 
              할당량이 늘어납니다!
            </p>
          </div>

          {/* Colab CTA */}
          <a
            href="https://drive.google.com/file/d/1GBcLBqRXdMhdxnP2Jx3upX-7WXUcFIUv/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              padding: '20px 32px',
              background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
              borderRadius: '16px',
              color: '#1e3a8a',
              fontSize: '1.2rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(255, 214, 10, 0.4)',
              marginBottom: '16px',
              border: '2px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🎬</span>
            영상 생성 Colab 노트북 열기
            <ExternalLink size={20} />
          </a>

          <div style={{
            background: 'rgba(30, 58, 138, 0.2)',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 214, 10, 0.2)'
          }}>
            <p style={{ color: '#ffd60a', fontWeight: '600', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
              💡 이 방법은 조금 어려울 수 있어요!
            </p>
            <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
              쉬운 방법부터 먼저 해보고, 익숙해지면 이 방법에 도전하세요.
              막히면 토론방에서 질문해주세요!
            </p>
          </div>
        </div>

        {/* 🧮 API 비용 계산기 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(15, 40, 71, 0.5))',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '2px solid rgba(255, 214, 10, 0.3)'
        }}>
          <h3 style={{ 
            color: '#ffd60a', 
            fontSize: '1.2rem', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🧮 API 비용이 얼마나 들까요?
          </h3>
          
          <p style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.8' }}>
            Veo, Gemini 등 Google AI 모델을 사용할 때 비용이 궁금하시죠?
            <br />
            우리가 만든 <strong style={{ color: '#ffd60a' }}>가격 계산기</strong>로 미리 확인해보세요!
          </p>

          <button
            onClick={() => navigate('/gemini-api-calculator')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              padding: '18px 24px',
              background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
              border: 'none',
              borderRadius: '14px',
              color: '#1e3a8a',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255, 214, 10, 0.3)',
              transition: 'all 0.3s'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🧮</span>
            Gemini API 가격 계산기 열기
            <ExternalLink size={20} />
          </button>

          <div style={{
            marginTop: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.6)', 
              padding: '14px', 
              borderRadius: '10px', 
              textAlign: 'center' 
            }}>
              <p style={{ color: '#ffd60a', fontSize: '0.9rem', margin: 0, fontWeight: '600' }}>텍스트/멀티모달</p>
              <p style={{ color: '#e2e8f0', fontSize: '0.8rem', margin: '4px 0 0 0' }}>Gemini 모델</p>
            </div>
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.6)', 
              padding: '14px', 
              borderRadius: '10px', 
              textAlign: 'center' 
            }}>
              <p style={{ color: '#ffd60a', fontSize: '0.9rem', margin: 0, fontWeight: '600' }}>이미지 생성</p>
              <p style={{ color: '#e2e8f0', fontSize: '0.8rem', margin: '4px 0 0 0' }}>Imagen 3</p>
            </div>
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.6)', 
              padding: '14px', 
              borderRadius: '10px', 
              textAlign: 'center' 
            }}>
              <p style={{ color: '#ffd60a', fontSize: '0.9rem', margin: 0, fontWeight: '600' }}>영상 생성</p>
              <p style={{ color: '#e2e8f0', fontSize: '0.8rem', margin: '4px 0 0 0' }}>Veo</p>
            </div>
          </div>
        </div>

        {/* 왜 이걸 배워야 하나요? */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
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
            <Lightbulb size={22} /> 왜 영상 생성 AI를 배워야 하나요?
          </h3>

          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: '0 0 16px 0', lineHeight: '1.8' }}>
              유튜브, 틱톡, 인스타 릴스... 모든 플랫폼이 <strong style={{ color: '#ffd60a' }}>영상 콘텐츠</strong>를 원하고 있어요.
              이제 AI로 <strong style={{ color: '#ffd60a' }}>텍스트만 입력하면 영상이 자동으로 생성</strong>됩니다!
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, lineHeight: '1.8' }}>
              이 기술을 익히면 여러분만의 콘텐츠를 훨씬 빠르게 만들 수 있어요.
              AI 1인 기업을 만드는 핵심 스킬입니다!
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 214, 10, 0.15), rgba(255, 214, 10, 0.05))',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 214, 10, 0.25)'
          }}>
            <p style={{ color: '#ffd60a', fontWeight: '700', margin: '0 0 12px 0', fontSize: '1.05rem' }}>
              🚀 Step 2, 3에서 더 깊이 배울 거예요!
            </p>
            <p style={{ color: '#cbd5e1', margin: 0, lineHeight: '1.8', fontSize: '0.95rem' }}>
              지금은 기초를 배우는 단계예요. 나중에 자동화 에이전트를 만들면서
              이 영상 생성 기능을 <strong style={{ color: '#ffd60a' }}>자동 워크플로우</strong>에 연결할 거예요!
            </p>
          </div>
        </div>

        {/* 실습 미션 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 214, 10, 0.1), rgba(255, 214, 10, 0.05))',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 214, 10, 0.3)'
        }}>
          <h3 style={{ 
            color: '#ffd60a', 
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
              <li><strong style={{ color: '#ffffff' }}>[초보]</strong> Gemini/OPAL에서 프롬프트로 <strong>첫 영상 생성</strong>하기</li>
              <li><strong style={{ color: '#ffffff' }}>[초보]</strong> 세로 영상(9:16)으로 <strong>숏츠용 영상</strong> 만들어보기</li>
              <li><strong style={{ color: '#ffd60a' }}>[심화]</strong> Colab 노트북 → 드라이브에 사본 저장 → <strong>코드 실행</strong></li>
              <li><strong style={{ color: '#ffd60a' }}>[심화]</strong> 이미지 먼저 생성 → 영상으로 변환해보기</li>
              <li><strong style={{ color: '#ffd60a' }}>[심화]</strong> API 가격 계산기로 <strong>비용 계산</strong>해보기</li>
              <li>만든 영상이나 경험을 아래 토론방에 <strong>공유</strong>!</li>
            </ol>
      </div>

          <div style={{
            background: 'rgba(30, 58, 138, 0.2)',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 214, 10, 0.2)'
          }}>
            <p style={{ color: '#ffd60a', fontWeight: '600', margin: '0 0 8px 0', fontSize: '0.95rem' }}>
              💡 팁: 쉬운 방법부터 시작하세요!
            </p>
            <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
              쉬운 방법으로 먼저 결과물을 만들어보면 재미있어요!
              어려운 방법은 나중에 천천히 도전해도 됩니다.
            </p>
          </div>
        </div>

        {/* 💬 Day 7 토론방 */}
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
              <MessageCircle size={22} /> Day 7 토론방
            </h3>
            <button
              onClick={() => navigate('/community/step1')}
              style={{
                background: 'rgba(255, 214, 10, 0.1)',
                border: '1px solid rgba(255, 214, 10, 0.3)',
                color: '#ffd60a',
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
                background: 'linear-gradient(135deg, #1e3a8a, #0f2847)',
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
                  placeholder="오늘 만든 영상이나 경험을 공유해주세요! 🎬"
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
                        ? 'linear-gradient(135deg, #ffd60a, #1e3a8a)' 
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
              <div style={{ textAlign: 'center', padding: '30px', color: '#cbd5e1' }}>
                ⏳ 토론 내용을 불러오는 중...
              </div>
            ) : discussionPosts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '30px',
                color: '#cbd5e1',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #1e3a8a, #0f2847)',
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
                    <div style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>
                      {formatTime(post.createdAt)}
                    </div>
                  </div>
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 10px 0' }}>
                  {post.content}
                </p>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{
                    background: post.isLiked ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    border: post.isLiked ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                    color: post.isLiked ? '#f87171' : '#cbd5e1',
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

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              onClick={() => navigate('/community/step1')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#cbd5e1',
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
                ? 'linear-gradient(135deg, #ffd60a, #e5c100)' 
                : 'linear-gradient(135deg, #ffd60a, #1e3a8a)',
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
                ? '0 6px 20px rgba(255, 214, 10, 0.3)'
                : '0 6px 20px rgba(255, 214, 10, 0.3)'
            }}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle size={20} /> Day 7 완료!
              </>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <>
                <PlayCircle size={20} /> Day 7 완료하기
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
              Day 8로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day7Page;
