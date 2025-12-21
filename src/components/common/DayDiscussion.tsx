import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Send, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AzureTableService from '../../services/azureTableService';

interface DiscussionPost {
  id: string;
  author: string;
  authorEmail?: string;
  content: string;
  title?: string;
  createdAt: string;
  likes: number;
  likedBy?: string[];
  isLiked?: boolean;
}

interface DayDiscussionProps {
  courseId: string;           // 예: 'ai-building-day1', 'step2'
  dayNumber: number;          // Day 번호
  communityPath?: string;     // 커뮤니티 링크 (예: '/community/step2')
  accentColor?: string;       // 강조 색상
  userEmail?: string;
  userName?: string;
}

const DayDiscussion: React.FC<DayDiscussionProps> = ({
  courseId,
  dayNumber,
  communityPath = '/community',
  accentColor = '#22c55e',
  userEmail = '',
  userName = ''
}) => {
  const navigate = useNavigate();
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');

  // 게시글 로드
  const loadPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const posts = await AzureTableService.getPostsByCourse(courseId);
      
      const formattedPosts: DiscussionPost[] = posts.map((p: any) => {
        const likedByArray = p.likedBy ? JSON.parse(p.likedBy) : [];
        return {
          id: p.RowKey,
          author: p.authorName || '익명',
          authorEmail: p.authorEmail,
          content: p.content,
          title: p.title,
          createdAt: p.createdAt,
          likes: p.likes || 0,
          likedBy: likedByArray,
          isLiked: userEmail ? likedByArray.includes(userEmail) : false
        };
      });
      
      setDiscussionPosts(formattedPosts);
    } catch (error) {
      console.error('❌ 게시글 로드 실패:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [courseId, userEmail]);

  // 댓글 추가
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const result = await AzureTableService.createPost({
        courseId: courseId,
        title: newComment.substring(0, 50),
        content: newComment,
        authorEmail: userEmail,
        authorName: userName || '익명',
        category: 'share'
      });

      if (result.success) {
        setNewComment('');
        await loadPosts();
      } else {
        alert('댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 댓글 작성 실패:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 좋아요 토글
  const handleLike = async (postId: string) => {
    if (!userEmail) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const success = await AzureTableService.likePost(courseId, postId, userEmail);
      
      if (success) {
        setDiscussionPosts(posts => 
          posts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  likes: post.isLiked ? post.likes - 1 : post.likes + 1, 
                  isLiked: !post.isLiked 
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('❌ 좋아요 처리 실패:', error);
    }
  };

  // 시간 포맷
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      borderRadius: '24px',
      padding: 'clamp(25px, 5vw, 35px)',
      marginBottom: '40px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <h3 style={{ 
          color: accentColor, 
          fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', 
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          margin: 0
        }}>
          <MessageCircle size={26} /> Day {dayNumber} 토론방
        </h3>
        <button
          onClick={() => navigate(communityPath)}
          style={{
            background: `${accentColor}20`,
            border: `1px solid ${accentColor}60`,
            color: accentColor,
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          전체 커뮤니티 →
        </button>
      </div>

      {/* 댓글 입력 */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '16px',
        padding: 'clamp(15px, 3vw, 20px)',
        marginBottom: '20px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <User size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="이 강의에 대한 생각이나 질문을 남겨보세요..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                padding: '12px 15px',
                color: 'white',
                fontSize: '0.95rem',
                resize: 'none',
                minHeight: '60px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
                style={{
                  background: newComment.trim() && !isSubmitting
                    ? `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` 
                    : 'rgba(100,100,100,0.3)',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: newComment.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Send size={16} /> {isSubmitting ? '작성 중...' : '댓글 작성'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {isLoadingPosts ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#64748b'
          }}>
            ⏳ 토론 내용을 불러오는 중...
          </div>
        ) : discussionPosts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#64748b',
            background: 'rgba(15, 23, 42, 0.3)',
            borderRadius: '16px'
          }}>
            💬 아직 토론이 없습니다. 첫 번째 댓글을 남겨보세요!
          </div>
        ) : discussionPosts.slice(0, 5).map((post) => (
          <div key={post.id} style={{
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '16px',
            padding: 'clamp(15px, 3vw, 20px)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'white'
              }}>
                {post.author.charAt(0)}
              </div>
              <div>
                <div style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.95rem' }}>
                  {post.author}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  {formatTime(post.createdAt)}
                </div>
              </div>
            </div>
            <p style={{ 
              color: '#e2e8f0', 
              fontSize: '0.95rem', 
              lineHeight: '1.7',
              margin: '0 0 12px 0'
            }}>
              {post.content}
            </p>
            <button
              onClick={() => handleLike(post.id)}
              style={{
                background: post.isLiked ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                border: post.isLiked ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: post.isLiked ? '#ef4444' : '#94a3b8',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Heart size={14} fill={post.isLiked ? '#ef4444' : 'none'} /> {post.likes}
            </button>
          </div>
        ))}
      </div>

      {/* 더보기 */}
      {discussionPosts.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => navigate(communityPath)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#94a3b8',
              padding: '12px 30px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            💬 더 많은 토론 보기 ({discussionPosts.length - 5}개 더)
          </button>
        </div>
      )}
    </div>
  );
};

export default DayDiscussion;

