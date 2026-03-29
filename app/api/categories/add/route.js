import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { name, emoji, description } = await request.json();

    if (!name) {
      return Response.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    
    // Check if category already exists
    const [existing] = await connection.execute(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );

    if (existing.length > 0) {
      connection.release();
      return Response.json(
        { error: 'Category already exists' },
        { status: 409 }
      );
    }

    const result = await connection.execute(
      'INSERT INTO categories (name, emoji, description) VALUES (?, ?, ?)',
      [name, emoji || null, description || null]
    );
    connection.release();

    return Response.json({
      id: result[0].insertId,
      name,
      emoji: emoji || null,
      description: description || null,
      createdAt: new Date()
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding category:', error);
    return Response.json(
      { error: 'Failed to add category: ' + error.message },
      { status: 500 }
    );
  }
}
