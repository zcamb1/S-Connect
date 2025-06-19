import { useState, useEffect } from "react"
import { ArrowLeft, Search, Users, MessageSquare, Share2, Calendar, MapPin, Building2 } from "lucide-react"
import { Button } from "../../ui/button"
import { Card, CardContent } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { postsData } from '../posts/NewsFeed'

interface SearchResultsProps {
  searchQuery: string
  onBack: () => void
  onViewPost?: (id: number) => void
}

interface SearchResult {
  type: 'post' | 'user' | 'group'
  id: string | number
  title?: string
  content?: string
  author?: any
  stats?: any
  image?: string
  name?: string
  role?: string
  avatar?: string
  members?: number
  description?: string
  category?: string
}

// Fake users data for search
const usersData = [
  {
    id: 'user1',
    name: 'Nguyễn Văn A',
    role: 'Software Engineer',
    department: 'IT Department',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
    email: 'nguyenvana@srv.com.vn'
  },
  {
    id: 'user2', 
    name: 'Trần Thị B',
    role: 'Product Manager',
    department: 'Product Team',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b388?w=40&h=40&fit=crop',
    email: 'tranthib@srv.com.vn'
  },
  {
    id: 'user3',
    name: 'Lê Văn C',
    role: 'UI/UX Designer', 
    department: 'Design Team',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
    email: 'levanc@srv.com.vn'
  },
  {
    id: 'user4',
    name: 'Phạm Thị D',
    role: 'HR Manager',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop', 
    email: 'phamthid@srv.com.vn'
  },
  {
    id: 'user5',
    name: 'Hoàng Văn E',
    role: 'DevOps Engineer',
    department: 'Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop',
    email: 'hoangvane@srv.com.vn'
  }
]

// Fake groups data for search
const groupsData = [
  {
    id: 'group1',
    name: 'Thảo luận Công nghệ',
    description: 'Chia sẻ kiến thức về công nghệ, lập trình và AI',
    category: 'Technology',
    members: 142,
    avatar: '💻',
    isPublic: true
  },
  {
    id: 'group2',
    name: 'Team Building SRV',
    description: 'Tổ chức các hoạt động team building và sự kiện công ty',
    category: 'Events',
    members: 89,
    avatar: '🎉',
    isPublic: true
  },
  {
    id: 'group3',
    name: 'Đào tạo & Phát triển',
    description: 'Khóa học, workshop và các chương trình đào tạo',
    category: 'Education',
    members: 67,
    avatar: '📚',
    isPublic: false
  },
  {
    id: 'group4',
    name: 'Dự án Olympic 2025',
    description: 'Thảo luận và cập nhật về dự án Olympic SRV 2025',
    category: 'Projects',
    members: 34,
    avatar: '🏆',
    isPublic: true
  }
]

export function SearchResults({ searchQuery, onBack, onViewPost }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'users' | 'groups'>('all')

  useEffect(() => {
    const searchData = () => {
      setLoading(true)
      
      const query = searchQuery.toLowerCase()
      const searchResults: SearchResult[] = []

      // Search in posts
      postsData.forEach(post => {
        if (
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.author.name.toLowerCase().includes(query)
        ) {
          searchResults.push({
            type: 'post',
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.author,
            stats: post.stats,
            image: post.image?.src
          })
        }
      })

      // Search in users
      usersData.forEach(user => {
        if (
          user.name.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query) ||
          user.department.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        ) {
          searchResults.push({
            type: 'user',
            id: user.id,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            description: `${user.role} - ${user.department}`
          })
        }
      })

      // Search in groups
      groupsData.forEach(group => {
        if (
          group.name.toLowerCase().includes(query) ||
          group.description.toLowerCase().includes(query) ||
          group.category.toLowerCase().includes(query)
        ) {
          searchResults.push({
            type: 'group',
            id: group.id,
            name: group.name,
            description: group.description,
            category: group.category,
            members: group.members,
            avatar: group.avatar
          })
        }
      })

      setResults(searchResults)
      setLoading(false)
    }

    if (searchQuery.trim()) {
      searchData()
    } else {
      setResults([])
      setLoading(false)
    }
  }, [searchQuery])

  const getFilteredResults = () => {
    if (activeTab === 'all') return results
    return results.filter(result => result.type === activeTab.slice(0, -1))
  }

  const getTabCount = (type: string) => {
    if (type === 'all') return results.length
    return results.filter(result => result.type === type.slice(0, -1)).length
  }

  const renderPostResult = (result: SearchResult) => (
    <Card key={`post-${result.id}`} className="mb-4 overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt={result.author?.name} />
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              {result.author?.fallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-slate-900">{result.author?.name}</span>
              <Badge variant="secondary" className="text-xs">
                {result.author?.role}
              </Badge>
            </div>
            {result.title && (
              <h3 className="text-xl font-bold text-slate-900 mb-2">{result.title}</h3>
            )}
            <p className="text-slate-700 text-sm mb-4 line-clamp-2">{result.content}</p>
                                      {result.image && (
               <img 
                 src={result.image} 
                 alt="Post preview" 
                 className="w-full h-80 object-cover rounded-lg mb-4"
               />
             )}
             
             {/* Show more content if available */}
             {result.title && result.content && result.content.length > 150 && (
               <p className="text-slate-600 text-sm mb-4 line-clamp-4">
                 {result.content.slice(150, 400)}...
               </p>
             )}
             
             <div className="flex items-center gap-6 text-sm text-slate-500">
               <span className="flex items-center gap-1">
                 <MessageSquare className="h-4 w-4" />
                 {result.stats?.likes || 0}
               </span>
               <span className="flex items-center gap-1">
                 <MessageSquare className="h-4 w-4" />
                 {result.stats?.comments || 0}
               </span>
               <span className="flex items-center gap-1">
                 <Share2 className="h-4 w-4" />
                 {result.stats?.shares || 0}
               </span>
               <Button 
                 variant="outline" 
                 size="sm"
                 onClick={() => onViewPost?.(result.id as number)}
                 className="ml-auto"
               >
                 Xem bài viết
               </Button>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderUserResult = (result: SearchResult) => (
    <Card key={`user-${result.id}`} className="mb-4 overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={result.avatar} alt={result.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-lg">
              {result.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">{result.name}</h3>
            <p className="text-slate-600">{result.description}</p>
          </div>
          <Button variant="outline" size="sm">
            Xem hồ sơ
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderGroupResult = (result: SearchResult) => (
    <Card key={`group-${result.id}`} className="mb-4 overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl">
            {result.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-slate-900">{result.name}</h3>
              <Badge variant="outline" className="text-xs">
                {result.category}
              </Badge>
            </div>
            <p className="text-slate-600 text-sm mb-2">{result.description}</p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Users className="h-4 w-4" />
              <span>{result.members} thành viên</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Tham gia
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-slate-400" />
            <span className="text-lg text-slate-600">Đang tìm kiếm "{searchQuery}"...</span>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-slate-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const filteredResults = getFilteredResults()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-slate-400" />
          <span className="text-lg text-slate-600">
            Kết quả tìm kiếm cho "{searchQuery}" ({results.length} kết quả)
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 bg-slate-100 rounded-xl p-1">
        {['all', 'posts', 'users', 'groups'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab === 'all' ? 'Tất cả' : 
             tab === 'posts' ? 'Bài viết' :
             tab === 'users' ? 'Người dùng' : 'Nhóm'} 
            <span className="ml-1 text-xs">({getTabCount(tab)})</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-8">
        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-slate-500">
              Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả
            </p>
          </div>
        ) : (
          filteredResults.map((result) => {
            switch (result.type) {
              case 'post':
                return renderPostResult(result)
              case 'user':
                return renderUserResult(result)
              case 'group':
                return renderGroupResult(result)
              default:
                return null
            }
          })
        )}
      </div>
    </div>
  )
} 