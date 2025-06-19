import { useState } from "react"
import { Bell, Menu, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import Sidebar from "./Sidebar"
import { Badge } from "./ui/badge"
import { SearchBar } from "./SearchBar"
import { useUser } from "../contexts/UserContext"

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

interface TopNavigationProps {
  user: User;
  onLogout: () => void;
  onOpenSettings?: () => void;
  currentView?: string;
  onViewChange?: (view: string) => void;
  onSearch?: (query: string) => void;
}

export function TopNavigation({ user, onLogout, onOpenSettings, currentView = 'home', onViewChange, onSearch }: TopNavigationProps) {
  const { user: contextUser, avatarImage } = useUser();
  const [sidebarView, setSidebarView] = useState(currentView);

  const handleViewChange = (view: string) => {
    setSidebarView(view);
    if (onViewChange) {
      onViewChange(view);
    }
  };
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Use UserContext data instead of props
  const displayUser = contextUser;
  const displayAvatar = avatarImage;

  return (
    <header className="sticky top-0 z-30 flex h-[70px] items-center border-b backdrop-blur-xl bg-white/80 px-6 shadow-sm">
      {/* Left section with menu button and logo */}
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar currentView={sidebarView} onViewChange={handleViewChange} />
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex items-center ml-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 p-[1px] shadow-lg shadow-indigo-500/20 mr-2">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path
                  d="M20 5C11.729 5 5 11.729 5 20C5 28.271 11.729 35 20 35C28.271 35 35 28.271 35 20C35 11.729 28.271 5 20 5Z"
                  fill="url(#logo-gradient)"
                />
                <path
                  d="M20 12C15.582 12 12 15.582 12 20C12 24.418 15.582 28 20 28C24.418 28 28 24.418 28 20C28 15.582 24.418 12 20 12Z"
                  fill="white"
                />
                <path
                  d="M20 16C17.791 16 16 17.791 16 20C16 22.209 17.791 24 20 24C22.209 24 24 22.209 24 20C24 17.791 22.209 16 20 16Z"
                  fill="url(#logo-gradient)"
                />
                <defs>
                  <linearGradient id="logo-gradient" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <span className="font-semibold text-violet-600">S-Connect</span>
        </div>
      </div>

      {/* Center section with search bar */}
      <div className="flex-1 flex justify-center mx-4">
        <div className="w-full max-w-xl">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>

      {/* Right section with action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full h-10 w-10"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Tin nhắn</span>
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs">
            3
          </Badge>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full h-10 w-10"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Thông báo</span>
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs">
            5
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-2">
              <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-violet-100">
                <AvatarImage src={displayAvatar} alt={displayUser.name} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                  {getInitials(displayUser.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl shadow-slate-200/50">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayUser.name}</p>
                <p className="text-xs leading-none text-slate-500">{displayUser.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="rounded-lg cursor-pointer"
              onClick={() => handleViewChange('profile')}
            >
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="rounded-lg cursor-pointer"
              onClick={onOpenSettings}
            >
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="rounded-lg cursor-pointer text-rose-500 focus:text-rose-500"
              onClick={onLogout}
            >
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
} 