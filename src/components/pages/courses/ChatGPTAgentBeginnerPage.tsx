
import React, { useState, useEffect } from 'react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

interface ChatGPTAgentBeginnerPageProps {
  onBack: () => void;
}

const ChatGPTAgentBeginnerPage: React.FC<ChatGPTAgentBeginnerPageProps> = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);

  const course = {
    id: 1002,
    title: "🤖 AI Agent, 10일 완성",
    subtitle: "수익화하는 인공지능 에이전트 만들기",
    lessons: [
      // Part 1 (Day 1-6) - OpenAI 에이전트부터 Google OPAL 에이전트까지
      {
        id: 1,
        day: 1,
        title: "Day 1: 내 첫 AI 친구: ChatGPT와 Agent의 차이",
        hasQuiz: true,
        sections: {
          theory: "• ChatGPT와 에이전트 빌더의 차이점 이해하기\n• 워크플로우 자동화 개념 배우기",
          practice: "• ChatGPT 에이전트 빌더 시작하기\n• 실습으로 에이전트 빌더 사용해보기"
        }
      },
      {
        id: 2,
        day: 2,
        title: "Day 2: Work Flow Design 기초 - 나의 일을 AI가 이해할 수 있게 쪼개기",
        hasQuiz: true,
        sections: {
          theory: "• 워크플로 디자인의 핵심 원리: 디컴포지션(분해)과 시퀀싱(순서화)\n• 복잡한 업무를 작은 태스크 유닛으로 쪼개는 방법",
          practice: "• 4개의 전문 에이전트를 연결한 유튜브 콘텐츠 자동 생성 시스템 만들기\n• 웹 검색 → 대본 작성 → 제목 선정 → 설명글/태그 생성 워크플로우 구축"
        }
      },
      {
        id: 3,
        day: 3,
        title: "Day 3: Google Opal로 영상 자동 생성 에이전트 만들기",
        hasQuiz: true,
        sections: {
          theory: "• ChatGPT 에이전트 빌더 vs Google Opal의 차이점 이해\n• Google Opal의 핵심 AI 모델 (Veo, Gemini 2.5 Flash, Imagen) 활용법",
          practice: "• 트렌드 검색 + 영상 생성 자동화 에이전트 직접 만들기\n• Google Docs/Drive 연동으로 자동 저장 시스템 구축"
        }
      },
      {
        id: 4,
        day: 4,
        title: "Day 4: 협찬/광고 수익을 만드는 '콘텐츠 자동 생성 에이전트' 제작법",
        hasQuiz: false,
        sections: {
          theory: "• 디컴포지션 원리로 복잡한 업무를 AI 작업 단위로 분해\n• OpenAI vs Google Opal의 차이점을 직접 체감",
          practice: "• 4개 에이전트를 연결한 인스타그램 포스팅 자동화 워크플로우 구축\n• 웹사이트 분석 → 캡션 작성 → 이미지 생성 자동화 시스템 완성"
        }
      },
      {
        id: 5,
        day: 5,
        title: "Day 5: 수익화 인공지능 에이전트 구축하기",
        hasQuiz: true,
        sections: {
          theory: "• 수익화의 정의와 AI 에이전트의 목적 이해\n• 트렌드 분석부터 편집까지 완전 자동화 개념",
          practice: "• Google OPAL로 완전 자동화된 콘텐츠 생성 워크플로우 구축\n• 트렌드 분석 → 영상/썸네일 생성 → 메타데이터 최적화까지 실전 프로젝트 완성"
        }
      },
      {
        id: 6,
        day: 6,
        title: "Day 6: 시니어 타겟 유튜브 콘텐츠 자동 제작",
        hasQuiz: false,
        sections: {
          theory: "• 시니어 시장의 특성과 콘텐츠 선호도 이해\n• 25개 멀티 에이전트 시스템 구조 파악",
          practice: "• AI 에이전트 훈련 및 문제 해결 방법 실습\n• 아이디어→이미지→음성→텍스트 완전 자동화 워크플로우 구축"
        }
      },
      // Part 2 (Day 7-10) - 실전! 채널 운영부터 퍼널 전략까지
      {
        id: 7,
        day: 7,
        title: "Day 7: 유튜브 채널 자동 생성 & 최적화 에이전트",
        hasQuiz: false,
        sections: {
          theory: "• 퍼널 전략: 다수 채널 운영으로 성공 확률 극대화\n• 11개 AI 에이전트로 채널 세팅 완전 자동화",
          practice: "• 트렌드 분석부터 브랜딩까지 원스톱 워크플로우 구축\n• 5-10개 채널을 동시에 운영하는 퍼널 전략 실습"
        }
      },
      {
        id: 8,
        day: 8,
        title: "Day 8: Opal의 숨겨진 비밀: 대화로 워크플로우 자동 생성 + 구글 스프레드시트 연동",
        hasQuiz: true,
        sections: {
          theory: "• 대화형으로 워크플로우를 자동 생성하는 방법\n• 노드와 프롬프트를 한글로 자동 작성하기",
          practice: "• 구글 스프레드시트에 콘텐츠 계획 자동 저장\n• 유튜브 콘텐츠 계획표 자동 생성 실습\n• 다양한 업무에 적용 가능한 자동화 전략"
        }
      },
      {
        id: 9,
        day: 9,
        title: "Day 9: 일관성 있는 이미지 시리즈 만들기 - Google Opal로 브랜드 스토리텔링",
        hasQuiz: false,
        sections: {
          theory: "• 일관성 있는 이미지 시리즈 생성의 중요성 이해\n• 브랜드 아이덴티티와 스토리텔링 전략",
          practice: "• Google Opal로 같은 캐릭터/제품이 등장하는 이미지 시리즈 생성\n• 워크플로우 커스터마이징: 프롬프트 변경, 노드 추가/삭제\n• 제품 광고 시리즈를 유튜브 콘텐츠로 제작 및 업로드"
        }
      },
      {
        id: 10,
        day: 10,
        title: "Day 10: 영상 콘텐츠 자동화 - JSON 프롬프트와 Google Opal 에이전트로 쇼츠/롱폼 제작",
        hasQuiz: false,
        sections: {
          theory: "• JSON 프롬프트를 활용한 고품질 영상 생성 이해\n• 일관성 있는 영상 스토리텔링을 위한 에이전트 설계",
          practice: "• 22개 Google Opal 에이전트로 자동화 워크플로우 구축\n• 제품 광고 영상(코카콜라, 환타 등) 시리즈 제작\n• 배경음악, 카메라 무빙 등 세부 요소 제어 방법 실습\n• 최종 프로젝트: 완전 자동화 영상 제작 시스템 완성"
        }
      }
    ]
  };

  const coursePrice = 95000; // 정상가

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');

        console.log('🔍 ChatGPT AI AGENT 비기너편 페이지 - 로그인 상태 체크:', {
          sessionStorage: storedUserInfo ? 'exists' : 'null'
        });

        if (storedUserInfo) {
          try {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            console.log('✅ 세션에서 사용자 정보 파싱 성공:', {
              email: parsedUserInfo.email,
              name: parsedUserInfo.name
            });

            setIsLoggedIn(true);

            // 테스트 계정 확인 (개발/테스트용)
            const testAccounts = ['test10@gmail.com'];
            const isTestAccount = testAccounts.includes(parsedUserInfo.email);

            // Azure 테이블에서 결제 상태 확인
            try {
              const paymentStatus = await AzureTableService.checkCoursePayment(
                parsedUserInfo.email,
                'chatgpt-agent-beginner'
              );

              console.log('💳 Azure 테이블 결제 상태 확인 결과:', paymentStatus);

              if ((paymentStatus && paymentStatus.isPaid) || isTestAccount) {
                setIsPaidUser(true);
                console.log('✅ 결제 확인됨 - 소개 페이지에 "내 강의 보기" 버튼 표시');
                // 자동 리다이렉트 제거 - 사용자가 직접 "내 강의 보기" 버튼 클릭
              } else {
                console.log('❌ 결제되지 않음 - 강의 구매 페이지 표시');
              }
            } catch (azureError) {
              console.error('❌ Azure 테이블 조회 실패:', azureError);
            }
          } catch (parseError) {
            console.error('❌ 사용자 정보 파싱 오류:', parseError);
            sessionStorage.removeItem('aicitybuilders_user_session');
            setIsLoggedIn(false);
          }
        } else {
          console.log('❌ 세션 정보가 없습니다');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleEarlyBirdPayment = async () => {
    console.log('🔍 수강 신청 버튼 클릭 - 결제 페이지로 이동');
    console.log('🔍 현재 로그인 상태:', isLoggedIn);
    console.log('🔍 세션 정보:', sessionStorage.getItem('aicitybuilders_user_session'));

    // 세션 정보 재확인 (로그인 상태가 제대로 반영 안 된 경우 대비)
    const sessionUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
    const isActuallyLoggedIn = !!sessionUserInfo;

    if (!isActuallyLoggedIn) {
      const confirmLogin = window.confirm('로그인이 필요한 서비스입니다. 먼저 로그인해주세요.\n\n로그인 페이지로 이동하시겠습니까?');
      if (confirmLogin) {
        window.location.href = '/login';
      }
      return;
    }

    // 결제 페이지로 이동
    console.log('✅ 결제 페이지로 이동:', '/chatgpt-agent-beginner/payment');
    window.location.href = '/chatgpt-agent-beginner/payment';
  };


  return (
    <div className="masterclass-container">
      <NavigationBar
        onBack={onBack}
        breadcrumbText="ChatGPT AI AGENT 비기너편"
      />

      {/* 모든 사용자에게 강의 소개 페이지 표시 */}
      {/* 결제 전: 강의 구매 페이지 / 결제 후: "내 강의 보기" 버튼 추가 */}
      {true && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(20px, 4vw, 40px) clamp(15px, 4vw, 20px)'
        }}>

          {/* 결제한 사용자를 위한 "내 강의 보기" 버튼 */}
          {isPaidUser && (
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: 'clamp(12px, 3vw, 20px)',
              padding: 'clamp(20px, 5vw, 30px)',
              marginBottom: 'clamp(25px, 5vw, 40px)',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
              border: 'clamp(2px, 0.5vw, 3px) solid #34d399',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '15px'
              }}>
                🎉
              </div>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: '800',
                color: 'white',
                marginBottom: '15px'
              }}>
                이미 수강 중인 강의입니다!
              </h2>
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                color: '#d1fae5',
                marginBottom: '25px',
                lineHeight: '1.6'
              }}>
                아래 버튼을 클릭하여 강의를 계속 학습하세요 📚
              </p>
              <button
                onClick={() => window.location.href = '/chatgpt-agent-beginner-player'}
                style={{
                  background: 'white',
                  color: '#059669',
                  border: 'none',
                  padding: 'clamp(18px, 4vw, 22px) clamp(40px, 8vw, 60px)',
                  fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                  fontWeight: '900',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 30px rgba(255, 255, 255, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(10px, 2vw, 15px)',
                  width: '100%',
                  maxWidth: '400px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 255, 255, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 255, 255, 0.3)';
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span style={{ fontSize: 'clamp(1.3rem, 3vw, 1.5rem)' }}>📖</span>
                내 강의 보기
              </button>
            </div>
          )}

          {/* ✨ 이 강의에 포함된 것 - 간결한 버전 */}
          <div style={{
            background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
            padding: 'clamp(30px, 5vw, 50px)',
            borderRadius: '25px',
            marginBottom: 'clamp(30px, 6vw, 50px)',
            border: '2px solid rgba(255, 214, 10, 0.4)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
            maxWidth: '900px',
            margin: '0 auto clamp(40px, 6vw, 60px) auto'
          }}>
            <h3 style={{
              color: '#ffd60a',
              fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
              fontWeight: '800',
              textAlign: 'center',
              marginBottom: 'clamp(25px, 4vw, 35px)'
            }}>
              이 강의에 포함된 것
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '25px'
            }}>
              {/* 📚 기본 강의 */}
              <div style={{
                background: 'rgba(255, 214, 10, 0.1)',
                borderRadius: '20px',
                padding: 'clamp(25px, 4vw, 35px)',
                border: '2px solid rgba(255, 214, 10, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '2.5rem' }}>📚</span>
                  <h4 style={{ color: '#ffd60a', fontWeight: '800', fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', margin: 0 }}>
                    기본 강의 10개
                  </h4>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                  Google OPAL로 AI 에이전트 만드는 방법을<br />
                  <strong style={{ color: '#ffd60a' }}>10개 영상 강의</strong>로 체계적으로 배웁니다.<br />
                  <span style={{ color: '#94a3b8' }}>구매 후 3개월간 무제한 시청</span>
                </p>
              </div>

              {/* 📅 주간 라이브 */}
              <div style={{
                background: 'rgba(251, 191, 36, 0.1)',
                borderRadius: '20px',
                padding: 'clamp(25px, 4vw, 35px)',
                border: '2px solid rgba(251, 191, 36, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '2.5rem' }}>📅</span>
                  <h4 style={{ color: '#fbbf24', fontWeight: '800', fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', margin: 0 }}>
                    매주 프로젝트 라이브
                  </h4>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: '#ffd60a' }}>매주 수요일 밤 8시</strong> 실시간으로<br />
                  함께 프로젝트를 진행합니다.<br />
                  <span style={{ color: '#94a3b8' }}>3개월간 총 13회 참여 가능</span>
                </p>
              </div>
            </div>
          </div>

          {/* 강의 소개 영상 */}
          <div style={{
            marginBottom: 'clamp(30px, 6vw, 60px)',
            maxWidth: '900px',
            margin: '0 auto clamp(30px, 6vw, 60px) auto'
          }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 1.8rem)',
              fontWeight: '700',
              color: '#1b263b',
              marginBottom: '20px'
            }}>
              🎬 강의 소개
            </h2>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '12px',
              background: '#000'
            }}>
              <iframe
                src="https://www.youtube.com/embed/BZynp51fBRU?si=-69U57RR4UNMwwNy"
                title="YouTube video player"
                frameBorder="0"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '12px',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          {/* 🎬 이런 걸 배워요 - 실제 결과물 섹션 */}
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto clamp(60px, 10vw, 80px) auto',
            padding: 'clamp(40px, 6vw, 60px) clamp(20px, 4vw, 40px)',
            background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
            borderRadius: 'clamp(15px, 3vw, 25px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
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
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15), transparent)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 7vw, 60px)', position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                border: '2px solid #ffd60a',
                padding: '8px 20px',
                borderRadius: '999px',
                marginBottom: '20px',
                fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                fontWeight: '700',
                color: '#ffd60a',
                boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
              }}>
                ✨ 실제 결과물
              </div>

              <h2 style={{
                fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                fontWeight: '900',
                color: 'white',
                marginBottom: '20px',
                lineHeight: '1.2'
              }}>
                이런 걸 배워요
              </h2>
              <p style={{
                fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: '1.7',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                강의에서 실제로 만든 프로페셔널 콘텐츠입니다.<br />
                <strong style={{ color: '#ffd60a' }}>Google OPAL 무료 AI</strong>로 이런 영상을 자동 생성하는 방법을 배웁니다! 🚀
              </p>
            </div>

            {/* 영상 그리드 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))',
              gap: 'clamp(25px, 4vw, 40px)',
              position: 'relative',
              zIndex: 1
            }}>

              {/* 영상 1: 코로나 맥주 광고 */}
              <div style={{
                background: 'white',
                borderRadius: 'clamp(12px, 2.5vw, 18px)',
                overflow: 'hidden',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
                }}>
                <div style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  background: '#000'
                }}>
                  <iframe
                    src="https://player.vimeo.com/video/1141339945?badge=0&autopause=0&player_id=0&app_id=58479"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    title="코로나 맥주 비치 레이브 광고"
                  />
                </div>
                <div style={{ padding: 'clamp(18px, 3vw, 25px)' }}>
                  <h4 style={{
                    fontSize: 'clamp(1.1rem, 2.3vw, 1.3rem)',
                    fontWeight: '800',
                    color: '#0d1b2a',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🍺 코로나 맥주 광고
                  </h4>
                  <p style={{
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    color: '#64748b',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    병뚜껑이 열리는 순간, 해변 파티가 펼쳐지는 마법 같은 광고 영상
                  </p>
                </div>
              </div>

              {/* 영상 2: 코카콜라 북극 광고 */}
              <div style={{
                background: 'white',
                borderRadius: 'clamp(12px, 2.5vw, 18px)',
                overflow: 'hidden',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
                }}>
                <div style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  background: '#000'
                }}>
                  <iframe
                    src="https://player.vimeo.com/video/1141339894?badge=0&autopause=0&player_id=0&app_id=58479"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    title="코카콜라 북극 아이스 레이브 광고"
                  />
                </div>
                <div style={{ padding: 'clamp(18px, 3vw, 25px)' }}>
                  <h4 style={{
                    fontSize: 'clamp(1.1rem, 2.3vw, 1.3rem)',
                    fontWeight: '800',
                    color: '#0d1b2a',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🥤 코카콜라 광고
                  </h4>
                  <p style={{
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    color: '#64748b',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    북극 빙하에서 펼쳐지는 신비로운 오로라 파티 컨셉
                  </p>
                </div>
              </div>

              {/* 워크플로우 3: 수익화 자동화 (Day 5) */}
              <div style={{
                background: 'white',
                borderRadius: 'clamp(12px, 2.5vw, 18px)',
                overflow: 'hidden',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '2px solid #e2e8f0'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.borderColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}>
                <div style={{
                  padding: 'clamp(18px, 3vw, 25px)',
                  background: '#f8fafc'
                }}>
                  <img
                    src="/images/day5/workflow-diagram.png"
                    alt="Day 5 - 수익화 AI 에이전트 워크플로우"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      marginBottom: '15px'
                    }}
                  />
                </div>
                <div style={{ padding: 'clamp(18px, 3vw, 25px)' }}>
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: '#8b5cf6',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: 'clamp(0.75rem, 1.7vw, 0.85rem)',
                    fontWeight: '700',
                    marginBottom: '10px'
                  }}>
                    Day 5 - 워크플로우
                  </div>
                  <h4 style={{
                    fontSize: 'clamp(1.1rem, 2.3vw, 1.3rem)',
                    fontWeight: '800',
                    color: '#0d1b2a',
                    marginBottom: '10px'
                  }}>
                    💰 수익화 자동화 시스템
                  </h4>
                  <p style={{
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    color: '#64748b',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    트렌드 분석 → 영상/썸네일 생성 → 메타데이터 최적화까지 완전 자동화
                  </p>
                </div>
              </div>

            </div>

            {/* 하단 Google OPAL 무료 강조 */}
            <div style={{
              textAlign: 'center',
              marginTop: 'clamp(60px, 9vw, 80px)',
              padding: 'clamp(40px, 6vw, 55px) clamp(30px, 5vw, 45px)',
              background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
              borderRadius: '25px',
              border: '4px solid #ffd60a',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 20px 60px rgba(30, 41, 59, 0.4)',
              overflow: 'hidden'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: '-80px',
                right: '-80px',
                width: '250px',
                height: '250px',
                background: 'rgba(251, 191, 36, 0.15)',
                borderRadius: '50%',
                filter: 'blur(80px)'
              }}></div>

              <div style={{
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                  borderRadius: '50%',
                  padding: '18px',
                  marginBottom: '25px',
                  boxShadow: '0 10px 30px rgba(251, 191, 36, 0.5)'
                }}>
                  <div style={{
                    fontSize: 'clamp(2.5rem, 6vw, 3.5rem)'
                  }}>
                    🚀
                  </div>
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                  fontWeight: '900',
                  color: '#ffd60a',
                  marginBottom: '25px',
                  lineHeight: '1.3',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}>
                  Google OPAL = 100% 무료 AI 자동화
                </h3>
                <p style={{
                  fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)',
                  color: '#e0f2fe',
                  lineHeight: '2',
                  margin: '0 auto',
                  maxWidth: '800px',
                  fontWeight: '500'
                }}>
                  💬 <strong style={{ color: '#ffd60a' }}>Gemini 2.5 Flash</strong> <span style={{ color: '#cbd5e1' }}>(텍스트 생성)</span><br />
                  🎬 <strong style={{ color: '#ffd60a' }}>Veo</strong> <span style={{ color: '#cbd5e1' }}>(영상 생성)</span><br />
                  🎨 <strong style={{ color: '#ffd60a' }}>Imagen</strong> <span style={{ color: '#cbd5e1' }}>(이미지 생성)</span><br />
                  🎙️ <strong style={{ color: '#ffd60a' }}>AudioLM</strong> <span style={{ color: '#cbd5e1' }}>(음성 생성)</span><br />
                  <br />
                  <span style={{
                    fontSize: 'clamp(1.2rem, 2.8vw, 1.5rem)',
                    fontWeight: '900',
                    color: 'white',
                    background: 'rgba(251, 191, 36, 0.2)',
                    padding: '8px 20px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    border: '2px solid rgba(251, 191, 36, 0.4)'
                  }}>
                    모두 무료로 사용하며 콘텐츠 자동화 에이전트를 구축합니다!
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 상단 메인 CTA */}
          <div style={{
            textAlign: 'center',
            marginBottom: 'clamp(30px, 6vw, 50px)'
          }}>

            {/* 강의 아이콘과 제목 */}
            <div style={{ marginBottom: 'clamp(25px, 5vw, 40px)' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'clamp(60px, 12vw, 80px)',
                height: 'clamp(60px, 12vw, 80px)',
                background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                borderRadius: '50%',
                marginBottom: 'clamp(15px, 4vw, 25px)',
                boxShadow: '0 4px 15px rgba(30, 64, 175, 0.3)'
              }}>
                <span style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>🤖</span>
              </div>
              <h1 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                marginBottom: '20px',
                fontWeight: '800',
                color: '#1b263b'
              }}>
                🧠 AI Agent Maker
              </h1>
              <h2 style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                marginBottom: '15px',
                color: '#1b263b',
                fontWeight: '700'
              }}>
                10일 완성, 수익화하는 인공지능 에이전트 만들기
              </h2>
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                marginBottom: '20px',
                color: '#64748b',
                lineHeight: '1.6'
              }}>
                코딩 몰라도, 클릭 몇 번으로 "AI가 스스로 판단하고 일하는 에이전트"를 만든다
              </p>

              {/* 코스 설명 */}
              <div style={{
                background: '#f8fafc',
                borderRadius: 'clamp(8px, 2vw, 12px)',
                padding: 'clamp(15px, 4vw, 20px) clamp(18px, 4.5vw, 25px)',
                marginBottom: 'clamp(18px, 4vw, 25px)',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{
                  fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                  color: '#475569',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  AI 에이전트 완전 비기너를 위한 코스. 에이전트가 무엇인지부터 다양한 에이전트 도구들을 사용해보며 나만의 인공지능 에이전트 비서를 만들기 위한 기초를 닦는다. 핵심만 모아놓은 실습위주.
                </p>
              </div>

              {/* 커리큘럼 변경 안내 */}
              <p style={{
                fontSize: '0.9rem',
                color: '#94a3b8',
                fontStyle: 'italic',
                marginBottom: '30px'
              }}>
                💡 커리큘럼은 변경될 수 있습니다.
              </p>
            </div>

            {/* 🎓 인공지능의 EBS - 왜 라이브가 필요한가 */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
              padding: 'clamp(30px, 5vw, 45px)',
              borderRadius: '25px',
              marginBottom: '30px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'rgba(251, 191, 36, 0.15)',
                borderRadius: '50%'
              }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* 슬로건 */}
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                  padding: '10px 25px',
                  borderRadius: '30px',
                  marginBottom: '25px'
                }}>
                  <span style={{ color: '#1e3a8a', fontWeight: '800', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                    📺 인공지능의 EBS
                  </span>
                </div>

                <h4 style={{
                  color: 'white',
                  fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                  fontWeight: '800',
                  marginBottom: '20px',
                  lineHeight: '1.4'
                }}>
                  🤔 인공지능이 계속 업그레이드 되는데<br />어떻게 해야 하나요?
                </h4>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                  lineHeight: '1.8',
                  marginBottom: '25px'
                }}>
                  Google OPAL, Claude, ChatGPT... <strong style={{ color: '#ffd60a' }}>매주 새로운 기능</strong>이 쏟아집니다.<br />
                  녹화 강의만으로는 <strong style={{ color: '#ffd60a' }}>최신 AI를 따라갈 수 없습니다.</strong><br /><br />
                  그래서 준비했습니다! 👇
                </p>

                {/* 구성 설명 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: 'clamp(20px, 4vw, 30px)',
                  marginBottom: '25px',
                  border: '2px solid rgba(251, 191, 36, 0.3)'
                }}>
                  <h5 style={{ color: '#ffd60a', fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', fontWeight: '700', marginBottom: '20px', textAlign: 'center' }}>
                    ✨ Step 2 구성
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '15px'
                  }}>
                    <div style={{ textAlign: 'center', padding: '20px 15px', background: 'rgba(255,255,255,0.08)', borderRadius: '15px' }}>
                      <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>📚</div>
                      <div style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', marginBottom: '5px' }}>기본 코어 강의</div>
                      <div style={{ color: '#ffd60a', fontWeight: '800', fontSize: 'clamp(1.3rem, 3vw, 1.5rem)' }}>10개</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '5px' }}>3개월간 무제한 시청</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px 15px', background: 'rgba(251,191,36,0.15)', borderRadius: '15px', border: '2px solid rgba(251,191,36,0.4)' }}>
                      <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>📅</div>
                      <div style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', marginBottom: '5px' }}>주간 라이브</div>
                      <div style={{ color: '#ffd60a', fontWeight: '800', fontSize: 'clamp(1.3rem, 3vw, 1.5rem)' }}>13회</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '5px' }}>3개월간 참여 가능</div>
                    </div>
                  </div>
                </div>

                {/* 가성비 계산 */}
                <div style={{
                  background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                  borderRadius: '20px',
                  padding: 'clamp(20px, 4vw, 25px) clamp(20px, 4vw, 30px)',
                  marginBottom: '20px'
                }}>
                  <h5 style={{ color: '#1e3a8a', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: '800', marginBottom: '15px', textAlign: 'center' }}>
                    💰 이 가격 실화? 가성비 계산
                  </h5>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '15px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#1e3a8a', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>기본 강의 10개</div>
                      <div style={{ color: '#1e3a8a', fontWeight: '800', fontSize: '1.2rem' }}>+</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#1e3a8a', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>라이브 13회</div>
                      <div style={{ color: '#1e3a8a', fontWeight: '800', fontSize: '1.2rem' }}>=</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#1e3a8a', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)' }}>총 23개 콘텐츠</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', background: 'rgba(30, 58, 138, 0.15)', padding: '15px', borderRadius: '12px' }}>
                    <span style={{ color: '#1e3a8a', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>95,000원 ÷ 23개 = </span>
                    <span style={{ color: '#1e40af', fontWeight: '900', fontSize: 'clamp(1.5rem, 4vw, 1.8rem)' }}>4,130원</span>
                    <span style={{ color: '#1e3a8a', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>/개</span>
                    <div style={{ color: '#1e3a8a', fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', marginTop: '8px', fontWeight: '600' }}>
                      ☕ 커피 한 잔 가격으로 전문 강의 1개!
                    </div>
                  </div>
                </div>

                {/* 라이브 혜택 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px'
                }}>
                  {['🎯 실시간 Q&A', '🔥 최신 AI 업데이트', '💻 라이브 코딩', '🎯 월간 미션'].map((item) => (
                    <div key={item} style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      padding: '12px 12px',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                      fontWeight: '600',
                      textAlign: 'center',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 강의 수강 방식 */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <h4 style={{ color: '#1e40af', fontSize: 'clamp(1.05rem, 2.3vw, 1.3rem)', fontWeight: '700', marginBottom: '20px' }}>
                강의 수강 방식
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1b263b', marginBottom: '5px' }}>HD 동영상</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>기본 콘텐츠 10개</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1b263b', marginBottom: '5px' }}>주간 라이브</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>매주 1회 진행</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1b263b', marginBottom: '5px' }}>월간 미션</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>매월 1개 제공</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1b263b', marginBottom: '5px' }}>수강 기간</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>3개월간 접근</div>
                </div>
              </div>
            </div>

            {/* 가격 & CTA 박스 - 강력한 시각적 강조 */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #1e40af)',
              borderRadius: '25px',
              padding: 'clamp(40px, 6vw, 60px) clamp(30px, 5vw, 50px)',
              marginBottom: '30px',
              border: '4px solid #93c5fd',
              boxShadow: '0 20px 60px rgba(30, 64, 175, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '300px',
                height: '300px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(80px)'
              }}></div>

              {/* 수강권 뱃지 */}
              <div style={{
                textAlign: 'center',
                marginBottom: 'clamp(18px, 4vw, 25px)',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  color: '#92400e',
                  padding: 'clamp(8px, 2vw, 10px) clamp(18px, 4vw, 25px)',
                  borderRadius: 'clamp(20px, 4vw, 30px)',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontWeight: '800',
                  border: 'clamp(1.5px, 0.4vw, 2px) solid #ffd60a',
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
                }}>
                  📚 3개월 수강권
                </div>
              </div>

              {/* 가격 정보 */}
              <div style={{
                textAlign: 'center',
                marginBottom: 'clamp(22px, 5vw, 30px)',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  fontSize: 'clamp(3.5rem, 8vw, 5rem)',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '15px',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  lineHeight: '1'
                }}>
                  ₩{coursePrice.toLocaleString()}
                </div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(254, 243, 199, 0.2)',
                  color: '#fef08a',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontWeight: '700',
                  border: '1px solid rgba(254, 240, 138, 0.3)'
                }}>
                  📅 기본 강의 10개 + 주간 라이브 13회
                </div>
              </div>

              {/* 혜택 리스트 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 'clamp(10px, 3vw, 15px)',
                padding: 'clamp(20px, 4vw, 30px)',
                marginBottom: 'clamp(25px, 5vw, 35px)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
                  gap: 'clamp(12px, 3vw, 15px)',
                  fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <span>10일 완성 커리큘럼</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <span>구매 후 3개월간 이용 가능</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <span>실전 프로젝트 파일 제공</span>
                  </div>
                </div>
              </div>

              {/* 메인 수강 신청 버튼 */}
              <div style={{
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
              }}>
                <button
                  onClick={handleEarlyBirdPayment}
                  style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    color: '#92400e',
                    border: '3px solid #ffd60a',
                    padding: 'clamp(18px, 4vw, 25px) clamp(40px, 8vw, 60px)',
                    fontSize: 'clamp(1.1rem, 3.5vw, 1.6rem)',
                    fontWeight: '900',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 30px rgba(251, 191, 36, 0.5)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(10px, 2vw, 15px)',
                    width: '100%',
                    maxWidth: '500px',
                    marginBottom: '20px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(251, 191, 36, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(251, 191, 36, 0.5)';
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.transform = 'scale(0.98)';
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>💳</span>
                  결제하기
                </button>
                <p style={{
                  fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                  color: '#e0f2fe',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  💳 안전한 결제 · 구매 후 3개월간 이용 가능
                </p>
              </div>
            </div>

            {/* 추가 안내 */}
            <div style={{
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <p style={{
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                color: '#64748b',
                lineHeight: '1.6',
                margin: '0'
              }}>
                💡 결제 후 즉시 수강 가능
              </p>
            </div>
          </div>

          {/* 우리의 미션 섹션 */}
          <div style={{
            background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
            borderRadius: '20px',
            padding: 'clamp(40px, 6vw, 60px) clamp(30px, 5vw, 50px)',
            marginBottom: 'clamp(30px, 6vw, 60px)',
            boxShadow: '0 20px 60px rgba(30, 41, 59, 0.4)',
            border: '3px solid #ffd60a',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 배경 장식 */}
            <div style={{
              position: 'absolute',
              top: '-150px',
              right: '-150px',
              width: '400px',
              height: '400px',
              background: 'rgba(251, 191, 36, 0.1)',
              borderRadius: '50%',
              filter: 'blur(100px)'
            }}></div>

            <div style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              marginBottom: '50px'
            }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                borderRadius: '50%',
                padding: '20px',
                marginBottom: '25px',
                boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)'
              }}>
                <div style={{ fontSize: '3rem' }}>💡</div>
              </div>
              <h2 style={{
                fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                fontWeight: '900',
                color: 'white',
                marginBottom: '30px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}>
                우리의 미션
              </h2>
              <div style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                color: '#e0f2fe',
                lineHeight: '1.9',
                maxWidth: '900px',
                margin: '0 auto'
              }}>
                <p style={{ marginBottom: '25px', fontWeight: '600', color: '#ffd60a', fontSize: 'clamp(1.2rem, 2.8vw, 1.6rem)' }}>
                  과도하게 비싼 AI 교육 가격을 낮추고 싶습니다.
                </p>
                <p style={{ marginBottom: '25px', color: '#cbd5e1' }}>
                  AI 교육은 누구나 접근할 수 있어야 합니다.<br />
                  하지만 현실은 <strong style={{ color: '#ffd60a' }}>수십만 원에서 수백만 원</strong>의 높은 가격 장벽이 존재합니다.
                </p>
                <p style={{ marginBottom: '25px', fontWeight: '700', color: 'white', fontSize: 'clamp(1.2rem, 2.8vw, 1.5rem)' }}>
                  그래서 우리는 직접 플랫폼을 만들었습니다.
                </p>
                <p style={{ marginBottom: '0', color: '#cbd5e1' }}>
                  Jay 멘토가 직접 강의를 제작하고, 중간 유통 비용 없이 여러분께 전달합니다.
                  이것이 바로 <strong style={{ color: '#ffd60a', fontSize: '1.1em' }}>AI City Builders</strong>의 시작입니다.
                </p>
              </div>
            </div>

            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: 'clamp(15px, 3vw, 25px)',
              marginTop: '50px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: 'clamp(20px, 4vw, 35px) clamp(15px, 3vw, 25px)',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                border: '2px solid #ffd60a',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 8px rgba(251, 191, 36, 0.3))'
                }}>🎯</div>
                <h3 style={{ fontSize: 'clamp(1.05rem, 2.3vw, 1.3rem)', fontWeight: '800', color: '#1e40af', marginBottom: '12px' }}>
                  합리적인 가격
                </h3>
                <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.7', margin: '0', fontWeight: '500' }}>
                  중간 유통 비용 없이<br />직접 제작·판매
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: 'clamp(20px, 4vw, 35px) clamp(15px, 3vw, 25px)',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                border: '2px solid #ffd60a',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 8px rgba(251, 191, 36, 0.3))'
                }}>👨‍🏫</div>
                <h3 style={{ fontSize: 'clamp(1.05rem, 2.3vw, 1.3rem)', fontWeight: '800', color: '#1e40af', marginBottom: '12px' }}>
                  실전 경험
                </h3>
                <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.7', margin: '0', fontWeight: '500' }}>
                  현업 AI 전문가의<br />생생한 노하우
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: 'clamp(20px, 4vw, 35px) clamp(15px, 3vw, 25px)',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                border: '2px solid #ffd60a',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 8px rgba(251, 191, 36, 0.3))'
                }}>🌱</div>
                <h3 style={{ fontSize: 'clamp(1.05rem, 2.3vw, 1.3rem)', fontWeight: '800', color: '#1e40af', marginBottom: '12px' }}>
                  지속 성장
                </h3>
                <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.7', margin: '0', fontWeight: '500' }}>
                  구매 후 3개월간<br />무제한 학습
                </p>
              </div>
            </div>
          </div>

          {/* 멘토 소개 - Jay 멘토 이력 */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: '#1b263b',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              👨‍💼 멘토 소개: 정원석 (Jay)
            </h2>

            {/* 멘토 프로필 요약 */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              padding: 'clamp(30px, 5vw, 40px)',
              borderRadius: '15px',
              marginBottom: 'clamp(25px, 5vw, 50px)',
              border: '2px solid #1e40af',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
                marginBottom: '25px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  background: '#1e40af',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontWeight: '600'
                }}>
                  🏢 커넥젼에이아이 대표
                </div>
                <div style={{
                  background: '#1e40af',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontWeight: '600'
                }}>
                  🎓 서울사이버대학교 대우교수
                </div>
                <div style={{
                  background: '#1e40af',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontWeight: '600'
                }}>
                  📱 인스타그램 30만 팔로워
                </div>
              </div>
              <p style={{
                color: '#0c4a6e',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                lineHeight: '1.8',
                margin: '0',
                fontWeight: '600'
              }}>
                AI 솔루션 개발과 컨설팅을 통한 디지털 트랜스포메이션을 선도하며,<br />
                차세대 AI 인재 양성과 AI 지식 대중화에 힘쓰고 있습니다.
              </p>
            </div>

            {/* 학력 섹션 */}
            <div style={{
              marginBottom: '50px'
            }}>
              <h3 style={{
                color: '#1b263b',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: '800',
                marginBottom: '40px',
                textAlign: 'center'
              }}>
                🎓 학력
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                {/* 일리노이공대 석사 */}
                <div style={{
                  background: '#ffffff',
                  padding: '30px',
                  borderRadius: '15px',
                  border: '2px solid #1e40af',
                  textAlign: 'center',
                  boxShadow: '0 5px 15px rgba(30, 64, 175, 0.1)'
                }}>
                  <div style={{
                    background: '#1e40af',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'inline-block'
                  }}>
                    석사
                  </div>
                  <h4 style={{
                    color: '#1b263b',
                    fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
                    fontWeight: '800',
                    marginBottom: '10px'
                  }}>
                    일리노이공대
                  </h4>
                  <p style={{
                    color: '#64748b',
                    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Illinois Institute of Technology
                  </p>
                  <p style={{
                    color: '#1e40af',
                    fontSize: 'clamp(1.1rem, 2vw, 1.2rem)',
                    fontWeight: '700',
                    marginBottom: '25px'
                  }}>
                    Data Science (MS)
                  </p>

                  <div style={{
                    background: 'rgba(30, 64, 175, 0.05)',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '1px solid rgba(30, 64, 175, 0.1)'
                  }}>
                    <h5 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      marginBottom: '10px',
                      color: '#ffffff'
                    }}>
                      📜 Official Transcript
                    </h5>
                    <div style={{
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0'
                    }}
                      onClick={() => window.open('/images/illinoistch_graduation.png', '_blank')}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(30, 64, 175, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <img
                        src="/images/illinoistch_graduation.png"
                        alt="일리노이공대 석사 공식 성적증명서"
                        style={{
                          width: '100%',
                          height: 'auto',
                          objectFit: 'contain',
                          transition: 'all 0.3s ease'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#1e40af',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        클릭하여 확대
                      </div>
                    </div>
                  </div>
                </div>

                {/* 바루크 컬리지 학사 */}
                <div style={{
                  background: '#ffffff',
                  padding: '30px',
                  borderRadius: '15px',
                  border: '2px solid #1e40af',
                  textAlign: 'center',
                  boxShadow: '0 5px 15px rgba(30, 64, 175, 0.1)'
                }}>
                  <div style={{
                    background: '#1e40af',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'inline-block'
                  }}>
                    학사
                  </div>
                  <h4 style={{
                    color: '#1b263b',
                    fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
                    fontWeight: '800',
                    marginBottom: '10px'
                  }}>
                    뉴욕시립대
                  </h4>
                  <p style={{
                    color: '#64748b',
                    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    City University of New York - Baruch College
                  </p>
                  <p style={{
                    color: '#1e40af',
                    fontSize: 'clamp(1.1rem, 2vw, 1.2rem)',
                    fontWeight: '700',
                    marginBottom: '25px'
                  }}>
                    Data Science (BS)
                  </p>

                  <div style={{
                    background: 'rgba(30, 64, 175, 0.05)',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '1px solid rgba(30, 64, 175, 0.1)'
                  }}>
                    <h5 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      marginBottom: '10px',
                      color: '#ffffff'
                    }}>
                      📜 Official Transcript
                    </h5>
                    <div style={{
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0'
                    }}
                      onClick={() => window.open('/images/baruch_graduation.png', '_blank')}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(30, 64, 175, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <img
                        src="/images/baruch_graduation.png"
                        alt="뉴욕시립대 바루크 칼리지 학위증명서"
                        style={{
                          width: '100%',
                          height: 'auto',
                          objectFit: 'contain',
                          transition: 'all 0.3s ease'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#1e40af',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        클릭하여 확대
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 주요 경력 섹션 - 타임라인 형식 */}
            <div style={{
              background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
              padding: 'clamp(40px, 6vw, 60px) clamp(30px, 5vw, 50px)',
              borderRadius: '20px',
              border: '3px solid #ffd60a',
              marginBottom: 'clamp(30px, 6vw, 60px)',
              boxShadow: '0 20px 60px rgba(30, 41, 59, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: '-100px',
                left: '-100px',
                width: '300px',
                height: '300px',
                background: 'rgba(251, 191, 36, 0.1)',
                borderRadius: '50%',
                filter: 'blur(100px)'
              }}></div>

              <div style={{
                position: 'relative',
                zIndex: 1
              }}>
                <h3 style={{
                  color: 'white',
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                  fontWeight: '900',
                  marginBottom: 'clamp(25px, 5vw, 50px)',
                  textAlign: 'center',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}>
                  💼 주요 경력
                </h3>

                <div style={{
                  maxWidth: '1000px',
                  margin: '0 auto',
                  paddingLeft: 'clamp(20px, 4vw, 40px)',
                  borderLeft: '4px solid #ffd60a'
                }}>
                  <div style={{ marginBottom: '35px', paddingLeft: '25px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-14px',
                      top: '5px',
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                      borderRadius: '50%',
                      border: '4px solid #0d1b2a',
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
                    }}></div>
                    <p style={{ marginBottom: '12px', fontWeight: '600', fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)' }}>
                      <strong style={{
                        background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: 'clamp(1.3rem, 2.8vw, 1.6rem)',
                        fontWeight: '900'
                      }}>현재</strong>
                    </p>
                    <p style={{ color: '#e0f2fe', fontSize: 'clamp(1.05rem, 2.2vw, 1.2rem)', lineHeight: '1.8', margin: '0', fontWeight: '500' }}>
                      커넥젼에이아이 대표 · 서울사이버대학교 대우교수
                    </p>
                  </div>

                  <div style={{ marginBottom: '35px', paddingLeft: '25px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-14px',
                      top: '5px',
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                      borderRadius: '50%',
                      border: '4px solid #0d1b2a',
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
                    }}></div>
                    <p style={{ marginBottom: '12px', fontWeight: '600', fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)' }}>
                      <strong style={{
                        background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: 'clamp(1.3rem, 2.8vw, 1.6rem)',
                        fontWeight: '900'
                      }}>2023</strong>
                    </p>
                    <p style={{ color: '#e0f2fe', fontSize: 'clamp(1.05rem, 2.2vw, 1.2rem)', lineHeight: '1.8', margin: '0', fontWeight: '500' }}>
                      뤼튼 해커톤 1위 (AI 해킹 방어 툴 개발) · 블록체인 해커톤 2위
                    </p>
                  </div>

                  <div style={{ marginBottom: '35px', paddingLeft: '25px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-14px',
                      top: '5px',
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                      borderRadius: '50%',
                      border: '4px solid #0d1b2a',
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
                    }}></div>
                    <p style={{ marginBottom: '12px', fontWeight: '600', fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)' }}>
                      <strong style={{
                        background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: 'clamp(1.3rem, 2.8vw, 1.6rem)',
                        fontWeight: '900'
                      }}>2022</strong>
                    </p>
                    <p style={{ color: '#e0f2fe', fontSize: 'clamp(1.05rem, 2.2vw, 1.2rem)', lineHeight: '1.8', margin: '0', fontWeight: '500' }}>
                      메타 아시아 지역 글로벌 리더 선정 (4인 중 한 명)
                    </p>
                  </div>

                  <div style={{ marginBottom: '35px', paddingLeft: '25px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-14px',
                      top: '5px',
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                      borderRadius: '50%',
                      border: '4px solid #0d1b2a',
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
                    }}></div>
                    <p style={{ marginBottom: '12px', fontWeight: '600', fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)' }}>
                      <strong style={{
                        background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: 'clamp(1.3rem, 2.8vw, 1.6rem)',
                        fontWeight: '900'
                      }}>2020</strong>
                    </p>
                    <p style={{ color: '#e0f2fe', fontSize: 'clamp(1.05rem, 2.2vw, 1.2rem)', lineHeight: '1.8', margin: '0', fontWeight: '500' }}>
                      AI 헬스케어 스타트업 옵트버스 설립 (기업가치 50억원)
                    </p>
                  </div>

                  <div style={{ marginBottom: '35px', paddingLeft: '25px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-14px',
                      top: '5px',
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                      borderRadius: '50%',
                      border: '4px solid #0d1b2a',
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
                    }}></div>
                    <p style={{ marginBottom: '12px', fontWeight: '600', fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)' }}>
                      <strong style={{
                        background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: 'clamp(1.3rem, 2.8vw, 1.6rem)',
                        fontWeight: '900'
                      }}>2019</strong>
                    </p>
                    <p style={{ color: '#e0f2fe', fontSize: 'clamp(1.05rem, 2.2vw, 1.2rem)', lineHeight: '1.8', margin: '0', fontWeight: '500' }}>
                      모두의연구소 인공지능 선임연구원 · AI COLLEGE 기획/운영 · 200명 이상 AI 연구원 양성
                    </p>
                  </div>

                  <div style={{ marginBottom: '35px', paddingLeft: '25px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-14px',
                      top: '5px',
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                      borderRadius: '50%',
                      border: '4px solid #0d1b2a',
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
                    }}></div>
                    <p style={{ marginBottom: '12px', fontWeight: '600', fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)' }}>
                      <strong style={{
                        background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: 'clamp(1.3rem, 2.8vw, 1.6rem)',
                        fontWeight: '900'
                      }}>2018</strong>
                    </p>
                    <p style={{ color: '#e0f2fe', fontSize: 'clamp(1.05rem, 2.2vw, 1.2rem)', lineHeight: '1.8', margin: '0', fontWeight: '500' }}>
                      PostAI 강화학습 연구 · Best Poster Award 수상
                    </p>
                  </div>

                  <div style={{ marginBottom: '0', paddingLeft: '25px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-14px',
                      top: '5px',
                      width: '24px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                      borderRadius: '50%',
                      border: '4px solid #0d1b2a',
                      boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)'
                    }}></div>
                    <p style={{ marginBottom: '12px', fontWeight: '600', fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)' }}>
                      <strong style={{
                        background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: 'clamp(1.3rem, 2.8vw, 1.6rem)',
                        fontWeight: '900'
                      }}>2017</strong>
                    </p>
                    <p style={{ color: '#e0f2fe', fontSize: 'clamp(1.05rem, 2.2vw, 1.2rem)', lineHeight: '1.8', margin: '0', fontWeight: '500' }}>
                      ConnexionAI 설립 · 200억 규모 AI 스마트팩토리 구축 프로젝트 컨설팅
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 강의 소개 - 깔끔한 디자인 */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{
              background: '#ffffff',
              padding: '50px 40px',
              borderRadius: '20px',
              marginBottom: '40px',
              textAlign: 'center',
              border: '2px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                background: '#1e40af',
                borderRadius: '50%',
                marginBottom: '25px',
                boxShadow: '0 8px 20px rgba(30, 64, 175, 0.3)'
              }}>
                <span style={{ fontSize: '2.5rem' }}>🤖</span>
              </div>

              <h2 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
                fontWeight: '800',
                color: '#1b263b',
                marginBottom: '20px'
              }}>
                10일 완성, 수익화하는 AI 에이전트
              </h2>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#1e40af',
                fontWeight: '600',
                marginBottom: '30px'
              }}>
                유튜브 컨텐츠 자동 생성 중심 설계
              </p>

              <div style={{
                background: '#f8fafc',
                padding: '30px',
                borderRadius: '15px',
                maxWidth: '800px',
                margin: '0 auto',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{
                  color: '#1b263b',
                  fontSize: '1.1rem',
                  lineHeight: '1.7',
                  margin: '0 0 30px 0',
                  fontWeight: '500'
                }}>
                  Google OPAL을 활용해 나만의 <strong style={{ color: '#1e40af' }}>수익화 에이전트</strong>를 만들고<br />
                  실제 유튜브 컨텐츠 자동 생성 시스템을 구축하세요.<br />
                  <strong style={{ color: '#1e40af' }}>10일 완성</strong> 실전 수익화 에이전트 개발 과정입니다.
                </p>
              </div>
            </div>
          </div>

          {/* 커리큘럼 - 깔끔한 텍스트 중심 디자인 */}
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '60px'
            }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                border: '3px solid #ffd60a',
                padding: '15px 30px',
                borderRadius: '50px',
                marginBottom: '25px',
                boxShadow: '0 10px 30px rgba(30, 64, 175, 0.3)'
              }}>
                <h3 style={{
                  color: '#ffd60a',
                  fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
                  fontWeight: '900',
                  margin: '0',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}>
                  📚 10일 완성 커리큘럼
                </h3>
              </div>
              <p style={{
                color: '#ffffff',
                fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
                margin: '0',
                fontWeight: '800'
              }}>
                하루 1시간 × 10일 = <span style={{
                  background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '900'
                }}>수익화 에이전트 마스터</span> 🎓
              </p>
            </div>

            {/* CORE: Day 1-3 */}
            <div style={{ marginBottom: '60px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
                color: 'white',
                padding: 'clamp(25px, 5vw, 40px)',
                borderRadius: '20px',
                marginBottom: '30px',
                textAlign: 'center',
                boxShadow: '0 15px 40px rgba(30, 41, 59, 0.4)',
                border: '3px solid #ffd60a',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  background: 'rgba(251, 191, 36, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(60px)'
                }}></div>
                <h4 style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
                  fontWeight: '900',
                  margin: '0 0 15px 0',
                  letterSpacing: '0.5px',
                  color: '#ffd60a',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}>
                  🎯 Part 1 (Day 1-6)
                </h4>
                <p style={{
                  margin: '0',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  opacity: '0.95',
                  fontWeight: '600',
                  lineHeight: '1.6'
                }}>
                  AI 에이전트 기초부터 Google OPAL 마스터까지
                </p>
              </div>

              <div style={{
                background: '#ffffff',
                padding: 'clamp(25px, 4vw, 40px)',
                borderRadius: '15px',
                border: '2px solid #e2e8f0'
              }}>
                {course.lessons.slice(0, 6).map((lesson: any) => (
                  <div
                    key={lesson.id}
                    style={{
                      marginBottom: '30px',
                      paddingBottom: '30px',
                      borderBottom: lesson.id === 5 ? 'none' : '1px solid #e2e8f0'
                    }}
                  >
                    <h5 style={{
                      color: '#1e40af',
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      fontWeight: '800',
                      marginBottom: '15px'
                    }}>
                      Day {lesson.day} · {lesson.title.replace(`Day ${lesson.day}: `, '')}
                    </h5>
                    <div style={{
                      fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                      lineHeight: '1.8',
                      color: '#1b263b'
                    }}>
                      <p style={{ marginBottom: '12px', fontWeight: '500' }}>
                        <strong style={{ color: '#1b263b' }}>이론:</strong> {lesson.sections.theory}
                      </p>
                      <p style={{ marginBottom: '0', fontWeight: '500' }}>
                        <strong style={{ color: '#1b263b' }}>실습:</strong> {lesson.sections.practice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Part 2: Day 7-10 */}
            <div style={{ marginBottom: '60px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
                color: 'white',
                padding: 'clamp(25px, 5vw, 40px)',
                borderRadius: '20px',
                marginBottom: '30px',
                textAlign: 'center',
                boxShadow: '0 15px 40px rgba(30, 41, 59, 0.4)',
                border: '3px solid #ffd60a',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  left: '-50px',
                  width: '200px',
                  height: '200px',
                  background: 'rgba(251, 191, 36, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(60px)'
                }}></div>
                <h4 style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
                  fontWeight: '900',
                  margin: '0 0 15px 0',
                  letterSpacing: '0.5px',
                  color: '#ffd60a',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}>
                  🚀 Part 2 (Day 7-10)
                </h4>
                <p style={{
                  margin: '0',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  opacity: '0.95',
                  fontWeight: '600',
                  lineHeight: '1.6'
                }}>
                  실전! 채널 운영부터 완전 자동화까지
                </p>
              </div>

              <div style={{
                background: '#ffffff',
                padding: 'clamp(25px, 4vw, 40px)',
                borderRadius: '15px',
                border: '2px solid #e2e8f0'
              }}>
                {course.lessons.slice(6, 10).map((lesson: any) => (
                  <div
                    key={lesson.id}
                    style={{
                      marginBottom: '30px',
                      paddingBottom: '30px',
                      borderBottom: lesson.id === 10 ? 'none' : '1px solid #e2e8f0'
                    }}
                  >
                    <h5 style={{
                      color: '#1e40af',
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      fontWeight: '800',
                      marginBottom: '15px'
                    }}>
                      Day {lesson.day} · {lesson.title.replace(`Day ${lesson.day}: `, '')}
                    </h5>
                    <div style={{
                      fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                      lineHeight: '1.8',
                      color: '#1b263b'
                    }}>
                      <p style={{ marginBottom: '12px', fontWeight: '500' }}>
                        <strong style={{ color: '#1b263b' }}>이론:</strong> {lesson.sections.theory}
                      </p>
                      <p style={{ marginBottom: '0', fontWeight: '500' }}>
                        <strong style={{ color: '#ffffff' }}>실습:</strong> {lesson.sections.practice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 CTA - 가격 & 수강 신청 버튼 */}
            <div style={{
              background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
              borderRadius: '25px',
              padding: 'clamp(50px, 7vw, 70px) clamp(35px, 6vw, 55px)',
              marginTop: '80px',
              border: '4px solid #ffd60a',
              boxShadow: '0 25px 70px rgba(30, 41, 59, 0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: '-120px',
                left: '-120px',
                width: '350px',
                height: '350px',
                background: 'rgba(251, 191, 36, 0.15)',
                borderRadius: '50%',
                filter: 'blur(100px)'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '-120px',
                right: '-120px',
                width: '350px',
                height: '350px',
                background: 'rgba(251, 191, 36, 0.15)',
                borderRadius: '50%',
                filter: 'blur(100px)'
              }}></div>

              {/* 마지막 기회 뱃지 */}
              <div style={{
                textAlign: 'center',
                marginBottom: '25px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  color: '#92400e',
                  padding: '10px 25px',
                  borderRadius: '30px',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontWeight: '800',
                  border: '2px solid #ffd60a',
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
                }}>
                  🎓 지금 바로 시작하세요
                </div>
              </div>

              <h3 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: '900',
                color: 'white',
                textAlign: 'center',
                marginBottom: '30px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                zIndex: 1
              }}>
                10일 완성 AI 에이전트 마스터가 되세요
              </h3>

              {/* 가격 정보 */}
              <div style={{
                textAlign: 'center',
                marginBottom: '30px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  fontSize: 'clamp(3.5rem, 8vw, 5rem)',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '15px',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  lineHeight: '1'
                }}>
                  ₩{coursePrice.toLocaleString()}
                </div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(254, 243, 199, 0.2)',
                  color: '#fef08a',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontWeight: '700',
                  border: '1px solid rgba(254, 240, 138, 0.3)'
                }}>
                  📚 3개월 수강권
                </div>
              </div>

              {/* 메인 수강 신청 버튼 */}
              <div style={{
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
              }}>
                <button
                  onClick={handleEarlyBirdPayment}
                  style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    color: '#92400e',
                    border: '3px solid #ffd60a',
                    padding: 'clamp(18px, 4vw, 25px) clamp(40px, 8vw, 60px)',
                    fontSize: 'clamp(1.1rem, 3.5vw, 1.6rem)',
                    fontWeight: '900',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 30px rgba(251, 191, 36, 0.5)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(10px, 2vw, 15px)',
                    width: '100%',
                    maxWidth: '500px',
                    marginBottom: '20px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(251, 191, 36, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(251, 191, 36, 0.5)';
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.transform = 'scale(0.98)';
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>💳</span>
                  결제하기
                </button>
                <p style={{
                  fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                  color: '#e0f2fe',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  💳 안전한 결제 · 구매 후 3개월간 이용 가능
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGPTAgentBeginnerPage;

