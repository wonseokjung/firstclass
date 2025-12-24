// 토스 API 응답 구조 확인
const TOSS_SECRET_KEY = 'live_sk_AQ92ymxN34P4R5EKxBkO3ajRKXvd';

async function debug() {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  console.log(`📅 조회 기간: ${startDate} ~ ${endDate}\n`);
  
  const basicAuth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
  
  const url = `https://api.tosspayments.com/v1/transactions?startDate=${startDate}&endDate=${endDate}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    console.log('❌ API 오류:', response.status);
    return;
  }
  
  const data = await response.json();
  
  console.log(`📊 총 ${data.length}건 조회됨\n`);
  
  // 결제 완료된 것만 필터
  const done = data.filter(t => t.status === 'DONE');
  console.log(`✅ 결제완료(DONE): ${done.length}건\n`);
  
  // 첫 5개 샘플 출력
  console.log('📋 샘플 데이터 (처음 5개):');
  console.log('─────────────────────────────────────────');
  
  done.slice(0, 5).forEach((t, i) => {
    console.log(`\n[${i + 1}]`);
    console.log(`   status: ${t.status}`);
    console.log(`   customerName: ${t.customerName || '없음'}`);
    console.log(`   customerEmail: ${t.customerEmail || '없음'}`);
    console.log(`   amount: ${t.amount}`);
    console.log(`   method: ${t.method}`);
    console.log(`   orderName: ${t.orderName}`);
    console.log(`   transactionAt: ${t.transactionAt}`);
  });
  
  // 이름 있는 거래만 추출
  const withName = done.filter(t => t.customerName);
  console.log(`\n\n👤 이름 있는 결제: ${withName.length}건`);
  
  if (withName.length > 0) {
    console.log('   이름 목록:', [...new Set(withName.map(t => t.customerName))].slice(0, 10).join(', '));
  }
}

debug().catch(console.error);









