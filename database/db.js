require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool();

pool
  .query("SELECT CURRENT_DATE")
  .then((res) =>
    console.log("Connected to DB — Current_date", res.rows[0].current_date)
  )
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
    process.exit(1);
  });

module.exports = pool;
