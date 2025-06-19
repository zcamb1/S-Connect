import React from 'react'
import { cn } from '../../lib/utils'

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step: number
  className?: string
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  min,
  max,
  step,
  className
}) => {
  const currentValue = value[0] || min
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    onValueChange([newValue])
  }

  const percentage = ((currentValue - min) / (max - min)) * 100

  return (
    <div className={cn("relative w-full", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
        style={{
          background: `linear-gradient(to right, rgb(139 92 246) 0%, rgb(139 92 246) ${percentage}%, rgb(226 232 240) ${percentage}%, rgb(226 232 240) 100%)`
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: rgb(139 92 246);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 2px solid white;
          }
          
          input[type="range"]::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: rgb(139 92 246);
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 2px solid white;
            border: none;
          }
        `
      }} />
    </div>
  )
} 