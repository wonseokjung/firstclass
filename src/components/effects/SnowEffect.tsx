import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// 이벤트 기간 설정
const EVENT_START = new Date('2025-12-24T00:00:00');
const EVENT_END = new Date('2026-01-01T23:59:59');

const SnowEffect: React.FC = () => {
  const [isEventPeriod, setIsEventPeriod] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const now = new Date();
    setIsEventPeriod(now >= EVENT_START && now <= EVENT_END);
  }, []);

  // 메인 페이지('/')에서만 표시
  if (!isEventPeriod || location.pathname !== '/') return null;

  // 눈송이 개수
  const snowflakes = Array.from({ length: 35 }, (_, i) => i);

  return (
    <>
      <style>{`
        .snow-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }

        .snowflake {
          position: absolute;
          top: -20px;
          color: #fff;
          text-shadow: 0 0 5px rgba(255,255,255,0.8);
          animation: fall linear infinite;
        }

        @keyframes fall {
          0% {
            transform: translateY(-20px);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0.3;
          }
        }
      `}</style>

      <div className="snow-container">
        {snowflakes.map((i) => {
          const size = Math.random() * 8 + 10;
          const left = Math.random() * 100;
          const duration = Math.random() * 5 + 8;
          const delay = Math.random() * 10;
          const opacity = Math.random() * 0.4 + 0.5;

          return (
            <div
              key={i}
              className="snowflake"
              style={{
                left: `${left}%`,
                fontSize: `${size}px`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                opacity: opacity,
              }}
            >
              ❄
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SnowEffect;
