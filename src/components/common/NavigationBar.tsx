import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AzureTableService from '../../services/azureTableService';

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
  const [totalBricks, setTotalBricks] = useState<number>(0);

  useEffect(() => {
    // 로그인 상태 확인
    const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setIsLoggedIn(true);
        setUserInfo(parsedUserInfo);
        
        // 브릭 잔액 로드
        if (parsedUserInfo?.email) {
          AzureTableService.getUserByEmail(parsedUserInfo.email).then(user => {
            if (user) {
              setTotalBricks(user.totalBricks || 0);
            }
          });
        }
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        sessionStorage.removeItem('aicitybuilders_user_session');
        setIsLoggedIn(false);
        setUserInfo(null);
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
          {/* 브릭 잔액 표시 */}
          <div 
            onClick={() => navigate('/partner')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              padding: '8px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(249, 115, 22, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(249, 115, 22, 0.3)';
            }}
          >
            <span style={{ fontSize: '1rem' }}>🧱</span>
            <span style={{ 
              color: '#fff', 
              fontWeight: '800', 
              fontSize: '0.9rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              {totalBricks.toLocaleString()}
            </span>
          </div>
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
          <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={`${process.env.PUBLIC_URL}/images/logo.jpeg`}
              alt="AI City Builders Logo"
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #fbbf24',
                boxShadow: '0 2px 10px rgba(251, 191, 36, 0.3)'
              }}
            />
            <span className="logo-text">AI City Builders</span>
          </div>
        </div>
        
        {/* 데스크탑 네비게이션 */}
        <div className="header-right desktop-nav">
          <button className="nav-link" onClick={() => navigate('/ceo')}>소개</button>
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
          <button 
            className="nav-link" 
            onClick={() => navigate('/partner')}
            style={{
              ...navButtonStyle,
              background: '#c45c26',
              color: '#ffffff'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e07b3c';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#c45c26';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🧱 파트너
          </button>
          <button className="nav-link" onClick={onFAQClick || (() => navigate('/faq'))}>FAQ</button>
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
              onClick={() => handleMobileNavClick(() => navigate('/partner'))}
              style={{ 
                background: '#c45c26',
                color: '#ffffff',
                fontWeight: '700'
              }}
            >
              🧱 파트너
            </button>

            <button 
              className="mobile-nav-link" 
              onClick={() => handleMobileNavClick(onFAQClick || (() => navigate('/faq')))}
            >
              FAQ
            </button>
            
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
                {/* 모바일 브릭 잔액 */}
                <div 
                  onClick={() => handleMobileNavClick(() => navigate('/partner'))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    margin: '10px 0',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🧱</span>
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: '800', 
                    fontSize: '1.1rem'
                  }}>
                    {totalBricks.toLocaleString()} 브릭
                  </span>
                </div>
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
