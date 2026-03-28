import { query } from '../config/db.js';

async function addDemoTable() {
  try {
    console.log('🏗️  Adding DemoRequests table...');
    
    await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DemoRequests' AND xtype='U')
      CREATE TABLE DemoRequests (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(100) NOT NULL,
          email NVARCHAR(255) NOT NULL,
          company NVARCHAR(100),
          role NVARCHAR(100),
          created_at DATETIME2 DEFAULT GETDATE()
      );
    `);

    console.log('✅ DemoRequests table added successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error adding DemoRequests table:', err.message);
    process.exit(1);
  }
}

addDemoTable();
