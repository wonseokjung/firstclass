import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';

const LiveHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userSession = sessionStorage.getItem('aicitybuilders_user_session');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        setIsLoggedIn(true);
        setUserName(user?.name || user?.email || '');
      } catch (e) {
        console.error('사용자 정보 파싱 오류:', e);
      }
    }
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <NavigationBar />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        {/* 라이브 아이콘 */}
        <div style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, #dc2626, #991b1b)',
          padding: '10px 25px',
          borderRadius: '30px',
          marginBottom: '30px',
          animation: 'pulse 2s infinite'
        }}>
          <span style={{ 
            width: '12px', 
            height: '12px', 
            background: '#fff', 
            borderRadius: '50%',
            animation: 'blink 1s infinite'
          }}></span>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '1rem' }}>LIVE</span>
        </div>

        {/* 메인 타이틀 */}
        <h1 style={{ 
          color: 'white', 
          fontSize: '3rem', 
          fontWeight: '800',
          marginBottom: '20px',
          lineHeight: '1.3'
        }}>
          📺 수강생 전용 라이브
        </h1>
        
        <p style={{ 
          color: '#94a3b8', 
          fontSize: '1.2rem',
          marginBottom: '50px',
          lineHeight: '1.6'
        }}>
          각 강의별 실시간 라이브 세션으로<br/>
          직접 질문하고 배워보세요!
        </p>

        {/* 준비중 카드 */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '2px solid #dc262650',
          borderRadius: '24px',
          padding: '50px 40px',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 효과 */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, #dc262620 0%, transparent 70%)',
            borderRadius: '50%'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '5rem', marginBottom: '25px' }}>🎬</div>
            
            <h2 style={{ 
              color: '#dc2626', 
              fontSize: '2rem', 
              fontWeight: '700',
              marginBottom: '20px'
            }}>
              라이브 서비스 준비중
            </h2>
            
            <p style={{ 
              color: 'white', 
              fontSize: '1.1rem',
              lineHeight: '1.8',
              marginBottom: '30px'
            }}>
              더 나은 라이브 경험을 위해<br/>
              열심히 준비하고 있습니다!<br/><br/>
              <span style={{ color: '#dc2626' }}>곧 만나요! 🔥</span>
            </p>

            {/* 예정 기능 */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px',
              justifyContent: 'center',
              marginBottom: '30px'
            }}>
              {['실시간 Q&A', '화면 공유', '채팅', '다시보기'].map((feature) => (
                <span key={feature} style={{
                  background: '#dc262620',
                  color: '#f87171',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 로그인 안내 또는 알림 설정 */}
        {!isLoggedIn ? (
          <div style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '25px',
            marginBottom: '30px'
          }}>
            <p style={{ color: '#94a3b8', marginBottom: '15px', fontSize: '1rem' }}>
              라이브 오픈 알림을 받으려면 로그인하세요
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  background: 'transparent',
                  color: '#dc2626',
                  border: '1px solid #dc2626',
                  padding: '12px 30px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                회원가입
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #dc262620, #991b1b10)',
            border: '1px solid #dc262650',
            borderRadius: '16px',
            padding: '25px'
          }}>
            <p style={{ color: 'white', fontSize: '1rem' }}>
              👋 {userName}님, 라이브 오픈 시 알려드릴게요!
            </p>
          </div>
        )}

        {/* 돌아가기 버튼 */}
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '30px',
            background: 'transparent',
            color: '#64748b',
            border: '1px solid #334155',
            padding: '12px 25px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          ← 메인으로 돌아가기
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          50% { box-shadow: 0 0 0 15px rgba(220, 38, 38, 0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 768px) {
          h1 { font-size: 2rem !important; }
          h2 { font-size: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default LiveHubPage;
