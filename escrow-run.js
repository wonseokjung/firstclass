/**
 * 에스크로 일괄 등록 스크립트 (빠른 버전)
 * 터미널에서 실행: node escrow-run.js
 * 
 * 필요한 패키지: npm install iconv-lite
 */
const crypto = require('crypto');
const https = require('https');
const iconv = require('iconv-lite');

const MID = 'clathou1x0';
const MERT_KEY = 'b13f36ce53a754c2956adc083001a80d';

// 동시 처리 개수 (너무 높으면 API 제한 걸릴 수 있음)
const CONCURRENT = 5;
// 각 요청 간 딜레이 (ms)
const DELAY = 100;

const orders = [
  {"oid": "order_1766247236073_9uxl0cab6", "rcvname": "이우", "rcvdate": "202512210118"},
  {"oid": "order_1766244712411_fxp8zqjcp", "rcvname": "문용", "rcvdate": "202512210032"},
  {"oid": "order_1766231850948_c1pn2cx3h", "rcvname": "문용", "rcvdate": "202512202058"},
  {"oid": "order_1766227528489_a3yv7sick", "rcvname": "Kwub", "rcvdate": "202512201946"},
  {"oid": "order_1766224546245_x5w27n0s9", "rcvname": "정찬", "rcvdate": "202512201856"},
  {"oid": "order_1766216020092_vpmdul43n", "rcvname": "해선", "rcvdate": "202512201634"},
  {"oid": "order_1766205653983_0p7wibyg1", "rcvname": "오", "rcvdate": "202512201345"},
  {"oid": "order_1766200040087_ajn8r3uaw", "rcvname": "김영", "rcvdate": "202512201208"},
  {"oid": "order_1766199764436_9m4qn1ppx", "rcvname": "김영", "rcvdate": "202512201204"},
  {"oid": "order_1766179094484_v45xohdbw", "rcvname": "서용", "rcvdate": "202512200620"},
  {"oid": "order_1766171774681_n7onncfm1", "rcvname": "김진", "rcvdate": "202512200417"},
  {"oid": "order_1766157339746_rsf9cv1kq", "rcvname": "김영", "rcvdate": "202512200016"},
  {"oid": "order_1766156824146_smsll4fzj", "rcvname": "해다", "rcvdate": "202512200007"},
  {"oid": "order_1766149684324_2tov2jlmm", "rcvname": "유", "rcvdate": "202512192208"},
  {"oid": "order_1766146177726_g7tgl0092", "rcvname": "장혁", "rcvdate": "202512192115"},
  {"oid": "order_1766145571908_1mmlsmmoq", "rcvname": "장혁", "rcvdate": "202512192106"},
  {"oid": "order_1766124556469_pkuh1p8ib", "rcvname": "조중", "rcvdate": "202512191509"},
  {"oid": "order_1766114635603_7ex47efmb", "rcvname": "박주", "rcvdate": "202512191224"},
  {"oid": "order_1766110867583_ian7nwpot", "rcvname": "이자", "rcvdate": "202512191122"},
  {"oid": "order_1766060762327_1a0rw38tq", "rcvname": "조정", "rcvdate": "202512182126"},
  {"oid": "order_1766060178329_2p483y5on", "rcvname": "조정", "rcvdate": "202512182117"},
  {"oid": "order_1766053779258_iohf4hvpi", "rcvname": "이환", "rcvdate": "202512181930"},
  {"oid": "order_1766050524162_05e4uqull", "rcvname": "최중", "rcvdate": "202512181837"},
  {"oid": "order_1766042880931_7zhc5big9", "rcvname": "유훈", "rcvdate": "202512181628"},
  {"oid": "order_1766032247912_yaz8lbzlb", "rcvname": "이호", "rcvdate": "202512181331"},
  {"oid": "order_1766018189630_qnktlnmic", "rcvname": "유균", "rcvdate": "202512180937"},
  {"oid": "order_1766013734671_c0xmuql87", "rcvname": "구엽", "rcvdate": "202512180825"},
  {"oid": "order_1766010412606_rz4hni3ya", "rcvname": "구엽", "rcvdate": "202512180727"},
  {"oid": "order_1765991337197_3gw8wx0ny", "rcvname": "이배", "rcvdate": "202512180209"},
  {"oid": "order_1765991336240_3kufw7kwu", "rcvname": "박옥", "rcvdate": "202512180209"},
  {"oid": "order_1765986450964_ny42eaffs", "rcvname": "김석", "rcvdate": "202512180047"},
  {"oid": "order_1765977705904_1zhclnedb", "rcvname": "이민", "rcvdate": "202512172222"},
  {"oid": "order_1765976051470_njst0wfdn", "rcvname": "한호", "rcvdate": "202512172157"},
  {"oid": "order_1765973271667_8e2ifo2kd", "rcvname": "신일", "rcvdate": "202512172108"},
  {"oid": "order_1765937023590_ezr38conm", "rcvname": "이숙", "rcvdate": "202512171105"},
  {"oid": "order_1765927747749_jt18u1tre", "rcvname": "이영", "rcvdate": "202512170829"},
  {"oid": "order_1765897773984_bwtxthn3j", "rcvname": "염화", "rcvdate": "202512170010"},
  {"oid": "order_1765887306926_8h2p2gwz6", "rcvname": "이훈", "rcvdate": "202512162115"},
  {"oid": "order_1765884485791_3uslonadx", "rcvname": "김미", "rcvdate": "202512162028"},
  {"oid": "order_1765882801496_9ozd1jc5a", "rcvname": "박희", "rcvdate": "202512162003"},
  {"oid": "order_1765880164715_5pqnd19r7", "rcvname": "강호", "rcvdate": "202512161916"},
  {"oid": "order_1765866083891_u9mm9s173", "rcvname": "방숙", "rcvdate": "202512161524"},
  {"oid": "order_1765861275254_ssr74gtx5", "rcvname": "조웅", "rcvdate": "202512161401"},
  {"oid": "order_1765835559868_6y9sje5o9", "rcvname": "차주", "rcvdate": "202512160653"},
  {"oid": "order_1765833174363_9zryrddit", "rcvname": "권정", "rcvdate": "202512160613"},
  {"oid": "order_1765823452559_qqqaa6udb", "rcvname": "황수", "rcvdate": "202512160331"},
  {"oid": "order_1765818673865_yqt3pswfr", "rcvname": "정훈", "rcvdate": "202512160212"},
  {"oid": "order_1765803745070_3uq6qbawg", "rcvname": "이철", "rcvdate": "202512152202"},
  {"oid": "order_1765802591647_yevft14pn", "rcvname": "김자", "rcvdate": "202512152143"},
  {"oid": "order_1765797526651_jz37hhuos", "rcvname": "박순", "rcvdate": "202512152019"},
  {"oid": "order_1765796278841_ongvge3wq", "rcvname": "강희", "rcvdate": "202512151958"},
  {"oid": "order_1765781719555_scbmivjyc", "rcvname": "박혁", "rcvdate": "202512151556"},
  {"oid": "order_1765765481522_284wfjj4z", "rcvname": "최호", "rcvdate": "202512151125"},
  {"oid": "order_1765748082479_8orb0n2an", "rcvname": "정호", "rcvdate": "202512150635"},
  {"oid": "order_1765735234937_lkgzg2bq2", "rcvname": "이훈", "rcvdate": "202512150301"},
  {"oid": "order_1765711074566_dld18iph7", "rcvname": "김자", "rcvdate": "202512142021"},
  {"oid": "order_1765669367368_1wwwi2jus", "rcvname": "이주", "rcvdate": "202512140843"},
  {"oid": "order_1765614862040_khq0r27iw", "rcvname": "황숙", "rcvdate": "202512131738"},
  {"oid": "order_1765614049209_skr3e2i3k", "rcvname": "장식", "rcvdate": "202512131721"},
  {"oid": "order_1765613218364_mkms2a4sb", "rcvname": "장식", "rcvdate": "202512131707"},
  {"oid": "order_1765597563563_3a8y5wcmz", "rcvname": "권득", "rcvdate": "202512131247"},
  {"oid": "order_1765547839954_izqptiip0", "rcvname": "유윤", "rcvdate": "202512122257"},
  {"oid": "order_1765546715959_bhclo2fio", "rcvname": "유윤", "rcvdate": "202512122239"},
  {"oid": "order_1765526045948_pilw9mjub", "rcvname": "정호", "rcvdate": "202512121654"},
  {"oid": "order_1765508125410_xrqted6eb", "rcvname": "김랑", "rcvdate": "202512121200"},
  {"oid": "order_1765500573634_stym0v3gw", "rcvname": "김화", "rcvdate": "202512120950"},
  {"oid": "order_1765462014211_ir7wzwh4p", "rcvname": "김랑", "rcvdate": "202512112311"},
  {"oid": "order_1765456078068_9vcumhksr", "rcvname": "서나", "rcvdate": "202512112130"},
  {"oid": "order_1765423386827_vfadj6ijv", "rcvname": "박진", "rcvdate": "202512111232"},
  {"oid": "order_1765346155489_u1uah5b63", "rcvname": "정진", "rcvdate": "202512101456"},
  {"oid": "order_1765335967651_h2k8hte9x", "rcvname": "최광", "rcvdate": "202512101215"},
  {"oid": "order_1765306945487_kb55t2xzp", "rcvname": "정선", "rcvdate": "202512100405"},
  {"oid": "order_1765291999533_pvgoeagg4", "rcvname": "이원", "rcvdate": "202512092353"},
  {"oid": "order_1765260201127_uxpdm77jx", "rcvname": "곽희", "rcvdate": "202512091503"},
  {"oid": "order_1765213953933_nj1qgcn71", "rcvname": "김양", "rcvdate": "202512090219"},
  {"oid": "order_1765206435456_xg036oaju", "rcvname": "이길", "rcvdate": "202512090007"},
  {"oid": "order_1765197288550_mvywdb8ad", "rcvname": "이원", "rcvdate": "202512082135"},
  {"oid": "order_1765195903403_fhnsaq5ay", "rcvname": "변길", "rcvdate": "202512082112"},
  {"oid": "order_1765180240624_aqfwcvpdb", "rcvname": "김수", "rcvdate": "202512081656"},
  {"oid": "order_1765160173430_uud1bd1zq", "rcvname": "권숙", "rcvdate": "202512081116"},
  {"oid": "order_1765159638616_g3beqhpnt", "rcvname": "최준", "rcvdate": "202512081107"},
  {"oid": "order_1765155800895_c8btqieib", "rcvname": "이주", "rcvdate": "202512081008"},
  {"oid": "order_1765109489882_vrd09u4b2", "rcvname": "안범", "rcvdate": "202512072112"},
  {"oid": "order_1765094669479_0hcs2kbac", "rcvname": "Hyoi", "rcvdate": "202512071705"},
  {"oid": "order_1765086842893_51gk3aat0", "rcvname": "조호", "rcvdate": "202512071454"},
  {"oid": "order_1765082085538_8yfvh58aj", "rcvname": "윤백", "rcvdate": "202512071335"},
  {"oid": "order_1765064081113_cpqukz248", "rcvname": "ki", "rcvdate": "202512070836"},
  {"oid": "order_1765037724776_6krn2d5xo", "rcvname": "최진", "rcvdate": "202512070115"},
  {"oid": "order_1765014630695_i14hpnj36", "rcvname": "노오", "rcvdate": "202512061850"},
  {"oid": "order_1764996379623_fv3b0x0si", "rcvname": "강화", "rcvdate": "202512061350"},
  {"oid": "order_1764965884592_03a0ywoyo", "rcvname": "이길", "rcvdate": "202512060519"},
  {"oid": "order_1764943447970_dben71lmg", "rcvname": "박현", "rcvdate": "202512052305"},
  {"oid": "order_1764923324812_ajtz1lh1q", "rcvname": "김일", "rcvdate": "202512051729"},
  {"oid": "order_1764914444050_b84d4hrli", "rcvname": "백수", "rcvdate": "202512051505"},
  {"oid": "order_1764866794755_bubqm2r42", "rcvname": "유준", "rcvdate": "202512050151"},
  {"oid": "order_1764856131776_4o2mvkv3g", "rcvname": "유훈", "rcvdate": "202512042255"},
  {"oid": "order_1764853985218_zt415yf1z", "rcvname": "정웅", "rcvdate": "202512042216"},
  {"oid": "order_1764843351678_4qr2alg3w", "rcvname": "고수", "rcvdate": "202512041922"},
  {"oid": "order_1764804701516_d1v22uyp8", "rcvname": "서숙", "rcvdate": "202512040832"},
  {"oid": "order_1764797834350_wmdh8fi6r", "rcvname": "신진", "rcvdate": "202512040638"},
  {"oid": "order_1764767937073_vmzxgx9yz", "rcvname": "김회", "rcvdate": "202512032219"},
  {"oid": "order_1764766152091_m4tmmeoou", "rcvname": "김경", "rcvdate": "202512032152"},
  {"oid": "order_1764761032396_fc83grmwg", "rcvname": "김섭", "rcvdate": "202512032025"},
  {"oid": "order_1764760038496_n30x10d1a", "rcvname": "백정", "rcvdate": "202512032010"},
  {"oid": "order_1764744753113_uwjilcrrc", "rcvname": "문현", "rcvdate": "202512031552"},
  {"oid": "order_1764740491522_q9l7y2x3j", "rcvname": "김술", "rcvdate": "202512031446"},
  {"oid": "order_1764726813286_gsttmobxs", "rcvname": "원민", "rcvdate": "202512031054"},
  {"oid": "order_1764726139188_yeo4bbk73", "rcvname": "원민", "rcvdate": "202512031048"},
  {"oid": "order_1764706038535_qkwk9xif5", "rcvname": "고일", "rcvdate": "202512030508"},
  {"oid": "order_1764082141967_yrn5uxmng", "rcvname": "우희", "rcvdate": "202511252350"},
  {"oid": "order_1764034822374_89bzc11fx", "rcvname": "강정", "rcvdate": "202511251040"},
  {"oid": "order_1764022342596_hvk2pejn7", "rcvname": "안범", "rcvdate": "202511250712"},
  {"oid": "order_1764002924692_098lag6un", "rcvname": "정천", "rcvdate": "202511250149"},
  {"oid": "order_1763971014586_b2mbdachk", "rcvname": "조희", "rcvdate": "202511241657"},
  {"oid": "order_1763954823063_stx6gipkt", "rcvname": "박덕", "rcvdate": "202511241229"},
  {"oid": "order_1763907050932_dtf2hhj3i", "rcvname": "전헌", "rcvdate": "202511232311"},
  {"oid": "order_1763902409182_a1pr6d15e", "rcvname": "정미", "rcvdate": "202511232154"},
  {"oid": "order_1763900075944_ra9jxdgye", "rcvname": "김란", "rcvdate": "202511232115"},
  {"oid": "order_1763896585623_pklai6a25", "rcvname": "김균", "rcvdate": "202511232018"},
  {"oid": "order_1763878235980_96bc3l0rc", "rcvname": "박현", "rcvdate": "202511231511"},
  {"oid": "order_1763877730956_cpraori2p", "rcvname": "윤원", "rcvdate": "202511231502"},
  {"oid": "order_1763823544460_hgx3suk55", "rcvname": "홍원", "rcvdate": "202511222359"},
  {"oid": "order_1763816921505_7wy975t5t", "rcvname": "박영", "rcvdate": "202511222212"},
  {"oid": "order_1763814216666_i8vb3v2qt", "rcvname": "추수", "rcvdate": "202511222124"},
  {"oid": "order_1763775544431_6klcff4t0", "rcvname": "안훈", "rcvdate": "202511221039"},
  {"oid": "order_1763732223995_7bt087p57", "rcvname": "안한", "rcvdate": "202511212237"},
  {"oid": "order_1763728213601_57nv5shgk", "rcvname": "최", "rcvdate": "202511212138"},
  {"oid": "order_1763717917638_uybonn4cl", "rcvname": "권문", "rcvdate": "202511211841"},
  {"oid": "order_1763713902172_yzg66ddrp", "rcvname": "김수", "rcvdate": "202511211732"},
  {"oid": "order_1763712949403_fggf8awp7", "rcvname": "김우", "rcvdate": "202511211716"},
  {"oid": "order_1763684683639_2ye5vgkjl", "rcvname": "김형", "rcvdate": "202511210925"},
  {"oid": "order_1763638855409_be9z30z05", "rcvname": "김공", "rcvdate": "202511202041"},
  {"oid": "order_1763633513966_fk0z1xxl1", "rcvname": "조균", "rcvdate": "202511201914"},
  {"oid": "order_1763632081834_lyuijb2vc", "rcvname": "윤효", "rcvdate": "202511201848"},
  {"oid": "order_1763457428837_f21kab6nb", "rcvname": "임규", "rcvdate": "202511181818"}
];

function createMD5Hash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

function registerOrder(order) {
  return new Promise((resolve) => {
    const dlvtype = '01';
    const hashdata = createMD5Hash(MID + order.oid + dlvtype + order.rcvdate + MERT_KEY);
    
    // EUC-KR 인코딩으로 파라미터 생성
    const encodeEucKr = (str) => {
      const encoded = iconv.encode(str, 'euc-kr');
      return Array.from(encoded).map(byte => '%' + byte.toString(16).toUpperCase().padStart(2, '0')).join('');
    };
    
    // 파라미터 구성 (한글만 EUC-KR 인코딩)
    const body = [
      `mid=${MID}`,
      `oid=${order.oid}`,
      `dlvtype=${dlvtype}`,
      `rcvdate=${order.rcvdate}`,
      `rcvname=${encodeEucKr(order.rcvname)}`,
      `rcvrelation=${encodeEucKr('본인')}`,
      `hashdata=${hashdata}`
    ].join('&');
    
    const req = https.request({
      hostname: 'pgweb.tosspayments.com', 
      port: 443,
      path: '/pg/wmp/mertadmin/jsp/escrow/rcvdlvinfo.jsp',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const success = data.includes('OK');
        console.log(success ? '✅' : '❌', order.oid.substring(6, 25), order.rcvname, success ? '' : data.trim());
        resolve({ success, oid: order.oid });
      });
    });
    
    req.on('error', (err) => {
      console.log('❌', order.oid.substring(6, 25), '에러:', err.message);
      resolve({ success: false, oid: order.oid });
    });
    
    req.write(body);
    req.end();
  });
}

// 배치 처리 (동시 N개씩)
async function processBatch(batch) {
  return Promise.all(batch.map(order => registerOrder(order)));
}

(async () => {
  console.log(`🚀 에스크로 배송완료 일괄 등록 시작`);
  console.log(`📋 총 ${orders.length}건 / 동시 ${CONCURRENT}개씩 처리\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  // 배치로 나누어 처리
  for (let i = 0; i < orders.length; i += CONCURRENT) {
    const batch = orders.slice(i, i + CONCURRENT);
    const results = await processBatch(batch);
    
    results.forEach(r => {
      if (r.success) successCount++;
      else failCount++;
    });
    
    // 진행률 표시
    const progress = Math.min(i + CONCURRENT, orders.length);
    process.stdout.write(`\r📊 진행: ${progress}/${orders.length} (${Math.round(progress/orders.length*100)}%)`);
    
    // 다음 배치 전 대기
    if (i + CONCURRENT < orders.length) {
      await new Promise(r => setTimeout(r, DELAY));
    }
  }
  
  console.log(`\n\n========================================`);
  console.log(`📊 처리 완료!`);
  console.log(`   ✅ 성공: ${successCount}건`);
  console.log(`   ❌ 실패: ${failCount}건`);
  console.log(`========================================`);
})();

