import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Calendar, CheckCircle, Play } from 'lucide-react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { premiumCourse } from '../data/courseData';
import AzureTableService from '../services/azureTableService';

interface PromptEngineeringMasterPageProps {
  onBack: () => void;
}

const PromptEngineeringMasterPage: React.FC<PromptEngineeringMasterPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tossPayments, setTossPayments] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // 토스페이먼츠 테스트 클라이언트 키
  const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

  const course = premiumCourse;
  const originalPrice = 499000;
  const earlyBirdPrice = 299000;
  const discount = Math.round(((originalPrice - earlyBirdPrice) / originalPrice) * 100);

  // 런칭 일정: 2025년 9월 1일
  const launchDate = new Date('2025-09-01T00:00:00').getTime();

  useEffect(() => {
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
  }, []);

  // 카운트다운 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const handleEarlyBirdPayment = async () => {
    // 로그인 체크
    const userInfo = localStorage.getItem('clathon_user');
    if (!userInfo) {
      alert('결제하려면 먼저 로그인해주세요!');
      navigate('/login');
      return;
    }

    if (!tossPayments) {
      alert('결제 시스템을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 토스페이먼츠 객체 확인용 디버깅
    console.log('tossPayments 객체:', tossPayments);
    console.log('tossPayments.payment 함수:', tossPayments.payment);

    setIsLoading(true);

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 토스페이먼츠 API 방식 확인 및 다양한 방식 시도
      if (typeof tossPayments.payment === 'function') {
        // 방식 1: PaymentComponent와 동일한 방식
        const payment = tossPayments.payment({
          amount: earlyBirdPrice,
          orderId: orderId,
          orderName: `[얼리버드] ${course.title}`,
          customerName: '클래튼 수강생',
          successUrl: `${window.location.origin}/payment/success?course=prompt-engineering`,
          failUrl: `${window.location.origin}/payment/fail`,
        });

        await payment.requestPayment('카드', {
          card: {
            useEscrow: false,
          },
        });
      } else if (typeof tossPayments.requestPayment === 'function') {
        // 방식 2: 직접 requestPayment 호출
        await tossPayments.requestPayment('카드', {
          amount: earlyBirdPrice,
          orderId: orderId,
          orderName: `[얼리버드] ${course.title}`,
          customerName: '클래튼 수강생',
          successUrl: `${window.location.origin}/payment/success?course=prompt-engineering`,
          failUrl: `${window.location.origin}/payment/fail`,
          card: {
            useEscrow: false,
          },
        });
      } else {
        throw new Error('토스페이먼츠 API 함수를 찾을 수 없습니다.');
      }

    } catch (error: any) {
      console.error('결제 실패:', error);
      if (error.code === 'USER_CANCEL') {
        alert('결제가 취소되었습니다.');
      } else {
        alert(`결제 중 오류가 발생했습니다: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="masterclass-container">
      {/* 헤더 */}
      <header className="masterclass-header-original">
        <div className="header-content">
          <div className="header-left">
            <div className="logo" onClick={onBack} style={{ cursor: 'pointer' }}>
              <span className="logo-icon">C</span>
              <span className="logo-text">CLATHON</span>
            </div>
          </div>
          
          <div className="header-right">
            <button className="cta-button" onClick={onBack}>홈으로 돌아가기</button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <div className="course-layout">
        {/* 왼쪽 메인 콘텐츠 */}
        <div className="course-main">
          {/* 히어로 섹션 */}
          <section className="course-hero">
            <div className="hero-content">
              {/* Coming Soon 배지 */}
              <div className="coming-soon-badge" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                🚀 COMING SOON
              </div>
              
              <h1 className="hero-title">
                {course.title}
              </h1>
              <p className="hero-subtitle">
                {course.description}
              </p>
              
              {/* 강의 메타 정보 */}
              <div className="course-meta-info">
                <div className="meta-item">
                  <Star size={16} />
                  <span>프리미엄</span>
                </div>
                <div className="meta-item">
                  <Users size={16} />
                  <span>정원석</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{course.totalDuration}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>2025.09.01 런칭</span>
                </div>
              </div>

              {/* 런칭 카운트다운 */}
              <div className="launch-countdown-section" style={{ 
                background: 'rgba(102, 126, 234, 0.1)', 
                padding: '30px', 
                borderRadius: '15px', 
                marginTop: '30px',
                textAlign: 'center' 
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>런칭까지 남은 시간</h3>
                <div className="countdown-display" style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '20px' 
                }}>
                  <div className="countdown-item" style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: '700', 
                      color: '#667eea',
                      marginBottom: '5px' 
                    }}>
                      {timeLeft.days}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>일</div>
                  </div>
                  <div className="countdown-item" style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: '700', 
                      color: '#667eea',
                      marginBottom: '5px' 
                    }}>
                      {timeLeft.hours}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>시간</div>
                  </div>
                  <div className="countdown-item" style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: '700', 
                      color: '#667eea',
                      marginBottom: '5px' 
                    }}>
                      {timeLeft.minutes}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>분</div>
                  </div>
                  <div className="countdown-item" style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: '700', 
                      color: '#667eea',
                      marginBottom: '5px' 
                    }}>
                      {timeLeft.seconds}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>초</div>
                  </div>
                </div>
              </div>

              {/* 얼리버드 특가 섹션 */}
              <div className="pricing-section" style={{ 
                marginTop: '40px', 
                padding: '30px', 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '15px',
                textAlign: 'center' 
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>🔥 얼리버드 특가</h3>
                
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
                      background: '#ff6b6b', 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem' 
                    }}>
                      {discount}% 할인
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                    ₩{earlyBirdPrice.toLocaleString()}
                  </div>
                </div>

                {/* 얼리버드 혜택 */}
                <div className="benefits-list" style={{ 
                  textAlign: 'left', 
                  maxWidth: '400px', 
                  margin: '0 auto 30px' 
                }}>
                  {[
                    '최대 40% 할인가로 수강',
                    '2025년 9월 1일 오픈과 동시에 수강',
                                         '프리미엄 강의 3개월 수강권',
                    '정원석 강사의 1:1 질의응답'
                  ].map((benefit, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      marginBottom: '8px' 
                    }}>
                      <CheckCircle size={16} color="#10b981" />
                      <span style={{ fontSize: '0.9rem' }}>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* 사전예약 버튼 - 메인페이지와 동일한 스타일 */}
                <button 
                  className="watch-trailer-btn premium-btn"
                  onClick={handleEarlyBirdPayment}
                  disabled={isLoading || !tossPayments}
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '15px 30px',
                    fontSize: '1.1rem'
                  }}
                >
                  <Play size={16} />
                  {isLoading ? '결제 진행 중...' : '🔥 사전예약'}
                </button>

                <p style={{ fontSize: '0.8rem', opacity: '0.7', marginTop: '15px' }}>
                  💳 토스페이먼츠로 안전하게 결제됩니다
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* 오른쪽 사이드바 - 커리큘럼 */}
        <div className="course-sidebar">
          <div className="sidebar-header">
            <h3>커리큘럼 미리보기</h3>
            <p>총 {course.lessons.length}강의 체계적인 학습 과정</p>
          </div>
          
          <div className="lesson-list">
            {course.lessons.slice(0, 8).map((lesson, index) => (
              <div 
                key={lesson.id} 
                className="lesson-item coming-soon-lesson"
                style={{ opacity: '0.8' }}
              >
                <div className="lesson-item-content">
                  <div className="lesson-number">
                    {index + 1}
                  </div>
                  <div className="lesson-info">
                    <h4 className="lesson-title">{lesson.title}</h4>
                    <div className="lesson-meta">
                      <span className="lesson-duration">
                        <Clock size={14} />
                        {lesson.duration}
                      </span>
                      {lesson.hasQuiz && (
                        <span className="lesson-quiz">
                          퀴즈 포함
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="lesson-status">
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid #667eea', 
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
              <p>+ {course.lessons.length - 8}개 강의 더</p>
              <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                2025년 9월 1일 런칭과 함께 공개!
              </p>
            </div>
          </div>

          {/* 런칭 정보 박스 */}
          <div className="launch-info-box" style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <Calendar size={24} style={{ marginBottom: '10px' }} />
            <h4 style={{ marginBottom: '10px' }}>런칭 일정</h4>
            <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>
              2025년 9월 1일 (월)
            </p>
            <p style={{ fontSize: '0.9rem', marginTop: '5px', opacity: '0.9' }}>
              오전 10시 정식 오픈
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEngineeringMasterPage; 