import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Youtube, Play, ExternalLink } from 'lucide-react';
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
  youtube: '#FF0000',
  purple: '#8b5cf6'
};

// 요일별 라이브 스케줄 (0: 일요일, 1: 월요일, ...)
// Step 3 바이브코딩: 2026년 1월 8일(목) 오픈
// Step 4 1인 기업 만들기: 추후 오픈 예정
const WEEKLY_SCHEDULE: { [key: number]: { icon: string; title: string; color: string; isFree: boolean; link: string; time: string; openDate?: Date } | null } = {
  0: null, // 일요일 - 휴식
  1: { icon: '🆓', title: 'AI 수익화 토크', color: COLORS.youtube, isFree: true, link: '/live/free', time: '20:00' }, // 월요일
  2: { icon: '🏗️', title: 'AI 건물주 되기', color: COLORS.navy, isFree: false, link: '/live/step1', time: '20:00' }, // 화요일
  3: { icon: '🤖', title: 'AI 에이전트 비기너', color: COLORS.gold, isFree: false, link: '/live/step2', time: '20:00' }, // 수요일
  4: { icon: '💻', title: '바이브코딩', color: COLORS.purple, isFree: false, link: '/live/step3', time: '20:00', openDate: new Date(2026, 0, 8) }, // 목요일 - 2026년 1월 8일 오픈
  5: null, // 금요일 - 1인 기업 만들기 (추후 오픈 예정)
  6: null, // 토요일 - 휴식
};

// 라이브 시작일 (2024년 12월 22일)
const LIVE_START_DATE = new Date(2024, 11, 22);

interface LiveHubPageProps {
  onBack?: () => void;
}

const LiveHubPage: React.FC<LiveHubPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // 이전/다음 월 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // 해당 월의 날짜들 생성
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: (Date | null)[] = [];

    // 이전 월의 날짜들 (빈 칸)
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 현재 월의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // 해당 날짜가 오늘인지 확인
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // 해당 날짜가 라이브 시작일 이후인지 확인
  const isAfterLiveStart = (date: Date) => {
    return date >= LIVE_START_DATE;
  };

  // 해당 날짜의 라이브 스케줄 가져오기
  const getScheduleForDate = (date: Date) => {
    if (!isAfterLiveStart(date)) return null;
    const schedule = WEEKLY_SCHEDULE[date.getDay()];
    // openDate가 있는 경우, 해당 날짜 이후에만 표시
    if (schedule?.openDate && date < schedule.openDate) return null;
    return schedule;
  };

  const days = getDaysInMonth();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <NavigationBar onBack={onBack} breadcrumbText="라이브 캘린더" />

      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%)',
        padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: COLORS.white,
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: '800',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          📅 라이브 캘린더
        </h1>
        <p style={{ color: COLORS.goldLight, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
          매주 월~목 오후 8시 라이브 (Step 4 추후 오픈)
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(15px, 3vw, 30px)' }}>

        {/* 월 네비게이션 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%)',
          borderRadius: '12px',
          padding: '12px 20px'
        }}>
          <button
            onClick={goToPreviousMonth}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: COLORS.white
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{
              color: COLORS.white,
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: '700',
              margin: 0
            }}>
              {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
            </h2>
            <button
              onClick={goToToday}
              style={{
                background: COLORS.gold,
                color: COLORS.navyDark,
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              오늘
            </button>
          </div>

          <button
            onClick={goToNextMonth}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: COLORS.white
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 캘린더 */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {/* 요일 헤더 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%)'
          }}>
            {weekDays.map((day, index) => (
              <div
                key={day}
                style={{
                  padding: '12px 5px',
                  textAlign: 'center',
                  color: index === 0 ? '#ff6b6b' : index === 6 ? '#74b9ff' : COLORS.white,
                  fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
                  fontWeight: '600'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            background: '#e2e8f0'
          }}>
            {days.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    style={{
                      background: '#f8fafc',
                      minHeight: 'clamp(80px, 15vw, 120px)'
                    }}
                  />
                );
              }

              const schedule = getScheduleForDate(date);
              const isTodayDate = isToday(date);
              const dayOfWeek = date.getDay();

              return (
                <div
                  key={date.toISOString()}
                  onClick={() => schedule && navigate(schedule.link)}
                  style={{
                    background: isTodayDate ? 'rgba(240, 180, 41, 0.1)' : '#ffffff',
                    minHeight: 'clamp(80px, 15vw, 120px)',
                    padding: 'clamp(6px, 1.5vw, 10px)',
                    cursor: schedule ? 'pointer' : 'default',
                    transition: 'background 0.2s',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* 날짜 숫자 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      color: isTodayDate
                        ? COLORS.navyDark
                        : dayOfWeek === 0
                          ? '#ef4444'
                          : dayOfWeek === 6
                            ? '#3b82f6'
                            : '#1e293b',
                      fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                      fontWeight: isTodayDate ? '700' : '500',
                      width: isTodayDate ? '24px' : 'auto',
                      height: isTodayDate ? '24px' : 'auto',
                      background: isTodayDate ? COLORS.gold : 'transparent',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {date.getDate()}
                    </span>
                  </div>

                  {/* 라이브 이벤트 */}
                  {schedule && (
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${schedule.color}, ${schedule.color}cc)`,
                        borderRadius: '6px',
                        padding: 'clamp(4px, 1vw, 8px)',
                        marginTop: 'auto',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minHeight: 'clamp(40px, 8vw, 60px)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '2px'
                      }}>
                        <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)' }}>
                          {schedule.icon}
                        </span>
                        {schedule.isFree && (
                          <span style={{
                            background: 'rgba(255,255,255,0.3)',
                            color: COLORS.white,
                            padding: '1px 4px',
                            borderRadius: '4px',
                            fontSize: '0.55rem',
                            fontWeight: '700'
                          }}>
                            FREE
                          </span>
                        )}
                      </div>
                      <div style={{
                        color: COLORS.white,
                        fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                        fontWeight: '600',
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const
                      }}>
                        {schedule.title}
                      </div>
                      <div style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: 'clamp(0.55rem, 1.2vw, 0.65rem)',
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Clock size={10} />
                        {schedule.time}
                      </div>
                    </div>
                  )}

                  {/* 휴식일 표시 */}
                  {!schedule && isAfterLiveStart(date) && (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) && (
                    <div style={{
                      color: '#94a3b8',
                      fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)',
                      marginTop: 'auto',
                      textAlign: 'center'
                    }}>
                      😴
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 범례 */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center'
        }}>
          {Object.entries(WEEKLY_SCHEDULE).filter(([_, schedule]) => schedule !== null).map(([day, schedule]) => (
            <div
              key={day}
              onClick={() => schedule && navigate(schedule.link)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%)',
                padding: '8px 14px',
                borderRadius: '20px',
                cursor: 'pointer',
                border: `1px solid ${schedule?.color}40`,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: schedule?.color
              }} />
              <span style={{ color: COLORS.white, fontSize: '0.8rem', fontWeight: '500' }}>
                {schedule?.icon} {schedule?.title}
              </span>
              {schedule?.isFree && (
                <span style={{
                  background: COLORS.youtube,
                  color: COLORS.white,
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontSize: '0.6rem',
                  fontWeight: '700'
                }}>
                  FREE
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 유튜브 채널 안내 */}
        <div style={{
          marginTop: '30px',
          background: `linear-gradient(135deg, ${COLORS.youtube}, #cc0000)`,
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 30px)',
          textAlign: 'center'
        }}>
          <Youtube size={36} color={COLORS.white} style={{ marginBottom: '12px' }} />
          <h3 style={{ color: COLORS.white, fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>
            무료 라이브는 유튜브에서!
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '15px', fontSize: '0.9rem' }}>
            매주 월요일 오후 8시, AI 수익화 토크
          </p>
          <button
            onClick={() => window.open('https://www.youtube.com/@aicitybuilders', '_blank')}
            style={{
              background: COLORS.white,
              color: COLORS.youtube,
              border: 'none',
              padding: '10px 24px',
              borderRadius: '25px',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Play size={16} />
            유튜브 채널
            <ExternalLink size={14} />
          </button>
        </div>

        {/* 📅 이번 달 프로젝트 */}
        <div style={{
          marginTop: '20px',
          padding: 'clamp(20px, 4vw, 30px)',
          background: 'linear-gradient(135deg, #0a0f1a 0%, #1a1f2e 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          position: 'relative' as const,
          overflow: 'hidden'
        }}>
          {/* 배경 글로우 효과 */}
          <div style={{
            position: 'absolute' as const,
            top: '-50%',
            left: '-20%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)',
            pointerEvents: 'none' as const
          }} />
          <div style={{
            position: 'absolute' as const,
            bottom: '-30%',
            right: '-10%',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)',
            pointerEvents: 'none' as const
          }} />

          <div style={{ textAlign: 'center', marginBottom: '25px', position: 'relative' as const }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #ffd60a, #f59e0b)',
              padding: '10px 24px',
              borderRadius: '25px',
              marginBottom: '15px',
              boxShadow: '0 4px 15px rgba(255, 214, 10, 0.3)'
            }}>
              <span style={{ fontSize: '1.3rem' }}>🎬</span>
              <span style={{ color: '#1a1a2e', fontWeight: '800', fontSize: '1rem' }}>
                2026년 1월 프로젝트
              </span>
            </div>
            <h3 style={{
              color: COLORS.white,
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: '800',
              margin: '0 0 10px 0',
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              캐릭터 기반 콘텐츠 만들기
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', margin: 0 }}>
              나만의 캐릭터로 유튜브 콘텐츠를 만들어보세요!
            </p>
          </div>

          {/* Step별 프로젝트 카드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {[
              { 
                step: 1, 
                title: 'AI 건물주', 
                focus: '콘텐츠 생성',
                project: '캐릭터 이미지 생성', 
                day: '화', 
                time: '밤 8시',
                color: '#3b82f6', 
                bgColor: 'rgba(59, 130, 246, 0.1)',
                icon: '🏗️',
                weeks: ['1주 실제 인물', '2주 3D 만화', '3주 동물', '4주 귀엽고 심플']
              },
              { 
                step: 2, 
                title: 'AI 에이전트', 
                focus: '워크플로우 공부',
                project: '캐릭터 영상 자동화', 
                day: '수', 
                time: '밤 8시',
                color: '#fbbf24', 
                bgColor: 'rgba(251, 191, 36, 0.1)',
                icon: '🤖',
                weeks: ['1주 인물 영상', '2주 만화 영상', '3주 동물 영상', '4주 심플 영상']
              },
              { 
                step: 3, 
                title: '바이브코딩', 
                focus: '에이전트 개발',
                project: '자동화 툴 직접 개발', 
                day: '목', 
                time: '밤 8시',
                color: '#a855f7', 
                bgColor: 'rgba(168, 85, 247, 0.1)',
                icon: '💻',
                weeks: ['1주 설계', '2주 개발', '3주 테스트', '4주 배포']
              }
            ].map((item) => (
              <div 
                key={item.step} 
                onClick={() => navigate(`/live/step${item.step}`)}
                style={{
                  background: item.bgColor,
                  borderRadius: '16px',
                  padding: '20px',
                  border: `1px solid ${item.color}30`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative' as const,
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 10px 30px ${item.color}30`;
                  e.currentTarget.style.borderColor = `${item.color}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = `${item.color}30`;
                }}
              >
                {/* 헤더 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                    <div>
                      <div style={{
                        background: item.color,
                        color: item.step === 2 ? '#1a1a2e' : '#fff',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        marginBottom: '4px',
                        display: 'inline-block'
                      }}>
                        {item.title}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                        {item.focus}
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontSize: '0.75rem',
                    textAlign: 'right' as const
                  }}>
                    매주 {item.day} {item.time}
                  </div>
                </div>

                {/* 프로젝트명 */}
                <div style={{
                  color: COLORS.white,
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  marginBottom: '12px'
                }}>
                  📌 {item.project}
                </div>

                {/* 주차별 내용 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '6px'
                }}>
                  {item.weeks.map((week, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255,255,255,0.05)',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.75rem'
                    }}>
                      <span style={{ color: item.color, fontWeight: '700' }}>{week.split(' ')[0]}</span>{' '}
                      {week.split(' ').slice(1).join(' ')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 하단 정보 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap' as const,
            padding: '15px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.85rem'
            }}>
              <span>📺</span>
              <span>다시보기 <strong style={{ color: COLORS.goldLight }}>1달간</strong> 제공</span>
            </div>
            <div style={{ 
              width: '1px', 
              height: '16px', 
              background: 'rgba(255,255,255,0.2)' 
            }} />
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.85rem'
            }}>
              <span>💰</span>
              <span>3개월 수강권 <strong style={{ color: COLORS.goldLight }}>₩95,000</strong></span>
            </div>
            <div style={{ 
              width: '1px', 
              height: '16px', 
              background: 'rgba(255,255,255,0.2)' 
            }} />
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.85rem'
            }}>
              <span>📚</span>
              <span>기본 강의 <strong style={{ color: COLORS.goldLight }}>10개</strong> 포함</span>
            </div>
          </div>
        </div>

        {/* 안내사항 */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(240, 180, 41, 0.3)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h4 style={{ color: COLORS.gold, fontWeight: '700', marginBottom: '10px', fontSize: '0.95rem' }}>
            📌 안내사항
          </h4>
          <ul style={{
            color: COLORS.white,
            fontSize: '0.85rem',
            lineHeight: '1.8',
            margin: 0,
            paddingLeft: '18px'
          }}>
            <li>라이브는 매주 <strong style={{ color: COLORS.goldLight }}>월~목 오후 8시</strong>에 진행됩니다</li>
            <li>월요일 무료 라이브는 유튜브에서 시청 가능합니다</li>
            <li>프리미엄 라이브(화~목)는 해당 강의 수강생만 참여 가능합니다</li>
            <li><strong style={{ color: COLORS.goldLight }}>Step 3 바이브코딩</strong>: 2026년 1월 8일(목) 오픈!</li>
            <li>캘린더의 이벤트를 클릭하면 해당 라이브 페이지로 이동합니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiveHubPage;
