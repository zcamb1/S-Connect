const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist  
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'comment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Connect database
const db = new Database('./database.sqlite');
console.log('✅ Connected to SQLite database');

// init tables
function initDB() {
  db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    full_name TEXT,
    avatar TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`);

  db.exec(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`);

  db.exec(`CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id,user_id)
  );`);

  // Updated comments table for 2-tier reply system
  db.exec(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    content TEXT,
    root_comment_id INTEGER,
    parent_comment_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (root_comment_id) REFERENCES comments(id),
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
  );`);

  // Friends table
  db.exec(`CREATE TABLE IF NOT EXISTS friends (
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id)
  );`);

  // Mentions table
  db.exec(`CREATE TABLE IF NOT EXISTS mentions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_id INTEGER NOT NULL,
    mentioned_user_id INTEGER NOT NULL,
    mentioned_username TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    FOREIGN KEY (mentioned_user_id) REFERENCES users(id)
  );`);

  // Notifications table
  db.exec(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_id INTEGER,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`);

  // seed demo users
  const insertUser = db.prepare('INSERT OR IGNORE INTO users (username,email,password,full_name,bio) VALUES (?,?,?,?,?)');
  const demo = [
    ['admin','admin@company.com','123456','Administrator','System Administrator'],
    ['john.doe','john@company.com','123456','John Doe','Marketing Manager'],
    ['jane.smith','jane@company.com','123456','Jane Smith','HR Director'],
    ['mai.tien.dung','mai@company.com','123456','Mai Tiến Dũng','Developer'],
    ['mai.thi.thao','thao@company.com','123456','Mai Thị Thảo','Designer'],
    ['nguyen.thi.nam','nam@company.com','123456','Nguyễn Thị Nam','Tester'],
    ['nguyen.thi.duc','duc@company.com','123456','Nguyễn Thị Đức','Product Manager'],
    ['nguyen.thi.cam','cam@company.com','123456','Nguyễn Thị Cam','QA Engineer'],
    ['nguyen.van.bao','bao@company.com','123456','Nguyễn Văn Bảo','Backend Developer']
  ];
  demo.forEach(u=>insertUser.run(u[0],u[1],bcrypt.hashSync(u[2],10),u[3],u[4]));

  // seed demo friendships (bidirectional)
  const insertFriend = db.prepare('INSERT OR IGNORE INTO friends (user_id, friend_id) VALUES (?,?)');
  const friendships = [
    [1,2],[2,1], [1,3],[3,1], [1,4],[4,1], [1,5],[5,1],
    [2,3],[3,2], [2,6],[6,2], [3,7],[7,3], [4,5],[5,4],
    [4,6],[6,4], [5,7],[7,5], [6,8],[8,6], [7,9],[9,7],
    [8,9],[9,8], [5,6],[6,5], [7,8],[8,7]
  ];
  friendships.forEach(f=>insertFriend.run(f[0],f[1]));
}

initDB();

// auth middleware
function auth(req,res,next){
  const token=req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({error:'No token'});
  try{
    req.user=jwt.verify(token,JWT_SECRET);
    next();
  }catch(e){res.status(403).json({error:'Invalid token'});}
}

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

// routes
app.post('/api/login',(req,res)=>{
  const {username,password}=req.body;
  const user=db.prepare('SELECT * FROM users WHERE username=? OR email=?').get(username,username);
  if(!user||!bcrypt.compareSync(password,user.password)) return res.status(401).json({error:'Invalid credentials'});
  const token=jwt.sign({id:user.id,username:user.username},JWT_SECRET,{expiresIn:'24h'});
  res.json({token,user:{id:user.id,username:user.username,email:user.email,full_name:user.full_name,avatar:user.avatar,bio:user.bio}});
});

app.get('/api/me',auth,(req,res)=>{
  const u=db.prepare('SELECT id,username,email,full_name,avatar,bio FROM users WHERE id=?').get(req.user.id);
  res.json(u);
});

// Update user profile
app.put('/api/me', auth, upload.single('avatar'), (req, res) => {
  try {
    const { full_name, bio, email, username } = req.body;
    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Build dynamic update query
    const updates = [];
    const params = [];
    
    if (full_name !== undefined) {
      updates.push('full_name = ?');
      params.push(full_name);
    }
    
    if (bio !== undefined) {
      updates.push('bio = ?');
      params.push(bio);
    }
    
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    
    if (username !== undefined) {
      updates.push('username = ?');
      params.push(username);
    }
    
    if (avatarUrl) {
      updates.push('avatar = ?');
      params.push(avatarUrl);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    // Add user ID to params
    params.push(req.user.id);
    
    // Execute update
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    const result = db.prepare(query).run(...params);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return updated user data
    const updatedUser = db.prepare('SELECT id,username,email,full_name,avatar,bio FROM users WHERE id=?').get(req.user.id);
    res.json(updatedUser);
    
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get friends list for mentions
app.get('/api/friends',auth,(req,res)=>{
  const query = req.query.query || '';
  const stmt = db.prepare(`
    SELECT u.id, u.username, u.full_name, u.avatar, TRUE as is_friend
    FROM friends f 
    JOIN users u ON u.id = f.friend_id 
    WHERE f.user_id = ? AND (u.username LIKE ? OR u.full_name LIKE ?)
    ORDER BY u.full_name
  `);
  const friends = stmt.all(req.user.id, `%${query}%`, `%${query}%`);
  res.json(friends);
});

// Get comment counts for all posts
app.get('/api/posts/comment-counts', auth, (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        post_id, 
        COUNT(*) as total_comments,
        COUNT(CASE WHEN root_comment_id IS NULL THEN 1 END) as root_comments,
        COUNT(CASE WHEN root_comment_id IS NOT NULL THEN 1 END) as reply_comments
      FROM comments 
      GROUP BY post_id
      ORDER BY post_id
    `);
    
    const commentCounts = stmt.all();
    
    // Transform to object for easy lookup
    const countsObject = {};
    commentCounts.forEach(row => {
      countsObject[row.post_id] = {
        total: row.total_comments,
        root: row.root_comments, 
        replies: row.reply_comments
      };
    });
    
    res.json(countsObject);
  } catch (error) {
    console.error('Error fetching comment counts:', error);
    res.status(500).json({ error: 'Failed to fetch comment counts' });
  }
});

app.get('/api/posts',auth,(req,res)=>{
  const stmt=db.prepare(`SELECT p.*,u.username,u.full_name,u.avatar,
    (SELECT COUNT(*) FROM likes WHERE post_id=p.id) AS likes_count,
    (SELECT COUNT(*) FROM comments WHERE post_id=p.id) AS comments_count,
    EXISTS(SELECT 1 FROM likes WHERE post_id=p.id AND user_id=?) AS user_liked
    FROM posts p JOIN users u ON u.id=p.user_id ORDER BY p.created_at DESC`);
  res.json(stmt.all(req.user.id));
});

app.post('/api/posts',auth,(req,res)=>{
  const {content,image_url}=req.body;
  const info=db.prepare('INSERT INTO posts (user_id,content,image_url) VALUES (?,?,?)').run(req.user.id,content,image_url||null);
  res.json({id:info.lastInsertRowid});
});

app.post('/api/posts/:id/like',auth,(req,res)=>{
  const pid=req.params.id;
  const liked=db.prepare('SELECT 1 FROM likes WHERE post_id=? AND user_id=?').get(pid,req.user.id);
  if(liked){db.prepare('DELETE FROM likes WHERE post_id=? AND user_id=?').run(pid,req.user.id);return res.json({liked:false});}
  db.prepare('INSERT INTO likes (post_id,user_id) VALUES (?,?)').run(pid,req.user.id);res.json({liked:true});
});

// Get comments with 2-tier structure (with inline mentions)
app.get('/api/posts/:id/comments',auth,(req,res)=>{
  const stmt=db.prepare(`
    SELECT c.*, u.username, u.full_name, u.avatar,
           pc.username as parent_username, pc.full_name as parent_full_name,
           pc.username as reply_to_username
    FROM comments c 
    JOIN users u ON u.id = c.author_id 
    LEFT JOIN comments parent ON parent.id = c.parent_comment_id
    LEFT JOIN users pc ON pc.id = parent.author_id
    WHERE c.post_id = ? 
    ORDER BY 
      COALESCE(c.root_comment_id, c.id) ASC,
      CASE WHEN c.root_comment_id IS NULL THEN 0 ELSE 1 END ASC,
      c.created_at ASC
  `);
  
  const comments = stmt.all(req.params.id);
  
  // Get mentions for all comments in one query
  const commentIds = comments.map(c => c.id);
  let mentionsMap = {};
  if (commentIds.length > 0) {
    const mentionsStmt = db.prepare(`
      SELECT m.*, u.username, u.full_name, u.avatar
      FROM mentions m
      JOIN users u ON u.id = m.mentioned_user_id
      WHERE m.comment_id IN (${commentIds.map(() => '?').join(',')})
      ORDER BY m.position ASC
    `);
    const allMentions = mentionsStmt.all(...commentIds);
    
    // Group mentions by comment_id
    allMentions.forEach(mention => {
      if (!mentionsMap[mention.comment_id]) {
        mentionsMap[mention.comment_id] = [];
      }
      mentionsMap[mention.comment_id].push(mention);
    });
  }
  
  // Add mentions to each comment
  comments.forEach(comment => {
    comment.mentions = mentionsMap[comment.id] || [];
  });
  
  // Group comments by root_comment_id
  const grouped = {};
  comments.forEach(comment => {
    const rootId = comment.root_comment_id || comment.id;
    if (!grouped[rootId]) {
      grouped[rootId] = {
        root: null,
        replies: []
      };
    }
    
    if (!comment.root_comment_id) {
      grouped[rootId].root = comment;
    } else {
      grouped[rootId].replies.push(comment);
    }
  });
  
  // Convert to array format
  const result = Object.values(grouped)
    .filter(group => group.root)
    .map(group => ({
      ...group.root,
      replies: group.replies
    }));
  
  res.json(result);
});

// Get mentions for a specific comment
app.get('/api/comments/:id/mentions', auth, (req, res) => {
  const stmt = db.prepare(`
    SELECT m.*, u.username, u.full_name, u.avatar
    FROM mentions m
    JOIN users u ON u.id = m.mentioned_user_id
    WHERE m.comment_id = ?
    ORDER BY m.position ASC
  `);
  
  const mentions = stmt.all(req.params.id);
  res.json(mentions);
});

// Create comment with mention support and anti-spam limits
app.post('/api/posts/:id/comments', auth, upload.single('image'), (req, res) => {
  const { content, parent_comment_id } = req.body;
  const postId = req.params.id;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
  try {
    // Basic validation - either content or image is required
    if ((!content || content.trim().length === 0) && !imageUrl) {
      return res.status(400).json({ error: 'Comment content or image is required' });
    }
    
    if (content.length > 2000) {
      return res.status(400).json({ error: 'Comment too long (max 2000 characters)' });
    }
    
    // Check comment rate limit (max 10 comments per minute)
    const recentComments = db.prepare(`
      SELECT COUNT(*) as count FROM comments 
      WHERE author_id = ? AND created_at > datetime('now', '-1 minute')
    `).get(req.user.id);
    
    if (recentComments.count >= 10) {
      return res.status(429).json({ error: 'Too many comments. Please wait a moment.' });
    }
    
    // Determine root_comment_id
    let rootCommentId = null;
    if (parent_comment_id) {
      const parentComment = db.prepare('SELECT root_comment_id FROM comments WHERE id = ?').get(parent_comment_id);
      if (parentComment) {
        rootCommentId = parentComment.root_comment_id || parent_comment_id;
      }
    }
    
    // Insert comment
    const insertComment = db.prepare(`
      INSERT INTO comments (post_id, author_id, content, root_comment_id, parent_comment_id, image_url) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const commentResult = insertComment.run(postId, req.user.id, content || '', rootCommentId, parent_comment_id || null, imageUrl);
    const commentId = commentResult.lastInsertRowid;
    
    // Extract and validate mentions
    const mentions = extractMentions(content);
    if (mentions.length > 5) {
      return res.status(400).json({ error: 'You can mention up to 5 friends only' });
    }
    
    if (mentions.length > 0) {
      const getFriends = db.prepare('SELECT friend_id FROM friends WHERE user_id = ?');
      const friendIds = getFriends.all(req.user.id).map(f => f.friend_id);
      
      const insertMention = db.prepare(`
        INSERT INTO mentions (comment_id, mentioned_user_id, mentioned_username, position) 
        VALUES (?, ?, ?, ?)
      `);
      
      const insertNotification = db.prepare(`
        INSERT INTO notifications (user_id, type, title, message, related_id) 
        VALUES (?, ?, ?, ?, ?)
      `);
      
      mentions.forEach(mention => {
        const mentionedUser = db.prepare('SELECT id, full_name FROM users WHERE username = ?').get(mention.username);
        if (mentionedUser && friendIds.includes(mentionedUser.id)) {
          insertMention.run(commentId, mentionedUser.id, mention.username, mention.position);
          
          // Send notification to mentioned user
          const currentUser = db.prepare('SELECT full_name FROM users WHERE id = ?').get(req.user.id);
          insertNotification.run(
            mentionedUser.id,
            'mention',
            'You were mentioned in a comment',
            `${currentUser.full_name} mentioned you in a comment`,
            commentId
          );
        }
      });
    }
    
    res.json({
      id: commentId,
      content: content || '',
      image_url: imageUrl,
      root_comment_id: rootCommentId,
      parent_comment_id: parent_comment_id || null,
      created_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Get notifications for current user
app.get('/api/notifications', auth, (req, res) => {
  const stmt = db.prepare(`
    SELECT * FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 50
  `);
  
  const notifications = stmt.all(req.user.id);
  res.json(notifications);
});

// Mark notification as read
app.put('/api/notifications/:id/read', auth, (req, res) => {
  const notificationId = req.params.id;
  
  try {
    const updated = db.prepare(`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE id = ? AND user_id = ?
    `).run(notificationId, req.user.id);
    
    if (updated.changes === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all notifications as read
app.put('/api/notifications/read-all', auth, (req, res) => {
  try {
    db.prepare(`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE user_id = ? AND is_read = FALSE
    `).run(req.user.id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// Delete comment with cascade deletion of replies
app.delete('/api/comments/:id', auth, (req, res) => {
  const commentId = req.params.id;
  
  try {
    // Check if user owns the comment
    const comment = db.prepare('SELECT author_id, root_comment_id FROM comments WHERE id = ?').get(commentId);
    if (!comment || comment.author_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }
    
    // Collect all comment IDs to delete 
    let commentIdsToDelete = [];
    
    // If this is a root comment, find all its replies first
    if (!comment.root_comment_id) {
      const replies = db.prepare('SELECT id FROM comments WHERE root_comment_id = ?').all(commentId);
      // Add replies first (children), then root comment (parent)
      commentIdsToDelete = [...replies.map(r => r.id), commentId];
    } else {
      // If it's a reply, just delete it
      commentIdsToDelete = [commentId];
    }
    
    console.log(`🗑️ Deleting comment ${commentId} and ${commentIdsToDelete.length - 1} replies`);
    
    // Delete mentions for all comments
    const deleteMentionsStmt = db.prepare('DELETE FROM mentions WHERE comment_id = ?');
    commentIdsToDelete.forEach(id => deleteMentionsStmt.run(id));
    
    // Delete related notifications for all comments
    const deleteNotificationsStmt = db.prepare('DELETE FROM notifications WHERE related_id = ? AND type = ?');
    commentIdsToDelete.forEach(id => deleteNotificationsStmt.run(id, 'mention'));
    
    // Delete comments in correct order: children first, then parent
    const deleteCommentStmt = db.prepare('DELETE FROM comments WHERE id = ?');
    commentIdsToDelete.forEach(id => deleteCommentStmt.run(id));
    
    res.json({ 
      success: true, 
      deletedCount: commentIdsToDelete.length,
      message: `Deleted comment and ${commentIdsToDelete.length - 1} replies` 
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

app.listen(PORT,()=>console.log(`🚀 API running on http://localhost:${PORT}`)); 