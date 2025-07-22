import React, { useState } from 'react';
import { Play, Search, ChevronDown, Globe, Heart, Target, Award } from 'lucide-react';

interface AIEducationDocumentaryPageProps {
  onBack: () => void;
}

const AIEducationDocumentaryPage: React.FC<AIEducationDocumentaryPageProps> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getEmbedUrl = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=0&controls=1&rel=0`;
    }
    return url;
  };

  const documentaryUrl = 'https://youtu.be/6VpOwlEq7UM?si=d0eQl9slU1ybxe4x';

  return (
    <div className="masterclass-container">
      {/* CLATHON 스타일 헤더 */}
      <header className="masterclass-header-original">
        <div className="header-content">
          <div className="header-left">
            <div className="logo" onClick={onBack} style={{ cursor: 'pointer' }}>
              <span className="logo-icon">C</span>
              <span className="logo-text">CLATHON</span>
            </div>
            <div className="browse-dropdown">
              <button className="browse-btn">
                AI & Technology <ChevronDown size={16} />
              </button>
            </div>
          </div>
          
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="What do you want to learn..." 
              className="search-input"
            />
          </div>
          
          <div className="header-right">
            <button className="nav-link">At Work</button>
            <button className="nav-link">Gifts</button>
            <button className="nav-link">View Plans</button>
            <button className="nav-link">Log In</button>
            <button className="cta-button" onClick={onBack}>← Back to CLATHON</button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="documentary-main">
        <div className="documentary-container">
          {/* 다큐멘터리 히어로 섹션 */}
          <section className="documentary-hero">
            <div className="hero-content">
              <div className="hero-badge">
                <Globe size={16} />
                Documentary
              </div>
              <h1 className="documentary-title">
                AI 교육의 격차를 줄이는 여정
              </h1>
              <h2 className="documentary-subtitle">
                모든 아이들이 꿈꿀 수 있는 세상을 만들어가는 이야기
              </h2>
              <p className="documentary-description">
                인도네시아 작은 학교에서 만난 아름다운 미소의 아이들. 
                프로그래머가 되고 싶지만 컴퓨터도 없고 교육 기회도 부족한 현실. 
                이들에게 희망을 전하고 전 세계 교육 격차를 해소하기 위한 프로젝트의 감동적인 여정을 담았습니다.
              </p>
            </div>
          </section>

          {/* 비디오 플레이어 섹션 */}
          <section className="video-section">
            <div className="video-container-documentary">
              {!isPlaying ? (
                <div className="video-thumbnail" onClick={() => setIsPlaying(true)}>
                  <img 
                    src="/images/aieducation.jpg" 
                    alt="AI Education Documentary"
                    className="thumbnail-image"
                  />
                  <div className="play-overlay">
                    <button className="play-button-large">
                      <Play size={64} />
                    </button>
                  </div>
                  <div className="video-info-overlay">
                    <h3>AI 교육의 격차를 줄이는 여정</h3>
                    <p>모든 이에게 양질의 교육 기회를</p>
                  </div>
                </div>
              ) : (
                <div className="video-player-documentary">
                  <iframe
                    src={getEmbedUrl(documentaryUrl)}
                    title="AI Education Documentary"
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              )}
            </div>
          </section>

          {/* 프로젝트 스토리 섹션 */}
          <section className="story-section">
            <div className="story-content">
              <h3 className="story-title">우리의 약속</h3>
              
              <div className="story-cards">
                <div className="story-card">
                  <div className="story-icon">
                    <Heart size={32} />
                  </div>
                  <h4>시작</h4>
                  <p>
                    인도네시아 작은 학교 좁은 골목길을 통해 도착했을 때, 가장 아름다운 미소를 가진 아이들을 만났습니다. 
                    그들은 프로그래머가 되고 싶어했지만, 컴퓨터를 살 여유도 없고 미래를 준비할 수 있도록 도와줄 교육과 멘토가 부족했습니다.
                  </p>
                </div>
                
                <div className="story-card">
                  <div className="story-icon">
                    <Target size={32} />
                  </div>
                  <h4>다짐</h4>
                  <p>
                    수업 후 호텔로 돌아가서 눈물을 흘리며 잠들었습니다. 더 많은 아이들을 도울 수 없는 제 자신이 너무 답답했습니다. 
                    그래서 저는 스스로에게 약속했습니다. 전 세계 모든 아이들에게 최고의 교육 기회를 제공하고 훌륭한 멘토가 되겠다고.
                  </p>
                </div>
                
                <div className="story-card">
                  <div className="story-icon">
                    <Award size={32} />
                  </div>
                  <h4>실행</h4>
                  <p>
                    각국을 여행하며 현지 교육자들과 협력하여 지속 가능한 교육 생태계를 구축하고 있습니다. 
                    온라인 교육 플랫폼을 통해 양질의 콘텐츠를 제공하며, 
                    모든 아이들이 꿈을 실현할 수 있는 세상을 만들어가고 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 서포터 섹션 */}
          <section className="supporters-section">
            <div className="supporters-content">
              <h3 className="supporters-title">함께해주신 분들</h3>
              <p className="supporters-subtitle">
                이 아름다운 여정을 함께 만들어주신 모든 분들께 진심으로 감사드립니다
              </p>
              
              <div className="supporters-grid">
                <div className="supporter-card">
                  <h4>Connect AI LAB 구독자들</h4>
                  <p>이 프로젝트를 응원하고 후원해주신 모든 구독자분들</p>
                </div>
                <div className="supporter-card">
                  <h4>LULU</h4>
                  <p>프로젝트의 비전을 믿고 지원해주신 핵심 후원자</p>
                </div>
                <div className="supporter-card">
                  <h4>Ijia & 지원팀</h4>
                  <p>함께 꿈을 키워가는 소중한 동반자들</p>
                </div>
                <div className="supporter-card">
                  <h4>현지 교육자들</h4>
                  <p>인도네시아 학교의 헌신적인 교장선생님과 선생님들</p>
                </div>
                <div className="supporter-card">
                  <h4>아이들과 가족들</h4>
                  <p>희망을 잃지 않고 꿈을 키워가는 우리의 주인공들</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 하단 구독 정보 */}
      <footer className="subscription-footer">
        <div className="subscription-content">
          <span className="subscription-text">
            Starting at ₩10,000/month (billed annually) for all classes and sessions
          </span>
          <button className="subscription-cta" onClick={onBack}>
                          Get CLATHON
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AIEducationDocumentaryPage; 