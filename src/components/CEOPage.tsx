import React, { useState } from 'react';
import { Award, Building, GraduationCap, Briefcase, Users, Globe, Trophy, Target, Youtube, Instagram, X } from 'lucide-react';
import NavigationBar from './NavigationBar';

interface CEOPageProps {
  onBack: () => void;
}

const CEOPage: React.FC<CEOPageProps> = ({ onBack }) => {
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);

  const openTranscriptModal = (imageSrc: string) => {
    setSelectedTranscript(imageSrc);
  };

  const closeTranscriptModal = () => {
    setSelectedTranscript(null);
  };

  return (
    <div className="ceo-page">
      {/* 통일된 네비게이션바 */}
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="AI City Builders 소개"
      />

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
                <h1 className="ceo-name">AI City Builders</h1>
                <p className="ceo-title">디지털 건물주 양성 플랫폼</p>
                <p className="ceo-description">
                  AI City Builders는 월 수익이 나오는 새로운 패러다임의 디지털 건물을 
                  AI로 구축하는 혁신적인 플랫폼입니다. 우리는 인공지능을 가르치면서 
                  동시에 수익화하는 방법을 알려드립니다. 하나의 수익이 되는 채널을 
                  '디지털 건물'로 정의하고, 이런 건물들을 만드는 디지털 건물주들을 
                  모아 네트워크를 구축하여 서로 협력하는 AI 도시 생태계를 만들어갑니다.
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


        {/* AI City 비전 섹션 */}
        <div className="ceo-section">
          <div className="ceo-container">
            <h2 className="section-title">
              <Users size={24} />
              AI City Builders의 비전
            </h2>
            
            <div className="mentor-verification">
              <div className="verification-card">
                <div className="verification-icon">
                  <GraduationCap size={32} />
                </div>
                <h3>AI 수익화 교육</h3>
                <p>AI 도구를 활용해 콘텐츠 생성부터 자동화까지, 실제 월세처럼 지속적인 수익을 만들어내는 시스템을 구축하는 방법을 가르칩니다.</p>
              </div>
              
              <div className="verification-card">
                <div className="verification-icon">
                  <Briefcase size={32} />
                </div>
                <h3>디지털 건물 완성</h3>
                <p>유튜브, 블로그, 쇼핑몰 등 각종 디지털 플랫폼을 하나의 '건물'로 완성하여 매월 안정적인 임대수익과 같은 구조를 만듭니다.</p>
              </div>
              
              <div className="verification-card">
                <div className="verification-icon">
                  <Trophy size={32} />
                </div>
                <h3>건물주 네트워크</h3>
                <p>성공한 디지털 건물주들이 모여 서로의 건물을 홍보하고 협력하여, 개인의 성공을 넘어 집단 지성으로 더 큰 성과를 만들어냅니다.</p>
              </div>
              
              <div className="verification-card">
                <div className="verification-icon">
                  <Globe size={32} />
                </div>
                <h3>AI 도시 완성</h3>
                <p>개별 건물들이 연결되어 하나의 거대한 AI 도시를 형성하고, 도시 전체가 함께 성장하는 지속 가능한 디지털 경제 생태계를 구축합니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 대표 멘토 정원석 소개 섹션 */}
        <div className="ceo-section">
          <div className="ceo-container">
            <h2 className="section-title">
              <Award size={24} />
              대표 멘토 - 정원석 (Jay)
            </h2>
            <div className="education-grid">
              <div className="education-card">
                <div className="degree-level">석사</div>
                <h3 className="university">일리노이공대</h3>
                <p className="university-english">Illinois Institute of Technology</p>
                <p className="major">Data Science (MS)</p>
                <div className="transcript-section">
                  <h4 className="transcript-title">📜 Official Transcript</h4>
                  <div className="transcript-image-container">
                    <img 
                      src="/images/illinoistch_graduation.png" 
                      alt="일리노이공대 석사 공식 성적증명서"
                      className="transcript-image"
                      onClick={() => openTranscriptModal("/images/illinoistch_graduation.png")}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div className="transcript-placeholder" style={{ display: 'none' }}>
                      <div className="placeholder-content">
                        <GraduationCap size={48} />
                        <p>석사 성적증명서</p>
                        <small>Illinois Institute of Technology 공식 성적증명서</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="education-card">
                <div className="degree-level">학사</div>
                <h3 className="university">뉴욕시립대</h3>
                <p className="university-english">City University of New York - Baruch College</p>
                <p className="major">Data Science (BS)</p>
                <div className="transcript-section">
                  <h4 className="transcript-title">📜 Official Transcript</h4>
                  <div className="transcript-image-container">
                    <img 
                      src="/images/transcript-bachelors.png" 
                      alt="뉴욕시립대 학사 공식 성적증명서"
                      className="transcript-image"
                      onClick={() => openTranscriptModal("/images/transcript-bachelors.png")}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div className="transcript-placeholder" style={{ display: 'none' }}>
                      <div className="placeholder-content">
                        <GraduationCap size={48} />
                        <p>학사 성적증명서</p>
                        <small>City University of New York - Baruch College 공식 성적증명서</small>
                      </div>
                    </div>
                  </div>
                </div>
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
              <h2>디지털 건물주가 되어 AI 도시를 함께 만들어갑시다</h2>
              <p>15년간의 실전 경험과 노하우를 바탕으로, 당신도 월 수익을 창출하는 디지털 건물을 만들고 AI 도시의 일원이 될 수 있습니다.</p>
              <button className="cta-button large" onClick={onBack}>
                강의 보러가기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 성적증명서 확대보기 모달 */}
      {selectedTranscript && (
        <div className="transcript-modal" onClick={closeTranscriptModal}>
          <div className="transcript-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="transcript-modal-close" onClick={closeTranscriptModal}>
              <X size={20} />
            </button>
            <img 
              src={selectedTranscript} 
              alt="성적증명서 확대보기" 
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CEOPage; 