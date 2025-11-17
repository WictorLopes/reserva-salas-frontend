import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { rooms as mockRooms, locations as mockLocations } from "../../mocks/mockData";

export default function RoomsCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    capacity: "",
    locationId: "",
  });

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLocations() {
      try {
        const res = await api.get("/locations");
        setLocations(res.data);
      } catch {
        console.warn("API offline, usando locais mockados");
        setLocations(mockLocations);
      }
    }

    loadLocations();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name || !form.capacity || !form.locationId) {
      setError("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/rooms", {
        ...form,
        capacity: Number(form.capacity),
        locationId: Number(form.locationId),
      });
      navigate("/rooms");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.warn("API offline, salvando apenas no mock");
      try {
        const newId = mockRooms.length
          ? Math.max(...mockRooms.map((r) => r.id)) + 1
          : 1;

        const locationName =
          mockLocations.find((loc) => loc.id === Number(form.locationId))?.name ||
          "-";

        mockRooms.push({
          id: newId,
          name: form.name,
          capacity: Number(form.capacity),
          locationId: Number(form.locationId),
          locationName,
        });

        navigate("/rooms");
      } catch {
        setError("Não foi possível salvar no mock.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Nova Sala</h1>

        {error && (
          <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Nome da Sala</label>
            <input
              type="text"
              name="name"
              placeholder="Ex: Sala 101"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Capacidade</label>
            <input
              type="number"
              name="capacity"
              placeholder="Ex: 25"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              value={form.capacity}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Local</label>
            <select
              name="locationId"
              value={form.locationId}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              required
            >
              <option value="">Selecione um local...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Salvando..." : "Cadastrar Sala"}
          </button>
        </form>

        <button
          onClick={() => navigate("/rooms")}
          className="mt-6 w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
