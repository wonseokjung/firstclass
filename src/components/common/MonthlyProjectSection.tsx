import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';

const MonthlyProjectSection: React.FC = () => {
    const navigate = useNavigate();

    // 2026년 1월 프로젝트
    const project = {
        month: '1월',
        theme: '캐릭터 기반 콘텐츠 만들기',
        courses: [
            {
                course: 'AI 건물주',
                title: '캐릭터 이미지 생성',
                day: '화',
                weeks: ['인물', '3D 만화', '동물', '귀엽고 심플']
            },
            {
                course: 'AI 에이전트 비기너',
                title: '캐릭터 영상 자동화 (Google OPAL)',
                day: '수',
                weeks: ['인물', '3D 만화', '동물', '귀엽고 심플']
            },
            {
                course: '바이브코딩',
                title: '캐릭터 영상 자동화 (Antigravity)',
                day: '목',
                weeks: ['인물', '3D 만화', '동물', '귀엽고 심플']
            },
        ]
    };

    return (
        <section style={{
            background: 'linear-gradient(180deg, #0d1527 0%, #1a1f2e 100%)',
            padding: 'clamp(30px, 5vw, 50px) clamp(15px, 4vw, 30px)',
            borderTop: '1px solid rgba(255,215,0,0.2)',
            borderBottom: '1px solid rgba(255,215,0,0.2)'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>

                {/* 헤더 */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255,215,0,0.15)',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    marginBottom: '20px',
                    border: '1px solid rgba(255,215,0,0.3)'
                }}>
                    <Target size={20} color="#ffd60a" />
                    <span style={{
                        color: '#ffd60a',
                        fontWeight: '700',
                        fontSize: '0.95rem'
                    }}>
                        2026년 {project.month} 프로젝트
                    </span>
                </div>

                {/* 테마 */}
                <h3 style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    fontWeight: '800',
                    color: '#ffffff',
                    margin: '0 0 10px 0'
                }}>
                    🎬 {project.theme}
                </h3>

                <p style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.95rem',
                    marginBottom: '30px'
                }}>
                    기초 강의 + 매주 라이브 프로젝트
                </p>

                {/* 강의별 카드 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    gap: 'clamp(10px, 3vw, 20px)',
                    flexWrap: 'wrap',
                    marginBottom: '25px'
                }}>
                    {project.courses.map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                padding: 'clamp(12px, 2.5vw, 16px)',
                                minWidth: 'clamp(140px, 28vw, 180px)',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{
                                color: '#ffd60a',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                marginBottom: '4px'
                            }}>
                                {item.course} ({item.day})
                            </div>
                            <div style={{
                                color: '#ffffff',
                                fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                                fontWeight: '600',
                                lineHeight: 1.3,
                                marginBottom: item.weeks.length > 0 ? '8px' : '0'
                            }}>
                                {item.title}
                            </div>
                            {item.weeks.length > 0 && (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '4px',
                                    justifyContent: 'center'
                                }}>
                                    {item.weeks.map((week, wIdx) => (
                                        <span
                                            key={wIdx}
                                            style={{
                                                background: 'rgba(255,215,0,0.15)',
                                                color: 'rgba(255,255,255,0.7)',
                                                fontSize: '0.65rem',
                                                padding: '2px 6px',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            {wIdx + 1}주: {week}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <button
                    onClick={() => navigate('/live')}
                    style={{
                        background: 'linear-gradient(135deg, #ffd60a, #f59e0b)',
                        border: 'none',
                        color: '#1a1a2e',
                        padding: '14px 30px',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(255,215,0,0.3)'
                    }}
                >
                    📅 자세히 보기
                </button>
            </div>
        </section>
    );
};

export default MonthlyProjectSection;
