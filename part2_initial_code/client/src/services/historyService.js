import API from "./api.js";

export const getHistory = async (page = 1, limit = 10) => {
  try {
    const response = await API.get(`/history?page=${page}&limit=${limit}`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Get history error:", error.response || error);
    throw error;
  }
};

export const deleteHistoryItem = async (id) => {
  try {
    const response = await API.delete(`/history/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete history error:", error.response || error);
    throw error;
  }
};

export const clearHistory = async () => {
  try {
    const response = await API.delete(`/history/clear`);
    return response.data;
  } catch (error) {
    console.error("Clear history error:", error.response || error);
    throw error;
  }
};