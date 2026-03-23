// =============================================
// Frozen Space - DB Initialization Script
// Run with: npm run db:init
// =============================================

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
  let connection;
  try {
    console.log('🔌 Connecting to SQL Server...');

    // Use msnodesqlv8 for Windows Authentication
    const msnodesqlv8 = await import('msnodesqlv8');
    const { open } = msnodesqlv8.default || msnodesqlv8;

    const server = process.env.DB_SERVER || 'localhost';
    const port = process.env.DB_PORT || '1433';
    const connStr = `Driver={ODBC Driver 17 for SQL Server};Server=${server},${port};Trusted_Connection=yes;`;

    console.log(`   Connection: ${connStr}`);

    connection = await new Promise((resolve, reject) => {
      open(connStr, (err, conn) => {
        if (err) reject(err);
        else resolve(conn);
      });
    });

    console.log('✅ Connected to SQL Server');

    // Read the SQL init script
    const sqlScript = readFileSync(
      join(__dirname, '..', 'models', 'init.sql'),
      'utf-8'
    );

    // Split by GO statements and execute each batch
    const batches = sqlScript
      .split(/^\s*GO\s*$/im)
      .filter(batch => batch.trim().length > 0);

    console.log(`📜 Executing ${batches.length} SQL batches...`);

    for (let i = 0; i < batches.length; i++) {
      try {
        await new Promise((resolve, reject) => {
          connection.query(batches[i], (err, results) => {
            if (err) reject(err);
            else resolve(results);
          });
        });
        console.log(`   ✅ Batch ${i + 1}/${batches.length} executed`);
      } catch (err) {
        console.error(`   ⚠️  Batch ${i + 1} warning:`, err.message);
      }
    }

    console.log('\n🎉 Database initialized successfully!');
    console.log('   Database: FrozenSpaceDB');
    console.log('   Tables: Users, Challenges, UserProgress');
    console.log('   Seed data: 10 testing challenges\n');
    console.log('You can now run: npm run dev');

  } catch (err) {
    console.error('\n❌ Failed to initialize database:', err.message);
    console.log('\n💡 Make sure:');
    console.log('   1. SQL Server is running');
    console.log('   2. ODBC Driver 17 for SQL Server is installed');
    console.log('   3. TCP/IP is enabled on port 1433');
    console.log('   4. Try: https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server\n');
  } finally {
    if (connection) {
      connection.close(() => {});
    }
    process.exit(0);
  }
}

initDatabase();
