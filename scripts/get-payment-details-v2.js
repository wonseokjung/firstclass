// 미등록 결제 상세 조회 (전체 정보)
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
        
        console.log("═══════════════════════════════════════════════════════════════════════════");
        console.log(`📋 주문번호: ${orderId}`);
        console.log(`💰 금액: ${payment.totalAmount?.toLocaleString()}원`);
        console.log(`📅 승인일시: ${payment.approvedAt}`);
        console.log(`💳 결제방법: ${payment.method}`);
        console.log(`📦 상품명: ${payment.orderName}`);
        
        if (payment.virtualAccount) {
          console.log(`🏦 가상계좌:`);
          console.log(`   - 은행: ${payment.virtualAccount.bankCode} ${payment.virtualAccount.bank}`);
          console.log(`   - 계좌번호: ${payment.virtualAccount.accountNumber}`);
          console.log(`   - 예금주: ${payment.virtualAccount.customerName}`);
          console.log(`   - 입금만료: ${payment.virtualAccount.dueDate}`);
        }
        
        if (payment.customerEmail) {
          console.log(`📧 이메일: ${payment.customerEmail}`);
        }
        if (payment.customerName) {
          console.log(`👤 고객명: ${payment.customerName}`);
        }
        console.log("");
      } else {
        const error = await response.json();
        console.log(`❌ ${orderId}: ${error.message}`);
      }
    } catch (e) {
      console.log(`❌ ${orderId}: 오류 - ${e.message}`);
    }
  }
  
  console.log("═══════════════════════════════════════════════════════════════════════════");
  console.log("\n⚠️  위 8건은 토스에서 결제 완료됐지만 Azure에 수강 등록되지 않았습니다!");
  console.log("   → 예금주명으로 사용자를 찾아서 수동 등록이 필요합니다.");
}

getPaymentDetails().catch(console.error);

