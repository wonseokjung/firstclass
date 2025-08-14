import React, { useState } from 'react';
import { ChevronDown, Phone, Mail, Clock } from 'lucide-react';
import NavigationBar from './NavigationBar';

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
      category: "CLATHON 교육 시스템",
      items: [
        {
          question: "CLATHON은 다른 AI 교육과 어떻게 다른가요?",
          answer: `
            <div>
              <h4>🎯 CLATHON의 차별화된 AI 교육 시스템</h4>
              
              <h5>🔸 실전 중심 교육</h5>
              <ul>
                <li><strong>단순 수강이 아닌 실제 활용:</strong> 수강생이 직접 AI 도구를 사용해 결과물을 만드는 것이 목표</li>
                <li><strong>프로젝트 기반 학습:</strong> 이론보다는 실무에서 바로 활용 가능한 스킬 습득</li>
                <li><strong>개인 맞춤형 학습:</strong> 각자의 목표와 수준에 맞는 커리큘럼 제공</li>
              </ul>

              <h5>🔸 검증된 멘토 시스템</h5>
              <ul>
                <li><strong>학력 검증:</strong> 대학원 이상의 학력 및 관련 전공 확인</li>
                <li><strong>실무 경력 검증:</strong> 3년 이상의 실제 AI 업무 경험</li>
                <li><strong>포트폴리오 검증:</strong> GitHub, 논문, 프로젝트 등 공개 자료 확인</li>
                <li><strong>투명한 정보 공개:</strong> 모든 멘토의 학력, 경력, 포트폴리오 완전 공개</li>
              </ul>

              <h5>🔸 다양한 학습 방식</h5>
              <ul>
                <li><strong>무료 강의:</strong> AI 기초 개념 및 도구 소개</li>
                <li><strong>유료 강의:</strong> 심화 학습 및 실전 프로젝트</li>
                <li><strong>그룹 라이브 클래스:</strong> 소그룹 실시간 학습 (5-10명)</li>
                <li><strong>1:1 라이브 클래스:</strong> 개인 맞춤형 멘토링</li>
              </ul>
            </div>
          `
        },
        {
          question: "1:1 라이브 클래스는 어떻게 진행되나요?",
          answer: `
            <div>
              <h4>👨‍🏫 1:1 라이브 클래스 시스템</h4>
              
              <h5>🔸 진행 방식</h5>
              <ul>
                <li><strong>화상 회의:</strong> Zoom 또는 Google Meet를 통한 실시간 멘토링</li>
                <li><strong>화면 공유:</strong> 실시간 코드 작성 및 도구 사용 실습</li>
                <li><strong>맞춤형 커리큘럼:</strong> 개인의 목표와 수준에 맞는 학습 계획</li>
                <li><strong>과제 및 피드백:</strong> 세션 후 개인 과제 제공 및 다음 세션에서 리뷰</li>
              </ul>

              <h5>🔸 패키지 옵션</h5>
              <ul>
                <li><strong>10회권:</strong> 기초부터 중급까지 (3개월 완성)</li>
                <li><strong>20회권:</strong> 고급 프로젝트 및 실무 적용 (6개월 완성)</li>
                <li><strong>세션당 50분:</strong> 충분한 학습 시간 보장</li>
              </ul>

              <h5>🔸 가격 정책</h5>
              <ul>
                <li><strong>상담 기반 가격 책정:</strong> 개인의 목표, 수준, 멘토 등급에 따라 결정</li>
                <li><strong>투명한 가격 공개:</strong> 상담 후 명확한 가격 및 커리큘럼 제시</li>
                <li><strong>무료 체험:</strong> 첫 상담 및 1회 세션 무료 제공</li>
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
                <li><strong>전화:</strong> 070-2359-3515 (평일 10:00~18:00)</li>
                <li><strong>이메일:</strong> refund@connexionai.kr</li>
                <li><strong>카카오톡:</strong> @클래튼 (24시간 접수)</li>
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
          question: "프리미엄 강의와 무료 강의의 차이점은 무엇인가요?",
          answer: `
            <div>
              <h4>💎 프리미엄 vs 무료 강의</h4>
              
              <h5>🔸 프리미엄 강의 (유료)</h5>
              <ul>
                <li>심화된 실전 콘텐츠 제공</li>
                <li>1:1 질의응답 지원</li>
                <li>수료증 발급</li>
                <li>3개월 수강권 제공</li>
                <li>추가 자료 및 템플릿 제공</li>
                <li>우선 고객지원</li>
              </ul>

              <h5>🔸 무료 강의</h5>
              <ul>
                <li>기본적인 개념 학습</li>
                <li>커뮤니티 Q&A만 지원</li>
                <li>수료증 미발급</li>
                <li>제한적 접근 (30일)</li>
                <li>기본 자료만 제공</li>
              </ul>
            </div>
          `
        },
        {
          question: "할인 혜택이나 쿠폰은 어떻게 사용하나요?",
          answer: `
            <div>
              <h4>🎫 할인 혜택 및 쿠폰</h4>
              
              <h5>🔸 얼리버드 할인</h5>
              <ul>
                <li>런칭 전 사전예약 시 최대 40% 할인</li>
                <li>선착순 한정 혜택</li>
                <li>런칭과 동시에 수강 시작</li>
              </ul>

              <h5>🔸 쿠폰 사용법</h5>
              <ul>
                <li>결제 페이지에서 쿠폰 코드 입력</li>
                <li>쿠폰별 사용 조건 확인 필요</li>
                <li>중복 사용 불가</li>
              </ul>

              <h5>🔸 그룹 할인</h5>
              <ul>
                <li>5명 이상: 10% 추가 할인</li>
                <li>10명 이상: 15% 추가 할인</li>
                <li>기업 교육: 별도 문의</li>
              </ul>
            </div>
          `
        }
      ]
    },
    {
      category: "강의 수강",
      items: [
        {
          question: "강의는 언제까지 들을 수 있나요?",
          answer: `
            <div>
              <h4>📅 수강 기간</h4>
              
              <h5>🔸 프리미엄 강의</h5>
              <ul>
                <li><strong>3개월 수강권:</strong> 구매 후 3개월간 수강 가능</li>
                <li><strong>업데이트:</strong> 수강 기간 내 추가 콘텐츠 무료 제공</li>
                <li><strong>다운로드:</strong> 모바일 앱에서 오프라인 시청 가능 (수강 기간 내)</li>
                <li><strong>연장:</strong> 기간 만료 시 추가 결제를 통해 연장 가능</li>
              </ul>

              <h5>🔸 무료 강의</h5>
              <ul>
                <li><strong>30일 제한:</strong> 첫 시청일부터 30일간</li>
                <li><strong>재시청:</strong> 기간 내 무제한</li>
                <li><strong>연장:</strong> 유료 업그레이드 시 3개월 수강권으로 전환</li>
              </ul>
            </div>
          `
        },
        {
          question: "모바일에서도 수강할 수 있나요?",
          answer: `
            <div>
              <h4>📱 모바일 수강</h4>
              
              <h5>🔸 지원 플랫폼</h5>
              <ul>
                <li>웹 브라우저 (Chrome, Safari, Edge 등)</li>
                <li>iOS 앱 (App Store 출시 예정)</li>
                <li>Android 앱 (Play Store 출시 예정)</li>
              </ul>

              <h5>🔸 모바일 전용 기능</h5>
              <ul>
                <li>오프라인 다운로드</li>
                <li>배속 조절 (0.5x ~ 2.0x)</li>
                <li>북마크 및 메모 기능</li>
                <li>진도율 동기화</li>
              </ul>
            </div>
          `
        },
        {
          question: "수료증은 어떻게 발급받나요?",
          answer: `
            <div>
              <h4>🏆 수료증 발급</h4>
              
              <h5>🔸 발급 조건</h5>
              <ul>
                <li>프리미엄 강의 100% 완주</li>
                <li>모든 퀴즈 80점 이상</li>
                <li>최종 프로젝트 제출 (해당 시)</li>
              </ul>

              <h5>🔸 발급 과정</h5>
              <ul>
                <li>완주 후 자동으로 마이페이지에 생성</li>
                <li>PDF 다운로드 가능</li>
                <li>LinkedIn 연동 지원</li>
                <li>재발급 무료 (분실 시)</li>
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
                <li>고객센터 문의: 070-2359-3515</li>
                <li>이메일: support@connexionai.kr</li>
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

              <h5>🔸 긴급 지원</h5>
              <ul>
                <li>카카오톡: @클래튼 (실시간 상담)</li>
                <li>이메일로 답안 직접 전송 가능</li>
                <li>재시험 기회 제공</li>
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              <Phone size={20} color="#667eea" />
              <div>
                <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>고객센터</div>
                <div style={{ fontWeight: '600' }}>070-2359-3515</div>
              </div>
            </div>
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
                <div style={{ fontWeight: '600' }}>평일 10:00-18:00</div>
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
                color: '#667eea',
                borderBottom: '2px solid rgba(102, 126, 234, 0.3)',
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
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
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
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Phone size={16} />
              전화 상담
            </button>
            <button 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'inherit',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '15px 30px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
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