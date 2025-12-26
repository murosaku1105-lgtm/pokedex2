// commandSQL04.js
import pkg from 'pg';
import dotenv from "dotenv";
dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runSQL() {
  try {
    await client.connect();
    console.log("DB接続成功");

    // 既存ビューを安全に削除（任意）
    await client.query(`DROP VIEW IF EXISTS viewpokedex;`);

    // ビュー作成
    await client.query(`
      CREATE VIEW viewpokedex AS
      SELECT
        pokedex.pokeid,
        pokedex.name,
        type1.type AS type1,
        type2.type AS type2,
        region.region AS region,
        gen.gen AS gen,
        image.pathnormal AS pathnormal,
        image.pathshiny AS pathshiny
      FROM
        tblpokedex AS pokedex
      LEFT OUTER JOIN tbltype AS type1
        ON pokedex.type1id = type1.typeid
      LEFT OUTER JOIN tbltype AS type2
        ON pokedex.type2id = type2.typeid
      INNER JOIN tblregion AS region
        ON pokedex.regionid = region.regionid
      INNER JOIN tblgen AS gen
        ON pokedex.genid = gen.genid
      INNER JOIN tblimage AS image
        ON pokedex.pokeid = image.pokeid
      ORDER BY pokedex.pokeid;
    `);

    console.log("ビュー viewpokedex の作成が完了しました！");
  } catch (err) {
    console.error("SQL実行エラー:", err);
  } finally {
    await client.end();
    console.log("DB接続終了");
  }
}

runSQL();
