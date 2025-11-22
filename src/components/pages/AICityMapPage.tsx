import React, { useState, useEffect } from 'react';
import NavigationBar from '../common/NavigationBar';
import { Plus, Youtube, Video, Zap } from 'lucide-react';

interface AICityMapPageProps {
  onBack: () => void;
}

interface CityBuilder {
  id: string;
  email: string;
  name: string;
  youtubeChannelName: string;
  youtubeChannelUrl: string;
  profileImage?: string;
  stats: {
    longFormViews: number;
    shortsViews: number;
    lastUpdated: string;
  };
}

const AICityMapPage: React.FC<AICityMapPageProps> = ({ onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [builders, setBuilders] = useState<CityBuilder[]>([]);
  const [hasRegistered, setHasRegistered] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    youtubeChannelName: '',
    youtubeChannelUrl: '',
    longFormViews: '',
    shortsViews: ''
  });

  useEffect(() => {
    // 로그인 상태 확인
    const userSession = sessionStorage.getItem('aicitybuilders_user_session');
    if (userSession) {
      const user = JSON.parse(userSession);
      setIsLoggedIn(true);
      setUserEmail(user.email);
      // TODO: Azure에서 건물주 데이터 로드
      loadBuilders();
      checkUserRegistration(user.email);
    }
  }, []);

  const loadBuilders = async () => {
    // TODO: Azure Table Storage에서 건물주 목록 로드
    // 임시 샘플 데이터
    const sampleBuilders: CityBuilder[] = [
      {
        id: '1',
        email: 'sample1@example.com',
        name: '김철수',
        youtubeChannelName: '철수의 AI 도시',
        youtubeChannelUrl: 'https://youtube.com/@sample1',
        stats: {
          longFormViews: 15420,
          shortsViews: 8350,
          lastUpdated: new Date().toISOString()
        }
      }
    ];
    setBuilders(sampleBuilders);
  };

  const checkUserRegistration = async (email: string) => {
    // TODO: 이미 등록했는지 확인
    setHasRegistered(false);
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.youtubeChannelName || !formData.youtubeChannelUrl) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    // TODO: Azure Table Storage에 저장
    const newBuilder: CityBuilder = {
      id: Date.now().toString(),
      email: userEmail,
      name: formData.name,
      youtubeChannelName: formData.youtubeChannelName,
      youtubeChannelUrl: formData.youtubeChannelUrl,
      stats: {
        longFormViews: parseInt(formData.longFormViews) || 0,
        shortsViews: parseInt(formData.shortsViews) || 0,
        lastUpdated: new Date().toISOString()
      }
    };

    setBuilders([...builders, newBuilder]);
    setHasRegistered(true);
    setShowRegisterForm(false);
    alert('🎉 AI 도시 건물주로 등록되었습니다!');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 25%, #0ea5e9 50%, #075985 75%, #0c4a6e 100%)',
      fontFamily: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* 배경 애니메이션 요소들 - 더 화려하게 */}
      <div style={{
        position: 'absolute',
        top: '-5%',
        left: '-5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite, pulse 4s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '5%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite reverse, pulse 3s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite, pulse 5s ease-in-out infinite'
      }} />

      <div style={{
        position: 'absolute',
        top: '50%',
        right: '20%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 7s ease-in-out infinite reverse'
      }} />

      {/* 그리드 패턴 오버레이 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />

      <NavigationBar 
        onBack={onBack}
        breadcrumbText="AI City Map"
      />

      {/* 메인 콘텐츠 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* 헤더 섹션 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          padding: '50px 30px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          {/* 타이틀 배지 */}
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            padding: '8px 20px',
            borderRadius: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
          }}>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '0.05em'
            }}>
              🌟 AI CITY BUILDERS
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '900',
            color: 'white',
            marginBottom: '20px',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(251, 191, 36, 0.3)'
          }}>
            🏢 AI 도시 건물주들
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '700px',
            margin: '0 auto 30px',
            lineHeight: 1.7,
            fontWeight: '500',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}>
            AI로 콘텐츠를 만들고, 함께 성장하는 크리에이터 커뮤니티
          </p>

          {/* 통계 배지들 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginTop: '30px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '12px 24px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', fontWeight: '600' }}>
                🏗️ 건물주 수
              </span>
              <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', marginTop: '5px' }}>
                {builders.length}
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              padding: '12px 24px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', fontWeight: '600' }}>
                📊 총 조회수
              </span>
              <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', marginTop: '5px' }}>
                {builders.reduce((sum, b) => sum + b.stats.longFormViews + b.stats.shortsViews, 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* 로그인 안내 or 등록 버튼 */}
          {!isLoggedIn ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(251, 191, 36, 0.5)',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '500px',
              margin: '30px auto 0',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}>
              <p style={{
                fontSize: '1.1rem',
                color: '#0c4a6e',
                marginBottom: '20px',
                fontWeight: '700'
              }}>
                🔐 AI 도시 건물주로 등록하려면 로그인이 필요합니다
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 30px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.4)';
                }}
              >
                로그인하기
              </button>
            </div>
          ) : !hasRegistered && (
            <button
              onClick={() => setShowRegisterForm(true)}
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: 'white',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '15px',
                padding: '18px 40px',
                fontSize: '1.2rem',
                fontWeight: '900',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 30px rgba(251, 191, 36, 0.5)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(251, 191, 36, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(251, 191, 36, 0.5)';
              }}
            >
              <Plus size={28} />
              건물주 등록하기
            </button>
          )}
        </div>

        {/* 등록 폼 모달 */}
        {showRegisterForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '800',
                color: '#0369a1',
                marginBottom: '10px'
              }}>
                🏢 AI 도시 건물주 등록
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: '#64748b',
                marginBottom: '30px'
              }}>
                여러분의 유튜브 채널을 자랑해주세요!
              </p>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                  👤 닉네임 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 철수"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                  🎥 유튜브 채널명 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.youtubeChannelName}
                  onChange={(e) => setFormData({ ...formData, youtubeChannelName: e.target.value })}
                  placeholder="예: 철수의 AI 도시"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                  🔗 유튜브 채널 URL <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="url"
                  value={formData.youtubeChannelUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeChannelUrl: e.target.value })}
                  placeholder="https://youtube.com/@..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                  📊 오늘의 롱폼 조회수
                </label>
                <input
                  type="number"
                  value={formData.longFormViews}
                  onChange={(e) => setFormData({ ...formData, longFormViews: e.target.value })}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                  ⚡ 오늘의 숏츠 조회수
                </label>
                <input
                  type="number"
                  value={formData.shortsViews}
                  onChange={(e) => setFormData({ ...formData, shortsViews: e.target.value })}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowRegisterForm(false)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    background: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  취소
                </button>
                <button
                  onClick={handleRegister}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
                  }}
                >
                  등록하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 건물주 카드 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {builders.map((builder, index) => (
            <div
              key={builder.id}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '25px',
                padding: '30px',
                border: '3px solid',
                borderImage: 'linear-gradient(135deg, #fbbf24, #f59e0b, #0ea5e9) 1',
                borderImageSlice: 1,
                boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(251, 191, 36, 0.4), 0 0 50px rgba(14, 165, 233, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
              }}
            >
              {/* 순위 배지 */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: index < 3 
                  ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' 
                  : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '800',
                color: 'white',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}>
                {index < 3 ? '🏆' : '🌟'} #{index + 1}
              </div>
              {/* 건물주 정보 */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)'
                  }}>
                    🏢
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '900',
                      color: '#0c4a6e',
                      marginBottom: '4px',
                      letterSpacing: '-0.01em'
                    }}>
                      {builder.name}
                    </h3>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600'
                    }}>
                      YouTube Creator
                    </div>
                  </div>
                </div>
                <a
                  href={builder.youtubeChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                  }}
                >
                  <Youtube size={18} />
                  {builder.youtubeChannelName}
                </a>
              </div>

              {/* 조회수 통계 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  padding: '20px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginBottom: '10px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Video size={20} color="white" />
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: 'white'
                    }}>
                      롱폼
                    </span>
                  </div>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: '900',
                    color: 'white',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {builder.stats.longFormViews.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '5px',
                    fontWeight: '600'
                  }}>
                    오늘의 조회수
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  padding: '20px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginBottom: '10px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Zap size={20} color="white" />
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: 'white'
                    }}>
                      숏츠
                    </span>
                  </div>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: '900',
                    color: 'white',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {builder.stats.shortsViews.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '5px',
                    fontWeight: '600'
                  }}>
                    오늘의 조회수
                  </div>
                </div>
              </div>

              {/* 업데이트 시간 */}
              <div style={{
                marginTop: '20px',
                padding: '10px',
                background: 'rgba(100, 116, 139, 0.1)',
                borderRadius: '10px',
                fontSize: '0.85rem',
                color: '#64748b',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                📅 {new Date(builder.stats.lastUpdated).toLocaleDateString('ko-KR')} 업데이트
              </div>
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        {builders.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '20px',
            border: '2px dashed #cbd5e1'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏗️</div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#64748b',
              marginBottom: '10px'
            }}>
              아직 등록된 건물주가 없습니다
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#94a3b8'
            }}>
              첫 번째 AI 도시 건물주가 되어보세요!
            </p>
          </div>
        )}
      </div>

      {/* CSS 애니메이션 */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-30px) rotate(5deg);
            }
            66% {
              transform: translateY(-15px) rotate(-5deg);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.2;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.3);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AICityMapPage;