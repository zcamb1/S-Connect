import React, { useState, useRef, useEffect } from "react"
import { Search, X, TrendingUp, Clock, User } from "lucide-react"
import { cn } from "../lib/utils"

interface SearchBarProps {
  onSearch?: (query: string) => void
}

interface SearchHistoryItem {
  id: number
  text: string
  icon: any
  timestamp?: string
}

interface TrendingItem {
  id: number
  text: string
  count: number
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close expanded search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleClear = () => {
    setSearchQuery("")
    inputRef.current?.focus()
  }

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Save to search history
      const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      const newHistory = [
        { id: Date.now(), text: query.trim(), icon: Clock, timestamp: new Date().toISOString() },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...searchHistory.filter((item: any) => item.text !== query.trim()).slice(0, 4) // Keep last 5, avoid duplicates
      ]
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      
      // Call parent search handler
      onSearch?.(query.trim())
      setIsFocused(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery)
    }
  }

  const handleSuggestionClick = (searchText: string) => {
    setSearchQuery(searchText)
    handleSearch(searchText)
  }

  // Get real search history from localStorage
  const getRecentSearches = () => {
    try {
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      return history.slice(0, 3)
    } catch {
      return [
    { id: 1, text: "Olympic SRV 2025", icon: Clock },
    { id: 2, text: "Lịch họp tuần này", icon: Clock },
    { id: 3, text: "Nguyễn Văn A", icon: User },
  ]
    }
  }

  const recentSearches = getRecentSearches()

  const trendingSearches = [
    { id: 1, text: "#OlympicSRV2025", count: 254 },
    { id: 2, text: "#TeamBuilding2025", count: 187 },
    { id: 3, text: "#ThôngBáoMới", count: 132 },
  ]

  return (
    <div ref={searchContainerRef} className="relative z-50 w-full">
      <div
        className={cn(
          "relative flex items-center transition-all duration-300 ease-in-out",
          isFocused
            ? "bg-white rounded-t-2xl shadow-2xl shadow-violet-500/20 border border-violet-200 border-b-0"
            : "bg-white/80 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50",
        )}
      >
        <div
          className={cn(
            "absolute left-4 transition-all duration-300",
            isFocused ? "text-violet-500" : "text-slate-400",
          )}
        >
          <Search className="h-5 w-5" />
        </div>

        <input
          ref={inputRef}
          type="search"
          placeholder="Tìm kiếm mọi người, trang tin và nhóm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyPress={handleKeyPress}
          className={cn(
            "w-full py-3 pl-12 pr-12 bg-transparent border-none focus:outline-none focus:ring-0",
            "text-slate-900 placeholder:text-slate-400 text-base",
            "transition-all duration-300 ease-in-out",
          )}
        />

        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Expanded search dropdown */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-2xl shadow-violet-500/20 border border-violet-200 border-t-0 overflow-hidden">
          <div className="p-4">
            {searchQuery ? (
              <div className="text-center py-2 text-slate-500">Đang tìm kiếm "{searchQuery}"...</div>
            ) : (
              <>
                {/* Recent searches */}
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                    Tìm kiếm gần đây
                  </h3>
                  <div className="space-y-1">
                    {(recentSearches as SearchHistoryItem[]).map((item: SearchHistoryItem) => (
                      <button
                        key={item.id}
                        onClick={() => handleSuggestionClick(item.text)}
                        className="flex items-center gap-3 w-full p-2 hover:bg-violet-50 rounded-xl text-left transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          {item.icon === Clock ? <Clock className="h-4 w-4" /> : 
                           item.icon === User ? <User className="h-4 w-4" /> : 
                           <Clock className="h-4 w-4" />}
                        </div>
                        <span className="text-sm text-slate-700">{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending searches */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Xu hướng tìm kiếm
                  </h3>
                  <div className="space-y-1">
                    {(trendingSearches as TrendingItem[]).map((item: TrendingItem) => (
                      <button
                        key={item.id}
                        onClick={() => handleSuggestionClick(item.text)}
                        className="flex items-center justify-between w-full p-2 hover:bg-violet-50 rounded-xl text-left transition-colors"
                      >
                        <span className="text-sm text-slate-700">{item.text}</span>
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                          {item.count} người
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Nhấn <kbd className="px-2 py-0.5 bg-white rounded border border-slate-200 mx-1">Enter</kbd> để tìm kiếm
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 