import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const category = searchParams.get('category');

    const connection = await pool.getConnection();
    
    let query = 'SELECT * FROM services';
    let params = [];
    let conditions = [];

    if (providerId) {
      conditions.push('provider_id = ?');
      params.push(providerId);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await connection.execute(query, params);
    connection.release();

    return Response.json(rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    return Response.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
