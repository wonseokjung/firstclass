/**
 * 마스킹된 이메일을 Azure Users 테이블과 자동 매칭하여 강의 추가
 * 
 * 브라우저 콘솔에서 실행:
 * 1. 개발자 도구 열기 (F12)
 * 2. 이 코드를 복사해서 붙여넣기
 * 3. Enter
 */

import AzureTableService from '../services/azureTableService';

// 마스킹된 이메일 패턴 매칭 함수
function matchMaskedEmail(maskedEmail: string, realEmail: string): boolean {
  const [maskedLocal, domain] = maskedEmail.split('@');
  const [realLocal, realDomain] = realEmail.split('@');
  
  // 도메인이 다르면 false
  if (domain !== realDomain) return false;
  
  // 길이가 다르면 false
  if (maskedLocal.length !== realLocal.length) return false;
  
  // 각 문자 비교
  for (let i = 0; i < maskedLocal.length; i++) {
    if (maskedLocal[i] !== '*' && maskedLocal[i] !== realLocal[i]) {
      return false;
    }
  }
  
  return true;
}

// 토스페이먼츠 결제 데이터
const payments = [
  { masked: 'so********@gmail.com', name: '이*훈', orderId: 'order_1763142702036_8jh73lg8k', date: '2025-11-15 02:52:50' },
  { masked: 'rp*****@naver.com', name: '조*우', orderId: 'order_1763142219298_jkablhyl2', date: '2025-11-15 02:44:19' },
  { masked: 'da*****@naver.com', name: '고*웅', orderId: 'order_1763141726397_rq7qgvils', date: '2025-11-15 02:39:22' },
  { masked: 'ap*******@gmail.com', name: '쥰*', orderId: 'order_1763135906666_2mb772b0d', date: '2025-11-15 00:59:11' },
  { masked: 'bu*****@naver.com', name: '박*성', orderId: 'order_1763134963184_awygk7xrd', date: '2025-11-15 00:44:57' },
  { masked: 'ma******@naver.com', name: '김*희', orderId: 'order_1763134934252_o8mrw39um', date: '2025-11-15 00:42:44' },
  { masked: 'ha******@gmail.com', name: '김*석', orderId: 'order_1763134635174_rm3gbxyvd', date: '2025-11-15 00:38:08' },
  { masked: 'pe*******@gmail.com', name: '김*주', orderId: 'order_1763134582395_lzlvrfjrz', date: '2025-11-15 00:36:42' },
  { masked: 'js*******@gmail.com', name: '배*승', orderId: 'order_1763133581189_l8pabrkys', date: '2025-11-15 00:20:45' },
  { masked: 'fr**********@gmail.com', name: '권*승', orderId: 'order_1763133567233_6whgeil3v', date: '2025-11-15 00:20:27' },
  { masked: 'qp**********@naver.com', name: '러*', orderId: 'order_1763132772876_2hr6ho7qa', date: '2025-11-15 00:13:09' },
  { masked: 'my*******@naver.com', name: '윤*미', orderId: 'order_1763133001219_myt8xdh90', date: '2025-11-15 00:10:27' },
  { masked: 'yo*******@gmail.com', name: '최*리', orderId: 'order_1763132816315_x71m7mpxa', date: '2025-11-15 00:08:02' },
  { masked: 'rm*****@naver.com', name: '김*남', orderId: 'order_1763132525010_t306zfbw8', date: '2025-11-15 00:02:33' },
  { masked: 'ai*********@gmail.com', name: '이*규', orderId: 'order_1763132392339_zf3lc492c', date: '2025-11-15 00:00:28' },
  { masked: 'an*********@gmail.com', name: '안*혜', orderId: 'order_1763132202993_ez64fevoy', date: '2025-11-14 23:58:01' },
  { masked: 'pi******@gma.com', name: '상*규', orderId: 'order_1763132121894_xqoar4cxz', date: '2025-11-14 23:57:28' },
  { masked: 'we*@dumy.co.kr', name: '이*혁', orderId: 'order_1763131780228_k279wqdwf', date: '2025-11-14 23:50:18' },
  { masked: 'bu*****@gmail.com', name: '배*곤', orderId: 'order_1763131629560_komm430dm', date: '2025-11-14 23:49:16' },
  { masked: 'al*****@naver.com', name: '박*건', orderId: 'order_1763130851088_2xfupm5ku', date: '2025-11-14 23:45:15' },
  { masked: 'si********@naver.com', name: '이*숙', orderId: 'order_1763131104524_qsxd85kl1', date: '2025-11-14 23:42:06' },
  { masked: 'ad****@naver.com', name: '황*우', orderId: 'order_1763131263404_ze5tvqybj', date: '2025-11-14 23:41:49' },
  { masked: 'a3*******@gmail.com', name: '김*정', orderId: 'order_1763131053083_23r35ty10', date: '2025-11-14 23:38:11' },
  { masked: 're*********@gmail.com', name: '차*현', orderId: 'order_1763130959748_z16yqz9kn', date: '2025-11-14 23:36:51' },
  { masked: 'pa********@gmail.com', name: '조*영', orderId: 'order_1763130817297_tnep2j3h0', date: '2025-11-14 23:34:28' },
  { masked: 'go********@naver.com', name: '부*종', orderId: 'order_1763129658781_jn6i6sgzu', date: '2025-11-14 23:16:54' },
  { masked: 'sm*************@gmail.com', name: '추*란', orderId: 'order_1763129554784_1j4zr27zc', date: '2025-11-14 23:13:34' },
  { masked: 'bi******@gmail.com', name: '류*수', orderId: 'order_1763129483293_bp5audbj2', date: '2025-11-14 23:12:35' },
  { masked: 'jy********@naver.com', name: '안*영', orderId: 'order_1763129200206_fmex8mdcj', date: '2025-11-14 23:07:20' },
  { masked: 'hi*********@naver.com', name: '히********사', orderId: 'order_1763128855375_33hi52bd0', date: '2025-11-14 23:01:53' },
  { masked: 'a0**********@gmail.com', name: '윤*순', orderId: 'order_1763128495255_rbsyp1esy', date: '2025-11-14 22:55:21' },
  { masked: 'mo******@hanmail.net', name: '손*배', orderId: 'order_1763127873060_pg35yvjcn', date: '2025-11-14 22:45:46' },
  { masked: 'ba*******@naver.com', name: '김*옥', orderId: 'order_1763127759802_tzqj72io5', date: '2025-11-14 22:43:57' },
  { masked: 'ko******@naver.com', name: '유*식', orderId: 'order_1763127542333_1my99slrf', date: '2025-11-14 22:39:30' },
  { masked: 'me**********@gmail.com', name: '김*태', orderId: 'order_1763127413358_00pfmqubk', date: '2025-11-14 22:37:28' },
  { masked: 'li******@hanmail.net', name: '조*현', orderId: 'order_1763127374575_k8su74bxy', date: '2025-11-14 22:36:57' },
  { masked: 'ye*****@gmail.com', name: '강*욱', orderId: 'order_1763126907221_jyvexsq9s', date: '2025-11-14 22:29:07' },
  { masked: 'jj*****@naver.com', name: '정*욱', orderId: 'order_1763124658648_eeotk8rf3', date: '2025-11-14 21:52:06' },
  { masked: 'to*********@gmail.com', name: 'KI******NG', orderId: 'order_1763123333008_9nz2njdkd', date: '2025-11-14 21:29:51' },
  { masked: '36*******@gmail.com', name: '이*훈', orderId: 'order_1763123019857_n5s0n0s7n', date: '2025-11-14 21:27:31' },
  { masked: 'pa********@gmail.com', name: '윤*라', orderId: 'order_1763123066442_x42r2jwl9', date: '2025-11-14 21:25:05' },
  { masked: 'hi******@gmail.com', name: '김*석', orderId: 'order_1763119397131_0dg1e91cv', date: '2025-11-14 20:24:11' },
  { masked: 'to*******@gmail.com', name: '이*철', orderId: 'order_1763119170051_j61dr32l1', date: '2025-11-14 20:19:51' },
  { masked: 'ya********@gmail.com', name: '최*숙', orderId: 'order_1763047661084_rtbk4wihb', date: '2025-11-14 00:32:15' },
  { masked: 'qs******@naver.com', name: '유*균', orderId: 'order_1762939345276_oxuhria0o', date: '2025-11-12 18:23:14' },
  { masked: 'a-*******@hanmail.net', name: '김*훈', orderId: 'order_1762690778300_4bk0g6vd6', date: '2025-11-09 21:20:37' },
  { masked: 'ha*********@gmail.com', name: '편*영', orderId: 'order_1762658395612_ryh95sg9c', date: '2025-11-09 12:21:13' },
  { masked: 'do********@gmail.com', name: '이*수', orderId: 'order_1762629706579_6d2ixoa7d', date: '2025-11-09 04:28:26' },
  { masked: '57*****@gmail.com', name: '장*건', orderId: 'order_1762562428186_umasl29e5', date: '2025-11-08 09:41:10' },
  { masked: 'je******@gmail.com', name: '김*은', orderId: 'order_1762386790593_3kv1dru6s', date: '2025-11-06 08:54:57' },
  { masked: 'yu*******@gmail.com', name: '최*진', orderId: 'order_1761542676217_a9nbyc297', date: '2025-10-27 14:25:39' },
  { masked: 'on******@naver.com', name: 'Ki********ng', orderId: 'order_1760971870005_c84c6pkhf', date: '2025-10-20 23:52:24' },
  { masked: 'js******@naver.com', name: '정*석', orderId: 'order_1760667306688_lgjmk2s8t', date: '2025-10-17 11:16:24' },
  { masked: 'ky****@gmail.com', name: '김*호', orderId: 'order_1760661392961_y8hwk51uj', date: '2025-10-17 09:38:16' },
  { masked: 'mi****@naver.com', name: '차*정', orderId: 'order_1760528102242_vejmj66ux', date: '2025-10-15 20:35:32' },
  { masked: 'in**@udmso.co.kr', name: '박*동', orderId: 'order_1760364259046_dp9frb7rf', date: '2025-10-13 23:04:58' },
  { masked: 'no**********@naver.com', name: '이*', orderId: 'order_1760360347773_l3nr8es8x', date: '2025-10-13 22:00:15' },
  { masked: 'te****@gmail.com', name: 'te*****al', orderId: 'order_1760346338615_tawstmccv', date: '2025-10-13 18:07:22' }
];

async function autoMatchAndEnroll() {
  console.log('🚀 자동 매칭 및 강의 등록 시작...\n');
  
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  const matched: any[] = [];
  const unmatched: any[] = [];

  for (const payment of payments) {
    try {
      console.log(`\n처리 중: ${payment.name} (${payment.masked})`);
      
      // Azure에서 모든 사용자 조회 (필터링 필요)
      // 실제로는 getAllUsers 같은 함수가 필요하지만, 
      // 현재는 도메인으로 필터링해서 후보 찾기
      
      const domain = payment.masked.split('@')[1];
      console.log(`  도메인: ${domain}`);
      
      // 임시: rpflarh@naver.com으로 테스트
      if (payment.masked === 'rp*****@naver.com') {
        const testEmail = 'rpflarh@naver.com';
        const isMatch = matchMaskedEmail(payment.masked, testEmail);
        console.log(`  매칭 테스트: ${isMatch ? '✅' : '❌'} ${testEmail}`);
        
        if (isMatch) {
          const user = await AzureTableService.getUserByEmail(testEmail);
          if (user) {
            // 강의 추가
            await AzureTableService.addPurchaseAndEnrollmentToUser({
              email: testEmail,
              courseId: '1002',
              title: 'ChatGPT AI AGENT 비기너편',
              amount: 45000,
              paymentMethod: 'card',
              orderId: payment.orderId,
              orderName: 'ChatGPT AI AGENT 비기너편'
            });
            
            console.log(`  ✅ 성공: ${testEmail}`);
            matched.push({ payment, realEmail: testEmail });
            successCount++;
          }
        }
      } else {
        unmatched.push(payment);
      }
      
    } catch (error: any) {
      console.error(`  ❌ 오류: ${error.message}`);
      failCount++;
    }
    
    // API 제한 방지
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n\n📊 처리 결과:');
  console.log(`✅ 성공: ${successCount}건`);
  console.log(`ℹ️ 건너뜀: ${skipCount}건`);
  console.log(`❌ 실패: ${failCount}건`);
  console.log(`🔍 미매칭: ${unmatched.length}건`);
  
  if (matched.length > 0) {
    console.log('\n✅ 매칭된 항목:');
    matched.forEach(m => {
      console.log(`  ${m.payment.name}: ${m.payment.masked} → ${m.realEmail}`);
    });
  }
  
  if (unmatched.length > 0) {
    console.log('\n🔍 미매칭 항목 (수동 확인 필요):');
    unmatched.forEach(p => {
      console.log(`  ${p.name}: ${p.masked}`);
    });
  }
}

// 실행
if (require.main === module) {
  autoMatchAndEnroll()
    .then(() => console.log('\n✅ 완료!'))
    .catch(error => console.error('\n❌ 오류:', error));
}

export { autoMatchAndEnroll, matchMaskedEmail };

