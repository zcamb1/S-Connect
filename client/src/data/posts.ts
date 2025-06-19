export interface Post {
  id: string;
  pageId: string;
  title: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

export const postsData: Post[] = [
  // Posts from EHS page
  {
    id: "ehs-1",
    pageId: "ehs",
    title: "Hướng dẫn an toàn lao động mới nhất",
    content: "Công ty vừa cập nhật quy định an toàn lao động theo tiêu chuẩn quốc tế. Tất cả nhân viên cần tham gia khóa đào tạo bắt buộc trong tháng này. Khóa học sẽ bao gồm: sử dụng thiết bị bảo hộ, quy trình xử lý sự cố, và các biện pháp phòng ngừa tai nạn lao động.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&crop=center",
    timestamp: "2 giờ trước",
    likes: 45,
    comments: 12,
    shares: 8
  },
  {
    id: "ehs-2", 
    pageId: "ehs",
    title: "Báo cáo môi trường tháng 12",
    content: "Kết quả kiểm tra chất lượng không khí và nước thải tại các nhà máy đều đạt tiêu chuẩn cho phép. Chỉ số PM2.5 giảm 15% so với tháng trước nhờ các biện pháp cải thiện hệ thống lọc khí.",
    image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop&crop=center",
    timestamp: "1 ngày trước",
    likes: 32,
    comments: 6,
    shares: 4
  },
  {
    id: "ehs-3",
    pageId: "ehs", 
    title: "Chương trình tái chế 2025",
    content: "Ra mắt chương trình tái chế toàn diện với mục tiêu giảm 50% rác thải nhựa. Các thùng phân loại rác mới đã được lắp đặt tại tất cả các tầng.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop&crop=center",
    timestamp: "2 ngày trước",
    likes: 28,
    comments: 9,
    shares: 6
  },
  // Posts from Tech Innovation Hub
  {
    id: "tech-1",
    pageId: "tech", 
    title: "AI và tương lai của công nghệ",
    content: "Khám phá những xu hướng AI mới nhất và ứng dụng trong doanh nghiệp. Webinar sẽ diễn ra vào thứ 6 tuần này với sự tham gia của các chuyên gia hàng đầu từ Google, Microsoft và OpenAI.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center",
    timestamp: "3 giờ trước",
    likes: 89,
    comments: 23,
    shares: 15
  },
  {
    id: "tech-2",
    pageId: "tech",
    title: "Blockchain trong quản lý chuỗi cung ứng",
    content: "Tìm hiểu cách blockchain đang thay đổi cách chúng ta quản lý và theo dõi chuỗi cung ứng toàn cầu. Công nghệ này giúp tăng tính minh bạch và giảm thiểu gian lận trong thương mại.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&crop=center",
    timestamp: "5 giờ trước", 
    likes: 67,
    comments: 18,
    shares: 11
  },
  {
    id: "tech-3",
    pageId: "tech",
    title: "Workshop: Cloud Computing với AWS",
    content: "Tham gia workshop thực hành về AWS Cloud Services. Học cách deploy ứng dụng, quản lý database và tối ưu hóa chi phí. Đăng ký ngay để nhận chứng chỉ AWS!",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&crop=center",
    timestamp: "1 ngày trước",
    likes: 156,
    comments: 34,
    shares: 22
  },
  {
    id: "tech-4",
    pageId: "tech",
    title: "Cybersecurity: Bảo mật trong thời đại số",
    content: "Cập nhật các mối đe dọa bảo mật mới nhất và cách phòng chống. Hướng dẫn sử dụng 2FA, VPN và các công cụ bảo mật cần thiết cho nhân viên làm việc từ xa.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop&crop=center",
    timestamp: "2 ngày trước",
    likes: 73,
    comments: 15,
    shares: 9
  }
]; 