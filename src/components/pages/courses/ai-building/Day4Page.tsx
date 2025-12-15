import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day4PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day4Page: React.FC<Day4PageProps> = ({ onBack, onNext }) => {
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

          if (progress && progress.completedDays.includes(4)) {
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
      const learningTimeMinutes = 60;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        4,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 4 완료! 다음 강의로 이동하세요!');
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
    day: 4,
    title: "몇 층짜리 디지털 건물을 세울 것인가?",
    duration: "약 60분",
    description: "대중형/니치형/혼합형 전략. AI로 시장 분석 & 건물 콘셉트 설계",
    objectives: [
      "대중형 vs 니치형 채널의 차이 이해하기",
      "나에게 맞는 채널 전략 선택하기",
      "AI로 경쟁 채널 분석하기"
    ],
    sections: [
      {
        id: 'building-types',
        title: '🏢 디지털 건물의 3가지 유형',
        content: `
          <div style="display: grid; gap: 20px; margin: 20px 0;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 25px; border-radius: 15px; color: white;">
              <h4 style="margin-bottom: 10px;">🏬 대중형 (고층 빌딩)</h4>
              <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>넓은 대중을 타겟</li>
                <li>조회수는 많지만 CPM은 낮음</li>
                <li>예: 일반 브이로그, 먹방, 밈</li>
              </ul>
            </div>
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 25px; border-radius: 15px; color: white;">
              <h4 style="margin-bottom: 10px;">🏠 니치형 (부티크 호텔)</h4>
              <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>특정 관심사 타겟</li>
                <li>조회수는 적지만 CPM은 높음</li>
                <li>예: 전문 투자, 의료 정보, B2B</li>
              </ul>
            </div>
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 25px; border-radius: 15px; color: white;">
              <h4 style="margin-bottom: 10px;">🏨 혼합형 (복합 상가)</h4>
              <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>대중형 + 니치형 조합</li>
                <li>대중형으로 유입, 니치로 수익화</li>
                <li>예: 테크 리뷰 + 전문 컨설팅</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        id: 'strategy-choice',
        title: '🎯 나에게 맞는 전략은?',
        content: `
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #1e3a5f; color: white;">
              <th style="padding: 15px; text-align: left;">질문</th>
              <th style="padding: 15px; text-align: center;">대중형</th>
              <th style="padding: 15px; text-align: center;">니치형</th>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 15px;">콘텐츠 제작 속도</td>
              <td style="padding: 15px; text-align: center;">빠르게 많이</td>
              <td style="padding: 15px; text-align: center;">천천히 깊게</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 15px;">전문 지식 필요</td>
              <td style="padding: 15px; text-align: center;">낮음</td>
              <td style="padding: 15px; text-align: center;">높음</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 15px;">수익화까지 시간</td>
              <td style="padding: 15px; text-align: center;">길다</td>
              <td style="padding: 15px; text-align: center;">짧다</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 15px;">경쟁 강도</td>
              <td style="padding: 15px; text-align: center;">매우 높음</td>
              <td style="padding: 15px; text-align: center;">낮음~중간</td>
            </tr>
          </table>
        `
      },
      {
        id: 'market-analysis',
        title: '📊 실습: AI로 시장 분석하기',
        content: `
          <div style="background: #f8fafc; padding: 25px; border-radius: 15px; border: 2px solid #e2e8f0;">
            <h4 style="color: #1e3a5f; margin-bottom: 15px;">경쟁 채널 분석 프롬프트</h4>
            <div style="background: #1e293b; color: #22c55e; padding: 20px; border-radius: 10px; font-family: monospace; font-size: 0.95rem; line-height: 1.8;">
              "[주제] 관련 유튜브 채널 시장을 분석해주세요:<br/><br/>
              1. 상위 5개 채널의 특징<br/>
              2. 빈틈(언더서비드 니치) 분석<br/>
              3. 신규 진입자에게 추천하는 차별화 전략<br/>
              4. 예상 성장 가능성 점수 (1-10)"
            </div>
          </div>
        `
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginBottom: '15px' }}>
            <ArrowLeft size={20} /> 강의 목록으로
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>4</div>
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
            {isDayCompleted ? <><CheckCircle size={24} /> Day 4 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> Day 4 완료하기</>}
          </button>
          {onNext && <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' }}>Day 5로 이동 →</button>}
        </div>
      </div>
    </div>
  );
};

export default Day4Page;


