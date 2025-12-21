import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, Gem, Trophy, Rocket } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day10PageProps { onBack: () => void; }

const Day10Page: React.FC<Day10PageProps> = ({ onBack }) => {
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
        if (progress?.completedDays.includes(10)) setIsDayCompleted(true);
      }
    };
    load();
  }, []);

  const handleComplete = async () => {
    if (!userEmail) { alert('로그인이 필요합니다.'); return; }
    if (isDayCompleted) { alert('이미 완료한 강의입니다!'); return; }
    setIsCompletingDay(true);
    const success = await AzureTableService.completeCourseDay(userEmail, 'vibe-coding', 10, 90);
    if (success) { setIsDayCompleted(true); alert('🎉🎉🎉 축하합니다! 바이브코딩 마스터 과정을 완료했습니다!'); }
    setIsCompletingDay(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0a1e 0%, #1a1033 50%, #0f172a 100%)' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))', borderBottom: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#c4b5fd', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '15px' }}><ArrowLeft size={20} /> 강의 목록으로</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', width: '65px', height: '65px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)' }}>💎</div>
            <div>
              <h1 style={{ color: 'white', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', margin: 0 }}>Day 10: 실전 프로젝트</h1>
              <p style={{ color: '#fbbf24', margin: '5px 0 0 0' }}>30분만에 수익형 앱 만들어 런칭하기</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} /> 1시간 30분</span>
                {isDayCompleted && <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={16} /> 완료됨</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 5vw, 40px) 20px' }}>
        {/* 최종 챌린지 */}
        <div style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1))', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
          <h2 style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}><Trophy size={28} /> 🔥 30분 챌린지</h2>
          <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '25px', marginBottom: '20px' }}>
            <p style={{ color: '#e2e8f0', fontSize: '1.15rem', lineHeight: '2', margin: 0, textAlign: 'center' }}>
              아이디어 기획부터 개발, 배포, 마케팅까지<br/>
              <strong style={{ color: '#fbbf24', fontSize: '1.4rem' }}>모든 과정을 30분만에 완주!</strong>
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', textAlign: 'center' }}>
            {[{ time: '5분', task: '아이디어' }, { time: '10분', task: '개발' }, { time: '5분', task: '테스트' }, { time: '5분', task: '배포' }, { time: '5분', task: '마케팅' }].map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(251, 191, 36, 0.2)', borderRadius: '12px', padding: '15px 10px' }}>
                <div style={{ color: '#fbbf24', fontWeight: '800', fontSize: '1.1rem' }}>{item.time}</div>
                <div style={{ color: '#e2e8f0', fontSize: '0.85rem', marginTop: '5px' }}>{item.task}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 실전 프로젝트 아이디어 */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <h2 style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}><Gem size={28} /> 추천 실전 프로젝트</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {[
              { title: 'AI 글쓰기 도우미', price: '$9/월', diff: '초급' },
              { title: 'PDF 요약 서비스', price: '$19/월', diff: '중급' },
              { title: '링크인바이오 빌더', price: '$5/월', diff: '초급' },
              { title: 'AI 이미지 편집기', price: '$29/월', diff: '고급' }
            ].map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ color: 'white', fontWeight: '700' }}>{item.title}</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '5px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>{item.price}</span>
                  <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '5px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>{item.diff}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 수료 축하 */}
        <div style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.1))', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(34, 197, 94, 0.3)', textAlign: 'center' }}>
          <h2 style={{ color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}><Rocket size={28} /> 바이브코딩 마스터!</h2>
          <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '2' }}>
            10일간의 여정을 완주하셨습니다! 🎉<br/>
            이제 당신도 <strong style={{ color: '#22c55e' }}>1인 개발자</strong>로서 수익화를 시작할 준비가 되었습니다.
          </p>
        </div>

        <DayDiscussion courseId="vibe-coding-day10" dayNumber={10} communityPath="/community/step3" accentColor="#8b5cf6" userEmail={userEmail} userName={userName} />

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleComplete} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: isDayCompleted ? 'white' : '#0f172a', border: 'none', padding: '18px 45px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)' }}>
            {isDayCompleted ? <><CheckCircle size={24} /> 🎓 수료 완료!</> : isCompletingDay ? '처리 중...' : <><Trophy size={24} /> 과정 완료하기</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Day10Page;

