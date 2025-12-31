import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Bot, Zap, Building2, CheckCircle, Star } from 'lucide-react';
import NavigationBar from '../common/NavigationBar';

const RoadmapPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: 1,
      title: 'AI 건물주 되기',
      subtitle: '새로운 계급의 크리에이터',
      icon: <Sparkles size={32} />,
      description: '1960년 맨해튼 기회가 지금 유튜브에',
      details: '유튜브 CEO가 발표한 "새로운 계급의 크리에이터"가 되는 첫 시작입니다. 1960년대 맨해튼 부동산처럼, 지금 유튜브 채널이 디지털 건물입니다. 구글의 30개+ AI 도구로 수익화 콘텐츠를 만듭니다.',
      price: '₩95,000',
      priceType: '일회성',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      features: [
        '🏙️ 맨해튼 부동산 비즈니스 철학',
        '📺 유튜브 채널 = 디지털 건물',
        '🔴 매주 라이브 + 최신 AI 업데이트'
      ],
      status: 'available',
      path: '/courses/ai-building',
      showcaseImage: '/images/step1/dog.jpeg'
    },
    {
      step: 2,
      title: 'AI 에이전트 비기너',
      subtitle: '시스템화',
      icon: <Bot size={32} />,
      description: '반복 작업을 시스템으로 만들기',
      details: '콘텐츠를 매번 수동으로 만들 순 없습니다. 여러 AI를 하나의 팀처럼 연결해서 반복 작업을 자동화하는 시스템을 구축합니다.',
      price: '₩95,000',
      priceType: '일회성',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
      features: [
        '구글 OPAL 완전 정복',
        'AI 에이전트 워크플로우',
        '콘텐츠 생산 자동화 시스템'
      ],
      status: 'available',
      path: '/courses/chatgpt-agent-beginner'
    },
    {
      step: 3,
      title: '바이브코딩',
      subtitle: '수익화 확장',
      icon: <Zap size={32} />,
      description: '수익화 확장의 첫걸음',
      details: '유튜브 광고 수익을 넘어서 내 사업 도구를 직접 만듭니다. 코딩 몰라도 OK! AI에게 말로 설명하면 됩니다.',
      price: 'Coming Soon',
      priceType: '',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #5b21b6 0%, #8b5cf6 100%)',
      features: [
        '💻 내 사업 도구 직접 만들기',
        '🚀 유튜브 의존에서 벗어나기',
        '🛠️ 추가 수익 파이프라인 구축'
      ],
      highlights: [
        '코딩 경험 없어도 서비스 개발 가능',
        '아이디어만 있으면 바로 실현',
        '광고 수익을 넘어선 사업 확장'
      ],
      status: 'coming_soon',
      path: '/vibe-coding'
    },
    {
      step: 4,
      title: '1인 기업 만들기',
      subtitle: 'CEO 되기',
      icon: <Building2 size={32} />,
      description: '1인 기업가에서 CEO로',
      details: '콘텐츠를 만드는 사람에서 사업을 운영하는 사람이 됩니다. 사업자등록, 세금, 정부지원금 활용까지.',
      price: '준비중',
      priceType: '',
      color: '#e5c100',
      gradient: 'linear-gradient(135deg, #d4af37 0%, #e5c100 50%, #ffd60a 100%)',
      features: [
        '🏢 개인사업자 & 법인 설립',
        '💰 세금 & 정부지원금 활용',
        '📈 1인 기업 성장 전략',
        '🤝 협업 네트워크 구축',
      ],
      highlights: [
        '콘텐츠 1인 기업가에서 CEO로',
        '안정적인 수익 구조 완성',
        'Step 3에서 만든 서비스로 사업화!'
      ],
      status: 'coming_soon',
      path: '/solo-business'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #0f1629 50%, #1a1a3a 100%)',
    }}>
      <NavigationBar />

      {/* Hero Section */}
      <section style={{
        padding: 'clamp(40px, 8vw, 80px) clamp(15px, 3vw, 20px) clamp(30px, 6vw, 60px)',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #d4af37 0%, #e5c100 100%)',
          padding: '8px 20px',
          borderRadius: '30px',
          marginBottom: '24px'
        }}>
          <span style={{ color: '#000', fontWeight: '700', fontSize: '0.9rem' }}>
            🚀 AI 1인 기업가 로드맵
          </span>
        </div>

        <h1 style={{
          color: '#ffffff',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: '900',
          marginBottom: '20px',
          lineHeight: '1.2'
        }}>
          AI 1인 기업가가 되는 여정<br />
          <span style={{ color: '#e5c100' }}>교육 + 도구로 함께합니다</span>
        </h1>

        <p style={{
          color: '#94a3b8',
          fontSize: '1.1rem',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: '1.7'
        }}>
          기술과 장비가 없어도 괜찮습니다.<br />
          <strong style={{ color: '#fff' }}>AI와 함께라면 누구나 1인 기업가</strong>가 될 수 있습니다.
        </p>

        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0',
          marginBottom: '60px',
          flexWrap: 'wrap'
        }}>
          {steps.map((step, index) => (
            <React.Fragment key={step.step}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: step.status === 'featured' ? step.gradient :
                    step.status === 'coming_soon' ? '#415a77' : step.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '1.2rem',
                  boxShadow: step.status === 'featured' ? '0 0 30px rgba(245, 158, 11, 0.5)' : 'none',
                  border: step.status === 'featured' ? '3px solid #ffd60a' : 'none'
                }}>
                  {step.step}
                </div>
                <span style={{
                  color: step.status === 'featured' ? '#e5c100' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {step.subtitle}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div style={{
                  width: '60px',
                  height: '3px',
                  background: index < 2 ? 'linear-gradient(90deg, ' + steps[index].color + ', ' + steps[index + 1].color + ')' : '#415a77',
                  margin: '0 10px 20px'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Steps Cards */}
      <section style={{
        padding: '0 20px 80px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {steps.map((step) => (
            <div
              key={step.step}
              onClick={() => step.status !== 'coming_soon' && navigate(step.path)}
              style={{
                background: step.status === 'featured'
                  ? 'linear-gradient(135deg, #1a1a2e 0%, #1b263b 100%)'
                  : 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
                borderRadius: '24px',
                padding: step.status === 'featured' ? '3px' : '0',
                cursor: step.status !== 'coming_soon' ? 'pointer' : 'default',
                transform: step.status === 'featured' ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                ...(step.status === 'featured' && {
                  background: 'linear-gradient(135deg, #d4af37 0%, #e5c100 50%, #ffd60a 100%)',
                })
              }}
            >
              {/* Featured Badge */}
              {step.status === 'featured' && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #d4af37 0%, #e5c100 100%)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  zIndex: 10
                }}>
                  <span style={{ color: '#000', fontWeight: '800', fontSize: '0.8rem' }}>
                    ⭐ 추천
                  </span>
                </div>
              )}

              <div style={{
                background: step.status === 'featured'
                  ? 'linear-gradient(135deg, #1a1a2e 0%, #1b263b 100%)'
                  : 'transparent',
                borderRadius: '22px',
                padding: '32px',
                height: '100%'
              }}>
                {/* Step Number & Icon */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: step.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    {step.icon}
                  </div>
                  <div>
                    <span style={{
                      color: step.color,
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      STEP {step.step}
                    </span>
                    <h3 style={{
                      color: '#fff',
                      fontSize: '1.4rem',
                      fontWeight: '800',
                      margin: 0
                    }}>
                      {step.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  color: step.status === 'featured' ? '#e5c100' : '#94a3b8',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  {step.description}
                </p>

                <p style={{
                  color: '#e0e0e0',
                  fontSize: '0.9rem',
                  lineHeight: '1.7',
                  marginBottom: '24px'
                }}>
                  {step.details}
                </p>

                {/* Showcase Image for Step 1 */}
                {(step as any).showcaseImage && (
                  <div style={{
                    marginBottom: '20px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    position: 'relative'
                  }}>
                    <img
                      src={(step as any).showcaseImage}
                      alt="압도적인 비주얼 예시"
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      background: 'rgba(0,0,0,0.7)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: '#3b82f6',
                      fontWeight: '600'
                    }}>
                      ✨ 이런 비주얼을 만듭니다
                    </div>
                  </div>
                )}

                {/* Highlights for Featured */}
                {step.status === 'featured' && step.highlights && (
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    {step.highlights.map((highlight, idx) => (
                      <p key={idx} style={{
                        color: '#ffd60a',
                        fontSize: '0.85rem',
                        margin: idx === step.highlights!.length - 1 ? 0 : '0 0 8px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <Star size={14} fill="#ffd60a" /> {highlight}
                      </p>
                    ))}
                  </div>
                )}

                {/* Features */}
                <div style={{ marginBottom: '24px' }}>
                  {step.features.map((feature, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '10px'
                    }}>
                      <CheckCircle size={18} color={step.color} />
                      <span style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price & CTA */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div>
                    <span style={{
                      color: '#fff',
                      fontSize: '1.5rem',
                      fontWeight: '800'
                    }}>
                      {step.price}
                    </span>
                    {step.priceType && (
                      <span style={{
                        color: '#94a3b8',
                        fontSize: '0.9rem',
                        marginLeft: '4px'
                      }}>
                        /{step.priceType}
                      </span>
                    )}
                  </div>

                  {step.status !== 'coming_soon' ? (
                    <button style={{
                      background: step.status === 'featured' ? step.gradient : step.color,
                      color: step.status === 'featured' ? '#000' : '#fff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.95rem'
                    }}>
                      {step.status === 'featured' ? '시작하기' : '자세히 보기'}
                      <ArrowRight size={18} />
                    </button>
                  ) : (
                    <span style={{
                      color: '#64748b',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      🚀 오픈 예정
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '60px 20px 80px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, transparent 0%, rgba(245, 158, 11, 0.05) 100%)'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: '2rem',
          fontWeight: '800',
          marginBottom: '16px'
        }}>
          AI 1인 기업가가 되고 싶다면?
        </h2>
        <p style={{
          color: '#94a3b8',
          fontSize: '1.1rem',
          marginBottom: '32px'
        }}>
          기술과 장비가 없어도 괜찮습니다.<br />
          <strong style={{ color: '#3b82f6' }}>Step 1</strong>부터 차근차근 시작하세요!
        </p>
        <button
          onClick={() => navigate('/courses/ai-building')}
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: '#fff',
            border: 'none',
            padding: '18px 48px',
            borderRadius: '16px',
            fontWeight: '800',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
          }}
        >
          🚀 AI 1인 기업가 시작하기
          <ArrowRight size={22} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          © 2025 AI City Builders. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default RoadmapPage;

