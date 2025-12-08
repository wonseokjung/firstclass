// 미등록 결제 상세 조회
const fs = require('fs');

const TOSS_SECRET_KEY = 'live_sk_AQ92ymxN34P4R5EKxBkO3ajRKXvd';

const missingOrderIds = [
  'order_1764923324812_ajtz1lh1q',
  'order_1764746787834_x9bnz1hs1',
  'order_1764943447970_dben71lmg',
  'order_1764965884592_03a0ywoyo',
  'order_1764940834249_zezctkuoo',
  'order_1764942246961_ins4bov89',
  'order_1764995236248_09ft0l7n0',
  'order_1765014630695_i14hpnj36'
];

async function getPaymentDetails() {
  const basicAuth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
  
  console.log("🔍 미등록 결제 상세 조회 중...\n");
  console.log("═══════════════════════════════════════════════════════════════════════════");
  console.log("   날짜/시간             | 금액      | 결제방법   | 주문자명  | 이메일");
  console.log("═══════════════════════════════════════════════════════════════════════════");
  
  for (const orderId of missingOrderIds) {
    try {
      const url = `https://api.tosspayments.com/v1/payments/orders/${orderId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const payment = await response.json();
        const date = new Date(payment.approvedAt || payment.requestedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
        const amount = payment.totalAmount.toLocaleString();
        const method = payment.method;
        const customerName = payment.card?.ownerType === 'PERSONAL' ? '개인' : (payment.customerName || '-');
        const email = payment.customerEmail || '-';
        
        console.log(`   ${date.padEnd(20)} | ${amount.padStart(8)}원 | ${method.padEnd(8)} | ${customerName.padEnd(8)} | ${email}`);
      } else {
        console.log(`   ${orderId}: 조회 실패`);
      }
    } catch (e) {
      console.log(`   ${orderId}: 오류 - ${e.message}`);
    }
  }
  
  console.log("═══════════════════════════════════════════════════════════════════════════\n");
  console.log("⚠️  위 8건은 토스에서 결제 완료됐지만 Azure에 수강 등록되지 않았습니다!");
  console.log("   → 관리자 페이지에서 수동 등록이 필요합니다.");
}

getPaymentDetails().catch(console.error);

