import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { cn } from "../../lib/utils"
import { ReplyItem } from "./ReplyItem"
import { ReplyInput } from "./ReplyInput"

interface CommentItemProps {
  comment: any
  replyingTo: number | null
  replyingToReply: {commentId: number, replyId: number} | null
  replyContent: string
  likedComments: Set<number>
  likingComments: Set<number>
  isLoading: boolean
  onReply: (commentId: number) => void
  onReplyToReply: (commentId: number, replyId: number) => void
  onLikeComment: (commentId: number) => void
  onHideComment: (commentId: number) => void
  onDeleteComment: (commentId: number) => void
  onDeleteReply: (parentId: number, replyId: number) => void
  onReplyContentChange: (content: string) => void
  onSubmitReply: () => void
  onCancelReply: () => void
  replyInput?: React.ReactNode
}

export function CommentItem({ 
  comment, 
  replyingTo,
  replyingToReply,
  replyContent,
  likedComments,
  likingComments,
  isLoading,
  onReply,
  onReplyToReply,
  onLikeComment,
  onHideComment,
  onDeleteComment,
  onDeleteReply,
  onReplyContentChange,
  onSubmitReply,
  onCancelReply,
  replyInput
}: CommentItemProps) {
  if (comment.isHidden) return null

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 border border-slate-200">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback className="bg-gradient-to-br from-slate-500 to-slate-600 text-white text-sm">
            {comment.author.fallback}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-slate-900">{comment.author.name}</span>
              <span className="text-xs text-slate-500">{comment.author.role}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400">{comment.timestamp}</span>
            </div>
            
            <p className="text-slate-700 leading-relaxed mb-3">{comment.content}</p>
            
            {comment.image && (
              <img
                src={comment.image}
                alt="Comment attachment"
                className="max-w-xs rounded-lg shadow-lg mb-3"
              />
            )}

            {/* Reactions */}
            {comment.reactions && comment.reactions.length > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex -space-x-1">
                  {comment.reactions.slice(0, 3).map((reaction: string, index: number) => (
                    <span key={index} className="text-sm bg-white rounded-full p-1 border border-slate-200">
                      {reaction}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-slate-500">
                  {comment.reactions.length > 3 && `+${comment.reactions.length - 3} khác`}
                </span>
              </div>
            )}
          </div>

          {/* Comment actions */}
          <div className="flex items-center gap-4 mt-2 px-2">
            <button
              onClick={() => onLikeComment(comment.id)}
              disabled={likingComments.has(comment.id)}
              className={cn(
                "text-xs transition-colors",
                likedComments.has(comment.id)
                  ? "text-red-500 hover:text-red-600"
                  : "text-slate-500 hover:text-violet-600",
                likingComments.has(comment.id) && "opacity-50"
              )}
            >
              Thích {comment.likes > 0 && `(${comment.likes})`}
            </button>
            <button 
              onClick={() => onReply(comment.id)}
              className="text-xs text-slate-500 hover:text-violet-600 transition-colors"
            >
              Trả lời {comment.replies > 0 && `(${comment.replies})`}
            </button>
            <span className="text-xs text-slate-400">{comment.timestamp}</span>
          </div>

          {/* Reply input for main comment */}
          {replyingTo === comment.id && replyInput}

          {/* Replies */}
          {comment.replyList && comment.replyList.length > 0 && (
            <div className="mt-3 ml-4 pl-4 border-l-2 border-slate-200 space-y-3">
              {comment.replyList.map((reply: any) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  commentId={comment.id}
                  replyingToReply={replyingToReply}
                  replyContent={replyContent}
                  likedComments={likedComments}
                  likingComments={likingComments}
                  isLoading={isLoading}
                  onReplyToReply={onReplyToReply}
                  onLikeComment={onLikeComment}
                  onDeleteReply={onDeleteReply}
                  onReplyContentChange={onReplyContentChange}
                  onSubmitReply={onSubmitReply}
                  onCancelReply={onCancelReply}
                />
              ))}
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
              onClick={() => onHideComment(comment.id)}
              className="text-xs"
            >
              Ẩn bình luận
            </DropdownMenuItem>
            {comment.author.name === "Bạn" && (
              <DropdownMenuItem 
                onClick={() => onDeleteComment(comment.id)}
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
} 