import pool from '@/lib/db';

export async function GET(request) {
  try {
    const connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM categories ORDER BY created_at DESC'
    );
    connection.release();

    return Response.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
