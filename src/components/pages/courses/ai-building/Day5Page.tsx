import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day5PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day5Page: React.FC<Day5PageProps> = ({ onBack, onNext }) => {
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

          if (progress && progress.completedDays.includes(5)) {
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
      const learningTimeMinutes = 40;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        5,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 5 완료! Part 1 완료! Day 6으로 이동하세요!');
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
    day: 5,
    title: "최종 입지 선정 & 건물 계획서 작성",
    duration: "약 40분",
    description: "AI CITY BUILDER에 건물 계획서 넣기. 나의 첫 디지털 건물 사업계획서 완성",
    objectives: [
      "지금까지 배운 내용을 종합하기",
      "나만의 디지털 건물 사업계획서 작성하기",
      "실행 가능한 첫 번째 액션 플랜 수립하기"
    ],
    sections: [
      {
        id: 'summary',
        title: '📋 Part 1 총정리',
        content: `
          <div style="display: grid; gap: 15px; margin: 20px 0;">
            <div style="background: #f0f9ff; padding: 20px; border-radius: 15px; border-left: 4px solid #0ea5e9;">
              <strong>Day 1:</strong> 맨해튼 부자 삼촌의 교훈 → 입지가 중요하다
            </div>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 15px; border-left: 4px solid #0ea5e9;">
              <strong>Day 2:</strong> 경제적 자유 = 패시브 인컴 시스템 구축
            </div>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 15px; border-left: 4px solid #0ea5e9;">
              <strong>Day 3:</strong> 세입자(타겟 고객) 선정이 수익을 결정한다
            </div>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 15px; border-left: 4px solid #0ea5e9;">
              <strong>Day 4:</strong> 대중형/니치형/혼합형 전략 선택
            </div>
          </div>
        `
      },
      {
        id: 'business-plan',
        title: '📝 디지털 건물 사업계획서',
        content: `
          <div style="background: linear-gradient(135deg, #0f172a, #1e3a5f); padding: 30px; border-radius: 15px; color: white;">
            <h4 style="color: #fbbf24; margin-bottom: 20px;">🏗️ 나의 디지털 건물 계획서</h4>
            <div style="display: grid; gap: 15px;">
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #fbbf24;">1. 건물명:</strong><br/>
                <span style="color: #94a3b8;">[채널/블로그 이름]</span>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #fbbf24;">2. 건물 유형:</strong><br/>
                <span style="color: #94a3b8;">대중형 / 니치형 / 혼합형</span>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #fbbf24;">3. 타겟 세입자:</strong><br/>
                <span style="color: #94a3b8;">[연령/국가/관심사]</span>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #fbbf24;">4. 수익 모델:</strong><br/>
                <span style="color: #94a3b8;">광고/제휴/멤버십/제품</span>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #fbbf24;">5. 첫 번째 액션:</strong><br/>
                <span style="color: #94a3b8;">[오늘 바로 할 일]</span>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'ai-city-builder',
        title: '🔧 실습: AI City Builder에 계획서 입력',
        content: `
          <div style="background: #fef3c7; padding: 25px; border-radius: 15px; border: 2px solid #fbbf24;">
            <h4 style="color: #92400e; margin-bottom: 15px;">🎯 다음 단계</h4>
            <p style="color: #92400e; line-height: 1.8;">
              1. <a href="/construction" style="color: #0ea5e9; font-weight: 700;">AI 도시 공사장</a>으로 이동<br/>
              2. 위 계획서 내용을 입력<br/>
              3. AI가 분석한 채널 전략 받기<br/>
              4. Day 6부터 실제 콘텐츠 제작 시작!
            </p>
          </div>
          <div style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 15px; color: white; text-align: center;">
            <h4 style="margin-bottom: 10px;">🎉 Part 1 완료!</h4>
            <p style="margin: 0;">축하합니다! 이제 Day 6부터 실제 건축 자재(AI 도구)를 배웁니다!</p>
          </div>
        `
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginBottom: '15px' }}>
            <ArrowLeft size={20} /> 강의 목록으로
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>5</div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>Day {lessonData.day}: {lessonData.title}</h1>
              <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} /> {lessonData.duration}</span>
                {isDayCompleted && <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={16} /> 완료됨</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e3a5f', marginBottom: '20px' }}><BookOpen size={24} /> 학습 목표</h2>
          <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
            {lessonData.objectives.map((obj, idx) => <li key={idx} style={{ color: '#64748b' }}>{obj}</li>)}
          </ul>
        </div>

        {lessonData.sections.map((section) => (
          <div key={section.id} style={{ background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '20px' }}>{section.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        ))}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={handleCompleteDay} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isDayCompleted ? <><CheckCircle size={24} /> Day 5 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> Day 5 완료하기</>}
          </button>
          {onNext && <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' }}>Part 2 시작 →</button>}
        </div>
      </div>
    </div>
  );
};

export default Day5Page;

