import React, { useEffect, useState } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { getPaymentConfig, createPaymentRequest, validateApiKey } from '../../../config/payment';

interface PaymentComponentProps {
  courseId: string;
  courseTitle: string;
  price: number;
  userInfo: any;
  onClose: () => void;
  onSuccess: (paymentData: any) => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ 
  courseId,
  courseTitle, 
  price, 
  userInfo,
  onClose, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tossPayments, setTossPayments] = useState<any>(null);

  // 토스페이먼츠 설정 가져오기
  const paymentConfig = getPaymentConfig();

  useEffect(() => {
    const initializeTossPayments = async () => {
      try {
        // API 키 검증
        if (!validateApiKey(paymentConfig.clientKey)) {
          throw new Error('Invalid API Key');
        }

        // npm 패키지 방식으로 토스페이먼츠 초기화
        const tossPaymentsInstance = await loadTossPayments(paymentConfig.clientKey);
        setTossPayments(tossPaymentsInstance);
        console.log(`✅ 토스페이먼츠 v2 초기화 완료 (${paymentConfig.environment} 환경)`);
        console.log('🔍 tossPayments 객체:', tossPaymentsInstance);
        console.log('🔍 tossPayments.payment 함수:', typeof tossPaymentsInstance.payment);
      } catch (error) {
        console.error('❌ 토스페이먼츠 초기화 실패:', error);
      }
    };

    initializeTossPayments();
  }, [paymentConfig]);

  // customerKey를 안전하게 생성하는 함수
  const generateSafeCustomerKey = (email: string): string => {
    // 이메일을 Base64로 인코딩 후 영문자와 숫자, 허용된 특수문자만 남김
    const base64 = btoa(email)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '.');
    
    // 최대 50자로 제한
    return base64.substring(0, 50);
  };

  const handlePayment = async () => {
    // 로그인 체크
    if (!userInfo) {
      alert('결제하려면 먼저 로그인해주세요!');
      return;
    }

    if (!tossPayments) {
      console.error('❌ tossPayments 객체가 없습니다');
      alert('결제 시스템을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    console.log('✅ tossPayments 객체 확인:', tossPayments);
    console.log('🔍 tossPayments.payment 함수 존재 여부:', typeof tossPayments.payment);

    setIsLoading(true);

    try {
      // 주문 ID 생성 (실제로는 서버에서 생성해야 함)
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 결제 요청 데이터 생성
      const paymentRequest = createPaymentRequest({
        amount: price,
        orderId: orderId,
        orderName: courseTitle,
        customerName: userInfo?.name || 'AI City Builders 수강생',
        courseId: courseId
      });

      console.log('💳 결제 요청:', paymentRequest);

      // 토스페이먼츠 JavaScript SDK 공식 사용법
      console.log('🔧 결제 객체 생성 시도...');
      
      // customerKey를 안전하게 생성
      const safeCustomerKey = generateSafeCustomerKey(userInfo.email || 'anonymous@example.com');
      console.log('🔑 생성된 customerKey:', safeCustomerKey);
      
      const payment = tossPayments.payment({ 
        customerKey: safeCustomerKey
      });

      console.log('✅ 결제 객체 생성 성공:', payment);
      console.log('🔍 payment.requestPayment 함수 존재 여부:', typeof payment.requestPayment);

      // 카드 결제 요청 (토스페이먼츠 SDK 공식 방식)
      console.log('💳 카드 결제 요청 시도...');
      
      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: paymentRequest.amount,
        },
        orderId: paymentRequest.orderId,
        orderName: paymentRequest.orderName,
        successUrl: paymentRequest.successUrl,
        failUrl: paymentRequest.failUrl,
        customerEmail: userInfo.email,
        customerName: paymentRequest.customerName,
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
    if (!userInfo) {
      alert('결제하려면 먼저 로그인해주세요!');
      return;
    }

    if (!tossPayments) return;

    setIsLoading(true);

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const paymentData = {
        amount: price,
        orderId: orderId,
        orderName: courseTitle,
        customerName: userInfo?.name || 'AI City Builders 수강생',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      };

      // customerKey를 안전하게 생성
      const safeCustomerKey = generateSafeCustomerKey(userInfo.email || 'anonymous@example.com');
      console.log('🔑 생성된 customerKey:', safeCustomerKey);

      // 결제 객체 생성 (공식 문서 방식)
      const payment = tossPayments.payment({ 
        customerKey: safeCustomerKey
      });

      if (method === '계좌이체') {
        await payment.requestPayment({
          method: "TRANSFER",
          amount: {
            currency: "KRW",
            value: paymentData.amount,
          },
          orderId: paymentData.orderId,
          orderName: paymentData.orderName,
          successUrl: paymentData.successUrl,
          failUrl: paymentData.failUrl,
          customerEmail: userInfo.email,
          customerName: paymentData.customerName,
        });
      } else if (method === '가상계좌') {
        await payment.requestPayment({
          method: "VIRTUAL_ACCOUNT",
          amount: {
            currency: "KRW",
            value: paymentData.amount,
          },
          orderId: paymentData.orderId,
          orderName: paymentData.orderName,
          successUrl: paymentData.successUrl,
          failUrl: paymentData.failUrl,
          customerEmail: userInfo.email,
          customerName: paymentData.customerName,
          virtualAccount: {
            cashReceipt: {
              type: '소득공제',
            },
          },
        });
      } else if (method === '토스페이') {
        await payment.requestPayment({
          method: "TOSSPAY",
          amount: {
            currency: "KRW",
            value: paymentData.amount,
          },
          orderId: paymentData.orderId,
          orderName: paymentData.orderName,
          successUrl: paymentData.successUrl,
          failUrl: paymentData.failUrl,
          customerEmail: userInfo.email,
          customerName: paymentData.customerName,
        });
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
    <div 
      className="payment-modal" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'transparent',
        overflow: 'auto'
      }}
    >
      <div className="payment-modal-overlay" onClick={onClose} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)'
      }}></div>
      <div className="payment-modal-content" style={{
        position: 'relative',
        background: 'white',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        margin: 'auto'
      }}>
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

        {paymentConfig.environment === 'test' && (
          <div className="payment-notice" style={{
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '15px',
            margin: '15px 20px'
          }}>
            <p style={{ fontWeight: 'bold', color: '#856404', marginBottom: '10px' }}>
              ⚠️ 테스트 환경입니다. 실제 결제되지 않습니다.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#856404' }}>• 카드번호: 아무 유효한 카드번호 사용 가능</p>
            <p style={{ fontSize: '0.9rem', color: '#856404' }}>• 유효기간: 미래 날짜 입력</p>
            <p style={{ fontSize: '0.9rem', color: '#856404' }}>• CVC: 임의 3자리 숫자</p>
          </div>
        )}

        {paymentConfig.environment === 'live' && (
          <div className="payment-notice" style={{
            background: '#d1ecf1',
            border: '1px solid #0ea5e9',
            borderRadius: '8px',
            padding: '15px',
            margin: '15px 20px'
          }}>
            <p style={{ fontWeight: 'bold', color: '#0c5460', marginBottom: '10px' }}>
              💳 실제 결제가 진행됩니다
            </p>
            <p style={{ fontSize: '0.9rem', color: '#0c5460' }}>
              • 결제 완료 후 즉시 강의 수강이 가능합니다
            </p>
            <p style={{ fontSize: '0.9rem', color: '#0c5460' }}>
              • 결제 관련 문의: jay@connexionai.kr
            </p>
          </div>
        )}

        <div className="payment-footer">
          <p>안전한 결제를 위해 토스페이먼츠를 사용합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;

