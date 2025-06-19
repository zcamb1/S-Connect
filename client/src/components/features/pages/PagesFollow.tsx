import React, { useState, useEffect } from 'react';
import { Search, Users, Building2, Heart, MessageCircle, Eye, Plus, Check } from 'lucide-react';
import { showSuccessToast } from '../../../utils/toast';
import PageDetail from './PageDetail';
import { useAppContext } from '../../../contexts/AppContext';

interface Page {
  id: string;
  name: string;
  category: string;
  description: string;
  followers: number;
  posts: number;
  views: string;
  verified: boolean;
  avatar: string;
  backgroundImage: string;
}

const PagesFollow: React.FC = () => {
  const { followedPages, followPage, unfollowPage } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, following, not-following
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const mockPages: Page[] = [
    {
      id: '1',
      name: 'Tin tức công ty',
      category: 'Tin tức',
      description: 'Cập nhật tin tức mới nhất về công ty và ngành',
      followers: 15420,
      posts: 234,
      views: '2.1M',
      verified: true,
      avatar: '📰',
      backgroundImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop'
    },
    {
      id: '2', 
      name: 'HR - Nhân sự',
      category: 'Nhân sự',
      description: 'Thông tin tuyển dụng, chính sách nhân sự',
      followers: 8930,
      posts: 156,
      views: '890K',
      verified: true,
      avatar: '👥',
      backgroundImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'IT Department',
      category: 'Công nghệ',
      description: 'Cập nhật công nghệ, hướng dẫn kỹ thuật',
      followers: 12340,
      posts: 189,
      views: '1.5M',
      verified: true,
      avatar: '💻',
      backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop'
    },
    {
      id: '4',
      name: 'Marketing Team',
      category: 'Marketing',
      description: 'Chiến lược marketing, xu hướng thị trường',
      followers: 9876,
      posts: 267,
      views: '1.2M',
      verified: true,
      avatar: '📈',
      backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop'
    },
    {
      id: '5',
      name: 'Đào tạo & Phát triển',
      category: 'Giáo dục',
      description: 'Khóa học, chương trình đào tạo nội bộ',
      followers: 7654,
      posts: 145,
      views: '650K',
      verified: true,
      avatar: '🎓',
      backgroundImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop'
    },
    {
      id: '6',
      name: 'Sức khỏe & An toàn',
      category: 'Sức khỏe',
      description: 'Hướng dẫn an toàn lao động, chăm sóc sức khỏe',
      followers: 5432,
      posts: 98,
      views: '420K',
      verified: true,
      avatar: '🏥',
      backgroundImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop'
    }
  ];

  useEffect(() => {
    console.log('followedPages from context:', Array.from(followedPages));
  }, [followedPages]);

    const handleFollow = async (pageId: string, pageName: string) => {
    console.log('Following page:', pageId, pageName);
    console.log('Current followed pages:', Array.from(followedPages));
    
    try {
      // Update context
      followPage(pageId);
      showSuccessToast(`Đã theo dõi ${pageName}`);
      
      console.log('Updated followed pages via context');
      
      // Try API call (optional)
      const response = await fetch('/api/pages/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId })
      });
    } catch (error) {
      console.log('API error, but context updated:', error);
    }
  };

    const handleUnfollow = async (pageId: string, pageName: string) => {
    console.log('Unfollowing page:', pageId, pageName);
    console.log('Current followed pages:', Array.from(followedPages));
    
    try {
      // Update context
      unfollowPage(pageId);
      showSuccessToast(`Đã bỏ theo dõi ${pageName}`);
      
      console.log('Updated followed pages via context');
      
      // Try API call (optional)
      const response = await fetch('/api/pages/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId })
      });
    } catch (error) {
      console.log('API error, but context updated:', error);
    }
  };

  // First filter by search term
  const searchFilteredPages = mockPages.filter(page => {
    return page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           page.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate counts based on search results
  const followingCount = searchFilteredPages.filter(page => followedPages.has(page.id)).length;
  const notFollowingCount = searchFilteredPages.filter(page => !followedPages.has(page.id)).length;

  // Then apply filter
  const filteredPages = searchFilteredPages.filter(page => {
    if (filterBy === 'following') {
      return followedPages.has(page.id);
    }
    if (filterBy === 'not-following') {
      return !followedPages.has(page.id);
    }
    return true; // 'all' case
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handlePageClick = (page: Page) => {
    setSelectedPage(page);
  };

  const handleBackToList = () => {
    setSelectedPage(null);
  };

  // If a page is selected, show PageDetail
  if (selectedPage) {
    return (
      <PageDetail
        pageId={selectedPage.id}
        pageName={selectedPage.name}
        pageAvatar={selectedPage.avatar}
        pageCategory={selectedPage.category}
        pageDescription={selectedPage.description}
        pageFollowers={selectedPage.followers}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Artistic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            Khám phá các Trang
          </h1>
          <p className="text-gray-600 text-lg">Theo dõi các trang để cập nhật thông tin mới nhất</p>
        </div>

        {/* Sophisticated Search & Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-2xl p-2">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    placeholder="Tìm kiếm trang tin, mô tả, danh mục..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-transparent border-0 focus:ring-0 text-slate-700 placeholder:text-slate-400 text-lg outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setFilterBy('all')}
              className={`rounded-2xl px-8 py-3 font-medium transition-all duration-300 ${
                filterBy === 'all'
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white hover:shadow-md text-slate-700'
              }`}
            >
              Tất cả ({searchFilteredPages.length})
            </button>
            <button
              onClick={() => setFilterBy('following')}
              className={`rounded-2xl px-8 py-3 font-medium transition-all duration-300 ${
                filterBy === 'following'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white hover:shadow-md text-slate-700'
              }`}
            >
              Đang theo dõi ({followingCount})
            </button>
            <button
              onClick={() => setFilterBy('not-following')}
              className={`rounded-2xl px-8 py-3 font-medium transition-all duration-300 ${
                filterBy === 'not-following'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white hover:shadow-md text-slate-700'
              }`}
            >
              Chưa theo dõi ({notFollowingCount})
            </button>
          </div>
        </div>

        {/* Pages Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <div key={page.id} className="group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Background Image */}
                  <div 
                    className="h-32 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${page.backgroundImage})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      {page.verified && (
                        <div className="bg-blue-500 text-white p-1 rounded-full">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Avatar and Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-3xl bg-gray-100 rounded-xl p-3 -mt-8 relative z-10 shadow-lg">
                        {page.avatar}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 
                          className="font-bold text-lg text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                          onClick={() => handlePageClick(page)}
                        >
                          {page.name}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                          {page.category}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                      {page.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="flex items-center justify-center text-gray-400 mb-1">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-gray-900">{formatNumber(page.followers)}</div>
                        <div className="text-xs text-gray-500">Người theo dõi</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center text-gray-400 mb-1">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-gray-900">{page.posts}</div>
                        <div className="text-xs text-gray-500">Bài viết</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center text-gray-400 mb-1">
                          <Eye className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-gray-900">{page.views}</div>
                        <div className="text-xs text-gray-500">Lượt xem</div>
                      </div>
                    </div>

                    {/* Follow Button */}
                    {followedPages.has(page.id) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnfollow(page.id, page.name);
                        }}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-red-500 hover:to-red-600 text-white py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Đang theo dõi</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollow(page.id, page.name);
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Theo dõi</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy trang nào</h3>
              <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagesFollow; 