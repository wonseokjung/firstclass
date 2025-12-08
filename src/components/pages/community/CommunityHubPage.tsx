import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

// 색상 테마: 네이비 + 골드
const theme = {
  navy: '#0f2744',
  navyLight: '#1e3a5f',
  navyDark: '#091a2e',
  gold: '#fbbf24',
  goldLight: '#fcd34d',
  goldMuted: '#f59e0b',
  white: '#ffffff',
  gray: '#64748b',
  grayLight: '#f1f5f9',
  grayBorder: '#e2e8f0'
};

interface CourseInfo {
  step: number;
  title: string;
  subtitle: string;
  icon: string;
  path: string;
  courseIds: string[];
}

const CommunityHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const courses: CourseInfo[] = [
    {
      step: 1,
      title: 'AI 건물주 되기',
      subtitle: 'AI로 콘텐츠 만들기 & 비즈니스 마인드',
      icon: '🏠',
      path: '/community/step1',
      courseIds: ['ai-building-course', 'ai-building', '999']
    },
    {
      step: 2,
      title: 'AI 에이전트 비기너',
      subtitle: '여러 AI를 하나의 회사처럼',
      icon: '🤖',
      path: '/community/step2',
      courseIds: ['chatgpt-agent-beginner', 'ai-agent-beginner', '1002']
    },
    {
      step: 3,
      title: 'connexionai',
      subtitle: 'AI 수익화 전문 자동화 에이전트',
      icon: '⚡',
      path: '/community/step3',
      courseIds: ['connexionai']
    },
    {
      step: 4,
      title: '1인 콘텐츠 기업 만들기',
      subtitle: '바이브코딩으로 서비스 개발',
      icon: '🚀',
      path: '/community/step4',
      courseIds: ['content-business']
    }
  ];

  useEffect(() => {
    const checkEnrollment = async () => {
      const userSession = sessionStorage.getItem('aicitybuilders_user_session');
      if (userSession) {
        try {
          const user = JSON.parse(userSession);
          setIsLoggedIn(true);
          setUserName(user?.name || user?.email || '');
          
          if (user?.email) {
            try {
              const azureUser = await AzureTableService.getUserByEmail(user.email);
              if (azureUser?.enrolledCourses) {
                let enrolledCoursesData: any = azureUser.enrolledCourses;
                if (typeof enrolledCoursesData === 'string') {
                  enrolledCoursesData = JSON.parse(enrolledCoursesData);
                }
                const enrollments = enrolledCoursesData?.enrollments || [];
                const enrolled = enrollments.map((e: any) => e.courseId);
                setEnrolledCourses(enrolled);
                
                const updatedUser = { ...user, enrolledCourses: enrolledCoursesData };
                sessionStorage.setItem('aicitybuilders_user_session', JSON.stringify(updatedUser));
              }
            } catch (azureError) {
              const enrollments = user?.enrolledCourses?.enrollments || [];
              const enrolled = enrollments.map((e: any) => e.courseId);
              setEnrolledCourses(enrolled);
            }
          }
        } catch (e) {
          console.error('사용자 정보 파싱 오류:', e);
        }
      }
      setLoading(false);
    };

    checkEnrollment();
  }, []);

  const isEnrolled = (courseIds: string[]) => {
    return courseIds.some(id => enrolledCourses.includes(id));
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: theme.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: `3px solid ${theme.grayBorder}`, borderTop: `3px solid ${theme.gold}`,
            borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px'
          }}></div>
          <p style={{ color: theme.gray }}>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.white }}>
      <NavigationBar />
      
      {/* 헤더 */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyLight} 100%)`,
        padding: 'clamp(40px, 6vw, 70px) 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', marginBottom: '15px' }}>💬</div>
          <h1 style={{ 
            color: theme.gold, 
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', 
            fontWeight: '800',
            marginBottom: '10px'
          }}>
            AI City Builders 커뮤니티
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
            수강생들과 함께 질문하고, 공유하고, 성장하세요!
          </p>

        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(30px, 5vw, 50px) 20px' }}>
        
        {/* 로그인/환영 배너 */}
        {!isLoggedIn ? (
          <div style={{
            background: theme.white, borderRadius: '16px', padding: '25px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '35px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '15px', border: `2px solid ${theme.grayBorder}`
          }}>
            <div>
              <p style={{ color: theme.navy, fontWeight: '600', fontSize: '1.05rem', marginBottom: '5px' }}>
                🔐 커뮤니티에 참여하려면 로그인이 필요합니다
              </p>
              <p style={{ color: theme.gray, fontSize: '0.9rem', margin: 0 }}>
                로그인하고 수강생들과 소통하세요!
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => navigate('/login')} style={{
                background: theme.navy, color: theme.gold, border: 'none',
                padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
              }}>로그인</button>
              <button onClick={() => navigate('/signup')} style={{
                background: theme.gold, color: theme.navy, border: 'none',
                padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
              }}>회원가입</button>
            </div>
          </div>
        ) : (
          <div style={{
            background: `linear-gradient(135deg, ${theme.navy}10, ${theme.gold}15)`,
            border: `2px solid ${theme.gold}50`,
            borderRadius: '16px', padding: '20px 25px', marginBottom: '35px'
          }}>
            <p style={{ color: theme.navy, fontSize: '1.05rem', margin: 0 }}>
              👋 <strong>{userName}</strong>님, 환영합니다! 
              {enrolledCourses.length > 0 ? (
                <span style={{ color: theme.goldMuted, fontWeight: '600' }}> ({enrolledCourses.length}개 강의 수강 중)</span>
              ) : (
                <span style={{ color: theme.gray }}> 아직 수강 중인 강의가 없습니다</span>
              )}
            </p>
          </div>
        )}

        {/* 섹션 타이틀 */}
        <h2 style={{ 
          color: theme.navy, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
          fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <span>📚</span> 강의별 커뮤니티
        </h2>

        {/* 강의 카드 그리드 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px' 
        }}>
          {courses.map((course) => {
            const enrolled = isEnrolled(course.courseIds);
            const isComingSoon = course.step >= 3;
            
            return (
              <div
                key={course.step}
                onClick={() => navigate(course.path)}
                style={{
                  background: theme.white,
                  border: `2px solid ${enrolled ? theme.gold : theme.grayBorder}`,
                  borderRadius: '20px',
                  padding: 'clamp(20px, 4vw, 28px)',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px ${theme.navy}20`;
                  e.currentTarget.style.borderColor = theme.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderColor = enrolled ? theme.gold : theme.grayBorder;
                }}
              >
                {/* 배경 장식 */}
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
                  background: `radial-gradient(circle, ${theme.gold}15 0%, transparent 70%)`,
                  transform: 'translate(30%, -30%)'
                }}></div>

                {/* 상태 배지 */}
                <div style={{
                  position: 'absolute', top: '15px', right: '15px',
                  padding: '5px 12px', borderRadius: '20px',
                  fontSize: '0.75rem', fontWeight: '700',
                  background: isComingSoon 
                    ? '#fef3c7' 
                    : (enrolled ? theme.gold : theme.grayLight),
                  color: isComingSoon 
                    ? '#d97706' 
                    : (enrolled ? theme.navy : theme.gray)
                }}>
                  {isComingSoon ? 'Coming Soon' : (enrolled ? '수강 중 ✓' : '미수강')}
                </div>

                {/* Step 배지 */}
                <div style={{
                  display: 'inline-block',
                  background: theme.navy,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  marginBottom: '18px'
                }}>
                  <span style={{ color: theme.gold, fontWeight: '700', fontSize: '0.8rem' }}>
                    STEP {course.step}
                  </span>
                </div>

                {/* 아이콘 */}
                <div style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', marginBottom: '12px' }}>
                  {course.icon}
                </div>

                {/* 제목 */}
                <h3 style={{ 
                  color: theme.navy, 
                  fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)', 
                  fontWeight: '700',
                  marginBottom: '6px'
                }}>
                  {course.title}
                </h3>

                {/* 부제목 */}
                <p style={{ 
                  color: theme.gray, 
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  marginBottom: '18px'
                }}>
                  {course.subtitle}
                </p>

                {/* 입장 버튼 */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  color: theme.gold, fontWeight: '700', fontSize: '0.95rem'
                }}>
                  커뮤니티 입장 <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 CTA */}
        <div style={{
          marginTop: '50px', textAlign: 'center', padding: '40px 25px',
          background: theme.navy, borderRadius: '20px'
        }}>
          <h3 style={{ color: theme.gold, fontSize: '1.25rem', marginBottom: '12px' }}>
            🎯 4단계 프리미엄 강의로 AI 콘텐츠 비즈니스를 시작하세요!
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '25px', lineHeight: '1.6' }}>
            인공지능 자동화 에이전트로 콘텐츠 비즈니스 월세 받기<br/>
            STEP 1 → STEP 2 → STEP 3 → STEP 4
          </p>
          <button onClick={() => navigate('/')} style={{
            background: theme.gold, color: theme.navy, border: 'none', 
            padding: '14px 35px', borderRadius: '12px', fontWeight: '700', 
            fontSize: '1rem', cursor: 'pointer'
          }}>
            ✨ 프리미엄 강의 보러가기
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CommunityHubPage;
