import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Clock, ArrowRight, Sparkles, Award, Play } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import AzureTableService from '../../../services/azureTableService';
import NavigationBar from '../../common/NavigationBar';

// 토스페이먼츠 결제 승인 API 호출 함수
const confirmPayment = async (paymentKey: string, orderId: string, amount: number) => {
  // 🚨 임시 라이브 모드 (실제 결제 테스트)
  const FORCE_LIVE_MODE = false; // TODO: 테스트 후 false로 변경
  const isLiveMode = process.env.NODE_ENV === 'production' || FORCE_LIVE_MODE;
  
  const secretKey = isLiveMode
    ? 'live_sk_AQ92ymxN34P4R5EKxBkO3ajRKXvd'  // 라이브 시크릿 키
    : 'test_sk_vZnjEJeQVxG1oQy91vqq3PmOoBN0';   // 상점아이디 clathou1x0의 테스트 시크릿 키
  
  console.log(`💳 결제 승인 API 모드: ${isLiveMode ? '🔴 LIVE' : '🟡 TEST'}`);
  
  const basicAuth = btoa(`${secretKey}:`);
  
  try {
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '결제 승인 실패');
    }

    const paymentData = await response.json();
    console.log('✅ 결제 승인 완료:', paymentData);
    return paymentData;
  } catch (error) {
    console.error('❌ 결제 승인 실패:', error);
    throw error;
  }
};

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
        
        // URL에서 결제 정보 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const courseParam = urlParams.get('course');
        const paymentKey = urlParams.get('paymentKey');
        const orderId = urlParams.get('orderId');
        const amount = urlParams.get('amount');
        const actualAmount = amount ? parseInt(amount) : 0;
        
        console.log('📋 URL 파라미터:', { courseParam, paymentKey, orderId, amount, actualAmount });
        
        // 토스페이먼츠 결제 승인 처리 (중복 방지)
        if (paymentKey && orderId && amount) {
          // 중복 승인 방지: sessionStorage로 이미 처리된 결제인지 확인
          const processedKey = `payment_processed_${paymentKey}`;
          if (sessionStorage.getItem(processedKey)) {
            console.log('⚠️ 이미 처리된 결제입니다. 중복 승인 방지.');
          } else {
            console.log('💳 토스페이먼츠 결제 승인 시작...');
            
            // 처리 중 표시 (중복 방지)
            sessionStorage.setItem(processedKey, 'processing');
            
            try {
              const paymentResult = await confirmPayment(paymentKey, orderId, parseInt(amount));
              console.log('✅ 결제 승인 성공:', paymentResult);
              
              // ⭐ 마스킹 없는 전체 결제 정보 저장
              if (paymentResult) {
                const fullPaymentInfo = {
                  orderId: paymentResult.orderId,
                  paymentKey: paymentResult.paymentKey,
                  // 고객 정보 (마스킹 없음!)
                  customerName: paymentResult.customer?.name || paymentResult.virtualAccount?.customerName || '정보없음',
                  customerEmail: paymentResult.customer?.email || '정보없음',
                  customerPhone: paymentResult.customer?.phoneNumber || paymentResult.customer?.mobilePhone || '정보없음',
                  // 결제 정보
                  method: paymentResult.method,
                  amount: paymentResult.totalAmount,
                  status: paymentResult.status,
                  // 가상계좌 정보 (있는 경우)
                  virtualAccount: paymentResult.virtualAccount ? {
                    accountNumber: paymentResult.virtualAccount.accountNumber,
                    bank: paymentResult.virtualAccount.bank,
                    customerName: paymentResult.virtualAccount.customerName,
                    dueDate: paymentResult.virtualAccount.dueDate
                  } : null,
                  // 타임스탬프
                  approvedAt: paymentResult.approvedAt || new Date().toISOString(),
                  savedAt: new Date().toISOString()
                };
                
                console.log('📝 전체 결제 정보 (마스킹 없음):', fullPaymentInfo);
                
                // 로컬 스토리지에 저장 (관리자가 확인할 수 있도록)
                try {
                  const storageKey = `payment_full_${orderId}`;
                  localStorage.setItem(storageKey, JSON.stringify(fullPaymentInfo));
                  console.log(`💾 결제 정보 저장 완료: ${storageKey}`);
                  
                  // 전체 결제 내역 목록에도 추가
                  const allPayments = localStorage.getItem('all_payment_details');
                  const paymentsList = allPayments ? JSON.parse(allPayments) : [];
                  paymentsList.unshift(fullPaymentInfo); // 최신이 앞에
                  
                  // 최대 100개만 저장
                  if (paymentsList.length > 100) {
                    paymentsList.pop();
                  }
                  
                  localStorage.setItem('all_payment_details', JSON.stringify(paymentsList));
                  console.log('📋 전체 결제 내역 업데이트 완료');
                } catch (storageError) {
                  console.error('❌ 로컬 스토리지 저장 실패:', storageError);
                }
              }
              
              // 성공 시 완료 표시
              sessionStorage.setItem(processedKey, 'completed');
            } catch (error) {
              console.error('❌ 결제 승인 실패:', error);
              
              // 실패 시 처리 기록 삭제 (재시도 가능하도록)
              sessionStorage.removeItem(processedKey);
              
              alert('결제 승인 중 오류가 발생했습니다. 고객센터로 문의해주세요.');
              // 실패 페이지로 리다이렉트
              window.location.href = '/payment/fail?error=payment_confirmation_failed';
              return;
            }
          }
        } else {
          console.log('⚠️ 결제 승인 파라미터 없음 (테스트 결제 또는 기존 방식)');
        }
        
        // 사용자 정보는 location.state에서 가져오기
        const userInfo = location.state?.user;
        
        // 사용자 정보 확인 (우선순위: sessionStorage > location.state)
        let user = null;
        
        // 사용자 정보 가져오기 (sessionStorage 우선)
        const sessionUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
        if (sessionUserInfo) {
          user = JSON.parse(sessionUserInfo);
        } else if (userInfo) {
          user = userInfo;
        }
        
        console.log('💳 결제 처리:', user?.email, '→', courseParam);
        
        if (user && courseParam) {
          let courseData = {
            id: '',
            title: '',
            price: 0
          };
          
          // 강의별 정보 설정
          if (courseParam === 'prompt-engineering' || courseParam === 'ai-building') {
            courseData = {
              id: 'ai-building', 
              title: 'AI 건물 짓기 - 디지털 건축가 과정',
              price: 299000
            };
            setCourseName('AI 건물 짓기 - 디지털 건축가 과정');
          } else if (courseParam === '999' || courseParam === 'ai-building-course') {
            courseData = {
              id: '999',
              title: 'Step 1: AI 건물주 되기 기초',
              price: actualAmount || 45000  // 얼리버드 45,000원
            };
            setCourseName('Step 1: AI 건물주 되기 기초');
          } else if (courseParam === '1002' || courseParam === 'chatgpt-agent-beginner') {
            courseData = {
              id: '1002',
              title: 'Google Opal 유튜브 수익화 에이전트 기초',
              price: actualAmount || 95000  // 실제 결제 금액 사용, 없으면 정가
            };
            setCourseName('Google Opal 유튜브 수익화 에이전트 기초');
          }
          
          if (courseData.id && user.email) {
            try {
              console.log('🚀 Azure 구매 처리 시작:', {
                email: user.email,
                courseId: courseData.id,
                amount: courseData.price,
                paymentMethod: 'card',
                orderId: orderId,
                timestamp: new Date().toISOString()
              });
              
              const result = await AzureTableService.addPurchaseWithReward({
                email: user.email,
                courseId: courseData.id,
                title: courseData.title,
                amount: courseData.price,
                paymentMethod: 'card',
                orderId: orderId || undefined,
                orderName: courseData.title
              });
              
              console.log(`✅ ${courseData.title} 구매 완료, 결과:`, result);
              console.log(`✅ 결제 정보:`, {
                payment: result.payment,
                enrollment: result.enrollment,
                rewardProcessed: result.rewardProcessed
              });
              
              if (result.rewardProcessed) {
                console.log('🎁 추천 리워드 지급 완료!');
              } else {
                console.log('ℹ️ 추천인이 없어 리워드 처리를 건너뜀');
              }
              
              // 성공 여부 확인
              if (result && result.enrollment) {
                console.log('✅✅✅ Azure 등록 100% 성공 확인!');
              } else {
                console.error('⚠️⚠️⚠️ Azure 등록 결과가 이상합니다:', result);
              }
            } catch (paymentError: any) {
              console.error('❌❌❌ 구매 실패 - 중요!:', paymentError);
              console.error('❌ 구매 실패 상세:', {
                errorMessage: paymentError?.message || String(paymentError),
                errorStack: paymentError?.stack,
                courseData,
                user: { email: user.email, name: user.name },
                timestamp: new Date().toISOString()
              });
              
              // 실패 시 로컬스토리지에 기록 (관리자가 확인할 수 있도록)
              try {
                const failedPayments = localStorage.getItem('failed_azure_payments') || '[]';
                const failedList = JSON.parse(failedPayments);
                failedList.push({
                  email: user.email,
                  courseId: courseData.id,
                  orderId: orderId,
                  error: paymentError?.message || String(paymentError),
                  timestamp: new Date().toISOString()
                });
                localStorage.setItem('failed_azure_payments', JSON.stringify(failedList));
                console.log('💾 실패한 결제 정보 로컬스토리지에 저장 완료');
              } catch (storageError) {
                console.error('❌ 로컬스토리지 저장 실패:', storageError);
              }
              
              // 사용자에게 알림 (선택적)
              alert('⚠️ 결제는 완료되었으나, 시스템 등록 중 오류가 발생했습니다.\n고객센터(jay@connexionai.kr)로 문의해주시면 즉시 처리해드리겠습니다.\n\n주문번호: ' + (orderId || '없음'));
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
              <div className="w-20 h-20 border-4 border-[#0ea5e9] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-[#0ea5e9]/30 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
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
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)'
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
              <Sparkles style={{ width: '16px', height: '16px', color: 'rgba(14, 165, 233, 0.4)' }} />
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
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
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
                <CheckCircle style={{ width: '64px', height: '64px', color: '#0ea5e9' }} />
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
            color: '#1f2937', 
            marginBottom: '24px'
          }}>
            결제 완료!
            </h1>
            
          <p style={{ 
            fontSize: '20px', 
            color: '#374151', 
            marginBottom: '16px', 
            lineHeight: '1.6' 
          }}>
            축하합니다! 
            <span style={{ color: '#0ea5e9', fontWeight: '600', margin: '0 8px' }}>
              {courseName || '강의'}
            </span>
            결제가 성공적으로 완료되었습니다
          </p>
          
          <p style={{ 
            fontSize: '18px', 
            color: '#374151', 
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
                background: 'linear-gradient(to right, #0ea5e9, #a01e36)',
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
                e.currentTarget.style.background = 'linear-gradient(to right, #0ea5e9, #a01e36)';
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
                e.currentTarget.style.borderColor = '#0ea5e9';
                e.currentTarget.style.color = '#0ea5e9';
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
              <div className="bg-[#111] border border-[#333] rounded-xl p-6 h-full hover:border-[#0ea5e9]/50 transition-all duration-300 hover:transform hover:scale-105">
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
            <div className="w-12 h-12 bg-gradient-to-br from-[#0ea5e9] to-[#a01e36] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">💡</span>
                  </div>
                </div>
          <h3 className="text-xl font-bold text-white mb-4">궁금한 점이 있으시면 언제든 문의해주세요</h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-[#ccc]">
            <div className="flex items-center space-x-2">
              <span>📧</span>
              <span className="text-[#0ea5e9] font-medium">jay@connexionai.kr</span>
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
                <span>AI City Builders</span>
              </div>
              <p>AI 시대를 위한 실무 교육 플랫폼</p>
            </div>
          </div>

          <div className="footer-section">
            <h4>연락처</h4>
            <p>📧 jay@connexionai.kr</p>
          </div>
          
          <div className="footer-section">
            <h4>운영시간</h4>
            <p>평일 09:00-18:00</p>
            <p>주말/공휴일 휴무</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 AI City Builders. All rights reserved.</p>
      </div>
      </footer>
    </div>
  );
};

export default PaymentSuccessPage;