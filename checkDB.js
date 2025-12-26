import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    await client.connect();
    console.log("DB接続成功");

    const result = await client.query("SELECT COUNT(*) FROM tbltype;");
    console.log("tblpokedex の件数:", result.rows[0].count);
  } catch (err) {
    console.error("エラー:", err);
  } finally {
    await client.end();
  }
}

check();
