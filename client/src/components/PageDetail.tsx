import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, Clock, Users, Eye } from 'lucide-react';
import { mockPosts, MockPost } from '../data/mockPosts';
import { mockComments, MockComment } from '../data/mockComments';
import { showSuccessToast } from '../utils/toast';

interface PageDetailProps {
  pageId: string;
  pageName: string;
  pageAvatar: string;
  pageCategory: string;
  pageDescription: string;
  pageFollowers: number;
  onBack: () => void;
}

const PageDetail: React.FC<PageDetailProps> = ({
  pageId,
  pageName,
  pageAvatar,
  pageCategory,
  pageDescription,
  pageFollowers,
  onBack
}) => {
  const [posts, setPosts] = useState<MockPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  useEffect(() => {
    // Filter posts for this specific page
    const pagePosts = mockPosts.filter(post => post.pageId === pageId);
    setPosts(pagePosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    
    // Load liked posts from localStorage
    const saved = localStorage.getItem('likedPosts');
    if (saved) {
      setLikedPosts(JSON.parse(saved));
    }
  }, [pageId]);

  const handleLike = (postId: string) => {
    const newLikedPosts = likedPosts.includes(postId)
      ? likedPosts.filter(id => id !== postId)
      : [...likedPosts, postId];
    
    setLikedPosts(newLikedPosts);
    localStorage.setItem('likedPosts', JSON.stringify(newLikedPosts));
    
    const action = likedPosts.includes(postId) ? 'Đã bỏ thích' : 'Đã thích';
    showSuccessToast(action);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    return postTime.toLocaleDateString('vi-VN');
  };

  const getPostComments = (postId: string): MockComment[] => {
    return mockComments.filter(comment => comment.postId === postId);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-4 flex-1">
              <div className="text-4xl bg-gray-100 rounded-xl p-3 shadow-lg">
                {pageAvatar}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{pageName}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {pageCategory}
                  </span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{formatNumber(pageFollowers)} người theo dõi</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-1">{pageDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có bài viết nào</h3>
            <p className="text-gray-500">Trang này chưa đăng bài viết nào.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const postComments = getPostComments(post.id);
              const isLiked = likedPosts.includes(post.id);
              const showComments = expandedComments.includes(post.id);
              
              return (
                <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{pageAvatar}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{pageName}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{getRelativeTime(post.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-6 pb-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="px-6 pb-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="px-6 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>{post.likes + (isLiked ? 1 : 0)} lượt thích</span>
                        <span>{post.comments} bình luận</span>
                        <span>{post.shares} chia sẻ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{Math.floor(Math.random() * 1000) + 500} lượt xem</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-6 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-around">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          isLiked
                            ? 'text-red-600 bg-red-50 hover:bg-red-100'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span>Thích</span>
                      </button>
                      
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Bình luận</span>
                      </button>
                      
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>Chia sẻ</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {showComments && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-4">Bình luận ({postComments.length})</h4>
                      
                      {postComments.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Chưa có bình luận nào</p>
                      ) : (
                        <div className="space-y-4">
                          {postComments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <div className="text-lg">{comment.user.avatar}</div>
                              <div className="flex-1">
                                <div className="bg-white rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-gray-900">
                                      {comment.user.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {comment.user.position}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span>{getRelativeTime(comment.timestamp)}</span>
                                  <button className="hover:text-gray-700">Thích ({comment.likes})</button>
                                  <button className="hover:text-gray-700">Trả lời</button>
                                </div>
                                
                                {/* Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                  <div className="ml-4 mt-3 space-y-3">
                                    {comment.replies.map((reply) => (
                                      <div key={reply.id} className="flex gap-3">
                                        <div className="text-sm">{reply.user.avatar}</div>
                                        <div className="flex-1">
                                          <div className="bg-gray-100 rounded-lg p-2">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="font-semibold text-xs text-gray-900">
                                                {reply.user.name}
                                              </span>
                                            </div>
                                            <p className="text-gray-700 text-xs">{reply.content}</p>
                                          </div>
                                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                            <span>{getRelativeTime(reply.timestamp)}</span>
                                            <button className="hover:text-gray-700">Thích ({reply.likes})</button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageDetail; 