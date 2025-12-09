/**
 * Azure Functions - 토스페이먼츠 결제 승인 API
 * 
 * 🔐 보안: 시크릿 키는 Azure Portal > Configuration > Application settings에서 설정
 * 
 * 필요한 환경변수:
 * - TOSS_LIVE_SECRET_KEY: 라이브 시크릿 키
 * - TOSS_TEST_SECRET_KEY: 테스트 시크릿 키
 */

module.exports = async function (context, req) {
  context.log('💳 결제 승인 API 호출됨');

  // CORS 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    context.res = { status: 200, headers };
    return;
  }

  try {
    const { paymentKey, orderId, amount } = req.body;

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      context.res = {
        status: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: '필수 파라미터가 누락되었습니다. (paymentKey, orderId, amount)'
        })
      };
      return;
    }

    context.log(`📋 결제 승인 요청: orderId=${orderId}, amount=${amount}`);

    // paymentKey 기반으로 라이브/테스트 환경 감지
    const isTestPayment = paymentKey.startsWith('tviva') || paymentKey.startsWith('test_');
    const isLiveMode = !isTestPayment;

    // 🔐 환경변수에서 시크릿 키 가져오기 (GitHub Secrets → Azure 환경변수)
    const secretKey = isLiveMode
      ? process.env.TOSS_LIVE_SECRET_KEY
      : process.env.TOSS_TEST_SECRET_KEY;

    if (!secretKey) {
      context.log.error(`❌ 시크릿 키가 설정되지 않음: ${isLiveMode ? 'TOSS_LIVE_SECRET_KEY' : 'TOSS_TEST_SECRET_KEY'}`);
      context.res = {
        status: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: '결제 시스템 설정 오류. 관리자에게 문의하세요.'
        })
      };
      return;
    }

    context.log(`💳 결제 모드: ${isLiveMode ? '🔴 LIVE' : '🟡 TEST'}`);

    // 토스페이먼츠 결제 승인 API 호출
    const basicAuth = Buffer.from(`${secretKey}:`).toString('base64');
    
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    const paymentData = await response.json();

    if (!response.ok) {
      context.log.error('❌ 토스페이먼츠 결제 승인 실패:', paymentData);
      context.res = {
        status: response.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: paymentData.message || '결제 승인 실패',
          code: paymentData.code
        })
      };
      return;
    }

    context.log('✅ 결제 승인 성공:', paymentData.orderId);

    // 성공 응답
    context.res = {
      status: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: paymentData
      })
    };

  } catch (error) {
    context.log.error('❌ 결제 승인 에러:', error);
    context.res = {
      status: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: '서버 오류가 발생했습니다.'
      })
    };
  }
};

