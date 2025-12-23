/**
 * 🔥 토스페이먼츠 결제 내역 → Azure 자동 수강 등록
 * 
 * 사용법:
 *   node scripts/auto-enroll-from-toss.js              # 오늘만 (DRY RUN)
 *   node scripts/auto-enroll-from-toss.js --run        # 오늘만 (실제 등록)
 *   node scripts/auto-enroll-from-toss.js --days=3     # 최근 3일 (DRY RUN)
 *   node scripts/auto-enroll-from-toss.js --days=3 --run  # 최근 3일 (실제 등록)
 */

const https = require('https');

// 명령줄 인자 파싱
const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--run');
const daysArg = args.find(a => a.startsWith('--days='));
const DAYS = daysArg ? parseInt(daysArg.split('=')[1]) : 1; // 기본 1일 (오늘만)

const TOSS_SECRET_KEY = 'live_sk_AQ92ymxN34P4R5EKxBkO3ajRKXvd';
const AZURE_SAS_URL = 'https://clathonstorage.table.core.windows.net/users?sp=raud&st=2025-12-07T14:26:24Z&se=2029-10-15T22:41:00Z&sv=2024-11-04&sig=5KPeZHVwROPfNh1KBESKRJrnE12hTd2fTtESe3x5YSU%3D&tn=users';

// 상품명 → 강의 ID 매핑
const PRODUCT_TO_COURSE = {
  'Step 1: AI 건물주 되기 기초': { courseId: '999', courseName: 'AI 건물주 되기' },
  'Step 1: AI 건물주 되기 기초 (얼리버드)': { courseId: '999', courseName: 'AI 건물주 되기' },
  'Google Opal 유튜브 수익화 에이전트 기초': { courseId: '1002', courseName: 'AI 에이전트 비기너' },
  'AI 에이전트 비기너': { courseId: '1002', courseName: 'AI 에이전트 비기너' },
};

// 토스페이먼츠 API 호출
async function fetchTossTransactions(startDate, endDate) {
  console.log(`📥 토스페이먼츠 거래내역 조회: ${startDate} ~ ${endDate}\n`);
  
  const basicAuth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
  let allTransactions = [];
  let lastCursor = null;
  let page = 1;
  
  while (true) {
    let url = `https://api.tosspayments.com/v1/transactions?startDate=${startDate}&endDate=${endDate}`;
    if (lastCursor) url += `&lastCursor=${lastCursor}`;
    
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
    if (!data || data.length === 0) break;
    
    allTransactions = allTransactions.concat(data);
    console.log(`   ✅ ${data.length}건 로드 (총 ${allTransactions.length}건)`);
    
    if (data.length < 100) break;
    lastCursor = data[data.length - 1].transactionKey;
    page++;
  }
  
  // 완료된 가상계좌 결제만 필터링
  const completedPayments = allTransactions.filter(t => 
    t.status === 'DONE' && 
    (t.method === '가상계좌' || t.method === 'VIRTUAL_ACCOUNT' || t.method === '계좌이체')
  );
  console.log(`\n📊 완료된 가상계좌/계좌이체: ${completedPayments.length}건 (전체 ${allTransactions.length}건 중)\n`);
  
  return completedPayments;
}

// 결제 상세 정보 조회 (이메일 포함)
async function getPaymentDetail(paymentKey) {
  const basicAuth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
  
  const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    return null;
  }
  
  return await response.json();
}

// Azure에서 사용자 검색
async function findUserByEmail(email) {
  const url = `${AZURE_SAS_URL}&$filter=email eq '${encodeURIComponent(email)}'`;
  
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.value?.[0] || null);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Azure 사용자 업데이트
async function updateUserEnrollment(user, courseId, courseName, orderId) {
  const baseUrl = AZURE_SAS_URL.split('?')[0];
  const sasToken = AZURE_SAS_URL.split('?')[1];
  const url = `${baseUrl}(PartitionKey='${user.PartitionKey}',RowKey='${user.RowKey}')?${sasToken}`;
  
  // 기존 enrolledCourses 파싱
  let enrolledCourses = { enrollments: [] };
  if (user.enrolledCourses) {
    try {
      enrolledCourses = typeof user.enrolledCourses === 'string' 
        ? JSON.parse(user.enrolledCourses) 
        : user.enrolledCourses;
    } catch (e) {}
  }
  
  // 이미 등록되어 있는지 확인
  const alreadyEnrolled = enrolledCourses.enrollments?.some(e => e.courseId === courseId);
  if (alreadyEnrolled) {
    return { skipped: true, reason: '이미 등록됨' };
  }
  
  // 새 수강 정보 추가
  enrolledCourses.enrollments = enrolledCourses.enrollments || [];
  enrolledCourses.enrollments.push({
    courseId,
    courseName,
    enrolledAt: new Date().toISOString(),
    paymentId: orderId,
    status: 'active',
    progress: 0
  });
  
  // Azure 업데이트
  const body = JSON.stringify({
    PartitionKey: user.PartitionKey,
    RowKey: user.RowKey,
    enrolledCourses: JSON.stringify(enrolledCourses)
  });
  
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'MERGE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'If-Match': '*'
      }
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve({ success: true });
      } else {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${data}`)));
      }
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// 메인 실행
async function main() {
  console.log('🚀 토스페이먼츠 → Azure 자동 수강 등록\n');
  console.log('='.repeat(60));
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN 모드 - 실제 등록하지 않고 확인만 합니다');
    console.log('   실제 등록하려면: node scripts/auto-enroll-from-toss.js --run');
  } else {
    console.log('🔴 실제 등록 모드 - Azure에 수강 등록됩니다!');
  }
  console.log('='.repeat(60) + '\n');
  
  // 날짜 범위 설정 (한국 시간 기준)
  const now = new Date();
  const koreaOffset = 9 * 60; // KST +9
  const koreaTime = new Date(now.getTime() + (koreaOffset - now.getTimezoneOffset()) * 60000);
  
  const endDate = new Date(koreaTime);
  endDate.setDate(endDate.getDate() + 1); // 다음날까지 포함
  
  const startDate = new Date(koreaTime);
  startDate.setDate(startDate.getDate() - DAYS + 1);
  
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];
  
  console.log(`📅 조회 기간: ${startStr} ~ ${endStr} (${DAYS}일간)\n`);
  
  // 1. 토스페이먼츠에서 결제 내역 가져오기
  const payments = await fetchTossTransactions(startStr, endStr);
  
  let success = 0, skipped = 0, failed = 0, noUser = 0;
  
  // 2. 각 결제 처리
  for (let i = 0; i < payments.length; i++) {
    const payment = payments[i];
    const orderId = payment.orderId;
    const paymentKey = payment.paymentKey;
    
    // 결제 상세 정보 조회 (이메일 가져오기)
    console.log(`   [${i + 1}/${payments.length}] ${orderId} 상세 조회 중...`);
    const detail = await getPaymentDetail(paymentKey);
    
    if (!detail) {
      console.log(`⏭️ ${orderId}: 상세 정보 조회 실패`);
      skipped++;
      continue;
    }
    
    // 첫 번째 결제 상세 데이터 확인
    if (i === 0) {
      console.log('📋 상세 데이터 샘플:', JSON.stringify(detail, null, 2).substring(0, 1000));
    }
    
    // 이메일 찾기 (여러 경로 시도)
    const email = detail.customer?.email || 
                  detail.customerEmail || 
                  detail.receipt?.customerEmail ||
                  detail.virtualAccount?.customerEmail;
    const productName = detail.orderName || payment.orderName;
    const customerName = detail.customer?.name || detail.customerName || '이름없음';
    
    if (!email) {
      console.log(`⏭️ ${orderId}: 이메일 없음 (${customerName})`);
      skipped++;
      continue;
    }
    
    // 상품 → 강의 매핑
    let courseInfo = null;
    for (const [key, value] of Object.entries(PRODUCT_TO_COURSE)) {
      if (productName?.includes(key) || key.includes(productName?.substring(0, 10) || '')) {
        courseInfo = value;
        break;
      }
    }
    
    if (!courseInfo) {
      // 금액으로 추정
      if (payment.totalAmount === 45000) {
        courseInfo = PRODUCT_TO_COURSE['Step 1: AI 건물주 되기 기초'];
      } else if (payment.totalAmount === 95000) {
        courseInfo = PRODUCT_TO_COURSE['Google Opal 유튜브 수익화 에이전트 기초'];
      }
    }
    
    if (!courseInfo) {
      console.log(`⏭️ ${orderId}: 알 수 없는 상품 (${productName})`);
      skipped++;
      continue;
    }
    
    // Azure에서 사용자 찾기
    const user = await findUserByEmail(email);
    if (!user) {
      console.log(`❌ ${email}: Azure에 사용자 없음`);
      noUser++;
      continue;
    }
    
    // 수강 등록
    try {
      if (DRY_RUN) {
        // DRY RUN: 등록할 내용만 보여줌
        console.log(`🔍 [DRY RUN] ${email}: ${courseInfo.courseName} 등록 예정`);
        success++;
      } else {
        // 실제 등록
        const result = await updateUserEnrollment(user, courseInfo.courseId, courseInfo.courseName, orderId);
        if (result.skipped) {
          console.log(`⏭️ ${email}: ${result.reason}`);
          skipped++;
        } else {
          console.log(`✅ ${email}: ${courseInfo.courseName} 등록 완료!`);
          success++;
        }
      }
    } catch (error) {
      console.log(`❌ ${email}: 등록 실패 - ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 결과 요약');
  console.log('='.repeat(60));
  console.log(`✅ 성공: ${success}건`);
  console.log(`⏭️ 스킵: ${skipped}건`);
  console.log(`👤 사용자 없음: ${noUser}건`);
  console.log(`❌ 실패: ${failed}건`);
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);

