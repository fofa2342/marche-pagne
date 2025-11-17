import 'dotenv/config';
import mysql from 'mysql2/promise';

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      // If your provider requires TLS/SSL, enable or provide the CA here:
      // ssl: { rejectUnauthorized: true } // or ssl: { ca: fs.readFileSync('/path/to/ca.pem') }
    });
    const [rows] = await conn.query('SELECT 1 AS ok');
    console.log('DB test OK:', rows);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('DB test ERROR:', err);
    process.exit(1);
  }
})();