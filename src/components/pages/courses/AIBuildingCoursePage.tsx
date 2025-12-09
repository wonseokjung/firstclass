
import React, { useState, useEffect } from 'react';
import { Clock, ChevronDown, ChevronRight, BookOpen, Wrench, Image } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';
import { allCourses } from '../../../data/courseData';
import PaymentComponent from '../payment/PaymentComponent';

interface AIBuildingCoursePageProps {
  onBack: () => void;
}

const AIBuildingCoursePage: React.FC<AIBuildingCoursePageProps> = ({ onBack }) => {
  // const [isLoading, setIsLoading] = useState(false);
  const [, setIsLoggedIn] = useState(false);
  const [, setCheckingEnrollment] = useState(false);
  const [, setIsAlreadyEnrolled] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);


  const course = allCourses.find((c: any) => c.id === 999) || {
    id: 999,
    title: "AI 디지털 건물주 되기",
    lessons: [
      // 교훈 1: 입지 선정 (5강)
      {
        id: 1,
        title: "프롤로그: 맨해튼 부자 삼촌과 AI 멘토 제이",
        duration: "45분",
        hasQuiz: false,
        sections: {
          theory: "맨해튼 부동산 거물 삼촌의 교훈과 AI 시대 재해석",
          practice: "GOOGLE AI STUDIO 입문 – 웹서치 & 분석 도구 체험하기"
        }
      },
      {
        id: 2,
        title: "경제적 자유: 잠자는 동안에도 돈이 들어오는 구조 만들기",
        duration: "50분",
        hasQuiz: false,
        sections: {
          theory: "부동산 vs 콘텐츠, 경제적 자유의 새로운 정의",
          practice: "GOOGLE AI STUDIO 심화 – AI 기반 콘텐츠 아이디어 & 청사진 만들기"
        }
      },
      {
        id: 3,
        title: "당신의 AI 디지털건물에는 어떤 사람이 거주하고 있나?",
        duration: "55분",
        hasQuiz: false,
        sections: {
          theory: "세입자 선별의 기술, 글로벌 CPM과 수익성 분석",
          practice: "GOOGLE AI STUDIO 응용 – 타겟 고객 심층 분석 (나라·언어·연령·관심사·소득·플랫폼 분포)"
        }
      },
      {
        id: 4,
        title: "몇 층짜리 디지털 건물을 세울 것인가?",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "대중형/니치형/혼합형 건물 전략, 건물 콘셉트의 중요성",
          practice: "GOOGLE AI STUDIO 전략 – 대중형 vs 니치형 콘텐츠 시장 분석하기"
        }
      },
      {
        id: 5,
        title: "최종 입지 선정: AI CITY BUILDER에 건물 계획서 넣기",
        duration: "40분",
        hasQuiz: false,
        sections: {
          theory: "입지가 수익을 결정한다, 디지털 맨해튼 땅 계약의 원리",
          practice: "GOOGLE AI STUDIO 실행 – 나의 첫 디지털 건물 사업계획서 완성하기"
        }
      },

      // 교훈 2: AI 건축 자재 (4강)
      {
        id: 6,
        title: "[실습] 재료학 I (설계도): 텍스트 생성 AI",
        duration: "70분",
        hasQuiz: false,
        sections: {
          theory: "텍스트 생성 AI(ChatGPT, Claude, Gemini) 활용 원리, 프롬프트 엔지니어링",
          practice: "ChatGPT 프롬프트 100개 분석 (학습, 진로, 생활, 노트정리, 연구, 창의, 발표, 협업)"
        }
      },
      {
        id: 7,
        title: "[실습] 재료학 II (외장재): 이미지 생성 AI",
        duration: "65분",
        hasQuiz: false,
        sections: {
          theory: "인공지능 이미지 생성의 기본 원리, 이미지 생성 모델의 발전 역사와 활용 확장",
          practice: "Nano Banana 입문, ChatGPT 이미지 생성 입문 (기초/스타일/합성/시점/전문/아트편)"
        }
      },
      {
        id: 8,
        title: "[실습] 재료학 III (음향 시설): 사운드 생성 AI",
        duration: "55분",
        hasQuiz: false,
        sections: {
          theory: "인공지능 사운드 생성의 기본 원리, 사운드 생성 AI의 발전 역사",
          practice: "ElevenLabs로 내 목소리 학습시키기, Suno AI로 분위기에 맞는 BGM 만들기, 효과음·안내음성 생성"
        }
      },
      {
        id: 9,
        title: "[실습] 재료학 IV: 영상 생성 AI",
        duration: "75분",
        hasQuiz: false,
        sections: {
          theory: "인공지능 영상 생성의 기본 원리 (텍스트→영상 변환, 멀티모달 결합), 영상 생성 AI의 발전 과정",
          practice: "VEO 입문, 스토리 기반 영상 만들기, 완성형 콘텐츠 제작 (텍스트→이미지→사운드→영상)"
        }
      },

      // 교훈 3: 시공 및 완공 (3강)
      {
        id: 10,
        title: "[1층 상가 시공] AI를 활용한 바이럴 숏폼 제작",
        duration: "80분",
        hasQuiz: false,
        sections: {
          theory: "입지를 지배하는 상점의 법칙 (간판 설계, 목적이 이끄는 숏폼 제작)",
          practice: "AI 4단계 건축 워크플로우 (AI 설계→자재 수급→시공→멀티 플랫폼 동시 입점)"
        }
      },
      {
        id: 11,
        title: "[본 건물 시공] AI 기반 고품질 롱폼 제작",
        duration: "85분",
        hasQuiz: false,
        sections: {
          theory: "머물고 싶게 만드는 공간의 비밀 (Hook, AI 롱폼 건축법 4가지 공법)",
          practice: "80/20 AI 건축 워크플로우 체험 (AI 뼈대 세우기→인간의 영혼 불어넣기→하이브리드 제작)"
        }
      },
      {
        id: 12,
        title: "[준공식] 콘텐츠 업로드 및 초기 반응 분석",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "살아 숨 쉬는 건물을 만드는 데이터 관리술 (핵심 지표 읽는 법, AI 감성 분석)",
          practice: "데이터 기반 건물 리모델링 (CCTV 확인→AI 관리소장 보고→건물 개선 계획서 작성)"
        }
      },

      // 교훈 4: 첫 월세 받기 (4강)
      {
        id: 13,
        title: "수익 시스템 I (디지털 광고판): 애드센스 연동",
        duration: "50분",
        hasQuiz: false,
        sections: {
          theory: "자동화된 광고 임대 시스템, 애드센스의 원리",
          practice: "유튜브 파트너 프로그램(YPP) 가입 조건 확인 및 신청, 블로그에 구글 애드센스 코드 삽입"
        }
      },
      {
        id: 14,
        title: "수익 시스템 II (수수료 수익): 제휴 마케팅",
        duration: "55분",
        hasQuiz: false,
        sections: {
          theory: "신뢰 기반 컨시어지 서비스, 이커머스 & 제휴의 원리",
          practice: "쿠팡 파트너스 가입 및 추천 링크 생성, 유튜브 쇼핑 기능 연동"
        }
      },
      {
        id: 15,
        title: "수익 시스템 III (VIP 라운지): 멤버십 및 구독 모델",
        duration: "45분",
        hasQuiz: false,
        sections: {
          theory: "커뮤니티: 빅테크가 원하는 미래, VIP 라운지 운영의 원리",
          practice: "유튜브 채널 멤버십 기능 활성화 (Silver, Gold, VIP 등급 설계), 멤버 전용 비공개 커뮤니티 개설"
        }
      },
      {
        id: 16,
        title: "최종 단계 (사업화): 당신의 '디지털 세탁 공장'을 건설하라",
        duration: "70분",
        hasQuiz: false,
        sections: {
          theory: "허브-앤-스포크 시스템 구축, AI를 24시간 공장장으로 활용",
          practice: "온라인 비즈니스 본체 설계, 콘텐츠 채널 연결 시스템 구축, 다음 강의 예고"
        }
      }
    ]
  };

  const originalPrice = 95000;
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

        console.log('🔍 AI 건물 짓기 페이지 - 로그인 상태 체크:', {
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
                'ai-building-course'
              );

              console.log('💳 Azure 테이블 결제 상태 확인 결과:', paymentStatus);

              if (paymentStatus && paymentStatus.isPaid) {
                setIsPaidUser(true);
                console.log('✅ 결제 확인됨 - 강의 시청 페이지로 리다이렉트');
                // 결제된 사용자는 새로운 강의 시청 페이지로 리다이렉트
                setTimeout(() => {
                  window.location.href = '/ai-building-course-player';
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
    console.log('🔍 얼리버드 수강 신청 버튼 클릭 - 결제 페이지로 이동');
    console.log('🔍 현재 로그인 상태:', userInfo ? '로그인됨' : '로그인 안됨');
    
    // 세션 정보 재확인
    const sessionUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
    const isActuallyLoggedIn = !!sessionUserInfo;
    
    if (!isActuallyLoggedIn) {
      const confirmLogin = window.confirm('로그인이 필요한 서비스입니다. 먼저 로그인해주세요.\n\n로그인 페이지로 이동하시겠습니까?');
      if (confirmLogin) {
        window.location.href = '/login';
      }
      return;
    }
    
    // 결제 페이지로 이동 (ChatGPTAgentBeginner처럼 별도 결제 페이지 사용)
    console.log('✅ 결제 페이지로 이동:', '/ai-building-course/payment');
    window.location.href = '/ai-building-course/payment';
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
      window.location.href = '/ai-building-course-player';
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
        breadcrumbText="Step 1: AI 건물주 되기 기초"
      />

      {/* PaymentComponent 모달 - 페이지 최상단에 위치 */}
      {showPaymentModal && userInfo && (
        <PaymentComponent
          courseId="999"
          courseTitle="Step 1: AI 건물주 되기 기초 (얼리버드)"
          price={earlyBirdPrice}
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
            borderTop: '4px solid #1e40af',
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
          {/* 상단 메인 CTA */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b, #334155)',
            borderRadius: '30px',
            padding: '60px 40px',
            textAlign: 'center',
            marginBottom: '60px',
            color: 'white',
            boxShadow: '0 25px 60px rgba(30, 41, 59, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            border: '4px solid #fbbf24'
          }}>
            {/* 배경 장식 요소들 */}
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
              position: 'absolute',
              bottom: '-60px',
              left: '-60px',
              width: '200px',
              height: '200px',
              background: 'rgba(251, 191, 36, 0.1)',
              borderRadius: '50%',
              filter: 'blur(60px)'
            }}></div>
            {/* 메인 콘텐츠 */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* 강의 아이콘과 제목 */}
              <div style={{ marginBottom: '30px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '90px',
                  height: '90px',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  borderRadius: '50%',
                  marginBottom: '25px',
                  boxShadow: '0 15px 40px rgba(251, 191, 36, 0.5)',
                  border: '3px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <span style={{ fontSize: '3rem' }}>🏗️</span>
                </div>
                <h1 style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
                  marginBottom: '15px',
                  fontWeight: '900',
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  background: 'linear-gradient(45deg, #ffffff, #e0f2fe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Step 1: AI 건물주 되기 기초
                </h1>
                <h2 style={{
                  fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
                  marginBottom: '20px',
                  opacity: '0.95',
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  color: '#fbbf24'
                }}>
                  🎥 AI로 유튜브 채널 만들고 첫 월수익 100만원!
                </h2>
                <p style={{
                  fontSize: 'clamp(1.05rem, 2.2vw, 1.2rem)',
                  marginBottom: '30px',
                  opacity: '0.9',
                  fontWeight: '500',
                  lineHeight: '1.7'
                }}>
                  인공지능을 활용해 유튜브 채널을 완성하고 월 100만원을 벌 때까지
                </p>
              </div>


              {/* 가격 정보 - 개선된 디자인 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 'clamp(12px, 3vw, 20px)',
                padding: 'clamp(18px, 4vw, 30px)',
                marginBottom: 'clamp(25px, 5vw, 40px)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  fontSize: 'clamp(0.95rem, 3vw, 1.3rem)',
                  textDecoration: 'line-through',
                  marginBottom: '8px',
                  opacity: '0.8'
                }}>
                  ₩{originalPrice.toLocaleString()}
                </div>
                <div style={{
                  fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                  fontWeight: '900',
                  marginBottom: '12px',
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  background: 'linear-gradient(45deg, #ffffff, #fef3c7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  ₩{earlyBirdPrice.toLocaleString()}
                </div>
                <div style={{
                  fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
                  color: '#fbbf24',
                  fontWeight: '700',
                  marginBottom: '12px',
                  background: 'rgba(251, 191, 36, 0.2)',
                  padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
                  borderRadius: '25px',
                  display: 'inline-block',
                  border: '1px solid rgba(251, 191, 36, 0.3)'
                }}>
                  🔥 52% 할인 (얼리버드 특가)
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: '#fbbf24',
                  fontWeight: '700',
                  background: 'rgba(251, 191, 36, 0.15)',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '2px solid rgba(251, 191, 36, 0.5)',
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  📅 강의 오픈: 2026년 1월 1일
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  color: '#fbbf24',
                  fontWeight: '600',
                  background: 'rgba(251, 191, 36, 0.1)',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  display: 'inline-block'
                }}>
                  ⚠️ 강의 오픈 시 95,000원으로 인상 예정
                </div>
              </div>

              {/* 🚀 메인 수강 신청 버튼 (개선된 디자인) */}
              <div style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '20px'
              }}>
                {/* 버튼 글로우 효과 - 준비중 스타일 */}
                <div style={{
                  position: 'absolute',
                  inset: '-6px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706, #f59e0b)',
                  borderRadius: '30px',
                  opacity: '0.4',
                  animation: 'pulse 2s infinite',
                  filter: 'blur(12px)'
                }}></div>

                <button
                  onClick={handleEarlyBirdPayment}
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    padding: 'clamp(15px, 4vw, 30px) clamp(30px, 8vw, 70px)',
                    fontSize: 'clamp(1rem, 4vw, 1.8rem)',
                    fontWeight: '900',
                    borderRadius: 'clamp(15px, 4vw, 30px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: '1',
                    boxShadow: '0 15px 40px rgba(245, 158, 11, 0.3)',
                    textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(8px, 2vw, 15px)',
                    minWidth: 'auto',
                    width: '100%',
                    maxWidth: '400px',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(245, 158, 11, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(245, 158, 11, 0.3)';
                  }}
                >
                  <span style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>🔥</span>
                  얼리버드 수강 신청
                </button>
              </div>

              <p style={{
                fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
                opacity: '0.95',
                margin: '0',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                fontWeight: '600',
                color: '#fbbf24'
              }}>
                🎉 얼리버드 45,000원 | 📅 강의 오픈: 2026년 1월 1일
              </p>
            </div>

          </div>

          {/* 강의 소개 - CEOPage 스타일 적용 */}
          <div style={{ marginBottom: '80px' }}>
            {/* 메인 히어로 섹션 */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '80px 50px',
              borderRadius: '30px',
              marginBottom: '60px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 배경 장식 요소들 */}
              <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '300px',
                height: '300px',
                background: 'rgba(14, 165, 233, 0.1)',
                borderRadius: '50%',
                opacity: '0.3'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '-50px',
                left: '-50px',
                width: '200px',
                height: '200px',
                background: 'rgba(14, 165, 233, 0.05)',
                borderRadius: '50%',
                opacity: '0.4'
              }}></div>

              <div style={{ position: 'relative', zIndex: 2 }}>
                {/* 강의 아이콘 */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                  borderRadius: '50%',
                  marginBottom: '30px',
                  boxShadow: '0 20px 40px rgba(14, 165, 233, 0.3)'
                }}>
                  <span style={{ fontSize: '3rem' }}>🏗️</span>
                </div>

                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#1e293b',
                  padding: '10px 25px',
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  fontWeight: '900',
                  marginBottom: '20px',
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
                }}>
                  🔥 2025년 12월 말 오픈 예정
                </div>

                <h2 style={{
                  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                  fontWeight: '900',
                  color: '#1f2937',
                  marginBottom: '15px',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  Step 1: AI 건물주 되기 기초
                </h2>

                <p style={{
                  fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
                  color: '#1e40af',
                  fontWeight: '800',
                  marginBottom: '15px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                  🎥 AI로 유튜브 채널 만들고 첫 월수익 100만원 달성!
                </p>

                <p style={{
                  fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
                  color: '#64748b',
                  fontWeight: '600',
                  marginBottom: '30px'
                }}>
                  인공지능으로 유튜브 채널을 세우고 월 100만원을 벌 때까지
                </p>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '30px',
                  borderRadius: '20px',
                  maxWidth: '900px',
                  margin: '0 auto',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <p style={{
                    color: '#1f2937',
                    fontSize: '1.2rem',
                    lineHeight: '1.8',
                    margin: '0',
                    fontWeight: '500'
                  }}>
                    무작정 미국으로 건너온 외삼촌이 세탁소에서 시작해 맨해튼 부동산 거물이 된 실화.<br />
                    그가 가르쳐준 <strong style={{ color: '#1e40af' }}>'자산 구축의 4가지 원리'</strong>를 이제는 벽돌과 시멘트 대신<br />
                    <strong style={{ color: '#1e40af', fontSize: '1.15rem' }}>AI 유튜브 채널</strong>로 실현합니다.<br /><br />
                    <div style={{ 
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                      padding: '20px 30px',
                      borderRadius: '20px',
                      border: '3px solid #1e40af',
                      marginBottom: '20px'
                    }}>
                      <div style={{ 
                        fontSize: '1.4rem', 
                        fontWeight: '900', 
                        color: '#1e40af',
                        marginBottom: '10px'
                      }}>
                        🎯 강의 최종 목표
                      </div>
                      <div style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '700', 
                        color: '#1f2937',
                        lineHeight: '1.8'
                      }}>
                        ✅ AI로 유튜브 채널 완성<br />
                        ✅ 첫 월수익 100만원 달성
                      </div>
                    </div>
                    <br />
                    <span style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '700', 
                      color: '#1e40af',
                      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                      padding: '8px 18px',
                      borderRadius: '12px',
                      display: 'inline-block',
                      border: '2px solid #fbbf24'
                    }}>
                      💡 커리큘럼은 변경될 수 있습니다
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* 4가지 교훈 - CEOPage 스타일 적용 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              marginBottom: '60px'
            }}>
              {/* 교훈 1 */}
              <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                padding: '40px 30px',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  background: 'rgba(14, 165, 233, 0.1)',
                  borderRadius: '50%',
                  opacity: '0.5'
                }}></div>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                }}>🏗️</div>
                <h4 style={{
                  color: '#1e40af',
                  fontSize: '1.4rem',
                  marginBottom: '15px',
                  fontWeight: '800',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>교훈 1: 입지 선정</h4>
                <p style={{
                  color: '#64748b',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  fontWeight: '500'
                }}>수익성 높은 유튜브 채널 주제를 찾는 법</p>
              </div>

              {/* 교훈 2 */}
              <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                padding: '40px 30px',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  background: 'rgba(14, 165, 233, 0.1)',
                  borderRadius: '50%',
                  opacity: '0.5'
                }}></div>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                }}>🤖</div>
                <h4 style={{
                  color: '#1e40af',
                  fontSize: '1.4rem',
                  marginBottom: '15px',
                  fontWeight: '800',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>교훈 2: AI 건축 자재</h4>
                <p style={{
                  color: '#64748b',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  fontWeight: '500'
                }}>유튜브 콘텐츠를 AI로 자동 생성하는 법</p>
              </div>

              {/* 교훈 3 */}
              <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                padding: '40px 30px',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  background: 'rgba(14, 165, 233, 0.1)',
                  borderRadius: '50%',
                  opacity: '0.5'
                }}></div>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                }}>🏢</div>
                <h4 style={{
                  color: '#1e40af',
                  fontSize: '1.4rem',
                  marginBottom: '15px',
                  fontWeight: '800',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>교훈 3: 시공 및 완공</h4>
                <p style={{
                  color: '#64748b',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  fontWeight: '500'
                }}>AI로 유튜브 숏폼·롱폼 영상 제작 완성</p>
              </div>

              {/* 교훈 4 */}
              <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                padding: '40px 30px',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  background: 'rgba(14, 165, 233, 0.1)',
                  borderRadius: '50%',
                  opacity: '0.5'
                }}></div>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                }}>💰</div>
                <h4 style={{
                  color: '#1e40af',
                  fontSize: '1.4rem',
                  marginBottom: '15px',
                  fontWeight: '800',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>교훈 4: 첫 월수익 100만원</h4>
                <p style={{
                  color: '#64748b',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  fontWeight: '500'
                }}>유튜브에서 월 100만원 벌기까지의 전략</p>
              </div>
            </div>

            {/* 🖼️ 성공 여정 이미지 */}
            <div style={{
              background: '#ffffff',
              padding: '20px',
              borderRadius: '20px',
              marginBottom: '40px',
              border: '3px solid #fbbf24',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(251, 191, 36, 0.2)'
            }}>
              <img 
                src={`${process.env.PUBLIC_URL}/images/aicitybuilder/Gemini_Generated_Image_p27hetp27hetp27h.jpeg`}
                alt="AI 건물주 되기 성공 여정"
                style={{
                  width: '100%',
                  maxWidth: '1200px',
                  height: 'auto',
                  borderRadius: '15px',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </div>

            {/* 🔥 핵심 차별점 - 압도적 비주얼 */}
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              padding: '50px 40px',
              borderRadius: '25px',
              marginBottom: '40px',
              border: '3px solid #fbbf24',
              boxShadow: '0 15px 50px rgba(251, 191, 36, 0.2)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  padding: '10px 25px',
                  borderRadius: '30px',
                  marginBottom: '20px'
                }}>
                  <span style={{ color: '#000', fontWeight: '800', fontSize: '1rem' }}>
                    ⚡ 핵심 차별점
                  </span>
                </div>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '900',
                  marginBottom: '15px',
                  lineHeight: '1.4'
                }}>
                  콘텐츠를 "생성"하는 게 아닙니다.<br/>
                  <span style={{ color: '#fbbf24' }}>압도적으로 강한 주제를 "선택"</span>하는 겁니다.
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '1.1rem',
                  lineHeight: '1.7',
                  maxWidth: '700px',
                  margin: '0 auto'
                }}>
                  누구나 AI로 이미지를 만들 수 있습니다.<br/>
                  하지만 <strong style={{ color: '#fff' }}>"무엇을 만들어야 팔리는지"</strong> 아는 사람은 드뭅니다.<br/>
                  처음부터 비주얼적으로 강한 주제를 선택해야 수익화가 됩니다.
                </p>
              </div>

              {/* 예시 이미지 */}
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '4px solid #fbbf24',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
              }}>
                <img 
                  src="/images/step1/dog.jpeg"
                  alt="압도적인 비주얼 예시 - 센트럴파크 거대 강아지"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
                <div style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <span style={{ 
                    color: '#000', 
                    fontSize: '1.1rem', 
                    fontWeight: '800' 
                  }}>
                    🎨 이런 압도적인 비주얼을 AI로 만드는 법을 배웁니다
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 강의 차별화 포인트 */}
          <div style={{
            background: '#ffffff',
            padding: '50px',
            borderRadius: '25px',
            marginBottom: '60px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              학습 방식의 차이
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              <div style={{
                padding: '30px',
                background: '#fef2f2',
                borderRadius: '15px',
                border: '1px solid #fecaca'
              }}>
                <h4 style={{ color: '#dc2626', marginBottom: '15px', fontWeight: '600' }}>❌ 일반 AI 강의</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.8', margin: '0', paddingLeft: '20px' }}>
                  <li>이론만 배움</li>
                  <li>도구 사용법만</li>
                  <li>혼자 학습</li>
                  <li>단순 기능 설명</li>
                  <li>강의 완료 후 관계 끝</li>
                </ul>
              </div>
              <div style={{
                padding: '30px',
                background: '#f0fdf4',
                borderRadius: '15px',
                border: '1px solid #bbf7d0'
              }}>
                <h4 style={{ color: '#16a34a', marginBottom: '15px', fontWeight: '600' }}>✅ AI 건물주 되기</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.8', margin: '0', paddingLeft: '20px' }}>
                  <li>실제 수익 창출</li>
                  <li>비즈니스 전략까지</li>
                  <li>커뮤니티 + 멘토링</li>
                  <li>맨해튼 부동산 철학</li>
                  <li>지속적인 참여자 관계</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 🎯 강의 상세 정보 섹션 */}
          <div style={{
            background: '#ffffff',
            padding: '50px',
            borderRadius: '25px',
            marginBottom: '40px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              강의 상세 정보
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
              marginBottom: '40px'
            }}>
              {/* 강의 기본 정보 */}
              <div style={{
                background: '#f8fafc',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ color: '#1e40af', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>
                  📊 강의 기본 정보
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0',
                  color: '#1f2937',
                  lineHeight: '2'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>총 강의 시간:</strong> 16시간 (16강의)
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>난이도:</strong> 초급~중급 (AI 경험 불필요)
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>수강 기간:</strong> 구매 후 1년간
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>업데이트:</strong> 매월 새로운 AI 도구 추가
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>자료 제공:</strong> 100+ 프롬프트 템플릿
                  </li>
                </ul>
              </div>

              {/* 수강 대상 */}
              <div style={{
                background: '#f0fdf4',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #bbf7d0'
              }}>
                <h4 style={{ color: '#16a34a', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>
                  🎯 이런 분께 추천해요
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0',
                  color: '#1f2937',
                  lineHeight: '2'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    ✅ 부수입을 만들고 싶은 직장인
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    ✅ 경제적 자유를 꿈꾸는 모든 분
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    ✅ AI 도구에 관심 있는 초보자
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    ✅ 콘텐츠 창작에 도전하고 싶은 분
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    ✅ 디지털 마케팅을 배우고 싶은 분
                  </li>
                </ul>
              </div>

              {/* 학습 목표 */}
              <div style={{
                background: '#fef7ff',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #e9d5ff'
              }}>
                <h4 style={{ color: '#7c3aed', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>
                  🚀 학습 완료 후 여러분은
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0',
                  color: '#1f2937',
                  lineHeight: '2'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    💡 10가지 AI 도구를 자유자재로 활용
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    📈 첫 번째 디지털 수익 창출
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    🎬 바이럴 콘텐츠 제작 능력 획득
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    💰 4가지 수익 포트폴리오 구축
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    🏆 맨해튼 부동산 철학 체득
                  </li>
                </ul>
              </div>

              {/* 제공 혜택 */}
            </div>

            {/* 🎓 인공지능의 EBS - 왜 라이브가 필요한가 */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
              padding: '40px',
              borderRadius: '25px',
              marginBottom: '25px',
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
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  padding: '10px 25px',
                  borderRadius: '30px',
                  marginBottom: '25px'
                }}>
                  <span style={{ color: '#1e3a8a', fontWeight: '800', fontSize: '1rem' }}>
                    📺 인공지능의 EBS
                  </span>
                </div>
                
                <h4 style={{ 
                  color: 'white', 
                  fontSize: '1.8rem', 
                  fontWeight: '800', 
                  marginBottom: '20px',
                  lineHeight: '1.4'
                }}>
                  🤔 인공지능이 계속 업그레이드 되는데<br/>어떻게 해야 하나요?
                </h4>
                
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.95)', 
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  marginBottom: '25px'
                }}>
                  ChatGPT, Claude, Gemini... <strong style={{ color: '#fbbf24' }}>매주 새로운 기능</strong>이 쏟아집니다.<br/>
                  녹화 강의만으로는 <strong style={{ color: '#fbbf24' }}>최신 AI를 따라갈 수 없습니다.</strong><br/><br/>
                  그래서 준비했습니다! 👇
                </p>

                {/* 구성 설명 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '30px',
                  marginBottom: '25px',
                  border: '2px solid rgba(251, 191, 36, 0.3)'
                }}>
                  <h5 style={{ color: '#fbbf24', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px', textAlign: 'center' }}>
                    ✨ Step 1 구성
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px'
                  }}>
                    <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '15px' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📚</div>
                      <div style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem', marginBottom: '5px' }}>기본 코어 강의</div>
                      <div style={{ color: '#fbbf24', fontWeight: '800', fontSize: '1.5rem' }}>12개</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '5px' }}>영구 소장</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(251,191,36,0.15)', borderRadius: '15px', border: '2px solid rgba(251,191,36,0.4)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔴</div>
                      <div style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem', marginBottom: '5px' }}>주간 라이브</div>
                      <div style={{ color: '#fbbf24', fontWeight: '800', fontSize: '1.5rem' }}>52회/년</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '5px' }}>1년간 무제한 참여</div>
                    </div>
                  </div>
                </div>

                {/* 가성비 계산 */}
                <div style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  borderRadius: '20px',
                  padding: '25px 30px',
                  marginBottom: '20px'
                }}>
                  <h5 style={{ color: '#1e3a8a', fontSize: '1.2rem', fontWeight: '800', marginBottom: '15px', textAlign: 'center' }}>
                    💰 이 가격 실화? 가성비 계산
                  </h5>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '15px',
                    flexWrap: 'wrap',
                    marginBottom: '15px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#1e3a8a', fontSize: '0.9rem' }}>기본 강의 12개</div>
                      <div style={{ color: '#1e3a8a', fontWeight: '800', fontSize: '1.3rem' }}>+</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#1e3a8a', fontSize: '0.9rem' }}>라이브 52회</div>
                      <div style={{ color: '#1e3a8a', fontWeight: '800', fontSize: '1.3rem' }}>=</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#1e3a8a', fontSize: '0.9rem' }}>총 64개 콘텐츠</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', background: 'rgba(30, 58, 138, 0.15)', padding: '15px', borderRadius: '12px' }}>
                    <span style={{ color: '#1e3a8a', fontSize: '1rem' }}>45,000원 ÷ 64개 = </span>
                    <span style={{ color: '#dc2626', fontWeight: '900', fontSize: '1.8rem' }}>703원</span>
                    <span style={{ color: '#1e3a8a', fontSize: '1rem' }}>/개</span>
                    <div style={{ color: '#1e3a8a', fontSize: '0.9rem', marginTop: '8px', fontWeight: '600' }}>
                      ☕ 커피 반 잔 가격으로 전문 강의 1개!
                    </div>
                  </div>
                </div>
                
                {/* 라이브 혜택 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px'
                }}>
                  {['🎯 실시간 Q&A', '🔥 최신 AI 업데이트', '💻 라이브 코딩', '📁 다시보기 무제한'].map((item) => (
                    <div key={item} style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      padding: '14px 15px',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '0.9rem',
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

            {/* 강의 방식 */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#1e40af', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                강의 수강 방식
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>HD 동영상</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>기본 콘텐츠 5개</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>주간 라이브</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>매주 1회 진행</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>다시보기</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>아카이브 무제한</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>수강 기간</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>1년간 접근</div>
                </div>
              </div>
            </div>
          </div>



          {/* 언론 보도 섹션 */}
          <div style={{
            background: '#ffffff',
            padding: '60px 40px',
            borderRadius: '25px',
            marginBottom: '60px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h3 style={{
                fontSize: '2.2rem',
                fontWeight: '800',
                marginBottom: '16px',
                color: '#1f2937'
              }}>
                📰 언론이 주목한 실화
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0'
              }}>
                맨해튼 부동산 거물과 AI 스타트업 창업자의 실제 이야기
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '40px',
              marginBottom: '40px'
            }}>
              {/* 외삼촌 부동산 뉴스 */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                padding: '30px',
                borderRadius: '20px',
                border: '2px solid #1e40af',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  background: 'rgba(14, 165, 233, 0.1)',
                  borderRadius: '50%',
                  opacity: '0.5'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    background: '#1e40af',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    display: 'inline-block',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
                  }}>
                    🏢 부동산 뉴스
                  </div>
                  
                  <h4 style={{
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    marginBottom: '15px',
                    color: '#1f2937',
                    lineHeight: '1.3'
                  }}>
                    맨손으로 부동산 신화 6000만 달러의 사나이
                  </h4>
                  
                  <p style={{
                    fontSize: '1rem',
                    color: '#64748b',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}>
                    뉴욕에서 커뮤니티를 만들고 건물주들을 양성하는 외삼촌의 실화.
                    세탁소에서 시작해 맨해튼 부동산 거물이 된 그의 비밀을
                    AI 시대에 맞게 재해석한 강의입니다.
                  </p>
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '15px',
                    borderRadius: '12px',
                    border: '1px solid rgba(14, 165, 233, 0.2)'
                  }}>
                    <img
                      src="/images/unclebae.png"
                      alt="맨손으로 부동산 신화 6000만 달러의 사나이 뉴스"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div style="width: 100%; height: 200px; background: linear-gradient(135deg, #1e40af, #1e3a8a); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 700; color: white; border-radius: 8px;">🏢 부동산 뉴스</div>';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 제이 멘토 AI 스타트업 뉴스 */}
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                padding: '30px',
                borderRadius: '20px',
                border: '2px solid #16a34a',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  background: 'rgba(22, 163, 74, 0.1)',
                  borderRadius: '50%',
                  opacity: '0.5'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    background: '#16a34a',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    display: 'inline-block',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
                  }}>
                    🤖 AI 스타트업 뉴스
                  </div>
                  
                  <h4 style={{
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    marginBottom: '15px',
                    color: '#1f2937',
                    lineHeight: '1.3'
                  }}>
                    커넥젼에이아이 정원석 대표<br />
                    운동과 인공지능의 만남
                  </h4>
                  
                  <p style={{
                    fontSize: '1rem',
                    color: '#64748b',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}>
                    AI 전문가이자 기업가인 정원석 대표가 만든 커넥젼에이아이.
                    운동과 인공지능을 결합한 혁신적인 솔루션으로
                    AI 시대의 새로운 가능성을 제시합니다.
                  </p>
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '15px',
                    borderRadius: '12px',
                    border: '1px solid rgba(22, 163, 74, 0.2)'
                  }}>
                    <img
                      src="/images/jaystartup.png"
                      alt="커넥젼에이아이 정원석 대표 운동과 인공지능의 만남 뉴스"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div style="width: 100%; height: 200px; background: linear-gradient(135deg, #16a34a, #059669); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 700; color: white; border-radius: 8px;">🤖 AI 스타트업 뉴스</div>';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 언론 보도 요약 */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center',
              border: '1px solid #cbd5e1'
            }}>
              <h5 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                marginBottom: '15px',
                color: '#1f2937'
              }}>
                💡 이 두 이야기가 만나면?
              </h5>
              <p style={{
                fontSize: '1rem',
                color: '#64748b',
                lineHeight: '1.6',
                margin: '0',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                맨해튼 부동산 거물의 자산 구축 철학과 AI 전문가의 기술력이 결합되어
                <strong style={{ color: '#1e40af' }}> "AI 디지털 건물주 되기"</strong> 강의가 탄생했습니다.
                이제 여러분도 이 두 분의 경험과 지식을 바탕으로
                나만의 디지털 자산을 구축할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 멘토 소개 섹션 - CEOPage 스타일 적용 */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            padding: '80px 50px',
            borderRadius: '30px',
            marginBottom: '60px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* 배경 장식 요소들 */}
            <div style={{
              position: 'absolute',
              top: '-100px',
              left: '-100px',
              width: '300px',
              height: '300px',
              background: 'rgba(14, 165, 233, 0.1)',
              borderRadius: '50%',
              opacity: '0.3'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'rgba(14, 165, 233, 0.05)',
              borderRadius: '50%',
              opacity: '0.4'
            }}></div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: '900',
                textAlign: 'center',
                marginBottom: '60px',
                color: '#1f2937',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                대표 멘토 - 정원석 (Jay)
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '60px',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                {/* 멘토 이미지 섹션 */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '280px',
                    height: '280px',
                    margin: '0 auto 30px auto',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                    padding: '4px',
                    boxShadow: '0 20px 50px rgba(14, 165, 233, 0.3)'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: 'white'
                    }}>
                      <img
                        src="/images/jaymentor.PNG"
                        alt="정원석 (Jay) 멘토"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #1e40af, #1e3a8a); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; color: white;">정원석</div>';
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* 멘토 배지들 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    flexWrap: 'wrap',
                    marginBottom: '30px'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                    }}>
                      <span>🏆</span>
                      AI 전문가
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                    }}>
                      <span>🏢</span>
                      기업가
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                    }}>
                      <span>🎓</span>
                      교수
                    </div>
                  </div>
                </div>

                {/* 멘토 정보 섹션 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '40px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    marginBottom: '15px',
                    color: '#1f2937',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}>
                    정원석 (Jay)
                  </h3>
                  <p style={{
                    fontSize: '1.2rem',
                    marginBottom: '30px',
                    color: '#1e40af',
                    fontWeight: '600'
                  }}>
                    AI City Builders 대표 멘토
                  </p>

                  {/* 학력 정보 */}
                  <div style={{ marginBottom: '30px' }}>
                    <h5 style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      marginBottom: '15px',
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>🎓</span>
                      학력
                    </h5>
                    <div style={{
                      background: 'rgba(14, 165, 233, 0.05)',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(14, 165, 233, 0.1)'
                    }}>
                      <ul style={{
                        listStyle: 'none',
                        padding: '0',
                        margin: '0',
                        lineHeight: '1.8',
                        color: '#64748b'
                      }}>
                        <li style={{ marginBottom: '8px', fontWeight: '500' }}>• 일리노이 공과대학교 (Illinois Institute of Technology) 데이터과학 석사</li>
                        <li style={{ fontWeight: '500' }}>• 뉴욕시립대 바루크 컬리지 (City University of New York - Baruch College) 데이터과학 학사</li>
                      </ul>
                    </div>
                  </div>

                  {/* 현재 활동 */}
                  <div style={{ marginBottom: '30px' }}>
                    <h5 style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      marginBottom: '15px',
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>💼</span>
                      현재 활동
                    </h5>
                    <div style={{
                      background: 'rgba(14, 165, 233, 0.05)',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(14, 165, 233, 0.1)'
                    }}>
                      <ul style={{
                        listStyle: 'none',
                        padding: '0',
                        margin: '0',
                        lineHeight: '1.8',
                        color: '#64748b'
                      }}>
                        <li style={{ marginBottom: '8px', fontWeight: '500' }}>• 커넥젼에이아이 대표 (AI 솔루션 개발 및 컨설팅)</li>
                        <li style={{ marginBottom: '8px', fontWeight: '500' }}>• 서울사이버대학교 대우교수 (공과대학 인공지능 전공)</li>
                        <li style={{ marginBottom: '8px', fontWeight: '500' }}>• Connect AI LAB 유튜브 채널 운영</li>
                        <li style={{ fontWeight: '500' }}>• aimentorjay 인스타그램 30만 팔로워</li>
                      </ul>
                    </div>
                  </div>

                  {/* 주요 성과 */}
                  <div style={{ marginBottom: '30px' }}>
                    <h5 style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      marginBottom: '15px',
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>🏆</span>
                      주요 성과
                    </h5>
                    <div style={{
                      background: 'rgba(14, 165, 233, 0.05)',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(14, 165, 233, 0.1)'
                    }}>
                      <ul style={{
                        listStyle: 'none',
                        padding: '0',
                        margin: '0',
                        lineHeight: '1.8',
                        color: '#64748b'
                      }}>
                        <li style={{ marginBottom: '8px', fontWeight: '500' }}>• 메타 아시아 지역 글로벌 리더 선정 (2022, 4인 중 1명)</li>
                        <li style={{ marginBottom: '8px', fontWeight: '500' }}>• 뤼튼 해커톤 1위 수상 (AI 해킹 방어 툴 개발)</li>
                        <li style={{ marginBottom: '8px', fontWeight: '500' }}>• AI 헬스케어 스타트업 옵트버스 설립 (50억원 기업가치)</li>
                        <li style={{ marginBottom: '8px', fontWeight: '500' }}>• 모두의연구소 인공지능 선임연구원 (200명 이상 AI 연구원 양성)</li>
                        <li style={{ fontWeight: '500' }}>• Best Poster Award 수상 (강화학습 연구)</li>
                      </ul>
                    </div>
                  </div>

                  {/* 멘토 메시지 */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.05))',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '1px solid rgba(14, 165, 233, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      fontSize: '3rem',
                      color: 'rgba(14, 165, 233, 0.1)',
                      fontFamily: 'serif'
                    }}>"</div>
                    <p style={{
                      fontSize: '1.1rem',
                      lineHeight: '1.7',
                      color: '#1f2937',
                      margin: '0',
                      fontWeight: '500',
                      fontStyle: 'italic'
                    }}>
                      <strong style={{ color: '#1e40af' }}>"저는 단순히 AI 도구 사용법을 가르치지 않습니다."</strong><br />
                      15년간의 실전 경험과 맨해튼에서 배운 부동산 투자 철학을 AI 시대에 맞게 재해석하여,
                      진정한 '디지털 자산'을 구축하는 방법을 알려드립니다. 함께 AI 도시를 만들어갑시다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ 섹션 */}
          <div style={{
            background: '#ffffff',
            padding: '50px',
            borderRadius: '25px',
            marginBottom: '40px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              자주 묻는 질문
            </h3>

            <div style={{
              display: 'grid',
              gap: '20px'
            }}>
              {/* FAQ 1 */}
              <div style={{
                background: '#f8fafc',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{
                  color: '#1e40af',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  marginBottom: '10px'
                }}>
                  Q. AI 경험이 전혀 없어도 따라할 수 있나요?
                </h4>
                <p style={{
                  color: '#1f2937',
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  A. 네! 이 강의는 "컴맹도 OK"를 모토로 설계되었습니다.
                  마우스 클릭부터 시작해서 단계별로 친절하게 알려드리므로,
                  AI를 처음 접하시는 분도 쉽게 따라하실 수 있습니다.
                </p>
              </div>

              {/* FAQ 4 */}
              <div style={{
                background: '#fffbeb',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #fed7aa'
              }}>
                <h4 style={{
                  color: '#d97706',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  marginBottom: '10px'
                }}>
                  Q. 수강료 외에 추가 비용이 발생하나요?
                </h4>
                <p style={{
                  color: '#1f2937',
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  A. 기본적으로는 추가 비용이 없습니다. 강의에서 사용하는 AI 도구들의
                  무료 버전으로도 충분히 학습하고 수익 창출이 가능합니다.
                  더 고급 기능이 필요한 경우에만 선택적으로 유료 플랜을 이용하시면 됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* 커리큘럼 - 가운데 배치 */}
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '25px',
            padding: '50px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '2rem',
              fontWeight: '800',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              📚 커리큘럼
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '1.2rem',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              총 16강의 · 약 16시간 · 4가지 교훈
            </p>

            {/* 교훈 1: 입지 선정 */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                background: '#1e40af',
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
                  교훈 1: 입지 선정
                </h4>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  디지털 맨해튼에서 수익성 높은 땅을 찾는 법
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
                      backgroundColor: '#1e40af',
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
                        background: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #1e40af'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#1e40af" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#1e40af'
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
                        background: '#1e40af',
                        borderRadius: '8px',
                        border: '1px solid #1e40af'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#ffffff" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#ffffff'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#ffffff',
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

            {/* 교훈 2: AI 건축 자재 */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                background: '#1e40af',
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
                  교훈 2: AI 건축 자재
                </h4>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  텍스트, 이미지, 사운드, 영상 AI 도구 완전 정복
                </p>

                {/* 🖼️ AI 도구 생태계 맵 */}
                <div style={{
                  background: '#ffffff',
                  border: '2px dashed #1e40af',
                  borderRadius: '12px',
                  padding: '25px',
                  margin: '15px 0'
                }}>
                  <h5 style={{
                    color: '#1f2937',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '15px',
                    textAlign: 'center'
                  }}>
                    AI 도구들의 연결 관계도
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ textAlign: 'center', padding: '10px', background: '#f0f9ff', borderRadius: '8px' }}>
                      <Image size={24} color="#1e40af" style={{ marginBottom: '5px' }} />
                      <div style={{ fontSize: '0.8rem', color: '#1f2937', fontWeight: '600' }}>ChatGPT</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>텍스트 → 아이디어</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '10px', background: '#f0f9ff', borderRadius: '8px' }}>
                      <Image size={24} color="#1e40af" style={{ marginBottom: '5px' }} />
                      <div style={{ fontSize: '0.8rem', color: '#1f2937', fontWeight: '600' }}>VEO</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>영상 → 숏폼/롱폼</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '10px', background: '#f0f9ff', borderRadius: '8px' }}>
                      <Image size={24} color="#1e40af" style={{ marginBottom: '5px' }} />
                      <div style={{ fontSize: '0.8rem', color: '#1f2937', fontWeight: '600' }}>ElevenLabs</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>음성 → 나레이션</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '10px', background: '#f0f9ff', borderRadius: '8px' }}>
                      <Image size={24} color="#1e40af" style={{ marginBottom: '5px' }} />
                      <div style={{ fontSize: '0.8rem', color: '#1f2937', fontWeight: '600' }}>Suno</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>음악 → 배경음악</div>
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    padding: '10px',
                    background: '#1e40af',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    → 하나의 "디지털 건물" 완성
                  </div>
                </div>
              </div>

              {course.lessons.slice(5, 9).map((lesson: any, index: number) => (
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
                      backgroundColor: '#1e40af',
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
                      {index + 6}
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
                        background: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #1e40af'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#1e40af" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#1e40af'
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
                        background: '#1e40af',
                        borderRadius: '8px',
                        border: '1px solid #1e40af'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#ffffff" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#ffffff'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#ffffff',
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

            {/* 교훈 3: 시공 및 완공 */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                background: '#1e40af',
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
                  교훈 3: 시공 및 완공
                </h4>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  숏폼과 롱폼으로 실제 건물을 세상에 공개
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
                      backgroundColor: '#1e40af',
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
                        background: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #1e40af'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#1e40af" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#1e40af'
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
                        background: '#1e40af',
                        borderRadius: '8px',
                        border: '1px solid #1e40af'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#ffffff" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#ffffff'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#ffffff',
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

            {/* 교훈 4: 첫 월세 받기 */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                background: '#1e40af',
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
                  교훈 4: 첫 월세 받기
                </h4>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  4가지 수익원으로 안정적인 포트폴리오 구축
                </p>

                {/* 🖼️ 수익 포트폴리오 차트 */}
                <div style={{
                  background: '#ffffff',
                  border: '2px dashed #1e40af',
                  borderRadius: '12px',
                  padding: '25px',
                  margin: '15px 0'
                }}>
                  <h5 style={{
                    color: '#1f2937',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '15px',
                    textAlign: 'center'
                  }}>
                    4가지 수익원 파이차트
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '15px'
                  }}>
                    <div style={{
                      textAlign: 'center',
                      padding: '15px',
                      background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                      borderRadius: '10px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '5px' }}>35%</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>애드센스</div>
                    </div>
                    <div style={{
                      textAlign: 'center',
                      padding: '15px',
                      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                      borderRadius: '10px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '5px' }}>30%</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>제휴마케팅</div>
                    </div>
                    <div style={{
                      textAlign: 'center',
                      padding: '15px',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      borderRadius: '10px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '5px' }}>25%</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>멤버십</div>
                    </div>
                    <div style={{
                      textAlign: 'center',
                      padding: '15px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      borderRadius: '10px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '5px' }}>10%</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>디지털 상품</div>
                    </div>
                  </div>
                  <div style={{
                    marginTop: '15px',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: '#64748b'
                  }}>
                    💡 각 영역을 클릭하면 상세 설명이 표시됩니다
                  </div>
                </div>
              </div>

              {course.lessons.slice(12).map((lesson: any, index: number) => (
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
                      backgroundColor: '#1e40af',
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
                        background: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #1e40af'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#1e40af" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#1e40af'
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
                        background: '#1e40af',
                        borderRadius: '8px',
                        border: '1px solid #1e40af'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#ffffff" />
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#ffffff'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#ffffff',
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

export default AIBuildingCoursePage;

