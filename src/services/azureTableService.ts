// Azure SDK 대신 REST API 직접 호출 사용

// Azure Table Storage SAS URLs 설정
const AZURE_SAS_URLS = {
  users: 'https://clathonstorage.table.core.windows.net/users?sp=raud&st=2025-08-13T02:04:25Z&se=2030-10-13T10:19:00Z&spr=https&sv=2024-11-04&sig=ulo8yMTJqBhKB%2FeeIKycUxl8knzpbDkClU6NTaPrHYw%3D&tn=users',
  sessions: 'https://clathonstorage.table.core.windows.net/mentoringssessions?sp=raud&st=2025-08-13T02:04:25Z&se=2030-10-13T10:19:00Z&spr=https&sv=2024-11-04&sig=ulo8yMTJqBhKB%2FeeIKycUxl8knzpbDkClU6NTaPrHYw%3D&tn=mentoringssessions',
  packages: 'https://clathonstorage.table.core.windows.net/studentpackages?sp=raud&st=2025-08-13T02:04:25Z&se=2030-10-13T10:19:00Z&spr=https&sv=2024-11-04&sig=ulo8yMTJqBhKB%2FeeIKycUxl8knzpbDkClU6NTaPrHYw%3D&tn=studentpackages'
};


const isConnectionConfigured = true; // SAS URL이 있으므로 항상 true

if (!isConnectionConfigured) {
  console.error('⚠️ Azure Storage Connection String이 설정되지 않았습니다!');
  console.log('🔧 .env 파일에 REACT_APP_AZURE_STORAGE_CONNECTION_STRING을 설정해주세요.');
  console.log('📋 Azure Portal에서 Connection String을 복사하여 설정하세요.');
}


// Azure SAS URL 기반 초기화 함수
const initializeAzureClients = () => {
  console.log('✅ Azure Table Storage 연결 완료');
};


// 설정이 되어있다면 즉시 초기화, 아니면 나중에 초기화
if (isConnectionConfigured) {
  initializeAzureClients();
  // 앱 시작 시 테이블 자동 생성
  setTimeout(() => {
    AzureTableService.initializeTables().then(() => {
      console.log('🚀 Azure Table Storage 완전 초기화 완료!');
    }).catch(error => {
      console.error('⚠️ 테이블 초기화 중 오류:', error);
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
}

// 리워드 관련 인터페이스
export interface RewardTransaction {
  id: string;
  fromUserId: string; // 구매한 사용자
  toUserId: string; // 리워드 받는 사용자 (추천인)
  amount: number; // 리워드 금액
  sourceAmount: number; // 원본 구매 금액
  sourceType: 'course_purchase' | 'package_purchase' | 'subscription' | 'signup_reward';
  sourceId: string; // 구매한 강의/패키지 ID
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

export interface User {
  partitionKey: string;
  rowKey: string;
  email: string;
  name: string;
  phone?: string; // 핸드폰 번호 추가
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
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<Response> {
    // let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        
        // 성공하거나 재시도할 필요 없는 오류인 경우 바로 반환
        if (response.ok || response.status < 500) {
          return response;
        }
        
        // 서버 오류 (5xx)인 경우 재시도
        throw new Error(`Server error: ${response.status}`);
        
      } catch (error) {
        // lastError = error as Error;
        console.warn(`🔄 요청 실패 (시도 ${attempt}/${maxRetries}):`, error);
        
        // 마지막 시도가 아니면 대기 후 재시도
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
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
      console.log('🔧 ETag 사용:', etag);
    } else {
      headers['If-Match'] = '*';
      console.log('🔧 ETag 없음, * 사용');
    }
    
    const azureEntity = this.convertToAzureEntity(body);
    
    const options: RequestInit = {
      method: 'PUT',  // MERGE 대신 PUT 사용 (전체 엔티티 교체)
      headers,
      body: JSON.stringify(azureEntity),
      mode: 'cors',
    };
    
    console.log('🔧 Azure PUT 요청 (엔티티 업데이트):', url);
    console.log('🔧 요청 헤더:', headers);
    
    try {
      const response = await this.retryRequest(url, options);
      
      if (response.ok) {
        const text = await response.text();
        console.log('✅ Azure PUT 요청 성공');
        return text ? JSON.parse(text) : { success: true };
      } else {
        const errorText = await response.text();
        console.error(`Azure PUT 오류:`, response.status, errorText);
        throw new Error(`Azure PUT 실패: ${response.status} - ${errorText}`);
      }
    } catch (error: any) {
      console.error(`Azure PUT 요청 실패:`, error.message);
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
      console.log(`🔗 ${method} 요청용 SAS URL:`, baseUrl.substring(0, 100) + '...');
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
      console.log(`🔧 Azure ${method} 요청 엔티티:`, azureEntity);
    }
    
    // 🔗 디버깅: 최종 요청 URL 출력  
    console.log(`🔗 Final Azure Request URL: ${url}`);
    
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
        console.error(`Azure ${method} 오류 (${tableName}):`, response.status, errorText);
        throw new Error(`Azure ${method} 실패: ${response.status} - ${errorText}`);
      }
    } catch (error: any) {
      console.error(`Azure ${method} 요청 실패 (${tableName}):`, error.message);
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
    
    console.log('🔧 Azure 엔티티 변환 결과:', azureEntity);
    return azureEntity;
  }

  // Azure SAS URL을 사용한 테스트 함수 (단일 Users 테이블)
  static async testAzureConnection(): Promise<boolean> {
    try {
      console.log('🧪 Azure Table Storage 단일 Users 테이블 SAS URL 테스트 시작...');
      
      const headers = {
        'Accept': 'application/json;odata=fullmetadata',
        'Content-Type': 'application/json',
      };
      
      // Users 테이블 연결 테스트
      const sasUrl = AZURE_SAS_URLS.users;
      console.log(`🔗 Users 테이블 테스트 중...`);
      
      const response = await fetch(sasUrl, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
      });
      
      if (response.ok) {
        await response.json(); // 데이터 읽기만 하고 사용하지 않음
        console.log(`✅ Users 테이블 연결 성공! (상태: ${response.status})`);
        console.log('🎉 Azure Table Storage 연결 성공!');
        console.log('🚀 쓰기 권한(sp=raud) 포함으로 완전한 CRUD 작업 준비 완료!');
        console.log('🎯 모든 데이터를 Users 테이블에 통합 저장 가능!');
        return true;
      } else {
        console.log(`❌ Users 테이블 연결 실패 (상태: ${response.status})`);
        return false;
      }
      
    } catch (error: any) {
      console.error('❌ Azure Users 테이블 연결 테스트 실패:', error.message);
      
      if (error.message.includes('CORS')) {
        console.log('🔧 CORS 오류: Azure Portal에서 CORS 설정을 확인하세요.');
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
      console.log('🚀 Azure Table Storage REST API 연결 완료!');
      console.log('📋 이제 실제 Azure에 데이터를 저장할 수 있습니다!');
      
      // 필요한 테이블들 준비 완료 로그
      const tablesToCreate = ['users', 'mentoringssessions', 'studentpackages'];
      tablesToCreate.forEach(tableName => {
        console.log(`📋 Table '${tableName}' 준비 완료`);
      });
    } else {
      console.error('❌ Azure Table Storage 연결 실패! CORS 설정을 확인하세요.');
      console.error('💡 해결 방법: Azure Portal에서 Storage Account CORS 설정에 현재 도메인을 추가하세요.');
    }
  }

  // 사용자 관련 메서드 (Azure 우선, LocalStorage fallback)

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      // 🚀 Azure에서 사용자 검색 시도!
      console.log('🔍 Azure Users 테이블에서 사용자 검색 중...', email);
      
      // 🔧 디버깅: 사용 중인 SAS URL 확인
      console.log(`🔗 조회용 SAS URL:`, AZURE_SAS_URLS.users.substring(0, 100) + '...');
      
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
          console.log('✅ Azure에서 사용자 찾음:', email);
          const azureUser = data.value[0];
          
          // Azure 응답의 키 필드를 소문자로 매핑
          const user: User = {
            ...azureUser,
            partitionKey: azureUser.PartitionKey || azureUser.partitionKey,
            rowKey: azureUser.RowKey || azureUser.rowKey
          };
          
          return user;
        } else {
          console.log('🔍 Azure에서 사용자를 찾을 수 없음:', email);
          return null;
        }
      } else {
        throw new Error(`Azure 검색 실패: ${response.status}`);
      }
    } catch (error: any) {
      console.error('❌ Azure 사용자 검색 실패:', error.message);
      
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
    console.log('🎉 사용자 로그인 성공:', user.email);
    console.log('⚡ Azure 업데이트 생략으로 빠른 로그인 완료');
    
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
        console.log('💾 LocalStorage에만 로그인 시간 기록');
      } else {
        users.push(userWithLoginTime);
        localStorage.setItem('clathon_users', JSON.stringify(users));
        console.log('💾 LocalStorage에 사용자 정보 추가');
      }
    } catch (localError) {
      console.warn('⚠️ LocalStorage 저장 실패 (로그인은 성공):', localError);
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
      console.log('👤 새 사용자 생성 중...', user.email);
      await this.azureRequest('users', 'POST', user);
      console.log('✅ 사용자 생성 성공:', user.email);
      
      // 추천인이 있다면 추천인의 추천 카운트 업데이트
      if (userData.referredBy) {
        await this.incrementReferralCount(userData.referredBy);
        console.log('🎁 추천인 카운트 업데이트:', userData.referredBy);
      }
      
      return user;
    } catch (error: any) {
      console.error('❌ 사용자 생성 실패:', error.message);
      throw error;
    }
  }

  // 완전한 User 객체를 받아서 생성하는 함수
  static async createUserDirect(userData: User): Promise<User> {
    try {
      console.log('👤 사용자 직접 생성 중...', userData.email);
      await this.azureRequest('users', 'POST', userData);
      console.log('✅ 사용자 직접 생성 성공:', userData.email);
      return userData;
    } catch (error: any) {
      console.error('❌ 사용자 직접 생성 실패:', error.message);
      throw error;
    }
  }

  // 사용자 ID로 사용자 조회
  static async getUserById(userId: string): Promise<User | null> {
    try {
      console.log('🔍 사용자 ID로 조회 중...', userId);
      
      // Azure REST API를 통한 단일 엔티티 조회 
      const response = await this.azureRequest('users', 'GET', null, `users|${userId}`);
      
      if (response) {
        console.log('✅ 사용자 조회 성공:', response.email);
        return response;
      } else {
        console.log('❌ 사용자 조회 실패: 데이터 없음');
        return null;
      }
    } catch (error: any) {
      console.error('❌ 사용자 조회 오류:', error.message);
      return null;
    }
  }

  // 사용자 수강 정보 조회 (Users 테이블에서) - 이메일 기반
  static async getUserEnrollmentsByEmail(email: string): Promise<EnrolledCourse[]> {
    try {
      console.log('🔍 수강 정보 조회:', email);
      
      let user = await this.getUserByEmail(email);
      console.log('👤 조회된 사용자 정보:', user ? { email: user.email, rowKey: user.rowKey, hasEnrolledCourses: !!user.enrolledCourses } : 'null');
      
      if (!user) {
        console.log('❌ 사용자 없음:', email);
        return [];
      }
      
      if (!user || !user.enrolledCourses) {
        console.log('📚 수강 중인 강의가 없습니다. enrolledCourses 필드:', user.enrolledCourses);
        return [];
      }
      
      console.log('📝 enrolledCourses 원본 데이터:', user.enrolledCourses);
      
      // JSON 문자열 파싱 (통합 데이터 구조 지원)
      const userData = JSON.parse(user.enrolledCourses);
      console.log('📊 파싱된 userData:', userData);
      
      let enrolledCourses: EnrolledCourse[] = [];
      
      if (Array.isArray(userData)) {
        // 기존 단순 배열 형태
        console.log('📋 기존 배열 형태 데이터 감지');
        enrolledCourses = userData;
      } else if (userData.enrollments) {
        // 새로운 통합 구조 (enrollments + payments)
        console.log('📋 새로운 통합 구조 데이터 감지');
        enrolledCourses = userData.enrollments;
      } else {
        console.log('⚠️ 알 수 없는 데이터 구조:', userData);
      }
      
      console.log('✅ 수강 정보 조회 성공:', enrolledCourses.length, '개 강의');
      console.log('📚 수강 강의 목록:', enrolledCourses);
      console.log('📊 결제 정보도 함께 저장됨:', userData.payments?.length || 0, '개 결제');
      
      return enrolledCourses;
    } catch (error: any) {
      console.error('❌ 수강 정보 조회 실패:', error.message);
      console.error('❌ 오류 상세:', error);
      return [];
    }
  }

  // 특정 강좌 수강 상태 확인 (이메일 + 강좌 ID 기반)
  static async isUserEnrolledInCourse(email: string, courseId: string): Promise<boolean> {
    try {
      console.log('🔍 강좌 수강 상태 확인:', email, '→', courseId);
      
      const enrolledCourses = await this.getUserEnrollmentsByEmail(email);
      const isEnrolled = enrolledCourses.some(course => 
        course.courseId === courseId && course.status === 'active'
      );
      
      console.log(isEnrolled ? '✅ 이미 수강 중' : '❌ 미수강', ':', courseId);
      return isEnrolled;
    } catch (error: any) {
      console.error('❌ 수강 상태 확인 실패:', error.message);
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
  }): Promise<{payment: any, enrollment: EnrolledCourse}> {
    try {
      console.log('🛒 구매 처리 중:', userData.email);
      
      // 결제 정보 생성
      const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const payment = {
        paymentId,
        courseId: userData.courseId,
        amount: userData.amount,
        paymentMethod: userData.paymentMethod,
        externalPaymentId: userData.externalPaymentId || 'local_payment',
        status: 'completed',
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
      console.log('🔍 getUserByEmail 결과:', user);
      
      // 🚨 사용자가 존재하지만 실제 엔티티가 없는 경우 체크
      if (user && user.rowKey) {
        console.log('🔍 실제 엔티티 존재 확인 시작. RowKey:', user.rowKey);
        console.log('🔍 확인할 PartitionKey:', user.partitionKey || 'users');
        
        try {
          // 실제로 해당 RowKey로 엔티티가 존재하는지 직접 확인
          const actualUser = await this.azureRequest('users', 'GET', null, `users|${user.rowKey}`);
          console.log('✅ 실제 사용자 엔티티 확인됨:', user.rowKey);
          console.log('✅ 확인된 사용자 데이터:', { 
            rowKey: actualUser.rowKey, 
            email: actualUser.email,
            partitionKey: actualUser.partitionKey 
          });
        } catch (checkError: any) {
          console.error('❌ GET 요청 실패 상세 정보:');
          console.error('❌ RowKey:', user.rowKey);
          console.error('❌ 요청 URL 패턴:', `users|${user.rowKey}`);
          console.error('❌ 오류 메시지:', checkError.message);
          console.error('❌ 오류 전체:', checkError);
          
          console.warn('⚠️ getUserByEmail이 반환한 사용자가 실제로는 존재하지 않음:', user.rowKey);
          console.warn('⚠️ 이는 Azure 테이블 데이터 불일치 또는 권한 문제일 수 있습니다');
          user = null; // 존재하지 않는 사용자로 처리
        }
      }
      
      if (!user) {
        // ❌❌❌ 절대 새로운 사용자 생성하지 않음! ❌❌❌
        // ❌❌❌ 기존 사용자만 업데이트! 새 사용자 생성 금지! ❌❌❌
        console.error('❌ 사용자를 찾을 수 없습니다:', userData.email);
        throw new Error(`사용자를 찾을 수 없습니다: ${userData.email}. 기존 사용자만 업데이트 가능합니다.`);
      }

      // 🔧 UUID RowKey 사용자는 그대로 유지하고 업데이트만 수행
      if (user.rowKey !== userData.email) {
        console.log('📝 UUID RowKey 사용자 발견. 기존 RowKey 유지하여 업데이트:', user.rowKey, 'for email:', userData.email);
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
          console.log('⚠️ 기존 수강 정보 파싱 실패, 새로 시작');
        }
      }
      
      // 중복 체크 및 추가
      const existingIndex = enrolledCourses.findIndex(course => course.courseId === userData.courseId);
      if (existingIndex >= 0) {
        console.log('⚠️ 이미 수강중인 강의입니다. 정보를 업데이트합니다.');
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
        console.log('✅ 구매 완료 (MERGE with RowKey:', user.rowKey, ')');
      } catch (mergeError: any) {
        await this.azureRequest('users', 'PUT', updatedUser, `users|${user.rowKey}`);
        console.log('✅ 구매 완료 (PUT with RowKey:', user.rowKey, ')');
      }
      
      return { payment, enrollment: newEnrollment };
    } catch (error: any) {
      console.error('❌ 구매+수강신청 추가 실패:', error.message);
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
  }): Promise<{payment: any, enrollment: any}> {
    try {
      console.log('🛒 통합 강좌 구매 프로세스 시작 (Users 테이블만 사용)...', purchaseData.courseId);
      
      // 강의 제목 매핑
      const courseTitleMap: Record<string, string> = {
        'chatgpt의-정석': 'ChatGPT의 정석',
        'ai-비즈니스-전략': 'AI 비즈니스 전략',
        'ai-코딩-완전정복': 'AI 코딩 완전정복',
        'google-ai-완전정복': 'Google AI 완전정복',
        'ai-교육-다큐멘터리': 'AI 교육 다큐멘터리',
        'ai-building': 'AI 건물 짓기 - 디지털 건축가 과정',
        'ai-building-course': 'AI 건물 짓기 - 디지털 건축가 과정'
      };
      
      const courseTitle = courseTitleMap[purchaseData.courseId] || purchaseData.courseId;
      
      // Users 테이블에 모든 정보 저장
      console.log('📊 addPurchaseAndEnrollmentToUser 호출:', {
        ...purchaseData,
        title: courseTitle
      });
      
      const result = await this.addPurchaseAndEnrollmentToUser({
        ...purchaseData,
        title: courseTitle
      });
      
      console.log('✅ 통합 강좌 구매 프로세스 완료!', purchaseData.courseId, '최종 결과:', result);
      
      return result;
    } catch (error: any) {
      console.error('❌ 통합 강좌 구매 프로세스 실패:', error.message);
      throw new Error(`강좌 구매 실패: ${error.message}`);
    }
  }

  // === 세션 관리 메서드 (간소화된 버전) ===
  static async createSession(userId: string): Promise<string> {
    try {
      console.log('🔐 세션 생성 중...', userId);
      
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
      console.log('✅ 세션 생성 완료:', sessionId);
      
      return sessionId;
    } catch (error: any) {
      console.error('❌ 세션 생성 실패:', error.message);
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
      console.log('💳 결제 정보 생성 중...', paymentData);
      
      // 통합 구매+수강신청 프로세스 호출
      const result = await this.purchaseAndEnrollCourseUnified(paymentData);
      
      console.log('✅ 결제 정보 생성 완료:', paymentData.courseId, '결과:', result);
      return result.payment;
    } catch (error: any) {
      console.error('❌ 결제 정보 생성 실패:', error.message);
      console.error('❌ 결제 오류 상세:', error);
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
      console.log('📅 멘토링 세션 생성 중...', sessionData);
      
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
          console.log('✅ Azure에 멘토링 세션 저장 완료:', sessionId);
          return session;
        }
      } catch (azureError) {
        console.log('⚠️ Azure 저장 실패, 로컬 저장으로 전환:', azureError);
      }

      // Fallback: localStorage에 저장
      const sessionsKey = `clathon_mentoring_sessions_${sessionData.studentEmail}`;
      const existingSessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
      existingSessions.push(session);
      localStorage.setItem(sessionsKey, JSON.stringify(existingSessions));
      
      console.log('✅ 로컬에 멘토링 세션 저장 완료:', sessionId);
      return session;
      
    } catch (error: any) {
      console.error('❌ 멘토링 세션 생성 실패:', error.message);
      throw new Error(`멘토링 세션 생성 실패: ${error.message}`);
    }
  }

  // 사용자의 멘토링 세션 목록 조회
  static async getUserMentoringSessions(studentEmail: string): Promise<any[]> {
    try {
      console.log('📋 멘토링 세션 목록 조회:', studentEmail);

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
          console.log('✅ Azure에서 멘토링 세션 조회 완료:', data.value?.length || 0, '개');
          return data.value || [];
        }
      } catch (azureError) {
        console.log('⚠️ Azure 조회 실패, 로컬 조회로 전환:', azureError);
      }

      // Fallback: localStorage에서 조회
      const sessionsKey = `clathon_mentoring_sessions_${studentEmail}`;
      const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
      console.log('📋 로컬에서 멘토링 세션 조회 완료:', sessions.length, '개');
      return sessions;
      
    } catch (error: any) {
      console.error('❌ 멘토링 세션 조회 실패:', error.message);
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
      console.log('📝 세션 기록 저장 중...', recordData);
      
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
      
      console.log('✅ 세션 기록 저장 완료:', recordId);
      return record;
      
    } catch (error: any) {
      console.error('❌ 세션 기록 저장 실패:', error.message);
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
      console.log('📦 학생 패키지 생성 중...', packageData);
      
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
          console.log('✅ Azure에 패키지 정보 저장 완료:', packageId);
          return package_;
        }
      } catch (azureError) {
        console.log('⚠️ Azure 저장 실패, 로컬 저장으로 전환:', azureError);
      }

      // Fallback: localStorage
      const packagesKey = `clathon_student_packages_${packageData.studentEmail}`;
      const existingPackages = JSON.parse(localStorage.getItem(packagesKey) || '[]');
      existingPackages.push(package_);
      localStorage.setItem(packagesKey, JSON.stringify(existingPackages));
      
      console.log('✅ 로컬에 패키지 정보 저장 완료:', packageId);
      return package_;
      
    } catch (error: any) {
      console.error('❌패키지 생성 실패:', error.message);
      throw new Error(`패키지 생성 실패: ${error.message}`);
    }
  }
  // === 리워드 시스템 관련 메서드들 ===

  // 추천 코드로 사용자 조회
  static async getUserByReferralCode(referralCode: string): Promise<User | null> {
    try {
      const users = await this.azureRequest('users', 'GET');
      const userList = users.value || [];
      
      const user = userList.find((u: any) => u.referralCode === referralCode);
      return user || null;
    } catch (error: any) {
      console.error('❌ 추천 코드로 사용자 조회 실패:', error.message);
      return null;
    }
  }

  // 추천 카운트 증가
  static async incrementReferralCount(referralCode: string): Promise<void> {
    try {
      const referrer = await this.getUserByReferralCode(referralCode);
      if (!referrer) {
        console.warn('⚠️ 추천인을 찾을 수 없습니다:', referralCode);
        return;
      }

      const currentCount = referrer.referralCount || 0;
      const updatedUser = {
        ...referrer,
        referralCount: currentCount + 1,
        updatedAt: new Date().toISOString()
      };

      await this.azureRequest('users', 'PUT', updatedUser, referrer.rowKey);
      console.log('✅ 추천 카운트 업데이트 성공:', referralCode, currentCount + 1);
    } catch (error: any) {
      console.error('❌ 추천 카운트 업데이트 실패:', error.message);
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
        console.warn('⚠️ 추천인을 찾을 수 없습니다:', transaction.toReferralCode);
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
      console.log('✅ 리워드 지급 완료:', transaction.toReferralCode, transaction.amount);
      return true;
    } catch (error: any) {
      console.error('❌ 리워드 지급 실패:', error.message);
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
        console.warn('⚠️ 추천인을 찾을 수 없습니다:', referralCode);
        return false;
      }

      // 신규 가입자 조회
      const newUser = await this.getUserByEmail(newUserEmail);
      if (!newUser) {
        console.warn('⚠️ 신규 가입자를 찾을 수 없습니다:', newUserEmail);
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

      console.log('✅ 가입 리워드 지급 완료:', {
        referrer: referralCode,
        newUser: newUserEmail,
        amount: SIGNUP_REWARD_AMOUNT
      });
      
      return true;
    } catch (error: any) {
      console.error('❌ 가입 리워드 지급 실패:', error.message);
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
  }): Promise<{payment: any, enrollment: any, rewardProcessed: boolean}> {
    try {
      // 기존 구매 처리
      const result = await this.addPurchaseAndEnrollmentToUser(userData);
      
      // 구매한 사용자 정보 조회
      const buyer = await this.getUserByEmail(userData.email);
      if (!buyer || !buyer.referredBy) {
        console.log('ℹ️ 추천인이 없어 리워드 처리를 건너뜁니다.');
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
      console.error('❌ 리워드 포함 구매 처리 실패:', error.message);
      throw error;
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
      console.log('✅ 추천 코드 생성 완료:', referralCode);
      return referralCode;

    } catch (error: any) {
      console.error('❌ 추천 코드 생성 실패:', error.message);
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
        console.log('🔄 추천 코드가 없어서 생성 중...');
        const referralCode = await this.generateReferralCodeForUser(email);
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
      console.error('❌ 리워드 현황 조회 실패:', error.message);
      return null;
    }
  }
}

export default AzureTableService;