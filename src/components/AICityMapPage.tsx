import React from 'react';
import NavigationBar from './NavigationBar';

interface AICityMapPageProps {
  onBack: () => void;
}

const AICityMapPage: React.FC<AICityMapPageProps> = ({ onBack }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
      fontFamily: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* 배경 애니메이션 요소들 */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '100px',
        height: '100px',
        background: 'linear-gradient(45deg, #0ea5e9, #06b6d4)',
        borderRadius: '50%',
        opacity: 0.1,
        animation: 'float 6s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: '150px',
        height: '150px',
        background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
        borderRadius: '30%',
        opacity: 0.1,
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '15%',
        width: '80px',
        height: '80px',
        background: 'linear-gradient(45deg, #10b981, #059669)',
        borderRadius: '20%',
        opacity: 0.1,
        animation: 'float 7s ease-in-out infinite'
      }} />

      <NavigationBar 
        onBack={onBack}
        breadcrumbText="AI City Map"
      />

      {/* 메인 콘텐츠 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* 헤더 섹션 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #1f2937 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '20px',
            letterSpacing: '-0.02em'
          }}>
            🏗️ AI City Map
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            AI 기술로 구축되는 미래 도시의 청사진을 탐험해보세요
          </p>
        </div>

        {/* 하단 CTA 섹션 */}
        <div style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            🚀 AI City 건설에 참여하세요
          </h2>
          
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto 30px',
            lineHeight: 1.6
          }}>
            미래 도시의 건축가가 되어 AI 기술로 더 나은 세상을 만들어보세요
          </p>
          
          <button
            onClick={onBack}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.3)';
            }}
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>

      {/* CSS 애니메이션 */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.1;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AICityMapPage;