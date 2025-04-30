// src/components/navbar/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser]         = useState(null);
  const location                = useLocation();
  const navigate                = useNavigate();

  useEffect(() => {
    const auth  = getAuth();
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isCanvasPage = /^\/canvas\/[^/]+$/.test(location.pathname);
  if (isCanvasPage) return null;

  const handleLogout = async () => {
    await signOut(getAuth()).catch(console.error);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`
      fixed w-full z-50 transition-all duration-300
      ${scrolled
        ? 'bg-gradient-to-r from-amber-800 to-amber-600 shadow-lg'
        : 'bg-gradient-to-r from-amber-700/95 to-amber-500/95 backdrop-blur-md'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-white text-2xl font-bold tracking-tight transition-transform duration-300 hover:scale-105 flex items-center"
            >
              {/* … SVG … */}
              Organiza tus Diagramas
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`
                px-5 py-2 rounded-full text-white font-medium transition-colors duration-200
                ${isActive('/')
                  ? 'bg-white/30 shadow-inner'
                  : 'bg-white/10 hover:bg-white/20'
                }
              `}
            >
              Inicio
            </Link>

            {user && (
              <Link
                to="/canvas"
                className={`
                  px-5 py-2 rounded-full text-white font-medium transition-colors duration-200
                  ${isActive('/canvas')
                    ? 'bg-white/30 shadow-inner'
                    : 'bg-white/10 hover:bg-white/20'
                  }
                `}
              >
                Mis Diagrams
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="
                  ml-2 px-5 py-2 rounded-full bg-red-500 text-white font-medium
                  shadow-md hover:bg-red-600 transition-colors duration-200
                "
              >
                Cerrar Sesión
              </button>
            ) : (
              <Link
                to="/login"
                className="
                  ml-2 px-5 py-2 rounded-full bg-white text-teal-600 font-medium
                  shadow-md hover:bg-gray-100 transition-colors duration-200
                "
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              {isOpen
                ? <svg className="h-6 w-6" />
                : <svg className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`
        md:hidden overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="
          px-3 pt-2 pb-3 space-y-2
          // **MOBILE: DEGRADADO TEAL→VERDE**
          bg-gradient-to-b from-teal-600/90 to-green-700/90
          backdrop-blur-md shadow-lg
        ">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`
              block px-5 py-2 rounded-full text-white font-medium transition-colors duration-200
              ${isActive('/')
                ? 'bg-white/30'
                : 'bg-white/10 hover:bg-white/20'
              }
            `}
          >
            Inicio
          </Link>

          {user && (
            <Link
              to="/canvas"
              onClick={() => setIsOpen(false)}
              className={`
                block px-5 py-2 rounded-full text-white font-medium transition-colors duration-200
                ${isActive('/canvas')
                  ? 'bg-white/30'
                  : 'bg-white/10 hover:bg-white/20'
                }
              `}
            >
              Mis Diagrams
            </Link>
          )}

          {user ? (
            <button
              onClick={() => { handleLogout(); setIsOpen(false) }}
              className="
                w-full text-left px-5 py-2 rounded-full bg-red-500 text-white font-medium
                shadow-md hover:bg-red-600 transition-colors duration-200
              "
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="
                block px-5 py-2 rounded-full bg-white text-teal-600 font-medium
                shadow-md hover:bg-gray-100 transition-colors duration-200
              "
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
