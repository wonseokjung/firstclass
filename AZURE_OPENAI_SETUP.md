# Azure OpenAI 설정 가이드

AI 도시 공사장의 Step 1(입지 선정) 기능을 사용하려면 Azure OpenAI를 연동해야 합니다.

## 📋 필요한 정보

Azure Portal에서 다음 정보를 확인하세요:

1. **Endpoint**: Azure OpenAI 서비스의 엔드포인트 URL
2. **API Key**: API 키 (Key 1 또는 Key 2)
3. **Deployment Name**: 배포한 모델의 이름 (예: gpt-4, gpt-35-turbo)

## 🔧 설정 방법

### 1. 환경 변수 파일 생성

프로젝트 루트 디렉토리에 `.env` 파일을 생성하세요:

```bash
# 프로젝트 루트에서 실행
touch .env
```

### 2. Azure OpenAI 정보 입력

`.env` 파일에 다음 내용을 추가하세요:

```env
# Azure OpenAI 설정
REACT_APP_AZURE_OPENAI_ENDPOINT=https://YOUR_RESOURCE_NAME.openai.azure.com/
REACT_APP_AZURE_OPENAI_KEY=your-api-key-here
REACT_APP_AZURE_OPENAI_DEPLOYMENT=gpt-4

# 백엔드 API (선택사항 - 보안 강화)
REACT_APP_BACKEND_URL=http://localhost:7071/api
```

### 3. Azure Portal에서 정보 확인하기

#### Endpoint 확인:
1. Azure Portal → Azure OpenAI 리소스 선택
2. Overview 페이지에서 "Endpoint" 클릭
3. URL 복사 (예: https://aicitybuilders.openai.azure.com/)

#### API Key 확인:
1. Azure Portal → Azure OpenAI 리소스 선택
2. "Keys and Endpoint" 메뉴 클릭 (또는 "Manage keys" 클릭)
3. Key 1 또는 Key 2 복사

#### Deployment Name 확인:
1. Azure AI Foundry Portal 접속 (https://ai.azure.com/)
2. 왼쪽 메뉴에서 "Deployments" 클릭
3. 배포된 모델 이름 확인 (예: gpt-4, gpt-35-turbo)

### 4. 개발 서버 재시작

환경 변수를 변경한 후에는 개발 서버를 재시작해야 합니다:

```bash
# Ctrl+C로 서버 중지 후
npm start
```

## 🚀 사용 방법

1. 웹사이트에서 "AI 도시 공사장" 메뉴 클릭
2. "Step 1: 입지 선정" 카드 클릭
3. 관심사 입력 (예: AI, 코딩, 투자 등)
4. 목표 월수익 선택
5. "AI 추천 받기" 버튼 클릭
6. AI가 유튜브 채널 주제를 추천합니다! 🎉

## 🔒 보안 강화 (선택사항)

프론트엔드에서 직접 Azure OpenAI를 호출하면 API 키가 노출될 수 있습니다.  
보안을 강화하려면 **백엔드 API**를 만들어서 사용하세요:

### Azure Functions로 백엔드 API 만들기

1. Azure Functions 프로젝트 생성:
```bash
func init BackendAPI --typescript
cd BackendAPI
func new --name RecommendYoutubeChannels --template "HTTP trigger"
```

2. `RecommendYoutubeChannels/index.ts` 파일 작성:
```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { userInterests, targetIncome } = req.body;

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
  const apiKey = process.env.AZURE_OPENAI_KEY!;
  const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT!;

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

  const prompt = `당신은 유튜브 채널 기획 전문가입니다...`;

  const result = await client.getChatCompletions(deploymentName, [
    { role: "system", content: "..." },
    { role: "user", content: prompt }
  ]);

  context.res = {
    body: JSON.parse(result.choices[0].message.content)
  };
};

export default httpTrigger;
```

3. Azure에 배포:
```bash
func azure functionapp publish YourFunctionAppName
```

4. 프론트엔드 `.env` 파일에 백엔드 URL 추가:
```env
REACT_APP_BACKEND_URL=https://your-function-app.azurewebsites.net/api
```

## 📊 현재 설정 정보 (참고용)

```
Resource Group: firstclass
Location: Korea Central
Subscription: Pay-As-You-Go
API Kind: OpenAI
Pricing Tier: Standard
```

## ❗ 문제 해결

### 오류: "Azure OpenAI 설정이 필요합니다"
- `.env` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수 이름이 정확한지 확인 (REACT_APP_로 시작)
- 개발 서버를 재시작했는지 확인

### 오류: "Azure OpenAI API 오류: 401 Unauthorized"
- API Key가 정확한지 확인
- API Key에 공백이나 줄바꿈이 포함되지 않았는지 확인

### 오류: "Azure OpenAI API 오류: 404 Not Found"
- Endpoint URL이 정확한지 확인
- Deployment Name이 정확한지 확인

## 💡 팁

1. **비용 절감**: GPT-3.5-Turbo 사용 시 비용이 더 저렴합니다
2. **응답 품질**: GPT-4 사용 시 더 정확하고 상세한 추천을 받을 수 있습니다
3. **폴백 기능**: Azure OpenAI 연결 실패 시 기본 추천이 제공됩니다

## 📚 참고 자료

- [Azure OpenAI Service 문서](https://learn.microsoft.com/azure/ai-services/openai/)
- [Azure OpenAI Quickstart](https://learn.microsoft.com/azure/ai-services/openai/quickstart)
- [Azure Functions 문서](https://learn.microsoft.com/azure/azure-functions/)

# Azure OpenAI 환경 변수 설정 완료 - Tue Dec  2 21:15:22 KST 2025
# Trigger redeploy for Azure env vars - Tue Dec  2 21:22:29 KST 2025
