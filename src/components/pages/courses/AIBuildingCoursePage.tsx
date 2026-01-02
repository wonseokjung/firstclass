
import React, { useState, useEffect } from 'react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // 3개월 수강권 95,000원
  const currentPrice = 95000;

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
                console.log('✅ 결제 확인됨 - 소개 페이지에 "내 강의 보기" 버튼 표시');
                // 자동 리다이렉트 제거 - 사용자가 직접 "내 강의 보기" 버튼 클릭
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

  const handlePayment = async () => {
    console.log('🔍 수강 신청 버튼 클릭 - 결제 페이지로 이동');
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
    <div className="masterclass-container" style={{ paddingBottom: isPaidUser ? '0' : '80px' }}>
      <NavigationBar
        onBack={onBack}
        breadcrumbText="Step 1: AI 건물주 되기 기초"
      />
      
      {/* 고정 결제 버튼 */}
      <FloatingPaymentButton onClick={handlePayment} isPaidUser={isPaidUser} price={currentPrice} />

      {/* PaymentComponent 모달 - 페이지 최상단에 위치 */}
      {showPaymentModal && userInfo && (
        <PaymentComponent
          courseId="999"
          courseTitle="Step 1: AI 건물주 되기 기초"
          price={currentPrice}
          userInfo={userInfo}
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}

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
                onClick={() => window.location.href = '/ai-building-course-player'}
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
          {/* 상단 메인 CTA */}
          <div style={{
            background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
            borderRadius: '30px',
            padding: 'clamp(30px, 6vw, 60px) clamp(20px, 4vw, 40px)',
            textAlign: 'center',
            marginBottom: 'clamp(30px, 6vw, 60px)',
            color: 'white',
            boxShadow: '0 25px 60px rgba(30, 41, 59, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            border: '4px solid #ffd60a'
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
                  background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
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
                  color: '#ffffff'
                }}>
                  Step 1: AI 건물주 되기 기초
                </h1>
                <h2 style={{
                  fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
                  marginBottom: '20px',
                  opacity: '0.95',
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  color: '#ffd60a'
                }}>
                  🏙️ 1960년 맨해튼 부동산 기회가 지금 유튜브에 왔다
                </h2>
                <p style={{
                  fontSize: 'clamp(1.05rem, 2.2vw, 1.2rem)',
                  marginBottom: '30px',
                  opacity: '0.9',
                  fontWeight: '500',
                  lineHeight: '1.7'
                }}>
                  유튜브 CEO가 발표한 "새로운 계급의 크리에이터"가 되는 법을 배웁니다
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
                  fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                  fontWeight: '900',
                  marginBottom: '12px',
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  color: '#ffffff'
                }}>
                  ₩{currentPrice.toLocaleString()}
                </div>
                <div style={{
                  fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                  color: '#ffd60a',
                  fontWeight: '700',
                  marginBottom: '12px',
                  background: 'rgba(251, 191, 36, 0.2)',
                  padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
                  borderRadius: '25px',
                  display: 'inline-block',
                  border: '1px solid rgba(251, 191, 36, 0.3)'
                }}>
                  📚 3개월 수강권
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
                  background: 'linear-gradient(135deg, #e5c100, #d97706, #e5c100)',
                  borderRadius: '30px',
                  opacity: '0.4',
                  animation: 'pulse 2s infinite',
                  filter: 'blur(12px)'
                }}></div>

                <button
                  onClick={handlePayment}
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #e5c100, #d97706)',
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
                  <span style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>🚀</span>
                  수강 신청하기
                </button>
              </div>

              <p style={{
                fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
                opacity: '0.95',
                margin: '0',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                fontWeight: '600',
                color: '#ffd60a'
              }}>
                ✅ 지금 바로 강의를 시작하세요!
              </p>
            </div>

          </div>

          {/* ✨ 이 강의에 포함된 것 - 간결한 버전 */}
          <div style={{
            background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
            padding: 'clamp(30px, 5vw, 50px)',
            borderRadius: '25px',
            marginBottom: 'clamp(30px, 6vw, 50px)',
            border: '2px solid rgba(255, 214, 10, 0.4)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
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
                  AI로 유튜브 채널 만들고 수익화하는 방법을<br />
                  <strong style={{ color: '#ffd60a' }}>10개 영상 강의</strong>로 체계적으로 배웁니다.<br />
                  <span style={{ color: '#94a3b8' }}>구매 후 3개월간 무제한 시청</span>
                </p>
              </div>

              {/* 🔴 주간 라이브 */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '20px',
                padding: 'clamp(25px, 4vw, 35px)',
                border: '2px solid rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '2.5rem' }}>🔴</span>
                  <h4 style={{ color: '#ef4444', fontWeight: '800', fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', margin: 0 }}>
                    매주 프로젝트 라이브
                  </h4>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: '#ef4444' }}>매주 화요일 밤 8시</strong> 실시간으로<br />
                  함께 프로젝트를 진행합니다.<br />
                  <span style={{ color: '#94a3b8' }}>다시보기: 해당 월에만 제공 (다음달 삭제)</span>
                </p>
              </div>
            </div>
          </div>

          {/* 🎬 강의 소개 영상 */}
          <div style={{
            background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
            padding: 'clamp(30px, 6vw, 50px)',
            borderRadius: '30px',
            marginBottom: 'clamp(30px, 6vw, 60px)',
            border: '3px solid #ffd60a',
            boxShadow: '0 25px 60px rgba(251, 191, 36, 0.2)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                padding: '10px 25px',
                borderRadius: '30px',
                marginBottom: '15px'
              }}>
                <span style={{ color: '#000', fontWeight: '800', fontSize: '1rem' }}>
                  🎬 강의 소개 영상
                </span>
              </div>
              <h3 style={{
                color: '#ffffff',
                fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                fontWeight: '800',
                marginBottom: '10px'
              }}>
                먼저 영상으로 확인하세요!
              </h3>
              <p style={{
                color: '#94a3b8',
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)'
              }}>
                AI 멘토 제이가 직접 설명하는 강의 소개
              </p>
            </div>

            {/* Vimeo 영상 임베딩 */}
            <div style={{
              position: 'relative',
              paddingTop: '56.25%',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
              border: '4px solid rgba(255, 255, 255, 0.1)'
            }}>
              <iframe
                src="https://player.vimeo.com/video/1146515545?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
                title="인공지능건물주되기_인트로"
              />
            </div>
          </div>

          {/* 강의 소개 - CEOPage 스타일 적용 */}
          <div style={{ marginBottom: 'clamp(40px, 8vw, 80px)' }}>
            {/* 메인 히어로 섹션 */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 50px)',
              borderRadius: '30px',
              marginBottom: 'clamp(30px, 6vw, 60px)',
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
                  background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                  color: '#ffffff',
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
                  color: '#1b263b',
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
                  🏙️ 유튜브 CEO가 예언한 "새로운 계급의 크리에이터"
                </p>

                <p style={{
                  fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
                  color: '#64748b',
                  fontWeight: '600',
                  marginBottom: '30px'
                }}>
                  비싼 카메라도, 인력도 필요 없다. AI 하나로 유튜브 채널을 짓는다.
                </p>

                {/* 맨해튼 스토리 박스 */}
                <div style={{
                  background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
                  padding: 'clamp(25px, 5vw, 40px)',
                  borderRadius: '20px',
                  maxWidth: '900px',
                  margin: '0 auto 30px',
                  border: '3px solid #ffd60a',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <span style={{ fontSize: '2rem' }}>🗽</span>
                    <h4 style={{
                      color: '#ffd60a',
                      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                      fontWeight: '900',
                      margin: 0
                    }}>맨해튼 부자 삼촌의 교훈</h4>
                  </div>
                  <p style={{
                    color: '#e2e8f0',
                    fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
                    lineHeight: '1.9',
                    margin: '0 0 20px 0',
                    fontWeight: '500',
                    textAlign: 'left'
                  }}>
                    1960년대, 무작정 미국으로 건너온 외삼촌은 세탁소에서 일하며 시작했습니다.<br /><br />
                    당시 맨해튼은 <strong style={{ color: '#ffd60a' }}>건물을 사면 은행에서 이자 없이 돈을 빌려주던 시대</strong>였죠.
                    10억짜리 건물을 사면 11억을 빌려줬고, 남은 1억으로 인테리어해서 세입자만 채우면 건물이 내 것이 됐습니다.<br /><br />
                    그렇게 건물 하나, 두 개, 세 개... <strong style={{ color: '#ffd60a' }}>지금은 맨해튼에 수백 개의 빌딩을 가진 부동산 재벌</strong>이 되었습니다.
                  </p>
                </div>

                {/* 지금 유튜브 상황 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: 'clamp(25px, 5vw, 40px)',
                  borderRadius: '20px',
                  maxWidth: '900px',
                  margin: '0 auto 30px',
                  backdropFilter: 'blur(10px)',
                  border: '3px solid #1e40af',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <span style={{ fontSize: '2rem' }}>📺</span>
                    <h4 style={{
                      color: '#1e40af',
                      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                      fontWeight: '900',
                      margin: 0
                    }}>지금 유튜브가 딱 그때입니다</h4>
                  </div>
                  <p style={{
                    color: '#1b263b',
                    fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
                    lineHeight: '1.9',
                    margin: '0',
                    fontWeight: '500',
                    textAlign: 'left'
                  }}>
                    유튜브 CEO가 발표했습니다: <strong style={{ color: '#1e40af' }}>"새로운 계급의 크리에이터가 탄생할 것이다"</strong><br /><br />
                    예전에는 SBS, KBS 같은 대형 방송국들이 들어오면서 퀄리티 경쟁이 너무 치열해졌죠.
                    비싼 카메라, 스튜디오, 전문 인력 없이는 경쟁이 불가능했습니다.<br /><br />
                    하지만 이제 <strong style={{ color: '#1e40af' }}>AI가 모든 것을 바꿨습니다.</strong><br />
                    구글이 <strong style={{ color: '#1e40af' }}>30가지가 넘는 AI 도구</strong>를 무료로 제공하고 있고,
                    혼자서도 방송국 퀄리티의 콘텐츠를 만들 수 있는 시대가 열렸습니다.<br /><br />
                    <span style={{
                      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                      padding: '8px 15px',
                      borderRadius: '10px',
                      fontWeight: '700',
                      color: '#92400e'
                    }}>
                      🏗️ 유튜브 채널 1개 = 디지털 건물 1채
                    </span>
                  </p>
                </div>

                {/* 강의 목표 */}
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                  padding: '25px 35px',
                  borderRadius: '20px',
                  border: '3px solid #1e40af',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                    fontWeight: '900',
                    color: '#1e40af',
                    marginBottom: '15px'
                  }}>
                    🎯 이 강의에서 배우는 것
                  </div>
                  <div style={{
                    fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
                    fontWeight: '600',
                    color: '#1b263b',
                    lineHeight: '2',
                    textAlign: 'left'
                  }}>
                    ✅ Part 1: 콘텐츠 비즈니스 마인드와 지식<br />
                    ✅ Part 2: AI 도구 실습 (이미지, 영상, 글, 목소리 생성)<br />
                    ✅ 매주 수강생 전용 라이브 (새로운 AI 도구 업데이트)<br />
                    ✅ 수익화 목적의 콘텐츠 제작 전략
                  </div>
                </div>
                <br />
                <span style={{
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontWeight: '700',
                  color: '#1e40af',
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  border: '2px solid #ffd60a'
                }}>
                  💡 커리큘럼은 변경될 수 있습니다
                </span>
              </div>
            </div>

            {/* 🚀 AI 시티 빌더스 4단계 여정 */}
            <div style={{
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
              padding: 'clamp(30px, 6vw, 50px)',
              borderRadius: '25px',
              marginBottom: 'clamp(30px, 6vw, 60px)',
              border: '3px solid #8b5cf6',
              boxShadow: '0 20px 50px rgba(139, 92, 246, 0.2)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  padding: '10px 25px',
                  borderRadius: '30px',
                  marginBottom: '20px'
                }}>
                  <span style={{ color: '#fff', fontWeight: '800', fontSize: '1rem' }}>
                    🗺️ 콘텐츠 비즈니스 로드맵
                  </span>
                </div>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
                  fontWeight: '900',
                  marginBottom: '15px'
                }}>
                  AI 시티 빌더스 <span style={{ color: '#ffd60a' }}>4단계 여정</span>
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  maxWidth: '700px',
                  margin: '0 auto'
                }}>
                  1인 유니콘을 만들 수 있는 시대, 그 여정의 첫 번째 단계입니다
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                gap: 'clamp(15px, 3vw, 25px)'
              }}>
                {/* Step 1 - 현재 강의 */}
                <div style={{
                  background: 'linear-gradient(135deg, #ffd60a 0%, #e5c100 100%)',
                  padding: '25px 20px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)',
                  border: '3px solid #fff',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-12px',
                    background: '#ef4444',
                    color: '#fff',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '800'
                  }}>현재 강의</div>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏗️</div>
                  <h4 style={{ color: '#ffffff', fontWeight: '900', marginBottom: '8px', fontSize: '1.1rem' }}>Step 1</h4>
                  <p style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>AI 콘텐츠 생성</p>
                </div>

                {/* Step 2 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '25px 20px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⚙️</div>
                  <h4 style={{ color: '#fff', fontWeight: '900', marginBottom: '8px', fontSize: '1.1rem' }}>Step 2</h4>
                  <p style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>AI 자동화 시스템</p>
                </div>

                {/* Step 3 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '25px 20px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💻</div>
                  <h4 style={{ color: '#fff', fontWeight: '900', marginBottom: '8px', fontSize: '1.1rem' }}>Step 3</h4>
                  <p style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>바이브코딩</p>
                </div>

                {/* Step 4 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '25px 20px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👑</div>
                  <h4 style={{ color: '#fff', fontWeight: '900', marginBottom: '8px', fontSize: '1.1rem' }}>Step 4</h4>
                  <p style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>1인 기업 만들기</p>
                </div>
              </div>

              <div style={{
                marginTop: '30px',
                textAlign: 'center',
                background: 'rgba(251, 191, 36, 0.15)',
                padding: '20px',
                borderRadius: '15px',
                border: '2px solid rgba(251, 191, 36, 0.3)'
              }}>
                <p style={{
                  color: '#ffd60a',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.8'
                }}>
                  💡 이 4단계를 거쳐 <strong style={{ color: '#fff' }}>1인이 유니콘을 만들 수 있는 시대</strong>가 왔습니다.<br />
                  함께 성장하는 네트워크와 커뮤니티를 만들어갑니다.
                </p>
              </div>
            </div>

            {/* 🖼️ 성공 여정 이미지 */}
            <div style={{
              background: '#ffffff',
              padding: '20px',
              borderRadius: '20px',
              marginBottom: 'clamp(20px, 4vw, 40px)',
              border: '3px solid #ffd60a',
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

            {/* 🔥 지금이 기회인 이유 */}
            <div style={{
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
              padding: 'clamp(30px, 6vw, 50px)',
              borderRadius: '25px',
              marginBottom: 'clamp(30px, 6vw, 50px)',
              border: '3px solid #ffd60a',
              boxShadow: '0 20px 50px rgba(255, 214, 10, 0.15)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #ffd60a, #f59e0b)',
                  padding: '10px 25px',
                  borderRadius: '30px',
                  marginBottom: '20px'
                }}>
                  <span style={{ color: '#1b263b', fontWeight: '900', fontSize: '1rem' }}>
                    💡 이 기회를 놓치면 안 되는 이유
                  </span>
                </div>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
                  fontWeight: '900',
                  marginBottom: '20px',
                  lineHeight: '1.5'
                }}>
                  기존 사업을 다 접고<br />
                  <span style={{ color: '#ffd60a' }}>콘텐츠에 올인하는 이유</span>
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '20px',
                marginBottom: '25px'
              }}>
                {/* 이유 1 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏦</div>
                  <h4 style={{ color: '#ffd60a', fontWeight: '800', marginBottom: '10px', fontSize: '1.1rem' }}>
                    구글이 다 지원해준다
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                    1960년대 맨해튼에서 은행이 이자 없이 돈을 빌려줬듯이,
                    지금 구글은 <strong style={{ color: '#fff' }}>30개 이상의 AI 도구</strong>를 무료로 제공합니다.
                  </p>
                </div>

                {/* 이유 2 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚖️</div>
                  <h4 style={{ color: '#ffd60a', fontWeight: '800', marginBottom: '10px', fontSize: '1.1rem' }}>
                    경쟁이 평준화됐다
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                    예전에는 SBS, KBS 같은 방송국과 경쟁해야 했지만,
                    이제 <strong style={{ color: '#fff' }}>AI 하나면 방송국 퀄리티</strong>를 혼자서 만들 수 있습니다.
                  </p>
                </div>

                {/* 이유 3 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🌏</div>
                  <h4 style={{ color: '#ffd60a', fontWeight: '800', marginBottom: '10px', fontSize: '1.1rem' }}>
                    글로벌 시장이 열렸다
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                    AI 번역·더빙으로 한국뿐 아니라
                    <strong style={{ color: '#fff' }}>미국, 일본, 중국, 전 세계</strong>를 타겟으로 콘텐츠를 만들 수 있습니다.
                  </p>
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '20px 25px',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#fff',
                  fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.8'
                }}>
                  💡 "근데 왜 이걸 알려주세요?"<br />
                  <span style={{ color: '#ffd60a' }}>
                    4단계 - 함께 성장하는 네트워크를 만들기 위해서입니다.<br />
                    혼자보다 여럿이 모였을 때 시너지가 있습니다.
                  </span>
                </p>
              </div>
            </div>

            {/* 🔥 핵심 차별점 - 압도적 비주얼 */}
            <div style={{
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
              padding: 'clamp(25px, 5vw, 50px) clamp(20px, 4vw, 40px)',
              borderRadius: '25px',
              marginBottom: 'clamp(20px, 4vw, 40px)',
              border: '3px solid #ffd60a',
              boxShadow: '0 15px 50px rgba(251, 191, 36, 0.2)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
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
                  콘텐츠를 "생성"하는 게 아닙니다.<br />
                  <span style={{ color: '#ffd60a' }}>압도적으로 강한 주제를 "선택"</span>하는 겁니다.
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  lineHeight: '1.7',
                  maxWidth: '700px',
                  margin: '0 auto'
                }}>
                  누구나 AI로 이미지를 만들 수 있습니다.<br />
                  하지만 <strong style={{ color: '#fff' }}>"무엇을 만들어야 팔리는지"</strong> 아는 사람은 드뭅니다.<br />
                  처음부터 비주얼적으로 강한 주제를 선택해야 수익화가 됩니다.
                </p>
              </div>

              {/* 예시 이미지 */}
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '4px solid #ffd60a',
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
                  background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <span style={{
                    color: '#000',
                    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                    fontWeight: '800'
                  }}>
                    🎨 이런 압도적인 비주얼을 AI로 만드는 법을 배웁니다
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🎁 수강생 특전 */}
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            padding: 'clamp(30px, 6vw, 50px)',
            borderRadius: '25px',
            marginBottom: 'clamp(30px, 6vw, 60px)',
            border: '3px solid #34d399',
            boxShadow: '0 20px 50px rgba(5, 150, 105, 0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <div style={{
                display: 'inline-block',
                background: '#fff',
                padding: '10px 25px',
                borderRadius: '30px',
                marginBottom: '20px'
              }}>
                <span style={{ color: '#059669', fontWeight: '900', fontSize: '1rem' }}>
                  🎁 수강생 특전
                </span>
              </div>
              <h3 style={{
                color: '#ffffff',
                fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
                fontWeight: '900',
                marginBottom: '15px'
              }}>
                강의 + <span style={{ color: '#ffd60a' }}>매주 라이브</span> + 커뮤니티
              </h3>
              <p style={{
                color: '#a7f3d0',
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                AI 도구는 계속 바뀝니다. Gemini 3, 3.1, 3.2... 새로운 모델이 계속 나옵니다.<br />
                그래서 매주 라이브로 최신 AI 도구를 업데이트해드립니다.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '20px'
            }}>
              {/* 특전 1 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '25px',
                borderRadius: '15px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📺</div>
                <h4 style={{ color: '#fff', fontWeight: '800', marginBottom: '10px', fontSize: '1.1rem' }}>
                  녹화 강의 (16강)
                </h4>
                <p style={{ color: '#a7f3d0', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  Part 1: 콘텐츠 비즈니스 마인드<br />
                  Part 2: AI 도구 실습
                </p>
              </div>

              {/* 특전 2 */}
              <div style={{
                background: 'rgba(251, 191, 36, 0.2)',
                padding: '25px',
                borderRadius: '15px',
                border: '2px solid #ffd60a',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🔴</div>
                <h4 style={{ color: '#ffd60a', fontWeight: '800', marginBottom: '10px', fontSize: '1.1rem' }}>
                  매주 라이브 (무료)
                </h4>
                <p style={{ color: '#a7f3d0', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  새로운 AI 도구 업데이트<br />
                  Q&A 및 실시간 피드백
                </p>
              </div>

              {/* 특전 3 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '25px',
                borderRadius: '15px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>👥</div>
                <h4 style={{ color: '#fff', fontWeight: '800', marginBottom: '10px', fontSize: '1.1rem' }}>
                  수강생 커뮤니티
                </h4>
                <p style={{ color: '#a7f3d0', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  함께 성장하는 네트워크<br />
                  멘토 제이와 직접 소통
                </p>
              </div>
            </div>
          </div>

          {/* 강의 차별화 포인트 */}
          <div style={{
            background: '#ffffff',
            padding: 'clamp(25px, 5vw, 50px)',
            borderRadius: '25px',
            marginBottom: 'clamp(30px, 6vw, 60px)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: '700',
              color: '#1b263b',
              textAlign: 'center',
              marginBottom: 'clamp(20px, 4vw, 40px)'
            }}>
              학습 방식의 차이
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(15px, 3vw, 30px)'
            }}>
              <div style={{
                padding: '30px',
                background: '#fef2f2',
                borderRadius: '15px',
                border: '1px solid #fecaca'
              }}>
                <h4 style={{ color: '#dc2626', marginBottom: '15px', fontWeight: '600' }}>❌ 일반 AI 강의</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.8', margin: '0', paddingLeft: '20px' }}>
                  <li>이론만 배우고 끝</li>
                  <li>도구 사용법만 설명</li>
                  <li>혼자 학습, 피드백 없음</li>
                  <li>도구가 바뀌면 강의가 무용지물</li>
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
                  <li><strong>수익화</strong> 목적의 콘텐츠 제작</li>
                  <li><strong>맨해튼 부동산</strong> 비즈니스 철학</li>
                  <li>매주 라이브로 <strong>최신 AI 도구</strong> 업데이트</li>
                  <li>수강생 커뮤니티 + 멘토 제이 직접 소통</li>
                  <li>4단계 성장 로드맵 제공</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 🎯 강의 상세 정보 섹션 */}
          <div style={{
            background: '#ffffff',
            padding: 'clamp(25px, 5vw, 50px)',
            borderRadius: '25px',
            marginBottom: 'clamp(20px, 4vw, 40px)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: '700',
              color: '#1b263b',
              textAlign: 'center',
              marginBottom: 'clamp(20px, 4vw, 40px)'
            }}>
              강의 상세 정보
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 'clamp(15px, 3vw, 30px)',
              marginBottom: 'clamp(20px, 4vw, 40px)'
            }}>
              {/* 강의 기본 정보 */}
              <div style={{
                background: '#f8fafc',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ color: '#1e40af', fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', fontWeight: '700', marginBottom: '15px' }}>
                  📊 강의 기본 정보
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0',
                  color: '#1b263b',
                  lineHeight: '2'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>총 강의 시간:</strong> 16시간 (16강의)
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>난이도:</strong> 초급~중급 (AI 경험 불필요)
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>수강 기간:</strong> 구매 후 3개월간
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
                <h4 style={{ color: '#16a34a', fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', fontWeight: '700', marginBottom: '15px' }}>
                  🎯 이런 분께 추천해요
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0',
                  color: '#1b263b',
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
                <h4 style={{ color: '#7c3aed', fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', fontWeight: '700', marginBottom: '15px' }}>
                  🚀 학습 완료 후 여러분은
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0',
                  color: '#1b263b',
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
              padding: 'clamp(20px, 4vw, 40px)',
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
                  background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
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
                  fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                  fontWeight: '800',
                  marginBottom: '20px',
                  lineHeight: '1.4'
                }}>
                  🤔 인공지능이 계속 업그레이드 되는데<br />어떻게 해야 하나요?
                </h4>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  lineHeight: '1.8',
                  marginBottom: '25px'
                }}>
                  ChatGPT, Claude, Gemini... <strong style={{ color: '#ffd60a' }}>매주 새로운 기능</strong>이 쏟아집니다.<br />
                  녹화 강의만으로는 <strong style={{ color: '#ffd60a' }}>최신 AI를 따라갈 수 없습니다.</strong><br /><br />
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
                  <h5 style={{ color: '#ffd60a', fontSize: 'clamp(1.05rem, 2.3vw, 1.3rem)', fontWeight: '700', marginBottom: '20px', textAlign: 'center' }}>
                    ✨ Step 1 구성
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                    gap: '20px'
                  }}>
                    <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '15px' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📚</div>
                      <div style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', marginBottom: '5px' }}>기본 코어 강의</div>
                      <div style={{ color: '#ffd60a', fontWeight: '800', fontSize: '1.5rem' }}>10개</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '5px' }}>3개월간 무제한 시청</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(251,191,36,0.15)', borderRadius: '15px', border: '2px solid rgba(251,191,36,0.4)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔴</div>
                      <div style={{ color: 'white', fontWeight: '700', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', marginBottom: '5px' }}>주간 라이브</div>
                      <div style={{ color: '#ffd60a', fontWeight: '800', fontSize: '1.5rem' }}>13회</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '5px' }}>3개월간 참여 가능</div>
                    </div>
                  </div>
                </div>

                {/* 가성비 계산 */}
                <div style={{
                  background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                  borderRadius: '20px',
                  padding: '25px 30px',
                  marginBottom: '20px'
                }}>
                  <h5 style={{ color: '#1e3a8a', fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', fontWeight: '800', marginBottom: '15px', textAlign: 'center' }}>
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
                      <div style={{ color: '#1e3a8a', fontSize: '0.9rem' }}>기본 강의 10개</div>
                      <div style={{ color: '#1e3a8a', fontWeight: '800', fontSize: 'clamp(1.05rem, 2.3vw, 1.3rem)' }}>+</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#1e3a8a', fontSize: '0.9rem' }}>라이브 13회</div>
                      <div style={{ color: '#1e3a8a', fontWeight: '800', fontSize: 'clamp(1.05rem, 2.3vw, 1.3rem)' }}>=</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#1e3a8a', fontSize: '0.9rem' }}>총 23개 콘텐츠</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', background: 'rgba(30, 58, 138, 0.15)', padding: '15px', borderRadius: '12px' }}>
                    <span style={{ color: '#1e3a8a', fontSize: '1rem' }}>95,000원 ÷ 23개 = </span>
                    <span style={{ color: '#1e40af', fontWeight: '900', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>4,130원</span>
                    <span style={{ color: '#1e3a8a', fontSize: '1rem' }}>/개</span>
                    <div style={{ color: '#1e3a8a', fontSize: '0.9rem', marginTop: '8px', fontWeight: '600' }}>
                      ☕ 커피 한 잔 가격으로 전문 강의 1개!
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
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>기본 콘텐츠 5개</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1b263b', marginBottom: '5px' }}>주간 라이브</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>매주 1회 진행</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1b263b', marginBottom: '5px' }}>다시보기</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>아카이브 무제한</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1b263b', marginBottom: '5px' }}>수강 기간</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>3개월간 접근</div>
                </div>
              </div>
            </div>
          </div>



          {/* 언론 보도 섹션 */}
          <div style={{
            background: '#ffffff',
            padding: 'clamp(30px, 6vw, 60px) clamp(20px, 4vw, 40px)',
            borderRadius: '25px',
            marginBottom: 'clamp(30px, 6vw, 60px)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(25px, 5vw, 50px)' }}>
              <h3 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                fontWeight: '800',
                marginBottom: '16px',
                color: '#1b263b'
              }}>
                📰 언론이 주목한 실화
              </h3>
              <p style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0'
              }}>
                맨해튼 부동산 거물과 AI 스타트업 창업자의 실제 이야기
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(20px, 4vw, 40px)',
              marginBottom: 'clamp(20px, 4vw, 40px)'
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
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                    fontWeight: '800',
                    marginBottom: '15px',
                    color: '#1b263b',
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
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                    fontWeight: '800',
                    marginBottom: '15px',
                    color: '#1b263b',
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
                fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
                fontWeight: '700',
                marginBottom: '15px',
                color: '#1b263b'
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
            padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 50px)',
            borderRadius: '30px',
            marginBottom: 'clamp(30px, 6vw, 60px)',
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
                marginBottom: 'clamp(30px, 6vw, 60px)',
                color: '#1b263b',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                대표 멘토 - 정원석 (Jay)
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
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
                  padding: 'clamp(20px, 4vw, 40px)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    marginBottom: '15px',
                    color: '#1b263b',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}>
                    정원석 (Jay)
                  </h3>
                  <p style={{
                    fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
                    marginBottom: '30px',
                    color: '#1e40af',
                    fontWeight: '600'
                  }}>
                    AI City Builders 대표 멘토
                  </p>

                  {/* 학력 정보 */}
                  <div style={{ marginBottom: '30px' }}>
                    <h5 style={{
                      fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
                      fontWeight: '700',
                      marginBottom: '15px',
                      color: '#1b263b',
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
                      fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
                      fontWeight: '700',
                      marginBottom: '15px',
                      color: '#1b263b',
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
                      fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
                      fontWeight: '700',
                      marginBottom: '15px',
                      color: '#1b263b',
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
                      fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                      lineHeight: '1.7',
                      color: '#1b263b',
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
            padding: 'clamp(25px, 5vw, 50px)',
            borderRadius: '25px',
            marginBottom: 'clamp(20px, 4vw, 40px)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: '700',
              color: '#1b263b',
              textAlign: 'center',
              marginBottom: 'clamp(20px, 4vw, 40px)'
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
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontWeight: '700',
                  marginBottom: '10px'
                }}>
                  Q. AI 경험이 전혀 없어도 따라할 수 있나요?
                </h4>
                <p style={{
                  color: '#1b263b',
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
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  fontWeight: '700',
                  marginBottom: '10px'
                }}>
                  Q. 수강료 외에 추가 비용이 발생하나요?
                </h4>
                <p style={{
                  color: '#1b263b',
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  A. 기본적으로는 추가 비용이 없습니다. 강의에서 사용하는 AI 도구들의
                  무료 버전으로도 충분히 학습할 수 있습니다.
                  더 고급 기능이 필요한 경우에만 선택적으로 유료 플랜을 이용하시면 됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* 커리큘럼 - Day 1-10 형식 */}
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '25px',
            padding: 'clamp(25px, 5vw, 50px)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              color: '#1b263b',
              fontSize: '2rem',
              fontWeight: '800',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              📚 커리큘럼
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
              marginBottom: 'clamp(20px, 4vw, 40px)',
              textAlign: 'center'
            }}>
              총 10일 · Part 1 (마인드) + Part 2 (실전)
            </p>

            {/* Part 1: 비즈니스 마인드 */}
            <div style={{ marginBottom: 'clamp(25px, 5vw, 40px)' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                color: 'white',
                padding: '20px 25px',
                borderRadius: '15px',
                marginBottom: '20px'
              }}>
                <h4 style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                  fontWeight: '800',
                  margin: '0 0 8px 0'
                }}>
                  🧠 Part 1 (Day 1-5)
                </h4>
                <p style={{
                  margin: '0',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  opacity: '0.9'
                }}>
                  AI 1인 기업가 비즈니스 마인드 - 단순히 AI로 콘텐츠를 만드는 것이 아니라, 어떻게 수익화하고 사업화할지 준비하는 단계
                </p>
              </div>

              {/* Day 1-5 */}
              {[
                { day: 1, title: '프롤로그: 맨해튼 부자 삼촌의 교훈', subtitle: '맨해튼 부동산 거물 삼촌의 교훈과 AI 시대 재해석' },
                { day: 2, title: '경제적 자유: 잠자는 동안에도 돈이 들어오는 구조', subtitle: '부동산 vs 콘텐츠, 경제적 자유의 새로운 정의 | AI 기반 콘텐츠 청사진 만들기' },
                { day: 3, title: '당신의 디지털 건물에는 어떤 사람이 거주하나?', subtitle: '글로벌 CPM과 수익성 분석 | AI로 타겟 고객 심층 분석하기' },
                { day: 4, title: '몇 층짜리 디지털 건물을 세울 것인가?', subtitle: '대중형/니치형/혼합형 전략 | AI로 시장 분석 & 건물 콘셉트 설계' },
                { day: 5, title: 'AI 건물주가 되기: 유튜브 채널 만들기', subtitle: '유튜브 채널 생성 | Gemini로 프로필/배너 제작 | 채널 설정 완료' }
              ].map((item) => (
                <div
                  key={item.day}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px'
                  }}
                >
                  <div style={{
                    backgroundColor: '#1e40af',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {item.day}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{
                      color: '#1b263b',
                      marginBottom: '6px',
                      fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                      fontWeight: '700'
                    }}>
                      Day {item.day}: {item.title}
                    </h5>
                    <p style={{
                      color: '#64748b',
                      fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
                      margin: '0',
                      lineHeight: '1.5'
                    }}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Part 2: 실전 콘텐츠 제작 */}
            <div style={{ marginBottom: 'clamp(25px, 5vw, 40px)' }}>
              <div style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                padding: '20px 25px',
                borderRadius: '15px',
                marginBottom: '20px'
              }}>
                <h4 style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                  fontWeight: '800',
                  margin: '0 0 8px 0'
                }}>
                  🛠️ Part 2 (Day 6-10)
                </h4>
                <p style={{
                  margin: '0',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  opacity: '0.9'
                }}>
                  실전! AI 콘텐츠 제작 - 배운 마인드를 바탕으로 실제 수익형 콘텐츠를 만들고 첫 월세를 받는 단계
                </p>
              </div>

              {/* Day 6-10 */}
              {[
                { day: 6, title: 'AI 멘토 제이의 이미지 생성의 정석', subtitle: '프롬프트 엔지니어링 & Google Colab 실습 | 코드 보고 쫄지 않기' },
                { day: 7, title: 'AI 멘토 제이의 영상 생성의 정석', subtitle: 'Google Veo로 텍스트만으로 영상 만들기 | 쉬운 방법 & 어려운 방법' },
                { day: 8, title: '[시공] AI 4단계 건축 워크플로우', subtitle: '바이럴 숏폼 & 고품질 롱폼 제작 | 멀티 플랫폼 동시 입점 전략' },
                { day: 9, title: '[준공식] 콘텐츠 업로드 & 데이터 분석', subtitle: '핵심 지표 읽는 법 | AI 감성 분석으로 건물 리모델링' },
                { day: 10, title: '[첫 월세] 수익 시스템 구축 완성', subtitle: '애드센스 + 제휴마케팅 + 멤버십 | 허브-앤-스포크 자동화 시스템' }
              ].map((item) => (
                <div
                  key={item.day}
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px'
                  }}
                >
                  <div style={{
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {item.day}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{
                      color: '#1b263b',
                      marginBottom: '6px',
                      fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                      fontWeight: '700'
                    }}>
                      Day {item.day}: {item.title}
                    </h5>
                    <p style={{
                      color: '#64748b',
                      fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
                      margin: '0',
                      lineHeight: '1.5'
                    }}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 고정 결제 버튼 (Floating CTA) 컴포넌트
const FloatingPaymentButton: React.FC<{ onClick: () => void; isPaidUser: boolean; price: number }> = ({ onClick, isPaidUser, price }) => {
  if (isPaidUser) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
      padding: '15px 20px',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      borderTop: '3px solid #ffd60a'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <span style={{
          color: '#ffd60a',
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          fontWeight: '900'
        }}>
          ₩{price.toLocaleString()}
        </span>
        <span style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
          fontWeight: '600'
        }}>
          3개월 수강권
        </span>
      </div>
      <button
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
          color: '#1e3a8a',
          border: 'none',
          padding: 'clamp(12px, 3vw, 16px) clamp(25px, 5vw, 40px)',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          fontWeight: '900',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(255, 214, 10, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'pulse 2s infinite'
        }}
      >
        <span>🚀</span>
        지금 결제하기
      </button>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export { FloatingPaymentButton };
export default AIBuildingCoursePage;
