
import React, { useState } from 'react';
import { Building, Users, Star, Network } from 'lucide-react';
import NavigationBar from './NavigationBar';

interface AICityMapPageProps {
  onBack?: () => void;
}

interface BuildingOwner {
  id: string;
  name: string;
  email: string;
  avatar: string;
  digitalBuildings: DigitalBuilding[];
  totalRevenue: number;
  level: number;
  title: string;
}

interface DigitalBuilding {
  id: string;
  name: string;
  type: 'youtube' | 'blog' | 'ecommerce' | 'app' | 'course';
  monthlyRevenue: number;
  subscribers: number;
  description: string;
  image: string;
  position: { x: number; y: number };
  color: string;
  owner?: BuildingOwner;
}

const AICityMapPage: React.FC<AICityMapPageProps> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<'buildings' | 'network'>('buildings');

  // 임시로 준비중 페이지 표시
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <NavigationBar 
        onFAQClick={() => window.location.href = '/faq'}
        onLoginClick={() => window.location.href = '/login'}
        onSignUpClick={() => window.location.href = '/signup'}
      />
      
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          background: 'rgba(248, 250, 252, 0.9)',
          borderRadius: '20px',
          padding: window.innerWidth <= 768 ? '40px 24px' : '60px 40px',
          boxShadow: '0 10px 30px rgba(14, 165, 233, 0.1)',
          border: '1px solid rgba(14, 165, 233, 0.2)'
        }}>
          <div style={{
            fontSize: window.innerWidth <= 768 ? '60px' : '80px',
            marginBottom: '20px'
          }}>🏗️</div>
          
          <h1 style={{
            fontSize: window.innerWidth <= 768 ? '24px' : '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px',
            margin: 0
          }}>
            인공지능 디지털 도시 지도
          </h1>
          
          <h2 style={{
            fontSize: window.innerWidth <= 768 ? '20px' : '24px',
            color: '#0ea5e9',
            marginBottom: '24px',
            margin: '16px 0 24px 0'
          }}>
            준비중입니다
          </h2>
          
          <p style={{
            fontSize: window.innerWidth <= 768 ? '16px' : '18px',
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            더욱 발전된 AI City Map을 제작 중입니다.<br/>
            곧 새로운 디지털 세계를 만나보실 수 있습니다.
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '30px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#0ea5e9',
              borderRadius: '50%',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}></div>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#0ea5e9',
              borderRadius: '50%',
              animation: 'pulse 1.5s ease-in-out infinite 0.3s'
            }}></div>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#0ea5e9',
              borderRadius: '50%',
              animation: 'pulse 1.5s ease-in-out infinite 0.6s'
            }}></div>
          </div>
          
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.3)';
            }}
          >
            메인 페이지로 돌아가기
          </button>
        </div>
      </div>
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% { 
              opacity: 0.4;
              transform: scale(0.8);
            }
            50% { 
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}
      </style>
    </div>
  );

  // 기존 AI Map 코드는 아래에 주석 처리됨

  // AI 멘토 제이의 디지털 빌딩 포트폴리오
  const cityOwners: BuildingOwner[] = [
    {
      id: '1',
      name: 'AI 멘토 제이 (정원석)',
      email: 'jay@connexionai.kr',
      avatar: '/images/mentor-jay.jpg',
      totalRevenue: 0, // 수익 정보 비공개
      level: 15,
      title: '디지털 아키텍트',
      digitalBuildings: [
        {
          id: 'b1',
          name: 'Empire State AI Tower',
          type: 'youtube',
          monthlyRevenue: 0,
          subscribers: 50000,
          description: '🏗️ 맨해튼의 AI 교육 본부 - 엠파이어 스테이트 빌딩에서 펼쳐지는 ChatGPT 마스터클래스',
          image: '/images/youtube-building.png',
               position: { x: 600, y: 400 }, // 맨해튼 중심부 (엠파이어 스테이트)
          color: '#0ea5e9'
        },
        {
          id: 'b2',
          name: 'Times Square K-Culture Hub',
          type: 'youtube',
          monthlyRevenue: 0,
          subscribers: 280000,
          description: '🌟 타임스퀘어의 K-Culture 글로벌 센터 - 한국 문화를 뉴욕에서 세계로 전파하는 디지털 허브',
          image: '/images/kpop-building.png',
               position: { x: 350, y: 250 }, // 타임스퀘어 구역
          color: '#ff6b6b'
        },
        {
          id: 'b3',
          name: 'Central Park Beauty Sanctuary',
          type: 'youtube',
          monthlyRevenue: 0,
          subscribers: 0,
          description: '🌸 센트럴 파크의 K-Beauty 메타버스 - 자연과 기술이 만나는 차세대 뷰티 디지털 경험',
          image: '/images/kbeauty-building.png',
               position: { x: 500, y: 150 }, // 센트럴 파크 구역 (상단)
          color: '#10b981'
        }
      ]
    }
  ];

  const allBuildings = cityOwners.flatMap(owner => 
    owner.digitalBuildings.map(building => ({ ...building, owner }))
  );

  const getBuildingIcon = (type: string) => {
    switch (type) {
      case 'youtube': return '🎥';
      case 'blog': return '📝';
      case 'ecommerce': return '🛒';
      case 'app': return '📱';
      case 'course': return '🎓';
      default: return '🏢';
    }
  };

  const getLevelBadge = (level: number) => {
    if (level >= 15) return { name: '마스터 빌더', color: '#0ea5e9' };
    if (level >= 10) return { name: '시니어 마스터', color: '#10b981' };
    if (level >= 7) return { name: '엑스퍼트 빌더', color: '#f59e0b' };
    if (level >= 4) return { name: '시니어 빌더', color: '#8b5cf6' };
    return { name: '주니어 빌더', color: '#6b7280' };
  };

   return (
     <div style={{ 
       minHeight: '100vh', 
       background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
       fontFamily: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
       position: 'relative',
       overflow: 'hidden'
     }}>
       
       {/* 네비게이션 바 */}
       <NavigationBar 
         onFAQClick={() => window.location.href = '/faq'}
         onLoginClick={() => window.location.href = '/login'}
         onSignUpClick={() => window.location.href = '/signup'}
       />

      {/* 콘텐츠 래퍼 */}
      <div style={{ padding: '20px' }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
      
      {/* 헤더 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: '#1f2937'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
          fontWeight: '900',
          margin: '0 0 15px 0',
          textShadow: '0 0 30px rgba(14, 165, 233, 0.6)',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #87ceeb 50%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '1px'
        }}>
          AI 디지털 도시
        </h1>
         <p style={{
           fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
           margin: '0 0 25px 0',
           opacity: 0.95,
           color: '#1f2937',
           textShadow: '0 0 15px rgba(14, 165, 233, 0.4)',
           fontWeight: '500',
           letterSpacing: '0.5px',
           lineHeight: '1.6'
         }}>
           우리는 이렇게 디지털 건물을 세우고 있어요. 당신도 참여하세요!
         </p>
        
        {/* 뷰 모드 토글 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setViewMode('buildings')}
             style={{
               padding: '12px 24px',
               borderRadius: '25px',
               border: viewMode === 'buildings' ? 'none' : '2px solid #0ea5e9',
               background: viewMode === 'buildings' ? 'linear-gradient(135deg, #0ea5e9, #ff4757)' : 'transparent',
               color: '#1f2937',
               cursor: 'pointer',
               fontWeight: '600',
               transition: 'all 0.3s ease',
               boxShadow: viewMode === 'buildings' ? '0 8px 25px rgba(14, 165, 233, 0.3)' : 'none'
             }}
          >
            <Building size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
            건물 뷰
          </button>
          <button
            onClick={() => setViewMode('network')}
             style={{
               padding: '12px 24px',
               borderRadius: '25px',
               border: viewMode === 'network' ? 'none' : '2px solid #0ea5e9',
               background: viewMode === 'network' ? 'linear-gradient(135deg, #0ea5e9, #ff4757)' : 'transparent',
               color: '#1f2937',
               cursor: 'pointer',
               fontWeight: '600',
               transition: 'all 0.3s ease',
               boxShadow: viewMode === 'network' ? '0 8px 25px rgba(14, 165, 233, 0.3)' : 'none'
             }}
          >
            <Network size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
            네트워크 뷰
          </button>
        </div>
      </div>

      {/* 도시 통계 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px',
        maxWidth: '800px',
        margin: '0 auto 30px auto'
      }}>
         <div style={{
           background: 'rgba(255, 255, 255, 0.9)',
           borderRadius: '15px',
           padding: '25px',
           textAlign: 'center',
           border: '1px solid rgba(14, 165, 233, 0.3)',
           boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
         }}>
           <Building size={32} style={{ color: '#0ea5e9', marginBottom: '12px' }} />
           <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' }}>
             {allBuildings.length}
           </div>
           <div style={{ color: '#1f2937', fontSize: '1rem', fontWeight: '500' }}>현재 운영중인 건물</div>
         </div>
         
         <div style={{
           background: 'rgba(255, 255, 255, 0.9)',
           borderRadius: '15px',
           padding: '25px',
           textAlign: 'center',
           border: '1px solid rgba(255, 71, 87, 0.3)',
           boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
         }}>
           <Users size={32} style={{ color: '#ff4757', marginBottom: '12px' }} />
           <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' }}>
             {cityOwners.length}
           </div>
           <div style={{ color: '#1f2937', fontSize: '1rem', fontWeight: '500' }}>성공한 건물주</div>
         </div>
         
         <div style={{
           background: 'rgba(255, 255, 255, 0.9)',
           borderRadius: '15px',
           padding: '25px',
           textAlign: 'center',
           border: '1px solid rgba(255, 215, 0, 0.3)',
           boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
         }}>
           <Star size={32} style={{ color: '#ffd700', marginBottom: '12px' }} />
           <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' }}>
             {allBuildings.filter(b => b.subscribers > 0).reduce((sum, b) => sum + b.subscribers, 0) > 1000000 ? '1M+' : '330K'}
           </div>
           <div style={{ color: '#1f2937', fontSize: '1rem', fontWeight: '500' }}>글로벌 커뮤니티</div>
         </div>
      </div>

      {/* 메인 콘텐츠 영역 - 맵 중심 */}
      <div style={{
        width: '100%',
        maxWidth: '100vw',
        margin: '0',
        padding: '0 20px'
      }}>
        {/* 도시 맵 - 전체 화면 */}
         <div style={{
           width: '100%',
           minHeight: '85vh',
           background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.98), rgba(255, 255, 255, 0.95))',
           borderRadius: '25px',
           padding: '25px',
           position: 'relative',
           backdropFilter: 'blur(20px)',
           boxShadow: '0 20px 60px rgba(14, 165, 233, 0.1)',
           border: '1px solid rgba(14, 165, 233, 0.2)',
           overflow: 'hidden'
         }}>
           <h3 style={{ 
             margin: '0 0 25px 0', 
             color: '#1f2937',
             textAlign: 'center',
             fontSize: '1.4rem',
             fontWeight: '600'
           }}>
 {viewMode === 'buildings' ? 'AI 시티 맵' : '네트워크 연결'}
           </h3>
          
          {/* SVG AI City Builders 인포그래픽 맵 */}
          <svg
            width="100%"
            height="700"
            viewBox="0 0 1000 700"
            style={{
              border: '2px solid rgba(14, 165, 233, 0.2)',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
              boxShadow: '0 10px 30px rgba(14, 165, 233, 0.1)',
            }}
          >
            <defs>
              {/* 홀로그램 글로우 */}
              <filter id="holoGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* 강력한 네온 글로우 */}
              <filter id="superGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* 3D 홀로그램 그리드 */}
              <pattern id="holoGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="transparent"/>
                <line x1="0" y1="0" x2="0" y2="40" stroke="#0ea5e9" strokeWidth="1" opacity="0.4"/>
                <line x1="0" y1="0" x2="40" y2="0" stroke="#0ea5e9" strokeWidth="1" opacity="0.4"/>
                <circle cx="0" cy="0" r="2" fill="#0ea5e9" opacity="0.6"/>
              </pattern>
              
              {/* 에너지 플로우 그라디언트 */}
              <linearGradient id="energyFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent"/>
                <stop offset="30%" stopColor="#0ea5e9" stopOpacity="0.8">
                  <animate attributeName="offset" values="0%;100%;0%" dur="2s" repeatCount="indefinite"/>
                </stop>
                <stop offset="70%" stopColor="#87ceeb" stopOpacity="0.6">
                  <animate attributeName="offset" values="0%;100%;0%" dur="2s" repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" stopColor="transparent"/>
              </linearGradient>
              
              {/* 펄스 그라디언트 */}
              <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1"/>
                <stop offset="30%" stopColor="#0ea5e9" stopOpacity="0.8">
                  <animate attributeName="stop-opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" stopColor="#ff4757" stopOpacity="0.2">
                  <animate attributeName="stop-opacity" values="0.2;0.7;0.2" dur="2s" repeatCount="indefinite"/>
                </stop>
              </radialGradient>
            </defs>
            
            {/* 깔끔한 배경 */}
            <rect x="0" y="0" width="1000" height="700" fill="transparent"/>
            
            {/* 제목 */}
            <text x="500" y="50" textAnchor="middle" fontSize="28" fill="#1f2937" fontWeight="bold">AI 멘토 제이 디지털 제국</text>
            <text x="500" y="80" textAnchor="middle" fontSize="16" fill="#6b7280">정원석 - 현재 유일한 디지털 건물주</text>
            
            {/* 중앙 AI 멘토 제이 */}
            <g className="main-creator">
              <circle cx="500" cy="250" r="80" fill="#0ea5e9" stroke="#ffffff" strokeWidth="6"/>
              <circle cx="500" cy="250" r="65" fill="#ffffff" stroke="#0ea5e9" strokeWidth="3"/>
              <text x="500" y="235" textAnchor="middle" fontSize="18" fill="#0ea5e9" fontWeight="bold">AI 멘토 제이</text>
              <text x="500" y="255" textAnchor="middle" fontSize="16" fill="#1f2937" fontWeight="600">정원석</text>
              <text x="500" y="275" textAnchor="middle" fontSize="12" fill="#6b7280">디지털 건물주</text>
            </g>
            
            {/* 유튜브 채널 */}
            <g className="youtube-channel">
              <rect x="150" y="150" width="200" height="60" fill="#ff0000" stroke="#ffffff" strokeWidth="3" rx="10"/>
              <text x="250" y="140" textAnchor="middle" fontSize="14" fill="#1f2937" fontWeight="bold">📺 유튜브 채널</text>
              <text x="180" y="170" fontSize="14" fill="#ffffff" fontWeight="bold">🎥 AI 멘토 제이</text>
              <text x="180" y="190" fontSize="12" fill="#ffffff">구독자 1,795+명</text>
              
              {/* 연결선 */}
              <line x1="350" y1="180" x2="420" y2="220" stroke="#0ea5e9" strokeWidth="3"/>
            </g>
            
            {/* 인스타그램 */}
            <g className="instagram-channel">
              <rect x="650" y="150" width="200" height="60" fill="#E4405F" stroke="#ffffff" strokeWidth="3" rx="10"/>
              <text x="750" y="140" textAnchor="middle" fontSize="14" fill="#1f2937" fontWeight="bold">📸 인스타그램</text>
              <text x="680" y="170" fontSize="14" fill="#ffffff" fontWeight="bold">📱 @ai_mentor_jay</text>
              <text x="680" y="190" fontSize="12" fill="#ffffff">팔로워 증가중</text>
              
              {/* 연결선 */}
              <line x1="650" y1="180" x2="580" y2="220" stroke="#0ea5e9" strokeWidth="3"/>
            </g>
            
            {/* 강의 플랫폼 */}
            <g className="course-platform">
              <rect x="300" y="400" width="400" height="80" fill="#10b981" stroke="#ffffff" strokeWidth="3" rx="15"/>
              <text x="500" y="390" textAnchor="middle" fontSize="16" fill="#1f2937" fontWeight="bold">🏗️ AI City Builders 플랫폼</text>
              <text x="320" y="425" fontSize="14" fill="#ffffff" fontWeight="bold">📚 총 4개 강의 운영중</text>
              <text x="320" y="445" fontSize="12" fill="#ffffff">• ChatGPT 마스터클래스 (342명)</text>
              <text x="320" y="460" fontSize="12" fill="#ffffff">• AI 비즈니스 전략 (1,247명)</text>
              <text x="320" y="475" fontSize="12" fill="#ffffff">• AI 코딩 완전정복 (156명) + 프리미엄 (50+명)</text>
              
              {/* 연결선 */}
              <line x1="500" y1="330" x2="500" y2="400" stroke="#0ea5e9" strokeWidth="3"/>
            </g>
            
            {/* 기존 구역은 제거 */}
            <g style={{ display: 'none' }}>
              <rect x="300" y="190" width="120" height="100" fill="rgba(255, 107, 107, 0.15)" stroke="#ff6b6b" strokeWidth="3" rx="10" opacity="0.9"/>
              <text x="360" y="210" fill="#1f2937" fontSize="14" textAnchor="middle" fontWeight="bold">🌟 Times Square</text>
              <text x="360" y="225" fill="#1f2937" fontSize="12" textAnchor="middle" fontWeight="bold">K-Culture Hub</text>
              <text x="360" y="245" fill="#1f2937" fontSize="10" textAnchor="middle" fontWeight="600" opacity="0.8">K-Drama • K-Pop • Culture</text>
              <text x="360" y="260" fill="#1f2937" fontSize="9" textAnchor="middle" opacity="0.7">42nd St & Broadway</text>
              <text x="360" y="275" fill="#ff6b6b" fontSize="9" textAnchor="middle" fontWeight="bold">👑 AI 멘토 제이</text>
              
              {/* 참여 버튼 */}
              <rect x="320" y="280" width="80" height="20" fill="#ff6b6b" rx="10" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/#courses'}>
              </rect>
              <text x="360" y="293" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/#courses'}>입주하기</text>
            </g>
            
            {/* Wall Street - AI 비즈니스 금융구역 */}
            <g className="zone-wall-street" style={{ cursor: 'pointer' }}>
              <rect x="200" y="600" width="200" height="80" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="3" rx="10" opacity="0.9"/>
              <text x="300" y="620" fill="#1f2937" fontSize="14" textAnchor="middle" fontWeight="bold">💰 Wall Street</text>
              <text x="300" y="635" fill="#1f2937" fontSize="12" textAnchor="middle" fontWeight="bold">AI Business Hub</text>
              <text x="300" y="650" fill="#1f2937" fontSize="10" textAnchor="middle" fontWeight="600" opacity="0.8">AI Investing • FinTech</text>
              <text x="300" y="665" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">🚧 Coming Soon</text>
            </g>
            
            {/* Central Park Beauty Sanctuary */}
            <g className="zone-beauty" style={{ cursor: 'pointer' }}>
              <rect x="550" y="60" width="200" height="120" fill="rgba(255, 215, 0, 0.1)" stroke="#ffd700" strokeWidth="2" rx="15" opacity="0.7"/>
              <text x="650" y="85" fill="#1f2937" fontSize="16" textAnchor="middle" fontWeight="bold">뷰티 구역</text>
              <text x="650" y="110" fill="#1f2937" fontSize="12" textAnchor="middle" fontWeight="600" opacity="0.8">K-Beauty • 메이크업 • 스킨케어</text>
              <text x="650" y="130" fill="#1f2937" fontSize="11" textAnchor="middle" opacity="0.7">랭킹 진입 기회!</text>
              
              {/* 참여 버튼 */}
              <rect x="610" y="140" width="80" height="25" fill="#ffd700" rx="12" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/#courses'}>
              </rect>
              <text x="650" y="157" fill="#000000" fontSize="11" textAnchor="middle" fontWeight="bold" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/#courses'}>건물주 되기</text>
            </g>
            
            {/* 하단 구역 - 미래 확장 구역들 */}
            <g className="zone-fitness" style={{ cursor: 'pointer' }}>
              <rect x="50" y="420" width="120" height="100" fill="rgba(0, 255, 136, 0.05)" stroke="#00ff88" strokeWidth="1" rx="10" opacity="0.4" filter="url(#holoGlow)" strokeDasharray="10,10">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="5s" repeatCount="indefinite"/>
              </rect>
              <text x="110" y="450" fill="#00ff88" fontSize="14" textAnchor="middle" fontWeight="bold" opacity="0.7">💪 피트니스</text>
              <text x="110" y="470" fill="#1f2937" fontSize="10" textAnchor="middle" opacity="0.5">운동 • 헬스 • 다이어트</text>
              <text x="110" y="490" fill="#888" fontSize="9" textAnchor="middle" opacity="0.6">예상 채널 수: 2-3개</text>
              <text x="110" y="505" fill="#00ff88" fontSize="8" textAnchor="middle" opacity="0.8">🔒 준비중</text>
            </g>
            
            <g className="zone-food" style={{ cursor: 'pointer' }}>
              <rect x="190" y="420" width="120" height="100" fill="rgba(255, 165, 0, 0.05)" stroke="#ffa500" strokeWidth="1" rx="10" opacity="0.4" filter="url(#holoGlow)" strokeDasharray="10,10">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="5.5s" repeatCount="indefinite"/>
              </rect>
              <text x="250" y="450" fill="#ffa500" fontSize="14" textAnchor="middle" fontWeight="bold" opacity="0.7">🍽️ 먹방</text>
              <text x="250" y="470" fill="#1f2937" fontSize="10" textAnchor="middle" opacity="0.5">맛집 • 레시피 • 리뷰</text>
              <text x="250" y="490" fill="#888" fontSize="9" textAnchor="middle" opacity="0.6">예상 채널 수: 3-5개</text>
              <text x="250" y="505" fill="#ffa500" fontSize="8" textAnchor="middle" opacity="0.8">🔒 준비중</text>
            </g>
            
            <g className="zone-product" style={{ cursor: 'pointer' }}>
              <rect x="330" y="420" width="120" height="100" fill="rgba(138, 43, 226, 0.05)" stroke="#8a2be2" strokeWidth="1" rx="10" opacity="0.4" filter="url(#holoGlow)" strokeDasharray="10,10">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="6s" repeatCount="indefinite"/>
              </rect>
              <text x="390" y="450" fill="#8a2be2" fontSize="14" textAnchor="middle" fontWeight="bold" opacity="0.7">🛍️ 제품소개</text>
              <text x="390" y="470" fill="#1f2937" fontSize="10" textAnchor="middle" opacity="0.5">리뷰 • 언박싱 • 추천</text>
              <text x="390" y="490" fill="#888" fontSize="9" textAnchor="middle" opacity="0.6">예상 채널 수: 4-6개</text>
              <text x="390" y="505" fill="#8a2be2" fontSize="8" textAnchor="middle" opacity="0.8">🔒 준비중</text>
            </g>
            
            <g className="zone-lifestyle" style={{ cursor: 'pointer' }}>
              <rect x="470" y="420" width="120" height="100" fill="rgba(255, 20, 147, 0.05)" stroke="#ff1493" strokeWidth="1" rx="10" opacity="0.4" filter="url(#holoGlow)" strokeDasharray="10,10">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="6.5s" repeatCount="indefinite"/>
              </rect>
              <text x="530" y="450" fill="#ff1493" fontSize="14" textAnchor="middle" fontWeight="bold" opacity="0.7">🎨 라이프스타일</text>
              <text x="530" y="470" fill="#1f2937" fontSize="10" textAnchor="middle" opacity="0.5">일상 • 브이로그 • 여행</text>
              <text x="530" y="490" fill="#888" fontSize="9" textAnchor="middle" opacity="0.6">예상 채널 수: 2-4개</text>
              <text x="530" y="505" fill="#ff1493" fontSize="8" textAnchor="middle" opacity="0.8">🔒 준비중</text>
            </g>
            
            <g className="zone-domestic" style={{ cursor: 'pointer' }}>
              <rect x="610" y="420" width="120" height="100" fill="rgba(0, 191, 255, 0.05)" stroke="#00bfff" strokeWidth="1" rx="10" opacity="0.4" filter="url(#holoGlow)" strokeDasharray="10,10">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="7s" repeatCount="indefinite"/>
              </rect>
              <text x="670" y="450" fill="#00bfff" fontSize="14" textAnchor="middle" fontWeight="bold" opacity="0.7">🇰🇷 국내</text>
              <text x="670" y="470" fill="#1f2937" fontSize="10" textAnchor="middle" opacity="0.5">한국 • 로컬 • 트렌드</text>
              <text x="670" y="490" fill="#888" fontSize="9" textAnchor="middle" opacity="0.6">예상 채널 수: 3-5개</text>
              <text x="670" y="505" fill="#00bfff" fontSize="8" textAnchor="middle" opacity="0.8">🔒 준비중</text>
            </g>
            
            {/* 플로팅 파티클들 */}
            {Array.from({length: 15}).map((_, i) => (
              <circle key={i} r="2" fill="#0ea5e9" opacity="0.6">
                <animateMotion dur={`${8 + i * 2}s`} repeatCount="indefinite">
                  <path d={`M ${100 + i * 50} 50 Q ${400 + Math.sin(i) * 100} ${300 + Math.cos(i) * 100} ${700 - i * 30} 550`}/>
                </animateMotion>
              </circle>
            ))}

            {/* 미래 확장 건물 자리표시 */}
            {/* AI & 교육 구역 확장 자리 */}
            <g className="future-building" style={{ cursor: 'pointer', opacity: 0.3 }}>
              <circle cx="120" cy="250" r="20" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="8,4" opacity="0.4">
                <animate attributeName="r" values="20;25;20" dur="4s" repeatCount="indefinite"/>
              </circle>
              <text x="120" y="255" textAnchor="middle" fontSize="20" fill="#0ea5e9" opacity="0.6">🔒</text>
              <text x="120" y="280" textAnchor="middle" fontSize="9" fill="#1f2937" opacity="0.5">개발 채널</text>
            </g>
            
            <g className="future-building" style={{ cursor: 'pointer', opacity: 0.3 }}>
              <circle cx="180" cy="250" r="20" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="8,4" opacity="0.4">
                <animate attributeName="r" values="20;25;20" dur="4.5s" repeatCount="indefinite"/>
              </circle>
              <text x="180" y="255" textAnchor="middle" fontSize="20" fill="#0ea5e9" opacity="0.6">🔒</text>
              <text x="180" y="280" textAnchor="middle" fontSize="9" fill="#1f2937" opacity="0.5">디자인 채널</text>
            </g>
            
            {/* 글로벌 구역 확장 자리 */}
            <g className="future-building" style={{ cursor: 'pointer', opacity: 0.3 }}>
              <circle cx="370" cy="250" r="20" fill="none" stroke="#ff4757" strokeWidth="2" strokeDasharray="8,4" opacity="0.4">
                <animate attributeName="r" values="20;25;20" dur="5s" repeatCount="indefinite"/>
              </circle>
              <text x="370" y="255" textAnchor="middle" fontSize="20" fill="#ff4757" opacity="0.6">🔒</text>
              <text x="370" y="280" textAnchor="middle" fontSize="9" fill="#1f2937" opacity="0.5">K-Drama</text>
            </g>
            
            <g className="future-building" style={{ cursor: 'pointer', opacity: 0.3 }}>
              <circle cx="430" cy="250" r="20" fill="none" stroke="#ff4757" strokeWidth="2" strokeDasharray="8,4" opacity="0.4">
                <animate attributeName="r" values="20;25;20" dur="5.5s" repeatCount="indefinite"/>
              </circle>
              <text x="430" y="255" textAnchor="middle" fontSize="20" fill="#ff4757" opacity="0.6">🔒</text>
              <text x="430" y="280" textAnchor="middle" fontSize="9" fill="#1f2937" opacity="0.5">K-Pop</text>
            </g>
            
            {/* 뷰티 구역 확장 자리 */}
            <g className="future-building" style={{ cursor: 'pointer', opacity: 0.3 }}>
              <circle cx="620" cy="250" r="20" fill="none" stroke="#ffd700" strokeWidth="2" strokeDasharray="8,4" opacity="0.4">
                <animate attributeName="r" values="20;25;20" dur="6s" repeatCount="indefinite"/>
              </circle>
              <text x="620" y="255" textAnchor="middle" fontSize="20" fill="#ffd700" opacity="0.6">🔒</text>
              <text x="620" y="280" textAnchor="middle" fontSize="9" fill="#1f2937" opacity="0.5">메이크업</text>
            </g>
            
            <g className="future-building" style={{ cursor: 'pointer', opacity: 0.3 }}>
              <circle cx="680" cy="250" r="20" fill="none" stroke="#ffd700" strokeWidth="2" strokeDasharray="8,4" opacity="0.4">
                <animate attributeName="r" values="20;25;20" dur="6.5s" repeatCount="indefinite"/>
              </circle>
              <text x="680" y="255" textAnchor="middle" fontSize="20" fill="#ffd700" opacity="0.6">🔒</text>
              <text x="680" y="280" textAnchor="middle" fontSize="9" fill="#1f2937" opacity="0.5">스킨케어</text>
            </g>
            
            {/* 클릭 가능한 영역들 */}
            <g className="clickable-areas">
              {/* 유튜브 채널 클릭 영역 */}
              <rect x="150" y="150" width="200" height="60" fill="transparent" style={{ cursor: 'pointer' }} 
                    onClick={() => window.open('https://youtube.com/@ai_mentor_jay', '_blank')}/>
              
              {/* 인스타그램 클릭 영역 */}
              <rect x="650" y="150" width="200" height="60" fill="transparent" style={{ cursor: 'pointer' }} 
                    onClick={() => window.open('https://instagram.com/ai_mentor_jay', '_blank')}/>
              
              {/* 강의 플랫폼 클릭 영역 */}
              <rect x="300" y="400" width="400" height="80" fill="transparent" style={{ cursor: 'pointer' }} 
                    onClick={() => window.location.href = '/#courses'}/>
              
              {/* 중앙 AI 멘토 제이 클릭 영역 */}
              <circle cx="500" cy="250" r="80" fill="transparent" style={{ cursor: 'pointer' }} 
                      onClick={() => window.location.href = '/ceo'}/>
            </g>
          </svg>
        </div>
        </div>

      {/* 하단 정보 패널 */}
        <div style={{
        width: '100%',
        maxWidth: '100vw',
        margin: '20px 0 0 0',
        padding: '0 20px'
      }}>
             <div style={{
                 display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {/* AI 멘토 제이 상세 정보 */}
           <div style={{
             flex: '1',
             maxWidth: '800px',
             background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.98), rgba(255, 255, 255, 0.95))',
             borderRadius: '20px',
             padding: '30px',
             backdropFilter: 'blur(20px)',
             boxShadow: '0 10px 30px rgba(14, 165, 233, 0.1)',
             border: '1px solid rgba(14, 165, 233, 0.2)'
           }}>
             <h4 style={{ 
               margin: '0 0 20px 0', 
               color: '#1f2937',
               display: 'flex',
               alignItems: 'center',
               gap: '12px',
               fontSize: '1.5rem',
               fontWeight: '600',
               justifyContent: 'center'
             }}>
               <span style={{ fontSize: '32px' }}>👑</span>
               AI 멘토 제이 (정원석) - 디지털 건물주
             </h4>
            
                    <div style={{
               display: 'grid', 
               gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
               gap: '20px',
               marginBottom: '20px'
             }}>
               <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                 <div style={{ fontSize: '24px', color: '#ff0000', marginBottom: '8px' }}>📺</div>
                 <div style={{ fontWeight: '600', color: '#1f2937' }}>유튜브 채널</div>
                 <div style={{ color: '#6b7280', fontSize: '14px' }}>구독자 1,795+명</div>
                    </div>
                    
               <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                 <div style={{ fontSize: '24px', color: '#E4405F', marginBottom: '8px' }}>📱</div>
                 <div style={{ fontWeight: '600', color: '#1f2937' }}>인스타그램</div>
                 <div style={{ color: '#6b7280', fontSize: '14px' }}>@ai_mentor_jay</div>
                       </div>
              
               <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                 <div style={{ fontSize: '24px', color: '#10b981', marginBottom: '8px' }}>🏗️</div>
                 <div style={{ fontWeight: '600', color: '#1f2937' }}>온라인 강의</div>
                 <div style={{ color: '#6b7280', fontSize: '14px' }}>4개 강의 운영</div>
             </div>
                     </div>
                    
           <div style={{
               background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', 
               color: 'white',
               padding: '20px', 
               borderRadius: '15px',
               textAlign: 'center'
             }}>
               <h5 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>🚀 AI 시대의 개척자</h5>
               <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                 AI 교육, 비즈니스, 코딩 분야에서 1,795명 이상의 디지털 시민들과 함께 미래를 만들어가고 있습니다.
               </p>
                    </div>
          </div>
        </div>
      </div>

       
       <style>
         {`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes shimmerText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(14, 165, 233, 0.3), 
                        0 0 40px rgba(14, 165, 233, 0.2), 
                        0 0 60px rgba(14, 165, 233, 0.1); 
          }
          50% { 
            box-shadow: 0 0 30px rgba(14, 165, 233, 0.6), 
                        0 0 60px rgba(14, 165, 233, 0.4), 
                        0 0 90px rgba(14, 165, 233, 0.2); 
          }
        }
         
         @keyframes orbit {
           from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
           to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
         }
         
         @keyframes twinkle {
           0%, 100% { opacity: 0.3; }
           50% { opacity: 1; }
         }
         
         @keyframes cosmic-drift {
           0% { transform: translateY(0px) rotate(0deg); }
           33% { transform: translateY(-10px) rotate(120deg); }
           66% { transform: translateY(5px) rotate(240deg); }
           100% { transform: translateY(0px) rotate(360deg); }
         }
         `}
       </style>
      </div>
      </div>
    </div>
  );
};

export default AICityMapPage;