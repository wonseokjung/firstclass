/**
 * 에스크로 배송완료 일괄 등록 페이지
 * 
 * ⚠️ 이 페이지는 로컬에서만 사용! git에 올리지 마세요!
 * 상점키가 노출되면 안 됩니다.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';
import * as XLSX from 'xlsx';

interface EscrowOrder {
  oid: string;
  rcvname: string;
  rcvdate: string;
  amount: number;
  product: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  message?: string;
}


// 날짜 포맷 변환
function formatDate(dateStr: string | number): string {
  if (!dateStr) return '202512211200';
  
  let date: Date;
  if (typeof dateStr === 'number') {
    date = new Date((dateStr - 25569) * 86400 * 1000);
  } else {
    date = new Date(dateStr);
  }
  
  if (isNaN(date.getTime())) return '202512211200';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}${hour}${min}`;
}

const EscrowBatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [mertKey, setMertKey] = useState('');
  const [orders, setOrders] = useState<EscrowOrder[]>([]);

  // 엑셀 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const parsedOrders: EscrowOrder[] = jsonData
          .filter((row: any) => row['주문번호']?.startsWith('order_'))
          .map((row: any) => ({
            oid: row['주문번호'],
            rcvname: (row['구매자명'] || '구매자').replace(/\*/g, ''),
            rcvdate: formatDate(row['결제일시']),
            amount: row['금액'] || 0,
            product: row['구매상품'] || '',
            status: 'pending' as const
          }));

        setOrders(parsedOrders);
        alert(`✅ ${parsedOrders.length}건의 주문을 불러왔습니다!`);
      } catch (error) {
        alert('❌ 엑셀 파일 읽기 실패');
        console.error(error);
      }
    };
    reader.readAsBinaryString(file);
  };

  // 스크립트 생성 (CORS 우회용)
  const generateScript = () => {
    if (!mertKey) {
      alert('⚠️ 상점키를 입력해주세요!');
      return;
    }

    const script = `
/**
 * 에스크로 일괄 등록 스크립트
 * 터미널에서 실행: node escrow-run.js
 */
const crypto = require('crypto');
const https = require('https');

const MID = 'clathou1x0';
const MERT_KEY = '${mertKey}';

const orders = ${JSON.stringify(orders.map(o => ({
      oid: o.oid,
      rcvname: o.rcvname,
      rcvdate: o.rcvdate
    })), null, 2)};

function createMD5Hash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

async function registerOrder(order) {
  return new Promise((resolve) => {
    const dlvtype = '01';
    const hashdata = createMD5Hash(MID + order.oid + dlvtype + order.rcvdate + MERT_KEY);
    
    const params = new URLSearchParams({
      mid: MID, oid: order.oid, dlvtype, rcvdate: order.rcvdate,
      rcvname: order.rcvname, rcvrelation: '본인', hashdata
    });
    
    const req = https.request({
      hostname: 'pgweb.tosspayments.com', port: 443,
      path: '/pg/wmp/mertadmin/jsp/escrow/rcvdlvinfo.jsp',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log(order.oid, data.includes('OK') ? '✅ 성공' : '❌ 실패: ' + data);
        resolve(data);
      });
    });
    req.write(params.toString());
    req.end();
  });
}

(async () => {
  console.log('🚀 ${orders.length}건 처리 시작');
  for (const o of orders) {
    await registerOrder(o);
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('✅ 완료!');
})();
`;

    // 스크립트를 클립보드에 복사
    navigator.clipboard.writeText(script);
    alert('📋 스크립트가 클립보드에 복사되었습니다!\n\n1. escrow-run.js 파일로 저장\n2. node escrow-run.js 실행');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white' }}>
      <NavigationBar onBack={() => navigate('/admin/fix-enrollments')} breadcrumbText="에스크로 일괄 등록" />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
          📦 에스크로 배송완료 일괄 등록
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>
          토스페이먼츠 에스크로 결제 건을 일괄로 "배송완료" 처리합니다.
        </p>

        {/* Step 1: 상점키 입력 */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '20px',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
            🔑 Step 1: 상점키 입력
          </h2>
          <input
            type="password"
            value={mertKey}
            onChange={(e) => setMertKey(e.target.value)}
            placeholder="토스페이먼츠 상점키 (MERT_KEY)"
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '1rem',
              background: 'rgba(255,255,255,0.1)',
              color: 'white'
            }}
          />
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '10px' }}>
            💡 상점관리자 → 상점정보 → 상점키에서 확인
          </p>
        </div>

        {/* Step 2: 엑셀 업로드 */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.2)',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '20px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
            📂 Step 2: 엑셀 파일 업로드
          </h2>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            style={{
              padding: '15px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '10px',
              width: '100%',
              color: 'white'
            }}
          />
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '10px' }}>
            💡 토스 상점관리자 → 에스크로 조회 → 엑셀 다운로드
          </p>
        </div>

        {/* 주문 목록 */}
        {orders.length > 0 && (
          <div style={{
            background: 'rgba(251, 191, 36, 0.2)',
            borderRadius: '16px',
            padding: '25px',
            marginBottom: '20px',
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
              📋 Step 3: 주문 확인 ({orders.length}건)
            </h2>
            
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '10px',
              padding: '15px'
            }}>
              <table style={{ width: '100%', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>주문번호</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>구매자</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>금액</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>상품</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 20).map((order, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {order.oid.substring(0, 25)}...
                      </td>
                      <td style={{ padding: '8px' }}>{order.rcvname}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>
                        {order.amount.toLocaleString()}원
                      </td>
                      <td style={{ padding: '8px', fontSize: '0.75rem' }}>
                        {order.product.substring(0, 20)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length > 20 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '10px' }}>
                  ... 외 {orders.length - 20}건 더
                </p>
              )}
            </div>

            {/* 실행 버튼 */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
              <button
                onClick={generateScript}
                disabled={!mertKey || orders.length === 0}
                style={{
                  flex: 1,
                  padding: '15px 30px',
                  borderRadius: '12px',
                  border: 'none',
                  background: mertKey ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#475569',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: mertKey ? 'pointer' : 'not-allowed'
                }}
              >
                🚀 스크립트 생성 & 복사
              </button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '15px', textAlign: 'center' }}>
              💡 CORS 제한으로 브라우저에서 직접 실행 불가 → 스크립트로 터미널에서 실행
            </p>
          </div>
        )}

        {/* 사용 방법 */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '25px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>📖 사용 방법</h2>
          <ol style={{ color: '#94a3b8', lineHeight: '2', paddingLeft: '20px' }}>
            <li>토스 상점관리자에서 <strong>상점키</strong> 확인 → 위에 입력</li>
            <li>토스 상점관리자 → 에스크로 조회 → <strong>엑셀 다운로드</strong></li>
            <li>위에 엑셀 파일 업로드</li>
            <li><strong>"스크립트 생성"</strong> 버튼 클릭</li>
            <li>복사된 스크립트를 <code>escrow-run.js</code>로 저장</li>
            <li>터미널에서 <code>node escrow-run.js</code> 실행</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default EscrowBatchPage;

