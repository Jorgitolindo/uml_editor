import React from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, PencilIcon, TrashIcon, UserPlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const CanvaList = ({ canvas = [], onEdit, onDelete, onInvite }) => {
  // Si no hay tableros, mostrar mensaje amigable
  if (canvas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <ChartBarIcon  className="h-12 w-12 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tableros disponibles</h3>
        <p className="text-gray-500">Crea tu primer tablero para comenzar</p>
      </div>
    );
  }

  return (
<div className="flex flex-col space-y-6">      {canvas.map((canva) => (
        <div
          key={canva.id}
          className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {canva.description || 'Tablero sin nombre'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Creado por: <span className="text-blue-600">{canva.ownerName || 'Usuario'}</span>
                </p>
                {canva.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(canva.createdAt?.toDate?.()).toLocaleDateString()}
                  </p>
                )}
              </div>

              {canva.isHost && (
                <div className="flex gap-1">
                 <button
  onClick={() => onEdit?.(canva)}
  className="
    flex items-center gap-2
    px-3 py-1.5
    bg-gradient-to-r from-amber-800 to-amber-600
    hover:from-amber-900 hover:to-amber-700
    text-white font-medium
    rounded-full
    shadow-sm hover:shadow-md
    transition transform hover:-translate-y-0.5
  "
  aria-label="Editar tablero"
  title="Editar tablero"
>
  <PencilIcon className="w-5 h-5" />
  <span>Editar</span>
</button>
<button
  onClick={() => onDelete?.(canva.id)}
  className="
    flex items-center gap-2
    px-3 py-1.5
    bg-gradient-to-r from-teal-600 to-teal-400
    hover:from-teal-700 hover:to-teal-500
    text-white font-medium
    rounded-full
    shadow-sm hover:shadow-md
    transition transform hover:-translate-y-0.5
  "
  aria-label="Eliminar tablero"
  title="Eliminar tablero"
>
  <TrashIcon className="w-5 h-5" />
  <span>Del</span>
</button>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
  <Link
    to={`/canvas/${canva.id}`}
    className="
      flex-1 flex items-center justify-center gap-2
      px-6 py-3
      bg-gradient-to-r from-amber-800 to-amber-600
      hover:from-amber-900 hover:to-amber-700
      text-white
      rounded-full
      shadow-lg hover:shadow-2xl
      border-2 border-amber-700      /* borde más grueso */
      transition transform hover:scale-105
    "
  >
    <EyeIcon className="w-5 h-5" />
    <span className="font-medium">Ver Diagrama</span>
  </Link>

  {canva.isHost && (
    <button
      onClick={() => onInvite?.(canva)}
      aria-label="Invitar colaboradores"
      title="Invitar colaboradores"
      className="
        p-3
        bg-amber-100
        text-amber-700
        border-2 border-amber-400   /* borde más marcado */
        rounded-full
        hover:bg-amber-200
        hover:scale-105
        transition
      "
    >
      <UserPlusIcon className="w-5 h-5" />
    </button>
  )}
</div>


          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(CanvaList);
