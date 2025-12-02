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

    const prompt = `당신은 유튜브 채널 기획 전문가입니다. 사용자의 관심사를 분석하여 수익성 높은 유튜브 채널 주제 5가지를 추천해주세요.

사용자 관심사: ${userInterests}
목표 월수익: ${targetIncome.toLocaleString()}원

다음 형식의 JSON으로 응답해주세요:
{
  "ideas": [
    {
      "title": "채널명 예시",
      "description": "채널 설명 (2-3문장)",
      "targetAudience": "타겟 고객층",
      "profitability": 85,
      "difficulty": "초급",
      "keywords": ["키워드1", "키워드2", "키워드3"],
      "expectedMonthlyIncome": "50만원 ~ 150만원"
    }
  ],
  "analysis": "전체적인 시장 분석 및 추천 이유"
}

profitability는 0-100 사이의 숫자로, 수익성을 나타냅니다.
difficulty는 "초급", "중급", "고급" 중 하나입니다.`;

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
            content: '당신은 유튜브 채널 기획 및 수익화 전문가입니다. AI를 활용한 콘텐츠 제작과 수익 최적화에 대한 깊은 지식을 가지고 있습니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.95,
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
      analysis: `${userInterests}에 관심이 있으시다면, AI를 활용한 콘텐츠 자동화 채널이 가장 적합합니다. 초기 투자 비용이 적고, AI 도구만으로도 전문가 수준의 콘텐츠를 제작할 수 있어 목표 월수익 달성이 현실적입니다. 특히 숏폼 콘텐츠는 조회수 확보가 빠르고, 제작 시간이 짧아 초보자에게 추천합니다.`
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

