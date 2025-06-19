import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  Heart, 
  Share2, 
  Image as ImageIcon,
  Video,
  Send,
  Smile,
  MoreHorizontal,
  Settings,
  Bell,
  BellOff
} from 'lucide-react'

interface GroupDetailProps {
  groupId: string
}

// Fake data for group
const groupData = {
  id: "tech-discussion",
  name: "💻 Thảo luận Công nghệ",
  description: "Nhóm thảo luận về công nghệ mới, lập trình và xu hướng phát triển",
  avatar: "💻",
  cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop",
  members: 142,
  posts: 89,
  isJoined: true,
  isNotificationOn: true,
  category: "Công nghệ"
}

const groupPosts = [
  {
    id: 1,
    user: {
      name: "Nguyễn Minh Tuấn",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      role: "Admin"
    },
    content: "Các bạn có thể chia sẻ về framework JavaScript yêu thích không? Mình đang tìm hiểu về Next.js và muốn nghe opinion từ mọi người 🚀",
    timestamp: "2 giờ trước",
    likes: 12,
    comments: 8,
    shares: 3,
    isLiked: false
  },
  {
    id: 2,
    user: {
      name: "Trần Thị Mai",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b388?w=40&h=40&fit=crop&crop=face",
      role: "Moderator"
    },
    content: "📚 Vừa hoàn thành khóa học về Docker và Kubernetes. Ai có kinh nghiệm deploy microservices thì chia sẻ tips với mình nhé!",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500&h=300&fit=crop",
    timestamp: "5 giờ trước",
    likes: 18,
    comments: 15,
    shares: 7,
    isLiked: true
  },
  {
    id: 3,
    user: {
      name: "Lê Văn Hùng",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",  
      role: "Member"
    },
    content: "AI và Machine Learning đang thay đổi ngành công nghệ như thế nào? Mình thấy ChatGPT và các tool AI khác đang rất hot. Các bạn nghĩ sao về tương lai của dev?",
    timestamp: "1 ngày trước",
    likes: 25,
    comments: 22,
    shares: 11,
    isLiked: false
  }
]

const groupEvents = [
  {
    id: 1,
    title: "Workshop: React Advanced Patterns",
    date: "2024-01-20",
    time: "14:00",
    attendees: 23,
    maxAttendees: 30
  },
  {
    id: 2,
    title: "Tech Talk: AI in Web Development", 
    date: "2024-01-25",
    time: "19:00",
    attendees: 45,
    maxAttendees: 50
  }
]

export function GroupDetail({ groupId }: GroupDetailProps) {
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem(`group-${groupId}-posts`)
    return savedPosts ? JSON.parse(savedPosts) : groupPosts
  })
  const [isNotificationOn, setIsNotificationOn] = useState(groupData.isNotificationOn)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showPostMenu, setShowPostMenu] = useState<number | null>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPostMenu(null)
    }
    
    if (showPostMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showPostMenu])

  const handleLike = (postId: number) => {
    const updatedPosts = posts.map((post: any) => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    )
    setPosts(updatedPosts)
    localStorage.setItem(`group-${groupId}-posts`, JSON.stringify(updatedPosts))
  }

  const handleDeletePost = (postId: number) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      const updatedPosts = posts.filter((post: any) => post.id !== postId)
      setPosts(updatedPosts)
      localStorage.setItem(`group-${groupId}-posts`, JSON.stringify(updatedPosts))
      alert('🗑️ Đã xóa bài viết!')
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addEmoji = (emoji: string) => {
    setNewPost(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleNotificationToggle = () => {
    setIsNotificationOn(!isNotificationOn)
    // Show notification
    if (isNotificationOn) {
      alert('🔕 Đã tắt thông báo cho nhóm này')
    } else {
      alert('🔔 Đã bật thông báo cho nhóm này')
    }
  }

  const handlePostSubmit = () => {
    if (newPost.trim() || selectedImage) {
      const newPostObj = {
        id: Date.now(), // Use timestamp for unique ID
        user: {
          name: "Bạn",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
          role: "Member" as const
        },
        content: newPost,
        image: selectedImage || undefined,
        timestamp: "Vừa xong",
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false
      }
      const updatedPosts = [newPostObj, ...posts]
      setPosts(updatedPosts)
      localStorage.setItem(`group-${groupId}-posts`, JSON.stringify(updatedPosts))
      setNewPost('')
      setSelectedImage(null)
      
      // Success notification
      alert('✅ Đã đăng bài và lưu thành công!')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Group Header */}
      <Card className="overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <img 
            src={groupData.cover} 
            alt="Group cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 -mt-16 relative">
            <div className="w-24 h-24 rounded-xl bg-white p-2 shadow-lg">
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl">
                {groupData.avatar}
              </div>
            </div>
            <div className="flex-1 mt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{groupData.name}</h1>
                  <p className="text-slate-600 mt-1">{groupData.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {groupData.members} thành viên
                    </span>
                    <span>{groupData.posts} bài viết</span>
                    <Badge variant="secondary">{groupData.category}</Badge>
                  </div>
                </div>
                                 <div className="flex gap-2">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={handleNotificationToggle}
                   >
                     {isNotificationOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                   </Button>
                 </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                                     <textarea
                     value={newPost}
                     onChange={(e) => setNewPost(e.target.value)}
                     placeholder="Chia sẻ suy nghĩ của bạn với nhóm..."
                     className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                     rows={3}
                   />
                   
                   {/* Image Preview */}
                   {selectedImage && (
                     <div className="mt-3 relative">
                       <img src={selectedImage} alt="Selected" className="max-w-md rounded-lg" />
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => setSelectedImage(null)}
                         className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                       >
                         ✕
                       </Button>
                     </div>
                   )}

                   {/* Emoji Picker */}
                   {showEmojiPicker && (
                     <div className="mt-2 p-3 border border-slate-200 rounded-lg bg-white shadow-lg">
                       <div className="grid grid-cols-8 gap-2">
                         {['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '❤️', '🔥', '💯', '🎉', '👏', '🚀', '💪', '🙏', '👌'].map(emoji => (
                           <button
                             key={emoji}
                             onClick={() => addEmoji(emoji)}
                             className="text-lg hover:bg-slate-100 rounded p-1 transition-colors"
                           >
                             {emoji}
                           </button>
                         ))}
                       </div>
                     </div>
                   )}

                   <div className="flex items-center justify-between mt-3">
                     <div className="flex gap-2">
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handleImageUpload}
                         className="hidden"
                         id="image-upload"
                       />
                       <label htmlFor="image-upload">
                         <Button variant="ghost" size="sm" type="button" asChild>
                           <span>
                             <ImageIcon className="w-4 h-4" />
                           </span>
                         </Button>
                       </label>
                       <Button 
                         variant="ghost" 
                         size="sm"
                         onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                       >
                         <Smile className="w-4 h-4" />
                       </Button>
                     </div>
                     <Button onClick={handlePostSubmit} disabled={!newPost.trim() && !selectedImage}>
                       <Send className="w-4 h-4 mr-2" />
                       Đăng
                     </Button>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          {posts.map((post: any) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{post.user.name}</span>
                      <Badge variant={post.user.role === 'Admin' ? 'default' : post.user.role === 'Moderator' ? 'secondary' : 'outline'} className="text-xs">
                        {post.user.role}
                      </Badge>
                      <span className="text-sm text-slate-500">{post.timestamp}</span>
                    </div>
                    <p className="mt-2 text-slate-700">{post.content}</p>
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Post image" 
                        className="mt-3 rounded-lg w-full max-w-md"
                      />
                    )}
                    <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={post.isLiked ? 'text-red-500' : ''}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </Button>
                                             <Button variant="ghost" size="sm">
                         <Share2 className="w-4 h-4 mr-1" />
                         {post.shares}
                       </Button>
                       <div className="ml-auto relative">
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           onClick={(e) => {
                             e.stopPropagation()
                             setShowPostMenu(showPostMenu === post.id ? null : post.id)
                           }}
                         >
                           <MoreHorizontal className="w-4 h-4" />
                         </Button>
                         {showPostMenu === post.id && (
                           <div className="fixed bg-white border border-slate-200 rounded-lg shadow-xl z-50 min-w-[120px] p-1" 
                                style={{
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)'
                                }}>
                             {post.user.name === "Bạn" && (
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation()
                                   handleDeletePost(post.id)
                                   setShowPostMenu(null)
                                 }}
                                 className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 text-sm rounded flex items-center gap-2"
                               >
                                 🗑️ Xóa bài viết
                               </button>
                             )}
                             <button
                               onClick={(e) => {
                                 e.stopPropagation()
                                 setShowPostMenu(null)
                               }}
                               className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 text-sm rounded"
                             >
                               📎 Sao chép liên kết
                             </button>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation()
                                 setShowPostMenu(null)
                               }}
                               className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 text-sm rounded"
                             >
                               🚨 Báo cáo
                             </button>
                           </div>
                         )}
                       </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Về nhóm này</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">{groupData.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Riêng tư</span>
                  <span className="font-medium">Nhóm công khai</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hiển thị</span>
                  <span className="font-medium">Ai cũng có thể xem</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lịch sử</span>
                  <span className="font-medium">Được tạo 3 tháng trước</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Sự kiện sắp tới
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {groupEvents.map((event) => (
                <div key={event.id} className="p-3 border border-slate-200 rounded-lg">
                  <h4 className="font-medium text-slate-900">{event.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {event.date} lúc {event.time}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {event.attendees}/{event.maxAttendees} người tham gia
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thành viên gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Nguyễn Minh Tuấn", role: "Admin", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
                  { name: "Trần Thị Mai", role: "Moderator", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b388?w=40&h=40&fit=crop&crop=face" },
                  { name: "Lê Văn Hùng", role: "Member", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" }
                ].map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 