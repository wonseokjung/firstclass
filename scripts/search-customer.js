// 토스페이먼츠 이름으로 결제자 검색
const TOSS_SECRET_KEY = 'live_sk_AQ92ymxN34P4R5EKxBkO3ajRKXvd';

// 사용법: node scripts/search-customer.js 홍길동
const searchName = process.argv[2];

if (!searchName) {
  console.log('❌ 사용법: node scripts/search-customer.js [이름]');
  console.log('   예시: node scripts/search-customer.js 홍길동');
  process.exit(1);
}

async function searchCustomer(name) {
  console.log(`🔍 "${name}" 검색 중...\n`);
  
  // 최근 3개월 조회
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const basicAuth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
  
  let allTransactions = [];
  let lastCursor = null;
  
  // 최대 20페이지만 조회 (2000건)
  for (let page = 1; page <= 20; page++) {
    let url = `https://api.tosspayments.com/v1/transactions?startDate=${startDate}&endDate=${endDate}`;
    if (lastCursor) url += `&lastCursor=${lastCursor}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) break;
    
    const data = await response.json();
    if (!data || data.length === 0) break;
    
    allTransactions = allTransactions.concat(data);
    
    if (data.length < 100) break;
    lastCursor = data[data.length - 1].transactionKey;
  }
  
  // 이름으로 필터링 (결제 완료된 것만)
  const found = allTransactions.filter(t => 
    t.status === 'DONE' && 
    t.customerName && 
    t.customerName.includes(name)
  );
  
  if (found.length === 0) {
    console.log(`❌ "${name}" 이름의 결제 내역을 찾을 수 없습니다.`);
    console.log(`   (최근 3개월, 최대 2000건 검색)`);
    return;
  }
  
  console.log("═══════════════════════════════════════════════════════════════════════════════════");
  console.log("   날짜                 | 이름       | 금액       | 결제방법   | 상품명");
  console.log("═══════════════════════════════════════════════════════════════════════════════════");
  
  found.forEach(t => {
    const date = new Date(t.transactionAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    const amount = t.amount?.toLocaleString() || '-';
    const method = t.method || '-';
    const orderName = (t.orderName || '-').substring(0, 25);
    
    console.log(`   ${date.padEnd(20)} | ${t.customerName.padEnd(10)} | ${amount.padStart(10)}원 | ${method.padEnd(10)} | ${orderName}`);
  });
  
  console.log("═══════════════════════════════════════════════════════════════════════════════════");
  console.log(`\n✅ "${name}" 검색 결과: ${found.length}건`);
}

searchCustomer(searchName).catch(console.error);








