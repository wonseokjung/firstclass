import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../services/azureTableService';
import EmailService from '../../services/emailService';

const BRAND_NAVY = '#0b1220';
const BRAND_GOLD = '#facc15';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>(''); // 테스트용

  // 이메일 유효성 검사
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 1단계: 이메일 입력 및 코드 발송
  const handleSendCode = async () => {
    if (!email) {
      alert('이메일을 입력하세요.');
      return;
    }

    if (!isValidEmail(email)) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setIsLoading(true);
    try {
      const generatedCode = await AzureTableService.generatePasswordResetCode(email);
      
      if (!generatedCode) {
        alert('등록되지 않은 이메일입니다.');
        return;
      }

      // 이메일로 코드 발송
      const emailSent = await EmailService.sendPasswordResetCode(email, generatedCode);
      
      if (emailSent) {
        setGeneratedCode(generatedCode);
        alert(`✅ 인증 코드가 이메일로 전송되었습니다!\n\n이메일을 확인하세요: ${email}\n\n(테스트용 코드: ${generatedCode})`);
        setStep('code');
      } else {
        alert('⚠️ 이메일 발송에 실패했습니다.\n\n테스트용 코드: ' + generatedCode + '\n\n이 코드로 계속 진행할 수 있습니다.');
        setGeneratedCode(generatedCode);
        setStep('code');
      }
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2단계: 코드 검증 및 비밀번호 재설정
  const handleResetPassword = async () => {
    if (!code) {
      alert('인증 코드를 입력하세요.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      alert('새 비밀번호를 입력하세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 4) {
      alert('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await AzureTableService.resetPassword(email, code, newPassword);
      
      if (!success) {
        alert('인증 코드가 올바르지 않거나 만료되었습니다.');
        return;
      }

      setStep('success');
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate('/login')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '10px 15px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: BRAND_NAVY,
          fontWeight: 600,
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f8fafc';
          e.currentTarget.style.transform = 'translateX(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <ArrowLeft size={18} />
        로그인으로 돌아가기
      </button>

      {/* 메인 컨텐츠 */}
      <div style={{
        maxWidth: '450px',
        margin: '80px auto 0',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.15)'
      }}>
        {/* 이메일 입력 단계 */}
        {step === 'email' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, #1e40af 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Lock size={30} color="white" />
              </div>
              <h1 style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: BRAND_NAVY,
                margin: '0 0 10px 0'
              }}>
                비밀번호 찾기
              </h1>
              <p style={{
                color: '#64748b',
                fontSize: '0.95rem',
                margin: 0
              }}>
                가입하신 이메일 주소를 입력하세요.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: BRAND_NAVY,
                fontWeight: 600,
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                이메일 주소
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={20}
                  color="#94a3b8"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendCode()}
                  placeholder="email@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 45px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = BRAND_GOLD}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <button
              onClick={handleSendCode}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, #1e40af 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {isLoading ? '처리 중...' : '인증 코드 받기'}
            </button>
          </>
        )}

        {/* 코드 입력 및 비밀번호 재설정 단계 */}
        {step === 'code' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: `linear-gradient(135deg, ${BRAND_GOLD} 0%, #fbbf24 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <Mail size={30} color={BRAND_NAVY} />
              </div>
              <h1 style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: BRAND_NAVY,
                margin: '0 0 10px 0'
              }}>
                인증 코드 입력
              </h1>
              <p style={{
                color: '#64748b',
                fontSize: '0.9rem',
                margin: 0
              }}>
                <strong>{email}</strong>로 전송된<br />
                6자리 인증 코드를 입력하세요.
              </p>
              {generatedCode && (
                <div style={{
                  marginTop: '15px',
                  padding: '10px',
                  background: '#fef3c7',
                  borderRadius: '8px',
                  border: '2px solid #fbbf24'
                }}>
                  <p style={{
                    margin: 0,
                    color: '#92400e',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    🔐 테스트 코드: {generatedCode}
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: BRAND_NAVY,
                fontWeight: 600,
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                인증 코드 (6자리)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1.5rem',
                  textAlign: 'center',
                  letterSpacing: '8px',
                  fontWeight: 700,
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = BRAND_GOLD}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                color: BRAND_NAVY,
                fontWeight: 600,
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                새 비밀번호
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="최소 4자 이상"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = BRAND_GOLD}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                color: BRAND_NAVY,
                fontWeight: 600,
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                placeholder="비밀번호 재입력"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = BRAND_GOLD}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: `linear-gradient(135deg, ${BRAND_GOLD} 0%, #fbbf24 100%)`,
                color: BRAND_NAVY,
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {isLoading ? '처리 중...' : '비밀번호 재설정'}
            </button>

            <button
              onClick={() => setStep('email')}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              이메일 다시 입력
            </button>
          </>
        )}

        {/* 성공 화면 */}
        {step === 'success' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 25px'
              }}>
                <CheckCircle size={40} color="white" />
              </div>
              <h1 style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: BRAND_NAVY,
                margin: '0 0 15px 0'
              }}>
                비밀번호 변경 완료!
              </h1>
              <p style={{
                color: '#64748b',
                fontSize: '1rem',
                lineHeight: 1.6,
                marginBottom: '30px'
              }}>
                비밀번호가 성공적으로 변경되었습니다.<br />
                새 비밀번호로 로그인해주세요.
              </p>
              <button
                onClick={() => navigate('/login')}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, #1e40af 100%)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                로그인하러 가기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

