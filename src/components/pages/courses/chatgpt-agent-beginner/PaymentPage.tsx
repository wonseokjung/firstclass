import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import NavigationBar from '../../../common/NavigationBar';
import PaymentComponent from '../../payment/PaymentComponent';

interface PaymentPageProps {
  onBack?: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // URL 파라미터에서 얼리버드 여부 확인
  const searchParams = new URLSearchParams(location.search);
  const isEarlyBird = searchParams.get('earlybird') === 'true';

  const courseInfo = {
    id: '1002',
    title: 'ChatGPT AI AGENT 비기너편',
    subtitle: '10일 완성, 수익화하는 인공지능 에이전트 만들기',
    originalPrice: isEarlyBird ? 95000 : 150000,
    earlyBirdPrice: isEarlyBird ? 45000 : 95000,
    discount: isEarlyBird ? 50000 : 55000
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

  const handlePaymentSuccess = () => {
    console.log('🎉 결제 성공!');
    setShowPaymentModal(false);
    alert('🎉 결제가 완료되었습니다! 강의 시청 페이지로 이동합니다.');
    
    // 결제 성공 후 강의 시청 페이지로 리다이렉트
    setTimeout(() => {
      navigate('/chatgpt-agent-beginner/player');
    }, 1000);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    navigate('/chatgpt-agent-beginner');
  };

  const handleStartPayment = () => {
    setShowPaymentModal(true);
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

      {/* PaymentComponent 모달 */}
      {showPaymentModal && (
        <PaymentComponent
          courseId={courseInfo.id}
          courseTitle={courseInfo.title}
          price={courseInfo.earlyBirdPrice}
          userInfo={userInfo}
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* 헤더 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            borderRadius: '50%',
            marginBottom: '20px',
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
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px',
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
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '5px'
              }}>
                {courseInfo.title}
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: '#64748b',
                margin: 0
              }}>
                {courseInfo.subtitle}
              </p>
            </div>
          </div>

          {/* 가격 정보 */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '25px',
            border: '2px solid #bae6fd'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <span style={{
                fontSize: '1.1rem',
                color: '#64748b',
                fontWeight: '600'
              }}>
                정가
              </span>
              <span style={{
                fontSize: '1.3rem',
                color: '#94a3b8',
                textDecoration: 'line-through',
                fontWeight: '600'
              }}>
                ₩{courseInfo.originalPrice.toLocaleString()}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              paddingBottom: '15px',
              borderBottom: '1px dashed #bae6fd'
            }}>
              <span style={{
                fontSize: '1.1rem',
                color: '#64748b',
                fontWeight: '600'
              }}>
                얼리버드 할인 ({courseInfo.discount}%)
              </span>
              <span style={{
                fontSize: '1.3rem',
                color: '#ef4444',
                fontWeight: '700'
              }}>
                -₩{(courseInfo.originalPrice - courseInfo.earlyBirdPrice).toLocaleString()}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '1.3rem',
                color: '#1f2937',
                fontWeight: '700'
              }}>
                최종 결제 금액
              </span>
              <span style={{
                fontSize: '2.2rem',
                color: '#0ea5e9',
                fontWeight: '900'
              }}>
                ₩{courseInfo.earlyBirdPrice.toLocaleString()}
              </span>
            </div>

            <div style={{
              marginTop: '15px',
              padding: '12px',
              background: 'white',
              borderRadius: '10px',
              textAlign: 'center',
              border: '1px solid #bae6fd'
            }}>
              <p style={{
                fontSize: '0.95rem',
                color: '#64748b',
                margin: 0,
                fontWeight: '600'
              }}>
                💰 월 {Math.floor(courseInfo.earlyBirdPrice / 12).toLocaleString()}원 (12개월 무이자 할부 가능)
              </p>
            </div>
          </div>

          {/* 혜택 안내 */}
          <div style={{
            background: '#fff7ed',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '25px',
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
              <li><strong>평생 소장</strong> - 언제든지 다시 볼 수 있습니다</li>
              <li><strong>무제한 시청</strong> - 횟수 제한 없이 반복 학습</li>
              <li><strong>실습 파일 제공</strong> - 모든 강의 자료 다운로드</li>
              <li><strong>커뮤니티 지원</strong> - 카카오톡 오픈채팅 실시간 Q&A</li>
              <li><strong>수료증 발급</strong> - 강의 완료 시 수료증 제공</li>
            </ul>
          </div>

          {/* 결제 안내 */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
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
              • 문의사항: <strong>jay@connexionai.kr</strong><br />
              • 💬 실시간 문의: <a href="https://open.kakao.com/o/s2NzW41h" target="_blank" rel="noopener noreferrer" style={{ color: '#FFE812', fontWeight: '700', textDecoration: 'none', background: '#381E1E', padding: '2px 8px', borderRadius: '4px' }}>카카오톡 오픈채팅</a>
            </p>
          </div>

          {/* 결제 버튼 */}
          <button
            onClick={handleStartPayment}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              border: 'none',
              padding: '20px',
              fontSize: '1.3rem',
              fontWeight: '800',
              borderRadius: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(14, 165, 233, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(14, 165, 233, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.4)';
            }}
          >
            <CreditCard size={24} />
            결제하기 (₩{courseInfo.earlyBirdPrice.toLocaleString()})
          </button>

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

export default PaymentPage;

