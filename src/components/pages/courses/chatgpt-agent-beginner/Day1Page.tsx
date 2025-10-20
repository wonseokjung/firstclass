import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, FileText, Award } from 'lucide-react';

interface Day1PageProps {
  onBack: () => void;
}

const Day1Page: React.FC<Day1PageProps> = ({ onBack }) => {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [currentVideo, setCurrentVideo] = useState<string>('');

  const lessonData = {
    day: 1,
    title: "AI 에이전트의 세계에 오신 것을 환영합니다",
    duration: "60분",
    description: "AI 에이전트의 기본 개념을 이해하고, AgentKit을 소개받아 첫 AI 에이전트를 만들어봅니다.",
    objectives: [
      "AI 에이전트와 ChatGPT의 차이점 이해하기",
      "AgentKit의 기본 개념과 구조 파악하기",
      "실제로 동작하는 첫 AI 에이전트 만들기"
    ],
    sections: [
      {
        id: 'theory-1',
        type: 'theory',
        title: '이론 1: AI 에이전트란 무엇인가?',
        duration: '15분',
        videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_1', // 실제 비디오 URL로 교체
        content: `
          <h3>AI 에이전트 vs ChatGPT</h3>
          <p>ChatGPT는 대화형 AI지만, AI 에이전트는 자율적으로 작업을 수행할 수 있는 지능형 시스템입니다.</p>
          <ul>
            <li><strong>ChatGPT:</strong> 질문에 답변, 대화 생성</li>
            <li><strong>AI Agent:</strong> 목표 설정 → 계획 수립 → 실행 → 결과 확인</li>
          </ul>
          
          <h3>AI 에이전트의 핵심 특징</h3>
          <ul>
            <li>🎯 <strong>자율성:</strong> 스스로 판단하고 행동</li>
            <li>🔄 <strong>반응성:</strong> 환경 변화에 대응</li>
            <li>🎬 <strong>선제성:</strong> 목표 달성을 위해 먼저 행동</li>
            <li>🤝 <strong>사회성:</strong> 다른 에이전트나 사용자와 협력</li>
          </ul>
        `
      },
      {
        id: 'theory-2',
        type: 'theory',
        title: '이론 2: AgentKit 소개 및 기본 개념',
        duration: '15분',
        videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_2',
        content: `
          <h3>AgentKit이란?</h3>
          <p>OpenAI에서 제공하는 노코드 AI 에이전트 개발 플랫폼입니다.</p>
          
          <h3>AgentKit의 장점</h3>
          <ul>
            <li>💻 코딩 없이 AI 에이전트 개발 가능</li>
            <li>🎨 직관적인 비주얼 인터페이스</li>
            <li>🚀 빠른 프로토타이핑과 배포</li>
            <li>🔧 다양한 도구와 통합 지원</li>
          </ul>
          
          <h3>AgentKit으로 할 수 있는 것들</h3>
          <ul>
            <li>고객 응대 챗봇</li>
            <li>콘텐츠 생성 자동화</li>
            <li>데이터 분석 및 리포트 생성</li>
            <li>업무 프로세스 자동화</li>
          </ul>
        `
      },
      {
        id: 'practice-1',
        type: 'practice',
        title: '실습 1: OpenAI 계정 만들기',
        duration: '10분',
        videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_3',
        content: `
          <h3>Step 1: OpenAI 회원가입</h3>
          <ol>
            <li>OpenAI 웹사이트 접속: <a href="https://platform.openai.com" target="_blank">platform.openai.com</a></li>
            <li>"Sign up" 버튼 클릭</li>
            <li>이메일 또는 Google 계정으로 가입</li>
            <li>이메일 인증 완료</li>
          </ol>
          
          <h3>Step 2: API 키 발급</h3>
          <ol>
            <li>대시보드에서 "API Keys" 메뉴 선택</li>
            <li>"Create new secret key" 클릭</li>
            <li>키 이름 입력 (예: "AgentKit-Practice")</li>
            <li>생성된 키를 안전하게 복사하여 저장</li>
          </ol>
          
          <div class="warning-box">
            <strong>⚠️ 주의:</strong> API 키는 한 번만 표시됩니다. 반드시 안전한 곳에 저장하세요!
          </div>
        `
      },
      {
        id: 'practice-2',
        type: 'practice',
        title: '실습 2: AgentKit Builder 둘러보기',
        duration: '10분',
        videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_4',
        content: `
          <h3>AgentKit Builder 인터페이스</h3>
          <p>AgentKit Builder는 드래그 앤 드롭 방식의 비주얼 에디터입니다.</p>
          
          <h3>주요 구성 요소</h3>
          <ul>
            <li><strong>노드 패널:</strong> 사용 가능한 노드들의 목록</li>
            <li><strong>캔버스:</strong> 워크플로우를 구성하는 작업 공간</li>
            <li><strong>속성 패널:</strong> 선택한 노드의 설정</li>
            <li><strong>테스트 패널:</strong> 에이전트를 실시간으로 테스트</li>
          </ul>
          
          <h3>기본 노드 종류</h3>
          <ul>
            <li>🟢 <strong>Start:</strong> 에이전트의 시작점</li>
            <li>🤖 <strong>Agent:</strong> AI 처리 노드</li>
            <li>🔴 <strong>End:</strong> 에이전트의 종료점</li>
          </ul>
        `
      },
      {
        id: 'practice-3',
        type: 'practice',
        title: '실습 3: 첫 AI 에이전트 만들기 (Hello World Agent)',
        duration: '10분',
        videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_5',
        content: `
          <h3>Hello World Agent 만들기</h3>
          <p>가장 간단한 AI 에이전트를 만들어봅시다.</p>
          
          <h3>Step 1: 새 프로젝트 생성</h3>
          <ol>
            <li>AgentKit Builder에서 "New Project" 클릭</li>
            <li>프로젝트 이름: "Hello World Agent"</li>
            <li>빈 캔버스가 나타남</li>
          </ol>
          
          <h3>Step 2: 노드 배치</h3>
          <ol>
            <li><strong>Start 노드:</strong> 자동으로 생성됨</li>
            <li><strong>Agent 노드:</strong> 드래그하여 캔버스에 추가</li>
            <li><strong>End 노드:</strong> 드래그하여 캔버스에 추가</li>
          </ol>
          
          <h3>Step 3: 노드 연결</h3>
          <ol>
            <li>Start 노드의 출력 포인트를 Agent 노드의 입력으로 연결</li>
            <li>Agent 노드의 출력을 End 노드의 입력으로 연결</li>
          </ol>
          
          <h3>Step 4: Agent 노드 설정</h3>
          <pre><code>
System Prompt:
"당신은 친근한 AI 어시스턴트입니다. 
사용자에게 인사하고 어떤 도움이 필요한지 물어보세요."

User Message:
"안녕하세요!"
          </code></pre>
          
          <h3>Step 5: 테스트 및 배포</h3>
          <ol>
            <li>"Test" 버튼 클릭하여 실행</li>
            <li>결과 확인</li>
            <li>"Deploy" 버튼으로 배포</li>
          </ol>
          
          <div class="success-box">
            <strong>🎉 축하합니다!</strong> 첫 AI 에이전트를 성공적으로 만들었습니다!
          </div>
        `
      }
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'AI 에이전트와 ChatGPT의 가장 큰 차이점은 무엇인가요?',
          options: [
            'AI 에이전트는 더 빠르다',
            'AI 에이전트는 자율적으로 작업을 수행할 수 있다',
            'ChatGPT는 유료이고 AI 에이전트는 무료이다',
            'AI 에이전트는 코딩이 필요없다'
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: 'AgentKit Builder의 기본 노드 3가지는?',
          options: [
            'Input, Process, Output',
            'Begin, Middle, End',
            'Start, Agent, End',
            'Open, Run, Close'
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          question: 'OpenAI API 키를 발급받을 때 주의할 점은?',
          options: [
            'API 키는 언제든지 다시 확인할 수 있다',
            'API 키는 한 번만 표시되므로 안전하게 저장해야 한다',
            'API 키는 자동으로 저장된다',
            'API 키는 공유해도 된다'
          ],
          correctAnswer: 1
        }
      ]
    },
    resources: [
      {
        title: 'OpenAI Platform 문서',
        url: 'https://platform.openai.com/docs',
        type: 'documentation'
      },
      {
        title: 'AgentKit 시작 가이드',
        url: '#',
        type: 'guide'
      },
      {
        title: 'Day 1 실습 자료',
        url: '#',
        type: 'download'
      }
    ]
  };

  const toggleSection = (sectionId: string) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId);
    } else {
      newCompleted.add(sectionId);
    }
    setCompletedSections(newCompleted);
  };

  const progressPercentage = (completedSections.size / lessonData.sections.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
      paddingBottom: '60px'
    }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        color: 'white',
        padding: '30px 20px',
        boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ArrowLeft size={20} />
            강의 목록으로
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              Day {lessonData.day}
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              ⏱️ {lessonData.duration}
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '800',
            marginBottom: '15px',
            lineHeight: '1.3'
          }}>
            {lessonData.title}
          </h1>

          <p style={{
            fontSize: '1.1rem',
            opacity: '0.95',
            marginBottom: '25px',
            lineHeight: '1.6'
          }}>
            {lessonData.description}
          </p>

          {/* 진행률 바 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>학습 진행률</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{Math.round(progressPercentage)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'white',
                borderRadius: '10px',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px'
      }}>
        {/* 학습 목표 */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          border: '2px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0ea5e9',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Award size={24} />
            학습 목표
          </h2>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {lessonData.objectives.map((objective, index) => (
              <li key={index} style={{
                padding: '12px 0',
                borderBottom: index < lessonData.objectives.length - 1 ? '1px solid #f1f5f9' : 'none',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '1.05rem',
                color: '#1f2937'
              }}>
                <span style={{ color: '#0ea5e9', fontWeight: '700' }}>✓</span>
                {objective}
              </li>
            ))}
          </ul>
        </div>

        {/* 강의 섹션들 */}
        {lessonData.sections.map((section, index) => (
          <div key={section.id} style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            border: completedSections.has(section.id) ? '2px solid #10b981' : '2px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    background: section.type === 'theory' ? '#dbeafe' : '#dcfce7',
                    color: section.type === 'theory' ? '#1e40af' : '#166534',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '700'
                  }}>
                    {section.type === 'theory' ? '📚 이론' : '💻 실습'}
                  </div>
                  <span style={{
                    color: '#64748b',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    ⏱️ {section.duration}
                  </span>
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '0'
                }}>
                  {section.title}
                </h3>
              </div>
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  background: completedSections.has(section.id) ? '#10b981' : '#e2e8f0',
                  color: completedSections.has(section.id) ? 'white' : '#64748b',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!completedSections.has(section.id)) {
                    e.currentTarget.style.background = '#cbd5e1';
                  }
                }}
                onMouseOut={(e) => {
                  if (!completedSections.has(section.id)) {
                    e.currentTarget.style.background = '#e2e8f0';
                  }
                }}
              >
                <CheckCircle size={18} />
                {completedSections.has(section.id) ? '완료됨' : '완료 표시'}
              </button>
            </div>

            {/* 비디오 플레이어 */}
            <div style={{
              marginBottom: '25px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#000',
              aspectRatio: '16/9'
            }}>
              <iframe
                width="100%"
                height="100%"
                src={section.videoUrl}
                title={section.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none' }}
              ></iframe>
            </div>

            {/* 강의 내용 */}
            <div 
              style={{
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: '#374151'
              }}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        ))}

        {/* 퀴즈 섹션 */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          border: '2px solid #fbbf24'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#92400e',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FileText size={24} />
            이해도 체크 퀴즈
          </h2>
          <p style={{
            color: '#78350f',
            marginBottom: '20px',
            fontSize: '1.05rem'
          }}>
            오늘 배운 내용을 복습해봅시다!
          </p>
          {lessonData.quiz.questions.map((q, index) => (
            <div key={q.id} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '15px'
            }}>
              <p style={{
                fontWeight: '700',
                marginBottom: '15px',
                color: '#1f2937',
                fontSize: '1.05rem'
              }}>
                Q{index + 1}. {q.question}
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {q.options.map((option, optIndex) => (
                  <label key={optIndex} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '2px solid transparent'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#e0f2fe';
                    e.currentTarget.style.borderColor = '#0ea5e9';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}>
                    <input type="radio" name={`question-${q.id}`} value={optIndex} />
                    <span style={{ fontSize: '1rem' }}>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 추가 자료 */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          border: '2px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0ea5e9',
            marginBottom: '20px'
          }}>
            📚 추가 학습 자료
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {lessonData.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '15px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: '#1f2937',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e2e8f0'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#e0f2fe';
                  e.currentTarget.style.borderColor = '#0ea5e9';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <FileText size={20} style={{ color: '#0ea5e9' }} />
                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{resource.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for content styling */}
      <style>{`
        .warning-box {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 15px;
          margin: 20px 0;
          border-radius: 8px;
        }
        
        .success-box {
          background: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 15px;
          margin: 20px 0;
          border-radius: 8px;
        }
        
        h3 {
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 25px;
          margin-bottom: 15px;
        }
        
        ul, ol {
          margin: 15px 0;
          padding-left: 25px;
        }
        
        li {
          margin: 8px 0;
          line-height: 1.6;
        }
        
        pre {
          background: #1f2937;
          color: #f8fafc;
          padding: 20px;
          border-radius: 10px;
          overflow-x: auto;
          margin: 20px 0;
        }
        
        code {
          font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
          font-size: 0.9rem;
        }
        
        a {
          color: #0ea5e9;
          text-decoration: underline;
        }
        
        a:hover {
          color: #0284c7;
        }
      `}</style>
    </div>
  );
};

export default Day1Page;

