import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Award, Lock } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day3PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day3Page: React.FC<Day3PageProps> = ({ onBack, onNext }) => {
  const [completedSections] = useState<Set<string>>(new Set());
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // 런칭 날짜 체크 (2025년 11월 15일 오후 9시)
  const launchDate = new Date('2025-11-15T21:00:00+09:00');
  const isLaunched = new Date() >= launchDate;

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

          if (progress && progress.completedDays.includes(3)) {
            setIsDayCompleted(true);
          }
        }
      } catch (error) {
        console.error('❌ 진행 상황 로드 실패:', error);
      }
    };

    loadUserProgress();
  }, []);

  // Day 3 완료 처리
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
        3,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 3 완료! 다음 강의로 이동하세요!');
      } else {
        alert('❌ Day 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ Day 완료 처리 오류:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 3,
    title: "GPT-5부터 o3까지 - Agent Builder에서 선택할 수 있는 AI 모델 총정리",
    duration: "약 50분",
    description: "LLM의 개념과 GPT 모델들의 차이점을 이해하고, 목적에 맞는 최적의 모델을 선택하여 가격 대비 성능을 최적화하는 전략을 배웁니다.",
    objectives: [
      "LLM(Large Language Model)의 기본 개념 이해하기",
      "GPT-5, GPT-4, o3 등 주요 모델의 차이점과 특징 파악하기",
      "비용 최적화 전략: 작업 특성에 맞는 모델 선택 방법 익히기"
    ],
    sections: [
      {
        id: 'theory-1',
        type: 'theory',
        title: '이론 강의: AI 모델 총정리 및 가격 최적화',
        duration: '약 25분',
        videoUrl: 'https://clathonstorage.blob.core.windows.net/video/agentbeginner_lecture/day3/day3lecture.mp4',
        content: `
          <h3>🤖 LLM(Large Language Model)이란?</h3>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 15px 0;">
            <p style="margin: 0; font-size: 1.05rem; line-height: 1.6;">
              대규모 텍스트 데이터로 학습된 인공지능 모델로, 인간의 언어를 이해하고 생성할 수 있습니다.
            </p>
          </div>
          
          <h3>📊 주요 GPT 모델 비교</h3>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0 0 10px 0; font-size: 1.05rem;">
              <strong>GPT-5 / GPT-4</strong>
            </p>
            <p style="margin: 0; font-size: 1rem; line-height: 1.6; color: #78350f;">
              • 고성능 모델: 복잡한 추론, 창의적 작업에 최적<br/>
              • 비용: 높음 (정확도와 품질 중요 시 사용)<br/>
              • 예시: 기획, 대본 작성, 정책 검토
            </p>
          </div>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0 0 10px 0; font-size: 1.05rem;">
              <strong>GPT-5 Mini / Nano</strong>
            </p>
            <p style="margin: 0; font-size: 1rem; line-height: 1.6; color: #065f46;">
              • 경량 모델: 단순 작업에 최적화<br/>
              • 비용: 낮음 (속도와 비용 중요 시 사용)<br/>
              • 예시: 웹 검색, 데이터 추출, 간단한 분류
            </p>
          </div>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 0 0 10px 0; font-size: 1.05rem;">
              <strong>o3 (오픈AI 최신 모델)</strong>
            </p>
            <p style="margin: 0; font-size: 1rem; line-height: 1.6; color: #991b1b;">
              • 최고 성능: 매우 복잡한 추론과 전문적 작업<br/>
              • 비용: 매우 높음 (필수적인 경우에만 사용)<br/>
              • 예시: 전문 분석, 고급 컨설팅 작업
            </p>
          </div>
          
          <h3>💰 가격 최적화 전략</h3>
          <p style="font-size: 1.05rem; line-height: 1.8;">
            <strong>1. 작업 특성 분석:</strong> 단순 작업 vs 복잡한 작업 구분<br/>
            <strong>2. 적절한 모델 선택:</strong> Mini/Nano로 충분한 경우 굳이 GPT-5 사용 금지<br/>
            <strong>3. 하이브리드 전략:</strong> 단순 작업은 Mini, 핵심 작업은 GPT-5 사용
          </p>
        `
      },
      {
        id: 'practice-1',
        type: 'practice',
        title: '실습: 모델별 응답 비교 실험',
        duration: '약 25분',
        videoUrl: 'https://clathonstorage.blob.core.windows.net/video/agentbeginner_lecture/day3/day3practice.mp4',
        content: `
          <h3>🔬 실전 실험: 같은 작업, 다른 모델</h3>
          
          <p style="font-size: 1.05rem; line-height: 1.8; color: #374151; margin-bottom: 20px;">
            동일한 작업을 GPT-5, Mini, o3로 각각 실행하여 성능과 비용을 비교하고, 최적의 모델 선택 전략을 익힙니다.
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #e2e8f0;">
            <h4 style="color: #1f2937; margin-bottom: 15px;">🧪 실험 시나리오</h4>
            <ol style="margin: 0; padding-left: 20px; line-height: 2;">
              <li><strong>단순 작업:</strong> 웹 검색 결과 요약 (Mini vs GPT-5)</li>
              <li><strong>창의적 작업:</strong> 마케팅 카피 작성 (GPT-5 vs o3)</li>
              <li><strong>복잡한 추론:</strong> 데이터 분석 및 인사이트 도출 (GPT-5 vs o3)</li>
            </ol>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-size: 1rem; color: #78350f;">
              <strong>💰 비용 vs 성능:</strong> 결과의 품질 차이가 크지 않다면 저렴한 모델을 사용하세요. 비용 절감의 핵심입니다!
            </p>
          </div>
          
          <div style="background: #ecfdf5; padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0; font-size: 1rem; color: #065f46;">
              <strong>✅ 실습 목표:</strong> 각 작업에 맞는 최적의 모델을 선택하는 "감"을 익히는 것이 핵심입니다!
            </p>
          </div>
        `
      }
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'LLM(Large Language Model)이란 무엇인가요?',
          options: [
            '대규모 텍스트 데이터로 학습된 인공지능 언어 모델',
            '작은 규모의 머신러닝 모델',
            '음성 인식 전용 모델',
            '이미지 생성 전용 모델'
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: '단순한 웹 검색이나 데이터 추출 작업에 가장 적합한 모델은?',
          options: [
            'GPT-5 (가장 강력하므로)',
            'o3 (최신 모델이므로)',
            'GPT-5 Mini/Nano (비용 효율적이므로)',
            '모든 모델이 동일함'
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: 'AI 모델 선택 시 가격 최적화 전략으로 올바른 것은?',
          options: [
            '항상 가장 강력한 모델(o3)을 사용한다',
            '항상 가장 저렴한 모델(Mini)만 사용한다',
            '작업 특성에 따라 적절한 모델을 선택하는 하이브리드 전략을 사용한다',
            '모델 선택은 중요하지 않다'
          ],
          correctAnswer: 2
        }
      ]
    },
    resources: [
      {
        title: '비용 최적화 가이드',
        url: 'https://www.aicitybuilders.com/cost-optimization-examples',
        type: 'guide'
      }
    ]
  };

  const progressPercentage = (completedSections.size / lessonData.sections.length) * 100;

  // 런칭 전이면 오버레이 표시
  if (!isLaunched) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '50px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            borderRadius: '50%',
            marginBottom: '30px',
            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
          }}>
            <Lock size={40} color="white" />
          </div>

          <h2 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '15px'
          }}>
            🚀 Day 3 준비 중
          </h2>

          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            이 강의는 <strong style={{ color: '#0ea5e9' }}>2025년 11월 15일 오후 9시</strong>에 오픈될 예정입니다.
          </p>

          <button
            onClick={onBack}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '1.1rem',
              fontWeight: '700',
              borderRadius: '10px',
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
            강의 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

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
                const isYouTube = section.videoUrl.includes('youtube.com') || section.videoUrl.includes('youtu.be');
                
                if (isYouTube) {
                  // 유튜브 링크 처리
                  return (
                    <iframe
                      width="100%"
                      height="100%"
                      src={section.videoUrl}
                      title={section.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        border: 'none',
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                    />
                  );
                } else {
                  // 일반 비디오 파일 처리
                  return (
                    <>
                      {loadingVideos.has(section.id) && (
                        <div style={{
                          position: 'absolute' as const,
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 10,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '15px'
                        }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '4px solid #0ea5e9',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          <span style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                          }}>
                            비디오 로딩 중...
                          </span>
                        </div>
                      )}
                      <video
                        width="100%"
                        height="100%"
                        controls
                        controlsList="nodownload"
                        preload="auto"
                        playsInline
                        onLoadStart={() => {
                          const newLoading = new Set(loadingVideos);
                          newLoading.add(section.id);
                          setLoadingVideos(newLoading);
                        }}
                        onCanPlay={() => {
                          const newLoading = new Set(loadingVideos);
                          newLoading.delete(section.id);
                          setLoadingVideos(newLoading);
                        }}
                        onError={(e) => {
                          const newLoading = new Set(loadingVideos);
                          newLoading.delete(section.id);
                          setLoadingVideos(newLoading);
                          console.error('Video error:', e);
                        }}
                        style={{ 
                          border: 'none',
                          display: 'block',
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          backgroundColor: '#000'
                        }}
                      >
                        {section.videoUrl.endsWith('.mov') ? (
                          <>
                            <source src={section.videoUrl} type="video/quicktime; codecs=hvc1" />
                            <source src={section.videoUrl} type="video/mp4" />
                          </>
                        ) : (
                          <>
                            <source src={section.videoUrl} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
                            <source src={section.videoUrl} type="video/mp4" />
                          </>
                        )}
                        <p style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
                          브라우저가 비디오를 지원하지 않습니다.<br/>
                          <a href={section.videoUrl} style={{ color: '#0ea5e9' }}>직접 다운로드하기</a>
                        </p>
                      </video>
                    </>
                  );
                }
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

        {/* Day 2 완료 버튼 */}
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
            {isDayCompleted ? '✅ Day 3 완료됨!' : '📚 Day 3 완료하기'}
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '20px',
            fontSize: '0.95rem'
          }}>
            {isDayCompleted 
              ? 'Day 3을 완료했습니다! 다음 강의로 이동하세요.' 
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
              {isCompletingDay ? '처리 중...' : 'Day 3 완료하기 →'}
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
              ✓ 완료! Day 4로 →
            </button>
          )}
        </div>

        {/* 추가 자료 */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          border: '2px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0ea5e9',
            marginBottom: '20px'
          }}>
            📚 추가 학습 자료
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {lessonData.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '18px',
                  background: 'linear-gradient(135deg, #f8fafc, #f0f9ff)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#1f2937',
                  transition: 'all 0.3s ease',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #e0f2fe, #dbeafe)';
                  e.currentTarget.style.borderColor = '#0ea5e9';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc, #f0f9ff)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={20} style={{ color: 'white' }} />
                </div>
                <span style={{ fontWeight: '600', fontSize: '0.95rem', flex: 1 }}>{resource.title}</span>
              </a>
            ))}
          </div>
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
        
        .warning-box {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 15px;
          margin: 20px 0;
          border-radius: 8px;
        }
        
        .success-box {
          background: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 15px;
          margin: 20px 0;
          border-radius: 8px;
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
        
        pre {
          background: #1f2937;
          color: #f8fafc;
          padding: 20px;
          border-radius: 10px;
          overflow-x: auto;
          margin: 20px 0;
        }
        
        code {
          font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
          font-size: 0.9rem;
        }
        
        a {
          color: #0ea5e9;
          text-decoration: underline;
        }
        
        a:hover {
          color: #0284c7;
        }
      `}</style>
    </div>
  );
};

export default Day3Page;

