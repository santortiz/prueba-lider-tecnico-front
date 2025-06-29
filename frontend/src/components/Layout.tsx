import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/session";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const showNav = !["/"].includes(location.pathname); // Oculta barra en login si prefieres

  return (
    <div className="min-h-screen bg-gray-100">
      {showNav && (
        <nav className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">🍽️ Reservas Restaurante</h1>
          <div className="space-x-4">
            <Link to="/reservation" className="text-blue-600 hover:underline">
              Cliente
            </Link>
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              Mesero
            </Link>
            {isLoggedIn() && (
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </nav>
      )}

      <main className="p-4">{children}</main>
    </div>
  );
}
