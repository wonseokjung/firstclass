/**
 * Azure Functions - 토스페이먼츠 웹훅 수신 API
 * 
 * 🔐 가상계좌 입금 완료 시 자동 수강 등록
 * 
 * 토스 대시보드에서 웹훅 URL 등록 필요:
 * - URL: https://www.aicitybuilders.com/api/toss-webhook
 * - 이벤트: DONE (입금 완료)
 * 
 * 환경변수:
 * - TOSS_WEBHOOK_SECRET_KEY: 웹훅 서명 검증용 시크릿 키
 * - AZURE_USERS_TABLE_SAS_URL: Azure Table Storage SAS URL
 */

const crypto = require('crypto');

// 강의 ID → 강의명 매핑
const COURSE_NAMES = {
    'ai-building-course': 'AI 건물주 되기',
    'chatgpt-agent-beginner': 'AI 에이전트 비기너',
    'vibe-coding': '바이브코딩',
    'solo-business': 'AI 1인 기업 만들기'
};

module.exports = async function (context, req) {
    context.log('🔔 토스 웹훅 수신됨');

    // CORS 헤더 설정
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // OPTIONS 요청 처리
    if (req.method === 'OPTIONS') {
        context.res = { status: 200, headers };
        return;
    }

    try {
        const webhookData = req.body;
        context.log('📦 웹훅 데이터:', JSON.stringify(webhookData, null, 2));

        // 실제 DEPOSIT_CALLBACK 형식: { createdAt, secret, orderId, status, transactionKey }
        const { orderId, status, transactionKey } = webhookData;

        context.log(`📌 orderId: ${orderId}, status: ${status}`);

        // 입금 완료 확인
        if (status !== 'DONE') {
            context.log(`⏭️ 입금 완료가 아님: ${status}`);
            context.res = {
                status: 200,
                headers,
                body: JSON.stringify({ success: true, message: `상태 ${status} 대기 중` })
            };
            return;
        }

        // 토스 API로 결제 정보 조회 (이메일 가져오기)
        const secretKey = process.env.TOSS_LIVE_SECRET_KEY;

        if (!secretKey) {
            context.log('❌ TOSS_LIVE_SECRET_KEY 환경변수 없음');
            context.res = {
                status: 200,
                headers,
                body: JSON.stringify({ success: false, message: '시크릿 키 없음 - 수동 등록 필요', orderId })
            };
            return;
        }

        // 토스 API로 결제 정보 조회
        const basicAuth = Buffer.from(`${secretKey}:`).toString('base64');
        const paymentResponse = await fetch(`https://api.tosspayments.com/v1/payments/orders/${orderId}`, {
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json'
            }
        });

        if (!paymentResponse.ok) {
            context.log('❌ 토스 API 조회 실패:', paymentResponse.status);
            const errorText = await paymentResponse.text();
            context.log('❌ 에러 내용:', errorText);
            context.res = {
                status: 200,
                headers,
                body: JSON.stringify({ success: false, message: '토스 API 조회 실패', orderId })
            };
            return;
        }

        const paymentData = await paymentResponse.json();
        context.log('💳 토스 결제 정보:', JSON.stringify(paymentData, null, 2));

        // 이메일 추출 (metadata에서 우선, 없으면 다른 필드에서)
        const customerEmail = paymentData.metadata?.customerEmail ||
            paymentData.customerEmail ||
            paymentData.customer?.email ||
            paymentData.receipt?.customerEmail;
        const totalAmount = paymentData.totalAmount;

        // courseId 추출 (metadata에서 우선, 없으면 orderId에서)
        let courseId = paymentData.metadata?.courseId || 'ai-building-course';
        const orderIdParts = orderId.split('_');
        if (!paymentData.metadata?.courseId && COURSE_NAMES[orderIdParts[0]]) {
            courseId = orderIdParts[0];
        }
        const courseName = COURSE_NAMES[courseId] || courseId;

        context.log(`✅ 입금 완료: orderId=${orderId}, email=${customerEmail}, courseId=${courseId}`);

        if (!customerEmail) {
            context.log('❌ 이메일 정보 없음');
            context.res = {
                status: 200,
                headers,
                body: JSON.stringify({ success: false, message: '이메일 없음 - 수동 등록 필요', orderId })
            };
            return;
        }

        // Azure Table Storage SAS URL (기존 users 테이블)
        const sasUrl = process.env.AZURE_USERS_TABLE_SAS_URL ||
            'https://clathonstorage.table.core.windows.net/users?sp=raud&st=2025-12-07T14:26:24Z&se=2029-10-15T22:41:00Z&sv=2024-11-04&sig=5KPeZHVwROPfNh1KBESKRJrnE12hTd2fTtESe3x5YSU%3D&tn=users';

        if (!sasUrl) {
            context.log.error('❌ SAS URL 없음');
            context.res = {
                status: 500,
                headers,
                body: JSON.stringify({ success: false, error: '서버 설정 오류' })
            };
            return;
        }
        // 1. 사용자 조회
        const emailLower = customerEmail.toLowerCase();
        const userQueryUrl = `${sasUrl}&$filter=email eq '${emailLower}'`;

        const userResponse = await fetch(userQueryUrl, {
            headers: { 'Accept': 'application/json' }
        });

        if (!userResponse.ok) {
            context.log.error('❌ 사용자 조회 실패:', userResponse.status);
            context.res = {
                status: 404,
                headers,
                body: JSON.stringify({ success: false, error: '사용자를 찾을 수 없습니다' })
            };
            return;
        }

        const userData = await userResponse.json();
        const users = userData.value || [];

        if (users.length === 0) {
            context.log('❌ 사용자가 존재하지 않음:', emailLower);
            context.res = {
                status: 404,
                headers,
                body: JSON.stringify({ success: false, error: '사용자를 찾을 수 없습니다' })
            };
            return;
        }

        const user = users[0];
        context.log('👤 사용자 발견:', user.email);

        // 2. 기존 수강 정보 파싱
        let enrolledData = { enrollments: [], payments: [] };
        if (user.enrolledCourses) {
            try {
                const parsed = JSON.parse(user.enrolledCourses);
                if (Array.isArray(parsed)) {
                    enrolledData = { enrollments: parsed, payments: [] };
                } else {
                    enrolledData = parsed;
                }
            } catch (e) {
                context.log('⚠️ enrolledCourses 파싱 오류, 초기화함');
            }
        }

        // 3. 새 수강 정보 추가
        const now = new Date().toISOString();
        const accessDays = 90; // 3개월
        const expiresAt = new Date(Date.now() + accessDays * 24 * 60 * 60 * 1000).toISOString();

        const newEnrollment = {
            courseId: courseId,
            title: courseName,
            enrolledAt: now,
            status: 'active',
            progress: 0,
            lastAccessedAt: now,
            accessExpiresAt: expiresAt,
            paymentId: orderId,
            accessDurationDays: accessDays,
            isEarlyBird: false
        };

        // 이미 수강 중인지 확인
        const existingIndex = enrolledData.enrollments.findIndex(c => c.courseId === courseId);
        if (existingIndex >= 0) {
            context.log('⚠️ 이미 수강 중인 강의, 업데이트');
            enrolledData.enrollments[existingIndex] = {
                ...enrolledData.enrollments[existingIndex],
                ...newEnrollment,
                accessExpiresAt: expiresAt // 기간 연장
            };
        } else {
            enrolledData.enrollments.push(newEnrollment);
        }

        // 결제 정보 추가
        enrolledData.payments = enrolledData.payments || [];
        enrolledData.payments.push({
            paymentId: orderId,
            courseId: courseId,
            amount: totalAmount,
            method: '가상계좌',
            paidAt: now,
            status: 'completed'
        });

        // 4. Azure Table 업데이트
        const updateUrl = `${sasUrl.split('?')[0]}(PartitionKey='${user.PartitionKey}',RowKey='${user.RowKey}')?${sasUrl.split('?')[1]}`;

        const updateResponse = await fetch(updateUrl, {
            method: 'MERGE',
            headers: {
                'Content-Type': 'application/json',
                'If-Match': '*'
            },
            body: JSON.stringify({
                enrolledCourses: JSON.stringify(enrolledData),
                totalEnrolledCourses: enrolledData.enrollments.length,
                updatedAt: now
            })
        });

        if (!updateResponse.ok && updateResponse.status !== 204) {
            context.log.error('❌ 사용자 업데이트 실패:', updateResponse.status);
            context.res = {
                status: 500,
                headers,
                body: JSON.stringify({ success: false, error: '수강 등록 실패' })
            };
            return;
        }

        context.log(`✅ 수강 등록 완료! ${emailLower} → ${courseName}`);

        context.res = {
            status: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: '수강 등록 완료',
                data: {
                    email: emailLower,
                    courseId: courseId,
                    courseName: courseName,
                    expiresAt: expiresAt
                }
            })
        };

    } catch (error) {
        context.log.error('❌ 웹훅 처리 에러:', error);
        context.res = {
            status: 500,
            headers,
            body: JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' })
        };
    }
};
