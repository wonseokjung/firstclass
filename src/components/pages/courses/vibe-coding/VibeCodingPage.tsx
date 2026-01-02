import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../../common/NavigationBar';
import { Rocket, Calendar, Code, Zap } from 'lucide-react';

interface VibeCodingPageProps {
  onBack: () => void;
}

const VibeCodingPage: React.FC<VibeCodingPageProps> = ({ onBack }) => {
  const navigate = useNavigate();

  // 오픈일: 2026년 1월 8일
  const openDate = new Date(2026, 0, 8);
  const now = new Date();
  const isOpen = now >= openDate;

  const handlePayment = () => {
    // 결제 페이지로 이동 (오픈 후)
    window.location.href = '/vibe-coding/payment';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
      color: '#ffffff',
      paddingBottom: isOpen ? '80px' : '0'
    }}>
      <NavigationBar onBack={onBack} breadcrumbText="Step 3: 바이브코딩" />
      
      {/* 고정 결제 버튼 */}
      <FloatingPaymentButton onClick={handlePayment} isOpen={isOpen} price={95000} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        {/* 아이콘 */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)'
        }}>
          <Code size={50} color="#ffffff" />
        </div>

        {/* 제목 */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '900',
          marginBottom: '15px',
          lineHeight: 1.3
        }}>
          Step 3: <span style={{ color: '#8b5cf6' }}>바이브코딩</span>
        </h1>

        {/* 서브타이틀 */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
          color: '#a78bfa',
          fontWeight: '600',
          marginBottom: '30px'
        }}>
          AI 수익화 도구 만들기
        </p>

        {/* 오픈 안내 배지 */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: isOpen ? 'rgba(34, 197, 94, 0.2)' : 'rgba(139, 92, 246, 0.2)',
          border: `2px solid ${isOpen ? '#22c55e' : '#8b5cf6'}`,
          padding: '15px 30px',
          borderRadius: '50px',
          marginBottom: '20px'
        }}>
          <Calendar size={24} color={isOpen ? '#22c55e' : '#8b5cf6'} />
          <span style={{
            color: isOpen ? '#22c55e' : '#a78bfa',
            fontWeight: '700',
            fontSize: '1.2rem'
          }}>
            {isOpen ? '🎉 지금 수강 가능!' : '📅 2026년 1월 8일 오픈'}
          </span>
        </div>

        {/* 가격 정보 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <span style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
            fontWeight: '900',
            color: '#ffd60a'
          }}>
            ₩95,000
          </span>
          <span style={{
            background: 'rgba(255, 215, 0, 0.2)',
            color: '#ffd60a',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '700'
          }}>
            3개월 수강권
          </span>
        </div>

        {/* 설명 */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '20px',
          padding: '30px',
          maxWidth: '600px',
          marginBottom: '40px',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <p style={{
            fontSize: '1.1rem',
            color: '#e2e8f0',
            lineHeight: 1.9,
            margin: 0
          }}>
            <strong style={{ color: '#8b5cf6' }}>Google Antigravity</strong>로
            자동화 에이전트와 웹/앱을 직접 개발!<br /><br />
            코딩을 몰라도 AI에게 말하면 완성됩니다.
            나만의 <strong style={{ color: '#ffd60a' }}>수익화 도구</strong>를 만들어보세요.
          </p>
        </div>

        {/* ✨ 이 강의에 포함된 것 - 간결한 버전 */}
        <div style={{
          background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
          padding: 'clamp(30px, 5vw, 50px)',
          borderRadius: '25px',
          marginBottom: '40px',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
          maxWidth: '800px',
          width: '100%'
        }}>
          <h3 style={{
            color: '#a78bfa',
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: 'clamp(25px, 4vw, 35px)'
          }}>
            이 강의에 포함된 것
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            {/* 📚 기본 강의 */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.15)',
              borderRadius: '20px',
              padding: 'clamp(25px, 4vw, 35px)',
              border: '2px solid rgba(139, 92, 246, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <span style={{ fontSize: '2.5rem' }}>📚</span>
                <h4 style={{ color: '#a78bfa', fontWeight: '800', fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', margin: 0 }}>
                  기본 강의 10개
                </h4>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                AI로 수익화 도구 만드는 방법을<br />
                <strong style={{ color: '#a78bfa' }}>10개 영상 강의</strong>로 체계적으로 배웁니다.<br />
                <span style={{ color: '#94a3b8' }}>구매 후 3개월간 무제한 시청</span>
              </p>
            </div>

            {/* 🔴 주간 라이브 */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '20px',
              padding: 'clamp(25px, 4vw, 35px)',
              border: '2px solid rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <span style={{ fontSize: '2.5rem' }}>🔴</span>
                <h4 style={{ color: '#ef4444', fontWeight: '800', fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', margin: 0 }}>
                  매주 프로젝트 라이브
                </h4>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: '#ef4444' }}>매주 목요일 밤 8시</strong> 실시간으로<br />
                함께 프로젝트를 진행합니다.<br />
                <span style={{ color: '#94a3b8' }}>다시보기: 해당 월에만 제공 (다음달 삭제)</span>
              </p>
            </div>
          </div>
        </div>

        {/* 특징 아이콘들 */}
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          {[
            { icon: <Code size={24} />, label: '웹/앱 개발' },
            { icon: <Zap size={24} />, label: '자동화 에이전트' },
            { icon: <Rocket size={24} />, label: 'AI 수익화' }
          ].map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(139, 92, 246, 0.15)',
              padding: '12px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <span style={{ color: '#8b5cf6' }}>{item.icon}</span>
              <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* 버튼들 */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {isOpen ? (
            <button
              onClick={() => navigate('/vibe-coding-player')}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                border: 'none',
                color: '#ffffff',
                padding: '18px 40px',
                borderRadius: '15px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
              }}
            >
              🚀 수강 시작하기
            </button>
          ) : (
            <button
              disabled
              style={{
                background: 'rgba(139, 92, 246, 0.3)',
                border: '2px solid #8b5cf6',
                color: '#a78bfa',
                padding: '18px 40px',
                borderRadius: '15px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'not-allowed'
              }}
            >
              📅 1월 8일 오픈 예정
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: '2px solid rgba(255,255,255,0.3)',
              color: '#94a3b8',
              padding: '18px 40px',
              borderRadius: '15px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ← 홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

// 고정 결제 버튼 (Floating CTA) 컴포넌트
const FloatingPaymentButton: React.FC<{ onClick: () => void; isOpen: boolean; price: number }> = ({ onClick, isOpen, price }) => {
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
      padding: '15px 20px',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      borderTop: '3px solid #ffd60a'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <span style={{
          color: '#ffd60a',
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          fontWeight: '900'
        }}>
          ₩{price.toLocaleString()}
        </span>
        <span style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
          fontWeight: '600'
        }}>
          3개월 수강권
        </span>
      </div>
      <button
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
          color: '#7c3aed',
          border: 'none',
          padding: 'clamp(12px, 3vw, 16px) clamp(25px, 5vw, 40px)',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          fontWeight: '900',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(255, 214, 10, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'pulse 2s infinite'
        }}
      >
        <span>🚀</span>
        지금 결제하기
      </button>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export { FloatingPaymentButton };
export default VibeCodingPage;
