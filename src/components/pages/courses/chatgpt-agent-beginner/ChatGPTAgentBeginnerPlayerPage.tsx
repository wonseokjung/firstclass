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
              
              // Azure에서 완료된 강의 데이터 가져오기
              try {
                const enrollments = await AzureTableService.getUserEnrollmentsByEmail(parsedUserInfo.email);
                console.log('📚 전체 수강 정보:', enrollments);
                
                // chatgpt-agent-beginner 또는 1002 강의 찾기
                const targetCourse = enrollments.find((e: any) => 
                  e.courseId === 'chatgpt-agent-beginner' || e.courseId === '1002'
                );
                
                if (targetCourse && targetCourse.completedDays) {
                  console.log('✅ 완료된 강의:', targetCourse.completedDays);
                  setCompletedDays(new Set(targetCourse.completedDays));
                } else {
                  console.log('ℹ️ 완료된 강의가 없습니다.');
                  setCompletedDays(new Set());
                }
              } catch (progressError) {
                console.error('❌ 학습 진행률 조회 실패:', progressError);
                // 진행률 조회 실패해도 강의는 볼 수 있도록 함
                setCompletedDays(new Set());
              }
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

  // 강의 데이터
  const courseData = {
    weeks: [
      {
        title: 'Part 1 (1강-5강)',
        subtitle: '수익화하는 인공지능 에이전트 첫걸음',
        days: [
          { 
            day: 1, 
            title: '나의 목표에 맞는 에이전트 찾기 - ChatGPT vs ChatGPT Agent', 
            subtitle: '이론: ChatGPT vs Agent, AI의 전체 구조 이해 | 실습: ChatGPT 회원가입 → 에이전트 API 등록',
            hasQuiz: true 
          },
          { 
            day: 2, 
            title: 'Work Flow Design 기초 - 나의 일을 AI가 이해할 수 있게 쪼개기', 
            subtitle: '이론: 디컴포지션(분해)과 시퀀싱(순서화) | 실습: 4개 에이전트 연결한 유튜브 콘텐츠 자동 생성 시스템 구축',
            hasQuiz: true 
          },
          { 
            day: 3, 
            title: 'Google Opal로 영상 자동 생성 에이전트 만들기', 
            subtitle: '이론: ChatGPT vs Google Opal 비교, 멀티모달 AI 이해 | 실습: 트렌드 검색 + 영상 생성 자동화 (Gemini 2.5 Flash + Veo)',
            hasQuiz: true 
          },
          { 
            day: 4, 
            title: '협찬/광고 수익을 만드는 \'콘텐츠 자동 생성 에이전트\' 제작법', 
            subtitle: '실습: 두 플랫폼으로 같은 에이전트 만들어보며 차이점 체감하기',
            hasQuiz: false 
          },
          { 
            day: 5, 
            title: '수익화 인공지능 에이전트 구축하기', 
            subtitle: '실습: 한 번의 클릭으로 완성하는 자동화 워크플로우',
            hasQuiz: true 
          }
        ]
      },
      {
        title: 'Part 2 (6강-10강)',
        subtitle: '실전 수익화 컨텐츠 자동 생성 에이전트',
        days: [
          { 
            day: 6, 
            title: '판매 수익화 에이전트 - 제품 판매 영상 자동 생성', 
            subtitle: '실습: Google OPAL로 리뷰/소개/광고 영상 자동 제작',
            hasQuiz: false,
            launchDate: '2025-11-18 19:00'
          },
          { 
            day: 7, 
            title: '바이럴 마케팅 에이전트 - 조회수 폭발 컨텐츠 생성', 
            subtitle: '실습: Google OPAL로 트렌드 분석 + 바이럴 영상 자동 제작',
            hasQuiz: false,
            launchDate: '2025-11-20 23:00'
          },
          { 
            day: 8, 
            title: '음성 컨텐츠 에이전트 - ASMR & 지식 나눔 영상 생성', 
            subtitle: '실습: Google OPAL로 오디오북, 명상, 교육 컨텐츠 자동 제작',
            hasQuiz: false,
            launchDate: '2025-11-21 19:00'
          },
          { 
            day: 9, 
            title: '대량 생산 에이전트 - 한 번에 15개 영상 자동 생성', 
            subtitle: '실습: 배치 처리 시스템으로 대량 컨텐츠 자동화',
            hasQuiz: false,
            launchDate: '2025-11-22 19:00'
          },
          { 
            day: 10, 
            title: '완전 자동화 수익 시스템 - 분석부터 업로드까지', 
            subtitle: '최종 프로젝트: 트렌드 분석 → 생성 → 편집 → 유튜브 업로드 완전 자동화',
            hasQuiz: true,
            launchDate: '2025-11-23 19:00'
          }
        ]
      }
    ]
  };

  const totalDays = 10;
  const progressPercentage = (completedDays.size / totalDays) * 100;

  const handleDayClick = (day: number) => {
    if (day === 1) {
      navigate('/chatgpt-agent-beginner/day1');
    } else if (day === 2) {
      navigate('/chatgpt-agent-beginner/day2');
    } else if (day === 3) {
      navigate('/chatgpt-agent-beginner/day3');
    } else if (day === 4) {
      navigate('/chatgpt-agent-beginner/day4');
    } else if (day === 5) {
      navigate('/chatgpt-agent-beginner/day5');
    } else if (day === 6) {
      navigate('/chatgpt-agent-beginner/day6');
    } else if (day === 7) {
      navigate('/chatgpt-agent-beginner/day7');
    } else if (day === 8) {
      navigate('/chatgpt-agent-beginner/day8');
    } else if (day === 9) {
      navigate('/chatgpt-agent-beginner/day9');
    } else if (day === 10) {
      navigate('/chatgpt-agent-beginner/day10');
    } else {
      alert(`${day}강은 준비 중입니다. 곧 공개될 예정입니다! 🚀`);
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
        breadcrumbText="Google Opal 유튜브 수익화 에이전트 기초"
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
                10일 완성, 수익화하는 인공지능 에이전트 만들기
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
                const isAvailable = lesson.day <= 6; // 1강, 2강, 3강, 4강, 5강, 6강 사용 가능

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
                          {lesson.day}강
                        </div>
                        <div style={{
                          fontSize: '0.85rem',
                          color: '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {lesson.hasQuiz && <span>📝 퀴즈 포함</span>}
                        </div>
                      </div>
                    </div>

                    {/* 제목 */}
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '8px',
                      lineHeight: '1.4'
                    }}>
                      {lesson.title}
                    </h3>

                    {/* 부제목 */}
                    {lesson.subtitle && (
                      <p style={{
                        fontSize: '0.85rem',
                        color: '#64748b',
                        marginBottom: '15px',
                        lineHeight: '1.5'
                      }}>
                        {lesson.subtitle}
                      </p>
                    )}

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
                        paddingTop: '15px',
                        borderTop: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94a3b8',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          marginBottom: '10px'
                        }}>
                          🔒 곧 공개 예정
                        </div>
                        {(lesson as any).launchDate && (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            <div style={{
                              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                              color: '#92400e',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              border: '1px solid #fbbf24'
                            }}>
                              📅 {(lesson as any).launchDate}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#94a3b8',
                              fontWeight: '500'
                            }}>
                              공개 예정
                            </div>
                          </div>
                        )}
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
              이제 여러분은 수익화 AI 에이전트 메이커입니다! 🚀<br />
              배운 내용을 활용하여 실전 수익화 에이전트를 만들어보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatGPTAgentBeginnerPlayerPage;

