import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function ReservationsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedRoomCapacity, setSelectedRoomCapacity] = useState(null);
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [responsible, setResponsible] = useState("");
  const [coffeeRequested, setCoffeeRequested] = useState(false);
  const [coffeeQuantity, setCoffeeQuantity] = useState("");
  const [coffeeDescription, setCoffeeDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Carregar locations e rooms
  useEffect(() => {
    async function loadData() {
      try {
        const [locationsRes, roomsRes] = await Promise.all([
          api.get("/locations"),
          api.get("/rooms"),
        ]);
        setLocations(locationsRes.data);
        setRooms(roomsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
    loadData();
  }, []);

  // Carregar dados da reserva
  useEffect(() => {
    async function loadReservation() {
      try {
        const { data } = await api.get(`/reservations/${id}`);
        setSelectedLocation(data.locationId);
        setSelectedRoom(data.roomId);
        setSelectedRoomCapacity(
          rooms.find((r) => r.id === data.roomId)?.capacity ?? null
        );
        const start = new Date(data.start);
        const end = new Date(data.end);
        setDate(start.toISOString().split("T")[0]);
        setTimeStart(start.toTimeString().slice(0, 5));
        setTimeEnd(end.toTimeString().slice(0, 5));
        setResponsible(data.responsible);
        setCoffeeRequested(data.coffeeRequested);
        setCoffeeQuantity(data.coffeeQuantity ?? "");
        setCoffeeDescription(data.coffeeDescription ?? "");
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    loadReservation();
  }, [id, rooms]);

  // Atualizar capacidade ao selecionar sala
  useEffect(() => {
    const room = rooms.find((r) => r.id === Number(selectedRoom));
    setSelectedRoomCapacity(room ? room.capacity : null);
  }, [selectedRoom, rooms]);

  const filteredRooms = rooms.filter(
    (room) => String(room.locationId) === String(selectedLocation)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedLocation || !selectedRoom || !date || !timeStart || !timeEnd || !responsible) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const startISO = new Date(`${date}T${timeStart}`).toISOString();
    const endISO = new Date(`${date}T${timeEnd}`).toISOString();

    try {
      await api.put(`/reservations/${id}`, {
        locationId: selectedLocation,
        roomId: selectedRoom,
        start: startISO,
        end: endISO,
        responsible,
        coffeeRequested,
        coffeeQuantity: coffeeQuantity || null,
        coffeeDescription: coffeeDescription || null,
      });
      navigate("/reservations");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p className="text-center py-10">Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Reserva</h1>

        {error && (
          <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Local */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Local</label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Selecione um local...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* Sala */}
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
          </div>

          {selectedRoomCapacity && (
            <p className="text-gray-600">
              Capacidade da sala selecionada: <strong>{selectedRoomCapacity}</strong>
            </p>
          )}

          {/* Data e horários */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Data</label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Início</label>
              <input
                type="time"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Fim</label>
              <input
                type="time"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
              />
            </div>
          </div>

          {/* Responsável */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Responsável</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
            />
          </div>

          {/* Café */}
          <div>
            <label className="flex items-center gap-2">
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
                  className="w-full p-2 border rounded-lg"
                  value={coffeeDescription}
                  onChange={(e) => setCoffeeDescription(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Salvando..." : "Atualizar Reserva"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/reservations")}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
