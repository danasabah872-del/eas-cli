const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// A temporary store for users. Replace with a database in production.
const users = [];

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// JWT Secret - Should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_for_development';

app.get('/', (req, res) => {
  res.send('Social Media Aggregator Backend is running!');
});

// Placeholder for TikTok authentication endpoint
app.post('/auth/tiktok', async (req, res) => {
  // The frontend will send an authorization code, which we'll exchange for an access token.
  // This is a simplified placeholder.
  const { code } = req.body;

  if (!code) {
    return res.status(400).send("Authorization code is missing.");
  }

  // In a real implementation, you would:
  // 1. Exchange the code for an access token from TikTok.
  // 2. Use the access token to get user info from TikTok's API.
  // 3. Find or create a user in your database.
  // 4. Create a JWT and send it back to the client.

  // For now, we'll simulate a successful login.
  const mockTikTokUser = {
    id: 'tiktok-user-123',
    username: 'tiktok_user',
  };

  const user = {
    id: `user-${users.length + 1}`,
    tiktokId: mockTikTokUser.id,
    username: mockTikTokUser.username,
  };
  users.push(user);

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// A temporary store for videos. Will include a createdAt timestamp.
const videos = [
  { id: 1, platform: 'tiktok', url: 'https://v16-webapp.tiktok.com/video1.mp4', author: '@user1', likes: 1500, comments: 300, createdAt: new Date() },
  { id: 2, platform: 'tiktok', url: 'https://v16-webapp.tiktok.com/video2.mp4', author: '@user2', likes: 2500, comments: 500, createdAt: new Date() },
  { id: 3, platform: 'tiktok', url: 'https://v16-webapp.tiktok.com/video3.mp4', author: '@user3', likes: 500, comments: 50, createdAt: new Date() },
];

// Endpoint to get trending videos for a platform
app.get('/api/videos/tiktok', (req, res) => {
  // In a real app, you would fetch this from the TikTok API
  // For now, we return mock data.
  const tiktokVideos = videos.filter(v => v.platform === 'tiktok');
  res.json(tiktokVideos);
});

// Simple cron job to clean up old videos every hour
setInterval(() => {
  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

  // Filter out videos that are older than 48 hours
  const recentVideos = videos.filter(video => video.createdAt > fortyEightHoursAgo);

  if (recentVideos.length < videos.length) {
    console.log(`Cleaned up ${videos.length - recentVideos.length} old videos.`);
    // In a real app with a database, you would perform a delete operation here.
    // For our in-memory store, we can just replace the array.
    // This is a simplified example. A more robust solution is needed for production.
    videos.length = 0; // Clear the original array
    Array.prototype.push.apply(videos, recentVideos); // Push the recent videos back
  }
}, 3600000); // Run every hour


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
