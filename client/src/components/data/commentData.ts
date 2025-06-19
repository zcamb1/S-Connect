// Fake comments data for each post  
export const fakeCommentsData: Record<number, any[]> = {
  1: [ // Olympic post
    {
      id: 1,
      author: {
        name: "Nguyễn Văn A",
        fallback: "VA", 
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Nhân viên"
      },
      content: "Tuyệt vời! Mình đã đăng ký đội Bóng bàn phòng Marketing rồi 🏓 Ai cùng team không?",
      timestamp: "2 giờ trước",
      likes: 12,
      replies: 3,
      reactions: ["👍", "🏓", "🔥"],
      replyList: [
        {
          id: 101,
          author: {
            name: "Trần Thị Mai",
            fallback: "TM",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Marketing"
          },
          content: "Mình cũng vào team Marketing! Cùng luyện tập nhé 💪",
          timestamp: "1 giờ trước",
          likes: 5,
          replyList: [
            {
              id: 1001,
              author: {
                name: "Lê Minh C",
                fallback: "MC",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Nhân viên"
              },
              content: "Tuyệt! Nhóm chat nào rồi? Add mình vào với",
              timestamp: "45 phút trước",
              likes: 2,
              replyList: []
            }
          ]
        },
        {
          id: 102,
          author: {
            name: "Hoàng Nam",
            fallback: "HN",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "IT"
          },
          content: "IT team mình tham gia môn Bóng đá và E-sports. Ai chơi game không? 🎮⚽",
          timestamp: "50 phút trước",
          likes: 8,
          replyList: []
        }
      ]
    },
    {
      id: 2,
      author: {
        name: "Trần Thị B",
        fallback: "TB",
        avatar: "/placeholder.svg?height=40&width=40", 
        role: "Team Leader"
      },
      content: "Olympic năm nay có vẻ sôi động hơn năm trước. Phòng IT sẽ tham gia với 2 đội! 💪",
      timestamp: "1 giờ trước",
      likes: 8,
      replies: 2,
      reactions: ["💪", "🎯", "👏"],
      replyList: [
        {
          id: 103,
          author: {
            name: "Phạm Văn D",
            fallback: "PD",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Developer"
          },
          content: "Team Leader dẫn đầu luôn! Mình đăng ký làm cheerleader 📣",
          timestamp: "30 phút trước",
          likes: 3,
          replyList: [
            {
              id: 1002,
              author: {
                name: "Trần Thị B",
                fallback: "TB",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Team Leader"
              },
              content: "Haha, cảm ơn support! Cùng cổ vũ cho IT team nhé 🎉",
              timestamp: "25 phút trước",
              likes: 4,
              replyList: []
            }
          ]
        }
      ]
    },
    {
      id: 3,
      author: {
        name: "Lê Minh C",
        fallback: "MC",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Nhân viên"
      },
      content: "Giải thưởng 50 triệu này khủng thật! Ai thắng sẽ được thưởng bao nhiêu nhỉ? 🤔💰",
      timestamp: "30 phút trước", 
      likes: 15,
      replies: 1,
      reactions: ["💰", "🤔", "😍"],
      replyList: [
        {
          id: 104,
          author: {
            name: "Nguyễn HR",
            fallback: "HR",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "HR"
          },
          content: "Chi tiết giải thưởng sẽ được công bố sớm thôi! Stay tuned 😉",
          timestamp: "20 phút trước",
          likes: 7,
          replyList: []
        }
      ]
    }
  ],

  2: [ // Team building post
    {
      id: 4,
      author: {
        name: "Phạm Thanh D",
        fallback: "TD",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "HR"
      },
      content: "Cần Giờ đẹp lắm! Năm ngoái mình đi rồi, năm nay chắc chắn tham gia tiếp 🌊🏖️",
      timestamp: "3 giờ trước",
      likes: 23,
      replies: 5,
      reactions: ["🏖️", "😍", "👍"],
      replyList: [
        {
          id: 105,
          author: {
            name: "Vũ Thùy Linh",
            fallback: "VL",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Designer"
          },
          content: "Cần Giờ có gì hay không chị? Em chưa đi bao giờ 🥺",
          timestamp: "2 giờ trước",
          likes: 6,
          replyList: [
            {
              id: 1003,
              author: {
                name: "Phạm Thanh D",
                fallback: "TD",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "HR"
              },
              content: "Biển đẹp, hải sản ngon, rừng ngập mặn thú vị lắm! Em sẽ thích đấy 🦀🌿",
              timestamp: "1.5 giờ trước",
              likes: 8,
              replyList: []
            },
            {
              id: 1004,
              author: {
                name: "Nguyễn Phúc",
                fallback: "NP",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Content"
              },
              content: "Đặc biệt là món cua rang me! Nhớ mãi không quên 😋",
              timestamp: "1 giờ trước",
              likes: 5,
              replyList: []
            }
          ]
        },
        {
          id: 106,
          author: {
            name: "Lê Hoàng",
            fallback: "LH",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Sales"
          },
          content: "Năm ngoái team building ở đó chill lắm! Ai chưa đi thì đừng bỏ lỡ 🏄‍♂️",
          timestamp: "1.5 giờ trước",
          likes: 9,
          replyList: []
        }
      ]
    },
    {
      id: 5,
      author: {
        name: "Hoàng Anh E",
        fallback: "AE",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Manager"
      },
      content: "Miễn phí 100% luôn! HR team quá tâm lý 😭 Cảm ơn công ty nhiều lắm!",
      timestamp: "2 giờ trước",
      likes: 31,
      replies: 3,
      reactions: ["😭", "❤️", "🙏", "👏"],
      replyList: [
        {
          id: 107,
          author: {
            name: "Nguyễn CEO",
            fallback: "CEO",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "CEO"
          },
          content: "Team work hard, play hard! Các bạn xứng đáng được nghỉ ngơi 🏆",
          timestamp: "1 giờ trước",
          likes: 25,
          replyList: [
            {
              id: 1005,
              author: {
                name: "Toàn team",
                fallback: "TT",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Everyone"
              },
              content: "Thank you Boss! Love this company ❤️❤️❤️",
              timestamp: "45 phút trước",
              likes: 50,
              replyList: []
            }
          ]
        }
      ]
    },
    {
      id: 6,
      author: {
        name: "Vũ Thị F",
        fallback: "VF",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Nhân viên"
      },
      content: "Đạp xe trong rừng ngập mặn nghe thú vị quá! Mình chưa từng thử bao giờ 🚴‍♀️🌿",
      timestamp: "1 giờ trước",
      likes: 18,
      replies: 2,
      reactions: ["🚴‍♀️", "🌿", "😊"],
      replyList: [
        {
          id: 108,
          author: {
            name: "Biker Pro",
            fallback: "BP",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Tour Guide"
          },
          content: "Đường mòn ở Cần Giờ rất dễ đi, phù hợp cho người mới! Cảnh siêu đẹp 📸",
          timestamp: "30 phút trước",
          likes: 12,
          replyList: []
        }
      ]
    }
  ],

  3: [ // Achievement post
    {
      id: 7,
      author: {
        name: "Đặng Văn G",
        fallback: "VG",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Senior Dev"
      },
      content: "Tự hào làm việc tại SRV! 245% tăng trưởng này là nhờ cả team cố gắng 🏆✨",
      timestamp: "4 giờ trước",
      likes: 45,
      replies: 7,
      reactions: ["🏆", "✨", "💪", "👏", "🎉"],
      replyList: [
        {
          id: 109,
          author: {
            name: "Junior Dev",
            fallback: "JD",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Developer"
          },
          content: "Anh G mentor tuyệt vời! Em học được rất nhiều từ anh 🙏",
          timestamp: "3 giờ trước",
          likes: 15,
          replyList: [
            {
              id: 1006,
              author: {
                name: "Đặng Văn G",
                fallback: "VG",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Senior Dev"
              },
              content: "Cảm ơn em! Cùng nhau phát triển team tech mạnh hơn nữa 💻",
              timestamp: "2.5 giờ trước",
              likes: 18,
              replyList: []
            }
          ]
        },
        {
          id: 110,
          author: {
            name: "Product Manager",
            fallback: "PM",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "PM"
          },
          content: "Quý này launch 3 sản phẩm mới thành công! Next quarter sẽ ambitious hơn 🚀",
          timestamp: "2 giờ trước",
          likes: 22,
          replyList: []
        }
      ]
    },
    {
      id: 8,
      author: {
        name: "Bùi Thị H",
        fallback: "TH",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Designer"
      },
      content: "Thưởng Tết 3-5 tháng + du lịch Hàn Quốc! Động lực làm việc tăng 1000% luôn 🇰🇷💸",
      timestamp: "3 giờ trước",
      likes: 67,
      replies: 9,
      reactions: ["🇰🇷", "💸", "🤩", "🔥", "😍"],
      replyList: [
        {
          id: 111,
          author: {
            name: "K-pop Fan",
            fallback: "KF",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Marketing"
          },
          content: "OMG Hàn Quốc!!! Mình phải cày deadline để đi trip này 😭✈️",
          timestamp: "2 giờ trước",
          likes: 28,
          replyList: [
            {
              id: 1007,
              author: {
                name: "Seoul Guide",
                fallback: "SG",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Travel Expert"
              },
              content: "Tháng 3-4 ở Seoul thời tiết đẹp lắm! Hoa anh đào nở rồi 🌸",
              timestamp: "1.5 giờ trước",
              likes: 15,
              replyList: []
            }
          ]
        },
        {
          id: 112,
          author: {
            name: "Finance Team",
            fallback: "FT",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Finance"
          },
          content: "Thưởng năm nay xứng đáng với effort của mọi người! Proud of our team 💪💰",
          timestamp: "1 giờ trước",
          likes: 35,
          replyList: []
        }
      ]
    }
  ],

  4: [ // S-Connect update post
    {
      id: 9,
      author: {
        name: "Mai Xuân I",
        fallback: "XI",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Frontend Dev"
      },
      content: "Dark mode cuối cùng cũng có! UI team đã làm rất đẹp, responsive perfect 👨‍💻🌙",
      timestamp: "5 giờ trước",
      likes: 28,
      replies: 4,
      reactions: ["🌙", "👨‍💻", "🔥", "👍"],
      replyList: [
        {
          id: 113,
          author: {
            name: "UX Designer",
            fallback: "UX",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Designer"
          },
          content: "Cảm ơn anh I! Mình design dark theme này mất 2 tuần research 🎨",
          timestamp: "4 giờ trước",
          likes: 12,
          replyList: [
            {
              id: 1008,
              author: {
                name: "User Feedback",
                fallback: "UF",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Tester"
              },
              content: "Dark mode này save battery phone mình 30%! Excellent work 🔋",
              timestamp: "3 giờ trước",
              likes: 8,
              replyList: []
            }
          ]
        },
        {
          id: 114,
          author: {
            name: "Mobile Dev",
            fallback: "MD",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Developer"
          },
          content: "Mobile app cũng đã sync dark mode! Cross-platform consistency 📱",
          timestamp: "2 giờ trước",
          likes: 16,
          replyList: []
        }
      ]
    },
    {
      id: 10,
      author: {
        name: "Chu Thị J",
        fallback: "TJ",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "QA Tester"
      },
      content: "Real-time chat < 100ms này impressive! Test thử rồi, lag gần như không có 🚀⚡",
      timestamp: "4 giờ trước",
      likes: 21,
      replies: 3,
      reactions: ["🚀", "⚡", "👌", "🎯"],
      replyList: [
        {
          id: 115,
          author: {
            name: "Backend Dev",
            fallback: "BD",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Backend"
          },
          content: "Optimize websocket + Redis cache. Performance boost 300%! 💪⚡",
          timestamp: "3 giờ trước",
          likes: 19,
          replyList: [
            {
              id: 1009,
              author: {
                name: "DevOps",
                fallback: "DO",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "DevOps"
              },
              content: "Server monitoring shows 99.9% uptime. Infrastructure solid! 📊",
              timestamp: "2 giờ trước",
              likes: 14,
              replyList: []
            }
          ]
        }
      ]
    }
  ],

  5: [ // Digital Marketing course post
    {
      id: 11,
      author: {
        name: "Lý Văn K",
        fallback: "VK",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Marketing"
      },
      content: "Khóa học free với giảng viên là CEO Google + CMO Shopee? This is incredible! 🤯📚",
      timestamp: "6 giờ trước",
      likes: 39,
      replies: 6,
      reactions: ["🤯", "📚", "🔥", "💯", "🙌"],
      replyList: [
        {
          id: 116,
          author: {
            name: "Digital Marketer",
            fallback: "DM",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Specialist"
          },
          content: "Tên khoá học gì vậy anh? Em muốn đăng ký luôn! 🏃‍♀️",
          timestamp: "5 giờ trước",
          likes: 15,
          replyList: [
            {
              id: 1010,
              author: {
                name: "Lý Văn K",
                fallback: "VK",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Marketing"
              },
              content: "\"Advanced Digital Strategy 2024\" - link đăng ký mình share group chat nhé 📲",
              timestamp: "4.5 giờ trước",
              likes: 12,
              replyList: []
            }
          ]
        },
        {
          id: 117,
          author: {
            name: "Growth Hacker",
            fallback: "GH",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Growth"
          },
          content: "CEO Google sẽ share case study nào nhỉ? Mong có insights về AI marketing 🤖",
          timestamp: "3 giờ trước",
          likes: 22,
          replyList: []
        }
      ]
    },
    {
      id: 12,
      author: {
        name: "Đỗ Thị L",
        fallback: "TL",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Content Writer"
      },
      content: "Mình đã đăng ký rồi! Cơ hội hiếm có để học từ top experts. Ai cùng study group không? 📖👥",
      timestamp: "5 giờ trước",
      likes: 24,
      replies: 8,
      reactions: ["📖", "👥", "💪", "🎓"],
      replyList: [
        {
          id: 118,
          author: {
            name: "SEO Expert",
            fallback: "SE",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "SEO"
          },
          content: "Count me in! Tạo group Telegram study cùng nhau nhé 📱",
          timestamp: "4 giờ trước",
          likes: 18,
          replyList: [
            {
              id: 1011,
              author: {
                name: "Social Media",
                fallback: "SM",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Social"
              },
              content: "Mình cũng join! Chia sẻ notes và thảo luận assignment 📝✨",
              timestamp: "3.5 giờ trước",
              likes: 16,
              replyList: []
            },
            {
              id: 1012,
              author: {
                name: "Analytics Pro",
                fallback: "AP",
                avatar: "/placeholder.svg?height=40&width=40",
                role: "Analytics"
              },
              content: "Perfect! Mình có tools tracking campaign, share luôn cho team 📊",
              timestamp: "3 giờ trước",
              likes: 14,
              replyList: []
            }
          ]
        }
      ]
    }
  ]
} 