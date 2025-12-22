import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Play, Square, Youtube, Archive, ChevronLeft } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

const COLORS = {
  navy: '#0f172a',
  navyLight: '#1e293b',
  blue: '#0ea5e9',
  cyan: '#06b6d4',
  gold: '#fbbf24',
  red: '#ef4444',
  green: '#22c55e',
  white: '#ffffff',
  gray: '#94a3b8',
  youtube: '#FF0000'
};

// 강의 설정 (월~수만 운영)
const COURSES = [
  { id: 'free-live', name: '🆓 무료 라이브 (AI 수익화 토크)', color: COLORS.youtube, dayOfWeek: '월요일' },
  { id: 'ai-building-course', name: '🏠 AI 건물주 되기', color: COLORS.blue, dayOfWeek: '화요일' },
  { id: 'chatgpt-agent-beginner', name: '🤖 AI 에이전트 비기너', color: COLORS.cyan, dayOfWeek: '수요일' },
];

interface LiveConfig {
  isLive: boolean;
  liveUrl: string;
  liveTitle: string;
  updatedAt?: string;
  startedAt?: string;
}

const LiveControlPage: React.FC = () => {
  const navigate = useNavigate();
  const [liveConfigs, setLiveConfigs] = useState<{ [courseId: string]: LiveConfig }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  
  // 폼 상태
  const [formData, setFormData] = useState<{ [courseId: string]: { url: string; title: string } }>({});

  useEffect(() => {
    loadAllConfigs();
  }, []);

  const loadAllConfigs = async () => {
    setLoading(true);
    try {
      const configs = await AzureTableService.getAllLiveConfigs();
      setLiveConfigs(configs);
      
      // 폼 데이터 초기화
      const initialFormData: { [courseId: string]: { url: string; title: string } } = {};
      COURSES.forEach(course => {
        initialFormData[course.id] = {
          url: configs[course.id]?.liveUrl || '',
          title: configs[course.id]?.liveTitle || ''
        };
      });
      setFormData(initialFormData);
    } catch (error) {
      console.error('설정 로드 실패:', error);
    }
    setLoading(false);
  };

  // 🔴 라이브 시작
  const handleStartLive = async (courseId: string) => {
    const form = formData[courseId];
    if (!form?.url) {
      alert('유튜브 라이브 URL을 입력해주세요!');
      return;
    }
    if (!form?.title) {
      alert('라이브 제목을 입력해주세요!');
      return;
    }

    setSaving(courseId);
    try {
      // 유튜브 URL에서 ID 추출
      const youtubeId = extractYoutubeId(form.url);
      
      await AzureTableService.updateLiveConfig(courseId, {
        isLive: true,
        liveUrl: youtubeId || form.url,
        liveTitle: form.title
      });
      
      alert(`🔴 라이브가 시작되었습니다!\n\n"${form.title}"\n\n수강생들이 이제 라이브를 볼 수 있습니다.`);
      await loadAllConfigs();
    } catch (error) {
      console.error('라이브 시작 실패:', error);
      alert('❌ 라이브 시작에 실패했습니다.');
    }
    setSaving(null);
  };

  // ⬛ 라이브 종료 + 자동 아카이브
  const handleEndLive = async (courseId: string) => {
    const config = liveConfigs[courseId];
    if (!config?.isLive) return;

    const confirmEnd = window.confirm(
      `라이브를 종료하시겠습니까?\n\n"${config.liveTitle}"\n\n✅ 자동으로 아카이브에 저장됩니다.`
    );
    if (!confirmEnd) return;

    setSaving(courseId);
    try {
      // 1. 아카이브에 저장
      await AzureTableService.addLiveArchive({
        courseId: courseId,
        title: config.liveTitle,
        description: `${new Date().toLocaleDateString('ko-KR')} 라이브 방송`,
        date: new Date().toISOString().split('T')[0],
        youtubeId: config.liveUrl,
        duration: calculateDuration(config.startedAt || config.updatedAt)
      });

      // 2. 라이브 OFF
      await AzureTableService.updateLiveConfig(courseId, {
        isLive: false,
        liveUrl: '',
        liveTitle: ''
      });
      
      alert(`✅ 라이브가 종료되었습니다!\n\n"${config.liveTitle}"\n\n📺 아카이브에 자동 저장되었습니다.`);
      await loadAllConfigs();
    } catch (error) {
      console.error('라이브 종료 실패:', error);
      alert('❌ 라이브 종료에 실패했습니다.');
    }
    setSaving(null);
  };

  // 유튜브 URL에서 ID 추출
  const extractYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // 방송 시간 계산
  const calculateDuration = (startTime?: string): string => {
    if (!startTime) return '';
    const start = new Date(startTime);
    const now = new Date();
    const diffMinutes = Math.round((now.getTime() - start.getTime()) / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const getTodaySchedule = () => {
    const dayOfWeek = new Date().getDay();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[dayOfWeek] + '요일';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: COLORS.white, fontSize: '1.2rem' }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)` }}>
      <NavigationBar />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        {/* 헤더 */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: COLORS.gray,
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            <ChevronLeft size={20} />
            어드민으로 돌아가기
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Radio size={32} color={COLORS.red} />
            <h1 style={{ color: COLORS.white, fontSize: '2rem', margin: 0 }}>
              라이브 관리
            </h1>
          </div>
          <p style={{ color: COLORS.gray, margin: 0 }}>
            오늘은 <strong style={{ color: COLORS.gold }}>{getTodaySchedule()}</strong>입니다. 라이브를 시작하거나 종료할 수 있습니다.
          </p>
        </div>

        {/* 강의별 라이브 컨트롤 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {COURSES.map(course => {
            const config = liveConfigs[course.id];
            const isLive = config?.isLive || false;
            const form = formData[course.id] || { url: '', title: '' };

            return (
              <div
                key={course.id}
                style={{
                  background: COLORS.navyLight,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: isLive ? `2px solid ${COLORS.red}` : '2px solid transparent',
                  boxShadow: isLive ? `0 0 20px ${COLORS.red}40` : 'none'
                }}
              >
                {/* 강의 헤더 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ color: COLORS.white, margin: 0, fontSize: '1.3rem' }}>
                      {course.name}
                    </h2>
                    <p style={{ color: COLORS.gray, margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                      {course.dayOfWeek} 20:00
                    </p>
                  </div>
                  
                  {/* 라이브 상태 표시 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    background: isLive ? COLORS.red : COLORS.navy,
                    color: COLORS.white
                  }}>
                    {isLive ? (
                      <>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: COLORS.white,
                          animation: 'pulse 1s infinite'
                        }} />
                        <span style={{ fontWeight: 'bold' }}>LIVE</span>
                      </>
                    ) : (
                      <>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: COLORS.gray
                        }} />
                        <span>OFF</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 라이브 중일 때 */}
                {isLive ? (
                  <div>
                    <div style={{
                      background: COLORS.navy,
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <p style={{ color: COLORS.gray, margin: '0 0 0.5rem', fontSize: '0.9rem' }}>현재 방송 중</p>
                      <p style={{ color: COLORS.white, margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
                        📺 {config?.liveTitle}
                      </p>
                      <p style={{ color: COLORS.gray, margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
                        <Youtube size={14} style={{ marginRight: '0.25rem' }} />
                        {config?.liveUrl}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleEndLive(course.id)}
                      disabled={saving === course.id}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: COLORS.gray,
                        color: COLORS.navy,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Square size={18} />
                      {saving === course.id ? '처리 중...' : '라이브 종료 + 아카이브 저장'}
                    </button>
                  </div>
                ) : (
                  /* 라이브 시작 폼 */
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ color: COLORS.gray, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                        유튜브 라이브 URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://youtube.com/live/xxx 또는 영상 ID"
                        value={form.url}
                        onChange={(e) => setFormData({
                          ...formData,
                          [course.id]: { ...form, url: e.target.value }
                        })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: `1px solid ${COLORS.gray}40`,
                          background: COLORS.navy,
                          color: COLORS.white,
                          fontSize: '1rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ color: COLORS.gray, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                        라이브 제목
                      </label>
                      <input
                        type="text"
                        placeholder="예: EP.5 GPT로 자동화 시스템 만들기"
                        value={form.title}
                        onChange={(e) => setFormData({
                          ...formData,
                          [course.id]: { ...form, title: e.target.value }
                        })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: `1px solid ${COLORS.gray}40`,
                          background: COLORS.navy,
                          color: COLORS.white,
                          fontSize: '1rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <button
                      onClick={() => handleStartLive(course.id)}
                      disabled={saving === course.id}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: COLORS.red,
                        color: COLORS.white,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Play size={18} />
                      {saving === course.id ? '시작 중...' : '🔴 라이브 시작'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 아카이브 관리 링크 */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/admin/live-archives')}
            style={{
              background: 'transparent',
              border: `1px solid ${COLORS.gray}40`,
              color: COLORS.gray,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Archive size={18} />
            아카이브 관리 페이지로 이동
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default LiveControlPage;

