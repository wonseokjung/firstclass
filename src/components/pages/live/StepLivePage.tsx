import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Lock, Calendar, Archive, Tv } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

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
  green: '#22c55e'
};

// Step 정보 타입
interface StepInfo {
  id: string;
  name: string;
  title: string;
  description: string;
  dayOfWeek: string;
  time: string;
  courseId: number;
  vimeoEventId: string;
  price: number | null;
  purchaseLink: string;
  icon: string;
  color: string;
}

// Step별 정보
const STEP_INFO: { [key: string]: StepInfo } = {
  step1: {
    id: 'step1',
    name: 'Step 1',
    title: 'AI 건물주 되기',
    description: 'AI 이미지 수익화, 콘텐츠 제작 실습. 수강생 Q&A 및 피드백.',
    dayOfWeek: '화요일',
    time: '오후 8:00',
    courseId: 999,
    vimeoEventId: '1044498498',
    price: 45000,
    purchaseLink: '/ai-building-course',
    icon: '🏗️',
    color: COLORS.navy
  },
  step2: {
    id: 'step2',
    name: 'Step 2',
    title: 'AI 에이전트 비기너',
    description: '이미지/영상 생성, 유튜브 채널, 나레이션 에이전트 제작 실습. 수익화 자동화!',
    dayOfWeek: '수요일',
    time: '오후 8:00',
    courseId: 1002,
    vimeoEventId: '1044498498',
    price: 95000,
    purchaseLink: '/chatgpt-agent-beginner',
    icon: '🤖',
    color: COLORS.gold
  },
  step3: {
    id: 'step3',
    name: 'Step 3',
    title: '1인 콘텐츠 기업 (바이브코딩)',
    description: '바이브코딩으로 나만의 서비스/앱 개발! AI와 함께 1인 기업 구축 프로젝트.',
    dayOfWeek: '목요일',
    time: '오후 8:00',
    courseId: 1003,
    vimeoEventId: '1044498498',
    price: null,
    purchaseLink: '/content-business',
    icon: '🎸',
    color: '#8b5cf6'
  },
  step4: {
    id: 'step4',
    name: 'Step 4',
    title: 'AI 에이전트 파견소',
    description: '직접 만들기 어려운 건 AI 에이전트 파견소에서! 자동화 도구 제공.',
    dayOfWeek: '금요일',
    time: '오후 8:00',
    courseId: 1004,
    vimeoEventId: '1044498498',
    price: null,
    purchaseLink: '#',
    icon: '🚀',
    color: '#10b981'
  }
};

// 아카이브 샘플 데이터 (나중에 Azure에서 가져옴)
interface ArchiveItem {
  id: string;
  episode: number;
  title: string;
  date: string;
  duration: string;
  vimeoId: string;
  thumbnail?: string;
}

// 샘플 아카이브 생성 함수
const generateSampleArchives = (stepId: string): ArchiveItem[] => {
  const archives: ArchiveItem[] = [];
  const baseDate = new Date();
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - (i * 7));
    
    archives.push({
      id: `${stepId}-ep${52 - i}`,
      episode: 52 - i,
      title: `EP.${52 - i} - ${STEP_INFO[stepId]?.title || 'AI 라이브'} 라이브`,
      date: date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }),
      duration: '58:32',
      vimeoId: '1044498498',
      thumbnail: `/images/main/${stepId === 'step1' ? '1' : stepId === 'step2' ? '2' : stepId === 'step3' ? '3' : '4'}.jpeg`
    });
  }
  
  return archives;
};

interface StepLivePageProps {
  onBack: () => void;
}

const StepLivePage: React.FC<StepLivePageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveNow, setIsLiveNow] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<ArchiveItem | null>(null);
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [nextLiveDate, setNextLiveDate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const stepInfo = stepId ? STEP_INFO[stepId] : null;

  // 다음 라이브 날짜 계산
  useEffect(() => {
    if (!stepInfo) return;

    const dayMap: { [key: string]: number } = {
      '일요일': 0, '월요일': 1, '화요일': 2, '수요일': 3,
      '목요일': 4, '금요일': 5, '토요일': 6
    };

    const targetDay = dayMap[stepInfo.dayOfWeek];
    const now = new Date();
    const currentDay = now.getDay();
    let daysUntil = targetDay - currentDay;
    if (daysUntil <= 0) daysUntil += 7;

    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysUntil);
    nextDate.setHours(20, 0, 0, 0);
    setNextLiveDate(nextDate);

    // 현재 라이브 중인지 체크
    const liveEndTime = new Date(nextDate);
    liveEndTime.setHours(21, 0, 0, 0);
    if (now >= nextDate && now <= liveEndTime && currentDay === targetDay) {
      setIsLiveNow(true);
    }
  }, [stepInfo]);

  // 카운트다운 업데이트
  useEffect(() => {
    if (!nextLiveDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextLiveDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextLiveDate]);

  // 접근 권한 체크
  useEffect(() => {
    const checkAccess = async () => {
      if (!stepInfo) {
        setIsLoading(false);
        return;
      }

      const userSession = sessionStorage.getItem('aicitybuilders_user_session');
      if (!userSession) {
        setIsLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userSession);
        
        // 테스트 계정 체크
        if (user.email === 'test10@gmail.com') {
          setHasAccess(true);
          setArchives(generateSampleArchives(stepId || 'step1'));
          setIsLoading(false);
          return;
        }

        // Azure에서 구매 확인
        const purchasedCourses = await AzureTableService.getUserPurchasedCourses(user.email);
        const courseIds = purchasedCourses.map(p => {
          if (p.courseId === 'ai-building-course') return 999;
          if (p.courseId === 'chatgpt-agent-beginner') return 1002;
          return null;
        }).filter(id => id !== null) as number[];

        if (courseIds.includes(stepInfo.courseId)) {
          setHasAccess(true);
          setArchives(generateSampleArchives(stepId || 'step1'));
        }
      } catch (error) {
        console.error('접근 권한 확인 실패:', error);
      }

      setIsLoading(false);
    };

    checkAccess();
  }, [stepInfo, stepId]);

  if (!stepInfo) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.grayLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', color: COLORS.navy }}>페이지를 찾을 수 없습니다</h1>
          <button onClick={() => navigate('/live')} style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: COLORS.navy,
            color: COLORS.white,
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            라이브 허브로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: `linear-gradient(135deg, ${COLORS.navy}10, ${COLORS.grayLight})`,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: `4px solid ${COLORS.navy}20`,
          borderTop: `4px solid ${COLORS.gold}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: COLORS.navy, fontWeight: '600' }}>라이브 정보 확인 중...</p>
      </div>
    );
  }

  // 접근 권한 없음
  if (!hasAccess) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.white }}>
        <NavigationBar onBack={onBack} breadcrumbText={`${stepInfo.name} 라이브`} />
        
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
          padding: '80px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
              borderRadius: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              fontSize: '3rem',
              boxShadow: `0 10px 30px ${COLORS.gold}40`
            }}>
              <Lock size={48} color={COLORS.white} />
            </div>
            
            <h1 style={{ 
              color: COLORS.white, 
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '800',
              marginBottom: '15px'
            }}>
              {stepInfo.icon} {stepInfo.name} 라이브
            </h1>
            
            <p style={{ 
              color: COLORS.goldLight, 
              fontSize: '1.2rem',
              marginBottom: '30px'
            }}>
              {stepInfo.title}
            </p>
            
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '30px'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                이 라이브에 참여하려면<br/>
                <strong style={{ color: COLORS.goldLight }}>{stepInfo.name}: {stepInfo.title}</strong> 강의를<br/>
                구매해야 합니다.
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255,255,255,0.8)'
              }}>
                <Calendar size={20} />
                <span>매주 {stepInfo.dayOfWeek} {stepInfo.time}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255,255,255,0.8)'
              }}>
                <Archive size={20} />
                <span>연간 52회 라이브 + 전체 아카이브</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate(stepInfo.purchaseLink)}
              style={{
                marginTop: '40px',
                padding: '18px 40px',
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                color: COLORS.navyDark,
                border: 'none',
                borderRadius: '15px',
                fontSize: '1.2rem',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: `0 8px 25px ${COLORS.gold}40`,
                transition: 'all 0.3s ease'
              }}
            >
              {stepInfo.price ? `₩${stepInfo.price.toLocaleString()}에 구매하기` : '강의 보러가기'} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 접근 권한 있음 - 라이브 페이지
  return (
    <div style={{ minHeight: '100vh', background: COLORS.white }}>
      <NavigationBar onBack={onBack} breadcrumbText={`${stepInfo.name} 라이브`} />
      
      {/* 헤더 */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
        padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 장식 */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${COLORS.gold}20 0%, transparent 70%)`,
          borderRadius: '50%'
        }}></div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              boxShadow: `0 8px 20px ${COLORS.gold}40`
            }}>
              {stepInfo.icon}
            </div>
            <div>
              <h1 style={{ color: COLORS.white, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', marginBottom: '5px' }}>
                {stepInfo.name}: {stepInfo.title}
              </h1>
              <p style={{ color: COLORS.goldLight, fontSize: '1.1rem' }}>
                매주 {stepInfo.dayOfWeek} {stepInfo.time} 라이브
              </p>
            </div>
          </div>
          
          {/* 라이브 상태 */}
          {isLiveNow ? (
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.red}, #dc2626)`,
              borderRadius: '15px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '15px',
                  height: '15px',
                  background: COLORS.white,
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite'
                }}></div>
                <span style={{ color: COLORS.white, fontSize: '1.3rem', fontWeight: '800' }}>
                  🔴 지금 라이브 중!
                </span>
              </div>
              <Tv size={28} color={COLORS.white} />
            </div>
          ) : (
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.navyLight}80, ${COLORS.navy}90)`,
              border: `2px solid ${COLORS.gold}40`,
              borderRadius: '15px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginBottom: '5px' }}>다음 라이브까지</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[
                      { value: countdown.days, label: '일' },
                      { value: countdown.hours, label: '시간' },
                      { value: countdown.minutes, label: '분' },
                      { value: countdown.seconds, label: '초' }
                    ].map((item, idx) => (
                      <div key={idx} style={{
                        background: COLORS.navyDark,
                        borderRadius: '10px',
                        padding: '10px 15px',
                        textAlign: 'center',
                        minWidth: '60px'
                      }}>
                        <div style={{ color: COLORS.goldLight, fontSize: '1.5rem', fontWeight: '800' }}>
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: COLORS.goldLight, fontSize: '1.1rem', fontWeight: '600' }}>
                    {nextLiveDate?.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.8)' }}>{stepInfo.time}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 메인 컨텐츠 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)' }}>
        
        {/* 현재 선택된 영상 또는 라이브 플레이어 */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{
            background: COLORS.navyDark,
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: `0 10px 40px ${COLORS.navy}30`
          }}>
            {isLiveNow ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={`https://vimeo.com/event/${stepInfo.vimeoEventId}/embed`}
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
                  title={`${stepInfo.name} 라이브`}
                />
              </div>
            ) : selectedArchive ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={`https://player.vimeo.com/video/${selectedArchive.vimeoId}?h=&badge=0&autopause=0&player_id=0&app_id=58479`}
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
                  title={selectedArchive.title}
                />
              </div>
            ) : (
              <div style={{
                aspectRatio: '16/9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
                color: COLORS.white,
                padding: '40px'
              }}>
                <Tv size={80} color={COLORS.gold} style={{ marginBottom: '20px', opacity: 0.8 }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>
                  다음 라이브를 기다려주세요!
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                  아래 아카이브에서 지난 라이브를 시청할 수 있어요
                </p>
              </div>
            )}
          </div>
          
          {selectedArchive && (
            <div style={{ marginTop: '20px' }}>
              <h2 style={{ color: COLORS.navy, fontSize: '1.3rem', fontWeight: '700' }}>
                {selectedArchive.title}
              </h2>
              <p style={{ color: COLORS.grayMedium, marginTop: '5px' }}>
                {selectedArchive.date} · {selectedArchive.duration}
              </p>
            </div>
          )}
        </div>
        
        {/* 아카이브 섹션 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
            <Archive size={28} color={COLORS.navy} />
            <h2 style={{ color: COLORS.navy, fontSize: '1.5rem', fontWeight: '800' }}>
              📚 지난 라이브 아카이브
            </h2>
            <span style={{
              background: COLORS.gold,
              color: COLORS.navyDark,
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '700'
            }}>
              {archives.length}개
            </span>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {archives.map((archive) => (
              <div
                key={archive.id}
                onClick={() => setSelectedArchive(archive)}
                style={{
                  background: COLORS.white,
                  borderRadius: '15px',
                  overflow: 'hidden',
                  border: selectedArchive?.id === archive.id ? `3px solid ${COLORS.gold}` : `2px solid ${COLORS.navy}15`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedArchive?.id === archive.id ? `0 8px 25px ${COLORS.gold}30` : `0 4px 15px ${COLORS.navy}10`
                }}
              >
                {/* 썸네일 */}
                <div style={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`,
                  overflow: 'hidden'
                }}>
                  {archive.thumbnail && (
                    <img 
                      src={archive.thumbnail} 
                      alt={archive.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.8
                      }}
                    />
                  )}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: `${COLORS.gold}cc`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}>
                      <Play size={24} color={COLORS.white} style={{ marginLeft: '3px' }} />
                    </div>
                  </div>
                  
                  {/* 에피소드 배지 */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: COLORS.gold,
                    color: COLORS.navyDark,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '800'
                  }}>
                    EP.{archive.episode}
                  </div>
                  
                  {/* 재생시간 */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: COLORS.white,
                    padding: '4px 8px',
                    borderRadius: '5px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {archive.duration}
                  </div>
                </div>
                
                {/* 정보 */}
                <div style={{ padding: '15px' }}>
                  <h3 style={{
                    color: COLORS.navyDark,
                    fontSize: '1rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {archive.title}
                  </h3>
                  <p style={{
                    color: COLORS.grayMedium,
                    fontSize: '0.85rem'
                  }}>
                    {archive.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* 더보기 */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button style={{
              padding: '12px 30px',
              background: 'transparent',
              border: `2px solid ${COLORS.navy}`,
              color: COLORS.navy,
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              더 많은 아카이브 보기 →
            </button>
          </div>
        </div>
        
        {/* 가성비 섹션 */}
        <div style={{
          marginTop: '60px',
          background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: COLORS.goldLight, fontSize: '1.3rem', fontWeight: '700', marginBottom: '25px' }}>
            💰 {stepInfo.name} 라이브 가성비
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              padding: '25px 35px',
              minWidth: '150px'
            }}>
              <div style={{ color: COLORS.gold, fontSize: '2rem', fontWeight: '800' }}>
                {stepInfo.price ? `₩${Math.round(stepInfo.price / 52).toLocaleString()}` : '미정'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '5px' }}>
                라이브 1회당
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              padding: '25px 35px',
              minWidth: '150px'
            }}>
              <div style={{ color: COLORS.gold, fontSize: '2rem', fontWeight: '800' }}>52회</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '5px' }}>
                연간 라이브
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              padding: '25px 35px',
              minWidth: '150px'
            }}>
              <div style={{ color: COLORS.gold, fontSize: '2rem', fontWeight: '800' }}>∞</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '5px' }}>
                전체 아카이브
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StepLivePage;

