import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllBookings, confirmBooking, rejectBooking } from "@/data";
import { toast } from "react-toastify";

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleConfirm = async (artistId, bookingId) => {
    try {
      await confirmBooking(artistId, bookingId);
      toast.success("Booking confirmed successfully!");
      loadBookings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (artistId, bookingId) => {
    try {
      await rejectBooking(artistId, bookingId);
      toast.success("Booking rejected successfully!");
      loadBookings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length >= 2) {
      const suggestions = bookings
        .filter((b) => {
          const searchLower = value.toLowerCase();
          return (
            b.clientName.toLowerCase().includes(searchLower) ||
            b.clientEmail?.toLowerCase().includes(searchLower) ||
            b.clientPhone?.includes(searchLower) ||
            b.artistName.toLowerCase().includes(searchLower) ||
            b.bookingNumber?.toLowerCase().includes(searchLower)
          );
        })
        .slice(0, 5)
        .map((b) => ({
          id: b._id,
          text: b.clientName,
          subtext: `${b.artistName} - ${b.bookingNumber || "N/A"}`,
        }));

      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        if (
          filter === "pending" &&
          (booking.isConfirmed || booking.isRejected || booking.isCancelled)
        )
          return false;
        if (
          filter === "confirmed" &&
          (!booking.isConfirmed || booking.isCancelled)
        )
          return false;
        if (filter === "rejected" && !booking.isRejected) return false;
        if (filter === "cancelled" && !booking.isCancelled) return false;

        if (search.trim()) {
          const searchLower = search.toLowerCase();
          const matchesName = booking.clientName
            .toLowerCase()
            .includes(searchLower);
          const matchesEmail = booking.clientEmail
            ?.toLowerCase()
            .includes(searchLower);
          const matchesPhone = booking.clientPhone?.includes(searchLower);
          const matchesArtist = booking.artistName
            .toLowerCase()
            .includes(searchLower);
          const matchesBookingNumber = booking.bookingNumber
            ?.toLowerCase()
            .includes(searchLower);

          if (
            !matchesName &&
            !matchesEmail &&
            !matchesPhone &&
            !matchesArtist &&
            !matchesBookingNumber
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
          case "artist":
            aValue = a.artistName.toLowerCase();
            bValue = b.artistName.toLowerCase();
            break;
          case "client":
            aValue = a.clientName.toLowerCase();
            bValue = b.clientName.toLowerCase();
            break;
          case "price":
            aValue = a.totalPrice || 0;
            bValue = b.totalPrice || 0;
            break;
          case "status":
            aValue = a.isCancelled
              ? 0
              : a.isRejected
              ? 1
              : a.isConfirmed
              ? 3
              : 2;
            bValue = b.isCancelled
              ? 0
              : b.isRejected
              ? 1
              : b.isConfirmed
              ? 3
              : 2;
            break;
          case "bookingNumber":
            aValue = a.bookingNumber || "";
            bValue = b.bookingNumber || "";
            break;
          case "createdAt":
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          case "date":
          default:
            aValue = new Date(a.date);
            bValue = new Date(b.date);
            break;
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [bookings, filter, search, sortField, sortOrder]); // Only recalculate when these change

  return {
    bookings: filteredBookings,
    allBookings: bookings, // Original unfiltered bookings for statistics
    loading,
    filter,
    setFilter,
    search,
    handleSearch,
    sortField,
    sortOrder,
    handleSort,
    searchSuggestions,
    showSuggestions,
    setShowSuggestions,
    setSearch,
    handleConfirm,
    handleReject,
    reload: loadBookings,
  };
};
