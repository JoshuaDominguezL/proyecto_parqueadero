import React, { useState } from 'react';
import { AlertTriangle, Info, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOperativo } from '../../hooks/useOperativo';

export const AlertasView: React.FC = () => {
  const { alerts, loading } = useOperativo();
  const [activeTab, setActiveTab] = useState('todas');

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-3">
        <TabButton 
          active={activeTab === 'todas'} 
          onClick={() => setActiveTab('todas')} 
          label="Todas" 
          color="bg-[#39A900]" 
        />
        <TabButton 
          active={activeTab === 'criticas'} 
          onClick={() => setActiveTab('criticas')} 
          label="Críticas" 
          color="bg-red-500" 
        />
        <TabButton 
          active={activeTab === 'advertencias'} 
          onClick={() => setActiveTab('advertencias')} 
          label="Advertencias" 
          color="bg-orange-500" 
        />
        <TabButton 
          active={activeTab === 'informativas'} 
          onClick={() => setActiveTab('informativas')} 
          label="Informativas" 
          color="bg-blue-500" 
        />
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <Info className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No hay alertas activas en este momento</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-slate-300 transition-all">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                alert.tipo?.includes('ERROR') || alert.tipo?.includes('CRITICA') 
                  ? 'bg-red-50 text-red-500' 
                  : alert.tipo?.includes('ALERTA') 
                    ? 'bg-orange-50 text-orange-500' 
                    : 'bg-blue-50 text-blue-500'
              }`}>
                {alert.tipo?.includes('ERROR') || alert.tipo?.includes('CRITICA') ? <ShieldAlert size={24} /> : 
                 alert.tipo?.includes('ALERTA') ? <AlertTriangle size={24} /> : <Info size={24} />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-[#003939]">{alert.tipo || 'Sistema'}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">{new Date(alert.fecha || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <p className="mt-1 text-sm text-slate-600 font-medium">{alert.mensaje}</p>
              </div>

              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                alert.tipo?.includes('ERROR') || alert.tipo?.includes('CRITICA') 
                  ? 'bg-red-100 text-red-600' 
                  : alert.tipo?.includes('ALERTA') 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-blue-100 text-blue-600'
              }`}>
                {alert.tipo?.includes('ERROR') || alert.tipo?.includes('CRITICA') ? 'Crítica' : 
                 alert.tipo?.includes('ALERTA') ? 'Advertencia' : 'Informativa'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between px-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Mostrando 1 a {alerts.length} de {alerts.length} alertas</p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white transition-all disabled:opacity-50">
            <ChevronLeft size={20} />
          </button>
          <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; color: string }> = ({ active, onClick, label, color }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${
      active 
        ? `${color} text-white border-transparent shadow-lg shadow-black/5` 
        : `bg-white text-slate-500 border-slate-200 hover:bg-slate-50`
    }`}
  >
    {label}
  </button>
);
