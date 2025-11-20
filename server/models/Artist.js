import { Schema, model } from 'mongoose';

const bookingSchema = new Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    endDate: {
      type: Date,
      required: false // For multi-day bookings
    },
    isMultiDay: {
      type: Boolean,
      default: false
    },
    totalPrice: {
      type: Number,
      required: false
    },
    notes: {
      type: String,
      default: ''
    },
    isBooked: {
      type: Boolean,
      default: true
    },
    isConfirmed: {
      type: Boolean,
      default: false
    },
    isRejected: {
      type: Boolean,
      default: false
    },
    isCancelled: {
      type: Boolean,
      default: false
    },
    clientName: {
      type: String,
      required: true
    },
    clientEmail: {
      type: String,
      required: false
    },
    clientPhone: {
      type: String,
      required: false
    },
    eventDetails: {
      type: String,
      default: ''
    },
    eventType: {
      type: String,
      default: ''
    },
    eventLocation: {
      type: String,
      default: ''
    },
    numberOfGuests: {
      type: String,
      default: ''
    },
    musicPreferences: {
      type: String,
      default: ''
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false // Make it optional for existing bookings
    }
  },
  { timestamps: true }
);

const artistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    musicGenre: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 0
    },
    bookings: [bookingSchema],
    isActive: {
      type: Boolean,
      default: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

artistSchema.methods.isAvailable = function (date, startTime, endTime) {
  const targetDate = new Date(date).toDateString();

  const conflictingBookings = this.bookings.filter(booking => {
    const bookingDate = new Date(booking.date).toDateString();

    if (bookingDate !== targetDate || !booking.isBooked || !booking.isConfirmed) {
      return false;
    }

    const bookingStart = parseInt(booking.startTime.replace(':', ''));
    const bookingEnd = parseInt(booking.endTime.replace(':', ''));
    const targetStart = parseInt(startTime.replace(':', ''));
    const targetEnd = parseInt(endTime.replace(':', ''));

    return targetStart < bookingEnd && targetEnd > bookingStart;
  });

  return conflictingBookings.length === 0;
};

artistSchema.methods.addBooking = async function (bookingData) {
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
    endDate,
    userId
  } = bookingData;

  if (!this.isAvailable(date, startTime, endTime)) {
    throw new Error('Artist is not available at the requested time');
  }

  const { generateBookingNumber } = await import('../utils/demoDataGenerator.js');
  const bookingNumber = await generateBookingNumber();

  this.bookings.push({
    bookingNumber,
    date: new Date(date),
    startTime,
    endTime,
    clientName,
    clientEmail: clientEmail || '',
    clientPhone: clientPhone || '',
    eventDetails: eventDetails || '',
    eventType: eventType || '',
    eventLocation: eventLocation || '',
    numberOfGuests: numberOfGuests || '',
    musicPreferences: musicPreferences || '',
    notes: notes || '',
    totalPrice: totalPrice || 0,
    isBooked: true,
    isConfirmed,
    isMultiDay,
    endDate: endDate ? new Date(endDate) : null,
    userId: userId || null // Add userId field
  });

  return this.save();
};

artistSchema.methods.getAvailableDates = function () {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const availableDates = [];

  for (let d = new Date(today); d <= thirtyDaysFromNow; d.setDate(d.getDate() + 1)) {
    const dateString = d.toDateString();
    const dayBookings = this.bookings.filter(
      booking => new Date(booking.date).toDateString() === dateString && booking.isBooked && booking.isConfirmed
    );

    if (dayBookings.length < 8) {
      availableDates.push({
        date: new Date(d),
        availableHours: 8 - dayBookings.length
      });
    }
  }

  return availableDates;
};

const Artist = model('Artist', artistSchema);

export default Artist;
