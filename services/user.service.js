const pool = require("../database/db");

async function insertUsers(users) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO users (name, age, address, additional_info)
      VALUES ($1, $2, $3, $4)
    `;
    for (const user of users) {
      await client.query(query, [
        user.name,
        user.age,
        user.address,
        user.additional_info,
      ]);
    }
  } finally {
    client.release();
  }
}

async function getAgeDistribution() {
  const result = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE age < 20) AS under20,
      COUNT(*) FILTER (WHERE age BETWEEN 20 AND 40) AS age20_40,
      COUNT(*) FILTER (WHERE age BETWEEN 41 AND 60) AS age40_60,
      COUNT(*) FILTER (WHERE age > 60) AS over60,
      COUNT(*) AS total
    FROM users
  `);
  const r = result.rows[0];
  const total = parseInt(r.total);

  return {
    "<20": Math.round((r.under20 / total) * 100),
    "20–40": Math.round((r.age20_40 / total) * 100),
    "40–60": Math.round((r.age40_60 / total) * 100),
    ">60": Math.round((r.over60 / total) * 100),
  };
}

module.exports = { insertUsers, getAgeDistribution };
