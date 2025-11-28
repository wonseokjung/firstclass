import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Award } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day9PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day9Page: React.FC<Day9PageProps> = ({ onBack, onNext }) => {
  const [completedDaysCount, setCompletedDaysCount] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // 사용자 정보 및 Day 완료 상태 로드
  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const userInfo = sessionStorage.getItem('aicitybuilders_user_session');
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          setUserEmail(parsed.email);

          // Day 완료 상태 확인
          const progress = await AzureTableService.getCourseDayProgress(
            parsed.email,
            'chatgpt-agent-beginner'
          );

          if (progress && progress.completedDays) {
            setCompletedDaysCount(progress.completedDays.length);
            if (progress.completedDays.includes(9)) {
              setIsDayCompleted(true);
            }
          }
        }
      } catch (error) {
        console.error('❌ 진행 상황 로드 실패:', error);
      }
    };

    loadUserProgress();
  }, []);

  // 9강 완료 처리
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

      // 학습 시간 계산 (예: 60분)
      const learningTimeMinutes = 60;

      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'chatgpt-agent-beginner',
        9,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 9강 완료! 다음 강의로 이동하세요!');
      } else {
        alert('❌ 9강 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 9강 완료 처리 오류:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 9,
    title: "Day 9: 일관성 있는 이미지 시리즈 만들기 - Google Opal로 브랜드 스토리텔링",
    duration: "약 10분",
    description: "Google Opal을 활용하여 같은 캐릭터, 제품, 스타일로 연결되는 일관성 있는 이미지 시리즈를 생성하는 방법을 학습합니다.",
    objectives: [
      "일관성 있는 이미지 시리즈 생성의 중요성 이해",
      "Google Opal로 같은 캐릭터/제품이 등장하는 이미지 만들기",
      "워크플로우 커스터마이징: 프롬프트 변경, 노드 추가/삭제",
      "제품 광고 시리즈를 유튜브 콘텐츠로 제작 및 업로드"
    ],
    sections: [
      {
        id: 'theory-1',
        type: 'theory',
        title: 'Day 9: 일관성 있는 이미지 시리즈 만들기',
        duration: '약 10분',
        videoUrl: 'https://player.vimeo.com/video/1141301704?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <h3>🔗 실습 워크플로우 (베이스라인)</h3>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            아래 워크플로우를 기반으로 자유롭게 수정하고 실험해보세요:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="https://opal.google/_app/?flow=drive:/1Ug7YMGvzO_cbCIEeiaHmzeAEL2wMxgVv&shared&mode=app"
              target="_blank"
              rel="noopener noreferrer"
              style="
                display: inline-block;
                background: linear-gradient(135deg, #0ea5e9, #0284c7);
                color: white;
                text-decoration: none;
                padding: 15px 30px;
                border-radius: 10px;
                font-size: 1.1rem;
                font-weight: 700;
                box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
                transition: all 0.3s ease;
              "
              onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(14, 165, 233, 0.4)';"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(14, 165, 233, 0.3)';"
            >
              🔗 Google Opal 베이스라인 워크플로우 열기
            </a>
          </div>
          
          <p style="font-size: 0.95rem; line-height: 1.6; color: #64748b; text-align: center; margin-bottom: 40px;">
            💡 이 워크플로우를 복사한 후 자유롭게 수정해보세요!
          </p>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />

          <h3>🎨 일관성 있는 이미지 시리즈의 중요성</h3>
          
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            인스타그램, 유튜브 등 소셜 미디어에서 스토리텔링을 할 때 가장 중요한 것은 <strong>일관성</strong>입니다.
            나이키 광고처럼 <strong>같은 캐릭터, 같은 제품, 같은 스타일</strong>로 연결되는 이미지를 만들어야 
            브랜드 아이덴티티를 구축하고 시청자의 기억에 남을 수 있습니다.
          </p>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #0c4a6e; margin: 0;">
              💡 <strong>핵심 포인트:</strong> Google Opal을 활용하면 같은 캐릭터와 제품이 등장하는 일관된 이미지 시리즈를 자동으로 생성할 수 있습니다.
            </p>
          </div>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>🔧 Google Opal로 일관성 유지하기</h3>
          <ul style="line-height: 1.8; font-size: 1.05rem; margin: 20px 0;">
            <li><strong>캐릭터 일관성:</strong> 동일한 캐릭터 디자인을 여러 장면에 적용</li>
            <li><strong>제품 일관성:</strong> 같은 제품을 다양한 각도와 상황에서 표현</li>
            <li><strong>스타일 일관성:</strong> 색감, 분위기, 톤앤매너를 통일하여 브랜드 정체성 확립</li>
            <li><strong>스토리 연결:</strong> 여러 이미지가 하나의 스토리로 이어지도록 구성</li>
          </ul>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>📝 실습 과제: 나만의 제품 광고 시리즈 만들기</h3>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            제공된 워크플로우(베이스라인)를 기반으로 다양한 실습을 진행해보세요:
          </p>
          
          <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <h4 style="color: #92400e; margin: 0 0 15px 0; font-size: 1.15rem;">🎯 숙제 미션</h4>
            <ol style="color: #92400e; line-height: 2; margin: 0; padding-left: 20px;">
              <li><strong>프롬프트 변경:</strong> 다양한 프롬프트를 시도하며 결과물 비교하기</li>
              <li><strong>워크플로우 커스터마이징:</strong> 노드를 추가하거나 삭제하며 실험하기</li>
              <li><strong>제품 광고 시리즈 제작:</strong> 3~5장의 일관된 이미지로 스토리 만들기</li>
              <li><strong>유튜브 커뮤니티 업로드:</strong> 완성된 콘텐츠를 <a href="https://www.youtube.com/@CONNECT-AI-LAB/community" target="_blank" rel="noopener noreferrer" style="color: #0ea5e9; text-decoration: underline; font-weight: 700;">Connect AI LAB 커뮤니티</a>에 공유하기</li>
            </ol>
          </div>

          <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #065f46; margin: 0;">
              ✅ <strong>성공 팁:</strong> 같은 프롬프트의 핵심 요소(캐릭터 설명, 제품 특징)를 유지하면서 
              배경이나 액션만 변경하면 일관성을 유지할 수 있습니다!
            </p>
          </div>
        `
      }
    ]
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* 헤더 */}
      <header style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        color: 'white',
        padding: '20px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ArrowLeft size={20} />
            강의 목록으로
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'inline-block'
            }}>
              Day 9 / 10
            </div>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '700' }}>
              {lessonData.title}
            </h1>
          </div>

          <div style={{ width: '140px' }}></div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* 강의 정보 카드 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {lessonData.duration}
            </span>
            <span style={{
              color: '#64748b',
              fontSize: '0.95rem'
            }}>
              완료한 강의: {completedDaysCount}개
            </span>
          </div>

          <p style={{
            color: '#475569',
            fontSize: '1.05rem',
            lineHeight: '1.8',
            margin: 0
          }}>
            {lessonData.description}
          </p>

          <div style={{ marginTop: '25px' }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '15px'
            }}>
              📚 학습 목표
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#475569',
              lineHeight: '2'
            }}>
              {lessonData.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 목차 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FileText size={24} />
            강의 목차
          </h2>
          {lessonData.sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => handleScroll(section.id)}
              style={{
                width: '100%',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#0ea5e9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#0ea5e9',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {section.type === 'theory' ? '📖 이론' : '💻 실습'} · {section.duration}
                </div>
                <div style={{
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  {section.title}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 강의 섹션들 */}
        {lessonData.sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              scrollMarginTop: '100px'
            }}
          >
            <div style={{
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                {section.type === 'theory' ? '📖 이론 강의' : '💻 실습 강의'}
              </div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 10px 0'
              }}>
                {section.title}
              </h2>
              <p style={{
                color: '#64748b',
                fontSize: '0.95rem',
                margin: 0
              }}>
                ⏱️ {section.duration}
              </p>
            </div>

            {/* Vimeo 비디오 */}
            {section.videoUrl && section.isVimeo && (
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '12px',
                marginBottom: '30px',
                background: '#000'
              }}>
                <iframe
                  src={section.videoUrl}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={section.title}
                />
              </div>
            )}

            {/* 콘텐츠 */}
            <div
              style={{
                fontSize: '1rem',
                lineHeight: '1.8',
                color: '#334155'
              }}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        ))}

        {/* 완료 버튼 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          textAlign: 'center'
        }}>
          <Award size={48} color="#0ea5e9" style={{ marginBottom: '20px' }} />
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '15px'
          }}>
            {isDayCompleted ? '✅ Day 9 완료!' : '강의를 완료하셨나요?'}
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '25px',
            fontSize: '1.05rem'
          }}>
            {isDayCompleted
              ? '축하합니다! 다음 강의로 넘어가세요.'
              : '강의를 모두 시청하셨다면 완료 버튼을 눌러주세요.'}
          </p>
          <button
            onClick={isDayCompleted ? onNext : handleCompleteDay}
            disabled={isCompletingDay}
            style={{
              background: isDayCompleted
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              fontSize: '1.1rem',
              fontWeight: '700',
              borderRadius: '12px',
              cursor: isCompletingDay ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
              opacity: isCompletingDay ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isCompletingDay) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.3)';
            }}
          >
            {isCompletingDay ? '처리 중...' : isDayCompleted ? '다음 강의로 →' : 'Day 9 완료하기'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Day9Page;
