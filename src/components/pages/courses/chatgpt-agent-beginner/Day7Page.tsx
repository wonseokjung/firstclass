import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Award } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day7PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day7Page: React.FC<Day7PageProps> = ({ onBack, onNext }) => {
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

          if (progress && progress.completedDays.includes(7)) {
            setIsDayCompleted(true);
          }
        }
      } catch (error) {
        console.error('❌ 진행 상황 로드 실패:', error);
      }
    };

    loadUserProgress();
  }, []);

  // 7강 완료 처리
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
        7,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 7강 완료! 다음 강의로 이동하세요!');
      } else {
        alert('❌ 7강 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 7강 완료 처리 오류:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 7,
    title: "유튜브 채널 자동 생성 & 최적화 에이전트",
    duration: "",
    description: "AI 에이전트로 유튜브 채널 개설부터 브랜딩까지 완전 자동화합니다. 퍼널 전략으로 5-10개 채널을 동시에 운영하여 성공 확률을 극대화하는 방법을 학습합니다.",
    objectives: [
      "퍼널 전략: 다수 채널 운영으로 성공 확률 극대화하기",
      "11개 AI 에이전트로 채널 세팅 완전 자동화하기",
      "트렌드 분석부터 브랜딩까지 원스톱 워크플로우 구축하기"
    ],
    sections: [
      {
        id: 'workflow-guide',
        type: 'theory',
        title: '워크플로우 사용방법 & 이미지 다운로드 방법',
        duration: '5분',
        videoUrl: 'https://player.vimeo.com/video/1139757816?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <h3>📌 워크플로우 활용 가이드</h3>
          
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            이 영상에서는 실전 워크플로우를 어떻게 활용하고, 생성된 이미지를 다운로드하는 방법을 배웁니다.
          </p>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #0c4a6e; margin: 0;">
              <strong>💡 팁:</strong> 워크플로우를 먼저 이해하고 본강의를 들으시면 학습 효과가 극대화됩니다.
            </p>
          </div>
        `
      },
      {
        id: 'main-lecture',
        type: 'theory',
        title: '유튜브 채널 자동 생성 & 최적화 (본강의)',
        duration: '80분',
        videoUrl: 'https://player.vimeo.com/video/1139767191?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <h3>1. 강의 핵심 목표: "퍼널(Funnel) 전략"</h3>
          
          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #0c4a6e; margin: 0;">
              <strong>💡 핵심 철학:</strong> 콘텐츠의 가치가 자동화보다 우선이어야 합니다.
            </p>
          </div>
          
          <h4>효율적 유튜브 채널 운영 전략</h4>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">전략</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">설명</th>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>무한 확장 가능성</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">오프라인 사업과 달리 온라인(유튜브)은 무료로 무한 확장 가능</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>다수 채널 운영</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">처음부터 하나에 올인하지 말고, AI로 5~10개 채널 동시 운영</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>선택과 집중</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">반응 오는 채널(조회수, 구독자)만 남기고 나머지 제거 - 깔때기 방식</td>
            </tr>
          </table>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>2. 사전 준비: 유튜브 스튜디오 세팅</h3>
          
          <h4>구글 계정 생성</h4>
          <ul style="line-height: 1.8; font-size: 1.05rem;">
            <li>유튜브 채널용 구글 계정 새로 생성 (전화번호 인증 생략 가능 시 생략)</li>
            <li>유튜브 스튜디오: 대시보드, 콘텐츠 관리, 분석, 수익 창출 설정</li>
          </ul>
          
          <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #78350f; margin: 0;">
              <strong>⚠️ 중요:</strong> 커스터마이징(Customization)은 채널의 정체성을 유튜브 알고리즘과 시청자에게 알리는 가장 중요한 단계입니다.
            </p>
          </div>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>3. AI 에이전트 구축 (총 11개 기능)</h3>
          
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            반복 작업을 줄이기 위해 11개의 개별 AI 에이전트를 노드 형태로 연결하여 구축합니다.
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0; width: 30%;">에이전트</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">기능</th>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>1. 이메일 & 이름 생성</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">채널 주제에 맞는 이메일 주소와 담당자 이름 생성</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>2. 프로필 이미지 생성</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">채널 로고 생성 (1:1 정사각형 비율 필수)</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>3. 배너 이미지 생성</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">채널 상단 아트 생성 (16:9 가로형, 2048x1152px)</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>4. 핸들 생성</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">유튜브 채널 고유 주소(@아이디) 생성</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>5. 채널 설명 생성</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">채널의 주제와 방향성을 설명하는 소개글 작성</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>6. 언어/타겟 국가 설정</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">타겟 국가(언어) 결정 (예: 한국, 미국)</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>7. 워터마크 생성</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">영상 우측 하단 로고/워터마크 생성 (브랜딩 보호)</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>8. 화폐 설정</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">수익 창출 시 기준 통화 설정 (원화/달러)</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>9. 키워드(Tag) 생성</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">검색 유입 위한 핵심 키워드 생성 (콤마로 구분)</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>10. 시청자층 설정</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">성인/키즈 타겟 설정 (키즈는 제약 많고 단가 낮음 → 성인 추천)</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0;"><strong>11. 업로드 기본 설정</strong></td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">영상 업로드 시 반복되는 기본 제목, 설명, 태그 양식 자동 작성</td>
            </tr>
          </table>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>4. 워크플로우 연결 및 실행 (자동화)</h3>
          
          <h4>연구(Research) 에이전트 추가</h4>
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            인터넷 검색 도구를 활용해 <strong>'현재 가장 인기 있는 유튜브 채널 주제 5가지'</strong>를 찾도록 명령합니다.
          </p>
          
          <h4>노드 연결 방식</h4>
          <ul style="line-height: 1.8; font-size: 1.05rem;">
            <li>연구 에이전트가 찾은 주제(예: 교육, 라이프스타일, 애완동물 등)를 각 11개 세부 에이전트에 연결</li>
            <li>'첫 번째 주제'만 추출하여 1번 채널 생성 세트에 연결</li>
            <li>'두 번째 주제'는 2번 세트에 연결하는 방식</li>
            <li><strong>일괄 실행:</strong> 버튼 하나로 여러 채널에 필요한 모든 정보가 동시 생성</li>
          </ul>
          
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <h3>5. 결과 적용 및 마무리</h3>
          
          <h4>출력 확인 및 수정</h4>
          <ul style="line-height: 1.8; font-size: 1.05rem;">
            <li><strong>텍스트 확인:</strong> AI가 생성한 이름, 설명, 태그 등 검토</li>
            <li><strong>이미지 수정:</strong>
              <ul style="margin-top: 10px;">
                <li>가로형 이미지 → "정사각형으로 바꿔줘" 재명령</li>
                <li>배너 사이즈 조정 → 2048x1152px 또는 로고 크기 1/3 축소 등 구체적 명령</li>
              </ul>
            </li>
            <li><strong>유튜브 적용:</strong> 생성된 정보를 유튜브 스튜디오의 '맞춤설정' 및 '설정' 탭에 복사</li>
            <li><strong>이미지 업로드:</strong> 다운로드한 이미지를 프로필 및 배너 사진으로 등록</li>
          </ul>
          
          <div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <h4 style="color: #166534; margin-top: 0;">🎯 핵심 포인트</h4>
            <p style="font-size: 1.05rem; line-height: 1.8; color: #15803d; margin: 0;">
              이 방식은 단순 채널 생성을 넘어, <strong>트렌드 분석부터 브랜딩 요소 생성까지의 전 과정</strong>을 AI로 구조화한 것입니다.<br/><br/>
              AI 툴이 업데이트되더라도, 이러한 <strong>'워크플로우의 코어(핵심 원리)'</strong>를 이해하면 언제든 새로운 환경에 적응하여 효율적인 시스템을 구축할 수 있습니다.
            </p>
          </div>
        `
      }
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: '퍼널(Funnel) 전략의 핵심은 무엇인가요?',
          options: [
            '하나의 채널에만 집중하여 완벽하게 만들기',
            '5~10개 채널을 동시 운영하고 반응 오는 채널만 선택하기',
            '가능한 많은 영상을 빠르게 업로드하기',
            '구독자가 많은 채널을 벤치마킹하기'
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

        {/* 실전 워크플로우 다이어그램 */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc, #f0f9ff)',
          borderRadius: '20px',
          padding: '35px',
          marginBottom: '30px',
          border: '2px solid #e0e7ff',
          boxShadow: '0 4px 20px rgba(14, 165, 233, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: '700',
              color: '#1e293b',
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
            marginBottom: '20px'
          }}>
            유튜브 채널 자동 생성 AI 에이전트 완성본 — ConnexionAI의 최신 업데이트가 자동 반영됩니다
          </p>

          {/* 워크플로우 이미지 */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '15px',
            border: '1px solid #e5e7eb'
          }}>
            <img 
              src="/images/day5/day7.png" 
              alt="유튜브 채널 자동 생성 AI 에이전트 워크플로우 다이어그램"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                display: 'block'
              }}
            />
          </div>
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

        {/* AI 에이전트 채널 생성 워크플로우 */}
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
                🎬 채널 생성 워크플로우
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
              href="https://opal.google/_app/?flow=drive:/1LjB3JFMovtkgeM2CQrIT_bRq0i6s4WKe&shared&mode=app"
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
                
                if (isVimeo && section.videoUrl) {
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
                
                // 영상 업로드 중 메시지
                if (!section.videoUrl || section.videoUrl === '') {
                  return (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '400px',
                      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                      borderRadius: '12px',
                      padding: '40px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        border: '4px solid rgba(251, 191, 36, 0.3)',
                        borderTop: '4px solid #fbbf24',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '30px'
                      }}></div>
                      <h3 style={{
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        marginBottom: '15px'
                      }}>
                        📹 영상 업로드 중입니다
                      </h3>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        maxWidth: '500px'
                      }}>
                        1시간 20분 강의 영상을 업로드하고 있습니다.<br/>
                        곧 시청하실 수 있습니다! 🚀
                      </p>
                      <div style={{
                        marginTop: '25px',
                        background: 'rgba(251, 191, 36, 0.1)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '10px',
                        padding: '15px 25px',
                        color: '#fbbf24',
                        fontSize: '0.95rem',
                        fontWeight: '600'
                      }}>
                        💡 먼저 워크플로우 사용방법 영상을 시청해보세요!
                      </div>
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

        {/* 7강 완료 버튼 */}
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
            {isDayCompleted ? '✅ 7강 완료됨!' : '📚 7강 완료하기'}
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '20px',
            fontSize: '0.95rem'
          }}>
            {isDayCompleted 
              ? '7강을 완료했습니다! 다음 강의로 이동하세요.' 
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
              {isCompletingDay ? '처리 중...' : '7강 완료하기 →'}
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
              ✓ 완료! 8강으로 →
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
                  padding: '20px',
                  background: 'linear-gradient(135deg, #f8fafc, #f0f9ff)',
                  borderRadius: '15px',
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    borderRadius: '12px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px',
                    minHeight: '40px'
                  }}>
                    <FileText size={22} style={{ color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: '700', 
                      fontSize: '1rem',
                      color: '#1f2937'
                    }}>
                      {resource.title}
                    </div>
                  </div>
                </div>
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
        
        h3 {
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 25px;
          margin-bottom: 15px;
        }
        
        h4 {
          color: #374151;
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 20px;
          margin-bottom: 12px;
        }
        
        ul, ol {
          margin: 15px 0;
          padding-left: 25px;
        }
        
        li {
          margin: 8px 0;
          line-height: 1.6;
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

export default Day7Page;
