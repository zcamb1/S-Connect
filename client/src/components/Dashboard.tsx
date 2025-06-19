import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TopNavigation } from './TopNavigation';
import Sidebar from './Sidebar';
import Feed from './Feed';
import { NewsFeed } from './NewsFeed';
import { CreatePost } from './CreatePost';
import RightSidebar from './RightSidebar';
import { Profile } from './Profile';
import { SavedPosts } from './SavedPosts';
import PagesFollow from './PagesFollow';
import { PageView } from './PageView';
import { LuckyWheel } from './LuckyWheel';
import { WorkSchedule } from './WorkSchedule';
// @ts-ignore
import { GroupDetail } from './GroupDetail';
import { PostDetail } from './PostDetail';
import { SearchResults } from './SearchResults';
import { Settings } from './Settings';

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

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onOpenSettings?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onOpenSettings }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [viewingPageId, setViewingPageId] = useState<string | null>(null);
  const [viewingPostId, setViewingPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle URL hash for post sharing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#post-')) {
        const postId = hash.replace('#post-', '');
        setViewingPostId(postId);
        setCurrentView('post-detail');
      }
    };

    // Check initial hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/posts/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the post in the local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              user_liked: response.data.liked,
              likes_count: response.data.liked ? post.likes_count + 1 : post.likes_count - 1
            }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCreatePost = async (content: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/posts', { content }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refresh posts after creating
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setCurrentView('search');
  };

  const handleBackFromSearch = () => {
    setIsSearching(false);
    setSearchQuery('');
    setCurrentView('home');
  };

  const handleViewPostFromSearch = (postId: number) => {
    setViewingPostId(postId.toString());
    setCurrentView('post-detail');
    setIsSearching(false);
    window.location.hash = `post-${postId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
        user={user} 
        onLogout={onLogout} 
        onOpenSettings={() => setShowSettings(true)}
        currentView={currentView}
        onViewChange={setCurrentView}
        onSearch={handleSearch}
      />
      
      <div className="flex">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        
        <main className="flex-1 px-4 py-6">
          {viewingPostId ? (
            <PostDetail 
              postId={viewingPostId} 
              onBack={() => {
                setViewingPostId(null)
                setCurrentView('home')
                window.location.hash = ''
              }} 
            />
          ) : viewingPageId ? (
            <PageView 
              pageId={viewingPageId} 
              onBack={() => setViewingPageId(null)} 
            />
          ) : (
            <>
              {currentView === 'search' && isSearching && (
                <SearchResults 
                  searchQuery={searchQuery} 
                  onBack={handleBackFromSearch}
                  onViewPost={handleViewPostFromSearch}
                />
              )}
              {currentView === 'home' && !isSearching && (
                <NewsFeed />
              )}
              {currentView === 'feed' && (
                <div className="max-w-2xl mx-auto">
                  <CreatePost user={user} onCreatePost={handleCreatePost} />
                  <Feed 
                    posts={posts}
                    user={user}
                    loading={loading}
                    onLike={handleLike}
                    onCreatePost={handleCreatePost}
                  />
                </div>
              )}
              {currentView === 'profile' && (
                <Profile />
              )}
              {currentView === 'saved-posts' && (
                <SavedPosts />
              )}
              {currentView === 'pages' && (
                <PagesFollow />
              )}
              {currentView === 'events' && (
                <LuckyWheel />
              )}
              {currentView === 'schedule' && (
                <WorkSchedule />
              )}
              {currentView.startsWith('group-') && (
                <GroupDetail groupId={currentView.replace('group-', '')} />
              )}
            </>
          )}
          {currentView !== 'home' && currentView !== 'feed' && currentView !== 'profile' && currentView !== 'saved-posts' && currentView !== 'pages' && currentView !== 'events' && currentView !== 'schedule' && (
            <div className="max-w-3xl mx-auto py-8 px-4 md:px-6">
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-50 to-indigo-50 mb-4 shadow-lg shadow-slate-200/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-400"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M9 8h6" />
                    <path d="M9 12h6" />
                    <path d="M9 16h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2 capitalize">{currentView.replace('-', ' ')}</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Tính năng này đang được phát triển. Vui lòng quay lại sau.
                </p>
              </div>
            </div>
          )}
        </main>
        
        <RightSidebar onPageClick={setViewingPageId} />
      </div>
      
      {/* Settings Modal */}
      <Settings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default Dashboard; 