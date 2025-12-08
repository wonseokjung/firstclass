// 토스 결제 내역과 Azure 등록 현황 비교 스크립트 (전체 사용자 조회)
const fs = require('fs');

// Azure SAS URL (기본 URL)
const AZURE_BASE_URL = 'https://clathonstorage.table.core.windows.net/users';
const SAS_TOKEN = 'sp=r&st=2025-12-06T15:31:19Z&se=2026-12-24T23:46:00Z&spr=https&sv=2024-11-04&sig=816ZVlfpFraKPWccsltwMCkDhqgJ6fucLXTGWGw1qOM%3D&tn=users';

async function fetchAllAzureUsers() {
  let allUsers = [];
  let nextPartitionKey = null;
  let nextRowKey = null;
  
  while (true) {
    let url = `${AZURE_BASE_URL}?${SAS_TOKEN}`;
    
    // 페이지네이션 토큰 추가
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
      throw new Error(`Azure API 오류: ${response.status}`);
    }
    
    const data = await response.json();
    const users = data.value || [];
    allUsers = allUsers.concat(users);
    
    // 다음 페이지 토큰 확인
    nextPartitionKey = response.headers.get('x-ms-continuation-NextPartitionKey');
    nextRowKey = response.headers.get('x-ms-continuation-NextRowKey');
    
    console.log(`   ... ${allUsers.length}명 로드됨`);
    
    // 더 이상 페이지가 없으면 종료
    if (!nextPartitionKey || !nextRowKey) {
      break;
    }
  }
  
  return allUsers;
}

async function main() {
  console.log("📊 토스 vs Azure 결제 대사 시작...\n");
  
  // 토스 결제 데이터 로드 (최근 3일 필터링: 12월 5일 ~ 12월 7일)
  const filterStart = new Date('2025-12-05T00:00:00+09:00');
  const filterEnd = new Date('2025-12-07T23:59:59+09:00');
  
  const tossData = JSON.parse(fs.readFileSync('/tmp/toss_transactions.json', 'utf8'));
  const allDoneTransactions = tossData.filter(t => t.status === 'DONE');
  
  // 가상계좌, 계좌이체만 필터링
  const virtualAndTransferMethods = ['가상계좌', '계좌이체'];
  const doneTransactions = allDoneTransactions.filter(t => {
    const txDate = new Date(t.transactionAt);
    const isInRange = txDate >= filterStart && txDate <= filterEnd;
    const isVirtualOrTransfer = virtualAndTransferMethods.includes(t.method);
    return isInRange && isVirtualOrTransfer;
  });
  
  console.log(`📅 조회 기간: 2025-12-05 ~ 2025-12-07 (최근 3일)`);
  console.log(`✅ 토스 결제 완료(DONE): ${doneTransactions.length}건 (전체: ${allDoneTransactions.length}건)`);
  
  // Azure 사용자 조회 (전체 페이지)
  console.log("📋 Azure 사용자 데이터 로딩 중 (전체)...");
  const users = await fetchAllAzureUsers();
  
  console.log(`👥 Azure 전체 사용자: ${users.length}명\n`);
  
  // 등록된 orderId 수집
  const azureOrderIds = new Set();
  const userByOrderId = new Map();
  
  for (const user of users) {
    if (user.enrolledCourses) {
      try {
        const enrolled = JSON.parse(user.enrolledCourses);
        const payments = enrolled.payments || [];
        for (const p of payments) {
          if (p.orderId) {
            azureOrderIds.add(p.orderId);
            userByOrderId.set(p.orderId, {
              email: user.email,
              name: user.name
            });
          }
        }
      } catch (e) {}
    }
  }
  
  console.log(`💾 Azure에 등록된 결제(orderId): ${azureOrderIds.size}건\n`);
  
  // 비교 분석
  let matched = 0;
  let tossOnly = [];  // 토스에만 있음 (Azure 미등록)
  
  // 토스 결제 중 Azure에 없는 것
  for (const tx of doneTransactions) {
    if (azureOrderIds.has(tx.orderId)) {
      matched++;
    } else {
      tossOnly.push({
        orderId: tx.orderId,
        amount: tx.amount,
        method: tx.method,
        date: tx.transactionAt
      });
    }
  }
  
  // Azure에 있지만 토스에 없는 것 (조회 기간 내)
  const tossOrderIds = new Set(doneTransactions.map(t => t.orderId));
  // 최근 3일 (12월 5일 ~ 12월 7일)
  const startDate = new Date('2025-12-05');
  const endDate = new Date('2025-12-07');
  endDate.setHours(23, 59, 59);
  
  let azureOnly = [];
  
  for (const user of users) {
    if (user.enrolledCourses) {
      try {
        const enrolled = JSON.parse(user.enrolledCourses);
        const payments = enrolled.payments || [];
        for (const p of payments) {
          if (p.orderId && !tossOrderIds.has(p.orderId)) {
            const payDate = new Date(p.paymentDate || p.createdAt);
            if (payDate >= startDate && payDate <= endDate) {
              azureOnly.push({
                orderId: p.orderId,
                amount: p.amount,
                email: user.email,
                name: user.name,
                date: p.paymentDate || p.createdAt
              });
            }
          }
        }
      } catch (e) {}
    }
  }
  
  // 중복 제거
  const uniqueAzureOnly = [];
  const seenOrderIds = new Set();
  for (const a of azureOnly) {
    if (!seenOrderIds.has(a.orderId)) {
      seenOrderIds.add(a.orderId);
      uniqueAzureOnly.push(a);
    }
  }
  azureOnly = uniqueAzureOnly;
  
  // 결과 출력
  console.log("═══════════════════════════════════════════════════════════");
  console.log("📊 대사 결과 요약");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`✅ 정상 (토스 + Azure 일치): ${matched}건`);
  console.log(`⚠️  토스에만 있음 (Azure 미등록): ${tossOnly.length}건`);
  console.log(`🔍 Azure에만 있음 (오등록 의심): ${azureOnly.length}건`);
  console.log("");
  
  // 미등록 상세 (금액별)
  if (tossOnly.length > 0) {
    const toss45k = tossOnly.filter(t => t.amount === 45000);
    const toss95k = tossOnly.filter(t => t.amount === 95000);
    
    console.log("─────────────────────────────────────────────────────────");
    console.log("⚠️  토스 결제 완료 but Azure 미등록:");
    console.log(`   🏢 AI 건물주 (45,000원): ${toss45k.length}건`);
    console.log(`   🤖 에이전트 (95,000원): ${toss95k.length}건`);
    console.log("");
    
    // 월별 분석
    console.log("📅 미등록 건 월별 분포:");
    const byMonth = {};
    for (const t of tossOnly) {
      const month = t.date.substring(0, 7);
      byMonth[month] = (byMonth[month] || 0) + 1;
    }
    for (const [month, count] of Object.entries(byMonth).sort()) {
      console.log(`   ${month}: ${count}건`);
    }
  }
  
  console.log("");
  
  // 오등록 의심 상세
  if (azureOnly.length > 0) {
    console.log("─────────────────────────────────────────────────────────");
    console.log("🔍 Azure에만 있음 (오등록 의심):");
    
    // manual_ 로 시작하는 것 (수동 등록)
    const manualEntries = azureOnly.filter(a => a.orderId?.startsWith('manual_'));
    const otherEntries = azureOnly.filter(a => !a.orderId?.startsWith('manual_'));
    
    console.log(`   📝 수동 등록 (manual_): ${manualEntries.length}건`);
    console.log(`   ❓ 기타: ${otherEntries.length}건`);
    console.log("");
    
    if (otherEntries.length > 0) {
      console.log("   ❓ 기타 (토스에 없는데 Azure에 등록된 것):");
      for (const a of otherEntries.slice(0, 10)) {
        console.log(`      ${a.date?.split('T')[0] || '날짜없음'} | ${a.amount}원 | ${a.name} (${a.email}) | ${a.orderId}`);
      }
      if (otherEntries.length > 10) {
        console.log(`      ... 외 ${otherEntries.length - 10}건`);
      }
    }
  }
  
  console.log("\n═══════════════════════════════════════════════════════════");
  
  // 결과 파일 저장
  const result = {
    summary: {
      tossTotal: doneTransactions.length,
      azureUsers: users.length,
      azureOrderIds: azureOrderIds.size,
      matched,
      tossOnlyCount: tossOnly.length,
      azureOnlyCount: azureOnly.length
    },
    tossOnly: tossOnly.slice(0, 100), // 처음 100개만
    azureOnly
  };
  
  fs.writeFileSync('/tmp/payment_comparison_result.json', JSON.stringify(result, null, 2));
  console.log("💾 상세 결과: /tmp/payment_comparison_result.json");
}

main().catch(console.error);
