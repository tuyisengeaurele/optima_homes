import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function setup() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  })

  console.log('Creating database if not exists...')
  await conn.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'optimahomes'}\``)
  await conn.execute(`USE \`${process.env.DB_NAME || 'optimahomes'}\``)

  const schemaPath = path.join(__dirname, '../../database/schema.sql')
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8')
    await conn.execute(schema)
    console.log('Schema applied from schema.sql')
  }

  const seedPath = path.join(__dirname, '../../database/seed.sql')
  if (fs.existsSync(seedPath)) {
    const seed = fs.readFileSync(seedPath, 'utf8')
    await conn.execute(seed)
    console.log('Seed data applied')
  }

  await conn.end()
  console.log('Database setup complete.')
}

setup().catch(err => {
  console.error('Setup failed:', err.message)
  process.exit(1)
})
