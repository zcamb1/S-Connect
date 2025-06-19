import { useState, useEffect } from "react"
import { Heart, MessageSquare, Share2, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Button } from "../../ui/button"
import { Textarea } from "../../ui/textarea"
import { cn } from "../../../lib/utils"
import { Comments } from "../comments/Comments"

interface PostInteractionProps {
  likeCount: number
  commentCount?: number
  shareCount?: number
  postId?: number
  avatarSrc?: string
  avatarFallback?: string
  className?: string
  onCommentCountChange?: (newCount: number) => void
}

export function PostInteraction({
  likeCount = 0,
  commentCount = 0,
  shareCount = 0,
  postId,
  avatarSrc = "/placeholder.svg?height=48&width=48",
  avatarFallback = "BXH",
  className,
  onCommentCountChange,
}: PostInteractionProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [localLikeCount, setLocalLikeCount] = useState(likeCount)
  const [isLiking, setIsLiking] = useState(false)
  // Use props directly instead of local state to avoid loops
  const localCommentCount = commentCount
  const [comment, setComment] = useState("")
  const [isCommentFocused, setIsCommentFocused] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const handleLike = async () => {
    console.log('🔍 Like button clicked:', { 
      isLiking, 
      isLiked, 
      localLikeCount, 
      postId 
    })
    
    if (isLiking) {
      console.log('⚠️ Already liking, ignoring click')
      return // Prevent spam clicking
    }
    
    setIsLiking(true)
    console.log('🚀 Starting like process...')
    
    const newIsLiked = !isLiked
    const newCount = newIsLiked ? localLikeCount + 1 : localLikeCount - 1
    
    console.log('📊 Calculated new state:', { newIsLiked, newCount })
    
    // Optimistic update
    setIsLiked(newIsLiked)
    setLocalLikeCount(newCount)
    console.log('✅ Optimistic update applied')
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Save to localStorage
      const likeKey = `post_${postId}_liked`
      const countKey = `post_${postId}_like_count`
      localStorage.setItem(likeKey, newIsLiked.toString())
      localStorage.setItem(countKey, newCount.toString())
      
      console.log('💾 Saved to localStorage:', { 
        [likeKey]: newIsLiked.toString(),
        [countKey]: newCount.toString()
      })
    } catch (error) {
      // Revert on error
      console.log('❌ Error occurred, reverting:', error)
      setIsLiked(isLiked)
      setLocalLikeCount(localLikeCount)
    } finally {
      setIsLiking(false)
      console.log('🏁 Like process finished')
    }
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const handleCommentCountChange = async (newCount: number) => {
    // Comment count is now managed by parent component via props
    // Notify parent to refresh comment count
    console.log('📊 Comment count change reported:', newCount)
    if (onCommentCountChange) {
      onCommentCountChange(newCount)
    }
  }

  const handleShare = () => {
    if (postId) {
      const shareUrl = `${window.location.origin}${window.location.pathname}#post-${postId}`
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('📋 Link đã được copy! Paste để chia sẻ bài viết này.')
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('📋 Link đã được copy! Paste để chia sẻ bài viết này.')
      })
    }
  }

  // Load like status from localStorage (don't override comment count from props)
  useEffect(() => {
    console.log('🔄 Loading data for postId:', postId)
    console.log('📊 Using comment count from props:', commentCount)
    
    if (postId) {
      // Load like status from localStorage
      const likeKey = `post_${postId}_liked`
      const countKey = `post_${postId}_like_count`
      const savedLiked = localStorage.getItem(likeKey)
      const savedCount = localStorage.getItem(countKey)
      
      console.log('💾 LocalStorage values:', { 
        [likeKey]: savedLiked,
        [countKey]: savedCount
      })
      
      if (savedLiked) {
        const liked = savedLiked === 'true'
        setIsLiked(liked)
        console.log('❤️ Set isLiked to:', liked)
      }
      if (savedCount) {
        const count = parseInt(savedCount)
        setLocalLikeCount(count)
        console.log('🔢 Set localLikeCount to:', count)
      }
    }
  }, [postId]) // Don't include commentCount to avoid re-running when props change

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="!flex !justify-center !items-center !gap-8 border-t border-b border-slate-200/50 py-3">
        {/* Like button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLiking}
          className={cn(
            "h-10 gap-2 rounded-xl transition-all duration-300",
            isLiked ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-slate-700 hover:text-violet-700 hover:bg-violet-50",
            isLiking && "opacity-50"
          )}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-all duration-200",
              isLiked ? "fill-current" : ""
            )} 
          />
          <span className="font-medium">Thích</span>
          <span className="text-sm font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
            {formatCount(localLikeCount)}
          </span>
        </Button>

        {/* Comment button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleComments}
          className={cn(
            "h-10 gap-2 rounded-xl transition-all duration-300",
            showComments
              ? "text-violet-700 bg-violet-50 hover:bg-violet-100"
              : "text-slate-700 hover:text-violet-700 hover:bg-violet-50",
          )}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="font-medium">Bình luận</span>
          <span className="text-sm font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
            {formatCount(localCommentCount)}
          </span>
        </Button>

        {/* Share button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="h-10 gap-2 text-slate-700 hover:text-violet-700 hover:bg-violet-50 rounded-xl"
        >
          <Share2 className="h-5 w-5" />
          <span className="font-medium">Chia sẻ</span>
          <span className="text-sm font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
            {formatCount(shareCount)}
          </span>
        </Button>
      </div>

      {showComments && postId && (
        <Comments 
          postId={postId} 
          className="mt-4" 
          onCommentCountChange={handleCommentCountChange}
        />
      )}

      {showComments && !postId && (
        <div className="flex gap-3 animate-in slide-in-from-top-2 duration-300 ease-in-out">
          <Avatar
            className={cn(
              "h-12 w-12 transition-all duration-300",
              isCommentFocused
                ? "border-4 border-white ring-4 ring-violet-100 shadow-lg shadow-violet-500/10"
                : "border-2 border-white ring-2 ring-slate-100",
            )}
          >
            <AvatarImage src={avatarSrc || "/placeholder.svg"} alt="User Avatar" />
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div
              className={cn(
                "flex rounded-2xl border bg-slate-50 transition-all duration-300",
                isCommentFocused
                  ? "ring-4 ring-violet-100 shadow-lg shadow-violet-500/10 border-violet-200"
                  : "border-slate-200 shadow-sm",
              )}
            >
              <Textarea
                id="comment-textarea"
                placeholder="Viết bình luận..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onFocus={() => setIsCommentFocused(true)}
                onBlur={() => setIsCommentFocused(false)}
                className="min-h-[48px] flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 text-slate-700 placeholder:text-slate-400 py-3 px-4 rounded-l-2xl rounded-r-none"
              />
              <Button
                className={cn(
                  "rounded-l-none rounded-r-2xl transition-all duration-300",
                  comment.trim()
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200",
                )}
                disabled={!comment.trim()}
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Đăng bình luận</span>
              </Button>
            </div>

            <div className="flex justify-between items-center px-1 text-xs text-slate-500">
              <span>Nhấn Enter để đăng</span>
              <button className="hover:text-violet-600 transition-colors">Thêm ảnh</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 