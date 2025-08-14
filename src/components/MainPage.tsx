import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import PaymentComponent from './PaymentComponent';
import AzureTableService from '../services/azureTableService';
import NavigationBar from './NavigationBar';

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

// Basic/Free Courses 데이터
const aiMasterClasses: Course[] = [
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

// ChatGPT 전문 코스
const chatGPTClasses: Course[] = [
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
  }
];

// Google AI 전문 코스
const googleAIClasses: Course[] = [
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
  }
];

// 비즈니스 전문 코스
const businessClasses: Course[] = [
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
  }
];

// 다큐멘터리 전문 콘텐츠
const documentaryClasses: Course[] = [
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

// AI 코딩 전문 코스
const aiCodingClasses: Course[] = [
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
  }
];

// 프리미엄 강의
const premiumClasses: Course[] = [
  {
    id: 999,
    instructor: 'Google OPAL 전문가',
    title: 'Google OPAL 업무 자동화',
    subtitle: '🚀 Coming Soon - 2024.09.01 런칭 예정',
    description: '🤖 코드 없이 자연어로 만드는 AI 미니앱! Google OPAL로 업무 자동화부터 워크플로우 체이닝까지',
    image: '/images/ai-automation.jpg',
    isNew: true,
    category: 'Premium',
    isDocumentary: false,
    isPremium: true,
    launchDate: '2024-09-01',
    price: 299000,
    originalPrice: 499000,
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

  // 로그인 상태 확인 (sessionStorage에서)
  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUserInfo = sessionStorage.getItem('clathon_user_session');
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
          sessionStorage.removeItem('clathon_user_session');
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

  const handleCourseClick = (course: Course) => {
    // 모든 코스는 onCourseSelect로 처리 (다큐멘터리도 포함)
    onCourseSelect(course.id);
  };

  // 결제 관련 핸들러 - 로그인 체크 포함
  const handleEnrollClick = (e: React.MouseEvent, courseTitle: string, price: number = 199000, courseId?: string) => {
    e.stopPropagation();
    
    // 로그인 상태 확인
    if (!isLoggedIn || !userInfo) {
      alert('결제하려면 먼저 로그인해주세요!');
      navigate('/login');
      return;
    }
    
    // 수강 상태 확인 (workflow-automation 강좌의 경우)
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
        
        // Azure Table Storage에 구매 정보 저장
        await AzureTableService.createPayment({
          email: userInfo.email,  // userId → email로 변경
          courseId: courseId,
          amount: selectedCourse.price,
          paymentMethod: 'card'
        });
        
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
              <span className="highlight-category">Trending</span>
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

        {/* 프리미엄 강의 섹션 - 9월 1일 런칭 */}
        <section className="masterclass-section premium-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category premium">🔥 Premium Course</span>
              <span className="launch-date">2024.09.01 런칭 예정</span>
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
                      <div className="launch-overlay">
                        <div className="launch-info">
                          <span className="launch-text">🚀 Coming Soon</span>
                          <span className="launch-countdown">2024년 9월 1일</span>
                        </div>
                      </div>
                      <div className="card-overlay">
                        <button 
                          className="watch-trailer-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnrollClick(e, course.title || course.description, course.price || 299000, 'workflow-automation');
                          }}
                          disabled={enrolledCourses.has('workflow-automation')}
                          style={{
                            opacity: enrolledCourses.has('workflow-automation') ? '0.6' : '1',
                            cursor: enrolledCourses.has('workflow-automation') ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <Play size={16} />
                          {enrolledCourses.has('workflow-automation') ? '✅ 수강 중' : '🔥 사전예약'}
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

        {/* ChatGPT 전문 섹션 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category">ChatGPT Mastery</span>
            </h2>
            <div className="section-nav">
              <button 
                className="nav-arrow"
                aria-label="Previous ChatGPT courses"
                onClick={() => handleGridScroll(2, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next ChatGPT courses"
                onClick={() => handleGridScroll(2, 'right')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div 
            className="masterclass-grid"
            ref={(el) => { gridRefs.current[2] = el; }}
          >
            {chatGPTClasses.map((course) => (
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
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                    >
                      <Play size={16} />
                      Watch Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Google AI 전문 섹션 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category">Google AI Expert</span>
            </h2>
            <div className="section-nav">
              <button 
                className="nav-arrow"
                aria-label="Previous Google AI courses"
                onClick={() => handleGridScroll(3, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next Google AI courses"
                onClick={() => handleGridScroll(3, 'right')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div 
            className="masterclass-grid"
            ref={(el) => { gridRefs.current[3] = el; }}
          >
            {googleAIClasses.map((course) => (
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
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                    >
                      <Play size={16} />
                      Watch Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 비즈니스 전문 섹션 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category">Business Strategy</span>
            </h2>
            <div className="section-nav">
              <button 
                className="nav-arrow"
                aria-label="Previous Business courses"
                onClick={() => handleGridScroll(4, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next Business courses"
                onClick={() => handleGridScroll(4, 'right')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div 
            className="masterclass-grid"
            ref={(el) => { gridRefs.current[4] = el; }}
          >
            {businessClasses.map((course) => (
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
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                    >
                      <Play size={16} />
                      Watch Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI 코딩 전문 섹션 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category">AI Coding Expert</span>
            </h2>
            <div className="section-nav">
              <button 
                className="nav-arrow"
                aria-label="Previous AI Coding courses"
                onClick={() => handleGridScroll(5, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next AI Coding courses"
                onClick={() => handleGridScroll(5, 'right')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div 
            className="masterclass-grid"
            ref={(el) => { gridRefs.current[5] = el; }}
          >
            {aiCodingClasses.map((course) => (
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
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                    >
                      <Play size={16} />
                      Watch Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* 다큐멘터리 전문 섹션 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category">AI Documentaries</span>
            </h2>
            <div className="section-nav">
              <button 
                className="nav-arrow"
                aria-label="Previous Documentary courses"
                onClick={() => handleGridScroll(5, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next Documentary courses"
                onClick={() => handleGridScroll(5, 'right')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div 
            className="masterclass-grid"
            ref={(el) => { gridRefs.current[5] = el; }}
          >
            {documentaryClasses.map((course) => (
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
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                    >
                      <Play size={16} />
                      Watch Documentary
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer with Business Information */}
      <footer className="footer">
        <div className="footer-content">
                      <div className="footer-section">
              <h3>CLATHON</h3>
              <p>정원석의 정석 시리즈로 시작하는 AI 마스터 여정</p>
            </div>
          
                      <div className="footer-section">
              <h4>사업자 정보</h4>
              <div className="business-info">
                <p><strong>상호명:</strong> 커넥젼에이아이이</p>
                <p><strong>대표자명:</strong> 정원석</p>
                <p><strong>사업자등록번호:</strong> 887-55-00386</p>
                <p><strong>사업장 주소:</strong> 서울특별시 서초구 강남대로61길 17, 1901호(서초동, 밀라텔쉐르빌)</p>
                <p><strong>고객센터:</strong> 070-2359-3515</p>
                <p><strong>통신판매업신고:</strong> 2021-서울서초-0782</p>
                <p><strong>이메일:</strong> jay@connexionai.kr</p>
              </div>
            </div>
          
          <div className="footer-section">
            <h4>고객 지원</h4>
            <ul>
              <li><a href="/terms">이용약관</a></li>
              <li><a href="/privacy">개인정보처리방침</a></li>
              <li><a href="/refund">환불정책</a></li>
              <li><a href="/contact">고객센터</a></li>
            </ul>
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