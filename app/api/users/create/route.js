import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { userId, email, role } = await request.json();

    if (!userId || !email || !role) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.execute(
        'INSERT INTO users (id, email, role) VALUES (?, ?, ?)',
        [userId, email, role]
      );
    } catch (dbError) {
      // Check if it's a duplicate entry error
      if (dbError.code === 'ER_DUP_ENTRY') {
        // User already exists, which is fine
        console.log('User already exists in database:', userId);
      } else {
        throw dbError;
      }
    }
    
    connection.release();

    return Response.json({
      id: userId,
      email,
      role,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json(
      { error: 'Failed to create user: ' + error.message },
      { status: 500 }
    );
  }
}
