import React, { useState } from 'react';
import { ChevronRight, Search, Mail, Lock, Eye, EyeOff, AlertCircle, User, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../services/azureTableService';

interface SignUpPageProps {
  onBack: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // 이름 validation
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.';
    }

    // 이메일 validation
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 패스워드 validation
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문과 숫자를 포함해야 합니다.';
    }

    // 패스워드 확인 validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 약관 동의 validation
    if (!agreements.terms) {
      newErrors.terms = '서비스 이용약관에 동의해주세요.';
    }
    if (!agreements.privacy) {
      newErrors.privacy = '개인정보 처리방침에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAgreementChange = (type: keyof typeof agreements) => {
    setAgreements(prev => ({
      ...prev,
      [type]: !prev[type]
    }));

    // 체크 시 해당 필드의 에러 제거
    if (errors[type]) {
      setErrors(prev => ({
        ...prev,
        [type]: ''
      }));
    }
  };

  const handleAllAgreements = () => {
    const allChecked = agreements.terms && agreements.privacy && agreements.marketing;
    setAgreements({
      terms: !allChecked,
      privacy: !allChecked,
      marketing: !allChecked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // 이메일 중복 확인
      const existingUser = await AzureTableService.getUserByEmail(formData.email);
      if (existingUser) {
        setErrors({ email: '이미 등록된 이메일입니다.' });
        setIsLoading(false);
        return;
      }

      // Azure Table Storage에 사용자 생성
      const userData = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        marketingAgreed: agreements.marketing
      };
      const newUser = await AzureTableService.createUser(userData);

      console.log('회원가입 성공:', newUser);
      alert(`${newUser.name}님, 회원가입이 완료되었습니다! 로그인해주세요.`);
      navigate('/login');
      
    } catch (error) {
      console.error('회원가입 에러:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        setErrors({ email: '이미 등록된 이메일입니다.' });
      } else {
        setErrors({ general: '회원가입에 실패했습니다. 다시 시도해주세요.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="auth-page">
      {/* 헤더 */}
      <header className="masterclass-header-original">
        <div className="header-content">
          <div className="header-left">
            <div className="logo" onClick={onBack} style={{ cursor: 'pointer' }}>
              <span className="logo-icon">C</span>
              <span className="logo-text">CLATHON</span>
            </div>
            <div className="browse-dropdown">
              <button 
                className="browse-btn"
                aria-label="Browse AI & Technology courses"
                aria-expanded="false"
              >
                AI & Technology <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="search-container">
            <Search size={20} className="search-icon" aria-hidden="true" />
            <input 
              type="text" 
              placeholder="What do you want to learn..." 
              className="search-input"
              aria-label="Search for courses"
              role="searchbox"
            />
          </div>
          
          <div className="header-right">
            <button className="nav-link" onClick={onBack}>돌아가기</button>
            <button className="nav-link">FAQ</button>
            <button className="nav-link">View Plans</button>
            <button className="nav-link" onClick={handleLoginClick}>로그인</button>
            <button className="cta-button">Get CLATHON</button>
          </div>
        </div>
      </header>

      {/* 회원가입 폼 */}
      <div className="auth-content">
        <div className="auth-container">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h1 className="auth-title">회원가입</h1>
              <p className="auth-subtitle">AI 전문가로의 여정을 시작하세요</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {errors.general && (
                <div className="error-message general-error">
                  <AlertCircle size={20} />
                  <span>{errors.general}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <User size={20} />
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="이름을 입력하세요"
                  disabled={isLoading}
                />
                {errors.name && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail size={20} />
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Lock size={20} />
                  비밀번호
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="8자 이상, 영문+숫자 포함"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <Lock size={20} />
                  비밀번호 확인
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="비밀번호를 다시 입력하세요"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              <div className="agreements-section">
                <div className="agreement-item all-agreement">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreements.terms && agreements.privacy && agreements.marketing}
                      onChange={handleAllAgreements}
                      disabled={isLoading}
                    />
                    <span className="checkbox-custom">
                      {agreements.terms && agreements.privacy && agreements.marketing && <Check size={16} />}
                    </span>
                    <span className="checkbox-text">전체 동의</span>
                  </label>
                </div>

                <div className="agreement-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreements.terms}
                      onChange={() => handleAgreementChange('terms')}
                      disabled={isLoading}
                    />
                    <span className="checkbox-custom">
                      {agreements.terms && <Check size={16} />}
                    </span>
                    <span className="checkbox-text">
                      <span className="required">[필수]</span> 서비스 이용약관 동의
                    </span>
                  </label>
                  {errors.terms && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      <span>{errors.terms}</span>
                    </div>
                  )}
                </div>

                <div className="agreement-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreements.privacy}
                      onChange={() => handleAgreementChange('privacy')}
                      disabled={isLoading}
                    />
                    <span className="checkbox-custom">
                      {agreements.privacy && <Check size={16} />}
                    </span>
                    <span className="checkbox-text">
                      <span className="required">[필수]</span> 개인정보 처리방침 동의
                    </span>
                  </label>
                  {errors.privacy && (
                    <div className="error-message">
                      <AlertCircle size={16} />
                      <span>{errors.privacy}</span>
                    </div>
                  )}
                </div>

                <div className="agreement-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreements.marketing}
                      onChange={() => handleAgreementChange('marketing')}
                      disabled={isLoading}
                    />
                    <span className="checkbox-custom">
                      {agreements.marketing && <Check size={16} />}
                    </span>
                    <span className="checkbox-text">
                      <span className="optional">[선택]</span> 마케팅 정보 수신 동의
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={isLoading}
              >
                {isLoading ? '가입 중...' : '회원가입'}
              </button>
            </form>

            <div className="auth-footer">
              <p className="auth-switch">
                이미 계정이 있으신가요?{' '}
                <button 
                  type="button" 
                  className="link-button primary"
                  onClick={handleLoginClick}
                >
                  로그인
                </button>
              </p>
            </div>
          </div>

          <div className="auth-benefits">
            <h3>회원가입 혜택</h3>
            <ul>
              <li>🎁 회원가입 시 무료 강의 즉시 제공</li>
              <li>💰 신규 회원 전용 특별 할인</li>
              <li>📧 AI 트렌드 및 강의 업데이트 소식</li>
              <li>🏆 학습 진도 관리 및 수료증 발급</li>
              <li>💬 전문가 커뮤니티 참여</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 