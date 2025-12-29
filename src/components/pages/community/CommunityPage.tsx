import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';

interface Post {
  id: string;
  category: 'question' | 'intro' | 'channel' | 'review' | 'tips';
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
  likes: number;
  comments: number;
}

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [hasEnrolledCourses, setHasEnrolledCourses] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ category: 'question', title: '', content: '' });
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: '전체', icon: '📋' },
    { id: 'question', name: '질문', icon: '❓' },
    { id: 'intro', name: '자기소개', icon: '👋' },
    { id: 'channel', name: '채널공유', icon: '📺' },
    { id: 'review', name: '수강후기', icon: '⭐' },
    { id: 'tips', name: '꿀팁공유', icon: '💡' }
  ];

  // 샘플 게시글 데이터
  const samplePosts: Post[] = [
    {
      id: '1',
      category: 'intro',
      title: '안녕하세요! AI 건물주 강의 시작했습니다 🎉',
      content: '유튜브에서 AI City Builders를 알게 되어 강의를 시작하게 되었습니다. 잘 부탁드립니다!',
      author: '김철수',
      authorEmail: 'kim***@gmail.com',
      createdAt: '2025-12-07T10:00:00',
      likes: 15,
      comments: 8
    },
    {
      id: '2',
      category: 'question',
      title: 'GPT-4o와 Claude 중 어떤 걸 먼저 배워야 할까요?',
      content: 'AI 에이전트 강의를 듣고 있는데, 두 모델 중 어떤 것을 먼저 집중적으로 배워야 할지 고민입니다.',
      author: '이영희',
      authorEmail: 'lee***@naver.com',
      createdAt: '2025-12-07T09:30:00',
      likes: 23,
      comments: 12
    },
    {
      id: '3',
      category: 'channel',
      title: '제 유튜브 채널 공유합니다! AI 리뷰 채널이에요',
      content: 'AI 도구 리뷰하는 채널 운영 중입니다. 관심 있으시면 놀러오세요! https://youtube.com/@example',
      author: '박지민',
      authorEmail: 'park***@gmail.com',
      createdAt: '2025-12-06T18:00:00',
      likes: 45,
      comments: 20
    },
    {
      id: '4',
      category: 'review',
      title: 'AI 건물주 되기 강의 완강 후기 ⭐⭐⭐⭐⭐',
      content: '한 달 동안 열심히 들었는데 정말 많은 것을 배웠습니다. 특히 비즈니스 마인드셋 부분이 인상적이었어요!',
      author: '최민수',
      authorEmail: 'choi***@gmail.com',
      createdAt: '2025-12-06T15:00:00',
      likes: 67,
      comments: 25
    },
    {
      id: '5',
      category: 'tips',
      title: 'ChatGPT 프롬프트 작성 꿀팁 공유합니다',
      content: '강의 들으면서 정리한 프롬프트 작성 팁입니다. 1. 역할 부여하기 2. 구체적인 지시 3. 출력 형식 지정...',
      author: '정다은',
      authorEmail: 'jung***@naver.com',
      createdAt: '2025-12-05T20:00:00',
      likes: 89,
      comments: 34
    }
  ];

  useEffect(() => {
    const userSession = sessionStorage.getItem('aicitybuilders_user_session');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        setIsLoggedIn(true);
        setUserInfo(user);
        const enrollments = user?.enrolledCourses?.enrollments || [];
        setHasEnrolledCourses(enrollments.length > 0);
      } catch (e) {
        console.error('사용자 정보 파싱 오류:', e);
      }
    }
    
    // 로컬 스토리지에서 게시글 로드
    const savedPosts = localStorage.getItem('community_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(samplePosts);
      localStorage.setItem('community_posts', JSON.stringify(samplePosts));
    }
    
    setLoading(false);
  }, []);

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      category: newPost.category as any,
      title: newPost.title,
      content: newPost.content,
      author: userInfo?.name || '익명',
      authorEmail: userInfo?.email?.replace(/(.{3}).*(@.*)/, '$1***$2') || '',
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('community_posts', JSON.stringify(updatedPosts));
    setShowWriteModal(false);
    setNewPost({ category: 'question', title: '', content: '' });
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return '방금 전';
    if (hours < 24) return `${hours}시간 전`;
    if (hours < 48) return '어제';
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // 미로그인 또는 수강생 아닌 경우
  if (!isLoggedIn || !hasEnrolledCourses) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff' }}>
        <NavigationBar />
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          padding: '100px 20px', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '20px' }}>
            수강생 전용 커뮤니티입니다
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.8' }}>
            강의를 수강하시면 커뮤니티에서<br/>
            다른 수강생들과 소통하실 수 있습니다!<br/><br/>
            질문, 자기소개, 채널 공유, 수강 후기 등<br/>
            다양한 활동이 가능합니다.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isLoggedIn && (
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                로그인하기
              </button>
            )}
            <button
              onClick={() => navigate('/ai-construction-site')}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                fontSize: '1.1rem',
                fontWeight: '700',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              강의 보러가기 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <NavigationBar />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(15px, 3vw, 20px)' }}>
        {/* 헤더 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ 
              color: 'white', 
              fontSize: '2.2rem', 
              fontWeight: '800',
              marginBottom: '10px'
            }}>
              💬 수강생 커뮤니티
            </h1>
            <p style={{ color: '#94a3b8' }}>
              질문하고, 소통하고, 함께 성장해요!
            </p>
          </div>
          
          <button
            onClick={() => setShowWriteModal(true)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ✏️ 글쓰기
          </button>
        </div>

        {/* 카테고리 탭 */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '25px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? '#3b82f6' : '#0d1b2a',
                color: selectedCategory === cat.id ? 'white' : '#94a3b8',
                border: '1px solid',
                borderColor: selectedCategory === cat.id ? '#3b82f6' : '#1b263b',
                padding: '10px 18px',
                borderRadius: '25px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* 게시글 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredPosts.length === 0 ? (
            <div style={{
              background: '#0d1b2a',
              borderRadius: '16px',
              padding: '50px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📝</div>
              <p style={{ color: '#94a3b8' }}>
                아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const catInfo = getCategoryInfo(post.category);
              return (
                <div
                  key={post.id}
                  style={{
                    background: '#0d1b2a',
                    border: '1px solid #1b263b',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1b263b';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        background: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        color: '#94a3b8'
                      }}>
                        {catInfo.icon} {catInfo.name}
                      </span>
                    </div>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    color: 'white', 
                    fontSize: '1.15rem', 
                    fontWeight: '700',
                    marginBottom: '10px'
                  }}>
                    {post.title}
                  </h3>
                  
                  <p style={{ 
                    color: '#94a3b8', 
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    marginBottom: '15px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.content}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#64748b',
                    fontSize: '0.9rem'
                  }}>
                    <span>👤 {post.author} ({post.authorEmail})</span>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1b2a',
            borderRadius: '20px',
            padding: '30px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>
                ✏️ 새 글 작성
              </h2>
              <button
                onClick={() => setShowWriteModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* 카테고리 선택 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>카테고리</label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#ffffff',
                  border: '1px solid #1b263b',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                {categories.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 제목 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>제목</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="제목을 입력하세요"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#ffffff',
                  border: '1px solid #1b263b',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* 내용 */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>내용</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="내용을 입력하세요"
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#ffffff',
                  border: '1px solid #1b263b',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* 버튼 */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowWriteModal(false)}
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #1b263b',
                  padding: '12px 25px',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                onClick={handleSubmitPost}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                게시하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;

