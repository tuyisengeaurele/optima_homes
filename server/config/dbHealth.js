import pool from './db.js'

export async function checkDbHealth() {
  try {
    const [rows] = await pool.execute('SELECT 1 AS ok')
    return { healthy: rows[0].ok === 1, latency: null }
  } catch (err) {
    return { healthy: false, error: err.message }
  }
}

export async function getDbStats() {
  const [tables] = await pool.execute(`
    SELECT TABLE_NAME as name, TABLE_ROWS as rows, DATA_LENGTH as size
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
    ORDER BY TABLE_NAME
  `)
  return tables
}
