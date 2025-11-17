import { Link } from "react-router-dom";
import { MdMeetingRoom, MdPlace, MdEventAvailable } from "react-icons/md";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col items-center p-8 relative overflow-hidden">
      {/* Fundo decorativo com círculos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header moderno com mais estilo */}
      <header className="text-center mb-20 z-10 animate-fade-in">
        <div className="mb-6">
          <MdEventAvailable
            size={80}
            className="mx-auto text-indigo-600 mb-4 animate-bounce"
          />
        </div>
        <h1 className="text-6xl font-extrabold text-gray-800 mb-4 drop-shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Sistema de Reserva de Salas
        </h1>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
          Gerencie locais, salas e reservas com praticidade e eficiência com um
          design moderno. Organize seus espaços e eventos de forma intuitiva e
          elegante.
        </p>
      </header>

      {/* Container dos cards com animação stagger */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-6xl w-full px-4 z-10">
        {/* CARD - LOCAIS */}
        <Link
          to="/locations"
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 
                     border border-white/50 hover:-translate-y-3 hover:scale-105 text-center cursor-pointer group
                     animate-slide-up"
          style={{ animationDelay: "0s" }}
        >
          <MdPlace
            size={65}
            className="mx-auto text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300"
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Locais</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Cadastre prédios, andares e ambientes físicos com facilidade.
          </p>
          <div className="mt-6 text-blue-600 font-semibold group-hover:text-blue-800 transition-colors">
            Explorar →
          </div>
        </Link>

        {/* CARD - SALAS */}
        <Link
          to="/rooms"
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 
                     border border-white/50 hover:-translate-y-3 hover:scale-105 text-center cursor-pointer group
                     animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <MdMeetingRoom
            size={65}
            className="mx-auto text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300"
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Salas</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Gerencie salas e suas capacidades de forma eficiente.
          </p>
          <div className="mt-6 text-green-600 font-semibold group-hover:text-green-800 transition-colors">
            Explorar →
          </div>
        </Link>

        {/* CARD - RESERVAS */}
        <Link
          to="/reservations"
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 
                     border border-white/50 hover:-translate-y-3 hover:scale-105 text-center cursor-pointer group
                     animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <MdEventAvailable
            size={65}
            className="mx-auto text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300"
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Reservas</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Agende, visualize e administre as reservas com controle total.
          </p>
          <div className="mt-6 text-purple-600 font-semibold group-hover:text-purple-800 transition-colors">
            Explorar →
          </div>
        </Link>
      </div>

      {/* Footer simples */}
      <footer className="mt-20 text-center text-gray-500 z-10">
        <p className="text-sm">
          © 2025 Sistema de Reserva de Salas. Todos os direitos reservados.
          <br />
          * Backend em PRODUÇÃO <span className="text-red-600 font-bold">OFFLINE</span>,
          dados atuais estão mockados.
        </p>
      </footer>
    </div>
  );
}
