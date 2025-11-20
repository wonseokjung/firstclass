import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Award } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day6PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day6Page: React.FC<Day6PageProps> = ({ onBack, onNext }) => {
  const [completedSections] = useState<Set<string>>(new Set());
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
    description: "25개의 멀티 에이전트로 시니어 타겟 유튜브 콘텐츠를 자동 생성합니다. 아이디어부터 이미지, 음성, 텍스트까지 완전 자동화된 워크플로우를 구축합니다.",
    objectives: [
      "시니어 시장의 특성과 콘텐츠 선호도 이해하기",
      "25개 멀티 에이전트 시스템 구조 파악하기",
      "AI 에이전트 훈련 및 문제 해결 방법 실습하기"
    ],
    sections: [
      {
        id: 'theory-1',
        type: 'theory',
        title: '시니어 타겟 유튜브 콘텐츠 자동 제작 (이론 + 실습)',
        duration: '',
        videoUrl: 'https://player.vimeo.com/video/1138156565?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <h3>1. 왜 시니어를 타겟으로 하는가?</h3>
          
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            🎯 <strong>시장 잠재력:</strong> 시니어 인구는 계속 증가 + 구매력 보유. 젊은층은 감소 추세.<br/>
            📱 <strong>콘텐츠 소비:</strong> AI 등 새 기술 적극 학습, 정보와 지식 콘텐츠 선호.<br/>
            🎧 <strong>핵심 포인트:</strong> 영상미보다 '소리(오디오)'에 집중하는 경향.
          </p>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>2. 시니어 콘텐츠 제작 AI 에이전트 시스템 해부</h3>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            25개의 AI 에이전트가 유기적으로 협력하여 콘텐츠를 제작하는 워크플로우입니다.
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0; width: 30%;">단계</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">설명</th>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>입력 (Input)</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">① 타겟 (시니어) ② 주제 (건강, 재테크, 취미 등) ③ 목적 (정보 제공, 제품 소개) ④ 언어 (한국어, 영어 등)</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>리서치 에이전트</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">웹 검색을 통해 현재 시니어들의 관심사, 트렌드, 인기 제품 등을 실시간 분석</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>장면 생성 에이전트 (5개)</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">영상 스토리를 5개 장면으로 나누어 순차적 시나리오 생성. 각 에이전트는 이전 장면을 이어받아 연속성 유지</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>썸네일/SEO 에이전트</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">유튜브 썸네일, 제목, 설명, 태그 자동 생성</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>대본 정제 에이전트</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">'MC:', '#장면1' 등 불필요한 지시문 제거, 음성 변환용 순수 대사만 추출</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>음성 생성 (TTS) 에이전트</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">구글 Audio LM 모델로 자연스러운 음성 파일 변환</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>이미지 생성 에이전트</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">각 장면 시나리오에 맞는 이미지 생성 (Imagen 4, Nanobanana 모델)</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>출력 (Output)</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">썸네일, 제목, 설명, 태그, 장면별 이미지와 음성 파일 일괄 다운로드</td>
            </tr>
          </table>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>3. 문제 해결 (Troubleshooting)</h3>
          
          <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="color: #78350f; margin: 0; font-size: 1.05rem; line-height: 1.8;">
              <strong>⚠️ 발생 문제:</strong> 이미지에 텍스트 섞임, 음성에 'MC:' 포함, 비율 불일치 (1:1 → 16:9)
            </p>
          </div>
          
          <div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="color: #15803d; margin: 0; font-size: 1.05rem; line-height: 1.8;">
              <strong>✅ 해결:</strong> 이미지 프롬프트 변환 에이전트 추가 + 'no text generation' 명령 + 16:9 비율 설정 + 대본 정제 강화
            </p>
          </div>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>4. 핵심 철학</h3>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #0c4a6e; margin: 0;">
              💡 <strong>AI 에이전트 = 훈련시키는 직원</strong><br/>
              🎯 <strong>목표:</strong> 인건비·시간 절감 + 순수익 극대화<br/>
              🏆 <strong>결과:</strong> 복제 불가능한 나만의 AI 자산<br/>
              🔄 <strong>방법:</strong> 만들기 → 게시 → 개선 반복
            </p>
          </div>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>5. 오늘의 과제</h3>
          
          <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #78350f; margin: 0;">
              <strong>🎯 과제:</strong> 장면 1개짜리 시니어 콘텐츠 생성 워크플로우 구축<br/>
              <strong>📌 구성:</strong> 입력(타겟/주제/목적/언어) → 리서치 → 장면 생성 → 대본 정제 → 음성·이미지 생성
            </p>
          </div>
        `
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
          correctAnswer: 1
        },
        {
          id: 2,
          question: "AI 에이전트를 어떻게 이해해야 하나요?",
          options: [
            "완벽하게 작동하는 자동화 도구",
            "한 번 설정하면 끝나는 시스템",
            "훈련시키는 직원처럼 지속적으로 개선해야 하는 대상",
            "복잡할수록 좋은 시스템"
          ],
          correctAnswer: 2
        }
      ]
    }
  };

  const progressPercentage = (completedSections.size / lessonData.sections.length) * 100;

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
              6강
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

        {/* 강의 섹션들 */}
        {lessonData.sections.map((section, index) => (
          <div key={section.id} style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            border: completedSections.has(section.id) ? '2px solid #10b981' : '2px solid #e2e8f0'
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

        {/* 워크플로우 다이어그램 */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb'
        }}>
          {/* 헤더 */}
          <div style={{
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '15px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                🎬 실전 워크플로우 다이어그램
              </h2>
              <div style={{
                display: 'inline-block',
                background: '#dc2626',
                color: 'white',
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                🔥 지속 업데이트
              </div>
            </div>
            <p style={{
              fontSize: '0.95rem',
              lineHeight: '1.6',
              color: '#6b7280',
              margin: 0
            }}>
              시니어 타겟 콘텐츠 제작 AI 에이전트 완성본 — ConnexionAI의 최신 업데이트가 자동 반영됩니다
            </p>
          </div>

          {/* 워크플로우 이미지 */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '15px',
            border: '1px solid #e5e7eb'
          }}>
            <img 
              src="/images/day5/day6.png" 
              alt="시니어 타겟 AI 에이전트 워크플로우 다이어그램"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                display: 'block'
              }}
            />
          </div>
        </div>

        {/* AI 에이전트 시니어 콘텐츠 워크플로우 */}
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
                🎬 시니어 수익화 콘텐츠 에이전트
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
              ConnexionAI가 지속 연구하며 업데이트하는 실전 워크플로우입니다. <br/>
              영상과 다를 수 있습니다 — 더 나은 성능을 위해 계속 개선 중
            </p>

            <a
              href="https://opal.google/?flow=drive:/1DXxgg6JbIKyWmT9dvdRd0MitDwOsJZaO&shared&mode=app"
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

        {/* 6강 완료 버튼 */}
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
            {isDayCompleted ? '✅ 6강 완료됨!' : '📚 6강 완료하기'}
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '20px',
            fontSize: '0.95rem'
          }}>
            {isDayCompleted 
              ? '6강을 완료했습니다! 다음 강의로 이동하세요.' 
              : '강의를 수강한 후 버튼을 눌러주세요.'}
          </p>
          
          {/* 7강 업데이트 안내 */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            border: '2px solid #fbbf24'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📢</span>
              <h4 style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                color: '#92400e',
                margin: 0
              }}>
                7강 특별 업데이트 안내
              </h4>
            </div>
            <p style={{
              fontSize: '1rem',
              color: '#78350f',
              lineHeight: '1.7',
              margin: 0
            }}>
              <strong>🔥 유튜브 추천 알고리즘 공식 논문</strong>을 활용한 새로운 콘텐츠로 업그레이드 중입니다!<br/>
              <br/>
              <strong style={{ color: '#92400e' }}>7강: 알고리즘 해킹 에이전트</strong><br/>
              • 유튜브 추천 시스템 논문 AI 학습<br/>
              • 논문 기반 바이럴 영상 자동 생성<br/>
              • 알고리즘 친화적 콘텐츠 최적화<br/>
              <br/>
              더 강력한 내용으로 재촬영 후 곧 공개 예정입니다! 🚀
            </p>
          </div>

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
              {isCompletingDay ? '처리 중...' : '6강 완료하기 →'}
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
              ✓ 완료! 7강으로 →
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

export default Day6Page;
