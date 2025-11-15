import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Award, Lock } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day2PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day2Page: React.FC<Day2PageProps> = ({ onBack, onNext }) => {
  const [completedSections] = useState<Set<string>>(new Set());
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // 런칭 날짜 체크 (2025년 11월 15일 오후 6시)
  const launchDate = new Date('2025-11-15T18:00:00+09:00');
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

  // Day 2 완료 처리
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
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 2,
    title: "Work Flow Design 기초 - 나의 일을 AI가 이해할 수 있게 쪼개기",
    duration: "약 50분",
    description: "워크플로 디자인의 핵심 원리(분해와 순서화)를 배우고, 4개의 에이전트를 연결하여 유튜브 콘텐츠를 자동 생성하는 멀티 에이전트 시스템을 구축합니다.",
    objectives: [
      "워크플로 디자인의 핵심 원리 이해하기: 디컴포지션(분해)과 시퀀싱(순서화)",
      "복잡한 업무를 작은 태스크 유닛으로 쪼개는 방법 익히기",
      "4개의 전문 에이전트를 연결하여 유튜브 콘텐츠 자동 생성 시스템 만들기"
    ],
    sections: [
      {
        id: 'theory-1',
        type: 'theory',
        title: '이론 강의: Work Flow Design 기초',
        duration: '약 20분',
        videoUrl: 'https://clathonstorage.blob.core.windows.net/video/agentbeginner_lecture/day2/day2lecture.mp4?sp=r&st=2025-11-15T08:50:44Z&se=2030-11-15T17:05:44Z&sv=2024-11-04&sr=b&sig=cNo1GfbTNGusgojd3M39X%2FT%2F5bm%2BTztL2%2B%2BWzDyyBQc%3D',
        content: `
          <h3>🎯 AI 에이전트 제작의 핵심: 워크플로 디자인</h3>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 15px 0;">
            <p style="margin: 0 0 10px 0; font-size: 1.05rem;">
              <strong>💡 워크플로란?</strong>
            </p>
            <p style="margin: 0; font-size: 1.05rem; line-height: 1.6;">
              "사람이 직관과 감으로 하는 행동들을, AI가 이해할 수 있는 논리적인 구조로 바꾸는 과정"
            </p>
          </div>
          
          <h3>📊 워크플로 설계의 2가지 핵심 원리</h3>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0 0 10px 0; font-size: 1.05rem;">
              <strong>① 디컴포지션 (Decomposition, 분해)</strong>
            </p>
            <p style="margin: 0 0 10px 0; font-size: 1rem; line-height: 1.6;">
              목표 달성 과정을 아주 작은 '태스크 유닛(Task Unit)'으로 쪼개는 것
            </p>
            <p style="margin: 0; font-size: 0.95rem; color: #059669;">
              <strong>예시:</strong> "유튜브 올린다" ➔ 웹 검색 + 대본 작성 + 제목 선정 + 설명글 작성 + 태그 분석
            </p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0 0 10px 0; font-size: 1.05rem;">
              <strong>② 시퀀싱 (Sequencing, 순서화)</strong>
            </p>
            <p style="margin: 0 0 10px 0; font-size: 1rem; line-height: 1.6;">
              잘게 쪼갠 태스크 유닛들을 논리적인 순서에 맞춰 배치하는 것
            </p>
            <p style="margin: 0; font-size: 0.95rem; color: #d97706;">
              <strong>⚠️ 중요:</strong> 순서가 뒤바뀌면 전혀 다른 엉뚱한 결과가 나올 수 있음
            </p>
          </div>
          
          <h3>🎯 AI 에이전트 개발의 목적</h3>
          <p style="font-size: 1.05rem; line-height: 1.8;">
            <strong>목표:</strong> 실질적인 비즈니스 모델(수익 창출) 만들기<br/>
            <strong>수익화:</strong> 콘텐츠 제작(유튜브 등)을 통한 광고 수익, 제품 판매 수수료 등<br/>
            <strong>역할:</strong> AI 에이전트가 업무를 절차화하여 시간 단축 및 효율 극대화
          </p>
        `
      },
      {
        id: 'practice-1',
        type: 'practice',
        title: '실습: 유튜브 컨텐츠 기획 에이전트 만들기',
        duration: '약 30분',
        videoUrl: 'https://clathonstorage.blob.core.windows.net/video/agentbeginner_lecture/day2/day2practice.mp4?sp=r&st=2025-11-15T08:51:49Z&se=2030-11-15T17:06:49Z&sv=2024-11-04&sr=b&sig=10kNW98qwQafXDzq7AccgPRhqRJVo0XxQWm%2BG61cyQI%3D',
        content: `
          <h3>🚀 유튜브 콘텐츠 자동 생성 멀티 에이전트 시스템 구축</h3>
          
          <p style="font-size: 1.05rem; line-height: 1.8; color: #374151; margin-bottom: 20px;">
            4개의 전문 에이전트를 연결하여 트렌드 분석부터 대본 작성, 정책 체크까지 한 번에 수행하는 자동화 시스템을 만들어봅니다.
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #e2e8f0;">
            <h4 style="color: #1f2937; margin-bottom: 15px;">📋 4단계 워크플로</h4>
            <ol style="margin: 0; padding-left: 20px; line-height: 2;">
              <li><strong>트렌드 탐색기:</strong> 웹 검색으로 인기 트렌드 키워드 3개 추출 (GPT-5 Mini/Nano)</li>
              <li><strong>기획 전문가:</strong> 키워드 기반 클릭 유도 제목, 설명, 태그 작성 (GPT-5)</li>
              <li><strong>대본 작가:</strong> 타임라인 포함 촬영 대본 작성 (GPT-5)</li>
              <li><strong>보안관:</strong> 유튜브/구글 정책 위반 여부 검수 (GPT-5)</li>
            </ol>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-size: 1rem; color: #78350f;">
              <strong>💡 비용 절감 팁:</strong> Instruction은 영어로 작성하고 Output은 한글로 요청하세요. 영어 토큰 비용이 한글보다 훨씬 저렴합니다!
            </p>
          </div>
          
          <div style="background: #ecfdf5; padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0; font-size: 1rem; color: #065f46;">
              <strong>🔗 연결의 핵심:</strong> Add Context를 사용하여 이전 에이전트의 Output을 다음 에이전트의 Input으로 연결하세요. (함수 f(x)처럼!)
            </p>
          </div>
        `
      }
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: '워크플로 디자인에서 "디컴포지션(Decomposition)"이란 무엇을 의미하나요?',
          options: [
            '목표 달성 과정을 작은 태스크 유닛으로 쪼개는 것',
            '태스크를 논리적인 순서대로 배치하는 것',
            'AI 모델을 선택하는 과정',
            '에이전트를 삭제하는 것'
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: '워크플로 디자인에서 "시퀀싱(Sequencing)"이란 무엇을 의미하나요?',
          options: [
            '목표 달성 과정을 작은 태스크로 쪼개는 것',
            '태스크를 논리적인 순서대로 배치하는 것',
            'AI 모델의 성능을 측정하는 것',
            '비용을 절감하는 방법'
          ],
          correctAnswer: 1
        },
        {
          id: 3,
          question: 'AI 에이전트 비용을 절감하기 위한 팁으로 올바른 것은?',
          options: [
            'Output을 영어로 요청한다',
            'Instruction을 영어로 작성하고 Output은 한글로 요청한다',
            '항상 GPT-5를 사용한다',
            '웹 검색 기능을 사용하지 않는다'
          ],
          correctAnswer: 1
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
            🚀 Day 2 준비 중
          </h2>

          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            이 강의는 <strong style={{ color: '#0ea5e9' }}>2025년 11월 15일 오후 8시</strong>에 오픈될 예정입니다.
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
            {isDayCompleted ? '✅ Day 2 완료됨!' : '📚 Day 2 완료하기'}
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '20px',
            fontSize: '0.95rem'
          }}>
            {isDayCompleted 
              ? 'Day 2를 완료했습니다! 다음 강의로 이동하세요.' 
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
              {isCompletingDay ? '처리 중...' : 'Day 2 완료하기 →'}
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
              ✓ 완료! Day 3로 →
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

export default Day2Page;

