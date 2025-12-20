// 토스페이먼츠 전체 결제자 조회 스크립트
const fs = require('fs');

const TOSS_SECRET_KEY = 'live_sk_AQ92ymxN34P4R5EKxBkO3ajRKXvd';

async function listAllCustomers() {
  console.log("📥 토스페이먼츠 전체 결제자 조회 중...\n");
  
  // 조회 기간 설정 (원하는 기간으로 수정)
  const startDate = '2025-11-20';  // 최근 1개월
  const endDate = '2025-12-20';
  
  const basicAuth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
  
  let allTransactions = [];
  let lastCursor = null;
  let page = 1;
  
  while (true) {
    let url = `https://api.tosspayments.com/v1/transactions?startDate=${startDate}&endDate=${endDate}`;
    if (lastCursor) {
      url += `&lastCursor=${lastCursor}`;
    }
    
    console.log(`   📄 페이지 ${page} 조회 중...`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`토스 API 오류: ${error.message || response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      break;
    }
    
    allTransactions = allTransactions.concat(data);
    console.log(`   ✅ ${data.length}건 로드 (총 ${allTransactions.length}건)`);
    
    if (data.length < 100) {
      break;
    }
    
    lastCursor = data[data.length - 1].transactionKey;
    page++;
  }
  
  // 결제 완료된 것만 필터링
  const completedPayments = allTransactions.filter(t => t.status === 'DONE');
  
  console.log("\n═══════════════════════════════════════════════════════════════════════════════════");
  console.log("   #  | 날짜                 | 이름       | 금액       | 결제방법   | 상품명");
  console.log("═══════════════════════════════════════════════════════════════════════════════════");
  
  const customers = [];
  
  completedPayments.forEach((t, idx) => {
    const date = new Date(t.transactionAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    const name = t.customerName || '-';
    const amount = t.amount?.toLocaleString() || '-';
    const method = t.method || '-';
    const orderName = t.orderName || '-';
    
    console.log(`   ${(idx + 1).toString().padStart(3)} | ${date.substring(0, 20).padEnd(20)} | ${name.padEnd(10)} | ${amount.padStart(10)}원 | ${method.padEnd(10)} | ${orderName.substring(0, 30)}`);
    
    customers.push({
      date: t.transactionAt,
      name: t.customerName,
      email: t.customerEmail,
      amount: t.amount,
      method: t.method,
      orderName: t.orderName,
      orderId: t.orderId,
      paymentKey: t.paymentKey
    });
  });
  
  console.log("═══════════════════════════════════════════════════════════════════════════════════");
  console.log(`\n📊 총 결제 완료: ${completedPayments.length}건`);
  
  // 이름만 따로 출력
  console.log("\n📋 결제자 이름 목록:");
  console.log("─────────────────────");
  const uniqueNames = [...new Set(customers.map(c => c.name).filter(n => n))];
  uniqueNames.forEach((name, idx) => {
    console.log(`   ${idx + 1}. ${name}`);
  });
  console.log(`\n   → 총 ${uniqueNames.length}명 (중복 제외)`);
  
  // JSON 파일로 저장
  fs.writeFileSync('/tmp/all_customers.json', JSON.stringify(customers, null, 2));
  console.log('\n💾 /tmp/all_customers.json 저장 완료');
  
  return customers;
}

listAllCustomers().catch(console.error);

