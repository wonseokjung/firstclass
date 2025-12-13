import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  Scissors,
  Film,
  Sparkles,
  Play,
  Clock,
  Check,
  Loader2,
  Download,
  Video,
  ChevronRight,
  Zap
} from 'lucide-react';

interface SubtitleSegment {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
  startSeconds: number;
  endSeconds: number;
}

interface HighlightClip {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  text: string;
  reason: string;
  selected: boolean;
}

const LongformToShortsPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  // 상태
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const [subtitleContent, setSubtitleContent] = useState<string>('');
  const [parsedSubtitles, setParsedSubtitles] = useState<SubtitleSegment[]>([]);
  const [highlights, setHighlights] = useState<HighlightClip[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // SRT 파싱 함수
  const parseSRT = (content: string): SubtitleSegment[] => {
    const segments: SubtitleSegment[] = [];
    const blocks = content.trim().split(/\n\n+/);

    blocks.forEach((block) => {
      const lines = block.split('\n');
      if (lines.length >= 3) {
        const index = parseInt(lines[0]);
        const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
        
        if (timeMatch) {
          const startTime = timeMatch[1].replace(',', '.');
          const endTime = timeMatch[2].replace(',', '.');
          const text = lines.slice(2).join(' ');

          const timeToSeconds = (time: string): number => {
            const [h, m, s] = time.split(':');
            return parseInt(h) * 3600 + parseInt(m) * 60 + parseFloat(s.replace(',', '.'));
          };

          segments.push({
            index,
            startTime,
            endTime,
            text,
            startSeconds: timeToSeconds(startTime),
            endSeconds: timeToSeconds(endTime)
          });
        }
      }
    });

    return segments;
  };

  // 자막 파일 처리
  const handleSubtitleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubtitleFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setSubtitleContent(content);
        const parsed = parseSRT(content);
        setParsedSubtitles(parsed);
        if (parsed.length > 0) {
          setCurrentStep(2);
        }
      };
      reader.readAsText(file);
    }
  };

  // 영상 파일 처리
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  // AI 분석 (데모)
  const analyzeHighlights = async () => {
    setIsAnalyzing(true);
    setCurrentStep(3);

    // 실제로는 GPT API 호출
    // 데모용으로 자막에서 랜덤하게 하이라이트 선택
    await new Promise(resolve => setTimeout(resolve, 2000));

    const totalDuration = parsedSubtitles[parsedSubtitles.length - 1]?.endSeconds || 0;
    const clipCount = Math.min(5, Math.floor(totalDuration / 60)); // 1분당 1개 클립

    const demoHighlights: HighlightClip[] = [];
    const usedRanges: number[] = [];

    for (let i = 0; i < Math.max(3, clipCount); i++) {
      let startIdx: number;
      do {
        startIdx = Math.floor(Math.random() * (parsedSubtitles.length - 10));
      } while (usedRanges.includes(startIdx));
      
      usedRanges.push(startIdx);
      
      const clipLength = 30 + Math.floor(Math.random() * 30); // 30-60초
      const startSeg = parsedSubtitles[startIdx];
      const endIdx = Math.min(startIdx + 10, parsedSubtitles.length - 1);
      const endSeg = parsedSubtitles[endIdx];

      const reasons = [
        '핵심 메시지가 담긴 구간',
        '감정적으로 임팩트 있는 순간',
        '바이럴 가능성이 높은 내용',
        '시청자 관심을 끌 수 있는 훅',
        '실용적인 팁이 포함된 부분'
      ];

      demoHighlights.push({
        id: i + 1,
        title: `하이라이트 #${i + 1}`,
        startTime: startSeg.startTime.split('.')[0],
        endTime: endSeg.endTime.split('.')[0],
        duration: Math.round(endSeg.endSeconds - startSeg.startSeconds),
        text: parsedSubtitles.slice(startIdx, endIdx + 1).map(s => s.text).join(' ').slice(0, 100) + '...',
        reason: reasons[i % reasons.length],
        selected: true
      });
    }

    setHighlights(demoHighlights.sort((a, b) => {
      const aTime = a.startTime.split(':').reduce((acc, t) => acc * 60 + parseInt(t), 0);
      const bTime = b.startTime.split(':').reduce((acc, t) => acc * 60 + parseInt(t), 0);
      return aTime - bTime;
    }));

    setIsAnalyzing(false);
    setAnalysisComplete(true);
    setCurrentStep(4);
  };

  // 클립 선택 토글
  const toggleClipSelection = (id: number) => {
    setHighlights(prev => 
      prev.map(h => h.id === id ? { ...h, selected: !h.selected } : h)
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      color: '#fff'
    }}>
      {/* 네비게이션 */}
      <nav style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/ai-construction-site')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft size={20} color="#fff" />
          </button>
          <div>
            <h1 style={{ 
              fontSize: '1.3rem', 
              fontWeight: '800', 
              margin: 0,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🎬 롱폼 → 숏츠 변환기
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
              AI가 하이라이트를 자동으로 추출합니다
            </p>
          </div>
        </div>

        {/* 진행 단계 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { num: 1, label: '자막 업로드' },
            { num: 2, label: '영상 업로드' },
            { num: 3, label: 'AI 분석' },
            { num: 4, label: '결과 확인' }
          ].map((step, idx) => (
            <React.Fragment key={step.num}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                background: currentStep >= step.num 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
                  : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease'
              }}>
                {currentStep > step.num ? (
                  <Check size={14} />
                ) : (
                  <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{step.num}</span>
                )}
                <span style={{ fontSize: '0.75rem', display: idx < 2 ? 'none' : 'inline' }}>
                  {step.label}
                </span>
              </div>
              {idx < 3 && <ChevronRight size={16} color="#64748b" />}
            </React.Fragment>
          ))}
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: analysisComplete ? '1fr 1fr' : '1fr',
          gap: '30px'
        }}>
          {/* 왼쪽: 업로드 영역 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 자막 업로드 */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: `2px solid ${subtitleFile ? '#10b981' : 'rgba(139, 92, 246, 0.3)'}`,
              borderRadius: '20px',
              padding: '30px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: subtitleFile 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {subtitleFile ? <Check size={24} /> : <FileText size={24} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>
                    1. 자막 파일 업로드
                  </h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
                    SRT, VTT 형식 지원
                  </p>
                </div>
              </div>

              {subtitleFile ? (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <p style={{ color: '#10b981', fontWeight: '600', margin: '0 0 8px' }}>
                    ✅ {subtitleFile.name}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                    {parsedSubtitles.length}개 자막 세그먼트 감지
                  </p>
                </div>
              ) : (
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                  border: '2px dashed rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  <Upload size={40} color="#8b5cf6" style={{ marginBottom: '12px' }} />
                  <span style={{ color: '#fff', fontWeight: '600' }}>클릭하여 자막 파일 선택</span>
                  <span style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '8px' }}>
                    또는 파일을 드래그하세요
                  </span>
                  <input
                    ref={subtitleInputRef}
                    type="file"
                    accept=".srt,.vtt,.txt"
                    onChange={handleSubtitleUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>

            {/* 영상 업로드 (선택사항) */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: `2px solid ${videoFile ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px',
              padding: '30px',
              opacity: subtitleFile ? 1 : 0.5,
              pointerEvents: subtitleFile ? 'auto' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: videoFile 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {videoFile ? <Check size={24} /> : <Video size={24} color="#64748b" />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>
                    2. 영상 파일 업로드 <span style={{ color: '#64748b', fontWeight: '400' }}>(선택)</span>
                  </h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
                    MP4, MOV 형식 지원
                  </p>
                </div>
              </div>

              {videoFile ? (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <p style={{ color: '#10b981', fontWeight: '600', margin: 0 }}>
                    ✅ {videoFile.name}
                  </p>
                </div>
              ) : (
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '30px',
                  border: '2px dashed rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}>
                  <Upload size={30} color="#64748b" style={{ marginBottom: '8px' }} />
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>영상 파일 선택 (선택사항)</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>

            {/* AI 분석 버튼 */}
            {subtitleFile && !analysisComplete && (
              <button
                onClick={analyzeHighlights}
                disabled={isAnalyzing}
                style={{
                  background: isAnalyzing 
                    ? 'rgba(139, 92, 246, 0.5)' 
                    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '20px',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: isAnalyzing ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)'
                }}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    AI가 하이라이트를 분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    🚀 AI 하이라이트 분석 시작
                  </>
                )}
              </button>
            )}

            {/* 자막 미리보기 */}
            {parsedSubtitles.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '20px',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <h4 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '12px' }}>
                  📝 자막 미리보기 ({parsedSubtitles.length}개)
                </h4>
                {parsedSubtitles.slice(0, 10).map((seg, idx) => (
                  <div key={idx} style={{
                    padding: '10px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: '#8b5cf6', marginRight: '10px' }}>
                      {seg.startTime.split('.')[0]}
                    </span>
                    <span style={{ color: '#e0e0e0' }}>{seg.text}</span>
                  </div>
                ))}
                {parsedSubtitles.length > 10 && (
                  <p style={{ color: '#64748b', textAlign: 'center', marginTop: '10px' }}>
                    ... 외 {parsedSubtitles.length - 10}개
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 오른쪽: 분석 결과 */}
          {analysisComplete && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Scissors size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>
                      🎯 추출된 하이라이트
                    </h3>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
                      {highlights.filter(h => h.selected).length}개 선택됨
                    </p>
                  </div>
                </div>
                <button style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: '#fff',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Download size={18} />
                  내보내기
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {highlights.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={() => toggleClipSelection(clip.id)}
                    style={{
                      background: clip.selected 
                        ? 'rgba(139, 92, 246, 0.15)' 
                        : 'rgba(255,255,255,0.03)',
                      border: `2px solid ${clip.selected ? '#8b5cf6' : 'transparent'}`,
                      borderRadius: '14px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            background: clip.selected ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {clip.selected && <Check size={14} />}
                          </div>
                          <span style={{ fontWeight: '700', color: '#fff' }}>{clip.title}</span>
                          <span style={{
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#a855f7',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                          }}>
                            {clip.duration}초
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Clock size={14} color="#64748b" />
                          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                            {clip.startTime} → {clip.endTime}
                          </span>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 8px', lineHeight: '1.5' }}>
                          "{clip.text}"
                        </p>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(251, 191, 36, 0.1)',
                          padding: '4px 10px',
                          borderRadius: '6px'
                        }}>
                          <Zap size={12} color="#fbbf24" />
                          <span style={{ color: '#fbbf24', fontSize: '0.75rem' }}>{clip.reason}</span>
                        </div>
                      </div>
                      <button style={{
                        background: 'rgba(139, 92, 246, 0.2)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Play size={16} color="#8b5cf6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 하단 액션 */}
              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '14px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#e0e0e0', marginBottom: '16px' }}>
                  선택한 <strong style={{ color: '#8b5cf6' }}>{highlights.filter(h => h.selected).length}개</strong> 클립을 숏츠로 변환
                </p>
                <button style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 32px',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)'
                }}>
                  <Film size={20} />
                  🎬 숏츠 생성하기
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LongformToShortsPage;

