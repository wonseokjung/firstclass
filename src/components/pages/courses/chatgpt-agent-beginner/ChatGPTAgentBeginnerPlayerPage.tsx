import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Lock, CheckCircle } from 'lucide-react';
import NavigationBar from '../../../common/NavigationBar';
import AzureTableService from '../../../../services/azureTableService';

interface ChatGPTAgentBeginnerPlayerPageProps {
  onBack: () => void;
}

const ChatGPTAgentBeginnerPlayerPage: React.FC<ChatGPTAgentBeginnerPlayerPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');

        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);

          // 테스트 계정 확인 (개발/테스트용)
          const testAccounts = ['test10@gmail.com'];
          const isTestAccount = testAccounts.includes(parsedUserInfo.email);

          // Azure 테이블에서 결제 상태 확인
          try {
            const paymentStatus = await AzureTableService.checkCoursePayment(
              parsedUserInfo.email, 
              'chatgpt-agent-beginner'
            );

            if ((paymentStatus && paymentStatus.isPaid) || isTestAccount) {
              setIsPaidUser(true);
            } else {
              // 결제하지 않은 사용자는 결제 페이지로 리다이렉트
              alert('이 강의는 결제 후 수강하실 수 있습니다.');
              window.location.href = '/chatgpt-agent-beginner';
            }
          } catch (azureError) {
            console.error('❌ Azure 테이블 조회 실패:', azureError);
            alert('결제 정보를 확인할 수 없습니다. 다시 시도해주세요.');
            window.location.href = '/chatgpt-agent-beginner';
          }
        } else {
          // 로그인하지 않은 사용자는 로그인 페이지로
          const confirmLogin = window.confirm('로그인이 필요한 서비스입니다. 먼저 로그인해주세요.\n\n로그인 페이지로 이동하시겠습니까?');
          if (confirmLogin) {
            window.location.href = '/login';
          } else {
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
        window.location.href = '/';
      }
    };

    checkAuthStatus();
  }, []);

  // localStorage에서 완료된 Day 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('completed-days-chatgpt-agent');
    if (saved) {
      setCompletedDays(new Set(JSON.parse(saved)));
    }
  }, []);

  // 강의 데이터
  const courseData = {
    weeks: [
      {
        title: 'CORE (Day 1-3)',
        subtitle: 'AI의 사고 구조 이해하기',
        days: [
          { day: 1, title: '내 첫 AI 친구: ChatGPT와 Agent의 차이', duration: '60분', hasQuiz: true },
          { day: 2, title: 'AI 한 명 vs AI 팀: 협업형 에이전트 구조', duration: '60분', hasQuiz: false },
          { day: 3, title: 'AI의 두뇌 이해하기: LLM의 세계', duration: '60분', hasQuiz: true }
        ]
      },
      {
        title: 'TOOLS (Day 4-9)',
        subtitle: '에이전트 성장시키기',
        days: [
          { day: 4, title: '기억 심기 (File Search)', duration: '60분', hasQuiz: false },
          { day: 5, title: '안전장치 달기 (Guardrails)', duration: '60분', hasQuiz: true },
          { day: 6, title: '도구 연결하기 (MCP)', duration: '60분', hasQuiz: false },
          { day: 7, title: '판단 훈련 (if/else)', duration: '60분', hasQuiz: false },
          { day: 8, title: '승인 절차 배우기 (User Approval)', duration: '60분', hasQuiz: false },
          { day: 9, title: '기억력 훈련 (Set State)', duration: '60분', hasQuiz: true }
        ]
      },
      {
        title: 'PROJECT (Day 10-15)',
        subtitle: '실전형 AI 에이전트 6종 완성',
        days: [
          { day: 10, title: '데이터 통합 에이전트', duration: '90분', hasQuiz: false },
          { day: 11, title: '일정 설계 에이전트', duration: '90분', hasQuiz: false },
          { day: 12, title: '고객 응대 에이전트', duration: '90분', hasQuiz: false },
          { day: 13, title: '데이터 질의응답 에이전트', duration: '90분', hasQuiz: false },
          { day: 14, title: '문서 비교 에이전트', duration: '90분', hasQuiz: false },
          { day: 15, title: '사내 지식 에이전트', duration: '90분', hasQuiz: true }
        ]
      }
    ]
  };

  const totalDays = 15;
  const progressPercentage = (completedDays.size / totalDays) * 100;

  const handleDayClick = (day: number) => {
    if (day === 1) {
      navigate('/chatgpt-agent-beginner/day1');
    } else {
      alert(`Day ${day} 강의는 준비 중입니다. 곧 공개될 예정입니다! 🚀`);
    }
  };

  // 결제 확인 중이거나 미결제 사용자
  if (!isPaidUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #0ea5e9',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          결제 정보 확인 중...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f8fafc, #ffffff)' }}>
      <NavigationBar
        onBack={onBack}
        breadcrumbText="ChatGPT AI AGENT 비기너편"
      />

      {/* 헤더 & 진행률 */}
      <div style={{
        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        color: 'white',
        padding: '40px 20px',
        boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              🤖
            </div>
            <div>
              <h1 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: '800',
                marginBottom: '5px'
              }}>
                AI Agent Maker
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                opacity: '0.95',
                margin: 0
          }}>
                15일 완성, 나만의 인공지능 에이전트 만들기
          </p>
            </div>
          </div>

          {/* 진행률 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            padding: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>전체 학습 진행률</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                {completedDays.size}/{totalDays} 완료 ({Math.round(progressPercentage)}%)
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'white',
                borderRadius: '10px',
                transition: 'width 0.5s ease',
                boxShadow: '0 2px 8px rgba(255, 255, 255, 0.3)'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 강의 목록 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {courseData.weeks.map((week, weekIndex) => (
          <div key={weekIndex} style={{
            marginBottom: '50px'
          }}>
            {/* Week 헤더 */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              borderRadius: '15px',
              padding: '25px 30px',
              marginBottom: '25px',
              border: '2px solid #0ea5e9'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 1.8rem)',
                fontWeight: '800',
                color: '#0369a1',
                marginBottom: '8px'
              }}>
                📚 {week.title}
              </h2>
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                color: '#0c4a6e',
                margin: 0,
                fontWeight: '600'
              }}>
                {week.subtitle}
              </p>
            </div>

            {/* Day 카드들 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {week.days.map((lesson) => {
                const isCompleted = completedDays.has(lesson.day);
                const isAvailable = lesson.day === 1; // Day 1만 현재 사용 가능

                return (
                  <div
                    key={lesson.day}
                    onClick={() => isAvailable && handleDayClick(lesson.day)}
                    style={{
                      background: 'white',
            borderRadius: '15px',
            padding: '25px',
                      border: isCompleted ? '2px solid #10b981' : '2px solid #e2e8f0',
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      opacity: isAvailable ? 1 : 0.6,
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                      if (isAvailable) {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.2)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (isAvailable) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                      }
                    }}
                  >
                    {/* 완료 배지 */}
                    {isCompleted && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: '#10b981',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <CheckCircle size={16} />
                        완료
                      </div>
                    )}

                    {/* Day 번호 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: isCompleted ? '#10b981' : (isAvailable ? '#0ea5e9' : '#94a3b8'),
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        flexShrink: 0
                      }}>
                        {isAvailable ? (isCompleted ? <CheckCircle size={28} /> : lesson.day) : <Lock size={24} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.9rem',
                          color: '#64748b',
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          Day {lesson.day}
                        </div>
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          ⏱️ {lesson.duration}
                          {lesson.hasQuiz && <span>📝 퀴즈</span>}
                        </div>
                      </div>
                    </div>

                    {/* 제목 */}
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '15px',
                      lineHeight: '1.4'
                    }}>
                      {lesson.title}
                    </h3>

                    {/* 버튼 */}
                    {isAvailable ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '15px',
                        borderTop: '1px solid #e2e8f0'
                      }}>
                        <span style={{
                          color: '#0ea5e9',
                          fontSize: '0.95rem',
                          fontWeight: '600'
                        }}>
                          {isCompleted ? '다시 학습하기' : '학습 시작하기'}
                        </span>
                        <PlayCircle size={24} color="#0ea5e9" />
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '15px',
                        borderTop: '1px solid #e2e8f0',
                        color: '#94a3b8',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        🔒 곧 공개 예정
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 학습 완료 시 축하 메시지 */}
        {completedDays.size === totalDays && (
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            border: '2px solid #fbbf24',
            marginTop: '40px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
              fontWeight: '800',
              color: '#92400e',
              marginBottom: '15px'
            }}>
              축하합니다! 모든 강의를 완료하셨습니다!
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#78350f',
              lineHeight: '1.8'
            }}>
              이제 여러분은 AI 에이전트 메이커입니다! 🚀<br />
              배운 내용을 활용하여 멋진 AI 에이전트를 만들어보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatGPTAgentBeginnerPlayerPage;

