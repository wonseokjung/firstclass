import React from 'react';
import { X, Rocket } from 'lucide-react';

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
