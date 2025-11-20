import { Link } from "react-router";

const ArtistCard = ({
  _id,
  name,
  musicGenre,
  image,
  description,
  pricePerHour,
  bookings = [],
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const twoWeeksFromNow = new Date(today);
  twoWeeksFromNow.setDate(today.getDate() + 14);
  twoWeeksFromNow.setHours(23, 59, 59, 999);

  const oneWeekFromNow = new Date(today);
  oneWeekFromNow.setDate(today.getDate() + 7);
  oneWeekFromNow.setHours(23, 59, 59, 999);

  const upcomingBookings = bookings.filter((booking) => {
    if (!booking.isBooked) return false;
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate >= today && bookingDate <= twoWeeksFromNow;
  });

  const nextWeekBookings = upcomingBookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    return bookingDate <= oneWeekFromNow;
  });

  const bookedDaysNextWeek = new Set(
    nextWeekBookings.map((booking) => new Date(booking.date).toDateString())
  ).size;

  const totalBookedDays = new Set(
    upcomingBookings.map((booking) => new Date(booking.date).toDateString())
  ).size;

  let statusText, textColor;

  if (bookedDaysNextWeek >= 6) {
    statusText = "Fully Booked";
    textColor = "#ef4444"; // Rot
  } else if (bookedDaysNextWeek >= 5) {
    statusText = "Almost Full";
    textColor = "#ef4444"; // Rot
  } else if (totalBookedDays >= 10) {
    statusText = "High Demand";
    textColor = "#f97316"; // Orange
  } else if (bookedDaysNextWeek >= 3 || totalBookedDays >= 6) {
    statusText = "Busy";
    textColor = "#f97316"; // Orange
  } else if (totalBookedDays >= 1) {
    statusText = "Available";
    textColor = "#22c55e"; // Green
  } else {
    statusText = "Fully Available";
    textColor = "#22c55e"; // Green
  }

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <Link to={`/artist/${_id}`}>
        <figure className="relative cursor-pointer">
          <img
            src={image}
            alt={name}
            className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover"
          />
          <div
            className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 font-bold px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm shadow-lg bg-white rounded-full"
            style={{
              color: textColor,
            }}
          >
            <span className="hidden sm:inline">{statusText}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 sm:p-2">
            <h2 className="text-neutral-content text-lg sm:text-xl md:text-2xl font-bold text-center">
              {name}
            </h2>
          </div>
        </figure>
      </Link>

      <div className="card-body p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
          <div className="badge badge-accent text-sm sm:text-base md:text-lg px-2 py-1 sm:px-3 sm:py-2">
            {musicGenre}
          </div>
        </div>

        <p className="text-base-content/70 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
          {description}
        </p>

        <div className="flex items-center justify-between mt-2 sm:mt-3 md:mt-4">
          <div className="text-sm sm:text-base md:text-lg font-bold text-base-content">
            €{pricePerHour}/h
          </div>

          <div className="text-xs sm:text-sm text-base-content/50">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="card-actions justify-end mt-2 sm:mt-3 md:mt-4">
          <Link
            to={`/artist/${_id}`}
            className="btn btn-primary text-primary-content font-bold rounded-3xl w-full text-sm sm:text-base"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
