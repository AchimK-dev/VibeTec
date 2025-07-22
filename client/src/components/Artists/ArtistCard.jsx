import { Link } from 'react-router';

const ArtistCard = ({ _id, name, musicGenre, image, description, pricePerHour, bookings = [] }) => {
  // Calculate availability status
  const today = new Date();
  
  // Check today's bookings
  const todayBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate.toDateString() === today.toDateString() && booking.isBooked;
  });
  
  // Check weekly bookings (current week) - fix week calculation
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  startOfWeek.setDate(today.getDate() - dayOfWeek); // Start of week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0); // Set to beginning of day
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
  endOfWeek.setHours(23, 59, 59, 999); // Set to end of day
  
  const weeklyBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0); // Normalize to beginning of day for comparison
    return bookingDate >= startOfWeek && bookingDate <= endOfWeek && booking.isBooked;
  });
  
  // Count unique days with bookings
  const bookedDaysThisWeek = new Set(
    weeklyBookings.map(booking => new Date(booking.date).toDateString())
  ).size;
  
  const isFullyBookedWeek = bookedDaysThisWeek >= 6; // 6+ days booked = fully booked
  const isBusyWeek = bookedDaysThisWeek >= 4; // Busy if booked 4+ days per week
  
  // Determine status and color (simplified)
  let statusText, statusColor;
  if (isFullyBookedWeek) {
    statusText = 'Fully Booked';
    statusColor = 'badge-error';
  } else if (isBusyWeek) {
    statusText = 'Busy Week';
    statusColor = 'badge-warning';
  } else {
    statusText = 'Available';
    statusColor = 'badge-success';
  }
  
  return (
    <div className='card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300'>
      <figure className='relative'>
        <img 
          src={image} 
          alt={name}
          className='w-full h-64 object-cover'
        />
        <div className={`absolute top-4 right-4 badge ${statusColor} text-white font-bold`}>
          {statusText}
        </div>
        {/* Artist name overlay at bottom center of image */}
        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1'>
          <h2 className='text-white text-2xl font-bold text-center'>
            {name}
          </h2>
        </div>
      </figure>
      
      <div className='card-body'>
        <div className='flex items-center justify-between mb-4'>
          <div className='badge badge-secondary text-lg px-3 py-2'>{musicGenre}</div>
        </div>
        
        <p className='text-gray-300 text-sm line-clamp-3'>
          {description}
        </p>
        
        <div className='flex items-center justify-between mt-4'>
          <div className='text-lg font-bold' style={{color: '#BDFF00'}}>
            €{pricePerHour}/hour
          </div>
          
          <div className='text-sm text-gray-500'>
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className='card-actions justify-end mt-4'>
          <Link 
            to={`/artist/${_id}`} 
            className='btn text-black font-bold rounded-3xl w-full' 
            style={{backgroundColor: '#BDFF00', border: 'none'}}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
