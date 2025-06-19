import { useState } from "react"
import { cn } from "../lib/utils"
import { X, ZoomIn, Download } from "lucide-react"
import { Button } from "./ui/button"

interface ImageViewerProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  showControls?: boolean
  maxWidth?: string
  showBackground?: boolean
}

export function ImageViewer({ 
  src, 
  alt, 
  className, 
  containerClassName,
  showControls = true,
  maxWidth = "max-w-md",
  showBackground = true
}: ImageViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = alt || 'image'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  if (hasError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 p-8",
        maxWidth,
        containerClassName
      )}>
        <div className="text-center text-slate-500">
          <div className="text-2xl mb-2">🖼️</div>
          <p className="text-sm">Không thể tải ảnh</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={cn(
        "group relative cursor-pointer",
        containerClassName
      )}>
                 {/* Image container with loading skeleton */}
         <div className={cn(
           "relative overflow-hidden transition-all duration-300",
           showBackground 
             ? "rounded-2xl shadow-lg bg-gradient-to-br from-slate-100 via-slate-50 to-white border border-slate-200 hover:border-violet-300 hover:shadow-xl"
             : "rounded-xl",
           "w-full",
           maxWidth
         )}>
          {/* Loading skeleton */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse">
              <div className="flex items-center justify-center h-48">
                <div className="text-slate-400">
                  <div className="animate-spin h-6 w-6 border-2 border-slate-300 border-t-violet-500 rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          {/* Main image */}
                     <img
             src={src}
             alt={alt}
             loading="lazy"
             onLoad={handleImageLoad}
             onError={handleImageError}
             onClick={() => setIsModalOpen(true)}
             className={cn(
               "w-full h-auto object-cover transition-all duration-500",
               "group-hover:scale-[1.02]",
               "max-h-96",
               isLoading ? "opacity-0" : "opacity-100",
               className
             )}
             style={{ 
               aspectRatio: 'auto',
               maxWidth: '100%',
               height: 'auto'
             }}
           />

                     {/* Overlay with controls */}
           {showControls && !isLoading && (
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <div className={cn(
                 "absolute flex gap-2",
                 showBackground ? "bottom-3 right-3" : "bottom-2 right-2"
               )}>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsModalOpen(true)
                  }}
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg backdrop-blur-sm"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload()
                  }}
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg backdrop-blur-sm"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for full-size viewing */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
          style={{ margin: 0, padding: '1rem' }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={src}
              alt={alt}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            />
            
            {/* Close button */}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 h-10 w-10 p-0 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg backdrop-blur-sm z-10"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Download button in modal */}
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownload}
              className="absolute top-4 right-16 h-10 w-10 p-0 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg backdrop-blur-sm z-10"
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
} 