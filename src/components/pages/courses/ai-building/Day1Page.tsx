import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day1PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day1Page: React.FC<Day1PageProps> = ({ onBack, onNext }) => {
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

          if (progress && progress.completedDays.includes(1)) {
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
      const learningTimeMinutes = 45;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        1,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 1 완료! 다음 강의로 이동하세요!');
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
    day: 1,
    title: "프롤로그: 맨해튼 부자 삼촌의 교훈",
    duration: "약 45분",
    description: "맨해튼 부동산 거물 삼촌의 교훈과 AI 시대 재해석. Google AI Studio 입문",
    objectives: [
      "맨해튼 부자 삼촌의 부동산 철학 이해하기",
      "AI 시대에 '디지털 건물'이 무엇인지 배우기",
      "Google AI Studio 기본 사용법 익히기"
    ],
    sections: [
      {
        id: 'intro',
        title: '🏙️ 맨해튼 부자 삼촌의 이야기',
        content: `
          <p>뉴욕 맨해튼에서 수십 채의 건물을 소유한 삼촌이 말했습니다:</p>
          <blockquote style="border-left: 4px solid #0ea5e9; padding-left: 20px; margin: 20px 0; font-style: italic; color: #64748b;">
            "건물을 사는 건 쉬워. 하지만 좋은 입지를 찾는 게 진짜 실력이야. 
            입지가 좋으면 세입자가 알아서 찾아오고, 월세도 꾸준히 올라가지."
          </blockquote>
          <p>이 교훈을 AI 시대에 적용하면? <strong>디지털 건물(콘텐츠 채널)</strong>도 똑같습니다.</p>
        `
      },
      {
        id: 'digital-building',
        title: '🏗️ 디지털 건물이란?',
        content: `
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 15px 0; padding: 15px; background: #f0f9ff; border-radius: 10px;">
              <strong>🏢 부동산 건물</strong> = 물리적 공간에서 월세 수익
            </li>
            <li style="margin: 15px 0; padding: 15px; background: #fef3c7; border-radius: 10px;">
              <strong>📱 디지털 건물</strong> = 유튜브, 블로그, SNS에서 광고/구독 수익
            </li>
          </ul>
          <p style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #0f172a, #1e3a5f); color: white; border-radius: 15px;">
            <strong>핵심:</strong> AI를 활용하면 혼자서도 여러 채의 '디지털 건물'을 지을 수 있습니다!
          </p>
        `
      },
      {
        id: 'google-ai-studio',
        title: '🔧 실습: Google AI Studio 입문',
        content: `
          <div style="background: #f8fafc; padding: 20px; border-radius: 15px; border: 2px solid #e2e8f0;">
            <h4 style="color: #1e3a5f; margin-bottom: 15px;">실습 단계</h4>
            <ol style="padding-left: 20px; line-height: 2;">
              <li><a href="https://aistudio.google.com" target="_blank" style="color: #0ea5e9;">Google AI Studio</a> 접속하기</li>
              <li>Google 계정으로 로그인</li>
              <li>"Create new prompt" 클릭</li>
              <li>간단한 프롬프트 테스트해보기</li>
            </ol>
          </div>
        `
      }
    ],
    quiz: [
      {
        question: "맨해튼 부자 삼촌의 핵심 교훈은 무엇인가요?",
        options: [
          "건물을 많이 사는 것이 중요하다",
          "좋은 입지를 찾는 것이 진짜 실력이다",
          "월세를 싸게 받아야 한다",
          "혼자서 모든 것을 해야 한다"
        ],
        correctAnswer: 1
      },
      {
        question: "디지털 건물의 예시가 아닌 것은?",
        options: [
          "유튜브 채널",
          "블로그",
          "실제 아파트",
          "인스타그램 계정"
        ],
        correctAnswer: 2
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            <ArrowLeft size={20} />
            강의 목록으로
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              width: '60px',
              height: '60px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: '800',
              color: 'white'
            }}>
              1
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>
                Day {lessonData.day}: {lessonData.title}
              </h1>
              <div style={{ display: 'flex', gap: '15px', marginTop: '8px' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={16} /> {lessonData.duration}
                </span>
                {isDayCompleted && (
                  <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle size={16} /> 완료됨
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 학습 목표 */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e3a5f', marginBottom: '20px' }}>
            <BookOpen size={24} /> 학습 목표
          </h2>
          <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
            {lessonData.objectives.map((obj, idx) => (
              <li key={idx} style={{ color: '#64748b' }}>{obj}</li>
            ))}
          </ul>
        </div>

        {/* 강의 섹션들 */}
        {lessonData.sections.map((section, idx) => (
          <div key={section.id} style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '20px' }}>{section.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        ))}

        {/* 퀴즈 섹션 */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '2px solid #fbbf24'
        }}>
          <h3 style={{ color: '#92400e', marginBottom: '20px' }}>📝 오늘의 퀴즈</h3>
          {lessonData.quiz.map((q, idx) => (
            <div key={idx} style={{ marginBottom: '20px' }}>
              <p style={{ fontWeight: '600', color: '#1f2937' }}>{idx + 1}. {q.question}</p>
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} style={{
                  display: 'block',
                  padding: '10px 15px',
                  margin: '8px 0',
                  background: 'white',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}>
                  <input type="radio" name={`quiz-${idx}`} style={{ marginRight: '10px' }} />
                  {opt}
                </label>
              ))}
            </div>
          ))}
        </div>

        {/* 완료 버튼 */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={handleCompleteDay}
            disabled={isCompletingDay || isDayCompleted}
            style={{
              background: isDayCompleted 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '15px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: isDayCompleted ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle size={24} /> Day 1 완료!
              </>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <>
                <PlayCircle size={24} /> Day 1 완료하기
              </>
            )}
          </button>
          
          {onNext && (
            <button
              onClick={onNext}
              style={{
                background: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '15px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Day 2로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day1Page;
