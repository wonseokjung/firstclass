import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';

interface NavigationBarProps {
  onBack?: () => void;
  onFAQClick?: () => void;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  breadcrumbText?: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  onBack,
  onFAQClick,
  onLoginClick,
  onSignUpClick,
  showSearch = true,
  searchPlaceholder = "What do you want to learn...",
  breadcrumbText
}) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // 로그인 상태 확인
    const storedUserInfo = sessionStorage.getItem('clathon_user_session');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setIsLoggedIn(true);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        sessionStorage.removeItem('clathon_user_session');
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
    sessionStorage.removeItem('clathon_user_session');
    localStorage.removeItem('clathon_user');
    setIsLoggedIn(false);
    setUserInfo(null);
    alert('로그아웃되었습니다.');
    navigate('/', { replace: true });
  };

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <>
          <button 
            className="nav-link" 
            onClick={() => navigate('/dashboard')}
          >
            마이페이지
          </button>
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
            <span className="logo-text">CLATHON</span>
          </div>
          <div className="browse-dropdown">
            <button 
              className="browse-btn"
              aria-label="Browse AI & Technology courses"
              aria-expanded="false"
            >
              {breadcrumbText || "AI & Technology"} <ChevronDown size={16} />
            </button>
          </div>
        </div>
        
        {showSearch && (
          <div className="search-container">
            <Search size={20} className="search-icon" aria-hidden="true" />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              className="search-input"
              aria-label="Search for courses"
              role="searchbox"
            />
          </div>
        )}
        
        <div className="header-right">
          <button className="nav-link" onClick={() => window.location.href = '/ceo'}>CEO</button>
          <button className="nav-link" onClick={onFAQClick || (() => navigate('/faq'))}>FAQ</button>
          {renderAuthButtons()}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
