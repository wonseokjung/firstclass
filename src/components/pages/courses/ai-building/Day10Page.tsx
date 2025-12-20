import React, { useState, useEffect } from 'react';
import { ArrowLeft, PlayCircle, Clock, BookOpen, Trophy } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day10PageProps {
  onBack: () => void;
}

const Day10Page: React.FC<Day10PageProps> = ({ onBack }) => {
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
          const progress = await AzureTableService.getCourseDayProgress(parsed.email, 'ai-building-course');
          if (progress && progress.completedDays.includes(10)) setIsDayCompleted(true);
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
      const success = await AzureTableService.completeCourseDay(userEmail, 'ai-building-course', 10, 70);
      if (success) { setIsDayCompleted(true); alert('🎉🎉🎉 축하합니다! 전체 강의를 완료했습니다! 🎉🎉🎉'); }
      else alert('❌ Day 완료 처리에 실패했습니다.');
    } catch (error) {
      console.error('❌ Day 완료 처리 오류:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 10,
    title: "[첫 월세] 수익 시스템 구축 완성",
    duration: "약 70분",
    description: "애드센스 + 제휴마케팅 + 멤버십 | 허브-앤-스포크 자동화 시스템",
    objectives: [
      "4가지 수익 모델 완전 이해하기",
      "애드센스 승인 전략 수립하기",
      "멤버십 및 제휴 마케팅 설정하기"
    ],
    sections: [
      {
        id: 'revenue-models',
        title: '💰 4가지 수익 모델',
        content: `
          <div style="display: grid; gap: 20px; margin: 20px 0;">
            <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 25px; border-radius: 15px; color: white;">
              <h4 style="margin-bottom: 10px;">1️⃣ 광고 수익 (애드센스)</h4>
              <p style="margin: 0; opacity: 0.9;">유튜브 파트너 프로그램(YPP) 가입 → 자동 광고 삽입</p>
              <p style="margin: 10px 0 0; font-size: 0.9rem; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px;">
                조건: 구독자 1,000명 + 시청시간 4,000시간 또는 Shorts 조회수 1,000만
              </p>
            </div>
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 25px; border-radius: 15px; color: white;">
              <h4 style="margin-bottom: 10px;">2️⃣ 제휴 마케팅</h4>
              <p style="margin: 0; opacity: 0.9;">쿠팡 파트너스, 아마존 어필리에이트 등 제품 추천 수수료</p>
              <p style="margin: 10px 0 0; font-size: 0.9rem; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px;">
                예상 수익: 판매액의 3-10%
              </p>
            </div>
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 25px; border-radius: 15px; color: white;">
              <h4 style="margin-bottom: 10px;">3️⃣ 멤버십/구독</h4>
              <p style="margin: 0; opacity: 0.9;">유튜브 채널 멤버십, Patreon 등 월정액 팬 서비스</p>
              <p style="margin: 10px 0 0; font-size: 0.9rem; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px;">
                예상 수익: 멤버당 월 $1-50
              </p>
            </div>
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 25px; border-radius: 15px; color: white;">
              <h4 style="margin-bottom: 10px;">4️⃣ 디지털 제품/서비스</h4>
              <p style="margin: 0; opacity: 0.9;">전자책, 온라인 강의, 컨설팅 등 직접 제작 상품</p>
              <p style="margin: 10px 0 0; font-size: 0.9rem; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px;">
                마진율: 80-95% (가장 수익성 높음)
              </p>
            </div>
          </div>
        `
      },
      {
        id: 'automation',
        title: '🔄 허브-앤-스포크 자동화',
        content: `
          <div style="background: linear-gradient(135deg, #0f172a, #1e3a5f); padding: 30px; border-radius: 15px; color: white; text-align: center;">
            <h4 style="color: #fbbf24; margin-bottom: 25px; font-size: 1.3rem;">🏭 24시간 돌아가는 디지털 공장</h4>
            <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap;">
              <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
                <div style="font-size: 2rem;">📝</div>
                <p style="margin: 10px 0 0; font-size: 0.9rem;">AI 기획</p>
              </div>
              <div style="font-size: 2rem;">→</div>
              <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
                <div style="font-size: 2rem;">🎨</div>
                <p style="margin: 10px 0 0; font-size: 0.9rem;">AI 생성</p>
              </div>
              <div style="font-size: 2rem;">→</div>
              <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px;">
                <div style="font-size: 2rem;">📤</div>
                <p style="margin: 10px 0 0; font-size: 0.9rem;">자동 업로드</p>
              </div>
              <div style="font-size: 2rem;">→</div>
              <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 20px; border-radius: 15px;">
                <div style="font-size: 2rem;">💵</div>
                <p style="margin: 10px 0 0; font-size: 0.9rem;">수익 발생</p>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'next-steps',
        title: '🚀 다음 단계',
        content: `
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 30px; border-radius: 15px; color: white; text-align: center;">
            <h4 style="margin-bottom: 20px; font-size: 1.5rem;">🎉 축하합니다! AI 디지털 건물주가 되셨습니다!</h4>
            <div style="display: grid; gap: 15px; text-align: left; max-width: 500px; margin: 0 auto;">
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                ✅ Day 1-5: 입지 선정 & 건물 계획 완료
              </div>
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                ✅ Day 6-7: AI 건축 자재 마스터
              </div>
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                ✅ Day 8-9: 건물 시공 & 데이터 분석
              </div>
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                ✅ Day 10: 수익 시스템 구축
              </div>
            </div>
            <div style="margin-top: 25px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 15px;">
              <p style="margin: 0; font-size: 1.1rem;">
                💡 이제 <strong>Step 2: AI 에이전트 비기너</strong>로<br/>
                콘텐츠 자동 생성 시스템을 구축해보세요!
              </p>
            </div>
          </div>
        `
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', padding: '20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginBottom: '15px' }}><ArrowLeft size={20} /> 강의 목록으로</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>🏆</div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>Day {lessonData.day}: {lessonData.title}</h1>
              <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} /> {lessonData.duration}</span>
                {isDayCompleted && <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px' }}><Trophy size={16} /> 전체 완료!</span>}
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

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={handleCompleteDay} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'linear-gradient(135deg, #22c55e, #16a34a)', color: isDayCompleted ? '#1e3a5f' : 'white', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isDayCompleted ? <><Trophy size={24} /> 🎉 전체 강의 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> 강의 완료하기</>}
          </button>
        </div>

        {isDayCompleted && (
          <div style={{ marginTop: '30px', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '20px', padding: '30px', textAlign: 'center' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '15px' }}>🏆 AI 디지털 건물주 수료!</h3>
            <p style={{ color: '#1e3a5f', marginBottom: '20px' }}>축하합니다! 이제 첫 월세를 받을 준비가 되었습니다!</p>
            <button onClick={onBack} style={{ background: '#1e3a5f', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>
              강의 목록으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Day10Page;






