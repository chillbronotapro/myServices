import pool from '@/lib/db';

export async function PUT(request) {
  try {
    const { bookingId, date, status } = await request.json();

    if (!bookingId || (!date && !status)) {
      return Response.json(
        { error: 'Missing required fields' },
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

    // Build update query
    const updates = [];
    const params = [];

    if (date) {
      updates.push('date = ?');
      params.push(date);
    }

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    params.push(bookingId);

    const updateQuery = `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`;
    await connection.execute(updateQuery, params);

    // Fetch updated booking
    const [updatedBooking] = await connection.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [bookingId]
    );

    connection.release();

    return Response.json(updatedBooking[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    return Response.json(
      { error: 'Failed to update booking: ' + error.message },
      { status: 500 }
    );
  }
}
