import React from 'react';
import { useOperativo } from '../../hooks/useOperativo';
import { RefreshCw } from 'lucide-react';

export const EstadoBahiasView: React.FC = () => {
  const { bahias, loading, refresh } = useOperativo();

  if (loading) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-600 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <LegendDot color="bg-[#39A900]" label="Libre" />
          <LegendDot color="bg-[#D32F2F]" label="Ocupada" />
          <LegendDot color="bg-slate-300" label="Offline" />
        </div>
        
        <button 
          onClick={refresh}
          className="flex items-center gap-2 px-6 py-3 bg-[#003939] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#003939]/10"
        >
          <RefreshCw size={16} />
          Actualizar en tiempo real
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {bahias.map((b) => (
            <div
              key={b.idBahia}
              className={[
                'aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105',
                b.fueraServicio
                  ? 'border-slate-100 bg-slate-50 text-slate-300'
                  : b.ocupada
                    ? 'border-[#D32F2F]/20 bg-[#D32F2F]/5 text-[#D32F2F]'
                    : 'border-[#39A900]/20 bg-[#39A900]/5 text-[#39A900]',
              ].join(' ')}
            >
              <p className="text-xl font-black">{String(b.idBahia).padStart(2, '0')}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest opacity-60">
                {b.fueraServicio ? 'Offline' : b.ocupada ? 'Ocupada' : 'Libre'}
              </p>
              {b.ocupada && b.placa && (
                <p className="mt-2 px-3 py-1 bg-white rounded-lg text-[11px] font-black shadow-sm border border-[#D32F2F]/10">
                  {b.placa}
                </p>
              )}
            </div>
          ))}
        </div>
         
        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
          <RefreshCw size={14} className="animate-spin" />
          <p className="text-[11px] font-bold uppercase tracking-widest">Actualización en tiempo real cada 5 segundos</p>
        </div>
      </div>
    </div>
  );
};

const LegendDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <span className="inline-flex items-center gap-2">
    <span className={`w-3 h-3 rounded-full ${color}`} />
    <span>{label}</span>
  </span>
);
