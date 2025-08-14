import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Star, Clock, Award, CheckCircle, ArrowRight, MessageCircle, Target, Zap, Shield, Calendar, BookOpen } from 'lucide-react';
import NavigationBar from '../NavigationBar';

interface PersonalMentoringPageProps {
  onBack?: () => void;
}

interface Mentor {
  id: string;
  name: string;
  title: string;
  education: string[];
  experience: string[];
  specialties: string[];
  profileImage: string;
  rating: number;
  totalSessions: number;
  hourlyRate: number;
  bio: string;
  achievements: string[];
  availability: string[];
}

interface Package {
  id: string;
  name: string;
  sessions: number;
  duration: number;
  price: number;
  originalPrice?: number;
  features: string[];
  recommended: boolean;
  savings?: string;
}

const PersonalMentoringPage: React.FC<PersonalMentoringPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 임시 멘토 데이터 - 추후 Azure Table Storage에서 가져올 예정
  const mentors: Mentor[] = [
    {
      id: 'mentor-1',
      name: '정원석',
      title: 'AI 전문가 / 전 구글 엔지니어',
      education: ['뉴욕시립대 바루크 컴퓨터사이언스 학사', '일리노이 공과대학 AI 석사'],
      experience: ['구글 AI팀 5년', '삼성전자 AI연구소 3년', 'CLATHON 대표'],
      specialties: ['머신러닝', '딥러닝', 'ChatGPT 활용', '비즈니스 AI'],
      profileImage: '/images/mentor-jay.jpg',
      rating: 4.9,
      totalSessions: 500,
      hourlyRate: 150000,
      bio: '구글과 삼성에서 10년 이상 AI 개발 경험을 쌓았습니다. 복잡한 AI 개념을 실무에서 바로 활용할 수 있도록 쉽게 설명하는 것이 제 강점입니다.',
      achievements: ['Google AI Impact Award 수상', 'AI 특허 15건 보유', 'IEEE 논문 20편 게재'],
      availability: ['평일 저녁', '주말 오전', '주말 오후']
    },
    {
      id: 'mentor-2',
      name: '김AI',
      title: '크리에이티브 AI 전문가',
      education: ['서울대학교 디자인학부', 'MIT Media Lab 연구원'],
      experience: ['Adobe AI팀 4년', '네이버 웹툰 AI 개발 2년'],
      specialties: ['이미지 생성 AI', 'Midjourney', 'Stable Diffusion', '창작 AI'],
      profileImage: '/images/mentor-ai.jpg',
      rating: 4.8,
      totalSessions: 350,
      hourlyRate: 120000,
      bio: '디자인과 AI의 융합 분야에서 독특한 관점을 제공합니다. 창의적인 AI 활용법부터 상업적 적용까지 전 과정을 가이드합니다.',
      achievements: ['Adobe Design Award 수상', 'AI 아트 전시 10회', '크리에이터 10만 명 멘토링'],
      availability: ['평일 오후', '주말 종일']
    },
    {
      id: 'mentor-3',
      name: '박데이터',
      title: '데이터 사이언티스트 / 카카오',
      education: ['KAIST 전산학 박사', '스탠포드 교환학생'],
      experience: ['카카오 데이터팀 6년', '네이버 검색 알고리즘 3년'],
      specialties: ['데이터 분석', 'Python', '머신러닝 모델링', 'SQL'],
      profileImage: '/images/mentor-data.jpg',
      rating: 4.7,
      totalSessions: 280,
      hourlyRate: 100000,
      bio: '실무에서 바로 써먹을 수 있는 데이터 분석과 머신러닝을 가르칩니다. 이론보다는 프로젝트 중심의 실습을 선호합니다.',
      achievements: ['카카오 Tech Excellence Award', 'KDD 논문 게재', '데이터 분석 도서 저술'],
      availability: ['평일 저녁', '주말 오전']
    }
  ];

  const packages: Package[] = [
    {
      id: 'basic',
      name: '5회권',
      sessions: 5,
      duration: 50,
      price: 500000,
      originalPrice: 750000,
      features: [
        '5회 1:1 세션 (회당 50분)',
        '개인 맞춤 커리큘럼',
        '실시간 Q&A',
        '세션별 피드백',
        '학습 자료 제공',
        '2개월 수강 기간'
      ],
      recommended: false,
      savings: '25만원 절약'
    },
    {
      id: 'standard',
      name: '10회권',
      sessions: 10,
      duration: 50,
      price: 900000,
      originalPrice: 1200000,
      features: [
        '10회 1:1 세션 (회당 50분)',
        '개인 맞춤 커리큘럼',
        '실시간 Q&A',
        '세션별 상세 피드백',
        '학습 자료 + 실습 과제',
        '3개월 수강 기간',
        '중간 진도 점검',
        '포트폴리오 리뷰'
      ],
      recommended: true,
      savings: '30만원 절약'
    }
  ];

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('clathon_user_session');
    setIsLoggedIn(!!storedUserInfo);
  }, []);

  const handleConsultationRequest = (mentorId?: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    if (mentorId) {
      setSelectedMentor(mentorId);
    }
    
    // 임시로 알림 - 추후 실제 상담 신청 폼으로 연결
    alert('무료 상담 신청 기능이 곧 오픈됩니다! 현재는 베타 테스트 중입니다.');
  };

  const handlePackageSelect = (packageId: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    
    setSelectedPackage(packageId);
    const selectedPkg = packages.find(pkg => pkg.id === packageId);
    alert(`${selectedPkg?.name} 선택! 곧 결제 시스템이 연결됩니다.`);
  };

  return (
    <div className="masterclass-container">
      <NavigationBar 
        onBack={onBack}
        breadcrumbText="1:1 학습"
      />

      {/* 히어로 섹션 */}
      <section style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(207, 43, 74, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(207, 43, 74, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
            padding: '8px 16px',
            borderRadius: '20px',
            marginBottom: '20px',
            border: '1px solid rgba(207, 43, 74, 0.3)'
          }}>
            <Target size={16} color="#cf2b4a" />
            <span style={{ color: '#cf2b4a', fontSize: '14px', fontWeight: '600' }}>맞춤형 1:1 멘토링</span>
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ffffff 0%, #cf2b4a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            당신만을 위한<br />
            <span style={{ color: '#cf2b4a' }}>AI 전문가와 1:1</span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: '#cccccc',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            검증된 AI 전문가가 당신의 목표에 맞춘 개인 커리큘럼으로
            <br />단기간에 실무 역량을 확실하게 키워드립니다.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#cf2b4a', fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>1,000+</div>
              <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>성공 사례</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#cf2b4a', fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>4.9</div>
              <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>평균 만족도</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#cf2b4a', fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>100%</div>
              <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>검증된 멘토</div>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section style={{ padding: '80px 20px', background: '#000000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '60px',
            background: 'linear-gradient(135deg, #ffffff 0%, #cf2b4a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            왜 1:1 멘토링인가요?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Target size={28} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>100% 맞춤형</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                당신의 현재 수준, 목표, 선호하는 학습 방식에 완벽하게 맞춘 
                개인 커리큘럼으로 최단 시간에 목표 달성이 가능합니다.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Shield size={28} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>검증된 전문가</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                구글, 삼성, 카카오 등 글로벌 기업에서 실무 경험을 쌓은 
                검증된 AI 전문가들의 노하우를 직접 전수받을 수 있습니다.
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Zap size={28} color="white" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>빠른 성장</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                개인의 속도에 맞춘 집중 학습으로 그룹 수업 대비 3-5배 빠른 
                학습 속도를 경험하고 실무에서 바로 활용 가능한 스킬을 습득합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 멘토 소개 */}
      <section style={{ padding: '80px 20px', background: '#000000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #cf2b4a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            검증된 AI 멘토들
          </h2>
          
          <p style={{
            textAlign: 'center',
            color: '#cccccc',
            fontSize: '1.2rem',
            marginBottom: '60px'
          }}>
            글로벌 기업 경험과 검증된 실력을 갖춘 최고의 멘토들을 만나보세요
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {mentors.map((mentor) => (
              <div key={mentor.id} style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                borderRadius: '20px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(207, 43, 74, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '20px'
                  }}>
                    <User size={40} color="white" />
                  </div>
                  
                  <div>
                    <h3 style={{
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      {mentor.name}
                    </h3>
                    <p style={{
                      color: '#cf2b4a',
                      fontSize: '1rem',
                      marginBottom: '8px'
                    }}>
                      {mentor.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={16} color="#fbbf24" fill="#fbbf24" />
                        <span style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: '600' }}>
                          {mentor.rating}
                        </span>
                      </div>
                      <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                        ({mentor.totalSessions}회 세션)
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{
                  color: '#cccccc',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  {mentor.bio}
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '12px' }}>전문 분야</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {mentor.specialties.map((specialty, index) => (
                      <span key={index} style={{
                        background: 'rgba(207, 43, 74, 0.2)',
                        color: '#cf2b4a',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(207, 43, 74, 0.3)'
                      }}>
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '8px' }}>주요 경력</h4>
                  <ul style={{ margin: 0, paddingLeft: '16px', color: '#cccccc' }}>
                    {mentor.experience.slice(0, 2).map((exp, index) => (
                      <li key={index} style={{ marginBottom: '4px', fontSize: '0.9rem' }}>
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  padding: '16px',
                  background: 'rgba(207, 43, 74, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(207, 43, 74, 0.2)'
                }}>
                  <div>
                    <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>시간당 요금</div>
                    <div style={{ color: '#cf2b4a', fontSize: '1.3rem', fontWeight: '700' }}>
                      ₩{mentor.hourlyRate.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>가능 시간</div>
                    <div style={{ color: 'white', fontSize: '0.9rem' }}>
                      {mentor.availability.join(', ')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleConsultationRequest(mentor.id)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <MessageCircle size={20} />
                  무료 상담 신청
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 패키지 선택 */}
      <section style={{ padding: '80px 20px', background: '#000000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #cf2b4a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            멘토링 이용권
          </h2>
          
          <p style={{
            textAlign: 'center',
            color: '#cccccc',
            fontSize: '1.2rem',
            marginBottom: '60px'
          }}>
            목표에 맞는 이용권을 선택하고 전문가와 함께 성장하세요
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {packages.map((pkg) => (
              <div key={pkg.id} style={{
                background: pkg.recommended 
                  ? 'linear-gradient(135deg, rgba(207, 43, 74, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                borderRadius: '20px',
                padding: '40px',
                border: pkg.recommended 
                  ? '2px solid #cf2b4a'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                
                {pkg.recommended && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                    color: 'white',
                    padding: '6px 20px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    <Star size={16} style={{ marginRight: '4px', display: 'inline' }} />
                    추천
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h3 style={{
                    color: 'white',
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    {pkg.name}
                  </h3>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{
                      color: '#888',
                      fontSize: '1.2rem',
                      textDecoration: 'line-through',
                      marginRight: '8px'
                    }}>
                      ₩{pkg.originalPrice?.toLocaleString()}
                    </span>
                    <span style={{
                      color: '#cf2b4a',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {pkg.savings}
                    </span>
                  </div>
                  
                  <div style={{
                    color: '#cf2b4a',
                    fontSize: '3rem',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    ₩{pkg.price.toLocaleString()}
                  </div>
                  
                  <div style={{ color: '#cccccc', fontSize: '1rem' }}>
                    {pkg.sessions}회 세션 • {pkg.duration}분
                  </div>
                </div>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  marginBottom: '30px'
                }}>
                  {pkg.features.map((feature, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                      color: '#cccccc'
                    }}>
                      <CheckCircle size={16} color="#10B981" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePackageSelect(pkg.id)}
                  style={{
                    width: '100%',
                    background: pkg.recommended
                      ? 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    color: 'white',
                    border: pkg.recommended ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {pkg.name} 구매하기
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 학습 프로세스 */}
      <section style={{ padding: '80px 20px', background: '#000000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '60px',
            background: 'linear-gradient(135deg, #ffffff 0%, #cf2b4a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            학습 프로세스
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'white'
              }}>
                1
              </div>
              <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '12px' }}>무료 상담</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                목표와 현재 수준을 파악하고 최적의 멘토와 커리큘럼을 제안받으세요
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'white'
              }}>
                2
              </div>
              <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '12px' }}>맞춤 계획</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                개인 목표에 최적화된 커리큘럼과 학습 일정을 함께 수립합니다
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'white'
              }}>
                3
              </div>
              <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '12px' }}>집중 학습</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                1:1 라이브 세션으로 실시간 피드백을 받으며 집중적으로 학습합니다
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'white'
              }}>
                4
              </div>
              <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '12px' }}>실무 적용</h3>
              <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                실제 프로젝트를 통해 배운 내용을 실무에 바로 적용할 수 있게 됩니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #cf2b4a 0%, #ff4d6d 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '20px'
          }}>
            30분 무료 상담부터 시작하세요
          </h2>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.2rem',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            검증된 AI 전문가와 1:1로 상담받고<br />
            당신만의 성장 로드맵을 함께 그려보세요.
          </p>

          <button
            onClick={() => handleConsultationRequest()}
            style={{
              background: 'white',
              color: '#cf2b4a',
              border: 'none',
              padding: '18px 40px',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <MessageCircle size={24} />
            무료 상담 신청하기
            <ArrowRight size={20} />
          </button>

          <div style={{
            marginTop: '20px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem'
          }}>
            ✅ 30분 무료 상담 • ✅ 맞춤 커리큘럼 제안 • ✅ 100% 검증된 멘토
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonalMentoringPage;
