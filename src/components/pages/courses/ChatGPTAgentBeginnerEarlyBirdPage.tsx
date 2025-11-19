
import React, { useState, useEffect } from 'react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

interface ChatGPTAgentBeginnerEarlyBirdPageProps {
  onBack: () => void;
}

const ChatGPTAgentBeginnerEarlyBirdPage: React.FC<ChatGPTAgentBeginnerEarlyBirdPageProps> = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);

  const course = {
    id: 1002,
    title: "🎬 Google Opal 유튜브 수익화, 10일 완성",
    subtitle: "구글 AI로 유튜브 자동 수익 창출하기",
    lessons: [
      // Part 1 (1강-5강) - 수익화하는 인공지능 에이전트 첫걸음
      {
        id: 1,
        day: 1,
        title: "1강: 내 첫 AI 친구: ChatGPT와 Agent의 차이",
        hasQuiz: true,
        sections: {
          theory: "• ChatGPT는 대화형 AI, 에이전트는 워크플로우 기반 자동화 AI\n• 워크플로우를 한 번 설정하면 여러 단계 작업 자동 실행\n• 예시: '유튜브 콘텐츠 만들어줘' → 조사, 스크립트, 제목, 설명 자동 생성",
          practice: "• ChatGPT 에이전트 빌더 시작하기\n• 유튜브 콘텐츠 기획 에이전트 만들기\n• 워크플로우 자동화 실습"
        }
      },
      {
        id: 2,
        day: 2,
        title: "2강: Work Flow Design 기초 - 나의 일을 AI가 이해할 수 있게 쪼개기",
        hasQuiz: true,
        sections: {
          theory: "• 워크플로란? 사람의 직관을 AI가 이해 가능한 논리적 구조로 전환\n• 디컴포지션(분해): 목표를 작은 태스크 유닛으로 쪼개기\n• 시퀀싱(순서화): 태스크를 논리적 순서로 배치 (순서 중요!)",
          practice: "• 4개의 전문 에이전트를 연결한 자동화 시스템 구축\n• 웹 검색 → 대본 작성 → 제목 선정 → 설명글/태그 생성\n• 실전 비즈니스 모델: 유튜브 콘텐츠 제작으로 수익화"
        }
      },
      {
        id: 3,
        day: 3,
        title: "3강: Google Opal로 영상 자동 생성 에이전트 만들기",
        hasQuiz: true,
        sections: {
          theory: "• ChatGPT(텍스트) vs Google Opal(영상/이미지/음악) 비교\n• 멀티모달 AI 핵심 모델: Veo(영상), Imagen(이미지), Lyria(음악), AudioLM(음성)\n• 도구 이원화 전략: 기획은 ChatGPT, 콘텐츠 생성은 Google Opal",
          practice: "• 웹 트렌드 검색 + 자동 홍보 영상 생성 에이전트 구축\n• Google Docs/Drive 연동으로 자동 저장\n• 완전 자동화 영상 생성 시스템 완성"
        }
      },
      {
        id: 4,
        day: 4,
        title: "4강: 협찬/광고 수익을 만드는 '콘텐츠 자동 생성 에이전트' 제작법",
        hasQuiz: false,
        sections: {
          theory: "• 디컴포지션: 복잡한 업무를 독립적인 AI 작업 단위로 분해\n• Plan and Execute Model (Gemini 1.5 Flash 기반)\n• 반복 비즈니스 프로세스 자동화로 시간/비용 절감",
          practice: "• 4개 에이전트 연결: 웹사이트 분석 → 캡션 작성 → 이미지 생성\n• 인스타그램 포스팅 완전 자동화 워크플로우 구축\n• Prompt Engineering 핵심 지침 (페르소나 설정)"
        }
      },
      {
        id: 5,
        day: 5,
        title: "5강: 유튜브 컨텐츠 수익화하는 인공지능 에이전트 만들기",
        hasQuiz: true,
        sections: {
          theory: "• 수익화 정의: AI가 업무를 대신해 퍼포먼스↑ 비용/시간/리소스↓\n• 콘텐츠 수익화: 광고 수익, 제품 판매(쇼핑 태그), 강연 등\n• 한 번의 클릭으로 트렌드 분석부터 편집까지 완전 자동화",
          practice: "• 완성형 워크플로우: 입력 → 연구 → 썸네일 → 영상(VEO) → 메타데이터\n• Google OPAL로 유튜브 쇼츠 3개(24초) 자동 생성\n• 클릭률 높이는 제목/설명/태그 자동 작성 시스템 구축"
        }
      },
      // Part 2 (6강-10강) - 실전 수익화 컨텐츠 자동 생성 에이전트
      {
        id: 6,
        day: 6,
        title: "6강: 판매 수익화 에이전트 - 제품 판매 영상 자동 생성",
        hasQuiz: false,
        launchDate: "2025-11-18 19:00",
        sections: {
          theory: "• 제품 판매 영상의 핵심 구조와 전략\n• 리뷰/소개/광고 영상의 효과적인 구성 방법\n• 구매 전환율을 높이는 영상 제작 기법",
          practice: "• Google OPAL로 제품 리뷰 영상 자동 생성\n• 제품 소개 및 홍보 컨텐츠 자동화\n• 판매 전환을 위한 CTA(행동 유도) 최적화"
        }
      },
      {
        id: 7,
        day: 7,
        title: "7강: 바이럴 마케팅 에이전트 - 조회수 폭발 컨텐츠 생성",
        hasQuiz: false,
        launchDate: "2025-11-20 23:00",
        sections: {
          theory: "• 바이럴 컨텐츠의 5가지 핵심 요소\n• 실시간 트렌드 분석 및 활용 전략\n• 알고리즘 친화적인 컨텐츠 설계",
          practice: "• Google OPAL로 트렌드 기반 바이럴 영상 자동 생성\n• 클릭율 높이는 썸네일 자동 제작\n• 바이럴 제목/태그 최적화 시스템 구축"
        }
      },
      {
        id: 8,
        day: 8,
        title: "8강: 음성 컨텐츠 에이전트 - ASMR & 지식 나눔 영상 생성",
        hasQuiz: false,
        launchDate: "2025-11-21 19:00",
        sections: {
          theory: "• 음성 기반 컨텐츠 시장 분석 (ASMR, 오디오북, 명상)\n• AudioLM을 활용한 고품질 음성 생성\n• 음성 컨텐츠의 수익화 전략",
          practice: "• Google OPAL로 ASMR 영상 자동 생성\n• 오디오북 및 지식 나눔 컨텐츠 제작 자동화\n• 명상/교육 음성 컨텐츠 시스템 구축"
        }
      },
      {
        id: 9,
        day: 9,
        title: "9강: 대량 생산 에이전트 - 한 번에 15개 영상 자동 생성",
        hasQuiz: false,
        launchDate: "2025-11-22 19:00",
        sections: {
          theory: "• 배치 처리(Batch Processing) 시스템의 원리\n• 대량 컨텐츠 생성 시 품질 관리 방법\n• 효율적인 리소스 관리 및 최적화 전략",
          practice: "• 배치 처리 에이전트 워크플로우 설계\n• 15개 영상을 동시에 생성하는 시스템 개발\n• 대량 생산 자동화로 컨텐츠 확장성 확보"
        }
      },
      {
        id: 10,
        day: 10,
        title: "10강: 완전 자동화 수익 시스템 - 분석부터 업로드까지",
        hasQuiz: true,
        launchDate: "2025-11-23 19:00",
        sections: {
          theory: "• End-to-End 완전 자동화 시스템 설계\n• 트렌드 분석 → 컨텐츠 생성 → 편집 → 업로드 전체 파이프라인\n• 지속 가능한 수익 창출 전략 및 확장 방법",
          practice: "• 트렌드 자동 분석 에이전트 구축\n• 컨텐츠 생성부터 유튜브 자동 업로드까지 완전 연결\n• 최종 프로젝트: 완전 자동화 유튜브 수익 시스템 완성"
        }
      }
    ]
  };

  const coursePrice = 45000;

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
                console.log('✅ 결제 확인됨 - 강의 시청 페이지로 리다이렉트');
                // 결제된 사용자는 새로운 강의 시청 페이지로 리다이렉트
                setTimeout(() => {
                  window.location.href = '/chatgpt-agent-beginner-player';
                }, 1000);
                return;
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
    
    if (!isLoggedIn) {
      const confirmLogin = window.confirm('로그인이 필요한 서비스입니다. 먼저 로그인해주세요.\n\n로그인 페이지로 이동하시겠습니까?');
      if (confirmLogin) {
        // 로그인 후 얼리버드 결제 페이지로 돌아오도록 리다이렉트 URL 저장
        sessionStorage.setItem('redirect_after_login', '/chatgpt-agent-beginner/payment?earlybird=true');
        window.location.href = '/login';
      }
      return;
    }
    
    // 얼리버드 가격으로 결제 페이지로 이동
    window.location.href = '/chatgpt-agent-beginner/payment?earlybird=true';
  };


  return (
    <div className="masterclass-container">
      <NavigationBar
        onBack={onBack}
        breadcrumbText="ChatGPT AI AGENT 비기너편 (얼리버드)"
      />


      {isPaidUser ? (
        // 결제 후: 새로운 강의 시청 페이지로 리다이렉트
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
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
            강의 시청 페이지로 이동 중...
          </p>
        </div>
      ) : (
        // 결제 전: 강의 구매 페이지
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>

          {/* 강의 소개 영상 */}
          <div style={{
            marginBottom: 'clamp(40px, 8vw, 60px)',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 clamp(10px, 3vw, 20px)'
          }}>
            <h2 style={{
              fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: 'clamp(15px, 3vw, 20px)',
              textAlign: 'center'
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
                src="https://www.youtube.com/embed/BZynp51fBRU?si=ohzPyRlPmkKGmJzU"
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

          {/* 🎁 라이브 Q&A 섹션 - 특별 혜택 */}
          <div style={{
            background: 'linear-gradient(135deg, #1e40af, #0ea5e9)',
            borderRadius: 'clamp(12px, 3vw, 20px)',
            padding: 'clamp(20px, 5vw, 50px)',
            marginBottom: 'clamp(40px, 8vw, 60px)',
            boxShadow: '0 10px 40px rgba(14, 165, 233, 0.3)',
            border: 'clamp(2px, 0.5vw, 3px) solid #93c5fd',
            position: 'relative',
            overflow: 'hidden',
            margin: '0 clamp(10px, 3vw, 20px) clamp(40px, 8vw, 60px)'
          }}>
            {/* 배경 장식 */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: 'clamp(150px, 30vw, 200px)',
              height: 'clamp(150px, 30vw, 200px)',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              filter: 'blur(60px)'
            }}></div>

            <div style={{
              textAlign: 'center',
              marginBottom: '40px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                color: '#92400e',
                padding: '8px 20px',
                borderRadius: '25px',
                fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                fontWeight: '800',
                marginBottom: '20px',
                border: '2px solid #fbbf24',
                boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
              }}>
                🎁 수강생 특별 혜택
              </div>

              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: '900',
                color: 'white',
                marginBottom: '20px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}>
                📺 매일 저녁 8시, 라이브 Q&A
              </h2>

              <p style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                color: '#e0f2fe',
                fontWeight: '600',
                lineHeight: '1.8',
                maxWidth: '800px',
                margin: '0 auto 30px auto'
              }}>
                강의 수강자에게 <strong style={{ color: '#fef08a', textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>우선 질문권</strong>이 주어집니다!<br/>
                쉬운 질문도, 어려운 질문도 모두 환영합니다 🙌
              </p>
            </div>

            {/* 이미지 */}
            <div style={{
              borderRadius: '15px',
              overflow: 'hidden',
              marginBottom: '30px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
              border: '3px solid rgba(255, 255, 255, 0.2)'
            }}>
              <img 
                src="/images/agent_beginer/liveqanda.png" 
                alt="매일 저녁 8시 라이브 Q&A"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>

            {/* 혜택 상세 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              padding: 'clamp(25px, 4vw, 35px)',
              marginBottom: '30px'
            }}>
              <h3 style={{
                fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
                fontWeight: '800',
                color: '#1e40af',
                marginBottom: '25px',
                textAlign: 'center'
              }}>
                ✨ 라이브 Q&A 혜택
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                gap: 'clamp(15px, 3vw, 20px)'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #93c5fd',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.1)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎯</div>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#1e40af',
                    marginBottom: '10px'
                  }}>
                    우선 질문권
                  </h4>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#1e3a8a',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    수강생의 질문을 가장 먼저 답변해드립니다
                  </p>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #fbbf24',
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.2)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🖥️</div>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#92400e',
                    marginBottom: '10px'
                  }}>
                    화면 공유 설명
                  </h4>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#78350f',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    막히는 부분을 화면으로 보며 자세히 설명
                  </p>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #93c5fd',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.1)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💬</div>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#1e40af',
                    marginBottom: '10px'
                  }}>
                    모든 질문 환영
                  </h4>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#1e3a8a',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    쉬운 질문도 어려운 질문도 모두 가능
                  </p>
                </div>
              </div>
            </div>

            {/* YouTube 링크 버튼 */}
            <div style={{
              textAlign: 'center'
            }}>
              <a
                href="https://www.youtube.com/@CONNECT-AI-LAB"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'white',
                  color: '#dc2626',
                  padding: '18px 40px',
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                  fontWeight: '800',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  border: '3px solid #fca5a5'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>📺</span>
                커넥트AI LAB 라이브 참여하기
              </a>
              <p style={{
                color: '#fef2f2',
                fontSize: '0.95rem',
                marginTop: '15px',
                fontWeight: '600'
              }}>
                매일 저녁 8시, 유튜브 라이브로 만나요! 🎉
              </p>
            </div>
          </div>

          {/* 상단 메인 CTA */}
          <div style={{
            textAlign: 'center',
            marginBottom: 'clamp(30px, 6vw, 50px)',
            padding: '0 clamp(10px, 3vw, 20px)'
          }}>

            {/* 강의 아이콘과 제목 */}
            <div style={{ marginBottom: 'clamp(25px, 5vw, 40px)' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'clamp(60px, 12vw, 80px)',
                height: 'clamp(60px, 12vw, 80px)',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                borderRadius: '50%',
                marginBottom: 'clamp(15px, 4vw, 25px)',
                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
              }}>
                <span style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>🤖</span>
              </div>
              <h1 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                marginBottom: '20px',
                fontWeight: '800',
                color: '#1f2937'
              }}>
                🧠 AI Agent Maker
              </h1>
              <h2 style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                marginBottom: '15px',
                color: '#1f2937',
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
                borderRadius: '12px',
                padding: '20px 25px',
                marginBottom: '25px',
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

            {/* 가격 & CTA 박스 - 강력한 시각적 강조 */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #0ea5e9)',
              borderRadius: 'clamp(15px, 4vw, 25px)',
              padding: 'clamp(25px, 6vw, 60px) clamp(20px, 5vw, 50px)',
              marginBottom: 'clamp(20px, 4vw, 30px)',
              border: 'clamp(2px, 0.6vw, 4px) solid #93c5fd',
              boxShadow: '0 10px 40px rgba(14, 165, 233, 0.4)',
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

              {/* 얼리버드 뱃지 */}
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
                  border: '2px solid #fbbf24',
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
                }}>
                  🐦 얼리버드 특가
                </div>
              </div>

              {/* 가격 정보 */}
              <div style={{
                textAlign: 'center',
                marginBottom: '30px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  color: '#e0f2fe',
                  textDecoration: 'line-through',
                  marginBottom: '10px',
                  fontWeight: '600',
                  opacity: 0.8
                }}>
                  정상가 ₩95,000
                </div>
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
                  🐦 얼리버드 50,000원 할인
                </div>
              </div>

              {/* 혜택 리스트 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 'clamp(10px, 3vw, 15px)',
                padding: 'clamp(15px, 4vw, 30px)',
                marginBottom: 'clamp(20px, 5vw, 35px)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                  gap: 'clamp(10px, 2vw, 15px)',
                  fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <span>10일 완성 커리큘럼</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <span>평생 소장 & 무료 업데이트</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <span>매일 저녁 8시 라이브 Q&A</span>
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
                    border: 'clamp(2px, 0.5vw, 3px) solid #fbbf24',
                    padding: 'clamp(18px, 4vw, 25px) clamp(30px, 8vw, 60px)',
                    fontSize: 'clamp(1.1rem, 3.5vw, 1.6rem)',
                    fontWeight: '900',
                    borderRadius: 'clamp(10px, 3vw, 15px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 30px rgba(251, 191, 36, 0.5)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(10px, 2vw, 15px)',
                    width: '100%',
                    maxWidth: 'clamp(280px, 90%, 400px)',
                    marginBottom: 'clamp(15px, 3vw, 20px)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(251, 191, 36, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(251, 191, 36, 0.5)';
                  }}
                >
                  <span style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)' }}>🚀</span>
                  지금 바로 수강하기
                </button>
                <p style={{
                  fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                  color: '#e0f2fe',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  💳 안전한 결제 · 평생 소장 가능
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
                💡 결제 후 즉시 수강 가능 · 6강-10강은 순차 오픈 예정
              </p>
            </div>
          </div>

          {/* 우리의 미션 섹션 */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
            borderRadius: '20px',
            padding: 'clamp(30px, 5vw, 50px) clamp(20px, 4vw, 40px)',
            marginBottom: '50px',
            boxShadow: '0 10px 30px rgba(14, 165, 233, 0.1)',
            border: '2px solid #bae6fd'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '20px'
              }}>💡</div>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: '800',
                color: '#0369a1',
                marginBottom: '20px'
              }}>
                우리의 미션
              </h2>
              <div style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                color: '#0c4a6e',
                lineHeight: '1.8',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                <p style={{ marginBottom: '20px', fontWeight: '600' }}>
                  과도하게 비싼 AI 교육 가격을 낮추고 싶습니다.
                </p>
                <p style={{ marginBottom: '20px' }}>
                  AI 교육은 누구나 접근할 수 있어야 합니다. 하지만 현실은 수십만 원에서 수백만 원의 높은 가격 장벽이 존재합니다.
                </p>
                <p style={{ marginBottom: '20px', fontWeight: '600', color: '#0ea5e9' }}>
                  그래서 우리는 직접 플랫폼을 만들었습니다.
                </p>
                <p style={{ marginBottom: '0' }}>
                  Jay 멘토가 직접 강의를 제작하고, 중간 유통 비용 없이 여러분께 전달합니다. 
                  이것이 바로 <strong style={{ color: '#0369a1' }}>AI City Builders</strong>의 시작입니다.
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginTop: '40px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.1)',
                border: '1px solid #bae6fd'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🎯</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0369a1', marginBottom: '10px' }}>
                  합리적인 가격
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', margin: '0' }}>
                  중간 유통 비용 없이<br/>직접 제작·판매
                </p>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.1)',
                border: '1px solid #bae6fd'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>👨‍🏫</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0369a1', marginBottom: '10px' }}>
                  실전 경험
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', margin: '0' }}>
                  현업 AI 전문가의<br/>생생한 노하우
                </p>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.1)',
                border: '1px solid #bae6fd'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🌱</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0369a1', marginBottom: '10px' }}>
                  지속 성장
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', margin: '0' }}>
                  평생 소장하며<br/>계속 업데이트
                </p>
              </div>
            </div>
          </div>

          {/* 멘토 소개 - Jay 멘토 이력 */}
          <div style={{ marginBottom: '60px' }}>
              <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: '800',
                color: '#1f2937',
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
              marginBottom: '50px',
                border: '2px solid #0ea5e9',
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
                    background: '#0ea5e9',
                    color: 'white',
                  padding: '12px 24px',
                    borderRadius: '25px',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                    fontWeight: '600'
                  }}>
                    🏢 커넥젼에이아이 대표
                  </div>
                  <div style={{
                    background: '#0ea5e9',
                    color: 'white',
                  padding: '12px 24px',
                    borderRadius: '25px',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                    fontWeight: '600'
                  }}>
                    🎓 서울사이버대학교 대우교수
                  </div>
                  <div style={{
                    background: '#0ea5e9',
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
                  color: '#1f2937',
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
                    border: '2px solid #0ea5e9',
                    textAlign: 'center',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)'
                  }}>
                    <div style={{
                      background: '#0ea5e9',
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
                      color: '#1f2937',
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
                      color: '#0ea5e9',
                    fontSize: 'clamp(1.1rem, 2vw, 1.2rem)',
                      fontWeight: '700',
                    marginBottom: '25px'
                    }}>
                      Data Science (MS)
                    </p>
                    
                    <div style={{
                      background: 'rgba(14, 165, 233, 0.05)',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '1px solid rgba(14, 165, 233, 0.1)'
                    }}>
                      <h5 style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        marginBottom: '10px',
                        color: '#1f2937'
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
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(14, 165, 233, 0.2)';
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
                          background: '#0ea5e9',
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
                    border: '2px solid #0ea5e9',
                    textAlign: 'center',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)'
                  }}>
                    <div style={{
                      background: '#0ea5e9',
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
                      color: '#1f2937',
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
                      color: '#0ea5e9',
                    fontSize: 'clamp(1.1rem, 2vw, 1.2rem)',
                      fontWeight: '700',
                    marginBottom: '25px'
                    }}>
                      Data Science (BS)
                    </p>
                    
                    <div style={{
                      background: 'rgba(14, 165, 233, 0.05)',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '1px solid rgba(14, 165, 233, 0.1)'
                    }}>
                      <h5 style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        marginBottom: '10px',
                        color: '#1f2937'
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
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(14, 165, 233, 0.2)';
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
                          background: '#0ea5e9',
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

            {/* 주요 경력 섹션 - 간결한 텍스트 형식 */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              padding: 'clamp(30px, 5vw, 50px)',
              borderRadius: '15px',
                border: '2px solid #e2e8f0',
              marginBottom: '50px'
              }}>
                <h3 style={{
                  color: '#1f2937',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: '800',
                  marginBottom: '30px',
                textAlign: 'center'
              }}>
                💼 주요 경력
                </h3>
                
                <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
                lineHeight: '2.2',
                color: '#1f2937'
              }}>
                <p style={{ marginBottom: '20px', fontWeight: '500' }}>
                  <strong style={{ color: '#0ea5e9', fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)' }}>현재</strong> · 커넥젼에이아이 대표 · 서울사이버대학교 대우교수
                </p>
                <p style={{ marginBottom: '20px', fontWeight: '500' }}>
                  <strong style={{ color: '#0ea5e9', fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)' }}>2023</strong> · 뤼튼 해커톤 1위 (AI 해킹 방어 툴 개발) · 블록체인 해커톤 2위
                </p>
                <p style={{ marginBottom: '20px', fontWeight: '500' }}>
                  <strong style={{ color: '#0ea5e9', fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)' }}>2022</strong> · 메타 아시아 지역 글로벌 리더 선정 (4인 중 한 명)
                </p>
                <p style={{ marginBottom: '20px', fontWeight: '500' }}>
                  <strong style={{ color: '#0ea5e9', fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)' }}>2020</strong> · AI 헬스케어 스타트업 옵트버스 설립 (기업가치 50억원)
                </p>
                <p style={{ marginBottom: '20px', fontWeight: '500' }}>
                  <strong style={{ color: '#0ea5e9', fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)' }}>2019</strong> · 모두의연구소 인공지능 선임연구원 · AI COLLEGE 기획/운영 · 200명 이상 AI 연구원 양성
                </p>
                <p style={{ marginBottom: '20px', fontWeight: '500' }}>
                  <strong style={{ color: '#0ea5e9', fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)' }}>2018</strong> · PostAI 강화학습 연구 · Best Poster Award 수상
                </p>
                <p style={{ marginBottom: '0', fontWeight: '500' }}>
                  <strong style={{ color: '#0ea5e9', fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)' }}>2017</strong> · ConnexionAI 설립 · 200억 규모 AI 스마트팩토리 구축 프로젝트 컨설팅
                    </p>
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
                background: '#0ea5e9',
                borderRadius: '50%',
                marginBottom: '25px',
                boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)'
              }}>
                <span style={{ fontSize: '2.5rem' }}>🤖</span>
              </div>

              <h2 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
                fontWeight: '800',
                color: '#1f2937',
                marginBottom: '20px'
              }}>
                10일 완성, 수익화하는 AI 에이전트
              </h2>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#0ea5e9',
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
                  color: '#1f2937',
                  fontSize: '1.1rem',
                  lineHeight: '1.7',
                  margin: '0 0 30px 0',
                  fontWeight: '500'
                }}>
                  Google OPAL을 활용해 나만의 <strong style={{ color: '#0ea5e9' }}>수익화 에이전트</strong>를 만들고<br />
                  실제 유튜브 컨텐츠 자동 생성 시스템을 구축하세요.<br />
                  <strong style={{ color: '#0ea5e9' }}>10일 완성</strong> 실전 수익화 에이전트 개발 과정입니다.
                </p>
                </div>
              </div>
            </div>

            {/* 커리큘럼 - 깔끔한 텍스트 중심 디자인 */}
            <div style={{
            maxWidth: '1100px',
            margin: '0 auto'
          }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '800',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              📚 10일 완성 커리큘럼
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              marginBottom: '60px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              하루 1시간 × 10일 = 수익화 에이전트 마스터 🎓
            </p>

            {/* CORE: 1강-3강 */}
            <div style={{ marginBottom: '60px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                padding: 'clamp(20px, 4vw, 35px)',
                borderRadius: '20px',
                marginBottom: '30px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(14, 165, 233, 0.3)'
              }}>
                <h4 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: '800',
                  margin: '0 0 15px 0',
                  letterSpacing: '0.5px'
                }}>
                  🎯 Part 1 (1강-5강)
                </h4>
                <p style={{
                        margin: '0',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  opacity: '0.95',
                            fontWeight: '600',
                  lineHeight: '1.6'
                }}>
                  수익화하는 인공지능 에이전트 첫걸음
                        </p>
                      </div>

                      <div style={{
                background: '#ffffff',
                padding: 'clamp(25px, 4vw, 40px)',
                borderRadius: '15px',
                border: '2px solid #e2e8f0'
              }}>
                {course.lessons.slice(0, 5).map((lesson: any) => (
                <div
                  key={lesson.id}
                  style={{
                      marginBottom: '30px',
                      paddingBottom: '30px',
                      borderBottom: lesson.id === 5 ? 'none' : '1px solid #e2e8f0'
                    }}
                  >
                      <h5 style={{
                      color: '#0ea5e9',
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      fontWeight: '800',
                      marginBottom: '15px'
                    }}>
                      Day {lesson.day} · {lesson.title.replace(`Day ${lesson.day}: `, '')}
                      </h5>
                    <div style={{
                      fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                      lineHeight: '1.8',
                      color: '#1f2937'
                    }}>
                      <p style={{ marginBottom: '12px', fontWeight: '500' }}>
                        <strong style={{ color: '#1f2937' }}>이론:</strong> {lesson.sections.theory}
                      </p>
                      <p style={{ marginBottom: '0', fontWeight: '500' }}>
                        <strong style={{ color: '#1f2937' }}>실습:</strong> {lesson.sections.practice}
                        </p>
                      </div>
                </div>
              ))}
              </div>
            </div>

            {/* Part 2: 6강-10강 */}
            <div style={{ marginBottom: '60px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: 'clamp(20px, 4vw, 35px)',
                borderRadius: '20px',
                marginBottom: '30px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
              }}>
                <h4 style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: '800',
                  margin: '0 0 15px 0',
                  letterSpacing: '0.5px'
                }}>
                  🚀 Part 2 (6강-10강)
                </h4>
                <p style={{
                        margin: '0',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  opacity: '0.95',
                            fontWeight: '600',
                  lineHeight: '1.6'
                }}>
                  실전 수익화 컨텐츠 자동 생성 에이전트
                        </p>
                      </div>

                      <div style={{
                background: '#ffffff',
                padding: 'clamp(25px, 4vw, 40px)',
                borderRadius: '15px',
                border: '2px solid #e2e8f0'
              }}>
                {course.lessons.slice(5, 10).map((lesson: any) => (
                <div
                  key={lesson.id}
                  style={{
                      marginBottom: '30px',
                      paddingBottom: '30px',
                      borderBottom: lesson.id === 10 ? 'none' : '1px solid #e2e8f0'
                    }}
                  >
                      <h5 style={{
                      color: '#10b981',
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      fontWeight: '800',
                      marginBottom: '15px'
                    }}>
                      Day {lesson.day} · {lesson.title.replace(`Day ${lesson.day}: `, '')}
                      </h5>
                    <div style={{
                      fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                      lineHeight: '1.8',
                      color: '#1f2937'
                    }}>
                      <p style={{ marginBottom: '12px', fontWeight: '500' }}>
                        <strong style={{ color: '#1f2937' }}>이론:</strong> {lesson.sections.theory}
                      </p>
                      <p style={{ marginBottom: '0', fontWeight: '500' }}>
                        <strong style={{ color: '#1f2937' }}>실습:</strong> {lesson.sections.practice}
                        </p>
                      </div>
                </div>
              ))}
              </div>
            </div>

            {/* 하단 CTA - 가격 & 수강 신청 버튼 */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #0ea5e9)',
              borderRadius: '25px',
              padding: 'clamp(40px, 6vw, 60px) clamp(30px, 5vw, 50px)',
              marginTop: '80px',
              border: '4px solid #93c5fd',
              boxShadow: '0 20px 60px rgba(14, 165, 233, 0.4)',
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
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(80px)'
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
                  border: '2px solid #fbbf24',
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
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  color: '#e0f2fe',
                  textDecoration: 'line-through',
                  marginBottom: '10px',
                  fontWeight: '600',
                  opacity: 0.8
                }}>
                  정상가 ₩95,000
                </div>
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
                  🐦 얼리버드 50,000원 할인
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
                    border: '3px solid #fbbf24',
                    padding: '25px 60px',
                    fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
                    fontWeight: '900',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 30px rgba(251, 191, 36, 0.5)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px',
                    minWidth: '320px',
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
                >
                  <span style={{ fontSize: '1.8rem' }}>🚀</span>
                  지금 바로 수강하기
                </button>
                <p style={{
                  fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                  color: '#e0f2fe',
                  margin: '0',
                  fontWeight: '600'
                }}>
                  💳 안전한 결제 · 평생 소장 가능
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGPTAgentBeginnerEarlyBirdPage;
