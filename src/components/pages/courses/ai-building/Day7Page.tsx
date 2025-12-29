import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day7PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day7Page: React.FC<Day7PageProps> = ({ onBack, onNext }) => {
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
          if (progress && progress.completedDays.includes(7)) setIsDayCompleted(true);
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
      const success = await AzureTableService.completeCourseDay(userEmail, 'ai-building-course', 7, 65);
      if (success) { setIsDayCompleted(true); alert('🎉 Day 7 완료!'); }
      else alert('❌ Day 완료 처리에 실패했습니다.');
    } catch (error) {
      console.error('❌ Day 완료 처리 오류:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 7,
    title: "[재료학] 사운드 & 영상 생성 AI 마스터",
    duration: "약 65분",
    description: "ElevenLabs 음성 클로닝 | Suno AI BGM | VEO 영상 생성 완전정복",
    objectives: [
      "AI 음성 생성의 원리 이해하기",
      "나만의 AI 음성 만들기",
      "AI로 BGM과 영상 생성하기"
    ],
    sections: [
      {
        id: 'voice-ai',
        title: '🎙️ AI 음성 생성',
        content: `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
            <div style="background: linear-gradient(135deg, #000000, #333333); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🎤</div>
              <strong>ElevenLabs</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">최고 품질 음성</p>
            </div>
            <div style="background: linear-gradient(135deg, #4285f4, #1a73e8); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🔊</div>
              <strong>Google TTS</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">다국어 지원</p>
            </div>
            <div style="background: linear-gradient(135deg, #10a37f, #0d8a6f); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">💬</div>
              <strong>OpenAI TTS</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">자연스러운 톤</p>
            </div>
          </div>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 15px; border-left: 4px solid #0ea5e9; margin-top: 20px;">
            <p style="margin: 0;"><strong>💡 팁:</strong> ElevenLabs는 내 목소리를 학습시켜 AI 음성으로 만들 수 있습니다!</p>
          </div>
        `
      },
      {
        id: 'music-ai',
        title: '🎵 AI 음악 생성',
        content: `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
            <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🎹</div>
              <strong>Suno AI</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">보컬 포함 가능</p>
            </div>
            <div style="background: linear-gradient(135deg, #f43f5e, #e11d48); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🎼</div>
              <strong>Udio</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">다양한 장르</p>
            </div>
          </div>
          <div style="background: #0d1b2a; padding: 20px; border-radius: 15px; color: #22c55e; font-family: monospace; margin-top: 20px;">
            <strong>Suno AI 프롬프트 예시:</strong><br/><br/>
            "편안한 로파이 힙합 비트,<br/>
            공부할 때 듣기 좋은,<br/>
            재즈 피아노 샘플 포함,<br/>
            2분 길이"
          </div>
        `
      },
      {
        id: 'video-ai',
        title: '🎬 AI 영상 생성',
        content: `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
            <div style="background: linear-gradient(135deg, #4285f4, #1a73e8); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🎥</div>
              <strong>Google VEO</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">고품질 영상</p>
            </div>
            <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">✨</div>
              <strong>Runway</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">이미지→영상</p>
            </div>
            <div style="background: linear-gradient(135deg, #ec4899, #db2777); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🌊</div>
              <strong>Pika</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">창의적 효과</p>
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
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginBottom: '15px' }}><ArrowLeft size={20} /> 강의 목록으로</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>7</div>
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

        {/* Day 7 토론방 */}
        <DayDiscussion
          courseId="ai-building-day7"
          dayNumber={7}
          communityPath="/community/step1"
          accentColor="#22c55e"
          userEmail={userEmail}
          userName={userName}
        />

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={handleCompleteDay} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #e5c100, #d97706)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isDayCompleted ? <><CheckCircle size={24} /> Day 7 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> Day 7 완료하기</>}
          </button>
          {onNext && <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #1e3a5f, #ffffff)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' }}>Day 8로 이동 →</button>}
        </div>
      </div>
    </div>
  );
};

export default Day7Page;






