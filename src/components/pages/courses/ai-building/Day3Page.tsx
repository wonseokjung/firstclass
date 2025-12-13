import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day3PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day3Page: React.FC<Day3PageProps> = ({ onBack, onNext }) => {
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

          if (progress && progress.completedDays.includes(3)) {
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
      const learningTimeMinutes = 55;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        3,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 3 완료! 다음 강의로 이동하세요!');
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

  const lessonData = {
    day: 3,
    title: "당신의 디지털 건물에는 어떤 사람이 거주하나?",
    duration: "약 55분",
    description: "글로벌 CPM과 수익성 분석. AI로 타겟 고객 심층 분석하기",
    objectives: [
      "CPM(1000회 노출당 비용)의 개념 이해하기",
      "국가별/언어별 수익성 차이 분석하기",
      "AI로 이상적인 타겟 고객 정의하기"
    ],
    sections: [
      {
        id: 'cpm-basics',
        title: '💵 CPM이란?',
        content: `
          <div style="background: linear-gradient(135deg, #0f172a, #1e3a5f); padding: 25px; border-radius: 15px; color: white; margin-bottom: 20px;">
            <h4 style="color: #fbbf24; margin-bottom: 10px;">CPM = Cost Per Mille</h4>
            <p style="margin: 0; font-size: 1.1rem;">광고주가 1,000회 노출당 지불하는 금액</p>
          </div>
          <p>같은 조회수라도 어떤 '세입자(시청자)'를 받느냐에 따라 수익이 완전히 달라집니다!</p>
        `
      },
      {
        id: 'global-cpm',
        title: '🌍 국가별 CPM 차이',
        content: `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 20px; border-radius: 15px; text-align: center; color: white;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🇺🇸</div>
              <div style="font-weight: 700;">미국</div>
              <div style="font-size: 1.5rem; font-weight: 800;">$15-30</div>
            </div>
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 20px; border-radius: 15px; text-align: center; color: white;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🇬🇧</div>
              <div style="font-weight: 700;">영국</div>
              <div style="font-size: 1.5rem; font-weight: 800;">$10-20</div>
            </div>
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; border-radius: 15px; text-align: center; color: white;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🇰🇷</div>
              <div style="font-weight: 700;">한국</div>
              <div style="font-size: 1.5rem; font-weight: 800;">$3-8</div>
            </div>
            <div style="background: linear-gradient(135deg, #64748b, #475569); padding: 20px; border-radius: 15px; text-align: center; color: white;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🇮🇳</div>
              <div style="font-weight: 700;">인도</div>
              <div style="font-size: 1.5rem; font-weight: 800;">$0.5-2</div>
            </div>
          </div>
          <p style="padding: 15px; background: #fef3c7; border-radius: 10px; color: #92400e;">
            💡 <strong>팁:</strong> 영어 콘텐츠로 미국/영국 시청자를 타겟하면 한국어 대비 3-5배 높은 수익!
          </p>
        `
      },
      {
        id: 'target-analysis',
        title: '🎯 실습: AI로 타겟 고객 분석',
        content: `
          <div style="background: #f8fafc; padding: 25px; border-radius: 15px; border: 2px solid #e2e8f0;">
            <h4 style="color: #1e3a5f; margin-bottom: 15px;">Google AI Studio 프롬프트</h4>
            <div style="background: #1e293b; color: #22c55e; padding: 20px; border-radius: 10px; font-family: monospace; font-size: 0.95rem; line-height: 1.8;">
              "나는 [주제] 채널을 운영하려고 합니다.<br/><br/>
              이 채널의 이상적인 타겟 고객을 분석해주세요:<br/>
              1. 연령대와 성별<br/>
              2. 주요 거주 국가<br/>
              3. 관심사와 취미<br/>
              4. 예상 CPM<br/>
              5. 추천 콘텐츠 형식"
            </div>
          </div>
        `
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
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
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              width: '60px',
              height: '60px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: '800',
              color: 'white'
            }}>
              3
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>
                Day {lessonData.day}: {lessonData.title}
              </h1>
              <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={16} /> {lessonData.duration}
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

      {/* 콘텐츠 */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 학습 목표 */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e3a5f', marginBottom: '20px' }}>
            <BookOpen size={24} /> 학습 목표
          </h2>
          <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
            {lessonData.objectives.map((obj, idx) => (
              <li key={idx} style={{ color: '#64748b' }}>{obj}</li>
            ))}
          </ul>
        </div>

        {/* 강의 섹션들 */}
        {lessonData.sections.map((section) => (
          <div key={section.id} style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '20px' }}>{section.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        ))}

        {/* 완료 버튼 */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={handleCompleteDay}
            disabled={isCompletingDay || isDayCompleted}
            style={{
              background: isDayCompleted 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '15px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: isDayCompleted ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle size={24} /> Day 3 완료!
              </>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <>
                <PlayCircle size={24} /> Day 3 완료하기
              </>
            )}
          </button>
          
          {onNext && (
            <button
              onClick={onNext}
              style={{
                background: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '15px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Day 4로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day3Page;

