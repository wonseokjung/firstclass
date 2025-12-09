import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';

// 라이브 일정 타입
interface LiveSchedule {
  id: string;
  title: string;
  description: string;
  vimeoEventId: string; // Vimeo 이벤트 ID 또는 비디오 ID
  scheduledDate: Date;
  duration: string;
  instructor: string;
  isLive: boolean;
  thumbnail?: string;
}

// 라이브 일정 데이터 (이 부분을 나중에 DB에서 가져올 수 있음)
const LIVE_SCHEDULES: LiveSchedule[] = [
  {
    id: 'live-1',
    title: '🔴 AI 이미지 수익화 실전 Q&A',
    description: 'Step 1 수강생들을 위한 실시간 Q&A 세션! 궁금한 점 모두 물어보세요.',
    vimeoEventId: '1044498498', // Vimeo 비디오/이벤트 ID
    scheduledDate: new Date('2025-12-15T20:00:00+09:00'),
    duration: '90분',
    instructor: '정원석 (AI 멘토 제이)',
    isLive: false,
    thumbnail: '/images/main/1.jpeg'
  },
  {
    id: 'live-2',
    title: '🤖 AI 에이전트 라이브 코딩',
    description: 'Google OPAL을 활용한 에이전트 제작 실습을 함께 해봅니다.',
    vimeoEventId: '1044498498',
    scheduledDate: new Date('2025-12-20T20:00:00+09:00'),
    duration: '120분',
    instructor: '정원석 (AI 멘토 제이)',
    isLive: false,
    thumbnail: '/images/main/2.jpeg'
  }
];

const LiveHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedLive, setSelectedLive] = useState<LiveSchedule | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

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

    // 현재 시간 업데이트 (1분마다)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 라이브 시작 시간까지 남은 시간 계산
  const getTimeUntil = (date: Date) => {
    const diff = date.getTime() - currentTime.getTime();
    if (diff <= 0) return '지금 시작!';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}일 ${hours}시간 후`;
    if (hours > 0) return `${hours}시간 ${minutes}분 후`;
    return `${minutes}분 후`;
  };

  // 날짜 포맷
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 현재 라이브 중인지 확인
  const isCurrentlyLive = (schedule: LiveSchedule) => {
    return schedule.isLive;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <NavigationBar />
      
      {/* 선택된 라이브가 있으면 Vimeo 플레이어 표시 */}
      {selectedLive ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
          {/* 뒤로가기 */}
          <button
            onClick={() => setSelectedLive(null)}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: 'none',
              padding: '10px 0',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            ← 라이브 목록으로
          </button>

          {/* 라이브 헤더 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            marginBottom: '20px'
          }}>
            {isCurrentlyLive(selectedLive) && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                padding: '8px 16px',
                borderRadius: '20px',
                animation: 'pulse 2s infinite'
              }}>
                <span style={{ 
                  width: '10px', 
                  height: '10px', 
                  background: '#fff', 
                  borderRadius: '50%',
                  animation: 'blink 1s infinite'
                }}></span>
                <span style={{ color: 'white', fontWeight: '700', fontSize: '0.85rem' }}>LIVE</span>
              </div>
            )}
            <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>
              {selectedLive.title}
            </h1>
          </div>

          {/* Vimeo 플레이어 */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%', // 16:9 비율
            background: '#000',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '25px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}>
            <iframe
              src={`https://player.vimeo.com/video/${selectedLive.vimeoEventId}?autoplay=1&title=0&byline=0&portrait=0`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={selectedLive.title}
            />
          </div>

          {/* 라이브 정보 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {/* 라이브 설명 */}
            <div style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid #334155'
            }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '15px' }}>
                📋 세션 정보
              </h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.7', marginBottom: '20px' }}>
                {selectedLive.description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#64748b' }}>👨‍🏫</span>
                  <span style={{ color: 'white' }}>{selectedLive.instructor}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#64748b' }}>⏱️</span>
                  <span style={{ color: 'white' }}>{selectedLive.duration}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#64748b' }}>📅</span>
                  <span style={{ color: 'white' }}>{formatDate(selectedLive.scheduledDate)}</span>
                </div>
              </div>
            </div>

            {/* 안내사항 */}
            <div style={{
              background: 'linear-gradient(135deg, #dc262615, #991b1b10)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid #dc262640'
            }}>
              <h3 style={{ color: '#f87171', fontSize: '1.2rem', marginBottom: '15px' }}>
                📢 라이브 안내
              </h3>
              <ul style={{ 
                color: '#94a3b8', 
                lineHeight: '2',
                paddingLeft: '20px',
                margin: 0
              }}>
                <li>라이브 시작 10분 전 입장 권장</li>
                <li>채팅으로 실시간 질문 가능</li>
                <li>라이브 종료 후 다시보기 제공</li>
                <li>소리가 안 들리면 음소거 해제 확인</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* 라이브 목록 화면 */
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
          {/* 헤더 */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, #dc2626, #991b1b)',
          padding: '10px 25px',
          borderRadius: '30px',
              marginBottom: '25px',
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

        <h1 style={{ 
          color: 'white', 
              fontSize: '2.8rem', 
          fontWeight: '800',
              marginBottom: '15px',
          lineHeight: '1.3'
        }}>
              📺 실시간 라이브 강의
        </h1>
        
        <p style={{ 
          color: '#94a3b8', 
              fontSize: '1.15rem',
          lineHeight: '1.6'
        }}>
              수강생 전용 실시간 Q&A와 라이브 코딩 세션
            </p>
          </div>

          {/* 라이브 카드 목록 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '50px' }}>
            {LIVE_SCHEDULES.map((schedule) => (
              <div
                key={schedule.id}
                onClick={() => isLoggedIn ? setSelectedLive(schedule) : navigate('/login')}
                style={{
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                  borderRadius: '20px',
                  padding: '0',
                  border: isCurrentlyLive(schedule) ? '2px solid #dc2626' : '1px solid #334155',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'row'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* 썸네일 */}
        <div style={{
                  width: '280px',
                  minHeight: '180px',
                  background: schedule.thumbnail 
                    ? `url(${schedule.thumbnail}) center/cover`
                    : 'linear-gradient(135deg, #dc2626, #991b1b)',
          position: 'relative',
                  flexShrink: 0
                }}>
                  {isCurrentlyLive(schedule) && (
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#dc2626',
                      padding: '6px 12px',
                      borderRadius: '15px'
                    }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#fff', 
                        borderRadius: '50%',
                        animation: 'blink 1s infinite'
                      }}></span>
                      <span style={{ color: 'white', fontWeight: '700', fontSize: '0.75rem' }}>LIVE</span>
                    </div>
                  )}
          <div style={{
            position: 'absolute',
                    bottom: '15px',
                    right: '15px',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.8rem'
                  }}>
                    {schedule.duration}
                  </div>
                </div>

                {/* 정보 */}
                <div style={{ padding: '25px', flex: 1 }}>
                  <h3 style={{ 
                    color: 'white', 
                    fontSize: '1.4rem', 
              fontWeight: '700',
                    marginBottom: '10px'
            }}>
                    {schedule.title}
                  </h3>
            
            <p style={{ 
                    color: '#94a3b8', 
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: '15px'
                  }}>
                    {schedule.description}
                  </p>

            <div style={{
              display: 'flex',
                    alignItems: 'center', 
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      👨‍🏫 {schedule.instructor}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      📅 {formatDate(schedule.scheduledDate)}
                    </span>
                  </div>

                  {/* 카운트다운 또는 입장 버튼 */}
                  <div style={{ marginTop: '20px' }}>
                    {isCurrentlyLive(schedule) ? (
                      <button style={{
                        background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 30px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}>
                        🔴 라이브 입장하기
                      </button>
                    ) : (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: '#1e3a8a20',
                        padding: '10px 20px',
                        borderRadius: '10px'
                      }}>
                        <span style={{ color: '#60a5fa', fontSize: '1.2rem' }}>⏰</span>
                        <span style={{ color: '#60a5fa', fontWeight: '600' }}>
                          {getTimeUntil(schedule.scheduledDate)}
                </span>
                      </div>
                    )}
            </div>
          </div>
              </div>
            ))}
        </div>

          {/* 로그인 안내 */}
          {!isLoggedIn && (
          <div style={{
              background: 'linear-gradient(135deg, #dc262620, #991b1b10)',
              border: '1px solid #dc262650',
            borderRadius: '16px',
              padding: '30px',
              textAlign: 'center',
            marginBottom: '30px'
          }}>
              <p style={{ color: 'white', marginBottom: '20px', fontSize: '1.1rem' }}>
                🔒 라이브 시청은 로그인 후 이용 가능합니다
            </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                  color: 'white',
                  border: 'none',
                    padding: '14px 35px',
                  borderRadius: '10px',
                  fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '1rem'
                }}
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  background: 'transparent',
                  color: '#dc2626',
                    border: '2px solid #dc2626',
                    padding: '14px 35px',
                  borderRadius: '10px',
                  fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '1rem'
                }}
              >
                회원가입
              </button>
            </div>
          </div>
          )}

          {/* 로그인 상태면 환영 메시지 */}
          {isLoggedIn && (
          <div style={{
              background: 'linear-gradient(135deg, #10b98120, #05966910)',
              border: '1px solid #10b98150',
            borderRadius: '16px',
              padding: '25px',
              textAlign: 'center',
              marginBottom: '30px'
          }}>
              <p style={{ color: '#34d399', fontSize: '1.1rem', margin: 0 }}>
                ✅ {userName}님, 라이브 카드를 클릭하면 바로 시청할 수 있어요!
            </p>
          </div>
        )}

          {/* 메인으로 */}
          <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            color: '#64748b',
            border: '1px solid #334155',
                padding: '12px 30px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          ← 메인으로 돌아가기
        </button>
      </div>
        </div>
      )}

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
        }
        @media (max-width: 640px) {
          div[style*="flex-direction: row"] {
            flex-direction: column !important;
          }
          div[style*="width: 280px"] {
            width: 100% !important;
            height: 200px !important;
            min-height: 200px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveHubPage;
