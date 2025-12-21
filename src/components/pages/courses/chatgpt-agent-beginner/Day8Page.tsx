import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Award } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day8PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day8Page: React.FC<Day8PageProps> = ({ onBack, onNext }) => {
  const [completedDaysCount, setCompletedDaysCount] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  // 사용자 정보 및 Day 완료 상태 로드
  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const userInfo = sessionStorage.getItem('aicitybuilders_user_session');
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          setUserEmail(parsed.email);
          setUserName(parsed.name || parsed.email?.split('@')[0] || '익명');

          // Day 완료 상태 확인
          const progress = await AzureTableService.getCourseDayProgress(
            parsed.email,
            'chatgpt-agent-beginner'
          );

          if (progress && progress.completedDays) {
            setCompletedDaysCount(progress.completedDays.length);
            if (progress.completedDays.includes(8)) {
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

  // 8강 완료 처리
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
        8,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 8강 완료! 다음 강의로 이동하세요!');
      } else {
        alert('❌ 8강 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 8강 완료 처리 오류:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 8,
    title: "Opal의 숨겨진 비밀: 대화로 워크플로우 자동 생성 + 구글 스프레드시트 연동",
    duration: "12분 18초",
    description: "Opal의 자동 워크플로우 생성 기능과 구글 스프레드시트 연동을 활용한 효율적인 콘텐츠 계획 수립 방법을 학습합니다.",
    objectives: [
      "대화형으로 워크플로우를 자동 생성하는 방법",
      "노드와 프롬프트를 한글로 자동 작성하기",
      "구글 스프레드시트에 콘텐츠 계획 자동 저장",
      "유튜브 콘텐츠 계획표 자동 생성 실습",
      "다양한 업무에 적용 가능한 자동화 전략"
    ],
    sections: [
      {
        id: 'theory-1',
        type: 'theory',
        title: 'Opal의 숨겨진 비밀: 대화로 워크플로우 자동 생성 (이론 + 실습)',
        duration: '12분 18초',
        videoUrl: 'https://player.vimeo.com/video/1140420306?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <h3>1. 대화형 워크플로우 생성 (Describe what you want to build)</h3>
          
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            Google Opal의 강력한 기능 중 하나는 자연어 대화만으로 복잡한 워크플로우를 자동으로 생성해준다는 점입니다.
            "Create New" 버튼을 누르고 "Describe what you want to build"를 선택하면, 만들고 싶은 기능을 말로 설명하는 것만으로 초기 구조를 잡을 수 있습니다.
          </p>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #0c4a6e; margin: 0;">
              💡 <strong>Tip:</strong> 한글로 설명해도 Opal이 이해하고 적절한 노드와 프롬프트를 구성해줍니다. 복잡한 로직을 처음부터 설계하기 어려울 때 매우 유용합니다.
            </p>
          </div>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>2. 구글 스프레드시트 연동 (Google Sheets Integration)</h3>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            생성된 콘텐츠나 데이터를 구글 스프레드시트에 자동으로 저장하면, 체계적인 관리가 가능해집니다.
            Opal의 Google Sheets 노드를 활용하여 AI가 생성한 유튜브 콘텐츠 계획을 시트에 차곡차곡 쌓는 방법을 배웁니다.
          </p>
          
          <ul style="line-height: 1.8; font-size: 1.05rem;">
            <li><strong>Add Row:</strong> 새로운 데이터를 시트의 마지막 행에 추가합니다.</li>
            <li><strong>Get Values:</strong> 시트에 있는 데이터를 읽어와서 AI에게 전달합니다.</li>
          </ul>
        `
      }
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'Opal에서 워크플로우를 자동으로 생성하기 위해 사용하는 기능은 무엇인가요?',
          options: [
            'Create New → Describe what you want to build',
            'Manual Node Builder',
            'Template Library',
            'Code Editor'
          ],
          correctAnswer: 0,
          explanation: '"Describe what you want to build" 기능을 통해 원하는 워크플로우를 설명하면 자동으로 노드와 프롬프트가 생성됩니다.'
        }
      ]
    }
  };

  const totalDays = 10;
  const progressPercentage = (completedDaysCount / totalDays) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
      paddingBottom: '60px'
    }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        color: 'white',
        padding: '30px 20px',
        boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ArrowLeft size={20} />
            강의 목록으로
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              Day {lessonData.day}
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              ⏱️ {lessonData.duration}
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '800',
            marginBottom: '15px',
            lineHeight: '1.3'
          }}>
            {lessonData.title}
          </h1>

          <p style={{
            fontSize: '1.1rem',
            opacity: '0.95',
            marginBottom: '25px',
            lineHeight: '1.6'
          }}>
            {lessonData.description}
          </p>

          {/* 진행률 바 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>학습 진행률</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{Math.round(progressPercentage)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '10px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative' as const
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ffffff, #f0f9ff, #ffffff)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite',
                borderRadius: '10px',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px'
      }}>
        {/* 학습 목표 */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          border: '2px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0ea5e9',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Award size={24} />
            학습 목표
          </h2>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {lessonData.objectives.map((objective, index) => (
              <li key={index} style={{
                padding: '15px 20px',
                borderBottom: index < lessonData.objectives.length - 1 ? '1px solid #f1f5f9' : 'none',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '15px',
                fontSize: '1.05rem',
                color: '#1f2937',
                transition: 'all 0.3s ease',
                borderRadius: '8px'
              }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f0f9ff';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}>
                <span style={{
                  color: 'white',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.9rem'
                }}>{index + 1}</span>
                {objective}
              </li>
            ))}
          </ul>
        </div>

        {/* 워크플로우 로딩 문제 해결 알림 */}
        <div style={{
          background: '#fff7ed',
          border: '2px solid #fb923c',
          borderRadius: '15px',
          padding: '20px 25px',
          marginBottom: '30px',
          boxShadow: '0 2px 10px rgba(251, 146, 60, 0.15)'
        }}>
          <h3 style={{
            color: '#ea580c',
            fontSize: '1.2rem',
            fontWeight: '800',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ⚠️ 추가 알림!
          </h3>
          <p style={{
            color: '#9a3412',
            fontSize: '1rem',
            lineHeight: '1.7',
            margin: '0 0 12px 0'
          }}>
            <strong>워크플로우가 로딩되지 않는 경우</strong>, 이는 Google의 일시적인 오류입니다.
          </p>
          <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '15px',
            border: '1px solid #fed7aa'
          }}>
            <p style={{
              color: '#9a3412',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              margin: '0 0 8px 0',
              fontWeight: '600'
            }}>
              💡 해결 방법:
            </p>
            <p style={{
              color: '#9a3412',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              margin: 0
            }}>
              <code style={{
                background: '#fef3c7',
                padding: '4px 12px',
                borderRadius: '6px',
                fontWeight: '700',
                fontSize: '0.9rem',
                border: '1px solid #fbbf24'
              }}>
                Ctrl + Shift + R
              </code> (Windows/Linux) 또는{' '}
              <code style={{
                background: '#fef3c7',
                padding: '4px 12px',
                borderRadius: '6px',
                fontWeight: '700',
                fontSize: '0.9rem',
                border: '1px solid #fbbf24'
              }}>
                Cmd + Shift + R
              </code> (Mac)을 눌러서 <strong>캐시 새로고침</strong>을 하시면 해결됩니다!
            </p>
          </div>
        </div>

        {/* AI 에이전트 워크플로우 */}
        <div style={{
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)',
          position: 'relative' as const,
          overflow: 'hidden'
        }}>
          {/* 배경 패턴 */}
          <div style={{
            position: 'absolute' as const,
            top: 0,
            right: 0,
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)'
          }} />

          <div style={{
            position: 'relative' as const,
            zIndex: 1
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'white',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                🎬 Day 8 워크플로우
              </h2>
              <div style={{
                background: '#fbbf24',
                color: '#92400e',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '700',
                boxShadow: '0 2px 10px rgba(251, 191, 36, 0.3)'
              }}>
                🔥 실시간 업데이트
              </div>
            </div>

            <p style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '1rem',
              lineHeight: '1.7',
              marginBottom: '25px'
            }}>
              ConnexionAI가 지속 연구하며 업데이트하는 실전 워크플로우입니다. <br />
              영상과 다를 수 있습니다 — 더 나은 성능을 위해 계속 개선 중
            </p>

            {/* 오류 발생 시 안내 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '15px 20px',
              marginBottom: '20px',
              border: '1px dashed rgba(255, 255, 255, 0.4)'
            }}>
              <p style={{ 
                fontSize: '0.9rem', 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '10px',
                lineHeight: '1.5'
              }}>
                ⚠️ 워크플로우에서 오류가 날 경우, 아래 링크를 복사해서 새 탭에 직접 붙여넣기 하세요:
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '10px 15px'
              }}>
                <input
                  type="text"
                  readOnly
                  value="https://opal.google/?flow=drive:/1xejgcODqdDTygam6QjBvhcu5pAWHvi7Z&shared&mode=app"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://opal.google/?flow=drive:/1xejgcODqdDTygam6QjBvhcu5pAWHvi7Z&shared&mode=app');
                    alert('링크가 복사되었습니다! 새 탭에 붙여넣기 하세요.');
                  }}
                  style={{
                    background: '#fbbf24',
                    color: '#92400e',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 15px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  📋 복사
                </button>
              </div>
            </div>

            <a
              href="https://opal.google/?flow=drive:/1xejgcODqdDTygam6QjBvhcu5pAWHvi7Z&shared&mode=app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: '#fbbf24',
                color: '#92400e',
                padding: '16px 35px',
                borderRadius: '12px',
                fontSize: '1.15rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(251, 191, 36, 0.5)',
                transition: 'all 0.3s ease',
                border: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(251, 191, 36, 0.6)';
                e.currentTarget.style.background = '#fcd34d';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(251, 191, 36, 0.5)';
                e.currentTarget.style.background = '#fbbf24';
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>🚀</span>
              워크플로우 바로 가기
              <span style={{ fontSize: '1.3rem', fontWeight: '800' }}>→</span>
            </a>
          </div>
        </div>

        {/* 강의 섹션들 */}
        {lessonData.sections.map((section, index) => (
          <div key={section.id} style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            border: isDayCompleted ? '2px solid #10b981' : '2px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    background: section.type === 'theory' ? '#dbeafe' : '#dcfce7',
                    color: section.type === 'theory' ? '#1e40af' : '#166534',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '700'
                  }}>
                    {section.type === 'theory' ? '📚 이론' : '💻 실습'}
                  </div>
                  <span style={{
                    color: '#64748b',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    ⏱️ {section.duration}
                  </span>
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '0'
                }}>
                  {section.title}
                </h3>
              </div>
            </div>

            {/* 비디오 플레이어 */}
            <div style={{
              marginBottom: '25px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#000',
              aspectRatio: '16/9',
              position: 'relative' as const
            }}>
              {(() => {
                const isVimeo = (section as any).isVimeo || section.videoUrl.includes('vimeo.com');

                if (isVimeo) {
                  return (
                    <div style={{
                      marginBottom: '25px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                      paddingBottom: '56.25%',
                      height: 0
                    }}>
                      <iframe
                        src={section.videoUrl}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          borderRadius: '12px'
                        }}
                        title={section.title}
                      />
                    </div>
                  );
                }

                return null;
              })()}
            </div>

            {/* 강의 내용 */}
            <div
              style={{
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: '#374151'
              }}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        ))}

        {/* 퀴즈 섹션 */}
        <div style={{
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FileText size={28} />
            퀴즈
          </h2>
          {lessonData.quiz.questions.map((q, index) => {
            const isCorrect = quizAnswers[q.id] === q.correctAnswer;

            return (
              <div key={q.id} style={{
                marginBottom: '30px',
                paddingBottom: '30px',
                borderBottom: index < lessonData.quiz.questions.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <p style={{
                  fontWeight: '700',
                  marginBottom: '15px',
                  color: '#1f2937',
                  fontSize: '1.05rem'
                }}>
                  Q{index + 1}. {q.question}
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {q.options.map((option, optIndex) => {
                    const isSelected = quizAnswers[q.id] === optIndex;
                    const isCorrectOption = optIndex === q.correctAnswer;

                    let backgroundColor = 'white';
                    let borderColor = '#e5e7eb';

                    if (quizSubmitted && isSelected) {
                      backgroundColor = isCorrect ? '#ecfdf5' : '#fef2f2';
                      borderColor = isCorrect ? '#10b981' : '#ef4444';
                    } else if (quizSubmitted && isCorrectOption) {
                      backgroundColor = '#ecfdf5';
                      borderColor = '#10b981';
                    }

                    return (
                      <label key={optIndex} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        background: backgroundColor,
                        borderRadius: '8px',
                        cursor: quizSubmitted ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                        border: `1px solid ${borderColor}`,
                        position: 'relative' as const,
                        opacity: quizSubmitted && !isSelected && !isCorrectOption ? 0.5 : 1
                      }}
                        onMouseOver={(e) => {
                          if (!quizSubmitted) {
                            e.currentTarget.style.background = '#f9fafb';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!quizSubmitted) {
                            e.currentTarget.style.background = 'white';
                          }
                        }}>
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={optIndex}
                          checked={isSelected}
                          disabled={quizSubmitted}
                          onChange={() => {
                            setQuizAnswers({
                              ...quizAnswers,
                              [q.id]: optIndex
                            });
                          }}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: quizSubmitted ? 'default' : 'pointer',
                            accentColor: '#0ea5e9'
                          }}
                        />
                        <span style={{
                          fontSize: '1rem',
                          color: '#1f2937',
                          flex: 1,
                          fontWeight: quizSubmitted && isCorrectOption ? '600' : 'normal'
                        }}>{option}</span>
                        {quizSubmitted && isCorrectOption && (
                          <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <span style={{ color: '#ef4444', fontWeight: '700' }}>✗</span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <div style={{
                    marginTop: '15px',
                    padding: '15px',
                    background: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bae6fd'
                  }}>
                    <p style={{
                      margin: 0,
                      color: '#0369a1',
                      fontSize: '0.95rem',
                      lineHeight: '1.6'
                    }}>
                      <strong>💡 설명:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* 정답 보기 버튼 */}
          <div style={{ marginTop: '30px' }}>
            <button
              onClick={() => setQuizSubmitted(true)}
              disabled={quizSubmitted}
              style={{
                padding: '14px 32px',
                background: quizSubmitted
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: quizSubmitted
                  ? 'not-allowed'
                  : 'pointer',
                transition: 'all 0.2s ease',
                marginRight: '10px',
                boxShadow: quizSubmitted
                  ? '0 2px 8px rgba(16, 185, 129, 0.3)'
                  : '0 2px 8px rgba(14, 165, 233, 0.3)',
                opacity: quizSubmitted ? 0.7 : 1
              }}
            >
              {quizSubmitted
                ? `✓ ${lessonData.quiz.questions.filter((q, idx) => quizAnswers[q.id] === q.correctAnswer).length}/${lessonData.quiz.questions.length} 정답`
                : '정답 보기'}
            </button>

            {quizSubmitted && (
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                style={{
                  padding: '14px 32px',
                  background: 'white',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                다시 풀기
              </button>
            )}
          </div>
        </div>

        {/* Day 8 토론방 */}
        <DayDiscussion
          courseId="step2"
          dayNumber={8}
          communityPath="/community/step2"
          accentColor="#d4a439"
          userEmail={userEmail}
          userName={userName}
        />

        {/* 8강 완료 버튼 */}
        <div style={{
          background: isDayCompleted
            ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)'
            : 'linear-gradient(135deg, #eff6ff, #dbeafe)',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '30px',
          border: isDayCompleted ? '2px solid #10b981' : '2px solid #0ea5e9',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '700',
            color: isDayCompleted ? '#059669' : '#0284c7',
            marginBottom: '15px'
          }}>
            {isDayCompleted ? '✅ 8강 완료됨!' : '📚 8강 완료하기'}
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '20px',
            fontSize: '0.95rem'
          }}>
            {isDayCompleted
              ? '8강을 완료했습니다! 다음 강의로 이동하세요.'
              : '강의를 수강한 후 버튼을 눌러주세요.'}
          </p>

          {!isDayCompleted ? (
            <button
              onClick={handleCompleteDay}
              disabled={isCompletingDay}
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: isCompletingDay ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                opacity: isCompletingDay ? 0.6 : 1
              }}
              onMouseOver={(e) => {
                if (!isCompletingDay) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isCompletingDay) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)';
                }
              }}
            >
              {isCompletingDay ? '처리 중...' : '8강 완료하기 →'}
            </button>
          ) : (
            <button
              onClick={onNext || onBack}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              ✓ 완료! 9강으로 →
            </button>
          )}
        </div>
      </div>

      {/* CSS for content styling */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        h3 {
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 25px;
          margin-bottom: 15px;
        }
        
        ul, ol {
          margin: 15px 0;
          padding-left: 25px;
        }
        
        li {
          margin: 8px 0;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default Day8Page;
