import React, { useState } from 'react';
import { ChevronDown, Mail, Clock } from 'lucide-react';
import NavigationBar from '../common/NavigationBar';

interface FAQPageProps {
  onBack: () => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ onBack }) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      category: "AI CITY BUILDER 교육 시스템",
      items: [
        {
          question: "AI CITY BUILDER는 다른 AI 교육과 어떻게 다른가요?",
          answer: `
            <div>
              <h4>🏙️ AI CITY BUILDER의 혁신적인 디지털 건물주 양성 시스템</h4>
              
              <h5>🔸 수익 중심 교육</h5>
              <ul>
                <li><strong>디지털 건물 구축:</strong> AI를 활용해 실제 월 수익이 나오는 디지털 자산 건설</li>
                <li><strong>월세 수익 창출:</strong> 유튜브, 블로그, 온라인 쇼핑몰 등을 통한 지속적인 수익 구조 구축</li>
                <li><strong>실전 수익화 전략:</strong> 이론이 아닌 실제 돈을 버는 방법론 전수</li>
              </ul>

              <h5>🔸 네트워크 기반 성장</h5>
              <ul>
                <li><strong>디지털 건물주 네트워크:</strong> 개별 건물주들이 모여 시너지 창출</li>
                <li><strong>협력 생태계:</strong> 서로의 디지털 건물을 연결하여 상호 발전</li>
                <li><strong>AI 도시 구축:</strong> 개인의 성공을 넘어 함께 성장하는 도시 생태계</li>
              </ul>

              <h5>🔸 지속 가능한 자산 구축</h5>
              <ul>
                <li><strong>평생 소유 가능:</strong> 한 번 구축하면 계속 수익을 창출하는 디지털 자산</li>
                <li><strong>확장 가능한 모델:</strong> 하나의 건물에서 시작해 다수의 건물로 확장</li>
                <li><strong>AI 자동화:</strong> 인공지능으로 운영을 자동화하여 효율성 극대화</li>
              </ul>
            </div>
          `
        },
        {
          question: "디지털 건물이란 무엇인가요?",
          answer: `
            <div>
              <h4>🏢 디지털 건물의 개념</h4>
              
              <h5>🔸 디지털 건물의 정의</h5>
              <ul>
                <li><strong>수익 창출 채널:</strong> 월세와 같이 지속적인 수익을 만들어내는 하나의 디지털 자산</li>
                <li><strong>다양한 형태:</strong> 유튜브 채널, 블로그, 온라인 쇼핑몰, 앱, 웹사이트 등</li>
                <li><strong>AI 기반 운영:</strong> 인공지능을 활용해 콘텐츠 생성부터 운영까지 자동화</li>
              </ul>

              <h5>🔸 수익화 방법</h5>
              <ul>
                <li><strong>광고 수익:</strong> 콘텐츠를 통한 광고 수익 창출</li>
                <li><strong>제품/서비스 판매:</strong> 디지털 상품이나 서비스를 통한 직접 판매</li>
                <li><strong>구독 모델:</strong> 멤버십이나 구독 서비스를 통한 정기 수익</li>
                <li><strong>제휴 마케팅:</strong> 다른 제품/서비스 추천을 통한 커미션 수익</li>
              </ul>

              <h5>🔸 확장 가능성</h5>
              <ul>
                <li><strong>멀티 플랫폼:</strong> 하나의 콘텐츠로 여러 플랫폼에서 수익 창출</li>
                <li><strong>자동화 시스템:</strong> AI가 운영하므로 24시간 지속적인 수익 가능</li>
                <li><strong>네트워크 효과:</strong> 다른 건물주들과 연결되어 시너지 극대화</li>
              </ul>
            </div>
          `
        },
        {
          question: "강의 환불 정책이 어떻게 되나요?",
          answer: `
            <div>
              <h4>📋 환불 정책 (전자상거래법 준수)</h4>
              
              <h5>🔸 수강 시작 전 환불</h5>
              <ul>
                <li><strong>수강 시작 전까지:</strong> 100% 전액 환불 가능</li>
                <li><strong>신청일로부터 7일 이내:</strong> 무조건 전액 환불</li>
              </ul>

              <h5>🔸 수강 시작 후 환불</h5>
              <ul>
                <li><strong>수강률 10% 이하:</strong> 90% 환불</li>
                <li><strong>수강률 10% 초과 ~ 25% 이하:</strong> 75% 환불</li>
                <li><strong>수강률 25% 초과 ~ 50% 이하:</strong> 50% 환불</li>
                <li><strong>수강률 50% 초과:</strong> 환불 불가</li>
              </ul>

              <h5>🔸 환불 처리 기간</h5>
              <ul>
                <li><strong>신용카드:</strong> 승인 취소 (2-3일 소요)</li>
                <li><strong>계좌이체:</strong> 영업일 기준 3-5일 이내</li>
                <li><strong>가상계좌:</strong> 영업일 기준 3-5일 이내</li>
              </ul>

                             <h5>🔸 환불 불가 사유</h5>
               <ul>
                 <li>수강률이 50%를 초과한 경우</li>
                 <li>강의 완주 후 수료증 발급을 받은 경우</li>
                 <li>수강 기간이 2개월을 초과한 경우</li>
                 <li>무료 강의 또는 이벤트성 강의</li>
                 <li>할인 쿠폰 사용 시 쿠폰 적용분은 환불 불가</li>
               </ul>

              <p><strong>※ 본 환불 정책은 전자상거래법 제17조에 따라 시행됩니다.</strong></p>
            </div>
          `
        },
        {
          question: "환불 신청은 어떻게 하나요?",
          answer: `
            <div>
              <h4>📞 환불 신청 방법</h4>
              
              <h5>🔸 온라인 신청</h5>
              <ul>
                <li>마이페이지 → 수강 중인 강의 → 환불 신청</li>
                <li>환불 사유 작성 후 신청 완료</li>
              </ul>

              <h5>🔸 고객센터 연락</h5>
              <ul>
                <li><strong>이메일:</strong> jay@connexionai.kr</li>
              </ul>

              <h5>🔸 필요 정보</h5>
              <ul>
                <li>주문번호 또는 결제 정보</li>
                <li>환불 사유</li>
                <li>환불 받을 계좌 정보 (카드 결제 외)</li>
              </ul>
            </div>
          `
        },
        {
          question: "어떤 디지털 건물부터 시작해야 할까요?",
          answer: `
            <div>
              <h4>🏗️ 첫 번째 디지털 건물 선택 가이드</h4>
              
              <h5>🔸 초보자 추천 건물</h5>
              <ul>
                <li><strong>유튜브 채널:</strong> 가장 접근하기 쉽고 AI 도구 활용이 용이</li>
                <li><strong>블로그/웹사이트:</strong> SEO를 통한 장기적 수익 구조 구축</li>
                <li><strong>인스타그램 계정:</strong> 시각적 콘텐츠로 빠른 팔로워 증가 가능</li>
              </ul>

              <h5>🔸 중급자 추천 건물</h5>
              <ul>
                <li><strong>온라인 쇼핑몰:</strong> 제품 판매를 통한 직접적인 수익 창출</li>
                <li><strong>온라인 강의 플랫폼:</strong> 전문 지식을 활용한 교육 사업</li>
                <li><strong>앱/웹 서비스:</strong> 구독 모델을 통한 정기 수익</li>
              </ul>

              <h5>🔸 고급자 추천 건물</h5>
              <ul>
                <li><strong>멀티 플랫폼 네트워크:</strong> 여러 채널을 연결한 생태계</li>
                <li><strong>AI 자동화 시스템:</strong> 완전 자동화된 수익 구조</li>
                <li><strong>B2B 솔루션:</strong> 기업 대상 서비스로 고수익 창출</li>
              </ul>
            </div>
          `
        },
        {
          question: "디지털 건물주 네트워크는 어떻게 작동하나요?",
          answer: `
            <div>
              <h4>🌐 디지털 건물주 네트워크 시스템</h4>
              
              <h5>🔸 네트워크 구조</h5>
              <ul>
                <li><strong>상호 협력:</strong> 각자의 디지털 건물을 서로 홍보하고 추천</li>
                <li><strong>크로스 마케팅:</strong> 다른 건물주의 고객을 자신의 건물로 유도</li>
                <li><strong>공동 프로젝트:</strong> 여러 건물주가 협력하여 대형 프로젝트 진행</li>
              </ul>

              <h5>🔸 네트워크 혜택</h5>
              <ul>
                <li><strong>트래픽 공유:</strong> 네트워크 내에서 고객 트래픽 상호 교환</li>
                <li><strong>지식 공유:</strong> 성공 노하우와 실패 경험을 서로 공유</li>
                <li><strong>리소스 공유:</strong> 콘텐츠, 도구, 기술 등을 함께 활용</li>
              </ul>

              <h5>🔸 도시화 프로세스</h5>
              <ul>
                <li><strong>개별 건물 구축:</strong> 각자의 전문 분야에서 디지털 건물 완성</li>
                <li><strong>네트워크 연결:</strong> 비슷한 타겟이나 보완적인 서비스끼리 연결</li>
                <li><strong>생태계 완성:</strong> 하나의 AI 도시로 발전하여 더 큰 가치 창출</li>
              </ul>
            </div>
          `
        }
      ]
    },
    {
      category: "디지털 건물 구축 과정",
      items: [
        {
          question: "디지털 건물은 어떻게 시작하나요?",
          answer: `
            <div>
              <h4>🚀 디지털 건물 시작하기</h4>
              
              <h5>🔸 기본 원리</h5>
              <ul>
                <li><strong>AI 도구 활용:</strong> ChatGPT, Midjourney 등을 이용한 콘텐츠 자동 생성</li>
                <li><strong>플랫폼 선택:</strong> 본인의 관심사와 강점에 맞는 플랫폼 결정</li>
                <li><strong>수익 구조 설계:</strong> 광고, 판매, 구독 등 다양한 수익 모델 조합</li>
              </ul>

              <h5>🔸 단계별 접근</h5>
              <ul>
                <li><strong>1단계:</strong> AI 도구 숙련도 향상</li>
                <li><strong>2단계:</strong> 콘텐츠 생성 및 플랫폼 운영</li>
                <li><strong>3단계:</strong> 수익화 시스템 구축</li>
                <li><strong>4단계:</strong> 자동화 및 확장</li>
              </ul>

              <h5>🔸 성공 요소</h5>
              <ul>
                <li><strong>일관성:</strong> 꾸준한 콘텐츠 업로드와 관리</li>
                <li><strong>품질:</strong> AI를 활용한 고품질 콘텐츠 제작</li>
                <li><strong>네트워킹:</strong> 다른 건물주들과의 협력</li>
              </ul>
            </div>
          `
        },
        {
          question: "AI 도구 사용 경험이 없어도 가능한가요?",
          answer: `
            <div>
              <h4>🤖 AI 도구 활용 가이드</h4>
              
              <h5>🔸 초보자도 가능</h5>
              <ul>
                <li><strong>단계별 학습:</strong> 기초 AI 도구부터 고급 기능까지 체계적 교육</li>
                <li><strong>실습 중심:</strong> 실제 프로젝트를 통해 자연스럽게 도구 습득</li>
                <li><strong>템플릿 제공:</strong> 바로 사용할 수 있는 프롬프트와 워크플로우</li>
              </ul>

              <h5>🔸 주요 AI 도구</h5>
              <ul>
                <li><strong>콘텐츠 생성:</strong> ChatGPT, Claude, Gemini 활용법</li>
                <li><strong>이미지/영상:</strong> Midjourney, DALL-E, RunwayML 등</li>
                <li><strong>자동화:</strong> Zapier, Make.com을 통한 워크플로우 구축</li>
                <li><strong>분석:</strong> 데이터 분석 및 인사이트 도출 도구</li>
              </ul>

              <h5>🔸 학습 지원</h5>
              <ul>
                <li><strong>실시간 Q&A:</strong> 막히는 부분 즉시 해결</li>
                <li><strong>커뮤니티:</strong> 동료들과 경험 공유</li>
                <li><strong>지속 업데이트:</strong> 새로운 AI 도구 정보 지속 제공</li>
              </ul>
            </div>
          `
        },
        {
          question: "성공한 디지털 건물 인증은 어떻게 받나요?",
          answer: `
            <div>
              <h4>🏅 디지털 건물주 인증 시스템</h4>
              
              <h5>🔸 인증 조건</h5>
              <ul>
                <li><strong>수익 실현:</strong> 실제 월 수익 ₩10만원 이상 달성</li>
                <li><strong>지속성 증명:</strong> 3개월 연속 안정적 수익 유지</li>
                <li><strong>성장성 입증:</strong> 전월 대비 수익 증가 또는 유지</li>
                <li><strong>건물 완성도:</strong> AI 자동화 시스템 구축 완료</li>
              </ul>

              <h5>🔸 인증 혜택</h5>
              <ul>
                <li><strong>디지털 건물주 배지:</strong> 프로필에 표시되는 공식 인증</li>
                <li><strong>네트워크 우선 참여:</strong> 상위 건물주들과의 협력 기회</li>
                <li><strong>멘토 자격:</strong> 신규 건물주들을 돕는 멘토 활동 가능</li>
                <li><strong>수익 공유:</strong> 멘토링을 통한 추가 수익 창출</li>
              </ul>

              <h5>🔸 인증 레벨</h5>
              <ul>
                <li><strong>브론즈:</strong> 월 ₩10-50만원 수익</li>
                <li><strong>실버:</strong> 월 ₩50-200만원 수익</li>
                <li><strong>골드:</strong> 월 ₩200만원 이상 수익</li>
                <li><strong>플래티넘:</strong> 멀티 건물 운영 + 네트워크 리더</li>
              </ul>
            </div>
          `
        }
      ]
    },
    {
      category: "기술 지원",
      items: [
        {
          question: "동영상이 재생되지 않아요.",
          answer: `
            <div>
              <h4>🔧 동영상 재생 문제 해결</h4>
              
              <h5>🔸 브라우저 확인</h5>
              <ul>
                <li>Chrome, Firefox, Safari, Edge 최신 버전 사용</li>
                <li>브라우저 캐시 및 쿠키 삭제</li>
                <li>확장 프로그램(광고 차단기 등) 일시 해제</li>
              </ul>

              <h5>🔸 네트워크 확인</h5>
              <ul>
                <li>안정적인 인터넷 연결 확인</li>
                <li>방화벽 설정 확인</li>
                <li>다른 디바이스에서 테스트</li>
              </ul>

              <h5>🔸 문제 지속 시</h5>
              <ul>
                <li>이메일: jay@connexionai.kr</li>
                <li>원격 지원 서비스 제공</li>
              </ul>
            </div>
          `
        },
        {
          question: "퀴즈나 과제 제출에 문제가 있어요.",
          answer: `
            <div>
              <h4>📝 퀴즈/과제 문제 해결</h4>
              
              <h5>🔸 일반적인 해결법</h5>
              <ul>
                <li>페이지 새로고침 후 재시도</li>
                <li>브라우저 변경 후 테스트</li>
                <li>팝업 차단 해제</li>
                <li>JavaScript 활성화 확인</li>
              </ul>

              <h5>🔸 제출 실패 시</h5>
              <ul>
                <li>답안 임시 저장 후 재제출</li>
                <li>파일 용량 및 형식 확인</li>
                <li>네트워크 상태 점검</li>
              </ul>

              <h5>🔸 추가 지원</h5>
              <ul>
                <li>이메일로 답안 직접 전송 가능</li>
                <li>재시험 기회 제공</li>
                <li>커뮤니티를 통한 동료 도움</li>
              </ul>
            </div>
          `
        }
      ]
    },
    {
      category: "계정 및 개인정보",
      items: [
        {
          question: "회원가입은 어떻게 하나요?",
          answer: `
            <div>
              <h4>👤 회원가입 안내</h4>
              
              <h5>🔸 가입 방법</h5>
              <ul>
                <li>이메일 + 비밀번호</li>
                <li>구글 계정 연동</li>
                <li>네이버 계정 연동</li>
                <li>카카오 계정 연동</li>
              </ul>

              <h5>🔸 필수 정보</h5>
              <ul>
                <li>이름 (실명)</li>
                <li>이메일 주소</li>
                <li>휴대폰 번호 (본인인증)</li>
                <li>개인정보 처리방침 동의</li>
              </ul>

              <h5>🔸 회원 혜택</h5>
              <ul>
                <li>수강 진도 자동 저장</li>
                <li>맞춤형 강의 추천</li>
                <li>이벤트 및 할인 정보 우선 제공</li>
                <li>커뮤니티 참여</li>
              </ul>
            </div>
          `
        },
        {
          question: "개인정보는 어떻게 보호되나요?",
          answer: `
            <div>
              <h4>🔒 개인정보 보호</h4>
              
              <h5>🔸 수집 정보</h5>
              <ul>
                <li><strong>필수:</strong> 이름, 이메일, 휴대폰 번호</li>
                <li><strong>선택:</strong> 생년월일, 성별, 관심분야</li>
                <li><strong>자동수집:</strong> 접속 로그, 쿠키, 서비스 이용 기록</li>
              </ul>

              <h5>🔸 보호 조치</h5>
              <ul>
                <li>SSL 암호화 통신</li>
                <li>개인정보 암호화 저장</li>
                <li>접근권한 관리 시스템</li>
                <li>정기적인 보안 점검</li>
              </ul>

              <h5>🔸 이용 목적</h5>
              <ul>
                <li>서비스 제공 및 운영</li>
                <li>결제 및 환불 처리</li>
                <li>고객 상담 및 불만 처리</li>
                <li>마케팅 활용 (동의 시에만)</li>
              </ul>

              <p><strong>※ 자세한 내용은 개인정보처리방침을 참조해주세요.</strong></p>
            </div>
          `
        }
      ]
    }
  ];

  return (
    <div className="masterclass-container">
      {/* 통일된 네비게이션바 */}
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="FAQ"
      />

      {/* FAQ 메인 콘텐츠 */}
      <div className="faq-container" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px' 
      }}>
        {/* 헤더 섹션 */}
        <div className="faq-header" style={{ 
          textAlign: 'center', 
          marginBottom: '60px' 
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #ff4757 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            자주 묻는 질문
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: '0.8', 
            marginBottom: '40px' 
          }}>
            궁금한 사항을 빠르게 찾아보세요. 추가 문의사항은 고객센터로 연락주세요.
          </p>

          {/* 연락처 정보 */}
          <div className="contact-info" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '30px',
            borderRadius: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={20} color="#667eea" />
              <div>
                <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>이메일</div>
                <div style={{ fontWeight: '600' }}>jay@connexionai.kr</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="#667eea" />
              <div>
                <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>운영시간</div>
                <div style={{ fontWeight: '600' }}>평일 09:00-18:00</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ 콘텐츠 */}
        <div className="faq-content">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category" style={{ marginBottom: '50px' }}>
              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: '600', 
                marginBottom: '30px',
                color: '#0ea5e9',
                borderBottom: '2px solid rgba(14, 165, 233, 0.3)',
                paddingBottom: '10px'
              }}>
                {category.category}
              </h2>
              
              <div className="faq-items">
                {category.items.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div 
                      key={itemIndex} 
                      className="faq-item" 
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '15px',
                        marginBottom: '15px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleItem(globalIndex)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '25px',
                          background: 'none',
                          border: 'none',
                          color: 'inherit',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span>{item.question}</span>
                        <ChevronDown 
                          size={20} 
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }}
                        />
                      </button>
                      
                      {isOpen && (
                        <div 
                          className="faq-answer"
                          style={{
                            padding: '0 25px 25px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            marginTop: '10px',
                            paddingTop: '20px'
                          }}
                          dangerouslySetInnerHTML={{ __html: item.answer }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 추가 지원 섹션 */}
        <div className="additional-support" style={{
          background: 'rgba(14, 165, 233, 0.1)',
          border: '1px solid rgba(14, 165, 233, 0.3)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          marginTop: '60px'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
            원하는 답변을 찾지 못하셨나요?
          </h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: '0.9' }}>
            전문 상담원이 친절하게 도와드리겠습니다.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #ff4757)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onClick={() => window.location.href = 'mailto:jay@connexionai.kr'}
            >
              <Mail size={16} />
              이메일 문의
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage; 