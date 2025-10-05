import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import PaymentComponent from './PaymentComponent';
import AzureTableService from '../services/azureTableService';
import NavigationBar from './NavigationBar';

// SEO 메타 태그 업데이트 함수
const updateMetaTags = () => {
  // 페이지 제목 업데이트
  document.title = '🏗️ AI 시티 빌더 - 나만의 수익형 디지털 건물 짓기 | AI City Builders';
  
  // 메타 description 업데이트
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', 'AI City Builders - AI 시티 빌더 시리즈로 나만의 수익형 디지털 건물 짓기! ChatGPT, AI 코딩, Google AI까지 실전 AI 교육 플랫폼');
  }
  
  // Open Graph 태그 업데이트
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', '🏗️ AI 시티 빌더 - 나만의 수익형 디지털 건물 짓기 | AI City Builders');
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', 'AI로 월세 받는 첫 번째 디지털 건물을 완성하세요! ChatGPT부터 유튜브 수익화까지, AI 멘토 제이와 함께하는 실전 강의');
  }
};

// 강의 타입 정의
interface Course {
  id: number;
  instructor: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  isNew: boolean;
  category: string;
  isDocumentary?: boolean;
  videoUrl?: string;
  isPremium?: boolean;
  launchDate?: string;
  price?: number;
  originalPrice?: number;
  isComingSoon?: boolean;
}

// Basic/Free Courses 데이터 (대중 선호도 순으로 정렬)
const aiMasterClasses: Course[] = [
  {
    id: 1,
    instructor: 'CHATGPT',
    title: 'ChatGPT의 정석',
    subtitle: 'AI 업무 혁신 완전정복',
    description: 'AI 멘토 JAY와 함께하는 ChatGPT 실전 활용법',
    image: '/images/ChatGPT.png',
    isNew: true,
    category: 'AI & Technology',
    isDocumentary: false
  },
  {
    id: 5,
    instructor: 'AI CODING',
    title: 'AI 코딩 완전정복',
    subtitle: 'GitHub Copilot부터 Claude까지 모든 AI 코딩 도구',
    description: 'AI를 활용한 차세대 코딩! 생산성 10배 올리는 실전 가이드',
    image: '/images/aicoding.png',
    isNew: true,
    category: 'AI Coding',
    isDocumentary: false
  },
  {
    id: 3,
    instructor: 'GOOGLE AI',
    title: 'Google AI 완전정복',
    subtitle: '구글이 만든 인공지능, VEO, Gemini, CLI',
    description: 'AI 멘토 JAY와 함께하는 Google AI 실전 가이드',
    image: '/images/gemini3.png',
    isNew: true,
    category: 'AI & Technology',
    isDocumentary: false
  },
  {
    id: 4,
    instructor: 'AI BUSINESS',
    title: 'AI 비즈니스 전략',
    subtitle: '책임감 있는 AI 활용과 비즈니스 적용',
    description: '실무진을 위한 AI 비즈니스 완전정복',
    image: '/images/business.png',
    isNew: true,
    category: 'Business & Strategy',
    isDocumentary: false
  },
  {
    id: 6,
    instructor: 'CHATGPT PROMPTS',
    title: '40대+ 직장인을 위한 ChatGPT 프롬프트 100선',
    subtitle: '실전 업무 최적화 프롬프트 모음',
    description: '경험 많은 직장인을 위한 AI 활용 가이드북',
    image: '/images/40+prompt.png',
    isNew: true,
    category: 'AI 실무',
    isDocumentary: false
  },
  {
    id: 2,
    instructor: 'AI EDUCATION',
    title: 'AI 교육의 격차들',
    subtitle: '줄이기 위한 여정',
    description: '모든 사람에게 양질의 AI 교육 기회를 제공하는 프로젝트',
    image: '/images/aieducation.jpg',
    isNew: true,
    category: 'Documentary',
    isDocumentary: true,
    videoUrl: 'https://youtu.be/6VpOwlEq7UM?si=d0eQl9slU1ybxe4x'
  }
];



// 프리미엄 강의
const premiumClasses: Course[] = [
  {
    id: 999,
    instructor: '정원석 (AI 멘토 제이)',
    title: '강의 1: AI 건물 짓기',
    subtitle: '🏗️ 디지털 건축가 과정',
    description: '🎯 4050 세대를 위한 특별 설계! AI를 활용해 나만의 디지털 상품을 만들고 수익화하는 완전한 가이드. 평생 현역으로 일하고 싶은 당신을 위한 실전 비즈니스 로드맵',
    image: '/images/aibuilidng.png',
    isNew: true,
    category: 'Premium',
    isDocumentary: false,
    isPremium: true,
    launchDate: '2025-02-01',
    price: 149000,
    originalPrice: 349000,
    isComingSoon: false
  },
  {
    id: 1000,
    instructor: '정원석 (AI 멘토 제이)',
    title: '강의 2: AI 마을 만들기',
    subtitle: '🏘️ The Thriving Village',
    description: '💼 AI 도구들을 연결해서 번영하는 마을을 만들어보세요. 커뮤니티 구축부터 지속가능한 생태계까지!',
    image: '/images/coming-soon-placeholder.png',
    isNew: true,
    category: 'Premium',
    isDocumentary: false,
    isPremium: true,
    launchDate: 'Coming Soon',
    price: 199000,
    originalPrice: 399000,
    isComingSoon: true
  },
  {
    id: 1001,
    instructor: '정원석 (AI 멘토 제이)',
    title: '강의 3: AI 도시 세우기',
    subtitle: '🏙️ The AI City - AI 도시 경영자(CEO) 과정',
    description: '🌆 최종 단계! AI를 활용해서 거대한 도시를 경영하는 CEO가 되어보세요. 전략적 사고부터 리더십까지 모든 것을 배웁니다.',
    image: '/images/coming-soon-placeholder.png',
    isNew: true,
    category: 'Premium',
    isDocumentary: false,
    isPremium: true,
    launchDate: 'Coming Soon',
    price: 199000,
    originalPrice: 399000,
    isComingSoon: true
  }
];

interface MainPageProps {
  onCourseSelect: (courseId: number) => void;
  onFAQClick: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onCourseSelect, onFAQClick, onLoginClick, onSignUpClick }) => {
  const navigate = useNavigate();
  const gridRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // 결제 모달 state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{title: string; price: number} | null>(null);
  
  
  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());

  // 페이지 로드 시 SEO 메타 태그 업데이트
  useEffect(() => {
    updateMetaTags();
  }, []);

  // 로그인 상태 확인 (sessionStorage에서)
  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
      if (storedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setIsLoggedIn(true);
          setUserInfo(parsedUserInfo);
          console.log('👤 로그인된 사용자 확인:', parsedUserInfo.email);
          
          // 수강 중인 강좌 목록 가져오기
          console.log('🔍 사용자 수강 정보 조회 시작:', parsedUserInfo.email);
          const userEnrollments = await AzureTableService.getUserEnrollmentsByEmail(parsedUserInfo.email);
          console.log('📋 Azure에서 가져온 수강 정보:', userEnrollments);
          
          const enrolledCourseIds = new Set(userEnrollments.map(course => course.courseId));
          setEnrolledCourses(enrolledCourseIds);
          console.log('📚 수강 중인 강좌 ID 목록:', Array.from(enrolledCourseIds));
        } catch (error) {
          console.error('사용자 정보 파싱 오류:', error);
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
    };

    checkLoginStatus();
  }, []);


  // 결제 관련 핸들러 - 로그인 체크 포함
  const handleEnrollClick = (e: React.MouseEvent, courseTitle: string, price: number = 199000, courseId?: string) => {
    e.stopPropagation();
    
    // 로그인 상태 확인
    if (!isLoggedIn || !userInfo) {
      console.log('🚫 로그인 필요 - 로그인 페이지로 이동');
      const confirmLogin = window.confirm('결제하려면 먼저 로그인해주세요!\n로그인 페이지로 이동하시겠습니까?');
      if (confirmLogin) {
        navigate('/login');
      }
      return;
    }
    
    // 수강 상태 확인 (ai-building 강좌의 경우)
    if (courseId && enrolledCourses.has(courseId)) {
      alert('이미 수강 중인 강좌입니다! 대시보드에서 학습을 이어가세요.');
      navigate('/dashboard');
      return;
    }
    
    setSelectedCourse({ title: courseTitle, price });
    setShowPaymentModal(true);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setSelectedCourse(null);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    console.log('결제 성공:', paymentData);
    
    // Azure에 구매 정보 저장
    if (userInfo && selectedCourse) {
      try {
        const courseId = selectedCourse.title.toLowerCase().replace(/\s+/g, '-');
        
        // Azure Table Storage에 구매 정보 저장 (리워드 포함)
        const result = await AzureTableService.addPurchaseWithReward({
          email: userInfo.email,  // userId → email로 변경
          courseId: courseId,
          title: selectedCourse.title,
          amount: selectedCourse.price,
          paymentMethod: 'card'
        });
        
        // 리워드 처리 결과 로그
        if (result.rewardProcessed) {
          console.log('🎁 추천 리워드 지급 완료!');
        }
        
        console.log('✅ Azure에 구매 정보 저장 완료:', courseId);
        
        // 수강 중인 강좌 목록 업데이트
        setEnrolledCourses(prev => {
          const newSet = new Set(prev);
          newSet.add(courseId);
          return newSet;
        });
      } catch (error) {
        console.error('❌ 구매 정보 저장 실패:', error);
      }
    }
    
    alert('결제가 완료되었습니다! 수강을 시작해보세요.');
    setShowPaymentModal(false);
    setSelectedCourse(null);
  };

  // 강의 클릭 핸들러
  const handleCourseClick = (course: any) => {
    // AI 건물 짓기 강의 처리
    if (course.id === 999) {
      navigate('/ai-building-course');
      return;
    }
    
    // 각 강의별 라우팅
    switch (course.id) {
      case 1: // ChatGPT 강의
        navigate('/chatgpt-course');
        break;
      case 2: // AI 교육 다큐멘터리
        navigate('/ai-education-documentary');
        break;
      case 3: // Google AI 강의
        navigate('/google-ai-course');
        break;
      case 4: // AI 비즈니스 강의
        navigate('/ai-business-course');
        break;
      case 5: // AI 코딩 강의
        navigate('/ai-coding-course');
        break;
      case 6: // ChatGPT 프롬프트 40+ 강의
        navigate('/chatgpt-prompts-40plus');
        break;
      default:
        // 기존 onCourseSelect 로직 유지 (다른 강의들)
        onCourseSelect(course.id);
    }
  };

  // 화살표 버튼으로 그리드 스크롤하기
  const handleGridScroll = useCallback((gridIndex: number, direction: 'left' | 'right') => {
    const currentGrid = gridRefs.current[gridIndex];
    if (!currentGrid) return;

    const scrollAmount = 324; // 카드 너비(300px) + 간격(24px)
    
    if (direction === 'left') {
      currentGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      currentGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  // 컴포넌트 마운트 시 모든 그리드를 맨 왼쪽으로 스크롤
  useEffect(() => {
    const resetScrollPositions = () => {
      gridRefs.current.forEach((grid) => {
        if (grid) {
          grid.scrollLeft = 0;
        }
      });
    };

    // 컴포넌트 마운트 후 약간의 지연을 두고 실행
    const timer = setTimeout(resetScrollPositions, 100);
    
    return () => clearTimeout(timer);
  }, []);



  return (
    <div className="masterclass-container">
      {/* 통일된 네비게이션바 */}
      <NavigationBar 
        onFAQClick={onFAQClick}
        onLoginClick={onLoginClick}
        onSignUpClick={onSignUpClick}
      />



      {/* 마스터클래스 스타일 메인 콘텐츠 */}
      <main className="masterclass-main">

        {/* Basic/Free Courses 섹션 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category">Free Classes</span>
            </h2>
            <div className="section-nav">
              <button 
                className="nav-arrow"
                aria-label="Previous AI & Technology courses"
                onClick={() => handleGridScroll(0, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next AI & Technology courses"
                onClick={() => handleGridScroll(0, 'right')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div 
            className="masterclass-grid"
            ref={(el) => { gridRefs.current[0] = el; }}
          >
            {aiMasterClasses.map((course) => (
              <div key={course.id} className="masterclass-card" onClick={() => handleCourseClick(course)}>
                <div className="card-image-container">
                  <OptimizedImage 
                    src={course.image} 
                    alt={course.instructor}
                    className="instructor-image"
                    loading="lazy"
                    placeholder="true"
                  />
                  <div className="free-badge-overlay">FREE</div>
                  <div className="card-overlay">
                    <button 
                      className="watch-trailer-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // 이벤트 버블링 방지
                        handleCourseClick(course);
                      }}
                    >
                      <Play size={16} />
                      {course.isDocumentary ? 'Watch Documentary' : 'Watch Course'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 프리미엄 강의 섹션 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category">AI CITY BUILDER</span>
              <div style={{ fontSize: '0.8em', marginTop: '8px', fontWeight: 'normal' }}>나만의 AI 도시 세우기</div>
            </h2>
            <div className="section-nav">
              <button 
                className="nav-arrow"
                aria-label="Previous Premium courses"
                onClick={() => handleGridScroll(1, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next Premium courses"
                onClick={() => handleGridScroll(1, 'right')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div 
            className="masterclass-grid"
            ref={(el) => { gridRefs.current[1] = el; }}
          >
            {premiumClasses.map((course) => (
              <div key={course.id} className="masterclass-card" onClick={() => handleCourseClick(course)}>
                <div className="card-image-container">
                  <OptimizedImage 
                    src={course.image} 
                    alt={course.instructor}
                    className="instructor-image"
                    loading="lazy"
                    placeholder="true"
                  />
                  <div className="premium-badge">PREMIUM</div>
                  {course.isComingSoon ? (
                    <>
                      <div className="coming-soon-placeholder" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#1f2937',
                        fontSize: '3rem',
                        fontWeight: 'bold'
                      }}>
                        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>?</div>
                        <div style={{ fontSize: '1rem', textAlign: 'center', padding: '0 20px' }}>
                          🚀 Coming Soon
                        </div>
                        <div style={{ fontSize: '0.8rem', marginTop: '5px', opacity: 0.8 }}>
                          {course.launchDate}
                        </div>
                      </div>
                      <div className="card-overlay">
                        <button 
                          className="watch-trailer-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnrollClick(e, course.title || course.description, course.price || 299000, `course-${course.id}`);
                          }}
                          disabled={enrolledCourses.has(`course-${course.id}`)}
                          style={{
                            opacity: enrolledCourses.has(`course-${course.id}`) ? '0.6' : '1',
                            cursor: enrolledCourses.has(`course-${course.id}`) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <Play size={16} />
                          {enrolledCourses.has(`course-${course.id}`) ? '✅ 수강 중' : '🔥 사전예약'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="card-overlay">
                      <button 
                        className="watch-trailer-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseClick(course);
                        }}
                      >
                        <Play size={16} />
                        🚀 바로 수강하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 기업 멘토링 섹션 제거됨 - 강의 사이트에 집중 */}

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>AI City Builders</h3>
          </div>
          
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
        
        <div className="footer-bottom">
          <p>&copy; 2025 커넥젼에이아이이. All rights reserved.</p>
        </div>
      </footer>

        {/* 결제 모달 */}
        {showPaymentModal && selectedCourse && (
          <PaymentComponent
            courseTitle={selectedCourse.title}
            price={selectedCourse.price}
            userInfo={userInfo}
            onClose={handlePaymentClose}
            onSuccess={handlePaymentSuccess}
          />
        )}

      </div>
    );
  };

  export default MainPage;