import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Sparkles, Calendar, Play } from 'lucide-react';

const MonthlyProjectSection: React.FC = () => {
    const navigate = useNavigate();

    // 2026년 1월 프로젝트
    const project = {
        month: '1월',
        year: '2026',
        theme: '캐릭터 기반 콘텐츠 만들기',
        description: '나만의 캐릭터로 유튜브 콘텐츠를 만들어보세요!',
        courses: [
            {
                course: 'AI 건물주',
                title: '캐릭터 이미지 생성',
                day: '화',
                time: '밤 8시',
                weeks: ['실제 인물', '3D 만화', '동물', '귀엽고 심플'],
                color: '#3b82f6',
                path: '/ai-building-course'
            },
            {
                course: 'AI 에이전트 비기너',
                title: '나만의 에이전트 팀 구축',
                day: '수',
                time: '밤 8시',
                weeks: ['기획팀', '디자인팀', '개발팀', '마케팅팀'],
                color: '#ffd60a',
                path: '/chatgpt-agent-beginner'
            },
            {
                course: '바이브코딩',
                title: '자동화 툴 직접 개발',
                day: '목',
                time: '밤 8시',
                weeks: ['설계', '개발', '테스트', '배포'],
                color: '#10b981',
                path: '/vibe-coding'
            },
            {
                course: '칼퇴 치트키',
                title: '업무 자동화 → AI 1인 기업',
                day: '금',
                time: '밤 8시',
                weeks: ['2월', '오픈', '예정', '🚀'],
                color: '#e5c100',
                path: '/solo-business',
                comingSoon: true
            },
        ]
    };

    return (
        <section style={{
            background: 'linear-gradient(180deg, #0a0e1a 0%, #111827 50%, #0a0e1a 100%)',
            padding: 'clamp(40px, 6vw, 70px) clamp(15px, 4vw, 30px)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* 배경 장식 */}
            <div style={{
                position: 'absolute',
                top: '-100px',
                left: '-100px',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-100px',
                right: '-100px',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

                {/* 헤더 뱃지 */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.1))',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    marginBottom: '25px',
                    border: '2px solid rgba(255,215,0,0.4)',
                    boxShadow: '0 4px 20px rgba(255,215,0,0.2)'
                }}>
                    <Target size={22} color="#ffd60a" />
                    <span style={{
                        color: '#ffd60a',
                        fontWeight: '800',
                        fontSize: '1rem',
                        letterSpacing: '0.5px'
                    }}>
                        {project.year}년 {project.month} 프로젝트
                    </span>
                    <Sparkles size={18} color="#ffd60a" />
                </div>

                {/* 메인 테마 */}
                <h3 style={{
                    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, #ffffff 0%, #ffd60a 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin: '0 0 15px 0',
                    lineHeight: 1.2
                }}>
                    🎬 {project.theme}
                </h3>

                <p style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                    marginBottom: '15px',
                    fontWeight: '500'
                }}>
                    {project.description}
                </p>

                <p style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.9rem',
                    marginBottom: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    <Calendar size={16} />
                    기초 강의 10개 + 매주 라이브 (1달간 다시보기 가능)
                </p>

                {/* 강의별 카드 - 개선된 디자인 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                    gap: 'clamp(15px, 3vw, 25px)',
                    marginBottom: '35px'
                }}>
                    {project.courses.map((item: any, idx) => (
                        <div
                            key={idx}
                            onClick={() => !item.comingSoon && navigate(item.path)}
                            style={{
                                background: item.comingSoon
                                    ? 'linear-gradient(145deg, rgba(229,193,0,0.1), rgba(229,193,0,0.03))'
                                    : 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                                border: `2px solid ${item.color}40`,
                                borderRadius: '16px',
                                padding: 'clamp(18px, 3vw, 24px)',
                                textAlign: 'left',
                                cursor: item.comingSoon ? 'default' : 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                opacity: item.comingSoon ? 0.85 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!item.comingSoon) {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = `0 10px 30px ${item.color}30`;
                                    e.currentTarget.style.borderColor = item.color;
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = `${item.color}40`;
                            }}
                        >
                            {/* Coming Soon 뱃지 */}
                            {item.comingSoon && (
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'linear-gradient(135deg, #e5c100, #d97706)',
                                    color: '#000',
                                    fontSize: '0.65rem',
                                    fontWeight: '800',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 10px rgba(229,193,0,0.4)'
                                }}>
                                    2월 OPEN
                                </div>
                            )}
                            {/* 강의명 헤더 */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '12px'
                            }}>
                                <span style={{
                                    background: item.color,
                                    color: idx === 1 ? '#000' : '#fff',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    padding: '5px 12px',
                                    borderRadius: '20px'
                                }}>
                                    {item.course}
                                </span>
                                <span style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    매주 {item.day} {item.time}
                                </span>
                            </div>

                            {/* 제목 */}
                            <h4 style={{
                                color: '#ffffff',
                                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                                fontWeight: '700',
                                margin: '0 0 15px 0',
                                lineHeight: 1.3
                            }}>
                                {item.title}
                            </h4>

                            {/* 주차별 내용 */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '6px'
                            }}>
                                {item.weeks.map((week: string, wIdx: number) => (
                                    <div
                                        key={wIdx}
                                        style={{
                                            background: `${item.color}15`,
                                            color: 'rgba(255,255,255,0.85)',
                                            fontSize: '0.75rem',
                                            padding: '6px 10px',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}
                                    >
                                        <span style={{
                                            color: item.color,
                                            fontWeight: '700',
                                            fontSize: '0.7rem'
                                        }}>
                                            {wIdx + 1}주
                                        </span>
                                        {week}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA 버튼 */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '15px',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={() => navigate('/live')}
                        style={{
                            background: 'linear-gradient(135deg, #ffd60a, #f59e0b)',
                            border: 'none',
                            color: '#1a1a2e',
                            padding: '16px 35px',
                            borderRadius: '14px',
                            fontSize: '1rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            boxShadow: '0 6px 25px rgba(255,215,0,0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 35px rgba(255,215,0,0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 6px 25px rgba(255,215,0,0.35)';
                        }}
                    >
                        <Play size={18} fill="#1a1a2e" />
                        라이브 일정 보기
                    </button>
                </div>

                {/* 하단 안내 */}
                <p style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.8rem',
                    marginTop: '25px'
                }}>
                    💡 라이브 참석 못해도 1달간 다시보기 제공 | 3개월 수강권 95,000원
                </p>
            </div>
        </section>
    );
};

export default MonthlyProjectSection;
