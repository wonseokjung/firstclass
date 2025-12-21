import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, Clock, BookOpen, Code, Zap, Rocket, Terminal, Users, TrendingUp, Download, Play } from 'lucide-react';
import AzureTableService from '../../../../services/azureTableService';
import DayDiscussion from '../../../common/DayDiscussion';

interface Day1PageProps {
  onBack: () => void;
  onNext?: () => void;
}

const Day1Page: React.FC<Day1PageProps> = ({ onBack, onNext }) => {
  const [isDayCompleted, setIsDayCompleted] = useState<boolean>(false);
  const [isCompletingDay, setIsCompletingDay] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const userInfo = sessionStorage.getItem('aicitybuilders_user_session');
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          setUserEmail(parsed.email);
          setUserName(parsed.name || parsed.email?.split('@')[0] || '익명');

          const progress = await AzureTableService.getCourseDayProgress(
            parsed.email,
            'vibe-coding'
          );

          if (progress && progress.completedDays.includes(1)) {
            setIsDayCompleted(true);
          }
        }
      } catch (error) {
        console.error('❌ 진행 상황 로드 실패:', error);
      }
    };

    loadUserProgress();
  }, []);

  const handleCompleteDay = async () => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (isDayCompleted) {
      alert('이미 완료한 강의입니다!');
      return;
    }

    try {
      setIsCompletingDay(true);
      const learningTimeMinutes = 45;
      
      const success = await AzureTableService.completeCourseDay(
        userEmail,
        'vibe-coding',
        1,
        learningTimeMinutes
      );

      if (success) {
        setIsDayCompleted(true);
        alert('🎉 Day 1 완료! 다음 강의로 이동하세요!');
      } else {
        alert('❌ Day 완료 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ Day 완료 처리 오류:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsCompletingDay(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #0f0a1e 0%, #1a1033 50%, #0f172a 100%)' 
    }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))',
        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: '#c4b5fd',
              padding: '10px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              marginBottom: '15px',
              fontSize: '0.95rem'
            }}
          >
            <ArrowLeft size={20} />
            강의 목록으로
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              width: '65px',
              height: '65px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
            }}>
              🔥
            </div>
            <div>
              <h1 style={{ 
                color: 'white', 
                fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', 
                margin: 0,
                fontWeight: '700'
              }}>
                Day 1: 바이브코딩이 뭔가요?
              </h1>
              <p style={{ color: '#a78bfa', margin: '5px 0 0 0', fontSize: '1rem' }}>
                Google Antigravity로 혼자서 앱 만들어 돈벌기 시작
              </p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                  <Clock size={16} /> 45분
                </span>
                {isDayCompleted && (
                  <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                    <CheckCircle size={16} /> 완료됨
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 5vw, 40px) 20px' }}>
        
        {/* 🎬 맛보기 영상 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))',
          borderRadius: '24px',
          padding: 'clamp(25px, 5vw, 40px)',
          marginBottom: '30px',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <h2 style={{ 
            color: '#f87171', 
            fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Play size={28} /> Day 1 강의 영상
          </h2>
          
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/Ql2bb-S2ZRQ?si=YsV5pkRQnDejoaCX" 
              title="바이브코딩 Day 1" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
          </div>
          
          <p style={{ color: '#94a3b8', marginTop: '15px', fontSize: '0.95rem', textAlign: 'center' }}>
            🎯 영상 시청 후 아래 내용을 복습하세요!
          </p>
        </div>

        {/* 바이브코딩이란? */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))',
          borderRadius: '24px',
          padding: 'clamp(25px, 5vw, 40px)',
          marginBottom: '30px',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <h2 style={{ 
            color: '#a78bfa', 
            fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Code size={28} /> 바이브코딩(Vibe Coding)이란?
          </h2>
          
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '16px',
            padding: '25px',
            marginBottom: '25px'
          }}>
            <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.9', margin: 0 }}>
              <strong style={{ color: '#a78bfa' }}>바이브코딩</strong>은 AI와 함께 
              <strong style={{ color: '#22c55e' }}> 분위기(Vibe)</strong>만 잡아주면 
              코드가 완성되는 새로운 개발 방식입니다.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.8', marginTop: '15px', marginBottom: 0 }}>
              원래는 개발자가 직접 코딩을 해야 했지만, 이제는 AI에게 
              "웹사이트 개발해줘", "앱 개발해줘"라고 명령만 하면 
              맥주 마시면서 지켜보면 됩니다. 🍺
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <Terminal size={32} color="#a78bfa" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: 'white', margin: '0 0 8px 0' }}>No Code 경험</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>개발 경험 0도 OK!</p>
            </div>
            <div style={{
              background: 'rgba(6, 182, 212, 0.2)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}>
              <Zap size={32} color="#06b6d4" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: 'white', margin: '0 0 8px 0' }}>초고속 개발</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>아이디어 → 앱 30분</p>
            </div>
            <div style={{
              background: 'rgba(34, 197, 94, 0.2)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <Rocket size={32} color="#22c55e" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: 'white', margin: '0 0 8px 0' }}>실전 수익화</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>수익화가 목표</p>
            </div>
          </div>
        </div>

        {/* 1인 기업 4단계 사이클 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1))',
          borderRadius: '24px',
          padding: 'clamp(25px, 5vw, 40px)',
          marginBottom: '30px',
          border: '1px solid rgba(251, 191, 36, 0.3)'
        }}>
          <h2 style={{ 
            color: '#fbbf24', 
            fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <TrendingUp size={28} /> 콘텐츠 기반 1인 기업 4단계 사이클
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {[
              { step: 1, title: '콘텐츠 만들기', desc: 'AI로 영상/글 제작', icon: '🎬', color: '#8b5cf6' },
              { step: 2, title: '시스템 만들기', desc: '에이전트로 자동화', icon: '🤖', color: '#06b6d4' },
              { step: 3, title: '바이브코딩', desc: '웹사이트/앱 개발', icon: '💻', color: '#22c55e' },
              { step: 4, title: '1인 기업', desc: '수익화 & 확장', icon: '🚀', color: '#fbbf24' },
            ].map((item) => (
              <div key={item.step} style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                border: `2px solid ${item.color}40`,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: item.color,
                  color: '#0f172a',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.9rem'
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '2rem', marginTop: '10px', marginBottom: '10px' }}>{item.icon}</div>
                <h4 style={{ color: 'white', margin: '0 0 5px 0', fontSize: '1rem' }}>{item.title}</h4>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
              🎯 이 강의는 <strong>Step 3: 바이브코딩</strong>에 집중합니다!
            </p>
          </div>
        </div>

        {/* Google Antigravity 소개 */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '24px',
          padding: 'clamp(25px, 5vw, 40px)',
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{ 
            color: '#06b6d4', 
            fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <BookOpen size={28} /> Google Antigravity란?
          </h2>
          
          <div style={{ color: '#e2e8f0', lineHeight: '2', fontSize: '1.05rem' }}>
            <p style={{ marginTop: 0 }}>
              <strong style={{ color: '#a78bfa' }}>Google Antigravity</strong>는 
              Google이 인수한 스타트업 기반의 AI IDE(통합개발환경)입니다.
            </p>
            <p style={{ marginBottom: '15px' }}>
              기존 IDE + ChatGPT를 붙여서, 파일 생성/편집/삭제/실행까지 AI가 다 해줍니다!
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '15px' }}>
              <li>✅ 자연어로 코드 생성 (한국어 OK!)</li>
              <li>✅ Gemini 3 Pro, Claude 4.5 등 최신 AI 모델 무료 사용</li>
              <li>✅ 파일 생성, 편집, 삭제, 실행 자동화</li>
              <li>✅ 웹사이트 분석 후 자동 코딩</li>
              <li>✅ Planning 모드: 복잡한 작업도 계획적으로 실행</li>
            </ul>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.2))',
            borderRadius: '16px',
            padding: '25px',
            marginTop: '25px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>
              "코딩을 몰라도, AI에게 말만 하면 앱이 만들어집니다"
            </p>
          </div>
          
          <a 
            href="https://antigravity.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '700',
              marginTop: '20px',
              boxShadow: '0 8px 25px rgba(6, 182, 212, 0.3)'
            }}
          >
            <Download size={20} /> Google Antigravity 다운로드
          </a>
        </div>

        {/* 동기부여 섹션 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(219, 39, 119, 0.1))',
          borderRadius: '24px',
          padding: 'clamp(25px, 5vw, 40px)',
          marginBottom: '30px',
          border: '1px solid rgba(236, 72, 153, 0.3)'
        }}>
          <h2 style={{ 
            color: '#f472b6', 
            fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', 
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Users size={28} /> 여러분은 할 수 있습니다!
          </h2>
          
          <div style={{ color: '#e2e8f0', lineHeight: '2', fontSize: '1.05rem' }}>
            <p style={{ marginTop: 0 }}>
              저는 초등학교 2학년 때부터 코딩했습니다. 학사, 석사, 스타트업에서 10년...
            </p>
            <p>
              <strong style={{ color: '#f472b6' }}>근데 여러분들은 몇 시간 앉아가지고 개발할 수 있습니다.</strong>
            </p>
            <p>
              여러분들은 IMF도 지나봤고, 가장으로서 가족을 책임졌고, 
              정말 어려운 일들을 이겨냈는데...
            </p>
          </div>
          
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '16px',
            padding: '25px',
            marginTop: '20px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#f472b6', fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>
              "이까짓 코딩이 뭐가 어렵습니까?" 🔥
            </p>
          </div>
        </div>

        {/* 수익화 가능한 것들 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.1))',
          borderRadius: '24px',
          padding: 'clamp(25px, 5vw, 40px)',
          marginBottom: '30px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <h2 style={{ 
            color: '#22c55e', 
            fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', 
            marginBottom: '25px'
          }}>
            🎯 바이브코딩으로 만들 수 있는 것들
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '15px'
          }}>
            {[
              { icon: '🌐', title: '랜딩페이지' },
              { icon: '🤖', title: '자동화 봇' },
              { icon: '💰', title: 'SaaS 서비스' },
              { icon: '📱', title: '웹/앱' },
              { icon: '🛒', title: '커머스' },
              { icon: '📊', title: '대시보드' },
            ].map((item, idx) => (
              <div key={idx} style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
                <div style={{ color: 'white', fontWeight: '600' }}>{item.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Day 1 토론방 */}
        <DayDiscussion
          courseId="vibe-coding-day1"
          dayNumber={1}
          communityPath="/community/step3"
          accentColor="#8b5cf6"
          userEmail={userEmail}
          userName={userName}
        />

        {/* 완료 버튼 */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleCompleteDay}
            disabled={isCompletingDay || isDayCompleted}
            style={{
              background: isDayCompleted 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              padding: '18px 45px',
              borderRadius: '16px',
              fontSize: '1.15rem',
              fontWeight: '700',
              cursor: isDayCompleted ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: isDayCompleted 
                ? '0 8px 25px rgba(34, 197, 94, 0.4)'
                : '0 8px 25px rgba(139, 92, 246, 0.4)'
            }}
          >
            {isDayCompleted ? (
              <>
                <CheckCircle size={24} /> Day 1 완료!
              </>
            ) : isCompletingDay ? (
              '처리 중...'
            ) : (
              <>
                <PlayCircle size={24} /> Day 1 완료하기
              </>
            )}
          </button>
          
          {onNext && (
            <button
              onClick={onNext}
              style={{
                background: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
                color: 'white',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '18px 45px',
                borderRadius: '16px',
                fontSize: '1.15rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Day 2로 이동 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Day1Page;

