import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day2PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day2Page: React.FC<Day2PageProps> = ({ onBack, onNext }) => {
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

          if (progress && progress.completedDays.includes(2)) {
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
      const learningTimeMinutes = 50;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'ai-building-course',
        2,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 2 완료! 다음 강의로 이동하세요!');
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
    day: 2,
    title: "경제적 자유: 잠자는 동안에도 돈이 들어오는 구조",
    duration: "약 50분",
    description: "부동산 vs 콘텐츠, 경제적 자유의 새로운 정의. AI 기반 콘텐츠 청사진 만들기",
    objectives: [
      "경제적 자유의 진정한 의미 이해하기",
      "패시브 인컴(수동 수익) 구조 설계하기",
      "AI를 활용한 콘텐츠 청사진 만들기"
    ],
    sections: [
      {
        id: 'passive-income',
        title: '💰 경제적 자유란?',
        content: `
          <p style="font-size: 1.1rem; line-height: 1.8;">경제적 자유는 단순히 돈이 많은 것이 아닙니다.</p>
          <div style="background: linear-gradient(135deg, #0f172a, #1e3a5f); padding: 25px; border-radius: 15px; color: white; margin: 20px 0;">
            <h4 style="color: #fbbf24; margin-bottom: 15px;">경제적 자유 = 시간의 자유</h4>
            <p style="margin: 0;">일하지 않아도 생활비 이상의 수입이 들어오는 상태</p>
          </div>
          <ul style="list-style: none; padding: 0; margin-top: 20px;">
            <li style="padding: 15px; margin: 10px 0; background: #f0f9ff; border-radius: 10px; border-left: 4px solid #0ea5e9;">
              <strong>노동 소득:</strong> 일한 만큼만 돈을 받음 (시간 = 돈)
            </li>
            <li style="padding: 15px; margin: 10px 0; background: #fef3c7; border-radius: 10px; border-left: 4px solid #fbbf24;">
              <strong>패시브 인컴:</strong> 시스템이 돈을 벌어줌 (시간 ≠ 돈)
            </li>
          </ul>
        `
      },
      {
        id: 'real-vs-digital',
        title: '🏢 부동산 vs 디지털 콘텐츠',
        content: `
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #1e3a5f; color: white;">
              <th style="padding: 15px; text-align: left; border-radius: 10px 0 0 0;">항목</th>
              <th style="padding: 15px; text-align: center;">부동산</th>
              <th style="padding: 15px; text-align: center; border-radius: 0 10px 0 0;">디지털 콘텐츠</th>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 15px; font-weight: 600;">초기 자본</td>
              <td style="padding: 15px; text-align: center;">수억원</td>
              <td style="padding: 15px; text-align: center; color: #22c55e; font-weight: 700;">거의 0원</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 15px; font-weight: 600;">수익 시작</td>
              <td style="padding: 15px; text-align: center;">수개월~수년</td>
              <td style="padding: 15px; text-align: center; color: #22c55e; font-weight: 700;">즉시 가능</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 15px; font-weight: 600;">확장성</td>
              <td style="padding: 15px; text-align: center;">제한적</td>
              <td style="padding: 15px; text-align: center; color: #22c55e; font-weight: 700;">무제한</td>
            </tr>
          </table>
        `
      },
      {
        id: 'ai-blueprint',
        title: '📋 실습: AI 콘텐츠 청사진 만들기',
        content: `
          <div style="background: #f8fafc; padding: 25px; border-radius: 15px; border: 2px solid #e2e8f0;">
            <h4 style="color: #1e3a5f; margin-bottom: 15px;">Google AI Studio 실습</h4>
            <p style="margin-bottom: 15px;">아래 프롬프트를 입력해보세요:</p>
            <div style="background: #1e293b; color: #22c55e; padding: 20px; border-radius: 10px; font-family: monospace; font-size: 0.95rem; line-height: 1.8;">
              "나는 [관심 분야]에 관심이 있는 사람입니다.<br/>
              AI를 활용해서 수익화할 수 있는<br/>
              콘텐츠 채널 아이디어 5가지를 제안해주세요.<br/>
              각각의 예상 수익 모델도 함께 알려주세요."
            </div>
          </div>
        `
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
              2
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
        {lessonData.sections.map((section) => (
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
                <CheckCircle size={24} /> Day 2 완료!
              </>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <>
                <PlayCircle size={24} /> Day 2 완료하기
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
              Day 3으로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day2Page;

