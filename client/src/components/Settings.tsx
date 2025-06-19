import { useState } from "react"
import { Settings as SettingsIcon, User, Shield, Bell, X, Save, Trash2, Key, Globe, Moon, Sun, Monitor } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useUser } from "../contexts/UserContext"
import { useTheme } from "../contexts/ThemeContext"

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

interface NotificationSettings {
  posts: boolean
  comments: boolean
  likes: boolean
  follows: boolean
  mentions: boolean
}

interface SidebarSettings {
  hiddenSuggestions: string[]
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('appearance')
  const [isLoading, setIsLoading] = useState(false)
  
  // Security settings
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    posts: true,
    comments: true,
    likes: false,
    follows: true,
    mentions: true
  })

  // Sidebar settings
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>({
    hiddenSuggestions: JSON.parse(localStorage.getItem('hiddenSuggestions') || '[]')
  })

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }
    if (newPassword.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Mật khẩu đã được thay đổi thành công!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      alert('Có lỗi xảy ra khi đổi mật khẩu!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      localStorage.setItem('notificationSettings', JSON.stringify(notifications))
      alert('Cài đặt thông báo đã được lưu!')
    } catch (error) {
      alert('Có lỗi xảy ra!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!'
    )
    if (confirmed) {
      alert('Chức năng xóa tài khoản sẽ được triển khai sau!')
    }
  }

  const handleRestoreHiddenSuggestions = () => {
    setSidebarSettings({ hiddenSuggestions: [] })
    localStorage.removeItem('hiddenSuggestions')
    alert('Đã khôi phục tất cả gợi ý đã ẩn!')
    // Reload page to refresh sidebar
    window.location.reload()
  }

  const handleRemoveHiddenItem = (itemId: string) => {
    const newHiddenList = sidebarSettings.hiddenSuggestions.filter(id => id !== itemId)
    setSidebarSettings({ hiddenSuggestions: newHiddenList })
    localStorage.setItem('hiddenSuggestions', JSON.stringify(newHiddenList))
    alert('Đã khôi phục gợi ý!')
    // Reload page to refresh sidebar
    window.location.reload()
  }

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <SettingsIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Cài đặt</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 border-r border-slate-200 dark:border-slate-700 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  activeTab === 'appearance' 
                    ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 font-medium' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Monitor className="h-5 w-5" />
                Giao diện
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  activeTab === 'security' 
                    ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 font-medium' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Shield className="h-5 w-5" />
                Bảo mật
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  activeTab === 'notifications' 
                    ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 font-medium' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Bell className="h-5 w-5" />
                Thông báo
              </button>
              <button
                onClick={() => setActiveTab('sidebar')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  activeTab === 'sidebar' 
                    ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 font-medium' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Globe className="h-5 w-5" />
                Thanh bên
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-violet-600" />
                    Chế độ hiển thị
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          theme === 'light'
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <Sun className="h-6 w-6 text-yellow-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sáng</span>
                      </button>
                      
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          theme === 'dark'
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <Moon className="h-6 w-6 text-blue-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tối</span>
                      </button>
                      
                      <button
                        onClick={() => setTheme('system')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          theme === 'system'
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <Monitor className="h-6 w-6 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tự động</span>
                      </button>
                    </div>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {theme === 'light' && 'Luôn sử dụng chế độ sáng'}
                      {theme === 'dark' && 'Luôn sử dụng chế độ tối'}
                      {theme === 'system' && 'Tự động chuyển đổi theo cài đặt hệ thống'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Key className="h-5 w-5 text-violet-600" />
                    Đổi mật khẩu
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleChangePassword}
                    disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                    className="mt-6 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
                  >
                    {isLoading ? 'Đang thay đổi...' : 'Đổi mật khẩu'}
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Xóa tài khoản
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Sau khi xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục.
                  </p>
                  <Button
                    onClick={handleDeleteAccount}
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Xóa tài khoản
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-violet-600" />
                    Cài đặt thông báo
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'posts', label: 'Bài viết mới từ người theo dõi' },
                      { key: 'comments', label: 'Bình luận trên bài viết của bạn' },
                      { key: 'likes', label: 'Lượt thích bài viết' },
                      { key: 'follows', label: 'Người theo dõi mới' },
                      { key: 'mentions', label: 'Được nhắc đến trong bình luận' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                        <span className="text-slate-700">{label}</span>
                        <button
                          onClick={() => toggleNotification(key as keyof NotificationSettings)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications[key as keyof NotificationSettings] 
                              ? 'bg-violet-600' 
                              : 'bg-slate-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications[key as keyof NotificationSettings] 
                                ? 'translate-x-6' 
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={handleSaveNotifications}
                    disabled={isLoading}
                    className="mt-6 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
                  >
                    {isLoading ? 'Đang lưu...' : 'Lưu cài đặt'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'sidebar' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-violet-600" />
                    Quản lý thanh bên
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-slate-50">
                      <h4 className="font-medium text-slate-800 mb-2">Gợi ý đã ẩn</h4>
                      <p className="text-sm text-slate-600 mb-4">
                        Các trang và nhóm bạn đã ẩn khỏi thanh bên phải
                      </p>
                      
                      {sidebarSettings.hiddenSuggestions.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">Không có gợi ý nào bị ẩn</p>
                      ) : (
                        <div className="space-y-2">
                          {sidebarSettings.hiddenSuggestions.map((itemId) => (
                            <div key={itemId} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                              <span className="text-sm text-slate-700">ID: {itemId}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveHiddenItem(itemId)}
                                className="text-xs"
                              >
                                Khôi phục
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {sidebarSettings.hiddenSuggestions.length > 0 && (
                        <Button
                          onClick={handleRestoreHiddenSuggestions}
                          variant="outline"
                          className="mt-4 w-full"
                        >
                          Khôi phục tất cả gợi ý đã ẩn
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 