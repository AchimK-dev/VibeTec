import Artist from '../models/Artist.js';
import User from '../models/User.js';

export const getAllArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find({ isActive: true }).populate('author', 'username email').sort({ createdAt: -1 });

    res.status(200).json(artists);
  } catch (error) {
    next(error);
  }
};

export const getSingleArtist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id).populate('author', 'username email');

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

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

export const addBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      date,
      startTime,
      endTime,
      clientName,
      clientEmail,
      clientPhone,
      eventDetails,
      eventType,
      eventLocation,
      numberOfGuests,
      musicPreferences,
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

    if (req.userId && clientPhone) {
      await User.findByIdAndUpdate(req.userId, { phoneNumber: clientPhone });
    }

    await artist.addBooking({
      date,
      startTime,
      endTime,
      clientName,
      clientEmail,
      clientPhone,
      eventDetails,
      eventType,
      eventLocation,
      numberOfGuests,
      musicPreferences,
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

export const getDetailedAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;

    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const detailedAvailability = [];

    for (let d = new Date(today); d <= thirtyDaysFromNow; d.setDate(d.getDate() + 1)) {
      const dateString = d.toDateString();

      const dayBookings = artist.bookings.filter(booking => {
        if (!booking.isBooked || !booking.isConfirmed) {
          return false;
        }

        const bookingStartDate = new Date(booking.date);
        const bookingEndDate = booking.endDate ? new Date(booking.endDate) : bookingStartDate;
        const currentDate = new Date(d);

        bookingStartDate.setHours(0, 0, 0, 0);
        bookingEndDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        const [startHour] = booking.startTime.split(':').map(Number);
        const [endHour] = booking.endTime.split(':').map(Number);
        const spansToNextDay = endHour < startHour;

        if (!booking.isMultiDay) {
          if (spansToNextDay) {
            const nextDay = new Date(bookingStartDate);
            nextDay.setDate(nextDay.getDate() + 1);
            return currentDate.getTime() === bookingStartDate.getTime() || currentDate.getTime() === nextDay.getTime();
          }
          const match = bookingStartDate.getTime() === currentDate.getTime();
          return match;
        }

        const inRange =
          currentDate.getTime() >= bookingStartDate.getTime() && currentDate.getTime() <= bookingEndDate.getTime();
        return inRange;
      });

      const timeSlots = [];
      for (let hour = 0; hour <= 23; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        const isBooked = dayBookings.some(booking => {
          const [startHour, startMin] = booking.startTime.split(':').map(Number);
          const [endHour, endMin] = booking.endTime.split(':').map(Number);
          const bookingStart = startHour + startMin / 60;
          const bookingEnd = endHour + endMin / 60;
          const currentHour = hour;

          const spansToNextDay = endHour < startHour;

          if (booking.isMultiDay) {
            const bookingStartDate = new Date(booking.date);
            const bookingEndDate = new Date(booking.endDate);
            const currentDate = new Date(d);

            bookingStartDate.setHours(0, 0, 0, 0);
            bookingEndDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            if (currentDate.getTime() === bookingStartDate.getTime()) {
              return currentHour >= bookingStart;
            } else if (currentDate.getTime() === bookingEndDate.getTime()) {
              return currentHour < bookingEnd;
            } else if (
              currentDate.getTime() > bookingStartDate.getTime() &&
              currentDate.getTime() < bookingEndDate.getTime()
            ) {
              return true;
            }
          } else if (spansToNextDay) {
            const bookingDate = new Date(booking.date);
            const currentDate = new Date(d);
            bookingDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            const nextDay = new Date(bookingDate);
            nextDay.setDate(nextDay.getDate() + 1);

            if (currentDate.getTime() === bookingDate.getTime()) {
              return currentHour >= bookingStart;
            } else if (currentDate.getTime() === nextDay.getTime()) {
              return currentHour < bookingEnd;
            }
          } else {
            return currentHour >= bookingStart && currentHour < bookingEnd;
          }

          return false;
        });

        timeSlots.push({
          time: timeString,
          isBooked,
          bookingInfo: isBooked
            ? dayBookings.find(booking => {
                const [startHour, startMin] = booking.startTime.split(':').map(Number);
                const [endHour, endMin] = booking.endTime.split(':').map(Number);
                const bookingStart = startHour + startMin / 60;
                const bookingEnd = endHour + endMin / 60;
                const currentHour = hour;
                return currentHour >= bookingStart && currentHour < bookingEnd;
              })
            : null
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
