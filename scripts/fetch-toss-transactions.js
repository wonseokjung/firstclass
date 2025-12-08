// 토스페이먼츠 거래내역 조회 스크립트
const fs = require('fs');

const TOSS_SECRET_KEY = 'live_sk_AQ92ymxN34P4R5EKxBkO3ajRKXvd';

async function fetchTossTransactions() {
  console.log("📥 토스페이먼츠 거래내역 조회 중...\n");
  
  // 최근 3일 (12월 5일 ~ 12월 8일로 확장)
  const startDate = '2025-12-05';
  const endDate = '2025-12-08';
  
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
    
    // 다음 페이지가 있는지 확인
    if (data.length < 100) {
      break;
    }
    
    // 마지막 거래의 transactionKey를 커서로 사용
    lastCursor = data[data.length - 1].transactionKey;
    page++;
  }
  
  console.log(`\n📊 총 ${allTransactions.length}건 조회 완료`);
  
  // 파일로 저장
  fs.writeFileSync('/tmp/toss_transactions.json', JSON.stringify(allTransactions, null, 2));
  console.log('💾 /tmp/toss_transactions.json 저장 완료');
  
  // 가상계좌/계좌이체만 필터링해서 요약
  const virtualAndTransfer = allTransactions.filter(t => 
    t.status === 'DONE' && (t.method === '가상계좌' || t.method === '계좌이체')
  );
  
  console.log(`\n📋 가상계좌/계좌이체 결제 완료: ${virtualAndTransfer.length}건`);
  
  return allTransactions;
}

fetchTossTransactions().catch(console.error);

