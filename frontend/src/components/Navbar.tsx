import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary-600">
              MealPrep
            </Link>
            {user && (
              <div className="hidden sm:flex space-x-6">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Inicio
                </Link>
                <Link
                  to="/recipes"
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Recetas
                </Link>
                <Link
                  to="/meal-planner"
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Planificador
                </Link>
                <Link
                  to="/shopping-list"
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Lista de Compras
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-500 hidden sm:inline">
                  {user.name}
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Cerrar Sesion
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="btn-secondary text-sm">
                  Iniciar Sesion
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        {user && (
          <div className="sm:hidden pb-3 flex space-x-4 overflow-x-auto">
            <Link to="/" className="text-sm text-gray-600 whitespace-nowrap">
              Inicio
            </Link>
            <Link to="/recipes" className="text-sm text-gray-600 whitespace-nowrap">
              Recetas
            </Link>
            <Link to="/meal-planner" className="text-sm text-gray-600 whitespace-nowrap">
              Planificador
            </Link>
            <Link to="/shopping-list" className="text-sm text-gray-600 whitespace-nowrap">
              Compras
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
