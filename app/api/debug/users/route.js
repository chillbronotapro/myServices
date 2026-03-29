import pool from '@/lib/db';

export async function GET() {
  try {
    console.log('Debug: Attempting to fetch users...');
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM users');
    connection.release();

    console.log('Debug: Users fetched:', rows);
    
    return Response.json({
      success: true,
      users: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Debug: Error fetching users:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
