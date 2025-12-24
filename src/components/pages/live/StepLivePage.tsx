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
    description: '맨해튼 부동산 비유로 배우는 AI 콘텐츠 수익화. 매주 최신 AI 도구 업데이트!',
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
    title: '바이브코딩',
    description: '수익화 확장의 첫걸음! 내 사업 도구 직접 만들기',
    dayOfWeek: '목요일',
    time: '오후 8:00',
    courseId: 1003,
    vimeoEventId: '1044498498',
    price: null,
    purchaseLink: '/vibe-coding',
    icon: '💻',
    color: '#8b5cf6'
  },
  step4: {
    id: 'step4',
    name: 'Step 4',
    title: '1인 기업 만들기',
    description: '크리에이터에서 CEO로! 사업자등록, 세금, 정부지원금까지.',
    dayOfWeek: '금요일',
    time: '오후 8:00',
    courseId: 1004,
    vimeoEventId: '1044498498',
    price: null,
    purchaseLink: '/solo-business',
    icon: '🏢',
    color: '#f59e0b'
  }
};

// 아카이브 샘플 데이터 (나중에 Azure에서 가져옴)
interface ArchiveItem {
  id: string;
  episode: number;
  title: string;
  date: string;
  duration: string;
  vimeoId?: string;
  youtubeId?: string;
  thumbnail?: string;
}

// 아카이브는 Azure에서 직접 가져옴

interface StepLivePageProps {
  onBack: () => void;
}

const StepLivePage: React.FC<StepLivePageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveNow, setIsLiveNow] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');
  const [liveTitle, setLiveTitle] = useState('');
  const [selectedArchive] = useState<ArchiveItem | null>(null);
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [nextLiveDate, setNextLiveDate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const stepInfo = stepId ? STEP_INFO[stepId] : null;
  
  // Step ID를 Azure courseId로 매핑
  const getCourseIdForStep = (step: string): string => {
    const mapping: { [key: string]: string } = {
      'step1': 'ai-building-course',
      'step2': 'chatgpt-agent-beginner',
      'step3': 'vibe-coding',
      'step4': 'solo-business'
    };
    return mapping[step] || step;
  };

  // Azure에서 라이브 설정 가져오기 + 다음 라이브 날짜 계산
  useEffect(() => {
    if (!stepInfo || !stepId) return;

    const loadLiveConfig = async () => {
      try {
        const courseId = getCourseIdForStep(stepId);
        console.log('🔴 라이브 설정 로드 중...', courseId);
        
        const config = await AzureTableService.getCurrentLiveConfig(courseId);
        console.log('📡 Azure 라이브 설정:', config);
        
        if (config && config.isLive && config.liveUrl) {
          setIsLiveNow(true);
          setLiveUrl(config.liveUrl);
          setLiveTitle(config.liveTitle || '라이브 진행 중');
          console.log('✅ 라이브 ON!', config.liveUrl);
        } else {
          setIsLiveNow(false);
          console.log('⏸️ 라이브 OFF');
        }
      } catch (error) {
        console.error('라이브 설정 로드 실패:', error);
      }
    };
    
    loadLiveConfig();

    // 다음 라이브 날짜 계산
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
  }, [stepInfo, stepId]);

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
          
          // Azure에서 아카이브 가져오기
          const courseIdForArchive = getCourseIdForStep(stepId || 'step1');
          const azureArchives = await AzureTableService.getLiveArchives(courseIdForArchive);
          
          if (azureArchives && azureArchives.length > 0) {
            const formattedArchives: ArchiveItem[] = azureArchives.map((a: any, index: number) => ({
              id: a.RowKey || `archive-${index}`,
              episode: azureArchives.length - index,
              title: a.title || '라이브 아카이브',
              date: a.date || new Date(a.Timestamp || Date.now()).toLocaleDateString('ko-KR'),
              duration: a.duration || '약 60분',
              youtubeId: a.youtubeId,
              thumbnail: a.youtubeId ? `https://img.youtube.com/vi/${a.youtubeId}/mqdefault.jpg` : undefined
            }));
            setArchives(formattedArchives);
          }
          
          setIsLoading(false);
          return;
        }

        // Azure에서 결제 상태 확인 (checkCoursePayment 사용)
        const courseIdForPayment = getCourseIdForStep(stepId || 'step1');
        console.log('🔍 Step 라이브 결제 확인 시작:', {
          email: user.email,
          stepId,
          courseIdForPayment,
          stepInfoCourseId: stepInfo.courseId
        });
        
        const paymentStatus = await AzureTableService.checkCoursePayment(user.email, courseIdForPayment);
        
        console.log('💳 결제 확인 결과:', paymentStatus);

        if (paymentStatus && paymentStatus.isPaid) {
          console.log('✅ 결제 확인됨! 접근 허용');
          setHasAccess(true);
          
          // Azure에서 아카이브 가져오기
          const courseIdForArchive = getCourseIdForStep(stepId || 'step1');
          const azureArchives = await AzureTableService.getLiveArchives(courseIdForArchive);
          
          if (azureArchives && azureArchives.length > 0) {
            // Azure 아카이브를 ArchiveItem 형식으로 변환
            const formattedArchives: ArchiveItem[] = azureArchives.map((a: any, index: number) => ({
              id: a.RowKey || `archive-${index}`,
              episode: azureArchives.length - index,
              title: a.title || '라이브 아카이브',
              date: a.date || new Date(a.Timestamp || Date.now()).toLocaleDateString('ko-KR'),
              duration: a.duration || '약 60분',
              youtubeId: a.youtubeId,
              thumbnail: a.youtubeId ? `https://img.youtube.com/vi/${a.youtubeId}/mqdefault.jpg` : undefined
            }));
            setArchives(formattedArchives);
          }
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
            {isLiveNow && liveUrl ? (
              <div style={{
                aspectRatio: '16/9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
                color: COLORS.white,
                padding: '40px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#ff0000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  animation: 'pulse 2s infinite'
                }}>
                  <span style={{ fontSize: '2rem' }}>▶</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px' }}>
                  🔴 {liveTitle || '라이브 진행 중!'}
                </h2>
                <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '24px' }}>
                  지금 바로 라이브에 참여하세요!
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${liveUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #ff0000, #cc0000)',
                    color: 'white',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(255,0,0,0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 30px rgba(255,0,0,0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,0,0,0.4)';
                  }}
                >
                  🎓 수강생 전용 라이브 보러가기
                </a>
              </div>
            ) : selectedArchive ? (
              <div style={{
                aspectRatio: '16/9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
                color: COLORS.white,
                padding: '40px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: COLORS.gold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Play size={32} color={COLORS.navyDark} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>
                  {selectedArchive.title}
                </h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '20px' }}>
                  {selectedArchive.date} · {selectedArchive.duration}
                </p>
                <a
                  href={selectedArchive.youtubeId 
                    ? `https://www.youtube.com/watch?v=${selectedArchive.youtubeId}`
                    : `https://vimeo.com/${selectedArchive.vimeoId}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                    color: COLORS.navyDark,
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    boxShadow: `0 4px 20px ${COLORS.gold}40`,
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  📺 아카이브 영상 보러가기
                </a>
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
          
        </div>
        
        {/* 아카이브 섹션 */}
        {archives.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
            <Archive size={28} color={COLORS.navy} />
            <h2 style={{ color: COLORS.navy, fontSize: '1.5rem', fontWeight: '800' }}>
              📚 지난 라이브 다시보기
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
              <a
                key={archive.id}
                href={archive.youtubeId 
                  ? `https://www.youtube.com/watch?v=${archive.youtubeId}`
                  : `https://vimeo.com/${archive.vimeoId}`
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: COLORS.white,
                  borderRadius: '15px',
                  overflow: 'hidden',
                  border: `2px solid ${COLORS.navy}15`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 15px ${COLORS.navy}10`,
                  textDecoration: 'none',
                  display: 'block'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${COLORS.gold}30`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${COLORS.navy}10`;
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
              </a>
            ))}
          </div>
          
        </div>
        )}
        
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

