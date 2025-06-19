import React from 'react';
import { 
  Home, 
  User, 
  Users, 
  Rss, 
  Calendar, 
  Heart,
  Building,
  BookOpen,
  Star,
  Bookmark,
  ChevronRight,
  RotateCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { useAppContext } from '../../contexts/AppContext';
import { suggestionsData } from '../../data/suggestions';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  {
    id: 'home',
    label: 'Trang chủ',
    Icon: Home,
    gradient: 'from-violet-500 to-indigo-600'
  },
  {
    id: 'profile',
    label: 'Hồ sơ',
    Icon: User,
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'schedule',
    label: 'Lịch làm việc',
    Icon: Calendar,
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'pages',
    label: 'Trang tin',
    Icon: Rss,
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'events',
    label: 'Sự kiện',
    Icon: Calendar,
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: 'saved-posts',
    label: 'Bài viết đã lưu',
    Icon: Bookmark,
    gradient: 'from-orange-500 to-red-600'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { joinedGroups } = useAppContext();

  // Get joined groups from context
  const groups = Array.from(joinedGroups).map(groupId => {
    const suggestion = suggestionsData.find(s => s.id === groupId && s.type === 'group');
    if (suggestion) {
      return {
        id: groupId,
        name: suggestion.name,
        avatar: suggestion.avatar,
        members: suggestion.followers // Use followers as members count
      };
    }
    return null;
  }).filter(Boolean) as Array<{id: string, name: string, avatar: string, members: number}>;
  return (
    <aside className="hidden lg:block w-64 bg-gradient-to-br from-slate-50/50 to-violet-50/30 min-h-screen border-r border-slate-200/50">
      <div className="p-4 space-y-6">
        {/* Logo Area */}
        <div className="flex items-center px-2 py-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 p-[1px] shadow-lg shadow-indigo-500/20 mr-3">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path
                  d="M20 5C11.729 5 5 11.729 5 20C5 28.271 11.729 35 20 35C28.271 35 35 28.271 35 20C35 11.729 28.271 5 20 5Z"
                  fill="url(#logo-gradient)"
                />
                <path
                  d="M20 12C15.582 12 12 15.582 12 20C12 24.418 15.582 28 20 28C24.418 28 28 24.418 28 20C28 15.582 24.418 12 20 12Z"
                  fill="white"
                />
                <path
                  d="M20 16C17.791 16 16 17.791 16 20C16 22.209 17.791 24 20 24C22.209 24 24 22.209 24 20C24 17.791 22.209 16 20 16Z"
                  fill="url(#logo-gradient)"
                />
                <defs>
                  <linearGradient id="logo-gradient" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <span className="font-bold text-lg text-violet-600">S-Connect</span>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.Icon;
            const isActive = currentView === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full justify-start h-12 rounded-xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-700 shadow-lg shadow-violet-500/10" 
                    : "hover:bg-slate-100 text-slate-700 hover:text-violet-700"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300",
                  isActive 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                    : "bg-slate-100 group-hover:bg-violet-100"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute right-2">
                    <ChevronRight className="h-4 w-4 text-violet-500" />
                  </div>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-slate-200/50"></div>

        {/* Groups Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Nhóm
            </h3>
            <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-xs">
              {groups.length}
            </Badge>
          </div>
          <div className="space-y-1">
            {groups.map((group) => (
              <Button
                key={group.id}
                variant="ghost"
                onClick={() => onViewChange(`group-${group.id}`)}
                className="w-full justify-start h-12 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-violet-700 transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center text-lg mr-3 transition-all duration-300">
                  {group.avatar}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{group.name}</div>
                  <div className="text-xs text-slate-500">{group.members} thành viên</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Lối tắt
            </h3>
          </div>
          <div className="space-y-1">
            <Button
              variant="ghost"
              onClick={() => onViewChange('company-news')}
              className="w-full justify-start h-12 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-violet-700 transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mr-3 transition-all duration-300">
                <Building className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium text-sm">Tin tức công ty</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onViewChange('book-recommendations')}
              className="w-full justify-start h-12 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-violet-700 transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-green-100 group-hover:bg-green-200 flex items-center justify-center mr-3 transition-all duration-300">
                <BookOpen className="h-4 w-4 text-green-600" />
              </div>
              <span className="font-medium text-sm">Sách hay nên đọc</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => onViewChange('games-activities')}
              className="w-full justify-start h-12 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-violet-700 transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mr-3 transition-all duration-300">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              <span className="font-medium text-sm">Hoạt động & Trò chơi</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => onViewChange('lucky-wheel')}
              className="w-full justify-start h-12 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-violet-700 transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-yellow-100 group-hover:bg-yellow-200 flex items-center justify-center mr-3 transition-all duration-300">
                <RotateCw className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="font-medium text-sm">Vòng quay may mắn</span>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 