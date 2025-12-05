import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, DollarSign, TrendingUp, Search, Download, RefreshCw } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

interface UserData {
  email: string;
  name: string;
  createdAt: string;
  enrolledCourses: any[];
  purchases: any[];
  totalSpent: number;
  completedDays: number;
  lastAccessedAt?: string;
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
  
  // 수강 정보 수정 모달
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [enrollmentUserEmail, setEnrollmentUserEmail] = useState('');
  const [enrollmentUserData, setEnrollmentUserData] = useState<any>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

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
  }, [navigate]);

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
          lastAccessedAt: user.lastLoginAt || user.updatedAt
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
    } catch (error) {
      console.error('유저 로드 실패:', error);
      alert('유저 데이터를 불러올 수 없습니다.');
      setIsLoading(false);
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
        padding: '40px 20px',
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

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
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
          marginBottom: '40px'
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

