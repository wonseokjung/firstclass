/**
 * 토스페이먼츠 결제 내역을 기반으로 Azure Users 테이블에 enrolledCourses 추가
 * 
 * 사용법:
 * 1. 이 파일을 실행: npx ts-node src/scripts/addMissingEnrollments.ts
 * 2. 또는 코드를 복사해서 브라우저 콘솔에서 실행
 */

import AzureTableService from '../services/azureTableService';

// 토스페이먼츠 결제 데이터 (완료된 결제만)
const payments = [
  { email: 'so********@gmail.com', name: '이*훈', orderId: 'order_1763142702036_8jh73lg8k', amount: 45000, date: '2025-11-15 02:52:50' },
  { email: 'rp*****@naver.com', name: '조*우', orderId: 'order_1763142219298_jkablhyl2', amount: 45000, date: '2025-11-15 02:44:19' },
  { email: 'da*****@naver.com', name: '고*웅', orderId: 'order_1763141726397_rq7qgvils', amount: 45000, date: '2025-11-15 02:39:22' },
  { email: 'ap*******@gmail.com', name: '쥰*', orderId: 'order_1763135906666_2mb772b0d', amount: 45000, date: '2025-11-15 00:59:11' },
  { email: 'bu*****@naver.com', name: '박*성', orderId: 'order_1763134963184_awygk7xrd', amount: 45000, date: '2025-11-15 00:44:57' },
  { email: 'ma******@naver.com', name: '김*희', orderId: 'order_1763134934252_o8mrw39um', amount: 45000, date: '2025-11-15 00:42:44' },
  { email: 'ha******@gmail.com', name: '김*석', orderId: 'order_1763134635174_rm3gbxyvd', amount: 45000, date: '2025-11-15 00:38:08' },
  { email: 'pe*******@gmail.com', name: '김*주', orderId: 'order_1763134582395_lzlvrfjrz', amount: 45000, date: '2025-11-15 00:36:42' },
  { email: 'js*******@gmail.com', name: '배*승', orderId: 'order_1763133581189_l8pabrkys', amount: 45000, date: '2025-11-15 00:20:45' },
  { email: 'fr**********@gmail.com', name: '권*승', orderId: 'order_1763133567233_6whgeil3v', amount: 45000, date: '2025-11-15 00:20:27' },
  { email: 'qp**********@naver.com', name: '러*', orderId: 'order_1763132772876_2hr6ho7qa', amount: 45000, date: '2025-11-15 00:13:09' },
  { email: 'my*******@naver.com', name: '윤*미', orderId: 'order_1763133001219_myt8xdh90', amount: 45000, date: '2025-11-15 00:10:27' },
  { email: 'yo*******@gmail.com', name: '최*리', orderId: 'order_1763132816315_x71m7mpxa', amount: 45000, date: '2025-11-15 00:08:02' },
  { email: 'rm*****@naver.com', name: '김*남', orderId: 'order_1763132525010_t306zfbw8', amount: 45000, date: '2025-11-15 00:02:33' },
  { email: 'ai*********@gmail.com', name: '이*규', orderId: 'order_1763132392339_zf3lc492c', amount: 45000, date: '2025-11-15 00:00:28' },
  { email: 'an*********@gmail.com', name: '안*혜', orderId: 'order_1763132202993_ez64fevoy', amount: 45000, date: '2025-11-14 23:58:01' },
  { email: 'pi******@gma.com', name: '상*규', orderId: 'order_1763132121894_xqoar4cxz', amount: 45000, date: '2025-11-14 23:57:28' },
  { email: 'we*@dumy.co.kr', name: '이*혁', orderId: 'order_1763131780228_k279wqdwf', amount: 45000, date: '2025-11-14 23:50:18' },
  { email: 'bu*****@gmail.com', name: '배*곤', orderId: 'order_1763131629560_komm430dm', amount: 45000, date: '2025-11-14 23:49:16' },
  { email: 'al*****@naver.com', name: '박*건', orderId: 'order_1763130851088_2xfupm5ku', amount: 45000, date: '2025-11-14 23:45:15' },
  { email: 'si********@naver.com', name: '이*숙', orderId: 'order_1763131104524_qsxd85kl1', amount: 45000, date: '2025-11-14 23:42:06' },
  { email: 'ad****@naver.com', name: '황*우', orderId: 'order_1763131263404_ze5tvqybj', amount: 45000, date: '2025-11-14 23:41:49' },
  { email: 'a3*******@gmail.com', name: '김*정', orderId: 'order_1763131053083_23r35ty10', amount: 45000, date: '2025-11-14 23:38:11' },
  { email: 're*********@gmail.com', name: '차*현', orderId: 'order_1763130959748_z16yqz9kn', amount: 45000, date: '2025-11-14 23:36:51' },
  { email: 'pa********@gmail.com', name: '조*영', orderId: 'order_1763130817297_tnep2j3h0', amount: 45000, date: '2025-11-14 23:34:28' },
  { email: 'go********@naver.com', name: '부*종', orderId: 'order_1763129658781_jn6i6sgzu', amount: 45000, date: '2025-11-14 23:16:54' },
  { email: 'sm*************@gmail.com', name: '추*란', orderId: 'order_1763129554784_1j4zr27zc', amount: 45000, date: '2025-11-14 23:13:34' },
  { email: 'bi******@gmail.com', name: '류*수', orderId: 'order_1763129483293_bp5audbj2', amount: 45000, date: '2025-11-14 23:12:35' },
  { email: 'jy********@naver.com', name: '안*영', orderId: 'order_1763129200206_fmex8mdcj', amount: 45000, date: '2025-11-14 23:07:20' },
  { email: 'hi*********@naver.com', name: '히********사', orderId: 'order_1763128855375_33hi52bd0', amount: 45000, date: '2025-11-14 23:01:53' },
  { email: 'a0**********@gmail.com', name: '윤*순', orderId: 'order_1763128495255_rbsyp1esy', amount: 45000, date: '2025-11-14 22:55:21' },
  { email: 'mo******@hanmail.net', name: '손*배', orderId: 'order_1763127873060_pg35yvjcn', amount: 45000, date: '2025-11-14 22:45:46' },
  { email: 'ba*******@naver.com', name: '김*옥', orderId: 'order_1763127759802_tzqj72io5', amount: 45000, date: '2025-11-14 22:43:57' },
  { email: 'ko******@naver.com', name: '유*식', orderId: 'order_1763127542333_1my99slrf', amount: 45000, date: '2025-11-14 22:39:30' },
  { email: 'me**********@gmail.com', name: '김*태', orderId: 'order_1763127413358_00pfmqubk', amount: 45000, date: '2025-11-14 22:37:28' },
  { email: 'li******@hanmail.net', name: '조*현', orderId: 'order_1763127374575_k8su74bxy', amount: 45000, date: '2025-11-14 22:36:57' },
  { email: 'ye*****@gmail.com', name: '강*욱', orderId: 'order_1763126907221_jyvexsq9s', amount: 45000, date: '2025-11-14 22:29:07' },
  { email: 'jj*****@naver.com', name: '정*욱', orderId: 'order_1763124658648_eeotk8rf3', amount: 45000, date: '2025-11-14 21:52:06' },
  { email: 'to*********@gmail.com', name: 'KI******NG', orderId: 'order_1763123333008_9nz2njdkd', amount: 45000, date: '2025-11-14 21:29:51' },
  { email: '36*******@gmail.com', name: '이*훈', orderId: 'order_1763123019857_n5s0n0s7n', amount: 45000, date: '2025-11-14 21:27:31' },
  { email: 'pa********@gmail.com', name: '윤*라', orderId: 'order_1763123066442_x42r2jwl9', amount: 45000, date: '2025-11-14 21:25:05' },
  { email: 'hi******@gmail.com', name: '김*석', orderId: 'order_1763119397131_0dg1e91cv', amount: 45000, date: '2025-11-14 20:24:11' },
  { email: 'to*******@gmail.com', name: '이*철', orderId: 'order_1763119170051_j61dr32l1', amount: 45000, date: '2025-11-14 20:19:51' },
  { email: 'ya********@gmail.com', name: '최*숙', orderId: 'order_1763047661084_rtbk4wihb', amount: 45000, date: '2025-11-14 00:32:15' },
  { email: 'qs******@naver.com', name: '유*균', orderId: 'order_1762939345276_oxuhria0o', amount: 45000, date: '2025-11-12 18:23:14' },
  { email: 'a-*******@hanmail.net', name: '김*훈', orderId: 'order_1762690778300_4bk0g6vd6', amount: 45000, date: '2025-11-09 21:20:37' },
  { email: 'ha*********@gmail.com', name: '편*영', orderId: 'order_1762658395612_ryh95sg9c', amount: 45000, date: '2025-11-09 12:21:13' },
  { email: 'do********@gmail.com', name: '이*수', orderId: 'order_1762629706579_6d2ixoa7d', amount: 45000, date: '2025-11-09 04:28:26' },
  { email: '57*****@gmail.com', name: '장*건', orderId: 'order_1762562428186_umasl29e5', amount: 45000, date: '2025-11-08 09:41:10' },
  { email: 'je******@gmail.com', name: '김*은', orderId: 'order_1762386790593_3kv1dru6s', amount: 45000, date: '2025-11-06 08:54:57' },
  { email: 'yu*******@gmail.com', name: '최*진', orderId: 'order_1761542676217_a9nbyc297', amount: 45000, date: '2025-10-27 14:25:39' },
  { email: 'on******@naver.com', name: 'Ki********ng', orderId: 'order_1760971870005_c84c6pkhf', amount: 45000, date: '2025-10-20 23:52:24' },
  { email: 'js******@naver.com', name: '정*석', orderId: 'order_1760667306688_lgjmk2s8t', amount: 45000, date: '2025-10-17 11:16:24' },
  { email: 'ky****@gmail.com', name: '김*호', orderId: 'order_1760661392961_y8hwk51uj', amount: 45000, date: '2025-10-17 09:38:16' },
  { email: 'mi****@naver.com', name: '차*정', orderId: 'order_1760528102242_vejmj66ux', amount: 45000, date: '2025-10-15 20:35:32' },
  { email: 'in**@udmso.co.kr', name: '박*동', orderId: 'order_1760364259046_dp9frb7rf', amount: 45000, date: '2025-10-13 23:04:58' },
  { email: 'no**********@naver.com', name: '이*', orderId: 'order_1760360347773_l3nr8es8x', amount: 45000, date: '2025-10-13 22:00:15' },
  { email: 'te****@gmail.com', name: 'te*****al', orderId: 'order_1760346338615_tawstmccv', amount: 45000, date: '2025-10-13 18:07:22' }
];

// 전체 이메일 목록 (마스킹 해제 필요)
const fullEmails = [
  'rpflarh@naver.com',  // 조정우
  // ... 나머지 이메일들을 여기에 추가
];

async function addEnrollmentsForPayments() {
  console.log('🚀 결제 내역 기반 수강 정보 추가 시작...');
  console.log(`📊 총 ${payments.length}건의 결제 내역 처리`);

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (const payment of payments) {
    try {
      console.log(`\n처리 중: ${payment.name} (${payment.email})`);

      // 이메일 마스킹 해제가 필요 - 실제 이메일로 검색
      // 임시로 마스킹된 이메일로 검색 시도
      const user = await AzureTableService.getUserByEmail(payment.email);

      if (!user) {
        console.log(`⚠️ 사용자를 찾을 수 없음: ${payment.email}`);
        failCount++;
        continue;
      }

      // 이미 강의가 등록되어 있는지 확인
      if (user.enrolledCourses) {
        const userData = JSON.parse(user.enrolledCourses);
        const enrollments = Array.isArray(userData) ? userData : (userData.enrollments || []);
        
        const alreadyEnrolled = enrollments.some((e: any) => e.courseId === '1002');
        if (alreadyEnrolled) {
          console.log(`ℹ️ 이미 등록됨: ${payment.name}`);
          skippedCount++;
          continue;
        }
      }

      // 강의 추가
      await AzureTableService.addPurchaseAndEnrollmentToUser({
        email: user.email,
        courseId: '1002',
        title: 'ChatGPT AI AGENT 비기너편',
        amount: payment.amount,
        paymentMethod: 'card',
        orderId: payment.orderId,
        orderName: 'ChatGPT AI AGENT 비기너편'
      });

      console.log(`✅ 성공: ${payment.name}`);
      successCount++;

    } catch (error: any) {
      console.error(`❌ 실패: ${payment.name} - ${error.message}`);
      failCount++;
    }

    // API 제한 방지를 위한 딜레이
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n\n📊 처리 완료:');
  console.log(`✅ 성공: ${successCount}건`);
  console.log(`ℹ️ 건너뜀 (이미 등록됨): ${skippedCount}건`);
  console.log(`❌ 실패: ${failCount}건`);
}

// 실행
if (require.main === module) {
  addEnrollmentsForPayments()
    .then(() => console.log('✅ 모든 작업 완료!'))
    .catch(error => console.error('❌ 오류 발생:', error));
}

export default addEnrollmentsForPayments;

