const https = require('https');

// Azure Table Storage 설정
const ACCOUNT_NAME = 'aicitybuilders';
const TABLE_NAME = 'Users';
const SAS_TOKEN = 'sv=2022-11-02&ss=t&srt=sco&sp=rwdlacu&se=2026-12-31T14:59:59Z&st=2024-10-12T06:59:59Z&spr=https&sig=R7r1lfiwiSelSmeFxzGQI40vtaz8yoUniverse5jZjlmo%3D';

const USER_EMAIL = 'hic6673@naver.com';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${ACCOUNT_NAME}.table.core.windows.net`,
      path: path,
      method: method,
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-Type': 'application/json',
        'x-ms-version': '2019-02-02'
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            resolve(responseData);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function checkUser() {
  try {
    console.log('🔍 사용자 조회 중:', USER_EMAIL);
    
    // 사용자 조회
    const response = await makeRequest(
      'GET',
      `/${TABLE_NAME}(PartitionKey='users',RowKey='${encodeURIComponent(USER_EMAIL)})?${SAS_TOKEN}`
    );

    console.log('\n📋 사용자 정보:');
    console.log('- 이름:', response.name);
    console.log('- 이메일:', response.email);
    console.log('- 가입일:', response.createdAt);
    console.log('- 이메일 인증:', response.emailVerified);

    console.log('\n📚 수강 정보:');
    if (response.enrolledCourses) {
      const enrolledData = JSON.parse(response.enrolledCourses);
      const enrollments = Array.isArray(enrolledData) 
        ? enrolledData 
        : (enrolledData.enrollments || []);
      
      console.log('- 수강 중인 강의 수:', enrollments.length);
      
      if (enrollments.length > 0) {
        console.log('\n강의 목록:');
        enrollments.forEach((course, index) => {
          console.log(`  ${index + 1}. ${course.title || course.courseId}`);
          console.log(`     - Course ID: ${course.courseId}`);
          console.log(`     - 상태: ${course.status}`);
          console.log(`     - 진도: ${course.progress || 0}%`);
          console.log(`     - 등록일: ${course.enrolledAt}`);
        });

        // chatgpt-agent-beginner 강의 확인
        const hasTargetCourse = enrollments.some(e => 
          e.courseId === 'chatgpt-agent-beginner' || 
          e.courseId === '1002'
        );

        if (hasTargetCourse) {
          console.log('\n✅ Google Opal 유튜브 수익화 에이전트 기초 강의 등록됨');
        } else {
          console.log('\n❌ Google Opal 유튜브 수익화 에이전트 기초 강의 미등록');
          console.log('\n💡 강의를 추가해야 합니다!');
        }
      } else {
        console.log('❌ 등록된 강의가 없습니다.');
        console.log('\n💡 강의를 추가해야 합니다!');
      }

      // 결제 정보 확인
      if (enrolledData.payments && enrolledData.payments.length > 0) {
        console.log('\n💳 결제 내역:');
        enrolledData.payments.forEach((payment, index) => {
          console.log(`  ${index + 1}. ${payment.orderName || payment.courseId}`);
          console.log(`     - 금액: ${payment.amount.toLocaleString()}원`);
          console.log(`     - 결제일: ${payment.paymentDate}`);
          console.log(`     - 주문번호: ${payment.orderId}`);
        });
      }
    } else {
      console.log('❌ 수강 정보가 없습니다.');
      console.log('\n💡 강의를 추가해야 합니다!');
    }

  } catch (error) {
    if (error.message.includes('404')) {
      console.error('❌ 사용자를 찾을 수 없습니다:', USER_EMAIL);
    } else {
      console.error('❌ 오류 발생:', error.message);
    }
  }
}

checkUser();

