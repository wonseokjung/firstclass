import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';
import PaymentComponent from './payment/PaymentComponent';
import ComingSoonModal from '../modals/ComingSoonModal';
import AzureTableService from '../../services/azureTableService';
import NavigationBar from '../common/NavigationBar';

// SEO 메타 태그 업데이트 함수 (기존과 동일)
const updateMetaTags = () => {
  document.title = '🏗️ AI 시티 빌더 - 나만의 수익형 디지털 건물 짓기 | AI City Builders';
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', 'AI City Builders - AI 시티 빌더 시리즈로 나만의 수익형 디지털 건물 짓기! ChatGPT, AI 코딩, Google AI까지 실전 AI 교육 플랫폼');
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', '🏗️ AI 시티 빌더 - 나만의 수익형 디지털 건물 짓기 | AI City Builders');
  }
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', 'AI로 월세 받는 첫 번째 디지털 건물을 완성하세요! ChatGPT부터 유튜브 수익화까지, AI 멘토 제이와 함께하는 실전 강의');
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
  { id: 1, instructor: 'CHATGPT', title: 'ChatGPT의 정석', subtitle: 'AI 업무 혁신 완전정복', description: 'AI 멘토 JAY와 함께하는 ChatGPT 실전 활용법', image: '/images/ChatGPT.png', isNew: true, category: 'AI & Technology', path: '/chatgpt-course', isDocumentary: false },
  { id: 5, instructor: 'AI CODING', title: 'AI 코딩 완전정복', subtitle: 'GitHub Copilot부터 Claude까지 모든 AI 코딩 도구', description: 'AI를 활용한 차세대 코딩! 생산성 10배 올리는 실전 가이드', image: '/images/aicoding.png', isNew: true, category: 'AI Coding', path: '/ai-coding-course', isDocumentary: false },
  { id: 3, instructor: 'GOOGLE AI', title: 'Google AI 완전정복', subtitle: '구글이 만든 인공지능, VEO, Gemini, CLI', description: 'AI 멘토 JAY와 함께하는 Google AI 실전 가이드', image: '/images/gemini3.png', isNew: true, category: 'AI & Technology', path: '/google-ai-course', isDocumentary: false },
  { id: 4, instructor: 'AI BUSINESS', title: 'AI 비즈니스 전략', subtitle: '책임감 있는 AI 활용과 비즈니스 적용', description: '실무진을 위한 AI 비즈니스 완전정복', image: '/images/business.png', isNew: true, category: 'Business & Strategy', path: '/ai-business-course', isDocumentary: false },
  { id: 6, instructor: 'CHATGPT PROMPTS', title: '40대+ 직장인을 위한 ChatGPT 프롬프트 100선', subtitle: '실전 업무 최적화 프롬프트 모음', description: '경험 많은 직장인을 위한 AI 활용 가이드북', image: '/images/40+prompt.png', isNew: true, category: 'AI 실무', path: '/chatgpt-prompts-40plus', isDocumentary: false },
  { id: 2, instructor: 'AI EDUCATION', title: 'AI 교육의 격차들', subtitle: '줄이기 위한 여정', description: '모든 사람에게 양질의 AI 교육 기회를 제공하는 프로젝트', image: '/images/aieducation.jpg', isNew: true, category: 'Documentary', path: '/ai-education-documentary', isDocumentary: true, videoUrl: 'https://youtu.be/6VpOwlEq7UM?si=d0eQl9slU1ybxe4x' }
];

// 프리미엄 강의 (path 추가)
const premiumClasses: Course[] = [
  { id: 999, instructor: '정원석 (AI 멘토 제이)', title: '강의 1: AI 건물 짓기', subtitle: '🏗️ 디지털 건축가 과정', description: '🎯 4050 세대를 위한 특별 설계! AI를 활용해 나만의 디지털 상품을 만들고 수익화하는 완전한 가이드. 평생 현역으로 일하고 싶은 당신을 위한 실전 비즈니스 로드맵', image: '/images/aibuilidng.png', isNew: true, category: 'Premium', path: '/ai-building-course', isPremium: true, launchDate: '2025-02-01', price: 149000, originalPrice: 349000, isComingSoon: false },
  { id: 1002, instructor: '정원석 (AI 멘토 제이)', title: 'ChatGPT AI AGENT 비기너편', subtitle: '🤖 나만의 AI 에이전트 만들기', description: '💡 ChatGPT를 활용해 업무를 자동화하는 AI 에이전트를 직접 만들어보세요! 18강의로 완성하는 실전 AI 에이전트 개발 과정', image: '/images/ChatGPT에이전트.png', isNew: true, category: 'Premium', path: '/chatgpt-agent-beginner', isPremium: true, launchDate: '2025-11-15', price: 45000, originalPrice: 99000, isComingSoon: false },
  { id: 1000, instructor: '정원석 (AI 멘토 제이)', title: '강의 2: AI 마을 만들기', subtitle: '🏘️ The Thriving Village', description: '💼 AI 도구들을 연결해서 번영하는 마을을 만들어보세요. 커뮤니티 구축부터 지속가능한 생태계까지!', image: '/images/coming-soon-placeholder.png', isNew: true, category: 'Premium', path: '/coming-soon', isPremium: true, launchDate: 'Coming Soon', price: 199000, originalPrice: 399000, isComingSoon: true },
  { id: 1001, instructor: '정원석 (AI 멘토 제이)', title: '강의 3: AI 도시 세우기', subtitle: '🏙️ The AI City - AI 도시 경영자(CEO) 과정', description: '🌆 최종 단계! AI를 활용해서 거대한 도시를 경영하는 CEO가 되어보세요. 전략적 사고부터 리더십까지 모든 것을 배웁니다.', image: '/images/coming-soon-placeholder.png', isNew: true, category: 'Premium', path: '/coming-soon', isPremium: true, launchDate: 'Coming Soon', price: 199000, originalPrice: 399000, isComingSoon: true }
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
          setIsLoggedIn(true);
          setUserInfo(parsedUserInfo);

          const userEnrollments = await AzureTableService.getUserEnrollmentsByEmail(parsedUserInfo.email);
          const enrolledCourseIds = new Set(userEnrollments.map(course => Number(course.courseId)));
          setEnrolledCourses(enrolledCourseIds);
        } catch (error) {
          console.error('사용자 정보 처리 오류:', error);
          sessionStorage.removeItem('aicitybuilders_user_session');
          setIsLoggedIn(false);
          setUserInfo(null);
          setEnrolledCourses(new Set());
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
        setEnrolledCourses(new Set());
      }
      setIsLoadingEnrollments(false);
    };

    checkLoginStatus();
  }, []);

  const handleEnrollClick = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();

    if (!isLoggedIn || !userInfo) {
      const confirmLogin = window.confirm('결제하려면 먼저 로그인해주세요!\n로그인 페이지로 이동하시겠습니까?');
      if (confirmLogin) navigate('/login');
      return;
    }

    if (enrolledCourses.has(course.id)) {
      alert('이미 수강 중인 강좌입니다! 학습을 이어가세요.');
      navigate(course.path);
      return;
    }

    setSelectedCourse(course);
    setShowPaymentModal(true);
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
    
    // AI 건물 짓기 강의는 준비중으로 접근 차단
    if (course.id === 999) {
      alert('🚧 준비중입니다!\n곧 만나볼 수 있습니다. 조금만 기다려주세요!');
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
        onClick={(e) => {
          e.stopPropagation();
          
          // AI 건물 짓기 강의는 준비중으로 접근 차단
          if (course.id === 999) {
            alert('🚧 준비중입니다!\n곧 만나볼 수 있습니다. 조금만 기다려주세요!');
            return;
          }
          
          if (isEnrolled) {
            navigate(course.path);
          } else {
            handleEnrollClick(e, course);
          }
        }}
        disabled={isLoadingEnrollments}
      >
        <Play size={16} />
        {course.id === 999 ? '🚧 준비중' : isLoadingEnrollments ? '확인 중...' : isEnrolled ? '✅ 학습 이어하기' : '🚀 바로 수강하기'}
      </button>
    );

    return (
      <div key={course.id} className="masterclass-card" onClick={() => handleCourseClick(course)}>
        <div className="card-image-container">
          {/* ⭐️ 에러 수정: placeholder={true} -> placeholder="true" */}
          <OptimizedImage src={course.image} alt={course.title} className="instructor-image" loading="lazy" placeholder="true" />
          <div className="premium-badge">PREMIUM</div>
          {course.isComingSoon ? (
            <div className="coming-soon-placeholder" style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', color: '#1f2937', fontSize: '3rem', fontWeight: 'bold'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '10px' }}>?</div>
              <div style={{ fontSize: '1rem', textAlign: 'center', padding: '0 20px' }}>🚀 Coming Soon</div>
              <div style={{ fontSize: '0.8rem', marginTop: '5px', opacity: 0.8 }}>{course.launchDate}</div>
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
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc"><span className="highlight-category">Free Classes</span></h2>
            <div className="section-nav">
              <button className="nav-arrow" aria-label="Previous courses" onClick={() => handleGridScroll(0, 'left')}><ChevronLeft size={24} /></button>
              <button className="nav-arrow" aria-label="Next courses" onClick={() => handleGridScroll(0, 'right')}><ChevronRight size={24} /></button>
            </div>
          </div>
          <div className="masterclass-grid" ref={(el) => { gridRefs.current[0] = el; }}>
            {aiMasterClasses.map((course) => (
              <div key={course.id} className="masterclass-card" onClick={() => handleCourseClick(course)}>
                <div className="card-image-container">
                  {/* ⭐️ 에러 수정: placeholder={true} -> placeholder="true" */}
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

        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category">AI CITY BUILDER</span>
              <div style={{ fontSize: '0.8em', marginTop: '8px', fontWeight: 'normal' }}>나만의 AI 도시 세우기</div>
            </h2>
            <div className="section-nav">
              <button className="nav-arrow" aria-label="Previous Premium courses" onClick={() => handleGridScroll(1, 'left')}><ChevronLeft size={24} /></button>
              <button className="nav-arrow" aria-label="Next Premium courses" onClick={() => handleGridScroll(1, 'right')}><ChevronRight size={24} /></button>
            </div>
          </div>
          <div className="masterclass-grid" ref={(el) => { gridRefs.current[1] = el; }}>
            {premiumClasses.map(renderPremiumCard)}
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
        </div>
        <div className="footer-bottom"><p>&copy; 2025 커넥젼에이아이이. All rights reserved.</p></div>
      </footer>

      {showPaymentModal && selectedCourse && (
        <PaymentComponent
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