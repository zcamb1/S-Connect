import { useState, useEffect } from "react"
import { Users, UserMinus, Building, Monitor, Megaphone, Heart, BookOpen, Rss } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { showSuccessToast } from "../utils/toast"
import axios from 'axios'
import { useAppContext } from '../contexts/AppContext'
import { suggestionsData } from '../data/suggestions'

interface FollowedPage {
  id: string
  name: string
  description: string
  avatar: string
  category: string
  followers: number
  posts: number
  icon: any
  gradient: string
  verified: boolean
}

// Mock pages data from PagesFollow - this should be shared data in a real app
const mockPagesData = [
  {
    id: '1',
    name: 'Tin tức công ty',
    category: 'Tin tức',
    description: 'Cập nhật tin tức mới nhất về công ty và ngành',
    followers: 15420,
    posts: 234,
    verified: true,
    avatar: '📰',
    avatarColor: 'blue'
  },
  {
    id: '2', 
    name: 'HR - Nhân sự',
    category: 'Nhân sự',
    description: 'Thông tin tuyển dụng, chính sách nhân sự',
    followers: 8930,
    posts: 156,
    verified: true,
    avatar: '👥',
    avatarColor: 'green'
  },
  {
    id: '3',
    name: 'IT Department',
    category: 'Công nghệ',
    description: 'Cập nhật công nghệ, hướng dẫn kỹ thuật',
    followers: 12340,
    posts: 189,
    verified: true,
    avatar: '💻',
    avatarColor: 'purple'
  },
  {
    id: '4',
    name: 'Marketing Team',
    category: 'Marketing',
    description: 'Chiến lược marketing, xu hướng thị trường',
    followers: 9876,
    posts: 267,
    verified: true,
    avatar: '📈',
    avatarColor: 'orange'
  },
  {
    id: '5',
    name: 'Đào tạo & Phát triển',
    category: 'Giáo dục',
    description: 'Khóa học, chương trình đào tạo nội bộ',
    followers: 7654,
    posts: 145,
    verified: true,
    avatar: '🎓',
    avatarColor: 'indigo'
  },
  {
    id: '6',
    name: 'Sức khỏe & An toàn',
    category: 'Sức khỏe',
    description: 'Hướng dẫn an toàn lao động, chăm sóc sức khỏe',
    followers: 5432,
    posts: 98,
    verified: true,
    avatar: '🏥',
    avatarColor: 'red'
  }
]

export function FollowedPagesList() {
  const { followedPages: followedPageIds, unfollowPage } = useAppContext()
  const [followedPages, setFollowedPages] = useState<FollowedPage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFollowedPages()
  }, [followedPageIds])

  const loadFollowedPages = async () => {
    try {
      const followed: FollowedPage[] = []
      
      // Convert followed page IDs to page objects from both sources
      Array.from(followedPageIds).forEach(pageId => {
        // First try to find in suggestionsData (RightSidebar pages)
        const suggestion = suggestionsData.find(s => s.id === pageId && s.type === 'page')
        if (suggestion) {
          followed.push({
            id: pageId,
            name: suggestion.name,
            description: suggestion.description || '',
            avatar: suggestion.avatar,
            category: 'Trang',
            followers: suggestion.followers,
            posts: Math.floor(Math.random() * 200) + 50,
            icon: Building,
            gradient: getGradientByColor(suggestion.avatarColor),
            verified: true
          })
          return
        }
        
        // Then try to find in mockPagesData (PagesFollow pages)
        const mockPage = mockPagesData.find(p => p.id === pageId)
        if (mockPage) {
          followed.push({
            id: pageId,
            name: mockPage.name,
            description: mockPage.description,
            avatar: mockPage.avatar,
            category: mockPage.category,
            followers: mockPage.followers,
            posts: mockPage.posts,
            icon: Building,
            gradient: getGradientByColor(mockPage.avatarColor),
            verified: mockPage.verified
          })
        }
      })

      setFollowedPages(followed)
      setLoading(false)
    } catch (error) {
      console.error('Error loading followed pages:', error)
      setFollowedPages([])
      setLoading(false)
    }
  }

  const getGradientByColor = (color: string) => {
    switch (color) {
      case "emerald":
        return "from-emerald-500 to-teal-600"
      case "purple":
        return "from-purple-500 to-indigo-600"
      case "amber":
        return "from-amber-500 to-orange-600"
      case "blue":
        return "from-blue-500 to-indigo-600"
      case "green":
        return "from-green-500 to-emerald-600"
      case "orange":
        return "from-orange-500 to-red-600"
      case "indigo":
        return "from-indigo-500 to-purple-600"
      case "red":
        return "from-red-500 to-pink-600"
      default:
        return "from-violet-500 to-indigo-600"
    }
  }

  const handleUnfollowPage = async (pageId: string) => {
    try {
      const page = followedPages.find(p => p.id === pageId)
      const pageName = page?.name || 'trang này'
      
      // Update global state
      unfollowPage(pageId)
      
      showSuccessToast(`Đã hủy theo dõi "${pageName}"`)
      
      // Try database sync (optional)
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`/api/pages/${pageId}/unfollow`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } catch (dbError) {
        console.log('Database sync failed, but using context backup:', dbError)
      }
    } catch (error) {
      console.error('Error unfollowing page:', error)
      const page = followedPages.find(p => p.id === pageId)
      const pageName = page?.name || 'trang này'
      unfollowPage(pageId.toString())
      showSuccessToast(`Đã hủy theo dõi "${pageName}"`)
    }
  }

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-4 p-4 bg-slate-100 rounded-xl">
              <div className="h-16 w-16 bg-slate-200 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              </div>
              <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (followedPages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 mx-auto mb-4 flex items-center justify-center">
          <Rss className="h-8 w-8 text-violet-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Chưa theo dõi trang nào</h3>
        <p className="text-slate-500 mb-4">Hãy theo dõi các trang tin để nhận thông tin mới nhất</p>
        <Button 
          className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
          onClick={() => window.location.href = '#pages'}
        >
          Khám phá trang tin
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Trang đã theo dõi ({followedPages.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {followedPages.map((page) => {
          const Icon = page.icon
          
          return (
            <div 
              key={page.id} 
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:shadow-lg transition-all duration-300"
            >
              {/* Page Avatar */}
              <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${page.gradient} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                {page.avatar}
              </div>

              {/* Page Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-900 truncate">{page.name}</h4>
                  {page.verified && (
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 mb-2 line-clamp-1">{page.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-none text-xs"
                  >
                    {page.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{formatCount(page.followers)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon className="h-3 w-3" />
                    <span>{page.posts} bài viết</span>
                  </div>
                </div>
              </div>

              {/* Unfollow Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUnfollowPage(page.id)}
                className="border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 flex-shrink-0"
              >
                <UserMinus className="h-3 w-3 mr-1" />
                Hủy theo dõi
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
} 