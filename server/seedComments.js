const Database = require('better-sqlite3');
const path = require('path');

// Connect to the existing database
const db = new Database('./database.sqlite');

console.log('🔗 Connected to SQLite database');

// Helper function to extract mentions from content
function extractMentions(content) {
  const mentionRegex = /@(\w+(?:\.\w+)*)/g;
  const mentions = [];
  let match;
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push({
      username: match[1],
      position: match.index
    });
  }
  return mentions;
}

// Sample comment data (2-tier structure, flat format)
const sampleComments = [
  // Root comment 1
  {
    id: 1,
    post_id: 1,
    root_comment_id: null,
    parent_comment_id: null,
    authorUsername: "mai.tien.dung",
    content: "Dự án này cần làm lại phần phân quyền.",
    created_at: "2024-06-01 10:00:00"
  },
  // Replies to comment 1
  {
    id: 2,
    post_id: 1,
    root_comment_id: 1,
    parent_comment_id: 1,
    authorUsername: "mai.thi.thao",
    content: "@mai.tien.dung cảm ơn bạn đã góp ý!",
    created_at: "2024-06-01 10:05:00"
  },
  {
    id: 3,
    post_id: 1,
    root_comment_id: 1,
    parent_comment_id: 2,
    authorUsername: "nguyen.thi.nam",
    content: "@mai.thi.thao được đó!",
    created_at: "2024-06-01 10:07:00"
  },
  {
    id: 4,
    post_id: 1,
    root_comment_id: 1,
    parent_comment_id: 2,
    authorUsername: "nguyen.thi.duc",
    content: "@mai.thi.thao thật không?",
    created_at: "2024-06-01 10:10:00"
  },
  {
    id: 5,
    post_id: 1,
    root_comment_id: 1,
    parent_comment_id: 4,
    authorUsername: "nguyen.thi.cam",
    content: "@nguyen.thi.duc được đó!",
    created_at: "2024-06-01 10:12:00"
  },
  {
    id: 6,
    post_id: 1,
    root_comment_id: 1,
    parent_comment_id: 4,
    authorUsername: "nguyen.thi.cam",
    content: "@nguyen.thi.duc ghê vậy!",
    created_at: "2024-06-01 10:13:00"
  },
  {
    id: 7,
    post_id: 1,
    root_comment_id: 1,
    parent_comment_id: 1,
    authorUsername: "nguyen.van.bao",
    content: "@mai.tien.dung em đồng ý với anh.",
    created_at: "2024-06-01 10:15:00"
  },
  
  // Root comment 2
  {
    id: 8,
    post_id: 1,
    root_comment_id: null,
    parent_comment_id: null,
    authorUsername: "john.doe",
    content: "UI này nhìn rất đẹp, ai design vậy?",
    created_at: "2024-06-01 11:00:00"
  },
  // Replies to comment 8
  {
    id: 9,
    post_id: 1,
    root_comment_id: 8,
    parent_comment_id: 8,
    authorUsername: "mai.thi.thao",
    content: "@john.doe em design đó anh, cảm ơn anh!",
    created_at: "2024-06-01 11:02:00"
  },
  {
    id: 10,
    post_id: 1,
    root_comment_id: 8,
    parent_comment_id: 9,
    authorUsername: "nguyen.thi.nam",
    content: "@mai.thi.thao đẹp thật đó!",
    created_at: "2024-06-01 11:05:00"
  },
  
  // Root comment 3
  {
    id: 11,
    post_id: 1,
    root_comment_id: null,
    parent_comment_id: null,
    authorUsername: "jane.smith",
    content: "Khi nào deploy lên production vậy các bạn?",
    created_at: "2024-06-01 12:00:00"
  },
  // Replies to comment 11
  {
    id: 12,
    post_id: 1,
    root_comment_id: 11,
    parent_comment_id: 11,
    authorUsername: "admin",
    content: "@jane.smith dự kiến tuần sau chị ạ.",
    created_at: "2024-06-01 12:05:00"
  },
  {
    id: 13,
    post_id: 1,
    root_comment_id: 11,
    parent_comment_id: 12,
    authorUsername: "nguyen.van.bao",
    content: "@admin @jane.smith em sẽ chuẩn bị server trước.",
    created_at: "2024-06-01 12:10:00"
  },
  
  // Root comment 4 (no replies)
  {
    id: 14,
    post_id: 1,
    root_comment_id: null,
    parent_comment_id: null,
    authorUsername: "nguyen.thi.duc",
    content: "Tuyệt vời! Team làm việc rất hiệu quả.",
    created_at: "2024-06-01 13:00:00"
  },
  
  // Root comment 5
  {
    id: 15,
    post_id: 1,
    root_comment_id: null,
    parent_comment_id: null,
    authorUsername: "nguyen.thi.cam",
    content: "Có cần test thêm không các bạn?",
    created_at: "2024-06-01 14:00:00"
  },
  // Replies to comment 15
  {
    id: 16,
    post_id: 1,
    root_comment_id: 15,
    parent_comment_id: 15,
    authorUsername: "nguyen.thi.nam",
    content: "@nguyen.thi.cam em nghĩ cần test thêm security.",
    created_at: "2024-06-01 14:02:00"
  },
  {
    id: 17,
    post_id: 1,
    root_comment_id: 15,
    parent_comment_id: 16,
    authorUsername: "mai.tien.dung",
    content: "@nguyen.thi.nam @nguyen.thi.cam đúng rồi, em sẽ làm penetration test.",
    created_at: "2024-06-01 14:05:00"
  }
];

async function seedComments() {
  try {
    console.log('🌱 Starting to seed sample comments...');
    
    // Get user mappings (username -> user_id)
    const users = db.prepare('SELECT id, username FROM users').all();
    const userMap = {};
    users.forEach(user => {
      userMap[user.username] = user.id;
    });
    
    console.log('👥 Found users:', Object.keys(userMap));
    
    // Get friends mappings for mention validation
    const friendships = db.prepare('SELECT user_id, friend_id FROM friends').all();
    const friendsMap = {};
    friendships.forEach(f => {
      if (!friendsMap[f.user_id]) friendsMap[f.user_id] = [];
      friendsMap[f.user_id].push(f.friend_id);
    });
    
    // Prepare statements
    const insertComment = db.prepare(`
      INSERT INTO comments (id, post_id, author_id, content, root_comment_id, parent_comment_id, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertMention = db.prepare(`
      INSERT INTO mentions (comment_id, mentioned_user_id, mentioned_username, position) 
      VALUES (?, ?, ?, ?)
    `);
    
    // Clear existing comments for post_id = 1 (if any)
    db.prepare('DELETE FROM mentions WHERE comment_id IN (SELECT id FROM comments WHERE post_id = 1)').run();
    db.prepare('DELETE FROM comments WHERE post_id = 1').run();
    console.log('🧹 Cleared existing comments for post_id = 1');
    
    let insertedComments = 0;
    let insertedMentions = 0;
    
    // Insert comments and process mentions
    for (const comment of sampleComments) {
      const userId = userMap[comment.authorUsername];
      
      if (!userId) {
        console.log(`⚠️ User not found: ${comment.authorUsername}, skipping comment ${comment.id}`);
        continue;
      }
      
      // Insert comment
      insertComment.run(
        comment.id,
        comment.post_id,
        userId,
        comment.content,
        comment.root_comment_id,
        comment.parent_comment_id,
        comment.created_at
      );
      insertedComments++;
      
      // Process mentions
      const mentions = extractMentions(comment.content);
      
      for (const mention of mentions) {
        const mentionedUserId = userMap[mention.username];
        
        if (!mentionedUserId) {
          console.log(`⚠️ Mentioned user not found: ${mention.username}`);
          continue;
        }
        
        // Check if they are friends
        const currentUserFriends = friendsMap[userId] || [];
        
        if (currentUserFriends.includes(mentionedUserId)) {
          insertMention.run(
            comment.id,
            mentionedUserId,
            mention.username,
            mention.position
          );
          insertedMentions++;
          console.log(`✅ Mention added: @${mention.username} in comment ${comment.id}`);
        } else {
          console.log(`❌ Not friends: ${comment.authorUsername} -> ${mention.username}, skipping mention`);
        }
      }
    }
    
    console.log('✅ Seeding completed!');
    console.log(`📊 Inserted: ${insertedComments} comments, ${insertedMentions} mentions`);
    
    // Verify the data
    const totalComments = db.prepare('SELECT COUNT(*) as count FROM comments WHERE post_id = 1').get();
    const totalMentions = db.prepare('SELECT COUNT(*) as count FROM mentions').get();
    const rootComments = db.prepare('SELECT COUNT(*) as count FROM comments WHERE post_id = 1 AND root_comment_id IS NULL').get();
    const replyComments = db.prepare('SELECT COUNT(*) as count FROM comments WHERE post_id = 1 AND root_comment_id IS NOT NULL').get();
    
    console.log('\n📈 Database Status:');
    console.log(`- Total comments for post 1: ${totalComments.count}`);
    console.log(`- Root comments: ${rootComments.count}`);
    console.log(`- Reply comments: ${replyComments.count}`);
    console.log(`- Total mentions: ${totalMentions.count}`);
    
    // Show structure sample
    console.log('\n🏗️ Comment Structure Sample:');
    const sampleQuery = db.prepare(`
      SELECT c.id, c.content, c.root_comment_id, c.parent_comment_id, u.username, u.full_name
      FROM comments c 
      JOIN users u ON u.id = c.author_id 
      WHERE c.post_id = 1 
      ORDER BY COALESCE(c.root_comment_id, c.id), c.created_at 
      LIMIT 10
    `);
    
    const sampleResults = sampleQuery.all();
    sampleResults.forEach(row => {
      const prefix = row.root_comment_id ? '  ↳' : '💬';
      console.log(`${prefix} [${row.id}] ${row.full_name}: ${row.content.substring(0, 50)}...`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding comments:', error);
  } finally {
    db.close();
    console.log('🔚 Database connection closed');
  }
}

// Run the seeding
seedComments(); 