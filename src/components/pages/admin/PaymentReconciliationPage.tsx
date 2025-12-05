import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader, RefreshCw, Download, Search } from 'lucide-react';
import AzureTableService from '../../../services/azureTableService';
import NavigationBar from '../../common/NavigationBar';

// 토스페이먼츠 Secret Key (라이브)
const TOSS_SECRET_KEY = 'live_sk_AQ92ymxN34P4R5EKxBkO3ajRKXvd';

interface TossTransaction {
  mId: string;
  transactionKey: string;
  paymentKey: string;
  orderId: string;
  method: string;
  customerKey: string | null;
  useEscrow: boolean;
  receiptUrl: string;
  status: string;
  transactionAt: string;
  currency: string;
  amount: number;
}

interface TossPayment {
  paymentKey: string;
  orderId: string;
  orderName: string;
  status: string;
  method: string;
  totalAmount: number;
  requestedAt: string;
  approvedAt: string | null;
  card?: {
    number: string;
    issuerCode: string;
  };
  virtualAccount?: {
    accountNumber: string;
    bankCode: string;
    customerName: string;
  };
  easyPay?: {
    provider: string;
  };
  metadata?: any;
}

interface ReconciliationResult {
  orderId: string;
  paymentKey: string;
  amount: number;
  status: string;
  method: string;
  transactionAt: string;
  orderName: string;
  tossStatus: 'DONE' | 'WAITING_FOR_DEPOSIT' | 'CANCELED' | string;
  azureStatus: 'enrolled' | 'not_enrolled' | 'user_not_found';
  userEmail?: string;
  userName?: string;
  courseId?: string;
  courseTitle?: string;
  mismatchReason?: string;
}

const PaymentReconciliationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  
  // 조회 기간
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // 기본 7일 전
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  // 결과
  const [transactions, setTransactions] = useState<TossTransaction[]>([]);
  const [reconciliationResults, setReconciliationResults] = useState<ReconciliationResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'mismatch' | 'ok'>('all');
  
  // 처리 중
  const [processing, setProcessing] = useState<string | null>(null);

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
      
      // 사용자 목록 로드
      try {
        const users = await AzureTableService.getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error('사용자 로드 실패:', error);
      }
    };

    checkAdmin();
  }, [navigate]);

  // 토스페이먼츠 거래 조회 API 호출
  const fetchTossTransactions = async () => {
    setIsFetching(true);
    
    try {
      // Base64 인코딩
      const encodedKey = btoa(`${TOSS_SECRET_KEY}:`);
      
      // 거래 조회 API 호출
      const response = await fetch(
        `https://api.tosspayments.com/v1/transactions?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59&limit=5000`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${encodedKey}`,
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API 오류: ${response.status}`);
      }

      const data: TossTransaction[] = await response.json();
      setTransactions(data);
      
      // Azure 데이터와 비교
      await reconcileWithAzure(data);
      
    } catch (error: any) {
      console.error('토스 거래 조회 실패:', error);
      alert(`토스 거래 조회 실패: ${error.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  // 개별 결제 상세 조회
  const fetchPaymentDetails = async (paymentKey: string): Promise<TossPayment | null> => {
    try {
      const encodedKey = btoa(`${TOSS_SECRET_KEY}:`);
      
      const response = await fetch(
        `https://api.tosspayments.com/v1/payments/${paymentKey}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${encodedKey}`,
          }
        }
      );

      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  };

  // Azure 데이터와 비교
  const reconcileWithAzure = async (tossData: TossTransaction[]) => {
    const results: ReconciliationResult[] = [];
    
    // 승인된 거래만 필터링 (status가 DONE인 것)
    const doneTransactions = tossData.filter(t => t.status === 'DONE');
    
    for (const tx of doneTransactions) {
      // orderId로 사용자 찾기
      const matchedUser = allUsers.find(user => {
        if (!user.enrolledCourses) return false;
        try {
          const enrolledData = JSON.parse(user.enrolledCourses);
          const payments = enrolledData.payments || [];
          return payments.some((p: any) => p.orderId === tx.orderId);
        } catch {
          return false;
        }
      });

      // 금액으로 강의 결정
      const isAIBuildingCourse = tx.amount === 45000;
      const courseId = isAIBuildingCourse ? 'ai-building-course' : '1002';
      const courseTitle = isAIBuildingCourse ? 'Step 1: AI 건물주 되기 기초' : 'Google Opal 유튜브 수익화 에이전트 기초';

      let azureStatus: 'enrolled' | 'not_enrolled' | 'user_not_found' = 'user_not_found';
      let mismatchReason = '';

      if (matchedUser) {
        // 해당 강의가 등록되어 있는지 확인
        const enrolledData = JSON.parse(matchedUser.enrolledCourses);
        const enrollments = Array.isArray(enrolledData) ? enrolledData : (enrolledData.enrollments || []);
        const hasEnrollment = enrollments.some((e: any) => {
          if (isAIBuildingCourse) {
            return e.courseId === '999' || e.courseId === 'ai-building-course';
          } else {
            return e.courseId === '1002' || e.courseId === 'chatgpt-agent-beginner';
          }
        });
        
        azureStatus = hasEnrollment ? 'enrolled' : 'not_enrolled';
        if (!hasEnrollment) {
          mismatchReason = '결제는 있지만 강의 미등록';
        }
      } else {
        mismatchReason = 'Azure에서 사용자를 찾을 수 없음';
      }

      results.push({
        orderId: tx.orderId,
        paymentKey: tx.paymentKey,
        amount: tx.amount,
        status: tx.status,
        method: tx.method,
        transactionAt: tx.transactionAt,
        orderName: courseTitle,
        tossStatus: tx.status,
        azureStatus,
        userEmail: matchedUser?.email,
        userName: matchedUser?.name,
        courseId,
        courseTitle,
        mismatchReason
      });
    }

    // 역방향 체크: Azure에 등록되어 있지만 토스에 없는 경우
    for (const user of allUsers) {
      if (!user.enrolledCourses) continue;
      
      try {
        const enrolledData = JSON.parse(user.enrolledCourses);
        const payments = enrolledData.payments || [];
        
        for (const payment of payments) {
          // 조회 기간 내의 결제인지 확인
          const paymentDate = new Date(payment.paymentDate || payment.createdAt);
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59);
          
          if (paymentDate < start || paymentDate > end) continue;
          
          // 토스에서 해당 orderId를 찾을 수 없는 경우
          const foundInToss = doneTransactions.some(t => t.orderId === payment.orderId);
          
          if (!foundInToss && payment.orderId) {
            // 이미 결과에 있는지 확인
            const alreadyInResults = results.some(r => r.orderId === payment.orderId);
            if (!alreadyInResults) {
              results.push({
                orderId: payment.orderId,
                paymentKey: payment.paymentKey || '-',
                amount: payment.amount,
                status: 'UNKNOWN',
                method: payment.paymentMethod || '알 수 없음',
                transactionAt: payment.paymentDate || payment.createdAt,
                orderName: payment.orderName || '알 수 없는 강의',
                tossStatus: 'NOT_FOUND',
                azureStatus: 'enrolled',
                userEmail: user.email,
                userName: user.name,
                mismatchReason: '토스에서 결제 내역을 찾을 수 없음 (오등록 가능성)'
              });
            }
          }
        }
      } catch {
        // JSON 파싱 실패 무시
      }
    }

    setReconciliationResults(results);
  };

  // 강의 등록
  const handleEnroll = async (result: ReconciliationResult) => {
    if (!result.userEmail) {
      alert('사용자 이메일을 찾을 수 없습니다.');
      return;
    }

    if (!window.confirm(`${result.userName || result.userEmail}에게 "${result.courseTitle}" 강의를 등록하시겠습니까?`)) {
      return;
    }

    setProcessing(result.orderId);

    try {
      await AzureTableService.addPurchaseAndEnrollmentToUser({
        email: result.userEmail,
        courseId: result.courseId || 'ai-building-course',
        title: result.courseTitle || 'Step 1: AI 건물주 되기 기초',
        amount: result.amount,
        paymentMethod: result.method,
        orderId: result.orderId,
        orderName: result.orderName
      });

      alert('✅ 강의가 등록되었습니다!');
      
      // 결과 업데이트
      setReconciliationResults(prev => 
        prev.map(r => 
          r.orderId === result.orderId 
            ? { ...r, azureStatus: 'enrolled' as const, mismatchReason: undefined }
            : r
        )
      );
      
      // 사용자 목록 새로고침
      const users = await AzureTableService.getAllUsers();
      setAllUsers(users);
      
    } catch (error: any) {
      alert(`오류: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  // 강의 삭제
  const handleRemoveEnrollment = async (result: ReconciliationResult) => {
    if (!result.userEmail) {
      alert('사용자 이메일을 찾을 수 없습니다.');
      return;
    }

    if (!window.confirm(`⚠️ 정말로 ${result.userName || result.userEmail}의 "${result.courseTitle}" 강의를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다!`)) {
      return;
    }

    setProcessing(result.orderId);

    try {
      await AzureTableService.removeEnrollmentFromUser(result.userEmail, result.courseId || 'ai-building-course');
      
      alert('✅ 강의가 삭제되었습니다!');
      
      // 결과 업데이트
      setReconciliationResults(prev => 
        prev.map(r => 
          r.orderId === result.orderId 
            ? { ...r, azureStatus: 'not_enrolled' as const, mismatchReason: '강의 삭제됨' }
            : r
        )
      );
      
      // 사용자 목록 새로고침
      const users = await AzureTableService.getAllUsers();
      setAllUsers(users);
      
    } catch (error: any) {
      alert(`오류: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  // CSV 다운로드
  const downloadCSV = () => {
    const headers = ['orderId', 'paymentKey', 'amount', 'method', 'transactionAt', 'tossStatus', 'azureStatus', 'userEmail', 'userName', 'mismatchReason'];
    const rows = reconciliationResults.map(r => [
      r.orderId,
      r.paymentKey,
      r.amount,
      r.method,
      r.transactionAt,
      r.tossStatus,
      r.azureStatus,
      r.userEmail || '',
      r.userName || '',
      r.mismatchReason || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment_reconciliation_${startDate}_${endDate}.csv`;
    link.click();
  };

  // 필터링
  const filteredResults = reconciliationResults.filter(r => {
    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        r.orderId.toLowerCase().includes(query) ||
        r.userEmail?.toLowerCase().includes(query) ||
        r.userName?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // 상태 필터
    if (filterStatus === 'mismatch') {
      return r.azureStatus !== 'enrolled' || r.tossStatus === 'NOT_FOUND';
    }
    if (filterStatus === 'ok') {
      return r.azureStatus === 'enrolled' && r.tossStatus !== 'NOT_FOUND';
    }

    return true;
  });

  // 통계
  const stats = {
    total: reconciliationResults.length,
    ok: reconciliationResults.filter(r => r.azureStatus === 'enrolled' && r.tossStatus !== 'NOT_FOUND').length,
    notEnrolled: reconciliationResults.filter(r => r.azureStatus === 'not_enrolled').length,
    userNotFound: reconciliationResults.filter(r => r.azureStatus === 'user_not_found').length,
    possibleWrongEnroll: reconciliationResults.filter(r => r.tossStatus === 'NOT_FOUND').length
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

  return (
    <div className="masterclass-container" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <NavigationBar onBack={() => navigate('/')} breadcrumbText="관리자 - 결제 대사" />

      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 헤더 */}
        <div style={{
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '10px' }}>
            📊 결제 대사 (토스 vs Azure)
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            토스페이먼츠 결제 내역과 Azure 등록 내역을 비교합니다
          </p>
          
          {/* 조회 기간 설정 */}
          <div style={{ 
            marginTop: '30px', 
            display: 'flex', 
            gap: '15px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontWeight: '600' }}>시작일:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: '10px 15px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontWeight: '600' }}>종료일:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  padding: '10px 15px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
            <button
              onClick={fetchTossTransactions}
              disabled={isFetching}
              style={{
                padding: '12px 30px',
                borderRadius: '10px',
                border: 'none',
                background: isFetching ? 'rgba(255,255,255,0.5)' : 'white',
                color: '#0ea5e9',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: isFetching ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isFetching ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <RefreshCw size={18} />
              )}
              {isFetching ? '조회 중...' : '🔍 조회 시작'}
            </button>
          </div>
        </div>

        {/* 통계 */}
        {reconciliationResults.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #64748b'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>전체 거래</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats.total}</div>
            </div>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>✅ 정상</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>{stats.ok}</div>
            </div>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>⚠️ 등록 누락</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>{stats.notEnrolled}</div>
            </div>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #ef4444'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>❌ 사용자 없음</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>{stats.userNotFound}</div>
            </div>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #8b5cf6'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>🔍 오등록 의심</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>{stats.possibleWrongEnroll}</div>
            </div>
          </div>
        )}

        {/* 필터 및 검색 */}
        {reconciliationResults.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="orderId, 이메일, 이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setFilterStatus('all')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: filterStatus === 'all' ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                  background: filterStatus === 'all' ? '#f0f9ff' : 'white',
                  color: filterStatus === 'all' ? '#0ea5e9' : '#64748b',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                전체
              </button>
              <button
                onClick={() => setFilterStatus('mismatch')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: filterStatus === 'mismatch' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  background: filterStatus === 'mismatch' ? '#fef2f2' : 'white',
                  color: filterStatus === 'mismatch' ? '#ef4444' : '#64748b',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ⚠️ 불일치만
              </button>
              <button
                onClick={() => setFilterStatus('ok')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: filterStatus === 'ok' ? '2px solid #10b981' : '1px solid #e2e8f0',
                  background: filterStatus === 'ok' ? '#f0fdf4' : 'white',
                  color: filterStatus === 'ok' ? '#10b981' : '#64748b',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✅ 정상만
              </button>
            </div>
            <button
              onClick={downloadCSV}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: 'white',
                color: '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={16} /> CSV 다운로드
            </button>
          </div>
        )}

        {/* 결과 테이블 */}
        {reconciliationResults.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
              📋 대사 결과 ({filteredResults.length}건)
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>주문번호</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>금액</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>결제수단</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>일시</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>토스 상태</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>Azure 상태</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>사용자</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result, index) => (
                    <tr 
                      key={index} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        background: result.mismatchReason ? '#fff7ed' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {result.orderId.length > 30 ? result.orderId.slice(0, 30) + '...' : result.orderId}
                      </td>
                      <td style={{ padding: '12px', fontWeight: '600' }}>
                        {result.amount.toLocaleString()}원
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                        {result.method}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.85rem', color: '#64748b' }}>
                        {new Date(result.transactionAt).toLocaleString('ko-KR')}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {result.tossStatus === 'DONE' && (
                          <span style={{ color: '#10b981', fontWeight: '600' }}>✅ 완료</span>
                        )}
                        {result.tossStatus === 'NOT_FOUND' && (
                          <span style={{ color: '#8b5cf6', fontWeight: '600' }}>🔍 미확인</span>
                        )}
                        {result.tossStatus === 'WAITING_FOR_DEPOSIT' && (
                          <span style={{ color: '#f59e0b', fontWeight: '600' }}>⏳ 입금대기</span>
                        )}
                        {result.tossStatus === 'CANCELED' && (
                          <span style={{ color: '#ef4444', fontWeight: '600' }}>❌ 취소됨</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {result.azureStatus === 'enrolled' && (
                          <span style={{ color: '#10b981', fontWeight: '600' }}>✅ 등록됨</span>
                        )}
                        {result.azureStatus === 'not_enrolled' && (
                          <span style={{ color: '#f59e0b', fontWeight: '600' }}>⚠️ 미등록</span>
                        )}
                        {result.azureStatus === 'user_not_found' && (
                          <span style={{ color: '#ef4444', fontWeight: '600' }}>❌ 없음</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {result.userEmail ? (
                          <div>
                            <div style={{ fontWeight: '600' }}>{result.userName || '-'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{result.userEmail}</div>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {processing === result.orderId ? (
                          <Loader size={18} className="animate-spin" />
                        ) : (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {/* 미등록인 경우 등록 버튼 */}
                            {result.azureStatus === 'not_enrolled' && result.userEmail && (
                              <button
                                onClick={() => handleEnroll(result)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: 'linear-gradient(135deg, #10b981, #059669)',
                                  color: 'white',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                ➕ 등록
                              </button>
                            )}
                            {/* 오등록 의심인 경우 삭제 버튼 */}
                            {result.tossStatus === 'NOT_FOUND' && result.azureStatus === 'enrolled' && (
                              <button
                                onClick={() => handleRemoveEnrollment(result)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #ef4444',
                                  background: 'white',
                                  color: '#ef4444',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                🗑️ 삭제
                              </button>
                            )}
                            {/* 정상인 경우 */}
                            {result.azureStatus === 'enrolled' && result.tossStatus !== 'NOT_FOUND' && (
                              <span style={{ color: '#10b981', fontSize: '0.9rem' }}>
                                <CheckCircle size={16} />
                              </span>
                            )}
                          </div>
                        )}
                        {result.mismatchReason && (
                          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>
                            {result.mismatchReason}
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

        {/* 조회 전 안내 */}
        {reconciliationResults.length === 0 && !isFetching && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '10px' }}>
              조회 기간을 선택하고 "조회 시작"을 클릭하세요
            </h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>
              토스페이먼츠 결제 내역을 조회하여 Azure 등록 현황과 비교합니다.
            </p>
            <div style={{ 
              background: '#f0f9ff', 
              padding: '20px', 
              borderRadius: '12px',
              maxWidth: '500px',
              margin: '0 auto',
              textAlign: 'left'
            }}>
              <h3 style={{ fontWeight: '700', color: '#0ea5e9', marginBottom: '10px' }}>💡 확인 사항</h3>
              <ul style={{ color: '#0369a1', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li>✅ 토스에서 결제 완료 → Azure 등록 정상</li>
                <li>⚠️ 토스에서 결제 완료 → Azure 미등록 (등록 필요)</li>
                <li>❌ 토스에서 결제 없음 → Azure 등록됨 (오등록 의심)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReconciliationPage;

