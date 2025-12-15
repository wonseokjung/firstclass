import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Code, Sparkles, Clock, Zap } from 'lucide-react';

interface ContentBusinessPageProps {
  onBack: () => void;
}

const ContentBusinessPage: React.FC<ContentBusinessPageProps> = ({ onBack }) => {
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
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Step 3 강의</span>
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
          <span style={{ color: '#8b5cf6' }}>Step 3</span>
          <br />
          바이브코딩
        </h1>

        {/* 부제목 */}
        <p style={{
          fontSize: '1.3rem',
          color: '#94a3b8',
          marginBottom: '40px'
        }}>
          💻 수익화 확장의 첫걸음
        </p>

        {/* 설명 카드 */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          textAlign: 'left'
        }}>
          <h2 style={{
            color: '#8b5cf6',
            fontSize: '1.3rem',
            fontWeight: '700',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Sparkles size={24} />
            이 강의에서 배우는 것
          </h2>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {[
              { icon: <Code size={20} />, text: '내 사업 도구 직접 만들기 - 코딩 몰라도 OK!' },
              { icon: <Zap size={20} />, text: '유튜브 의존에서 벗어나 추가 수익 창출' },
              { icon: <Rocket size={20} />, text: 'Cursor AI로 나만의 서비스/플랫폼 개발' },
              { icon: <Sparkles size={20} />, text: '광고 수익을 넘어선 사업 확장' }
            ].map((item, idx) => (
              <li key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                color: '#e0e0e0',
                fontSize: '1.05rem'
              }}>
                <span style={{ color: '#8b5cf6' }}>{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
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

export default ContentBusinessPage;

