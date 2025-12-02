/**
 * Azure AI Foundry Service
 * Azure AI Foundry API를 사용하여 유튜브 채널 주제를 추천합니다
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
 * Azure AI Foundry를 사용하여 유튜브 채널 주제를 추천받습니다
 */
export async function recommendYoutubeChannelsFoundry(
  userInterests: string,
  targetIncome: number = 1000000
): Promise<ChannelRecommendationResponse> {
  try {
    // Azure AI Foundry 엔드포인트와 키
    const projectEndpoint = process.env.REACT_APP_AZURE_AI_FOUNDRY_ENDPOINT;
    const projectKey = process.env.REACT_APP_AZURE_AI_FOUNDRY_KEY;
    const deploymentName = process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini';

    if (!projectEndpoint || !projectKey) {
      throw new Error('Azure AI Foundry 설정이 필요합니다. 환경 변수를 확인해주세요.');
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

    // Azure AI Foundry API 호출
    // AI Foundry는 /openai/deployments/{model}/chat/completions 형식 사용
    const url = `${projectEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-08-01-preview`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': projectKey,
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
      throw new Error(`Azure AI Foundry API 오류: ${errorData.error?.message || response.statusText}`);
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
    console.error('Azure AI Foundry 추천 오류:', error);
    throw error;
  }
}

