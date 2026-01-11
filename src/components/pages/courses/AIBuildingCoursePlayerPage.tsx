import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Lock, CheckCircle } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

// 브랜드 컬러 정의 - AI 건물주 테마 (블루 + 골드)
const COLORS = {
  navy: '#0d1b2a',
  navyLight: '#1e3a5f',
  navyDark: '#020617',
  blue: '#0ea5e9',
  blueLight: '#38bdf8',
  blueDark: '#0284c7',
  gold: '#ffd60a',
  goldLight: '#fcd34d',
  goldDark: '#e5c100',
  white: '#ffffff',
  grayLight: '#f8fafc',
  grayMedium: '#64748b',
};

interface AIBuildingCoursePlayerPageProps {
  onBack: () => void;
}

const AIBuildingCoursePlayerPage: React.FC<AIBuildingCoursePlayerPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');

        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);

          // 테스트 계정 확인 (개발/테스트용)
          const testAccounts = ['test10@gmail.com'];
          const isTestAccount = testAccounts.includes(parsedUserInfo.email);

          // Azure 테이블에서 결제 상태 확인
          try {
            const paymentStatus = await AzureTableService.checkCoursePayment(
              parsedUserInfo.email,
              'ai-building-course'
            );

            if ((paymentStatus && paymentStatus.isPaid) || isTestAccount) {
              // 🔒 수강 기간 만료 체크
              const enrollment = paymentStatus?.enrollment;
              if (enrollment && enrollment.accessExpiresAt) {
                const expiresAt = new Date(enrollment.accessExpiresAt);
                const now = new Date();

                if (now > expiresAt) {
                  // 수강 기간 만료됨
                  const isEarlyBird = enrollment.isEarlyBird;
                  const durationText = isEarlyBird ? '1년' : '3개월';

                  alert(`⏰ 수강 기간이 만료되었습니다.\n\n결제일: ${new Date(enrollment.enrolledAt).toLocaleDateString('ko-KR')}\n만료일: ${expiresAt.toLocaleDateString('ko-KR')}\n수강 기간: ${durationText}\n\n계속 수강하시려면 다시 결제해주세요.`);
                  window.location.href = '/ai-building-course';
                  return;
                }

                console.log(`✅ 수강 기간 유효 - 만료일: ${expiresAt.toLocaleDateString('ko-KR')}`);
              }

              setIsPaidUser(true);

              // Azure에서 진도 불러오기
              try {
                const progress = await AzureTableService.getCourseDayProgress(
                  parsedUserInfo.email,
                  'ai-building-course'
                );

                if (progress && progress.completedDays) {
                  console.log('✅ 진도 불러오기 성공:', progress.completedDays);
                  setCompletedDays(new Set(progress.completedDays));
                }
              } catch (progressError) {
                console.error('❌ 진도 불러오기 실패:', progressError);
              }
            } else {
              // 결제하지 않은 사용자는 결제 페이지로 리다이렉트
              alert('이 강의는 결제 후 수강하실 수 있습니다.');
              window.location.href = '/ai-building-course';
            }
          } catch (azureError) {
            console.error('❌ Azure 테이블 조회 실패:', azureError);
            alert('결제 정보를 확인할 수 없습니다. 다시 시도해주세요.');
            window.location.href = '/ai-building-course';
          }
        } else {
          // 로그인하지 않은 사용자는 로그인 페이지로
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

  // 강의 데이터 - Day 1~10 형식 (순차 오픈)
  const courseData = {
    weeks: [
      {
        title: 'Part 1 (Day 1-5)',
        subtitle: '🧠 AI 1인 기업가 비즈니스 마인드 - 단순히 AI로 콘텐츠를 만드는 것이 아니라, 어떻게 수익화하고 사업화할지 준비하는 단계',
        days: [
          {
            day: 1,
            title: '프롤로그: 맨해튼 부자 삼촌의 교훈',
            subtitle: '맨해튼 부동산 거물 삼촌의 교훈과 AI 시대 재해석',
            hasQuiz: true,
            releaseDate: '2025-01-01'  // 1월 1일 오픈
          },
          {
            day: 2,
            title: '경제적 자유: 잠자는 동안에도 돈이 들어오는 구조',
            subtitle: '부동산 vs 콘텐츠, 경제적 자유의 새로운 정의 | AI 기반 콘텐츠 청사진 만들기',
            hasQuiz: true,
            releaseDate: '2025-01-02'  // 1월 2일 오픈
          },
          {
            day: 3,
            title: '당신의 디지털 건물에는 어떤 사람이 거주하나?',
            subtitle: '글로벌 CPM과 수익성 분석 | AI로 타겟 고객 심층 분석하기',
            hasQuiz: true,
            releaseDate: '2025-01-03'  // 1월 3일 오픈
          },
          {
            day: 4,
            title: '몇 층짜리 디지털 건물을 세울 것인가?',
            subtitle: '대중형/니치형/혼합형 전략 | AI로 시장 분석 & 건물 콘셉트 설계',
            hasQuiz: false,
            releaseDate: '2025-01-04'  // 1월 4일 오픈
          },
          {
            day: 5,
            title: 'AI 건물주가 되기: 유튜브 채널 만들기',
            subtitle: '유튜브 채널 생성 | Gemini로 프로필/배너 제작 | 채널 설정 완료',
            hasQuiz: false,
            releaseDate: '2026-01-01',  // 1월 1일 오픈
            releaseTime: '19:00'
          }
        ]
      },
      {
        title: 'Part 2 (Day 6-10)',
        subtitle: '🛠️ 실전! AI 콘텐츠 제작 - 배운 마인드를 바탕으로 실제 수익형 콘텐츠를 만들고 첫 월세를 받는 단계',
        days: [
          {
            day: 6,
            title: 'AI 멘토 제이의 이미지 생성의 정석',
            subtitle: '프롬프트 엔지니어링 & Google Colab 실습 | 코드 보고 쫄지 않기',
            hasQuiz: false,
            releaseDate: '2025-01-06'  // 1월 6일 오픈
          },
          {
            day: 7,
            title: 'AI 멘토 제이의 영상 생성의 정석',
            subtitle: 'Google Veo로 텍스트만으로 영상 만들기 | 쉬운 방법 & 어려운 방법',
            hasQuiz: false,
            releaseDate: '2026-01-01'  // 오픈됨
          },
          {
            day: 8,
            title: '[시공] AI 4단계 건축 워크플로우',
            subtitle: '🎙️ 오디오 생성 영상 4개로 확장! | 바이럴 숏폼 & 고품질 롱폼 제작',
            hasQuiz: true,
            releaseDate: '2026-01-04'  // 1월 4일 업로드
          },
          {
            day: 9,
            title: '[준공식] 콘텐츠 업로드 & 데이터 분석',
            subtitle: '핵심 지표 읽는 법 | AI 감성 분석으로 건물 리모델링',
            hasQuiz: false,
            releaseDate: '2026-01-07'  // 1월 7일 업로드
          },
          {
            day: 10,
            title: '[완공] AI 수익화 파이프라인 완성 & 축하',
            subtitle: '롱폼→숏츠 호환 | 판매 웹사이트 제작 | 조회수 분석 | 비즈니스 연결의 첫걸음',
            hasQuiz: true,
            releaseDate: '2026-01-08'  // 1월 8일 업로드
          }
        ]
      }
    ]
  };

  const totalDays = 10;
  const progressPercentage = (completedDays.size / totalDays) * 100;

  const handleDayClick = (day: number) => {
    // Day 1~10까지 각각의 페이지로 이동
    if (day >= 1 && day <= 10) {
      navigate(`/ai-building-course/day${day}`);
    } else {
      alert(`Day ${day} 강의는 준비 중입니다. 곧 공개될 예정입니다! 🚀`);
    }
  };

  // 결제 확인 중이거나 미결제 사용자
  if (!isPaidUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px',
        background: `linear-gradient(135deg, ${COLORS.navy}10, ${COLORS.grayLight})`
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: `4px solid ${COLORS.navy}20`,
          borderTop: `4px solid ${COLORS.gold}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: COLORS.navy, fontSize: '16px', fontWeight: '600' }}>
          결제 정보 확인 중...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.white }}>
      <NavigationBar
        onBack={onBack}
        breadcrumbText="AI 디지털 건물주 되기"
      />

      {/* 헤더 & 진행률 - 브랜드 컬러 */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)`,
        color: 'white',
        padding: '40px 20px',
        boxShadow: `0 4px 20px ${COLORS.navy}40`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 장식 */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${COLORS.blue}20 0%, transparent 70%)`,
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '20%',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, ${COLORS.gold}10 0%, transparent 60%)`,
          borderRadius: '50%'
        }}></div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '25px'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              boxShadow: `0 8px 20px ${COLORS.blue}40`
            }}>
              🏗️
            </div>
            <div>
              <h1 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: '800',
                marginBottom: '5px',
                color: COLORS.white
              }}>
                AI 디지털 건물주 되기
              </h1>
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: COLORS.blueLight,
                margin: 0,
                fontWeight: '500'
              }}>
                10일 완성, AI로 월세 받는 수익형 디지털 건물 짓기
              </p>
            </div>
          </div>

          {/* 라이브 입장 버튼 */}
          <div
            onClick={() => navigate('/live/step1')}
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '15px',
              padding: '20px 25px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '15px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(239, 68, 68, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <span style={{ fontSize: '1.8rem' }}>🔴</span>
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '12px',
                  height: '12px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  border: '2px solid white',
                  animation: 'pulse 2s infinite'
                }}></div>
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white' }}>
                  🔴 주간 라이브 강의 입장
                </div>
                <div style={{ fontSize: '0.95rem', opacity: '0.9', color: 'white' }}>
                  🚀 최신 AI 모델로 콘텐츠 만들기 | 매주 일요일 8PM
                </div>
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '700',
              color: 'white'
            }}>
              입장하기 →
            </div>
          </div>



          {/* 진행률 - 골드 테마 */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.navyLight}80, ${COLORS.navy}90)`,
            border: `2px solid ${COLORS.blue}40`,
            borderRadius: '15px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: COLORS.white }}>전체 학습 진행률</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: COLORS.blueLight }}>
                {completedDays.size}/{totalDays} 완료 ({Math.round(progressPercentage)}%)
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '14px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.blueLight})`,
                borderRadius: '10px',
                transition: 'width 0.5s ease',
                boxShadow: `0 2px 10px ${COLORS.blue}50`
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 강의 목록 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        background: COLORS.grayLight
      }}>
        {courseData.weeks.map((week, weekIndex) => {
          // Part 1: 블루, Part 2: 골드
          const isPart1 = weekIndex === 0;
          const headerBg = isPart1
            ? `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)`
            : `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldDark} 100%)`;
          const borderColor = isPart1 ? COLORS.blue : COLORS.navy;
          const titleColor = COLORS.white;
          const subtitleColor = isPart1 ? COLORS.blueLight : 'rgba(255,255,255,0.9)';
          const icon = isPart1 ? '🏠' : '💰';

          return (
            <div key={weekIndex} style={{
              marginBottom: '50px'
            }}>
              {/* Week 헤더 */}
              <div style={{
                background: headerBg,
                borderRadius: '20px',
                padding: '30px 35px',
                marginBottom: '30px',
                border: `3px solid ${borderColor}`,
                boxShadow: isPart1
                  ? `0 8px 30px ${COLORS.navy}30`
                  : `0 8px 30px ${COLORS.gold}40`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* 배경 장식 */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  background: isPart1
                    ? `radial-gradient(circle, ${COLORS.blue}20 0%, transparent 70%)`
                    : `radial-gradient(circle, ${COLORS.navy}30 0%, transparent 70%)`,
                  borderRadius: '50%'
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h2 style={{
                    fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                    fontWeight: '800',
                    color: titleColor,
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '2rem' }}>{icon}</span>
                    {week.title}
                  </h2>
                  <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                    color: subtitleColor,
                    margin: 0,
                    fontWeight: '600',
                    lineHeight: '1.6'
                  }}>
                    {week.subtitle}
                  </p>
                </div>
              </div>

              {/* Day 카드들 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                gap: '20px'
              }}>
                {week.days.map((lesson) => {
                  const isCompleted = completedDays.has(lesson.day);
                  // 🔓 Day 1~8 열림 / Day 9~10은 순차 업로드 예정
                  const isAvailable = lesson.day <= 9;

                  return (
                    <div
                      key={lesson.day}
                      onClick={() => isAvailable && handleDayClick(lesson.day)}
                      style={{
                        background: COLORS.white,
                        borderRadius: '15px',
                        padding: '25px',
                        border: isCompleted ? `2px solid ${COLORS.blue}` : `2px solid ${COLORS.navy}20`,
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease',
                        opacity: isAvailable ? 1 : 0.7,
                        boxShadow: `0 4px 15px ${COLORS.navy}10`,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseOver={(e) => {
                        if (isAvailable) {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = `0 8px 25px ${COLORS.navy}20`;
                          e.currentTarget.style.borderColor = COLORS.blue;
                        }
                      }}
                      onMouseOut={(e) => {
                        if (isAvailable) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = `0 4px 15px ${COLORS.navy}10`;
                          e.currentTarget.style.borderColor = isCompleted ? COLORS.blue : `${COLORS.navy}20`;
                        }
                      }}
                    >
                      {/* 완료 배지 */}
                      {isCompleted && (
                        <div style={{
                          position: 'absolute',
                          top: '15px',
                          right: '15px',
                          background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`,
                          color: COLORS.white,
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: `0 4px 12px ${COLORS.blue}40`
                        }}>
                          <CheckCircle size={16} />
                          완료
                        </div>
                      )}

                      {/* 잠금 배지 - 업로드 예정 날짜 표시 */}
                      {!isAvailable && (
                        <div style={{
                          position: 'absolute',
                          top: '15px',
                          right: '15px',
                          background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                          color: COLORS.navy,
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          📅 {lesson.releaseDate ? new Date(lesson.releaseDate).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' }) : ''}{(lesson as any).releaseTime === '19:00' ? ' 저녁 7시' : ''} 업로드
                        </div>
                      )}

                      {/* Day 번호 */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '15px'
                      }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          background: isCompleted
                            ? `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`
                            : (isAvailable ? `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})` : `linear-gradient(135deg, ${COLORS.grayMedium}, #94a3b8)`),
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: '800',
                          flexShrink: 0,
                          boxShadow: isCompleted ? `0 4px 12px ${COLORS.blue}30` : `0 4px 12px ${COLORS.navy}20`
                        }}>
                          {isAvailable ? (isCompleted ? <CheckCircle size={28} /> : lesson.day) : <Lock size={24} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '0.9rem',
                            color: COLORS.navy,
                            fontWeight: '700',
                            marginBottom: '4px'
                          }}>
                            Day {lesson.day}
                          </div>
                          <div style={{
                            fontSize: '0.85rem',
                            color: COLORS.grayMedium,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                          </div>
                        </div>
                      </div>

                      {/* 제목 */}
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: COLORS.navyDark,
                        marginBottom: '8px',
                        lineHeight: '1.4'
                      }}>
                        {lesson.title}
                      </h3>

                      {/* 부제목 */}
                      {lesson.subtitle && (
                        <p style={{
                          fontSize: '0.85rem',
                          color: COLORS.grayMedium,
                          marginBottom: '15px',
                          lineHeight: '1.5'
                        }}>
                          {lesson.subtitle}
                        </p>
                      )}

                      {/* 버튼 */}
                      {isAvailable ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '15px',
                          borderTop: `1px solid ${COLORS.navy}15`
                        }}>
                          <span style={{
                            color: COLORS.navy,
                            fontSize: '0.95rem',
                            fontWeight: '700'
                          }}>
                            {isCompleted ? '다시 학습하기' : '학습 시작하기'}
                          </span>
                          <PlayCircle size={24} color={COLORS.blue} />
                        </div>
                      ) : (
                        <div style={{
                          paddingTop: '15px',
                          borderTop: `1px solid ${COLORS.navy}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: COLORS.grayMedium,
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          🔒 강의 준비중
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 학습 완료 시 축하 메시지 */}
        {completedDays.size === totalDays && (
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyDark})`,
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            border: `3px solid ${COLORS.blue}`,
            marginTop: '40px',
            boxShadow: `0 10px 40px ${COLORS.navy}40`
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
              fontWeight: '800',
              color: COLORS.blueLight,
              marginBottom: '15px'
            }}>
              축하합니다! 모든 강의를 완료하셨습니다!
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: COLORS.white,
              lineHeight: '1.8'
            }}>
              이제 여러분은 AI 디지털 건물주입니다! 🏗️<br />
              배운 내용을 활용하여 첫 월세를 받아보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIBuildingCoursePlayerPage;
