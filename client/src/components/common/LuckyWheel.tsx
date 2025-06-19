import { useState, useRef } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { RotateCw, Gift, Star, Trophy, Coffee, Heart, Zap } from 'lucide-react'

interface Prize {
  id: number
  name: string
  icon: any
  color: string
  probability: number
}

const prizes: Prize[] = [
  { id: 1, name: "Cà phê miễn phí", icon: Coffee, color: "#8B4513", probability: 25 },
  { id: 2, name: "Voucher 50k", icon: Gift, color: "#FF6B6B", probability: 15 },
  { id: 3, name: "Ngày nghỉ phép", icon: Heart, color: "#FF69B4", probability: 10 },
  { id: 4, name: "Điểm thưởng x2", icon: Star, color: "#FFD700", probability: 20 },
  { id: 5, name: "Quà bí ẩn", icon: Trophy, color: "#32CD32", probability: 8 },
  { id: 6, name: "Buff năng lượng", icon: Zap, color: "#00BFFF", probability: 12 },
  { id: 7, name: "Chúc bạn may mắn", icon: Star, color: "#DDA0DD", probability: 10 }
]

export function LuckyWheel() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [result, setResult] = useState<Prize | null>(null)
  const [spinsLeft, setSpinsLeft] = useState(3)
  const [showWinModal, setShowWinModal] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  const spinWheel = () => {
    if (isSpinning || spinsLeft <= 0) return

    setIsSpinning(true)
    setResult(null)
    setShowWinModal(false)
    setSpinsLeft(prev => prev - 1)

    // Calculate random prize based on probability
    const random = Math.random() * 100
    let accumulator = 0
    let selectedPrize = prizes[0]

    for (const prize of prizes) {
      accumulator += prize.probability
      if (random <= accumulator) {
        selectedPrize = prize
        break
      }
    }

    // Calculate rotation with proper alignment for top pointer
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id)
    const segmentAngle = 360 / prizes.length
    
    // Since pointer is at top (0°), we need to calculate the angle to center the selected segment at top
    // Each segment starts at (index * segmentAngle) and we want its center at 0° (top)
    const segmentCenter = prizeIndex * segmentAngle + segmentAngle / 2
    
    // Calculate how much to rotate to align segment center with pointer (at top)
    // We need to rotate clockwise to bring the segment to top, so subtract from 360°
    const targetAngle = 360 - segmentCenter
    
    // Add multiple full rotations for spinning effect (5-8 rotations for variety)
    const extraRotations = Math.floor(Math.random() * 4) + 5 // 5-8 full rotations
    const totalRotation = currentRotation + (extraRotations * 360) + targetAngle

    setCurrentRotation(totalRotation)

    // Animate wheel - slower animation (5 seconds instead of 3)
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.23, 1, 0.320, 1)'
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`
    }

    // Show result after slower animation
    setTimeout(() => {
      setIsSpinning(false)
      setResult(selectedPrize)
      setShowWinModal(true)
      
      // Auto hide modal after 3 seconds
      setTimeout(() => {
        setShowWinModal(false)
      }, 3000)
    }, 5000)
  }

  const resetGame = () => {
    setSpinsLeft(3)
    setResult(null)
    setShowWinModal(false)
    setCurrentRotation(0)
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'none'
      wheelRef.current.style.transform = 'rotate(0deg)'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text mb-4">
            🎯 Vòng Quay May Mắn
          </h1>
          <p className="text-lg text-slate-600">Quay để nhận những phần thưởng hấp dẫn!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wheel Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Wheel Container */}
              <div className="relative w-80 h-80 mx-auto">
                {/* Wheel */}
                <div
                  ref={wheelRef}
                  className={`w-full h-full rounded-full border-8 border-white shadow-2xl transition-transform duration-3000 ease-out ${
                    isSpinning ? 'animate-pulse' : ''
                  }`}
                  style={{
                    background: `conic-gradient(${prizes
                      .map((prize, index) => {
                        const startAngle = (index * 360) / prizes.length
                        const endAngle = ((index + 1) * 360) / prizes.length
                        return `${prize.color} ${startAngle}deg ${endAngle}deg`
                      })
                      .join(', ')})`
                  }}
                >
                  {/* Prize Labels */}
                  {prizes.map((prize, index) => {
                    const angle = (index * 360) / prizes.length + 360 / prizes.length / 2
                    const Icon = prize.icon
                    return (
                      <div
                        key={prize.id}
                        className="absolute w-16 h-16 flex flex-col items-center justify-center text-white font-bold text-xs"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-120px)`,
                          transformOrigin: 'center'
                        }}
                      >
                        <Icon className="w-6 h-6 mb-1" />
                        <span className="text-center leading-tight">{prize.name.split(' ')[0]}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-1">
                  <div className="w-8 h-16 flex flex-col items-center z-10">
                    {/* Pointer arrow pointing down into wheel */}
                    <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-l-transparent border-r-transparent border-t-[20px] border-t-yellow-400 drop-shadow-lg"></div>
                    {/* Pointer base */}
                    <div className="w-4 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-t-full border-2 border-white shadow-lg -mt-1"></div>
                  </div>
                </div>

                {/* Center Button */}
                <Button
                  onClick={spinWheel}
                  disabled={isSpinning || spinsLeft <= 0}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 shadow-xl border-4 border-white disabled:opacity-50"
                >
                  {isSpinning ? (
                    <RotateCw className="w-8 h-8 animate-spin text-white" />
                  ) : (
                    <span className="text-white font-bold text-sm">QUAY</span>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-slate-700 mb-2">
                Lượt quay còn lại: <span className="text-violet-600">{spinsLeft}</span>
              </p>
              {spinsLeft <= 0 && (
                <Button onClick={resetGame} variant="outline" className="mt-2">
                  Chơi lại
                </Button>
              )}
            </div>
          </div>

          {/* Info & Result Section */}
          <div className="space-y-6">
            {/* Prizes List */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách phần thưởng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prizes.map((prize, index) => {
                    const Icon = prize.icon
                    return (
                      <div key={prize.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: prize.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{prize.name}</h4>
                          <p className="text-sm text-slate-500">{prize.probability}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            {result && (
              <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <Trophy className="w-5 h-5" />
                    Chúc mừng! 🎉
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: result.color }}
                    >
                      <result.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{result.name}</h3>
                      <p className="text-slate-600">Bạn đã trúng thưởng rồi! 🎊</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}


          </div>
        </div>
      </div>

      {/* Win Modal/Notification */}
      {showWinModal && result && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl transform animate-in zoom-in-90 duration-500">
            <div className="text-center">
              <div className="mb-4">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">🎉 Chúc mừng!</h2>
              <p className="text-xl text-slate-600 mb-6">Bạn đã trúng thưởng!</p>
              
              <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl"
                  style={{ backgroundColor: result.color }}
                >
                  <result.icon className="w-10 h-10" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-slate-900">{result.name}</h3>
                  <p className="text-slate-600">Phần thưởng đã được ghi nhận!</p>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 mt-4">Thông báo này sẽ tự động đóng sau 3 giây</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 