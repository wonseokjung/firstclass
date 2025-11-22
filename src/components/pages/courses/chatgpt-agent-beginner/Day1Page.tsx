import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, FileText, Award, SkipBack, SkipForward } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day1PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day1Page: React.FC<Day1PageProps> = ({ onBack, onNext }) => {
  const [completedSections] = useState<Set<string>>(new Set());
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [playbackRates, setPlaybackRates] = useState<{[key: string]: number}>({});
  const videoRefs = useRef<{[key: string]: HTMLVideoElement | null}>({});

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

  // 1강 완료 처리
  const handleCompleteDay = async () => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (isDayCompleted) {
      alert('이미 완료한 강의입니다!');
      return;
    }

    // 모든 영상 시청 여부는 사용자 판단에 맡김
    // 퀴즈도 선택사항으로 변경

    try {
      setIsCompletingDay(true);
      
      // 학습 시간 계산 (예: 60분)
      const learningTimeMinutes = 60;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'chatgpt-agent-beginner',
        1,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 1강 완료! 다음 강의로 이동하세요!');
      } else {
        console.error('❌ Day 완료 실패 - success: false');
        console.log('📧 현재 이메일:', userEmail);
        console.log('📚 강의 ID:', 'chatgpt-agent-beginner');
        alert('❌ Day 완료 처리에 실패했습니다.\n\n가능한 원인:\n1. 강의를 구매하지 않았거나\n2. Azure 연결 문제\n\n콘솔(F12)에서 자세한 로그를 확인해주세요.');
      }
    } catch (error) {
      console.error('❌ Day 완료 처리 오류:', error);
      alert(`오류가 발생했습니다.\n\n${error}\n\n콘솔(F12)에서 자세한 로그를 확인해주세요.`);
    } finally {
      setIsCompletingDay(false);
    }
  };

  // 비디오 컨트롤 함수들
  const handlePlaybackRateChange = (sectionId: string, rate: number) => {
    const video = videoRefs.current[sectionId];
    console.log('배속 변경:', sectionId, rate, 'video:', video);
    if (video) {
      video.playbackRate = rate;
      setPlaybackRates(prev => ({ ...prev, [sectionId]: rate }));
    } else {
      console.error('비디오 요소를 찾을 수 없습니다:', sectionId);
    }
  };

  const handleSkipBackward = (sectionId: string) => {
    const video = videoRefs.current[sectionId];
    console.log('10초 뒤로:', sectionId, 'video:', video);
    if (video) {
      video.currentTime = Math.max(0, video.currentTime - 10);
    } else {
      console.error('비디오 요소를 찾을 수 없습니다:', sectionId);
    }
  };

  const handleSkipForward = (sectionId: string) => {
    const video = videoRefs.current[sectionId];
    console.log('10초 앞으로:', sectionId, 'video:', video);
    if (video) {
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
    } else {
      console.error('비디오 요소를 찾을 수 없습니다:', sectionId);
    }
  };

  const lessonData = {
    day: 1,
    title: "내 첫 AI 친구: ChatGPT와 Agent의 차이",
    duration: "약 6분",
    description: "ChatGPT와 에이전트 빌더의 차이점을 이해하고, 워크플로우 자동화의 개념을 배워봅니다.",
    objectives: [
      "ChatGPT와 에이전트 빌더의 차이점 이해하기",
      "워크플로우 자동화 개념 배우기",
      "실습으로 에이전트 빌더 사용해보기"
    ],
    sections: [
      {
        id: 'warning-video',
        type: 'theory',
        title: '⚠️ 추가 영상: 중요 안내',
        duration: '필수 시청',
        videoUrl: 'https://player.vimeo.com/video/1139551525?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 20px; border-radius: 10px; margin: 15px 0; border: 2px solid #fbbf24;">
            <p style="margin: 0; font-size: 1.1rem; color: #92400e; font-weight: 700; line-height: 1.8;">
              ⚠️ 이 영상을 먼저 시청해주세요!<br/>
              강의 진행 전 반드시 알아야 할 중요한 내용입니다.
            </p>
          </div>
        `
      },
      {
        id: 'theory-1',
        type: 'theory',
        title: '이론 강의: ChatGPT와 Agent의 차이',
        duration: '6분',
        videoUrl: 'https://player.vimeo.com/video/1137353252?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <h3>💬 ChatGPT vs 🤖 에이전트 빌더</h3>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 15px 0;">
            <p style="margin: 0 0 10px 0; font-size: 1.05rem;">
              <strong>ChatGPT:</strong> 사람과 대화하는 AI
            </p>
            <p style="margin: 0; font-size: 1.05rem;">
              <strong>에이전트 빌더:</strong> 일을 자동화하는 워크플로우 기반 AI
            </p>
          </div>
          
          <h3>⚡ 핵심 차이</h3>
          <p><strong>워크플로우(일의 흐름)</strong>를 한 번 설정하면 여러 단계 작업이 자동 실행됩니다.</p>
          
          <p><strong>예시:</strong> "유튜브 콘텐츠 만들어줘" → 조사, 스크립트, 제목, 설명 자동 생성!</p>
        `
      },
      {
        id: 'practice-1',
        type: 'practice',
        title: '실습: 에이전트 빌더 시작하기',
        duration: '실습 시간',
        videoUrl: 'https://player.vimeo.com/video/1137355668?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <p style="font-size: 1.05rem; line-height: 1.8; color: #374151;">
            위의 실습 비디오를 보면서 에이전트 빌더로 첫 워크플로우를 만들어보세요!
          </p>
        `
      }
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'ChatGPT와 에이전트 빌더의 핵심적인 차이점은 무엇인가요?',
          options: [
            'ChatGPT는 대화형 AI이고, 에이전트 빌더는 워크플로우를 자동화하는 도구이다',
            'ChatGPT는 느리고, 에이전트 빌더는 빠르다',
            'ChatGPT는 한국어를 지원하지 않는다',
            'ChatGPT는 OpenAI 제품이 아니다'
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: '워크플로우(Work Flow)란 무엇을 의미하나요?',
          options: [
            '작업 속도',
            '작업 비용',
            '일의 흐름',
            '작업 완료 시간'
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: '에이전트 빌더의 장점으로 올바른 것은?',
          options: [
            '항상 무료로 사용할 수 있다',
            '코딩 지식이 필수이다',
            '한 번의 요청으로 여러 단계의 작업을 자동으로 실행할 수 있다',
            'ChatGPT보다 대화를 더 잘한다'
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
        {/* 💡 중요 안내: OpenAI API 정책 변경 */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          color: '#92400e',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(251, 191, 36, 0.2)',
          border: '2px solid #f59e0b'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '2rem'
            }}>
              💡
            </div>
            <h2 style={{
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: '700',
              margin: 0
            }}>
              중요 안내: OpenAI API 정책 변경
            </h2>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '12px',
            padding: '25px',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <p style={{
              fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)',
              lineHeight: '1.8',
              margin: '0 0 20px 0',
              fontWeight: '500',
              color: '#78350f'
            }}>
              OpenAI가 최근 <strong>API 사용 정책을 변경</strong>하여, 이전에는 가능했던 <strong>무료 Skip 옵션이 사라지고 처음부터 최소 $5(약 7,000원) 결제가 필수</strong>가 되었습니다.
            </p>
            
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              borderLeft: '4px solid #f59e0b',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                lineHeight: '1.8',
                margin: 0,
                fontWeight: '600',
                color: '#92400e'
              }}>
                💡 <strong>추천 드립니다:</strong> 1강 이론만 보시고, <strong style={{ fontSize: '1.1em', color: '#d97706' }}>2강부터 Google Opal(무료)</strong>로 학습을 시작하시는 것을 강력히 권장합니다!
              </p>
            </div>
            
            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
              lineHeight: '1.7',
              margin: 0,
              color: '#78350f'
            }}>
              Google Opal은 완전 무료이며, OpenAI보다 더 강력한 멀티모달 기능(영상/이미지/음악 생성)을 제공합니다.
            </p>
          </div>
        </div>

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
            {(() => {
              const isVimeo = (section as any).isVimeo || section.videoUrl.includes('vimeo.com');
              const isYouTube = section.videoUrl.includes('youtube.com') || section.videoUrl.includes('youtu.be');
              
              if (isVimeo) {
                // Vimeo 링크 처리
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
              
              // YouTube와 일반 비디오는 기존 컨테이너 사용
              return (
                <div style={{
                  marginBottom: '25px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#000',
                  aspectRatio: '16/9',
                  position: 'relative' as const
                }}>
                  {(() => {
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
                        ref={(el) => { videoRefs.current[section.id] = el; }}
                        width="100%"
                        height="100%"
                        controls
                        controlsList="nodownload noremoteplayback"
                        disablePictureInPicture
                        preload="metadata"
                        playsInline
                        onContextMenu={(e) => e.preventDefault()}
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
              );
            })()}

            {/* 커스텀 비디오 컨트롤 (Vimeo/YouTube가 아닌 경우만) */}
            {!((section as any).isVimeo || section.videoUrl.includes('vimeo.com') || section.videoUrl.includes('youtube.com') || section.videoUrl.includes('youtu.be')) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px 20px',
              background: '#f8fafc',
              borderRadius: '0 0 12px 12px',
              borderTop: '2px solid #e2e8f0',
              marginTop: '-4px'
            }}>
              {/* 10초 뒤로 */}
              <button
                onClick={() => handleSkipBackward(section.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#475569',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <SkipBack size={16} />
                10초
              </button>

              {/* 10초 앞으로 */}
              <button
                onClick={() => handleSkipForward(section.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#475569',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <SkipForward size={16} />
                10초
              </button>

              <div style={{
                width: '1px',
                height: '24px',
                background: '#e2e8f0',
                margin: '0 5px'
              }} />

              {/* 배속 조절 */}
              <span style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#64748b'
              }}>배속:</span>
              
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                <button
                  key={rate}
                  onClick={() => handlePlaybackRateChange(section.id, rate)}
                  style={{
                    padding: '6px 12px',
                    background: (playbackRates[section.id] || 1) === rate 
                      ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' 
                      : 'white',
                    color: (playbackRates[section.id] || 1) === rate ? 'white' : '#475569',
                    border: '1px solid',
                    borderColor: (playbackRates[section.id] || 1) === rate ? '#0ea5e9' : '#e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if ((playbackRates[section.id] || 1) !== rate) {
                      e.currentTarget.style.background = '#f1f5f9';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }
                  }}
                  onMouseOut={(e) => {
                    if ((playbackRates[section.id] || 1) !== rate) {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>
            )}

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
                ? `✓ ${Object.values(quizAnswers).filter((ans, idx) => ans === lessonData.quiz.questions[idx].correctAnswer).length}/${lessonData.quiz.questions.length} 정답` 
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

        {/* 1강 완료 버튼 */}
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
            {isDayCompleted ? '✅ 1강 완료됨!' : '📚 1강 완료하기'}
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '20px',
            fontSize: '0.95rem'
          }}>
            {isDayCompleted 
              ? '1강을 완료했습니다! 다음 강의로 이동하세요.' 
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
              {isCompletingDay ? '처리 중...' : '1강 완료하기 →'}
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
              ✓ 완료! 2강으로 →
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

export default Day1Page;

