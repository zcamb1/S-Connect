import { MockUser } from './mockUsers';

export interface MockComment {
  id: string;
  postId: string;
  user: MockUser;
  content: string;
  timestamp: string;
  likes: number;
  replies?: MockComment[];
}

export const mockComments: MockComment[] = [
  {
    id: 'comment1',
    postId: 'post1',
    user: {
      id: 'user1',
      name: 'Nguyễn Văn An',
      avatar: '👨‍💼',
      position: 'Trưởng phòng Marketing'
    },
    content: 'Thông tin rất hữu ích! Cảm ơn team đã chia sẻ.',
    timestamp: '2024-01-15T10:30:00Z',
    likes: 12
  },
  {
    id: 'comment2',
    postId: 'post1',
    user: {
      id: 'user2',
      name: 'Trần Thị Bình',
      avatar: '👩‍💻',
      position: 'Lập trình viên Senior'
    },
    content: 'Mình có thể áp dụng ngay vào dự án hiện tại. Thanks!',
    timestamp: '2024-01-15T11:15:00Z',
    likes: 8,
    replies: [
      {
        id: 'reply1',
        postId: 'post1',
        user: {
          id: 'user3',
          name: 'Lê Minh Cường',
          avatar: '👨‍🔧',
          position: 'Chuyên viên HR'
        },
        content: 'Đúng rồi, mình cũng đang cần thông tin này.',
        timestamp: '2024-01-15T11:45:00Z',
        likes: 3
      }
    ]
  },
  {
    id: 'comment3',
    postId: 'post2',
    user: {
      id: 'user4',
      name: 'Phạm Thị Dung',
      avatar: '👩‍⚕️',
      position: 'Y tá công ty'
    },
    content: 'Chúc mừng các bạn! Thành quả xứng đáng với nỗ lực.',
    timestamp: '2024-01-14T14:20:00Z',
    likes: 15
  },
  {
    id: 'comment4',
    postId: 'post2',
    user: {
      id: 'user5',
      name: 'Hoàng Văn Em',
      avatar: '👨‍🎓',
      position: 'Chuyên viên đào tạo'
    },
    content: 'Tuyệt vời! Hy vọng sẽ có thêm nhiều thành công nữa.',
    timestamp: '2024-01-14T15:10:00Z',
    likes: 9
  },
  {
    id: 'comment5',
    postId: 'post3',
    user: {
      id: 'user6',
      name: 'Vũ Thị Phương',
      avatar: '👩‍💼',
      position: 'Kế toán trưởng'
    },
    content: 'Chính sách mới rất rõ ràng và dễ hiểu. Cảm ơn HR!',
    timestamp: '2024-01-13T09:30:00Z',
    likes: 18
  },
  {
    id: 'comment6',
    postId: 'post4',
    user: {
      id: 'user7',
      name: 'Đỗ Minh Giang',
      avatar: '👨‍💻',
      position: 'DevOps Engineer'
    },
    content: 'Workshop rất bổ ích! Đã học được nhiều kỹ thuật mới.',
    timestamp: '2024-01-12T16:45:00Z',
    likes: 22
  },
  {
    id: 'comment7',
    postId: 'post5',
    user: {
      id: 'user8',
      name: 'Bùi Thị Hoa',
      avatar: '👩‍🏫',
      position: 'Trưởng phòng đào tạo'
    },
    content: 'Khóa học này sẽ giúp mọi người phát triển kỹ năng rất nhiều.',
    timestamp: '2024-01-11T13:20:00Z',
    likes: 14
  },
  {
    id: 'comment8',
    postId: 'post6',
    user: {
      id: 'user9',
      name: 'Ngô Văn Inh',
      avatar: '👨‍🔬',
      position: 'Chuyên viên an toàn'
    },
    content: 'Thông tin an toàn rất quan trọng. Mọi người nên đọc kỹ.',
    timestamp: '2024-01-10T11:30:00Z',
    likes: 25
  }
]; 