const db = require("../config/db");

const createResourceModel = (table, fields) => {
  const selectColumns = fields.join(", ");
  const placeholders = fields.map(() => "?").join(", ");
  const updateSet = fields.map((field) => `${field} = ?`).join(", ");

  return {
    findAll: async () => {
      const [rows] = await db.query(`SELECT id, ${selectColumns} FROM ${table} ORDER BY id DESC`);
      return rows;
    },

    findById: async (id) => {
      const [rows] = await db.query(`SELECT id, ${selectColumns} FROM ${table} WHERE id = ?`, [id]);
      return rows[0] || null;
    },

    create: async (resource) => {
      const values = fields.map((field) => resource[field] ?? null);
      const [result] = await db.query(
        `INSERT INTO ${table} (${selectColumns}) VALUES (${placeholders})`,
        values,
      );
      return result.insertId;
    },

    update: async (id, resource) => {
      const values = fields.map((field) => resource[field] ?? null);
      const [result] = await db.query(
        `UPDATE ${table} SET ${updateSet} WHERE id = ?`,
        [...values, id],
      );
      return result.affectedRows > 0;
    },

    remove: async (id) => {
      const [result] = await db.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
      return result.affectedRows > 0;
    },
  };
};

module.exports = createResourceModel;
