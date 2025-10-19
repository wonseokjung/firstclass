import React, { useState, useEffect } from 'react';
import { Clock, ChevronDown, ChevronRight, BookOpen, Wrench } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';
import PaymentComponent from '../payment/PaymentComponent';

interface ChatGPTAgentBeginnerPageProps {
  onBack: () => void;
}

const ChatGPTAgentBeginnerPage: React.FC<ChatGPTAgentBeginnerPageProps> = ({ onBack }) => {
  // const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setCheckingEnrollment] = useState(false);
  const [, setIsAlreadyEnrolled] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEarlyBirdInfoModal, setShowEarlyBirdInfoModal] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const course = {
    id: 1002,
    title: "ChatGPT AI AGENT 비기너편 - 15일 완성",
    subtitle: "하루 1시간, 15일이면 누구나 AI 에이전트 마스터!",
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

  // 챕터 확장/접기 함수
  const toggleChapter = (chapterId: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

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
            setCheckingEnrollment(true);

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
                setIsAlreadyEnrolled(false);
              }
            } catch (azureError) {
              console.error('❌ Azure 테이블 조회 실패:', azureError);
              // Azure 오류 시에도 구매 페이지를 표시
              setIsAlreadyEnrolled(false);
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
      } finally {
        setCheckingEnrollment(false);
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

  // const handleLoginRequired = () => {
  //   alert('로그인이 필요한 서비스입니다.');
  // };

  const handlePaymentSuccess = () => {
    console.log('🎉 결제 성공!');
    setShowPaymentModal(false);
    setIsAlreadyEnrolled(true);
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

          {/* AI City Builders 플랫폼 구조 - 수익 배분 */}
          <div style={{
            background: '#ffffff',
            padding: 'clamp(30px, 5vw, 60px) clamp(20px, 4vw, 40px)',
            borderRadius: '24px',
            marginBottom: '60px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h3 style={{
                fontSize: '2.2rem',
                fontWeight: '800',
                marginBottom: '16px',
                color: '#1f2937'
              }}>
                왜 AI City Builders가 더 저렴하면서도 더 나은가?
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0'
              }}>
                기존 교육 플랫폼의 한계를 뛰어넘는 혁신적인 구조
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '32px',
              marginBottom: '50px'
            }}>
              {/* 기존 플랫폼 구조 */}
              <div style={{
                background: '#ffffff',
                padding: '32px',
                borderRadius: '20px',
                border: '2px solid #fee2e2',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.08)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '24px',
                  background: '#ef4444',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}>
                  기존 플랫폼
                </div>

                <div style={{ marginTop: '24px' }}>
                  <div style={{
                    background: '#fef7f7',
                    padding: '20px',
                    borderRadius: '16px',
                    marginBottom: '20px',
                    border: '1px solid #fecaca'
                  }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      📊 수익 배분
                    </h4>
                    <div style={{ gap: '12px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid #fecaca'
                      }}>
                        <span style={{ color: '#7f1d1d', fontSize: '0.95rem' }}>강사</span>
                        <span style={{ fontWeight: '700', color: '#dc2626', fontSize: '1.1rem' }}>20~30%</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0'
                      }}>
                        <span style={{ color: '#7f1d1d', fontSize: '0.95rem' }}>플랫폼</span>
                        <span style={{ fontWeight: '700', color: '#dc2626', fontSize: '1.1rem' }}>70~80%</span>
                      </div>
                    </div>
                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#991b1b',
                      fontWeight: '600'
                    }}>
                      → 광고비, 운영비로 인한 높은 수강료
                    </div>
                  </div>

                  <div style={{
                    background: '#fef7f7',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #fecaca'
                  }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      👥 학습 방식
                    </h4>
                    <ul style={{ margin: '0', paddingLeft: '0', listStyle: 'none' }}>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        color: '#7f1d1d'
                      }}>
                        <span style={{ color: '#dc2626', fontWeight: '700' }}>✕</span>
                        단순 수강자로만 참여
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        color: '#7f1d1d'
                      }}>
                        <span style={{ color: '#dc2626', fontWeight: '700' }}>✕</span>
                        일방향 학습
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#7f1d1d'
                      }}>
                        <span style={{ color: '#dc2626', fontWeight: '700' }}>✕</span>
                        강의 완료 후 관계 종료
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI City Builders 구조 */}
              <div style={{
                background: '#ffffff',
                padding: '32px',
                borderRadius: '20px',
                border: '2px solid #dbeafe',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.08)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '24px',
                  background: '#0ea5e9',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
                }}>
                  AI City Builders
                </div>

                <div style={{ marginTop: '24px' }}>
                  <div style={{
                    background: '#f0f9ff',
                    padding: '20px',
                    borderRadius: '16px',
                    marginBottom: '20px',
                    border: '1px solid #bae6fd'
                  }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#0ea5e9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🚀 새로운 수익 구조
                    </h4>
                    <ul style={{ margin: '0', paddingLeft: '0', listStyle: 'none' }}>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        자체 제작으로 중간 수수료 없음
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        커뮤니티 홍보 시 10% 리워드 (현금 교환 가능)
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        등급 상승으로 수익률 증가
                      </li>
                    </ul>
                    <div style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: '#0ea5e9',
                      color: 'white',
                      borderRadius: '12px',
                      textAlign: 'center',
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}>
                      결과: 76% 저렴한 수강료
                    </div>
                  </div>

                  <div style={{
                    background: '#f0f9ff',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #bae6fd'
                  }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#0ea5e9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🌟 참여자 중심 생태계
                    </h4>
                    <ul style={{ margin: '0', paddingLeft: '0', listStyle: 'none' }}>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        단순 수강자에서 적극적 참여자로
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        함께 성장하는 커뮤니티
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        홍보 참여로 수익 창출 기회
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 핵심 차별점 요약 */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '40px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px solid #cbd5e1'
            }}>
              <div style={{
                display: 'inline-block',
                background: '#0ea5e9',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: '700',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
              }}>
                제이 멘토의 실제 조사 결과
              </div>
              <blockquote style={{
                fontSize: '1.15rem',
                lineHeight: '1.8',
                margin: '0',
                color: '#374151',
                fontStyle: 'italic',
                position: 'relative',
                padding: '0 20px'
              }}>
                <span style={{
                  fontSize: '3rem',
                  color: '#0ea5e9',
                  position: 'absolute',
                  left: '-10px',
                  top: '-10px',
                  fontFamily: 'serif'
                }}>"</span>
                모든 주요 교육 플랫폼과 미팅하고 계약서를 분석한 결과, 기존 플랫폼들은 강사에게 20~30%만 주고 70~80%를 가져가 수강료가 비쌀 수밖에 없었습니다. AI City Builders는 이 구조를 완전히 뒤집어 여러분께 더 저렴하고 더 나은 가치를 제공합니다.
                <span style={{
                  fontSize: '3rem',
                  color: '#0ea5e9',
                  position: 'absolute',
                  right: '-10px',
                  bottom: '-30px',
                  fontFamily: 'serif'
                }}>"</span>
              </blockquote>
            </div>
          </div>

          {/* 멘토 소개 - Jay 멘토 이력 */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{
              background: '#ffffff',
              padding: 'clamp(30px, 5vw, 50px) clamp(20px, 4vw, 40px)',
              borderRadius: '20px',
              marginBottom: '40px',
              border: '2px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
                fontWeight: '800',
                color: '#1f2937',
                marginBottom: '30px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <span>👨‍💼</span>
                멘토 소개: 정원석 (Jay)
              </h2>

              {/* 멘토 프로필 요약 */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                padding: '30px',
                borderRadius: '15px',
                marginBottom: '40px',
                border: '2px solid #0ea5e9',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    background: '#0ea5e9',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}>
                    🏢 커넥젼에이아이 대표
                  </div>
                  <div style={{
                    background: '#0ea5e9',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}>
                    🎓 서울사이버대학교 대우교수
                  </div>
                  <div style={{
                    background: '#0ea5e9',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}>
                    📺 AI 콘텐츠 크리에이터
                  </div>
                  <div style={{
                    background: '#0ea5e9',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}>
                    📱 인스타그램 30만 팔로워
                  </div>
                </div>
                <p style={{
                  color: '#64748b',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  margin: '0',
                  fontWeight: '500'
                }}>
                  AI 솔루션 개발과 컨설팅을 통한 디지털 트랜스포메이션을 선도하며,<br />
                  차세대 AI 인재 양성과 AI 지식 대중화에 힘쓰고 있습니다.
                </p>
              </div>

              {/* 멘토 이미지 섹션 */}
              <div style={{
                textAlign: 'center',
                marginBottom: '50px',
                padding: '40px 20px'
              }}>
                <img 
                  src="/images/jaymentor.PNG" 
                  alt="정원석 (Jay) 멘토 강의 모습"
                  style={{
                    maxWidth: '600px',
                    width: '90%',
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                    marginBottom: '30px',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <p style={{
                  fontSize: '1.2rem',
                  color: '#4b5563',
                  fontStyle: 'italic',
                  fontWeight: '500',
                  maxWidth: '600px',
                  margin: '0 auto',
                  lineHeight: '1.6'
                }}>
                  ChatGPT AI AGENT 비기너편 멘토 정원석(Jay)의 강의 모습
                </p>
              </div>

              {/* 학력 인증 섹션 */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                padding: 'clamp(25px, 4vw, 40px)',
                borderRadius: '20px',
                border: '2px solid #e2e8f0',
                marginBottom: '40px'
              }}>
                <h3 style={{
                  color: '#1f2937',
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
                  fontWeight: '800',
                  marginBottom: '30px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  🎓 학력 인증
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                  gap: '30px'
                }}>
                  {/* 일리노이공대 석사 */}
                  <div style={{
                    background: '#ffffff',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '2px solid #0ea5e9',
                    textAlign: 'center',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)'
                  }}>
                    <div style={{
                      background: '#0ea5e9',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      marginBottom: '20px',
                      display: 'inline-block'
                    }}>
                      석사
                    </div>
                    <h4 style={{
                      color: '#1f2937',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      marginBottom: '8px'
                    }}>
                      일리노이공대
                    </h4>
                    <p style={{
                      color: '#64748b',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '5px'
                    }}>
                      Illinois Institute of Technology
                    </p>
                    <p style={{
                      color: '#0ea5e9',
                      fontSize: '1rem',
                      fontWeight: '700',
                      marginBottom: '20px'
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
                    padding: '25px',
                    borderRadius: '15px',
                    border: '2px solid #0ea5e9',
                    textAlign: 'center',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)'
                  }}>
                    <div style={{
                      background: '#0ea5e9',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      marginBottom: '20px',
                      display: 'inline-block'
                    }}>
                      학사
                    </div>
                    <h4 style={{
                      color: '#1f2937',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      marginBottom: '8px'
                    }}>
                      뉴욕시립대
                    </h4>
                    <p style={{
                      color: '#64748b',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '5px'
                    }}>
                      City University of New York - Baruch College
                    </p>
                    <p style={{
                      color: '#0ea5e9',
                      fontSize: '1rem',
                      fontWeight: '700',
                      marginBottom: '20px'
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

              {/* 현재 활동 섹션 */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                padding: '40px',
                borderRadius: '20px',
                border: '2px solid #e2e8f0',
                marginBottom: '40px'
              }}>
                <h3 style={{
                  color: '#1f2937',
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  marginBottom: '30px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  💼 현재 활동
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px'
                }}>
                  <div style={{
                    background: '#ffffff',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                  }}
                  >
                    <div style={{
                      background: '#0ea5e9',
                      color: 'white',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      fontSize: '1.5rem'
                    }}>
                      🏢
                    </div>
                    <h4 style={{
                      color: '#1f2937',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      marginBottom: '10px'
                    }}>
                      커넥젼에이아이 대표
                    </h4>
                    <p style={{
                      color: '#64748b',
                      fontSize: '0.95rem',
                      margin: '0',
                      lineHeight: '1.5'
                    }}>
                      AI 솔루션 개발과 컨설팅을 통한 디지털 트랜스포메이션 선도
                    </p>
                  </div>
                  
                </div>
              </div>

              {/* 주요 경력 타임라인 */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                padding: '40px',
                borderRadius: '20px',
                border: '2px solid #e2e8f0',
                marginBottom: '30px'
              }}>
                <h3 style={{
                  color: '#1f2937',
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  marginBottom: '30px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  📈 주요 경력 타임라인
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  {/* 2024년 */}
                  <div style={{
                    background: '#ffffff',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '2px solid #0ea5e9',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(14, 165, 233, 0.1)';
                  }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        background: '#0ea5e9',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        minWidth: '80px',
                        textAlign: 'center'
                      }}>
                        2024년
                      </div>
                      <h4 style={{
                        color: '#1f2937',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: '0'
                      }}>
                        서울사이버대학교 대우교수
                      </h4>
                    </div>
                    <p style={{
                      color: '#64748b',
                      fontSize: '1rem',
                      margin: '0',
                      lineHeight: '1.6',
                      paddingLeft: '95px'
                    }}>
                      공과대학 인공지능 전공 교수 임명 · 알파세대를 위한 AI 교육 솔루션 컨설팅/개발
                    </p>
                  </div>

                  {/* 2023년 */}
                  <div style={{
                    background: '#ffffff',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '2px solid #0ea5e9',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(14, 165, 233, 0.1)';
                  }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: '#0ea5e9',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      🏆 수상
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        background: '#0ea5e9',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        minWidth: '80px',
                        textAlign: 'center'
                      }}>
                        2023년
                      </div>
                      <h4 style={{
                        color: '#1f2937',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: '0'
                      }}>
                        AI 해커톤 다수 수상
                      </h4>
                    </div>
                    <p style={{
                      color: '#64748b',
                      fontSize: '1rem',
                      margin: '0',
                      lineHeight: '1.6',
                      paddingLeft: '95px'
                    }}>
                      뤼튼 해커톤 1위 (AI 해킹 방어 툴 개발) · 블록체인 해커톤 2위
                    </p>
                  </div>

                  {/* 2022년 */}
                  <div style={{
                    background: '#ffffff',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '2px solid #0ea5e9',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(14, 165, 233, 0.1)';
                  }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: '#0ea5e9',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      🌍 글로벌
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        background: '#0ea5e9',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        minWidth: '80px',
                        textAlign: 'center'
                      }}>
                        2022년
                      </div>
                      <h4 style={{
                        color: '#1f2937',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: '0'
                      }}>
                        메타 아시아 지역 글로벌 리더 선정
                      </h4>
                    </div>
                    <p style={{
                      color: '#64748b',
                      fontSize: '1rem',
                      margin: '0',
                      lineHeight: '1.6',
                      paddingLeft: '95px'
                    }}>
                      4인 중 한 명으로 선정 · 아시아 AI 생태계 리더십 인정
                    </p>
                  </div>

                  {/* 2020년 */}
                  <div style={{
                    background: '#ffffff',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '2px solid #0ea5e9',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(14, 165, 233, 0.1)';
                  }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        background: '#0ea5e9',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        minWidth: '80px',
                        textAlign: 'center'
                      }}>
                        2020년
                      </div>
                      <h4 style={{
                        color: '#1f2937',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: '0'
                      }}>
                        AI 헬스케어 스타트업 옵트버스 설립
                      </h4>
                    </div>
                    <p style={{
                      color: '#64748b',
                      fontSize: '1rem',
                      margin: '0',
                      lineHeight: '1.6',
                      paddingLeft: '95px'
                    }}>
                      50억원 기업가치 인정받아 투자 유치 성공
                    </p>
                  </div>

                  {/* 2019년 */}
                  <div style={{
                    background: '#ffffff',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '2px solid #0ea5e9',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(14, 165, 233, 0.1)';
                  }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: '#0ea5e9',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      👥 200+ 양성
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        background: '#0ea5e9',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        minWidth: '80px',
                        textAlign: 'center'
                      }}>
                        2019년
                      </div>
                      <h4 style={{
                        color: '#1f2937',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: '0'
                      }}>
                        모두의연구소 인공지능 선임연구원
                      </h4>
                    </div>
                    <p style={{
                      color: '#64748b',
                      fontSize: '1rem',
                      margin: '0',
                      lineHeight: '1.6',
                      paddingLeft: '95px'
                    }}>
                      AI COLLEGE 기획/운영 · 200명 이상 AI 연구원 양성 · NeurIPS, CVPR 등 유수 컨퍼런스 논문 게재
                    </p>
                  </div>

                  {/* 2018년 */}
                  <div style={{
                    background: '#ffffff',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '2px solid #0ea5e9',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(14, 165, 233, 0.1)';
                  }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: '#0ea5e9',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      🏆 Best Poster
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        background: '#0ea5e9',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        minWidth: '80px',
                        textAlign: 'center'
                      }}>
                        2018년
                      </div>
                      <h4 style={{
                        color: '#1f2937',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: '0'
                      }}>
                        PostAI 강화학습 연구
                      </h4>
                    </div>
                    <p style={{
                      color: '#64748b',
                      fontSize: '1rem',
                      margin: '0',
                      lineHeight: '1.6',
                      paddingLeft: '95px'
                    }}>
                      "REWARD SHAPING IS ALL YOU NEED" 논문 발표<br/>
                      "Exploration method for reducing uncertainty using Q-entropy" 논문으로 Best Poster Award 수상
                    </p>
                  </div>

                  {/* 2017년 */}
                  <div style={{
                    background: '#ffffff',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '2px solid #0ea5e9',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(14, 165, 233, 0.1)';
                  }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        background: '#0ea5e9',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        minWidth: '80px',
                        textAlign: 'center'
                      }}>
                        2017년
                      </div>
                      <h4 style={{
                        color: '#1f2937',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: '0'
                      }}>
                        ConnexionAI 설립
                      </h4>
                    </div>
                    <p style={{
                      color: '#64748b',
                      fontSize: '1rem',
                      margin: '0',
                      lineHeight: '1.6',
                      paddingLeft: '95px'
                    }}>
                      200억 규모 AI 스마트팩토리 구축 프로젝트 컨설팅 · AI 솔루션 개발 사업 시작
                    </p>
                  </div>
                </div>
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

          {/* 커리큘럼 - Day 중심 디자인 */}
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '20px',
            padding: 'clamp(30px, 5vw, 50px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e2e8f0'
          }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '900',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              📚 15일 완성 커리큘럼
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              marginBottom: '50px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              하루 1시간 × 15일 = AI 에이전트 마스터 🎓
            </p>

            {/* Week 1: Day 1-5 */}
            <div style={{ marginBottom: '50px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                padding: 'clamp(15px, 3vw, 25px)',
                borderRadius: '15px',
                marginBottom: '25px',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)'
              }}>
                <h4 style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                  fontWeight: '800',
                  margin: '0',
                  letterSpacing: '0.5px'
                }}>
                  📚 WEEK 1: AI 에이전트 기초
                </h4>
                <p style={{
                  margin: '10px 0 0 0',
                  fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                  opacity: '0.95',
                  fontWeight: '500'
                }}>
                  Day 1-5 · ChatGPT Agent 입문부터 첫 프로젝트까지
                </p>
              </div>

              {course.lessons.slice(0, 5).map((lesson: any, index: number) => (
                <div
                  key={lesson.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  {/* 챕터 헤더 */}
                  <div
                    onClick={() => toggleChapter(lesson.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 20px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      color: '#ffffff',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '800',
                      flexShrink: 0,
                      boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)',
                      minWidth: '80px'
                    }}>
                      Day {lesson.day || (index + 1)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                        fontWeight: '700'
                      }}>
                        {lesson.title}
                      </h5>
                      <p style={{
                        color: '#64748b',
                        fontSize: '0.85rem',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Clock size={12} />
                        {lesson.duration}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {expandedChapters.has(lesson.id) ?
                        <ChevronDown size={18} color="#64748b" /> :
                        <ChevronRight size={18} color="#64748b" />
                      }
                    </div>
                  </div>

                  {/* 이론 & 실습 섹션 */}
                  {expandedChapters.has(lesson.id) && (
                    <div style={{
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '15px'
                }}>💼</div>
                <h4 style={{
                  color: '#0ea5e9',
                  fontSize: '1.1rem',
                  marginBottom: '8px',
                  fontWeight: '700'
                }}>Part 2: 업무 자동화</h4>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  fontWeight: '500'
                }}>일상 & 업무 자동화 (3강)</p>
              </div>

              {/* Part 3: 웹 배포 */}
              <div style={{
                background: '#ffffff',
                padding: '25px 20px',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '15px'
                }}>🧑‍💻</div>
                <h4 style={{
                  color: '#0ea5e9',
                  fontSize: '1.1rem',
                  marginBottom: '8px',
                  fontWeight: '700'
                }}>Part 3: 웹 배포</h4>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  fontWeight: '500'
                }}>내 웹사이트에 배포하기 (3강)</p>
              </div>

              {/* Part 4: 콘텐츠 제작 */}
              <div style={{
                background: '#ffffff',
                padding: '25px 20px',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '15px'
                }}>🎨</div>
                <h4 style={{
                  color: '#0ea5e9',
                  fontSize: '1.1rem',
                  marginBottom: '8px',
                  fontWeight: '700'
                }}>Part 4: 콘텐츠</h4>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  fontWeight: '500'
                }}>콘텐츠 제작형 AI (3강)</p>
              </div>

              {/* Part 5: 음성 인터랙션 */}
              <div style={{
                background: '#ffffff',
                padding: '25px 20px',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '15px'
                }}>🔊</div>
                <h4 style={{
                  color: '#0ea5e9',
                  fontSize: '1.1rem',
                  marginBottom: '8px',
                  fontWeight: '700'
                }}>Part 5: 음성</h4>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  fontWeight: '500'
                }}>음성 기반 인터랙션 (3강)</p>
              </div>
            </div>
          </div>

          {/* 커리큘럼 - Day 중심 디자인 */}
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '20px',
            padding: 'clamp(30px, 5vw, 50px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e2e8f0'
          }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '900',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              📚 15일 완성 커리큘럼
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              marginBottom: '50px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              하루 1시간 × 15일 = AI 에이전트 마스터 🎓
            </p>

            {/* Week 1: Day 1-5 */}
            <div style={{ marginBottom: '50px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                padding: 'clamp(15px, 3vw, 25px)',
                borderRadius: '15px',
                marginBottom: '25px',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)'
              }}>
                <h4 style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                  fontWeight: '800',
                  margin: '0',
                  letterSpacing: '0.5px'
                }}>
                  📚 WEEK 1: AI 에이전트 기초
                </h4>
                <p style={{
                  margin: '10px 0 0 0',
                  fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                  opacity: '0.95',
                  fontWeight: '500'
                }}>
                  Day 1-5 · ChatGPT Agent 입문부터 첫 프로젝트까지
                </p>
              </div>

              {course.lessons.slice(0, 5).map((lesson: any, index: number) => (
                <div
                  key={lesson.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  {/* 챕터 헤더 */}
                  <div
                    onClick={() => toggleChapter(lesson.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 20px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      color: '#ffffff',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '800',
                      flexShrink: 0,
                      boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)',
                      minWidth: '80px'
                    }}>
                      Day {lesson.day || (index + 1)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                        fontWeight: '700'
                      }}>
                        {lesson.title}
                      </h5>
                      <p style={{
                        color: '#64748b',
                        fontSize: '0.85rem',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Clock size={12} />
                        {lesson.duration}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {expandedChapters.has(lesson.id) ?
                        <ChevronDown size={18} color="#64748b" /> :
                        <ChevronRight size={18} color="#64748b" />
                      }
                    </div>
                  </div>

                  {/* 이론 & 실습 섹션 */}
                  {expandedChapters.has(lesson.id) && lesson.sections && (
                    <div style={{
                      borderTop: '1px solid #f1f5f9',
                      padding: '20px',
                    }}>
                      {/* 이론 섹션 */}
                      <div style={{
                        marginBottom: '15px',
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#10b981'
                          }}>
                            이론
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.theory}
                        </p>
                      </div>

                      {/* 실습 섹션 */}
                      <div style={{
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.practice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Week 2: Day 6-10 */}
            <div style={{ marginBottom: '50px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: 'clamp(15px, 3vw, 25px)',
                borderRadius: '15px',
                marginBottom: '25px',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
              }}>
                <h4 style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                  fontWeight: '800',
                  margin: '0',
                  letterSpacing: '0.5px'
                }}>
                  ⚡ WEEK 2: 업무 자동화
                </h4>
                <p style={{
                  margin: '10px 0 0 0',
                  fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                  opacity: '0.95',
                  fontWeight: '500'
                }}>
                  Day 6-10 · 워크플로우 구축부터 자동화 시스템 완성까지
                </p>
              </div>

              {course.lessons.slice(5, 10).map((lesson: any, index: number) => (
                <div
                  key={lesson.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  {/* 챕터 헤더 */}
                  <div
                    onClick={() => toggleChapter(lesson.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 20px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      backgroundColor: '#0ea5e9',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {index + 5}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {lesson.title}
                      </h5>
                      <p style={{
                        color: '#64748b',
                        fontSize: '0.85rem',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Clock size={12} />
                        {lesson.duration}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {expandedChapters.has(lesson.id) ?
                        <ChevronDown size={18} color="#64748b" /> :
                        <ChevronRight size={18} color="#64748b" />
                      }
                    </div>
                  </div>

                  {/* 이론 & 실습 섹션 */}
                  {expandedChapters.has(lesson.id) && lesson.sections && (
                    <div style={{
                      borderTop: '1px solid #f1f5f9',
                      padding: '20px',
                    }}>
                      {/* 이론 섹션 */}
                      <div style={{
                        marginBottom: '15px',
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#10b981'
                          }}>
                            이론
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.theory}
                        </p>
                      </div>

                      {/* 실습 섹션 */}
                      <div style={{
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.practice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Week 3: Day 11-15 */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: 'clamp(15px, 3vw, 25px)',
                borderRadius: '15px',
                marginBottom: '25px',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
              }}>
                <h4 style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                  fontWeight: '800',
                  margin: '0',
                  letterSpacing: '0.5px'
                }}>
                  🚀 WEEK 3: 웹 배포 & 실전
                </h4>
                <p style={{
                  margin: '10px 0 0 0',
                  fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                  opacity: '0.95',
                  fontWeight: '500'
                }}>
                  Day 11-15 · 웹 배포부터 최종 프로젝트까지
                </p>
              </div>

              {course.lessons.slice(10, 15).map((lesson: any, index: number) => (
                <div
                  key={lesson.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  {/* 챕터 헤더 */}
                  <div
                    onClick={() => toggleChapter(lesson.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 20px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      backgroundColor: '#0ea5e9',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {index + 10}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {lesson.title}
                      </h5>
                      <p style={{
                        color: '#64748b',
                        fontSize: '0.85rem',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Clock size={12} />
                        {lesson.duration}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {expandedChapters.has(lesson.id) ?
                        <ChevronDown size={18} color="#64748b" /> :
                        <ChevronRight size={18} color="#64748b" />
                      }
                    </div>
                  </div>

                  {/* 이론 & 실습 섹션 */}
                  {expandedChapters.has(lesson.id) && lesson.sections && (
                    <div style={{
                      borderTop: '1px solid #f1f5f9',
                      padding: '20px',
                    }}>
                      {/* 이론 섹션 */}
                      <div style={{
                        marginBottom: '15px',
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#10b981'
                          }}>
                            이론
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.theory}
                        </p>
                      </div>

                      {/* 실습 섹션 */}
                      <div style={{
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.practice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Part 3: 내 웹사이트에 배포하기 */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                background: '#0ea5e9',
                color: 'white',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  🧑‍💻 Part 3: 내 웹사이트에 배포하기
                </h4>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  ChatKit 퍼블리시부터 실제 배포까지
                </p>
              </div>

              {course.lessons.slice(9, 12).map((lesson: any, index: number) => (
                <div
                  key={lesson.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  {/* 챕터 헤더 */}
                  <div
                    onClick={() => toggleChapter(lesson.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 20px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      backgroundColor: '#0ea5e9',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {index + 10}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {lesson.title}
                      </h5>
                      <p style={{
                        color: '#64748b',
                        fontSize: '0.85rem',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Clock size={12} />
                        {lesson.duration}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {expandedChapters.has(lesson.id) ?
                        <ChevronDown size={18} color="#64748b" /> :
                        <ChevronRight size={18} color="#64748b" />
                      }
                    </div>
                  </div>

                  {/* 이론 & 실습 섹션 */}
                  {expandedChapters.has(lesson.id) && lesson.sections && (
                    <div style={{
                      borderTop: '1px solid #f1f5f9',
                      padding: '20px',
                    }}>
                      {/* 이론 섹션 */}
                      <div style={{
                        marginBottom: '15px',
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            이론
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.theory}
                        </p>
                      </div>

                      {/* 실습 섹션 */}
                      <div style={{
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.practice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Part 4: 콘텐츠 제작형 AI */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                background: '#0ea5e9',
                color: 'white',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  🎨 Part 4: 콘텐츠 제작형 AI
                </h4>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  구조화된 입력부터 자동화 루프까지
                </p>
              </div>

              {course.lessons.slice(12, 15).map((lesson: any, index: number) => (
                <div
                  key={lesson.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  {/* 챕터 헤더 */}
                  <div
                    onClick={() => toggleChapter(lesson.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 20px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      backgroundColor: '#0ea5e9',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {index + 13}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {lesson.title}
                      </h5>
                      <p style={{
                        color: '#64748b',
                        fontSize: '0.85rem',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Clock size={12} />
                        {lesson.duration}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {expandedChapters.has(lesson.id) ?
                        <ChevronDown size={18} color="#64748b" /> :
                        <ChevronRight size={18} color="#64748b" />
                      }
                    </div>
                  </div>

                  {/* 이론 & 실습 섹션 */}
                  {expandedChapters.has(lesson.id) && lesson.sections && (
                    <div style={{
                      borderTop: '1px solid #f1f5f9',
                      padding: '20px',
                    }}>
                      {/* 이론 섹션 */}
                      <div style={{
                        marginBottom: '15px',
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            이론
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.theory}
                        </p>
                      </div>

                      {/* 실습 섹션 */}
                      <div style={{
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.practice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Part 5: 음성 기반 인터랙션 */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                background: '#0ea5e9',
                color: 'white',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  🔊 Part 5: 음성 기반 인터랙션
                </h4>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  GPT-4o Realtime부터 보안 설정까지
                </p>
              </div>

              {course.lessons.slice(15).map((lesson: any, index: number) => (
                <div
                  key={lesson.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  {/* 챕터 헤더 */}
                  <div
                    onClick={() => toggleChapter(lesson.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 20px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      backgroundColor: '#0ea5e9',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {index + 16}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {lesson.title}
                      </h5>
                      <p style={{
                        color: '#64748b',
                        fontSize: '0.85rem',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Clock size={12} />
                        {lesson.duration}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {expandedChapters.has(lesson.id) ?
                        <ChevronDown size={18} color="#64748b" /> :
                        <ChevronRight size={18} color="#64748b" />
                      }
                    </div>
                  </div>

                  {/* 이론 & 실습 섹션 */}
                  {expandedChapters.has(lesson.id) && lesson.sections && (
                    <div style={{
                      borderTop: '1px solid #f1f5f9',
                      padding: '20px',
                    }}>
                      {/* 이론 섹션 */}
                      <div style={{
                        marginBottom: '15px',
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            이론
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.theory}
                        </p>
                      </div>

                      {/* 실습 섹션 */}
                      <div style={{
                        padding: '12px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#0ea5e9" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.practice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGPTAgentBeginnerPage;
