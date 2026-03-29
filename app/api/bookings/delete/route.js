import pool from '@/lib/db';

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return Response.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    // Check if booking exists
    const [bookings] = await connection.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [bookingId]
    );

    if (bookings.length === 0) {
      connection.release();
      return Response.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Delete booking
    await connection.execute(
      'DELETE FROM bookings WHERE id = ?',
      [bookingId]
    );

    connection.release();

    return Response.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return Response.json(
      { error: 'Failed to delete booking: ' + error.message },
      { status: 500 }
    );
  }
}
