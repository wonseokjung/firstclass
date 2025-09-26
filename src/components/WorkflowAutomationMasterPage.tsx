import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Calendar, CheckCircle, Play } from 'lucide-react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { premiumCourse } from '../data/courseData';
import AzureTableService from '../services/azureTableService';
import NavigationBar from './NavigationBar';
import { getPaymentConfig } from '../config/payment';

// SEO 메타 태그 업데이트 함수
const updateCourseMetaTags = () => {
  // 페이지 제목 업데이트
  document.title = '🏗️ 강의 1: AI 건물 짓기 - 수익형 디지털 건물 완성하기 | AI City Builders';
  
  // 메타 description 업데이트
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', 'AI로 월세 받는 나의 첫 수익형 디지털 건물 짓기! 유튜브 채널 완성부터 애드센스 수익까지 14강의 완전 가이드');
  }
  
  // Open Graph 태그 업데이트
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', '🏗️ 강의 1: AI 건물 짓기 - 수익형 디지털 건물 완성하기');
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', 'AI 멘토 제이와 함께 나만의 첫 번째 수익형 디지털 건물을 완성하세요! 입지 선정부터 첫 월세 받기까지 체계적인 4단계 과정');
  }
};

interface WorkflowAutomationMasterPageProps {
  onBack: () => void;
}

const WorkflowAutomationMasterPage: React.FC<WorkflowAutomationMasterPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tossPayments, setTossPayments] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  // timeLeft state 제거 (현재 수강 가능하므로 불필요)

  // 토스페이먼츠 설정 불러오기
  const { clientKey } = getPaymentConfig();

  // AI 건물 짓기 - 디지털 건축가 과정 강의 데이터
  const course = {
    ...premiumCourse,
    title: '강의 1: AI 건물 짓기 - 디지털 건축가 과정',
    lessons: [
      // PART 1: 입지 선정 - 건물을 세울 '디지털 맨해튼 땅'을 찾아라
      {
        id: 1,
        title: 'Chapter 1. 아키텍트의 선언: 왜 "시스템"을 설계해야 하는가?',
        duration: '45분',
        description: '단순한 콘텐츠 제작자가 아닌, 수익을 창출하는 디지털 건물주가 되기 위한 마인드셋과 시스템 설계 철학을 배웁니다.',
        hasQuiz: true
      },
      {
        id: 2,
        title: 'Chapter 2. [실습] 상권 분석 드론: AI Studio 딥 리서치',
        duration: '60분',
        description: 'AI를 활용해 수익성 높은 틈새 시장을 발굴하고, 타겟 고객층의 니즈를 정확히 파악하는 실전 리서치 기법',
        hasQuiz: true
      },
      {
        id: 3,
        title: 'Chapter 3. 건축 허가 신청: AI 비즈니스 모델 캔버스 작성',
        duration: '50분',
        description: '나만의 수익형 콘텐츠 채널을 위한 비즈니스 모델을 설계하고, 수익화 전략을 구체화합니다.',
        hasQuiz: true
      },
      
      // PART 2: 설계 및 재료 확보 - 최고의 건축 자재를 확보하라
      {
        id: 4,
        title: 'Chapter 4. [실습] 재료학 I: 텍스트 (설계도 & 골조)',
        duration: '55분',
        description: 'ChatGPT, Claude를 활용한 매력적인 스크립트, 제목, 설명 작성. 콘텐츠의 뼈대가 되는 텍스트 제작 마스터',
        hasQuiz: true
      },
      {
        id: 5,
        title: 'Chapter 5. [실습] 재료학 II: 이미지 (내/외장재 & 디자인)',
        duration: '60분',
        description: 'Midjourney, Canva를 활용한 썸네일, 로고, 브랜딩 이미지 제작. 시각적 매력도를 극대화하는 디자인 실습',
        hasQuiz: true
      },
      {
        id: 6,
        title: 'Chapter 6. [실습] 재료학 III: 사운드 (음향 시설 & 분위기)',
        duration: '50분',
        description: 'ElevenLabs 음성 생성과 배경음악 활용법. 청취자를 몰입시키는 오디오 콘텐츠 제작 기법',
        hasQuiz: true
      },
      {
        id: 7,
        title: 'Chapter 7. [실습] 재료학 IV: 영상 (창문 & 미디어 파사드)',
        duration: '70분',
        description: 'Runway, CapCut을 활용한 고품질 영상 제작. 바이럴 영상의 비밀과 편집 노하우 완전 정복',
        hasQuiz: true
      },
      
      // PART 3: 시공 및 완공 - 당신의 첫 건물을 세상에 공개하라
      {
        id: 8,
        title: 'Chapter 8. [실습] 1층 상가 시공: Veo를 활용한 바이럴 숏폼 제작',
        duration: '65분',
        description: '유튜브 쇼츠, 틱톡용 바이럴 영상 제작. 짧은 시간에 강력한 임팩트를 주는 숏폼 콘텐츠 전략',
        hasQuiz: true
      },
      {
        id: 9,
        title: 'Chapter 9. [실습] 본 건물 시공: AI 기반 고품질 롱폼 제작',
        duration: '75분',
        description: '메인 유튜브 채널용 롱폼 콘텐츠 제작. 구독자와 깊이 있는 관계를 만드는 고품질 영상 제작법',
        hasQuiz: true
      },
      {
        id: 10,
        title: 'Chapter 10. 준공식(Launch): 유튜브 채널에 콘텐츠 업로드 및 초기 반응 분석',
        duration: '55분',
        description: '완성된 콘텐츠의 전략적 업로드와 초기 성과 분석. 런칭 후 최적화 전략까지 완벽 가이드',
        hasQuiz: true
      },
      
      // PART 4: 첫 월세 받기 - 건물에서 첫 수익을 창출하라
      {
        id: 11,
        title: 'Chapter 11. 수익형 인테리어 철학: 가치 제안과 가격 책정',
        duration: '50분',
        description: '콘텐츠로 수익을 창출하는 핵심 원리와 가격 책정 전략. 가치 있는 콘텐츠로 수익화하는 철학',
        hasQuiz: true
      },
      {
        id: 12,
        title: 'Chapter 12. [실습] 인테리어 I: 디지털 광고판 설치 (애드센스 연동)',
        duration: '60분',
        description: '유튜브 애드센스 설정부터 수익 최적화까지. 첫 광고 수익을 만드는 완전한 가이드',
        hasQuiz: true
      },
      {
        id: 13,
        title: 'Chapter 13. [실습] 인테리어 II: 플래그십 스토어 입점 (유튜브 쇼핑)',
        duration: '55분',
        description: '유튜브 쇼핑 기능 활용과 제품 판매 연동. 콘텐츠를 통한 직접 판매 수익 창출 전략',
        hasQuiz: true
      },
      
      // 최종 프로젝트 & 멘토링
      {
        id: 14,
        title: '[최종 프로젝트] 나의 첫 "수익형 디지털 건물" 준공 완료',
        duration: '30분',
        description: '수익 연동된 유튜브 채널 완성과 첫 수익 달성 인증. 디지털 건물주로서의 첫 걸음을 완성합니다.',
        hasQuiz: false
      }
    ]
  };
  const originalPrice = 349000;
  const earlyBirdPrice = 199000;
  const discount = Math.round(((originalPrice - earlyBirdPrice) / originalPrice) * 100);

  // 현재 수강 가능한 상태로 변경

  useEffect(() => {
    // 페이지 로드 시 SEO 메타 태그 업데이트
    updateCourseMetaTags();
    
    // sessionStorage에서 로그인 상태 확인
    const checkLoginStatus = async () => {
      const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
      setIsLoggedIn(!!storedUserInfo);
      
      if (storedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          
          // 수강 상태 확인
          setCheckingEnrollment(true);
          const enrolled = await AzureTableService.isUserEnrolledInCourse(
            parsedUserInfo.email, 
            'ai-building'
          );
          setIsAlreadyEnrolled(enrolled);
          setCheckingEnrollment(false);
        } catch (error) {
          console.error('사용자 정보 확인 실패:', error);
          setCheckingEnrollment(false);
        }
      } else {
        setIsAlreadyEnrolled(false);
      }
    };

    checkLoginStatus();

    const initializeTossPayments = async () => {
      try {
        const tossPaymentsInstance = await loadTossPayments(clientKey);
        console.log('초기화된 tossPayments 인스턴스:', tossPaymentsInstance);
        setTossPayments(tossPaymentsInstance);
      } catch (error) {
        console.error('토스페이먼츠 초기화 실패:', error);
      }
    };

    initializeTossPayments();

    // storage 이벤트 감지 (다른 탭에서 로그인/로그아웃 시)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', checkLoginStatus); // 페이지 포커스 시에도 확인

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkLoginStatus);
    };
  }, [clientKey]);

  // 카운트다운 타이머 제거 (현재 수강 가능하므로 불필요)

  const handleLoginRequired = () => {
    alert('결제하려면 먼저 로그인해주세요!');
    navigate('/login');
  };

  const handleEarlyBirdPayment = async () => {
    // 로그인 체크
    const userInfo = sessionStorage.getItem('aicitybuilders_user_session');
    if (!userInfo) {
      handleLoginRequired();
      return;
    }

    if (!tossPayments) {
      alert('결제 시스템을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 토스페이먼츠 직접 requestPayment 호출 (SDK 버전에 맞게)
      await tossPayments.requestPayment('카드', {
        amount: earlyBirdPrice,
        orderId: orderId,
        orderName: `[얼리버드] ${course.title}`,
        customerName: '클래튼 수강생',
        successUrl: `${window.location.origin}/payment/success?course=ai-building`,
        failUrl: `${window.location.origin}/payment/fail`,
        card: {
          useEscrow: false,
        },
      });

    } catch (error: any) {
      console.error('결제 실패:', error);
      let errorMessage = '';
      
      if (error.code === 'USER_CANCEL') {
        errorMessage = '💳 결제가 취소되었습니다.\n언제든지 다시 시도하실 수 있습니다.';
      } else if (error.code === 'INVALID_CARD') {
        errorMessage = '❌ 카드 정보가 올바르지 않습니다.\n카드번호, 유효기간, CVC를 다시 확인해주세요.';
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = '💰 카드 한도가 부족합니다.\n다른 결제수단을 이용하거나 한도를 확인해주세요.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = '🌐 네트워크 연결에 문제가 있습니다.\n인터넷 연결을 확인하고 다시 시도해주세요.';
      } else {
        errorMessage = `⚠️ 결제 처리 중 오류가 발생했습니다.\n\n문제가 지속되면 고객센터(contact@aicitybuilders.com)로 문의해주세요.\n\n오류 코드: ${error.code || 'UNKNOWN'}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 결제 완료된 사용자인지 확인
  const isPaidUser = isLoggedIn && isAlreadyEnrolled;

  return (
    <div className="masterclass-container">
      {/* 통일된 네비게이션바 */}
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="강의 1: AI 건물 짓기"
      />

      {isPaidUser ? (
        // 결제 후: 강의 콘텐츠 보기
        <div className="course-content-view">
          <div className="course-header" style={{ 
            padding: '20px', 
            textAlign: 'center'
          }}>
            <h1 style={{ 
              color: '#1f2937', 
              marginBottom: '10px',
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              lineHeight: '1.3',
              wordBreak: 'keep-all'
            }}>
              강의 1: AI 건물 짓기
            </h1>
            <h2 style={{ 
              color: '#0ea5e9', 
              fontSize: 'clamp(1rem, 3vw, 1.3rem)',
              marginBottom: '20px',
              lineHeight: '1.4',
              wordBreak: 'keep-all',
              padding: '0 10px'
            }}>
              AI로 월세 받는 나의 첫<br className="mobile-break" />'수익형 디지털 건물' 짓기
            </h2>
            <p style={{ 
              color: '#1f2937', 
              opacity: '0.8', 
              maxWidth: '600px', 
              margin: '0 auto',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              lineHeight: '1.5',
              padding: '0 15px'
            }}>
              환영합니다! 이제 실제 강의를 시청하고 나만의 수익형 디지털 건물을 완성해보세요.
            </p>
          </div>
          
          <div className="video-player-section" style={{ 
            maxWidth: '1000px', 
            margin: '0 auto', 
            padding: '0 15px 20px'
          }}>
            {/* 실제 강의 영상 플레이어 영역 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ 
                color: '#1f2937', 
                marginBottom: '15px',
                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)'
              }}>
                Chapter 1. AI 건물 짓기 - 입지 선정부터 첫 월세까지
              </h3>
              <div 
                className="youtube-embed-container"
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%', // 16:9 aspect ratio
                  height: 0,
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '15px',
                  border: '2px solid #0ea5e9'
                }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                  src="https://www.youtube.com/embed/8od7wv6tJIY?si=cM1TpOCYU-y0HIhU"
                  title="AI 건물 짓기 - Chapter 1"
                  frameBorder="0"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <p style={{ 
                color: '#1f2937', 
                opacity: '0.7',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                textAlign: 'center'
              }}>
                🎬 Chapter 1: AI로 월세 받는 디지털 건물의 첫 걸음을 시작해보세요!
              </p>
            </div>

            {/* 강의 목록 */}
            <div className="course-lessons" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h3 style={{ 
                color: '#1f2937', 
                marginBottom: '15px',
                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)'
              }}>
                강의 목록
              </h3>
              {course.lessons.map((lesson, index) => (
                <div key={lesson.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '12px',
                  marginBottom: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    backgroundColor: '#0ea5e9',
                    color: '#1f2937',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    marginRight: '12px',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ 
                      color: '#1f2937', 
                      margin: '0 0 5px 0',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                      lineHeight: '1.4',
                      wordBreak: 'keep-all'
                    }}>
                      {lesson.title}
                    </h4>
                    <p style={{ 
                      color: '#1f2937', 
                      opacity: '0.7', 
                      margin: 0, 
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                    }}>
                      {lesson.duration}
                    </p>
                  </div>
                  <Play size={18} color="#0ea5e9" style={{ 
                    flexShrink: 0,
                    marginTop: '4px' 
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // 결제 전: 강의 소개 및 판매
        <div className="course-sales-view">
      {/* 메인 콘텐츠 영역 */}
      <div className="course-layout">
        {/* 왼쪽 메인 콘텐츠 */}
        <div className="course-main">
          {/* 히어로 섹션 */}
          <section className="course-hero">
            <div className="hero-content">
              {/* 현재 수강 가능 배지 */}
              <div className="available-badge" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #0ea5e9, #e55050)',
                color: '#1f2937',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
현재 수강 가능
              </div>
              
              <h1 className="hero-title">
                강의 1: AI 건물 짓기
              </h1>
              <h2 className="hero-subtitle-large" style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#0ea5e9',
                marginBottom: '15px'
              }}>
AI로 월세 받는 나의 첫 '수익형 디지털 건물' 짓기
              </h2>
              <div className="detailed-description" style={{ color: '#1f2937', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '40px' }}>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ color: '#1f2937', fontSize: '1.4rem', marginBottom: '15px' }}>
                    "AI가 대세라는데, 정작 어떻게 돈을 벌어야 할지 막막하신가요?"
                  </h3>
                  <p style={{ color: '#1f2937' }}>
                    시중의 AI 강의들은 ChatGPT 사용법만 가르치고 끝납니다. 하지만 실제로 필요한 건 
                    <strong style={{ color: '#0ea5e9' }}>'돈이 되는 AI 활용법'</strong>이죠. 
                    이 강의는 AI 도구 사용법부터 첫 수익 달성까지, 실제 돈벌이가 가능한 완전한 시스템을 구축해드립니다.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
                  <h4 style={{ color: '#1f2937', fontSize: '1.2rem', marginBottom: '15px' }}>
                    💬 실제 수강생 김○○님의 생생한 후기
                  </h4>
                  <p style={{ fontStyle: 'italic', color: '#1f2937', opacity: '0.9', lineHeight: '1.6' }}>
                    "솔직히 처음엔 반신반의했어요. 그런데 강의를 따라하다 보니 정말로 유튜브 채널이 만들어지고, 
                    3개월 후에는 매월 30만원씩 꾸준히 들어오기 시작했습니다. 
                    회사 월급만으로는 부족했는데, 이제 부수입이 생겨서 경제적으로 여유가 생겼어요!"
                  </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ color: '#1f2937', fontSize: '1.4rem', marginBottom: '15px' }}>
                    ✨ 왜 이 강의를 선택해야 할까요?
                  </h3>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#1f2937', borderLeft: '4px solid #0ea5e9' }}>
                      <strong style={{ color: '#0ea5e9', fontSize: '1.1rem' }}>💰 실제 수익까지 완성</strong><br/>
                      <span style={{ fontSize: '0.95rem', opacity: '0.9' }}>이론만 배우고 끝이 아닙니다. 유튜브 애드센스 수익이 실제로 들어오는 시스템까지 완성시켜 드립니다.</span>
                    </div>
                    <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#1f2937', borderLeft: '4px solid #0ea5e9' }}>
                      <strong style={{ color: '#0ea5e9', fontSize: '1.1rem' }}>🎯 개인 맞춤 관리</strong><br/>
                      <span style={{ fontSize: '0.95rem', opacity: '0.9' }}>AI 멘토 제이가 직접 여러분의 진행 상황을 체크하고, 개인별 맞춤 조언을 제공합니다.</span>
                    </div>
                    <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#1f2937', borderLeft: '4px solid #0ea5e9' }}>
                      <strong style={{ color: '#0ea5e9', fontSize: '1.1rem' }}>🏆 검증된 성공 방법</strong><br/>
                      <span style={{ fontSize: '0.95rem', opacity: '0.9' }}>이미 많은 수강생들이 실제 수익을 달성한 검증된 방법론입니다. 이론이 아닌 실전 경험을 바탕으로 합니다.</span>
                    </div>
                    <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#1f2937', borderLeft: '4px solid #0ea5e9' }}>
                      <strong style={{ color: '#0ea5e9', fontSize: '1.1rem' }}>🔰 완전 초보도 OK</strong><br/>
                      <span style={{ fontSize: '0.95rem', opacity: '0.9' }}>컴퓨터를 잘 몰라도, AI를 처음 접해도 괜찮습니다. 클릭 한 번까지 세세하게 알려드립니다.</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
                  <h4 style={{ color: '#1f2937', fontSize: '1.2rem', marginBottom: '15px' }}>
                    🎯 강의 완료 후 여러분이 갖게 될 변화:
                  </h4>
                  <div style={{ display: 'grid', gap: '12px', fontSize: '1rem', color: '#1f2937' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: '#0ea5e9', fontSize: '1.1rem', marginTop: '2px' }}>🏗️</span>
                      <p><strong style={{ color: '#0ea5e9' }}>수익형 유튜브 채널:</strong> 월 30-50만원 수익을 목표로 하는 체계적인 채널 운영 시스템</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: '#0ea5e9', fontSize: '1.1rem', marginTop: '2px' }}>💳</span>
                      <p><strong style={{ color: '#0ea5e9' }}>애드센스 승인 노하우:</strong> 승인받기 어려운 애드센스를 한 번에 통과하는 검증된 전략</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: '#0ea5e9', fontSize: '1.1rem', marginTop: '2px' }}>🤖</span>
                      <p><strong style={{ color: '#0ea5e9' }}>AI 콘텐츠 제작 능력:</strong> 혼자서도 전문가 수준의 콘텐츠를 만들 수 있는 AI 활용법</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: '#0ea5e9', fontSize: '1.1rem', marginTop: '2px' }}>⚙️</span>
                      <p><strong style={{ color: '#0ea5e9' }}>자동화 수익 시스템:</strong> 잠들어 있는 동안에도 돈이 들어오는 패시브 인컴 구조</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: '#0ea5e9', fontSize: '1.1rem', marginTop: '2px' }}>🏆</span>
                      <p><strong style={{ color: '#0ea5e9' }}>디지털 자산 소유:</strong> 평생 소유 가능한 나만의 수익형 디지털 부동산</p>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 107, 107, 0.1)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(255, 107, 107, 0.3)' }}>
                  <h3 style={{ color: '#0ea5e9', fontSize: '1.2rem', marginBottom: '15px', textAlign: 'center' }}>
                    ⚠️ 솔직한 안내사항
                  </h3>
                  <p style={{ color: '#1f2937', textAlign: 'center', lineHeight: '1.6' }}>
                    이 강의는 <strong style={{ color: '#0ea5e9' }}>즉석에서 부자가 되는 마법</strong>이 아닙니다.<br/>
                    하루 30분씩이라도 꾸준히 학습하고 실행하실 분들에게만 추천합니다.<br/>
                    <span style={{ opacity: '0.8', fontSize: '0.9rem' }}>
                      이론만 듣고 실행하지 않으면 결과도 없습니다.
                    </span>
                  </p>
                </div>
              </div>
              
              {/* 강의 메타 정보 */}
              <div className="course-meta-info">
                <div className="meta-item" style={{ color: '#1f2937' }}>
                  <Star size={16} color="#0ea5e9" />
                  <span>프리미엄</span>
                </div>
                <div className="meta-item" style={{ color: '#1f2937' }}>
                  <Users size={16} color="#1f2937" />
                  <span>정원석 (AI 멘토 제이)</span>
                </div>
                <div className="meta-item" style={{ color: '#1f2937' }}>
                  <Clock size={16} color="#1f2937" />
                  <span>12시간 30분 (14강의)</span>
                </div>
                <div className="meta-item" style={{ color: '#1f2937' }}>
                  <Calendar size={16} color="#0ea5e9" />
                  <span>현재 수강 가능</span>
                </div>
              </div>

              {/* 현재 수강 가능 안내 */}
              <div className="available-section" style={{ 
                background: 'rgba(255, 107, 107, 0.1)', 
                padding: '30px', 
                borderRadius: '15px', 
                marginTop: '30px',
                textAlign: 'center' 
              }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '25px', color: '#1f2937', textAlign: 'center' }}>
                  지금 시작해야 하는 이유 (시간은 기다려주지 않습니다)
                </h3>
                <div style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#1f2937' }}>
                  <div style={{ marginBottom: '20px', padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                    <h4 style={{ color: '#1f2937', marginBottom: '10px' }}>AI 시장이 폭발적으로 성장하고 있습니다</h4>
                    <p>2024년 현재, AI 콘텐츠 시장 규모는 전년 대비 340% 증가했습니다. 하지만 대부분의 사람들은 아직도 구경만 하고 있어요. <strong style={{ color: '#0ea5e9' }}>지금이 바로 선점할 기회</strong>입니다.</p>
                  </div>

                  <div style={{ marginBottom: '20px', padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                    <h4 style={{ color: '#1f2937', marginBottom: '10px' }}>이미 검증된 성공 사례들</h4>
                    <p><strong style={{ color: '#0ea5e9' }}>박○○님 (주부):</strong> "아이 둘 키우면서도 매월 50만원씩 벌고 있어요"<br/>
                    <strong style={{ color: '#0ea5e9' }}>이○○님 (회사원):</strong> "퇴근 후 2시간으로 월 80만원 부수입 달성"<br/>
                    <strong style={{ color: '#0ea5e9' }}>최○○님 (은퇴자):</strong> "은퇴 후 새로운 인생 2막의 시작이 되었어요"</p>
                  </div>

                  <div style={{ marginBottom: '20px', padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                    <h4 style={{ color: '#1f2937', marginBottom: '10px' }}>완벽한 초보자 맞춤 설계</h4>
                    <p><strong style={{ color: '#0ea5e9' }}>• 컴맹도 OK:</strong> 유튜브 채널 만드는 것부터 차근차근 알려드립니다<br/>
                    <strong style={{ color: '#0ea5e9' }}>• AI 몰라도 OK:</strong> AI 도구 하나하나 클릭하는 방법까지 세세하게 가이드<br/>
                    <strong style={{ color: '#0ea5e9' }}>• 시간 없어도 OK:</strong> 하루 30분씩만 투자하면 충분한 커리큘럼</p>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '25px', borderRadius: '15px', textAlign: 'center' }}>
                    <h4 style={{ color: '#1f2937', marginBottom: '15px', fontSize: '1.2rem' }}>특별 혜택 (선착순 100명 한정)</h4>
                    <div style={{ marginBottom: '15px', color: '#1f2937' }}>
                      <p><strong style={{ color: '#0ea5e9' }}>• 1:1 개인 컨설팅:</strong> AI 멘토 제이와 30분 화상 컨설팅 (50만원 상당)</p>
                      <p><strong style={{ color: '#0ea5e9' }}>• 완주 지원:</strong> 3개월간 학습 완주를 위한 전담 멘토링 지원</p>
                      <p><strong style={{ color: '#0ea5e9' }}>• 평생 업데이트:</strong> 새로운 AI 도구 추가 시 무료 업데이트</p>
                      <p><strong style={{ color: '#0ea5e9' }}>• 커뮤니티 멤버십:</strong> 성공 사례를 공유하는 VIP 커뮤니티 평생 이용</p>
                    </div>
                    <p style={{ fontSize: '0.9rem', opacity: '0.9', color: '#1f2937' }}>
                      ※ 이 혜택들은 수강료로는 절대 구할 수 없는 가치입니다
                    </p>
                  </div>
                </div>
              </div>

              {/* 수강 신청 섹션 */}
              <div className="pricing-section" style={{ 
                marginTop: '40px', 
                padding: '30px', 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '15px',
                textAlign: 'center' 
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#1f2937' }}>지금 시작하세요!</h3>
                
                <div className="price-info" style={{ marginBottom: '20px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ 
                      fontSize: '1.2rem', 
                      textDecoration: 'line-through', 
                      opacity: '0.6',
                      marginRight: '15px' 
                    }}>
                      ₩{originalPrice.toLocaleString()}
                    </span>
                    <span style={{ 
                      background: '#0ea5e9', 
                      color: '#1f2937', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem' 
                    }}>
                      {discount}% 할인
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0ea5e9' }}>
                    ₩{earlyBirdPrice.toLocaleString()}
                  </div>
                </div>

                {/* 수강 혜택 */}
                <div className="benefits-list" style={{ 
                  textAlign: 'left', 
                  maxWidth: '450px', 
                  margin: '0 auto 30px' 
                }}>
                  {[
                    '수익형 유튜브 채널 운영 노하우 완전 습득',
                    '전문가 수준의 채널 구축 및 구독자 증가 전략',
                    '애드센스 승인받는 효과적인 방법과 최적화 전략',
                    'AI 도구를 활용한 효율적인 고품질 콘텐츠 제작법',
                    '"디지털 건물주" 공식 수료증 (포트폴리오 기재 가능)',
                    '평생 업데이트되는 최신 AI 도구 가이드북',
                    'AI 멘토 제이와 1:1 성장 컨설팅 (50만원 상당)',
                    '지속 가능한 수익형 콘텐츠 운영 시스템 구축법'
                  ].map((benefit, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      marginBottom: '10px' 
                    }}>
                      <CheckCircle size={16} color="#0ea5e9" />
                      <span style={{ fontSize: '0.9rem', color: '#1f2937' }}>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* 수강 신청 버튼 */}
                <button 
                  className="watch-trailer-btn premium-btn"
                  onClick={isLoggedIn && !isAlreadyEnrolled ? handleEarlyBirdPayment : handleLoginRequired}
                  disabled={isLoading || !tossPayments || checkingEnrollment || isAlreadyEnrolled}
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '15px 30px',
                    fontSize: '1.1rem',
                    opacity: (!isLoggedIn || isAlreadyEnrolled) ? '0.7' : '1'
                  }}
                >
                  <Play size={16} />
                  {checkingEnrollment ? '수강 상태 확인 중...' :
                   isLoading ? '결제 진행 중...' : 
                   !isLoggedIn ? '로그인 후 이용 가능' : 
                   isAlreadyEnrolled ? '이미 수강 중입니다' : '지금 시작하기'}
                </button>

                <p style={{ fontSize: '0.8rem', opacity: '0.7', marginTop: '15px' }}>
                  {isAlreadyEnrolled 
                    ? '이미 수강 중인 강좌입니다' :
                   isLoggedIn 
                    ? '토스페이먼츠로 안전하게 결제됩니다' 
                    : '먼저 로그인한 후 바로 시작하세요'}
                </p>
                
                {!isAlreadyEnrolled && (
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '20px', 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ color: '#1f2937', marginBottom: '10px', fontSize: '1rem' }}>
                      마지막 경고: 이 기회를 놓치면...
                    </h4>
                    <p style={{ color: '#1f2937', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      AI 시장은 빠르게 포화되고 있습니다. 지금 시작하지 않으면 1년 후에는 경쟁이 10배 더 치열해집니다.<br/>
                      <strong style={{ color: '#0ea5e9' }}>지금이 아니면 언제 시작하시겠습니까?</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* 오른쪽 사이드바 - 커리큘럼 */}
        <div className="course-sidebar">
          <div className="sidebar-header">
            <h3 style={{ color: '#1f2937' }}>수익형 디지털 건물 짓기 로드맵</h3>
            <p style={{ color: '#1f2937', opacity: '0.8' }}>총 {course.lessons.length}강의 · 4대 파트 · 수익 달성 보장</p>
          </div>
          
          <div className="lesson-list">
            {course.lessons.slice(0, 10).map((lesson, index) => (
              <div 
                key={lesson.id} 
                className="lesson-item coming-soon-lesson"
                style={{ opacity: '0.8' }}
              >
                <div className="lesson-item-content">
                  <div className="lesson-number" style={{ 
                    backgroundColor: '#0ea5e9',
                    color: '#1f2937',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  <div className="lesson-info">
                    <h4 className="lesson-title" style={{ color: '#1f2937' }}>{lesson.title}</h4>
                    <div className="lesson-meta">
                      <span className="lesson-duration" style={{ color: '#1f2937', opacity: '0.7' }}>
                        <Clock size={14} color="#1f2937" />
                        {lesson.duration}
                      </span>
                      {lesson.hasQuiz && (
                        <span className="lesson-quiz" style={{ color: '#0ea5e9' }}>
                          퀴즈 포함
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="lesson-status">
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid #0ea5e9', 
                      borderRadius: '50%' 
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* 더 많은 강의 표시 */}
            <div className="more-lessons" style={{ 
              textAlign: 'center', 
              padding: '20px', 
              opacity: '0.7' 
            }}>
              <p style={{ color: '#1f2937' }}>+ {course.lessons.length - 10}개 강의 더</p>
              <p style={{ fontSize: '0.8rem', marginTop: '5px', color: '#0ea5e9' }}>
                지금 바로 수강 가능
              </p>
            </div>
          </div>

          {/* 수강 안내 박스 */}
          <div className="course-info-box" style={{
            background: 'linear-gradient(135deg, #0ea5e9, #e55050)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <CheckCircle size={24} style={{ marginBottom: '10px', color: '#1f2937' }} />
            <h4 style={{ marginBottom: '10px', color: '#1f2937' }}>수강 안내</h4>
            <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1f2937' }}>
              지금 바로 수강 가능
            </p>
            <p style={{ fontSize: '0.9rem', marginTop: '5px', opacity: '0.9', color: '#1f2937' }}>
              모든 강의가 준비되어 있습니다
            </p>
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowAutomationMasterPage; 