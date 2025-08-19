import { useState } from "react";
import { ScrollText } from 'lucide-react';

const HistoryView = ({ changeView  }) => {
  // Datos de ejemplo (debes reemplazarlos con fuente real de datos o store global)
  const historial = [
    {
      fecha: '2025-07-31',
      hora: '10:32',
      tipoLimpieza: 'general',
      bloque: 'Bloque 3',
      tipoLugar: 'Baños',
      lugar: 'Baño mujeres - piso 2',
      reposicion: {
        papel: true,
        toalla: false,
        jabon: true,
      },
      observaciones: 'Basurero lleno y piso mojado al inicio.',
    },
    {
      fecha: '2025-07-30',
      hora: '15:05',
      tipoLimpieza: 'desinfección',
      bloque: 'Bloque 2',
      tipoLugar: 'Aulas',
      lugar: 'Aula 205',
      reposicion: {
        papel: false,
        toalla: false,
        jabon: false,
      },
      observaciones: '',
    },
  ];

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
  const hasReposicion = (repo) => repo.papel || repo.toalla || repo.jabon;

  const handleBackClick = () => {
    if (changeView ) {
      changeView ('menu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <ScrollText className="w-8 h-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-800">Historial de registros</h1>
          </div>
          <button 
            onClick={handleBackClick}
            className="text-blue-600 hover:underline"
          >
            ← Volver
          </button>
        </div>

        <ul className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
          {historial.map((item, index) => (
            <li
              key={index}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200 bg-white"
            >
              <p className="text-sm text-gray-600 mb-1">
                📅 {item.fecha} - 🕒 {item.hora}
              </p>
              <p className="font-semibold text-gray-800">
                🧹 Tipo de limpieza: {capitalize(item.tipoLimpieza)}
              </p>
              <p className="text-sm text-gray-700">
                📍 Zona: {item.bloque} &gt; {item.tipoLugar} &gt; {item.lugar}
              </p>

              {hasReposicion(item.reposicion) && (
                <div className="mt-1 text-sm text-gray-700">
                  📦 Reposición:
                  {item.reposicion.papel && <span>Papel</span>}
                  {item.reposicion.toalla && <span> | Toalla</span>}
                  {item.reposicion.jabon && <span> | Jabón</span>}
                </div>
              )}

              {item.observaciones && (
                <p className="text-sm text-gray-500 italic mt-1">
                  🗒 {item.observaciones}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistoryView;