import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import { getSingleArtist, addBooking, updatePhoneNumber } from "@/data";
import { useAuth } from "@/context";

const BookingConfirmation = () => {
  const { id } = useParams(); // Artist ID
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    eventType: "",
    eventLocation: "",
    numberOfGuests: "",
    eventDetails: "",
    musicPreferences: "",
    specialRequests: "",
    contactPhone: "",
    contactEmail: user?.email || "",
  });

  const bookingData = location.state?.bookingData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!bookingData || !user) {
      toast.error("Invalid booking data");
      navigate("/artists");
      return;
    }

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
  }, [id, navigate, bookingData, user]);

  const calculateTotalPrice = () => {
    if (!artist || !bookingData?.selectedSlots) return 0;

    if (Array.isArray(bookingData.selectedSlots)) {
      return bookingData.selectedSlots.length * artist.pricePerHour;
    } else {
      const totalSlots = Object.values(bookingData.selectedSlots).flat().length;
      return totalSlots * artist.pricePerHour;
    }
  };

  const formatTimeRange = () => {
    if (!bookingData?.selectedSlots) return "";

    if (Array.isArray(bookingData.selectedSlots)) {
      if (!bookingData.selectedSlots.length) return "";
      const slots = bookingData.selectedSlots.sort();
      const startTime = slots[0];
      const endHour = parseInt(slots[slots.length - 1].split(":")[0]) + 1;
      const endTime = `${endHour.toString().padStart(2, "0")}:00`;
      return `${startTime} - ${endTime}`;
    } else {
      const dates = Object.keys(bookingData.selectedSlots).sort();
      if (dates.length === 0) return "";

      if (dates.length === 1) {
        const slots = bookingData.selectedSlots[dates[0]].sort();
        const startTime = slots[0];
        const endHour = parseInt(slots[slots.length - 1].split(":")[0]) + 1;
        const endTime = `${endHour.toString().padStart(2, "0")}:00`;
        const dateStr = new Date(dates[0] + "T12:00:00").toLocaleDateString(
          "en-US",
          {
            weekday: "short",
            month: "short",
            day: "numeric",
          }
        );
        return `${dateStr}, ${startTime} - ${endTime}`;
      } else {
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];
        const firstSlots = bookingData.selectedSlots[firstDate].sort();
        const lastSlots = bookingData.selectedSlots[lastDate].sort();

        const startTime = firstSlots[0];
        const endHour =
          parseInt(lastSlots[lastSlots.length - 1].split(":")[0]) + 1;
        const endTime = `${endHour.toString().padStart(2, "0")}:00`;

        const startDateStr = new Date(
          firstDate + "T12:00:00"
        ).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const endDateStr = new Date(lastDate + "T12:00:00").toLocaleDateString(
          "en-US",
          {
            weekday: "short",
            month: "short",
            day: "numeric",
          }
        );

        return `${startDateStr} ${startTime} - ${endDateStr} ${endTime}`;
      }
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!bookingForm.eventType.trim()) {
      toast.error("Please select an event type");
      return;
    }

    if (!bookingForm.eventLocation.trim()) {
      toast.error("Please provide event location");
      return;
    }

    if (!bookingForm.contactPhone.trim()) {
      toast.error("Please provide a contact phone number");
      return;
    }

    const bookingNotes = bookingForm.specialRequests
      ? `Special Requests: ${bookingForm.specialRequests}`
      : "";

    try {
      if (Array.isArray(bookingData.selectedSlots)) {
        const slots = bookingData.selectedSlots.sort();
        const startTime = slots[0];
        const endHour = parseInt(slots[slots.length - 1].split(":")[0]) + 1;
        const endTime = `${endHour.toString().padStart(2, "0")}:00`;

        await addBooking(id, {
          date: bookingData.date,
          startTime,
          endTime,
          clientName: `${user.firstName} ${user.lastName}`,
          clientEmail: bookingForm.contactEmail,
          clientPhone: bookingForm.contactPhone,
          eventType: bookingForm.eventType,
          eventLocation: bookingForm.eventLocation,
          numberOfGuests: bookingForm.numberOfGuests || "",
          musicPreferences: bookingForm.musicPreferences || "",
          eventDetails: bookingForm.eventDetails || "",
          notes: bookingNotes,
          totalPrice: calculateTotalPrice(),
          isConfirmed: false,
        });
      } else {
        const dates = Object.keys(bookingData.selectedSlots).sort();
        const firstDate = dates[0];
        const lastDate = dates[dates.length - 1];

        const firstDateSlots = bookingData.selectedSlots[firstDate].sort();
        const startTime = firstDateSlots[0];

        const lastDateSlots = bookingData.selectedSlots[lastDate].sort();
        const endHour =
          parseInt(lastDateSlots[lastDateSlots.length - 1].split(":")[0]) + 1;
        const endTime = `${endHour.toString().padStart(2, "0")}:00`;

        const startHour = parseInt(startTime.split(":")[0]);
        const endHourNum = parseInt(endTime.split(":")[0]);
        const isOvernightBooking =
          endHourNum <= startHour && dates.length === 1; // End time is earlier than start time on same calendar date
        const isActuallyMultiDay = dates.length > 1 || isOvernightBooking;

        let actualEndDate;
        if (isOvernightBooking && dates.length === 1) {
          const nextDay = new Date(firstDate);
          nextDay.setDate(nextDay.getDate() + 1);
          actualEndDate = nextDay.toISOString().split("T")[0];
        } else {
          actualEndDate = isActuallyMultiDay ? lastDate : null;
        }

        await addBooking(id, {
          date: new Date(firstDate).toISOString().split("T")[0],
          startTime,
          endTime, // Keep endTime as simple time format
          clientName: `${user.firstName} ${user.lastName}`,
          clientEmail: bookingForm.contactEmail,
          clientPhone: bookingForm.contactPhone,
          eventType: bookingForm.eventType,
          eventLocation: bookingForm.eventLocation,
          numberOfGuests: bookingForm.numberOfGuests || "",
          musicPreferences: bookingForm.musicPreferences || "",
          eventDetails: bookingForm.eventDetails
            ? bookingForm.eventDetails +
              (isActuallyMultiDay ? " (Multi-day booking)" : "")
            : isActuallyMultiDay
            ? "(Multi-day booking)"
            : "",
          notes: bookingNotes,
          totalPrice: calculateTotalPrice(),
          isConfirmed: false,
          isMultiDay: isActuallyMultiDay,
          endDate: actualEndDate,
        });
      }

      // Update user profile with phone number if not already set
      if (bookingForm.contactPhone && !user.phoneNumber) {
        try {
          await updatePhoneNumber(bookingForm.contactPhone);
          await refreshUser();
        } catch {
          // Silent fail - booking was successful
        }
      }

      toast.success(
        "Booking successfully created! Waiting for admin confirmation."
      );
      navigate(`/artist/${id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="page-container-no-padding">
        <div className="bg-base-100 rounded-xl min-h-[calc(100vh-120px)] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (!artist || !bookingData) {
    return (
      <div className="page-container-no-padding">
        <div className="bg-base-100 rounded-xl min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-8">
          <div className="alert alert-error">
            <span>Booking data not found</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-no-padding">
      <div className="bg-base-100 rounded-xl min-h-[calc(100vh-120px)] flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body bg-base-100 border-1 border-primary rounded-xl p-8">
              <h1 className="card-title text-3xl mb-8 text-center">
                Confirm Your Booking
              </h1>

              <div className="flex items-center gap-4 mb-8 p-6 bg-base-200 rounded-lg">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-semibold">{artist.name}</h2>
                  <p className="text-base-content/70 text-lg">
                    {artist.musicGenre}
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Booking Details</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">
                        {bookingData?.selectedSlots &&
                        !Array.isArray(bookingData.selectedSlots)
                          ? // New multi-day format: show date range
                            (() => {
                              const dates = Object.keys(
                                bookingData.selectedSlots
                              ).sort();
                              if (dates.length === 1) {
                                return new Date(
                                  dates[0] + "T12:00:00"
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                              } else {
                                const startDate = new Date(
                                  dates[0] + "T12:00:00"
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                });
                                const endDate = new Date(
                                  dates[dates.length - 1] + "T12:00:00"
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                });
                                return `${startDate} - ${endDate}`;
                              }
                            })()
                          : // Old single day format
                            new Date(
                              bookingData.date + "T12:00:00"
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{formatTimeRange()}</span>
                    </div>

                    <div className="flex  justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">
                        {(() => {
                          let totalSlots = 0;
                          if (Array.isArray(bookingData.selectedSlots)) {
                            totalSlots = bookingData.selectedSlots.length;
                          } else if (bookingData.selectedSlots) {
                            totalSlots = Object.values(
                              bookingData.selectedSlots
                            ).flat().length;
                          } else {
                            totalSlots = bookingData.timeCount || 0;
                          }
                          return `${totalSlots} Hour${
                            totalSlots !== 1 ? "s" : ""
                          }`;
                        })()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Price per hour:</span>
                      <span className="font-medium">
                        {artist.pricePerHour}€
                      </span>
                    </div>

                    <div className="divider h-0.5 bg-primary"></div>

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total price:</span>
                      <span>{calculateTotalPrice()}€</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Event Information</h3>

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="label">
                        <span className="label-text text-base-content font-bold">
                          Event Type *
                        </span>
                      </label>
                      <select
                        className="select bg-base-100 border-1 border-primary w-full"
                        value={bookingForm.eventType}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            eventType: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">Select event type</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Birthday Party">Birthday Party</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Club Event">Club Event</option>
                        <option value="Private Party">Private Party</option>
                        <option value="Festival">Festival</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text text-base-content font-bold">
                          Event Location *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input bg-base-100 border-1 border-primary w-full"
                        placeholder="City, Venue name, or full address"
                        value={bookingForm.eventLocation}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            eventLocation: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text text-base-content font-bold">
                          Number of Guests
                        </span>
                      </label>
                      <input
                        type="number"
                        className="input bg-base-100 border-1 border-primary w-full"
                        placeholder="Expected number of guests"
                        value={bookingForm.numberOfGuests}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            numberOfGuests: e.target.value,
                          }))
                        }
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text text-base-content font-bold">
                          Contact Phone *
                        </span>
                      </label>
                      <input
                        type="tel"
                        className="input bg-base-100 border-1 border-primary w-full"
                        placeholder="+49 123 456789"
                        value={bookingForm.contactPhone}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            contactPhone: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text text-base-content font-bold">
                          Contact Email *
                        </span>
                      </label>
                      <input
                        type="email"
                        className="input bg-base-100 border-1 border-primary w-full"
                        placeholder="your@email.com"
                        value={bookingForm.contactEmail}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            contactEmail: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text text-base-content">
                          Additional Event Details
                        </span>
                      </label>
                      <textarea
                        className="textarea bg-base-100 border-1 border-primary textarea-bordered w-full"
                        placeholder="Any specific details about your event..."
                        value={bookingForm.eventDetails}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            eventDetails: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text text-base-content">
                          Music Preferences
                        </span>
                      </label>
                      <textarea
                        className="textarea bg-base-100 border-1 border-primary textarea-bordered w-full"
                        placeholder="Preferred music genres, specific songs, atmosphere..."
                        value={bookingForm.musicPreferences}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            musicPreferences: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text text-base-content">
                          Special Requests
                        </span>
                      </label>
                      <textarea
                        className="textarea bg-base-100 border-1 border-primary textarea-bordered w-full"
                        placeholder="Equipment needs, setup requirements, special requests..."
                        value={bookingForm.specialRequests}
                        onChange={(e) =>
                          setBookingForm((prev) => ({
                            ...prev,
                            specialRequests: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn flex-1 bg-base-100 border-1 border-primary text-base-content font-bold hover:scale-105 transition-all duration-200 rounded-3xl py-3"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn flex-1 text-primary-content font-bold hover:scale-105 transition-all duration-200 rounded-3xl btn-primary text-primary-content"
                      >
                        Complete Booking
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
