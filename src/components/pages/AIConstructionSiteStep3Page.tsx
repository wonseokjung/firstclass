import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Sparkles, 
  Clock, 
  FileText, 
  Image as ImageIcon,
  Tag,
  Play,
  Key,
  Loader2,
  AlertCircle,
  Copy,
  RefreshCw,
  Volume2,
  Pause,
  Download,
  Mic
} from 'lucide-react';
import { callAzureOpenAI } from '../../services/azureOpenAIService';

interface Scene {
  sceneNumber: number;
  startTime: string;
  endTime: string;
  script: string;
  imagePrompt: string;
  generatedImage?: string;
  isGenerating?: boolean;
  // 음성 관련
  generatedAudio?: string;
  isGeneratingAudio?: boolean;
}

interface GeneratedContent {
  title: string;
  description: string;
  tags: string[];
  scenes: Scene[];
}

const AIConstructionSiteStep3Page: React.FC = () => {
  const navigate = useNavigate();
  
  // 입력 상태
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(60);
  const [style, setStyle] = useState('educational');
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [characterImageFile, setCharacterImageFile] = useState<File | null>(null);
  
  // API 키 (Google Gemini API)
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  // ElevenLabs API 키 (TTS)
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [showElevenLabsApiKey, setShowElevenLabsApiKey] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM'); // Rachel (기본)
  
  // 대본 언어 선택
  const [scriptLanguage, setScriptLanguage] = useState('ko'); // 기본: 한국어
  
  // 언어 옵션
  const languageOptions = [
    { code: 'ko', name: '🇰🇷 한국어', label: 'Korean' },
    { code: 'en', name: '🇺🇸 영어', label: 'English' },
    { code: 'ja', name: '🇯🇵 일본어', label: 'Japanese' },
    { code: 'zh', name: '🇨🇳 중국어', label: 'Chinese' },
    { code: 'es', name: '🇪🇸 스페인어', label: 'Spanish' },
    { code: 'fr', name: '🇫🇷 프랑스어', label: 'French' },
    { code: 'de', name: '🇩🇪 독일어', label: 'German' },
  ];
  
  // ElevenLabs 보이스 옵션 (언어별로 분류)
  const voiceOptions: Record<string, Array<{ id: string; name: string; tier: 'free' | 'paid' }>> = {
    ko: [
      { id: 'WqVy7827vjE2r3jWvbnP', name: '🇰🇷 혁 (남성, 내레이션)', tier: 'paid' },
      { id: 'uyVNoMrnUku1dZyVEXwD', name: '🇰🇷 안나 (여성, 내레이션)', tier: 'paid' },
      { id: 'AZnzlk1XvdvUeBnXmlld', name: '🇰🇷 Domi (여성)', tier: 'free' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: '🌐 Bella (여성, 다국어)', tier: 'free' },
      { id: '21m00Tcm4TlvDq8ikWAM', name: '🌐 Rachel (여성, 다국어)', tier: 'free' },
    ],
    en: [
      { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (여성)', tier: 'free' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (여성)', tier: 'free' },
      { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (남성)', tier: 'free' },
      { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (남성)', tier: 'free' },
      { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (남성)', tier: 'free' },
      { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam (남성)', tier: 'free' },
      { id: 'jsCqWAovK2LkecY7zXl4', name: 'Freya (여성)', tier: 'free' },
    ],
    ja: [
      { id: 'Xb7hH8MSUJpSbSDYk0k2', name: '🇯🇵 Alice (여성, 일본어)', tier: 'free' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: '🌐 Bella (여성, 다국어)', tier: 'free' },
    ],
    zh: [
      { id: 'XB0fDUnXU5powFXDhCwa', name: '🇨🇳 Charlotte (여성, 중국어)', tier: 'free' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: '🌐 Bella (여성, 다국어)', tier: 'free' },
    ],
    es: [
      { id: 'GBv7mTt0atIp3Br8iCZE', name: '🇪🇸 Thomas (남성, 스페인어)', tier: 'free' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: '🌐 Bella (여성, 다국어)', tier: 'free' },
    ],
    fr: [
      { id: 'TX3LPaxmHKxFdv7VOQHJ', name: '🇫🇷 Liam (남성, 프랑스어)', tier: 'free' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: '🌐 Bella (여성, 다국어)', tier: 'free' },
    ],
    de: [
      { id: 'nPczCjzI2devNBz1zQrb', name: '🇩🇪 Brian (남성, 독일어)', tier: 'free' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: '🌐 Bella (여성, 다국어)', tier: 'free' },
    ],
  };
  
  // 언어 변경 시 해당 언어의 첫 번째 보이스로 자동 설정
  React.useEffect(() => {
    const voices = voiceOptions[scriptLanguage] || voiceOptions['en'];
    if (voices.length > 0) {
      setSelectedVoice(voices[0].id);
    }
  }, [scriptLanguage]);
  
  // 이미지 생성 모델 선택
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-image');
  
  // 사용 가능한 모델 목록 (이미지 생성 지원 모델만)
  const imageModels = [
    {
      id: 'gemini-2.5-flash-image',
      name: '🍌 Nano Banana (2.5 Flash)',
      description: '빠름 / 무료 티어 있음',
      price: '약 50원/장',
      tier: 'paid',
      type: 'gemini-image'
    },
    {
      id: 'gemini-3-pro-image-preview',
      name: '🍌 Nano Banana Pro (3 Pro)',
      description: '최고 품질 / 4K 지원',
      price: '약 180원/장',
      tier: 'paid',
      type: 'gemini-image'
    },
    {
      id: 'imagen-3.0-generate-002',
      name: '🖼️ Imagen 3',
      description: '구글 전용 이미지 모델',
      price: '약 40원/장',
      tier: 'paid',
      type: 'imagen'
    }
  ];
  
  // 생성 상태
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'idle' | 'script' | 'images' | 'audio'>('idle');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCharacterImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCharacterImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 대본 생성 (Azure GPT)
  // 통합 생성 함수 (대본 + 이미지 한 번에)
  const generateAll = async () => {
    if (!topic.trim()) {
      setError('주제를 입력해주세요.');
      return;
    }

    if (!geminiApiKey.trim()) {
      setError('Google Gemini API 키를 입력해주세요.');
      return;
    }

    // 유료 모델 확인
    const currentModel = imageModels.find(m => m.id === selectedModel);
    if (currentModel?.tier === 'paid') {
      const sceneCount = Math.ceil(duration / 6);
      const confirmPaid = window.confirm(
        `⚠️ 유료 모델 "${currentModel.name}"을 사용합니다.\n` +
        `가격: ${currentModel.price}\n` +
        `약 ${sceneCount}개 이미지 생성 예정\n\n` +
        `계속하시겠습니까?`
      );
      if (!confirmPaid) return;
    }

    setIsGenerating(true);
    setGenerationStep('script');
    setError(null);
    setGeneratedContent(null);

    try {
      // 1단계: 대본 생성
      const sceneCount = Math.ceil(duration / 6);
      
      // 언어 정보 가져오기
      const langInfo = languageOptions.find(l => l.code === scriptLanguage) || languageOptions[0];
      const langLabel = langInfo.label;
      const langName = langInfo.name;
      
      const prompt = `당신은 유튜브 쇼츠/릴스 콘텐츠 전문가입니다.

주제: ${topic}
총 분량: ${duration}초
스타일: ${style === 'educational' ? '교육적이고 정보 전달' : style === 'funny' ? '재미있고 유머러스' : style === 'emotional' ? '감성적이고 공감가는' : '트렌디하고 세련된'}
장면 수: ${sceneCount}개 (각 약 5-6초)
대본 언어: ${langLabel} (${langName})

⚠️ 중요: 모든 대사(script)는 반드시 ${langLabel}로 작성해주세요!

다음 형식으로 JSON을 생성해주세요:

{
  "title": "영상 제목 (${langLabel}로, 클릭하고 싶은 제목)",
  "description": "영상 설명 (${langLabel}로, 2-3문장)",
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"],
  "scenes": [
    {
      "sceneNumber": 1,
      "startTime": "0:00",
      "endTime": "0:06",
      "script": "첫 번째 장면 대사 (${langLabel}로, 자연스럽고 말하기 쉽게)",
      "imagePrompt": "이 장면을 표현하는 이미지 설명 (영어로, 상세하게)"
    }
  ]
}

중요:
- 대사는 한국어로, 자연스럽게 말할 수 있도록
- imagePrompt는 영어로, Gemini Image Generation에서 사용할 수 있도록 상세하게
- 캐릭터가 등장하는 장면으로 구성
- 각 장면은 5-6초 분량의 대사`;

      const response = await callAzureOpenAI([
        { role: 'system', content: '당신은 유튜브 쇼츠/릴스 콘텐츠 전문가입니다. JSON 형식으로만 응답합니다.' },
        { role: 'user', content: prompt }
      ], { maxTokens: 2000 });
      
      // JSON 파싱
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('대본 응답을 파싱할 수 없습니다.');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const content: GeneratedContent = {
        title: parsed.title || '제목 없음',
        description: parsed.description || '설명 없음',
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        scenes: Array.isArray(parsed.scenes) ? parsed.scenes.map((s: any, i: number) => ({
          sceneNumber: s.sceneNumber || i + 1,
          startTime: s.startTime || '0:00',
          endTime: s.endTime || '0:06',
          script: s.script || '',
          imagePrompt: s.imagePrompt || '',
          generatedImage: undefined,
          isGenerating: false
        })) : []
      };
      setGeneratedContent(content);

      // 2단계: 이미지 생성
      setGenerationStep('images');
      
      const updatedScenes = [...content.scenes];
      for (let i = 0; i < updatedScenes.length; i++) {
        const scene = updatedScenes[i];
        scene.isGenerating = true;
        setGeneratedContent({ ...content, scenes: [...updatedScenes] });

        try {
          const fullPrompt = characterImage 
            ? `Based on the character style from the reference image, create: ${scene.imagePrompt}. Maintain consistent character appearance and style.`
            : scene.imagePrompt;

          scene.generatedImage = await generateSingleImage(fullPrompt);
        } catch (imgErr: any) {
          console.error(`장면 ${i + 1} 이미지 생성 실패:`, imgErr);
        }

        scene.isGenerating = false;
        setGeneratedContent({ ...content, scenes: [...updatedScenes] });
      }

      // 3단계: 음성 자동 생성 (ElevenLabs API 키가 있는 경우)
      if (elevenLabsApiKey) {
        setGenerationStep('audio');
        for (let i = 0; i < updatedScenes.length; i++) {
          const scene = updatedScenes[i];
          scene.isGeneratingAudio = true;
          setGeneratedContent({ ...content, scenes: [...updatedScenes] });

          try {
            scene.generatedAudio = await generateSingleAudio(scene.script);
          } catch (audioErr: any) {
            console.error(`장면 ${i + 1} 음성 생성 실패:`, audioErr);
          }

          scene.isGeneratingAudio = false;
          setGeneratedContent({ ...content, scenes: [...updatedScenes] });
        }
      }

    } catch (err: any) {
      console.error('콘텐츠 생성 실패:', err);
      setError(`생성 실패: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('idle');
    }
  };

  // ElevenLabs TTS 음성 생성
  const generateSingleAudio = async (text: string): Promise<string | undefined> => {
    if (!elevenLabsApiKey) {
      console.warn('ElevenLabs API 키가 없습니다');
      return undefined;
    }

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': elevenLabsApiKey,
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2', // 다국어 지원 모델 (한국어 포함)
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.5,
              use_speaker_boost: true
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API 오류: ${response.status} - ${errorText}`);
      }

      // 오디오 Blob을 base64로 변환
      const audioBlob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          resolve(base64Audio);
        };
        reader.readAsDataURL(audioBlob);
      });
    } catch (error: any) {
      console.error('음성 생성 실패:', error);
      throw error;
    }
  };

  // 단일 장면 음성 생성
  const generateSceneAudio = async (sceneIndex: number) => {
    if (!generatedContent || !generatedContent.scenes[sceneIndex]) return;
    
    const scene = generatedContent.scenes[sceneIndex];
    
    setGeneratedContent(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated.scenes = [...updated.scenes];
      updated.scenes[sceneIndex] = { ...updated.scenes[sceneIndex], isGeneratingAudio: true };
      return updated;
    });

    try {
      const audioUrl = await generateSingleAudio(scene.script);
      
      setGeneratedContent(prev => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.scenes = [...updated.scenes];
        updated.scenes[sceneIndex] = { 
          ...updated.scenes[sceneIndex], 
          generatedAudio: audioUrl,
          isGeneratingAudio: false 
        };
        return updated;
      });
    } catch (error: any) {
      console.error(`장면 ${sceneIndex + 1} 음성 생성 실패:`, error);
      setGeneratedContent(prev => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.scenes = [...updated.scenes];
        updated.scenes[sceneIndex] = { ...updated.scenes[sceneIndex], isGeneratingAudio: false };
        return updated;
      });
    }
  };

  // 모든 장면 음성 생성
  const generateAllAudio = async () => {
    if (!generatedContent || !elevenLabsApiKey) return;

    for (let i = 0; i < generatedContent.scenes.length; i++) {
      await generateSceneAudio(i);
    }
  };

  // 오디오 재생
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const playAudio = (audioUrl: string, index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (playingAudioIndex === index) {
      setPlayingAudioIndex(null);
      return;
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingAudioIndex(index);
    
    audio.play();
    audio.onended = () => {
      setPlayingAudioIndex(null);
    };
  };

  // 단일 이미지 생성 API 호출
  const generateSingleImage = async (prompt: string): Promise<string | undefined> => {
    const model = selectedModel;
    const modelInfo = imageModels.find(m => m.id === model);
    
    // Imagen 모델은 다른 엔드포인트 사용
    if (modelInfo?.type === 'imagen' || model.startsWith('imagen-')) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: '1:1',
              safetyFilterLevel: 'block_few'
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API 오류: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const imageData = data.predictions?.[0]?.bytesBase64Encoded;
      return imageData ? `data:image/png;base64,${imageData}` : undefined;
    }
    
    // Gemini 이미지 생성 모델 (Nano Banana / Nano Banana Pro)
    // 캐릭터 이미지가 있으면 참조 이미지로 전달하여 일관성 유지
    const contentParts: any[] = [];
    
    // 캐릭터 참조 이미지 추가 (있는 경우)
    if (characterImage) {
      // data:image/...;base64,... 형식에서 base64 데이터만 추출
      const base64Match = characterImage.match(/^data:([^;]+);base64,(.+)$/);
      if (base64Match) {
        const mimeType = base64Match[1];
        const base64Data = base64Match[2];
        
        contentParts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }
    }
    
    // 프롬프트 추가
    const fullPrompt = characterImage 
      ? `Using the character from the reference image above, create this scene: ${prompt}. The character must look exactly like the reference image - same face, same style, same appearance. Only change the pose and background as described.`
      : prompt;
    
    contentParts.push({ text: fullPrompt });
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: contentParts
          }],
          generationConfig: {
            responseModalities: ["Image"]
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API 오류: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // 응답에서 이미지 파트 찾기
    const parts = data.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    return undefined;
  };

  // 개별 이미지 재생성
  const regenerateSceneImage = async (sceneIndex: number) => {
    if (!generatedContent) return;

    const updatedScenes = [...generatedContent.scenes];
    const scene = updatedScenes[sceneIndex];
    scene.isGenerating = true;
    setGeneratedContent({ ...generatedContent, scenes: [...updatedScenes] });

    try {
      const fullPrompt = characterImage 
        ? `Based on the character style from the reference image, create: ${scene.imagePrompt}. Maintain consistent character appearance and style.`
        : scene.imagePrompt;

      scene.generatedImage = await generateSingleImage(fullPrompt);
    } catch (imgErr: any) {
      console.error(`장면 ${sceneIndex + 1} 이미지 재생성 실패:`, imgErr);
      setError(`장면 ${sceneIndex + 1} 이미지 재생성 실패: ${imgErr.message}`);
    }

    scene.isGenerating = false;
    setGeneratedContent({ ...generatedContent, scenes: [...updatedScenes] });
  };

  // 복사 기능
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('복사되었습니다!');
  };

  // 전체 다운로드 기능
  const downloadAll = async () => {
    if (!generatedContent) return;

    // 대본 텍스트 생성
    let scriptText = `제목: ${generatedContent.title}\n\n`;
    scriptText += `설명: ${generatedContent.description}\n\n`;
    scriptText += `태그: ${(generatedContent.tags || []).map(t => `#${t}`).join(' ')}\n\n`;
    scriptText += `${'='.repeat(50)}\n\n`;
    
    generatedContent.scenes.forEach((scene, i) => {
      scriptText += `[장면 ${scene.sceneNumber}] ${scene.startTime} ~ ${scene.endTime}\n`;
      scriptText += `대사: ${scene.script}\n`;
      scriptText += `이미지 프롬프트: ${scene.imagePrompt}\n\n`;
    });

    // 대본 다운로드
    const scriptBlob = new Blob([scriptText], { type: 'text/plain;charset=utf-8' });
    const scriptUrl = URL.createObjectURL(scriptBlob);
    const scriptLink = document.createElement('a');
    scriptLink.href = scriptUrl;
    scriptLink.download = `${generatedContent.title.slice(0, 30)}_대본.txt`;
    scriptLink.click();
    URL.revokeObjectURL(scriptUrl);

    // 이미지 다운로드
    for (let i = 0; i < generatedContent.scenes.length; i++) {
      const scene = generatedContent.scenes[i];
      if (scene.generatedImage) {
        const imgLink = document.createElement('a');
        imgLink.href = scene.generatedImage;
        imgLink.download = `장면${scene.sceneNumber}_이미지.png`;
        imgLink.click();
        await new Promise(r => setTimeout(r, 300)); // 다운로드 간격
      }
    }

    // 음성 다운로드
    for (let i = 0; i < generatedContent.scenes.length; i++) {
      const scene = generatedContent.scenes[i];
      if (scene.generatedAudio) {
        const audioLink = document.createElement('a');
        audioLink.href = scene.generatedAudio;
        audioLink.download = `장면${scene.sceneNumber}_음성.mp3`;
        audioLink.click();
        await new Promise(r => setTimeout(r, 300)); // 다운로드 간격
      }
    }

    alert('✅ 다운로드 완료! 대본, 이미지, 음성 파일을 확인하세요.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a1628 100%)',
      color: '#ffffff'
    }}>
      {/* 헤더 */}
      <div style={{
        background: 'rgba(10, 10, 26, 0.95)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <button
            onClick={() => navigate('/ai-construction-site')}
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '10px',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#d4af37'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#d4af37',
              margin: 0
            }}>
              🎬 Step 3: AI 영상 콘텐츠 생성기
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
              주제와 캐릭터만 넣으면 대본 + 이미지 자동 생성
            </p>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          gap: '30px'
        }}>
          {/* 왼쪽: 입력 패널 */}
          <div style={{
            background: 'rgba(20, 20, 40, 0.8)',
            borderRadius: '20px',
            padding: '25px',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            height: 'fit-content',
            position: 'sticky',
            top: '100px'
          }}>
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#d4af37',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FileText size={20} />
              콘텐츠 설정
            </h2>

            {/* 주제 입력 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                📌 주제
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 커피 만드는 방법, 주식 투자 팁..."
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  background: 'rgba(10, 10, 26, 0.8)',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* 분량 선택 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                <Clock size={16} style={{ display: 'inline', marginRight: '5px' }} />
                분량
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  background: 'rgba(10, 10, 26, 0.8)',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              >
                <option value={30}>30초 (약 5장면)</option>
                <option value={60}>60초 (약 10장면)</option>
                <option value={90}>90초 (약 15장면)</option>
                <option value={120}>120초 (약 20장면)</option>
              </select>
            </div>

            {/* 스타일 선택 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                🎨 스타일
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  background: 'rgba(10, 10, 26, 0.8)',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              >
                <option value="educational">📚 교육적</option>
                <option value="funny">😂 재미있는</option>
                <option value="emotional">💝 감성적</option>
                <option value="trendy">✨ 트렌디</option>
              </select>
            </div>

            {/* 대본 언어 선택 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                🌍 대본 언어
              </label>
              <select
                value={scriptLanguage}
                onChange={(e) => setScriptLanguage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  background: 'rgba(10, 10, 26, 0.8)',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              >
                {languageOptions.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                marginTop: '6px',
                marginBottom: 0
              }}>
                💡 선택한 언어로 대본이 생성되고, TTS 보이스도 자동으로 맞춰집니다
              </p>
            </div>

            {/* 캐릭터 이미지 업로드 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                🎭 캐릭터 이미지 (선택)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(212, 175, 55, 0.4)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: characterImage ? 'transparent' : 'rgba(212, 175, 55, 0.05)',
                  transition: 'all 0.3s'
                }}
              >
                {characterImage ? (
                  <img
                    src={characterImage}
                    alt="캐릭터"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '150px',
                      borderRadius: '10px'
                    }}
                  />
                ) : (
                  <>
                    <Upload size={30} style={{ color: '#d4af37', marginBottom: '10px' }} />
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                      클릭하여 캐릭터 이미지 업로드
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* 이미지 모델 선택 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '10px'
              }}>
                🤖 이미지 생성 모델
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {imageModels.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: selectedModel === model.id 
                        ? '2px solid #d4af37' 
                        : '1px solid rgba(255,255,255,0.1)',
                      background: selectedModel === model.id 
                        ? 'rgba(212, 175, 55, 0.15)' 
                        : 'rgba(10, 10, 26, 0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ 
                        color: selectedModel === model.id ? '#d4af37' : '#e2e8f0',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        {model.name}
                      </span>
                      <span style={{
                        background: model.tier === 'free' 
                          ? 'linear-gradient(135deg, #10b981, #059669)' 
                          : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        fontWeight: '700'
                      }}>
                        {model.price}
                      </span>
                    </div>
                    <p style={{ 
                      color: '#94a3b8', 
                      fontSize: '0.75rem', 
                      margin: 0 
                    }}>
                      {model.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* API 키 입력 */}
            <div style={{
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#d4af37',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '10px'
              }}>
                <Key size={16} />
                Google Gemini API Key
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="API 키를 입력하세요"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    background: 'rgba(10, 10, 26, 0.8)',
                    color: '#ffffff',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {showApiKey ? '🙈' : '👁️'}
                </button>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                marginTop: '8px',
                marginBottom: 0
              }}>
                ℹ️ API 키는 저장되지 않으며, 이 세션에서만 사용됩니다.
              </p>
            </div>

            {/* ElevenLabs API 키 */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#d4af37',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                <Mic size={16} />
                ElevenLabs API Key (음성 생성, 선택사항)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showElevenLabsApiKey ? 'text' : 'password'}
                  value={elevenLabsApiKey}
                  onChange={(e) => setElevenLabsApiKey(e.target.value)}
                  placeholder="ElevenLabs API 키 (선택)"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    background: 'rgba(10, 10, 26, 0.8)',
                    color: '#ffffff',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  onClick={() => setShowElevenLabsApiKey(!showElevenLabsApiKey)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {showElevenLabsApiKey ? '🙈' : '👁️'}
                </button>
              </div>
              
              {/* 보이스 선택 */}
              {elevenLabsApiKey && (
                <div style={{ marginTop: '10px' }}>
                  <label style={{
                    color: '#94a3b8',
                    fontSize: '0.8rem',
                    marginBottom: '4px',
                    display: 'block'
                  }}>
                    🎙️ 보이스 선택 ({languageOptions.find(l => l.code === scriptLanguage)?.name || '한국어'})
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      background: 'rgba(10, 10, 26, 0.8)',
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                  >
                    {(voiceOptions[scriptLanguage] || voiceOptions['en']).map(voice => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} {voice.tier === 'paid' ? '💎 커스텀' : '✨ 무료'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <p style={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                marginTop: '8px',
                marginBottom: 0
              }}>
                🔊 <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" 
                   style={{ color: '#d4af37' }}>ElevenLabs</a>에서 API 키를 발급받으세요 (무료 10,000자/월)
              </p>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AlertCircle size={18} style={{ color: '#ef4444' }} />
                <span style={{ color: '#fca5a5', fontSize: '0.9rem' }}>{error}</span>
              </div>
            )}

            {/* 통합 생성 버튼 */}
            <button
              onClick={generateAll}
              disabled={isGenerating || !topic.trim() || !geminiApiKey.trim()}
              style={{
                width: '100%',
                padding: '18px',
                borderRadius: '12px',
                border: 'none',
                background: isGenerating 
                  ? 'rgba(212, 175, 55, 0.4)'
                  : 'linear-gradient(135deg, #d4af37, #f4d03f, #d4af37)',
                backgroundSize: '200% 100%',
                color: '#0a0a1a',
                fontSize: '1.1rem',
                fontWeight: '800',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: isGenerating ? 'none' : '0 4px 20px rgba(212, 175, 55, 0.4)',
                transition: 'all 0.3s'
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {generationStep === 'script' ? '📝 대본 생성 중...' : 
                   generationStep === 'images' ? '🎨 이미지 생성 중...' : 
                   '🔊 음성 생성 중...'}
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  🚀 콘텐츠 생성하기
                </>
              )}
            </button>

            {/* 생성 진행 상태 */}
            {isGenerating && (
              <div style={{
                marginTop: '15px',
                padding: '12px',
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: generationStep === 'script' ? '#d4af37' : '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    color: 'white',
                    fontWeight: '700'
                  }}>
                    {generationStep === 'script' ? '1' : '✓'}
                  </div>
                  <span style={{ 
                    color: generationStep === 'script' ? '#d4af37' : '#10b981',
                    fontWeight: '600',
                    fontSize: '0.85rem'
                  }}>
                    대본 생성 {generationStep !== 'script' && '완료'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: generationStep === 'images' ? '#8b5cf6' : generationStep === 'audio' ? '#10b981' : 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    color: 'white',
                    fontWeight: '700'
                  }}>
                    {generationStep === 'audio' ? '✓' : '2'}
                  </div>
                  <span style={{ 
                    color: generationStep === 'images' ? '#8b5cf6' : generationStep === 'audio' ? '#10b981' : '#64748b',
                    fontWeight: '600',
                    fontSize: '0.85rem'
                  }}>
                    이미지 생성 {generationStep === 'images' && '중...'} {generationStep === 'audio' && '완료'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: generationStep === 'audio' ? '#f59e0b' : 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    color: 'white',
                    fontWeight: '700'
                  }}>
                    3
                  </div>
                  <span style={{ 
                    color: generationStep === 'audio' ? '#f59e0b' : '#64748b',
                    fontWeight: '600',
                    fontSize: '0.85rem'
                  }}>
                    음성 생성 {generationStep === 'audio' && '중...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 결과 패널 */}
          <div>
            {!generatedContent ? (
              <div style={{
                background: 'rgba(20, 20, 40, 0.5)',
                borderRadius: '20px',
                padding: '60px',
                textAlign: 'center',
                border: '1px dashed rgba(212, 175, 55, 0.3)'
              }}>
                <Sparkles size={60} style={{ color: '#d4af37', marginBottom: '20px' }} />
                <h3 style={{ color: '#e2e8f0', fontSize: '1.3rem', marginBottom: '10px' }}>
                  콘텐츠를 생성해보세요!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                  왼쪽에서 주제와 설정을 입력하고<br />
                  "대본 생성" 버튼을 클릭하세요
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 제목, 설명, 태그 */}
                <div style={{
                  background: 'rgba(20, 20, 40, 0.8)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <h3 style={{ color: '#d4af37', fontSize: '1rem', margin: 0 }}>📝 제목</h3>
                      <button
                        onClick={() => copyToClipboard(generatedContent.title)}
                        style={{
                          background: 'rgba(212, 175, 55, 0.1)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          color: '#d4af37',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.8rem'
                        }}
                      >
                        <Copy size={14} /> 복사
                      </button>
                    </div>
                    <p style={{
                      color: '#ffffff',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      margin: 0
                    }}>
                      {generatedContent.title}
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <h3 style={{ color: '#d4af37', fontSize: '1rem', margin: 0 }}>📄 설명</h3>
                      <button
                        onClick={() => copyToClipboard(generatedContent.description)}
                        style={{
                          background: 'rgba(212, 175, 55, 0.1)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          color: '#d4af37',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.8rem'
                        }}
                      >
                        <Copy size={14} /> 복사
                      </button>
                    </div>
                    <p style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>
                      {generatedContent.description}
                    </p>
                  </div>

                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <h3 style={{ color: '#d4af37', fontSize: '1rem', margin: 0 }}>
                        <Tag size={16} style={{ display: 'inline', marginRight: '5px' }} />
                        태그
                      </h3>
                      <button
                        onClick={() => copyToClipboard((generatedContent.tags || []).map(t => `#${t}`).join(' '))}
                        style={{
                          background: 'rgba(212, 175, 55, 0.1)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          color: '#d4af37',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.8rem'
                        }}
                      >
                        <Copy size={14} /> 복사
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(generatedContent.tags || []).map((tag, i) => (
                        <span
                          key={i}
                          style={{
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#a78bfa',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '500'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 장면별 대본 & 이미지 */}
                <h3 style={{
                  color: '#d4af37',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '10px 0'
                }}>
                  <Play size={20} />
                  장면별 대본 & 이미지 ({(generatedContent.scenes || []).length}장면)
                </h3>

                {(generatedContent.scenes || []).map((scene, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '16px',
                      padding: '0',
                      border: '1px solid #e5e7eb',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1.2fr 200px',
                      gap: '0',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* 왼쪽: 대사 (한국어) */}
                    <div style={{
                      padding: '20px',
                      borderRight: '1px solid #e5e7eb',
                      background: '#fafafa'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                      }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '700'
                        }}>
                          장면 {scene.sceneNumber}
                        </span>
                        <span style={{ 
                          color: '#6b7280', 
                          fontSize: '0.75rem',
                          background: '#f3f4f6',
                          padding: '3px 8px',
                          borderRadius: '10px'
                        }}>
                          {scene.startTime} ~ {scene.endTime}
                        </span>
                      </div>
                      <p style={{
                        color: '#1f2937',
                        fontSize: '0.95rem',
                        lineHeight: '1.7',
                        margin: 0,
                        fontWeight: '500'
                      }}>
                        {scene.script}
                      </p>
                    </div>

                    {/* 가운데: 이미지 프롬프트 (영어) */}
                    <div style={{
                      padding: '20px',
                      borderRight: '1px solid #e5e7eb',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <p style={{
                        color: '#374151',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        margin: 0,
                        fontStyle: 'italic'
                      }}>
                        {scene.imagePrompt}
                      </p>
                    </div>

                    {/* 오른쪽: 생성 이미지 + 재생성 버튼 */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '15px',
                      background: '#f8fafc',
                      position: 'relative'
                    }}>
                      {/* 이미지 영역 */}
                      <div style={{
                        width: '160px',
                        height: '100px',
                        background: scene.generatedImage ? 'transparent' : '#e5e7eb',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        marginBottom: '10px',
                        border: '1px solid #d1d5db'
                      }}>
                        {scene.isGenerating ? (
                          <div style={{ textAlign: 'center' }}>
                            <Loader2 size={24} style={{ color: '#3b82f6' }} className="animate-spin" />
                          </div>
                        ) : scene.generatedImage ? (
                          <img
                            src={scene.generatedImage}
                            alt={`장면 ${scene.sceneNumber}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <ImageIcon size={30} style={{ color: '#9ca3af' }} />
                        )}
                      </div>

                      {/* 버튼 영역 */}
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                      }}>
                        {/* 이미지 재생성 버튼 */}
                        <button
                          onClick={() => {
                            if (!geminiApiKey.trim()) {
                              setError('API 키를 먼저 입력해주세요.');
                              return;
                            }
                            regenerateSceneImage(index);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <RefreshCw size={12} />
                          이미지
                        </button>

                        {/* 음성 생성/재생 버튼 */}
                        {elevenLabsApiKey && (
                          <>
                            {scene.generatedAudio ? (
                              <button
                                onClick={() => playAudio(scene.generatedAudio!, index)}
                                style={{
                                  background: playingAudioIndex === index 
                                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                    : 'linear-gradient(135deg, #22c55e, #16a34a)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {playingAudioIndex === index ? (
                                  <>
                                    <Pause size={12} />
                                    정지
                                  </>
                                ) : (
                                  <>
                                    <Play size={12} />
                                    재생
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => generateSceneAudio(index)}
                                disabled={scene.isGeneratingAudio}
                                style={{
                                  background: scene.isGeneratingAudio 
                                    ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                                    : 'linear-gradient(135deg, #d4af37, #f4d03f)',
                                  color: scene.isGeneratingAudio ? 'white' : '#0a0a1a',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  cursor: scene.isGeneratingAudio ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {scene.isGeneratingAudio ? (
                                  <>
                                    <Loader2 size={12} className="animate-spin" />
                                    생성중
                                  </>
                                ) : (
                                  <>
                                    <Volume2 size={12} />
                                    음성
                                  </>
                                )}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* 전체 음성 생성 버튼 */}
                {/* 하단 버튼 영역 */}
                {generatedContent && generatedContent.scenes && generatedContent.scenes.length > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    marginTop: '20px',
                    flexWrap: 'wrap'
                  }}>
                    {/* 음성 재생성 버튼 (ElevenLabs 키가 있을 때만) */}
                    {elevenLabsApiKey && (
                      <button
                        onClick={generateAllAudio}
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
                        }}
                      >
                        <Mic size={18} />
                        🔊 음성 재생성
                      </button>
                    )}
                    
                    {/* 전체 다운로드 버튼 */}
                    <button
                      onClick={downloadAll}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <Download size={18} />
                      📥 전체 다운로드
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AIConstructionSiteStep3Page;

