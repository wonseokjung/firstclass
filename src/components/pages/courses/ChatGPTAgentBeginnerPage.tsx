
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
    title: "🧠 AI Agent Maker",
    subtitle: "15일 완성, 나만의 인공지능 에이전트 만들기",
    lessons: [
      // CORE (Day 1-3) - AI의 사고 구조 이해하기
      {
        id: 1,
        day: 1,
        title: "Day 1: 내 첫 AI 친구: ChatGPT와 Agent의 차이",
        duration: "60분",
        hasQuiz: true,
        sections: {
          theory: "• ChatGPT vs AI Agent의 핵심 차이점\n• AI Agent의 자율성과 도구 사용 능력\n• 실제 활용 사례와 가능성",
          practice: "• OpenAI 계정 생성 및 API 키 발급\n• 나만의 첫 AI 에이전트 생성\n• API 연동 및 테스트"
        }
      },
      {
        id: 2,
        day: 2,
        title: "Day 2: AI 한 명 vs AI 팀: 협업형 에이전트 구조",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• 싱글 에이전트와 멀티 에이전트의 차이\n• 협업형 AI 구조 설계 원리\n• 역할 분담과 작업 흐름 관리",
          practice: "• 싱글 에이전트 구성 실습\n• 멀티 에이전트 팀 구축\n• 에이전트 간 협업 플로우 테스트"
        }
      },
      {
        id: 3,
        day: 3,
        title: "Day 3: AI의 두뇌 이해하기: LLM의 세계",
        duration: "60분",
        hasQuiz: true,
        sections: {
          theory: "• GPT-4o, GPT-4o-mini, o1 등 모델 비교\n• 목적별 최적 모델 선택 전략\n• 토큰 개념과 비용 최적화",
          practice: "• 다양한 LLM 모델 테스트\n• 성능 vs 비용 분석\n• 프로젝트별 모델 매칭 실습"
        }
      },
      // TOOLS (Day 4-9) - 에이전트 성장시키기
      {
        id: 4,
        day: 4,
        title: "Day 4: 기억 심기 (File Search)",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• File Search 기능의 원리와 활용\n• PDF, 노션 데이터 처리 방법\n• 지식 기반 AI 구축 전략",
          practice: "• PDF 파일 업로드 및 인덱싱\n• 문서 기반 Q&A 봇 만들기\n• 내 PDF·노션 데이터를 읽고 답하는 지식형 AI 완성"
        }
      },
      {
        id: 5,
        day: 5,
        title: "Day 5: 안전장치 달기 (Guardrails)",
        duration: "60분",
        hasQuiz: true,
        sections: {
          theory: "• AI 보안의 중요성\n• Prompt Injection 및 Jailbreak 공격\n• Guardrails 설계 원칙",
          practice: "• 입력 필터링 규칙 설정\n• 출력 검증 시스템 구축\n• 잘못된 답변과 해킹을 차단하는 안전한 AI 완성"
        }
      },
      {
        id: 6,
        day: 6,
        title: "Day 6: 도구 연결하기 (MCP)",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• Model Context Protocol (MCP) 이해\n• 외부 서비스 연동 구조\n• API 통신과 인증 방법",
          practice: "• Gmail, Google Drive 연동\n• 커스텀 API 연결\n• 외부 서비스와 통신하는 AI 완성"
        }
      },
      {
        id: 7,
        day: 7,
        title: "Day 7: 판단 훈련 (if/else)",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• 조건부 로직 설계\n• 의사결정 트리 구조\n• 복잡한 분기 처리 패턴",
          practice: "• 조건문 기반 플로우 작성\n• 다중 분기 처리 시스템 구축\n• 조건별 분기 처리 가능한 AI 로직 완성"
        }
      },
      {
        id: 8,
        day: 8,
        title: "Day 8: 승인 절차 배우기 (User Approval)",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "• Human-in-the-loop 시스템\n• 승인 워크플로우 설계\n• 책임 소재와 품질 관리",
          practice: "• 사용자 승인 노드 추가\n• 승인 대기 및 처리 플로우 구축\n• 사용자 승인 후 실행하는 협업형 플로우 완성"
        }
      },
      {
        id: 9,
        day: 9,
        title: "Day 9: 기억력 훈련 (Set State)",
        duration: "60분",
        hasQuiz: true,
        sections: {
          theory: "• 상태 관리(State Management) 개념\n• 대화 맥락 유지 전략\n• 세션과 메모리 구조",
          practice: "• State 변수 설정 및 활용\n• 대화 히스토리 저장\n• 이전 대화 맥락을 기억하고 이어가는 AI 완성"
        }
      },

      // PROJECT (Day 10-15) - 실전형 AI 에이전트 6종 완성
      {
        id: 10,
        day: 10,
        title: "Day 10: 데이터 통합 에이전트",
        duration: "90분",
        hasQuiz: false,
        sections: {
          theory: "• 다중 데이터 소스 통합 전략\n• 데이터 정규화 및 병합 기법\n• 통합 분석 리포트 구조",
          practice: "• 여러 파일 형식 통합 처리\n• 자동 데이터 정리 및 분석\n• 자료를 한 번에 정리하는 종합 분석 AI 완성"
        }
      },
      {
        id: 11,
        day: 11,
        title: "Day 11: 일정 설계 에이전트",
        duration: "90분",
        hasQuiz: false,
        sections: {
          theory: "• 목표 기반 계획 수립 방법론\n• 시간 관리 및 우선순위 설정\n• 주간 일정 최적화 알고리즘",
          practice: "• 목표 입력 및 분석 시스템\n• 자동 일정 생성 로직 구현\n• 목표 기반 주간 일정과 계획을 자동 생성하는 AI 코치 완성"
        }
      },
      {
        id: 12,
        day: 12,
        title: "Day 12: 고객 응대 에이전트",
        duration: "90분",
        hasQuiz: false,
        sections: {
          theory: "• FAQ 기반 학습 시스템\n• 24시간 자동 응대 구조\n• 고객 만족도 최적화 전략",
          practice: "• FAQ 데이터베이스 구축\n• 자동 답변 시스템 개발\n• FAQ 학습형 24시간 고객상담 챗봇 완성"
        }
      },
      {
        id: 13,
        day: 13,
        title: "Day 13: 데이터 질의응답 에이전트",
        duration: "90분",
        hasQuiz: false,
        sections: {
          theory: "• 자연어 to SQL 변환 원리\n• 데이터베이스 쿼리 최적화\n• 결과 시각화 및 표 생성",
          practice: "• 자연어 질의 파싱 시스템\n• DB 쿼리 실행 및 결과 포맷팅\n• DB에 자연어로 질의해 표로 결과 반환하는 분석가형 AI 완성"
        }
      },
      {
        id: 14,
        day: 14,
        title: "Day 14: 문서 비교 에이전트",
        duration: "90분",
        hasQuiz: false,
        sections: {
          theory: "• 문서 diff 알고리즘\n• 변경사항 추적 및 하이라이팅\n• 버전 관리 시스템 통합",
          practice: "• 문서 업로드 및 파싱\n• 차이점 분석 및 시각화\n• 두 문서의 수정·차이점을 자동 분석 및 표시하는 AI 완성"
        }
      },
      {
        id: 15,
        day: 15,
        title: "Day 15: 사내 지식 에이전트",
        duration: "90분",
        hasQuiz: true,
        sections: {
          theory: "• 내부 문서 인덱싱 전략\n• 지식 베이스 구축 방법론\n• 팀 협업 최적화",
          practice: "• 사내 매뉴얼 업로드 및 학습\n• 자동 Q&A 시스템 구축\n• 내부 매뉴얼을 학습해 팀의 Q&A를 자동 처리하는 AI 완성"
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
                15일 완성, 나만의 인공지능 에이전트 만들기
              </h2>
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                marginBottom: '30px',
                color: '#64748b',
                lineHeight: '1.6'
              }}>
                코딩 몰라도, 클릭 몇 번으로 "AI가 스스로 판단하고 일하는 에이전트"를 만든다
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
                  🔥 76% 할인 (얼리버드 특가)
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
                  ⏰ 런칭일(2025.11.15)부터 19만원으로 인상 예정
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
                  📘 CORE (Day 1-3)
                </h4>
                <p style={{
                        margin: '0',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  opacity: '0.95',
                            fontWeight: '600',
                  lineHeight: '1.6'
                }}>
                  AI의 사고 구조 이해하기
                        </p>
                      </div>

                      <div style={{
                background: '#ffffff',
                padding: 'clamp(25px, 4vw, 40px)',
                borderRadius: '15px',
                border: '2px solid #e2e8f0'
              }}>
                {course.lessons.slice(0, 3).map((lesson: any) => (
                <div
                  key={lesson.id}
                  style={{
                      marginBottom: '30px',
                      paddingBottom: '30px',
                      borderBottom: lesson.id === 3 ? 'none' : '1px solid #e2e8f0'
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

            {/* TOOLS: Day 4-9 */}
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
                  ⚙️ TOOLS (Day 4-9)
                </h4>
                <p style={{
                        margin: '0',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  opacity: '0.95',
                            fontWeight: '600',
                  lineHeight: '1.6'
                }}>
                  에이전트 성장시키기
                        </p>
                      </div>

                      <div style={{
                background: '#ffffff',
                padding: 'clamp(25px, 4vw, 40px)',
                borderRadius: '15px',
                border: '2px solid #e2e8f0'
              }}>
                {course.lessons.slice(3, 9).map((lesson: any) => (
                <div
                  key={lesson.id}
                  style={{
                      marginBottom: '30px',
                      paddingBottom: '30px',
                      borderBottom: lesson.id === 9 ? 'none' : '1px solid #e2e8f0'
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

            {/* PROJECT: Day 10-15 */}
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
                  🧩 PROJECT (Day 10-15)
                </h4>
                <p style={{
                        margin: '0',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  opacity: '0.95',
                            fontWeight: '600',
                  lineHeight: '1.6'
                }}>
                  실전형 AI 에이전트 6종 완성
                        </p>
                      </div>

                      <div style={{
                background: '#ffffff',
                padding: 'clamp(25px, 4vw, 40px)',
                borderRadius: '15px',
                border: '2px solid #e2e8f0'
              }}>
                {course.lessons.slice(9, 15).map((lesson: any) => (
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
