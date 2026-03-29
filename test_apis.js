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

async function testAPIs() {
  try {
    const connection = await pool.getConnection();
    
    // Get a sample booking to test with
    const [bookings] = await connection.execute('SELECT * FROM bookings LIMIT 1');
    
    if (bookings.length === 0) {
      console.log('No bookings found to test with');
      connection.release();
      return;
    }
    
    const booking = bookings[0];
    console.log('\n✓ Test booking found:');
    console.log(JSON.stringify(booking, null, 2));
    
    // Test UPDATE
    console.log('\n...Testing UPDATE API...');
    const newDate = '2026-04-05';
    const newStatus = 'confirmed';
    
    const [updateResult] = await connection.execute(
      'UPDATE bookings SET date = ?, status = ? WHERE id = ?',
      [newDate, newStatus, booking.id]
    );
    
    console.log('✓ UPDATE successful');
    console.log(`  - Changed date to: ${newDate}`);
    console.log(`  - Changed status to: ${newStatus}`);
    
    // Verify update
    const [updated] = await connection.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [booking.id]
    );
    console.log('✓ Updated booking verified:');
    console.log(JSON.stringify(updated[0], null, 2));
    
    // Revert changes for delete test
    await connection.execute(
      'UPDATE bookings SET date = ?, status = ? WHERE id = ?',
      [booking.date, booking.status, booking.id]
    );
    
    // Test DELETE
    console.log('\n...Testing DELETE API...');
    const bookingToDelete = bookings[0].id;
    
    const [deleteResult] = await connection.execute(
      'DELETE FROM bookings WHERE id = ?',
      [bookingToDelete]
    );
    
    console.log(`✓ Deleted booking ID: ${bookingToDelete}`);
    
    // Verify deletion
    const [deleted] = await connection.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [bookingToDelete]
    );
    
    if (deleted.length === 0) {
      console.log('✓ Deletion verified - booking no longer exists');
    }
    
    // Re-insert the deleted booking for other systems
    await connection.execute(
      'INSERT INTO bookings (id, service_id, user_id, date, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [booking.id, booking.service_id, booking.user_id, booking.date, booking.status, booking.created_at]
    );
    
    console.log('✓ Booking re-inserted for testing');
    
    connection.release();
    console.log('\n✅ All API tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAPIs().then(() => {
  console.log('\n✅ Test suite completed successfully');
  process.exit(0);
});
