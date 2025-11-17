import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { mockApi } from "../../mocks/mockApi";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";

export default function LocationsList() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadLocations() {
      try {
        const { data } = await api.get("/locations");
        setLocations(data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        console.warn("API offline, usando dados mockados");
        try {
          const { data } = await mockApi.get("/locations");
          setLocations(data);
        // eslint-disable-next-line no-unused-vars
        } catch (mockErr) {
          setError("Erro ao carregar os dados");
        }
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  const filtered = locations.filter((loc) =>
    loc.name.toLowerCase().includes(search.toLowerCase())
  );

  // Exclusão de local (tenta backend, se falhar remove do mock)
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este local?")) return;

    try {
      await api.delete(`/locations/${id}`);
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    } catch {
      // remove do mock se API offline
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
      console.warn("Exclusão feita apenas nos mocks");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Carregando...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Cabeçalho padronizado com gradiente e ícone */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-4xl text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Locais Cadastrados
              </h1>
              <p className="text-gray-600 mt-1">
                {locations.length} {locations.length === 1 ? "local" : "locais"}{" "}
                cadastrados
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              className="bg-gray-200 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center gap-2 shadow-md"
              onClick={() => navigate("/")}
            >
              <FaArrowLeft /> Voltar
            </button>
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-md"
              onClick={() => navigate("/locations/create")}
            >
              <FaPlus /> Novo Local
            </button>
          </div>
        </div>

        {/* Busca com ícone */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md p-4 pl-12 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 outline-none shadow-md bg-white"
          />
        </div>
      </div>

      {/* Erro com melhor styling */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <p className="text-red-600 bg-red-100 border border-red-300 p-4 rounded-xl shadow-md">
            {error}
          </p>
        </div>
      )}

      {/* Tabela melhorada com hover e animações */}
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b">
            <tr>
              <th className="p-6 font-semibold text-gray-700">Nome</th>
              <th className="p-6 font-semibold text-gray-700">Descrição</th>
              <th className="p-6 font-semibold text-gray-700 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((loc, index) => (
                <tr
                  key={loc.id}
                  className={`border-b hover:bg-blue-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-6 font-medium text-gray-800">{loc.name}</td>
                  <td className="p-6 text-gray-600">{loc.description}</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100"
                        onClick={() => navigate(`/locations/edit/${loc.id}`)}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-100"
                        onClick={() => handleDelete(loc.id)}
                      >
                        <FaTrash /> Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center p-12 text-gray-500 italic bg-gray-50"
                >
                  Nenhum local encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
