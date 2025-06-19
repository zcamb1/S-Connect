const Database = require('better-sqlite3');

const db = new Database('./database.sqlite');

console.log('🔍 Checking database schema...\n');

try {
  // Get all tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('📋 Available tables:', tables.map(t => t.name));

  // Check comments table structure
  console.log('\n🏗️ Comments table schema:');
  const commentsSchema = db.prepare("PRAGMA table_info(comments)").all();
  console.table(commentsSchema);

  // Check users table structure
  console.log('\n👥 Users table schema:');
  const usersSchema = db.prepare("PRAGMA table_info(users)").all();
  console.table(usersSchema);

  // Check existing data
  console.log('\n📊 Existing data counts:');
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
  console.log(`- Users: ${userCount.count}`);
  
  const postCount = db.prepare("SELECT COUNT(*) as count FROM posts").get();
  console.log(`- Posts: ${postCount.count}`);
  
  const commentCount = db.prepare("SELECT COUNT(*) as count FROM comments").get();
  console.log(`- Comments: ${commentCount.count}`);

  // Show sample users
  console.log('\n👤 Sample users:');
  const sampleUsers = db.prepare("SELECT id, username, full_name FROM users LIMIT 5").all();
  console.table(sampleUsers);

} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
} 