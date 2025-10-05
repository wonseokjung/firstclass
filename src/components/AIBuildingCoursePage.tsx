import React, { useState, useEffect } from 'react';
import { Clock, Play, ChevronDown, ChevronRight, BookOpen, Wrench, Image } from 'lucide-react';
import NavigationBar from './NavigationBar';
import AzureTableService from '../services/azureTableService';
import { allCourses } from '../data/courseData';
import PaymentComponent from './PaymentComponent';

interface AIBuildingCoursePageProps {
  onBack: () => void;
}

const AIBuildingCoursePage: React.FC<AIBuildingCoursePageProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

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

  const originalPrice = 349000;
  const earlyBirdPrice = 149000;

  // 챕터 확장/접기 함수
  const toggleChapter = (chapterId: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (token) {
          setIsLoggedIn(true);
          setCheckingEnrollment(true);

          // 사용자 정보 가져오기
          try {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
              const userProfile = await AzureTableService.getUserByEmail(userEmail);
              setUserInfo(userProfile);
            }
          } catch (error) {
            console.error('사용자 정보 가져오기 실패:', error);
          }

          // 수강 상태 체크 로직은 향후 구현
          setIsAlreadyEnrolled(false);
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleEarlyBirdPayment = async () => {
    alert('결제 기능은 향후 구현 예정입니다.');
  };

  const handleLoginRequired = () => {
    alert('로그인이 필요한 서비스입니다.');
  };

  const isPaidUser = isLoggedIn && isAlreadyEnrolled;

  return (
    <div className="masterclass-container">
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="강의 1: AI 건물 짓기"
      />

      {isPaidUser ? (
        // 결제 후: 강의 시청 페이지
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
              환영합니다! 이제 실제 강의를 시청하고 나만의 수익형 디지털 건물을 완성해보세요.
            </p>
          </div>
          
          {/* 비디오 플레이어 */}
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
        </div>
      ) : (
        // 결제 전: 강의 구매 페이지
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          {/* 상단 메인 CTA */}
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            borderRadius: '25px',
            padding: '50px 40px',
            textAlign: 'center',
            marginBottom: '60px',
            color: 'white',
            boxShadow: '0 20px 40px rgba(14, 165, 233, 0.3)'
          }}>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              marginBottom: '15px',
              fontWeight: '800'
            }}>
              강의 1: AI 디지털 건물주 되기
            </h1>
            <h2 style={{ 
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              marginBottom: '30px',
              opacity: '0.95',
              fontWeight: '500'
            }}>
              AI로 월세 받는 나의 첫 '수익형 디지털 건물' 짓기
            </h2>
            
            {/* 가격 정보 */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                fontSize: '1.2rem', 
                opacity: '0.8',
                textDecoration: 'line-through',
                marginBottom: '8px'
              }}>
                ₩{originalPrice.toLocaleString()}
              </div>
              <div style={{ 
                fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', 
                fontWeight: '900',
                marginBottom: '8px'
              }}>
                ₩{earlyBirdPrice.toLocaleString()}
              </div>
              <div style={{ 
                fontSize: '1.1rem',
                opacity: '0.9'
              }}>
                월 {Math.floor(earlyBirdPrice / 12).toLocaleString()}원 (12개월 무이자)
              </div>
            </div>

            {/* 메인 수강 신청 버튼 */}
            <button 
              onClick={isLoggedIn && !isAlreadyEnrolled ? handleEarlyBirdPayment : handleLoginRequired}
              disabled={isLoading || checkingEnrollment || isAlreadyEnrolled}
              style={{
                background: '#ffffff',
                color: '#0ea5e9',
                border: 'none',
                padding: '20px 50px',
                fontSize: '1.4rem',
                fontWeight: '800',
                borderRadius: '15px',
                cursor: isAlreadyEnrolled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isAlreadyEnrolled ? '0.7' : '1',
                marginBottom: '20px',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              {checkingEnrollment ? (
                '수강 상태 확인 중...'
              ) : isLoading ? (
                '결제 진행 중...'
              ) : !isLoggedIn ? (
                '수강 신청하기'
              ) : isAlreadyEnrolled ? (
                '수강 중'
              ) : (
                '수강 신청하기'
              )}
            </button>
            
            <p style={{ 
              fontSize: '1rem', 
              opacity: '0.9',
              margin: '0'
            }}>
              {isAlreadyEnrolled 
                ? '이미 수강 중인 강좌입니다' :
               isLoggedIn 
                ? '토스페이먼츠 안전결제 | 즉시 수강 가능' 
                : '클릭하면 로그인 후 바로 수강 가능합니다'}
            </p>
          </div>

          {/* 📹 메인 히어로 영상 - 2분 강의 트레일러 */}
          <div style={{ 
            marginBottom: '60px',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '20px'
            }}>
              📹 강의 미리보기
            </h3>
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              background: '#f8fafc',
              border: '2px dashed #0ea5e9',
              borderRadius: '20px',
              padding: '60px 40px',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <Play size={64} color="#0ea5e9" />
              </div>
              <h4 style={{ 
                fontSize: '1.3rem',
                color: '#1f2937',
                marginBottom: '15px',
                fontWeight: '600'
              }}>
                2분 강의 트레일러 영상 자리
              </h4>
              <div style={{
                background: '#e2e8f0',
                padding: '15px',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#475569',
                lineHeight: '1.6'
              }}>
                <strong>포함 내용:</strong><br/>
                • 맨해튼 부자 삼촌 스토리 애니메이션 (30초)<br/>
                • AI로 만든 실제 디지털 건물 사례 (30초)<br/>
                • 첫 월세 받는 순간 시뮬레이션 (30초)<br/>
                • 수강생 성공 사례 몽타주 (30초)<br/>
                <strong>톤:</strong> 감성적이면서 구체적, Netflix 다큐 스타일
              </div>
            </div>
          </div>

          {/* 강의 소개 */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '40px', borderRadius: '20px', marginBottom: '40px', textAlign: 'center' }}>
              <h3 style={{ color: '#1f2937', fontSize: '1.5rem', marginBottom: '20px', fontWeight: '700' }}>
                "맨해튼 부동산 거물이 된 외삼촌의 비밀을 AI 시대에 재현하다"
              </h3>
              <p style={{ color: '#1f2937', fontSize: '1.1rem', lineHeight: '1.7', maxWidth: '800px', margin: '0 auto' }}>
                무작정 미국으로 건너온 외삼촌이 세탁소에서 시작해 맨해튼 부동산 거물이 된 실화.<br/>
                그가 가르쳐준 <strong style={{ color: '#0ea5e9' }}>'자산 구축의 4가지 원리'</strong>를 이제는 벽돌과 시멘트 대신 <strong style={{ color: '#0ea5e9' }}>AI와 콘텐츠</strong>로 실현합니다.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
              <div style={{ background: '#ffffff', padding: '30px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏗️</div>
                <h4 style={{ color: '#0ea5e9', fontSize: '1.2rem', marginBottom: '10px', fontWeight: '700' }}>교훈 1: 입지 선정</h4>
                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5' }}>디지털 맨해튼에서 수익성 높은 땅을 찾는 법</p>
              </div>
              <div style={{ background: '#ffffff', padding: '30px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🤖</div>
                <h4 style={{ color: '#0ea5e9', fontSize: '1.2rem', marginBottom: '10px', fontWeight: '700' }}>교훈 2: AI 건축 자재</h4>
                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5' }}>텍스트, 이미지, 사운드, 영상 AI 도구 완전 정복</p>
              </div>
              <div style={{ background: '#ffffff', padding: '30px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏢</div>
                <h4 style={{ color: '#0ea5e9', fontSize: '1.2rem', marginBottom: '10px', fontWeight: '700' }}>교훈 3: 시공 및 완공</h4>
                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5' }}>숏폼과 롱폼으로 실제 건물을 세상에 공개</p>
              </div>
              <div style={{ background: '#ffffff', padding: '30px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💰</div>
                <h4 style={{ color: '#0ea5e9', fontSize: '1.2rem', marginBottom: '10px', fontWeight: '700' }}>교훈 4: 첫 월세 받기</h4>
                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5' }}>4가지 수익원으로 안정적인 포트폴리오 구축</p>
              </div>
            </div>

            {/* 🖼️ 성공 스토리 인포그래픽 - 3단계 성공 여정 */}
            <div style={{
              background: '#ffffff',
              padding: '40px',
              borderRadius: '20px',
              marginBottom: '40px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <h4 style={{ 
                fontSize: '1.5rem',
                color: '#1f2937',
                marginBottom: '30px',
                fontWeight: '700'
              }}>
                3단계 성공 여정 인포그래픽
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '30px',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: '#f8fafc',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '15px',
                  padding: '30px 20px',
                  textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <Image size={48} color="#64748b" />
                  </div>
                  <h5 style={{ color: '#1f2937', marginBottom: '10px', fontWeight: '600' }}>BEFORE</h5>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0' }}>
                    직장인<br/>월급에만 의존<br/>부수입 0원
                  </p>
                </div>
                <div style={{
                  background: '#f8fafc',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '15px',
                  padding: '30px 20px',
                  textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <Image size={48} color="#64748b" />
                  </div>
                  <h5 style={{ color: '#1f2937', marginBottom: '10px', fontWeight: '600' }}>LEARNING</h5>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0' }}>
                    AI 도구 학습<br/>16강의 완주<br/>실습 프로젝트
                  </p>
                </div>
                <div style={{
                  background: '#f8fafc',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '15px',
                  padding: '30px 20px',
                  textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <Image size={48} color="#64748b" />
                  </div>
                  <h5 style={{ color: '#1f2937', marginBottom: '10px', fontWeight: '600' }}>AFTER</h5>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0' }}>
                    디지털 건물주<br/>월 50만원 부수입<br/>경제적 자유
                  </p>
                </div>
              </div>
              <div style={{
                background: '#e2e8f0',
                padding: '15px',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#475569'
              }}>
                <strong>디자인 요청:</strong> 깔끔한 아이콘 + 브랜드 컬러(#0ea5e9) + 구체적 숫자와 시각적 변화 표현
              </div>
            </div>
          </div>

          {/* AI City Builders 플랫폼 구조 */}
          <div style={{
            background: '#ffffff',
            padding: '60px 40px',
            borderRadius: '24px',
            marginBottom: '80px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h3 style={{
                fontSize: '2.2rem',
                fontWeight: '800',
                marginBottom: '16px',
                color: '#1f2937'
              }}>
                왜 AI City Builders가 더 저렴하면서도 더 나은가?
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0'
              }}>
                기존 교육 플랫폼의 한계를 뛰어넘는 혁신적인 구조
              </p>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '32px',
              marginBottom: '50px'
            }}>
              {/* 기존 플랫폼 구조 */}
              <div style={{
                background: '#ffffff',
                padding: '32px',
                borderRadius: '20px',
                border: '2px solid #fee2e2',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.08)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '24px',
                  background: '#ef4444',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}>
                  기존 플랫폼
                </div>
                
                <div style={{ marginTop: '24px' }}>
                  <div style={{
                    background: '#fef7f7',
                    padding: '20px',
                    borderRadius: '16px',
                    marginBottom: '20px',
                    border: '1px solid #fecaca'
                  }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      📊 수익 배분
                    </h4>
                    <div style={{ gap: '12px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid #fecaca'
                      }}>
                        <span style={{ color: '#7f1d1d', fontSize: '0.95rem' }}>강사</span>
                        <span style={{ fontWeight: '700', color: '#dc2626', fontSize: '1.1rem' }}>20~30%</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0'
                      }}>
                        <span style={{ color: '#7f1d1d', fontSize: '0.95rem' }}>플랫폼</span>
                        <span style={{ fontWeight: '700', color: '#dc2626', fontSize: '1.1rem' }}>70~80%</span>
                      </div>
                    </div>
                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#991b1b',
                      fontWeight: '600'
                    }}>
                      → 광고비, 운영비로 인한 높은 수강료
                    </div>
                  </div>
                  
                  <div style={{
                    background: '#fef7f7',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #fecaca'
                  }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      👥 학습 방식
                    </h4>
                    <ul style={{ margin: '0', paddingLeft: '0', listStyle: 'none' }}>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        color: '#7f1d1d'
                      }}>
                        <span style={{ color: '#dc2626', fontWeight: '700' }}>✕</span>
                        단순 수강자로만 참여
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        color: '#7f1d1d'
                      }}>
                        <span style={{ color: '#dc2626', fontWeight: '700' }}>✕</span>
                        일방향 학습
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#7f1d1d'
                      }}>
                        <span style={{ color: '#dc2626', fontWeight: '700' }}>✕</span>
                        강의 완료 후 관계 종료
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI City Builders 구조 */}
              <div style={{
                background: '#ffffff',
                padding: '32px',
                borderRadius: '20px',
                border: '2px solid #dbeafe',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.08)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '24px',
                  background: '#0ea5e9',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '50px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
                }}>
                  AI City Builders
                </div>
                
                <div style={{ marginTop: '24px' }}>
                  <div style={{
                    background: '#f0f9ff',
                    padding: '20px',
                    borderRadius: '16px',
                    marginBottom: '20px',
                    border: '1px solid #bae6fd'
                  }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#0ea5e9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🚀 새로운 수익 구조
                    </h4>
                    <ul style={{ margin: '0', paddingLeft: '0', listStyle: 'none' }}>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        자체 제작으로 중간 수수료 없음
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        커뮤니티 홍보 시 10% 리워드 (현금 교환 가능)
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        등급 상승으로 수익률 증가
                      </li>
                    </ul>
                    <div style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: '#0ea5e9',
                      color: 'white',
                      borderRadius: '12px',
                      textAlign: 'center',
                      fontWeight: '700',
                      fontSize: '1.1rem'
                    }}>
                      결과: 50% 저렴한 수강료
                    </div>
                  </div>
                  
                  <div style={{
                    background: '#f0f9ff',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #bae6fd'
                  }}>
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      marginBottom: '16px',
                      color: '#0ea5e9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      🌟 참여자 중심 생태계
                    </h4>
                    <ul style={{ margin: '0', paddingLeft: '0', listStyle: 'none' }}>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        단순 수강자에서 적극적 참여자로
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        함께 성장하는 커뮤니티
                      </li>
                      <li style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#0c4a6e'
                      }}>
                        <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                        홍보 참여로 수익 창출 기회
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 핵심 차별점 요약 */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              padding: '40px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px solid #cbd5e1'
            }}>
              <div style={{
                display: 'inline-block',
                background: '#0ea5e9',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: '700',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
              }}>
                제이 멘토의 실제 조사 결과
              </div>
              <blockquote style={{
                fontSize: '1.15rem',
                lineHeight: '1.8',
                margin: '0',
                color: '#374151',
                fontStyle: 'italic',
                position: 'relative',
                padding: '0 20px'
              }}>
                <span style={{ 
                  fontSize: '3rem', 
                  color: '#0ea5e9', 
                  position: 'absolute', 
                  left: '-10px', 
                  top: '-10px',
                  fontFamily: 'serif'
                }}>"</span>
                모든 주요 교육 플랫폼과 미팅하고 계약서를 분석한 결과, 기존 플랫폼들은 강사에게 20~30%만 주고 70~80%를 가져가 수강료가 비쌀 수밖에 없었습니다. AI City Builders는 이 구조를 완전히 뒤집어 여러분께 더 저렴하고 더 나은 가치를 제공합니다.
                <span style={{ 
                  fontSize: '3rem', 
                  color: '#0ea5e9', 
                  position: 'absolute', 
                  right: '-10px', 
                  bottom: '-30px',
                  fontFamily: 'serif'
                }}>"</span>
              </blockquote>
            </div>
          </div>

          {/* 강의 차별화 포인트 */}
          <div style={{
            background: '#ffffff',
            padding: '50px',
            borderRadius: '25px',
            marginBottom: '60px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              학습 방식의 차이
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              <div style={{
                padding: '30px',
                background: '#fef2f2',
                borderRadius: '15px',
                border: '1px solid #fecaca'
              }}>
                <h4 style={{ color: '#dc2626', marginBottom: '15px', fontWeight: '600' }}>❌ 일반 AI 강의</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.8', margin: '0', paddingLeft: '20px' }}>
                  <li>이론만 배움</li>
                  <li>도구 사용법만</li>
                  <li>혼자 학습</li>
                  <li>단순 기능 설명</li>
                  <li>강의 완료 후 관계 끝</li>
                </ul>
              </div>
              <div style={{
                padding: '30px',
                background: '#f0fdf4',
                borderRadius: '15px',
                border: '1px solid #bbf7d0'
              }}>
                <h4 style={{ color: '#16a34a', marginBottom: '15px', fontWeight: '600' }}>✅ AI 건물주 되기</h4>
                <ul style={{ color: '#64748b', lineHeight: '1.8', margin: '0', paddingLeft: '20px' }}>
                  <li>실제 수익 창출</li>
                  <li>비즈니스 전략까지</li>
                  <li>커뮤니티 + 멘토링</li>
                  <li>맨해튼 부동산 철학</li>
                  <li>지속적인 참여자 관계</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 🎯 강의 상세 정보 섹션 */}
          <div style={{
            background: '#ffffff',
            padding: '50px',
            borderRadius: '25px',
            marginBottom: '40px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              강의 상세 정보
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px',
              marginBottom: '40px'
            }}>
              {/* 강의 기본 정보 */}
              <div style={{
                background: '#f8fafc',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ color: '#0ea5e9', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>
                  📊 강의 기본 정보
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: '0', 
                  margin: '0',
                  color: '#1f2937',
                  lineHeight: '2'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>총 강의 시간:</strong> 16시간 (16강의)
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>난이도:</strong> 초급~중급 (AI 경험 불필요)
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>수강 기간:</strong> 평생 무제한
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>업데이트:</strong> 매월 새로운 AI 도구 추가
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>자료 제공:</strong> 100+ 프롬프트 템플릿
                  </li>
                </ul>
              </div>

              {/* 수강 대상 */}
              <div style={{
                background: '#f0fdf4',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #bbf7d0'
              }}>
                <h4 style={{ color: '#16a34a', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>
                  🎯 이런 분께 추천해요
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: '0', 
                  margin: '0',
                  color: '#1f2937',
                  lineHeight: '2'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    ✅ 부수입을 만들고 싶은 직장인
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    ✅ 경제적 자유를 꿈꾸는 모든 분
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    ✅ AI 도구에 관심 있는 초보자
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    ✅ 콘텐츠 창작에 도전하고 싶은 분
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    ✅ 디지털 마케팅을 배우고 싶은 분
                  </li>
                </ul>
              </div>

              {/* 학습 목표 */}
              <div style={{
                background: '#fef7ff',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #e9d5ff'
              }}>
                <h4 style={{ color: '#7c3aed', fontSize: '1.2rem', fontWeight: '700', marginBottom: '15px' }}>
                  🚀 학습 완료 후 여러분은
                </h4>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: '0', 
                  margin: '0',
                  color: '#1f2937',
                  lineHeight: '2'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    💡 10가지 AI 도구를 자유자재로 활용
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    📈 첫 번째 디지털 수익 창출
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    🎬 바이럴 콘텐츠 제작 능력 획득
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    💰 4가지 수익 포트폴리오 구축
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    🏆 맨해튼 부동산 철학 체득
                  </li>
                </ul>
              </div>

              {/* 제공 혜택 */}
            </div>
            
            {/* 강의 방식 */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#0ea5e9', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                강의 수강 방식
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '20px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>HD 동영상</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>1080p 고화질</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>모바일 최적화</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>언제 어디서나</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>배속 조절</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>0.5x ~ 2x</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>실습 자료</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>다운로드 제공</div>
                </div>
              </div>
            </div>
          </div>


          {/* 수강생 성과 타임라인 */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '50px',
            borderRadius: '25px',
            marginBottom: '60px'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              수강생 성과 타임라인
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '25px'
            }}>
              <div style={{
                background: '#ffffff',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  background: '#0ea5e9',
                  color: 'white',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px auto',
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}>
                  30
                </div>
                <h4 style={{ color: '#1f2937', marginBottom: '8px', fontWeight: '600' }}>수강 후 30일</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0' }}>첫 콘텐츠 제작 완료</p>
              </div>
              <div style={{
                background: '#ffffff',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  background: '#0ea5e9',
                  color: 'white',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px auto',
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}>
                  60
                </div>
                <h4 style={{ color: '#1f2937', marginBottom: '8px', fontWeight: '600' }}>수강 후 60일</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0' }}>첫 수익 발생</p>
              </div>
              <div style={{
                background: '#ffffff',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  background: '#0ea5e9',
                  color: 'white',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px auto',
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}>
                  90
                </div>
                <h4 style={{ color: '#1f2937', marginBottom: '8px', fontWeight: '600' }}>수강 후 90일</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0' }}>월 10만원 달성</p>
              </div>
              <div style={{
                background: '#ffffff',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  background: '#0ea5e9',
                  color: 'white',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px auto',
                  fontSize: '1.2rem',
                  fontWeight: '700'
                }}>
                  120
                </div>
                <h4 style={{ color: '#1f2937', marginBottom: '8px', fontWeight: '600' }}>수강 후 120일</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0' }}>월 30만원 안정화</p>
              </div>
            </div>
            <div style={{
              background: '#ffffff',
              padding: '20px',
              borderRadius: '10px',
              marginTop: '25px',
              fontSize: '14px',
              color: '#64748b',
              textAlign: 'center'
            }}>
              <strong>* 실제 수강생 사례 기반 (개인차 있음, 익명화 처리)</strong>
            </div>
          </div>

          {/* 멘토 소개 섹션 */}
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            color: 'white',
            padding: '50px',
            borderRadius: '25px',
            marginBottom: '40px'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '40px',
              color: 'white'
            }}>
              멘토 소개
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  margin: '0 auto 20px auto',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}>
                  <img 
                    src="/images/jaymentor.PNG" 
                    alt="정원석 (Jay) 멘토"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      // 폴백으로 텍스트 보여주기
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div style="width: 100%; height: 100%; background: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: white;">정원석</div>';
                      }
                    }}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '5px 12px',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    AI 전문가
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '5px 12px',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    기업가
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '5px 12px',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    교수
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  marginBottom: '10px',
                  color: 'white'
                }}>
                  정원석 (Jay)
                </h4>
                <p style={{ 
                  fontSize: '1.1rem', 
                  marginBottom: '25px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '500'
                }}>
                  AI City Builders 대표 멘토
                </p>
                
                <div style={{ marginBottom: '25px' }}>
                  <h5 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '15px',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    학력
                  </h5>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: '0', 
                    margin: '0',
                    lineHeight: '1.8',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    <li>• 일리노이 공과대학교 (Illinois Institute of Technology) 데이터과학 석사</li>
                    <li>• 뉴욕시립대 바루크 컬리지 (City University of New York - Baruch College) 데이터과학 학사</li>
                  </ul>
                </div>
                
                <div style={{ marginBottom: '25px' }}>
                  <h5 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '15px',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    현재 활동
                  </h5>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: '0', 
                    margin: '0',
                    lineHeight: '1.8',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    <li>• 커넥젼에이아이 대표 (AI 솔루션 개발 및 컨설팅)</li>
                    <li>• 서울사이버대학교 대우교수 (공과대학 인공지능 전공)</li>
                    <li>• Connect AI LAB 유튜브 채널 운영</li>
                    <li>• aimentorjay 인스타그램 30만 팔로워</li>
                  </ul>
                </div>
                
                <div style={{ marginBottom: '25px' }}>
                  <h5 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    marginBottom: '15px',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    주요 성과
                  </h5>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: '0', 
                    margin: '0',
                    lineHeight: '1.8',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    <li>• 메타 아시아 지역 글로벌 리더 선정 (2022, 4인 중 1명)</li>
                    <li>• 뤼튼 해커톤 1위 수상 (AI 해킹 방어 툴 개발)</li>
                    <li>• AI 헬스케어 스타트업 옵트버스 설립 (50억원 기업가치)</li>
                    <li>• 모두의연구소 인공지능 선임연구원 (200명 이상 AI 연구원 양성)</li>
                    <li>• Best Poster Award 수상 (강화학습 연구)</li>
                  </ul>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  <strong>"저는 단순히 AI 도구 사용법을 가르치지 않습니다."</strong><br/>
                  15년간의 실전 경험과 맨해튼에서 배운 부동산 투자 철학을 AI 시대에 맞게 재해석하여, 
                  진정한 '디지털 자산'을 구축하는 방법을 알려드립니다. 함께 AI 도시를 만들어갑시다.
                </div>
              </div>
            </div>
          </div>

          {/* FAQ 섹션 */}
          <div style={{
            background: '#ffffff',
            padding: '50px',
            borderRadius: '25px',
            marginBottom: '40px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              자주 묻는 질문
            </h3>
            
            <div style={{
              display: 'grid',
              gap: '20px'
            }}>
              {/* FAQ 1 */}
              <div style={{
                background: '#f8fafc',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ 
                  color: '#0ea5e9', 
                  fontSize: '1.1rem', 
                  fontWeight: '700', 
                  marginBottom: '10px'
                }}>
                  Q. AI 경험이 전혀 없어도 따라할 수 있나요?
                </h4>
                <p style={{ 
                  color: '#1f2937', 
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  A. 네! 이 강의는 "컴맹도 OK"를 모토로 설계되었습니다. 
                  마우스 클릭부터 시작해서 단계별로 친절하게 알려드리므로, 
                  AI를 처음 접하시는 분도 쉽게 따라하실 수 있습니다.
                </p>
              </div>

              {/* FAQ 2 */}
              <div style={{
                background: '#f0fdf4',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #bbf7d0'
              }}>
                <h4 style={{ 
                  color: '#16a34a', 
                  fontSize: '1.1rem', 
                  fontWeight: '700', 
                  marginBottom: '10px'
                }}>
                  Q. 정말로 월 수십만원 수익이 가능한가요?
                </h4>
                <p style={{ 
                  color: '#1f2937', 
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  A. 개인차는 있지만, 현재 수강생 중 85%가 3개월 내 첫 수익을 달성했습니다. 
                  다만 결과는 개인의 노력과 실행력에 따라 달라질 수 있으며, 
                  구체적인 수익을 보장하지는 않습니다.
                </p>
              </div>

              {/* FAQ 3 */}
              <div style={{
                background: '#fef7ff',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #e9d5ff'
              }}>
                <h4 style={{ 
                  color: '#7c3aed', 
                  fontSize: '1.1rem', 
                  fontWeight: '700', 
                  marginBottom: '10px'
                }}>
                  Q. 하루에 얼마나 시간을 투자해야 하나요?
                </h4>
                <p style={{ 
                  color: '#1f2937', 
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  A. 하루 30분~1시간이면 충분합니다. 출퇴근 시간이나 점심시간을 활용해서 
                  모바일로도 학습할 수 있도록 구성되어 있어, 바쁜 직장인분들도 무리 없이 
                  수강하실 수 있습니다.
                </p>
              </div>

              {/* FAQ 4 */}
              <div style={{
                background: '#fffbeb',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #fed7aa'
              }}>
                <h4 style={{ 
                  color: '#d97706', 
                  fontSize: '1.1rem', 
                  fontWeight: '700', 
                  marginBottom: '10px'
                }}>
                  Q. 수강료 외에 추가 비용이 발생하나요?
                </h4>
                <p style={{ 
                  color: '#1f2937', 
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  A. 기본적으로는 추가 비용이 없습니다. 강의에서 사용하는 AI 도구들의 
                  무료 버전으로도 충분히 학습하고 수익 창출이 가능합니다. 
                  더 고급 기능이 필요한 경우에만 선택적으로 유료 플랜을 이용하시면 됩니다.
                </p>
              </div>

              {/* FAQ 5 */}
              <div style={{
                background: '#f0f9ff',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid #bae6fd'
              }}>
                <h4 style={{ 
                  color: '#0284c7', 
                  fontSize: '1.1rem', 
                  fontWeight: '700', 
                  marginBottom: '10px'
                }}>
                  Q. 수강 후 지속적인 지원이 있나요?
                </h4>
                <p style={{ 
                  color: '#1f2937', 
                  margin: '0',
                  lineHeight: '1.6'
                }}>
                  A. 네! 전용 커뮤니티에서 평생 소통 가능하며, 3개월간 월 1회 그룹 멘토링을 
                  제공합니다. 또한 새로운 AI 도구가 출시될 때마다 업데이트 강의를 
                  무료로 제공해드립니다.
                </p>
              </div>
            </div>
          </div>

          {/* 커리큘럼 - 가운데 배치 */}
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '25px',
            padding: '50px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              color: '#1f2937', 
              fontSize: '2rem', 
              fontWeight: '800',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              📚 커리큘럼
            </h3>
            <p style={{ 
              color: '#64748b', 
              fontSize: '1.2rem',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              총 16강의 · 약 16시간 · 4가지 교훈
            </p>
            
            {/* 교훈 1: 입지 선정 */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                background: '#0ea5e9',
                color: 'white',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '700',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  교훈 1: 입지 선정
                </h4>
                <p style={{ 
                  margin: '8px 0 0 0', 
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  디지털 맨해튼에서 수익성 높은 땅을 찾는 법
                </p>
                
                {/* 📹 교훈 1 미리보기 영상 */}
                <div style={{
                  background: '#f8fafc',
                  border: '2px dashed #0ea5e9',
                  borderRadius: '12px',
                  padding: '20px',
                  margin: '15px 0',
                  textAlign: 'center'
                }}>
                  <Play size={32} color="#0ea5e9" style={{ marginBottom: '10px' }} />
                  <p style={{ 
                    color: '#0ea5e9', 
                    fontSize: '0.9rem', 
                    fontWeight: '600',
                    margin: '0'
                  }}>
                    30초 미리보기: GOOGLE AI STUDIO 실제 화면 조작
                  </p>
                </div>
              </div>
              
              {course.lessons.slice(0, 5).map((lesson: any, index: number) => (
                <div 
                  key={lesson.id} 
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  {/* 챕터 헤더 */}
                  <div 
                    onClick={() => toggleChapter(lesson.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 20px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ 
                      backgroundColor: '#0ea5e9',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ 
                        color: '#1f2937', 
                        marginBottom: '4px',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {lesson.title}
                      </h5>
                      <p style={{ 
                        color: '#64748b', 
                        fontSize: '0.85rem',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Clock size={12} />
                        {lesson.duration}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {expandedChapters.has(lesson.id) ? 
                        <ChevronDown size={18} color="#64748b" /> : 
                        <ChevronRight size={18} color="#64748b" />
                      }
                    </div>
                  </div>

                  {/* 이론 & 실습 섹션 */}
                  {expandedChapters.has(lesson.id) && lesson.sections && (
                    <div style={{ 
                      borderTop: '1px solid #f1f5f9',
                      padding: '0 20px 20px 20px'
                    }}>
                      {/* 이론 섹션 */}
                      <div style={{ 
                        marginBottom: '15px',
                        padding: '12px 15px',
                        background: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #0ea5e9'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#0ea5e9" />
                          <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            이론
                          </span>
                        </div>
                        <p style={{ 
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.theory}
                        </p>
                      </div>

                      {/* 실습 섹션 */}
                      <div style={{ 
                        padding: '12px 15px',
                        background: '#0ea5e9',
                        borderRadius: '8px',
                        border: '1px solid #0ea5e9'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#ffffff" />
                          <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: '600',
                            color: '#ffffff'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{ 
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#ffffff',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.practice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 교훈 2: AI 건축 자재 */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                background: '#0ea5e9',
                color: 'white',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '700',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  교훈 2: AI 건축 자재
                </h4>
                <p style={{ 
                  margin: '8px 0 0 0', 
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  텍스트, 이미지, 사운드, 영상 AI 도구 완전 정복
                </p>
                
                {/* 🖼️ AI 도구 생태계 맵 */}
                <div style={{
                  background: '#ffffff',
                  border: '2px dashed #0ea5e9',
                  borderRadius: '12px',
                  padding: '25px',
                  margin: '15px 0'
                }}>
                  <h5 style={{ 
                    color: '#1f2937', 
                    fontSize: '1.1rem', 
                    fontWeight: '600',
                    marginBottom: '15px',
                    textAlign: 'center'
                  }}>
                    AI 도구들의 연결 관계도
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ textAlign: 'center', padding: '10px', background: '#f0f9ff', borderRadius: '8px' }}>
                      <Image size={24} color="#0ea5e9" style={{ marginBottom: '5px' }} />
                      <div style={{ fontSize: '0.8rem', color: '#1f2937', fontWeight: '600' }}>ChatGPT</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>텍스트 → 아이디어</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '10px', background: '#f0f9ff', borderRadius: '8px' }}>
                      <Image size={24} color="#0ea5e9" style={{ marginBottom: '5px' }} />
                      <div style={{ fontSize: '0.8rem', color: '#1f2937', fontWeight: '600' }}>VEO</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>영상 → 숏폼/롱폼</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '10px', background: '#f0f9ff', borderRadius: '8px' }}>
                      <Image size={24} color="#0ea5e9" style={{ marginBottom: '5px' }} />
                      <div style={{ fontSize: '0.8rem', color: '#1f2937', fontWeight: '600' }}>ElevenLabs</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>음성 → 나레이션</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '10px', background: '#f0f9ff', borderRadius: '8px' }}>
                      <Image size={24} color="#0ea5e9" style={{ marginBottom: '5px' }} />
                      <div style={{ fontSize: '0.8rem', color: '#1f2937', fontWeight: '600' }}>Suno</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>음악 → 배경음악</div>
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    padding: '10px',
                    background: '#0ea5e9',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    → 하나의 "디지털 건물" 완성
                  </div>
                </div>
              </div>
              
              {course.lessons.slice(5, 9).map((lesson: any, index: number) => (
                <div 
                  key={lesson.id} 
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  {/* 챕터 헤더 */}
                  <div 
                    onClick={() => toggleChapter(lesson.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 20px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ 
                      backgroundColor: '#0ea5e9',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {index + 6}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ 
                        color: '#1f2937', 
                        marginBottom: '4px',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {lesson.title}
                      </h5>
                      <p style={{ 
                        color: '#64748b', 
                        fontSize: '0.85rem',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Clock size={12} />
                        {lesson.duration}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {expandedChapters.has(lesson.id) ? 
                        <ChevronDown size={18} color="#64748b" /> : 
                        <ChevronRight size={18} color="#64748b" />
                      }
                    </div>
                  </div>

                  {/* 이론 & 실습 섹션 */}
                  {expandedChapters.has(lesson.id) && lesson.sections && (
                    <div style={{ 
                      borderTop: '1px solid #f1f5f9',
                      padding: '0 20px 20px 20px'
                    }}>
                      {/* 이론 섹션 */}
                      <div style={{ 
                        marginBottom: '15px',
                        padding: '12px 15px',
                        background: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #0ea5e9'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#0ea5e9" />
                          <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            이론
                          </span>
                        </div>
                        <p style={{ 
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.theory}
                        </p>
                      </div>

                      {/* 실습 섹션 */}
                      <div style={{ 
                        padding: '12px 15px',
                        background: '#0ea5e9',
                        borderRadius: '8px',
                        border: '1px solid #0ea5e9'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#ffffff" />
                          <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: '600',
                            color: '#ffffff'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{ 
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#ffffff',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.practice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 교훈 3: 시공 및 완공 */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                background: '#0ea5e9',
                color: 'white',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '700',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  교훈 3: 시공 및 완공
                </h4>
                <p style={{ 
                  margin: '8px 0 0 0', 
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  숏폼과 롱폼으로 실제 건물을 세상에 공개
                </p>
              </div>
              
              {course.lessons.slice(9, 12).map((lesson: any, index: number) => (
                <div 
                  key={lesson.id} 
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  {/* 챕터 헤더 */}
                  <div 
                    onClick={() => toggleChapter(lesson.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 20px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ 
                      backgroundColor: '#0ea5e9',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {index + 10}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ 
                        color: '#1f2937', 
                        marginBottom: '4px',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {lesson.title}
                      </h5>
                      <p style={{ 
                        color: '#64748b', 
                        fontSize: '0.85rem',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Clock size={12} />
                        {lesson.duration}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {expandedChapters.has(lesson.id) ? 
                        <ChevronDown size={18} color="#64748b" /> : 
                        <ChevronRight size={18} color="#64748b" />
                      }
                    </div>
                  </div>

                  {/* 이론 & 실습 섹션 */}
                  {expandedChapters.has(lesson.id) && lesson.sections && (
                    <div style={{ 
                      borderTop: '1px solid #f1f5f9',
                      padding: '0 20px 20px 20px'
                    }}>
                      {/* 이론 섹션 */}
                      <div style={{ 
                        marginBottom: '15px',
                        padding: '12px 15px',
                        background: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #0ea5e9'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#0ea5e9" />
                          <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            이론
                          </span>
                        </div>
                        <p style={{ 
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.theory}
                        </p>
                      </div>

                      {/* 실습 섹션 */}
                      <div style={{ 
                        padding: '12px 15px',
                        background: '#0ea5e9',
                        borderRadius: '8px',
                        border: '1px solid #0ea5e9'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#ffffff" />
                          <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: '600',
                            color: '#ffffff'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{ 
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#ffffff',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.practice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 교훈 4: 첫 월세 받기 */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                background: '#0ea5e9',
                color: 'white',
                padding: '20px',
                borderRadius: '15px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '700',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  교훈 4: 첫 월세 받기
                </h4>
                <p style={{ 
                  margin: '8px 0 0 0', 
                  fontSize: '1rem',
                  opacity: '0.9'
                }}>
                  4가지 수익원으로 안정적인 포트폴리오 구축
                </p>
                
                {/* 🖼️ 수익 포트폴리오 차트 */}
                <div style={{
                  background: '#ffffff',
                  border: '2px dashed #0ea5e9',
                  borderRadius: '12px',
                  padding: '25px',
                  margin: '15px 0'
                }}>
                  <h5 style={{ 
                    color: '#1f2937', 
                    fontSize: '1.1rem', 
                    fontWeight: '600',
                    marginBottom: '15px',
                    textAlign: 'center'
                  }}>
                    4가지 수익원 파이차트
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '15px'
                  }}>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '15px', 
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', 
                      borderRadius: '10px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '5px' }}>35%</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>애드센스</div>
                    </div>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '15px', 
                      background: 'linear-gradient(135deg, #06b6d4, #0891b2)', 
                      borderRadius: '10px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '5px' }}>30%</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>제휴마케팅</div>
                    </div>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '15px', 
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                      borderRadius: '10px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '5px' }}>25%</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>멤버십</div>
                    </div>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '15px', 
                      background: 'linear-gradient(135deg, #10b981, #059669)', 
                      borderRadius: '10px',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '5px' }}>10%</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>디지털 상품</div>
                    </div>
                  </div>
                  <div style={{
                    marginTop: '15px',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: '#64748b'
                  }}>
                    💡 각 영역을 클릭하면 상세 설명이 표시됩니다
                  </div>
                </div>
              </div>
              
              {course.lessons.slice(12).map((lesson: any, index: number) => (
                <div 
                  key={lesson.id} 
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
                  {/* 챕터 헤더 */}
                  <div 
                    onClick={() => toggleChapter(lesson.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px 20px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ 
                      backgroundColor: '#0ea5e9',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {index + 13}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ 
                        color: '#1f2937', 
                        marginBottom: '4px',
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {lesson.title}
                      </h5>
                      <p style={{ 
                        color: '#64748b', 
                        fontSize: '0.85rem',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <Clock size={12} />
                        {lesson.duration}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {expandedChapters.has(lesson.id) ? 
                        <ChevronDown size={18} color="#64748b" /> : 
                        <ChevronRight size={18} color="#64748b" />
                      }
                    </div>
                  </div>

                  {/* 이론 & 실습 섹션 */}
                  {expandedChapters.has(lesson.id) && lesson.sections && (
                    <div style={{ 
                      borderTop: '1px solid #f1f5f9',
                      padding: '0 20px 20px 20px'
                    }}>
                      {/* 이론 섹션 */}
                      <div style={{ 
                        marginBottom: '15px',
                        padding: '12px 15px',
                        background: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #0ea5e9'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <BookOpen size={16} color="#0ea5e9" />
                          <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: '600',
                            color: '#0ea5e9'
                          }}>
                            이론
                          </span>
                        </div>
                        <p style={{ 
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.theory}
                        </p>
                      </div>

                      {/* 실습 섹션 */}
                      <div style={{ 
                        padding: '12px 15px',
                        background: '#0ea5e9',
                        borderRadius: '8px',
                        border: '1px solid #0ea5e9'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Wrench size={16} color="#ffffff" />
                          <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: '600',
                            color: '#ffffff'
                          }}>
                            실습
                          </span>
                        </div>
                        <p style={{ 
                          margin: '0',
                          fontSize: '0.85rem',
                          color: '#ffffff',
                          lineHeight: '1.5'
                        }}>
                          {lesson.sections.practice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 가격 비교 섹션 - 상단으로 이동 */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '80px 20px',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '20px'
          }}>
            왜 AI CITY BUILDER가 더 저렴한가요?
          </h2>
          
          <p style={{
            textAlign: 'center',
            fontSize: '1.2rem',
            color: '#6b7280',
            marginBottom: '60px',
            lineHeight: '1.6'
          }}>
            다른 플랫폼과 우리의 <strong>수익 구조 차이</strong>를 확인해보세요
          </p>


          {/* 막대 그래프 비교 */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            marginBottom: '50px'
          }}>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              📊 가격 구조 한눈에 비교
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px'
            }}>
              {/* 다른 플랫폼 막대 */}
              <div>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#dc2626',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  📚 다른 강의 플랫폼
                </h4>
                
                <div style={{
                  background: '#f3f4f6',
                  borderRadius: '15px',
                  padding: '20px',
                  position: 'relative',
                  height: '300px'
                }}>
                  {/* 100% 막대 */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '240px',
                    background: 'linear-gradient(to top, #10b981 0% 20%, #dc2626 20% 100%)',
                    borderRadius: '10px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
                  }}>
                    {/* 플랫폼 수수료 80% */}
                    <div style={{
                      position: 'absolute',
                      top: '10%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      textAlign: 'center',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      플랫폼<br/>80%
                    </div>
                    
                    {/* 크리에이터 20% */}
                    <div style={{
                      position: 'absolute',
                      bottom: '5%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      textAlign: 'center',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      20%
                    </div>
                  </div>
                  
                  {/* 100% 라벨 */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#dc2626'
                  }}>
                    100% 가격
                  </div>
                </div>

                <p style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  marginTop: '15px',
                  lineHeight: '1.4'
                }}>
                  높은 플랫폼 수수료로<br/>
                  <strong>비싼 가격 불가피</strong>
                </p>
              </div>

              {/* AI CITY BUILDER 막대 */}
              <div>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#0ea5e9',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  🏗️ AI CITY BUILDER
                </h4>
                
                <div style={{
                  background: '#f0f9ff',
                  borderRadius: '15px',
                  padding: '20px',
                  position: 'relative',
                  height: '300px',
                  border: '2px solid #0ea5e9'
                }}>
                  {/* 20% 막대 */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '48px', // 240px의 20%
                    background: 'linear-gradient(to top, #0ea5e9, #0284c7)',
                    borderRadius: '10px',
                    boxShadow: '0 5px 15px rgba(14, 165, 233, 0.3)'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      textAlign: 'center',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      20%
                    </div>
                  </div>
                  
                  {/* 절약 표시 */}
                  <div style={{
                    position: 'absolute',
                    top: '35%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#10b981'
                  }}>
                    💰
                  </div>
                  
                  <div style={{
                    position: 'absolute',
                    top: '55%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#10b981',
                    textAlign: 'center'
                  }}>
                    80% 절약!
                  </div>
                  
                  {/* 20% 라벨 */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#0ea5e9'
                  }}>
                    20% 가격
                  </div>
                </div>

                <p style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  marginTop: '15px',
                  lineHeight: '1.4'
                }}>
                  자체 제작으로<br/>
                  <strong>획기적 가격 실현</strong>
                </p>
              </div>
            </div>

            {/* 절약 효과 강조 */}
            <div style={{
              marginTop: '40px',
              textAlign: 'center',
              padding: '30px',
              background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
              borderRadius: '15px',
              border: '2px solid #10b981'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '10px'
              }}>
                🎉
              </div>
              <h4 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#059669',
                marginBottom: '10px'
              }}>
                80% 절약 = 5배 저렴한 가격!
              </h4>
              <p style={{
                color: '#065f46',
                fontSize: '1.1rem',
                fontWeight: '500'
              }}>
                같은 품질의 강의를 <strong>1/5 가격</strong>으로 제공합니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔧 스티키 수강 신청 바 (페이지 하단 고정) */}
      {!isAlreadyEnrolled && (
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          padding: '15px 20px',
          boxShadow: '0 -5px 20px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ color: 'white' }}>
            <div style={{ 
              fontSize: '1.1rem', 
              fontWeight: '700', 
              marginBottom: '2px' 
            }}>
              AI 디지털 건물주 되기
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              opacity: '0.9' 
            }}>
              ₩{earlyBirdPrice.toLocaleString()} (월 {Math.floor(earlyBirdPrice / 12).toLocaleString()}원)
            </div>
          </div>
          
          {/* 🎬 수익 증가 애니메이션 GIF 자리 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px dashed rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '10px 15px',
            color: 'white',
            fontSize: '0.8rem',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '5px' }}>💰 GIF: 수익 그래프 상승</div>
            <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>월 0원 → 50만원 (3초 루프)</div>
          </div>
          
          <button
            onClick={isLoggedIn ? handleEarlyBirdPayment : handleLoginRequired}
            disabled={isLoading || checkingEnrollment}
            style={{
              background: '#ffffff',
              color: '#0ea5e9',
              border: 'none',
              padding: '12px 25px',
              fontSize: '1rem',
              fontWeight: '700',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {isLoading ? '결제 중...' : '수강 신청하기'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AIBuildingCoursePage;