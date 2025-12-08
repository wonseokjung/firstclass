import React, { useState } from 'react';
import { Mail, X, AlertCircle, CheckCircle } from 'lucide-react';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetRequest: (email: string) => Promise<boolean>;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
  onResetRequest
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await onResetRequest(email);
      if (result) {
        setSuccess(true);
      } else {
        setError('등록되지 않은 이메일입니다.');
      }
    } catch (error) {
      console.error('비밀번호 재설정 요청 실패:', error);
      setError('비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content password-reset-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">비밀번호 재설정</h2>
          <button
            type="button"
            className="modal-close-button"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {success ? (
            <div className="password-reset-success">
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>
              <h3>재설정 링크가 전송되었습니다!</h3>
              <p>
                <strong>{email}</strong>로 비밀번호 재설정 링크를 전송했습니다.
                <br />
                이메일을 확인하고 링크를 클릭하여 새 비밀번호를 설정해주세요.
              </p>
              <p className="reset-note">
                이메일이 도착하지 않으면 스팸함을 확인해주세요.
                <br />
                문제가 지속되면 고객센터(jay@connexionai.kr)로 문의해주세요.
              </p>
              <button
                type="button"
                className="auth-submit-button"
                onClick={handleClose}
              >
                확인
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="password-reset-form">
              {/* 개발 중 안내 */}
              <div style={{
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                border: '2px solid #fbbf24',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚧</div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#92400e',
                  marginBottom: '12px'
                }}>
                  비밀번호 찾기 기능 개발 중
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: '#78350f',
                  lineHeight: '1.7',
                  margin: '0 0 15px 0'
                }}>
                  현재 자동 비밀번호 재설정 기능을 개발 중입니다.<br />
                  비밀번호 재설정이 필요하신 경우,<br />
                  아래 연락처로 문의해주세요.
                </p>
                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '15px',
                  border: '1px solid #fbbf24'
                }}>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#92400e',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    📧 이메일: <strong>jay@connexionai.kr</strong>
                  </p>
                </div>
              </div>

              <p className="reset-description" style={{ display: 'none' }}>
                가입하신 이메일 주소를 입력하시면, 비밀번호 재설정 링크를 보내드립니다.
              </p>

              <div className="form-group" style={{ display: 'none' }}>
                <label htmlFor="reset-email" className="form-label">
                  <Mail size={20} />
                  이메일 주소
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`form-input ${error ? 'error' : ''}`}
                  placeholder="your@email.com"
                  disabled={true}
                  autoFocus
                />
                {error && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel-button"
                  onClick={handleClose}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  확인
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;
