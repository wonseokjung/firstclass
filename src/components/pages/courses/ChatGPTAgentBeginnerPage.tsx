
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
    title: "🤖 AI Agent, 10일 완성",
    subtitle: "수익화하는 인공지능 에이전트 만들기",
    lessons: [
      // Part 1 (Day 1-5) - 수익화하는 인공지능 에이전트 첫걸음
      {
        id: 1,
        day: 1,
        title: "Day 1: 나의 목표에 맞는 에이전트 찾기 - ChatGPT vs ChatGPT Agent",
        hasQuiz: true,
        sections: {
          theory: "• ChatGPT vs Agent의 핵심 차이점\n• AI의 전체 구조 이해\n• 수익화 가능한 에이전트 활용 사례",
          practice: "• ChatGPT 회원가입\n• 에이전트 API 등록\n• 첫 에이전트 생성 및 테스트"
        }
      },
      {
        id: 2,
        day: 2,
        title: "Day 2: Work Flow Design 기초 - 나의 일을 AI가 이해할 수 있게 쪼개기",
        hasQuiz: false,
        sections: {
          theory: "• 논리적 사고 구조 설계\n• 업무를 단계별로 분해하는 방법\n• 효율적인 워크플로우 구성",
          practice: "• 유튜브 컨텐츠 기획하는 에이전트 만들기\n• 워크플로우 설계 실습\n• 자동화 프로세스 구축"
        }
      },
      {
        id: 3,
        day: 3,
        title: "Day 3: GPT-5부터 o3까지 - Agent Builder에서 선택할 수 있는 AI 모델 총정리",
        hasQuiz: true,
        sections: {
          theory: "• LLM이란? GPT 모델의 차이\n• 가격 최적화 전략\n• 목적별 최적 모델 선택 가이드",
          practice: "• 모델별 응답 비교 실험\n• 비용 대비 성능 분석\n• 프로젝트별 모델 매칭"
        }
      },
      {
        id: 4,
        day: 4,
        title: "Day 4: 인스타그램 포스팅 에이전트 만들기 - OpenAI vs Google OPAL 비교",
        hasQuiz: false,
        sections: {
          theory: "• OpenAI와 Google OPAL의 차이점\n• 각 플랫폼의 장단점 비교\n• SNS 컨텐츠 자동화 전략",
          practice: "• OpenAI로 인스타그램 에이전트 생성\n• Google OPAL로 동일 에이전트 생성\n• 두 플랫폼 차이점 체감하기"
        }
      },
      {
        id: 5,
        day: 5,
        title: "Day 5: 유튜브 컨텐츠 수익화하는 인공지능 에이전트 만들기",
        hasQuiz: true,
        sections: {
          theory: "• 유튜브 수익화 구조 이해\n• 컨텐츠 자동화 전략\n• 조회수 최적화 방법",
          practice: "• Google OPAL로 유튜브 에이전트 구축\n• 실전 컨텐츠 생성 프로젝트\n• 수익화 시스템 완성"
        }
      },
      // Part 2 (Day 6-10) - 실전 수익화 컨텐츠 자동 생성 에이전트
      {
        id: 6,
        day: 6,
        title: "Day 6: 판매 수익화 에이전트 - 제품 판매 영상 자동 생성",
        hasQuiz: false,
        sections: {
          theory: "• 제품 판매 컨텐츠 구조 분석\n• 효과적인 리뷰/광고 영상 전략\n• 컨버전 최적화 방법",
          practice: "• Google OPAL로 리뷰 영상 자동 생성\n• 제품 소개 컨텐츠 제작\n• 광고 영상 자동화 시스템 구축"
        }
      },
      {
        id: 7,
        day: 7,
        title: "Day 7: 바이럴 마케팅 에이전트 - 조회수 폭발 컨텐츠 생성",
        hasQuiz: false,
        sections: {
          theory: "• 바이럴 컨텐츠의 핵심 요소\n• 트렌드 분석 및 활용 방법\n• 조회수 최적화 전략",
          practice: "• Google OPAL로 트렌드 분석 에이전트 구축\n• 바이럴 영상 자동 제작\n• 썸네일/제목 최적화 자동화"
        }
      },
      {
        id: 8,
        day: 8,
        title: "Day 8: 음성 컨텐츠 에이전트 - ASMR & 지식 나눔 영상 생성",
        hasQuiz: false,
        sections: {
          theory: "• 음성 기반 컨텐츠의 장점과 시장\n• ASMR, 오디오북, 명상 컨텐츠 분석\n• 음성 품질 최적화 전략",
          practice: "• Google OPAL로 ASMR 컨텐츠 자동 생성\n• 오디오북 음성 제작 자동화\n• 명상/교육 컨텐츠 자동화 시스템 구축"
        }
      },
      {
        id: 9,
        day: 9,
        title: "Day 9: 대량 생산 에이전트 - 한 번에 15개 영상 자동 생성",
        hasQuiz: false,
        sections: {
          theory: "• 배치 처리 시스템의 원리\n• 대량 생산 최적화 전략\n• 품질 관리와 일관성 유지",
          practice: "• 배치 처리 에이전트 구축\n• 15개 영상 동시 생성 시스템 개발\n• 대량 컨텐츠 자동화 완성"
        }
      },
      {
        id: 10,
        day: 10,
        title: "Day 10: 완전 자동화 수익 시스템 - 분석부터 업로드까지",
        hasQuiz: true,
        sections: {
          theory: "• 트렌드 분석부터 배포까지 전체 워크플로우\n• 완전 자동화 시스템 설계\n• 지속 가능한 수익화 전략",
          practice: "• 트렌드 분석 자동화\n• 컨텐츠 생성 → 편집 → 업로드 자동화\n• 완전 자동 유튜브 수익 시스템 완성"
        }
      }
    ]
  };

  const originalPrice = 95000;
  const earlyBirdPrice = 45000;

  // D-Day 카운트다운
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const launchDate = new Date('2025-11-15T15:00:00+09:00'); // 한국시간 오후 3시
    
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
      const confirmLogin = window.confirm('로그인이 필요한 서비스입니다. 먼저 로그인해주세요.\n\n로그인 페이지로 이동하시겠습니까?');
      if (confirmLogin) {
        window.location.href = '/login';
      }
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
                  💸 <strong>정가:</strong> ₩95,000 (11월 15일 이후)
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
                  런칭 후 수강 시 ₩95,000으로 인상됩니다.
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

          {/* 강의 소개 영상 */}
          <div style={{
            marginBottom: '60px',
            maxWidth: '900px',
            margin: '0 auto 60px auto'
          }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 1.8rem)',
              fontWeight: '700',
              color: '#1f2937',
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
                src="https://www.youtube.com/embed/BZynp51fBRU?controls=1&modestbranding=1&rel=0&playsinline=1"
                title="AI Agent Beginner 강의 소개"
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
                allowFullScreen
              />
            </div>
          </div>

          {/* 상단 메인 CTA */}
          <div style={{
            textAlign: 'center',
            marginBottom: '50px'
          }}>

            {/* 강의 아이콘과 제목 */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                borderRadius: '50%',
                marginBottom: '25px',
                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
              }}>
                <span style={{ fontSize: '2.5rem' }}>🤖</span>
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

            {/* 가격 정보 - 강조된 박스 */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              borderRadius: '20px',
              padding: 'clamp(30px, 5vw, 40px)',
              marginBottom: '30px',
              border: '2px solid #0ea5e9',
              boxShadow: '0 10px 30px rgba(14, 165, 233, 0.15)'
            }}>
              <div style={{
                fontSize: '1.1rem',
                textDecoration: 'line-through',
                marginBottom: '10px',
                color: '#94a3b8',
                fontWeight: '600'
              }}>
                ₩{originalPrice.toLocaleString()}
              </div>
              <div style={{
                fontSize: 'clamp(3rem, 6vw, 4rem)',
                fontWeight: '900',
                marginBottom: '12px',
                color: '#0ea5e9',
                textShadow: '0 2px 4px rgba(14, 165, 233, 0.2)'
              }}>
                ₩{earlyBirdPrice.toLocaleString()}
              </div>
              <div style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#1f2937',
                marginBottom: '25px',
                fontWeight: '600'
              }}>
                월 {Math.floor(earlyBirdPrice / 12).toLocaleString()}원 (12개월 무이자)
              </div>
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                color: '#ffffff',
                fontWeight: '700',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
              }}>
                🔥 53% 할인 (얼리버드 특가)
              </div>
              <div style={{
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                color: '#ffffff',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  padding: '10px 18px',
                  borderRadius: '25px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
              }}>
                ⏰ 런칭일(2025.11.15)부터 9만 5천원으로 인상 예정
                </div>
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
                background: 'linear-gradient(45deg, #0ea5e9, #0284c7, #0ea5e9)',
                borderRadius: '18px',
                filter: 'blur(8px)',
                opacity: '0.7',
                animation: 'pulse 2s ease-in-out infinite',
                zIndex: '-1'
              }}></div>
              
              <button
                onClick={handleEarlyBirdPayment}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '25px 60px',
                  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                  fontWeight: '800',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(14, 165, 233, 0.5)',
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
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(14, 165, 233, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.5)';
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>🚀</span>
                얼리버드 특가로 수강하기
              </button>
            </div>

            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              margin: '0',
              fontWeight: '500'
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

            {/* CORE: Day 1-3 */}
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
                  🎯 Part 1 (Day 1-5)
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

            {/* Part 2: Day 6-10 */}
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
                  🚀 Part 2 (Day 6-10)
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGPTAgentBeginnerPage;
