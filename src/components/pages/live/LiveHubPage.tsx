import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Youtube, ChevronRight, Play } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';

// 브랜드 컬러
const COLORS = {
  navy: '#1e3a5f',
  navyLight: '#2d4a6f',
  navyDark: '#0f2847',
  gold: '#f0b429',
  goldLight: '#fcd34d',
  white: '#ffffff',
  grayLight: '#f8fafc',
  grayMedium: '#64748b',
  youtube: '#FF0000'
};

// 라이브 스케줄 정보
interface LiveSchedule {
  id: string;
  day: string;
  dayKo: string;
  time: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  isFree: boolean;
  link: string;
}

const LIVE_SCHEDULE: LiveSchedule[] = [
  {
    id: 'monday',
    day: 'MON',
    dayKo: '월요일',
    time: '오후 8:00',
    icon: '🆓',
    title: 'AI 수익화 토크',
    description: 'AI로 돈 버는 현실적인 방법, 성공 사례 공개',
    color: COLORS.youtube,
    isFree: true,
    link: '/live/free'
  },
  {
    id: 'tuesday',
    day: 'TUE',
    dayKo: '화요일',
    time: '오후 8:00',
    icon: '🏗️',
    title: 'AI 건물주 되기',
    description: '맨해튼 부동산 비유로 배우는 AI 콘텐츠 수익화',
    color: COLORS.navy,
    isFree: false,
    link: '/live/step1'
  },
  {
    id: 'wednesday',
    day: 'WED',
    dayKo: '수요일',
    time: '오후 8:00',
    icon: '🤖',
    title: 'AI 에이전트 비기너',
    description: '유튜브 수익화 에이전트 제작',
    color: COLORS.gold,
    isFree: false,
    link: '/live/step2'
  },
  {
    id: 'thursday',
    day: 'THU',
    dayKo: '목요일',
    time: '오후 8:00',
    icon: '💻',
    title: '바이브코딩',
    description: '수익화 확장의 첫걸음',
    color: '#8b5cf6',
    isFree: false,
    link: '/live/step3'
  }
];

// 휴식일 표시
const REST_DAYS = [
  { day: 'FRI', dayKo: '금요일' },
  { day: 'SAT', dayKo: '토요일' },
  { day: 'SUN', dayKo: '일요일' }
];

interface LiveHubPageProps {
  onBack?: () => void;
}

const LiveHubPage: React.FC<LiveHubPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [nextLive, setNextLive] = useState<LiveSchedule | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 다음 라이브 계산
  useEffect(() => {
    const dayMap: { [key: string]: number } = {
      'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4
    };

    const now = new Date();
    const currentDay = now.getDay();
    
    let closestSchedule: LiveSchedule | null = null;
    let closestDate: Date | null = null;

    LIVE_SCHEDULE.forEach(schedule => {
      const targetDay = dayMap[schedule.day];
      if (targetDay !== undefined) {
        let daysUntil = targetDay - currentDay;
        if (daysUntil < 0 || (daysUntil === 0 && now.getHours() >= 20)) {
          daysUntil += 7;
        }
        
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + daysUntil);
        nextDate.setHours(20, 0, 0, 0);

        if (!closestDate || nextDate < closestDate) {
          closestSchedule = schedule;
          closestDate = nextDate;
        }
      }
    });

    if (closestSchedule && closestDate) {
      setNextLive(closestSchedule);
      
      const updateCountdown = () => {
        const diff = (closestDate as Date).getTime() - Date.now();
        if (diff > 0) {
          setCountdown({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          });
        }
      };

      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: COLORS.grayLight }}>
      <NavigationBar onBack={onBack} breadcrumbText="라이브 스케줄" />

      {/* 헤더 */}
      <div style={{ 
        background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
        padding: 'clamp(30px, 6vw, 60px) clamp(15px, 4vw, 20px)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ 
            color: COLORS.white, 
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
            fontWeight: '800', 
            marginBottom: '10px' 
          }}>
            📺 라이브 스케줄
          </h1>
          <p style={{ 
            color: COLORS.goldLight, 
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' 
          }}>
            매주 월~목 오후 8시 라이브 (12월 22일부터 시작!)
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)' }}>
        
        {/* 다음 라이브 카운트다운 */}
        {nextLive && (
          <div style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: 'clamp(20px, 4vw, 30px)',
            marginBottom: '30px',
            border: `2px solid ${nextLive.color}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              flexWrap: 'wrap', 
              gap: '15px' 
            }}>
              <div>
                <p style={{ color: COLORS.grayMedium, fontSize: '0.85rem', marginBottom: '5px' }}>
                  ⏰ 다음 라이브
                </p>
                <h3 style={{ 
                  color: COLORS.navy, 
                  fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', 
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {nextLive.icon} {nextLive.title}
                </h3>
                <p style={{ color: nextLive.color, fontWeight: '600', marginTop: '3px' }}>
                  {nextLive.dayKo} {nextLive.time}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { value: countdown.days, label: '일' },
                  { value: countdown.hours, label: '시' },
                  { value: countdown.minutes, label: '분' },
                  { value: countdown.seconds, label: '초' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    background: COLORS.navy,
                    borderRadius: '10px',
                    padding: '10px 14px',
                    textAlign: 'center',
                    minWidth: '50px'
                  }}>
                    <div style={{ color: COLORS.goldLight, fontSize: '1.4rem', fontWeight: '800' }}>
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 주간 스케줄 */}
        <h2 style={{ 
          color: COLORS.navy, 
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
          fontWeight: '700', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Calendar size={22} /> 주간 스케줄
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {LIVE_SCHEDULE.map((schedule) => (
            <div
              key={schedule.id}
              onClick={() => navigate(schedule.link)}
              style={{
                background: COLORS.white,
                borderRadius: '14px',
                padding: 'clamp(15px, 3vw, 20px)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                cursor: 'pointer',
                border: `1px solid ${schedule.color}30`,
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              {/* 요일 */}
              <div style={{
                width: '60px',
                height: '60px',
                background: `linear-gradient(135deg, ${schedule.color}, ${schedule.color}dd)`,
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '1.3rem' }}>{schedule.icon}</span>
                <span style={{ 
                  color: COLORS.white, 
                  fontSize: '0.7rem', 
                  fontWeight: '700',
                  marginTop: '2px'
                }}>
                  {schedule.day}
                </span>
              </div>

              {/* 내용 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ 
                    color: COLORS.navy, 
                    fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', 
                    fontWeight: '700',
                    margin: 0
                  }}>
                    {schedule.title}
                  </h3>
                  {schedule.isFree && (
                    <span style={{
                      background: COLORS.youtube,
                      color: COLORS.white,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: '700'
                    }}>
                      FREE
                    </span>
                  )}
                </div>
                <p style={{ 
                  color: COLORS.grayMedium, 
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {schedule.description}
                </p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px', 
                  marginTop: '6px',
                  color: schedule.color,
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  <Clock size={14} />
                  {schedule.time}
                </div>
              </div>

              {/* 화살표 */}
              <ChevronRight size={20} color={COLORS.grayMedium} />
            </div>
          ))}

          {/* 휴식일 표시 */}
          {REST_DAYS.map((restDay) => (
            <div
              key={restDay.day}
              style={{
                background: '#f1f5f9',
                borderRadius: '14px',
                padding: 'clamp(15px, 3vw, 20px)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                border: '1px solid #e2e8f0',
                opacity: 0.7
              }}
            >
              {/* 요일 */}
              <div style={{
                width: '60px',
                height: '60px',
                background: '#cbd5e1',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '1.3rem' }}>😴</span>
                <span style={{ 
                  color: COLORS.white, 
                  fontSize: '0.7rem', 
                  fontWeight: '700',
                  marginTop: '2px'
                }}>
                  {restDay.day}
                </span>
              </div>

              {/* 내용 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ 
                  color: '#94a3b8', 
                  fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', 
                  fontWeight: '700',
                  margin: 0
                }}>
                  휴식
                </h3>
                <p style={{ 
                  color: '#94a3b8', 
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                  margin: 0
                }}>
                  {restDay.dayKo}은 라이브 없음
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 유튜브 채널 안내 */}
        <div style={{
          marginTop: '40px',
          background: `linear-gradient(135deg, ${COLORS.youtube}, #cc0000)`,
          borderRadius: '16px',
          padding: 'clamp(25px, 5vw, 35px)',
          textAlign: 'center'
        }}>
          <Youtube size={40} color={COLORS.white} style={{ marginBottom: '15px' }} />
          <h3 style={{ color: COLORS.white, fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>
            무료 라이브는 유튜브에서!
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px', fontSize: '0.95rem' }}>
            매주 월요일 오후 8시, AI 수익화 토크
          </p>
          <button
            onClick={() => window.open('https://www.youtube.com/@aicitybuilders', '_blank')}
            style={{
              background: COLORS.white,
              color: COLORS.youtube,
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Play size={18} />
            유튜브 채널 바로가기
          </button>
        </div>

        {/* 안내 */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: COLORS.white,
          borderRadius: '12px',
          border: `1px solid ${COLORS.gold}30`
        }}>
          <h4 style={{ color: COLORS.navy, fontWeight: '700', marginBottom: '10px' }}>
            📌 안내사항
          </h4>
          <ul style={{ 
            color: COLORS.grayMedium, 
            fontSize: '0.9rem', 
            lineHeight: '1.8',
            margin: 0,
            paddingLeft: '20px'
          }}>
            <li><strong>12월 22일부터</strong> 라이브가 시작됩니다!</li>
            <li>라이브는 매주 <strong>월~목 오후 8시</strong>에 진행됩니다</li>
            <li>월요일 무료 라이브는 유튜브에서 시청 가능합니다</li>
            <li>프리미엄 라이브(화~목)는 해당 강의 수강생만 참여 가능합니다</li>
            <li>금, 토, 일요일은 휴식입니다 😴</li>
            <li>지난 라이브는 아카이브에서 다시 볼 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiveHubPage;
