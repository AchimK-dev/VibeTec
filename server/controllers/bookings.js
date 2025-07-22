import Artist from '../models/Artist.js';
import User from '../models/User.js';

// Get all bookings (Admin only)
export const getAllBookings = async (req, res, next) => {
  try {
    const artists = await Artist.find({}, 'name bookings').populate('author', 'firstName lastName');
    
    const allBookings = [];
    
    artists.forEach(artist => {
      artist.bookings.forEach(booking => {
        allBookings.push({
          _id: booking._id,
          artistId: artist._id,
          artistName: artist.name,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          endDate: booking.endDate,
          isMultiDay: booking.isMultiDay,
          totalPrice: booking.totalPrice,
          notes: booking.notes,
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          clientPhone: booking.clientPhone,
          eventDetails: booking.eventDetails,
          isConfirmed: booking.isConfirmed,
          isBooked: booking.isBooked,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        });
      });
    });
    
    // Sort by creation date (newest first)
    allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json(allBookings);
  } catch (error) {
    next(error);
  }
};

// Confirm a booking (Admin only)
export const confirmBooking = async (req, res, next) => {
  try {
    const { artistId, bookingId } = req.params;
    
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    const booking = artist.bookings.id(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    booking.isConfirmed = true;
    await artist.save();
    
    res.status(200).json({ message: 'Booking confirmed successfully', booking });
  } catch (error) {
    next(error);
  }
};

// Reject/Cancel a booking (Admin only)
export const rejectBooking = async (req, res, next) => {
  try {
    const { artistId, bookingId } = req.params;
    
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    const booking = artist.bookings.id(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Remove the booking from the array
    artist.bookings.pull(bookingId);
    await artist.save();
    
    res.status(200).json({ message: 'Booking rejected and removed successfully' });
  } catch (error) {
    next(error);
  }
};

// Get pending bookings (Admin only)
export const getPendingBookings = async (req, res, next) => {
  try {
    const artists = await Artist.find({}, 'name bookings').populate('author', 'firstName lastName');
    
    const pendingBookings = [];
    
    artists.forEach(artist => {
      const pending = artist.bookings.filter(booking => !booking.isConfirmed);
      pending.forEach(booking => {
        pendingBookings.push({
          _id: booking._id,
          artistId: artist._id,
          artistName: artist.name,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          clientPhone: booking.clientPhone,
          eventDetails: booking.eventDetails,
          isConfirmed: booking.isConfirmed,
          createdAt: booking.createdAt
        });
      });
    });
    
    // Sort by creation date (newest first)
    pendingBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json(pendingBookings);
  } catch (error) {
    next(error);
  }
};

// Get user's own bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    const artists = await Artist.find({}, 'name bookings').populate('author', 'firstName lastName');
    
    const userBookings = [];
    
    artists.forEach(artist => {
      const userArtistBookings = artist.bookings.filter(booking => 
        booking.userId && booking.userId.toString() === userId
      );
      
      userArtistBookings.forEach(booking => {
        userBookings.push({
          _id: booking._id,
          artistId: {
            _id: artist._id,
            stageName: artist.name
          },
          eventName: booking.eventDetails || 'Event',
          eventDate: booking.date,
          eventLocation: booking.notes || 'Location not specified',
          eventDuration: calculateDuration(booking.startTime, booking.endTime),
          budget: booking.totalPrice,
          eventType: 'General Event',
          expectedGuests: 'Not specified',
          specialRequests: booking.notes,
          status: booking.isConfirmed ? 'CONFIRMED' : 'PENDING',
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        });
      });
    });
    
    // Sort by creation date (newest first)
    userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json(userBookings);
  } catch (error) {
    next(error);
  }
};

// Update user's own booking
export const updateUserBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;
    const updateData = req.body;
    
    const artists = await Artist.find({});
    let targetArtist = null;
    let targetBooking = null;
    
    // Find the artist and booking
    for (const artist of artists) {
      const booking = artist.bookings.id(bookingId);
      if (booking && booking.userId && booking.userId.toString() === userId) {
        targetArtist = artist;
        targetBooking = booking;
        break;
      }
    }
    
    if (!targetArtist || !targetBooking) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }
    
    // Only allow updates if booking is not confirmed yet
    if (targetBooking.isConfirmed) {
      return res.status(403).json({ message: 'Cannot update confirmed bookings' });
    }
    
    // Update allowed fields
    if (updateData.eventDetails) targetBooking.eventDetails = updateData.eventDetails;
    if (updateData.notes) targetBooking.notes = updateData.notes;
    if (updateData.date) targetBooking.date = updateData.date;
    if (updateData.startTime) targetBooking.startTime = updateData.startTime;
    if (updateData.endTime) targetBooking.endTime = updateData.endTime;
    
    await targetArtist.save();
    
    res.status(200).json({ message: 'Booking updated successfully', booking: targetBooking });
  } catch (error) {
    next(error);
  }
};

// Delete user's own booking
export const deleteUserBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;
    
    const artists = await Artist.find({});
    let targetArtist = null;
    
    // Find the artist with the booking
    for (const artist of artists) {
      const booking = artist.bookings.id(bookingId);
      if (booking && booking.userId && booking.userId.toString() === userId) {
        targetArtist = artist;
        break;
      }
    }
    
    if (!targetArtist) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }
    
    // Remove the booking
    targetArtist.bookings.pull(bookingId);
    await targetArtist.save();
    
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate duration
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 'Unknown';
  
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  
  if (end < start) {
    // Handle next day case
    end.setDate(end.getDate() + 1);
  }
  
  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return Math.round(diffHours);
};
