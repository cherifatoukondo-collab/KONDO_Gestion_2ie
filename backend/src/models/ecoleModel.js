const db = require("../config/db");

const findAll = async () => {
  const [rows] = await db.query(
    `SELECT id, libelle, adresse, telephone, email
     FROM ecoles
     ORDER BY libelle`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.query("SELECT * FROM ecoles WHERE id = ?", [id]);
  return rows[0] || null;
};

const findStudentsById = async (id) => {
  const [rows] = await db.query(`
    SELECT
      e.id AS etudiantId,
      e.nom,
      e.prenoms,
      e.email,
      e.telephone,
      p.libelle AS parcours,
      s.libelle AS specialite,
      f.libelle AS filiere,
      COALESCE(rd.libelle, di.libelle) AS decision,
      r.moyenne,
      r.mention,
      DATE_FORMAT(r.datePublication, '%Y-%m-%d') AS datePublication
    FROM inscriptions i
    JOIN etudiants e ON e.id = i.etudiants_id
    LEFT JOIN parcours p ON p.id = i.parcours_id
    LEFT JOIN specialites s ON s.id = p.specialites_id
    LEFT JOIN filieres f ON f.id = s.filieres_id
    LEFT JOIN resultats r ON r.inscriptions_id = i.id
    LEFT JOIN decisions rd ON rd.id = r.decisions_id
    LEFT JOIN decisions di ON di.id = i.decisions_id
    WHERE EXISTS (
      SELECT 1 FROM ecolesfilieres ef
      WHERE ef.ecoles_id = ? AND ef.filieres_id = f.id
    )
    ORDER BY e.nom, e.prenoms
  `, [id]);
  return rows;
};

const create = async (ecole) => {
  const [result] = await db.query(
    "INSERT INTO ecoles (libelle, adresse, telephone, email) VALUES (?, ?, ?, ?)",
    [ecole.libelle, ecole.adresse || null, ecole.telephone || null, ecole.email || null],
  );
  return result.insertId;
};

const update = async (id, ecole) => {
  const [result] = await db.query(
    "UPDATE ecoles SET libelle = ?, adresse = ?, telephone = ?, email = ? WHERE id = ?",
    [ecole.libelle, ecole.adresse || null, ecole.telephone || null, ecole.email || null, id],
  );
  return result.affectedRows > 0;
};

const remove = async (id) => {
  const [result] = await db.query("DELETE FROM ecoles WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { findAll, findById, findStudentsById, create, update, remove };
