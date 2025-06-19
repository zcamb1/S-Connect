import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Users, Award, Trophy, Star } from 'lucide-react'

// Mock user data (in real app, this would come from API)
export const mockUser = {
  id: 1,
  userId: "user_001", // Unique ID không thể thay đổi
  name: "Nguyễn Văn Minh",
  username: "@minhnguyensrv",
  full_name: "Nguyễn Văn Minh",
  title: "Senior Full-Stack Developer",
  department: "IT Department",
  level: "Senior Level",
  email: "minh.nguyen@srv.com.vn",
  phone: "+84 901 234 567",
  location: "TP. Hồ Chí Minh, Việt Nam",
  joinDate: "Tham gia từ tháng 3, 2020",
  bio: "Passionate full-stack developer với 5+ năm kinh nghiệm. Chuyên sâu về React, Node.js, và cloud technologies. Luôn học hỏi và chia sẻ kiến thức với team.",
  avatar: "/placeholder.svg?height=150&width=150",
  coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop&crop=center",
  skills: [
    "React", "TypeScript", "Node.js", "Express", "MongoDB", "PostgreSQL",
    "Docker", "AWS", "Git", "REST APIs", "GraphQL", "Redis"
  ],
  stats: {
    posts: 156,
    followers: 1234,
    following: 589,
    likes: 9876
  },
  badges: [
    { id: 1, name: "Team Player", color: "from-blue-500 to-cyan-600", icon: Users },
    { id: 2, name: "Innovation Award", color: "from-purple-500 to-pink-600", icon: Award },
    { id: 3, name: "5 Years Service", color: "from-amber-500 to-orange-600", icon: Trophy },
    { id: 4, name: "Top Performer", color: "from-green-500 to-emerald-600", icon: Star }
  ],
  recentPosts: [
    {
      id: 1,
      content: "Vừa hoàn thành dự án mới với React 18 và TypeScript. Performance improvements rất ấn tượng! 🚀",
      timestamp: "2 giờ trước",
      likes: 24,
      comments: 8,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop"
    },
    {
      id: 2,
      content: "Chia sẻ một số best practices khi làm việc với APIs RESTful. Documentation là chìa khóa! 📚",
      timestamp: "1 ngày trước",
      likes: 45,
      comments: 12
    },
    {
      id: 3,
      content: "Team building hôm nay rất vui! Cảm ơn anh chị em đã có một ngày tuyệt vời 🎉",
      timestamp: "3 ngày trước",
      likes: 67,
      comments: 23,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop"
    }
  ]
}

interface UserContextType {
  user: typeof mockUser
  avatarImage: string
  coverImage: string
  updateUser: (userData: Partial<typeof mockUser>) => void
  updateAvatar: (newAvatar: string) => void
  updateCoverImage: (newCover: string) => void
  resetAvatar: () => void
  resetCoverImage: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState(mockUser)
  const [avatarImage, setAvatarImage] = useState(mockUser.avatar)
  const [coverImage, setCoverImage] = useState(mockUser.coverImage)

  // Load user data from server and localStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          // Try to load from server first
          const response = await fetch('http://localhost:3001/api/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const serverUser = await response.json()
            const userData = {
              ...mockUser,
              name: serverUser.full_name || mockUser.name,
              bio: serverUser.bio || mockUser.bio,
              email: serverUser.email || mockUser.email,
              username: serverUser.username || mockUser.username
            }
            setUser(userData)
            
            // Set avatar from server if available
            if (serverUser.avatar) {
              setAvatarImage(`http://localhost:3001${serverUser.avatar}`)
            }
            
            console.log('✅ User data loaded from server')
            return
          }
        }
      } catch (error) {
        console.error('Failed to load user data from server:', error)
      }
      
      // Fallback to localStorage
      const savedUserProfile = localStorage.getItem('userProfile')
      if (savedUserProfile) {
        try {
          const savedUser = JSON.parse(savedUserProfile)
          setUser({ ...mockUser, ...savedUser })
        } catch (error) {
          console.error('Error parsing saved user profile:', error)
        }
      }

      const savedAvatarImage = localStorage.getItem('userAvatarImage')
      if (savedAvatarImage) {
        setAvatarImage(savedAvatarImage)
      }
      
      const savedCoverImage = localStorage.getItem('userCoverImage')
      if (savedCoverImage) {
        setCoverImage(savedCoverImage)
      }
    }
    
    loadUserData()
  }, [])

  const updateUser = async (userData: Partial<typeof mockUser>) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.warn('No auth token found, using local storage only')
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        localStorage.setItem('userProfile', JSON.stringify(updatedUser))
        return
      }

      // Send update to server
      const formData = new FormData()
      if (userData.name) formData.append('full_name', userData.name)
      if (userData.bio) formData.append('bio', userData.bio)
      if (userData.email) formData.append('email', userData.email)
      if (userData.username) formData.append('username', userData.username)

      const response = await fetch('http://localhost:3001/api/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      if (response.ok) {
        const updatedUserFromServer = await response.json()
        const updatedUser = { 
          ...user, 
          ...userData,
          name: updatedUserFromServer.full_name || userData.name,
          bio: updatedUserFromServer.bio || userData.bio,
          email: updatedUserFromServer.email || userData.email,
          username: updatedUserFromServer.username || userData.username
        }
        setUser(updatedUser)
        localStorage.setItem('userProfile', JSON.stringify(updatedUser))
        console.log('✅ Profile updated successfully!')
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error)
      // Fallback to local storage
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('userProfile', JSON.stringify(updatedUser))
    }
  }

  const updateAvatar = async (newAvatar: string) => {
    try {
      setAvatarImage(newAvatar)
      localStorage.setItem('userAvatarImage', newAvatar)

      const token = localStorage.getItem('token')
      if (!token) {
        console.warn('No auth token found, avatar saved locally only')
        return
      }

      // Convert base64 to file
      const response = await fetch(newAvatar)
      const blob = await response.blob()
      const file = new File([blob], 'avatar.png', { type: 'image/png' })

      // Send avatar to server
      const formData = new FormData()
      formData.append('avatar', file)

      const apiResponse = await fetch('http://localhost:3001/api/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      if (apiResponse.ok) {
        const updatedUser = await apiResponse.json()
        console.log('✅ Avatar updated successfully!', updatedUser)
      } else {
        throw new Error('Failed to update avatar')
      }
    } catch (error) {
      console.error('❌ Error updating avatar:', error)
      // Avatar is already set locally, so we don't need to do anything else
    }
  }

  const updateCoverImage = (newCover: string) => {
    setCoverImage(newCover)
    localStorage.setItem('userCoverImage', newCover)
  }

  const resetAvatar = () => {
    setAvatarImage(mockUser.avatar)
    localStorage.removeItem('userAvatarImage')
  }

  const resetCoverImage = () => {
    setCoverImage(mockUser.coverImage)
    localStorage.removeItem('userCoverImage')
  }

  const value: UserContextType = {
    user,
    avatarImage,
    coverImage,
    updateUser,
    updateAvatar,
    updateCoverImage,
    resetAvatar,
    resetCoverImage
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 