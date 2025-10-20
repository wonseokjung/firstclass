import React, { useState, useEffect } from 'react';
import NavigationBar from '../../../common/NavigationBar';
import AzureTableService from '../../../../services/azureTableService';

interface ChatGPTAgentBeginnerPlayerPageProps {
  onBack: () => void;
}

const ChatGPTAgentBeginnerPlayerPage: React.FC<ChatGPTAgentBeginnerPlayerPageProps> = ({ onBack }) => {
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');

        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);

          // Azure 테이블에서 결제 상태 확인
          try {
            const paymentStatus = await AzureTableService.checkCoursePayment(
              parsedUserInfo.email, 
              'chatgpt-agent-beginner'
            );

            if (paymentStatus && paymentStatus.isPaid) {
              setIsPaidUser(true);
            } else {
              // 결제하지 않은 사용자는 결제 페이지로 리다이렉트
              alert('이 강의는 결제 후 수강하실 수 있습니다.');
              window.location.href = '/chatgpt-agent-beginner';
            }
          } catch (azureError) {
            console.error('❌ Azure 테이블 조회 실패:', azureError);
            alert('결제 정보를 확인할 수 없습니다. 다시 시도해주세요.');
            window.location.href = '/chatgpt-agent-beginner';
          }
        } else {
          // 로그인하지 않은 사용자는 로그인 페이지로
          alert('로그인이 필요한 서비스입니다.');
          window.location.href = '/';
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
        window.location.href = '/';
      }
    };

    checkAuthStatus();
  }, []);

  // 결제 확인 중이거나 미결제 사용자
  if (!isPaidUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #0ea5e9',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          결제 정보 확인 중...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <NavigationBar
        onBack={onBack}
        breadcrumbText="ChatGPT AI AGENT 비기너편"
      />

      {/* 준비중 메시지 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: '40px 20px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          <div style={{
            fontSize: '5rem',
            marginBottom: '30px'
          }}>
            🚧
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            강의 콘텐츠 준비 중
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#64748b',
            lineHeight: '1.8',
            marginBottom: '40px'
          }}>
            최고의 학습 경험을 제공하기 위해<br />
            강의 콘텐츠를 열심히 준비하고 있습니다.<br />
            곧 만나요! 🚀
          </p>
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
            borderRadius: '15px',
            padding: '25px',
            border: '2px solid #0ea5e9'
          }}>
            <p style={{
              fontSize: '1rem',
              color: '#0ea5e9',
              fontWeight: '600',
              margin: 0
            }}>
              💡 오픈 예정: 2025년 11월 중순
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTAgentBeginnerPlayerPage;

