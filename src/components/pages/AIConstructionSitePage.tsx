import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Search, 
  Video, 
  Image, 
  BarChart3, 
  Upload,
  Sparkles,
  Zap,
  Crown,
  Star,
  ArrowRight,
  Bot,
  Cpu,
  Workflow
} from 'lucide-react';
import NavigationBar from '../common/NavigationBar';

interface AIConstructionSitePageProps {
  onBack: () => void;
}

interface Agent {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  description: string;
  features: string[];
  status: 'available' | 'coming_soon';
  route?: string;
}

const AIConstructionSitePage: React.FC<AIConstructionSitePageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  const agents: Agent[] = [
    {
      id: 'trend',
      title: '트렌드 분석',
      subtitle: 'Trend Analyzer',
      icon: <TrendingUp size={36} />,
      gradient: 'linear-gradient(135deg, #d4af37, #f4d03f)',
      glowColor: 'rgba(212, 175, 55, 0.4)',
      description: 'AI가 유튜브 시장을 분석하고 수익성 높은 채널 주제를 추천합니다.',
      features: ['채널 주제 5가지 추천', '시장성 & 수익성 분석', '타겟 고객 파악'],
      status: 'available',
      route: '/ai-construction-site/step1'
    },
    {
      id: 'research',
      title: '레퍼런스 리서치',
      subtitle: 'Reference Researcher',
      icon: <Search size={36} />,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      description: '인기 채널과 영상을 자동 분석하여 성공 패턴을 파악합니다.',
      features: ['트렌디 채널 TOP 20', '인기 영상 분석', 'AI 인사이트 제공'],
      status: 'available',
      route: '/ai-construction-site/step2'
    },
    {
      id: 'content',
      title: '콘텐츠 생성기',
      subtitle: 'Content Creator',
      icon: <Video size={36} />,
      gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      glowColor: 'rgba(139, 92, 246, 0.4)',
      description: '대본, 이미지, 음성을 한 번에 자동 생성합니다.',
      features: ['AI 대본 생성', '장면별 이미지 생성', 'TTS 음성 생성'],
      status: 'available',
      route: '/ai-construction-site/step3'
    },
    {
      id: 'thumbnail',
      title: '썸네일 생성기',
      subtitle: 'Thumbnail Creator',
      icon: <Image size={36} />,
      gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      description: 'AI가 클릭률 높은 썸네일을 자동으로 디자인합니다.',
      features: ['AI 썸네일 디자인', '클릭률 예측', 'A/B 테스트 제안'],
      status: 'coming_soon'
    },
    {
      id: 'workflow',
      title: '워크플로우 에디터',
      subtitle: 'Workflow Editor',
      icon: <Workflow size={36} />,
      gradient: 'linear-gradient(135deg, #d4af37, #f59e0b)',
      glowColor: 'rgba(212, 175, 55, 0.5)',
      description: 'n8n 스타일로 AI 에이전트를 자유롭게 연결하세요.',
      features: ['노드 기반 UI', '드래그 & 드롭', '커스텀 워크플로우'],
      status: 'available',
      route: '/ai-workflow-editor'
    },
    {
      id: 'analytics',
      title: '채널 분석기',
      subtitle: 'Channel Analyzer',
      icon: <BarChart3 size={36} />,
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      description: '채널 성과를 분석하고 성장 전략을 제안합니다.',
      features: ['성과 리포트', '성장 전략 추천', '경쟁 분석'],
      status: 'coming_soon'
    },
    {
      id: 'upload',
      title: '자동 업로드',
      subtitle: 'Auto Uploader',
      icon: <Upload size={36} />,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      description: 'n8n 연동으로 영상 업로드와 SEO를 자동화합니다.',
      features: ['자동 업로드', 'SEO 최적화', '최적 시간 게시'],
      status: 'coming_soon'
    }
  ];

  const handleAgentClick = (agent: Agent) => {
    if (agent.status === 'available' && agent.route) {
      navigate(agent.route);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #0f1629 50%, #1a1a3a 100%)',
      paddingBottom: '80px'
    }}>
      <NavigationBar
        onBack={onBack}
        breadcrumbText="AI 건물 공사장"
      />

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        padding: '60px 20px 80px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Effects */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)
          `,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '50px',
            padding: '10px 24px',
            marginBottom: '30px',
            backdropFilter: 'blur(10px)'
          }}>
            <Crown size={18} color="#d4af37" />
            <span style={{
              color: '#d4af37',
              fontSize: '0.9rem',
              fontWeight: '700',
              letterSpacing: '1px'
            }}>
              CONNECT AI LAB
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 7vw, 4rem)',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #ffffff 0%, #d4af37 50%, #f4d03f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '20px',
            lineHeight: '1.1',
            letterSpacing: '-1px'
          }}>
            🏗️ AI 건물<br />
            공사장
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            color: '#94a3b8',
            maxWidth: '600px',
            margin: '0 auto 30px',
            lineHeight: '1.7'
          }}>
            AI 에이전트와 함께 당신의 유튜브 채널을<br />
            <span style={{ color: '#d4af37', fontWeight: '600' }}>처음부터 끝까지</span> 건설하세요
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#d4af37' }}>6</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>AI 에이전트</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>3</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>사용 가능</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#8b5cf6' }}>∞</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>자동화 가능</div>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
          }}>
            <Bot size={28} color="#0a0a1a" />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#ffffff',
              margin: 0
            }}>
              AI 에이전트 선택
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              margin: '5px 0 0 0'
            }}>
              원하는 에이전트를 클릭하여 시작하세요
            </p>
          </div>
        </div>

        {/* Agents Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => handleAgentClick(agent)}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
              style={{
                position: 'relative',
                background: hoveredAgent === agent.id 
                  ? 'rgba(30, 30, 60, 0.95)' 
                  : 'rgba(20, 20, 40, 0.8)',
                borderRadius: '24px',
                padding: '30px',
                border: `2px solid ${hoveredAgent === agent.id ? 'rgba(212, 175, 55, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                cursor: agent.status === 'available' ? 'pointer' : 'default',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredAgent === agent.id ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredAgent === agent.id 
                  ? `0 20px 60px ${agent.glowColor}` 
                  : '0 4px 30px rgba(0, 0, 0, 0.3)',
                overflow: 'hidden',
                opacity: agent.status === 'coming_soon' ? 0.7 : 1
              }}
            >
              {/* Glow Effect */}
              {hoveredAgent === agent.id && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: agent.gradient,
                  boxShadow: `0 0 30px ${agent.glowColor}`
                }} />
              )}

              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: agent.status === 'available' 
                  ? 'linear-gradient(135deg, #10b981, #059669)' 
                  : 'linear-gradient(135deg, #64748b, #475569)',
                padding: '6px 14px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                {agent.status === 'available' ? (
                  <>
                    <Zap size={12} color="white" />
                    <span style={{ fontSize: '0.75rem', color: 'white', fontWeight: '700' }}>
                      사용 가능
                    </span>
                  </>
                ) : (
                  <>
                    <Star size={12} color="white" />
                    <span style={{ fontSize: '0.75rem', color: 'white', fontWeight: '700' }}>
                      Coming Soon
                    </span>
                  </>
                )}
              </div>

              {/* Icon */}
              <div style={{
                width: '70px',
                height: '70px',
                background: agent.gradient,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: `0 8px 30px ${agent.glowColor}`,
                color: 'white'
              }}>
                {agent.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: '5px'
              }}>
                {agent.title}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: '#64748b',
                marginBottom: '15px',
                fontFamily: 'monospace',
                letterSpacing: '1px'
              }}>
                {agent.subtitle}
              </p>

              {/* Description */}
              <p style={{
                fontSize: '0.95rem',
                color: '#94a3b8',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                {agent.description}
              </p>

              {/* Features */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '25px'
              }}>
                {agent.features.map((feature, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '20px',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      color: '#d4af37',
                      fontWeight: '500'
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              {agent.status === 'available' && (
                <button
                  style={{
                    width: '100%',
                    background: hoveredAgent === agent.id ? agent.gradient : 'rgba(212, 175, 55, 0.1)',
                    border: hoveredAgent === agent.id ? 'none' : '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: hoveredAgent === agent.id ? '#0a0a1a' : '#d4af37',
                    fontSize: '1rem',
                    fontWeight: '700'
                  }}
                >
                  <Sparkles size={18} />
                  에이전트 시작하기
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Section - Technology Stack */}
        <div style={{
          marginTop: '60px',
          background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.9), rgba(30, 30, 60, 0.9))',
          borderRadius: '24px',
          padding: '40px',
          border: '2px solid rgba(212, 175, 55, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Decoration */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <Cpu size={28} color="#d4af37" />
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '800',
                color: '#ffffff',
                margin: 0
              }}>
                최첨단 AI 기술 스택
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {[
                { icon: '🧠', name: 'GPT-4.1 Turbo', desc: 'OpenAI 최신 모델' },
                { icon: '🎨', name: 'Gemini 3 Pro', desc: 'Google 이미지 AI' },
                { icon: '🔊', name: 'ElevenLabs', desc: '초현실 음성 합성' },
                { icon: '⚡', name: 'n8n Automation', desc: '워크플로우 자동화' }
              ].map((tech, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(10, 10, 26, 0.6)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{tech.icon}</div>
                  <div style={{ color: '#d4af37', fontWeight: '700', fontSize: '1rem', marginBottom: '5px' }}>
                    {tech.name}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    {tech.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          padding: '30px',
          background: 'rgba(20, 20, 40, 0.5)',
          borderRadius: '20px',
          border: '1px dashed rgba(212, 175, 55, 0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🚀</div>
          <p style={{
            color: '#94a3b8',
            fontSize: '1rem',
            margin: 0,
            lineHeight: '1.7'
          }}>
            새로운 AI 에이전트가 <span style={{ color: '#d4af37', fontWeight: '600' }}>2025년 상반기</span>에 순차적으로 출시됩니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIConstructionSitePage;
