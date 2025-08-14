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
        breadcrumbText="CLATHON 소개"
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
                <h1 className="ceo-name">CLATHON (클라톤)</h1>
                <p className="ceo-title">차별화된 AI 교육 플랫폼</p>
                <p className="ceo-description">
                  단순히 수강만 하는 교육이 아닌, 실제로 AI를 활용할 수 있게 만드는 교육 시스템을 구축했습니다. 
                  검증된 멘토들과 함께하는 실전 중심 교육으로, 
                  진짜 AI 역량을 키우고 실무에서 바로 활용할 수 있는 인재를 양성합니다.
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

        {/* CLATHON 교육 시스템 섹션 */}
        <div className="ceo-section">
          <div className="ceo-container">
            <h2 className="section-title">
              <Target size={24} />
              CLATHON 교육 시스템
            </h2>
            
            <div className="education-grid">
              <div className="education-card">
                <div className="degree-level">무료 강의</div>
                <h3 className="university">AI 기초 입문</h3>
                <p className="university-english">Foundation Level</p>
                <p className="major">ChatGPT, Google AI, 코딩 기초</p>
                <div className="transcript-section">
                  <h4 className="transcript-title">🎯 학습 목표</h4>
                  <ul className="feature-list">
                    <li>AI 도구 기본 사용법 익히기</li>
                    <li>프롬프트 엔지니어링 기초</li>
                    <li>실생활 AI 활용 방법</li>
                  </ul>
                </div>
              </div>

              <div className="education-card">
                <div className="degree-level">유료 강의</div>
                <h3 className="university">AI 실전 마스터</h3>
                <p className="university-english">Professional Level</p>
                <p className="major">심화 프로젝트 & 워크플로우</p>
                <div className="transcript-section">
                  <h4 className="transcript-title">🚀 핵심 기능</h4>
                  <ul className="feature-list">
                    <li>실무 프로젝트 완성</li>
                    <li>자동화 시스템 구축</li>
                    <li>수익화 전략 수립</li>
                    <li>포트폴리오 제작</li>
                  </ul>
                </div>
              </div>

              <div className="education-card">
                <div className="degree-level">그룹 라이브</div>
                <h3 className="university">소그룹 실시간 클래스</h3>
                <p className="university-english">Group Live Session</p>
                <p className="major">5-10명 소그룹 (90분/회)</p>
                <div className="transcript-section">
                  <h4 className="transcript-title">👥 특징</h4>
                  <ul className="feature-list">
                    <li>실시간 질의응답</li>
                    <li>동료 학습자와 상호작용</li>
                    <li>그룹 프로젝트 진행</li>
                    <li>경제적인 가격</li>
                  </ul>
                </div>
              </div>

              <div className="education-card">
                <div className="degree-level">1:1 라이브</div>
                <h3 className="university">개인 맞춤 멘토링</h3>
                <p className="university-english">Personal Mentoring</p>
                <p className="major">완전 개인화 교육 (50분/회)</p>
                <div className="transcript-section">
                  <h4 className="transcript-title">⭐ 프리미엄 서비스</h4>
                  <ul className="feature-list">
                    <li>개인 목표 맞춤 커리큘럼</li>
                    <li>실시간 1:1 피드백</li>
                    <li>상담 기반 가격 책정</li>
                    <li>멘토 직접 선택 가능</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 검증된 멘토 시스템 섹션 */}
        <div className="ceo-section">
          <div className="ceo-container">
            <h2 className="section-title">
              <Users size={24} />
              검증된 멘토 시스템
            </h2>
            
            <div className="mentor-verification">
              <div className="verification-card">
                <div className="verification-icon">
                  <GraduationCap size={32} />
                </div>
                <h3>학력 검증</h3>
                <p>대학원 이상 학위 보유자만 선발하며, 모든 학력 정보를 투명하게 공개합니다.</p>
              </div>
              
              <div className="verification-card">
                <div className="verification-icon">
                  <Briefcase size={32} />
                </div>
                <h3>실무 경력 검증</h3>
                <p>최소 3년 이상의 AI 관련 실무 경험을 보유한 전문가들로 구성됩니다.</p>
              </div>
              
              <div className="verification-card">
                <div className="verification-icon">
                  <Trophy size={32} />
                </div>
                <h3>포트폴리오 검증</h3>
                <p>GitHub, 논문, 프로젝트 등 공개 가능한 실제 성과물을 통해 실력을 검증합니다.</p>
              </div>
              
              <div className="verification-card">
                <div className="verification-icon">
                  <Globe size={32} />
                </div>
                <h3>정보 완전 공개</h3>
                <p>모든 멘토의 학력, 경력, 포트폴리오, 전문 분야를 투명하게 공개합니다.</p>
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
                      src="/images/transcript-masters.png" 
                      alt="일리노이공대 석사 공식 성적증명서"
                      className="transcript-image"
                      onClick={() => openTranscriptModal("/images/transcript-masters.png")}
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
              <h2>AI의 미래를 함께 만들어갑시다</h2>
              <p>15년간의 실전 경험과 노하우를 바탕으로, 당신도 AI 전문가의 길을 시작할 수 있습니다.</p>
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