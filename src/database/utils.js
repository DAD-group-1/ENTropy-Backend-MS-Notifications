const buildMongoUri = () => {
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ?? '27017';
  const db = process.env.DB_NAME ?? 'entropy_notifs_db';

  return `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`;
};

module.exports = { buildMongoUri };
