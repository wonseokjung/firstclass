# 🚨 비디오 임베딩 설정 절대 변경 금지 🚨

## 이 파일은 왜 있나요?

개발자가 실수로 비디오 임베딩 설정을 바꾸는 것을 방지하기 위해 만들어졌습니다.

---

## 🔴 절대 변경하지 마세요!

### 모든 `<iframe>` 태그에는 반드시 다음이 포함되어야 합니다:

```tsx
<iframe
  src="..."
  title="..."
  frameBorder="0"
  allowFullScreen
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerPolicy="strict-origin-when-cross-origin"  // ⚠️ 이것이 가장 중요!
/>
```

---

## 🎯 가장 중요한 속성

### `referrerPolicy="strict-origin-when-cross-origin"`

#### ❌ 이것이 없으면:
- ✅ 로컬(localhost)에서는 영상이 잘 보입니다
- ❌ 배포 환경(www.aicitybuilders.com)에서는 영상이 안 보입니다
- ❌ 사용자들이 "영상이 안 나와요" 문의를 합니다
- ❌ YouTube/Vimeo가 CORS 에러를 발생시킵니다

#### ✅ 이것이 있으면:
- ✅ 모든 환경에서 영상이 정상 재생됩니다
- ✅ 사용자들이 문제없이 강의를 수강합니다

---

## 📋 체크리스트

비디오 관련 코드를 수정하기 전에:

- [ ] VideoPlayer 컴포넌트를 사용하고 있나요?
- [ ] 직접 `<iframe>`을 사용한다면 모든 필수 속성이 있나요?
- [ ] `referrerPolicy`를 실수로 삭제하지 않았나요?
- [ ] 로컬에서만 테스트하지 말고 배포 환경도 확인했나요?

---

## 🆘 문제 해결

### 배포 후 영상이 안 보인다면:

1. **브라우저 콘솔 확인** (F12)
   - `Refused to display ... in a frame` 에러 확인
   - `referrer policy` 관련 메시지 확인

2. **코드 확인**
   - `referrerPolicy="strict-origin-when-cross-origin"` 있는지 확인
   - `allow` 속성이 완전한지 확인

3. **해결 방법**
   - VideoPlayer 컴포넌트 사용: `<VideoPlayer src="..." title="..." />`
   - 또는 모든 필수 속성 추가

---

## 💡 권장 사항

### 1️⃣ VideoPlayer 컴포넌트 사용 (추천)
```tsx
import VideoPlayer from '../../common/VideoPlayer';

<VideoPlayer 
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="영상 제목"
/>
```

### 2️⃣ 직접 iframe 사용 (권장하지 않음)
```tsx
<iframe
  src="..."
  title="..."
  frameBorder="0"
  allowFullScreen
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerPolicy="strict-origin-when-cross-origin"
/>
```

---

## 📞 도움이 필요하시면

비디오 관련 문제가 생기면:
1. 이 파일을 다시 읽어주세요
2. `VIDEO_PLAYER_README.md` 파일을 확인해주세요
3. `VideoPlayer.tsx` 컴포넌트를 사용해주세요

---

## 🎓 교훈

> "로컬에서 잘 작동한다고 배포 환경에서도 잘 작동하는 것은 아닙니다."

비디오 임베딩은 CORS, Referrer Policy, Mixed Content 등 
여러 보안 정책의 영향을 받습니다.

반드시 배포 환경에서 테스트하세요! 🚀

---

**마지막 업데이트**: 2025-11-23  
**작성자**: AI City Builders 개발팀  
**중요도**: 🔴 매우 높음



