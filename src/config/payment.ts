/**
 * 토스페이먼츠 결제 설정
 * 테스트 환경과 라이브 환경을 구분하여 관리
 * 
 * 🔑 라이브 키 정보:
 * - 상점아이디(MID): clathou1x0
 * - 클라이언트 키: live_ck_DnyRpQWGrNwa9QGY664O8Kwv1M9E
 * - 시크릿 키: live_sk_AQ92ymxN34P4R5EKxBkO3ajRKXvd (서버용)
 * - 보안 키: e33989d2d0c77a0a1d6ddff13918c481d9afc891 (암호화용)
 */

export interface PaymentConfig {
  clientKey: string;
  environment: 'test' | 'live';
  successUrl: string;
  failUrl: string;
}

// 현재 환경 감지 (개발/프로덕션)
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// 도메인 설정
const DOMAIN = isProduction 
  ? 'https://www.clathon.com'  // 🎯 실제 배포 도메인으로 수정
  : window.location.origin;

// 토스페이먼츠 키 설정
// 🚨 임시 라이브 키 테스트 모드 (개발 환경에서 라이브 키 사용)
const FORCE_LIVE_MODE = false; // 🎯 프로덕션에서만 라이브 키 사용

const useLiveKey = isProduction || FORCE_LIVE_MODE;

const PAYMENT_CONFIG: PaymentConfig = {
  // 라이브 키 연동 완료! 🎉
  clientKey: useLiveKey
    ? 'live_ck_DnyRpQWGrNwa9QGY664O8Kwv1M9E'  // API 개별 연동 키 (상점아이디: clathou1x0)
    : 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq',  // 개발환경에서는 테스트 키 유지
  
  environment: useLiveKey ? 'live' : 'test',
  
  successUrl: `${DOMAIN}/payment/success`,
  failUrl: `${DOMAIN}/payment/fail`
};

// 결제 설정 내보내기
export const getPaymentConfig = (): PaymentConfig => {
  const isLive = PAYMENT_CONFIG.environment === 'live';
  
  console.log(`🔧 결제 환경: ${PAYMENT_CONFIG.environment} ${isLive ? '🔴 LIVE' : '🟡 TEST'}`);
  console.log(`🔑 클라이언트 키: ${PAYMENT_CONFIG.clientKey.substring(0, 20)}...`);
  console.log(`🌐 도메인: ${DOMAIN}`);
  console.log(`📍 성공 URL: ${PAYMENT_CONFIG.successUrl}`);
  
  if (isLive) {
    console.log('🚀 라이브 환경 활성화! 실제 결제가 진행됩니다.');
  }
  
  return PAYMENT_CONFIG;
};

// 라이브 키 업데이트 함수 (향후 사용)
export const updateLiveKey = (liveClientKey: string): void => {
  if (isProduction) {
    // 프로덕션 환경에서만 라이브 키 적용
    console.log('🚀 라이브 키로 전환됩니다.');
    // 실제 구현 시 환경 변수 또는 설정 파일 업데이트
  } else {
    console.warn('⚠️ 개발 환경에서는 테스트 키를 사용합니다.');
  }
};

// API 키 검증 함수
export const validateApiKey = (key: string): boolean => {
  if (!key) return false;
  
  // 테스트 키 검증
  if (key.startsWith('test_ck_')) {
    return key.length > 20; // 기본적인 길이 검증
  }
  
  // 라이브 키 검증  
  if (key.startsWith('live_ck_')) {
    return key.length > 20;
  }
  
  return false;
};

// 결제 요청 데이터 생성 함수
export const createPaymentRequest = (orderData: {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
}) => {
  const config = getPaymentConfig();
  
  return {
    amount: orderData.amount,
    orderId: orderData.orderId,
    orderName: orderData.orderName,
    customerName: orderData.customerName || 'CLATHON 수강생',
    successUrl: config.successUrl,
    failUrl: config.failUrl,
    // 추가 설정
    card: {
      useEscrow: false,
    },
    // 고객 정보 (선택)
    customer: {
      email: undefined, // 실제 구현 시 사용자 이메일 사용
      name: orderData.customerName || 'CLATHON 수강생'
    }
  };
};

export default PAYMENT_CONFIG;
