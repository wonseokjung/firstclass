import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Youtube, Calendar, Clock, User, ExternalLink } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';

// 브랜드 컬러
const COLORS = {
  navy: '#1e3a5f',
  navyLight: '#2d4a6f',
  navyDark: '#0f2847',
  gold: '#f0b429',
  goldLight: '#fcd34d',
  goldDark: '#d4a017',
  white: '#ffffff',
  grayLight: '#f8fafc',
  grayMedium: '#64748b',
  red: '#ef4444',
  youtube: '#FF0000'
};

// 무료 라이브 아카이브 타입
interface FreeLiveArchive {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  youtubeId: string;
  thumbnail: string;
  views?: string;
}

// 샘플 무료 라이브 아카이브
const FREE_ARCHIVES: FreeLiveArchive[] = [
  {
    id: 'free-1',
    title: '🔴 AI 수익화 토크 #52 - 2024년 AI 수익화 총정리',
    description: 'AI로 돈 버는 현실적인 방법! 2024년 수익화 전략 총정리',
    date: '12월 9일',
    duration: '42:15',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/images/main/1.jpeg',
    views: '1.2K'
  },
  {
    id: 'free-2',
    title: '🎯 주말 AI Q&A #51 - ChatGPT 최신 업데이트',
    description: 'ChatGPT o1, Claude 3.5 최신 업데이트 정리 및 Q&A',
    date: '12월 7일',
    duration: '38:42',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/images/main/2.jpeg',
    views: '890'
  },
  {
    id: 'free-3',
    title: '🔴 AI 수익화 토크 #50 - AI 이미지로 월 100만원',
    description: 'AI 이미지 생성으로 실제 수익 내는 방법 공개',
    date: '12월 2일',
    duration: '45:30',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/images/main/3.jpeg',
    views: '2.1K'
  },
  {
    id: 'free-4',
    title: '🎯 주말 AI Q&A #49 - AI 자동화 입문',
    description: 'Make, Zapier, n8n으로 시작하는 AI 자동화',
    date: '11월 30일',
    duration: '51:22',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/images/main/4.jpeg',
    views: '1.5K'
  },
  {
    id: 'free-5',
    title: '🔴 AI 수익화 토크 #48 - 유튜브 자동화 전략',
    description: 'AI로 유튜브 콘텐츠 자동 생성하는 방법',
    date: '11월 25일',
    duration: '39:18',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/images/main/1.jpeg',
    views: '1.8K'
  },
  {
    id: 'free-6',
    title: '🎯 주말 AI Q&A #47 - AI 에이전트란?',
    description: 'AI 에이전트의 개념과 활용 방법 설명',
    date: '11월 23일',
    duration: '44:55',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/images/main/2.jpeg',
    views: '1.3K'
  }
];

interface FreeLivePageProps {
  onBack: () => void;
}

const FreeLivePage: React.FC<FreeLivePageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<FreeLiveArchive | null>(null);

  const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@CONNECT-AI-LAB';

  return (
    <div style={{ minHeight: '100vh', background: COLORS.white }}>
      <NavigationBar onBack={onBack} breadcrumbText="무료 라이브" />
      
      {/* 헤더 */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.youtube}, #cc0000)`,
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 장식 */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: COLORS.white,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}>
              <Youtube size={40} color={COLORS.youtube} />
            </div>
            <div>
              <h1 style={{ color: COLORS.white, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '5px' }}>
                🆓 무료 AI 수익화 라이브
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                매주 월요일 저녁 8시 YouTube 라이브
              </p>
            </div>
          </div>
          
          {/* 스케줄 정보 */}
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '15px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Calendar size={20} color={COLORS.white} />
              <span style={{ color: COLORS.white, fontWeight: '600' }}>매주 월요일 오후 8:00</span>
            </div>
          </div>
          
          {/* YouTube 채널 링크 */}
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '25px',
              padding: '14px 28px',
              background: COLORS.white,
              color: COLORS.youtube,
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <Youtube size={24} />
            YouTube 채널 구독하기
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* 선택된 영상 플레이어 */}
        {selectedVideo && (
          <div style={{ marginBottom: '50px' }}>
            <div style={{
              background: COLORS.navyDark,
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: `0 10px 40px ${COLORS.navy}30`
            }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
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
                  title={selectedVideo.title}
                />
              </div>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <h2 style={{ color: COLORS.navy, fontSize: '1.3rem', fontWeight: '700' }}>
                {selectedVideo.title}
              </h2>
              <p style={{ color: COLORS.grayMedium, marginTop: '8px' }}>
                {selectedVideo.description}
              </p>
              <p style={{ color: COLORS.grayMedium, marginTop: '5px', fontSize: '0.9rem' }}>
                {selectedVideo.date} · {selectedVideo.duration} · 조회수 {selectedVideo.views}
              </p>
            </div>
          </div>
        )}
        
        {/* 아카이브 그리드 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
            <Play size={28} color={COLORS.youtube} />
            <h2 style={{ color: COLORS.navy, fontSize: '1.5rem', fontWeight: '800' }}>
              📺 지난 무료 라이브
            </h2>
            <span style={{
              background: COLORS.youtube,
              color: COLORS.white,
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '700'
            }}>
              {FREE_ARCHIVES.length}개
            </span>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            {FREE_ARCHIVES.map((archive) => (
              <div
                key={archive.id}
                onClick={() => setSelectedVideo(archive)}
                style={{
                  background: COLORS.white,
                  borderRadius: '15px',
                  overflow: 'hidden',
                  border: selectedVideo?.id === archive.id ? `3px solid ${COLORS.youtube}` : `2px solid ${COLORS.navy}10`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedVideo?.id === archive.id ? `0 8px 25px ${COLORS.youtube}30` : `0 4px 15px ${COLORS.navy}08`
                }}
              >
                {/* 썸네일 */}
                <div style={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
                  overflow: 'hidden'
                }}>
                  <img 
                    src={archive.thumbnail} 
                    alt={archive.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.85
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: `${COLORS.youtube}dd`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}>
                      <Play size={26} color={COLORS.white} style={{ marginLeft: '3px' }} />
                    </div>
                  </div>
                  
                  {/* 재생시간 */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.8)',
                    color: COLORS.white,
                    padding: '4px 8px',
                    borderRadius: '5px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {archive.duration}
                  </div>
                  
                  {/* YouTube 배지 */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: COLORS.youtube,
                    color: COLORS.white,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Youtube size={14} />
                    FREE
                  </div>
                </div>
                
                {/* 정보 */}
                <div style={{ padding: '18px' }}>
                  <h3 style={{
                    color: COLORS.navyDark,
                    fontSize: '1rem',
                    fontWeight: '700',
                    marginBottom: '10px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {archive.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: COLORS.grayMedium,
                    fontSize: '0.85rem'
                  }}>
                    <span>{archive.date}</span>
                    <span>·</span>
                    <span>조회수 {archive.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* YouTube 채널로 이동 */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 35px',
                background: COLORS.youtube,
                color: COLORS.white,
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1.1rem',
                boxShadow: `0 6px 20px ${COLORS.youtube}40`,
                transition: 'all 0.3s ease'
              }}
            >
              <Youtube size={24} />
              YouTube에서 더 보기
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
        
        {/* 프리미엄 라이브 안내 */}
        <div style={{
          marginTop: '60px',
          background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: COLORS.goldLight, fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px' }}>
            💎 더 깊이 있는 학습을 원하신다면?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.8' }}>
            프리미엄 라이브에서는 실전 코딩, 1:1 Q&A, 아카이브까지!<br/>
            Step 1~4 강의 구매 시 전용 라이브에 참여할 수 있어요.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/live/step1')}
              style={{
                padding: '14px 28px',
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                color: COLORS.navyDark,
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: `0 4px 15px ${COLORS.gold}40`
              }}
            >
              🏗️ Step 1 라이브
            </button>
            <button
              onClick={() => navigate('/live/step2')}
              style={{
                padding: '14px 28px',
                background: 'rgba(255,255,255,0.1)',
                color: COLORS.white,
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🤖 Step 2 라이브
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeLivePage;

