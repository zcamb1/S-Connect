import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';
import { postsData, Post } from '../../../data/posts';
import { suggestionsData } from '../../../data/suggestions';

interface PageViewProps {
  pageId: string;
  onBack: () => void;
}

export function PageView({ pageId, onBack }: PageViewProps) {
  const pageInfo = suggestionsData.find(s => s.id === pageId);
  const pagePosts = postsData.filter(p => p.pageId === pageId);

  if (!pageInfo) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Không tìm thấy trang này</p>
        <Button onClick={onBack} className="mt-4">
          Quay lại
        </Button>
      </div>
    );
  }

  const getBgColor = (color: string) => {
    switch (color) {
      case "emerald":
        return "from-emerald-500 to-teal-600"
      case "purple":
        return "from-purple-500 to-indigo-600"
      case "amber":
        return "from-amber-500 to-orange-600"
      default:
        return "from-violet-500 to-indigo-600"
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt={pageInfo.name} />
              <AvatarFallback className={`bg-gradient-to-br ${getBgColor(pageInfo.avatarColor)} text-white text-lg`}>
                {pageInfo.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{pageInfo.name}</h1>
              <p className="text-slate-600">{pageInfo.description}</p>
              <p className="text-sm text-slate-500 mt-1">
                {pageInfo.followers} {pageInfo.type === 'page' ? 'người theo dõi' : 'thành viên'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Bài viết gần đây</h2>
        
        {pagePosts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">Chưa có bài viết nào</p>
          </Card>
        ) : (
          pagePosts.map(post => (
            <PostCard key={post.id} post={post} pageInfo={pageInfo} />
          ))
        )}
      </div>
    </div>
  );
}

interface PostCardProps {
  post: Post;
  pageInfo: any;
}

function PostCard({ post, pageInfo }: PostCardProps) {
  const getBgColor = (color: string) => {
    switch (color) {
      case "emerald":
        return "from-emerald-500 to-teal-600"
      case "purple":
        return "from-purple-500 to-indigo-600"
      case "amber":
        return "from-amber-500 to-orange-600"
      default:
        return "from-violet-500 to-indigo-600"
    }
  };

  return (
    <Card className="p-6">
      <div className="flex gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={pageInfo.name} />
          <AvatarFallback className={`bg-gradient-to-br ${getBgColor(pageInfo.avatarColor)} text-white text-sm`}>
            {pageInfo.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-slate-900">{pageInfo.name}</h3>
          <p className="text-xs text-slate-500">{post.timestamp}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-slate-900 mb-2">{post.title}</h4>
        <p className="text-slate-700 leading-relaxed">{post.content}</p>
      </div>

      {post.image && (
        <div className="mb-4">
          <img 
            src={post.image} 
            alt="Post attachment" 
            className="w-full rounded-lg max-h-96 object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
        <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors">
          <Heart className="h-4 w-4" />
          <span className="text-sm">{post.likes}</span>
        </button>
        <button className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors">
          <Share2 className="h-4 w-4" />
          <span className="text-sm">{post.shares}</span>
        </button>
      </div>
    </Card>
  );
} 