import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Play, FileText, Clock } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day8PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day8Page: React.FC<Day8PageProps> = ({ onBack, onNext }) => {
  const [currentSection, setCurrentSection] = useState<'video' | 'quiz'>('video');
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // 강의 데이터
  const lessonData = {
    day: 8,
    title: '🤖 Opal의 숨겨진 비밀: 대화로 워크플로우 자동 생성 + 구글 스프레드시트 연동',
    description: 'Opal의 자동 워크플로우 생성 기능과 구글 스프레드시트 연동을 활용한 효율적인 콘텐츠 계획 수립 방법을 학습합니다.',
    videoUrl: 'https://player.vimeo.com/video/1140420306?badge=0&autopause=0&player_id=0&app_id=58479',
    duration: '12분 18초',
    objectives: [
      '대화형으로 워크플로우를 자동 생성하는 방법',
      '노드와 프롬프트를 한글로 자동 작성하기',
      '구글 스프레드시트에 콘텐츠 계획 자동 저장',
      '유튜브 콘텐츠 계획표 자동 생성 실습',
      '다양한 업무에 적용 가능한 자동화 전략'
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

  // 페이지 로드 시 완료 상태 확인
  useEffect(() => {
    checkCompletion();
  }, []);

  const checkCompletion = async () => {
    try {
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      if (!currentUserEmail) return;

      const progress = await AzureTableService.getCourseDayProgress(
        currentUserEmail,
        'chatgpt-agent-beginner'
      );

      if (progress && progress.completedDays.includes(8)) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('완료 상태 확인 실패:', error);
    }
  };

  const handleQuizSubmit = async () => {
    setShowResults(true);
    
    const allCorrect = lessonData.quiz.questions.every(
      (q) => quizAnswers[q.id] === q.correctAnswer
    );

    if (allCorrect && !isCompleted) {
      try {
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        if (currentUserEmail) {
          await AzureTableService.completeCourseDay(
            currentUserEmail,
            'chatgpt-agent-beginner',
            8,
            15
          );
          setIsCompleted(true);
          alert('🎉 Day 8을 완료했습니다!');
        }
      } catch (error) {
        console.error('완료 처리 실패:', error);
      }
    }

    if (allCorrect && onNext) {
      setTimeout(() => {
        onNext();
      }, 2000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* 헤더 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#6366f1',
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f0f9ff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            <ArrowLeft size={20} />
            강의 목록으로
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                Day {lessonData.day}
              </div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: '#1f2937',
                marginBottom: '15px',
                lineHeight: '1.3'
              }}>
                {lessonData.title}
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                {lessonData.description}
              </p>
              <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#6366f1" />
                  <span style={{ color: '#6b7280' }}>{lessonData.duration}</span>
                </div>
                {isCompleted && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#d1fae5',
                    padding: '8px 16px',
                    borderRadius: '20px'
                  }}>
                    <CheckCircle size={18} color="#059669" />
                    <span style={{ color: '#059669', fontWeight: '600' }}>완료</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 워크플로우 섹션 - 비디오 위로 이동 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FileText size={24} color="#6366f1" />
            📊 Day 8 워크플로우
          </h2>
          
          {/* 워크플로우 로딩 경고 메시지 */}
          <div style={{
            background: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <p style={{
              color: '#92400e',
              fontSize: '0.95rem',
              margin: 0,
              lineHeight: '1.6',
              fontWeight: '600'
            }}>
              ⚠️ <strong>워크플로우가 로딩되지 않는 경우:</strong><br/>
              1. 페이지를 새로고침(F5) 해주세요<br/>
              2. 브라우저 캐시를 삭제해주세요<br/>
              3. 시크릿 모드(Incognito)에서 시도해주세요
            </p>
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%',
            background: '#f3f4f6',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <iframe
              src="https://opal.google/_app/?flow=drive:/1agqR_Q_dO9Qe8PkooXlKq19f3QtF95Ux&shared&mode=app"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title="Day 8 Workflow"
              allow="clipboard-read; clipboard-write"
            />
          </div>
          <p style={{
            marginTop: '15px',
            fontSize: '0.9rem',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            💡 워크플로우를 직접 실행하고 수정해보세요!
          </p>
          <div style={{
            marginTop: '15px',
            textAlign: 'center'
          }}>
            <a
              href="https://opal.google/_app/?flow=drive:/1agqR_Q_dO9Qe8PkooXlKq19f3QtF95Ux&shared&mode=app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '12px 30px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              🚀 새 탭에서 워크플로우 열기
            </a>
          </div>
        </div>

        {/* 네비게이션 탭 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '10px',
          marginBottom: '30px',
          display: 'flex',
          gap: '10px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => setCurrentSection('video')}
            style={{
              flex: 1,
              padding: '15px',
              border: 'none',
              borderRadius: '12px',
              background: currentSection === 'video' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: currentSection === 'video' ? 'white' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Play size={20} />
            강의 영상
          </button>
          <button
            onClick={() => setCurrentSection('quiz')}
            style={{
              flex: 1,
              padding: '15px',
              border: 'none',
              borderRadius: '12px',
              background: currentSection === 'quiz' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: currentSection === 'quiz' ? 'white' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle size={20} />
            퀴즈
          </button>
        </div>

        {/* 컨텐츠 영역 */}
        {currentSection === 'video' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
          }}>
            {/* 비디오 플레이어 */}
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '12px',
              marginBottom: '30px'
            }}>
              <iframe 
                src={lessonData.videoUrl}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                referrerPolicy="strict-origin-when-cross-origin"
                title={lessonData.title}
              />
            </div>

            {/* 학습 목표 */}
            <div style={{ marginTop: '30px' }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '20px'
              }}>
                📚 학습 목표
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {lessonData.objectives.map((objective, index) => (
                  <li
                    key={index}
                    style={{
                      padding: '12px 0',
                      borderBottom: index < lessonData.objectives.length - 1 ? '1px solid #e5e7eb' : 'none',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <CheckCircle size={20} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#4b5563', lineHeight: '1.6' }}>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {currentSection === 'quiz' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '25px'
            }}>
              ✅ 학습 확인 퀴즈
            </h3>

            {lessonData.quiz.questions.map((question, qIndex) => (
              <div
                key={question.id}
                style={{
                  marginBottom: '30px',
                  padding: '25px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb'
                }}
              >
                <p style={{
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '20px',
                  fontSize: '1.1rem',
                  lineHeight: '1.6'
                }}>
                  {qIndex + 1}. {question.question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {question.options.map((option, oIndex) => {
                    const isSelected = quizAnswers[question.id] === oIndex;
                    const isCorrect = oIndex === question.correctAnswer;
                    const showResult = showResults;

                    return (
                      <button
                        key={oIndex}
                        onClick={() => {
                          if (!showResults) {
                            setQuizAnswers({ ...quizAnswers, [question.id]: oIndex });
                          }
                        }}
                        style={{
                          padding: '15px 20px',
                          border: `2px solid ${
                            showResult
                              ? isCorrect
                                ? '#10b981'
                                : isSelected
                                ? '#ef4444'
                                : '#e5e7eb'
                              : isSelected
                              ? '#6366f1'
                              : '#e5e7eb'
                          }`,
                          borderRadius: '10px',
                          background: showResult
                            ? isCorrect
                              ? '#d1fae5'
                              : isSelected
                              ? '#fee2e2'
                              : 'white'
                            : isSelected
                            ? '#eef2ff'
                            : 'white',
                          color: '#1f2937',
                          cursor: showResults ? 'default' : 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                          fontWeight: isSelected ? '600' : '400'
                        }}
                        disabled={showResults}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {showResults && (
                  <div
                    style={{
                      marginTop: '15px',
                      padding: '15px',
                      background: '#eff6ff',
                      borderRadius: '8px',
                      border: '1px solid #93c5fd'
                    }}
                  >
                    <p style={{
                      margin: 0,
                      color: '#1e40af',
                      fontSize: '0.95rem',
                      lineHeight: '1.6'
                    }}>
                      <strong>💡 설명:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {!showResults ? (
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length !== lessonData.quiz.questions.length}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: Object.keys(quizAnswers).length === lessonData.quiz.questions.length
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: Object.keys(quizAnswers).length === lessonData.quiz.questions.length
                    ? 'pointer'
                    : 'not-allowed',
                  transition: 'all 0.3s',
                  boxShadow: Object.keys(quizAnswers).length === lessonData.quiz.questions.length
                    ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                    : 'none'
                }}
                onMouseOver={(e) => {
                  if (Object.keys(quizAnswers).length === lessonData.quiz.questions.length) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = Object.keys(quizAnswers).length === lessonData.quiz.questions.length
                    ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                    : 'none';
                }}
              >
                제출하기
              </button>
            ) : (
              <div style={{
                padding: '20px',
                background: lessonData.quiz.questions.every((q) => quizAnswers[q.id] === q.correctAnswer)
                  ? '#d1fae5'
                  : '#fee2e2',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  color: lessonData.quiz.questions.every((q) => quizAnswers[q.id] === q.correctAnswer)
                    ? '#065f46'
                    : '#991b1b',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  {lessonData.quiz.questions.every((q) => quizAnswers[q.id] === q.correctAnswer)
                    ? '🎉 완벽합니다! 모든 문제를 맞추셨습니다!'
                    : '다시 한번 확인해보세요!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Day8Page;
