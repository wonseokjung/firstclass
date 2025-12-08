// 미등록 사용자 찾기 및 수강 등록
const fs = require('fs');

const AZURE_BASE_URL = 'https://clathonstorage.table.core.windows.net/users';
const SAS_TOKEN = 'sp=raud&st=2025-12-07T12:42:54Z&se=2025-12-07T20:57:54Z&sv=2024-11-04&sig=Ya0HK8S3qNakPCliJl3%2BcBROFeCrsKoRI4seSJiJ%2Bu8%3D&tn=users';

// 미등록 결제 정보 (12/5 ~ 12/7 전체)
const missingPayments = [
  // 12월 5일
  { name: '김경일', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1764923324812_ajtz1lh1q', date: '2025-12-05T17:30:50+09:00' },
  { name: '안미숙', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1764746787834_x9bnz1hs1', date: '2025-12-05T17:50:41+09:00' },
  { name: '박승현', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1764943447970_dben71lmg', date: '2025-12-05T23:08:32+09:00' },
  { name: '유영준', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1764866794755_bubqm2r42', date: '2025-12-05T01:51:51+09:00' },
  { name: '성광주', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1764894870585_wk7k9zj6o', date: '2025-12-05T09:40:27+09:00' },
  { name: '백영수', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1764914444050_b84d4hrli', date: '2025-12-05T15:05:48+09:00' },
  // 12월 6일
  { name: '이성길', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1764965884592_03a0ywoyo', date: '2025-12-06T05:21:32+09:00' },
  { name: '김정호', amount: 95000, courseId: 'chatgpt-agent-beginner', orderId: 'order_1764940834249_zezctkuoo', date: '2025-12-06T07:28:45+09:00' },
  { name: '김정호', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1764942246961_ins4bov89', date: '2025-12-06T09:21:22+09:00' },
  { name: '권오영', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1764995236248_09ft0l7n0', date: '2025-12-06T13:30:43+09:00' },
  { name: '강민화', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1764996379623_fv3b0x0si', date: '2025-12-06T13:50:14+09:00' },
  { name: '노인오', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1765014630695_i14hpnj36', date: '2025-12-06T18:51:53+09:00' },
  // 12월 7일
  { name: '최현진', amount: 95000, courseId: 'chatgpt-agent-beginner', orderId: 'order_1765037724776_6krn2d5xo', date: '2025-12-07T01:19:03+09:00' },
  { name: 'kim', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1765064081113_cpqukz248', date: '2025-12-07T08:46:18+09:00' },
  { name: '장경수', amount: 95000, courseId: 'chatgpt-agent-beginner', orderId: 'order_1765066804549_xnyrwcqxw', date: '2025-12-07T09:22:01+09:00' },
  { name: '윤종백', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1765082085538_8yfvh58aj', date: '2025-12-07T13:36:29+09:00' },
  { name: '조익호', amount: 95000, courseId: 'chatgpt-agent-beginner', orderId: 'order_1765086842893_51gk3aat0', date: '2025-12-07T14:56:15+09:00' },
  { name: '김유이', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1765093558453_e0xvdn1cu', date: '2025-12-07T16:49:38+09:00' },
  { name: 'Hyunhochoi', amount: 95000, courseId: 'chatgpt-agent-beginner', orderId: 'order_1765094669479_0hcs2kbac', date: '2025-12-07T17:11:00+09:00' },
  { name: '고희정', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1765096522529_2v8yofx9l', date: '2025-12-07T17:38:32+09:00' },
  { name: '안성범', amount: 45000, courseId: 'ai-building-course', orderId: 'order_1765109489882_vrd09u4b2', date: '2025-12-07T21:15:25+09:00' },
];

async function fetchAllAzureUsers() {
  let allUsers = [];
  let nextPartitionKey = null;
  let nextRowKey = null;
  
  while (true) {
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
    
    if (!response.ok) throw new Error(`Azure API 오류: ${response.status}`);
    
    const data = await response.json();
    allUsers = allUsers.concat(data.value || []);
    
    nextPartitionKey = response.headers.get('x-ms-continuation-NextPartitionKey');
    nextRowKey = response.headers.get('x-ms-continuation-NextRowKey');
    
    if (!nextPartitionKey || !nextRowKey) break;
  }
  
  return allUsers;
}

async function updateUserEnrollment(user, payment) {
  const url = `${AZURE_BASE_URL}(PartitionKey='${encodeURIComponent(user.PartitionKey)}',RowKey='${encodeURIComponent(user.RowKey)}')?${SAS_TOKEN}`;
  
  // 기존 enrolledCourses 파싱
  let enrolledCourses = { enrollments: [], payments: [] };
  if (user.enrolledCourses) {
    try {
      enrolledCourses = JSON.parse(user.enrolledCourses);
    } catch (e) {}
  }
  
  // 이미 등록된 courseId인지 확인
  const alreadyEnrolled = enrolledCourses.enrollments?.some(e => e.courseId === payment.courseId);
  if (alreadyEnrolled) {
    console.log(`   ⏭️  이미 ${payment.courseId} 등록됨, 스킵`);
    return false;
  }
  
  // 새 enrollment 추가
  enrolledCourses.enrollments = enrolledCourses.enrollments || [];
  enrolledCourses.enrollments.push({
    courseId: payment.courseId,
    enrolledAt: payment.date,
    status: 'active'
  });
  
  // 새 payment 추가
  enrolledCourses.payments = enrolledCourses.payments || [];
  enrolledCourses.payments.push({
    orderId: payment.orderId,
    amount: payment.amount,
    courseId: payment.courseId,
    paymentDate: payment.date,
    method: '가상계좌'
  });
  
  // Azure 업데이트
  const response = await fetch(url, {
    method: 'MERGE',
    headers: {
      'Content-Type': 'application/json',
      'x-ms-version': '2020-04-08',
      'If-Match': '*'
    },
    body: JSON.stringify({
      enrolledCourses: JSON.stringify(enrolledCourses)
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`업데이트 실패: ${error}`);
  }
  
  return true;
}

async function main() {
  console.log("🔍 미등록 사용자 찾기 및 등록 시작...\n");
  
  // Azure 사용자 전체 조회
  console.log("📋 Azure 사용자 로딩 중...");
  const users = await fetchAllAzureUsers();
  console.log(`   ✅ ${users.length}명 로드 완료\n`);
  
  // 이름으로 사용자 찾기
  let registered = 0;
  let notFound = [];
  
  for (const payment of missingPayments) {
    console.log(`\n🔍 ${payment.name} (${payment.amount.toLocaleString()}원, ${payment.courseId}) 찾는 중...`);
    
    // 이름으로 검색
    const matchedUsers = users.filter(u => u.name === payment.name);
    
    if (matchedUsers.length === 0) {
      console.log(`   ❌ "${payment.name}" 사용자를 찾을 수 없음`);
      notFound.push(payment);
      continue;
    }
    
    if (matchedUsers.length > 1) {
      console.log(`   ⚠️  "${payment.name}" 동명이인 ${matchedUsers.length}명:`);
      for (const u of matchedUsers) {
        console.log(`      - ${u.email}`);
      }
      // 첫 번째 사용자로 등록 (또는 나중에 수동 처리)
      console.log(`   → 첫 번째 사용자로 등록 시도`);
    }
    
    const user = matchedUsers[0];
    console.log(`   ✅ 찾음: ${user.email}`);
    
    try {
      const success = await updateUserEnrollment(user, payment);
      if (success) {
        console.log(`   🎉 등록 완료!`);
        registered++;
      }
    } catch (e) {
      console.log(`   ❌ 등록 실패: ${e.message}`);
    }
  }
  
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`✅ 등록 완료: ${registered}건`);
  console.log(`❌ 미발견: ${notFound.length}건`);
  
  if (notFound.length > 0) {
    console.log("\n❌ 찾지 못한 사용자:");
    for (const p of notFound) {
      console.log(`   - ${p.name} (${p.amount.toLocaleString()}원)`);
    }
  }
}

main().catch(console.error);

