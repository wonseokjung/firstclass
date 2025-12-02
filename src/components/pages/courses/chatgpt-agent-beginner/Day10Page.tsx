import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Copy, CheckCircle } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface Day10PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day10Page: React.FC<Day10PageProps> = ({ onBack, onNext }) => {
  const [completedDaysCount, setCompletedDaysCount] = useState<number>(0);
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

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

          if (progress && progress.completedDays) {
            setCompletedDaysCount(progress.completedDays.length);
            if (progress.completedDays.includes(10)) {
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

  // 프롬프트 복사 함수
  const copyPromptToClipboard = async () => {
    const coronaPrompt = `{
  "description": "Cinematic close-up of a cold, dewy Corona bottle sitting alone on a weathered beach table. It begins to hum, vibrate. The bottle cap *pops*—and the entire environment unfolds from inside: palm trees rise, lights string themselves, speakers assemble mid-air, sand shifts into a dance floor. A DJ booth builds from driftwood. Music kicks in. A beach rave is born. No text.",
  "style": "cinematic, magical realism",
  "camera": "starts ultra close, zooms out and cranes overhead as the world expands",
  "lighting": "sunset turning to neon—golden hour into party glow",
  "environment": "quiet beach transforms into high-energy beach rave",
  "elements": [
    "Corona bottle (label visible, condensation dripping)",
    "pop-top cap in slow motion",
    "exploding citrus slice",
    "sand morphing into dance floor",
    "palm trees rising",
    "neon lights snapping on",
    "DJ booth building itself",
    "crowd materializing mid-dance",
    "fire pit lighting",
    "surfboards as signage"
  ],
  "motion": "explosion of elements from bottle, everything assembles in rapid time-lapse",
  "ending": "Corona bottle in foreground, beach rave in full swing behind it",
  "text": "none",
  "keywords": [
    "Corona",
    "beach party",
    "bottle transforms",
    "rave build",
    "sunset to night",
    "cinematic",
    "no text"
  ]
}`;
    try {
      await navigator.clipboard.writeText(coronaPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (error) {
      console.error('프롬프트 복사 실패:', error);
      alert('프롬프트 복사에 실패했습니다.');
    }
  };

  // 10강 완료 처리
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

      // 학습 시간 계산 (예: 63분)
      const learningTimeMinutes = 63;

      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'chatgpt-agent-beginner',
        10,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 10강 완료! 전체 과정을 수료하셨습니다!\n\n축하합니다! 🎓');
      } else {
        alert('❌ 10강 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 10강 완료 처리 오류:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  const lessonData = {
    day: 10,
    title: "Day 10: 영상 콘텐츠 자동화 - JSON 프롬프트와 Google Opal 에이전트로 쇼츠/롱폼 제작",
    duration: "약 63분",
    description: "JSON 프롬프트를 활용하여 고품질 영상을 생성하고, 22개의 Google Opal 에이전트로 자동화된 영상 제작 시스템을 구축하는 방법을 학습합니다.",
    objectives: [
      "JSON 프롬프트를 활용한 고품질 영상 생성 이해",
      "Google Opal에서 22개 에이전트로 자동화 워크플로우 구축하기",
      "제품 광고 영상(코카콜라, 환타 등) 시리즈 제작",
      "일관성 있는 영상 스토리텔링을 위한 에이전트 설계",
      "배경음악, 카메라 무빙 등 세부 요소 제어 방법"
    ],
    sections: [
      {
        id: 'intro',
        type: 'intro',
        title: '✨ Day 10에서 배울 내용',
        duration: '',
        content: `
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 3px solid #fbbf24; padding: 40px; margin: 30px 0; border-radius: 20px; box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3); text-align: center;">
            <h2 style="color: #92400e; margin: 0 0 20px 0; font-size: 2rem; font-weight: 800;">
              🎬 일관성 있고 이어지는 영상 시리즈 제작
            </h2>
            <p style="color: #92400e; font-size: 1.2rem; line-height: 1.8; margin: 0;">
              오늘은 Google Opal로 <strong>스토리가 자연스럽게 연결</strong>되고,<br/>
              <strong>같은 스타일과 캐릭터를 유지</strong>하는 영상 시리즈를 만드는 방법을 배웁니다!
            </p>
          </div>
        `
      },
      {
        id: 'demo-videos',
        type: 'video',
        title: '🎥 일관성 있는 영상 시리즈 데모',
        duration: '',
        content: `
          <p style="font-size: 1.15rem; line-height: 1.8; margin-bottom: 30px; color: #1f2937; font-weight: 600; text-align: center;">
            아래 두 영상을 보시면 <strong>같은 스타일로 이어지는 영상</strong>이 어떻게 만들어지는지 확인할 수 있습니다! 🎬
          </p>
        `
      },
      {
        id: 'demo-video-1',
        type: 'video',
        title: '',
        duration: '',
        videoUrl: 'https://player.vimeo.com/video/1141676247?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: ``
      },
      {
        id: 'demo-video-2',
        type: 'video',
        title: '',
        duration: '',
        videoUrl: 'https://player.vimeo.com/video/1141676294?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <div style="background: linear-gradient(135deg, #f0f9ff, #dbeafe); border: 2px solid #0ea5e9; padding: 30px; margin: 30px 0; border-radius: 12px;">
            <h4 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 1.2rem; font-weight: 700; text-align: center;">✨ 이 영상들의 핵심 포인트</h4>
            <ul style="color: #0c4a6e; line-height: 2; margin: 0; padding-left: 20px; font-size: 1.05rem;">
              <li><strong>자연스러운 장면 전환:</strong> 첫 번째 영상과 두 번째 영상이 매끄럽게 연결</li>
              <li><strong>스타일 일관성:</strong> 같은 캐릭터, 같은 색감, 같은 톤, 같은 분위기 유지</li>
              <li><strong>스토리 연속성:</strong> 이야기가 끊기지 않고 자연스럽게 이어짐</li>
              <li><strong>Google Opal 자동화:</strong> 에이전트가 자동으로 여러 장면 생성</li>
            </ul>
          </div>

          <div style="background: #dcfce7; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #065f46; margin: 0;">
              💡 <strong>활용 팁:</strong> 이런 방식으로 제품 광고, 브랜드 스토리, 교육 콘텐츠 등 
              다양한 시리즈 영상을 제작할 수 있습니다! CapCut, 블로(Vllo), Adobe Premiere에서 
              자막, 배경음악, 효과음을 추가하면 더욱 완성도 높은 콘텐츠가 됩니다.
            </p>
          </div>
        `
      },
      {
        id: 'main-lecture',
        type: 'lecture',
        title: '📹 Day 10 메인 강의: 영상 콘텐츠 자동화 마스터 (이론 + 실습)',
        duration: '약 63분',
        videoUrl: 'https://player.vimeo.com/video/1141671373?badge=0&autopause=0&player_id=0&app_id=58479',
        isVimeo: true,
        content: `
          <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 20px; color: #1f2937; font-weight: 600;">
            이 강의에서는 JSON 프롬프트를 활용한 고품질 영상 생성과 22개의 Google Opal 에이전트로 
            일관성 있는 영상 시리즈를 제작하는 방법을 배웁니다.
          </p>

          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #fbbf24; padding: 25px; margin: 25px 0; border-radius: 12px; box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);">
            <h4 style="color: #92400e; margin: 0 0 15px 0; font-size: 1.2rem; font-weight: 800; display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.5rem;">⚡</span> 이 강의에서 배울 핵심 내용
            </h4>
            <ul style="color: #92400e; line-height: 2; margin: 0; padding-left: 20px; font-size: 1.05rem;">
              <li><strong>JSON 프롬프트 구조:</strong> 영상의 모든 요소(카메라, 조명, 움직임)를 제어</li>
              <li><strong>22개 에이전트 시스템:</strong> Google Opal로 자동화 워크플로우 구축</li>
              <li><strong>일관성 있는 시리즈:</strong> 코카콜라/환타 광고 실습 프로젝트</li>
              <li><strong>배경음악 & 카메라 무빙:</strong> 세부 요소 제어 방법</li>
            </ul>
          </div>
        `
      },
      {
        id: 'workflow-section',
        type: 'content',
        title: '🔗 실습 워크플로우 시작하기',
        duration: '',
        content: `
          <div style="background: linear-gradient(135deg, #e0f2fe, #bae6fd); border: 3px solid #0ea5e9; padding: clamp(25px, 5vw, 40px); margin: clamp(20px, 4vw, 30px) 0; border-radius: 20px; box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3); text-align: center;">
            <div style="margin-bottom: 25px;">
              <span style="font-size: clamp(2.5rem, 8vw, 4rem); display: block; margin-bottom: 15px;">🚀</span>
              <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: clamp(1.3rem, 3.5vw, 1.8rem); font-weight: 800;">
                Google Opal 워크플로우로 영상 자동화 시작!
              </h3>
              <p style="color: #0c4a6e; font-size: clamp(0.95rem, 2.5vw, 1.1rem); line-height: 1.8; margin: 0;">
                아래 버튼을 클릭하여 Google Opal에서 영상 자동화 워크플로우를 시작하세요.<br/>
                강의 내용을 따라하면서 직접 22개 에이전트를 구성해보세요!
              </p>
            </div>

            <a 
              href="https://opal.google/_app/?flow=drive:/1WnRyqoQFV94yV83TyqG98fdQzDj8UsZ0&shared&mode=app"
              target="_blank"
              rel="noopener noreferrer"
              style="
                display: inline-block;
                background: linear-gradient(135deg, #0ea5e9, #0284c7);
                color: white;
                text-decoration: none;
                padding: clamp(15px, 3vw, 20px) clamp(30px, 6vw, 50px);
                border-radius: 15px;
                font-size: clamp(1.1rem, 2.5vw, 1.3rem);
                font-weight: 800;
                box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
                transition: all 0.3s ease;
                border: 3px solid #0369a1;
              "
              onmouseover="this.style.transform='translateY(-4px) scale(1.05)'; this.style.boxShadow='0 12px 35px rgba(14, 165, 233, 0.5)';"
              onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 25px rgba(14, 165, 233, 0.4)';"
            >
              🔗 Google Opal 워크플로우 열기
            </a>

            <div style="margin-top: 25px; padding-top: 25px; border-top: 2px solid rgba(14, 165, 233, 0.3);">
              <p style="font-size: clamp(0.9rem, 2vw, 1rem); color: #0c4a6e; margin: 0; line-height: 1.6;">
                💡 <strong>Tip:</strong> Google Opal을 활용하여 영상 자동화 시스템을 구축합니다!<br/>
                강의에서 배우는 22개 에이전트 시스템으로 고품질 영상 시리즈를 자동으로 제작할 수 있습니다.
              </p>
            </div>
          </div>
        `
      },
      {
        id: 'corona-prompt-section',
        type: 'interactive',
        title: '🍺 실전 JSON 프롬프트: 코로나 맥주 광고',
        duration: '',
        content: 'CORONA_PROMPT_PLACEHOLDER'
      },
      {
        id: 'json-structure',
        type: 'content',
        title: '🔧 JSON 프롬프트의 구조',
        duration: '',
        content: `
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            JSON 프롬프트는 영상의 모든 요소를 체계적으로 정의합니다:
          </p>
          <ul style="line-height: 1.8; font-size: 1.05rem; margin: 20px 0;">
            <li><strong>Description:</strong> 영상의 전체적인 설명</li>
            <li><strong>Style:</strong> 영화 같은 스타일, 리얼리즘 등</li>
            <li><strong>Camera:</strong> 클로즈업, 줌 아웃 등 카메라 움직임</li>
            <li><strong>Lighting:</strong> 조명의 종류와 배치</li>
            <li><strong>Environment:</strong> 배경과 환경 설정</li>
            <li><strong>Elements:</strong> 등장하는 요소들</li>
            <li><strong>Motion:</strong> 움직임과 액션</li>
            <li><strong>Ending:</strong> 마지막 장면</li>
            <li><strong>Text:</strong> 텍스트 포함 여부</li>
            <li><strong>Background Music:</strong> 배경음악 설정</li>
            <li><strong>Keywords:</strong> 핵심 키워드</li>
          </ul>
        `
      },
      {
        id: 'agent-system',
        type: 'theory',
        title: '🤖 22개 에이전트 자동화 시스템',
        duration: '',
        content: `
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            Google Opal에서 다음과 같은 구조로 에이전트를 배치합니다:
          </p>
          
          <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <h4 style="color: #92400e; margin: 0 0 15px 0; font-size: 1.15rem;">📊 에이전트 구조</h4>
            <ol style="color: #92400e; line-height: 2; margin: 0; padding-left: 20px;">
              <li><strong>대표 에이전트 (User Input):</strong> 주제 입력</li>
              <li><strong>장면 생성 에이전트:</strong> 장면 1, 장면 2 스토리 구성</li>
              <li><strong>10개의 프롬프트 생성 에이전트:</strong> Description, Style, Camera, Lighting, Environment, Elements, Motion, Ending, Text, Keywords 각각 담당</li>
              <li><strong>2개의 영상 생성 에이전트 (Alex):</strong> 장면 1, 장면 2 영상 제작</li>
              <li><strong>출력 에이전트:</strong> 최종 영상 결과물 생성</li>
            </ol>
          </div>
        `
      },
      {
        id: 'coca-cola-example',
        type: 'practice',
        title: '🎨 실전 예제: 코카콜라 광고 만들기',
        duration: '',
        content: `
          <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">
            강의에서는 다음과 같은 프로젝트를 직접 구현합니다:
          </p>
          <ul style="line-height: 1.8; font-size: 1.05rem; margin: 20px 0;">
            <li>코카콜라 요정 몬스터들이 무지개를 타고 내려오는 영상</li>
            <li>우주에서 노는 귀여운 코카콜라 캐릭터 영상</li>
            <li>2개 장면이 자연스럽게 연결되는 스토리 구성</li>
            <li>일관된 캐릭터, 색감, 스타일 유지</li>
          </ul>

          <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #065f46; margin: 0;">
              ✅ <strong>성공 팁:</strong> 배경음악이 중복되거나 어색할 경우, JSON 프롬프트에서 
              "background_music": "none"으로 설정하여 무음으로 만들 수 있습니다. 나중에 편집 프로그램에서 
              배경음악을 추가하는 것이 더 자연스럽습니다.
            </p>
          </div>
        `
      },
      {
        id: 'homework',
        type: 'practice',
        title: '📝 실습 과제',
        duration: '',
        content: `
          <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <h4 style="color: #92400e; margin: 0 0 15px 0; font-size: 1.15rem;">🎯 숙제 미션</h4>
            <ol style="color: #92400e; line-height: 2; margin: 0; padding-left: 20px;">
              <li><strong>제품 영상 만들기:</strong> 코카콜라, 환타, 가방, 음식 등 원하는 제품의 광고 영상 제작</li>
              <li><strong>이미지 투 비디오:</strong> 특정 제품 이미지를 업로드하여 영상으로 변환 (User Input + 이미지 업로드)</li>
              <li><strong>JSON 프롬프트 커스터마이징:</strong> 배경음악, 텍스트 등 원하는 요소 추가/제거</li>
              <li><strong>CapCut으로 편집:</strong> 2개 장면을 CapCut에서 연결하고 배경음악 추가</li>
              <li><strong>커뮤니티 공유:</strong> 완성된 영상을 <a href="https://www.youtube.com/@CONNECT-AI-LAB/community" target="_blank" rel="noopener noreferrer" style="color: #0ea5e9; text-decoration: underline; font-weight: 700;">Connect AI LAB 커뮤니티</a>에 업로드</li>
            </ol>
          </div>
        `
      },
      {
        id: 'warnings',
        type: 'theory',
        title: '⚠️ 중요한 주의사항',
        duration: '',
        content: `
          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; margin: 25px 0; border-radius: 8px;">
            <p style="font-size: 1.05rem; line-height: 1.8; color: #7f1d1d; margin: 0;">
              <strong>⚠️ 경고:</strong> 시니어 드라마, 탈북 드라마 등 이미 포화된 콘텐츠는 피하세요! 
              빠르게 트렌드를 파악하고 새로운 주제를 찾아야 합니다. 다른 사람들이 이미 성공했다고 
              공유한 콘텐츠는 이미 늦은 것입니다. 창의력을 발휘하여 차별화된 콘텐츠를 만드세요.
            </p>
          </div>
        `
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* 헤더 */}
      <header style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        color: 'white',
        padding: 'clamp(15px, 3vw, 20px) 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(15px, 4vw, 20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'clamp(10px, 2vw, 15px)'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: 'clamp(8px, 2vw, 10px) clamp(15px, 3vw, 20px)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ArrowLeft size={18} />
            <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>강의 목록으로</span>
            <span style={{ display: window.innerWidth >= 640 ? 'none' : 'inline' }}>목록</span>
          </button>

          <div style={{ textAlign: 'center', flex: '1', minWidth: '200px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: 'clamp(3px, 1vw, 4px) clamp(10px, 2vw, 12px)',
              borderRadius: '20px',
              fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
              fontWeight: '600',
              marginBottom: 'clamp(6px, 1.5vw, 8px)',
              display: 'inline-block'
            }}>
              Day 10 / 10 (최종강)
            </div>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(0.95rem, 2.5vw, 1.5rem)',
              fontWeight: '700',
              lineHeight: '1.3'
            }}>
              Day 10: 영상 콘텐츠 자동화
            </h1>
          </div>

          <div style={{ width: 'clamp(80px, 15vw, 140px)', display: window.innerWidth < 768 ? 'none' : 'block' }}></div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'clamp(25px, 5vw, 40px) clamp(15px, 4vw, 20px)'
      }}>
        {/* 강의 정보 카드 */}
        <div style={{
          background: 'white',
          borderRadius: 'clamp(12px, 3vw, 16px)',
          padding: 'clamp(20px, 4vw, 30px)',
          marginBottom: 'clamp(20px, 4vw, 30px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(10px, 2vw, 15px)',
            marginBottom: 'clamp(15px, 3vw, 20px)',
            flexWrap: 'wrap'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: 'white',
              padding: 'clamp(5px, 1.2vw, 6px) clamp(12px, 2.5vw, 16px)',
              borderRadius: '20px',
              fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
              fontWeight: '600'
            }}>
              {lessonData.duration}
            </span>
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              padding: 'clamp(5px, 1.2vw, 6px) clamp(12px, 2.5vw, 16px)',
              borderRadius: '20px',
              fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
              fontWeight: '600'
            }}>
              🏆 최종강
            </span>
            <span style={{
              color: '#64748b',
              fontSize: 'clamp(0.85rem, 1.9vw, 0.95rem)'
            }}>
              완료한 강의: {completedDaysCount}개
            </span>
          </div>

            <p style={{
            color: '#475569',
            fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)',
            lineHeight: '1.8',
            margin: 0
          }}>
            {lessonData.description}
          </p>

          <div style={{ marginTop: 'clamp(20px, 4vw, 25px)' }}>
            <h3 style={{
              fontSize: 'clamp(1rem, 2.3vw, 1.1rem)',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: 'clamp(12px, 2.5vw, 15px)'
            }}>
              📚 학습 목표
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: 'clamp(18px, 3vw, 22px)',
              color: '#475569',
              lineHeight: '1.9',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}>
              {lessonData.objectives.map((objective, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 강의 섹션들 */}
        {lessonData.sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            style={{
              background: 'white',
              borderRadius: 'clamp(15px, 3.5vw, 20px)',
              padding: 'clamp(25px, 5vw, 40px)',
              marginBottom: 'clamp(20px, 4vw, 30px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
              border: '1px solid #f1f5f9',
              scrollMarginTop: '100px'
            }}
          >
            {section.title && (
              <div style={{
                marginBottom: 'clamp(20px, 4vw, 30px)'
              }}>
                <h2 style={{
                  fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
                  fontWeight: '800',
                  color: '#1e293b',
                  margin: '0 0 clamp(8px, 2vw, 10px) 0',
                  lineHeight: '1.3'
                }}>
                  {section.title}
                </h2>
                {section.duration && (
                  <p style={{
                    color: '#64748b',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    ⏱️ {section.duration}
                  </p>
                )}
              </div>
            )}

            {/* Vimeo 비디오 */}
            {section.videoUrl && section.isVimeo && (
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '12px',
                marginBottom: '30px',
                background: '#000'
              }}>
                <iframe
                  src={section.videoUrl}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={section.title}
                />
              </div>
            )}

            {/* 콘텐츠 */}
            {section.id === 'corona-prompt-section' ? (
              <div style={{ marginTop: '20px' }}>
                <p style={{
                  fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)',
                  lineHeight: '1.8',
                  color: '#475569',
                  marginBottom: '25px'
                }}>
                  실전에서 바로 사용할 수 있는 고퀄리티 광고 영상 프롬프트입니다. 
                  <strong> Google Veo, Runway Gen-3, Pika</strong> 등에 복사·붙여넣기하여 프로급 영상을 생성하세요!
                </p>

                <div style={{
                  background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  borderRadius: '16px',
                  padding: 'clamp(20px, 4vw, 30px)',
                  marginBottom: '25px',
                  border: '2px solid #fbbf24',
                  boxShadow: '0 8px 25px rgba(251, 191, 36, 0.2)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '15px'
                  }}>
                    <h4 style={{
                      fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                      fontWeight: '700',
                      color: '#78350f',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span>📝</span>
                      <span>JSON 프롬프트</span>
                    </h4>
                    <button
                      onClick={copyPromptToClipboard}
                      style={{
                        background: copiedPrompt ? '#10b981' : '#fbbf24',
                        color: copiedPrompt ? 'white' : '#78350f',
                        border: 'none',
                        padding: 'clamp(10px, 2vw, 12px) clamp(18px, 3vw, 25px)',
                        borderRadius: '999px',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: copiedPrompt ? '0 8px 20px rgba(16, 185, 129, 0.3)' : '0 8px 20px rgba(251, 191, 36, 0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: 'clamp(110px, 20vw, 140px)',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        if (!copiedPrompt) {
                          e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 10px 25px rgba(251, 191, 36, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = copiedPrompt ? '0 8px 20px rgba(16, 185, 129, 0.3)' : '0 8px 20px rgba(251, 191, 36, 0.3)';
                      }}
                    >
                      {copiedPrompt ? (
                        <>
                          <CheckCircle size={18} />
                          <span>복사됨!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          <span>복사하기</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div style={{
                    background: 'white',
                    color: '#1f2937',
                    padding: 'clamp(15px, 3vw, 25px)',
                    borderRadius: '12px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
                    lineHeight: '1.7',
                    overflowX: 'auto',
                    border: '1px solid #e5e7eb',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    <pre style={{
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>{`{
  "description": "Cinematic close-up of a cold, dewy Corona bottle sitting alone on a weathered beach table. It begins to hum, vibrate. The bottle cap *pops*—and the entire environment unfolds from inside: palm trees rise, lights string themselves, speakers assemble mid-air, sand shifts into a dance floor. A DJ booth builds from driftwood. Music kicks in. A beach rave is born. No text.",
  "style": "cinematic, magical realism",
  "camera": "starts ultra close, zooms out and cranes overhead as the world expands",
  "lighting": "sunset turning to neon—golden hour into party glow",
  "environment": "quiet beach transforms into high-energy beach rave",
  "elements": [
    "Corona bottle (label visible, condensation dripping)",
    "pop-top cap in slow motion",
    "exploding citrus slice",
    "sand morphing into dance floor",
    "palm trees rising",
    "neon lights snapping on",
    "DJ booth building itself",
    "crowd materializing mid-dance",
    "fire pit lighting",
    "surfboards as signage"
  ],
  "motion": "explosion of elements from bottle, everything assembles in rapid time-lapse",
  "ending": "Corona bottle in foreground, beach rave in full swing behind it",
  "text": "none",
  "keywords": [
    "Corona",
    "beach party",
    "bottle transforms",
    "rave build",
    "sunset to night",
    "cinematic",
    "no text"
  ]
}`}</pre>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #dbeafe, #bae6fd)',
                  borderRadius: '12px',
                  padding: 'clamp(18px, 3.5vw, 25px)',
                  border: '2px solid #0ea5e9'
                }}>
                  <h5 style={{
                    fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
                    fontWeight: '700',
                    color: '#0c4a6e',
                    margin: '0 0 12px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>💡</span>
                    <span>활용 팁</span>
                  </h5>
                  <ul style={{
                    margin: 0,
                    paddingLeft: 'clamp(18px, 3vw, 22px)',
                    color: '#0c4a6e',
                    lineHeight: '1.9',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    <li>이 JSON 형식을 그대로 사용하거나, 브랜드명과 배경을 변경하여 활용하세요</li>
                    <li><strong>Google Veo, Runway Gen-3, Pika Labs</strong>에서 모두 사용 가능합니다</li>
                    <li>각 필드(<code>description</code>, <code>style</code>, <code>elements</code> 등)를 수정하여 원하는 영상을 커스터마이징</li>
                    <li>생성된 영상은 유튜브 광고, SNS 마케팅에 바로 활용할 수 있습니다</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div
                style={{
                  fontSize: 'clamp(0.95rem, 2vw, 1rem)',
                  lineHeight: '1.8',
                  color: '#334155'
                }}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            )}
          </div>
        ))}

        {/* 완료 버튼 */}
        <div style={{
          background: 'white',
          borderRadius: 'clamp(12px, 3vw, 16px)',
          padding: 'clamp(30px, 6vw, 40px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          textAlign: 'center'
        }}>
          <Award size={window.innerWidth < 640 ? 36 : 48} color="#0ea5e9" style={{ marginBottom: 'clamp(15px, 3vw, 20px)' }} />
          <h3 style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: 'clamp(12px, 2.5vw, 15px)',
            lineHeight: '1.3'
          }}>
            {isDayCompleted ? '🎉 전체 과정 수료!' : '강의를 완료하셨나요?'}
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: 'clamp(20px, 4vw, 25px)',
            fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)',
            lineHeight: '1.6',
            padding: '0 clamp(10px, 2vw, 0)'
          }}>
            {isDayCompleted
              ? '축하합니다! ChatGPT 에이전트 기초 과정을 모두 완료하셨습니다!'
              : '강의를 모두 시청하셨다면 완료 버튼을 눌러주세요.'}
          </p>
        <button
            onClick={handleCompleteDay}
            disabled={isCompletingDay || isDayCompleted}
          style={{
              background: isDayCompleted
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            color: 'white',
            border: 'none',
              padding: 'clamp(12px, 2.5vw, 15px) clamp(30px, 6vw, 40px)',
            fontSize: 'clamp(1rem, 2.2vw, 1.1rem)',
            fontWeight: '700',
              borderRadius: 'clamp(10px, 2vw, 12px)',
              cursor: (isCompletingDay || isDayCompleted) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
              opacity: (isCompletingDay || isDayCompleted) ? 0.7 : 1,
              width: window.innerWidth < 640 ? '100%' : 'auto',
              maxWidth: '400px'
          }}
            onMouseEnter={(e) => {
              if (!isCompletingDay && !isDayCompleted) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
              }
          }}
            onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.3)';
          }}
        >
            {isCompletingDay ? '처리 중...' : isDayCompleted ? '✅ 수료 완료!' : 'Day 10 완료하기'}
        </button>

          {isDayCompleted && (
            <div style={{
              marginTop: 'clamp(25px, 5vw, 30px)',
              background: '#f0fdf4',
              borderLeft: 'clamp(3px, 0.8vw, 4px) solid #10b981',
              padding: 'clamp(15px, 3vw, 20px)',
              borderRadius: '8px',
              textAlign: 'left'
            }}>
              <p style={{
                fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)',
                lineHeight: '1.8',
                color: '#065f46',
                margin: 0
              }}>
                🎓 <strong>다음 단계:</strong> 이제 실전에서 수익화를 시작하세요! 
                유튜브 커뮤니티에서 다른 수강생들의 작품도 확인해보세요.
              </p>
            </div>
          )}
      </div>
      </main>
    </div>
  );
};

export default Day10Page;

