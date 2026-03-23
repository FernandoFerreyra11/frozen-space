import msnodesqlv8 from 'msnodesqlv8';
import dotenv from 'dotenv';

dotenv.config();

const server = process.env.DB_SERVER || 'localhost';
const port = process.env.DB_PORT || '1433';
const database = process.env.DB_NAME || 'FrozenSpaceDB';
const connStr = `Driver={ODBC Driver 17 for SQL Server};Server=${server},${port};Database=${database};Trusted_Connection=yes;`;

let connection = null;

function getConnection() {
  return new Promise((resolve, reject) => {
    if (connection) {
      resolve(connection);
      return;
    }
    msnodesqlv8.open(connStr, (err, conn) => {
      if (err) {
        reject(err);
      } else {
        connection = conn;
        resolve(conn);
      }
    });
  });
}

export function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    getConnection()
      .then(conn => {
        conn.query(sql, params, (err, results) => {
          if (err) reject(err);
          else resolve(results || []);
        });
      })
      .catch(err => reject(err));
  });
}

export async function testConnection() {
  try {
    await getConnection();
    console.log('✅ Connected to SQL Server (FrozenSpaceDB)');
    return true;
  } catch (err) {
    console.error('❌ SQL Server connection error:', err.message || err);
    return false;
  }
}
