export interface MockPost {
  id: string;
  pageId: string;
  title: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  type: 'announcement' | 'news' | 'event' | 'policy' | 'achievement' | 'training';
}

export const mockPosts: MockPost[] = [
  // Tin tức công ty posts
  {
    id: 'post1',
    pageId: '1',
    title: 'Công ty đạt doanh thu kỷ lục trong quý 1/2024',
    content: 'Chúng tôi vui mừng thông báo rằng công ty đã đạt được doanh thu kỷ lục 150 tỷ VNĐ trong quý đầu tiên của năm 2024, tăng 25% so với cùng kỳ năm trước. Thành công này là kết quả của sự nỗ lực không ngừng của toàn thể nhân viên và chiến lược phát triển bền vững của công ty.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop',
    timestamp: '2024-01-15T09:00:00Z',
    likes: 234,
    comments: 45,
    shares: 12,
    type: 'achievement'
  },
  {
    id: 'post2',
    pageId: '1',
    title: 'Ra mắt sản phẩm mới - Ứng dụng quản lý thông minh',
    content: 'Sau 6 tháng nghiên cứu và phát triển, chúng tôi chính thức ra mắt ứng dụng quản lý thông minh SmartWork. Ứng dụng giúp tối ưu hóa quy trình làm việc và tăng năng suất lên đến 40%. Hiện tại đã có hơn 1000 doanh nghiệp đăng ký sử dụng.',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=300&fit=crop',
    timestamp: '2024-01-12T14:30:00Z',
    likes: 189,
    comments: 32,
    shares: 8,
    type: 'news'
  },
  {
    id: 'post3',
    pageId: '1',
    title: 'Thông báo nghỉ lễ Tết Nguyên đán 2024',
    content: 'Công ty thông báo lịch nghỉ Tết Nguyên đán Giáp Thìn 2024 từ ngày 8/2 đến 17/2/2024 (tức 29 tháng Chạp đến mùng 8 Tết). Công ty sẽ hoạt động trở lại bình thường từ ngày 19/2/2024. Chúc toàn thể nhân viên và gia đình một năm mới an khang thịnh vượng!',
    timestamp: '2024-01-10T16:00:00Z',
    likes: 156,
    comments: 28,
    shares: 15,
    type: 'announcement'
  },

  // HR - Nhân sự posts
  {
    id: 'post4',
    pageId: '2',
    title: 'Chính sách phúc lợi mới cho nhân viên 2024',
    content: 'Từ tháng 2/2024, công ty áp dụng chính sách phúc lợi mới bao gồm: Tăng 15% lương cơ bản, bảo hiểm sức khỏe toàn diện cho gia đình, hỗ trợ 50% học phí cho con em nhân viên, và chương trình du lịch hàng năm. Chính sách này nhằm ghi nhận đóng góp và tạo động lực cho đội ngũ nhân viên.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=300&fit=crop',
    timestamp: '2024-01-13T10:15:00Z',
    likes: 312,
    comments: 67,
    shares: 23,
    type: 'policy'
  },
  {
    id: 'post5',
    pageId: '2',
    title: 'Tuyển dụng 50 vị trí Developer và Tester',
    content: 'Công ty đang mở rộng quy mô và tuyển dụng 50 vị trí cho các phòng ban IT: 30 Developer (Java, React, Node.js), 15 Tester (Manual & Automation), 5 DevOps Engineer. Ứng viên có kinh nghiệm từ 1-5 năm. Mức lương hấp dẫn từ 15-40 triệu VNĐ. Hạn nộp hồ sơ: 31/1/2024.',
    timestamp: '2024-01-11T08:45:00Z',
    likes: 278,
    comments: 89,
    shares: 45,
    type: 'announcement'
  },

  // IT Department posts
  {
    id: 'post6',
    pageId: '3',
    title: 'Nâng cấp hệ thống bảo mật và backup dữ liệu',
    content: 'Phòng IT thông báo sẽ thực hiện nâng cấp hệ thống bảo mật và backup dữ liệu vào cuối tuần này (20-21/1). Trong thời gian này, một số dịch vụ có thể bị gián đoạn từ 2-4 tiếng. Chúng tôi sẽ thông báo chi tiết về thời gian cụ thể. Cảm ơn sự thông cảm của mọi người.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=300&fit=crop',
    timestamp: '2024-01-14T11:20:00Z',
    likes: 145,
    comments: 23,
    shares: 7,
    type: 'announcement'
  },
  {
    id: 'post7',
    pageId: '3',
    title: 'Workshop: Microservices Architecture với Docker',
    content: 'Phòng IT tổ chức workshop về Microservices Architecture sử dụng Docker và Kubernetes. Thời gian: 9h00 sáng thứ 7 ngày 27/1/2024 tại phòng họp lớn. Workshop dành cho các developer muốn tìm hiểu về kiến trúc hiện đại. Đăng ký tại: it@company.com',
    timestamp: '2024-01-12T15:30:00Z',
    likes: 198,
    comments: 34,
    shares: 12,
    type: 'training'
  },

  // Marketing Team posts
  {
    id: 'post8',
    pageId: '4',
    title: 'Chiến dịch "Tết sum vầy" đạt 2 triệu lượt tương tác',
    content: 'Chiến dịch marketing "Tết sum vầy" của chúng ta đã đạt được thành công vượt mong đợi với 2 triệu lượt tương tác trên các nền tảng social media, tăng 150% so với chiến dịch cùng kỳ năm trước. Đặc biệt, video TVC đã đạt 5 triệu lượt xem chỉ trong 1 tuần.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
    timestamp: '2024-01-14T13:45:00Z',
    likes: 267,
    comments: 41,
    shares: 18,
    type: 'achievement'
  },

  // Đào tạo & Phát triển posts
  {
    id: 'post9',
    pageId: '5',
    title: 'Khóa học "Leadership Skills" cho quản lý cấp trung',
    content: 'Phòng Đào tạo mở khóa học "Kỹ năng lãnh đạo hiệu quả" dành cho các quản lý cấp trung. Khóa học kéo dài 3 ngày (1-3/2/2024) với các chủ đề: Quản lý nhóm, Giao tiếp hiệu quả, Giải quyết xung đột. Giảng viên: TS. Nguyễn Văn A - chuyên gia quản trị từ ĐH Harvard.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop',
    timestamp: '2024-01-11T14:15:00Z',
    likes: 203,
    comments: 56,
    shares: 14,
    type: 'training'
  },

  // Sức khỏe & An toàn posts
  {
    id: 'post10',
    pageId: '6',
    title: 'Chương trình khám sức khỏe định kỳ 2024',
    content: 'Phòng Y tế thông báo lịch khám sức khỏe định kỳ năm 2024 cho toàn thể nhân viên. Thời gian: từ 5/2 đến 16/2/2024 tại Bệnh viện Đa khoa Quốc tế. Gói khám bao gồm: Khám tổng quát, xét nghiệm máu, chụp X-quang, siêu âm. Chi phí do công ty chi trả 100%.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=300&fit=crop',
    timestamp: '2024-01-10T09:30:00Z',
    likes: 289,
    comments: 72,
    shares: 25,
    type: 'announcement'
  },
  {
    id: 'post11',
    pageId: '6',
    title: 'Hướng dẫn an toàn lao động khi làm việc với máy móc',
    content: 'Để đảm bảo an toàn cho nhân viên, phòng An toàn lao động ban hành quy định mới về việc sử dụng thiết bị bảo hộ khi làm việc với máy móc. Tất cả nhân viên bắt buộc phải đeo kính bảo hộ, găng tay và giày an toàn. Vi phạm sẽ bị xử lý kỷ luật theo quy định.',
    timestamp: '2024-01-09T16:20:00Z',
    likes: 167,
    comments: 29,
    shares: 11,
    type: 'policy'
  }
]; 