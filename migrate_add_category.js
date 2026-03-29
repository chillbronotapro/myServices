import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const pool = mysql.createPool({
  host: env.DB_HOST || 'localhost',
  user: env.DB_USER || 'root',
  password: env.DB_PASSWORD,
  database: env.DB_NAME || 'myservices',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function addCategoryColumn() {
  try {
    const connection = await pool.getConnection();
    
    // Check if category column exists
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM services WHERE Field = 'category'"
    );
    
    if (columns.length === 0) {
      // Add category column if it doesn't exist
      console.log('Adding category column to services table...');
      await connection.execute(
        'ALTER TABLE services ADD COLUMN category VARCHAR(50)'
      );
      console.log('✓ Category column added successfully');
    } else {
      console.log('✓ Category column already exists');
    }
    
    connection.release();
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

addCategoryColumn().then(() => {
  console.log('Migration completed');
  process.exit(0);
});
