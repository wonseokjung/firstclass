import React, { useState } from 'react';
import { ChevronRight, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../services/azureTableService';
import NavigationBar from './NavigationBar';

interface LoginPageProps {
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // 이메일 validation
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 패스워드 validation
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Azure Table Storage로 사용자 인증
      const user = await AzureTableService.validateUser(formData.email, formData.password);
      
      if (!user) {
        setErrors({ general: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        setIsLoading(false);
        return;
      }

      // 세션 생성
      const sessionId = await AzureTableService.createSession(user.rowKey);

      // 세션 동안 사용자 정보 유지 (localStorage도 함께 저장)
      const userInfo = {
        userId: user.rowKey,
        email: user.email,
        name: user.name,
        sessionId: sessionId
      };
      
      sessionStorage.setItem('clathon_user_session', JSON.stringify(userInfo));
      localStorage.setItem('clathon_user', JSON.stringify(userInfo));
      console.log('💾 사용자 세션 정보 저장:', userInfo);
      
      alert(`${user.name}님, 환영합니다!`);
      navigate('/');
      
    } catch (error) {
      console.error('로그인 에러:', error);
      setErrors({ general: '로그인에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="auth-page">
      {/* 통일된 네비게이션바 */}
      <NavigationBar 
        onBack={onBack}
        showSearch={true}
        breadcrumbText="로그인"
        onSignUpClick={handleSignUpClick}
      />

      {/* 로그인 폼 */}
      <div className="auth-content">
        <div className="auth-container">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h1 className="auth-title">로그인</h1>
              <p className="auth-subtitle">CLATHON에서 AI 전문가가 되어보세요</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {errors.general && (
                <div className="error-message general-error">
                  <AlertCircle size={20} />
                  <span>{errors.general}</span>
                </div>
              )}

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
                    placeholder="비밀번호를 입력하세요"
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

              <div className="form-options">
                <div className="forgot-password">
                  <button type="button" className="link-button">
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <div className="auth-footer">
              <p className="auth-switch">
                계정이 없으신가요?{' '}
                <button 
                  type="button" 
                  className="link-button primary"
                  onClick={handleSignUpClick}
                >
                  회원가입
                </button>
              </p>
            </div>
          </div>

          <div className="auth-benefits">
            <h3>CLATHON에서 얻을 수 있는 것</h3>
            <ul>
              <li>🚀 AI 전문가 수준의 실전 강의</li>
              <li>💎 평생 소장 가능한 프리미엄 콘텐츠</li>
              <li>👨‍💻 1:1 멘토링 및 질문 답변</li>
              <li>🏆 수료증 및 포트폴리오 지원</li>
              <li>🌟 AI 업계 네트워킹 기회</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 