import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Building, GraduationCap, Briefcase, Users, Globe, Trophy, Youtube, Instagram, X, Sparkles, Bot, Zap, Building2, ArrowRight } from 'lucide-react';
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
      path: '/courses/ai-building'
    },
    {
      step: 2,
      title: 'AI 에이전트 비기너',
      subtitle: '훈련하기',
      icon: <Bot size={24} />,
      description: '구글 OPAL로 멀티 AI 시스템 훈련',
      price: '₩95,000',
      color: '#10b981',
      path: '/courses/chatgpt-agent-beginner'
    },
    {
      step: 3,
      title: 'connexionai',
      subtitle: '만들기',
      icon: <Zap size={24} />,
      description: 'AI 수익화 전문 자동화 에이전트',
      price: '₩79,000/월',
      color: '#f59e0b',
      path: '/courses/connexionai'
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

      {/* Hero Section */}
      <section style={{
        padding: '80px 20px 60px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '30px'
        }}>
          {/* Avatar */}
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '4px solid #d4af37',
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)'
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

          {/* Badges */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['AI 전문가', '기업가', '교수'].map((badge) => (
              <span key={badge} style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: '#ffd700',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                {badge}
              </span>
            ))}
          </div>

          {/* Title */}
          <div>
            <h1 style={{
              color: '#ffffff',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '900',
              marginBottom: '12px'
            }}>
              AI City Builders
            </h1>
            <p style={{
              color: '#f59e0b',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              디지털 건물주 양성 플랫폼
            </p>
          </div>

          {/* Goal Box */}
          <div style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)',
            borderRadius: '20px',
            padding: '28px 40px',
            maxWidth: '700px'
          }}>
            <p style={{
              color: '#000',
              fontSize: '1.2rem',
              fontWeight: '800',
              margin: '0 0 8px 0'
            }}>
              🎯 우리의 목표
            </p>
            <p style={{
              color: '#000',
              fontSize: '1.5rem',
              fontWeight: '900',
              margin: '0 0 12px 0'
            }}>
              인공지능 수익화에서 최고가 되는 것
            </p>
            <p style={{
              color: 'rgba(0,0,0,0.7)',
              fontSize: '1rem',
              fontWeight: '600',
              margin: 0
            }}>
              최고의 교육과 최고의 도구를 제공합니다.
            </p>
          </div>

          {/* Description */}
          <p style={{
            color: '#e0e0e0',
            fontSize: '1rem',
            lineHeight: '1.8',
            maxWidth: '700px'
          }}>
            AI City Builders는 월 수익이 나오는 새로운 패러다임의 디지털 건물을 
            AI로 구축하는 혁신적인 플랫폼입니다. 하나의 수익이 되는 채널을 
            '디지털 건물'로 정의하고, 디지털 건물주들의 네트워크를 구축하여 
            AI 도시 생태계를 만들어갑니다.
          </p>

          {/* Social */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8'
            }}>
              <Youtube size={20} color="#f59e0b" />
              <span>Connect AI LAB</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8'
            }}>
              <Instagram size={20} color="#f59e0b" />
              <span>aimentorjay (30만 팔로워)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section style={{
        padding: '60px 20px',
        background: 'rgba(212, 175, 55, 0.03)',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            color: '#ffd700',
            fontSize: '1.8rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            🚀 AI 수익화 로드맵
          </h2>
          <p style={{
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            배우고 → 훈련하고 → 만들고 → 키우기
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {roadmapSteps.map((step) => (
              <div
                key={step.step}
                onClick={() => step.path !== '#' && navigate(step.path)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: step.path !== '#' ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '12px',
                    background: step.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    {step.icon}
                  </div>
                  <div>
                    <span style={{ color: step.color, fontSize: '0.8rem', fontWeight: '600' }}>
                      STEP {step.step} · {step.subtitle}
                    </span>
                    <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {step.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '1.1rem'
                  }}>
                    {step.price}
                  </span>
                  {step.path !== '#' && (
                    <ArrowRight size={18} color={step.color} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => navigate('/roadmap')}
              style={{
                background: 'transparent',
                border: '2px solid #f59e0b',
                color: '#f59e0b',
                padding: '14px 32px',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              로드맵 자세히 보기 →
            </button>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          color: '#ffd700',
          fontSize: '1.8rem',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <Users size={28} />
          AI City Builders의 비전
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {[
            { icon: <GraduationCap size={32} />, title: 'AI 수익화 교육', desc: 'AI 도구를 활용해 콘텐츠 생성부터 자동화까지, 지속적인 수익을 만드는 시스템 구축' },
            { icon: <Briefcase size={32} />, title: '디지털 건물 완성', desc: '유튜브, 블로그 등 디지털 플랫폼을 매월 수익이 나오는 건물로 완성' },
            { icon: <Trophy size={32} />, title: '건물주 네트워크', desc: '성공한 디지털 건물주들이 모여 협력하여 더 큰 성과를 만들어냄' },
            { icon: <Globe size={32} />, title: 'AI 도시 완성', desc: '개별 건물들이 연결되어 지속 가능한 디지털 경제 생태계 구축' }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '16px',
              padding: '28px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#ffd700'
              }}>
                {item.icon}
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '12px' }}>
                {item.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mentor Section */}
      <section style={{
        padding: '80px 20px',
        background: 'rgba(255,255,255,0.02)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            color: '#ffd700',
            fontSize: '1.8rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <Award size={28} />
            대표 멘토 - 정원석 (Jay)
          </h2>

          {/* Education */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '50px'
          }}>
            {[
              { level: '석사', school: '일리노이공대', english: 'Illinois Institute of Technology', major: 'Data Science (MS)' },
              { level: '학사', school: '뉴욕시립대', english: 'CUNY Baruch College', major: 'Data Science (BS)' }
            ].map((edu, idx) => (
              <div key={idx} style={{
                background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '16px',
                padding: '28px',
                textAlign: 'center'
              }}>
                <span style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)',
                  color: '#000',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}>
                  {edu.level}
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: '16px 0 8px' }}>
                  {edu.school}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 8px' }}>
                  {edu.english}
                </p>
                <p style={{ color: '#f59e0b', fontSize: '0.95rem', fontWeight: '600' }}>
                  {edu.major}
                </p>
              </div>
            ))}
          </div>

          {/* Current Roles */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { icon: <Building size={24} />, title: '커넥젼에이아이 대표', desc: 'AI 솔루션 개발' },
              { icon: <GraduationCap size={24} />, title: '서울사이버대 대우교수', desc: 'AI 전공' },
              { icon: <Youtube size={24} />, title: 'Connect AI LAB', desc: '유튜브 채널' },
              { icon: <Instagram size={24} />, title: '30만 팔로워', desc: '@aimentorjay' }
            ].map((role, idx) => (
              <div key={idx} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#f59e0b', marginBottom: '8px' }}>{role.icon}</div>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 4px' }}>{role.title}</h4>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.05) 100%)'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: '2rem',
          fontWeight: '800',
          marginBottom: '16px'
        }}>
          디지털 건물주가 되어<br />AI 도시를 함께 만들어갑시다
        </h2>
        <p style={{
          color: '#94a3b8',
          fontSize: '1.1rem',
          marginBottom: '32px',
          maxWidth: '600px',
          margin: '0 auto 32px'
        }}>
          15년간의 실전 경험과 노하우를 바탕으로,<br />
          당신도 월 수익을 창출하는 디지털 건물을 만들 수 있습니다.
        </p>
        <button
          onClick={onBack}
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)',
            color: '#000',
            border: 'none',
            padding: '18px 48px',
            borderRadius: '16px',
            fontWeight: '800',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)'
          }}
        >
          강의 보러가기 →
        </button>
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
