import React, { useState, useEffect } from 'react';
import NavigationBar from '../../../common/NavigationBar';
import AzureTableService from '../../../../services/azureTableService';
import { Code, Zap, Rocket, CheckCircle, Star, Play } from 'lucide-react';

interface VibeCodingPageProps {
  onBack: () => void;
}

const VibeCodingPage: React.FC<VibeCodingPageProps> = ({ onBack }) => {
  const [, setIsLoggedIn] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);

  const originalPrice = 199000;
  const salePrice = 95000;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');

        if (storedUserInfo) {
          try {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setIsLoggedIn(true);

            try {
              const paymentStatus = await AzureTableService.checkCoursePayment(
                parsedUserInfo.email, 
                'vibe-coding'
              );

              if (paymentStatus && paymentStatus.isPaid) {
                setIsPaidUser(true);
              }
            } catch (azureError) {
              console.error('❌ Azure 테이블 조회 실패:', azureError);
            }
          } catch (parseError) {
            console.error('❌ 사용자 정보 파싱 오류:', parseError);
            sessionStorage.removeItem('aicitybuilders_user_session');
          }
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
      }
    };

    checkAuthStatus();
  }, []);

  const curriculum = [
    { day: 1, title: '🔥 바이브코딩이 뭔가요?', desc: 'Google Antigravity 설치부터 첫 앱까지' },
    { day: 2, title: '💡 아이디어 검증', desc: 'MVP 설계와 시장 검증' },
    { day: 3, title: '🛠️ 실전 앱 개발', desc: 'Todo부터 커머스까지' },
    { day: 4, title: '🎨 Figma MCP 연동', desc: '디자인 → 코드 자동 변환' },
    { day: 5, title: '🗄️ Supabase 백엔드', desc: '서버리스 백엔드 구축' },
    { day: 6, title: '💰 수익화 전략', desc: 'SaaS, 구독, 커미션 모델' },
    { day: 7, title: '🚀 배포와 운영', desc: 'Vercel/Netlify 5분 배포' },
    { day: 8, title: '📈 성장 해킹', desc: 'Product Hunt, 바이럴 전략' },
    { day: 9, title: '🔧 유지보수', desc: '피드백 → 빠른 개선' },
    { day: 10, title: '💎 실전 프로젝트', desc: '30분 수익형 앱 런칭' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #0f0a1e 0%, #1a1033 50%, #ffffff 100%)',
      color: '#0d1b2a'
    }}>
      <NavigationBar onBack={onBack} breadcrumbText="AI 수익화 바이브코딩" />

      {/* 히어로 섹션 */}
      <div style={{
        padding: 'clamp(80px, 12vw, 150px) 20px clamp(60px, 10vw, 100px)',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.1))'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'rgba(251, 191, 36, 0.3)',
            padding: '8px 18px',
            borderRadius: '30px',
            marginBottom: '25px',
            border: '1px solid rgba(251, 191, 36, 0.5)'
          }}>
            <Star size={16} color="#ffd60a" fill="#ffd60a" />
            <span style={{ color: '#ffd60a', fontWeight: '600', fontSize: '0.9rem' }}>🚧 강의 준비중</span>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '20px'
          }}>
            <span style={{ color: '#8b5cf6' }}>AI 수익화</span><br/>
            바이브코딩
          </h1>
          
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', 
            color: '#94a3b8',
            marginBottom: '15px'
          }}>
            코딩을 배우는 게 아닙니다. <strong style={{ color: '#22c55e' }}>돈 버는 도구</strong>를 만듭니다.
          </p>
          
          <p style={{ 
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', 
            color: '#a78bfa',
            marginBottom: '40px',
            lineHeight: '1.8'
          }}>
            🚀 개발 경험 0도 OK! AI에게 말만 하면 앱이 만들어집니다<br/>
            💰 수익형 SaaS, 자동화 봇, 랜딩페이지를 직접 만들어 런칭하세요
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {[
              { icon: <Zap size={24} />, label: '수익화가 목적' },
              { icon: <Code size={24} />, label: '10일 완성' },
              { icon: <Rocket size={24} />, label: '실전 런칭' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0' }}>
                <div style={{ color: '#8b5cf6' }}>{item.icon}</div>
                <span style={{ fontWeight: '600' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {isPaidUser ? (
            <button
              onClick={() => window.location.href = '/vibe-coding-player'}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#0d1b2a',
                border: 'none',
                padding: '20px 50px',
                borderRadius: '16px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)'
              }}
            >
              <Play size={24} /> 내 강의 보기
            </button>
          ) : (
            <button
              disabled
              style={{
                background: 'linear-gradient(135deg, #64748b, #475569)',
                color: '#0d1b2a',
                border: 'none',
                padding: '20px 50px',
                borderRadius: '16px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                opacity: 0.8
              }}
            >
              🚧 준비중입니다
            </button>
          )}
        </div>
      </div>

      {/* 가격 섹션 */}
      <div style={{ 
        padding: 'clamp(40px, 8vw, 80px) 20px',
        background: 'rgba(0,0,0,0.3)'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ 
              color: '#94a3b8', 
              fontSize: '1rem', 
              textDecoration: 'line-through',
              marginBottom: '8px'
            }}>
              정가 {originalPrice.toLocaleString()}원
            </div>
            <div style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: '800',
              color: '#22c55e',
              marginBottom: '10px'
            }}>
              {salePrice.toLocaleString()}원
            </div>
            <div style={{ 
              background: 'rgba(139, 92, 246, 0.2)', 
              color: '#a78bfa', 
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'inline-block',
              fontWeight: '600'
            }}>
              50% 할인
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              marginTop: '30px',
              textAlign: 'left'
            }}>
              {[
                '10일 체계적 커리큘럼',
                '실전 프로젝트 코드 제공',
                '3개월 소장 및 업데이트',
                'Day별 토론방 참여'
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0' }}>
                  <CheckCircle size={18} color="#22c55e" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 커리큘럼 섹션 */}
      <div style={{ padding: 'clamp(40px, 8vw, 80px) 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            marginBottom: '15px',
            color: '#8b5cf6'
          }}>
            📚 10일 커리큘럼
          </h2>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '40px' }}>
            바이브코딩으로 0에서 수익화까지 완벽 마스터
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
            {curriculum.map((item) => (
              <div key={item.day} style={{
                background: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0d1b2a',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  flexShrink: 0
                }}>
                  {item.day}
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 수익화 가능한 것들 */}
      <div style={{ 
        padding: 'clamp(40px, 8vw, 80px) 20px',
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            marginBottom: '40px',
            color: '#22c55e'
          }}>
            🎯 바이브코딩으로 만들 수 있는 것들
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🌐', title: '랜딩페이지', desc: '제품/서비스 소개' },
              { icon: '🤖', title: '자동화 봇', desc: '반복 업무 자동화' },
              { icon: '💰', title: 'SaaS 서비스', desc: '구독형 수익 모델' },
              { icon: '📱', title: '웹/앱', desc: '사용자용 서비스' },
              { icon: '🛒', title: '커머스', desc: '온라인 판매' },
              { icon: '📊', title: '대시보드', desc: '데이터 시각화' }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '20px',
                padding: '25px',
                textAlign: 'center',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div style={{ 
        padding: 'clamp(60px, 10vw, 100px) 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            marginBottom: '20px'
          }}>
            지금 시작하세요! 🚀
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '30px', lineHeight: '1.8' }}>
            10일 후, 당신도 수익형 앱을 런칭할 수 있습니다.<br/>
            개발 경험은 필요 없습니다. AI가 다 해줍니다.
          </p>
          
          {isPaidUser ? (
            <button
              onClick={() => window.location.href = '/vibe-coding-player'}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#0d1b2a',
                border: 'none',
                padding: '20px 50px',
                borderRadius: '16px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.4)'
              }}
            >
              <Play size={24} /> 내 강의 보기
            </button>
          ) : (
            <button
              disabled
              style={{
                background: 'linear-gradient(135deg, #64748b, #475569)',
                color: '#0d1b2a',
                border: 'none',
                padding: '20px 50px',
                borderRadius: '16px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                opacity: 0.8
              }}
            >
              🚧 준비중입니다
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default VibeCodingPage;

