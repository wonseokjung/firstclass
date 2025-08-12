import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, User, BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import AzureTableService from '../services/azureTableService';

interface UserDashboardPageProps {
  onBack: () => void;
}

interface UserStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLearningTime: number;
  enrolledCourses: any[];
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalLearningTime: 0,
    enrolledCourses: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserInfo = localStorage.getItem('clathon_user');
        if (!storedUserInfo) {
          alert('로그인이 필요합니다.');
          navigate('/login');
          return;
        }

        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);

        // Azure에서 사용자의 수강 정보 가져오기
        const enrollments = await AzureTableService.getUserEnrollmentsFromUsers(parsedUserInfo.userId);
        
        const stats: UserStats = {
          totalCourses: enrollments.length,
          completedCourses: enrollments.filter(course => course.status === 'completed').length,
          inProgressCourses: enrollments.filter(course => course.status === 'active').length,
          totalLearningTime: enrollments.reduce((total, course) => total + (course.learningTimeMinutes || 0), 0),
          enrolledCourses: enrollments
        };

        setUserStats(stats);
      } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  const getProgressPercentage = () => {
    if (userStats.totalCourses === 0) return 0;
    return Math.round((userStats.completedCourses / userStats.totalCourses) * 100);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="loading-text">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* 헤더 */}
      <header className="masterclass-header-original">
        <div className="header-content">
          <div className="header-left">
            <div className="logo" onClick={onBack} style={{ cursor: 'pointer' }}>
              <span className="logo-icon">C</span>
              <span className="logo-text">CLATHON</span>
            </div>
            <div className="browse-dropdown">
              <button 
                className="browse-btn"
                aria-label="Browse AI & Technology courses"
                aria-expanded="false"
              >
                AI & Technology <ChevronRight size={16} />
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
            <button className="nav-link" onClick={onBack}>메인으로</button>
            <button className="nav-link">FAQ</button>
            <span className="user-welcome">안녕하세요, {userInfo?.name || userInfo?.email}님!</span>
            <button 
              className="nav-link" 
              onClick={() => {
                localStorage.removeItem('clathon_user');
                alert('로그아웃되었습니다.');
                navigate('/');
              }}
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 대시보드 콘텐츠 */}
      <div className="dashboard-content">
        <div className="dashboard-container">
          {/* 사용자 프로필 섹션 */}
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">
                <User size={48} />
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{userInfo?.name || '사용자'}</h1>
                <p className="profile-email">{userInfo?.email}</p>
                <div className="profile-stats">
                  <span className="stat-badge">
                    AI 학습자 Level {Math.floor(userStats.totalCourses / 3) + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 학습 통계 */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <BookOpen size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{userStats.totalCourses}</h3>
                <p className="stat-label">수강 중인 강의</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Award size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{userStats.completedCourses}</h3>
                <p className="stat-label">완료한 강의</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{formatTime(userStats.totalLearningTime)}</h3>
                <p className="stat-label">총 학습 시간</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{getProgressPercentage()}%</h3>
                <p className="stat-label">전체 진도율</p>
              </div>
            </div>
          </div>

          {/* 수강 중인 강의 목록 */}
          <div className="enrolled-courses-section">
            <h2 className="section-title">수강 중인 강의</h2>
            
            {userStats.enrolledCourses.length > 0 ? (
              <div className="courses-grid">
                {userStats.enrolledCourses.map((course, index) => (
                  <div key={index} className="course-card">
                    <div className="course-header">
                      <h3 className="course-title">{course.title}</h3>
                      <span className={`course-status ${course.status}`}>
                        {course.status === 'active' ? '수강 중' : 
                         course.status === 'completed' ? '완료' : '일시정지'}
                      </span>
                    </div>
                    
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{course.progress || 0}% 완료</span>
                    </div>
                    
                    <div className="course-meta">
                      <p className="course-enrolled">
                        수강 시작: {new Date(course.enrolledAt).toLocaleDateString()}
                      </p>
                      {course.learningTimeMinutes && (
                        <p className="course-time">
                          학습 시간: {formatTime(course.learningTimeMinutes)}
                        </p>
                      )}
                    </div>
                    
                    <button className="course-continue-btn">
                      {course.status === 'completed' ? '다시 보기' : '이어서 학습'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <BookOpen size={64} className="empty-icon" />
                <h3>아직 수강 중인 강의가 없습니다</h3>
                <p>CLATHON의 다양한 AI 강의를 둘러보세요!</p>
                <button className="cta-button" onClick={onBack}>
                  강의 둘러보기
                </button>
              </div>
            )}
          </div>

          {/* 학습 권장사항 */}
          <div className="recommendations-section">
            <h2 className="section-title">추천 강의</h2>
            <div className="recommendation-cards">
              <div className="recommendation-card">
                <h3>ChatGPT의 정석</h3>
                <p>AI 기초부터 실무 활용까지</p>
                <button className="recommendation-btn">자세히 보기</button>
              </div>
              <div className="recommendation-card">
                <h3>AI 비즈니스 전략</h3>
                <p>비즈니스에 AI를 적용하는 방법</p>
                <button className="recommendation-btn">자세히 보기</button>
              </div>
              <div className="recommendation-card">
                <h3>AI 코딩 완전정복</h3>
                <p>개발자를 위한 AI 도구 활용법</p>
                <button className="recommendation-btn">자세히 보기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;

