import { requireAdminAuth } from './auth.js';
import { getRedisClient } from './redis.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!requireAdminAuth(req, res)) {
    return;
  }

  if (!process.env.REDIS_URL) {
    res.status(500).json({ error: 'REDIS_URL is not configured' });
    return;
  }

  const redis = getRedisClient();
  let entries;

  try {
    entries = await redis.zrevrange('highscores', 0, 99, 'WITHSCORES');
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
