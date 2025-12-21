import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';

interface LiveSession {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'upcoming' | 'live' | 'ended';
  youtubeUrl?: string;
  replayUrl?: string;
  description: string;
}

const LiveStep2Page: React.FC = () => {
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // 라이브 세션 데이터 (라이브 시작 후 추가 예정)
  const liveSessions: LiveSession[] = [];

  useEffect(() => {
    // 수강 여부 확인
    const userSession = sessionStorage.getItem('aicitybuilders_user_session');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        const enrollments = user?.enrolledCourses?.enrollments || [];
        // AI 에이전트 비기너 (Step 2) 수강 여부 확인
        const hasStep2 = enrollments.some((e: any) => 
          e.courseId === 'chatgpt-agent-beginner' || e.courseId === 'ai-agent-beginner'
        );
        setIsEnrolled(hasStep2);
      } catch (e) {
        console.error('사용자 정보 파싱 오류:', e);
      }
    }
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <span className="live-badge live">🔴 LIVE</span>;
      case 'upcoming':
        return <span className="live-badge upcoming">📅 예정</span>;
      case 'ended':
        return <span className="live-badge ended">📹 다시보기</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a' }}>
        <NavigationBar />
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          padding: '100px 20px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '20px' }}>
            수강생 전용 페이지입니다
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '30px' }}>
            AI 에이전트 비기너 강의를 수강하시면<br/>
            라이브 세션에 참여하실 수 있습니다.
          </p>
          <button
            onClick={() => navigate('/chatgpt-agent-beginner')}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '1.1rem',
              fontWeight: '700',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            강의 보러가기 →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <NavigationBar />
      
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ 
            display: 'inline-block',
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            padding: '8px 20px',
            borderRadius: '30px',
            marginBottom: '20px'
          }}>
            <span style={{ color: 'white', fontWeight: '700' }}>STEP 2</span>
          </div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem', 
            fontWeight: '800',
            marginBottom: '15px'
          }}>
            🤖 AI 에이전트 비기너 라이브
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            수강생 전용 라이브 세션입니다. 실시간으로 질문하고 배워보세요!
          </p>
        </div>

        {/* 라이브 세션 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {liveSessions.map((session) => (
            <div
              key={session.id}
              style={{
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                border: '1px solid #334155',
                borderRadius: '16px',
                padding: '25px',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>
                  {session.title}
                </h3>
                {getStatusBadge(session.status)}
              </div>
              
              <p style={{ color: '#94a3b8', marginBottom: '15px', lineHeight: '1.6' }}>
                {session.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  📅 {session.date} | ⏰ {session.time}
                </div>
                
                {session.status === 'live' && (
                  <button
                    onClick={() => window.open(session.youtubeUrl, '_blank')}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    🔴 라이브 참여하기
                  </button>
                )}
                
                {session.status === 'ended' && session.replayUrl && (
                  <button
                    onClick={() => window.open(session.replayUrl, '_blank')}
                    style={{
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    📹 다시보기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 안내 */}
        <div style={{
          marginTop: '40px',
          background: 'linear-gradient(135deg, #06b6d420, #0891b210)',
          border: '1px solid #06b6d450',
          borderRadius: '16px',
          padding: '25px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#06b6d4', marginBottom: '15px', fontSize: '1.2rem' }}>
            💬 커뮤니티에서 소통하세요
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
            수강생 전용 커뮤니티에서 질문하고 정보를 나눠보세요!
          </p>
          <button
            onClick={() => window.location.href = '/community/step2'}
            style={{
              background: '#06b6d4',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            커뮤니티 바로가기 →
          </button>
        </div>
      </div>

      <style>{`
        .live-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .live-badge.live {
          background: #ef4444;
          color: white;
          animation: pulse 2s infinite;
        }
        .live-badge.upcoming {
          background: #3b82f6;
          color: white;
        }
        .live-badge.ended {
          background: #6366f1;
          color: white;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default LiveStep2Page;

