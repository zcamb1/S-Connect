import { useState } from 'react';
import { ImageIcon, Send, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Textarea } from '../../ui/textarea';
import { cn } from '../../../lib/utils';

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

interface CreatePostProps {
  user: User;
  onCreatePost: (content: string) => void;
}

export function CreatePost({ user, onCreatePost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onCreatePost(content);
      setContent('');
      setIsFocused(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="mb-6 border-none shadow-lg shadow-slate-200/50 backdrop-blur-sm bg-white/90 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar 
            className={cn(
              "h-12 w-12 transition-all duration-300",
              isFocused 
                ? "border-4 border-white ring-4 ring-violet-100 shadow-lg shadow-violet-500/10" 
                : "border-2 border-white ring-2 ring-slate-100"
            )}
          >
            <AvatarImage src={user.avatar} alt={user.full_name} />
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div 
              className={cn(
                "rounded-2xl border bg-slate-50 transition-all duration-300",
                isFocused 
                  ? "ring-4 ring-violet-100 shadow-lg shadow-violet-500/10 border-violet-200"
                  : "border-slate-200 shadow-sm hover:border-slate-300"
              )}
            >
              <Textarea
                placeholder={`${user.full_name} ơi, bạn đang nghĩ gì thế?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="min-h-[60px] resize-none border-0 bg-transparent focus-visible:ring-0 text-slate-700 placeholder:text-slate-400 rounded-2xl"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Ảnh/Video
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl"
                >
                  <Smile className="h-4 w-4 mr-2" />
                  Cảm xúc
                </Button>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className={cn(
                  "rounded-xl transition-all duration-300",
                  content.trim()
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200"
                )}
              >
                <Send className="h-4 w-4 mr-2" />
                Đăng bài
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 