import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';

const LiveStep4Page: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <NavigationBar />
      
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '100px 20px', textAlign: 'center' }}>
        {/* 헤더 */}
        <div style={{ 
          display: 'inline-block',
          background: 'linear-gradient(135deg, #a855f7, #9333ea)',
          padding: '8px 20px',
          borderRadius: '30px',
          marginBottom: '20px'
        }}>
          <span style={{ color: 'white', fontWeight: '700' }}>STEP 4</span>
        </div>
        
        <h1 style={{ 
          color: 'white', 
          fontSize: '2.5rem', 
          fontWeight: '800',
          marginBottom: '15px'
        }}>
          🚀 1인 콘텐츠 기업 만들기 라이브
        </h1>
        
        <div style={{ 
          fontSize: '5rem', 
          margin: '40px 0' 
        }}>
          🎯
        </div>
        
        <h2 style={{ 
          color: '#a855f7', 
          fontSize: '1.8rem',
          marginBottom: '20px'
        }}>
          Coming Soon
        </h2>
        
        <p style={{ 
          color: '#94a3b8', 
          fontSize: '1.1rem',
          lineHeight: '1.8',
          marginBottom: '40px'
        }}>
          바이브코딩으로 서비스를 개발하고<br/>
          1인 콘텐츠 기업을 만드는 방법을 배우는<br/>
          강의가 곧 오픈됩니다!<br/><br/>
          <span style={{ color: '#a855f7' }}>코딩 없이 서비스 만들기</span>부터<br/>
          <span style={{ color: '#a855f7' }}>수익화</span>까지 모든 것을 다룹니다.
        </p>
        
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            color: '#94a3b8',
            border: '1px solid #334155',
            padding: '12px 25px',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          ← 메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default LiveStep4Page;

