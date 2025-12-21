import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day9PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day9Page: React.FC<Day9PageProps> = ({ onBack, onNext }) => {
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const userInfo = sessionStorage.getItem('aicitybuilders_user_session');
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          setUserEmail(parsed.email);
          setUserName(parsed.name || parsed.email?.split('@')[0] || '익명');
          const progress = await AzureTableService.getCourseDayProgress(parsed.email, 'ai-building-course');
          if (progress && progress.completedDays.includes(9)) setIsDayCompleted(true);
        }
      } catch (error) {
        console.error('❌ 진행 상황 로드 실패:', error);
      }
    };
    loadUserProgress();
  }, []);

  const handleCompleteDay = async () => {
    if (!userEmail) { alert('로그인이 필요합니다.'); return; }
    if (isDayCompleted) { alert('이미 완료한 강의입니다!'); return; }

    try {
      setIsCompletingDay(true);
      const success = await AzureTableService.completeCourseDay(userEmail, 'ai-building-course', 9, 60);
      if (success) { setIsDayCompleted(true); alert('🎉 Day 9 완료!'); }
      else alert('❌ Day 완료 처리에 실패했습니다.');
    } catch (error) {
      console.error('❌ Day 완료 처리 오류:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 9,
    title: "[준공식] 콘텐츠 업로드 & 데이터 분석",
    duration: "약 60분",
    description: "핵심 지표 읽는 법 | AI 감성 분석으로 건물 리모델링",
    objectives: [
      "YouTube Analytics 핵심 지표 이해하기",
      "AI로 댓글 감성 분석하기",
      "데이터 기반 콘텐츠 개선 전략 수립하기"
    ],
    sections: [
      {
        id: 'key-metrics',
        title: '📊 핵심 지표 (KPI)',
        content: `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">👁️</div>
              <strong>조회수</strong>
              <p style="font-size: 0.85rem; opacity: 0.9; margin-top: 5px;">도달 범위 측정</p>
            </div>
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">⏱️</div>
              <strong>시청 지속 시간</strong>
              <p style="font-size: 0.85rem; opacity: 0.9; margin-top: 5px;">콘텐츠 품질 측정</p>
            </div>
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">📈</div>
              <strong>CTR (클릭률)</strong>
              <p style="font-size: 0.85rem; opacity: 0.9; margin-top: 5px;">썸네일/제목 효과</p>
            </div>
            <div style="background: linear-gradient(135deg, #ec4899, #db2777); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🔔</div>
              <strong>구독 전환율</strong>
              <p style="font-size: 0.85rem; opacity: 0.9; margin-top: 5px;">팬 확보 효율</p>
            </div>
          </div>
        `
      },
      {
        id: 'retention-analysis',
        title: '📉 시청자 유지율 분석',
        content: `
          <div style="background: linear-gradient(135deg, #0f172a, #1e3a5f); padding: 25px; border-radius: 15px; color: white;">
            <h4 style="color: #fbbf24; margin-bottom: 15px;">이탈 구간 = 리모델링 포인트</h4>
            <div style="display: grid; gap: 10px;">
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #ef4444;">0-30초 이탈:</strong> 인트로가 너무 길거나 지루함
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #f59e0b;">중간 이탈:</strong> 내용이 기대와 다름
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #22c55e;">끝까지 시청:</strong> 성공! 다음 영상으로 유도 필요
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'ai-sentiment',
        title: '🤖 AI 감성 분석 실습',
        content: `
          <div style="background: #f8fafc; padding: 25px; border-radius: 15px; border: 2px solid #e2e8f0;">
            <h4 style="color: #1e3a5f; margin-bottom: 15px;">댓글 분석 프롬프트</h4>
            <div style="background: #1e293b; color: #22c55e; padding: 20px; border-radius: 10px; font-family: monospace; font-size: 0.95rem; line-height: 1.8;">
              "다음 YouTube 댓글들을 분석해주세요:<br/><br/>
              [댓글 목록 붙여넣기]<br/><br/>
              분석해줄 내용:<br/>
              1. 긍정/부정/중립 비율<br/>
              2. 가장 많이 언급된 키워드<br/>
              3. 시청자가 원하는 콘텐츠<br/>
              4. 개선해야 할 점"
            </div>
          </div>
        `
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginBottom: '15px' }}><ArrowLeft size={20} /> 강의 목록으로</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>9</div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>Day {lessonData.day}: {lessonData.title}</h1>
              <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} /> {lessonData.duration}</span>
                {isDayCompleted && <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={16} /> 완료됨</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e3a5f', marginBottom: '20px' }}><BookOpen size={24} /> 학습 목표</h2>
          <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>{lessonData.objectives.map((obj, idx) => <li key={idx} style={{ color: '#64748b' }}>{obj}</li>)}</ul>
        </div>

        {lessonData.sections.map((section) => (
          <div key={section.id} style={{ background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '20px' }}>{section.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        ))}

        {/* Day 9 토론방 */}
        <DayDiscussion
          courseId="ai-building-day9"
          dayNumber={9}
          communityPath="/community/step1"
          accentColor="#22c55e"
          userEmail={userEmail}
          userName={userName}
        />

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={handleCompleteDay} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isDayCompleted ? <><CheckCircle size={24} /> Day 9 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> Day 9 완료하기</>}
          </button>
          {onNext && <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' }}>Day 10으로 이동 →</button>}
        </div>
      </div>
    </div>
  );
};

export default Day9Page;






