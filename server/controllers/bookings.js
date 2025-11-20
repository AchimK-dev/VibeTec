import Artist from '../models/Artist.js';
import User from '../models/User.js';
import { generateBookingNumber } from '../utils/demoDataGenerator.js';

const anonymizeClientData = (name, email, phone) => {
  const anonymizeName = name => {
    if (!name) return name;
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0) + '*'.repeat(part.length - 1)).join(' ');
  };

  const anonymizeEmail = email => {
    if (!email) return email;
    const [local, domain] = email.split('@');
    const [domainName, tld] = domain.split('.');
    return (
      local.charAt(0) +
      '*'.repeat(Math.max(local.length - 1, 3)) +
      '@' +
      domainName.charAt(0) +
      '*'.repeat(Math.max(domainName.length - 1, 3)) +
      '.' +
      tld
    );
  };

  const anonymizePhone = phone => {
    if (!phone) return phone;
    return '*'.repeat(phone.length - 4) + phone.slice(-4);
  };

  return {
    clientName: anonymizeName(name),
    clientEmail: anonymizeEmail(email),
    clientPhone: anonymizePhone(phone)
  };
};

export const getAllBookings = async (req, res, next) => {
  try {
    const artists = await Artist.find({}, 'name bookings').populate('author', 'firstName lastName');

    const allBookings = [];
    const isDemo = req.user.role === 'DEMO';

    artists.forEach(artist => {
      artist.bookings.forEach(booking => {
        let clientData = {
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          clientPhone: booking.clientPhone
        };

        if (isDemo) {
          clientData = anonymizeClientData(booking.clientName, booking.clientEmail, booking.clientPhone);
        }

        allBookings.push({
          _id: booking._id,
          bookingNumber: booking.bookingNumber,
          artistId: artist._id,
          artistName: artist.name,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          endDate: booking.endDate,
          isMultiDay: booking.isMultiDay,
          totalPrice: booking.totalPrice,
          notes: booking.notes,
          ...clientData,
          eventDetails: booking.eventDetails,
          eventType: booking.eventType || '',
          eventLocation: booking.eventLocation || '',
          numberOfGuests: booking.numberOfGuests || '',
          musicPreferences: booking.musicPreferences || '',
          isConfirmed: booking.isConfirmed,
          isRejected: booking.isRejected || false,
          isCancelled: booking.isCancelled || false,
          isBooked: booking.isBooked,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        });
      });
    });

    allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(allBookings);
  } catch (error) {
    next(error);
  }
};

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

    if (booking.isCancelled) {
      return res.status(403).json({ message: 'Cannot confirm cancelled bookings' });
    }

    booking.isConfirmed = true;
    booking.isRejected = false;
    booking.isCancelled = false;
    await artist.save();

    res.status(200).json({ message: 'Booking confirmed successfully', booking });
  } catch (error) {
    next(error);
  }
};

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

    if (booking.isRejected) {
      return res.status(400).json({ message: 'Booking is already rejected' });
    }
    if (booking.isCancelled) {
      return res.status(403).json({ message: 'Cannot reject cancelled bookings' });
    }

    booking.isRejected = true;
    booking.isConfirmed = false;
    booking.isCancelled = false;
    await artist.save();

    res.status(200).json({ message: 'Booking rejected successfully' });
  } catch (error) {
    next(error);
  }
};

export const getPendingBookings = async (req, res, next) => {
  try {
    const artists = await Artist.find({}, 'name bookings').populate('author', 'firstName lastName');

    const pendingBookings = [];
    const isDemo = req.user.role === 'DEMO';

    artists.forEach(artist => {
      const pending = artist.bookings.filter(
        booking => !booking.isConfirmed && !booking.isRejected && !booking.isCancelled
      );
      pending.forEach(booking => {
        let clientData = {
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          clientPhone: booking.clientPhone
        };

        if (isDemo) {
          clientData = anonymizeClientData(booking.clientName, booking.clientEmail, booking.clientPhone);
        }

        pendingBookings.push({
          _id: booking._id,
          artistId: artist._id,
          artistName: artist.name,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          ...clientData,
          eventDetails: booking.eventDetails,
          isConfirmed: booking.isConfirmed,
          createdAt: booking.createdAt
        });
      });
    });

    pendingBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(pendingBookings);
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.userId;

    const artists = await Artist.find({}, 'name bookings').populate('author', 'firstName lastName');

    const userBookings = [];

    artists.forEach(artist => {
      const userArtistBookings = artist.bookings.filter(
        booking => booking.userId && booking.userId.toString() === userId
      );

      userArtistBookings.forEach(booking => {
        userBookings.push({
          _id: booking._id,
          bookingNumber: booking.bookingNumber,
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
          eventType: booking.eventType || '',
          eventLocation: booking.eventLocation || '',
          numberOfGuests: booking.numberOfGuests || '',
          musicPreferences: booking.musicPreferences || '',
          isConfirmed: booking.isConfirmed,
          isRejected: booking.isRejected || false,
          isCancelled: booking.isCancelled || false,
          isBooked: booking.isBooked,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        });
      });
    });

    userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(userBookings);
  } catch (error) {
    next(error);
  }
};

export const updateUserBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;
    const updateData = req.body;

    const artists = await Artist.find({});
    let targetArtist = null;
    let targetBooking = null;

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

    if (targetBooking.isConfirmed) {
      return res.status(403).json({ message: 'Cannot update confirmed bookings' });
    }
    if (targetBooking.isRejected) {
      return res.status(403).json({ message: 'Cannot update rejected bookings' });
    }
    if (targetBooking.isCancelled) {
      return res.status(403).json({ message: 'Cannot update cancelled bookings' });
    }

    if (updateData.eventDetails !== undefined) targetBooking.eventDetails = updateData.eventDetails;
    if (updateData.eventType !== undefined) targetBooking.eventType = updateData.eventType;
    if (updateData.eventLocation !== undefined) targetBooking.eventLocation = updateData.eventLocation;
    if (updateData.numberOfGuests !== undefined) targetBooking.numberOfGuests = updateData.numberOfGuests;
    if (updateData.musicPreferences !== undefined) targetBooking.musicPreferences = updateData.musicPreferences;
    if (updateData.notes !== undefined) targetBooking.notes = updateData.notes;
    if (updateData.date !== undefined) targetBooking.date = updateData.date;
    if (updateData.startTime !== undefined) targetBooking.startTime = updateData.startTime;
    if (updateData.endTime !== undefined) targetBooking.endTime = updateData.endTime;
    if (updateData.endDate !== undefined) targetBooking.endDate = updateData.endDate;
    if (updateData.isMultiDay !== undefined) targetBooking.isMultiDay = updateData.isMultiDay;
    if (updateData.clientName !== undefined) targetBooking.clientName = updateData.clientName;
    if (updateData.clientEmail !== undefined) targetBooking.clientEmail = updateData.clientEmail;
    if (updateData.clientPhone !== undefined) {
      targetBooking.clientPhone = updateData.clientPhone;
      await User.findByIdAndUpdate(userId, { phoneNumber: updateData.clientPhone });
    }

    if (updateData.date || updateData.startTime || updateData.endTime || updateData.endDate) {
      const dateStr =
        targetBooking.date instanceof Date
          ? targetBooking.date.toISOString().split('T')[0]
          : targetBooking.date.split('T')[0];

      const endDateStr =
        targetBooking.isMultiDay && targetBooking.endDate
          ? targetBooking.endDate instanceof Date
            ? targetBooking.endDate.toISOString().split('T')[0]
            : targetBooking.endDate.split('T')[0]
          : dateStr;

      const startDateTime = new Date(`${dateStr}T${targetBooking.startTime}`);
      const endDateTime = new Date(`${endDateStr}T${targetBooking.endTime}`);

      const durationInHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
      targetBooking.totalPrice = Math.round(durationInHours * targetArtist.pricePerHour);
    }

    await targetArtist.save();

    res.status(200).json({ message: 'Booking updated successfully', booking: targetBooking });
  } catch (error) {
    next(error);
  }
};

export const deleteUserBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;

    const artists = await Artist.find({});
    let targetArtist = null;
    let targetBooking = null;

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

    if (targetBooking.isRejected) {
      return res.status(403).json({ message: 'Cannot cancel rejected bookings' });
    }
    if (targetBooking.isCancelled) {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    targetBooking.isCancelled = true;
    targetBooking.isConfirmed = false;
    targetBooking.isRejected = false;
    await targetArtist.save();

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteBookingByAdmin = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const artists = await Artist.find({});
    let targetArtist = null;
    let targetBooking = null;

    for (const artist of artists) {
      const booking = artist.bookings.id(bookingId);
      if (booking) {
        targetArtist = artist;
        targetBooking = booking;
        break;
      }
    }

    if (!targetArtist || !targetBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!targetBooking.isCancelled && !targetBooking.isRejected) {
      return res.status(403).json({ message: 'Only cancelled or rejected bookings can be deleted' });
    }

    targetArtist.bookings.pull(bookingId);
    await targetArtist.save();

    res.status(200).json({ message: 'Booking permanently deleted' });
  } catch (error) {
    next(error);
  }
};

const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 'Unknown';

  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);

  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);

  return Math.round(diffHours);
};
