import React, { useState, useMemo } from 'react';
import { ArrowLeft, Sparkles, TrendingDown, Zap, DollarSign, Settings } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import {
  ApiType,
  PricingTier,
  textModelPrices,
  imageGenPrices,
  audioTokenPrices,
  videoPrices,
  embeddingPrices,
  transcriptionPrices,
} from '../../../data/pricingData';

interface CostOptimizationExamplesPageProps {
  onBack: () => void;
}

type ViewMode = 'beginner' | 'expert';

// 환율 상수 (USD to KRW)
const USD_TO_KRW = 1350;

// 사용 목적 정의
type UsePurpose = 
  | 'chatbot' 
  | 'content-generation' 
  | 'code-assistant' 
  | 'translation' 
  | 'image-generation'
  | 'voice-assistant'
  | 'video-creation'
  | 'data-analysis';

interface PurposeConfig {
  id: UsePurpose;
  icon: string;
  label: string;
  apiType: ApiType;
  description: string;
  recommendedModel: string;
  recommendedTier: PricingTier;
  typicalInput: number;
  typicalOutput: number;
  typicalRequests: number;
  unit: string;
}

const usePurposes: PurposeConfig[] = [
  {
    id: 'chatbot',
    icon: '💬',
    label: '챗봇 서비스',
    apiType: 'text',
    description: '고객 상담, FAQ 자동 응답',
    recommendedModel: 'gpt-4.1-mini',
    recommendedTier: 'standard',
    typicalInput: 500,
    typicalOutput: 300,
    typicalRequests: 1000,
    unit: '일일 대화',
  },
  {
    id: 'content-generation',
    icon: '✍️',
    label: '콘텐츠 생성',
    apiType: 'text',
    description: '블로그, 기사, SNS 콘텐츠 작성',
    recommendedModel: 'gpt-5-mini',
    recommendedTier: 'standard',
    typicalInput: 1000,
    typicalOutput: 2000,
    typicalRequests: 100,
    unit: '일일 콘텐츠',
  },
  {
    id: 'code-assistant',
    icon: '💻',
    label: '코드 어시스턴트',
    apiType: 'text',
    description: '코드 생성, 리뷰, 디버깅',
    recommendedModel: 'gpt-5-codex',
    recommendedTier: 'standard',
    typicalInput: 2000,
    typicalOutput: 1000,
    typicalRequests: 50,
    unit: '일일 요청',
  },
  {
    id: 'translation',
    icon: '🌐',
    label: '번역 서비스',
    apiType: 'text',
    description: '다국어 자동 번역',
    recommendedModel: 'gpt-4.1-nano',
    recommendedTier: 'batch',
    typicalInput: 500,
    typicalOutput: 500,
    typicalRequests: 500,
    unit: '일일 번역',
  },
  {
    id: 'image-generation',
    icon: '🎨',
    label: '이미지 생성',
    apiType: 'image-gen',
    description: 'AI 이미지, 썸네일 제작',
    recommendedModel: 'gpt-image-1-mini',
    recommendedTier: 'standard',
    typicalInput: 0,
    typicalOutput: 0,
    typicalRequests: 50,
    unit: '일일 이미지',
  },
  {
    id: 'voice-assistant',
    icon: '🎙️',
    label: '음성 어시스턴트',
    apiType: 'audio',
    description: '음성 인식 및 응답',
    recommendedModel: 'gpt-realtime-mini',
    recommendedTier: 'standard',
    typicalInput: 10000,
    typicalOutput: 10000,
    typicalRequests: 100,
    unit: '일일 대화',
  },
  {
    id: 'video-creation',
    icon: '🎬',
    label: '비디오 생성',
    apiType: 'video',
    description: '짧은 영상, 광고 제작',
    recommendedModel: 'sora-2',
    recommendedTier: 'standard',
    typicalInput: 0,
    typicalOutput: 0,
    typicalRequests: 10,
    unit: '일일 비디오',
  },
  {
    id: 'data-analysis',
    icon: '📊',
    label: '데이터 분석',
    apiType: 'embedding',
    description: '문서 검색, 유사도 분석',
    recommendedModel: 'text-embedding-3-small',
    recommendedTier: 'standard',
    typicalInput: 1000000,
    typicalOutput: 0,
    typicalRequests: 100,
    unit: '일일 분석',
  },
];

const CostOptimizationExamplesPage: React.FC<CostOptimizationExamplesPageProps> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('beginner');
  const [selectedPurpose, setSelectedPurpose] = useState<UsePurpose>('chatbot');
  const [customRequests, setCustomRequests] = useState<number>(1000);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Expert mode state
  const [apiType, setApiType] = useState<ApiType>('text');
  const [textCalc, setTextCalc] = useState({
    tier: 'standard' as PricingTier,
    model: 'gpt-5-mini',
    inputTokens: 100000,
    outputTokens: 50000,
    cachedRatio: 0,
  });
  
  const [imageCalc, setImageCalc] = useState({
    model: 'gpt-image-1-mini',
    quality: 'medium',
    size: '1024x1024',
    count: 10,
  });
  
  const [audioCalc, setAudioCalc] = useState({
    model: 'gpt-realtime-mini',
    inputTokens: 100000,
    outputTokens: 50000,
    cachedRatio: 0,
  });
  
  const [videoCalc, setVideoCalc] = useState({
    model: 'sora-2',
    seconds: 30,
  });
  
  const [embeddingCalc, setEmbeddingCalc] = useState({
    model: 'text-embedding-3-small',
    tier: 'standard' as 'standard' | 'batch',
    tokens: 1000000,
  });
  
  const [transcriptionCalc, setTranscriptionCalc] = useState({
    model: 'whisper',
    minutes: 60,
  });

  const purposeConfig = usePurposes.find(p => p.id === selectedPurpose)!;

  // Beginner mode cost calculation
  const estimatedCost = useMemo(() => {
    const config = purposeConfig;
    
    if (config.apiType === 'text') {
      const models = textModelPrices[config.recommendedTier];
      const model = models[config.recommendedModel];
      if (!model) return { daily: 0, monthly: 0, perRequest: 0 };

      const inputCost = (config.typicalInput / 1_000_000) * model.input;
      const outputCost = (config.typicalOutput / 1_000_000) * model.output;
      const perRequestCost = inputCost + outputCost;
      const dailyCost = perRequestCost * customRequests;
      const monthlyCost = dailyCost * 30;

      return {
        perRequest: perRequestCost,
        daily: dailyCost,
        monthly: monthlyCost,
        modelName: model.name,
      };
    } else if (config.apiType === 'image-gen') {
      const model = imageGenPrices[config.recommendedModel];
      if (!model) return { daily: 0, monthly: 0, perRequest: 0 };
      
      const pricePerImage = model.quality['medium']['1024x1024'];
      const dailyCost = pricePerImage * customRequests;
      const monthlyCost = dailyCost * 30;

      return {
        perRequest: pricePerImage,
        daily: dailyCost,
        monthly: monthlyCost,
        modelName: model.name,
      };
    } else if (config.apiType === 'audio') {
      const model = audioTokenPrices[config.recommendedModel];
      if (!model) return { daily: 0, monthly: 0, perRequest: 0 };

      const inputCost = (config.typicalInput / 1_000_000) * model.input;
      const outputCost = (config.typicalOutput / 1_000_000) * model.output;
      const perRequestCost = inputCost + outputCost;
      const dailyCost = perRequestCost * customRequests;
      const monthlyCost = dailyCost * 30;

      return {
        perRequest: perRequestCost,
        daily: dailyCost,
        monthly: monthlyCost,
        modelName: model.name,
      };
    } else if (config.apiType === 'video') {
      const model = videoPrices[config.recommendedModel];
      if (!model) return { daily: 0, monthly: 0, perRequest: 0 };

      const perRequestCost = model.price * 10;
      const dailyCost = perRequestCost * customRequests;
      const monthlyCost = dailyCost * 30;

      return {
        perRequest: perRequestCost,
        daily: dailyCost,
        monthly: monthlyCost,
        modelName: model.name,
      };
    } else if (config.apiType === 'embedding') {
      const model = embeddingPrices[config.recommendedModel];
      if (!model) return { daily: 0, monthly: 0, perRequest: 0 };

      const perRequestCost = (config.typicalInput / 1_000_000) * model.standard;
      const dailyCost = perRequestCost * customRequests;
      const monthlyCost = dailyCost * 30;

      return {
        perRequest: perRequestCost,
        daily: dailyCost,
        monthly: monthlyCost,
        modelName: model.name,
      };
    }

    return { daily: 0, monthly: 0, perRequest: 0 };
  }, [purposeConfig, customRequests]);

  // Expert mode calculations
  const textCost = useMemo(() => {
    const models = textModelPrices[textCalc.tier];
    const model = models[textCalc.model];
    if (!model) return { perRequest: 0, description: '' };

    const cachedTokens = textCalc.inputTokens * (textCalc.cachedRatio / 100);
    const freshTokens = textCalc.inputTokens - cachedTokens;
    
    const cachedPrice = model.cachedInput || model.input;
    const inputCost = (cachedTokens / 1_000_000) * cachedPrice + (freshTokens / 1_000_000) * model.input;
    const outputCost = (textCalc.outputTokens / 1_000_000) * model.output;
    const total = inputCost + outputCost;

    return {
      perRequest: total,
      inputCost,
      outputCost,
      description: `${model.name} (${textCalc.tier})`,
    };
  }, [textCalc]);

  const imageCost = useMemo(() => {
    const model = imageGenPrices[imageCalc.model];
    if (!model || !model.quality) return { perRequest: 0, total: 0 };

    const qualityPrices = model.quality[imageCalc.quality];
    if (!qualityPrices) return { perRequest: 0, total: 0 };

    const pricePerImage = qualityPrices[imageCalc.size] || 0;
    const total = pricePerImage * imageCalc.count;

    return {
      perRequest: pricePerImage,
      total,
      description: `${model.name} (${imageCalc.quality}, ${imageCalc.size})`,
    };
  }, [imageCalc]);

  const apiTabs: { id: ApiType; label: string; icon: string }[] = [
    { id: 'text', label: 'Text API', icon: '📝' },
    { id: 'image-gen', label: 'Image 생성', icon: '🎨' },
    { id: 'audio', label: 'Audio', icon: '🎵' },
    { id: 'video', label: 'Video', icon: '🎬' },
    { id: 'embedding', label: 'Embedding', icon: '🔢' },
    { id: 'transcription', label: 'Transcription/TTS', icon: '🎙️' },
  ];

  return (
        <div style={{
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
    }}>
      <NavigationBar />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)' }}>
        {/* Header with Mode Toggle */}
        <div style={{ marginBottom: 'clamp(20px, 4vw, 40px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <button
              onClick={onBack}
              style={{
                background: '#ffffff',
                border: '2px solid #0ea5e9',
                padding: '12px 24px',
                borderRadius: '12px',
                color: '#0ea5e9',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
            alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0ea5e9';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#0ea5e9';
              }}
            >
              <ArrowLeft size={20} />
              돌아가기
            </button>

            {/* Mode Toggle */}
            <div style={{
              background: '#ffffff',
              border: '2px solid #0ea5e9',
              borderRadius: '12px',
              padding: '4px',
              display: 'flex',
              gap: '4px',
            }}>
              <button
                onClick={() => setViewMode('beginner')}
                style={{
                  background: viewMode === 'beginner' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'transparent',
                  color: viewMode === 'beginner' ? '#ffffff' : '#0ea5e9',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <Sparkles size={16} style={{ display: 'inline', marginRight: '6px' }} />
                초보자 모드
              </button>
              <button
                onClick={() => setViewMode('expert')}
                style={{
                  background: viewMode === 'expert' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'transparent',
                  color: viewMode === 'expert' ? '#ffffff' : '#0ea5e9',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <Settings size={16} style={{ display: 'inline', marginRight: '6px' }} />
                전문가 모드
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
          <h1 style={{
              fontSize: '48px',
            fontWeight: '800',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '16px',
            }}>
              💡 AI 비용 최적화 계산기
          </h1>
          <p style={{
              fontSize: '20px',
            color: '#64748b',
              fontWeight: '500',
          }}>
              {viewMode === 'beginner' 
                ? '목적에 맞는 모델 추천과 예상 비용을 확인하세요' 
                : '모든 OpenAI 모델의 상세한 비용을 계산하세요'}
          </p>
          </div>
        </div>

        {/* Beginner Mode */}
        {viewMode === 'beginner' && (
          <>
            {/* Purpose Selection Grid */}
          <div style={{
            background: '#ffffff',
              borderRadius: '24px',
              padding: 'clamp(20px, 4vw, 40px)',
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.1)',
              marginBottom: '30px',
            }}>
              <div style={{
              display: 'flex',
              alignItems: 'center',
                gap: '12px',
                marginBottom: '30px',
              }}>
                <Sparkles size={28} color="#0ea5e9" />
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#0d1b2a',
                  margin: 0,
                }}>
                  사용 목적을 선택하세요
                </h2>
        </div>

        <div style={{
          display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                gap: '20px',
              }}>
                {usePurposes.map((purpose) => (
                  <button
                    key={purpose.id}
                    onClick={() => {
                      setSelectedPurpose(purpose.id);
                      setCustomRequests(purpose.typicalRequests);
                    }}
              style={{
                      background: selectedPurpose === purpose.id 
                        ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' 
                        : '#ffffff',
                      border: selectedPurpose === purpose.id 
                        ? '2px solid #0ea5e9' 
                        : '2px solid #e2e8f0',
                      padding: '24px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                transition: 'all 0.3s ease',
                      textAlign: 'left',
                      boxShadow: selectedPurpose === purpose.id 
                        ? '0 8px 24px rgba(14, 165, 233, 0.25)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.05)',
                      transform: selectedPurpose === purpose.id ? 'translateY(-4px)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedPurpose !== purpose.id) {
                e.currentTarget.style.borderColor = '#0ea5e9';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
              }}
                    onMouseLeave={(e) => {
                      if (selectedPurpose !== purpose.id) {
                e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'none';
                      }
              }}
            >
              <div style={{
                      fontSize: '40px',
                      marginBottom: '12px',
                    }}>
                      {purpose.icon}
                </div>
                  <h3 style={{
                      fontSize: '20px',
                    fontWeight: '700',
                      color: selectedPurpose === purpose.id ? '#ffffff' : '#0d1b2a',
                      marginBottom: '8px',
                  }}>
                      {purpose.label}
                  </h3>
                  <p style={{
                      fontSize: '14px',
                      color: selectedPurpose === purpose.id ? 'rgba(255, 255, 255, 0.9)' : '#64748b',
                      lineHeight: '1.6',
                      margin: 0,
                    }}>
                      {purpose.description}
                    </p>
                  </button>
                ))}
                </div>
              </div>

            {/* Recommendation and Estimation */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '30px',
            }}>
              {/* AI 추천 */}
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: 'clamp(20px, 4vw, 40px)',
                boxShadow: '0 4px 20px rgba(14, 165, 233, 0.1)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                }}>
                  <Zap size={28} color="#0ea5e9" />
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: 0,
                  }}>
                    AI 추천 모델
                  </h2>
                </div>

              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '2px solid #0ea5e9',
                marginBottom: '20px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}>
                      추천
                    </div>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#0ea5e9',
                      margin: 0,
                    }}>
                      {estimatedCost.modelName}
                    </h3>
                  </div>
                  <p style={{
                    fontSize: '15px',
                    color: '#475569',
                    lineHeight: '1.6',
                    margin: 0,
                  }}>
                    {purposeConfig.description}에 최적화된 모델입니다.
                    </p>
                  </div>

                  <div style={{
                  display: 'grid',
                  gap: '12px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                  }}>
                    <span style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>처리 티어</span>
                    <span style={{ fontSize: '15px', color: '#0d1b2a', fontWeight: '700' }}>
                      {purposeConfig.recommendedTier.toUpperCase()}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                  }}>
                    <span style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>API 타입</span>
                    <span style={{ fontSize: '15px', color: '#0d1b2a', fontWeight: '700' }}>
                      {purposeConfig.apiType === 'text' ? 'Text API' :
                       purposeConfig.apiType === 'image-gen' ? 'Image 생성' :
                       purposeConfig.apiType === 'audio' ? 'Audio API' :
                       purposeConfig.apiType === 'video' ? 'Video 생성' :
                       purposeConfig.apiType === 'embedding' ? 'Embedding' : 'Other'}
                    </span>
                  </div>
                </div>

                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: '#fef3c7',
                  borderRadius: '12px',
                  border: '2px solid #ffd60a',
                }}>
                    <p style={{
                    fontSize: '14px',
                    color: '#92400e',
                    lineHeight: '1.6',
                    margin: 0,
                  }}>
                    <strong>💡 Tip:</strong> Batch API를 사용하면 최대 50% 비용을 절감할 수 있습니다!
                    </p>
                  </div>
                </div>

              {/* 비용 예측 */}
                <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: 'clamp(20px, 4vw, 40px)',
                boxShadow: '0 4px 20px rgba(14, 165, 233, 0.1)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                }}>
                  <DollarSign size={28} color="#0ea5e9" />
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#0d1b2a',
                    margin: 0,
                  }}>
                    예상 비용
                  </h2>
                </div>

                {/* 사용량 조절 */}
                <div style={{ marginBottom: '30px' }}>
                  <label style={{
                    fontSize: '16px',
                  fontWeight: '600',
                    color: '#475569',
                    display: 'block',
                    marginBottom: '12px',
                  }}>
                    {purposeConfig.unit}: {customRequests.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={purposeConfig.typicalRequests * 10}
                    step={purposeConfig.typicalRequests / 10}
                    value={customRequests}
                    onChange={(e) => setCustomRequests(parseInt(e.target.value))}
                    style={{
                  width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      outline: 'none',
                      background: 'linear-gradient(to right, #0ea5e9, #bae6fd)',
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#94a3b8',
                    marginTop: '8px',
                  }}>
                    <span>1</span>
                    <span>{(purposeConfig.typicalRequests * 10).toLocaleString()}</span>
                </div>
              </div>

                {/* 비용 표시 */}
                <div style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  padding: '30px',
                  borderRadius: '16px',
                  color: '#ffffff',
                  marginBottom: '20px',
                }}>
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                      1회 요청당
                    </p>
                    <p style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>
                      ${estimatedCost.perRequest?.toFixed(4) || '0.0000'}
                    </p>
                    <p style={{ fontSize: '18px', fontWeight: '600', margin: '8px 0 0 0', opacity: 0.9 }}>
                      ₩{((estimatedCost.perRequest || 0) * USD_TO_KRW).toFixed(0)}
                    </p>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                  }}>
                    <div>
                      <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '6px' }}>
                        일일 예상 비용
                      </p>
                      <p style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                        ${estimatedCost.daily?.toFixed(2) || '0.00'}
                      </p>
                      <p style={{ fontSize: '15px', fontWeight: '600', margin: '4px 0 0 0', opacity: 0.85 }}>
                        ₩{((estimatedCost.daily || 0) * USD_TO_KRW).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '6px' }}>
                        월간 예상 비용
                      </p>
                      <p style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                        ${estimatedCost.monthly?.toFixed(2) || '0.00'}
                      </p>
                      <p style={{ fontSize: '15px', fontWeight: '600', margin: '4px 0 0 0', opacity: 0.85 }}>
                        ₩{((estimatedCost.monthly || 0) * USD_TO_KRW).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 최적화 제안 */}
                <div style={{
                  padding: '20px',
                  background: '#dcfce7',
                  borderRadius: '12px',
                  border: '2px solid #22c55e',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}>
                    <TrendingDown size={20} color="#16a34a" />
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#166534',
                      margin: 0,
                    }}>
                      비용 절감 팁
                  </h4>
                  </div>
                  <ul style={{
                    fontSize: '14px',
                    color: '#166534',
                    lineHeight: '1.8',
                    marginLeft: '20px',
                    marginBottom: 0,
                  }}>
                    <li>프롬프트 캐싱으로 최대 90% 절감</li>
                    <li>Batch API 사용으로 50% 절감</li>
                    <li>작은 모델 사용으로 80% 절감</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Advanced Settings Toggle */}
              <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '30px 40px',
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.1)',
                textAlign: 'center',
              }}>
                <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                  style={{
                  background: showAdvanced ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#f0f9ff',
                  color: showAdvanced ? '#ffffff' : '#0ea5e9',
                  border: '2px solid #0ea5e9',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                {showAdvanced ? '🔽 고급 설정 닫기' : '🔼 고급 설정 열기'}
                </button>

              {showAdvanced && (
        <div style={{
                  marginTop: '30px',
                  padding: '30px',
                  background: '#f8fafc',
                  borderRadius: '16px',
                  textAlign: 'left',
                }}>
                  <h3 style={{
                    fontSize: '20px',
            fontWeight: '700',
                    color: '#0d1b2a',
                    marginBottom: '20px',
                  }}>
                    ⚙️ 세부 설정
                  </h3>
                  
                  {purposeConfig.apiType === 'text' && (
          <div style={{
            display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                    }}>
                      <div>
                        <label style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#475569',
                          display: 'block',
                          marginBottom: '8px',
                        }}>
                          평균 입력 토큰
                        </label>
            <div style={{
                          padding: '12px 16px',
                          background: '#ffffff',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '15px',
                          color: '#0d1b2a',
                        }}>
                          {purposeConfig.typicalInput.toLocaleString()} 토큰
                        </div>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#475569',
                          display: 'block',
                          marginBottom: '8px',
                        }}>
                          평균 출력 토큰
                        </label>
                        <div style={{
                          padding: '12px 16px',
                          background: '#ffffff',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '15px',
                          color: '#0d1b2a',
                        }}>
                          {purposeConfig.typicalOutput.toLocaleString()} 토큰
                        </div>
                      </div>
                    </div>
                  )}
                  
              <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginTop: '20px',
                    lineHeight: '1.6',
              }}>
                    💡 이 값들은 일반적인 사용 패턴을 기반으로 한 권장 설정입니다. 
                    실제 사용량에 따라 비용이 달라질 수 있습니다.
              </p>
                </div>
              )}
            </div>
          </>
              )}

        {/* Expert Mode */}
        {viewMode === 'expert' && (
          <>
            {/* API Type Tabs */}
              <div style={{
                display: 'flex',
              gap: '10px',
              marginBottom: '30px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              {apiTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setApiType(tab.id)}
                  style={{
                    background: apiType === tab.id 
                      ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' 
                      : '#ffffff',
                    border: apiType === tab.id ? '2px solid #0ea5e9' : '2px solid #e2e8f0',
                    padding: '16px 28px',
                    borderRadius: '16px',
                    color: apiType === tab.id ? '#ffffff' : '#0ea5e9',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: apiType === tab.id ? '0 8px 20px rgba(14, 165, 233, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                  onMouseEnter={(e) => {
                    if (apiType !== tab.id) {
                      e.currentTarget.style.borderColor = '#0ea5e9';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (apiType !== tab.id) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'none';
                    }
                  }}
                >
                  <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                  {tab.label}
                </button>
          ))}
        </div>

            {/* Calculator Section */}
        <div style={{
          background: '#ffffff',
              borderRadius: '24px',
          padding: 'clamp(20px, 4vw, 40px)',
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.1)',
              marginBottom: 'clamp(20px, 4vw, 40px)',
            }}>
              {apiType === 'text' && (
                <TextCalculator 
                  calc={textCalc} 
                  setCalc={setTextCalc} 
                  cost={textCost}
                  models={textModelPrices[textCalc.tier]}
                />
              )}
              {apiType === 'image-gen' && (
                <ImageCalculator 
                  calc={imageCalc} 
                  setCalc={setImageCalc} 
                  cost={imageCost}
                />
              )}
              {apiType === 'audio' && (
                <AudioCalculator 
                  calc={audioCalc} 
                  setCalc={setAudioCalc}
                />
              )}
              {apiType === 'video' && (
                <VideoCalculator 
                  calc={videoCalc} 
                  setCalc={setVideoCalc}
                />
              )}
              {apiType === 'embedding' && (
                <EmbeddingCalculator 
                  calc={embeddingCalc} 
                  setCalc={setEmbeddingCalc}
                />
              )}
              {apiType === 'transcription' && (
                <TranscriptionCalculator 
                  calc={transcriptionCalc} 
                  setCalc={setTranscriptionCalc}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Text Calculator Component
const TextCalculator: React.FC<any> = ({ calc, setCalc, cost, models }) => {
  const tiers: { id: PricingTier; label: string; description: string }[] = [
    { id: 'batch', label: 'Batch', description: '최저가 (50% 할인)' },
    { id: 'flex', label: 'Flex', description: '저가 유연한 처리' },
    { id: 'standard', label: 'Standard', description: '표준 가격' },
    { id: 'priority', label: 'Priority', description: '고속 처리' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0d1b2a', marginBottom: '30px' }}>
        📝 Text API 비용 계산기
          </h2>

      {/* Tier Selection */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          처리 티어 선택
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '10px' }}>
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setCalc({ ...calc, tier: tier.id, model: Object.keys(textModelPrices[tier.id])[0] })}
              style={{
                background: calc.tier === tier.id ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#ffffff',
                color: calc.tier === tier.id ? '#ffffff' : '#475569',
                border: calc.tier === tier.id ? '2px solid #0ea5e9' : '2px solid #e2e8f0',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
          textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '16px', marginBottom: '4px' }}>{tier.label}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{tier.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Model Selection */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          모델 선택
        </label>
        <select
          value={calc.model}
          onChange={(e) => setCalc({ ...calc, model: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            background: '#ffffff',
            cursor: 'pointer',
            color: '#0d1b2a',
            fontWeight: '500',
          }}
        >
          {Object.entries(models).map(([key, model]: [string, any]) => (
            <option key={key} value={key}>
              {model.name} ({model.category}) - Input: ${model.input}/1M, Output: ${model.output}/1M
            </option>
          ))}
        </select>
      </div>

      {/* Input Tokens */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          입력 토큰 수: {calc.inputTokens.toLocaleString()}
        </label>
        <input
          type="range"
          min="1000"
          max="1000000"
          step="1000"
          value={calc.inputTokens}
          onChange={(e) => setCalc({ ...calc, inputTokens: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>

      {/* Output Tokens */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          출력 토큰 수: {calc.outputTokens.toLocaleString()}
        </label>
        <input
          type="range"
          min="1000"
          max="500000"
          step="1000"
          value={calc.outputTokens}
          onChange={(e) => setCalc({ ...calc, outputTokens: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>

      {/* Token to Text Guide */}
            <div style={{
              background: '#f0f9ff',
        border: '2px solid #0ea5e9',
        borderRadius: '12px',
              padding: '20px',
        marginBottom: '25px',
            }}>
              <h4 style={{
          fontSize: '16px',
                fontWeight: '700',
          color: '#0ea5e9',
          marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
          gap: '8px',
              }}>
          <span>📏</span>
          토큰 ↔ 실제 텍스트 길이 가이드
              </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px',
        }}>
          <div style={{
            background: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e0f2fe',
          }}>
            <h5 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#0d1b2a',
              marginBottom: '12px',
            }}>
              🇰🇷 한글
            </h5>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>• 100자</span>
                <span style={{ fontWeight: '600', color: '#0ea5e9' }}>≈ 200 토큰</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>• 500자</span>
                <span style={{ fontWeight: '600', color: '#0ea5e9' }}>≈ 1,000 토큰</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• A4 1장 (약 1,800자)</span>
                <span style={{ fontWeight: '600', color: '#0ea5e9' }}>≈ 3,600 토큰</span>
              </div>
            </div>
            </div>

            <div style={{
            background: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e0f2fe',
          }}>
            <h5 style={{
              fontSize: '14px',
                fontWeight: '700',
              color: '#0d1b2a',
              marginBottom: '12px',
            }}>
              🇺🇸 영어
            </h5>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>• 100 단어</span>
                <span style={{ fontWeight: '600', color: '#0ea5e9' }}>≈ 130 토큰</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>• 750 단어</span>
                <span style={{ fontWeight: '600', color: '#0ea5e9' }}>≈ 1,000 토큰</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• A4 1장 (약 500 단어)</span>
                <span style={{ fontWeight: '600', color: '#0ea5e9' }}>≈ 650 토큰</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: '#fef3c7',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #ffd60a',
        }}>
              <p style={{
            fontSize: '13px',
            color: '#92400e',
            lineHeight: '1.6',
            margin: 0,
          }}>
            <strong>💡 예시:</strong> 한글 블로그 글 1개 (1,000자) ≈ 입력 200토큰 + 출력 2,000토큰
          </p>
        </div>
            </div>

      {/* Current Selection Example */}
            <div style={{
        background: '#dcfce7',
        border: '2px solid #22c55e',
        borderRadius: '12px',
              padding: '20px',
        marginBottom: '25px',
            }}>
              <h4 style={{
          fontSize: '16px',
                fontWeight: '700',
          color: '#166534',
          marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
          gap: '8px',
              }}>
          <span>✍️</span>
          현재 설정으로 생성 가능한 텍스트 양
              </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}>
          <div>
            <p style={{ fontSize: '13px', color: '#166534', marginBottom: '4px' }}>한글 기준</p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#166534', margin: 0 }}>
              약 {Math.round(calc.outputTokens / 2).toLocaleString()}자
            </p>
            <p style={{ fontSize: '12px', color: '#166534', opacity: 0.8, marginTop: '4px' }}>
              (A4 약 {(calc.outputTokens / 3600).toFixed(1)}장)
            </p>
          </div>
          <div>
            <p style={{ fontSize: '13px', color: '#166534', marginBottom: '4px' }}>영어 기준</p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: '#166534', margin: 0 }}>
              약 {Math.round(calc.outputTokens / 1.3).toLocaleString()} 단어
            </p>
            <p style={{ fontSize: '12px', color: '#166534', opacity: 0.8, marginTop: '4px' }}>
              (A4 약 {(calc.outputTokens / 650).toFixed(1)}장)
              </p>
            </div>
          </div>
        </div>

      {/* Cached Ratio */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          캐시 비율: {calc.cachedRatio}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={calc.cachedRatio}
          onChange={(e) => setCalc({ ...calc, cachedRatio: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
          프롬프트 캐싱을 사용하면 반복되는 입력 토큰의 비용을 최대 90% 절감할 수 있습니다.
        </p>
      </div>

      {/* Cost Display */}
        <div style={{
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        padding: '30px',
        borderRadius: '16px',
        color: '#ffffff',
      }}>
        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
          💰 1회 요청당 예상 비용
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>입력 비용</p>
            <p style={{ fontSize: '28px', fontWeight: '700' }}>${cost.inputCost?.toFixed(4) || '0.0000'}</p>
            <p style={{ fontSize: '15px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((cost.inputCost || 0) * USD_TO_KRW).toFixed(0)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>출력 비용</p>
            <p style={{ fontSize: '28px', fontWeight: '700' }}>${cost.outputCost?.toFixed(4) || '0.0000'}</p>
            <p style={{ fontSize: '15px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((cost.outputCost || 0) * USD_TO_KRW).toFixed(0)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>총 비용</p>
            <p style={{ fontSize: '32px', fontWeight: '800' }}>${cost.perRequest?.toFixed(4) || '0.0000'}</p>
            <p style={{ fontSize: '16px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((cost.perRequest || 0) * USD_TO_KRW).toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Image Calculator Component  
const ImageCalculator: React.FC<any> = ({ calc, setCalc, cost }) => {
  const models = Object.keys(imageGenPrices);
  const qualities = calc.model.includes('dall-e') 
    ? (calc.model === 'dall-e-3' ? ['standard', 'hd'] : ['standard'])
    : ['low', 'medium', 'high'];
  const sizes = Object.keys(imageGenPrices[calc.model]?.quality?.[calc.quality] || {});

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0d1b2a', marginBottom: '30px' }}>
        🎨 Image 생성 비용 계산기
          </h2>

      {/* Model Selection */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          모델 선택
        </label>
        <select
          value={calc.model}
          onChange={(e) => {
            const newModel = e.target.value;
            const newQualities = newModel.includes('dall-e') 
              ? (newModel === 'dall-e-3' ? ['standard', 'hd'] : ['standard'])
              : ['low', 'medium', 'high'];
            const newQuality = newQualities[0];
            const newSizes = Object.keys(imageGenPrices[newModel]?.quality?.[newQuality] || {});
            setCalc({ ...calc, model: newModel, quality: newQuality, size: newSizes[0] });
          }}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            background: '#ffffff',
            cursor: 'pointer',
            color: '#0d1b2a',
            fontWeight: '500',
          }}
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {imageGenPrices[model].name}
            </option>
          ))}
        </select>
      </div>

      {/* Quality Selection */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          품질 선택
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {qualities.map((quality) => (
          <button
              key={quality}
              onClick={() => {
                const newSizes = Object.keys(imageGenPrices[calc.model]?.quality?.[quality] || {});
                setCalc({ ...calc, quality, size: newSizes[0] });
              }}
            style={{
                background: calc.quality === quality ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#ffffff',
                color: calc.quality === quality ? '#ffffff' : '#475569',
                border: calc.quality === quality ? '2px solid #0ea5e9' : '2px solid #e2e8f0',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize',
              }}
            >
              {quality}
          </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          이미지 크기
        </label>
        <select
          value={calc.size}
          onChange={(e) => setCalc({ ...calc, size: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            background: '#ffffff',
            cursor: 'pointer',
            color: '#0d1b2a',
            fontWeight: '500',
          }}
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Image Count */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          생성할 이미지 수: {calc.count}개
        </label>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={calc.count}
          onChange={(e) => setCalc({ ...calc, count: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>

      {/* Cost Display */}
      <div style={{
        background: 'linear-gradient(135deg, #ec4899, #be185d)',
        padding: '30px',
        borderRadius: '16px',
        color: '#ffffff',
      }}>
        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
          💰 예상 비용
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>이미지당 비용</p>
            <p style={{ fontSize: '28px', fontWeight: '700' }}>${cost.perRequest?.toFixed(4) || '0.0000'}</p>
            <p style={{ fontSize: '15px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((cost.perRequest || 0) * USD_TO_KRW).toFixed(0)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>총 비용 ({calc.count}개)</p>
            <p style={{ fontSize: '32px', fontWeight: '800' }}>${cost.total?.toFixed(4) || '0.0000'}</p>
            <p style={{ fontSize: '16px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((cost.total || 0) * USD_TO_KRW).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Audio Calculator Component
const AudioCalculator: React.FC<any> = ({ calc, setCalc }) => {
  const models = Object.keys(audioTokenPrices);
  
  const audioCost = useMemo(() => {
    const model = audioTokenPrices[calc.model];
    if (!model) return { perRequest: 0, inputCost: 0, outputCost: 0 };

    const cachedTokens = calc.inputTokens * (calc.cachedRatio / 100);
    const freshTokens = calc.inputTokens - cachedTokens;
    
    const cachedPrice = model.cachedInput || model.input;
    const inputCost = (cachedTokens / 1_000_000) * cachedPrice + (freshTokens / 1_000_000) * model.input;
    const outputCost = (calc.outputTokens / 1_000_000) * model.output;
    const total = inputCost + outputCost;

    return {
      perRequest: total,
      inputCost,
      outputCost,
    };
  }, [calc]);

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0d1b2a', marginBottom: '30px' }}>
        🎵 Audio API 비용 계산기
          </h2>

      {/* Model Selection */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          모델 선택
        </label>
        <select
          value={calc.model}
          onChange={(e) => setCalc({ ...calc, model: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            background: '#ffffff',
            cursor: 'pointer',
            color: '#0d1b2a',
            fontWeight: '500',
          }}
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {audioTokenPrices[model].name}
            </option>
          ))}
        </select>
      </div>

      {/* Input Tokens */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          입력 오디오 토큰: {calc.inputTokens.toLocaleString()}
        </label>
        <input
          type="range"
          min="1000"
          max="500000"
          step="1000"
          value={calc.inputTokens}
          onChange={(e) => setCalc({ ...calc, inputTokens: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>

      {/* Output Tokens */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          출력 오디오 토큰: {calc.outputTokens.toLocaleString()}
        </label>
        <input
          type="range"
          min="1000"
          max="500000"
          step="1000"
          value={calc.outputTokens}
          onChange={(e) => setCalc({ ...calc, outputTokens: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>

      {/* Cached Ratio */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          캐시 비율: {calc.cachedRatio}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={calc.cachedRatio}
          onChange={(e) => setCalc({ ...calc, cachedRatio: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>

      {/* Cost Display */}
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        padding: '30px',
        borderRadius: '16px',
        color: '#ffffff',
      }}>
        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
          💰 1회 요청당 예상 비용
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>입력 비용</p>
            <p style={{ fontSize: '28px', fontWeight: '700' }}>${audioCost.inputCost?.toFixed(4) || '0.0000'}</p>
            <p style={{ fontSize: '15px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((audioCost.inputCost || 0) * USD_TO_KRW).toFixed(0)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>출력 비용</p>
            <p style={{ fontSize: '28px', fontWeight: '700' }}>${audioCost.outputCost?.toFixed(4) || '0.0000'}</p>
            <p style={{ fontSize: '15px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((audioCost.outputCost || 0) * USD_TO_KRW).toFixed(0)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>총 비용</p>
            <p style={{ fontSize: '32px', fontWeight: '800' }}>${audioCost.perRequest?.toFixed(4) || '0.0000'}</p>
            <p style={{ fontSize: '16px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((audioCost.perRequest || 0) * USD_TO_KRW).toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Video Calculator Component
const VideoCalculator: React.FC<any> = ({ calc, setCalc }) => {
  const models = Object.keys(videoPrices);

  const videoCost = useMemo(() => {
    const model = videoPrices[calc.model];
    if (!model) return { perRequest: 0, total: 0 };

    const total = model.price * calc.seconds;

    return {
      perRequest: model.price,
      total,
      resolution: model.resolution,
    };
  }, [calc]);

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0d1b2a', marginBottom: '30px' }}>
        🎬 Video 생성 비용 계산기
      </h2>

      {/* Model Selection */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          모델 선택
        </label>
        <select
          value={calc.model}
          onChange={(e) => setCalc({ ...calc, model: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            background: '#ffffff',
            cursor: 'pointer',
            color: '#0d1b2a',
            fontWeight: '500',
          }}
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {videoPrices[model].name} ({videoPrices[model].resolution}) - ${videoPrices[model].price}/초
            </option>
          ))}
        </select>
      </div>

      {/* Video Duration */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          비디오 길이: {calc.seconds}초
        </label>
        <input
          type="range"
          min="1"
          max="300"
          step="1"
          value={calc.seconds}
          onChange={(e) => setCalc({ ...calc, seconds: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
          약 {Math.floor(calc.seconds / 60)}분 {calc.seconds % 60}초
        </p>
      </div>

      {/* Cost Display */}
      <div style={{
        background: 'linear-gradient(135deg, #e5c100, #d97706)',
        padding: '30px',
        borderRadius: '16px',
        color: '#ffffff',
      }}>
        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
          💰 예상 비용
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>초당 비용</p>
            <p style={{ fontSize: '28px', fontWeight: '700' }}>${videoCost.perRequest?.toFixed(4) || '0.0000'}</p>
            <p style={{ fontSize: '15px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((videoCost.perRequest || 0) * USD_TO_KRW).toFixed(0)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>총 비용 ({calc.seconds}초)</p>
            <p style={{ fontSize: '32px', fontWeight: '800' }}>${videoCost.total?.toFixed(2) || '0.00'}</p>
            <p style={{ fontSize: '16px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((videoCost.total || 0) * USD_TO_KRW).toLocaleString()}
            </p>
          </div>
        </div>
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <p style={{ fontSize: '13px', opacity: 0.9 }}>해상도: {videoCost.resolution}</p>
        </div>
      </div>
    </div>
  );
};

// Embedding Calculator Component
const EmbeddingCalculator: React.FC<any> = ({ calc, setCalc }) => {
  const models = Object.keys(embeddingPrices);

  const embeddingCost = useMemo(() => {
    const model = embeddingPrices[calc.model];
    if (!model) return { perRequest: 0 };

    const pricePerMToken = calc.tier === 'batch' ? model.batch : model.standard;
    const total = (calc.tokens / 1_000_000) * pricePerMToken;

    return {
      perRequest: total,
      pricePerMToken,
    };
  }, [calc]);

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0d1b2a', marginBottom: '30px' }}>
        🔢 Embedding 비용 계산기
      </h2>

      {/* Model Selection */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          모델 선택
        </label>
        <select
          value={calc.model}
          onChange={(e) => setCalc({ ...calc, model: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            background: '#ffffff',
            cursor: 'pointer',
            color: '#0d1b2a',
            fontWeight: '500',
          }}
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {embeddingPrices[model].name}
            </option>
          ))}
        </select>
      </div>

      {/* Tier Selection */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          처리 티어
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCalc({ ...calc, tier: 'standard' })}
            style={{
              background: calc.tier === 'standard' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#ffffff',
              color: calc.tier === 'standard' ? '#ffffff' : '#475569',
              border: calc.tier === 'standard' ? '2px solid #0ea5e9' : '2px solid #e2e8f0',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              flex: 1,
              transition: 'all 0.3s ease',
            }}
          >
            Standard
          </button>
          <button
            onClick={() => setCalc({ ...calc, tier: 'batch' })}
            style={{
              background: calc.tier === 'batch' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#ffffff',
              color: calc.tier === 'batch' ? '#ffffff' : '#475569',
              border: calc.tier === 'batch' ? '2px solid #0ea5e9' : '2px solid #e2e8f0',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              flex: 1,
              transition: 'all 0.3s ease',
            }}
          >
            Batch (50% 할인)
          </button>
        </div>
      </div>

      {/* Token Count */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          토큰 수: {calc.tokens.toLocaleString()}
        </label>
        <input
          type="range"
          min="10000"
          max="10000000"
          step="10000"
          value={calc.tokens}
          onChange={(e) => setCalc({ ...calc, tokens: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>

      {/* Cost Display */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981, #059669)',
        padding: '30px',
        borderRadius: '16px',
        color: '#ffffff',
      }}>
        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
          💰 예상 비용
        </h3>
        <div>
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>총 비용</p>
          <p style={{ fontSize: '32px', fontWeight: '800' }}>${embeddingCost.perRequest?.toFixed(4) || '0.0000'}</p>
          <p style={{ fontSize: '16px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
            ₩{((embeddingCost.perRequest || 0) * USD_TO_KRW).toLocaleString()}
          </p>
        </div>
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
          <p style={{ fontSize: '13px', opacity: 0.9 }}>
            1M 토큰당: ${embeddingCost.pricePerMToken?.toFixed(2) || '0.00'} (₩{((embeddingCost.pricePerMToken || 0) * USD_TO_KRW).toLocaleString()})
          </p>
        </div>
      </div>
    </div>
  );
};

// Transcription Calculator Component
const TranscriptionCalculator: React.FC<any> = ({ calc, setCalc }) => {
  const models = Object.keys(transcriptionPrices);

  const transcriptionCost = useMemo(() => {
    const model = transcriptionPrices[calc.model];
    if (!model) return { perRequest: 0, total: 0 };

    let total = 0;
    let perMinute = 0;
    
    if (model.costPerMinute) {
      perMinute = model.costPerMinute;
      total = model.costPerMinute * calc.minutes;
    } else if (model.costPer1MChars) {
      // TTS의 경우 (분당 약 150자로 가정)
      perMinute = (model.costPer1MChars / 1_000_000) * 150;
      total = perMinute * calc.minutes;
    }

    return {
      perRequest: perMinute,
      total,
    };
  }, [calc]);

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0d1b2a', marginBottom: '30px' }}>
        🎙️ Transcription/TTS 비용 계산기
      </h2>

      {/* Model Selection */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          모델 선택
        </label>
        <select
          value={calc.model}
          onChange={(e) => setCalc({ ...calc, model: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            background: '#ffffff',
            cursor: 'pointer',
            color: '#0d1b2a',
            fontWeight: '500',
          }}
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {transcriptionPrices[model].name}
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '12px' }}>
          오디오 길이: {calc.minutes}분
        </label>
        <input
          type="range"
          min="1"
          max="300"
          step="1"
          value={calc.minutes}
          onChange={(e) => setCalc({ ...calc, minutes: parseInt(e.target.value) })}
          style={{ width: '100%' }}
        />
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
          약 {Math.floor(calc.minutes / 60)}시간 {calc.minutes % 60}분
        </p>
      </div>

      {/* Cost Display */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        padding: '30px',
        borderRadius: '16px',
        color: '#ffffff',
      }}>
        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
          💰 예상 비용
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>분당 비용</p>
            <p style={{ fontSize: '28px', fontWeight: '700' }}>${transcriptionCost.perRequest?.toFixed(4) || '0.0000'}</p>
            <p style={{ fontSize: '15px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((transcriptionCost.perRequest || 0) * USD_TO_KRW).toFixed(0)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>총 비용 ({calc.minutes}분)</p>
            <p style={{ fontSize: '32px', fontWeight: '800' }}>${transcriptionCost.total?.toFixed(4) || '0.0000'}</p>
            <p style={{ fontSize: '16px', fontWeight: '600', opacity: 0.85, marginTop: '4px' }}>
              ₩{((transcriptionCost.total || 0) * USD_TO_KRW).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostOptimizationExamplesPage;
