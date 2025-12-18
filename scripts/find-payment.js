// 🔍 특정 사용자 결제 찾기 스크립트
// 사용법: node find-payment.js "이메일 또는 이름"

const TOSS_SECRET_KEY = 'live_sk_AQ92ymxN34P4R5EKxBkO3ajRKXvd';

// Azure Table 설정
const AZURE_BASE_URL = 'https://clathonstorage.table.core.windows.net/users';
const SAS_TOKEN = 'sp=r&st=2025-12-06T15:31:19Z&se=2026-12-24T23:46:00Z&spr=https&sv=2024-11-04&sig=816ZVlfpFraKPWccsltwMCkDhqgJ6fucLXTGWGw1qOM%3D&tn=users';

async function findPayment(searchTerm) {
  console.log(`\n🔍 "${searchTerm}" 검색 중...\n`);
  console.log("═".repeat(60));

  // 1. Azure에서 사용자 찾기
  console.log("\n📋 1. Azure 사용자 검색...");
  const user = await findUserInAzure(searchTerm);
  
  if (user) {
    console.log(`   ✅ Azure 사용자 발견!`);
    console.log(`   📧 이메일: ${user.email}`);
    console.log(`   👤 이름: ${user.name}`);
    console.log(`   📱 핸드폰: ${user.phone || '없음'}`);
    
    // 수강 정보 확인
    if (user.enrolledCourses) {
      try {
        const enrolled = JSON.parse(user.enrolledCourses);
        const courses = enrolled.enrollments || [];
        const payments = enrolled.payments || [];
        
        console.log(`\n   📚 수강 중인 강의: ${courses.length}개`);
        for (const c of courses) {
          console.log(`      - ${c.title || c.courseId} (${c.status})`);
        }
        
        console.log(`\n   💳 결제 내역: ${payments.length}건`);
        for (const p of payments) {
          console.log(`      - ${p.createdAt?.split('T')[0] || '날짜없음'} | ${p.amount?.toLocaleString()}원 | ${p.courseName || p.courseId}`);
          if (p.orderId) console.log(`        orderId: ${p.orderId}`);
        }
      } catch (e) {
        console.log(`   ⚠️ 수강 정보 파싱 실패`);
      }
    } else {
      console.log(`   ⚠️ 수강 정보 없음 (등록된 강의 없음)`);
    }
  } else {
    console.log(`   ❌ Azure에 등록된 사용자 없음`);
  }

  // 2. 토스에서 결제 찾기 (최근 90일)
  console.log("\n\n📋 2. 토스페이먼츠 결제 검색 (최근 90일)...");
  const tossPayments = await findPaymentInToss(searchTerm);
  
  if (tossPayments.length > 0) {
    console.log(`   ✅ 토스 결제 발견: ${tossPayments.length}건\n`);
    
    for (const p of tossPayments) {
      console.log(`   ─────────────────────────────────────────`);
      console.log(`   📅 결제일: ${p.transactionAt}`);
      console.log(`   💰 금액: ${p.amount?.toLocaleString()}원`);
      console.log(`   📦 상품: ${p.orderName}`);
      console.log(`   💳 방법: ${p.method}`);
      console.log(`   📋 상태: ${p.status}`);
      console.log(`   🔑 orderId: ${p.orderId}`);
      console.log(`   🆔 TID: ${p.transactionKey}`);
      if (p.customerName) console.log(`   👤 고객명: ${p.customerName}`);
      if (p.customerEmail) console.log(`   📧 고객이메일: ${p.customerEmail}`);
    }
  } else {
    console.log(`   ❌ 토스에서 결제 내역 없음`);
  }

  console.log("\n" + "═".repeat(60));
  
  // 3. 결론
  console.log("\n📊 결론:");
  if (user && tossPayments.length > 0) {
    console.log("   ✅ Azure 등록 O + 토스 결제 O → 정상 사용자");
  } else if (user && tossPayments.length === 0) {
    console.log("   ⚠️ Azure 등록 O + 토스 결제 X → 수동 등록 또는 무료 등록");
  } else if (!user && tossPayments.length > 0) {
    console.log("   ❌ Azure 등록 X + 토스 결제 O → 결제했으나 미등록! 확인 필요");
  } else {
    console.log("   ❌ Azure 등록 X + 토스 결제 X → 아직 결제/가입 안 함");
  }
  console.log("");
}

// Azure 사용자 검색 (빠른 버전)
async function findUserInAzure(searchTerm) {
  const searchLower = searchTerm.toLowerCase();
  
  let nextPartitionKey = null;
  let nextRowKey = null;
  let pageCount = 0;
  
  process.stdout.write('   ');
  
  while (pageCount < 10) { // 최대 10페이지
    let url = `${AZURE_BASE_URL}?${SAS_TOKEN}`;
    
    if (nextPartitionKey && nextRowKey) {
      url += `&NextPartitionKey=${encodeURIComponent(nextPartitionKey)}&NextRowKey=${encodeURIComponent(nextRowKey)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'x-ms-version': '2020-04-08'
      }
    });
    
    if (!response.ok) {
      console.log(`Azure API 오류: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    const users = data.value || [];
    
    process.stdout.write('.');
    
    // 검색 - 찾으면 바로 리턴
    for (const user of users) {
      const emailMatch = user.email?.toLowerCase().includes(searchLower);
      const nameMatch = user.name?.toLowerCase().includes(searchLower);
      const phoneMatch = user.phone?.includes(searchTerm);
      
      if (emailMatch || nameMatch || phoneMatch) {
        console.log(' 발견!');
        return user;
      }
    }
    
    nextPartitionKey = response.headers.get('x-ms-continuation-NextPartitionKey');
    nextRowKey = response.headers.get('x-ms-continuation-NextRowKey');
    
    if (!nextPartitionKey || !nextRowKey) {
      break;
    }
    
    pageCount++;
  }
  
  console.log(' 없음');
  return null;
}

// 토스 결제 검색 (최근 14일 - 빠른 검색)
async function findPaymentInToss(searchTerm) {
  const searchLower = searchTerm.toLowerCase();
  const results = [];
  
  // 최근 14일만 검색 (빠름!)
  const now = new Date();
  const startDate = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = now.toISOString().split('T')[0];
  
  const basicAuth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
  
  let lastCursor = null;
  let pageCount = 0;
  
  process.stdout.write('   ');
  
  while (pageCount < 5) { // 최대 5페이지만
    let url = `https://api.tosspayments.com/v1/transactions?startDate=${startDate}&endDate=${endDate}`;
    if (lastCursor) {
      url += `&lastCursor=${lastCursor}`;
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        break;
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        break;
      }
      
      process.stdout.write('.');
      
      // 검색
      for (const tx of data) {
        const matchOrderId = tx.orderId?.toLowerCase().includes(searchLower);
        const matchEmail = tx.customerEmail?.toLowerCase().includes(searchLower);
        const matchName = tx.customerName?.toLowerCase().includes(searchLower);
        const matchPhone = tx.customerMobilePhone?.includes(searchTerm);
        
        if (matchOrderId || matchEmail || matchName || matchPhone) {
          results.push(tx);
        }
      }
      
      // 찾았으면 바로 종료
      if (results.length > 0) {
        break;
      }
      
      if (data.length < 100) {
        break;
      }
      
      lastCursor = data[data.length - 1].transactionKey;
      pageCount++;
    } catch (e) {
      break;
    }
  }
  
  console.log('');
  return results;
}

// 실행
const searchTerm = process.argv[2];
if (!searchTerm) {
  console.log("❌ 사용법: node find-payment.js \"이메일 또는 이름\"");
  console.log("   예시: node find-payment.js \"bettybap201@gmail.com\"");
  console.log("   예시: node find-payment.js \"김철수\"");
  process.exit(1);
}

findPayment(searchTerm).catch(console.error);

