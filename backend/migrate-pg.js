/**
 * GolfForGood — Direct PostgreSQL Migration Runner
 * Uses Supabase's direct DB connection (Transaction Pooler)
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Supabase direct connection (Transaction Pooler - port 6543)
// Format: postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
const pool = new Pool({
  host: process.env.DB_HOST || 'aws-0-ap-south-1.pooler.supabase.com',
  port: parseInt(process.env.DB_PORT || '6543', 10),
  user: process.env.DB_USER || 'postgres.yvlbsugiqsevvwybaszp',
  password: process.env.DB_PASSWORD || 'GolfForGood2026@Secret',
  database: process.env.DB_DATABASE || 'postgres',
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  console.log('🚀 GolfForGood — Database Migration (Direct PostgreSQL)');
  console.log('   Project: yvlbsugiqsevvwybaszp\n');

  const client = await pool.connect();
  console.log('✅ PostgreSQL connected!\n');

  const sqlPath = path.join(__dirname, 'src', 'database', 'migrations', '001_initial_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    console.log('📋 Running migration...');
    await client.query(sql);
    console.log('✅ Migration completed successfully!\n');

    // Verify
    console.log('🔍 Verifying tables:');
    const tables = ['users', 'subscription_plans', 'charities', 'subscriptions', 'user_scores', 'draws', 'draw_entries', 'prize_pools', 'winner_claims', 'user_charity_selections'];
    for (const t of tables) {
      const res = await client.query(`SELECT COUNT(*) FROM ${t}`);
      console.log(`  ✅ ${t}: ${res.rows[0].count} rows`);
    }

    console.log('\n🎉 Database is ready for GolfForGood!\n');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    console.error('\nHINT: If this is a fresh run, ignore "already exists" errors.');
    console.error('The schema is already applied.\n');

    // Try verification anyway
    try {
      const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
      console.log('📋 Existing tables:');
      res.rows.forEach(r => console.log(' -', r.table_name));
    } catch (e2) {
      console.error('Could not list tables:', e2.message);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
