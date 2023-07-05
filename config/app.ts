export default () => ({
  app: {
    port: parseInt(process.env.PORT) || 4000,
    env: process.env.NODE_ENV || 'local',
  },
});
