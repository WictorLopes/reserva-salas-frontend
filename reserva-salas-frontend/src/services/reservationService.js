import { api } from "./api";

export const reservationService = {
  getAll: () => api.get("/reservations"),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post("/reservations", data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  delete: (id) => api.delete(`/reservations/${id}`),
};
