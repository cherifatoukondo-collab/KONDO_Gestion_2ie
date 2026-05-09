const db = require("../config/db");

const findAll = async () => {
  const [rows] = await db.query(`
    SELECT id, nom, email, created_at
    FROM utilisateurs
    ORDER BY nom
  `);
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.query("SELECT * FROM utilisateurs WHERE id = ?", [id]);
  return rows[0] || null;
};

const findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);
  return rows[0] || null;
};

const create = async (utilisateur) => {
  const [result] = await db.query(
    "INSERT INTO utilisateurs (nom, email, password) VALUES (?, ?, ?)",
    [utilisateur.nom, utilisateur.email, utilisateur.password]
  );
  return result.insertId;
};

module.exports = { findAll, findById, findByEmail, create };
