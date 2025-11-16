import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Award, Lock } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day5PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day5Page: React.FC<Day5PageProps> = ({ onBack, onNext }) => {
  const [completedSections] = useState<Set<string>>(new Set());
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // 런칭 날짜 체크 (2025년 11월 16일 밤 10시)
  const launchDate = new Date('2025-11-16T22:00:00+09:00');
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

          if (progress && progress.completedDays.includes(5)) {
            setIsDayCompleted(true);
          }
        }
      } catch (error) {
        console.error('❌ 진행 상황 로드 실패:', error);
      }
    };

    loadUserProgress();
  }, []);

  // Day 5 완료 처리
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
        5,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 5 완료! 다음 강의로 이동하세요!');
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
    day: 5,
    title: "수익화 인공지능 에이전트 구축하기",
    duration: "",
    description: "AI 에이전트로 사람을 고용하지 않고 콘텐츠 수익화를 자동화합니다. 트렌드 분석부터 영상/썸네일 생성, 메타데이터 최적화까지 한 번의 클릭으로 완성하는 워크플로우를 구축합니다.",
    objectives: [
      "수익화의 정의와 AI 에이전트의 목적 이해하기",
      "Google OPAL로 완전 자동화된 콘텐츠 생성 워크플로우 구축하기",
      "트렌드 분석 → 영상/썸네일 생성 → 메타데이터 최적화까지 실전 프로젝트 완성하기"
    ],
    sections: [
      {
        id: 'theory-1',
        type: 'theory',
        title: '수익화 인공지능 에이전트 구축하기 (이론 + 실습)',
        duration: '',
        videoUrl: 'https://player.vimeo.com/video/1137483341?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <h3>1. 강의 목표 및 핵심 철학</h3>
          
          <h4>수익화(Monetization)의 정의</h4>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            사람이 일을 해서 돈을 버는 행위를 의미합니다.
          </p>
          
          <h4>AI 에이전트의 목적</h4>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            사람을 추가로 고용하지 않고, AI가 업무를 대신하여 <strong>퍼포먼스를 높이고</strong> <strong>비용/시간/리소스를 최적화</strong>하는 것이 목적입니다.
          </p>
          
          <h4>콘텐츠 수익화</h4>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            광고 수익, 제품 판매(쇼핑 태그 등), 강연 등 다양한 경로로 수익을 창출할 수 있습니다.
          </p>
          
          <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <h4 style="color: #9a3412; margin-top: 0;">기존 방식의 한계</h4>
            <p style="font-size: 1.05rem; line-height: 1.8; color: #78350f; margin: 0;">
              매일 트렌드 분석, 스크립트 작성, 촬영, 편집 등을 반복하는 것은 매우 힘든 일입니다. 
              이를 <strong>한 번의 클릭으로 해결하는 자동화 워크플로우</strong>를 만드는 것이 이번 강의의 목표입니다.
            </p>
          </div>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>2. 완성된 AI 에이전트의 구조 (워크플로우)</h3>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            강사가 시연한 완성형 에이전트는 다음과 같은 흐름으로 작동합니다.
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0; width: 30%;">단계</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">설명</th>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>입력 (Input)</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">주제(예: 사모예드 먹방), 목적(제품 판매), 레퍼런스 영상(선택 사항)</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>연구 에이전트</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">구글 검색, 유튜브 트렌드 등을 분석하여 사람들이 관심 있어 할 요소를 찾음</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>썸네일 에이전트</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">분석 내용을 바탕으로 프롬프트 생성 → Imagen 모델로 이미지 생성</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>영상 생성 에이전트</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">VEO 모델로 8초짜리 영상 3개(총 24초 쇼츠) 생성. Scene 1, 2, 3이 맥락을 이어받아 연결</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>메타데이터 에이전트</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">클릭률을 높이는 제목, 설명, 태그 작성</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>출력 (Output)</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">썸네일, 메타데이터, 영상 3개를 한 화면에 보여줌</td>
            </tr>
          </table>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>3. 실습: 테스트 에이전트 만들기 (Step-by-Step)</h3>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            강의에서는 복잡한 구조를 이해하기 위해 핵심 기능만 담은 '테스트 에이전트'를 직접 만드는 과정을 보여줍니다.
          </p>
          
          <h4>1) 프로젝트 생성 및 입력 설정</h4>
          <ul style="line-height: 1.8; font-size: 1.05rem; margin-bottom: 25px;">
            <li>Google AI Studio에서 Create New → Start</li>
            <li><strong>User Input (2개 생성)</strong>:
              <ul style="margin-top: 10px;">
                <li>콘텐츠 주제: (예: 사모예드 김치찌개 먹방, AI 공부 영상 등)</li>
                <li>콘텐츠 목표: (예: 제품 판매, 엔터테인먼트, 지식 전파)</li>
                <li>(옵션) 레퍼런스 영상 추가 가능</li>
              </ul>
            </li>
          </ul>
          
          <h4>2) 연구(Research) 에이전트 설정</h4>
          <ul style="line-height: 1.8; font-size: 1.05rem; margin-bottom: 25px;">
            <li><strong>모델</strong>: Gemini 1.5 Flash (Plan and Execute 모드 권장 - 절차적 수행에 유리)</li>
            <li><strong>도구(Tools)</strong>: Search Web, Search Map, Get Website 등 추가</li>
            <li><strong>프롬프트</strong>: "입력된 정보와 트렌드 데이터를 분석하여 조회수가 높을 만한 콘텐츠 방향을 연구하라"고 지시</li>
            <li><strong>연결</strong>: User Input 노드를 연구 에이전트에 연결</li>
          </ul>
          
          <h4>3) 콘텐츠 생성 에이전트 구축</h4>
          <ul style="line-height: 1.8; font-size: 1.05rem; margin-bottom: 25px;">
            <li><strong>썸네일 생성</strong>: 연구 결과를 바탕으로 Imagen을 사용하여 16:9 비율 이미지 생성</li>
            <li><strong>영상 생성 (총 2개 장면 실습)</strong>:
              <ul style="margin-top: 10px;">
                <li>장면 1: VEO 모델 사용. 연구 내용을 바탕으로 첫 번째 영상 프롬프트 작성 및 생성 (VEO 2 사용 시 더 빠름)</li>
                <li>장면 2: 장면 1의 프롬프트/결과를 입력받아, 내용이 이어지도록 프롬프트 작성 후 영상 생성</li>
              </ul>
            </li>
            <li><strong>메타데이터 생성</strong>: 연구 결과 및 생성된 영상 내용을 바탕으로 제목, 설명, 태그를 깔끔하게 작성</li>
          </ul>
          
          <h4>4) 출력(Show) 설정</h4>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 25px;">
            <strong>Output 노드</strong>: 생성된 썸네일, 메타데이터(제목/설명), 영상 1, 영상 2를 연결하여 한눈에 볼 수 있도록 배치합니다.
          </p>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>4. 실행 및 결과 확인</h3>
          <ul style="line-height: 1.8; font-size: 1.05rem; margin-bottom: 25px;">
            <li><strong>실행(Run)</strong>: "사모예드 먹방", "제품 판매" 등을 입력하고 실행</li>
            <li><strong>콘솔(Console) 확인</strong>: 연구 에이전트가 실제로 구글 검색을 하고("Dog safe food ideas" 등), 계획을 세워 실행하는 과정을 실시간으로 확인 가능</li>
            <li><strong>결과</strong>: 약 10분 내외의 작업 후, 자동으로 썸네일, 제목, 본문, 영상들이 생성됨</li>
          </ul>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>5. 결론 및 당부 사항</h3>
          
          <div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <h4 style="color: #166534; margin-top: 0;">실천 강조</h4>
            <p style="font-size: 1.05rem; line-height: 1.8; color: #15803d; margin: 0;">
              눈으로만 보지 말고 <strong>반드시 직접 따라 만들어 봐야</strong> 합니다.
            </p>
          </div>
          
          <h4>비전</h4>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            AI 에이전트를 통해 반복적인 업무를 줄이고 <strong>콘텐츠 수익화라는 예측 가능한 사업 모델</strong>을 구축할 수 있습니다.
          </p>
          
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <h4 style="color: #991b1b; margin-top: 0;">⚠️ 공유 금지</h4>
            <p style="font-size: 1.05rem; line-height: 1.8; color: #7f1d1d; margin: 0;">
              제공된 링크와 워크플로우는 <strong>수강생들만의 자산</strong>이므로 외부 공유를 자제해 주시기 바랍니다.
            </p>
          </div>
        `
      }
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: '수익화(Monetization)의 정의로 가장 적절한 것은?',
          options: [
            '사람이 일을 해서 돈을 버는 행위',
            'AI가 자동으로 돈을 버는 행위',
            '광고를 클릭해서 수익을 내는 행위',
            '유튜브 구독자를 늘리는 행위'
          ],
          correctAnswer: 0
        },
        {
          id: 2,
          question: 'AI 에이전트의 주요 목적이 아닌 것은?',
          options: [
            '퍼포먼스 향상',
            '비용/시간/리소스 최적화',
            '사람을 추가 고용',
            '반복 업무 자동화'
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: '완성된 AI 에이전트 워크플로우의 순서로 올바른 것은?',
          options: [
            '입력 → 썸네일 생성 → 연구 → 영상 생성 → 메타데이터',
            '입력 → 연구 → 썸네일 생성 → 영상 생성 → 메타데이터',
            '연구 → 입력 → 영상 생성 → 썸네일 생성 → 메타데이터',
            '입력 → 영상 생성 → 연구 → 메타데이터 → 썸네일 생성'
          ],
          correctAnswer: 1
        },
        {
          id: 4,
          question: '영상 생성 에이전트에서 사용하는 모델은?',
          options: [
            'Imagen',
            'VEO',
            'Lyria',
            'Gemini'
          ],
          correctAnswer: 1
        },
        {
          id: 5,
          question: '강의에서 강조한 가장 중요한 학습 방법은?',
          options: [
            '눈으로만 보고 이해하기',
            '반드시 직접 따라 만들어 보기',
            '다른 사람에게 설명하기',
            '이론만 완벽하게 공부하기'
          ],
          correctAnswer: 1
        }
      ]
    },
    resources: [
      {
        title: '🎬 AI 에이전트 숏츠 만드는 워크플로우 (ConnexionAI 제공)',
        url: 'https://opal.google/?flow=drive:/17JvxIVkjx6tDzzTPPfwrNtURuEsSMTpM&shared&mode=app',
        type: 'workflow',
        description: '이번 강의에서 다룬 실전 워크플로우입니다. ConnexionAI가 지속적으로 연구하며 업데이트하므로 영상과 조금 다를 수 있습니다.'
      },
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
            🚀 Day 5 준비 중
          </h2>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '25px'
          }}>
            <p style={{
              color: '#92400e',
              fontSize: '1.05rem',
              marginBottom: '12px',
              fontWeight: '600',
              lineHeight: '1.6'
            }}>
              ⚠️ <strong>접속자 폭증으로 인해 현재 서버를 업그레이드하고 있습니다.</strong>
            </p>
            <p style={{
              color: '#78350f',
              fontSize: '0.95rem',
              margin: 0,
              lineHeight: '1.6'
            }}>
              더 나은 시청 경험을 위해 작업 중이며, <strong style={{ color: '#d97706' }}>2025년 11월 16일 밤 10시</strong>에 오픈될 예정입니다. 잠시만 기다려주세요! 🚀
            </p>
          </div>

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
                const isVimeo = (section as any).isVimeo || section.videoUrl.includes('vimeo.com');
                const isYouTube = section.videoUrl.includes('youtube.com') || section.videoUrl.includes('youtu.be');
                
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

        {/* Day 4 완료 버튼 */}
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
            {isDayCompleted ? '✅ Day 5 완료됨!' : '📚 Day 5 완료하기'}
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '20px',
            fontSize: '0.95rem'
          }}>
            {isDayCompleted 
              ? 'Day 5를 완료했습니다! 다음 강의로 이동하세요.' 
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
              {isCompletingDay ? '처리 중...' : 'Day 5 완료하기 →'}
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
              ✓ 완료! Day 6로 →
            </button>
          )}
        </div>

        {/* 워크플로우 다이어그램 */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
          border: '3px solid #f59e0b'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '800',
              color: '#92400e',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              🎬 실전 워크플로우 다이어그램
            </h2>
            <div style={{
              display: 'inline-block',
              background: '#dc2626',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '25px',
              fontSize: '0.95rem',
              fontWeight: '700',
              marginBottom: '15px',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}>
              🔥 지속 업데이트 중 - ConnexionAI 연구개발
            </div>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#78350f',
              marginBottom: '25px',
              fontWeight: '500'
            }}>
              이번 강의에서 다룬 <strong>수익화 AI 에이전트</strong>의 완성된 워크플로우입니다.<br/>
              아래 링크의 에이전트를 가지고 있으면 <strong style="color: #dc2626;">ConnexionAI의 최신 연구개발 내용이 자동으로 반영</strong>됩니다.
            </p>
          </div>

          {/* 워크플로우 이미지 */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '25px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            border: '2px solid #fbbf24'
          }}>
            <img 
              src="/images/day5/workflow-diagram.png" 
              alt="AI 에이전트 워크플로우 다이어그램"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                display: 'block'
              }}
            />
          </div>

          {/* 핵심 안내 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '20px',
            border: '2px solid #fbbf24'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#92400e',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💡 왜 이 워크플로우가 특별한가?
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{
                padding: '12px 0',
                borderBottom: '1px solid #fde68a',
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: '#78350f'
              }}>
                ✅ <strong>자동 업데이트</strong>: ConnexionAI 연구팀이 지속적으로 개선하는 최신 버전이 자동 반영됩니다
              </li>
              <li style={{
                padding: '12px 0',
                borderBottom: '1px solid #fde68a',
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: '#78350f'
              }}>
                ✅ <strong>지속적인 성장</strong>: 한 번 링크를 저장하면 계속 발전하는 에이전트를 사용할 수 있습니다
              </li>
              <li style={{
                padding: '12px 0',
                borderBottom: '1px solid #fde68a',
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: '#78350f'
              }}>
                ✅ <strong>최신 기술 적용</strong>: 새로운 AI 모델, 최적화 기법이 추가될 때마다 자동으로 업그레이드됩니다
              </li>
              <li style={{
                padding: '12px 0',
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: '#78350f'
              }}>
                ✅ <strong>영상과 다를 수 있음</strong>: 더 나은 성능을 위해 지속적으로 개선되므로 영상 내용과 조금 다를 수 있습니다
              </li>
            </ul>
          </div>

          {/* 강조 메시지 */}
          <div style={{
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            borderRadius: '15px',
            padding: '25px',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(220, 38, 38, 0.3)'
          }}>
            <p style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              margin: 0,
              lineHeight: '1.8'
            }}>
              🚀 이 링크 하나로 평생 업데이트되는 AI 에이전트를 소유하세요!<br/>
              <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                ConnexionAI가 연구하고 발전시키는 모든 개선사항이 자동으로 적용됩니다
              </span>
            </p>
          </div>
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
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {lessonData.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: resource.type === 'workflow' ? '30px' : '20px',
                  background: resource.type === 'workflow' 
                    ? 'linear-gradient(135deg, #fef3c7, #fde68a)' 
                    : 'linear-gradient(135deg, #f8fafc, #f0f9ff)',
                  borderRadius: '15px',
                  textDecoration: 'none',
                  color: '#1f2937',
                  transition: 'all 0.3s ease',
                  border: resource.type === 'workflow' ? '3px solid #f59e0b' : '2px solid #e2e8f0',
                  boxShadow: resource.type === 'workflow' 
                    ? '0 8px 24px rgba(245, 158, 11, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onMouseOver={(e) => {
                  if (resource.type === 'workflow') {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fde68a, #fcd34d)';
                    e.currentTarget.style.borderColor = '#d97706';
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(245, 158, 11, 0.4)';
                  } else {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #e0f2fe, #dbeafe)';
                    e.currentTarget.style.borderColor = '#0ea5e9';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.2)';
                  }
                }}
                onMouseOut={(e) => {
                  if (resource.type === 'workflow') {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fef3c7, #fde68a)';
                    e.currentTarget.style.borderColor = '#f59e0b';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.3)';
                  } else {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc, #f0f9ff)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: (resource as any).description ? '12px' : '0'
                }}>
                  <div style={{
                    background: resource.type === 'workflow' 
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                      : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    borderRadius: '12px',
                    padding: resource.type === 'workflow' ? '12px' : '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: resource.type === 'workflow' ? '50px' : '40px',
                    minHeight: resource.type === 'workflow' ? '50px' : '40px'
                  }}>
                    <FileText size={resource.type === 'workflow' ? 28 : 22} style={{ color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: '700', 
                      fontSize: resource.type === 'workflow' ? '1.25rem' : '1rem',
                      marginBottom: resource.type === 'workflow' ? '5px' : '0',
                      color: resource.type === 'workflow' ? '#92400e' : '#1f2937'
                    }}>
                      {resource.title}
                    </div>
                    {resource.type === 'workflow' && (
                      <div style={{
                        display: 'inline-block',
                        background: '#dc2626',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginTop: '5px'
                      }}>
                        지속 업데이트 중
                      </div>
                    )}
                  </div>
                </div>
                {(resource as any).description && (
                  <p style={{
                    margin: 0,
                    paddingLeft: resource.type === 'workflow' ? '65px' : '55px',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: resource.type === 'workflow' ? '#78350f' : '#64748b'
                  }}>
                    {(resource as any).description}
                  </p>
                )}
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

export default Day5Page;

