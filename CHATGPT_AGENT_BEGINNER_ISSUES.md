# ChatGPT AI AGENT 비기너편 페이지 수정 필요 사항

## 🚨 긴급 수정 필요

### 1. 커리큘럼 데이터 구조 결정
**현재 문제:**
- 강의 데이터: 15개 (Day 1-15, Week 1-3 구조)
- UI 설명: 18강의, Part 0-5 구조
- 중복 렌더링 시도

**해결 방안 A: Week 구조 유지 (15강의)**
```typescript
// 2493라인 수정
<strong style={{ color: '#0ea5e9' }}>15강의</strong>로 완성하는 실전 AI 에이전트 개발 과정입니다.

// 3276-3802라인 삭제 (Part 3, 4, 5 중복 섹션)
// Week 1-3 구조만 유지
```

**해결 방안 B: Part 구조로 전환 (18강의)**
```typescript
// lessons 배열에 3개 강의 추가 (총 18개)
// Part 0-5 구조로 lessons 재구성
// Week 1-3 섹션 삭제하고 Part 0-5 섹션만 유지
```

### 2. 미사용 코드 정리

```typescript
// 12-15라인: 미사용 상태 변수 제거
- const [isLoading, setIsLoading] = useState(false);
- const [, setCheckingEnrollment] = useState(false);
- const [, setIsAlreadyEnrolled] = useState(false);

// 335-337라인: 미사용 함수 제거
- const handleLoginRequired = () => {
-   alert('로그인이 필요한 서비스입니다.');
- };
```

### 3. 스타일 최적화

**인라인 스타일을 CSS 모듈로 분리:**
```typescript
// 현재: 모든 스타일이 인라인으로 작성되어 있음
// 권장: CSS 모듈이나 styled-components 사용

// 특히 반복되는 hover 효과들:
onMouseOver={(e) => {
  e.currentTarget.style.transform = 'translateY(-5px)';
  e.currentTarget.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.2)';
}}

// CSS로 변경:
.lesson-card {
  transition: all 0.3s ease;
}
.lesson-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(14, 165, 233, 0.2);
}
```

### 4. 접근성 개선

```typescript
// 클릭 가능한 div에 role 추가
<div
  onClick={() => toggleChapter(lesson.id)}
  role="button"
  tabIndex={0}
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleChapter(lesson.id);
    }
  }}
  aria-expanded={expandedChapters.has(lesson.id)}
  aria-label={`${lesson.title} 상세 정보 토글`}
>
```

## ⚡ 성능 최적화

### 1. 메모이제이션
```typescript
// 챕터 토글 함수 메모이제이션
const toggleChapter = useCallback((chapterId: number) => {
  setExpandedChapters(prev => {
    const newSet = new Set(prev);
    if (newSet.has(chapterId)) {
      newSet.delete(chapterId);
    } else {
      newSet.add(chapterId);
    }
    return newSet;
  });
}, []);
```

### 2. 컴포넌트 분리
현재 3800+ 라인의 단일 컴포넌트를 다음과 같이 분리:

```
ChatGPTAgentBeginnerPage/
  ├── index.tsx (메인)
  ├── components/
  │   ├── CountdownTimer.tsx
  │   ├── PricingSection.tsx
  │   ├── MissionSection.tsx
  │   ├── MentorSection.tsx
  │   ├── CurriculumSection.tsx
  │   ├── LessonCard.tsx
  │   └── EarlyBirdModal.tsx
```

## 🐛 버그 수정

### 1. 강의 인덱스 불일치
```typescript
// 2994라인: Week 2 강의 인덱스
{index + 5} // 올바름

// 3169라인: Week 3 강의 인덱스
{index + 10} // 올바름

// 3345라인: Part 3 강의 인덱스
{index + 10} // 잘못됨 - Week 3과 중복

// 3521라인: Part 4 강의 인덱스
{index + 13} // 잘못됨 - 존재하지 않는 강의

// 3697라인: Part 5 강의 인덱스
{index + 16} // 잘못됨 - 존재하지 않는 강의
```

### 2. 타입 안정성
```typescript
// 현재: any 타입 사용
const [userInfo, setUserInfo] = useState<any>(null);

// 개선: 명확한 타입 정의
interface UserInfo {
  email: string;
  name: string;
  // 기타 필요한 필드들
}
const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
```

## 📝 권장 수정 순서

1. **긴급 (지금 바로)**: 커리큘럼 구조 결정 및 중복 제거
2. **높음 (이번 주)**: 미사용 코드 정리, 타입 안정성 개선
3. **중간 (다음 주)**: 컴포넌트 분리, 스타일 최적화
4. **낮음 (여유있을 때)**: 접근성 개선, 성능 최적화

## 🎯 즉시 적용 가능한 빠른 수정

```typescript
// 1. 18강의 → 15강의로 수정
// 2493라인
- <strong style={{ color: '#0ea5e9' }}>18강의</strong>로 완성하는
+ <strong style={{ color: '#0ea5e9' }}>15강의</strong>로 완성하는

// 2. 중복 섹션 삭제
// 3276-3802라인 전체 삭제 (Part 3, 4, 5)

// 3. Part 카드 섹션 수정 (2544-2718라인)
// 실제 구조에 맞게 수정 또는 삭제
```

