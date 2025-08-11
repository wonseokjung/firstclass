// Azure SDK 대신 REST API 직접 호출 사용
import { v4 as uuidv4 } from 'uuid';

// Azure Table Storage SAS URLs 설정 (모든 테이블)
const AZURE_SAS_URLS = {
  users: 'https://clathonstorage.table.core.windows.net/users?sp=raud&st=2025-08-06T01:38:29Z&se=2030-10-02T09:53:00Z&spr=https&sv=2024-11-04&sig=eKj3S3wr0QyWiDhA8EJzgE6c7LAlIcysVdqiqjffb%2Bw%3D&tn=users',
  courses: 'https://clathonstorage.table.core.windows.net/courses?sp=raud&st=2025-08-06T01:39:22Z&se=2029-06-05T09:54:00Z&spr=https&sv=2024-11-04&sig=j1%2FNcNopIo3415hYpRY5bqSMR33fg1AadNh2bQMNUuE%3D&tn=courses',
  payments: 'https://clathonstorage.table.core.windows.net/payments?sp=raud&st=2025-08-06T01:39:55Z&se=2029-10-06T09:54:00Z&spr=https&sv=2024-11-04&sig=nwK6qacO00MBEDiscjsz4Cd%2FAUMSSJ6Lyy4bodsmdk0%3D&tn=payments',
  enrollments: 'https://clathonstorage.table.core.windows.net/enrollments?sp=raud&st=2025-08-06T01:40:51Z&se=2029-11-06T09:55:00Z&spr=https&sv=2024-11-04&sig=MqVKIT%2FxFSx2bECNUEgm2VG%2FSYD4KVdBzFKtApATsRU%3D&tn=enrollments',
  sessions: 'https://clathonstorage.table.core.windows.net/sessions?sp=raud&st=2025-08-06T01:41:39Z&se=2032-07-08T09:56:00Z&spr=https&sv=2024-11-04&sig=KRQcJlFcV4oYI7XbvCe%2FacE9R%2Fi%2Fm3UCLOjWDK2iZcI%3D&tn=sessions',
  test: 'https://clathonstorage.table.core.windows.net/test?sp=r&st=2025-08-05T09:07:41Z&se=2029-01-05T17:22:00Z&spr=https&sv=2024-11-04&sig=4UxjbdBZ6wEc4EmLkhrgd3damrkUFDK0367ateKhuTI%3D&tn=test',
  // 단일 테이블 접근법을 위한 통합 테이블 (문제 해결 시 활성화 예정)
  clathon: 'https://clathonstorage.table.core.windows.net/users?sp=raud&st=2025-08-06T01:38:29Z&se=2030-10-02T09:53:00Z&spr=https&sv=2024-11-04&sig=eKj3S3wr0QyWiDhA8EJzgE6c7LAlIcysVdqiqjffb%2Bw%3D&tn=users'
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
  console.log('🌐 Azure Table Storage 다중 테이블 SAS URL 연결 준비...');
  console.log('📋 설정된 테이블들:');
  Object.keys(AZURE_SAS_URLS).forEach(tableName => {
    console.log(`  ✅ ${tableName}: ${AZURE_SAS_URLS[tableName as keyof typeof AZURE_SAS_URLS].substring(0, 80)}...`);
  });
  
  console.log('✅ 모든 Azure SAS 토큰 설정 완료!');
  console.log('📋 실제 Azure Table Storage 다중 테이블 연결 준비 완료!');
  console.log('🚀 쓰기 권한(sp=raud) 포함으로 완전한 CRUD 작업 가능!');
  
  // LocalStorage도 백업용으로 초기화
  initializeLocalStorage();
};

// LocalStorage 초기화 함수
const initializeLocalStorage = () => {
  const tables = ['users', 'courses', 'payments', 'enrollments', 'sessions'];
  
  tables.forEach(table => {
    const key = `clathon_${table}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify([]));
    }
  });
  
  console.log('✅ LocalStorage 백업 데이터 구조 초기화 완료');
  console.log('📋 초기화된 테이블:', tables.map(t => `clathon_${t}`).join(', '));
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
}

export interface Course {
  partitionKey: string; // 'courses'
  rowKey: string;       // courseId
  title: string;
  description: string;
  price: number;
  instructor: string;
  startDate: string;    // 개강일
  endDate: string;      // 마감일 (3개월 후)
  status: 'recruiting' | 'ongoing' | 'completed' | 'cancelled';
  maxStudents: number; // optional 제거
  currentStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  partitionKey: string; // userId
  rowKey: string;       // paymentId
  courseId: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDate: string;
  refundDate: string; // optional 제거
  refundReason: string; // optional 제거
  externalPaymentId: string; // optional 제거
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  partitionKey: string; // userId
  rowKey: string;       // courseId
  paymentId: string;    // 관련 결제 정보
  enrolledAt: string;
  status: 'active' | 'completed' | 'paused' | 'expired';
  progress: number;
  accessExpiresAt: string; // 수강 권한 만료일 (결제일 + 3개월)
  lastAccessedAt: string; // optional 제거
  completedAt: string; // optional 제거
}

export interface UserSession {
  partitionKey: string; // userId
  rowKey: string;       // sessionId
  expiresAt: string;
  createdAt: string;
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
      'Content-Type': 'application/json',
    };
    
    // PUT/DELETE 작업시만 If-Match 헤더 추가 (POST에는 사용하지 않음)
    if (method === 'PUT') {
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

  // Azure SAS URL을 사용한 테스트 함수 (모든 테이블)
  static async testAzureConnection(): Promise<boolean> {
    try {
      console.log('🧪 Azure Table Storage 다중 테이블 SAS URL 테스트 시작...');
      
      const headers = {
        'Accept': 'application/json;odata=fullmetadata',
        'Content-Type': 'application/json',
      };
      
      let allTablesSuccess = true;
      const results: Record<string, boolean> = {};
      
      // 모든 테이블 연결 테스트
      for (const [tableName, sasUrl] of Object.entries(AZURE_SAS_URLS)) {
        try {
          console.log(`🔗 ${tableName} 테이블 테스트 중...`);
          
          const response = await fetch(sasUrl, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
      });
      
      if (response.ok) {
            await response.json(); // 데이터 읽기만 하고 사용하지 않음
            console.log(`✅ ${tableName} 테이블 연결 성공! (상태: ${response.status})`);
            results[tableName] = true;
      } else {
            console.log(`❌ ${tableName} 테이블 연결 실패 (상태: ${response.status})`);
            results[tableName] = false;
            allTablesSuccess = false;
          }
        } catch (error: any) {
          console.error(`❌ ${tableName} 테이블 연결 오류:`, error.message);
          results[tableName] = false;
          allTablesSuccess = false;
        }
      }
      
      // 결과 요약
      console.log('📊 Azure 테이블 연결 테스트 결과:');
      Object.entries(results).forEach(([table, success]) => {
        console.log(`  ${success ? '✅' : '❌'} ${table}: ${success ? '성공' : '실패'}`);
      });
      
      if (allTablesSuccess) {
        console.log('🎉 모든 Azure Table Storage 연결 성공!');
        console.log('🚀 쓰기 권한(sp=raud) 포함으로 완전한 CRUD 작업 준비 완료!');
      } else {
        console.log('⚠️ 일부 테이블 연결에 문제가 있습니다.');
      }
      
      return allTablesSuccess;
      
    } catch (error: any) {
      console.error('❌ Azure 다중 테이블 연결 테스트 실패:', error.message);
      
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
      lastLoginAt: '' // 빈 문자열로 초기화 (Azure는 undefined를 허용하지 않음)
    };

    try {
      // 🚀 Azure에 사용자 생성 시도!
      console.log('🚀 Azure Users 테이블에 사용자 생성 중...', user.email);
      await this.azureRequest('users', 'POST', user);
      console.log('✅ Azure에 사용자 생성 성공!', user.email);
      return user;
    } catch (error: any) {
      console.error('❌ Azure 사용자 생성 실패, LocalStorage 사용:', error.message);

    // LocalStorage에 저장 (fallback)
    const users = JSON.parse(localStorage.getItem('clathon_users') || '[]');
    users.push(user);
    localStorage.setItem('clathon_users', JSON.stringify(users));
      console.log('⚠️ LocalStorage에 사용자 생성:', user.email);
    return user;
    }
  }

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
          return data.value[0] as User;
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

    // 🚀 마지막 로그인 시간 업데이트 (Azure 시도)
    const updateTime = new Date().toISOString();
    
    try {
      const updatedUser = {
        ...user,
        lastLoginAt: updateTime,
        updatedAt: updateTime
      };
      
      const entityId = `${user.partitionKey}|${user.rowKey}`;
      await this.azureRequest('users', 'PUT', updatedUser, entityId);
      console.log('✅ Azure에서 로그인 시간 업데이트 성공');
      return updatedUser;
    } catch (error: any) {
      console.error('❌ Azure 로그인 시간 업데이트 실패, LocalStorage 사용:', error.message);

    // LocalStorage에서 사용자 정보 업데이트 (fallback)
    try {
      const users = JSON.parse(localStorage.getItem('clathon_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.email === email);
      if (userIndex !== -1) {
        users[userIndex].lastLoginAt = updateTime;
        users[userIndex].updatedAt = updateTime;
        localStorage.setItem('clathon_users', JSON.stringify(users));
          console.log('⚠️ LocalStorage에서 로그인 시간 업데이트');
          
          // 업데이트된 사용자 정보 반환
          const updatedUser = {
            ...user,
            lastLoginAt: updateTime,
            updatedAt: updateTime
          };
          return updatedUser;
      }
    } catch (error) {
      console.error('❌ LocalStorage 로그인 시간 업데이트 실패:', error);
      }
    }

    return user;
  }

  // === 강좌 관련 메서드 ===
  static async createCourse(courseData: {
    title: string;
    description: string;
    price: number;
    instructor: string;
    maxStudents?: number;
  }): Promise<Course> {
    if (!this.checkConnection()) {
      throw new Error('저장소 연결이 설정되지 않았습니다.');
    }

    const courseId = uuidv4();
    const now = new Date();
    const startDate = now.toISOString();
    const endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(); // 3개월 후

    const course: Course = {
      partitionKey: 'courses',
      rowKey: courseId,
      title: courseData.title,
      description: courseData.description,
      price: courseData.price,
      instructor: courseData.instructor,
      startDate,
      endDate,
      status: 'recruiting',
      maxStudents: courseData.maxStudents || 0, // undefined 대신 0
      currentStudents: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    try {
      console.log('🚀 Azure Courses 테이블에 강좌 생성 중...', course.title);
      await this.azureRequest('courses', 'POST', course);
      console.log('✅ Azure에 강좌 생성 성공!', course.title);
      return course;
    } catch (error: any) {
      console.error('❌ Azure 강좌 생성 실패, LocalStorage 사용:', error.message);
      
      // LocalStorage에 저장 (fallback)
      const courses = JSON.parse(localStorage.getItem('clathon_courses') || '[]');
      courses.push(course);
      localStorage.setItem('clathon_courses', JSON.stringify(courses));
      console.log('⚠️ LocalStorage에 강좌 생성:', course.title);
      return course;
    }
  }

  static async getAllCourses(): Promise<Course[]> {
    try {
      console.log('🔍 Azure Courses 테이블에서 모든 강좌 조회 중...');
      const data = await this.azureRequest('courses', 'GET');
      
      if (data.value && Array.isArray(data.value)) {
        console.log('✅ Azure에서 강좌 목록 조회 성공:', data.value.length);
        return data.value as Course[];
      }
      
      return [];
    } catch (error: any) {
      console.error('❌ Azure 강좌 조회 실패, LocalStorage 사용:', error.message);
      
      try {
        const courses = JSON.parse(localStorage.getItem('clathon_courses') || '[]');
        console.log('⚠️ LocalStorage에서 강좌 목록 조회:', courses.length);
        return courses as Course[];
      } catch (error) {
        console.error('❌ LocalStorage 강좌 조회 실패:', error);
        return [];
      }
    }
  }

  static async getCourseById(courseId: string): Promise<Course | null> {
    try {
      console.log('🔍 Azure Courses 테이블에서 강좌 조회 중...', courseId);
      const entityId = `courses|${courseId}`;
      const course = await this.azureRequest('courses', 'GET', undefined, entityId);
      
      if (course) {
        console.log('✅ Azure에서 강좌 찾음:', courseId);
        return course as Course;
      }
      
      return null;
    } catch (error: any) {
      console.error('❌ Azure 강좌 조회 실패, LocalStorage 사용:', error.message);
      
      try {
        const courses = JSON.parse(localStorage.getItem('clathon_courses') || '[]');
        const course = courses.find((c: Course) => c.rowKey === courseId);
        
        if (course) {
          console.log('⚠️ LocalStorage에서 강좌 찾음:', courseId);
          return course;
        }
        
        return null;
      } catch (error) {
        console.error('❌ LocalStorage 강좌 조회 실패:', error);
        return null;
      }
    }
  }

  // === 결제 관련 메서드 ===
  static async createPayment(paymentData: {
    userId: string;
    courseId: string;
    amount: number;
    paymentMethod: string;
    externalPaymentId?: string;
  }): Promise<Payment> {
    if (!this.checkConnection()) {
      throw new Error('저장소 연결이 설정되지 않았습니다.');
    }

    const paymentId = uuidv4();
    const payment: Payment = {
      partitionKey: paymentData.userId,
      rowKey: paymentId,
      courseId: paymentData.courseId,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      status: 'pending',
      paymentDate: new Date().toISOString(),
      refundDate: '', // 빈 문자열로 초기화
      refundReason: '', // 빈 문자열로 초기화
      externalPaymentId: paymentData.externalPaymentId || '', // 빈 문자열로 초기화
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      console.log('🚀 Azure Payments 테이블에 결제 정보 생성 중...', paymentId);
      await this.azureRequest('payments', 'POST', payment);
      console.log('✅ Azure에 결제 정보 생성 성공!', paymentId);
      return payment;
    } catch (error: any) {
      console.error('❌ Azure 결제 정보 생성 실패, LocalStorage 사용:', error.message);
      
      const payments = JSON.parse(localStorage.getItem('clathon_payments') || '[]');
      payments.push(payment);
      localStorage.setItem('clathon_payments', JSON.stringify(payments));
      console.log('⚠️ LocalStorage에 결제 정보 생성:', paymentId);
      return payment;
    }
  }

  static async updatePaymentStatus(paymentId: string, userId: string, status: Payment['status'], refundReason?: string): Promise<void> {
    try {
      console.log('🚀 Azure Payments 테이블에서 결제 상태 업데이트 중...', paymentId, status);
      
      // 먼저 결제 정보 조회
      const entityId = `${userId}|${paymentId}`;
      const payment = await this.azureRequest('payments', 'GET', undefined, entityId);
      
      if (payment) {
        const updatedPayment = {
          ...payment,
          status,
          refundDate: status === 'refunded' ? new Date().toISOString() : payment.refundDate,
          refundReason: refundReason || payment.refundReason,
          updatedAt: new Date().toISOString()
        };
        
        await this.azureRequest('payments', 'PUT', updatedPayment, entityId);
        console.log('✅ Azure에서 결제 상태 업데이트 성공:', paymentId, status);
      }
    } catch (error: any) {
      console.error('❌ Azure 결제 상태 업데이트 실패, LocalStorage 사용:', error.message);
      
      try {
        const payments = JSON.parse(localStorage.getItem('clathon_payments') || '[]');
        const paymentIndex = payments.findIndex((p: Payment) => 
          p.partitionKey === userId && p.rowKey === paymentId
        );
        
        if (paymentIndex !== -1) {
          payments[paymentIndex].status = status;
          if (status === 'refunded') {
            payments[paymentIndex].refundDate = new Date().toISOString();
            payments[paymentIndex].refundReason = refundReason;
          }
          payments[paymentIndex].updatedAt = new Date().toISOString();
          localStorage.setItem('clathon_payments', JSON.stringify(payments));
          console.log('⚠️ LocalStorage에서 결제 상태 업데이트:', paymentId, status);
        }
      } catch (error) {
        console.error('❌ LocalStorage 결제 상태 업데이트 실패:', error);
      }
    }
  }

  // === 수강신청 관련 메서드 ===
  static async createEnrollment(enrollmentData: {
    userId: string;
    courseId: string;
    paymentId: string;
  }): Promise<Enrollment> {
    if (!this.checkConnection()) {
      throw new Error('저장소 연결이 설정되지 않았습니다.');
    }

    const now = new Date();
    const accessExpiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 3개월 후

    const enrollment: Enrollment = {
      partitionKey: enrollmentData.userId,
      rowKey: enrollmentData.courseId,
      paymentId: enrollmentData.paymentId,
      enrolledAt: now.toISOString(),
      status: 'active',
      progress: 0,
      accessExpiresAt: accessExpiresAt.toISOString(),
      lastAccessedAt: '', // 빈 문자열로 초기화
      completedAt: '' // 빈 문자열로 초기화
    };

    try {
      console.log('🚀 Azure Enrollments 테이블에 수강신청 정보 생성 중...', enrollmentData.courseId);
      await this.azureRequest('enrollments', 'POST', enrollment);
      console.log('✅ Azure에 수강신청 정보 생성 성공!', enrollmentData.courseId);
      return enrollment;
    } catch (error: any) {
      console.error('❌ Azure 수강신청 정보 생성 실패, LocalStorage 사용:', error.message);
      
      const enrollments = JSON.parse(localStorage.getItem('clathon_enrollments') || '[]');
      enrollments.push(enrollment);
      localStorage.setItem('clathon_enrollments', JSON.stringify(enrollments));
      console.log('⚠️ LocalStorage에 수강신청 정보 생성:', enrollmentData.courseId);
      return enrollment;
    }
  }

  static async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    try {
      console.log('🔍 Azure Enrollments 테이블에서 사용자 수강 정보 조회 중...', userId);
      
      // 사용자별 수강신청 정보 조회
      const baseUrl = AZURE_SAS_URLS.enrollments;
      const filterQuery = `$filter=PartitionKey eq '${encodeURIComponent(userId)}'`;
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
        if (data.value && Array.isArray(data.value)) {
          console.log('✅ Azure에서 수강 정보 조회 성공:', data.value.length);
          return data.value as Enrollment[];
        }
      } else {
        throw new Error(`Azure 수강 정보 조회 실패: ${response.status}`);
      }
      
      return [];
    } catch (error: any) {
      console.error('❌ Azure 수강 정보 조회 실패, LocalStorage 사용:', error.message);
      
      try {
        const enrollments = JSON.parse(localStorage.getItem('clathon_enrollments') || '[]');
        const userEnrollments = enrollments.filter((e: Enrollment) => e.partitionKey === userId);
        console.log('⚠️ LocalStorage에서 수강 정보 조회:', userEnrollments.length);
        return userEnrollments;
      } catch (error) {
        console.error('❌ LocalStorage 수강 정보 조회 실패:', error);
        return [];
      }
    }
  }

  static async updateProgress(userId: string, courseId: string, progress: number): Promise<void> {
    const updateTime = new Date().toISOString();

    try {
      console.log('🚀 Azure Enrollments 테이블에서 진도 업데이트 중...', courseId, progress);
      
      // 먼저 수강신청 정보 조회
      const entityId = `${userId}|${courseId}`;
      const enrollment = await this.azureRequest('enrollments', 'GET', undefined, entityId);
      
      if (enrollment) {
        const updatedEnrollment = {
          ...enrollment,
          progress,
          lastAccessedAt: updateTime,
          completedAt: progress >= 100 ? updateTime : (enrollment.completedAt || ''),
          status: progress >= 100 ? 'completed' : enrollment.status
        };
        
        await this.azureRequest('enrollments', 'PUT', updatedEnrollment, entityId);
        console.log('✅ Azure에서 진도 업데이트 성공:', courseId, progress);
      }
    } catch (error: any) {
      console.error('❌ Azure 진도 업데이트 실패, LocalStorage 사용:', error.message);
      
      try {
        const enrollments = JSON.parse(localStorage.getItem('clathon_enrollments') || '[]');
        const enrollmentIndex = enrollments.findIndex((e: Enrollment) => 
          e.partitionKey === userId && e.rowKey === courseId
        );
        
        if (enrollmentIndex !== -1) {
          enrollments[enrollmentIndex].progress = progress;
          enrollments[enrollmentIndex].lastAccessedAt = updateTime;
          if (progress >= 100) {
            enrollments[enrollmentIndex].completedAt = updateTime;
            enrollments[enrollmentIndex].status = 'completed';
          } else {
            // 기존 completedAt 유지 또는 빈 문자열로 설정
            if (!enrollments[enrollmentIndex].completedAt) {
              enrollments[enrollmentIndex].completedAt = '';
            }
          }
          localStorage.setItem('clathon_enrollments', JSON.stringify(enrollments));
          console.log('⚠️ LocalStorage에서 진도 업데이트:', courseId, progress);
        }
      } catch (error) {
        console.error('❌ LocalStorage 진도 업데이트 실패:', error);
      }
    }
  }

  // === 세션 관련 메서드 ===
  static async createSession(userId: string): Promise<string> {
    const sessionId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7일 후 만료

    const session: UserSession = {
      partitionKey: userId,
      rowKey: sessionId,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString()
    };

    try {
      console.log('🚀 Azure Sessions 테이블에 세션 생성 중...', sessionId);
      await this.azureRequest('sessions', 'POST', session);
      console.log('✅ Azure에 세션 생성 성공!', sessionId);
      return sessionId;
    } catch (error: any) {
      console.error('❌ Azure 세션 생성 실패, LocalStorage 사용:', error.message);
      
    const sessions = JSON.parse(localStorage.getItem('clathon_sessions') || '[]');
    sessions.push(session);
    localStorage.setItem('clathon_sessions', JSON.stringify(sessions));
      console.log('⚠️ LocalStorage에 세션 생성:', sessionId);
    return sessionId;
    }
  }

  static async validateSession(userId: string, sessionId: string): Promise<boolean> {
    try {
      console.log('🔍 Azure Sessions 테이블에서 세션 검증 중...', sessionId);
      
      const entityId = `${userId}|${sessionId}`;
      const session = await this.azureRequest('sessions', 'GET', undefined, entityId);
      
      if (!session) {
        console.log('❌ Azure에서 세션을 찾을 수 없음:', sessionId);
        return false;
      }
      
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);
      
      const isValid = now < expiresAt;
      console.log(`✅ Azure 세션 유효성 검사:`, sessionId, isValid);
      return isValid;
    } catch (error: any) {
      console.error('❌ Azure 세션 검증 실패, LocalStorage 사용:', error.message);
      
    try {
      const sessions = JSON.parse(localStorage.getItem('clathon_sessions') || '[]');
      const session = sessions.find((s: UserSession) => 
        s.partitionKey === userId && s.rowKey === sessionId
      );
      
      if (!session) {
          console.log('❌ LocalStorage에서 세션을 찾을 수 없음:', sessionId);
        return false;
      }
      
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);
      
      const isValid = now < expiresAt;
        console.log(`⚠️ LocalStorage 세션 유효성 검사:`, sessionId, isValid);
      return isValid;
    } catch (error) {
      console.error('❌ LocalStorage 세션 유효성 검사 실패:', error);
      return false;
      }
    }
  }

  static async deleteSession(userId: string, sessionId: string): Promise<void> {
    try {
      console.log('🗑️ Azure Sessions 테이블에서 세션 삭제 중...', sessionId);
      
      const entityId = `${userId}|${sessionId}`;
      await this.azureRequest('sessions', 'DELETE', undefined, entityId);
      console.log('✅ Azure에서 세션 삭제 성공:', sessionId);
    } catch (error: any) {
      console.error('❌ Azure 세션 삭제 실패, LocalStorage 사용:', error.message);
      
    try {
      const sessions = JSON.parse(localStorage.getItem('clathon_sessions') || '[]');
      const filteredSessions = sessions.filter((s: UserSession) => 
        !(s.partitionKey === userId && s.rowKey === sessionId)
      );
      localStorage.setItem('clathon_sessions', JSON.stringify(filteredSessions));
        console.log('⚠️ LocalStorage에서 세션 삭제:', sessionId);
    } catch (error) {
      console.error('❌ LocalStorage 세션 삭제 실패:', error);
    }
  }
  }

  // === 통합 비즈니스 로직 메서드 ===
  
  // 강좌 구매 + 수강신청 프로세스
  static async purchaseAndEnrollCourse(userData: {
    userId: string;
    courseId: string;
    amount: number;
    paymentMethod: string;
    externalPaymentId?: string;
  }): Promise<{ payment: Payment; enrollment: Enrollment }> {
    console.log('🛒 강좌 구매 및 수강신청 프로세스 시작...', userData.courseId);
    
    try {
      // 1. 결제 정보 생성
      const payment = await this.createPayment({
        userId: userData.userId,
        courseId: userData.courseId,
        amount: userData.amount,
        paymentMethod: userData.paymentMethod,
        externalPaymentId: userData.externalPaymentId
      });
      
      // 2. 결제 완료 처리
      await this.updatePaymentStatus(payment.rowKey, userData.userId, 'completed');
      
      // 3. 수강신청 생성
      const enrollment = await this.createEnrollment({
        userId: userData.userId,
        courseId: userData.courseId,
        paymentId: payment.rowKey
      });
      
      console.log('✅ 강좌 구매 및 수강신청 프로세스 완료!', userData.courseId);
      return { payment, enrollment };
    } catch (error: any) {
      console.error('❌ 강좌 구매 프로세스 실패:', error.message);
      throw error;
    }
  }

  // 수강 권한 확인 (결제 상태 + 기간 체크)
  static async checkCourseAccess(userId: string, courseId: string): Promise<{
    hasAccess: boolean;
    enrollment?: Enrollment;
    reason?: string;
  }> {
    try {
      console.log('🔍 수강 권한 확인 중...', userId, courseId);
      
      const enrollments = await this.getUserEnrollments(userId);
      const enrollment = enrollments.find(e => e.rowKey === courseId);
      
      if (!enrollment) {
        return { hasAccess: false, reason: '수강신청 기록이 없습니다.' };
      }
      
      // 수강 기간 확인
      const now = new Date();
      const expiresAt = new Date(enrollment.accessExpiresAt);
      
      if (now > expiresAt) {
        return { 
          hasAccess: false, 
          enrollment, 
          reason: '수강 기간이 만료되었습니다.' 
        };
      }
      
      // 수강 상태 확인
      if (enrollment.status === 'expired' || enrollment.status === 'paused') {
        return { 
          hasAccess: false, 
          enrollment, 
          reason: `수강 상태: ${enrollment.status}` 
        };
      }
      
      console.log('✅ 수강 권한 확인 완료: 접근 가능');
      return { hasAccess: true, enrollment };
    } catch (error: any) {
      console.error('❌ 수강 권한 확인 실패:', error.message);
      return { hasAccess: false, reason: '수강 권한 확인 중 오류가 발생했습니다.' };
    }
  }
}

// === ✅ 새로운 Azure 단일 테이블 시스템 (users 테이블만 사용) ===
// users 테이블 하나로 모든 데이터 관리:
// - PartitionKey: 데이터 타입 (USER, PURCHASE)
// - RowKey: 고유 ID
// - 추가 컬럼들로 각 데이터 타입별 정보 저장

const USERS_TABLE_URL = 'https://clathonstorage.table.core.windows.net/users?sp=raud&st=2025-08-06T01:38:29Z&se=2030-10-02T09:53:00Z&spr=https&sv=2024-11-04&sig=eKj3S3wr0QyWiDhA8EJzgE6c7LAlIcysVdqiqjffb%2Bw%3D&tn=users';

export class ClathonAzureService {
  
  // Azure 단일 테이블에 데이터 저장
  private static async azureSingleRequest(method: string = 'GET', body?: any, entityId?: string): Promise<any> {
    let url = USERS_TABLE_URL;
    
    // 특정 엔티티 조회/수정/삭제시 URL 구성
    if (entityId && method !== 'POST') {
      const [partitionKey, rowKey] = entityId.split('|');
      url = `${USERS_TABLE_URL.split('?')[0]}(PartitionKey='${encodeURIComponent(partitionKey)}',RowKey='${encodeURIComponent(rowKey)}')${USERS_TABLE_URL.includes('?') ? '&' + USERS_TABLE_URL.split('?')[1] : ''}`;
    }
    
    const headers: Record<string, string> = {
      'Accept': 'application/json;odata=nometadata',
      'Content-Type': 'application/json',
    };
    
    if (method === 'PUT' || method === 'DELETE') {
      headers['If-Match'] = '*';
    }
    
    const options: RequestInit = {
      method,
      headers,
      mode: 'cors',
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
      // Azure 형식으로 변환
      const azureEntity: any = {};
      for (const [key, value] of Object.entries(body)) {
        let azureKey = key;
        if (key === 'partitionKey') azureKey = 'PartitionKey';
        else if (key === 'rowKey') azureKey = 'RowKey';
        
        azureEntity[azureKey] = value || '';
      }
      
      options.body = JSON.stringify(azureEntity);
      console.log(`🔧 Azure 단일 테이블 ${method}:`, azureEntity);
    }
    
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        if (method === 'DELETE') return { success: true };
        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
      } else {
        const errorText = await response.text();
        console.error(`Azure 단일 테이블 ${method} 오류:`, response.status, errorText);
        throw new Error(`Azure ${method} 실패: ${response.status}`);
      }
    } catch (error: any) {
      console.error(`Azure 단일 테이블 ${method} 요청 실패:`, error.message);
      throw error;
    }
  }

  // 사용자 등록
  static async registerUser(userData: { email: string; name: string; password: string; marketingAgreed: boolean }) {
    const userId = uuidv4();
    const passwordHash = await this.hashPassword(userData.password);
    
    const userEntity = {
      partitionKey: 'USER',
      rowKey: userId,
      dataType: 'USER',
      email: userData.email,
      name: userData.name,
      passwordHash,
      emailVerified: false,
      marketingAgreed: userData.marketingAgreed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: ''
    };
    
    await this.azureSingleRequest('POST', userEntity);
    console.log('✅ Azure 단일 테이블에 사용자 등록 성공:', userData.email);
    return userEntity;
  }

  // 사용자 로그인
  static async loginUser(email: string, password: string) {
    // 이메일로 사용자 검색
    const filterQuery = `$filter=dataType eq 'USER' and email eq '${encodeURIComponent(email)}'`;
    const url = `${USERS_TABLE_URL}&${filterQuery}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.value && data.value.length > 0) {
        const user = data.value[0];
        const isValid = await this.verifyPassword(password, user.passwordHash);
        
        if (isValid) {
          console.log('✅ Azure 단일 테이블 로그인 성공:', email);
          return user;
        }
      }
    }
    
    throw new Error('로그인 실패');
  }

  // Azure 기반 세션 관리
  private static sessionToken: string | null = null;
  private static currentUserCache: any = null;

  // 세션 생성 (로그인 시)
  static async createSession(user: any): Promise<string> {
    const sessionToken = uuidv4();
    const sessionEntity = {
      partitionKey: 'SESSION',
      rowKey: sessionToken,
      dataType: 'SESSION',
      userId: user.rowKey,
      email: user.email,
      name: user.name,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24시간
    };

    await this.azureSingleRequest('POST', sessionEntity);
    this.sessionToken = sessionToken;
    this.currentUserCache = user;
    
    console.log('✅ Azure 세션 생성:', sessionToken);
    return sessionToken;
  }

  // 현재 로그인된 사용자 정보 가져오기 (Azure 기반)
  static async getCurrentUser(): Promise<{ userId: string; email: string; name: string } | null> {
    if (!this.sessionToken) return null;
    if (this.currentUserCache) return this.currentUserCache;

    try {
      // Azure에서 세션 확인
      const filterQuery = `$filter=dataType eq 'SESSION' and rowKey eq '${encodeURIComponent(this.sessionToken)}'`;
      const url = `${USERS_TABLE_URL}&${filterQuery}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.value && data.value.length > 0) {
          const session = data.value[0];
          
          // 세션 만료 체크
          if (new Date() > new Date(session.expiresAt)) {
            await this.logout();
            return null;
          }

          const userInfo = {
            userId: session.userId,
            email: session.email,
            name: session.name
          };
          
          this.currentUserCache = userInfo;
          return userInfo;
        }
      }
      
      return null;
    } catch (error) {
      console.error('세션 확인 실패:', error);
      return null;
    }
  }

  // 세션 토큰 설정 (클라이언트에서 사용)
  static setSessionToken(token: string) {
    this.sessionToken = token;
    this.currentUserCache = null;
  }

  // 사용자 로그아웃 (Azure 세션 정리)
  static async logout() {
    if (this.sessionToken) {
      try {
        // Azure에서 세션 삭제
        await this.azureSingleRequest('DELETE', null, `SESSION|${this.sessionToken}`);
        console.log('✅ Azure 세션 삭제 완료');
      } catch (error) {
        console.error('세션 삭제 실패:', error);
      }
    }
    
    this.sessionToken = null;
    this.currentUserCache = null;
  }

  // 강의 구매
  static async purchaseCourse(userId: string, courseId: string, courseTitle: string, amount: number) {
    const purchaseId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 3개월
    
    const purchaseEntity = {
      partitionKey: 'PURCHASE',
      rowKey: purchaseId,
      dataType: 'PURCHASE',
      userId,
      courseId,
      courseTitle,
      amount,
      status: 'completed',
      purchaseDate: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      createdAt: now.toISOString()
    };
    
    await this.azureSingleRequest('POST', purchaseEntity);
    console.log(`✅ Azure 단일 테이블에 강의 구매 저장: ${courseId}`);
    return purchaseEntity;
  }

  // 수강 권한 확인
  static async hasAccess(userId: string, courseId: string): Promise<boolean> {
    try {
      const filterQuery = `$filter=dataType eq 'PURCHASE' and userId eq '${encodeURIComponent(userId)}' and courseId eq '${encodeURIComponent(courseId)}'`;
      const url = `${USERS_TABLE_URL}&${filterQuery}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.value && data.value.length > 0) {
          const purchase = data.value[0];
          const now = new Date();
          const expiresAt = new Date(purchase.expiresAt);
          
          if (now <= expiresAt && purchase.status === 'completed') {
            console.log(`✅ Azure 수강 권한 확인: ${courseId}`);
            return true;
          }
        }
      }
      
      console.log(`❌ Azure 수강 권한 없음: ${courseId}`);
      return false;
    } catch (error) {
      console.error('Azure 수강 권한 확인 실패:', error);
      return false;
    }
  }

  // 비밀번호 해시화
  private static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'clathon_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // 비밀번호 검증
  private static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashToVerify = await this.hashPassword(password);
    return hashToVerify === hashedPassword;
  }

  // 사용자가 구매한 모든 강의 조회
  static async getUserPurchases(userId: string) {
    try {
      const filterQuery = `$filter=dataType eq 'PURCHASE' and userId eq '${encodeURIComponent(userId)}'`;
      const url = `${USERS_TABLE_URL}&${filterQuery}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (response.ok) {
        const data = await response.json();
        const purchases = data.value || [];
        
        // 만료일 기준으로 정렬 (최신 구매순)
        purchases.sort((a: any, b: any) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
        
        console.log(`✅ 사용자 구매 내역 조회: ${purchases.length}개 강의`);
        return purchases;
      }
      
      return [];
    } catch (error) {
      console.error('사용자 구매 내역 조회 실패:', error);
      return [];
    }
  }

  // 사용자의 활성 강의 목록 (만료되지 않은 강의만)
  static async getActiveCourses(userId: string) {
    const allPurchases = await this.getUserPurchases(userId);
    const now = new Date();
    
    const activeCourses = allPurchases.filter((purchase: any) => {
      const expiresAt = new Date(purchase.expiresAt);
      return now <= expiresAt && purchase.status === 'completed';
    });
    
    console.log(`✅ 활성 강의: ${activeCourses.length}개`);
    return activeCourses;
  }
}

export default AzureTableService;