import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  NodeTypes,
  MiniMap,
  useReactFlow,
  Panel,
  NodeResizer,
  OnSelectionChangeParams,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  ArrowLeft,
  Play,
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  Sparkles,
  Settings,
  X,
  Check,
  Loader2,
  Download,
  RefreshCw,
  Pause,
  Key,
  Save,
  Eye,
  Film,
  GripVertical
} from 'lucide-react';
import { callAzureOpenAI } from '../../services/azureOpenAIService';

// ResizeObserver 에러 완전 무시 + React 개발 오버레이 숨김
if (typeof window !== 'undefined') {
  // 1. window.onerror 핸들러
  window.onerror = (msg) => {
    if (msg && msg.toString().includes('ResizeObserver')) return true;
    return false;
  };
  
  // 2. error 이벤트 리스너
  window.addEventListener('error', (e) => {
    if (e.message?.includes('ResizeObserver') || e.message?.includes('loop')) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return true;
    }
  });
  
  // 3. console.error 필터링
  const origConsoleError = console.error;
  console.error = (...args) => {
    if (args[0]?.toString?.().includes?.('ResizeObserver')) return;
    if (args[0]?.toString?.().includes?.('loop')) return;
    origConsoleError.apply(console, args);
  };
  
  // 4. React 개발 에러 오버레이 숨김 (CSS)
  const style = document.createElement('style');
  style.innerHTML = `
    iframe#webpack-dev-server-client-overlay { display: none !important; }
    body > iframe { display: none !important; }
  `;
  document.head.appendChild(style);
}

// 타입 정의
interface Scene {
  sceneNumber: number;
  startTime: string;
  endTime: string;
  narration: string;
  imagePrompt: string;
  generatedImage?: string;
  generatedAudio?: string;
  isGeneratingImage?: boolean;
  isGeneratingAudio?: boolean;
}

interface GeneratedContent {
  title: string;
  description: string;
  tags: string[];
  scenes: Scene[];
}

interface NodeData {
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  nodeType: 'input' | 'ai' | 'output';
  progress?: number;
  // 인터랙티브 노드용
  topic?: string;
  onTopicChange?: (value: string) => void;
  thumbnail?: string;
  sceneCount?: number;
}

// Confetti 컴포넌트
const Confetti: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: ['#d4af37', '#f4d03f', '#3b82f6', '#10b981', '#f43f5e', '#8b5cf6'][Math.floor(Math.random() * 6)]
  }));

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-20px',
            width: '10px',
            height: '10px',
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`
          }}
        />
      ))}
    </div>
  );
};

// 파티클 배경 컴포넌트
const ParticleBackground: React.FC = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 10
  }));

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: 'rgba(212, 175, 55, 0.3)',
            borderRadius: '50%',
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
          }}
        />
      ))}
    </div>
  );
};

// 커스텀 노드 컴포넌트 (인터랙티브! - 이미지처럼 예쁘게)
const WorkflowNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  const isRunning = data.status === 'running';
  const isOutput = data.label.includes('출력');
  
  const getStatusIcon = () => {
    switch (data.status) {
      case 'running':
        return <Loader2 size={14} className="animate-spin" style={{ color: '#0a0a1a' }} />;
      case 'completed':
        return <Check size={14} style={{ color: 'white' }} />;
      case 'error':
        return <X size={14} style={{ color: 'white' }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 노드 리사이저 - 선택 시 표시 */}
      <NodeResizer
        isVisible={selected}
        minWidth={100}
        minHeight={60}
        handleStyle={{
          width: '14px',
          height: '14px',
          background: '#ffffff',
          border: `3px solid ${data.color}`,
          borderRadius: '50%',
          boxShadow: `0 0 12px ${data.color}, 0 4px 8px rgba(0,0,0,0.3)`
        }}
        lineStyle={{
          border: `2px dashed rgba(255,255,255,0.9)`,
          borderRadius: '18px'
        }}
      />
      
      <div
        className={isRunning ? 'node-pulse' : ''}
        style={{
          background: `linear-gradient(145deg, ${data.color}dd, ${data.color}aa)`,
          border: selected ? '3px solid #ffffff' : `2px solid ${data.color}`,
          borderRadius: '16px',
          padding: '0',
          width: '100%',
          height: '100%',
          minWidth: '100px',
          minHeight: '60px',
          boxShadow: isRunning 
            ? `0 0 40px ${data.color}, 0 0 80px ${data.color}80`
            : selected 
              ? `0 8px 32px ${data.color}80, 0 0 0 4px rgba(255,255,255,0.4)` 
              : `0 6px 24px ${data.color}50`,
          transition: 'box-shadow 0.2s ease, border 0.2s ease',
          cursor: 'pointer',
          animation: isRunning ? 'glow-pulse 1.5s ease-in-out infinite' : 'none',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none' // IE
        } as React.CSSProperties}
      >
      {/* 상태 배지 */}
      {data.status !== 'idle' && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: data.status === 'completed' ? '#10b981' : data.status === 'running' ? '#fbbf24' : '#ef4444',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid white',
          boxShadow: `0 2px 8px ${data.status === 'completed' ? '#10b981' : data.status === 'running' ? '#fbbf24' : '#ef4444'}60`,
          animation: data.status === 'running' ? 'badge-pulse 1s ease-in-out infinite' : 'none'
        }}>
          {getStatusIcon()}
        </div>
      )}
      
      {/* 헤더 */}
      <div style={{
        padding: '8px 10px 6px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
        overflow: 'hidden',
        minWidth: 0
      }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '8px', 
          padding: '6px', 
          display: 'flex',
          flexShrink: 0
        }}>
          {data.icon}
        </div>
        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <span style={{ 
            color: 'white', 
            fontWeight: '700', 
            fontSize: '0.85rem', 
            display: 'block', 
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {data.label}
          </span>
        </div>
      </div>
      
      {/* 인터랙티브 컨텐츠 영역 */}
      <div style={{ padding: '6px 8px 8px 8px', flex: 1, overflow: 'hidden', minWidth: 0 }}>
        
        {/* 출력 에이전트: 썸네일 미리보기 */}
        {isOutput && data.thumbnail && (
          <div style={{ 
            marginBottom: '8px', 
            borderRadius: '8px', 
            overflow: 'hidden',
            background: '#0a0a1a',
            aspectRatio: '16/9'
          }}>
            <img 
              src={data.thumbnail} 
              alt="미리보기" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        )}
        
        {/* 출력 에이전트: 장면 수 표시 */}
        {isOutput && data.sceneCount !== undefined && data.sceneCount > 0 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            marginBottom: '6px',
            padding: '6px 8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '6px'
          }}>
            <Check size={12} color="white" />
            <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: '600' }}>
              {data.sceneCount}개 장면 완료
            </span>
          </div>
        )}
        
        {/* 진행률 바 */}
        {isRunning && data.progress !== undefined && (
          <div style={{ marginTop: '8px', background: '#ffffff20', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${data.progress}%`, height: '100%', background: data.color, transition: 'width 0.3s', borderRadius: '4px' }} />
          </div>
        )}
      </div>
      
      {/* 핸들 */}
      {data.nodeType !== 'input' && (
        <Handle 
          type="target" 
          position={Position.Left} 
          style={{ 
            width: '14px', 
            height: '14px', 
            background: data.color, 
            border: '3px solid #1e1e2e',
            boxShadow: `0 0 10px ${data.color}80`
          }} 
        />
      )}
      {data.nodeType !== 'output' && (
        <Handle 
          type="source" 
          position={Position.Right} 
          style={{ 
            width: '14px', 
            height: '14px', 
            background: data.color, 
            border: '3px solid #1e1e2e',
            boxShadow: `0 0 10px ${data.color}80`
          }} 
        />
      )}
    </div>
    </div>
  );
};

// 데이터 흐름 파티클 엣지 (향후 사용 예정)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FlowingEdge = ({ id, sourceX, sourceY, targetX, targetY, style }: any) => {
  const edgePath = `M ${sourceX} ${sourceY} C ${sourceX + 100} ${sourceY} ${targetX - 100} ${targetY} ${targetX} ${targetY}`;
  
  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
      />
      {/* 흐르는 파티클 */}
      <circle r="4" fill="#d4af37" className="edge-particle">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
      <circle r="3" fill="#f4d03f" className="edge-particle">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} begin="0.5s" />
      </circle>
      <circle r="2" fill="#fef3c7" className="edge-particle">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} begin="1s" />
      </circle>
    </>
  );
};

// 스티키 노트 색상 옵션 (깔끔한 파스텔)
const stickyColors = [
  { name: '화이트', bg: '#ffffff', border: '#e5e7eb', text: '#374151', shadow: 'rgba(0,0,0,0.1)' },
  { name: '크림', bg: '#fffbeb', border: '#fcd34d', text: '#92400e', shadow: 'rgba(251,191,36,0.2)' },
  { name: '민트', bg: '#ecfdf5', border: '#6ee7b7', text: '#065f46', shadow: 'rgba(16,185,129,0.2)' },
  { name: '라벤더', bg: '#f5f3ff', border: '#c4b5fd', text: '#5b21b6', shadow: 'rgba(139,92,246,0.2)' },
  { name: '로즈', bg: '#fff1f2', border: '#fda4af', text: '#9f1239', shadow: 'rgba(244,63,94,0.2)' },
];

// 깔끔한 메모 노드 (리사이즈 가능)
const StickyNoteNode = ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
  const color = stickyColors[data.colorIndex || 0];
  const [size, setSize] = React.useState({ width: data.width || 180, height: data.height || 120 });
  const [isResizing, setIsResizing] = React.useState(false);
  
  const handleResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(120, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(80, startHeight + (moveEvent.clientY - startY));
      setSize({ width: newWidth, height: newHeight });
      data.onResize?.(id, newWidth, newHeight);
    };
    
    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  return (
    <div
      style={{
        width: `${size.width}px`,
        background: color.bg,
        border: selected ? `2px solid ${color.border}` : `1px solid ${color.border}80`,
        borderRadius: '12px',
        boxShadow: selected 
          ? `0 10px 40px ${color.shadow}, 0 0 0 3px ${color.border}40` 
          : `0 4px 20px ${color.shadow}`,
        transition: isResizing ? 'none' : 'all 0.2s ease',
        overflow: 'hidden'
      }}
    >
      {/* 헤더 */}
      <div style={{
        background: `linear-gradient(135deg, ${color.border}20, ${color.border}10)`,
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${color.border}30`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color.border }} />
          <span style={{ fontSize: '0.7rem', color: color.text, fontWeight: '600', opacity: 0.8 }}>메모</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); data.onDelete?.(id); }}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: color.text,
            opacity: 0.4,
            fontSize: '0.9rem',
            lineHeight: 1,
            padding: '2px'
          }}
        >×</button>
      </div>
      
      {/* 텍스트 영역 */}
      <textarea
        value={data.text || ''}
        onChange={(e) => data.onTextChange?.(id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        placeholder="메모 입력..."
        style={{
          width: '100%',
          height: `${size.height - 70}px`,
          padding: '12px',
          border: 'none',
          background: 'transparent',
          color: color.text,
          fontSize: '0.85rem',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          resize: 'none',
          outline: 'none',
          lineHeight: 1.5
        }}
      />
      
      {/* 하단 툴바 */}
      {selected && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          borderTop: `1px solid ${color.border}20`,
          background: `${color.border}08`
        }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {stickyColors.map((c, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); data.onColorChange?.(id, i); }}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '4px',
                  border: data.colorIndex === i ? `2px solid ${c.border}` : `1px solid ${c.border}60`,
                  background: c.bg,
                  cursor: 'pointer',
                  transition: 'transform 0.1s',
                  transform: data.colorIndex === i ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
          {/* 리사이즈 핸들 */}
          <div
            onMouseDown={handleResize}
            style={{
              cursor: 'se-resize',
              padding: '4px',
              opacity: 0.4
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke={color.text} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// 텍스트 노드 (인피니티 노트 스타일)
const TextNode = ({ id, data, selected }: { id: string; data: any; selected: boolean }) => {
  const [fontSize, setFontSize] = React.useState(data.fontSize || 16);
  
  return (
    <div
      style={{
        minWidth: '100px',
        maxWidth: '400px',
        padding: selected ? '8px' : '4px',
        background: selected ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
        border: selected ? '2px dashed #d4af37' : '2px dashed transparent',
        borderRadius: '8px',
        transition: 'all 0.2s'
      }}
    >
      <textarea
        value={data.text || ''}
        onChange={(e) => data.onTextChange?.(id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        placeholder="텍스트 입력..."
        style={{
          width: '100%',
          minHeight: '30px',
          padding: '0',
          border: 'none',
          background: 'transparent',
          color: data.color || '#e2e8f0',
          fontSize: `${fontSize}px`,
          fontWeight: data.bold ? '700' : '400',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          resize: 'none',
          outline: 'none',
          lineHeight: 1.4,
          overflow: 'hidden'
        }}
        rows={1}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = target.scrollHeight + 'px';
        }}
      />
      
      {/* 텍스트 툴바 */}
      {selected && (
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          marginTop: '8px',
          padding: '6px',
          background: '#1a1a2e',
          borderRadius: '6px',
          alignItems: 'center'
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); setFontSize(Math.max(12, fontSize - 2)); data.onFontSizeChange?.(id, fontSize - 2); }}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}
          >A-</button>
          <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{fontSize}px</span>
          <button
            onClick={(e) => { e.stopPropagation(); setFontSize(Math.min(48, fontSize + 2)); data.onFontSizeChange?.(id, fontSize + 2); }}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}
          >A+</button>
          <div style={{ width: '1px', height: '14px', background: '#ffffff20' }} />
          <button
            onClick={(e) => { e.stopPropagation(); data.onDelete?.(id); }}
            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem' }}
          >삭제</button>
        </div>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = { 
  workflow: WorkflowNode,
  sticky: StickyNoteNode,
  text: TextNode
};

// 줌 슬라이더 컴포넌트 (크고 예쁘게!)
const ZoomSlider = () => {
  const { zoomIn, zoomOut, setViewport, getViewport, fitView } = useReactFlow();
  const [zoom, setZoom] = React.useState(1);
  
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    const viewport = getViewport();
    setViewport({ ...viewport, zoom: newZoom });
  };
  
  // 실시간 줌 업데이트
  React.useEffect(() => {
    const interval = setInterval(() => {
      const viewport = getViewport();
      setZoom(viewport.zoom);
    }, 100);
    return () => clearInterval(interval);
  }, [getViewport]);
  
  const zoomPercent = Math.round(zoom * 100);
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
      backdropFilter: 'blur(20px)',
      padding: '16px 24px',
      borderRadius: '20px',
      border: '1px solid rgba(0,0,0,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)'
    }}>
      {/* 줌 아웃 버튼 */}
      <button 
        onClick={() => zoomOut()}
        style={{
          background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
          border: 'none',
          borderRadius: '12px',
          color: '#475569',
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: '300',
          transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >−</button>
      
      {/* 슬라이더 영역 */}
      <div style={{ position: 'relative', width: '180px' }}>
        {/* 트랙 배경 */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          height: '8px',
          background: '#e2e8f0',
          borderRadius: '4px'
        }} />
        {/* 채워진 트랙 */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          height: '8px',
          width: `${(zoom - 0.1) / 1.9 * 100}%`,
          background: 'linear-gradient(90deg, #ec4899, #f43f5e)',
          borderRadius: '4px'
        }} />
        {/* 슬라이더 핸들 */}
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.05"
          value={zoom}
          onChange={handleZoomChange}
          style={{
            width: '100%',
            height: '44px',
            appearance: 'none',
            background: 'transparent',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 2
          }}
        />
      </div>
      
      {/* 줌 인 버튼 */}
      <button 
        onClick={() => zoomIn()}
        style={{
          background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
          border: 'none',
          borderRadius: '12px',
          color: '#475569',
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: '300',
          transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >+</button>
      
      {/* 줌 퍼센트 표시 */}
      <div style={{
        background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: '700',
        minWidth: '60px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)'
      }}>
        {zoomPercent}%
      </div>
      
      {/* 핏뷰 버튼 */}
      <button 
        onClick={() => fitView({ padding: 0.2 })}
        style={{
          background: 'linear-gradient(135deg, #1e1e2e, #2d2d3e)',
          border: 'none',
          borderRadius: '12px',
          color: '#d4af37',
          padding: '10px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          fontWeight: '600',
          transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
        Fit
      </button>
    </div>
  );
};

// 노드 크기 설정 패널 (향후 사용 예정)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NodeSizeSettings = ({ nodeSize, onNodeSizeChange }: { 
  nodeSize: { width: number; height: number }; 
  onNodeSizeChange: (size: { width: number; height: number }) => void 
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
      backdropFilter: 'blur(20px)',
      padding: '12px 20px',
      borderRadius: '16px',
      border: '1px solid rgba(0,0,0,0.08)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <span style={{ color: '#64748b', fontSize: '1rem', fontWeight: '600' }}>노드 크기</span>
      
      {/* 작게 */}
      <button
        onClick={() => onNodeSizeChange({ width: 140, height: 100 })}
        style={{
          background: nodeSize.width <= 140 ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : '#f1f5f9',
          color: nodeSize.width <= 140 ? 'white' : '#64748b',
          border: 'none',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >S</button>
      
      {/* 중간 */}
      <button
        onClick={() => onNodeSizeChange({ width: 180, height: 120 })}
        style={{
          background: nodeSize.width > 140 && nodeSize.width <= 180 ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : '#f1f5f9',
          color: nodeSize.width > 140 && nodeSize.width <= 180 ? 'white' : '#64748b',
          border: 'none',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >M</button>
      
      {/* 크게 */}
      <button
        onClick={() => onNodeSizeChange({ width: 240, height: 160 })}
        style={{
          background: nodeSize.width > 180 ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : '#f1f5f9',
          color: nodeSize.width > 180 ? 'white' : '#64748b',
          border: 'none',
          borderRadius: '8px',
          padding: '6px 12px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >L</button>
    </div>
  );
};

// CSS 스타일 (슬라이더 핸들)
const sliderStyles = `
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #ec4899, #f43f5e);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
    border: 3px solid white;
    transition: transform 0.15s;
  }
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
  input[type="range"]::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #ec4899, #f43f5e);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
    border: 3px solid white;
  }
`;


// 색상 정의
const COLORS = {
  input: '#3b82f6',    // 파란색 - 인풋 그룹 (유튜브 PD, 말투)
  generate: '#8b5cf6', // 보라색 - 생성 그룹 (대본, 음성)
  visual: '#ec4899',   // 분홍색 - 비주얼 그룹 (캐릭터, 이미지)
  output: '#d4af37'    // 골드 - 출력 그룹
};

// 초기 노드 - 에이전트 스타일
const createInitialNodes = (): Node<NodeData>[] => [
  {
    id: 'input',
    type: 'workflow',
    position: { x: 50, y: 200 },
    data: { 
      label: '🎬 유튜브 PD 에이전트', 
      subtitle: '주제 / 분량 / 스타일', 
      icon: <FileText size={20} color="white" />, 
      color: COLORS.input, 
      status: 'idle', 
      nodeType: 'input' 
    }
  },
  {
    id: 'tone',
    type: 'workflow',
    position: { x: 280, y: 80 },
    data: { 
      label: '🎭 말투 에이전트', 
      subtitle: '나레이션 스타일 / 예제', 
      icon: <Mic size={20} color="white" />, 
      color: COLORS.input, 
      status: 'idle', 
      nodeType: 'ai' 
    }
  },
  {
    id: 'script',
    type: 'workflow',
    position: { x: 510, y: 200 },
    data: { 
      label: '✍️ 대본 에이전트', 
      subtitle: 'Azure GPT-4o', 
      icon: <Sparkles size={20} color="white" />, 
      color: COLORS.generate, 
      status: 'idle', 
      nodeType: 'ai' 
    }
  },
  {
    id: 'character',
    type: 'workflow',
    position: { x: 740, y: 80 },
    data: { 
      label: '👤 캐릭터 입력', 
      subtitle: '일관된 캐릭터 스타일', 
      icon: <ImageIcon size={20} color="white" />, 
      color: COLORS.visual, 
      status: 'idle', 
      nodeType: 'ai' 
    }
  },
  {
    id: 'image',
    type: 'workflow',
    position: { x: 970, y: 130 },
    data: { 
      label: '🎨 이미지 에이전트', 
      subtitle: 'Pollinations AI', 
      icon: <ImageIcon size={20} color="white" />, 
      color: COLORS.visual, 
      status: 'idle', 
      nodeType: 'ai' 
    }
  },
  {
    id: 'audio',
    type: 'workflow',
    position: { x: 740, y: 320 },
    data: { 
      label: '🎙️ 음성 에이전트', 
      subtitle: 'ElevenLabs TTS', 
      icon: <Mic size={20} color="white" />, 
      color: COLORS.generate, 
      status: 'idle', 
      nodeType: 'ai' 
    }
  },
  {
    id: 'output',
    type: 'workflow',
    position: { x: 1200, y: 220 },
    data: { 
      label: '📹 출력 에이전트', 
      subtitle: '미리보기 / 다운로드', 
      icon: <Video size={20} color="white" />, 
      color: COLORS.output, 
      status: 'idle', 
      nodeType: 'output' 
    }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'tone', target: 'script', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
  { id: 'e2', source: 'input', target: 'script', animated: true, style: { stroke: '#3b82f6', strokeWidth: 3 } },
  { id: 'e3', source: 'character', target: 'image', animated: true, style: { stroke: '#ec4899', strokeWidth: 3 } },
  { id: 'e4', source: 'script', target: 'image', animated: true, style: { stroke: '#ec4899', strokeWidth: 3 } },
  { id: 'e5', source: 'script', target: 'audio', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 3 } },
  { id: 'e6', source: 'image', target: 'output', animated: true, style: { stroke: '#d4af37', strokeWidth: 3 } },
  { id: 'e7', source: 'audio', target: 'output', animated: true, style: { stroke: '#d4af37', strokeWidth: 3 } },
];

// 이미지 모델 옵션
const imageModels = [
  { id: 'pollinations', name: '🆓 Pollinations (무료)', tier: 'free', needsKey: false },
  { id: 'gemini-3-pro-image-preview', name: '🍌 Nano Banana (Gemini 3)', tier: 'paid', needsKey: true },
  { id: 'gemini-3-pro-image-4k', name: '🍌 Nano Banana Pro (4K)', tier: 'paid', needsKey: true },
];

const AIConstructionSiteStep3Page: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes());
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>('input');
  
  // 설정 상태
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30);
  const [style, setStyle] = useState('educational');
  const [scriptLanguage, setScriptLanguage] = useState('ko');
  const [videoFormat, setVideoFormat] = useState<'short' | 'long'>('short'); // 숏폼/롱폼
  const [videoPurpose, setVideoPurpose] = useState('views'); // 영상 목적
  const [narrationStyle, setNarrationStyle] = useState<'narration' | 'documentary' | 'tutorial' | 'custom'>('narration'); // 나레이션 스타일
  const [customToneExample, setCustomToneExample] = useState(''); // 커스텀 말투 예제
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [characterImageBase64, setCharacterImageBase64] = useState<string | null>(null);
  
  // API 키
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [saveGeminiKey, setSaveGeminiKey] = useState(false);
  const [saveElevenLabsKey, setSaveElevenLabsKey] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM');
  const [selectedModel, setSelectedModel] = useState('pollinations');
  const [selectedAudioModel, setSelectedAudioModel] = useState<'elevenlabs' | 'google'>('elevenlabs');
  const [googleVoice, setGoogleVoice] = useState('ko-KR-Wavenet-A');
  
  // 생성 결과
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  
  // 미리보기/영상 생성
  const [showPreview, setShowPreview] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [enlargedImageIndex, setEnlargedImageIndex] = useState<number | null>(null);
  
  // 오디오 재생
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 패널 리사이즈
  const [panelWidth, setPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  
  // Confetti
  const [showConfetti, setShowConfetti] = useState(false);
  
  // 에러 알림
  const [audioError, setAudioError] = useState<string | null>(null);

  // localStorage에서 API 키 로드
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('gemini_api_key');
    const savedElevenLabsKey = localStorage.getItem('elevenlabs_api_key');
    if (savedGeminiKey) { setGeminiApiKey(savedGeminiKey); setSaveGeminiKey(true); }
    if (savedElevenLabsKey) { setElevenLabsApiKey(savedElevenLabsKey); setSaveElevenLabsKey(true); }
  }, []);


  // 패널 리사이즈 핸들러
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      setPanelWidth(Math.max(280, Math.min(500, newWidth)));
    };
    const handleMouseUp = () => setIsResizing(false);
    
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // 노드 상태 업데이트
  const updateNodeStatus = useCallback((nodeId: string, status: NodeData['status'], progress?: number) => {
    setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, status, progress } } : n));
  }, [setNodes]);

  // 모든 노드 초기화
  const resetAllNodes = useCallback(() => {
    ['input', 'tone', 'script', 'character', 'image', 'audio', 'output'].forEach(id => updateNodeStatus(id, 'idle'));
  }, [updateNodeStatus]);

  // 스티키 노트 추가
  const addStickyNote = useCallback(() => {
    const newId = `sticky_${Date.now()}`;
    const newStickyNode = {
      id: newId,
      type: 'sticky',
      position: { x: 100 + Math.random() * 200, y: 50 + Math.random() * 100 },
      data: {
        text: '',
        colorIndex: 0,
        width: 180,
        height: 120,
        onTextChange: (nodeId: string, text: string) => {
          setNodes((nodes) => nodes.map((n) => 
            n.id === nodeId ? { ...n, data: { ...n.data, text } } : n
          ));
        },
        onColorChange: (nodeId: string, colorIndex: number) => {
          setNodes((nodes) => nodes.map((n) => 
            n.id === nodeId ? { ...n, data: { ...n.data, colorIndex } } : n
          ));
        },
        onDelete: (nodeId: string) => {
          setNodes((nodes) => nodes.filter((n) => n.id !== nodeId));
        },
        onResize: (nodeId: string, width: number, height: number) => {
          setNodes((nodes) => nodes.map((n) => 
            n.id === nodeId ? { ...n, data: { ...n.data, width, height } } : n
          ));
        }
      }
    } as Node;
    setNodes((nds) => [...nds, newStickyNode]);
  }, [setNodes]);

  // 텍스트 노드 추가
  const addTextNode = useCallback(() => {
    const newId = `text_${Date.now()}`;
    const newNode: Node = {
      id: newId,
      type: 'text',
      position: { x: 150 + Math.random() * 200, y: 80 + Math.random() * 100 },
      data: {
        text: '',
        fontSize: 18,
        color: '#e2e8f0',
        bold: false,
        onTextChange: (nodeId: string, text: string) => {
          setNodes((nds) => nds.map((n) => 
            n.id === nodeId ? { ...n, data: { ...n.data, text } } : n
          ));
        },
        onFontSizeChange: (nodeId: string, fontSize: number) => {
          setNodes((nds) => nds.map((n) => 
            n.id === nodeId ? { ...n, data: { ...n.data, fontSize } } : n
          ));
        },
        onDelete: (nodeId: string) => {
          setNodes((nds) => nds.filter((n) => n.id !== nodeId));
        }
      }
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCharacterImage(result);
        // base64 부분만 추출
        const base64 = result.split(',')[1];
        setCharacterImageBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // 단일 이미지 생성 (캐릭터 이미지 적용!)
  const generateSingleImage = async (prompt: string, sceneIndex: number): Promise<string | undefined> => {
    // Pollinations (무료)
    if (selectedModel === 'pollinations') {
      let finalPrompt = prompt;
      if (characterImage) {
        finalPrompt = `${prompt}, consistent character design, same character throughout`;
      }
      const encodedPrompt = encodeURIComponent(finalPrompt);
      const seed = Math.floor(Math.random() * 1000000);
      // 숏폼(9:16) vs 롱폼(16:9)
      const imgWidth = videoFormat === 'short' ? 768 : 1344;
      const imgHeight = videoFormat === 'short' ? 1344 : 768;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${imgWidth}&height=${imgHeight}&seed=${seed}&nologo=true`;
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('이미지 생성 실패');
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }
    
    // Google Gemini 3 (Nano Banana) - 캐릭터 이미지 포함!
    if (!geminiApiKey) throw new Error('Gemini API 키가 필요합니다');
    
    // Gemini 3 Pro Image API
    const parts: any[] = [{ 
      text: characterImage 
        ? `Generate an image: ${prompt}. Keep the character consistent with the reference image.` 
        : `Generate an image: ${prompt}` 
    }];
    
    // 캐릭터 이미지가 있으면 함께 전송
    if (characterImageBase64) {
      parts.unshift({
        inlineData: {
          mimeType: 'image/jpeg',
          data: characterImageBase64
        }
      });
    }
    
    // 모델별 설정
    const modelId = selectedModel === 'gemini-3-pro-image-4k' 
      ? 'gemini-3-pro-image-preview' 
      : selectedModel;
    
    // 비율 설정 (숏폼 9:16, 롱폼 16:9)
    const aspectRatio = videoFormat === 'short' ? '9:16' : '16:9';
    
    // 4K 모델인 경우 고해상도
    const imageSize = selectedModel === 'gemini-3-pro-image-4k' ? '4K' : '2K';
    
    const requestBody = {
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
        imageConfig: {
          aspectRatio,
          imageSize
        }
      }
    };
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API 오류: ${response.status} - ${errorData.error?.message || '알 수 없는 오류'}`);
    }
    
    const data = await response.json();
    const respParts = data.candidates?.[0]?.content?.parts || [];
    for (const part of respParts) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    return undefined;
  };

  // 음성 생성 (ElevenLabs 또는 Google TTS)
  const generateSingleAudio = async (text: string): Promise<string | undefined> => {
    if (selectedAudioModel === 'elevenlabs') {
      // ElevenLabs TTS
      if (!elevenLabsApiKey) return undefined;
      // 커스텀 Voice ID 처리 (custom:voiceId 형태)
      const voiceId = selectedVoice.startsWith('custom:') 
        ? selectedVoice.replace('custom:', '') 
        : selectedVoice;
      if (!voiceId) throw new Error('Voice ID가 필요합니다');
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: { 'Accept': 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': elevenLabsApiKey },
        body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('ElevenLabs 에러 상세:', errorData);
        const errorMsg = errorData?.detail?.message || errorData?.detail || '';
        
        // 커스텀 보이스 한도 초과 에러 체크
        if (errorMsg.includes('custom voices') || errorMsg.includes('maximum amount')) {
          setAudioError('🚨 ElevenLabs 커스텀 보이스 한도 초과!\n\nElevenLabs 대시보드에서 사용하지 않는 커스텀 보이스를 삭제하거나, 구독을 업그레이드해주세요.\n\nhttps://elevenlabs.io/voices');
        } else {
          setAudioError(`음성 생성 실패: ${errorMsg || response.status}`);
        }
        
        throw new Error(`ElevenLabs 음성 생성 실패: ${errorMsg || response.status}`);
      }
      const audioBlob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });
    } else if (selectedAudioModel === 'google') {
      // Google Cloud TTS
      if (!geminiApiKey) return undefined;
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text },
            voice: { 
              languageCode: googleVoice.split('-').slice(0, 2).join('-'), 
              name: googleVoice 
            },
            audioConfig: { 
              audioEncoding: 'MP3',
              speakingRate: 1.0,
              pitch: 0
            }
          })
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Google TTS 실패: ${error.error?.message || '알 수 없는 오류'}`);
      }
      const data = await response.json();
      return `data:audio/mp3;base64,${data.audioContent}`;
    }
    return undefined;
  };

  // 개별 이미지 재생성
  const regenerateSceneImage = async (index: number) => {
    if (!generatedContent) return;
    const updated = { ...generatedContent };
    updated.scenes[index].isGeneratingImage = true;
    setGeneratedContent({ ...updated });
    
    try {
      updated.scenes[index].generatedImage = await generateSingleImage(updated.scenes[index].imagePrompt, index);
    } catch (e) { console.error('이미지 재생성 실패', e); }
    
    updated.scenes[index].isGeneratingImage = false;
    setGeneratedContent({ ...updated });
  };

  // 개별 음성 재생성
  const regenerateSceneAudio = async (index: number) => {
    const canGenerate = (selectedAudioModel === 'elevenlabs' && elevenLabsApiKey) || 
                        (selectedAudioModel === 'google' && geminiApiKey);
    if (!generatedContent || !canGenerate) return;
    const updated = { ...generatedContent };
    updated.scenes[index].isGeneratingAudio = true;
    setGeneratedContent({ ...updated });
    
    try {
      updated.scenes[index].generatedAudio = await generateSingleAudio(updated.scenes[index].narration);
    } catch (e) { console.error('음성 재생성 실패:', e); }
    
    updated.scenes[index].isGeneratingAudio = false;
    setGeneratedContent({ ...updated });
  };
  
  // 음성 생성 가능 여부
  const canGenerateAudio = (selectedAudioModel === 'elevenlabs' && elevenLabsApiKey) || 
                            (selectedAudioModel === 'google' && geminiApiKey);

  // 나레이션 수정
  const updateNarration = (index: number, newNarration: string) => {
    if (!generatedContent) return;
    const updated = { ...generatedContent };
    updated.scenes[index].narration = newNarration;
    setGeneratedContent({ ...updated });
  };

  // ========== 개별 단계 실행 함수들 ==========
  
  // 1️⃣ 대본만 생성
  const generateScriptOnly = async () => {
    if (!topic.trim()) { alert('주제를 입력해주세요.'); return; }
    setIsRunning(true);
    
    try {
      updateNodeStatus('input', 'completed', 100);
      updateNodeStatus('tone', 'completed', 100);
      setCurrentStep('script');
      updateNodeStatus('script', 'running', 0);
      
      const sceneCount = Math.ceil(duration / 5);
      const langLabel = scriptLanguage === 'ko' ? 'Korean' : scriptLanguage === 'ja' ? 'Japanese' : 'English';
      
      const narrationStyleGuide: Record<string, string> = {
        narration: '1인칭 나레이션 형식으로, 시청자에게 직접 말하듯이 자연스럽고 친근하게 설명하세요. 예: "안녕하세요! 오늘은 제가 여러분께..."',
        documentary: '다큐멘터리 스타일로 객관적이고 정보 전달 중심으로 작성하세요. 3인칭 시점으로 설명하세요. 예: "이것은 놀라운 발견이다. 과학자들에 따르면..."',
        tutorial: '단계별 튜토리얼 형식으로 작성하세요. 명확한 지시와 팁을 포함하세요. 예: "첫 번째 단계입니다. 먼저 이것을 준비해주세요..."',
        custom: customToneExample || '자연스럽게 말하세요.'
      };
      
      const customToneInstruction = customToneExample 
        ? `\n\n✨ 중요! 다음 예제의 말투와 톤을 정확히 따라하세요:\n"${customToneExample}"\n\n이 예제처럼 같은 말투, 같은 느낌, 같은 표현 방식을 사용해서 모든 대사를 작성하세요.`
        : '';
      
      // 목적별 지시사항
      const purposeGuide: Record<string, string> = {
        views: '조회수를 극대화하기 위해 호기심을 자극하는 제목, 클릭 유도 문구, 트렌디한 표현을 사용하세요.',
        product: '제품의 장점과 특징을 자연스럽게 소개하고, 사용 후기와 혜택을 강조하세요.',
        branded: '브랜드 이미지에 맞는 톤앤매너를 유지하고, 브랜드 메시지를 자연스럽게 전달하세요.',
        education: '정보를 명확하고 이해하기 쉽게 전달하며, 핵심 포인트를 강조하세요.',
        story: '감정을 이끌어내는 스토리텔링으로 시청자를 몰입시키세요.',
        viral: '짧고 강렬한 임팩트, 밈이 될 수 있는 포인트, 공유하고 싶은 내용을 만드세요.',
        community: '팬들과 소통하는 친근한 톤으로, 참여를 유도하는 질문이나 요청을 포함하세요.',
        affiliate: '제품 링크 클릭을 유도하되 자연스럽게, 실제 사용 경험과 혜택을 강조하세요.'
      };
      
      const prompt = `유튜브 콘텐츠 전문가로서 JSON 형식으로 응답하세요.

📌 주제: ${topic}
⏱️ 분량: ${duration}초 (${sceneCount}장면, 장면당 약 5초)
📺 카테고리: ${style}
🎯 영상 목적: ${purposeGuide[videoPurpose] || purposeGuide.views}
🌍 언어: ${langLabel}
🎭 나레이션 스타일: ${narrationStyleGuide[narrationStyle]}${customToneInstruction}

중요: 
1. narration 필드는 반드시 위의 나레이션 스타일${customToneExample ? '과 예제 말투' : ''}를 적용하여 작성하세요!
2. 영상 목적에 맞게 내용을 구성하세요!

응답 형식:
{
  "title": "흥미로운 제목",
  "description": "영상 설명",
  "tags": ["관련", "태그"],
  "scenes": [
    { 
      "sceneNumber": 1, 
      "startTime": "0:00", 
      "endTime": "0:05", 
      "narration": "TTS로 읽을 대사 (${langLabel}, ${'나레이션 형식'})", 
      "imagePrompt": "장면 이미지 설명 (영어, 구체적으로)" 
    }
  ]
}`;

      updateNodeStatus('script', 'running', 30);
      const response = await callAzureOpenAI([
        { role: 'system', content: 'JSON만 응답하세요.' },
        { role: 'user', content: prompt }
      ], { maxTokens: 2000 });
      
      updateNodeStatus('script', 'running', 80);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('대본 파싱 실패');
      
      const parsed = JSON.parse(jsonMatch[0]);
      const content: GeneratedContent = {
        title: parsed.title || '제목 없음',
        description: parsed.description || '',
        tags: parsed.tags || [],
        scenes: (parsed.scenes || []).map((s: any, i: number) => ({
          sceneNumber: s.sceneNumber || i + 1,
          startTime: s.startTime || '0:00',
          endTime: s.endTime || '0:05',
          narration: s.narration || '',
          imagePrompt: s.imagePrompt || ''
        }))
      };
      setGeneratedContent(content);
      updateNodeStatus('script', 'completed', 100);
      setSelectedNode('output'); // 결과 확인으로 이동
      
    } catch (error: any) {
      console.error('대본 생성 실패:', error);
      updateNodeStatus('script', 'error');
      alert(`대본 생성 실패: ${error.message}`);
    } finally {
      setIsRunning(false);
      setCurrentStep(null);
    }
  };
  
  // 2️⃣ 이미지만 생성 (대본이 있어야 함)
  const generateImagesOnly = async () => {
    if (!generatedContent) { alert('먼저 대본을 생성해주세요.'); return; }
    setIsRunning(true);
    
    try {
      setCurrentStep('image');
      updateNodeStatus('image', 'running', 0);
      if (characterImage) updateNodeStatus('character', 'completed', 100);
      
      const content = { ...generatedContent };
      for (let i = 0; i < content.scenes.length; i++) {
        const progress = Math.round((i / content.scenes.length) * 100);
        updateNodeStatus('image', 'running', progress);
        content.scenes[i].isGeneratingImage = true;
        setGeneratedContent({ ...content });
        
        try {
          content.scenes[i].generatedImage = await generateSingleImage(content.scenes[i].imagePrompt, i);
        } catch (e) { console.error(`장면 ${i + 1} 이미지 실패`, e); }
        
        content.scenes[i].isGeneratingImage = false;
        setGeneratedContent({ ...content });
      }
      updateNodeStatus('image', 'completed', 100);
      
    } catch (error: any) {
      console.error('이미지 생성 실패:', error);
      updateNodeStatus('image', 'error');
      alert(`이미지 생성 실패: ${error.message}`);
    } finally {
      setIsRunning(false);
      setCurrentStep(null);
    }
  };
  
  // 3️⃣ 음성만 생성 (대본이 있어야 함)
  const generateAudiosOnly = async () => {
    if (!generatedContent) { alert('먼저 대본을 생성해주세요.'); return; }
    const canGen = (selectedAudioModel === 'elevenlabs' && elevenLabsApiKey) || 
                   (selectedAudioModel === 'google' && geminiApiKey);
    if (!canGen) { alert('음성 API 키를 입력해주세요.'); return; }
    setIsRunning(true);
    
    try {
      setCurrentStep('audio');
      updateNodeStatus('audio', 'running', 0);
      
      const content = { ...generatedContent };
      for (let i = 0; i < content.scenes.length; i++) {
        const progress = Math.round((i / content.scenes.length) * 100);
        updateNodeStatus('audio', 'running', progress);
        content.scenes[i].isGeneratingAudio = true;
        setGeneratedContent({ ...content });
        
        try {
          content.scenes[i].generatedAudio = await generateSingleAudio(content.scenes[i].narration);
        } catch (e) { console.error(`장면 ${i + 1} 음성 실패:`, e); }
        
        content.scenes[i].isGeneratingAudio = false;
        setGeneratedContent({ ...content });
      }
      updateNodeStatus('audio', 'completed', 100);
      
    } catch (error: any) {
      console.error('음성 생성 실패:', error);
      updateNodeStatus('audio', 'error');
      alert(`음성 생성 실패: ${error.message}`);
    } finally {
      setIsRunning(false);
      setCurrentStep(null);
    }
  };
  
  // 4️⃣ 전체 워크플로우 실행 (기존 기능)
  const runWorkflow = async () => {
    if (!topic.trim()) { alert('주제를 입력해주세요.'); return; }
    setIsRunning(true);
    resetAllNodes();
    
    try {
      // 1. 입력
      setCurrentStep('input');
      updateNodeStatus('input', 'running', 50);
      await new Promise(r => setTimeout(r, 500));
      updateNodeStatus('input', 'completed', 100);
      
      // 말투 에이전트 완료
      updateNodeStatus('tone', 'running', 50);
      await new Promise(r => setTimeout(r, 300));
      updateNodeStatus('tone', 'completed', 100);
      
      // 2. 대본 생성
      setCurrentStep('script');
      updateNodeStatus('script', 'running', 0);
      const sceneCount = Math.ceil(duration / 5);
      const langLabel = scriptLanguage === 'ko' ? 'Korean' : scriptLanguage === 'ja' ? 'Japanese' : 'English';
      
      // 나레이션 스타일별 지시사항
      const narrationStyleGuide: Record<string, string> = {
        narration: '1인칭 나레이션 형식으로, 시청자에게 직접 말하듯이 자연스럽고 친근하게 설명하세요. 예: "안녕하세요! 오늘은 제가 여러분께..."',
        documentary: '다큐멘터리 스타일로 객관적이고 정보 전달 중심으로 작성하세요. 3인칭 시점으로 설명하세요. 예: "이것은 놀라운 발견이다. 과학자들에 따르면..."',
        tutorial: '단계별 튜토리얼 형식으로 작성하세요. 명확한 지시와 팁을 포함하세요. 예: "첫 번째 단계입니다. 먼저 이것을 준비해주세요..."',
        custom: customToneExample || '자연스럽게 말하세요.'
      };
      
      // 커스텀 예제가 있으면 추가 지시사항
      const customToneInstruction = customToneExample 
        ? `\n\n✨ 중요! 다음 예제의 말투와 톤을 정확히 따라하세요:\n"${customToneExample}"\n\n이 예제처럼 같은 말투, 같은 느낌, 같은 표현 방식을 사용해서 모든 대사를 작성하세요.`
        : '';
      
      // 목적별 지시사항
      const purposeGuide: Record<string, string> = {
        views: '조회수를 극대화하기 위해 호기심을 자극하는 제목, 클릭 유도 문구, 트렌디한 표현을 사용하세요.',
        product: '제품의 장점과 특징을 자연스럽게 소개하고, 사용 후기와 혜택을 강조하세요.',
        branded: '브랜드 이미지에 맞는 톤앤매너를 유지하고, 브랜드 메시지를 자연스럽게 전달하세요.',
        education: '정보를 명확하고 이해하기 쉽게 전달하며, 핵심 포인트를 강조하세요.',
        story: '감정을 이끌어내는 스토리텔링으로 시청자를 몰입시키세요.',
        viral: '짧고 강렬한 임팩트, 밈이 될 수 있는 포인트, 공유하고 싶은 내용을 만드세요.',
        community: '팬들과 소통하는 친근한 톤으로, 참여를 유도하는 질문이나 요청을 포함하세요.',
        affiliate: '제품 링크 클릭을 유도하되 자연스럽게, 실제 사용 경험과 혜택을 강조하세요.'
      };
      
      const prompt = `유튜브 콘텐츠 전문가로서 JSON 형식으로 응답하세요.

📌 주제: ${topic}
⏱️ 분량: ${duration}초 (${sceneCount}장면, 장면당 약 5초)
📺 카테고리: ${style}
🎯 영상 목적: ${purposeGuide[videoPurpose] || purposeGuide.views}
🌍 언어: ${langLabel}
🎭 나레이션 스타일: ${narrationStyleGuide[narrationStyle]}${customToneInstruction}

중요: 
1. narration 필드는 반드시 위의 나레이션 스타일${customToneExample ? '과 예제 말투' : ''}를 적용하여 작성하세요!
2. 영상 목적에 맞게 내용을 구성하세요!

응답 형식:
{
  "title": "흥미로운 제목",
  "description": "영상 설명",
  "tags": ["관련", "태그"],
  "scenes": [
    { 
      "sceneNumber": 1, 
      "startTime": "0:00", 
      "endTime": "0:05", 
      "narration": "TTS로 읽을 대사 (${langLabel}, ${'나레이션 형식'})", 
      "imagePrompt": "장면 이미지 설명 (영어, 구체적으로)" 
    }
  ]
}`;

      updateNodeStatus('script', 'running', 30);
      const response = await callAzureOpenAI([
        { role: 'system', content: 'JSON만 응답하세요.' },
        { role: 'user', content: prompt }
      ], { maxTokens: 2000 });
      
      updateNodeStatus('script', 'running', 80);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('대본 파싱 실패');
      
      const parsed = JSON.parse(jsonMatch[0]);
      const content: GeneratedContent = {
        title: parsed.title || '제목 없음',
        description: parsed.description || '',
        tags: parsed.tags || [],
        scenes: (parsed.scenes || []).map((s: any, i: number) => ({
          sceneNumber: s.sceneNumber || i + 1,
          startTime: s.startTime || '0:00',
          endTime: s.endTime || '0:05',
          narration: s.narration || '',
          imagePrompt: s.imagePrompt || ''
        }))
      };
      setGeneratedContent(content);
      updateNodeStatus('script', 'completed', 100);
      
      // 3. 캐릭터 입력 확인
      setCurrentStep('character');
      updateNodeStatus('character', 'running', 50);
      await new Promise(r => setTimeout(r, 300));
      updateNodeStatus('character', characterImage ? 'completed' : 'idle', 100);
      
      // 4. 이미지 생성
      setCurrentStep('image');
      updateNodeStatus('image', 'running', 0);
      for (let i = 0; i < content.scenes.length; i++) {
        const progress = Math.round((i / content.scenes.length) * 100);
        updateNodeStatus('image', 'running', progress);
        try {
          content.scenes[i].generatedImage = await generateSingleImage(content.scenes[i].imagePrompt, i);
        } catch (e) { console.error(`장면 ${i + 1} 이미지 실패`, e); }
        setGeneratedContent({ ...content });
      }
      updateNodeStatus('image', 'completed', 100);
      
      // 5. 음성 생성 (ElevenLabs 또는 Google TTS)
      setCurrentStep('audio');
      updateNodeStatus('audio', 'running', 0);
      const canGenerateAudio = (selectedAudioModel === 'elevenlabs' && elevenLabsApiKey) || 
                                (selectedAudioModel === 'google' && geminiApiKey);
      if (canGenerateAudio) {
        for (let i = 0; i < content.scenes.length; i++) {
          const progress = Math.round((i / content.scenes.length) * 100);
          updateNodeStatus('audio', 'running', progress);
          try { content.scenes[i].generatedAudio = await generateSingleAudio(content.scenes[i].narration); }
          catch (e) { console.error(`장면 ${i + 1} 음성 실패:`, e); }
          setGeneratedContent({ ...content });
        }
      }
      updateNodeStatus('audio', 'completed', 100);
      
      // 6. 출력
      setCurrentStep('output');
      updateNodeStatus('output', 'running', 50);
      await new Promise(r => setTimeout(r, 500));
      updateNodeStatus('output', 'completed', 100);
      setSelectedNode('output');
      
      // 🎆 Confetti!
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      
    } catch (error: any) {
      console.error('워크플로우 실패:', error);
      if (currentStep) updateNodeStatus(currentStep, 'error');
      alert(`실행 실패: ${error.message}`);
    } finally {
      setIsRunning(false);
      setCurrentStep(null);
    }
  };

  // 오디오 재생
  const playAudio = (url: string, index: number) => {
    if (audioRef.current) audioRef.current.pause();
    if (playingIndex === index) { setPlayingIndex(null); return; }
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingIndex(index);
    audio.play();
    audio.onended = () => setPlayingIndex(null);
  };

  // SRT 자막 생성
  const generateSRT = () => {
    if (!generatedContent) return;
    let srt = '';
    generatedContent.scenes.forEach((scene, i) => {
      const parseTime = (t: string) => `00:${t.padStart(5, '0:00').slice(-5)},000`;
      srt += `${i + 1}\n${parseTime(scene.startTime)} --> ${parseTime(scene.endTime)}\n${scene.narration}\n\n`;
    });
    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${generatedContent.title.slice(0, 20)}_자막.srt`;
    link.click();
  };

  // 전체 다운로드
  const downloadAll = async () => {
    if (!generatedContent) return;
    let scriptText = `제목: ${generatedContent.title}\n설명: ${generatedContent.description}\n태그: ${generatedContent.tags.map(t => `#${t}`).join(' ')}\n\n`;
    generatedContent.scenes.forEach((s) => { scriptText += `[장면 ${s.sceneNumber}] ${s.startTime}~${s.endTime}\n대사: ${s.narration}\n\n`; });
    
    const blob = new Blob([scriptText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${generatedContent.title.slice(0, 20)}_대본.txt`;
    link.click();
    
    for (const scene of generatedContent.scenes) {
      if (scene.generatedImage) {
        const imgLink = document.createElement('a');
        imgLink.href = scene.generatedImage;
        imgLink.download = `장면${scene.sceneNumber}.png`;
        imgLink.click();
        await new Promise(r => setTimeout(r, 200));
      }
      if (scene.generatedAudio) {
        const audioLink = document.createElement('a');
        audioLink.href = scene.generatedAudio;
        audioLink.download = `장면${scene.sceneNumber}.mp3`;
        audioLink.click();
        await new Promise(r => setTimeout(r, 200));
      }
    }
  };

  // WebM 영상 생성 (음성 포함!)
  const exportVideo = async () => {
    if (!generatedContent) return;
    const scenes = generatedContent.scenes.filter(s => s.generatedImage);
    if (scenes.length === 0) { alert('이미지가 없습니다.'); return; }
    
    setIsExportingVideo(true);
    setExportProgress(0);
    
    try {
      const canvas = document.createElement('canvas');
      // 숏폼(9:16) vs 롱폼(16:9)
      if (videoFormat === 'short') {
        canvas.width = 1080;
        canvas.height = 1920;
      } else {
        canvas.width = 1920;
        canvas.height = 1080;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 생성 실패');
      
      // 오디오 컨텍스트 설정
      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
      
      // 비디오 스트림 + 오디오 스트림 합성
      const videoStream = canvas.captureStream(30);
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...destination.stream.getAudioTracks()
      ]);
      
      const mediaRecorder = new MediaRecorder(combinedStream, { 
        mimeType: 'video/webm;codecs=vp9,opus', 
        videoBitsPerSecond: 20000000,  // 20Mbps (고퀄리티)
        audioBitsPerSecond: 256000     // 256kbps (고음질)
      });
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      
      const recordingPromise = new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
      });
      
      mediaRecorder.start();
      
      for (let i = 0; i < scenes.length; i++) {
        setExportProgress(Math.round((i / scenes.length) * 90));
        const scene = scenes[i];
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        // 이미지 그리기
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            
            // 자막
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, canvas.height - 200, canvas.width, 200);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            const words = scene.narration.split(' ');
            let line = '';
            let y2 = canvas.height - 140;
            for (const word of words) {
              if (ctx.measureText(line + word).width > canvas.width - 80) {
                ctx.fillText(line, canvas.width / 2, y2);
                line = word + ' ';
                y2 += 45;
              } else {
                line += word + ' ';
              }
            }
            ctx.fillText(line, canvas.width / 2, y2);
            resolve();
          };
          img.onerror = () => reject(new Error('이미지 로드 실패'));
          img.src = scene.generatedImage!;
        });
        
        // 오디오 재생 (있으면)
        let audioDuration = 5000; // 기본 5초
        if (scene.generatedAudio) {
          try {
            // base64 오디오를 ArrayBuffer로 변환
            const audioData = scene.generatedAudio.split(',')[1];
            const binaryString = atob(audioData);
            const bytes = new Uint8Array(binaryString.length);
            for (let j = 0; j < binaryString.length; j++) {
              bytes[j] = binaryString.charCodeAt(j);
            }
            
            // 오디오 디코딩 및 재생
            const audioBuffer = await audioContext.decodeAudioData(bytes.buffer.slice(0));
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(destination);
            source.start();
            
            // 오디오 길이만큼 대기 (최소 3초, 최대 10초)
            audioDuration = Math.max(3000, Math.min(audioBuffer.duration * 1000 + 500, 10000));
          } catch (audioErr) {
            console.error('오디오 처리 실패:', audioErr);
          }
        }
        
        await new Promise(r => setTimeout(r, audioDuration));
      }
      
      mediaRecorder.stop();
      audioContext.close();
      const videoBlob = await recordingPromise;
      setExportProgress(100);
      
      const url = URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${generatedContent.title.slice(0, 20)}_영상.webm`;
      link.click();
      
      // 🎆 Confetti for video too!
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      alert('✅ 영상 생성 완료! (음성 포함)');
    } catch (error: any) {
      alert(`영상 생성 실패: ${error.message}`);
    } finally {
      setIsExportingVideo(false);
      setExportProgress(0);
    }
  };

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => { setSelectedNode(node.id); }, []);
  
  // 노드 선택 시 바로 패널 업데이트 (한 번 클릭으로 작동)
  const onSelectionChange = useCallback(({ nodes }: OnSelectionChangeParams) => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[0].id);
    }
  }, []);

  // 설정 패널 렌더링
  const renderSettingsPanel = () => {
    if (!selectedNode) return null;

    if (selectedNode === 'input') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: COLORS.input, borderRadius: '12px', padding: '12px', display: 'flex' }}>
              <FileText size={24} color="white" />
            </div>
            <div>
              <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>유튜브 PD 에이전트</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '1rem' }}>콘텐츠의 방향을 설정합니다</p>
            </div>
          </div>
          
          <div>
            <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>🎬 어떤 콘텐츠를 만들고 싶으신가요?</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="예: 초보자를 위한 커피 내리는 방법"
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', background: '#0a0a1a', color: 'white', fontSize: '1.1rem', outline: 'none', transition: 'border 0.2s' }} />
          </div>
          
          <div>
            <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>🎞️ 장면 수 (1~100)</label>
            <input 
              type="number" 
              min={1} 
              max={100} 
              value={Math.round(duration / 5)} 
              onChange={(e) => setDuration(Math.min(100, Math.max(1, Number(e.target.value))) * 5)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', background: '#0a0a1a', color: 'white', fontSize: '1.1rem', outline: 'none' }} />
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginTop: '8px' }}>
              예상 영상 길이: 약 {Math.round(duration / 5) * 5}초 ({Math.round(duration / 60) > 0 ? `${Math.round(duration / 60)}분 ` : ''}{duration % 60}초)
            </p>
          </div>
          
          <div>
            <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>📺 유튜브 카테고리</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', background: '#0a0a1a', color: 'white', fontSize: '1.1rem' }}>
              <option value="education">📚 교육</option>
              <option value="entertainment">🎭 엔터테인먼트</option>
              <option value="howto">🔧 노하우/스타일</option>
              <option value="gaming">🎮 게임</option>
              <option value="music">🎵 음악</option>
              <option value="news">📰 뉴스/정치</option>
              <option value="sports">⚽ 스포츠</option>
              <option value="travel">✈️ 여행/이벤트</option>
              <option value="comedy">😂 코미디</option>
              <option value="science">🔬 과학/기술</option>
              <option value="pets">🐾 동물/반려동물</option>
              <option value="vlog">📹 일상/브이로그</option>
            </select>
          </div>
          
          <div>
            <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>🎯 영상 목적</label>
            <select value={videoPurpose} onChange={(e) => setVideoPurpose(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', background: '#0a0a1a', color: 'white', fontSize: '1.1rem' }}>
              <option value="views">📈 조회수 극대화</option>
              <option value="product">🛍️ 제품 홍보/리뷰</option>
              <option value="branded">🏢 브랜디드 광고</option>
              <option value="education">📚 정보 전달/교육</option>
              <option value="story">📖 스토리텔링</option>
              <option value="viral">🔥 바이럴 콘텐츠</option>
              <option value="community">👥 커뮤니티/팬 소통</option>
              <option value="affiliate">💰 제휴 마케팅</option>
            </select>
          </div>
          
          <div>
            <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>🌍 언어</label>
            <select value={scriptLanguage} onChange={(e) => setScriptLanguage(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', background: '#0a0a1a', color: 'white', fontSize: '1.1rem' }}>
              <option value="ko">🇰🇷 한국어</option>
              <option value="en">🇺🇸 영어</option>
              <option value="ja">🇯🇵 일본어</option>
              <option value="zh">🇨🇳 중국어</option>
              <option value="es">🇪🇸 스페인어</option>
              <option value="fr">🇫🇷 프랑스어</option>
              <option value="de">🇩🇪 독일어</option>
              <option value="pt">🇧🇷 포르투갈어</option>
              <option value="vi">🇻🇳 베트남어</option>
              <option value="th">🇹🇭 태국어</option>
              <option value="id">🇮🇩 인도네시아어</option>
              <option value="hi">🇮🇳 힌디어</option>
              <option value="ar">🇸🇦 아랍어</option>
              <option value="ru">🇷🇺 러시아어</option>
            </select>
          </div>
          
          <div>
            <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>📐 영상 형식</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setVideoFormat('short')}
                style={{ 
                  flex: 1, 
                  padding: '18px 12px', 
                  borderRadius: '12px', 
                  border: videoFormat === 'short' ? '3px solid #d4af37' : '2px solid rgba(255,255,255,0.2)', 
                  background: videoFormat === 'short' ? '#d4af3730' : '#0a0a1a', 
                  color: 'white', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                <div style={{ width: '28px', height: '48px', border: `3px solid ${videoFormat === 'short' ? '#d4af37' : 'rgba(255,255,255,0.5)'}`, borderRadius: '6px' }} />
                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>📱 숏폼</span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>9:16 세로</span>
              </button>
              <button 
                onClick={() => setVideoFormat('long')}
                style={{ 
                  flex: 1, 
                  padding: '18px 12px', 
                  borderRadius: '12px', 
                  border: videoFormat === 'long' ? '3px solid #d4af37' : '2px solid rgba(255,255,255,0.2)', 
                  background: videoFormat === 'long' ? '#d4af3730' : '#0a0a1a', 
                  color: 'white', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                <div style={{ width: '48px', height: '28px', border: `3px solid ${videoFormat === 'long' ? '#d4af37' : 'rgba(255,255,255,0.5)'}`, borderRadius: '6px' }} />
                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>🖥️ 롱폼</span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>16:9 가로</span>
              </button>
            </div>
          </div>
          
          <div style={{ background: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '16px' }}>
            <p style={{ color: 'white', fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>
              💡 <strong>Tip:</strong> 말투와 나레이션 스타일은 <strong>🎭 말투 에이전트</strong> 노드에서 설정하세요!
            </p>
          </div>
        </div>
      );
    }

    if (selectedNode === 'tone') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: COLORS.input, borderRadius: '12px', padding: '12px', display: 'flex' }}>
              <Mic size={24} color="white" />
            </div>
            <div>
              <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>말투 에이전트</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '1rem' }}>나레이션 스타일 & 예제 설정</p>
            </div>
          </div>
          
          <div>
            <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>🎭 나레이션 스타일</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button 
                onClick={() => setNarrationStyle('narration')}
                style={{ 
                  padding: '16px 12px', 
                  borderRadius: '12px', 
                  border: narrationStyle === 'narration' ? '3px solid #8b5cf6' : '2px solid rgba(255,255,255,0.2)', 
                  background: narrationStyle === 'narration' ? '#8b5cf630' : '#0a0a1a', 
                  color: 'white', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '6px' }}>🎙️</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', display: 'block' }}>유튜버</span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: '4px' }}>"안녕하세요~"</span>
              </button>
              <button 
                onClick={() => setNarrationStyle('documentary')}
                style={{ 
                  padding: '16px 12px', 
                  borderRadius: '12px', 
                  border: narrationStyle === 'documentary' ? '3px solid #10b981' : '2px solid rgba(255,255,255,0.2)', 
                  background: narrationStyle === 'documentary' ? '#10b98130' : '#0a0a1a', 
                  color: 'white', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '6px' }}>🎬</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', display: 'block' }}>다큐</span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: '4px' }}>"~라고 한다"</span>
              </button>
              <button 
                onClick={() => setNarrationStyle('tutorial')}
                style={{ 
                  padding: '16px 12px', 
                  borderRadius: '12px', 
                  border: narrationStyle === 'tutorial' ? '3px solid #3b82f6' : '2px solid rgba(255,255,255,0.2)', 
                  background: narrationStyle === 'tutorial' ? '#3b82f630' : '#0a0a1a', 
                  color: 'white', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '6px' }}>📚</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', display: 'block' }}>강의</span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: '4px' }}>"1단계는~"</span>
              </button>
              <button 
                onClick={() => setNarrationStyle('custom')}
                style={{ 
                  padding: '16px 12px', 
                  borderRadius: '12px', 
                  border: narrationStyle === 'custom' ? '3px solid #f97316' : '2px solid rgba(255,255,255,0.2)', 
                  background: narrationStyle === 'custom' ? '#f9731630' : '#0a0a1a', 
                  color: 'white', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  gridColumn: 'span 2'
                }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '6px' }}>✨</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', display: 'block' }}>커스텀 말투</span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: '4px' }}>직접 예제 입력</span>
              </button>
            </div>
          </div>
          
          {/* 커스텀 말투 예제 입력 */}
          <div>
            <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>
              ✍️ 말투 예제 {narrationStyle === 'custom' ? '(필수)' : '(선택)'}
            </label>
            <textarea 
              value={customToneExample}
              onChange={(e) => setCustomToneExample(e.target.value)}
              placeholder={`원하는 말투의 예제를 입력하세요.\n\n예시:\n"여러분~ 안녕하세요! 오늘도 찾아와주셨군요~ 자, 그럼 바로 시작해볼까요?"`}
              style={{ 
                width: '100%', 
                minHeight: '150px',
                padding: '16px', 
                borderRadius: '12px', 
                border: narrationStyle === 'custom' && !customToneExample ? '3px solid #f97316' : '2px solid rgba(255,255,255,0.2)', 
                background: '#0a0a1a', 
                color: 'white', 
                fontSize: '1.1rem',
                resize: 'vertical',
                lineHeight: 1.6
              }} 
            />
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginTop: '10px' }}>
              💡 입력한 예제의 말투와 톤을 AI가 학습하여 대본을 생성합니다
            </p>
          </div>
          
          <div style={{ background: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '16px' }}>
            <p style={{ color: 'white', fontSize: '1.1rem', margin: 0, lineHeight: 1.6 }}>
              🎭 <strong>현재 설정:</strong> {
                narrationStyle === 'narration' ? '유튜버 ("안녕하세요~")' :
                narrationStyle === 'documentary' ? '다큐 ("~라고 한다")' :
                narrationStyle === 'tutorial' ? '강의 ("1단계는~")' :
                '커스텀 말투'
              }
              {customToneExample && <><br/>✨ 예제 적용됨</>}
            </p>
          </div>
        </div>
      );
    }

    if (selectedNode === 'character') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: COLORS.visual, borderRadius: '12px', padding: '12px', display: 'flex' }}>
              <ImageIcon size={24} color="white" />
            </div>
            <div>
              <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>캐릭터 입력</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '1rem' }}>일관된 캐릭터 스타일 적용</p>
            </div>
          </div>
          
          <div>
            <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>👤 캐릭터 이미지</label>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
            <div onClick={() => fileInputRef.current?.click()}
              style={{ border: '3px dashed rgba(236,72,153,0.4)', borderRadius: '16px', padding: '30px', textAlign: 'center', cursor: 'pointer', background: 'rgba(236,72,153,0.1)', transition: 'all 0.2s' }}>
              {characterImage ? (
                <div>
                  <img src={characterImage} alt="캐릭터" style={{ maxHeight: '140px', borderRadius: '12px', marginBottom: '12px' }} />
                  <p style={{ color: '#10b981', fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>✅ 캐릭터 등록됨</p>
                </div>
              ) : (
                <div>
                  <ImageIcon size={50} color="#ec4899" style={{ marginBottom: '12px', opacity: 0.8 }} />
                  <p style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0, fontWeight: '700' }}>클릭하여 업로드</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', margin: '8px 0 0 0' }}>PNG, JPG 권장</p>
                </div>
              )}
            </div>
            {characterImage && (
              <button onClick={() => { setCharacterImage(null); setCharacterImageBase64(null); }} 
                style={{ width: '100%', marginTop: '12px', padding: '14px', borderRadius: '12px', border: '2px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.2)', color: 'white', fontSize: '1.1rem', cursor: 'pointer', fontWeight: '700' }}>
                🗑️ 캐릭터 제거
              </button>
            )}
          </div>
          
          <div style={{ background: 'rgba(236,72,153,0.15)', border: '2px solid rgba(236,72,153,0.3)', borderRadius: '12px', padding: '16px' }}>
            <p style={{ color: 'white', fontSize: '1.1rem', margin: 0, lineHeight: 1.6 }}>
              💡 캐릭터 이미지를 업로드하면 모든 장면에서 <strong>동일한 캐릭터</strong>가 등장합니다.
            </p>
          </div>
        </div>
      );
    }

if (selectedNode === 'image') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: COLORS.visual, borderRadius: '12px', padding: '12px', display: 'flex' }}>
              <ImageIcon size={24} color="white" />
            </div>
            <div>
              <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>이미지 에이전트</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '1rem' }}>장면별 이미지 자동 생성</p>
            </div>
          </div>
          
          <div>
            <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>🤖 모델 선택</label>
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', background: '#0a0a1a', color: 'white', fontSize: '1.1rem' }}>
              {imageModels.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          
          {selectedModel !== 'pollinations' && (
            <div>
              <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>
                <Key size={16} style={{ display: 'inline', marginRight: '8px' }} />Gemini API Key
              </label>
              <input type="password" value={geminiApiKey} onChange={(e) => { setGeminiApiKey(e.target.value); if (saveGeminiKey) localStorage.setItem('gemini_api_key', e.target.value); }}
                placeholder="API 키 입력"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', background: '#0a0a1a', color: 'white', fontSize: '1.1rem' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', color: 'rgba(255,255,255,0.8)', fontSize: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={saveGeminiKey} onChange={(e) => { setSaveGeminiKey(e.target.checked); if (e.target.checked && geminiApiKey) localStorage.setItem('gemini_api_key', geminiApiKey); else localStorage.removeItem('gemini_api_key'); }} style={{ width: '18px', height: '18px' }} />
                <Save size={14} /> 브라우저에 저장
              </label>
            </div>
          )}
          
          {characterImage && (
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '16px' }}>
              <p style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>
                ✅ <strong>캐릭터 이미지 적용됨!</strong> 모든 장면에 일관된 캐릭터가 생성됩니다.
              </p>
            </div>
          )}
          
          <div style={{ background: 'rgba(236,72,153,0.15)', border: '2px solid rgba(236,72,153,0.3)', borderRadius: '12px', padding: '16px' }}>
            <p style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>
              💡 <strong>Pollinations</strong>는 무료이며 API 키가 필요없습니다.
            </p>
          </div>
        </div>
      );
    }

    if (selectedNode === 'audio') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: COLORS.generate, borderRadius: '12px', padding: '12px', display: 'flex' }}>
              <Mic size={24} color="white" />
            </div>
            <div>
              <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>음성 에이전트 옵션</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '1rem' }}>나레이션 자동 생성</p>
            </div>
          </div>
          
          {/* 음성 모델 선택 */}
          <div>
            <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>🤖 음성 모델</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setSelectedAudioModel('elevenlabs')}
                style={{ 
                  flex: 1, 
                  padding: '18px 12px', 
                  borderRadius: '12px', 
                  border: selectedAudioModel === 'elevenlabs' ? '3px solid #8b5cf6' : '2px solid rgba(255,255,255,0.2)', 
                  background: selectedAudioModel === 'elevenlabs' ? '#8b5cf630' : '#0a0a1a', 
                  color: 'white', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <span style={{ fontSize: '2rem' }}>🎭</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>ElevenLabs</span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>고품질 AI 음성</span>
              </button>
              <button 
                onClick={() => setSelectedAudioModel('google')}
                style={{ 
                  flex: 1, 
                  padding: '18px 12px', 
                  borderRadius: '12px', 
                  border: selectedAudioModel === 'google' ? '3px solid #8b5cf6' : '2px solid rgba(255,255,255,0.2)', 
                  background: selectedAudioModel === 'google' ? '#8b5cf630' : '#0a0a1a', 
                  color: 'white', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <span style={{ fontSize: '2rem' }}>🔊</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Google TTS</span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>다국어 지원</span>
              </button>
            </div>
          </div>
          
          {/* ElevenLabs 설정 */}
          {selectedAudioModel === 'elevenlabs' && (
            <>
              <div>
                <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>
                  <Key size={16} style={{ display: 'inline', marginRight: '8px' }} />ElevenLabs API Key
                </label>
                <input type="password" value={elevenLabsApiKey} onChange={(e) => { setElevenLabsApiKey(e.target.value); if (saveElevenLabsKey) localStorage.setItem('elevenlabs_api_key', e.target.value); }}
                  placeholder="API 키 입력"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', background: '#0a0a1a', color: 'white', fontSize: '1.1rem' }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', color: 'rgba(255,255,255,0.8)', fontSize: '1rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={saveElevenLabsKey} onChange={(e) => { setSaveElevenLabsKey(e.target.checked); if (e.target.checked && elevenLabsApiKey) localStorage.setItem('elevenlabs_api_key', elevenLabsApiKey); else localStorage.removeItem('elevenlabs_api_key'); }} style={{ width: '18px', height: '18px' }} />
                  <Save size={14} /> 브라우저에 저장
                </label>
              </div>
              
              {elevenLabsApiKey && (
                <div>
                  <label style={{ color: 'white', fontSize: '1.2rem', marginBottom: '12px', display: 'block', fontWeight: '700' }}>🎙️ 보이스 선택</label>
                  <select value={selectedVoice.startsWith('custom:') ? 'custom' : selectedVoice} 
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setSelectedVoice('custom:');
                      } else {
                        setSelectedVoice(e.target.value);
                      }
                    }}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', background: '#0a0a1a', color: 'white', fontSize: '1.1rem', marginBottom: '12px' }}>
                    <optgroup label="🇰🇷 한국어">
                      <option value="nPczCjzI2devNBz1zQrb">Anna Kim - 내레이션/스토리</option>
                      <option value="qNkzaJoHLLdpvgh5tFvA">Harry - 차분한 나레이터</option>
                      <option value="g5CIjZEefAph4nQFvHAz">Sunny - 밝고 친근한</option>
                      <option value="XrExE9yKIg1WjnnlVkGX">YohanKoo - 대화체</option>
                      <option value="SOYHLrjzK2X1ezoPC6cr">Hyuk - 내레이션</option>
                      <option value="GBv7mTt0atIp3Br8iCZE">Hyun Bin - 내레이션</option>
                    </optgroup>
                    <optgroup label="여성 (영어)">
                      <option value="21m00Tcm4TlvDq8ikWAM">Rachel - 자연스럽고 부드러운</option>
                      <option value="EXAVITQu4vr4xnSDxMaL">Bella - 따뜻하고 친근한</option>
                      <option value="MF3mGyEYCl7XYWbV9V6O">Elli - 젊고 발랄한</option>
                    </optgroup>
                    <optgroup label="남성 (영어)">
                      <option value="pNInz6obpgDQGcFmaJgB">Adam - 깊고 신뢰감 있는</option>
                      <option value="VR6AewLTigWG4xSOukaG">Arnold - 강하고 힘 있는</option>
                      <option value="ErXwobaYiN019PkySvjV">Antoni - 젊고 활기찬</option>
                    </optgroup>
                    <optgroup label="다국어">
                      <option value="XB0fDUnXU5powFXDhCwa">Charlotte - 다국어 (여성)</option>
                      <option value="iP95p4xoKVk53GoZ742B">Chris - 다국어 (남성)</option>
                    </optgroup>
                    <optgroup label="✨ 직접 입력">
                      <option value="custom">🔗 Voice ID 직접 입력</option>
                    </optgroup>
                  </select>
                  
                  {/* 커스텀 Voice ID 입력 */}
                  {selectedVoice.startsWith('custom:') && (
                    <div style={{ marginTop: '12px' }}>
                      <input 
                        type="text" 
                        value={selectedVoice.replace('custom:', '')}
                        onChange={(e) => setSelectedVoice(`custom:${e.target.value}`)}
                        placeholder="Voice ID 붙여넣기"
                        style={{ 
                          width: '100%', 
                          padding: '14px 16px', 
                          borderRadius: '12px', 
                          border: '2px solid rgba(255,255,255,0.2)', 
                          background: '#0a0a1a', 
                          color: 'white', 
                          fontSize: '1.1rem' 
                        }} 
                      />
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginTop: '8px' }}>
                        💡 ElevenLabs에서 ... 메뉴 → "Copy voice ID" 클릭
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ background: 'rgba(139,92,246,0.15)', border: '2px solid rgba(139,92,246,0.3)', borderRadius: '12px', padding: '16px' }}>
                <p style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>
                  💡 ElevenLabs는 <strong>고품질 AI 음성</strong>을 제공합니다. 감정 표현이 자연스럽고 사람 같은 음성을 생성합니다.
                </p>
              </div>
            </>
          )}
          
          {/* Google TTS 설정 */}
          {selectedAudioModel === 'google' && (
            <>
              <div>
                <label style={{ color: '#e2e8f0', fontSize: '1rem', marginBottom: '8px', display: 'block', fontWeight: '600' }}>
                  <Key size={14} style={{ display: 'inline', marginRight: '6px' }} />Google API Key
                </label>
                <input type="password" value={geminiApiKey} onChange={(e) => { setGeminiApiKey(e.target.value); if (saveGeminiKey) localStorage.setItem('gemini_api_key', e.target.value); }}
                  placeholder="API 키 입력 (Gemini API Key와 동일)"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #10b98140', background: '#0a0a1a', color: 'white', fontSize: '0.9rem' }} />
                <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '6px' }}>
                  * 이미지 에이전트의 Gemini API Key와 동일한 키 사용
                </p>
              </div>
              
              <div>
                <label style={{ color: '#e2e8f0', fontSize: '1rem', marginBottom: '8px', display: 'block', fontWeight: '600' }}>🎙️ 보이스 선택</label>
                <select value={googleVoice} onChange={(e) => setGoogleVoice(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #10b98140', background: '#0a0a1a', color: 'white', fontSize: '0.9rem' }}>
                  <optgroup label="🇰🇷 한국어">
                    <option value="ko-KR-Wavenet-A">여성 A - 자연스러운</option>
                    <option value="ko-KR-Wavenet-B">여성 B - 밝고 친근한</option>
                    <option value="ko-KR-Wavenet-C">남성 A - 차분한</option>
                    <option value="ko-KR-Wavenet-D">남성 B - 힘 있는</option>
                    <option value="ko-KR-Neural2-A">Neural 여성</option>
                    <option value="ko-KR-Neural2-B">Neural 남성</option>
                  </optgroup>
                  <optgroup label="🇺🇸 영어 (미국)">
                    <option value="en-US-Wavenet-C">여성 - Studio</option>
                    <option value="en-US-Wavenet-D">남성 - Studio</option>
                    <option value="en-US-Neural2-C">Neural 여성</option>
                    <option value="en-US-Neural2-D">Neural 남성</option>
                  </optgroup>
                  <optgroup label="🇯🇵 일본어">
                    <option value="ja-JP-Wavenet-A">여성 A</option>
                    <option value="ja-JP-Wavenet-B">여성 B</option>
                    <option value="ja-JP-Wavenet-C">남성 A</option>
                    <option value="ja-JP-Wavenet-D">남성 B</option>
                  </optgroup>
                  <optgroup label="🇨🇳 중국어 (표준어)">
                    <option value="cmn-CN-Wavenet-A">여성</option>
                    <option value="cmn-CN-Wavenet-B">남성</option>
                  </optgroup>
                  <optgroup label="🇪🇸 스페인어">
                    <option value="es-ES-Wavenet-B">여성</option>
                    <option value="es-ES-Wavenet-C">남성</option>
                  </optgroup>
                  <optgroup label="🇫🇷 프랑스어">
                    <option value="fr-FR-Wavenet-A">여성</option>
                    <option value="fr-FR-Wavenet-B">남성</option>
                  </optgroup>
                  <optgroup label="🇩🇪 독일어">
                    <option value="de-DE-Wavenet-A">여성</option>
                    <option value="de-DE-Wavenet-B">남성</option>
                  </optgroup>
                </select>
              </div>
              
              <div style={{ background: '#3b82f615', border: '1px solid #3b82f630', borderRadius: '10px', padding: '12px' }}>
                <p style={{ color: '#60a5fa', fontSize: '0.85rem', margin: 0 }}>
                  💡 Google TTS는 <strong>다양한 언어</strong>를 지원합니다. Wavenet과 Neural2 보이스는 자연스러운 음성을 제공합니다.
                </p>
              </div>
            </>
          )}
        </div>
      );
    }

    if (selectedNode === 'script') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ background: '#8b5cf6', borderRadius: '10px', padding: '10px', display: 'flex' }}>
              <Sparkles size={20} color="white" />
            </div>
            <div>
              <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.3rem', fontWeight: '800' }}>대본 에이전트</h3>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Azure GPT-4o 기반</p>
            </div>
          </div>
          
          <div style={{ background: '#8b5cf615', border: '1px solid #8b5cf630', borderRadius: '10px', padding: '14px' }}>
            <p style={{ color: '#c4b5fd', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
              ✨ 유튜브 PD 에이전트의 정보를 받아 자동으로 대본을 생성합니다.
            </p>
            <ul style={{ color: '#94a3b8', fontSize: '1rem', margin: '10px 0 0 0', paddingLeft: '18px' }}>
              <li>장면별 나레이션 생성</li>
              <li>이미지 프롬프트 자동 작성</li>
              <li>제목/설명/태그 추천</li>
            </ul>
          </div>
        </div>
      );
    }

    if (selectedNode === 'output') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: COLORS.output, borderRadius: '12px', padding: '12px', display: 'flex' }}>
              <Video size={24} color="white" />
            </div>
            <div>
              <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>출력 에이전트</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '1rem' }}>결과 확인 및 다운로드</p>
            </div>
          </div>
          
          {generatedContent ? (
            <>
              <div style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Check size={22} color="#10b981" />
                  <span style={{ color: 'white', fontWeight: '700', fontSize: '1.2rem' }}>🎉 생성 완료!</span>
                </div>
                <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600' }}>{generatedContent.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginTop: '6px' }}>{generatedContent.scenes.length}개 장면 • {generatedContent.scenes.filter(s => s.generatedImage).length}개 이미지</div>
              </div>
              
              <button onClick={() => setShowPreview(true)} style={{ width: '100%', padding: '18px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem' }}>
                <Eye size={22} /> 미리보기 & 수정
              </button>
              
              <button onClick={generateSRT} style={{ width: '100%', padding: '18px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem' }}>
                <FileText size={22} /> SRT 자막 다운로드
              </button>
              
              <button onClick={downloadAll} style={{ width: '100%', padding: '18px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem' }}>
                <Download size={22} /> 전체 다운로드
              </button>
              
              <button onClick={exportVideo} disabled={isExportingVideo} style={{ width: '100%', padding: '18px', borderRadius: '12px', border: 'none', background: isExportingVideo ? '#d4af3760' : 'linear-gradient(135deg, #d4af37, #f4d03f)', color: '#0a0a1a', fontWeight: '800', cursor: isExportingVideo ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.1rem' }}>
                {isExportingVideo ? <><Loader2 size={22} className="animate-spin" /> {exportProgress}%</> : <><Film size={22} /> WebM 영상</>}
              </button>
            </>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '2px solid rgba(255,255,255,0.1)' }}>
              <Video size={50} color="rgba(255,255,255,0.5)" style={{ marginBottom: '16px' }} />
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', margin: 0 }}>워크플로우를 실행하면<br />결과가 여기에 표시됩니다</p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ height: '100vh', width: '100vw', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Confetti */}
      <Confetti active={showConfetti} />
      
      {/* 에러 알림 모달 */}
      {audioError && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #2d1f3d)',
            border: '2px solid #f43f5e',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(244, 63, 94, 0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
            <h3 style={{ color: '#f43f5e', fontSize: '1.3rem', marginBottom: '15px' }}>음성 생성 오류</h3>
            <p style={{ color: '#e0e0e0', whiteSpace: 'pre-line', lineHeight: '1.6', marginBottom: '20px' }}>
              {audioError}
            </p>
            <button
              onClick={() => setAudioError(null)}
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
      
      {/* 상단 바 */}
      <div style={{ 
        background: 'linear-gradient(180deg, #1a1a2e 0%, #12121f 100%)', 
        borderBottom: '2px solid #d4af3740', 
        padding: '14px 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/ai-construction-site')} 
            style={{ background: '#ffffff10', border: '1px solid #ffffff20', borderRadius: '10px', padding: '10px 12px', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ color: '#d4af37', fontSize: '1.3rem', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              🎬 AI 콘텐츠 생성기
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>노드를 클릭해서 설정을 변경하세요</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* 스티키 노트 추가 버튼 */}
          <button onClick={addStickyNote}
            style={{ 
              background: 'linear-gradient(135deg, #ffffff, #f3f4f6)', 
              border: '1px solid #e5e7eb', 
              borderRadius: '10px', 
              padding: '10px 14px', 
              color: '#374151', 
              fontWeight: '600', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '0.85rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.2s'
            }}>
            📝 메모
          </button>
          
          {/* 텍스트 노드 추가 버튼 */}
          <button onClick={addTextNode}
            style={{ 
              background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
              border: '1px solid #334155', 
              borderRadius: '10px', 
              padding: '10px 14px', 
              color: '#e2e8f0', 
              fontWeight: '600', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '0.85rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.2s'
            }}>
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>T</span> 텍스트
          </button>
          
          {/* 단계별 실행 버튼들 */}
          <div style={{ display: 'flex', gap: '8px', background: '#1a1a2e', padding: '6px', borderRadius: '12px', border: '1px solid #ffffff10' }}>
            {/* 1️⃣ 대본 생성 */}
            <button onClick={generateScriptOnly} disabled={isRunning || !topic.trim()} 
              style={{ 
                background: isRunning ? '#8b5cf640' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                border: 'none', 
                borderRadius: '10px', 
                padding: '10px 16px', 
                color: 'white', 
                fontWeight: '700', 
                cursor: isRunning || !topic.trim() ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}>
              <Sparkles size={16} /> 대본
            </button>
            
            {/* 2️⃣ 이미지 생성 */}
            <button onClick={generateImagesOnly} disabled={isRunning || !generatedContent} 
              style={{ 
                background: isRunning ? '#ec489940' : !generatedContent ? '#ec489930' : 'linear-gradient(135deg, #ec4899, #db2777)', 
                border: 'none', 
                borderRadius: '10px', 
                padding: '10px 16px', 
                color: 'white', 
                fontWeight: '700', 
                cursor: isRunning || !generatedContent ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                fontSize: '0.9rem',
                opacity: generatedContent ? 1 : 0.5,
                transition: 'all 0.2s'
              }}>
              <ImageIcon size={16} /> 이미지
            </button>
            
            {/* 3️⃣ 음성 생성 */}
            <button onClick={generateAudiosOnly} disabled={isRunning || !generatedContent || (!elevenLabsApiKey && !geminiApiKey)} 
              style={{ 
                background: isRunning ? '#10b98140' : (!generatedContent || (!elevenLabsApiKey && !geminiApiKey)) ? '#10b98130' : 'linear-gradient(135deg, #10b981, #059669)', 
                border: 'none', 
                borderRadius: '10px', 
                padding: '10px 16px', 
                color: 'white', 
                fontWeight: '700', 
                cursor: isRunning || !generatedContent || (!elevenLabsApiKey && !geminiApiKey) ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                fontSize: '0.9rem',
                opacity: (generatedContent && (elevenLabsApiKey || geminiApiKey)) ? 1 : 0.5,
                transition: 'all 0.2s'
              }}>
              <Mic size={16} /> 음성
            </button>
          </div>
          
          {/* 전체 실행 버튼 */}
          <button onClick={runWorkflow} disabled={isRunning || !topic.trim()} 
            className={isRunning ? '' : 'run-button-glow'}
            style={{ 
              background: isRunning ? '#d4af3740' : 'linear-gradient(135deg, #d4af37, #f4d03f)', 
              border: 'none', 
              borderRadius: '12px', 
              padding: '12px 20px', 
              color: '#0a0a1a', 
              fontWeight: '800', 
              cursor: isRunning || !topic.trim() ? 'not-allowed' : 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '0.95rem',
              boxShadow: isRunning ? 'none' : '0 4px 20px rgba(212, 175, 55, 0.4)',
              transition: 'all 0.2s'
            }}>
            {isRunning ? (
              <><Loader2 size={18} className="animate-spin" /> 생성 중...</>
            ) : (
              <><Play size={18} /> Start</>
            )}
          </button>
        </div>
      </div>
      
      {/* 메인 */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', minHeight: 0, overflow: 'hidden' }}>
        {/* 캔버스 */}
        <div style={{ flex: 1, position: 'relative' }}>
          <ParticleBackground />
          <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            onNodesChange={onNodesChange} 
            onEdgesChange={onEdgesChange} 
            onNodeClick={onNodeClick}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes} 
            fitView 
            style={{ background: 'transparent' }}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={25} size={1.5} color="#d4af3720" />
            <MiniMap 
              nodeColor={(n) => n.data?.color || '#d4af37'}
              style={{ 
                background: '#1a1a2e', 
                border: '1px solid #d4af3730', 
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            />
            {/* 줌 슬라이더 (하단 중앙) */}
            <Panel position="bottom-center" style={{ marginBottom: '20px' }}>
              <style>{sliderStyles}</style>
              <ZoomSlider />
            </Panel>
          </ReactFlow>
        </div>
        
        {/* 리사이즈 핸들 */}
        <div
          onMouseDown={() => setIsResizing(true)}
          style={{
            width: '8px',
            cursor: 'col-resize',
            background: isResizing ? '#d4af37' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            zIndex: 20
          }}
        >
          <GripVertical size={16} color={isResizing ? '#0a0a1a' : '#d4af3760'} />
        </div>
        
        {/* 오른쪽: 설정 패널 */}
        <div style={{ 
          width: `${panelWidth}px`, 
          height: '100%',
          maxHeight: '100%',
          background: 'linear-gradient(180deg, #1a1a2e 0%, #12121f 100%)', 
          borderLeft: '2px solid #d4af3730', 
          padding: '20px', 
          overflowY: 'auto',
          overflowX: 'hidden',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
          transition: isResizing ? 'none' : 'width 0.1s',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #ffffff15' }}>
            <Settings size={22} color="#d4af37" />
            <span style={{ color: '#d4af37', fontWeight: '800', fontSize: '1.3rem' }}>노드 설정</span>
          </div>
          {renderSettingsPanel()}
        </div>
      </div>
      
      {/* 미리보기 모달 - 전체 장면 한눈에 보기 */}
      {showPreview && generatedContent && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.95)', 
          zIndex: 9999, 
          display: 'flex', 
          flexDirection: 'column',
          padding: '20px',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        }}>
          {/* 헤더 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px',
            flexShrink: 0
          }}>
            <div>
              <h2 style={{ color: '#d4af37', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>
                🎬 {generatedContent.title}
              </h2>
              <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
                {generatedContent.scenes.length}개 장면 • {generatedContent.scenes.filter(s => s.generatedImage).length}개 이미지 • {generatedContent.scenes.filter(s => s.generatedAudio).length}개 음성
              </p>
            </div>
            <button onClick={() => setShowPreview(false)} 
              style={{ 
                background: '#ffffff20', 
                border: 'none', 
                borderRadius: '50%', 
                width: '44px', 
                height: '44px', 
                cursor: 'pointer', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <X size={22} />
            </button>
          </div>
          
          {/* 테이블 헤더 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '70px 200px 1fr 160px 120px', 
            gap: '16px',
            padding: '12px 20px',
            background: '#1a1a2e',
            borderRadius: '12px 12px 0 0',
            borderBottom: '2px solid #d4af3740',
            flexShrink: 0
          }}>
            <span style={{ color: '#d4af37', fontWeight: '700', fontSize: '0.85rem' }}>장면</span>
            <span style={{ color: '#d4af37', fontWeight: '700', fontSize: '0.85rem' }}>이미지 (클릭하면 확대)</span>
            <span style={{ color: '#d4af37', fontWeight: '700', fontSize: '0.85rem' }}>대사 (나레이션)</span>
            <span style={{ color: '#d4af37', fontWeight: '700', fontSize: '0.85rem', textAlign: 'center' }}>음성</span>
            <span style={{ color: '#d4af37', fontWeight: '700', fontSize: '0.85rem', textAlign: 'center' }}>액션</span>
          </div>
          
          {/* 장면 목록 */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            background: '#12121f',
            borderRadius: '0 0 12px 12px'
          }}>
            {generatedContent.scenes.map((scene, i) => (
              <div key={i} style={{ 
                display: 'grid', 
                gridTemplateColumns: '70px 200px 1fr 160px 120px', 
                gap: '16px',
                padding: '16px 20px',
                borderBottom: '1px solid #ffffff10',
                alignItems: 'center',
                background: i % 2 === 0 ? 'transparent' : '#ffffff05'
              }}>
                {/* 장면 번호 */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ 
                    background: '#d4af3720', 
                    color: '#d4af37', 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontWeight: '700',
                    fontSize: '0.9rem'
                  }}>
                    #{scene.sceneNumber}
                  </span>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '4px' }}>
                    {scene.startTime}~{scene.endTime}
                  </div>
                </div>
                
                {/* 이미지 (클릭하면 확대) */}
                <div 
                  onClick={() => scene.generatedImage && setEnlargedImageIndex(i)}
                  style={{ 
                    width: '180px', 
                    height: '120px', 
                    borderRadius: '10px', 
                    overflow: 'hidden',
                    background: '#0a0a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: scene.generatedImage ? '2px solid #d4af3740' : '1px solid #ffffff10',
                    cursor: scene.generatedImage ? 'zoom-in' : 'default',
                    transition: 'all 0.2s',
                    boxShadow: scene.generatedImage ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (scene.generatedImage) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.borderColor = '#d4af37';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = scene.generatedImage ? '#d4af3740' : '#ffffff10';
                  }}
                >
                  {scene.isGeneratingImage ? (
                    <Loader2 size={24} className="animate-spin" color="#f43f5e" />
                  ) : scene.generatedImage ? (
                    <img src={scene.generatedImage} alt={`장면 ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <ImageIcon size={24} color="#64748b" />
                      <p style={{ color: '#64748b', fontSize: '0.7rem', margin: '4px 0 0 0' }}>이미지 없음</p>
                    </div>
                  )}
                </div>
                
                {/* 대사 */}
                <textarea 
                  value={scene.narration} 
                  onChange={(e) => updateNarration(i, e.target.value)}
                  style={{ 
                    width: '100%', 
                    background: '#0a0a1a', 
                    border: '1px solid #ffffff20', 
                    borderRadius: '8px', 
                    padding: '10px 12px', 
                    color: '#e2e8f0', 
                    fontSize: '0.9rem', 
                    resize: 'none', 
                    minHeight: '50px',
                    lineHeight: 1.4
                  }} 
                />
                
                {/* 음성 */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  {scene.generatedAudio ? (
                    <button 
                      onClick={() => playAudio(scene.generatedAudio!, i)}
                      style={{ 
                        padding: '8px 16px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        background: playingIndex === i ? '#ef4444' : '#10b981', 
                        color: 'white', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                      {playingIndex === i ? <><Pause size={14} /> 정지</> : <><Play size={14} /> 재생</>}
                    </button>
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {scene.isGeneratingAudio ? <Loader2 size={16} className="animate-spin" /> : '음성 없음'}
                    </span>
                  )}
                </div>
                
                {/* 액션 버튼 */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => regenerateSceneImage(i)} 
                    disabled={scene.isGeneratingImage}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      border: 'none', 
                      background: scene.isGeneratingImage ? '#f43f5e40' : '#f43f5e', 
                      color: 'white', 
                      cursor: scene.isGeneratingImage ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                    {scene.isGeneratingImage ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    {scene.isGeneratingImage ? '생성중...' : '이미지 재생성'}
                  </button>
                  <button 
                    onClick={() => regenerateSceneAudio(i)} 
                    disabled={scene.isGeneratingAudio || !canGenerateAudio}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      border: 'none', 
                      background: !canGenerateAudio ? '#64748b40' : scene.isGeneratingAudio ? '#10b98140' : '#10b981', 
                      color: 'white', 
                      cursor: scene.isGeneratingAudio || !canGenerateAudio ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                    {scene.isGeneratingAudio ? <Loader2 size={14} className="animate-spin" /> : <Mic size={14} />}
                    {scene.isGeneratingAudio ? '생성중...' : '음성 재생성'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* 이미지 확대 보기 모달 */}
          {enlargedImageIndex !== null && generatedContent.scenes[enlargedImageIndex]?.generatedImage && (
            <div 
              onClick={() => setEnlargedImageIndex(null)}
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: 'rgba(0,0,0,0.95)', 
                zIndex: 10001, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'zoom-out',
                padding: '40px'
              }}
            >
              {/* 닫기 버튼 */}
              <button 
                onClick={() => setEnlargedImageIndex(null)}
                style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  right: '20px', 
                  background: '#ffffff20', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '50px', 
                  height: '50px', 
                  cursor: 'pointer', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                ✕
              </button>
              
              {/* 장면 정보 */}
              <div style={{ 
                position: 'absolute', 
                top: '20px', 
                left: '20px', 
                background: '#d4af3720', 
                padding: '12px 20px', 
                borderRadius: '12px',
                border: '1px solid #d4af3740'
              }}>
                <span style={{ color: '#d4af37', fontWeight: '700', fontSize: '1.2rem' }}>
                  장면 #{generatedContent.scenes[enlargedImageIndex].sceneNumber}
                </span>
                <span style={{ color: '#64748b', marginLeft: '12px', fontSize: '0.9rem' }}>
                  {generatedContent.scenes[enlargedImageIndex].startTime} ~ {generatedContent.scenes[enlargedImageIndex].endTime}
                </span>
              </div>
              
              {/* 확대된 이미지 */}
              <img 
                src={generatedContent.scenes[enlargedImageIndex].generatedImage} 
                alt={`장면 ${enlargedImageIndex + 1} 확대`} 
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  maxWidth: '90vw', 
                  maxHeight: '80vh', 
                  objectFit: 'contain',
                  borderRadius: '16px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  border: '3px solid #d4af3740',
                  cursor: 'default'
                }} 
              />
              
              {/* 대사 표시 */}
              <div style={{ 
                marginTop: '20px', 
                background: '#1a1a2e', 
                padding: '16px 24px', 
                borderRadius: '12px',
                maxWidth: '800px',
                textAlign: 'center',
                border: '1px solid #ffffff10'
              }}>
                <p style={{ color: '#e2e8f0', fontSize: '1.1rem', margin: 0, lineHeight: 1.6 }}>
                  "{generatedContent.scenes[enlargedImageIndex].narration}"
                </p>
              </div>
              
              {/* 이전/다음 버튼 */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginTop: '20px' 
              }}>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setEnlargedImageIndex(Math.max(0, enlargedImageIndex - 1)); 
                  }}
                  disabled={enlargedImageIndex === 0}
                  style={{ 
                    padding: '12px 24px', 
                    borderRadius: '10px', 
                    border: 'none', 
                    background: enlargedImageIndex === 0 ? '#ffffff20' : '#3b82f6', 
                    color: 'white', 
                    cursor: enlargedImageIndex === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: '700',
                    fontSize: '1rem'
                  }}>
                  ◀ 이전 장면
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setEnlargedImageIndex(Math.min(generatedContent.scenes.length - 1, enlargedImageIndex + 1)); 
                  }}
                  disabled={enlargedImageIndex === generatedContent.scenes.length - 1}
                  style={{ 
                    padding: '12px 24px', 
                    borderRadius: '10px', 
                    border: 'none', 
                    background: enlargedImageIndex === generatedContent.scenes.length - 1 ? '#ffffff20' : '#3b82f6', 
                    color: 'white', 
                    cursor: enlargedImageIndex === generatedContent.scenes.length - 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '700',
                    fontSize: '1rem'
                  }}>
                  다음 장면 ▶
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        
        /* 노드 내부 스크롤바 숨김 */
        .react-flow__node *::-webkit-scrollbar { display: none; }
        .react-flow__node * { scrollbar-width: none; -ms-overflow-style: none; }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 40px var(--glow-color, #d4af37)60; }
          50% { box-shadow: 0 0 80px var(--glow-color, #d4af37)90, 0 0 120px var(--glow-color, #d4af37)40; }
        }
        
        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-10px); opacity: 0.4; }
          75% { transform: translateY(-30px) translateX(5px); opacity: 0.5; }
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        .run-button-glow {
          animation: button-glow 2s ease-in-out infinite;
        }
        
        @keyframes button-glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4); }
          50% { box-shadow: 0 4px 40px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.4); }
        }
        
        .node-pulse {
          animation: node-glow 1.5s ease-in-out infinite;
        }
        
        @keyframes node-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0a0a1a; }
        ::-webkit-scrollbar-thumb { background: #d4af3740; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #d4af3780; }
      `}</style>
    </div>
  );
};

export default AIConstructionSiteStep3Page;
