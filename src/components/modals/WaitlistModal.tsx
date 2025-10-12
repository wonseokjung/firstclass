import React from 'react';
import { X, Clock, Rocket, Calendar, Bell } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose, courseTitle }) => {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content coming-soon-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-body">
          <div className="coming-soon-content">
            <div className="coming-soon-icon">
              <Rocket size={64} style={{ color: 'var(--color-primary)' }} />
            </div>
            
            <h2 className="modal-title">🚀 곧 오픈 예정!</h2>
            
            <p className="modal-subtitle">
              <strong>{courseTitle}</strong>
            </p>
            
            <p className="coming-soon-description">
              더 나은 콘텐츠와 혁신적인 교육 경험을 위해<br/>
              열심히 준비하고 있습니다! 💪
            </p>

            <div className="coming-soon-features">
              <div className="feature-item">
                <Calendar size={24} style={{ color: 'var(--color-primary)' }} />
                <span>2024년 하반기 런칭 예정</span>
              </div>
              
              <div className="feature-item">
                <Bell size={24} style={{ color: 'var(--color-primary)' }} />
                <span>SNS에서 최신 소식 확인</span>
              </div>
              
              <div className="feature-item">
                <Clock size={24} style={{ color: 'var(--color-primary)' }} />
                <span>더 완성도 높은 강의로 찾아뵙겠습니다</span>
              </div>
            </div>

            <div className="coming-soon-cta">
              <p>현재 이용 가능한 다른 강의들을 둘러보세요!</p>
              <button className="coming-soon-btn" onClick={onClose}>
                다른 강의 보기 📚
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
