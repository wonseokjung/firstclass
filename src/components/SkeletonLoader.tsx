import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'video';
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  variant = 'card', 
  width = '100%', 
  height = 'auto',
  className = ''
}) => {
  const baseStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-loading 1.5s infinite',
    borderRadius: '8px',
    width,
    height,
  };

  const variants = {
    card: {
      ...baseStyle,
      height: height === 'auto' ? '200px' : height,
      borderRadius: '12px',
    },
    text: {
      ...baseStyle,
      height: height === 'auto' ? '20px' : height,
      borderRadius: '4px',
      marginBottom: '8px',
    },
    avatar: {
      ...baseStyle,
      width: width === '100%' ? '48px' : width,
      height: height === 'auto' ? '48px' : height,
      borderRadius: '50%',
    },
    button: {
      ...baseStyle,
      height: height === 'auto' ? '44px' : height,
      borderRadius: '8px',
    },
    video: {
      ...baseStyle,
      height: height === 'auto' ? '200px' : height,
      aspectRatio: '16/9',
      borderRadius: '10px',
    }
  };

  return (
    <>
      <style>{`
        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
      <div 
        className={className}
        style={variants[variant]}
        role="progressbar"
        aria-label="로딩 중..."
      />
    </>
  );
};

// 다양한 레이아웃을 위한 프리셋 컴포넌트들
export const SkeletonCard: React.FC = () => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  }}>
    <SkeletonLoader variant="text" width="70%" height="24px" />
    <SkeletonLoader variant="text" width="100%" height="16px" />
    <SkeletonLoader variant="text" width="90%" height="16px" />
    <div style={{ marginTop: '16px' }}>
      <SkeletonLoader variant="button" width="120px" />
    </div>
  </div>
);

export const SkeletonCourseCard: React.FC = () => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid #333',
    borderRadius: '15px',
    padding: '25px',
    marginBottom: '20px'
  }}>
    <SkeletonLoader variant="video" width="100%" />
    <div style={{ marginTop: '20px' }}>
      <SkeletonLoader variant="text" width="80%" height="20px" />
      <SkeletonLoader variant="text" width="60%" height="16px" />
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <SkeletonLoader variant="text" width="80px" height="14px" />
        <SkeletonLoader variant="text" width="60px" height="14px" />
      </div>
    </div>
  </div>
);

export const SkeletonUserStats: React.FC = () => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center' as const
  }}>
    <SkeletonLoader variant="text" width="40%" height="48px" />
    <SkeletonLoader variant="text" width="60%" height="16px" />
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: '20px',
      marginTop: '20px'
    }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i}>
          <SkeletonLoader variant="text" width="60px" height="32px" />
          <SkeletonLoader variant="text" width="100%" height="14px" />
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonLoader;


