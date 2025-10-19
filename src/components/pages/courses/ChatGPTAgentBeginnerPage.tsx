
import React, { useState, useEffect } from 'react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';
import PaymentComponent from '../payment/PaymentComponent';

interface ChatGPTAgentBeginnerPageProps {
  onBack: () => void;
}

const ChatGPTAgentBeginnerPage: React.FC<ChatGPTAgentBeginnerPageProps> = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEarlyBirdInfoModal, setShowEarlyBirdInfoModal] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const course = {
    id: 1002,
    title: "ChatGPT AI AGENT 비기너편 - 15일 완성",
    subtitle: "코딩 몰라도, 당신의 AI가 스스로 생각하고 일하게 만든다",
    lessons: [
      // Week 1: AI 에이전트 기초 (Day 1-5)
      {
        id: 1,
        day: 1,
        title: "Day 1: AI 에이전트의 세계에 오신 것을 환영합니다",
        duration: "60분",
        hasQuiz: true,
        sections: {
          theory: "• AI 에이전트란 무엇인가? (ChatGPT와의 차이)\n• AgentKit 소개 및 기본 개념\n• AI 에이전트로 할 수 있는 것들",
          practice: "• OpenAI 계정 만들기\n• AgentKit Builder 둘러보기\n• 첫 AI 에이전트 만들어보기 (Hello World Agent)"
        }
      },
      {
        id: 2,
        day: 2,
        title: "Day 2: 나만의 첫 번째 챗봇 만들기",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• Agent Builder 기본 구조 이해\n• Start, Agent, End 노드 개념\n• 워크플로우의 기본 원리",
          practice: "• 간단한 Q&A 챗봇 만들기\n• 노드 연결 실습\n• 첫 번째 에이전트 테스트 및 배포"
        }
      },
      {
        id: 3,
        day: 3,
        title: "Day 3: 프롬프트 엔지니어링 기초",
        duration: "60분",
        hasQuiz: true,
        sections: {
          theory: "• 좋은 프롬프트 vs 나쁜 프롬프트\n• AI에게 명확한 지시를 내리는 방법\n• 역할(Role), 맥락(Context), 예시(Examples) 활용법",
          practice: "• '친절한 고객센터 직원' 에이전트 만들기\n• 다양한 프롬프트 테스트\n• 최적의 응답을 이끌어내는 실습"
        }
      },
      {
        id: 4,
        day: 4,
        title: "Day 4: File Search - 문서를 읽는 AI",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• File Search 기능 이해하기\n• PDF, TXT, DOCX 파일 처리\n• 문서 검색과 정보 추출 원리",
          practice: "• PDF 문서 업로드하기\n• '문서 요약 봇' 만들기\n• 내 이력서/보고서를 분석하는 AI 완성"
        }
      },
      {
        id: 5,
        day: 5,
        title: "Day 5: 첫 번째 프로젝트 - 나만의 비서 AI",
        duration: "60분",
        hasQuiz: true,
        sections: {
          theory: "• Week 1 복습 및 정리\n• 실전 프로젝트 기획 방법\n• Agent 성능 평가 기준",
          practice: "• '일정 관리 비서' 완성하기\n• 여러 기능 통합 실습\n• 포트폴리오 프로젝트 #1 완성"
        }
      },

      // Week 2: 업무 자동화 (Day 6-10)
      {
        id: 6,
        day: 6,
        title: "Day 6: Agent Builder 워크플로우 이해하기",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• Start → Agent → End 구조\n• 노드(Node) 개념과 연결\n• 워크플로우 디자인 패턴",
          practice: "• 3단계 워크플로우 만들기\n• 노드 연결 실습\n• '질문 → 분석 → 답변' 플로우 구축"
        }
      },
      {
        id: 7,
        day: 7,
        title: "Day 7: Transform - 데이터 가공의 마법",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• Transform 노드의 역할\n• 데이터 변환과 포맷팅\n• JSON, CSV 데이터 다루기",
          practice: "• '회의록 → 이메일 초안' 변환기\n• 데이터 구조 바꾸기 실습\n• 자동화 워크플로우 완성"
        }
      },
      {
        id: 8,
        day: 8,
        title: "Day 8: Human Approval - 안전장치 추가하기",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• Human-in-the-loop 개념\n• 승인 프로세스 설계\n• 위험 관리와 품질 관리",
          practice: "• '보내기 전 확인' 기능 추가\n• 승인 워크플로우 구축\n• 안전한 자동화 시스템 완성"
        }
      },
      {
        id: 9,
        day: 9,
        title: "Day 9: Logic Node - AI가 스스로 판단하게 하기",
        duration: "60분",
        hasQuiz: true,
        sections: {
          theory: "• 조건문(If-Else) 개념\n• 분기 처리와 의사결정\n• 복잡한 워크플로우 설계",
          practice: "• '요청 유형별 자동 분류' 시스템\n• 조건에 따른 다른 응답 만들기\n• 스마트 업무 자동화 봇 완성"
        }
      },
      {
        id: 10,
        day: 10,
        title: "Day 10: 두 번째 프로젝트 - 업무 자동화 시스템",
        duration: "60분",
        hasQuiz: true,
        sections: {
          theory: "• Week 2 총정리\n• 실무 자동화 시나리오 분석\n• 워크플로우 최적화 방법",
          practice: "• '이메일 자동 응답 시스템' 완성\n• 복잡한 워크플로우 통합\n• 포트폴리오 프로젝트 #2 완성"
        }
      },

      // Week 3: 웹 배포 & 고급 기능 (Day 11-15)
      {
        id: 11,
        day: 11,
        title: "Day 11: ChatKit으로 웹에 배포하기",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• ChatKit 소개 및 설정\n• 웹 임베딩의 원리\n• HTML/JavaScript 기본",
          practice: "• Workflow ID 복사하기\n• HTML 코드에 삽입하기\n• 내 웹사이트에 챗봇 띄우기"
        }
      },
      {
        id: 12,
        day: 12,
        title: "Day 12: 챗봇 디자인 커스터마이징",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• UI/UX 디자인 기초\n• 브랜딩과 색상 이론\n• 사용자 경험 최적화",
          practice: "• 챗봇 색상/로고 변경\n• 환영 메시지 설정\n• 블로그/Notion/티스토리에 배포 실습"
        }
      },
      {
        id: 13,
        day: 13,
        title: "Day 13: Input Node로 맞춤형 입력 받기",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• 구조화된 입력의 중요성\n• 폼(Form) 디자인\n• 사용자 데이터 수집 전략",
          practice: "• '주제, 톤, 길이' 입력 폼 만들기\n• 맞춤형 콘텐츠 생성기 구축\n• 유튜브 스크립트 작가 AI 완성"
        }
      },
      {
        id: 14,
        day: 14,
        title: "Day 14: Evals & AI 성능 최적화",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• AI 성능 평가 방법론\n• Prompt Optimizer 사용법\n• A/B 테스팅 개념",
          practice: "• 결과물 품질 평가하기\n• 프롬프트 자동 최적화\n• 스스로 학습하는 AI 만들기"
        }
      },
      {
        id: 15,
        day: 15,
        title: "Day 15: 최종 프로젝트 - 나만의 AI 서비스 런칭",
        duration: "90분",
        hasQuiz: true,
        sections: {
          theory: "• 전체 과정 복습\n• 실전 프로젝트 기획\n• AI 서비스 수익화 전략\n• 다음 단계 로드맵",
          practice: "• 최종 프로젝트: 선택 과제\n  1) GPT-4o Realtime 음성 AI 비서\n  2) 콘텐츠 자동 생성 시스템\n  3) 고객 응대 챗봇\n• 포트폴리오 완성 및 발표\n• 수료증 발급 🎓"
        }
      }
    ]
  };

  const originalPrice = 190000;
  const earlyBirdPrice = 45000;

  // D-Day 카운트다운
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const launchDate = new Date('2025-11-15T00:00:00+09:00'); // 한국시간
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;
      
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

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
            setUserInfo(parsedUserInfo);

            // Azure 테이블에서 결제 상태 확인
            try {
              const paymentStatus = await AzureTableService.checkCoursePayment(
                parsedUserInfo.email, 
                'chatgpt-agent-beginner'
              );

              console.log('💳 Azure 테이블 결제 상태 확인 결과:', paymentStatus);

              if (paymentStatus && paymentStatus.isPaid) {
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
            setUserInfo(null);
          }
        } else {
          console.log('❌ 세션 정보가 없습니다');
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    checkAuthStatus();
  }, []);

  const handleEarlyBirdPayment = async () => {
    console.log('🔍 수강 신청 버튼 클릭 - 얼리버드 안내 모달 열기');
    
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다. 먼저 로그인해주세요.');
      return;
    }
    
    // 얼리버드 안내 모달 표시
    setShowEarlyBirdInfoModal(true);
  };

  const handleConfirmEarlyBird = () => {
    setShowEarlyBirdInfoModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    console.log('🎉 결제 성공!');
    setShowPaymentModal(false);
    setIsPaidUser(true);
    alert('🎉 결제가 완료되었습니다! 강의 시청 페이지로 이동합니다.');
    
    // 결제 성공 후 새로운 강의 시청 페이지로 리다이렉트
    setTimeout(() => {
      window.location.href = '/chatgpt-agent-beginner-player';
    }, 1500);
  };

  const handlePaymentClose = () => {
    console.log('❌ 결제 모달 닫기');
    setShowPaymentModal(false);
  };

  return (
    <div className="masterclass-container">
      <NavigationBar
        onBack={onBack}
        breadcrumbText="ChatGPT AI AGENT 비기너편"
      />

      {/* 얼리버드 안내 모달 */}
      {showEarlyBirdInfoModal && (
        <div 
          onClick={() => setShowEarlyBirdInfoModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            zIndex: 10000,
            padding: '20px',
            overflowY: 'auto',
            paddingTop: '100px'
          }}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              margin: '0 auto'
            }}>
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowEarlyBirdInfoModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#64748b',
                padding: '5px 10px'
              }}
            >
              ✕
            </button>

            {/* 아이콘 */}
            <div style={{
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '20px'
              }}>🎯</div>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: '800',
                color: '#0369a1',
                marginBottom: '15px'
              }}>
                얼리버드 특가 안내
              </h2>
            </div>

            {/* 안내 내용 */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              borderRadius: '15px',
              padding: '30px',
              marginBottom: '30px',
              border: '2px solid #bae6fd'
            }}>
              <div style={{
                fontSize: '1.1rem',
                color: '#0c4a6e',
                lineHeight: '1.8',
                marginBottom: '20px'
              }}>
                <p style={{ marginBottom: '15px', fontWeight: '600' }}>
                  📅 <strong>강의 런칭일:</strong> 2025년 11월 15일
                </p>
                <p style={{ marginBottom: '15px' }}>
                  💰 <strong>얼리버드 가격:</strong> ₩45,000 (지금 결제)
                </p>
                <p style={{ marginBottom: '15px' }}>
                  💸 <strong>정가:</strong> ₩190,000 (11월 15일 이후)
                </p>
                <p style={{ marginBottom: '0', fontWeight: '600', color: '#0ea5e9' }}>
                  🎓 <strong>수강 가능일:</strong> 2025년 11월 15일부터
                </p>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '10px',
                padding: '20px',
                border: '2px dashed #0ea5e9',
                marginBottom: '15px'
              }}>
                <p style={{
                  fontSize: '1rem',
                  color: '#64748b',
                  lineHeight: '1.6',
                  margin: '0'
                }}>
                  <strong style={{ color: '#0369a1' }}>💡 안내:</strong><br/>
                  지금 ₩45,000 얼리버드 가격으로 결제하시면,<br/>
                  2025년 11월 15일부터 강의를 수강하실 수 있습니다.<br/>
                  런칭 후 수강 시 ₩190,000으로 인상됩니다.
                </p>
              </div>

              <div style={{
                background: '#fff7ed',
                borderRadius: '10px',
                padding: '20px',
                border: '2px solid #fed7aa'
              }}>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#92400e',
                  lineHeight: '1.6',
                  margin: '0'
                }}>
                  <strong style={{ color: '#c2410c' }}>📧 결제 후 안내:</strong><br/>
                  • 결제 완료 시 마이페이지에서 수강 신청 내역을 확인하실 수 있습니다.<br/>
                  • 11월 15일 런칭 후 자동으로 강의가 오픈됩니다.<br/>
                  • 문의사항: <strong>jay@connexionai.kr</strong>
                </p>
              </div>
            </div>

            {/* 버튼 */}
            <div style={{
              display: 'flex',
              gap: '15px',
              flexDirection: 'column'
            }}>
              <button
                onClick={handleConfirmEarlyBird}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 30px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.3)';
                }}
              >
                확인했습니다. ₩45,000 얼리버드 가격으로 결제하기
              </button>

              <button
                onClick={() => setShowEarlyBirdInfoModal(false)}
                style={{
                  background: 'white',
                  color: '#64748b',
                  border: '2px solid #e2e8f0',
                  padding: '15px 30px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                다시 생각해볼게요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PaymentComponent 모달 - 페이지 최상단에 위치 */}
      {showPaymentModal && userInfo && (
        <PaymentComponent
          courseId="1002"
          courseTitle="ChatGPT AI AGENT 비기너편"
          price={45000}
          userInfo={userInfo}
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}

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
          {/* 런칭 D-Day 카운트다운 - 최상단 배치 */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
            borderRadius: '20px',
            padding: 'clamp(25px, 4vw, 40px) clamp(15px, 3vw, 30px)',
            textAlign: 'center',
            marginBottom: '30px',
            boxShadow: '0 15px 40px rgba(30, 58, 138, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
              fontWeight: '800',
              marginBottom: '25px',
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
              🚀 2025년 11월 15일 런칭 예정
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              {[
                { label: '일', value: timeLeft.days },
                { label: '시간', value: timeLeft.hours },
                { label: '분', value: timeLeft.minutes },
                { label: '초', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '15px',
                  padding: 'clamp(15px, 3vw, 20px) clamp(15px, 3vw, 25px)',
                  minWidth: 'clamp(70px, 15vw, 90px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  border: '2px solid rgba(255, 255, 255, 1)'
                }}>
                  <div style={{
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    fontWeight: '900',
                    marginBottom: '5px',
                    color: '#1e3a8a',
                    lineHeight: '1'
                  }}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#64748b'
                  }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 상단 메인 CTA - 깔끔한 디자인 */}
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            borderRadius: '20px',
            padding: 'clamp(30px, 5vw, 50px) clamp(20px, 4vw, 40px)',
            textAlign: 'center',
            marginBottom: '50px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(14, 165, 233, 0.3)'
          }}>

            {/* 강의 아이콘과 제목 */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                marginBottom: '25px',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}>
                <span style={{ fontSize: '2.5rem' }}>🤖</span>
              </div>
              <h1 style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                marginBottom: '20px',
                fontWeight: '800',
                color: '#ffffff'
              }}>
                ChatGPT AI AGENT 비기너편
              </h1>
              <h2 style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                marginBottom: '30px',
                color: '#ffffff',
                fontWeight: '600'
              }}>
                하루 1시간씩, 10일 만에 나만의 AI 에이전트 완성
              </h2>
            </div>

            {/* 가격 정보 - 깔끔한 디자인 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '15px',
              padding: '30px',
              marginBottom: '40px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                fontSize: '1.2rem',
                textDecoration: 'line-through',
                marginBottom: '10px',
                color: '#ffffff',
                opacity: '0.8'
              }}>
                ₩{originalPrice.toLocaleString()}
              </div>
              <div style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: '900',
                marginBottom: '15px',
                color: '#ffffff'
              }}>
                ₩{earlyBirdPrice.toLocaleString()}
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#ffffff',
                marginBottom: '15px',
                fontWeight: '500',
                opacity: '0.9'
              }}>
                월 {Math.floor(earlyBirdPrice / 12).toLocaleString()}원 (12개월 무이자)
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#ffffff',
                fontWeight: '700',
                marginBottom: '15px',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'inline-block',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                🔥 76% 할인 (얼리버드 특가)
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#ffffff',
                fontWeight: '500',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'inline-block'
              }}>
                ⏰ 런칭일(2025.11.15)부터 19만원으로 인상 예정
              </div>
            </div>

            {/* 메인 수강 신청 버튼 - 강조된 디자인 */}
            <div style={{
              position: 'relative',
              display: 'inline-block',
              marginBottom: '20px'
            }}>
              {/* 버튼 뒤 빛나는 효과 */}
              <div style={{
                position: 'absolute',
                inset: '-4px',
                background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #fbbf24)',
                borderRadius: '18px',
                filter: 'blur(8px)',
                opacity: '0.7',
                animation: 'pulse 2s ease-in-out infinite',
                zIndex: '-1'
              }}></div>
              
              <button
                onClick={handleEarlyBirdPayment}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '25px 60px',
                  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                  fontWeight: '800',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(251, 191, 36, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  minWidth: '300px',
                  position: 'relative',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(251, 191, 36, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(251, 191, 36, 0.5)';
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>🚀</span>
                얼리버드 특가로 수강하기
              </button>
            </div>

            <p style={{
              fontSize: '1rem',
              color: '#ffffff',
              margin: '0',
              fontWeight: '500',
              opacity: '0.9'
            }}>
              💳 안전한 결제 | 12개월 무이자 할부 가능
            </p>
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

              {/* 학력 인증 섹션 */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              padding: 'clamp(30px, 5vw, 50px)',
                borderRadius: '20px',
                border: '2px solid #e2e8f0',
              marginBottom: '50px'
              }}>
                <h3 style={{
                  color: '#1f2937',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: '800',
                marginBottom: '40px',
                textAlign: 'center'
                }}>
                  🎓 학력 인증
                </h3>
                
                <div style={{
                  display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: '40px'
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
                            height: '200px',
                            objectFit: 'cover',
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
                            height: '200px',
                            objectFit: 'cover',
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

          {/* AI Agent 사용의 중요성 - 박스 밖으로 */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
                fontWeight: '800',
                color: '#dc2626',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                ⚠️ AI Agent는 그냥 사용해서는 안됩니다!
              </h2>
              
              <p style={{
                color: '#374151',
                fontSize: '1.2rem',
                lineHeight: '1.7',
                marginBottom: '30px',
                fontWeight: '600'
              }}>
                Jay 멘토가 스스로 AI 연구개발하고 AI 스타트업을 창업하면서 알게된 것들:
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  background: '#ffffff',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '2px solid #0ea5e9',
                  boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)',
                  textAlign: 'left'
                }}>
                  <h4 style={{
                    color: '#0ea5e9',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    💰 Resource Optimization이 필요해요!
                  </h4>
                  <p style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    margin: '0',
                    lineHeight: '1.5'
                  }}>
                    API 비용을 최소화하는 방법
                  </p>
                </div>

                <div style={{
                  background: '#ffffff',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '2px solid #0ea5e9',
                  boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)',
                  textAlign: 'left'
                }}>
                  <h4 style={{
                    color: '#0ea5e9',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    ⚡ 효율적인 워크플로우 설계
                  </h4>
                  <p style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    margin: '0',
                    lineHeight: '1.5'
                  }}>
                    불필요한 API 호출 방지
                  </p>
                </div>

                <div style={{
                  background: '#ffffff',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '2px solid #0ea5e9',
                  boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)',
                  textAlign: 'left'
                }}>
                  <h4 style={{
                    color: '#0ea5e9',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🚀 실제 서비스 운영 노하우
                  </h4>
                  <p style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    margin: '0',
                    lineHeight: '1.5'
                  }}>
                    스타트업에서 검증된 방법론
                  </p>
                </div>

                <div style={{
                  background: '#ffffff',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '2px solid #0ea5e9',
                  boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)',
                  textAlign: 'left'
                }}>
                  <h4 style={{
                    color: '#0ea5e9',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📈 비용 대비 효과 극대화
                  </h4>
                  <p style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    margin: '0',
                    lineHeight: '1.5'
                  }}>
                    최소 비용으로 최대 성과 달성
                  </p>
                </div>
              </div>

              <p style={{
                color: '#64748b',
                fontSize: '1.1rem',
                lineHeight: '1.7',
                fontStyle: 'italic',
                marginBottom: '30px',
                fontWeight: '500'
              }}>
                "단순히 AI 도구를 사용하는 것이 아니라, <strong style={{ color: '#0ea5e9' }}>효율적이고 경제적인 AI 솔루션</strong>을 만드는 방법을 배우세요."
              </p>

              <button 
                onClick={() => window.location.href = '/cost-optimization-examples'}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 25px rgba(14, 165, 233, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.3)';
                }}
              >
                💡 비용 최적화 예제 보기
              </button>
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
                각 강의가 곧 하나의 '실습 프로젝트'
              </h2>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#0ea5e9',
                fontWeight: '600',
                marginBottom: '30px'
              }}>
                일상/업무/콘텐츠 중심 설계
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
                  AgentKit을 활용해 나만의 <strong style={{ color: '#0ea5e9' }}>AI 에이전트</strong>를 만들고<br />
                  실제 웹사이트에 배포하는 방법을 배워보세요.<br />
                  <strong style={{ color: '#0ea5e9' }}>18강의</strong>로 완성하는 실전 AI 에이전트 개발 과정입니다.
                </p>
                
                {/* 맛보기 영상 */}
                <div style={{
                  marginTop: '30px',
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    color: '#0ea5e9',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    marginBottom: '20px'
                  }}>
                    🎬 맛보기 영상: AI 에이전트의 모든 것
                  </h3>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '600px',
                    margin: '0 auto',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                  }}>
                    <iframe
                      width="100%"
                      height="340"
                      src="https://www.youtube.com/embed/UeQdxZx09to"
                      title="ChatGPT AI AGENT 맛보기 영상"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{
                        borderRadius: '15px'
                      }}
                    ></iframe>
                  </div>
                  <p style={{
                    color: '#64748b',
                    fontSize: '0.9rem',
                    marginTop: '15px',
                    fontWeight: '500'
                  }}>
                    영화 속 AI 어시스턴트가 현실이 되다? ChatGPT Agent 소개부터<br />
                    실제 AI 에이전트 만들기까지 모든 것을 확인해보세요!
                  </p>
                </div>
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
              📚 15일 완성 커리큘럼
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              marginBottom: '60px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              하루 1시간 × 15일 = AI 에이전트 마스터 🎓
            </p>

            {/* Week 1: Day 1-5 */}
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
                  Week 1: 기초 다지기
                </h4>
                <p style={{
                        margin: '0',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  opacity: '0.95',
                            fontWeight: '600',
                  lineHeight: '1.6'
                }}>
                  Day 1-5 · AI와 Agent 개념 완전 이해 → 내가 직접 만든 첫 AI
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

            {/* Week 2: Day 6-10 */}
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
                  Week 2: 도구 익히기
                </h4>
                <p style={{
                        margin: '0',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  opacity: '0.95',
                            fontWeight: '600',
                  lineHeight: '1.6'
                }}>
                  Day 6-10 · 도구와 제어 구조 익히기 → 안전하고 똑똑한 AI 비서
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

            {/* Week 3: Day 11-15 */}
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
                  Week 3: 실전 완성
                </h4>
                <p style={{
                        margin: '0',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  opacity: '0.95',
                            fontWeight: '600',
                  lineHeight: '1.6'
                }}>
                  Day 11-15 · 실전 프로젝트 완성 → 나만의 AI 비서 시스템 완성
                        </p>
                      </div>

                      <div style={{
                background: '#ffffff',
                padding: 'clamp(25px, 4vw, 40px)',
                borderRadius: '15px',
                border: '2px solid #e2e8f0'
              }}>
                {course.lessons.slice(10, 15).map((lesson: any) => (
                <div
                  key={lesson.id}
                  style={{
                      marginBottom: '30px',
                      paddingBottom: '30px',
                      borderBottom: lesson.id === 15 ? 'none' : '1px solid #e2e8f0'
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGPTAgentBeginnerPage;
