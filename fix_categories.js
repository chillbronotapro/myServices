import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env.local') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'myservices',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function fixCategories() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Updating services with categories...\n');
    
    // Update all NULL categories to 'tutoring' for now
    const result = await connection.execute(
      'UPDATE services SET category = ? WHERE category IS NULL',
      ['tutoring']
    );
    
    console.log(`✓ Updated ${result[0].changedRows} services with tutoring category`);
    
    // Verify the update
    const [services] = await connection.execute('SELECT id, title, price, category FROM services');
    
    console.log('\nAll services:');
    services.forEach(s => {
      console.log(`  [${s.id}] ${s.title} - $${s.price} - Category: ${s.category}`);
    });
    
  } finally {
    connection.release();
    await pool.end();
    process.exit(0);
  }
}

fixCategories().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
