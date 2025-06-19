const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

try {
  // Xem tất cả comments để chọn xóa
  const comments = db.prepare('SELECT id, content, author_id FROM comments ORDER BY id DESC LIMIT 10').all();
  console.log('Current comments:');
  comments.forEach(c => {
    console.log(`ID: ${c.id}, Content: ${c.content.substring(0, 50)}..., Author: ${c.author_id}`);
  });

  // Xóa 3 comments cuối cùng (có thể là test comments)
  const lastThreeIds = comments.slice(0, 3).map(c => c.id);
  console.log('\nDeleting comments with IDs:', lastThreeIds);

  lastThreeIds.forEach(id => {
    // Xóa mentions trước
    db.prepare('DELETE FROM mentions WHERE comment_id = ?').run(id);
    // Xóa comment
    db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    console.log(`Deleted comment ID: ${id}`);
  });

  console.log('\nDone! Deleted 3 comments.');
} catch (error) {
  console.error('Error:', error);
} finally {
  db.close();
} 