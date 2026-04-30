import pool, { testConnection } from '../config/db.js'
import { checkDbHealth, getDbStats } from '../config/dbHealth.js'

async function main() {
  console.log('\n=== OptimaHomes DB Connection Test ===\n')

  const connected = await testConnection()
  if (!connected) {
    console.error('Connection test failed. Ensure MySQL is running and .env is configured.')
    process.exit(1)
  }

  const health = await checkDbHealth()
  console.log('Health check:', health.healthy ? 'PASS' : `FAIL — ${health.error}`)

  const stats = await getDbStats()
  if (stats.length) {
    console.log('\nDatabase tables:')
    stats.forEach(t => {
      console.log(`  ${t.name.padEnd(25)} rows: ${String(t.rows || 0).padStart(6)}`)
    })
  } else {
    console.log('\nNo tables found. Run the schema setup first.')
  }

  await pool.end()
  console.log('\nAll checks complete.\n')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
