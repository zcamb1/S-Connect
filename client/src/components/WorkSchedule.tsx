import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Video,
  Coffee,
  Briefcase,
  AlertCircle
} from 'lucide-react'

// Utility function: Format date to local YYYY-MM-DD string
const formatDateLocal = (d: Date) => d.toLocaleDateString('en-CA') // Always returns 2025-06-15 in local time

interface WorkEvent {
  id: number
  title: string
  date: string
  time: string
  duration: string
  type: 'meeting' | 'task' | 'break' | 'training'
  location: string
  attendees?: string[]
  description: string
  priority: 'high' | 'medium' | 'low'
}

// Generate dates relative to today
const today = new Date()
const todayStr = formatDateLocal(today)
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)
const tomorrowStr = formatDateLocal(tomorrow)
const dayAfter = new Date(today)
dayAfter.setDate(today.getDate() + 2)
const dayAfterStr = formatDateLocal(dayAfter)

const initialEvents: WorkEvent[] = [
  {
    id: 1,
    title: "Họp team sprint planning",
    date: todayStr,
    time: "09:00",
    duration: "1h 30m",
    type: "meeting",
    location: "Phòng họp A",
    attendees: ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"],
    description: "Lên kế hoạch sprint mới, phân chia task và estimate",
    priority: "high"
  },
  {
    id: 2,
    title: "Review code feature login",
    date: todayStr,
    time: "14:00",
    duration: "45m",
    type: "task",
    location: "Online",
    description: "Review và merge pull request cho feature đăng nhập",
    priority: "medium"
  },
  {
    id: 3,
    title: "Coffee break với team",
    date: todayStr,
    time: "15:30",
    duration: "30m",
    type: "break",
    location: "Pantry",
    description: "Nghỉ giải lao và trao đổi thông tin",
    priority: "low"
  },
  {
    id: 4,
    title: "Training React Advanced",
    date: tomorrowStr,
    time: "10:00",
    duration: "2h",
    type: "training",
    location: "Phòng đào tạo",
    attendees: ["Development Team"],
    description: "Khóa học nâng cao về React hooks và performance",
    priority: "medium"
  },
  {
    id: 5,
    title: "Client demo presentation",
    date: tomorrowStr,
    time: "16:00",
    duration: "1h",
    type: "meeting",
    location: "Zoom",
    attendees: ["Client team", "Project Manager"],
    description: "Demo sản phẩm cho khách hàng và thu thập feedback",
    priority: "high"
  },
  {
    id: 6,
    title: "Phát triển API user management",
    date: dayAfterStr,
    time: "09:30",
    duration: "3h",
    type: "task",
    location: "Desk",
    description: "Implement các API cho quản lý user",
    priority: "high"
  }
]

export function WorkSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [events, setEvents] = useState<WorkEvent[]>(initialEvents)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<WorkEvent | null>(null)

  // Get events for selected date
  const selectedDateStr = formatDateLocal(selectedDate)
  const todayEvents = events.filter((event: WorkEvent) => event.date === selectedDateStr)

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const todayDate = new Date()
    const todayDateString = formatDateLocal(todayDate)
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const dateStr = formatDateLocal(date)
      const hasEvents = events.some((event: WorkEvent) => event.date === dateStr)
      const isToday = dateStr === todayDateString
      const isSelected = date.toDateString() === selectedDate.toDateString()
      const isCurrentMonth = date.getMonth() === month

      days.push({
        date,
        dateStr,
        day: date.getDate(),
        hasEvents,
        isToday,
        isSelected,
        isCurrentMonth
      })
    }
    
    return days
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4" />
      case 'task': return <Briefcase className="w-4 h-4" />
      case 'break': return <Coffee className="w-4 h-4" />
      case 'training': return <Video className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const calendarDays = generateCalendarDays()

  // CRUD Functions
  const handleAddEvent = () => {
    setEditingEvent(null)
    setShowAddModal(true)
  }

  const handleEditEvent = (event: WorkEvent) => {
    setEditingEvent(event)
    setShowAddModal(true)
  }

  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm('Bạn có chắc muốn xóa sự kiện này?')) {
      setEvents(events.filter(e => e.id !== eventId))
    }
  }

  const handleSaveEvent = (eventData: Partial<WorkEvent>) => {
    console.log('🔧 handleSaveEvent received:', eventData)
    
    if (editingEvent) {
      // Edit existing event
      console.log('🔧 Editing existing event:', editingEvent.id)
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { ...editingEvent, ...eventData } 
          : e
      ))
    } else {
      // Add new event
      const newEvent: WorkEvent = {
        id: Date.now(),
        title: eventData.title || '',
        date: eventData.date || formatDateLocal(selectedDate), // Use selected date as default
        time: eventData.time || '09:00',
        duration: eventData.duration || '1h',
        type: eventData.type || 'meeting',
        location: eventData.location || '',
        description: eventData.description || '',
        priority: eventData.priority || 'medium'
      }
      console.log('🔧 Creating new event:', newEvent)
      setEvents([...events, newEvent])
    }
    setShowAddModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text mb-2">
              📅 Lịch Làm Việc
            </h1>
            <p className="text-lg text-slate-600">Quản lý thời gian và công việc hiệu quả</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setViewMode('calendar')}
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Lịch
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Danh sách
            </Button>
            <Button 
              onClick={handleAddEvent}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm sự kiện
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar/List View */}
          <div className="lg:col-span-2">
            {viewMode === 'calendar' ? (
              <Card className="shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">
                      {currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                      <div key={day} className="p-3 text-center font-semibold text-slate-600 text-sm">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(day.date)}
                        className={`
                          p-3 text-center rounded-lg transition-all relative hover:bg-green-100
                          ${day.isCurrentMonth ? 'text-slate-900' : 'text-slate-400'}
                          ${day.isToday ? 'bg-blue-100 text-blue-700 font-bold' : ''}
                          ${day.isSelected ? 'bg-green-500 text-white' : ''}
                          ${day.hasEvents ? 'ring-2 ring-green-200' : ''}
                        `}
                      >
                        {day.day}
                        {day.hasEvents && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Tất cả sự kiện</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event: WorkEvent) => (
                      <div key={event.id} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(event.priority)}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-900">{event.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(event.date).toLocaleDateString('vi-VN')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {event.time} ({event.duration})
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {event.location}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 mt-2">{event.description}</p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditEvent(event)}
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="text-xs">✏️</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <span className="text-xs">🗑️</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Today's Events Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-xl bg-white/90 backdrop-blur-sm">
                             <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <AlertCircle className="w-5 h-5 text-green-600" />
                   {selectedDateStr === formatDateLocal(today) 
                     ? `Hôm nay (${selectedDate.toLocaleDateString('vi-VN')})` 
                     : `Ngày ${selectedDate.toLocaleDateString('vi-VN')}`}
                 </CardTitle>
               </CardHeader>
              <CardContent>
                {todayEvents.length > 0 ? (
                  <div className="space-y-4">
                    {todayEvents.map(event => (
                      <div key={event.id} className={`p-3 rounded-lg border-l-4 ${getPriorityColor(event.priority)}`}>
                        <div className="flex items-start gap-2">
                          {getEventIcon(event.type)}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-900 text-sm">{event.title}</h4>
                            <div className="text-xs text-slate-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.time} - {event.duration}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </div>
                            </div>
                            {event.attendees && (
                              <div className="text-xs text-slate-500 mt-2">
                                👥 {event.attendees.length} người tham gia
                              </div>
                            )}
                            <div className="flex gap-1 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditEvent(event)}
                                className="h-6 w-6 p-0 text-xs"
                              >
                                ✏️
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteEvent(event.id)}
                                className="h-6 w-6 p-0 text-xs text-red-600 hover:text-red-700"
                              >
                                🗑️
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Không có sự kiện nào trong ngày này</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingEvent ? 'Sửa sự kiện' : 'Thêm sự kiện mới'}
            </h3>
            
                         <form onSubmit={(e) => {
               e.preventDefault()
               const formData = new FormData(e.target as HTMLFormElement)
               const dateValue = formData.get('date') as string
               
               console.log('🔧 Form date value:', dateValue)
               console.log('🔧 About to save event with date:', dateValue)
               
               handleSaveEvent({
                 title: formData.get('title') as string,
                 date: dateValue, // Use the raw date string from form
                 time: formData.get('time') as string,
                 duration: formData.get('duration') as string,
                 type: formData.get('type') as 'meeting' | 'task' | 'break' | 'training',
                 location: formData.get('location') as string,
                 description: formData.get('description') as string,
                 priority: formData.get('priority') as 'high' | 'medium' | 'low'
               })
             }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề</label>
                <input
                  name="title"
                  type="text"
                  defaultValue={editingEvent?.title || ''}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nhập tiêu đề sự kiện"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ngày</label>
                  <input
                    name="date"
                    type="date"
                    defaultValue={editingEvent?.date || formatDateLocal(selectedDate)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giờ</label>
                  <input
                    name="time"
                    type="time"
                    defaultValue={editingEvent?.time || '09:00'}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Thời lượng</label>
                  <input
                    name="duration"
                    type="text"
                    defaultValue={editingEvent?.duration || '1h'}
                    placeholder="VD: 1h 30m"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loại</label>
                  <select
                    name="type"
                    defaultValue={editingEvent?.type || 'meeting'}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="meeting">Cuộc họp</option>
                    <option value="task">Công việc</option>
                    <option value="training">Đào tạo</option>
                    <option value="break">Nghỉ ngơi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Địa điểm</label>
                <input
                  name="location"
                  type="text"
                  defaultValue={editingEvent?.location || ''}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nhập địa điểm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Độ ưu tiên</label>
                <select
                  name="priority"
                  defaultValue={editingEvent?.priority || 'medium'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="high">Cao</option>
                  <option value="medium">Trung bình</option>
                  <option value="low">Thấp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                <textarea
                  name="description"
                  defaultValue={editingEvent?.description || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nhập mô tả chi tiết"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  {editingEvent ? 'Cập nhật' : 'Thêm sự kiện'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 