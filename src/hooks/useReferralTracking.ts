import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 강의 페이지 경로 → 강의 ID 매핑
const COURSE_PATH_TO_ID: Record<string, string> = {
  '/ai-building-course': '999',      // Step 1: AI 건물주 되기
  '/chatgpt-agent-beginner': '1000', // Step 2: ChatGPT 에이전트
  '/ai-agent-dispatch': '1001',      // Step 3: AI 에이전트 파견소
  '/ceo-course': '1002',             // Step 4: CEO 과정
};

// 강의 ID → 강의 이름 매핑
export const COURSE_ID_TO_NAME: Record<string, string> = {
  '999': 'Step 1: AI 건물주 되기',
  '1000': 'Step 2: ChatGPT 에이전트',
  '1001': 'Step 3: AI 에이전트 파견소',
  '1002': 'Step 4: CEO 과정',
};

// 강의 ID → 가격 매핑
export const COURSE_ID_TO_PRICE: Record<string, number> = {
  '999': 36600,
  '1000': 79700,
  '1001': 95000,
  '1002': 150000,
};

// 추천 정보 인터페이스
interface ReferralInfo {
  referralCode: string;
  courseId: string;
  coursePath: string;
  timestamp: number;
}

// 추천 링크 추적을 위한 커스텀 훅
export const useReferralTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // URL 파라미터에서 ref 값 추출
    const urlParams = new URLSearchParams(location.search);
    const referralCode = urlParams.get('ref');

    if (referralCode) {
      // 현재 페이지의 강의 ID 확인
      const currentPath = location.pathname;
      const courseId = COURSE_PATH_TO_ID[currentPath] || null;

      // 추천 정보 저장 (강의 페이지에서 접속한 경우만 courseId 저장)
      const referralInfo: ReferralInfo = {
        referralCode: referralCode.toUpperCase(),
        courseId: courseId || '',
        coursePath: currentPath,
        timestamp: Date.now()
      };

      sessionStorage.setItem('referralInfo', JSON.stringify(referralInfo));
      
      // 기존 방식도 유지 (호환성)
      sessionStorage.setItem('referralCode', referralCode.toUpperCase());
      
      // 로그 출력
      console.log('🔗 추천 링크 감지:', {
        code: referralCode.toUpperCase(),
        courseId: courseId || '(메인 페이지)',
        path: currentPath
      });
      
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

  // 추천 정보 전체 반환
  const getStoredReferralInfo = (): ReferralInfo | null => {
    const info = sessionStorage.getItem('referralInfo');
    if (!info) return null;
    
    try {
      const parsed = JSON.parse(info) as ReferralInfo;
      
      // 24시간(86400000ms) 이내의 추천만 유효
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      if (Date.now() - parsed.timestamp > TWENTY_FOUR_HOURS) {
        console.log('⏰ 추천 정보 만료 (24시간 초과)');
        clearReferralInfo();
        return null;
      }
      
      return parsed;
    } catch {
      return null;
    }
  };

  // 특정 강의 구매 시 추천 코드 확인 (해당 강의만!)
  const checkReferralForCourse = (purchasedCourseId: string): { referralCode: string; isValid: boolean } | null => {
    const info = getStoredReferralInfo();
    
    if (!info) {
      console.log('❌ 추천 정보 없음');
      return null;
    }

    // 강의 ID가 일치하는지 확인
    if (info.courseId && info.courseId !== purchasedCourseId) {
      console.log(`❌ 강의 불일치: 추천(${info.courseId}) ≠ 구매(${purchasedCourseId})`);
      return { referralCode: info.referralCode, isValid: false };
    }

    console.log(`✅ 추천 유효: ${info.referralCode} → 강의 ${purchasedCourseId}`);
    return { referralCode: info.referralCode, isValid: true };
  };

  // 추천 코드 제거
  const clearReferralCode = (): void => {
    sessionStorage.removeItem('referralCode');
  };

  // 추천 정보 전체 제거
  const clearReferralInfo = (): void => {
    sessionStorage.removeItem('referralCode');
    sessionStorage.removeItem('referralInfo');
  };

  return {
    getStoredReferralCode,
    getStoredReferralInfo,
    checkReferralForCourse,
    clearReferralCode,
    clearReferralInfo
  };
};

// 강의별 추천 링크 생성
export const generateReferralLink = (referralCode: string, coursePath?: string): string => {
  const baseUrl = 'https://www.aicitybuilders.com';
  
  if (coursePath) {
    return `${baseUrl}${coursePath}?ref=${referralCode}`;
  }
  
  return `${baseUrl}?ref=${referralCode}`;
};

// 추천 링크 복사 유틸리티
export const copyReferralLink = async (referralCode: string, coursePath?: string): Promise<boolean> => {
  try {
    const link = generateReferralLink(referralCode, coursePath);
    await navigator.clipboard.writeText(link);
    return true;
  } catch (error) {
    console.error('링크 복사 실패:', error);
    return false;
  }
};
