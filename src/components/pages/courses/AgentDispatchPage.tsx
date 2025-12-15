import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, Handshake, Building2 } from 'lucide-react';

interface AgentDispatchPageProps {
  onBack: () => void;
}

const AgentDispatchPage: React.FC<AgentDispatchPageProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
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
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          boxShadow: '0 20px 60px rgba(245, 158, 11, 0.3)'
        }}>
          <Building2 size={60} color="#fff" />
        </div>

        {/* 제목 */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '900',
          marginBottom: '16px',
          lineHeight: '1.2'
        }}>
          <span style={{ color: '#f59e0b' }}>Step 4</span>
          <br />
          1인 기업 만들기
        </h1>

        {/* 부제목 */}
        <p style={{
          fontSize: '1.3rem',
          color: '#94a3b8',
          marginBottom: '40px'
        }}>
          🏢 콘텐츠 비즈니스 사업화
        </p>

        {/* 핵심 컨셉 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)',
          border: '2px solid rgba(245, 158, 11, 0.4)',
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
            <Building2 size={28} color="#f59e0b" />
            <h3 style={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>
              콘텐츠 크리에이터에서 CEO로
            </h3>
          </div>
          <p style={{ color: '#e0e0e0', fontSize: '1.1rem', lineHeight: '1.7' }}>
            사업자등록, 세금, 정부지원금까지!<br />
            <strong style={{ color: '#f59e0b' }}>1인 기업</strong>을 완성하는 단계입니다.<br />
            Step 3에서 만든 서비스로 <strong style={{ color: '#fff' }}>진짜 사업</strong>을 시작하세요!
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
