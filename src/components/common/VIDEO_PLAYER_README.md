# VideoPlayer Component 사용법

## ⚠️ 매우 중요한 경고

**VideoPlayer.tsx의 iframe 속성들은 절대 수정하지 마세요!**

## 왜 수정하면 안 되나요?

### 1. `referrerPolicy="strict-origin-when-cross-origin"`
- **없으면**: 배포 환경(HTTPS)에서 YouTube/Vimeo 영상이 재생되지 않습니다
- **로컬에서는 잘 작동**: 하지만 www.aicitybuilders.com에서는 영상이 안 보입니다
- **절대 삭제 금지**: 이것이 없으면 사용자들이 영상을 볼 수 없습니다

### 2. `allow` 속성
```typescript
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
```
- **accelerometer**: 디바이스 방향 감지
- **autoplay**: 자동 재생 기능
- **clipboard-write**: 클립보드 복사
- **encrypted-media**: DRM 콘텐츠 재생
- **gyroscope**: 360도 영상 지원
- **picture-in-picture**: PIP 모드
- **web-share**: 공유 기능

하나라도 빠지면 해당 기능이 작동하지 않습니다.

## 사용법

### 기본 사용
```tsx
import VideoPlayer from '../../common/VideoPlayer';

<VideoPlayer 
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="영상 제목"
/>
```

### ref와 함께 사용
```tsx
const iframeRef = useRef<HTMLIFrameElement>(null);

<VideoPlayer 
  ref={iframeRef}
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="영상 제목"
/>
```

### className 추가
```tsx
<VideoPlayer 
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="영상 제목"
  className="video-player"
/>
```

## 적용해야 할 파일들

이 컴포넌트를 사용해야 하는 파일들:
- ✅ `src/components/pages/courses/GoogleAICoursePage.tsx`
- ✅ `src/components/pages/courses/ChatGPTCoursePage.tsx`
- ✅ `src/components/pages/courses/AICodingCoursePage.tsx`
- ✅ `src/components/pages/courses/AIBusinessCoursePage.tsx`
- ✅ `src/components/pages/courses/AIBuildingCoursePage.tsx`
- ✅ 모든 Day 페이지들 (Day1Page.tsx ~ Day10Page.tsx)

## 문제가 생겼을 때

만약 영상이 안 보인다면:
1. 브라우저 콘솔 확인 (F12)
2. "Blocked by referrer policy" 에러가 있는지 확인
3. VideoPlayer 컴포넌트가 올바르게 import 되었는지 확인
4. VideoPlayer.tsx의 속성이 수정되지 않았는지 확인

## 절대 하지 말아야 할 것

❌ `referrerPolicy` 삭제  
❌ `allow` 속성 수정  
❌ `frameBorder="0"` 삭제  
❌ `allowFullScreen` 삭제  

## 반드시 해야 할 것

✅ VideoPlayer 컴포넌트 사용  
✅ 이 README 읽기  
✅ 수정하기 전에 팀원에게 물어보기  

