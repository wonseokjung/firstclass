import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowLeft, Star, Clock, Users } from 'lucide-react';
import AzureTableService from '../services/azureTableService';

interface PaymentSuccessPageProps {
  onBack: () => void;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ onBack }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    const processPurchase = async () => {
      try {
        // URL에서 course 파라미터 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const courseParam = urlParams.get('course');
        
        const userInfo = localStorage.getItem('clathon_user');
        
        if (userInfo && courseParam) {
          const user = JSON.parse(userInfo);
          
          let courseData = {
            id: '',
            title: '',
            price: 0
          };
          
          // 강의별 정보 설정
          if (courseParam === 'prompt-engineering' || courseParam === 'workflow-automation') {
            courseData = {
              id: 'workflow-automation', 
              title: 'Google OPAL 업무 자동화',
              price: 299000
            };
            setCourseName('Google OPAL 업무 자동화');
          }
          
          if (courseData.id) {
            // Azure에 구매 정보 저장 - 실패 시 에러 표시하지 않고 성공으로 처리
            try {
              await AzureTableService.createPayment({
                userId: user.userId,
                courseId: courseData.id,
                amount: courseData.price,
                paymentMethod: 'card'
              });
              
              console.log(`✅ Azure에 구매 정보 저장 완료: ${courseData.title}`);
            } catch (paymentError) {
              console.warn('⚠️ Azure 저장 실패 - 사용자에게는 성공으로 표시:', paymentError);
              // 사용자에게는 성공으로 표시하되, 실제로는 저장되지 않음
              // 관리자가 로그를 통해 확인하여 수동으로 처리 가능
            }
          }
        }
      } catch (error) {
        console.error('❌ 구매 정보 저장 실패:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    processPurchase();
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen" style={{ background: '#000' }}>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#cf2b4a] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xl text-white font-medium">결제 정보를 처리 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#000' }}>
      {/* 헤더 */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2" onClick={onBack} style={{ cursor: 'pointer' }}>
            <div className="w-10 h-10 bg-[#cf2b4a] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-white text-xl font-bold">CLATHON</span>
          </div>
          
          <button 
            onClick={onBack}
            className="px-6 py-2 bg-[#cf2b4a] text-white rounded-lg hover:bg-[#b8243f] transition-colors duration-200 font-medium"
          >
            홈으로 돌아가기
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-2xl w-full mx-auto">
          {/* 성공 메시지 카드 */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center mb-8">
            {/* 성공 아이콘 */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-lg">🎉</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              결제가 완료되었습니다!
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              축하합니다! <span className="font-semibold text-[#cf2b4a]">{courseName || '강의'}</span> 결제가 성공적으로 완료되었습니다.<br />
              이제 바로 학습을 시작하실 수 있습니다.
            </p>

            {/* 다음 단계 안내 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-10 text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🚀 다음 단계</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">강의 시청</p>
                    <p className="text-gray-600 text-sm">메인 페이지에서 구매한 강의를 바로 시청할 수 있습니다.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">진도 관리</p>
                    <p className="text-gray-600 text-sm">학습 진도가 자동으로 저장되어 언제든 이어서 볼 수 있습니다.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">퀴즈 도전</p>
                    <p className="text-gray-600 text-sm">각 강의 후 퀴즈를 풀어보며 학습 내용을 확인하세요.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">수료증 발급</p>
                    <p className="text-gray-600 text-sm">모든 강의를 완주하면 수료증을 받을 수 있습니다.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex-1 bg-gradient-to-r from-[#cf2b4a] to-[#b8243f] hover:from-[#b8243f] hover:to-[#a01e36] text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🎯 강의 시청하기
              </button>
              
              <button
                onClick={onBack}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🏠 메인으로 돌아가기
              </button>
            </div>
          </div>

          {/* 고객센터 안내 */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-center shadow-xl border border-gray-700">
            <p className="text-gray-300 text-sm leading-relaxed">
              💡 <span className="text-white font-semibold">궁금한 점이 있으시면 언제든 문의해주세요.</span><br />
              📞 <span className="text-[#cf2b4a] font-medium">070-2359-3515</span> | 📧 <span className="text-[#cf2b4a] font-medium">contact@clathon.com</span><br />
              <span className="text-gray-400">평일 09:00-18:00 (주말 및 공휴일 제외)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;