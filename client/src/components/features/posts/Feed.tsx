import React, { useState } from 'react';

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

interface Post {
  id: number;
  user_id: number;
  content: string;
  image_url?: string;
  created_at: string;
  username: string;
  full_name: string;
  avatar?: string;
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
}

interface FeedProps {
  posts: Post[];
  user: User;
  loading: boolean;
  onLike: (postId: number) => void;
  onCreatePost: (content: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, user, loading, onLike, onCreatePost }) => {
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setIsPosting(true);
    try {
      await onCreatePost(postContent);
      setPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Post Composer */}
      <div className="card">
        <form onSubmit={handleSubmitPost}>
          <div className="flex space-x-4">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.full_name} className="w-10 h-10 rounded-full" />
              ) : (
                <span className="text-white font-medium">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Bạn đang nghĩ gì?"
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition duration-150"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Ảnh/Video</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition duration-150"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 9a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm">Cảm xúc</span>
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!postContent.trim() || isPosting}
                  className={`btn-primary px-6 ${
                    !postContent.trim() || isPosting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isPosting ? 'Đang đăng...' : 'Đăng'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="card">
              {/* Post Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  {post.avatar ? (
                    <img src={post.avatar} alt={post.full_name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <span className="text-white font-medium">
                      {post.full_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{post.full_name}</h3>
                  <p className="text-sm text-gray-500">{formatTime(post.created_at)}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
                {post.image_url && (
                  <div className="mt-3">
                    <img
                      src={post.image_url}
                      alt="Post content"
                      className="w-full rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Post Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <span>{post.likes_count} lượt thích</span>
                  <span>{post.comments_count} bình luận</span>
                </div>
                <span>2 lượt chia sẻ</span>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onLike(post.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-150 ${
                    post.user_liked
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <svg className="h-5 w-5" fill={post.user_liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Thích</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition duration-150">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Bình luận</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition duration-150">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Chia sẻ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết nào</h3>
          <p className="text-gray-500">Hãy tạo bài viết đầu tiên của bạn!</p>
        </div>
      )}
    </div>
  );
};

export default Feed; 