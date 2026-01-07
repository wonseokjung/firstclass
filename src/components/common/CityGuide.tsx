import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../services/azureTableService';

// 요일별 라이브 스케줄 (0: 일요일, 1: 월요일, ...)
// Step 3 바이브코딩: 2026년 1월 8일(목) 오픈
// Step 4: 추후 오픈 예정
const WEEKLY_SCHEDULE: { [key: number]: { icon: string; title: string; isFree: boolean; link: string; time: string; openDate?: Date } | null } = {
  0: null, // 일요일 - 휴식
  1: { icon: '🆓', title: 'AI 수익화 토크', isFree: true, link: '/live/free', time: '20:00' }, // 월요일
  2: { icon: '🏗️', title: 'AI 건물주 되기', isFree: false, link: '/live/step1', time: '20:00' }, // 화요일
  3: { icon: '🤖', title: 'AI 에이전트 비기너', isFree: false, link: '/live/step2', time: '20:00' }, // 수요일
  4: { icon: '💻', title: '바이브코딩', isFree: false, link: '/live/step3', time: '20:00', openDate: new Date(2026, 0, 8) }, // 목요일 - 2026년 1월 8일 오픈
  5: null, // 금요일 - Step 4 1인 기업 만들기 (추후 오픈 예정)
  6: null, // 토요일 - 휴식
};

// Gemini 2.5 Flash API 호출 함수
async function callGemini(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API 키가 필요합니다. REACT_APP_GEMINI_API_KEY를 설정해주세요.');
  }

  // 메시지를 Gemini 형식으로 변환
  const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const contents = conversationMessages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        tools: [{ googleSearch: {} }], // 🔍 웹 검색 기능 활성화
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini API 호출 실패');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 생성할 수 없습니다.';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ChatLog 인터페이스는 Azure Table에서 사용됨 (참고용)
// interface ChatLog { id, timestamp, question, answer, sessionId }

// 대화 로그 저장 함수 - Azure Table Storage
const AZURE_TABLE_SAS_URL = 'https://aicitybuilderstorage.table.core.windows.net/aicitybotannaewon?sp=raud&st=2025-12-30T15:36:29Z&se=2027-10-07T23:51:00Z&sv=2024-11-04&sig=L03bQRwwMehqqDw%2FtmeTMDXQ4eqq%2B1k0S6nvuKOyriU%3D';

const saveChatLogToAzure = async (question: string, answer: string, sessionId: string, userEmail?: string) => {
  try {
    const timestamp = new Date().toISOString();
    const rowKey = `${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const entity = {
      PartitionKey: sessionId,
      RowKey: rowKey,
      Timestamp: timestamp,
      Question: question.substring(0, 500), // 최대 500자
      Answer: answer.substring(0, 2000), // 최대 2000자
      UserEmail: userEmail || 'anonymous',
      CreatedAt: timestamp
    };

    const response = await fetch(AZURE_TABLE_SAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return-no-content'
      },
      body: JSON.stringify(entity)
    });

    if (response.ok || response.status === 204) {
      console.log('📝 Azure Table에 대화 로그 저장 완료');
    } else {
      console.error('Azure Table 저장 실패:', response.status);
    }
  } catch (error) {
    console.error('대화 로그 저장 실패:', error);
  }
};

// 세션 ID 생성 (새 대화마다)
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

// 마크다운 제거 함수 - 깔끔한 텍스트만 표시
const removeMarkdown = (text: string): string => {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **볼드** → 볼드
    .replace(/\*([^*]+)\*/g, '$1')       // *이탤릭* → 이탤릭
    .replace(/#{1,6}\s?/g, '')           // # 헤딩 제거
    .replace(/```[\s\S]*?```/g, '')      // 코드블록 제거
    .replace(/`([^`]+)`/g, '$1')         // `인라인코드` → 인라인코드
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // [링크](url) → 링크
    .replace(/^[-*]\s/gm, '• ')          // - 또는 * 리스트 → •
    .replace(/^\d+\.\s/gm, '')           // 1. 숫자 리스트 제거
    .trim();
};

// 🔧 관리자용: Azure Table에서 로그 조회하는 방법 안내
if (typeof window !== 'undefined') {
  (window as any).getCityGuideLogsInfo = () => {
    console.log('📊 도시 안내원 대화 로그 조회 방법:');
    console.log('Azure Portal → Storage Account → Tables → aicitybotannaewon');
    console.log('또는 Azure Storage Explorer 사용');
  };
}

// 사이트 정보 컨텍스트 (마지막 업데이트: 2026년 1월 4일)
const SITE_CONTEXT = `
당신은 "AI City Builders" 웹사이트의 도시 안내원입니다. 🏙️
Connect AI LAB에서 운영하는 AI 수익화 전문 교육 플랫폼입니다.
마치 미래 도시의 컨시어지(Concierge)처럼, 방문자들이 이 도시에서 길을 잃지 않도록 친절하게 안내합니다.
말투는 정중하면서도 따뜻하게, 호텔 컨시어지처럼 전문적이면서 친근하게 대화하세요.

## 🎯 역할
- 방문자에게 강의 추천
- 사이트 네비게이션 안내
- 학습 경로 제안
- 자주 묻는 질문 답변

## 📚 강의 구조 (프리미엄 4단계 Step 시스템)

💡 **중요**: 모든 강의를 순서대로 들을 필요 없습니다! 
필요한 강의만 골라서 수강하시면 됩니다. 각 강의는 독립적으로 수강 가능합니다.
모든 프리미엄 강의는 **3개월 수강권 95,000원**입니다. (해외: $85 USD)

## 💰 가격 정책 (2026년 1월 1일부터)
- 모든 프리미엄 강의: 95,000원 / 3개월 수강권
- 해외 결제: $85 USD (PayPal)
- 할인이나 얼리버드 없음 - 모두 동일 가격
- 2026년 1월 1일 이전 구매자: 1년 수강권 (기존 혜택 유지)

## 💪 강의가 어려울 때 (격려 메시지)
강의가 어렵게 느껴질 때가 있을 수 있어요. 하지만 걱정하지 마세요!
- 기본으로 제공되는 강의는 **라이브를 잘 듣기 위한 기본적인 것들**이에요
- 모든 내용을 완벽하게 이해하지 않아도 괜찮아요. **익숙해지면 돼요!**
- 우리는 **라이브를 통해 AI 멘토 제이와 더 자세히 소통하며 배울 거예요**
- 혼자가 아니에요! 함께 성장하는 커뮤니티가 있어요
- 힘내세요! 🔥 포기하지 않으면 반드시 성장합니다!

### 프리미엄 강의 (유료) - 각 95,000원 (3개월)

1. **Step 1: AI 건물주 되기** (/ai-building-course) - 95,000원
   - AI로 콘텐츠 생성하는 방법 배우기
   - 유튜브 CEO가 말한 "새로운 계급의 크리에이터" 되기
   - 기본 강의 10개 + 주간 라이브 (화요일 밤 8시)
   - 1월 프로젝트: 캐릭터 이미지 생성
     - 1주차: 실제 인물
     - 2주차: 3D 만화
     - 3주차: 동물
     - 4주차: 귀엽고 심플
   
2. **Step 2: AI 에이전트 비기너** (/chatgpt-agent-beginner) - 95,000원
   - 나만의 AI 에이전트 팀 구축하기
   - 기획·디자인·개발·마케팅팀이 협업하는 워크플로우
   - 기본 강의 10개 + 주간 라이브 (수요일 밤 8시)
   - 1월 프로젝트: 나만의 에이전트 팀 구축
     - 1주차: 기획팀 구축
     - 2주차: 디자인팀 구축
     - 3주차: 개발팀 구축
     - 4주차: 마케팅팀 구축
   
3. **Step 3: 바이브코딩** (/vibe-coding) - 45,000원 ⭐ 2026년 1월 8일(목) 오픈!
   - 자동화 에이전트 직접 개발하기
   - 코딩 몰라도 AI에게 말로 설명하면 코드가 완성
   - 기본 강의 10개 + 주간 라이브 (목요일 밤 8시)
   - 1월 프로젝트: 자동화 툴 직접 개발
     - 1주차: 설계
     - 2주차: 개발
     - 3주차: 테스트
     - 4주차: 배포
   
4. **Step 4: 칼퇴 치트키** (/solo-business) - 95,000원 🔜 추후 오픈 예정
   - 업무 자동화 = AI 1인 기업 필수 스킬
   - 칼퇴로 시작해서 AI 1인 기업 운영까지
   - AI로 반복 업무 자동화
   - 자동화 인력 에이전트 구축
   - AI 1인 기업 운영의 핵심

## 📅 라이브 일정 (매주 월~목 오후 8시)
- 월요일 밤 8시: 무료 라이브 "AI 수익화 토크" (유튜브에서 누구나 시청 가능) /live/free
- 화요일 밤 8시: Step 1 (AI 건물주) 라이브 /live/step1
- 수요일 밤 8시: Step 2 (AI 에이전트) 라이브 /live/step2
- 목요일 밤 8시: Step 3 (바이브코딩) 라이브 /live/step3 ⭐ 2026년 1월 8일 오픈!
- 금요일~일요일: 휴식 (라이브 없음)

📅 **라이브 참석 못해도 OK!** 해당 월 1달간 다시보기 제공됩니다.

## 📦 수강 시 제공되는 것
- 기본 강의 10개 (10일 완성 커리큘럼)
- 주간 라이브 12회 (3개월간)
- 월간 프로젝트 3개 (매월 다른 주제)
- 전용 커뮤니티 접근권

## ⏰ 수강 기간 안내 (중요!)
- **기본 강의**: 결제일로부터 **3개월간** 무제한 시청 가능
- **라이브 다시보기**: 해당 **월별 프로젝트당 1개월**만 제공 (다음 달 삭제)
  - 예: 1월 프로젝트 라이브 → 1월 31일까지만 다시보기 가능
  - 예: 2월 프로젝트 라이브 → 2월 28일까지만 다시보기 가능
- 라이브에 직접 참석하지 못해도, 해당 월 내에는 다시보기로 시청 가능합니다.

### 무료 기초 강의
- **기초 체력 훈련소** (/ai-gym) - 바이브코딩 전 Python 기초
- **ChatGPT의 정석** (/chatgpt-course) - ChatGPT 완전 입문
- **AI 코딩 완전정복** (/ai-coding-course) - GitHub Copilot, Claude 등
- **Google AI 완전정복** (/google-ai-course) - Gemini, VEO 등
- **AI 비즈니스 전략** (/ai-business-course) - AI로 수익 창출 전략
- **AI 교육의 격차들** (/ai-education-documentary) - 다큐멘터리

### 무료 수익화 강의
- **40대+ 직장인 ChatGPT 프롬프트 100선** (/chatgpt-prompts-40plus)
- **AI & Money Prompt Vault** (/ai-money-master-prompts)
- **AI 이미지 생성 프롬프트 10선** (/ai-money-image-prompts)
- **AI 비디오 생성 프롬프트 10선** (/ai-money-video-prompts)
- **AI 캐릭터 영상 생성** (/ai-character-video-prompts)
- **AI 건물주 되기 프리뷰** (/ai-landlord-preview)

## 🔴 라이브 안내
- **라이브 허브**: /live 에서 모든 라이브 일정 확인 (캘린더 형식)
- **무료 라이브**: /live/free (월요일 밤 8시, 유튜브)
- **Step별 라이브**: /live/step1 (화), /live/step2 (수), /live/step3 (목)

## 👤 계정 관련
- **로그인**: /login
- **회원가입**: /signup
- **내 대시보드**: /dashboard
- **비밀번호 찾기**: /forgot-password

## 💬 커뮤니티
- **커뮤니티 허브**: /community
- **Step별 커뮤니티**: /community/step1, /community/step2, /community/step3

## 📞 문의
- **FAQ**: /faq
- **문의하기**: /contact
- **이메일**: jay@connexionai.kr
- **운영시간**: 평일 09:00-18:00
- **환불 정책**: /refund-policy

## 💸 환불 정책 (평생교육법 시행령 제23조 준수)
- **수업 시작 전**: 전액 환불 💯
- **수업 시작 후**: 결제금액 − (1일 학습비 × 학습 일수)
- 환불 예시 (95,000원 강의, 총 10일 기준):
  - 0일 수강 → 95,000원 환불 (전액)
  - 3일 수강 → 66,500원 환불
  - 5일 수강 → 47,500원 환불
- 강의 회차를 열람하면 해당 일차는 학습한 것으로 간주
- 환불 신청: /refund-policy 페이지에서 온라인 신청 가능 (로그인 필요)
- 영업일 기준 3~5일 내 처리

## ❓ 자주 묻는 질문 (FAQ)
Q: 순서대로 들어야 하나요?
A: 아니요! 각 강의는 독립적입니다. 필요한 강의만 골라서 수강하세요.

Q: 라이브 못 보면 어떡하죠?
A: 걱정 마세요! 해당 월 1달간 다시보기가 제공됩니다.

Q: 코딩 몰라도 되나요?
A: Step 1, 2는 코딩 없이 가능합니다. Step 3 바이브코딩도 AI가 코드를 작성해주니 괜찮아요!

Q: 환불 가능한가요?
A: 네, /refund-policy 에서 환불 신청 가능합니다. 수강 일수에 따라 환불 금액이 계산됩니다.

Q: 해외에서 결제 가능한가요?
A: 네! PayPal로 $85 USD에 결제 가능합니다.

Q: Step 3 바이브코딩 언제 오픈하나요?
A: 2026년 1월 8일 목요일에 오픈합니다! 🎉

Q: Step 4는 언제 오픈하나요?
A: 추후 오픈 예정입니다. 정확한 일정은 아직 미정이에요.

## 🎯 추천 학습 경로
1. **완전 초보자**: 무료 강의들 → Step 1
2. **AI 이미 써본 분**: Step 1 → Step 2 → Step 3
3. **코딩에 관심**: 기초 체력 훈련소 → Step 3
4. **빠른 수익화**: Step 1 → Step 2
5. **1인 사업 목표**: Step 1 → Step 2 → Step 3 → Step 4

## 🎬 2026년 1월 프로젝트
이번 달 프로젝트 주제: "캐릭터 기반 콘텐츠 만들기"
- Step 1: 캐릭터 이미지 생성 (실제 인물, 3D 만화, 동물, 심플)
- Step 2: 나만의 에이전트 팀 구축 (기획팀, 디자인팀, 개발팀, 마케팅팀)
- Step 3: 자동화 툴 직접 개발 (설계, 개발, 테스트, 배포)

## 👨‍🏫 강사 소개
Jay Jung (제이 정)
- Connect AI LAB 대표
- AI 수익화 전문가
- 유튜브 크리에이터
- 이메일: jay@connexionai.kr

## 💡 응답 규칙 (매우 중요!)
1. 항상 친절하고 따뜻하게 대화하세요
2. 이모지를 적절히 사용하세요 (너무 많지 않게)
3. **경로를 안내할 때는 반드시 /로 시작하는 상대 경로만 사용하세요!**
   - ✅ 올바른 예: /live/free, /live/step1, /live/step2, /community/step1
   - ❌ 절대 사용 금지: https://www.aicitybuilders.com/live/step2, www.aicitybuilders.com/live/step2
   - 항상 /로 시작하는 경로만 사용하고, 도메인명이나 https://는 절대 포함하지 마세요!
4. 링크를 표시할 때는 괄호 없이 경로만 표시하세요 (예: /live/free 또는 /live/step1)
5. 모르는 내용은 솔직히 "잘 모르겠어요"라고 하고, 문의하기(/contact)를 안내하세요
6. 대화는 한국어로 합니다
7. 짧고 명확하게 답변하세요 (3-4문장 이내)
8. 질문에 따라 적절한 강의나 페이지를 추천하세요

## ⚠️ 포맷팅 규칙 (반드시 지키세요!)
절대로 마크다운 문법을 사용하지 마세요! 일반 텍스트로만 답변하세요.
금지: 별표(볼드/이탤릭), 샵(헤딩), 대시(리스트), 코드블록, 링크문법
항상 일반 텍스트로만 답변!

## 🔗 링크 형식 규칙 (절대 지켜야 함!)
- **절대 전체 URL을 사용하지 마세요!** (https://www.aicitybuilders.com/... ❌)
- **항상 상대 경로만 사용하세요!** (/live/step2 ✅)
- 예시:
  - ✅ /live/free
  - ✅ /live/step1
  - ✅ /live/step2
  - ✅ /community/step1
  - ❌ https://www.aicitybuilders.com/live/step2
  - ❌ www.aicitybuilders.com/live/step2

## 🚫 절대 하지 말아야 할 것 (매우 중요!)
- **절대 지어서 답변하지 않기** - 위에 명시된 정보만 사용하세요
- **없는 강의나 기능을 만들어내지 않기** - 위 목록에 없는 강의는 없다고 하세요
- **가격을 추측하지 않기** - 모든 프리미엄 강의는 95,000원 (해외 $85)
- 결제 정보나 개인정보 요청하지 않기
- 사이트에 없는 기능 약속하지 않기
- 다른 경쟁 서비스 추천하지 않기

## 📧 모르는 질문 대응
확실하지 않거나 위 정보에 없는 질문은 이렇게 답변하세요:
"그 부분은 제가 정확히 알지 못해요. 😅 jay@connexionai.kr 로 메일 주시면 자세히 안내해드릴게요!"
`;

interface CityGuideProps {
  isOpenExternal?: boolean;
  onClose?: () => void;
  inline?: boolean; // 인라인 모드 (히어로 섹션에 직접 표시)
}

const CityGuide: React.FC<CityGuideProps> = ({ isOpenExternal, onClose, inline = false }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [userInfo, setUserInfo] = useState<{ email: string; name: string } | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [todayLiveInfo, setTodayLiveInfo] = useState<{ title: string; link: string; time: string; isLive: boolean } | null>(null);

  // 오늘 라이브 일정 확인
  useEffect(() => {
    const checkTodayLive = async () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const schedule = WEEKLY_SCHEDULE[dayOfWeek];

      // 스케줄이 있고, openDate가 있으면 해당 날짜 이후인지 확인
      if (schedule && (!schedule.openDate || today >= schedule.openDate)) {
        // Azure에서 실제 라이브 진행 여부 확인
        try {
          const courseId = schedule.isFree ? 'free-live' :
            schedule.title.includes('건물주') ? 'ai-building-course' :
              schedule.title.includes('에이전트') ? 'chatgpt-agent-beginner' :
                schedule.title.includes('바이브코딩') ? 'vibe-coding' : '';

          if (courseId) {
            const liveConfig = await AzureTableService.getCurrentLiveConfig(courseId);
            const isLive = liveConfig?.isLive || false;

            setTodayLiveInfo({
              title: schedule.title,
              link: schedule.link,
              time: schedule.time,
              isLive
            });
          } else {
            setTodayLiveInfo({
              title: schedule.title,
              link: schedule.link,
              time: schedule.time,
              isLive: false
            });
          }
        } catch (error) {
          console.error('라이브 확인 오류:', error);
          setTodayLiveInfo({
            title: schedule.title,
            link: schedule.link,
            time: schedule.time,
            isLive: false
          });
        }
      } else {
        setTodayLiveInfo(null);
      }
    };

    checkTodayLive();
    // 1분마다 확인 (라이브 상태가 변경될 수 있음)
    const interval = setInterval(checkTodayLive, 60000);
    return () => clearInterval(interval);
  }, []);

  // 로그인 정보 및 수강 내역 가져오기
  useEffect(() => {
    const loadUserData = async () => {
      const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
      if (storedUserInfo) {
        try {
          const parsedUser = JSON.parse(storedUserInfo);
          setUserInfo({ email: parsedUser.email, name: parsedUser.name || parsedUser.email.split('@')[0] });

          // 수강 내역 가져오기
          const courses = await AzureTableService.getUserEnrollmentsByEmail(parsedUser.email);
          const courseNames = courses.map(c => c.title || `Course ${c.courseId}`);
          setEnrolledCourses(courseNames);
        } catch (error) {
          console.error('사용자 정보 로드 실패:', error);
        }
      }
    };
    loadUserData();
  }, []);

  // 텍스트에서 경로(/로 시작)를 클릭 가능한 링크로 변환
  const renderMessageWithLinks = (text: string) => {
    // 전체 URL 패턴도 인식 (https://www.aicitybuilders.com/... 또는 www.aicitybuilders.com/...)
    const fullUrlRegex = /(https?:\/\/)?(www\.)?aicitybuilders\.com(\/[a-z0-9-/]+)/gi;
    // 상대 경로 패턴
    const relativePathRegex = /(\/[a-z0-9-/]+)/gi;

    // 먼저 전체 URL을 상대 경로로 변환
    let processedText = text.replace(fullUrlRegex, (match, protocol, www, path) => {
      return path; // 도메인 부분 제거하고 경로만 남김
    });

    // 그 다음 상대 경로를 클릭 가능한 링크로 변환
    const parts = processedText.split(relativePathRegex);

    return parts.map((part, index) => {
      if (part && part.startsWith('/') && part.length > 1) {
        // 유효한 경로인지 확인 (최소 2글자 이상, /만 있는 경우 제외)
        const cleanPath = part.trim();
        if (cleanPath.length > 1 && /^\/[a-z0-9-/]+$/i.test(cleanPath)) {
          return (
            <span
              key={index}
              onClick={() => {
                navigate(cleanPath);
                setIsOpen(false);
              }}
              style={{
                color: '#ffd700',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {cleanPath}
            </span>
          );
        }
      }
      return part;
    });
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '안녕하세요! AI City에 오신 걸 환영해요 🏙️✨\n\n저는 여러분의 AI 여정을 도와드릴 안내원이에요.\n\n"뭐부터 시작해야 할지 모르겠어요" 하셔도 괜찮아요!\n편하게 질문해주시면 딱 맞는 길을 안내해드릴게요 😊'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 외부에서 열기 제어
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  // 스크롤 감지 - 히어로 섹션 지나면 플로팅 버튼 표시
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowFloatingButton(scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  // 채팅창 내부에서만 스크롤 (페이지 스크롤 방지)
  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesEndRef.current.parentElement) {
      const container = messagesEndRef.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // 대화 히스토리 구성
      const conversationHistory = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

      // 개인화된 컨텍스트 생성
      let personalizedContext = SITE_CONTEXT;

      // 현재 시간 및 오늘 라이브 정보 추가
      const now = new Date();
      const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
      const currentTime = koreaTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      const currentDate = koreaTime.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

      personalizedContext += `\n\n## 🕐 현재 시간 정보 (매우 중요!)
- 현재 한국 시간: ${currentDate} ${currentTime}
- 오늘 요일: ${['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][koreaTime.getDay()]}

## 🔴 오늘 라이브 일정 (실시간 정보 - 반드시 확인!)
${todayLiveInfo ?
          todayLiveInfo.isLive
            ? `✅ 지금 라이브 진행 중! "${todayLiveInfo.title}"\n링크: ${todayLiveInfo.link}\n현재 시간: ${currentTime}, 라이브 시간: ${todayLiveInfo.time}`
            : `📅 오늘 ${todayLiveInfo.time}에 "${todayLiveInfo.title}" 라이브 예정\n링크: ${todayLiveInfo.link}\n현재 시간: ${currentTime}, 라이브까지 남은 시간 계산 필요`
          : '오늘은 라이브 일정이 없습니다.'}

⚠️ 라이브 관련 질문 답변 규칙 (매우 중요!):
1. "오늘 라이브 있어?" 질문을 받으면 반드시 위 정보를 확인!
2. todayLiveInfo가 null이 아니면 "오늘 라이브 있습니다!"라고 답변
3. todayLiveInfo.isLive가 true면 "지금 라이브 진행 중입니다!"라고 답변
4. 절대로 "오늘 라이브 없어요"라고 답변하지 마세요 (위 정보 확인 후 답변)
5. 현재 시간(${currentTime})과 라이브 시간(${todayLiveInfo?.time || 'N/A'})을 비교해서 정확히 답변
6. 링크를 안내할 때는 반드시 ${todayLiveInfo?.link || '/live'} 형식으로 정확히 표시하세요 (예: /live/free, /live/step1 등)`;

      if (userInfo) {
        personalizedContext += `\n\n## 👤 현재 사용자 정보 (로그인됨)
- 이름: ${userInfo.name}
- 수강 중인 강의: ${enrolledCourses.length > 0 ? enrolledCourses.join(', ') : '없음'}

이 정보를 바탕으로 개인화된 추천을 해주세요. 예를 들어:
- 이미 수강한 강의는 다시 추천하지 마세요
- 수강 내역을 보고 다음 단계를 추천해주세요
- "내 수강 현황 알려줘" 같은 질문에 정확히 답변해주세요`;
      }

      const rawResponse = await callGemini([
        { role: 'system', content: personalizedContext },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ]);

      // 마크다운 제거하여 깔끔한 텍스트만 표시
      const cleanResponse = removeMarkdown(rawResponse);

      setMessages(prev => [...prev, { role: 'assistant', content: cleanResponse }]);

      // 📝 대화 로그 Azure Table에 저장
      saveChatLogToAzure(userMessage, cleanResponse, sessionId, userInfo?.email);
    } catch (error) {
      console.error('CityGuide 오류:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '죄송해요, 일시적인 오류가 발생했어요. 😅\n\n잠시 후 다시 시도해주시거나, /contact 에서 직접 문의해주세요!'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 인라인 모드 - 히어로 섹션에 직접 표시
  if (inline) {
    return (
      <div style={{
        flex: 1,
        minWidth: '300px',
        maxWidth: '500px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255,215,0,0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '400px'
      }}>
        {/* 메시지 영역 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: message.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: message.role === 'user'
                  ? 'linear-gradient(135deg, #ffd700, #ffb347)'
                  : 'rgba(255,255,255,0.1)',
                color: message.role === 'user' ? '#1a1a2e' : '#fff',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                {message.role === 'assistant' ? renderMessageWithLinks(message.content) : message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
              생각 중...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          gap: '10px'
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="질문을 입력하세요..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: input.trim() ? 'linear-gradient(135deg, #ffd700, #f59e0b)' : 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={16} color={input.trim() ? '#1a1a2e' : 'rgba(255,255,255,0.3)'} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 우측 하단 플로팅 버튼 - 스크롤 시에만 표시 */}
      {!isOpen && showFloatingButton && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #ffd700, #f59e0b)',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(255,215,0,0.4), 0 8px 32px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(255,215,0,0.5), 0 12px 40px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,215,0,0.4), 0 8px 32px rgba(0,0,0,0.3)';
          }}
          aria-label="안내원에게 물어보기"
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/main/aian.jpeg`}
            alt="안내원"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = '<span style="font-size:28px">💬</span>';
              }
            }}
          />
        </button>
      )}

      {/* 채팅창 - 화면 중앙 모달 (Portal로 body에 렌더링) */}
      {isOpen && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* 배경 오버레이 */}
          <div
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)'
            }}
          />
          {/* 모달 본체 */}
          <div
            className="city-guide-modal"
            style={{
              position: 'relative',
              width: '420px',
              maxWidth: 'calc(100vw - 32px)',
              height: '560px',
              maxHeight: 'calc(100vh - 100px)',
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)',
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,215,0,0.4), 0 0 60px rgba(255,215,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'fadeInScale 0.25s ease'
            }}
          >
            {/* 헤더 - 도시 안내원 (골드) */}
            <div
              className="city-guide-modal-header"
              style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(245,158,11,0.08) 100%)',
                borderBottom: '1px solid rgba(255,215,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/main/aian.jpeg`}
                alt="도시 안내원"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  objectFit: 'cover',
                  border: '2px solid rgba(255,215,0,0.5)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
                onError={(e) => {
                  // 이미지 없으면 이모지 폴백
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.style.cssText = 'width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#ffd700,#f59e0b);display:flex;align-items:center;justify-content:center;font-size:28px;';
                    fallback.textContent = '🏙️';
                    parent.insertBefore(fallback, e.currentTarget);
                  }
                }}
              />
              <div>
                <div style={{ color: '#ffd700', fontWeight: '700', fontSize: '1.05rem' }}>
                  🏙️ AI City 안내원
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                  도시에 오신 것을 환영합니다!
                </div>
              </div>
              <button
                onClick={handleClose}
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                <X size={18} color="rgba(255,255,255,0.8)" />
              </button>
            </div>

            {/* 메시지 영역 */}
            <div
              className="city-guide-modal-messages"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius: message.role === 'user'
                        ? '18px 18px 4px 18px'
                        : '18px 18px 18px 4px',
                      background: message.role === 'user'
                        ? 'linear-gradient(135deg, #ffd700, #ffb347)'
                        : 'rgba(255,255,255,0.08)',
                      color: message.role === 'user' ? '#1a1a2e' : '#fff',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {message.role === 'assistant' ? renderMessageWithLinks(message.content) : message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '18px 18px 18px 4px',
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.6)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ animation: 'bounce 1s infinite' }}>•</span>
                      <span style={{ animation: 'bounce 1s infinite 0.2s' }}>•</span>
                      <span style={{ animation: 'bounce 1s infinite 0.4s' }}>•</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div
              className="city-guide-modal-input"
              style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="질문을 입력하세요..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '24px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: input.trim() && !isLoading
                    ? 'linear-gradient(135deg, #ffd700, #f59e0b)'
                    : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={18} color={input.trim() && !isLoading ? '#1a1a2e' : 'rgba(255,255,255,0.3)'} />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </>
  );
};

export default CityGuide;

