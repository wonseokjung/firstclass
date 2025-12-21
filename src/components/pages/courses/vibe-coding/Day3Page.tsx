import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, Code2, Wrench } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day3PageProps { onBack: () => void; onNext?: () => void; }

const Day3Page: React.FC<Day3PageProps> = ({ onBack, onNext }) => {
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
        if (progress?.completedDays.includes(3)) setIsDayCompleted(true);
      }
    };
    load();
  }, []);

  const handleComplete = async () => {
    if (!userEmail) { alert('로그인이 필요합니다.'); return; }
    if (isDayCompleted) { alert('이미 완료한 강의입니다!'); return; }
    setIsCompletingDay(true);
    const success = await AzureTableService.completeCourseDay(userEmail, 'vibe-coding', 3, 80);
    if (success) { setIsDayCompleted(true); alert('🎉 Day 3 완료!'); }
    setIsCompletingDay(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0a1e 0%, #1a1033 50%, #0f172a 100%)' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))', borderBottom: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#c4b5fd', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '15px' }}><ArrowLeft size={20} /> 강의 목록으로</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', width: '65px', height: '65px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🛠️</div>
            <div>
              <h1 style={{ color: 'white', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', margin: 0 }}>Day 3: Google Antigravity 실전 앱 개발</h1>
              <p style={{ color: '#a78bfa', margin: '5px 0 0 0' }}>Todo부터 커머스까지 라이브 코딩</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} /> 1시간 20분</span>
                {isDayCompleted && <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={16} /> 완료됨</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 5vw, 40px) 20px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <h2 style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}><Code2 size={28} /> 실습 프로젝트</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {[{ num: 1, title: 'Todo 앱', desc: '기본 CRUD 익히기', time: '20분' }, { num: 2, title: '날씨 앱', desc: 'API 연동하기', time: '25분' }, { num: 3, title: '커머스 앱', desc: '결제 시스템 구현', time: '35분' }].map(p => (
              <div key={p.num} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.3rem' }}>{p.num}</div>
                <div style={{ flex: 1 }}><div style={{ color: 'white', fontWeight: '700' }}>{p.title}</div><div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{p.desc}</div></div>
                <div style={{ color: '#a78bfa', fontWeight: '600' }}>{p.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}><Wrench size={28} /> 핵심 프롬프트 패턴</h2>
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', fontFamily: 'monospace', color: '#22c55e', fontSize: '0.95rem', lineHeight: '1.8' }}>
            "React로 [기능] 구현해줘.<br/>- Tailwind CSS 사용<br/>- TypeScript 적용<br/>- 에러 핸들링 포함<br/>- 모바일 반응형으로"
          </div>
        </div>

        <DayDiscussion courseId="vibe-coding-day3" dayNumber={3} communityPath="/community/step3" accentColor="#8b5cf6" userEmail={userEmail} userName={userName} />

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleComplete} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white', border: 'none', padding: '18px 45px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isDayCompleted ? <><CheckCircle size={24} /> Day 3 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> Day 3 완료하기</>}
          </button>
          {onNext && <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: 'white', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '18px 45px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '700', cursor: 'pointer' }}>Day 4로 이동 →</button>}
        </div>
      </div>
    </div>
  );
};

export default Day3Page;

