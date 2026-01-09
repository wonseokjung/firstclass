import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle, Code, Zap, Terminal, ArrowLeft } from 'lucide-react';
import NavigationBar from '../../../common/NavigationBar';
import AzureTableService from '../../../../services/azureTableService';

// 바이브코딩 테마 컬러 (퍼플 + 사이안)
const COLORS = {
  darkBg: '#0f0a1e',
  purple: '#8b5cf6',
  purpleLight: '#a78bfa',
  purpleDark: '#7c3aed',
  cyan: '#06b6d4',
  cyanLight: '#22d3ee',
  green: '#22c55e',
  gold: '#ffd60a',
  white: '#ffffff',
  grayLight: '#f8fafc',
  grayMedium: '#94a3b8',
};

interface VibeCodingPlayerPageProps {
  onBack: () => void;
}

const VibeCodingPlayerPage: React.FC<VibeCodingPlayerPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');

        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);

          // 테스트 계정 확인
          const testAccounts = ['test10@gmail.com'];
          const isTestAccount = testAccounts.includes(parsedUserInfo.email);

          try {
            const paymentStatus = await AzureTableService.checkCoursePayment(
              parsedUserInfo.email,
              'vibe-coding'
            );

            if ((paymentStatus && paymentStatus.isPaid) || isTestAccount) {
              setIsPaidUser(true);

              try {
                const progress = await AzureTableService.getCourseDayProgress(
                  parsedUserInfo.email,
                  'vibe-coding'
                );

                if (progress && progress.completedDays) {
                  setCompletedDays(new Set(progress.completedDays));
                }
              } catch (progressError) {
                console.error('❌ 진도 불러오기 실패:', progressError);
              }
            } else {
              alert('이 강의는 결제 후 수강하실 수 있습니다.');
              window.location.href = '/vibe-coding';
            }
          } catch (azureError) {
            console.error('❌ Azure 테이블 조회 실패:', azureError);
            alert('결제 정보를 확인할 수 없습니다. 다시 시도해주세요.');
            window.location.href = '/vibe-coding';
          }
        } else {
          const confirmLogin = window.confirm('로그인이 필요한 서비스입니다. 먼저 로그인해주세요.\n\n로그인 페이지로 이동하시겠습니까?');
          if (confirmLogin) {
            window.location.href = '/login';
          } else {
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
        window.location.href = '/';
      }
    };

    checkAuthStatus();
  }, []);

  // 강의 데이터
  const courseData = {
    weeks: [
      {
        title: 'Part 1 (Day 1-5)',
        subtitle: '🏋️ 기초 근육 만들기 - 코딩 기초부터 Azure 환경 구축까지',
        days: [
          {
            day: 1,
            title: '💻 기본 코딩 기초 (1)',
            subtitle: '터미널, 명령어, 파일 시스템 이해하기',
            hasQuiz: true
          },
          {
            day: 2,
            title: '💻 기본 코딩 기초 (2)',
            subtitle: 'Python/JS 기본 문법과 실습',
            hasQuiz: true
          },
          {
            day: 3,
            title: '🤖 AI 모델 API 불러오기',
            subtitle: 'OpenAI, Gemini API 연결하기',
            hasQuiz: true
          },
          {
            day: 4,
            title: '📂 GitHub 만들기 & 사용법',
            subtitle: 'Git 기초, 레포지토리, Push/Pull',
            hasQuiz: true
          },
          {
            day: 5,
            title: '☁️ Microsoft Azure 가입',
            subtitle: 'Azure 계정 생성, 리소스 그룹 이해',
            hasQuiz: true
          }
        ]
      },
      {
        title: 'Part 2 (Day 6-10)',
        subtitle: '🚀 배포 & 통합 - Antigravity로 서비스 완성하기',
        days: [
          {
            day: 6,
            title: '⚡ AI Studio + Antigravity 소개',
            subtitle: 'AI Studio로 앱 개발 + AI IDE 설치 및 사용법',
            hasQuiz: true
          },
          {
            day: 7,
            title: '🌐 프론트엔드 → Azure 배포',
            subtitle: 'Static Web App + GitHub 연동',
            hasQuiz: true
          },
          {
            day: 8,
            title: '🔗 도메인 구입 & 연결',
            subtitle: '도메인 구매, DNS 설정, SSL 적용',
            hasQuiz: true
          },
          {
            day: 9,
            title: '🗄️ 백엔드 테이블 & Blob',
            subtitle: 'Azure Table Storage, Blob 저장소',
            hasQuiz: true
          },
          {
            day: 10,
            title: '🔄 프론트 + 백엔드 연동',
            subtitle: 'API 연결, 데이터 CRUD 완성',
            hasQuiz: true
          }
        ]
      }
    ]
  };

  const totalDays = 10;
  const progressPercentage = (completedDays.size / totalDays) * 100;

  const handleDayClick = (day: number) => {
    if (day >= 1 && day <= 10) {
      navigate(`/vibe-coding/day${day}`);
    }
  };

  if (!isPaidUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f0a1e 0%, #1a1033 100%)'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: `4px solid ${COLORS.purple}`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0a1e 0%, #1a1033 50%, #ffffff 100%)' }}>
      <NavigationBar />

      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.2))',
        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
        padding: 'clamp(60px, 8vw, 100px) 20px clamp(30px, 5vw, 50px)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: '#c4b5fd',
              padding: '10px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              marginBottom: '25px',
              fontSize: '0.95rem'
            }}
          >
            <ArrowLeft size={18} /> 홈으로
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
            <Code size={40} color={COLORS.purple} />
            <Terminal size={40} color={COLORS.cyan} />
            <Zap size={40} color={COLORS.gold} />
          </div>

          <h1 style={{
            color: COLORS.white,
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '800',
            marginBottom: '15px',
            lineHeight: '1.3'
          }}>
            바이브코딩으로 돈벌기
          </h1>
          <p style={{
            color: COLORS.purpleLight,
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            marginBottom: '30px'
          }}>
            AI 수익화 바이브코딩 · 10일 마스터 클래스
          </p>

          {/* 진행률 */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '20px',
            padding: '20px 25px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: COLORS.grayMedium }}>학습 진행률</span>
              <span style={{ color: COLORS.green, fontWeight: '700' }}>
                {completedDays.size}/{totalDays} 완료
              </span>
            </div>
            <div style={{
              background: 'rgba(139, 92, 246, 0.2)',
              borderRadius: '10px',
              height: '12px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.cyan})`,
                height: '100%',
                width: `${progressPercentage}%`,
                borderRadius: '10px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* 📢 얼리버드 기간 공지 */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 183, 71, 0.15), rgba(255, 215, 0, 0.1))',
          border: '2px solid rgba(255, 215, 0, 0.4)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginTop: '-20px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffd700, #f59e0b)',
            borderRadius: '12px',
            padding: '10px',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '1.5rem' }}>📢</span>
          </div>
          <div>
            <h4 style={{
              color: '#ffd700',
              fontSize: '1.1rem',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              얼리버드 기간 안내
            </h4>
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              margin: 0
            }}>
              🎉 현재 <strong style={{ color: '#ffd700' }}>얼리버드 기간</strong>으로, 기초 강의 영상은 아직 업로드되지 않았습니다.<br />
              매주 <strong style={{ color: '#22c55e' }}>목요일 저녁 8시 라이브</strong>를 통해 실시간 강의가 진행됩니다!<br />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                라이브 참여 후 녹화본이 순차적으로 업로드될 예정입니다.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 🔴 1월 라이브 안내 */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))',
          border: '2px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
            <span style={{ fontSize: '2rem' }}>🔴</span>
            <h4 style={{
              color: '#ef4444',
              fontSize: '1.3rem',
              fontWeight: '800',
              margin: 0
            }}>
              1월은 라이브로 만나요!
            </h4>
          </div>

          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1rem',
            lineHeight: '1.8',
            margin: '0 0 20px 0'
          }}>
            🗓 <strong style={{ color: '#22c55e' }}>매주 목요일 저녁 8시</strong>, 제이 멘토와 함께하는 실시간 라이브!<br />
            👥 커뮤니티 멤버들과 <strong style={{ color: COLORS.cyan }}>함께 프로젝트를 진행</strong>하며 배워요.<br />
            💡 라이브에서 질문하고, 피드백 받고, 함께 성장하세요!
          </p>

          {/* 4주 프로젝트 진행표 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <h5 style={{
              color: COLORS.cyan,
              fontSize: '1.1rem',
              fontWeight: '700',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              🚀 나의 첫 서비스 런칭하기
            </h5>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {[
                { week: 1, title: '설계', icon: '📐' },
                { week: 2, title: '개발', icon: '💻' },
                { week: 3, title: '테스트', icon: '🧪' },
                { week: 4, title: '배포', icon: '🚀' }
              ].map((item) => (
                <div key={item.week} style={{
                  background: 'rgba(30, 41, 59, 0.8)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ color: COLORS.cyan, fontWeight: '700', fontSize: '0.9rem' }}>
                    {item.week}주
                  </span>
                  <span style={{ color: 'white', fontWeight: '600' }}>
                    {item.icon} {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/live/step3')}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(239, 68, 68, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(239, 68, 68, 0.4)';
            }}
          >
            🔴 라이브 페이지로 이동
          </button>
        </div>
      </div>

      {/* 강의 목록 */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(30px, 5vw, 50px) 20px' }}>
        {courseData.weeks.map((week, weekIdx) => (
          <div key={weekIdx} style={{ marginBottom: '40px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))',
              borderRadius: '16px',
              padding: '20px 25px',
              marginBottom: '20px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <h2 style={{ color: COLORS.purple, fontSize: '1.3rem', margin: 0 }}>{week.title}</h2>
              <p style={{ color: COLORS.grayMedium, margin: '8px 0 0 0', fontSize: '0.95rem' }}>{week.subtitle}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {week.days.map((day) => {
                const isCompleted = completedDays.has(day.day);

                return (
                  <div
                    key={day.day}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '20px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem' }}>{day.day}</span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ color: COLORS.white, fontWeight: '700', fontSize: '1.05rem', marginBottom: '4px' }}>
                        Day {day.day}: {day.title}
                      </div>
                      <div style={{ color: COLORS.grayMedium, fontSize: '0.9rem' }}>
                        {day.subtitle}
                      </div>
                    </div>

                    <span style={{
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: COLORS.purpleLight,
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      준비중
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 커리큘럼 변경 안내 */}
            <div style={{
              marginTop: '15px',
              padding: '12px 16px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '10px',
              border: '1px dashed rgba(139, 92, 246, 0.3)'
            }}>
              <p style={{
                color: COLORS.grayMedium,
                fontSize: '0.85rem',
                margin: 0,
                textAlign: 'center'
              }}>
                📌 커리큘럼은 수강생 피드백과 최신 기술 트렌드에 따라 변경될 수 있습니다.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VibeCodingPlayerPage;

