import { ArrowRightIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 px-4">
      <div className="w-full max-w-6xl bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-2xl p-16">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Texto */}
          <div className="flex-1 space-y-6">
            <h1 className="text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
              Welcome
            </h1>
            <p className="text-xl text-gray-800">
              Desata tu creatividad y crea el diagrama perfecto para compartir tus ideas.
            </p>
            <Link
              to="/canvas"
              className="
                inline-flex items-center gap-3
                px-10 py-4
                bg-gradient-to-r from-amber-800 to-amber-600
                hover:from-amber-900 hover:to-amber-700
                text-white text-lg font-semibold
                rounded-full
                shadow-lg
                transition transform hover:scale-105
              "
            >
              Empezar
              <ArrowRightIcon className="h-6 w-6" />
            </Link>
          </div>

          {/* Imagen / placeholder */}
          <div className="flex-1">
            {/* Aquí podrías poner una ilustración */}
            <div className="w-full h-80 bg-amber-200 rounded-2xl shadow-inner animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
