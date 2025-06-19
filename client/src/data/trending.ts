export interface TrendingItem {
  id: string;
  tag: string;
  category: string;
  count: number;
  growth: number;
  description?: string;
}

export const trendingData: TrendingItem[] = [
  {
    id: "olympic",
    tag: "#OlympicSRV2025",
    category: "Đang thảo luận",
    count: 254,
    growth: 24,
    description: "Thảo luận về Olympic dành cho nhân viên công ty"
  },
  {
    id: "teambuilding",
    tag: "#TeamBuilding2025",
    category: "Sự kiện",
    count: 187,
    growth: 18,
    description: "Hoạt động xây dựng tinh thần đồng đội"
  },
  {
    id: "announcement",
    tag: "#ThôngBáoMới",
    category: "Tin tức",
    count: 132,
    growth: 12,
    description: "Các thông báo mới nhất từ công ty"
  }
]; 