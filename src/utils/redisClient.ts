import { createClient } from 'redis';
import { REDISURL } from '../config/env';


const redisClient = createClient({
  url: REDISURL,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

(async () => {
  await redisClient.connect();
})();

export default redisClient;
