import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface LiveSession {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'upcoming' | 'live' | 'ended';
  zoomLink?: string;
  youtubeLink?: string;
  description: string;
}

interface CourseInfo {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgGradient: string;
  isComingSoon: boolean;
  liveSessions: LiveSession[];
}

const LivePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseParam = searchParams.get('course');
  
  const [selectedCourse, setSelectedCourse] = useState<string>(courseParam || 'step1');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // 로그인 상태 확인
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUserName(user.name || user.email);
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const courses: CourseInfo[] = [
    {
      id: 'step1',
      step: 1,
      title: 'AI 건물주 되기',
      subtitle: 'AI로 콘텐츠 만들기 & 비즈니스 마인드 갖추기',
      icon: '🏢',
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
      isComingSoon: false,
      liveSessions: [
        {
          id: 'step1-live1',
          title: '🎬 AI 건물주 Q&A 라이브',
          date: '2025-12-14',
          time: '20:00',
          status: 'upcoming',
          zoomLink: '',
          description: 'AI 콘텐츠 제작 관련 질문 답변 및 실시간 피드백'
        },
        {
          id: 'step1-live2',
          title: '💡 수강생 성공사례 공유',
          date: '2025-12-21',
          time: '20:00',
          status: 'upcoming',
          description: '실제 수익을 내고 있는 수강생들의 노하우 공유'
        }
      ]
    },
    {
      id: 'step2',
      step: 2,
      title: 'AI 에이전트 비기너',
      subtitle: '여러 AI를 하나의 회사처럼',
      icon: '🤖',
      color: '#06b6d4',
      bgGradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)',
      isComingSoon: false,
      liveSessions: [
        {
          id: 'step2-live1',
          title: '🔧 AI 에이전트 실습 라이브',
          date: '2025-12-15',
          time: '20:00',
          status: 'upcoming',
          description: 'ChatGPT 에이전트 설정 및 활용 실습'
        },
        {
          id: 'step2-live2',
          title: '⚡ n8n 자동화 워크숍',
          date: '2025-12-22',
          time: '20:00',
          status: 'upcoming',
          description: 'n8n을 활용한 업무 자동화 실전 강의'
        }
      ]
    },
    {
      id: 'step3',
      step: 3,
      title: 'connexionai',
      subtitle: 'AI 수익화 전문 자동화 에이전트',
      icon: '⚡',
      color: '#eab308',
      bgGradient: 'linear-gradient(135deg, #a16207 0%, #eab308 100%)',
      isComingSoon: true,
      liveSessions: []
    },
    {
      id: 'step4',
      step: 4,
      title: '1인 콘텐츠 기업 만들기',
      subtitle: '바이브코딩으로 서비스 개발',
      icon: '🚀',
      color: '#a855f7',
      bgGradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      isComingSoon: true,
      liveSessions: []
    }
  ];

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

  const getStatusBadge = (status: LiveSession['status']) => {
    switch (status) {
      case 'live':
        return (
          <span style={{
            background: '#ef4444',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            animation: 'pulse 2s infinite'
          }}>
            🔴 LIVE
          </span>
        );
      case 'upcoming':
        return (
          <span style={{
            background: '#3b82f6',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            📅 예정
          </span>
        );
      case 'ended':
        return (
          <span style={{
            background: '#6b7280',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            ✅ 종료
          </span>
        );
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '60px 40px',
          textAlign: 'center',
          maxWidth: '500px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '15px' }}>
            수강생 전용 라이브
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '30px', lineHeight: '1.6' }}>
            라이브 세션에 참여하려면 로그인이 필요합니다.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              로그인하기
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white'
    }}>
      {/* 헤더 */}
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            📺 수강생 전용 라이브
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            안녕하세요, {userName}님!
          </span>
          <button
            onClick={() => navigate('/community')}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            💬 게시판
          </button>
        </div>
      </header>

      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* 강의 선택 탭 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {courses.map(course => (
            <button
              key={course.id}
              onClick={() => !course.isComingSoon && setSelectedCourse(course.id)}
              disabled={course.isComingSoon}
              style={{
                background: selectedCourse === course.id 
                  ? course.bgGradient 
                  : 'rgba(255, 255, 255, 0.05)',
                border: selectedCourse === course.id 
                  ? 'none' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '25px',
                cursor: course.isComingSoon ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                opacity: course.isComingSoon ? 0.5 : 1,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {course.isComingSoon && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#f59e0b',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Coming Soon
                </div>
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '10px'
              }}>
                <span style={{ fontSize: '2rem' }}>{course.icon}</span>
                <span style={{
                  background: course.color,
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}>
                  STEP {course.step}
                </span>
              </div>
              <h3 style={{
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '5px'
              }}>
                {course.title}
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                margin: 0
              }}>
                {course.subtitle}
              </p>
            </button>
          ))}
        </div>

        {/* 선택된 강의의 라이브 세션 */}
        {selectedCourseData && (
          <div>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <span>{selectedCourseData.icon}</span>
              {selectedCourseData.title} 라이브 일정
            </h2>

            {selectedCourseData.liveSessions.length === 0 ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📅</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
                  아직 예정된 라이브가 없습니다
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  곧 라이브 일정이 공지됩니다. 조금만 기다려주세요!
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                {selectedCourseData.liveSessions.map(session => (
                  <div
                    key={session.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '30px',
                      border: session.status === 'live' 
                        ? `2px solid ${selectedCourseData.color}` 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '15px',
                      flexWrap: 'wrap',
                      gap: '15px'
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '1.4rem',
                          fontWeight: '700',
                          marginBottom: '10px'
                        }}>
                          {session.title}
                        </h3>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '1rem'
                        }}>
                          <span>📅 {formatDate(session.date)}</span>
                          <span>🕗 {session.time}</span>
                        </div>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                    
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '20px',
                      lineHeight: '1.6'
                    }}>
                      {session.description}
                    </p>

                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      {session.status === 'live' && session.zoomLink && (
                        <a
                          href={session.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          🎥 Zoom 참여하기
                        </a>
                      )}
                      {session.status === 'upcoming' && (
                        <button
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            padding: '12px 24px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          🔔 알림 받기
                        </button>
                      )}
                      {session.youtubeLink && (
                        <a
                          href={session.youtubeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          ▶️ YouTube 다시보기
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 안내 섹션 */}
        <div style={{
          marginTop: '60px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '30px'
        }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>
            📌 라이브 참여 안내
          </h3>
          <ul style={{
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '2',
            paddingLeft: '20px'
          }}>
            <li>라이브는 각 강의 수강생만 참여 가능합니다.</li>
            <li>라이브 시작 10분 전에 접속해주세요.</li>
            <li>질문은 채팅창을 통해 자유롭게 해주세요.</li>
            <li>라이브 종료 후 다시보기가 제공됩니다.</li>
            <li>라이브 일정은 사전 공지 후 변경될 수 있습니다.</li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default LivePage;

