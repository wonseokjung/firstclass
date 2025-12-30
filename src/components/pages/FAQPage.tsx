import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Mail, Clock, HelpCircle, BookOpen, Shield, Wrench, User, ArrowRight } from 'lucide-react';
import NavigationBar from '../common/NavigationBar';

interface FAQPageProps {
  onBack: () => void;
}

// 브랜드 컬러: 네이비 + 골드
const brandColors = {
  navy: '#0d1b2a',
  navyLight: '#142238',
  navyMid: '#1e3a5f',
  gold: '#d4af37',
  goldLight: '#f4d03f',
  goldDark: '#b8960c',
  cream: '#faf8f0',
};

const FAQPage: React.FC<FAQPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]
    );
  };

  const faqData = [
    {
      category: "AI City Builders 교육",
      icon: <BookOpen size={20} color={brandColors.navy} />,
      color: brandColors.gold,
      items: [
        {
          question: "AI City Builders는 다른 AI 교육과 어떻게 다른가요?",
          answer: `
            <h4 style="color: #60a5fa; margin-bottom: 15px;">🚀 New Class of AI Creators 양성</h4>
            
            <p style="margin-bottom: 12px;"><strong style="color: #4ade80;">✓ 누구나 AI 1인 기업가가 될 수 있습니다</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
              <li>코딩, 장비, 기술 없이 AI로 콘텐츠 제작 가능</li>
              <li>교육 + 실제 도구 제공</li>
              <li>실전 수익화 방법 전수</li>
            </ul>

            <p style="margin-bottom: 12px;"><strong style="color: #a78bfa;">✓ AI 1인 기업가 네트워크</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
              <li>1인 기업가 커뮤니티에서 협력하고 성장</li>
              <li>서로의 콘텐츠와 경험 공유</li>
              <li>함께 만들어가는 AI 도시</li>
            </ul>

            <p style="margin-bottom: 12px;"><strong style="color: #f472b6;">✓ 지속 가능한 수익 구조</strong></p>
            <ul style="margin-left: 20px; line-height: 1.8;">
              <li>유튜브, 블로그 등 월 수익이 나오는 디지털 건물</li>
              <li>AI 에이전트로 콘텐츠 제작 자동화</li>
              <li>하나의 채널에서 다수의 수익원으로 확장</li>
            </ul>
          `
        },
        {
          question: "디지털 건물이란 무엇인가요?",
          answer: `
            <h4 style="color: #60a5fa; margin-bottom: 15px;">🏢 디지털 건물의 개념</h4>
            
            <p style="margin-bottom: 12px;"><strong>월세처럼 지속적인 수익을 만들어내는 디지털 자산</strong></p>
            
            <div style="background: rgba(96, 165, 250, 0.1); padding: 15px; border-radius: 10px; margin: 15px 0;">
              <p style="margin-bottom: 8px;">📺 <strong>유튜브 채널</strong> - 광고 수익</p>
              <p style="margin-bottom: 8px;">📝 <strong>블로그</strong> - SEO + 제휴 마케팅</p>
              <p style="margin-bottom: 8px;">🛒 <strong>온라인 쇼핑몰</strong> - 제품 판매</p>
              <p>📱 <strong>앱/웹 서비스</strong> - 구독 모델</p>
            </div>

            <p style="margin-top: 15px;"><strong style="color: #4ade80;">AI 기반 운영:</strong> 인공지능을 활용해 콘텐츠 생성부터 운영까지 자동화</p>
          `
        },
        {
          question: "AI 도구 사용 경험이 없어도 가능한가요?",
          answer: `
            <h4 style="color: #60a5fa; margin-bottom: 15px;">🤖 초보자도 OK!</h4>
            
            <p style="margin-bottom: 15px;">코딩이나 AI 경험이 전혀 없어도 시작할 수 있습니다.</p>

            <div style="background: rgba(74, 222, 128, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
              <p style="color: #4ade80; font-weight: 600; margin-bottom: 10px;">제공되는 학습 지원:</p>
              <ul style="margin-left: 20px; line-height: 1.8;">
                <li>단계별 학습 - 기초부터 고급까지</li>
                <li>실습 중심 - 실제 프로젝트로 도구 습득</li>
                <li>템플릿 제공 - 바로 사용 가능한 프롬프트</li>
                <li>커뮤니티 Q&A - 동료들과 경험 공유</li>
              </ul>
            </div>
          `
        }
      ]
    },
    {
      category: "환불 정책",
      icon: <Shield size={20} color={brandColors.navy} />,
      color: brandColors.goldLight,
      items: [
        {
          question: "강의 환불 정책이 어떻게 되나요?",
          answer: `
            <h4 style="color: #ef4444; margin-bottom: 15px;">📋 환불 정책 (평생교육법 시행령 제23조)</h4>
            
            <div style="background: rgba(59, 130, 246, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 3px solid #3b82f6;">
              <p>"원격교육의 형태로 이루어지는 학습에 대한 학습비 반환금액은 <strong style="color: #60a5fa;">이미 낸 학습비에서 실제 학습한 부분에 해당하는 학습비를 뺀 금액</strong>으로 한다."</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
              <tr style="background: rgba(148, 163, 184, 0.1);">
                <td style="padding: 12px; border-bottom: 1px solid rgba(148, 163, 184, 0.2);"><strong>수업 시작 전</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid rgba(148, 163, 184, 0.2); color: #4ade80; font-weight: 600;">전액 환불 💯</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid rgba(148, 163, 184, 0.2);"><strong>수업 시작 후</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">결제금액 − (1일 학습비 × 학습 일수)</td>
              </tr>
            </table>

            <p style="margin-bottom: 10px;"><strong>환불 예시:</strong></p>
            <ul style="margin-left: 20px; line-height: 1.8;">
              <li>Step 1 (45,000원) 3일차 수강 → <strong style="color: #4ade80;">31,500원</strong> 환불</li>
              <li>Step 2 (95,000원) 5일차 수강 → <strong style="color: #4ade80;">47,500원</strong> 환불</li>
            </ul>
          `
        },
        {
          question: "환불 신청은 어떻게 하나요?",
          answer: `
            <h4 style="color: #ef4444; margin-bottom: 15px;">📞 환불 신청 방법</h4>
            
            <div style="background: rgba(239, 68, 68, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
              <p style="margin-bottom: 15px; font-weight: 600;">가장 쉬운 방법!</p>
              <a href="/refund-policy" style="display: inline-block; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700;">
                📋 환불 정책 페이지로 이동
              </a>
            </div>

            <p style="margin-bottom: 12px;"><strong>온라인 신청 (권장)</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
              <li>로그인 → 환불 정책 페이지</li>
              <li>수강 중인 강의 자동 표시</li>
              <li>학습 현황 & 환불 금액 자동 계산</li>
              <li>환불 신청 버튼 클릭!</li>
            </ul>

            <p style="margin-bottom: 8px;"><strong>이메일 문의</strong></p>
            <p style="color: #a78bfa;">📧 jay@connexionai.kr (평일 09:00-18:00)</p>
          `
        }
      ]
    },
    {
      category: "기술 지원",
      icon: <Wrench size={20} color={brandColors.navy} />,
      color: brandColors.gold,
      items: [
        {
          question: "동영상이 재생되지 않아요.",
          answer: `
            <h4 style="color: #e5c100; margin-bottom: 15px;">🔧 동영상 재생 문제 해결</h4>
            
            <p style="margin-bottom: 12px;"><strong>1. 브라우저 확인</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
              <li>Chrome, Safari, Edge 최신 버전 사용</li>
              <li>브라우저 캐시 삭제 (Ctrl+Shift+Delete)</li>
              <li>광고 차단기 일시 해제</li>
            </ul>

            <p style="margin-bottom: 12px;"><strong>2. 네트워크 확인</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
              <li>안정적인 인터넷 연결 확인</li>
              <li>다른 디바이스에서 테스트</li>
            </ul>

            <p><strong>문제 지속 시:</strong> jay@connexionai.kr로 연락주세요</p>
          `
        },
        {
          question: "로그인이 안 돼요.",
          answer: `
            <h4 style="color: #e5c100; margin-bottom: 15px;">🔑 로그인 문제 해결</h4>
            
            <p style="margin-bottom: 12px;"><strong>비밀번호 분실 시</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
              <li>로그인 페이지 → "비밀번호 찾기" 클릭</li>
              <li>가입 이메일로 재설정 코드 발송</li>
              <li>새 비밀번호 설정</li>
            </ul>

            <p style="margin-bottom: 12px;"><strong>계정 찾기</strong></p>
            <p>가입 시 사용한 이메일이 기억나지 않으시면<br/>jay@connexionai.kr로 문의해주세요.</p>
          `
        }
      ]
    },
    {
      category: "계정 및 개인정보",
      icon: <User size={20} color={brandColors.navy} />,
      color: brandColors.goldLight,
      items: [
        {
          question: "회원가입은 어떻게 하나요?",
          answer: `
            <h4 style="color: #8b5cf6; margin-bottom: 15px;">👤 회원가입 안내</h4>
            
            <p style="margin-bottom: 12px;"><strong>가입 방법</strong></p>
            <ol style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
              <li>홈페이지 우측 상단 "회원가입" 클릭</li>
              <li>이메일 + 비밀번호 입력</li>
              <li>이름 입력 후 가입 완료!</li>
            </ol>

            <div style="background: rgba(139, 92, 246, 0.1); padding: 15px; border-radius: 10px;">
              <p style="color: #a78bfa; font-weight: 600; margin-bottom: 10px;">🎁 회원 혜택</p>
              <ul style="margin-left: 20px; line-height: 1.8;">
                <li>수강 진도 자동 저장</li>
                <li>추천 코드 발급 (친구 추천 리워드)</li>
                <li>파트너 프로그램 참여 가능</li>
                <li>커뮤니티 참여</li>
              </ul>
            </div>
          `
        },
        {
          question: "개인정보는 어떻게 보호되나요?",
          answer: `
            <h4 style="color: #8b5cf6; margin-bottom: 15px;">🔒 개인정보 보호</h4>
            
            <p style="margin-bottom: 12px;"><strong>수집 정보</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
              <li>필수: 이름, 이메일</li>
              <li>선택: 추천인 코드</li>
            </ul>

            <p style="margin-bottom: 12px;"><strong>보호 조치</strong></p>
            <ul style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
              <li>SSL 암호화 통신</li>
              <li>개인정보 암호화 저장</li>
              <li>Azure 보안 인프라 사용</li>
            </ul>

            <p style="color: #94a3b8; font-size: 0.9rem;">※ 자세한 내용은 개인정보처리방침을 참조해주세요.</p>
          `
        }
      ]
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${brandColors.navy} 0%, ${brandColors.navyLight} 50%, ${brandColors.navy} 100%)`,
      color: brandColors.cream,
    },
    content: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 20px 80px',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '50px',
    },
    title: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: '800',
      background: `linear-gradient(135deg, ${brandColors.gold} 0%, ${brandColors.goldLight} 50%, ${brandColors.gold} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '15px',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#8899aa',
      marginBottom: 'clamp(20px, 4vw, 40px)',
    },
    contactBox: {
      display: 'flex',
      justifyContent: 'center',
      gap: '40px',
      flexWrap: 'wrap' as const,
      background: `linear-gradient(135deg, ${brandColors.navyLight}ee, ${brandColors.navyMid}aa)`,
      padding: '25px 30px',
      borderRadius: '16px',
      border: `1px solid ${brandColors.gold}30`,
    },
    categorySection: {
      marginBottom: 'clamp(20px, 4vw, 40px)',
    },
    categoryTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      paddingBottom: '15px',
      borderBottom: `2px solid ${brandColors.gold}40`,
      color: brandColors.gold,
    },
    faqItem: {
      background: `${brandColors.navyLight}cc`,
      borderRadius: '14px',
      marginBottom: '12px',
      border: `1px solid ${brandColors.gold}20`,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    },
    question: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '22px 25px',
      background: 'none',
      border: 'none',
      color: brandColors.cream,
      fontSize: '1.05rem',
      fontWeight: '600',
      cursor: 'pointer',
      textAlign: 'left' as const,
    },
    answer: {
      padding: '0 25px 25px',
      borderTop: `1px solid ${brandColors.gold}20`,
      color: '#c8d4e0',
      lineHeight: '1.8',
    },
    supportSection: {
      background: `linear-gradient(135deg, ${brandColors.navyMid}80, ${brandColors.navyLight}80)`,
      border: `1px solid ${brandColors.gold}40`,
      padding: '40px',
      borderRadius: '20px',
      textAlign: 'center' as const,
      marginTop: '50px',
    },
    button: {
      background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.goldDark})`,
      color: brandColors.navy,
      border: 'none',
      padding: '15px 30px',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      margin: '0 10px',
      boxShadow: `0 4px 15px ${brandColors.gold}40`,
    },
    refundButton: {
      background: `linear-gradient(135deg, ${brandColors.goldLight}, ${brandColors.gold})`,
    },
  };

  return (
    <div style={styles.container}>
      <NavigationBar onBack={onBack} breadcrumbText="FAQ" />

      <div style={styles.content}>
        {/* 헤더 */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            <HelpCircle style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} size={40} />
            자주 묻는 질문
          </h1>
          <p style={styles.subtitle}>
            궁금한 사항을 빠르게 찾아보세요
          </p>

          <div style={styles.contactBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.goldDark})`, padding: '10px', borderRadius: '10px' }}>
                <Mail size={20} color={brandColors.navy} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', color: '#6b7c8a' }}>이메일</div>
                <div style={{ fontWeight: '600', color: brandColors.cream }}>jay@connexionai.kr</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: `linear-gradient(135deg, ${brandColors.goldLight}, ${brandColors.gold})`, padding: '10px', borderRadius: '10px' }}>
                <Clock size={20} color={brandColors.navy} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', color: '#6b7c8a' }}>운영시간</div>
                <div style={{ fontWeight: '600', color: brandColors.cream }}>평일 09:00-18:00</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ 콘텐츠 */}
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} style={styles.categorySection}>
            <h2 style={{ ...styles.categoryTitle }}>
              <div style={{ 
                background: `linear-gradient(135deg, ${brandColors.gold}, ${brandColors.goldDark})`,
                padding: '10px',
                borderRadius: '10px',
                color: brandColors.navy,
              }}>
                {category.icon}
              </div>
              {category.category}
            </h2>
            
            {category.items.map((item, itemIndex) => {
              const globalIndex = categoryIndex * 100 + itemIndex;
              const isOpen = openItems.includes(globalIndex);
              
              return (
                <div 
                  key={itemIndex} 
                  style={{
                    ...styles.faqItem,
                    background: isOpen ? `${brandColors.navyMid}ee` : `${brandColors.navyLight}cc`,
                    borderColor: isOpen ? `${brandColors.gold}50` : `${brandColors.gold}20`,
                  }}
                >
                  <button style={styles.question} onClick={() => toggleItem(globalIndex)}>
                    <span>{item.question}</span>
                    <ChevronDown 
                      size={20} 
                      color={brandColors.gold}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  
                  {isOpen && (
                    <div style={styles.answer} dangerouslySetInnerHTML={{ __html: item.answer }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* 추가 지원 섹션 */}
        <div style={styles.supportSection}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px', color: brandColors.cream }}>
            원하는 답변을 찾지 못하셨나요?
          </h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#8899aa' }}>
            전문 상담원이 친절하게 도와드리겠습니다
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              style={styles.button}
              onClick={() => window.location.href = 'mailto:jay@connexionai.kr'}
            >
              <Mail size={18} />
              이메일 문의
            </button>
            <button 
              style={{ ...styles.button, ...styles.refundButton }}
              onClick={() => navigate('/refund-policy')}
            >
              📋 환불 신청
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
