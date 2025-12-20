import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen, Building2, TrendingUp, Zap, Target, Lightbulb } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day1PageProps {
  onBack: () => void;
  onNext?: () => void;
}

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
      color: '#fbbf24'
    },
    {
      icon: <Zap size={28} />,
      title: '구글이 주는 "대출"',
      description: 'Gemini, Veo 3.1, Flash... 무료 AI 도구 = 1960년대 110% 대출',
      color: '#3b82f6'
    },
    {
      icon: <TrendingUp size={28} />,
      title: '채널 = 건물',
      description: '첫 채널 성공 → 두 번째 채널 → 세 번째... 콘텐츠 부동산 제국',
      color: '#22c55e'
    },
    {
      icon: <Target size={28} />,
      title: 'AI 에이전트 = 직원',
      description: '사람 대신 AI 에이전트로 자동화, 시스템화, 확장',
      color: '#a855f7'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0f1a 0%, #1a1f2e 100%)' }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '15px',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={20} />
            강의 목록으로
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              width: '65px',
              height: '65px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '800',
              color: '#0f172a',
              boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)'
            }}>
              1
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.6rem', margin: 0, fontWeight: '700' }}>
                프롤로그: 맨해튼 부자 삼촌의 교훈
              </h1>
              <p style={{ color: '#e2e8f0', margin: '8px 0 0 0', fontSize: '1rem' }}>
                1960년대 부동산 원리를 AI 콘텐츠에 적용하기
              </p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                  <Clock size={16} /> 약 18분
                </span>
                {isDayCompleted && (
                  <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                    <CheckCircle size={16} /> 완료됨
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* 학습 목표 카드 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '40px',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: '#fbbf24', 
            marginBottom: '25px',
            fontSize: '1.4rem',
            fontWeight: '700'
          }}>
            <Target size={28} /> 오늘의 학습 목표
          </h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {[
              '1960년대 맨해튼 부동산 투자의 핵심 원리 이해하기',
              'AI 콘텐츠 시장과 부동산 시장의 유사점 파악하기',
              '콘텐츠 건물주가 되기 위한 마인드셋 형성하기',
              '무료 AI 도구를 레버리지로 활용하는 방법 이해하기'
            ].map((obj, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                color: '#e2e8f0',
                fontSize: '1.05rem'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                {obj}
              </div>
            ))}
          </div>
        </div>

        {/* 비디오 섹션 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '12px',
            padding: '20px 25px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <PlayCircle size={24} color="#fbbf24" />
            <span style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
              🎬 강의 영상
            </span>
          </div>
          
          <div style={{ padding: '25px' }}>
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden' }}>
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
        </div>

        {/* 강의 소개 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '25px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ 
            color: '#fbbf24', 
            fontSize: '1.4rem', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <BookOpen size={28} /> 이 강의에서 배우는 것
          </h3>
          
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            padding: '30px',
            borderRadius: '16px',
            marginBottom: '25px',
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.9', margin: 0 }}>
              <strong style={{ color: '#fbbf24' }}>1960년대 맨해튼</strong>에서 부동산으로 부자가 된 외삼촌의 실제 이야기를 통해,
              <strong style={{ color: '#3b82f6' }}> 지금 AI 콘텐츠 시장</strong>에서 어떻게 같은 원리로 
              <strong style={{ color: '#22c55e' }}> "콘텐츠 건물주"</strong>가 될 수 있는지 알려드립니다.
            </p>
          </div>

          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '25px',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <p style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: '1.8', margin: 0 }}>
              어디서 주워들은 이론이 아닙니다. 뉴욕 트럼프 타워에 사시는 외삼촌 밑에서 
              직접 일하며 배운 <strong style={{ color: '#fbbf24' }}>부동산 투자의 원리</strong>를, 
              지금 <strong style={{ color: '#3b82f6' }}>AI 기반 콘텐츠 비즈니스</strong>에 그대로 적용하고 있는 실전 경험담입니다.
            </p>
          </div>
        </div>

        {/* 핵심 포인트 4가지 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '25px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ 
            color: '#a855f7', 
            fontSize: '1.4rem', 
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Lightbulb size={28} /> 핵심 포인트 4가지
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {keyPoints.map((point, index) => (
              <div key={index} style={{
                background: `linear-gradient(135deg, ${point.color}15, ${point.color}08)`,
                borderRadius: '20px',
                padding: '25px',
                border: `2px solid ${point.color}40`,
                transition: 'transform 0.3s'
              }}>
                <div style={{
                  width: '55px',
                  height: '55px',
                  borderRadius: '15px',
                  background: `${point.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: point.color,
                  marginBottom: '18px'
                }}>
                  {point.icon}
                </div>
                <h4 style={{
                  color: point.color,
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  marginBottom: '10px'
                }}>
                  {point.title}
                </h4>
                <p style={{
                  color: '#e2e8f0',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 1960년대 부동산 vs 2024년 AI 콘텐츠 비교 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <h3 style={{ 
            color: 'white', 
            fontSize: '1.5rem', 
            marginBottom: '30px',
            textAlign: 'center',
            fontWeight: '700'
          }}>
            🔄 1960년대 부동산 vs 2024년 AI 콘텐츠
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1))',
              borderRadius: '20px',
              padding: '30px',
              border: '2px solid rgba(251, 191, 36, 0.3)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px', textAlign: 'center' }}>🏢</div>
              <h4 style={{ color: '#fbbf24', fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', textAlign: 'center' }}>
                1960년대 맨해튼
              </h4>
              <div style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: '2.2' }}>
                • 건물 = <strong style={{ color: '#fbbf24' }}>자산</strong><br/>
                • 은행 대출 = <strong style={{ color: '#fbbf24' }}>레버리지</strong><br/>
                • 월세 = <strong style={{ color: '#fbbf24' }}>수익</strong><br/>
                • 인테리어 = <strong style={{ color: '#fbbf24' }}>가치 상승</strong><br/>
                • 직원 고용 = <strong style={{ color: '#fbbf24' }}>관리</strong>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))',
              borderRadius: '20px',
              padding: '30px',
              border: '2px solid rgba(59, 130, 246, 0.3)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px', textAlign: 'center' }}>🤖</div>
              <h4 style={{ color: '#3b82f6', fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', textAlign: 'center' }}>
                2024년 AI 콘텐츠
              </h4>
              <div style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: '2.2' }}>
                • 채널 = <strong style={{ color: '#3b82f6' }}>자산</strong><br/>
                • 무료 AI 도구 = <strong style={{ color: '#3b82f6' }}>레버리지</strong><br/>
                • 광고+서비스 = <strong style={{ color: '#3b82f6' }}>수익</strong><br/>
                • 콘텐츠 퀄리티 = <strong style={{ color: '#3b82f6' }}>가치 상승</strong><br/>
                • AI 에이전트 = <strong style={{ color: '#3b82f6' }}>관리</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 핵심 메시지 */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '40px',
          textAlign: 'center',
          border: '1px solid rgba(251, 191, 36, 0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏗️</div>
          <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>
            AI 콘텐츠 건물주가 되세요
          </h3>
          <p style={{ color: '#e2e8f0', lineHeight: '1.9', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 20px' }}>
            1960년대 맨해튼에서 <strong style={{ color: '#fbbf24' }}>110% 대출</strong>이 가능했던 것처럼,<br/>
            지금은 <strong style={{ color: '#3b82f6' }}>무료 AI 도구</strong>로 콘텐츠 제국을 세울 수 있습니다.<br/><br/>
            <strong style={{ color: '#22c55e' }}>첫 번째 채널이 성공하면, 두 번째, 세 번째...</strong>
          </p>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
            "건물을 늘려가듯, 채널을 늘려가세요." - 맨해튼 삼촌의 교훈
          </p>
        </div>

        {/* 완료 버튼 */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleCompleteDay}
            disabled={isCompletingDay || isDayCompleted}
            style={{
              background: isDayCompleted 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: isDayCompleted ? 'white' : '#0f172a',
              border: 'none',
              padding: '18px 45px',
              borderRadius: '16px',
              fontSize: '1.15rem',
              fontWeight: '700',
              cursor: isDayCompleted ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: isDayCompleted 
                ? '0 8px 25px rgba(34, 197, 94, 0.4)'
                : '0 8px 25px rgba(251, 191, 36, 0.4)'
            }}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle size={24} /> Day 1 완료!
              </>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <>
                <PlayCircle size={24} /> Day 1 완료하기
              </>
            )}
          </button>
          
          {onNext && (
            <button
              onClick={onNext}
              style={{
                background: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '18px 45px',
                borderRadius: '16px',
                fontSize: '1.15rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              Day 2로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day1Page;
