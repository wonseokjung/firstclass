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
  step1: { step: 1, title: 'AI 건물주 되기', icon: '🏠', courseIds: ['ai-building-course', 'ai-building', '999'], coursePath: '/ai-building-course' },
  step2: { step: 2, title: 'AI 에이전트 비기너', icon: '🤖', courseIds: ['chatgpt-agent-beginner', 'ai-agent-beginner', '1002'], coursePath: '/chatgpt-agent-beginner' },
  step3: { step: 3, title: 'connexionai', icon: '⚡', courseIds: ['connexionai'], coursePath: '/ai-construction-site' },
  step4: { step: 4, title: '1인 콘텐츠 기업 만들기', icon: '🚀', courseIds: ['content-business'], coursePath: '/ai-construction-site' }
};

// 색상 테마
const theme = {
  navy: '#0f2744',
  navyLight: '#1e3a5f',
  gold: '#fbbf24',
  white: '#ffffff',
  gray: '#64748b',
  grayLight: '#f1f5f9',
  grayBorder: '#e2e8f0'
};

// YouTube URL에서 video ID 추출
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// URL을 링크로 변환 + YouTube 임베딩
const renderContent = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      const youtubeId = extractYouTubeId(part);
      if (youtubeId) {
        return (
          <div key={index} style={{ margin: '12px 0' }}>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#000'
            }}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video"
              />
            </div>
          </div>
        );
      }
      // 일반 링크
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme.gold, wordBreak: 'break-all' }}
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const CommunityStepPage: React.FC = () => {
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 스레드 상세
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const config = stepConfigs[stepId || 'step1'] || stepConfigs.step1;
  const isComingSoon = config.step >= 3;

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

  // 스레드 선택
  const handleSelectPost = async (post: Post) => {
    setSelectedPost(post);
    await loadComments(post.RowKey);
  };

  // 수강 여부 확인
  useEffect(() => {
    const checkEnrollment = async () => {
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
                let data: any = azureUser.enrolledCourses;
                if (typeof data === 'string') data = JSON.parse(data);
                const enrollments = data?.enrollments || [];
                setIsEnrolled(enrollments.some((e: any) => config.courseIds.includes(e.courseId)));
              }
            } catch {
              const enrollments = user?.enrolledCourses?.enrollments || [];
              setIsEnrolled(enrollments.some((e: any) => config.courseIds.includes(e.courseId)));
            }
          }
        } catch (e) { console.error(e); }
      }
      await loadPosts();
      setLoading(false);
    };
    checkEnrollment();
  }, [stepId, config.courseIds, loadPosts]);

  // 새 글 작성 (스레드 스타일)
  const handleSubmitPost = async () => {
    if (!newPostContent.trim() || !userInfo?.email) return;
    setSubmitting(true);
    try {
      const result = await AzureTableService.createPost({
        courseId: stepId || 'step1',
        title: newPostContent.slice(0, 50),
        content: newPostContent,
        authorEmail: userInfo.email,
        authorName: userInfo.name || userInfo.email.split('@')[0],
        category: 'general'
      });
      if (result.success) {
        setNewPostContent('');
        await loadPosts();
      }
    } catch (error) { console.error(error); }
    setSubmitting(false);
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
        await loadPosts();
      }
    } catch (error) { console.error(error); }
  };

  // 좋아요
  const handleLike = async (post: Post, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!userInfo?.email) return;
    await AzureTableService.likePost(post.PartitionKey, post.RowKey, userInfo.email);
    await loadPosts();
  };

  // 삭제
  const handleDelete = async (post: Post, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!userInfo?.email || post.authorEmail !== userInfo.email) return;
    if (!window.confirm('삭제하시겠습니까?')) return;
    await AzureTableService.deletePost(post.PartitionKey, post.RowKey, userInfo.email);
    await loadPosts();
    if (selectedPost?.RowKey === post.RowKey) setSelectedPost(null);
  };

  // 시간 포맷
  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return '방금';
    if (mins < 60) return `${mins}분`;
    if (hours < 24) return `${hours}시간`;
    if (days < 7) return `${days}일`;
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const isLikedByMe = (post: Post) => {
    if (!userInfo?.email || !post.likedBy) return false;
    try { return JSON.parse(post.likedBy).includes(userInfo.email); } catch { return false; }
  };

  // 검색 필터링 (내용만)
  const filteredPosts = searchQuery.trim()
    ? posts.filter(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: theme.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '30px', height: '30px', border: `3px solid ${theme.grayBorder}`, borderTop: `3px solid ${theme.gold}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  // 미수강자
  if (!isEnrolled && !isComingSoon) {
    return (
      <div style={{ minHeight: '100vh', background: theme.white }}>
        <NavigationBar />
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '100px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ color: theme.navy, marginBottom: '15px' }}>{config.icon} {config.title} 수강생 전용</h2>
          <p style={{ color: theme.gray, marginBottom: '30px' }}>강의를 수강하시면 커뮤니티에 참여할 수 있습니다.</p>
          <button onClick={() => navigate('/')} style={{
            background: theme.gold, color: theme.navy, border: 'none',
            padding: '14px 28px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer'
          }}>프리미엄 강의 보러가기 →</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.grayLight }}>
      <NavigationBar />
      
      {/* 헤더 */}
      <div style={{ background: theme.navy, padding: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>{config.icon}</span>
          <h1 style={{ color: theme.gold, fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>{config.title}</h1>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        
        {/* 검색바 */}
        <div style={{
          background: theme.white, borderRadius: '25px', padding: '10px 16px',
          marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <span style={{ color: theme.gray }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="스레드 검색..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: '0.95rem', color: theme.navy, background: 'transparent'
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{
              background: 'none', border: 'none', color: theme.gray, cursor: 'pointer', fontSize: '1rem'
            }}>✕</button>
          )}
        </div>
        
        {/* 새 글 작성 (스레드 스타일) */}
        {isEnrolled && (
          <div style={{
            background: theme.white, borderRadius: '16px', padding: '16px',
            marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: theme.navy, color: theme.gold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '1rem', flexShrink: 0
              }}>
                {(userInfo?.name || userInfo?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="무슨 생각을 하고 계세요? YouTube 링크를 붙여넣으면 자동으로 영상이 표시됩니다!"
                  style={{
                    width: '100%', border: 'none', outline: 'none', resize: 'none',
                    fontSize: '1rem', lineHeight: '1.5', minHeight: '60px',
                    fontFamily: 'inherit', color: theme.navy
                  }}
                  rows={3}
                />
                {newPostContent && (
                  <div style={{ borderTop: `1px solid ${theme.grayBorder}`, paddingTop: '12px', marginTop: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: theme.gray, marginBottom: '8px' }}>미리보기:</div>
                    <div style={{ fontSize: '0.95rem', color: theme.navy }}>{renderContent(newPostContent)}</div>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    onClick={handleSubmitPost}
                    disabled={!newPostContent.trim() || submitting}
                    style={{
                      background: newPostContent.trim() ? theme.gold : theme.grayBorder,
                      color: newPostContent.trim() ? theme.navy : theme.gray,
                      border: 'none', padding: '10px 20px', borderRadius: '20px',
                      fontWeight: '700', cursor: newPostContent.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {submitting ? '게시 중...' : '게시하기'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 스레드 목록 */}
        {filteredPosts.length === 0 ? (
          <div style={{ background: theme.white, borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{searchQuery ? '🔍' : '💬'}</div>
            <p style={{ color: theme.gray }}>
              {searchQuery ? `"${searchQuery}" 검색 결과가 없습니다` : '아직 글이 없습니다. 첫 번째 글을 작성해보세요!'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {filteredPosts.map((post, index) => {
              const liked = isLikedByMe(post);
              const isFirst = index === 0;
              const isLast = index === filteredPosts.length - 1;
              
              return (
                <div
                  key={post.RowKey}
                  onClick={() => handleSelectPost(post)}
                  style={{
                    background: theme.white,
                    padding: '16px',
                    cursor: 'pointer',
                    borderRadius: isFirst && isLast ? '16px' : isFirst ? '16px 16px 0 0' : isLast ? '0 0 16px 16px' : '0',
                    borderBottom: !isLast ? `1px solid ${theme.grayBorder}` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {/* 프로필 + 연결선 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: theme.navy, color: theme.gold,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', fontSize: '0.9rem', flexShrink: 0
                      }}>
                        {post.authorName.charAt(0).toUpperCase()}
                      </div>
                      {(post.commentCount || 0) > 0 && (
                        <div style={{ width: '2px', flex: 1, background: theme.grayBorder, marginTop: '8px', minHeight: '20px' }}></div>
                      )}
                    </div>

                    {/* 콘텐츠 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* 작성자 + 시간 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', color: theme.navy }}>{post.authorName}</span>
                        <span style={{ color: theme.gray, fontSize: '0.85rem' }}>· {formatTime(post.createdAt)}</span>
                      </div>

                      {/* 본문 */}
                      <div style={{ color: theme.navy, fontSize: '0.95rem', lineHeight: '1.5', wordBreak: 'break-word' }}>
                        {renderContent(post.content)}
                      </div>

                      {/* 액션 버튼 */}
                      <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                        <button
                          onClick={(e) => handleLike(post, e)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            color: liked ? '#ef4444' : theme.gray, fontSize: '0.9rem'
                          }}
                        >
                          {liked ? '❤️' : '🤍'} {post.likes || 0}
                        </button>
                        <span style={{ color: theme.gray, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          💬 {post.commentCount || 0}
                        </span>
                        {userInfo?.email === post.authorEmail && (
                          <button
                            onClick={(e) => handleDelete(post, e)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.gray, fontSize: '0.85rem' }}
                          >
                            🗑️
                          </button>
                        )}
                      </div>

                      {/* 답글 미리보기 */}
                      {(post.commentCount || 0) > 0 && (
                        <div style={{
                          marginTop: '12px', paddingTop: '12px',
                          borderTop: `1px solid ${theme.grayBorder}`,
                          color: theme.gray, fontSize: '0.85rem'
                        }}>
                          💬 {post.commentCount}개의 답글 보기
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 돌아가기 */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button onClick={() => navigate('/community')} style={{
            background: 'transparent', color: theme.gray, border: `1px solid ${theme.grayBorder}`,
            padding: '10px 24px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem'
          }}>
            ← 커뮤니티 목록
          </button>
        </div>
      </div>

      {/* 스레드 상세 모달 */}
      {selectedPost && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          padding: '20px', overflowY: 'auto'
        }} onClick={() => setSelectedPost(null)}>
          <div style={{
            background: theme.white, borderRadius: '20px', width: '100%', maxWidth: '600px',
            marginTop: '20px', marginBottom: '20px'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* 상단 바 */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px', borderBottom: `1px solid ${theme.grayBorder}`
            }}>
              <span style={{ fontWeight: '700', color: theme.navy }}>스레드</span>
              <button onClick={() => setSelectedPost(null)} style={{
                background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: theme.gray
              }}>✕</button>
            </div>

            {/* 원글 */}
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: theme.navy, color: theme.gold,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', flexShrink: 0
                }}>
                  {selectedPost.authorName.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', color: theme.navy }}>{selectedPost.authorName}</span>
                    <span style={{ color: theme.gray, fontSize: '0.85rem' }}>· {formatTime(selectedPost.createdAt)}</span>
                  </div>
                  <div style={{ color: theme.navy, fontSize: '1rem', lineHeight: '1.6', marginTop: '8px' }}>
                    {renderContent(selectedPost.content)}
                  </div>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${theme.grayBorder}` }}>
                    <button onClick={() => handleLike(selectedPost)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: isLikedByMe(selectedPost) ? '#ef4444' : theme.gray,
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      {isLikedByMe(selectedPost) ? '❤️' : '🤍'} {selectedPost.likes || 0}
                    </button>
                    <span style={{ color: theme.gray, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      💬 {selectedPost.commentCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 답글 입력 */}
            {isEnrolled && (
              <div style={{ padding: '16px', borderTop: `1px solid ${theme.grayBorder}` }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: theme.navy, color: theme.gold,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '0.85rem', flexShrink: 0
                  }}>
                    {(userInfo?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="답글 달기..."
                      style={{
                        flex: 1, border: `1px solid ${theme.grayBorder}`, borderRadius: '20px',
                        padding: '10px 16px', fontSize: '0.95rem', outline: 'none'
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                    />
                    <button onClick={handleSubmitComment} disabled={!newComment.trim()} style={{
                      background: newComment.trim() ? theme.gold : theme.grayBorder,
                      color: newComment.trim() ? theme.navy : theme.gray,
                      border: 'none', padding: '10px 16px', borderRadius: '20px',
                      fontWeight: '600', cursor: newComment.trim() ? 'pointer' : 'not-allowed'
                    }}>
                      답글
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 답글 목록 */}
            <div style={{ borderTop: `1px solid ${theme.grayBorder}` }}>
              {loadingComments ? (
                <div style={{ padding: '30px', textAlign: 'center', color: theme.gray }}>로딩 중...</div>
              ) : comments.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: theme.gray }}>
                  아직 답글이 없습니다
                </div>
              ) : (
                comments.map((comment, idx) => (
                  <div key={comment.RowKey} style={{
                    padding: '16px',
                    borderBottom: idx < comments.length - 1 ? `1px solid ${theme.grayBorder}` : 'none'
                  }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: theme.navyLight, color: theme.gold,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', fontSize: '0.8rem', flexShrink: 0
                      }}>
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '600', color: theme.navy, fontSize: '0.9rem' }}>{comment.authorName}</span>
                          <span style={{ color: theme.gray, fontSize: '0.8rem' }}>· {formatTime(comment.createdAt)}</span>
                        </div>
                        <div style={{ color: theme.navy, fontSize: '0.95rem', lineHeight: '1.5', marginTop: '4px' }}>
                          {renderContent(comment.content)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        textarea::placeholder { color: #94a3b8; }
        input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default CommunityStepPage;
