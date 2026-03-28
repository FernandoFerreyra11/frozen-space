import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedAdmin() {
  const name = 'Fernando Ferreyra';
  const email = 'fernando.ferreyra@frozenspace.com';
  const password = 'admin1234';
  const role = 'admin';

  try {
    console.log(`Checking if admin ${email} exists...`);
    const existing = await query(`SELECT id FROM Users WHERE email = ?`, [email]);

    if (existing && existing.length > 0) {
      console.log('Admin user already exists. Updating role to admin...');
      await query(`UPDATE Users SET role = 'admin' WHERE email = ?`, [email]);
      console.log('✅ Admin role updated.');
    } else {
      console.log('Creating new admin user...');
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      await query(
        `INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
        [name, email, password_hash, role]
      );
      console.log('✅ Admin user created successfully.');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();
