import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import NavigationBar from '../common/NavigationBar';

interface ContactPageProps {
  onBack: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // mailto: 링크로 이메일 클라이언트 열기
    const subject = encodeURIComponent(`[AI City Builders 문의] ${formData.subject}`);
    const body = encodeURIComponent(
      `이름: ${formData.name}\n` +
      `이메일: ${formData.email}\n` +
      `문의 유형: ${formData.subject}\n\n` +
      `문의 내용:\n${formData.message}`
    );
    
    const mailtoLink = `mailto:jay@connexionai.kr?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    // UI 피드백
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // 3초 후 성공 메시지 숨김
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <NavigationBar onBack={onBack} breadcrumbText="고객센터" />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 20px'
      }}>
        {/* 헤더 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '900',
            color: '#1f2937',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            고객센터
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            궁금하신 점이 있으시면 언제든지 문의해주세요.<br />
            최선을 다해 도와드리겠습니다.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* 연락처 정보 카드들 */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <Mail size={28} color="white" />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '10px'
            }}>
              이메일
            </h3>
            <a href="mailto:jay@connexionai.kr" style={{
              fontSize: '1rem',
              color: '#0ea5e9',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              jay@connexionai.kr
            </a>
            <p style={{
              fontSize: '0.9rem',
              color: '#64748b',
              marginTop: '10px',
              margin: '10px 0 0 0'
            }}>
              영업일 기준 24시간 이내 답변
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <MessageSquare size={28} color="white" />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '10px'
            }}>
              수강생 커뮤니티
            </h3>
            <a href="/community" style={{
              fontSize: '1rem',
              color: '#10b981',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              커뮤니티 바로가기
            </a>
            <p style={{
              fontSize: '0.9rem',
              color: '#64748b',
              marginTop: '10px',
              margin: '10px 0 0 0'
            }}>
              수강생 전용 게시판
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <MapPin size={28} color="white" />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '10px'
            }}>
              사업자 정보
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#64748b',
              lineHeight: '1.6',
              margin: 0
            }}>
              커넥젼에이아이<br />
              대표: 정원석<br />
              사업자번호: 887-55-00386
            </p>
          </div>
        </div>

        {/* 문의 폼 */}
        <div style={{
          background: 'white',
          padding: 'clamp(30px, 5vw, 50px)',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            문의하기
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#64748b',
            marginBottom: '25px'
          }}>
            아래 양식을 작성해주시면 빠르게 답변드리겠습니다
          </p>

          {/* 중요 안내 메시지 */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '2px solid #f59e0b',
            borderRadius: '12px',
            padding: 'clamp(18px, 3vw, 25px)',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.15)'
          }}>
            <AlertCircle size={24} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{
                color: '#92400e',
                margin: 0,
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                fontWeight: '700',
                lineHeight: '1.6',
                marginBottom: '8px'
              }}>
                ⚠️ 중요 안내
              </p>
              <p style={{
                color: '#92400e',
                margin: 0,
                fontSize: 'clamp(0.9rem, 1.9vw, 1rem)',
                lineHeight: '1.7'
              }}>
                본 문의는 <strong>AI City Builders 수강 관련 문의</strong>에만 사용해 주시기 바랍니다.<br />
                수강과 무관한 문의는 답변이 어려울 수 있는 점 양해 부탁드립니다. 🙏
              </p>
            </div>
          </div>

          {isSubmitted && (
            <div style={{
              background: '#d1fae5',
              border: '1px solid #10b981',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle size={24} color="#10b981" />
              <p style={{
                color: '#065f46',
                margin: 0,
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                문의가 성공적으로 접수되었습니다! 곧 답변드리겠습니다.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1f2937',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                이름 *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1f2937',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                이메일 *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1f2937',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                문의 유형 *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="">선택해주세요</option>
                <option value="결제 문의">결제 문의</option>
                <option value="수강 문의">수강 문의</option>
                <option value="기술 지원">기술 지원</option>
                <option value="환불 문의">환불 문의</option>
                <option value="기타 문의">기타 문의</option>
              </select>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#1f2937',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                문의 내용 *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Send size={20} />
              {isSubmitting ? '전송 중...' : '문의하기'}
            </button>
          </form>
        </div>

        {/* FAQ 안내 */}
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '15px'
          }}>
            자주 묻는 질문
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '20px',
            lineHeight: '1.6'
          }}>
            궁금하신 내용이 자주 묻는 질문에 있을 수 있습니다
          </p>
          <button
            onClick={() => window.location.href = '/faq'}
            style={{
              padding: '12px 30px',
              background: 'white',
              color: '#0ea5e9',
              border: '2px solid #0ea5e9',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#0ea5e9';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#0ea5e9';
            }}
          >
            FAQ 보러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

