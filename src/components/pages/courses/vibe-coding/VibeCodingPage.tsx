import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../../common/NavigationBar';
import { Code, Rocket, Terminal, Calendar } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface VibeCodingPageProps {
  onBack: () => void;
}

const VibeCodingPage: React.FC<VibeCodingPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [, setUserInfo] = useState<any>(null);

  // 오픈일: 2026년 1월 1일 (수강신청 가능)
  const openDate = new Date(2026, 0, 1);
  // 얼리버드 종료일: 2026년 1월 31일
  const earlyBirdEndDate = new Date(2026, 0, 31, 23, 59, 59);
  const now = new Date();
  const isOpen = now >= openDate;
  const isEarlyBird = now >= openDate && now <= earlyBirdEndDate;

  // 가격
  const earlyBirdPrice = 45000;
  const regularPrice = 95000;
  const coursePrice = isEarlyBird ? earlyBirdPrice : regularPrice;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);

          try {
            const paymentStatus = await AzureTableService.checkCoursePayment(
              parsedUserInfo.email,
              'vibe-coding'
            );
            if (paymentStatus && paymentStatus.isPaid) {
              setIsPaidUser(true);
            }
          } catch (error) {
            console.error('❌ 결제 상태 확인 실패:', error);
          }
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
      }
    };

    checkAuthStatus();
  }, []);

  const handlePayment = () => {
    const sessionUserInfo = sessionStorage.getItem('aicitybuilders_user_session');
    if (!sessionUserInfo) {
      const confirmLogin = window.confirm('로그인이 필요한 서비스입니다. 먼저 로그인해주세요.\n\n로그인 페이지로 이동하시겠습니까?');
      if (confirmLogin) {
        window.location.href = '/login';
      }
      return;
    }
    window.location.href = '/vibe-coding/payment';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%)',
      paddingBottom: isPaidUser ? '0' : '100px'
    }}>
      <NavigationBar onBack={onBack} breadcrumbText="Step 3: 바이브코딩" />

      {/* 고정 결제 버튼 */}
      <FloatingPaymentButton onClick={handlePayment} isOpen={isOpen} isPaidUser={isPaidUser} price={coursePrice} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 4vw, 20px)' }}>

        {/* 결제한 사용자를 위한 "내 강의 보기" 버튼 */}
        {isPaidUser && (
          <div style={{
            background: 'linear-gradient(135deg, #1e3a5f, #0d1b2a)',
            borderRadius: '20px',
            padding: 'clamp(25px, 5vw, 40px)',
            marginBottom: '40px',
            boxShadow: '0 15px 50px rgba(255, 214, 10, 0.3)',
            border: '3px solid #ffd60a',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎉</div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: 'white', marginBottom: '15px' }}>
              이미 수강 중인 강의입니다!
            </h2>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', color: '#e0e7ff', marginBottom: '25px' }}>
              아래 버튼을 클릭하여 강의를 계속 학습하세요 📚
            </p>
            <button
              onClick={() => navigate('/vibe-coding-player')}
              style={{
                background: '#ffd60a',
                color: '#0d1b2a',
                border: 'none',
                padding: '18px 50px',
                borderRadius: '15px',
                fontSize: '1.2rem',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
              }}
            >
              📚 내 강의 보기
            </button>
          </div>
        )}

        {/* 🎬 히어로 섹션 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.3), rgba(255, 214, 10, 0.1))',
          borderRadius: '30px',
          padding: 'clamp(30px, 6vw, 60px)',
          marginBottom: '40px',
          border: '2px solid rgba(255, 214, 10, 0.3)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 장식 */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'rgba(255, 214, 10, 0.1)',
            borderRadius: '50%',
            filter: 'blur(80px)'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* 아이콘 */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #1e3a5f, #ffd60a)',
              borderRadius: '50%',
              marginBottom: '25px',
              boxShadow: '0 15px 50px rgba(255, 214, 10, 0.4)'
            }}>
              <Code size={45} color="white" />
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '900',
              color: 'white',
              marginBottom: '15px',
              lineHeight: 1.2
            }}>
              Step 3: <span style={{
                background: 'linear-gradient(135deg, #ffd60a, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>바이브코딩</span>
            </h1>

            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: '#ffd60a',
              fontWeight: '600',
              marginBottom: '25px'
            }}>
              AI로 실제 돈 버는 비즈니스 만들기
            </p>

            {/* 오픈 상태 배지 */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: isOpen ? 'rgba(34, 197, 94, 0.2)' : 'rgba(139, 92, 246, 0.2)',
              border: `2px solid ${isOpen ? '#22c55e' : '#8b5cf6'}`,
              padding: '12px 25px',
              borderRadius: '50px',
              marginBottom: '30px'
            }}>
              <Calendar size={22} color={isOpen ? '#22c55e' : '#a78bfa'} />
              <span style={{
                color: isOpen ? '#22c55e' : '#a78bfa',
                fontWeight: '700',
                fontSize: '1.1rem'
              }}>
                {isOpen ? '🎉 지금 수강 가능!' : '📅 2026년 1월 8일 오픈'}
              </span>
            </div>

            {/* 설명 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '20px',
              padding: '25px',
              maxWidth: '700px',
              margin: '0 auto 30px'
            }}>
              <p style={{
                fontSize: '1.1rem',
                color: '#e2e8f0',
                lineHeight: 1.9,
                margin: 0
              }}>
                단순히 AI 도구를 배우는 것에서 벗어나<br />
                <strong style={{ color: '#ffd60a' }}>AI와 AI Agent로 개발부터 운영까지</strong> 되는<br />
                <strong style={{ color: '#8b5cf6' }}>실제 비즈니스</strong>를 함께 만듭니다.
              </p>
            </div>

            {/* 특징 배지들 */}
            <div style={{
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '30px'
            }}>
              {[
                { icon: <Terminal size={20} />, label: '코딩 경험 불필요' },
                { icon: <Rocket size={20} />, label: 'AI 1인 기업' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 214, 10, 0.15)',
                  padding: '10px 18px',
                  borderRadius: '25px',
                  border: '1px solid rgba(255, 214, 10, 0.4)'
                }}>
                  <span style={{ color: '#ffd60a' }}>{item.icon}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.9rem' }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* 🗓️ 1~4주 커리큘럼 로드맵 */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '20px',
              padding: 'clamp(20px, 4vw, 30px)',
              border: '2px solid rgba(16, 185, 129, 0.4)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                  fontWeight: '700'
                }}>
                  바이브코딩
                </div>
                <span style={{ color: '#94a3b8', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>매주 목 밤 8시</span>
              </div>

              <h3 style={{
                color: 'white',
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                fontWeight: '800',
                marginBottom: '20px'
              }}>
                자동화 툴 직접 개발
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'clamp(10px, 2vw, 15px)'
              }}>
                {[
                  { week: '1주', task: '설계' },
                  { week: '2주', task: '개발' },
                  { week: '3주', task: '테스트' },
                  { week: '4주', task: '배포' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: 'clamp(12px, 2vw, 16px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{
                      color: '#10b981',
                      fontWeight: '800',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'
                    }}>{item.week}</span>
                    <span style={{
                      color: '#e2e8f0',
                      fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'
                    }}>{item.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 💰 가격 & 가치 강조 섹션 */}
      <div style={{
        background: 'linear-gradient(135deg, #ffd60a, #f59e0b)',
        borderRadius: '25px',
        padding: 'clamp(30px, 5vw, 50px)',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
          fontWeight: '900',
          color: '#1a1a2e',
          marginBottom: '20px'
        }}>
          💰 이 가격 실화?
        </h2>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '25px'
        }}>
          <div style={{
            background: '#1a1a2e',
            padding: '15px 30px',
            borderRadius: '20px',
            position: 'relative'
          }}>
            {isEarlyBird && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#ef4444',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '800'
              }}>
                🔥 얼리버드 (~1/31)
              </div>
            )}
            {isEarlyBird && (
              <div style={{
                color: '#94a3b8',
                textDecoration: 'line-through',
                fontSize: '1rem',
                marginBottom: '5px'
              }}>
                ₩{regularPrice.toLocaleString()}
              </div>
            )}
            <span style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: '900' }}>
              ₩{coursePrice.toLocaleString()}
            </span>
            <span style={{ color: '#a78bfa', fontSize: '1rem', marginLeft: '10px' }}>/ 3개월</span>
          </div>
          <div style={{
            background: '#22c55e',
            padding: '15px 25px',
            borderRadius: '20px',
            border: '3px solid #16a34a'
          }}>
            <div style={{ color: 'white', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '900' }}>
              {isEarlyBird ? '🔥 월 1.5만원!' : '🔥 월 3만원대!'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>
              {isEarlyBird ? '하루 ~500원' : '하루 ~1,000원'}
            </div>
          </div>
        </div>

        {/* 구성 내용 */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 'clamp(8px, 2vw, 15px)',
          marginBottom: 'clamp(15px, 4vw, 20px)'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.15)',
            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(5px, 1.5vw, 8px)'
          }}>
            <span style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>📚</span>
            <span style={{ color: '#1a1a2e', fontWeight: '700', fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>강의 10개</span>
          </div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.15)',
            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(5px, 1.5vw, 8px)'
          }}>
            <span style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>🔴</span>
            <span style={{ color: '#1a1a2e', fontWeight: '700', fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>라이브 12회</span>
          </div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.15)',
            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(5px, 1.5vw, 8px)'
          }}>
            <span style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>🎯</span>
            <span style={{ color: '#1a1a2e', fontWeight: '700', fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>프로젝트 3개</span>
          </div>
        </div>

        {/* 가성비 계산 */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: 'clamp(12px, 3vw, 15px) clamp(15px, 4vw, 25px)',
          borderRadius: '15px',
          display: 'inline-block'
        }}>
          <span style={{ color: '#1a1a2e', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>22개 콘텐츠 = </span>
          <span style={{ color: '#1a1a2e', fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: '900' }}>개당 2,045원</span>
          <span style={{ color: '#1a1a2e', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)', marginLeft: 'clamp(5px, 2vw, 10px)' }}>☕ 커피 반 잔!</span>
        </div>

        {/* 얼리버드 안내 */}
        {isEarlyBird && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.9)',
            padding: 'clamp(15px, 4vw, 20px)',
            borderRadius: '15px',
            marginTop: 'clamp(15px, 4vw, 25px)',
            border: '2px solid #dc2626'
          }}>
            <p style={{ color: 'white', fontSize: 'clamp(0.9rem, 2.8vw, 1.1rem)', fontWeight: '700', margin: 0, lineHeight: 1.8 }}>
              ⚠️ <strong>1월 31일까지</strong> 얼리버드 ₩45,000<br />
              → 2월부터 <strong>정상가 ₩95,000</strong> 인상!
            </p>
          </div>
        )}

        {/* 얼리버드 기간 안내 */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: 'clamp(12px, 3vw, 15px) clamp(15px, 4vw, 25px)',
          borderRadius: '15px',
          marginTop: 'clamp(15px, 3vw, 20px)'
        }}>
          <p style={{ color: '#1a1a2e', fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', margin: 0, lineHeight: 1.9 }}>
            📌 <strong>얼리버드 기간 안내</strong><br />
            • 기초 강의는 <strong>1월 중 단계별로 업로드</strong> 예정<br />
            • 커리큘럼은 <strong>변동 가능성</strong>이 있습니다
          </p>
        </div>
      </div>

      {/* 🚀 이런 것들을 만들 수 있어요 */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        borderRadius: '25px',
        padding: 'clamp(30px, 5vw, 50px)',
        marginBottom: '40px',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        <h2 style={{
          color: '#a78bfa',
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          🚀 바이브코딩으로 만들 수 있는 것들
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px'
        }}>
          {[
            { icon: '🌐', title: '랜딩페이지', desc: '제품/서비스 홍보' },
            { icon: '🤖', title: '자동화 봇', desc: '반복 작업 자동화' },
            { icon: '💰', title: 'SaaS 서비스', desc: '구독형 수익 모델' },
            { icon: '📱', title: '웹/모바일 앱', desc: '크로스 플랫폼' },
            { icon: '🛒', title: '커머스', desc: '온라인 쇼핑몰' },
            { icon: '📊', title: '대시보드', desc: '데이터 시각화' }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(139, 92, 246, 0.15)',
              borderRadius: '20px',
              padding: '25px 20px',
              textAlign: 'center',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              transition: 'transform 0.2s'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
              <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '5px' }}>{item.title}</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 📚 수강생 특전 */}
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        borderRadius: '25px',
        padding: 'clamp(30px, 5vw, 50px)',
        marginBottom: '40px',
        border: '3px solid #a78bfa'
      }}>
        <h2 style={{
          color: 'white',
          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          🎁 수강생 특전
        </h2>
        <p style={{
          color: '#e0e7ff',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '1.05rem'
        }}>
          강의 + <span style={{ color: '#ffd60a' }}>매주 라이브</span> + 커뮤니티
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {/* 기본 강의 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '30px',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px', textAlign: 'center' }}>📚</div>
            <h4 style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem', marginBottom: '15px', textAlign: 'center' }}>
              기본 강의 10개
            </h4>
            <ul style={{ color: '#e0e7ff', lineHeight: 2, paddingLeft: '20px', margin: 0 }}>
              <li>바이브코딩 기초부터 수익화까지</li>
              <li>Google Antigravity 완벽 마스터</li>
              <li>3개월간 무제한 시청</li>
            </ul>
          </div>

          {/* 주간 라이브 */}
          <div style={{
            background: 'rgba(255, 214, 10, 0.2)',
            borderRadius: '20px',
            padding: '30px',
            border: '2px solid #ffd60a'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px', textAlign: 'center' }}>🔴</div>
            <h4 style={{ color: '#ffd60a', fontWeight: '800', fontSize: '1.2rem', marginBottom: '15px', textAlign: 'center' }}>
              매주 목요일 라이브
            </h4>
            <ul style={{ color: '#e0e7ff', lineHeight: 2, paddingLeft: '20px', margin: 0 }}>
              <li>밤 8시 실시간 프로젝트 진행</li>
              <li>Q&A 및 피드백</li>
              <li>3개월간 12회 참여</li>
            </ul>
          </div>

          {/* 커뮤니티 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '30px',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px', textAlign: 'center' }}>👥</div>
            <h4 style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem', marginBottom: '15px', textAlign: 'center' }}>
              수강생 커뮤니티
            </h4>
            <ul style={{ color: '#e0e7ff', lineHeight: 2, paddingLeft: '20px', margin: 0 }}>
              <li>함께 성장하는 네트워크</li>
              <li>프로젝트 피드백 공유</li>
              <li>수강생 전용 커뮤니티</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 📺 인공지능의 EBS 섹션 */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
        borderRadius: '25px',
        padding: 'clamp(30px, 5vw, 50px)',
        marginBottom: '40px',
        border: '3px solid #06b6d4',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(6, 182, 212, 0.15)',
          borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            padding: '10px 25px',
            borderRadius: '30px',
            marginBottom: '25px'
          }}>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '1rem' }}>
              📺 인공지능의 EBS
            </span>
          </div>

          <h3 style={{
            color: 'white',
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: '800',
            marginBottom: '20px',
            lineHeight: 1.4
          }}>
            🤔 AI 도구가 매일 바뀌는데<br />어떻게 따라가죠?
          </h3>

          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            marginBottom: '25px'
          }}>
            Google Antigravity, Gemini, Claude... <strong style={{ color: '#06b6d4' }}>매주 새로운 기능</strong>이 나옵니다.<br />
            녹화 강의만으로는 <strong style={{ color: '#06b6d4' }}>최신 기능을 따라갈 수 없습니다.</strong><br /><br />
            그래서 <strong style={{ color: '#ffd60a' }}>매주 라이브</strong>로 최신 AI 도구를 업데이트합니다! 👇
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px'
          }}>
            {['🎯 실시간 Q&A', '🔥 최신 AI 업데이트', '💻 라이브 코딩', '📁 프로젝트 파일'].map((item) => (
              <div key={item} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '14px 15px',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                textAlign: 'center',
                border: '1px solid rgba(6, 182, 212, 0.3)'
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📋 커리큘럼 미리보기 */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        borderRadius: '25px',
        padding: 'clamp(30px, 5vw, 50px)',
        marginBottom: '40px',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        <h2 style={{
          color: '#a78bfa',
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          📋 커리큘럼
        </h2>
        <p style={{
          color: '#94a3b8',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '1rem'
        }}>
          기초 강의 10개 + 매달 새로운 프로젝트 (3개월 = 3개 서비스!)
        </p>

        {/* 기초 강의 10개 */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.15)',
          borderRadius: '20px',
          padding: '25px',
          border: '2px solid rgba(139, 92, 246, 0.3)',
          marginBottom: '25px'
        }}>
          <h4 style={{ color: '#a78bfa', fontWeight: '800', marginBottom: '20px', fontSize: '1.2rem' }}>
            🏋️ 기초 강의 10개 (기초 근육 만들기)
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            <div>
              <ul style={{ color: '#e2e8f0', lineHeight: 2.2, paddingLeft: '20px', margin: 0 }}>
                <li><strong style={{ color: '#a78bfa' }}>Day 1-2:</strong> 기본 코딩 + 터미널 기초</li>
                <li><strong style={{ color: '#a78bfa' }}>Day 3:</strong> AI 모델 API 불러오기</li>
                <li><strong style={{ color: '#a78bfa' }}>Day 4:</strong> GitHub 만들기 & 사용법</li>
                <li><strong style={{ color: '#a78bfa' }}>Day 5:</strong> Microsoft Azure 가입</li>
              </ul>
            </div>
            <div>
              <ul style={{ color: '#e2e8f0', lineHeight: 2.2, paddingLeft: '20px', margin: 0 }}>
                <li><strong style={{ color: '#06b6d4' }}>Day 6:</strong> Google Antigravity 소개</li>
                <li><strong style={{ color: '#06b6d4' }}>Day 7:</strong> 프론트엔드 → Azure 배포</li>
                <li><strong style={{ color: '#06b6d4' }}>Day 8:</strong> 도메인 구입 & 연결</li>
                <li><strong style={{ color: '#06b6d4' }}>Day 9:</strong> 백엔드 테이블 & Blob</li>
                <li><strong style={{ color: '#06b6d4' }}>Day 10:</strong> 프론트 + 백엔드 연동</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 월간 프로젝트 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 214, 10, 0.15), rgba(245, 158, 11, 0.1))',
          borderRadius: '20px',
          padding: '25px',
          border: '2px solid rgba(255, 214, 10, 0.4)'
        }}>
          <h4 style={{ color: '#ffd60a', fontWeight: '800', marginBottom: '20px', fontSize: '1.2rem' }}>
            🚀 매달 프로젝트 (4주 사이클로 서비스 완성!)
          </h4>
          <p style={{ color: '#e2e8f0', marginBottom: '20px', lineHeight: 1.8 }}>
            매달 새로운 주제로 <strong style={{ color: '#ffd60a' }}>실제 수익화 가능한 서비스</strong>를 함께 만듭니다.<br />
            <span style={{ color: '#94a3b8' }}>3개월 수강 = 3개 서비스 런칭! 🎉</span>
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {[
              { week: '1주차', title: '기획 & 프론트엔드', desc: '아이디어 → 화면 구현', color: '#8b5cf6' },
              { week: '2주차', title: '핵심 기능 & 디자인', desc: '기능 개발 + UI 고도화', color: '#06b6d4' },
              { week: '3주차', title: '백엔드 연결', desc: 'DB + API 구축', color: '#22c55e' },
              { week: '4주차', title: '결제 & 런칭', desc: '결제 연동 → 배포!', color: '#ffd60a' }
            ].map((item) => (
              <div key={item.week} style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '15px',
                borderLeft: `4px solid ${item.color}`
              }}>
                <div style={{ color: item.color, fontWeight: '800', fontSize: '0.9rem', marginBottom: '5px' }}>
                  {item.week}
                </div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '1rem', marginBottom: '3px' }}>
                  {item.title}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '15px',
            marginTop: '15px',
            textAlign: 'center'
          }}>
            <span style={{ color: '#94a3b8' }}>📺 </span>
            <span style={{ color: '#e2e8f0' }}>라이브 참석 못해도 </span>
            <strong style={{ color: '#ffd60a' }}>1달간 다시보기</strong>
            <span style={{ color: '#e2e8f0' }}> 가능!</span>
          </div>
        </div>
      </div>

      {/* 👨‍🏫 멘토 소개 - 신뢰 강조 */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1b2a, #1b263b)',
        borderRadius: '25px',
        padding: 'clamp(30px, 5vw, 50px)',
        marginBottom: '40px',
        border: '3px solid #ffd60a',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{
          color: '#ffd60a',
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: '800',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          👨‍💼 멘토 소개: 정원석 (Jay)
        </h2>

        {/* 멘토 프로필 요약 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(10px, 3vw, 15px)',
          marginBottom: '25px',
          flexWrap: 'wrap'
        }}>
          {['🏢 커넥젼에이아이 대표', '🎓 서울사이버대학교 대우교수', '📱 인스타그램 30만+'].map((item) => (
            <div key={item} style={{
              background: '#1e3a5f',
              color: 'white',
              padding: 'clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)',
              borderRadius: '25px',
              fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
              fontWeight: '600',
              border: '1px solid #ffd60a'
            }}>
              {item}
            </div>
          ))}
        </div>

        {/* 프로필 사진 & 설명 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '25px',
          marginBottom: '30px'
        }}>
          <div style={{
            width: 'clamp(120px, 25vw, 150px)',
            height: 'clamp(120px, 25vw, 150px)',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e3a5f, #ffd60a)',
            padding: '4px',
            boxShadow: '0 15px 40px rgba(255, 214, 10, 0.3)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#1a1a2e'
            }}>
              <img
                src="/images/jaymentor.PNG"
                alt="Jay 멘토"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>
          <p style={{
            color: '#e0e7ff',
            fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            lineHeight: '1.8',
            textAlign: 'center',
            maxWidth: '600px'
          }}>
            AI 솔루션 개발과 컨설팅을 통한 디지털 트랜스포메이션을 선도하며,<br />
            차세대 AI 인재 양성과 AI 지식 대중화에 힘쓰고 있습니다.
          </p>
        </div>

        {/* 학력 섹션 - 성적증명서 이미지 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'clamp(15px, 3vw, 25px)'
        }}>
          {/* 석사 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: 'clamp(20px, 4vw, 25px)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 214, 10, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#1e3a5f',
              color: '#ffd60a',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              fontWeight: '700',
              marginBottom: '15px',
              display: 'inline-block'
            }}>
              🎓 석사
            </div>
            <h4 style={{ color: 'white', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', fontWeight: '800', marginBottom: '8px' }}>
              일리노이공대
            </h4>
            <p style={{ color: '#94a3b8', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', marginBottom: '8px' }}>
              Illinois Institute of Technology
            </p>
            <p style={{ color: '#ffd60a', fontSize: 'clamp(0.9rem, 2vw, 1rem)', fontWeight: '600' }}>
              Data Science (MS)
            </p>
          </div>

          {/* 학사 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: 'clamp(20px, 4vw, 25px)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 214, 10, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#1e3a5f',
              color: '#ffd60a',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              fontWeight: '700',
              marginBottom: '15px',
              display: 'inline-block'
            }}>
              🎓 학사
            </div>
            <h4 style={{ color: 'white', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', fontWeight: '800', marginBottom: '8px' }}>
              뉴욕시립대
            </h4>
            <p style={{ color: '#94a3b8', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', marginBottom: '8px' }}>
              CUNY Baruch College
            </p>
            <p style={{ color: '#ffd60a', fontSize: 'clamp(0.9rem, 2vw, 1rem)', fontWeight: '600' }}>
              Data Science (BS)
            </p>
          </div>
        </div>
      </div>

      {/* CTA 버튼 */}
      <div style={{ textAlign: 'center' }}>
        {isOpen ? (
          <button
            onClick={isPaidUser ? () => navigate('/vibe-coding-player') : handlePayment}
            style={{
              background: isPaidUser
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              border: 'none',
              color: 'white',
              padding: '20px 60px',
              borderRadius: '20px',
              fontSize: '1.3rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: isPaidUser
                ? '0 10px 40px rgba(34, 197, 94, 0.4)'
                : '0 10px 40px rgba(139, 92, 246, 0.4)'
            }}
          >
            {isPaidUser ? '📚 강의 시작하기' : '🚀 지금 수강 신청하기'}
          </button>
        ) : (
          <button
            disabled
            style={{
              background: 'rgba(139, 92, 246, 0.3)',
              border: '2px solid #8b5cf6',
              color: '#a78bfa',
              padding: '20px 60px',
              borderRadius: '20px',
              fontSize: '1.3rem',
              fontWeight: '700',
              cursor: 'not-allowed'
            }}
          >
            📅 1월 8일 오픈 예정
          </button>
        )}
      </div>
    </div>
  );
};

// 고정 결제 버튼 컴포넌트
const FloatingPaymentButton: React.FC<{ onClick: () => void; isOpen: boolean; isPaidUser: boolean; price: number }> = ({ onClick, isOpen, isPaidUser, price }) => {
  if (!isOpen || isPaidUser) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
      padding: '15px 20px',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      borderTop: '3px solid #ffd60a'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: '#ffd60a', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '900' }}>
          ₩{price.toLocaleString()}
        </span>
        <span style={{ color: '#22c55e', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', fontWeight: '700' }}>
          월 ~3만원
        </span>
      </div>
      <button
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, #ffd60a, #f59e0b)',
          color: '#7c3aed',
          border: 'none',
          padding: 'clamp(12px, 3vw, 16px) clamp(25px, 5vw, 40px)',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          fontWeight: '900',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(255, 214, 10, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>🚀</span>
        지금 결제하기
      </button>
    </div>
  );
};

export { FloatingPaymentButton };
export default VibeCodingPage;
