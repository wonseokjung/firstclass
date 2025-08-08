import React, { useState, useEffect } from 'react';
import { Clock, Users, Star, CheckCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { vibeCodingCourse } from '../data/courseData';
import { ClathonAzureService } from '../services/azureTableService';

interface VibeCodingCoursePageProps {
  onBack: () => void;
}

const VibeCodingCoursePage: React.FC<VibeCodingCoursePageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tossPayments, setTossPayments] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // 토스페이먼츠 테스트 클라이언트 키
  const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

  const course = vibeCodingCourse;
  const originalPrice = 398000;
  const currentPrice = 199000;

  // 🔒 수강 권한 확인
  useEffect(() => {
    const checkAccess = async () => {
      const userInfo = localStorage.getItem('clathon_user');
      if (!userInfo) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userInfo);
      const courseId = '바이브코딩으로-돈벌기';

      try {
        const accessGranted = await ClathonAzureService.hasAccess(user.userId, courseId);
        setHasAccess(accessGranted); // 결제 여부와 상관없이 페이지는 보여줌
      } catch (error) {
        console.error('수강 권한 확인 실패:', error);
        setHasAccess(false);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [navigate]);

  useEffect(() => {
    const initializeTossPayments = async () => {
      try {
        const tossPaymentsInstance = await loadTossPayments(clientKey);
        setTossPayments(tossPaymentsInstance);
      } catch (error) {
        console.error('토스페이먼츠 초기화 실패:', error);
      }
    };

    if (hasAccess) {
      initializeTossPayments();
    }
  }, [hasAccess]);

  const handlePayment = async () => {
    if (!tossPayments) {
      alert('결제 시스템을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const orderId = `vibecoding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const paymentResult = await tossPayments.requestPayment('카드', {
        amount: currentPrice,
        orderId: orderId,
        orderName: course.title,
        customerName: '클래튼 수강생',
        successUrl: `${window.location.origin}/payment/success?course=vibe-coding`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      // 결제 성공 시 Azure에 구매 정보 저장 (실제로는 successUrl에서 처리됨)
      console.log('결제 요청 완료:', paymentResult);
      
    } catch (error) {
      console.error('결제 오류:', error);
      if (error.code === 'USER_CANCEL') {
        alert('결제가 취소되었습니다.');
      } else {
        alert('결제 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 접근 권한 확인 중
  if (isCheckingAccess) {
    return (
      <div className="course-page">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">수강 권한을 확인하는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 💳 결제가 필요한 경우 - 결제 페이지 표시
  if (!hasAccess) {
    return (
      <div className="course-page">
        {/* 헤더 */}
        <header className="course-header">
          <div className="container">
            <button onClick={onBack} className="back-button">
              ← 돌아가기
            </button>
            <div className="header-actions">
              <button className="header-btn">공유</button>
            </div>
          </div>
        </header>

        {/* 강의 소개 섹션 */}
        <div className="course-intro">
          <div className="container">
            <div className="intro-content">
              <div className="intro-text">
                <h1 className="course-title">{course.title}</h1>
                <p className="course-subtitle">{course.subtitle}</p>
                <div className="course-stats">
                  <div className="stat">
                    <Clock size={16} />
                    <span>20+ 시간</span>
                  </div>
                  <div className="stat">
                    <Users size={16} />
                    <span>1,200+ 수강생</span>
                  </div>
                  <div className="stat">
                    <Star size={16} />
                    <span>4.9 (850+ 리뷰)</span>
                  </div>
                </div>
                
                {/* 가격 정보 */}
                <div className="pricing-section">
                  <div className="price-display">
                    <span className="current-price">₩{currentPrice.toLocaleString()}</span>
                    <span className="original-price">₩{originalPrice.toLocaleString()}</span>
                    <span className="discount-badge">50% 할인</span>
                  </div>
                  
                  {/* 결제 버튼 */}
                  <button 
                    className="enroll-button"
                    onClick={handlePayment}
                    disabled={isLoading}
                  >
                    {isLoading ? '결제 처리 중...' : '지금 수강하기'}
                  </button>
                  
                  <div className="payment-info">
                    <p>✅ 평생 소장 가능</p>
                    <p>✅ 3개월 수강 기간</p>
                    <p>✅ 모바일/PC 모든 기기 지원</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 커리큘럼 미리보기 */}
        <div className="curriculum-preview">
          <div className="container">
            <h2>🎯 이런 것들을 배워요</h2>
            <div className="preview-grid">
              <div className="preview-item">
                <CheckCircle className="icon" />
                <h3>Cursor AI 완전 정복</h3>
                <p>AI 코딩 도구의 모든 기능을 마스터합니다</p>
              </div>
              <div className="preview-item">
                <CheckCircle className="icon" />
                <h3>1인 개발 수익화</h3>
                <p>혼자서도 월 1000만원 수익을 만드는 방법</p>
              </div>
              <div className="preview-item">
                <CheckCircle className="icon" />
                <h3>실전 프로젝트</h3>
                <p>수익화 가능한 실제 프로젝트를 완성합니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-page">
      {/* 헤더 */}
      <header className="course-header">
        <div className="container">
          <button onClick={onBack} className="back-button">
            ← 돌아가기
          </button>
          <div className="logo">CLATHON</div>
        </div>
      </header>

      <div className="course-content">
        <div className="container">
          {/* 강의 소개 섹션 */}
          <div className="course-intro-section">
            <div className="course-info">
              <div className="course-badge">🚀 바이브코딩 마스터클래스</div>
              <h1 className="course-title">{course.title}</h1>
              <p className="course-description">{course.description}</p>
              
              <div className="course-stats">
                <div className="stat-item">
                  <Clock size={20} />
                  <span>{course.totalDuration}</span>
                </div>
                <div className="stat-item">
                  <Users size={20} />
                  <span>{course.studentCount}명 수강중</span>
                </div>
                <div className="stat-item">
                  <Star size={20} />
                  <span>{course.rating} ★</span>
                </div>
              </div>

              <div className="course-highlights">
                <h3>🎯 이 강의로 얻을 수 있는 것</h3>
                <ul>
                  <li><CheckCircle size={16} /> Cursor AI로 개발 속도 10배 향상</li>
                  <li><CheckCircle size={16} /> MVP부터 수익화까지 완전한 로드맵</li>
                  <li><CheckCircle size={16} /> 실제 수익 창출 전략과 노하우</li>
                  <li><CheckCircle size={16} /> Figma MCP + Supabase 최신 기술 스택</li>
                </ul>
              </div>
            </div>

            <div className="course-purchase">
              <div className="price-card">
                <div className="price-info">
                  <div className="discount-text">패스트캠퍼스 대비 50% 할인</div>
                  <div className="price-display">
                    <span className="original-price">₩{originalPrice.toLocaleString()}</span>
                    <span className="current-price">₩{currentPrice.toLocaleString()}</span>
                  </div>
                  <div className="benefits">💎 평생 소장 • 무제한 수강</div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="purchase-button"
                >
                  {isLoading ? '결제 처리 중...' : '🚀 바로 시작하기'}
                </button>

                <div className="guarantees">
                  <div className="guarantee-item">
                    <CheckCircle size={16} />
                    <span>7일 무조건 환불 보장</span>
                  </div>
                  <div className="guarantee-item">
                    <CheckCircle size={16} />
                    <span>수강 중 언제든 질문 가능</span>
                  </div>
                  <div className="guarantee-item">
                    <CheckCircle size={16} />
                    <span>실전 프로젝트 코드 제공</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 강의 목차 */}
          <div className="curriculum-section">
            <h2>🎯 강의 커리큘럼</h2>
            <div className="lesson-list">
              {course.lessons.map((lesson, index) => (
                <div key={lesson.id} className="lesson-item">
                  <div className="lesson-number">{index + 1}</div>
                  <div className="lesson-content">
                    <h3 className="lesson-title">{lesson.title}</h3>
                    <p className="lesson-description">{lesson.description}</p>
                    <div className="lesson-meta">
                      <Clock size={16} />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                  <button className="lesson-play-button">
                    <Play size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 강사 소개 */}
          <div className="instructor-section">
            <h3>👨‍💻 강사 소개</h3>
            <div className="instructor-card">
              <div className="instructor-avatar">JAY</div>
              <div className="instructor-info">
                <h4 className="instructor-name">AI 멘토 JAY</h4>
                <div className="instructor-credentials">
                  <p>🚀 4년간 AI 스타트업 운영 경험</p>
                  <p>💰 1인 개발자로 월 1000만원+ 수익 달성</p>
                  <p>🎯 50만+ 구독자 AI 교육 콘텐츠 크리에이터</p>
                  <p>⚡ Cursor AI 국내 최초 전문 강의 개설</p>
                </div>
              </div>
            </div>
          </div>

          {/* 마지막 CTA */}
          <div className="final-cta">
            <h3>🔥 지금 바로 시작하세요!</h3>
            <p>매일 늦춰질수록 기회는 사라집니다.<br/>바이브코딩으로 당신의 아이디어를 수익으로 바꿔보세요!</p>
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="final-cta-button"
            >
              💎 ₩{currentPrice.toLocaleString()} • 바로 시작하기
            </button>
            <div className="cta-note">⏰ 한정 할인가 • 7일 무조건 환불 보장</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeCodingCoursePage; 