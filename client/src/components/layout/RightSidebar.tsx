import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { TrendingUp, Users, Bell } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { suggestionsData, SuggestionItem } from '../../data/suggestions';
import { trendingData, TrendingItem } from '../../data/trending';

interface SuggestionCardProps extends SuggestionItem {
  onHide: (id: string) => void;
  isFollowed: boolean;
  onToggleFollow: (id: string) => void;
  onNameClick: (id: string) => void;
}

interface TrendingCardProps extends TrendingItem {
  onClick?: () => void;
}



interface RightSidebarProps {
  onPageClick?: (pageId: string) => void;
}

function RightSidebar({ onPageClick }: RightSidebarProps = {}) {
  const { followedPages, joinedGroups, followPage, unfollowPage, joinGroup, leaveGroup } = useAppContext();
  const [hiddenSuggestions, setHiddenSuggestions] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('hiddenSuggestions');
    return new Set(saved ? JSON.parse(saved) : []);
  });

  const handleHideSuggestion = (id: string) => {
    const newHidden = new Set([...Array.from(hiddenSuggestions), id]);
    setHiddenSuggestions(newHidden);
    localStorage.setItem('hiddenSuggestions', JSON.stringify(Array.from(newHidden)));
  };

  const handleToggleFollow = (id: string) => {
    const suggestion = suggestionsData.find(s => s.id === id);
    if (!suggestion) return;

    if (suggestion.type === 'page') {
      if (followedPages.has(id)) {
        unfollowPage(id);
      } else {
        followPage(id);
      }
    } else if (suggestion.type === 'group') {
      if (joinedGroups.has(id)) {
        leaveGroup(id);
      } else {
        joinGroup(id);
      }
    }
  };

  const handleNameClick = (id: string) => {
    console.log(`Clicked on ${id} - Navigate to page/group`);
    if (onPageClick) {
      onPageClick(id);
    }
  };

  const isFollowed = (id: string, type: 'page' | 'group' | 'user') => {
    if (type === 'page') return followedPages.has(id);
    if (type === 'group') return joinedGroups.has(id);
    return false;
  };

  const suggestions = suggestionsData.filter(item => !hiddenSuggestions.has(item.id));

  return (
    <aside className="hidden lg:block w-80 h-[calc(100vh-70px)] sticky top-[70px] backdrop-blur-xl bg-white/80 border-l border-slate-200/50">
      <div className="p-5">
        <div className="mb-4">
          <h3 className="font-medium text-slate-800 flex items-center gap-2">
            <Bell className="h-4 w-4 text-violet-500" />
            <span>Gợi ý cho bạn</span>
          </h3>
        </div>

        <div className="space-y-3">
          {suggestions.map(suggestion => (
            <SuggestionCard 
              key={suggestion.id}
              id={suggestion.id}
              name={suggestion.name}
              avatar={suggestion.avatar}
              avatarColor={suggestion.avatarColor}
              followers={suggestion.followers}
              type={suggestion.type}
              onHide={handleHideSuggestion}
              isFollowed={isFollowed(suggestion.id, suggestion.type)}
              onToggleFollow={handleToggleFollow}
              onNameClick={handleNameClick}
            />
          ))}
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 border-t border-slate-200/50">
        <div className="mb-4">
          <h3 className="font-medium text-slate-800 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-violet-500" />
            <span>Xu hướng</span>
          </h3>
        </div>

        <div className="space-y-3">
          {trendingData.map(trending => (
            <TrendingCard 
              key={trending.id}
              id={trending.id}
              tag={trending.tag}
              category={trending.category}
              count={trending.count}
              growth={trending.growth}
              onClick={() => console.log(`Clicked ${trending.tag}`)}
            />
          ))}
        </div>
      </div>


    </aside>
  )
}

function SuggestionCard({ id, name, avatar, avatarColor, followers, type, onHide, isFollowed, onToggleFollow, onNameClick }: SuggestionCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "page":
        return "người theo dõi"
      case "group":
        return "thành viên"
      case "user":
        return "người theo dõi"
      default:
        return "người theo dõi"
    }
  }

  const getTypeAction = (type: string) => {
    switch (type) {
      case "page":
      case "user":
        return "Theo dõi"
      case "group":
        return "Tham gia"
      default:
        return "Theo dõi"
    }
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
  }

  const getRingColor = (color: string) => {
    switch (color) {
      case "emerald":
        return "ring-emerald-100 shadow-emerald-500/10"
      case "purple":
        return "ring-purple-100 shadow-purple-500/10"
      case "amber":
        return "ring-amber-100 shadow-amber-500/10"
      default:
        return "ring-violet-100 shadow-violet-500/10"
    }
  }

  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start gap-3 p-3">
        <Avatar className={`h-12 w-12 border-2 border-white ring-2 ${getRingColor(avatarColor)}`}>
          <AvatarImage src="/placeholder.svg?height=48&width=48" alt={name} />
          <AvatarFallback className={`bg-gradient-to-br ${getBgColor(avatarColor)} text-white`}>
            {avatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span 
              className="font-medium text-slate-900 text-sm cursor-pointer hover:text-violet-600 transition-colors"
              onClick={() => onNameClick(id)}
            >
              {name}
            </span>
            {type !== "user" && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                </span>
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate">
            {followers} {getTypeLabel(type)}
          </p>
          <div className="mt-2 flex gap-1.5">
            <Button
              size="sm"
              onClick={() => onToggleFollow(id)}
              className={`h-8 text-xs rounded-lg shadow-sm transition-all duration-200 ${
                isFollowed 
                  ? "bg-violet-500 text-white hover:bg-violet-600" 
                  : "bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800"
              }`}
            >
              {isFollowed ? "Đã " + getTypeAction(type).toLowerCase() : getTypeAction(type)}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onHide(id)}
              className="h-8 text-xs rounded-lg border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-red-600 transition-colors"
            >
              Ẩn
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function TrendingCard({ id, tag, category, count, growth, onClick }: TrendingCardProps) {
  return (
    <Card 
      className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{category}</span>
            <h4 className="font-medium text-slate-900 mt-0.5 text-sm">{tag}</h4>
          </div>
          <Badge className="bg-gradient-to-r from-violet-500/80 to-indigo-600/80 text-white hover:from-violet-600/80 hover:to-indigo-700/80 shadow-sm">
            <span className="text-xs">+{growth}%</span>
          </Badge>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <Users className="h-3 w-3" />
          <span>{count} người đang thảo luận</span>
        </div>
      </div>
    </Card>
  )
}



export default RightSidebar;

 