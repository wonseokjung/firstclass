/**
 * Azure Communication Services를 이용한 대량 이메일 발송 스크립트
 * 
 * 사용법:
 *   DRY_RUN=true node scripts/send-mass-email.js           # 테스트 (발송 안함)
 *   node scripts/send-mass-email.js                        # 실제 발송
 *   TARGET=marketing node scripts/send-mass-email.js       # 마케팅 동의자만
 *   TARGET=enrolled node scripts/send-mass-email.js        # 수강생만
 *   TARGET=all node scripts/send-mass-email.js             # 전체 회원
 */

const { EmailClient } = require('@azure/communication-email');
const https = require('https');

// ============ 설정 (환경변수 사용) ============
// 사용 전 환경변수 설정 필요:
// export AZURE_EMAIL_CONNECTION_STRING="endpoint=https://..."
// export AZURE_EMAIL_SENDER="DoNotReply@...azurecomm.net"
// export AZURE_TABLE_SAS_URL="https://..."

const CONNECTION_STRING = process.env.AZURE_EMAIL_CONNECTION_STRING || '';
const SENDER_EMAIL = process.env.AZURE_EMAIL_SENDER || '';
const BASE_URL = process.env.AZURE_TABLE_SAS_URL || '';

if (!CONNECTION_STRING || !SENDER_EMAIL || !BASE_URL) {
  console.error('❌ 환경변수가 설정되지 않았습니다!');
  console.error('다음 환경변수를 설정해주세요:');
  console.error('  - AZURE_EMAIL_CONNECTION_STRING');
  console.error('  - AZURE_EMAIL_SENDER');
  console.error('  - AZURE_TABLE_SAS_URL');
  process.exit(1);
}

// 환경변수
const DRY_RUN = process.env.DRY_RUN === 'true';
const TARGET = process.env.TARGET || 'marketing'; // 'all', 'marketing', 'enrolled'

// ============ 이메일 내용 ============
const EMAIL_SUBJECT = '🎓 [AI City Builders] 수강생 전용 라이브가 추가되었습니다!';

const EMAIL_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; line-height: 1.8; color: #333; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e3a5f, #2d5a87); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .content p { margin-bottom: 15px; }
    .highlight { background: linear-gradient(135deg, #fff3cd, #ffeeba); padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #ffc107; }
    .schedule { background: #e8f4fd; padding: 20px; border-radius: 10px; margin: 25px 0; }
    .schedule h3 { color: #1e3a5f; margin-top: 0; }
    .step-box { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .step-box h3 { color: #1e3a5f; margin-top: 0; }
    .step { margin: 10px 0; padding: 10px; background: white; border-radius: 8px; border-left: 4px solid #2d5a87; }
    .note { background: #fff8e1; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800; font-size: 14px; }
    .button { display: inline-block; background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; margin: 20px 0; }
    .tip { background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
    .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏗️ AI City Builders</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">수강생 전용 라이브 안내</p>
    </div>
    <div class="content">
      <p>안녕하세요, <strong>제이 멘토</strong>입니다. 👋</p>
      
      <p>여러분과 함께한지 한 달이 넘었고, 매일매일 어떻게 하면 더 좋은 지식을 드릴 수 있을까, 인공지능 시대에 어떻게 하면 여러분이 기회를 만들 수 있는 지식을 드리고 교육의 가격을 낮출 수 있을까 매순간 고민하고 있습니다.</p>
      
      <div class="highlight">
        <strong>🔴 그래서 수강생 전용 라이브를 추가하기로 하였습니다!</strong>
      </div>
      
      <div class="schedule">
        <h3>📅 라이브 스케줄</h3>
        <p><strong>🏠 AI 건물주 되기</strong> → 매주 화요일 저녁 8시</p>
        <p><strong>🤖 에이전트 기초</strong> → 매주 수요일 저녁 8시</p>
      </div>
      
      <h3>📺 참여 방법</h3>
      <ol>
        <li>aicitybuilders.com 로그인</li>
        <li>수강 중인 강의 클릭</li>
        <li><strong>"라이브 보기"</strong> 클릭</li>
        <li>수강생 전용 링크로 입장!</li>
      </ol>
      
      <div class="tip">
        💡 <strong>Tip:</strong> 안 보이시면 크롬 브라우저에서 <code>Ctrl + Shift + R</code>을 눌러서 새로고침 해주세요 :)
      </div>
      
      <div class="step-box">
        <h3>🚀 AI 수익화 비즈니스 4단계 로드맵</h3>
        <div class="step"><strong>1단계:</strong> AI 수익화 지식/기업가 마인드, 인공지능으로 컨텐츠 생성 기초</div>
        <div class="step"><strong>2단계:</strong> 자동화 에이전트로 시스템 만들기, 워크플로우 생성, 논리력 향상</div>
        <div class="step"><strong>3단계:</strong> 제품화 단계 - 바이브 코딩으로 자동화 에이전트 제작, API 연동</div>
        <div class="step"><strong>4단계:</strong> 기업화 - 1인 기업화 달성!</div>
      </div>
      
      <div class="note">
        ⚠️ <strong>중요:</strong> 이 과정에서 그냥 자동화만 한다고 되는 건 아닙니다. 여러가지 이론을 잘 섞어야 합니다. (이제 그냥 딸깍 자동화 에이전트는 작동하지 않으니까요!) 그런 지식들을 계속 연구해서 <strong>유튜브</strong>와 <strong>AI City Builders</strong>에서 알려드리겠습니다.
      </div>
      
      <p>이 4단계를 빠르게 만들 예정이고, 앞으로도 여러분의 옆에서 최선을 다해 오랫동안 도와줄 수 있는 멘토가 되도록 하겠습니다.</p>
      
      <p style="text-align: center;">
        <a href="https://www.aicitybuilders.com" class="button">🚀 지금 바로 확인하기</a>
      </p>
      
      <div class="signature">
        <p>감사합니다. 🙏</p>
        <p><strong>제이 멘토 드림</strong></p>
      </div>
    </div>
    <div class="footer">
      <p>© 2025 AI City Builders. All rights reserved.</p>
      <p>⚠️ 이 메일이 스팸함에 있다면 꺼내주세요!</p>
    </div>
  </div>
</body>
</html>
`;

const EMAIL_TEXT = `안녕하세요 제이 멘토입니다.

수강생 전용 라이브가 추가되었습니다!

📅 라이브 스케줄:
- AI 건물주 되기: 매주 화요일 저녁 8시
- 에이전트 기초: 매주 수요일 저녁 8시

📺 참여 방법:
1. aicitybuilders.com 로그인
2. 수강 중인 강의 클릭
3. "라이브 보기" 클릭

https://www.aicitybuilders.com

감사합니다.
제이 멘토 드림`;

// ============ Azure에서 사용자 가져오기 (페이지네이션 지원) ============
async function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { 
      headers: { 
        'Accept': 'application/json;odata=nometadata',
        'x-ms-version': '2019-02-02'
      } 
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            value: json.value || [],
            nextPartitionKey: res.headers['x-ms-continuation-nextpartitionkey'],
            nextRowKey: res.headers['x-ms-continuation-nextrowkey']
          });
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
  });
}

async function getAllUsers() {
  let allUsers = [];
  let nextPartitionKey = null;
  let nextRowKey = null;
  let page = 1;
  
  do {
    let url = BASE_URL;
    if (nextPartitionKey && nextRowKey) {
      url += '&NextPartitionKey=' + encodeURIComponent(nextPartitionKey) + '&NextRowKey=' + encodeURIComponent(nextRowKey);
    }
    
    const result = await fetchPage(url);
    allUsers = allUsers.concat(result.value);
    console.log(`📄 페이지 ${page}: ${result.value.length}명 (총 ${allUsers.length}명)`);
    
    nextPartitionKey = result.nextPartitionKey;
    nextRowKey = result.nextRowKey;
    page++;
  } while (nextPartitionKey && nextRowKey);
  
  return allUsers;
}

// ============ 이메일 발송 ============
async function sendEmail(emailClient, recipientEmail, retryCount = 0) {
  const message = {
    senderAddress: SENDER_EMAIL,
    content: {
      subject: EMAIL_SUBJECT,
      plainText: EMAIL_TEXT,
      html: EMAIL_HTML,
    },
    recipients: {
      to: [{ address: recipientEmail }],
    },
  };

  try {
    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();
    return { success: true, email: recipientEmail, result };
  } catch (error) {
    if (retryCount < 3) {
      console.log(`  ⚠️ 재시도 중... (${retryCount + 1}/3)`);
      await sleep(2000);
      return sendEmail(emailClient, recipientEmail, retryCount + 1);
    }
    return { success: false, email: recipientEmail, error: error.message };
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ 메인 ============
async function main() {
  console.log('='.repeat(60));
  console.log('📧 Azure Communication Services 대량 이메일 발송');
  console.log('='.repeat(60));
  console.log(`🎯 대상: ${TARGET}`);
  console.log(`🧪 DRY_RUN: ${DRY_RUN ? '예 (실제 발송 안함)' : '아니오 (실제 발송!)'}`);
  console.log('');

  // 1. 사용자 가져오기
  console.log('📥 사용자 목록 가져오는 중...\n');
  const allUsers = await getAllUsers();
  
  // 2. 이메일 있는 사용자 필터링
  const usersWithEmail = allUsers.filter(u => u.email && u.email.includes('@'));
  
  // 3. 대상에 따라 필터링
  let targetUsers;
  switch (TARGET) {
    case 'marketing':
      targetUsers = usersWithEmail.filter(u => u.marketingAgreed === true || u.marketingAgreed === 'true');
      break;
    case 'enrolled':
      targetUsers = usersWithEmail.filter(u => u.enrolledCourses && u.enrolledCourses.includes('enrollments'));
      break;
    case 'all':
    default:
      targetUsers = usersWithEmail;
  }

  console.log('');
  console.log('📊 통계:');
  console.log(`  - 전체 회원: ${allUsers.length}명`);
  console.log(`  - 이메일 있는 회원: ${usersWithEmail.length}명`);
  console.log(`  - 발송 대상 (${TARGET}): ${targetUsers.length}명`);
  console.log('');

  if (DRY_RUN) {
    console.log('🧪 DRY_RUN 모드 - 실제 발송하지 않습니다.');
    console.log('');
    console.log('📋 발송 예정 이메일 (처음 10개):');
    targetUsers.slice(0, 10).forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.email}`);
    });
    if (targetUsers.length > 10) {
      console.log(`  ... 외 ${targetUsers.length - 10}명`);
    }
    console.log('');
    console.log('✅ 실제 발송하려면: DRY_RUN 없이 다시 실행');
    console.log('   TARGET=marketing node scripts/send-mass-email.js');
    return;
  }

  // 4. 이메일 발송
  console.log('📧 이메일 발송 시작...');
  console.log('⏰ 예상 시간:', Math.ceil(targetUsers.length / 60), '분');
  console.log('');

  const emailClient = new EmailClient(CONNECTION_STRING);
  
  let successCount = 0;
  let failCount = 0;
  const failedEmails = [];
  const startTime = Date.now();

  for (let i = 0; i < targetUsers.length; i++) {
    const user = targetUsers[i];
    const progress = `[${i + 1}/${targetUsers.length}]`;
    
    process.stdout.write(`${progress} ${user.email}... `);
    
    const result = await sendEmail(emailClient, user.email);
    
    if (result.success) {
      console.log('✅');
      successCount++;
    } else {
      console.log(`❌ ${result.error}`);
      failCount++;
      failedEmails.push({ email: user.email, error: result.error });
    }

    // Rate limiting: 1초에 1개씩 (Azure 제한 고려)
    if (i < targetUsers.length - 1) {
      await sleep(1000);
    }
    
    // 100개마다 진행 상황 출력
    if ((i + 1) % 100 === 0) {
      const elapsed = Math.round((Date.now() - startTime) / 1000 / 60);
      console.log(`\n📊 진행 상황: ${i + 1}/${targetUsers.length} (${elapsed}분 경과)\n`);
    }
  }

  // 5. 결과 출력
  const totalTime = Math.round((Date.now() - startTime) / 1000 / 60);
  
  console.log('');
  console.log('='.repeat(60));
  console.log('📊 발송 결과');
  console.log('='.repeat(60));
  console.log(`✅ 성공: ${successCount}명`);
  console.log(`❌ 실패: ${failCount}명`);
  console.log(`⏱️ 소요 시간: ${totalTime}분`);
  
  if (failedEmails.length > 0) {
    console.log('');
    console.log('❌ 실패한 이메일:');
    failedEmails.slice(0, 20).forEach(f => {
      console.log(`  - ${f.email}: ${f.error}`);
    });
    if (failedEmails.length > 20) {
      console.log(`  ... 외 ${failedEmails.length - 20}개`);
    }
  }
  
  console.log('');
  console.log('🎉 완료!');
}

main().catch(console.error);
