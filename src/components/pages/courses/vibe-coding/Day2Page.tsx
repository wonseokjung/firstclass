import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, Lightbulb, Target, TrendingUp } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day2PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day2Page: React.FC<Day2PageProps> = ({ onBack, onNext }) => {
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
          const progress = await AzureTableService.getCourseDayProgress(parsed.email, 'vibe-coding');
          if (progress && progress.completedDays.includes(2)) setIsDayCompleted(true);
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
      const success = await AzureTableService.completeCourseDay(userEmail, 'vibe-coding', 2, 55);
      if (success) { setIsDayCompleted(true); alert('🎉 Day 2 완료!'); }
      else alert('❌ Day 완료 처리에 실패했습니다.');
    } catch (error) {
      console.error('❌ Day 완료 처리 오류:', error);
      alert('오류가 발생했습니다.');
    } finally { setIsCompletingDay(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0a1e 0%, #1a1033 50%, #ffffff 100%)' }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))',
        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#c4b5fd', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '15px' }}>
            <ArrowLeft size={20} /> 강의 목록으로
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', width: '65px', height: '65px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)' }}>💡</div>
            <div>
              <h1 style={{ color: '#0d1b2a', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', margin: 0, fontWeight: '700' }}>Day 2: 아이디어를 돈이 되는 앱으로</h1>
              <p style={{ color: '#a78bfa', margin: '5px 0 0 0' }}>아이디어 검증부터 MVP 설계까지</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}><Clock size={16} /> 55분</span>
                {isDayCompleted && <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}><CheckCircle size={16} /> 완료됨</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 5vw, 40px) 20px' }}>
        
        {/* MVP란? */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <h2 style={{ color: '#a78bfa', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Lightbulb size={28} /> MVP (Minimum Viable Product)
          </h2>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '25px', marginBottom: '20px' }}>
            <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.9', margin: 0 }}>
              <strong style={{ color: '#22c55e' }}>최소 기능 제품</strong> - 핵심 기능만 있는 가장 작은 버전의 제품으로 시장 반응을 빠르게 테스트!
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ color: '#ef4444', fontWeight: '700', marginBottom: '8px' }}>❌ 나쁜 접근</div>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>6개월 개발 → 출시 → 아무도 안 씀</p>
            </div>
            <div style={{ background: 'rgba(34, 197, 94, 0.2)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <div style={{ color: '#22c55e', fontWeight: '700', marginBottom: '8px' }}>✅ 좋은 접근</div>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>1주일 개발 → 테스트 → 피드백 → 개선</p>
            </div>
          </div>
        </div>

        {/* 아이디어 검증 */}
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: '#06b6d4', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Target size={28} /> 아이디어 검증 체크리스트
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {['이 문제를 겪는 사람이 충분한가?', '사람들이 돈을 내고 해결하고 싶어하는가?', '경쟁 제품보다 10배 나은 점이 있는가?', '나 혼자서 1주일 안에 MVP를 만들 수 있는가?'].map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px', padding: '15px 20px', border: '1px solid rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d1b2a', fontWeight: '700', fontSize: '0.9rem' }}>{idx + 1}</div>
                <span style={{ color: '#e2e8f0', fontSize: '1rem' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 성공 사례 */}
        <div style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.1))', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          <h2 style={{ color: '#22c55e', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrendingUp size={28} /> MVP로 성공한 서비스들
          </h2>
          <div style={{ color: '#e2e8f0', lineHeight: '2' }}>
            <p><strong style={{ color: '#ffd60a' }}>Dropbox</strong> - 영상 하나로 10만 대기자 확보</p>
            <p><strong style={{ color: '#ffd60a' }}>Zapier</strong> - 엑셀 시트 하나로 시작</p>
            <p><strong style={{ color: '#ffd60a' }}>Buffer</strong> - 랜딩 페이지 하나로 검증</p>
          </div>
        </div>

        {/* Day 2 토론방 */}
        <DayDiscussion courseId="vibe-coding-day2" dayNumber={2} communityPath="/community/step3" accentColor="#8b5cf6" userEmail={userEmail} userName={userName} />

        {/* 완료 버튼 */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleCompleteDay} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#0d1b2a', border: 'none', padding: '18px 45px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: isDayCompleted ? '0 8px 25px rgba(34, 197, 94, 0.4)' : '0 8px 25px rgba(139, 92, 246, 0.4)' }}>
            {isDayCompleted ? <><CheckCircle size={24} /> Day 2 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> Day 2 완료하기</>}
          </button>
          {onNext && <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #1e3a5f, #0d1b2a)', color: '#0d1b2a', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '18px 45px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '700', cursor: 'pointer' }}>Day 3로 이동 →</button>}
        </div>
      </div>
    </div>
  );
};

export default Day2Page;

