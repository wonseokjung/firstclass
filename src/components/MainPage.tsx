import React, { useEffect, useRef, useCallback } from 'react';
import { Play, Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

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

interface MainPageProps {
  onCourseSelect: (courseId: number) => void;
  onPaymentClick: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onCourseSelect, onPaymentClick }) => {
  const gridRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleCourseClick = (course: Course) => {
    // 모든 코스는 onCourseSelect로 처리 (다큐멘터리도 포함)
    onCourseSelect(course.id);
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
            <button className="nav-link">At Work</button>
            <button className="nav-link">Gifts</button>
            <button className="nav-link">View Plans</button>
            <button className="nav-link">Log In</button>
            <button className="cta-button">Get CLATHON</button>
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
                  {course.isNew && <div className="new-badge">New</div>}
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
                
                <div className="card-content">
                  <div className="instructor-name">{course.instructor}</div>
                  <div className="divider"></div>
                  <div className="course-description">{course.description}</div>
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
                onClick={() => handleGridScroll(1, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next ChatGPT courses"
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
                  {course.isNew && <div className="new-badge">New</div>}
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
                
                <div className="card-content">
                  <div className="instructor-name">{course.instructor}</div>
                  <div className="divider"></div>
                  <div className="course-description">{course.description}</div>
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
                onClick={() => handleGridScroll(2, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next Google AI courses"
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
                  {course.isNew && <div className="new-badge">New</div>}
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
                
                <div className="card-content">
                  <div className="instructor-name">{course.instructor}</div>
                  <div className="divider"></div>
                  <div className="course-description">{course.description}</div>
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
                onClick={() => handleGridScroll(3, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next Business courses"
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
                  {course.isNew && <div className="new-badge">New</div>}
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
                
                <div className="card-content">
                  <div className="instructor-name">{course.instructor}</div>
                  <div className="divider"></div>
                  <div className="course-description">{course.description}</div>
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
                onClick={() => handleGridScroll(4, 'left')}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="nav-arrow"
                aria-label="Next AI Coding courses"
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
                  {course.isNew && <div className="new-badge">New</div>}
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
                
                <div className="card-content">
                  <div className="instructor-name">{course.instructor}</div>
                  <div className="divider"></div>
                  <div className="course-description">{course.description}</div>
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
                  {course.isNew && <div className="new-badge">New</div>}
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
                
                <div className="card-content">
                  <div className="instructor-name">{course.instructor}</div>
                  <div className="divider"></div>
                  <div className="course-description">{course.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 하단 회사 정보 */}
      <footer className="company-footer">
        <div className="company-content">
          <div className="company-info">
            <h3 className="company-name">커넥젼에이아이 ConnexionAI</h3>
            <p className="company-address">서울특별시 서초구 강남대로61길 17, 1901호</p>
            <p className="company-slogan">AI 교육의 완주를 함께</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;