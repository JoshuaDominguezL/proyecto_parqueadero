import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useOperativo } from '../../hooks/useOperativo';

export const MovimientosView: React.FC = () => {
  const { vehiculos, loading } = useOperativo();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-end gap-6">
        <div className="flex-1 space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Buscar</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Ingresa placa o código"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#39A900]/20 focus:border-[#39A900] outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Fecha inicio</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#39A900]/20 focus:border-[#39A900] outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Fecha fin</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#39A900]/20 focus:border-[#39A900] outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        <button className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-[#003939] rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={16} />
          Filtrar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Placa</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Entrada</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Salida</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Estado</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-500">Operador</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vehiculos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-medium">No se encontraron movimientos</td>
              </tr>
            ) : (
              vehiculos.map((v, i) => (
                <tr key={v.placa + i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-[#003939] tracking-tight">{v.placa}</span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-600 font-medium">{v.horaIngreso}</td>
                  <td className="px-8 py-5 text-sm text-slate-600 font-medium">-</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-[#39A900]/10 text-[#39A900] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#39A900]/20">
                      Activo
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-600 font-medium">Andrés Felipe</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Mostrando 1 a {vehiculos.length} de {vehiculos.length} registros</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-[#39A900] text-white text-[11px] font-black">1</button>
              <button className="w-8 h-8 rounded-lg text-slate-600 text-[11px] font-black hover:bg-slate-50 transition-colors">2</button>
              <button className="w-8 h-8 rounded-lg text-slate-600 text-[11px] font-black hover:bg-slate-50 transition-colors">3</button>
              <button className="w-8 h-8 rounded-lg text-slate-600 text-[11px] font-black hover:bg-slate-50 transition-colors">4</button>
            </div>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
