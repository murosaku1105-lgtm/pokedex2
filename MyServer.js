// MyServer.js (ESM版)
import express from "express";
import cors from "cors";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;

// __dirname を ESM で使うための定義
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 静的ファイル公開
app.use(express.static(path.join(__dirname)));

// PostgreSQL 接続設定(Render用)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 接続確認
pool.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => console.error("DB connection error", err));


// =======================
// API 定義
// =======================

// NoのMin値を取得
app.get("/api/poke/minNo", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
      Min(pokeid) AS min
      FROM
      viewpokedex
    `);
    res.json({ min: result.rows[0]?.min ?? 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// NoのMax値を取得
app.get("/api/poke/maxNo", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
      Max(pokeid) AS max
      FROM
      viewpokedex
    `);
    res.json({ max: result.rows[0]?.max ?? 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// タイプ全体の取得
app.get("/api/poke/type", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
      typeid,
      type,
      pathtype
      FROM
      tbltype
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 地方全体の取得
app.get("/api/poke/region", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
      regionid,
      region
      FROM
      tblregion
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 世代全体の取得
app.get("/api/poke/gen", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
      genid,
      gen
      FROM
      tblgen
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 基本情報取得(1件)
app.get("/api/poke", async (req, res) => {
  try {
    const pokeId = req.query.pokeid ?? 1;

    const result = await pool.query(`
      SELECT
      pokeid,
      name,
      type1,
      type2,
      region,
      gen,
      pathnormal,
      pathshiny
      FROM
      viewpokedex
      WHERE
      pokeid = $1
    `, [pokeId]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Pokemon is not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 検索（複数件）
app.post("/api/poke/search", async (req, res) => {
  try {
    const { name, types, region, gen } = req.body;

    let sql = `
      SELECT
      pokeid,
      name,
      type1,
      type2,
      region,
      gen,
      pathnormal,
      pathshiny
      FROM
      viewpokedex
      WHERE
      1=1
    `;
    const params = [];

    if (name) {
      params.push(`%${name}%`);
      sql +=
      `
      AND
      name ILIKE $${params.length}
      `;
    }

    if (types && types.length > 0) {
      params.push(types);
      sql +=
      `
      AND
      (
        type1 IN
        (
          SELECT
          type
          FROM
          tbltype
          WHERE
          typeid = ANY($${params.length})
        )
        OR
        type2 IN
        (
          SELECT
          type
          FROM
          tbltype
          WHERE
          typeid = ANY($${params.length})
        )
      )`;
    }

    if (region) {
      params.push(region);
      sql +=
      `
      AND
      region = (
        SELECT
        region
        FROM
        tblregion
        WHERE
        regionid = $${params.length}
      )`;
    }

    if (gen) {
      params.push(gen);
      sql +=
      `
      AND
        gen = (
          SELECT
          gen
          FROM
          tblgen
          WHERE
          genid = $${params.length}
        )`;
    }

    sql += " ORDER BY pokeid";

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 画像リスト取得
app.get("/api/pokelist", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
      pokeid,
      pathnormal,
      pathshiny
      FROM
      viewpokedex
      ORDER BY
      pokeid
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// サーバ起動
app.listen(port, () => {
  console.log(`Server started: http://localhost:${port}`);
});
//http://localhost:3001/api/poke?pokeid=5
//http://localhost:3001/MyPokedex.html
//c:\Users\takeshita\Desktop\JavaScriptの繋げ方.txt