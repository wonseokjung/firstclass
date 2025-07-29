import React from 'react';
import { XCircle, ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';

interface PaymentFailPageProps {
  onBack: () => void;
  onRetry?: () => void;
}

const PaymentFailPage: React.FC<PaymentFailPageProps> = ({ onBack, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          메인으로 돌아가기
        </button>

        {/* 실패 메시지 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            결제에 실패했습니다
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            결제 처리 중 문제가 발생했습니다.<br />
            아래 내용을 확인하시고 다시 시도해주세요.
          </p>

          {/* 일반적인 해결 방법 */}
          <div className="bg-amber-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-amber-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              일반적인 해결 방법
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-0.5">1</div>
                <div>
                  <p className="font-medium text-amber-900">카드 정보 확인</p>
                  <p className="text-amber-700 text-sm">카드번호, 유효기간, CVC 번호를 정확히 입력했는지 확인해주세요.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-0.5">2</div>
                <div>
                  <p className="font-medium text-amber-900">한도 확인</p>
                  <p className="text-amber-700 text-sm">카드 한도나 일일/월 결제 한도를 초과하지 않았는지 확인해주세요.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-0.5">3</div>
                <div>
                  <p className="font-medium text-amber-900">다른 결제수단</p>
                  <p className="text-amber-700 text-sm">다른 카드나 결제수단을 이용해보세요.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-4 justify-center">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <RefreshCw size={20} />
                다시 결제하기
              </button>
            )}
            <button
              onClick={onBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>

        {/* 고객센터 정보 */}
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <p className="text-blue-900 mb-2">
            💡 문제가 계속 발생하면 고객센터로 연락주세요.
          </p>
          <p className="text-blue-700 text-sm">
            📞 070-2359-3515 | 📧 contact@clathon.com<br />
            평일 09:00-18:00 (주말 및 공휴일 제외)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage; 