import { useState, useEffect } from "react"
import { 
  Bookmark, 
  Heart, 
  MessageCircle, 
  Share2, 
  X, 
  Calendar,
  Search,
  Filter
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { cn } from "../../../lib/utils"
import { showSuccessToast } from "../../../utils/toast"
import { PostDetail } from "./PostDetail"

// Mock saved posts data
const mockSavedPosts = [
  {
    id: 1,
    author: {
      name: "Phòng Đào Tạo", 
      fallback: "TR",
      avatarColor: "from-purple-500 to-pink-600",
      department: "Training Manager"
    },
    title: "[KHÓA HỌC] CHƯƠNG TRÌNH ĐÀO TẠO DIGITAL MARKETING 2025",
    content: "Mở đăng ký khóa học Digital Marketing miễn phí cho nhân viên! Thời gian: 3 tuần, học online. Nội dung: SEO, SEM, Social Media Marketing, Email Marketing, Analytics...",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop&crop=center",
    savedAt: "2 giờ trước",
    originalDate: "8 giờ trước",
    stats: { likes: 987, comments: 43, shares: 12 },
    tags: ["Digital Marketing", "Training", "Free Course"]
  },
  {
    id: 2,
    author: {
      name: "Ban Giám Đốc",
      fallback: "CEO", 
      avatarColor: "from-amber-500 to-orange-600",
      department: "Thông báo chính thức"
    },
    title: "[THÀNH TỰU] CÔNG TY VINH DANH TOP 10 DOANH NGHIỆP XUẤT SẮC",
    content: "Chúng tôi tự hào thông báo rằng công ty đã được vinh danh trong danh sách Top 10 doanh nghiệp xuất sắc năm 2024. Đây là thành quả của sự cố gắng không ngừng của tất cả các thành viên. 🎉",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop&crop=center",
    savedAt: "1 ngày trước",
    originalDate: "1 ngày trước",
    stats: { likes: 5672, comments: 156, shares: 89 },
    tags: ["Achievement", "Company News", "Award"]
  },
  {
    id: 3,
    author: {
      name: "IT Department",
      fallback: "IT",
      avatarColor: "from-blue-500 to-cyan-600", 
      department: "Team Leader"
    },
    title: "[CẬP NHẬT] TRIỂN KHAI HỆ THỐNG S-CONNECT MỚI",
    content: "Hệ thống S-Connect đã được cập nhật với giao diện mới hiện đại hơn! Các tính năng mới bao gồm: Dark mode, Notification center, Real-time chat và nhiều cải tiến khác.",
    savedAt: "3 ngày trước",
    originalDate: "6 giờ trước",
    stats: { likes: 1234, comments: 67, shares: 28 },
    tags: ["System Update", "S-Connect", "Technology"]
  }
]

export function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all") // all, recent, older
  const [, setCurrentTime] = useState(Date.now()) // Force re-render for time updates
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list')
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [postsStats, setPostsStats] = useState<{[key: number]: any}>({})

  // Load saved posts from localStorage
  useEffect(() => {
    const loadSavedPosts = () => {
      const saved = localStorage.getItem('savedPosts')
      const blacklist = JSON.parse(localStorage.getItem('unsavedMockPosts') || '[]')
      
      let allPosts: any[] = []
      
      // 1. Load từ localStorage trước (bài thật người dùng lưu)
      if (saved) {
        try {
          const parsedSaved = JSON.parse(saved)
          allPosts = [...parsedSaved] // Bài người dùng lưu
        } catch (error) {
          console.error('Error loading saved posts:', error)
        }
      }
      
      // 2. Thêm mock posts (trừ những cái đã unsave)
      const filteredMockPosts = mockSavedPosts.filter(post => !blacklist.includes(post.id))
      const existingIds = allPosts.map(post => post.id)
      const newMockPosts = filteredMockPosts.filter(post => !existingIds.includes(post.id))
      
      // Merge: user posts first, then mock posts
      allPosts = [...allPosts, ...newMockPosts]
      
      // Sort theo thời gian lưu (mới nhất lên đầu)
      allPosts.sort((a, b) => {
        // Ưu tiên posts có savedTimestamp
        if (a.savedTimestamp && b.savedTimestamp) {
          return b.savedTimestamp - a.savedTimestamp
        }
        
        // Nếu không có timestamp, parse Vietnamese format
        const parseVietnameseDate = (dateStr: string) => {
          if (dateStr.includes('vừa xong')) return Date.now()
          if (dateStr.includes('giờ trước')) {
            const hours = parseInt(dateStr.match(/\d+/)?.[0] || '0')
            return Date.now() - (hours * 60 * 60 * 1000)
          }
          if (dateStr.includes('ngày trước')) {
            const days = parseInt(dateStr.match(/\d+/)?.[0] || '0')
            return Date.now() - (days * 24 * 60 * 60 * 1000)
          }
          return Date.now() - (24 * 60 * 60 * 1000) // Default: 1 ngày trước
        }
        
        const timeA = a.savedTimestamp || parseVietnameseDate(a.savedAt || '')
        const timeB = b.savedTimestamp || parseVietnameseDate(b.savedAt || '')
        return timeB - timeA // Mới nhất trước
      })
      
      setSavedPosts(allPosts)
      console.log('📋 Loaded saved posts:', allPosts.length, 'posts')
      
      // Load stats for all posts
      loadStatsForPosts(allPosts)
    }
    loadSavedPosts()
  }, [])
  
  // Load real stats for all posts
  const loadStatsForPosts = async (posts: any[]) => {
    const statsMap: {[key: number]: any} = {}
    
    for (const post of posts) {
      if (post.id) {
        const realStats = await getRealStats(post.id, post.stats)
        statsMap[post.id] = realStats
      }
    }
    
    setPostsStats(statsMap)
    console.log('📊 Loaded stats for', Object.keys(statsMap).length, 'posts')
  }

  // Update time every minute for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const handleUnsavePost = (postId: number) => {
    // Remove từ state hiện tại
    const updatedPosts = savedPosts.filter(post => post.id !== postId)
    setSavedPosts(updatedPosts)
    
    // Update localStorage - remove user saved posts
    const currentSaved = JSON.parse(localStorage.getItem('savedPosts') || '[]')
    const filteredSaved = currentSaved.filter((post: any) => post.id !== postId)
    localStorage.setItem('savedPosts', JSON.stringify(filteredSaved))
    
    // Nếu đây là mock post (ID 1-5), thêm vào blacklist
    if (postId >= 1 && postId <= 5) {
      const blacklist = JSON.parse(localStorage.getItem('unsavedMockPosts') || '[]')
      if (!blacklist.includes(postId)) {
        blacklist.push(postId)
        localStorage.setItem('unsavedMockPosts', JSON.stringify(blacklist))
      }
    }
    
    // Show success message
    showSuccessToast('Đã xóa bài viết khỏi danh sách đã lưu')
    console.log('🗑️ Removed post:', postId, 'Remaining:', updatedPosts.length)
  }

  const filteredPosts = (savedPosts || []).filter(post => {
    if (!post || !post.title || !post.content || !post.author) return false
    
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === "recent") {
      if (post.savedTimestamp) {
        const hoursDiff = (Date.now() - post.savedTimestamp) / (1000 * 60 * 60)
        return matchesSearch && hoursDiff < 24 // Less than 24 hours
      }
      // Fallback to string matching for old format
      return matchesSearch && post.savedAt && (
        post.savedAt.includes("giờ") || 
        post.savedAt.includes("phút") || 
        post.savedAt.includes("vừa xong")
      )
    }
    if (filterBy === "older") {
      if (post.savedTimestamp) {
        const hoursDiff = (Date.now() - post.savedTimestamp) / (1000 * 60 * 60)
        return matchesSearch && hoursDiff >= 24 // 24+ hours ago
      }
      // Fallback to string matching for old format  
      return matchesSearch && post.savedAt && post.savedAt.includes("ngày")
    }
    
    return matchesSearch
  })

  const formatCount = (count: number | undefined): string => {
    // Handle undefined or null values
    if (count === undefined || count === null || isNaN(count)) {
      return '0'
    }
    
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  // Calculate relative time from timestamp
  const getRelativeTime = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 1) return "vừa xong"
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    return `${days} ngày trước`
  }

  // Get real stats for display - SYNCHRONIZED with NewsFeed/PostDetail
  const getRealStats = async (postId: number, originalStats: any) => {
    try {
      // Get real like count from localStorage
      const likeKey = `post_${postId}_liked`
      const countKey = `post_${postId}_like_count`
      const savedCount = localStorage.getItem(countKey)
      
      let likes = originalStats?.likes || 0
      if (savedCount) {
        likes = parseInt(savedCount) || 0
      }
      
      // Get real comment count from database API (same as NewsFeed/PostDetail)
      let comments = originalStats?.comments || 0
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await fetch('http://localhost:3001/api/posts/comment-counts', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const commentCounts = await response.json()
            if (commentCounts[postId]) {
              comments = commentCounts[postId].total || 0 // Use real comment count from database
            }
          }
        }
      } catch (error) {
        console.warn('Error fetching comment count from API for post', postId, error)
        // Fallback to localStorage if API fails
        const savedComments = localStorage.getItem(`comments_${postId}`)
        if (savedComments) {
          try {
            const parsedComments = JSON.parse(savedComments)
            comments = parsedComments.length || originalStats?.comments || 0
          } catch (e) {
            console.warn('Error parsing comments for post', postId)
            comments = originalStats?.comments || 0
          }
        }
      }
      
      return {
        likes: likes || 0,
        comments: comments || 0,
        shares: originalStats?.shares || 0
      }
    } catch (error) {
      console.warn('Error getting real stats for post', postId, error)
      return {
        likes: originalStats?.likes || 0,
        comments: originalStats?.comments || 0,
        shares: originalStats?.shares || 0
      }
    }
  }

  const handleViewPost = (postId: number) => {
    setSelectedPostId(postId)
    setCurrentView('detail')
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedPostId(null)
  }

  // If viewing detail, render PostDetail
  if (currentView === 'detail' && selectedPostId) {
    return <PostDetail postId={selectedPostId.toString()} onBack={handleBackToList} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50">
      <div className="max-w-4xl mx-auto py-8 px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Bookmark className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Bài viết đã lưu</h1>
              <p className="text-slate-600">Tất cả bài viết bạn đã đánh dấu để đọc sau</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 z-10 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết đã lưu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-300 focus:ring focus:ring-violet-100 transition-all relative z-20"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterBy === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterBy("all")}
                className={cn(
                  "rounded-xl",
                  filterBy === "all" 
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700" 
                    : "border-violet-200 text-violet-600 hover:bg-violet-50"
                )}
              >
                Tất cả ({savedPosts?.length || 0})
              </Button>
              <Button
                variant={filterBy === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterBy("recent")}
                className={cn(
                  "rounded-xl",
                  filterBy === "recent" 
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700" 
                    : "border-violet-200 text-violet-600 hover:bg-violet-50"
                )}
              >
                Gần đây
              </Button>
              <Button
                variant={filterBy === "older" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterBy("older")}
                className={cn(
                  "rounded-xl",
                  filterBy === "older" 
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700" 
                    : "border-violet-200 text-violet-600 hover:bg-violet-50"
                )}
              >
                Cũ hơn
              </Button>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 mx-auto mb-4 flex items-center justify-center">
              <Bookmark className="h-10 w-10 text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              {searchTerm ? "Không tìm thấy bài viết" : "Chưa có bài viết đã lưu"}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchTerm 
                ? `Không có bài viết nào khớp với "${searchTerm}"`
                : "Bắt đầu lưu những bài viết hay để đọc lại sau!"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden shadow-xl shadow-slate-200/50 backdrop-blur-sm bg-white/90 border-none hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className={`h-12 w-12 border-2 border-white ring-2 ring-violet-100 shadow-lg`}>
                          <AvatarImage src="/placeholder.svg?height=48&width=48" alt={post.author.name} />
                          <AvatarFallback className={`bg-gradient-to-br ${post.author.avatarColor} text-white`}>
                            {post.author.fallback}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-slate-900">{post.author.name}</h3>
                          <p className="text-sm text-slate-500">{post.author.department} • {post.originalDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Calendar className="h-4 w-4" />
                          <span>Lưu {post.savedTimestamp ? getRelativeTime(post.savedTimestamp) : post.savedAt}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnsavePost(post.id)}
                          className="text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-slate-900 leading-tight">{post.title}</h2>
                      <p className="text-slate-700 leading-relaxed">{post.content}</p>
                      
                                            {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 hover:from-violet-200 hover:to-indigo-200 border-none"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Image */}
                    {(post.image || post.images) && (
                      <div className="mt-4 relative aspect-[16/9] bg-slate-100 overflow-hidden rounded-xl shadow-lg">
                        <img
                          src={post.image?.src || post.image || (post.images && post.images[0]?.src)}
                          alt={post.image?.alt || "Post image"}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    )}

                    {/* Post Stats */}
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-6 text-sm text-slate-500">
                        {(() => {
                          const realStats = postsStats[post.id] || post.stats || {}
                          return (
                            <>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                <span>{formatCount(realStats.likes)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{formatCount(realStats.comments)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share2 className="h-4 w-4" />
                                <span>{formatCount(realStats.shares)}</span>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPost(post.id)}
                        className="border-violet-200 text-violet-600 hover:bg-violet-50 rounded-xl"
                      >
                        Xem bài viết
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 