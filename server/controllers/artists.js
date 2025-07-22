import Artist from '../models/Artist.js';

// Get all artists
export const getAllArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find({ isActive: true })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(artists);
  } catch (error) {
    next(error);
  }
};

// Get single artist
export const getSingleArtist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id)
      .populate('author', 'username email');
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

// Create new artist
export const createArtist = async (req, res, next) => {
  try {
    const { name, musicGenre, image, description, pricePerHour } = req.body;
    const userId = req.userId;
    
    const newArtist = new Artist({
      name,
      musicGenre,
      image,
      description,
      pricePerHour: parseFloat(pricePerHour),
      author: userId,
      bookings: []
    });
    
    await newArtist.save();
    await newArtist.populate('author', 'username email');
    
    res.status(201).json(newArtist);
  } catch (error) {
    next(error);
  }
};

// Update artist
export const updateArtist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, musicGenre, image, description, pricePerHour } = req.body;
    
    const artist = await Artist.findById(id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    const updatedArtist = await Artist.findByIdAndUpdate(
      id,
      {
        name,
        musicGenre,
        image,
        description,
        pricePerHour: parseFloat(pricePerHour)
      },
      { new: true, runValidators: true }
    ).populate('author', 'username email');
    
    res.status(200).json(updatedArtist);
  } catch (error) {
    next(error);
  }
};

// Delete artist
export const deleteArtist = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const artist = await Artist.findById(id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    await Artist.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Artist deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Check availability
export const checkAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.query;
    
    const artist = await Artist.findById(id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    const isAvailable = artist.isAvailable(date, startTime, endTime);
    
    res.status(200).json({
      isAvailable,
      artist: artist.name,
      date,
      startTime,
      endTime
    });
  } catch (error) {
    next(error);
  }
};

// Add booking
export const addBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      date, 
      startTime, 
      endTime, 
      clientName, 
      eventDetails, 
      notes, 
      totalPrice, 
      isConfirmed = false,
      isMultiDay = false,
      endDate
    } = req.body;
    
    const artist = await Artist.findById(id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    await artist.addBooking({
      date,
      startTime,
      endTime,
      clientName,
      eventDetails,
      notes,
      totalPrice,
      isConfirmed,
      isMultiDay,
      endDate,
      userId: req.userId // Add the user ID from the token
    });
    
    res.status(200).json({
      message: 'Booking added successfully',
      artist: artist.name,
      booking: {
        date,
        startTime,
        endTime,
        clientName
      }
    });
  } catch (error) {
    if (error.message.includes('not available')) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

// Get available dates
export const getAvailableDates = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const artist = await Artist.findById(id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    const availableDates = artist.getAvailableDates();
    
    res.status(200).json({
      artist: artist.name,
      availableDates
    });
  } catch (error) {
    next(error);
  }
};

// Get detailed availability with booked time slots
export const getDetailedAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const artist = await Artist.findById(id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const detailedAvailability = [];
    
    for (let d = new Date(today); d <= thirtyDaysFromNow; d.setDate(d.getDate() + 1)) {
      const dateString = d.toDateString();
      
      // Get confirmed bookings for this day (including multi-day bookings)
      const dayBookings = artist.bookings.filter(booking => {
        if (!booking.isBooked || !booking.isConfirmed) {
          return false;
        }
        
        const bookingStartDate = new Date(booking.date);
        const bookingEndDate = booking.endDate ? new Date(booking.endDate) : bookingStartDate;
        const currentDate = new Date(d);
        
        // Reset times to compare only dates
        bookingStartDate.setHours(0, 0, 0, 0);
        bookingEndDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        
        // For single day bookings
        if (!booking.isMultiDay) {
          const match = bookingStartDate.getTime() === currentDate.getTime();
          return match;
        }
        
        // For multi-day bookings, check if current date falls within the range
        const inRange = currentDate.getTime() >= bookingStartDate.getTime() && 
                       currentDate.getTime() <= bookingEndDate.getTime();
        return inRange;
      });
      
      // Create time slots for the day (24-hour format)
      const timeSlots = [];
      for (let hour = 0; hour <= 23; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        const isBooked = dayBookings.some(booking => {
          // Convert booking times to 24-hour format numbers for comparison
          const [startHour, startMin] = booking.startTime.split(':').map(Number);
          const [endHour, endMin] = booking.endTime.split(':').map(Number);
          const bookingStart = startHour + (startMin / 60);
          const bookingEnd = endHour + (endMin / 60);
          const currentHour = hour;
          
          // For multi-day bookings, adjust times based on which day we're checking
          if (booking.isMultiDay) {
            const bookingStartDate = new Date(booking.date);
            const bookingEndDate = new Date(booking.endDate);
            const currentDate = new Date(d);
            
            // Reset times for date comparison
            bookingStartDate.setHours(0, 0, 0, 0);
            bookingEndDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);
            
            // If it's the start date, check from start time to midnight (24:00)
            if (currentDate.getTime() === bookingStartDate.getTime()) {
              return currentHour >= bookingStart;
            }
            // If it's the end date, check from midnight (0:00) to end time
            else if (currentDate.getTime() === bookingEndDate.getTime()) {
              return currentHour < bookingEnd;
            }
            // If it's a day in between, the whole day is booked
            else if (currentDate.getTime() > bookingStartDate.getTime() && 
                     currentDate.getTime() < bookingEndDate.getTime()) {
              return true;
            }
          } else {
            // Single day booking - original logic
            return currentHour >= bookingStart && currentHour < bookingEnd;
          }
          
          return false;
        });
        
        timeSlots.push({
          time: timeString,
          isBooked,
          bookingInfo: isBooked ? dayBookings.find(booking => {
            const [startHour, startMin] = booking.startTime.split(':').map(Number);
            const [endHour, endMin] = booking.endTime.split(':').map(Number);
            const bookingStart = startHour + (startMin / 60);
            const bookingEnd = endHour + (endMin / 60);
            const currentHour = hour;
            return currentHour >= bookingStart && currentHour < bookingEnd;
          }) : null
        });
      }
      
      detailedAvailability.push({
        date: new Date(d),
        dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
        dateString: d.toLocaleDateString('en-US'),
        timeSlots,
        hasAvailableSlots: timeSlots.some(slot => !slot.isBooked),
        totalBookings: dayBookings.length
      });
    }
    
    res.status(200).json({
      artist: artist.name,
      detailedAvailability
    });
  } catch (error) {
    next(error);
  }
};
