import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 추천 링크 추적을 위한 커스텀 훅
export const useReferralTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // URL 파라미터에서 ref 값 추출
    const urlParams = new URLSearchParams(location.search);
    const referralCode = urlParams.get('ref');

    if (referralCode) {
      // 추천 코드가 있으면 세션 스토리지에 저장
      sessionStorage.setItem('referralCode', referralCode.toUpperCase());
      
      // 로그 출력 (개발용)
      console.log('🔗 추천 링크 감지:', referralCode.toUpperCase());
      
      // URL에서 ref 파라미터 제거 (깔끔한 URL 유지)
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('ref');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [location]);

  // 현재 저장된 추천 코드 반환
  const getStoredReferralCode = (): string | null => {
    return sessionStorage.getItem('referralCode');
  };

  // 추천 코드 제거 (회원가입 완료 후 호출)
  const clearReferralCode = (): void => {
    sessionStorage.removeItem('referralCode');
  };

  return {
    getStoredReferralCode,
    clearReferralCode
  };
};

// 추천 링크 생성 유틸리티
export const generateReferralLink = (referralCode: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/?ref=${referralCode}`;
};

// 추천 링크 복사 유틸리티
export const copyReferralLink = async (referralCode: string): Promise<boolean> => {
  try {
    const link = generateReferralLink(referralCode);
    await navigator.clipboard.writeText(link);
    return true;
  } catch (error) {
    console.error('링크 복사 실패:', error);
    return false;
  }
};
