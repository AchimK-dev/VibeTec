import api from '../config/axiosConfig';

const baseURL = `/artists`;

export const getArtists = async () => {
  const { data } = await api.get(baseURL);
  return data;
};

export const getSingleArtist = async (id) => {
  const { data } = await api.get(`${baseURL}/${id}`);
  return data;
};

export const createArtist = async (artistData) => {
  const { data } = await api.post(baseURL, artistData);
  return data;
};

export const updateArtist = async (id, artistData) => {
  const { data } = await api.put(`${baseURL}/${id}`, artistData);
  return data;
};

export const deleteArtist = async (id) => {
  try {
    const { data } = await api.delete(`${baseURL}/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const checkAvailability = async (id, date, startTime, endTime) => {
  if (!id) return null;
  const { data } = await api.get(`${baseURL}/${id}/availability`, {
    params: { date, startTime, endTime }
  });
  return data;
};

export const addBooking = async (id, bookingData) => {
  const { data } = await api.post(`${baseURL}/${id}/booking`, bookingData);
  return data;
};

export const getAvailableDates = async (id) => {
  const { data } = await api.get(`${baseURL}/${id}/available-dates`);
  return data;
};
