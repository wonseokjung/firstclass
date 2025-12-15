import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';

const LiveStep3Page: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <NavigationBar />
      
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'clamp(50px, 10vw, 100px) clamp(15px, 3vw, 20px)', textAlign: 'center' }}>
        {/* 헤더 */}
        <div style={{ 
          display: 'inline-block',
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          padding: '8px 20px',
          borderRadius: '30px',
          marginBottom: '20px'
        }}>
          <span style={{ color: 'white', fontWeight: '700' }}>STEP 3</span>
        </div>
        
        <h1 style={{ 
          color: 'white', 
          fontSize: '2.5rem', 
          fontWeight: '800',
          marginBottom: '15px'
        }}>
          💻 바이브코딩 라이브
        </h1>
        
        <div style={{ 
          fontSize: '5rem', 
          margin: '40px 0' 
        }}>
          🚀
        </div>
        
        <h2 style={{ 
          color: '#8b5cf6', 
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
          수익화 확장의 첫걸음!<br/>
          바이브코딩 강의가 곧 오픈됩니다!<br/><br/>
          <span style={{ color: '#8b5cf6' }}>내 사업 도구 직접 만들기</span><br/>
          코딩 몰라도 OK! AI에게 말로 설명하면 됩니다.
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

export default LiveStep3Page;

