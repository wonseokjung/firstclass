import React, { useState, useEffect } from 'react';
import { Clock, Play, ChevronDown, ChevronRight, BookOpen, Wrench, Image } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';
import { allCourses } from '../../../data/courseData';
import PaymentComponent from '../payment/PaymentComponent';

interface ChatGPTAgentBeginnerPageProps {
  onBack: () => void;
}

const ChatGPTAgentBeginnerPage: React.FC<ChatGPTAgentBeginnerPageProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const course = {
    id: 1002,
    title: "ChatGPT AI AGENT 비기너편",
    lessons: [
      // Part 0: 준비 - AI 에이전트 만들기 입문 준비 (3강)
      {
        id: 1,
        title: "AgentKit이란? ChatGPT와의 차이",
        duration: "30분",
        hasQuiz: false,
        sections: {
          theory: "AgentKit 소개, ChatGPT와의 차이점 이해",
          practice: "Builder 소개, UI 살펴보기 → Agent 구조 시각 이해"
        }
      },
      {
        id: 2,
        title: "AI 에이전트란 무엇인가?",
        duration: "25분",
        hasQuiz: false,
        sections: {
          theory: "에이전트란 무엇인가? 초등학생도 이해할 수 있는 가장 쉬운 개념 설명",
          practice: "AI 에이전트의 기본 개념 이해하기"
        }
      },
      {
        id: 3,
        title: "OpenAI 계정 만들기 & 첫 AI 에이전트 체험",
        duration: "35분",
        hasQuiz: false,
        sections: {
          theory: "OpenAI API 계정 생성 및 크레딧 관리",
          practice: "계정 생성 + 키 발급 → 첫 번째 AI 에이전트 체험"
        }
      },

      // Part 1: 나만의 AI 에이전트 만들기 - 기초 구조 구축 (3강)
      {
        id: 4,
        title: "Agent Builder 기본 구조",
        duration: "45분",
        hasQuiz: false,
        sections: {
          theory: "ChatGPT Agent Builder 홈 화면 완전정복",
          practice: "3단계로 나만의 AI 만들기 (Start - Agent - End)"
        }
      },
      {
        id: 5,
        title: "AI의 성격 만들기",
        duration: "40분",
        hasQuiz: false,
        sections: {
          theory: "AI에게 역할과 명령을 주는 방법 (Agent 노드 설정)",
          practice: "'너는 일정 관리 도우미야' 설정 → 톤이 있는 에이전트 완성"
        }
      },
      {
        id: 6,
        title: "File Search로 내 일정 문서 읽기",
        duration: "50분",
        hasQuiz: false,
        sections: {
          theory: "실제 예시: 유튜브 스크립트를 작성하는 나만의 AI 만들기",
          practice: "PDF 업로드 → 요약 → '일정 요약' 가능한 AI 에이전트"
        }
      },

      // Part 2: 일상 & 업무 자동화 (3강)
      {
        id: 7,
        title: "File Search + Transform 노드",
        duration: "55분",
        hasQuiz: false,
        sections: {
          theory: "파일 분석과 데이터 변환 워크플로",
          practice: "'회의록 요약' → '이메일 초안 생성' → 자동화 워크플로"
        }
      },
      {
        id: 8,
        title: "Human Approval",
        duration: "45분",
        hasQuiz: false,
        sections: {
          theory: "사람의 승인을 통한 안전한 자동화",
          practice: "'보내기 전 나에게 승인받기' → 안전한 자동화 프로세스"
        }
      },
      {
        id: 9,
        title: "Logic Node 활용",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "조건부 로직과 분기 처리",
          practice: "요청에 따라 '요약' vs '메일작성' 분기 → 다기능 업무형 에이전트"
        }
      },

      // Part 3: 내 웹사이트에 배포하기 (3강)
      {
        id: 10,
        title: "ChatKit으로 챗봇 퍼블리시",
        duration: "50분",
        hasQuiz: false,
        sections: {
          theory: "웹 배포를 위한 ChatKit 설정",
          practice: "Workflow ID 복사 → HTML에 삽입 → 웹에 AI 챗봇 노출"
        }
      },
      {
        id: 11,
        title: "디자인 커스터마이징",
        duration: "45분",
        hasQuiz: false,
        sections: {
          theory: "UI/UX 커스터마이징과 브랜딩",
          practice: "색상 / 버튼 / 캐릭터 설정 → 나만의 브랜드형 챗봇"
        }
      },
      {
        id: 12,
        title: "블로그·티스토리·Notion에 붙이기",
        duration: "55분",
        hasQuiz: false,
        sections: {
          theory: "다양한 플랫폼에 챗봇 임베드하기",
          practice: "실제 배포 실습 → 작동하는 웹 챗봇 완성"
        }
      },

      // Part 4: 콘텐츠 제작형 AI (3강)
      {
        id: 13,
        title: "Input Node로 구조화된 입력받기",
        duration: "50분",
        hasQuiz: false,
        sections: {
          theory: "구조화된 입력 처리와 데이터 포맷팅",
          practice: "'주제, 톤, 길이' 입력창 만들기 → 사용자 맞춤 스크립트 생성기"
        }
      },
      {
        id: 14,
        title: "Evals & Prompt Optimizer 실습",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "AI 성능 평가와 프롬프트 최적화",
          practice: "결과물 평가 + 개선 → 스스로 배우는 AI 작가"
        }
      },
      {
        id: 15,
        title: "자동화 루프 만들기",
        duration: "65분",
        hasQuiz: false,
        sections: {
          theory: "반복 작업과 루프 처리",
          practice: "주제 입력 → 영상 3분 스크립트 완성 → 영상 크리에이터용 AI 완성"
        }
      },

      // Part 5: 음성 기반 인터랙션 (3강)
      {
        id: 16,
        title: "GPT-4o Realtime 연결",
        duration: "55분",
        hasQuiz: false,
        sections: {
          theory: "실시간 음성 처리와 GPT-4o 연동",
          practice: "내 마이크로 AI와 대화 → 음성 대화형 비서"
        }
      },
      {
        id: 17,
        title: "감정 인식 테스트",
        duration: "45분",
        hasQuiz: false,
        sections: {
          theory: "음성 감정 분석과 응답 조정",
          practice: "기쁨/피로한 톤 감지 시연 → 공감형 AI"
        }
      },
      {
        id: 18,
        title: "보안 설정 & 프롬프트 인젝션 방어",
        duration: "50분",
        hasQuiz: false,
        sections: {
          theory: "AI 보안과 프롬프트 인젝션 방어",
          practice: "Guardrails 노드 실습 → 안전한 대화형 AI 완성"
        }
      }
    ]
  };

  const originalPrice = 99000;
  const earlyBirdPrice = 45000;

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
    console.log('🔍 수강 신청 버튼 클릭 - 결제 모달 열기');
    
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다. 먼저 로그인해주세요.');
      return;
    }
    
    setShowPaymentModal(true);
  };

  const handleLoginRequired = () => {
    alert('로그인이 필요한 서비스입니다.');
  };

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

      {/* PaymentComponent 모달 - 페이지 최상단에 위치 */}
      {showPaymentModal && userInfo && (
        <PaymentComponent
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
          {/* 상단 메인 CTA - 깔끔한 디자인 */}
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            borderRadius: '20px',
            padding: '50px 40px',
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
                🔥 55% 할인 (얼리버드 특가)
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
                ⚠️ 2025년 3월 1일부터 9만9천원 이상으로 인상 예정
              </div>
            </div>

            {/* 메인 수강 신청 버튼 - 깔끔한 디자인 */}
            <div style={{
              position: 'relative',
              display: 'inline-block',
              marginBottom: '20px'
            }}>
              <button
                onClick={handleEarlyBirdPayment}
                style={{
                  background: '#ffffff',
                  color: '#0ea5e9',
                  border: 'none',
                  padding: '20px 50px',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  minWidth: '280px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🚀</span>
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

          {/* 멘토 소개 - Jay 멘토 이력 */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{
              background: '#ffffff',
              padding: '50px 40px',
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
                  🎓 학력 인증
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
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

            {/* 5가지 핵심 프로젝트 - 깔끔한 디자인 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              {/* Part 0: 준비 */}
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
                }}>🔰</div>
                <h4 style={{
                  color: '#0ea5e9',
                  fontSize: '1.1rem',
                  marginBottom: '8px',
                  fontWeight: '700'
                }}>Part 0: 준비</h4>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  fontWeight: '500'
                }}>AI 에이전트 만들기 입문 준비 (3강)</p>
              </div>

              {/* Part 1: AI 에이전트 */}
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
                }}>🧠</div>
                <h4 style={{
                  color: '#0ea5e9',
                  fontSize: '1.1rem',
                  marginBottom: '8px',
                  fontWeight: '700'
                }}>Part 1: AI 에이전트</h4>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  fontWeight: '500'
                }}>나만의 AI 에이전트 만들기 (3강)</p>
              </div>

              {/* Part 2: 업무 자동화 */}
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

          {/* 커리큘럼 - 깔끔한 디자인 */}
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e2e8f0'
          }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '1.8rem',
              fontWeight: '800',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              📚 커리큘럼
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '1.1rem',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              총 18강의 · 약 15시간 · 5가지 프로젝트
            </p>

            {/* Part 0: 준비 - AI 에이전트 만들기 입문 준비 */}
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
                  🔰 Part 0: 준비 - AI 에이전트 만들기 입문 준비
                </h4>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  AgentKit 소개부터 첫 번째 AI 응답 경험까지
                </p>
              </div>

              {course.lessons.slice(0, 3).map((lesson: any, index: number) => (
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
                      {index + 1}
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

            {/* Part 1: 나만의 AI 에이전트 만들기 - 기초 구조 구축 */}
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
                  🧠 Part 1: 나만의 AI 에이전트 만들기 - 기초 구조 구축
                </h4>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  Agent Builder 기본 구조부터 파일 검색까지
                </p>
              </div>

              {course.lessons.slice(3, 6).map((lesson: any, index: number) => (
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

            {/* Part 2: 일상 & 업무 자동화 */}
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
                  💼 Part 2: 일상 & 업무 자동화
                </h4>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  파일 분석부터 안전한 자동화 프로세스까지
                </p>
              </div>

              {course.lessons.slice(6, 9).map((lesson: any, index: number) => (
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
