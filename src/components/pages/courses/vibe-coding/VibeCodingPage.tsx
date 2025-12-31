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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
      color: '#ffffff'
    }}>
      <NavigationBar onBack={onBack} breadcrumbText="Step 3: 바이브코딩" />

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
          marginBottom: '30px'
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

export default VibeCodingPage;
