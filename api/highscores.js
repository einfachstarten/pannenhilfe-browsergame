import Redis from 'ioredis';

let redisClient;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL);
  }
  return redisClient;
}

export default async function handler(req, res) {
  if (!process.env.REDIS_URL) {
    res.status(500).json({ error: 'REDIS_URL is not configured' });
    return;
  }

  const redis = getRedisClient();
  let entries;
  try {
    entries = await redis.zrevrange('highscores', 0, 9, 'WITHSCORES');
  } catch (error) {
    console.error('Failed to load highscores', error);
    res.status(500).json({ error: 'Failed to load highscores' });
    return;
  }
  const scores = [];

  for (let i = 0; i < entries.length; i += 2) {
    const name = entries[i];
    const score = Number(entries[i + 1]);
    scores.push({ name, score });
  }

  res.status(200).json(scores);
}
