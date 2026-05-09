const db = require("../config/db");

const findAll = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  // Get total count
  const [countResult] = await db.query("SELECT COUNT(*) as total FROM etudiants");
  const total = countResult[0].total;

  // Get paginated results
  const [rows] = await db.query(`
    SELECT e.*, c.libelle AS civilite, p.libelle AS pays
    FROM etudiants e
    LEFT JOIN civilites c ON c.id = e.civilites_id
    LEFT JOIN pays p ON p.id = e.pays_id
    ORDER BY e.nom, e.prenoms
    LIMIT ? OFFSET ?
  `, [limit, offset]);

  return {
    data: rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const findById = async (id) => {
  const [rows] = await db.query(`
    SELECT e.*, c.libelle AS civilite, p.libelle AS pays
    FROM etudiants e
    LEFT JOIN civilites c ON c.id = e.civilites_id
    LEFT JOIN pays p ON p.id = e.pays_id
    WHERE e.id = ?
  `, [id]);
  return rows[0] || null;
};

const create = async (etudiant) => {
  const sql = `
    INSERT INTO etudiants (nom, prenoms, pays_id, civilites_id, dateNaissance, email, telephone)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [
    etudiant.nom,
    etudiant.prenoms,
    etudiant.pays_id,
    etudiant.civilites_id,
    etudiant.dateNaissance || null,
    etudiant.email || null,
    etudiant.telephone || null,
  ]);
  return result.insertId;
};

const update = async (id, etudiant) => {
  const sql = `
    UPDATE etudiants
    SET nom = ?, prenoms = ?, pays_id = ?, civilites_id = ?, dateNaissance = ?, email = ?, telephone = ?
    WHERE id = ?
  `;
  const [result] = await db.query(sql, [
    etudiant.nom,
    etudiant.prenoms,
    etudiant.pays_id,
    etudiant.civilites_id,
    etudiant.dateNaissance || null,
    etudiant.email || null,
    etudiant.telephone || null,
    id,
  ]);
  return result.affectedRows > 0;
};

const remove = async (id) => {
  const [result] = await db.query("DELETE FROM etudiants WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

const getStats = async () => {
  const [rows] = await db.query(`
    SELECT
      COUNT(*) AS total,
      COUNT(DISTINCT pays_id) AS nb_pays,
      SUM(CASE WHEN civilites_id IN (2, 3) THEN 1 ELSE 0 END) AS filles,
      SUM(CASE WHEN civilites_id = 1 THEN 1 ELSE 0 END) AS garcons,
      (SELECT COUNT(*) FROM inscriptions) AS total_inscriptions,
      (SELECT COUNT(*) FROM inscriptions i JOIN decisions d ON d.id = i.decisions_id WHERE d.libelle = 'Inscrit') AS inscriptions_validees,
      (SELECT COUNT(*) FROM inscriptions i JOIN decisions d ON d.id = i.decisions_id WHERE d.libelle <> 'Inscrit') AS inscriptions_non_validees,
      (SELECT COUNT(*) FROM resultats r JOIN decisions d ON d.id = r.decisions_id WHERE d.libelle IN ('Admis', 'Admis sous condition', 'Diplômé')) AS reussites,
      (SELECT COUNT(*) FROM resultats r JOIN decisions d ON d.id = r.decisions_id WHERE d.libelle IN ('Redoublant', 'Refusé', 'Exclu')) AS echecs
    FROM etudiants
  `);
  return rows[0];
};

module.exports = { findAll, findById, create, update, remove, getStats };
