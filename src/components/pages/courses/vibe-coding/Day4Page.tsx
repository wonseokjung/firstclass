import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, Palette } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day4PageProps { onBack: () => void; onNext?: () => void; }

const Day4Page: React.FC<Day4PageProps> = ({ onBack, onNext }) => {
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
        if (progress?.completedDays.includes(4)) setIsDayCompleted(true);
      }
    };
    load();
  }, []);

  const handleComplete = async () => {
    if (!userEmail) { alert('로그인이 필요합니다.'); return; }
    if (isDayCompleted) { alert('이미 완료한 강의입니다!'); return; }
    setIsCompletingDay(true);
    const success = await AzureTableService.completeCourseDay(userEmail, 'vibe-coding', 4, 50);
    if (success) { setIsDayCompleted(true); alert('🎉 Day 4 완료!'); }
    setIsCompletingDay(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0a1e 0%, #1a1033 50%, #0f172a 100%)' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))', borderBottom: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#c4b5fd', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '15px' }}><ArrowLeft size={20} /> 강의 목록으로</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', width: '65px', height: '65px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🎨</div>
            <div>
              <h1 style={{ color: 'white', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', margin: 0 }}>Day 4: Figma MCP 연동</h1>
              <p style={{ color: '#a78bfa', margin: '5px 0 0 0' }}>디자인을 코드로 바로 변환하기</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} /> 50분</span>
                {isDayCompleted && <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={16} /> 완료됨</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 5vw, 40px) 20px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(219, 39, 119, 0.1))', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
          <h2 style={{ color: '#f472b6', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}><Palette size={28} /> MCP란?</h2>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '25px', marginBottom: '20px' }}>
            <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.9', margin: 0 }}>
              <strong style={{ color: '#f472b6' }}>Model Context Protocol</strong> - Figma 디자인을 AI가 이해하고 바로 코드로 변환하는 혁신적인 워크플로우!
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', borderRadius: '12px', padding: '20px' }}><div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎨</div><div style={{ color: 'white', fontWeight: '600' }}>Figma 디자인</div></div>
            <div style={{ background: 'rgba(6, 182, 212, 0.2)', borderRadius: '12px', padding: '20px' }}><div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚡</div><div style={{ color: 'white', fontWeight: '600' }}>MCP 변환</div></div>
            <div style={{ background: 'rgba(34, 197, 94, 0.2)', borderRadius: '12px', padding: '20px' }}><div style={{ fontSize: '2rem', marginBottom: '10px' }}>💻</div><div style={{ color: 'white', fontWeight: '600' }}>완성 코드</div></div>
          </div>
        </div>

        <DayDiscussion courseId="vibe-coding-day4" dayNumber={4} communityPath="/community/step3" accentColor="#8b5cf6" userEmail={userEmail} userName={userName} />

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleComplete} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white', border: 'none', padding: '18px 45px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isDayCompleted ? <><CheckCircle size={24} /> Day 4 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> Day 4 완료하기</>}
          </button>
          {onNext && <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: 'white', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '18px 45px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '700', cursor: 'pointer' }}>Day 5로 이동 →</button>}
        </div>
      </div>
    </div>
  );
};

export default Day4Page;






