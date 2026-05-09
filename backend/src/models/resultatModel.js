const db = require("../config/db");

const findAll = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const [countResult] = await db.query("SELECT COUNT(*) as total FROM resultats");
  const total = countResult[0].total;

  const [rows] = await db.query(`
    SELECT
      r.id AS id,
      e.nom,
      e.prenoms,
      e.email,
      p.libelle AS parcours,
      d.libelle AS decision,
      r.moyenne,
      r.mention,
      DATE_FORMAT(r.datePublication, '%Y-%m-%d') AS datePublication
    FROM resultats r
    JOIN etudiants e ON e.id = r.etudiants_id
    LEFT JOIN inscriptions i ON i.id = r.inscriptions_id
    LEFT JOIN parcours p ON p.id = i.parcours_id
    LEFT JOIN decisions d ON d.id = r.decisions_id
    ORDER BY r.datePublication DESC
    LIMIT ? OFFSET ?
  `, [limit, offset]);

  return {
    data: rows,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { findAll };
