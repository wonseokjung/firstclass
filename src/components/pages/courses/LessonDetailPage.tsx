import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, BookOpen, Clock, CheckCircle, Image, Video, Download } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';

interface LessonDetailPageProps {
  onBack: () => void;
  lessonId: number;
  courseId: number;
}

// 강의 콘텐츠 섹션 타입 정의
interface ContentSection {
  id: string;
  type: 'video' | 'image' | 'gif' | 'text' | 'practice' | 'summary' | 'download';
  title: string;
  content?: string;
  mediaUrl?: string;
  placeholder?: string;
  editable?: boolean;
}

const LessonDetailPage: React.FC<LessonDetailPageProps> = ({ onBack, lessonId, courseId }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 예시 강의 데이터 (실제로는 props나 API에서 가져올 데이터)
  const lessonData = {
    id: lessonId,
    title: "ChatGPT 기초 - 효과적인 프롬프트 작성법",
    description: "ChatGPT와 효과적으로 소통하는 방법을 배웁니다. 프롬프트 엔지니어링의 기초부터 고급 기법까지 단계별로 학습하세요.",
    duration: "15분 30초",
    instructor: "AI 멘토 JAY",
    objectives: [
      "프롬프트의 구조와 원리 이해",
      "맥락을 제공하는 효과적인 방법",
      "역할 기반 프롬프트 작성",
      "단계별 사고 유도 기법"
    ]
  };

  // 콘텐츠 섹션들 - 사용자가 쉽게 편집할 수 있도록 구조화
  const [contentSections] = useState<ContentSection[]>([
    {
      id: 'intro-video',
      type: 'video',
      title: '📹 강의 소개 영상',
      mediaUrl: '', // 여기에 YouTube 링크나 비디오 파일 URL 입력
      placeholder: '여기에 강의 소개 영상 URL을 입력하세요 (YouTube, Vimeo 등)'
    },
    {
      id: 'main-content',
      type: 'text',
      title: '📝 강의 내용',
      content: `
## 1. 프롬프트란 무엇인가?

프롬프트(Prompt)는 AI에게 주는 명령어나 질문입니다. 좋은 프롬프트는 명확하고 구체적이며, 원하는 결과를 얻기 위한 충분한 맥락을 제공합니다.

### 기본 구조
- **역할**: "당신은 ~전문가입니다"
- **작업**: "~를 해주세요"
- **맥락**: "~상황에서"
- **형식**: "~형식으로 답변해주세요"

## 2. 효과적인 프롬프트 예시

**나쁜 예:**
"마케팅 전략을 알려줘"

**좋은 예:**
"당신은 10년 경력의 디지털 마케팅 전문가입니다. 스타트업 카페 브랜드의 온라인 마케팅 전략을 수립해주세요. 
- 타겟: 20-30대 직장인
- 예산: 월 500만원
- 목표: 브랜드 인지도 향상
- 형식: 3개월 단계별 실행 계획표"
      `,
      editable: true
    },
    {
      id: 'demo-gif',
      type: 'gif',
      title: '🎬 실습 데모 (GIF)',
      mediaUrl: '', // 여기에 GIF 파일 URL 입력
      placeholder: '실습 과정을 보여주는 GIF 이미지를 추가하세요'
    },
    {
      id: 'practice-section',
      type: 'practice',
      title: '💡 실습 과제',
      content: `
### 실습 1: 기본 프롬프트 작성
다음 상황에 맞는 프롬프트를 작성해보세요:

**상황:** 온라인 쇼핑몰의 고객 서비스 챗봇 개선
**요구사항:**
- 고객의 불만을 효과적으로 해결
- 친근하고 전문적인 톤앤매너
- 3단계 해결 과정 제안

**여러분의 프롬프트:**
[여기에 작성해보세요]

### 실습 2: 역할 기반 프롬프트
"당신은 ~전문가입니다"로 시작하는 프롬프트를 3개 작성해보세요.

1. [작성 공간]
2. [작성 공간]  
3. [작성 공간]
      `,
      editable: true
    },
    {
      id: 'reference-image',
      type: 'image',
      title: '📊 참고 자료',
      mediaUrl: '', // 여기에 이미지 URL 입력
      placeholder: '프롬프트 구조도나 참고 차트 이미지를 추가하세요'
    },
    {
      id: 'summary',
      type: 'summary',
      title: '📋 핵심 요약',
      content: `
## 🎯 오늘 배운 핵심 내용

1. **좋은 프롬프트의 4가지 요소**
   - 역할 (Role)
   - 작업 (Task) 
   - 맥락 (Context)
   - 형식 (Format)

2. **프롬프트 작성 팁**
   - 구체적이고 명확하게
   - 단계별로 요청하기
   - 예시와 함께 제공
   - 원하는 형식 명시

3. **다음 강의 예고**
   - 고급 프롬프트 기법
   - Chain of Thought (사고 연쇄)
   - Few-shot Learning 활용법
      `,
      editable: true
    },
    {
      id: 'downloads',
      type: 'download',
      title: '💾 다운로드 자료',
      content: `
### 📁 강의 자료 다운로드

- **프롬프트 템플릿 모음** (PDF)
- **실습 워크시트** (Notion 템플릿)
- **ChatGPT 활용 체크리스트** (PDF)
- **고급 프롬프트 예시집** (Excel)
      `,
      editable: true
    }
  ]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const markCompleted = () => {
    setIsCompleted(true);
    // 여기서 진도 저장 로직 추가
  };

  // 미디어 콘텐츠 렌더링 함수
  const renderMediaContent = (section: ContentSection) => {
    switch (section.type) {
      case 'video':
        return (
          <div style={{ 
            background: '#f8fafc',
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            {section.mediaUrl ? (
              <div style={{ 
                position: 'relative',
                width: '100%',
                height: '400px',
                background: '#000',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {/* 실제 비디오가 있을 때 */}
                <video
                  ref={videoRef}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                >
                  <source src={section.mediaUrl} type="video/mp4" />
                </video>
                
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  background: 'rgba(0,0,0,0.7)',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  color: 'white'
                }}>
                  <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={restart} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <RotateCcw size={16} />
                  </button>
                  <span style={{ fontSize: '14px' }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
              </div>
            ) : (
              <div>
                <Video size={48} color="#94a3b8" style={{ marginBottom: '15px' }} />
                <p style={{ color: '#64748b', fontSize: '16px', margin: '0 0 15px 0' }}>
                  {section.placeholder}
                </p>
                <div style={{
                  background: '#e2e8f0',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#475569',
                  fontFamily: 'monospace'
                }}>
                  지원 형식: MP4, WebM, YouTube 임베드 링크
                </div>
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div style={{ marginBottom: '20px' }}>
            {section.mediaUrl ? (
              <img 
                src={section.mediaUrl} 
                alt={section.title}
                style={{ 
                  width: '100%', 
                  maxHeight: '500px', 
                  objectFit: 'contain',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              />
            ) : (
              <div style={{ 
                background: '#f8fafc',
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '60px 40px',
                textAlign: 'center'
              }}>
                <Image size={48} color="#94a3b8" style={{ marginBottom: '15px' }} />
                <p style={{ color: '#64748b', fontSize: '16px', margin: '0 0 15px 0' }}>
                  {section.placeholder}
                </p>
                <div style={{
                  background: '#e2e8f0',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#475569',
                  fontFamily: 'monospace'
                }}>
                  지원 형식: JPG, PNG, SVG, WebP
                </div>
              </div>
            )}
          </div>
        );

      case 'gif':
        return (
          <div style={{ marginBottom: '20px' }}>
            {section.mediaUrl ? (
              <img 
                src={section.mediaUrl} 
                alt={section.title}
                style={{ 
                  width: '100%', 
                  maxHeight: '400px', 
                  objectFit: 'contain',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              />
            ) : (
              <div style={{ 
                background: '#f8fafc',
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '60px 40px',
                textAlign: 'center'
              }}>
                <Video size={48} color="#94a3b8" style={{ marginBottom: '15px' }} />
                <p style={{ color: '#64748b', fontSize: '16px', margin: '0 0 15px 0' }}>
                  {section.placeholder}
                </p>
                <div style={{
                  background: '#e2e8f0',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#475569',
                  fontFamily: 'monospace'
                }}>
                  지원 형식: GIF, APNG
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="masterclass-container">
      <NavigationBar 
        onBack={onBack}
        breadcrumbText={`${lessonData.title}`}
      />

      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: '40px 20px',
        background: '#ffffff'
      }}>
        {/* 강의 헤더 */}
        <div style={{ 
          marginBottom: '40px',
          padding: '30px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
            fontWeight: '700',
            marginBottom: '15px'
          }}>
            {lessonData.title}
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: '0.9',
            marginBottom: '20px',
            lineHeight: '1.6'
          }}>
            {lessonData.description}
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px',
            flexWrap: 'wrap',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} />
              <span>{lessonData.duration}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} />
              <span>{lessonData.instructor}</span>
            </div>
          </div>

          {/* 학습 목표 */}
          <div style={{ 
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '15px',
            padding: '20px',
            marginTop: '20px'
          }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>🎯 학습 목표</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '10px'
            }}>
              {lessonData.objectives.map((objective, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '0.95rem'
                }}>
                  <CheckCircle size={16} />
                  <span>{objective}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 콘텐츠 섹션들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {contentSections.map((section) => (
            <div 
              key={section.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}
            >
              <h2 style={{ 
                color: '#1f2937',
                fontSize: '1.4rem',
                fontWeight: '600',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {section.title}
                {section.editable && (
                  <span style={{ 
                    fontSize: '0.75rem',
                    background: '#10b981',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    편집 가능
                  </span>
                )}
              </h2>

              {/* 미디어 콘텐츠 렌더링 */}
              {renderMediaContent(section)}

              {/* 텍스트 콘텐츠 */}
              {(section.type === 'text' || section.type === 'practice' || section.type === 'summary' || section.type === 'download') && (
                <div style={{
                  background: section.type === 'practice' ? '#f0f9ff' : 
                             section.type === 'summary' ? '#f8fafc' :
                             section.type === 'download' ? '#fef3c7' : '#ffffff',
                  border: section.type === 'practice' ? '1px solid #bae6fd' :
                         section.type === 'summary' ? '1px solid #e2e8f0' :
                         section.type === 'download' ? '1px solid #fcd34d' : 'none',
                  borderRadius: '12px',
                  padding: '25px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.7',
                  fontSize: '1rem',
                  color: '#374151'
                }}>
                  {section.content}
                  
                  {section.type === 'download' && (
                    <div style={{ 
                      marginTop: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      {['프롬프트 템플릿 모음.pdf', '실습 워크시트.notion', 'ChatGPT 체크리스트.pdf', '고급 프롬프트 예시집.xlsx'].map((file, index) => (
                        <button
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 16px',
                            background: '#ffffff',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.95rem'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.borderColor = '#9ca3af';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.borderColor = '#d1d5db';
                          }}
                        >
                          <Download size={16} color="#6b7280" />
                          <span>{file}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 강의 완료 및 네비게이션 */}
        <div style={{ 
          marginTop: '50px',
          padding: '30px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}
            >
              <ChevronLeft size={18} />
              이전 강의
            </button>

            <button
              onClick={markCompleted}
              disabled={isCompleted}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: isCompleted ? '#10b981' : '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isCompleted ? 'default' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              <CheckCircle size={18} />
              {isCompleted ? '완료됨' : '강의 완료'}
            </button>

            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}
            >
              다음 강의
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;



