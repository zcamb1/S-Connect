import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { ArrowLeft, MoreHorizontal, Bookmark, Share2, Heart, MessageCircle, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { PostInteraction } from "./PostInteraction"
import { showSuccessToast, showErrorToast } from "../../../utils/toast"
import { postsData } from './NewsFeed'

// Detailed fake data for each post
const postDetailData: Record<number, any> = {
  1: {
    id: 1,
    author: {
      name: "Tin tức",
      fallback: "TT",
      role: "Tin tức",
      department: "Đăng bởi Quản lý trang • 2 giờ trước",
      avatarColor: "from-violet-500 to-purple-600",
      ringColor: "ring-violet-100 shadow-violet-500/10",
      badgeColor: "from-violet-500/10 to-purple-500/10 text-violet-700 hover:from-violet-500/20 hover:to-purple-500/20"
    },
    title: "[SRV OLYMPIC 2025] LỊCH THI ĐẤU BỘ MÔN BÓNG BÀN",
    content: "Chào mừng các vận động viên tham gia giải đấu bóng bàn Olympic SRV 2025! Dưới đây là lịch thi đấu chi tiết cho các vòng đấu sắp tới.",
    detailedContent: `
      🏓 **LỊCH THI ĐẤU OLYMPIC SRV 2025 - BỘ MÔN BÓNG BÀN**

      📅 **Thời gian:** 15-17/03/2025
      📍 **Địa điểm:** Nhà thi đấu đa năng SRV Tower
      🏆 **Giải thưởng:** 50 triệu VNĐ tổng giá trị

      **LỊCH THI ĐẤU CHI TIẾT:**

      🗓️ **Ngày 15/03 (Thứ 6):**
      • 08:00 - 09:30: Vòng loại bảng A (8 đội)
      • 10:00 - 11:30: Vòng loại bảng B (8 đội)  
      • 13:30 - 15:00: Vòng loại bảng C (8 đội)
      • 15:30 - 17:00: Vòng loại bảng D (8 đội)

      🗓️ **Ngày 16/03 (Thứ 7):**
      • 08:00 - 10:00: Vòng 1/8 (16 đội → 8 đội)
      • 10:30 - 12:00: Tứ kết (8 đội → 4 đội)
      • 13:30 - 15:00: Bán kết (4 đội → 2 đội)
      • 15:30 - 16:30: Tranh hạng 3

      🗓️ **Ngày 17/03 (Chủ nhật):**
      • 14:00 - 16:00: **CHUNG KẾT** 🏆
      • 16:30 - 17:30: Lễ trao giải và kết thúc

      **QUY ĐỊNH THAM GIA:**
      ✅ Mỗi phòng ban tối đa 2 đội (4 người/đội)
      ✅ Đăng ký trước 10/03/2025
      ✅ Phí tham gia: 200.000 VNĐ/đội
      ✅ Bao gồm: Áo thi đấu, dụng cụ, suất ăn 3 ngày

      **LIÊN HỆ ĐĂNG KÝ:**
      📞 Ms. Lan - Phòng Nhân sự: 0909.123.456
      📧 Email: olympic2025@srv.com.vn
      🏢 Địa chỉ: Tầng 5, SRV Tower, Q.1, TP.HCM

      #OlympicSRV2025 #BóngBàn #TeamBuilding #SRV
    `,
    images: [
      {
        src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=450&fit=crop&crop=center",
        alt: "Olympic Table Tennis Tournament"
      },
      {
        src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=450&fit=crop&crop=center", 
        alt: "Table Tennis Competition"
      }
    ],
    stats: { likes: 4800, comments: 32, shares: 156 },
    tags: ["#OlympicSRV2025", "#BóngBàn", "#TeamBuilding", "#SRV"]
  },
  
  2: {
    id: 2,
    author: {
      name: "Minh Hoang",
      fallback: "MH",
      role: "Nhân viên", 
      department: "HR Manager • 4 giờ trước",
      avatarColor: "from-green-500 to-emerald-600",
      ringColor: "ring-green-100 shadow-green-500/10",
      badgeColor: "from-green-500/10 to-emerald-500/10 text-emerald-700 hover:from-green-500/20 hover:to-emerald-500/20"
    },
    title: "[TEAM BUILDING 2025] HOẠT ĐỘNG VUI CHƠI CUỐI TUẦN",
    content: "Cuối tuần này chúng ta sẽ có hoạt động team building tại khu du lịch sinh thái. Đăng ký ngay để có chỗ nhé!",
    detailedContent: `
      🌿 **TEAM BUILDING 2025 - KHÁM PHÁ THIÊN NHIÊN**

      🗓️ **Thời gian:** 22-23/03/2025 (Thứ 7 - Chủ nhật)
      🏖️ **Địa điểm:** Khu du lịch sinh thái Cần Giờ 
      👥 **Đối tượng:** Toàn bộ nhân viên SRV và gia đình

      **CHƯƠNG TRÌNH 2 NGÀY 1 ĐÊM:**

      🌅 **NGÀY 1 - THỨ 7 (22/03):**
      • 06:30: Tập trung tại SRV Tower, khởi hành
      • 08:30: Đến Cần Giờ, check-in homestay
      • 09:30: Game phá băng "Kết nối đồng đội"
      • 11:00: **Hoạt động chính:**
        - 🚴‍♀️ Đạp xe thám hiểm rừng ngập mặn
        - 🎣 Câu cá & BBQ bên sông
        - 🏊‍♂️ Bơi lội & thể thao bãi biển
      • 12:30: Buffet trưa hải sản tươi sống
      • 14:00: Workshop "Xây dựng tinh thần đội nhóm"
      • 16:00: Nghỉ ngơi tự do
      • 18:30: Gala dinner & chương trình văn nghệ
      • 21:00: Đêm hội lửa trại, ca hát

      🌄 **NGÀY 2 - CHỦ NHẬT (23/03):**
      • 06:00: Yoga buổi sáng bên biển
      • 07:30: Trekking rừng & chụp ảnh kỷ niệm  
      • 09:00: Ăn sáng đặc sản địa phương
      • 10:30: **Challenge cuối cùng:** "Vượt chướng ngại vật"
      • 12:00: Lễ trao giải & kết thúc chương trình
      • 13:00: Về lại TP.HCM

      **CHI PHÍ & ĐĂNG KÝ:**
      💰 **Hoàn toàn MIỄN PHÍ** (Công ty tài trợ 100%)
      📝 Đăng ký trước 18/03/2025
      🎁 Tặng kèm: Áo team, nón, balo du lịch

      **LƯU Ý QUAN TRỌNG:**
      ✅ Mang theo CMND, giấy tờ cá nhân
      ✅ Đồ bơi, kem chống nắng, thuốc cá nhân
      ✅ Tinh thần hào hứng và sẵn sàng vui chơi!

      **ĐĂNG KÝ NGAY:**
      📱 Minh Hoàng - HR: 0987.654.321
      📧 teambuilding2025@srv.com.vn

      #TeamBuilding2025 #CầnGiờ #SRVFamily #VuiChơiCùngNhau
    `,
    images: [
      {
        src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=450&fit=crop&crop=center",
        alt: "Team Building Activity"
      },
      {
        src: "https://images.unsplash.com/photo-1539541417736-3d44c90da315?w=800&h=450&fit=crop&crop=center",
        alt: "Beach Team Building"
      }
    ],
    stats: { likes: 2341, comments: 89, shares: 67 },
    tags: ["#TeamBuilding2025", "#CầnGiờ", "#SRVFamily", "#VuiChơi"]
  },

  3: {
    id: 3,
    author: {
      name: "Ban Giám Đốc",
      fallback: "CEO",
      role: "Lãnh đạo",
      department: "Thông báo chính thức • 1 ngày trước",
      avatarColor: "from-amber-500 to-orange-600",
      ringColor: "ring-amber-100 shadow-amber-500/10",
      badgeColor: "from-amber-500/10 to-orange-500/10 text-orange-700 hover:from-amber-500/20 hover:to-orange-500/20"
    },
    title: "[THÀNH TỰU] CÔNG TY VINH DANH TOP 10 DOANH NGHIỆP XUẤT SẮC",
    content: "Chúng tôi tự hào thông báo rằng công ty đã được vinh danh trong danh sách Top 10 doanh nghiệp xuất sắc năm 2024.",
    detailedContent: `
      🏆 **CÔNG TY SRV VINH DANH TOP 10 DOANH NGHIỆP XUẤT SẮC VIỆT NAM 2024**

      🎉 Chúng tôi vô cùng tự hào thông báo SRV đã chính thức được trao danh hiệu **"Top 10 Doanh nghiệp Xuất sắc Việt Nam 2024"** tại Lễ vinh danh do Phòng Thương mại và Công nghiệp Việt Nam (VCCI) tổ chức.

      **🏅 THÀNH TỰU NỔI BẬT:**
      
      📈 **Tăng trưởng doanh thu:** 245% so với năm 2023
      👥 **Quy mô nhân sự:** Từ 50 → 180 nhân viên
      🌏 **Mở rộng thị trường:** 3 quốc gia ASEAN
      💡 **Sản phẩm mới:** 12 giải pháp công nghệ
      🤝 **Đối tác chiến lược:** 50+ doanh nghiệp lớn

      **📊 CÁC CHỈ SỐ KINH DOANH 2024:**
      • Doanh thu: 150 tỷ VNĐ (+245%)
      • Lợi nhuận: 35 tỷ VNĐ (+180%)
      • Thị phần: Top 3 trong ngành
      • Chỉ số hài lòng khách hàng: 98.5%
      • Đánh giá nhân viên: 4.8/5.0

      **🏆 DANH HIỆU & GIẢI THƯỞNG 2024:**
      ✅ Top 10 Doanh nghiệp Xuất sắc Việt Nam
      ✅ Sao Vàng Đất Việt - Sản phẩm Chất lượng cao
      ✅ Top 100 Nơi làm việc tốt nhất Việt Nam
      ✅ Doanh nghiệp Công nghệ số tiên phong
      ✅ Giải thưởng Trách nhiệm Xã hội

      **👏 CẢM ƠN TOÀN THỂ NHÂN VIÊN:**
      Thành công này không thể đạt được nếu không có sự đóng góp tận tâm của từng thành viên trong gia đình SRV. Mỗi cá nhân đều là một mắt xích quan trọng tạo nên chuỗi thành công này.

      **🚀 KẾ HOẠCH 2025:**
      • Mục tiêu doanh thu: 300 tỷ VNĐ
      • Mở rộng văn phòng tại Singapore, Malaysia
      • Ra mắt 5 sản phẩm AI đột phá
      • Tuyển dụng thêm 100 nhân tài

      **🎁 THƯỞNG THÀNH TÍCH:**
      💰 Thưởng Tết 2025: 3-5 tháng lương
      🏖️ Du lịch Hàn Quốc toàn công ty (03/2025)
      📈 Tăng lương trung bình: 15-25%
      🏠 Hỗ trợ mua nhà: 500 triệu VNĐ

      Một lần nữa, xin chân thành cảm ơn tất cả các bạn! Hãy cùng nhau tiếp tục viết nên những thành công mới trong năm 2025! 🚀

      #SRVSuccess #Top10Enterprise #TeamWork #VietNam2024
    `,
    images: [
      {
        src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop&crop=center",
        alt: "Company Achievement Award"
      },
      {
        src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=450&fit=crop&crop=center",
        alt: "Award Ceremony"
      }
    ],
    stats: { likes: 5672, comments: 156, shares: 234 },
    tags: ["#SRVSuccess", "#Top10Enterprise", "#TeamWork", "#VietNam2024"]
  },

  4: {
    id: 4,
    author: {
      name: "IT Department",
      fallback: "IT",
      role: "Kỹ thuật",
      department: "Team Leader • 6 giờ trước",
      avatarColor: "from-blue-500 to-cyan-600",
      ringColor: "ring-blue-100 shadow-blue-500/10",
      badgeColor: "from-blue-500/10 to-cyan-500/10 text-blue-700 hover:from-blue-500/20 hover:to-cyan-500/20"
    },
    title: "[CẬP NHẬT] TRIỂN KHAI HỆ THỐNG S-CONNECT MỚI",
    content: "Hệ thống S-Connect đã được cập nhật với giao diện mới hiện đại hơn! Các tính năng mới bao gồm: Dark mode, Notification center, Real-time chat.",
    detailedContent: `
      🚀 **S-CONNECT 3.0 - CẬP NHẬT MAJOR VỚI NHIỀU TÍNH NĂNG ĐỘT PHÁ**

      📅 **Thời gian triển khai:** 01/01/2025 - 15/01/2025
      ⚡ **Phiên bản:** S-Connect 3.0 Beta
      🎯 **Mục tiêu:** Nâng cao trải nghiệm người dùng 300%

      **🔥 TÍNH NĂNG MỚI CỰC HOT:**

      🌙 **Dark Mode Premium:**
      • 3 chế độ: Light, Dark, Auto
      • Bảo vệ mắt khi làm việc đêm
      • Tiết kiệm pin thiết bị 40%
      • Giao diện đẹp mắt, chuyên nghiệp

      🔔 **Notification Center Thông minh:**
      • AI phân loại thông báo tự động
      • Ưu tiên theo mức độ quan trọng
      • Tóm tắt nội dung bằng AI
      • Reminder thông minh

      💬 **Real-time Chat Siêu tốc:**
      • Tốc độ gửi tin nhắn < 100ms
      • Video call HD quality 4K
      • Share screen cùng lúc 50 người
      • Voice message chất lượng cao
      • Emoji reactions và stickers

      📊 **Analytics Dashboard:**
      • Thống kê hoạt động cá nhân
      • Báo cáo hiệu suất team
      • Insights thông minh
      • Export data linh hoạt

      🔐 **Security Enhancement:**
      • 2FA bắt buộc cho admin
      • End-to-end encryption
      • Audit log chi tiết
      • Anti-phishing protection

      **🛠️ TECHNICAL IMPROVEMENTS:**

      ⚡ **Performance Upgrade:**
      • Load time giảm 65%
      • RAM usage giảm 40%  
      • CPU usage tối ưu 50%
      • Bandwidth tiết kiệm 30%

      🎨 **UI/UX Redesign:**
      • Design system mới theo Material 3.0
      • Responsive 100% các thiết bị
      • Accessibility tốt hơn
      • Animation mượt mà 60fps

      **📱 MOBILE APP UPDATES:**
      • Offline mode - làm việc không internet
      • Biometric login (Face ID, Fingerprint)
      • Quick actions từ notification
      • Widget cho home screen

      **🔧 HỖ TRỢ & HƯỚNG DẪN:**

      📚 **Training Sessions:**
      • 20/01: Hướng dẫn tính năng mới (2 PM)
      • 22/01: Q&A với dev team (4 PM)
      • 25/01: Tips & tricks nâng cao (10 AM)

      📞 **Liên hệ hỗ trợ:**
      • Hotline IT: 1900.xxxx (24/7)
      • Email: it-support@srv.com.vn
      • Slack: #s-connect-support
      • Ticket system: help.srv.com.vn

      **⚠️ LƯU Ý QUAN TRỌNG:**
      ✅ Backup dữ liệu trước khi update
      ✅ Clear cache browser sau khi cập nhật
      ✅ Đăng xuất và đăng nhập lại
      ✅ Báo lỗi ngay nếu gặp vấn đề

      Cảm ơn mọi người đã sabr chờ đợi! Hãy trải nghiệm và feedback để IT team tiếp tục cải thiện nhé! 💪

      #SConnect3 #TechUpdate #DigitalTransformation #Innovation
    `,
    specialContent: {
      type: "tip",
      content: "💡 Mẹo: Nhấn Ctrl+D để bookmark trang này! Press F11 để full screen experience!"
    },
    stats: { likes: 1234, comments: 67, shares: 89 },
    tags: ["#SConnect3", "#TechUpdate", "#Innovation", "#DigitalTransformation"]
  },

  5: {
    id: 5,
    author: {
      name: "Phòng Đào Tạo",
      fallback: "TR",
      role: "Giáo dục",
      department: "Training Manager • 8 giờ trước",
      avatarColor: "from-purple-500 to-pink-600",
      ringColor: "ring-purple-100 shadow-purple-500/10",
      badgeColor: "from-purple-500/10 to-pink-500/10 text-purple-700 hover:from-purple-500/20 hover:to-pink-500/20"
    },
    title: "[KHÓA HỌC] CHƯƠNG TRÌNH ĐÀO TẠO DIGITAL MARKETING 2025",
    content: "Mở đăng ký khóa học Digital Marketing miễn phí cho nhân viên! Thời gian: 3 tuần, học online.",
    detailedContent: `
      🎓 **CHƯƠNG TRÌNH ĐÀO TẠO DIGITAL MARKETING 2025**
      
      🚀 **NÂNG CAP KỸ NĂNG - THĂNG TIẾN SỰ NGHIỆP**

      📅 **Thời gian:** 01/02 - 22/02/2025 (3 tuần)
      🏫 **Hình thức:** Online + Offline kết hợp
      💰 **Chi phí:** HOÀN TOÀN MIỄN PHÍ (Công ty tài trợ 100%)
      👨‍🏫 **Giảng viên:** CEO Google Vietnam, CMO Shopee, Expert Facebook
      📜 **Chứng chỉ:** Google & Facebook Official Certificate

      **📚 CURRICULUM CHI TIẾT:**

      **🗓️ TUẦN 1: FOUNDATION (01-07/02)**
      • **Ngày 1-2:** Digital Marketing Overview
        - Landscape thị trường số Việt Nam
        - Customer journey mapping
        - Marketing funnel optimization
        - Case study: Thành công của Tiki, Grab

      • **Ngày 3-4:** Content Marketing Mastery
        - Content strategy và planning
        - Storytelling cho brand
        - Visual content design
        - Video marketing trending

      • **Ngày 5:** SEO Foundation
        - On-page SEO techniques
        - Keyword research tools
        - Technical SEO basics
        - Local SEO for business

      **🗓️ TUẦN 2: ADVANCED (08-14/02)**
      • **Ngày 1-2:** Social Media Marketing
        - Facebook Ads optimization
        - Instagram marketing strategy
        - TikTok for business
        - LinkedIn B2B marketing
        - Influencer collaboration

      • **Ngày 3-4:** Google Ads Mastery
        - Search Ads campaigns
        - Display & Video ads
        - Shopping ads setup
        - Performance tracking

      • **Ngày 5:** Email Marketing & Automation
        - Email sequence design
        - Marketing automation tools
        - CRM integration
        - Lead nurturing strategies

      **🗓️ TUẦN 3: PRACTICUM (15-22/02)**
      • **Ngày 1-3:** Real Project Execution
        - Team project với brand thật
        - Campaign planning
        - Budget allocation
        - Creative development

      • **Ngày 4-5:** Analytics & Optimization
        - Google Analytics 4
        - Facebook Analytics
        - ROI calculation
        - A/B testing methodology

      **🎯 HỌC XONG BẠN SẼ:**
      ✅ Lên strategy marketing hoàn chỉnh
      ✅ Chạy ads Facebook, Google hiệu quả
      ✅ Tạo content viral trên social media
      ✅ Phân tích data và optimize campaign
      ✅ Tăng sales/leads cho doanh nghiệp
      ✅ Có portfolio thực tế để ứng tuyển

      **👨‍🏫 ĐỘI NGŨ GIẢNG VIÊN ALL-STAR:**
      🌟 **Mr. David Nguyen** - Ex-Google Vietnam CEO
      🌟 **Ms. Sarah Tran** - Shopee Vietnam CMO  
      🌟 **Mr. Alex Le** - Facebook Partnership Manager
      🌟 **Ms. Linh Pham** - Tiki Growth Hacker
      🌟 **Mr. John Smith** - International Marketing Guru

      **🎁 QUÀ TẶNG KHÓA HỌC:**
      📱 Premium tools account (6 tháng):
      • Canva Pro, Adobe Creative Suite
      • SEMrush, Ahrefs Professional
      • Hootsuite, Buffer Business
      • MailChimp, ActiveCampaign

      📚 **Học liệu độc quyền:**
      • 500+ template thiết kế
      • 100+ case study thành công
      • Marketing toolkit complete
      • 1-1 mentoring session

      **💼 HỖ TRỢ NGHỀ NGHIỆP:**
      🎯 Job placement assistance
      📝 CV/Resume optimization
      🤝 Network với industry experts
      📈 Cơ hội thăng tiến nội bộ

      **📝 ĐĂNG KÝ NGAY - CHỈ CÒN 25 SUẤT:**
      📱 Ms. Linh - Training: 0901.234.567
      📧 training@srv.com.vn
      🌐 Đăng ký online: learn.srv.com.vn
      📍 Phòng Đào tạo - Tầng 8, SRV Tower

      **⏰ DEADLINE ĐĂNG KÝ: 25/01/2025**

      Đây là cơ hội hiếm có để nâng cao skill marketing miễn phí với chất lượng international. Đừng bỏ lỡ nhé! 🔥

      #DigitalMarketing2025 #FreeTraining #SkillUp #CareerGrowth
    `,
    images: [
      {
        src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop&crop=center",
        alt: "Digital Marketing Training Course"
      },
      {
        src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=450&fit=crop&crop=center",
        alt: "Online Learning Setup"
      }
    ],
    stats: { likes: 987, comments: 43, shares: 56 },
    tags: ["#DigitalMarketing2025", "#FreeTraining", "#SkillUp", "#CareerGrowth"]
  }
}

// Get real stats from database API and localStorage  
const getRealStats = async (postId: number, originalStats: any) => {
  try {
    // Get real like count from localStorage
    const likeKey = `post_${postId}_liked`
    const countKey = `post_${postId}_like_count`
    const savedLiked = localStorage.getItem(likeKey)
    const savedCount = localStorage.getItem(countKey)
    
    let likes = originalStats.likes
    if (savedCount) {
      likes = parseInt(savedCount)
    }
    
    // Get real comment count from database API
    let comments = originalStats.comments
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await fetch('http://localhost:3001/api/posts/comment-counts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const commentCounts = await response.json()
          if (commentCounts[postId]) {
            comments = commentCounts[postId].total // Use real comment count from database
          }
        }
      }
    } catch (error) {
      console.warn('Error fetching comment count from API for post', postId, error)
      // Fallback to localStorage if API fails
      const savedComments = localStorage.getItem(`comments_${postId}`)
      if (savedComments) {
        try {
          const parsedComments = JSON.parse(savedComments)
          comments = parsedComments.length || originalStats.comments
        } catch (e) {
          console.warn('Error parsing comments for post', postId)
        }
      }
    }
    
    return {
      likes,
      comments,
      shares: originalStats.shares // Shares không thay đổi
    }
  } catch (error) {
    console.warn('Error getting real stats for post', postId, error)
    return originalStats
  }
}

// Save post functionality
const savePost = async (post: any) => {
  try {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]')
    const isAlreadySaved = savedPosts.some((savedPost: any) => savedPost.id === post.id)
    
    console.log('💾 Attempting to save post:', post.id, 'Already saved:', isAlreadySaved)
    
    if (!isAlreadySaved) {
      const now = new Date()
      
      // Get real stats from localStorage (AWAIT THE ASYNC FUNCTION!)
      const realStats = await getRealStats(post.id, post.stats)
      
      const postToSave = {
        ...post,
        stats: realStats, // Use real stats instead of static ones
        savedAt: "vừa xong", // Initial display
        originalDate: post.author.department,
        savedTimestamp: now.getTime() // For sorting
      }
      
      // Add to beginning of array (most recent first)
      savedPosts.unshift(postToSave)
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts))
      
      console.log('✅ Post saved successfully. Total saved:', savedPosts.length, 'Real stats:', realStats)
      
      // Show success message
      showSuccessToast('Đã lưu bài viết thành công!')
      return true
    } else {
      console.log('⚠️ Post already saved')
      showErrorToast('Bài viết đã được lưu trước đó')
      return false
    }
  } catch (error) {
    console.error('Error saving post:', error)
    showErrorToast('Có lỗi khi lưu bài viết')
    return false
  }
}

interface PostDetailProps {
  postId: string | number
  onBack: () => void
  onStatsChange?: (postId: number, newStats: any) => void
}
  
  // Function to find post across all sources
const findPostById = async (id: string) => {
  console.log('🔍 Looking for post ID:', id)
  
  // Check NewsFeed postsData FIRST
  const newsFeedPost = postsData.find((p: any) => p.id?.toString() === id)
  if (newsFeedPost) {
    console.log('✅ Found in NewsFeed postsData:', newsFeedPost.title)
    
    // Get real stats from localStorage (same logic as NewsFeed)
    const getRealStats = async (postId: number, originalStats: any) => {
      try {
        const likeKey = `post_${postId}_liked`
        const countKey = `post_${postId}_like_count`
        const savedCount = localStorage.getItem(countKey)
        
        let likes = originalStats.likes
        if (savedCount) {
          likes = parseInt(savedCount)
        }
        
        // Get real comment count from database API
        let comments = originalStats.comments
        try {
          const token = localStorage.getItem('token')
          if (token) {
            const response = await fetch('http://localhost:3001/api/posts/comment-counts', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
            
            if (response.ok) {
              const commentCounts = await response.json()
              if (commentCounts[postId]) {
                comments = commentCounts[postId].total // Use real comment count from database
              }
            }
          }
        } catch (error) {
          console.warn('Error fetching comment count from API for post', postId, error)
          // Fallback to localStorage if API fails
          const savedComments = localStorage.getItem(`comments_${postId}`)
          if (savedComments) {
            try {
              const parsedComments = JSON.parse(savedComments)
              comments = parsedComments.length || originalStats.comments
            } catch (e) {
              console.warn('Error parsing comments for post', postId)
            }
          }
        }
        
        return { likes, comments, shares: originalStats.shares }
      } catch (error) {
        console.warn('Error getting real stats for post', postId, error)
        return originalStats
      }
    }
    
    const realStats = await getRealStats(newsFeedPost.id, newsFeedPost.stats)
    const isLiked = localStorage.getItem(`post_${newsFeedPost.id}_liked`) === 'true'
    
    // Convert NewsFeed format to PostDetail format
    return {
      id: newsFeedPost.id.toString(),
      user: { 
        name: newsFeedPost.author.name, 
        avatar: '/placeholder.svg?height=40&width=40', 
        role: newsFeedPost.author.role 
      },
      content: newsFeedPost.content,
      image: newsFeedPost.image?.src,
      timestamp: newsFeedPost.author.department,
      likes: realStats.likes,
      comments: realStats.comments,
      shares: realStats.shares,
      isLiked: isLiked,
      title: newsFeedPost.title, // Keep title for display
      // Add detailed content from postDetailData if exists
      detailedContent: postDetailData[newsFeedPost.id]?.detailedContent || newsFeedPost.content
    }
  }
  
  // Check localStorage sources
  const sources = [
    'userPosts',
    'group-tech-discussion-posts', 
    'newsFeedPosts'
  ]
  
  for (const source of sources) {
    const posts = JSON.parse(localStorage.getItem(source) || '[]')
    const post = posts.find((p: any) => p.id?.toString() === id)
    if (post) {
      console.log('✅ Found in localStorage source:', source)
      return post
    }
  }
  
  // Fallback fake posts for demo
  const fakePosts = [
    {
      id: '1',
      user: { name: 'Nguyễn Văn A', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop', role: 'Member' },
      content: 'Chào mọi người! Hôm nay thời tiết thật đẹp. Ai muốn đi cafe không? ☕',
      timestamp: '2 giờ trước',
      likes: 15,
      comments: 8,
      shares: 3,
      isLiked: false
    },
    {
      id: '2', 
      user: { name: 'Trần Thị B', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b388?w=40&h=40&fit=crop', role: 'Admin' },
      content: 'Vừa hoàn thành project mới! Cảm ơn team đã support nhiệt tình 🚀',
      image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500&h=300&fit=crop',
      timestamp: '4 giờ trước', 
      likes: 32,
      comments: 12,
      shares: 8,
      isLiked: true
    },
    {
      id: '3',
      user: { name: 'Lê Văn C', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop', role: 'Moderator' },
      content: 'Tips coding: Luôn comment code của mình để người khác hiểu dễ dàng. Clean code = happy team! 💻',
      timestamp: '1 ngày trước',
      likes: 28,
      comments: 15,
      shares: 12,
      isLiked: false
    },
    {
      id: '4',
      user: { name: 'Phạm Thị D', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop', role: 'Member' },
      content: 'Workshop về AI sẽ diễn ra vào thứ 6 tuần sau. Đăng ký ngay để không bỏ lỡ cơ hội học hỏi! 🤖',
      timestamp: '2 ngày trước',
      likes: 45,
      comments: 23,
      shares: 18,
      isLiked: true
    },
    {
      id: '5',
      user: { name: 'Hoàng Văn E', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop', role: 'Member' },
      content: 'Cuối tuần rồi! Ai có plan gì thú vị không? Mình định đi hiking ở Sapa 🏔️',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      timestamp: '3 ngày trước',
      likes: 67,
      comments: 34,
      shares: 25,
      isLiked: false
    }
  ]
  
  return fakePosts.find(p => p.id === id)
}

export function PostDetail({ postId, onBack, onStatsChange }: PostDetailProps) {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [realStats, setRealStats] = useState<any>(null)
  
  // Debug log for realStats changes
  useEffect(() => {
    console.log('🔍 PostDetail realStats changed:', realStats)
  }, [realStats])

  useEffect(() => {
    const loadPost = async () => {
      // Handle both string and number postId
      const id = typeof postId === 'string' ? postId : postId.toString()
      
      // First check postDetailData for rich content
      const numericId = typeof postId === 'number' ? postId : parseInt(postId)
      if (postDetailData[numericId]) {
        const postData = postDetailData[numericId]
        
        // Load real stats from API and store separately
        const realStatsFromAPI = await getRealStats(numericId, postData.stats)
        setRealStats(realStatsFromAPI)
        setPost(postData) // Keep original post data
        setLoading(false)
        return
      }
      
      // Fallback to findPostById for other sources
      const foundPost = await findPostById(id)
      setPost(foundPost)
      setLoading(false)
    }
    
    loadPost()
  }, [postId])

  const handleLike = () => {
    if (post) {
      const newLiked = !post.isLiked
      const newLikes = newLiked ? post.likes + 1 : post.likes - 1
      
      // Save to localStorage
      const likeKey = `post_${post.id}_liked`
      const countKey = `post_${post.id}_like_count`
      
      localStorage.setItem(likeKey, newLiked.toString())
      localStorage.setItem(countKey, newLikes.toString())
      
      setPost({
        ...post,
        isLiked: newLiked,
        likes: newLikes
      })
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#post-${post.id}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('📋 Link đã được copy! Paste để chia sẻ bài viết này.')
    })
  }

  // Handle comment count changes (similar to NewsFeed) - use useCallback to prevent loops
  const handleCommentCountChange = useCallback(async (newCount: number) => {
    console.log('📊 PostDetail received comment count change:', newCount)
    // Update realStats
    setRealStats((prev: any) => ({
      ...prev,
      comments: newCount
    }))
    
    // Notify parent component
    if (onStatsChange) {
      const numericPostId = typeof postId === 'number' ? postId : parseInt(postId)
      onStatsChange(numericPostId, {
        likes: realStats?.likes || 0,
        comments: newCount,
        shares: realStats?.shares || 0
      })
    }
  }, [postId, onStatsChange, realStats?.likes, realStats?.shares])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }
  
  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <div className="bg-slate-50 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Không tìm thấy bài viết</h2>
          <p className="text-slate-500 mb-4">Bài viết này có thể đã bị xóa hoặc không tồn tại.</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-6 relative">
      {/* Back button */}
      <Button 
        onClick={onBack} 
        variant="ghost" 
        className="mb-6 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại bảng tin
      </Button>

      {/* Floating back button */}
      <Button 
        onClick={onBack} 
        variant="outline" 
        className="fixed bottom-6 left-6 z-50 shadow-2xl shadow-slate-200/50 backdrop-blur-sm bg-white/90 border-violet-200 text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-full h-12 w-12 p-0"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Quay lại bảng tin</span>
      </Button>

      {/* Main post card */}
      <Card className="overflow-hidden rounded-3xl border-none shadow-2xl shadow-slate-200/50 backdrop-blur-sm bg-white/90 mb-8">
        <CardHeader className="p-6 border-b border-slate-100">
          {/* Author info */}
          <div className="flex items-center gap-4">
            <Avatar className={`h-16 w-16 border-4 border-white ring-4 ${post.author?.ringColor || 'ring-violet-100'} shadow-lg`}>
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt={post.author?.name || post.user?.name} />
              <AvatarFallback className={`bg-gradient-to-br ${post.author?.avatarColor || 'from-violet-500 to-purple-600'} text-white text-lg`}>
                {post.author?.fallback || post.user?.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-xl text-slate-900">{post.author?.name || post.user?.name}</span>
                <Badge
                  variant="secondary"
                  className={`bg-gradient-to-r ${post.author?.badgeColor || 'from-violet-500/10 to-purple-500/10 text-violet-700'} border-none`}
                >
                  {post.author?.role || post.user?.role}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">{post.author?.department || post.timestamp}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-500 hover:text-slate-700 rounded-full h-10 w-10"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl shadow-xl shadow-slate-200/50">
                <DropdownMenuItem 
                  className="rounded-lg cursor-pointer"
                  onClick={async () => await savePost(post)}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Lưu bài viết
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Chia sẻ
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer">Báo cáo</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Title */}
          <div className="px-6 py-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            {/* Tags */}
            {post.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="inline-block bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          {((post.images && post.images.length > 0) || post.image) && (
            <div className="px-6 mb-6">
              <div className="grid gap-4">
                {post.images ? post.images.map((image: any, index: number) => (
                  <div key={index} className="relative aspect-[16/9] bg-slate-100 overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )) : (
                  <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={post.image}
                      alt="Post image"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detailed content */}
          <div className="px-6 pb-6">
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-line text-slate-700 leading-relaxed text-lg">
                {post.detailedContent || post.content}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 border-t border-slate-100 bg-slate-50/50">
          <PostInteraction 
            likeCount={realStats?.likes || post.stats?.likes || post.likes || 0} 
            commentCount={realStats?.comments || post.stats?.comments || post.comments || 0}
            shareCount={realStats?.shares || post.stats?.shares || post.shares || 0}
            postId={typeof postId === 'number' ? postId : parseInt(postId)}
            className="w-full"
            onCommentCountChange={handleCommentCountChange}
          />
        </CardFooter>
      </Card>


    </div>
  )
} 