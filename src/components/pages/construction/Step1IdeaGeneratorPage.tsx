import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, TrendingUp, Users, DollarSign, Clock, Sparkles, ArrowRight, Save } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';

interface Step1IdeaGeneratorPageProps {
  onBack: () => void;
}

interface IdeaResult {
  title: string;
  description: string;
  profitability: number; // 0-100
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  marketSize: 'small' | 'medium' | 'large';
  estimatedRevenue: string;
  requiredTools: string[];
  targetAudience: string;
  timeToProfit: string;
}

const Step1IdeaGeneratorPage: React.FC<Step1IdeaGeneratorPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IdeaResult[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    interests: '',
    budget: '0',
    timeAvailable: '5',
    goal: 'side-income'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateIdeas = async () => {
    if (!formData.interests.trim()) {
      alert('관심 분야를 입력해주세요!');
      return;
    }

    setIsLoading(true);
    
    // TODO: Azure OpenAI API 연동
    // 지금은 임시 데이터로 시연
    setTimeout(() => {
      const mockResults: IdeaResult[] = [
        {
          title: `${formData.interests} 관련 유튜브 쇼츠 채널`,
          description: `${formData.interests}에 관심 있는 사람들을 위한 짧고 강렬한 쇼츠 콘텐츠. 트렌드를 빠르게 캐치하고 바이럴 가능성이 높습니다.`,
          profitability: 85,
          difficulty: 'beginner',
          marketSize: 'large',
          estimatedRevenue: '3개월 후 월 50만원',
          requiredTools: ['스마트폰', 'CapCut', 'ChatGPT'],
          targetAudience: '20-40대 직장인',
          timeToProfit: '3개월'
        },
        {
          title: `${formData.interests} 정보 큐레이션 블로그`,
          description: `AI를 활용해 ${formData.interests} 관련 최신 정보를 자동으로 수집하고 큐레이션. 애드센스와 제휴 마케팅으로 수익화.`,
          profitability: 70,
          difficulty: 'beginner',
          marketSize: 'medium',
          estimatedRevenue: '6개월 후 월 30만원',
          requiredTools: ['티스토리', 'ChatGPT', 'Canva'],
          targetAudience: '정보 검색자',
          timeToProfit: '6개월'
        },
        {
          title: `${formData.interests} AI 자동화 강의`,
          description: `${formData.interests} 분야에서 AI를 활용하는 방법을 가르치는 온라인 강의. 한 번 제작으로 지속적인 수익.`,
          profitability: 92,
          difficulty: 'intermediate',
          marketSize: 'medium',
          estimatedRevenue: '4개월 후 월 100만원',
          requiredTools: ['OBS', 'ChatGPT', '클래스101/탈잉'],
          targetAudience: `${formData.interests} 관심자`,
          timeToProfit: '4개월'
        },
        {
          title: `${formData.interests} AI 컨설팅 서비스`,
          description: `기업들에게 ${formData.interests} 분야의 AI 도입 컨설팅 제공. 고단가 B2B 비즈니스 모델.`,
          profitability: 95,
          difficulty: 'advanced',
          marketSize: 'small',
          estimatedRevenue: '6개월 후 월 300만원',
          requiredTools: ['ChatGPT', 'Notion', '제안서 템플릿'],
          targetAudience: '중소기업, 스타트업',
          timeToProfit: '6개월'
        },
        {
          title: `${formData.interests} 관련 디지털 상품 판매`,
          description: `AI로 생성한 ${formData.interests} 관련 템플릿, 프롬프트, 가이드를 크몽/아이디어스에서 판매.`,
          profitability: 78,
          difficulty: 'beginner',
          marketSize: 'medium',
          estimatedRevenue: '2개월 후 월 40만원',
          requiredTools: ['ChatGPT', 'Canva', '크몽/아이디어스'],
          targetAudience: `${formData.interests} 초보자`,
          timeToProfit: '2개월'
        }
      ];

      setResults(mockResults);
      setIsLoading(false);
    }, 2000);
  };

  const handleSaveAndNext = () => {
    if (selectedIdea === null) {
      alert('아이디어를 선택해주세요!');
      return;
    }

    const selected = results[selectedIdea];
    // TODO: Azure Table Storage에 저장
    console.log('선택한 아이디어:', selected);
    
    alert(`"${selected.title}"을(를) 선택하셨습니다!\n\nStep 2: 채널 세팅으로 이동합니다.`);
    navigate('/ai-construction-site');
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      beginner: { text: '초급', color: '#10b981', bg: '#d1fae5' },
      intermediate: { text: '중급', color: '#f59e0b', bg: '#fef3c7' },
      advanced: { text: '고급', color: '#ef4444', bg: '#fee2e2' }
    };
    const badge = badges[difficulty as keyof typeof badges];
    return (
      <span style={{
        background: badge.bg,
        color: badge.color,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: '700'
      }}>
        {badge.text}
      </span>
    );
  };

  const getMarketSizeBadge = (size: string) => {
    const badges = {
      small: { text: '틈새', color: '#6366f1' },
      medium: { text: '중간', color: '#8b5cf6' },
      large: { text: '대형', color: '#ec4899' }
    };
    const badge = badges[size as keyof typeof badges];
    return (
      <span style={{
        background: `${badge.color}20`,
        color: badge.color,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: '700'
      }}>
        {badge.text} 시장
      </span>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)',
      paddingBottom: '80px'
    }}>
      <NavigationBar
        onBack={onBack}
        breadcrumbText="Step 1: 건물 설계"
      />

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        padding: 'clamp(40px, 8vw, 60px) clamp(20px, 4vw, 40px)',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{
          fontSize: 'clamp(3rem, 8vw, 4rem)',
          marginBottom: '15px'
        }}>
          🎯
        </div>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: '900',
          marginBottom: '15px'
        }}>
          Step 1: 건물 설계
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          opacity: 0.95,
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          AI가 당신의 관심사를 분석하고<br />
          수익성 높은 비즈니스 아이디어 5가지를 추천합니다
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: 'clamp(30px, 6vw, 50px) clamp(15px, 4vw, 20px)'
      }}>
        {/* Input Form */}
        {results.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: 'clamp(15px, 3vw, 20px)',
            padding: 'clamp(30px, 6vw, 40px)',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
            border: '2px solid #bfdbfe'
          }}>
            <h2 style={{
              fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
              fontWeight: '800',
              color: '#1e40af',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Sparkles size={24} />
              <span>정보 입력하기</span>
            </h2>

            {/* 관심 분야 */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '10px'
              }}>
                💡 관심 분야 *
              </label>
              <textarea
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                placeholder="예: 재테크, 요리, 여행, 육아, IT, 운동 등 (여러 개 가능)"
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: 'clamp(0.95rem, 2vw, 1rem)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  resize: 'vertical',
                  minHeight: '100px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* 예산 */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '10px'
              }}>
                💰 투자 가능 예산
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: 'clamp(0.95rem, 2vw, 1rem)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontFamily: 'inherit'
                }}
              >
                <option value="0">0원 (무료 도구만)</option>
                <option value="100000">10만원</option>
                <option value="500000">50만원</option>
                <option value="1000000">100만원 이상</option>
              </select>
            </div>

            {/* 시간 */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '10px'
              }}>
                ⏰ 주당 투자 가능 시간
              </label>
              <select
                name="timeAvailable"
                value={formData.timeAvailable}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: 'clamp(0.95rem, 2vw, 1rem)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontFamily: 'inherit'
                }}
              >
                <option value="5">주 5시간 (퇴근 후)</option>
                <option value="10">주 10시간 (주말 포함)</option>
                <option value="20">주 20시간 (전업 준비)</option>
                <option value="40">주 40시간 (전업)</option>
              </select>
            </div>

            {/* 목표 */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '10px'
              }}>
                🎯 목표
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: 'clamp(0.95rem, 2vw, 1rem)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontFamily: 'inherit'
                }}
              >
                <option value="side-income">부수입 (월 50만원)</option>
                <option value="main-income">주수입 (월 200만원+)</option>
                <option value="hobby">취미 + 약간의 수익</option>
                <option value="business">본격 사업</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateIdeas}
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                padding: 'clamp(18px, 4vw, 22px)',
                borderRadius: '12px',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                fontWeight: '800',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => {
                if (!isLoading) e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid white',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>AI가 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  <span>AI 아이디어 생성하기</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <>
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '30px',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
              border: '2px solid #bfdbfe',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                fontWeight: '800',
                color: '#1e40af',
                marginBottom: '10px'
              }}>
                🎉 AI가 5가지 아이디어를 추천했습니다!
              </h2>
              <p style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                color: '#64748b',
                margin: 0
              }}>
                가장 마음에 드는 아이디어를 선택하세요
              </p>
            </div>

            <div style={{
              display: 'grid',
              gap: 'clamp(20px, 4vw, 25px)',
              marginBottom: '30px'
            }}>
              {results.map((idea, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedIdea(index)}
                  style={{
                    background: selectedIdea === index 
                      ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' 
                      : 'white',
                    border: selectedIdea === index 
                      ? '3px solid #3b82f6' 
                      : '2px solid #e5e7eb',
                    borderRadius: '15px',
                    padding: 'clamp(20px, 4vw, 25px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedIdea === index 
                      ? '0 8px 30px rgba(59, 130, 246, 0.25)' 
                      : '0 4px 15px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}>
                    <h3 style={{
                      fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                      fontWeight: '800',
                      color: '#1f2937',
                      margin: 0,
                      flex: 1
                    }}>
                      {index + 1}. {idea.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {getDifficultyBadge(idea.difficulty)}
                      {getMarketSizeBadge(idea.marketSize)}
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                    color: '#475569',
                    lineHeight: '1.7',
                    marginBottom: '20px'
                  }}>
                    {idea.description}
                  </p>

                  {/* Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '15px',
                    marginBottom: '20px'
                  }}>
                    {/* Profitability */}
                    <div style={{
                      background: '#f0fdf4',
                      padding: '12px',
                      borderRadius: '10px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '5px'
                      }}>
                        <TrendingUp size={16} color="#10b981" />
                        <span style={{
                          fontSize: '0.85rem',
                          color: '#059669',
                          fontWeight: '700'
                        }}>
                          수익성
                        </span>
                      </div>
                      <div style={{
                        fontSize: '1.3rem',
                        fontWeight: '900',
                        color: '#10b981'
                      }}>
                        {idea.profitability}점
                      </div>
                    </div>

                    {/* Revenue */}
                    <div style={{
                      background: '#fef3c7',
                      padding: '12px',
                      borderRadius: '10px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '5px'
                      }}>
                        <DollarSign size={16} color="#f59e0b" />
                        <span style={{
                          fontSize: '0.85rem',
                          color: '#d97706',
                          fontWeight: '700'
                        }}>
                          예상 수익
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: '#f59e0b'
                      }}>
                        {idea.estimatedRevenue}
                      </div>
                    </div>

                    {/* Time to Profit */}
                    <div style={{
                      background: '#dbeafe',
                      padding: '12px',
                      borderRadius: '10px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '5px'
                      }}>
                        <Clock size={16} color="#3b82f6" />
                        <span style={{
                          fontSize: '0.85rem',
                          color: '#2563eb',
                          fontWeight: '700'
                        }}>
                          수익까지
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: '#3b82f6'
                      }}>
                        {idea.timeToProfit}
                      </div>
                    </div>
                  </div>

                  {/* Tools & Target */}
                  <div style={{
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '15px',
                    marginBottom: '10px'
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        fontWeight: '700',
                        marginBottom: '6px'
                      }}>
                        필요 도구:
                      </div>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px'
                      }}>
                        {idea.requiredTools.map((tool, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: '#f3f4f6',
                              color: '#374151',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{
                      fontSize: '0.85rem',
                      color: '#6b7280'
                    }}>
                      <strong>타겟:</strong> {idea.targetAudience}
                    </div>
                  </div>

                  {/* Selected Badge */}
                  {selectedIdea === index && (
                    <div style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      marginTop: '15px'
                    }}>
                      ✅ 선택됨
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => {
                  setResults([]);
                  setSelectedIdea(null);
                }}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  background: 'white',
                  color: '#64748b',
                  border: '2px solid #e5e7eb',
                  padding: '18px',
                  borderRadius: '12px',
                  fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                다시 생성하기
              </button>

              <button
                onClick={handleSaveAndNext}
                style={{
                  flex: '2',
                  minWidth: '250px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '18px',
                  borderRadius: '12px',
                  fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Save size={20} />
                <span>저장하고 다음 단계로</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Spinning Animation */}
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Step1IdeaGeneratorPage;

