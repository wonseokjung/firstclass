import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day8PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day8Page: React.FC<Day8PageProps> = ({ onBack, onNext }) => {
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
          if (progress && progress.completedDays.includes(8)) setIsDayCompleted(true);
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
      const success = await AzureTableService.completeCourseDay(userEmail, 'ai-building-course', 8, 80);
      if (success) { setIsDayCompleted(true); alert('🎉 Day 8 완료!'); }
      else alert('❌ Day 완료 처리에 실패했습니다.');
    } catch (error) {
      console.error('❌ Day 완료 처리 오류:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 8,
    title: "[시공] AI 4단계 건축 워크플로우",
    duration: "약 80분",
    description: "바이럴 숏폼 & 고품질 롱폼 제작. 멀티 플랫폼 동시 입점 전략",
    objectives: [
      "AI 콘텐츠 제작 4단계 워크플로우 마스터",
      "숏폼과 롱폼의 차이점 이해하기",
      "멀티 플랫폼 동시 배포 전략 수립하기"
    ],
    sections: [
      {
        id: 'workflow',
        title: '🔄 AI 4단계 건축 워크플로우',
        content: `
          <div style="display: grid; gap: 20px; margin: 20px 0;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 25px; border-radius: 15px; color: white; display: flex; align-items: center; gap: 20px;">
              <div style="font-size: 2.5rem; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 15px;">1️⃣</div>
              <div>
                <strong style="font-size: 1.2rem;">설계 (AI 기획)</strong>
                <p style="margin: 5px 0 0; opacity: 0.9;">ChatGPT/Gemini로 콘텐츠 아이디어 & 스크립트 생성</p>
              </div>
            </div>
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 25px; border-radius: 15px; color: white; display: flex; align-items: center; gap: 20px;">
              <div style="font-size: 2.5rem; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 15px;">2️⃣</div>
              <div>
                <strong style="font-size: 1.2rem;">자재 수급 (AI 생성)</strong>
                <p style="margin: 5px 0 0; opacity: 0.9;">이미지, 음성, BGM, 영상 클립 AI로 생성</p>
              </div>
            </div>
            <div style="background: linear-gradient(135deg, #e5c100, #d97706); padding: 25px; border-radius: 15px; color: white; display: flex; align-items: center; gap: 20px;">
              <div style="font-size: 2.5rem; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 15px;">3️⃣</div>
              <div>
                <strong style="font-size: 1.2rem;">시공 (편집 & 조립)</strong>
                <p style="margin: 5px 0 0; opacity: 0.9;">CapCut/Premiere로 자재 조합 & 편집</p>
              </div>
            </div>
            <div style="background: linear-gradient(135deg, #ec4899, #db2777); padding: 25px; border-radius: 15px; color: white; display: flex; align-items: center; gap: 20px;">
              <div style="font-size: 2.5rem; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 15px;">4️⃣</div>
              <div>
                <strong style="font-size: 1.2rem;">입점 (멀티 플랫폼)</strong>
                <p style="margin: 5px 0 0; opacity: 0.9;">YouTube, TikTok, Instagram 동시 업로드</p>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'short-vs-long',
        title: '📱 숏폼 vs 롱폼',
        content: `
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #1e3a5f; color: white;">
              <th style="padding: 15px; text-align: left;">구분</th>
              <th style="padding: 15px; text-align: center;">숏폼 (60초 이하)</th>
              <th style="padding: 15px; text-align: center;">롱폼 (8분 이상)</th>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 15px; font-weight: 600;">플랫폼</td>
              <td style="padding: 15px; text-align: center;">TikTok, Shorts, Reels</td>
              <td style="padding: 15px; text-align: center;">YouTube</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 15px; font-weight: 600;">목적</td>
              <td style="padding: 15px; text-align: center;">바이럴, 팔로워 확보</td>
              <td style="padding: 15px; text-align: center;">광고 수익, 신뢰 구축</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 15px; font-weight: 600;">제작 시간</td>
              <td style="padding: 15px; text-align: center;">1-2시간</td>
              <td style="padding: 15px; text-align: center;">1-2일</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 15px; font-weight: 600;">AI 활용도</td>
              <td style="padding: 15px; text-align: center; color: #22c55e; font-weight: 700;">90% 자동화 가능</td>
              <td style="padding: 15px; text-align: center; color: #e5c100; font-weight: 700;">70% 자동화 가능</td>
            </tr>
          </table>
        `
      },
      {
        id: 'multi-platform',
        title: '🌐 멀티 플랫폼 전략',
        content: `
          <div style="background: linear-gradient(135deg, #0d1b2a, #1e3a5f); padding: 25px; border-radius: 15px; color: white;">
            <h4 style="color: #ffd60a; margin-bottom: 15px;">🎯 허브 앤 스포크 전략</h4>
            <p style="line-height: 1.8; margin-bottom: 20px;">
              <strong>허브 (본체):</strong> YouTube 롱폼 채널<br/>
              <strong>스포크 (지선):</strong> TikTok, Instagram, Twitter로 트래픽 유입
            </p>
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
              <strong>실행 순서:</strong><br/>
              1. 롱폼 영상 제작 (허브)<br/>
              2. 롱폼에서 하이라이트 추출 → 숏폼 3-5개 생성<br/>
              3. 숏폼에서 허브로 유입 유도
            </div>
          </div>
        `
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'linear-gradient(135deg, #e5c100 0%, #d97706 100%)', padding: '20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#0d1b2a', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginBottom: '15px' }}><ArrowLeft size={20} /> 강의 목록으로</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: '#0d1b2a' }}>8</div>
            <div>
              <h1 style={{ color: '#0d1b2a', fontSize: '1.5rem', margin: 0 }}>Day {lessonData.day}: {lessonData.title}</h1>
              {isDayCompleted && (
                <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                  <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={16} /> 완료됨</span>
                </div>
              )}
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

        {/* Day 8 토론방 */}
        <DayDiscussion
          courseId="ai-building-day8"
          dayNumber={8}
          communityPath="/community/step1"
          accentColor="#22c55e"
          userEmail={userEmail}
          userName={userName}
        />

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={handleCompleteDay} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #e5c100, #d97706)', color: '#0d1b2a', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isDayCompleted ? <><CheckCircle size={24} /> Day 8 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> Day 8 완료하기</>}
          </button>
          {onNext && <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #1e3a5f, #0d1b2a)', color: '#0d1b2a', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' }}>Day 9로 이동 →</button>}
        </div>
      </div>
    </div>
  );
};

export default Day8Page;






