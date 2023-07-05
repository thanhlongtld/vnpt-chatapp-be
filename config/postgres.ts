export default () => ({
  postgres: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: false,
    entities: ['dist/src/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    cli: {
      migrationsDir: './db/migrations/',
    },
  },
});
