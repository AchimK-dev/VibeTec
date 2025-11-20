import { useState, useEffect } from "react";
import { getUserBookings } from "@/data";
import { LoadingState, EmptyState } from "@/components";
import BookingCard from "@/components/Bookings/BookingCard";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getUserBookings();
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = (bookingId) => {
    setBookings(
      bookings.map((booking) =>
        booking._id === bookingId
          ? {
              ...booking,
              isCancelled: true,
              isConfirmed: false,
              isRejected: false,
            }
          : booking
      )
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "ALL") return !booking.isCancelled; // Don't show cancelled in "ALL"
    if (filter === "PENDING")
      return (
        !booking.isConfirmed && !booking.isRejected && !booking.isCancelled
      );
    if (filter === "CONFIRMED")
      return booking.isConfirmed && !booking.isCancelled;
    if (filter === "REJECTED") return booking.isRejected;
    if (filter === "CANCELLED") return booking.isCancelled;
    return true;
  });

  const stats = {
    total: bookings.filter((b) => !b.isCancelled).length, // Don't count cancelled in total
    pending: bookings.filter(
      (b) => !b.isConfirmed && !b.isRejected && !b.isCancelled
    ).length,
    confirmed: bookings.filter((b) => b.isConfirmed && !b.isCancelled).length,
    rejected: bookings.filter((b) => b.isRejected).length,
    cancelled: bookings.filter((b) => b.isCancelled).length,
  };

  if (loading) {
    return (
      <div className="page-container-no-padding">
        <div className="bg-base-100 rounded-xl min-h-screen">
          <LoadingState message="Loading your bookings..." />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-no-padding">
      <div className="w-full min-h-screen">
        <div className="bg-base-100 rounded-xl shadow-lg p-4 sm:p-6 md:p-12 min-h-screen">
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-6 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-base-content mb-2 md:mb-4">
                My Bookings
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-base-content">
                Manage your artist bookings and event requests
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-base-200 rounded-xl p-3 sm:p-4 md:p-6 text-center">
                <p className="text-base-content/60 text-xs sm:text-sm mb-1 sm:mb-2">
                  Total
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
                  {stats.total}
                </p>
              </div>
              <div className="bg-base-200 rounded-xl p-3 sm:p-4 md:p-6 text-center">
                <p className="text-base-content/60 text-xs sm:text-sm mb-1 sm:mb-2">
                  Pending
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-warning">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-base-200 rounded-xl p-3 sm:p-4 md:p-6 text-center">
                <p className="text-base-content/60 text-xs sm:text-sm mb-1 sm:mb-2">
                  Confirmed
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-success">
                  {stats.confirmed}
                </p>
              </div>
              <div className="bg-base-200 rounded-xl p-3 sm:p-4 md:p-6 text-center">
                <p className="text-base-content/60 text-xs sm:text-sm mb-1 sm:mb-2">
                  Rejected
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-error">
                  {stats.rejected}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8 justify-center">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm md:text-base ${
                  filter === "ALL"
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content hover:bg-neutral"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter("PENDING")}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm md:text-base ${
                  filter === "PENDING"
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content hover:bg-neutral"
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter("CONFIRMED")}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm md:text-base ${
                  filter === "CONFIRMED"
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content hover:bg-neutral"
                }`}
              >
                Confirmed ({stats.confirmed})
              </button>
              <button
                onClick={() => setFilter("REJECTED")}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm md:text-base ${
                  filter === "REJECTED"
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content hover:bg-neutral"
                }`}
              >
                Rejected ({stats.rejected})
              </button>
              <button
                onClick={() => setFilter("CANCELLED")}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm md:text-base ${
                  filter === "CANCELLED"
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content hover:bg-neutral"
                }`}
              >
                Cancelled ({stats.cancelled})
              </button>
            </div>

            {filteredBookings.length === 0 ? (
              <EmptyState
                icon="calendar"
                title="No Bookings Found"
                message={
                  filter === "ALL"
                    ? "You haven't made any bookings yet. Browse our artists to get started!"
                    : `No ${filter.toLowerCase()} bookings found.`
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onUpdate={loadBookings}
                    onDelete={handleDeleteBooking}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
