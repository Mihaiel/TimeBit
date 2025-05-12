// config/database.js
import { Sequelize } from 'sequelize';
import { config } from './env.js';

// Sequelize instance that connects to MySQL
const sequelize = new Sequelize(
  config.dbName,     
  config.dbUser,
  config.dbPassword,
  {
    host: config.dbHost,  // Database host
    dialect: 'mysql',     // Database type
  }
);

// Test the connection to make sure it's working
sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to the MySQL database!");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.stack);
  });

export default sequelize;
