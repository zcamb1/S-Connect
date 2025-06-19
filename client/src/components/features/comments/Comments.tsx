import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Button } from "../../ui/button"
import { Textarea } from "../../ui/textarea"
import { Heart, MessageCircle, Share2, Send, Image, Smile, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { cn } from "../../../lib/utils"
import { emojiCategories } from '../../data/emojiData'
import { ImageViewer } from '../../common/ImageViewer'
import { useUser } from '../../../contexts/UserContext'

interface CommentsProps {
  postId: number
  className?: string
  // onCommentCountChange no longer used - comment count managed by parent
  onCommentCountChange?: (count: number) => void
}

export function Comments({ postId, className, onCommentCountChange }: CommentsProps) {
  const { user, avatarImage } = useUser()
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [recentCommentIds, setRecentCommentIds] = useState<Set<number>>(new Set())
  const [isCommentFocused, setIsCommentFocused] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [replyingTo, setReplyingTo] = useState<{rootId: number, parentId: number} | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())
  const [likingComments, setLikingComments] = useState<Set<number>>(new Set())
  const [replyImage, setReplyImage] = useState<File | null>(null)
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null)
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false)
  
  // Refs for file inputs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replyFileInputRef = useRef<HTMLInputElement>(null)

  // Helper function to calculate total reply count for a comment (flat structure)
  const calculateTotalReplies = (commentId: number): number => {
    return comments.filter(c => c.rootCommentId === commentId).length
  }

  // Helper function to get reply target name
  const getReplyTargetName = (parentCommentId: number): string => {
    const parentComment = comments.find(c => c.id === parentCommentId)
    return parentComment?.author?.name || ''
  }

  // File input trigger functions
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const triggerReplyFileInput = () => {
    replyFileInputRef.current?.click()
  }

  // Migration function to add userId to old comments (one-time migration)
  const migrateUserComments = (comments: any[]) => {
    let hasChanges = false
    
    const migratedComments = comments.map(comment => {
      // If comment doesn't have userId but has placeholder avatar or is from current user, add userId
      if (!comment.author.userId) {
        const hasPlaceholderAvatar = comment.author.avatar?.includes('placeholder.svg')
        const isLikelyUserComment = comment.author.name === "Bạn" || hasPlaceholderAvatar
        
        if (isLikelyUserComment) {
          hasChanges = true
          return {
            ...comment,
            author: {
              ...comment.author,
              userId: user.userId, // Add userId to identify as user's comment
              name: user.name,     // Update to current name  
              fallback: user.name.charAt(0).toUpperCase(),
              avatar: avatarImage,
              role: user.title
            }
          }
        }
      }
      return comment
    })
    
    // Save back to localStorage if there were changes
    if (hasChanges) {
      localStorage.setItem(`comments_${postId}`, JSON.stringify(migratedComments))
    }
    
    return migratedComments
  }

  // Load comments from database via API
  useEffect(() => {
    const loadComments = async () => {
      try {
        // Fetch comments from database API
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('No auth token found')
          return
        }

        const response = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('📥 Loaded comments from database:', data)
          
          // API returns grouped format, need to flatten it
          const flatComments: any[] = []
          data.forEach((group: any) => {
            // Add root comment
            flatComments.push({
              ...group,
              replies: undefined // Remove replies field to avoid confusion
            })
            
            // Add all replies
            if (group.replies && group.replies.length > 0) {
              group.replies.forEach((reply: any) => {
                flatComments.push(reply)
              })
            }
          })
          
          console.log('📥 Flattened comments:', flatComments)
          
          // Transform database format to component format
          const transformedComments = flatComments.map((comment: any) => {
            const imageUrl = comment.image_url ? `http://localhost:3001${comment.image_url}` : null;
            console.log(`🖼️ Initial Load - Comment ${comment.id} - Raw image_url:`, comment.image_url, '-> Full URL:', imageUrl);
            
            return {
              id: comment.id,
              author: {
                userId: comment.author_id,
                name: comment.author_name || comment.full_name,
                fallback: (comment.author_name || comment.full_name)?.charAt(0)?.toUpperCase() || "?",
                avatar: comment.avatar || "/placeholder.svg?height=40&width=40",
                role: comment.role || "Nhân viên"
              },
              content: comment.content_with_mentions || comment.content,
              image: imageUrl,
              timestamp: formatTimestamp(comment.created_at, comment.id),
              likes: 0, // Will be loaded separately
              reactions: [],
              rootCommentId: comment.root_comment_id,
              parentCommentId: comment.parent_comment_id,
              isHidden: false
            };
          })
          
          setComments(transformedComments)
          // Comment count now managed by parent component via API
      } else {
          console.error('Failed to load comments:', response.statusText)
          // Fallback to sample data if API fails
          loadSampleComments()
        }
      } catch (error) {
        console.error('Error loading comments:', error)
        // Fallback to sample data if API fails
        loadSampleComments()
      }
    }

    const loadSampleComments = () => {
        const sampleComments = [
          {
            id: 1,
            author: {
            userId: 1,  
              name: "Mai Tiến Dũng",
              fallback: "M",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "Developer"
            },
            content: "Dự án này cần làm lại phần phân quyền.",
            timestamp: "2 giờ trước",
            likes: 5,
            reactions: [],
            rootCommentId: null,
            parentCommentId: null
          },
          {
            id: 2,
            author: {
            userId: 2,
              name: "Mai Thị Thảo",
              fallback: "T",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "Designer"
            },
            content: "@mai.tien.dung cảm ơn bạn đã góp ý!",
            timestamp: "1 giờ trước",
            likes: 2,
            reactions: [],
            rootCommentId: 1,
            parentCommentId: 1
          },
          {
            id: 3,
            author: {
            userId: 3,
              name: "Nguyễn Thị Nam",
              fallback: "N",
              avatar: "/placeholder.svg?height=40&width=40",
              role: "Tester"
            },
            content: "@mai.thi.thao được đó!",
            timestamp: "30 phút trước",
            likes: 1,
            reactions: [],
            rootCommentId: 1,
            parentCommentId: 2
          }
        ]
        
        setComments(sampleComments)
        // Comment count managed by parent component
    }

    // Load liked comments from localStorage (can be moved to API later)
    const loadLikedComments = () => {
      const likedSet = new Set<number>()
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('comment_') && key.endsWith('_liked')) {
          const isLiked = localStorage.getItem(key) === 'true'
          if (isLiked) {
            const commentId = parseInt(key.replace('comment_', '').replace('_liked', ''))
            if (!isNaN(commentId)) {
              likedSet.add(commentId)
            }
          }
        }
      })
      setLikedComments(likedSet)
    }
    
    loadComments()
    loadLikedComments()
  }, [postId, onCommentCountChange])

  // Helper function to format timestamp
  const formatTimestamp = (dateString: string, commentId?: number) => {
    // If this is a recent comment (just posted), show "vừa xong"
    if (commentId && recentCommentIds.has(commentId)) {
      return "vừa xong"
    }
    
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return "vừa xong"
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} ngày trước`
    }
  }

  // Run migration when user avatar changes (without reloading all comments)
  useEffect(() => {
    if (comments.length > 0) {
      const migratedComments = migrateUserComments(comments)
      if (JSON.stringify(migratedComments) !== JSON.stringify(comments)) {
        setComments(migratedComments)
      }
    }
  }, [avatarImage, user.name])

  // TEMPORARILY DISABLED to fix loop - comment count managed by parent only
  // useEffect(() => {
  //     if (onCommentCountChange) {
  //       const totalComments = comments.filter(c => !c.isHidden)
  //       onCommentCountChange(totalComments.length)
  //       console.log('📊 Comments reported total count:', totalComments.length)
  //     }
  // }, [comments])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log("File selected:", file)
    
    if (!file) {
      console.warn("No file selected")
      return
    }
    
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEmojiClick = (emoji: string) => {
    setNewComment(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() && !selectedImage) return

    setIsLoading(true)

    try {
      // Submit comment to database via API
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No auth token found')
        return
      }

      // Use FormData to handle both text and file uploads
      const formData = new FormData()
      formData.append('content', newComment)
      formData.append('parent_comment_id', '')
      formData.append('root_comment_id', '')
      
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const response = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it for FormData
        },
        body: formData
      })

      if (response.ok) {
        const newCommentData = await response.json()
        console.log('✅ Comment saved successfully!', newCommentData)
        
        // Mark this comment as recent for "vừa xong" display
        setRecentCommentIds(prev => new Set([...Array.from(prev), newCommentData.id]))
        
        // Clear input immediately for better UX
      setNewComment("")
      setSelectedImage(null)
      setImagePreview(null)
      setIsCommentFocused(false)
        
        // Add small delay to ensure database transaction is committed
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Reload all comments from database to ensure consistency
        const token = localStorage.getItem('token')
        const reloadResponse = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (reloadResponse.ok) {
          const reloadData = await reloadResponse.json()
          
          // API returns grouped format, need to flatten it
          const flatComments: any[] = []
          reloadData.forEach((group: any) => {
            // Add root comment
            flatComments.push({
              ...group,
              replies: undefined // Remove replies field to avoid confusion
            })
            
            // Add all replies
            if (group.replies && group.replies.length > 0) {
              group.replies.forEach((reply: any) => {
                flatComments.push(reply)
              })
            }
          })
          
          const transformedComments = flatComments.map((comment: any) => ({
            id: comment.id,
            author: {
              userId: comment.author_id,
              name: comment.author_name || comment.full_name,
              fallback: (comment.author_name || comment.full_name)?.charAt(0)?.toUpperCase() || "?",
              avatar: comment.avatar || "/placeholder.svg?height=40&width=40",
              role: comment.role || "Nhân viên"
            },
            content: comment.content_with_mentions || comment.content,
            image: comment.image_url ? `http://localhost:3001${comment.image_url}` : null,
            timestamp: formatTimestamp(comment.created_at),
            likes: 0,
            reactions: [],
            rootCommentId: comment.root_comment_id,
            parentCommentId: comment.parent_comment_id,
            isHidden: false
          }))
          
          setComments(transformedComments)
          const rootComments = transformedComments.filter((c: any) => !c.rootCommentId && !c.isHidden)
          onCommentCountChange?.(rootComments.length)
        }
      
      // Show success feedback
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      } else {
        const errorData = await response.json()
        console.error('Failed to save comment:', errorData)
        throw new Error(errorData.error || 'Failed to save comment')
      }
    } catch (error) {
      console.error('Failed to save comment:', error)
      // Show error feedback
      alert('Không thể lưu bình luận. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLikeComment = async (commentId: number) => {
    // Prevent spam clicking
    if (likingComments.has(commentId)) {
      return
    }
    
    // Add to liking set
    setLikingComments(prev => new Set([...Array.from(prev), commentId]))
    
    const wasLiked = likedComments.has(commentId)
    const newIsLiked = !wasLiked
    
    try {
      // Optimistic update
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          const newLikes = newIsLiked 
            ? (comment.likes || 0) + 1 
            : Math.max((comment.likes || 0) - 1, 0)
          return { ...comment, likes: newLikes }
        }
        return comment
      })
      
      setComments(updatedComments)
      
      // Update liked state
      if (newIsLiked) {
        setLikedComments(prev => new Set([...Array.from(prev), commentId]))
      } else {
        setLikedComments(prev => {
          const newSet = new Set(prev)
          newSet.delete(commentId)
          return newSet
        })
      }
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Save to localStorage
      const likeKey = `comment_${commentId}_liked`
      localStorage.setItem(likeKey, newIsLiked.toString())
      
    } catch (error) {
      console.error('❌ Failed to like comment:', error)
    } finally {
      // Remove from liking set
      setLikingComments(prev => {
        const newSet = new Set(prev)
        newSet.delete(commentId)
        return newSet
      })
    }
  }

  // Handle reply to comment (flat structure)
  const handleReply = (commentId: number) => {
    const targetComment = comments.find(c => c.id === commentId)
    if (targetComment) {
      // If replying to root comment
      if (!targetComment.rootCommentId) {
        setReplyingTo({ rootId: commentId, parentId: commentId })
      } else {
        // If replying to a reply, use its root and set this as parent
        setReplyingTo({ rootId: targetComment.rootCommentId, parentId: commentId })
      }
    }
    // Auto close emoji pickers when starting to reply
    setShowEmojiPicker(false)
    setShowReplyEmojiPicker(false)
  }

  const handleReplyImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log("Reply file selected:", file)
    
    if (!file) {
      console.warn("No reply file selected")
      return
    }
    
    if (file) {
      setReplyImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setReplyImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReplyEmojiClick = (emoji: string) => {
    setReplyContent(prev => prev + emoji)
    setShowReplyEmojiPicker(false)
  }

  const handleSubmitReply = async () => {
    if (!replyContent.trim() && !replyImage) {
      return
    }

    if (!replyingTo) {
      return
    }

    setIsLoading(true)

    try {
      // Submit reply to database via API
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No auth token found')
        return
      }

      // Use FormData to handle both text and file uploads
      const formData = new FormData()
      formData.append('content', replyContent)
      formData.append('root_comment_id', replyingTo.rootId.toString())
      formData.append('parent_comment_id', replyingTo.parentId.toString())
      
      if (replyImage) {
        formData.append('image', replyImage)
      }

      const response = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it for FormData
        },
        body: formData
      })

      if (response.ok) {
        const newReplyData = await response.json()
        console.log('✅ Reply saved successfully!', newReplyData)
        
        // Mark this reply as recent for "vừa xong" display
        setRecentCommentIds(prev => new Set([...Array.from(prev), newReplyData.id]))
        
        // Clear input immediately for better UX
      setReplyContent("")
      setReplyingTo(null)
      setReplyImage(null)
      setReplyImagePreview(null)
        
        // Add small delay to ensure database transaction is committed
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Reload all comments from database to ensure consistency
        const token = localStorage.getItem('token')
        const reloadUrl = `http://localhost:3001/api/posts/${postId}/comments`
        console.log('🔄 Reloading from URL:', reloadUrl)
        const reloadResponse = await fetch(reloadUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (reloadResponse.ok) {
          const reloadData = await reloadResponse.json()
          console.log('🔄 Reloaded data after reply:', reloadData)
          
          // API returns grouped format, need to flatten it
          const flatComments: any[] = []
          reloadData.forEach((group: any) => {
            // Add root comment
            flatComments.push({
              ...group,
              replies: undefined // Remove replies field to avoid confusion
            })
            
            // Add all replies
            if (group.replies && group.replies.length > 0) {
              group.replies.forEach((reply: any) => {
                flatComments.push(reply)
              })
            }
          })
          
          console.log('🔄 Flattened comments:', flatComments)
          console.log('🔄 Max comment ID in flattened data:', Math.max(...flatComments.map((c: any) => c.id)))
          
          const transformedComments = flatComments.map((comment: any) => {
            const imageUrl = comment.image_url ? `http://localhost:3001${comment.image_url}` : null;
            console.log(`🖼️ After Reply - Comment ${comment.id} - Raw image_url:`, comment.image_url, '-> Full URL:', imageUrl);
            
            return {
              id: comment.id,
              author: {
                userId: comment.author_id,
                name: comment.author_name || comment.full_name,
                fallback: (comment.author_name || comment.full_name)?.charAt(0)?.toUpperCase() || "?",
                avatar: comment.avatar || "/placeholder.svg?height=40&width=40",
                role: comment.role || "Nhân viên"
              },
              content: comment.content_with_mentions || comment.content,
              image: imageUrl,
              timestamp: formatTimestamp(comment.created_at, comment.id),
              likes: 0,
              reactions: [],
              rootCommentId: comment.root_comment_id,
              parentCommentId: comment.parent_comment_id,
              isHidden: false
            };
          })
          
          console.log('🔄 Transformed comments after reply:', transformedComments)
          
          // Debug each comment's rootCommentId  
          transformedComments.forEach((c: any) => {
            if (c.id >= 33) { // Check for recent comments
              console.log('🐛 Recent comment debug:', c.id, 'rootCommentId:', c.rootCommentId, 'parentCommentId:', c.parentCommentId)
            }
          })
          
          const replies = transformedComments.filter((c: any) => c.rootCommentId)
          console.log('🔄 Replies found:', replies)
          console.log('🔄 Total replies count:', replies.length)
          setComments(transformedComments)
          const rootComments = transformedComments.filter((c: any) => !c.rootCommentId && !c.isHidden)
          onCommentCountChange?.(rootComments.length)
        }

      // Show success feedback
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      } else {
        const errorData = await response.json()
        console.error('Failed to save reply:', errorData)
        throw new Error(errorData.error || 'Failed to save reply')
      }
    } catch (error) {
      console.error('❌ Failed to save reply:', error)
      // Show error feedback
      alert('Không thể lưu phản hồi. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle hide comment
  const handleHideComment = (commentId: number) => {
    const updatedComments = comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, isHidden: true }
        : comment
    )
    setComments(updatedComments)
  }

  // Handle delete comment (only for own comments)
  const handleDeleteComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No auth token found')
        return
      }

      const response = await fetch(`http://localhost:3001/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        console.log('✅ Comment deleted successfully!')
        
        // Reload all comments from database to ensure consistency
        const reloadResponse = await fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (reloadResponse.ok) {
          const reloadData = await reloadResponse.json()
          
          // API returns grouped format, need to flatten it
          const flatComments: any[] = []
          reloadData.forEach((group: any) => {
            // Add root comment
            flatComments.push({
              ...group,
              replies: undefined // Remove replies field to avoid confusion
            })
            
            // Add all replies
            if (group.replies && group.replies.length > 0) {
              group.replies.forEach((reply: any) => {
                flatComments.push(reply)
              })
            }
          })
          
          const transformedComments = flatComments.map((comment: any) => ({
            id: comment.id,
            author: {
              userId: comment.author_id,
              name: comment.author_name || comment.full_name,
              fallback: (comment.author_name || comment.full_name)?.charAt(0)?.toUpperCase() || "?",
              avatar: comment.avatar || "/placeholder.svg?height=40&width=40",
              role: comment.role || "Nhân viên"
            },
            content: comment.content_with_mentions || comment.content,
            image: comment.image_url ? `http://localhost:3001${comment.image_url}` : null,
            timestamp: formatTimestamp(comment.created_at),
            likes: 0,
            reactions: [],
            rootCommentId: comment.root_comment_id,
            parentCommentId: comment.parent_comment_id,
            isHidden: false
          }))
          
          setComments(transformedComments)
          const rootComments = transformedComments.filter((c: any) => !c.rootCommentId && !c.isHidden)
          onCommentCountChange?.(rootComments.length)
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to delete comment:', errorData)
        alert('Không thể xóa bình luận. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('❌ Failed to delete comment:', error)
      alert('Không thể xóa bình luận. Vui lòng thử lại.')
    }
  }

  // Get root comments and their replies
  const rootComments = comments.filter(c => !c.rootCommentId && !c.isHidden)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Success toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2">
          ✅ Bình luận đã được lưu!
        </div>
      )}

      {/* Comment input */}
      <div className="flex gap-3">
        <Avatar className={cn(
          "h-10 w-10 transition-all duration-300",
          isCommentFocused
            ? "border-2 border-white ring-2 ring-violet-100 shadow-lg shadow-violet-500/10"
            : "border border-slate-200"
        )}>
          <AvatarImage src={avatarImage} alt="Your avatar" />
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className={cn(
            "flex rounded-2xl border bg-slate-50 transition-all duration-300",
            isCommentFocused
              ? "ring-2 ring-violet-100 shadow-lg shadow-violet-500/10 border-violet-200"
              : "border-slate-200 shadow-sm"
          )}>
            <Textarea
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setIsCommentFocused(true)}
              className="min-h-[48px] flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 text-slate-700 placeholder:text-slate-400 py-3 px-4 rounded-l-2xl rounded-r-none"
            />
            
            {/* Action buttons */}
            <div className="flex items-end p-2 gap-1">
              {/* Emoji picker */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="h-8 w-8 p-0 hover:bg-violet-50 text-slate-500"
                >
                  <Smile className="h-4 w-4" />
                </Button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-10 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 w-64 max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {Object.entries(emojiCategories).map(([category, emojis]) => (
                        <div key={category}>
                          <p className="text-xs font-medium text-slate-500 mb-1 capitalize">{category}</p>
                          <div className="grid grid-cols-8 gap-1">
                            {emojis.map((emoji: string) => (
                              <button
                                key={emoji}
                                onClick={() => handleEmojiClick(emoji)}
                                className="p-1 hover:bg-slate-100 rounded text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Image upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={triggerFileInput}
                className="h-8 w-8 p-0 hover:bg-violet-50 text-slate-500"
                type="button"
              >
                <Image className="h-4 w-4" />
              </Button>

              {/* Send button */}
              <Button
                onClick={handleSubmitComment}
                className={cn(
                  "h-8 w-8 p-0 rounded-lg transition-all duration-300",
                  newComment.trim() || selectedImage
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/30"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200"
                )}
                disabled={(!newComment.trim() && !selectedImage) || isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Image preview */}
          {imagePreview && (
            <div className="relative">
              <ImageViewer
                src={imagePreview}
                alt="Preview"
                maxWidth="max-w-full"
                showControls={false}
                containerClassName="mb-3 max-w-sm"
                showBackground={false}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSelectedImage(null)
                  setImagePreview(null)
                }}
                className="absolute -top-2 -right-2 h-7 w-7 p-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-red-500 hover:bg-red-600 border-2 border-white z-10"
              >
                <span className="text-white font-semibold">×</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {rootComments.map((comment) => {
          const replies = comments.filter(c => c.rootCommentId === comment.id)
          const isLiked = likedComments.has(comment.id)
          const isLiking = likingComments.has(comment.id)
          
          // Clean ownership check - handle both numeric and string userId
          const isUserComment = comment.author.userId === user.id || String(comment.author.userId) === String(user.userId)
          const displayName = isUserComment ? user.name : comment.author.name
          
          return (
            <div key={comment.id} className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback className="bg-gradient-to-br from-slate-500 to-slate-600 text-white text-sm">
                    {comment.author.fallback}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  {/* Text content with full-width background */}
                  <div className="bg-slate-50 rounded-2xl p-4 -mr-12">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-slate-900">{displayName}</span>
                      <span className="text-xs text-slate-500">{comment.author.role}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400">{comment.timestamp}</span>
                      </div>
                      
                    {comment.content && (
                      <p className="text-slate-700 leading-relaxed">
                        {comment.content.replace(/^@\w+(\.\w+)*\s*/g, '')}
                      </p>
                    )}
                  </div>
                  
                  {/* Image without background */}
                  {comment.image && (
                    <div className={comment.content ? "mt-0" : ""}>
                      <ImageViewer
                        src={comment.image}
                        alt="Comment attachment"
                        maxWidth="max-w-full"
                        showControls={true}
                        containerClassName="max-w-md"
                        showBackground={false}
                      />
                      

                    </div>
                  )}
                  
                  {/* Comment actions */}
                  <div className="flex items-center gap-4 mt-2 px-2">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      disabled={isLiking}
                      className={cn(
                        "text-xs transition-colors",
                        isLiked
                          ? "text-red-500 hover:text-red-600"
                          : "text-slate-500 hover:text-violet-600",
                        isLiking && "opacity-50"
                      )}
                    >
                      Thích {comment.likes > 0 && `(${comment.likes})`}
                    </button>
                    <button 
                      onClick={() => handleReply(comment.id)}
                      className="text-xs text-slate-500 hover:text-violet-600 transition-colors"
                    >
                      Trả lời {calculateTotalReplies(comment.id) > 0 && `(${calculateTotalReplies(comment.id)})`}
                    </button>
                    <span className="text-xs text-slate-400">{comment.timestamp}</span>
                  </div>

                  {/* Reply input */}
                  {replyingTo && (replyingTo.rootId === comment.id || replyingTo.parentId === comment.id || replies.some(r => r.id === replyingTo.parentId)) && (
                    <div className="mt-3 ml-4 pl-4 border-l-2 border-violet-200">
                      <div className="flex gap-2">
                        <Avatar className="h-8 w-8 border border-slate-200">
                          <AvatarImage src={avatarImage} alt="Your avatar" />
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex rounded-xl border bg-slate-50 border-slate-200">
                            <Textarea
                              placeholder={`Trả lời ${getReplyTargetName(replyingTo.parentId) || comment.author.name}...`}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="min-h-[40px] flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 text-sm py-2 px-3 rounded-l-xl rounded-r-none"
                            />
                            
                            {/* Reply action buttons */}
                            <div className="flex items-end p-1 gap-1">
                              {/* Reply emoji picker */}
                              <div className="relative">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowReplyEmojiPicker(!showReplyEmojiPicker)}
                                  className="h-7 w-7 p-0 hover:bg-violet-50 text-slate-500"
                                >
                                  <Smile className="h-3 w-3" />
                                </Button>
                                
                                {showReplyEmojiPicker && (
                                  <div className="absolute bottom-8 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 w-64 max-h-96 overflow-y-auto">
                                    <div className="space-y-2">
                                      {Object.entries(emojiCategories).map(([category, emojis]) => (
                                        <div key={category}>
                                          <p className="text-xs font-medium text-slate-500 mb-1 capitalize">{category}</p>
                                          <div className="grid grid-cols-8 gap-1">
                                            {emojis.map((emoji: string) => (
                                              <button
                                                key={emoji}
                                                onClick={() => handleReplyEmojiClick(emoji)}
                                                className="p-1 hover:bg-slate-100 rounded text-sm"
                                              >
                                                {emoji}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Reply image upload */}
                              <input
                                ref={replyFileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleReplyImageUpload}
                                className="hidden"
                              />

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={triggerReplyFileInput}
                                className="h-7 w-7 p-0 hover:bg-violet-50 text-slate-500"
                                type="button"
                              >
                                <Image className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Reply image preview */}
                          {replyImagePreview && (
                            <div className="relative">
                              <ImageViewer
                                src={replyImagePreview}
                                alt="Reply preview"
                                maxWidth="max-w-full"
                                showControls={false}
                                containerClassName="mb-2 max-w-xs"
                                showBackground={false}
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setReplyImage(null)
                                  setReplyImagePreview(null)
                                }}
                                className="absolute -top-1.5 -right-1.5 h-6 w-6 p-0 rounded-full text-xs shadow-md hover:shadow-lg transition-all duration-200 bg-red-500 hover:bg-red-600 border-2 border-white z-10"
                              >
                                <span className="text-white font-semibold">×</span>
                              </Button>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSubmitReply}
                              size="sm"
                              className="h-7 px-3 text-xs"
                              disabled={(!replyContent.trim() && !replyImage) || isLoading}
                            >
                              {isLoading ? "..." : "Gửi"}
                            </Button>
                            <Button
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyContent("")
                                setReplyImage(null)
                                setReplyImagePreview(null)
                              }}
                              variant="outline"
                              size="sm"
                              className="h-7 px-3 text-xs"
                            >
                              Hủy
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {replies.length > 0 && (
                    <div className="mt-3 ml-4 pl-4 border-l-2 border-slate-200 space-y-3">
                      {replies.map((reply) => {
                        const replyIsLiked = likedComments.has(reply.id)
                        const replyIsLiking = likingComments.has(reply.id)
                        const replyTargetName = getReplyTargetName(reply.parentCommentId)
                        
                        return (
                          <div key={reply.id}>
                            {/* Reply */}
                            <div className="flex gap-2">
                              <Avatar className="h-8 w-8 border border-slate-200">
                                <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                                <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-500 text-white text-xs">
                                  {reply.author.fallback}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                {/* Reply text with full-width background */}
                                <div className="bg-slate-100 rounded-xl p-3 -mr-8">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-slate-900 text-sm">
                                      {(reply.author.userId === user.id || String(reply.author.userId) === String(user.userId)) ? user.name : reply.author.name}
                                      </span>
                                      {replyTargetName && 
                                     ((reply.author.userId === user.id || String(reply.author.userId) === String(user.userId)) ? user.name : reply.author.name) !== replyTargetName && (
                                        <>
                                          <span className="text-xs text-slate-500">trả lời</span>
                                          <span className="text-xs text-blue-600">@{replyTargetName}</span>
                                        </>
                                      )}
                                    <span className="text-xs text-slate-500">{reply.author.role}</span>
                                      <span className="text-xs text-slate-400">•</span>
                                      <span className="text-xs text-slate-400">{reply.timestamp}</span>
                                    </div>
                                  {reply.content && (
                                    <p className="text-slate-700 text-sm leading-relaxed">
                                      {reply.content.replace(/^@\w+(\.\w+)*\s*/g, '')}
                                    </p>
                                  )}
                                </div>

                                {/* Reply image without background */}
                                {reply.image && (
                                  <div className={reply.content ? "mt-0" : ""}>
                                    <ImageViewer
                                      src={reply.image}
                                      alt="Reply attachment"
                                      maxWidth="max-w-full"
                                      showControls={true}
                                      containerClassName="max-w-xs"
                                      showBackground={false}
                                    />
                                  </div>
                                )}
                                <div className="flex items-center gap-3 mt-1 px-2">
                                  <button 
                                    onClick={() => handleLikeComment(reply.id)}
                                    disabled={replyIsLiking}
                                    className={cn(
                                      "text-xs transition-colors",
                                      replyIsLiked
                                        ? "text-red-500 hover:text-red-600"
                                        : "text-slate-500 hover:text-violet-600",
                                      replyIsLiking && "opacity-50"
                                    )}
                                  >
                                    Thích {reply.likes > 0 && `(${reply.likes})`}
                                  </button>
                                  <button 
                                    onClick={() => handleReply(reply.id)}
                                    className="text-xs text-slate-500 hover:text-violet-600 transition-colors"
                                  >
                                    Trả lời
                                  </button>
                                  <span className="text-xs text-slate-400">{reply.timestamp}</span>
                                </div>
                              </div>
                              
                              {/* Reply dropdown menu */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                  <DropdownMenuItem 
                                    onClick={() => handleHideComment(reply.id)}
                                    className="text-xs"
                                  >
                                    Ẩn phản hồi
                                  </DropdownMenuItem>

                                  {(reply.author.userId === user.id || String(reply.author.userId) === String(user.userId)) && (
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteComment(reply.id)}
                                      className="text-xs text-red-600"
                                    >
                                      Xóa phản hồi
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem className="text-xs">Báo cáo</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem 
                      onClick={() => handleHideComment(comment.id)}
                      className="text-xs"
                    >
                      Ẩn bình luận
                    </DropdownMenuItem>
                    {(comment.author.userId === user.id || String(comment.author.userId) === String(user.userId)) && (
                      <DropdownMenuItem 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-xs text-red-600"
                      >
                        Xóa bình luận
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-xs">Báo cáo</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 