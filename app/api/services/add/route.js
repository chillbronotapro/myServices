import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { title, price, providerId, category } = await request.json();

    if (!title || !price || !providerId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    
    // Check if user exists in database
    const [userExists] = await connection.execute(
      'SELECT id FROM users WHERE id = ?',
      [providerId]
    );

    if (userExists.length === 0) {
      connection.release();
      return Response.json(
        { error: 'User not found. Please ensure you have signed up.' },
        { status: 404 }
      );
    }

    const result = await connection.execute(
      'INSERT INTO services (title, price, category, provider_id) VALUES (?, ?, ?, ?)',
      [title, parseFloat(price), category || null, providerId]
    );
    connection.release();

    return Response.json({
      id: result[0].insertId,
      title,
      price: parseFloat(price),
      category: category || null,
      providerId,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error adding service:', error);
    return Response.json(
      { error: 'Failed to add service: ' + error.message },
      { status: 500 }
    );
  }
}
