# ChatGPT Agent Beginner 강의 관리

이 폴더는 ChatGPT AI AGENT 비기너편 강의(15일 완성)를 관리하기 위한 전용 폴더입니다.

## 📁 폴더 구조

```
chatgpt-agent-beginner/
├── ChatGPTAgentBeginnerPlayerPage.tsx  # 강의 목록 페이지 (결제 완료 유저용)
├── Day1Page.tsx                        # Day 1 강의 페이지
├── Day2Page.tsx                        # Day 2 강의 페이지 (추후 생성)
├── ...
├── Day15Page.tsx                       # Day 15 강의 페이지 (추후 생성)
├── index.ts                            # Day 페이지들을 export
└── README.md                           # 이 문서
```

## 🎯 페이지 역할

### 1. ChatGPTAgentBeginnerPage.tsx (상위 폴더)
- **경로**: `/chatgpt-agent-beginner`
- **역할**: 결제 전 유저를 위한 강의 소개 및 결제 페이지
- **기능**:
  - 강의 소개 및 커리큘럼 안내
  - 멘토 소개
  - 얼리버드 결제 모달
  - 결제 완료 시 Player 페이지로 리다이렉트

### 2. ChatGPTAgentBeginnerPlayerPage.tsx (이 폴더)
- **경로**: `/chatgpt-agent-beginner-player`
- **역할**: 결제 완료 유저를 위한 강의 목록 페이지
- **기능**:
  - 전체 진행률 표시
  - Week별로 그룹화된 Day 1~15 강의 목록
  - 완료 상태 추적
  - 각 Day 페이지로 이동

### 3. Day1Page.tsx ~ Day15Page.tsx (이 폴더)
- **역할**: 각 Day별 실제 강의 콘텐츠 페이지
- **기능**:
  - 이론 및 실습 섹션
  - 비디오 강의
  - 진행률 추적
  - 퀴즈
  - 추가 학습 자료

## 🚀 새로운 Day 페이지 추가하기

### Step 1: Day 페이지 복사
```bash
# Day1Page.tsx를 복사하여 새로운 Day 페이지 생성
cp Day1Page.tsx Day2Page.tsx
```

### Step 2: 강의 데이터 수정
`Day2Page.tsx`에서 `lessonData` 객체 수정:
```typescript
const lessonData = {
  day: 2,  // Day 번호 변경
  title: "나만의 첫 번째 챗봇 만들기",  // 제목 변경
  duration: "60분",
  description: "...",  // 설명 변경
  // ... 나머지 섹션 데이터 수정
};
```

### Step 3: index.ts 업데이트
```typescript
export { default as Day1Page } from './Day1Page';
export { default as Day2Page } from './Day2Page';  // 새로 추가
// ... Day 15까지
```

### Step 4: ChatGPTAgentBeginnerPlayerPage.tsx 업데이트
```typescript
// import 추가
import Day2Page from './Day2Page';

// 컴포넌트 내부 조건부 렌더링 추가
if (selectedDay === 1) {
  return <Day1Page onBack={() => setSelectedDay(null)} />;
}
if (selectedDay === 2) {  // 새로 추가
  return <Day2Page onBack={() => setSelectedDay(null)} />;
}
// ... Day 15까지
```

## 📋 각 Day 페이지에 포함할 내용

### 필수 섹션
1. **헤더**
   - Day 번호 및 제목
   - 소요 시간
   - 진행률 바

2. **학습 목표**
   - 이 Day에서 배울 내용 리스트

3. **이론 섹션**
   - 비디오 강의
   - 텍스트 설명 (HTML)
   - 예제 코드

4. **실습 섹션**
   - Step-by-step 가이드
   - 실습 비디오
   - 코드 예제

5. **퀴즈**
   - 이해도 체크 문제
   - 객관식 또는 주관식

6. **추가 자료**
   - 참고 문서 링크
   - 실습 파일 다운로드

## 🎨 스타일 가이드

### 색상 팔레트
- **Primary (브랜드 블루)**: `#0ea5e9`
- **Secondary (다크 블루)**: `#0284c7`
- **Success (그린)**: `#10b981`
- **Text (다크)**: `#1f2937`
- **Text (라이트)**: `#64748b`
- **Background**: `#f8fafc`

### 컴포넌트 스타일
- 카드: `borderRadius: '15px'`, `boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'`
- 버튼: `borderRadius: '10px'`, hover 효과 필수
- 제목: `fontWeight: '700'` ~ `'800'`

## 🔒 접근 권한

### ChatGPTAgentBeginnerPage (결제 페이지)
- ✅ 모든 사용자 접근 가능
- 로그인 시 결제 모달 표시

### ChatGPTAgentBeginnerPlayerPage (강의 목록)
- ✅ 결제 완료 유저만 접근
- ❌ 미결제 유저는 결제 페이지로 리다이렉트
- Azure Table Service로 결제 상태 확인

### Day Pages
- ✅ Player 페이지를 통해서만 접근
- Day별 잠금 기능 (추후 구현 가능)

## 📊 진행률 추적

### 로컬 스토리지
```typescript
// 완료한 Day 저장
const completedDays = new Set([1, 2, 3]);
localStorage.setItem('completed-days-chatgpt-agent', JSON.stringify([...completedDays]));

// 완료한 섹션 저장
const completedSections = new Set(['theory-1', 'practice-1']);
localStorage.setItem('completed-sections-day1', JSON.stringify([...completedSections]));
```

### 서버 동기화 (추후 구현)
- Azure Table Service에 진행률 저장
- 여러 기기에서 동기화

## 🛠️ 개발 팁

### 비디오 URL
- YouTube embed URL 형식: `https://www.youtube.com/embed/VIDEO_ID`
- 실제 비디오 업로드 후 VIDEO_ID 교체

### HTML 콘텐츠
- `dangerouslySetInnerHTML` 사용
- CSS 스타일은 `<style>` 태그로 관리
- 보안 주의 (XSS 방지)

### 반응형 디자인
- `clamp()` 함수로 반응형 폰트 크기
  ```css
  fontSize: 'clamp(1rem, 2vw, 1.2rem)'
  ```
- Grid/Flexbox로 반응형 레이아웃
  ```css
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
  ```

## 📝 체크리스트

새로운 Day 페이지를 추가할 때:
- [ ] Day{N}Page.tsx 파일 생성
- [ ] lessonData 객체 작성
- [ ] 비디오 URL 추가
- [ ] 이론/실습 콘텐츠 작성
- [ ] 퀴즈 문제 작성
- [ ] index.ts에 export 추가
- [ ] PlayerPage에 import 및 조건부 렌더링 추가
- [ ] 테스트: 결제 여부 확인
- [ ] 테스트: Day 페이지 이동
- [ ] 테스트: 진행률 저장

## 🚨 주의사항

1. **결제 상태 확인**: Player 페이지와 Day 페이지는 반드시 결제 확인 필요
2. **비디오 저작권**: 실제 비디오 업로드 시 저작권 확인
3. **콘텐츠 품질**: 오타, 문법 오류 체크
4. **브라우저 호환성**: 주요 브라우저에서 테스트
5. **모바일 최적화**: 모바일 환경에서 UI 확인

## 📞 문의

강의 콘텐츠 또는 기술적 문제 발생 시:
- Email: jay@connexionai.kr
- 개발팀: [GitHub Issues]

