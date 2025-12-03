import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import AzureTableService from '../../../services/azureTableService';
import NavigationBar from '../../common/NavigationBar';

interface Payment {
  orderId: string;
  name: string;
  maskedEmail: string;
  amount: number;
  date: string;
  realEmail?: string;
  status?: 'pending' | 'processing' | 'success' | 'error' | 'skip';
  message?: string;
}

const AdminEnrollmentFixPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [showUserTable, setShowUserTable] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([
    // 최신 결제 - 2025-12-03 (점심/오후)
    { orderId: 'order_1764731754941_ehilkdwjr', name: '강*미', maskedEmail: 'rk**********@naver.com', amount: 45000, date: '2025-12-03 12:16:31', realEmail: 'rk**********@naver.com' },
    { orderId: 'order_1764731255476_qb6u6jcnn', name: '강*원', maskedEmail: 'si*******@naver.com', amount: 45000, date: '2025-12-03 12:08:40', realEmail: 'si*******@naver.com' },
    { orderId: 'order_1764731076999_3bcap10pn', name: '이*', maskedEmail: 'od*****@gmail.com', amount: 95000, date: '2025-12-03 12:06:54', realEmail: 'od*****@gmail.com' },
    { orderId: 'order_1764729881872_3c7ywb7z1', name: '김*수', maskedEmail: 'ds****@naver.com', amount: 45000, date: '2025-12-03 11:45:22', realEmail: 'ds****@naver.com' },
    { orderId: 'order_1764729700383_bqdy1wqm4', name: 'Ha*********ng', maskedEmail: 'Ha*********ng', amount: 45000, date: '2025-12-03 11:44:12' },
    { orderId: 'order_1764729556788_8r0nuqc2q', name: '이*련', maskedEmail: 'ho*******@gmail.com', amount: 45000, date: '2025-12-03 11:40:44', realEmail: 'ho*******@gmail.com' },
    { orderId: 'order_1764729290398_xabkikijf', name: '곽*희', maskedEmail: 'el**********@gmail.com', amount: 45000, date: '2025-12-03 11:35:26', realEmail: 'el**********@gmail.com' },
    { orderId: 'order_1764728703639_qpxrykbc4', name: '정*미', maskedEmail: 'qw*****@kakao.com', amount: 45000, date: '2025-12-03 11:25:58', realEmail: 'qw*****@kakao.com' },
    { orderId: 'order_1764728336467_gs83p8z9m', name: '이*재', maskedEmail: 'kk******@gmail.com', amount: 95000, date: '2025-12-03 11:19:47', realEmail: 'kk******@gmail.com' },
    { orderId: 'order_1764726813286_gsttmobxs', name: '원*민', maskedEmail: '010****6474', amount: 45000, date: '2025-12-03 10:54:19' },
    { orderId: 'order_1764726389297_thajrdy2r', name: '정*봉', maskedEmail: 'js*****@naver.com', amount: 45000, date: '2025-12-03 10:50:42', realEmail: 'js*****@naver.com' },
    { orderId: 'order_1764726139188_yeo4bbk73', name: '원*민', maskedEmail: '010****6474', amount: 95000, date: '2025-12-03 10:48:02' },
    { orderId: 'order_1764726078727_ajakeaajt', name: '남*민', maskedEmail: 'al**************@gmail.com', amount: 45000, date: '2025-12-03 10:41:59', realEmail: 'al**************@gmail.com' },
    { orderId: 'order_1764724677445_84fdhp6no', name: '양*우', maskedEmail: 'ru*******@naver.com', amount: 95000, date: '2025-12-03 10:18:34', realEmail: 'ru*******@naver.com' },
    { orderId: 'order_1764724579134_omnb1o6f3', name: '양*우', maskedEmail: 'ru*******@naver.com', amount: 45000, date: '2025-12-03 10:16:52', realEmail: 'ru*******@naver.com' },
    { orderId: 'order_1764723828484_uuvjm8cpv', name: '이*라', maskedEmail: 'qh******@naver.com', amount: 45000, date: '2025-12-03 10:10:51', realEmail: 'qh******@naver.com' },
    { orderId: 'order_1764724159744_c0y2nsuua', name: '정*매', maskedEmail: 'bo********@gmail.com', amount: 45000, date: '2025-12-03 10:09:51', realEmail: 'bo********@gmail.com' },
    { orderId: 'order_1764723067077_8hox93xee', name: '김*경', maskedEmail: 'qu******@gmail.com', amount: 95000, date: '2025-12-03 09:52:37', realEmail: 'qu******@gmail.com' },
    { orderId: 'order_1764723064813_81bz7m4fs', name: '박*솔', maskedEmail: 'ji**********@gmail.com', amount: 45000, date: '2025-12-03 09:51:37', realEmail: 'ji**********@gmail.com' },
    { orderId: 'order_1764722873365_63503cmfd', name: '이*선', maskedEmail: 'mi********@gmail.com', amount: 45000, date: '2025-12-03 09:48:47', realEmail: 'mi********@gmail.com' },
    { orderId: 'order_1764722401383_zvw5i2anr', name: '김*경', maskedEmail: 'qu******@gmail.com', amount: 45000, date: '2025-12-03 09:40:27', realEmail: 'qu******@gmail.com' },
    { orderId: 'order_1764722281080_efc4auh88', name: '박*완', maskedEmail: 'ps******@gmail.com', amount: 45000, date: '2025-12-03 09:38:35', realEmail: 'ps******@gmail.com' },
    { orderId: 'order_1764721927795_hvyfeg52i', name: '이*인', maskedEmail: 'sa******@naver.com', amount: 95000, date: '2025-12-03 09:35:40', realEmail: 'sa******@naver.com' },
    { orderId: 'order_1764706038535_qkwk9xif5', name: '고*일', maskedEmail: 'ko******@gmail.com', amount: 45000, date: '2025-12-03 09:10:00', realEmail: 'ko******@gmail.com' },
    { orderId: 'order_1764720087339_w5l06apdw', name: '최*관', maskedEmail: 'cb***@naver.com', amount: 45000, date: '2025-12-03 09:02:11', realEmail: 'cb***@naver.com' },
    { orderId: 'order_1764719406860_78rc9gt8z', name: '현*화', maskedEmail: 'tt******@naver.com', amount: 45000, date: '2025-12-03 08:50:52', realEmail: 'tt******@naver.com' },
    { orderId: 'order_1764717291607_87nadbuoz', name: '하*민', maskedEmail: 'po***********@naver.com', amount: 45000, date: '2025-12-03 08:15:41', realEmail: 'po***********@naver.com' },
    { orderId: 'order_1764715634717_fhi9lejm1', name: '이*영', maskedEmail: 'bo*********@naver.com', amount: 95000, date: '2025-12-03 07:49:32', realEmail: 'bo*********@naver.com' },
    { orderId: 'order_1764712444713_i99r5e38k', name: '이*기', maskedEmail: 'ch*******@naver.com', amount: 45000, date: '2025-12-03 06:55:27', realEmail: 'ch*******@naver.com' },
    { orderId: 'order_1764712356747_chnqvt1ik', name: '최*수', maskedEmail: 'ye********@naver.com', amount: 45000, date: '2025-12-03 06:54:07', realEmail: 'ye********@naver.com' },
    { orderId: 'order_1764712337313_89wlq0pi3', name: '이*진', maskedEmail: 'bu******@naver.com', amount: 45000, date: '2025-12-03 06:53:17', realEmail: 'bu******@naver.com' },
    { orderId: 'order_1764710051842_x8i0h1aoz', name: '김*경', maskedEmail: 'an******@gmail.com', amount: 45000, date: '2025-12-03 06:15:03', realEmail: 'an******@gmail.com' },
    { orderId: 'order_1764706232191_so78f1fig', name: 'La******ON', maskedEmail: 'de*****@naver.com', amount: 45000, date: '2025-12-03 05:13:44', realEmail: 'de*****@naver.com' },
    { orderId: 'order_1764705350500_22zon7wg3', name: '정*정', maskedEmail: 'oj*****@gmail.com', amount: 45000, date: '2025-12-03 04:56:13', realEmail: 'oj*****@gmail.com' },
    { orderId: 'order_1764701303333_qkkqhjsh9', name: '성*', maskedEmail: 'fr******@gmail.com', amount: 95000, date: '2025-12-03 03:49:17', realEmail: 'fr******@gmail.com' },
    { orderId: 'order_1764700569426_ahdzfm2k7', name: '박*윤', maskedEmail: 'pa*******@naver.com', amount: 45000, date: '2025-12-03 03:36:31', realEmail: 'pa*******@naver.com' },
    { orderId: 'order_1764699498437_jmlcvby5t', name: '보*', maskedEmail: 'bl*******@gmail.com', amount: 45000, date: '2025-12-03 03:28:16', realEmail: 'bl*******@gmail.com' },
    { orderId: 'order_1764698175035_8usksd3eb', name: '최*니', maskedEmail: 'no******@gmail.com', amount: 95000, date: '2025-12-03 02:57:21', realEmail: 'no******@gmail.com' },
    { orderId: 'order_1764697829075_66hjkmos9', name: '송*지', maskedEmail: 'hy******@naver.com', amount: 45000, date: '2025-12-03 02:50:56', realEmail: 'hy******@naver.com' },
    { orderId: 'order_1764695726004_u6qd8up1s', name: '방*준', maskedEmail: 'bh*****@naver.com', amount: 95000, date: '2025-12-03 02:17:01', realEmail: 'bh*****@naver.com' },
    { orderId: 'order_1764694754277_ihqgeuvp3', name: '방*준', maskedEmail: 'bh*****@naver.com', amount: 45000, date: '2025-12-03 02:01:08', realEmail: 'bh*****@naver.com' },
    { orderId: 'order_1764694368531_wuv0wqnfr', name: '송*주', maskedEmail: 'pe************@gmail.com', amount: 45000, date: '2025-12-03 01:54:21', realEmail: 'pe************@gmail.com' },
    
    // 최신 결제 - Step 1: AI 건물주 되기 기초 (2025-12-03 추가)
    { orderId: 'order_1764694314529_l29ivmrzj', name: '유*민', maskedEmail: 'wh******@naver.com', amount: 45000, date: '2025-12-03 01:54:51', realEmail: 'wh******@naver.com' },
    { orderId: 'order_1764693944702_yawcisuhp', name: '이*희', maskedEmail: 'he*******@naver.com', amount: 45000, date: '2025-12-03 01:46:50', realEmail: 'he*******@naver.com' },
    { orderId: 'order_1764693727703_fnrh0pzlk', name: '신*미', maskedEmail: 'sd*****@naver.com', amount: 95000, date: '2025-12-03 01:42:36', realEmail: 'sd*****@naver.com' },
    { orderId: 'order_1764693591814_ktkr60j39', name: '신*미', maskedEmail: 'sd*****@naver.com', amount: 45000, date: '2025-12-03 01:40:27', realEmail: 'sd*****@naver.com' },
    { orderId: 'order_1764692425034_u8wwusu1k', name: '박*진', maskedEmail: 'b1*****@gmail.com', amount: 95000, date: '2025-12-03 01:22:10', realEmail: 'b1*****@gmail.com' },
    { orderId: 'order_1764691080373_u58msh49j', name: '정*미', maskedEmail: 'k0**********@gmail.com', amount: 45000, date: '2025-12-03 01:08:25', realEmail: 'k0**********@gmail.com' },
    { orderId: 'order_1764691440612_mmgt1gwnh', name: '조*상', maskedEmail: 'hi**@naver.com', amount: 45000, date: '2025-12-03 01:04:45', realEmail: 'hi**@naver.com' },
    { orderId: 'order_1764690047978_i6zsgor20', name: '박*영', maskedEmail: 'rn******@gmail.com', amount: 45000, date: '2025-12-03 00:43:44', realEmail: 'rn******@gmail.com' },
    { orderId: 'order_1764690110953_leat9cu11', name: '이*재', maskedEmail: 'dr*******@naver.com', amount: 45000, date: '2025-12-03 00:42:34', realEmail: 'dr*******@naver.com' },
    { orderId: 'order_1764689900994_yukdxj4of', name: '박*민', maskedEmail: 'ky******@naver.com', amount: 95000, date: '2025-12-03 00:39:06', realEmail: 'ky******@naver.com' },
    { orderId: 'order_1764688735654_149wzwya6', name: '김*복', maskedEmail: 'un******@naver.com', amount: 95000, date: '2025-12-03 00:24:45', realEmail: 'un******@naver.com' },
    { orderId: 'order_1764688545305_q5imwhovw', name: '박*근', maskedEmail: 'pw*****@gmail.com', amount: 45000, date: '2025-12-03 00:18:32', realEmail: 'pw*****@gmail.com' },
    { orderId: 'order_1764688184438_enibqyp1a', name: '정*솔', maskedEmail: 'ec*******@daum.net', amount: 45000, date: '2025-12-03 00:10:04', realEmail: 'ec*******@daum.net' },
    { orderId: 'order_1764686228653_o6t69wxrz', name: '신*영', maskedEmail: 'sj*********@gmail.com', amount: 45000, date: '2025-12-02 23:37:31', realEmail: 'sj*********@gmail.com' },
    { orderId: 'order_1764685816908_jkhvuc8tp', name: '박*호', maskedEmail: 'ja*******@naver.com', amount: 95000, date: '2025-12-02 23:32:59', realEmail: 'ja*******@naver.com' },
    { orderId: 'order_1764684099452_iwkypakq9', name: '김*남', maskedEmail: 'rm*****@naver.com', amount: 45000, date: '2025-12-02 23:02:37', realEmail: 'rm*****@naver.com' },
    { orderId: 'order_1764683883527_m1f3vcihn', name: '이*정', maskedEmail: 'hi********@gmail.com', amount: 45000, date: '2025-12-02 22:59:05', realEmail: 'hi********@gmail.com' },
    { orderId: 'order_1764683787650_hknzj2p4g', name: 'JI********IM', maskedEmail: 'ti*************@gmail.com', amount: 45000, date: '2025-12-02 22:57:46', realEmail: 'ti*************@gmail.com' },
    { orderId: 'order_1764682552540_eie2hmkli', name: '이*성', maskedEmail: 'lj**********@naver.com', amount: 95000, date: '2025-12-02 22:36:10', realEmail: 'lj**********@naver.com' },
    { orderId: 'order_1764682429284_64kvqanie', name: '이*성', maskedEmail: 'lj**********@naver.com', amount: 45000, date: '2025-12-02 22:34:48', realEmail: 'lj**********@naver.com' },
    { orderId: 'order_1764682419058_30f0b5kko', name: '홍*표', maskedEmail: 'na*******@hanmail.net', amount: 95000, date: '2025-12-02 22:34:24', realEmail: 'na*******@hanmail.net' },
    { orderId: 'order_1764681137099_nwzjxdnzx', name: '구*원', maskedEmail: 'ja********@naver.com', amount: 45000, date: '2025-12-02 22:18:38', realEmail: 'ja********@naver.com' },
    { orderId: 'order_1764680971668_lja6pb5j2', name: '오*윤', maskedEmail: 'a0**********@gmail.com', amount: 45000, date: '2025-12-02 22:11:06', realEmail: 'a0**********@gmail.com' },
    
    // 최신 결제 - Step 1: AI 건물주 되기 기초 (2025-12-02 23시대)
    { orderId: 'order_1764685664803_8gkhjcrjg', name: '황*숙', maskedEmail: 'co****@naver.com', amount: 45000, date: '2025-12-02 23:30:59', realEmail: 'co****@naver.com' },
    { orderId: 'order_1764684382494_szs1kkbcf', name: '강*훈', maskedEmail: 'tw*******@naver.com', amount: 45000, date: '2025-12-02 23:11:08', realEmail: 'tw*******@naver.com' },
    { orderId: 'order_1764683670757_epyyff768', name: '이*솔', maskedEmail: 'y8****@naver.com', amount: 45000, date: '2025-12-02 22:56:41', realEmail: 'y8****@naver.com' },
    { orderId: 'order_1764681983209_4d6ea2oev', name: '이*미', maskedEmail: '80*-**-*3140', amount: 45000, date: '2025-12-02 22:28:03' },
    { orderId: 'order_1764681075960_2gt4ek8v3', name: '김*일', maskedEmail: 'gk*******@naver.com', amount: 45000, date: '2025-12-02 22:12:24', realEmail: 'gk*******@naver.com' },
    
    // 최신 카드 결제 - Step 1: AI 건물주 되기 기초 (2025-12-02 22시대)
    { orderId: 'order_1764680301776_a2nrca6ch', name: '김*현', maskedEmail: 'Jo**********@gmail.com', amount: 45000, date: '2025-12-02 22:02:51' },
    { orderId: 'order_1764680516296_soku1kczu', name: '신*영', maskedEmail: 'si*****@hanmail.net', amount: 45000, date: '2025-12-02 22:02:28' },
    { orderId: 'order_1764679858477_5dkbcg9wp', name: '송*현', maskedEmail: 'ji*********@gmail.com', amount: 45000, date: '2025-12-02 21:52:08' },
    { orderId: 'order_1764679276847_1oqxfcitt', name: '이*석', maskedEmail: 'fl*****@naver.com', amount: 45000, date: '2025-12-02 21:42:05' },
    { orderId: 'order_1764679218094_z4voss1db', name: '손*열', maskedEmail: 'ka******@gmail.com', amount: 45000, date: '2025-12-02 21:40:56' },
    { orderId: 'order_1764678752056_gftnbqaf7', name: '한*옥', maskedEmail: 're**********@gmail.com', amount: 45000, date: '2025-12-02 21:33:14' },
    { orderId: 'order_1764678462486_7171u829l', name: '최*순', maskedEmail: 'ga*****@naver.com', amount: 45000, date: '2025-12-02 21:29:18' },
    { orderId: 'order_1764678388989_nrpkkiclz', name: '장*란', maskedEmail: 'my********@gmail.com', amount: 45000, date: '2025-12-02 21:27:17' },
    { orderId: 'order_1764677749440_zfp5hpq0y', name: '이*복', maskedEmail: '10******@hanmail.net', amount: 45000, date: '2025-12-02 21:18:09' },
    { orderId: 'order_1764677373074_z2p8vwjgk', name: '심*람', maskedEmail: 'so******@gmail.com', amount: 45000, date: '2025-12-02 21:13:16' },
    { orderId: 'order_1764677209097_svgbddrjz', name: '장*희', maskedEmail: 'yh*******@gmail.com', amount: 45000, date: '2025-12-02 21:07:30' },
    { orderId: 'order_1764676933068_xqimca1kc', name: '조*영', maskedEmail: 'cl*********@gmail.com', amount: 45000, date: '2025-12-02 21:02:32' },
    { orderId: 'order_1764676792997_1u8mfao4k', name: '양*민', maskedEmail: 'ym****@naver.com', amount: 45000, date: '2025-12-02 21:01:33' },
    { orderId: 'order_1764676370811_wpkkpgwpb', name: '이*윤', maskedEmail: 'se*********@gmail.com', amount: 45000, date: '2025-12-02 20:53:16' },
    { orderId: 'order_1764676341926_5iczkz09j', name: '정*헌', maskedEmail: 'yu*****@naver.com', amount: 45000, date: '2025-12-02 20:52:59' },
    { orderId: 'order_1764676120076_lxre2ilmu', name: '강*영', maskedEmail: 'te*******@gmail.com', amount: 45000, date: '2025-12-02 20:52:28' },
    { orderId: 'order_1764676099103_li58fapps', name: '지*미', maskedEmail: 'ly*******@naver.com', amount: 45000, date: '2025-12-02 20:54:44', realEmail: 'ly*******@naver.com' },
    { orderId: 'order_1764675735278_o8ixm5bgi', name: '박*용', maskedEmail: 'ge*******@gmail.com', amount: 45000, date: '2025-12-02 20:42:49' },
    { orderId: 'order_1764675626438_jrpeai38i', name: '김*희', maskedEmail: 'sk*******@gmail.com', amount: 45000, date: '2025-12-02 20:42:37' },
    { orderId: 'order_1764675487689_hmq2tnsue', name: '엄*강', maskedEmail: 'ya***@naver.com', amount: 45000, date: '2025-12-02 20:39:59' },
    { orderId: 'order_1764674818992_2seqi2xr9', name: '김*향', maskedEmail: 'lo******@naver.com', amount: 45000, date: '2025-12-02 20:28:36' },
    { orderId: 'order_1764674706702_pdow060ip', name: '김*용', maskedEmail: 'kj*****@hanmail.net', amount: 45000, date: '2025-12-02 20:28:30', realEmail: 'kj*****@hanmail.net' },
    { orderId: 'order_1764673750891_9ahhpzu9q', name: '박*희', maskedEmail: 'gl********@gmail.com', amount: 45000, date: '2025-12-02 20:18:52' },

    // 에이전트 강의 (95,000원) - 2025-12-02
    { orderId: 'order_1764670477842_9l99g0rai', name: '성*석', maskedEmail: 'ji*********@naver.com', amount: 95000, date: '2025-12-02 19:17:47', realEmail: 'ji*********@naver.com' },
    { orderId: 'order_1764669913772_op54bbvfc', name: '정*경', maskedEmail: 'jd******@gmail.com', amount: 95000, date: '2025-12-02 19:07:33', realEmail: 'jd******@gmail.com' },
    { orderId: 'order_1764635745302_xpjugggh7', name: '김*희', maskedEmail: 'tn******@naver.com', amount: 95000, date: '2025-12-02 09:38:50', realEmail: 'tn******@naver.com' },
    { orderId: 'order_1764625311234_5f8e96p6p', name: '채*호', maskedEmail: 'dr****@naver.com', amount: 93026, date: '2025-12-02 06:42:58', realEmail: 'dr****@naver.com' },
    { orderId: 'order_1764612092048_guglqc2xh', name: '황*인', maskedEmail: 'hj***@hanmail.net', amount: 95000, date: '2025-12-02 03:16:04', realEmail: 'hj***@hanmail.net' },
    { orderId: 'order_1764605940471_19up8tj15', name: '김*현', maskedEmail: 'ki*******@gmail.com', amount: 95000, date: '2025-12-02 01:21:26', realEmail: 'ki*******@gmail.com' },

    // 에이전트 강의 (95,000원) - 2025-12-01
    { orderId: 'order_1764589052005_8nmukkigp', name: '박*왕', maskedEmail: '010****0703', amount: 95000, date: '2025-12-01 20:42:19' },
    { orderId: 'order_1764543943457_y4acofyun', name: '박*근', maskedEmail: '010****6843', amount: 95000, date: '2025-12-01 08:07:21' },

    // 에이전트 강의 (95,000원) - 2025-11-30
    { orderId: 'order_1764469024537_701erv89b', name: '이*현', maskedEmail: 'hi*******@naver.com', amount: 95000, date: '2025-11-30 11:19:11', realEmail: 'hi*******@naver.com' },

    // 에이전트 강의 (95,000원) - 2025-11-29
    { orderId: 'order_1764420904311_xstbmr8iy', name: 'pi***ig', maskedEmail: 'a8*******@gmail.com', amount: 95000, date: '2025-11-29 22:04:43', realEmail: 'a8*******@gmail.com' },
    { orderId: 'order_1764385980586_acpt8mo6s', name: '김*주', maskedEmail: 'cm******@gmail.com', amount: 95000, date: '2025-11-29 12:22:19', realEmail: 'cm******@gmail.com' },

    // 에이전트 강의 (95,000원) - 2025-11-28
    { orderId: 'order_1764339800290_y4ap8j034', name: '김*경', maskedEmail: 'an******@gmail.com', amount: 95000, date: '2025-11-28 23:34:54', realEmail: 'an******@gmail.com' },

    // 에이전트 강의 (95,000원) - 기존
    { orderId: 'order_1764675958635_jd7yufn7i', name: '이*윤', maskedEmail: 'se*********@gmail.com', amount: 95000, date: '2025-12-02 20:48:10' },

    // 최신 카드 결제 (2025-11-27 추가)
    { orderId: 'order_1764207441979_37281', name: '정*영', maskedEmail: 'wj******@naver.com', amount: 95000, date: '2025-11-27 10:37:21' },

    // 최신 카드 결제 (2025-11-26 추가)
    { orderId: 'order_1764121446064_s4d7cucoa', name: '한*옥', maskedEmail: 'h***@*****.com', amount: 95000, date: '2025-11-26 10:49:46' },

    // 최신 가상계좌 결제 (2025-11-24 추가 - 오후)
    { orderId: 'order_1763954823063_stx6gipkt', name: '박*덕', maskedEmail: 'hu****@gmail.com', amount: 95000, date: '2025-11-24 12:45:32' },

    // 최신 가상계좌 결제 (2025-11-23/24 추가 - 깊은 밤)
    { orderId: 'order_1763907050932_dtf2hhj3i', name: '전*헌', maskedEmail: 'yb**********@gmail.com', amount: 95000, date: '2025-11-23 23:13:06' },

    // 최신 가상계좌 결제 (2025-11-23 추가 - 저녁)
    { orderId: 'order_1763902409182_a1pr6d15e', name: '정*미', maskedEmail: 'ss*********@naver.com', amount: 95000, date: '2025-11-23 21:56:21' },
    { orderId: 'order_1763900075944_ra9jxdgye', name: '김*란', maskedEmail: 'ju****@nate.com', amount: 95000, date: '2025-11-23 21:16:22' },
    { orderId: 'order_1763896585623_pklai6a25', name: '김*균', maskedEmail: 'na********@naver.com', amount: 95000, date: '2025-11-23 22:12:29' },

    // 최신 가상계좌 결제 (2025-11-23 추가 - 오후)
    { orderId: 'order_1763878235980_96bc3l0rc', name: '박*현', maskedEmail: 'ma**************@gmail.com', amount: 95000, date: '2025-11-23 15:12:17' },
    { orderId: 'order_1763877730956_cpraori2p', name: '윤*원', maskedEmail: 'rm***@naver.com', amount: 95000, date: '2025-11-23 15:04:09' },
    { orderId: 'order_1763866743396_mdz8rp1h4', name: '조*옥', maskedEmail: 'cy*****@naver.com', amount: 95000, date: '2025-11-23 12:16:10' },

    // 최신 가상계좌 결제 (2025-11-23 추가 - 오전)
    { orderId: 'order_1763856058813_yqelfyz01', name: '김*', maskedEmail: 'kc******@naver.com', amount: 95000, date: '2025-11-23 09:03:52' },

    // 최신 가상계좌 결제 (2025-11-22/23 추가 - 깊은 밤)
    { orderId: 'order_1763823544460_hgx3suk55', name: '홍*원', maskedEmail: 'cl*******@naver.com', amount: 95000, date: '2025-11-23 00:41:07' },
    { orderId: 'order_1763816921505_7wy975t5t', name: '박*영', maskedEmail: 'mo******@gmail.com', amount: 95000, date: '2025-11-22 22:17:08' },
    { orderId: 'order_1763815878958_02t258ysx', name: '김*선', maskedEmail: 'ha*******@gmail.com', amount: 95000, date: '2025-11-22 21:54:51' },

    // 최신 가상계좌 결제 (2025-11-22 추가 - 저녁)
    { orderId: 'order_1763814216666_i8vb3v2qt', name: '추*수', maskedEmail: 'ko*********@gmail.com', amount: 95000, date: '2025-11-22 21:28:31' },

    // 최신 가상계좌 결제 (2025-11-22 추가)
    { orderId: 'order_1763775544431_6klcff4t0', name: '안*훈', maskedEmail: 'pi*************@gmail.com', amount: 95000, date: '2025-11-22 10:40:48' },
    { orderId: 'order_1763737564564_w1j5b529r', name: '윤*순', maskedEmail: 'g7****@naver.com', amount: 95000, date: '2025-11-22 00:35:21' },

    // 최신 가상계좌 결제 (2025-11-21 추가 - 저녁)
    { orderId: 'order_1763732223995_7bt087p57', name: '안*한', maskedEmail: 'ab*******@naver.com', amount: 95000, date: '2025-11-21 22:40:26' },
    { orderId: 'order_1763728213601_57nv5shgk', name: '최*', maskedEmail: 'rk*******@gmail.com', amount: 95000, date: '2025-11-21 21:38:10' },

    // 최신 가상계좌 결제 (2025-11-21 추가)
    { orderId: 'order_1763717917638_uybonn4cl', name: '권*문', maskedEmail: 'ja*******@kakao.com', amount: 95000, date: '2025-11-21 18:41:13' },
    { orderId: 'order_1763713902172_yzg66ddrp', name: '김*수', maskedEmail: 'al*****@naver.com', amount: 95000, date: '2025-11-21 17:33:37' },
    { orderId: 'order_1763712949403_fggf8awp7', name: '김*우', maskedEmail: 'ta****@naver.com', amount: 95000, date: '2025-11-21 17:17:30' },
    { orderId: 'order_1763684683639_2ye5vgkjl', name: '김*형', maskedEmail: 'km*****@naver.com', amount: 95000, date: '2025-11-21 09:25:06' },
    { orderId: 'order_1763661962359_blefd32a7', name: '이*솔', maskedEmail: 'y8****@naver.com', amount: 95000, date: '2025-11-21 03:08:09' },

    // 최신 가상계좌 결제 (2025-11-20 추가)
    { orderId: 'order_1763587437106_iyd7q2en0', name: '김*수', maskedEmail: 'js******@naver.com', amount: 95000, date: '2025-11-20 06:25:37' },
    { orderId: 'order_1763640001255_7cbcuqxpt', name: '김*아', maskedEmail: 'ke*****@naver.com', amount: 95000, date: '2025-11-20 21:02:04' },
    { orderId: 'order_1763638855409_be9z30z05', name: '김*공', maskedEmail: 'a0**********@gmail.com', amount: 95000, date: '2025-11-20 20:46:09' },
    { orderId: 'order_1763633513966_fk0z1xxl1', name: '조*균', maskedEmail: 'ej********@gmail.com', amount: 95000, date: '2025-11-20 19:20:08' },
    { orderId: 'order_1763632081834_lyuijb2vc', name: '윤*효', maskedEmail: 'la********@gmail.com', amount: 95000, date: '2025-11-20 18:49:50' },
    { orderId: 'order_1763638785785_bdfb5fxtl', name: '김*곤', maskedEmail: 'sa*******@naver.com', amount: 95000, date: '2025-11-20 20:51:45' },

    // 이전 가상계좌 결제 (2025-11-19)
    { orderId: 'order_1763538249272_x4nezsjcr', name: '전*근', maskedEmail: '29**@naver.com', amount: 95000, date: '2025-11-19 16:53:32' },
    { orderId: 'order_1763496158511_ikxrp7y0o', name: '봉*갑', maskedEmail: 'ka*****@gmail.com', amount: 95000, date: '2025-11-19 05:04:17' },

    // 이전 가상계좌 결제 (2025-11-18)
    { orderId: 'order_1763471208240_e3f13bwzd', name: '조*주', maskedEmail: 'wo******@naver.com', amount: 95000, date: '2025-11-18 22:08:12' },
    { orderId: 'order_1763468415179_nun9q7mog', name: '김*열', maskedEmail: 'kd****@naver.com', amount: 95000, date: '2025-11-18 21:33:07' },
    { orderId: 'order_1763463685894_i1rqtrzvk', name: '최*화', maskedEmail: 'bj*******@gmail.com', amount: 95000, date: '2025-11-18 20:02:49' },
    { orderId: 'order_1763457428837_f21kab6nb', name: '임*규', maskedEmail: 'so********@gmail.com', amount: 95000, date: '2025-11-18 18:18:24' },
    { orderId: 'order_1763446764506_57rqniisb', name: '조*원', maskedEmail: 'ha*****@daum.net', amount: 95000, date: '2025-11-18 15:21:19' },
    { orderId: 'order_1763444404660_z1rnzwhcm', name: '김*오', maskedEmail: 'kn*****@gmail.com', amount: 95000, date: '2025-11-18 14:42:22' },
    { orderId: 'order_1763414365144_y9dobb1fw', name: '윤*임', maskedEmail: 'ac******@gmail.com', amount: 45000, date: '2025-11-18 06:21:58' },

    // 최신 가상계좌 결제 (2025-11-17 오후 추가)
    { orderId: 'order_1763365930099_o0n4qnh7b', name: '김*미', maskedEmail: 'tu*********@gmail.com', amount: 45000, date: '2025-11-17 16:54:33' },
    { orderId: 'order_1763354116077_fi10wuo43', name: '한*선', maskedEmail: 'su******@gmail.com', amount: 95000, date: '2025-11-17 13:40:51' },
    { orderId: 'order_1763348709740_tzv3lc1fy', name: '임*애', maskedEmail: 'li*****@adullamcorp.com', amount: 95000, date: '2025-11-17 12:06:51' },

    // 최신 가상계좌 결제 (2025-11-17 새벽 추가)
    { orderId: 'order_1763317453848_vhm8vck18', name: '채*숙', maskedEmail: 'ki***************@gmail.com', amount: 45000, date: '2025-11-17 03:24:25' },
    { orderId: 'order_1763303800015_z7abipyer', name: '김*', maskedEmail: 'kc******@naver.com', amount: 45000, date: '2025-11-16 23:37:40' },

    // 최신 가상계좌 결제 (2025-11-16 밤 추가 - 3차)
    { orderId: 'order_1763298439550_3abgdf8mg', name: '이*현', maskedEmail: 'su**********@naver.com', amount: 45000, date: '2025-11-16 22:09:28' },
    { orderId: 'order_1763297190441_8oy3h7b5x', name: '오*란', maskedEmail: 'gr*******@naver.com', amount: 45000, date: '2025-11-16 21:50:56' },

    // 최신 가상계좌 결제 (2025-11-16 저녁 추가 - 2차)
    { orderId: 'order_1763290851025_8l13uqm3f', name: '김*홍', maskedEmail: 'qk*****@gmail.com', amount: 45000, date: '2025-11-16 20:42:40' },
    { orderId: 'order_1763275018004_wpk6e7wcz', name: '임*동', maskedEmail: 'ju*******@gmail.com', amount: 45000, date: '2025-11-16 15:48:29' },
    { orderId: 'order_1763272439291_l9x8sqvuc', name: '조*가', maskedEmail: 'ch********@naver.com', amount: 45000, date: '2025-11-16 15:00:05' },

    // 최신 가상계좌 결제 (2025-11-16 저녁 추가 - 추가분)
    { orderId: 'order_1763293801432_9knj53vxl', name: '고*석', maskedEmail: 'lg********@naver.com', amount: 45000, date: '2025-11-16 20:56:55' },
    { orderId: 'order_1763290352287_ztrtnsp80', name: '노*오', maskedEmail: 'em********@gmail.com', amount: 45000, date: '2025-11-16 19:57:35' },

    // 최신 가상계좌 결제 (2025-11-16 오후 추가)
    { orderId: 'order_1763269943321_lpg0r58xx', name: '류*림', maskedEmail: 'ho******@hanmail.net', amount: 45000, date: '2025-11-16 14:14:39' },
    { orderId: 'order_1763268376454_sr7wsqnfu', name: '박*정', maskedEmail: 'yo*****@naver.com', amount: 45000, date: '2025-11-16 13:54:12' },
    { orderId: 'order_1763267521122_875uke489', name: '방*운', maskedEmail: 'sa********@gmail.com', amount: 45000, date: '2025-11-16 13:33:59' },
    { orderId: 'order_1763267154071_jgj75nhpt', name: 'Se**********an', maskedEmail: 'oz********@gmail.com', amount: 45000, date: '2025-11-16 13:27:44' },

    // 최신 가상계좌 결제 (2025-11-16 오전 추가)
    { orderId: 'order_1763259373907_821zf8j6h', name: '대*', maskedEmail: 'da****@gmail.com', amount: 45000, date: '2025-11-16 11:28:52' },
    { orderId: 'order_1763221856237_k7hwd51r1', name: '김*란', maskedEmail: 'mr****@naver.com', amount: 45000, date: '2025-11-16 00:58:41' },

    // 가상계좌 결제 (2025-11-15 저녁 추가)
    { orderId: 'order_1763213606265_s21pctq2y', name: '김*열', maskedEmail: '', amount: 45000, date: '2025-11-15 22:40:17' },
    { orderId: 'order_1763213509053_kf0pkerx0', name: '구*철', maskedEmail: 'gu****@gmail.com', amount: 45000, date: '2025-11-15 22:36:11' },
    { orderId: 'order_1763205974492_13hjyumjn', name: '김*원', maskedEmail: 'ed*******@gmail.com', amount: 45000, date: '2025-11-15 20:29:08' },
    { orderId: 'order_1763190552420_vwo66ezv3', name: '양*석', maskedEmail: 'jj**********@gmail.com', amount: 45000, date: '2025-11-15 15:13:31' },
    { orderId: 'order_1763187060971_l7psrfhgm', name: '김*량', maskedEmail: 'ry*********@gmail.com', amount: 45000, date: '2025-11-15 14:32:00' },
    { orderId: 'order_1763184550490_6h1q7wdui', name: '최*경', maskedEmail: 'ch*******@hanmail.net', amount: 45000, date: '2025-11-15 14:29:05' },
    { orderId: 'order_1763184039257_hx4qgtr2q', name: '진*호', maskedEmail: 'ji*******@gmail.com', amount: 45000, date: '2025-11-15 12:08:28' },
    { orderId: 'order_1763176068866_1wy3ukbmm', name: '김*태', maskedEmail: 'on******@gmail.com', amount: 45000, date: '2025-11-15 06:35:02' },
    { orderId: 'order_1763155799967_oin9rfjds', name: '박*도', maskedEmail: 'sh*******@gmail.com', amount: 45000, date: '2025-11-15 02:21:44' },

    // 최신 가상계좌 결제 (2025-11-15 추가 - 63건 완료)
    { orderId: 'order_1763209616354_m6rd8xr80', name: '오*현', maskedEmail: 'os******@naver.com', amount: 45000, date: '2025-11-15 21:29:30' },
    { orderId: 'order_1763204300893_o78gzc57r', name: '권*훈', maskedEmail: 'sa******@naver.com', amount: 45000, date: '2025-11-15 20:02:11' },
    { orderId: 'order_1763200037845_d3tcv7hwt', name: '나**엘', maskedEmail: 'dy********@gmail.com', amount: 45000, date: '2025-11-15 18:51:57' },
    { orderId: 'order_1763186369109_cxphzz9cr', name: '배*경', maskedEmail: 'la****@naver.com', amount: 45000, date: '2025-11-15 18:35:37' },
    { orderId: 'order_1763190894180_rwupcn3v2', name: '김*용', maskedEmail: 'kj*****@hanmail.net', amount: 45000, date: '2025-11-15 16:18:05' },
    { orderId: 'order_1763187749726_paa5ezm9y', name: '이*희', maskedEmail: 'so******@naver.com', amount: 45000, date: '2025-11-15 15:26:04' },
    { orderId: 'order_1763182544875_8wc9ijrhj', name: '김*윤', maskedEmail: 'sk*****@naver.com', amount: 45000, date: '2025-11-15 13:57:17' },
    { orderId: 'order_1763179685516_1ibqjtwsz', name: '박*혁', maskedEmail: 'kb********@gmail.com', amount: 45000, date: '2025-11-15 13:14:29' },
    { orderId: 'order_1763176008537_i61vnvyj2', name: '조*회', maskedEmail: 'ch*********@daum.net', amount: 45000, date: '2025-11-15 12:09:30' },
    { orderId: 'order_1763131176354_3ljcbtg85', name: '함*수', maskedEmail: 'ye********@naver.com', amount: 45000, date: '2025-11-15 11:56:18' },
    { orderId: 'order_1763173038375_yga6j1u85', name: '이*호', maskedEmail: 'lk*****@naver.com', amount: 45000, date: '2025-11-15 11:18:28' },
    { orderId: 'order_1763172810432_ky1178cv3', name: '김*용', maskedEmail: 'kn*********@gmail.com', amount: 45000, date: '2025-11-15 11:15:53' },
    { orderId: 'order_1763165471379_phgrfd2db', name: '권*경', maskedEmail: 'bi*******@naver.com', amount: 45000, date: '2025-11-15 09:12:44' },
    { orderId: 'order_1763160549999_5h0kdi2ih', name: '김*화', maskedEmail: 'sh**********@naver.com', amount: 45000, date: '2025-11-15 07:51:27' },
    { orderId: 'order_1763141007765_kgxvqtib2', name: '유*', maskedEmail: 'rt*******@naver.com', amount: 45000, date: '2025-11-15 02:26:05' },
    { orderId: 'order_1763140041405_jd0zvw0f1', name: '구*원', maskedEmail: 'ja********@naver.com', amount: 45000, date: '2025-11-15 02:12:53' },
    { orderId: 'order_1763138004936_nsk04uuaa', name: '김*영', maskedEmail: 'gi*******@naver.com', amount: 45000, date: '2025-11-15 01:44:14' },
    { orderId: 'order_1763138358813_q9q2cld4o', name: '박*우', maskedEmail: 'da******@naver.com', amount: 45000, date: '2025-11-15 01:41:52' },
    { orderId: 'order_1763138027577_tckb9idii', name: '송*령', maskedEmail: 'sr******@gmail.com', amount: 45000, date: '2025-11-15 01:36:27' },
    { orderId: 'order_1763137615363_vdep7so59', name: '유*아', maskedEmail: 'eo***@naver.com', amount: 45000, date: '2025-11-15 01:28:15' },
    { orderId: 'order_1763136893900_tm4i4znvr', name: '표*규', maskedEmail: 'pn****@naver.com', amount: 45000, date: '2025-11-15 01:21:00' },
    { orderId: 'order_1763130376129_qcnfme87r', name: '윤*록', maskedEmail: 'yo**********@kakao.com', amount: 45000, date: '2025-11-14 23:27:21' },
    { orderId: 'order_1763028887929_xwikmij7q', name: '최*영', maskedEmail: 'th**********@gmail.com', amount: 45000, date: '2025-11-13 21:58:55' },
    { orderId: 'order_1762947956026_hjbr0zfra', name: '이*주', maskedEmail: 'za*******@naver.com', amount: 45000, date: '2025-11-12 22:31:25' },
    { orderId: 'order_1762694258374_zpyr2skqo', name: '아***딸', maskedEmail: 'kh*********@gmail.com', amount: 45000, date: '2025-11-09 22:28:33' },
    { orderId: 'order_1760460974354_dflgnw48v', name: '서*란', maskedEmail: 'ok*******@gmail.com', amount: 45000, date: '2025-10-15 02:02:33' },

    // 최신 카드 결제 (2025-11-15 밤 늦게 추가)
    { orderId: 'order_1763213606265_s21pctq2y', name: '김*열', maskedEmail: 'no-email', amount: 45000, date: '2025-11-15 22:40:17' },
    { orderId: 'order_1763213509053_kf0pkerx0', name: '구*철', maskedEmail: 'gu****@gmail.com', amount: 45000, date: '2025-11-15 22:36:11' },
    { orderId: 'order_1763205974492_13hjyumjn', name: '김*원', maskedEmail: 'ed*******@gmail.com', amount: 45000, date: '2025-11-15 20:29:08' },

    // 카드 결제 (2025-11-15 오후 추가)
    { orderId: 'order_1763187060971_l7psrfhgm', name: '양*석', maskedEmail: 'jj**********@gmail.com', amount: 45000, date: '2025-11-15 15:13:31' },
    { orderId: 'order_1763184550490_6h1q7wdui', name: '김*량', maskedEmail: 'ry*********@gmail.com', amount: 45000, date: '2025-11-15 14:32:00' },
    { orderId: 'order_1763184039257_hx4qgtr2q', name: '최*경', maskedEmail: 'ch*******@hanmail.net', amount: 45000, date: '2025-11-15 14:29:05' },

    // 카드 결제 (2025-11-15 오전)
    { orderId: 'order_1763146620326_eksp2awco', name: '김*식', maskedEmail: 'id******@naver.com', amount: 45000, date: '2025-11-15 03:57:26' },
    { orderId: 'order_1763142702036_8jh73lg8k', name: '이*훈', maskedEmail: 'so********@gmail.com', amount: 45000, date: '2025-11-15 02:52:50' },
    { orderId: 'order_1763140582868_wv4x2uw7j', name: '박*도', maskedEmail: 'sh*******@gmail.com', amount: 45000, date: '2025-11-15 02:21:44' },
    { orderId: 'order_1763137745397_paiqf71q9', name: '김*영', maskedEmail: 'gi*******@naver.com', amount: 45000, date: '2025-11-15 01:32:27' },
    { orderId: 'order_1763137302508_xdwv13rva', name: '이*미', maskedEmail: 'bo*****@naver.com', amount: 45000, date: '2025-11-15 01:25:24' },
    { orderId: 'order_1763142219298_jkablhyl2', name: '조*우', maskedEmail: 'rp*****@naver.com', amount: 45000, date: '2025-11-15 02:44:19', realEmail: 'rpflarh@naver.com' },
    { orderId: 'order_1763141726397_rq7qgvils', name: '고*웅', maskedEmail: 'da*****@naver.com', amount: 45000, date: '2025-11-15 02:39:22' },
    { orderId: 'order_1763141007765_kgxvqtib2', name: '유*', maskedEmail: 'rt*******@naver.com', amount: 45000, date: '2025-11-15 02:23:57' },
    { orderId: 'order_1763140041405_jd0zvw0f1', name: '구*원', maskedEmail: 'ja********@naver.com', amount: 45000, date: '2025-11-15 02:08:32' },
    { orderId: 'order_1763138358813_q9q2cld4o', name: '박*우', maskedEmail: 'da******@naver.com', amount: 45000, date: '2025-11-15 01:40:17' },
    { orderId: 'order_1763138004936_nsk04uuaa', name: '김*영', maskedEmail: 'gi*******@naver.com', amount: 45000, date: '2025-11-15 01:34:01' },
    { orderId: 'order_1763138027577_tckb9idii', name: '송*령', maskedEmail: 'sr******@gmail.com', amount: 45000, date: '2025-11-15 01:34:44' },
    { orderId: 'order_1763137615363_vdep7so59', name: '유*아', maskedEmail: 'eo***@naver.com', amount: 45000, date: '2025-11-15 01:27:34' },
    { orderId: 'order_1763135906666_2mb772b0d', name: '쥰*', maskedEmail: 'ap*******@gmail.com', amount: 45000, date: '2025-11-15 00:59:11' },
    { orderId: 'order_1763134963184_awygk7xrd', name: '박*성', maskedEmail: 'bu*****@naver.com', amount: 45000, date: '2025-11-15 00:44:57' },
    { orderId: 'order_1763134934252_o8mrw39um', name: '김*희', maskedEmail: 'ma******@naver.com', amount: 45000, date: '2025-11-15 00:42:44' },
    { orderId: 'order_1763134635174_rm3gbxyvd', name: '김*석', maskedEmail: 'ha******@gmail.com', amount: 45000, date: '2025-11-15 00:38:08' },
    { orderId: 'order_1763134582395_lzlvrfjrz', name: '김*주', maskedEmail: 'pe*******@gmail.com', amount: 45000, date: '2025-11-15 00:36:42' },
    { orderId: 'order_1763133581189_l8pabrkys', name: '배*승', maskedEmail: 'js*******@gmail.com', amount: 45000, date: '2025-11-15 00:20:45' },
    { orderId: 'order_1763133567233_6whgeil3v', name: '권*승', maskedEmail: 'fr**********@gmail.com', amount: 45000, date: '2025-11-15 00:20:27' },
    { orderId: 'order_1763132772876_2hr6ho7qa', name: '러*', maskedEmail: 'qp**********@naver.com', amount: 45000, date: '2025-11-15 00:13:09' },
    { orderId: 'order_1763133001219_myt8xdh90', name: '윤*미', maskedEmail: 'my*******@naver.com', amount: 45000, date: '2025-11-15 00:10:27' },
    { orderId: 'order_1763132816315_x71m7mpxa', name: '최*리', maskedEmail: 'yo*******@gmail.com', amount: 45000, date: '2025-11-15 00:08:02' },
    { orderId: 'order_1763132525010_t306zfbw8', name: '김*남', maskedEmail: 'rm*****@naver.com', amount: 45000, date: '2025-11-15 00:02:33' },
    { orderId: 'order_1763132392339_zf3lc492c', name: '이*규', maskedEmail: 'ai*********@gmail.com', amount: 45000, date: '2025-11-15 00:00:28' },
    { orderId: 'order_1763132202993_ez64fevoy', name: '안*혜', maskedEmail: 'an*********@gmail.com', amount: 45000, date: '2025-11-14 23:58:01' },
    { orderId: 'order_1763132121894_xqoar4cxz', name: '상*규', maskedEmail: 'pi******@gma.com', amount: 45000, date: '2025-11-14 23:57:28' },
    { orderId: 'order_1763131780228_k279wqdwf', name: '이*혁', maskedEmail: 'we*@dumy.co.kr', amount: 45000, date: '2025-11-14 23:50:18' },
    { orderId: 'order_1763131629560_komm430dm', name: '배*곤', maskedEmail: 'bu*****@gmail.com', amount: 45000, date: '2025-11-14 23:49:16' },
    { orderId: 'order_1763130851088_2xfupm5ku', name: '박*건', maskedEmail: 'al*****@naver.com', amount: 45000, date: '2025-11-14 23:45:15' },
    { orderId: 'order_1763131104524_qsxd85kl1', name: '이*숙', maskedEmail: 'si********@naver.com', amount: 45000, date: '2025-11-14 23:42:06' },
    { orderId: 'order_1763131263404_ze5tvqybj', name: '황*우', maskedEmail: 'ad****@naver.com', amount: 45000, date: '2025-11-14 23:41:49' },
    { orderId: 'order_1763131053083_23r35ty10', name: '김*정', maskedEmail: 'a3*******@gmail.com', amount: 45000, date: '2025-11-14 23:38:11' },
    { orderId: 'order_1763130959748_z16yqz9kn', name: '차*현', maskedEmail: 're*********@gmail.com', amount: 45000, date: '2025-11-14 23:36:51' },
    { orderId: 'order_1763130817297_tnep2j3h0', name: '조*영', maskedEmail: 'pa********@gmail.com', amount: 45000, date: '2025-11-14 23:34:28' },
    { orderId: 'order_1763129658781_jn6i6sgzu', name: '부*종', maskedEmail: 'go********@naver.com', amount: 45000, date: '2025-11-14 23:16:54' },
    { orderId: 'order_1763129554784_1j4zr27zc', name: '추*란', maskedEmail: 'sm*************@gmail.com', amount: 45000, date: '2025-11-14 23:13:34' },
    { orderId: 'order_1763129483293_bp5audbj2', name: '류*수', maskedEmail: 'bi******@gmail.com', amount: 45000, date: '2025-11-14 23:12:35' },
    { orderId: 'order_1763129200206_fmex8mdcj', name: '안*영', maskedEmail: 'jy********@naver.com', amount: 45000, date: '2025-11-14 23:07:20' },
    { orderId: 'order_1763128855375_33hi52bd0', name: '히********사', maskedEmail: 'hi*********@naver.com', amount: 45000, date: '2025-11-14 23:01:53' },
    { orderId: 'order_1763128495255_rbsyp1esy', name: '윤*순', maskedEmail: 'a0**********@gmail.com', amount: 45000, date: '2025-11-14 22:55:21' },
    { orderId: 'order_1763127873060_pg35yvjcn', name: '손*배', maskedEmail: 'mo******@hanmail.net', amount: 45000, date: '2025-11-14 22:45:46' },
    { orderId: 'order_1763127759802_tzqj72io5', name: '김*옥', maskedEmail: 'ba*******@naver.com', amount: 45000, date: '2025-11-14 22:43:57' },
    { orderId: 'order_1763127542333_1my99slrf', name: '유*식', maskedEmail: 'ko******@naver.com', amount: 45000, date: '2025-11-14 22:39:30' },
    { orderId: 'order_1763127413358_00pfmqubk', name: '김*태', maskedEmail: 'me**********@gmail.com', amount: 45000, date: '2025-11-14 22:37:28' },
    { orderId: 'order_1763127374575_k8su74bxy', name: '조*현', maskedEmail: 'li******@hanmail.net', amount: 45000, date: '2025-11-14 22:36:57' },
    { orderId: 'order_1763126907221_jyvexsq9s', name: '강*욱', maskedEmail: 'ye*****@gmail.com', amount: 45000, date: '2025-11-14 22:29:07' },
    { orderId: 'order_1763124658648_eeotk8rf3', name: '정*욱', maskedEmail: 'jj*****@naver.com', amount: 45000, date: '2025-11-14 21:52:06' },
    { orderId: 'order_1763123333008_9nz2njdkd', name: 'KI******NG', maskedEmail: 'to*********@gmail.com', amount: 45000, date: '2025-11-14 21:29:51' },
    { orderId: 'order_1763123019857_n5s0n0s7n', name: '이*훈', maskedEmail: '36*******@gmail.com', amount: 45000, date: '2025-11-14 21:27:31' },
    { orderId: 'order_1763123066442_x42r2jwl9', name: '윤*라', maskedEmail: 'pa********@gmail.com', amount: 45000, date: '2025-11-14 21:25:05' },
    { orderId: 'order_1763119397131_0dg1e91cv', name: '김*석', maskedEmail: 'hi******@gmail.com', amount: 45000, date: '2025-11-14 20:24:11' },
    { orderId: 'order_1763119170051_j61dr32l1', name: '이*철', maskedEmail: 'to*******@gmail.com', amount: 45000, date: '2025-11-14 20:19:51' },
    { orderId: 'order_1763047661084_rtbk4wihb', name: '최*숙', maskedEmail: 'ya********@gmail.com', amount: 45000, date: '2025-11-14 00:32:15' },
    { orderId: 'order_1762939345276_oxuhria0o', name: '유*균', maskedEmail: 'qs******@naver.com', amount: 45000, date: '2025-11-12 18:23:14' },
    { orderId: 'order_1762690778300_4bk0g6vd6', name: '김*훈', maskedEmail: 'a-*******@hanmail.net', amount: 45000, date: '2025-11-09 21:20:37' },
    { orderId: 'order_1762658395612_ryh95sg9c', name: '편*영', maskedEmail: 'ha*********@gmail.com', amount: 45000, date: '2025-11-09 12:21:13' },
    { orderId: 'order_1762629706579_6d2ixoa7d', name: '이*수', maskedEmail: 'do********@gmail.com', amount: 45000, date: '2025-11-09 04:28:26' },
    { orderId: 'order_1762562428186_umasl29e5', name: '장*건', maskedEmail: '57*****@gmail.com', amount: 45000, date: '2025-11-08 09:41:10' },
    { orderId: 'order_1762386790593_3kv1dru6s', name: '김*은', maskedEmail: 'je******@gmail.com', amount: 45000, date: '2025-11-06 08:54:57' },
    { orderId: 'order_1761542676217_a9nbyc297', name: '최*진', maskedEmail: 'yu*******@gmail.com', amount: 45000, date: '2025-10-27 14:25:39' },
    { orderId: 'order_1760971870005_c84c6pkhf', name: 'Ki********ng', maskedEmail: 'on******@naver.com', amount: 45000, date: '2025-10-20 23:52:24' },
    { orderId: 'order_1760667306688_lgjmk2s8t', name: '정*석', maskedEmail: 'js******@naver.com', amount: 45000, date: '2025-10-17 11:16:24' },
    { orderId: 'order_1760661392961_y8hwk51uj', name: '김*호', maskedEmail: 'ky****@gmail.com', amount: 45000, date: '2025-10-17 09:38:16' },
    { orderId: 'order_1760528102242_vejmj66ux', name: '차*정', maskedEmail: 'mi****@naver.com', amount: 45000, date: '2025-10-15 20:35:32' },
    { orderId: 'order_1760364259046_dp9frb7rf', name: '박*동', maskedEmail: 'in**@udmso.co.kr', amount: 45000, date: '2025-10-13 23:04:58' },
    { orderId: 'order_1760360347773_l3nr8es8x', name: '이*', maskedEmail: 'no**********@naver.com', amount: 45000, date: '2025-10-13 22:00:15' },
    { orderId: 'order_1760346338615_tawstmccv', name: 'te*****al', maskedEmail: 'te****@gmail.com', amount: 45000, date: '2025-10-13 18:07:22' },
    { orderId: 'order_1760287221737_cb3ay000m', name: '임*석', maskedEmail: 'ls*****@nate.com', amount: 45000, date: '2025-10-13 01:44:23' },
    { orderId: 'order_1763116242609_7jthp54jh', name: '최*규', maskedEmail: 'c.*******@gmail.com', amount: 45000, date: '2025-11-14 19:34:50' },
    { orderId: 'order_1762014535823_wngjbk4mx', name: '김*이', maskedEmail: 'bl*******@naver.com', amount: 45000, date: '2025-11-02 01:31:50' }
  ]);

  const [searchEmail, setSearchEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [editingEmail, setEditingEmail] = useState<{ oldEmail: string; newEmail: string } | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const userSession = sessionStorage.getItem('aicitybuilders_user_session');
      if (!userSession) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userSession);
      if (user.email !== 'test10@gmail.com') {
        alert('관리자 권한이 필요합니다.');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      setIsLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  const loadAllUsers = async () => {
    try {
      setIsLoading(true);
      const users = await AzureTableService.getAllUsers();
      setAllUsers(users);
      setShowUserTable(true);
      setIsLoading(false);
    } catch (error) {
      console.error('사용자 로드 실패:', error);
      alert('사용자 목록을 불러올 수 없습니다.');
      setIsLoading(false);
    }
  };

  // 이메일 수정 함수
  const handleUpdateEmail = async (oldEmail: string, newEmail: string) => {
    if (!window.confirm(`정말로 이메일을 변경하시겠습니까?\n\n기존: ${oldEmail}\n새 이메일: ${newEmail}\n\n⚠️ 주의: 이 작업은 되돌릴 수 없습니다!`)) {
      return;
    }

    try {
      setProcessing(true);

      // 1. 기존 사용자 데이터 가져오기
      const oldUser = await AzureTableService.getUserByEmail(oldEmail);
      if (!oldUser) {
        alert('기존 사용자를 찾을 수 없습니다.');
        setProcessing(false);
        return;
      }

      // 2. 새 이메일로 이미 가입된 계정이 있는지 확인
      const existingUser = await AzureTableService.getUserByEmail(newEmail);
      if (existingUser) {
        alert('새 이메일 주소는 이미 사용 중입니다.');
        setProcessing(false);
        return;
      }

      // 3. 새 이메일로 사용자 생성 (직접 저장)
      const newUserData: any = {
        PartitionKey: 'users',
        RowKey: newEmail,
        email: newEmail,
        name: oldUser.name,
        phone: oldUser.phone || '',
        passwordHash: oldUser.passwordHash,
        emailVerified: oldUser.emailVerified || false,
        marketingAgreed: oldUser.marketingAgreed || false,
        createdAt: oldUser.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enrolledCourses: oldUser.enrolledCourses || '',
        referralCode: oldUser.referralCode || '',
        referredBy: oldUser.referredBy || '',
        totalEnrolledCourses: oldUser.totalEnrolledCourses || 0,
        completedCourses: oldUser.completedCourses || 0,
        totalLearningTimeMinutes: oldUser.totalLearningTimeMinutes || 0,
        totalRewards: oldUser.totalRewards || 0,
        pendingRewards: oldUser.pendingRewards || 0,
        rewardHistory: oldUser.rewardHistory || '[]',
        referralCount: oldUser.referralCount || 0,
        referralStats: oldUser.referralStats || '{"totalReferrals":0,"activePurchasers":0,"totalRewardEarned":0,"thisMonthRewards":0,"topReferralMonth":""}'
      };

      await AzureTableService.createUserDirect(newUserData);

      alert(`✅ 이메일이 성공적으로 변경되었습니다!\n\n${oldEmail} → ${newEmail}\n\n사용자에게 새 이메일(${newEmail})로 로그인하라고 안내해주세요.\n\n⚠️ 중요: 기존 이메일(${oldEmail})로는 더 이상 로그인할 수 없습니다.`);

      // 4. 사용자 목록 새로고침
      await loadAllUsers();

    } catch (error) {
      console.error('이메일 변경 실패:', error);
      alert('이메일 변경에 실패했습니다. 다시 시도해주세요.\n\n에러: ' + (error as Error).message);
    } finally {
      setProcessing(false);
      setEditingEmail(null);
    }
  };

  // 마스킹된 이메일과 실제 이메일 매칭 (퍼지 매칭)
  const matchMaskedEmail = (maskedEmail: string, realEmail: string): boolean => {
    if (maskedEmail === 'no-email') return false;

    const [maskedLocal, maskedDomain] = maskedEmail.split('@');
    const [realLocal, realDomain] = realEmail.toLowerCase().split('@');

    // 도메인 비교 (대소문자 무시)
    if (maskedDomain.toLowerCase() !== realDomain) return false;

    // 로컬 부분 비교
    const maskedChars = maskedLocal.split('');
    const realChars = realLocal.split('');

    // 길이가 다르면 false
    if (maskedChars.length !== realChars.length) return false;

    // 각 문자 비교 (대소문자 무시)
    for (let i = 0; i < maskedChars.length; i++) {
      if (maskedChars[i] !== '*' && maskedChars[i].toLowerCase() !== realChars[i].toLowerCase()) {
        return false;
      }
    }

    return true;
  };

  // 마스킹된 이름과 실제 이름 매칭
  const matchMaskedName = (maskedName: string, realName: string): boolean => {
    if (!maskedName || !realName) return false;

    // 이름에서 *를 제거하고 남은 문자들의 위치 확인
    const maskedChars = maskedName.split('');
    const realChars = realName.split('');

    // 길이가 다르면 false
    if (maskedChars.length !== realChars.length) return false;

    // 각 문자 비교
    for (let i = 0; i < maskedChars.length; i++) {
      if (maskedChars[i] !== '*' && maskedChars[i] !== realChars[i]) {
        return false;
      }
    }

    return true;
  };

  // 향상된 자동 매칭 (이메일 + 이름)
  const findBestMatch = (payment: Payment, users: any[]): any | null => {
    // 1단계: realEmail이 있으면 정확히 매칭
    if (payment.realEmail) {
      const exactMatch = users.find(u => u.email?.toLowerCase() === payment.realEmail?.toLowerCase());
      if (exactMatch) return exactMatch;
    }

    // 2단계: 이메일 패턴 매칭
    const emailMatches = users.filter(user =>
      user.email && matchMaskedEmail(payment.maskedEmail, user.email)
    );

    if (emailMatches.length === 0) return null;
    if (emailMatches.length === 1) return emailMatches[0];

    // 3단계: 이메일 매칭이 여러 개면 이름으로 추가 필터링
    const nameAndEmailMatches = emailMatches.filter(user =>
      user.name && matchMaskedName(payment.name, user.name)
    );

    if (nameAndEmailMatches.length === 1) return nameAndEmailMatches[0];

    // 4단계: 여전히 여러 개면 첫 번째 반환 (가장 최근 가입자)
    return emailMatches[0];
  };

  // 자동 매칭 및 일괄 추가
  const handleAutoMatch = async () => {
    if (!window.confirm(`결제 내역과 사용자를 자동 매칭하여 강의를 추가하시겠습니까?\n\n예상 매칭 수: 약 60건`)) {
      return;
    }

    setProcessing(true);
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;
    const matchLog: string[] = [];

    try {
      // 사용자 목록이 없으면 로드
      let users = allUsers;
      if (users.length === 0) {
        users = await AzureTableService.getAllUsers();
        setAllUsers(users);
      }

      // 각 결제 내역에 대해
      for (const payment of payments) {
        try {
          console.log(`\n🔍 처리 중: ${payment.name} (${payment.maskedEmail})`);

          // 향상된 자동 매칭 사용 (이름 + 이메일)
          const matchedUser = findBestMatch(payment, users);

          if (!matchedUser) {
            console.log(`❌ 매칭 실패: ${payment.name} (${payment.maskedEmail})`);
            skipCount++;
            matchLog.push(`❌ ${payment.name} (${payment.maskedEmail}) - 매칭 실패`);
            continue;
          }

          console.log(`✅ 매칭 성공: ${payment.name} (${payment.maskedEmail}) → ${matchedUser.name} (${matchedUser.email})`);
          matchLog.push(`✅ ${payment.name}: ${payment.maskedEmail} → ${matchedUser.name} (${matchedUser.email})`);

          // 결제 금액에 따라 강의 결정
          const isAIBuildingCourse = payment.amount === 45000;
          const courseId = isAIBuildingCourse ? 'ai-building-course' : '1002';
          const courseTitle = isAIBuildingCourse ? 'Step 1: AI 건물주 되기 기초' : 'Google Opal 유튜브 수익화 에이전트 기초';

          // 이미 강의가 있는지 확인
          if (matchedUser.enrolledCourses) {
            const enrolledData = JSON.parse(matchedUser.enrolledCourses);
            const enrollments = Array.isArray(enrolledData) ? enrolledData : (enrolledData.enrollments || []);
            const alreadyHasCourse = enrollments.some((e: any) => {
              if (isAIBuildingCourse) {
                return e.courseId === '999' || e.courseId === 'ai-building-course';
              } else {
                return e.courseId === '1002' || e.courseId === 'chatgpt-agent-beginner' || e.courseId === 'workflow-automation';
              }
            });

            if (alreadyHasCourse) {
              console.log(`ℹ️ 이미 등록됨: ${matchedUser.email} - ${courseTitle}`);
              skipCount++;
              matchLog.push(`  ℹ️ 건너뜀 (이미 등록됨)`);
              continue;
            }
          }

          // 강의 추가
          await AzureTableService.addPurchaseAndEnrollmentToUser({
            email: matchedUser.email,
            courseId: courseId,
            title: courseTitle,
            amount: payment.amount,
            paymentMethod: 'card',
            orderId: payment.orderId,
            orderName: courseTitle
          });

          console.log(`✅ 강의 추가 완료: ${matchedUser.email}`);
          matchLog.push(`  ✅ 강의 추가 완료`);
          successCount++;

          // API 제한 방지
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error: any) {
          console.error(`❌ 오류: ${payment.name} - ${error.message}`);
          failCount++;
          matchLog.push(`❌ ${payment.name} - 오류: ${error.message}`);
        }
      }

      // 결과 출력
      console.log('\n\n📊 자동 매칭 결과:');
      console.log(`✅ 성공: ${successCount}건`);
      console.log(`ℹ️ 건너뜀: ${skipCount}건`);
      console.log(`❌ 실패: ${failCount}건`);
      console.log('\n📋 상세 로그:');
      matchLog.forEach(log => console.log(log));

      alert(`자동 매칭 완료!\n\n✅ 성공: ${successCount}건\nℹ️ 건너뜀: ${skipCount}건\n❌ 실패: ${failCount}건\n\n자세한 내용은 콘솔(F12)을 확인하세요.`);

      // 사용자 목록 새로고침
      await loadAllUsers();

    } catch (error: any) {
      console.error('자동 매칭 중 오류:', error);
      alert(`오류 발생: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleEmailChange = (index: number, email: string) => {
    const newPayments = [...payments];
    newPayments[index].realEmail = email;
    setPayments(newPayments);
  };

  const handleAddEnrollment = async (index: number) => {
    const payment = payments[index];

    if (!payment.realEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }

    const newPayments = [...payments];
    newPayments[index].status = 'processing';
    setPayments(newPayments);

    try {
      // 사용자 확인
      const user = await AzureTableService.getUserByEmail(payment.realEmail);

      if (!user) {
        newPayments[index].status = 'error';
        newPayments[index].message = '사용자를 찾을 수 없습니다';
        setPayments(newPayments);
        return;
      }

      // 결제 금액에 따라 강의 결정
      const isAIBuildingCourse = payment.amount === 45000;
      const courseId = isAIBuildingCourse ? 'ai-building-course' : '1002';
      const courseTitle = isAIBuildingCourse ? 'Step 1: AI 건물주 되기 기초' : 'Google Opal 유튜브 수익화 에이전트 기초';

      // 이미 등록되어 있는지 확인
      if (user.enrolledCourses) {
        const userData = JSON.parse(user.enrolledCourses);
        const enrollments = Array.isArray(userData) ? userData : (userData.enrollments || []);
        const alreadyEnrolled = enrollments.some((e: any) => {
          if (isAIBuildingCourse) {
            return e.courseId === '999' || e.courseId === 'ai-building-course';
          } else {
            return e.courseId === '1002' || e.courseId === 'chatgpt-agent-beginner' || e.courseId === 'workflow-automation';
          }
        });

        if (alreadyEnrolled) {
          newPayments[index].status = 'skip';
          newPayments[index].message = `이미 ${courseTitle} 등록됨`;
          setPayments(newPayments);
          return;
        }
      }

      // 강의 추가
      await AzureTableService.addPurchaseAndEnrollmentToUser({
        email: payment.realEmail,
        courseId: courseId,
        title: courseTitle,
        amount: payment.amount,
        paymentMethod: 'card',
        orderId: payment.orderId,
        orderName: courseTitle
      });

      newPayments[index].status = 'success';
      newPayments[index].message = '✅ 등록 완료!';
      setPayments(newPayments);

    } catch (error: any) {
      newPayments[index].status = 'error';
      newPayments[index].message = error.message || '오류 발생';
      setPayments(newPayments);
    }
  };

  const handleBatchProcess = async () => {
    if (!window.confirm(`${payments.filter(p => p.realEmail && !p.status).length}개 항목을 일괄 처리하시겠습니까?`)) {
      return;
    }

    setProcessing(true);

    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i];

      // 이메일이 있고 아직 처리되지 않은 항목만
      if (payment.realEmail && !payment.status) {
        await handleAddEnrollment(i);
        // API 제한 방지
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setProcessing(false);
    alert('일괄 처리가 완료되었습니다!');
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Loader size={48} className="animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'success').length,
    skipped: payments.filter(p => p.status === 'skip').length,
    errors: payments.filter(p => p.status === 'error').length,
    pending: payments.filter(p => p.realEmail && !p.status).length
  };

  return (
    <div className="masterclass-container" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <NavigationBar onBack={() => navigate('/')} breadcrumbText="관리자 - 수강 정보 수정" />

      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 헤더 */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '10px' }}>
            🔧 수강 정보 일괄 수정
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            결제는 완료되었지만 enrolledCourses가 없는 사용자들에게 강의를 추가합니다
          </p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={loadAllUsers}
              disabled={processing}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: processing ? '#94a3b8' : 'white',
                color: '#ef4444',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: processing ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              📋 모든 사용자 보기 ({allUsers.length})
            </button>
            {showUserTable && (
              <button
                onClick={() => setShowUserTable(false)}
                disabled={processing}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: processing ? 'not-allowed' : 'pointer'
                }}
              >
                📊 결제 내역 보기
              </button>
            )}
            <button
              onClick={handleAutoMatch}
              disabled={processing}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: processing ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: processing ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {processing && <Loader size={16} className="animate-spin" />}
              {processing ? '처리 중...' : '🤖 자동 매칭 & 일괄 추가'}
            </button>
          </div>
        </div>

        {/* 통계 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>전체</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats.total}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>완료</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>{stats.completed}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>건너뜀</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>{stats.skipped}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>오류</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>{stats.errors}</div>
          </div>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>대기중</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0ea5e9' }}>{stats.pending}</div>
          </div>
        </div>

        {/* 사용자 테이블 */}
        {showUserTable && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>
              👥 전체 사용자 ({allUsers.length}명)
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>이름</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>이메일</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>가입일</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>수강 강의</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers
                    .filter(u => !searchEmail || u.email?.includes(searchEmail) || u.name?.includes(searchEmail))
                    .map((user, index) => {
                      const enrolledData = user.enrolledCourses ? JSON.parse(user.enrolledCourses) : null;
                      const enrollments = Array.isArray(enrolledData) ? enrolledData : (enrolledData?.enrollments || []);
                      const hasCourse = enrollments.some((e: any) =>
                        e.courseId === '1002' ||
                        e.courseId === 'chatgpt-agent-beginner' ||
                        e.courseId === 'workflow-automation'
                      );
                      const hasAIBuildingCourse = enrollments.some((e: any) =>
                        e.courseId === '999' ||
                        e.courseId === 'ai-building-course'
                      );

                      return (
                        <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px' }}>{user.name || '-'}</td>
                          <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                            {user.email}
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.85rem', color: '#64748b' }}>
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {hasCourse && (
                                <span style={{
                                  color: '#10b981',
                                  background: '#f0fdf4',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  display: 'inline-block'
                                }}>
                                  ✓ AI Agent 비기너
                                </span>
                              )}
                              {hasAIBuildingCourse && (
                                <span style={{
                                  color: '#3b82f6',
                                  background: '#eff6ff',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  display: 'inline-block'
                                }}>
                                  ✓ AI 건물주 되기
                                </span>
                              )}
                              {!hasCourse && !hasAIBuildingCourse && (
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>없음</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {editingEmail?.oldEmail === user.email && editingEmail ? (
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                  type="email"
                                  value={editingEmail.newEmail}
                                  onChange={(e) => setEditingEmail({ oldEmail: editingEmail.oldEmail, newEmail: e.target.value })}
                                  placeholder="새 이메일"
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #0ea5e9',
                                    fontSize: '0.85rem',
                                    width: '200px'
                                  }}
                                />
                                <button
                                  onClick={() => handleUpdateEmail(editingEmail.oldEmail, editingEmail.newEmail)}
                                  disabled={!editingEmail.newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingEmail.newEmail)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: 'white',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  ✓ 저장
                                </button>
                                <button
                                  onClick={() => setEditingEmail(null)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    color: '#64748b',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  취소
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingEmail({ oldEmail: user.email, newEmail: '' })}
                                  disabled={processing}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #0ea5e9',
                                    background: 'white',
                                    color: '#0ea5e9',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  ✏️ 이메일 수정
                                </button>
                                {!hasCourse && (
                                  <button
                                    onClick={async () => {
                                      if (!window.confirm(`${user.name || user.email}에게 강의를 추가하시겠습니까?`)) return;

                                      try {
                                        await AzureTableService.addPurchaseAndEnrollmentToUser({
                                          email: user.email,
                                          courseId: '1002',
                                          title: 'Google Opal 유튜브 수익화 에이전트 기초',
                                          amount: 45000,
                                          paymentMethod: 'card',
                                          orderId: `manual_${Date.now()}`,
                                          orderName: 'Google Opal 유튜브 수익화 에이전트 기초'
                                        });
                                        alert('강의가 추가되었습니다!');
                                        loadAllUsers(); // 새로고침
                                      } catch (error: any) {
                                        alert(`오류: ${error.message}`);
                                      }
                                    }}
                                    style={{
                                      padding: '6px 14px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                      color: 'white',
                                      fontSize: '0.85rem',
                                      fontWeight: '600',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    강의 추가
                                  </button>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 일괄 처리 버튼 */}
        {!showUserTable && stats.pending > 0 && (
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <button
              onClick={handleBatchProcess}
              disabled={processing}
              style={{
                padding: '15px 40px',
                borderRadius: '12px',
                border: 'none',
                background: processing ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: processing ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '0 auto'
              }}
            >
              {processing && <Loader size={20} className="animate-spin" />}
              {processing ? '처리 중...' : `🚀 일괄 처리 (${stats.pending}건)`}
            </button>
          </div>
        )}

        {/* 결제 목록 */}
        {!showUserTable && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="이메일로 검색..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>이름</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>마스킹 이메일</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>실제 이메일</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>날짜</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>상태</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: '#64748b' }}>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {payments
                    .filter(p => !searchEmail || p.realEmail?.includes(searchEmail) || p.maskedEmail.includes(searchEmail) || p.name.includes(searchEmail))
                    .map((payment, index) => (
                      <tr key={payment.orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px' }}>{payment.name}</td>
                        <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.9rem' }}>{payment.maskedEmail}</td>
                        <td style={{ padding: '12px' }}>
                          <input
                            type="email"
                            value={payment.realEmail || ''}
                            onChange={(e) => handleEmailChange(index, e.target.value)}
                            placeholder="실제 이메일 입력"
                            disabled={!!payment.status}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              fontSize: '0.9rem',
                              width: '100%',
                              maxWidth: '300px',
                              background: payment.status ? '#f8fafc' : 'white'
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.85rem', color: '#64748b' }}>
                          {payment.date.split(' ')[0]}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {payment.status === 'success' && (
                            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <CheckCircle size={16} /> 완료
                            </span>
                          )}
                          {payment.status === 'error' && (
                            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <AlertCircle size={16} /> 오류
                            </span>
                          )}
                          {payment.status === 'skip' && (
                            <span style={{ color: '#f59e0b' }}>건너뜀</span>
                          )}
                          {payment.status === 'processing' && (
                            <span style={{ color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Loader size={16} className="animate-spin" /> 처리중
                            </span>
                          )}
                          {!payment.status && payment.realEmail && (
                            <span style={{ color: '#0ea5e9' }}>대기중</span>
                          )}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {!payment.status && (
                            <button
                              onClick={() => handleAddEnrollment(index)}
                              disabled={!payment.realEmail}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                background: payment.realEmail ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#e2e8f0',
                                color: payment.realEmail ? 'white' : '#94a3b8',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: payment.realEmail ? 'pointer' : 'not-allowed'
                              }}
                            >
                              추가
                            </button>
                          )}
                          {payment.message && (
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '5px' }}>
                              {payment.message}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnrollmentFixPage;

