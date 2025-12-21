/**
 * 에스크로 배송완료 일괄 등록 스크립트
 * 
 * 사용법:
 * 1. MERT_KEY를 상점관리자에서 확인하여 입력
 * 2. node scripts/escrow-batch-complete.js 실행
 */

const crypto = require('crypto');
const https = require('https');
const XLSX = require('xlsx');
const path = require('path');

// ============================================
// 🔐 설정 - 여기를 수정하세요!
// ============================================

const MID = 'clathou1x0';  // 상점 ID
const MERT_KEY = 'YOUR_MERT_KEY_HERE';  // ⚠️ 상점관리자에서 확인 후 입력!

// 엑셀 파일 경로
const EXCEL_FILE = path.join(__dirname, '../docs/에스크로_결제내역_2025.09.22-2025.12.21.xlsx');

// ============================================
// 🔧 함수들
// ============================================

// MD5 해시 생성
function createMD5Hash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

// hashdata 생성 (배송완료용)
function createHashData(mid, oid, dlvtype, rcvdate, mertkey) {
  const raw = mid + oid + dlvtype + rcvdate + mertkey;
  return createMD5Hash(raw);
}

// 날짜 포맷 변환 (2025-12-21 01:18:25 → 202512210118)
function formatDate(dateStr) {
  if (!dateStr) return '202512211200';
  
  // 엑셀 날짜 형식 처리
  let date;
  if (typeof dateStr === 'number') {
    // 엑셀 시리얼 날짜
    date = new Date((dateStr - 25569) * 86400 * 1000);
  } else {
    date = new Date(dateStr);
  }
  
  if (isNaN(date.getTime())) {
    return '202512211200';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}${hour}${min}`;
}

// 에스크로 배송완료 등록 API 호출
function registerDeliveryComplete(order) {
  return new Promise((resolve, reject) => {
    const dlvtype = '01';  // 배송완료 (택배 아님)
    const rcvrelation = '본인';
    
    const hashdata = createHashData(MID, order.oid, dlvtype, order.rcvdate, MERT_KEY);
    
    const params = new URLSearchParams({
      mid: MID,
      oid: order.oid,
      dlvtype: dlvtype,
      rcvdate: order.rcvdate,
      rcvname: order.rcvname || '구매자',
      rcvrelation: rcvrelation,
      hashdata: hashdata
    });
    
    const options = {
      hostname: 'pgweb.tosspayments.com',
      port: 443,
      path: '/pg/wmp/mertadmin/jsp/escrow/rcvdlvinfo.jsp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(params.toString())
      }
    };
    
    console.log(`\n📦 처리 중: ${order.oid}`);
    console.log(`   수령인: ${order.rcvname}`);
    console.log(`   수령일: ${order.rcvdate}`);
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (data.includes('OK')) {
          console.log(`   ✅ 성공!`);
          resolve({ oid: order.oid, success: true, response: data });
        } else {
          console.log(`   ❌ 실패: ${data}`);
          resolve({ oid: order.oid, success: false, response: data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ 에러: ${error.message}`);
      reject(error);
    });
    
    req.write(params.toString());
    req.end();
  });
}

// 엑셀 파일 읽기
function readExcelFile() {
  console.log(`📂 엑셀 파일 읽는 중: ${EXCEL_FILE}`);
  
  try {
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`📋 총 ${data.length}건 발견`);
    
    // 데이터 구조 확인
    if (data.length > 0) {
      console.log('\n📊 컬럼 구조:', Object.keys(data[0]));
      console.log('📊 샘플 데이터:', data[0]);
    }
    
    return data;
  } catch (error) {
    console.error('❌ 엑셀 파일 읽기 실패:', error.message);
    return [];
  }
}

// 주문 데이터 변환
function parseOrders(excelData) {
  const orders = [];
  
  for (const row of excelData) {
    // 컬럼명에 따라 적절히 매핑 (엑셀 구조에 맞게 수정 필요)
    const oid = row['주문번호'] || row['orderId'] || row['oid'];
    const rcvname = row['구매자명'] || row['buyerName'] || row['rcvname'] || '구매자';
    const dateStr = row['결제일시'] || row['등록일시'] || row['paymentDate'];
    
    if (oid && oid.startsWith('order_')) {
      orders.push({
        oid: oid,
        rcvname: rcvname.replace(/\*/g, ''),  // 마스킹 제거
        rcvdate: formatDate(dateStr)
      });
    }
  }
  
  return orders;
}

// 일괄 처리 실행
async function processAllOrders() {
  console.log('🚀 에스크로 배송완료 일괄 등록 시작');
  console.log(`🏪 상점 ID: ${MID}`);
  
  if (MERT_KEY === 'YOUR_MERT_KEY_HERE') {
    console.log('\n⚠️  경고: MERT_KEY를 설정해주세요!');
    console.log('   토스페이먼츠 상점관리자 → 상점정보 → 상점키 확인\n');
    
    // 먼저 엑셀 데이터만 확인
    const excelData = readExcelFile();
    const orders = parseOrders(excelData);
    console.log(`\n📋 처리 대상 주문: ${orders.length}건`);
    
    if (orders.length > 0) {
      console.log('\n🔍 처리될 주문 목록 (처음 5건):');
      orders.slice(0, 5).forEach((o, i) => {
        console.log(`   ${i+1}. ${o.oid} / ${o.rcvname} / ${o.rcvdate}`);
      });
    }
    
    console.log('\n💡 MERT_KEY 설정 후 다시 실행해주세요!');
    return;
  }
  
  // 엑셀 데이터 읽기
  const excelData = readExcelFile();
  const orders = parseOrders(excelData);
  
  console.log(`📋 처리할 주문: ${orders.length}건`);
  
  if (orders.length === 0) {
    console.log('❌ 처리할 주문이 없습니다.');
    return;
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (const order of orders) {
    try {
      const result = await registerDeliveryComplete(order);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
      // API 호출 간격 (0.5초)
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      failCount++;
    }
  }
  
  console.log('\n========================================');
  console.log('📊 처리 결과');
  console.log(`   ✅ 성공: ${successCount}건`);
  console.log(`   ❌ 실패: ${failCount}건`);
  console.log('========================================');
}

// 실행
processAllOrders();
