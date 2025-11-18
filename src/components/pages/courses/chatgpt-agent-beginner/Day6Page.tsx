import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Award, Lock } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day6PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day6Page: React.FC<Day6PageProps> = ({ onBack, onNext }) => {
  const [completedSections] = useState<Set<string>>(new Set());
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
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

  // 6강 완료 처리
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
        6,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 6강 완료! 다음 강의로 이동하세요!');
      } else {
        alert('❌ 6강 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 6강 완료 처리 오류:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 6,
    title: "시니어 타겟 유튜브 콘텐츠 자동 제작",
    duration: "",
    description: "AI 에이전트를 활용하여 시니어(고연령층)를 대상으로 한 유튜브 수익화 콘텐츠를 자동으로 생성하는 방법을 배웁니다. 25개의 멀티 에이전트 시스템으로 아이디어 구상부터 최종 콘텐츠 자산(이미지, 음성, 텍스트)까지 제작하는 전 과정을 실습합니다.",
    objectives: [
      "시니어 시장의 잠재력과 콘텐츠 소비 특성 이해하기",
      "멀티 에이전트 시스템의 워크플로우 구조 파악하기",
      "리서치 → 기획 → 생성 → 가공의 자동화 프로세스 구축하기",
      "AI 에이전트 훈련 및 문제 해결 방법 익히기",
      "나만의 AI 자산으로 수익화 시스템 만들기"
    ],
    sections: [
      {
        id: 'intro',
        title: '📌 6강 개요',
        type: 'text' as const,
        content: `이번 강의에서는 AI 에이전트를 활용하여 시니어(고연령층)를 대상으로 한 유튜브 수익화 콘텐츠를 자동으로 생성하는 방법을 배웁니다.

25개의 멀티 에이전트가 협력하여 아이디어 구상부터 최종 콘텐츠 제작까지 자동화하는 실전 시스템을 구축합니다.`
      },
      {
        id: 'video-1',
        title: '🎬 6강 강의 영상: 시니어 타겟 유튜브 콘텐츠 자동 제작',
        type: 'video' as const,
        content: '',
        videoUrl: 'https://player.vimeo.com/video/1138156565?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true
      },
      {
        id: 'section-1',
        title: '1️⃣ 왜 시니어를 타겟으로 하는가?',
        type: 'text' as const,
        content: `🎯 **시장 잠재력**
시니어 인구는 계속 증가하고 있으며 구매력도 갖추고 있습니다. 반면 젊은 층 인구는 감소 추세이므로 시니어 시장은 점차 커질 것입니다.

📱 **변화된 콘텐츠 소비 습관**
현대의 시니어들은 단순히 TV를 시청하는 것을 넘어, AI와 같은 새로운 기술을 배우고 도전하는 등 적극적으로 콘텐츠를 소비합니다.

🎧 **선호 콘텐츠 유형**
빠르고 자극적인 영상(쇼츠 등)보다는, 정보와 지식을 제공하는 느린 호흡의 콘텐츠를 선호합니다. 특히 영상미보다는 '소리(오디오)'에 집중하는 경향이 큽니다.`
      },
      {
        id: 'section-2',
        title: '2️⃣ 시니어 콘텐츠 제작 AI 에이전트 시스템 구조',
        type: 'text' as const,
        content: `🔹 **입력 (Input)**
사용자는 4가지 핵심 정보를 입력합니다:
① 타겟 (시니어)
② 주제 (예: 건강, 재테크, 취미)
③ 목적 (정보 제공, 제품 소개 등)
④ 언어 (한국어, 영어 등)

🔹 **1단계: 리서치 에이전트**
입력된 정보를 바탕으로 웹 검색 도구를 사용해 현재 시니어들의 관심사, 트렌드, 인기 제품 등을 실시간으로 분석하고 리서치합니다.

🔹 **2단계: 콘텐츠 기획 및 생성 에이전트**
• **장면(Scene) 생성 에이전트 (총 5개)**: 리서치 결과를 바탕으로 영상의 스토리를 5개의 장면으로 나누어 순차적으로 시나리오를 생성합니다. 각 장면 에이전트는 이전 장면의 내용을 이어받아 이야기의 연속성을 유지합니다.
• **썸네일/SEO 에이전트**: 리서치 내용을 기반으로 유튜브 썸네일 이미지, 제목, 설명, 태그를 생성합니다.

🔹 **3단계: 콘텐츠 가공 및 제작 에이전트**
• **대본 정제 에이전트**: 장면 시나리오에서 'MC:', '#장면1' 등 불필요한 지시문을 제거하고, 오직 음성으로 변환될 대사(나레이션)만 추출합니다.
• **음성 생성(TTS) 에이전트**: 정제된 대본을 받아 구글의 'Audio LM' 모델을 통해 자연스러운 음성 파일로 변환합니다.
• **이미지 생성 에이전트**: 각 장면 시나리오에 맞는 이미지를 생성합니다.

🔹 **출력 (Output)**
최종적으로 썸네일, 제목, 설명, 태그, 그리고 각 장면에 맞는 이미지와 음성 파일이 한 번에 생성되어 다운로드할 수 있게 됩니다.`
      },
      {
        id: 'section-3',
        title: '3️⃣ 실전 문제 해결 (Troubleshooting)',
        type: 'text' as const,
        content: `⚠️ **발생할 수 있는 문제들**
• 이미지 생성기에 텍스트가 섞여 나옴
• 음성 파일에 'MC:'와 같은 불필요한 단어가 포함됨
• 이미지 비율이 맞지 않음

🔧 **원인 분석**
**이미지 문제:**
① 이미지 생성 프롬프트에 텍스트를 제외하라는 명령이 없었음
② 장면 시나리오 전체가 이미지 생성 프롬프트로 들어가면서 불필요한 텍스트가 생성됨
③ 이미지 비율 설정이 1:1로 되어 있었음

**음성 문제:**
대본 정제 에이전트가 인물 이름까지는 제거하지 못했음

✅ **해결 방법**
**이미지 해결:**
• 장면 생성 에이전트와 이미지 생성 에이전트 사이에 '이미지 프롬프트 변환 에이전트'를 추가
• 프롬프트에 '텍스트 생성 금지(no text generation)' 명령 추가
• 이미지 비율을 16:9로 변경

**음성 해결:**
• 대본 정제 에이전트에게 '인물 이름도 모두 제거하라'는 구체적인 지시 추가`
      },
      {
        id: 'section-4',
        title: '4️⃣ 핵심 철학 및 실행 전략',
        type: 'text' as const,
        content: `💡 **AI 에이전트는 '훈련시키는 직원'**
처음부터 완벽한 결과물을 만들지 못하므로, 원하는 결과가 나올 때까지 지시를 수정하고 에이전트를 개선하는 과정이 필수적입니다.

🎯 **자동화의 진정한 목표**
단순히 작업을 자동화하는 것을 넘어, 자신의 아이디어와 전략을 시스템에 녹여내어 인건비와 시간을 줄이고 순수익을 극대화하는 것이 목표입니다.

🏆 **'나만의 AI 자산' 구축**
이 과정을 통해 만들어진 고유한 워크플로우는 다른 사람이 복제할 수 없는 자신만의 강력한 'AI 자산'이 됩니다.

🔄 **실행과 개선의 반복**
'만들기 → 게시 → 반응 확인 → 수정'의 순환 과정을 꾸준히 반복하며 시스템을 고도화하고 자신만의 인사이트를 쌓는 것이 중요합니다.`
      },
      {
        id: 'homework',
        title: '📝 오늘의 과제',
        type: 'text' as const,
        content: `🎯 **실습 과제**
영상을 참고하여 직접 시니어 타겟 콘텐츠를 만드는 '장면 1개'짜리 기본 워크플로우를 구축해보세요!

**구축해야 할 것:**
1. 타겟, 주제, 목적, 언어를 입력받는 입력 시스템
2. 리서치 에이전트 (웹 검색 기능 포함)
3. 장면 1개 생성 에이전트
4. 대본 정제 에이전트
5. 음성 생성 에이전트
6. 이미지 생성 에이전트

**목표:**
간단한 1장면짜리 콘텐츠를 완전 자동으로 생성하는 시스템을 만들어보세요!`
      }
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: "시니어 타겟 콘텐츠에서 가장 중요한 요소는 무엇인가요?",
          options: [
            "빠르고 자극적인 영상미",
            "정보와 지식을 제공하는 느린 호흡과 좋은 오디오",
            "화려한 편집과 이펙트",
            "젊은층을 위한 유행어 사용"
          ],
          correctAnswer: 1,
          explanation: "시니어들은 빠르고 자극적인 영상보다 정보와 지식을 제공하는 느린 호흡의 콘텐츠를 선호하며, 특히 영상미보다 '소리(오디오)'에 집중하는 경향이 큽니다."
        },
        {
          id: 2,
          question: "멀티 에이전트 시스템에서 '리서치 에이전트'의 역할은 무엇인가요?",
          options: [
            "이미지를 생성하는 역할",
            "음성 파일을 만드는 역할",
            "웹 검색을 통해 시니어들의 관심사와 트렌드를 실시간 분석하는 역할",
            "썸네일을 제작하는 역할"
          ],
          correctAnswer: 2,
          explanation: "리서치 에이전트는 입력된 정보를 바탕으로 웹 검색 도구를 사용해 현재 시니어들의 관심사, 트렌드, 인기 제품 등을 실시간으로 분석하고 리서치합니다."
        },
        {
          id: 3,
          question: "이미지 생성 시 텍스트가 섞여 나오는 문제를 해결하는 방법이 아닌 것은?",
          options: [
            "이미지 프롬프트 변환 에이전트를 추가하여 시나리오를 키워드로 변환",
            "프롬프트에 '텍스트 생성 금지(no text generation)' 명령 추가",
            "이미지 생성 모델을 더 강력한 것으로 변경하기만 하면 됨",
            "장면 시나리오 전체가 아닌 최적화된 프롬프트만 전달"
          ],
          correctAnswer: 2,
          explanation: "모델을 변경하는 것만으로는 문제가 해결되지 않습니다. 프롬프트 변환 에이전트 추가, 텍스트 생성 금지 명령, 최적화된 프롬프트 전달 등의 구체적인 해결책이 필요합니다."
        },
        {
          id: 4,
          question: "AI 에이전트를 어떻게 이해해야 하나요?",
          options: [
            "완벽하게 작동하는 자동화 도구",
            "한 번 설정하면 끝나는 시스템",
            "훈련시키는 직원처럼 지속적으로 개선해야 하는 대상",
            "복잡할수록 좋은 시스템"
          ],
          correctAnswer: 2,
          explanation: "AI 에이전트는 '훈련시키는 직원'과 같습니다. 처음부터 완벽한 결과물을 만들지 못하므로, 원하는 결과가 나올 때까지 지시를 수정하고 에이전트를 개선하는 과정이 필수적입니다."
        },
        {
          id: 5,
          question: "'나만의 AI 자산'이란 무엇을 의미하나요?",
          options: [
            "AI 도구를 많이 구매하는 것",
            "자신의 아이디어와 전략이 녹아있는 고유한 워크플로우",
            "AI 회사의 주식을 보유하는 것",
            "AI 관련 자격증을 취득하는 것"
          ],
          correctAnswer: 1,
          explanation: "나만의 AI 자산은 자신의 아이디어와 전략을 시스템에 녹여내어 만든 고유한 워크플로우를 의미합니다. 이는 다른 사람이 복제할 수 없는 강력한 자산이 됩니다."
        }
      ]
    }
  };

  const handleVideoLoad = (sectionId: string) => {
    setLoadingVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      return newSet;
    });
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const allCorrect = lessonData.quiz.questions.every(
      (q) => quizAnswers[q.id] === q.correctAnswer
    );
    
    if (allCorrect) {
      alert('🎉 모든 문제를 맞히셨습니다!');
    }
  };

  const allQuestionsAnswered = lessonData.quiz.questions.every(
    (q) => quizAnswers[q.id] !== undefined
  );

  const renderSection = (section: typeof lessonData.sections[0]) => {
    const isCompleted = completedSections.has(section.id);
    const isLoading = loadingVideos.has(section.id);

    return (
      <div
        key={section.id}
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '25px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          border: isCompleted ? '3px solid #10b981' : '1px solid #e5e7eb'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={24} color="#0ea5e9" />
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              {section.title}
            </h3>
          </div>
          {isCompleted && (
            <Award size={28} color="#10b981" />
          )}
        </div>

        {section.type === 'video' && section.videoUrl && (
          <div style={{ 
            marginTop: '20px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            {isLoading && (
              <div style={{
                padding: '100px',
                textAlign: 'center',
                background: '#f3f4f6'
              }}>
                <div style={{
                  display: 'inline-block',
                  width: '50px',
                  height: '50px',
                  border: '5px solid #e5e7eb',
                  borderTopColor: '#0ea5e9',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '20px', color: '#6b7280' }}>영상 로딩 중...</p>
              </div>
            )}
            {section.isVimeo ? (
              <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                <iframe 
                  src={section.videoUrl}
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                  title={section.title}
                  onLoad={() => handleVideoLoad(section.id)}
                />
              </div>
            ) : (
              <video
                controls
                style={{
                  width: '100%',
                  borderRadius: '12px'
                }}
                onLoadedData={() => handleVideoLoad(section.id)}
              >
                <source src={section.videoUrl} type="video/mp4" />
                브라우저가 비디오 태그를 지원하지 않습니다.
              </video>
            )}
          </div>
        )}

        {section.type === 'text' && section.content && (
          <div style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: '#374151',
            whiteSpace: 'pre-line'
          }}>
            {section.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      padding: '40px 20px'
    }}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* 헤더 */}
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '30px',
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

        {/* 강의 제목 카드 */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '700',
            marginBottom: '20px'
          }}>
            6강
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '15px',
            lineHeight: '1.3'
          }}>
            {lessonData.title}
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: '#6b7280',
            lineHeight: '1.8',
            marginBottom: '25px'
          }}>
            {lessonData.description}
          </p>

          <div style={{
            background: '#f0f9ff',
            borderLeft: '4px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '25px'
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#0c4a6e',
              marginBottom: '15px'
            }}>
              📚 학습 목표
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#0c4a6e'
            }}>
              {lessonData.objectives.map((obj, idx) => (
                <li key={idx} style={{
                  marginBottom: '10px',
                  fontSize: '1rem',
                  lineHeight: '1.6'
                }}>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 강의 섹션들 */}
        {lessonData.sections.map(section => renderSection(section))}

        {/* 퀴즈 섹션 */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '25px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📝 확인 퀴즈
          </h3>

          {lessonData.quiz.questions.map((question, qIndex) => (
            <div key={question.id} style={{ marginBottom: '30px' }}>
              <p style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '15px'
              }}>
                Q{qIndex + 1}. {question.question}
              </p>

              {question.options.map((option, oIndex) => {
                const isSelected = quizAnswers[question.id] === oIndex;
                const isCorrect = oIndex === question.correctAnswer;
                const showResult = quizSubmitted && isSelected;

                return (
                  <label
                    key={oIndex}
                    style={{
                      display: 'block',
                      padding: '15px',
                      marginBottom: '10px',
                      borderRadius: '10px',
                      border: `2px solid ${
                        showResult
                          ? isCorrect
                            ? '#10b981'
                            : '#ef4444'
                          : isSelected
                          ? '#0ea5e9'
                          : '#e5e7eb'
                      }`,
                      background: showResult
                        ? isCorrect
                          ? '#d1fae5'
                          : '#fee2e2'
                        : isSelected
                        ? '#e0f2fe'
                        : 'white',
                      cursor: quizSubmitted ? 'default' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={oIndex}
                      checked={isSelected}
                      onChange={() => {
                        if (!quizSubmitted) {
                          setQuizAnswers({
                            ...quizAnswers,
                            [question.id]: oIndex
                          });
                        }
                      }}
                      disabled={quizSubmitted}
                      style={{ marginRight: '10px' }}
                    />
                    {option}
                    {showResult && (
                      <span style={{ marginLeft: '10px' }}>
                        {isCorrect ? '✅' : '❌'}
                      </span>
                    )}
                  </label>
                );
              })}

              {quizSubmitted && quizAnswers[question.id] !== undefined && (
                <div style={{
                  marginTop: '15px',
                  padding: '15px',
                  background: '#f0f9ff',
                  borderRadius: '8px',
                  borderLeft: '4px solid #0ea5e9'
                }}>
                  <p style={{
                    margin: 0,
                    color: '#0c4a6e',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }}>
                    <strong>해설:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}

          {!quizSubmitted && (
            <button
              onClick={handleQuizSubmit}
              disabled={!allQuestionsAnswered}
              style={{
                width: '100%',
                background: allQuestionsAnswered
                  ? 'linear-gradient(135deg, #0ea5e9, #0284c7)'
                  : '#d1d5db',
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: allQuestionsAnswered ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease'
              }}
            >
              제출하기
            </button>
          )}
        </div>

        {/* Day 완료 버튼 */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '25px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            {isDayCompleted ? '✅ 6강 완료됨!' : '📚 6강 완료하기'}
          </h3>

          {!isDayCompleted && (
            <button
              onClick={handleCompleteDay}
              disabled={isCompletingDay}
              style={{
                width: '100%',
                background: isCompletingDay
                  ? '#d1d5db'
                  : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '18px',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: isCompletingDay ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
              onMouseOver={(e) => {
                if (!isCompletingDay) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isCompletingDay) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                }
              }}
            >
              {isCompletingDay ? '처리 중...' : '6강 완료하기 →'}
            </button>
          )}

          {isDayCompleted && onNext && (
            <button
              onClick={onNext}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                border: 'none',
                padding: '18px',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.3)';
              }}
            >
              ✓ 완료! 7강으로 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day6Page;
