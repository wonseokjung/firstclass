import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Globe, Youtube, Instagram, X, Sparkles, Bot, Zap, Building2, ArrowRight, Play, Wrench, TrendingUp } from 'lucide-react';
import NavigationBar from '../common/NavigationBar';

interface CEOPageProps {
  onBack: () => void;
}

const CEOPage: React.FC<CEOPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);

  const closeTranscriptModal = () => {
    setSelectedTranscript(null);
  };

  const roadmapSteps = [
    {
      step: 1,
      title: 'AI 건물주 되기',
      subtitle: '배우기',
      icon: <Sparkles size={24} />,
      description: '다양한 AI 모델 + 비즈니스 마인드',
      price: '₩45,000',
      color: '#3b82f6',
      path: '/ai-building-course'
    },
    {
      step: 2,
      title: 'AI 에이전트 비기너',
      subtitle: '훈련하기',
      icon: <Bot size={24} />,
      description: '구글 OPAL로 멀티 AI 시스템 훈련',
      price: '₩95,000',
      color: '#10b981',
      path: '/chatgpt-agent-beginner'
    },
    {
      step: 3,
      title: 'AI 에이전트 파견소',
      subtitle: '만들기',
      icon: <Zap size={24} />,
      description: 'AI 수익화 전문 자동화 에이전트',
      price: 'Coming Soon',
      color: '#e5c100',
      path: '#'
    },
    {
      step: 4,
      title: '1인 콘텐츠 기업',
      subtitle: '키우기',
      icon: <Building2 size={24} />,
      description: '바이브코딩 + 사업 확장',
      price: 'Coming Soon',
      color: '#8b5cf6',
      path: '#'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #0f1629 50%, #1a1a3a 100%)',
    }}>
      <NavigationBar onBack={onBack} breadcrumbText="AI City Builders 소개" />

      {/* Hero Section - New Class of AI Creators */}
      <section style={{
        padding: '60px 20px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 장식 */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* 메인 타이틀 */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(251, 191, 36, 0.15)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            padding: '8px 20px',
            borderRadius: '30px',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#ffd60a', fontSize: '0.9rem', fontWeight: '600' }}>
              🏙️ AI City Builders
              </span>
          </div>

            <h1 style={{
              color: '#ffffff',
            fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
              fontWeight: '900',
            marginBottom: '0',
            lineHeight: '1.2',
            maxWidth: '900px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #ffd60a 0%, #e5c100 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>New Class of AI Creators</span>
            <br />
            <span style={{ fontSize: '0.7em', color: '#e0e0e0' }}>를 양성합니다</span>
          </h1>

          {/* 핵심 메시지 */}
          <p style={{
            color: '#94a3b8',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: '1.8',
            maxWidth: '700px',
            margin: '0'
          }}>
            기술이 없어서 못했던 사람들도<br />
            <strong style={{ color: '#fff' }}>AI로 콘텐츠를 만들고 수익화</strong>할 수 있도록<br />
            <span style={{ color: '#ffd60a', fontWeight: '700' }}>교육</span>과 <span style={{ color: '#ffd60a', fontWeight: '700' }}>도구</span>를 제공합니다.
          </p>

          {/* 교육 + 도구 = AI 도시 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(12px, 3vw, 24px)',
            marginTop: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '16px',
              padding: 'clamp(16px, 3vw, 24px) clamp(24px, 4vw, 36px)',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
            }}>
              <GraduationCap size={32} color="#fff" style={{ marginBottom: '8px' }} />
              <p style={{ color: '#fff', fontWeight: '800', fontSize: 'clamp(1rem, 2vw, 1.2rem)', margin: 0 }}>🎓 교육</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>AI 활용법</p>
            </div>

            <span style={{ color: '#ffd60a', fontSize: '2rem', fontWeight: '900' }}>+</span>

            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '16px',
              padding: 'clamp(16px, 3vw, 24px) clamp(24px, 4vw, 36px)',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
            }}>
              <Wrench size={32} color="#fff" style={{ marginBottom: '8px' }} />
              <p style={{ color: '#fff', fontWeight: '800', fontSize: 'clamp(1rem, 2vw, 1.2rem)', margin: 0 }}>🛠️ 도구</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>AI 에이전트</p>
            </div>

            <span style={{ color: '#ffd60a', fontSize: '2rem', fontWeight: '900' }}>=</span>

            <div style={{
              background: 'linear-gradient(135deg, #e5c100 0%, #d97706 100%)',
              borderRadius: '16px',
              padding: 'clamp(16px, 3vw, 24px) clamp(24px, 4vw, 36px)',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)'
            }}>
              <Building2 size={32} color="#fff" style={{ marginBottom: '8px' }} />
              <p style={{ color: '#fff', fontWeight: '800', fontSize: 'clamp(1rem, 2vw, 1.2rem)', margin: 0 }}>🏙️ AI 도시</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>크리에이터 생태계</p>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube CEO 인용 섹션 */}
      <section style={{
        padding: '40px 20px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.05) 100%)',
          border: '1px solid rgba(255,0,0,0.2)',
          borderRadius: '20px',
          padding: 'clamp(24px, 5vw, 40px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* YouTube 로고 장식 */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            opacity: 0.1
          }}>
            <Play size={80} fill="#ff0000" color="#ff0000" />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: '#ff0000',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Play size={16} fill="#fff" color="#fff" />
              <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.85rem' }}>YouTube</span>
            </div>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>CEO 닐 모한 (Neal Mohan)</span>
          </div>

          <blockquote style={{
            color: '#fff',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            fontWeight: '600',
            lineHeight: '1.7',
            margin: '0 0 16px 0',
            fontStyle: 'italic',
            position: 'relative',
            zIndex: 1
          }}>
            "AI will create an entirely <span style={{ 
              color: '#ffd60a', 
              fontWeight: '900',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(251, 191, 36, 0.5)'
            }}>new class of creators</span> that today can't do it because they don't have the skills or equipment."
          </blockquote>

          <p style={{
            color: '#94a3b8',
            fontSize: '0.95rem',
            margin: 0,
            lineHeight: '1.6'
          }}>
            "AI는 <strong style={{ color: '#ffd60a' }}>완전히 새로운 크리에이터 계급</strong>을 만들어낼 것입니다.<br />
            지금은 기술이나 장비가 없어서 못하는 사람들도요."
          </p>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(251, 191, 36, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(251, 191, 36, 0.2)'
          }}>
            <p style={{
              color: '#ffd60a',
              fontSize: '1rem',
              fontWeight: '700',
              margin: 0,
              textAlign: 'center'
            }}>
              🎯 AI City Builders는 바로 이 <strong>"New Class of AI Creators"</strong>를 양성합니다
            </p>
          </div>
        </div>
      </section>

      {/* 우리가 하는 일 */}
      <section style={{
        padding: '60px 20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <h2 style={{
          color: '#ffd700',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          🎪 우리가 하는 일
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {/* YouTube = 무대 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,0,0,0.15) 0%, rgba(255,0,0,0.05) 100%)',
            border: '1px solid rgba(255,0,0,0.3)',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'rgba(255,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Play size={36} color="#ff0000" fill="#ff0000" />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '800', marginBottom: '12px' }}>
              YouTube
            </h3>
            <p style={{ color: '#ff6b6b', fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>
              🎭 무대를 제공
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              크리에이터가 활동할<br />세계 최고의 플랫폼
            </p>
          </div>

          {/* AI City Builders = 학교 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.05) 100%)',
            border: '2px solid rgba(251, 191, 36, 0.5)',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(251, 191, 36, 0.2)'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffd60a 0%, #e5c100 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)'
            }}>
              <GraduationCap size={36} color="#000" />
            </div>
            <h3 style={{ color: '#ffd60a', fontSize: '1.3rem', fontWeight: '800', marginBottom: '12px' }}>
              AI City Builders
            </h3>
            <p style={{ color: '#ffd60a', fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>
              🎓 교육 + 🛠️ 도구
            </p>
            <p style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              그 무대에 설 인재를<br /><strong style={{ color: '#ffd60a' }}>양성</strong>하고 <strong style={{ color: '#ffd60a' }}>도구</strong>를 제공
            </p>
          </div>
        </div>

        {/* 결과 */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
            border: '2px solid #ffd60a',
            borderRadius: '16px',
            padding: '24px 40px'
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 8px 0' }}>함께 만드는</p>
            <p style={{ 
              color: '#fff', 
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
              fontWeight: '800', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span>🏙️</span>
              <span style={{ color: '#ffd60a' }}>AI 크리에이터 도시</span>
            </p>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.03)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <a 
            href="https://www.youtube.com/@ConnectAILAB" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
          >
            <Youtube size={20} color="#ff0000" />
            <span>Connect AI LAB</span>
          </a>
          <a 
            href="https://www.instagram.com/aimentorjay" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8',
              textDecoration: 'none'
            }}
          >
            <Instagram size={20} color="#E1306C" />
            <span>aimentorjay (30만 팔로워)</span>
          </a>
        </div>
      </section>

      {/* 강의 로드맵 */}
      <section style={{
        padding: '60px 20px',
        background: 'rgba(251, 191, 36, 0.03)',
        borderTop: '1px solid rgba(251, 191, 36, 0.15)',
        borderBottom: '1px solid rgba(251, 191, 36, 0.15)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            color: '#ffd700',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            📚 강의 커리큘럼
          </h2>
          <p style={{
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '40px',
            fontSize: '1rem'
          }}>
            단계별로 AI 크리에이터가 되는 여정
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {roadmapSteps.map((step) => (
              <div
                key={step.step}
                onClick={() => step.path !== '#' && navigate(step.path)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: step.path !== '#' ? `2px solid ${step.color}40` : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '28px',
                  cursor: step.path !== '#' ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  if (step.path !== '#') {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = `0 15px 40px ${step.color}30`;
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Coming Soon 표시 */}
                {step.path === '#' && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#94a3b8',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: '600'
                  }}>
                    Coming Soon
                  </div>
                )}
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '18px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: step.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: `0 8px 20px ${step.color}40`
                  }}>
                    {step.icon}
                  </div>
                  <div>
                    <span style={{ color: step.color, fontSize: '0.8rem', fontWeight: '700' }}>
                      STEP {step.step} · {step.subtitle}
                    </span>
                    <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '18px', lineHeight: '1.6' }}>
                  {step.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    color: step.path !== '#' ? '#fff' : '#64748b',
                    fontWeight: '800',
                    fontSize: '1.15rem'
                  }}>
                    {step.price}
                  </span>
                  {step.path !== '#' && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: step.color,
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      수강하기 <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 비전 - 4단계 여정 */}
      <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          color: '#ffd700',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          🚀 AI 크리에이터 양성 로드맵
        </h2>
        <p style={{
          color: '#94a3b8',
          textAlign: 'center',
          marginBottom: '40px',
          fontSize: '1rem'
        }}>
          기술이 없어도 → AI로 콘텐츠 생성 → 수익화 → AI 도시의 일원
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {[
            { 
              icon: <GraduationCap size={32} />, 
              step: '01',
              title: '🎓 교육', 
              desc: 'AI 도구 사용법부터 콘텐츠 전략까지 체계적으로 배웁니다',
              color: '#3b82f6',
              highlight: '누구나 시작 가능'
            },
            { 
              icon: <Wrench size={32} />, 
              step: '02',
              title: '🛠️ 도구', 
              desc: 'AI 에이전트를 활용해 콘텐츠를 자동으로 생성합니다',
              color: '#10b981',
              highlight: '코딩 없이 자동화'
            },
            { 
              icon: <TrendingUp size={32} />, 
              step: '03',
              title: '💰 수익화', 
              desc: '수익형 콘텐츠 채널을 완성하고 월 수익을 창출합니다',
              color: '#e5c100',
              highlight: 'AI 크리에이터'
            },
            { 
              icon: <Globe size={32} />, 
              step: '04',
              title: '🏙️ AI 도시', 
              desc: '크리에이터 네트워크와 함께 성장하는 생태계에 합류합니다',
              color: '#8b5cf6',
              highlight: '함께 성장'
            }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
              border: `2px solid ${item.color}30`,
              borderRadius: '20px',
              padding: '28px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Step 번호 */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: item.color,
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '800'
              }}>
                STEP {item.step}
              </div>

              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: `${item.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '20px auto 16px',
                color: item.color
              }}>
                {item.icon}
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px' }}>
                {item.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                {item.desc}
              </p>
              <span style={{
                display: 'inline-block',
                background: `${item.color}20`,
                color: item.color,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}>
                {item.highlight}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Mentor Section */}
      <section style={{
        padding: '60px 20px',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            color: '#ffd700',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            👨‍🏫 대표 멘토 - 정원석 (Jay)
          </h2>

          {/* 멘토 프로필 카드 */}
          <div style={{
            background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
            border: '2px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '24px',
            padding: 'clamp(24px, 5vw, 40px)',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
                textAlign: 'center'
            }}>
              {/* Avatar */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '4px solid #ffd60a',
                overflow: 'hidden',
                boxShadow: '0 0 40px rgba(251, 191, 36, 0.3)'
              }}>
                <img 
                  src="/images/jaymentor.PNG" 
                  alt="정원석 (Jay) 멘토"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>

              {/* 한줄 소개 */}
              <p style={{
                color: '#e0e0e0',
                fontSize: '1.1rem',
                lineHeight: '1.7',
                maxWidth: '600px',
                margin: 0
              }}>
                <strong style={{ color: '#ffd60a' }}>AI로 콘텐츠를 만드는 크리에이터</strong>를 양성하고,<br />
                함께 <strong style={{ color: '#ffd60a' }}>AI 도시</strong>를 만들어가고 있습니다.
              </p>

              {/* 역할 배지 */}
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                flexWrap: 'wrap', 
                justifyContent: 'center' 
              }}>
                {[
                  '커넥젼에이아이 대표',
                  '서울사이버대 대우교수',
                  '인스타 30만 팔로워'
                ].map((role, idx) => (
                  <span key={idx} style={{
                    background: 'rgba(251, 191, 36, 0.15)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    color: '#ffd60a',
                    padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                    fontWeight: '600'
                }}>
                    {role}
                </span>
                ))}
              </div>
            </div>
          </div>

          {/* 학력 - 간단하게 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {[
              { level: '석사', school: '일리노이공대', major: 'Data Science (MS)' },
              { level: '학사', school: '뉴욕시립대', major: 'Data Science (BS)' }
            ].map((edu, idx) => (
              <div key={idx} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ffd60a 0%, #e5c100 100%)',
                  color: '#000',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '800'
                }}>
                  {edu.level}
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 4px', fontWeight: '700' }}>
                    {edu.school}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                    {edu.major}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, transparent 0%, rgba(251, 191, 36, 0.08) 100%)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(251, 191, 36, 0.15)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            padding: '8px 20px',
            borderRadius: '30px',
            marginBottom: '24px'
          }}>
            <span style={{ color: '#ffd60a', fontSize: '0.9rem', fontWeight: '600' }}>
              ✨ New Class of AI Creators
            </span>
          </div>

        <h2 style={{
          color: '#fff',
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: '900',
            marginBottom: '20px',
            lineHeight: '1.3'
          }}>
            AI 크리에이터가 되어<br />
            <span style={{ color: '#ffd60a' }}>AI 도시</span>를 함께 만들어갑시다
        </h2>

        <p style={{
          color: '#94a3b8',
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          marginBottom: '32px',
            lineHeight: '1.8'
          }}>
            기술이 없어도 괜찮습니다.<br />
            <strong style={{ color: '#fff' }}>교육</strong>으로 배우고, <strong style={{ color: '#fff' }}>도구</strong>로 만들고, <strong style={{ color: '#fff' }}>수익화</strong>합니다.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
        <button
          onClick={onBack}
          style={{
                background: 'linear-gradient(135deg, #ffd60a 0%, #e5c100 100%)',
            color: '#000',
            border: 'none',
                padding: '18px 40px',
                borderRadius: '14px',
            fontWeight: '800',
            fontSize: '1.1rem',
            cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(251, 191, 36, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(251, 191, 36, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(251, 191, 36, 0.4)';
              }}
            >
              🎓 강의 보러가기
            </button>

            <button
              onClick={() => navigate('/roadmap')}
              style={{
                background: 'transparent',
                color: '#ffd60a',
                border: '2px solid #ffd60a',
                padding: '18px 40px',
                borderRadius: '14px',
                fontWeight: '700',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              🗺️ 로드맵 보기
        </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          © 2025 AI City Builders. All rights reserved.
        </p>
      </footer>

      {/* Modal */}
      {selectedTranscript && (
        <div 
          onClick={closeTranscriptModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            <button 
              onClick={closeTranscriptModal}
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={30} />
            </button>
            <img 
              src={selectedTranscript} 
              alt="성적증명서" 
              style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CEOPage;
