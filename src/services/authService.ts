// 인증 관련 서비스

export interface CurrentUser {
  email: string;
  name: string;
  emailVerified?: boolean;
  phone?: string;
  countryCode?: string;
}

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export const getCurrentUser = (): CurrentUser | null => {
  try {
    // sessionStorage에서 사용자 정보 가져오기
    const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
    
    if (!storedUserInfo) {
      return null;
    }

    const parsedUserInfo = JSON.parse(storedUserInfo);
    
    // 기본 필수 필드 확인
    if (!parsedUserInfo.email || !parsedUserInfo.name) {
      console.warn('⚠️ 사용자 정보가 불완전합니다.');
      return null;
    }

    return parsedUserInfo as CurrentUser;
  } catch (error) {
    console.error('❌ 사용자 정보 파싱 오류:', error);
    // 잘못된 데이터 제거
    sessionStorage.removeItem('aicitybuilders_user_session');
    return null;
  }
};

/**
 * 로그인 여부 확인
 */
export const isLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * 로그아웃
 */
export const logout = (): void => {
  sessionStorage.removeItem('aicitybuilders_user_session');
  localStorage.removeItem('aicitybuilders_user');
  console.log('✅ 로그아웃 완료');
};

/**
 * 사용자 정보 저장
 */
export const setCurrentUser = (user: CurrentUser): void => {
  try {
    sessionStorage.setItem('aicitybuilders_user_session', JSON.stringify(user));
    console.log('✅ 사용자 정보 저장 완료');
  } catch (error) {
    console.error('❌ 사용자 정보 저장 실패:', error);
  }
};

