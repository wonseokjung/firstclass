import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Award, Lock } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day4PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day4Page: React.FC<Day4PageProps> = ({ onBack, onNext }) => {
  const [completedDaysCount, setCompletedDaysCount] = useState<number>(0);
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  // 런칭 날짜 체크 (즉시 오픈)
  const isLaunched = true; // 즉시 오픈

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
            if (progress.completedDays.includes(4)) {
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

  // 4강 완료 처리
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
        4,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 4강 완료! 다음 강의로 이동하세요!');
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
    day: 4,
    title: "협찬/광고 수익을 만드는 '콘텐츠 자동 생성 에이전트' 제작법",
    duration: "",
    description: "OpenAI vs Google Opal을 비교하며 실전 SNS 마케팅 자동화 에이전트를 구축합니다. 디컴포지션 원리로 복잡한 업무를 AI가 처리하도록 설계하는 방법을 학습합니다.",
    objectives: [
      "디컴포지션(Decomposition) 원리로 복잡한 업무를 AI 작업 단위로 분해하기",
      "4개 에이전트를 연결한 인스타그램 포스팅 자동화 워크플로우 구축하기",
      "OpenAI vs Google Opal의 차이점을 직접 체감하며 도구 선택 능력 향상하기"
    ],
    sections: [
      {
        id: 'theory-1',
        type: 'theory',
        title: '통합 강의: 협찬/광고 수익을 만드는 콘텐츠 자동 생성 에이전트 (이론 + 실습)',
        duration: '',
        videoUrl: 'https://player.vimeo.com/video/1137360066?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <h3>강의 목표</h3>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            단순히 AI를 사용하는 것을 넘어, 반복적인 비즈니스 프로세스를 자동화하여 시간과 비용을 절감하는 실전 에이전트 구축 능력을 배양합니다.
          </p>
          
          <h3>핵심 학습 개념</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">항목</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">상세 내용</th>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>핵심 원리</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">디컴포지션(Decomposition): 복잡한 업무를 여러 개의 독립적인 AI 작업 단위로 분해하고 연결</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>에이전트 모델</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">Plan and Execute Model (Gemini 1.5 Flash 기반)</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>목표</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">반복적인 비즈니스 프로세스 자동화로 시간과 비용 절감</td>
            </tr>
          </table>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h2>실습: 인스타그램 포스팅 에이전트 워크플로우</h2>
          
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            4개의 에이전트를 연결하여 비즈니스 웹사이트 분석부터 최종 포스팅 콘텐츠 생성까지 완전 자동화합니다.
          </p>
          
          <h3>워크플로우 구조</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">노드</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">역할</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">주요 도구</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">출력</th>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>사용자 입력</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">시작점</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">① 비즈니스 웹사이트 주소<br/>② 포스팅 목적</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">에이전트로 데이터 전달</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>에이전트 1<br/>(연구 에이전트)</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">웹사이트 및 비즈니스 분석</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">• Get Web Page<br/>• Search Web<br/>• Search Map</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">브랜드 상세 분석 결과</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>에이전트 2<br/>(캡션 에이전트)</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">인스타그램 캡션 작성</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">프롬프트 엔지니어링<br/>(페르소나 설정)</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">① 본문 캡션<br/>② 이미지용 영문 키워드</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>에이전트 3<br/>(이미지 에이전트)</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">이미지 생성/수정</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">Text-to-Image 모델</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">완성된 포스팅 이미지</td>
            </tr>
          </table>
          
          <h3>Prompt Engineering 핵심 지침</h3>
          
          <h4>1. 연구 에이전트</h4>
          <ul style="line-height: 1.8; font-size: 1.05rem;">
            <li>URL이 주어지면 Get Web Page 사용</li>
            <li>상호명만 주어지면 Search Web과 Search Map을 스스로 선택</li>
          </ul>
          
          <h4>2. 캡션 에이전트</h4>
          <ul style="line-height: 1.8; font-size: 1.05rem;">
            <li><strong>페르소나:</strong> "당신은 감각적인 인스타그램 캡션 전문가"</li>
            <li><strong>톤앤매너:</strong> 작성자의 기존 말투를 참고 자료로 제공</li>
            <li><strong>제약조건:</strong> 최대 3개 해시태그, 회사명/지역 등 현실감 있는 정보 포함</li>
          </ul>
          
          <h4>3. 이미지 에이전트</h4>
          <ul style="line-height: 1.8; font-size: 1.05rem;">
            <li>영문 키워드를 현대적이고 세련된 흰색 이탤릭체로 이미지에 오버레이</li>
            <li>종횡비 조정으로 멀티 플랫폼 대응 (인스타그램 1:1, 유튜브 16:9, 쇼츠 9:16)</li>
          </ul>
          
          <h3>심화 응용</h3>
          <ol style="line-height: 1.8; font-size: 1.05rem;">
            <li><strong>Image-to-Image:</strong> 기존 이미지에 텍스트/장식 추가하여 변형</li>
            <li><strong>멀티 플랫폼 확장:</strong> 종횡비 변경으로 유튜브 썸네일, 쇼츠용 콘텐츠 자동 생성</li>
            <li><strong>A/B 테스팅:</strong> 다양한 버전의 포스팅을 자동 생성하여 성과 비교</li>
          </ol>
          
          <h3>과제</h3>
          <p style="font-size: 1.05rem; line-height: 1.8;">
            강의에서 배운 원리를 적용하여 '유튜브 썸네일 생성 에이전트' 워크플로우를 기획하고 구축해보세요.
          </p>
        `
      }
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: '디컴포지션(Decomposition)의 주요 목적은 무엇인가요?',
          options: [
            '복잡한 업무를 여러 개의 독립적인 AI 작업 단위로 분해하여 자동화하기',
            '이미지를 더 작은 조각으로 나누기',
            '데이터베이스를 분산 처리하기',
            'AI 모델의 용량을 줄이기'
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: '인스타그램 포스팅 에이전트에서 "연구 에이전트"가 사용하는 도구가 아닌 것은?',
          options: [
            'Get Web Page',
            'Search Web',
            'Search Map',
            'Text-to-Image'
          ],
          correctAnswer: 3
        },
        {
          id: 3,
          question: '캡션 에이전트에서 프롬프트 엔지니어링 시 적용해야 할 핵심 요소가 아닌 것은?',
          options: [
            '페르소나 설정 (예: 인스타그램 캡션 전문가)',
            '톤앤매너 지정',
            '비디오 편집 기능',
            '제약조건 명시 (해시태그 개수, 현실감 등)'
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

  const totalDays = 10;
  const progressPercentage = (completedDaysCount / totalDays) * 100;

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
            🚀 4강 준비 중
          </h2>

          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            이 강의는 <strong style={{ color: '#0ea5e9' }}>2025년 11월 16일 오후 8시</strong>에 오픈될 예정입니다.
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

        {/* AI 에이전트 워크플로우 - 영상 바로 아래 */}
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
                🎬 인스타그램 포스팅 에이전트
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
                  value="https://opal.google/?flow=drive:/1qgT0E4eKCzYO-7bsWHa_p_JsvMm3APcF&shared&mode=app"
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
                    navigator.clipboard.writeText('https://opal.google/?flow=drive:/1qgT0E4eKCzYO-7bsWHa_p_JsvMm3APcF&shared&mode=app');
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
              href="https://opal.google/?flow=drive:/1qgT0E4eKCzYO-7bsWHa_p_JsvMm3APcF&shared&mode=app"
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
                            width="100%"
                            height="100%"
                            controls
                            controlsList="nodownload noremoteplayback"
                            disablePictureInPicture
                            preload="auto"
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
                              브라우저가 비디오를 지원하지 않습니다.<br />
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

        {/* Day 4 토론방 */}
        <DayDiscussion
          courseId="step2"
          dayNumber={4}
          communityPath="/community/step2"
          accentColor="#d4a439"
          userEmail={userEmail}
          userName={userName}
        />

        {/* 4강 완료 버튼 */}
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
            {isDayCompleted ? '✅ 4강 완료됨!' : '📚 4강 완료하기'}
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '20px',
            fontSize: '0.95rem'
          }}>
            {isDayCompleted
              ? '4강을 완료했습니다! 다음 강의로 이동하세요.'
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
              {isCompletingDay ? '처리 중...' : '4강 완료하기 →'}
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
              ✓ 완료! 5강으로 →
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
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

export default Day4Page;

