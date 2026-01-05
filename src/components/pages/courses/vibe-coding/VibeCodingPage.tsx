import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../../common/NavigationBar';
import { Code, Zap, Rocket, Terminal, Users, Calendar, CheckCircle, Play, Download, TrendingUp, Sparkles } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';

interface VibeCodingPageProps {
  onBack: () => void;
}

const VibeCodingPage: React.FC<VibeCodingPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // 오픈일: 2026년 1월 8일
  const openDate = new Date(2026, 0, 8);
  const now = new Date();
  const isOpen = now >= openDate;

  // 가격
  const coursePrice = 95000;

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
      background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1033 50%, #0f0a1e 100%)',
      paddingBottom: isPaidUser ? '0' : '100px'
    }}>
      <NavigationBar onBack={onBack} breadcrumbText="Step 3: 바이브코딩" />

      {/* 고정 결제 버튼 */}
      <FloatingPaymentButton onClick={handlePayment} isOpen={isOpen} isPaidUser={isPaidUser} price={coursePrice} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 4vw, 20px)' }}>

        {/* 결제한 사용자를 위한 "내 강의 보기" 버튼 */}
        {isPaidUser && (
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            borderRadius: '20px',
            padding: 'clamp(25px, 5vw, 40px)',
            marginBottom: '40px',
            boxShadow: '0 15px 50px rgba(139, 92, 246, 0.4)',
            border: '3px solid #a78bfa',
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
                background: 'white',
                color: '#7c3aed',
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
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.1))',
          borderRadius: '30px',
          padding: 'clamp(30px, 6vw, 60px)',
          marginBottom: '40px',
          border: '2px solid rgba(139, 92, 246, 0.3)',
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
            background: 'rgba(139, 92, 246, 0.15)',
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
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              borderRadius: '50%',
              marginBottom: '25px',
              boxShadow: '0 15px 50px rgba(139, 92, 246, 0.5)'
            }}>
              <Code size={45} color="white" />
            </div>

            {/* 타이틀 */}
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '900',
              color: 'white',
              marginBottom: '15px',
              lineHeight: 1.2
            }}>
              Step 3: <span style={{
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>바이브코딩</span>
            </h1>

            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: '#a78bfa',
              fontWeight: '600',
              marginBottom: '25px'
            }}>
              AI 수익화 도구를 직접 만들기 · 10일 완성
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
                <strong style={{ color: '#8b5cf6' }}>Google Antigravity</strong>로
                자동화 에이전트와 웹/앱을 직접 개발!<br /><br />
                코딩을 몰라도 AI에게 말하면 완성됩니다.
                나만의 <strong style={{ color: '#ffd60a' }}>수익화 도구</strong>를 만들어보세요.
              </p>
            </div>

            {/* 특징 배지들 */}
            <div style={{
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {[
                { icon: <Terminal size={20} />, label: '코딩 경험 불필요' },
                { icon: <Zap size={20} />, label: '30분만에 앱 완성' },
                { icon: <Rocket size={20} />, label: '실전 수익화' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  padding: '10px 18px',
                  borderRadius: '25px',
                  border: '1px solid rgba(139, 92, 246, 0.4)'
                }}>
                  <span style={{ color: '#a78bfa' }}>{item.icon}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.9rem' }}>{item.label}</span>
                </div>
              ))}
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
              borderRadius: '20px'
            }}>
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
                🔥 월 3만원대!
              </div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>
                하루 ~1,000원
              </div>
            </div>
          </div>

          {/* 구성 내용 */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.15)',
              padding: '12px 20px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.3rem' }}>📚</span>
              <span style={{ color: '#1a1a2e', fontWeight: '700' }}>기초 강의 10개</span>
            </div>
            <div style={{
              background: 'rgba(0, 0, 0, 0.15)',
              padding: '12px 20px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.3rem' }}>🔴</span>
              <span style={{ color: '#1a1a2e', fontWeight: '700' }}>주간 라이브 12회</span>
            </div>
            <div style={{
              background: 'rgba(0, 0, 0, 0.15)',
              padding: '12px 20px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.3rem' }}>🎯</span>
              <span style={{ color: '#1a1a2e', fontWeight: '700' }}>월간 프로젝트 3개</span>
            </div>
          </div>

          {/* 가성비 계산 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '15px 25px',
            borderRadius: '15px',
            display: 'inline-block'
          }}>
            <span style={{ color: '#1a1a2e', fontSize: '1rem' }}>22개 콘텐츠 = </span>
            <span style={{ color: '#1a1a2e', fontSize: '1.3rem', fontWeight: '900' }}>개당 4,318원</span>
            <span style={{ color: '#1a1a2e', fontSize: '0.9rem', marginLeft: '10px' }}>☕ 커피 한 잔 가격!</span>
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
                <li>멘토 제이와 직접 소통</li>
                <li>프로젝트 피드백 공유</li>
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
            marginBottom: '30px'
          }}>
            📋 10일 커리큘럼
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {/* Part 1 */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.15)',
              borderRadius: '20px',
              padding: '25px',
              border: '2px solid rgba(139, 92, 246, 0.3)'
            }}>
              <h4 style={{ color: '#a78bfa', fontWeight: '800', marginBottom: '20px', fontSize: '1.1rem' }}>
                🚀 Part 1 (Day 1-5): 기초
              </h4>
              <ul style={{ color: '#e2e8f0', lineHeight: 2.2, paddingLeft: '20px', margin: 0 }}>
                <li>Day 1: 바이브코딩이 뭔가요?</li>
                <li>Day 2: 아이디어를 앱으로</li>
                <li>Day 3: Antigravity 실전 개발</li>
                <li>Day 4: Figma MCP 연동</li>
                <li>Day 5: Supabase 백엔드</li>
              </ul>
            </div>

            {/* Part 2 */}
            <div style={{
              background: 'rgba(6, 182, 212, 0.15)',
              borderRadius: '20px',
              padding: '25px',
              border: '2px solid rgba(6, 182, 212, 0.3)'
            }}>
              <h4 style={{ color: '#06b6d4', fontWeight: '800', marginBottom: '20px', fontSize: '1.1rem' }}>
                💰 Part 2 (Day 6-10): 수익화
              </h4>
              <ul style={{ color: '#e2e8f0', lineHeight: 2.2, paddingLeft: '20px', margin: 0 }}>
                <li>Day 6: 수익화 전략</li>
                <li>Day 7: 배포와 운영</li>
                <li>Day 8: 성장 해킹</li>
                <li>Day 9: 유지보수와 확장</li>
                <li>Day 10: 실전 프로젝트</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 👨‍🏫 멘토 소개 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))',
          borderRadius: '25px',
          padding: 'clamp(30px, 5vw, 50px)',
          marginBottom: '40px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: '800',
            marginBottom: '30px'
          }}>
            👨‍🏫 멘토 소개
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              padding: '4px',
              boxShadow: '0 15px 40px rgba(139, 92, 246, 0.4)'
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

            <div>
              <h3 style={{ color: 'white', fontSize: '1.4rem', fontWeight: '800', marginBottom: '10px' }}>
                정원석 (Jay)
              </h3>
              <p style={{ color: '#a78bfa', fontSize: '1rem', marginBottom: '15px' }}>
                AI City Builders 대표 · AI 수익화 전문가
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '10px'
              }}>
                {['🎓 컴퓨터공학 석사', '💼 AI 스타트업 창업', '📺 유튜브 크리에이터'].map((item) => (
                  <span key={item} style={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    color: '#e2e8f0',
                    fontSize: '0.85rem'
                  }}>
                    {item}
                  </span>
                ))}
              </div>
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
