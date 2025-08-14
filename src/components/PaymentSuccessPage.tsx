import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Clock, ArrowRight, Sparkles, Award, Play } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import AzureTableService from '../services/azureTableService';
import NavigationBar from './NavigationBar';

interface PaymentSuccessPageProps {
  onBack: () => void;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ onBack }) => {
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [courseName, setCourseName] = useState('');

  // 페이지 로드 즉시 로그 출력
  console.log('🎉 PaymentSuccessPage 컴포넌트 로드됨!');
  console.log('📍 현재 URL:', window.location.href);
  console.log('📍 location.search:', location.search);
  console.log('📍 location.state:', location.state);

  useEffect(() => {
    console.log('🚀 PaymentSuccessPage useEffect 시작!');
    
    const processPurchase = async () => {
      try {
        console.log('🔄 processPurchase 함수 실행!');
        
        // URL에서 course 파라미터 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const courseParam = urlParams.get('course');
        console.log('📋 URL courseParam:', courseParam);
        
        // 사용자 정보는 location.state에서 가져오기
        const userInfo = location.state?.user;
        
        // 여러 저장소에서 사용자 정보 확인 (우선순위: sessionStorage > localStorage > location.state)
        let user = null;
        
        // 사용자 정보 가져오기 (우선순위: sessionStorage > localStorage > location.state)
        const sessionUserInfo = sessionStorage.getItem('clathon_user_session');
        if (sessionUserInfo) {
          user = JSON.parse(sessionUserInfo);
        } else {
          const localUserInfo = localStorage.getItem('clathon_user');
          if (localUserInfo) {
            user = JSON.parse(localUserInfo);
          } else if (userInfo) {
            user = userInfo;
          }
        }
        
        console.log('💳 결제 처리:', user?.email, '→', courseParam);
        
        if (user && courseParam) {
          let courseData = {
            id: '',
            title: '',
            price: 0
          };
          
          // 강의별 정보 설정
          if (courseParam === 'prompt-engineering' || courseParam === 'workflow-automation') {
            courseData = {
              id: 'workflow-automation', 
              title: 'Workflow Automation Master',
              price: 299000
            };
            setCourseName('Workflow Automation Master');
          }
          
          if (courseData.id && user.email) {
            try {
              console.log('🚀 Azure 구매 처리 시작:', {
                email: user.email,
                courseId: courseData.id,
                amount: courseData.price,
                paymentMethod: 'card'
              });
              
              const result = await AzureTableService.createPayment({
                email: user.email,
                courseId: courseData.id,
                amount: courseData.price,
                paymentMethod: 'card'
              });
              
              console.log(`✅ ${courseData.title} 구매 완료, 결과:`, result);
            } catch (paymentError: any) {
              console.error('❌ 구매 실패:', paymentError);
              console.error('❌ 구매 실패 상세:', {
                errorMessage: paymentError?.message || String(paymentError),
                errorStack: paymentError?.stack,
                courseData,
                user: { email: user.email, name: user.name }
              });
            }
          } else {
            console.warn('⚠️ 구매 정보 부족:', {
              hasCourseId: !!courseData.id,
              hasUserEmail: !!user?.email,
              courseData,
              user
            });
          }
        }
      } catch (error) {
        console.error('❌ 결제 처리 실패:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    processPurchase();
  }, [location.state?.user]);

  if (isProcessing) {
    return (
      <div className="masterclass-container">
        <NavigationBar 
          onBack={onBack}
          breadcrumbText="결제 완료"
        />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-[#cf2b4a] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-[#cf2b4a]/30 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">결제 정보를 처리 중입니다</h2>
            <p className="text-[#ccc] animate-pulse">잠시만 기다려주세요...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="masterclass-container">
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="결제 완료"
      />

      {/* 성공 히어로 섹션 */}
      <div style={{ 
        position: 'relative', 
        paddingTop: '80px', 
        paddingBottom: '120px', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(207, 43, 74, 0.2) 0%, transparent 50%, rgba(207, 43, 74, 0.1) 100%)'
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
              <Sparkles style={{ width: '16px', height: '16px', color: 'rgba(207, 43, 74, 0.4)' }} />
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
          {/* 메인 성공 아이콘 */}
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
                background: 'linear-gradient(135deg, #cf2b4a, #a01e36)',
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
                <CheckCircle style={{ width: '64px', height: '64px', color: '#cf2b4a' }} />
              </div>
              <div style={{
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'bounce 1s infinite'
              }}>
                <span style={{ fontSize: '24px' }}>🎉</span>
              </div>
              </div>
            </div>
            
          {/* 성공 메시지 */}
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '24px',
            background: 'linear-gradient(to right, white, #ccc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            결제 완료!
            </h1>
            
          <p style={{ 
            fontSize: '20px', 
            color: '#ccc', 
            marginBottom: '16px', 
            lineHeight: '1.6' 
          }}>
            축하합니다! 
            <span style={{ color: '#cf2b4a', fontWeight: '600', margin: '0 8px' }}>
              {courseName || '강의'}
            </span>
            결제가 성공적으로 완료되었습니다
          </p>
          
          <p style={{ 
            fontSize: '18px', 
            color: '#999', 
            marginBottom: '48px' 
          }}>
            이제 바로 학습을 시작하고 새로운 스킬을 마스터해보세요! 🚀
          </p>

          {/* CTA 버튼들 */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px', 
            justifyContent: 'center', 
            marginBottom: '64px'
          }}>
            <button
              onClick={() => window.location.href = '/dashboard'}
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
              <Play style={{ width: '24px', height: '24px' }} />
              <span>강의 시청하기</span>
              <ArrowRight style={{ width: '20px', height: '20px' }} />
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
              <span>메인으로 돌아가기</span>
            </button>
                  </div>
                  </div>
                </div>
                
      {/* 다음 단계 안내 섹션 */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🚀 다음 단계
          </h2>
          <p className="text-[#ccc] text-lg">
            이제 학습 여정을 시작해보세요
          </p>
                  </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Play,
              title: "강의 시청",
              description: "구매한 강의를 바로 시청하세요",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: Clock,
              title: "진도 관리",
              description: "자동으로 저장되는 학습 진도",
              color: "from-green-500 to-green-600"
            },
            {
              icon: Star,
              title: "퀴즈 도전",
              description: "학습 내용을 확인하는 퀴즈",
              color: "from-purple-500 to-purple-600"
            },
            {
              icon: Award,
              title: "수료증 발급",
              description: "완주 시 받는 공식 수료증",
              color: "from-yellow-500 to-yellow-600"
            }
          ].map((step, index) => (
            <div key={index} className="group">
              <div className="bg-[#111] border border-[#333] rounded-xl p-6 h-full hover:border-[#cf2b4a]/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-[#ccc] text-sm leading-relaxed">{step.description}</p>
                  </div>
            </div>
          ))}
                </div>
                
        {/* 고객센터 안내 */}
        <div className="bg-gradient-to-r from-[#111] to-[#1a1a1a] border border-[#333] rounded-xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#cf2b4a] to-[#a01e36] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">💡</span>
                  </div>
                </div>
          <h3 className="text-xl font-bold text-white mb-4">궁금한 점이 있으시면 언제든 문의해주세요</h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-[#ccc]">
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span className="text-[#cf2b4a] font-medium">070-2359-3515</span>
              </div>
            <div className="flex items-center space-x-2">
              <span>📧</span>
              <span className="text-[#cf2b4a] font-medium">contact@clathon.com</span>
            </div>
          </div>
          <p className="text-[#999] text-sm mt-4">평일 09:00-18:00 (주말 및 공휴일 제외)</p>
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

export default PaymentSuccessPage;