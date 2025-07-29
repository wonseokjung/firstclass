import React from 'react';
import { CheckCircle, ArrowLeft, Star, Clock, Users } from 'lucide-react';

interface PaymentSuccessPageProps {
  onBack: () => void;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          메인으로 돌아가기
        </button>

        {/* 성공 메시지 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            결제가 완료되었습니다! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            축하합니다! 강의 결제가 성공적으로 완료되었습니다.<br />
            이제 바로 학습을 시작하실 수 있습니다.
          </p>

          {/* 다음 단계 안내 */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">다음 단계</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-0.5">1</div>
                <div>
                  <p className="font-medium text-blue-900">강의 시청하기</p>
                  <p className="text-blue-700 text-sm">메인 페이지에서 구매한 강의를 바로 시청할 수 있습니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-0.5">2</div>
                <div>
                  <p className="font-medium text-blue-900">학습 진도 관리</p>
                  <p className="text-blue-700 text-sm">학습 진도가 자동으로 저장되어 언제든 이어서 볼 수 있습니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-0.5">3</div>
                <div>
                  <p className="font-medium text-blue-900">퀴즈 도전</p>
                  <p className="text-blue-700 text-sm">각 강의 후 퀴즈를 풀어보며 학습 내용을 확인하세요.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/course'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              강의 시청하기
            </button>
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
            💡 궁금한 점이 있으시면 언제든 문의해주세요.
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

export default PaymentSuccessPage; 