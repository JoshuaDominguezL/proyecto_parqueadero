import React, { useMemo } from 'react';
import { useOperativo } from '../../hooks/useOperativo';
import { RefreshCw, WifiOff, Car, CheckCircle2, AlertCircle } from 'lucide-react';

export const EstadoBahiasView: React.FC = () => {
  const { bahias, loading, refresh } = useOperativo();

  const stats = useMemo(() => {
    return {
      libres: bahias.filter(b => !b.ocupada && !b.fueraServicio).length,
      ocupadas: bahias.filter(b => b.ocupada && !b.fueraServicio).length,
      offline: bahias.filter(b => b.fueraServicio).length,
      total: bahias.length
    };
  }, [bahias]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-[#39B000]/20 border-t-[#39B000] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Resumen de Bahías Superior - Más limpio */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Libres" value={stats.libres} icon={<CheckCircle2 size={16} />} color="text-[#39B000]" bg="bg-green-50 dark:bg-[#39B000]/10" />
        <StatCard label="Ocupadas" value={stats.ocupadas} icon={<Car size={16} />} color="text-red-600 dark:text-red-400" bg="bg-red-50 dark:bg-red-900/20" />
        <StatCard label="Offline" value={stats.offline} icon={<WifiOff size={16} />} color="text-gray-400 dark:text-gray-500" bg="bg-gray-50 dark:bg-white/5" />
        
        <button 
          onClick={refresh}
          className="flex items-center justify-center gap-2 bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 text-[#012E25] dark:text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm active:scale-95 group"
        >
          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          Refrescar
        </button>
      </div>

      {/* Grid de Bahías - Compacto y agradable (Sin escudos) */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-6 lg:p-8 transition-colors duration-300">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
          {bahias.map((b) => (
            <div
              key={b.idBahia}
              className={`
                aspect-square rounded-lg border flex flex-col items-center justify-center text-center 
                transition-all duration-200 hover:shadow-sm cursor-default relative group
                ${b.fueraServicio
                  ? 'border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-gray-300 dark:text-gray-600'
                  : b.ocupada
                    ? 'border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'border-green-100 dark:border-[#39B000]/20 bg-green-50/30 dark:bg-[#39B000]/10 text-[#39B000]'}
              `}
            >
              <span className="text-[10px] font-black absolute top-1 left-1 opacity-20">{b.idBahia}</span>
              
              {b.fueraServicio ? (
                <AlertCircle size={14} className="opacity-30" />
              ) : b.ocupada ? (
                <div className="flex flex-col items-center">
                  <Car size={18} className="mb-1" />
                  {b.placa && (
                    <span className="text-[7px] font-bold bg-white dark:bg-[#012E25] border border-red-100 dark:border-red-900/30 px-1 rounded shadow-sm truncate max-w-full">
                      {b.placa}
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
              )}

              {/* Tooltip simple en hover */}
              {!b.fueraServicio && !b.ocupada && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-green-500/10 rounded-lg">
                   <span className="text-[8px] font-black uppercase">LIBRE</span>
                </div>
              )}
            </div>
          ))}
        </div>
         
        <div className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#39B000] animate-pulse" />
            Sincronización en vivo
          </div>
          <p>Total de plazas: {stats.total}</p>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string; bg: string }> = ({ label, value, icon, color, bg }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#121212] shadow-sm transition-colors duration-300`}>
    <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className={`text-base font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

