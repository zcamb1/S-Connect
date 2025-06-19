import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '../../ui/button'
import { ZoomIn, ZoomOut, RotateCw, Check, X, Upload } from 'lucide-react'

// Simple inline Slider component
const Slider: React.FC<{
  value: number[]
  onValueChange: (values: number[]) => void
  min: number
  max: number
  step: number
  className?: string
}> = ({ value, onValueChange, min, max, step, className }) => {
  const currentValue = value[0] || min
  const percentage = ((currentValue - min) / (max - min)) * 100
  
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={currentValue}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${className}`}
      style={{
        background: `linear-gradient(to right, rgb(139 92 246) 0%, rgb(139 92 246) ${percentage}%, rgb(226 232 240) ${percentage}%, rgb(226 232 240) 100%)`
      }}
    />
  )
}

interface AvatarCropperProps {
  isOpen: boolean
  onClose: () => void
  onCropComplete: (croppedImage: string) => void
}

export const AvatarCropper: React.FC<AvatarCropperProps> = ({
  isOpen,
  onClose,
  onCropComplete
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isUploading, setIsUploading] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cropSize = 200 // Size of the crop circle

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file quá lớn. Vui lòng chọn file dưới 5MB.')
        return
      }

      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          setImage(img)
          // Reset position and scale when new image is loaded
          setPosition({ x: 0, y: 0 })
          setScale(1)
          setIsUploading(false)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const drawCanvas = useCallback(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const canvasSize = 400
    canvas.width = canvasSize
    canvas.height = canvasSize

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // Calculate image dimensions to fit in canvas
    const imgAspect = image.width / image.height
    let drawWidth = canvasSize * scale
    let drawHeight = canvasSize * scale

    if (imgAspect > 1) {
      drawHeight = drawWidth / imgAspect
    } else {
      drawWidth = drawHeight * imgAspect
    }

    // Center the image and apply position offset
    const x = (canvasSize - drawWidth) / 2 + position.x
    const y = (canvasSize - drawHeight) / 2 + position.y

    // Draw image
    ctx.drawImage(image, x, y, drawWidth, drawHeight)

    // Draw crop circle overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Create circular crop area
    const centerX = canvasSize / 2
    const centerY = canvasSize / 2
    
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(centerX, centerY, cropSize / 2, 0, 2 * Math.PI)
    ctx.fill()

    // Draw circle border
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, cropSize / 2, 0, 2 * Math.PI)
    ctx.stroke()
  }, [image, scale, position, cropSize])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const getCroppedImage = useCallback(() => {
    if (!image || !canvasRef.current) return null

    // Create a new canvas for the cropped result
    const resultCanvas = document.createElement('canvas')
    const resultCtx = resultCanvas.getContext('2d')
    if (!resultCtx) return null

    const finalSize = 200 // Final avatar size
    resultCanvas.width = finalSize
    resultCanvas.height = finalSize

    const canvasSize = 400
    const imgAspect = image.width / image.height
    let drawWidth = canvasSize * scale
    let drawHeight = canvasSize * scale

    if (imgAspect > 1) {
      drawHeight = drawWidth / imgAspect
    } else {
      drawWidth = drawHeight * imgAspect
    }

    const x = (canvasSize - drawWidth) / 2 + position.x
    const y = (canvasSize - drawHeight) / 2 + position.y

    // Calculate source coordinates for the crop
    const cropCenterX = canvasSize / 2
    const cropCenterY = canvasSize / 2
    const cropRadius = cropSize / 2

    const sourceX = (cropCenterX - cropRadius - x) * (image.width / drawWidth)
    const sourceY = (cropCenterY - cropRadius - y) * (image.height / drawHeight)
    const sourceSize = (cropSize * image.width) / drawWidth

    // Create circular clip
    resultCtx.beginPath()
    resultCtx.arc(finalSize / 2, finalSize / 2, finalSize / 2, 0, 2 * Math.PI)
    resultCtx.clip()

    // Draw the cropped image
    resultCtx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      finalSize,
      finalSize
    )

    return resultCanvas.toDataURL('image/png')
  }, [image, scale, position, cropSize])

  const handleCropComplete = () => {
    const croppedImage = getCroppedImage()
    if (croppedImage) {
      onCropComplete(croppedImage)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const resetCrop = () => {
    setPosition({ x: 0, y: 0 })
    setScale(1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">Cập nhật ảnh đại diện</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full h-8 w-8 p-0 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!image ? (
            // Upload State
            <div className="space-y-4">
              <div
                onClick={openFileDialog}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 cursor-pointer group"
              >
                {isUploading ? (
                  <div className="space-y-2">
                    <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-slate-600">Đang tải lên...</p>
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            // Crop State
            <div className="space-y-4">
              {/* Canvas */}
              <div className="flex justify-center">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className={`border border-slate-200 rounded-lg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Kéo để di chuyển
                  </div>
                </div>
              </div>

              {/* Zoom Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Zoom</span>
                  <span className="text-slate-900">{Math.round(scale * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <ZoomOut className="h-4 w-4 text-slate-400" />
                  <div className="flex-1">
                                         <Slider
                       value={[scale]}
                       onValueChange={(values: number[]) => setScale(values[0])}
                       min={0.5}
                       max={3}
                       step={0.1}
                       className="w-full"
                     />
                  </div>
                  <ZoomIn className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetCrop}
                  className="flex-1"
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openFileDialog}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Chọn ảnh khác
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {image && (
          <div className="p-6 border-t border-slate-200 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleCropComplete}
              className="flex-1 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Áp dụng
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 