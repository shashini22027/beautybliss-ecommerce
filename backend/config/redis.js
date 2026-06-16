import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) {
      return null; // Stop retrying
    }
    return Math.min(times * 50, 2000);
  },
});

redis.on('error', (error) => {
  if (error.code !== 'ECONNREFUSED') {
    console.warn('Redis error:', error.message);
  }
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

export default redis;
