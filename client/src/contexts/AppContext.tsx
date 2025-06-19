import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  followedPages: Set<string>;
  joinedGroups: Set<string>;
  followPage: (pageId: string) => void;
  unfollowPage: (pageId: string) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [followedPages, setFollowedPages] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('app_followedPages');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('app_joinedGroups');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const followPage = (pageId: string) => {
    setFollowedPages(prev => {
      const newSet = new Set([...Array.from(prev), pageId]);
      localStorage.setItem('app_followedPages', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const unfollowPage = (pageId: string) => {
    setFollowedPages(prev => {
      const newSet = new Set(prev);
      newSet.delete(pageId);
      localStorage.setItem('app_followedPages', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const joinGroup = (groupId: string) => {
    setJoinedGroups(prev => {
      const newSet = new Set([...Array.from(prev), groupId]);
      localStorage.setItem('app_joinedGroups', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const leaveGroup = (groupId: string) => {
    setJoinedGroups(prev => {
      const newSet = new Set(prev);
      newSet.delete(groupId);
      localStorage.setItem('app_joinedGroups', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const value: AppContextType = {
    followedPages,
    joinedGroups,
    followPage,
    unfollowPage,
    joinGroup,
    leaveGroup,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 