import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { getSingleArtist, addBooking } from '@/data';
import { useAuth } from '@/context';

const BookingConfirmation = () => {
  const { id } = useParams(); // Artist ID
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    eventDetails: '',
    notes: ''
  });
  
  // Get booking data from navigation state
  const bookingData = location.state?.bookingData;
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    // Redirect if no booking data or not logged in
    if (!bookingData || !user) {
      toast.error('Invalid booking data');
      navigate('/artists');
      return;
    }
    
    // Fetch artist data
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
  }, [id, navigate, bookingData, user]);

  const calculateTotalPrice = () => {
    if (!artist || !bookingData?.selectedSlots) return 0;
    
    // Handle both old format (array) and new format (object with dates)
    if (Array.isArray(bookingData.selectedSlots)) {
      return bookingData.selectedSlots.length * artist.pricePerHour;
    } else {
      // New multi-day format: count all time slots across all dates
      const totalSlots = Object.values(bookingData.selectedSlots).flat().length;
      return totalSlots * artist.pricePerHour;
    }
  };

  const formatTimeRange = () => {
    if (!bookingData?.selectedSlots) return '';
    
    // Handle both old format (array) and new format (object with dates)
    if (Array.isArray(bookingData.selectedSlots)) {
      if (!bookingData.selectedSlots.length) return '';
      const slots = bookingData.selectedSlots.sort();
      const startTime = slots[0];
      const endHour = parseInt(slots[slots.length - 1].split(':')[0]) + 1;
      const endTime = `${endHour.toString().padStart(2, '0')}:00`;
      return `${startTime} - ${endTime}`;
    } else {
      // New multi-day format: show date ranges
      const dates = Object.keys(bookingData.selectedSlots).sort();
      if (dates.length === 0) return '';
      
      if (dates.length === 1) {
        // Single day
        const slots = bookingData.selectedSlots[dates[0]].sort();
        const startTime = slots[0];
        const endHour = parseInt(slots[slots.length - 1].split(':')[0]) + 1;
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
        const dateStr = new Date(dates[0] + 'T12:00:00').toLocaleDateString('en-US', { 
          weekday: 'short', month: 'short', day: 'numeric' 
        });
        return `${dateStr}, ${startTime} - ${endTime}`;
      } else {
        // Multi-day (overnight)
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        const firstSlots = bookingData.selectedSlots[firstDate].sort();
        const lastSlots = bookingData.selectedSlots[lastDate].sort();
        
        const startTime = firstSlots[0];
        const endHour = parseInt(lastSlots[lastSlots.length - 1].split(':')[0]) + 1;
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
        
        const startDateStr = new Date(firstDate + 'T12:00:00').toLocaleDateString('en-US', { 
          weekday: 'short', month: 'short', day: 'numeric' 
        });
        const endDateStr = new Date(lastDate + 'T12:00:00').toLocaleDateString('en-US', { 
          weekday: 'short', month: 'short', day: 'numeric' 
        });
        
        return `${startDateStr} ${startTime} - ${endDateStr} ${endTime}`;
      }
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingForm.eventDetails.trim()) {
      toast.error('Please provide event details');
      return;
    }

    try {
      // Handle both old format (array) and new format (object with dates)
      if (Array.isArray(bookingData.selectedSlots)) {
        // Old single-day format
        const slots = bookingData.selectedSlots.sort();
        const startTime = slots[0];
        const endHour = parseInt(slots[slots.length - 1].split(':')[0]) + 1;
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;

        await addBooking(id, {
          date: bookingData.date,
          startTime,
          endTime,
          clientName: `${user.firstName} ${user.lastName}`,
          eventDetails: bookingForm.eventDetails,
          notes: bookingForm.notes,
          totalPrice: calculateTotalPrice(),
          isConfirmed: false
        });
      } else {
        // New multi-day format - create one booking spanning multiple days
        const dates = Object.keys(bookingData.selectedSlots).sort();
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        
        // Get start time from first date
        const firstDateSlots = bookingData.selectedSlots[firstDate].sort();
        const startTime = firstDateSlots[0];
        
        // Get end time from last date
        const lastDateSlots = bookingData.selectedSlots[lastDate].sort();
        const endHour = parseInt(lastDateSlots[lastDateSlots.length - 1].split(':')[0]) + 1;
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
        
        // Determine if this is truly multi-day 
        // Either multiple different dates OR overnight booking (end time < start time)
        const startHour = parseInt(startTime.split(':')[0]);
        const endHourNum = parseInt(endTime.split(':')[0]);
        const isOvernightBooking = endHourNum <= startHour && dates.length === 1; // End time is earlier than start time on same calendar date
        const isActuallyMultiDay = dates.length > 1 || isOvernightBooking;
        
        // Calculate the actual end date for overnight bookings
        let actualEndDate;
        if (isOvernightBooking && dates.length === 1) {
          // For overnight bookings on a single calendar date, the actual end is the next day
          const nextDay = new Date(firstDate);
          nextDay.setDate(nextDay.getDate() + 1);
          actualEndDate = nextDay.toISOString().split('T')[0];
        } else {
          actualEndDate = isActuallyMultiDay ? lastDate : null;
        }
        
        // Create one booking with the full time range
        await addBooking(id, {
          date: new Date(firstDate).toISOString().split('T')[0],
          startTime,
          endTime, // Keep endTime as simple time format
          clientName: `${user.firstName} ${user.lastName}`,
          eventDetails: bookingForm.eventDetails + (isActuallyMultiDay ? ' (Multi-day booking)' : ''),
          notes: bookingForm.notes,
          totalPrice: calculateTotalPrice(),
          isConfirmed: false,
          isMultiDay: isActuallyMultiDay,
          endDate: actualEndDate
        });
      }

      toast.success('Booking successfully created! Waiting for admin confirmation.');
      navigate(`/artist/${id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!artist || !bookingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>Booking data not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-no-padding">
    <div className="min-h-screen bg-[#0C0F1A] flex items-center rounded-xl justify-center">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-xl">
          <h1 className="card-title text-2xl mb-6">Confirm Booking</h1>
          
          {/* Artist Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-[#0C0F1A] border-1 border-[#BDFF00] rounded-lg">
            <img 
              src={artist.image} 
              alt={artist.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{artist.name}</h2>
              <p className="text-base-content/70">{artist.musicGenre}</p>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Booking Details</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">
                    {bookingData?.selectedSlots && !Array.isArray(bookingData.selectedSlots) ? (
                      // New multi-day format: show date range
                      (() => {
                        const dates = Object.keys(bookingData.selectedSlots).sort();
                        if (dates.length === 1) {
                          // Add 'T12:00:00' to avoid timezone issues
                          return new Date(dates[0] + 'T12:00:00').toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        } else {
                          const startDate = new Date(dates[0] + 'T12:00:00').toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          });
                          const endDate = new Date(dates[dates.length - 1] + 'T12:00:00').toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          });
                          return `${startDate} - ${endDate}`;
                        }
                      })()
                    ) : (
                      // Old single day format
                      new Date(bookingData.date + 'T12:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{formatTimeRange()}</span>
                </div>
                
                <div className="flex  justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {(() => {
                      let totalSlots = 0;
                      if (Array.isArray(bookingData.selectedSlots)) {
                        totalSlots = bookingData.selectedSlots.length;
                      } else if (bookingData.selectedSlots) {
                        totalSlots = Object.values(bookingData.selectedSlots).flat().length;
                      } else {
                        totalSlots = bookingData.timeCount || 0;
                      }
                      return `${totalSlots} Hour${totalSlots !== 1 ? 's' : ''}`;
                    })()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Price per hour:</span>
                  <span className="font-medium">{artist.pricePerHour}€</span>
                </div>
                
                <div className="divider h-0.5 bg-[#BDFF00]"></div>
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total price:</span>
                  <span>{calculateTotalPrice()}€</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event-Informationen</h3>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text text-white font-bold">Event Details *</span>
                  </label>
                  <textarea
                    className="textarea bg-[#0C0F1A] border-1 border-[#BDFF00] textarea-bordered w-full"
                    placeholder="Describe your event (type, location, number of guests, etc.)"
                    value={bookingForm.eventDetails}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      eventDetails: e.target.value
                    }))}
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className="label">
                    <span className="label-text text-white">Additional Notes</span>
                  </label>
                  <textarea
                    className="textarea bg-[#0C0F1A] border-1 border-[#BDFF00] textarea-bordered w-full"
                    placeholder="Special requests or requirements"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn flex-1 bg-[#0C0F1A] border-1 border-[#BDFF00] text-white font-bold hover:scale-105 transition-all duration-200 rounded-3xl py-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn flex-1 text-black font-bold hover:scale-105 transition-all duration-200 rounded-3xl"
                    style={{backgroundColor: '#BDFF00', border: 'none'}}
                  >
                    Complete Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default BookingConfirmation;
