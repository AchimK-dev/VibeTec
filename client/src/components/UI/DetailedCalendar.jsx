import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "@/config/axiosConfig";

export default function DetailedCalendar({ artistId, onDateTimeSelect }) {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [error, setError] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState(new Set());
  const [showWeekDropdown, setShowWeekDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartSlot, setDragStartSlot] = useState(null);

  const fetchDetailedAvailability = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/artists/${artistId}/detailed-availability`
      );
      setAvailabilityData(response.data.detailedAvailability);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchDetailedAvailability();
  }, [fetchDetailedAvailability]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowWeekDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStartSlot(null);
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const getWeekDays = (startDate) => {
    const days = [];
    const start = new Date(startDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const previousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const generateWeekOptions = () => {
    const weeks = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + i * 7);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weeks.push({
        start: new Date(weekStart),
        label: `${weekStart.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        })} - ${weekEnd.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        })}`,
      });
    }
    return weeks;
  };

  const selectWeek = (weekStart) => {
    setCurrentWeekStart(weekStart);
    setShowWeekDropdown(false);
  };

  const createSlotKey = (date, hour) =>
    `${date.toISOString().split("T")[0]}-${hour}`;

  const parseSlotKey = (key) => {
    const parts = key.split("-");
    const hour = parseInt(parts[parts.length - 1]);
    const dateStr = parts.slice(0, -1).join("-");
    return { dateStr, hour };
  };

  const handleMouseDown = (date, hour, isBooked) => {
    if (isBooked) return;
    const slotKey = createSlotKey(date, hour);
    setIsDragging(true);
    setDragStartSlot(slotKey);
    const newSelection = new Set(selectedTimeSlots);
    if (newSelection.has(slotKey)) {
      newSelection.delete(slotKey);
    } else {
      newSelection.add(slotKey);
    }
    setSelectedTimeSlots(newSelection);
  };

  const handleMouseEnter = (date, hour, isBooked) => {
    if (!isDragging || !dragStartSlot || isBooked) return;
    const currentSlotKey = createSlotKey(date, hour);
    const startSlot = parseSlotKey(dragStartSlot);
    const currentSlot = parseSlotKey(currentSlotKey);
    if (startSlot.dateStr !== currentSlot.dateStr) return;
    const minHour = Math.min(startSlot.hour, currentSlot.hour);
    const maxHour = Math.max(startSlot.hour, currentSlot.hour);
    const dayData = availabilityData.find(
      (day) =>
        new Date(day.date).toISOString().split("T")[0] === startSlot.dateStr
    );
    if (!dayData) return;
    const newSelection = new Set();
    for (let h = minHour; h <= maxHour; h++) {
      const slot = dayData.timeSlots.find(
        (s) => s.time === `${h.toString().padStart(2, "0")}:00`
      );
      if (slot && !slot.isBooked) {
        newSelection.add(createSlotKey(date, h));
      }
    }
    setSelectedTimeSlots(newSelection);
  };

  const clearSelection = () => setSelectedTimeSlots(new Set());

  const getSelectedSlotsSummary = () => {
    if (selectedTimeSlots.size === 0) return null;
    const slotsByDate = {};
    selectedTimeSlots.forEach((key) => {
      const { dateStr, hour } = parseSlotKey(key);
      if (!slotsByDate[dateStr]) slotsByDate[dateStr] = [];
      slotsByDate[dateStr].push(hour);
    });
    Object.keys(slotsByDate).forEach((date) => {
      slotsByDate[date].sort((a, b) => a - b);
    });
    return slotsByDate;
  };

  const handleContinueBooking = () => {
    const slotsSummary = getSelectedSlotsSummary();
    if (!slotsSummary || Object.keys(slotsSummary).length === 0) return;
    const dates = Object.keys(slotsSummary).sort();
    const firstDate = dates[0];
    const hours = slotsSummary[firstDate];
    const startHour = Math.min(...hours);
    const endHour = Math.max(...hours) + 1;

    const formattedSlots = {};
    Object.keys(slotsSummary).forEach((date) => {
      formattedSlots[date] = slotsSummary[date].map(
        (hour) => `${hour.toString().padStart(2, "0")}:00`
      );
    });

    if (onDateTimeSelect) {
      onDateTimeSelect({
        date: firstDate,
        startTime: `${startHour.toString().padStart(2, "0")}:00`,
        endTime: `${endHour.toString().padStart(2, "0")}:00`,
        selectedSlots: formattedSlots,
        totalHours: selectedTimeSlots.size,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error loading availability: {error}</span>
      </div>
    );
  }

  const weekDays = getWeekDays(currentWeekStart);
  const weekData = weekDays.map((date) => {
    const dateString = date.toISOString().split("T")[0];
    return availabilityData.find(
      (day) => new Date(day.date).toISOString().split("T")[0] === dateString
    );
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-base-100 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Select Booking Time
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={previousWeek} className="btn btn-ghost btn-sm">
            ←
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowWeekDropdown(!showWeekDropdown)}
            >
              {currentWeekStart.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
              })}{" "}
              -{" "}
              {getWeekDays(currentWeekStart)[6].toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
              })}{" "}
              ▼
            </button>
            {showWeekDropdown && (
              <div className="absolute top-full right-0 z-50 bg-base-100 rounded-box shadow-lg border border-base-300 w-52 max-h-60 overflow-y-auto">
                <ul className="menu p-2">
                  {generateWeekOptions().map((week, index) => (
                    <li key={index}>
                      <button
                        onClick={() => selectWeek(week.start)}
                        className="text-left w-full"
                      >
                        {week.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button onClick={nextWeek} className="btn btn-ghost btn-sm">
            →
          </button>
        </div>
      </div>

      <div className="mb-4 p-3 bg-base-200 rounded-lg">
        <p className="text-sm text-base-content/70 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span>
            <strong>Click and drag</strong> to select multiple hours, or click
            individual hours to toggle selection
          </span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div
            className="grid grid-cols-8 gap-1 mb-2"
            style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}
          >
            <div className="text-xs font-semibold p-2"></div>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => {
                const date = weekDays[index];
                const isToday =
                  date && date.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={day}
                    className={`text-center font-semibold p-2 rounded ${
                      isToday
                        ? "bg-primary text-primary-content"
                        : "bg-base-200"
                    }`}
                  >
                    <div className="text-xs">{day}</div>
                    <div className="text-sm">{date?.getDate()}</div>
                  </div>
                );
              }
            )}
          </div>

          <div className="border border-base-300 rounded-lg overflow-hidden">
            {hours.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-8 border-b border-base-300 last:border-b-0 hover:bg-base-200/50 transition-colors"
                style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}
              >
                <div className="p-2 text-xs font-semibold text-center border-r border-base-300 bg-base-200/50">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                {weekDays.map((date, dayIndex) => {
                  const dayData = weekData[dayIndex];
                  const timeSlot = dayData?.timeSlots.find(
                    (s) => s.time === `${hour.toString().padStart(2, "0")}:00`
                  );
                  const isBooked = timeSlot?.isBooked || false;
                  const slotKey = createSlotKey(date, hour);
                  const isSelected = selectedTimeSlots.has(slotKey);
                  const isPast =
                    new Date(date).setHours(hour, 0, 0, 0) < new Date();
                  return (
                    <div
                      key={`${dayIndex}-${hour}`}
                      className={`p-1 border-r border-base-300 last:border-r-0 cursor-pointer transition-all duration-75 select-none ${
                        isPast ? "bg-base-300/30 cursor-not-allowed" : ""
                      } ${isBooked ? "bg-error/80 cursor-not-allowed" : ""} ${
                        !isBooked && !isPast && !isSelected
                          ? "bg-base-100 hover:bg-base-200"
                          : ""
                      } ${isSelected ? "bg-primary hover:bg-primary/90" : ""}`}
                      onMouseDown={() =>
                        !isPast && handleMouseDown(date, hour, isBooked)
                      }
                      onMouseEnter={() =>
                        !isPast && handleMouseEnter(date, hour, isBooked)
                      }
                      style={{ minHeight: "32px" }}
                    >
                      {isBooked && (
                        <div className="text-[10px] text-error-content text-center font-semibold">
                          Booked
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-6 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-base-100 border border-base-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-error/80 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-base-300/30 rounded"></div>
          <span>Past</span>
        </div>
      </div>

      {selectedTimeSlots.size > 0 && (
        <div className="mt-6 p-3 sm:p-4 bg-base-200 border-2 border-primary rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <p className="font-semibold text-base sm:text-lg">
                {selectedTimeSlots.size} Hour
                {selectedTimeSlots.size !== 1 ? "s" : ""} Selected
              </p>
              <p className="text-xs sm:text-sm text-base-content/70 mt-1">
                {(() => {
                  const summary = getSelectedSlotsSummary();
                  if (!summary) return "";
                  const dates = Object.keys(summary);
                  const firstDate = new Date(dates[0]);
                  const hours = summary[dates[0]];
                  const startHour = Math.min(...hours);
                  const endHour = Math.max(...hours) + 1;
                  return `${firstDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}, ${startHour.toString().padStart(2, "0")}:00 - ${endHour
                    .toString()
                    .padStart(2, "0")}:00`;
                })()}
              </p>
            </div>
            <div className="flex gap-2 sm:gap-2 flex-shrink-0">
              <button
                onClick={clearSelection}
                className="btn btn-ghost btn-sm text-xs sm:text-sm"
              >
                Clear
              </button>
              <button
                onClick={handleContinueBooking}
                className="btn btn-primary text-primary-content font-bold hover:scale-105 transition-all duration-200 rounded-3xl text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6"
              >
                Continue Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
