const Database = require('better-sqlite3');
const fs = require('fs');

console.log('🚀 Initializing database...');

// Remove existing database file if exists
if (fs.existsSync('./database.sqlite')) {
  fs.unlinkSync('./database.sqlite');
  console.log('🗑️ Removed existing database file');
}

// Create new database
const db = new Database('./database.sqlite');

console.log('✅ Created new database: database.sqlite');

// Create tables
console.log('📋 Creating tables...');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create posts table
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT DEFAULT '',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Create comments table
db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    root_comment_id INTEGER DEFAULT NULL,
    parent_comment_id INTEGER DEFAULT NULL,
    content TEXT NOT NULL,
    image_url TEXT DEFAULT '',
    likes_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (root_comment_id) REFERENCES comments(id),
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
  )
`);

// Create mentions table
db.exec(`
  CREATE TABLE IF NOT EXISTS mentions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_id INTEGER NOT NULL,
    mentioned_user_id INTEGER NOT NULL,
    mentioned_username TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    FOREIGN KEY (mentioned_user_id) REFERENCES users(id)
  )
`);

// Insert sample users
console.log('👥 Creating sample users...');
const sampleUsers = [
  { username: 'admin', email: 'admin@webdemo.com', full_name: 'Administrator' },
  { username: 'mai.tien.dung', email: 'dung@webdemo.com', full_name: 'Mai Tiến Dũng' },
  { username: 'mai.thi.thao', email: 'thao@webdemo.com', full_name: 'Mai Thị Thảo' },
  { username: 'nguyen.thi.nam', email: 'nam@webdemo.com', full_name: 'Nguyễn Thị Nam' },
  { username: 'nguyen.thi.duc', email: 'duc@webdemo.com', full_name: 'Nguyễn Thị Đức' },
  { username: 'nguyen.thi.cam', email: 'cam@webdemo.com', full_name: 'Nguyễn Thị Cẩm' },
  { username: 'nguyen.van.bao', email: 'bao@webdemo.com', full_name: 'Nguyễn Văn Bảo' },
  { username: 'john.doe', email: 'john@webdemo.com', full_name: 'John Doe' },
  { username: 'jane.smith', email: 'jane@webdemo.com', full_name: 'Jane Smith' }
];

const insertUser = db.prepare(`
  INSERT INTO users (username, email, full_name) 
  VALUES (?, ?, ?)
`);

sampleUsers.forEach(user => {
  insertUser.run(user.username, user.email, user.full_name);
});

// Insert sample posts
console.log('📝 Creating sample posts...');
const insertPost = db.prepare(`
  INSERT INTO posts (user_id, content) 
  VALUES (?, ?)
`);

insertPost.run(1, 'Chào mừng đến với WebDemo! Đây là bài post đầu tiên của chúng ta.');
insertPost.run(2, 'Dự án này thật tuyệt vời! Cảm ơn team đã làm việc chăm chỉ.');

console.log('✅ Database initialized successfully!');
console.log('📊 Summary:');
console.log(`- Users: ${sampleUsers.length}`);
console.log(`- Posts: 2`);
console.log(`- Tables: users, posts, comments, mentions`);

console.log('\n🚀 Next steps:');
console.log('- Run "node seedComments.js" to add sample comments');
console.log('- Run "node checkSchema.js" to verify database structure');

db.close(); 