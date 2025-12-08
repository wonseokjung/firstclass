import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// 브랜드 테마: 네이비 + 골드
const brandTheme = {
  navy: '#0f2744',
  navyLight: '#1e3a5f',
  gold: '#fbbf24',
  goldDark: '#f59e0b',
  white: '#ffffff'
};

interface NavigationBarProps {
  onBack?: () => void;
  onFAQClick?: () => void;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  breadcrumbText?: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  onBack,
  onFAQClick,
  onLoginClick,
  onSignUpClick,
  breadcrumbText
}) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasEnrolledCourses, setHasEnrolledCourses] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setIsLoggedIn(true);
        setUserInfo(parsedUserInfo);
        
        // 강의 등록 여부 확인
        const enrolledCourses = parsedUserInfo?.enrolledCourses;
        if (enrolledCourses) {
          const enrollments = enrolledCourses.enrollments || [];
          setHasEnrolledCourses(enrollments.length > 0);
        }
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        sessionStorage.removeItem('aicitybuilders_user_session');
        setIsLoggedIn(false);
        setUserInfo(null);
        setHasEnrolledCourses(false);
      }
    }
  }, []);

  const handleLogoClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aicitybuilders_user_session');
    localStorage.removeItem('aicitybuilders_user');
    setIsLoggedIn(false);
    setUserInfo(null);
    setIsMobileMenuOpen(false);
    alert('로그아웃되었습니다.');
    navigate('/', { replace: true });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  // 공통 버튼 스타일
  const navButtonStyle = {
    background: brandTheme.navy,
    color: brandTheme.gold,
    padding: '8px 14px',
    borderRadius: '8px',
    fontWeight: '700' as const,
    fontSize: '0.85rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const goldButtonStyle = {
    background: brandTheme.gold,
    color: brandTheme.navy,
    padding: '8px 14px',
    borderRadius: '8px',
    fontWeight: '800' as const,
    fontSize: '0.85rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 10px rgba(251, 191, 36, 0.3)'
  };

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      // 관리자 계정 확인 (test10@gmail.com만)
      const isAdmin = userInfo?.email === 'test10@gmail.com';
      
      return (
        <>
          <button 
            className="nav-link" 
            onClick={() => navigate('/dashboard')}
          >
            내 강의
          </button>
          {isAdmin && (
            <button 
              className="nav-link" 
              onClick={() => navigate('/admin/fix-enrollments')}
              style={navButtonStyle}
            >
              🔧
            </button>
          )}
          <span className="user-welcome">안녕하세요, {userInfo?.name || userInfo?.email}님!</span>
          <button 
            className="nav-link" 
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </>
      );
    } else {
      return (
        <>
          <button className="nav-link" onClick={onLoginClick || (() => navigate('/login'))}>Log In</button>
          <button className="cta-button" onClick={onSignUpClick || (() => navigate('/signup'))}>회원가입</button>
        </>
      );
    }
  };

  return (
    <header className="masterclass-header-original">
      <div className="header-content">
        <div className="header-left">
          <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">C</span>
            <span className="logo-text">AI City Builders</span>
          </div>
        </div>
        
        {/* 데스크탑 네비게이션 */}
        <div className="header-right desktop-nav">
          <button className="nav-link" onClick={() => navigate('/ceo')}>소개</button>
          <button className="nav-link" onClick={() => navigate('/ai-construction-site')}>🏗️ AI 건물 공사장</button>
          <button 
            className="nav-link" 
            onClick={() => navigate('/live')}
            style={navButtonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.background = brandTheme.navyLight;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = brandTheme.navy;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📺 라이브
          </button>
          <button 
            className="nav-link" 
            onClick={() => navigate('/community')}
            style={navButtonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.background = brandTheme.navyLight;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = brandTheme.navy;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            💬 커뮤니티
          </button>
          <button className="nav-link" onClick={onFAQClick || (() => navigate('/faq'))}>FAQ</button>
          {hasEnrolledCourses && (
            <button
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                const confirmed = window.confirm(
                  '⚠️ 안내사항\n\n' +
                  'AI City Builders 강의에 관련된 내용만 문의 가능합니다.\n\n' +
                  '기타 문의는 받지 않으니 양해 부탁드립니다.\n\n' +
                  '카카오톡 오픈채팅으로 이동하시겠습니까?'
                );
                if (confirmed) {
                  window.open('https://open.kakao.com/o/s2NzW41h', '_blank', 'noopener,noreferrer');
                }
              }}
              style={goldButtonStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.background = brandTheme.goldDark;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = brandTheme.gold;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              💬 문의
            </button>
          )}
          {renderAuthButtons()}
        </div>

        {/* 모바일 햄버거 메뉴 버튼 */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기/닫기"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <button 
              className="mobile-nav-link" 
              onClick={() => handleMobileNavClick(() => navigate('/ceo'))}
            >
              소개
            </button>

            <button 
              className="mobile-nav-link" 
              onClick={() => handleMobileNavClick(() => navigate('/ai-construction-site'))}
            >
              🏗️ AI 건물 공사장
            </button>

            <button 
              className="mobile-nav-link" 
              onClick={() => handleMobileNavClick(() => navigate('/live'))}
              style={{ 
                background: brandTheme.navy,
                color: brandTheme.gold,
                fontWeight: '700'
              }}
            >
              📺 라이브
            </button>
            <button 
              className="mobile-nav-link" 
              onClick={() => handleMobileNavClick(() => navigate('/community'))}
              style={{ 
                background: brandTheme.navy,
                color: brandTheme.gold,
                fontWeight: '700'
              }}
            >
              💬 커뮤니티
            </button>

            <button 
              className="mobile-nav-link" 
              onClick={() => handleMobileNavClick(onFAQClick || (() => navigate('/faq')))}
            >
              FAQ
            </button>

            {hasEnrolledCourses && (
              <button
                className="mobile-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  const confirmed = window.confirm(
                    '⚠️ 안내사항\n\n' +
                    'AI City Builders 강의에 관련된 내용만 문의 가능합니다.\n\n' +
                    '기타 문의는 받지 않으니 양해 부탁드립니다.\n\n' +
                    '카카오톡 오픈채팅으로 이동하시겠습니까?'
                  );
                  if (confirmed) {
                    window.open('https://open.kakao.com/o/s2NzW41h', '_blank', 'noopener,noreferrer');
                  }
                  setIsMobileMenuOpen(false);
                }}
                style={{ 
                  background: brandTheme.gold,
                  color: brandTheme.navy,
                  fontWeight: '800',
                  textDecoration: 'none',
                  display: 'block',
                  textAlign: 'left',
                  boxShadow: '0 2px 10px rgba(251, 191, 36, 0.3)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                💬 실시간 문의
              </button>
            )}
            
            {isLoggedIn ? (
              <>
                <button 
                  className="mobile-nav-link" 
                  onClick={() => handleMobileNavClick(() => navigate('/dashboard'))}
                >
                  📚 내 강의 보기
                </button>
                {userInfo?.email === 'test10@gmail.com' && (
                  <button 
                    className="mobile-nav-link" 
                    onClick={() => handleMobileNavClick(() => navigate('/admin/fix-enrollments'))}
                    style={{ 
                      background: brandTheme.navy,
                      color: brandTheme.gold,
                      fontWeight: '700'
                    }}
                  >
                    🔧 관리자
                  </button>
                )}
                <div className="mobile-user-info">
                  안녕하세요, {userInfo?.name || userInfo?.email}님!
                </div>
                <button 
                  className="mobile-nav-link logout" 
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button 
                  className="mobile-nav-link" 
                  onClick={() => handleMobileNavClick(onLoginClick || (() => navigate('/login')))}
                >
                  로그인
                </button>
                <button 
                  className="mobile-nav-link cta" 
                  onClick={() => handleMobileNavClick(onSignUpClick || (() => navigate('/signup')))}
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavigationBar;
