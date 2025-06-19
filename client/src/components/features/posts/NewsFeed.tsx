import { useState, useEffect } from "react"
import { MoreHorizontal, Maximize, Bookmark } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { PostInteraction } from "./PostInteraction"
import { PostDetail } from "./PostDetail"
import { showSuccessToast, showErrorToast } from "../../../utils/toast"

// Fake data for posts - export for sharing
export const postsData = [
  {
    id: 1,
    author: {
      name: "Tin tức",
      fallback: "TT",
      role: "Tin tức",
      department: "2 giờ trước",
      avatarColor: "from-violet-500 to-purple-600",
      ringColor: "ring-violet-100 shadow-violet-500/10",
      badgeColor: "from-violet-500/10 to-purple-500/10 text-violet-700 hover:from-violet-500/20 hover:to-purple-500/20"
    },
    title: "[SRV OLYMPIC 2025] LỊCH THI ĐẤU BỘ MÔN BÓNG BÀN",
    content: "Chào mừng các vận động viên tham gia giải đấu bóng bàn Olympic SRV 2025! Dưới đây là lịch thi đấu chi tiết cho các vòng đấu sắp tới.",
    image: {
      src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=450&fit=crop&crop=center",
      alt: "Olympic Table Tennis"
    },
    stats: { likes: 4800, comments: 32, shares: 15 }
  },
  {
    id: 2,
    author: {
      name: "Minh Hoang",
      fallback: "MH", 
      role: "Nhân viên",
      department: "HR Manager • 4 giờ trước",
      avatarColor: "from-green-500 to-emerald-600",
      ringColor: "ring-green-100 shadow-green-500/10",
      badgeColor: "from-green-500/10 to-emerald-500/10 text-emerald-700 hover:from-green-500/20 hover:to-emerald-500/20"
    },
    title: "[TEAM BUILDING 2025] HOẠT ĐỘNG VUI CHƠI CUỐI TUẦN",
    content: "Cuối tuần này chúng ta sẽ có hoạt động team building tại khu du lịch sinh thái. Đăng ký ngay để có chỗ nhé! Sẽ có rất nhiều hoạt động thú vị như: leo núi, bơi lội, BBQ...",
    image: {
      src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=450&fit=crop&crop=center",
      alt: "Team Building Activity"
    },
    stats: { likes: 2341, comments: 89, shares: 45 }
  },
  {
    id: 3,
    author: {
      name: "Ban Giám Đốc",
      fallback: "CEO",
      role: "Lãnh đạo",
      department: "Thông báo chính thức • 1 ngày trước",
      avatarColor: "from-amber-500 to-orange-600",
      ringColor: "ring-amber-100 shadow-amber-500/10",
      badgeColor: "from-amber-500/10 to-orange-500/10 text-orange-700 hover:from-amber-500/20 hover:to-orange-500/20",
      specialBadge: true
    },
    title: "[THÀNH TỰU] CÔNG TY VINH DANH TOP 10 DOANH NGHIỆP XUẤT SẮC",
    content: "Chúng tôi tự hào thông báo rằng công ty đã được vinh danh trong danh sách Top 10 doanh nghiệp xuất sắc năm 2024. Đây là thành quả của sự cố gắng không ngừng của tất cả các thành viên. 🎉",
    image: {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop&crop=center",
      alt: "Company Achievement"
    },
    stats: { likes: 5672, comments: 156, shares: 89 }
  },
  {
    id: 4,
    author: {
      name: "IT Department",
      fallback: "IT",
      role: "Kỹ thuật",
      department: "Team Leader • 6 giờ trước",
      avatarColor: "from-blue-500 to-cyan-600",
      ringColor: "ring-blue-100 shadow-blue-500/10",
      badgeColor: "from-blue-500/10 to-cyan-500/10 text-blue-700 hover:from-blue-500/20 hover:to-cyan-500/20"
    },
    title: "[CẬP NHẬT] TRIỂN KHAI HỆ THỐNG S-CONNECT MỚI",
    content: "Hệ thống S-Connect đã được cập nhật với giao diện mới hiện đại hơn! Các tính năng mới bao gồm: Dark mode, Notification center, Real-time chat và nhiều cải tiến khác.",
    specialContent: {
      type: "tip",
      content: "💡 Mẹo: Nhấn Ctrl+D để bookmark trang này!"
    },
    stats: { likes: 1234, comments: 67, shares: 28 }
  },
  {
    id: 5,
    author: {
      name: "Phòng Đào Tạo",
      fallback: "TR",
      role: "Giáo dục", 
      department: "Training Manager • 8 giờ trước",
      avatarColor: "from-purple-500 to-pink-600",
      ringColor: "ring-purple-100 shadow-purple-500/10",
      badgeColor: "from-purple-500/10 to-pink-500/10 text-purple-700 hover:from-purple-500/20 hover:to-pink-500/20"
    },
    title: "[KHÓA HỌC] CHƯƠNG TRÌNH ĐÀO TẠO DIGITAL MARKETING 2025",
    content: "Mở đăng ký khóa học Digital Marketing miễn phí cho nhân viên! Thời gian: 3 tuần, học online. Nội dung: SEO, SEM, Social Media Marketing, Email Marketing, Analytics...",
    image: {
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop&crop=center",
      alt: "Digital Marketing Training"
    },
    stats: { likes: 987, comments: 43, shares: 12 }
  }
]

// Get real stats from database API and localStorage
const getRealStats = async (postId: number, originalStats: any) => {
  try {
    // Get real like count from localStorage
    const likeKey = `post_${postId}_liked`
    const countKey = `post_${postId}_like_count`
    const savedLiked = localStorage.getItem(likeKey)
    const savedCount = localStorage.getItem(countKey)
    
    let likes = originalStats.likes
    if (savedCount) {
      likes = parseInt(savedCount)
    }
    
    // Get real comment count from database API
    let comments = originalStats.comments
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
            comments = commentCounts[postId].total // Use real comment count from database
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
          comments = parsedComments.length || originalStats.comments
        } catch (e) {
          console.warn('Error parsing comments for post', postId)
        }
      }
    }
    
    return {
      likes,
      comments,
      shares: originalStats.shares // Shares không thay đổi
    }
  } catch (error) {
    console.warn('Error getting real stats for post', postId, error)
    return originalStats
  }
}

// Save post functionality
const savePost = async (post: any) => {
  try {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]')
    const isAlreadySaved = savedPosts.some((savedPost: any) => savedPost.id === post.id)
    
    console.log('💾 Attempting to save post:', post.id, 'Already saved:', isAlreadySaved)
    
    if (!isAlreadySaved) {
      const now = new Date()
      
      // Get real stats from localStorage (AWAIT THE ASYNC FUNCTION!)
      const realStats = await getRealStats(post.id, post.stats)
      
      const postToSave = {
        ...post,
        stats: realStats, // Use real stats instead of static ones
        savedAt: "vừa xong", // Initial display
        originalDate: post.author.department,
        savedTimestamp: now.getTime() // For sorting
      }
      
      // Add to beginning of array (most recent first)
      savedPosts.unshift(postToSave)
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts))
      
      console.log('✅ Post saved successfully. Total saved:', savedPosts.length, 'Real stats:', realStats)
      
      // Show success message
      showSuccessToast('Đã lưu bài viết thành công!')
      return true
    } else {
      console.log('⚠️ Post already saved')
      showErrorToast('Bài viết đã được lưu trước đó')
      return false
    }
  } catch (error) {
    console.error('Error saving post:', error)
    showErrorToast('Có lỗi khi lưu bài viết')
    return false
  }
}

// Post component
function Post({ post, onViewPost, sharedStats }: { post: typeof postsData[0], onViewPost: (id: number) => void, sharedStats?: any }) {
  const [realStats, setRealStats] = useState(post.stats)
  
  // Load real stats on mount
  useEffect(() => {
    const loadRealStats = async () => {
      const stats = await getRealStats(post.id, post.stats)
      setRealStats(stats)
    }
    loadRealStats()
  }, [post.id, post.stats])
  
  // Use shared stats if available (updated from PostDetail)
  const displayStats = sharedStats || realStats
  
  // Handle comment count changes
  const handleCommentCountChange = async (newCount: number) => {
    console.log('📊 Post received comment count change:', newCount)
    // Refresh real stats from API
    const refreshedStats = await getRealStats(post.id, realStats)
    setRealStats(refreshedStats)
  }
  
  return (
    <Card className="mb-8 overflow-hidden rounded-3xl border-none shadow-2xl shadow-slate-200/50 backdrop-blur-sm bg-white/90">
      <CardHeader className="p-6 flex flex-row items-center gap-4 bg-transparent">
        <Avatar className={`h-14 w-14 border-4 border-white ring-4 ${post.author.ringColor} shadow-lg`}>
          <AvatarImage src="/placeholder.svg?height=56&width=56" alt={post.author.name} />
          <AvatarFallback className={`bg-gradient-to-br ${post.author.avatarColor} text-white`}>
            {post.author.fallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-slate-900">{post.author.name}</span>
            <Badge
              variant="secondary"
              className={`bg-gradient-to-r ${post.author.badgeColor} ml-1 border-none`}
            >
              {post.author.specialBadge ? (
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600"></span>
                  {post.author.role}
                </span>
              ) : (
                post.author.role
              )}
            </Badge>
          </div>
          <p className="text-sm text-slate-500">{post.author.department}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-violet-600 hover:text-violet-700 border-violet-200 hover:bg-violet-50 rounded-full h-8 px-4 text-xs font-medium"
            onClick={() => onViewPost(post.id)}
          >
            Xem bài viết
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-500 hover:text-slate-700 rounded-full h-9 w-9 hover:bg-slate-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-xl shadow-slate-200/50">
              <DropdownMenuItem 
                className="rounded-lg cursor-pointer"
                onClick={async () => await savePost(post)}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Lưu bài viết
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer">Báo cáo</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer">Ẩn bài viết</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <div className="px-6 py-4 bg-transparent">
        <h2 className="text-2xl font-bold mb-3 text-slate-900">{post.title}</h2>
        <p className="text-slate-700">{post.content}</p>
      </div>
      {post.image && (
        <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden mx-6 rounded-2xl shadow-inner">
          <img
            src={post.image.src}
            alt={post.image.alt}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}
      {post.specialContent && (
        <div className="px-6 py-2">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100/50">
            <p className="text-sm text-blue-700 font-medium">{post.specialContent.content}</p>
          </div>
        </div>
      )}
      <CardFooter className="p-6 flex flex-col gap-4 bg-transparent">
        <PostInteraction 
          likeCount={displayStats.likes} 
          commentCount={displayStats.comments} 
          shareCount={displayStats.shares || 0}
          postId={post.id}
          onCommentCountChange={handleCommentCountChange}
        />
      </CardFooter>
    </Card>
  )
}

function NewsFeedView({ onViewPost, postsStats }: { onViewPost: (id: number) => void, postsStats?: {[key: number]: any} }) {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 md:px-6">
      {postsData.map((post) => (
        <Post key={post.id} post={post} onViewPost={onViewPost} sharedStats={postsStats?.[post.id]} />
      ))}

      {/* End of feed indicator */}
      <div className="text-center py-12">
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
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Bạn đã xem hết bài viết!</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Tuyệt vời! Bạn đã cập nhật tất cả tin tức mới nhất. Hãy quay lại sau để xem thêm nội dung mới.
        </p>
        <div className="mt-6">
          <button className="px-6 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-full text-sm font-medium hover:from-violet-600 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/30">
            Làm mới bảng tin
          </button>
        </div>
      </div>
    </div>
  )
}

export function NewsFeed() {
  const [currentView, setCurrentView] = useState<'feed' | 'detail'>('feed')
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [postsStats, setPostsStats] = useState<{[key: number]: any}>({})

  const handleViewPost = (postId: number) => {
    setSelectedPostId(postId)
    setCurrentView('detail')
  }

  const handleBackToFeed = () => {
    setCurrentView('feed')
    setSelectedPostId(null)
  }

  const handleStatsChange = (postId: number, newStats: any) => {
    console.log('📊 NewsFeed received stats change for post', postId, newStats)
    setPostsStats(prev => ({
      ...prev,
      [postId]: newStats
    }))
  }

  if (currentView === 'detail' && selectedPostId) {
    return (
      <PostDetail 
        postId={selectedPostId.toString()} 
        onBack={handleBackToFeed} 
        onStatsChange={handleStatsChange}
      />
    )
  }

  return <NewsFeedView onViewPost={handleViewPost} postsStats={postsStats} />
} 