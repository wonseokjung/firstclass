import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle, PlayCircle, Clock, Award } from 'lucide-react';
import NavigationBar from '../../../common/NavigationBar';
import AzureTableService from '../../../../services/azureTableService';
import Day1Page from './Day1Page';

interface ChatGPTAgentBeginnerPlayerPageProps {
  onBack: () => void;
}

const ChatGPTAgentBeginnerPlayerPage: React.FC<ChatGPTAgentBeginnerPlayerPageProps> = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  const lessons = [
    {
      day: 1,
      title: "AI 에이전트의 세계에 오신 것을 환영합니다",
      duration: "60분",
      isLocked: false,
      description: "AI 에이전트와 ChatGPT의 차이, AgentKit 소개"
    },
    {
      day: 2,
      title: "나만의 첫 번째 챗봇 만들기",
      duration: "60분",
      isLocked: false,
      description: "Agent Builder 기본 구조 이해"
    },
    {
      day: 3,
      title: "프롬프트 엔지니어링 기초",
      duration: "60분",
      isLocked: false,
      description: "좋은 프롬프트 작성법"
    },
    {
      day: 4,
      title: "File Search - 문서를 읽는 AI",
      duration: "60분",
      isLocked: false,
      description: "PDF, TXT 파일 처리"
    },
    {
      day: 5,
      title: "첫 번째 프로젝트 - 나만의 비서 AI",
      duration: "60분",
      isLocked: false,
      description: "Week 1 총정리 프로젝트"
    },
    {
      day: 6,
      title: "Agent Builder 워크플로우 이해하기",
      duration: "60분",
      isLocked: false,
      description: "Start → Agent → End 구조"
    },
    {
      day: 7,
      title: "Transform - 데이터 가공의 마법",
      duration: "60분",
      isLocked: false,
      description: "데이터 변환과 포맷팅"
    },
    {
      day: 8,
      title: "Human Approval - 안전장치 추가하기",
      duration: "60분",
      isLocked: false,
      description: "Human-in-the-loop 개념"
    },
    {
      day: 9,
      title: "Logic Node - AI가 스스로 판단하게 하기",
      duration: "60분",
      isLocked: false,
      description: "조건문과 의사결정"
    },
    {
      day: 10,
      title: "두 번째 프로젝트 - 업무 자동화 시스템",
      duration: "60분",
      isLocked: false,
      description: "Week 2 총정리 프로젝트"
    },
    {
      day: 11,
      title: "ChatKit으로 웹에 배포하기",
      duration: "60분",
      isLocked: false,
      description: "웹사이트에 챗봇 배포"
    },
    {
      day: 12,
      title: "챗봇 디자인 커스터마이징",
      duration: "60분",
      isLocked: false,
      description: "UI/UX 디자인 적용"
    },
    {
      day: 13,
      title: "Input Node로 맞춤형 입력 받기",
      duration: "60분",
      isLocked: false,
      description: "구조화된 입력 폼 만들기"
    },
    {
      day: 14,
      title: "Evals & AI 성능 최적화",
      duration: "60분",
      isLocked: false,
      description: "AI 성능 평가와 최적화"
    },
    {
      day: 15,
      title: "최종 프로젝트 - 나만의 AI 서비스 런칭",
      duration: "90분",
      isLocked: false,
      description: "전체 과정 복습 및 최종 프로젝트"
    }
  ];

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');

        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setIsLoggedIn(true);
          setUserInfo(parsedUserInfo);

          // Azure 테이블에서 결제 상태 확인
          try {
            const paymentStatus = await AzureTableService.checkCoursePayment(
              parsedUserInfo.email, 
              'chatgpt-agent-beginner'
            );

            if (paymentStatus && paymentStatus.isPaid) {
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
          alert('로그인이 필요한 서비스입니다.');
          window.location.href = '/';
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
        window.location.href = '/';
      }
    };

    checkAuthStatus();
  }, []);

  // Day 페이지가 선택되면 해당 페이지를 렌더링
  if (selectedDay === 1) {
    return <Day1Page onBack={() => setSelectedDay(null)} />;
  }
  // Day 2~15는 추후 추가
  // if (selectedDay === 2) return <Day2Page onBack={() => setSelectedDay(null)} />;

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

  const progressPercentage = (completedDays.size / lessons.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <NavigationBar
        onBack={onBack}
        breadcrumbText="ChatGPT AI AGENT 비기너편"
      />

      {/* 헤더 - 전체 진행률 */}
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
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: '800',
            marginBottom: '15px'
          }}>
            ChatGPT AI AGENT 비기너편
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: '0.95',
            marginBottom: '30px'
          }}>
            15일 완성 | 하루 1시간씩 나만의 AI 에이전트 마스터하기
          </p>

          {/* 전체 진행률 */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={24} />
                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>전체 진행률</span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                {completedDays.size} / {lessons.length}
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
        margin: '40px auto',
        padding: '0 20px'
      }}>
        {/* Week별로 그룹화 */}
        {[
          { week: 1, title: 'Week 1: 기초 다지기', days: [1, 2, 3, 4, 5], description: 'AI와 Agent 개념 완전 이해' },
          { week: 2, title: 'Week 2: 도구 익히기', days: [6, 7, 8, 9, 10], description: '도구와 제어 구조 익히기' },
          { week: 3, title: 'Week 3: 실전 완성', days: [11, 12, 13, 14, 15], description: '실전 프로젝트 완성' }
        ].map((week) => (
          <div key={week.week} style={{ marginBottom: '50px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                marginBottom: '8px'
              }}>
                {week.title}
              </h2>
              <p style={{
                fontSize: '1.05rem',
                opacity: '0.95',
                margin: 0
              }}>
                {week.description}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {week.days.map((dayNum) => {
                const lesson = lessons[dayNum - 1];
                const isCompleted = completedDays.has(dayNum);
                const isLocked = lesson.isLocked;

                return (
                  <div
                    key={dayNum}
                    onClick={() => !isLocked && setSelectedDay(dayNum)}
                    style={{
                      background: 'white',
                      borderRadius: '15px',
                      padding: '25px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                      border: isCompleted ? '2px solid #10b981' : '2px solid #e2e8f0',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      opacity: isLocked ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                      if (!isLocked) {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.2)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isLocked) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                      }
                    }}
                  >
                    {isCompleted && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: '#10b981',
                        color: 'white',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                      }}>
                        <CheckCircle size={20} />
                      </div>
                    )}

                    {isLocked && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: '#64748b',
                        color: 'white',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Lock size={18} />
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        background: isCompleted ? '#dcfce7' : '#dbeafe',
                        color: isCompleted ? '#166534' : '#1e40af',
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        fontWeight: '800'
                      }}>
                        {dayNum}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#64748b',
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          Day {dayNum}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#64748b',
                          fontSize: '0.85rem'
                        }}>
                          <Clock size={14} />
                          {lesson.duration}
                        </div>
                      </div>
                    </div>

                    <h3 style={{
                      fontSize: '1.15rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '10px',
                      lineHeight: '1.4'
                    }}>
                      {lesson.title}
                    </h3>

                    <p style={{
                      fontSize: '0.95rem',
                      color: '#64748b',
                      lineHeight: '1.6',
                      marginBottom: '15px'
                    }}>
                      {lesson.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: isLocked ? '#64748b' : '#0ea5e9',
                      fontSize: '0.95rem',
                      fontWeight: '600'
                    }}>
                      {isLocked ? (
                        <>
                          <Lock size={16} />
                          잠김
                        </>
                      ) : (
                        <>
                          <PlayCircle size={16} />
                          학습하기
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ChatGPTAgentBeginnerPlayerPage;

