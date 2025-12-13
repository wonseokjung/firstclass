import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, Handshake } from 'lucide-react';

interface AgentDispatchPageProps {
  onBack: () => void;
}

const AgentDispatchPage: React.FC<AgentDispatchPageProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      color: '#fff'
    }}>
      {/* 네비게이션 */}
      <nav style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ArrowLeft size={20} color="#fff" />
        </button>
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Step 4 강의</span>
      </nav>

      {/* 메인 콘텐츠 */}
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        {/* 배지 */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          padding: '8px 20px',
          borderRadius: '30px',
          marginBottom: '30px'
        }}>
          <Clock size={18} color="#fff" />
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.9rem' }}>Coming Soon</span>
        </div>

        {/* 아이콘 */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '30px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)'
        }}>
          <Zap size={60} color="#fff" />
        </div>

        {/* 제목 */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '900',
          marginBottom: '16px',
          lineHeight: '1.2'
        }}>
          <span style={{ color: '#8b5cf6' }}>Step 4</span>
          <br />
          AI 에이전트 파견소
        </h1>

        {/* 부제목 */}
        <p style={{
          fontSize: '1.3rem',
          color: '#94a3b8',
          marginBottom: '40px'
        }}>
          🤝 협업하기: AI 도구를 함께 활용!
        </p>

        {/* 핵심 컨셉 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <Handshake size={28} color="#8b5cf6" />
            <h3 style={{ color: '#8b5cf6', fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>
              FORGENT AI 협업 프로그램
            </h3>
          </div>
          <p style={{ color: '#e0e0e0', fontSize: '1.1rem', lineHeight: '1.7' }}>
            직접 만들기 어려운 AI 에이전트들을<br />
            <strong style={{ color: '#8b5cf6' }}>우리가 만들어서 제공</strong>합니다.<br />
            여러분은 <strong style={{ color: '#fff' }}>도구만 사용</strong>하면 됩니다!
          </p>
        </div>

        {/* 다른 강의 보러가기 */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '16px 32px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          }}
        >
          ← 다른 강의 보러가기
        </button>
      </main>
    </div>
  );
};

export default AgentDispatchPage;
