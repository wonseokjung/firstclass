# 💰 포인트 시스템 가이드

## 개요
강의 수료 시 10,000 포인트를 지급하고, 결제 시 포인트를 사용할 수 있는 시스템입니다.

## ✅ 구현 완료 사항

### 1️⃣ Day 10 완료 시 10,000 포인트 자동 지급
- **파일**: `src/components/pages/courses/chatgpt-agent-beginner/Day10Page.tsx`
- **기능**: Day 10 완료 버튼 클릭 시 자동으로 10,000 포인트 지급
- **중복 방지**: 같은 강의로는 한 번만 보상 지급

### 2️⃣ AzureTableService에 포인트 관리 메서드 추가
- **파일**: `src/services/azureTableService.ts`
- **추가된 메서드**:
  - `grantCompletionReward()`: 수료 보상 지급
  - `usePointsForPayment()`: 결제 시 포인트 사용
  - `getUserPoints()`: 사용자 포인트 잔액 조회

### 3️⃣ 포인트 트랜잭션 타입 추가
- `course_completion`: 강의 수료 보상
- `point_usage`: 포인트 사용 (결제)

## 📝 사용 방법

### 포인트 조회
```typescript
import AzureTableService from './services/azureTableService';

// 사용자 포인트 조회
const points = await AzureTableService.getUserPoints(userEmail);
console.log('현재 포인트:', points);
```

### 결제 시 포인트 사용 예시

```typescript
import AzureTableService from './services/azureTableService';

const handlePaymentWithPoints = async (
  userEmail: string,
  courseId: string,
  originalPrice: number,
  pointsToUse: number
) => {
  try {
    // 1. 사용자 포인트 확인
    const availablePoints = await AzureTableService.getUserPoints(userEmail);
    
    if (availablePoints < pointsToUse) {
      alert(`포인트가 부족합니다. (보유: ${availablePoints}P)`);
      return;
    }

    // 2. 실제 결제 금액 계산
    const finalPrice = originalPrice - pointsToUse;
    
    if (finalPrice <= 0) {
      // 전액 포인트 결제
      const orderId = `order_${Date.now()}`;
      
      // 포인트 차감
      await AzureTableService.usePointsForPayment(userEmail, pointsToUse, orderId);
      
      // 수강 등록
      await AzureTableService.addPurchaseAndEnrollmentToUser({
        email: userEmail,
        courseId: courseId,
        title: '강의명',
        amount: 0,
        paymentMethod: 'points',
        orderId: orderId
      });
      
      alert('🎉 포인트로 결제가 완료되었습니다!');
    } else {
      // 부분 포인트 결제 + 실제 결제
      const orderId = `order_${Date.now()}`;
      
      // 포인트 차감
      await AzureTableService.usePointsForPayment(userEmail, pointsToUse, orderId);
      
      // 토스페이먼츠 등 실제 결제 진행
      // ... 결제 로직 ...
      
      // 수강 등록
      await AzureTableService.addPurchaseAndEnrollmentToUser({
        email: userEmail,
        courseId: courseId,
        title: '강의명',
        amount: finalPrice,
        paymentMethod: 'card+points',
        orderId: orderId
      });
    }
  } catch (error) {
    console.error('결제 오류:', error);
    alert('결제 중 오류가 발생했습니다.');
  }
};
```

### 결제 페이지 UI 예시 (React Component)

```tsx
import React, { useState, useEffect } from 'react';
import AzureTableService from '../services/azureTableService';

const PaymentPage = ({ courseId, coursePrice }) => {
  const [userEmail, setUserEmail] = useState('');
  const [availablePoints, setAvailablePoints] = useState(0);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [finalPrice, setFinalPrice] = useState(coursePrice);

  useEffect(() => {
    // 로그인 사용자 정보 가져오기
    const userInfo = sessionStorage.getItem('aicitybuilders_user_session');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setUserEmail(parsed.email);
      
      // 포인트 조회
      AzureTableService.getUserPoints(parsed.email).then(points => {
        setAvailablePoints(points);
      });
    }
  }, []);

  useEffect(() => {
    // 최종 결제 금액 계산
    setFinalPrice(Math.max(0, coursePrice - pointsToUse));
  }, [pointsToUse, coursePrice]);

  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const maxPoints = Math.min(availablePoints, coursePrice);
    setPointsToUse(Math.min(value, maxPoints));
  };

  const useAllPoints = () => {
    const maxPoints = Math.min(availablePoints, coursePrice);
    setPointsToUse(maxPoints);
  };

  const handlePayment = async () => {
    // 결제 로직 (위의 handlePaymentWithPoints 사용)
    await handlePaymentWithPoints(userEmail, courseId, coursePrice, pointsToUse);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>결제하기</h2>
      
      {/* 포인트 사용 섹션 */}
      <div style={{
        background: '#f0f9ff',
        border: '2px solid #0ea5e9',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>💰 포인트 사용</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <p style={{ margin: '0 0 10px 0', color: '#64748b' }}>
            보유 포인트: <strong style={{ color: '#0ea5e9' }}>{availablePoints.toLocaleString()}P</strong>
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="number"
            value={pointsToUse}
            onChange={handlePointsChange}
            max={Math.min(availablePoints, coursePrice)}
            min="0"
            step="1000"
            placeholder="사용할 포인트"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '16px'
            }}
          />
          <button
            onClick={useAllPoints}
            style={{
              padding: '10px 20px',
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            전액 사용
          </button>
        </div>
        
        {pointsToUse > 0 && (
          <p style={{ margin: '10px 0 0 0', color: '#10b981', fontSize: '14px' }}>
            ✅ {pointsToUse.toLocaleString()}P 사용 (-{pointsToUse.toLocaleString()}원)
          </p>
        )}
      </div>

      {/* 결제 금액 요약 */}
      <div style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>결제 금액</h3>
        
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <span>강의 가격:</span>
          <span>{coursePrice.toLocaleString()}원</span>
        </div>
        
        {pointsToUse > 0 && (
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
            <span>포인트 할인:</span>
            <span>-{pointsToUse.toLocaleString()}원</span>
          </div>
        )}
        
        <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '700' }}>
          <span>최종 결제 금액:</span>
          <span style={{ color: '#0ea5e9' }}>{finalPrice.toLocaleString()}원</span>
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        style={{
          width: '100%',
          padding: '15px',
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '18px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        {finalPrice === 0 ? '포인트로 결제하기' : `${finalPrice.toLocaleString()}원 결제하기`}
      </button>
    </div>
  );
};

export default PaymentPage;
```

## 🎁 보상 지급 조건

1. **수료 완료**: ChatGPT 에이전트 초급 과정 Day 1~10 모두 완료
2. **중복 방지**: 동일 강의로는 한 번만 보상 지급
3. **자동 지급**: Day 10 완료 버튼 클릭 시 자동으로 포인트 지급

## 💳 포인트 사용 규칙

1. **사용 단위**: 1원 = 1포인트
2. **최대 사용**: 강의 가격 범위 내에서 사용 가능
3. **전액 사용 가능**: 포인트만으로 전액 결제 가능
4. **부분 사용 가능**: 일부만 포인트로 사용하고 나머지는 카드 결제
5. **포인트 차감**: 결제 완료 시 즉시 차감

## 📊 포인트 내역 확인

사용자의 포인트 내역은 리워드 현황에서 확인할 수 있습니다:

```typescript
const rewardStatus = await AzureTableService.getUserRewardStatus(userEmail);

console.log('총 포인트:', rewardStatus.totalRewards);
console.log('포인트 내역:', rewardStatus.rewardHistory);
// 각 내역의 sourceType으로 구분:
// - 'course_completion': 강의 수료 보상
// - 'point_usage': 포인트 사용
// - 'signup_reward': 가입 보상
// - 'course_purchase': 추천 리워드
```

## 🔄 향후 확장 가능 기능

1. **이벤트 포인트**: 특별 이벤트 시 추가 포인트 지급
2. **출석 포인트**: 매일 로그인 시 포인트 지급
3. **리뷰 포인트**: 강의 리뷰 작성 시 포인트 지급
4. **포인트 만료**: 일정 기간 후 포인트 만료 설정
5. **포인트 선물**: 다른 사용자에게 포인트 전송

## ⚠️ 주의사항

1. 포인트는 실제 금액과 동일하게 취급되므로 신중하게 관리해야 합니다
2. 중복 지급을 방지하기 위해 트랜잭션 로그를 반드시 확인합니다
3. 포인트 차감 시 잔액 확인을 먼저 수행합니다
4. 결제 실패 시 포인트를 다시 복구하는 롤백 로직이 필요할 수 있습니다

## 🎉 완료!

이제 사용자가 강의를 수료하면 10,000 포인트를 받고, 다음 강의 구매 시 포인트를 사용할 수 있습니다!

