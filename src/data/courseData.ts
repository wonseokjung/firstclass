import { Course } from '../types';

export const chatGPTCourse: Course = {
  id: 'chatgpt-basics',
  title: 'ChatGPT의 정석',
  description: 'AI 멘토 JAY와 함께하는 ChatGPT 완전정복! 왕초보도 쉽게 배우는 체계적인 커리큘럼',
  category: 'AI 기초',
  instructor: 'AI 멘토 JAY',
  rating: 4.9,
  studentCount: 342,
  totalDuration: '15시간 30분',
  price: 0, // 무료
  isPaid: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  lessons: [
    {
      id: 1,
      title: '1강. [AI왕기초] 최신 2025 ver. ChatGPT 챗지피티 완전 입력문 가이드',
      duration: '26분',
      completed: false,
      description: 'GPT 완전 정복! 2025년 최신 버전별 차이 총정리. GPT-3.5부터 GPT-4(o1), GPT-mini까지 전격 비교! 무료/유료 차이부터 모바일 사용법, Sora 연동까지 완벽 정리.',
      videoUrl: 'https://youtu.be/CsIwEXMiRFc',
      hasQuiz: true,
      quiz: {
        id: 1,
        lessonId: 1,
        requiredScore: 70,
        timeLimit: 5,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'ChatGPT를 처음 사용할 때 가장 먼저 해야 할 설정은 무엇인가요?',
            options: ['계정 생성 및 로그인', '유료 구독 결제', '플러그인 설치', '모바일 앱 다운로드'],
            correctAnswer: 0,
            explanation: 'ChatGPT 사용을 위해서는 먼저 OpenAI 계정을 생성하고 로그인해야 합니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'ChatGPT 무료 버전으로도 충분히 실무에 활용할 수 있습니다.',
            correctAnswer: 1,
            explanation: 'ChatGPT 무료 버전도 텍스트 생성, 번역, 요약 등 다양한 실무 작업에 충분히 활용 가능합니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: 'ChatGPT 사용 시 개인정보 보호를 위해 피해야 할 행동은?',
            options: ['일반적인 질문하기', '개인정보 입력하기', '창의적 아이디어 요청', '학습 도움 요청'],
            correctAnswer: 1,
            explanation: '개인정보, 비밀번호, 금융정보 등은 ChatGPT에 입력하지 않는 것이 안전합니다.'
          }
        ]
      }
    },
    {
      id: 2,
      title: '2강. [GPT] ChatGPT로 내 사진을 애니메이션처럼 3초만에!? 직접 해봤습니다!',
      duration: '21분',
      completed: false,
      description: '📸 내 사진을 애니메이션처럼 바꾸는 방법을 직접 해보세요! 2025년 최신 GPT 4.5로 실사 사진을 감성 일러스트로 변환하고, 휴대폰 배경화면으로 저장하는 전 과정을 쉽게 알려드립니다. 지브리풍, 짱구풍 등 다양한 스타일로 나만의 캐릭터 배경화면을 만들어보세요!',
      videoUrl: 'https://youtu.be/v5lMs-xGh8M',
      hasQuiz: true,
      quiz: {
        id: 2,
        lessonId: 2,
        requiredScore: 70,
        timeLimit: 5,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '이미지 스타일 변환을 위한 효과적인 프롬프트 구성 요소는?',
            options: ['색상만 지정', '스타일 + 구체적 설명', '간단한 단어 나열', '복잡한 기술 용어'],
            correctAnswer: 1,
            explanation: '원하는 스타일과 함께 구체적인 설명을 제공하면 더 정확한 결과를 얻을 수 있습니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '고품질 이미지 생성을 위해서는 원본 이미지의 해상도가 중요합니다.',
            correctAnswer: 1,
            explanation: '원본 이미지의 해상도가 높을수록 더 선명하고 디테일한 스타일 변환 결과를 얻을 수 있습니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: '휴대폰 배경화면용 이미지 생성 시 고려해야 할 가장 중요한 요소는?',
            options: ['색상 조합', '해상도 비율', '파일 용량', '모든 것'],
            correctAnswer: 3,
            explanation: '배경화면용 이미지는 색상 조합, 해상도 비율, 파일 용량을 모두 고려해야 최적의 결과를 얻을 수 있습니다.'
          }
        ]
      }
    },
    {
      id: 3,
      title: '3강. 사진만 찍으면 광고 포스터를 만들 수 있다고?',
      duration: '17분',
      completed: false,
      description: 'OpenAI의 최신 GPT-4o 이미지 생성 기능을 활용해 실제 업무나 콘텐츠 제작에 쓸 수 있는 고퀄리티 이미지를 만드는 방법을 배워보세요. 스마트폰으로 찍은 사진을 광고 이미지로 바꾸고, 3D툴 없이도 바로 쓸 수 있는 목업을 만들어보세요!',
      videoUrl: 'https://youtu.be/fdTEYuXtMWc',
      hasQuiz: true,
      quiz: {
        id: 3,
        lessonId: 3,
        requiredScore: 70,
        timeLimit: 5,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '광고 포스터 제작 시 가장 중요한 디자인 원칙은?',
            options: ['화려한 색상 사용', '메시지 전달의 명확성', '많은 정보 포함', '복잡한 디자인'],
            correctAnswer: 1,
            explanation: '광고 포스터는 한눈에 메시지가 전달되도록 명확하고 간결한 디자인이 가장 중요합니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '제품 사진을 광고용 이미지로 변환할 때는 브랜드 아이덴티티를 고려해야 합니다.',
            correctAnswer: 1,
            explanation: '브랜드의 색상, 폰트, 스타일을 일관되게 유지하는 것이 효과적인 마케팅을 위해 중요합니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: '실제 업무용 이미지 제작 시 저작권 문제를 피하는 방법은?',
            options: ['타인의 이미지 그대로 사용', '자체 촬영 후 AI 편집', '인터넷 이미지 무단 사용', '유명 브랜드 로고 사용'],
            correctAnswer: 1,
            explanation: '자체 촬영한 이미지를 AI로 편집하여 사용하는 것이 저작권 문제를 피하는 가장 안전한 방법입니다.'
          }
        ]
      }
    },
    {
      id: 4,
      title: '4강. [GPT] ChatGPT 스마트폰 모바일 200% 활용 노하우! 실시간 1:1 채팅까지!',
      duration: '17분',
      completed: false,
      description: '스마트폰 하나로 GPT를 200% 활용하는 꿀팁 대방출! 복잡한 설정 없이, 50-60대 분들도 쉽게 따라할 수 있습니다. 출퇴근길, 카페, 침대 위에서도 AI를 스마트폰만 있으면 완벽히 활용할 수 있는 실전 노하우를 소개합니다. 음성 대화, 영상통화, 화면 공유까지 모든 기능을 마스터하세요!',
      videoUrl: 'https://youtu.be/9h1ChIQnZ2E',
      hasQuiz: true,
      quiz: {
        id: 4,
        lessonId: 4,
        requiredScore: 70,
        timeLimit: 5,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '모바일에서 ChatGPT를 효과적으로 활용하기 위한 가장 중요한 팁은?',
            options: ['긴 텍스트 입력', '음성 입력 활용', '화면 크기 조절', '앱 재시작'],
            correctAnswer: 1,
            explanation: '모바일에서는 음성 입력을 활용하면 더 빠르고 편리하게 ChatGPT를 사용할 수 있습니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '모바일 ChatGPT는 출퇴근 시간, 이동 중에도 생산성을 높일 수 있는 좋은 도구입니다.',
            correctAnswer: 1,
            explanation: '모바일 ChatGPT를 활용하면 언제 어디서든 학습, 업무, 아이디어 정리 등을 할 수 있어 생산성이 크게 향상됩니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: '모바일 ChatGPT로 학습 효과를 높이는 방법은?',
            options: ['단순 검색만 하기', '대화형 학습 활용', '복사-붙여넣기만 하기', '짧은 질문만 하기'],
            correctAnswer: 1,
            explanation: '질문과 답변을 주고받으며 대화형으로 학습하면 이해도가 높아지고 기억에 더 오래 남습니다.'
          }
        ]
      }
    },
    {
      id: 5,
      title: '5강. [GPT] 챗GPT로 사주 이렇게 정확하다고? GPT로 사주보면 24시간 평생 무료!',
      duration: '13분',
      completed: false,
      description: '챗GPT를 활용해 나만의 "용한 사주팔자 도사" AI를 직접 만들어보는 방법을 배워보세요! 프롬프트 엔지니어링 기술 3가지(역할 프롬프트, 정보 요청 프롬프트, 생각의 연결고리 프롬프트)를 배우고, 실제로 적용해서 챗GPT가 사주를 봐주고 표로 정리해주고 심지어 그림까지 그려주는 과정을 체험해보세요!',
      videoUrl: 'https://youtu.be/Ds20PKvE_OE',
      hasQuiz: true,
      quiz: {
        id: 5,
        lessonId: 5,
        requiredScore: 70,
        timeLimit: 5,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '나만의 전문 GPT를 만들 때 가장 중요한 첫 번째 단계는?',
            options: ['데이터 수집', '명확한 역할 정의', '기술 공부', '사용자 모집'],
            correctAnswer: 1,
            explanation: 'GPT가 어떤 역할을 해야 하는지 명확하게 정의하는 것이 성공적인 AI 개발의 첫 걸음입니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '프롬프트 엔지니어링은 개발자가 아닌 일반인도 충분히 배울 수 있는 기술입니다.',
            correctAnswer: 1,
            explanation: '프롬프트 엔지니어링은 코딩 지식 없이도 논리적 사고와 명확한 표현으로 누구나 습득할 수 있습니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: 'AI에게 복잡한 작업을 시킬 때 효과적인 방법은?',
            options: ['한 번에 모든 것을 요청', '단계별로 나누어 요청', '짧게 요약해서 요청', '여러 번 반복 요청'],
            correctAnswer: 1,
            explanation: '복잡한 작업을 단계별로 나누어 요청하면 AI가 더 정확하고 체계적으로 작업을 수행할 수 있습니다.'
          }
        ]
      }
    },
    {
      id: 6,
      title: '6강. [GPT] 이 프롬프트 하나로 완전히 달라졌습니다! ChatGPT 10배 똑똑하게 쓰는 법!',
      duration: '20분',
      completed: false,
      description: 'ChatGPT를 10배 더 똑똑하게 사용하는 핵심 프롬프트 기법을 배워보세요! 제로샷, 퓨샷, 생각의 사슬, 롤 프롬프트 등 4가지 핵심 기술을 익히면 AI와의 대화가 완전히 달라집니다. 좋은 질문이 좋은 답변을 만든다는 원리를 실전 예시와 함께 체계적으로 학습하세요!',
      videoUrl: 'https://youtu.be/X39AlDrLY-E',
      hasQuiz: true,
      quiz: {
        id: 6,
        lessonId: 6,
        requiredScore: 70,
        timeLimit: 5,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '효과적인 프롬프트 작성을 위한 가장 기본적인 원칙은?',
            options: ['복잡하게 작성', '명확하고 구체적으로 작성', '짧게 작성', '어려운 용어 사용'],
            correctAnswer: 1,
            explanation: '명확하고 구체적인 프롬프트가 AI로부터 원하는 답변을 얻는 가장 기본적인 방법입니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '좋은 질문이 좋은 답변을 만든다는 것은 AI 활용에서 가장 중요한 원칙입니다.',
            correctAnswer: 1,
            explanation: '프롬프트의 질이 AI 답변의 질을 결정하므로, 질문을 잘 구성하는 것이 AI 활용의 핵심입니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: 'AI와 효과적으로 소통하기 위해 피해야 할 프롬프트 작성 방식은?',
            options: ['구체적인 예시 제공', '명확한 지시사항', '모호한 표현 사용', '단계별 설명'],
            correctAnswer: 2,
            explanation: '모호한 표현은 AI가 정확한 의도를 파악하기 어렵게 만들어 원하지 않는 결과를 초래할 수 있습니다.'
          }
        ]
      }
    },
    {
      id: 7,
      title: '7강. [GPT] ChatGPT에게 고민을 털어놨더니, 이런 대답이…',
      duration: '19분',
      completed: false,
      description: '앞으로 뭘 해야 할지 막막하고 미래가 불안한 당신을 위한 특별한 영상! 챗GPT를 "나만의 조력자"로 만들어 막연했던 미래를 구체적인 계획으로 설계하는 모든 과정을 공개합니다. 진로 상담부터 5년/10년 계획, 실행 가능한 스케줄까지 - 이 영상으로 인생 설계에 자신감을 얻어보세요!',
      videoUrl: 'https://youtu.be/u7B-aqlyc60',
      hasQuiz: true,
      quiz: {
        id: 7,
        lessonId: 7,
        requiredScore: 70,
        timeLimit: 5,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '인생 계획을 세울 때 가장 중요한 첫 번째 단계는?',
            options: ['구체적 목표 설정', '현재 상황 분석', '타인과 비교', '즉시 실행'],
            correctAnswer: 1,
            explanation: '성공적인 인생 계획을 위해서는 먼저 현재 자신의 상황을 정확히 분석하는 것이 중요합니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '장기 계획을 세울 때는 실행 가능한 단계별 목표로 나누어야 합니다.',
            correctAnswer: 1,
            explanation: '큰 목표를 달성하기 위해서는 실행 가능한 작은 단계들로 나누어 차근차근 접근하는 것이 효과적입니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: 'AI를 활용한 진로 상담의 장점은?',
            options: ['24시간 이용 가능', '개인 정보 보호', '객관적 관점 제공', '모든 것'],
            correctAnswer: 3,
            explanation: 'AI 진로 상담은 24시간 이용 가능하고, 개인 정보를 보호하며, 편견 없는 객관적 관점을 제공합니다.'
          }
        ]
      }
    },
    {
      id: 8,
      title: '8강. [챗GPT의정석]당신이 누른 "좋아요"가 챗GPT를 바꾸고 있습니다 (숨겨진 학습 원리)',
      duration: '11분',
      completed: false,
      description: '챗GPT의 "좋아요", "싫어요" 버튼의 진짜 기능을 알아보세요! 강화학습과 RLHF의 원리를 "강아지 훈련"에 비유하여 쉽게 설명합니다. AI가 똑똑해지는 근본 원리부터 보상 해킹까지 - 이 영상으로 AI 뉴스에 흔들리지 않는 전문가적 시각을 갖춰보세요!',
      videoUrl: 'https://youtu.be/MyU7c8Ya4MQ',
      hasQuiz: true,
      quiz: {
        id: 8,
        lessonId: 8,
        requiredScore: 70,
        timeLimit: 5,
                questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'AI가 학습하고 발전하는 과정에서 사용자 피드백이 중요한 이유는?',
            options: ['AI 속도 향상', '인간의 가치와 일치', '비용 절감', '기술적 완성도'],
            correctAnswer: 1,
            explanation: '사용자 피드백을 통해 AI가 인간의 가치와 기대에 맞는 방향으로 학습하고 발전할 수 있습니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '사용자가 AI에게 제공하는 피드백은 AI의 미래 성능 향상에 직접적인 영향을 미칩니다.',
            correctAnswer: 1,
            explanation: '사용자 피드백은 AI 모델의 학습 과정에서 중요한 신호로 작용하여 AI의 성능과 안전성을 향상시킵니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: 'AI 발전에 기여하는 사용자의 올바른 피드백 방식은?',
            options: ['무조건 좋아요만 누르기', '성의 없이 아무거나 누르기', '신중하고 정확한 평가', '피드백 안하기'],
            correctAnswer: 2,
            explanation: 'AI 발전을 위해서는 답변의 질을 신중하게 평가하고 정확한 피드백을 제공하는 것이 중요합니다.'
          }
        ]
       }
     },
     {
       id: 9,
       title: '9강. 친구도, 상담도 부담스러울 때 "내 편"이 되어주는 AI 친구 만드는 법',
       duration: '9분',
       completed: false,
       description: '일도, 인간관계도 지쳐서 누군가에게 털어놓고 싶지만 부담스럽다면? 세상에서 가장 안전하고 똑똑한 "비밀 친구" AI를 만들어보세요! 24시간 심리 상담사이자 스트레스 관리 파트너가 되어줄 AI 친구 만들기 프롬프트를 공개합니다. 더 이상 혼자 끙끙 앓지 마세요!',
       videoUrl: 'https://youtu.be/Gjwjs9v7bdc',
       hasQuiz: true,
       quiz: {
         id: 9,
         lessonId: 9,
         requiredScore: 70,
         timeLimit: 5,
                 questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'AI를 활용한 감정 지원에서 가장 중요한 장점은?',
            options: ['빠른 응답 속도', '24시간 이용 가능', '판단하지 않는 객관적 지원', '모든 것'],
            correctAnswer: 3,
            explanation: 'AI 감정 지원은 빠른 응답, 24시간 이용, 편견 없는 객관적 지원을 모두 제공합니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '스트레스 관리를 위해 AI를 활용하는 것은 전문적인 상담을 완전히 대체할 수 있습니다.',
            correctAnswer: 0,
            explanation: 'AI는 일상적인 스트레스 관리에 도움이 되지만, 심각한 정신건강 문제는 전문가의 도움이 필요합니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: '효과적인 감정 지원을 위한 AI 활용 방법은?',
            options: ['문제 회피하기', '감정 무시하기', '단계적 대화 진행', '빠른 해결책만 찾기'],
            correctAnswer: 2,
            explanation: '감정을 차근차근 탐색하고 단계적으로 대화를 진행하는 것이 효과적인 감정 지원 방법입니다.'
          }
        ]
       }
     }
    ]
  };

// 학습 진도 관리를 위한 로컬 스토리지 키
export const PROGRESS_STORAGE_KEY = 'chatgpt-course-progress';

// 임시 메모리 저장소 (세션 동안만 유지)
let tempProgress: Record<number, boolean> = {};

// 학습 진도 저장 (임시 메모리에만)
export const saveProgress = (lessonId: number, completed: boolean) => {
  tempProgress[lessonId] = completed;
  console.log('📚 학습 진도 저장 (메모리):', { lessonId, completed });
};

// 학습 진도 불러오기 (임시 메모리에서)
export const getProgress = (): Record<number, boolean> => {
  return tempProgress;
};

// 진도율 계산
export const calculateProgressPercentage = (): number => {
  const progress = getProgress();
  const completedCount = Object.values(progress).filter(Boolean).length;
  return Math.round((completedCount / chatGPTCourse.lessons.length) * 100);
};

// 완료된 강의 수 계산
export const getCompletedLessonsCount = (): number => {
  const progress = getProgress();
  return Object.values(progress).filter(Boolean).length;
};

// 퀴즈 진도 관리를 위한 로컬 스토리지 키
export const QUIZ_PROGRESS_KEY = 'chatgpt-quiz-progress';

// 임시 퀴즈 결과 저장소 (세션 동안만 유지)
let tempQuizProgress: Record<number, { score: number; passed: boolean; completedAt: string }> = {};

// 퀴즈 결과 저장 (임시 메모리에만)
export const saveQuizResult = (lessonId: number, score: number, passed: boolean) => {
  tempQuizProgress[lessonId] = { score, passed, completedAt: new Date().toISOString() };
  console.log('🎯 퀴즈 결과 저장 (메모리):', { lessonId, score, passed });
};

// 퀴즈 진도 불러오기 (임시 메모리에서)
export const getQuizProgress = (): Record<number, { score: number; passed: boolean; completedAt: string }> => {
  return tempQuizProgress;
};

export const aiBusinessCourse: Course = {
  id: 'ai-business-mastery',
  title: 'AI 비즈니스 전략',
  description: 'AI 시대 새로운 부의 창출 전략! AI 커머스부터 구독자 확보까지 실전 노하우 완전정복',
  category: 'AI 비즈니스',
  instructor: 'AI 멘토 JAY',
  rating: 4.9,
  studentCount: 1247,
  totalDuration: '5시간 52분',
  price: 0, // 무료
  isPaid: false,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  lessons: [
    {
      id: 1,
      title: '1강. [AI,새로운 부의 지도] AI 시대, 부의 규칙은 어떻게 바뀌었는가',
      duration: '1시간 5분',
      completed: false,
      description: 'AI 혁명은 단순히 새로운 도구의 등장이 아닌, 지난 수백 년간 이어져 온 부의 생성 규칙 자체를 바꾸고 있습니다. 노동의 대가로 돈을 버는 시대는 저물고, AI라는 생산수단을 통해 가치를 창출하는 새로운 자본가의 시대가 열렸습니다. 이 거대한 변화의 본질을 꿰뚫고, AI 커머스라는 구체적인 기회를 통해 새로운 부의 흐름에 합류하는 방법을 제시합니다.',
      videoUrl: 'https://youtu.be/3eGWEyW0Olc',
      hasQuiz: true,
      quiz: {
        id: 1,
        lessonId: 1,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'AI 시대에 부의 규칙이 바뀐 핵심 이유는 무엇인가요?',
            options: ['기술 발전', '노동에서 자본 중심으로 패러다임 전환', '글로벌 경제 변화', '코로나19 영향'],
            correctAnswer: 1,
            explanation: 'AI 시대는 노동의 대가로 돈을 버는 시대에서 AI라는 생산수단을 통해 가치를 창출하는 새로운 자본가의 시대로 패러다임이 전환되었습니다.'
          },
          {
            id: 2,
            type: 'multiple',
            question: 'AI 커머스의 핵심 수익 구조는?',
            options: ['광고 수익만', '제품 판매만', 'AI로 콘텐츠 생성 + 커머스 연결', '구독료 수익'],
            correctAnswer: 2,
            explanation: 'AI로 콘텐츠를 만들고 이를 커머스로 연결하는 새로운 수익 모델이 AI 커머스의 핵심입니다.'
          },
          {
            id: 3,
            type: 'true-false',
            question: '구글 VEO를 활용하면 광고 영상을 10분 만에 제작할 수 있습니다.',
            correctAnswer: 1,
            explanation: '영상에서 실제로 구글 VEO AI를 활용하여 광고 영상을 10분 만에 제작하는 실전 시연을 보여줍니다.'
          }
        ]
      }
    },
    {
      id: 2,
      title: '2강. [AI인사이트] 0원으로 구독자 1000명? 완전 무료 AI 구글 VEO2+Capcut',
      duration: '1시간 2분',
      completed: false,
      description: '유튜브 수익창출 요건인 구독자 1000명을 0원으로 달성하는 실전 전략! 틱톡, 30만 인스타그램, 4만 유튜브 채널을 키운 JAY의 콘텐츠 노하우를 공개합니다. 완전 무료 AI Veo + CapCut을 활용한 구독자 증가 전략과 알고리즘 분석을 통한 성공 사례를 직접 확인하세요.',
      videoUrl: 'https://youtu.be/1xVON92uhtI',
      hasQuiz: true,
      quiz: {
        id: 2,
        lessonId: 2,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '구독자 1000명 달성을 위해 가장 중요한 요소는?',
            options: ['운', '기획력과 실행력', '고가 장비', '유료 광고'],
            correctAnswer: 1,
            explanation: '영상에서 강조하는 것은 운이 아닌 체계적인 기획력과 꾸준한 실행력이 구독자 증가의 핵심임을 보여줍니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'CapCut은 완전 무료로 영상 편집이 가능한 도구입니다.',
            correctAnswer: 1,
            explanation: 'CapCut은 완전 무료로 사용할 수 있는 AI 편집 툴로, 초보자도 쉽게 전문적인 영상을 만들 수 있습니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: '알고리즘에 잘 노출되기 위한 핵심 전략은?',
            options: ['제목만 잘 만들기', '썸네일만 예쁘게', '글로벌 콘텐츠 트렌드 분석 + 로컬라이징', '많이 업로드하기'],
            correctAnswer: 2,
            explanation: '글로벌 콘텐츠 성공 사례를 분석하고 이를 한국 상황에 맞게 로컬라이징하는 것이 알고리즘 최적화의 핵심입니다.'
          }
        ]
      }
    },
    {
      id: 3,
      title: '3강. [AI인사이트] 0원으로 구독자 10,000명? 완전 무료 AI 챗지피티, 구글 VEO2, 노션',
      duration: '1시간 8분',
      completed: false,
      description: 'AI는 어렵다? 그건 예전 이야기입니다. 스마트폰만 있어도 누구나 인공지능을 활용해 삶을 바꿀 수 있어요! 복잡한 기술 설명 없이, 하루 10분이면 따라할 수 있는 AI 루틴을 소개합니다. 50, 60대도 바로 할 수 있는 AI 활용법으로 구독자 10,000명까지 도달하는 실전 가이드입니다.',
      videoUrl: 'https://youtu.be/x1_ZNsjhjPo',
      hasQuiz: true,
      quiz: {
        id: 3,
        lessonId: 3,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'AI 학습 원리를 활용한 습관 만들기의 핵심은?',
            options: ['한 번에 많이 하기', '매일 조금씩 꾸준히', '주말에 몰아서', '기분 좋을 때만'],
            correctAnswer: 1,
            explanation: 'AI 학습 원리처럼 매일 조금씩 꾸준히 하는 것이 습관 형성과 실력 향상의 핵심입니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'ChatGPT로 트렌드를 활용한 영상 기획이 가능합니다.',
            correctAnswer: 1,
            explanation: 'ChatGPT를 활용하면 현재 트렌드를 분석하고 이를 바탕으로 효과적인 영상 기획을 할 수 있습니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: '노션을 활용한 콘텐츠 관리의 장점은?',
            options: ['예쁜 디자인', '체계적인 계획 수립과 실행 관리', '무료 사용', '모든 것'],
            correctAnswer: 3,
            explanation: '노션은 예쁜 디자인, 체계적인 관리, 무료 사용 등 모든 장점을 가진 올인원 도구입니다.'
          }
        ]
      }
    },
    {
      id: 4,
      title: '4강. AI가 당신의 직업을 바꾸고 있습니다. 살아남는 사람은 이렇게 준비합니다',
      duration: '1시간 12분',
      completed: false,
      description: 'AI 시대가 불러온 일자리 지각변동에 어떻게 대비해야 할까요? 글로벌 빅테크 기업들의 대규모 구조조정부터 고연봉 지식 노동 직업의 대체까지, 위기 속에서도 발견할 수 있는 새로운 기회와 개인의 생존 전략을 제시합니다. 20대 신입사원부터 50~60대 베테랑까지 모두가 알아야 할 AI 시대 생존법입니다.',
      videoUrl: 'https://youtu.be/Ljw_3lL7oIE',
      hasQuiz: true,
      quiz: {
        id: 4,
        lessonId: 4,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'AI 시대에 가장 먼저 대체될 가능성이 높은 직업군은?',
            options: ['육체 노동직', '고연봉 지식 노동직', '서비스직', '창작직'],
            correctAnswer: 1,
            explanation: '영상에서는 고연봉 지식 노동직이 AI에 의해 가장 먼저 대체될 가능성이 높다고 설명합니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'AI 시대에는 인간 10명이 하던 일을 AI 활용 능력을 갖춘 1명이 해낼 수 있습니다.',
            correctAnswer: 1,
            explanation: '영상에서 강조하는 핵심 메시지로, AI를 활용할 수 있는 사람의 생산성이 극대화된다는 내용입니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: 'AI 시대 개인의 최고 생존 전략은 무엇인가요?',
            options: ['기존 스킬 강화', 'AI 공부하기', '직업 바꾸기', '은퇴 준비'],
            correctAnswer: 1,
            explanation: '영상에서는 AI를 공부하는 것이 현시대 최고의 생존 전략이라고 강조합니다.'
          }
        ]
      }
    },
    {
      id: 5,
      title: '5강. AI 하나로 10명 몫을 해낸다 – 생존하는 1인이 되는 법',
      duration: '1시간 25분',
      completed: false,
      description: 'AI 하나만으로도 10명이 하던 업무를 해내는 현실과 그 속에서 살아남기 위한 구체적 전략을 알려드립니다. AI 자동화를 통한 1인 기업/직장인이 갖춰야 할 핵심 역량과 실행 가능한 3단계 방법론을 제시합니다.',
      videoUrl: 'https://youtu.be/o69O3qJKC3c',
      hasQuiz: true,
      quiz: {
        id: 5,
        lessonId: 5,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'AI 시대 생존을 위한 3단계 방법론의 순서는?',
            options: ['활용 → 이해 → 일상화', '이해 → 활용 → 일상화', '일상화 → 이해 → 활용', '이해 → 일상화 → 활용'],
            correctAnswer: 1,
            explanation: 'AI 활용을 위한 체계적 접근은 이해 → 활용 → 일상화의 3단계로 진행됩니다.'
          },
          {
            id: 2,
            type: 'multiple',
            question: '영상에서 소개한 AI 자동화 도구가 아닌 것은?',
            options: ['ChatGPT', 'Cursor AI', 'Photoshop', 'Gemini'],
            correctAnswer: 2,
            explanation: 'ChatGPT, Cursor AI, Gemini는 AI 자동화 도구로 소개되었지만, Photoshop은 언급되지 않았습니다.'
          },
          {
            id: 3,
            type: 'true-false',
            question: '1인 기업과 직장인 모두에게 AI 역량이 필요하다고 강조합니다.',
            correctAnswer: 1,
            explanation: '영상에서는 1인 기업가와 직장인 구분 없이 모든 사람에게 AI 역량이 필수라고 강조합니다.'
          }
        ]
      }
    }
  ]
};

export const aiCodingCourse: Course = {
  id: 'ai-coding-mastery',
  title: 'AI 코딩 완전정복',
  description: 'AI를 활용한 차세대 코딩! GitHub Copilot부터 Claude까지 모든 AI 코딩 도구 마스터하기',
  category: 'AI Coding',
  instructor: 'AI 멘토 JAY',
  rating: 4.9,
  studentCount: 156,
  totalDuration: '5시간 34분',
  price: 0, // 무료
  isPaid: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  lessons: [
    {
      id: 1,
      title: '1강. 구글이 만든 "무료" 제미나이 CLI, 성능은 그냥 미쳤습니다',
      duration: '19분',
      completed: false,
      description: '웹사이트 외주 비용 수백만 원, 이제 정말 옛날이야기입니다. 구글이 공개한 역대급 무료 코딩 AI, 제미나이(Gemini) CLI를 실전 테스트! AI에게 채팅하듯 명령하는 것만으로 웹사이트를 만들고 전 세계에 배포까지. 홈페이지 제작 비용 때문에 사업을 망설이던 예비 창업가, 코딩 공부에 좌절했던 분들을 위한 필수 영상입니다.',
      videoUrl: 'https://youtu.be/6Ib1IeKXL6s',
      hasQuiz: true,
      quiz: {
        id: 1,
        lessonId: 1,
        requiredScore: 70,
        timeLimit: 5,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '제미나이 CLI의 설치 명령어는 무엇인가요?',
            options: ['npm install gemini', 'npm install -g @google/gemini-cli', 'pip install gemini-cli', 'yarn add gemini'],
            correctAnswer: 1,
            explanation: '제미나이 CLI는 "npm install -g @google/gemini-cli" 명령어로 전역 설치합니다.'
          },
          {
            id: 2,
            type: 'multiple',
            question: '제미나이 CLI로 웹사이트 개발하는 4단계 순서는?',
            options: ['설치 → 대화 → 코딩 → 배포', '기획 → 설치 → 코딩 → 테스트', '환경준비 → 설치 → 코딩 → 배포', '모두 정답'],
            correctAnswer: 2,
            explanation: '영상에서 소개한 순서는 1) 개발 환경 준비 2) AI 설치 & 첫 대화 3) AI와 채팅하며 쇼핑몰 만들기 4) 전 세계에 무료 공개(배포)입니다.'
          },
          {
            id: 3,
            type: 'true-false',
            question: '제미나이 CLI는 맥과 윈도우 모두에서 사용 가능합니다.',
            correctAnswer: 1,
            explanation: '제미나이 CLI는 크로스플랫폼으로 맥과 윈도우 모두에서 사용할 수 있습니다.'
          }
        ]
      }
    },
    {
      id: 2,
      title: '2강. 비용 0원, 1시간 만에 AI로 "돈 버는 사업"을 만들었습니다',
      duration: '1시간 45분',
      completed: false,
      description: '정말로 1시간 만에, 돈 한 푼 안 쓰고 사업을 만드는 것이 가능할까요? 코딩 1도 모르는 분들을 위해 구글 AI만으로 직접 도전! 아이디어 구상부터 실제 작동하는 웹사이트 개발, 전 세계 배포, 그리고 홍보 영상 제작까지 AI 비즈니스 챌린지의 모든 과정을 1초도 숨김없이 전부 공개합니다.',
      videoUrl: 'https://youtu.be/MRu12ldUCUg',
      hasQuiz: true,
      quiz: {
        id: 2,
        lessonId: 2,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '영상에서 1시간 만에 완성한 결과물은 무엇인가요?',
            options: ['모바일 앱', '실제 작동하는 웹사이트', 'PDF 문서', 'YouTube 채널'],
            correctAnswer: 1,
            explanation: '영상에서는 1시간 만에 실제 작동하는 웹사이트를 개발하고 전 세계에 배포하는 과정을 보여줍니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '이 프로젝트는 코딩 지식이 전혀 없어도 따라할 수 있습니다.',
            correctAnswer: 1,
            explanation: '영상은 "코딩 1도 모르는 여러분을 위해" 만들어졌으며, AI 도구만으로 개발하는 방법을 보여줍니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: 'AI 비즈니스 챌린지에 포함된 과정이 아닌 것은?',
            options: ['아이디어 구상', '웹사이트 개발', '전 세계 배포', '투자자 미팅'],
            correctAnswer: 3,
            explanation: '아이디어 구상, 웹사이트 개발, 전 세계 배포, 홍보 영상 제작은 포함되지만 투자자 미팅은 언급되지 않았습니다.'
          }
        ]
      }
    },
    {
      id: 3,
      title: '3강. 내가 50억짜리 AI 회사를 폐업하고 깨달은 "무자본 창업"의 모든 것',
      duration: '1시간 30분',
      completed: false,
      description: '50억 가치를 인정받았던 AI 스타트업을 제 손으로 폐업했습니다. 지난 4년간의 처절한 실패 경험을 통해, 왜 지금이 오히려 0원 무자본 창업의 역사상 가장 완벽한 골든타임인지 깨달았습니다. 과거 스타트업들이 왜 95%나 망할 수밖에 없었는지, 그리고 AI 시대에 당신이 그 실패를 반복하지 않기 위해 반드시 알아야 할 비밀을 모두 담았습니다.',
      videoUrl: 'https://youtu.be/tA06bsovpWw',
      hasQuiz: true,
      quiz: {
        id: 3,
        lessonId: 3,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '95%의 스타트업이 망하는 근본적인 원인과 관련된 개념은?',
            options: ['자금 부족', 'MVP & 아하! 모멘트', '경쟁 심화', '인재 부족'],
            correctAnswer: 1,
            explanation: '영상에서는 MVP(최소기능제품)와 아하! 모멘트의 부재가 95% 스타트업 실패의 근본 원인이라고 설명합니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '현재가 무자본 AI 창업의 골든타임이라고 주장합니다.',
            correctAnswer: 1,
            explanation: '영상에서는 AI 시대인 지금이 0원 무자본 창업의 역사상 가장 완벽한 골든타임이라고 강조합니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: 'AI 시대 창업의 가장 큰 장점은 무엇인가요?',
            options: ['높은 수익', '실패해도 무조건 이기는 게임', '쉬운 성공', '빠른 성장'],
            correctAnswer: 1,
            explanation: '영상 마지막 부분에서 "실패해도 당신이 무조건 이기는 게임인 이유"를 설명하며 이것이 AI 시대 창업의 핵심 장점임을 강조합니다.'
          }
        ]
      }
    },
    {
      id: 4,
      title: '4강. 0원으로 60분 만에 수익화! AI 비즈니스 만들기 실전',
      duration: '2시간 20분',
      completed: false,
      description: '단 60분 만에, 0원으로 바로 수익화 가능한 AI 비즈니스 만드는 방법을 실시간으로 공개합니다. Gemini CLI, Claude Code, Cursor AI — 3개의 최신 AI 툴을 직접 비교 분석해서, 가장 효율적으로 AI 수익화를 시작하는 노하우를 알려드립니다. AI 개발자가 아니어도, 프로그래밍 몰라도 썸네일부터 비즈니스 기획, 실행까지 바로 따라할 수 있는 라이브 실전편입니다.',
      videoUrl: 'https://youtube.com/live/G1rbCTjp26I',
      hasQuiz: true,
      quiz: {
        id: 4,
        lessonId: 4,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '영상에서 비교 분석하는 3개의 최신 AI 툴은?',
            options: ['ChatGPT, Bard, Claude', 'Gemini CLI, Claude Code, Cursor AI', 'VEO, Runway, Sora', 'Notion, Figma, Canva'],
            correctAnswer: 1,
            explanation: 'Gemini CLI, Claude Code, Cursor AI 3개의 최신 AI 툴을 직접 비교 분석한다고 명시되어 있습니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '이 강의는 AI 개발자나 프로그래밍 지식이 있어야만 들을 수 있습니다.',
            correctAnswer: 0,
            explanation: '"AI 개발자가 아니어도, 프로그래밍 몰라도 OK!"라고 명시되어 있어 초보자도 충분히 따라할 수 있습니다.'
          },
          {
            id: 3,
            type: 'multiple',
            question: '이 실전편에서 다루는 범위는?',
            options: ['기획만', '개발만', '썸네일부터 비즈니스 기획, 실행까지', '마케팅만'],
            correctAnswer: 2,
            explanation: '썸네일부터 비즈니스 기획, 실행까지 전체 프로세스를 모두 다루는 종합 실전편입니다.'
          }
        ]
      }
    }
  ]
};

// 프리미엄 강의 데이터 (9월 1일 런칭 예정)
export const premiumCourse: Course = {
  id: 'jungwonseok-prompt-engineering-master',
  title: '프롬프트의정석',
  description: '🚀 ChatGPT부터 Claude, Gemini까지! AI와 완벽한 소통을 위한 프롬프트 엔지니어링 완전 마스터',
  category: '정원석의 정석',
  instructor: '정원석',
  rating: 5.0,
  studentCount: 0, // 신규 강의
  totalDuration: '26시간',
  price: 299000,
  isPaid: true,
  createdAt: new Date('2024-09-01'),
  updatedAt: new Date('2024-09-01'),
  lessons: [
    {
      id: 1,
      title: '1강. 🔥 프롬프트 엔지니어링 기초 - AI와 소통하는 새로운 언어',
      duration: '75분',
      completed: false,
      description: '🚀 프롬프트 엔지니어링의 핵심 원리부터 AI 모델별 특성까지! ChatGPT, Claude, Gemini를 완벽하게 다루는 기초 이론',
      videoUrl: 'https://youtu.be/example1',
      hasQuiz: true,
      quiz: {
        id: 1,
        lessonId: 1,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '프롬프트 엔지니어링에서 가장 중요한 요소는?',
            options: ['명확한 지시사항', '긴 문장', '복잡한 단어', '감정적 표현'],
            correctAnswer: 0,
            explanation: '명확하고 구체적인 지시사항이 AI로부터 원하는 결과를 얻는 가장 중요한 요소입니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '모든 AI 모델에 동일한 프롬프트를 사용해도 됩니다.',
            correctAnswer: 0,
            explanation: 'ChatGPT, Claude, Gemini 등 각 AI 모델마다 고유한 특성이 있어 최적화된 프롬프트가 필요합니다.'
          }
        ]
      }
    },
    {
      id: 2,
      title: '2강. 🤖 ChatGPT 프롬프트 마스터 - 세계 1위 AI와의 완벽한 대화',
      duration: '90분',
      completed: false,
      description: '💡 GPT-4의 숨겨진 능력을 100% 끌어내는 고급 프롬프트 기법! 온도, 토큰, 컨텍스트 윈도우까지 완전 마스터',
      videoUrl: 'https://youtu.be/example2',
      hasQuiz: true,
      quiz: {
        id: 2,
        lessonId: 2,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '효과적인 프롬프트의 핵심 요소는?',
            options: ['길게 쓰기', '명확한 역할과 맥락 제공', '복잡한 언어 사용', '여러 질문 동시에'],
            correctAnswer: 1,
            explanation: '명확한 역할과 맥락을 제공하는 것이 AI로부터 원하는 답변을 얻는 핵심입니다.'
          }
        ]
      }
    },
    {
      id: 3,
      title: '3강. ⚡ Claude 최적화 프롬프트 - Anthropic AI의 숨은 강자',
      duration: '85분',
      completed: false,
      description: '⚡ Claude의 긴 컨텍스트와 정교한 추론 능력 완전 활용! Constitutional AI 특성을 활용한 안전하고 정확한 프롬프트',
      videoUrl: 'https://youtu.be/example3',
      hasQuiz: true
    },
    {
      id: 4,
      title: '4강. 🏢 Google Gemini 프롬프트 전략 - 멀티모달의 새로운 가능성',
      duration: '80분',
      completed: false,
      description: '🤖 Gemini의 텍스트+이미지+코드 통합 처리 능력 극대화! 구글 생태계와 연동한 실무 프롬프트 패턴',
      videoUrl: 'https://youtu.be/example4',
      hasQuiz: true,
      quiz: {
        id: 4,
        lessonId: 4,
        requiredScore: 80,
        timeLimit: 15,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'AI 에이전트 구축에 가장 중요한 요소는?',
            options: ['복잡한 알고리즘', '명확한 업무 정의', '고성능 서버', '비싼 도구'],
            correctAnswer: 1,
            explanation: 'AI 에이전트가 수행할 업무를 명확하게 정의하는 것이 성공적인 자동화의 핵심입니다.'
          }
        ]
      }
    },
    {
      id: 5,
      title: '5강. 🎨 Chain-of-Thought 프롬프팅 - AI 사고과정 설계의 예술',
      duration: '100분',
      completed: false,
      description: '🎨 단계적 추론과 논리적 사고 체계 구축! Zero-Shot-CoT, Few-Shot-CoT, Tree of Thoughts까지 고급 사고 패턴',
      videoUrl: 'https://youtu.be/example5',
      hasQuiz: true
    },
    {
      id: 6,
      title: '6강. 💼 Few-Shot & Zero-Shot 러닝 - 최소한의 예시로 최대 효과',
      duration: '85분',
      completed: false,
      description: '💼 적은 예시로 완벽한 결과 만들기! In-Context Learning 원리와 효과적인 예시 설계 전략 완전 마스터',
      videoUrl: 'https://youtu.be/example6',
      hasQuiz: true,
      quiz: {
        id: 6,
        lessonId: 6,
        requiredScore: 80,
        timeLimit: 12,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '고객응대 자동화에서 가장 중요한 원칙은?',
            options: ['완전 자동화', '개인화된 응답', '빠른 처리', '저렴한 비용'],
            correctAnswer: 1,
            explanation: '고객마다 다른 상황과 니즈에 맞는 개인화된 응답이 고객만족도를 높이는 핵심입니다.'
          }
        ]
      }
    },
    {
      id: 7,
      title: '7강. 🔗 역할 기반 프롬프트 설계 - AI를 전문가로 만드는 기술',
      duration: '95분',
      completed: false,
      description: '🛠️ 페르소나 설정과 역할 부여의 과학! 마케터, 개발자, 분석가 등 전문가 AI로 변신시키는 고급 기법',
      videoUrl: 'https://youtu.be/example7',
      hasQuiz: true
    },
    {
      id: 8,
      title: '8강. 📊 비즈니스 프롬프트 템플릿 - 실무 직접 적용 가능한 황금 패턴',
      duration: '105분',
      completed: false,
      description: '💰 기획서, 제안서, 분석 보고서까지! 실제 업무에서 바로 사용할 수 있는 검증된 프롬프트 템플릿 100선',
      videoUrl: 'https://youtu.be/example8',
      hasQuiz: true,
      quiz: {
        id: 8,
        lessonId: 8,
        requiredScore: 85,
        timeLimit: 15,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'AI 자동화 서비스 수익화에서 가장 중요한 요소는?',
            options: ['고급 기술력', '고객의 진짜 문제 해결', '저렴한 가격', '빠른 출시'],
            correctAnswer: 1,
            explanation: '고객이 실제로 겪는 문제를 명확히 해결해주는 서비스가 지속적인 수익을 만들어냅니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'AI 자동화 서비스는 한 번 만들면 수정이 어렵습니다.',
            correctAnswer: 0,
            explanation: 'AI 자동화 서비스는 지속적인 개선과 최적화가 가능하며, 이것이 경쟁력의 핵심입니다.'
          }
        ]
      }
    },
    {
      id: 9,
      title: '9강. 🌐 창작 & 콘텐츠 프롬프트 - 아이디어를 현실로 만드는 마법',
      duration: '90분',
      completed: false,
      description: '🌐 블로그, 영상 스크립트, 카피라이팅까지! 창의적 콘텐츠 제작을 위한 프롬프트 전략과 브레인스토밍 기법',
      videoUrl: 'https://youtu.be/example9',
      hasQuiz: true,
      quiz: {
        id: 9,
        lessonId: 9,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '웹 스크래핑 에이전트 구축에서 가장 중요한 고려사항은?',
            options: ['속도', '정확성', '법적 준수', '모든 것'],
            correctAnswer: 3,
            explanation: '웹 스크래핑은 속도, 정확성, 법적 준수 모든 면을 균형있게 고려해야 합니다.'
          }
        ]
      }
    },
    {
      id: 10,
      title: '10강. 💬 분석 & 데이터 프롬프트 - 숫자 속에 숨은 인사이트 발굴',
      duration: '110분',
      completed: false,
      description: '💬 복잡한 데이터도 쉽게! 통계 분석, 트렌드 해석, 시각화 가이드까지 데이터 분석 전문가 수준 프롬프트',
      videoUrl: 'https://youtu.be/example10',
      hasQuiz: true
    },
    {
      id: 11,
      title: '11강. 📈 코딩 & 개발 프롬프트 - AI와 함께하는 스마트 개발',
      duration: '115분',
      completed: false,
      description: '📈 디버깅부터 코드 리뷰까지! Python, JavaScript, SQL 등 모든 언어에서 활용 가능한 개발자 필수 프롬프트',
      videoUrl: 'https://youtu.be/example11',
      hasQuiz: true,
      quiz: {
        id: 11,
        lessonId: 11,
        requiredScore: 85,
        timeLimit: 12,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '효과적인 마케팅 자동화의 핵심은?',
            options: ['대량 발송', '개인화', '저비용', '빠른 속도'],
            correctAnswer: 1,
            explanation: '개인화된 메시지가 고객 참여도와 전환율을 크게 향상시킵니다.'
          }
        ]
      }
    },
    {
      id: 12,
      title: '12강. 🎯 마케팅 프롬프트 최적화 - 고객의 마음을 사로잡는 메시지',
      duration: '100분',
      completed: false,
      description: '🎯 타겟팅부터 캠페인 기획까지! SNS, 이메일, 광고 카피 제작을 위한 마케팅 전문가 수준 프롬프트 전략',
      videoUrl: 'https://youtu.be/example12',
      hasQuiz: true,
      quiz: {
        id: 12,
        lessonId: 12,
        requiredScore: 80,
        timeLimit: 15,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '영업 자동화에서 가장 중요한 요소는?',
            options: ['속도', '개인화', '데이터 품질', '모든 것'],
            correctAnswer: 3,
            explanation: '성공적인 영업 자동화는 속도, 개인화, 데이터 품질이 모두 조화를 이뤄야 합니다.'
          }
        ]
      }
    },
    {
      id: 13,
      title: '13강. 🔒 프롬프트 자동화 & API 연동 - 대량 처리의 자동화 혁명',
      duration: '120분',
      completed: false,
      description: '🔒 OpenAI API, Claude API 활용부터 자동화 워크플로우까지! 프롬프트를 시스템화해서 업무 효율 100배 향상',
      videoUrl: 'https://youtu.be/example13',
      hasQuiz: true
    },
    {
      id: 14,
      title: '14강. ⚖️ 멀티모달 프롬프트 - 이미지+텍스트 통합 처리의 예술',
      duration: '95분',
      completed: false,
      description: '⚖️ GPT-4V, Claude Vision까지! 이미지 분석, 차트 해석, 시각적 창작을 위한 차세대 프롬프트 기법',
      videoUrl: 'https://youtu.be/example14',
      hasQuiz: true,
      quiz: {
        id: 14,
        lessonId: 14,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'true-false',
            question: 'AI 에이전트는 한 번 배포하면 지속적인 모니터링이 불필요합니다.',
            correctAnswer: 0,
            explanation: 'AI 에이전트는 지속적인 모니터링과 개선이 필수적입니다.'
          }
        ]
      }
    },
    {
      id: 15,
      title: '15강. 🚀 프롬프트 평가 & 개선 - 성능을 극대화하는 최적화 전략',
      duration: '85분',
      completed: false,
      description: '🚀 A/B 테스트부터 성능 지표 측정까지! 프롬프트 품질을 객관적으로 평가하고 지속적으로 개선하는 과학적 방법론',
      videoUrl: 'https://youtu.be/example15',
      hasQuiz: true,
      quiz: {
        id: 15,
        lessonId: 15,
        requiredScore: 85,
        timeLimit: 12,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '대규모 AI 에이전트 배포에서 가장 중요한 고려사항은?',
            options: ['비용', '확장성', '보안', '모든 것'],
            correctAnswer: 3,
            explanation: '엔터프라이즈급 배포에서는 비용, 확장성, 보안을 모두 고려해야 합니다.'
          }
        ]
      }
    },
    {
      id: 16,
      title: '16강. 💰 프롬프트 엔지니어링 비즈니스 모델 - 전문가로 수익 창출하기',
      duration: '130분',
      completed: false,
      description: '💰 프롬프트 컨설팅부터 AI 서비스 개발까지! 프롬프트 엔지니어링 전문가로 월 천만원 수익 달성하는 완벽 로드맵',
      videoUrl: 'https://youtu.be/example16',
      hasQuiz: true,
      quiz: {
        id: 16,
        lessonId: 16,
        requiredScore: 90,
        timeLimit: 20,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'AI 에이전트 비즈니스에서 가장 중요한 성공 요소는?',
            options: ['기술력', '고객 문제 해결', '마케팅', '자본'],
            correctAnswer: 1,
            explanation: '고객의 실제 문제를 해결하는 것이 지속 가능한 비즈니스의 핵심입니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'AI 에이전트 서비스는 완벽하게 구축한 후 출시해야 합니다.',
            correctAnswer: 0,
            explanation: 'MVP로 시작해서 고객 피드백을 통해 지속적으로 개선하는 것이 효과적입니다.'
          }
        ]
      }
    }
  ]
};

// 프리미엄 강의 카드용 데이터
export const premiumClasses = [
  {
    id: 999,
    instructor: '정원석',
    description: '🚀 ChatGPT부터 Claude, Gemini까지! AI와 완벽한 소통을 위한 프롬프트 엔지니어링 완전 마스터',
    image: '/images/prompt-engineering-master.jpg',
    title: '정원석의 정석 시리즈 - 프롬프트 엔지니어링의 정석',
    price: 299000,
    originalPrice: 499000,
    isNew: true,
    isPremium: true,
    launchDate: '2024-09-01'
    }
];

export const vibeCodingCourse: Course = {
  id: 'vibe-coding-money-making',
  title: '바이브코딩으로 돈벌기 - Cursor AI 완전정복',
  description: '🚀 Cursor AI로 나 혼자 끝내는 1인 개발 수익화! 월 1000만원 수익 달성을 위한 실전 바이브코딩 마스터클래스',
  category: 'AI 바이브코딩',
  instructor: 'AI 멘토 JAY',
  rating: 4.9,
  studentCount: 89,
  totalDuration: '12시간 30분',
  price: 199000,
  isPaid: true,
  createdAt: new Date('2024-07-29'),
  updatedAt: new Date('2024-07-29'),
  lessons: [
    {
      id: 1,
      title: '1강. 🔥 바이브코딩이 뭔가요? Cursor AI로 혼자서 앱 만들어 돈벌기 시작',
      duration: '45분',
      completed: false,
      description: '바이브코딩의 정의부터 Cursor AI 설치, 첫 번째 수익형 앱까지! 월 1000만원 버는 1인 개발자들의 비밀을 공개합니다. 개발 경험 전혀 없어도 OK!',
      videoUrl: 'https://youtu.be/example-vibe1',
      hasQuiz: true,
      quiz: {
        id: 1,
        lessonId: 1,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '바이브코딩의 핵심 철학은 무엇인가요?',
            options: ['완벽한 코드 작성', '빠른 프로토타이핑과 수익화', '복잡한 알고리즘 구현', '대규모 팀 협업'],
            correctAnswer: 1,
            explanation: '바이브코딩은 완벽함보다는 빠른 실행과 검증, 그리고 실제 수익 창출에 중점을 둡니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'Cursor AI는 개발 경험이 없어도 사용할 수 있습니다.',
            correctAnswer: 1,
            explanation: 'Cursor AI는 자연어로 코드를 생성해주기 때문에 개발 경험이 없어도 충분히 활용 가능합니다.'
          }
        ]
      }
    },
    {
      id: 2,
      title: '2강. 💡 아이디어를 돈이 되는 앱으로 바꾸는 검증 프로세스',
      duration: '55분',
      completed: false,
      description: '좋은 아이디어는 많지만 돈이 되는 아이디어는 드뭅니다. MVP 설계부터 시장 검증까지, 실패하지 않는 앱 기획의 모든 것을 배워보세요.',
      videoUrl: 'https://youtu.be/example-vibe2',
      hasQuiz: true,
      quiz: {
        id: 2,
        lessonId: 2,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'MVP(Minimum Viable Product)의 가장 중요한 목적은?',
            options: ['완벽한 기능 구현', '빠른 시장 검증', '예쁜 디자인', '많은 기능 포함'],
            correctAnswer: 1,
            explanation: 'MVP는 최소한의 기능으로 시장의 반응을 빠르게 검증하는 것이 핵심 목적입니다.'
          }
        ]
      }
    },
    {
      id: 3,
      title: '3강. 🛠️ Cursor AI와 함께하는 실전 앱 개발 - Todo부터 커머스까지',
      duration: '1시간 20분',
      completed: false,
      description: 'Cursor AI의 진짜 파워를 경험해보세요! 간단한 Todo 앱부터 수익형 커머스 앱까지, 실제 개발 과정을 라이브로 진행합니다.',
      videoUrl: 'https://youtu.be/example-vibe3',
      hasQuiz: true,
      quiz: {
        id: 3,
        lessonId: 3,
        requiredScore: 80,
        timeLimit: 15,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'Cursor AI에서 효과적인 프롬프트 작성법은?',
            options: ['간단하게만 작성', '구체적이고 맥락이 있는 설명', '코드만 요청', '영어로만 작성'],
            correctAnswer: 1,
            explanation: '구체적인 요구사항과 맥락을 포함한 프롬프트가 더 정확한 코드를 생성합니다.'
          }
        ]
      }
    },
    {
      id: 4,
      title: '4강. 🎨 Figma MCP 연동으로 디자인을 코드로 바로 변환하기',
      duration: '50분',
      completed: false,
      description: 'Figma에서 디자인한 것을 바로 코드로! MCP(Model Context Protocol) 연동으로 디자인-개발 간 간극을 없애는 혁신적인 워크플로우를 경험하세요.',
      videoUrl: 'https://youtu.be/example-vibe4',
      hasQuiz: true
    },
    {
      id: 5,
      title: '5강. 🗄️ Supabase로 데이터베이스 없이 백엔드 구축하기',
      duration: '1시간 10분',
      completed: false,
      description: '복잡한 서버 구축은 이제 그만! Supabase로 인증, 데이터베이스, API를 한 번에 해결하고 확장 가능한 앱을 만들어보세요.',
      videoUrl: 'https://youtu.be/example-vibe5',
      hasQuiz: true,
      quiz: {
        id: 5,
        lessonId: 5,
        requiredScore: 80,
        timeLimit: 10,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'Supabase의 가장 큰 장점은?',
            options: ['무료 사용', 'PostgreSQL 기반', '복잡한 백엔드를 간단하게', '모든 것'],
            correctAnswer: 3,
            explanation: 'Supabase는 무료 사용 가능, PostgreSQL 기반의 안정성, 복잡한 백엔드 간소화 등 모든 장점을 제공합니다.'
          }
        ]
      }
    },
    {
      id: 6,
      title: '6강. 💰 수익화 전략 - SaaS, 커미션, 구독까지 모든 비즈니스 모델',
      duration: '1시간 5분',
      completed: false,
      description: '앱을 만들었다면 이제 돈을 벌어야죠! SaaS, 커미션, 구독, 광고 등 다양한 수익화 모델을 실제 사례와 함께 배워보세요.',
      videoUrl: 'https://youtu.be/example-vibe6',
      hasQuiz: true,
      quiz: {
        id: 6,
        lessonId: 6,
        requiredScore: 85,
        timeLimit: 15,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '1인 개발자에게 가장 적합한 초기 수익 모델은?',
            options: ['대규모 광고', '프리미엄 구독', '단순한 일회성 결제', 'B2B 영업'],
            correctAnswer: 2,
            explanation: '초기에는 복잡한 모델보다는 단순한 일회성 결제로 시작해서 점차 확장하는 것이 효과적입니다.'
          }
        ]
      }
    },
    {
      id: 7,
      title: '7강. 🚀 배포와 운영 - Vercel, Netlify로 5분만에 전세계 배포',
      duration: '40분',
      completed: false,
      description: '만든 앱을 전세계에 공개하세요! Vercel, Netlify를 활용한 초간단 배포부터 도메인 연결, HTTPS 설정까지 한 번에!',
      videoUrl: 'https://youtu.be/example-vibe7',
      hasQuiz: true
    },
    {
      id: 8,
      title: '8강. 📈 성장 해킹 - 사용자 확보부터 바이럴까지',
      duration: '1시간',
      completed: false,
      description: '좋은 앱을 만들었다면 이제 사람들이 알아야 합니다. Product Hunt 런칭, 소셜미디어 마케팅, 바이럴 기법까지 실전 그로스 해킹을 배워보세요.',
      videoUrl: 'https://youtu.be/example-vibe8',
      hasQuiz: true,
      quiz: {
        id: 8,
        lessonId: 8,
        requiredScore: 80,
        timeLimit: 12,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: 'Product Hunt 런칭의 핵심 성공 요소는?',
            options: ['완벽한 제품', '사전 커뮤니티 구축', '높은 가격', '복잡한 기능'],
            correctAnswer: 1,
            explanation: 'Product Hunt에서 성공하려면 런칭 전에 미리 관심있는 사용자들의 커뮤니티를 구축하는 것이 중요합니다.'
          }
        ]
      }
    },
    {
      id: 9,
      title: '9강. 🔧 유지보수와 확장 - 사용자 피드백을 코드로 바로 반영',
      duration: '45분',
      completed: false,
      description: '출시는 시작일 뿐! 사용자 피드백을 받아 Cursor AI로 빠르게 개선하고, 새로운 기능을 추가하는 지속 가능한 개발 프로세스를 익혀보세요.',
      videoUrl: 'https://youtu.be/example-vibe9',
      hasQuiz: true
    },
    {
      id: 10,
      title: '10강. 💎 실전 프로젝트 - 30분만에 수익형 앱 만들어 런칭하기',
      duration: '1시간 30분',
      completed: false,
      description: '🔥 최종 실전 미션! 아이디어 기획부터 개발, 배포, 마케팅까지 모든 과정을 30분만에 완주하는 극한의 바이브코딩 챌린지입니다!',
      videoUrl: 'https://youtu.be/example-vibe10',
      hasQuiz: true,
      quiz: {
        id: 10,
        lessonId: 10,
        requiredScore: 90,
        timeLimit: 20,
        questions: [
          {
            id: 1,
            type: 'multiple',
            question: '바이브코딩으로 성공하기 위한 가장 중요한 마인드셋은?',
            options: ['완벽주의', '빠른 실행과 반복', '복잡한 계획', '혼자만의 작업'],
            correctAnswer: 1,
            explanation: '바이브코딩의 핵심은 완벽함을 추구하기보다는 빠르게 만들고, 테스트하고, 개선하는 반복적인 과정입니다.'
          },
          {
            id: 2,
            type: 'true-false',
            question: '1인 개발자도 월 1000만원 이상의 수익을 올릴 수 있습니다.',
            correctAnswer: 1,
            explanation: '실제로 많은 1인 개발자들이 바이브코딩 방식으로 월 1000만원 이상의 수익을 달성하고 있습니다.'
          }
        ]
      }
    }
  ]
};

export const allCourses = [chatGPTCourse, aiBusinessCourse, aiCodingCourse, premiumCourse]; 