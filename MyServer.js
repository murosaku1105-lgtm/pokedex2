// MyServer.js
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
// 静的ファイル公開
app.use(express.static(path.join(__dirname)));

// PostgreSQL 接続設定
const pool = new Pool({
  host: "127.0.0.1",
  user: "postgres",
  password: "postgres",
  database: "pokedb",
  port: 5432,
});

// 接続確認（任意だが強く推奨）
pool.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => console.error("DB connection error", err));

// NoのMin値を取得
app.get("/api/poke/minNo", async (req, res) => {
  try {
    const query = `
      SELECT
      Min(pokeid) AS min
      FROM
      viewpokedex
    `;
    const result = await pool.query(query);

    const minNo = result.rows[0]?.min ?? 0;

    res.json({ min: minNo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// NoのMax値を取得
app.get("/api/poke/maxNo", async (req, res) => {
  try {
    const query = `
      SELECT
      Max(pokeid) AS max
      FROM
      viewpokedex
    `;
    const result = await pool.query(query);

    const maxNo = result.rows[0]?.max ?? 0;

    res.json({ max: maxNo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// タイプ全体の取得
app.get("/api/poke/type", async (req, res) => {
  try {
    const query = `
      SELECT
      typeid,
      type,
      pathtype
      FROM
      tbltype
    `;

    const result = await pool.query(query);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 地方全体の取得
app.get("/api/poke/region", async (req, res) => {
  try {
    const query = `
      SELECT
      regionid,
      region
      FROM
      tblregion
    `;

    const result = await pool.query(query);
    res.json(result.rows);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 世代全体の取得
app.get("/api/poke/gen", async (req, res) => {
  try {
    const query = `
      SELECT
      genid,
      gen
      FROM
      tblgen
    `;

    const result = await pool.query(query);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//基本情報取得(1件)
app.get("/api/poke", async (req, res) => {
  try {
    const pokeId = req.query.pokeid ?? 1;

    const query = `
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
      WHERE PokeID = $1
    `;

    const result = await pool.query(query, [pokeId]);

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

//検索時の基本情報取得(複数件)
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
      WHERE 1=1
    `;

    const params = [];

    // 名前検索
    if (name) {
      params.push(`%${name}%`);
      sql += ` AND name ILIKE $${params.length}`;
    }

    // タイプ検索
    if (types && types.length > 0) {
      sql += ` AND (type1 IN (
                  SELECT type FROM tbltype WHERE typeid = ANY($${params.length + 1})
                )
                OR type2 IN (
                  SELECT type FROM tbltype WHERE typeid = ANY($${params.length + 1})
                ))`;
      params.push(types);
    }

    // 地方検索
    if (region) {
      params.push(region);
      sql += ` AND region = (
                SELECT region FROM tblregion WHERE regionid = $${params.length}
              )`;
    }

    // 世代検索
    if (gen) {
      params.push(gen);
      sql += ` AND gen = (
                SELECT gen FROM tblgen WHERE genid = $${params.length}
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


//画像リスト取得
app.get("/api/pokelist", async (req, res) => {
  try {
    const query = `
      SELECT
      pokeid,
      pathnormal,
      pathshiny
      FROM
      viewpokedex
      ORDER BY
      pokeid
    `;

    const result = await pool.query(query);
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