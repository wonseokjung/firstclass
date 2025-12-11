import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, User, Check, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../../services/azureTableService';
import NavigationBar from '../../common/NavigationBar';
import { useReferralTracking } from '../../../hooks/useReferralTracking';

interface SignUpPageProps {
  onBack: () => void;
}

// 전 세계 국가 코드 목록 (각 국가의 현지 언어로 표시)
const COUNTRY_CODES = [
  // 아시아/오세아니아
  { code: '+82', country: '대한민국 (Korea)', flag: '🇰🇷' },
  { code: '+81', country: '日本 (Japan)', flag: '🇯🇵' },
  { code: '+86', country: '中国 (China)', flag: '🇨🇳' },
  { code: '+852', country: '香港 (Hong Kong)', flag: '🇭🇰' },
  { code: '+853', country: '澳門 (Macau)', flag: '🇲🇴' },
  { code: '+886', country: '台灣 (Taiwan)', flag: '🇹🇼' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+66', country: 'ไทย (Thailand)', flag: '🇹🇭' },
  { code: '+84', country: 'Việt Nam', flag: '🇻🇳' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
  { code: '+855', country: 'កម្ពុជា (Cambodia)', flag: '🇰🇭' },
  { code: '+856', country: 'ລາວ (Laos)', flag: '🇱🇦' },
  { code: '+673', country: 'Brunei', flag: '🇧🇳' },
  { code: '+91', country: 'भारत (India)', flag: '🇮🇳' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', country: 'नेपाल (Nepal)', flag: '🇳🇵' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  
  // 북미/남미
  { code: '+1', country: 'United States/Canada', flag: '🇺🇸' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  
  // 유럽
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Deutschland', flag: '🇩🇪' },
  { code: '+39', country: 'Italia', flag: '🇮🇹' },
  { code: '+34', country: 'España', flag: '🇪🇸' },
  { code: '+31', country: 'Nederland', flag: '🇳🇱' },
  { code: '+32', country: 'België/Belgique', flag: '🇧🇪' },
  { code: '+41', country: 'Schweiz/Suisse', flag: '🇨🇭' },
  { code: '+43', country: 'Österreich', flag: '🇦🇹' },
  { code: '+46', country: 'Sverige', flag: '🇸🇪' },
  { code: '+47', country: 'Norge', flag: '🇳🇴' },
  { code: '+45', country: 'Danmark', flag: '🇩🇰' },
  { code: '+358', country: 'Suomi', flag: '🇫🇮' },
  { code: '+48', country: 'Polska', flag: '🇵🇱' },
  { code: '+420', country: 'Česko', flag: '🇨🇿' },
  { code: '+36', country: 'Magyarország', flag: '🇭🇺' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+30', country: 'Ελλάδα (Greece)', flag: '🇬🇷' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+7', country: 'Россия (Russia)', flag: '🇷🇺' },
  { code: '+380', country: 'Україна (Ukraine)', flag: '🇺🇦' },
  { code: '+90', country: 'Türkiye', flag: '🇹🇷' },
  
  // 중동/아프리카
  { code: '+971', country: 'الإمارات (UAE)', flag: '🇦🇪' },
  { code: '+966', country: 'السعودية (Saudi Arabia)', flag: '🇸🇦' },
  { code: '+972', country: 'ישראל (Israel)', flag: '🇮🇱' },
  { code: '+20', country: 'مصر (Egypt)', flag: '🇪🇬' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
];

const SignUpPage: React.FC<SignUpPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { getStoredReferralCode, clearReferralCode } = useReferralTracking();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: '+82', // 기본값: 한국
    phone: ''
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

    // 핸드폰 번호 validation (국내외 모두 허용)
    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = '전화번호는 최소 8자 이상이어야 합니다.';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = '전화번호는 숫자, +, -, (), 공백만 입력 가능합니다.';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      console.log('📝 회원가입 시도:', formData.email);
      console.log('- 이름:', formData.name);
      console.log('- 전화번호:', formData.phone);
      console.log('- 비밀번호 길이:', formData.password.length);
      
      // 이메일 중복 확인
      const existingUser = await AzureTableService.getUserByEmail(formData.email);
      if (existingUser) {
        console.warn('⚠️ 이메일 중복:', formData.email);
        setErrors({ email: '이미 등록된 이메일입니다.' });
        setIsLoading(false);
        return;
      }
      
      console.log('✅ 이메일 중복 확인 통과');

      // 세션에서 추천 코드 자동 가져오기
      const storedReferralCode = getStoredReferralCode();
      
      // Azure Table Storage에 사용자 생성
      const userData = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        countryCode: formData.countryCode, // 국가 코드 저장
        phone: formData.phone.replace(/\s+/g, ''), // 공백 제거
        marketingAgreed: agreements.marketing,
        referredBy: storedReferralCode || undefined
      };
      const newUser = await AzureTableService.createUser(userData);

      // 회원가입 완료 후 세션에서 추천 코드 제거 (브릭 적립용 referralInfo는 유지)
      if (storedReferralCode) {
        clearReferralCode();
      }

      console.log('✅ 회원가입 성공:', newUser);
      alert(`${newUser.name}님, 회원가입이 완료되었습니다!\n로그인해주세요.`);
      navigate('/login');
      
    } catch (error) {
      console.error('회원가입 에러:', error);
      
      // 에러 메시지를 더 구체적으로 표시
      console.error('💥 회원가입 에러 상세:', error);
      
      let debugInfo = '\n\n디버그 정보:\n';
      debugInfo += '- 이메일: ' + formData.email + '\n';
      debugInfo += '- 이름: ' + formData.name + '\n';
      debugInfo += '- 전화번호: ' + formData.phone + '\n';
      debugInfo += '- 비밀번호 길이: ' + formData.password.length + '자\n';
      debugInfo += '- 시간: ' + new Date().toLocaleString('ko-KR') + '\n';
      debugInfo += '- 브라우저: ' + navigator.userAgent.split(' ').slice(-1)[0] + '\n';
      
      if (error instanceof Error) {
        debugInfo += '- 에러 타입: ' + error.name + '\n';
        debugInfo += '- 에러 메시지: ' + error.message + '\n';
        
        if (error.message.includes('already exists')) {
          setErrors({ email: '이미 등록된 이메일입니다.' });
        } else if (error.message.includes('네트워크') || error.message.includes('network')) {
          setErrors({ general: '네트워크 연결이 불안정합니다.' + debugInfo });
        } else if (error.message.includes('저장소') || error.message.includes('connection')) {
          setErrors({ general: '서버 연결에 실패했습니다.' + debugInfo });
        } else {
          setErrors({ general: '회원가입에 실패했습니다.' + debugInfo + '\n관리자에게 위 정보를 공유해주세요.' });
        }
      } else {
        setErrors({ general: '알 수 없는 오류가 발생했습니다.' + debugInfo + '\n관리자에게 위 정보를 공유해주세요.' });
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
      {/* 통일된 네비게이션바 */}
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="회원가입"
        onLoginClick={handleLoginClick}
      />

      {/* 회원가입 폼 */}
      <div className="auth-content">
        <div className="auth-container">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h1 className="auth-title">회원가입</h1>
              <p className="auth-subtitle">AI 크리에이터 여정을 시작하세요</p>
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

              {/* 전화번호 입력 필드 (국가코드 선택 + 번호 입력) */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <Phone size={18} />
                  전화번호
                </label>
                <div style={{ 
                  display: 'flex', 
                  gap: '10px',
                  alignItems: 'flex-start'
                }}>
                  {/* 국가코드 드롭다운 */}
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    style={{
                      flex: '0 0 140px',
                      padding: '12px 16px',
                      fontSize: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0ea5e9';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {COUNTRY_CODES.map(({ code, country, flag }) => (
                      <option key={code} value={code}>
                        {flag} {code} {country}
                      </option>
                    ))}
                  </select>

                  {/* 전화번호 입력 */}
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder={
                      formData.countryCode === '+82' 
                        ? '010-1234-5678' 
                        : '123-456-7890'
                    }
                  disabled={isLoading}
                    style={{ flex: 1 }}
                />
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#64748b',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  💡 국가 코드를 선택하고 전화번호를 입력하세요
                </div>
                {errors.phone && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{errors.phone}</span>
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
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 