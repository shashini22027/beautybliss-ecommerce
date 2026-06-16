import redis from '../config/redis.js';

const cacheMiddleware = (ttl = 60) => {
  return async (req, res, next) => {
    // Generate cache key based on route
    const key = req.originalUrl;
    
    try {
      if (redis.status !== 'ready') {
        return next(); // Fallback to DB if redis is not ready
      }

      const cachedData = await redis.get(key);
      if (cachedData) {
        console.log(`CACHE HIT: ${key}`);
        return res.json(JSON.parse(cachedData));
      }

      console.log(`CACHE MISS: ${key}`);
      
      // Intercept res.json to cache the response
      const originalJson = res.json;
      res.json = function (data) {
        // Cache the data before sending it
        redis.setex(key, ttl, JSON.stringify(data)).catch((err) => {
          console.warn('Redis cache set error:', err.message);
        });
        
        // Call the original res.json
        originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.warn('Redis cache middleware error:', error.message);
      next(); // Fallback to DB on error
    }
  };
};

export const clearCache = async (pattern) => {
  try {
    if (redis.status !== 'ready') return;
    
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Cleared cache for pattern: ${pattern}`);
    }
  } catch (error) {
    console.warn('Redis clear cache error:', error.message);
  }
};

export default cacheMiddleware;
