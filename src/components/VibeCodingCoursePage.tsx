import React, { useState, useEffect } from 'react';
import { Clock, Users, Star, CheckCircle, Play } from 'lucide-react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { vibeCodingCourse } from '../data/courseData';

interface VibeCodingCoursePageProps {
  onBack: () => void;
}

const VibeCodingCoursePage: React.FC<VibeCodingCoursePageProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tossPayments, setTossPayments] = useState<any>(null);

  // 토스페이먼츠 테스트 클라이언트 키
  const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

  const course = vibeCodingCourse;
  const originalPrice = 398000;
  const currentPrice = 199000;

  useEffect(() => {
    const initializeTossPayments = async () => {
      try {
        const tossPaymentsInstance = await loadTossPayments(clientKey);
        setTossPayments(tossPaymentsInstance);
      } catch (error) {
        console.error('토스페이먼츠 초기화 실패:', error);
      }
    };

    initializeTossPayments();
  }, []);

  const handlePayment = async () => {
    if (!tossPayments) {
      alert('결제 시스템을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const orderId = `vibecoding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await tossPayments.requestPayment('카드', {
        amount: currentPrice,
        orderId: orderId,
        orderName: course.title,
        customerName: '클래튼 수강생',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error('결제 오류:', error);
      alert('결제가 취소되었습니다.');
    } finally {
      setIsLoading(false);
    }
  };

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