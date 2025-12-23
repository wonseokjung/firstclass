// Azure SDK 대신 REST API 직접 호출 사용

// 🚀 개발 모드에서만 로그 출력 (프로덕션 성능 향상)
const isDev = process.env.NODE_ENV === 'development';
const devLog = (...args: unknown[]) => { if (isDev) console.log(...args); };
const devWarn = (...args: unknown[]) => { if (isDev) console.warn(...args); };
const devError = (...args: unknown[]) => { console.error(...args); }; // 에러는 항상 출력

/**
 * 🔐 보안 개선: Azure Table Storage SAS URLs
 * 
 * 환경변수로 관리하되, SAS URL은 읽기 전용 권한만 부여 권장
 * 민감한 쓰기 작업은 Azure Functions로 분리하는 것이 더 안전
 * 
 * 환경변수 설정 방법:
 * 1. .env.local 파일 생성 (Git에 커밋되지 않음)
 * 2. Azure Portal > Static Web Apps > Configuration에서 설정
 */
const AZURE_SAS_URLS = {
  users: process.env.REACT_APP_AZURE_SAS_URL_USERS || 'https://clathonstorage.table.core.windows.net/users?sp=raud&st=2025-12-07T14:26:24Z&se=2029-10-15T22:41:00Z&sv=2024-11-04&sig=5KPeZHVwROPfNh1KBESKRJrnE12hTd2fTtESe3x5YSU%3D&tn=users',
  sessions: process.env.REACT_APP_AZURE_SAS_URL_SESSIONS || 'https://clathonstorage.table.core.windows.net/mentoringssessions?sp=raud&st=2025-08-13T02:04:25Z&se=2030-10-13T10:19:00Z&spr=https&sv=2024-11-04&sig=ulo8yMTJqBhKB%2FeeIKycUxl8knzpbDkClU6NTaPrHYw%3D&tn=mentoringssessions',
  packages: process.env.REACT_APP_AZURE_SAS_URL_PACKAGES || 'https://clathonstorage.table.core.windows.net/studentpackages?sp=raud&st=2025-08-13T02:04:25Z&se=2030-10-13T10:19:00Z&spr=https&sv=2024-11-04&sig=ulo8yMTJqBhKB%2FeeIKycUxl8knzpbDkClU6NTaPrHYw%3D&tn=studentpackages',
  posts: process.env.REACT_APP_AZURE_SAS_URL_POSTS || 'https://clathonstorage.table.core.windows.net/posts?sp=raud&st=2025-12-07T14:30:16Z&se=2029-10-07T22:45:00Z&sv=2024-11-04&sig=WViAUr86LkEJ0Vk%2FKvdh6RhJNHoTW0DRhFCHZRybjvM%3D&tn=posts',
  comments: process.env.REACT_APP_AZURE_SAS_URL_COMMENTS || 'https://clathonstorage.table.core.windows.net/comments?sp=raud&st=2025-12-07T14:28:11Z&se=2028-10-18T01:43:00Z&sv=2024-11-04&sig=IVvic6vtJ9RompjpJc7cOOmKNzowJ6s4ZR5hHqFsrco%3D&tn=comments'
  // 🧱 파트너 프로그램: users 테이블의 JSON 필드 사용 (별도 테이블 불필요)
};

// 환경변수 설정 여부 확인 (개발 중 디버깅용)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const hasEnvVars = process.env.REACT_APP_AZURE_SAS_URL_USERS;
  if (!hasEnvVars) {
    devWarn('⚠️ Azure SAS URL 환경변수가 설정되지 않았습니다. 기본값(하드코딩)을 사용합니다.');
    devWarn('💡 보안을 위해 .env.local 파일에 환경변수를 설정하세요.');
  }
}


const isConnectionConfigured = true; // SAS URL이 있으므로 항상 true

if (!isConnectionConfigured) {
  devError('⚠️ Azure Storage Connection String이 설정되지 않았습니다!');
  devLog('🔧 .env 파일에 REACT_APP_AZURE_STORAGE_CONNECTION_STRING을 설정해주세요.');
  devLog('📋 Azure Portal에서 Connection String을 복사하여 설정하세요.');
}


// Azure SAS URL 기반 초기화 함수
const initializeAzureClients = () => {
  devLog('✅ Azure Table Storage 연결 완료');
};


// 설정이 되어있다면 즉시 초기화, 아니면 나중에 초기화
if (isConnectionConfigured) {
  initializeAzureClients();
  // 앱 시작 시 테이블 자동 생성
  setTimeout(() => {
    AzureTableService.initializeTables().then(() => {
      devLog('🚀 Azure Table Storage 완전 초기화 완료!');
    }).catch(error => {
      devError('⚠️ 테이블 초기화 중 오류:', error);
    });
  }, 1000);
}

// 브라우저 호환 해시 함수 (Web Crypto API 사용)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'clathon_salt_2024'); // 간단한 솔트 추가
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// 비밀번호 검증 함수
const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const hashToVerify = await hashPassword(password);
  return hashToVerify === hashedPassword;
};

// 타입 정의
// 수강 정보 타입 정의
export interface EnrolledCourse {
  courseId: string;
  title: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'paused' | 'expired';
  progress: number; // 0-100
  lastAccessedAt: string;
  accessExpiresAt: string;
  completedAt?: string;
  paymentId?: string;
  learningTimeMinutes?: number;
  // Day별 완료 상황 추적 (AI Agent 10일 과정용)
  completedDays?: number[]; // 완료한 Day 번호 배열 (예: [1, 2, 3])
  dayProgress?: { [key: number]: { completedAt: string; learningTimeMinutes?: number } }; // Day별 상세 정보
}

// 리워드 관련 인터페이스
export interface RewardTransaction {
  id: string;
  fromUserId: string; // 구매한 사용자 또는 'system'
  toUserId: string; // 리워드 받는 사용자 (추천인) 또는 'system'
  amount: number; // 리워드 금액 (포인트 사용 시 음수)
  sourceAmount: number; // 원본 구매 금액
  sourceType: 'course_purchase' | 'package_purchase' | 'subscription' | 'signup_reward' | 'course_completion' | 'point_usage';
  sourceId: string; // 구매한 강의/패키지 ID 또는 주문 ID
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  note?: string;
}

export interface ReferralStats {
  totalReferrals: number; // 총 추천한 사용자 수
  activePurchasers: number; // 실제 구매한 추천 사용자 수
  totalRewardEarned: number; // 총 획득 리워드
  thisMonthRewards: number; // 이번 달 리워드
  topReferralMonth: string; // 최고 실적 월
}

// 🧱 파트너 프로그램 인터페이스
export interface Partner {
  partitionKey: string; // 'partner'
  rowKey: string; // 사용자 이메일
  email: string;
  name: string;
  referralCode: string; // 고유 추천 코드
  totalBricks: number; // 총 적립 브릭
  availableBricks: number; // 출금 가능 브릭
  pendingBricks: number; // 정산 대기 브릭
  withdrawnBricks: number; // 출금 완료 브릭
  totalReferrals: number; // 총 추천 수
  partnerTier: 'bronze' | 'silver' | 'gold' | 'platinum'; // 파트너 등급
  commissionRate: number; // 커미션 비율 (10, 12, 15%)
  createdAt: string;
  updatedAt: string;
}

export interface PartnerReferral {
  partitionKey: string; // 파트너 이메일
  rowKey: string; // 고유 ID (타임스탬프_랜덤)
  referralDate: string;
  buyerEmail: string; // 구매자 이메일 (마스킹)
  courseId: string;
  courseName: string;
  coursePrice: number;
  earnedBricks: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmedAt?: string;
}

export interface PartnerWithdrawal {
  partitionKey: string; // 파트너 이메일
  rowKey: string; // 고유 ID (타임스탬프_랜덤)
  requestDate: string;
  amount: number;
  bankName: string;
  accountNumber: string; // 마스킹됨
  accountHolder: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  processedAt?: string;
  rejectedReason?: string;
}

export interface User {
  partitionKey: string;
  rowKey: string;
  email: string;
  name: string;
  phone?: string; // 핸드폰 번호 추가
  countryCode?: string; // 국가 코드 추가 (예: +82, +1, +86)
  passwordHash: string;
  emailVerified: boolean;
  marketingAgreed: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string; // optional 제거, 빈 문자열로 초기화
  // 수강 정보 컬럼 추가
  enrolledCourses?: string; // JSON 문자열로 저장 (Azure Table Storage 제약)
  totalEnrolledCourses?: number;
  completedCourses?: number;
  totalLearningTimeMinutes?: number;
  // 리워드 시스템 필드 추가
  referralCode?: string; // 본인의 추천 코드 (6자리 고유 코드)
  referredBy?: string; // 추천받은 사람의 추천 코드
  totalRewards?: number; // 누적 리워드 금액 (KRW)
  pendingRewards?: number; // 대기 중인 리워드 (정산 전)
  rewardHistory?: string; // 리워드 내역 JSON 문자열
  referralCount?: number; // 추천한 사용자 수
  referralStats?: string; // 추천 통계 JSON 문자열
  // 🧱 브릭 파트너 프로그램 필드
  totalBricks?: number; // 총 적립 브릭 (1브릭 = 1원)
  availableBricks?: number; // 출금 가능 브릭
  pendingBricks?: number; // 정산 대기 브릭
  withdrawnBricks?: number; // 출금 완료 브릭
  partnerTier?: 'bronze' | 'silver' | 'gold' | 'platinum'; // 파트너 등급
  commissionRate?: number; // 커미션 비율 (기본 10%)
  referralHistory?: string; // 추천 내역 JSON 문자열
  withdrawalHistory?: string; // 출금 내역 JSON 문자열
  // 비밀번호 재설정 필드 추가
  passwordResetToken?: string; // 재설정 토큰 (6자리 숫자)
  passwordResetTokenExpiry?: string; // 토큰 만료 시간
  // AI City Map 필드 추가
  cityMapData?: string; // AI City Map 건물주 정보 JSON 문자열
  // AI 추천 사용 횟수 필드 추가
  aiRecommendationUsageCount?: number; // AI 채널 추천 사용 횟수 (무료 3회)
  // 라이브 관련 필드 (시스템 사용자용)
  liveArchives?: string; // 라이브 아카이브 JSON 문자열
  liveConfigs?: string; // 라이브 설정 JSON 문자열
}

// 기존 분리된 테이블 인터페이스들은 Users 테이블에 통합되어 더 이상 사용하지 않음
// 모든 데이터는 User 인터페이스의 JSON 필드들에 저장됨

// 리워드 시스템 유틸리티 함수들
export class RewardUtils {
  // 고유한 추천 코드 생성 (6자리 영숫자)
  static generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 추천 코드 유효성 검사
  static isValidReferralCode(code: string): boolean {
    return /^[A-Z0-9]{6}$/.test(code);
  }

  // 리워드 금액 계산 (10%)
  static calculateReward(purchaseAmount: number, percentage: number = 10): number {
    return Math.floor(purchaseAmount * (percentage / 100));
  }

  // 리워드 내역 파싱
  static parseRewardHistory(historyJson: string): RewardTransaction[] {
    try {
      return JSON.parse(historyJson || '[]');
    } catch {
      return [];
    }
  }

  // 리워드 내역 문자열화
  static stringifyRewardHistory(history: RewardTransaction[]): string {
    return JSON.stringify(history);
  }

  // 추천 통계 파싱
  static parseReferralStats(statsJson: string): ReferralStats {
    try {
      return JSON.parse(statsJson || '{}');
    } catch {
      return {
        totalReferrals: 0,
        activePurchasers: 0,
        totalRewardEarned: 0,
        thisMonthRewards: 0,
        topReferralMonth: ''
      };
    }
  }

  // 추천 통계 문자열화
  static stringifyReferralStats(stats: ReferralStats): string {
    return JSON.stringify(stats);
  }
}

// Azure Table Storage 서비스 클래스
export class AzureTableService {

  // Connection String 확인
  static checkConnection(): boolean {
    if (!isConnectionConfigured) {
      alert('❌ Azure 연결이 설정되지 않았습니다!\n\n.env 파일을 생성하고 REACT_APP_AZURE_STORAGE_CONNECTION_STRING을 설정해주세요.');
      return false;
    }
    return true;
  }

  // 재시도 로직을 포함한 HTTP 요청 함수
  private static async retryRequest(
    url: string,
    options: RequestInit,
    maxRetries: number = 5, // 3번 → 5번으로 증가
    delay: number = 1000
  ): Promise<Response> {
    // let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // ⏱️ 타임아웃 설정 (15초)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // 성공하거나 재시도할 필요 없는 오류인 경우 바로 반환
        if (response.ok || response.status < 500) {
          if (attempt > 1) {
            devLog(`✅ ${attempt}번째 시도에서 성공!`);
          }
          return response;
        }

        // 서버 오류 (5xx)인 경우 재시도
        throw new Error(`Server error: ${response.status}`);

      } catch (error: any) {
        // lastError = error as Error;
        devWarn(`🔄 요청 실패 (시도 ${attempt}/${maxRetries}):`, error?.message || error);

        // 타임아웃 에러인 경우 명확히 표시
        if (error?.name === 'AbortError') {
          devWarn('⏱️ 요청 타임아웃 (15초 초과)');
        }

        // 마지막 시도가 아니면 대기 후 재시도
        if (attempt < maxRetries) {
          const waitTime = delay * attempt;
          devLog(`⏳ ${waitTime}ms 후 재시도...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    // 모든 재시도 실패 시 마지막 오류 throw
    throw new Error(`⚠️ 네트워크 연결에 문제가 있습니다.\n${maxRetries}번 시도 후 실패했습니다.\n\n인터넷 연결을 확인하고 다시 시도해주세요.`);
  }

  // Azure Table Storage MERGE 전용 함수 - PUT 방식으로 변경 (더 안정적)
  private static async azureRequestWithMerge(
    tableName: keyof typeof AZURE_SAS_URLS,
    body: any,
    entityId: string
  ): Promise<any> {
    const baseUrl = AZURE_SAS_URLS[tableName];
    const [partitionKey, rowKey] = entityId.split('|');
    const url = `${baseUrl.split('?')[0]}(PartitionKey='${encodeURIComponent(partitionKey)}',RowKey='${encodeURIComponent(rowKey)}')${baseUrl.includes('?') ? '&' + baseUrl.split('?')[1] : ''}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json;odata=nometadata',
      'Content-Type': 'application/json'
    };

    // ETag가 있으면 사용하고, 없으면 * 사용
    const etag = (body as any)['odata.etag'] || (body as any)['odata.etag'];
    if (etag) {
      headers['If-Match'] = etag;
      devLog('🔧 ETag 사용:', etag);
    } else {
      headers['If-Match'] = '*';
      devLog('🔧 ETag 없음, * 사용');
    }

    const azureEntity = this.convertToAzureEntity(body);

    const options: RequestInit = {
      method: 'PUT',  // MERGE 대신 PUT 사용 (전체 엔티티 교체)
      headers,
      body: JSON.stringify(azureEntity),
      mode: 'cors',
    };

    devLog('🔧 Azure PUT 요청 (엔티티 업데이트):', url);
    devLog('🔧 요청 헤더:', headers);

    try {
      const response = await this.retryRequest(url, options);

      if (response.ok) {
        const text = await response.text();
        devLog('✅ Azure PUT 요청 성공');
        return text ? JSON.parse(text) : { success: true };
      } else {
        const errorText = await response.text();
        devError(`Azure PUT 오류:`, response.status, errorText);
        throw new Error(`Azure PUT 실패: ${response.status} - ${errorText}`);
      }
    } catch (error: any) {
      devError(`Azure PUT 요청 실패:`, error.message);
      throw error;
    }
  }

  // Azure REST API 공통 함수
  private static async azureRequest(
    tableName: keyof typeof AZURE_SAS_URLS,
    method: string = 'GET',
    body?: any,
    entityId?: string
  ): Promise<any> {
    const baseUrl = AZURE_SAS_URLS[tableName];

    // 🔧 디버깅: 업데이트용 SAS URL 확인  
    if (method !== 'GET') {
      devLog(`🔗 ${method} 요청용 SAS URL:`, baseUrl.substring(0, 100) + '...');
    }

    let url = baseUrl;

    // 특정 엔티티 조회/수정/삭제시 URL 구성
    if (entityId && method !== 'POST') {
      const [partitionKey, rowKey] = entityId.split('|');
      url = `${baseUrl.split('?')[0]}(PartitionKey='${encodeURIComponent(partitionKey)}',RowKey='${encodeURIComponent(rowKey)}')${baseUrl.includes('?') ? '?' + baseUrl.split('?')[1] : ''}`;
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json;odata=nometadata',
    };

    // CORS 문제 해결을 위해 Content-Type을 조건부로 설정
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'MERGE')) {
      headers['Content-Type'] = 'application/json';
    }

    // PUT/DELETE/MERGE 작업시만 If-Match 헤더 추가 (POST에는 사용하지 않음)
    if (method === 'PUT' || method === 'MERGE') {
      headers['If-Match'] = '*';
    } else if (method === 'DELETE') {
      headers['If-Match'] = '*';
    }

    const options: RequestInit = {
      method,
      headers,
      mode: 'cors',
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'MERGE')) {
      // Azure Table Storage용 엔티티 변환
      const azureEntity = this.convertToAzureEntity(body);
      options.body = JSON.stringify(azureEntity);
      devLog(`🔧 Azure ${method} 요청 엔티티:`, azureEntity);
    }

    // 🔗 디버깅: 최종 요청 URL 출력  
    devLog(`🔗 Final Azure Request URL: ${url}`);

    try {
      const response = await fetch(url, options);

      if (response.ok) {
        // DELETE는 본문이 없을 수 있음
        if (method === 'DELETE') {
          return { success: true };
        }

        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
      } else {
        const errorText = await response.text();
        devError(`Azure ${method} 오류 (${tableName}):`, response.status, errorText);
        throw new Error(`Azure ${method} 실패: ${response.status} - ${errorText}`);
      }
    } catch (error: any) {
      devError(`Azure ${method} 요청 실패 (${tableName}):`, error.message);
      throw error;
    }
  }

  // Azure Table Storage 엔티티 형식으로 변환
  private static convertToAzureEntity(entity: any): any {
    const azureEntity: any = {};

    // Azure Table Storage는 정확한 키 이름을 요구합니다
    for (const [key, value] of Object.entries(entity)) {
      // 🔧 odata 메타데이터 제외 (Azure 검색 결과에서 오는 불필요한 메타데이터)
      if (key.startsWith('odata.')) {
        continue;
      }

      let azureKey = key;
      let azureValue = value;

      // PartitionKey와 RowKey는 대문자로 변환
      if (key === 'partitionKey') {
        azureKey = 'PartitionKey';
      } else if (key === 'rowKey') {
        azureKey = 'RowKey';
      }

      // 값 타입 처리
      if (value === null || value === undefined) {
        azureValue = '';  // null/undefined는 빈 문자열로 변환
      } else if (typeof value === 'string') {
        azureValue = value;
      } else if (typeof value === 'number') {
        azureValue = value;
      } else if (typeof value === 'boolean') {
        azureValue = value;
      } else if (value instanceof Date) {
        azureValue = value.toISOString();
      } else {
        // 객체나 배열은 JSON 문자열로 변환
        azureValue = JSON.stringify(value);
      }

      azureEntity[azureKey] = azureValue;
    }

    // PartitionKey와 RowKey가 반드시 있어야 하고 문자열이어야 함
    if (!azureEntity.PartitionKey) {
      throw new Error('PartitionKey is required for Azure Table Storage');
    }
    if (!azureEntity.RowKey) {
      throw new Error('RowKey is required for Azure Table Storage');
    }

    // PartitionKey와 RowKey가 문자열인지 확인
    azureEntity.PartitionKey = String(azureEntity.PartitionKey);
    azureEntity.RowKey = String(azureEntity.RowKey);

    devLog('🔧 Azure 엔티티 변환 결과:', azureEntity);
    return azureEntity;
  }

  // Azure SAS URL을 사용한 테스트 함수 (단일 Users 테이블)
  // 🔒 보안: 프로덕션에서는 전체 데이터 조회 차단
  static async testAzureConnection(): Promise<boolean> {
    // 프로덕션 환경에서는 테스트 차단 (전체 데이터 노출 방지)
    const isProduction = window.location.hostname === 'www.aicitybuilders.com' || 
                         window.location.hostname === 'aicitybuilders.com';
    
    if (isProduction) {
      devLog('🔒 보안: 프로덕션 환경에서는 연결 테스트가 차단됩니다.');
      return true; // 프로덕션에서는 그냥 성공으로 처리
    }
    
    try {
      devLog('🧪 Azure Table Storage 단일 Users 테이블 SAS URL 테스트 시작...');

      const headers = {
        'Accept': 'application/json;odata=fullmetadata',
        'Content-Type': 'application/json',
      };

      // Users 테이블 연결 테스트
      const sasUrl = AZURE_SAS_URLS.users;
      devLog(`🔗 Users 테이블 테스트 중...`);

      const response = await fetch(sasUrl, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
      });

      if (response.ok) {
        await response.json(); // 데이터 읽기만 하고 사용하지 않음
        devLog(`✅ Users 테이블 연결 성공! (상태: ${response.status})`);
        devLog('🎉 Azure Table Storage 연결 성공!');
        devLog('🚀 쓰기 권한(sp=raud) 포함으로 완전한 CRUD 작업 준비 완료!');
        devLog('🎯 모든 데이터를 Users 테이블에 통합 저장 가능!');
        return true;
      } else {
        devLog(`❌ Users 테이블 연결 실패 (상태: ${response.status})`);
        return false;
      }

    } catch (error: any) {
      devError('❌ Azure Users 테이블 연결 테스트 실패:', error.message);

      if (error.message.includes('CORS')) {
        devLog('🔧 CORS 오류: Azure Portal에서 CORS 설정을 확인하세요.');
      }

      return false;
    }
  }

  // 테이블 초기화 (REST API 방식)
  static async initializeTables() {
    if (!this.checkConnection()) return;

    // Azure REST API 연결 테스트
    const isConnected = await this.testAzureConnection();

    if (isConnected) {
      devLog('🚀 Azure Table Storage REST API 연결 완료!');
      devLog('📋 이제 실제 Azure에 데이터를 저장할 수 있습니다!');

      // 필요한 테이블들 준비 완료 로그
      const tablesToCreate = ['users', 'mentoringssessions', 'studentpackages'];
      tablesToCreate.forEach(tableName => {
        devLog(`📋 Table '${tableName}' 준비 완료`);
      });
    } else {
      devError('❌ Azure Table Storage 연결 실패! CORS 설정을 확인하세요.');
      devError('💡 해결 방법: Azure Portal에서 Storage Account CORS 설정에 현재 도메인을 추가하세요.');
    }
  }

  // 사용자 관련 메서드 (Azure 우선, LocalStorage fallback)

  // 모든 사용자 가져오기 (관리자용) - 페이지네이션 지원 추가
  // 🔒 보안: 로컬 환경에서만 사용 가능 (KISA 개인정보 보호 조치)
  static async getAllUsers(): Promise<User[]> {
    // 프로덕션 환경에서는 차단!
    const isProduction = window.location.hostname === 'www.aicitybuilders.com' || 
                         window.location.hostname === 'aicitybuilders.com';
    
    if (isProduction) {
      devWarn('🔒 보안: 프로덕션 환경에서는 전체 사용자 조회가 차단됩니다.');
      devWarn('📍 관리자 작업은 로컬 환경(localhost)에서 진행해주세요.');
      return []; // 빈 배열 반환 - 네트워크에 데이터 노출 안 됨!
    }
    
    try {
      devLog('🔍 Azure Users 테이블에서 모든 사용자 조회 중... (로컬 환경)');

      let allUsers: User[] = [];
      let continuationNextPartitionKey: string | null = null;
      let continuationNextRowKey: string | null = null;

      do {
        const baseUrl = AZURE_SAS_URLS.users;
        let url = baseUrl;

        // 페이지네이션 토큰이 있으면 URL에 추가
        if (continuationNextPartitionKey && continuationNextRowKey) {
          url += `&NextPartitionKey=${encodeURIComponent(continuationNextPartitionKey)}&NextRowKey=${encodeURIComponent(continuationNextRowKey)}`;
        }

        const response = await this.retryRequest(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'x-ms-version': '2019-02-02'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();
        const users = data.value || [];
        allUsers = [...allUsers, ...users];

        // 다음 페이지 토큰 확인
        continuationNextPartitionKey = response.headers.get('x-ms-continuation-NextPartitionKey');
        continuationNextRowKey = response.headers.get('x-ms-continuation-NextRowKey');

        if (continuationNextPartitionKey) {
          devLog(`📦 추가 데이터 로드 중... (현재 ${allUsers.length}명)`);
        }

      } while (continuationNextPartitionKey && continuationNextRowKey);

      devLog(`✅ 총 ${allUsers.length}명의 사용자 조회 완료`);
      return allUsers;
    } catch (error: any) {
      devError('❌ 모든 사용자 조회 실패:', error.message);
      return [];
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      // 🚀 Azure에서 사용자 검색 시도!
      devLog('🔍 Azure Users 테이블에서 사용자 검색 중...', email);

      // 🔧 디버깅: 사용 중인 SAS URL 확인
      devLog(`🔗 조회용 SAS URL:`, AZURE_SAS_URLS.users.substring(0, 100) + '...');

      // Azure Table Storage에서 쿼리 (이메일로 필터링)
      const baseUrl = AZURE_SAS_URLS.users;
      const filterQuery = `$filter=email eq '${encodeURIComponent(email)}'`;
      const url = `${baseUrl}&${filterQuery}`;

      const response = await this.retryRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=fullmetadata',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.value && data.value.length > 0) {
          devLog('✅ Azure에서 사용자 찾음:', email);
          const azureUser = data.value[0];

          // Azure 응답의 키 필드를 소문자로 매핑
          const user: User = {
            ...azureUser,
            partitionKey: azureUser.PartitionKey || azureUser.partitionKey,
            rowKey: azureUser.RowKey || azureUser.rowKey
          };

          return user;
        } else {
          devLog('🔍 Azure에서 사용자를 찾을 수 없음:', email);
          return null;
        }
      } else {
        throw new Error(`Azure 검색 실패: ${response.status}`);
      }
    } catch (error: any) {
      devError('❌ Azure 사용자 검색 실패:', error.message);

      // CORS 오류인 경우 더 명확한 메시지
      if (error.message.includes('CORS') || error.message.includes('<!DOCTYPE')) {
        throw new Error('🌐 서버 연결 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.');
      }

      throw new Error('⚠️ 사용자 정보를 불러올 수 없습니다.\n네트워크 연결을 확인하고 다시 시도해주세요.');
    }
  }

  static async validateUser(email: string, password: string): Promise<User | null> {
    if (!this.checkConnection()) {
      return null;
    }

    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) return null;

    // ✅ 로그인 성공 - 업데이트 없이 바로 반환 (성능 최적화)
    devLog('🎉 사용자 로그인 성공:', user.email);
    devLog('⚡ Azure 업데이트 생략으로 빠른 로그인 완료');

    // 현재 시간을 클라이언트에서만 설정 (실제 DB 업데이트 없음)
    const loginTime = new Date().toISOString();
    const userWithLoginTime = {
      ...user,
      lastLoginAt: loginTime,
      updatedAt: loginTime
    };

    // LocalStorage에만 로그인 시간 기록 (선택적)
    try {
      const users = JSON.parse(localStorage.getItem('clathon_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.email === email);
      if (userIndex !== -1) {
        users[userIndex].lastLoginAt = loginTime;
        localStorage.setItem('clathon_users', JSON.stringify(users));
        devLog('💾 LocalStorage에만 로그인 시간 기록');
      } else {
        users.push(userWithLoginTime);
        localStorage.setItem('clathon_users', JSON.stringify(users));
        devLog('💾 LocalStorage에 사용자 정보 추가');
      }
    } catch (localError) {
      devWarn('⚠️ LocalStorage 저장 실패 (로그인은 성공):', localError);
    }

    return userWithLoginTime;
  }

  // === 강좌 관련 메서드 (Users 테이블에 통합) ===
  // 강좌 정보는 이제 courseData.ts 파일의 정적 데이터를 사용
  // 동적 강좌 생성이 필요한 경우 Users 테이블에 강좌 정보를 JSON으로 저장 가능

  // === 결제 관련 메서드 (Users 테이블에 통합) ===
  // 결제 정보는 이제 Users 테이블의 enrolledCourses JSON 필드에 payments 배열로 저장

  // === 수강신청 관련 메서드 (Users 테이블에 통합) ===
  // 수강신청 정보는 이제 Users 테이블의 enrolledCourses JSON 필드에 enrollments 배열로 저장

  // === 세션 관리 (간소화) ===
  // 세션은 로컬스토리지에서 간단히 관리하거나 JWT 토큰 방식으로 대체 가능
  // 복잡한 세션 관리가 필요한 경우 Users 테이블에 세션 정보를 JSON으로 저장

  // === 통합 비즈니스 로직 메서드 (Users 테이블 중심) ===

  // === 새로운 Users 테이블 중심 통합 메서드들 ===

  // 회원가입용 사용자 생성 (간단한 데이터를 받아서 완전한 User 객체로 변환)
  static async createUser(userData: {
    email: string;
    name: string;
    phone?: string; // 핸드폰 번호 추가
    countryCode?: string; // 국가 코드 추가
    password: string;
    marketingAgreed: boolean;
    referredBy?: string; // 추천인 코드
  }): Promise<User> {
    if (!this.checkConnection()) {
      throw new Error('저장소 연결이 설정되지 않았습니다.');
    }

    const passwordHash = await hashPassword(userData.password);

    // 고유한 추천 코드 생성 (중복 체크)
    let referralCode = RewardUtils.generateReferralCode();
    let isCodeUnique = false;
    let attempts = 0;

    while (!isCodeUnique && attempts < 10) {
      try {
        const existingUser = await this.getUserByReferralCode(referralCode);
        if (!existingUser) {
          isCodeUnique = true;
        } else {
          referralCode = RewardUtils.generateReferralCode();
          attempts++;
        }
      } catch {
        // 사용자가 없다면 코드 사용 가능
        isCodeUnique = true;
      }
    }

    const user: User = {
      partitionKey: 'users',
      rowKey: userData.email, // UUID 대신 이메일 사용
      email: userData.email,
      name: userData.name,
      phone: userData.phone || '', // 핸드폰 번호 추가
      countryCode: userData.countryCode || '+82', // 국가 코드 (기본값: 한국)
      passwordHash,
      emailVerified: false,
      marketingAgreed: userData.marketingAgreed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: '',
      enrolledCourses: '',
      totalEnrolledCourses: 0,
      completedCourses: 0,
      totalLearningTimeMinutes: 0,
      // 리워드 시스템 초기화
      referralCode: referralCode,
      referredBy: userData.referredBy || '',
      totalRewards: 0,
      pendingRewards: 0,
      rewardHistory: '[]',
      referralCount: 0,
      referralStats: RewardUtils.stringifyReferralStats({
        totalReferrals: 0,
        activePurchasers: 0,
        totalRewardEarned: 0,
        thisMonthRewards: 0,
        topReferralMonth: ''
      })
    };

    try {
      devLog('👤 새 사용자 생성 중...', user.email);
      await this.azureRequest('users', 'POST', user);
      devLog('✅ 사용자 생성 성공:', user.email);

      // 추천인이 있다면 추천인의 추천 카운트 업데이트
      if (userData.referredBy) {
        await this.incrementReferralCount(userData.referredBy);
        devLog('🎁 추천인 카운트 업데이트:', userData.referredBy);
      }

      return user;
    } catch (error: any) {
      devError('❌ 사용자 생성 실패:', error.message);
      throw error;
    }
  }

  // 완전한 User 객체를 받아서 생성하는 함수
  static async createUserDirect(userData: User): Promise<User> {
    try {
      devLog('👤 사용자 직접 생성 중...', userData.email);
      await this.azureRequest('users', 'POST', userData);
      devLog('✅ 사용자 직접 생성 성공:', userData.email);
      return userData;
    } catch (error: any) {
      devError('❌ 사용자 직접 생성 실패:', error.message);
      throw error;
    }
  }

  // 사용자 ID로 사용자 조회
  static async getUserById(userId: string): Promise<User | null> {
    try {
      devLog('🔍 사용자 ID로 조회 중...', userId);

      // Azure REST API를 통한 단일 엔티티 조회 
      const response = await this.azureRequest('users', 'GET', null, `users|${userId}`);

      if (response) {
        devLog('✅ 사용자 조회 성공:', response.email);
        return response;
      } else {
        devLog('❌ 사용자 조회 실패: 데이터 없음');
        return null;
      }
    } catch (error: any) {
      devError('❌ 사용자 조회 오류:', error.message);
      return null;
    }
  }

  // 사용자 수강 정보 조회 (Users 테이블에서) - 이메일 기반
  static async getUserEnrollmentsByEmail(email: string): Promise<EnrolledCourse[]> {
    try {
      devLog('🔍 수강 정보 조회:', email);

      let user = await this.getUserByEmail(email);
      devLog('👤 조회된 사용자 정보:', user ? { email: user.email, rowKey: user.rowKey, hasEnrolledCourses: !!user.enrolledCourses } : 'null');

      if (!user) {
        devLog('❌ 사용자 없음:', email);
        return [];
      }

      if (!user || !user.enrolledCourses) {
        devLog('📚 수강 중인 강의가 없습니다. enrolledCourses 필드:', user.enrolledCourses);
        return [];
      }

      devLog('📝 enrolledCourses 원본 데이터:', user.enrolledCourses);

      // JSON 문자열 파싱 (통합 데이터 구조 지원)
      const userData = JSON.parse(user.enrolledCourses);
      devLog('📊 파싱된 userData:', userData);

      let enrolledCourses: EnrolledCourse[] = [];

      if (Array.isArray(userData)) {
        // 기존 단순 배열 형태
        devLog('📋 기존 배열 형태 데이터 감지');
        enrolledCourses = userData;
      } else if (userData.enrollments) {
        // 새로운 통합 구조 (enrollments + payments)
        devLog('📋 새로운 통합 구조 데이터 감지');
        enrolledCourses = userData.enrollments;
      } else {
        devLog('⚠️ 알 수 없는 데이터 구조:', userData);
      }

      devLog('✅ 수강 정보 조회 성공:', enrolledCourses.length, '개 강의');
      devLog('📚 수강 강의 목록:', enrolledCourses);
      devLog('📊 결제 정보도 함께 저장됨:', userData.payments?.length || 0, '개 결제');

      return enrolledCourses;
    } catch (error: any) {
      devError('❌ 수강 정보 조회 실패:', error.message);
      devError('❌ 오류 상세:', error);
      return [];
    }
  }

  // 특정 강좌 수강 상태 확인 (이메일 + 강좌 ID 기반)
  static async isUserEnrolledInCourse(email: string, courseId: string): Promise<boolean> {
    try {
      devLog('🔍 강좌 수강 상태 확인:', email, '→', courseId);

      const enrolledCourses = await this.getUserEnrollmentsByEmail(email);
      const isEnrolled = enrolledCourses.some(course =>
        course.courseId === courseId && course.status === 'active'
      );

      devLog(isEnrolled ? '✅ 이미 수강 중' : '❌ 미수강', ':', courseId);
      return isEnrolled;
    } catch (error: any) {
      devError('❌ 수강 상태 확인 실패:', error.message);
      return false;
    }
  }

  // 사용자에게 강의 구매+수강신청 추가 (Users 테이블에 모든 정보 저장) - 이메일 기반
  static async addPurchaseAndEnrollmentToUser(userData: {
    email: string;  // userId → email로 변경
    courseId: string;
    title: string;
    amount: number;
    paymentMethod: string;
    externalPaymentId?: string;
    orderId?: string;
    orderName?: string;
    paymentKey?: string;  // 🔴 환불용 토스 paymentKey
  }): Promise<{ payment: any, enrollment: EnrolledCourse }> {
    try {
      devLog('🛒 구매 처리 중:', userData.email);

      // 결제 정보 생성
      const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const payment = {
        paymentId,
        courseId: userData.courseId,
        courseName: userData.title, // 강의명 추가
        courseTitle: userData.title, // 강의명 추가 (호환성)
        amount: userData.amount,
        paymentMethod: userData.paymentMethod,
        externalPaymentId: userData.externalPaymentId || 'local_payment',
        orderId: userData.orderId || paymentId, // 주문번호 추가
        orderName: userData.orderName || userData.title, // 주문명 추가
        paymentKey: userData.paymentKey || null, // 🔴 환불용 토스 paymentKey 추가
        status: 'completed',
        purchasedAt: new Date().toISOString(), // 구매일 추가
        timestamp: new Date().toISOString(), // 타임스탬프 추가
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      // 새 수강 정보 생성
      const newEnrollment: EnrolledCourse = {
        courseId: userData.courseId,
        title: userData.title,
        enrolledAt: new Date().toISOString(),
        status: 'active',
        progress: 0, // 초기 진도 0%
        lastAccessedAt: new Date().toISOString(),
        accessExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90일 후 만료
        paymentId: paymentId,
        learningTimeMinutes: 0 // 초기 학습시간 0분
      };

      // 기존 사용자 정보 조회 - 이메일로 조회
      let user = await this.getUserByEmail(userData.email);
      devLog('🔍 getUserByEmail 결과:', user);

      // 🚨 사용자가 존재하지만 실제 엔티티가 없는 경우 체크
      if (user && user.rowKey) {
        devLog('🔍 실제 엔티티 존재 확인 시작. RowKey:', user.rowKey);
        devLog('🔍 확인할 PartitionKey:', user.partitionKey || 'users');

        try {
          // 실제로 해당 RowKey로 엔티티가 존재하는지 직접 확인
          const actualUser = await this.azureRequest('users', 'GET', null, `users|${user.rowKey}`);
          devLog('✅ 실제 사용자 엔티티 확인됨:', user.rowKey);
          devLog('✅ 확인된 사용자 데이터:', {
            rowKey: actualUser.rowKey,
            email: actualUser.email,
            partitionKey: actualUser.partitionKey
          });
        } catch (checkError: any) {
          devError('❌ GET 요청 실패 상세 정보:');
          devError('❌ RowKey:', user.rowKey);
          devError('❌ 요청 URL 패턴:', `users|${user.rowKey}`);
          devError('❌ 오류 메시지:', checkError.message);
          devError('❌ 오류 전체:', checkError);

          devWarn('⚠️ getUserByEmail이 반환한 사용자가 실제로는 존재하지 않음:', user.rowKey);
          devWarn('⚠️ 이는 Azure 테이블 데이터 불일치 또는 권한 문제일 수 있습니다');
          user = null; // 존재하지 않는 사용자로 처리
        }
      }

      if (!user) {
        // ❌❌❌ 절대 새로운 사용자 생성하지 않음! ❌❌❌
        // ❌❌❌ 기존 사용자만 업데이트! 새 사용자 생성 금지! ❌❌❌
        devError('❌ 사용자를 찾을 수 없습니다:', userData.email);
        throw new Error(`사용자를 찾을 수 없습니다: ${userData.email}. 기존 사용자만 업데이트 가능합니다.`);
      }

      // 🔧 UUID RowKey 사용자는 그대로 유지하고 업데이트만 수행
      if (user.rowKey !== userData.email) {
        devLog('📝 UUID RowKey 사용자 발견. 기존 RowKey 유지하여 업데이트:', user.rowKey, 'for email:', userData.email);
        // 마이그레이션하지 않고 기존 UUID RowKey로 업데이트 진행
      }

      // 기존 수강 정보 파싱
      let enrolledCourses: EnrolledCourse[] = [];
      let payments: any[] = [];

      if (user && user.enrolledCourses) {
        try {
          const userData = JSON.parse(user.enrolledCourses);
          if (Array.isArray(userData)) {
            enrolledCourses = userData;
          } else if (userData.enrollments && userData.payments) {
            enrolledCourses = userData.enrollments;
            payments = userData.payments;
          }
        } catch (e) {
          devLog('⚠️ 기존 수강 정보 파싱 실패, 새로 시작');
        }
      }

      // 중복 체크 및 추가
      const existingIndex = enrolledCourses.findIndex(course => course.courseId === userData.courseId);
      if (existingIndex >= 0) {
        devLog('⚠️ 이미 수강중인 강의입니다. 정보를 업데이트합니다.');
        enrolledCourses[existingIndex] = { ...enrolledCourses[existingIndex], ...newEnrollment };
      } else {
        enrolledCourses.push(newEnrollment);
      }

      // 결제 정보 추가
      payments.push(payment);

      // 통계 업데이트
      const completedCount = enrolledCourses.filter(c => c.status === 'completed').length;
      const totalTime = enrolledCourses.reduce((sum, c) => sum + (c.learningTimeMinutes || 0), 0);

      // 모든 정보를 하나의 JSON으로 저장
      const allUserData = {
        enrollments: enrolledCourses,
        payments: payments
      };

      // user가 null이면 기본값으로 생성
      if (!user) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      // 사용자 정보 업데이트 - 기존 RowKey 유지
      const updatedUser = {
        ...user,
        enrolledCourses: JSON.stringify(allUserData),
        totalEnrolledCourses: enrolledCourses.length,
        completedCourses: completedCount,
        totalLearningTimeMinutes: totalTime,
        updatedAt: new Date().toISOString()
      };

      // Azure에 업데이트 - 기존 user.rowKey 사용 (UUID든 이메일이든 상관없이)
      try {
        await this.azureRequest('users', 'MERGE', updatedUser, `users|${user.rowKey}`);
        devLog('✅ 구매 완료 (MERGE with RowKey:', user.rowKey, ')');
      } catch (mergeError: any) {
        await this.azureRequest('users', 'PUT', updatedUser, `users|${user.rowKey}`);
        devLog('✅ 구매 완료 (PUT with RowKey:', user.rowKey, ')');
      }

      return { payment, enrollment: newEnrollment };
    } catch (error: any) {
      devError('❌ 구매+수강신청 추가 실패:', error.message);
      throw error;
    }
  }

  // 새로운 통합 구매 프로세스 (Users 테이블만 사용) - 이메일 기반
  static async purchaseAndEnrollCourseUnified(purchaseData: {
    email: string;  // userId → email로 변경
    courseId: string;
    amount: number;
    paymentMethod: string;
    externalPaymentId?: string;
  }): Promise<{ payment: any, enrollment: any }> {
    try {
      devLog('🛒 통합 강좌 구매 프로세스 시작 (Users 테이블만 사용)...', purchaseData.courseId);

      // 강의 제목 매핑
      const courseTitleMap: Record<string, string> = {
        'chatgpt의-정석': 'ChatGPT의 정석',
        'ai-비즈니스-전략': 'AI 비즈니스 전략',
        'ai-코딩-완전정복': 'AI 코딩 완전정복',
        'google-ai-완전정복': 'Google AI 완전정복',
        'ai-교육-다큐멘터리': 'AI 교육 다큐멘터리',
        'ai-building': 'AI 건물 짓기 - 디지털 건축가 과정',
        'ai-building-course': 'AI 건물 짓기 - 디지털 건축가 과정',
        '1002': 'Google Opal 유튜브 수익화 에이전트 기초',
        'chatgpt-agent-beginner': 'Google Opal 유튜브 수익화 에이전트 기초',
        '999': 'AI 건물 짓기 - 디지털 건축가 과정'
      };

      const courseTitle = courseTitleMap[purchaseData.courseId] || purchaseData.courseId;

      // Users 테이블에 모든 정보 저장
      devLog('📊 addPurchaseAndEnrollmentToUser 호출:', {
        ...purchaseData,
        title: courseTitle
      });

      const result = await this.addPurchaseAndEnrollmentToUser({
        ...purchaseData,
        title: courseTitle
      });

      devLog('✅ 통합 강좌 구매 프로세스 완료!', purchaseData.courseId, '최종 결과:', result);

      return result;
    } catch (error: any) {
      devError('❌ 통합 강좌 구매 프로세스 실패:', error.message);
      throw new Error(`강좌 구매 실패: ${error.message}`);
    }
  }

  // === 세션 관리 메서드 (간소화된 버전) ===
  static async createSession(userId: string): Promise<string> {
    try {
      devLog('🔐 세션 생성 중...', userId);

      // 간단한 세션 ID 생성 (실제로는 JWT 토큰이나 더 복잡한 세션 관리 시스템 사용 권장)
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 로컬스토리지에 세션 정보 저장 (Azure에 저장할 수도 있지만 간소화를 위해 로컬 저장)
      const sessionData = {
        sessionId,
        userId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24시간 후 만료
      };

      localStorage.setItem(`clathon_session_${sessionId}`, JSON.stringify(sessionData));
      devLog('✅ 세션 생성 완료:', sessionId);

      return sessionId;
    } catch (error: any) {
      devError('❌ 세션 생성 실패:', error.message);
      throw new Error(`세션 생성 실패: ${error.message}`);
    }
  }

  // === 결제 정보 생성 메서드 (Users 테이블 통합 방식) === - 이메일 기반
  static async createPayment(paymentData: {
    email: string;  // userId → email로 변경
    courseId: string;
    amount: number;
    paymentMethod: string;
    externalPaymentId?: string;
  }): Promise<any> {
    try {
      devLog('💳 결제 정보 생성 중...', paymentData);

      // 통합 구매+수강신청 프로세스 호출
      const result = await this.purchaseAndEnrollCourseUnified(paymentData);

      devLog('✅ 결제 정보 생성 완료:', paymentData.courseId, '결과:', result);
      return result.payment;
    } catch (error: any) {
      devError('❌ 결제 정보 생성 실패:', error.message);
      devError('❌ 결제 오류 상세:', error);
      throw new Error(`결제 정보 생성 실패: ${error.message}`);
    }
  }

  // === 멘토링 세션 관리 메서드들 ===

  // 멘토링 세션 생성
  static async createMentoringSession(sessionData: {
    studentEmail: string;
    mentorId: string;
    scheduledTime: string;
    packageType: string;
    sessionNumber?: number;
  }): Promise<any> {
    try {
      devLog('📅 멘토링 세션 생성 중...', sessionData);

      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const meetingLink = `https://meet.google.com/${Math.random().toString(36).substr(2, 12)}`;

      const session = {
        PartitionKey: sessionData.studentEmail,
        RowKey: sessionId,
        sessionId,
        studentEmail: sessionData.studentEmail,
        mentorId: sessionData.mentorId,
        scheduledTime: sessionData.scheduledTime,
        packageType: sessionData.packageType,
        sessionNumber: sessionData.sessionNumber || 1,
        status: 'scheduled',
        meetingLink,
        createdAt: new Date().toISOString(),
        '@odata.type': 'Microsoft.Tables.EntityV2'
      };

      // Azure Table Storage에 저장 시도
      try {
        const response = await fetch(AZURE_SAS_URLS.sessions, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json;odata=nometadata'
          },
          body: JSON.stringify(session)
        });

        if (response.ok) {
          devLog('✅ Azure에 멘토링 세션 저장 완료:', sessionId);
          return session;
        }
      } catch (azureError) {
        devLog('⚠️ Azure 저장 실패, 로컬 저장으로 전환:', azureError);
      }

      // Fallback: localStorage에 저장
      const sessionsKey = `clathon_mentoring_sessions_${sessionData.studentEmail}`;
      const existingSessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
      existingSessions.push(session);
      localStorage.setItem(sessionsKey, JSON.stringify(existingSessions));

      devLog('✅ 로컬에 멘토링 세션 저장 완료:', sessionId);
      return session;

    } catch (error: any) {
      devError('❌ 멘토링 세션 생성 실패:', error.message);
      throw new Error(`멘토링 세션 생성 실패: ${error.message}`);
    }
  }

  // 사용자의 멘토링 세션 목록 조회
  static async getUserMentoringSessions(studentEmail: string): Promise<any[]> {
    try {
      devLog('📋 멘토링 세션 목록 조회:', studentEmail);

      // Azure에서 조회 시도
      try {
        const filterQuery = `PartitionKey eq '${studentEmail}'`;
        const queryUrl = `${AZURE_SAS_URLS.sessions}&$filter=${encodeURIComponent(filterQuery)}`;

        const response = await fetch(queryUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json;odata=nometadata'
          }
        });

        if (response.ok) {
          const data = await response.json();
          devLog('✅ Azure에서 멘토링 세션 조회 완료:', data.value?.length || 0, '개');
          return data.value || [];
        }
      } catch (azureError) {
        devLog('⚠️ Azure 조회 실패, 로컬 조회로 전환:', azureError);
      }

      // Fallback: localStorage에서 조회
      const sessionsKey = `clathon_mentoring_sessions_${studentEmail}`;
      const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
      devLog('📋 로컬에서 멘토링 세션 조회 완료:', sessions.length, '개');
      return sessions;

    } catch (error: any) {
      devError('❌ 멘토링 세션 조회 실패:', error.message);
      return [];
    }
  }

  // 세션 완료 후 학습 기록 저장
  static async saveSessionRecord(recordData: {
    sessionId: string;
    studentEmail: string;
    topicsCovered: string;
    mentorFeedback: string;
    nextSessionPlan?: string;
    homework?: string;
    progressRating: number;
  }): Promise<any> {
    try {
      devLog('📝 세션 기록 저장 중...', recordData);

      const recordId = `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const record = {
        PartitionKey: recordData.studentEmail,
        RowKey: recordId,
        recordId,
        sessionId: recordData.sessionId,
        studentEmail: recordData.studentEmail,
        topicsCovered: recordData.topicsCovered,
        mentorFeedback: recordData.mentorFeedback,
        nextSessionPlan: recordData.nextSessionPlan || '',
        homework: recordData.homework || '',
        progressRating: recordData.progressRating,
        completedAt: new Date().toISOString(),
        '@odata.type': 'Microsoft.Tables.EntityV2'
      };

      // 일단 로컬에 저장 (추후 별도 테이블로 확장 가능)
      const recordsKey = `clathon_session_records_${recordData.studentEmail}`;
      const existingRecords = JSON.parse(localStorage.getItem(recordsKey) || '[]');
      existingRecords.push(record);
      localStorage.setItem(recordsKey, JSON.stringify(existingRecords));

      devLog('✅ 세션 기록 저장 완료:', recordId);
      return record;

    } catch (error: any) {
      devError('❌ 세션 기록 저장 실패:', error.message);
      throw new Error(`세션 기록 저장 실패: ${error.message}`);
    }
  }

  // 학생 패키지 정보 저장
  static async createStudentPackage(packageData: {
    studentEmail: string;
    packageType: string;
    totalSessions: number;
    paymentAmount: number;
  }): Promise<any> {
    try {
      devLog('📦 학생 패키지 생성 중...', packageData);

      const packageId = `package_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const package_ = {
        PartitionKey: packageData.studentEmail,
        RowKey: packageId,
        packageId,
        studentEmail: packageData.studentEmail,
        packageType: packageData.packageType,
        totalSessions: packageData.totalSessions,
        usedSessions: 0,
        remainingSessions: packageData.totalSessions,
        paymentAmount: packageData.paymentAmount,
        paymentStatus: 'completed',
        purchaseDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90일 후 만료
        '@odata.type': 'Microsoft.Tables.EntityV2'
      };

      // Azure 저장 시도
      try {
        const response = await fetch(AZURE_SAS_URLS.packages, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json;odata=nometadata'
          },
          body: JSON.stringify(package_)
        });

        if (response.ok) {
          devLog('✅ Azure에 패키지 정보 저장 완료:', packageId);
          return package_;
        }
      } catch (azureError) {
        devLog('⚠️ Azure 저장 실패, 로컬 저장으로 전환:', azureError);
      }

      // Fallback: localStorage
      const packagesKey = `clathon_student_packages_${packageData.studentEmail}`;
      const existingPackages = JSON.parse(localStorage.getItem(packagesKey) || '[]');
      existingPackages.push(package_);
      localStorage.setItem(packagesKey, JSON.stringify(existingPackages));

      devLog('✅ 로컬에 패키지 정보 저장 완료:', packageId);
      return package_;

    } catch (error: any) {
      devError('❌패키지 생성 실패:', error.message);
      throw new Error(`패키지 생성 실패: ${error.message}`);
    }
  }
  // === 리워드 시스템 관련 메서드들 ===

  // 추천 코드로 사용자 조회
  // 🔒 보안: 프로덕션에서는 필터 쿼리 사용 (전체 조회 차단)
  static async getUserByReferralCode(referralCode: string): Promise<User | null> {
    try {
      // 프로덕션 환경에서는 필터 쿼리로 조회 (전체 데이터 노출 방지)
      const isProduction = window.location.hostname === 'www.aicitybuilders.com' || 
                           window.location.hostname === 'aicitybuilders.com';
      
      if (isProduction) {
        // 필터 쿼리로 해당 추천 코드만 조회
        const baseUrl = AZURE_SAS_URLS.users;
        const filterQuery = `$filter=referralCode eq '${encodeURIComponent(referralCode)}'`;
        const url = `${baseUrl}&${filterQuery}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) return null;
        const data = await response.json();
        const userList = data.value || [];
        return userList.length > 0 ? userList[0] : null;
      }
      
      // 로컬에서는 기존 방식 (전체 조회 후 필터)
      const users = await this.azureRequest('users', 'GET');
      const userList = users.value || [];

      const user = userList.find((u: any) => u.referralCode === referralCode);
      return user || null;
    } catch (error: any) {
      devError('❌ 추천 코드로 사용자 조회 실패:', error.message);
      return null;
    }
  }

  // 추천 카운트 증가
  static async incrementReferralCount(referralCode: string): Promise<void> {
    try {
      const referrer = await this.getUserByReferralCode(referralCode);
      if (!referrer) {
        devWarn('⚠️ 추천인을 찾을 수 없습니다:', referralCode);
        return;
      }

      const currentCount = referrer.referralCount || 0;
      const updatedUser = {
        ...referrer,
        referralCount: currentCount + 1,
        updatedAt: new Date().toISOString()
      };

      await this.azureRequest('users', 'PUT', updatedUser, referrer.rowKey);
      devLog('✅ 추천 카운트 업데이트 성공:', referralCode, currentCount + 1);
    } catch (error: any) {
      devError('❌ 추천 카운트 업데이트 실패:', error.message);
    }
  }

  // 리워드 지급 처리
  static async processReward(transaction: {
    fromUserId: string;
    toReferralCode: string;
    amount: number;
    sourceAmount: number;
    sourceType: 'course_purchase' | 'package_purchase' | 'subscription';
    sourceId: string;
  }): Promise<boolean> {
    try {
      const referrer = await this.getUserByReferralCode(transaction.toReferralCode);
      if (!referrer) {
        devWarn('⚠️ 추천인을 찾을 수 없습니다:', transaction.toReferralCode);
        return false;
      }

      // 리워드 트랜잭션 생성
      const rewardTransaction: RewardTransaction = {
        id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromUserId: transaction.fromUserId,
        toUserId: referrer.rowKey,
        amount: transaction.amount,
        sourceAmount: transaction.sourceAmount,
        sourceType: transaction.sourceType,
        sourceId: transaction.sourceId,
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        note: `${transaction.sourceType} 추천 리워드`
      };

      // 기존 리워드 내역 가져오기
      const currentHistory = RewardUtils.parseRewardHistory(referrer.rewardHistory || '[]');
      currentHistory.push(rewardTransaction);

      // 리워드 통계 업데이트
      const currentStats = RewardUtils.parseReferralStats(referrer.referralStats || '{}');
      currentStats.totalRewardEarned += transaction.amount;
      currentStats.thisMonthRewards += transaction.amount;
      currentStats.activePurchasers += 1;

      // 사용자 정보 업데이트
      const updatedUser = {
        ...referrer,
        totalRewards: (referrer.totalRewards || 0) + transaction.amount,
        rewardHistory: RewardUtils.stringifyRewardHistory(currentHistory),
        referralStats: RewardUtils.stringifyReferralStats(currentStats),
        updatedAt: new Date().toISOString()
      };

      await this.azureRequest('users', 'PUT', updatedUser, referrer.rowKey);
      devLog('✅ 리워드 지급 완료:', transaction.toReferralCode, transaction.amount);
      return true;
    } catch (error: any) {
      devError('❌ 리워드 지급 실패:', error.message);
      return false;
    }
  }

  // 가입 시 양쪽 모두에게 5,000원 리워드 지급
  static async processSignupReward(newUserEmail: string, referralCode: string): Promise<boolean> {
    try {
      const SIGNUP_REWARD_AMOUNT = 5000;

      // 추천인 조회
      const referrer = await this.getUserByReferralCode(referralCode);
      if (!referrer) {
        devWarn('⚠️ 추천인을 찾을 수 없습니다:', referralCode);
        return false;
      }

      // 신규 가입자 조회
      const newUser = await this.getUserByEmail(newUserEmail);
      if (!newUser) {
        devWarn('⚠️ 신규 가입자를 찾을 수 없습니다:', newUserEmail);
        return false;
      }

      // 1. 추천인에게 리워드 지급
      const referrerRewardTransaction: RewardTransaction = {
        id: `signup_reward_referrer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromUserId: newUser.rowKey,
        toUserId: referrer.rowKey,
        amount: SIGNUP_REWARD_AMOUNT,
        sourceAmount: 0,
        sourceType: 'signup_reward',
        sourceId: 'signup_referral',
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        note: '가입 추천 리워드 (추천인)'
      };

      // 2. 신규 가입자에게 리워드 지급
      const newUserRewardTransaction: RewardTransaction = {
        id: `signup_reward_newuser_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromUserId: referrer.rowKey,
        toUserId: newUser.rowKey,
        amount: SIGNUP_REWARD_AMOUNT,
        sourceAmount: 0,
        sourceType: 'signup_reward',
        sourceId: 'signup_bonus',
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        note: '가입 환영 리워드 (신규 회원)'
      };

      // 추천인 리워드 내역 및 통계 업데이트
      const referrerHistory = RewardUtils.parseRewardHistory(referrer.rewardHistory || '[]');
      referrerHistory.push(referrerRewardTransaction);

      const referrerStats = RewardUtils.parseReferralStats(referrer.referralStats || '{}');
      referrerStats.totalRewardEarned += SIGNUP_REWARD_AMOUNT;
      referrerStats.thisMonthRewards += SIGNUP_REWARD_AMOUNT;
      referrerStats.totalReferrals += 1;

      // 신규 가입자 리워드 내역 업데이트
      const newUserHistory = RewardUtils.parseRewardHistory(newUser.rewardHistory || '[]');
      newUserHistory.push(newUserRewardTransaction);

      // 추천인 정보 업데이트
      const updatedReferrer = {
        ...referrer,
        totalRewards: (referrer.totalRewards || 0) + SIGNUP_REWARD_AMOUNT,
        rewardHistory: RewardUtils.stringifyRewardHistory(referrerHistory),
        referralStats: RewardUtils.stringifyReferralStats(referrerStats),
        updatedAt: new Date().toISOString()
      };

      // 신규 가입자 정보 업데이트
      const updatedNewUser = {
        ...newUser,
        totalRewards: (newUser.totalRewards || 0) + SIGNUP_REWARD_AMOUNT,
        rewardHistory: RewardUtils.stringifyRewardHistory(newUserHistory),
        updatedAt: new Date().toISOString()
      };

      // 두 사용자 모두 업데이트
      await Promise.all([
        this.azureRequest('users', 'PUT', updatedReferrer, referrer.rowKey),
        this.azureRequest('users', 'PUT', updatedNewUser, newUser.rowKey)
      ]);

      devLog('✅ 가입 리워드 지급 완료:', {
        referrer: referralCode,
        newUser: newUserEmail,
        amount: SIGNUP_REWARD_AMOUNT
      });

      return true;
    } catch (error: any) {
      devError('❌ 가입 리워드 지급 실패:', error.message);
      return false;
    }
  }

  // 구매 시 리워드 처리 (기존 addPurchaseAndEnrollmentToUser 메서드 확장)
  static async addPurchaseWithReward(userData: {
    email: string;
    courseId: string;
    title: string;
    amount: number;
    paymentMethod: string;
    externalPaymentId?: string;
    orderId?: string;
    orderName?: string;
    paymentKey?: string;  // 🔴 환불용 토스 paymentKey
  }): Promise<{ payment: any, enrollment: any, rewardProcessed: boolean }> {
    try {
      // 기존 구매 처리
      const result = await this.addPurchaseAndEnrollmentToUser(userData);

      // 구매한 사용자 정보 조회
      const buyer = await this.getUserByEmail(userData.email);
      if (!buyer || !buyer.referredBy) {
        devLog('ℹ️ 추천인이 없어 리워드 처리를 건너뜁니다.');
        return { ...result, rewardProcessed: false };
      }

      // 리워드 계산 및 지급
      const rewardAmount = RewardUtils.calculateReward(userData.amount);
      const rewardProcessed = await this.processReward({
        fromUserId: buyer.rowKey,
        toReferralCode: buyer.referredBy,
        amount: rewardAmount,
        sourceAmount: userData.amount,
        sourceType: 'course_purchase',
        sourceId: userData.courseId
      });

      return { ...result, rewardProcessed };
    } catch (error: any) {
      devError('❌ 리워드 포함 구매 처리 실패:', error.message);
      throw error;
    }
  }

  // 🗑️ 사용자의 수강 강의 삭제 (관리자용)
  static async removeEnrollmentFromUser(email: string, courseId: string): Promise<boolean> {
    try {
      devLog(`🗑️ 강의 삭제 시작: ${email} → ${courseId}`);

      // 사용자 정보 조회
      const user = await this.getUserByEmail(email);
      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      // enrolledCourses 파싱
      let enrolledData = user.enrolledCourses ? JSON.parse(user.enrolledCourses) : { enrollments: [], payments: [] };
      
      // 배열 형태인 경우 객체로 변환
      if (Array.isArray(enrolledData)) {
        enrolledData = { enrollments: enrolledData, payments: [] };
      }

      const enrollments = enrolledData.enrollments || [];
      const payments = enrolledData.payments || [];

      // 해당 강의 찾기
      const enrollmentIndex = enrollments.findIndex((e: any) => 
        e.courseId === courseId || 
        (e.courseId === '999' && courseId === 'ai-building-course') ||
        (e.courseId === 'ai-building-course' && courseId === '999') ||
        (e.courseId === '1002' && courseId === 'chatgpt-agent-beginner') ||
        (e.courseId === 'chatgpt-agent-beginner' && courseId === '1002')
      );

      if (enrollmentIndex === -1) {
        devLog('⚠️ 해당 강의가 등록되어 있지 않습니다.');
        return false;
      }

      // 강의 삭제
      const removedEnrollment = enrollments.splice(enrollmentIndex, 1)[0];
      devLog('🗑️ 삭제된 강의:', removedEnrollment);

      // 관련 결제 정보도 삭제 (선택적)
      const paymentIndex = payments.findIndex((p: any) => 
        p.courseId === courseId || 
        p.courseId === removedEnrollment?.courseId
      );
      if (paymentIndex !== -1) {
        const removedPayment = payments.splice(paymentIndex, 1)[0];
        devLog('🗑️ 삭제된 결제 정보:', removedPayment);
      }

      // 업데이트된 데이터 저장
      const updatedEnrolledCourses = JSON.stringify({
        enrollments,
        payments
      });

      // Azure에 업데이트 (updateUserField 사용)
      await this.updateUserField(email, 'enrolledCourses', updatedEnrolledCourses);
      await this.updateUserField(email, 'totalEnrolledCourses', enrollments.length);
      devLog(`✅ 강의 삭제 완료: ${email} → ${courseId}`);

      return true;
    } catch (error: any) {
      devError('❌ 강의 삭제 실패:', error.message);
      throw new Error(`강의 삭제 실패: ${error.message}`);
    }
  }

  // 기존 사용자에게 추천 코드 생성 및 업데이트
  static async generateReferralCodeForUser(email: string): Promise<string> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) throw new Error('사용자를 찾을 수 없습니다.');

      if (user.referralCode) {
        return user.referralCode; // 이미 있으면 기존 코드 반환
      }

      // 고유한 추천 코드 생성
      let referralCode = RewardUtils.generateReferralCode();
      let isCodeUnique = false;
      let attempts = 0;

      while (!isCodeUnique && attempts < 10) {
        try {
          const existingUser = await this.getUserByReferralCode(referralCode);
          if (!existingUser) {
            isCodeUnique = true;
          } else {
            referralCode = RewardUtils.generateReferralCode();
            attempts++;
          }
        } catch (error) {
          isCodeUnique = true; // 에러가 발생하면 코드가 없다고 판단
        }
      }

      if (!isCodeUnique) {
        throw new Error('고유한 추천 코드 생성에 실패했습니다.');
      }

      // 사용자 데이터 업데이트
      const updatedUser = {
        ...user,
        referralCode,
        totalRewards: user.totalRewards || 0,
        pendingRewards: user.pendingRewards || 0,
        rewardHistory: user.rewardHistory || '[]',
        referralCount: user.referralCount || 0,
        referralStats: user.referralStats || '{}'
      };

      // Azure Table에 업데이트 (PUT 요청) - 올바른 RowKey 사용
      await this.azureRequest('users', 'PUT', updatedUser, `users|${user.rowKey}`);
      devLog('✅ 추천 코드 생성 완료:', referralCode);
      return referralCode;

    } catch (error: any) {
      devError('❌ 추천 코드 생성 실패:', error.message);
      throw error;
    }
  }

  // 사용자의 리워드 현황 조회
  static async getUserRewardStatus(email: string): Promise<{
    referralCode: string;
    totalRewards: number;
    pendingRewards: number;
    referralCount: number;
    rewardHistory: RewardTransaction[];
    stats: ReferralStats;
  } | null> {
    try {
      let user = await this.getUserByEmail(email);
      if (!user) return null;

      // 추천 코드가 없으면 생성
      if (!user.referralCode) {
        devLog('🔄 추천 코드가 없어서 생성 중...');
        await this.generateReferralCodeForUser(email);
        user = await this.getUserByEmail(email); // 업데이트된 사용자 정보 다시 가져오기
        if (!user) {
          throw new Error('사용자 정보 업데이트 후 조회 실패');
        }
      }

      return {
        referralCode: user.referralCode || '',
        totalRewards: user.totalRewards || 0,
        pendingRewards: user.pendingRewards || 0,
        referralCount: user.referralCount || 0,
        rewardHistory: RewardUtils.parseRewardHistory(user.rewardHistory || '[]'),
        stats: RewardUtils.parseReferralStats(user.referralStats || '{}')
      };
    } catch (error: any) {
      devError('❌ 리워드 현황 조회 실패:', error.message);
      return null;
    }
  }

  // === 강의 결제 상태 확인 메서드 ===

  // 사용자의 구매한 강의 목록 가져오기
  static async getUserPurchasedCourses(email: string): Promise<any[]> {
    try {
      devLog('🛒 구매 강의 목록 조회:', email);

      const user = await this.getUserByEmail(email);
      if (!user || !user.enrolledCourses) {
        devLog('❌ 구매 정보가 없음:', email);
        return [];
      }

      // 수강 정보 파싱
      const userData = JSON.parse(user.enrolledCourses);
      let payments: any[] = [];
      let enrollments: any[] = [];

      if (userData.payments && Array.isArray(userData.payments)) {
        payments = userData.payments;
      }

      if (userData.enrollments && Array.isArray(userData.enrollments)) {
        enrollments = userData.enrollments;
      }

      // payments와 enrollments를 매칭하여 강의명 추가
      const enrichedPayments = payments.map(payment => {
        // 같은 courseId를 가진 enrollment 찾기
        const enrollment = enrollments.find(e => e.courseId === payment.courseId);

        return {
          ...payment,
          courseName: enrollment?.title || payment.courseName,
          courseTitle: enrollment?.title || payment.courseTitle,
          enrolledAt: enrollment?.enrolledAt
        };
      });

      devLog('🛒 구매 강의 목록 (enriched):', enrichedPayments);
      return enrichedPayments;
    } catch (error: any) {
      devError('❌ 구매 강의 목록 조회 실패:', error.message);
      return [];
    }
  }

  // 특정 강의의 결제 상태 확인
  static async checkCoursePayment(email: string, courseId: string): Promise<{ isPaid: boolean, paymentInfo?: any }> {
    try {
      devLog('💳 강의 결제 상태 확인:', email, '→', courseId);

      const user = await this.getUserByEmail(email);
      if (!user) {
        devLog('❌ 사용자를 찾을 수 없음:', email);
        return { isPaid: false };
      }

      if (!user.enrolledCourses) {
        devLog('❌ 수강 정보가 없음:', email);
        return { isPaid: false };
      }

      // 수강 정보 파싱
      const userData = JSON.parse(user.enrolledCourses);
      let enrolledCourses: EnrolledCourse[] = [];
      let payments: any[] = [];

      if (Array.isArray(userData)) {
        enrolledCourses = userData;
      } else if (userData.enrollments && userData.payments) {
        enrolledCourses = userData.enrollments;
        payments = userData.payments;
      }

      // courseId 매칭 (호환성)
      const courseIdMap: { [key: string]: string[] } = {
        'chatgpt-agent-beginner': ['chatgpt-agent-beginner', '1002'],
        '1002': ['chatgpt-agent-beginner', '1002'],
        'ai-building-course': ['ai-building-course', '999', 'step1-ai-building'],
        '999': ['ai-building-course', '999', 'step1-ai-building'],
        'step1-ai-building': ['ai-building-course', '999', 'step1-ai-building'],
        'vibe-coding': ['vibe-coding', '1003'],
        '1003': ['vibe-coding', '1003']
      };

      const matchIds = courseIdMap[courseId] || [courseId];
      devLog('🔍 결제 확인 - 매칭 시도할 ID:', matchIds);

      // 해당 강의의 수강 상태 확인 (여러 courseId 허용)
      const enrollment = enrolledCourses.find(course => matchIds.includes(course.courseId));
      const isEnrolled = enrollment && (enrollment.status === 'active' || enrollment.status === 'completed');

      // 해당 강의의 결제 정보 확인 (여러 courseId 허용)
      const paymentInfo = payments.find(payment => matchIds.includes(payment.courseId));

      const result = {
        isPaid: isEnrolled || false,
        paymentInfo: paymentInfo || null,
        enrollment: enrollment || null
      };

      devLog('💳 결제 상태 확인 결과:', result);
      return result;
    } catch (error: any) {
      devError('❌ 결제 상태 확인 실패:', error.message);
      return { isPaid: false };
    }
  }

  // === 비밀번호 재설정 관련 메서드들 ===

  // 비밀번호 재설정 토큰 생성 및 이메일 전송 요청
  static async requestPasswordReset(email: string): Promise<boolean> {
    try {
      devLog('🔐 비밀번호 재설정 요청:', email);

      // 사용자 존재 확인
      const user = await this.getUserByEmail(email);
      if (!user) {
        devLog('❌ 등록되지 않은 이메일:', email);
        return false;
      }

      // 재설정 토큰 생성 (6자리 숫자)
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
      const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30분 후 만료

      // 사용자 정보에 재설정 토큰 추가
      const updatedUser = {
        ...user,
        passwordResetToken: resetToken,
        passwordResetTokenExpiry: resetTokenExpiry,
        updatedAt: new Date().toISOString()
      };

      // Azure에 업데이트
      await this.azureRequest('users', 'PUT', updatedUser, `users|${user.rowKey}`);

      // 실제 이메일 전송 (여기서는 시뮬레이션)
      devLog('📧 비밀번호 재설정 이메일 전송 시뮬레이션');
      devLog('📧 수신자:', email);
      devLog('📧 재설정 코드:', resetToken);
      devLog('📧 만료 시간:', resetTokenExpiry);

      // 실제 프로덕션에서는 이메일 서비스 (SendGrid, AWS SES 등) 사용
      // await sendPasswordResetEmail(email, resetToken);

      devLog('✅ 비밀번호 재설정 요청 완료:', email);
      return true;
    } catch (error: any) {
      devError('❌ 비밀번호 재설정 요청 실패:', error.message);
      return false;
    }
  }


  // === Day별 진행 상황 관리 (AI Agent 10일 과정용) ===

  /**
   * Day 완료 처리
   * @param email 사용자 이메일
   * @param courseId 강의 ID (예: 'chatgpt-agent-beginner')
   * @param dayNumber 완료한 Day 번호 (1-10)
   * @param learningTimeMinutes 해당 Day 학습 시간 (분)
   */
  static async completeCourseDay(
    email: string,
    courseId: string,
    dayNumber: number,
    learningTimeMinutes: number = 0
  ): Promise<boolean> {
    try {
      devLog(`📚 Day ${dayNumber} 완료 처리 중:`, email, courseId);

      // 사용자 정보 조회
      const user = await this.getUserByEmail(email);
      if (!user) {
        devError('❌ 사용자를 찾을 수 없음:', email);
        return false;
      }

      devLog('✅ 사용자 정보 찾음:', user.email);

      // 수강 정보 파싱 (새로운 형식: {enrollments: [...], payments: [...]})
      let enrolledCourses: EnrolledCourse[] = [];

      if (user.enrolledCourses) {
        if (typeof user.enrolledCourses === 'string') {
          try {
            const parsed = JSON.parse(user.enrolledCourses);
            // 새 형식: {enrollments: [...], payments: [...]}
            if (parsed.enrollments && Array.isArray(parsed.enrollments)) {
              enrolledCourses = parsed.enrollments;
              devLog('✅ 새 형식 (enrollments) 파싱 성공');
            }
            // 기존 형식: [{...}, {...}]
            else if (Array.isArray(parsed)) {
              enrolledCourses = parsed;
              devLog('✅ 기존 형식 (배열) 파싱 성공');
            }
          } catch (e) {
            devError('❌ JSON 파싱 실패:', e);
          }
        } else if (Array.isArray(user.enrolledCourses)) {
          enrolledCourses = user.enrolledCourses;
          devLog('✅ 이미 배열 형태');
        } else if (typeof user.enrolledCourses === 'object') {
          const coursesObj = user.enrolledCourses as any;
          if (coursesObj.enrollments && Array.isArray(coursesObj.enrollments)) {
            enrolledCourses = coursesObj.enrollments;
            devLog('✅ 이미 객체 형태 (enrollments)');
          }
        }
      }

      devLog('📚 수강 중인 강의 수:', enrolledCourses.length);
      if (enrolledCourses.length > 0) {
        devLog('📚 수강 중인 강의 목록:', enrolledCourses.map(c => `${c.courseId} (${c.title})`));
      }

      // courseId 매칭 (1002 <-> chatgpt-agent-beginner, 999 <-> ai-building-course 호환)
      const courseIdMap: { [key: string]: string[] } = {
        'chatgpt-agent-beginner': ['chatgpt-agent-beginner', '1002'],
        '1002': ['chatgpt-agent-beginner', '1002'],
        'ai-building-course': ['ai-building-course', '999', 'step1-ai-building'],
        '999': ['ai-building-course', '999', 'step1-ai-building'],
        'step1-ai-building': ['ai-building-course', '999', 'step1-ai-building'],
        'vibe-coding': ['vibe-coding', '1003'],
        '1003': ['vibe-coding', '1003']
      };

      const matchIds = courseIdMap[courseId] || [courseId];
      devLog('🔍 매칭 시도할 ID:', matchIds);

      // 해당 강의 찾기
      const courseIndex = enrolledCourses.findIndex(c => matchIds.includes(c.courseId));
      if (courseIndex === -1) {
        devError('❌ 수강 중인 강의가 아님:', courseId);
        devError('💡 등록된 강의:', enrolledCourses.map(c => c.courseId).join(', '));
        return false;
      }

      devLog('✅ 강의 찾음:', enrolledCourses[courseIndex].courseId, '-', enrolledCourses[courseIndex].title);

      const course = enrolledCourses[courseIndex];

      // completedDays 초기화 (없으면 빈 배열)
      if (!course.completedDays) {
        course.completedDays = [];
      }

      // dayProgress 초기화 (없으면 빈 객체)
      if (!course.dayProgress) {
        course.dayProgress = {};
      }

      // 이미 완료된 Day인지 확인
      if (course.completedDays.includes(dayNumber)) {
        devLog(`ℹ️ Day ${dayNumber}은 이미 완료됨`);
        // 기존 학습 시간에 추가
        if (course.dayProgress[dayNumber]) {
          course.dayProgress[dayNumber].learningTimeMinutes =
            (course.dayProgress[dayNumber].learningTimeMinutes || 0) + learningTimeMinutes;
        }
      } else {
        // 새로 완료 처리
        course.completedDays.push(dayNumber);
        course.completedDays.sort((a, b) => a - b); // 정렬

        course.dayProgress[dayNumber] = {
          completedAt: new Date().toISOString(),
          learningTimeMinutes: learningTimeMinutes
        };
      }

      // 전체 진도율 업데이트 (10일 기준)
      const totalDays = 10;
      course.progress = Math.round((course.completedDays.length / totalDays) * 100);

      // 전체 학습 시간 업데이트
      const totalLearningTime = Object.values(course.dayProgress).reduce(
        (sum, day) => sum + (day.learningTimeMinutes || 0),
        0
      );
      course.learningTimeMinutes = totalLearningTime;

      // 10일 모두 완료 시 상태 변경
      if (course.completedDays.length === totalDays) {
        course.status = 'completed';
        course.completedAt = new Date().toISOString();
        devLog('🎉 강의 전체 완료!');
      }

      // lastAccessedAt 업데이트
      course.lastAccessedAt = new Date().toISOString();

      // 수강 정보 업데이트
      enrolledCourses[courseIndex] = course;

      // 기존 enrolledCourses 구조 유지 (enrollments + payments)
      let updatedEnrolledCoursesString: string;

      if (typeof user.enrolledCourses === 'string') {
        const parsed = JSON.parse(user.enrolledCourses);
        if (parsed.enrollments && parsed.payments) {
          // 새 형식: {enrollments: [...], payments: [...]} 유지
          parsed.enrollments = enrolledCourses;
          updatedEnrolledCoursesString = JSON.stringify(parsed);
          devLog('✅ 새 형식 유지 (enrollments + payments)');
        } else {
          // 기존 형식: [{...}] 그대로
          updatedEnrolledCoursesString = JSON.stringify(enrolledCourses);
          devLog('✅ 기존 형식 유지 (배열)');
        }
      } else {
        updatedEnrolledCoursesString = JSON.stringify(enrolledCourses);
      }

      // 사용자 정보 업데이트
      const updatedUser = {
        ...user,
        enrolledCourses: updatedEnrolledCoursesString,
        totalLearningTimeMinutes: (user.totalLearningTimeMinutes || 0) + learningTimeMinutes,
        completedCourses: enrolledCourses.filter(c => c.status === 'completed').length,
        updatedAt: new Date().toISOString()
      };

      // Azure에 업데이트
      await this.azureRequest('users', 'PUT', updatedUser, `users|${user.rowKey}`);

      devLog(`✅ Day ${dayNumber} 완료 처리 완료:`, {
        completedDays: course.completedDays,
        progress: course.progress,
        status: course.status
      });

      return true;
    } catch (error: any) {
      devError(`❌ Day ${dayNumber} 완료 처리 실패:`, error.message);
      return false;
    }
  }

  /**
   * 강의 Day별 진행 상황 조회
   * @param email 사용자 이메일
   * @param courseId 강의 ID
   */
  static async getCourseDayProgress(email: string, courseId: string): Promise<{
    completedDays: number[];
    dayProgress: { [key: number]: { completedAt: string; learningTimeMinutes?: number } };
    progress: number;
    totalLearningTime: number;
  } | null> {
    try {
      devLog('📊 강의 진행 상황 조회:', email, courseId);

      const user = await this.getUserByEmail(email);
      if (!user) {
        devLog('❌ 사용자를 찾을 수 없음:', email);
        return null;
      }

      // 수강 정보 파싱 (새로운 형식: {enrollments: [...], payments: [...]})
      let enrolledCourses: EnrolledCourse[] = [];

      if (user.enrolledCourses) {
        if (typeof user.enrolledCourses === 'string') {
          const parsed = JSON.parse(user.enrolledCourses);
          if (parsed.enrollments && Array.isArray(parsed.enrollments)) {
            enrolledCourses = parsed.enrollments;
          } else if (Array.isArray(parsed)) {
            enrolledCourses = parsed;
          }
        } else if (Array.isArray(user.enrolledCourses)) {
          enrolledCourses = user.enrolledCourses;
        } else if (typeof user.enrolledCourses === 'object') {
          const coursesObj = user.enrolledCourses as any;
          if (coursesObj.enrollments && Array.isArray(coursesObj.enrollments)) {
            enrolledCourses = coursesObj.enrollments;
          }
        }
      }

      // courseId 매칭 (1002 <-> chatgpt-agent-beginner, 999 <-> ai-building-course 호환)
      const courseIdMap: { [key: string]: string[] } = {
        'chatgpt-agent-beginner': ['chatgpt-agent-beginner', '1002'],
        '1002': ['chatgpt-agent-beginner', '1002'],
        'ai-building-course': ['ai-building-course', '999', 'step1-ai-building'],
        '999': ['ai-building-course', '999', 'step1-ai-building'],
        'step1-ai-building': ['ai-building-course', '999', 'step1-ai-building'],
        'vibe-coding': ['vibe-coding', '1003'],
        '1003': ['vibe-coding', '1003']
      };

      const matchIds = courseIdMap[courseId] || [courseId];
      const course = enrolledCourses.find(c => matchIds.includes(c.courseId));

      if (!course) {
        devLog('❌ 수강 중인 강의가 아님:', courseId);
        return null;
      }

      return {
        completedDays: course.completedDays || [],
        dayProgress: course.dayProgress || {},
        progress: course.progress || 0,
        totalLearningTime: course.learningTimeMinutes || 0
      };
    } catch (error: any) {
      devError('❌ 강의 진행 상황 조회 실패:', error.message);
      return null;
    }
  }

  /**
   * 관리자가 사용자 비밀번호 변경
   * @param email 사용자 이메일
   * @param newPassword 새 비밀번호
   */
  static async adminChangePassword(email: string, newPassword: string): Promise<boolean> {
    try {
      devLog('🔐 관리자 비밀번호 변경 시작:', email);

      const user = await this.getUserByEmail(email);
      if (!user) {
        devLog('❌ 사용자를 찾을 수 없음:', email);
        return false;
      }

      // 새 비밀번호 해시화
      const newPasswordHash = await hashPassword(newPassword);

      // 사용자 업데이트
      const updatedUser = {
        ...user,
        passwordHash: newPasswordHash,
        updatedAt: new Date().toISOString()
      };

      // Azure에 업데이트
      await this.azureRequest('users', 'PUT', updatedUser, `users|${user.rowKey}`);

      devLog('✅ 비밀번호 변경 완료:', email);
      return true;
    } catch (error: any) {
      devError('❌ 비밀번호 변경 실패:', error.message);
      return false;
    }
  }

  /**
   * 비밀번호 재설정 코드 생성 및 저장
   * @param email 사용자 이메일
   */
  static async generatePasswordResetCode(email: string): Promise<string | null> {
    try {
      devLog('🔐 비밀번호 재설정 코드 생성:', email);

      // 사용자 존재 확인
      const user = await this.getUserByEmail(email);
      if (!user) {
        devLog('❌ 사용자를 찾을 수 없음:', email);
        return null;
      }

      // 6자리 랜덤 코드 생성
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10분 후 만료

      // localStorage에 임시 저장 (프론트엔드에서만 사용)
      const resetData = {
        email,
        code,
        expiresAt,
        used: false,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem(`password_reset_${email}`, JSON.stringify(resetData));

      devLog('✅ 재설정 코드 생성 완료:', code);
      return code;
    } catch (error: any) {
      devError('❌ 재설정 코드 생성 실패:', error.message);
      return null;
    }
  }

  /**
   * 비밀번호 재설정 코드 검증
   * @param email 사용자 이메일
   * @param code 입력한 코드
   */
  static async verifyPasswordResetCode(email: string, code: string): Promise<boolean> {
    try {
      devLog('🔍 재설정 코드 검증:', email, code);

      const savedDataString = localStorage.getItem(`password_reset_${email}`);
      if (!savedDataString) {
        devLog('❌ 저장된 코드 없음');
        return false;
      }

      const savedData = JSON.parse(savedDataString);

      // 만료 확인
      if (Date.now() > savedData.expiresAt) {
        devLog('❌ 코드 만료됨');
        localStorage.removeItem(`password_reset_${email}`);
        return false;
      }

      // 이미 사용됨
      if (savedData.used) {
        devLog('❌ 이미 사용된 코드');
        return false;
      }

      // 코드 일치 확인
      if (savedData.code !== code) {
        devLog('❌ 코드 불일치');
        return false;
      }

      devLog('✅ 코드 검증 성공');
      return true;
    } catch (error: any) {
      devError('❌ 코드 검증 실패:', error.message);
      return false;
    }
  }

  /**
   * 비밀번호 재설정 (코드 검증 후)
   * @param email 사용자 이메일
   * @param code 인증 코드
   * @param newPassword 새 비밀번호
   */
  static async resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
    try {
      devLog('🔐 비밀번호 재설정 시작:', email);

      // 코드 검증
      const isValid = await this.verifyPasswordResetCode(email, code);
      if (!isValid) {
        devLog('❌ 코드 검증 실패');
        return false;
      }

      // 비밀번호 변경
      const success = await this.adminChangePassword(email, newPassword);
      if (!success) {
        return false;
      }

      // 사용된 코드로 표시
      const savedDataString = localStorage.getItem(`password_reset_${email}`);
      if (savedDataString) {
        const savedData = JSON.parse(savedDataString);
        savedData.used = true;
        localStorage.setItem(`password_reset_${email}`, JSON.stringify(savedData));
      }

      devLog('✅ 비밀번호 재설정 완료');
      return true;
    } catch (error: any) {
      devError('❌ 비밀번호 재설정 실패:', error.message);
      return false;
    }
  }

  /**
   * 비밀번호 재설정 코드 삭제
   * @param email 사용자 이메일
   */
  static async clearPasswordResetCode(email: string): Promise<void> {
    localStorage.removeItem(`password_reset_${email}`);
    devLog('🗑️ 재설정 코드 삭제:', email);
  }

  // === 수료 보상 시스템 ===

  /**
   * 강의 수료 시 포인트 지급
   * @param email 사용자 이메일
   * @param courseId 강의 ID
   * @param pointAmount 지급할 포인트 금액 (기본 10,000)
   */
  static async grantCompletionReward(
    email: string,
    courseId: string,
    pointAmount: number = 10000
  ): Promise<boolean> {
    try {
      devLog('🎁 수료 보상 지급 시작:', email, courseId, pointAmount);

      // 사용자 정보 조회
      const user = await this.getUserByEmail(email);
      if (!user) {
        devError('❌ 사용자를 찾을 수 없음:', email);
        return false;
      }

      // 이미 해당 강의의 수료 보상을 받았는지 확인
      const rewardHistory = RewardUtils.parseRewardHistory(user.rewardHistory || '[]');
      const alreadyRewarded = rewardHistory.some(
        r => r.sourceType === 'course_completion' && r.sourceId === courseId
      );

      if (alreadyRewarded) {
        devLog('ℹ️ 이미 수료 보상을 받은 강의입니다:', courseId);
        return false;
      }

      // 수료 보상 트랜잭션 생성
      const completionReward: RewardTransaction = {
        id: `completion_reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromUserId: 'system',
        toUserId: user.rowKey,
        amount: pointAmount,
        sourceAmount: 0,
        sourceType: 'course_completion' as any, // 새로운 타입
        sourceId: courseId,
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        note: `${courseId} 강의 수료 축하 보상`
      };

      // 리워드 내역 업데이트
      rewardHistory.push(completionReward);

      // 사용자 포인트 업데이트
      const updatedUser = {
        ...user,
        totalRewards: (user.totalRewards || 0) + pointAmount,
        rewardHistory: RewardUtils.stringifyRewardHistory(rewardHistory),
        updatedAt: new Date().toISOString()
      };

      // Azure에 업데이트
      await this.azureRequest('users', 'PUT', updatedUser, `users|${user.rowKey}`);

      devLog('✅ 수료 보상 지급 완료:', email, pointAmount, '포인트');
      return true;
    } catch (error: any) {
      devError('❌ 수료 보상 지급 실패:', error.message);
      return false;
    }
  }

  /**
   * 결제 시 포인트 사용
   * @param email 사용자 이메일
   * @param pointsToUse 사용할 포인트
   * @param orderId 주문 ID
   */
  static async usePointsForPayment(
    email: string,
    pointsToUse: number,
    orderId: string
  ): Promise<boolean> {
    try {
      devLog('💰 포인트 사용 시작:', email, pointsToUse, '포인트');

      // 사용자 정보 조회
      const user = await this.getUserByEmail(email);
      if (!user) {
        devError('❌ 사용자를 찾을 수 없음:', email);
        return false;
      }

      // 포인트 잔액 확인
      const currentPoints = user.totalRewards || 0;
      if (currentPoints < pointsToUse) {
        devError('❌ 포인트 잔액 부족:', currentPoints, '<', pointsToUse);
        return false;
      }

      // 포인트 사용 트랜잭션 생성
      const pointUsageTransaction: RewardTransaction = {
        id: `point_usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromUserId: user.rowKey,
        toUserId: 'system',
        amount: -pointsToUse, // 음수로 차감 표시
        sourceAmount: pointsToUse,
        sourceType: 'point_usage' as any, // 새로운 타입
        sourceId: orderId,
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        note: `주문 ${orderId} - 포인트 사용`
      };

      // 리워드 내역 업데이트
      const rewardHistory = RewardUtils.parseRewardHistory(user.rewardHistory || '[]');
      rewardHistory.push(pointUsageTransaction);

      // 사용자 포인트 차감
      const updatedUser = {
        ...user,
        totalRewards: currentPoints - pointsToUse,
        rewardHistory: RewardUtils.stringifyRewardHistory(rewardHistory),
        updatedAt: new Date().toISOString()
      };

      // Azure에 업데이트
      await this.azureRequest('users', 'PUT', updatedUser, `users|${user.rowKey}`);

      devLog('✅ 포인트 사용 완료:', email, pointsToUse, '포인트 차감');
      devLog('💰 남은 포인트:', currentPoints - pointsToUse);
      return true;
    } catch (error: any) {
      devError('❌ 포인트 사용 실패:', error.message);
      return false;
    }
  }

  /**
   * 사용자 포인트 잔액 조회
   * @param email 사용자 이메일
   */
  static async getUserPoints(email: string): Promise<number> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        return 0;
      }
      return user.totalRewards || 0;
    } catch (error: any) {
      devError('❌ 포인트 조회 실패:', error.message);
      return 0;
    }
  }

  /**
   * 사용자 특정 필드 업데이트
   * @param email 사용자 이메일
   * @param fieldName 필드 이름
   * @param value 필드 값
   */
  static async updateUserField(email: string, fieldName: string, value: any): Promise<boolean> {
    try {
      devLog(`🔄 사용자 필드 업데이트: ${email} - ${fieldName}`);

      const user = await this.getUserByEmail(email);
      if (!user) {
        devError('❌ 사용자를 찾을 수 없음:', email);
        return false;
      }

      const updatedUser = {
        PartitionKey: 'users',
        RowKey: email,
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        passwordHash: user.passwordHash,
        emailVerified: user.emailVerified,
        marketingAgreed: user.marketingAgreed,
        createdAt: user.createdAt,
        updatedAt: new Date().toISOString(),
        lastLoginAt: user.lastLoginAt || '',
        enrolledCourses: user.enrolledCourses || '',
        referralCode: user.referralCode || '',
        referredBy: user.referredBy || '',
        totalEnrolledCourses: user.totalEnrolledCourses || 0,
        completedCourses: user.completedCourses || 0,
        totalLearningTimeMinutes: user.totalLearningTimeMinutes || 0,
        totalRewards: user.totalRewards || 0,
        pendingRewards: user.pendingRewards || 0,
        rewardHistory: user.rewardHistory || '[]',
        referralCount: user.referralCount || 0,
        referralStats: user.referralStats || '{"totalReferrals":0,"activePurchasers":0,"totalRewardEarned":0,"thisMonthRewards":0,"topReferralMonth":""}',
        passwordResetToken: user.passwordResetToken || '',
        passwordResetTokenExpiry: user.passwordResetTokenExpiry || '',
        cityMapData: user.cityMapData || '',
        [fieldName]: value
      };

      // SAS URL에서 기본 URL과 SAS 토큰 분리
      const baseUrl = AZURE_SAS_URLS.users.split('?')[0];
      const sasToken = '?' + AZURE_SAS_URLS.users.split('?')[1];
      const url = `${baseUrl}(PartitionKey='users',RowKey='${encodeURIComponent(email)}')${sasToken}`;

      const response = await this.retryRequest(url, {
        method: 'MERGE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json;odata=nometadata',
          'If-Match': '*'
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      devLog(`✅ ${fieldName} 업데이트 성공`);
      return true;
    } catch (error: any) {
      devError(`❌ ${fieldName} 업데이트 실패:`, error.message);
      return false;
    }
  }

  // AI 추천 사용 횟수 증가
  static async incrementAIRecommendationUsage(email: string): Promise<boolean> {
    try {
      devLog(`🔄 AI 추천 사용 횟수 증가: ${email}`);

      const user = await this.getUserByEmail(email);
      if (!user) {
        devError('❌ 사용자를 찾을 수 없음:', email);
        return false;
      }

      devLog(`🔑 실제 RowKey: ${user.rowKey}`);
      const currentCount = user.aiRecommendationUsageCount || 0;
      const newCount = currentCount + 1;

      const updatedUser = {
        PartitionKey: 'users',
        RowKey: user.rowKey, // 🔧 이메일이 아닌 실제 RowKey 사용!
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        countryCode: user.countryCode || '',
        passwordHash: user.passwordHash,
        emailVerified: user.emailVerified,
        marketingAgreed: user.marketingAgreed,
        createdAt: user.createdAt,
        updatedAt: new Date().toISOString(),
        lastLoginAt: user.lastLoginAt || '',
        enrolledCourses: user.enrolledCourses || '',
        referralCode: user.referralCode || '',
        referredBy: user.referredBy || '',
        totalEnrolledCourses: user.totalEnrolledCourses || 0,
        completedCourses: user.completedCourses || 0,
        totalLearningTimeMinutes: user.totalLearningTimeMinutes || 0,
        totalRewards: user.totalRewards || 0,
        pendingRewards: user.pendingRewards || 0,
        rewardHistory: user.rewardHistory || '[]',
        referralCount: user.referralCount || 0,
        referralStats: user.referralStats || '',
        cityMapData: user.cityMapData || '',
        aiRecommendationUsageCount: newCount
      };

      const baseUrl = AZURE_SAS_URLS.users.split('?')[0];
      const sasToken = AZURE_SAS_URLS.users.split('?')[1];
      const url = `${baseUrl}(PartitionKey='users',RowKey='${encodeURIComponent(user.rowKey)}')?${sasToken}`;

      const response = await this.retryRequest(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json;odata=nometadata'
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      devLog(`✅ AI 추천 사용 횟수 증가 성공: ${currentCount} → ${newCount}`);
      return true;
    } catch (error: any) {
      devError(`❌ AI 추천 사용 횟수 증가 실패:`, error.message);
      return false;
    }
  }

  // ==================== 커뮤니티 게시판 메서드 ====================

  // 게시글 인터페이스
  static PostInterface = {
    PartitionKey: '', // courseId (step1, step2, step3, step4)
    RowKey: '',       // postId (UUID)
    title: '',
    content: '',
    authorEmail: '',
    authorName: '',
    category: '',     // question, share, tips, intro
    createdAt: '',
    updatedAt: '',
    likes: 0,
    commentCount: 0,
    likedBy: ''       // JSON array of emails
  };

  // 강의별 게시글 목록 조회
  static async getPostsByCourse(courseId: string): Promise<any[]> {
    try {
      devLog(`📋 ${courseId} 게시글 조회 중...`);
      
      const baseUrl = AZURE_SAS_URLS.posts.split('?')[0];
      const sasToken = AZURE_SAS_URLS.posts.split('?')[1];
      const filter = `PartitionKey eq '${courseId}'`;
      const url = `${baseUrl}?${sasToken}&$filter=${encodeURIComponent(filter)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'x-ms-version': '2020-04-08'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const posts = data.value || [];
      
      // 최신순 정렬
      posts.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      devLog(`✅ ${posts.length}개 게시글 조회 완료`);
      return posts;
    } catch (error: any) {
      devError(`❌ 게시글 조회 실패:`, error.message);
      return [];
    }
  }

  // 게시글 작성
  static async createPost(post: {
    courseId: string;
    title: string;
    content: string;
    authorEmail: string;
    authorName: string;
    category: string;
  }): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      devLog(`📝 게시글 작성 중...`);
      
      const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const now = new Date().toISOString();

      const newPost = {
        PartitionKey: post.courseId,
        RowKey: postId,
        title: post.title,
        content: post.content,
        authorEmail: post.authorEmail,
        authorName: post.authorName,
        category: post.category,
        createdAt: now,
        updatedAt: now,
        likes: 0,
        commentCount: 0,
        likedBy: '[]'
      };

      const baseUrl = AZURE_SAS_URLS.posts.split('?')[0];
      const sasToken = AZURE_SAS_URLS.posts.split('?')[1];
      const url = `${baseUrl}?${sasToken}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json;odata=nometadata',
          'x-ms-version': '2020-04-08'
        },
        body: JSON.stringify(newPost)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      devLog(`✅ 게시글 작성 완료: ${postId}`);
      return { success: true, postId };
    } catch (error: any) {
      devError(`❌ 게시글 작성 실패:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // 게시글 좋아요
  static async likePost(courseId: string, postId: string, userEmail: string): Promise<boolean> {
    try {
      // 먼저 현재 게시글 조회
      const baseUrl = AZURE_SAS_URLS.posts.split('?')[0];
      const sasToken = AZURE_SAS_URLS.posts.split('?')[1];
      const getUrl = `${baseUrl}(PartitionKey='${courseId}',RowKey='${postId}')?${sasToken}`;

      const getResponse = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'x-ms-version': '2020-04-08'
        }
      });

      if (!getResponse.ok) {
        throw new Error('게시글을 찾을 수 없습니다');
      }

      const post = await getResponse.json();
      let likedBy: string[] = [];
      try {
        likedBy = JSON.parse(post.likedBy || '[]');
      } catch (e) {
        likedBy = [];
      }

      // 이미 좋아요 했는지 확인
      const alreadyLiked = likedBy.includes(userEmail);
      
      if (alreadyLiked) {
        // 좋아요 취소
        likedBy = likedBy.filter(email => email !== userEmail);
      } else {
        // 좋아요 추가
        likedBy.push(userEmail);
      }

      // 업데이트
      const updateUrl = `${baseUrl}(PartitionKey='${courseId}',RowKey='${postId}')?${sasToken}`;
      const updateResponse = await fetch(updateUrl, {
        method: 'MERGE',
        headers: {
          'Content-Type': 'application/json',
          'x-ms-version': '2020-04-08',
          'If-Match': '*'
        },
        body: JSON.stringify({
          likes: likedBy.length,
          likedBy: JSON.stringify(likedBy)
        })
      });

      if (!updateResponse.ok) {
        throw new Error('좋아요 업데이트 실패');
      }

      devLog(`✅ 좋아요 ${alreadyLiked ? '취소' : '추가'} 완료`);
      return true;
    } catch (error: any) {
      devError(`❌ 좋아요 실패:`, error.message);
      return false;
    }
  }

  // 댓글 목록 조회
  static async getCommentsByPost(postId: string): Promise<any[]> {
    try {
      devLog(`💬 ${postId} 댓글 조회 중...`);
      
      const baseUrl = AZURE_SAS_URLS.comments.split('?')[0];
      const sasToken = AZURE_SAS_URLS.comments.split('?')[1];
      const filter = `PartitionKey eq '${postId}'`;
      const url = `${baseUrl}?${sasToken}&$filter=${encodeURIComponent(filter)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'x-ms-version': '2020-04-08'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const comments = data.value || [];
      
      // 시간순 정렬
      comments.sort((a: any, b: any) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      devLog(`✅ ${comments.length}개 댓글 조회 완료`);
      return comments;
    } catch (error: any) {
      devError(`❌ 댓글 조회 실패:`, error.message);
      return [];
    }
  }

  // 댓글 작성
  static async createComment(comment: {
    postId: string;
    courseId: string;
    content: string;
    authorEmail: string;
    authorName: string;
  }): Promise<{ success: boolean; commentId?: string; error?: string }> {
    try {
      devLog(`💬 댓글 작성 중...`);
      
      const commentId = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const now = new Date().toISOString();

      const newComment = {
        PartitionKey: comment.postId,
        RowKey: commentId,
        courseId: comment.courseId,
        content: comment.content,
        authorEmail: comment.authorEmail,
        authorName: comment.authorName,
        createdAt: now
      };

      const baseUrl = AZURE_SAS_URLS.comments.split('?')[0];
      const sasToken = AZURE_SAS_URLS.comments.split('?')[1];
      const url = `${baseUrl}?${sasToken}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json;odata=nometadata',
          'x-ms-version': '2020-04-08'
        },
        body: JSON.stringify(newComment)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // 게시글의 댓글 수 업데이트
      await this.updatePostCommentCount(comment.courseId, comment.postId, 1);

      devLog(`✅ 댓글 작성 완료: ${commentId}`);
      return { success: true, commentId };
    } catch (error: any) {
      devError(`❌ 댓글 작성 실패:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // 게시글 댓글 수 업데이트 (내부 헬퍼)
  private static async updatePostCommentCount(courseId: string, postId: string, delta: number): Promise<void> {
    try {
      const baseUrl = AZURE_SAS_URLS.posts.split('?')[0];
      const sasToken = AZURE_SAS_URLS.posts.split('?')[1];
      
      // 현재 게시글 조회
      const getUrl = `${baseUrl}(PartitionKey='${courseId}',RowKey='${postId}')?${sasToken}`;
      const getResponse = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'x-ms-version': '2020-04-08'
        }
      });

      if (!getResponse.ok) return;

      const post = await getResponse.json();
      const newCount = Math.max(0, (post.commentCount || 0) + delta);

      // 업데이트
      const updateUrl = `${baseUrl}(PartitionKey='${courseId}',RowKey='${postId}')?${sasToken}`;
      await fetch(updateUrl, {
        method: 'MERGE',
        headers: {
          'Content-Type': 'application/json',
          'x-ms-version': '2020-04-08',
          'If-Match': '*'
        },
        body: JSON.stringify({ commentCount: newCount })
      });
    } catch (error) {
      devError('댓글 수 업데이트 실패:', error);
    }
  }

  // 게시글 삭제
  static async deletePost(courseId: string, postId: string, userEmail: string): Promise<boolean> {
    try {
      // 먼저 게시글 작성자 확인
      const baseUrl = AZURE_SAS_URLS.posts.split('?')[0];
      const sasToken = AZURE_SAS_URLS.posts.split('?')[1];
      const getUrl = `${baseUrl}(PartitionKey='${courseId}',RowKey='${postId}')?${sasToken}`;

      const getResponse = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'x-ms-version': '2020-04-08'
        }
      });

      if (!getResponse.ok) {
        throw new Error('게시글을 찾을 수 없습니다');
      }

      const post = await getResponse.json();
      if (post.authorEmail !== userEmail) {
        throw new Error('삭제 권한이 없습니다');
      }

      // 삭제
      const deleteUrl = `${baseUrl}(PartitionKey='${courseId}',RowKey='${postId}')?${sasToken}`;
      const deleteResponse = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'x-ms-version': '2020-04-08',
          'If-Match': '*'
        }
      });

      if (!deleteResponse.ok) {
        throw new Error('삭제 실패');
      }

      devLog(`✅ 게시글 삭제 완료: ${postId}`);
      return true;
    } catch (error: any) {
      devError(`❌ 게시글 삭제 실패:`, error.message);
      return false;
    }
  }

  // ========================================
  // 🧱 파트너 프로그램 관련 메서드 (users 테이블 사용)
  // ========================================

  // 파트너 정보 조회 (users 테이블에서)
  static async getOrCreatePartner(email: string, name: string): Promise<Partner | null> {
    try {
      // users 테이블에서 사용자 조회
      const user = await this.getUserByEmail(email);
      
      if (!user) {
        devWarn(`⚠️ 사용자를 찾을 수 없습니다: ${email}`);
        return null;
      }

      // 추천 코드가 없으면 생성
      if (!user.referralCode) {
        const newReferralCode = RewardUtils.generateReferralCode();
        await this.updateUserField(email, 'referralCode', newReferralCode);
        user.referralCode = newReferralCode;
      }

      // User 정보를 Partner 형태로 변환
      const partner: Partner = {
        partitionKey: 'users',
        rowKey: email,
        email: user.email,
        name: user.name || name,
        referralCode: user.referralCode || '',
        totalBricks: user.totalBricks || 0,
        availableBricks: user.availableBricks || 0,
        pendingBricks: user.pendingBricks || 0,
        withdrawnBricks: user.withdrawnBricks || 0,
        totalReferrals: user.referralCount || 0,
        partnerTier: user.partnerTier || 'bronze',
        commissionRate: user.commissionRate || 10,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      return partner;
    } catch (error: any) {
      devError(`❌ 파트너 조회 실패:`, error.message);
      return null;
    }
  }

  // 파트너 브릭 정보 업데이트 (users 테이블)
  static async updatePartnerBricks(email: string, updates: {
    totalBricks?: number;
    availableBricks?: number;
    pendingBricks?: number;
    withdrawnBricks?: number;
    referralCount?: number;
    partnerTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
    commissionRate?: number;
    referralHistory?: string;
    withdrawalHistory?: string;
  }): Promise<boolean> {
    try {
      // 각 필드별로 updateUserField 호출
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          const success = await this.updateUserField(email, key, value);
          if (!success) {
            devError(`❌ 필드 업데이트 실패: ${key}`);
            return false;
          }
        }
      }
      return true;
    } catch (error: any) {
      devError(`❌ 파트너 브릭 업데이트 실패:`, error.message);
      return false;
    }
  }

  // 이메일 마스킹
  private static maskEmailForPartner(email: string): string {
    const [local, domain] = email.split('@');
    const maskedLocal = local.slice(0, 2) + '***';
    return `${maskedLocal}@${domain}`;
  }

  // 추천 내역 추가 (결제 성공 시 호출) - users 테이블의 JSON 필드 사용
  static async addReferral(
    partnerEmail: string,
    buyerEmail: string,
    courseId: string,
    courseName: string,
    coursePrice: number
  ): Promise<boolean> {
    try {
      const user = await this.getUserByEmail(partnerEmail);
      if (!user) return false;

      const earnedBricks = Math.floor(coursePrice * ((user.commissionRate || 10) / 100));
      
      // 새 추천 내역
      const newReferral: PartnerReferral = {
        partitionKey: partnerEmail,
        rowKey: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        referralDate: new Date().toISOString(),
        buyerEmail: this.maskEmailForPartner(buyerEmail),
        courseId,
        courseName,
        coursePrice,
        earnedBricks,
        status: 'pending'
      };

      // 기존 추천 내역 가져오기
      let referralHistory: PartnerReferral[] = [];
      try {
        referralHistory = user.referralHistory ? JSON.parse(user.referralHistory) : [];
      } catch { referralHistory = []; }

      // 새 추천 추가
      referralHistory.unshift(newReferral);

      // 브릭 업데이트
      await this.updatePartnerBricks(partnerEmail, {
        totalBricks: (user.totalBricks || 0) + earnedBricks,
        pendingBricks: (user.pendingBricks || 0) + earnedBricks,
        referralCount: (user.referralCount || 0) + 1,
        referralHistory: JSON.stringify(referralHistory)
      });

      devLog(`✅ 추천 내역 추가: ${partnerEmail} +${earnedBricks} 브릭`);
      return true;
    } catch (error: any) {
      devError(`❌ 추천 내역 추가 실패:`, error.message);
      return false;
    }
  }

  // 추천 내역 조회 (users 테이블의 JSON 필드에서)
  static async getReferrals(partnerEmail: string): Promise<PartnerReferral[]> {
    try {
      const user = await this.getUserByEmail(partnerEmail);
      if (!user || !user.referralHistory) return [];

      const referrals: PartnerReferral[] = JSON.parse(user.referralHistory);
      return referrals.sort((a, b) => 
        new Date(b.referralDate).getTime() - new Date(a.referralDate).getTime()
      );
    } catch (error: any) {
      devError(`❌ 추천 내역 조회 실패:`, error.message);
      return [];
    }
  }

  // 출금 신청 (users 테이블 사용)
  static async requestWithdrawal(
    partnerEmail: string,
    amount: number,
    bankName: string,
    accountNumber: string,
    accountHolder: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 최소 출금액 확인
      if (amount < 100000) {
        return { success: false, message: '최소 출금 금액은 100,000 브릭입니다.' };
      }

      const user = await this.getUserByEmail(partnerEmail);
      if (!user) {
        return { success: false, message: '사용자 정보를 찾을 수 없습니다.' };
      }

      // 출금 가능 금액 확인
      const availableBricks = user.availableBricks || 0;
      if (availableBricks < amount) {
        return { success: false, message: '출금 가능한 브릭이 부족합니다.' };
      }

      const maskedAccount = accountNumber.slice(0, 4) + '****' + accountNumber.slice(-4);

      // 새 출금 내역
      const newWithdrawal: PartnerWithdrawal = {
        partitionKey: partnerEmail,
        rowKey: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requestDate: new Date().toISOString(),
        amount,
        bankName,
        accountNumber: maskedAccount,
        accountHolder,
        status: 'pending'
      };

      // 기존 출금 내역 가져오기
      let withdrawalHistory: PartnerWithdrawal[] = [];
      try {
        withdrawalHistory = user.withdrawalHistory ? JSON.parse(user.withdrawalHistory) : [];
      } catch { withdrawalHistory = []; }

      // 새 출금 추가
      withdrawalHistory.unshift(newWithdrawal);

      // 브릭 업데이트
      await this.updatePartnerBricks(partnerEmail, {
        availableBricks: availableBricks - amount,
        withdrawalHistory: JSON.stringify(withdrawalHistory)
      });

      devLog(`✅ 출금 신청 완료: ${partnerEmail} ${amount} 브릭`);
      return { success: true, message: '출금 신청이 완료되었습니다. 월말에 정산됩니다.' };
    } catch (error: any) {
      devError(`❌ 출금 신청 실패:`, error.message);
      return { success: false, message: error.message };
    }
  }

  // 출금 내역 조회 (users 테이블의 JSON 필드에서)
  static async getWithdrawals(partnerEmail: string): Promise<PartnerWithdrawal[]> {
    try {
      const user = await this.getUserByEmail(partnerEmail);
      if (!user || !user.withdrawalHistory) return [];

      const withdrawals: PartnerWithdrawal[] = JSON.parse(user.withdrawalHistory);
      return withdrawals.sort((a, b) => 
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      );
    } catch (error: any) {
      devError(`❌ 출금 내역 조회 실패:`, error.message);
      return [];
    }
  }

  // 월말 정산 (대기 브릭 → 출금 가능 브릭으로 전환)
  static async processMonthlySettlement(partnerEmail: string): Promise<boolean> {
    try {
      const user = await this.getUserByEmail(partnerEmail);
      if (!user || !user.pendingBricks || user.pendingBricks === 0) return false;

      // 대기 브릭을 출금 가능 브릭으로 이전
      await this.updatePartnerBricks(partnerEmail, {
        availableBricks: (user.availableBricks || 0) + user.pendingBricks,
        pendingBricks: 0
      });

      // 추천 내역 상태 업데이트 (pending → confirmed)
      if (user.referralHistory) {
        try {
          const referrals: PartnerReferral[] = JSON.parse(user.referralHistory);
          const updatedReferrals = referrals.map(r => ({
            ...r,
            status: r.status === 'pending' ? 'confirmed' as const : r.status,
            confirmedAt: r.status === 'pending' ? new Date().toISOString() : r.confirmedAt
          }));
          await this.updatePartnerBricks(partnerEmail, {
            referralHistory: JSON.stringify(updatedReferrals)
          });
        } catch { /* ignore */ }
      }
      
      devLog(`✅ 월말 정산 완료: ${partnerEmail}`);
      return true;
    } catch (error: any) {
      devError(`❌ 월말 정산 실패:`, error.message);
      return false;
    }
  }

  // 추천 코드로 사용자 찾기
  static async getPartnerByReferralCode(referralCode: string): Promise<Partner | null> {
    try {
      const baseUrl = AZURE_SAS_URLS.users.split('?')[0];
      const sasToken = AZURE_SAS_URLS.users.split('?')[1];
      const filter = encodeURIComponent(`referralCode eq '${referralCode}'`);
      const url = `${baseUrl}?${sasToken}&$filter=${filter}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'x-ms-version': '2020-04-08'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.value && data.value.length > 0) {
          const user = data.value[0] as User;
          return await this.getOrCreatePartner(user.email, user.name);
        }
      }

      return null;
    } catch (error: any) {
      devError(`❌ 추천 코드로 파트너 검색 실패:`, error.message);
      return null;
    }
  }

  // 추천 코드로 파트너 이메일 찾기
  static async getEmailByReferralCode(referralCode: string): Promise<string | null> {
    try {
      devLog(`🔍 추천 코드로 이메일 검색: ${referralCode}`);
      
      // users 테이블에서 referralCode로 검색
      const baseUrl = AZURE_SAS_URLS.users.split('?')[0];
      const sasToken = '?' + AZURE_SAS_URLS.users.split('?')[1];
      const filter = `referralCode eq '${referralCode}'`;
      const url = `${baseUrl}()${sasToken}&$filter=${encodeURIComponent(filter)}`;

      const response = await this.retryRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.value && data.value.length > 0) {
          const user = data.value[0] as User;
          devLog(`✅ 추천 코드 ${referralCode} → 이메일 ${user.email}`);
          return user.email;
        }
      }

      devLog(`⚠️ 추천 코드 ${referralCode}에 해당하는 사용자 없음`);
      return null;
    } catch (error: any) {
      devError(`❌ 추천 코드로 이메일 검색 실패:`, error.message);
      return null;
    }
  }

  // 모든 대기 중인 출금 요청 조회 (관리자용)
  static async getAllPendingWithdrawals(): Promise<(PartnerWithdrawal & { partnerEmail: string; partnerName: string })[]> {
    try {
      devLog('🔍 대기 중인 출금 요청 조회...');
      
      // 모든 사용자 조회
      const baseUrl = AZURE_SAS_URLS.users.split('?')[0];
      const sasToken = '?' + AZURE_SAS_URLS.users.split('?')[1];
      const url = `${baseUrl}()${sasToken}`;

      const response = await this.retryRequest(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
        }
      });

      if (!response.ok) return [];

      const data = await response.json();
      const allWithdrawals: (PartnerWithdrawal & { partnerEmail: string; partnerName: string })[] = [];

      for (const user of data.value || []) {
        if (user.withdrawalHistory) {
          try {
            const withdrawals: PartnerWithdrawal[] = JSON.parse(user.withdrawalHistory);
            const pendingOnes = withdrawals
              .filter(w => w.status === 'pending')
              .map(w => ({
                ...w,
                partnerEmail: user.email,
                partnerName: user.name || user.email
              }));
            allWithdrawals.push(...pendingOnes);
          } catch { /* ignore parse errors */ }
        }
      }

      // 최신순 정렬
      allWithdrawals.sort((a, b) => 
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      );

      devLog(`✅ 대기 중인 출금 요청 ${allWithdrawals.length}건`);
      return allWithdrawals;
    } catch (error: any) {
      devError(`❌ 출금 요청 조회 실패:`, error.message);
      return [];
    }
  }

  // 출금 상태 업데이트 (관리자용)
  static async updateWithdrawalStatus(
    partnerEmail: string, 
    withdrawalRowKey: string, 
    status: 'completed' | 'rejected',
    rejectReason?: string
  ): Promise<boolean> {
    try {
      devLog(`🔄 출금 상태 업데이트: ${partnerEmail} → ${status}`);
      
      const user = await this.getUserByEmail(partnerEmail);
      if (!user || !user.withdrawalHistory) return false;

      const withdrawals: PartnerWithdrawal[] = JSON.parse(user.withdrawalHistory);
      const targetIndex = withdrawals.findIndex(w => w.rowKey === withdrawalRowKey);
      
      if (targetIndex === -1) {
        devError('❌ 출금 요청을 찾을 수 없음');
        return false;
      }

      const withdrawal = withdrawals[targetIndex];
      
      // 상태 업데이트
      withdrawals[targetIndex] = {
        ...withdrawal,
        status,
        processedAt: new Date().toISOString()
      };

      // 거절인 경우 브릭 환불
      if (status === 'rejected') {
        await this.updatePartnerBricks(partnerEmail, {
          availableBricks: (user.availableBricks || 0) + withdrawal.amount
        });
      }

      // 완료인 경우 출금 완료 브릭 증가
      if (status === 'completed') {
        await this.updatePartnerBricks(partnerEmail, {
          withdrawnBricks: (user.withdrawnBricks || 0) + withdrawal.amount
        });
      }

      // 출금 내역 저장
      await this.updateUserField(partnerEmail, 'withdrawalHistory', JSON.stringify(withdrawals));

      devLog(`✅ 출금 상태 업데이트 완료: ${status}`);
      return true;
    } catch (error: any) {
      devError(`❌ 출금 상태 업데이트 실패:`, error.message);
      return false;
    }
  }

  // ========================================
  // 📺 라이브 아카이브 관련 메서드
  // ========================================

  /**
   * 특정 강의의 라이브 아카이브 목록 조회
   * @param courseId 강의 ID (예: 'ai-building-course', 'chatgpt-agent-beginner', 'vibe-coding')
   */
  static async getLiveArchives(courseId: string): Promise<any[]> {
    try {
      devLog(`📺 ${courseId} 라이브 아카이브 조회 중...`);
      
      // users 테이블에서 시스템 설정으로 저장된 라이브 아카이브 조회
      const systemUser = await this.getUserByEmail('system@aicitybuilders.com');
      
      if (!systemUser) {
        devLog('ℹ️ 시스템 사용자가 없습니다. 빈 배열 반환.');
        return [];
      }

      const allArchives = systemUser.liveArchives ? JSON.parse(systemUser.liveArchives) : [];
      const courseArchives = allArchives.filter((archive: any) => archive.courseId === courseId);
      
      // 최신순 정렬
      courseArchives.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      devLog(`✅ ${courseId} 라이브 아카이브 ${courseArchives.length}개 조회 완료`);
      return courseArchives;
    } catch (error: any) {
      devError(`❌ 라이브 아카이브 조회 실패:`, error.message);
      return [];
    }
  }

  /**
   * 라이브 아카이브 추가
   * @param archive 아카이브 정보
   */
  static async addLiveArchive(archive: {
    courseId: string;
    title: string;
    description?: string;
    date: string;
    youtubeId: string;
    duration?: string;
  }): Promise<boolean> {
    try {
      devLog(`📺 라이브 아카이브 추가 중:`, archive.title);
      
      // 시스템 사용자 조회 또는 생성
      let systemUser = await this.getUserByEmail('system@aicitybuilders.com');
      
      if (!systemUser) {
        // 시스템 사용자 생성
        await this.createUser({
          email: 'system@aicitybuilders.com',
          name: 'System',
          password: 'system-internal-user-no-login',
          marketingAgreed: false
        });
        systemUser = await this.getUserByEmail('system@aicitybuilders.com');
      }

      const allArchives = systemUser?.liveArchives ? JSON.parse(systemUser.liveArchives) : [];
      
      const newArchive = {
        id: `live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...archive,
        createdAt: new Date().toISOString()
      };
      
      allArchives.push(newArchive);
      
      await this.updateUserField('system@aicitybuilders.com', 'liveArchives', JSON.stringify(allArchives));
      
      devLog(`✅ 라이브 아카이브 추가 완료:`, newArchive.id);
      return true;
    } catch (error: any) {
      devError(`❌ 라이브 아카이브 추가 실패:`, error.message);
      return false;
    }
  }

  /**
   * 라이브 아카이브 삭제
   * @param archiveId 아카이브 ID
   */
  static async deleteLiveArchive(archiveId: string): Promise<boolean> {
    try {
      devLog(`🗑️ 라이브 아카이브 삭제 중:`, archiveId);
      
      const systemUser = await this.getUserByEmail('system@aicitybuilders.com');
      
      if (!systemUser) {
        devError('❌ 시스템 사용자가 없습니다.');
        return false;
      }

      const allArchives = systemUser.liveArchives ? JSON.parse(systemUser.liveArchives) : [];
      const filteredArchives = allArchives.filter((archive: any) => archive.id !== archiveId);
      
      if (allArchives.length === filteredArchives.length) {
        devLog('ℹ️ 삭제할 아카이브를 찾지 못했습니다.');
        return false;
      }
      
      await this.updateUserField('system@aicitybuilders.com', 'liveArchives', JSON.stringify(filteredArchives));
      
      devLog(`✅ 라이브 아카이브 삭제 완료:`, archiveId);
      return true;
    } catch (error: any) {
      devError(`❌ 라이브 아카이브 삭제 실패:`, error.message);
      return false;
    }
  }

  /**
   * 모든 라이브 아카이브 조회 (어드민용)
   */
  static async getAllLiveArchives(): Promise<any[]> {
    try {
      devLog(`📺 전체 라이브 아카이브 조회 중...`);
      
      const systemUser = await this.getUserByEmail('system@aicitybuilders.com');
      
      if (!systemUser) {
        return [];
      }

      const allArchives = systemUser.liveArchives ? JSON.parse(systemUser.liveArchives) : [];
      
      // 최신순 정렬
      allArchives.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      devLog(`✅ 전체 라이브 아카이브 ${allArchives.length}개 조회 완료`);
      return allArchives;
    } catch (error: any) {
      devError(`❌ 전체 라이브 아카이브 조회 실패:`, error.message);
      return [];
    }
  }

  // ========================================
  // 🔴 현재 라이브 설정 관리
  // ========================================

  /**
   * 현재 라이브 설정 조회
   * @param courseId 강의 ID
   */
  static async getCurrentLiveConfig(courseId: string): Promise<{
    isLive: boolean;
    liveUrl: string;
    liveTitle: string;
    updatedAt: string;
  } | null> {
    try {
      const systemUser = await this.getUserByEmail('system@aicitybuilders.com');
      
      if (!systemUser) return null;

      const liveConfigs = systemUser.liveConfigs ? JSON.parse(systemUser.liveConfigs) : {};
      return liveConfigs[courseId] || null;
    } catch (error: any) {
      devError(`❌ 라이브 설정 조회 실패:`, error.message);
      return null;
    }
  }

  /**
   * 현재 라이브 설정 업데이트 (어드민용)
   * @param courseId 강의 ID
   * @param config 라이브 설정
   */
  static async updateLiveConfig(courseId: string, config: {
    isLive: boolean;
    liveUrl: string;
    liveTitle: string;
  }): Promise<boolean> {
    try {
      devLog(`🔴 라이브 설정 업데이트:`, courseId, config.isLive ? 'ON' : 'OFF');
      
      let systemUser = await this.getUserByEmail('system@aicitybuilders.com');
      
      if (!systemUser) {
        await this.createUser({
          email: 'system@aicitybuilders.com',
          name: 'System',
          password: 'system-internal-user-no-login',
          marketingAgreed: false
        });
        systemUser = await this.getUserByEmail('system@aicitybuilders.com');
      }

      const liveConfigs = systemUser?.liveConfigs ? JSON.parse(systemUser.liveConfigs) : {};
      
      liveConfigs[courseId] = {
        ...config,
        updatedAt: new Date().toISOString()
      };
      
      await this.updateUserField('system@aicitybuilders.com', 'liveConfigs', JSON.stringify(liveConfigs));
      
      devLog(`✅ 라이브 설정 업데이트 완료`);
      return true;
    } catch (error: any) {
      devError(`❌ 라이브 설정 업데이트 실패:`, error.message);
      return false;
    }
  }

  /**
   * 모든 라이브 설정 조회 (어드민용)
   */
  static async getAllLiveConfigs(): Promise<{ [courseId: string]: any }> {
    try {
      const systemUser = await this.getUserByEmail('system@aicitybuilders.com');
      
      if (!systemUser) return {};

      return systemUser.liveConfigs ? JSON.parse(systemUser.liveConfigs) : {};
    } catch (error: any) {
      devError(`❌ 전체 라이브 설정 조회 실패:`, error.message);
      return {};
    }
  }
}

export default AzureTableService;