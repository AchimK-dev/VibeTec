import mongoose from 'mongoose';
import Artist from '../models/Artist.js';

const assignBookingNumbers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('MONGO_URI not found in environment variables');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Get all artists
    const artists = await Artist.find({});
    console.log(`Found ${artists.length} artists`);

    // Find highest existing booking number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    let maxNumber = 0;
    artists.forEach(artist => {
      artist.bookings.forEach(booking => {
        if (booking.bookingNumber && booking.bookingNumber.startsWith(`VT-${dateStr}`)) {
          const num = parseInt(booking.bookingNumber.split('-')[2]);
          if (num > maxNumber) maxNumber = num;
        }
      });
    });

    console.log(`Starting from booking number: ${maxNumber + 1}`);
    let currentNumber = maxNumber;
    let totalBookings = 0;
    let updatedBookings = 0;

    // Process each artist
    for (const artist of artists) {
      if (artist.bookings && artist.bookings.length > 0) {
        totalBookings += artist.bookings.length;
        let artistModified = false;

        // Check each booking - ALWAYS reassign to fix duplicates
        for (const booking of artist.bookings) {
          currentNumber++;
          const bookingNumber = `VT-${dateStr}-${String(currentNumber).padStart(5, '0')}`;
          booking.bookingNumber = bookingNumber;
          updatedBookings++;
          artistModified = true;
          console.log(`Assigned ${bookingNumber} to booking ${booking._id}`);
        }

        // Save artist if any bookings were updated
        if (artistModified) {
          await artist.save();
          console.log(`✓ Updated ${artist.name}`);
        }
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Total bookings found: ${totalBookings}`);
    console.log(`Bookings updated: ${updatedBookings}`);
    console.log(`Bookings already had numbers: ${totalBookings - updatedBookings}`);

    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

// Run the migration
assignBookingNumbers();
