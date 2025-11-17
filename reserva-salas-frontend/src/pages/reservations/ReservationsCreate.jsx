import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  locations as mockLocations,
  rooms as mockRooms,
  reservations as mockReservations,
} from "../../mocks/mockData";

export default function ReservationsCreate() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedRoomCapacity, setSelectedRoomCapacity] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [responsible, setResponsible] = useState("");
  const [coffeeRequested, setCoffeeRequested] = useState(false);
  const [coffeeQuantity, setCoffeeQuantity] = useState("");
  const [coffeeDescription, setCoffeeDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [locationsRes, roomsRes] = await Promise.all([
          api.get("/locations"),
          api.get("/rooms"),
        ]);
        setLocations(locationsRes.data);
        setRooms(roomsRes.data);
      } catch {
        console.warn("API offline, usando dados mockados");
        setLocations(mockLocations);
        setRooms(mockRooms);
      }
    }

    loadData();
  }, []);

  const filteredRooms = rooms.filter(
    (room) => String(room.locationId) === String(selectedLocation)
  );

  useEffect(() => {
    const room = rooms.find((r) => String(r.id) === String(selectedRoom));
    setSelectedRoomCapacity(room ? room.capacity : null);
  }, [selectedRoom, rooms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !selectedLocation ||
      !selectedRoom ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime ||
      !responsible
    ) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    setLoading(true);
    try {
      await api.post("/reservations", {
        LocationId: parseInt(selectedLocation),
        RoomId: parseInt(selectedRoom),
        Start: start.toISOString(),
        End: end.toISOString(),
        Responsible: responsible,
        CoffeeRequested: coffeeRequested,
        CoffeeQuantity: coffeeRequested ? parseInt(coffeeQuantity) || null : null,
        CoffeeDescription: coffeeRequested ? coffeeDescription || null : null,
      });
      navigate("/reservations");
    } catch {
      console.warn("API offline, salvando apenas no mock");
      try {
        const newId = mockReservations.length
          ? Math.max(...mockReservations.map((r) => r.id)) + 1
          : 1;

        const roomObj = mockRooms.find((r) => r.id === Number(selectedRoom));
        const locationObj = mockLocations.find((l) => l.id === Number(selectedLocation));

        mockReservations.push({
          id: newId,
          locationId: Number(selectedLocation),
          roomId: Number(selectedRoom),
          roomName: roomObj?.name || "-",
          locationName: locationObj?.name || "-",
          start: start.toISOString(),
          end: end.toISOString(),
          responsible,
          coffeeRequested,
          coffeeQuantity: coffeeRequested ? parseInt(coffeeQuantity) || null : null,
          coffeeDescription: coffeeRequested ? coffeeDescription || null : null,
          createdAt: new Date().toISOString(),
        });

        navigate("/reservations");
      } catch {
        setError("Não foi possível salvar no mock.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Criar Reserva</h1>

        {error && (
          <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Local</label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Selecione um local...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Room */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Sala</label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              disabled={!selectedLocation}
            >
              <option value="">Selecione uma sala...</option>
              {filteredRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} (Capacidade: {room.capacity})
                </option>
              ))}
            </select>
            {selectedRoomCapacity !== null && (
              <p className="text-gray-600 mt-1">
                Capacidade: <strong>{selectedRoomCapacity}</strong>
              </p>
            )}
          </div>

          {/* Responsible */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Responsável</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              required
            />
          </div>

          {/* Start Date & Time */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Início (Data)</label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Início (Hora)</label>
              <input
                type="time"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>

          {/* End Date & Time */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Fim (Data)</label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Fim (Hora)</label>
              <input
                type="time"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Coffee */}
          <div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={coffeeRequested}
                onChange={(e) => setCoffeeRequested(e.target.checked)}
              />
              Solicitar café
            </label>
            {coffeeRequested && (
              <div className="mt-2 space-y-2">
                <input
                  type="number"
                  placeholder="Quantidade"
                  className="w-full p-2 border rounded-lg"
                  value={coffeeQuantity}
                  onChange={(e) => setCoffeeQuantity(e.target.value)}
                />
                <textarea
                  placeholder="Descrição"
                  className="w-full p-2 border rounded-lg resize-none"
                  rows="3"
                  value={coffeeDescription}
                  onChange={(e) => setCoffeeDescription(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Salvando..." : "Criar Reserva"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/reservations")}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
