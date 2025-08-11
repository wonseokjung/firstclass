import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Shield, Check, Clock, Users, Star, TrendingUp, Lock, AlertCircle } from 'lucide-react';
import { allCourses } from '../data/courseData';

interface PaymentPageProps {
  courseId: string;
  onSuccess: () => void;
  onBack: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ courseId, onSuccess, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'virtual'>('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const course = allCourses.find(c => c.id === courseId);

  if (!course) {
    return <div>강의를 찾을 수 없습니다.</div>;
  }

  // 토스 페이먼츠 결제 처리
  const handlePayment = async () => {

    if (!agreedToTerms || !agreedToPrivacy) {
      alert('이용약관과 개인정보처리방침에 동의해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      // 토스 페이먼츠 SDK 연동 (실제 구현 시)
      // const tossPayments = await loadTossPayments(CLIENT_KEY);
      // const payment = tossPayments.payment({
      //   amount: course.price,
      //   orderId: `order_${Date.now()}`,
      //   orderName: course.title,
      //   customerName: '고객명',
      //   successUrl: window.location.origin + '/payment/success',
      //   failUrl: window.location.origin + '/payment/fail',
      // });
      
      // 임시로 3초 후 성공 처리
      setTimeout(() => {
        setIsLoading(false);
        alert('결제가 완료되었습니다! 🎉');
        onSuccess();
      }, 3000);
      
    } catch (error) {
      setIsLoading(false);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  const discountAmount = 299000 - course.price;
  const discountRate = Math.round((discountAmount / 299000) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-slate-800">CLATHON</span>
              <span className="text-sm text-slate-500 hidden sm:inline">AI 교육의 완주를 함께</span>
            </div>
            <button onClick={onBack} className="flex items-center text-slate-600 hover:text-purple-600 transition-colors">
              <ArrowLeft size={16} className="mr-1" />
              메인으로
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 강의 정보 */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <span className="text-sm text-purple-600 font-medium">{course.category}</span>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{course.title}</h2>
                  <p className="text-slate-600">{course.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                <div className="text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-slate-500" />
                  <div className="text-sm font-medium text-slate-800">{course.totalDuration}</div>
                  <div className="text-xs text-slate-500">총 학습시간</div>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 mx-auto mb-1 text-slate-500" />
                  <div className="text-sm font-medium text-slate-800">{course.studentCount}명</div>
                  <div className="text-xs text-slate-500">수강생</div>
                </div>
                <div className="text-center">
                  <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                  <div className="text-sm font-medium text-slate-800">{course.rating}</div>
                  <div className="text-xs text-slate-500">평점</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-800 mb-3">이런 것들을 배워요:</h4>
                <div className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  AI 비즈니스 시장 분석 및 기회 발굴
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  AI 스타트업 창업 전략 및 투자 유치
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  기업 AI 도입 컨설팅 노하우
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  AI 제품 기획부터 마케팅까지
                </div>
              </div>
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 sticky top-24">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">결제 정보</h3>
                <p className="text-slate-600">AI 비즈니스 마스터가 되어보세요</p>
              </div>

              {/* 가격 정보 */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">정가</span>
                  <span className="text-slate-500 line-through">299,000원</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-600 font-medium">런칭 기념 할인 ({discountRate}%)</span>
                  <span className="text-green-600 font-medium">-{discountAmount.toLocaleString()}원</span>
                </div>
                <hr className="my-3 border-slate-200" />
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-slate-800">결제 금액</span>
                  <span className="text-2xl font-bold text-purple-600">{course.price.toLocaleString()}원</span>
                </div>
              </div>

              {/* 결제 방법 선택 */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-800 mb-3">결제 방법</h4>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-2 text-slate-500" />
                    <span>신용카드</span>
                  </label>
                  <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'transfer')}
                      className="mr-3"
                    />
                    <TrendingUp className="w-5 h-5 mr-2 text-slate-500" />
                    <span>계좌이체</span>
                  </label>
                  <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      value="virtual"
                      checked={paymentMethod === 'virtual'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'virtual')}
                      className="mr-3"
                    />
                    <Lock className="w-5 h-5 mr-2 text-slate-500" />
                    <span>가상계좌</span>
                  </label>
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="mb-6 space-y-3">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">[필수]</span> 이용약관에 동의합니다.
                  </span>
                </label>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">[필수]</span> 개인정보처리방침에 동의합니다.
                  </span>
                </label>
              </div>

              {/* 보안 안내 */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-sm text-blue-800">토스페이먼츠로 안전하게 결제됩니다</span>
              </div>

              {/* 결제 버튼 */}
              <button
                onClick={handlePayment}
                disabled={isLoading || !agreedToTerms || !agreedToPrivacy}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    결제 처리 중...
                  </div>
                ) : (
                  `${course.price.toLocaleString()}원 결제하기`
                )}
              </button>

              {/* 주의사항 */}
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 mr-2 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <div className="font-medium mb-1">결제 전 확인사항</div>
                    <ul className="space-y-1 text-xs">
                      <li>• 결제 완료 후 즉시 강의 수강이 가능합니다</li>
                      <li>• 디지털 콘텐츠 특성상 환불이 제한될 수 있습니다</li>
                      <li>• 수강 기간은 결제일로부터 1년입니다</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 