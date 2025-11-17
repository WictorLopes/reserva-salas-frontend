import { api } from "./api";

export const roomService = {
  getAll: (locationId) =>
    api.get(`/rooms${locationId ? `?locationId=${locationId}` : ""}`),
  create: (data) => api.post("/rooms", data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};
