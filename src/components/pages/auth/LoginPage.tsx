import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../../services/azureTableService';
import NavigationBar from '../../common/NavigationBar';
import PasswordResetModal from '../../modals/PasswordResetModal';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    // 이전에 자동 로그인을 체크했는지 확인
    return localStorage.getItem('aicitybuilders_remember_me') === 'true';
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

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
      console.log('🔐 로그인 시도:', formData.email);

      // Azure Table Storage로 사용자 인증
      const user = await AzureTableService.validateUser(formData.email, formData.password);

      if (!user) {
        console.error('❌ 로그인 실패: 사용자를 찾을 수 없거나 비밀번호가 일치하지 않습니다.');
        console.error('입력 이메일:', formData.email);
        console.error('입력 비밀번호 길이:', formData.password.length);

        setErrors({
          general: '이메일 또는 비밀번호가 올바르지 않습니다.\n\n디버그 정보:\n- 이메일: ' + formData.email + '\n- 비밀번호 길이: ' + formData.password.length + '자\n- 브라우저: ' + navigator.userAgent.split(' ').slice(-1)[0] + '\n\n문제가 계속되면 관리자에게 위 정보를 공유해주세요.'
        });
        setIsLoading(false);
        return;
      }

      console.log('✅ 사용자 인증 성공:', user.email);

      // 세션 생성
      const sessionId = await AzureTableService.createSession(user.rowKey);

      // 세션 동안 사용자 정보 유지
      const userInfo = {
        userId: user.rowKey,
        email: user.email,
        name: user.name,
        sessionId: sessionId
      };

      sessionStorage.setItem('aicitybuilders_user_session', JSON.stringify(userInfo));

      // 자동 로그인 설정
      if (rememberMe) {
        localStorage.setItem('aicitybuilders_remember_me', 'true');
        localStorage.setItem('aicitybuilders_user', JSON.stringify(userInfo));
        console.log('💾 자동 로그인 활성화');
      } else {
        localStorage.removeItem('aicitybuilders_remember_me');
        localStorage.removeItem('aicitybuilders_user');
        console.log('💾 자동 로그인 비활성화');
      }
      console.log('💾 사용자 세션 정보 저장:', userInfo);

      alert(`${user.name}님, 환영합니다!`);

      // 로그인 후 리다이렉트 URL 확인
      const redirectUrl = sessionStorage.getItem('redirect_after_login');
      if (redirectUrl) {
        sessionStorage.removeItem('redirect_after_login'); // 사용 후 제거
        console.log('🔄 저장된 리다이렉트 URL로 이동:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error('💥 로그인 에러:', error);

      let debugInfo = '\n\n🔍 디버그 정보:\n';
      debugInfo += '━━━━━━━━━━━━━━━━\n';
      debugInfo += '📧 이메일: ' + formData.email + '\n';
      debugInfo += '🕐 시간: ' + new Date().toLocaleString('ko-KR') + '\n';
      debugInfo += '🌐 브라우저: ' + navigator.userAgent.split(' ').slice(-1)[0] + '\n';

      if (error instanceof Error) {
        debugInfo += '⚠️ 에러 타입: ' + error.name + '\n';
        debugInfo += '💬 에러 메시지: ' + error.message + '\n';

        // 네트워크 오류 특별 처리
        if (error.message.includes('네트워크') || error.message.includes('불러올 수 없습니다')) {
          setErrors({
            general: '🌐 서버 연결 문제가 발생했습니다.\n\n다음을 확인해주세요:\n' +
              '1️⃣ 인터넷 연결 상태\n' +
              '2️⃣ 회원가입이 완료되었는지 확인\n' +
              '3️⃣ 이메일 주소가 정확한지 확인\n' +
              '\n잠시 후 다시 시도해주세요.\n' +
              '문제가 계속되면 아래 정보를 관리자에게 공유해주세요.' + debugInfo
          });
        } else {
          setErrors({
            general: '로그인에 실패했습니다.' + debugInfo + '\n━━━━━━━━━━━━━━━━\n관리자에게 위 정보를 공유해주세요.'
          });
        }
      } else {
        setErrors({
          general: '알 수 없는 오류가 발생했습니다.' + debugInfo + '\n━━━━━━━━━━━━━━━━\n관리자에게 위 정보를 공유해주세요.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handlePasswordResetRequest = async (email: string): Promise<boolean> => {
    try {
      const success = await AzureTableService.requestPasswordReset(email);
      return success;
    } catch (error) {
      console.error('비밀번호 재설정 요청 실패:', error);
      return false;
    }
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="auth-page">
      {/* 통일된 네비게이션바 */}
      <NavigationBar
        onBack={onBack}
        breadcrumbText="로그인"
        onSignUpClick={handleSignUpClick}
      />

      {/* 로그인 폼 */}
      <div className="auth-content">
        <div className="auth-container">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h1 className="auth-title">로그인</h1>
              <p className="auth-subtitle">AI 1인 기업가 여정을 시작하세요</p>
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

              <div className="form-options" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  color: '#64748b'
                }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#d4af37',
                      cursor: 'pointer'
                    }}
                  />
                  자동 로그인
                </label>
                <div className="forgot-password">
                  <button
                    type="button"
                    className="link-button"
                    onClick={handleForgotPasswordClick}
                  >
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
            <h3>AI City Builders에서 얻을 수 있는 것</h3>
            <ul>
              <li>🚀 AI 전문가 수준의 실전 강의</li>
              <li>💎 구매 후 3개월간 이용 가능한 프리미엄 콘텐츠</li>
              <li>🏆 수료증 및 포트폴리오 지원</li>
              <li>🌟 AI 업계 네트워킹 기회</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 비밀번호 재설정 모달 */}
      <PasswordResetModal
        isOpen={showPasswordResetModal}
        onClose={() => setShowPasswordResetModal(false)}
        onResetRequest={handlePasswordResetRequest}
      />
    </div>
  );
};

export default LoginPage; 