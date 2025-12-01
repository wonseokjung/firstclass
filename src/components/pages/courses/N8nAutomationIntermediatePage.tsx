import React, { useState, useEffect } from 'react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

interface N8nAutomationIntermediatePageProps {
  onBack: () => void;
}

const N8nAutomationIntermediatePage: React.FC<N8nAutomationIntermediatePageProps> = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const course = {
    id: 2001,
    title: "🎬 n8n 콘텐츠 자동화 중급",
    subtitle: "콘텐츠 생성부터 YouTube 업로드까지 완전 자동화",
    lessons: [
      {
        id: 1,
        day: 1,
        title: "1강: n8n 시작하기 - 첫 자동화 워크플로우",
        sections: {
          theory: "• n8n이란? (vs Zapier, Make.com, Google Opal)\n• 로컬 설치 vs 클라우드 비교\n• 워크플로우 기본 개념과 노드 연결\n• 데이터 흐름 이해하기",
          practice: "• n8n 설치 및 환경 설정\n• 첫 워크플로우: Slack 알림 보내기\n• Schedule Trigger로 정기 실행\n• ChatGPT로 동기부여 메시지 생성"
        }
      },
      {
        id: 2,
        day: 2,
        title: "2강: AI 에이전트 연결 - ChatGPT & Gemini",
        sections: {
          theory: "• OpenAI API vs Google Gemini API 비교\n• API 키 발급 및 보안 관리\n• 프롬프트 최적화 기법\n• 응답 데이터 파싱 및 저장",
          practice: "• OpenAI 노드 설정 및 사용\n• Gemini 노드 연동\n• 유튜브 대본 자동 생성기 만들기\n• Google Sheets에 결과 저장"
        }
      },
      {
        id: 3,
        day: 3,
        title: "3강: 이미지 자동 생성 - 썸네일 배치 제작",
        sections: {
          theory: "• 이미지 생성 AI 비교 (Gemini, DALL-E, Midjourney)\n• 썸네일 최적화 전략\n• 배치 생성으로 효율 극대화\n• 파일 관리 자동화",
          practice: "• Gemini Image API 연동\n• 5가지 스타일 썸네일 동시 생성\n• Google Drive 자동 업로드\n• Slack 미리보기 전송"
        }
      },
      {
        id: 4,
        day: 4,
        title: "4강: 영상 자동 생성 - Google Veo 활용",
        sections: {
          theory: "• 비디오 생성 AI 현황 (Veo, Runway, Pika, Sora)\n• 비용 vs 품질 분석\n• 비디오 프롬프트 작성 기법\n• 생성 상태 모니터링",
          practice: "• Google Veo API 설정\n• 숏폼 영상 3개 자동 생성\n• 생성 완료 대기 및 다운로드\n• 메타데이터 자동 저장"
        }
      },
      {
        id: 5,
        day: 5,
        title: "5강: YouTube 자동 업로드 - API 연동",
        sections: {
          theory: "• YouTube Data API v3 이해\n• OAuth 2.0 인증 프로세스\n• 업로드 제한 및 쿼터 관리\n• SEO 최적화 메타데이터",
          practice: "• YouTube API 키 발급\n• OAuth 인증 설정\n• 영상 자동 업로드 워크플로우\n• 제목/설명 ChatGPT로 생성"
        }
      },
      {
        id: 6,
        day: 6,
        title: "6강: JavaScript 기초 - 코드로 스마트하게",
        sections: {
          theory: "• n8n Code 노드 사용법\n• JavaScript 기초 (변수, 조건문)\n• 날짜/시간 처리\n• 동적 콘텐츠 생성",
          practice: "• 요일별 다른 콘텐츠 생성\n• 날짜 기반 제목 생성\n• if문으로 조건 처리\n• 템플릿 시스템 구축"
        }
      },
      {
        id: 7,
        day: 7,
        title: "7강: 데이터 처리 - 배열과 반복문",
        sections: {
          theory: "• 배열 생성 및 조작\n• forEach, map, filter 사용법\n• 데이터 변환 및 필터링\n• 여러 콘텐츠 동시 처리",
          practice: "• 10개 주제로 10개 대본 생성\n• 배열 반복으로 자동화\n• 데이터 병합 및 정렬\n• 결과 일괄 저장"
        }
      },
      {
        id: 8,
        day: 8,
        title: "8강: API 마스터 - 트렌드 데이터 활용",
        sections: {
          theory: "• REST API 기초 개념\n• HTTP Request 설정\n• 외부 API 호출 및 파싱\n• 에러 처리 및 재시도",
          practice: "• Google Trends API 연동\n• 트렌딩 주제 자동 추출\n• 상위 10개 주제로 콘텐츠 생성\n• try-catch 에러 처리"
        }
      },
      {
        id: 9,
        day: 9,
        title: "9강: 스케줄링 자동화 - Cron 마스터",
        sections: {
          theory: "• Cron 표현식 이해\n• 시간대 관리\n• 스케줄 최적화 전략\n• 실행 로그 관리",
          practice: "• 매일 오전 9시 자동 실행\n• 트렌드 → 대본 → 영상 자동화\n• 실행 기록 Google Sheets 저장\n• 에러 발생 시 Slack 알림"
        }
      },
      {
        id: 10,
        day: 10,
        title: "10강: 완전 자동화 시스템 구축",
        sections: {
          theory: "• End-to-End 파이프라인 설계\n• 에러 복구 시스템\n• 성과 모니터링 대시보드\n• 확장 가능한 아키텍처",
          practice: "• 마스터 워크플로우 완성\n• 트렌드 분석 → 생성 → 업로드 자동화\n• 성과 추적 시스템\n• 완전 자동 YouTube 업로드"
        }
      }
    ]
  };

  const coursePrice = 69000;

  useEffect(() => {
    // 비밀번호 체크
    const password = prompt('🔐 이 강의는 현재 베타 테스트 중입니다.\n비밀번호를 입력해주세요:');
    
    if (password === 'jay1234') {
      setIsPasswordVerified(true);
    } else {
      alert('❌ 비밀번호가 틀렸습니다.');
      window.location.href = '/';
      return;
    }

    const checkAuthStatus = async () => {
      try {
        const storedUserInfo = sessionStorage.getItem('aicitybuilders_user_session');

        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setIsLoggedIn(true);

          const testAccounts = ['test10@gmail.com'];
          const isTestAccount = testAccounts.includes(parsedUserInfo.email);

          try {
            const paymentStatus = await AzureTableService.checkCoursePayment(
              parsedUserInfo.email, 
              'n8n-automation-intermediate'
            );

            if ((paymentStatus && paymentStatus.isPaid) || isTestAccount) {
              setIsPaidUser(true);
              setTimeout(() => {
                window.location.href = '/n8n-automation-intermediate-player';
              }, 1000);
              return;
            }
          } catch (azureError) {
            console.error('❌ Azure 테이블 조회 실패:', azureError);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 실패:', error);
        setIsLoggedIn(false);
      }
    };

    if (password === 'jay1234') {
      checkAuthStatus();
    }
  }, []);

  if (!isPasswordVerified) {
    return null;
  }

  return (
    <div className="masterclass-container">
      <NavigationBar
        onBack={onBack}
        breadcrumbText="n8n 콘텐츠 자동화 중급"
      />

      {isPaidUser ? (
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
            borderTop: '4px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            강의 시청 페이지로 이동 중...
          </p>
        </div>
      ) : (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          {/* 베타 테스트 배너 */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '2px solid #fbbf24',
            borderRadius: '15px',
            padding: '20px 30px',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '800',
              color: '#92400e',
              marginBottom: '10px'
            }}>
              🔐 베타 테스트 중
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#78350f',
              margin: 0
            }}>
              이 강의는 현재 제작 중이며, 곧 정식 오픈 예정입니다.
            </p>
          </div>

          {/* 상단 메인 섹션 */}
          <div style={{
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '50%',
              marginBottom: '25px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}>
              <span style={{ fontSize: '2.5rem' }}>⚙️</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              marginBottom: '20px',
              fontWeight: '800',
              color: '#1f2937'
            }}>
              🤖 n8n 콘텐츠 자동화 중급
            </h1>

            <h2 style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              marginBottom: '15px',
              color: '#1f2937',
              fontWeight: '700'
            }}>
              노코드로 시작해서 코드로 완성하는 YouTube 자동화
            </h2>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              marginBottom: '30px',
              color: '#64748b',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto 30px'
            }}>
              Google Opal 기초를 마스터한 분들을 위한 중급 과정.<br/>
              n8n으로 콘텐츠 생성부터 YouTube 자동 업로드까지 완전 자동화를 구현합니다.
            </p>

            {/* 가격 박스 */}
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '25px',
              padding: '40px 50px',
              marginBottom: '30px',
              border: '3px solid #6ee7b7',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#d1fae5',
                marginBottom: '10px',
                fontWeight: '600'
              }}>
                중급 과정
              </div>
              <div style={{
                fontSize: 'clamp(3.5rem, 8vw, 5rem)',
                fontWeight: '900',
                color: 'white',
                marginBottom: '15px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}>
                ₩{coursePrice.toLocaleString()}
              </div>
              <div style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                color: '#d1fae5',
                fontWeight: '600'
              }}>
                10일 완성 · 평생 수강
              </div>
            </div>

            <p style={{
              fontSize: '0.9rem',
              color: '#94a3b8',
              fontStyle: 'italic',
              marginTop: '20px'
            }}>
              💡 이 강의는 준비 중입니다. 곧 만나요!
            </p>
          </div>

          {/* 현실 체크 섹션 */}
          <div style={{
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            border: '2px solid #ef4444',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
              fontWeight: '800',
              color: '#991b1b',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              ⚠️ 현실 체크: "월 4천만원" 주장 분석
            </h2>

            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              marginBottom: '30px'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#991b1b',
                marginBottom: '15px'
              }}>
                📊 주장: "유튜브 채널 36개 × 월 3,000개 콘텐츠 = 월 4천만원"
              </h3>
              <p style={{
                fontSize: '1.05rem',
                color: '#1f2937',
                lineHeight: '1.8',
                marginBottom: '20px'
              }}>
                최근 일부 강의에서 "AI 자동화로 유튜브 채널 36개를 운영하고,<br/>
                한 달에 3,000개의 콘텐츠를 만들어 월 4천만원을 번다"는 주장이 있습니다.
              </p>
              <p style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#dc2626',
                textAlign: 'center',
                margin: '20px 0'
              }}>
                ❌ 이것은 현실적으로 불가능하며, 과장된 마케팅입니다.
              </p>
            </div>

            {/* 기술적 분석 */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              marginBottom: '20px'
            }}>
              <h4 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '15px'
              }}>
                🔍 기술적 한계 분석:
              </h4>
              <div style={{
                fontSize: '1rem',
                color: '#475569',
                lineHeight: '1.8'
              }}>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#ef4444' }}>1. YouTube API 제한:</strong><br/>
                  - 일일 업로드 할당량: 약 6개<br/>
                  - 3,000개/월 = 하루 100개 → 기술적으로 불가능 ❌
                </p>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#ef4444' }}>2. 비용 현실:</strong><br/>
                  - AI 영상 1개 생성 비용: $5~50<br/>
                  - 3,000개 × 평균 $15 = $45,000 (약 6천만원/월)<br/>
                  - 수익 4천만원인데 비용 6천만원? 적자 2천만원 ❌
                </p>
                <p style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#ef4444' }}>3. 채널 36개 관리:</strong><br/>
                  - YouTube 스팸 정책으로 대량 채널 운영 시 일괄 정지 위험<br/>
                  - 각 채널별 커뮤니티 관리 불가능<br/>
                  - 품질 관리 불가능 ❌
                </p>
                <p style={{ marginBottom: '0' }}>
                  <strong style={{ color: '#ef4444' }}>4. 수익화 조건:</strong><br/>
                  - 구독자 1,000명 + 시청시간 4,000시간 필요<br/>
                  - 36개 채널 모두 달성하려면 최소 1년 이상 필요<br/>
                  - 저품질 자동 콘텐츠로는 승인 거의 불가능 ❌
                </p>
              </div>
            </div>

            {/* 현실적인 목표 */}
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px'
            }}>
              <h4 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#059669',
                marginBottom: '15px'
              }}>
                ✅ 현실적인 목표 (우리 강의):
              </h4>
              <div style={{
                fontSize: '1rem',
                color: '#475569',
                lineHeight: '1.8'
              }}>
                <p style={{ marginBottom: '15px' }}>
                  <strong>• 채널 수:</strong> 1~3개 (관리 가능한 범위)<br/>
                  <strong>• 월 콘텐츠:</strong> 30~90개 (하루 1~3개)<br/>
                  <strong>• 자동화 비율:</strong> 70~80% (나머지 20~30% 수동 품질 관리)<br/>
                  <strong>• 비용:</strong> 월 20~50만원 (API + 도구)<br/>
                  <strong>• 예상 수익:</strong><br/>
                  &nbsp;&nbsp;- 6개월: 월 10~30만원<br/>
                  &nbsp;&nbsp;- 1년: 월 50~100만원<br/>
                  &nbsp;&nbsp;- 1년: 월 100~300만원
                </p>
                <p style={{
                  background: '#d1fae5',
                  padding: '15px',
                  borderRadius: '10px',
                  marginTop: '20px',
                  marginBottom: '0',
                  fontWeight: '600',
                  color: '#065f46'
                }}>
                  💡 우리는 과장 없이 현실적인 목표를 제시합니다.<br/>
                  천천히, 꾸준히, 지속 가능하게!
                </p>
              </div>
            </div>
          </div>

          {/* 커리큘럼 */}
          <div style={{
            marginBottom: '60px'
          }}>
            <h3 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: '#1f2937',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              📚 10일 완성 커리큘럼
            </h3>

            <div style={{
              background: '#ffffff',
              padding: '40px',
              borderRadius: '15px',
              border: '2px solid #e2e8f0'
            }}>
              {course.lessons.map((lesson: any) => (
                <div
                  key={lesson.id}
                  style={{
                    marginBottom: '30px',
                    paddingBottom: '30px',
                    borderBottom: lesson.id === 10 ? 'none' : '1px solid #e2e8f0'
                  }}
                >
                  <h5 style={{
                    color: '#10b981',
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                    fontWeight: '800',
                    marginBottom: '15px'
                  }}>
                    Day {lesson.day} · {lesson.title.replace(`${lesson.day}강: `, '')}
                  </h5>
                  <div style={{
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                    lineHeight: '1.8',
                    color: '#1f2937'
                  }}>
                    <p style={{ marginBottom: '12px', fontWeight: '500' }}>
                      <strong style={{ color: '#1f2937' }}>이론:</strong> {lesson.sections.theory}
                    </p>
                    <p style={{ marginBottom: '0', fontWeight: '500' }}>
                      <strong style={{ color: '#1f2937' }}>실습:</strong> {lesson.sections.practice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default N8nAutomationIntermediatePage;

