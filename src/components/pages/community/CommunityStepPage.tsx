import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavigationBar from '../../common/NavigationBar';
import AzureTableService from '../../../services/azureTableService';

interface Post {
  PartitionKey: string;
  RowKey: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  category: string;
  createdAt: string;
  likes: number;
  commentCount: number;
  likedBy?: string;
}

interface Comment {
  RowKey: string;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
}

interface StepConfig {
  step: number;
  title: string;
  icon: string;
  courseIds: string[];
  coursePath: string;
}

const stepConfigs: { [key: string]: StepConfig } = {
  step1: {
    step: 1,
    title: 'AI 건물주 되기',
    icon: '🏠',
    courseIds: ['ai-building-course', 'ai-building', '999'],
    coursePath: '/ai-building-course'
  },
  step2: {
    step: 2,
    title: 'AI 에이전트 비기너',
    icon: '🤖',
    courseIds: ['chatgpt-agent-beginner', 'ai-agent-beginner', '1002'],
    coursePath: '/chatgpt-agent-beginner'
  },
  step3: {
    step: 3,
    title: 'connexionai',
    icon: '⚡',
    courseIds: ['connexionai'],
    coursePath: '/ai-construction-site'
  },
  step4: {
    step: 4,
    title: '1인 콘텐츠 기업 만들기',
    icon: '🚀',
    courseIds: ['content-business'],
    coursePath: '/ai-construction-site'
  }
};

// 색상 테마: 네이비 + 골드
const theme = {
  navy: '#0f2744',
  navyLight: '#1e3a5f',
  navyDark: '#091a2e',
  gold: '#fbbf24',
  goldLight: '#fcd34d',
  goldMuted: '#f59e0b',
  white: '#ffffff',
  gray: '#64748b',
  grayLight: '#f1f5f9',
  grayBorder: '#e2e8f0'
};

const CommunityStepPage: React.FC = () => {
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ category: 'question', title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  
  // 게시물 상세 보기
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const config = stepConfigs[stepId || 'step1'] || stepConfigs.step1;
  const isComingSoon = config.step >= 3;

  const categories = [
    { id: 'all', name: '전체', icon: '📋' },
    { id: 'question', name: '질문', icon: '❓' },
    { id: 'intro', name: '자기소개', icon: '👋' },
    { id: 'channel', name: '채널공유', icon: '📺' },
    { id: 'review', name: '수강후기', icon: '⭐' },
    { id: 'tips', name: '꿀팁공유', icon: '💡' }
  ];

  // 게시글 로드
  const loadPosts = useCallback(async () => {
    if (!stepId) return;
    try {
      const fetchedPosts = await AzureTableService.getPostsByCourse(stepId);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
    }
  }, [stepId]);

  // 댓글 로드
  const loadComments = async (postId: string) => {
    setLoadingComments(true);
    try {
      const fetchedComments = await AzureTableService.getCommentsByPost(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('댓글 로드 실패:', error);
    }
    setLoadingComments(false);
  };

  // 게시물 선택
  const handleSelectPost = async (post: Post) => {
    setSelectedPost(post);
    await loadComments(post.RowKey);
  };

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !selectedPost || !userInfo?.email) return;

    try {
      const result = await AzureTableService.createComment({
        postId: selectedPost.RowKey,
        courseId: stepId || 'step1',
        content: newComment,
        authorEmail: userInfo.email,
        authorName: userInfo.name || userInfo.email.split('@')[0]
      });

      if (result.success) {
        setNewComment('');
        await loadComments(selectedPost.RowKey);
        await loadPosts(); // 댓글 수 업데이트
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  // 수강 여부 확인 및 게시글 로드
  useEffect(() => {
    const checkEnrollmentAndLoadPosts = async () => {
      setLoading(true);
      
      const userSession = sessionStorage.getItem('aicitybuilders_user_session');
      if (userSession) {
        try {
          const user = JSON.parse(userSession);
          setIsLoggedIn(true);
          setUserInfo(user);
          
          if (user?.email) {
            try {
              const azureUser = await AzureTableService.getUserByEmail(user.email);
              if (azureUser?.enrolledCourses) {
                let enrolledCoursesData: any = azureUser.enrolledCourses;
                if (typeof enrolledCoursesData === 'string') {
                  enrolledCoursesData = JSON.parse(enrolledCoursesData);
                }
                const enrollments = enrolledCoursesData?.enrollments || [];
                const enrolled = enrollments.some((e: any) => 
                  config.courseIds.includes(e.courseId)
                );
                setIsEnrolled(enrolled);
              }
            } catch (azureError) {
              const enrollments = user?.enrolledCourses?.enrollments || [];
              const enrolled = enrollments.some((e: any) => 
                config.courseIds.includes(e.courseId)
              );
              setIsEnrolled(enrolled);
            }
          }
        } catch (e) {
          console.error('사용자 정보 파싱 오류:', e);
        }
      }
      
      await loadPosts();
      setLoading(false);
    };

    checkEnrollmentAndLoadPosts();
  }, [stepId, config.courseIds, loadPosts]);

  // 게시글 작성
  const handleSubmitPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    if (!userInfo?.email) {
      alert('로그인이 필요합니다.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await AzureTableService.createPost({
        courseId: stepId || 'step1',
        title: newPost.title,
        content: newPost.content,
        authorEmail: userInfo.email,
        authorName: userInfo.name || userInfo.email.split('@')[0],
        category: newPost.category
      });

      if (result.success) {
        setShowWriteModal(false);
        setNewPost({ category: 'question', title: '', content: '' });
        await loadPosts();
        alert('게시글이 작성되었습니다! 🎉');
      } else {
        alert('게시글 작성에 실패했습니다: ' + result.error);
      }
    } catch (error: any) {
      alert('오류가 발생했습니다: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 좋아요
  const handleLike = async (post: Post, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!userInfo?.email) {
      alert('로그인이 필요합니다.');
      return;
    }
    const success = await AzureTableService.likePost(post.PartitionKey, post.RowKey, userInfo.email);
    if (success) {
      await loadPosts();
      if (selectedPost?.RowKey === post.RowKey) {
        const updated = posts.find(p => p.RowKey === post.RowKey);
        if (updated) setSelectedPost(updated);
      }
    }
  };

  // 게시글 삭제
  const handleDeletePost = async (post: Post, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!userInfo?.email || post.authorEmail !== userInfo.email) {
      alert('삭제 권한이 없습니다.');
      return;
    }
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    const success = await AzureTableService.deletePost(post.PartitionKey, post.RowKey, userInfo.email);
    if (success) {
      await loadPosts();
      if (selectedPost?.RowKey === post.RowKey) setSelectedPost(null);
      alert('삭제되었습니다.');
    }
  };

  // 필터링 + 검색 + 정렬
  let filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.content.toLowerCase().includes(query) ||
      p.authorName.toLowerCase().includes(query)
    );
  }

  if (sortBy === 'popular') {
    filteredPosts = [...filteredPosts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  // 시간 포맷
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const isLikedByMe = (post: Post) => {
    if (!userInfo?.email || !post.likedBy) return false;
    try { return JSON.parse(post.likedBy).includes(userInfo.email); } 
    catch { return false; }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: theme.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: `3px solid ${theme.grayBorder}`, borderTop: `3px solid ${theme.gold}`,
            borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px'
          }}></div>
          <p style={{ color: theme.gray }}>로딩 중...</p>
        </div>
      </div>
    );
  }

  // 미수강자
  if (!isEnrolled && !isComingSoon) {
    return (
      <div style={{ minHeight: '100vh', background: theme.white }}>
        <NavigationBar />
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '100px 20px', textAlign: 'center' }}>
          <div style={{
            background: theme.white, borderRadius: '24px', padding: '50px 30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: `2px solid ${theme.grayBorder}`
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
            <h2 style={{ color: theme.navy, marginBottom: '15px' }}>
              {config.icon} {config.title} 수강생 전용
            </h2>
            <p style={{ color: theme.gray, marginBottom: '30px', lineHeight: '1.6' }}>
              강의를 수강하시면 커뮤니티에 참여할 수 있습니다.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {!isLoggedIn && (
                <button onClick={() => navigate('/login')} style={{
                  background: theme.navy, color: theme.white, border: 'none',
                  padding: '14px 28px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer'
                }}>로그인</button>
              )}
              <button onClick={() => navigate(config.coursePath)} style={{
                background: theme.gold, color: theme.navy, border: 'none',
                padding: '14px 28px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer'
              }}>강의 보러가기 →</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.white }}>
      <NavigationBar />
      
      {/* 헤더 */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.navy} 0%, ${theme.navyLight} 100%)`,
        padding: 'clamp(25px, 4vw, 40px) 20px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <span style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>{config.icon}</span>
            <div>
              <h1 style={{ color: theme.gold, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: '700', margin: 0 }}>
                {config.title} 커뮤니티
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', margin: '5px 0 0' }}>
                {posts.length}개의 게시글 · {posts.reduce((s, p) => s + (p.commentCount || 0), 0)}개의 댓글
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* 검색 + 정렬 + 글쓰기 */}
        <div style={{
          background: theme.white, borderRadius: '16px', padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '20px',
          border: `1px solid ${theme.grayBorder}`
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: theme.gray }}>🔍</span>
              <input
                type="text"
                placeholder="게시글 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '12px 12px 12px 42px',
                  border: `2px solid ${theme.grayBorder}`, borderRadius: '12px',
                  fontSize: '0.95rem', outline: 'none', transition: 'border 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = theme.gold}
                onBlur={(e) => e.target.style.borderColor = theme.grayBorder}
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
              style={{
                padding: '12px 16px', border: `2px solid ${theme.grayBorder}`, borderRadius: '12px',
                fontSize: '0.95rem', background: theme.white, cursor: 'pointer', color: theme.navy
              }}
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>

            {isEnrolled && (
              <button onClick={() => setShowWriteModal(true)} style={{
                background: theme.gold, color: theme.navy, border: 'none',
                padding: '12px 24px', borderRadius: '12px', fontWeight: '700',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                ✏️ 글쓰기
              </button>
            )}
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? theme.navy : theme.white,
                color: selectedCategory === cat.id ? theme.gold : theme.navy,
                border: `2px solid ${selectedCategory === cat.id ? theme.navy : theme.grayBorder}`,
                padding: '10px 18px', borderRadius: '25px',
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* 게시글 목록 */}
        {filteredPosts.length === 0 ? (
          <div style={{
            background: theme.white, borderRadius: '16px', padding: '60px 20px',
            textAlign: 'center', border: `2px solid ${theme.grayBorder}`
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📝</div>
            <p style={{ color: theme.gray }}>
              {searchQuery ? '검색 결과가 없습니다.' : '아직 게시글이 없습니다.'}
            </p>
            {isEnrolled && !searchQuery && (
              <button onClick={() => setShowWriteModal(true)} style={{
                marginTop: '20px', background: theme.gold, color: theme.navy,
                border: 'none', padding: '12px 24px', borderRadius: '10px',
                fontWeight: '700', cursor: 'pointer'
              }}>첫 번째 글 작성하기</button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPosts.map(post => {
              const liked = isLikedByMe(post);
              const catInfo = categories.find(c => c.id === post.category);
              const isSelected = selectedPost?.RowKey === post.RowKey;
              
              return (
                <div 
                  key={post.RowKey} 
                  onClick={() => handleSelectPost(post)}
                  style={{
                    background: isSelected ? `${theme.navy}08` : theme.white, 
                    borderRadius: '16px', 
                    padding: 'clamp(16px, 3vw, 24px)',
                    border: `2px solid ${isSelected ? theme.gold : theme.grayBorder}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      background: `${theme.navy}10`, color: theme.navy,
                      padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600'
                    }}>
                      {catInfo?.icon} {catInfo?.name}
                    </span>
                    <span style={{ color: theme.gray, fontSize: '0.85rem' }}>{formatTime(post.createdAt)}</span>
                  </div>

                  <h3 style={{ color: theme.navy, fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: '700', marginBottom: '8px', lineHeight: '1.4' }}>
                    {post.title}
                  </h3>

                  <p style={{
                    color: theme.gray, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {post.content}
                  </p>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: '12px', borderTop: `1px solid ${theme.grayLight}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: theme.navy, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: theme.gold, fontSize: '0.75rem', fontWeight: '700'
                      }}>
                        {post.authorName.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ color: theme.gray, fontSize: '0.9rem' }}>{post.authorName}</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <button onClick={(e) => handleLike(post, e)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: liked ? '#ef4444' : theme.gray, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', gap: '5px', padding: '5px'
                      }}>
                        {liked ? '❤️' : '🤍'} <span style={{ fontWeight: '600' }}>{post.likes || 0}</span>
                      </button>
                      <span style={{ color: theme.gray, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        💬 <span style={{ fontWeight: '600' }}>{post.commentCount || 0}</span>
                      </span>
                      {userInfo?.email === post.authorEmail && (
                        <button onClick={(e) => handleDeletePost(post, e)} style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#cbd5e1', fontSize: '0.85rem', padding: '5px'
                        }}>🗑️</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button onClick={() => navigate('/community')} style={{
            background: theme.white, color: theme.navy, border: `2px solid ${theme.grayBorder}`,
            padding: '12px 30px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600'
          }}>
            ← 커뮤니티 목록
          </button>
        </div>
      </div>

      {/* 게시물 상세 모달 */}
      {selectedPost && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} onClick={() => setSelectedPost(null)}>
          <div style={{
            background: theme.white, borderRadius: '24px', 
            width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            {/* 상세 헤더 */}
            <div style={{
              background: theme.navy, padding: '25px', 
              borderRadius: '24px 24px 0 0', position: 'sticky', top: 0
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{
                    background: theme.gold, color: theme.navy,
                    padding: '4px 12px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: '600'
                  }}>
                    {categories.find(c => c.id === selectedPost.category)?.icon} {categories.find(c => c.id === selectedPost.category)?.name}
                  </span>
                  <h2 style={{ color: theme.white, fontSize: '1.3rem', fontWeight: '700', marginTop: '12px' }}>
                    {selectedPost.title}
                  </h2>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '8px' }}>
                    {selectedPost.authorName} · {formatTime(selectedPost.createdAt)}
                  </div>
                </div>
                <button onClick={() => setSelectedPost(null)} style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none', color: theme.white,
                  width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem'
                }}>✕</button>
              </div>
            </div>

            {/* 본문 */}
            <div style={{ padding: '25px' }}>
              <p style={{ color: theme.navy, fontSize: '1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                {selectedPost.content}
              </p>

              {/* 좋아요 버튼 */}
              <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: `1px solid ${theme.grayBorder}` }}>
                <button onClick={() => handleLike(selectedPost)} style={{
                  background: isLikedByMe(selectedPost) ? '#fee2e2' : theme.grayLight,
                  color: isLikedByMe(selectedPost) ? '#ef4444' : theme.gray,
                  border: 'none', padding: '10px 20px', borderRadius: '25px',
                  cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  {isLikedByMe(selectedPost) ? '❤️' : '🤍'} 좋아요 {selectedPost.likes || 0}
                </button>
              </div>

              {/* 댓글 섹션 */}
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ color: theme.navy, fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>
                  💬 댓글 {selectedPost.commentCount || 0}
                </h3>

                {/* 댓글 입력 */}
                {isEnrolled && (
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="댓글을 입력하세요..."
                      style={{
                        flex: 1, padding: '12px 16px', border: `2px solid ${theme.grayBorder}`,
                        borderRadius: '12px', fontSize: '0.95rem', outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = theme.gold}
                      onBlur={(e) => e.target.style.borderColor = theme.grayBorder}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                    />
                    <button onClick={handleSubmitComment} style={{
                      background: theme.gold, color: theme.navy, border: 'none',
                      padding: '12px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer'
                    }}>등록</button>
                  </div>
                )}

                {/* 댓글 목록 */}
                {loadingComments ? (
                  <p style={{ color: theme.gray, textAlign: 'center' }}>댓글 로딩 중...</p>
                ) : comments.length === 0 ? (
                  <p style={{ color: theme.gray, textAlign: 'center', padding: '20px' }}>
                    아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {comments.map(comment => (
                      <div key={comment.RowKey} style={{
                        background: theme.grayLight, borderRadius: '12px', padding: '15px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: theme.navy, color: theme.gold,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: '700'
                          }}>
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ color: theme.navy, fontWeight: '600', fontSize: '0.9rem' }}>
                            {comment.authorName}
                          </span>
                          <span style={{ color: theme.gray, fontSize: '0.8rem' }}>
                            {formatTime(comment.createdAt)}
                          </span>
                        </div>
                        <p style={{ color: theme.navy, fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: theme.white, borderRadius: '24px', padding: 'clamp(20px, 4vw, 35px)',
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ color: theme.navy, fontSize: '1.3rem', margin: 0 }}>✏️ 새 글 작성</h2>
              <button onClick={() => setShowWriteModal(false)} style={{
                background: theme.grayLight, border: 'none', width: '36px', height: '36px',
                borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', color: theme.gray
              }}>✕</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: theme.navy, fontWeight: '600', display: 'block', marginBottom: '10px' }}>카테고리</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <button key={cat.id} onClick={() => setNewPost({ ...newPost, category: cat.id })} style={{
                    background: newPost.category === cat.id ? theme.navy : theme.grayLight,
                    color: newPost.category === cat.id ? theme.gold : theme.navy,
                    border: 'none', padding: '8px 16px', borderRadius: '20px',
                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600'
                  }}>{cat.icon} {cat.name}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: theme.navy, fontWeight: '600', display: 'block', marginBottom: '10px' }}>제목</label>
              <input type="text" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="제목을 입력하세요" style={{
                  width: '100%', padding: '14px', border: `2px solid ${theme.grayBorder}`, borderRadius: '12px',
                  fontSize: '1rem', outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = theme.gold}
                onBlur={(e) => e.target.style.borderColor = theme.grayBorder}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ color: theme.navy, fontWeight: '600', display: 'block', marginBottom: '10px' }}>내용</label>
              <textarea value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="내용을 입력하세요" rows={8} style={{
                  width: '100%', padding: '14px', border: `2px solid ${theme.grayBorder}`, borderRadius: '12px',
                  fontSize: '1rem', outline: 'none', resize: 'vertical', lineHeight: '1.6'
                }}
                onFocus={(e) => e.target.style.borderColor = theme.gold}
                onBlur={(e) => e.target.style.borderColor = theme.grayBorder}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowWriteModal(false)} style={{
                background: theme.grayLight, color: theme.gray, border: 'none',
                padding: '14px 28px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer'
              }}>취소</button>
              <button onClick={handleSubmitPost} disabled={submitting} style={{
                background: submitting ? theme.gray : theme.gold, color: theme.navy, border: 'none',
                padding: '14px 28px', borderRadius: '12px', fontWeight: '700',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}>{submitting ? '작성 중...' : '작성하기'}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default CommunityStepPage;
