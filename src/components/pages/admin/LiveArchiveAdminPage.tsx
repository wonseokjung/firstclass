import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Play, Calendar, Video } from 'lucide-react';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

const COLORS = {
  navy: '#0d1b2a',
  navyLight: '#0d1b2a',
  blue: '#0ea5e9',
  cyan: '#06b6d4',
  purple: '#8b5cf6',
  gold: '#ffd60a',
  red: '#ef4444',
  white: '#ffffff',
  gray: '#94a3b8',
  youtube: '#FF0000'
};

// 강의별 설정
const COURSES = [
  { id: 'free-live', name: '🆓 무료 라이브', color: COLORS.youtube, dayOfWeek: '월요일' },
  { id: 'ai-building-course', name: '🏠 AI 건물주 되기', color: COLORS.blue, dayOfWeek: '화요일' },
  { id: 'chatgpt-agent-beginner', name: '🤖 AI 에이전트 비기너', color: COLORS.cyan, dayOfWeek: '수요일' },
  { id: 'vibe-coding', name: '💻 바이브코딩', color: COLORS.purple, dayOfWeek: '목요일' },
];

interface Archive {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  date: string;
  youtubeId: string;
  duration?: string;
  createdAt: string;
}

const LiveArchiveAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // 새 아카이브 폼
  const [newArchive, setNewArchive] = useState({
    courseId: 'ai-building-course',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    youtubeId: '',
    duration: ''
  });

  useEffect(() => {
    loadArchives();
  }, []);

  const loadArchives = async () => {
    setLoading(true);
    try {
      const data = await AzureTableService.getAllLiveArchives();
      setArchives(data);
    } catch (error) {
      console.error('아카이브 로드 실패:', error);
    }
    setLoading(false);
  };

  const handleAddArchive = async () => {
    if (!newArchive.title || !newArchive.youtubeId) {
      alert('제목과 유튜브 ID를 입력해주세요');
      return;
    }

    setSaving(true);
    try {
      await AzureTableService.addLiveArchive({
        courseId: newArchive.courseId,
        title: newArchive.title,
        description: newArchive.description,
        date: newArchive.date,
        youtubeId: newArchive.youtubeId,
        duration: newArchive.duration
      });
      
      alert('✅ 아카이브가 추가되었습니다!');
      setShowAddForm(false);
      setNewArchive({
        courseId: 'ai-building-course',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        youtubeId: '',
        duration: ''
      });
      await loadArchives();
    } catch (error) {
      console.error('아카이브 추가 실패:', error);
      alert('❌ 아카이브 추가에 실패했습니다');
    }
    setSaving(false);
  };

  const handleDeleteArchive = async (archiveId: string) => {
    if (!window.confirm('정말 이 아카이브를 삭제하시겠습니까?')) return;

    try {
      await AzureTableService.deleteLiveArchive(archiveId);
      alert('✅ 삭제되었습니다');
      await loadArchives();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('❌ 삭제에 실패했습니다');
    }
  };

  const filteredArchives = selectedCourse === 'all' 
    ? archives 
    : archives.filter(a => a.courseId === selectedCourse);

  const getCourseInfo = (courseId: string) => {
    return COURSES.find(c => c.id === courseId) || { name: courseId, color: COLORS.gray, dayOfWeek: '' };
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.navy }}>
      <NavigationBar onBack={() => navigate('/admin/fix-enrollments')} breadcrumbText="라이브 아카이브 관리" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ color: COLORS.white, fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
              📺 라이브 아카이브 관리
            </h1>
            <p style={{ color: COLORS.gray }}>
              각 강의별 라이브 녹화 영상을 관리합니다
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`,
              color: COLORS.white,
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={20} />
            아카이브 추가
          </button>
        </div>

        {/* 필터 */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '25px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setSelectedCourse('all')}
            style={{
              background: selectedCourse === 'all' ? COLORS.gold : COLORS.navyLight,
              color: selectedCourse === 'all' ? COLORS.navy : COLORS.white,
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            전체 ({archives.length})
          </button>
          {COURSES.map(course => {
            const count = archives.filter(a => a.courseId === course.id).length;
            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                style={{
                  background: selectedCourse === course.id ? course.color : COLORS.navyLight,
                  color: COLORS.white,
                  border: `2px solid ${selectedCourse === course.id ? course.color : 'transparent'}`,
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {course.name} ({count})
              </button>
            );
          })}
        </div>

        {/* 추가 폼 */}
        {showAddForm && (
          <div style={{
            background: COLORS.navyLight,
            borderRadius: '16px',
            padding: '25px',
            marginBottom: '25px',
            border: `2px solid ${COLORS.blue}40`
          }}>
            <h3 style={{ color: COLORS.white, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Video size={22} />
              새 아카이브 추가
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ color: COLORS.gray, fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>강의 선택</label>
                <select
                  value={newArchive.courseId}
                  onChange={(e) => setNewArchive({...newArchive, courseId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: COLORS.navy,
                    color: COLORS.white,
                    fontSize: '1rem'
                  }}
                >
                  {COURSES.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ color: COLORS.gray, fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>라이브 날짜</label>
                <input
                  type="date"
                  value={newArchive.date}
                  onChange={(e) => setNewArchive({...newArchive, date: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: COLORS.navy,
                    color: COLORS.white,
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div>
                <label style={{ color: COLORS.gray, fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>재생 시간 (예: 1:30:00)</label>
                <input
                  type="text"
                  placeholder="1:30:00"
                  value={newArchive.duration}
                  onChange={(e) => setNewArchive({...newArchive, duration: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: COLORS.navy,
                    color: COLORS.white,
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: COLORS.gray, fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>제목 *</label>
                <input
                  type="text"
                  placeholder="Week 1: AI 건물주 마인드셋"
                  value={newArchive.title}
                  onChange={(e) => setNewArchive({...newArchive, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: COLORS.navy,
                    color: COLORS.white,
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: COLORS.gray, fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>유튜브 비디오 ID * (URL에서 v= 다음 부분)</label>
                <input
                  type="text"
                  placeholder="dQw4w9WgXcQ"
                  value={newArchive.youtubeId}
                  onChange={(e) => setNewArchive({...newArchive, youtubeId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: COLORS.navy,
                    color: COLORS.white,
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: COLORS.gray, fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>설명 (선택)</label>
                <textarea
                  placeholder="이번 라이브에서 다룬 내용..."
                  value={newArchive.description}
                  onChange={(e) => setNewArchive({...newArchive, description: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: COLORS.navy,
                    color: COLORS.white,
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  background: 'transparent',
                  color: COLORS.gray,
                  border: `1px solid ${COLORS.gray}`,
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                onClick={handleAddArchive}
                disabled={saving}
                style={{
                  background: COLORS.blue,
                  color: COLORS.white,
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        )}

        {/* 아카이브 목록 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: COLORS.gray }}>
            로딩 중...
          </div>
        ) : filteredArchives.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: COLORS.navyLight,
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📼</div>
            <p style={{ color: COLORS.gray, fontSize: '1.1rem' }}>
              {selectedCourse === 'all' ? '아직 아카이브가 없습니다' : '이 강의의 아카이브가 없습니다'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredArchives.map(archive => {
              const courseInfo = getCourseInfo(archive.courseId);
              return (
                <div
                  key={archive.id}
                  style={{
                    background: COLORS.navyLight,
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    border: `1px solid ${courseInfo.color}30`
                  }}
                >
                  {/* 썸네일 */}
                  <div
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${archive.youtubeId}`, '_blank')}
                    style={{
                      width: '160px',
                      height: '90px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${archive.youtubeId}/mqdefault.jpg`}
                      alt={archive.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '40px',
                      height: '40px',
                      background: 'rgba(0,0,0,0.7)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Play size={20} color={COLORS.white} style={{ marginLeft: '2px' }} />
                    </div>
                    {archive.duration && (
                      <div style={{
                        position: 'absolute',
                        bottom: '5px',
                        right: '5px',
                        background: 'rgba(0,0,0,0.8)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        color: COLORS.white
                      }}>
                        {archive.duration}
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{
                        background: courseInfo.color,
                        color: COLORS.white,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        {courseInfo.name}
                      </span>
                      <span style={{ color: COLORS.gray, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} />
                        {archive.date}
                      </span>
                    </div>
                    <h3 style={{ color: COLORS.white, fontSize: '1.1rem', fontWeight: '600', marginBottom: '5px' }}>
                      {archive.title}
                    </h3>
                    {archive.description && (
                      <p style={{ color: COLORS.gray, fontSize: '0.9rem', margin: 0 }}>
                        {archive.description}
                      </p>
                    )}
                  </div>

                  {/* 액션 */}
                  <button
                    onClick={() => handleDeleteArchive(archive.id)}
                    style={{
                      background: `${COLORS.red}20`,
                      color: COLORS.red,
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveArchiveAdminPage;













