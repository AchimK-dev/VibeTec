import { useState } from "react";
import { toast } from "react-toastify";
import { updateBooking, deleteBooking } from "@/data";

const BookingCard = ({ booking, onUpdate, onDelete }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editForm, setEditForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    endDate: "",
    isMultiDay: false,
    eventDetails: "",
    notes: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
  });

  const openEditModal = () => {
    setEditForm({
      date: booking.date.split("T")[0],
      startTime: booking.startTime,
      endTime: booking.endTime,
      endDate: booking.endDate ? booking.endDate.split("T")[0] : "",
      isMultiDay: booking.isMultiDay || false,
      eventDetails: booking.eventDetails || "",
      notes: booking.notes || "",
      clientName: booking.clientName || "",
      clientEmail: booking.clientEmail || "",
      clientPhone: booking.clientPhone || "",
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBooking(booking._id, editForm);
      toast.success("Booking updated successfully!");
      closeEditModal();
      onUpdate();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update booking";
      toast.error(errorMsg);
    }
  };

  const handleCancel = async () => {
    try {
      await deleteBooking(booking._id);
      toast.success("Booking cancelled successfully");
      onDelete(booking._id);
      setShowConfirmModal(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to cancel booking";
      toast.error(errorMsg);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = () => {
    if (booking.isCancelled) return "bg-neutral";
    if (booking.isRejected) return "bg-error";
    if (booking.isConfirmed) return "bg-success";
    return "bg-yellow-500";
  };

  const getStatusText = () => {
    if (booking.isCancelled) return "Cancelled";
    if (booking.isRejected) return "Rejected";
    if (booking.isConfirmed) return "Confirmed";
    return "Pending";
  };

  return (
    <>
      <div className="bg-base-100 border border-primary rounded-xl p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-base-content mb-2">
              {booking.artistName}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`badge ${getStatusColor()} text-base-content font-semibold`}
              >
                {getStatusText()}
              </span>
              {booking.bookingNumber && (
                <span className="text-sm text-base-content/60">
                  #{booking.bookingNumber}
                </span>
              )}
              <p className="text-2xl font-bold text-base-content sm:hidden">
                €{booking.totalPrice?.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold text-base-content">
              €{booking.totalPrice?.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-base-content">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-base-content/60 flex-shrink-0"
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
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-base-content/60 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
          {booking.isMultiDay && booking.endDate && (
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-base-content/60 flex-shrink-0"
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
              <span>Until {formatDate(booking.endDate)}</span>
            </div>
          )}
          {booking.eventDetails && (
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-base-content/60 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="flex-1">{booking.eventDetails}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-base-content/20 flex gap-2">
          {!booking.isConfirmed &&
            !booking.isRejected &&
            !booking.isCancelled && (
              <button
                onClick={openEditModal}
                className="btn btn-sm bg-primary text-primary-content hover:bg-primary/80 flex-1"
              >
                ✏️ Edit
              </button>
            )}
          {!booking.isRejected && !booking.isCancelled && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="btn btn-sm bg-error text-error-content hover:bg-error/80 flex-1"
            >
              ❌ {booking.isConfirmed ? "Cancel" : "Cancel"}
            </button>
          )}
        </div>
      </div>

      {editModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 border border-primary max-w-2xl">
            <h3 className="font-bold text-2xl text-base-content mb-4">
              Edit Booking
            </h3>
            <form onSubmit={handleEditFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text text-base-content">Date</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditFormChange}
                    className="input input-bordered w-full bg-base-200 text-base-content"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-base-content">
                      Start Time
                    </span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={editForm.startTime}
                    onChange={handleEditFormChange}
                    className="input input-bordered w-full bg-base-200 text-base-content"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-base-content">
                      End Time
                    </span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={editForm.endTime}
                    onChange={handleEditFormChange}
                    className="input input-bordered w-full bg-base-200 text-base-content"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="label cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      name="isMultiDay"
                      checked={editForm.isMultiDay}
                      onChange={handleEditFormChange}
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text text-base-content">
                      Multi-day Event
                    </span>
                  </label>
                </div>
                {editForm.isMultiDay && (
                  <div className="md:col-span-2">
                    <label className="label">
                      <span className="label-text text-base-content">
                        End Date
                      </span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={editForm.endDate}
                      onChange={handleEditFormChange}
                      className="input input-bordered w-full bg-base-200 text-base-content"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-base-content">
                    Event Details
                  </span>
                </label>
                <textarea
                  name="eventDetails"
                  value={editForm.eventDetails}
                  onChange={handleEditFormChange}
                  className="textarea textarea-bordered w-full bg-base-200 text-base-content"
                  rows="3"
                  placeholder="Wedding reception, birthday party, etc."
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-base-content">
                    Additional Notes
                  </span>
                </label>
                <textarea
                  name="notes"
                  value={editForm.notes}
                  onChange={handleEditFormChange}
                  className="textarea textarea-bordered w-full bg-base-200 text-base-content"
                  rows="2"
                  placeholder="Special requests or information"
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="btn bg-neutral text-base-content hover:bg-neutral"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-primary text-primary-content hover:bg-primary/80"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div
          className="modal modal-open"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="modal-box bg-base-100 border border-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl text-base-content mb-4">
              {booking.isConfirmed ? "Cancel" : "Cancel Booking"}
            </h3>
            <p className="text-base-content mb-6">
              {booking.isConfirmed
                ? "Do you really want to cancel this confirmed booking?"
                : "Do you really want to cancel this booking?"}
            </p>
            <div className="modal-action">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn bg-base-200 text-base-content hover:bg-base-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCancel}
                className="btn bg-error text-error-content hover:bg-error/80"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCancel();
                  }
                }}
              >
                {booking.isConfirmed ? "Cancel Booking" : "Delete Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;
