import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Users, Eye, ThumbsUp, Calendar, Loader, Sparkles, BarChart, AlertCircle, ExternalLink } from 'lucide-react';
import NavigationBar from '../common/NavigationBar';
import YouTubeService, { TrendAnalysis } from '../../services/youtubeService';
import { callAzureOpenAI } from '../../services/azureOpenAIService';
import { getCurrentUser } from '../../services/authService';

const AIConstructionSiteStep2Page: React.FC = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trendData, setTrendData] = useState<TrendAnalysis | null>(null);
  const [aiInsights, setAiInsights] = useState('');
  const [error, setError] = useState('');
  const [isCached, setIsCached] = useState(false);

  const handleAnalyze = async () => {
    if (!topic.trim()) {
      alert('분석할 주제를 입력해주세요!');
      return;
    }

    setIsLoading(true);
    setTrendData(null);
    setAiInsights('');
    setError('');
    setIsCached(false);

    try {
      console.log('🔍 YouTube 트렌드 분석 시작:', topic);
      
      // 현재 사용자 ID (로그인 안되어있으면 임시 ID)
      const currentUser = getCurrentUser();
      const userId = currentUser?.email || 'anonymous';
      
      // 사용자 제한 체크
      const limit = YouTubeService.checkUserLimit(userId);
      if (!limit.allowed) {
        setError(`일일 검색 한도(5회)에 도달했습니다. 남은 횟수: ${limit.remaining}회`);
        setIsLoading(false);
        return;
      }

      // 1. YouTube 데이터 수집
      const data = await YouTubeService.analyzeTrend(topic, userId);
      setTrendData(data);
      setIsCached(!!data.cachedAt);

      // 2. AI 인사이트 생성 (YouTube 데이터가 있을 때만)
      if (data.channels.length > 0 || data.topVideos.length > 0) {
        const aiPrompt = `"${topic}" 유튜브 분석 결과 기반 핵심 인사이트.

데이터: 평균 구독자 ${data.insights.avgSubscriberCount.toLocaleString()}명, 키워드: ${data.insights.commonKeywords.slice(0, 3).join(', ')}

아래 형식 그대로, 마크다운(**) 사용 금지, 각 항목 10자 이내로 초간결하게:

추천 콘텐츠: (10자 이내)
성공 포인트: (3개, 각 10자 이내)
추천 제목: (3개)
주의: (10자 이내)`;

        try {
          const aiResponse = await callAzureOpenAI([
            { role: 'system', content: '초간결 답변 전문가. 마크다운 금지. 10자 이내로.' },
            { role: 'user', content: aiPrompt }
          ], { maxTokens: 300, temperature: 0.7 });

          setAiInsights(aiResponse);
        } catch (aiError) {
          console.warn('AI 인사이트 생성 실패, 기본 인사이트 사용:', aiError);
          setAiInsights(generateDefaultInsights(data, topic));
        }
      }

      console.log('✅ 트렌드 분석 완료!');
    } catch (err: any) {
      console.error('❌ 트렌드 분석 실패:', err);
      setError(err.message || '트렌드 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 기본 인사이트 생성 (AI 실패 시)
  const generateDefaultInsights = (data: TrendAnalysis, topic: string): string => {
    return `추천 콘텐츠: ${topic} 튜토리얼

성공 포인트:
• 꾸준한 업로드
• 숫자 포함 제목
• 쇼츠 활용

추천 제목:
• "${topic} 초보 가이드"
• "${topic} TOP 5"
• "${topic} 솔직 후기"

주의: 틈새 시장부터 시작`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays}일 전`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
    return `${Math.floor(diffDays / 365)}년 전`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0e1a 0%, #0f172a 50%, #1e293b 100%)'
    }}>
      <NavigationBar
        onBack={() => navigate('/ai-construction-site')}
        breadcrumbText="Step 2: 레퍼런스 리서치"
      />

      {/* Hero Section - 고급 남색 + 골드 */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%)',
        padding: 'clamp(40px, 6vw, 60px) clamp(20px, 4vw, 40px)',
        textAlign: 'center',
        borderBottom: '3px solid #d4af37',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '700',
            marginBottom: '10px',
            color: '#d4af37',
            letterSpacing: '2px'
          }}>
            레퍼런스 리서치
          </h1>
          
          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: '#94a3b8',
            maxWidth: '600px',
            margin: '0 auto 15px',
            lineHeight: '1.5'
          }}>
            유튜브 트렌드 분석 · 성공 패턴 파악
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              padding: '6px 16px',
              color: '#d4af37',
              fontSize: '0.85rem'
            }}>
              YouTube API
            </span>
            <span style={{
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              padding: '6px 16px',
              color: '#d4af37',
              fontSize: '0.85rem'
            }}>
              하루 5회
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: 'clamp(25px, 4vw, 40px) clamp(15px, 3vw, 20px)'
      }}>
        {/* Search Input - 고급 남색 + 골드 */}
        <div style={{
          background: 'linear-gradient(135deg, #0f1628 0%, #1a1f35 100%)',
          borderRadius: '20px',
          padding: 'clamp(25px, 4vw, 35px)',
          marginBottom: '25px',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="분석할 주제 입력 (예: AI 교육, 요리, 투자...)"
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '14px 20px',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '10px',
                fontFamily: 'inherit',
                color: '#fff',
                outline: 'none'
              }}
            />
            
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !topic.trim()}
              style={{
                background: isLoading || !topic.trim()
                  ? 'rgba(100, 116, 139, 0.5)'
                  : 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)',
                color: isLoading || !topic.trim() ? '#94a3b8' : '#0a0e1a',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: isLoading || !topic.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? (
                <>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  분석 중
                </>
              ) : (
                <>
                  <Search size={16} />
                  분석
                </>
              )}
            </button>
          </div>

          {/* 빠른 선택 버튼 */}
          <div style={{ marginTop: '15px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['AI 교육', '요리', '투자', '게임', '뷰티', '여행', '운동'].map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                style={{
                  background: topic === t ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                  color: topic === t ? '#d4af37' : '#64748b',
                  border: `1px solid ${topic === t ? '#d4af37' : 'rgba(100, 116, 139, 0.3)'}`,
                  padding: '6px 12px',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message - 고급 스타일 */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '12px 15px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span style={{ color: '#fca5a5', fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        {/* Cache Notice - 고급 스타일 */}
        {isCached && trendData && (
          <div style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '10px',
            padding: '10px 15px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#d4af37', fontSize: '0.85rem' }}>⚡ 캐시 데이터 사용 중</span>
          </div>
        )}

        {/* AI Insights - 고급 남색 + 골드 */}
        {aiInsights && (
          <div style={{
            background: 'linear-gradient(135deg, #0f1628 0%, #1a1f35 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '25px'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#d4af37',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={18} style={{ color: '#d4af37' }} />
              AI 인사이트
            </h3>
            <div style={{
              fontSize: '0.9rem',
              color: '#e2e8f0',
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap'
            }}>
              {aiInsights}
            </div>
          </div>
        )}

        {/* Insights Summary - 고급 남색 + 골드 */}
        {trendData && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '25px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0f1628 0%, #1a1f35 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <Users size={20} style={{ color: '#d4af37', marginBottom: '8px' }} />
              <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', marginBottom: '3px' }}>
                {formatNumber(trendData.insights.avgSubscriberCount)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>평균 구독자</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #0f1628 0%, #1a1f35 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <Eye size={20} style={{ color: '#d4af37', marginBottom: '8px' }} />
              <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', marginBottom: '3px' }}>
                {formatNumber(trendData.insights.avgVideoViews)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>평균 조회수</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #0f1628 0%, #1a1f35 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <BarChart size={20} style={{ color: '#d4af37', marginBottom: '8px' }} />
              <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', marginBottom: '3px' }}>
                {trendData.channels.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>분석 채널</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #0f1628 0%, #1a1f35 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <Calendar size={20} style={{ color: '#d4af37', marginBottom: '8px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', marginBottom: '3px' }}>
                {trendData.insights.uploadFrequency.replace('업로드', '')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>업로드 빈도</div>
            </div>
          </div>
        )}

        {/* Content Patterns - 간결하게 */}
        {trendData && trendData.insights.contentPatterns.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #0f1628 0%, #1a1f35 100%)',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '20px',
            border: '1px solid rgba(212, 175, 55, 0.15)'
          }}>
            <h3 style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#d4af37',
              marginBottom: '10px'
            }}>
              📈 콘텐츠 패턴
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {trendData.insights.contentPatterns.slice(0, 3).map((pattern, idx) => (
                <span key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: '#94a3b8'
                }}>
                  {pattern.replace(/📝|🔢|❓|❗|😊|🌍|📌/g, '').trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Top Channels - 고급 스타일 */}
        {trendData && trendData.channels.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#d4af37',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <TrendingUp size={18} style={{ color: '#d4af37' }} />
              트렌디한 채널 TOP {Math.min(trendData.channels.length, 20)}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '12px'
            }}>
              {trendData.channels.slice(0, 20).map((channel, index) => (
                <div
                  key={channel.id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.borderColor = '#10b981';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {/* Header with thumbnail */}
                  <div style={{
                    position: 'relative',
                    background: '#f8fafc',
                    padding: '15px',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: index < 3 
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                        : 'linear-gradient(135deg, #64748b, #475569)',
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '900',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}>
                      {index + 1}
                    </div>
                    <img 
                      src={channel.thumbnailUrl} 
                      alt={channel.title}
                      style={{
                        width: '100%',
                        height: '160px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400?text=${encodeURIComponent(channel.title.charAt(0))}`;
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      marginBottom: '8px',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {channel.title}
                    </h3>

                    {/* Stats */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '10px',
                      marginTop: '12px'
                    }}>
                      <div style={{
                        background: '#f1f5f9',
                        padding: '10px',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#10b981' }}>
                          {formatNumber(channel.subscriberCount)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>구독자</div>
                      </div>

                      <div style={{
                        background: '#f1f5f9',
                        padding: '10px',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#3b82f6' }}>
                          {channel.videoCount}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>영상 수</div>
                      </div>
                    </div>

                    {channel.customUrl && (
                      <a
                        href={`https://youtube.com/${channel.customUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          marginTop: '12px',
                          padding: '8px',
                          background: '#ef4444',
                          color: 'white',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={14} />
                        채널 방문
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Videos */}
        {trendData && trendData.topVideos.length > 0 && (
          <div>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2rem)',
              fontWeight: '900',
              color: '#0f172a',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              🎬 인기 영상 TOP {trendData.topVideos.length}
            </h2>

            <div style={{ display: 'grid', gap: '15px' }}>
              {trendData.topVideos.map((video, index) => (
                <a
                  key={video.id}
                  href={`https://youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#ef4444';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  {/* Rank */}
                  <div style={{
                    background: index < 3 
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                      : 'linear-gradient(135deg, #94a3b8, #64748b)',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: '900',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>

                  {/* Thumbnail */}
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    style={{
                      width: '180px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Video';
                    }}
                  />

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      marginBottom: '6px',
                      lineHeight: '1.4'
                    }}>
                      {video.title}
                    </h3>

                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '10px' }}>
                      {video.channelTitle}
                    </div>

                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.85rem',
                        color: '#10b981',
                        fontWeight: '700'
                      }}>
                        <Eye size={14} />
                        {formatNumber(video.viewCount)}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.85rem',
                        color: '#ef4444',
                        fontWeight: '700'
                      }}>
                        <ThumbsUp size={14} />
                        {formatNumber(video.likeCount)}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.85rem',
                        color: '#64748b'
                      }}>
                        <Calendar size={14} />
                        {formatDate(video.publishedAt)}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !trendData && !error && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#94a3b8'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px', color: '#64748b' }}>
              주제를 입력하고 트렌드를 분석해보세요!
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              유튜브에서 어떤 채널이 인기 있고,<br />
              어떤 콘텐츠가 잘되는지 알아보세요
            </p>
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

export default AIConstructionSiteStep2Page;
