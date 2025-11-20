import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getSingleArtist, deleteArtist } from "@/data";
import { useAuth } from "@/context";
import { LoadingState, ErrorState } from "@/components";
import DetailedCalendar from "@/components/UI/DetailedCalendar";

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isDemo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    (async () => {
      try {
        const artistData = await getSingleArtist(id);
        setArtist(artistData);
      } catch (error) {
        toast.error(error.message);
        navigate("/artists");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const getAvailabilityStatus = () => {
    if (!artist || !artist.bookings)
      return {
        text: "Fully Available",
        color: "badge-success",
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="6" />
          </svg>
        ),
      };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
    twoWeeksFromNow.setHours(23, 59, 59, 999);

    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);
    oneWeekFromNow.setHours(23, 59, 59, 999);

    const upcomingBookings = artist.bookings.filter((booking) => {
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

    const redIcon = (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="6" />
      </svg>
    );

    const yellowIcon = (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="6" />
      </svg>
    );

    const greenIcon = (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="6" />
      </svg>
    );

    if (bookedDaysNextWeek >= 6) {
      return { text: "Fully Booked", color: "badge-error", icon: redIcon };
    } else if (bookedDaysNextWeek >= 5) {
      return { text: "Almost Full", color: "badge-error", icon: redIcon };
    } else if (totalBookedDays >= 10) {
      return { text: "High Demand", color: "badge-warning", icon: yellowIcon };
    } else if (bookedDaysNextWeek >= 3 || totalBookedDays >= 6) {
      return { text: "Busy", color: "badge-warning", icon: yellowIcon };
    } else if (totalBookedDays >= 1) {
      return { text: "Available", color: "badge-success", icon: greenIcon };
    } else {
      return {
        text: "Fully Available",
        color: "badge-success",
        icon: greenIcon,
      };
    }
  };

  const handleBookingContinue = (bookingData) => {
    if (!user) {
      toast.info("Please log in to book an artist");
      navigate("/login", { state: { next: `/artist/${id}` } });
      return;
    }

    navigate(`/booking-confirmation/${id}`, {
      state: { bookingData },
    });
  };

  const handleDeleteArtist = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this artist? This action cannot be undone."
      )
    ) {
      try {
        await deleteArtist(id);
        toast.success("Artist deleted successfully!");
        navigate("/artists");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container-no-padding">
        <div className="bg-base-100 rounded-xl min-h-screen">
          <LoadingState message="Loading artist details..." />
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="page-container-no-padding">
        <div className="bg-base-100 rounded-xl min-h-screen">
          <ErrorState
            title="Artist Not Found"
            message="The artist you're looking for doesn't exist or has been removed."
            actionLabel="Back to Artists"
            onAction={() => navigate("/artists")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-no-padding">
      <div className="min-h-screen rounded-xl bg-base-100">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="lg:w-1/3">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="lg:w-2/3 flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-base-content mb-2">
                      {artist.name}
                    </h1>
                    <p className="text-xl text-base-content mb-4">
                      {artist.musicGenre}
                    </p>
                  </div>

                  {user?.role === "ADMIN" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-artist/${id}`)}
                        className="btn btn-outline btn-sm"
                        disabled={isDemo}
                        title={
                          isDemo
                            ? "Demo-Account: Nur Leserechte"
                            : "Edit Artist"
                        }
                      >
                        Edit Artist
                      </button>
                      <button
                        onClick={handleDeleteArtist}
                        className="btn btn-error btn-sm"
                        disabled={isDemo}
                        title={
                          isDemo
                            ? "Demo-Account: Nur Leserechte"
                            : "Delete Artist"
                        }
                      >
                        Delete Artist
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg text-base-content font-semibold mb-2">
                      Description
                    </h3>
                    <p className="text-base-content mb-4">
                      {artist.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Booking Info</h3>
                    <div className="space-y-2">
                      <p className="flex justify-between">
                        <span>Price per Hour:</span>
                        <span className="font-semibold">
                          {artist.pricePerHour}€
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Status:</span>
                        <span
                          className={`badge ${
                            getAvailabilityStatus().color
                          } px-3 py-2`}
                        >
                          <span className="mr-1">
                            {getAvailabilityStatus().icon}
                          </span>
                          {getAvailabilityStatus().text}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Total Bookings:</span>
                        <span className="font-semibold">
                          {artist.bookings?.length || 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/artists")}
                  className="btn btn-outline btn-sm text-base-content hover:bg-base-100 hover:text-base-content/40"
                >
                  ← Back to Artists
                </button>
              </div>
            </div>
          </div>

          <DetailedCalendar
            artistId={id}
            onDateTimeSelect={handleBookingContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
