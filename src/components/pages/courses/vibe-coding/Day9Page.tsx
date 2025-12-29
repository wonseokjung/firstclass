import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, Wrench, RefreshCw } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day9PageProps { onBack: () => void; onNext?: () => void; }

const Day9Page: React.FC<Day9PageProps> = ({ onBack, onNext }) => {
  const [isDayCompleted, setIsDayCompleted] = useState(false);
  const [isCompletingDay, setIsCompletingDay] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const load = async () => {
      const userInfo = sessionStorage.getItem('aicitybuilders_user_session');
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        setUserEmail(parsed.email);
        setUserName(parsed.name || parsed.email?.split('@')[0] || '익명');
        const progress = await AzureTableService.getCourseDayProgress(parsed.email, 'vibe-coding');
        if (progress?.completedDays.includes(9)) setIsDayCompleted(true);
      }
    };
    load();
  }, []);

  const handleComplete = async () => {
    if (!userEmail) { alert('로그인이 필요합니다.'); return; }
    if (isDayCompleted) { alert('이미 완료한 강의입니다!'); return; }
    setIsCompletingDay(true);
    const success = await AzureTableService.completeCourseDay(userEmail, 'vibe-coding', 9, 45);
    if (success) { setIsDayCompleted(true); alert('🎉 Day 9 완료!'); }
    setIsCompletingDay(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0a1e 0%, #1a1033 50%, #ffffff 100%)' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))', borderBottom: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#c4b5fd', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '15px' }}><ArrowLeft size={20} /> 강의 목록으로</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', width: '65px', height: '65px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🔧</div>
            <div>
              <h1 style={{ color: '#0d1b2a', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', margin: 0 }}>Day 9: 유지보수와 확장</h1>
              <p style={{ color: '#a78bfa', margin: '5px 0 0 0' }}>사용자 피드백을 코드로 바로 반영</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} /> 45분</span>
                {isDayCompleted && <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={16} /> 완료됨</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 5vw, 40px) 20px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <h2 style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}><RefreshCw size={28} /> 지속 가능한 개발</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
              <div style={{ color: '#0d1b2a', fontWeight: '700' }}>피드백 수집</div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '8px 0 0 0' }}>Intercom, Crisp</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🐛</div>
              <div style={{ color: '#0d1b2a', fontWeight: '700' }}>버그 추적</div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '8px 0 0 0' }}>Sentry, LogRocket</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📈</div>
              <div style={{ color: '#0d1b2a', fontWeight: '700' }}>분석</div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '8px 0 0 0' }}>Posthog, Mixpanel</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}><Wrench size={28} /> Google Antigravity로 빠른 수정</h2>
          <div style={{ background: '#0d1b2a', borderRadius: '12px', padding: '20px', fontFamily: 'monospace', color: '#22c55e', fontSize: '0.95rem', lineHeight: '1.8' }}>
            "사용자가 [문제점]을 겪고 있어.<br/>이 문제를 해결하려면:<br/>1. 현재 코드 분석<br/>2. 수정 방안 제시<br/>3. 테스트 코드 작성"
          </div>
        </div>

        <DayDiscussion courseId="vibe-coding-day9" dayNumber={9} communityPath="/community/step3" accentColor="#8b5cf6" userEmail={userEmail} userName={userName} />

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleComplete} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#0d1b2a', border: 'none', padding: '18px 45px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isDayCompleted ? <><CheckCircle size={24} /> Day 9 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> Day 9 완료하기</>}
          </button>
          {onNext && <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #1e3a5f, #0d1b2a)', color: '#0d1b2a', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '18px 45px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '700', cursor: 'pointer' }}>Day 10으로 이동 →</button>}
        </div>
      </div>
    </div>
  );
};

export default Day9Page;

