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

// 학습 진도 저장
export const saveProgress = (lessonId: number, completed: boolean) => {
  const progress = getProgress();
  progress[lessonId] = completed;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
};

// 학습 진도 불러오기
export const getProgress = (): Record<number, boolean> => {
  const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
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

// 퀴즈 결과 저장
export const saveQuizResult = (lessonId: number, score: number, passed: boolean) => {
  const quizProgress = getQuizProgress();
  quizProgress[lessonId] = { score, passed, completedAt: new Date().toISOString() };
  localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(quizProgress));
};

// 퀴즈 진도 불러오기
export const getQuizProgress = (): Record<number, { score: number; passed: boolean; completedAt: string }> => {
  const saved = localStorage.getItem(QUIZ_PROGRESS_KEY);
  return saved ? JSON.parse(saved) : {};
};

export const aiBusinessCourse: Course = {
  id: 'ai-business-mastery',
  title: 'AI 비즈니스 마스터리',
  description: 'AI를 활용한 실전 비즈니스 전략! 스타트업부터 대기업까지 성공 사례와 실무 노하우',
  category: 'AI 비즈니스',
  instructor: 'AI 멘토 JAY',
  rating: 4.8,
  studentCount: 89,
  totalDuration: '24시간',
  price: 199000, // 19만 9천원
  isPaid: true,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  lessons: [
    {
      id: 1,
      title: '1강. AI 비즈니스 시장 분석',
      duration: '45분',
      completed: false,
      description: 'AI 비즈니스 트렌드와 시장 기회 분석. 성공 기업들의 AI 도입 전략을 심층 분석합니다.',
      videoUrl: 'https://youtu.be/sample1',
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
            question: 'AI 비즈니스에서 가장 중요한 성공 요소는?',
            options: ['기술력', '데이터', '비즈니스 모델', '모든 것'],
            correctAnswer: 3,
            explanation: 'AI 비즈니스 성공을 위해서는 기술, 데이터, 비즈니스 모델이 모두 중요합니다.'
          }
        ]
      }
    },
    {
      id: 2,
      title: '2강. AI 스타트업 창업 전략',
      duration: '50분',
      completed: false,
      description: 'AI 스타트업 창업부터 투자 유치까지. 실제 성공 사례를 통한 실전 가이드',
      videoUrl: 'https://youtu.be/sample2'
    },
    {
      id: 3,
      title: '3강. 기업 AI 도입 컨설팅',
      duration: '40분',
      completed: false,
      description: '기존 기업의 AI 도입 전략. ROI 분석부터 조직 변화 관리까지',
      videoUrl: 'https://youtu.be/sample3'
    },
    {
      id: 4,
      title: '4강. AI 제품 기획 & 개발',
      duration: '55분',
      completed: false,
      description: 'AI 제품의 기획부터 출시까지. MVP 개발과 시장 검증 방법론',
      videoUrl: 'https://youtu.be/sample4'
    },
    {
      id: 5,
      title: '5강. AI 마케팅 & 세일즈',
      duration: '35분',
      completed: false,
      description: 'AI 제품의 마케팅 전략과 B2B 세일즈. 고객 니즈 분석과 제안 방법',
      videoUrl: 'https://youtu.be/sample5'
    }
  ]
};

export const allCourses = [chatGPTCourse, aiBusinessCourse]; 