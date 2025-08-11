import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Star, CheckCircle, Play } from 'lucide-react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { vibeCodingCourse } from '../data/courseData';
import AzureTableService from '../services/azureTableService';

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

  useEffect(() => {
    const checkAccessAndInitialize = async () => {
      const userInfo = localStorage.getItem('clathon_user');
      
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          const courseId = 'vibe-coding';
          
          // Azure에서 수강 권한 확인
          const accessResult = await AzureTableService.checkCourseAccess(user.userId, courseId);
          setHasAccess(accessResult.hasAccess);
          
          console.log('🔍 수강 권한 확인:', accessResult);
        } catch (error) {
          console.error('수강 권한 확인 실패:', error);
        }
      }
      
      setIsCheckingAccess(false);
    };

    const initializeTossPayments = async () => {
      try {
        const tossPaymentsInstance = await loadTossPayments(clientKey);
        setTossPayments(tossPaymentsInstance);
      } catch (error) {
        console.error('토스페이먼츠 초기화 실패:', error);
      }
    };

    checkAccessAndInitialize();
    initializeTossPayments();
  }, []);

  const handlePayment = async () => {
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
      
    } catch (error: any) {
      console.error('결제 오류:', error);
      if (error?.code === 'USER_CANCEL') {
        alert('결제가 취소되었습니다.');
      } else {
        alert('결제 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 중일 때
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
          {hasAccess ? (
            // 수강 권한이 있는 경우 - 실제 강의 내용
            <div className="enrolled-content">
              <h1 className="enrolled-title">🎉 {course.title}</h1>
              <p className="enrolled-message">수강 중인 강의입니다. 강의를 시작해보세요!</p>
              
              <div className="course-curriculum">
                <h2>📚 강의 커리큘럼</h2>
                <div className="lesson-list">
                  <div className="lesson-item">
                    <Play size={20} />
                    <span>1. Cursor AI 기본 설정과 시작하기</span>
                    <span className="lesson-duration">45분</span>
                  </div>
                  <div className="lesson-item">
                    <Play size={20} />
                    <span>2. MCP로 Figma 연동하여 디자인 자동화</span>
                    <span className="lesson-duration">60분</span>
                  </div>
                  <div className="lesson-item">
                    <Play size={20} />
                    <span>3. Supabase 연동 및 백엔드 구축</span>
                    <span className="lesson-duration">75분</span>
                  </div>
                  <div className="lesson-item">
                    <Play size={20} />
                    <span>4. 수익화 전략과 런칭 가이드</span>
                    <span className="lesson-duration">90분</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // 수강 권한이 없는 경우 - 강의 소개 및 결제
            <div className="course-intro-section">
              <div className="course-info">
                <div className="course-badge">🚀 바이브코딩 마스터클래스</div>
                <h1 className="course-title">{course.title}</h1>
                <p className="course-description">Cursor AI로 나 혼자 끝내는 1인 개발 수익화</p>
                
                <div className="course-stats">
                  <div className="stat-item">
                    <Clock size={20} />
                    <span>4시간 30분</span>
                  </div>
                  <div className="stat-item">
                    <Users size={20} />
                    <span>1,250명 수강중</span>
                  </div>
                  <div className="stat-item">
                    <Star size={20} />
                    <span>4.9 ★</span>
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
                  </div>
                  
                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="enroll-button"
                  >
                    {isLoading ? '결제 처리 중...' : '💎 지금 수강하기'}
                  </button>
                  
                  <div className="purchase-note">
                    ⏰ 한정 할인가 • 7일 무조건 환불 보장
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VibeCodingCoursePage;