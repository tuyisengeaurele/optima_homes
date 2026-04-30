import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'optimahomes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
})

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('✅ MySQL connected successfully')
    connection.release()
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message)
    process.exit(1)
  }
}

export default pool
