import React, { useEffect, useState } from 'react';
import { XCircle, Home, AlertTriangle, RefreshCw } from 'lucide-react';
import NavigationBar from './NavigationBar';

interface PaymentFailPageProps {
  onBack: () => void;
}

const PaymentFailPage: React.FC<PaymentFailPageProps> = ({ onBack }) => {
  const [errorInfo, setErrorInfo] = useState({
    code: '',
    message: ''
  });

  useEffect(() => {
    // URL 파라미터에서 오류 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const errorCode = urlParams.get('code') || '';
    const errorMessage = urlParams.get('message') || '알 수 없는 오류가 발생했습니다.';
    
    setErrorInfo({
      code: errorCode,
      message: errorMessage
    });
  }, []);

  const handleRetry = () => {
    // 이전 페이지로 돌아가기 (결제 페이지)
    if (window.history.length > 1) {
      window.history.back();
    } else {
      onBack();
    }
  };

  return (
    <div className="masterclass-container">
      <NavigationBar 
        onBack={onBack}
        showSearch={false}
        breadcrumbText="결제 실패"
      />

      {/* 실패 히어로 섹션 */}
      <div style={{ 
        position: 'relative', 
        paddingTop: '80px', 
        paddingBottom: '120px', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, transparent 50%, rgba(239, 68, 68, 0.1) 100%)'
      }}>
        
        {/* 애니메이션 파티클 */}
        <div style={{ position: 'absolute', inset: '0' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${20 + (i * 12)}%`,
                top: `${20 + (i % 3) * 20}%`,
                animation: `bounce 3s infinite ${i * 0.2}s`
              }}
            >
              <AlertTriangle style={{ width: '16px', height: '16px', color: 'rgba(239, 68, 68, 0.4)' }} />
            </div>
          ))}
        </div>

        <div style={{ 
          position: 'relative', 
          maxWidth: '1024px', 
          margin: '0 auto', 
          textAlign: 'center', 
          padding: '0 24px' 
        }}>
          {/* 메인 실패 아이콘 */}
          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <div style={{ 
              width: '128px', 
              height: '128px', 
              margin: '0 auto', 
              position: 'relative' 
            }}>
              <div style={{
                position: 'absolute',
                inset: '0',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              <div style={{
                position: 'absolute',
                inset: '8px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <XCircle style={{ width: '64px', height: '64px', color: '#ef4444' }} />
              </div>
              <div style={{
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'bounce 1s infinite'
              }}>
                <span style={{ fontSize: '24px' }}>⚠️</span>
              </div>
            </div>
          </div>

          {/* 실패 메시지 */}
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '24px',
            background: 'linear-gradient(to right, white, #ccc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            결제 실패
          </h1>
          
          <p style={{ 
            fontSize: '20px', 
            color: '#ccc', 
            marginBottom: '16px', 
            lineHeight: '1.6' 
          }}>
            결제 처리 중 문제가 발생했습니다.
            <br />아래 내용을 확인하시고 다시 시도해주세요.
          </p>
          
          {/* 오류 정보 */}
          {(errorInfo.code || errorInfo.message) && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <h3 style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '12px' }}>
                🔍 오류 정보
              </h3>
              {errorInfo.code && (
                <p style={{ color: '#fca5a5', marginBottom: '8px' }}>
                  <strong>오류 코드:</strong> <span style={{ 
                    fontFamily: 'monospace', 
                    background: 'rgba(239, 68, 68, 0.2)', 
                    padding: '4px 8px', 
                    borderRadius: '4px' 
                  }}>{errorInfo.code}</span>
                </p>
              )}
              <p style={{ color: '#fca5a5' }}>
                <strong>메시지:</strong> {errorInfo.message}
              </p>
            </div>
          )}

          {/* CTA 버튼들 */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px', 
            justifyContent: 'center', 
            marginBottom: '64px'
          }}>
            <button
              onClick={handleRetry}
              style={{
                background: 'linear-gradient(to right, #cf2b4a, #a01e36)',
                color: 'white',
                fontWeight: 'bold',
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = 'linear-gradient(to right, #a01e36, #8a1929)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'linear-gradient(to right, #cf2b4a, #a01e36)';
              }}
            >
              <RefreshCw style={{ width: '20px', height: '20px' }} />
              <span>다시 결제하기</span>
            </button>
            
            <button
              onClick={onBack}
              style={{
                border: '1px solid #333',
                background: 'transparent',
                color: 'white',
                fontWeight: '500',
                padding: '16px 32px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.borderColor = '#cf2b4a';
                e.currentTarget.style.color = '#cf2b4a';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.color = 'white';
              }}
            >
              <Home style={{ width: '20px', height: '20px' }} />
              <span>메인으로 돌아가기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 해결 방법 안내 섹션 */}
      <div style={{ maxWidth: '1536px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '16px' 
          }}>
            💡 해결 방법
          </h2>
          <p style={{ color: '#ccc', fontSize: '18px' }}>
            다음 사항들을 확인해보세요
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px', 
          marginBottom: '64px' 
        }}>
          {[
            {
              number: "1",
              title: "카드 정보 확인",
              description: "카드번호, 유효기간, CVC 번호를 정확히 입력했는지 확인",
              backgroundColor: 'linear-gradient(135deg, #3b82f6, #2563eb)'
            },
            {
              number: "2",
              title: "한도 확인",
              description: "카드 한도나 일일/월 결제 한도 초과 여부 확인",
              backgroundColor: 'linear-gradient(135deg, #10b981, #059669)'
            },
            {
              number: "3",
              title: "해외결제 설정",
              description: "해외결제가 차단되어 있다면 카드사에 문의",
              backgroundColor: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
            },
            {
              number: "4",
              title: "다른 결제수단",
              description: "다른 카드나 결제수단 이용해보기",
              backgroundColor: 'linear-gradient(135deg, #eab308, #ca8a04)'
            }
          ].map((item, index) => (
            <div key={index} style={{ 
              background: '#111', 
              border: '1px solid #333', 
              borderRadius: '12px', 
              padding: '24px', 
              height: '100%',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(207, 43, 74, 0.5)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                background: item.backgroundColor,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {item.number}
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: 'white', 
                marginBottom: '8px' 
              }}>
                {item.title}
              </h3>
              <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.5' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* 고객센터 안내 */}
        <div style={{
          background: 'linear-gradient(to right, #111, #1a1a1a)',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #cf2b4a, #a01e36)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>💡</span>
          </div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '16px' 
          }}>
            문제가 계속 발생하면 고객센터로 연락주세요
          </h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '24px', 
            justifyContent: 'center', 
            alignItems: 'center', 
            color: '#ccc'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📞</span>
              <span style={{ color: '#cf2b4a', fontWeight: '500' }}>070-2359-3515</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📧</span>
              <span style={{ color: '#cf2b4a', fontWeight: '500' }}>contact@clathon.com</span>
            </div>
          </div>
          <p style={{ color: '#999', fontSize: '14px', marginTop: '16px' }}>
            평일 09:00-18:00 (주말 및 공휴일 제외)
          </p>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <div className="logo">
                <span>CLATHON</span>
              </div>
              <p>AI 시대를 위한 실무 교육 플랫폼</p>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>연락처</h4>
            <p>📞 070-2359-3515</p>
            <p>📧 contact@clathon.com</p>
          </div>
          
          <div className="footer-section">
            <h4>운영시간</h4>
            <p>평일 09:00-18:00</p>
            <p>주말/공휴일 휴무</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 CLATHON. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PaymentFailPage;