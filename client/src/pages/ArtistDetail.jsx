import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { getSingleArtist, deleteArtist } from '@/data';
import { useAuth } from '@/context';
import DetailedCalendar from '@/components/UI/DetailedCalendar';

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    (async () => {
      try {
        const artistData = await getSingleArtist(id);
        setArtist(artistData);
      } catch (error) {
        toast.error(error.message);
        navigate('/artists');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  // Calculate availability status (same logic as ArtistCard)
  const getAvailabilityStatus = () => {
    if (!artist || !artist.bookings) return { text: 'Available', color: 'badge-success' };
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const weeklyBookings = artist.bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= startOfWeek && bookingDate <= endOfWeek && booking.isBooked;
    });
    
    const bookedDaysThisWeek = new Set(
      weeklyBookings.map(booking => new Date(booking.date).toDateString())
    ).size;
    
    const todayBookings = artist.bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate.toDateString() === today.toDateString() && booking.isBooked;
    });
    
    const isFullyBookedWeek = bookedDaysThisWeek >= 6;
    const isBusyWeek = bookedDaysThisWeek >= 4;
    
    if (isFullyBookedWeek) {
      return { text: 'Fully Booked', color: 'badge-error' };
    } else if (isBusyWeek) {
      return { text: 'Busy Week', color: 'badge-warning' };
    } else {
      return { text: 'Available', color: 'badge-success' };
    }
  };

  const handleBookingContinue = (bookingData) => {
    if (!user) {
      toast.info('Please log in to book an artist');
      navigate('/login');
      return;
    }

    // Navigate to booking confirmation page with booking data
    navigate(`/booking-confirmation/${id}`, {
      state: { bookingData }
    });
  };

  const handleDeleteArtist = async () => {
    if (window.confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
      try {
        await deleteArtist(id);
        toast.success('Artist deleted successfully!');
        navigate('/artists');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Artist not found</h2>
          <button onClick={() => navigate('/artists')} className="btn btn-primary">
            Back to Artists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-no-padding">
    <div className="min-h-screen rounded-xl bg-[#0C0F1A]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
      
      {/* Artist Info Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Left side: Artist Image */}
        <div className="lg:w-1/3">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
        
        {/* Right side: Artist Details and Back Button */}
        <div className="lg:w-2/3 flex flex-col">
          {/* Artist Details - grows to take available space */}
          <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-200 mb-2">{artist.name}</h1>
              <p className="text-xl text-gray-300 mb-4">{artist.musicGenre}</p>
            </div>
            
            {/* Admin Actions */}
            {user?.role === 'ADMIN' && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit-artist/${id}`)}
                  className="btn btn-outline btn-sm"
                >
                  Edit Artist
                </button>
                <button
                  onClick={handleDeleteArtist}
                  className="btn btn-error btn-sm"
                >
                  Delete Artist
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg text-gray-200 font-semibold mb-2">Description</h3>
              <p className="text-gray-300 mb-4">{artist.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Booking Info</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Price per Hour:</span>
                  <span className="font-semibold">{artist.pricePerHour}€</span>
                </p>
                <p className="flex justify-between">
                  <span>Status:</span>
                  <span className={`badge ${getAvailabilityStatus().color}`}>
                    {getAvailabilityStatus().text}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Total Bookings:</span>
                  <span className="font-semibold">{artist.bookings?.length || 0}</span>
                </p>
              </div>
            </div>
          </div>
          </div>
          
          {/* Back Button aligned to bottom right */}
          <div className="flex justify-end">
            <button 
              onClick={() => navigate('/artists')} 
              className="btn btn-outline btn-sm text-white hover:bg-white hover:text-gray-600"
            >
              ← Back to Artists
            </button>
          </div>
        </div>
      </div>

      {/* Availability Calendar */}
      <DetailedCalendar 
        artistId={id}
        onDateTimeSelect={handleBookingContinue}
      />
      </div>
    </div>
    </div>
  );
};

export default ArtistDetail;
