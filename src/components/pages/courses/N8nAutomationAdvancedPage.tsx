import React, { useState, useEffect } from 'react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

interface N8nAutomationAdvancedPageProps {
  onBack: () => void;
}

const N8nAutomationAdvancedPage: React.FC<N8nAutomationAdvancedPageProps> = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const course = {
    id: 2002,
    title: "🚀 n8n 멀티 채널 자동화 고급",
    subtitle: "3개 채널 동시 운영, 월 300만원 수익 시스템 구축",
    lessons: [
      {
        id: 1,
        day: 1,
        title: "1강: 멀티 채널 전략 설계",
        sections: {
          theory: "• 채널 수 vs 품질 트레이드오프\n• 니치별 채널 분리 전략\n• 크로스 프로모션 기법\n• 리스크 분산 포트폴리오",
          practice: "• 3개 채널 컨셉 설정\n• 채널별 타겟 분석\n• 콘텐츠 캘린더 설계\n• 채널 간 연결 전략"
        }
      },
      {
        id: 2,
        day: 2,
        title: "2강: 마스터 워크플로우 아키텍처",
        sections: {
          theory: "• 워크플로우 모듈화 설계\n• 재사용 가능한 서브플로우\n• 변수 및 환경 관리\n• 확장 가능한 구조",
          practice: "• 마스터 워크플로우 템플릿\n• 채널별 서브플로우 생성\n• 환경변수 설정\n• 동적 콘텐츠 라우팅"
        }
      },
      {
        id: 3,
        day: 3,
        title: "3강: 고급 프롬프트 엔지니어링",
        sections: {
          theory: "• Few-shot Learning 기법\n• Chain-of-Thought 프롬프팅\n• 페르소나 설정 고급 기법\n• 일관성 유지 전략",
          practice: "• 채널별 AI 페르소나 생성\n• 브랜드 보이스 자동화\n• 스타일 일관성 시스템\n• 품질 검증 프롬프트"
        }
      },
      {
        id: 4,
        day: 4,
        title: "4강: 대량 생산 시스템 구축",
        sections: {
          theory: "• 배치 처리 최적화\n• 병렬 실행 vs 순차 실행\n• 리소스 관리 전략\n• 비용 최적화 기법",
          practice: "• 한 번에 15개 콘텐츠 생성\n• 병렬 처리 워크플로우\n• API 쿼터 관리\n• 비용 모니터링 대시보드"
        }
      },
      {
        id: 5,
        day: 5,
        title: "5강: 품질 자동 검증 시스템",
        sections: {
          theory: "• AI 기반 품질 검증\n• 저작권 위반 자동 감지\n• YouTube 가이드라인 체크\n• 품질 점수 시스템",
          practice: "• 자동 품질 검증 워크플로우\n• 부적절한 콘텐츠 필터링\n• 승인/거부 자동화\n• 재생성 트리거"
        }
      },
      {
        id: 6,
        day: 6,
        title: "6강: 성과 분석 자동화",
        sections: {
          theory: "• YouTube Analytics API\n• 핵심 지표 정의 (CTR, 시청시간, 구독 전환)\n• 데이터 시각화\n• A/B 테스팅 전략",
          practice: "• 자동 성과 수집 시스템\n• Google Data Studio 연동\n• 실시간 대시보드 구축\n• 주간 리포트 자동 생성"
        }
      },
      {
        id: 7,
        day: 7,
        title: "7강: 수익 다각화 전략",
        sections: {
          theory: "• 애드센스 최적화\n• 제휴 마케팅 통합\n• 디지털 상품 판매\n• 멤버십 & 후원 시스템",
          practice: "• 제휴 링크 자동 삽입\n• 상품 홍보 콘텐츠 생성\n• 멤버십 전용 콘텐츠 제작\n• 수익 추적 시스템"
        }
      },
      {
        id: 8,
        day: 8,
        title: "8강: 고급 에러 처리 & 복구",
        sections: {
          theory: "• Graceful Degradation\n• 자동 재시도 전략\n• 폴백 메커니즘\n• 알림 시스템 설계",
          practice: "• 다층 에러 처리\n• 자동 복구 워크플로우\n• Slack/Email 알림\n• 로그 분석 시스템"
        }
      },
      {
        id: 9,
        day: 9,
        title: "9강: 보안 & 컴플라이언스",
        sections: {
          theory: "• API 키 보안 관리\n• 데이터 프라이버시\n• YouTube 정책 준수\n• 백업 및 복구 전략",
          practice: "• 환경변수 암호화\n• 민감 데이터 처리\n• 정책 체크리스트 자동화\n• 전체 시스템 백업"
        }
      },
      {
        id: 10,
        day: 10,
        title: "10강: 월 300만원 시스템 완성",
        sections: {
          theory: "• 지속 가능한 운영 전략\n• 스케일업 vs 스케일아웃\n• 자동화 vs 수동 관리 균형\n• 장기 성장 로드맵",
          practice: "• 최종 시스템 통합\n• 3채널 동시 운영 시작\n• 성과 모니터링\n• 6개월 성장 계획 수립"
        }
      }
    ]
  };

  const coursePrice = 99000;

  useEffect(() => {
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
              'n8n-automation-advanced'
            );

            if ((paymentStatus && paymentStatus.isPaid) || isTestAccount) {
              setIsPaidUser(true);
              setTimeout(() => {
                window.location.href = '/n8n-automation-advanced-player';
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
        breadcrumbText="n8n 멀티 채널 자동화 고급"
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
            borderTop: '4px solid #8b5cf6',
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
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '50%',
              marginBottom: '25px',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
            }}>
              <span style={{ fontSize: '2.5rem' }}>🚀</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              marginBottom: '20px',
              fontWeight: '800',
              color: '#1f2937'
            }}>
              🏆 n8n 멀티 채널 자동화 고급
            </h1>

            <h2 style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              marginBottom: '15px',
              color: '#1f2937',
              fontWeight: '700'
            }}>
              3개 채널 동시 운영, 월 300만원 수익 시스템 구축
            </h2>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              marginBottom: '30px',
              color: '#64748b',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto 30px'
            }}>
              중급 과정을 마스터한 분들을 위한 고급 과정.<br/>
              여러 채널을 동시에 운영하고, 안정적인 수익을 창출하는 시스템을 구축합니다.
            </p>

            {/* 가격 박스 */}
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '25px',
              padding: '40px 50px',
              marginBottom: '30px',
              border: '3px solid #c4b5fd',
              boxShadow: '0 10px 40px rgba(139, 92, 246, 0.4)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#ede9fe',
                marginBottom: '10px',
                fontWeight: '600'
              }}>
                고급 과정
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
                color: '#ede9fe',
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

          {/* 전체 학습 로드맵 */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
            border: '2px solid #0ea5e9',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
              fontWeight: '800',
              color: '#0369a1',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              🎓 전체 학습 로드맵
            </h2>

            <div style={{
              display: 'grid',
              gap: '20px'
            }}>
              {/* Level 1 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                border: '2px solid #bae6fd'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    background: '#0ea5e9',
                    color: 'white',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '800'
                  }}>
                    1
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: '#0369a1',
                      margin: '0 0 5px 0'
                    }}>
                      Google Opal 기초
                    </h4>
                    <p style={{
                      fontSize: '0.95rem',
                      color: '#64748b',
                      margin: 0
                    }}>
                      95,000원 · 10일 완성
                    </p>
                  </div>
                </div>
                <p style={{
                  fontSize: '1rem',
                  color: '#475569',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  AI 에이전트 기초부터 유튜브 콘텐츠 자동 생성까지
                </p>
              </div>

              {/* Level 2 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                border: '2px solid #6ee7b7'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    background: '#10b981',
                    color: 'white',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '800'
                  }}>
                    2
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: '#059669',
                      margin: '0 0 5px 0'
                    }}>
                      n8n 자동화 중급
                    </h4>
                    <p style={{
                      fontSize: '0.95rem',
                      color: '#64748b',
                      margin: 0
                    }}>
                      69,000원 · 10일 완성
                    </p>
                  </div>
                </div>
                <p style={{
                  fontSize: '1rem',
                  color: '#475569',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  n8n으로 YouTube 자동 업로드까지 완전 자동화
                </p>
              </div>

              {/* Level 3 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                border: '3px solid #8b5cf6',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    background: '#8b5cf6',
                    color: 'white',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '800'
                  }}>
                    3
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: '#7c3aed',
                      margin: '0 0 5px 0'
                    }}>
                      n8n 멀티 채널 고급 ⭐ 현재 페이지
                    </h4>
                    <p style={{
                      fontSize: '0.95rem',
                      color: '#64748b',
                      margin: 0
                    }}>
                      99,000원 · 10일 완성
                    </p>
                  </div>
                </div>
                <p style={{
                  fontSize: '1rem',
                  color: '#475569',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  3개 채널 동시 운영, 월 300만원 수익 시스템
                </p>
              </div>
            </div>

            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: '#ede9fe',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#5b21b6',
                margin: 0
              }}>
                💰 전체 투자: 263,000원 (vs 경쟁사 200~500만원)<br/>
                = 1/8 ~ 1/19 수준 ✅
              </p>
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
                    color: '#8b5cf6',
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

export default N8nAutomationAdvancedPage;

