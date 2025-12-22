import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, ExternalLink } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

// 브랜드 컬러
const COLORS = {
  navy: '#0f172a',
  navyLight: '#1e293b',
  cyan: '#06b6d4',
  cyanLight: '#22d3ee',
  gold: '#fbbf24',
  white: '#ffffff',
  gray: '#94a3b8',
  grayDark: '#64748b',
  red: '#ef4444'
};

const COURSE_ID = 'chatgpt-agent-beginner';
const DAY_OF_WEEK = 3; // 수요일

interface LiveStep2PageProps {
  onBack?: () => void;
}

interface Archive {
  id: string;
  title: string;
  date: string;
  youtubeId: string;
  duration?: string;
}

interface LiveConfig {
  isLive: boolean;
  liveUrl: string;
  liveTitle: string;
}

const LiveStep2Page: React.FC<LiveStep2PageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liveConfig, setLiveConfig] = useState<LiveConfig | null>(null);
  const [nextLiveDate, setNextLiveDate] = useState<Date | null>(null);
  const [timeUntilLive, setTimeUntilLive] = useState('');
  const [archives, setArchives] = useState<Archive[]>([]);

  useEffect(() => {
    const initialize = async () => {
      const userSession = sessionStorage.getItem('aicitybuilders_user_session');
      if (userSession) {
        try {
          const user = JSON.parse(userSession);
          const enrollments = user?.enrolledCourses?.enrollments || [];
          const hasStep2 = enrollments.some((e: { courseId: string }) => 
            e.courseId === 'chatgpt-agent-beginner' || e.courseId === 'ai-agent-beginner' || e.courseId === '1001' || e.courseId === '1002'
          );
          setIsEnrolled(hasStep2);

          if (hasStep2) {
            // Azure에서 라이브 설정 및 아카이브 로드
            const [config, archiveData] = await Promise.all([
              AzureTableService.getCurrentLiveConfig(COURSE_ID),
              AzureTableService.getLiveArchives(COURSE_ID)
            ]);
            
            if (config) setLiveConfig(config);
            setArchives(archiveData);
          }
        } catch (e) {
          console.error('초기화 오류:', e);
        }
      }
      setLoading(false);
    };

    initialize();
  }, []);

  useEffect(() => {
    // 다음 라이브 날짜 계산
    const calculateNextLive = () => {
      const now = new Date();
      const nextLive = new Date();
      const daysUntilLive = (DAY_OF_WEEK - now.getDay() + 7) % 7 || 7;
      
      if (now.getDay() === DAY_OF_WEEK && now.getHours() < 20) {
        nextLive.setHours(20, 0, 0, 0);
      } else {
        nextLive.setDate(now.getDate() + (now.getDay() === DAY_OF_WEEK && now.getHours() >= 20 ? 7 : daysUntilLive));
        nextLive.setHours(20, 0, 0, 0);
      }
      setNextLiveDate(nextLive);

      const diff = nextLive.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeUntilLive(`${days}일 ${hours}시간 후`);
      } else if (hours > 0) {
        setTimeUntilLive(`${hours}시간 ${minutes}분 후`);
      } else {
        setTimeUntilLive(`${minutes}분 후`);
      }
    };

    calculateNextLive();
    const interval = setInterval(calculateNextLive, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: COLORS.white }}>로딩 중...</div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.navy }}>
        <NavigationBar onBack={onBack} breadcrumbText="AI 에이전트 라이브" />
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
          <h1 style={{ color: COLORS.white, fontSize: '1.8rem', marginBottom: '15px' }}>
            수강생 전용 페이지입니다
          </h1>
          <p style={{ color: COLORS.gray, fontSize: '1rem', marginBottom: '30px', lineHeight: '1.6' }}>
            AI 에이전트 비기너 강의를 수강하시면<br/>
            라이브 세션에 참여하실 수 있습니다.
          </p>
          <button
            onClick={() => navigate('/chatgpt-agent-beginner')}
            style={{
              background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.cyanLight})`,
              color: COLORS.white,
              border: 'none',
              padding: '14px 28px',
              fontSize: '1rem',
              fontWeight: '700',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            강의 보러가기 →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.navy }}>
      <NavigationBar onBack={onBack} breadcrumbText="AI 에이전트 라이브" />
      
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)' }}>
        
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            display: 'inline-block',
            background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.cyanLight})`,
            padding: '6px 16px',
            borderRadius: '20px',
            marginBottom: '15px'
          }}>
            <span style={{ color: COLORS.white, fontWeight: '700', fontSize: '0.85rem' }}>STEP 2 · 수강생 전용</span>
          </div>
          <h1 style={{ color: COLORS.white, fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', fontWeight: '800', marginBottom: '10px' }}>
            🤖 AI 에이전트 비기너 라이브
          </h1>
          <p style={{ color: COLORS.gray, fontSize: '1rem' }}>
            매주 수요일 오후 8시
          </p>
        </div>

        {/* 라이브 상태 */}
        {liveConfig?.isLive && liveConfig?.liveUrl ? (
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.red}20, ${COLORS.red}10)`,
            border: `2px solid ${COLORS.red}`,
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{
                background: COLORS.red,
                color: COLORS.white,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '700',
                animation: 'pulse 2s infinite'
              }}>
                🔴 LIVE
              </span>
              <span style={{ color: COLORS.white, fontSize: '1.2rem', fontWeight: '700' }}>
                {liveConfig?.liveTitle || '라이브 진행 중'}
              </span>
            </div>
            
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '20px'
            }}>
              <iframe
                src={`https://www.youtube.com/embed/${liveConfig?.liveUrl}?autoplay=1`}
                title={liveConfig?.liveTitle || '라이브 방송'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <button
              onClick={() => window.open(`https://www.youtube.com/watch?v=${liveConfig?.liveUrl}`, '_blank')}
              style={{
                background: COLORS.red,
                color: COLORS.white,
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto'
              }}
            >
              <ExternalLink size={18} />
              유튜브에서 보기
            </button>
          </div>
        ) : (
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.navyLight}, ${COLORS.navy})`,
            border: `1px solid ${COLORS.cyan}40`,
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📅</div>
            <h2 style={{ color: COLORS.white, fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>
              다음 라이브
            </h2>
            <div style={{ color: COLORS.cyanLight, fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
              {nextLiveDate?.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              color: COLORS.gray,
              marginBottom: '20px'
            }}>
              <Clock size={18} />
              오후 8시
            </div>
            <div style={{
              background: `${COLORS.gold}20`,
              border: `1px solid ${COLORS.gold}50`,
              borderRadius: '12px',
              padding: '15px 25px',
              display: 'inline-block'
            }}>
              <span style={{ color: COLORS.gold, fontWeight: '700', fontSize: '1.1rem' }}>
                ⏰ {timeUntilLive}
              </span>
            </div>

            <p style={{ color: COLORS.gray, marginTop: '25px', fontSize: '0.95rem' }}>
              라이브가 시작되면 이 페이지에서 바로 시청할 수 있습니다
            </p>
          </div>
        )}

        {/* 지난 라이브 아카이브 */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            color: COLORS.white, 
            fontSize: '1.3rem', 
            fontWeight: '700', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Play size={22} />
            지난 라이브 다시보기
          </h3>

          {archives.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {archives.map((archive) => (
                <div
                  key={archive.id}
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${archive.youtubeId}`, '_blank')}
                  style={{
                    background: COLORS.navyLight,
                    border: `1px solid ${COLORS.cyan}30`,
                    borderRadius: '14px',
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.cyanLight})`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Play size={24} color={COLORS.white} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: COLORS.white, fontWeight: '600', marginBottom: '4px' }}>
                      {archive.title}
                    </div>
                    <div style={{ color: COLORS.grayDark, fontSize: '0.9rem' }}>
                      {archive.date}
                    </div>
                  </div>
                  <ExternalLink size={20} color={COLORS.gray} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: COLORS.navyLight,
              borderRadius: '14px',
              padding: '40px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📼</div>
              <p style={{ color: COLORS.gray }}>
                아직 아카이브가 없습니다<br/>
                첫 라이브 후 여기서 다시 볼 수 있어요!
              </p>
            </div>
          )}
        </div>

        {/* 안내 */}
        <div style={{
          background: `${COLORS.cyan}10`,
          border: `1px solid ${COLORS.cyan}30`,
          borderRadius: '14px',
          padding: '20px'
        }}>
          <h4 style={{ color: COLORS.cyanLight, fontWeight: '700', marginBottom: '10px', fontSize: '1rem' }}>
            📌 라이브 안내
          </h4>
          <ul style={{ color: COLORS.gray, fontSize: '0.9rem', lineHeight: '1.8', margin: 0, paddingLeft: '18px' }}>
            <li>매주 수요일 오후 8시에 라이브가 진행됩니다</li>
            <li>라이브는 유튜브 언리스트로 진행되어 수강생만 시청 가능합니다</li>
            <li>채팅창에서 실시간으로 질문하실 수 있습니다</li>
            <li>지난 라이브는 아카이브에서 다시 볼 수 있습니다</li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default LiveStep2Page;
