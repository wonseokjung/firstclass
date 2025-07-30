import React from 'react';
import { ChevronRight, Search, Award, Building, GraduationCap, Briefcase, Users, Globe, Trophy, Target, Youtube, Instagram } from 'lucide-react';

interface CEOPageProps {
  onBack: () => void;
}

const CEOPage: React.FC<CEOPageProps> = ({ onBack }) => {
  return (
    <div className="ceo-page">
      {/* 헤더 */}
      <header className="masterclass-header-original">
        <div className="header-content">
          <div className="header-left">
            <div className="logo" onClick={onBack} style={{ cursor: 'pointer' }}>
              <span className="logo-icon">C</span>
              <span className="logo-text">CLATHON</span>
            </div>
            <div className="browse-dropdown">
              <button 
                className="browse-btn"
                aria-label="Browse AI & Technology courses"
                aria-expanded="false"
              >
                AI & Technology <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="search-container">
            <Search size={20} className="search-icon" aria-hidden="true" />
            <input 
              type="text" 
              placeholder="What do you want to learn..." 
              className="search-input"
              aria-label="Search for courses"
              role="searchbox"
            />
          </div>
          
          <div className="header-right">
            <button className="nav-link" onClick={onBack}>돌아가기</button>
            <button className="nav-link">FAQ</button>
            <button className="nav-link">View Plans</button>
            <button className="nav-link">Log In</button>
            <button className="cta-button">Get CLATHON</button>
          </div>
        </div>
      </header>

      {/* CEO 프로필 메인 섹션 */}
      <div className="ceo-content">
        <div className="ceo-hero-section">
          <div className="ceo-container">
            <div className="ceo-hero-content">
              <div className="ceo-avatar-section">
                <div className="ceo-avatar">
                  <span className="ceo-avatar-text">정원석</span>
                </div>
                <div className="ceo-badges">
                  <div className="badge-item">
                    <Award size={16} />
                    <span>AI 전문가</span>
                  </div>
                  <div className="badge-item">
                    <Building size={16} />
                    <span>기업가</span>
                  </div>
                  <div className="badge-item">
                    <GraduationCap size={16} />
                    <span>교수</span>
                  </div>
                </div>
              </div>
              
              <div className="ceo-intro">
                <h1 className="ceo-name">정원석 (Jay)</h1>
                <p className="ceo-title">커넥젼에이아이 대표 & AI 멘토</p>
                <p className="ceo-description">
                  진짜 AI 교육을 하기 위한 열정과 진정성으로 달려왔습니다. 
                  15년간 AI 연구와 사업을 통해 쌓은 실전 경험으로, 
                  차세대 AI 인재 양성과 혁신적인 AI 솔루션 개발을 선도하고 있습니다.
                </p>
                
                <div className="ceo-social">
                  <div className="social-item">
                    <Youtube size={20} />
                    <span>Connect AI LAB</span>
                  </div>
                  <div className="social-item">
                    <Instagram size={20} />
                    <span>aimentorjay (30만 팔로워)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 학력 섹션 */}
        <div className="ceo-section">
          <div className="ceo-container">
            <h2 className="section-title">
              <GraduationCap size={24} />
              학력
            </h2>
            <div className="education-grid">
              <div className="education-card">
                <div className="degree-level">석사</div>
                <h3 className="university">일리노이공대</h3>
                <p className="university-english">Illinois Institute of Technology</p>
                <p className="major">Data Science</p>
              </div>
              <div className="education-card">
                <div className="degree-level">학사</div>
                <h3 className="university">뉴욕시립대</h3>
                <p className="university-english">City University of New York - Baruch College</p>
                <p className="major">Data Science</p>
              </div>
            </div>
          </div>
        </div>

        {/* 현재 활동 섹션 */}
        <div className="ceo-section current-roles">
          <div className="ceo-container">
            <h2 className="section-title">
              <Briefcase size={24} />
              현재 활동
            </h2>
            <div className="roles-grid">
              <div className="role-card primary">
                <div className="role-icon">
                  <Building size={32} />
                </div>
                <h3>커넥젼에이아이 대표</h3>
                <p>AI 솔루션 개발과 컨설팅을 통한 디지털 트랜스포메이션 선도</p>
              </div>
              <div className="role-card">
                <div className="role-icon">
                  <GraduationCap size={32} />
                </div>
                <h3>서울사이버대학교 대우교수</h3>
                <p>공과대학 인공지능 전공 · 차세대 AI 인재 양성</p>
              </div>
              <div className="role-card">
                <div className="role-icon">
                  <Youtube size={32} />
                </div>
                <h3>AI 콘텐츠 크리에이터</h3>
                <p>Connect AI LAB 유튜브 채널 운영 · AI 지식 대중화</p>
              </div>
              <div className="role-card">
                <div className="role-icon">
                  <Instagram size={32} />
                </div>
                <h3>인플루언서</h3>
                <p>aimentorjay 인스타그램 30만 팔로워 · AI 교육 전파</p>
              </div>
            </div>
          </div>
        </div>

        {/* 경력 타임라인 */}
        <div className="ceo-section timeline-section">
          <div className="ceo-container">
            <h2 className="section-title">
              <Target size={24} />
              주요 경력
            </h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-content">
                  <h3>서울사이버대학교 대우교수 & (주)놀잇 R&D 리더</h3>
                  <p>공과대학 인공지능 전공 교수 임명 · 알파세대를 위한 AI 교육 솔루션 컨설팅/개발</p>
                </div>
              </div>
              
              <div className="timeline-item achievement">
                <div className="timeline-year">2023</div>
                <div className="timeline-content">
                  <h3>AI 해커톤 다수 수상</h3>
                  <p>뤼튼 해커톤 1위 (AI 해킹 방어 툴 개발) · 블록체인 해커톤 2위</p>
                  <div className="achievement-badge">
                    <Trophy size={16} />
                    수상
                  </div>
                </div>
              </div>

              <div className="timeline-item global">
                <div className="timeline-year">2022</div>
                <div className="timeline-content">
                  <h3>메타 아시아 지역 글로벌 리더 선정</h3>
                  <p>4인 중 한 명으로 선정 · 아시아 AI 생태계 리더십 인정</p>
                  <div className="achievement-badge global-badge">
                    <Globe size={16} />
                    글로벌
                  </div>
                </div>
              </div>

              <div className="timeline-item startup">
                <div className="timeline-year">2020</div>
                <div className="timeline-content">
                  <h3>AI 헬스케어 스타트업 옵트버스 설립</h3>
                  <p>50억원 기업가치 인정받아 투자 유치 성공</p>
                </div>
              </div>

              <div className="timeline-item research">
                <div className="timeline-year">2019</div>
                <div className="timeline-content">
                  <h3>모두의연구소 인공지능 선임연구원</h3>
                  <p>AI COLLEGE 기획/운영 · 200명 이상 AI 연구원 양성 · NeurIPS, CVPR 등 유수 컨퍼런스 논문 게재</p>
                  <div className="achievement-badge">
                    <Users size={16} />
                    200+ 양성
                  </div>
                </div>
              </div>

              <div className="timeline-item publication">
                <div className="timeline-year">2018</div>
                <div className="timeline-content">
                  <h3>PostAI 강화학습 연구</h3>
                  <p>"REWARD SHAPING IS ALL YOU NEED" 논문 발표<br/>
                  "Exploration method for reducing uncertainty using Q-entropy" 논문으로 Best Poster Award 수상</p>
                  <div className="achievement-badge">
                    <Award size={16} />
                    Best Poster
                  </div>
                </div>
              </div>

              <div className="timeline-item founding">
                <div className="timeline-year">2017</div>
                <div className="timeline-content">
                  <h3>ConnexionAI 설립</h3>
                  <p>200억 규모 AI 스마트팩토리 구축 프로젝트 컨설팅 · AI 솔루션 개발 사업 시작</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="ceo-cta-section">
          <div className="ceo-container">
            <div className="cta-content">
              <h2>AI의 미래를 함께 만들어갑시다</h2>
              <p>15년간의 실전 경험과 노하우를 바탕으로, 당신도 AI 전문가의 길을 시작할 수 있습니다.</p>
              <button className="cta-button large" onClick={onBack}>
                강의 보러가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CEOPage; 