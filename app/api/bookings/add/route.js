import pool from '@/lib/db';
import { createBookingSchema } from '@/app/types';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = createBookingSchema.safeParse(body);
    if (!validationResult.success) {
      return Response.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { serviceId, userId, date } = validationResult.data;

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO bookings (service_id, user_id, date, status) VALUES (?, ?, ?, ?)',
        [serviceId, userId, date, 'pending']
      );

      return Response.json({
        id: result.insertId,
        serviceId,
        userId,
        date,
        status: 'pending',
        createdAt: new Date()
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error adding booking:', error);
    return Response.json(
      { error: 'Failed to add booking' },
      { status: 500 }
    );
  }
}
