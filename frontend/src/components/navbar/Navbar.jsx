import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Manejo de autenticación
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Efecto de scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Verificar si estamos en la ruta /canvas/:canvaId
  const isCanvasPage = /^\/canvas\/[^/]+$/.test(location.pathname);

  // Si estamos en la página del canvas, no renderizar el navbar
  if (isCanvasPage) {
    return null;
  }

  // Manejo de logout
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Verificar si el enlace está activo
  const isActive = (path) => {
    return location.pathname === path;
  };
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' : 'bg-gradient-to-r from-blue-500/95 to-indigo-500/95 backdrop-blur-md'
    }`}>
      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to="/"
              className="text-white text-2xl font-bold tracking-tight transition-all duration-300 hover:scale-105 flex items-center"
            >
              <svg className="h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="12" y1="8" x2="12" y2="16" />
              </svg>
              mini Figma Pro
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                isActive('/') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'
              }`}
            >
              Inicio
            </Link>

            {user && (
              <Link
                to="/canvas"
                className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                  isActive('/canvas') ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'
                }`}
              >
                Mis Diagrams
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="ml-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Cerrar Sesión
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-2 bg-white text-indigo-600 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-3 pt-2 pb-3 space-y-2 bg-gradient-to-b from-indigo-600/90 to-blue-700/90 backdrop-blur-md shadow-lg">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
              isActive('/') ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            Inicio
          </Link>

          {user && (
            <Link
              to="/canvas"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
                isActive('/canvas') ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              Mis Diagramas
            </Link>
          )}

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium shadow-md transition-all duration-200"
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg bg-white text-indigo-600 hover:bg-gray-50 font-medium shadow-md transition-all duration-200"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
