import { useState, useEffect, useRef } from "react"
import { 
  User, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Briefcase, 
  Edit3, 
  Camera, 
  Settings as SettingsIcon,
  Award,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Plus,
  ChevronRight,
  Badge as BadgeIcon,
  Star,
  Trophy,
  Target,
  TrendingUp,
  Upload,
  X,
  Check,
  RotateCcw
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { cn } from "../../../lib/utils"
import { FollowedPagesList } from '../pages/FollowedPagesList'
import { useAppContext } from '../../../contexts/AppContext'
import { AvatarCropper } from './AvatarCropper'
import { EditProfile } from './EditProfile'
import { Settings as SettingsModal } from '../../common/Settings'
import { useUser } from '../../../contexts/UserContext'

// User data is now managed by UserContext

export function Profile() {
  const { followedPages, joinedGroups } = useAppContext()
  const { user, avatarImage, coverImage, updateAvatar, updateCoverImage, resetCoverImage } = useUser()
  const [isOwnProfile] = useState(true) // Mock: assuming this is user's own profile
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [realStats, setRealStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
    likes: 0
  })
  
  // Cover image states
  const [showCoverModal, setShowCoverModal] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Avatar states
  const [showAvatarCropper, setShowAvatarCropper] = useState(false)
  
  // Edit Profile & Settings states
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Images are now loaded automatically by UserContext

  // Calculate real stats from context and localStorage
  useEffect(() => {
    const calculateRealStats = () => {
      // Get user posts count
      const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
      
      // Get total likes from all posts
      let totalLikes = 0
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('post_') && key.includes('_likes')) {
          const likes = parseInt(localStorage.getItem(key) || '0')
          totalLikes += likes
        }
      })

      setRealStats({
        posts: userPosts.length,
        followers: followedPages.size, // Trang theo dõi từ context
        following: joinedGroups.size, // Nhóm theo dõi từ context
        likes: totalLikes
      })
    }

    calculateRealStats()
    
    // Update stats when context changes
    const interval = setInterval(calculateRealStats, 1000)
    return () => clearInterval(interval)
  }, [followedPages, joinedGroups])

  // Cover image functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Kích thước file quá lớn. Vui lòng chọn file dưới 5MB.')
        return
      }

      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const applyCoverImage = () => {
    if (uploadedImage) {
      updateCoverImage(uploadedImage)
      setShowCoverModal(false)
      setUploadedImage(null)
    }
  }

  const handleResetCoverImage = () => {
    resetCoverImage()
    setShowCoverModal(false)
    setUploadedImage(null)
  }

  const openFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Avatar functions
  const handleAvatarCropComplete = (croppedImage: string) => {
    updateAvatar(croppedImage)
    setShowAvatarCropper(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Cover Photo Actions */}
        {isOwnProfile && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCoverModal(true)}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Camera className="h-4 w-4 mr-2" />
            Thay đổi ảnh bìa
          </Button>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-20 relative z-10">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden shadow-2xl shadow-slate-200/50 backdrop-blur-sm bg-white/95 border-none">
          <CardContent className="p-0">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 border-6 border-white shadow-2xl">
                    <AvatarImage src={avatarImage} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-2xl">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isOwnProfile && (
                    <Button
                      size="sm"
                      onClick={() => setShowAvatarCropper(true)}
                      className="absolute bottom-2 right-2 rounded-full h-10 w-10 p-0 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{user.name}</h1>
                      {isOwnProfile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                          className="text-slate-600 hover:text-violet-600"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-lg text-slate-600 mb-1">{user.title}</p>
                    <p className="text-sm text-slate-500">{user.username}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{user.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{user.joinDate}</span>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed max-w-2xl">{user.bio}</p>

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {isOwnProfile ? (
                    <>
                      <Button 
                        onClick={() => setShowEditProfile(true)}
                        className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 shadow-lg"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Chỉnh sửa hồ sơ
                      </Button>
                      <Button 
                        onClick={() => setShowSettings(true)}
                        variant="outline"
                        className="flex-1 border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300"
                      >
                        <SettingsIcon className="h-4 w-4 mr-2" />
                        Cài đặt
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 shadow-lg">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Nhắn tin
                      </Button>
                      <Button variant="outline" className="border-violet-200 text-violet-600 hover:bg-violet-50">
                        <Plus className="h-4 w-4 mr-2" />
                        Theo dõi
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <Card className="overflow-hidden shadow-xl shadow-slate-200/50 backdrop-blur-sm bg-white/90 border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Bài viết</p>
                  <p className="text-3xl font-bold text-slate-900">{realStats.posts}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <BadgeIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-xl shadow-slate-200/50 backdrop-blur-sm bg-white/90 border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Trang theo dõi</p>
                  <p className="text-3xl font-bold text-slate-900">{realStats.followers.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-xl shadow-slate-200/50 backdrop-blur-sm bg-white/90 border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Nhóm theo dõi</p>
                  <p className="text-3xl font-bold text-slate-900">{realStats.following}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-xl shadow-slate-200/50 backdrop-blur-sm bg-white/90 border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Lượt thích</p>
                  <p className="text-3xl font-bold text-slate-900">{realStats.likes.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About & Skills */}
          <div className="space-y-6">
            {/* Badges */}
            <Card className="overflow-hidden shadow-xl shadow-slate-200/50 backdrop-blur-sm bg-white/90 border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-violet-600" />
                  Huy hiệu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {user.badges.map((badge) => {
                    // Fix: hardcode icons to avoid import issues
                    const getIconComponent = (badgeId: number) => {
                      switch (badgeId) {
                        case 1: return Users
                        case 2: return Award
                        case 3: return Trophy
                        case 4: return Star
                        default: return Award
                      }
                    }
                    const IconComponent = getIconComponent(badge.id)
                    
                    return (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-xl bg-gradient-to-br ${badge.color} text-white text-center relative overflow-hidden group hover:scale-105 transition-transform duration-200`}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <IconComponent className="h-6 w-6 mx-auto mb-2" />
                        <p className="text-xs font-medium">{badge.name}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="overflow-hidden shadow-xl shadow-slate-200/50 backdrop-blur-sm bg-white/90 border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-violet-600" />
                  Kỹ năng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 hover:from-violet-200 hover:to-indigo-200 border-none"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Posts & Activity */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-xl shadow-slate-200/50 backdrop-blur-sm bg-white/90 border-none">
              <CardContent className="p-0">
                <div className="w-full">
                  {/* Custom Tab Headers */}
                  <div className="w-full flex justify-start border-b bg-transparent p-0 h-auto">
                    <button
                      onClick={() => setActiveTab("posts")}
                      className={cn(
                        "px-6 py-4 rounded-none border-b-2 transition-colors",
                        activeTab === "posts" 
                          ? "border-violet-500 text-violet-600 bg-transparent" 
                          : "border-transparent text-slate-600 hover:text-violet-600"
                      )}
                    >
                      Bài viết
                    </button>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className={cn(
                        "px-6 py-4 rounded-none border-b-2 transition-colors",
                        activeTab === "activity" 
                          ? "border-violet-500 text-violet-600 bg-transparent" 
                          : "border-transparent text-slate-600 hover:text-violet-600"
                      )}
                    >
                      Hoạt động
                    </button>
                    <button
                      onClick={() => setActiveTab("media")}
                      className={cn(
                        "px-6 py-4 rounded-none border-b-2 transition-colors",
                        activeTab === "media" 
                          ? "border-violet-500 text-violet-600 bg-transparent" 
                          : "border-transparent text-slate-600 hover:text-violet-600"
                      )}
                    >
                      Ảnh & Video
                    </button>
                    <button
                      onClick={() => setActiveTab("pages")}
                      className={cn(
                        "px-6 py-4 rounded-none border-b-2 transition-colors",
                        activeTab === "pages" 
                          ? "border-violet-500 text-violet-600 bg-transparent" 
                          : "border-transparent text-slate-600 hover:text-violet-600"
                      )}
                    >
                      Trang đã theo dõi
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === "posts" && (
                    <div className="mt-0">
                    <div className="p-6 space-y-6">
                      {user.recentPosts.map((post) => (
                        <div key={post.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                          <div className="space-y-4">
                            <p className="text-slate-700 leading-relaxed">{post.content}</p>
                            
                            {post.image && (
                              <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden rounded-xl shadow-lg">
                                <img
                                  src={post.image}
                                  alt="Post image"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-slate-500">
                              <span>{post.timestamp}</span>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.comments}</span>
                                </div>
                                <Share2 className="h-4 w-4 cursor-pointer hover:text-violet-600 transition-colors" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}


                      </div>
                    </div>
                  )}

                  {activeTab === "activity" && (
                    <div className="mt-0">
                      <div className="p-6">
                        <div className="text-center py-12">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 mx-auto mb-4 flex items-center justify-center">
                            <TrendingUp className="h-8 w-8 text-violet-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 mb-2">Hoạt động gần đây</h3>
                          <p className="text-slate-500">Chức năng đang được phát triển...</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "media" && (
                    <div className="mt-0">
                      <div className="p-6">
                        <div className="text-center py-12">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 mx-auto mb-4 flex items-center justify-center">
                            <Camera className="h-8 w-8 text-violet-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 mb-2">Ảnh & Video</h3>
                          <p className="text-slate-500">Chức năng đang được phát triển...</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "pages" && (
                    <div className="mt-0">
                      <div className="p-6">
                        <FollowedPagesList />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cover Image Upload Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">Thay đổi ảnh bìa</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCoverModal(false)
                  setUploadedImage(null)
                }}
                className="rounded-full h-8 w-8 p-0 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Upload Area */}
              <div className="space-y-4">
                <div
                  onClick={openFileUpload}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 cursor-pointer group"
                >
                  {isUploading ? (
                    <div className="space-y-2">
                      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-sm text-slate-600">Đang tải lên...</p>
                    </div>
                  ) : uploadedImage ? (
                    <div className="space-y-3">
                      <div className="relative inline-block">
                        <img
                          src={uploadedImage}
                          alt="Preview"
                          className="h-32 w-48 object-cover rounded-lg shadow-md"
                        />
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-green-500 text-white rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-green-600 font-medium">Ảnh đã sẵn sàng!</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setUploadedImage(null)
                        }}
                        className="text-slate-600 hover:text-red-600 border-slate-300"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Chọn ảnh khác
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200">
                        <Upload className="h-6 w-6 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 mb-1">Chọn ảnh từ máy tính</p>
                        <p className="text-sm text-slate-500">PNG, JPG hoặc GIF (tối đa 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Preview Current */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Ảnh bìa hiện tại:</p>
                <div className="relative">
                  <img
                    src={coverImage}
                    alt="Current cover"
                    className="h-24 w-full object-cover rounded-lg border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <Button
                variant="outline"
                onClick={handleResetCoverImage}
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Khôi phục mặc định
              </Button>
              <Button
                onClick={applyCoverImage}
                disabled={!uploadedImage}
                className="flex-1 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4 mr-2" />
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Cropper */}
      <AvatarCropper
        isOpen={showAvatarCropper}
        onClose={() => setShowAvatarCropper(false)}
        onCropComplete={handleAvatarCropComplete}
      />

      {/* Edit Profile Modal */}
      <EditProfile
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
} 