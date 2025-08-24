import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Trophy, 
  CheckCircle, 
  Calendar,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import NavigationBar from './NavigationBar';

interface CorporatePackage {
  id: string;
  name: string;
  type: '기초 도입' | 'AI 전환' | '고급 전략';
  price: number;
  employees: number;
  duration: string;
  sessions: string;
  features: string[];
  badge?: string;
  recommended?: boolean;
}

interface CorporateMentoringPageProps {
  onBack: () => void;
}

const CorporateMentoringPage: React.FC<CorporateMentoringPageProps> = ({ onBack }) => {



  const corporatePackages: CorporatePackage[] = [
    {
      id: 'basic',
      name: 'AI 기초 도입',
      type: '기초 도입',
      price: 300,
      employees: 20,
      duration: '3개월',
      sessions: '월 4회 그룹 세션',
      features: [
        'ChatGPT, Claude 등 AI 도구 활용법',
        '업무별 AI 활용 사례 학습',
        '실무 적용 가이드라인 제공',
        '월간 진도 리포트',
        '24시간 Q&A 지원'
      ]
    },
    {
      id: 'standard',
      name: 'AI 업무 전환',
      type: 'AI 전환',
      price: 800,
      employees: 50,
      duration: '6개월',
      sessions: '월 8회 그룹 세션 + 임원진 개별 멘토링',
      features: [
        '부서별 맞춤 AI 도입 전략',
        '업무 프로세스 AI화 컨설팅',
        '임원진 1:1 멘토링 (월 2회)',
        'AI 도구 도입 및 교육',
        '성과 측정 및 개선 방안',
        '전담 매니저 배정'
      ],
      badge: 'BEST',
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'AI 전략 컨설팅',
      type: '고급 전략',
      price: 2000,
      employees: 200,
      duration: '12개월',
      sessions: 'C-Level 전용 1:1 멘토링',
      features: [
        '전사 AI 전환 로드맵 수립',
        'AI 조직 구축 및 거버넌스',
        'C-Level 전략 멘토링 (주 1회)',
        'AI 인재 채용 및 교육 체계',
        '경쟁사 분석 및 차별화 전략',
        '투자 계획 및 ROI 분석',
        '24/7 전담팀 지원'
      ],
      badge: 'PREMIUM'
    }
  ];

  const handleConsultation = (packageId: string) => {
    // 상담 신청 로직 구현
    const selectedPackage = corporatePackages.find(p => p.id === packageId);
    if (selectedPackage) {
      alert(`${selectedPackage.name} 패키지 상담이 신청되었습니다. 24시간 내에 연락드리겠습니다.`);
      // 추후 실제 상담 신청 API 호출 구현
      console.log('기업 상담 신청:', { packageId, packageName: selectedPackage.name });
    }
  };

  return (
    <div className="corporate-mentoring-page" style={{ background: '#000000', minHeight: '100vh', color: 'white' }}>
      <NavigationBar onBack={onBack} breadcrumbText="기업 AI 멘토링" />
      
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        padding: '80px 20px',
        borderBottom: '1px solid #333',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(207, 43, 74, 0.1) 50%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #cf2b4a, #b8243f)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '25px',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              <Building2 size={16} />
              CORPORATE AI MENTORING
            </div>
            
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #ffffff, #e5e5e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2'
            }}>
              기업 전체의 AI 역량을<br />한 번에 끌어올리세요
            </h1>
            
            <p style={{
              fontSize: '1.3rem',
              color: '#cccccc',
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}>
              구글, 삼성 출신 AI 전문가가 직접 설계하는<br />
              기업 맞춤형 AI 전환 전략과 실무 교육
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap',
              marginTop: '40px'
            }}>
              {[
                { icon: <Users size={24} />, label: '500+ 기업', desc: '성공적 AI 도입' },
                { icon: <Trophy size={24} />, label: '95%', desc: '고객 만족도' },
                { icon: <TrendingUp size={24} />, label: '300%', desc: '평균 업무 효율 증가' }
              ].map((stat, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#cf2b4a',
                  fontWeight: '600'
                }}>
                  {stat.icon}
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{stat.label}</div>
                    <div style={{ fontSize: '0.9rem', color: '#999' }}>{stat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section style={{ padding: '80px 20px', background: '#000000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: 'white'
            }}>
              기업 규모별 맞춤 패키지
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#999',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              스타트업부터 대기업까지, 기업의 성장 단계에 맞는<br />
              최적의 AI 도입 전략을 제공합니다
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}>
            {corporatePackages.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  background: pkg.recommended 
                    ? 'linear-gradient(135deg, rgba(207, 43, 74, 0.1), rgba(184, 36, 63, 0.05))' 
                    : 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                  border: pkg.recommended 
                    ? '2px solid rgba(207, 43, 74, 0.5)' 
                    : '2px solid rgba(207, 43, 74, 0.2)',
                  borderRadius: '20px',
                  padding: '40px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'rgba(207, 43, 74, 0.7)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(207, 43, 74, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = pkg.recommended 
                    ? 'rgba(207, 43, 74, 0.5)' 
                    : 'rgba(207, 43, 74, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {pkg.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #cf2b4a, #b8243f)',
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '25px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {pkg.badge}
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '10px'
                  }}>
                    {pkg.name}
                  </h3>
                  
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    color: '#cf2b4a',
                    marginBottom: '5px'
                  }}>
                    {pkg.price.toLocaleString()}만원
                  </div>
                  
                  <div style={{
                    color: '#999',
                    fontSize: '0.9rem',
                    marginBottom: '20px'
                  }}>
                    월 기준 / {pkg.duration} 패키지
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#cf2b4a',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      <Users size={16} />
                      {pkg.employees}명 대상
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#cf2b4a',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      <Calendar size={16} />
                      {pkg.duration}
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '15px',
                    borderRadius: '10px',
                    marginBottom: '30px'
                  }}>
                    <div style={{
                      color: '#cf2b4a',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      marginBottom: '5px'
                    }}>
                      세션 구성
                    </div>
                    <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
                      {pkg.sessions}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{
                    color: '#cf2b4a',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '15px'
                  }}>
                    포함 서비스
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {pkg.features.map((feature, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        marginBottom: '10px',
                        color: '#ccc',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                      }}>
                        <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleConsultation(pkg.id)}
                  style={{
                    width: '100%',
                    background: pkg.recommended 
                      ? 'linear-gradient(135deg, #cf2b4a, #b8243f)'
                      : 'rgba(207, 43, 74, 0.1)',
                    border: pkg.recommended ? 'none' : '2px solid #cf2b4a',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (pkg.recommended) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #b8243f, #a01e36)';
                    } else {
                      e.currentTarget.style.background = '#cf2b4a';
                    }
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    if (pkg.recommended) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #cf2b4a, #b8243f)';
                    } else {
                      e.currentTarget.style.background = 'rgba(207, 43, 74, 0.1)';
                    }
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  무료 상담 신청
                  <ArrowRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, rgba(207, 43, 74, 0.05), rgba(0, 0, 0, 0.8))',
        borderTop: '1px solid #333'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: 'white'
            }}>
              성공 사례
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#999',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              다양한 산업군의 기업들이 CLATHON과 함께<br />
              AI 전환에 성공했습니다
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {[
              {
                company: 'A 제조업체',
                industry: '제조업',
                employees: '120명',
                result: '업무 효율 280% 증가',
                period: '6개월',
                testimonial: 'AI 도입으로 생산성이 크게 향상되었고, 직원들의 AI 활용 능력이 눈에 띄게 개선되었습니다.'
              },
              {
                company: 'B 마케팅 에이전시',
                industry: '마케팅',
                employees: '45명',
                result: '고객 만족도 95% 달성',
                period: '3개월',
                testimonial: 'AI를 활용한 마케팅 전략으로 클라이언트들의 만족도가 크게 향상되었습니다.'
              },
              {
                company: 'C 스타트업',
                industry: 'IT 서비스',
                employees: '25명',
                result: '개발 속도 300% 향상',
                period: '4개월',
                testimonial: 'AI 도구를 적극 활용하여 개발 프로세스를 혁신하고 경쟁력을 확보했습니다.'
              }
            ].map((story, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                padding: '30px',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <Building2 size={24} color="#cf2b4a" />
                  <div>
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: 'white'
                    }}>
                      {story.company}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#999'
                    }}>
                      {story.industry} · {story.employees}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(207, 43, 74, 0.1)',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: '#cf2b4a',
                    marginBottom: '5px'
                  }}>
                    {story.result}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#999'
                  }}>
                    {story.period} 만에 달성
                  </div>
                </div>

                <blockquote style={{
                  color: '#ccc',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  fontStyle: 'italic',
                  borderLeft: '3px solid #cf2b4a',
                  paddingLeft: '15px',
                  margin: 0
                }}>
                  "{story.testimonial}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, rgba(207, 43, 74, 0.1), rgba(139, 92, 246, 0.1))',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff, #e5e5e5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            지금 시작하세요
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#999',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            무료 상담을 통해 귀하의 기업에 최적화된<br />
            AI 도입 전략을 확인해보세요
          </p>
          <button
            onClick={() => handleConsultation('consultation')}
            style={{
              background: 'linear-gradient(135deg, #cf2b4a, #b8243f)',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '15px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #b8243f, #a01e36)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(207, 43, 74, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #cf2b4a, #b8243f)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            무료 상담 신청하기
            <ArrowRight size={24} />
          </button>
          <div style={{
            fontSize: '0.9rem',
            color: '#666',
            marginTop: '20px'
          }}>
            📞 24시간 내 연락 · 💰 상담 완전 무료 · 🎯 맞춤 전략 제공
          </div>
        </div>
      </section>
    </div>
  );
};

export default CorporateMentoringPage;
