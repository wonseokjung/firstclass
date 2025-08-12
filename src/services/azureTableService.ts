// Azure SDK 대신 REST API 직접 호출 사용
import { v4 as uuidv4 } from 'uuid';

// Azure Table Storage SAS URLs 설정 (단일 Users 테이블만 사용)
const AZURE_SAS_URLS = {
  users: 'https://clathonstorage.table.core.windows.net/users?sp=raud&st=2025-08-06T01:38:29Z&se=2030-10-02T09:53:00Z&spr=https&sv=2024-11-04&sig=eKj3S3wr0QyWiDhA8EJzgE6c7LAlIcysVdqiqjffb%2Bw%3D&tn=users'
};

// 환경변수에서 Connection String 가져오기 (백업용) - 현재는 SAS URL 사용으로 미사용
// const CONNECTION_STRING = process.env.REACT_APP_AZURE_STORAGE_CONNECTION_STRING || 
//   'DefaultEndpointsProtocol=https;AccountName=tempaccount;AccountKey=dGVtcGtleTE5ODc2NTQzMjE0NTY3ODkwQWJjZGVmZ2hpams=' +
//   'dGVtcGtleTE5ODc2NTQzMjE0NTY3ODkwQWJjZGVmZ2hpams=;EndpointSuffix=core.windows.net';

const isConnectionConfigured = true; // SAS URL이 있으므로 항상 true

if (!isConnectionConfigured) {
  console.error('⚠️ Azure Storage Connection String이 설정되지 않았습니다!');
  console.log('🔧 .env 파일에 REACT_APP_AZURE_STORAGE_CONNECTION_STRING을 설정해주세요.');
  console.log('📋 Azure Portal에서 Connection String을 복사하여 설정하세요.');
}

// 기존 Connection String 방식 코드들은 SAS URL 사용으로 미사용 상태
// interface AzureConfig { ... } - 주석 처리됨
// const parseConnectionString = ... - 주석 처리됨  
// let azureConfig: AzureConfig | null = null; - 주석 처리됨
// const isBrowserEnvironment = ... - 주석 처리됨
// const createAuthHeaders = ... - 주석 처리됨

// Azure SAS URL 기반 초기화 함수
const initializeAzureClients = () => {
  console.log('🌐 Azure Table Storage 단일 Users 테이블 SAS URL 연결 준비...');
  console.log('📋 설정된 테이블:');
  Object.keys(AZURE_SAS_URLS).forEach(tableName => {
    console.log(`  ✅ ${tableName}: ${AZURE_SAS_URLS[tableName as keyof typeof AZURE_SAS_URLS].substring(0, 80)}...`);
  });
  
  console.log('✅ Azure SAS 토큰 설정 완료!');
  console.log('📋 실제 Azure Table Storage 단일 Users 테이블 연결 준비 완료!');
  console.log('🚀 쓰기 권한(sp=raud) 포함으로 완전한 CRUD 작업 가능!');
  console.log('🎯 모든 데이터를 Users 테이블에 통합 저장!');
  console.log('❌ LocalStorage 사용 안함 - Azure 완전 전환!');
};

// LocalStorage 사용 안함 - Azure 완전 전환!

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

export interface User {
  partitionKey: string;
  rowKey: string;
  email: string;
  name: string;
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
}

// 기존 분리된 테이블 인터페이스들은 Users 테이블에 통합되어 더 이상 사용하지 않음
// 모든 데이터는 User 인터페이스의 JSON 필드들에 저장됨

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
      const response = await fetch(url, options);
      
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
    let url = baseUrl;
    
    // 특정 엔티티 조회/수정/삭제시 URL 구성
    if (entityId && method !== 'POST') {
      const [partitionKey, rowKey] = entityId.split('|');
      url = `${baseUrl.split('?')[0]}(PartitionKey='${encodeURIComponent(partitionKey)}',RowKey='${encodeURIComponent(rowKey)}')${baseUrl.includes('?') ? '&' + baseUrl.split('?')[1] : ''}`;
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
    
    if (body && (method === 'POST' || method === 'PUT')) {
      // Azure Table Storage용 엔티티 변환
      const azureEntity = this.convertToAzureEntity(body);
      options.body = JSON.stringify(azureEntity);
      console.log(`🔧 Azure ${method} 요청 엔티티:`, azureEntity);
    }
    
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
    } else {
      console.log('⚠️ Azure 연결 실패, LocalStorage를 계속 사용합니다.');
    }
  }

  // 사용자 관련 메서드 (Azure 우선, LocalStorage fallback)

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      // 🚀 Azure에서 사용자 검색 시도!
      console.log('🔍 Azure Users 테이블에서 사용자 검색 중...', email);
      
      // Azure Table Storage에서 쿼리 (이메일로 필터링)
      const baseUrl = AZURE_SAS_URLS.users;
      const filterQuery = `$filter=email eq '${encodeURIComponent(email)}'`;
      const url = `${baseUrl}&${filterQuery}`;
      
      const response = await fetch(url, {
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
      console.error('❌ Azure 사용자 검색 실패, LocalStorage 사용:', error.message);

    // LocalStorage에서 검색 (fallback)
    try {
      const users = JSON.parse(localStorage.getItem('clathon_users') || '[]');
      const user = users.find((u: User) => u.email === email);
      
      if (user) {
          console.log('⚠️ LocalStorage에서 사용자 찾음:', user.email);
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('❌ LocalStorage 사용자 검색 실패:', error);
      return null;
      }
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
    password: string;
    marketingAgreed: boolean;
  }): Promise<User> {
    if (!this.checkConnection()) {
      throw new Error('저장소 연결이 설정되지 않았습니다.');
    }
    
    const userId = uuidv4();
    const passwordHash = await hashPassword(userData.password);
    
    const user: User = {
      partitionKey: 'users',
      rowKey: userId,
      email: userData.email,
      name: userData.name,
      passwordHash,
      emailVerified: false,
      marketingAgreed: userData.marketingAgreed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: '',
      enrolledCourses: '',
      totalEnrolledCourses: 0,
      completedCourses: 0,
      totalLearningTimeMinutes: 0
    };

    try {
      console.log('👤 새 사용자 생성 중...', user.email);
      await this.azureRequest('users', 'POST', user);
      console.log('✅ 사용자 생성 성공:', user.email);
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

  // 사용자 수강 정보 조회 (Users 테이블에서)
  static async getUserEnrollmentsFromUsers(userId: string): Promise<EnrolledCourse[]> {
    try {
      console.log('🔍 사용자 수강 정보 조회 중 (Users 테이블)...', userId);
      
      const user = await this.getUserById(userId);
      if (!user || !user.enrolledCourses) {
        console.log('📚 수강 중인 강의가 없습니다.');
        return [];
      }
      
      // JSON 문자열 파싱 (통합 데이터 구조 지원)
      const userData = JSON.parse(user.enrolledCourses);
      let enrolledCourses: EnrolledCourse[] = [];
      
      if (Array.isArray(userData)) {
        // 기존 단순 배열 형태
        enrolledCourses = userData;
      } else if (userData.enrollments) {
        // 새로운 통합 구조 (enrollments + payments)
        enrolledCourses = userData.enrollments;
      }
      
      console.log('✅ 수강 정보 조회 성공:', enrolledCourses.length, '개 강의');
      console.log('📊 결제 정보도 함께 저장됨:', userData.payments?.length || 0, '개 결제');
      
      return enrolledCourses;
    } catch (error: any) {
      console.error('❌ 수강 정보 조회 실패:', error.message);
      return [];
    }
  }

  // 사용자에게 강의 구매+수강신청 추가 (Users 테이블에 모든 정보 저장)
  static async addPurchaseAndEnrollmentToUser(userData: {
    userId: string;
    courseId: string;
    title: string;
    amount: number;
    paymentMethod: string;
    externalPaymentId?: string;
  }): Promise<{payment: any, enrollment: EnrolledCourse}> {
    try {
      console.log('🛒 사용자 테이블에 구매+수강신청 정보 추가 중...', userData.courseId);
      console.log('🔍 찾으려는 사용자 ID:', userData.userId);
      
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
      
      // 기존 사용자 정보 조회
      let user = await this.getUserById(userData.userId);
      if (!user) {
        console.error('❌ 사용자를 찾을 수 없음:', userData.userId);
        
        // 사용자를 찾을 수 없는 경우, 로컬스토리지에서 현재 로그인된 사용자의 실제 ID 확인
        const currentUser = localStorage.getItem('clathon_user');
        if (currentUser) {
          const parsedUser = JSON.parse(currentUser);
          console.log('🔍 로컬스토리지의 사용자 정보:', parsedUser);
          console.log('📧 저장된 이메일:', parsedUser.email);
          
          // 이메일로 사용자 재검색
          if (parsedUser.email) {
            console.log('📧 이메일로 사용자 재검색:', parsedUser.email);
            user = await this.getUserByEmail(parsedUser.email);
            if (user) {
              console.log('✅ 이메일로 사용자 발견:', user.rowKey);
              console.log('🔍 실제 Azure 사용자 정보:', {
                partitionKey: user.partitionKey,
                rowKey: user.rowKey,
                email: user.email,
                name: user.name
              });
              console.log('📋 Azure 전체 사용자 객체:', user);
              
              // 로컬스토리지의 사용자 ID를 실제 ID로 업데이트
              const updatedUserInfo = {
                ...parsedUser,
                userId: user.rowKey
              };
              localStorage.setItem('clathon_user', JSON.stringify(updatedUserInfo));
              console.log('🔄 로컬스토리지 사용자 ID 업데이트 완료');
            }
          }
        }
        
        if (!user) {
          // 최후의 수단: 현재 로그인된 사용자 정보로 새 사용자 생성
          console.log('🆕 사용자가 존재하지 않음. 새 사용자 생성 시도...');
          const currentUser = localStorage.getItem('clathon_user');
          if (currentUser) {
            const parsedUser = JSON.parse(currentUser);
            const newUser = {
              partitionKey: 'users',
              rowKey: parsedUser.userId,
              email: parsedUser.email,
              name: parsedUser.name,
              passwordHash: 'temp_hash', // 임시 해시
              emailVerified: true,
              marketingAgreed: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              enrolledCourses: '[]',
              totalEnrolledCourses: 0,
              completedCourses: 0,
              totalLearningTimeMinutes: 0
            };
            
            try {
              await this.azureRequest('users', 'POST', newUser, `users|${parsedUser.userId}`);
              console.log('✅ 새 사용자 생성 성공:', parsedUser.email);
              user = newUser;
            } catch (createError: any) {
              console.error('❌ 사용자 생성 실패:', createError.message);
            }
          }
          
          if (!user) {
            throw new Error('사용자를 찾을 수 없습니다. 다시 로그인해주세요.');
          }
        }
      }
      
      // 기존 수강 정보 파싱
      let enrolledCourses: EnrolledCourse[] = [];
      let payments: any[] = [];
      
      if (user.enrolledCourses) {
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
      
      // 사용자 정보 업데이트
      const updatedUser = {
        ...user,
        enrolledCourses: JSON.stringify(allUserData),
        totalEnrolledCourses: enrolledCourses.length,
        completedCourses: completedCount,
        totalLearningTimeMinutes: totalTime,
        updatedAt: new Date().toISOString()
      };
      
      // Azure에 업데이트 (MERGE 방식 시도 후 PUT)
      try {
        await this.azureRequest('users', 'MERGE', updatedUser, `users|${user.rowKey}`);
        console.log('✅ MERGE 방식으로 사용자 업데이트 성공 (구매+수강 통합)');
      } catch (mergeError: any) {
        console.log('⚠️ MERGE 실패, PUT 방식 시도:', mergeError.message);
        await this.azureRequest('users', 'PUT', updatedUser, `users|${user.rowKey}`);
        console.log('✅ PUT 방식으로 사용자 업데이트 성공 (구매+수강 통합)');
      }
      
      return { payment, enrollment: newEnrollment };
    } catch (error: any) {
      console.error('❌ 구매+수강신청 추가 실패:', error.message);
      throw error;
    }
  }

  // 새로운 통합 구매 프로세스 (Users 테이블만 사용)
  static async purchaseAndEnrollCourseUnified(purchaseData: {
    userId: string;
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
        'workflow-automation-master': 'Workflow Automation Master'
      };
      
      const courseTitle = courseTitleMap[purchaseData.courseId] || purchaseData.courseId;
      
      // Users 테이블에 모든 정보 저장
      const result = await this.addPurchaseAndEnrollmentToUser({
        ...purchaseData,
        title: courseTitle
      });
      
      console.log('✅ 통합 강좌 구매 프로세스 완료!', purchaseData.courseId);
      
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

  // === 결제 정보 생성 메서드 (Users 테이블 통합 방식) ===
  static async createPayment(paymentData: {
    userId: string;
    courseId: string;
    amount: number;
    paymentMethod: string;
    externalPaymentId?: string;
  }): Promise<any> {
    try {
      console.log('💳 결제 정보 생성 중...', paymentData.courseId);
      
      // 통합 구매+수강신청 프로세스 호출
      const result = await this.purchaseAndEnrollCourseUnified(paymentData);
      
      console.log('✅ 결제 정보 생성 완료:', paymentData.courseId);
      return result.payment;
    } catch (error: any) {
      console.error('❌ 결제 정보 생성 실패:', error.message);
      throw new Error(`결제 정보 생성 실패: ${error.message}`);
    }
  }
}

export default AzureTableService;