import Redis from 'ioredis';

let redisClient;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL);
  }
  return redisClient;
}

export default async function handler(req, res) {
  const redis = getRedisClient();
  const entries = await redis.zrevrange('highscores', 0, 9, 'WITHSCORES');
  const scores = [];

  for (let i = 0; i < entries.length; i += 2) {
    const name = entries[i];
    const score = Number(entries[i + 1]);
    scores.push({ name, score });
  }

  res.status(200).json(scores);
}
