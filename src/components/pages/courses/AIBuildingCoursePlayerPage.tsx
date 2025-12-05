import React, { useState, useEffect } from 'react';
import { Clock, Play } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';
import { allCourses } from '../../../data/courseData';

interface AIBuildingCoursePlayerPageProps {
  onBack: () => void;
}

const AIBuildingCoursePlayerPage: React.FC<AIBuildingCoursePlayerPageProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  // const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [, setUserInfo] = useState<any>(null);

  const course = allCourses.find((c: any) => c.id === 999) || {
    id: 999,
    title: "AI 디지털 건물주 되기",
    lessons: [
      // 교훈 1: 입지 선정 (5강)
      {
        id: 1,
        title: "프롤로그: 맨해튼 부자 삼촌과 AI 멘토 제이",
        duration: "45분",
        hasQuiz: false,
        sections: {
          theory: "맨해튼 부동산 거물 삼촌의 교훈과 AI 시대 재해석",
          practice: "GOOGLE AI STUDIO 입문 – 웹서치 & 분석 도구 체험하기"
        }
      },
      {
        id: 2,
        title: "경제적 자유: 잠자는 동안에도 돈이 들어오는 구조 만들기",
        duration: "50분",
        hasQuiz: false,
        sections: {
          theory: "부동산 vs 콘텐츠, 경제적 자유의 새로운 정의",
          practice: "GOOGLE AI STUDIO 심화 – AI 기반 콘텐츠 아이디어 & 청사진 만들기"
        }
      },
      {
        id: 3,
        title: "당신의 AI 디지털건물에는 어떤 사람이 거주하고 있나?",
        duration: "55분",
        hasQuiz: false,
        sections: {
          theory: "세입자 선별의 기술, 글로벌 CPM과 수익성 분석",
          practice: "GOOGLE AI STUDIO 응용 – 타겟 고객 심층 분석 (나라·언어·연령·관심사·소득·플랫폼 분포)"
        }
      },
      {
        id: 4,
        title: "몇 층짜리 디지털 건물을 세울 것인가?",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "대중형/니치형/혼합형 건물 전략, 건물 콘셉트의 중요성",
          practice: "GOOGLE AI STUDIO 전략 – 대중형 vs 니치형 콘텐츠 시장 분석하기"
        }
      },
      {
        id: 5,
        title: "최종 입지 선정: AI CITY BUILDER에 건물 계획서 넣기",
        duration: "40분",
        hasQuiz: false,
        sections: {
          theory: "입지가 수익을 결정한다, 디지털 맨해튼 땅 계약의 원리",
          practice: "GOOGLE AI STUDIO 실행 – 나의 첫 디지털 건물 사업계획서 완성하기"
        }
      },

      // 교훈 2: AI 건축 자재 (4강)
      {
        id: 6,
        title: "[실습] 재료학 I (설계도): 텍스트 생성 AI",
        duration: "70분",
        hasQuiz: false,
        sections: {
          theory: "텍스트 생성 AI(ChatGPT, Claude, Gemini) 활용 원리, 프롬프트 엔지니어링",
          practice: "ChatGPT 프롬프트 100개 분석 (학습, 진로, 생활, 노트정리, 연구, 창의, 발표, 협업)"
        }
      },
      {
        id: 7,
        title: "[실습] 재료학 II (외장재): 이미지 생성 AI",
        duration: "65분",
        hasQuiz: false,
        sections: {
          theory: "인공지능 이미지 생성의 기본 원리, 이미지 생성 모델의 발전 역사와 활용 확장",
          practice: "Nano Banana 입문, ChatGPT 이미지 생성 입문 (기초/스타일/합성/시점/전문/아트편)"
        }
      },
      {
        id: 8,
        title: "[실습] 재료학 III (음향 시설): 사운드 생성 AI",
        duration: "55분",
        hasQuiz: false,
        sections: {
          theory: "인공지능 사운드 생성의 기본 원리, 사운드 생성 AI의 발전 역사",
          practice: "ElevenLabs로 내 목소리 학습시키기, Suno AI로 분위기에 맞는 BGM 만들기, 효과음·안내음성 생성"
        }
      },
      {
        id: 9,
        title: "[실습] 재료학 IV: 영상 생성 AI",
        duration: "75분",
        hasQuiz: false,
        sections: {
          theory: "인공지능 영상 생성의 기본 원리 (텍스트→영상 변환, 멀티모달 결합), 영상 생성 AI의 발전 과정",
          practice: "VEO 입문, 스토리 기반 영상 만들기, 완성형 콘텐츠 제작 (텍스트→이미지→사운드→영상)"
        }
      },

      // 교훈 3: 시공 및 완공 (3강)
      {
        id: 10,
        title: "[1층 상가 시공] AI를 활용한 바이럴 숏폼 제작",
        duration: "80분",
        hasQuiz: false,
        sections: {
          theory: "입지를 지배하는 상점의 법칙 (간판 설계, 목적이 이끄는 숏폼 제작)",
          practice: "AI 4단계 건축 워크플로우 (AI 설계→자재 수급→시공→멀티 플랫폼 동시 입점)"
        }
      },
      {
        id: 11,
        title: "[본 건물 시공] AI 기반 고품질 롱폼 제작",
        duration: "85분",
        hasQuiz: false,
        sections: {
          theory: "머물고 싶게 만드는 공간의 비밀 (Hook, AI 롱폼 건축법 4가지 공법)",
          practice: "80/20 AI 건축 워크플로우 체험 (AI 뼈대 세우기→인간의 영혼 불어넣기→하이브리드 제작)"
        }
      },
      {
        id: 12,
        title: "[준공식] 콘텐츠 업로드 및 초기 반응 분석",
        duration: "60분",
        hasQuiz: false,
        sections: {
          theory: "살아 숨 쉬는 건물을 만드는 데이터 관리술 (핵심 지표 읽는 법, AI 감성 분석)",
          practice: "데이터 기반 건물 리모델링 (CCTV 확인→AI 관리소장 보고→건물 개선 계획서 작성)"
        }
      },

      // 교훈 4: 첫 월세 받기 (4강)
      {
        id: 13,
        title: "수익 시스템 I (디지털 광고판): 애드센스 연동",
        duration: "50분",
        hasQuiz: false,
        sections: {
          theory: "자동화된 광고 임대 시스템, 애드센스의 원리",
          practice: "유튜브 파트너 프로그램(YPP) 가입 조건 확인 및 신청, 블로그에 구글 애드센스 코드 삽입"
        }
      },
      {
        id: 14,
        title: "수익 시스템 II (수수료 수익): 제휴 마케팅",
        duration: "55분",
        hasQuiz: false,
        sections: {
          theory: "신뢰 기반 컨시어지 서비스, 이커머스 & 제휴의 원리",
          practice: "쿠팡 파트너스 가입 및 추천 링크 생성, 유튜브 쇼핑 기능 연동"
        }
      },
      {
        id: 15,
        title: "수익 시스템 III (VIP 라운지): 멤버십 및 구독 모델",
        duration: "45분",
        hasQuiz: false,
        sections: {
          theory: "커뮤니티: 빅테크가 원하는 미래, VIP 라운지 운영의 원리",
          practice: "유튜브 채널 멤버십 기능 활성화 (Silver, Gold, VIP 등급 설계), 멤버 전용 비공개 커뮤니티 개설"
        }
      },
      {
        id: 16,
        title: "최종 단계 (사업화): 당신의 '디지털 세탁 공장'을 건설하라",
        duration: "70분",
        hasQuiz: false,
        sections: {
          theory: "허브-앤-스포크 시스템 구축, AI를 24시간 공장장으로 활용",
          practice: "온라인 비즈니스 본체 설계, 콘텐츠 채널 연결 시스템 구축, 다음 강의 예고"
        }
      }
    ]
  };

  // 챕터 확장/접기 함수
  // const toggleChapter = (chapterId: number) => {
  //   const newExpanded = new Set(expandedChapters);
  //   if (newExpanded.has(chapterId)) {
  //     newExpanded.delete(chapterId);
  //   } else {
  //     newExpanded.add(chapterId);
  //   }
  //   setExpandedChapters(newExpanded);
  // };

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');

        console.log('🔍 AI 건물 짓기 강의 시청 페이지 - 인증 상태 체크:', {
          sessionStorage: storedUserInfo ? 'exists' : 'null'
        });

        if (storedUserInfo) {
          try {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            console.log('✅ 세션에서 사용자 정보 파싱 성공:', {
              email: parsedUserInfo.email,
              name: parsedUserInfo.name
            });

            setUserInfo(parsedUserInfo);

            // Azure 테이블에서 결제 상태 확인
            try {
              const paymentStatus = await AzureTableService.checkCoursePayment(
                parsedUserInfo.email, 
                'ai-building-course'
              );

              console.log('💳 Azure 테이블 결제 상태 확인 결과:', paymentStatus);

              if (paymentStatus && paymentStatus.isPaid) {
                setIsAuthorized(true);
                console.log('✅ 결제 확인됨 - 강의 시청 권한 부여');
              } else {
                console.log('❌ 결제되지 않음 - 강의 시청 권한 없음');
                alert('이 강의를 시청하려면 먼저 결제가 필요합니다.');
                // 메인 페이지로 리다이렉트
                window.location.href = '/';
                return;
              }
            } catch (azureError) {
              console.error('❌ Azure 테이블 조회 실패:', azureError);
              alert('결제 상태 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
              window.location.href = '/';
              return;
            }
          } catch (parseError) {
            console.error('❌ 사용자 정보 파싱 오류:', parseError);
            sessionStorage.removeItem('aicitybuilders_user_session');
            alert('로그인 정보에 문제가 있습니다. 다시 로그인해주세요.');
            window.location.href = '/';
            return;
          }
        } else {
          console.log('❌ 세션 정보가 없습니다');
          const confirmLogin = window.confirm('로그인이 필요한 서비스입니다. 먼저 로그인해주세요.\n\n로그인 페이지로 이동하시겠습니까?');
          if (confirmLogin) {
            window.location.href = '/login';
          } else {
            window.location.href = '/';
          }
          return;
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
        alert('인증 과정에서 오류가 발생했습니다.');
        window.location.href = '/';
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, []);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="masterclass-container">
        <NavigationBar
          onBack={onBack}
          breadcrumbText="강의 시청 페이지"
        />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #0ea5e9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            결제 상태를 확인하는 중...
          </p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!isAuthorized) {
    return (
      <div className="masterclass-container">
        <NavigationBar
          onBack={onBack}
          breadcrumbText="접근 권한 없음"
        />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ fontSize: '4rem' }}>🔒</div>
          <h2 style={{ color: '#1f2937', margin: 0 }}>접근 권한이 없습니다</h2>
          <p style={{ color: '#64748b', textAlign: 'center', margin: 0 }}>
            이 강의를 시청하려면 먼저 결제가 필요합니다.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            메인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 🔒 강의 오픈 날짜 체크
  const releaseDate = new Date('2026-01-01T00:00:00+09:00'); // 2026년 1월 1일
  const now = new Date();
  const isReleased = now >= releaseDate;

  // 인증된 사용자 - 강의 시청 페이지
  return (
    <div className="masterclass-container">
      <NavigationBar
        onBack={onBack}
        breadcrumbText="강의 1: AI 건물 짓기"
      />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* 강의 헤더 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            color: '#1f2937',
            marginBottom: '10px',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '700'
          }}>
            강의 1: AI 디지털 건물주 되기
          </h1>
          <h2 style={{
            color: '#0ea5e9',
            fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
            marginBottom: '20px',
            fontWeight: '500'
          }}>
            AI로 월세 받는 나의 첫 '수익형 디지털 건물' 짓기
          </h2>
          <p style={{
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            {isReleased 
              ? '환영합니다! 이제 실제 강의를 시청하고 나만의 수익형 디지털 건물을 완성해보세요.'
              : '얼리버드로 등록해주셔서 감사합니다! 강의는 2026년 1월 1일에 공개됩니다.'}
          </p>
        </div>

        {/* 🔒 강의 잠금 상태 또는 비디오 플레이어 */}
        {!isReleased ? (
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '20px',
            padding: '60px 30px',
            textAlign: 'center',
            marginBottom: '50px',
            border: '3px solid #fbbf24',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🔒</div>
            <h3 style={{
              color: '#fbbf24',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              marginBottom: '15px',
              fontWeight: '800'
            }}>
              강의 오픈 예정
            </h3>
            <p style={{
              color: '#e2e8f0',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
              marginBottom: '25px',
              lineHeight: '1.7'
            }}>
              이 강의는 <strong style={{ color: '#fbbf24' }}>2026년 1월 1일 자정</strong>에 공개됩니다.
            </p>
            <div style={{
              background: 'rgba(251, 191, 36, 0.15)',
              border: '2px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <p style={{
                color: '#cbd5e1',
                fontSize: '1rem',
                margin: 0,
                lineHeight: '1.6'
              }}>
                🎁 <strong style={{ color: '#fbbf24' }}>얼리버드 혜택</strong><br />
                강의 오픈 시 이메일로 알림을 드립니다.<br />
                그동안 <strong style={{ color: '#fbbf24' }}>AI 건물 공사장</strong>에서 채널 주제를 미리 선정해보세요!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '50px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '20px',
                padding: '30px',
                textAlign: 'center'
              }}>
                <h3 style={{
                  color: '#1f2937',
                  marginBottom: '20px',
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}>
                  Chapter 1. AI 건물 짓기 - 입지 선정부터 첫 월세까지
                </h3>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '56.25%',
                  height: 0,
                  background: '#000',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  border: '3px solid #0ea5e9'
                }}>
                  <iframe
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                    src="https://www.youtube.com/embed/8od7wv6tJIY?si=cM1TpOCYU-y0HIhU"
                    title="AI 건물 짓기 - Chapter 1"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* 강의 목록 - 가운데 정렬 */}
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            color: '#1f2937',
            marginBottom: '30px',
            fontSize: '1.5rem',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            📚 전체 강의 목록
          </h3>
          {course.lessons.map((lesson: any, index: number) => (
            <div key={lesson.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              padding: '20px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '15px',
              marginBottom: '15px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{
                backgroundColor: '#0ea5e9',
                color: '#ffffff',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  color: '#1f2937',
                  marginBottom: '5px',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  {lesson.title}
                </h4>
                <p style={{
                  color: '#64748b',
                  fontSize: '0.9rem',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Clock size={14} />
                  {lesson.duration}
                </p>
              </div>
              <Play size={24} color="#0ea5e9" />
            </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIBuildingCoursePlayerPage;
