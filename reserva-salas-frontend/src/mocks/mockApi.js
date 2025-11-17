import { locations, rooms, reservations } from "./mockData";

export const mockApi = {
  get: async (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (url) {
          case "/locations":
            resolve({ data: locations });
            break;
          case "/rooms":
            resolve({ data: rooms });
            break;
          case "/reservations":
            resolve({ data: reservations });
            break;
          default:
            resolve({ data: [] });
        }
      });
    });
  },

  delete: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 200));
  },

  post: async (url, payload) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ data: { id: Math.random(), ...payload } }), 200)
    );
  },

  put: async (url, payload) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ data: payload }), 200)
    );
  },
};
