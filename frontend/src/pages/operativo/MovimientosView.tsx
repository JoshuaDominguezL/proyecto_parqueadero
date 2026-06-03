import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, User, Clock } from 'lucide-react';
import { useOperativo } from '../../hooks/useOperativo';
import { useTheme } from '../../contexts/ThemeContext';

export const MovimientosView: React.FC = () => {
  const { movimientos, loading, refresh } = useOperativo();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-[#39B000]/20 border-t-[#39B000] rounded-full animate-spin" />
    </div>
  );

  const filteredMovimientos = movimientos.filter(m => 
    m.vehiculo?.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.usuario?.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Filtros Compactos */}
      <div className="bg-white dark:bg-[#121212] p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-end gap-4 transition-colors duration-300">
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Búsqueda de Registros</label>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 group-focus-within:text-[#39B000] transition-colors" size={16} />
            <input
              type="text"
              placeholder="Placa o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-lg focus:bg-white dark:focus:bg-white/10 focus:border-[#39B000] outline-none transition-all text-xs font-bold text-[#012E25] dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Desde</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-lg focus:bg-white dark:focus:bg-white/10 focus:border-[#39B000] outline-none transition-all text-[11px] font-bold text-[#012E25] dark:text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Hasta</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-lg focus:bg-white dark:focus:bg-white/10 focus:border-[#39B000] outline-none transition-all text-[11px] font-bold text-[#012E25] dark:text-white"
            />
          </div>
        </div>

        <button 
          onClick={() => refresh()}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#012E25] dark:bg-[#39B000] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-black dark:hover:bg-[#007832] transition-all shadow-sm active:scale-95 group"
        >
          <Filter size={14} className={isDark ? 'text-white' : 'text-[#39B000]'} />
          <span>Filtrar</span>
        </button>
      </div>

      {/* Tabla Administrativa */}
      <div className="bg-white dark:bg-[#121212] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Usuario</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Vehículo</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Cronología</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filteredMovimientos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <p className="text-[10px] font-bold text-gray-300 dark:text-gray-700 uppercase tracking-widest">Sin resultados</p>
                  </td>
                </tr>
              ) : (
                filteredMovimientos.map((m, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold text-[10px] group-hover:bg-[#39B000] group-hover:text-white transition-all">
                          {m.usuario?.nombreCompleto?.charAt(0) || <User size={14} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#012E25] dark:text-white text-xs">
                            {m.usuario?.nombreCompleto || '---'}
                          </span>
                          <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase">
                            {m.usuario?.numDocumento || '---'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#012E25] dark:text-white text-xs tracking-widest">{m.vehiculo?.placa || '---'}</span>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase">
                          {m.vehiculo?.marca}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Clock size={10} className="text-[#39B000]" />
                          <span className="font-bold text-[#012E25] dark:text-white text-[10px]">
                            {m.fechaIngreso ? new Date(m.fechaIngreso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                          </span>
                        </div>
                        {m.fechaSalida && (
                          <div className="flex items-center gap-2">
                            <Clock size={10} className="text-gray-300 dark:text-gray-600" />
                            <span className="font-bold text-gray-400 dark:text-gray-500 text-[10px]">
                              {new Date(m.fechaSalida).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`
                        inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-[9px] font-bold uppercase tracking-widest
                        ${m.estado?.toUpperCase() === 'ACTIVO' 
                          ? 'bg-green-50 dark:bg-[#39B000]/10 text-[#39B000] border-green-100 dark:border-[#39B000]/20' 
                          : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5'}
                      `}>
                        <span className={`w-1 h-1 rounded-full ${m.estado?.toUpperCase() === 'ACTIVO' ? 'bg-[#39B000] animate-pulse' : 'bg-gray-400'}`} />
                        {m.estado?.toUpperCase() === 'ACTIVO' ? 'Interno' : 'Completado'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación Compacta */}
        <div className="px-6 py-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between bg-gray-50/30 dark:bg-white/5">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            {filteredMovimientos.length} registros
          </p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md border border-gray-100 dark:border-white/5 bg-white dark:bg-[#121212] text-gray-400 hover:text-[#012E25] dark:hover:text-white transition-all disabled:opacity-30">
              <ChevronLeft size={14} />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 rounded-md bg-[#39B000] text-white text-[9px] font-bold">1</button>
              <button className="w-6 h-6 rounded-md bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 text-gray-400 text-[9px] font-bold hover:border-[#39B000]">2</button>
            </div>
            <button className="p-1.5 rounded-md border border-gray-100 dark:border-white/5 bg-white dark:bg-[#121212] text-gray-400 hover:text-[#012E25] dark:hover:text-white transition-all">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

