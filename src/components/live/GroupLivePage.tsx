import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, Calendar, Star, CheckCircle, ArrowRight, Play, Zap, Target, TrendingUp } from 'lucide-react';
import NavigationBar from '../NavigationBar';

interface GroupLivePageProps {
  onBack?: () => void;
}

interface GroupSession {
  id: string;
  title: string;
  description: string;
  mentor: string;
  mentorTitle: string;
  scheduledTime: Date;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  price: number;
}

const GroupLivePage: React.FC<GroupLivePageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  // selectedPackage 제거 - 개별 세션 결제로 변경
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 임시 데이터 - 추후 Azure Table Storage에서 가져올 예정
  const upcomingSessions: GroupSession[] = [
    {
      id: 'group-1',
      title: 'ChatGPT 활용 실무 워크샵',
      description: '업무 효율성을 10배 높이는 ChatGPT 활용법을 배우고 실습합니다',
      mentor: '정원석',
      mentorTitle: 'AI 전문가 / 전 구글 엔지니어',
      scheduledTime: new Date('2025-01-20T19:00:00'),
      duration: 90,
      maxParticipants: 12,
      currentParticipants: 8,
      level: 'beginner',
      topics: ['프롬프트 엔지니어링', '업무 자동화', '실습 프로젝트'],
      price: 99000
    },
    {
      id: 'group-2', 
      title: 'AI 이미지 생성 마스터클래스',
      description: 'Midjourney, Stable Diffusion을 활용한 창작 워크샵',
      mentor: '김AI',
      mentorTitle: '크리에이티브 AI 전문가',
      scheduledTime: new Date('2025-01-22T20:00:00'),
      duration: 120,
      maxParticipants: 10,
      currentParticipants: 5,
      level: 'intermediate',
      topics: ['Midjourney 고급', 'Stable Diffusion', '상업적 활용'],
      price: 129000
    },
    {
      id: 'group-3',
      title: 'Python으로 배우는 머신러닝',
      description: '코딩 경험자를 위한 실무 중심 머신러닝 입문',
      mentor: '박코딩',
      mentorTitle: '데이터 사이언티스트 / 삼성전자',
      scheduledTime: new Date('2025-01-25T14:00:00'),
      duration: 150,
      maxParticipants: 8,
      currentParticipants: 3,
      level: 'advanced',
      topics: ['Python 라이브러리', '모델 구축', '실전 프로젝트'],
      price: 159000
    }
  ];

  // 패키지 제거 - 1회성 결제로 변경

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('clathon_user_session');
    setIsLoggedIn(!!storedUserInfo);
  }, []);

  const handleSessionApply = (sessionId: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    // 임시로 알림 - 추후 실제 신청 폼으로 연결
    alert('곧 신청 기능이 오픈됩니다! 현재는 베타 테스트 중입니다.');
  };

  // 패키지 선택 함수 제거 - 개별 세션 결제로 변경

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return level;
    }
  };

  return (
    <div className="masterclass-container">
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="그룹 학습"
      />

      {/* 히어로 섹션 */}
      <section style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(207, 43, 74, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(207, 43, 74, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '20px',
            border: '1px solid rgba(207, 43, 74, 0.3)'
          }}>
            <Zap size={16} color="#cf2b4a" />
            <span style={{ color: '#cf2b4a', fontSize: '14px', fontWeight: '600' }}>실시간 라이브 학습</span>
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ffffff 0%, #cf2b4a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            함께 배우는 AI,<br />
            <span style={{ color: '#cf2b4a' }}>10배 더 재미있게</span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: '#cccccc',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            혼자 공부하다 포기했나요? 전문가와 동료들과 함께하는 소그룹 라이브 세션으로
            <br />실시간 상호작용하며 AI를 정복하세요!
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#cf2b4a', fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>98%</div>
              <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>학습 완주율</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#cf2b4a', fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>4.8</div>
              <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>평균 만족도</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#cf2b4a', fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>500+</div>
              <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>누적 학습자</div>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section style={{ padding: '80px 20px', background: '#000000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '60px',
            background: 'linear-gradient(135deg, #ffffff 0%, #cf2b4a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            왜 그룹 학습인가요?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Users size={28} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>실시간 상호작용</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                질문이 생기면 즉시 해결! 멘토와 동료들과 실시간으로 소통하며 
                막히는 부분 없이 학습할 수 있습니다.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Target size={28} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>동기부여 극대화</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                같은 목표를 가진 동료들과 함께 학습하며 서로 격려하고 동기부여를 
                받아 끝까지 완주할 수 있습니다.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <TrendingUp size={28} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>네트워킹 기회</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                AI 분야의 전문가들과 동료 학습자들과 네트워킹하며 
                취업, 이직, 사업 기회까지 얻을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 예정된 세션 */}
      <section id="upcoming-sessions" style={{ padding: '80px 20px', background: '#000000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '60px',
            background: 'linear-gradient(135deg, #ffffff 0%, #cf2b4a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            다가오는 라이브 세션
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {upcomingSessions.map((session) => (
              <div key={session.id} style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                borderRadius: '20px',
                padding: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(207, 43, 74, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{
                    background: getLevelColor(session.level),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {getLevelText(session.level)}
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    ₩{session.price.toLocaleString()}
                  </div>
                </div>

                <h3 style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '12px',
                  lineHeight: '1.3'
                }}>
                  {session.title}
                </h3>

                <p style={{
                  color: '#cccccc',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  {session.description}
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ color: '#cf2b4a', fontWeight: '600', marginBottom: '8px' }}>
                    {session.mentor} - {session.mentorTitle}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cccccc' }}>
                      <Calendar size={16} />
                      <span style={{ fontSize: '0.9rem' }}>
                        {session.scheduledTime.toLocaleDateString('ko-KR', { 
                          month: 'long', 
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cccccc' }}>
                      <Clock size={16} />
                      <span style={{ fontSize: '0.9rem' }}>
                        {session.scheduledTime.toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })} ({session.duration}분)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cccccc', marginBottom: '16px' }}>
                    <Users size={16} />
                    <span style={{ fontSize: '0.9rem' }}>
                      {session.currentParticipants}/{session.maxParticipants}명 참여중
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {session.topics.map((topic, index) => (
                      <span key={index} style={{
                        background: 'rgba(207, 43, 74, 0.2)',
                        color: '#cf2b4a',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        border: '1px solid rgba(207, 43, 74, 0.3)'
                      }}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSessionApply(session.id)}
                  style={{
                    width: '100%',
                    background: session.currentParticipants >= session.maxParticipants 
                      ? 'rgba(107, 114, 128, 0.5)' 
                      : 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: session.currentParticipants >= session.maxParticipants ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  disabled={session.currentParticipants >= session.maxParticipants}
                >
                  {session.currentParticipants >= session.maxParticipants ? (
                    <>
                      <CheckCircle size={20} />
                      정원 마감
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      세션 신청하기
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 결제 방식 안내 */}
      <section style={{ padding: '80px 20px', background: '#000000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #cf2b4a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            간편한 세션별 결제
          </h2>
          
          <p style={{
            textAlign: 'center',
            color: '#cccccc',
            fontSize: '1.2rem',
            marginBottom: '60px'
          }}>
            원하는 세션만 골라서 참여하세요. 부담 없는 1회 결제 시스템입니다.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <CheckCircle size={28} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>1회 결제</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                관심 있는 세션만 선택해서 결제하세요. 
                월 구독 부담 없이 자유롭게 참여할 수 있습니다.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Clock size={28} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>즉시 확정</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                결제 완료 즉시 세션 참여가 확정됩니다. 
                Zoom 링크와 자료는 이메일로 발송됩니다.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Shield size={28} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>환불 보장</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                세션 시작 24시간 전까지 100% 환불 가능합니다. 
                안전하고 부담 없는 결제 시스템입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '20px'
          }}>
            지금 시작하세요!
          </h2>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.2rem',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            혼자 공부하다 포기했던 AI, 이제 함께 정복해보세요.<br />
            전문가와 동료들이 함께하는 여정이 기다리고 있습니다.
          </p>

          <button
            onClick={() => {
              if (!isLoggedIn) {
                navigate('/login');
              } else {
                // 첫 번째 세션으로 스크롤
                document.querySelector('#upcoming-sessions')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{
              background: 'white',
              color: '#cf2b4a',
              border: 'none',
              padding: '18px 40px',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Play size={24} />
            세션 선택하기
            <ArrowRight size={20} />
          </button>

          <div style={{
            marginTop: '20px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem'
          }}>
            ✅ 첫 세션 무료 체험 • ✅ 언제든 취소 가능 • ✅ 14일 환불 보장
          </div>
        </div>
      </section>
    </div>
  );
};

export default GroupLivePage;
