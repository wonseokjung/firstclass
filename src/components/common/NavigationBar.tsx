import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AzureTableService from '../../services/azureTableService';

// 브랜드 테마: 네이비 + 골드
const brandTheme = {
  navy: '#0f2744',
  navyLight: '#1e3a5f',
  gold: '#ffd60a',
  goldDark: '#e5c100',
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
  const { t, i18n } = useTranslation();
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

  // 현재 영어 페이지인지 확인 (경로 기반)
  const isEnglishPage = window.location.pathname.startsWith('/en');
  
  // 언어 전환 함수 - 페이지 이동
  const toggleLanguage = () => {
    if (isEnglishPage) {
      // 영어 → 한국어: 메인 페이지로 이동
      i18n.changeLanguage('ko');
      navigate('/');
    } else {
      // 한국어 → 영어: /en 페이지로 이동
      i18n.changeLanguage('en');
      navigate('/en');
    }
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
            {t('nav.myCourses')}
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
          <span className="user-welcome">{t('nav.welcome', { name: userInfo?.name || userInfo?.email })}</span>
          <button
            className="nav-link"
            onClick={handleLogout}
          >
            {t('nav.logout')}
          </button>
        </>
      );
    } else {
      return (
        <>
          <button
            className="nav-link login-btn"
            onClick={onLoginClick || (() => navigate('/login'))}
            style={{
              background: 'transparent',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.9rem',
              border: '2px solid #ffd60a',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#ffd60a';
              e.currentTarget.style.color = '#0d1b2a';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {t('nav.login')}
          </button>
          <button className="cta-button" onClick={onSignUpClick || (() => navigate('/signup'))}>{t('nav.signup')}</button>
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
                border: '2px solid #ffd60a',
                boxShadow: '0 2px 10px rgba(251, 191, 36, 0.3)'
              }}
            />
            <span className="logo-text">AI City Builders</span>
          </div>
        </div>

        {/* 데스크탑 네비게이션 */}
        <div className="header-right desktop-nav">
          <button
            className="nav-link"
            onClick={() => navigate('/ceo')}
            style={{
              ...navButtonStyle,
              background: 'transparent',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {t('nav.about')}
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
            {t('nav.community')}
          </button>
          <button
            className="nav-link"
            onClick={() => navigate('/live')}
            style={{
              ...navButtonStyle,
              background: '#dc2626',
              color: '#ffffff'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#ef4444';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {t('nav.live')}
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
            {t('nav.partner')}
          </button>
          <button
            className="nav-link"
            onClick={onFAQClick || (() => navigate('/faq'))}
            style={{
              ...navButtonStyle,
              background: 'transparent',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {t('nav.faq')}
          </button>

          {/* 언어 전환 버튼 */}
          <button
            onClick={toggleLanguage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            <Globe size={16} />
            {isEnglishPage ? '🇺🇸 EN' : '🇰🇷 KO'}
          </button>

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
              onClick={() => handleMobileNavClick(() => navigate('/live'))}
              style={{
                background: '#dc2626',
                color: '#ffffff',
                fontWeight: '700'
              }}
            >
              📺 라이브
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

            {/* 모바일 언어 전환 */}
            <button
              className="mobile-nav-link"
              onClick={() => handleMobileNavClick(toggleLanguage)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <Globe size={18} />
              {isEnglishPage ? '🇰🇷 한국어' : '🇺🇸 English'}
            </button>

            {isLoggedIn ? (
              <>
                <button
                  className="mobile-nav-link"
                  onClick={() => handleMobileNavClick(() => navigate('/dashboard'))}
                >
                  📚 {isEnglishPage ? 'My Courses' : '내 강의 보기'}
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
