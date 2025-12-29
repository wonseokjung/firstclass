import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Youtube, Mail } from 'lucide-react';

const EnglishLandingPage: React.FC = () => {
    const navigate = useNavigate();

    const goToKoreanSite = () => {
        navigate('/');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #ffffff 0%, #1e3a5f 50%, #0f2744 100%)',
            color: '#0d1b2a',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center'
        }}>
            {/* Logo */}
            <img
                src={`${process.env.PUBLIC_URL}/images/logo.jpeg`}
                alt="AI City Builders"
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '3px solid #ffd60a',
                    marginBottom: '32px',
                    boxShadow: '0 8px 30px rgba(251, 191, 36, 0.3)'
                }}
            />

            {/* Badge */}
            <div style={{
                display: 'inline-block',
                background: 'rgba(251, 191, 36, 0.2)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                padding: '10px 24px',
                borderRadius: '25px',
                marginBottom: '24px',
                fontSize: '1rem',
                color: '#ffd60a',
                fontWeight: '600'
            }}>
                🚧 Coming Soon
            </div>

            {/* Title */}
            <h1 style={{
                fontSize: '3rem',
                fontWeight: '800',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #ffffff, #ffd60a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                AI City Builders
            </h1>

            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#ffd60a',
                marginBottom: '24px'
            }}>
                English Version
            </h2>

            {/* Description */}
            <p style={{
                fontSize: '1.2rem',
                color: 'rgba(255,255,255,0.8)',
                maxWidth: '600px',
                lineHeight: '1.8',
                marginBottom: '40px'
            }}>
                We're preparing our English courses for the global audience. 
                <br /><br />
                Learn how to create AI-powered content and build passive income streams.
                <br />
                <strong style={{ color: '#ffd60a' }}>No coding experience required.</strong>
            </p>

            {/* What's Coming */}
            <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '40px',
                maxWidth: '500px',
                width: '100%'
            }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>
                    📚 Courses Coming Soon
                </h3>
                <div style={{ textAlign: 'left' }}>
                    {[
                        { title: 'AI Income Blueprint', status: 'Coming Q1 2025' },
                        { title: 'AI Agent Masterclass', status: 'Coming Q1 2025' },
                        { title: 'Vibe Coding', status: 'Coming Q2 2025' }
                    ].map((course, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 0',
                            borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                        }}>
                            <div style={{ fontWeight: '600' }}>{course.title}</div>
                            <div style={{ fontSize: '0.85rem', color: '#ffd60a' }}>
                                {course.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={goToKoreanSite}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #ffd60a, #e5c100)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 8px 30px rgba(251, 191, 36, 0.3)'
                    }}
                >
                    <ArrowLeft size={18} />
                    🇰🇷 한국어 사이트 보기
                </button>

                <button
                    onClick={() => window.open('https://www.youtube.com/@CONNECT-AI-LAB', '_blank')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#dc2626',
                        border: 'none',
                        color: '#ffffff',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    <Youtube size={18} />
                    Watch on YouTube
                </button>
            </div>

            {/* Contact */}
            <div style={{
                marginTop: '60px',
                padding: '24px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                maxWidth: '400px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '12px'
                }}>
                    <Mail size={18} color="#ffd60a" />
                    <span style={{ fontWeight: '600' }}>Get Notified When We Launch</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                    Contact us: <a href="mailto:jay@connexionai.kr" style={{ color: '#ffd60a' }}>jay@connexionai.kr</a>
                </p>
            </div>

            {/* Footer */}
            <footer style={{
                marginTop: '60px',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.9rem'
            }}>
                <p>© 2025 Connexion AI. All rights reserved.</p>
                <p style={{ marginTop: '8px' }}>
                    🌍 Based in Seoul, South Korea
                </p>
            </footer>
        </div>
    );
};

export default EnglishLandingPage;
