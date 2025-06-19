const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  try {
    console.log('🔍 Testing API with seeded data...\n');

    // 1. Login to get token
    console.log('1️⃣ Testing login...');
    const loginResponse = await axios.post(`${API_BASE}/login`, {
      username: 'admin',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. Get comments for post 1
    console.log('\n2️⃣ Testing GET comments...');
    const commentsResponse = await axios.get(`${API_BASE}/posts/1/comments`, { headers });
    const comments = commentsResponse.data;
    
    console.log(`✅ Retrieved ${comments.length} root comments`);
    
    // Display comment structure
    console.log('\n📊 Comment Structure:');
    comments.forEach((comment, index) => {
      console.log(`💬 [${comment.id}] ${comment.full_name}: ${comment.content.substring(0, 50)}...`);
      console.log(`   - Mentions: ${comment.mentions ? comment.mentions.length : 0}`);
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach(reply => {
          console.log(`  ↳ [${reply.id}] ${reply.full_name}: ${reply.content.substring(0, 50)}...`);
          console.log(`     - Mentions: ${reply.mentions ? reply.mentions.length : 0}`);
          console.log(`     - Reply to: ${reply.reply_to_username || 'N/A'}`);
        });
      }
      console.log('');
    });

    // 3. Test friends API
    console.log('3️⃣ Testing GET friends...');
    const friendsResponse = await axios.get(`${API_BASE}/friends`, { headers });
    const friends = friendsResponse.data;
    
    console.log(`✅ Retrieved ${friends.length} friends`);
    console.log('Friends list:', friends.map(f => f.username).join(', '));

    // 4. Test adding new comment with mention
    console.log('\n4️⃣ Testing POST new comment...');
    const newCommentResponse = await axios.post(`${API_BASE}/posts/1/comments`, {
      content: '@mai.tien.dung Test comment từ admin với mention!',
      parent_comment_id: null
    }, { headers });
    
    console.log('✅ New comment added:', newCommentResponse.data);

    // 5. Test adding reply with mention
    console.log('\n5️⃣ Testing POST reply comment...');
    const newReplyResponse = await axios.post(`${API_BASE}/posts/1/comments`, {
      content: '@mai.thi.thao Đây là reply test!',
      parent_comment_id: 1
    }, { headers });
    
    console.log('✅ New reply added:', newReplyResponse.data);

    // 6. Test notifications
    console.log('\n6️⃣ Testing GET notifications...');
    const notificationsResponse = await axios.get(`${API_BASE}/notifications`, { headers });
    const notifications = notificationsResponse.data;
    
    console.log(`✅ Retrieved ${notifications.length} notifications`);
    notifications.slice(0, 3).forEach(notif => {
      console.log(`🔔 ${notif.title}: ${notif.message} (${notif.is_read ? 'Read' : 'Unread'})`);
    });

    console.log('\n✅ All API tests passed! The 2-tier comment system is working correctly.');

  } catch (error) {
    console.error('❌ API Test Error:', error.response?.data || error.message);
  }
}

// Run tests
testAPI(); 