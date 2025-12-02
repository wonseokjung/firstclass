/**
 * Azure OpenAI Service
 * Azure OpenAI API를 사용하여 유튜브 채널 주제를 추천합니다
 */

interface ChannelIdea {
  title: string;
  description: string;
  targetAudience: string;
  profitability: number;
  difficulty: '초급' | '중급' | '고급';
  keywords: string[];
  expectedMonthlyIncome: string;
}

interface ChannelRecommendationResponse {
  ideas: ChannelIdea[];
  analysis: string;
}

/**
 * Azure OpenAI를 사용하여 유튜브 채널 주제를 추천받습니다
 */
export async function recommendYoutubeChannels(
  userInterests: string,
  targetIncome: number = 1000000
): Promise<ChannelRecommendationResponse> {
  try {
    // Azure OpenAI 엔드포인트와 키는 환경 변수에서 가져옵니다
    const endpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.REACT_APP_AZURE_OPENAI_KEY;
    const deploymentName = process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT || 'gpt-4';

    if (!endpoint || !apiKey) {
      throw new Error('Azure OpenAI 설정이 필요합니다. 환경 변수를 확인해주세요.');
    }

    // 사용자 정보 파싱 (userInterests에 모든 정보가 포함되어 있음)
    const lines = userInterests.split('\n').filter(line => line.trim());
    const parsedInfo: any = {};
    lines.forEach(line => {
      if (line.includes('관심사/전문성:')) parsedInfo.interests = line.split(':')[1]?.trim();
      if (line.includes('인생 목표:')) parsedInfo.lifeGoal = line.split(':')[1]?.trim();
      if (line.includes('이것을 하는 이유:')) parsedInfo.motivation = line.split(':')[1]?.trim();
      if (line.includes('하루 일과:')) parsedInfo.dailyRoutine = line.split(':')[1]?.trim();
    });

    const prompt = `당신은 2024-2025년 유튜브 채널 기획 및 수익화 전문가입니다. 
최신 유튜브 알고리즘, 트렌드, CPM 데이터를 바탕으로 실전 가능한 채널을 추천합니다.

# 📋 사용자 프로필
${parsedInfo.interests ? `**관심사/전문성**: ${parsedInfo.interests}` : ''}
${parsedInfo.lifeGoal ? `**인생 목표**: ${parsedInfo.lifeGoal}` : ''}
${parsedInfo.motivation ? `**시작 동기**: ${parsedInfo.motivation}` : ''}
${parsedInfo.dailyRoutine ? `**하루 일과**: ${parsedInfo.dailyRoutine}` : ''}
**목표 월수익**: ${targetIncome.toLocaleString()}원

# 🎯 분석 미션
위 사용자의 **삶의 맥락**을 깊이 분석하여, 실현 가능성이 높은 유튜브 채널 5개를 추천하세요.

## 필수 고려 사항
1. **시간 현실성**: 하루 일과를 고려한 제작 가능 시간
2. **전문성 활용**: 기존 관심사/전문성을 최대한 활용
3. **2024-2025 트렌드**: 최신 유튜브 트렌드 (AI 활용, 숏폼, 자동화)
4. **수익 가능성**: 목표 월수익 달성을 위한 현실적인 CPM, 조회수 전략
5. **진입 장벽**: 초보자도 AI 도구로 시작 가능한 난이도
6. **차별화 전략**: 경쟁이 덜한 틈새 시장 또는 독특한 앵글

## 추천 기준
- **초급**: AI 도구만으로 제작 가능, 편집 최소, 1일 1-2시간
- **중급**: 일부 편집 필요, 1일 2-4시간, 기본 장비 필요
- **고급**: 전문 편집/촬영, 1일 4시간 이상

## 수익성 점수 (0-100)
- 90-100: 높은 CPM ($5-10), 광고 수익 + 제휴 마케팅 가능
- 70-89: 중간 CPM ($3-5), 광고 수익 중심
- 50-69: 낮은 CPM ($1-3), 조회수 대량 필요

다음 **JSON 형식**으로만 응답하세요:
{
  "ideas": [
    {
      "title": "구체적인 채널명 예시 (사용자 맥락 반영)",
      "description": "채널 설명 (3-4문장: 무엇을 다루며, 왜 수익성이 높고, AI로 어떻게 자동화할 수 있는지)",
      "targetAudience": "타겟 고객층 (연령대, 직업, 관심사)",
      "profitability": 85,
      "difficulty": "초급",
      "keywords": ["트렌드키워드1", "틈새키워드2", "차별화키워드3"],
      "expectedMonthlyIncome": "50만원 ~ 150만원 (조회수 X만 기준)"
    }
  ],
  "analysis": "사용자의 삶(일과, 목표, 동기)을 고려했을 때, 왜 이 5개 채널이 최적인지 구체적으로 설명 (3-5문장)"
}

**중요**: 사용자가 입력한 관심사, 동기, 일과를 **반드시 반영**하여 개인 맞춤형 추천을 제공하세요.`;

    const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-05-01-preview`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `당신은 10년 경력의 유튜브 전문 컨설턴트입니다.

**전문 분야:**
- 2024-2025 유튜브 알고리즘 및 최신 트렌드 분석
- AI 도구(ChatGPT, Gemini, Veo, CapCut) 활용 콘텐츠 자동화
- 숏폼 vs 롱폼 전략, CPM 최적화, 제휴 마케팅
- 틈새 시장 발굴 및 차별화 전략
- 0원 시작 → 월 100만원 달성 로드맵

**답변 원칙:**
1. 사용자의 삶(일과, 동기, 전문성)을 **깊이 반영**
2. 실현 가능성 우선 (이론보다 실전)
3. 구체적인 수치 제시 (조회수, CPM, 예상 수익)
4. AI 자동화 방법 명시
5. 경쟁 분석 및 차별화 포인트 제시`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 3000,
        temperature: 0.8,
        top_p: 0.92,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Azure OpenAI API 오류: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('응답을 받지 못했습니다.');
    }

    // JSON 파싱
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('올바른 JSON 형식의 응답을 받지 못했습니다.');
    }

    const result: ChannelRecommendationResponse = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('Azure OpenAI 추천 오류:', error);
    
    // 폴백: 기본 추천 제공
    return {
      ideas: [
        {
          title: 'AI 활용 비즈니스 팁',
          description: 'ChatGPT, Gemini 등 최신 AI 도구를 활용한 업무 효율화 및 수익 창출 방법을 소개하는 채널입니다.',
          targetAudience: '직장인, 프리랜서, 1인 사업자',
          profitability: 85,
          difficulty: '중급',
          keywords: ['ChatGPT', '업무자동화', 'AI수익화'],
          expectedMonthlyIncome: '80만원 ~ 150만원'
        },
        {
          title: '숏폼 제작 노하우',
          description: 'AI를 활용하여 유튜브 쇼츠, 인스타 릴스 등 숏폼 콘텐츠를 빠르게 제작하는 방법을 알려주는 채널입니다.',
          targetAudience: '크리에이터 지망생, 마케터',
          profitability: 90,
          difficulty: '초급',
          keywords: ['숏폼', '유튜브쇼츠', 'AI영상제작'],
          expectedMonthlyIncome: '100만원 ~ 200만원'
        },
        {
          title: '부업으로 월 100만원',
          description: '직장인이 퇴근 후 AI 도구를 활용하여 월 100만원 이상 부수익을 만드는 실전 노하우를 공유합니다.',
          targetAudience: '직장인, N잡러',
          profitability: 95,
          difficulty: '초급',
          keywords: ['부업', '월100만원', 'AI수익화'],
          expectedMonthlyIncome: '120만원 ~ 250만원'
        },
        {
          title: 'AI 그림으로 돈벌기',
          description: 'Midjourney, DALL-E 등으로 이미지를 생성하고 판매하여 수익을 창출하는 방법을 소개합니다.',
          targetAudience: '디자이너, 아티스트, 크리에이터',
          profitability: 75,
          difficulty: '중급',
          keywords: ['AI그림', 'Midjourney', '이미지판매'],
          expectedMonthlyIncome: '50만원 ~ 120만원'
        },
        {
          title: '제품 리뷰 자동화',
          description: 'AI를 활용하여 제품 리뷰 영상을 자동으로 제작하고 제휴 마케팅으로 수익을 내는 채널입니다.',
          targetAudience: '쇼핑 관심층, 제품 구매자',
          profitability: 80,
          difficulty: '중급',
          keywords: ['제품리뷰', '제휴마케팅', 'AI영상'],
          expectedMonthlyIncome: '60만원 ~ 150만원'
        }
      ],
      analysis: `입력하신 정보를 바탕으로 AI를 활용한 콘텐츠 자동화 채널을 추천드립니다. 2024-2025년 트렌드는 숏폼과 AI 자동화이며, 초기 투자 비용 거의 없이 Google OPAL(Veo, Gemini, Imagen) 같은 무료 AI 도구만으로도 전문가 수준의 콘텐츠 제작이 가능합니다. 하루 1-2시간 투자로 월 ${(targetIncome / 10000).toFixed(0)}만원 달성이 현실적이며, 특히 숏폼 콘텐츠는 조회수 확보가 빠르고 제작 시간이 짧아 직장인/부업으로도 최적입니다.`
    };
  }
}

/**
 * 백엔드 API를 통해 Azure OpenAI를 호출합니다 (보안 강화)
 */
export async function recommendYoutubeChannelsViaBackend(
  userInterests: string,
  targetIncome: number = 1000000
): Promise<ChannelRecommendationResponse> {
  try {
    // 백엔드 API 엔드포인트 (Azure Functions 또는 Express 서버)
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:7071/api';
    
    const response = await fetch(`${backendUrl}/recommend-youtube-channels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInterests,
        targetIncome,
      }),
    });

    if (!response.ok) {
      throw new Error(`백엔드 API 오류: ${response.statusText}`);
    }

    const data: ChannelRecommendationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('백엔드 API 추천 오류:', error);
    // 폴백: 직접 호출
    return recommendYoutubeChannels(userInterests, targetIncome);
  }
}

