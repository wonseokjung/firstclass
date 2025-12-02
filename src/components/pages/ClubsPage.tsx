import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp, Sparkles, Users, ArrowRight, CheckCircle } from 'lucide-react';
import NavigationBar from '../common/NavigationBar';

interface ClubsPageProps {
  onBack: () => void;
}

interface ClubTier {
  id: string;
  name: string;
  icon: string;
  monthlyIncome: string;
  description: string;
  benefits: string[];
  color: string;
  gradient: string;
  badgeColor: string;
}

const clubTiers: ClubTier[] = [
  {
    id: 'beginner',
    name: '예비 클럽',
    icon: '🌱',
    monthlyIncome: '0원',
    description: '첫 수익을 목표로 학습하고 있는 예비 창업자',
    benefits: [
      '기본 커뮤니티 접근',
      '학습 자료 공유',
      '질문 & 답변 게시판',
      '월간 온라인 모임'
    ],
    color: '#94a3b8',
    gradient: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
    badgeColor: '#64748b'
  },
  {
    id: 'starter',
    name: '월 10만원 클럽',
    icon: '💚',
    monthlyIncome: '월 10만원',
    description: '첫 수익을 달성한 신규 크리에이터',
    benefits: [
      '월 10만원 달성 배지',
      '성공 스토리 공유',
      '전용 채팅방 접근',
      '월간 수익 분석 리포트'
    ],
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    badgeColor: '#059669'
  },
  {
    id: 'side',
    name: '월 100만원 클럽',
    icon: '💛',
    monthlyIncome: '월 100만원',
    description: '부업으로 성공한 크리에이터',
    benefits: [
      '월 100만원 달성 배지',
      '프리미엄 커뮤니티',
      '1:1 멘토링 기회',
      '광고 수익화 전략 공유',
      '전용 네트워킹 이벤트'
    ],
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    badgeColor: '#f59e0b'
  },
  {
    id: 'pro',
    name: '월 300만원 클럽',
    icon: '🧡',
    monthlyIncome: '월 300만원',
    description: '본업 전환이 가능한 프로 크리에이터',
    benefits: [
      '월 300만원 달성 배지',
      'VIP 커뮤니티 접근',
      '월간 프라이빗 세미나',
      '사업 확장 전략 컨설팅',
      '협업 기회 우선 제공',
      '메인 페이지 프로필 노출'
    ],
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #fed7aa, #fdba74)',
    badgeColor: '#ea580c'
  },
  {
    id: 'master',
    name: '월 1000만원+ 클럽',
    icon: '💎',
    monthlyIncome: '월 1,000만원 이상',
    description: 'AI 콘텐츠 비즈니스 마스터',
    benefits: [
      '월 1000만원+ 달성 배지',
      '마스터 전용 라운지',
      '개인 맞춤 컨설팅',
      '외부 강연 & 출판 기회',
      '파트너십 & 투자 연결',
      '강사 & 멘토로 활동 가능',
      '평생 VIP 혜택'
    ],
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #e9d5ff, #d8b4fe)',
    badgeColor: '#7c3aed'
  }
];

const ClubsPage: React.FC<ClubsPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState<string | null>(null);

  const handleApplyClick = (clubId: string) => {
    if (clubId === 'beginner') {
      alert('예비 클럽은 자동으로 가입됩니다! 첫 수익을 달성하면 월 10만원 클럽에 신청하세요! 🌱');
      return;
    }
    // TODO: 클럽 신청 페이지로 이동
    alert('클럽 신청 기능은 곧 오픈됩니다! 🚀');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <NavigationBar onBack={onBack} breadcrumbText="건물주 클럽" />

      {/* 히어로 섹션 */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        padding: 'clamp(60px, 10vw, 100px) clamp(20px, 4vw, 40px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1), transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(251, 191, 36, 0.1)',
            border: '2px solid #fbbf24',
            padding: '8px 20px',
            borderRadius: '999px',
            marginBottom: '20px',
            fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
            fontWeight: '700',
            color: '#fbbf24'
          }}>
            🏆 AI CITY 건물주 클럽
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '900',
            marginBottom: '25px',
            lineHeight: '1.2'
          }}>
            함께 성장하는<br />
            수익 창출 커뮤니티
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)',
            lineHeight: '1.7',
            opacity: '0.9',
            maxWidth: '700px',
            margin: '0 auto 40px'
          }}>
            월 10만원부터 1,000만원 이상까지,<br />
            AI 콘텐츠로 수익을 만드는 크리에이터들의 실전 커뮤니티입니다.
          </p>

          <div style={{
            display: 'flex',
            gap: 'clamp(20px, 4vw, 40px)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: 'clamp(20px, 3vw, 30px)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              minWidth: 'clamp(140px, 20vw, 180px)'
            }}>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '10px' }}>🌱</div>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#fbbf24' }}>5개</div>
              <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', opacity: '0.8' }}>클럽 단계</div>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: 'clamp(20px, 3vw, 30px)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              minWidth: 'clamp(140px, 20vw, 180px)'
            }}>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '10px' }}>👥</div>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#10b981' }}>곧</div>
              <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', opacity: '0.8' }}>활성 멤버</div>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: 'clamp(20px, 3vw, 30px)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              minWidth: 'clamp(140px, 20vw, 180px)'
            }}>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '10px' }}>💰</div>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#8b5cf6' }}>1천만원+</div>
              <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', opacity: '0.8' }}>최고 수익</div>
            </div>
          </div>
        </div>
      </div>

      {/* 클럽 단계 소개 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(60px, 10vw, 80px) clamp(20px, 4vw, 40px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(50px, 8vw, 70px)' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '15px'
          }}>
            클럽 단계별 혜택
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.3vw, 1.2rem)',
            color: '#64748b',
            lineHeight: '1.6'
          }}>
            수익 단계에 맞는 클럽에 가입하고, 같은 목표를 가진 동료들과 함께 성장하세요
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(25px, 4vw, 35px)'
        }}>
          {clubTiers.map((club, index) => (
            <div
              key={club.id}
              onClick={() => setSelectedClub(selectedClub === club.id ? null : club.id)}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: 'clamp(25px, 4vw, 35px)',
                boxShadow: selectedClub === club.id 
                  ? `0 20px 40px ${club.color}40` 
                  : '0 4px 20px rgba(0,0,0,0.08)',
                border: selectedClub === club.id 
                  ? `3px solid ${club.color}` 
                  : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedClub === club.id ? 'translateY(-8px)' : 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (selectedClub !== club.id) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 30px ${club.color}30`;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedClub !== club.id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }
              }}
            >
              {/* 클럽 헤더 */}
              <div style={{
                background: club.gradient,
                borderRadius: '12px',
                padding: 'clamp(20px, 3vw, 25px)',
                marginBottom: '25px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', marginBottom: '10px' }}>
                  {club.icon}
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
                  fontWeight: '800',
                  color: club.badgeColor,
                  marginBottom: '8px'
                }}>
                  {club.name}
                </h3>
                <div style={{
                  fontSize: 'clamp(1rem, 2.3vw, 1.2rem)',
                  fontWeight: '700',
                  color: club.color
                }}>
                  {club.monthlyIncome}
                </div>
              </div>

              <p style={{
                fontSize: 'clamp(0.95rem, 2.1vw, 1.05rem)',
                color: '#64748b',
                lineHeight: '1.7',
                marginBottom: '25px',
                minHeight: '50px'
              }}>
                {club.description}
              </p>

              {/* 혜택 리스트 */}
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{
                  fontSize: 'clamp(1rem, 2.2vw, 1.1rem)',
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Sparkles size={20} color={club.color} />
                  클럽 혜택
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {club.benefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        marginBottom: '12px',
                        fontSize: 'clamp(0.9rem, 2vw, 0.95rem)',
                        color: '#475569',
                        lineHeight: '1.6'
                      }}
                    >
                      <CheckCircle size={18} color={club.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 신청 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApplyClick(club.id);
                }}
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 2.5vw, 15px)',
                  background: club.id === 'beginner' 
                    ? 'linear-gradient(135deg, #94a3b8, #64748b)' 
                    : `linear-gradient(135deg, ${club.color}, ${club.badgeColor})`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: 'clamp(0.95rem, 2.1vw, 1.05rem)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${club.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {club.id === 'beginner' ? '자동 가입' : '클럽 신청하기'}
                <ArrowRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA 섹션 */}
      <div style={{
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        padding: 'clamp(60px, 10vw, 80px) clamp(20px, 4vw, 40px)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '20px',
            lineHeight: '1.3'
          }}>
            당신의 수익 목표는 무엇인가요?
          </h2>
          <p style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: '1.7',
            marginBottom: '40px'
          }}>
            작은 시작부터 큰 성공까지,<br />
            AI City Builders와 함께 한 단계씩 성장하세요.
          </p>
          <button
            onClick={() => navigate('/chatgpt-agent-beginner')}
            style={{
              padding: 'clamp(15px, 3vw, 18px) clamp(40px, 6vw, 50px)',
              background: 'white',
              color: '#f59e0b',
              border: 'none',
              borderRadius: '12px',
              fontSize: 'clamp(1.05rem, 2.3vw, 1.2rem)',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}
          >
            🚀 지금 시작하기
            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubsPage;

