import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../../common/NavigationBar';
import { Rocket } from 'lucide-react';

interface VibeCodingPageProps {
  onBack: () => void;
}

const VibeCodingPage: React.FC<VibeCodingPageProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
      color: '#ffffff'
    }}>
      <NavigationBar onBack={onBack} breadcrumbText="바이브코딩 기초" />

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
          background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          boxShadow: '0 20px 60px rgba(255, 214, 10, 0.3)'
        }}>
          <Rocket size={50} color="#0d1b2a" />
        </div>

        {/* 제목 */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '900',
          marginBottom: '20px',
          lineHeight: 1.3
        }}>
          <span style={{ color: '#ffd60a' }}>바이브코딩</span> 기초과정
        </h1>

        {/* 준비중 배지 */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(255, 214, 10, 0.2)',
          border: '2px solid #ffd60a',
          padding: '12px 30px',
          borderRadius: '50px',
          marginBottom: '30px'
        }}>
          <span style={{ 
            color: '#ffd60a', 
            fontWeight: '700', 
            fontSize: '1.2rem' 
          }}>
            🚧 준비중입니다
          </span>
        </div>

        {/* 설명 */}
        <p style={{
          fontSize: '1.1rem',
          color: '#94a3b8',
          maxWidth: '500px',
          lineHeight: 1.8,
          marginBottom: '40px'
        }}>
          곧 만나요! 🙌
        </p>

        {/* 돌아가기 버튼 */}
        <button
          onClick={() => navigate('/ai-gym')}
          style={{
            background: 'transparent',
            border: '2px solid #ffd60a',
            color: '#ffd60a',
            padding: '15px 40px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#ffd60a';
            e.currentTarget.style.color = '#0d1b2a';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#ffd60a';
          }}
        >
          ← 기초 체력 훈련소로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default VibeCodingPage;
