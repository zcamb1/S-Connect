export interface MockUser {
  id: string;
  name: string;
  avatar: string;
  position?: string;
  department?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'user1',
    name: 'Nguyễn Văn An',
    avatar: '👨‍💼',
    position: 'Trưởng phòng Marketing',
    department: 'Marketing'
  },
  {
    id: 'user2', 
    name: 'Trần Thị Bình',
    avatar: '👩‍💻',
    position: 'Lập trình viên Senior',
    department: 'IT'
  },
  {
    id: 'user3',
    name: 'Lê Minh Cường',
    avatar: '👨‍🔧',
    position: 'Chuyên viên HR',
    department: 'Nhân sự'
  },
  {
    id: 'user4',
    name: 'Phạm Thị Dung',
    avatar: '👩‍⚕️',
    position: 'Y tá công ty',
    department: 'Sức khỏe'
  },
  {
    id: 'user5',
    name: 'Hoàng Văn Em',
    avatar: '👨‍🎓',
    position: 'Chuyên viên đào tạo',
    department: 'Đào tạo'
  },
  {
    id: 'user6',
    name: 'Vũ Thị Phương',
    avatar: '👩‍💼',
    position: 'Kế toán trưởng',
    department: 'Tài chính'
  },
  {
    id: 'user7',
    name: 'Đỗ Minh Giang',
    avatar: '👨‍💻',
    position: 'DevOps Engineer',
    department: 'IT'
  },
  {
    id: 'user8',
    name: 'Bùi Thị Hoa',
    avatar: '👩‍🏫',
    position: 'Trưởng phòng đào tạo',
    department: 'Đào tạo'
  },
  {
    id: 'user9',
    name: 'Ngô Văn Inh',
    avatar: '👨‍🔬',
    position: 'Chuyên viên an toàn',
    department: 'An toàn lao động'
  },
  {
    id: 'user10',
    name: 'Đinh Thị Kim',
    avatar: '👩‍💼',
    position: 'Trợ lý giám đốc',
    department: 'Hành chính'
  }
]; 