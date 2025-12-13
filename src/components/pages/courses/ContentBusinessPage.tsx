import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Code, Building2, Sparkles, Clock } from 'lucide-react';

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
          <span style={{ color: '#f59e0b' }}>Step 3</span>
          <br />
          1인 콘텐츠 기업 만들기
        </h1>

        {/* 부제목 */}
        <p style={{
          fontSize: '1.3rem',
          color: '#94a3b8',
          marginBottom: '40px'
        }}>
          🚀 바이브코딩으로 서비스 개발
        </p>

        {/* 설명 카드 */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          textAlign: 'left'
        }}>
          <h2 style={{
            color: '#f59e0b',
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
              { icon: <Code size={20} />, text: '바이브코딩 툴(Cursor, 안티그래비티 등)로 나만의 콘텐츠 서비스 제작' },
              { icon: <Building2 size={20} />, text: '콘텐츠 사업 확장 전략' },
              { icon: <Rocket size={20} />, text: '내가 필요한 유튜브 콘텐츠 툴 직접 제작' },
              { icon: <Sparkles size={20} />, text: '내가 필요한 유튜브 자동화 에이전트 개발' }
            ].map((item, idx) => (
              <li key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                color: '#e0e0e0',
                fontSize: '1.05rem'
              }}>
                <span style={{ color: '#f59e0b' }}>{item.icon}</span>
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

