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

  await redis.zadd('highscores', score, cleanName);

  res.status(200).json({ success: true });
}
