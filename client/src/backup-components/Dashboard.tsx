import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';

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
  onOpenChangePassword?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onOpenChangePassword }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    fetchPosts();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} onOpenChangePassword={onOpenChangePassword} />
      
      <div className="flex">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        
        <main className="flex-1 max-w-2xl mx-auto px-4 py-6">
          <Feed 
            posts={posts}
            user={user}
            loading={loading}
            onLike={handleLike}
            onCreatePost={handleCreatePost}
          />
        </main>
        
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard; 