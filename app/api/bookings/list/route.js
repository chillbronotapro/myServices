import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const connection = await pool.getConnection();
    
    let query = 'SELECT * FROM bookings';
    let params = [];

    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await connection.execute(query, params);
    connection.release();

    return Response.json(rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return Response.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
