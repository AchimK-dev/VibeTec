import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserBookings, updateBooking, deleteBooking } from '@/data';
import { useAuth } from '@/context';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, CONFIRMED, REJECTED

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getUserBookings();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await deleteBooking(bookingId);
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleEditBooking = async (bookingId, newData) => {
    try {
      await updateBooking(bookingId, newData);
      await loadBookings(); // Reload to get updated data
      toast.success('Booking updated successfully');
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'ALL') return true;
    return booking.status === filter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { class: 'bg-yellow-500', text: 'Pending' },
      CONFIRMED: { class: 'bg-green-500', text: 'Confirmed' },
      REJECTED: { class: 'bg-red-500', text: 'Rejected' }
    };
    const config = statusConfig[status] || { class: 'bg-gray-500', text: status };
    return (
      <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#BDFF00]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-no-padding">
      <div className="w-full min-h-screen">
        
        {/* Main Bookings Kachel (volle Breite) */}
        <div className="bg-[#0C0F1A] rounded-xl shadow-lg p-12 min-h-screen">
          <div className="w-full max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">My Bookings</h1>
              <p className="text-xl text-white">Manage your artist bookings and event requests</p>
            </div>

            {/* Filter and Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              
              {/* Filter Controls */}
              <div className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-xl p-6 ">
                <h3 className="text-lg font-bold text-white mb-4">Filter Bookings</h3>
                <select 
                  className="select w-full bg-[#0C0F1A] border-1 border-[#BDFF00] text-white rounded-lg"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="ALL">All Bookings</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Quick Stats */}
              <div className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-white mb-4">Booking Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white">Total:</span>
                    <span className="font-bold">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Confirmed:</span>
                    <span className="font-bold text-green-600">
                      {bookings.filter(b => b.status === 'CONFIRMED').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Pending:</span>
                    <span className="font-bold text-yellow-600">
                      {bookings.filter(b => b.status === 'PENDING').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    className="btn w-full text-black font-bold hover:scale-105 transition-all duration-200 rounded-3xl"
                    style={{backgroundColor: '#BDFF00', border: 'none'}}
                    onClick={() => window.location.href = '/artists'}
                  >
                    Book New Artist
                  </button>
                  <button 
                    className="btn w-full bg-[#0C0F1A] border-1 border-[#BDFF00] text-white font-bold hover:scale-105 transition-all duration-200 rounded-3xl py-3"
                    onClick={loadBookings}
                  >
                    Refresh Bookings
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-xl p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-white border-b-2 border-[#BDFF00] pb-3">
                {filter === 'ALL' ? 'All Bookings' : `${filter.charAt(0) + filter.slice(1).toLowerCase()} Bookings`} 
                ({filteredBookings.length})
              </h2>
              
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Bookings Found</h3>
                  <p className="text-white mb-6">
                    {filter === 'ALL' 
                      ? "You haven't made any bookings yet." 
                      : `No ${filter.toLowerCase()} bookings found.`
                    }
                  </p>
                  <button 
                    className="btn text-black font-bold hover:scale-105 transition-all duration-200 rounded-3xl px-6"
                    style={{backgroundColor: '#BDFF00', border: 'none'}}
                    onClick={() => window.location.href = '/artists'}
                  >
                    Browse Artists
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredBookings.map((booking) => (
                    <div key={booking._id} className="bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-lg p-6 shadow-md">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                        
                        {/* Booking Info */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="text-xl font-bold text-white">
                              {booking.artistId?.stageName || 'Unknown Artist'}
                            </h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="space-y-2 text-white">
                            <p><span className="font-medium">Event:</span> {booking.eventName}</p>
                            <p><span className="font-medium">Date:</span> {new Date(booking.eventDate).toLocaleDateString()}</p>
                            <p><span className="font-medium">Location:</span> {booking.eventLocation}</p>
                            <p><span className="font-medium">Duration:</span> {booking.eventDuration} hours</p>
                            {booking.budget && (
                              <p><span className="font-medium">Budget:</span> €{booking.budget}</p>
                            )}
                          </div>
                        </div>

                        {/* Event Details */}
                        <div>
                          <h4 className="font-bold text-white mb-2">Event Details</h4>
                          <div className="text-sm text-white space-y-1">
                            <p><span className="font-medium">Type:</span> {booking.eventType}</p>
                            <p><span className="font-medium">Guests:</span> {booking.expectedGuests}</p>
                            {booking.specialRequests && (
                              <p><span className="font-medium">Special Requests:</span> {booking.specialRequests}</p>
                            )}
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-white">
                              Booked: {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          {booking.status === 'PENDING' && (
                            <>
                              <button 
                                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600 rounded-lg"
                                onClick={() => {
                                  toast.info('Edit functionality coming soon!');
                                }}
                              >
                                Edit Booking
                              </button>
                              <button 
                                className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 rounded-lg"
                                onClick={() => handleCancelBooking(booking._id)}
                              >
                                Cancel Booking
                              </button>
                            </>
                          )}
                          {booking.status === 'CONFIRMED' && (
                            <button 
                              className="btn btn-sm text-black font-bold border-2 border-black hover:scale-105 transition-all duration-200 rounded-lg"
                              style={{backgroundColor: '#BDFF00'}}
                              onClick={() => {
                                toast.info('Contact artist functionality coming soon!');
                              }}
                            >
                              Contact Artist
                            </button>
                          )}
                          {booking.status === 'REJECTED' && (
                            <button 
                              className="btn btn-sm bg-gray-500 hover:bg-gray-600 text-white border-gray-500 hover:border-gray-600 rounded-lg"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MyBookings;
