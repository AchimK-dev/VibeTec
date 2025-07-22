import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllBookings, confirmBooking, rejectBooking } from '@/data';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'confirmed'

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (artistId, bookingId) => {
    try {
      await confirmBooking(artistId, bookingId);
      toast.success('Booking confirmed successfully!');
      loadBookings(); // Reload bookings
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (artistId, bookingId) => {
    if (window.confirm('Are you sure you want to reject this booking? This action cannot be undone.')) {
      try {
        await rejectBooking(artistId, bookingId);
        toast.success('Booking rejected successfully!');
        loadBookings(); // Reload bookings
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'pending') return !booking.isConfirmed;
    if (filter === 'confirmed') return booking.isConfirmed;
    return true; // 'all'
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeRange = (booking) => {
    // Now endTime is always in simple HH:MM format for both single and multi-day bookings
    return `${booking.startTime} - ${booking.endTime}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-600">
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-200 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Manage all artist bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="tabs tabs-boxed mb-6 bg-gray-800">
        <button 
          className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Bookings ({bookings.length})
        </button>
        <button 
          className={`tab ${filter === 'pending' ? 'tab-active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({bookings.filter(b => !b.isConfirmed).length})
        </button>
        <button 
          className={`tab ${filter === 'confirmed' ? 'tab-active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({bookings.filter(b => b.isConfirmed).length})
        </button>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-200 mb-2">No bookings found</h2>
          <p className="text-gray-200">
            {filter === 'pending' 
              ? 'No pending bookings at the moment' 
              : filter === 'confirmed' 
              ? 'No confirmed bookings yet' 
              : 'No bookings have been made yet'
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra bg-gray-500 w-full">
            <thead>
              <tr className='text-white'>
                <th>Status</th>
                <th>Artist</th>
                <th>Date & Time</th>
                <th>Price</th>
                <th>Client</th>
                <th>Event Details</th>
                <th>Booking Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <div className={`badge ${booking.isConfirmed ? 'badge-success' : 'badge-warning'}`}>
                      {booking.isConfirmed ? 'Confirmed' : 'Pending'}
                    </div>
                  </td>
                  <td>
                    <div className="font-bold">{booking.artistName}</div>
                  </td>
                  <td>
                    <div className="font-medium">
                      {booking.isMultiDay ? (
                        <>
                          {formatDate(booking.date)} - {formatDate(booking.endDate)}
                        </>
                      ) : (
                        formatDate(booking.date)
                      )}
                    </div>
                    <div className="text-sm text-gray-200">
                      {formatTimeRange(booking)}
                    </div>
                  </td>
                  <td>
                    {booking.totalPrice ? (
                      <div className="text-lg font-bold text-green-400">
                        {booking.totalPrice}€
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">
                        -
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="font-medium">{booking.clientName}</div>
                    {booking.clientEmail && (
                      <div className="text-sm text-gray-200">{booking.clientEmail}</div>
                    )}
                    {booking.clientPhone && (
                      <div className="text-sm text-gray-200">{booking.clientPhone}</div>
                    )}
                  </td>
                  <td>
                    <div className="max-w-xs truncate">
                      {booking.eventDetails || 'No details provided'}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-200">
                      {formatDateTime(booking.createdAt)}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {!booking.isConfirmed ? (
                        <>
                          <button
                            onClick={() => handleConfirm(booking.artistId, booking._id)}
                            className="btn btn-success btn-sm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleReject(booking.artistId, booking._id)}
                            className="btn btn-error btn-sm"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleReject(booking.artistId, booking._id)}
                          className="btn btn-error btn-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
