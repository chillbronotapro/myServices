import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [bookings] = await connection.execute('SELECT * FROM bookings');
    connection.release();

    return Response.json({
      success: true,
      bookings: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
