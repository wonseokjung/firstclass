import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Youtube, Calendar, ExternalLink, Clock } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

// 브랜드 컬러
const COLORS = {
  navy: '#1e3a5f',
  navyLight: '#0d1b2a',
  gold: '#ffd60a',
  white: '#ffffff',
  gray: '#94a3b8',
  grayDark: '#64748b',
  red: '#ef4444',
  youtube: '#FF0000'
};

const COURSE_ID = 'free-live';
const DAY_OF_WEEK = 1; // 월요일

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

interface FreeLivePageProps {
  onBack?: () => void;
}

const FreeLivePage: React.FC<FreeLivePageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [liveConfig, setLiveConfig] = useState<LiveConfig | null>(null);
  const [nextLiveDate, setNextLiveDate] = useState<Date | null>(null);
  const [timeUntilLive, setTimeUntilLive] = useState('');
  const [archives, setArchives] = useState<Archive[]>([]);

  const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@aicitybuilders';

  useEffect(() => {
    // 라이브 설정 및 아카이브 로드
    const loadData = async () => {
      try {
        const [config, archiveData] = await Promise.all([
          AzureTableService.getCurrentLiveConfig(COURSE_ID),
          AzureTableService.getLiveArchives(COURSE_ID)
        ]);
        
        if (config) setLiveConfig(config);
        setArchives(archiveData);
      } catch (e) {
        console.error('데이터 로드 오류:', e);
      }
    };
    loadData();
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

      // 남은 시간 계산
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

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <NavigationBar onBack={onBack} breadcrumbText="무료 라이브" />
      
      {/* 헤더 */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.youtube}, #cc0000)`,
        padding: 'clamp(25px, 5vw, 50px) clamp(15px, 3vw, 20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
        
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: COLORS.white,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Youtube size={36} color={COLORS.youtube} />
            </div>
            <div>
              <h1 style={{ color: COLORS.white, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: '800', marginBottom: '5px' }}>
                🆓 무료 AI 수익화 토크
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                매주 월요일 오후 8시 · 유튜브 라이브
              </p>
            </div>
          </div>
          
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: COLORS.white,
              color: COLORS.youtube,
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '1rem'
            }}
          >
            <Youtube size={20} />
            채널 구독하기
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)' }}>
        
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
                🔴 LIVE NOW
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
            border: `1px solid ${COLORS.youtube}40`,
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📅</div>
            <h2 style={{ color: COLORS.white, fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>
              다음 무료 라이브
            </h2>
            <div style={{ color: '#ff6b6b', fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
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
              유튜브 채널을 구독하고 알림 설정하세요!
            </p>
            
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '15px',
                padding: '12px 24px',
                background: COLORS.youtube,
                color: COLORS.white,
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '700'
              }}
            >
              <Youtube size={20} />
              유튜브에서 알림 받기
            </a>
          </div>
        )}

        {/* 지난 라이브 아카이브 */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            color: '#1e293b', 
            fontSize: '1.3rem', 
            fontWeight: '700', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Play size={22} />
            지난 무료 라이브
            <span style={{
              background: COLORS.youtube,
              color: COLORS.white,
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}>
              {archives.length}개
            </span>
          </h3>

          {archives.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '20px' 
            }}>
              {archives.map((archive) => (
                <div
                  key={archive.id}
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${archive.youtubeId}`, '_blank')}
                  style={{
                    background: COLORS.navyLight,
                    border: `1px solid ${COLORS.youtube}20`,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* 썸네일 */}
                  <div style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`
                  }}>
                    <img 
                      src={`https://img.youtube.com/vi/${archive.youtubeId}/maxresdefault.jpg`}
                      alt={archive.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${archive.youtubeId}/hqdefault.jpg`;
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: 'rgba(0,0,0,0.8)',
                      color: COLORS.white,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {archive.duration}
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: COLORS.youtube,
                      color: COLORS.white,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Youtube size={12} />
                      FREE
                    </div>
                  </div>
                  
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ color: COLORS.white, fontSize: '1rem', fontWeight: '600', marginBottom: '8px', lineHeight: 1.3 }}>
                      {archive.title}
                    </h4>
                    <div style={{ color: COLORS.grayDark, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} />
                      {archive.date}
                    </div>
                  </div>
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

        {/* 프리미엄 라이브 안내 */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.navyLight}, ${COLORS.navy})`,
          border: `1px solid ${COLORS.gold}40`,
          borderRadius: '16px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: COLORS.gold, fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px' }}>
            💎 더 깊이 있는 학습을 원하신다면?
          </h3>
          <p style={{ color: COLORS.gray, fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>
            프리미엄 라이브에서는 실전 코딩, 1:1 Q&A까지!
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/live/step1')}
              style={{
                padding: '12px 24px',
                background: `linear-gradient(135deg, ${COLORS.gold}, #e5c100)`,
                color: COLORS.navy,
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🏠 AI 건물주 라이브
            </button>
            <button
              onClick={() => navigate('/live/step2')}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                color: COLORS.white,
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🤖 AI 에이전트 라이브
            </button>
          </div>
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

export default FreeLivePage;
