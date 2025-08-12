import React, { useEffect, useState } from 'react';
import { XCircle, Home, RotateCcw } from 'lucide-react';

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
          {/* 실패 메시지 카드 */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center mb-8">
            {/* 실패 아이콘 */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <XCircle className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-lg">⚠️</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              결제에 실패했습니다
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              결제 처리 중 문제가 발생했습니다.<br />
              아래 내용을 확인하시고 다시 시도해주세요.
            </p>

            {/* 오류 정보 */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 mb-10 text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🔍 오류 정보</h3>
              <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-lg">
                {errorInfo.code && (
                  <p className="text-red-800 mb-3 font-medium">
                    <strong>오류 코드:</strong> <span className="font-mono bg-red-200 px-2 py-1 rounded">{errorInfo.code}</span>
                  </p>
                )}
                <p className="text-red-800 font-medium">
                  <strong>메시지:</strong> {errorInfo.message}
                </p>
              </div>
            </div>

            {/* 해결 방법 안내 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-10 text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">💡 해결 방법</h3>
              <div className="grid gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">카드 정보 확인</p>
                    <p className="text-gray-600 text-sm">카드번호, 유효기간, CVC 번호를 정확히 입력했는지 확인해주세요.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">한도 확인</p>
                    <p className="text-gray-600 text-sm">카드 한도나 일일/월 결제 한도를 초과하지 않았는지 확인해주세요.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">해외결제 설정</p>
                    <p className="text-gray-600 text-sm">해외결제가 차단되어 있다면 카드사에 문의해주세요.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">다른 결제수단</p>
                    <p className="text-gray-600 text-sm">다른 카드나 결제수단을 이용해보세요.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRetry}
                className="flex-1 bg-gradient-to-r from-[#cf2b4a] to-[#b8243f] hover:from-[#b8243f] hover:to-[#a01e36] text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <RotateCcw size={20} />
                <span>🔄 다시 결제하기</span>
              </button>
              
              <button
                onClick={onBack}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Home size={20} />
                <span>🏠 메인으로 돌아가기</span>
              </button>
            </div>
          </div>

          {/* 고객센터 안내 */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-center shadow-xl border border-gray-700">
            <p className="text-gray-300 text-sm leading-relaxed">
              💡 <span className="text-white font-semibold">문제가 계속 발생하면 고객센터로 연락주세요.</span><br />
              📞 <span className="text-[#cf2b4a] font-medium">070-2359-3515</span> | 📧 <span className="text-[#cf2b4a] font-medium">contact@clathon.com</span><br />
              <span className="text-gray-400">평일 09:00-18:00 (주말 및 공휴일 제외)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;