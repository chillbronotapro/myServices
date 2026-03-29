import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dbaadmin',
  database: 'myservices'
});

console.log('Updating services with categories...');

// First, check current state
const [before] = await connection.execute('SELECT id, title, category FROM services');
console.log('\nBefore update:');
before.forEach(s => console.log(`  [${s.id}] ${s.title}: ${s.category}`));

// Update categories
const [result] = await connection.execute(
  'UPDATE services SET category = ? WHERE category IS NULL',
  ['tutoring']
);

console.log(`\n✓ Updated ${result.changedRows} rows`);

// Verify update
const [after] = await connection.execute('SELECT id, title, category FROM services');
console.log('\nAfter update:');
after.forEach(s => console.log(`  [${s.id}] ${s.title}: ${s.category}`));

await connection.end();
