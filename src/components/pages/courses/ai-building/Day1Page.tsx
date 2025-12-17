import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen, Building2, TrendingUp, Zap, Target } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day1PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const BRAND_NAVY = '#0b1220';
const BRAND_GOLD = '#facc15';

const Day1Page: React.FC<Day1PageProps> = ({ onBack, onNext }) => {
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const userInfo = sessionStorage.getItem('aicitybuilders_user_session');
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          setUserEmail(parsed.email);

          const progress = await AzureTableService.getCourseDayProgress(
            parsed.email,
            'ai-building-course'
          );

          if (progress && progress.completedDays.includes(1)) {
            setIsDayCompleted(true);
          }
        }
      } catch (error) {
        console.error('❌ 진행 상황 로드 실패:', error);
      }
    };

    loadUserProgress();
  }, []);

  const handleCompleteDay = async () => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (isDayCompleted) {
      alert('이미 완료한 강의입니다!');
      return;
    }

    try {
      setIsCompletingDay(true);
      const learningTimeMinutes = 18;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        1,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 1 완료! 다음 강의로 이동하세요!');
      } else {
        alert('❌ Day 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ Day 완료 처리 오류:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  // 핵심 포인트
  const keyPoints = [
    {
      icon: <Building2 size={28} />,
      title: '1960년대 맨해튼의 교훈',
      description: '첫 건물을 담보로 두 번째 건물, 두 번째로 세 번째... 복리의 마법',
      color: '#3b82f6'
    },
    {
      icon: <Zap size={28} />,
      title: '구글이 주는 "대출"',
      description: 'Gemini, Veo 3.1, Flash... 무료 AI 도구 = 1960년대 110% 대출',
      color: '#f59e0b'
    },
    {
      icon: <TrendingUp size={28} />,
      title: '채널 = 건물',
      description: '첫 채널 성공 → 두 번째 채널 → 세 번째... 콘텐츠 부동산 제국',
      color: '#10b981'
    },
    {
      icon: <Target size={28} />,
      title: 'AI 에이전트 = 직원',
      description: '사람 대신 AI 에이전트로 자동화, 시스템화, 확장',
      color: '#8b5cf6'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* 헤더 */}
      <div style={{
        background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, #1e3a5f 100%)`,
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `3px solid ${BRAND_GOLD}`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            <ArrowLeft size={20} />
            강의 목록으로
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              background: `linear-gradient(135deg, ${BRAND_GOLD}, #f59e0b)`,
              width: '60px',
              height: '60px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: '800',
              color: BRAND_NAVY
            }}>
              1
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', margin: 0 }}>
                Day 1: 프롤로그 - 맨해튼 부자 삼촌의 교훈
              </h1>
              <div style={{ display: 'flex', gap: '15px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={16} /> 약 18분
                </span>
                {isDayCompleted && (
                  <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle size={16} /> 완료됨
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)' }}>
        
        {/* 비디오 섹션 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <div style={{
            background: BRAND_NAVY,
            padding: '15px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <PlayCircle size={20} color={BRAND_GOLD} />
            <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>
              🎬 강의 영상
            </span>
          </div>
          
          <div style={{ padding: '56.25% 0 0 0', position: 'relative', background: '#000' }}>
            <iframe 
              src="https://player.vimeo.com/video/1147003216?h=&badge=0&autopause=0&quality=auto" 
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="인공지능 건물주 되기 - Day 1"
            />
          </div>
        </div>

        {/* 강의 소개 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 30px)',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            color: BRAND_NAVY,
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            fontWeight: '700',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>📖</span> 이 강의에서 배우는 것
          </h2>
          
          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '20px',
            borderLeft: `4px solid ${BRAND_GOLD}`,
            marginBottom: '20px'
          }}>
            <p style={{
              color: '#475569',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
              lineHeight: '1.8',
              margin: 0
            }}>
              <strong style={{ color: BRAND_NAVY }}>1960년대 맨해튼</strong>에서 부동산으로 부자가 된 외삼촌의 실제 이야기를 통해,
              <strong style={{ color: BRAND_NAVY }}> 지금 AI 콘텐츠 시장</strong>에서 어떻게 같은 원리로 
              <strong style={{ color: BRAND_GOLD }}> "콘텐츠 건물주"</strong>가 될 수 있는지 알려드립니다.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="#64748b" />
            <p style={{
              color: '#64748b',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              lineHeight: '1.7',
              margin: 0
            }}>
              어디서 주워들은 이론이 아닙니다. 뉴욕 트럼프 타워에 사시는 외삼촌 밑에서 
              직접 일하며 배운 <strong>부동산 투자의 원리</strong>를, 
              지금 <strong>AI 기반 콘텐츠 비즈니스</strong>에 그대로 적용하고 있는 실전 경험담입니다.
            </p>
          </div>
        </div>

        {/* 핵심 포인트 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 30px)',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            color: BRAND_NAVY,
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            fontWeight: '700',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>💡</span> 핵심 포인트 4가지
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {keyPoints.map((point, index) => (
              <div key={index} style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                border: `2px solid ${point.color}20`,
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: `${point.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: point.color,
                  marginBottom: '15px'
                }}>
                  {point.icon}
                </div>
                <h3 style={{
                  color: BRAND_NAVY,
                  fontSize: '1rem',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}>
                  {point.title}
                </h3>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI 콘텐츠 시장 비교 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: 'clamp(25px, 5vw, 35px)',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            color: BRAND_NAVY,
            fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
            fontWeight: '700',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            🔄 1960년대 부동산 vs 2024년 AI 콘텐츠
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: '#fef3c7',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏢</div>
              <h3 style={{ color: '#92400e', fontSize: '1rem', fontWeight: '700', marginBottom: '15px' }}>
                1960년대 맨해튼
              </h3>
              <div style={{ textAlign: 'left', color: '#78350f', fontSize: '0.9rem', lineHeight: '1.8' }}>
                • 건물 = 자산<br/>
                • 은행 대출 = 레버리지<br/>
                • 월세 = 수익<br/>
                • 인테리어 = 가치 상승<br/>
                • 직원 고용 = 관리
              </div>
            </div>

            <div style={{
              background: '#dbeafe',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🤖</div>
              <h3 style={{ color: '#1e40af', fontSize: '1rem', fontWeight: '700', marginBottom: '15px' }}>
                2024년 AI 콘텐츠
              </h3>
              <div style={{ textAlign: 'left', color: '#1e3a8a', fontSize: '0.9rem', lineHeight: '1.8' }}>
                • 채널 = 자산<br/>
                • 무료 AI 도구 = 레버리지<br/>
                • 광고+서비스 = 수익<br/>
                • 콘텐츠 퀄리티 = 가치 상승<br/>
                • AI 에이전트 = 관리
              </div>
            </div>
          </div>
        </div>

        {/* 완료 버튼 */}
        <div style={{
          background: `linear-gradient(135deg, ${BRAND_GOLD} 0%, #fbbf24 100%)`,
          borderRadius: '16px',
          padding: 'clamp(25px, 5vw, 35px)',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: BRAND_NAVY,
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            fontWeight: '800',
            marginBottom: '15px'
          }}>
            {isDayCompleted ? '🎉 Day 1 완료!' : '🚀 Day 1 완료하기'}
          </h2>
          <p style={{
            color: '#1e3a5f',
            fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
            lineHeight: '1.7',
            marginBottom: '25px'
          }}>
            {isDayCompleted 
              ? '수고하셨습니다! 다음 강의로 이동하세요.' 
              : '영상을 모두 시청하셨다면 아래 버튼을 눌러주세요.'}
          </p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleCompleteDay}
              disabled={isCompletingDay || isDayCompleted}
              style={{
                background: isDayCompleted 
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                  : BRAND_NAVY,
                color: 'white',
                border: 'none',
                padding: '14px 30px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: isDayCompleted ? 'default' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isDayCompleted ? 0.8 : 1
              }}
            >
              {isDayCompleted ? (
                <>
                  <CheckCircle size={20} /> 완료됨
                </>
              ) : isCompletingDay ? (
                '처리 중...'
              ) : (
                <>
                  <PlayCircle size={20} /> Day 1 완료하기
                </>
              )}
            </button>
            
            {onNext && (
              <button
                onClick={onNext}
                style={{
                  background: 'white',
                  color: BRAND_NAVY,
                  border: `2px solid ${BRAND_NAVY}`,
                  padding: '14px 30px',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Day 2로 이동 →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Day1Page;

