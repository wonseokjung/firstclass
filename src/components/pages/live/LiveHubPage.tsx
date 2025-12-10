import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';

// 브랜드 컬러 (밝은 버전)
const COLORS = {
  navy: '#1e3a5f',
  navyLight: '#2d4a6f',
  navyMid: '#1a365d',
  navyDark: '#0f2847',
  gold: '#f0b429',
  goldLight: '#fcd34d',
  goldDark: '#d4a017',
  goldAccent: '#fbbf24',
  white: '#ffffff',
  cream: '#fefce8',
  gray: '#cbd5e1',
  grayDark: '#94a3b8',
  text: '#f1f5f9'
};

// 라이브 스케줄 타입
interface LiveSchedule {
  id: string;
  title: string;
  description: string;
  vimeoEventId: string;
  dayOfWeek: string;
  time: string;
  duration: string;
  instructor: string;
  requiredCourseId: number | null;
  isFree: boolean;
  youtubeUrl?: string;
  thumbnail?: string;
  category: 'free' | 'step1' | 'step2' | 'step3' | 'step4';
}

// 주간 라이브 스케줄
const WEEKLY_SCHEDULES: LiveSchedule[] = [
  {
    id: 'free-monday',
    title: '🔴 AI 수익화 토크',
    description: 'AI로 돈 버는 현실적인 방법! 수익화 전략, 성공 사례, 실전 팁을 나눕니다.',
    vimeoEventId: '',
    dayOfWeek: '월요일',
    time: '오후 8:00',
    duration: '30~45분',
    instructor: '정원석 (AI 멘토 제이)',
    requiredCourseId: null,
    isFree: true,
    youtubeUrl: 'https://www.youtube.com/@CONNECT-AI-LAB',
    category: 'free'
  },
  {
    id: 'step1-tuesday',
    title: '🏗️ Step 1: AI 건물주 되기',
    description: 'AI 이미지 수익화, 콘텐츠 제작 실습. 수강생 Q&A 및 피드백.',
    vimeoEventId: '1044498498',
    dayOfWeek: '화요일',
    time: '오후 8:00',
    duration: '60분',
    instructor: '정원석 (AI 멘토 제이)',
    requiredCourseId: 999,
    isFree: false,
    thumbnail: '/images/main/1.jpeg',
    category: 'step1'
  },
  {
    id: 'step2-wednesday',
    title: '🤖 Step 2: AI 에이전트 비기너',
    description: 'Google OPAL 워크플로우, 에이전트 제작 실습. 최신 업데이트 반영.',
    vimeoEventId: '1044498498',
    dayOfWeek: '수요일',
    time: '오후 8:00',
    duration: '60분',
    instructor: '정원석 (AI 멘토 제이)',
    requiredCourseId: 1002,
    isFree: false,
    thumbnail: '/images/main/2.jpeg',
    category: 'step2'
  },
  {
    id: 'step3-thursday',
    title: '🚀 Step 3: AI 에이전트 파견소',
    description: 'AI 에이전트 실전 활용, 자동화 시스템 구축 라이브 코딩.',
    vimeoEventId: '1044498498',
    dayOfWeek: '목요일',
    time: '오후 8:00',
    duration: '60분',
    instructor: '정원석 (AI 멘토 제이)',
    requiredCourseId: 1003,
    isFree: false,
    thumbnail: '/images/main/3.jpeg',
    category: 'step3'
  },
  {
    id: 'step4-friday',
    title: '💼 Step 4: 1인 콘텐츠 기업',
    description: '바이브코딩으로 서비스 개발, 1인 기업 구축 프로젝트.',
    vimeoEventId: '1044498498',
    dayOfWeek: '금요일',
    time: '오후 8:00',
    duration: '60분',
    instructor: '정원석 (AI 멘토 제이)',
    requiredCourseId: 1004,
    isFree: false,
    thumbnail: '/images/main/4.jpeg',
    category: 'step4'
  },
  {
    id: 'free-saturday',
    title: '🎯 주말 AI 수익화 라이브',
    description: 'AI 수익화 Q&A, 실제 사례 분석, 시청자 질문에 답하는 자유로운 토크!',
    vimeoEventId: '',
    dayOfWeek: '토요일',
    time: '오후 2:00',
    duration: '45분',
    instructor: '정원석 (AI 멘토 제이)',
    requiredCourseId: null,
    isFree: true,
    youtubeUrl: 'https://www.youtube.com/@CONNECT-AI-LAB',
    category: 'free'
  }
];

// 강의별 구매 링크
const COURSE_PURCHASE_LINKS: { [key: number]: string } = {
  999: '/ai-building-course',
  1002: '/chatgpt-agent-beginner',
  1003: '#',
  1004: '#'
};

const LiveHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);
  const [selectedLive, setSelectedLive] = useState<LiveSchedule | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'premium'>('all');

  useEffect(() => {
    const userSession = sessionStorage.getItem('aicitybuilders_user_session');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        setIsLoggedIn(true);
        setUserName(user?.name || user?.email || '');
        const purchased = user?.purchasedCourses || [];
        setPurchasedCourses(purchased);
      } catch (e) {
        console.error('사용자 정보 파싱 오류:', e);
      }
    }
  }, []);

  const canAccessLive = (schedule: LiveSchedule) => {
    if (schedule.isFree) return true;
    if (!isLoggedIn) return false;
    if (!schedule.requiredCourseId) return true;
    return purchasedCourses.includes(schedule.requiredCourseId);
  };

  const handleLiveClick = (schedule: LiveSchedule) => {
    if (schedule.isFree && schedule.youtubeUrl) {
      window.open(schedule.youtubeUrl, '_blank');
      return;
    }
    
    if (!isLoggedIn) {
      const confirmLogin = window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?');
      if (confirmLogin) navigate('/login');
      return;
    }

    if (!canAccessLive(schedule)) {
      const courseName = schedule.title.split(':')[1]?.trim() || '해당 강의';
      const confirmPurchase = window.confirm(
        `이 라이브는 "${courseName}" 수강생 전용입니다.\n\n강의 구매 페이지로 이동하시겠습니까?`
      );
      if (confirmPurchase && schedule.requiredCourseId) {
        navigate(COURSE_PURCHASE_LINKS[schedule.requiredCourseId] || '/');
      }
      return;
    }

    setSelectedLive(schedule);
  };

  const filteredSchedules = WEEKLY_SCHEDULES.filter(schedule => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'free') return schedule.isFree;
    if (activeFilter === 'premium') return !schedule.isFree;
    return true;
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(180deg, ${COLORS.navyMid} 0%, ${COLORS.navy} 40%, ${COLORS.navyLight} 100%)`
    }}>
      <NavigationBar />
      
      {selectedLive ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
          <button
            onClick={() => setSelectedLive(null)}
            style={{
              background: 'transparent',
              color: COLORS.gold,
              border: `1px solid ${COLORS.gold}40`,
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '25px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${COLORS.gold}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ← 라이브 목록으로
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            marginBottom: '25px',
            flexWrap: 'wrap'
          }}>
        <div style={{ 
          display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
              padding: '10px 20px',
              borderRadius: '25px',
              boxShadow: `0 4px 15px ${COLORS.gold}40`
            }}>
              <span style={{ 
                width: '10px', 
                height: '10px', 
                background: COLORS.white, 
                borderRadius: '50%',
                animation: 'blink 1s infinite'
              }}></span>
              <span style={{ color: COLORS.navyDark, fontWeight: '700', fontSize: '0.9rem' }}>
                {selectedLive.dayOfWeek} {selectedLive.time}
              </span>
            </div>
            <h1 style={{ 
              color: COLORS.white, 
              fontSize: 'clamp(1.4rem, 4vw, 2rem)', 
              fontWeight: '700', 
              margin: 0 
            }}>
              {selectedLive.title}
            </h1>
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%',
            background: COLORS.navyDark,
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '30px',
            boxShadow: `0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px ${COLORS.gold}30`,
            border: `2px solid ${COLORS.gold}30`
          }}>
            <iframe
              src={`https://player.vimeo.com/video/${selectedLive.vimeoEventId}?autoplay=0&title=0&byline=0&portrait=0`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={selectedLive.title}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.navyLight}, ${COLORS.navy})`,
              borderRadius: '16px',
              padding: '28px',
              border: `1px solid ${COLORS.gold}25`,
              boxShadow: `0 10px 30px rgba(0,0,0,0.3)`
            }}>
              <h3 style={{ 
                color: COLORS.gold, 
                fontSize: '1.2rem', 
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.3rem' }}>📋</span> 세션 정보
              </h3>
              <p style={{ color: COLORS.gray, lineHeight: '1.8', marginBottom: '22px' }}>
                {selectedLive.description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: '👨‍🏫', label: selectedLive.instructor },
                  { icon: '⏱️', label: selectedLive.duration },
                  { icon: '📅', label: `매주 ${selectedLive.dayOfWeek} ${selectedLive.time}` }
                ].map((item, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '10px 14px',
                    background: `${COLORS.navyDark}80`,
                    borderRadius: '10px'
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                    <span style={{ color: COLORS.white, fontSize: '0.95rem' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.goldDark}10)`,
              borderRadius: '16px',
              padding: '28px',
              border: `1px solid ${COLORS.gold}40`
            }}>
              <h3 style={{ 
                color: COLORS.goldLight, 
                fontSize: '1.2rem', 
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.3rem' }}>📢</span> 라이브 안내
              </h3>
              <ul style={{ 
                color: COLORS.gray, 
                lineHeight: '2.2',
                paddingLeft: '0',
                margin: 0,
                listStyle: 'none'
              }}>
                {[
                  '라이브 시작 10분 전 입장 권장',
                  '채팅으로 실시간 질문 가능',
                  '라이브 종료 후 다시보기 제공',
                  '소리가 안 들리면 음소거 해제 확인'
                ].map((text, i) => (
                  <li key={i} style={{ 
                    display: 'flex', 
          alignItems: 'center',
          gap: '10px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ color: COLORS.gold }}>✦</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '50px 20px' }}>
          {/* 헤더 */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
              padding: '12px 30px',
          borderRadius: '30px',
              marginBottom: '25px',
              boxShadow: `0 8px 25px ${COLORS.gold}35`
        }}>
          <span style={{ 
            width: '12px', 
            height: '12px', 
                background: COLORS.white, 
            borderRadius: '50%',
                animation: 'blink 1s infinite',
                boxShadow: `0 0 10px ${COLORS.white}`
          }}></span>
              <span style={{ 
                color: COLORS.navyDark, 
                fontWeight: '800', 
                fontSize: '1.1rem',
                letterSpacing: '0.5px'
              }}>LIVE</span>
        </div>

        <h1 style={{ 
              color: COLORS.white, 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
          fontWeight: '800',
              marginBottom: '15px',
              lineHeight: '1.3',
              textShadow: `0 4px 20px rgba(0,0,0,0.3)`
        }}>
              주간 라이브 스케줄
        </h1>
        
        <p style={{ 
              color: COLORS.gray, 
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              lineHeight: '1.7',
              marginBottom: '35px'
            }}>
              매주 <span style={{ color: COLORS.gold, fontWeight: '600' }}>6회</span> 라이브 ·
              무료 라이브는 <span style={{ color: COLORS.gold, fontWeight: '600' }}>누구나</span> ·
              프리미엄은 <span style={{ color: COLORS.gold, fontWeight: '600' }}>수강생 전용</span>
            </p>

            {/* 필터 버튼 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              {[
                { key: 'all', label: '전체 보기' },
                { key: 'free', label: '🔓 무료 라이브' },
                { key: 'premium', label: '👑 프리미엄' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as any)}
                  style={{
                    background: activeFilter === filter.key 
                      ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})` 
                      : `${COLORS.navyLight}`,
                    color: activeFilter === filter.key ? COLORS.navyDark : COLORS.white,
                    border: `1px solid ${activeFilter === filter.key ? COLORS.gold : COLORS.gold}30`,
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => {
                    if (activeFilter !== filter.key) {
                      e.currentTarget.style.borderColor = COLORS.gold;
                      e.currentTarget.style.background = `${COLORS.gold}15`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeFilter !== filter.key) {
                      e.currentTarget.style.borderColor = `${COLORS.gold}30`;
                      e.currentTarget.style.background = COLORS.navyLight;
                    }
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* 주간 스케줄 그리드 */}
        <div style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '22px',
            marginBottom: '60px'
          }}>
            {filteredSchedules.map((schedule) => {
              const hasAccess = canAccessLive(schedule);
              
              return (
                <div
                  key={schedule.id}
                  onClick={() => handleLiveClick(schedule)}
                  style={{
                    background: `linear-gradient(145deg, ${COLORS.navyLight}ee, ${COLORS.navyMid}dd)`,
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: `2px solid ${hasAccess ? COLORS.goldAccent : COLORS.gold}50`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: hasAccess ? 1 : 0.85,
          position: 'relative',
                    boxShadow: hasAccess 
                      ? `0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 ${COLORS.gold}25` 
                      : '0 5px 20px rgba(0,0,0,0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = `0 20px 45px rgba(0,0,0,0.4), 0 0 0 1px ${COLORS.gold}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = hasAccess 
                      ? `0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 ${COLORS.gold}15` 
                      : '0 5px 20px rgba(0,0,0,0.2)';
                  }}
                >
                  {/* 상단 요일/시간 바 */}
                  <div style={{
                    background: schedule.isFree 
                      ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`
                      : `linear-gradient(135deg, ${COLORS.navyDark}, ${COLORS.navy})`,
                    padding: '14px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid ${COLORS.gold}20`
                  }}>
                    <span style={{ 
                      color: schedule.isFree ? COLORS.navyDark : COLORS.gold, 
                      fontWeight: '700',
                      fontSize: '0.95rem'
                    }}>
                      {schedule.dayOfWeek} {schedule.time}
                    </span>
                    <span style={{ 
                      color: schedule.isFree ? COLORS.navyDark : COLORS.goldLight, 
                      fontSize: '0.8rem',
                      background: schedule.isFree ? `${COLORS.white}30` : `${COLORS.gold}20`,
                      padding: '5px 12px',
                      borderRadius: '15px',
                      fontWeight: '600'
                    }}>
                      {schedule.isFree ? '🔓 무료' : '👑 수강생 전용'}
                    </span>
                  </div>

                  {/* 콘텐츠 */}
                  <div style={{ padding: '22px' }}>
                    <h3 style={{ 
                      color: COLORS.white, 
                      fontSize: '1.25rem', 
                      fontWeight: '700',
                      marginBottom: '12px',
                      lineHeight: '1.4',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                      {schedule.title}
                    </h3>
                    
                    <p style={{ 
                      color: COLORS.text, 
                      fontSize: '0.95rem',
                      lineHeight: '1.7',
                      marginBottom: '18px',
                      opacity: 0.9
                    }}>
                      {schedule.description}
                    </p>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      paddingTop: '15px',
                      borderTop: `1px solid ${COLORS.gold}15`
                    }}>
                      <span style={{ 
                        color: COLORS.grayDark, 
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        ⏱️ {schedule.duration}
                      </span>
                      
                      {hasAccess ? (
                        <span style={{ 
                          color: COLORS.gold, 
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          ✓ 입장 가능
                        </span>
                      ) : (
                        <span style={{ 
                          color: COLORS.gray, 
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          🔒 강의 구매 필요
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 잠금 오버레이 */}
                  {!hasAccess && !schedule.isFree && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: `linear-gradient(135deg, ${COLORS.navyMid}f5, ${COLORS.navyDark}f0)`,
                      padding: '20px 35px',
                      borderRadius: '16px',
                      textAlign: 'center',
                      border: `2px solid ${COLORS.goldAccent}60`,
                      backdropFilter: 'blur(6px)',
                      boxShadow: `0 8px 25px rgba(0,0,0,0.4)`
                    }}>
                      <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>🔒</div>
                      <div style={{ 
                        color: COLORS.goldAccent, 
                        fontSize: '0.95rem', 
                        fontWeight: '700' 
                      }}>
                        강의 구매 후 입장
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 💰 가격 가성비 섹션 */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.gold}25, ${COLORS.goldDark}15)`,
            borderRadius: '22px',
            padding: '35px',
            border: `2px solid ${COLORS.goldAccent}60`,
            marginBottom: '25px',
            boxShadow: `0 10px 30px rgba(0,0,0,0.2)`
          }}>
            <h3 style={{ 
              color: COLORS.goldLight, 
              fontSize: '1.5rem', 
              marginBottom: '25px', 
              textAlign: 'center',
              fontWeight: '800'
            }}>
              💰 이 가격 실화? 라이브 가성비
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                background: `${COLORS.navyDark}90`,
                padding: '25px 20px',
                borderRadius: '16px',
                border: `1px solid ${COLORS.gold}30`
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>☕</div>
                <div style={{ color: COLORS.goldAccent, fontSize: '2rem', fontWeight: '800', marginBottom: '5px' }}>
                  1,826원
                </div>
                <div style={{ color: COLORS.text, fontSize: '0.9rem', opacity: 0.8 }}>
                  라이브 1회당 가격
                </div>
                <div style={{ color: COLORS.gray, fontSize: '0.8rem', marginTop: '8px' }}>
                  (95,000원 ÷ 52회)
                </div>
              </div>
          
              <div style={{
                background: `${COLORS.navyDark}90`,
                padding: '25px 20px',
                borderRadius: '16px',
                border: `1px solid ${COLORS.gold}30`
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📚</div>
                <div style={{ color: COLORS.goldAccent, fontSize: '2rem', fontWeight: '800', marginBottom: '5px' }}>
                  +무료
                </div>
                <div style={{ color: COLORS.text, fontSize: '0.9rem', opacity: 0.8 }}>
                  기본 녹화 강의 포함
                </div>
                <div style={{ color: COLORS.gray, fontSize: '0.8rem', marginTop: '8px' }}>
                  (영구 소장)
                </div>
              </div>
              
              <div style={{
                background: `${COLORS.navyDark}90`,
                padding: '25px 20px',
                borderRadius: '16px',
                border: `1px solid ${COLORS.gold}30`
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔄</div>
                <div style={{ color: COLORS.goldAccent, fontSize: '2rem', fontWeight: '800', marginBottom: '5px' }}>
                  52회
                </div>
                <div style={{ color: COLORS.text, fontSize: '0.9rem', opacity: 0.8 }}>
                  연간 라이브 횟수
                </div>
                <div style={{ color: COLORS.gray, fontSize: '0.8rem', marginTop: '8px' }}>
                  (매주 1회)
                </div>
              </div>
            </div>
          </div>

          {/* 안내 섹션 */}
          <div style={{
            background: `linear-gradient(145deg, ${COLORS.navyLight}ee, ${COLORS.navyMid}dd)`,
            borderRadius: '22px',
            padding: '35px',
            border: `1px solid ${COLORS.gold}35`,
            marginBottom: '35px',
            boxShadow: `0 15px 40px rgba(0,0,0,0.25)`
          }}>
            <h3 style={{ 
              color: COLORS.goldLight, 
              fontSize: '1.4rem', 
              marginBottom: '30px', 
              textAlign: 'center',
              fontWeight: '700'
            }}>
              ✦ 라이브 참여 안내 ✦
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '25px'
            }}>
              {[
                { icon: '🔓', title: '무료 라이브', desc: '월/토 유튜브에서 진행\n누구나 참여 가능', color: COLORS.goldLight },
                { icon: '👑', title: '프리미엄 라이브', desc: '해당 Step 구매자만 입장\n심화 내용 + Q&A', color: COLORS.goldAccent },
                { icon: '📁', title: '다시보기', desc: '모든 라이브 아카이브\n1년간 무제한 시청', color: COLORS.gold }
              ].map((item, i) => (
                <div key={i} style={{ 
                  textAlign: 'center',
                  padding: '25px 20px',
                  background: `${COLORS.navyDark}80`,
                  borderRadius: '16px',
                  border: `1px solid ${COLORS.gold}25`
                }}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    filter: `drop-shadow(0 4px 8px ${COLORS.gold}40)`
                  }}>{item.icon}</div>
                  <h4 style={{ 
                    color: item.color, 
                    marginBottom: '12px',
                    fontSize: '1.15rem',
                    fontWeight: '700'
                  }}>{item.title}</h4>
                  <p style={{ 
                    color: COLORS.text, 
                    fontSize: '0.95rem', 
                    lineHeight: '1.7', 
                    margin: '0',
                    whiteSpace: 'pre-line',
                    opacity: 0.85
                  }}>{item.desc}</p>
                </div>
              ))}
          </div>
        </div>

          {/* 로그인 / 구매 안내 */}
        {!isLoggedIn ? (
          <div style={{
              background: `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.goldDark}10)`,
              border: `2px solid ${COLORS.gold}50`,
              borderRadius: '18px',
              padding: '35px',
              textAlign: 'center'
          }}>
              <p style={{ 
                color: COLORS.white, 
                marginBottom: '22px', 
                fontSize: '1.15rem',
                fontWeight: '500'
              }}>
                🔒 프리미엄 라이브는 <span style={{ color: COLORS.gold, fontWeight: '700' }}>로그인 후</span> 이용 가능합니다
            </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                    color: COLORS.navyDark,
                  border: 'none',
                    padding: '15px 40px',
                    borderRadius: '12px',
                  fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    boxShadow: `0 8px 25px ${COLORS.gold}40`,
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 12px 30px ${COLORS.gold}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${COLORS.gold}40`;
                }}
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  background: 'transparent',
                    color: COLORS.gold,
                    border: `2px solid ${COLORS.gold}`,
                    padding: '15px 40px',
                    borderRadius: '12px',
                  fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${COLORS.gold}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                }}
              >
                회원가입
              </button>
            </div>
          </div>
        ) : (
          <div style={{
              background: `linear-gradient(135deg, ${COLORS.gold}20, ${COLORS.goldDark}15)`,
              border: `1px solid ${COLORS.gold}50`,
            borderRadius: '16px',
              padding: '28px',
              textAlign: 'center'
          }}>
              <p style={{ color: COLORS.goldLight, fontSize: '1.15rem', margin: 0, fontWeight: '500' }}>
                ✓ <span style={{ fontWeight: '700' }}>{userName}</span>님, 구매한 강의의 라이브에 입장할 수 있습니다!
            </p>
          </div>
        )}

          {/* 메인으로 */}
          <div style={{ textAlign: 'center', marginTop: '35px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
                color: COLORS.grayDark,
                border: `1px solid ${COLORS.gold}30`,
                padding: '14px 35px',
                borderRadius: '12px',
            cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.gold;
                e.currentTarget.style.color = COLORS.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${COLORS.gold}30`;
                e.currentTarget.style.color = COLORS.grayDark;
          }}
        >
          ← 메인으로 돌아가기
        </button>
      </div>
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default LiveHubPage;
