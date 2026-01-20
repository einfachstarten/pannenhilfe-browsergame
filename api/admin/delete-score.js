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

  const { member } = req.body ?? {};

  if (!member) {
    res.status(400).json({ error: 'Member is required' });
    return;
  }

  const redis = getRedisClient();

  try {
    await redis.zrem('highscores', member);
  } catch (error) {
    console.error('Failed to delete score', error);
    res.status(500).json({ error: 'Failed to delete score' });
    return;
  }

  res.status(200).json({ success: true });
}
