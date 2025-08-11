import React, { useRef, useCallback, useState } from 'react';
import { Play, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import PaymentComponent from './PaymentComponent';
import { ClathonAzureService } from '../services/azureTableService';

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
    id: 6,
    instructor: 'AI 멘토 JAY',
    title: '바이브코딩으로 돈벌기',
    subtitle: 'Cursor AI로 나 혼자 끝내는 1인 개발 수익화',
    description: '🚀 월 1000만원 수익 달성을 위한 실전 바이브코딩 마스터클래스',
    image: '/images/aicoding.png',
    isNew: true,
    category: 'AI 바이브코딩',
    isDocumentary: false,
    isPremium: true,
    price: 199000,
    originalPrice: 398000
  },
  {
    id: 999,
    instructor: '정원석',
    title: '프롬프트의정석',
    subtitle: '🚀 Coming Soon - 2024.09.01 런칭 예정',
    description: '🔥 얼리버드 특가! ChatGPT, Claude, Gemini까지 완벽 마스터하는 프롬프트 엔지니어링의 모든 것',
    image: '/images/ai-automation.jpg',
    isNew: true,
    category: 'Premium',
    isDocumentary: false,
    isPremium: true,
    launchDate: '2024-09-01',
    price: 299000,
    originalPrice: 499000,
    isComingSoon: false
  }
];

interface MainPageProps {
  onCourseSelect: (courseId: number) => void;
  onPaymentClick: () => void;
  onFAQClick: () => void;
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onCourseSelect, onPaymentClick, onFAQClick, onLoginClick, onSignUpClick }) => {
  const gridRefs = useRef<(HTMLDivElement | null)[]>(new Array(7).fill(null)); // 7개 섹션 (프리미엄 추가)
  
  // 결제 모달 state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{title: string; price: number} | null>(null);

  const handleCourseClick = (course: Course) => {
    // 모든 코스는 onCourseSelect로 처리 (다큐멘터리도 포함)
    onCourseSelect(course.id);
  };

  // 결제 관련 핸들러
  const handleEnrollClick = (e: React.MouseEvent, courseTitle: string, price: number = 199000) => {
    e.stopPropagation();
    setSelectedCourse({ title: courseTitle, price });
    setShowPaymentModal(true);
  };

  // 프리미엄 강의 결제 핸들러 (현재 미사용 - 향후 직접 결제용)
  // const handlePaymentClick = (course: Course) => {
  //   setSelectedCourse({ title: course.title, price: course.price || 0 });
  //   setShowPaymentModal(true);
  // };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setSelectedCourse(null);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('결제 성공:', paymentData);
    
    // 🚀 Azure 단일 테이블에 구매 정보 저장
    const userInfo = localStorage.getItem('clathon_user');
    if (userInfo && selectedCourse) {
      const user = JSON.parse(userInfo);
      const courseId = selectedCourse.title.toLowerCase().replace(/\s+/g, '-');
      
      ClathonAzureService.purchaseCourse(
        user.userId, 
        courseId, 
        selectedCourse.title, 
        selectedCourse.price
      );
      console.log(`✅ Azure 구매 완료: ${courseId}`);
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
      {/* 마스터클래스 스타일 헤더 */}
      <header className="masterclass-header-original">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <span className="logo-icon">C</span>
              <span className="logo-text">CLATHON</span>
            </div>
            <div className="browse-dropdown">
              <button 
                className="browse-btn"
                aria-label="Browse AI & Technology courses"
                aria-expanded="false"
              >
                AI & Technology <ChevronDown size={16} />
              </button>
            </div>
          </div>
          
          <div className="search-container">
            <Search size={20} className="search-icon" aria-hidden="true" />
            <input 
              type="text" 
              placeholder="What do you want to learn..." 
              className="search-input"
              aria-label="Search for courses"
              role="searchbox"
            />
          </div>
          
          <div className="header-right">
            <button className="nav-link" onClick={() => window.location.href = '/ceo'}>CEO</button>
            <button className="nav-link" onClick={onFAQClick}>FAQ</button>
            <button className="nav-link">View Plans</button>
            <button className="nav-link" onClick={onLoginClick}>Log In</button>
            <button className="cta-button" onClick={onSignUpClick}>회원가입</button>
          </div>
        </div>
      </header>



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
              <div key={course.id} className="masterclass-card premium-card" onClick={() => handleCourseClick(course)}>
                <div className="card-image-container premium-image">
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
                      <div className="card-overlay premium-overlay">
                        <button 
                          className="watch-trailer-btn premium-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnrollClick(e, course.title || course.description, course.price || 299000);
                          }}
                        >
                          <Play size={16} />
                          🔥 사전예약
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="card-overlay premium-overlay">
                      <button 
                        className="watch-trailer-btn premium-btn available"
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
                
                <div className="card-content premium-content">
                  <div className="instructor-name premium-instructor">{course.instructor}</div>
                  <div className="divider premium-divider"></div>
                  <div className="course-description premium-description">{course.description}</div>
                  <div className="premium-price-info">
                    <span className="price premium-price">₩{course.price?.toLocaleString()}</span>
                    <span className="original-price premium-original">₩{course.originalPrice?.toLocaleString()}</span>
                    <span className="discount-badge premium-discount">
                      {course.originalPrice && course.price 
                        ? `${Math.round((1 - course.price / course.originalPrice) * 100)}% ${course.isComingSoon ? '런칭할인' : '할인'}`
                        : '할인'
                      }
                    </span>
                  </div>
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

        {/* 프리미엄 강의 섹션 */}
        <section className="masterclass-section">
          <div className="section-header-mc">
            <h2 className="section-title-mc">
              <span className="highlight-category">Premium Courses</span>
              <span className="premium-badge">💎 PREMIUM</span>
            </h2>
            <div className="section-nav">
              <button 
                className="nav-arrow"
                aria-label="Previous Premium courses"
                onClick={() => handleGridScroll(6, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next Premium courses"
                onClick={() => handleGridScroll(6, 'right')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div 
            className="masterclass-grid"
            ref={(el) => { gridRefs.current[6] = el; }}
          >
            {premiumClasses.map((course) => (
              <div key={course.id} className="masterclass-card premium-card" onClick={() => handleCourseClick(course)}>
                <div className="card-image-container">
                  <OptimizedImage 
                    src={course.image} 
                    alt={course.instructor}
                    className="instructor-image"
                    loading="lazy"
                    placeholder="true"
                  />
                  <div className="premium-badge-overlay">
                    {course.isComingSoon ? 'COMING SOON' : `₩${course.price?.toLocaleString()}`}
                  </div>
                  <div className="card-overlay">
                    <button 
                      className="watch-trailer-btn premium-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (course.isComingSoon) {
                          alert('곧 출시 예정입니다!');
                        } else {
                          handleCourseClick(course); // 강의 페이지로 이동
                        }
                      }}
                    >
                      <Play size={16} />
                      {course.isComingSoon ? 'Coming Soon' : '바로수강하기'}
                    </button>
                  </div>
                </div>
                <div className="course-info">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-subtitle">{course.subtitle}</p>
                  <p className="course-description">{course.description}</p>
                  {!course.isComingSoon && (
                    <div className="price-info">
                      <span className="current-price">₩{course.price?.toLocaleString()}</span>
                      {course.originalPrice && (
                        <span className="original-price">₩{course.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  )}
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
            onClose={handlePaymentClose}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    );
  };

  export default MainPage;