import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function RoomsEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoom() {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        setName(data.name);
        setCapacity(data.capacity);
        setLocationId(data.locationId);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    loadRoom();
  }, [id]);

  useEffect(() => {
    async function loadLocations() {
      try {
        const { data } = await api.get("/locations");
        setLocations(data);
      } catch (err) {
        console.log("Erro ao carregar locais:", err);
      }
    }
    loadLocations();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !capacity || !locationId) return alert("Preencha todos os campos!");

    try {
      await api.put(`/rooms/${id}`, {
        name,
        capacity: Number(capacity),
        locationId: Number(locationId),
      });
      alert("Sala atualizada com sucesso!");
      navigate("/rooms/list");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  if (loading) return <p className="text-center text-lg text-gray-600 py-10">Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl max-w-xl w-full p-8 border">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Editar Sala
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nome */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nome da Sala
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Capacidade */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Capacidade
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>

          {/* Local */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Local (Prédio / Campus)
            </label>
            <select
              className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
            >
              <option value="">Selecione um local...</option>

              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botões */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/rooms")}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg 
                         hover:bg-gray-400 transition"
            >
              Voltar
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg 
                         hover:bg-blue-700 transition"
            >
              Salvar Alterações
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
