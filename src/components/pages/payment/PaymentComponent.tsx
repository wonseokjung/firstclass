import React, { useEffect, useState } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { getPaymentConfig, createPaymentRequest, validateApiKey } from '../../../config/payment';
import AzureTableService from '../../../services/azureTableService';

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
  
  // 포인트 관련 state
  const [availablePoints, setAvailablePoints] = useState(0);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);

  // 토스페이먼츠 설정 가져오기
  const paymentConfig = getPaymentConfig();

  // 사용자 포인트 조회
  useEffect(() => {
    const loadUserPoints = async () => {
      if (!userInfo?.email) {
        setIsLoadingPoints(false);
        return;
      }

      try {
        const points = await AzureTableService.getUserPoints(userInfo.email);
        setAvailablePoints(points);
        console.log('💰 보유 포인트:', points);
      } catch (error) {
        console.error('❌ 포인트 조회 실패:', error);
        setAvailablePoints(0);
      } finally {
        setIsLoadingPoints(false);
      }
    };

    loadUserPoints();
  }, [userInfo]);

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

  // 포인트 입력 핸들러
  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    const maxPoints = Math.min(availablePoints, price); // 보유 포인트와 가격 중 작은 값
    
    if (numValue > maxPoints) {
      setPointsToUse(maxPoints);
    } else if (numValue < 0) {
      setPointsToUse(0);
    } else {
      setPointsToUse(numValue);
    }
  };

  // 전액 사용 버튼
  const handleUseAllPoints = () => {
    const maxPoints = Math.min(availablePoints, price);
    setPointsToUse(maxPoints);
  };

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

    // 최종 결제 금액 계산
    const finalAmount = price - pointsToUse;

    // 포인트만으로 전액 결제 가능한 경우
    if (finalAmount <= 0 && pointsToUse > 0) {
      setIsLoading(true);
      try {
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // 포인트 전액 사용
        const pointSuccess = await AzureTableService.deductPointsForPayment(
          userInfo.email,
          price, // 전체 금액을 포인트로 결제
          orderId
        );

        if (!pointSuccess) {
          alert('포인트 사용에 실패했습니다. 다시 시도해주세요.');
          return;
        }

        alert('🎉 포인트로 결제가 완료되었습니다!');
        
        // 성공 페이지로 이동 (포인트 결제 정보 포함)
        window.location.href = `/payment/success?orderId=${orderId}&amount=${price}&paymentMethod=points`;
      } catch (error: any) {
        console.error('포인트 결제 실패:', error);
        alert(`포인트 결제 중 오류가 발생했습니다: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 토스 결제가 필요한 경우
    if (!tossPayments) {
      console.error('❌ tossPayments 객체가 없습니다');
      alert('결제 시스템을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    console.log('✅ tossPayments 객체 확인:', tossPayments);
    console.log('🔍 tossPayments.payment 함수 존재 여부:', typeof tossPayments.payment);
    console.log('💰 포인트 사용:', pointsToUse, '원');
    console.log('💳 최종 결제 금액:', finalAmount, '원');

    setIsLoading(true);

    try {
      // 주문 ID 생성
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 포인트 사용 (있는 경우)
      if (pointsToUse > 0) {
        console.log('💰 포인트 차감 시작:', pointsToUse);
        const pointSuccess = await AzureTableService.deductPointsForPayment(
          userInfo.email,
          pointsToUse,
          orderId
        );

        if (!pointSuccess) {
          alert('포인트 사용에 실패했습니다. 다시 시도해주세요.');
          setIsLoading(false);
          return;
        }
        console.log('✅ 포인트 차감 완료');
      }
      
      // 결제 요청 데이터 생성 (최종 금액으로)
      const paymentRequest = createPaymentRequest({
        amount: finalAmount,
        orderId: orderId,
        orderName: pointsToUse > 0 ? `${courseTitle} (포인트 ${pointsToUse.toLocaleString()}원 사용)` : courseTitle,
        customerName: userInfo?.name || 'AI City Builders 수강생',
        courseId: courseId
      });

      console.log('💳 결제 요청:', paymentRequest);

      // customerKey를 안전하게 생성
      const safeCustomerKey = generateSafeCustomerKey(userInfo.email || 'anonymous@example.com');
      console.log('🔑 생성된 customerKey:', safeCustomerKey);
      
      const payment = tossPayments.payment({ 
        customerKey: safeCustomerKey
      });

      console.log('✅ 결제 객체 생성 성공:', payment);

      // 카드 결제 요청 (포인트 차감 후 남은 금액)
      console.log('💳 카드 결제 요청 시도... 금액:', finalAmount);
      
      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: finalAmount,
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

    // 최종 결제 금액 계산
    const finalAmount = price - pointsToUse;

    // 포인트만으로 전액 결제 가능한 경우
    if (finalAmount <= 0 && pointsToUse > 0) {
      setIsLoading(true);
      try {
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const pointSuccess = await AzureTableService.deductPointsForPayment(
          userInfo.email,
          price,
          orderId
        );

        if (!pointSuccess) {
          alert('포인트 사용에 실패했습니다.');
          return;
        }

        alert('🎉 포인트로 결제가 완료되었습니다!');
        window.location.href = `/payment/success?orderId=${orderId}&amount=${price}&paymentMethod=points`;
      } catch (error: any) {
        console.error('포인트 결제 실패:', error);
        alert(`포인트 결제 중 오류가 발생했습니다: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!tossPayments) return;

    setIsLoading(true);

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 포인트 사용 (있는 경우)
      if (pointsToUse > 0) {
        console.log('💰 포인트 차감 시작:', pointsToUse);
        const pointSuccess = await AzureTableService.deductPointsForPayment(
          userInfo.email,
          pointsToUse,
          orderId
        );

        if (!pointSuccess) {
          alert('포인트 사용에 실패했습니다.');
          setIsLoading(false);
          return;
        }
        console.log('✅ 포인트 차감 완료');
      }
      
      const paymentData = {
        amount: finalAmount,
        orderId: orderId,
        orderName: pointsToUse > 0 ? `${courseTitle} (포인트 ${pointsToUse.toLocaleString()}원 사용)` : courseTitle,
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
            value: finalAmount,
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
            value: finalAmount,
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
            value: finalAmount,
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

          {/* 포인트 사용 섹션 */}
          {!isLoadingPoints && availablePoints > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              borderRadius: '12px',
              padding: '20px',
              margin: '20px 0',
              border: '2px solid #fbbf24'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <span style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#92400e'
                }}>
                  💰 보유 포인트
                </span>
                <span style={{
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  color: '#92400e'
                }}>
                  {availablePoints.toLocaleString()}P
                </span>
              </div>

              <div style={{
                marginBottom: '15px'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#78350f',
                  marginBottom: '8px'
                }}>
                  사용할 포인트 (최대 {Math.min(availablePoints, price).toLocaleString()}P)
                </label>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}>
                  <input
                    type="number"
                    value={pointsToUse}
                    onChange={(e) => handlePointsChange(e.target.value)}
                    min="0"
                    max={Math.min(availablePoints, price)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      fontSize: '1rem',
                      border: '2px solid #fbbf24',
                      borderRadius: '8px',
                      outline: 'none',
                      fontWeight: '600'
                    }}
                    placeholder="0"
                  />
                  <button
                    onClick={handleUseAllPoints}
                    style={{
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#d97706'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#f59e0b'}
                  >
                    전액 사용
                  </button>
                </div>
              </div>

              {pointsToUse > 0 && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '8px',
                  padding: '15px',
                  fontSize: '0.95rem',
                  color: '#78350f'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>강의 가격</span>
                    <span style={{ fontWeight: '600' }}>₩{price.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ef4444' }}>
                    <span>포인트 사용</span>
                    <span style={{ fontWeight: '600' }}>-₩{pointsToUse.toLocaleString()}</span>
                  </div>
                  <div style={{
                    borderTop: '2px solid #fbbf24',
                    marginTop: '10px',
                    paddingTop: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    color: '#92400e'
                  }}>
                    <span>최종 결제 금액</span>
                    <span>₩{(price - pointsToUse).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
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

