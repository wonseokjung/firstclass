import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, User, BookOpen, Clock, Award, TrendingUp, Play, Star, Users, Calendar, CheckCircle, BarChart3, Target, Zap, Settings } from 'lucide-react';
import AzureTableService from '../services/azureTableService';
import NavigationBar from './NavigationBar';

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
  const location = useLocation();
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
        // sessionStorage에서 사용자 정보 가져오기
        const storedUserInfo = sessionStorage.getItem('clathon_user_session');
        if (!storedUserInfo) {
          alert('로그인이 필요합니다.');
          navigate('/login');
          return;
        }

        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);

        // Azure에서 사용자의 수강 정보 가져오기 - 이메일 기반
        console.log('🔍 대시보드에서 수강 정보 조회 시작:', parsedUserInfo.email);
        const enrollments = await AzureTableService.getUserEnrollmentsByEmail(parsedUserInfo.email);
        console.log('📋 대시보드에서 가져온 수강 정보:', enrollments);
        
        const stats: UserStats = {
          totalCourses: enrollments.length,
          completedCourses: enrollments.filter((course: any) => course.status === 'completed').length,
          inProgressCourses: enrollments.filter((course: any) => course.status === 'active').length,
          totalLearningTime: enrollments.reduce((total: number, course: any) => total + (course.learningTimeMinutes || 0), 0),
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

  const handleLogout = () => {
    sessionStorage.removeItem('clathon_user_session');
    localStorage.removeItem('clathon_user');
    alert('로그아웃되었습니다.');
    navigate('/');
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
    <div className="masterclass-container">
      {/* 통일된 네비게이션바 */}
      <NavigationBar 
        onBack={onBack}
        showSearch={true}
        searchPlaceholder="수강 중인 강의를 검색하세요..."
        breadcrumbText="내 학습 현황"
      />

      {/* 대시보드 히어로 섹션 */}
      <section style={{ 
        background: 'linear-gradient(135deg, #000000, #1a1a1a, #2d3748)',
        padding: '60px 0',
        borderBottom: '1px solid #333'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          {/* 웰컴 메시지 */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '15px'
            }}>
              안녕하세요, {userInfo?.name || '사용자'}님! 👋
            </h1>
            <p style={{ 
              fontSize: '1.1rem',
              color: '#ccc',
              marginBottom: '0'
            }}>
              오늘도 새로운 지식을 쌓아가는 멋진 하루 되세요!
            </p>
          </div>

          {/* 통계 카드 그리드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* 총 수강 강의 카드 */}
            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                background: 'var(--color-primary)',
                borderRadius: '50%',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <BookOpen size={24} color="white" />
              </div>
              <h3 style={{ 
                color: '#ccc', 
                fontSize: '0.9rem', 
                marginBottom: '10px',
                fontWeight: '500'
              }}>
                총 수강 강의
              </h3>
              <p style={{ 
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: '0 0 5px 0'
              }}>
                {userStats.totalCourses}
              </p>
              <p style={{ 
                color: '#999', 
                fontSize: '0.8rem', 
                margin: 0 
              }}>
                개 강의
              </p>
            </div>

            {/* 수강 중 카드 */}
            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                background: '#10b981',
                borderRadius: '50%',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Play size={24} color="white" />
              </div>
              <h3 style={{ 
                color: '#ccc', 
                fontSize: '0.9rem', 
                marginBottom: '10px',
                fontWeight: '500'
              }}>
                수강 중
              </h3>
              <p style={{ 
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: '0 0 5px 0'
              }}>
                {userStats.inProgressCourses}
              </p>
              <p style={{ 
                color: '#999', 
                fontSize: '0.8rem', 
                margin: 0 
              }}>
                개 진행 중
              </p>
            </div>

            {/* 완료한 강의 카드 */}
            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                background: '#f59e0b',
                borderRadius: '50%',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Award size={24} color="white" />
              </div>
              <h3 style={{ 
                color: '#ccc', 
                fontSize: '0.9rem', 
                marginBottom: '10px',
                fontWeight: '500'
              }}>
                완료한 강의
              </h3>
              <p style={{ 
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: '0 0 5px 0'
              }}>
                {userStats.completedCourses}
              </p>
              <p style={{ 
                color: '#999', 
                fontSize: '0.8rem', 
                margin: 0 
              }}>
                개 완료
              </p>
            </div>

            {/* 총 학습 시간 카드 */}
            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                background: '#8b5cf6',
                borderRadius: '50%',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Clock size={24} color="white" />
              </div>
              <h3 style={{ 
                color: '#ccc', 
                fontSize: '0.9rem', 
                marginBottom: '10px',
                fontWeight: '500'
              }}>
                총 학습 시간
              </h3>
              <p style={{ 
                color: 'white',
                fontSize: '1.8rem',
                fontWeight: '700',
                margin: '0 0 5px 0'
              }}>
                {formatTime(userStats.totalLearningTime)}
              </p>
              <p style={{ 
                color: '#999', 
                fontSize: '0.8rem', 
                margin: 0 
              }}>
                누적 시간
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 수강 중인 강의 섹션 */}
      <section style={{ padding: '80px 0', background: '#000' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ 
              fontSize: '2.2rem',
              fontWeight: '700',
              marginBottom: '15px',
              color: 'white'
            }}>
              📚 나의 학습 여정
            </h2>
            <p style={{ 
              fontSize: '1rem',
              color: '#999',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              현재 수강 중인 강의들을 확인하고 학습을 이어가세요
            </p>
          </div>
          
          {userStats.enrolledCourses.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {userStats.enrolledCourses.map((course, index) => (
                <div key={index} style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  padding: '30px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#333';
                }}
                >
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <h3 style={{ 
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        color: 'white',
                        margin: 0,
                        flex: 1
                      }}>
                        {course.title}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        background: course.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: course.status === 'active' ? '#10b981' : '#f59e0b',
                        border: `1px solid ${course.status === 'active' ? '#10b981' : '#f59e0b'}`
                      }}>
                        {course.status === 'active' ? '🔥 수강 중' : 
                         course.status === 'completed' ? '✅ 완료' : '⏸️ 일시정지'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.9rem', color: '#999' }}>진행률</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>
                        {course.progress || 0}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#333',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${course.progress || 0}%`,
                        height: '100%',
                        background: 'var(--color-primary)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} color="#999" />
                        <span style={{ fontSize: '0.8rem', color: '#999' }}>
                          {new Date(course.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                      {course.learningTimeMinutes && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={14} color="#999" />
                          <span style={{ fontSize: '0.8rem', color: '#999' }}>
                            {formatTime(course.learningTimeMinutes)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button className="watch-trailer-btn" style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: course.status === 'completed' 
                      ? '#f59e0b'
                      : 'var(--color-primary)',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <Play size={16} />
                    {course.status === 'completed' ? '다시 보기' : '이어서 학습'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px'
              }}>
                <BookOpen size={48} color="white" />
              </div>
              <h3 style={{ 
                fontSize: '1.4rem',
                fontWeight: '600',
                color: 'white',
                marginBottom: '15px'
              }}>
                아직 수강 중인 강의가 없습니다
              </h3>
              <p style={{ 
                color: '#999',
                fontSize: '1rem',
                marginBottom: '30px',
                lineHeight: 1.6
              }}>
                새로운 강의를 시작해서 AI 마스터의 길을 걸어보세요!
              </p>
              <button 
                onClick={onBack}
                className="watch-trailer-btn"
                style={{
                  padding: '15px 30px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Zap size={18} />
                강의 둘러보기
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 학습 진행률 요약 섹션 */}
      {userStats.enrolledCourses.length > 0 && (
        <section style={{ 
          background: 'linear-gradient(135deg, #1a1a1a, #2d3748)', 
          padding: '60px 0',
          borderTop: '1px solid #333'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 40px'
          }}>
            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              textAlign: 'center',
              background: 'rgba(26, 26, 26, 0.8)',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '40px'
            }}>
              <h3 style={{ 
                fontSize: '1.6rem',
                fontWeight: '600',
                marginBottom: '30px',
                color: 'white'
              }}>
                🎯 학습 진행률
              </h3>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: `conic-gradient(var(--color-primary) 0deg ${getProgressPercentage() * 3.6}deg, #333 ${getProgressPercentage() * 3.6}deg 360deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 30px',
                position: 'relative'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <span style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'var(--color-primary)'
                  }}>
                    {getProgressPercentage()}%
                  </span>
                  <span style={{ 
                    fontSize: '0.8rem',
                    color: '#999',
                    marginTop: '5px'
                  }}>
                    완료율
                  </span>
                </div>
              </div>
              <p style={{ 
                fontSize: '1rem',
                color: '#ccc',
                marginBottom: '10px'
              }}>
                전체 <strong style={{ color: 'white' }}>{userStats.totalCourses}개</strong> 강의 중 <strong style={{ color: 'white' }}>{userStats.completedCourses}개</strong>를 완료했습니다!
              </p>
              {userStats.inProgressCourses > 0 && (
                <p style={{ 
                  fontSize: '0.9rem',
                  color: '#999'
                }}>
                  현재 <strong style={{ color: 'white' }}>{userStats.inProgressCourses}개</strong> 강의를 수강 중입니다.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CLATHON</h3>
            <p>정원석의 정석 시리즈로 시작하는 AI 마스터 여정</p>
          </div>
          
          <div className="footer-section">
            <h4>빠른 링크</h4>
            <ul>
              <li><a href="/">홈</a></li>
              <li><a href="/workflow-automation">워크플로우 자동화</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>고객 지원</h4>
            <ul>
              <li><a href="/terms">이용약관</a></li>
              <li><a href="/privacy">개인정보처리방침</a></li>
              <li><a href="/contact">고객센터</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 커넥젼에이아이이. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboardPage;