export interface SuggestionItem {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  followers: number;
  type: 'page' | 'group' | 'user';
  description?: string;
}

export const suggestionsData: SuggestionItem[] = [
  {
    id: "ehs",
    name: "Bản tin EHS",
    avatar: "EHS",
    avatarColor: "emerald",
    followers: 1286,
    type: "page",
    description: "Trang chính thức về An toàn - Sức khỏe - Môi trường. Cập nhật quy định mới, hướng dẫn an toàn lao động, báo cáo môi trường và các chương trình bảo vệ sức khỏe nhân viên."
  },
  {
    id: "sw",
    name: "S/W Solutions Group",
    avatar: "SW",
    avatarColor: "purple",
    followers: 847,
    type: "group",
    description: "Cộng đồng các nhà phát triển phần mềm. Thảo luận về công nghệ mới, chia sẻ kinh nghiệm coding, review code và hỗ trợ giải quyết vấn đề kỹ thuật."
  },
  {
    id: "tech",
    name: "Tech Innovation Hub",
    avatar: "TI",
    avatarColor: "amber",
    followers: 1534,
    type: "page",
    description: "Trung tâm đổi mới công nghệ. Chia sẻ xu hướng AI, blockchain, cloud computing, cybersecurity và các workshop thực hành cho nhân viên IT."
  }
]; 