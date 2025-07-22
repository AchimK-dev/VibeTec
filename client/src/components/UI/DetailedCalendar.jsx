import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/config/axiosConfig';

export default function DetailedCalendar({ artistId, onDateTimeSelect, selectedDate }) {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [error, setError] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedBookingDate, setSelectedBookingDate] = useState(null);
  const [showWeekDropdown, setShowWeekDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchDetailedAvailability();
  }, [artistId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowWeekDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchDetailedAvailability = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/artists/${artistId}/detailed-availability`);
      setAvailabilityData(response.data.detailedAvailability);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = (startDate) => {
    const days = [];
    const start = new Date(startDate);
    
    // Start from Monday
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
    
    // Generate 12 weeks from today
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + (i * 7));
      
      // Get Monday of that week
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      weeks.push({
        start: new Date(weekStart),
        label: `${weekStart.toLocaleDateString('en-US', { 
          day: '2-digit', 
          month: 'short' 
        })} - ${weekEnd.toLocaleDateString('en-US', { 
          day: '2-digit', 
          month: 'short' 
        })}`
      });
    }
    
    return weeks;
  };

  const selectWeek = (weekStart) => {
    setCurrentWeekStart(weekStart);
    setShowWeekDropdown(false);
  };

  const formatTimeSlot = (time, isBooked, bookingInfo, date) => {
    const dateString = date.toDateString();
    const timeSlotKey = `${dateString}-${time}`;
    const isSelected = selectedTimeSlots.includes(timeSlotKey);
    const hasAnySelection = selectedTimeSlots.length > 0;
    
    const handleTimeSlotClick = () => {
      if (isBooked) return;
      
      // Allow multi-day selection for overnight bookings
      if (isSelected) {
        // Remove this time slot
        setSelectedTimeSlots(prev => prev.filter(slot => slot !== timeSlotKey));
        if (selectedTimeSlots.length === 1) {
          setSelectedBookingDate(null);
        }
      } else {
        // Add this time slot
        setSelectedTimeSlots(prev => [...prev, timeSlotKey]);
        if (!selectedBookingDate) {
          setSelectedBookingDate(new Date(date));
        }
      }
    };

    return (
      <button
        key={timeSlotKey}
        onClick={handleTimeSlotClick}
        disabled={isBooked}
        className={`
          p-1 rounded text-xs border transition-colors w-full
          ${isBooked 
            ? 'bg-error text-error-content border-error cursor-not-allowed' 
            : isSelected
              ? 'bg-primary text-primary-content border-primary' 
              : hasAnySelection
                ? 'bg-base-200 hover:bg-base-300 border-base-300'
                : 'bg-base-200 hover:bg-base-300 border-base-300'
          }
        `}
      >
        {time}
      </button>
    );
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
  const weekData = weekDays.map(date => {
    const dateString = date.toDateString();
    return availabilityData.find(day => 
      new Date(day.date).toDateString() === dateString
    );
  });

  return (
    <div className="bg-base-100 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          📅 Available Times
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={previousWeek}
            className="btn btn-ghost btn-sm"
          >
            ←
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowWeekDropdown(!showWeekDropdown)}
            >
              {currentWeekStart.toLocaleDateString('en-US', { 
                day: '2-digit', 
                month: 'short' 
              })} - {getWeekDays(currentWeekStart)[6].toLocaleDateString('en-US', { 
                day: '2-digit', 
                month: 'short' 
              })} ▼
            </button>
            {showWeekDropdown && (
              <div className="absolute top-full left-0 z-50 bg-base-100 rounded-box shadow-lg border border-base-300 w-52 max-h-60 overflow-y-auto">
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
          
          <button
            onClick={nextWeek}
            className="btn btn-ghost btn-sm"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center font-semibold p-2 bg-base-200 rounded">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekData.map((dayData, index) => {
          const date = weekDays[index];
          const isToday = date.toDateString() === new Date().toDateString();
          const isPast = date < new Date().setHours(0, 0, 0, 0);
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={index}
              className={`
                border rounded-lg p-2 min-h-[200px]
                ${isToday ? 'border-primary border-2' : 'border-base-300'}
                ${isPast ? 'opacity-50' : ''}
                ${isSelected ? 'bg-primary/10' : 'bg-base-100'}
              `}
            >
              <div className="text-center mb-2">
                <div className={`text-sm font-semibold ${isToday ? 'text-primary' : ''}`}>
                  {date.getDate()}
                </div>
                {dayData && (
                  <div className="text-xs text-base-content/70">
                    {dayData.totalBookings} Booking{dayData.totalBookings !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {dayData ? (
                  dayData.timeSlots.map((slot, slotIndex) => (
                    <div key={slotIndex}>
                      {formatTimeSlot(slot.time, slot.isBooked, slot.bookingInfo, date)}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-center text-base-content/50 mt-4">
                    No Data
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-base-200 border border-base-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-error rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Booking Confirmation */}
      {selectedTimeSlots.length > 0 && (
        <div className="mt-6 p-4 bg-primary/10 border border-primary rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">
                {selectedTimeSlots.length} Hour{selectedTimeSlots.length !== 1 ? 's' : ''} selected
              </p>
              <p className="text-sm text-base-content/70">
                {selectedBookingDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
            <button
              onClick={() => {
                if (onDateTimeSelect) {
                  // Group time slots by date for multi-day bookings
                  const slotsByDate = {};
                  selectedTimeSlots.forEach(slot => {
                    const [time] = slot.split('-').slice(-1);
                    const dateStr = slot.replace(`-${time}`, '');
                    
                    // Convert date string back to ISO format for proper parsing
                    // Use a more reliable method to avoid timezone issues
                    const dateObj = new Date(dateStr + ' 12:00:00');
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const isoDate = `${year}-${month}-${day}`;
                    
                    if (!slotsByDate[isoDate]) {
                      slotsByDate[isoDate] = [];
                    }
                    slotsByDate[isoDate].push(time);
                  });
                  
                  // Sort times within each date
                  Object.keys(slotsByDate).forEach(date => {
                    slotsByDate[date].sort();
                  });
                  
                  onDateTimeSelect({
                    selectedSlots: slotsByDate,
                    isMultiDay: Object.keys(slotsByDate).length > 1,
                    timeCount: selectedTimeSlots.length,
                    // Keep backwards compatibility for single day bookings
                    date: Object.keys(slotsByDate).length === 1 ? 
                      Object.keys(slotsByDate)[0] : null
                  });
                }
              }}
              className="btn btn-primary"
            >
              Continue Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
