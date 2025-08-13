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
          showSearch={false}
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
        showSearch={false}
        breadcrumbText="결제 완료"
      />

      {/* 성공 히어로 섹션 */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#cf2b4a]/20 via-transparent to-[#cf2b4a]/10"></div>
        
        {/* 애니메이션 파티클 */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '3s'
              }}
            >
              <Sparkles className="w-4 h-4 text-[#cf2b4a]/40" />
            </div>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-6">
          {/* 메인 성공 아이콘 */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#cf2b4a] to-[#a01e36] rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-[#cf2b4a]" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-2xl">🎉</span>
              </div>
            </div>
          </div>

          {/* 성공 메시지 */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-white to-[#ccc] bg-clip-text text-transparent">
              결제 완료!
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#ccc] mb-4 leading-relaxed">
            축하합니다! 
            <span className="text-[#cf2b4a] font-semibold mx-2">{courseName || '강의'}</span>
            결제가 성공적으로 완료되었습니다
          </p>
          
          <p className="text-lg text-[#999] mb-12">
            이제 바로 학습을 시작하고 새로운 스킬을 마스터해보세요! 🚀
          </p>

          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="group bg-gradient-to-r from-[#cf2b4a] to-[#a01e36] hover:from-[#a01e36] hover:to-[#8a1929] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Play className="w-6 h-6" />
              <span>강의 시청하기</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={onBack}
              className="group border border-[#333] hover:border-[#cf2b4a] text-white hover:text-[#cf2b4a] font-medium py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
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