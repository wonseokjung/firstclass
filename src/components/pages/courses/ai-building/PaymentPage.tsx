import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import NavigationBar from '../../../common/NavigationBar';
import PaymentComponent from '../../payment/PaymentComponent';

interface PaymentPageProps {
  onBack?: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const courseInfo = {
    id: '999',
    title: 'Step 1: AI 건물주 되기 기초 (얼리버드)',
    subtitle: 'AI로 유튜브 채널 만들고 첫 월수익 100만원!',
    price: 45000 // 얼리버드 가격
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

  const handlePaymentSuccess = () => {
    console.log('🎉 결제 성공!');
    setShowPaymentModal(false);
    alert('🎉 결제가 완료되었습니다! 강의 시청 페이지로 이동합니다.');
    
    // 결제 성공 후 강의 시청 페이지로 리다이렉트
    setTimeout(() => {
      navigate('/ai-building-course-player');
    }, 1000);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    navigate('/ai-building-course');
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
      background: 'linear-gradient(135deg, #1e293b, #334155)'
    }}>
      <NavigationBar
        onBack={() => navigate('/ai-building-course')}
        breadcrumbText="결제하기"
      />

      {/* PaymentComponent 모달 */}
      {showPaymentModal && (
        <PaymentComponent
          courseId={courseInfo.id}
          courseTitle={courseInfo.title}
          price={courseInfo.price}
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
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            borderRadius: '50%',
            marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>💳</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '15px'
          }}>
            {courseInfo.title}
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#e0f2fe',
            marginBottom: '30px'
          }}>
            {courseInfo.subtitle}
          </p>
          <div style={{
            display: 'inline-block',
            background: 'rgba(251, 191, 36, 0.2)',
            border: '2px solid #fbbf24',
            padding: '8px 20px',
            borderRadius: '25px',
            color: '#fbbf24',
            fontSize: '0.9rem',
            fontWeight: '700'
          }}>
            🔥 얼리버드 특가 진행 중
          </div>
        </div>

        {/* 결제 정보 카드 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '25px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          border: '3px solid #fbbf24'
        }}>
          {/* 가격 정보 */}
          <div style={{
            textAlign: 'center',
            paddingBottom: '30px',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: '30px'
          }}>
            <div style={{
              fontSize: '1rem',
              color: '#94a3b8',
              textDecoration: 'line-through',
              marginBottom: '10px'
            }}>
              정가 ₩95,000
            </div>
            <div style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: '900',
              color: '#1e40af',
              marginBottom: '15px'
            }}>
              ₩{courseInfo.price.toLocaleString()}
            </div>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              color: '#92400e',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '0.95rem',
              fontWeight: '800',
              border: '2px solid #fbbf24'
            }}>
              💰 50,000원 할인
            </div>
          </div>

          {/* 수강 혜택 */}
          <div style={{
            marginBottom: '30px'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle size={24} style={{ color: '#1e40af' }} />
              수강 혜택
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                '🎥 AI로 유튜브 채널 완성',
                '💰 첫 월수익 100만원 달성 전략',
                '🤖 AI 콘텐츠 자동 생성 (텍스트/이미지/사운드/영상)',
                '📹 숏폼·롱폼 영상 제작 완전 마스터',
                '🎯 4가지 교훈: 입지→자재→시공→수익화',
                '📈 수익 시스템 3종 세트 (애드센스/제휴/멤버십)',
                '🎓 구매 후 1년간 무제한 수강',
                '💬 실시간 Q&A 지원'
              ].map((benefit, idx) => (
                <li key={idx} style={{
                  padding: '12px 0',
                  color: '#475569',
                  fontSize: '1.05rem',
                  borderBottom: idx < 7 ? '1px solid #f1f5f9' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    background: '#1e40af',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* 결제 버튼 */}
          <button
            onClick={handleStartPayment}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#1e293b',
              border: 'none',
              padding: '20px',
              borderRadius: '15px',
              fontSize: '1.3rem',
              fontWeight: '900',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(251, 191, 36, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(251, 191, 36, 0.4)';
            }}
          >
            <CreditCard size={28} />
            ₩{courseInfo.price.toLocaleString()} 결제하기
          </button>

          <p style={{
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '0.9rem',
            marginTop: '20px'
          }}>
            💳 안전한 토스페이먼츠 결제 시스템
          </p>
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
            color: '#fbbf24',
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
            <li>• 구매일로부터 1년간 무제한 수강</li>
            <li>• 환불 규정은 이용약관을 참고해주세요</li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;

