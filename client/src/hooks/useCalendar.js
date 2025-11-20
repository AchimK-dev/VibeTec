import { useState, useMemo } from "react";

export const useCalendar = (bookings = []) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const monthName = currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, date: null, bookings: [] });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split("T")[0];

      const dayBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date).toISOString().split("T")[0];
        return bookingDate === dateString;
      });

      days.push({
        day,
        date,
        dateString,
        bookings: dayBookings,
        isToday: dateString === new Date().toISOString().split("T")[0],
        isSelected:
          selectedDate &&
          dateString === selectedDate.toISOString().split("T")[0],
      });
    }

    return {
      monthName,
      days,
      year,
      month,
    };
  }, [currentDate, bookings, selectedDate]);

  const getBookingsForSelectedDate = () => {
    if (!selectedDate) return [];

    const selectedDateString = selectedDate.toISOString().split("T")[0];
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date).toISOString().split("T")[0];
      return bookingDate === selectedDateString;
    });
  };

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    calendarData,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    getBookingsForSelectedDate,
  };
};
