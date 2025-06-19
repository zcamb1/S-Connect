import React from 'react';

const upcomingEvents = [
  {
    id: 1,
    title: 'Garden BBQ',
    date: 'Sat 6, June, Tom\'s Garden',
    icon: '🍖'
  },
  {
    id: 2,
    title: 'City Council Vote',
    date: 'Sat 6, June, Town Hall',
    icon: '🏛️'
  },
  {
    id: 3,
    title: 'Post-punk Festival',
    date: 'Sat 6, June, Tom\'s Garden',
    icon: '🎵'
  },
  {
    id: 4,
    title: 'Maybe Boxing Stand-up',
    date: 'Sat 6, June, Tom\'s Garden',
    icon: '🥊'
  },
  {
    id: 5,
    title: 'Yebonič Tour 2023',
    date: 'Sat 6, June, Tom\'s Garden',
    icon: '🎤'
  }
];

const communityChats = [
  {
    id: 1,
    name: 'Dog Lovers',
    avatar: '🐕',
    online: true
  },
  {
    id: 2,
    name: 'Copenhagen friends',
    avatar: '🇩🇰',
    online: true
  },
  {
    id: 3,
    name: 'Y2K Car owners',
    avatar: '🚗',
    online: false
  }
];

const groupChats = [
  {
    id: 1,
    name: 'Grill party org',
    avatar: '🔥',
    online: true
  },
  {
    id: 2,
    name: 'Sneaker freaks',
    avatar: '👟',
    online: false
  },
  {
    id: 3,
    name: 'Music in the city',
    avatar: '🎵',
    online: true
  },
  {
    id: 4,
    name: 'School org',
    avatar: '🎓',
    online: false
  }
];

const onlineContacts = [
  {
    id: 1,
    name: 'Mark Larsen',
    avatar: '👨',
    online: true
  },
  {
    id: 2,
    name: 'Ethan Reynolds',
    avatar: '👱',
    online: true
  },
  {
    id: 3,
    name: 'Ava Thompson',
    avatar: '👩',
    online: true
  },
  {
    id: 4,
    name: 'Harper Mitchell',
    avatar: '👧',
    online: true
  },
  {
    id: 5,
    name: 'Pablo Morandi',
    avatar: '🧔',
    online: true
  },
  {
    id: 6,
    name: 'Isabel Hughes',
    avatar: '👩‍🦱',
    online: true
  }
];

const birthdays = [
  {
    id: 1,
    name: 'Bob Hammond',
    date: '2 August',
    age: 'Turning 23 years old',
    avatar: '👨‍🦲'
  },
  {
    id: 2,
    name: 'Harper Mitchell',
    date: '22 August',
    age: 'Turning 21 years old',
    avatar: '👧'
  },
  {
    id: 3,
    name: 'Mason Cooper',
    date: '1 September',
    age: 'Turning 26 years old',
    avatar: '👨'
  },
  {
    id: 4,
    name: 'Isabel Hughes',
    date: '1 September',
    age: 'Turning 18 years old',
    avatar: '👩‍🦱'
  }
];

const RightSidebar: React.FC = () => {
  return (
    <aside className="hidden xl:block w-80 bg-white shadow-sm border-l border-gray-200 min-h-screen">
      <div className="p-4 space-y-6">
        {/* Upcoming Events */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sự kiện sắp tới</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition duration-150">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-lg">
                  {event.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Chats */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhóm cộng đồng</h3>
          <div className="space-y-2">
            {communityChats.map((chat) => (
              <div key={chat.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition duration-150">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                    {chat.avatar}
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{chat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Group Chats */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhóm trò chuyện</h3>
          <div className="space-y-2">
            {groupChats.map((group) => (
              <div key={group.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition duration-150">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                    {group.avatar}
                  </div>
                  {group.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{group.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Online Contacts */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bạn bè đang online</h3>
          <div className="space-y-2">
            {onlineContacts.map((contact) => (
              <div key={contact.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition duration-150">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm">
                    {contact.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{contact.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Birthdays */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sinh nhật</h3>
          <div className="space-y-3">
            {birthdays.map((birthday) => (
              <div key={birthday.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition duration-150">
                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center text-lg">
                  {birthday.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{birthday.name}</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-500">{birthday.date}</span>
                  </div>
                  <p className="text-xs text-gray-500">{birthday.age}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar; 