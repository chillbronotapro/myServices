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

const defaultCategories = [
  { name: 'tutoring', emoji: '📚', description: 'Educational services and tutoring' },
  { name: 'roommate', emoji: '🏠', description: 'Find roommate and accommodation services' },
  { name: 'plumbing', emoji: '🔧', description: 'Plumbing and water-related services' },
  { name: 'electrical', emoji: '⚡', description: 'Electrical services and repairs' },
  { name: 'carpentry', emoji: '🔨', description: 'Carpentry and woodwork services' },
  { name: 'daily-labor', emoji: '👷', description: 'Daily labor and general work' },
  { name: 'masonry', emoji: '🧱', description: 'Masonry and construction work' },
  { name: 'pandit', emoji: '🙏', description: 'Pandit services and religious ceremonies' },
];

async function migrateCategories() {
  try {
    const connection = await pool.getConnection();
    
    // Check if categories table exists
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories'",
      [env.DB_NAME || 'myservices']
    );
    
    if (tables.length === 0) {
      console.log('Creating categories table...');
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          emoji VARCHAR(10),
          description VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✓ Categories table created');
    }
    
    // Check if categories are already populated
    const [existingCategories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    
    if (existingCategories[0].count === 0) {
      console.log('Populating default categories...');
      
      for (const category of defaultCategories) {
        await connection.execute(
          'INSERT INTO categories (name, emoji, description) VALUES (?, ?, ?)',
          [category.name, category.emoji, category.description]
        );
      }
      
      console.log(`✓ ${defaultCategories.length} default categories added`);
    } else {
      console.log(`✓ Categories table already has ${existingCategories[0].count} entries`);
    }
    
    connection.release();
    
  } catch (error) {
    console.error('Error during migration:', error.message);
    process.exit(1);
  }
}

migrateCategories().then(() => {
  console.log('\n✅ Category migration completed successfully');
  process.exit(0);
});
