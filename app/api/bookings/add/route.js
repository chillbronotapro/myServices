import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { serviceId, userId, date } = await request.json();

    if (!serviceId || !userId || !date) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    const result = await connection.execute(
      'INSERT INTO bookings (service_id, user_id, date, status) VALUES (?, ?, ?, ?)',
      [serviceId, userId, date, 'pending']
    );
    connection.release();

    return Response.json({
      id: result[0].insertId,
      serviceId,
      userId,
      date,
      status: 'pending',
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error adding booking:', error);
    return Response.json(
      { error: 'Failed to add booking' },
      { status: 500 }
    );
  }
}
