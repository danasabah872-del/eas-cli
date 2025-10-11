const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
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

// --- MOCK TIKTOK API ---
// In a real app, this would be a call to the actual TikTok API
const fetchVideosFromTikTokAPI = async () => {
  console.log('Fetching videos from TikTok API...');
  // This is mock data. In a real implementation, you would use the TikTok API
  // to get a list of trending videos.
  return [
    { id: 1, platform: 'tiktok', url: 'https://v16-webapp.tiktok.com/video1.mp4', author: '@user1', description: 'This is a cool video!', likes: 1500, comments: 300, createdAt: new Date() },
    { id: 2, platform: 'tiktok', url: 'https://v16-webapp.tiktok.com/video2.mp4', author: '@user2', description: 'Another great video!', likes: 2500, comments: 500, createdAt: new Date() },
    { id: 3, platform: 'tiktok', url: 'https://v16-webapp.tiktok.com/video3.mp4', author: '@user3', description: 'Check this out!', likes: 500, comments: 50, createdAt: new Date() },
  ];
};

// Endpoint to get trending videos for a platform
app.get('/api/videos/tiktok', async (req, res) => {
  try {
    const tiktokVideos = await fetchVideosFromTikTokAPI();
    res.json(tiktokVideos);
  } catch (error) {
    res.status(500).send('Error fetching videos from TikTok.');
  }
});

// Simple cron job to clean up old videos every hour
// Note: This is not a robust solution for production.
// A better approach would be to use a proper cron job library or a separate service.
let videosCache = [];
setInterval(async () => {
  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

  const freshVideos = await fetchVideosFromTikTokAPI();
  videosCache = freshVideos.filter(video => video.createdAt > fortyEightHoursAgo);
  console.log(`Updated video cache. Total videos: ${videosCache.length}`);

}, 3600000); // Run every hour


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
