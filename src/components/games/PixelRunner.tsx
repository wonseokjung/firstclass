import React, { useState, useEffect, useRef } from 'react';

// 🎮 픽셀 러너 게임 컴포넌트 - AI Gym용

const TILE = 48;

// 스프라이트 경로
const SPRITES = {
  char01: '/images/game-assets/characters/Premade_Character_48x48_01.png',
  char02: '/images/game-assets/characters/Premade_Character_48x48_02.png',
  char03: '/images/game-assets/characters/Premade_Character_48x48_03.png',
  char04: '/images/game-assets/characters/Premade_Character_48x48_04.png',
  char05: '/images/game-assets/characters/Premade_Character_48x48_05.png',
};

interface RunnerProps {
  sprite?: keyof typeof SPRITES;
  direction?: 'left' | 'right' | 'down' | 'up';
  isRunning?: boolean;
  scale?: number;
}

// 개별 러너 캐릭터
export const PixelRunner: React.FC<RunnerProps> = ({ 
  sprite = 'char01', 
  direction = 'right', 
  isRunning = true,
  scale = 2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const img = new Image();
    img.onload = () => { spriteRef.current = img; };
    img.src = SPRITES[sprite];
  }, [sprite]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const spriteImg = spriteRef.current;
      if (spriteImg?.complete && spriteImg.naturalWidth > 0) {
        // 스프라이트 시트 구조: 24열 x 여러 행
        // row 1 = idle, row 2 = walking
        const CHAR_HEIGHT = TILE * 2;
        const row = isRunning ? 2 : 1;
        
        // 방향에 따른 열 오프셋 (스프라이트 시트 구조)
        // 이 스프라이트 시트: down=뒷통수, up=정면
        // down(뒷통수): 0-5, left: 6-11, right: 12-17, up(정면): 18-23
        let colOffset = 0;
        switch (direction) {
          case 'down': colOffset = 18; break;  // 정면 (실제로는 up 스프라이트)
          case 'right': colOffset = 12; break; // 오른쪽 보기
          case 'left': colOffset = 6; break;   // 왼쪽 보기
          case 'up': colOffset = 0; break;     // 뒷통수
          default: colOffset = 12; // 기본값 오른쪽
        }
        const frameInDirection = Math.floor(frameRef.current / 10) % 6;
        const col = colOffset + frameInDirection;

        ctx.drawImage(
          spriteImg,
          col * TILE, row * CHAR_HEIGHT, TILE, CHAR_HEIGHT,
          0, 0, TILE * scale, CHAR_HEIGHT * scale
        );
      }

      if (isRunning) {
        frameRef.current = (frameRef.current + 1) % 60;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, direction, scale]);

  return (
    <canvas
      ref={canvasRef}
      width={TILE * scale}
      height={TILE * 2 * scale}
      style={{ 
        imageRendering: 'pixelated',
        display: 'block'
      }}
    />
  );
};

// 달리기 트랙 컴포넌트
interface RunningTrackProps {
  progress: number; // 0-100
  totalSteps: number;
  currentStep: number;
  milestones: { position: number; emoji: string; label: string }[];
}

export const RunningTrack: React.FC<RunningTrackProps> = ({
  progress,
  totalSteps,
  currentStep,
  milestones
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #1a365d 0%, #0d1b2a 100%)',
      borderRadius: '20px',
      padding: '25px',
      position: 'relative',
      overflow: 'hidden',
      border: '3px solid #ffd60a',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
    }}>
      {/* 배경 별들 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '3px',
            height: '3px',
            background: '#fff',
            borderRadius: '50%',
            opacity: Math.random() * 0.5 + 0.2,
            animation: `twinkle ${2 + Math.random() * 2}s infinite`
          }} />
        ))}
      </div>

      {/* 트랙 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🏃</span>
          <span style={{ 
            color: '#ffd60a', 
            fontWeight: 800, 
            fontSize: '1.1rem',
            textShadow: '0 2px 10px rgba(255, 214, 10, 0.5)'
          }}>
            AI 마라톤
          </span>
        </div>
        <div style={{
          background: 'rgba(255, 214, 10, 0.2)',
          padding: '8px 16px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ color: '#ffd60a', fontWeight: 700 }}>
            {currentStep} / {totalSteps}
          </span>
          <span style={{ color: '#778da9' }}>완료</span>
        </div>
      </div>

      {/* 트랙 */}
      <div style={{
        position: 'relative',
        height: '80px',
        marginBottom: '15px',
        zIndex: 2
      }}>
        {/* 트랙 레인 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0',
          height: '30px',
          transform: 'translateY(-50%)',
          background: 'linear-gradient(90deg, #1b263b, #415a77, #1b263b)',
          borderRadius: '15px',
          border: '2px solid #415a77',
          overflow: 'hidden'
        }}>
          {/* 트랙 마킹 */}
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${i * 10 + 5}%`,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '3px',
              height: '12px',
              background: '#778da9',
              borderRadius: '2px',
              opacity: 0.5
            }} />
          ))}

          {/* 진행 바 */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${animatedProgress}%`,
            background: 'linear-gradient(90deg, #ffd60a, #e5c100)',
            transition: 'width 0.5s ease-out',
            boxShadow: '0 0 20px rgba(255, 214, 10, 0.5)'
          }} />
        </div>

        {/* 마일스톤 */}
        {milestones.map((milestone, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${milestone.position}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 3
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: animatedProgress >= milestone.position 
                ? 'linear-gradient(135deg, #ffd60a, #e5c100)' 
                : '#1b263b',
              border: animatedProgress >= milestone.position 
                ? '3px solid #fff' 
                : '2px solid #415a77',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              boxShadow: animatedProgress >= milestone.position
                ? '0 4px 15px rgba(255, 214, 10, 0.5)'
                : 'none',
              transition: 'all 0.3s ease'
            }}>
              {milestone.emoji}
            </div>
            <span style={{
              color: animatedProgress >= milestone.position ? '#ffd60a' : '#778da9',
              fontSize: '0.65rem',
              fontWeight: 600,
              marginTop: '5px',
              whiteSpace: 'nowrap'
            }}>
              {milestone.label}
            </span>
          </div>
        ))}

        {/* 러너 캐릭터 */}
        <div style={{
          position: 'absolute',
          left: `${animatedProgress}%`,
          top: '50%',
          transform: 'translate(-50%, -80%)',
          transition: 'left 0.5s ease-out',
          zIndex: 10
        }}>
          <PixelRunner isRunning={animatedProgress < 100} scale={1.5} direction="right" />
        </div>
      </div>

      {/* 하단 정보 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        position: 'relative',
        zIndex: 2
      }}>
        <span style={{ color: '#778da9', fontSize: '0.85rem' }}>🏆 목표까지</span>
        <span style={{ 
          color: '#ffd60a', 
          fontWeight: 800, 
          fontSize: '0.95rem'
        }}>
          {Math.round(100 - animatedProgress)}%
        </span>
        <span style={{ color: '#778da9', fontSize: '0.85rem' }}>남음!</span>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

// 코딩 도우미 캐릭터 (코드 옆에 표시)
interface CodingBuddyProps {
  message: string;
  emotion?: 'happy' | 'thinking' | 'excited' | 'cheering';
  sprite?: keyof typeof SPRITES;
}

export const CodingBuddy: React.FC<CodingBuddyProps> = ({
  message,
  emotion = 'happy',
  sprite = 'char02'
}) => {
  const emojis: Record<string, string> = {
    happy: '😊',
    thinking: '🤔',
    excited: '🎉',
    cheering: '💪'
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: 'rgba(255, 214, 10, 0.08)',
      borderRadius: '14px',
      padding: '12px 16px',
      border: '2px solid rgba(255, 214, 10, 0.3)',
      marginBottom: '15px'
    }}>
      <div style={{
        position: 'relative',
        flexShrink: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '10px',
        padding: '5px',
        border: '2px solid rgba(255, 214, 10, 0.4)'
      }}>
        <PixelRunner sprite={sprite} isRunning={false} scale={1} direction="down" />
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          fontSize: '1.2rem'
        }}>
          {emojis[emotion]}
        </div>
      </div>
      <div style={{
        background: '#0d1b2a',
        borderRadius: '10px',
        padding: '10px 14px',
        position: 'relative',
        flex: 1
      }}>
        <div style={{
          position: 'absolute',
          left: '-8px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '8px solid #0d1b2a'
        }} />
        <p style={{
          color: '#ffffff',
          margin: 0,
          fontSize: '0.9rem',
          lineHeight: 1.5
        }}>
          {message}
        </p>
      </div>
    </div>
  );
};

// 축하 이펙트 컴포넌트
interface CelebrationProps {
  show: boolean;
  message?: string;
}

export const Celebration: React.FC<CelebrationProps> = ({ 
  show, 
  message = '대단해요! 🎉' 
}) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 9999,
      animation: 'fadeIn 0.3s ease'
    }}>
      {/* 파티클 */}
      {[...Array(30)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: '-20px',
          fontSize: ['🎊', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)],
          animation: `fall ${2 + Math.random() * 2}s linear forwards`,
          animationDelay: `${Math.random() * 1}s`
        }}>
          {['🎊', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
        </div>
      ))}

      <div style={{
        background: 'linear-gradient(135deg, #1b263b, #0d1b2a)',
        borderRadius: '30px',
        padding: '50px',
        textAlign: 'center',
        border: '4px solid #ffd60a',
        boxShadow: '0 25px 80px rgba(255, 214, 10, 0.3)',
        animation: 'popIn 0.5s ease'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <PixelRunner sprite="char01" isRunning={false} scale={3} />
        </div>
        <h2 style={{
          color: '#ffd60a',
          fontSize: '2rem',
          fontWeight: 900,
          marginBottom: '10px',
          textShadow: '0 4px 20px rgba(255, 214, 10, 0.5)'
        }}>
          {message}
        </h2>
        <p style={{ color: '#778da9', fontSize: '1.1rem' }}>
          다음 레벨로 가볼까요?
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fall {
          to { 
            transform: translateY(100vh) rotate(360deg); 
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// 레벨 선택 게임 스타일
interface LevelSelectorProps {
  levels: {
    id: number;
    emoji: string;
    title: string;
    subtitle: string;
    status: 'locked' | 'active' | 'completed' | 'link';
    link?: string;
  }[];
  currentLevel: number;
  onSelectLevel: (id: number) => void;
  onNavigate?: (link: string) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  currentLevel,
  onSelectLevel,
  onNavigate
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {levels.map((level, index) => {
        const isActive = level.status === 'active' || level.status === 'link';
        const isCurrent = level.id === currentLevel;
        const isCompleted = level.status === 'completed';
        const isLink = level.status === 'link';
        
        return (
          <div
            key={level.id}
            onClick={() => {
              if (isLink && level.link && onNavigate) {
                onNavigate(level.link);
              } else if (isActive) {
                onSelectLevel(level.id);
              }
            }}
            style={{
              position: 'relative',
              width: '120px',
              cursor: isActive ? 'pointer' : 'not-allowed',
              opacity: isActive ? 1 : 0.5,
              transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            {/* 연결선 */}
            {index < levels.length - 1 && (
              <div style={{
                position: 'absolute',
                right: '-30px',
                top: '40px',
                width: '40px',
                height: '4px',
                background: '#415a77',
                borderRadius: '2px',
                zIndex: 0
              }} />
            )}

            {/* 레벨 버튼 */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              margin: '0 auto 10px',
              background: isCurrent 
                ? 'linear-gradient(135deg, #ffd60a, #e5c100)'
                : isCompleted
                ? 'linear-gradient(135deg, #34d399, #10b981)'
                : isLink
                ? 'linear-gradient(135deg, #60a5fa, #3b82f6)'
                : '#1b263b',
              border: isCurrent 
                ? '4px solid #fff'
                : `3px solid ${isActive ? '#415a77' : '#1b263b'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: isCurrent 
                ? '0 10px 40px rgba(255, 214, 10, 0.5)'
                : 'none',
              position: 'relative',
              zIndex: 1
            }}>
              {level.emoji}
              
              {/* 완료 체크 */}
              {isCompleted && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}>
                  ✅
                </div>
              )}

              {/* 링크 표시 */}
              {isLink && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#60a5fa',
                  color: '#fff',
                  fontSize: '0.6rem',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  fontWeight: 700
                }}>
                  GO →
                </div>
              )}
            </div>

            {/* 레벨 정보 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                color: isCurrent ? '#ffd60a' : '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                marginBottom: '3px'
              }}>
                {level.title}
              </div>
              <div style={{
                color: '#778da9',
                fontSize: '0.7rem'
              }}>
                {level.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const PixelRunnerExports = { PixelRunner, RunningTrack, CodingBuddy, Celebration, LevelSelector };
export default PixelRunnerExports;

