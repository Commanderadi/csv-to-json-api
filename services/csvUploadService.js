const pool = require('../db');

async function saveUserToDB(record) {
  const name = `${record.name.firstName} ${record.name.lastName}`;
  const age = parseInt(record.age);
  const address = record.address || {};
  delete record.name;
  delete record.age;
  delete record.address;

  const additional_info = record;

  await pool.execute(
    `INSERT INTO users (name, age, address, additional_info) VALUES (?, ?, ?, ?)`,
    [name, age, JSON.stringify(address), JSON.stringify(additional_info)]
  );
}

async function showAgeGroupStats() {
  const [rows] = await pool.execute(`
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN age < 20 THEN 1 ELSE 0 END) AS below_20,
      SUM(CASE WHEN age BETWEEN 20 AND 40 THEN 1 ELSE 0 END) AS between_20_40,
      SUM(CASE WHEN age BETWEEN 41 AND 60 THEN 1 ELSE 0 END) AS between_40_60,
      SUM(CASE WHEN age > 60 THEN 1 ELSE 0 END) AS above_60
    FROM users;
  `);

  const row = rows[0];
  const pct = (x) => ((x / row.total) * 100).toFixed(2);

  console.log('\n📊 Age Group % Distribution:');
  console.log(`< 20     : ${pct(row.below_20)}%`);
  console.log(`20–40    : ${pct(row.between_20_40)}%`);
  console.log(`40–60    : ${pct(row.between_40_60)}%`);
  console.log(`> 60     : ${pct(row.above_60)}%`);
}

module.exports = { saveUserToDB, showAgeGroupStats };
