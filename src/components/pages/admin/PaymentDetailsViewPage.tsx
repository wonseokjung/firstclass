import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Download, Search } from 'lucide-react';

interface PaymentDetail {
  orderId: string;
  paymentKey: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  method: string;
  amount: number;
  status: string;
  virtualAccount: {
    accountNumber: string;
    bank: string;
    customerName: string;
    dueDate: string;
  } | null;
  approvedAt: string;
  savedAt: string;
}

interface PaymentDetailsViewPageProps {
  onBack: () => void;
}

const PaymentDetailsViewPage: React.FC<PaymentDetailsViewPageProps> = ({ onBack }) => {
  const [payments, setPayments] = useState<PaymentDetail[]>([]);
  const [copiedField, setCopiedField] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');

  useEffect(() => {
    loadPaymentDetails();
  }, []);

  const loadPaymentDetails = () => {
    try {
      const allPayments = localStorage.getItem('all_payment_details');
      if (allPayments) {
        const paymentsList = JSON.parse(allPayments);
        setPayments(paymentsList);
        console.log('✅ 결제 내역 로드 완료:', paymentsList.length, '건');
      } else {
        console.log('ℹ️ 저장된 결제 내역이 없습니다');
      }
    } catch (error) {
      console.error('❌ 결제 내역 로드 실패:', error);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const downloadCSV = () => {
    const headers = ['주문번호', '결제키', '고객명', '이메일', '전화번호', '결제수단', '금액', '상태', '입금자명', '은행', '계좌번호', '입금기한', '승인시간'];
    const rows = filteredPayments.map(p => [
      p.orderId,
      p.paymentKey,
      p.customerName,
      p.customerEmail,
      p.customerPhone,
      p.method,
      p.amount,
      p.status,
      p.virtualAccount?.customerName || '-',
      p.virtualAccount?.bank || '-',
      p.virtualAccount?.accountNumber || '-',
      p.virtualAccount?.dueDate || '-',
      p.approvedAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payment_details_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const clearAllData = () => {
    if (window.confirm('⚠️ 모든 결제 정보를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem('all_payment_details');
      setPayments([]);
      alert('✅ 모든 결제 정보가 삭제되었습니다.');
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterMethod === 'all' || p.method === filterMethod;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '20px'
    }}>
      {/* 헤더 */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '30px'
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            border: '1px solid #e2e8f0',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '20px'
          }}
        >
          <ArrowLeft size={18} />
          뒤로가기
        </button>

        <div style={{
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          borderRadius: '15px',
          padding: '30px',
          color: 'white',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            marginBottom: '10px'
          }}>
            💳 전체 결제 정보 (마스킹 없음)
          </h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.95,
            margin: 0
          }}>
            토스페이먼츠에서 받은 원본 정보 · 총 {payments.length}건
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="이름, 이메일, 주문번호 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            <option value="all">모든 결제수단</option>
            <option value="가상계좌">가상계좌</option>
            <option value="카드">카드</option>
            <option value="간편결제">간편결제</option>
          </select>

          <button
            onClick={downloadCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600'
            }}
          >
            <Download size={18} />
            CSV 다운로드
          </button>

          <button
            onClick={clearAllData}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600'
            }}
          >
            전체 삭제
          </button>
        </div>
      </div>

      {/* 결제 목록 */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {filteredPayments.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '60px 20px',
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>
              {searchTerm || filterMethod !== 'all' ? '검색 결과가 없습니다' : '저장된 결제 정보가 없습니다'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '20px'
          }}>
            {filteredPayments.map((payment, index) => (
              <div
                key={payment.orderId + index}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '25px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: payment.status === 'DONE' ? '2px solid #10b981' : payment.status === 'WAITING_FOR_DEPOSIT' ? '2px solid #e5c100' : '1px solid #e2e8f0'
                }}
              >
                {/* 상태 뱃지 */}
                <div style={{ marginBottom: '15px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    background: payment.status === 'DONE' ? '#d1fae5' : payment.status === 'WAITING_FOR_DEPOSIT' ? '#fef3c7' : '#f1f5f9',
                    color: payment.status === 'DONE' ? '#065f46' : payment.status === 'WAITING_FOR_DEPOSIT' ? '#92400e' : '#475569'
                  }}>
                    {payment.status === 'DONE' ? '✅ 결제완료' : payment.status === 'WAITING_FOR_DEPOSIT' ? '⏳ 입금대기' : payment.status}
                  </span>
                  <span style={{
                    marginLeft: '10px',
                    color: '#64748b',
                    fontSize: '0.9rem'
                  }}>
                    {payment.method}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {/* 고객 정보 */}
                  <div>
                    <h3 style={{
                      fontSize: '0.9rem',
                      color: '#94a3b8',
                      marginBottom: '12px',
                      fontWeight: '600'
                    }}>
                      고객 정보
                    </h3>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>이름</div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '1rem', fontWeight: '600' }}>{payment.customerName}</span>
                        <button
                          onClick={() => copyToClipboard(payment.customerName, `name-${payment.orderId}`)}
                          style={{
                            padding: '4px 8px',
                            background: copiedField === `name-${payment.orderId}` ? '#10b981' : '#f1f5f9',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem'
                          }}
                        >
                          {copiedField === `name-${payment.orderId}` ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>이메일</div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '0.95rem' }}>{payment.customerEmail}</span>
                        <button
                          onClick={() => copyToClipboard(payment.customerEmail, `email-${payment.orderId}`)}
                          style={{
                            padding: '4px 8px',
                            background: copiedField === `email-${payment.orderId}` ? '#10b981' : '#f1f5f9',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {copiedField === `email-${payment.orderId}` ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>전화번호</div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '0.95rem' }}>{payment.customerPhone}</span>
                        <button
                          onClick={() => copyToClipboard(payment.customerPhone, `phone-${payment.orderId}`)}
                          style={{
                            padding: '4px 8px',
                            background: copiedField === `phone-${payment.orderId}` ? '#10b981' : '#f1f5f9',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {copiedField === `phone-${payment.orderId}` ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 결제 정보 */}
                  <div>
                    <h3 style={{
                      fontSize: '0.9rem',
                      color: '#94a3b8',
                      marginBottom: '12px',
                      fontWeight: '600'
                    }}>
                      결제 정보
                    </h3>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>금액</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0ea5e9' }}>
                        ₩{payment.amount.toLocaleString()}
                      </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>주문번호</div>
                      <div style={{
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        color: '#64748b'
                      }}>
                        {payment.orderId}
                      </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>승인시간</div>
                      <div style={{ fontSize: '0.9rem' }}>
                        {new Date(payment.approvedAt).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  </div>

                  {/* 가상계좌 정보 (있는 경우) */}
                  {payment.virtualAccount && (
                    <div>
                      <h3 style={{
                        fontSize: '0.9rem',
                        color: '#94a3b8',
                        marginBottom: '12px',
                        fontWeight: '600'
                      }}>
                        가상계좌 정보
                      </h3>
                      
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>입금자명</div>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                          {payment.virtualAccount.customerName}
                        </div>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>은행</div>
                        <div style={{ fontSize: '0.95rem' }}>
                          {payment.virtualAccount.bank}
                        </div>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>계좌번호</div>
                        <div style={{
                          fontSize: '0.95rem',
                          fontFamily: 'monospace'
                        }}>
                          {payment.virtualAccount.accountNumber}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>입금기한</div>
                        <div style={{ fontSize: '0.9rem' }}>
                          {new Date(payment.virtualAccount.dueDate).toLocaleString('ko-KR')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetailsViewPage;

