export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  user: {
    port: parseInt(process.env.USER_PORT || '8083', 10),
  },
  nodeEnv: process.env.NODE_ENV || 'development',
});
