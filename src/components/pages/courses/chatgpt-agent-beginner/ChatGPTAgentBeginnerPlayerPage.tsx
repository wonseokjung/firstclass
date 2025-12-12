import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Lock, CheckCircle } from 'lucide-react';
import NavigationBar from '../../../common/NavigationBar';
import AzureTableService from '../../../../services/azureTableService';

// 브랜드 컬러 정의
const COLORS = {
  navy: '#1e3a5f',
  navyLight: '#2a4a70',
  navyDark: '#0f2847',
  gold: '#d4a439',
  goldLight: '#f5d77a',
  goldDark: '#b8860b',
  white: '#ffffff',
  grayLight: '#f8fafc',
  grayMedium: '#64748b',
};

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
              
              // Azure에서 진도 불러오기
              try {
                const progress = await AzureTableService.getCourseDayProgress(
                  parsedUserInfo.email,
                  'chatgpt-agent-beginner'
                );
                
                if (progress && progress.completedDays) {
                  console.log('✅ 진도 불러오기 성공:', progress.completedDays);
                  setCompletedDays(new Set(progress.completedDays));
                }
              } catch (progressError) {
                console.error('❌ 진도 불러오기 실패:', progressError);
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
        title: 'Part 1 (Day 1-6)',
        subtitle: 'OpenAI 에이전트부터 Google OPAL 에이전트까지 - 수익화 컨텐츠 에이전트 기초 다지기',
        days: [
          { 
            day: 1, 
            title: '내 첫 AI 친구: ChatGPT와 Agent의 차이', 
            subtitle: 'ChatGPT와 에이전트 빌더의 차이점 이해 | 워크플로우 자동화 개념 배우기',
            hasQuiz: true 
          },
          { 
            day: 2, 
            title: 'Work Flow Design 기초 - 나의 일을 AI가 이해할 수 있게 쪼개기', 
            subtitle: '디컴포지션(분해)과 시퀀싱(순서화) 원리 | 4개 에이전트로 유튜브 콘텐츠 자동 생성',
            hasQuiz: true 
          },
          { 
            day: 3, 
            title: 'Google Opal로 영상 자동 생성 에이전트 만들기', 
            subtitle: 'ChatGPT vs Google Opal 비교 | 트렌드 검색 + 영상 생성 자동화 (Veo + Gemini 2.5)',
            hasQuiz: true 
          },
          { 
            day: 4, 
            title: '협찬/광고 수익을 만드는 \'콘텐츠 자동 생성 에이전트\' 제작법', 
            subtitle: '4개 에이전트로 인스타그램 포스팅 자동화 | OpenAI vs Google Opal 실전 비교',
            hasQuiz: false 
          },
          { 
            day: 5, 
            title: '수익화 인공지능 에이전트 구축하기', 
            subtitle: 'Google OPAL 완전 자동화 워크플로우 | 트렌드→영상→썸네일→메타데이터 최적화',
            hasQuiz: true 
          },
          { 
            day: 6, 
            title: '시니어 타겟 유튜브 콘텐츠 자동 제작', 
            subtitle: '25개 멀티 에이전트 시스템 | 아이디어→이미지→음성→텍스트 완전 자동화',
            hasQuiz: false
          }
        ]
      },
      {
        title: 'Part 2 (Day 7-10)',
        subtitle: '실전! 유튜브 채널 개설부터 퍼널 전략까지 - 완전 자동화 수익 시스템',
        days: [
          { 
            day: 7, 
            title: '유튜브 채널 자동 생성 & 최적화 에이전트', 
            subtitle: '11개 AI 에이전트로 채널 세팅 완전 자동화 | 퍼널 전략으로 5-10개 채널 동시 운영',
            hasQuiz: false
          },
          { 
            day: 8, 
            title: 'Opal의 숨겨진 비밀: 대화로 워크플로우 자동 생성 + 구글 스프레드시트 연동', 
            subtitle: '대화형 워크플로우 자동 생성 | 구글 스프레드시트 콘텐츠 계획 자동 저장',
            hasQuiz: true
          },
          { 
            day: 9, 
            title: '일관성 있는 이미지 시리즈 만들기 - Google Opal로 브랜드 스토리텔링', 
            subtitle: '같은 캐릭터/제품/스타일로 연결되는 이미지 시리즈 생성 | 제품 광고 콘텐츠 제작',
            hasQuiz: false
          },
          { 
            day: 10, 
            title: '영상 콘텐츠 자동화 - JSON 프롬프트와 Google Opal 에이전트로 쇼츠/롱폼 제작', 
            subtitle: '22개 에이전트로 일관성 있는 영상 시리즈 생성 | 코카콜라/환타 광고 실습',
            hasQuiz: false
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
        gap: '20px',
        background: `linear-gradient(135deg, ${COLORS.navy}10, ${COLORS.grayLight})`
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: `4px solid ${COLORS.navy}20`,
          borderTop: `4px solid ${COLORS.gold}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: COLORS.navy, fontSize: '16px', fontWeight: '600' }}>
          결제 정보 확인 중...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.white }}>
      <NavigationBar
        onBack={onBack}
        breadcrumbText="AI Agent Maker"
      />

      {/* 헤더 & 진행률 - 브랜드 컬러 */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`,
        color: 'white',
        padding: '40px 20px',
        boxShadow: `0 4px 20px ${COLORS.navy}40`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 장식 */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${COLORS.gold}20 0%, transparent 70%)`,
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '20%',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, ${COLORS.goldLight}10 0%, transparent 60%)`,
          borderRadius: '50%'
        }}></div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '25px'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              boxShadow: `0 8px 20px ${COLORS.gold}40`
            }}>
              🤖
            </div>
            <div>
              <h1 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: '800',
                marginBottom: '5px',
                color: COLORS.white
              }}>
                AI Agent Maker
              </h1>
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: COLORS.goldLight,
                margin: 0,
                fontWeight: '500'
              }}>
                10일 완성, 수익화하는 인공지능 에이전트 만들기
              </p>
            </div>
          </div>

          {/* 라이브 입장 버튼 */}
          <div 
            onClick={() => navigate('/live')}
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '15px',
              padding: '20px 25px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '15px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(239, 68, 68, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <span style={{ fontSize: '1.8rem' }}>🔴</span>
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '12px',
                  height: '12px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  border: '2px solid white',
                  animation: 'pulse 2s infinite'
                }}></div>
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white' }}>
                  주간 라이브 강의 입장
                </div>
                <div style={{ fontSize: '0.95rem', opacity: '0.9', color: 'white' }}>
                  매주 화요일 8PM | AI 최신 트렌드 & 실습
                </div>
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '700',
              color: 'white'
            }}>
              입장하기 →
            </div>
          </div>

          {/* 업데이트 공지 */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.gold}20, ${COLORS.goldLight}15)`,
            border: `2px solid ${COLORS.gold}50`,
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '1.8rem' }}>🎉</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: COLORS.goldLight }}>
                Day 1-10 전체 강의 업로드 완료!
              </span>
            </div>
            <p style={{
              fontSize: '1rem',
              margin: 0,
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6'
            }}>
              지금 바로 학습을 시작하세요! 🚀
            </p>
          </div>

          {/* 진행률 - 골드 테마 */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.navyLight}80, ${COLORS.navy}90)`,
            border: `2px solid ${COLORS.gold}40`,
            borderRadius: '15px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: COLORS.white }}>전체 학습 진행률</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: COLORS.goldLight }}>
                {completedDays.size}/{totalDays} 완료 ({Math.round(progressPercentage)}%)
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '14px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight})`,
                borderRadius: '10px',
                transition: 'width 0.5s ease',
                boxShadow: `0 2px 10px ${COLORS.gold}50`
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 강의 목록 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        background: COLORS.grayLight
      }}>
        {courseData.weeks.map((week, weekIndex) => {
          // Part 1: 네이비, Part 2: 골드
          const isPart1 = weekIndex === 0;
          const headerBg = isPart1 
            ? `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)` 
            : `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldDark} 100%)`;
          const borderColor = isPart1 ? COLORS.gold : COLORS.navy;
          const titleColor = COLORS.white;
          const subtitleColor = isPart1 ? COLORS.goldLight : 'rgba(255,255,255,0.9)';
          const icon = isPart1 ? '📚' : '🚀';

          return (
          <div key={weekIndex} style={{
            marginBottom: '50px'
          }}>
            {/* Week 헤더 */}
            <div style={{
                background: headerBg,
                borderRadius: '20px',
                padding: '30px 35px',
                marginBottom: '30px',
                border: `3px solid ${borderColor}`,
                boxShadow: isPart1 
                  ? `0 8px 30px ${COLORS.navy}30` 
                  : `0 8px 30px ${COLORS.gold}40`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* 배경 장식 */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  background: isPart1 
                    ? `radial-gradient(circle, ${COLORS.gold}20 0%, transparent 70%)` 
                    : `radial-gradient(circle, ${COLORS.navy}30 0%, transparent 70%)`,
                  borderRadius: '50%'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                    fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                fontWeight: '800',
                    color: titleColor,
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
              }}>
                    <span style={{ fontSize: '2rem' }}>{icon}</span>
                    {week.title}
              </h2>
              <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                    color: subtitleColor,
                margin: 0,
                    fontWeight: '600',
                    lineHeight: '1.6'
              }}>
                {week.subtitle}
              </p>
                </div>
            </div>

            {/* Day 카드들 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '20px'
            }}>
              {week.days.map((lesson) => {
                const isCompleted = completedDays.has(lesson.day);
                const isAvailable = lesson.day <= 10; // Day 1-10 전체 사용 가능

                return (
                  <div
                    key={lesson.day}
                    onClick={() => isAvailable && handleDayClick(lesson.day)}
                    style={{
                      background: COLORS.white,
                      borderRadius: '15px',
                      padding: '25px',
                      border: isCompleted ? `2px solid ${COLORS.gold}` : `2px solid ${COLORS.navy}20`,
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      opacity: isAvailable ? 1 : 0.6,
                      boxShadow: `0 4px 15px ${COLORS.navy}10`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                      if (isAvailable) {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = `0 8px 25px ${COLORS.navy}20`;
                        e.currentTarget.style.borderColor = COLORS.gold;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (isAvailable) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 4px 15px ${COLORS.navy}10`;
                        e.currentTarget.style.borderColor = isCompleted ? COLORS.gold : `${COLORS.navy}20`;
                      }
                    }}
                  >
                    {/* 완료 배지 */}
                    {isCompleted && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                        color: COLORS.white,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: `0 4px 12px ${COLORS.gold}40`
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
                        background: isCompleted 
                          ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})` 
                          : (isAvailable ? `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})` : COLORS.grayMedium),
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        flexShrink: 0,
                        boxShadow: isCompleted ? `0 4px 12px ${COLORS.gold}30` : `0 4px 12px ${COLORS.navy}20`
                      }}>
                        {isAvailable ? (isCompleted ? <CheckCircle size={28} /> : lesson.day) : <Lock size={24} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.9rem',
                          color: COLORS.navy,
                          fontWeight: '700',
                          marginBottom: '4px'
                        }}>
                          Day {lesson.day}
                        </div>
                        <div style={{
                          fontSize: '0.85rem',
                          color: COLORS.grayMedium,
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
                      color: COLORS.navyDark,
                      marginBottom: '8px',
                      lineHeight: '1.4'
                    }}>
                      {lesson.title}
                    </h3>

                    {/* 부제목 */}
                    {lesson.subtitle && (
                      <p style={{
                        fontSize: '0.85rem',
                        color: COLORS.grayMedium,
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
                        borderTop: `1px solid ${COLORS.navy}15`
                      }}>
                        <span style={{
                          color: COLORS.navy,
                          fontSize: '0.95rem',
                          fontWeight: '700'
                        }}>
                          {isCompleted ? '다시 학습하기' : '학습 시작하기'}
                        </span>
                        <PlayCircle size={24} color={COLORS.gold} />
                      </div>
                    ) : (
                      <div style={{
                        paddingTop: '15px',
                        borderTop: `1px solid ${COLORS.navy}15`
                      }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: COLORS.grayMedium,
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
                              background: `linear-gradient(135deg, ${COLORS.goldLight}30, ${COLORS.gold}20)`,
                              color: COLORS.goldDark,
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              border: `1px solid ${COLORS.gold}`
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
          );
        })}

        {/* 학습 완료 시 축하 메시지 */}
        {completedDays.size === totalDays && (
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            border: `3px solid ${COLORS.gold}`,
            marginTop: '40px',
            boxShadow: `0 10px 40px ${COLORS.navy}40`
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
              fontWeight: '800',
              color: COLORS.goldLight,
              marginBottom: '15px'
            }}>
              축하합니다! 모든 강의를 완료하셨습니다!
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: COLORS.white,
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

