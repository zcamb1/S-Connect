import React, { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Smile, Image } from "lucide-react"

interface ReplyInputProps {
  targetName: string
  replyContent: string
  replyImagePreview: string | null
  showReplyEmojiPicker: boolean
  isLoading: boolean
  emojiCategories: Record<string, string[]>
  onReplyContentChange: (content: string) => void
  onReplyImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onReplyEmojiClick: (emoji: string) => void
  onToggleEmojiPicker: () => void
  onSubmitReply: () => void
  onCancelReply: () => void
  onRemoveImage: () => void
}

export function ReplyInput({
  targetName,
  replyContent,
  replyImagePreview,
  showReplyEmojiPicker,
  isLoading,
  emojiCategories,
  onReplyContentChange,
  onReplyImageUpload,
  onReplyEmojiClick,
  onToggleEmojiPicker,
  onSubmitReply,
  onCancelReply,
  onRemoveImage
}: ReplyInputProps) {
  const replyImageInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="mt-3 ml-4 pl-4 border-l-2 border-violet-200">
      <div className="flex gap-2">
        <Avatar className="h-8 w-8 border border-slate-200">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs">
            B
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex rounded-xl border bg-slate-50 border-slate-200">
            <Textarea
              placeholder={`Trả lời ${targetName}...`}
              value={replyContent}
              onChange={(e) => onReplyContentChange(e.target.value)}
              className="min-h-[40px] flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 text-sm py-2 px-3 rounded-l-xl rounded-r-none"
            />
            
            {/* Reply action buttons */}
            <div className="flex items-end p-1 gap-1">
              {/* Reply emoji picker */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleEmojiPicker}
                  className="h-7 w-7 p-0 hover:bg-violet-50 text-slate-500"
                >
                  <Smile className="h-3 w-3" />
                </Button>
                
                {showReplyEmojiPicker && (
                  <div className="absolute bottom-8 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 w-64">
                    <div className="space-y-2">
                      {Object.entries(emojiCategories).map(([category, emojis]) => (
                        <div key={category}>
                          <p className="text-xs font-medium text-slate-500 mb-1 capitalize">{category}</p>
                          <div className="grid grid-cols-8 gap-1">
                            {emojis.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => onReplyEmojiClick(emoji)}
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
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onReplyImageUpload}
                  className="hidden"
                  ref={replyImageInputRef}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => replyImageInputRef.current?.click()}
                  className="h-7 w-7 p-0 hover:bg-violet-50 text-slate-500"
                  type="button"
                >
                  <Image className="h-3 w-3" />
                </Button>
              </label>
            </div>
          </div>

          {/* Reply image preview */}
          {replyImagePreview && (
            <div className="relative inline-block">
              <img
                src={replyImagePreview}
                alt="Reply preview"
                className="max-w-xs rounded-lg shadow-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={onRemoveImage}
                className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full text-xs"
              >
                ×
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={onSubmitReply}
              size="sm"
              className="h-7 px-3 text-xs"
              disabled={(!replyContent.trim() && !replyImagePreview) || isLoading}
            >
              {isLoading ? "..." : "Gửi"}
            </Button>
            <Button
              onClick={onCancelReply}
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
  )
} 