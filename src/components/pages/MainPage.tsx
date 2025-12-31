import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';
import PaymentComponent from './payment/PaymentComponent';
import ComingSoonModal from '../modals/ComingSoonModal';
import AzureTableService from '../../services/azureTableService';
import NavigationBar from '../common/NavigationBar';
import CityGuide from '../common/CityGuide';
import MonthlyProjectSection from '../common/MonthlyProjectSection';

// 안내원 채팅 상태 관리를 위한 state

// SEO 메타 태그 업데이트 함수
const updateMetaTags = () => {
  document.title = '🚀 AI City Builders - AI 1인 기업가 양성 플랫폼 | 교육 + 도구';
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', 'AI City Builders - AI 수익화의 정석! 인공지능 멘토 제이와 함께 4단계 로드맵으로 AI 1인 기업가가 되어보세요!');
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', '🚀 AI City Builders - AI 1인 기업가 양성 플랫폼');
  }
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', 'AI 수익화의 정석! 인공지능 멘토 제이와 함께 4단계 로드맵으로 AI 1인 기업가가 되어보세요!');
  }
};

// 강의 타입 정의 (path 속성 추가)
interface Course {
  id: number;
  instructor: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  isNew: boolean;
  category: string;
  path: string;
  isDocumentary?: boolean;
  videoUrl?: string;
  isPremium?: boolean;
  launchDate?: string;
  price?: number;
  originalPrice?: number;
  isComingSoon?: boolean;
}

// Basic/Free Courses 데이터 (path 추가)
const aiMasterClasses: Course[] = [
  { id: 0, instructor: '기초 체력 훈련소', title: '🏃 기초 체력 훈련소', subtitle: '바이브코딩 전, 코어부터 쌓자', description: '코드 보고 쫄지 않는 체력 만들기 · Python 기초부터 AI 생성까지', image: `${process.env.PUBLIC_URL}/images/바이브코딩전 준비운동.jpeg`, isNew: true, category: 'AI 기초', path: '/ai-gym', isDocumentary: false },
  { id: 1, instructor: 'CHATGPT', title: 'ChatGPT의 정석', subtitle: 'AI 업무 혁신 완전정복', description: 'AI 멘토 JAY와 함께하는 ChatGPT 실전 활용법', image: `${process.env.PUBLIC_URL}/images/ChatGPT.png`, isNew: true, category: 'AI & Technology', path: '/chatgpt-course', isDocumentary: false },
  { id: 5, instructor: 'AI CODING', title: 'AI 코딩 완전정복', subtitle: 'GitHub Copilot부터 Claude까지 모든 AI 코딩 도구', description: 'AI를 활용한 차세대 코딩! 생산성 10배 올리는 실전 가이드', image: `${process.env.PUBLIC_URL}/images/aicoding.png`, isNew: true, category: 'AI Coding', path: '/ai-coding-course', isDocumentary: false },
  { id: 3, instructor: 'GOOGLE AI', title: 'Google AI 완전정복', subtitle: '구글이 만든 인공지능, VEO, Gemini, CLI', description: 'AI 멘토 JAY와 함께하는 Google AI 실전 가이드', image: `${process.env.PUBLIC_URL}/images/gemini3.png`, isNew: true, category: 'AI & Technology', path: '/google-ai-course', isDocumentary: false },
  { id: 4, instructor: 'AI BUSINESS', title: 'AI 비즈니스 전략', subtitle: '책임감 있는 AI 활용과 비즈니스 적용', description: '실무진을 위한 AI 비즈니스 완전정복', image: `${process.env.PUBLIC_URL}/images/business.png`, isNew: true, category: 'Business & Strategy', path: '/ai-business-course', isDocumentary: false },
  { id: 2, instructor: 'AI EDUCATION', title: 'AI 교육의 격차들', subtitle: '줄이기 위한 여정', description: '모든 사람에게 양질의 AI 교육 기회를 제공하는 프로젝트', image: `${process.env.PUBLIC_URL}/images/aieducation.jpg`, isNew: true, category: 'Documentary', path: '/ai-education-documentary', isDocumentary: true, videoUrl: 'https://youtu.be/6VpOwlEq7UM?si=d0eQl9slU1ybxe4x' }
];

// 인공지능 수익화 무료 강의 클래스
const freeMoneyClasses: Course[] = [
  { id: 6, instructor: 'CHATGPT PROMPTS', title: '40대+ 직장인을 위한 ChatGPT 프롬프트 100선', subtitle: '실전 업무 최적화 프롬프트 모음', description: '경험 많은 직장인을 위한 AI 활용 가이드북', image: `${process.env.PUBLIC_URL}/images/40+prompt.png`, isNew: true, category: 'AI 수익화', path: '/chatgpt-prompts-40plus', isDocumentary: false },
  { id: 7, instructor: 'AI & MONEY', title: 'AI & Money Prompt Vault', subtitle: '기획부터 세일즈까지 38개 프롬프트', description: '디지털 제품·콘텐츠 수익화를 위한 마스터 프롬프트 패키지', image: `${process.env.PUBLIC_URL}/images/promptpractice.jpeg`, isNew: true, category: 'AI 수익화', path: '/ai-money-master-prompts', isDocumentary: false },
  { id: 8, instructor: 'AI IMAGE GENERATION', title: 'AI 수익화 이미지 생성 프롬프트 10선', subtitle: '썸네일부터 제품 사진까지', description: 'Gemini, ChatGPT, Midjourney로 만드는 고퀄리티 수익화 이미지', image: `${process.env.PUBLIC_URL}/images/AIIMAGMONEY.jpeg`, isNew: true, category: 'AI 수익화', path: '/ai-money-image-prompts', isDocumentary: false },
  { id: 9, instructor: 'AI VIDEO GENERATION', title: 'AI 수익화 비디오 생성 프롬프트 10선', subtitle: '숏폼부터 브랜드 광고까지', description: 'Google Veo, Runway, Pika로 만드는 프로급 수익화 영상', image: `${process.env.PUBLIC_URL}/images/ai_video_money.jpg`, isNew: true, category: 'AI 수익화', path: '/ai-money-video-prompts', isDocumentary: false },
  { id: 10, instructor: 'AI CHARACTER VIDEO', title: '🎭 AI 캐릭터 영상 생성 (삭제 안 되는)', subtitle: '유튜브 CEO 경고, VideoBERT 분석', description: '사람 같은 고퀄리티 캐릭터 만들고 영상으로 변환하는 JSON 프롬프트', image: `${process.env.PUBLIC_URL}/images/main.jpeg`, isNew: true, category: 'AI 수익화', path: '/ai-character-video-prompts', isDocumentary: false },
  { id: 11, instructor: 'AI LANDLORD PREVIEW', title: '🏗️ AI 건물주 되기 (프리뷰)', subtitle: '1960년대 맨해튼 부동산의 비밀', description: '맨해튼 부동산 비밀을 AI 콘텐츠 시장에 적용하는 방법', image: `${process.env.PUBLIC_URL}/images/main/1.jpeg`, isNew: true, category: 'AI 수익화', path: '/ai-landlord-preview', isDocumentary: false }
];

// 프리미엄 강의 - 4단계 Step 시스템
const premiumClasses: Course[] = [
  // Step 1: AI 건물주 되기 - 맨해튼 부동산 원리로 AI 콘텐츠 채널 수익화
  { id: 999, instructor: '정원석 (AI 멘토 제이)', title: 'Step 1: AI 건물주 되기', subtitle: 'AI로 콘텐츠 만들기 기초', description: '맨해튼 부동산 원리를 AI 콘텐츠에 적용! 무료 AI 도구로 유튜브 채널을 짓고 수익화하는 기초를 배웁니다.', image: `${process.env.PUBLIC_URL}/images/main/1.jpeg`, isNew: true, category: 'Premium', path: '/ai-building-course', isPremium: true, launchDate: '🔥 얼리버드 진행 중', price: 45000, originalPrice: 95000, isComingSoon: false },

  // Step 2: AI 에이전트 비기너 - 여러 AI를 하나의 회사처럼 자동화
  { id: 1002, instructor: '정원석 (AI 멘토 제이)', title: 'Step 2: AI 에이전트 비기너', subtitle: '여러 AI를 하나의 회사처럼', description: 'Google OPAL로 콘텐츠 자동 생성 에이전트를 만들고 시스템화! 더 효율적인 수익 구조를 완성합니다.', image: `${process.env.PUBLIC_URL}/images/main/2.jpeg`, isNew: true, category: 'Premium', path: '/chatgpt-agent-beginner', isPremium: true, launchDate: '지금 수강 가능', price: 95000, originalPrice: 95000, isComingSoon: false },

  // Step 3: 바이브코딩 - Google Antigravity로 수익화 도구 직접 개발
  { id: 1003, instructor: '정원석 (AI 멘토 제이)', title: 'Step 3: 바이브코딩', subtitle: 'AI 수익화 도구 만들기', description: 'Google Antigravity로 자동화 에이전트와 웹/앱을 직접 개발! 코딩 몰라도 AI에게 말하면 완성.', image: `${process.env.PUBLIC_URL}/images/main/3.jpeg`, isNew: true, category: 'Premium', path: '/vibe-coding', isPremium: true, launchDate: '📅 2026년 1월 8일 오픈', price: 150000, originalPrice: 150000, isComingSoon: false },

  // Step 4: AI 1인 기업 만들기 - 인공지능 네이티브 회사 완성
  { id: 1004, instructor: '정원석 (AI 멘토 제이)', title: 'Step 4: AI 1인 기업 만들기', subtitle: 'AI 네이티브 회사 완성', description: '업무 자동화, 사업자 등록, 마케팅까지 모든 것을 AI로! 인공지능 네이티브 1인 기업을 완성합니다.', image: `${process.env.PUBLIC_URL}/images/main/4.jpeg`, isNew: true, category: 'Premium', path: '/solo-business', isPremium: true, launchDate: '준비중', price: 0, originalPrice: 0, isComingSoon: false }
];

// ⭐️ onCourseSelect 속성 제거됨
interface MainPageProps {
  onFAQClick: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onFAQClick, onLoginClick, onSignUpClick }) => {
  const navigate = useNavigate();
  const gridRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonCourseTitle, setComingSoonCourseTitle] = useState('');

  const [userInfo, setUserInfo] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<number>>(new Set());
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(true);
  const [isCityGuideOpen, setIsCityGuideOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string>('');

  // 실시간 공지사항 생성 (10분마다)
  useEffect(() => {
    const generateAnnouncement = async () => {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) return;

      const today = new Date();
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];

      const context = `
현재 시간: ${today.toLocaleString('ko-KR')} (${dayOfWeek}요일)
AI City Builders 사이트 정보:
- 매주 화요일, 목요일 저녁 8시 라이브 세션
- Step 1: AI 건물주 되기 - 얼리버드 45,000원 (곧 정가 95,000원으로)
- Step 2: AI 에이전트 비기너 - 95,000원
- Step 3: 바이브코딩 - 오픈 예정
- 무료 강의: 기초 체력 훈련소, ChatGPT의 정석 등
- 커뮤니티: 카카오톡 오픈채팅

위 정보를 바탕으로 지금 시간대에 맞는 짧은 공지사항을 1개만 생성해주세요.
- 20~40자 이내로 짧게
- 이모지 1개만 사용
- 라이브 시간이 가까우면 라이브 안내
- 얼리버드 마감 임박 등 긴급감 있는 메시지
- 시간대별로 다른 메시지 (오전: 좋은 아침, 저녁: 라이브 등)
마크다운 절대 금지. 일반 텍스트만.
`;

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: context }] }],
              generationConfig: { temperature: 0.9, maxOutputTokens: 100 }
            })
          }
        );
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) setAnnouncement(text.trim());
      } catch (error) {
        console.error('공지 생성 실패:', error);
      }
    };

    // 처음 로드 시 생성
    generateAnnouncement();

    // 10분마다 새로 생성
    const interval = setInterval(generateAnnouncement, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateMetaTags();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsLoadingEnrollments(true);
      const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
      if (storedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);

          const userEnrollments = await AzureTableService.getUserEnrollmentsByEmail(parsedUserInfo.email);
          const enrolledCourseIds = new Set(userEnrollments.map(course => Number(course.courseId)));
          setEnrolledCourses(enrolledCourseIds);
        } catch (error) {
          console.error('사용자 정보 처리 오류:', error);
          sessionStorage.removeItem('aicitybuilders_user_session');
          setUserInfo(null);
          setEnrolledCourses(new Set());
        }
      } else {
        setUserInfo(null);
        setEnrolledCourses(new Set());
      }
      setIsLoadingEnrollments(false);
    };

    checkLoginStatus();
  }, []);

  const handleEnrollClick = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();

    // 결제되지 않은 사용자는 강의 상세 페이지로 이동
    navigate(course.path);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setSelectedCourse(null);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (userInfo && selectedCourse) {
      try {
        await AzureTableService.addPurchaseWithReward({
          email: userInfo.email,
          courseId: String(selectedCourse.id),
          title: selectedCourse.title,
          amount: selectedCourse.price || 0,
          paymentMethod: 'card'
        });

        setEnrolledCourses(prev => new Set(prev).add(selectedCourse.id));
        alert('결제가 완료되었습니다! 수강을 시작해보세요.');
        navigate(selectedCourse.path);

      } catch (error) {
        console.error('구매 정보 저장 실패:', error);
        alert('구매 정보 저장에 실패했습니다. 관리자에게 문의해주세요.');
      }
    }
    setShowPaymentModal(false);
    setSelectedCourse(null);
  };

  const handleCourseClick = (course: Course) => {
    if (course.isComingSoon) {
      setComingSoonCourseTitle(course.title);
      setShowComingSoonModal(true);
      return;
    }

    navigate(course.path);
  };

  const handleGridScroll = useCallback((gridIndex: number, direction: 'left' | 'right') => {
    const currentGrid = gridRefs.current[gridIndex];
    if (!currentGrid) return;
    const scrollAmount = currentGrid.clientWidth * 0.8;
    currentGrid.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const resetScrollPositions = () => {
      gridRefs.current.forEach((grid) => {
        if (grid) grid.scrollLeft = 0;
      });
    };
    const timer = setTimeout(resetScrollPositions, 100);
    return () => clearTimeout(timer);
  }, []);

  const renderPremiumCard = (course: Course) => {
    const isEnrolled = enrolledCourses.has(course.id);

    const actionButton = (
      <button
        className="watch-trailer-btn"
        style={{
          background: 'linear-gradient(135deg, #ffd700, #ffb347)',
          color: '#1a1a2e',
          fontWeight: '700',
          boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
        }}
        onClick={(e) => {
          e.stopPropagation();

          if (isEnrolled) {
            navigate(course.path);
          } else {
            handleEnrollClick(e, course);
          }
        }}
        disabled={isLoadingEnrollments}
      >
        <Play size={16} />
        {isLoadingEnrollments ? '확인 중...' : isEnrolled ? '✅ 학습 이어하기' : '📚 강의 자세히 보기'}
      </button>
    );

    return (
      <div
        key={course.id}
        className="masterclass-card"
        onClick={() => handleCourseClick(course)}
        style={{
          border: '2px solid rgba(255, 215, 0, 0.5)',
          boxShadow: '0 8px 25px rgba(255, 215, 0, 0.2), 0 4px 10px rgba(0,0,0,0.3)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <div className="card-image-container">
          <OptimizedImage src={course.image} alt={course.title} className="instructor-image" loading="lazy" placeholder="true" />
          <div className="premium-badge" style={{
            background: 'linear-gradient(135deg, #ffd700, #ffb347)',
            color: '#ffffff',
            fontWeight: '800',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.5)'
          }}>PREMIUM</div>
          {course.isComingSoon ? (
            <div className="coming-soon-overlay" style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
              padding: '60px 20px 20px 20px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-end'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #ffd700, #ffb347)',
                padding: '8px 20px', borderRadius: '20px',
                fontSize: '0.9rem', fontWeight: 'bold', color: '#1a1a2e',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                marginBottom: '8px'
              }}>🚀 Coming Soon</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>{course.launchDate}</div>
            </div>
          ) : (
            <div className="card-overlay">{actionButton}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="masterclass-container">
      <NavigationBar onFAQClick={onFAQClick} onLoginClick={onLoginClick} onSignUpClick={onSignUpClick} />

      {/* 🏙️ AI City 웰컴 히어로 섹션 - 네이비 + 골드 */}
      <section style={{
        position: 'relative',
        padding: '40px 24px 40px',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1527 40%, #101d30 70%, #0d1527 100%)',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* 배경 그라데이션 효과 - 골드 글로우 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.08) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(255,215,0,0.05) 0%, transparent 40%), radial-gradient(ellipse at 70% 80%, rgba(255,215,0,0.05) 0%, transparent 40%)',
          pointerEvents: 'none'
        }} />

        {/* 웰컴 메시지 */}
        <h1 style={{
          position: 'relative',
          fontSize: 'clamp(1.6rem, 4.5vw, 2.5rem)',
          fontWeight: '800',
          color: '#ffffff',
          marginBottom: '8px',
          lineHeight: '1.3'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #ffd700, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>AI City</span>에 오신 것을 환영합니다
        </h1>

        <p style={{
          position: 'relative',
          fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
          color: 'rgba(255,255,255,0.7)',
          maxWidth: '550px',
          margin: '0 auto 28px',
          lineHeight: '1.5'
        }}>
          AI 수익화의 정석! 인공지능 멘토 제이와 함께<br />
          4단계 로드맵으로 AI 1인 기업가가 되어보세요! 🚀
        </p>


        {/* 안내원 이미지 + 말풍선 + 버튼 */}
        <div className="concierge-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* 안내원 + 말풍선 */}
          <div style={{
            position: 'relative',
            display: 'inline-block'
          }}>
            <img
              className="concierge-image"
              src={`${process.env.PUBLIC_URL}/images/main/aian.jpeg`}
              alt="AI City 안내원"
              onClick={() => setIsCityGuideOpen(true)}
              style={{
                width: '100%',
                maxWidth: '420px',
                height: 'auto',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                display: 'block'
              }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />

            {/* 말풍선 - PC: 옆 */}
            {announcement && (
              <div className="announcement-bubble-pc" style={{
                position: 'absolute',
                top: '20px',
                right: '-20px',
                transform: 'translateX(100%)',
                background: '#fff',
                borderRadius: '16px 16px 16px 4px',
                padding: '14px 18px',
                maxWidth: '240px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                animation: 'fadeIn 0.5s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-8px',
                  top: '20px',
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderRight: '8px solid #fff'
                }} />
                <p style={{
                  color: '#1a1a2e',
                  fontSize: '0.85rem',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  <span style={{ color: '#f59e0b', fontWeight: '700' }}>AI City 안내원 : </span>
                  {announcement}
                </p>
              </div>
            )}
          </div>

          {/* 말풍선 - 모바일: 아래 */}
          {announcement && (
            <div className="announcement-bubble-mobile" style={{
              marginTop: '16px',
              background: '#fff',
              borderRadius: '16px',
              padding: '14px 18px',
              maxWidth: '320px',
              width: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              animation: 'fadeIn 0.5s ease',
              position: 'relative',
              display: 'none'
            }}>
              {/* 위로 향하는 꼬리 */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '10px solid #fff'
              }} />
              <p style={{
                color: '#1a1a2e',
                fontSize: '0.9rem',
                margin: 0,
                lineHeight: '1.5',
                textAlign: 'center'
              }}>
                <span style={{ color: '#f59e0b', fontWeight: '700' }}>AI City 안내원 : </span>
                {announcement}
              </p>
            </div>
          )}

          <button
            onClick={() => setIsCityGuideOpen(true)}
            style={{
              marginTop: '24px',
              background: 'linear-gradient(135deg, #ffd700, #f59e0b)',
              border: 'none',
              borderRadius: '24px',
              padding: '14px 32px',
              color: '#1a1a2e',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(255,215,0,0.3)'
            }}
          >
            💬 안내원과 대화하기
          </button>
        </div>

        {/* 애니메이션 */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

      </section>

      {/* 모달 채팅 - 섹션 밖에 배치 */}
      <CityGuide
        isOpenExternal={isCityGuideOpen}
        onClose={() => setIsCityGuideOpen(false)}
      />

      {/* 🗞️ 월간 프로젝트 신문 섹션 */}
      <MonthlyProjectSection />

      <main className="masterclass-main">
        {/* 프리미엄 강의 - 4단계 로드맵 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category" style={{
                background: 'linear-gradient(135deg, #ffd700, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '800'
              }}>
                🏙️ AI City 로드맵
              </span>
              <div style={{ fontSize: '0.8em', marginTop: '8px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>
                Step 1부터 차근차근 따라오세요. 당신도 AI 1인 기업가가 됩니다!
              </div>
            </h2>
            <div className="section-nav">
              <button className="nav-arrow" aria-label="Previous Premium courses" onClick={() => handleGridScroll(0, 'left')}><ChevronLeft size={24} /></button>
              <button className="nav-arrow" aria-label="Next Premium courses" onClick={() => handleGridScroll(0, 'right')}><ChevronRight size={24} /></button>
            </div>
          </div>
          <div className="masterclass-grid" ref={(el) => { gridRefs.current[0] = el; }}>
            {premiumClasses.map(renderPremiumCard)}
          </div>
        </section>

        {/* 무료 강의 - AI 기초 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category" style={{
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '800'
              }}>
                🎓 AI 기초 트레이닝 센터
              </span>
              <div style={{ fontSize: '0.75em', marginTop: '6px', fontWeight: '500', color: 'rgba(255,255,255,0.6)' }}>
                무료로 AI 기초 체력을 쌓아보세요
              </div>
            </h2>
            <div className="section-nav">
              <button className="nav-arrow" aria-label="Previous courses" onClick={() => handleGridScroll(1, 'left')}><ChevronLeft size={24} /></button>
              <button className="nav-arrow" aria-label="Next courses" onClick={() => handleGridScroll(1, 'right')}><ChevronRight size={24} /></button>
            </div>
          </div>
          <div className="masterclass-grid" ref={(el) => { gridRefs.current[1] = el; }}>
            {aiMasterClasses.map((course) => (
              <div key={course.id} className="masterclass-card" onClick={() => handleCourseClick(course)}>
                <div className="card-image-container">
                  <OptimizedImage src={course.image} alt={course.title} className="instructor-image" loading="lazy" placeholder="true" />
                  <div className="free-badge-overlay">FREE</div>
                  <div className="card-overlay">
                    <button className="watch-trailer-btn" onClick={(e) => { e.stopPropagation(); handleCourseClick(course); }}>
                      <Play size={16} />
                      {course.isDocumentary ? '다큐멘터리 보기' : '강의 보기'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 무료 강의 - 수익화 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category" style={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '800'
              }}>💰 AI 수익화 프롬프트 창고</span>
              <div style={{ fontSize: '0.75em', marginTop: '6px', fontWeight: '500', color: 'rgba(255,255,255,0.6)' }}>
                바로 복사해서 사용하는 수익화 프롬프트
              </div>
            </h2>
            <div className="section-nav">
              <button className="nav-arrow" aria-label="Previous Money courses" onClick={() => handleGridScroll(2, 'left')}><ChevronLeft size={24} /></button>
              <button className="nav-arrow" aria-label="Next Money courses" onClick={() => handleGridScroll(2, 'right')}><ChevronRight size={24} /></button>
            </div>
          </div>
          <div className="masterclass-grid" ref={(el) => { gridRefs.current[2] = el; }}>
            {freeMoneyClasses.map((course) => (
              <div key={course.id} className="masterclass-card" onClick={() => handleCourseClick(course)}>
                <div className="card-image-container">
                  <OptimizedImage src={course.image} alt={course.title} className="instructor-image" loading="lazy" placeholder="true" />
                  <div className="free-badge-overlay" style={{
                    background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                    fontWeight: '900',
                    color: '#ffffff',
                    boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
                  }}>FREE</div>
                  <div className="card-overlay">
                    <button className="watch-trailer-btn" onClick={(e) => { e.stopPropagation(); handleCourseClick(course); }}>
                      <Play size={16} />
                      강의 보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>AI City Builders</h3>
          </div>
          <div className="footer-section">
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>문의하기</h4>
            <div className="business-info">
              <p><strong>이메일:</strong> jay@connexionai.kr</p>
              <p><strong>운영시간:</strong> 평일 09:00-18:00</p>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#778da9' }}>
              <p>커넥젼에이아이이 | 대표: 정원석 | 사업자번호: 887-55-00386</p>
            </div>
          </div>
          <div className="footer-section">
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>정책</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => navigate('/refund-policy')}
                style={{
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  color: '#ffd60a',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(251, 191, 36, 0.25)';
                  e.currentTarget.style.borderColor = '#ffd60a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(251, 191, 36, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
                }}
              >
                📋 환불 정책
              </button>
            </div>
          </div>
        </div>
        <div className="footer-bottom"><p>&copy; 2025 커넥젼에이아이이. All rights reserved.</p></div>
      </footer>

      {showPaymentModal && selectedCourse && (
        <PaymentComponent
          courseId={selectedCourse.id.toString()}
          courseTitle={selectedCourse.title}
          price={selectedCourse.price || 0}
          userInfo={userInfo}
          onClose={handlePaymentClose}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        courseTitle={comingSoonCourseTitle}
      />

    </div>
  );
};

export default MainPage;