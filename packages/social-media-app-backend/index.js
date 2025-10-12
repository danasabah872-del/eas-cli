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

app.post('/auth/tiktok', async (req, res) => {
  const { code, redirectUri } = req.body;

  if (!code) {
    return res.status(400).send('Authorization code is missing.');
  }
  if (!redirectUri) {
    return res.status(400).send('Redirect URI is missing.');
  }

  const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
  const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;

  if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) {
    console.error('TikTok client key or secret is not configured in environment variables.');
    return res.status(500).send('Server configuration error.');
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenResponse = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      new URLSearchParams({
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, open_id } = tokenResponse.data;

    if (!access_token || !open_id) {
      return res.status(400).send('Failed to retrieve access token from TikTok.');
    }

    // 2. Fetch user info from TikTok
    const userResponse = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        fields: 'open_id,display_name,avatar_large',
      },
    });

    const tikTokUser = userResponse.data.data.user;

    // 3. Find or create a user in our system
    let user = users.find(u => u.tiktokId === tikTokUser.open_id);

    if (!user) {
      user = {
        id: `user-${users.length + 1}`,
        tiktokId: tikTokUser.open_id,
        username: tikTokUser.display_name,
        avatar: tikTokUser.avatar_large,
      };
      users.push(user);
    }

    // 4. Create a JWT and send it back to the client
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Error during TikTok authentication:', error.response ? error.response.data : error.message);
    res.status(500).send('An error occurred during TikTok authentication.');
  }
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
