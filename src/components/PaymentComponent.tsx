import React, { useEffect, useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

interface PaymentComponentProps {
  courseTitle: string;
  price: number;
  onClose: () => void;
  onSuccess: (paymentData: any) => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ 
  courseTitle, 
  price, 
  onClose, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tossPayments, setTossPayments] = useState<any>(null);

  // 토스페이먼츠 테스트 클라이언트 키
  const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

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
    // 로그인 체크
    const userInfo = localStorage.getItem('clathon_user');
    if (!userInfo) {
      alert('결제하려면 먼저 로그인해주세요!');
      return;
    }

    if (!tossPayments) {
      alert('결제 시스템을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 주문 ID 생성 (실제로는 서버에서 생성해야 함)
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 결제 요청
      const payment = tossPayments.payment({
        amount: price,
        orderId: orderId,
        orderName: courseTitle,
        customerName: '클래튼 수강생',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      // 카드 결제 실행
      await payment.requestPayment('카드', {
        // 추가 결제 정보
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

  const handleOtherPayment = async (method: string) => {
    // 로그인 체크
    const userInfo = localStorage.getItem('clathon_user');
    if (!userInfo) {
      alert('결제하려면 먼저 로그인해주세요!');
      return;
    }

    if (!tossPayments) return;

    setIsLoading(true);

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const payment = tossPayments.payment({
        amount: price,
        orderId: orderId,
        orderName: courseTitle,
        customerName: '클래튼 수강생',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      if (method === '계좌이체') {
        await payment.requestPayment('계좌이체');
      } else if (method === '가상계좌') {
        await payment.requestPayment('가상계좌', {
          virtualAccount: {
            cashReceipt: {
              type: '소득공제',
            },
            customerMobilePhone: '010-1234-5678',
          },
        });
      } else if (method === '토스페이') {
        await payment.requestPayment('토스페이');
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
    <div className="payment-modal">
      <div className="payment-modal-overlay" onClick={onClose}></div>
      <div className="payment-modal-content">
        <div className="payment-header">
          <h3>수강신청</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="payment-info">
          <div className="course-info">
            <h4>{courseTitle}</h4>
            <div className="price-display">
              <span className="price">₩{price.toLocaleString()}</span>
              <span className="original-price">₩299,000</span>
              <span className="discount">33% 할인</span>
            </div>
          </div>
        </div>

        <div className="payment-methods">
          <h5>결제 방법 선택</h5>
          
          <button 
            className="payment-btn primary"
            onClick={handlePayment}
            disabled={isLoading || !tossPayments}
          >
            {isLoading ? '결제 진행 중...' : '💳 신용카드/체크카드'}
          </button>

          <button 
            className="payment-btn"
            onClick={() => handleOtherPayment('토스페이')}
            disabled={isLoading || !tossPayments}
          >
            📱 토스페이
          </button>

          <button 
            className="payment-btn"
            onClick={() => handleOtherPayment('계좌이체')}
            disabled={isLoading || !tossPayments}
          >
            🏦 계좌이체
          </button>

          <button 
            className="payment-btn"
            onClick={() => handleOtherPayment('가상계좌')}
            disabled={isLoading || !tossPayments}
          >
            🏧 가상계좌
          </button>
        </div>

        <div className="payment-notice">
          <p>⚠️ 테스트 환경입니다. 실제 결제되지 않습니다.</p>
          <p>• 카드번호: 아무 유효한 카드번호 사용 가능</p>
          <p>• 유효기간: 미래 날짜 입력</p>
          <p>• CVC: 임의 3자리 숫자</p>
        </div>

        <div className="payment-footer">
          <p>안전한 결제를 위해 토스페이먼츠를 사용합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent; 