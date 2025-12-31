import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Globe } from 'lucide-react';
import NavigationBar from '../../../common/NavigationBar';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import AzureTableService from '../../../../services/azureTableService';

// PayPal Live Client ID
const PAYPAL_CLIENT_ID = 'AVkkDf4qSOAW0AbS6i6Gy85KbYvLLWJz93KZcm55SXCoJ8Iy5OX-aiXceZsD10poCFlkCmZYlZ1y832d';

// 해외 결제 USD 고정 가격
const USD_PRICE = 85; // $85 USD

interface PaymentPageProps {
  onBack?: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');
  const [isLoading, setIsLoading] = useState(false);

  // 날짜 기반 가격 결정 (2026년 1월 1일부터 95,000원)
  const PRICE_CHANGE_DATE = new Date(2026, 0, 1); // 2026-01-01
  const now = new Date();
  const isEarlyBird = now < PRICE_CHANGE_DATE;
  const currentPrice = isEarlyBird ? 45000 : 95000;

  const courseInfo = {
    id: '999',
    title: isEarlyBird ? 'Step 1: AI 건물주 되기 기초 (얼리버드)' : 'Step 1: AI 건물주 되기 기초',
    subtitle: 'AI로 유튜브 채널 만들고 첫 월수익 100만원!',
    price: currentPrice
  };

  useEffect(() => {
    // 로그인 체크
    const checkAuth = () => {
      const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');

      if (!storedUserInfo) {
        // 로그인 안 되어 있으면 로그인 페이지로
        const confirmLogin = window.confirm('로그인이 필요합니다.\n\n로그인 페이지로 이동하시겠습니까?');
        if (confirmLogin) {
          navigate('/login');
        } else {
          navigate('/ai-building-course');
        }
        return;
      }

      try {
        const parsed = JSON.parse(storedUserInfo);
        setUserInfo(parsed);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // USD 고정 가격
  const usdPrice = USD_PRICE; // $40 USD

  const handlePaymentSuccess = () => {
    console.log('🎉 결제 성공!');
    alert('🎉 결제가 완료되었습니다! 강의 시청 페이지로 이동합니다.');

    // 결제 성공 후 강의 시청 페이지로 리다이렉트
    setTimeout(() => {
      navigate('/ai-building-course-player');
    }, 1000);
  };

  // 토스페이먼츠 결제
  const handleTossPayment = async (method: string) => {
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);

    try {
      const { loadTossPayments } = await import('@tosspayments/tosspayments-sdk');
      // 도메인 기반으로 라이브/테스트 환경 감지
      // localhost만 테스트 모드, 그 외 모든 도메인은 라이브 모드
      const isTestMode = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';
      const clientKey = isTestMode
        ? 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq' // 🟡 테스트 키
        : 'live_ck_DnyRpQWGrNwa9QGY664O8Kwv1M9E';  // 🔴 라이브 키

      console.log(`🔧 결제 환경: ${isTestMode ? '🟡 TEST' : '🔴 LIVE'} (도메인: ${window.location.hostname})`);
      console.log(`🔑 사용 키: ${clientKey.substring(0, 20)}...`);

      const tossPayments = await loadTossPayments(clientKey);

      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

      const payment = tossPayments.payment({ customerKey: userInfo.email || 'guest' });

      await payment.requestPayment({
        method: method as any,
        amount: { currency: 'KRW', value: courseInfo.price },
        orderId: orderId,
        orderName: courseInfo.title,
        successUrl: `${window.location.origin}/payment/success?course=${courseInfo.id}`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: userInfo.email,
        customerName: userInfo.name || userInfo.displayName || '고객'
      });
    } catch (error: any) {
      console.error('결제 오류:', error);
      if (error?.code !== 'USER_CANCEL') {
        alert(`결제 중 오류가 발생했습니다: ${error?.message || '알 수 없는 오류'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // PayPal 결제 성공 처리
  const handlePayPalPaymentSuccess = async (details: any) => {
    try {
      setIsLoading(true);

      // Azure Table에 결제 정보 저장
      await AzureTableService.addPurchaseAndEnrollmentToUser({
        email: userInfo.email,
        courseId: courseInfo.id,
        title: courseInfo.title,
        amount: usdPrice,
        paymentMethod: 'paypal',
        externalPaymentId: details.id,
        orderId: details.id,
        orderName: courseInfo.title
      });

      handlePaymentSuccess();
    } catch (error) {
      console.error('PayPal 결제 저장 오류:', error);
      alert('결제는 완료되었으나 등록 중 오류가 발생했습니다. 고객센터로 문의해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn || !userInfo) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #1e40af',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            로그인 확인 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1b2a, #1b263b)'
    }}>
      <NavigationBar
        onBack={() => navigate('/ai-building-course')}
        breadcrumbText="결제하기"
      />


      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: 'clamp(20px, 5vw, 40px) clamp(15px, 4vw, 20px)'
      }}>
        {/* 헤더 */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(25px, 5vw, 40px)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'clamp(60px, 12vw, 80px)',
            height: 'clamp(60px, 12vw, 80px)',
            background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
            borderRadius: '50%',
            marginBottom: 'clamp(12px, 3vw, 20px)',
            boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)'
          }}>
            <span style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>💳</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.3rem, 4vw, 2rem)',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: 'clamp(8px, 2vw, 15px)',
            lineHeight: '1.3'
          }}>
            {courseInfo.title}
          </h1>
          <p style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: '#e0f2fe',
            marginBottom: 'clamp(15px, 4vw, 30px)'
          }}>
            {courseInfo.subtitle}
          </p>
          <div style={{
            display: 'inline-block',
            background: isEarlyBird ? 'rgba(251, 191, 36, 0.2)' : 'rgba(34, 197, 94, 0.2)',
            border: `2px solid ${isEarlyBird ? '#ffd60a' : '#22c55e'}`,
            padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 20px)',
            borderRadius: '25px',
            color: isEarlyBird ? '#ffd60a' : '#22c55e',
            fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
            fontWeight: '700'
          }}>
            {isEarlyBird ? '🔥 얼리버드 특가 진행 중' : '✅ 정가 수강 가능'}
          </div>
        </div>

        {/* 결제 정보 카드 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 'clamp(15px, 4vw, 25px)',
          padding: 'clamp(20px, 5vw, 40px)',
          marginBottom: 'clamp(20px, 4vw, 30px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          border: `2px solid ${isEarlyBird ? '#ffd60a' : '#22c55e'}`
        }}>
          {/* 가격 정보 */}
          <div style={{
            textAlign: 'center',
            paddingBottom: 'clamp(15px, 4vw, 30px)',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: 'clamp(15px, 4vw, 30px)'
          }}>
            {isEarlyBird && (
              <div style={{
                fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                color: '#94a3b8',
                textDecoration: 'line-through',
                marginBottom: '8px'
              }}>
                정가 ₩95,000
              </div>
            )}
            <div style={{
              fontSize: 'clamp(1.8rem, 6vw, 2.8rem)',
              fontWeight: '900',
              color: '#1e40af',
              marginBottom: '12px'
            }}>
              ₩{courseInfo.price.toLocaleString()}
            </div>
            {isEarlyBird && (
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                color: '#92400e',
                padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 20px)',
                borderRadius: '20px',
                fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)',
                fontWeight: '800',
                border: '2px solid #ffd60a'
              }}>
                💰 50,000원 할인
              </div>
            )}
          </div>

          {/* 결제 방법 탭 */}
          <div style={{ marginBottom: 'clamp(15px, 4vw, 30px)' }}>
            <div style={{
              display: 'flex',
              marginBottom: 'clamp(12px, 3vw, 20px)',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '2px solid #e2e8f0'
            }}>
              <button
                onClick={() => setActiveTab('domestic')}
                style={{
                  flex: 1,
                  padding: 'clamp(10px, 3vw, 15px) clamp(8px, 2vw, 20px)',
                  border: 'none',
                  background: activeTab === 'domestic'
                    ? 'linear-gradient(135deg, #1e40af, #3b82f6)'
                    : '#f8fafc',
                  color: activeTab === 'domestic' ? '#ffffff' : '#64748b',
                  fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(4px, 1.5vw, 8px)'
                }}
              >
                <CreditCard size={18} />
                🇰🇷 국내 결제
              </button>
              <button
                onClick={() => setActiveTab('international')}
                style={{
                  flex: 1,
                  padding: 'clamp(10px, 3vw, 15px) clamp(8px, 2vw, 20px)',
                  border: 'none',
                  background: activeTab === 'international'
                    ? 'linear-gradient(135deg, #0070ba, #003087)'
                    : '#f8fafc',
                  color: activeTab === 'international' ? '#ffffff' : '#64748b',
                  fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(4px, 1.5vw, 8px)'
                }}
              >
                <Globe size={18} />
                🌍 해외 결제
              </button>
            </div>

            {/* 국내 결제 (토스페이먼츠) */}
            {activeTab === 'domestic' && (
              <div className="fade-in">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 12px)' }}>
                  <button
                    onClick={() => handleTossPayment('CARD')}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                      color: '#ffffff',
                      border: 'none',
                      padding: 'clamp(12px, 3vw, 18px)',
                      borderRadius: '10px',
                      fontSize: 'clamp(0.95rem, 3vw, 1.2rem)',
                      fontWeight: '800',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.7 : 1,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 6px 20px rgba(251, 191, 36, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(6px, 2vw, 10px)'
                    }}
                  >
                    <CreditCard size={20} />
                    {isLoading ? '처리 중...' : `카드 결제 ₩${courseInfo.price.toLocaleString()}`}
                  </button>

                  <button
                    onClick={() => handleTossPayment('TRANSFER')}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      color: '#1e40af',
                      border: '2px solid #1e40af',
                      padding: 'clamp(10px, 2.5vw, 16px)',
                      borderRadius: '10px',
                      fontSize: 'clamp(0.9rem, 2.8vw, 1.1rem)',
                      fontWeight: '700',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.7 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🏦 계좌이체
                  </button>

                  <button
                    onClick={() => handleTossPayment('VIRTUAL_ACCOUNT')}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      color: '#059669',
                      border: '2px solid #059669',
                      padding: 'clamp(10px, 2.5vw, 16px)',
                      borderRadius: '10px',
                      fontSize: 'clamp(0.9rem, 2.8vw, 1.1rem)',
                      fontWeight: '700',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.7 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🏧 가상계좌
                  </button>

                  <p style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                    color: '#64748b',
                    textAlign: 'center',
                    marginTop: '8px',
                    marginBottom: 0,
                    lineHeight: '1.5'
                  }}>
                    💡 가상계좌: 발급된 계좌로 입금 시 자동 수강 등록
                  </p>
                </div>
              </div>
            )}

            {/* 해외 결제 (PayPal) */}
            {activeTab === 'international' && (
              <div className="fade-in">
                <div style={{
                  background: '#fef3c7',
                  border: '2px solid #e5c100',
                  borderRadius: '15px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <p style={{
                    textAlign: 'center',
                    color: '#92400e',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    🌍 해외에서 결제하시는 분들을 위한 PayPal 결제<br />
                    <span style={{ fontSize: '1.3rem', fontWeight: '800' }}>
                      ${usdPrice.toFixed(2)} USD
                    </span>
                  </p>
                </div>

                <PayPalScriptProvider options={{
                  clientId: PAYPAL_CLIENT_ID,
                  currency: "USD"
                }}>
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      color: "blue",
                      shape: "rect",
                      label: "paypal",
                      height: 50
                    }}
                    disabled={isLoading || !userInfo}
                    createOrder={(_data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [{
                          amount: {
                            currency_code: "USD",
                            value: usdPrice.toFixed(2)
                          },
                          description: courseInfo.title
                        }]
                      });
                    }}
                    onApprove={async (_data, actions) => {
                      if (actions.order) {
                        const details = await actions.order.capture();
                        console.log('PayPal 결제 완료:', details);
                        await handlePayPalPaymentSuccess(details);
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal 오류:', err);
                      alert('PayPal 결제 중 오류가 발생했습니다. 다시 시도해주세요.');
                    }}
                    onCancel={() => {
                      console.log('PayPal 결제 취소됨');
                    }}
                  />
                </PayPalScriptProvider>

                <p style={{
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.85rem',
                  marginTop: '15px'
                }}>
                  PayPal 계정 또는 해외 카드로 결제 가능합니다
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 주의사항 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '20px',
          padding: '25px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#ffd60a',
            marginBottom: '15px'
          }}>
            📌 안내사항
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: '#e0f2fe',
            fontSize: '0.95rem',
            lineHeight: '1.8'
          }}>
            <li>• 2025년 12월 말 오픈 예정</li>
            <li>• 2026년 1월 1일부터 95,000원으로 인상</li>
            <li>• 결제 후 오픈 시 자동으로 수강 가능</li>
            <li>• 구매일로부터 3개월간 무제한 수강</li>
            <li>• 환불 규정은 이용약관을 참고해주세요</li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;

