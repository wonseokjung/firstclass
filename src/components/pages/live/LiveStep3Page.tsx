import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';

const LiveStep3Page: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <NavigationBar />
      
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '100px 20px', textAlign: 'center' }}>
        {/* 헤더 */}
        <div style={{ 
          display: 'inline-block',
          background: 'linear-gradient(135deg, #eab308, #ca8a04)',
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
          ⚡ connexionai 라이브
        </h1>
        
        <div style={{ 
          fontSize: '5rem', 
          margin: '40px 0' 
        }}>
          🚀
        </div>
        
        <h2 style={{ 
          color: '#eab308', 
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
          AI 수익화 전문 자동화 에이전트 강의가<br/>
          곧 오픈될 예정입니다!<br/><br/>
          <span style={{ color: '#eab308' }}>강의 + 도구 + 라이브</span>로 구성된<br/>
          완벽한 수익화 시스템을 준비하고 있습니다.
        </p>
        
        <div style={{
          background: 'linear-gradient(135deg, #eab30820, #ca8a0410)',
          border: '1px solid #eab30850',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <p style={{ color: '#94a3b8', marginBottom: '15px' }}>
            📧 오픈 알림을 받고 싶으시다면
          </p>
          <button
            onClick={() => window.open('https://open.kakao.com/o/s2NzW41h', '_blank')}
            style={{
              background: '#FFE812',
              color: '#1e293b',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            💬 오픈채팅 참여하기
          </button>
        </div>
        
        <button
          onClick={() => navigate('/ai-construction-site')}
          style={{
            background: 'transparent',
            color: '#94a3b8',
            border: '1px solid #334155',
            padding: '12px 25px',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          ← AI 건물 공사장으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default LiveStep3Page;

