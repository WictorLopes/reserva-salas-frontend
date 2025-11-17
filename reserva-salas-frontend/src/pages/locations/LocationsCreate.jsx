import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { locations as mockLocations } from "../../mocks/mockData";

export default function LocationsCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("O nome do local é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/locations", { name, description });
      navigate("/locations");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.warn("API offline, salvando apenas no mock");
      try {
        // Gerar ID sequencial para o mock
        const newId = mockLocations.length
          ? Math.max(...mockLocations.map((l) => l.id)) + 1
          : 1;

        mockLocations.push({ id: newId, name, description });
        navigate("/locations");
      } catch {
        setError("Não foi possível salvar no mock.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Novo Local</h1>

        {error && <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nome do Local <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Campus Norte, Prédio A..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Descrição (opcional)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none h-28 resize-none"
              placeholder="Descrição sobre o local..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/locations")}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              {loading ? "Salvando..." : "Salvar Local"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
