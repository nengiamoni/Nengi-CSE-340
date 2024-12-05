const { Pool } = require("pg");
require("dotenv").config();

// Connection Pool
let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,  // Disable this for production if needed
    },
  });

  // Query logging for development
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("Executed query", { text });
        return res;
      } catch (error) {
        console.error("Error in query", { text });
        throw error;
      }
    },
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  module.exports = pool;
}
