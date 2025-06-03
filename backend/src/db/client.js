import redis from 'redis';

let client = null;
(async () => {
    client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    client.on('error', (err) => {
        console.error('Redis Client Error:', err);
    });

    await client.connect();
    console.log(' Redis connected successfully');
})();
const getClient = () => client;

export {
    getClient
};

