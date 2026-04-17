export default () => ({
  database: {
    url: process.env.MONGODB_URI,
  },
  videos: {
    port: parseInt(process.env.VIDEOS_PORT || '8081', 10),
  },
  nodeEnv: process.env.NODE_ENV || 'development',
});
