export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    port: parseInt(process.env.AUTH_PORT || '8082', 10),
  },
  nodeEnv: process.env.NODE_ENV || 'development',
});
