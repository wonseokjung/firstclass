import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Lightbulb, Settings, Video, FileText, Rocket, CheckCircle } from 'lucide-react';
import NavigationBar from '../common/NavigationBar';

interface AIConstructionSitePageProps {
  onBack: () => void;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  description: string;
  features: string[];
  status: 'locked' | 'available' | 'completed';
}

const AIConstructionSitePage: React.FC<AIConstructionSitePageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps: Step[] = [
    {
      id: 1,
      title: '🎯 Step 1: 입지 선정',
      subtitle: '유튜브 채널 주제 선정 & 시장 분석',
      icon: <Lightbulb size={32} />,
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      description: 'AI가 당신의 관심사를 분석하고, 수익성 높은 유튜브 채널 주제를 추천해드립니다.',
      features: [
        '💡 AI 기반 유튜브 채널 주제 5가지 추천',
        '📊 트렌드 분석 & 시장성 평가',
        '🎯 타겟 고객 분석',
        '💰 예상 수익성 점수 (0-100)',
        '⭐ 난이도 평가 (초급/중급/고급)'
      ],
      status: 'available'
    },
    {
      id: 2,
      title: '🔍 Step 2: 레퍼런스 리서치',
      subtitle: '트렌드 분석 & 성공 사례 수집',
      icon: <Settings size={32} />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      description: '유튜브에서 트렌디한 채널과 인기 영상을 자동으로 분석하여 성공 패턴을 파악합니다.',
      features: [
        '📊 트렌디한 채널 TOP 20 자동 검색',
        '🎬 인기 영상 TOP 15 분석',
        '📈 조회수, 구독자, 업로드 빈도 분석',
        '🎯 AI 기반 콘텐츠 패턴 분석',
        '💡 맞춤형 전략 인사이트 제공'
      ],
      status: 'available'
    },
    {
      id: 3,
      title: '🎬 Step 3: 건물 짓기',
      subtitle: '콘텐츠 제작 (대본 → 영상)',
      icon: <Video size={32} />,
      color: '#64748b',
      gradient: 'linear-gradient(135deg, #94a3b8, #64748b)',
      description: '대본 작성부터 영상 생성, 썸네일 제작까지 원스톱 자동화로 콘텐츠를 완성합니다.',
      features: [
        '📜 AI 대본 작성 (주제 입력 → 완성 스크립트)',
        '🎥 Google Veo 영상 자동 생성',
        '🖼️ 썸네일 5종 자동 생성 (A/B 테스트)',
        '🎵 배경음악 & 효과음 자동 추천',
        '🎭 AI 음성 더빙 (ElevenLabs 연동)'
      ],
      status: 'locked'
    },
    {
      id: 4,
      title: '✂️ Step 4: 인테리어',
      subtitle: '편집 & 자막 (최종 마무리)',
      icon: <FileText size={32} />,
      color: '#64748b',
      gradient: 'linear-gradient(135deg, #94a3b8, #64748b)',
      description: '자막, 효과, 음악까지 AI가 자동으로 편집하여 전문가 수준의 영상을 완성합니다.',
      features: [
        '💬 자막 자동 생성 (Whisper API)',
        '🎨 자막 스타일 & 애니메이션 적용',
        '🎵 배경음악 자동 믹싱',
        '✨ 트랜지션 & 효과 자동 추가',
        '📱 숏폼 자동 변환 (세로 영상)'
      ],
      status: 'locked'
    },
    {
      id: 5,
      title: '🚀 Step 5: 준공 & 입주',
      subtitle: '업로드 & 최적화',
      icon: <Rocket size={32} />,
      color: '#64748b',
      gradient: 'linear-gradient(135deg, #94a3b8, #64748b)',
      description: 'n8n 자동화로 YouTube 업로드부터 SEO 최적화까지 한 번에 완료합니다.',
      features: [
        '📤 YouTube 자동 업로드 (n8n 연동)',
        '📝 제목/설명/태그 SEO 자동 최적화',
        '⏰ 최적 게시 시간 AI 추천',
        '📊 채널 분석 & 성과 리포트',
        '🔄 퍼널 전략 자동화 가이드'
      ],
      status: 'locked'
    }
  ];

  const handleStepClick = (stepId: number, status: string) => {
    if (status === 'locked') {
      return; // locked 상태면 클릭 무시
    }
    
    if (activeStep === stepId) {
      setActiveStep(null);
    } else {
      setActiveStep(stepId);
    }
  };

  const handleStartStep = (stepId: number) => {
    if (stepId === 1) {
      navigate('/ai-construction-site/step1');
    } else if (stepId === 2) {
      navigate('/ai-construction-site/step2');
    } else {
      // locked 상태는 버튼이 보이지 않으므로 여기는 실행 안 됨
      alert(`Step ${stepId} 기능은 곧 출시됩니다! 🚀`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #334155 100%)',
      paddingBottom: '80px'
    }}>
      <NavigationBar
        onBack={onBack}
        breadcrumbText="AI 도시 공사장"
      />

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)',
        textAlign: 'center',
        borderBottom: '4px solid #fbbf24',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(251, 191, 36, 0.05) 35px, rgba(251, 191, 36, 0.05) 70px)`,
          pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            marginBottom: '20px'
          }}>
            🏗️
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '900',
            color: 'white',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            AI 도시 공사장
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
            color: '#e2e8f0',
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            당신의 AI 비즈니스를 단계별로 건설합니다
          </p>
          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: '#94a3b8',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            아이디어 발굴부터 채널 세팅, 콘텐츠 제작, 편집, 업로드까지<br />
            5단계로 완성하는 올인원 AI 자동화 시스템
          </p>

          {/* Progress Badge */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(251, 191, 36, 0.2)',
            border: '2px solid #fbbf24',
            borderRadius: '50px',
            padding: '12px 30px',
            marginTop: '30px',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              color: '#fbbf24',
              fontWeight: '700'
            }}>
              🚧 공사 진행률: 0% → 100%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(30px, 6vw, 60px) clamp(15px, 4vw, 20px)'
      }}>
        {/* Connect AI LAB 소개 */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: 'clamp(12px, 3vw, 20px)',
          padding: 'clamp(30px, 6vw, 50px)',
          marginBottom: 'clamp(30px, 6vw, 50px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          border: '3px solid #fbbf24',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 패턴 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(251, 191, 36, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)
            `,
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              padding: '8px 20px',
              borderRadius: '30px',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
            }}>
              <span style={{
                fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '0.5px'
              }}>
                🔬 POWERED BY CONNECT AI LAB
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #ffffff, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '20px',
              lineHeight: '1.3'
            }}>
              인공지능 기반 유튜브 채널<br />
              자동 생성 시스템
            </h2>

            <p style={{
              fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)',
              color: '#e2e8f0',
              lineHeight: '1.8',
              marginBottom: '25px',
              fontWeight: '500'
            }}>
              <strong style={{ color: '#fbbf24' }}>Connect AI LAB</strong>이 연구·개발한 최첨단 AI 기술로<br />
              아이디어부터 채널 운영, 콘텐츠 제작까지 <strong style={{ color: '#fbbf24' }}>완전 자동화</strong>합니다.
            </p>

            {/* 기술 스택 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginTop: '30px'
            }}>
              <div style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '12px',
                padding: '15px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🧠</div>
                <div style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1rem)', color: '#fbbf24', fontWeight: '700' }}>
                  AI 분석 엔진
                </div>
                <div style={{ fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)', color: '#94a3b8', marginTop: '5px' }}>
                  GPT-4.1 기반 시장 분석
                </div>
              </div>

              <div style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '12px',
                padding: '15px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🎬</div>
                <div style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1rem)', color: '#fbbf24', fontWeight: '700' }}>
                  콘텐츠 자동 생성
                </div>
                <div style={{ fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)', color: '#94a3b8', marginTop: '5px' }}>
                  Google OPAL 멀티모달
                </div>
              </div>

              <div style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '12px',
                padding: '15px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⚡</div>
                <div style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1rem)', color: '#fbbf24', fontWeight: '700' }}>
                  워크플로우 자동화
                </div>
                <div style={{ fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)', color: '#94a3b8', marginTop: '5px' }}>
                  n8n 기반 시스템
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: 'clamp(12px, 3vw, 20px)',
          padding: 'clamp(25px, 5vw, 40px)',
          marginBottom: 'clamp(30px, 6vw, 50px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(251, 191, 36, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span>🎯</span>
            <span>AI 도시 공사장이란?</span>
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            color: '#e2e8f0',
            lineHeight: '1.8',
            marginBottom: '20px'
          }}>
            복잡한 AI 비즈니스 구축 과정을 <strong style={{ color: '#fbbf24' }}>건설 프로젝트처럼 단계별로 나눠</strong> 누구나 쉽게 따라할 수 있게 만든 올인원 플랫폼입니다.
          </p>
          <div style={{
            background: 'rgba(251, 191, 36, 0.15)',
            borderLeft: '4px solid #fbbf24',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
              color: '#fbbf24',
              margin: 0,
              lineHeight: '1.7'
            }}>
              <strong>💡 핵심 철학:</strong> <span style={{ color: '#e2e8f0' }}>"건물을 짓듯이, AI 비즈니스도 설계 → 기초 → 건축 → 인테리어 → 준공 순서로!"</span><br />
              <span style={{ color: '#cbd5e1' }}>각 단계마다 필요한 AI 도구와 자동화 시스템을 제공합니다.</span>
            </p>
          </div>
        </div>

        {/* Steps */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(20px, 4vw, 30px)'
        }}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              style={{
                background: step.status === 'locked' 
                  ? 'rgba(51, 65, 85, 0.6)' 
                  : 'rgba(30, 41, 59, 0.9)',
                borderRadius: 'clamp(12px, 3vw, 20px)',
                overflow: 'hidden',
                boxShadow: step.status === 'locked'
                  ? '0 4px 20px rgba(0, 0, 0, 0.2)'
                  : activeStep === step.id 
                    ? `0 10px 40px ${step.color}60` 
                    : '0 6px 30px rgba(0, 0, 0, 0.3)',
                border: `2px solid ${step.status === 'locked' ? 'rgba(100, 116, 139, 0.3)' : activeStep === step.id ? step.color : 'rgba(251, 191, 36, 0.3)'}`,
                transition: 'all 0.3s ease',
                cursor: step.status === 'locked' ? 'not-allowed' : 'pointer',
                opacity: step.status === 'locked' ? 0.5 : 1,
                backdropFilter: 'blur(10px)'
              }}
              onClick={() => handleStepClick(step.id, step.status)}
            >
              {/* Header */}
              <div style={{
                background: step.gradient,
                padding: 'clamp(20px, 4vw, 30px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(15px, 3vw, 20px)',
                  flex: 1
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    width: 'clamp(50px, 10vw, 70px)',
                    height: 'clamp(50px, 10vw, 70px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      fontWeight: '800',
                      color: 'white',
                      marginBottom: '5px'
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0
                    }}>
                      {step.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight 
                  size={28} 
                  color="white" 
                  style={{
                    transform: activeStep === step.id ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </div>

              {/* Expanded Content */}
              {activeStep === step.id && (
                <div style={{
                  padding: 'clamp(25px, 5vw, 35px)',
                  borderTop: '2px solid rgba(251, 191, 36, 0.2)'
                }}>
                  <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                    color: '#e2e8f0',
                    lineHeight: '1.7',
                    marginBottom: '25px'
                  }}>
                    {step.description}
                  </p>

                  {/* Features */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '12px',
                    padding: 'clamp(20px, 4vw, 25px)',
                    marginBottom: '25px',
                    border: '1px solid rgba(251, 191, 36, 0.2)'
                  }}>
                    <h4 style={{
                      fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
                      fontWeight: '700',
                      color: '#fbbf24',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <CheckCircle size={20} color={step.color} />
                      <span>포함된 기능</span>
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      {step.features.map((feature, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                            color: '#cbd5e1',
                            lineHeight: '1.6',
                            paddingLeft: '0',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}
                        >
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (step.status !== 'locked') {
                        handleStartStep(step.id);
                      }
                    }}
                    disabled={step.status === 'locked'}
                    style={{
                      width: '100%',
                      background: step.status === 'locked' ? '#cbd5e1' : step.gradient,
                      color: step.status === 'locked' ? '#64748b' : 'white',
                      border: 'none',
                      padding: 'clamp(15px, 3vw, 20px)',
                      borderRadius: '12px',
                      fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
                      fontWeight: '800',
                      cursor: step.status === 'locked' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: step.status === 'locked' ? 'none' : `0 4px 15px ${step.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                    onMouseOver={(e) => {
                      if (step.status !== 'locked') {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 6px 25px ${step.color}60`;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (step.status !== 'locked') {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 4px 15px ${step.color}40`;
                      }
                    }}
                  >
                    {step.status === 'locked' ? (
                      <>
                        <span>🔒</span>
                        <span>준비 중</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>지금 시작하기</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: 'clamp(12px, 3vw, 20px)',
          padding: 'clamp(25px, 5vw, 35px)',
          marginTop: 'clamp(30px, 6vw, 50px)',
          border: '3px solid rgba(251, 191, 36, 0.4)',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            marginBottom: '15px'
          }}>
            🚧
          </div>
          <h3 style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: '800',
            color: '#fbbf24',
            marginBottom: '15px'
          }}>
            현재 공사 중입니다!
          </h3>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            color: '#e2e8f0',
            lineHeight: '1.7',
            margin: 0
          }}>
            AI 도시 공사장의 모든 기능은 <strong style={{ color: '#fbbf24' }}>2025년 상반기</strong>에 순차적으로 오픈됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIConstructionSitePage;

