import { sqlite } from "https://esm.town/v/stevekrouse/sqlite";

// toggle the commented out table name to switch between the demo and production tables
// const tableName = "memories";
const tableName = "memories_demo";

/**
 * If you want runtime “type hints”, here’s the shape:
 * Memory = {
 *   id: string,
 *   date: string|null,
 *   text: string,
 *   createdBy: string|null,
 *   createdDate: number|null,
 *   tags: string|null,
 * }
 */

/** @returns {Promise<Array<Object>>} */
export async function getAllMemories() {
  const result = await sqlite.execute(
    `SELECT id, date, text, createdBy, createdDate, tags
     FROM ${tableName}
     ORDER BY createdDate DESC`
  );

  // Normalize/guard nulls and types (sqlite rows can be loosely typed)
  return (result.rows || []).map((row) => ({
    id: row.id != null ? String(row.id) : "",
    date: row.date == null ? null : String(row.date),
    text: row.text != null ? String(row.text) : "",
    createdBy: row.createdBy == null ? null : String(row.createdBy),
    createdDate: row.createdDate == null ? null : Number(row.createdDate),
    tags: row.tags == null ? null : String(row.tags),
  }));
}

/**
 * @param {Object} memory - Memory without id
 * @returns {Promise<Object>} created memory with id
 */
export async function createMemory(memory) {
  const { nanoid } = await import("https://esm.sh/nanoid@5.0.5");
  const newId = nanoid(10);
  const createdDate = memory.createdDate ?? Date.now();

  await sqlite.execute(
    `INSERT INTO ${tableName} (id, date, text, createdBy, createdDate, tags)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      newId,
      memory.date ?? null,
      memory.text ?? "",
      memory.createdBy || "dashboard",
      createdDate,
      memory.tags ?? null,
    ]
  );

  return {
    ...memory,
    id: newId,
    createdDate,
  };
}

/**
 * @param {string} id
 * @param {Object} memory - partial fields (excluding id)
 * @returns {Promise<void>}
 */
export async function updateMemory(id, memory) {
  // Only update provided keys (ignore undefined), and never allow id updates
  const entries = Object.entries(memory || {})
    .filter(([k]) => k !== "id")
    .filter(([, v]) => v !== undefined);

  if (entries.length === 0) {
    throw new Error("No fields provided for update");
  }

  const fields = entries.map(([k]) => k);
  const values = entries.map(([, v]) => v);

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  await sqlite.execute(
    `UPDATE ${tableName} SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
}

/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteMemory(id) {
  await sqlite.execute(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
}
