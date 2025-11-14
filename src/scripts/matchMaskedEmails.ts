/**
 * 마스킹된 이메일과 실제 이메일 매칭
 */

// 마스킹된 이메일 패턴 매칭 함수
function matchMaskedEmail(maskedEmail: string, realEmail: string): boolean {
  // 마스킹된 이메일 파싱
  const [maskedLocal, domain] = maskedEmail.split('@');
  const [realLocal, realDomain] = realEmail.split('@');
  
  // 도메인이 다르면 매칭 실패
  if (domain !== realDomain) {
    return false;
  }
  
  // 로컬 부분 매칭
  // 예: "so********" → 's'로 시작, 'o'가 두번째
  let maskedIndex = 0;
  let realIndex = 0;
  
  while (maskedIndex < maskedLocal.length && realIndex < realLocal.length) {
    const maskedChar = maskedLocal[maskedIndex];
    
    if (maskedChar === '*') {
      // '*'는 어떤 문자든 매칭 가능
      maskedIndex++;
      realIndex++;
    } else {
      // 일반 문자는 정확히 매칭되어야 함
      if (maskedChar !== realLocal[realIndex]) {
        return false;
      }
      maskedIndex++;
      realIndex++;
    }
  }
  
  // 길이가 같아야 함
  return maskedLocal.length === realLocal.length;
}

// 토스페이먼츠 결제 데이터
const maskedPayments = [
  { masked: 'so********@gmail.com', name: '이*훈', orderId: 'order_1763142702036_8jh73lg8k' },
  { masked: 'rp*****@naver.com', name: '조*우', orderId: 'order_1763142219298_jkablhyl2' },
  { masked: 'da*****@naver.com', name: '고*웅', orderId: 'order_1763141726397_rq7qgvils' },
  { masked: 'ap*******@gmail.com', name: '쥰*', orderId: 'order_1763135906666_2mb772b0d' },
  { masked: 'bu*****@naver.com', name: '박*성', orderId: 'order_1763134963184_awygk7xrd' },
  { masked: 'ma******@naver.com', name: '김*희', orderId: 'order_1763134934252_o8mrw39um' },
  { masked: 'ha******@gmail.com', name: '김*석', orderId: 'order_1763134635174_rm3gbxyvd' },
  { masked: 'pe*******@gmail.com', name: '김*주', orderId: 'order_1763134582395_lzlvrfjrz' },
  { masked: 'js*******@gmail.com', name: '배*승', orderId: 'order_1763133581189_l8pabrkys' },
  { masked: 'fr**********@gmail.com', name: '권*승', orderId: 'order_1763133567233_6whgeil3v' },
  { masked: 'qp**********@naver.com', name: '러*', orderId: 'order_1763132772876_2hr6ho7qa' },
  { masked: 'my*******@naver.com', name: '윤*미', orderId: 'order_1763133001219_myt8xdh90' },
  { masked: 'yo*******@gmail.com', name: '최*리', orderId: 'order_1763132816315_x71m7mpxa' },
  { masked: 'rm*****@naver.com', name: '김*남', orderId: 'order_1763132525010_t306zfbw8' },
  { masked: 'ai*********@gmail.com', name: '이*규', orderId: 'order_1763132392339_zf3lc492c' },
  { masked: 'an*********@gmail.com', name: '안*혜', orderId: 'order_1763132202993_ez64fevoy' },
  { masked: 'pi******@gma.com', name: '상*규', orderId: 'order_1763132121894_xqoar4cxz' },
  { masked: 'we*@dumy.co.kr', name: '이*혁', orderId: 'order_1763131780228_k279wqdwf' },
  { masked: 'bu*****@gmail.com', name: '배*곤', orderId: 'order_1763131629560_komm430dm' },
  { masked: 'al*****@naver.com', name: '박*건', orderId: 'order_1763130851088_2xfupm5ku' },
  { masked: 'si********@naver.com', name: '이*숙', orderId: 'order_1763131104524_qsxd85kl1' },
  { masked: 'ad****@naver.com', name: '황*우', orderId: 'order_1763131263404_ze5tvqybj' },
  { masked: 'a3*******@gmail.com', name: '김*정', orderId: 'order_1763131053083_23r35ty10' },
  { masked: 're*********@gmail.com', name: '차*현', orderId: 'order_1763130959748_z16yqz9kn' },
  { masked: 'pa********@gmail.com', name: '조*영', orderId: 'order_1763130817297_tnep2j3h0' },
  { masked: 'go********@naver.com', name: '부*종', orderId: 'order_1763129658781_jn6i6sgzu' },
  { masked: 'sm*************@gmail.com', name: '추*란', orderId: 'order_1763129554784_1j4zr27zc' },
  { masked: 'bi******@gmail.com', name: '류*수', orderId: 'order_1763129483293_bp5audbj2' },
  { masked: 'jy********@naver.com', name: '안*영', orderId: 'order_1763129200206_fmex8mdcj' },
  { masked: 'hi*********@naver.com', name: '히********사', orderId: 'order_1763128855375_33hi52bd0' },
  { masked: 'a0**********@gmail.com', name: '윤*순', orderId: 'order_1763128495255_rbsyp1esy' },
  { masked: 'mo******@hanmail.net', name: '손*배', orderId: 'order_1763127873060_pg35yvjcn' },
  { masked: 'ba*******@naver.com', name: '김*옥', orderId: 'order_1763127759802_tzqj72io5' },
  { masked: 'ko******@naver.com', name: '유*식', orderId: 'order_1763127542333_1my99slrf' },
  { masked: 'me**********@gmail.com', name: '김*태', orderId: 'order_1763127413358_00pfmqubk' },
  { masked: 'li******@hanmail.net', name: '조*현', orderId: 'order_1763127374575_k8su74bxy' },
  { masked: 'ye*****@gmail.com', name: '강*욱', orderId: 'order_1763126907221_jyvexsq9s' },
  { masked: 'jj*****@naver.com', name: '정*욱', orderId: 'order_1763124658648_eeotk8rf3' },
  { masked: 'to*********@gmail.com', name: 'KI******NG', orderId: 'order_1763123333008_9nz2njdkd' },
  { masked: '36*******@gmail.com', name: '이*훈', orderId: 'order_1763123019857_n5s0n0s7n' },
  { masked: 'pa********@gmail.com', name: '윤*라', orderId: 'order_1763123066442_x42r2jwl9' },
  { masked: 'hi******@gmail.com', name: '김*석', orderId: 'order_1763119397131_0dg1e91cv' },
  { masked: 'to*******@gmail.com', name: '이*철', orderId: 'order_1763119170051_j61dr32l1' },
  { masked: 'ya********@gmail.com', name: '최*숙', orderId: 'order_1763047661084_rtbk4wihb' },
  { masked: 'qs******@naver.com', name: '유*균', orderId: 'order_1762939345276_oxuhria0o' },
  { masked: 'a-*******@hanmail.net', name: '김*훈', orderId: 'order_1762690778300_4bk0g6vd6' },
  { masked: 'ha*********@gmail.com', name: '편*영', orderId: 'order_1762658395612_ryh95sg9c' },
  { masked: 'do********@gmail.com', name: '이*수', orderId: 'order_1762629706579_6d2ixoa7d' },
  { masked: '57*****@gmail.com', name: '장*건', orderId: 'order_1762562428186_umasl29e5' },
  { masked: 'je******@gmail.com', name: '김*은', orderId: 'order_1762386790593_3kv1dru6s' },
  { masked: 'yu*******@gmail.com', name: '최*진', orderId: 'order_1761542676217_a9nbyc297' },
  { masked: 'on******@naver.com', name: 'Ki********ng', orderId: 'order_1760971870005_c84c6pkhf' },
  { masked: 'js******@naver.com', name: '정*석', orderId: 'order_1760667306688_lgjmk2s8t' },
  { masked: 'ky****@gmail.com', name: '김*호', orderId: 'order_1760661392961_y8hwk51uj' },
  { masked: 'mi****@naver.com', name: '차*정', orderId: 'order_1760528102242_vejmj66ux' },
  { masked: 'in**@udmso.co.kr', name: '박*동', orderId: 'order_1760364259046_dp9frb7rf' },
  { masked: 'no**********@naver.com', name: '이*', orderId: 'order_1760360347773_l3nr8es8x' },
  { masked: 'te****@gmail.com', name: 'te*****al', orderId: 'order_1760346338615_tawstmccv' }
];

// Azure Users 테이블에서 가져온 실제 이메일 (예시)
// 실제로는 Azure에서 모든 사용자 이메일을 가져와야 함
const realEmails = [
  'rpflarh@naver.com',  // 조정우
  // ... 나머지 이메일들
];

// 매칭 함수
async function matchAndAddEnrollments() {
  console.log('🔍 마스킹된 이메일 매칭 시작...\n');
  
  // 테스트: rpflarh@naver.com이 rp*****@naver.com과 매칭되는지 확인
  const testResult = matchMaskedEmail('rp*****@naver.com', 'rpflarh@naver.com');
  console.log('🧪 테스트:', testResult ? '✅ 성공' : '❌ 실패');
  console.log('   rp*****@naver.com → rpflarh@naver.com:', testResult);
  
  // 모든 결제 데이터를 콘솔에 출력 (수동 매칭용)
  console.log('\n📊 결제 내역 (수동 확인용):\n');
  maskedPayments.forEach((payment, index) => {
    console.log(`${index + 1}. ${payment.name} - ${payment.masked}`);
    console.log(`   주문번호: ${payment.orderId}\n`);
  });
  
  console.log('\n💡 다음 단계:');
  console.log('1. Azure Portal에서 Users 테이블 열기');
  console.log('2. 위의 마스킹된 이메일과 비교하며 실제 이메일 찾기');
  console.log('3. 찾은 이메일을 아래 함수에 입력\n');
}

// 실행
matchAndAddEnrollments();

export { matchMaskedEmail, maskedPayments };

