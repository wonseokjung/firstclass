import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';
import { Play, Building2, TrendingUp, Zap, Target, ChevronRight, Clock, BookOpen } from 'lucide-react';

interface AILandlordPreviewPageProps {
  onBack: () => void;
}

const BRAND_NAVY = '#0b1220';
const BRAND_GOLD = '#facc15';
const CARD_BG = '#f7f8fb';

const AILandlordPreviewPage: React.FC<AILandlordPreviewPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 로그인 체크
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userSession = sessionStorage.getItem('aicitybuilders_user_session');
        if (!userSession) {
          alert('로그인이 필요한 페이지입니다.');
          navigate('/login');
          return;
        }
        setIsLoggedIn(true);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ 인증 확인 실패:', error);
        alert('로그인이 필요한 페이지입니다.');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // 타임스탬프 데이터
  const timestamps = [
    { time: '00:00', title: '인트로', description: '1960년대 맨해튼 부동산과 AI 콘텐츠의 공통점' },
    { time: '01:47', title: '뉴욕 유학 시절', description: '경제학 전공, 부에 대한 고민의 시작' },
    { time: '03:00', title: '외삼촌과의 만남', description: '트럼프 타워에 사는 자수성가 부자' },
    { time: '04:30', title: '맨해튼 드라이브', description: '건물을 공짜로 사는 방법?' },
    { time: '06:00', title: '세탁소 이야기', description: '유대인 사장님의 제안, 100% 대출의 비밀' },
    { time: '08:00', title: '건물 확장의 원리', description: '첫 번째 건물 → 두 번째 → 세 번째...' },
    { time: '10:00', title: '시스템화', description: '125가 자동화 세탁소, 원조 배달 서비스' },
    { time: '12:00', title: '깨달음', description: '맨해튼 빌딩 = 유튜브 채널' },
    { time: '14:00', title: '구글의 선물', description: 'Gemini, Veo 3.1... 무료 AI 도구의 의미' },
    { time: '16:00', title: '채널 확장 전략', description: '1개 → 2개 → 3개... 건물처럼 늘리기' },
    { time: '17:30', title: '마무리', description: 'AI 건물주 되기 로드맵 안내' },
  ];

  // 핵심 포인트
  const keyPoints = [
    {
      icon: <Building2 size={28} />,
      title: '1960년대 맨해튼의 교훈',
      description: '첫 건물을 담보로 두 번째 건물, 두 번째로 세 번째... 복리의 마법',
      color: '#3b82f6'
    },
    {
      icon: <Zap size={28} />,
      title: '구글이 주는 "대출"',
      description: 'Gemini, Veo 3.1, Flash... 무료 AI 도구 = 1960년대 110% 대출',
      color: '#f59e0b'
    },
    {
      icon: <TrendingUp size={28} />,
      title: '채널 = 건물',
      description: '첫 채널 성공 → 두 번째 채널 → 세 번째... 콘텐츠 부동산 제국',
      color: '#10b981'
    },
    {
      icon: <Target size={28} />,
      title: 'AI 에이전트 = 직원',
      description: '사람 대신 AI 에이전트로 자동화, 시스템화, 확장',
      color: '#8b5cf6'
    }
  ];

  // 로딩 중
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: CARD_BG
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #e2e8f0',
            borderTop: `5px solid ${BRAND_NAVY}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>로그인 확인 중...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(180deg, ${BRAND_NAVY} 0%, #1a2744 100%)`,
      paddingBottom: '60px'
    }}>
      <NavigationBar onBack={onBack} breadcrumbText="AI 건물주 되기" />

      {/* 헤더 섹션 */}
      <div style={{
        background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, #1e3a5f 100%)`,
        padding: 'clamp(30px, 5vw, 50px) clamp(15px, 4vw, 30px)',
        textAlign: 'center',
        borderBottom: `3px solid ${BRAND_GOLD}`
      }}>
        <div style={{
          display: 'inline-block',
          background: BRAND_GOLD,
          color: BRAND_NAVY,
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
          fontWeight: '700',
          marginBottom: '15px'
        }}>
          🏗️ STEP 1: 프리뷰
        </div>
        
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
          fontWeight: '800',
          marginBottom: '12px',
          lineHeight: '1.3'
        }}>
          AI 건물주 되기
        </h1>
        
        <p style={{
          color: '#94a3b8',
          fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
          maxWidth: '600px',
          margin: '0 auto 20px',
          lineHeight: '1.6'
        }}>
          1960년대 맨해튼 부동산의 비밀을<br />
          AI 콘텐츠 시장에 적용하는 방법
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
            <Clock size={16} />
            <span style={{ fontSize: '0.9rem' }}>약 18분</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
            <BookOpen size={16} />
            <span style={{ fontSize: '0.9rem' }}>이론 강의</span>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)'
      }}>

        {/* 비디오 섹션 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          marginBottom: '30px'
        }}>
          <div style={{
            background: BRAND_NAVY,
            padding: '15px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Play size={20} color={BRAND_GOLD} />
            <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>
              강의 영상
            </span>
          </div>
          
          <div style={{ padding: '56.25% 0 0 0', position: 'relative', background: '#000' }}>
            <iframe 
              src="https://player.vimeo.com/video/1147003216?h=&badge=0&autopause=0&quality=auto" 
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="인공지능 건물주 되기 - 프리뷰"
            />
          </div>
        </div>

        {/* 강의 소개 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 30px)',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <h2 style={{
            color: BRAND_NAVY,
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            fontWeight: '700',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>📖</span> 이 강의에서 배우는 것
          </h2>
          
          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '20px',
            borderLeft: `4px solid ${BRAND_GOLD}`,
            marginBottom: '20px'
          }}>
            <p style={{
              color: '#475569',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
              lineHeight: '1.8',
              margin: 0
            }}>
              <strong style={{ color: BRAND_NAVY }}>1960년대 맨해튼</strong>에서 부동산으로 부자가 된 외삼촌의 실제 이야기를 통해,
              <strong style={{ color: BRAND_NAVY }}> 지금 AI 콘텐츠 시장</strong>에서 어떻게 같은 원리로 
              <strong style={{ color: BRAND_GOLD }}> "콘텐츠 건물주"</strong>가 될 수 있는지 알려드립니다.
            </p>
          </div>

          <p style={{
            color: '#64748b',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            lineHeight: '1.7'
          }}>
            어디서 주워들은 이론이 아닙니다. 뉴욕 트럼프 타워에 사시는 외삼촌 밑에서 
            직접 일하며 배운 <strong>부동산 투자의 원리</strong>를, 
            지금 <strong>AI 기반 콘텐츠 비즈니스</strong>에 그대로 적용하고 있는 실전 경험담입니다.
          </p>
        </div>

        {/* 핵심 포인트 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 30px)',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <h2 style={{
            color: BRAND_NAVY,
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            fontWeight: '700',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>💡</span> 핵심 포인트 4가지
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '15px'
          }}>
            {keyPoints.map((point, index) => (
              <div key={index} style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                border: `2px solid ${point.color}20`,
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: `${point.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: point.color,
                  marginBottom: '15px'
                }}>
                  {point.icon}
                </div>
                <h3 style={{
                  color: BRAND_NAVY,
                  fontSize: '1rem',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}>
                  {point.title}
                </h3>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 타임스탬프 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 30px)',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <h2 style={{
            color: BRAND_NAVY,
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            fontWeight: '700',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>⏱️</span> 타임스탬프
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {timestamps.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '15px',
                padding: '12px 15px',
                background: index % 2 === 0 ? '#f8fafc' : 'white',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}>
                <span style={{
                  background: BRAND_NAVY,
                  color: BRAND_GOLD,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  fontFamily: 'monospace',
                  flexShrink: 0
                }}>
                  {item.time}
                </span>
                <div>
                  <span style={{
                    color: BRAND_NAVY,
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}>
                    {item.title}
                  </span>
                  <span style={{
                    color: '#64748b',
                    fontSize: '0.9rem',
                    marginLeft: '8px'
                  }}>
                    - {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 외삼촌 스토리 하이라이트 */}
        <div style={{
          background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, #1e3a5f 100%)`,
          borderRadius: '16px',
          padding: 'clamp(25px, 5vw, 35px)',
          marginBottom: '30px',
          border: `2px solid ${BRAND_GOLD}40`
        }}>
          <h2 style={{
            color: 'white',
            fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
            fontWeight: '700',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🏙️</span> 외삼촌의 맨해튼 부동산 비밀
          </h2>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <p style={{
              color: '#e2e8f0',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
              lineHeight: '1.8',
              margin: 0,
              fontStyle: 'italic'
            }}>
              "원석아, 이 포르쉐는 내 돈으로 산 게 아니야. 
              내 건물에서 사람들이 내는 월세로 공짜로 타는 거야."
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { step: '1', text: '세탁소에서 일하다 건물주의 제안 받음' },
              { step: '2', text: '은행에서 110% 대출 (10억 건물 → 11억 대출)' },
              { step: '3', text: '1억으로 인테리어, 좋은 입주자 유치' },
              { step: '4', text: '월세 상승 → 건물 가치 상승' },
              { step: '5', text: '첫 건물 담보로 두 번째 건물 매입' },
              { step: '6', text: '반복... 맨해튼 거리 전체를 소유' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: BRAND_GOLD,
                  color: BRAND_NAVY,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  {item.step}
                </span>
                <span style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI 콘텐츠 시장 비교 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: 'clamp(25px, 5vw, 35px)',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <h2 style={{
            color: BRAND_NAVY,
            fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
            fontWeight: '700',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            🔄 1960년대 부동산 vs 2024년 AI 콘텐츠
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: '#fef3c7',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏢</div>
              <h3 style={{ color: '#92400e', fontSize: '1rem', fontWeight: '700', marginBottom: '15px' }}>
                1960년대 맨해튼
              </h3>
              <div style={{ textAlign: 'left', color: '#78350f', fontSize: '0.9rem', lineHeight: '1.8' }}>
                • 건물 = 자산<br/>
                • 은행 대출 = 레버리지<br/>
                • 월세 = 수익<br/>
                • 인테리어 = 가치 상승<br/>
                • 직원 고용 = 관리
              </div>
            </div>

            <div style={{
              background: '#dbeafe',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🤖</div>
              <h3 style={{ color: '#1e40af', fontSize: '1rem', fontWeight: '700', marginBottom: '15px' }}>
                2024년 AI 콘텐츠
              </h3>
              <div style={{ textAlign: 'left', color: '#1e3a8a', fontSize: '0.9rem', lineHeight: '1.8' }}>
                • 채널 = 자산<br/>
                • 무료 AI 도구 = 레버리지<br/>
                • 광고+서비스 = 수익<br/>
                • 콘텐츠 퀄리티 = 가치 상승<br/>
                • AI 에이전트 = 관리
              </div>
            </div>
          </div>
        </div>

        {/* 다음 단계 안내 */}
        <div style={{
          background: `linear-gradient(135deg, ${BRAND_GOLD} 0%, #fbbf24 100%)`,
          borderRadius: '16px',
          padding: 'clamp(25px, 5vw, 35px)',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: BRAND_NAVY,
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            fontWeight: '800',
            marginBottom: '15px'
          }}>
            🚀 다음 강의에서는?
          </h2>
          <p style={{
            color: '#1e3a5f',
            fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
            lineHeight: '1.7',
            marginBottom: '25px',
            maxWidth: '500px',
            margin: '0 auto 25px'
          }}>
            이론을 넘어 <strong>실전</strong>으로!<br/>
            AI 도구를 활용해 첫 번째 "콘텐츠 건물"을<br/>
            직접 만들어봅니다.
          </p>
          
          <button
            onClick={() => navigate('/courses')}
            style={{
              background: BRAND_NAVY,
              color: 'white',
              border: 'none',
              padding: '14px 30px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            전체 강의 보기 <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AILandlordPreviewPage;

