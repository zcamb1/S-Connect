import React, { useState, useEffect } from 'react';
import Login from './components/features/user/Login';
import Dashboard from './components/common/Dashboard';
import { AppProvider } from './contexts/AppContext';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string, userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AppProvider>
        <UserProvider>
        <div className="App">
          {user ? (
            <Dashboard 
              user={user} 
              onLogout={handleLogout}
            />
          ) : (
            <Login 
              onLogin={handleLogin}
            />
          )}
        </div>
        </UserProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App; 