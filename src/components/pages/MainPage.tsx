import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';
import PaymentComponent from './payment/PaymentComponent';
import ComingSoonModal from '../modals/ComingSoonModal';
import AzureTableService from '../../services/azureTableService';
import NavigationBar from '../common/NavigationBar';

// SEO 메타 태그 업데이트 함수
const updateMetaTags = () => {
  document.title = '🚀 AI City Builders - AI 크리에이터 양성 플랫폼 | 교육 + 도구';
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', 'AI City Builders - 기술이 없어도 AI로 콘텐츠를 만들고 수익화하세요! New Class of AI Creators 양성 플랫폼. 교육과 도구를 제공합니다.');
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', '🚀 AI City Builders - AI 크리에이터 양성 플랫폼');
  }
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', '기술과 장비가 없어도 AI로 콘텐츠를 만들고 수익화하세요! AI 멘토 제이와 함께하는 AI 크리에이터 양성 교육 + 도구 플랫폼');
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
  { id: 9, instructor: 'AI VIDEO GENERATION', title: 'AI 수익화 비디오 생성 프롬프트 10선', subtitle: '숏폼부터 브랜드 광고까지', description: 'Google Veo, Runway, Pika로 만드는 프로급 수익화 영상', image: `${process.env.PUBLIC_URL}/images/ai_video_money.jpg`, isNew: true, category: 'AI 수익화', path: '/ai-money-video-prompts', isDocumentary: false }
];

// 프리미엄 강의 - 4단계 Step 시스템
const premiumClasses: Course[] = [
  // Step 1: AI 건물주 되기 - 얼리버드 45,000원 (2026년부터 95,000원)
  { id: 999, instructor: '정원석 (AI 멘토 제이)', title: 'Step 1: AI 건물주 되기', subtitle: '✨ "무엇을 만들어야 팔리는지" + 압도적인 비주얼', description: '그냥 AI 이미지 생성이 아닙니다. 처음부터 수익화를 설계하고, 압도적인 비주얼로 차별화하세요!', image: `${process.env.PUBLIC_URL}/images/main/1.jpeg`, isNew: true, category: 'Premium', path: '/ai-building-course', isPremium: true, launchDate: '🔥 얼리버드 진행 중', price: 45000, originalPrice: 95000, isComingSoon: false },
  
  // Step 2: AI 에이전트 비기너 - Google OPAL로 여러 AI를 하나의 회사처럼
  { id: 1002, instructor: '정원석 (AI 멘토 제이)', title: 'Step 2: AI 에이전트 비기너', subtitle: '🤖 여러 AI를 하나의 회사처럼', description: '💎 Google OPAL로 콘텐츠 자동 생성 에이전트를 만들고 시스템화! 더 효율적인 수익 구조 완성', image: `${process.env.PUBLIC_URL}/images/main/2.jpeg`, isNew: true, category: 'Premium', path: '/chatgpt-agent-beginner', isPremium: true, launchDate: '지금 수강 가능', price: 95000, originalPrice: 95000, isComingSoon: false },
  
  // Step 3: AI 에이전트 파견소 - 교육 + 도구 (준비중)
  { id: 1003, instructor: '정원석 (AI 멘토 제이)', title: 'Step 3: AI 에이전트 파견소', subtitle: '🤖 교육 + 도구: AI 직원을 파견받아 실전!', description: '🚀 AI 에이전트를 파견받아 콘텐츠 사업을 시작하세요! 대본→이미지→음성→영상 자동화', image: `${process.env.PUBLIC_URL}/images/main/3.jpeg`, isNew: true, category: 'Premium', path: '#', isPremium: true, launchDate: '준비중', price: 0, originalPrice: 0, isComingSoon: true },
  
  // Step 4: 1인 콘텐츠 기업 만들기 - 바이브코딩으로 서비스 개발
  { id: 1004, instructor: '정원석 (AI 멘토 제이)', title: 'Step 4: 1인 콘텐츠 기업 만들기', subtitle: '🚀 바이브코딩으로 서비스 개발', description: '🏆 바이브코딩을 활용해 나만의 서비스를 개발하고 1인 콘텐츠 기업을 완성하는 단계!', image: `${process.env.PUBLIC_URL}/images/main/4.jpeg`, isNew: true, category: 'Premium', path: '/content-business', isPremium: true, launchDate: '오픈 예정', price: 150000, originalPrice: 150000, isComingSoon: true }
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

  const [userInfo, setUserInfo] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<number>>(new Set());
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(true);

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
            color: '#0a1628',
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

      <main className="masterclass-main">
        {/* 프리미엄 강의 - 최상단 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category" style={{
                background: 'linear-gradient(135deg, #0a1628, #1e3a5f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '800'
              }}>
                프리미엄 강의
              </span>
              <div style={{ fontSize: '0.8em', marginTop: '8px', fontWeight: '600', color: '#0a1628' }}>
                AI 크리에이터가 되어 콘텐츠로 수익을 창출하세요
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
                background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '800'
              }}>
                인공지능 기초 무료 강의
              </span>
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
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '800'
              }}>인공지능 수익화 무료 강의클래스</span>
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
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    fontWeight: '900',
                    color: '#1e293b',
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
          <div className="footer-section"><h3>AI City Builders</h3></div>
          <div className="footer-section">
            <h4>문의하기</h4>
            <div className="business-info">
              <p><strong>이메일:</strong> jay@connexionai.kr</p>
              <p><strong>운영시간:</strong> 평일 09:00-18:00</p>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#aaa' }}>
              <p>커넥젼에이아이이 | 대표: 정원석 | 사업자번호: 887-55-00386</p>
            </div>
          </div>
          <div className="footer-section">
            <h4>정책</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => navigate('/refund-policy')}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#9ca3af', 
                  cursor: 'pointer', 
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  padding: 0
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fbbf24'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
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
        courseTitle={"해당 강의"}
      />
    </div>
  );
};

export default MainPage;