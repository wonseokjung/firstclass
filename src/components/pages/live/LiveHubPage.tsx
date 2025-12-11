import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Lock, Calendar, Clock, Youtube, ChevronRight, Tv, Archive, Users, Zap } from 'lucide-react';
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
  green: '#22c55e',
  youtube: '#FF0000'
};

// 라이브 카테고리 타입
interface LiveCategory {
  id: string;
  name: string;
  title: string;
  description: string;
  dayOfWeek: string;
  time: string;
  icon: string;
  color: string;
  isFree: boolean;
  courseId: number | null;
  price: number | null;
  link: string;
  purchaseLink: string;
}

// 라이브 카테고리 정보
const LIVE_CATEGORIES: LiveCategory[] = [
  {
    id: 'free',
    name: '무료 라이브',
    title: 'AI 수익화 토크',
    description: 'AI로 돈 버는 현실적인 방법! 수익화 전략, 성공 사례를 무료로 공개합니다.',
    dayOfWeek: '월요일',
    time: '오후 8:00',
    icon: '🆓',
    color: COLORS.youtube,
    isFree: true,
    courseId: null,
    price: null,
    link: '/live/free',
    purchaseLink: ''
  },
  {
    id: 'step1',
    name: 'Step 1',
    title: 'AI 건물주 되기',
    description: 'AI 이미지 수익화, 콘텐츠 제작 실습. 수강생 Q&A 및 피드백.',
    dayOfWeek: '화요일',
    time: '오후 8:00',
    icon: '🏗️',
    color: COLORS.navy,
    isFree: false,
    courseId: 999,
    price: 36556,
    link: '/live/step1',
    purchaseLink: '/ai-building-course'
  },
  {
    id: 'step2',
    name: 'Step 2',
    title: 'AI 에이전트 비기너',
    description: '이미지/영상 생성, 유튜브 채널, 나레이션 에이전트 제작. 수익화 자동화!',
    dayOfWeek: '수요일',
    time: '오후 8:00',
    icon: '🤖',
    color: COLORS.gold,
    isFree: false,
    courseId: 1002,
    price: 95000,
    link: '/live/step2',
    purchaseLink: '/chatgpt-agent-beginner'
  },
  {
    id: 'step3',
    name: 'Step 3',
    title: 'AI 에이전트 파견소',
    description: 'AI 에이전트 실전 활용, 자동화 시스템 구축 라이브 코딩.',
    dayOfWeek: '목요일',
    time: '오후 8:00',
    icon: '🚀',
    color: '#10b981',
    isFree: false,
    courseId: 1003,
    price: null,
    link: '/live/step3',
    purchaseLink: '#'
  },
  {
    id: 'step4',
    name: 'Step 4',
    title: '1인 콘텐츠 기업 (바이브코딩)',
    description: '바이브코딩으로 나만의 서비스/앱 개발! AI와 함께 1인 기업 구축.',
    dayOfWeek: '금요일',
    time: '오후 8:00',
    icon: '🎸',
    color: '#8b5cf6',
    isFree: false,
    courseId: 1004,
    price: null,
    link: '/live/step4',
    purchaseLink: '#'
  }
];

interface LiveHubPageProps {
  onBack?: () => void;
}

const LiveHubPage: React.FC<LiveHubPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);
  const [nextLive, setNextLive] = useState<LiveCategory | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 사용자 및 구매 정보 체크
  useEffect(() => {
    const checkUser = async () => {
    const userSession = sessionStorage.getItem('aicitybuilders_user_session');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        setIsLoggedIn(true);

          // 테스트 계정
          if (user.email === 'test10@gmail.com') {
            setPurchasedCourses([999, 1002, 1003, 1004]);
            return;
          }

          // Azure에서 구매 확인
          const purchases = await AzureTableService.getUserPurchasedCourses(user.email);
          const courseIds = purchases.map(p => {
            if (p.courseId === 'ai-building-course') return 999;
            if (p.courseId === 'chatgpt-agent-beginner') return 1002;
            return null;
          }).filter(id => id !== null) as number[];
          setPurchasedCourses(courseIds);
        } catch (error) {
          console.error('구매 정보 확인 실패:', error);
        }
      }
    };
    checkUser();
  }, []);

  // 다음 라이브 계산
  useEffect(() => {
    const dayMap: { [key: string]: number } = {
      '월요일': 1, '화요일': 2, '수요일': 3, '목요일': 4, '금요일': 5, '토요일': 6, '일요일': 0
    };

    const now = new Date();
    const currentDay = now.getDay();
    
    // 다음 라이브 찾기
    let closestCategory: LiveCategory | null = null;
    let closestDate: Date | null = null;

    LIVE_CATEGORIES.forEach(cat => {
      const targetDay = dayMap[cat.dayOfWeek];
      if (targetDay !== undefined) {
        const daysUntil = (targetDay - currentDay + 7) % 7 || 7;
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + daysUntil);
        nextDate.setHours(20, 0, 0, 0);

        if (!closestDate || nextDate < closestDate) {
          closestCategory = cat;
          closestDate = nextDate;
        }
      }
    });

    if (closestCategory && closestDate) {
      const liveCategory = closestCategory;
      const liveDate = closestDate as Date;
      setNextLive(liveCategory);
      
      // 카운트다운 설정
      const updateCountdown = () => {
        const diff = liveDate.getTime() - Date.now();
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

  const hasAccess = (courseId: number | null) => {
    if (courseId === null) return true;
    return purchasedCourses.includes(courseId);
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.white }}>
      <NavigationBar onBack={onBack} breadcrumbText="라이브 허브" />

      {/* 헤더 */}
        <div style={{ 
        background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
        padding: '50px 20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
        {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
          top: '-80px',
          right: '-80px',
            width: '300px',
            height: '300px',
          background: `radial-gradient(circle, ${COLORS.gold}15 0%, transparent 70%)`,
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '10%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${COLORS.goldLight}10 0%, transparent 60%)`,
            borderRadius: '50%'
          }}></div>
          
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-block',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
              padding: '8px 20px',
              borderRadius: '30px',
              marginBottom: '20px',
              boxShadow: `0 4px 15px ${COLORS.gold}40`
            }}>
              <span style={{ color: COLORS.navyDark, fontWeight: '800', fontSize: '0.9rem' }}>
                📺 LIVE SCHEDULE
              </span>
            </div>
            <h1 style={{ color: COLORS.white, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginBottom: '15px' }}>
              AI City Builders 라이브
            </h1>
            <p style={{ color: COLORS.goldLight, fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              매주 6회 라이브로 AI 최신 트렌드와 실전 노하우를 전달합니다
            </p>
          </div>

          {/* 다음 라이브 카운트다운 */}
          {nextLive && (
            <div style={{
              background: `linear-gradient(135deg, ${nextLive.isFree ? COLORS.youtube : COLORS.navyLight}90, ${COLORS.navyDark}90)`,
              borderRadius: '20px',
              padding: '30px',
              border: `2px solid ${nextLive.color}50`,
              boxShadow: `0 10px 30px rgba(0,0,0,0.3)`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '8px' }}>다음 라이브</p>
                  <h3 style={{ color: COLORS.white, fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {nextLive.icon} {nextLive.name}: {nextLive.title}
                  </h3>
                  <p style={{ color: COLORS.goldLight, marginTop: '5px' }}>{nextLive.dayOfWeek} {nextLive.time}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { value: countdown.days, label: '일' },
                    { value: countdown.hours, label: '시' },
                    { value: countdown.minutes, label: '분' },
                    { value: countdown.seconds, label: '초' }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      background: COLORS.navyDark,
                      borderRadius: '12px',
                      padding: '12px 18px',
                      textAlign: 'center',
                      minWidth: '65px',
                      border: `1px solid ${COLORS.gold}30`
                    }}>
                      <div style={{ color: COLORS.goldLight, fontSize: '1.8rem', fontWeight: '800' }}>
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>{item.label}</div>
                    </div>
              ))}
            </div>
          </div>
        </div>
          )}
        </div>
      </div>

      {/* 라이브 그리드 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 20px' }}>
        
        {/* 주간 스케줄 개요 */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ color: COLORS.navy, fontSize: '1.5rem', fontWeight: '800', marginBottom: '25px', textAlign: 'center' }}>
            📅 주간 라이브 스케줄 (주 6회)
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '20px'
          }}>
            {['월', '화', '수', '목', '금'].map((day, idx) => {
              const dayInfo = [
                { day: '월', type: 'free', icon: '🆓', color: COLORS.youtube },
                { day: '화', type: 'step1', icon: '🏗️', color: COLORS.navy },
                { day: '수', type: 'step2', icon: '🤖', color: COLORS.gold },
                { day: '목', type: 'step3', icon: '🚀', color: '#10b981' },
                { day: '금', type: 'step4', icon: '🎸', color: '#8b5cf6' }
              ][idx];

              return (
                <div key={day} style={{
                  background: COLORS.white,
                  border: `2px solid ${dayInfo.color}`,
                  borderRadius: '15px',
                  padding: '15px 20px',
                  textAlign: 'center',
                  minWidth: '100px',
                  boxShadow: `0 4px 15px ${dayInfo.color}20`
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{dayInfo.icon}</div>
                  <div style={{ color: dayInfo.color, fontWeight: '800', fontSize: '0.9rem' }}>{day}</div>
                  <div style={{ color: COLORS.grayMedium, fontSize: '0.75rem', marginTop: '2px' }}>8PM</div>
                </div>
              );
            })}
          </div>
          
          <p style={{ textAlign: 'center', color: COLORS.grayMedium, fontSize: '0.95rem' }}>
            연간 총 <strong style={{ color: COLORS.gold }}>260회</strong> 라이브 (각 Step 52회 × 4 + 무료 52회)
          </p>
        </div>

        {/* 라이브 카드들 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          {LIVE_CATEGORIES.map((category) => {
            const canAccess = hasAccess(category.courseId);
            
            return (
              <div
                key={category.id}
                onClick={() => navigate(category.link)}
                style={{
                  background: COLORS.white,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: `2px solid ${category.color}30`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 8px 25px ${COLORS.navy}10`
                }}
              >
                {/* 헤더 */}
                <div style={{
                  background: category.isFree 
                    ? `linear-gradient(135deg, ${COLORS.youtube}, #cc0000)`
                    : `linear-gradient(135deg, ${category.color}, ${COLORS.navyDark})`,
                  padding: '25px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        width: '55px',
                        height: '55px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem'
                      }}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 style={{ color: COLORS.white, fontSize: '1.3rem', fontWeight: '800' }}>
                          {category.name}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                          {category.title}
                        </p>
                      </div>
                    </div>
                    
                    {/* 접근 상태 배지 */}
                    {category.isFree ? (
                      <div style={{
                        background: COLORS.white,
                        color: COLORS.youtube,
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Youtube size={16} /> FREE
                      </div>
                    ) : canAccess ? (
                      <div style={{
                        background: COLORS.green,
                        color: COLORS.white,
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '700'
                      }}>
                        ✓ 입장 가능
                      </div>
                    ) : (
                      <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        color: COLORS.white,
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Lock size={14} /> 구매 필요
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 본문 */}
                <div style={{ padding: '25px' }}>
                  <p style={{ color: COLORS.grayMedium, fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>
                    {category.description}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.navy }}>
                      <Calendar size={18} />
                      <span style={{ fontWeight: '600' }}>{category.dayOfWeek}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.navy }}>
                      <Clock size={18} />
                      <span style={{ fontWeight: '600' }}>{category.time}</span>
                    </div>
                  </div>
                  
                  {/* 가성비 정보 */}
                  {!category.isFree && (
                    <div style={{
                      background: `${category.color}10`,
                      borderRadius: '12px',
                      padding: '15px',
                      marginBottom: '20px',
                      display: 'flex',
                      justifyContent: 'space-around',
                      textAlign: 'center'
                    }}>
                      <div>
                        <div style={{ color: category.color, fontSize: '1.3rem', fontWeight: '800' }}>
                          {category.price ? `₩${Math.round(category.price / 52).toLocaleString()}` : '미정'}
                        </div>
                        <div style={{ color: COLORS.grayMedium, fontSize: '0.8rem' }}>1회당</div>
                      </div>
                      <div style={{ width: '1px', background: `${category.color}30` }}></div>
                      <div>
                        <div style={{ color: category.color, fontSize: '1.3rem', fontWeight: '800' }}>52회</div>
                        <div style={{ color: COLORS.grayMedium, fontSize: '0.8rem' }}>연간</div>
                      </div>
                      <div style={{ width: '1px', background: `${category.color}30` }}></div>
                      <div>
                        <div style={{ color: category.color, fontSize: '1.3rem', fontWeight: '800' }}>∞</div>
                        <div style={{ color: COLORS.grayMedium, fontSize: '0.8rem' }}>아카이브</div>
                      </div>
                    </div>
                  )}
                  
                  {/* 버튼 */}
                  <button style={{
                    width: '100%',
                    padding: '14px',
                    background: category.isFree 
                      ? COLORS.youtube 
                      : canAccess 
                        ? `linear-gradient(135deg, ${category.color}, ${COLORS.navyDark})`
                        : `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                    color: COLORS.white,
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                  fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: `0 4px 15px ${category.color}30`
                  }}>
                    {category.isFree ? (
                      <>
                        <Youtube size={20} />
                        무료 라이브 보기
                      </>
                    ) : canAccess ? (
                      <>
                        <Tv size={20} />
                        라이브 & 아카이브 입장
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        {category.price ? `₩${category.price.toLocaleString()} 구매하기` : '준비중'}
                      </>
                    )}
                    <ChevronRight size={18} />
              </button>
            </div>
          </div>
            );
          })}
        </div>

        {/* 혜택 안내 */}
        <div style={{
          marginTop: '60px',
          background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
          borderRadius: '25px',
          padding: '50px 40px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: COLORS.goldLight, fontSize: '1.6rem', fontWeight: '800', marginBottom: '15px' }}>
            🎁 프리미엄 라이브 혜택
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '40px' }}>
            각 Step 구매 시 1년간 전용 라이브 + 전체 아카이브 무제한 이용
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '25px'
          }}>
            {[
              { icon: '🔴', title: '매주 라이브', desc: '각 Step 주 1회\n총 연 52회', value: '52회/년' },
              { icon: '📁', title: '전체 아카이브', desc: '지난 라이브\n무제한 시청', value: '∞' },
              { icon: '💬', title: 'Q&A 참여', desc: '라이브 중\n질문 & 피드백', value: '실시간' },
              { icon: '🔄', title: '최신 업데이트', desc: 'AI 최신 트렌드\n즉시 반영', value: '매주' }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '18px',
                padding: '30px 20px',
                border: `1px solid ${COLORS.gold}30`
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{item.icon}</div>
                <h4 style={{ color: COLORS.goldLight, fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>
                  {item.title}
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                  {item.desc}
                </p>
                <div style={{
                  marginTop: '15px',
                  background: COLORS.gold,
                  color: COLORS.navyDark,
                  padding: '6px 15px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  fontSize: '0.9rem',
                  fontWeight: '800'
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default LiveHubPage;
