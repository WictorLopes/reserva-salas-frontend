import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function LocationsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLocation() {
      try {
        const { data } = await api.get(`/locations/${id}`);
        setLocation({ name: data.name, description: data.description });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }

    loadLocation();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.put(`/locations/${id}`, location);
      navigate("/locations");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="text-center py-10 text-gray-500">Carregando informações...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition"
          onClick={() => navigate(-1)}
        >
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Editar Local</h1>
      </div>

      {error && <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</p>}

      <div className="max-w-xl bg-white shadow-lg border rounded-xl p-8 mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Nome do Local</label>
            <input
              type="text"
              name="name"
              value={location.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              name="description"
              value={location.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/locations")}
              className="px-5 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
