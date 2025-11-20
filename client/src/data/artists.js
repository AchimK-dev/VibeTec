import api from "../config/axiosConfig";

const baseURL = `/artists`;

const isValidId = (id) =>
  typeof id === "string" && id.trim() !== "" && id !== "undefined";

const handleApiError = (error, fallbackMessage) => {
  if (!error.response) {
    throw new Error(
      "Unable to connect to server. Please check your internet connection."
    );
  }
  throw new Error(error.response?.data?.message || fallbackMessage);
};

export const getArtists = async () => {
  try {
    const { data } = await api.get(baseURL);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to load artists.");
  }
};

export const getSingleArtist = async (id) => {
  if (!isValidId(id)) return null;
  try {
    const { data } = await api.get(`${baseURL}/${id}`);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to load artist details.");
  }
};

export const createArtist = async (artistData) => {
  try {
    const { data } = await api.post(baseURL, artistData);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to create artist.");
  }
};

export const updateArtist = async (id, artistData) => {
  if (!isValidId(id)) return null;
  try {
    const { data } = await api.put(`${baseURL}/${id}`, artistData);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to update artist.");
  }
};

export const deleteArtist = async (id) => {
  if (!isValidId(id)) return null;
  try {
    const { data } = await api.delete(`${baseURL}/${id}`);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to delete artist.");
  }
};

export const checkAvailability = async (id, date, startTime, endTime) => {
  if (!id) return null;
  try {
    const { data } = await api.get(`${baseURL}/${id}/availability`, {
      params: { date, startTime, endTime },
    });
    return data;
  } catch (error) {
    handleApiError(error, "Failed to check availability.");
  }
};

export const addBooking = async (id, bookingData) => {
  if (!isValidId(id)) return null;
  try {
    const { data } = await api.post(`${baseURL}/${id}/booking`, bookingData);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to create booking.");
  }
};

export const getAvailableDates = async (id) => {
  if (!isValidId(id)) return null;
  try {
    const { data } = await api.get(`${baseURL}/${id}/available-dates`);
    return data;
  } catch (error) {
    handleApiError(error, "Failed to load available dates.");
  }
};
