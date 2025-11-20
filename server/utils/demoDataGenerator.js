import Artist from '../models/Artist.js';
import User from '../models/User.js';

/**
 * Demo Data Generator
 * Automatically generates realistic demo data for a lively platform
 */

/**
 * Generates a unique booking number in format: VT-YYYYMMDD-XXXXX
 */
const generateBookingNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const artists = await Artist.find({});
  let maxNumber = 0;

  artists.forEach(artist => {
    artist.bookings.forEach(booking => {
      if (booking.bookingNumber && booking.bookingNumber.startsWith(`VT-${dateStr}`)) {
        const num = parseInt(booking.bookingNumber.split('-')[2]);
        if (num > maxNumber) maxNumber = num;
      }
    });
  });

  if (!generateBookingNumber.counter) {
    generateBookingNumber.counter = maxNumber;
  }

  generateBookingNumber.counter++;
  const nextNumber = String(generateBookingNumber.counter).padStart(5, '0');
  return `VT-${dateStr}-${nextNumber}`;
};

generateBookingNumber.counter = 0;

export { generateBookingNumber };

// Sample data pools
const firstNames = [
  'Max',
  'Anna',
  'Tom',
  'Lisa',
  'Ben',
  'Sarah',
  'Lucas',
  'Emma',
  'Felix',
  'Mia',
  'Leon',
  'Sophie',
  'Paul',
  'Laura',
  'Noah'
];
const lastNames = [
  'Müller',
  'Schmidt',
  'Schneider',
  'Fischer',
  'Weber',
  'Meyer',
  'Wagner',
  'Becker',
  'Schulz',
  'Hoffmann',
  'Koch',
  'Richter'
];
const eventTypes = [
  'Corporate Event',
  'Wedding',
  'Birthday Party',
  'Club Night',
  'Festival',
  'Private Party',
  'Bar Mitzvah',
  'Anniversary',
  'Graduation Party',
  "New Year's Eve"
];
const eventDetails = [
  'Looking forward to an amazing night!',
  'Need high-energy performance for our guests',
  'Professional event, sophisticated atmosphere required',
  'Young crowd, latest hits preferred',
  'Mix of classics and modern tracks',
  'Outdoor venue, weather permitting',
  'Indoor hall with excellent sound system',
  'Intimate setting, 50-100 guests',
  'Large event, 200+ attendees expected',
  'Special theme: 80s/90s music'
];

/**
 * Generates a random name
 */
const generateRandomName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { firstName, lastName };
};

/**
 * Generates a realistic email address
 */
const generateEmail = (firstName, lastName) => {
  const domains = ['gmail.com', 'yahoo.de', 'outlook.com', 'web.de', 'gmx.de'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
};

/**
 * Generates a German phone number
 */
const generatePhone = () => {
  const prefixes = ['0151', '0152', '0160', '0170', '0171', '0175', '030', '089', '040'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `${prefix}${number}`;
};

/**
 * Generates a random future date (1-7 days)
 */
const generateFutureDate = (minDays = 1, maxDays = 7) => {
  const today = new Date();
  const daysToAdd = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  const futureDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return futureDate.toISOString().split('T')[0];
};

/**
 * Generates a random time between 18:00 and 23:00
 */
const generateEventTime = () => {
  const hours = Math.floor(Math.random() * 6) + 18; // 18-23
  const minutes = Math.random() > 0.5 ? '00' : '30';
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

/**
 * Calculates end time based on start time (3-8 hours later)
 */
const calculateEndTime = startTime => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const duration = Math.floor(Math.random() * 6) + 3; // 3-8 Stunden
  let endHours = hours + duration;

  // Wrap around to next day if needed
  if (endHours >= 24) {
    endHours = endHours - 24;
  }

  return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Creates a new demo booking for a random artist (used by simulateRandomActivity)
 */
export const generateDemoBooking = async (isConfirmed = false) => {
  try {
    const artists = await Artist.find({});
    if (artists.length === 0) {
      return null;
    }

    // Select random artist
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    return generateDemoBookingForArtist(randomArtist, isConfirmed);
  } catch (error) {
    return null;
  }
};

/**
 * Confirms a random pending booking
 */
export const confirmRandomPendingBooking = async () => {
  try {
    const artists = await Artist.find({});
    const allPendingBookings = [];

    // Collect all pending bookings
    artists.forEach(artist => {
      artist.bookings.forEach(booking => {
        if (!booking.isConfirmed) {
          allPendingBookings.push({ artist, booking });
        }
      });
    });

    if (allPendingBookings.length === 0) {
      return null;
    }

    // Select random pending booking
    const randomIndex = Math.floor(Math.random() * allPendingBookings.length);
    const { artist, booking } = allPendingBookings[randomIndex];

    booking.isConfirmed = true;
    booking.updatedAt = new Date();
    await artist.save();

    return booking;
  } catch (error) {
    return null;
  }
};

/**
 * Rejects a random pending booking (deletes it)
 */
export const rejectRandomPendingBooking = async () => {
  try {
    const artists = await Artist.find({});
    const allPendingBookings = [];

    artists.forEach(artist => {
      artist.bookings.forEach(booking => {
        if (!booking.isConfirmed) {
          allPendingBookings.push({ artist, booking });
        }
      });
    });

    if (allPendingBookings.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * allPendingBookings.length);
    const { artist, booking } = allPendingBookings[randomIndex];

    artist.bookings.pull(booking._id);
    await artist.save();

    return booking;
  } catch (error) {
    return null;
  }
};

/**
 * Generates a demo booking for a SPECIFIC artist
 */
export const generateDemoBookingForArtist = async (artist, isConfirmed = false) => {
  try {
    // Generate client data
    const { firstName, lastName } = generateRandomName();
    const clientName = `${firstName} ${lastName}`;
    const clientEmail = generateEmail(firstName, lastName);
    const clientPhone = generatePhone();

    // Generate event data (1-7 days in advance)
    const date = generateFutureDate(1, 7);
    const startTime = generateEventTime();
    const endTime = calculateEndTime(startTime);
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const eventDetail = eventDetails[Math.floor(Math.random() * eventDetails.length)];

    // Calculate price and check if booking goes past midnight
    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);
    const spansMultipleDays = endHour < startHour;

    const startDateTime = new Date(`${date}T${startTime}`);
    let endDateTime = new Date(`${date}T${endTime}`);
    let endDate = null;

    if (spansMultipleDays) {
      endDateTime = new Date(startDateTime.getTime() + 24 * 60 * 60 * 1000);
      endDateTime.setHours(endHour, parseInt(endTime.split(':')[1]), 0, 0);
      endDate = endDateTime.toISOString().split('T')[0];
    }

    let durationInHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
    const totalPrice = Math.round(durationInHours * artist.pricePerHour);

    // Generate unique booking number
    const bookingNumber = await generateBookingNumber();

    // Create booking
    const newBooking = {
      bookingNumber,
      userId: null,
      date,
      startTime,
      endTime,
      endDate: endDate,
      isMultiDay: spansMultipleDays,
      totalPrice,
      clientName,
      clientEmail,
      clientPhone,
      eventDetails: `${eventType} - ${eventDetail}`,
      notes: Math.random() > 0.5 ? 'Please confirm ASAP' : '',
      isConfirmed: isConfirmed,
      isRejected: false,
      isCancelled: false,
      isBooked: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    artist.bookings.push(newBooking);
    await artist.save();

    return newBooking;
  } catch (error) {
    return null;
  }
};

/**
 * Generates multiple demo bookings with RANDOM but CONTROLLED distribution
 * Each artist gets 4-8 bookings (random)
 * PLUS 5 rejected and 5 cancelled bookings are randomly distributed
 */
export const generateMultipleDemoBookings = async (confirmedCount = 125, pendingCount = 25) => {
  const artists = await Artist.find({});
  if (artists.length === 0) {
    return 0;
  }

  const artistBookingsMap = new Map();
  artists.forEach(artist => artistBookingsMap.set(artist._id.toString(), []));

  let totalGenerated = 0;

  for (const artist of artists) {
    const totalBookingsForArtist = Math.floor(Math.random() * 5) + 4;
    const confirmedForArtist = Math.floor(totalBookingsForArtist * (0.8 + Math.random() * 0.1));
    const pendingForArtist = totalBookingsForArtist - confirmedForArtist;

    for (let i = 0; i < confirmedForArtist; i++) {
      const booking = await createBookingData(artist, true, false, false, i, totalBookingsForArtist);
      artistBookingsMap.get(artist._id.toString()).push(booking);
      totalGenerated++;
    }

    for (let i = 0; i < pendingForArtist; i++) {
      const booking = await createBookingData(
        artist,
        false,
        false,
        false,
        confirmedForArtist + i,
        totalBookingsForArtist
      );
      artistBookingsMap.get(artist._id.toString()).push(booking);
      totalGenerated++;
    }
  }

  for (let i = 0; i < 5; i++) {
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    const rejectedBooking = await createBookingData(randomArtist, false, true, false, 0, 1);
    artistBookingsMap.get(randomArtist._id.toString()).push(rejectedBooking);
    totalGenerated++;
  }

  for (let i = 0; i < 5; i++) {
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    const cancelledBooking = await createBookingData(randomArtist, true, false, true, 0, 1);
    artistBookingsMap.get(randomArtist._id.toString()).push(cancelledBooking);
    totalGenerated++;
  }

  for (const artist of artists) {
    const bookings = artistBookingsMap.get(artist._id.toString());
    if (bookings.length > 0) {
      artist.bookings.push(...bookings);
      await artist.save();
    }
  }

  return totalGenerated;
};

/**
 * Helper function: Creates booking data WITHOUT saving
 * With controlled date distribution for realistic demo data
 */
const createBookingData = async (
  artist,
  isConfirmed,
  isRejected = false,
  isCancelled = false,
  bookingIndex = 0,
  totalBookings = 5
) => {
  const { firstName, lastName } = generateRandomName();
  const clientName = `${firstName} ${lastName}`;
  const clientEmail = generateEmail(firstName, lastName);
  const clientPhone = generatePhone();

  let dayOffset;

  if (totalBookings <= 4) {
    const dayPattern = [1, 4, 7, 10];
    dayOffset = dayPattern[bookingIndex % dayPattern.length];
  } else if (totalBookings === 5) {
    const dayPattern = [1, 3, 5, 8, 11];
    dayOffset = dayPattern[bookingIndex % dayPattern.length];
  } else if (totalBookings === 6) {
    const dayPattern = [1, 2, 4, 6, 9, 12];
    dayOffset = dayPattern[bookingIndex % dayPattern.length];
  } else if (totalBookings === 7) {
    const dayPattern = [1, 2, 3, 5, 7, 9, 13];
    dayOffset = dayPattern[bookingIndex % dayPattern.length];
  } else {
    const dayPattern = [1, 2, 3, 4, 6, 8, 11, 14];
    dayOffset = dayPattern[bookingIndex % dayPattern.length];
  }

  const today = new Date();
  const date = new Date(today.getTime() + dayOffset * 24 * 60 * 60 * 1000);
  const dateString = date.toISOString().split('T')[0];

  const startTime = generateEventTime();
  const endTime = calculateEndTime(startTime);
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const eventDetail = eventDetails[Math.floor(Math.random() * eventDetails.length)];

  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);
  const spansMultipleDays = endHour < startHour;

  const startDateTime = new Date(`${dateString}T${startTime}`);
  let endDateTime = new Date(`${dateString}T${endTime}`);
  let endDate = null;

  if (spansMultipleDays) {
    endDateTime = new Date(startDateTime.getTime() + 24 * 60 * 60 * 1000);
    endDateTime.setHours(endHour, parseInt(endTime.split(':')[1]), 0, 0);
    endDate = endDateTime.toISOString().split('T')[0];
  }

  let durationInHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
  const totalPrice = Math.round(durationInHours * artist.pricePerHour);

  const bookingNumber = await generateBookingNumber();

  let notes = '';
  if (isRejected) {
    notes = 'Booking rejected - Artist not available';
  } else if (isCancelled) {
    notes = 'Booking cancelled by client';
  } else {
    notes = Math.random() > 0.5 ? 'Please confirm ASAP' : '';
  }

  return {
    bookingNumber,
    userId: null,
    date: dateString,
    startTime,
    endTime,
    endDate: endDate,
    isMultiDay: spansMultipleDays,
    totalPrice,
    clientName,
    clientEmail,
    clientPhone,
    eventDetails: `${eventType} - ${eventDetail}`,
    notes: notes,
    isConfirmed: isConfirmed,
    isRejected: isRejected,
    isCancelled: isCancelled,
    isBooked: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Simulates random activity (confirmations/rejections)
 */
export const simulateRandomActivity = async () => {
  const actions = [
    { name: 'confirm', weight: 40 },
    { name: 'reject', weight: 20 },
    { name: 'new', weight: 40 }
  ];

  // Weighted random selection
  const totalWeight = actions.reduce((sum, action) => sum + action.weight, 0);
  const random = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  let selectedAction = null;

  for (const action of actions) {
    cumulativeWeight += action.weight;
    if (random <= cumulativeWeight) {
      selectedAction = action.name;
      break;
    }
  }

  switch (selectedAction) {
    case 'confirm':
      return await confirmRandomPendingBooking();
    case 'reject':
      return await rejectRandomPendingBooking();
    case 'new':
      return await generateDemoBooking();
    default:
      return null;
  }
};

export const initializeDemoData = async () => {
  try {
    const artists = await Artist.find({});

    for (const artist of artists) {
      if (artist.bookings.length > 0) {
        artist.bookings.splice(0, artist.bookings.length);
        await artist.save();
      }
    }

    const totalGenerated = await generateMultipleDemoBookings();
    return totalGenerated;
  } catch (error) {
    return 0;
  }
};

export default {
  generateDemoBooking,
  generateDemoBookingForArtist,
  confirmRandomPendingBooking,
  rejectRandomPendingBooking,
  generateMultipleDemoBookings,
  simulateRandomActivity,
  initializeDemoData
};
