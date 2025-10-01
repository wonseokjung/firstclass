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
                문제가 지속되면 고객센터(support@aicitybuilders.com)로 문의해주세요.
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
              <p className="reset-description">
                가입하신 이메일 주소를 입력하시면, 비밀번호 재설정 링크를 보내드립니다.
              </p>

              <div className="form-group">
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="auth-submit-button"
                  disabled={isLoading || !email.trim()}
                >
                  {isLoading ? '전송 중...' : '재설정 링크 전송'}
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
