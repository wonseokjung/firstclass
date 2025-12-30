import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../common/NavigationBar';
import { RunningTrack, CodingBuddy, PixelRunner } from '../games/PixelRunner';

// 페라리 컬러 팔레트
const colors = {
  navy: '#0d1b2a',
  navyLight: '#1b263b',
  navyMid: '#415a77',
  gold: '#ffd60a',
  goldDark: '#e5c100',
  white: '#ffffff',
  gray: '#778da9'
};

// 레벨 데이터 - 바이브코딩 전 기초 체력! (달리기 컨셉 🏃)
const levels = [
  { id: 1, emoji: '🚶', title: '1km 워밍업', subtitle: 'Python 기초 (print, 변수)', status: 'active' as const, link: null },
  { id: 2, emoji: '🏃', title: '3km 조깅', subtitle: 'AI 생성 풀코스', status: 'active' as const, link: null },
  { id: 3, emoji: '🏃‍♂️', title: '5km 러닝', subtitle: '→ 바이브코딩 기초과정으로', status: 'link' as const, link: '/vibe-coding' },
  { id: 4, emoji: '🏃‍♀️', title: '10km 레이스', subtitle: '→ 바이브코딩 기초과정으로', status: 'link' as const, link: '/vibe-coding' },
  { id: 5, emoji: '🏅', title: '하프마라톤', subtitle: '→ 바이브코딩 기초과정으로', status: 'link' as const, link: '/vibe-coding' },
];

// 코드 에디터 컴포넌트
const CodeEditor: React.FC<{
  defaultValue: string;
  onRun: (code: string) => void;
  loading: boolean;
}> = ({ defaultValue, onRun, loading }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleRun = () => {
    if (textareaRef.current) {
      onRun(textareaRef.current.value);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        background: '#0d1117',
        borderRadius: '16px',
        overflow: 'hidden',
        border: `2px solid ${colors.navyMid}`,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          background: colors.navyLight,
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${colors.navyMid}`
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27ca3f' }} />
          </div>
          <span style={{ color: colors.gray, fontSize: '0.85rem', fontWeight: 600 }}>main.py</span>
        </div>
        <textarea
          ref={textareaRef}
          defaultValue={defaultValue}
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '20px',
            background: '#0d1117',
            color: '#c9d1d9',
            border: 'none',
            fontFamily: '"SF Mono", Monaco, Consolas, monospace',
            fontSize: '0.9rem',
            lineHeight: '1.8',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          spellCheck={false}
        />
      </div>
      <button
        onClick={handleRun}
        disabled={loading}
        style={{
          marginTop: '15px',
          padding: '16px 40px',
          borderRadius: '12px',
          border: 'none',
          background: loading ? colors.navyMid : `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
          color: loading ? colors.white : colors.navy,
          fontWeight: 800,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
          boxShadow: loading ? 'none' : '0 8px 25px rgba(255, 214, 10, 0.4)'
        }}
      >
        {loading ? '⏳ 실행 중...' : '▶ 실행하기'}
      </button>
    </div>
  );
};

const AIGymPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // 게임 진행 상태
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  // 결과 상태 - 모든 hooks는 컴포넌트 최상단에!
  const [textResult, setTextResult] = useState('');
  const [textLoading, setTextLoading] = useState(false);
  const [imageResult, setImageResult] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [weatherResult, setWeatherResult] = useState('');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [sportsResult, setSportsResult] = useState('');
  const [sportsLoading, setSportsLoading] = useState(false);
  const [videoResult, setVideoResult] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);
  const [ttsResult, setTtsResult] = useState('');
  const [ttsLoading, setTtsLoading] = useState(false);
  const [podcastResult, setPodcastResult] = useState('');
  const [podcastLoading, setPodcastLoading] = useState(false);
  const [basicResult, setBasicResult] = useState('');
  const [basicLoading, setBasicLoading] = useState(false);
  const [geminiBasicResult, setGeminiBasicResult] = useState('');
  const [geminiBasicLoading, setGeminiBasicLoading] = useState(false);
  const [veoResult, setVeoResult] = useState('');
  const [veoLoading, setVeoLoading] = useState(false);
  const [veoStoryResult, setVeoStoryResult] = useState('');
  const [veoStoryLoading, setVeoStoryLoading] = useState(false);
  
  // 로그인 체크
  useEffect(() => {
    const userSession = sessionStorage.getItem('aicitybuilders_user_session');
    const savedUser = localStorage.getItem('aicitybuilders_user');
    
    if (userSession || savedUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // 로그인 안되어 있으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (isLoggedIn === false) {
      navigate('/login', { state: { from: '/ai-gym', message: '기초 체력 훈련소에 입장하려면 로그인이 필요합니다!' } });
    }
  }, [isLoggedIn, navigate]);

  // 로딩 중이거나 로그인 안됐으면 로딩 표시
  if (isLoggedIn === null || isLoggedIn === false) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: colors.white }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏃</div>
          <p style={{ fontSize: '1.2rem' }}>로그인 확인 중...</p>
        </div>
      </div>
    );
  }

  // 기본 코드들 - 1km 워밍업용 (간단한 체험만!)
  const warmupCodes = {
    print1: `# 🎯 체험 1: 첫 인사하기
# print()는 화면에 글자를 출력하는 함수예요!

print("안녕하세요! 저는 파이썬이에요 🐍")
print("코딩은 생각보다 쉬워요!")`,
    
    print2: `# 🎯 체험 2: 변수에 이름 저장하기
# 변수 = 값 → 값을 저장하는 상자예요

my_name = "영수"
my_age = 98

print(f"안녕하세요! 저는 {my_name}이고 {my_age}살이에요!")
print("여러분의 이름과 나이로 바꿔보세요!")`,
    
    print3: `# 🎯 체험 3: 간단한 계산하기
# 파이썬은 계산도 잘해요!

price = 45000
discount = 0.1  # 10% 할인
final_price = price * (1 - discount)

print(f"원래 가격: {price}원")
print(f"할인율: {discount * 100}%")
print(f"최종 가격: {final_price}원")`
  };

  // 기본 코드들
  const defaultCodes = {
    basic: `# 🎯 Step 0.1: Python 기초 - print 연습!
# 아래 텍스트를 바꿔보세요

message = "안녕하세요! AI 네이티브 기업이 되어봅시다!"
print(message)

# 숫자도 출력해볼까요?
number = 2025
print(f"올해는 {number}년입니다!")`,
    geminiBasic: `# 🎯 Step 0.2: Gemini API 구조 이해하기!
# 이게 Gemini를 부르는 기본 구조예요

import google.generativeai as genai

# 1. API 키 설정 (위에서 이미 했어요!)
genai.configure(api_key="YOUR_API_KEY")

# 2. 모델 선택
model = genai.GenerativeModel("gemini-2.0-flash")

# 3. 프롬프트 작성
prompt = "안녕! 넌 누구야?"

# 4. AI에게 물어보기
response = model.generate_content(prompt)

# 5. 답변 출력
print(response.text)`,
    text: `# 🎯 프롬프트를 자유롭게 수정해보세요!

prompt = "유튜브 쇼츠로 월 100만원 버는 방법 3가지 알려줘"

response = model.generate_content(prompt)
print(response.text)`,
    image: `# 🍌 나노 바나나로 이미지 생성!

prompt = """
서울 한옥마을에서 한복 입은 귀여운 시바견이
떡볶이를 먹고 있는 모습.
디즈니 픽사 스타일, 따뜻한 조명
"""

response = model.generate_content(
    prompt,
    generation_config={"response_modalities": ["image"]}
)`,
    weather: `# 🌦️ 실시간 날씨 + 이미지 생성!

city = "서울"

prompt = f"{city}의 향후 5일간 날씨 예보를 
깔끔한 차트로 시각화해주세요."

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    config={"tools": [{"google_search": {}}]}
)`,
    sports: `# ⚽ 실시간 스포츠 결과 인포그래픽!

prompt = """
어제 있었던 프리미어리그 경기 결과를
멋진 인포그래픽으로 만들어주세요.
"""

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    config={"tools": [{"google_search": {}}]}
)`,
    video: `# 🎬 AI로 영상 기획!

prompt = """
유튜브 영상을 기획해주세요.
주제: AI로 부업하기
타겟: 30대 직장인

1. 후킹 제목 3가지
2. 챕터 구성 (5개)
3. 오프닝 스크립트
"""`,
    tts: `# 🎙️ AI 목소리로 나레이션!

style = "열정적인 유튜버처럼"
text = "안녕하세요 여러분! 오늘은 AI로 돈 버는 방법을 알려드릴게요!"

response = client.models.generate_content(
    model="gemini-2.5-flash-preview-tts",
    config={"response_modalities": ["AUDIO"]}
)`,
    podcast: `# 🎭 두 명이 대화하는 팟캐스트!

script = """
Jay: 안녕하세요! AI 건물주 팟캐스트에 오신 걸 환영합니다!
민지: 오늘은 정말 흥미로운 주제예요. AI로 부업하는 방법!
Jay: 맞아요, 근데 다들 코드 보면 무서워하시잖아요?
민지: 저도 처음엔 그랬어요! 근데 해보니까 별거 없더라고요.
"""`,
    veo: `# 🎬 AI 영상 생성 (Veo 3)
# 텍스트로 8초 영상을 만들어요!

from google import genai
from google.genai import types

client = genai.Client()

prompt = "귀여운 고양이가 빨간 스포츠카를 운전하며 해안도로를 달린다"

operation = client.models.generate_videos(
    model="veo-3.1-generate-preview",
    prompt=prompt,
    config=types.GenerateVideosConfig(
        aspect_ratio="16:9",
        resolution="720p"
    )
)

# 🎥 약 1분 후 8초 영상 완성!`,
    veoStory: `# 🎬 연속 영상 생성 (스토리 연결)
# 위에서 만든 영상에 이어서 스토리를 만들어요!

from google import genai
from google.genai import types

client = genai.Client()

# 1️⃣ 첫 번째 장면 (8초)
scene1 = client.models.generate_videos(
    model="veo-3.1-generate-preview",
    prompt="고양이가 스포츠카를 타고 해안도로를 달린다",
    config=types.GenerateVideosConfig(resolution="720p")
)

# 2️⃣ 이어서 두 번째 장면 (+7초)
scene2 = client.models.generate_videos(
    model="veo-3.1-generate-preview",
    video=scene1,  # 이전 영상을 연결!
    prompt="차가 절벽 끝에서 하늘로 날아오른다"
)

# 3️⃣ 이어서 세 번째 장면 (+7초)
scene3 = client.models.generate_videos(
    model="veo-3.1-generate-preview",
    video=scene2,  # 계속 연결!
    prompt="구름 사이를 날다가 무지개 위에 착지한다"
)

# 🎥 총 22초 연속 영상 완성! (최대 148초까지)`
  };

  const handleSetApiKey = () => {
    if (apiKey.trim()) setIsApiKeySet(true);
  };

  // 코드에서 프롬프트 추출
  const extractPrompt = (code: string): string => {
    const multiMatch = code.match(/prompt\s*=\s*"""([\s\S]*?)"""/);
    if (multiMatch) return multiMatch[1].trim();
    
    const cityMatch = code.match(/city\s*=\s*["']([^"']+)["']/);
    const city = cityMatch ? cityMatch[1] : '서울';
    
    const singleMatch = code.match(/prompt\s*=\s*["']([^"']+)["']/);
    if (singleMatch) return singleMatch[1].replace('{city}', city);
    
    return '';
  };

  const extractScript = (code: string): string => {
    const multiMatch = code.match(/script\s*=\s*"""([\s\S]*?)"""/);
    if (multiMatch) return multiMatch[1].trim();
    return '';
  };

  // 기초 Python 연습
  const runBasicPython = async (code: string) => {
    setBasicLoading(true);
    setBasicResult('');
    
    let output = '';
    
    // 변수들을 먼저 추출해서 저장 (숫자 값으로)
    const variables: { [key: string]: number | string } = {};
    
    // 문자열 변수 추출 (my_name = "영수")
    const stringVarMatches = Array.from(code.matchAll(/(\w+)\s*=\s*["']([^"']+)["']/g));
    for (const match of stringVarMatches) {
      variables[match[1]] = match[2];
    }
    
    // 정수 변수 추출 (my_age = 98)
    const intVarMatches = Array.from(code.matchAll(/(\w+)\s*=\s*(\d+)/g));
    for (const match of intVarMatches) {
      variables[match[1]] = parseInt(match[2]);
    }
    
    // 소수점 변수 추출 (discount = 0.1)
    const floatVarMatches = Array.from(code.matchAll(/(\w+)\s*=\s*(\d+\.\d+)/g));
    for (const match of floatVarMatches) {
      variables[match[1]] = parseFloat(match[2]);
    }
    
    // 계산된 변수 추출 (final_price = price * (1 - discount))
    const calcVarMatches = Array.from(code.matchAll(/(\w+)\s*=\s*([^#\n]+)/g));
    for (const match of calcVarMatches) {
      const varName = match[1].trim();
      const expression = match[2].trim();
      
      // 이미 추출된 변수는 건너뛰기
      if (variables[varName]) continue;
      
      // 계산식 평가 (변수 치환 후 계산)
      try {
        let evalExpr = expression;
        // 변수명을 값으로 치환
        for (const [key, value] of Object.entries(variables)) {
          if (typeof value === 'number') {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            evalExpr = evalExpr.replace(regex, value.toString());
          }
        }
        // 안전하게 계산 (간단한 수식만)
        if (/^[\d\s+\-*/().]+$/.test(evalExpr)) {
          // eslint-disable-next-line no-new-func
          const result = Function(`"use strict"; return (${evalExpr})`)();
          if (typeof result === 'number') {
            variables[varName] = result;
          }
        }
      } catch (e) {
        // 계산 실패 시 무시
      }
    }
    
    // 1. 변수만 출력하는 print문 처리 (print(message), print(number) 등)
    const varPrintMatches = Array.from(code.matchAll(/print\((\w+)\)/g));
    for (const match of varPrintMatches) {
      const varName = match[1];
      if (variables[varName] !== undefined) {
        output += variables[varName].toString() + '\n';
      }
    }
    
    // 2. 문자열 print 문 찾기 (f-string과 일반 print 구분)
    const allPrintMatches = Array.from(code.matchAll(/print\((f?["'])([^"']*)(["'])\)/g));
    
    for (const match of allPrintMatches) {
      const isFString = match[1].startsWith('f');
      const content = match[2];
      
      if (isFString || content.includes('{')) {
        // f-string 처리 (f가 없어도 {가 있으면 f-string으로 처리)
        let fstringContent = content;
        const exprMatches = Array.from(fstringContent.matchAll(/\{([^}]+)\}/g));
        
        for (const exprMatch of exprMatches) {
          const expression = exprMatch[1].trim();
          let result = expression;
          
          // 변수명만 있는 경우
          if (variables[expression] !== undefined) {
            result = variables[expression].toString();
          } else {
            // 계산식인 경우
            try {
              let evalExpr = expression;
              // 변수명을 값으로 치환
              for (const [key, value] of Object.entries(variables)) {
                if (typeof value === 'number') {
                  const regex = new RegExp(`\\b${key}\\b`, 'g');
                  evalExpr = evalExpr.replace(regex, value.toString());
                }
              }
              // 안전하게 계산
              if (/^[\d\s+\-*/().]+$/.test(evalExpr)) {
                // eslint-disable-next-line no-new-func
                const calcResult = Function(`"use strict"; return (${evalExpr})`)();
                result = calcResult.toString();
              }
            } catch (e) {
              // 계산 실패 시 원본 유지
            }
          }
          
          fstringContent = fstringContent.replace(`{${exprMatch[1]}}`, result);
        }
        output += fstringContent + '\n';
      } else {
        // 일반 print 문 (f-string이 아닌 경우만)
        output += content + '\n';
      }
    }
    
    // for loop 처리
    if (code.includes('for') && code.includes('range')) {
      const rangeMatch = code.match(/range\((\d+),\s*(\d+)\)/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        const loopContent = code.match(/print\(f?["']([^"']*)\{([^}]+)\}([^"']*)["']\)/);
        if (loopContent) {
          for (let i = start; i < end; i++) {
            output += loopContent[1] + i + loopContent[3] + '\n';
          }
        }
      }
    }
    
    // 리스트 처리
    if (code.includes('for') && code.includes('in') && !code.includes('range')) {
      const listMatch = code.match(/(\w+)\s*=\s*\[([^\]]+)\]/);
      if (listMatch) {
        const items = listMatch[2].split(',').map(s => s.trim().replace(/["']/g, ''));
        const loopPrint = code.match(/print\(f?["']([^"']*)\{([^}]+)\}([^"']*)["']\)/);
        if (loopPrint) {
          for (const item of items) {
            output += loopPrint[1] + item + loopPrint[3] + '\n';
          }
        }
      }
    }
    
    // if 문 처리
    if (code.includes('if') && code.includes('print')) {
      const ifMatch = code.match(/if\s+([^:]+):/);
      if (ifMatch) {
        const condition = ifMatch[1];
        if (condition.includes('>=') || condition.includes('>')) {
          const numMatch = condition.match(/(\d+)/);
          if (numMatch) {
            const ifPrint = code.match(/if[^:]+:\s*print\(["']([^"']+)["']\)/);
            if (ifPrint) output += ifPrint[1] + '\n';
          }
        }
      }
    }
    
    if (!output) {
      // 기본 메시지 출력
      const simplePrints = Array.from(code.matchAll(/print\(["']([^"']+)["']\)/g));
      for (const match of simplePrints) {
        output += match[1] + '\n';
      }
      if (!output) output = '✅ 코드 실행 완료! 코드를 수정해보세요!';
    }
    
    await new Promise(r => setTimeout(r, 500));
    setBasicResult(output.trim() || '✅ 코드 실행 완료!');
    setBasicLoading(false);
  };

  // Gemini 기초 연습
  const runGeminiBasic = async (code: string) => {
    const promptMatch = code.match(/prompt\s*=\s*["']([^"']+)["']/);
    const prompt = promptMatch ? promptMatch[1] : '안녕!';
    
    if (!apiKey) {
      setGeminiBasicResult('❌ 먼저 API 키를 연결해주세요!');
      return;
    }
    
    setGeminiBasicLoading(true);
    setGeminiBasicResult('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setGeminiBasicResult(data.candidates[0].content.parts[0].text);
      } else if (data.error) {
        setGeminiBasicResult(`❌ ${data.error.message}`);
      }
    } catch (error: any) {
      setGeminiBasicResult(`❌ ${error.message}`);
    }
    setGeminiBasicLoading(false);
  };

  // Google GenAI SDK 기본 사용법 (실전 예제 1)
  const runGeminiSDKBasic = async (code: string) => {
    if (!apiKey) {
      setGeminiBasicResult('❌ 먼저 API 키를 연결해주세요! (위에서 설정)');
      return;
    }

    // contents에서 프롬프트 추출
    const contentsMatch = code.match(/contents\s*=\s*["']([^"']+)["']/);
    const prompt = contentsMatch ? contentsMatch[1] : 'AI는 어떻게 작동하나요?';
    
    setGeminiBasicLoading(true);
    setGeminiBasicResult('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setGeminiBasicResult(data.candidates[0].content.parts[0].text);
      } else if (data.error) {
        setGeminiBasicResult(`❌ ${data.error.message}`);
      }
    } catch (error: any) {
      setGeminiBasicResult(`❌ ${error.message}`);
    }
    setGeminiBasicLoading(false);
  };

  // Google GenAI SDK 웹서치 사용 (실전 예제 2)
  const runGeminiSDKSearch = async (code: string) => {
    if (!apiKey) {
      setTextResult('❌ 먼저 API 키를 연결해주세요! (위에서 설정)');
      return;
    }

    // contents에서 프롬프트 추출
    const contentsMatch = code.match(/contents\s*=\s*["']([^"']+)["']/);
    const prompt = contentsMatch ? contentsMatch[1] : '유로 2024 우승팀은 어디인가요?';
    
    setTextLoading(true);
    setTextResult('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{ googleSearch: {} }]
          })
        }
      );
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setTextResult(data.candidates[0].content.parts[0].text);
      } else if (data.error) {
        setTextResult(`❌ ${data.error.message}`);
      }
    } catch (error: any) {
      setTextResult(`❌ ${error.message}`);
    }
    setTextLoading(false);
  };

  // Google GenAI SDK 이미지 생성 (실전 예제 3)
  const runGeminiSDKImage = async (code: string) => {
    if (!apiKey) {
      setImageResult('error: 먼저 API 키를 연결해주세요! (위에서 설정)');
      return;
    }

    // prompt 변수에서 프롬프트 추출
    const promptMatch = code.match(/prompt\s*=\s*["']([^"']+)["']/);
    const prompt = promptMatch ? promptMatch[1] : '서울의 향후 5일간 날씨 예보를 깔끔하고 모던한 날씨 차트로 시각화해주세요.';
    
    setImageLoading(true);
    setImageResult('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE'],
              imageConfig: {
                aspectRatio: '16:9'
              }
            },
            tools: [{ googleSearch: {} }]
          })
        }
      );
      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts) {
        let textOutput = '';
        let imageData = '';
        
        for (const part of data.candidates[0].content.parts) {
          if (part.text) {
            textOutput += part.text + '\n';
          }
          if (part.inlineData) {
            imageData = `data:image/png;base64,${part.inlineData.data}`;
          }
        }
        
        if (imageData) {
          // 이미지가 있으면 이미지 데이터를 저장
          // 텍스트가 있으면 이미지 데이터 앞에 텍스트를 포함 (구분자 사용)
          if (textOutput.trim()) {
            setImageResult(`TEXT:${textOutput.trim()}\n\nIMAGE:${imageData}`);
          } else {
            setImageResult(imageData);
          }
        } else if (textOutput) {
          setImageResult(textOutput.trim());
        } else {
          setImageResult('error:이미지를 생성할 수 없습니다. 프롬프트를 확인해주세요.');
        }
      } else if (data.error) {
        setImageResult(`error:${data.error.message}`);
      }
    } catch (error: any) {
      setImageResult(`error:${error.message}`);
    }
    setImageLoading(false);
  };

  // API 호출 함수들
  const generateText = async (code: string) => {
    const prompt = extractPrompt(code);
    if (!apiKey || !prompt) return;
    setTextLoading(true);
    setTextResult('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setTextResult(data.candidates[0].content.parts[0].text);
      } else if (data.error) {
        setTextResult(`❌ ${data.error.message}`);
      }
    } catch (error: any) {
      setTextResult(`❌ ${error.message}`);
    }
    setTextLoading(false);
  };

  const generateImage = async (code: string) => {
    const prompt = extractPrompt(code);
    if (!apiKey || !prompt) return;
    setImageLoading(true);
    setImageResult('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['image', 'text'] }
          })
        }
      );
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            setImageResult(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      } else if (data.error) {
        setImageResult(`error:${data.error.message}`);
      }
    } catch (error: any) {
      setImageResult(`error:${error.message}`);
    }
    setImageLoading(false);
  };

  // Veo 영상 생성 (프록시 사용)
  const generateVeo = async (code: string) => {
    const promptMatch = code.match(/prompt\s*=\s*["']([^"']+)["']/);
    const prompt = promptMatch ? promptMatch[1] : '귀여운 고양이가 빨간 스포츠카를 운전하며 해안도로를 달린다';
    
    if (!apiKey) {
      setVeoResult('error:먼저 API 키를 연결해주세요!');
      return;
    }
    
    setVeoLoading(true);
    setVeoResult('🎬 영상 생성 중... (약 1-2분 소요)');
    
    try {
      // Azure Functions 프록시를 통해 호출
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKey })
      });
      
      const data = await response.json();
      console.log('Veo Response:', data);
      
      if (data.error) {
        setVeoResult(`error:${data.error.message || data.error}`);
        setVeoLoading(false);
      } else if (data.name) {
        // 비동기 작업 - polling
        pollVeoOperation(data.name, setVeoResult, setVeoLoading);
      } else if (data.candidates?.[0]?.content?.parts?.[0]) {
        const videoData = data.candidates[0].content.parts[0];
        if (videoData.inlineData?.data) {
          setVeoResult(`data:video/mp4;base64,${videoData.inlineData.data}`);
        } else if (videoData.fileData?.fileUri) {
          setVeoResult(`video:${videoData.fileData.fileUri}`);
        }
        setVeoLoading(false);
      } else {
        setVeoResult('error:예상치 못한 응답입니다. 콘솔을 확인해주세요.');
        setVeoLoading(false);
      }
    } catch (error: any) {
      setVeoResult(`error:${error.message}`);
      setVeoLoading(false);
    }
  };

  // Veo 작업 polling (프록시 사용)
  const pollVeoOperation = async (
    operationName: string, 
    setResult: (val: string) => void, 
    setLoading: (val: boolean) => void
  ) => {
    let attempts = 0;
    const maxAttempts = 30;
    
    const poll = async () => {
      attempts++;
      try {
        const response = await fetch('/api/check-video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName, apiKey })
        });
        const data = await response.json();
        console.log('Operation status:', data);
        
        if (data.done) {
          if (data.response?.generatedVideos?.[0]?.video) {
            const video = data.response.generatedVideos[0].video;
            if (video.uri) {
              setResult(`video:${video.uri}`);
            } else if (video.inlineData?.data) {
              setResult(`data:video/mp4;base64,${video.inlineData.data}`);
            }
          } else if (data.error) {
            setResult(`error:${data.error.message}`);
          } else {
            setResult('error:영상 생성 결과를 찾을 수 없습니다.');
          }
          setLoading(false);
        } else if (attempts < maxAttempts) {
          setResult(`⏳ 영상 렌더링 중... (${attempts * 10}초)`);
          setTimeout(poll, 10000);
        } else {
          setResult('error:시간 초과. 나중에 다시 시도해주세요.');
          setLoading(false);
        }
      } catch (error: any) {
        setResult(`error:${error.message}`);
        setLoading(false);
      }
    };
    
    setResult('⏳ 영상 렌더링 중... 잠시만 기다려주세요!');
    setTimeout(poll, 10000);
  };

  // Veo 스토리 영상 생성 (프록시 사용)
  const generateVeoStory = async (code: string) => {
    if (!apiKey) {
      setVeoStoryResult('error:먼저 API 키를 연결해주세요!');
      return;
    }
    
    // 코드에서 scene 프롬프트들 추출
    const scene1Match = code.match(/# 1️⃣.*\n.*prompt\s*=\s*["']([^"']+)["']/);
    
    const prompt = scene1Match?.[1] || '고양이가 스포츠카를 타고 해안도로를 달린다';
    
    setVeoStoryLoading(true);
    setVeoStoryResult(`🎬 Scene 1 생성 중: "${prompt.substring(0, 30)}..."`);
    
    try {
      // Azure Functions 프록시를 통해 호출
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKey })
      });
      
      const data = await response.json();
      console.log('Scene 1 Response:', data);
      
      if (data.error) {
        setVeoStoryResult(`error:${data.error.message || data.error}`);
        setVeoStoryLoading(false);
        return;
      }
      
      if (data.name) {
        setVeoStoryResult(`⏳ Scene 1 렌더링 중... 총 3개 장면이 순차 생성됩니다!`);
        pollVeoOperation(data.name, setVeoStoryResult, setVeoStoryLoading);
      } else {
        setVeoStoryResult('error:예상치 못한 응답입니다.');
        setVeoStoryLoading(false);
      }
    } catch (error: any) {
      setVeoStoryResult(`error:${error.message}`);
      setVeoStoryLoading(false);
    }
  };

  const generateWeather = async (code: string) => {
    const cityMatch = code.match(/city\s*=\s*["']([^"']+)["']/);
    const city = cityMatch ? cityMatch[1] : '서울';
    const prompt = `${city}의 향후 5일간 날씨 예보를 깔끔한 차트로 시각화해주세요.`;
    
    if (!apiKey) return;
    setWeatherLoading(true);
    setWeatherResult('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['image', 'text'] }
          })
        }
      );
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            setWeatherResult(`data:image/png;base64,${part.inlineData.data}`);
            return;
          }
        }
      } else if (data.error) {
        setWeatherResult(`error:${data.error.message}`);
      }
    } catch (error: any) {
      setWeatherResult(`error:${error.message}`);
    }
    setWeatherLoading(false);
  };

  const generateSports = async (code: string) => {
    const prompt = extractPrompt(code);
    if (!apiKey || !prompt) return;
    setSportsLoading(true);
    setSportsResult('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['image', 'text'] }
          })
        }
      );
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            setSportsResult(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      } else if (data.error) {
        setSportsResult(`error:${data.error.message}`);
      }
    } catch (error: any) {
      setSportsResult(`error:${error.message}`);
    }
    setSportsLoading(false);
  };

  const generateVideo = async (code: string) => {
    const prompt = extractPrompt(code);
    if (!apiKey || !prompt) return;
    setVideoLoading(true);
    setVideoResult('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setVideoResult(data.candidates[0].content.parts[0].text);
      } else if (data.error) {
        setVideoResult(`❌ ${data.error.message}`);
      }
    } catch (error: any) {
      setVideoResult(`❌ ${error.message}`);
    }
    setVideoLoading(false);
  };

  const generateTTS = async (code: string) => {
    const styleMatch = code.match(/style\s*=\s*["']([^"']+)["']/);
    const textMatch = code.match(/text\s*=\s*["']([^"']+)["']/);
    const style = styleMatch ? styleMatch[1] : '열정적인 유튜버처럼';
    const text = textMatch ? textMatch[1] : '안녕하세요!';
    
    if (!apiKey) return;
    setTtsLoading(true);
    setTtsResult('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${style}: "${text}"` }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
            }
          })
        }
      );
      const data = await response.json();
      console.log('TTS API Response:', data);
      if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
        setTtsResult(`data:audio/wav;base64,${data.candidates[0].content.parts[0].inlineData.data}`);
      } else if (data.error) {
        setTtsResult(`error:${data.error.message}`);
      } else {
        setTtsResult(`error:응답 없음 - ${JSON.stringify(data).substring(0, 200)}`);
      }
    } catch (error: any) {
      setTtsResult(`error:${error.message}`);
    }
    setTtsLoading(false);
  };

  const generatePodcast = async (code: string) => {
    const script = extractScript(code);
    if (!apiKey || !script) return;
    setPodcastLoading(true);
    setPodcastResult('');
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `다음 대화를 TTS로 변환해주세요:\n\n${script}` }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                multiSpeakerVoiceConfig: {
                  speakerVoiceConfigs: [
                    { speaker: 'Jay', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                    { speaker: '민지', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } } }
                  ]
                }
              }
            }
          })
        }
      );
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
        setPodcastResult(`data:audio/wav;base64,${data.candidates[0].content.parts[0].inlineData.data}`);
      } else if (data.error) {
        setPodcastResult(`error:${data.error.message}`);
      }
    } catch (error: any) {
      setPodcastResult(`error:${error.message}`);
    }
    setPodcastLoading(false);
  };

  // 섹션 카드 컴포넌트
  const SectionCard = ({ children, title, step, emoji, isNew }: { children: React.ReactNode; title: string; step: number | string; emoji: string; isNew?: boolean }) => (
    <div style={{
      background: `linear-gradient(135deg, ${colors.navyLight}, ${colors.navy})`,
      borderRadius: '24px',
      padding: 'clamp(25px, 5vw, 40px)',
      marginBottom: '30px',
      border: `2px solid ${colors.navyMid}`,
      boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        marginBottom: '30px',
        paddingBottom: '25px',
        borderBottom: `2px solid ${colors.navyMid}`
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          boxShadow: '0 8px 25px rgba(255, 214, 10, 0.4)'
        }}>
          {emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: colors.gold, fontSize: '0.85rem', marginBottom: '5px', fontWeight: 700, letterSpacing: '1px' }}>
            STEP {step}
          </div>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', color: colors.white, fontWeight: 800 }}>{title}</h2>
        </div>
        {isNew && (
          <span style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
          }}>
            🔥 NEW
          </span>
        )}
      </div>
      {children}
    </div>
  );

  // 마크다운을 예쁘게 변환하는 함수
  const formatMarkdown = (text: string): React.ReactNode => {
    if (!text) return text;
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;
    
    // **볼드** 처리
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // 이전 텍스트 추가
      if (match.index > lastIndex) {
        const prevText = text.substring(lastIndex, match.index);
        parts.push(formatTextWithLineBreaks(prevText, key++));
      }
      // 볼드 텍스트 추가
      parts.push(
        <strong key={key++} style={{ color: colors.gold, fontWeight: 700 }}>
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }
    
    // 남은 텍스트 추가
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      parts.push(formatTextWithLineBreaks(remainingText, key++));
    }
    
    return parts.length > 0 ? <>{parts}</> : formatTextWithLineBreaks(text, 0);
  };
  
  // 줄바꿈 처리
  const formatTextWithLineBreaks = (text: string, startKey: number): React.ReactNode => {
    if (!text) return text;
    
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (index < lines.length - 1) {
        return <React.Fragment key={startKey + index}>{line}<br /></React.Fragment>;
      }
      return <React.Fragment key={startKey + index}>{line}</React.Fragment>;
    });
  };

  // 🎮 게임 스타일 결과 박스 컴포넌트
  const OutputBox = ({ children, type = 'text' }: { children: React.ReactNode; type?: 'text' | 'image' | 'audio' | 'error' }) => {
    const isSuccess = type !== 'error';
    const randomSprite = ['char01', 'char02', 'char03', 'char04', 'char05'][Math.floor(Math.random() * 5)] as 'char01' | 'char02' | 'char03' | 'char04' | 'char05';
    const celebrations = ['대단해요! 🎉', '완벽해요! ✨', '잘했어요! 💪', '멋져요! 🌟', '굿굿! 👏'];
    const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
    
    return (
    <div style={{
      background: '#0d1117',
        borderRadius: '20px',
      padding: '25px',
      marginTop: '20px',
        border: `3px solid ${isSuccess ? colors.gold : '#f85149'}`,
        boxShadow: isSuccess 
          ? '0 8px 30px rgba(255, 214, 10, 0.2)' 
          : '0 8px 30px rgba(248, 81, 73, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 🎮 성공시 캐릭터 축하 */}
        {isSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '15px',
            padding: '12px 15px',
            background: 'rgba(255, 214, 10, 0.1)',
            borderRadius: '14px',
            border: `2px solid ${colors.gold}40`
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '10px',
              padding: '6px',
              border: `2px solid ${colors.gold}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PixelRunner sprite={randomSprite} isRunning={false} scale={1} direction="down" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '3px'
              }}>
                <span style={{
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
                  color: colors.navy,
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  ✅ 실행 성공!
                </span>
                <span style={{ fontSize: '1rem' }}>
                  {['🎊', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
                </span>
              </div>
              <p style={{ 
                color: colors.gold, 
                margin: 0, 
                fontSize: '0.9rem',
                fontWeight: 700
              }}>
                {randomCelebration}
              </p>
            </div>
            <div style={{
              display: 'flex',
              gap: '3px'
            }}>
              {[...Array(3)].map((_, i) => (
                <span key={i} style={{ 
                  fontSize: '1.2rem',
                  animation: `bounce 0.5s ease ${i * 0.1}s infinite alternate`
                }}>⭐</span>
              ))}
            </div>
          </div>
        )}
        
        {/* 에러시 */}
        {!isSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px',
            padding: '15px',
            background: 'rgba(248, 81, 73, 0.1)',
            borderRadius: '16px',
            border: '2px solid rgba(248, 81, 73, 0.4)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>😅</span>
            <div>
              <span style={{
                background: '#f85149',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                ⚠️ 오류 발생
              </span>
              <p style={{ color: '#f85149', margin: '5px 0 0', fontSize: '0.9rem' }}>
                걱정 마! 다시 해보자! 💪
              </p>
            </div>
          </div>
        )}
        
        {/* 결과 내용 */}
      <div style={{ 
        color: type === 'error' ? '#f85149' : colors.gold, 
        fontSize: '0.8rem', 
        marginBottom: '15px',
        fontWeight: 700,
          letterSpacing: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>📤 OUTPUT</span>
          <div style={{
            flex: 1,
            height: '2px',
            background: `linear-gradient(90deg, ${type === 'error' ? '#f85149' : colors.gold}, transparent)`
          }} />
      </div>
      {children}
        
        <style>{`
          @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-8px); }
          }
        `}</style>
    </div>
  );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.navy
    }}>
      <NavigationBar
        onBack={() => navigate('/')}
        breadcrumbText="기초 체력 훈련소"
      />

      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        padding: 'clamp(20px, 4vw, 40px) clamp(15px, 4vw, 20px)'
      }}>
        
        {/* 히어로 섹션 */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.navyLight}, ${colors.navy})`,
          borderRadius: '30px',
          padding: 'clamp(40px, 8vw, 70px) clamp(25px, 5vw, 50px)',
          textAlign: 'center',
          marginBottom: '50px',
          border: `3px solid ${colors.gold}`,
          boxShadow: '0 25px 80px rgba(255, 214, 10, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${colors.gold}20, transparent)`,
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '250px',
            height: '250px',
            background: `radial-gradient(circle, ${colors.gold}15, transparent)`,
            borderRadius: '50%'
          }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
              borderRadius: '50%',
              marginBottom: '30px',
              boxShadow: '0 15px 50px rgba(255, 214, 10, 0.5)',
              border: '4px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span style={{ fontSize: '3.5rem' }}>{selectedLevel === 1 ? '🚶' : '🏃'}</span>
            </div>
            
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 300,
              color: colors.white,
              marginBottom: '20px',
              lineHeight: 1.3
            }}>
              <span style={{ 
                color: colors.gold, 
                fontWeight: 900,
                textShadow: '0 4px 20px rgba(255, 214, 10, 0.3)'
              }}>기초 체력</span> 훈련소
            </h1>
            
            <h2 style={{
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: 700,
              color: colors.gold,
              marginBottom: '15px'
            }}>
              바이브코딩 전, 코어부터 쌓자 💪
            </h2>
            
            <p style={{
              color: colors.gray,
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              lineHeight: 1.7,
              marginBottom: '35px'
            }}>
              코드 보고 쫄지 않는 체력 만들기<br />
              Python 기초부터 AI 생성까지, 30분이면 끝!
            </p>

            {/* 🏃 달리기 트랙 - 게임 진행 상황 */}
            <div style={{ marginBottom: '35px' }}>
              <RunningTrack
                progress={selectedLevel === 1 
                  ? completedExercises.length * 16.6 
                  : 50 + completedExercises.length * 7}
                totalSteps={selectedLevel === 1 ? 6 : 7}
                currentStep={completedExercises.length}
                milestones={[
                  { position: 0, emoji: '🚶', label: '시작' },
                  { position: 25, emoji: '🐍', label: 'Python' },
                  { position: 50, emoji: '🤖', label: 'AI 기초' },
                  { position: 75, emoji: '✨', label: 'AI 생성' },
                  { position: 100, emoji: '🏆', label: '완주!' }
                ]}
              />
            </div>

            {/* 🎮 AI 구조 - 컴팩트 버전 */}
            <div style={{
              background: 'rgba(255, 214, 10, 0.08)',
              borderRadius: '16px',
              padding: '15px 20px',
              marginBottom: '20px',
              border: `2px solid ${colors.gold}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🙋</span>
              <span style={{ color: '#ff6b6b', fontSize: '0.8rem', fontWeight: 600 }}>질문</span>
              <span style={{ color: colors.gold }}>→</span>
              <span style={{ fontSize: '1.2rem' }}>💬</span>
              <span style={{ color: '#4ecdc4', fontSize: '0.8rem', fontWeight: 600 }}>프롬프트</span>
              <span style={{ color: colors.gold }}>→</span>
              <span style={{ fontSize: '1.2rem' }}>🧠</span>
              <span style={{ 
                color: colors.gold, 
                fontSize: '0.8rem', 
                fontWeight: 700,
                background: `${colors.gold}20`,
                padding: '2px 8px',
                borderRadius: '8px'
              }}>Gemini</span>
              <span style={{ color: colors.gold }}>→</span>
              <span style={{ fontSize: '1.2rem' }}>✨</span>
              <span style={{ color: '#95e1d3', fontSize: '0.8rem', fontWeight: 600 }}>글·그림·소리!</span>
            </div>

            {/* 레벨 선택 */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '10px'
            }}>
              {levels.map((level) => (
                <div
                  key={level.id}
                  onClick={() => {
                    if (level.status === 'link' && level.link) {
                      navigate(level.link);
                    } else if (level.status === 'active') {
                      setSelectedLevel(level.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    border: selectedLevel === level.id 
                      ? `3px solid ${colors.gold}` 
                      : level.status === 'link'
                      ? `2px solid #10b981`
                      : `2px solid ${colors.navyMid}`,
                    background: selectedLevel === level.id 
                      ? `${colors.gold}20` 
                      : level.status === 'link'
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(255,255,255,0.05)',
                    opacity: 1,
                    minWidth: '80px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {level.status === 'link' && (
                    <span style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: '#10b981',
                      color: '#ffffff',
                      fontSize: '0.55rem',
                      padding: '2px 5px',
                      borderRadius: '6px',
                      fontWeight: 700
                    }}>
                      GO →
                    </span>
                  )}
                  <span style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{level.emoji}</span>
                  <span style={{ 
                    color: selectedLevel === level.id ? colors.gold : level.status === 'link' ? '#10b981' : colors.white, 
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}>
                    {level.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API 키 설정 - 맨 처음에 표시 */}
        {!isApiKeySet && (
          <SectionCard title="🔑 API 키 연결하기 (먼저 설정해주세요!)" step={0} emoji="🔑">
            <p style={{ color: colors.gray, marginBottom: '20px', lineHeight: '1.7', fontSize: '1.05rem' }}>
              Google AI Studio에서 <strong style={{color: colors.white}}>무료</strong> API 키를 받아오세요.<br />
              API 키를 설정하면 모든 기능을 사용할 수 있어요! 🚀
            </p>
            <a 
              href="https://aistudio.google.com/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: colors.gold, 
                display: 'inline-block',
                marginBottom: '25px',
                textDecoration: 'none',
                fontSize: '1.05rem',
                fontWeight: 600
              }}
            >
              👉 무료 API 키 받으러 가기
            </a>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <input
                type="password"
                placeholder="API 키를 붙여넣으세요"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${colors.navyMid}`,
                  background: colors.navy,
                  color: colors.white,
                  fontSize: '1rem'
                }}
              />
              <button
                onClick={handleSetApiKey}
                style={{
                  padding: '16px 35px',
                  borderRadius: '12px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
                  color: colors.navy,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  boxShadow: '0 8px 25px rgba(255, 214, 10, 0.4)'
                }}
              >
                연결하기
              </button>
            </div>
          </SectionCard>
        )}

        {/* API 연결 상태 표시 */}
        {isApiKeySet && (
          <div style={{
            background: 'rgba(39, 202, 63, 0.15)',
            borderRadius: '16px',
            padding: '15px 25px',
            marginBottom: '30px',
            border: '2px solid rgba(39, 202, 63, 0.4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <span style={{ color: '#27ca3f', fontWeight: 700, fontSize: '1rem' }}>● Gemini API 연결됨</span>
            <button
              onClick={() => { setIsApiKeySet(false); setApiKey(''); }}
              style={{
                background: 'transparent',
                border: `1px solid ${colors.navyMid}`,
                color: colors.gray,
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              연결 해제
            </button>
          </div>
        )}

        {/* 현재 레벨 배지 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'inline-block',
            background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
            color: colors.navy,
            padding: '12px 30px',
            borderRadius: '30px',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: '0 8px 30px rgba(255, 214, 10, 0.4)'
          }}>
            {selectedLevel === 1 && '🚶 현재: Lv.1 1km 워밍업 - Python 기초'}
            {selectedLevel === 2 && '🏃 현재: Lv.2 3km 조깅 - AI 생성 풀코스'}
          </div>
        </div>

        {/* 1km 워밍업 - Python 기초 */}
        {selectedLevel === 1 && (
          <>
{/* 🎮 픽셀 캐릭터 가이드 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15), rgba(149, 225, 211, 0.1))',
              borderRadius: '16px',
              padding: '18px',
              marginBottom: '25px',
              border: `2px solid rgba(78, 205, 196, 0.3)`,
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {/* 픽셀 캐릭터 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '8px',
                  border: '3px solid #4ecdc4'
                }}>
                  <PixelRunner sprite="char02" isRunning={false} scale={1.2} direction="down" />
                </div>
                <span style={{
                  background: '#4ecdc4',
                  color: colors.navy,
                  fontSize: '0.7rem',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontWeight: 800
                }}>🐍 파이</span>
              </div>
              
              {/* 말풍선 */}
              <div style={{
                flex: 1,
                minWidth: '220px',
                background: colors.navy,
                borderRadius: '14px',
                padding: '15px',
                position: 'relative',
                border: `2px solid ${colors.navyMid}`
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 0,
                  height: 0,
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderRight: `10px solid ${colors.navy}`
                }} />
                <div style={{ 
                  color: '#4ecdc4', 
                  fontWeight: 800, 
                  fontSize: '1rem',
                  marginBottom: '8px'
                }}>
                  "안녕! 나는 파이야! 🎉"
                </div>
                <p style={{ 
                  color: colors.white, 
                  fontSize: '0.9rem', 
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  코드가 무섭다고? 걱정 마! 나랑 <strong style={{color: colors.gold}}>3가지 게임</strong>만 하면<br />
                  코드 보고 쫄지 않는 체력이 생길 거야! 💪
                </p>
              </div>
            </div>

            {/* 미션 진행 바 */}
            <div style={{
              background: colors.navy,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '30px',
              border: `2px solid ${colors.navyMid}`
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{ color: colors.gold, fontWeight: 700, fontSize: '0.95rem' }}>🎮 미션 진행도</span>
                <span style={{ color: colors.gray, fontSize: '0.85rem' }}>0 / 3 완료</span>
              </div>
              <div style={{
                display: 'flex',
                gap: '10px'
              }}>
                <div style={{
                  flex: 1,
                  height: '12px',
                  background: `${colors.navyMid}`,
                  borderRadius: '10px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '0%',
                    background: `linear-gradient(90deg, ${colors.gold}, ${colors.goldDark})`,
                    borderRadius: '10px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px'
              }}>
                <span style={{ color: colors.gray, fontSize: '0.75rem' }}>👋 인사</span>
                <span style={{ color: colors.gray, fontSize: '0.75rem' }}>📦 변수</span>
                <span style={{ color: colors.gray, fontSize: '0.75rem' }}>🔢 계산</span>
              </div>
            </div>

            {/* 체험 1: 첫 인사하기 */}
            <SectionCard title="체험 1: 첫 인사하기" step={1} emoji="👋">
              <CodingBuddy 
                sprite="char03"
                emotion="happy"
                message={`print()는 화면에 글자를 출력하는 함수야! 🖥️ 실행 버튼을 눌러보면 아래에 결과가 나타나!`}
              />
              <CodeEditor defaultValue={warmupCodes.print1} onRun={(code) => { runBasicPython(code); if (!completedExercises.includes('print1')) setCompletedExercises([...completedExercises, 'print1']); }} loading={basicLoading} />
              {basicResult && (
                <OutputBox>
                  <div style={{ color: colors.white, whiteSpace: 'pre-wrap', lineHeight: '1.8', fontFamily: 'monospace', fontSize: '1rem' }}>
                    {basicResult}
                  </div>
                </OutputBox>
              )}
            </SectionCard>

            {/* 체험 2: 변수에 이름 저장하기 */}
            <SectionCard title="체험 2: 변수에 이름 저장하기" step={2} emoji="📦">
              <CodingBuddy 
                sprite="char04"
                emotion="thinking"
                message={`변수는 값을 저장하는 📦 상자야! my_name을 네 이름으로 바꿔보고 실행해봐!`}
              />
              <CodeEditor defaultValue={warmupCodes.print2} onRun={(code) => { runBasicPython(code); if (!completedExercises.includes('print2')) setCompletedExercises([...completedExercises, 'print2']); }} loading={basicLoading} />
              {basicResult && (
                <OutputBox>
                  <div style={{ color: colors.white, whiteSpace: 'pre-wrap', lineHeight: '1.8', fontFamily: 'monospace', fontSize: '1rem' }}>
                    {basicResult}
                  </div>
                </OutputBox>
              )}
            </SectionCard>

            {/* 체험 3: 간단한 계산하기 */}
            <SectionCard title="체험 3: 간단한 계산하기" step={3} emoji="🔢">
              <CodingBuddy 
                sprite="char05"
                emotion="excited"
                message={`파이썬은 계산도 잘해! 🧮 price나 discount 숫자를 바꿔보면 자동으로 계산돼!`}
              />
              <CodeEditor defaultValue={warmupCodes.print3} onRun={(code) => { runBasicPython(code); if (!completedExercises.includes('print3')) setCompletedExercises([...completedExercises, 'print3']); }} loading={basicLoading} />
              {basicResult && (
                <OutputBox>
                  <div style={{ color: colors.white, whiteSpace: 'pre-wrap', lineHeight: '1.8', fontFamily: 'monospace', fontSize: '1rem' }}>
                    {basicResult}
                  </div>
                </OutputBox>
              )}
            </SectionCard>

            {/* 실전 연습: Google GenAI SDK - 게임 스타일 */}
            <div style={{
              marginTop: '50px',
              padding: '30px',
              borderRadius: '24px',
              background: `linear-gradient(135deg, ${colors.navyLight}, ${colors.navy})`,
              border: `3px solid ${colors.gold}`,
              boxShadow: '0 15px 50px rgba(255, 214, 10, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 배경 장식 */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: `radial-gradient(circle, ${colors.gold}20, transparent)`,
                borderRadius: '50%'
              }} />
              
              <div style={{ position: 'relative', zIndex: 2 }}>
                {/* 레벨 업 배너 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🎖️</span>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
                      color: colors.navy,
                      padding: '8px 25px',
                      borderRadius: '25px',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      marginBottom: '5px'
                    }}>
                      🎮 LEVEL UP!
                    </div>
              <h2 style={{ 
                      color: colors.white, 
                      fontSize: '1.6rem', 
                      fontWeight: 800, 
                      margin: 0
                    }}>
                      AI 두뇌 속으로 들어가기! 🧠
                    </h2>
                  </div>
                  <span style={{ fontSize: '2.5rem' }}>🎖️</span>
                </div>

                {/* AI 내부 구조 시각화 */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '20px',
                  padding: '25px',
                  marginBottom: '20px'
                }}>
                  <p style={{ 
                color: colors.gold, 
                    fontSize: '1rem', 
                fontWeight: 700, 
                    textAlign: 'center',
                    marginBottom: '20px'
                  }}>
                    🔍 ChatGPT, Gemini, Claude... 다 이런 구조야!
                  </p>
                  
                  {/* 코드 구조 시각화 */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    maxWidth: '400px',
                    margin: '0 auto'
                  }}>
                    {[
                      { num: '1', icon: '🔑', text: 'API 키 설정', color: '#ff6b6b', desc: '비밀번호 같은 거' },
                      { num: '2', icon: '🧠', text: '모델 선택', color: '#4ecdc4', desc: 'gemini-2.5-flash' },
                      { num: '3', icon: '💬', text: '프롬프트 작성', color: colors.gold, desc: '질문 쓰기' },
                      { num: '4', icon: '🚀', text: 'AI에게 전송!', color: '#95e1d3', desc: 'generate_content()' },
                      { num: '5', icon: '✨', text: '답변 받기', color: '#f38181', desc: 'response.text' },
                    ].map((step) => (
                      <div key={step.num} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        background: `${step.color}15`,
                        padding: '12px 18px',
                        borderRadius: '12px',
                        border: `2px solid ${step.color}40`
                      }}>
                        <div style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '50%',
                          background: step.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          color: colors.navy,
                          fontSize: '0.9rem',
                          flexShrink: 0
                        }}>{step.num}</div>
                        <span style={{ fontSize: '1.5rem' }}>{step.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: step.color, fontWeight: 700, fontSize: '0.95rem' }}>{step.text}</div>
                          <div style={{ color: colors.gray, fontSize: '0.75rem' }}>{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI 캐릭터 응원 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  background: 'rgba(255, 214, 10, 0.1)',
                  padding: '15px 20px',
                  borderRadius: '16px',
                  border: `1px solid ${colors.gold}30`
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🤖</span>
              <p style={{ 
                color: colors.white, 
                    fontSize: '0.95rem', 
                lineHeight: 1.7, 
                    margin: 0
              }}>
                    "와! 이제 내 <strong style={{color: colors.gold}}>두뇌 속</strong>을 보게 됐구나! 🎉<br />
                    아래 코드들이 바로 나를 부르는 <strong style={{color: '#4ecdc4'}}>마법의 주문</strong>이야! 직접 해봐! ✨"
              </p>
                </div>
              </div>
            </div>

            {/* 실전 예제 1: 기본 generate_content */}
            <SectionCard title="실전 예제 1: Gemini 기본 사용법" step="실전1" emoji="🤖">
              <CodingBuddy 
                sprite="char01"
                emotion="cheering"
                message={`이제 진짜 AI를 불러보자! 🤖 contents= 뒤의 질문을 바꿔보면 AI가 다르게 대답해!`}
              />
              <CodeEditor 
                defaultValue={`from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="AI는 어떻게 작동하나요?"
)
print(response.text)`} 
                onRun={runGeminiSDKBasic} 
                loading={geminiBasicLoading} 
              />
              {geminiBasicResult && (
                <OutputBox>
                  <div style={{ color: colors.white, lineHeight: '1.8', fontSize: '1rem' }}>
                    {formatMarkdown(geminiBasicResult)}
                  </div>
                </OutputBox>
              )}
            </SectionCard>

            {/* 실전 예제 2: 웹서치 도구 사용 */}
            <SectionCard title="실전 예제 2: 웹서치 도구 사용하기" step="실전2" emoji="🔍">
              <CodingBuddy 
                sprite="char02"
                emotion="excited"
                message={`이건 AI가 인터넷을 검색해서 최신 정보를 알려주는 마법이야! 🌐 "오늘 날씨" 같은 걸 물어봐!`}
              />
              <CodeEditor 
                defaultValue={`from google import genai
from google.genai import types

client = genai.Client()

grounding_tool = types.Tool(
    google_search=types.GoogleSearch()
)

config = types.GenerateContentConfig(
    tools=[grounding_tool]
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="유로 2024 우승팀은 어디인가요?",
    config=config,
)

print(response.text)`} 
                onRun={runGeminiSDKSearch} 
                loading={textLoading} 
              />
              {textResult && (
                <OutputBox>
                  <div style={{ color: colors.white, lineHeight: '1.8', fontSize: '1rem' }}>
                    {formatMarkdown(textResult)}
                  </div>
                </OutputBox>
              )}
            </SectionCard>

            {/* 실전 예제 3: 이미지 생성 (날씨 차트) */}
            <SectionCard title="실전 예제 3: 이미지 생성 - 날씨 차트 만들기" step="실전3" emoji="🌦️">
              <CodingBuddy 
                sprite="char03"
                emotion="excited"
                message={`와! 이건 AI가 그림을 그려주는 마법이야! 🎨 "서울" 대신 다른 도시 이름을 넣어봐!`}
              />
              <CodeEditor 
                defaultValue={`from google import genai
from google.genai import types

prompt = "서울의 향후 5일간 날씨 예보를 깔끔하고 모던한 날씨 차트로 시각화해주세요. 각 날짜마다 입을 옷도 시각적으로 보여주세요"
aspect_ratio = "16:9"  # "1:1","2:3","3:2","3:4","4:3","4:5","5:4","9:16","16:9","21:9"

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=['Text', 'Image'],
        image_config=types.ImageConfig(
            aspect_ratio=aspect_ratio,
        ),
        tools=[{"google_search": {}}]
    )
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif image := part.as_image():
        image.save("weather.png")
        print("✅ 이미지가 weather.png로 저장되었어요!")`} 
                onRun={runGeminiSDKImage} 
                loading={imageLoading} 
              />
              {imageResult && (
                <OutputBox type={imageResult.startsWith('error:') ? 'error' : imageResult.includes('IMAGE:') || imageResult.startsWith('data:image') ? 'image' : 'text'}>
                  {imageResult.startsWith('error:') ? (
                    <div style={{ color: '#f85149' }}>{imageResult.replace('error:', '')}</div>
                  ) : imageResult.includes('IMAGE:') ? (
                    <>
                      {imageResult.includes('TEXT:') && (
                        <div style={{ color: colors.white, lineHeight: '1.8', fontSize: '1rem', marginBottom: '15px' }}>
                          {formatMarkdown(imageResult.split('IMAGE:')[0].replace('TEXT:', '').trim())}
                        </div>
                      )}
                      <div style={{ color: colors.gold, marginBottom: '10px', fontWeight: 700 }}>
                        ✅ 이미지 생성 완료!
                      </div>
                      <img src={imageResult.split('IMAGE:')[1]} alt="Generated" style={{ maxWidth: '100%', borderRadius: '12px' }} />
                    </>
                  ) : imageResult.startsWith('data:image') ? (
                    <>
                      <div style={{ color: colors.gold, marginBottom: '10px', fontWeight: 700 }}>
                        ✅ 이미지 생성 완료!
                      </div>
                      <img src={imageResult} alt="Generated" style={{ maxWidth: '100%', borderRadius: '12px' }} />
                    </>
                  ) : (
                    <div style={{ color: colors.white, lineHeight: '1.8', fontSize: '1rem' }}>
                      {formatMarkdown(imageResult)}
                    </div>
                  )}
                </OutputBox>
              )}
            </SectionCard>

            {/* 🎮 게임 스타일 완료 배너 */}
            <div style={{
              textAlign: 'center',
              padding: '40px 30px',
              marginTop: '40px',
              borderRadius: '24px',
              background: `linear-gradient(135deg, ${colors.navyLight}, ${colors.navy})`,
              border: `4px solid ${colors.gold}`,
              boxShadow: '0 20px 60px rgba(255, 214, 10, 0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 축하 파티클 효과 */}
              <div style={{ position: 'absolute', top: '10px', left: '20%', fontSize: '2rem', opacity: 0.6 }}>🎊</div>
              <div style={{ position: 'absolute', top: '15px', right: '15%', fontSize: '1.5rem', opacity: 0.5 }}>⭐</div>
              <div style={{ position: 'absolute', bottom: '20px', left: '10%', fontSize: '1.8rem', opacity: 0.4 }}>🌟</div>
              <div style={{ position: 'absolute', bottom: '15px', right: '20%', fontSize: '1.5rem', opacity: 0.6 }}>✨</div>

              <div style={{ position: 'relative', zIndex: 2 }}>
                {/* 🎮 픽셀 캐릭터들 축하 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '8px',
                    border: '2px solid #4ecdc4'
                  }}>
                    <PixelRunner sprite="char02" isRunning={false} scale={1.2} direction="down" />
                  </div>
                  <div style={{
                    background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 40px rgba(255, 214, 10, 0.5)'
                  }}>
                    <span style={{ fontSize: '2.8rem' }}>🏆</span>
                  </div>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '8px',
                    border: '2px solid #f38181'
                  }}>
                    <PixelRunner sprite="char04" isRunning={false} scale={1.2} direction="down" />
                  </div>
                </div>

                {/* 레벨 업 배지 */}
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
                  color: '#fff',
                  padding: '8px 25px',
                  borderRadius: '25px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  marginBottom: '15px',
                  boxShadow: '0 5px 20px rgba(255, 107, 107, 0.4)'
                }}>
                  🎮 STAGE CLEAR!
                </div>

                <h3 style={{ color: colors.gold, fontSize: '1.8rem', fontWeight: 900, marginBottom: '15px' }}>
                  AI 두뇌 탐험 완료! 🧠✨
              </h3>

                {/* 획득한 능력 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                  flexWrap: 'wrap',
                  marginBottom: '25px'
                }}>
                  {[
                    { icon: '🐍', text: 'Python 기초', color: '#4ecdc4' },
                    { icon: '🧠', text: 'AI 구조 이해', color: colors.gold },
                    { icon: '✨', text: 'AI 호출', color: '#95e1d3' },
                  ].map((skill) => (
                    <div key={skill.text} style={{
                      background: `${skill.color}20`,
                      border: `2px solid ${skill.color}`,
                      padding: '12px 20px',
                      borderRadius: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>{skill.icon}</span>
                      <span style={{ color: skill.color, fontWeight: 700, fontSize: '0.9rem' }}>{skill.text}</span>
                    </div>
                  ))}
                </div>

                {/* 캐릭터 메시지 */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <span style={{ fontSize: '3rem' }}>🤖</span>
                  <p style={{ 
                    color: colors.white, 
                    fontSize: '1rem', 
                    lineHeight: 1.7,
                    margin: 0,
                    textAlign: 'left'
                  }}>
                    "이제 내 <strong style={{color: colors.gold}}>두뇌 속</strong>을 알게 됐어! 🎉<br />
                    <strong style={{color: '#4ecdc4'}}>바이브코딩</strong>으로 나를 더 활용해봐! 💪"
                  </p>
                </div>

                <p style={{ color: colors.gold, fontSize: '1.15rem', fontWeight: 700, marginBottom: '0' }}>
                  어렵지만 내가 있잖아, 제이멘토가! 💪✨
                </p>
              </div>
            </div>
          </>
        )}

        {/* 3km 조깅 - AI 생성 풀코스 */}
        {selectedLevel === 2 && (
          <>
            {!isApiKeySet && (
              <div style={{
                background: 'rgba(255, 214, 10, 0.15)',
                borderRadius: '16px',
                padding: '25px',
                marginBottom: '30px',
                border: `2px solid ${colors.gold}40`,
                textAlign: 'center'
              }}>
                <p style={{ color: colors.gold, fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>
                  ⚠️ API 키가 필요해요!
                </p>
                <p style={{ color: colors.white, fontSize: '1rem', lineHeight: 1.7 }}>
                  위에서 API 키를 먼저 설정해주세요! 🔑
                </p>
              </div>
            )}

            {/* Step 1: 텍스트 생성 */}
            <SectionCard title="텍스트 생성" step={1} emoji="✍️">
              <p style={{ color: colors.gray, marginBottom: '20px', fontSize: '1rem' }}>
                prompt 변수를 수정하고 실행해보세요!
              </p>
              <CodeEditor defaultValue={defaultCodes.text} onRun={generateText} loading={textLoading} />
              {textResult && (
                <OutputBox>
                  <div style={{ color: colors.white, lineHeight: '1.8', fontSize: '1rem' }}>{formatMarkdown(textResult)}</div>
                </OutputBox>
              )}
            </SectionCard>

            {/* Step 2: 이미지 생성 */}
            <SectionCard title="이미지 생성 (나노 바나나 🍌)" step={2} emoji="🎨">
              <p style={{ color: colors.gray, marginBottom: '20px', fontSize: '1rem' }}>
                원하는 이미지를 설명하고 AI가 그려줍니다!
              </p>
              <CodeEditor defaultValue={defaultCodes.image} onRun={generateImage} loading={imageLoading} />
              {imageResult && (
                <OutputBox type={imageResult.startsWith('error:') ? 'error' : 'image'}>
                  {imageResult.startsWith('error:') ? (
                    <div style={{ color: '#f85149' }}>{imageResult.replace('error:', '')}</div>
                  ) : (
                    <img src={imageResult} alt="Generated" style={{ maxWidth: '100%', borderRadius: '12px' }} />
                  )}
                </OutputBox>
              )}
            </SectionCard>

            {/* Step 3: 실시간 날씨 */}
            <SectionCard title="실시간 날씨 차트" step={3} emoji="🌦️" isNew>
              <p style={{ color: colors.gray, marginBottom: '20px', fontSize: '1rem' }}>
                <strong style={{ color: '#ff6b6b' }}>Gemini 3 Pro</strong>가 실시간 날씨를 검색해서 차트로!
              </p>
              <CodeEditor defaultValue={defaultCodes.weather} onRun={generateWeather} loading={weatherLoading} />
              {weatherResult && (
                <OutputBox type={weatherResult.startsWith('error:') ? 'error' : 'image'}>
                  {weatherResult.startsWith('error:') ? (
                    <div style={{ color: '#f85149' }}>{weatherResult.replace('error:', '')}</div>
                  ) : (
                    <img src={weatherResult} alt="Weather" style={{ maxWidth: '100%', borderRadius: '12px' }} />
                  )}
                </OutputBox>
              )}
            </SectionCard>

            {/* Step 4: Veo 영상 1개 생성 */}
            <SectionCard title="영상 1개 생성 (Veo 3)" step={4} emoji="🎥">
              <p style={{ color: colors.gray, marginBottom: '15px', fontSize: '0.95rem' }}>
                텍스트로 <strong style={{ color: colors.gold }}>8초 영상</strong>을 만들어요!
              </p>

              {/* 시각화 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
                marginBottom: '20px',
                padding: '15px',
                background: colors.navy,
                borderRadius: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>📝</div>
                  <div style={{ color: colors.gray, fontSize: '0.7rem' }}>텍스트</div>
                </div>
                <div style={{ color: colors.gold, fontSize: '1.5rem' }}>→</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>🎬</div>
                  <div style={{ color: colors.gold, fontSize: '0.7rem', fontWeight: 600 }}>Veo 3</div>
                </div>
                <div style={{ color: colors.gold, fontSize: '1.5rem' }}>→</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>▶️</div>
                  <div style={{ color: '#4ecdc4', fontSize: '0.7rem', fontWeight: 600 }}>8초 영상</div>
                </div>
              </div>

              <CodeEditor 
                defaultValue={defaultCodes.veo} 
                onRun={generateVeo} 
                loading={veoLoading} 
              />
              {veoResult && (
                <OutputBox type={veoResult.startsWith('error:') ? 'error' : 'text'}>
                  {veoResult.startsWith('error:') ? (
                    <div style={{ color: '#f85149' }}>{veoResult.replace('error:', '')}</div>
                  ) : veoResult.startsWith('video:') || veoResult.startsWith('data:video') ? (
                    <div>
                      <div style={{ color: colors.gold, marginBottom: '10px', fontWeight: 700 }}>
                        ✅ 영상 생성 완료! (8초)
                      </div>
                      <video 
                        controls 
                        src={veoResult.replace('video:', '')} 
                        style={{ maxWidth: '100%', borderRadius: '12px' }}
                      />
                    </div>
                  ) : (
                    <div style={{ color: colors.gold, fontSize: '1rem' }}>{veoResult}</div>
                  )}
                </OutputBox>
              )}
            </SectionCard>

            {/* Step 5: Veo 스토리 연결 */}
            <SectionCard title="연속 영상 생성 (스토리 연결)" step={5} emoji="🎬" isNew>
              <p style={{ color: colors.gray, marginBottom: '15px', fontSize: '0.95rem' }}>
                여러 장면을 <strong style={{ color: colors.gold }}>이어붙여서</strong> 하나의 스토리로!
              </p>

              {/* 스토리 시각화 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
                padding: '15px',
                background: colors.navy,
                borderRadius: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{ 
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1rem' }}>🐱🚗</div>
                  <div style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 600 }}>Scene 1</div>
                </div>
                <div style={{ color: colors.gold }}>+</div>
                <div style={{ 
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, #95e1d3, #70c1b3)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1rem' }}>🚗✈️</div>
                  <div style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 600 }}>Scene 2</div>
                </div>
                <div style={{ color: colors.gold }}>+</div>
                <div style={{ 
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, #ffd93d, #ff9500)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1rem' }}>🌈🐱</div>
                  <div style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 600 }}>Scene 3</div>
                </div>
                <div style={{ color: colors.gold }}>=</div>
                <div style={{ 
                  padding: '8px 15px',
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1rem' }}>🎥</div>
                  <div style={{ color: colors.navy, fontSize: '0.6rem', fontWeight: 700 }}>22초!</div>
                </div>
              </div>

              <CodeEditor 
                defaultValue={defaultCodes.veoStory} 
                onRun={generateVeoStory} 
                loading={veoStoryLoading} 
              />
              {veoStoryResult && (
                <OutputBox type={veoStoryResult.startsWith('error:') ? 'error' : 'text'}>
                  {veoStoryResult.startsWith('error:') ? (
                    <div style={{ color: '#f85149' }}>{veoStoryResult.replace('error:', '')}</div>
                  ) : veoStoryResult.startsWith('video:') || veoStoryResult.startsWith('data:video') ? (
                    <div>
                      <div style={{ color: colors.gold, marginBottom: '10px', fontWeight: 700 }}>
                        ✅ 스토리 영상 완료! (22초)
                      </div>
                      <video 
                        controls 
                        src={veoStoryResult.replace('video:', '')} 
                        style={{ maxWidth: '100%', borderRadius: '12px' }}
                      />
                    </div>
                  ) : (
                    <div style={{ color: colors.gold, fontSize: '1rem' }}>{veoStoryResult}</div>
                  )}
                </OutputBox>
              )}
            </SectionCard>

            {/* 완료 CTA */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.navyLight}, ${colors.navy})`,
              borderRadius: '30px',
              padding: 'clamp(40px, 8vw, 60px)',
              textAlign: 'center',
              border: `3px solid ${colors.gold}`,
              boxShadow: '0 25px 80px rgba(255, 214, 10, 0.15)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏃</div>
              <h3 style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                marginBottom: '20px',
                fontWeight: 400,
                color: colors.white
              }}>
                <span style={{ color: colors.gold, fontWeight: 800 }}>3km 조깅</span> 완료! 🎉
              </h3>
              <p style={{ color: colors.gray, marginBottom: '30px', lineHeight: 1.8, fontSize: '1.1rem' }}>
                여러분은 방금 AI로 텍스트, 이미지, 음성까지 만들었어요!<br />
                <strong style={{color: colors.gold}}>코드 보고 쫄지 않는 체력</strong>이 생겼습니다 💪
              </p>
              
              <div style={{
                background: colors.navy,
                borderRadius: '20px',
                padding: '25px',
                marginBottom: '30px',
                textAlign: 'left',
                border: `2px solid ${colors.navyMid}`
              }}>
                <p style={{ color: colors.gold, fontWeight: 700, marginBottom: '15px', fontSize: '1.1rem' }}>🏃 러닝 기록:</p>
                <div style={{ color: colors.gray, lineHeight: 2.2, fontSize: '1rem' }}>
                  🔒 Lv.1 🚶 1km 워밍업 - Python 기초<br />
                  ✅ <strong style={{ color: colors.gold }}>Lv.2 🏃 3km 조깅 - AI 생성 풀코스 (완료!)</strong><br />
                  🔒 Lv.3 🏃‍♂️ 5km 러닝 - 프롬프트 엔지니어링<br />
                  🔒 Lv.4 🏃‍♀️ 10km 레이스 - 이미지 생성 심화<br />
                  🔒 Lv.5 🏅 하프마라톤 - 실전 프로젝트
                </div>
              </div>

              <button
                onClick={() => navigate('/ai-building-course')}
                style={{
                  padding: '18px 45px',
                  borderRadius: '15px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
                  color: colors.navy,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  boxShadow: '0 10px 35px rgba(255, 214, 10, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                전체 강의 보러가기 →
              </button>
            </div>

            {/* 푸터 */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '60px', 
              paddingBottom: '40px',
              color: colors.gray,
              fontSize: '1rem'
            }}>
              <p style={{ marginBottom: '10px', fontStyle: 'italic' }}>
                "코드 보고 쫄지 마세요. 이미 하고 있잖아요." - Jay
              </p>
              <p style={{ color: colors.navyMid, fontSize: '0.9rem' }}>
                AI CITY BUILDERS
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIGymPage;
