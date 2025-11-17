import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { mockApi } from "../../mocks/mockApi";
import {
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";

export default function ReservationsList() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadReservations() {
      try {
        const { data } = await api.get("/reservations");
        setReservations(data);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        console.warn("API offline, usando dados mockados");
        try {
          const { data } = await mockApi.get("/reservations");
          setReservations(data);
          // eslint-disable-next-line no-unused-vars
        } catch (mockErr) {
          setError("Erro ao carregar os dados");
        }
      } finally {
        setLoading(false);
      }
    }

    loadReservations();
  }, []);

  // Exclusão de reserva (tenta backend, se falhar remove do mock)
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta reserva?")) return;

    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((res) => res.id !== id));
    } catch {
      setReservations((prev) => prev.filter((res) => res.id !== id));
      console.warn("Exclusão feita apenas nos mocks");
    }
  };

  // Filtro por responsável
  const filtered = reservations.filter((res) =>
    res.responsible.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="ml-4 text-gray-600">Carregando...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      {/* Cabeçalho */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <FaCalendarAlt className="text-4xl text-purple-600" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Reservas Cadastradas
              </h1>
              <p className="text-gray-600 mt-1">
                {reservations.length}{" "}
                {reservations.length === 1 ? "reserva" : "reservas"} cadastradas
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
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center gap-2 shadow-md"
              onClick={() => navigate("/reservations/create")}
            >
              <FaPlus /> Nova Reserva
            </button>
          </div>
        </div>

        {/* Busca */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por responsável..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md p-4 pl-12 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-300 outline-none shadow-md bg-white"
          />
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <p className="text-red-600 bg-red-100 border border-red-300 p-4 rounded-xl shadow-md">
            {error}
          </p>
        </div>
      )}

      {/* Tabela */}
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b">
            <tr>
              <th className="p-6 font-semibold text-gray-700">Local</th>
              <th className="p-6 font-semibold text-gray-700">Sala</th>
              <th className="p-6 font-semibold text-gray-700">Responsável</th>
              <th className="p-6 font-semibold text-gray-700">Início</th>
              <th className="p-6 font-semibold text-gray-700">Fim</th>
              <th className="p-6 font-semibold text-gray-700">Café?</th>
              <th className="p-6 font-semibold text-gray-700">Qtd</th>
              <th className="p-6 font-semibold text-gray-700">Descrição</th>
              <th className="p-6 font-semibold text-gray-700 text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((res, index) => (
                <tr
                  key={res.id}
                  className={`border-b hover:bg-purple-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-6 text-gray-600">
                    {res.locationName ?? "-"}
                  </td>
                  <td className="p-6 text-gray-600">{res.roomName ?? "-"}</td>
                  <td className="p-6 text-gray-600">{res.responsible}</td>
                  <td className="p-6 text-gray-600">
                    {new Date(res.start).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="p-6 text-gray-600">
                    {new Date(res.end).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="p-6 text-center">
                    {res.coffeeRequested ? "Sim" : "Não"}
                  </td>
                  <td className="p-6 text-center">
                    {res.coffeeQuantity ?? "-"}
                  </td>
                  <td className="p-6">{res.coffeeDescription ?? "-"}</td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => navigate(`/reservations/edit/${res.id}`)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200 flex items-center gap-2 shadow-md"
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center gap-2 shadow-md"
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
                  colSpan="10"
                  className="text-center p-12 text-gray-500 italic bg-gray-50"
                >
                  Nenhuma reserva encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
