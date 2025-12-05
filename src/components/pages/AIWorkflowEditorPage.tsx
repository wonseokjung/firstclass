import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
  NodeTypes,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  ArrowLeft,
  Play,
  Save,
  Plus,
  Trash2,
  Zap,
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  MessageSquare,
  Settings,
  ChevronRight,
  Sparkles,
  Globe,
  Download,
  X
} from 'lucide-react';

// 노드 데이터 타입
interface NodeData {
  label: string;
  type: string;
  icon: React.ReactNode;
  color: string;
  config?: Record<string, any>;
  output?: any;
}

// 커스텀 노드 컴포넌트
const CustomNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
        border: selected ? '2px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '0',
        minWidth: '180px',
        boxShadow: selected 
          ? '0 0 20px rgba(212, 175, 55, 0.3)' 
          : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.2s'
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          background: data.color,
          padding: '10px 15px',
          borderRadius: '10px 10px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '8px', 
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {data.icon}
        </div>
        <span style={{ 
          color: 'white', 
          fontWeight: '700', 
          fontSize: '0.85rem',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          {data.label}
        </span>
      </div>
      
      {/* 바디 */}
      <div style={{ padding: '12px 15px' }}>
        <span style={{ 
          color: '#94a3b8', 
          fontSize: '0.75rem' 
        }}>
          {data.type}
        </span>
        {data.output && (
          <div style={{
            marginTop: '8px',
            padding: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <span style={{ color: '#10b981', fontSize: '0.7rem' }}>
              ✓ 완료
            </span>
          </div>
        )}
      </div>
      
      {/* 핸들 (연결점) */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: '12px',
          height: '12px',
          background: '#d4af37',
          border: '2px solid #1e1e2e'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: '12px',
          height: '12px',
          background: '#d4af37',
          border: '2px solid #1e1e2e'
        }}
      />
    </div>
  );
};

// 노드 타입 정의
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// 사용 가능한 노드 목록
const availableNodes = [
  {
    category: '입력',
    color: '#3b82f6',
    nodes: [
      { id: 'topic', label: '📝 주제 입력', type: 'input', icon: <FileText size={16} color="white" /> },
      { id: 'image', label: '🖼️ 이미지 입력', type: 'input', icon: <ImageIcon size={16} color="white" /> },
      { id: 'text', label: '📄 텍스트 입력', type: 'input', icon: <MessageSquare size={16} color="white" /> },
    ]
  },
  {
    category: 'AI 처리',
    color: '#8b5cf6',
    nodes: [
      { id: 'gpt', label: '🤖 GPT (대본)', type: 'ai', icon: <Sparkles size={16} color="white" /> },
      { id: 'imageGen', label: '🎨 이미지 생성', type: 'ai', icon: <ImageIcon size={16} color="white" /> },
      { id: 'tts', label: '🔊 음성 생성', type: 'ai', icon: <Mic size={16} color="white" /> },
    ]
  },
  {
    category: '출력',
    color: '#10b981',
    nodes: [
      { id: 'video', label: '📹 영상 출력', type: 'output', icon: <Video size={16} color="white" /> },
      { id: 'download', label: '📥 다운로드', type: 'output', icon: <Download size={16} color="white" /> },
      { id: 'preview', label: '👁️ 미리보기', type: 'output', icon: <Globe size={16} color="white" /> },
    ]
  }
];

// 초기 노드 (예시 워크플로우)
const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 200 },
    data: {
      label: '📝 주제 입력',
      type: '콘텐츠 주제를 입력받습니다',
      icon: <FileText size={16} color="white" />,
      color: '#3b82f6',
      config: { topic: '' }
    }
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 350, y: 200 },
    data: {
      label: '🤖 GPT (대본)',
      type: 'Azure OpenAI로 대본 생성',
      icon: <Sparkles size={16} color="white" />,
      color: '#8b5cf6',
      config: { model: 'gpt-4', scenes: 6 }
    }
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 600, y: 100 },
    data: {
      label: '🎨 이미지 생성',
      type: 'Pollinations AI',
      icon: <ImageIcon size={16} color="white" />,
      color: '#8b5cf6',
      config: { model: 'pollinations' }
    }
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 600, y: 300 },
    data: {
      label: '🔊 음성 생성',
      type: 'ElevenLabs TTS',
      icon: <Mic size={16} color="white" />,
      color: '#8b5cf6',
      config: { voice: 'rachel' }
    }
  },
  {
    id: '5',
    type: 'custom',
    position: { x: 850, y: 200 },
    data: {
      label: '📹 영상 출력',
      type: '이미지 + 음성 합성',
      icon: <Video size={16} color="white" />,
      color: '#10b981'
    }
  }
];

// 초기 연결선
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#d4af37', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#d4af37', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#d4af37', strokeWidth: 2 } },
  { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#d4af37', strokeWidth: 2 } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#d4af37', strokeWidth: 2 } },
];

const AIWorkflowEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showNodePanel, setShowNodePanel] = useState(true);
  const [runProgress, setRunProgress] = useState(0);

  // 연결 처리
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#d4af37', strokeWidth: 2 }
    }, eds)),
    [setEdges]
  );

  // 노드 선택
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<NodeData>) => {
    setSelectedNode(node);
  }, []);

  // 노드 추가
  const addNode = useCallback((nodeTemplate: any, categoryColor: string) => {
    const newNode: Node<NodeData> = {
      id: `node_${Date.now()}`,
      type: 'custom',
      position: { x: 400, y: 300 },
      data: {
        label: nodeTemplate.label,
        type: nodeTemplate.type === 'input' ? '입력 노드' : 
              nodeTemplate.type === 'ai' ? 'AI 처리 노드' : '출력 노드',
        icon: nodeTemplate.icon,
        color: categoryColor,
        config: {}
      }
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // 선택된 노드 삭제
  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  // 워크플로우 실행
  const runWorkflow = useCallback(async () => {
    setIsRunning(true);
    setRunProgress(0);
    
    // 시뮬레이션: 각 노드 순차 실행
    const orderedNodes = [...nodes];
    
    for (let i = 0; i < orderedNodes.length; i++) {
      await new Promise(r => setTimeout(r, 1000));
      setRunProgress(Math.round(((i + 1) / orderedNodes.length) * 100));
      
      // 노드 완료 표시
      setNodes((nds) => nds.map((n) => {
        if (n.id === orderedNodes[i].id) {
          return {
            ...n,
            data: { ...n.data, output: { completed: true } }
          };
        }
        return n;
      }));
    }
    
    setIsRunning(false);
    alert('✅ 워크플로우 실행 완료!');
  }, [nodes, setNodes]);

  // 워크플로우 저장
  const saveWorkflow = useCallback(() => {
    const workflow = { nodes, edges };
    localStorage.setItem('ai_workflow', JSON.stringify(workflow));
    alert('✅ 워크플로우가 저장되었습니다!');
  }, [nodes, edges]);

  // 워크플로우 로드
  const loadWorkflow = useCallback(() => {
    const saved = localStorage.getItem('ai_workflow');
    if (saved) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
      setNodes(savedNodes);
      setEdges(savedEdges);
    }
  }, [setNodes, setEdges]);

  // 초기 로드
  React.useEffect(() => {
    loadWorkflow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: '#0a0a1a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 상단 툴바 */}
      <div style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate('/ai-construction-site')}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} />
            돌아가기
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={24} color="#d4af37" />
            <h1 style={{ 
              color: '#d4af37', 
              fontSize: '1.3rem', 
              fontWeight: '800',
              margin: 0
            }}>
              AI Workflow Editor
            </h1>
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: '700'
            }}>
              BETA
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* 진행률 표시 */}
          {isRunning && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginRight: '20px'
            }}>
              <div style={{
                width: '150px',
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${runProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #d4af37, #f4d03f)',
                  transition: 'width 0.3s'
                }} />
              </div>
              <span style={{ color: '#d4af37', fontSize: '0.85rem' }}>
                {runProgress}%
              </span>
            </div>
          )}
          
          <button
            onClick={saveWorkflow}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '8px',
              padding: '10px 20px',
              color: '#3b82f6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <Save size={18} />
            저장
          </button>
          
          <button
            onClick={runWorkflow}
            disabled={isRunning}
            style={{
              background: isRunning 
                ? 'rgba(212, 175, 55, 0.3)' 
                : 'linear-gradient(135deg, #d4af37, #f4d03f)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              color: '#0a0a1a',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '700',
              fontSize: '0.95rem'
            }}
          >
            <Play size={18} />
            {isRunning ? '실행 중...' : '실행'}
          </button>
        </div>
      </div>
      
      {/* 메인 영역 */}
      <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
        {/* 왼쪽: 노드 팔레트 */}
        <div style={{
          width: showNodePanel ? '280px' : '0',
          background: 'linear-gradient(180deg, #1a1a2e 0%, #12121f 100%)',
          borderRight: '1px solid rgba(212, 175, 55, 0.1)',
          overflow: 'hidden',
          transition: 'width 0.3s'
        }}>
          <div style={{ padding: '20px', width: '280px' }}>
            <h3 style={{ 
              color: '#d4af37', 
              fontSize: '0.9rem', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Plus size={18} />
              노드 추가
            </h3>
            
            {availableNodes.map((category) => (
              <div key={category.category} style={{ marginBottom: '20px' }}>
                <div style={{
                  color: category.color,
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {category.category}
                </div>
                
                {category.nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => addNode(node, category.color)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${category.color}20`;
                      e.currentTarget.style.borderColor = category.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <div style={{
                      background: category.color,
                      borderRadius: '6px',
                      padding: '6px',
                      display: 'flex'
                    }}>
                      {node.icon}
                    </div>
                    <span style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>
                      {node.label}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* 토글 버튼 */}
        <button
          onClick={() => setShowNodePanel(!showNodePanel)}
          style={{
            position: 'absolute',
            left: showNodePanel ? '280px' : '0',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#1a1a2e',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderLeft: 'none',
            borderRadius: '0 8px 8px 0',
            padding: '10px 5px',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'left 0.3s'
          }}
        >
          <ChevronRight 
            size={18} 
            color="#d4af37" 
            style={{ 
              transform: showNodePanel ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s'
            }} 
          />
        </button>
        
        {/* 중앙: 캔버스 */}
        <div style={{ flex: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            style={{ background: '#0a0a1a' }}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#d4af37', strokeWidth: 2 }
            }}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1} 
              color="rgba(212, 175, 55, 0.1)" 
            />
            <Controls 
              style={{ 
                background: '#1a1a2e', 
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '8px'
              }}
            />
            
            {/* 캔버스 안내 */}
            <Panel position="bottom-center">
              <div style={{
                background: 'rgba(26, 26, 46, 0.9)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '10px',
                padding: '10px 20px',
                color: '#94a3b8',
                fontSize: '0.8rem',
                display: 'flex',
                gap: '20px'
              }}>
                <span>🖱️ 드래그: 노드 이동</span>
                <span>🔗 핸들 드래그: 연결</span>
                <span>⌫ Delete: 노드 삭제</span>
              </div>
            </Panel>
          </ReactFlow>
        </div>
        
        {/* 오른쪽: 노드 설정 패널 */}
        {selectedNode && (
          <div style={{
            width: '300px',
            background: 'linear-gradient(180deg, #1a1a2e 0%, #12121f 100%)',
            borderLeft: '1px solid rgba(212, 175, 55, 0.1)',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ 
                color: '#d4af37', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0
              }}>
                <Settings size={18} />
                노드 설정
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* 노드 정보 */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px'
              }}>
                <div style={{
                  background: selectedNode.data.color,
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex'
                }}>
                  {selectedNode.data.icon}
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    {selectedNode.data.label}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                    {selectedNode.data.type}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 삭제 버튼 */}
            <button
              onClick={deleteSelectedNode}
              style={{
                width: '100%',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: '600'
              }}
            >
              <Trash2 size={18} />
              노드 삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWorkflowEditorPage;



