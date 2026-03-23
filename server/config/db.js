import msnodesqlv8 from 'msnodesqlv8';
import dotenv from 'dotenv';

dotenv.config();

const server = process.env.DB_SERVER || 'localhost';
const port = process.env.DB_PORT || '1433';
const database = process.env.DB_NAME || 'FrozenSpaceDB';
const connStr = `Driver={ODBC Driver 17 for SQL Server};Server=${server},${port};Database=${database};Trusted_Connection=yes;`;

let connectionPool = null;

function openConnection() {
  return new Promise((resolve, reject) => {
    msnodesqlv8.open(connStr, (err, conn) => {
      if (err) reject(err);
      else resolve(conn);
    });
  });
}

export function query(sql, params = []) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!connectionPool) {
        connectionPool = await openConnection();
        console.log('✅ Connected to SQL Server (FrozenSpaceDB)');
      }
      connectionPool.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    } catch (err) {
      reject(err);
    }
  });
}

export async function preparedQuery(sqlText, params = {}) {
  if (!connectionPool) {
    connectionPool = await openConnection();
    console.log('✅ Connected to SQL Server (FrozenSpaceDB)');
  }
  
  // Replace @param with ? and build ordered params array
  const paramNames = Object.keys(params);
  let processedSql = sqlText;
  const orderedParams = [];
  
  // Find all @paramName in the SQL and replace with ?
  for (const name of paramNames) {
    const regex = new RegExp(`@${name}\\b`, 'g');
    const matches = processedSql.match(regex);
    if (matches) {
      for (const _ of matches) {
        orderedParams.push(params[name]);
      }
      processedSql = processedSql.replace(regex, '?');
    }
  }

  return new Promise((resolve, reject) => {
    connectionPool.query(processedSql, orderedParams, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

export async function testConnection() {
  try {
    connectionPool = await openConnection();
    console.log('✅ Connected to SQL Server (FrozenSpaceDB)');
    return true;
  } catch (err) {
    console.error('❌ SQL Server connection error:', err.message || err);
    return false;
  }
}
