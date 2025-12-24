import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day6PageProps { onBack: () => void; onNext?: () => void; }

const Day6Page: React.FC<Day6PageProps> = ({ onBack, onNext }) => {
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
        if (progress?.completedDays.includes(6)) setIsDayCompleted(true);
      }
    };
    load();
  }, []);

  const handleComplete = async () => {
    if (!userEmail) { alert('로그인이 필요합니다.'); return; }
    if (isDayCompleted) { alert('이미 완료한 강의입니다!'); return; }
    setIsCompletingDay(true);
    const success = await AzureTableService.completeCourseDay(userEmail, 'vibe-coding', 6, 65);
    if (success) { setIsDayCompleted(true); alert('🎉 Day 6 완료!'); }
    setIsCompletingDay(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0a1e 0%, #1a1033 50%, #0f172a 100%)' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))', borderBottom: '1px solid rgba(139, 92, 246, 0.3)', padding: '20px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#c4b5fd', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '15px' }}><ArrowLeft size={20} /> 강의 목록으로</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', width: '65px', height: '65px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>💰</div>
            <div>
              <h1 style={{ color: 'white', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', margin: 0 }}>Day 6: 수익화 전략</h1>
              <p style={{ color: '#a78bfa', margin: '5px 0 0 0' }}>SaaS, 커미션, 구독 모든 비즈니스 모델</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} /> 1시간 5분</span>
                {isDayCompleted && <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={16} /> 완료됨</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 5vw, 40px) 20px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1))', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
          <h2 style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}><DollarSign size={28} /> 수익화 모델 비교</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {[
              { model: 'SaaS 구독', pros: '예측 가능한 수익', cons: '유지보수 필요', example: 'Notion, Figma' },
              { model: '일회성 결제', pros: '즉각적인 수익', cons: '지속 판매 필요', example: 'Gumroad 상품' },
              { model: '프리미엄', pros: '사용자 획득 용이', cons: '전환율 중요', example: 'Slack, Canva' },
              { model: '커미션/수수료', pros: '성장과 연동', cons: '거래량 필요', example: 'Stripe, Shopify' }
            ].map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr', gap: '15px', alignItems: 'center' }}>
                <div style={{ color: '#fbbf24', fontWeight: '700' }}>{item.model}</div>
                <div style={{ color: '#22c55e', fontSize: '0.9rem' }}>✅ {item.pros}</div>
                <div style={{ color: '#f87171', fontSize: '0.9rem' }}>⚠️ {item.cons}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{item.example}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '24px', padding: 'clamp(25px, 5vw, 40px)', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}><TrendingUp size={28} /> 결제 연동</h2>
          <p style={{ color: '#e2e8f0', lineHeight: '2' }}>
            <strong style={{ color: '#22c55e' }}>Stripe</strong> - 글로벌 결제 / <strong style={{ color: '#22c55e' }}>Paddle</strong> - 세금 자동 처리 / <strong style={{ color: '#22c55e' }}>Lemon Squeezy</strong> - 인디 개발자 친화적
          </p>
        </div>

        <DayDiscussion courseId="vibe-coding-day6" dayNumber={6} communityPath="/community/step3" accentColor="#8b5cf6" userEmail={userEmail} userName={userName} />

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleComplete} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white', border: 'none', padding: '18px 45px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isDayCompleted ? <><CheckCircle size={24} /> Day 6 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> Day 6 완료하기</>}
          </button>
          {onNext && <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: 'white', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '18px 45px', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '700', cursor: 'pointer' }}>Day 7로 이동 →</button>}
        </div>
      </div>
    </div>
  );
};

export default Day6Page;








