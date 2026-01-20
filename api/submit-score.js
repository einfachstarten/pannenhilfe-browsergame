import Redis from 'ioredis';

let redisClient;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL);
  }
  return redisClient;
}

function sanitizeName(rawName) {
  return rawName.replace(/[<>]/g, '').slice(0, 12);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.REDIS_URL) {
    res.status(500).json({ error: 'REDIS_URL is not configured' });
    return;
  }

  const { name, score } = req.body ?? {};

  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  if (typeof score !== 'number' || Number.isNaN(score)) {
    res.status(400).json({ error: 'Score must be a number' });
    return;
  }

  const cleanName = sanitizeName(String(name));
  const redis = getRedisClient();

  try {
    await redis.zadd('highscores', score, cleanName);
  } catch (error) {
    console.error('Failed to submit score', error);
    res.status(500).json({ error: 'Failed to submit score' });
    return;
  }

  res.status(200).json({ success: true });
}
