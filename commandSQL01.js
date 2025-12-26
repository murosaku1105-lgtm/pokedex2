// commandSQL01.js
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

    // --- tblType ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS tbltype(
        typeid INTEGER NOT NULL,
        type VARCHAR(10) NOT NULL,
        pathtype VARCHAR(50) NOT NULL,
        PRIMARY KEY (typeid)
      );
    `);

    await client.query(`
      INSERT INTO tbltype(typeid, type, pathtype)
      VALUES
      (1, 'ノーマル', 'image/type/01.png'),
      (2, 'ほのお', 'image/type/02.png'),
      (3, 'みず', 'image/type/03.png'),
      (4, 'くさ', 'image/type/04.png'),
      (5, 'でんき', 'image/type/05.png'),
      (6, 'こおり', 'image/type/06.png'),
      (7, 'かくとう', 'image/type/07.png'),
      (8, 'どく', 'image/type/08.png'),
      (9, 'じめん', 'image/type/09.png'),
      (10, 'ひこう', 'image/type/10.png'),
      (11, 'エスパー', 'image/type/11.png'),
      (12, 'むし', 'image/type/12.png'),
      (13, 'いわ', 'image/type/13.png'),
      (14, 'ゴースト', 'image/type/14.png'),
      (15, 'ドラゴン', 'image/type/15.png'),
      (16, 'あく', 'image/type/16.png'),
      (17, 'はがね', 'image/type/17.png'),
      (18, 'フェアリー', 'image/type/18.png')
      ON CONFLICT (typeid) DO NOTHING;
    `);

    // --- tblRegion ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS tblregion(
        regionid INTEGER NOT NULL,
        region VARCHAR(10) NOT NULL,
        PRIMARY KEY (regionid)
      );
    `);

    await client.query(`
      INSERT INTO tblregion(regionid, region)
      VALUES
      (1, 'カントー地方'),
      (2, 'ジョウト地方'),
      (3, 'ホウエン地方'),
      (4, 'シンオウ地方'),
      (5, 'イッシュ地方'),
      (6, 'カロス地方'),
      (7, 'アローラ地方'),
      (8, 'ガラル地方'),
      (9, 'ヒスイ地方'),
      (10, 'パルデア地方')
      ON CONFLICT (regionid) DO NOTHING;
    `);

    // --- tblGen ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS tblgen(
        genid INTEGER NOT NULL,
        gen VARCHAR(10) NOT NULL,
        PRIMARY KEY (genid)
      );
    `);

    await client.query(`
      INSERT INTO tblgen(genid, gen)
      VALUES
      (1, '第1世代'),
      (2, '第2世代'),
      (3, '第3世代'),
      (4, '第4世代'),
      (5, '第5世代'),
      (6, '第6世代'),
      (7, '第7世代'),
      (8, '第8世代'),
      (9, '第9世代'),
      (10, '第10世代')
      ON CONFLICT (genid) DO NOTHING;
    `);

    // --- tblPokedex ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS tblpokedex(
        pokeid INTEGER NOT NULL,
        name VARCHAR(20) NOT NULL,
        type1id INTEGER,
        type2id INTEGER,
        regionid INTEGER,
        genid INTEGER,
        PRIMARY KEY (pokeid),
        FOREIGN KEY (type1id) REFERENCES tbltype(typeid),
        FOREIGN KEY (type2id) REFERENCES tbltype(typeid),
        FOREIGN KEY (regionid) REFERENCES tblregion(regionid),
        FOREIGN KEY (genid) REFERENCES tblgen(genid)
      );
    `);

    console.log("すべてのテーブル作成 & 初期データ挿入が完了しました！");
  } catch (err) {
    console.error("SQL実行エラー:", err);
  } finally {
    await client.end();
    console.log("DB接続終了");
  }
}

runSQL();
