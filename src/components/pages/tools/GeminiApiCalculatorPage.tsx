import React, { useState } from 'react';
import { ArrowLeft, Calculator, Sparkles, Image, Video, Volume2, Zap, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GeminiApiCalculatorPageProps {
  onBack?: () => void;
}

// 모델 데이터
const textModels = [
  {
    id: 'gemini-3-pro',
    name: 'Gemini 3 Pro',
    description: '가장 강력한 에이전트형 & 바이브 코딩 모델',
    inputPrice: 2.00,
    outputPrice: 12.00,
    inputPriceLong: 4.00,
    outputPriceLong: 18.00,
    free: false,
    badge: 'PREMIUM'
  },
  {
    id: 'gemini-3-flash',
    name: 'Gemini 3 Flash',
    description: '속도 + 지능의 최적 조합',
    inputPrice: 0.50,
    outputPrice: 3.00,
    free: true,
    badge: 'NEW'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: '코딩 & 복잡한 추론 작업 최적화',
    inputPrice: 1.25,
    outputPrice: 10.00,
    inputPriceLong: 2.50,
    outputPriceLong: 15.00,
    free: true,
    badge: 'POPULAR'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: '하이브리드 추론 모델',
    inputPrice: 0.30,
    outputPrice: 2.50,
    free: true,
    badge: ''
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash-Lite',
    description: '가장 저렴한 모델',
    inputPrice: 0.10,
    outputPrice: 0.40,
    free: true,
    badge: 'BUDGET'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: '균형 잡힌 멀티모달 모델',
    inputPrice: 0.10,
    outputPrice: 0.40,
    free: true,
    badge: ''
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    description: '대규모 사용을 위한 경량 모델',
    inputPrice: 0.075,
    outputPrice: 0.30,
    free: true,
    badge: ''
  }
];

const imageModels = [
  {
    id: 'gemini-3-pro-image',
    name: 'Gemini 3 Pro Image 🍌',
    description: '최고 품질 이미지 생성',
    pricePerImage1K: 0.134,
    pricePerImage4K: 0.24,
    free: false,
    badge: 'PREMIUM'
  },
  {
    id: 'gemini-2.5-flash-image',
    name: 'Gemini 2.5 Flash Image 🍌',
    description: '빠른 이미지 생성',
    pricePerImage: 0.039,
    free: false,
    badge: ''
  },
  {
    id: 'gemini-2.0-flash-image',
    name: 'Gemini 2.0 Flash Image',
    description: '무료 이미지 생성!',
    pricePerImage: 0.039,
    free: true,
    badge: 'FREE'
  },
  {
    id: 'imagen-4-fast',
    name: 'Imagen 4 Fast',
    description: '빠른 고품질 이미지',
    pricePerImage: 0.02,
    free: false,
    badge: ''
  },
  {
    id: 'imagen-4-standard',
    name: 'Imagen 4 Standard',
    description: '표준 품질 이미지',
    pricePerImage: 0.04,
    free: false,
    badge: ''
  },
  {
    id: 'imagen-4-ultra',
    name: 'Imagen 4 Ultra',
    description: '최고 품질 이미지',
    pricePerImage: 0.06,
    free: false,
    badge: 'ULTRA'
  },
  {
    id: 'imagen-3',
    name: 'Imagen 3',
    description: '안정적인 이미지 생성',
    pricePerImage: 0.03,
    free: false,
    badge: ''
  }
];

const videoModels = [
  {
    id: 'veo-3.1-standard',
    name: 'Veo 3.1 Standard',
    description: '최신 고품질 영상 생성',
    pricePerSecond: 0.40,
    free: false,
    badge: 'NEW'
  },
  {
    id: 'veo-3.1-fast',
    name: 'Veo 3.1 Fast',
    description: '빠른 영상 생성',
    pricePerSecond: 0.15,
    free: false,
    badge: 'RECOMMENDED'
  },
  {
    id: 'veo-3-standard',
    name: 'Veo 3 Standard',
    description: '안정적인 고품질 영상',
    pricePerSecond: 0.40,
    free: false,
    badge: ''
  },
  {
    id: 'veo-3-fast',
    name: 'Veo 3 Fast',
    description: '빠른 영상 생성',
    pricePerSecond: 0.15,
    free: false,
    badge: ''
  },
  {
    id: 'veo-2',
    name: 'Veo 2',
    description: '이전 세대 영상 모델',
    pricePerSecond: 0.35,
    free: false,
    badge: ''
  }
];

const audioModels = [
  {
    id: 'gemini-2.5-flash-tts',
    name: 'Gemini 2.5 Flash TTS',
    description: '빠른 음성 생성',
    inputPrice: 0.50,
    outputPrice: 10.00,
    free: true,
    badge: ''
  },
  {
    id: 'gemini-2.5-pro-tts',
    name: 'Gemini 2.5 Pro TTS',
    description: '자연스러운 음성 생성',
    inputPrice: 1.00,
    outputPrice: 20.00,
    free: false,
    badge: 'PREMIUM'
  },
  {
    id: 'gemini-2.5-flash-native-audio',
    name: 'Gemini 2.5 Flash Native Audio',
    description: 'Live API 오디오',
    inputPrice: 3.00,
    outputPrice: 12.00,
    free: true,
    badge: ''
  }
];

const BRAND_NAVY = '#0b1220';
const BRAND_BLUE = '#1e3a8a';
const BRAND_GOLD = '#ffd60a';

const GeminiApiCalculatorPage: React.FC<GeminiApiCalculatorPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'video' | 'audio'>('text');
  const [expandedSections, setExpandedSections] = useState<string[]>(['calculator']);
  
  // 계산기 상태
  const [selectedTextModel, setSelectedTextModel] = useState(textModels[0].id);
  const [inputTokens, setInputTokens] = useState<number>(100000);
  const [outputTokens, setOutputTokens] = useState<number>(50000);
  
  const [selectedImageModel, setSelectedImageModel] = useState(imageModels[0].id);
  const [imageCount, setImageCount] = useState<number>(100);
  const [imageResolution, setImageResolution] = useState<'1k' | '4k'>('1k');
  
  const [selectedVideoModel, setSelectedVideoModel] = useState(videoModels[1].id);
  const [videoDuration, setVideoDuration] = useState<number>(8);
  const [videoCount, setVideoCount] = useState<number>(10);

  const [selectedAudioModel, setSelectedAudioModel] = useState(audioModels[0].id);
  const [audioInputTokens, setAudioInputTokens] = useState<number>(100000);
  const [audioOutputTokens, setAudioOutputTokens] = useState<number>(50000);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // 텍스트 모델 비용 계산
  const calculateTextCost = () => {
    const model = textModels.find(m => m.id === selectedTextModel);
    if (!model) return { input: 0, output: 0, total: 0 };
    
    const inputCost = (inputTokens / 1000000) * model.inputPrice;
    const outputCost = (outputTokens / 1000000) * model.outputPrice;
    return {
      input: inputCost,
      output: outputCost,
      total: inputCost + outputCost
    };
  };

  // 이미지 모델 비용 계산
  const calculateImageCost = () => {
    const model = imageModels.find(m => m.id === selectedImageModel);
    if (!model) return 0;
    
    if (model.id === 'gemini-3-pro-image') {
      return imageCount * (imageResolution === '4k' ? (model.pricePerImage4K || 0.24) : (model.pricePerImage1K || 0.134));
    }
    return imageCount * (model.pricePerImage || 0);
  };

  // 영상 모델 비용 계산
  const calculateVideoCost = () => {
    const model = videoModels.find(m => m.id === selectedVideoModel);
    if (!model) return 0;
    return videoDuration * videoCount * model.pricePerSecond;
  };

  // 오디오 모델 비용 계산
  const calculateAudioCost = () => {
    const model = audioModels.find(m => m.id === selectedAudioModel);
    if (!model) return { input: 0, output: 0, total: 0 };
    
    const inputCost = (audioInputTokens / 1000000) * model.inputPrice;
    const outputCost = (audioOutputTokens / 1000000) * model.outputPrice;
    return {
      input: inputCost,
      output: outputCost,
      total: inputCost + outputCost
    };
  };

  const formatUSD = (amount: number) => {
    return `$${amount.toFixed(4)}`;
  };

  const formatKRW = (usd: number) => {
    const krw = usd * 1400; // 대략적인 환율
    return `₩${Math.round(krw).toLocaleString()}`;
  };

  const textCost = calculateTextCost();
  const imageCost = calculateImageCost();
  const videoCost = calculateVideoCost();
  const audioCost = calculateAudioCost();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(180deg, ${BRAND_NAVY} 0%, #1a1f2e 100%)`,
      color: 'white'
    }}>
      {/* 헤더 */}
      <div style={{
        background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, ${BRAND_BLUE} 100%)`,
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `2px solid ${BRAND_GOLD}20`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${BRAND_GOLD}30`,
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            <ArrowLeft size={20} />
            뒤로가기
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              background: `linear-gradient(135deg, ${BRAND_GOLD}, #e5c100)`,
              width: '65px',
              height: '65px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 25px ${BRAND_GOLD}40`
            }}>
              <Calculator size={32} color={BRAND_NAVY} />
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1.8rem', margin: 0, fontWeight: '700' }}>
                Google Gemini API 가격 계산기
              </h1>
              <p style={{ color: '#94a3b8', margin: '8px 0 0 0', fontSize: '1rem' }}>
                모델별 사용량에 따른 비용을 실시간으로 계산해보세요
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px 20px 0'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {[
            { id: 'text', label: '텍스트/멀티모달', icon: <Sparkles size={18} /> },
            { id: 'image', label: '이미지 생성', icon: <Image size={18} /> },
            { id: 'video', label: '영상 생성', icon: <Video size={18} /> },
            { id: 'audio', label: '오디오/TTS', icon: <Volume2 size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab.id 
                  ? `linear-gradient(135deg, ${BRAND_GOLD}, #e5c100)`
                  : 'rgba(255,255,255,0.05)',
                color: activeTab === tab.id ? BRAND_NAVY : 'white',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* 텍스트/멀티모달 탭 */}
        {activeTab === 'text' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* 계산기 */}
            <div style={{
              background: 'rgba(30, 58, 138, 0.3)',
              borderRadius: '20px',
              padding: '24px',
              border: `1px solid ${BRAND_GOLD}30`
            }}>
              <h3 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                color: BRAND_GOLD,
                marginBottom: '20px'
              }}>
                <Calculator size={24} /> 비용 계산기
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>모델 선택</label>
                <select
                  value={selectedTextModel}
                  onChange={(e) => setSelectedTextModel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${BRAND_GOLD}30`,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  {textModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name} {model.free ? '(무료 가능)' : '(유료)'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>
                  입력 토큰 수
                </label>
                <input
                  type="number"
                  value={inputTokens}
                  onChange={(e) => setInputTokens(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${BRAND_GOLD}30`,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
                  약 {Math.round(inputTokens / 750).toLocaleString()}단어
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>
                  출력 토큰 수
                </label>
                <input
                  type="number"
                  value={outputTokens}
                  onChange={(e) => setOutputTokens(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${BRAND_GOLD}30`,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* 결과 */}
              <div style={{
                background: `linear-gradient(135deg, ${BRAND_GOLD}20, ${BRAND_GOLD}10)`,
                borderRadius: '16px',
                padding: '20px',
                border: `2px solid ${BRAND_GOLD}50`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>입력 비용</span>
                  <span style={{ color: 'white' }}>{formatUSD(textCost.input)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>출력 비용</span>
                  <span style={{ color: 'white' }}>{formatUSD(textCost.output)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  paddingTop: '15px',
                  borderTop: `1px solid ${BRAND_GOLD}30`
                }}>
                  <span style={{ color: BRAND_GOLD, fontWeight: '700', fontSize: '1.1rem' }}>총 비용</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: BRAND_GOLD, fontWeight: '700', fontSize: '1.3rem' }}>
                      {formatUSD(textCost.total)}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      {formatKRW(textCost.total)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 모델 목록 */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                color: 'white',
                marginBottom: '20px'
              }}>
                <Sparkles size={24} color={BRAND_GOLD} /> 텍스트 모델 가격표
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BRAND_GOLD}30` }}>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: '#94a3b8', fontSize: '0.85rem' }}>모델</th>
                      <th style={{ textAlign: 'right', padding: '12px 8px', color: '#94a3b8', fontSize: '0.85rem' }}>입력/1M</th>
                      <th style={{ textAlign: 'right', padding: '12px 8px', color: '#94a3b8', fontSize: '0.85rem' }}>출력/1M</th>
                      <th style={{ textAlign: 'center', padding: '12px 8px', color: '#94a3b8', fontSize: '0.85rem' }}>무료</th>
                    </tr>
                  </thead>
                  <tbody>
                    {textModels.map(model => (
                      <tr 
                        key={model.id}
                        style={{ 
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          background: selectedTextModel === model.id ? `${BRAND_GOLD}10` : 'transparent'
                        }}
                      >
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ fontWeight: '600', color: 'white', fontSize: '0.9rem' }}>
                            {model.name}
                            {model.badge && (
                              <span style={{
                                marginLeft: '8px',
                                padding: '2px 8px',
                                borderRadius: '20px',
                                fontSize: '0.65rem',
                                fontWeight: '700',
                                background: model.badge === 'FREE' ? '#22c55e' : 
                                           model.badge === 'PREMIUM' ? '#8b5cf6' :
                                           model.badge === 'POPULAR' ? BRAND_GOLD :
                                           model.badge === 'BUDGET' ? '#3b82f6' :
                                           model.badge === 'NEW' ? '#ef4444' : '#64748b',
                                color: model.badge === 'POPULAR' ? BRAND_NAVY : 'white'
                              }}>
                                {model.badge}
                              </span>
                            )}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '4px' }}>
                            {model.description}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', padding: '12px 8px', color: '#e2e8f0' }}>
                          ${model.inputPrice}
                        </td>
                        <td style={{ textAlign: 'right', padding: '12px 8px', color: '#e2e8f0' }}>
                          ${model.outputPrice}
                        </td>
                        <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                          {model.free ? (
                            <span style={{ color: '#22c55e' }}>✓</span>
                          ) : (
                            <span style={{ color: '#ef4444' }}>✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 이미지 탭 */}
        {activeTab === 'image' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* 계산기 */}
            <div style={{
              background: 'rgba(30, 58, 138, 0.3)',
              borderRadius: '20px',
              padding: '24px',
              border: `1px solid ${BRAND_GOLD}30`
            }}>
              <h3 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                color: BRAND_GOLD,
                marginBottom: '20px'
              }}>
                <Image size={24} /> 이미지 비용 계산기
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>모델 선택</label>
                <select
                  value={selectedImageModel}
                  onChange={(e) => setSelectedImageModel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${BRAND_GOLD}30`,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  {imageModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name} {model.free ? '(무료)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>
                  생성할 이미지 수
                </label>
                <input
                  type="number"
                  value={imageCount}
                  onChange={(e) => setImageCount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${BRAND_GOLD}30`,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {selectedImageModel === 'gemini-3-pro-image' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>
                    해상도
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setImageResolution('1k')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: imageResolution === '1k' ? BRAND_GOLD : 'rgba(255,255,255,0.1)',
                        color: imageResolution === '1k' ? BRAND_NAVY : 'white',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      1K-2K ($0.134)
                    </button>
                    <button
                      onClick={() => setImageResolution('4k')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: imageResolution === '4k' ? BRAND_GOLD : 'rgba(255,255,255,0.1)',
                        color: imageResolution === '4k' ? BRAND_NAVY : 'white',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      4K ($0.24)
                    </button>
                  </div>
                </div>
              )}

              {/* 결과 */}
              <div style={{
                background: `linear-gradient(135deg, ${BRAND_GOLD}20, ${BRAND_GOLD}10)`,
                borderRadius: '16px',
                padding: '20px',
                border: `2px solid ${BRAND_GOLD}50`
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: BRAND_GOLD, fontWeight: '700', fontSize: '1.1rem' }}>
                    {imageCount}장 총 비용
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: BRAND_GOLD, fontWeight: '700', fontSize: '1.3rem' }}>
                      {formatUSD(imageCost)}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      {formatKRW(imageCost)}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '10px', color: '#64748b', fontSize: '0.85rem' }}>
                  이미지당 약 {formatKRW(imageCost / imageCount)}
                </div>
              </div>
            </div>

            {/* 모델 목록 */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                color: 'white',
                marginBottom: '20px'
              }}>
                <Image size={24} color={BRAND_GOLD} /> 이미지 모델 가격표
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {imageModels.map(model => (
                  <div 
                    key={model.id}
                    style={{
                      background: selectedImageModel === model.id ? `${BRAND_GOLD}15` : 'rgba(0,0,0,0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: selectedImageModel === model.id ? `1px solid ${BRAND_GOLD}50` : '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: 'white' }}>
                          {model.name}
                          {model.badge && (
                            <span style={{
                              marginLeft: '8px',
                              padding: '2px 8px',
                              borderRadius: '20px',
                              fontSize: '0.65rem',
                              fontWeight: '700',
                              background: model.badge === 'FREE' ? '#22c55e' : 
                                         model.badge === 'PREMIUM' ? '#8b5cf6' :
                                         model.badge === 'ULTRA' ? '#ef4444' : '#64748b',
                              color: 'white'
                            }}>
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
                          {model.description}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: BRAND_GOLD, fontWeight: '700' }}>
                          {model.free ? '무료' : `$${model.pricePerImage || model.pricePerImage1K}/장`}
                        </div>
                        {!model.free && (
                          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            약 {formatKRW(model.pricePerImage || model.pricePerImage1K || 0)}/장
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 영상 탭 */}
        {activeTab === 'video' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* 계산기 */}
            <div style={{
              background: 'rgba(30, 58, 138, 0.3)',
              borderRadius: '20px',
              padding: '24px',
              border: `1px solid ${BRAND_GOLD}30`
            }}>
              <h3 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                color: BRAND_GOLD,
                marginBottom: '20px'
              }}>
                <Video size={24} /> 영상 비용 계산기
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>모델 선택</label>
                <select
                  value={selectedVideoModel}
                  onChange={(e) => setSelectedVideoModel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${BRAND_GOLD}30`,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  {videoModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name} (${model.pricePerSecond}/초)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>
                  영상 길이 (초)
                </label>
                <input
                  type="number"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${BRAND_GOLD}30`,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {[5, 8, 10, 15].map(sec => (
                    <button
                      key={sec}
                      onClick={() => setVideoDuration(sec)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: videoDuration === sec ? BRAND_GOLD : 'rgba(255,255,255,0.1)',
                        color: videoDuration === sec ? BRAND_NAVY : 'white',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {sec}초
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>
                  영상 개수
                </label>
                <input
                  type="number"
                  value={videoCount}
                  onChange={(e) => setVideoCount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${BRAND_GOLD}30`,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* 결과 */}
              <div style={{
                background: `linear-gradient(135deg, ${BRAND_GOLD}20, ${BRAND_GOLD}10)`,
                borderRadius: '16px',
                padding: '20px',
                border: `2px solid ${BRAND_GOLD}50`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>영상 1개 ({videoDuration}초)</span>
                  <span style={{ color: 'white' }}>
                    {formatUSD(videoCost / videoCount)} ({formatKRW(videoCost / videoCount)})
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  paddingTop: '15px',
                  borderTop: `1px solid ${BRAND_GOLD}30`
                }}>
                  <span style={{ color: BRAND_GOLD, fontWeight: '700', fontSize: '1.1rem' }}>
                    {videoCount}개 총 비용
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: BRAND_GOLD, fontWeight: '700', fontSize: '1.3rem' }}>
                      {formatUSD(videoCost)}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      {formatKRW(videoCost)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 추천 */}
              <div style={{
                marginTop: '20px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Zap size={18} color="#22c55e" />
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>추천</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                  <strong>Veo 3.1 Fast</strong>를 사용하면 Standard 대비 <strong style={{ color: '#22c55e' }}>62.5% 저렴</strong>하면서도 충분한 품질을 얻을 수 있어요!
                </p>
              </div>
            </div>

            {/* 모델 목록 */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                color: 'white',
                marginBottom: '20px'
              }}>
                <Video size={24} color={BRAND_GOLD} /> Veo 영상 모델 가격표
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {videoModels.map(model => (
                  <div 
                    key={model.id}
                    style={{
                      background: selectedVideoModel === model.id ? `${BRAND_GOLD}15` : 'rgba(0,0,0,0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: selectedVideoModel === model.id ? `1px solid ${BRAND_GOLD}50` : '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: 'white' }}>
                          {model.name}
                          {model.badge && (
                            <span style={{
                              marginLeft: '8px',
                              padding: '2px 8px',
                              borderRadius: '20px',
                              fontSize: '0.65rem',
                              fontWeight: '700',
                              background: model.badge === 'RECOMMENDED' ? '#22c55e' : 
                                         model.badge === 'NEW' ? '#ef4444' : '#64748b',
                              color: 'white'
                            }}>
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
                          {model.description}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: BRAND_GOLD, fontWeight: '700' }}>
                          ${model.pricePerSecond}/초
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                          8초 = {formatKRW(model.pricePerSecond * 8)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 비교 표 */}
              <div style={{
                marginTop: '20px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h4 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '0.9rem' }}>
                  8초 영상 가격 비교
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Veo 3.1 Fast</span>
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>$1.20 (약 ₩1,680)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Veo 3.1 Standard</span>
                    <span style={{ color: '#f59e0b' }}>$3.20 (약 ₩4,480)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Veo 2</span>
                    <span style={{ color: '#94a3b8' }}>$2.80 (약 ₩3,920)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 오디오 탭 */}
        {activeTab === 'audio' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* 계산기 */}
            <div style={{
              background: 'rgba(30, 58, 138, 0.3)',
              borderRadius: '20px',
              padding: '24px',
              border: `1px solid ${BRAND_GOLD}30`
            }}>
              <h3 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                color: BRAND_GOLD,
                marginBottom: '20px'
              }}>
                <Volume2 size={24} /> 오디오 비용 계산기
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>모델 선택</label>
                <select
                  value={selectedAudioModel}
                  onChange={(e) => setSelectedAudioModel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${BRAND_GOLD}30`,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  {audioModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>
                  입력 토큰 (텍스트)
                </label>
                <input
                  type="number"
                  value={audioInputTokens}
                  onChange={(e) => setAudioInputTokens(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${BRAND_GOLD}30`,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>
                  출력 토큰 (오디오)
                </label>
                <input
                  type="number"
                  value={audioOutputTokens}
                  onChange={(e) => setAudioOutputTokens(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: `1px solid ${BRAND_GOLD}30`,
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* 결과 */}
              <div style={{
                background: `linear-gradient(135deg, ${BRAND_GOLD}20, ${BRAND_GOLD}10)`,
                borderRadius: '16px',
                padding: '20px',
                border: `2px solid ${BRAND_GOLD}50`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>입력 비용</span>
                  <span style={{ color: 'white' }}>{formatUSD(audioCost.input)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>출력 비용</span>
                  <span style={{ color: 'white' }}>{formatUSD(audioCost.output)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  paddingTop: '15px',
                  borderTop: `1px solid ${BRAND_GOLD}30`
                }}>
                  <span style={{ color: BRAND_GOLD, fontWeight: '700', fontSize: '1.1rem' }}>총 비용</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: BRAND_GOLD, fontWeight: '700', fontSize: '1.3rem' }}>
                      {formatUSD(audioCost.total)}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      {formatKRW(audioCost.total)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 모델 목록 */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                color: 'white',
                marginBottom: '20px'
              }}>
                <Volume2 size={24} color={BRAND_GOLD} /> 오디오/TTS 모델 가격표
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {audioModels.map(model => (
                  <div 
                    key={model.id}
                    style={{
                      background: selectedAudioModel === model.id ? `${BRAND_GOLD}15` : 'rgba(0,0,0,0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: selectedAudioModel === model.id ? `1px solid ${BRAND_GOLD}50` : '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div style={{ fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                      {model.name}
                      {model.badge && (
                        <span style={{
                          marginLeft: '8px',
                          padding: '2px 8px',
                          borderRadius: '20px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          background: '#8b5cf6',
                          color: 'white'
                        }}>
                          {model.badge}
                        </span>
                      )}
                      {model.free && (
                        <span style={{
                          marginLeft: '8px',
                          padding: '2px 8px',
                          borderRadius: '20px',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          background: '#22c55e',
                          color: 'white'
                        }}>
                          무료 가능
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '8px' }}>
                      {model.description}
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <div>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>입력: </span>
                        <span style={{ color: BRAND_GOLD }}>${model.inputPrice}/1M</span>
                      </div>
                      <div>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>출력: </span>
                        <span style={{ color: BRAND_GOLD }}>${model.outputPrice}/1M</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 정보 섹션 */}
        <div style={{
          marginTop: '30px',
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div 
            onClick={() => toggleSection('info')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <h3 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              color: 'white',
              margin: 0
            }}>
              <Info size={24} color={BRAND_GOLD} /> 알아두면 좋은 정보
            </h3>
            {expandedSections.includes('info') ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>

          {expandedSections.includes('info') && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <h4 style={{ color: '#22c55e', marginBottom: '8px' }}>무료 등급</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                    대부분의 텍스트 모델은 무료로 사용 가능합니다. 단, 이미지/영상 생성은 유료 모델만 가능합니다.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  <h4 style={{ color: '#f59e0b', marginBottom: '8px' }}>토큰이란?</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                    약 750 토큰 = 1,000 단어 (영어 기준). 한글은 약 500~600 토큰 = 1,000자 정도입니다.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  <h4 style={{ color: '#8b5cf6', marginBottom: '8px' }}>프라이버시</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                    무료 등급은 데이터가 Google 학습에 사용될 수 있습니다. 민감한 데이터는 유료 등급 사용을 권장합니다.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <h4 style={{ color: '#3b82f6', marginBottom: '8px' }}>Batch API</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                    대량 처리 시 Batch API를 사용하면 50% 할인된 가격으로 이용 가능합니다.
                  </p>
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: `rgba(${parseInt(BRAND_GOLD.slice(1,3), 16)}, ${parseInt(BRAND_GOLD.slice(3,5), 16)}, ${parseInt(BRAND_GOLD.slice(5,7), 16)}, 0.1)`,
                borderRadius: '12px',
                border: `1px solid ${BRAND_GOLD}30`
              }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                  💡 <strong style={{ color: BRAND_GOLD }}>팁:</strong> 환율은 $1 = ₩1,400 기준으로 계산됩니다. 
                  실제 결제 시 환율 변동이 있을 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 푸터 */}
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: '#64748b',
        fontSize: '0.85rem'
      }}>
        <p>가격 정보는 2025년 12월 기준입니다. 최신 가격은 Google AI 공식 문서를 확인하세요.</p>
        <p style={{ marginTop: '8px' }}>
          <a 
            href="https://ai.google.dev/pricing" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: BRAND_GOLD }}
          >
            Google AI Pricing 공식 페이지 →
          </a>
        </p>
      </div>
    </div>
  );
};

export default GeminiApiCalculatorPage;

