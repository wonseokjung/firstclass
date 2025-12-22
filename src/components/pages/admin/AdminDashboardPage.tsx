import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, DollarSign, TrendingUp, Search, Download, RefreshCw, Banknote, CheckCircle, XCircle } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService, { PartnerWithdrawal } from '../../../services/azureTableService';

interface UserData {
  email: string;
  name: string;
  createdAt: string;
  enrolledCourses: any[];
  purchases: any[];
  totalSpent: number;
  completedDays: number;
  lastAccessedAt?: string;
  referredBy?: string; // 추천인 코드
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    paidUsers: 0,
    totalRevenue: 0,
    avgProgress: 0
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  
  // 수강 정보 수정 모달 (향후 사용 예정)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [enrollmentUserEmail, setEnrollmentUserEmail] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [enrollmentUserData, setEnrollmentUserData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  
  // 출금 관리
  const [pendingWithdrawals, setPendingWithdrawals] = useState<(PartnerWithdrawal & { partnerEmail: string; partnerName: string })[]>([]);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'withdrawals' | 'partners' | 'refunds'>('users');
  
  // 환불 관리
  const [refundPayments, setRefundPayments] = useState<any[]>([]);
  const [refundLoading, setRefundLoading] = useState(false);
  const [manualPaymentKey, setManualPaymentKey] = useState('');
  const [manualRefundAmount, setManualRefundAmount] = useState('');
  const [manualCustomerInfo, setManualCustomerInfo] = useState('');
  
  // 파트너 통계
  const [partnerStats, setPartnerStats] = useState({
    totalPartners: 0,
    activePartners: 0,
    totalBricksIssued: 0,
    totalBricksPending: 0,
    totalBricksWithdrawn: 0,
    totalReferrals: 0
  });
  const [allPartners, setAllPartners] = useState<any[]>([]);

  // 관리자 권한 확인
  useEffect(() => {
    const checkAdmin = async () => {
      const userSession = sessionStorage.getItem('aicitybuilders_user_session');
      if (!userSession) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      try {
        const user = JSON.parse(userSession);
        if (user.email !== 'test10@gmail.com') {
          alert('관리자 권한이 없습니다.');
          navigate('/');
          return;
        }
        setIsAdmin(true);
        await loadAllUsers();
      } catch (error) {
        console.error('관리자 확인 실패:', error);
        navigate('/');
      }
    };

    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // 환불용 결제 내역 로드 (Azure 데이터에서)
  const loadRefundPayments = () => {
    try {
      // allUsers에서 모든 purchases 추출
      const allPurchases: any[] = [];
      
      allUsers.forEach(user => {
        if (user.purchases && user.purchases.length > 0) {
          user.purchases.forEach((purchase: any) => {
            allPurchases.push({
              ...purchase,
              customerName: user.name,
              customerEmail: user.email,
              paymentKey: purchase.externalPaymentId || purchase.paymentKey || '',
              amount: purchase.amount || 0,
              approvedAt: purchase.purchaseDate || purchase.createdAt,
              status: purchase.status || 'DONE'
            });
          });
        }
      });
      
      // 최신 순으로 정렬
      allPurchases.sort((a, b) => 
        new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime()
      );
      
      setRefundPayments(allPurchases);
      console.log('✅ Azure에서 결제 내역 로드:', allPurchases.length, '건');
    } catch (error) {
      console.error('❌ 결제 내역 로드 실패:', error);
    }
  };

  // 환불 처리
  const handleRefund = async (payment: any) => {
    const confirmMsg = `⚠️ 정말 환불하시겠습니까?\n\n` +
      `고객명: ${payment.customerName}\n` +
      `이메일: ${payment.customerEmail}\n` +
      `금액: ${payment.amount?.toLocaleString()}원\n\n` +
      `환불 후에는 취소할 수 없습니다.`;
    
    if (!window.confirm(confirmMsg)) return;

    setRefundLoading(true);
    
    try {
      // 1. 토스페이먼츠 환불 API 호출
      const response = await fetch('/api/cancel-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentKey: payment.paymentKey,
          cancelReason: '관리자 환불 처리'
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '환불 실패');
      }

      // 2. Azure에서 수강 정보 삭제 (옵션)
      try {
        if (payment.customerEmail) {
          // 수강 정보 삭제 로직 (필요시)
          console.log('📝 수강 취소 처리:', payment.customerEmail);
          // await AzureTableService.removeEnrollment(payment.customerEmail, courseId);
        }
      } catch (azureError) {
        console.warn('⚠️ 수강 정보 삭제 실패 (수동 처리 필요):', azureError);
      }

      // 3. 화면에서 상태 업데이트
      setRefundPayments(prev => 
        prev.map(p => 
          p.paymentKey === payment.paymentKey 
            ? { ...p, status: 'CANCELED', canceledAt: new Date().toISOString() }
            : p
        )
      );

      alert(`✅ 환불 완료!\n\n${payment.customerName}님 (${payment.amount?.toLocaleString()}원)`);
      
    } catch (error: any) {
      console.error('❌ 환불 처리 실패:', error);
      alert(`❌ 환불 실패: ${error.message}`);
    } finally {
      setRefundLoading(false);
    }
  };

  // 수동 환불 처리 (paymentKey 직접 입력)
  const handleManualRefund = async () => {
    if (!manualPaymentKey.trim()) {
      alert('⚠️ paymentKey를 입력해주세요.');
      return;
    }

    const confirmMsg = `⚠️ 정말 환불하시겠습니까?\n\n` +
      `paymentKey: ${manualPaymentKey.substring(0, 20)}...\n` +
      `고객정보: ${manualCustomerInfo || '미입력'}\n` +
      `금액: ${manualRefundAmount ? Number(manualRefundAmount).toLocaleString() + '원' : '전액 환불'}\n\n` +
      `환불 후에는 취소할 수 없습니다.`;
    
    if (!window.confirm(confirmMsg)) return;

    setRefundLoading(true);
    
    try {
      const response = await fetch('/api/cancel-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentKey: manualPaymentKey.trim(),
          cancelReason: '관리자 수동 환불',
          cancelAmount: manualRefundAmount ? Number(manualRefundAmount) : undefined
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '환불 실패');
      }

      alert(`✅ 환불 완료!\n\n주문번호: ${result.data?.orderId || 'N/A'}`);
      
      // 입력 필드 초기화
      setManualPaymentKey('');
      setManualRefundAmount('');
      setManualCustomerInfo('');
      
    } catch (error: any) {
      console.error('❌ 수동 환불 실패:', error);
      alert(`❌ 환불 실패: ${error.message}`);
    } finally {
      setRefundLoading(false);
    }
  };

  // 모든 유저 데이터 로드
  const loadAllUsers = async () => {
    setIsLoading(true);
    try {
      const users = await AzureTableService.getAllUsers();
      
      const userData: UserData[] = users.map(user => {
        let enrolledCourses: any[] = [];
        let purchases: any[] = [];
        let totalSpent = 0;

        if (user.enrolledCourses) {
          try {
            const parsed = JSON.parse(user.enrolledCourses);
            enrolledCourses = Array.isArray(parsed) ? parsed : (parsed.enrollments || []);
            purchases = parsed.payments || [];
            totalSpent = purchases.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
          } catch (e) {
            console.error('파싱 오류:', e);
          }
        }

        // localStorage에서 진행률 가져오기 (실제로는 Azure에서 가져와야 함)
        const completedDays = 0; // TODO: Azure에서 진행률 데이터 가져오기

        return {
          email: user.email || '',
          name: user.name || '-',
          createdAt: user.createdAt || '',
          enrolledCourses,
          purchases,
          totalSpent,
          completedDays,
          lastAccessedAt: user.lastLoginAt || user.updatedAt,
          referredBy: user.referredBy || '' // 추천인 코드
        };
      });

      setAllUsers(userData);
      setFilteredUsers(userData);

      // 통계 계산
      const paidUsers = userData.filter(u => u.purchases.length > 0).length;
      const totalRevenue = userData.reduce((sum, u) => sum + u.totalSpent, 0);
      const avgProgress = userData.reduce((sum, u) => sum + u.completedDays, 0) / userData.length || 0;

      setStats({
        totalUsers: userData.length,
        paidUsers,
        totalRevenue,
        avgProgress: Math.round(avgProgress)
      });

      setIsLoading(false);
      
      // 출금 요청도 함께 로드
      await loadPendingWithdrawals();
      
      // 파트너 통계도 함께 로드
      await loadPartnerStats();
    } catch (error) {
      console.error('유저 로드 실패:', error);
      alert('유저 데이터를 불러올 수 없습니다.');
      setIsLoading(false);
    }
  };

  // 출금 요청 로드
  const loadPendingWithdrawals = async () => {
    try {
      setWithdrawalLoading(true);
      const withdrawals = await AzureTableService.getAllPendingWithdrawals();
      setPendingWithdrawals(withdrawals);
    } catch (error) {
      console.error('출금 요청 로드 실패:', error);
    } finally {
      setWithdrawalLoading(false);
    }
  };

  // 파트너 통계 로드
  const loadPartnerStats = async () => {
    try {
      const users = await AzureTableService.getAllUsers();
      
      // 파트너 데이터가 있는 사용자 필터링
      const partners = users.filter(user => 
        user.referralCode || (user.totalBricks && user.totalBricks > 0)
      );
      
      // 활동 중인 파트너 (추천 1건 이상)
      const activePartners = partners.filter(p => (p.referralCount || 0) > 0);
      
      // 통계 계산
      const stats = {
        totalPartners: partners.length,
        activePartners: activePartners.length,
        totalBricksIssued: partners.reduce((sum, p) => sum + (p.totalBricks || 0), 0),
        totalBricksPending: partners.reduce((sum, p) => sum + (p.pendingBricks || 0), 0),
        totalBricksWithdrawn: partners.reduce((sum, p) => sum + (p.withdrawnBricks || 0), 0),
        totalReferrals: partners.reduce((sum, p) => sum + (p.referralCount || 0), 0)
      };
      
      setPartnerStats(stats);
      
      // 파트너 목록 (브릭 많은 순)
      const partnerList = partners
        .map(p => ({
          email: p.email,
          name: p.name,
          referralCode: p.referralCode,
          totalBricks: p.totalBricks || 0,
          availableBricks: p.availableBricks || 0,
          pendingBricks: p.pendingBricks || 0,
          withdrawnBricks: p.withdrawnBricks || 0,
          referralCount: p.referralCount || 0,
          createdAt: p.createdAt
        }))
        .sort((a, b) => b.totalBricks - a.totalBricks);
      
      setAllPartners(partnerList);
      
      console.log('✅ 파트너 통계 로드 완료:', stats);
    } catch (error) {
      console.error('파트너 통계 로드 실패:', error);
    }
  };

  // 출금 승인
  const handleApproveWithdrawal = async (partnerEmail: string, withdrawalRowKey: string) => {
    if (!window.confirm('출금을 승인하시겠습니까? 실제 계좌 이체 후 승인해주세요.')) return;
    
    try {
      const success = await AzureTableService.updateWithdrawalStatus(partnerEmail, withdrawalRowKey, 'completed');
      if (success) {
        alert('출금이 승인되었습니다.');
        await loadPendingWithdrawals();
      } else {
        alert('출금 승인에 실패했습니다.');
      }
    } catch (error) {
      console.error('출금 승인 실패:', error);
      alert('출금 승인 중 오류가 발생했습니다.');
    }
  };

  // 출금 거절
  const handleRejectWithdrawal = async (partnerEmail: string, withdrawalRowKey: string) => {
    const reason = window.prompt('거절 사유를 입력하세요:');
    if (!reason) return;
    
    try {
      const success = await AzureTableService.updateWithdrawalStatus(partnerEmail, withdrawalRowKey, 'rejected', reason);
      if (success) {
        alert('출금이 거절되었습니다. 브릭이 사용자에게 환불됩니다.');
        await loadPendingWithdrawals();
      } else {
        alert('출금 거절에 실패했습니다.');
      }
    } catch (error) {
      console.error('출금 거절 실패:', error);
      alert('출금 거절 중 오류가 발생했습니다.');
    }
  };

  // 검색 및 필터링
  useEffect(() => {
    let filtered = allUsers;

    // 검색어 필터
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 강의 필터
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(user => 
        user.enrolledCourses.some(course => 
          course.courseId === selectedCourse || 
          (course.courseId === 'chatgpt-agent-beginner' && selectedCourse === '1002')
        )
      );
    }

    setFilteredUsers(filtered);
  }, [searchQuery, selectedCourse, allUsers]);

  // 사용자 선택/해제
  const toggleUserSelection = (email: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    setSelectedUsers(newSelected);
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.email)));
    }
  };

  // 이메일 발송 (mailto 방식)
  const handleSendEmail = () => {
    if (selectedUsers.size === 0) {
      alert('이메일을 보낼 사용자를 선택해주세요.');
      return;
    }

    if (!emailSubject || !emailContent) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const confirmed = window.confirm(
      `${selectedUsers.size}명의 사용자에게 이메일을 발송하시겠습니까?\n\n제목: ${emailSubject}`
    );

    if (!confirmed) return;

    // mailto 링크 생성 (BCC로 발송)
    const bccEmails = Array.from(selectedUsers).join(',');
    const mailtoLink = `mailto:jay@connexionai.kr?bcc=${encodeURIComponent(bccEmails)}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailContent)}`;
    
    // 이메일 클라이언트 열기
    window.location.href = mailtoLink;
    
    alert(`✅ 이메일 클라이언트가 열립니다.\n\n${selectedUsers.size}명의 사용자가 BCC로 추가되었습니다.`);
    
    // 모달 닫기
    setShowEmailModal(false);
    setEmailSubject('');
    setEmailContent('');
  };

  // 비밀번호 변경 함수
  const handleChangePassword = async () => {
    if (!selectedUserEmail || !newPassword) {
      alert('이메일과 새 비밀번호를 입력해주세요.');
      return;
    }

    if (newPassword.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    const confirmed = window.confirm(
      `${selectedUserEmail}의 비밀번호를 변경하시겠습니까?\n\n새 비밀번호: ${newPassword}`
    );

    if (!confirmed) return;

    try {
      const success = await AzureTableService.adminChangePassword(selectedUserEmail, newPassword);
      
      if (success) {
        alert('✅ 비밀번호가 성공적으로 변경되었습니다!');
        setShowPasswordModal(false);
        setSelectedUserEmail('');
        setNewPassword('');
      } else {
        alert('❌ 비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      alert('❌ 비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  // 이메일 목록 복사
  const copyAllEmails = () => {
    const emails = filteredUsers.map(user => user.email).join(', ');
    
    navigator.clipboard.writeText(emails).then(() => {
      alert(`✅ ${filteredUsers.length}개의 이메일 주소가 클립보드에 복사되었습니다!\n\n이메일 클라이언트의 BCC 필드에 붙여넣으세요.`);
    }).catch(err => {
      console.error('복사 실패:', err);
      // 복사 실패 시 텍스트 영역으로 표시
      const textarea = document.createElement('textarea');
      textarea.value = emails;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert(`✅ ${filteredUsers.length}개의 이메일 주소가 클립보드에 복사되었습니다!`);
    });
  };

  // CSV 다운로드
  const downloadCSV = () => {
    const headers = ['이메일', '이름', '가입일', '구매 강의', '총 결제액', '진행률', '마지막 접속'];
    const rows = filteredUsers.map(user => [
      user.email,
      user.name,
      new Date(user.createdAt).toLocaleDateString('ko-KR'),
      user.enrolledCourses.map(c => c.title).join('; '),
      `₩${user.totalSpent.toLocaleString()}`,
      `${user.completedDays}/15`,
      user.lastAccessedAt ? new Date(user.lastAccessedAt).toLocaleDateString('ko-KR') : '-'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (!isAdmin || isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #ef4444',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          {isLoading ? '데이터 로딩 중...' : '관리자 권한 확인 중...'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <NavigationBar />

      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)',
        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '10px'
          }}>
            🔧 관리자 대시보드
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
            전체 사용자 및 학습 현황 관리
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)' }}>
        {/* 관리 메뉴 버튼 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => navigate('/admin/payment-details')}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              padding: '20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
            }}
          >
            💳 전체 결제 정보 (마스킹 없음)
          </button>

          <button
            onClick={() => navigate('/admin/fix-enrollments')}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              border: 'none',
              padding: '20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
            }}
          >
            🔧 수동 수강 등록
          </button>
        </div>

        {/* 통계 카드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: 'clamp(20px, 4vw, 40px)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '2px solid #e0e7ff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <Users size={32} color="#6366f1" />
              <div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>전체 사용자</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937' }}>
                  {stats.totalUsers}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '2px solid #dcfce7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <BookOpen size={32} color="#10b981" />
              <div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>결제 사용자</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937' }}>
                  {stats.paidUsers}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '2px solid #fef3c7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <DollarSign size={32} color="#f59e0b" />
              <div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>총 매출</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937' }}>
                  ₩{(stats.totalRevenue / 10000).toFixed(0)}만
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '2px solid #dbeafe'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <TrendingUp size={32} color="#0ea5e9" />
              <div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>평균 진행률</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1f2937' }}>
                  {stats.avgProgress}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔴 바로가기 버튼들 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/admin/live-control')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
            }}
          >
            🔴 라이브 관리
          </button>
          <button
            onClick={() => navigate('/admin/live-archives')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
            }}
          >
            📺 아카이브 관리
          </button>
          <button
            onClick={() => navigate('/admin/escrow')}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
            }}
          >
            💰 에스크로 관리
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '25px'
        }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'users' 
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                : 'white',
              color: activeTab === 'users' ? 'white' : '#64748b',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'users' 
                ? '0 4px 15px rgba(59, 130, 246, 0.4)' 
                : '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={20} />
            사용자 관리
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'partners' 
                ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
                : 'white',
              color: activeTab === 'partners' ? 'white' : '#64748b',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'partners' 
                ? '0 4px 15px rgba(139, 92, 246, 0.4)' 
                : '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            🧱 파트너 통계
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'withdrawals' 
                ? 'linear-gradient(135deg, #f97316, #ea580c)' 
                : 'white',
              color: activeTab === 'withdrawals' ? 'white' : '#64748b',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'withdrawals' 
                ? '0 4px 15px rgba(249, 115, 22, 0.4)' 
                : '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <Banknote size={20} />
            출금 관리
            {pendingWithdrawals.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: '800'
              }}>
                {pendingWithdrawals.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('refunds');
              loadRefundPayments();
            }}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'refunds' 
                ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                : 'white',
              color: activeTab === 'refunds' ? 'white' : '#64748b',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'refunds' 
                ? '0 4px 15px rgba(239, 68, 68, 0.4)' 
                : '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            💳 환불 관리
          </button>
        </div>

        {/* 사용자 관리 탭 */}
        {activeTab === 'users' && (
          <>
        {/* 필터 & 검색 */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="이메일 또는 이름 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 45px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                fontSize: '1rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">모든 강의</option>
              <option value="1002">ChatGPT AI AGENT 비기너편</option>
              <option value="ai-building">AI 건물 짓기</option>
            </select>

            <button
              onClick={loadAllUsers}
              style={{
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#0ea5e9',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={18} />
              새로고침
            </button>

            <button
              onClick={downloadCSV}
              style={{
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#10b981',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Download size={18} />
              CSV 다운로드
            </button>

            <button
              onClick={copyAllEmails}
              style={{
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#f59e0b',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#d97706'}
              onMouseOut={(e) => e.currentTarget.style.background = '#f59e0b'}
            >
              📋 이메일 복사 ({filteredUsers.length})
            </button>

            <button
              onClick={() => setShowEmailModal(true)}
              disabled={selectedUsers.size === 0}
              style={{
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                background: selectedUsers.size > 0 ? '#8b5cf6' : '#94a3b8',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: selectedUsers.size > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (selectedUsers.size > 0) {
                  e.currentTarget.style.background = '#7c3aed';
                }
              }}
              onMouseOut={(e) => {
                if (selectedUsers.size > 0) {
                  e.currentTarget.style.background = '#8b5cf6';
                }
              }}
            >
              📧 이메일 발송 ({selectedUsers.size})
            </button>
          </div>
        </div>

        {/* 유저 테이블 */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflowX: 'auto'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>
            👥 사용자 목록 ({filteredUsers.length}명)
          </h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>이메일</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>이름</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>🔗 추천인</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>가입일</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>수강 강의</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontWeight: '600' }}>총 결제액</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>진행률</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>마지막 접속</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>비밀번호</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index} style={{
                  borderBottom: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  background: selectedUsers.has(user.email) ? '#f0f9ff' : 'transparent'
                }}
                onMouseOver={(e) => {
                  if (!selectedUsers.has(user.email)) {
                    e.currentTarget.style.background = '#f8fafc';
                  }
                }}
                onMouseOut={(e) => {
                  if (!selectedUsers.has(user.email)) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
                >
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.email)}
                      onChange={() => toggleUserSelection(user.email)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '12px' }}>{user.name}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {user.referredBy ? (
                      <span style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        color: '#1f2937',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        display: 'inline-block',
                        boxShadow: '0 2px 4px rgba(251, 191, 36, 0.3)'
                      }}>
                        🧱 {user.referredBy}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: '#64748b' }}>
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {user.enrolledCourses.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {user.enrolledCourses.map((course, idx) => (
                          <span key={idx} style={{
                            background: '#e0f2fe',
                            color: '#0369a1',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}>
                            {course.title || course.courseId}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                    {user.totalSpent > 0 ? `₩${user.totalSpent.toLocaleString()}` : '-'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{
                      background: user.completedDays > 0 ? '#dcfce7' : '#f1f5f9',
                      color: user.completedDays > 0 ? '#166534' : '#64748b',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'inline-block'
                    }}>
                      {user.completedDays}/15
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                    {user.lastAccessedAt ? new Date(user.lastAccessedAt).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUserEmail(user.email);
                        setShowPasswordModal(true);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#f59e0b',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#d97706';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#f59e0b';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      🔐 변경
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#94a3b8'
            }}>
              <Users size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                검색 결과가 없습니다
              </p>
            </div>
          )}
        </div>
          </>
        )}

        {/* 출금 관리 탭 */}
        {activeTab === 'withdrawals' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Banknote size={28} color="#f97316" />
                대기 중인 출금 요청
              </h2>
              <button
                onClick={loadPendingWithdrawals}
                disabled={withdrawalLoading}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#0ea5e9',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={18} className={withdrawalLoading ? 'animate-spin' : ''} />
                새로고침
              </button>
            </div>

            {pendingWithdrawals.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>신청일</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>파트너</th>
                    <th style={{ padding: '15px', textAlign: 'right', color: '#64748b', fontWeight: '600' }}>출금 금액</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>은행</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>계좌번호</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>예금주</th>
                    <th style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>처리</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal.rowKey} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px', color: '#374151' }}>
                        {new Date(withdrawal.requestDate).toLocaleDateString('ko-KR')}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>{withdrawal.partnerName}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{withdrawal.partnerEmail}</div>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right' }}>
                        <span style={{ 
                          fontWeight: '700', 
                          color: '#f97316',
                          fontSize: '1.1rem'
                        }}>
                          ₩{withdrawal.amount.toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: '15px', color: '#374151' }}>{withdrawal.bankName}</td>
                      <td style={{ padding: '15px', color: '#374151', fontFamily: 'monospace' }}>{withdrawal.accountNumber}</td>
                      <td style={{ padding: '15px', color: '#374151' }}>{withdrawal.accountHolder}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleApproveWithdrawal(withdrawal.partnerEmail, withdrawal.rowKey)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                              color: 'white',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <CheckCircle size={16} />
                            승인
                          </button>
                          <button
                            onClick={() => handleRejectWithdrawal(withdrawal.partnerEmail, withdrawal.rowKey)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              color: 'white',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <XCircle size={16} />
                            거절
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: '#94a3b8'
              }}>
                <Banknote size={64} style={{ marginBottom: '20px', opacity: 0.3 }} />
                <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>
                  대기 중인 출금 요청이 없습니다
                </p>
                <p style={{ fontSize: '0.95rem' }}>
                  파트너가 출금을 신청하면 여기에 표시됩니다
                </p>
              </div>
            )}
          </div>
        )}

        {/* 파트너 통계 탭 */}
        {activeTab === 'partners' && (
          <div>
            {/* 파트너 통계 카드 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                borderRadius: '15px',
                padding: '25px',
                color: 'white',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>총 파트너 수</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{partnerStats.totalPartners}명</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '5px' }}>
                  추천 코드 보유자
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                borderRadius: '15px',
                padding: '25px',
                color: 'white',
                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>활동 파트너</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{partnerStats.activePartners}명</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '5px' }}>
                  추천 실적 1건 이상
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                borderRadius: '15px',
                padding: '25px',
                color: 'white',
                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>총 발행 브릭</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                  {partnerStats.totalBricksIssued.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '5px' }}>
                  = ₩{partnerStats.totalBricksIssued.toLocaleString()}
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                borderRadius: '15px',
                padding: '25px',
                color: 'white',
                boxShadow: '0 4px 20px rgba(234, 179, 8, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>총 추천 수</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{partnerStats.totalReferrals}건</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '5px' }}>
                  성공한 추천
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                borderRadius: '15px',
                padding: '25px',
                color: 'white',
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>정산 대기</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                  {partnerStats.totalBricksPending.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '5px' }}>
                  월말 지급 예정
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '15px',
                padding: '25px',
                color: 'white',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '8px' }}>출금 완료</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                  ₩{partnerStats.totalBricksWithdrawn.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '5px' }}>
                  실제 지급액
                </div>
              </div>
            </div>

            {/* 파트너 목록 */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                🧱 전체 파트너 목록 ({allPartners.length}명)
                <span style={{
                  fontSize: '0.85rem',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: '600'
                }}>
                  ↓ 브릭 많은 순
                </span>
              </h2>

              {allPartners.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontWeight: '600', width: '60px' }}>순위</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>파트너</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>추천코드</th>
                      <th style={{ padding: '15px', textAlign: 'right', color: '#f59e0b', fontWeight: '700' }}>🧱 총 브릭 ↓</th>
                      <th style={{ padding: '15px', textAlign: 'right', color: '#64748b', fontWeight: '600' }}>출금가능</th>
                      <th style={{ padding: '15px', textAlign: 'right', color: '#64748b', fontWeight: '600' }}>대기중</th>
                      <th style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>추천수</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>가입일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPartners.map((partner, index) => (
                      <tr key={partner.email} style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        background: index < 3 ? `rgba(251, 191, 36, ${0.15 - index * 0.04})` : 'transparent'
                      }}>
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          {index === 0 ? (
                            <span style={{ fontSize: '1.5rem' }}>🥇</span>
                          ) : index === 1 ? (
                            <span style={{ fontSize: '1.5rem' }}>🥈</span>
                          ) : index === 2 ? (
                            <span style={{ fontSize: '1.5rem' }}>🥉</span>
                          ) : (
                            <span style={{ 
                              fontWeight: '700', 
                              color: '#64748b',
                              fontSize: '1rem'
                            }}>
                              {index + 1}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '15px' }}>
                          <div style={{ fontWeight: '600', color: '#1f2937' }}>{partner.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{partner.email}</div>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <span style={{ 
                            fontFamily: 'monospace', 
                            background: '#f1f5f9', 
                            padding: '4px 8px', 
                            borderRadius: '6px',
                            color: '#1f2937',
                            fontWeight: '600'
                          }}>
                            {partner.referralCode || '-'}
                          </span>
                        </td>
                        <td style={{ padding: '15px', textAlign: 'right' }}>
                          <span style={{ 
                            fontWeight: '800', 
                            color: '#f59e0b',
                            fontSize: '1.1rem',
                            background: partner.totalBricks > 0 ? 'linear-gradient(135deg, #fffbeb, #fef3c7)' : 'transparent',
                            padding: partner.totalBricks > 0 ? '4px 10px' : '0',
                            borderRadius: '8px'
                          }}>
                            {partner.totalBricks > 0 ? `₩${partner.totalBricks.toLocaleString()}` : '-'}
                          </span>
                        </td>
                        <td style={{ padding: '15px', textAlign: 'right' }}>
                          <span style={{ fontWeight: '600', color: '#22c55e' }}>
                            {partner.availableBricks.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: '15px', textAlign: 'right' }}>
                          <span style={{ fontWeight: '600', color: '#eab308' }}>
                            {partner.pendingBricks.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          <span style={{ 
                            background: partner.referralCount > 0 ? '#dbeafe' : '#f1f5f9',
                            color: partner.referralCount > 0 ? '#1e40af' : '#64748b',
                            padding: '6px 12px',
                            borderRadius: '15px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                          }}>
                            {partner.referralCount}건
                          </span>
                        </td>
                        <td style={{ padding: '15px', color: '#64748b', fontSize: '0.9rem' }}>
                          {new Date(partner.createdAt).toLocaleDateString('ko-KR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  color: '#94a3b8'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.3 }}>🧱</div>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>
                    아직 파트너가 없습니다
                  </p>
                  <p style={{ fontSize: '0.95rem' }}>
                    강의를 구매한 사용자가 파트너가 될 수 있습니다
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 환불 관리 탭 */}
        {activeTab === 'refunds' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                💳 결제 내역 & 환불 관리
                <span style={{
                  fontSize: '0.85rem',
                  background: '#ef4444',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: '600'
                }}>
                  {refundPayments.length}건
                </span>
              </h2>
              <button
                onClick={loadRefundPayments}
                disabled={refundLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: refundLoading ? 'not-allowed' : 'pointer'
                }}
              >
                <RefreshCw size={16} className={refundLoading ? 'animate-spin' : ''} />
                새로고침
              </button>
            </div>

            {/* 수동 환불 섹션 */}
            <div style={{
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '30px',
              border: '2px solid #fecaca'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '700', 
                marginBottom: '20px',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                🔑 수동 환불 (paymentKey 직접 입력)
              </h3>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#991b1b', 
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                📧 이메일로 받은 환불 신청의 paymentKey를 입력하여 직접 환불 처리합니다.<br/>
                ⚠️ paymentKey는 토스페이먼츠 대시보드에서도 확인 가능합니다.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#7f1d1d', marginBottom: '8px' }}>
                    paymentKey *
                  </label>
                  <input
                    type="text"
                    value={manualPaymentKey}
                    onChange={(e) => setManualPaymentKey(e.target.value)}
                    placeholder="tviva_xxxxxxxxxxxxxxxx..."
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      border: '2px solid #fca5a5',
                      fontSize: '0.95rem',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#7f1d1d', marginBottom: '8px' }}>
                    고객 정보 (메모용)
                  </label>
                  <input
                    type="text"
                    value={manualCustomerInfo}
                    onChange={(e) => setManualCustomerInfo(e.target.value)}
                    placeholder="예: 리버 / okarina910@naver.com"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      border: '2px solid #fca5a5',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#7f1d1d', marginBottom: '8px' }}>
                    환불 금액 (비워두면 전액 환불)
                  </label>
                  <input
                    type="number"
                    value={manualRefundAmount}
                    onChange={(e) => setManualRefundAmount(e.target.value)}
                    placeholder="45000"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      border: '2px solid #fca5a5',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
                <button
                  onClick={handleManualRefund}
                  disabled={refundLoading || !manualPaymentKey.trim()}
                  style={{
                    padding: '12px 30px',
                    borderRadius: '10px',
                    border: 'none',
                    background: refundLoading || !manualPaymentKey.trim() 
                      ? '#fca5a5' 
                      : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: refundLoading || !manualPaymentKey.trim() ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {refundLoading ? '처리중...' : '💸 환불 실행'}
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px', color: '#64748b' }}>
              📋 전체 결제 내역 (Azure에서 로드)
            </h3>

            {refundPayments.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>결제일시</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>고객명</th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>이메일</th>
                      <th style={{ padding: '15px', textAlign: 'right', color: '#64748b', fontWeight: '600' }}>금액</th>
                      <th style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>상태</th>
                      <th style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refundPayments.map((payment, index) => (
                      <tr key={payment.paymentKey || index} style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        background: payment.status === 'CANCELED' ? '#fef2f2' : 'transparent'
                      }}>
                        <td style={{ padding: '15px', fontSize: '0.9rem' }}>
                          {new Date(payment.approvedAt || payment.savedAt).toLocaleString('ko-KR')}
                        </td>
                        <td style={{ padding: '15px', fontWeight: '600' }}>
                          {payment.customerName}
                        </td>
                        <td style={{ padding: '15px', color: '#64748b', fontSize: '0.9rem' }}>
                          {payment.customerEmail}
                        </td>
                        <td style={{ padding: '15px', textAlign: 'right', fontWeight: '700', color: '#1f2937' }}>
                          ₩{payment.amount?.toLocaleString()}
                        </td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          {payment.status === 'CANCELED' ? (
                            <span style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}>
                              환불완료
                            </span>
                          ) : (
                            <span style={{
                              background: '#dcfce7',
                              color: '#16a34a',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}>
                              결제완료
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          {payment.status !== 'CANCELED' && (
                            <button
                              onClick={() => handleRefund(payment)}
                              disabled={refundLoading}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: refundLoading ? '#fca5a5' : '#ef4444',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: refundLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => !refundLoading && (e.currentTarget.style.background = '#dc2626')}
                              onMouseOut={(e) => !refundLoading && (e.currentTarget.style.background = '#ef4444')}
                            >
                              환불하기
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#94a3b8'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.3 }}>💳</div>
                <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>
                  결제 내역이 없습니다
                </p>
                <p style={{ fontSize: '0.95rem' }}>
                  결제가 완료되면 여기에 표시됩니다
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div
          onClick={() => setShowPasswordModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#1f2937'
            }}>
              🔐 비밀번호 변경
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px'
              }}>
                사용자 이메일
              </label>
              <input
                type="text"
                value={selectedUserEmail}
                disabled
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem',
                  background: '#f8fafc',
                  color: '#64748b'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px'
              }}>
                새 비밀번호 (최소 6자)
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호 입력"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleChangePassword();
                  }
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <button
                onClick={handleChangePassword}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#f59e0b',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#d97706'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f59e0b'}
              >
                변경하기
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setSelectedUserEmail('');
                  setNewPassword('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  color: '#64748b',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이메일 발송 모달 */}
      {showEmailModal && (
        <div
          onClick={() => setShowEmailModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            overflowY: 'auto',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '700px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '10px',
              color: '#1f2937'
            }}>
              📧 일괄 이메일 발송
            </h2>

            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              marginBottom: '30px'
            }}>
              선택된 <strong style={{ color: '#8b5cf6' }}>{selectedUsers.size}명</strong>의 사용자에게 이메일을 발송합니다
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px'
              }}>
                제목
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="이메일 제목을 입력하세요"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#64748b',
                marginBottom: '8px'
              }}>
                내용
              </label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="이메일 내용을 입력하세요"
                rows={10}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{
              background: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: '#92400e',
                margin: 0,
                lineHeight: '1.6'
              }}>
                <strong>💡 안내:</strong><br />
                이메일 클라이언트(Outlook, Gmail 등)가 열립니다.<br />
                선택된 사용자들이 BCC로 자동 추가되며, 발송 버튼을 누르시면 됩니다.
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <button
                onClick={handleSendEmail}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#8b5cf6',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#7c3aed'}
                onMouseOut={(e) => e.currentTarget.style.background = '#8b5cf6'}
              >
                📧 이메일 클라이언트 열기
              </button>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailSubject('');
                  setEmailContent('');
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  color: '#64748b',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

