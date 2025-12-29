/**
 * 에스크로 일괄 등록 스크립트
 * 터미널에서 실행: node escrow-run.js
 */
const crypto = require('crypto');
const https = require('https');
const iconv = require('iconv-lite');

const MID = 'clathou1x0';
const MERT_KEY = 'b13f36ce53a754c2956adc083001a80d';

const orders = [
  {
    "oid": "order_1766909028708_s9al4qobc",
    "rcvname": "신수",
    "rcvdate": "202512281704"
  },
  {
    "oid": "order_1766889197337_3bk0is4zt",
    "rcvname": "송향",
    "rcvdate": "202512281133"
  },
  {
    "oid": "order_1766870571753_lchdinmno",
    "rcvname": "황석",
    "rcvdate": "202512280623"
  },
  {
    "oid": "order_1766850675953_78jeznr2q",
    "rcvname": "강서",
    "rcvdate": "202512280051"
  },
  {
    "oid": "order_1766807867522_5ujl6pzo2",
    "rcvname": "강서",
    "rcvdate": "202512271257"
  },
  {
    "oid": "order_1766806834714_72b4949am",
    "rcvname": "홍재",
    "rcvdate": "202512271241"
  },
  {
    "oid": "order_1766798629957_ph7uck7jy",
    "rcvname": "권정",
    "rcvdate": "202512271025"
  },
  {
    "oid": "order_1766796407551_8k5rvs9bs",
    "rcvname": "박덕",
    "rcvdate": "202512270947"
  },
  {
    "oid": "order_1766772380556_jarby74i3",
    "rcvname": "강수",
    "rcvdate": "202512270306"
  },
  {
    "oid": "order_1766772162594_jqf1p0dj3",
    "rcvname": "강수",
    "rcvdate": "202512270305"
  },
  {
    "oid": "order_1766736727435_gogvolr0z",
    "rcvname": "김훈",
    "rcvdate": "202512261716"
  },
  {
    "oid": "order_1766724603703_l47sy22yu",
    "rcvname": "손미",
    "rcvdate": "202512261350"
  },
  {
    "oid": "order_1766724296761_qaw4uw7v6",
    "rcvname": "손미",
    "rcvdate": "202512261345"
  },
  {
    "oid": "order_1766723072379_t5zch6nw4",
    "rcvname": "김섭",
    "rcvdate": "202512261327"
  },
  {
    "oid": "order_1766718836552_jcv6wqyzy",
    "rcvname": "김성",
    "rcvdate": "202512261228"
  },
  {
    "oid": "order_1766713317255_u2q3zu4d9",
    "rcvname": "오숙",
    "rcvdate": "202512261055"
  },
  {
    "oid": "order_1766706443051_0a7u75e3h",
    "rcvname": "blnk",
    "rcvdate": "202512260847"
  },
  {
    "oid": "order_1766704787123_ar54c32tg",
    "rcvname": "장룡",
    "rcvdate": "202512260820"
  },
  {
    "oid": "order_1766700341492_ptszla35t",
    "rcvname": "밝앤",
    "rcvdate": "202512260707"
  },
  {
    "oid": "order_1766680561310_bjhyoyw7x",
    "rcvname": "신록",
    "rcvdate": "202512260136"
  },
  {
    "oid": "order_1766677956360_f2d1q969e",
    "rcvname": "해",
    "rcvdate": "202512260053"
  },
  {
    "oid": "order_1766676354042_lupwiq3ub",
    "rcvname": "해",
    "rcvdate": "202512260027"
  },
  {
    "oid": "order_1766673565350_wlw2sxrsm",
    "rcvname": "정준",
    "rcvdate": "202512252340"
  },
  {
    "oid": "order_1766672948997_7q8hke1oq",
    "rcvname": "정량",
    "rcvdate": "202512252329"
  },
  {
    "oid": "order_1766665721066_dlcxth5yo",
    "rcvname": "밝앤",
    "rcvdate": "202512252139"
  },
  {
    "oid": "order_1766661503037_shb3ziwah",
    "rcvname": "윤은",
    "rcvdate": "202512252018"
  },
  {
    "oid": "order_1766651241997_l47709vwm",
    "rcvname": "piig",
    "rcvdate": "202512251734"
  },
  {
    "oid": "order_1766626482456_jtiqyznvo",
    "rcvname": "범옥",
    "rcvdate": "202512251035"
  },
  {
    "oid": "order_1766568173803_rv3zr23it",
    "rcvname": "민익",
    "rcvdate": "202512241822"
  },
  {
    "oid": "order_1766563926868_imfwjzd7u",
    "rcvname": "신숙",
    "rcvdate": "202512241712"
  },
  {
    "oid": "order_1766563804976_sul2yc2jh",
    "rcvname": "정원",
    "rcvdate": "202512241711"
  },
  {
    "oid": "order_1766555056694_0ow2fvdwx",
    "rcvname": "송희",
    "rcvdate": "202512241445"
  },
  {
    "oid": "order_1766554412704_1yildti41",
    "rcvname": "최진",
    "rcvdate": "202512241438"
  },
  {
    "oid": "order_1766545439969_dn8l1z3hb",
    "rcvname": "조가",
    "rcvdate": "202512241204"
  },
  {
    "oid": "order_1766531384896_ori7oxx1z",
    "rcvname": "곽희",
    "rcvdate": "202512240823"
  },
  {
    "oid": "order_1766472589577_hcah3gqfd",
    "rcvname": "박희",
    "rcvdate": "202512231550"
  },
  {
    "oid": "order_1766464775142_yhg2gaw1h",
    "rcvname": "민학",
    "rcvdate": "202512231340"
  },
  {
    "oid": "order_1766454966834_3on8q9v5d",
    "rcvname": "전진",
    "rcvdate": "202512231056"
  },
  {
    "oid": "order_1766453845463_pwayj1d3a",
    "rcvname": "이진",
    "rcvdate": "202512231037"
  },
  {
    "oid": "order_1766447409168_4qek0ap5o",
    "rcvname": "최성",
    "rcvdate": "202512230850"
  },
  {
    "oid": "order_1766447149190_fcr5xqqqc",
    "rcvname": "최성",
    "rcvdate": "202512230846"
  },
  {
    "oid": "order_1766428019506_r1fzabbzn",
    "rcvname": "홍연",
    "rcvdate": "202512230327"
  },
  {
    "oid": "order_1766427753643_ts60id0hm",
    "rcvname": "홍연",
    "rcvdate": "202512230323"
  },
  {
    "oid": "order_1766412441644_03uk0484m",
    "rcvname": "달쌤",
    "rcvdate": "202512222308"
  },
  {
    "oid": "order_1766411949400_0fde1001e",
    "rcvname": "김수",
    "rcvdate": "202512222259"
  },
  {
    "oid": "order_1766410571498_kmnejiy3c",
    "rcvname": "수",
    "rcvdate": "202512222237"
  },
  {
    "oid": "order_1766407514730_tvoguv8vt",
    "rcvname": "윤수",
    "rcvdate": "202512222145"
  },
  {
    "oid": "order_1766407210016_v62n13o13",
    "rcvname": "윤수",
    "rcvdate": "202512222140"
  },
  {
    "oid": "order_1766405977611_z42xoi027",
    "rcvname": "정진",
    "rcvdate": "202512222120"
  },
  {
    "oid": "order_1766404932125_wmbu927ah",
    "rcvname": "유훈",
    "rcvdate": "202512222102"
  },
  {
    "oid": "order_1766395850957_y83xqz6fg",
    "rcvname": "정우",
    "rcvdate": "202512221840"
  },
  {
    "oid": "order_1766364945893_sjvgg5bmx",
    "rcvname": "신진",
    "rcvdate": "202512220957"
  },
  {
    "oid": "order_1766342057052_k389tucau",
    "rcvname": "Ai아리",
    "rcvdate": "202512220338"
  },
  {
    "oid": "order_1766341621659_r03ume5ib",
    "rcvname": "이희",
    "rcvdate": "202512220330"
  },
  {
    "oid": "order_1766324295346_i15wbupec",
    "rcvname": "이환",
    "rcvdate": "202512212238"
  },
  {
    "oid": "order_1766319969989_uj9vcjw75",
    "rcvname": "박미",
    "rcvdate": "202512212126"
  },
  {
    "oid": "order_1766315797289_5qevpp2h9",
    "rcvname": "L",
    "rcvdate": "202512212017"
  },
  {
    "oid": "order_1766310900208_3l8z3yiok",
    "rcvname": "홍형",
    "rcvdate": "202512211855"
  },
  {
    "oid": "order_1766307363090_y8230jl1q",
    "rcvname": "김호",
    "rcvdate": "202512211756"
  },
  {
    "oid": "order_1766307236016_etct7rs8n",
    "rcvname": "김호",
    "rcvdate": "202512211755"
  },
  {
    "oid": "order_1766306143835_2rdubq80v",
    "rcvname": "이수",
    "rcvdate": "202512211737"
  },
  {
    "oid": "order_1766304285987_w6w0e5egw",
    "rcvname": "박재",
    "rcvdate": "202512211705"
  },
  {
    "oid": "order_1766295932160_zsfhlrvzk",
    "rcvname": "김원",
    "rcvdate": "202512211446"
  },
  {
    "oid": "order_1766180318851_ilnrifkbd",
    "rcvname": "조정",
    "rcvdate": "202512200638"
  },
  {
    "oid": "order_1766069570129_53odtdmup",
    "rcvname": "권수",
    "rcvdate": "202512182353"
  },
  {
    "oid": "order_1766069214756_v2wj2egsz",
    "rcvname": "권수",
    "rcvdate": "202512182347"
  }
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
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        // EUC-KR 응답을 UTF-8로 디코딩
        const buffer = Buffer.concat(chunks);
        const data = iconv.decode(buffer, 'euc-kr');
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

(async () => {
  console.log(`🚀 에스크로 배송완료 등록 시작 (${orders.length}건)`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const o of orders) {
    const result = await registerOrder(o);
    if (result.success) successCount++;
      else failCount++;
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log(`\n========================================`);
  console.log(`📊 처리 완료!`);
  console.log(`   ✅ 성공: ${successCount}건`);
  console.log(`   ❌ 실패: ${failCount}건`);
  console.log(`========================================`);
})();
