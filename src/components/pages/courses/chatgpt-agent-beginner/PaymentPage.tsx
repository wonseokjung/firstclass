import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, Globe } from 'lucide-react';
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

  const courseInfo = {
    id: '1002',
    title: 'Google Opal 유튜브 수익화 에이전트 기초',
    subtitle: '10일 완성, 수익화하는 인공지능 에이전트 만들기',
    price: 95000 // 정상가
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
          navigate('/chatgpt-agent-beginner');
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
  const usdPrice = USD_PRICE; // $85 USD

  const handlePaymentSuccess = () => {
    console.log('🎉 결제 성공!');
    alert('🎉 결제가 완료되었습니다! 강의 시청 페이지로 이동합니다.');
    
    // 결제 성공 후 강의 시청 페이지로 리다이렉트
    setTimeout(() => {
      navigate('/chatgpt-agent-beginner-player');
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
            borderTop: '4px solid #0ea5e9',
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
      background: 'linear-gradient(135deg, #f8fafc, #e0f2fe)'
    }}>
      <NavigationBar
        onBack={() => navigate('/chatgpt-agent-beginner')}
        breadcrumbText="결제하기"
      />


      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)'
      }}>
        {/* 헤더 */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(20px, 4vw, 40px)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            borderRadius: '50%',
            marginBottom: 'clamp(12px, 3vw, 20px)',
            boxShadow: '0 10px 30px rgba(14, 165, 233, 0.3)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>💳</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '10px'
          }}>
            강의 결제
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            fontWeight: '500'
          }}>
            안전하고 간편한 결제로 강의를 시작하세요
          </p>
        </div>

        {/* 강의 정보 카드 */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: 'clamp(20px, 5vw, 40px)',
          marginBottom: 'clamp(15px, 3vw, 30px)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: 'clamp(12px, 3vw, 20px)',
            paddingBottom: '20px',
            borderBottom: '2px solid #f1f5f9'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
            }}>
              <span style={{ fontSize: '2rem' }}>🤖</span>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '5px',
                lineHeight: '1.3'
              }}>
                {courseInfo.title}
              </h2>
              <p style={{
                fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                color: '#64748b',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {courseInfo.subtitle}
              </p>
            </div>
          </div>

          {/* 가격 정보 */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
            borderRadius: '15px',
            padding: 'clamp(15px, 3vw, 30px)',
            marginBottom: 'clamp(15px, 3vw, 25px)',
            border: '2px solid #bae6fd'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: 'clamp(1.05rem, 2.3vw, 1.3rem)',
                color: '#1f2937',
                fontWeight: '700'
              }}>
                결제 금액
              </span>
              <span style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
                color: '#0ea5e9',
                fontWeight: '900'
              }}>
                ₩{courseInfo.price.toLocaleString()}
              </span>
            </div>

          </div>

          {/* 혜택 안내 */}
          <div style={{
            background: '#fff7ed',
            borderRadius: '12px',
            padding: 'clamp(12px, 3vw, 20px)',
            marginBottom: 'clamp(15px, 3vw, 25px)',
            border: '2px solid #fed7aa'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#c2410c',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={20} />
              포함 혜택
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#92400e',
              fontSize: '0.95rem',
              lineHeight: '1.8'
            }}>
              <li><strong>구매 후 1년간 이용 가능</strong> - 기간 내 무제한 수강</li>
              <li><strong>무제한 시청</strong> - 횟수 제한 없이 반복 학습</li>
              <li><strong>실습 파일 제공</strong> - 모든 강의 자료 다운로드</li>
              <li><strong>수료증 발급</strong> - 강의 완료 시 수료증 제공</li>
            </ul>
          </div>

          {/* 가상계좌/계좌이체 안내 */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            borderRadius: '12px',
            padding: 'clamp(12px, 3vw, 20px)',
            marginBottom: 'clamp(12px, 3vw, 20px)',
            border: '2px solid #fbbf24'
          }}>
            <p style={{
              fontSize: '0.95rem',
              color: '#92400e',
              lineHeight: '1.8',
              margin: 0,
              fontWeight: '600'
            }}>
              <strong style={{ color: '#78350f', fontSize: '1.05rem' }}>⏰ 가상계좌/계좌이체 결제 안내</strong><br />
              • <strong>가상계좌 또는 계좌이체로 결제하신 경우</strong>, 입금 확인 후 수강 권한이 부여됩니다.<br />
              • 평일 기준 <strong>2~3시간 이내</strong> 확인되며, 주말/공휴일은 다소 지연될 수 있습니다.<br />
              • 입금 확인 후 <strong>자동으로 강의 시청이 가능</strong>합니다.
            </p>
          </div>

          {/* 결제 안내 */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: 'clamp(12px, 3vw, 20px)',
            marginBottom: 'clamp(15px, 3vw, 30px)',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{
              fontSize: '0.9rem',
              color: '#64748b',
              lineHeight: '1.7',
              margin: 0
            }}>
              <strong style={{ color: '#1f2937' }}>📧 결제 후 안내:</strong><br />
              • 결제 완료 시 마이페이지에서 수강 신청 내역을 확인하실 수 있습니다.<br />
              • 2025년 11월 15일부터 강의를 수강하실 수 있습니다.<br />
              • 문의사항: <strong>jay@connexionai.kr</strong>
            </p>
          </div>

          {/* 결제 방법 탭 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              marginBottom: 'clamp(12px, 3vw, 20px)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid #e2e8f0'
            }}>
              <button
                onClick={() => setActiveTab('domestic')}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  border: 'none',
                  background: activeTab === 'domestic' 
                    ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' 
                    : '#f8fafc',
                  color: activeTab === 'domestic' ? '#ffffff' : '#64748b',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <CreditCard size={20} />
                🇰🇷 국내 결제
              </button>
              <button
                onClick={() => setActiveTab('international')}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  border: 'none',
                  background: activeTab === 'international' 
                    ? 'linear-gradient(135deg, #0070ba, #003087)' 
                    : '#f8fafc',
                  color: activeTab === 'international' ? '#ffffff' : '#64748b',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Globe size={20} />
                🌍 해외 결제
              </button>
            </div>

            {/* 국내 결제 (토스페이먼츠) */}
            {activeTab === 'domestic' && (
              <div className="fade-in">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={() => handleTossPayment('CARD')}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      color: 'white',
                      border: 'none',
                      padding: '18px',
                      borderRadius: '12px',
                      fontSize: '1.2rem',
                      fontWeight: '800',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.7 : 1,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                  >
                    <CreditCard size={24} />
                    {isLoading ? '처리 중...' : `카드 결제 ₩${courseInfo.price.toLocaleString()}`}
                  </button>

                  <button
                    onClick={() => handleTossPayment('TRANSFER')}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      color: '#0ea5e9',
                      border: '2px solid #0ea5e9',
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '1.1rem',
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
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.7 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🏧 가상계좌
                  </button>

                  <p style={{
                    fontSize: '0.85rem',
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
                  border: '2px solid #f59e0b',
                  borderRadius: '15px',
                  padding: 'clamp(12px, 3vw, 20px)',
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
                    <span style={{ fontSize: 'clamp(1.05rem, 2.3vw, 1.3rem)', fontWeight: '800' }}>
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

          <p style={{
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#94a3b8',
            marginTop: '15px',
            marginBottom: 0
          }}>
            안전한 결제 시스템으로 보호됩니다 🔒
          </p>
        </div>

        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate('/chatgpt-agent-beginner')}
          style={{
            width: '100%',
            background: 'white',
            color: '#64748b',
            border: '2px solid #e2e8f0',
            padding: '15px',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <ArrowLeft size={20} />
          강의 소개로 돌아가기
        </button>
      </div>
    </div>
  );
};

// CSS for animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }
`;

// Add style tag
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = styles;
  if (!document.head.querySelector('style[data-payment-animations]')) {
    styleTag.setAttribute('data-payment-animations', 'true');
    document.head.appendChild(styleTag);
  }
}

export default PaymentPage;

