import React from 'react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  {
    id: 'home',
    label: 'Trang chủ',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: 'profile',
    label: 'Hồ sơ',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    id: 'friends',
    label: 'Bạn bè',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    )
  },
  {
    id: 'feed',
    label: 'Bảng tin',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    )
  },
  {
    id: 'events',
    label: 'Sự kiện',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'memories',
    label: 'Kỷ niệm',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  }
];

const groups = [
  {
    id: 'dog-lovers',
    name: 'Dog Lovers',
    avatar: '🐕',
    members: 45
  },
  {
    id: 'gamerzz',
    name: 'GamerZzZ',
    avatar: '🎮',
    members: 32
  },
  {
    id: 'travel-girls',
    name: 'Travel Girls',
    avatar: '✈️',
    members: 28
  },
  {
    id: 'cat-memes',
    name: 'Cat Memes',
    avatar: '😸',
    members: 67
  }
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <aside className="hidden lg:block w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-4 space-y-6">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`sidebar-item w-full ${
                currentView === item.id ? 'active' : ''
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Groups Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
            Nhóm
          </h3>
          <div className="space-y-1">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => onViewChange(`group-${group.id}`)}
                className="sidebar-item w-full"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                  {group.avatar}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">{group.name}</div>
                  <div className="text-xs text-gray-500">{group.members} thành viên</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Shortcuts */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
            Lối tắt
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => onViewChange('company-news')}
              className="sidebar-item w-full"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <span className="font-medium">Tin tức công ty</span>
            </button>
            
            <button
              onClick={() => onViewChange('book-recommendations')}
              className="sidebar-item w-full"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-medium">Sách hay nên đọc</span>
            </button>

            <button
              onClick={() => onViewChange('games-activities')}
              className="sidebar-item w-full"
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="font-medium">Hoạt động & Trò chơi</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 