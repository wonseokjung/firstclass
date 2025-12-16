import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day6PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day6Page: React.FC<Day6PageProps> = ({ onBack, onNext }) => {
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

          const progress = await AzureTableService.getCourseDayProgress(
            parsed.email,
            'ai-building-course'
          );

          if (progress && progress.completedDays.includes(6)) {
            setIsDayCompleted(true);
          }
        }
      } catch (error) {
        console.error('❌ 진행 상황 로드 실패:', error);
      }
    };

    loadUserProgress();
  }, []);

  const handleCompleteDay = async () => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (isDayCompleted) {
      alert('이미 완료한 강의입니다!');
      return;
    }

    try {
      setIsCompletingDay(true);
      const learningTimeMinutes = 70;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        6,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 6 완료! 다음 강의로 이동하세요!');
      } else {
        alert('❌ Day 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ Day 완료 처리 오류:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 6,
    title: "[재료학] 텍스트 & 이미지 생성 AI 마스터",
    duration: "약 70분",
    description: "ChatGPT 프롬프트 엔지니어링. Nano Banana & ChatGPT 이미지 생성 실습",
    objectives: [
      "텍스트 생성 AI의 원리 이해하기",
      "효과적인 프롬프트 작성법 배우기",
      "이미지 생성 AI로 썸네일 만들기"
    ],
    sections: [
      {
        id: 'text-ai',
        title: '📝 텍스트 생성 AI',
        content: `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
            <div style="background: linear-gradient(135deg, #10a37f, #0d8a6f); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">💬</div>
              <strong>ChatGPT</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">가장 대중적</p>
            </div>
            <div style="background: linear-gradient(135deg, #d97706, #b45309); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🤖</div>
              <strong>Claude</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">긴 문서 처리</p>
            </div>
            <div style="background: linear-gradient(135deg, #4285f4, #1a73e8); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">✨</div>
              <strong>Gemini</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">멀티모달 강점</p>
            </div>
          </div>
        `
      },
      {
        id: 'prompt-engineering',
        title: '🎯 프롬프트 엔지니어링 기초',
        content: `
          <div style="background: #1e293b; padding: 25px; border-radius: 15px; color: white; margin: 20px 0;">
            <h4 style="color: #22c55e; margin-bottom: 15px;">좋은 프롬프트의 4요소</h4>
            <div style="display: grid; gap: 10px;">
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #fbbf24;">1. 역할 (Role):</strong> "당신은 유튜브 전문가입니다"
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #fbbf24;">2. 맥락 (Context):</strong> "10만 구독자 채널을 운영 중입니다"
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #fbbf24;">3. 작업 (Task):</strong> "다음 영상 아이디어 5개를 제안해주세요"
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                <strong style="color: #fbbf24;">4. 형식 (Format):</strong> "표 형식으로, 예상 조회수 포함"
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'image-ai',
        title: '🎨 이미지 생성 AI',
        content: `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
            <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🖼️</div>
              <strong>DALL-E 3</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">ChatGPT 내장</p>
            </div>
            <div style="background: linear-gradient(135deg, #ec4899, #db2777); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🍌</div>
              <strong>Nano Banana</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">캐릭터 일관성</p>
            </div>
            <div style="background: linear-gradient(135deg, #14b8a6, #0d9488); padding: 20px; border-radius: 15px; color: white; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 10px;">🌟</div>
              <strong>Midjourney</strong>
              <p style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">예술적 품질</p>
            </div>
          </div>
          <div style="background: #fef3c7; padding: 20px; border-radius: 15px; border: 2px solid #fbbf24; margin-top: 20px;">
            <h4 style="color: #92400e; margin-bottom: 10px;">🔧 실습</h4>
            <p style="color: #92400e; margin: 0;">ChatGPT에서 "내 채널 썸네일 이미지를 만들어줘. [채널 주제]에 맞는 스타일로"를 입력해보세요!</p>
          </div>
        `
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginBottom: '15px' }}>
            <ArrowLeft size={20} /> 강의 목록으로
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>6</div>
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
          <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
            {lessonData.objectives.map((obj, idx) => <li key={idx} style={{ color: '#64748b' }}>{obj}</li>)}
          </ul>
        </div>

        {lessonData.sections.map((section) => (
          <div key={section.id} style={{ background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '20px' }}>{section.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        ))}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={handleCompleteDay} disabled={isCompletingDay || isDayCompleted} style={{ background: isDayCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: isDayCompleted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isDayCompleted ? <><CheckCircle size={24} /> Day 6 완료!</> : isCompletingDay ? '처리 중...' : <><PlayCircle size={24} /> Day 6 완료하기</>}
          </button>
          {onNext && <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' }}>Day 7로 이동 →</button>}
        </div>
      </div>
    </div>
  );
};

export default Day6Page;



