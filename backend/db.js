require("dotenv").config();
const { Pool } = require("pg");


// Create a new pool instance with the database configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Export a helper function for querying the database
module.exports = {
  query: (text, params) => pool.query(text, params),
};