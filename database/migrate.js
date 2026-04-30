import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: '../server/.env' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'optimahomes',
  multipleStatements: true,
}

async function runMigrations() {
  let conn
  try {
    conn = await mysql.createConnection(config)
    console.log('Connected to MySQL')

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const [applied] = await conn.execute('SELECT filename FROM _migrations')
    const appliedSet = new Set(applied.map(r => r.filename))

    const migrationsDir = path.join(__dirname, 'migrations')
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort()

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`  Skipping ${file} (already applied)`)
        continue
      }
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      await conn.execute(sql)
      await conn.execute('INSERT INTO _migrations (filename) VALUES (?)', [file])
      console.log(`  Applied ${file}`)
    }

    console.log('Migrations complete')
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  } finally {
    if (conn) await conn.end()
  }
}

runMigrations()
