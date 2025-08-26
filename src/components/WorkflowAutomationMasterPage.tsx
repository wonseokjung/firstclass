import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Calendar, CheckCircle, Play } from 'lucide-react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { premiumCourse } from '../data/courseData';
import AzureTableService from '../services/azureTableService';
import NavigationBar from './NavigationBar';
import { getPaymentConfig } from '../config/payment';

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
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // 토스페이먼츠 설정 불러오기
  const { clientKey } = getPaymentConfig();

  // OPAL 업무 자동화 강의 데이터
  const course = {
    ...premiumCourse,
    title: 'Google OPAL 업무 자동화 마스터',
    lessons: [
      {
        id: 1,
        title: '1강. Google OPAL 소개와 기본 개념',
        duration: '45분',
        description: 'Google OPAL의 혁신적인 AI 미니앱 개발 도구를 이해하고, 자연어로 워크플로우를 만드는 기본 개념을 학습합니다.',
        hasQuiz: true
      },
      {
        id: 2,
        title: '2강. 첫 번째 AI 미니앱 만들기',
        duration: '55분',
        description: '간단한 텍스트 처리 앱부터 시작해서 OPAL의 시각적 편집기 사용법을 마스터합니다.',
        hasQuiz: true
      },
      {
        id: 3,
        title: '3강. 워크플로우 체이닝과 프롬프트 연결',
        duration: '1시간 10분',
        description: '여러 AI 모델과 프롬프트를 연결하여 복잡한 업무 처리 워크플로우를 구축하는 방법을 배웁니다.',
        hasQuiz: true
      },
      {
        id: 4,
        title: '4강. 데이터 처리와 분석 자동화',
        duration: '1시간',
        description: '스프레드시트 데이터를 AI로 분석하고 인사이트를 자동 생성하는 미니앱을 만들어봅니다.',
        hasQuiz: true
      },
      {
        id: 5,
        title: '5강. 콘텐츠 생성 워크플로우 구축',
        duration: '50분',
        description: '블로그, 소셜미디어, 이메일 콘텐츠를 자동 생성하는 마케팅 도구를 OPAL로 개발합니다.',
        hasQuiz: true
      },
      {
        id: 6,
        title: '6강. 고객 서비스 챗봇 만들기',
        duration: '1시간 15분',
        description: 'FAQ부터 복잡한 문의까지 처리하는 스마트 고객 서비스 시스템을 구축합니다.',
        hasQuiz: true
      },
      {
        id: 7,
        title: '7강. 업무 보고서 자동화',
        duration: '45분',
        description: '주간/월간 보고서를 자동으로 생성하고 시각화하는 업무 도구를 개발합니다.',
        hasQuiz: false
      },
      {
        id: 8,
        title: '8강. 앱 공유와 배포 전략',
        duration: '40분',
        description: '만든 OPAL 앱을 팀원들과 공유하고 조직 내 확산시키는 전략을 학습합니다.',
        hasQuiz: false
      },
      {
        id: 9,
        title: '9강. 고급 API 연동과 외부 도구 활용',
        duration: '1시간 5분',
        description: 'Google Workspace, Slack, Notion 등 외부 도구와 연동하여 완전한 업무 자동화를 구현합니다.',
        hasQuiz: true
      },
      {
        id: 10,
        title: '10강. 실무 프로젝트: 종합 업무 자동화 시스템',
        duration: '1시간 30분',
        description: '실제 회사 업무 프로세스를 분석하고 OPAL로 완전 자동화하는 종합 프로젝트를 진행합니다.',
        hasQuiz: false
      }
    ]
  };
  const originalPrice = 499000;
  const earlyBirdPrice = 299000;
  const discount = Math.round(((originalPrice - earlyBirdPrice) / originalPrice) * 100);

  // 런칭 일정: 2025년 9월 1일
  const launchDate = new Date('2025-09-01T00:00:00').getTime();

  useEffect(() => {
    // sessionStorage에서 로그인 상태 확인
    const checkLoginStatus = async () => {
      const storedUserInfo = sessionStorage.getItem('clathon_user_session');
      setIsLoggedIn(!!storedUserInfo);
      
      if (storedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          
          // 수강 상태 확인
          setCheckingEnrollment(true);
          const enrolled = await AzureTableService.isUserEnrolledInCourse(
            parsedUserInfo.email, 
            'workflow-automation'
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

  const handleLoginRequired = () => {
    alert('결제하려면 먼저 로그인해주세요!');
    navigate('/login');
  };

  const handleEarlyBirdPayment = async () => {
    // 로그인 체크
    const userInfo = sessionStorage.getItem('clathon_user_session');
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
        successUrl: `${window.location.origin}/payment/success?course=workflow-automation`,
        failUrl: `${window.location.origin}/payment/fail`,
        card: {
          useEscrow: false,
        },
      });

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
      {/* 통일된 네비게이션바 */}
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="Workflow Automation Master"
      />

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
                Google OPAL 업무 자동화 마스터
              </h1>
              <p className="hero-subtitle">
                🤖 코드 없이 자연어로 만드는 AI 미니앱 워크플로우! Google OPAL로 업무 자동화부터 AI 도구 체이닝까지 완벽 마스터하세요
              </p>
              
              {/* 강의 메타 정보 */}
              <div className="course-meta-info">
                <div className="meta-item">
                  <Star size={16} />
                  <span>프리미엄</span>
                </div>
                <div className="meta-item">
                  <Users size={16} />
                  <span>Google OPAL 전문가</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>8시간 30분</span>
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
                   !isLoggedIn ? '🔒 로그인 후 이용 가능' : 
                   isAlreadyEnrolled ? '✅ 이미 수강 중입니다' : '🔥 사전예약'}
                </button>

                <p style={{ fontSize: '0.8rem', opacity: '0.7', marginTop: '15px' }}>
                  {isAlreadyEnrolled 
                    ? '🎓 이미 수강 중인 강좌입니다' :
                   isLoggedIn 
                    ? '💳 토스페이먼츠로 안전하게 결제됩니다' 
                    : '🔐 먼저 로그인한 후 결제해주세요'}
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

export default WorkflowAutomationMasterPage; 