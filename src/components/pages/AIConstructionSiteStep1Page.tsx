import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Users, DollarSign, Star, Loader, AlertCircle } from 'lucide-react';
import NavigationBar from '../common/NavigationBar';
import { recommendYoutubeChannels } from '../../services/azureOpenAIService';
import { getCurrentUser } from '../../services/authService';
import AzureTableService from '../../services/azureTableService';

interface ChannelIdea {
  title: string;
  description: string;
  targetAudience: string;
  profitability: number;
  difficulty: '초급' | '중급' | '고급';
  keywords: string[];
  expectedMonthlyIncome: string;
}

const MAX_USAGE_COUNT = 3;

const AIConstructionSiteStep1Page: React.FC = () => {
  const navigate = useNavigate();
  
  // 비밀번호 인증 체크
  React.useEffect(() => {
    const authStatus = sessionStorage.getItem('ai_construction_auth');
    if (authStatus !== 'authenticated') {
      alert('🔒 AI 공사장 접근 권한이 필요합니다.\n\n먼저 AI 공사장 메인 페이지에서 인증해주세요.');
      navigate('/ai-construction-site');
    }
  }, [navigate]);

  const [userInterests, setUserInterests] = useState('');
  const [lifeGoal, setLifeGoal] = useState('');
  const [dailyRoutine, setDailyRoutine] = useState('');
  const [motivation, setMotivation] = useState('');
  const [targetIncome, setTargetIncome] = useState(1000000);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<ChannelIdea[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const [remainingCount, setRemainingCount] = useState(MAX_USAGE_COUNT);

  // 사용 횟수 로드 (Azure Table에서)
  useEffect(() => {
    const loadUsageCount = async () => {
      const currentUser = getCurrentUser();
      console.log('🔍 현재 로그인 사용자:', currentUser);
      
      if (!currentUser) {
        console.warn('⚠️ 로그인된 사용자 없음');
        navigate('/login');
        return;
      }

      try {
        console.log('📊 Azure Table에서 사용자 정보 로드 중...', currentUser.email);
        const user = await AzureTableService.getUserByEmail(currentUser.email);
        console.log('📦 Azure Table 사용자 정보:', user);
        
        if (user) {
          const count = user.aiRecommendationUsageCount || 0;
          console.log('🎯 AI 추천 사용 횟수:', count);
          setUsageCount(count);
          setRemainingCount(MAX_USAGE_COUNT - count);
          console.log(`✅ 남은 횟수: ${MAX_USAGE_COUNT - count}회`);
        } else {
          console.error('❌ 사용자 정보를 찾을 수 없음');
        }
      } catch (error) {
        console.error('❌ 사용 횟수 로드 실패:', error);
      }
    };

    loadUsageCount();
  }, [navigate]);

  const handleRecommend = async () => {
    if (!userInterests.trim()) {
      alert('최소 1개 이상의 정보를 입력해주세요!');
      return;
    }

    // 사용 횟수 체크
    if (usageCount >= MAX_USAGE_COUNT) {
      alert('무료 사용 횟수를 모두 사용하셨습니다. 더 많은 추천을 받으시려면 유료 강의를 구매해주세요!');
      return;
    }

    setIsLoading(true);
    try {
      // 모든 입력 정보를 조합
      const fullContext = `
관심사/전문성: ${userInterests}
${lifeGoal ? `인생 목표: ${lifeGoal}` : ''}
${motivation ? `이것을 하는 이유: ${motivation}` : ''}
${dailyRoutine ? `하루 일과: ${dailyRoutine}` : ''}
목표 월수익: ${targetIncome.toLocaleString()}원
      `.trim();

      console.log('🔄 Azure OpenAI로 추천 받는 중...');
      
      const result = await recommendYoutubeChannels(fullContext, targetIncome);
      
      setRecommendations(result.ideas);
      setAnalysis(result.analysis);

      // 사용 횟수 증가 (Azure Table에 저장)
      const currentUser = getCurrentUser();
      if (currentUser) {
        try {
          console.log('📊 사용 횟수 증가 시도...', currentUser.email);
          const success = await AzureTableService.incrementAIRecommendationUsage(currentUser.email);
          
          if (success) {
            const newCount = usageCount + 1;
            setUsageCount(newCount);
            setRemainingCount(MAX_USAGE_COUNT - newCount);
            console.log('✅ 사용 횟수 증가 성공:', newCount);
          } else {
            console.error('❌ 사용 횟수 증가 실패 (Azure Table 저장 실패)');
          }
        } catch (incrementError) {
          console.error('❌ 사용 횟수 증가 중 에러:', incrementError);
        }
      }

      console.log('✅ 추천 성공!', result);
    } catch (error) {
      console.error('❌ 추천 실패:', error);
      alert('추천을 받는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급': return '#10b981';
      case '중급': return '#f59e0b';
      case '고급': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)'
    }}>
      <NavigationBar
        onBack={() => navigate('/ai-construction-site')}
        breadcrumbText="Step 1: 입지 선정"
      />

      {/* Hero Section - Navy + Yellow */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: 'clamp(50px, 8vw, 80px) clamp(20px, 4vw, 40px)',
        textAlign: 'center',
        borderBottom: '5px solid #fbbf24',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 배경 패턴 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            padding: '15px',
            borderRadius: '20px',
            marginBottom: '20px',
            boxShadow: '0 10px 40px rgba(251, 191, 36, 0.4)'
          }}>
            <span style={{ fontSize: 'clamp(3rem, 6vw, 4rem)' }}>🎯</span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            fontWeight: '900',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #ffffff, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Step 1: 입지 선정
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
            color: '#e0f2fe',
            fontWeight: '600',
            maxWidth: '800px',
            margin: '0 auto 20px',
            lineHeight: '1.6'
          }}>
            AI가 당신의 인생 스토리를 분석하여<br />
            <span style={{ color: '#fbbf24', fontWeight: '900' }}>월수익 100만원</span> 달성 가능한 유튜브 채널 주제를 추천합니다
          </p>

          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(251, 191, 36, 0.2)',
              border: '2px solid #fbbf24',
              borderRadius: '30px',
              padding: '10px 25px',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ color: '#fbbf24', fontWeight: '700', fontSize: '1rem' }}>
                ⚡ ConnectAI LAB's AI Analysis
              </span>
            </div>
            
            {/* 사용 횟수 표시 */}
            <div style={{
              display: 'inline-block',
              background: remainingCount > 0 
                ? 'rgba(16, 185, 129, 0.2)' 
                : 'rgba(239, 68, 68, 0.2)',
              border: remainingCount > 0 
                ? '2px solid #10b981' 
                : '2px solid #ef4444',
              borderRadius: '30px',
              padding: '10px 25px',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ 
                color: remainingCount > 0 ? '#10b981' : '#ef4444', 
                fontWeight: '700', 
                fontSize: '1rem' 
              }}>
                {remainingCount > 0 
                  ? `🎁 무료 ${remainingCount}회 남음` 
                  : '❌ 무료 횟수 종료'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: 'clamp(30px, 5vw, 50px) clamp(15px, 3vw, 20px)'
      }}>
        {/* 사용 횟수 종료 안내 */}
        {remainingCount === 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '3px solid #f59e0b',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <AlertCircle size={48} style={{ color: '#f59e0b', marginBottom: '15px' }} />
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              color: '#92400e',
              marginBottom: '12px'
            }}>
              무료 사용 횟수를 모두 사용하셨습니다
            </h3>
            <p style={{
              fontSize: '1.1rem',
              color: '#78350f',
              marginBottom: '20px',
              lineHeight: '1.7'
            }}>
              더 많은 AI 추천과 함께 <strong>월수익 100만원 달성 로드맵</strong>을 배우고 싶으신가요?
            </p>
            <button
              onClick={() => navigate('/ai-building-course')}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                padding: '18px 40px',
                borderRadius: '30px',
                fontSize: '1.2rem',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(245, 158, 11, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.4)';
              }}
            >
              🎓 AI 건물주 되기 강의 보러가기
            </button>
          </div>
        )}

        {/* Input Section - 전문적인 다단계 질문 */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '30px',
          padding: 'clamp(40px, 6vw, 60px) clamp(30px, 5vw, 50px)',
          marginBottom: '40px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          border: '3px solid #fbbf24',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 배경 글로우 효과 */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <Sparkles size={32} style={{ color: '#fbbf24' }} />
              당신을 분석합니다
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: '#94a3b8',
              marginBottom: '40px',
              lineHeight: '1.7'
            }}>
              AI가 당신의 스토리를 깊이 분석하여 <span style={{ color: '#fbbf24', fontWeight: '700' }}>맞춤형 수익 채널</span>을 추천합니다
            </p>

            {/* 질문 카드들 */}
            <div style={{
              display: 'grid',
              gap: '25px',
              marginBottom: '35px'
            }}>
              {/* 1. 관심사/전문성 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '20px',
                padding: '25px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#fbbf24';
                e.currentTarget.style.background = 'rgba(251, 191, 36, 0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}>
                <label style={{
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  color: '#fbbf24',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: '#0f172a',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '0.9rem'
                  }}>1</span>
                  💡 당신의 관심사와 전문성 <span style={{ color: '#ef4444', fontSize: '1rem' }}>*</span>
                </label>
                <textarea
                  value={userInterests}
                  onChange={(e) => setUserInterests(e.target.value)}
                  placeholder="예: AI 기술, 콘텐츠 제작, 투자, 요리, 건강관리, 여행 등&#10;&#10;당신이 잘 아는 분야, 관심 있는 주제를 자유롭게 적어주세요"
                  style={{
                    width: '100%',
                    minHeight: '110px',
                    padding: '15px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid rgba(251, 191, 36, 0.5)',
                    borderRadius: '12px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    color: '#0f172a',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* 2. 인생 목표 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '20px',
                padding: '25px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#fbbf24';
                e.currentTarget.style.background = 'rgba(251, 191, 36, 0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}>
                <label style={{
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  color: '#fbbf24',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: '#0f172a',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '0.9rem'
                  }}>2</span>
                  🎯 당신의 인생 목표 (선택)
                </label>
                <textarea
                  value={lifeGoal}
                  onChange={(e) => setLifeGoal(e.target.value)}
                  placeholder="예: 경제적 자유를 얻어 가족과 더 많은 시간을 보내고 싶다&#10;&#10;당신이 이루고 싶은 꿈, 삶의 방향을 알려주세요"
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '15px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid rgba(251, 191, 36, 0.5)',
                    borderRadius: '12px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    color: '#0f172a',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* 3. 하는 이유/동기 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '20px',
                padding: '25px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#fbbf24';
                e.currentTarget.style.background = 'rgba(251, 191, 36, 0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}>
                <label style={{
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  color: '#fbbf24',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: '#0f172a',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '0.9rem'
                  }}>3</span>
                  🔥 왜 이 일을 하려고 하나요? (선택)
                </label>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="예: 직장에 의존하지 않고 내 삶을 주도적으로 살고 싶어서&#10;&#10;당신을 움직이게 하는 진짜 이유를 알려주세요"
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '15px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid rgba(251, 191, 36, 0.5)',
                    borderRadius: '12px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    color: '#0f172a',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* 4. 하루 일과 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '20px',
                padding: '25px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#fbbf24';
                e.currentTarget.style.background = 'rgba(251, 191, 36, 0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}>
                <label style={{
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  color: '#fbbf24',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: '#0f172a',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '0.9rem'
                  }}>4</span>
                  ⏰ 당신의 하루 일과 (선택)
                </label>
                <textarea
                  value={dailyRoutine}
                  onChange={(e) => setDailyRoutine(e.target.value)}
                  placeholder="예: 직장인, 오전 9시~6시 근무. 저녁 시간과 주말 활용 가능&#10;&#10;당신의 라이프스타일과 사용 가능한 시간을 알려주세요"
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '15px',
                    fontSize: '1rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid rgba(251, 191, 36, 0.5)',
                    borderRadius: '12px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    color: '#0f172a',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fbbf24';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* 목표 월수익 */}
              <div style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '3px solid #fbbf24',
                borderRadius: '20px',
                padding: '25px',
                backdropFilter: 'blur(10px)'
              }}>
                <label style={{
                  fontSize: '1.3rem',
                  fontWeight: '900',
                  color: '#fbbf24',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <DollarSign size={28} />
                  💰 목표 월수익
                </label>
                <select
                  value={targetIncome}
                  onChange={(e) => setTargetIncome(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '18px',
                    fontSize: '1.15rem',
                    fontWeight: '700',
                    background: 'white',
                    border: '3px solid #fbbf24',
                    borderRadius: '15px',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    color: '#0f172a',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 4px rgba(251, 191, 36, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value={500000}>50만원</option>
                  <option value={1000000}>✨ 100만원 (추천)</option>
                  <option value={2000000}>200만원</option>
                  <option value={5000000}>500만원</option>
                </select>
              </div>
            </div>

            {/* AI 추천 버튼 */}
            <button
              onClick={handleRecommend}
              disabled={isLoading || !userInterests.trim() || remainingCount === 0}
              style={{
                width: '100%',
                background: isLoading || !userInterests.trim() || remainingCount === 0
                  ? 'linear-gradient(135deg, #64748b, #475569)' 
                  : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: isLoading || !userInterests.trim() || remainingCount === 0 ? '#cbd5e1' : '#0f172a',
                border: 'none',
                padding: '22px',
                borderRadius: '16px',
                fontSize: '1.35rem',
                fontWeight: '900',
                cursor: isLoading || !userInterests.trim() || remainingCount === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: isLoading || !userInterests.trim() || remainingCount === 0
                  ? 'none'
                  : '0 10px 40px rgba(251, 191, 36, 0.5)',
                textShadow: isLoading || !userInterests.trim() || remainingCount === 0 ? 'none' : '0 1px 2px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                if (!isLoading && userInterests.trim() && remainingCount > 0) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(251, 191, 36, 0.6)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(251, 191, 36, 0.5)';
              }}
            >
              {isLoading ? (
                <>
                  <Loader size={28} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  AI가 당신을 분석하고 있습니다...
                </>
              ) : remainingCount === 0 ? (
                <>
                  🔒 무료 횟수 종료
                </>
              ) : (
                <>
                  <Sparkles size={28} />
                  🚀 AI 맞춤 채널 추천 받기 ({remainingCount}회 남음)
                </>
              )}
            </button>

            <p style={{
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '0.95rem',
              marginTop: '20px',
              lineHeight: '1.6'
            }}>
              <span style={{ color: '#ef4444' }}>*</span> 필수 항목 | 더 많은 정보를 입력할수록 정확한 추천을 받습니다
              <br />
              <span style={{ color: '#fbbf24', fontWeight: '700' }}>
                💡 무료 {MAX_USAGE_COUNT}회 제공
              </span>
            </p>
          </div>
        </div>

        {/* Analysis Section */}
        {analysis && (
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
            border: '2px solid #3b82f6',
            borderRadius: '20px',
            padding: 'clamp(25px, 4vw, 35px)',
            marginBottom: '30px'
          }}>
            <h3 style={{
              fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
              fontWeight: '800',
              color: '#1e40af',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <TrendingUp size={26} />
              시장 분석 결과
            </h3>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              color: '#1e3a8a',
              lineHeight: '1.8'
            }}>
              {analysis}
            </p>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2rem)',
              fontWeight: '900',
              color: '#0f172a',
              marginBottom: '25px',
              textAlign: 'center'
            }}>
              💡 AI 추천 유튜브 채널 주제
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {recommendations.map((idea, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '25px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '700'
                    }}>
                      #{index + 1}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#f59e0b',
                      fontSize: '0.95rem',
                      fontWeight: '700'
                    }}>
                      <DollarSign size={16} />
                      {idea.profitability}점
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '800',
                    color: '#0f172a',
                    marginBottom: '12px',
                    lineHeight: '1.3'
                  }}>
                    {idea.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#64748b',
                    lineHeight: '1.6',
                    marginBottom: '15px'
                  }}>
                    {idea.description}
                  </p>

                  {/* Target Audience */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    padding: '10px',
                    background: '#f8fafc',
                    borderRadius: '10px'
                  }}>
                    <Users size={18} style={{ color: '#6366f1', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: '#475569' }}>
                      {idea.targetAudience}
                    </span>
                  </div>

                  {/* Expected Income */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    padding: '10px',
                    background: '#fef3c7',
                    borderRadius: '10px'
                  }}>
                    <DollarSign size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: '600' }}>
                      {idea.expectedMonthlyIncome}
                    </span>
                  </div>

                  {/* Difficulty */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: getDifficultyColor(idea.difficulty) + '15',
                    border: `2px solid ${getDifficultyColor(idea.difficulty)}`,
                    borderRadius: '20px',
                    marginBottom: '12px'
                  }}>
                    <Star size={16} style={{ color: getDifficultyColor(idea.difficulty) }} />
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: getDifficultyColor(idea.difficulty)
                    }}>
                      {idea.difficulty}
                    </span>
                  </div>

                  {/* Keywords */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '12px'
                  }}>
                    {idea.keywords.map((keyword, kidx) => (
                      <span
                        key={kidx}
                        style={{
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIConstructionSiteStep1Page;

