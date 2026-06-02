import React, { useMemo, useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { useOperativo } from '../../hooks/useOperativo';
import { useNotification } from '../../contexts/NotificationContext';
import { MovementForm } from '../../components/MovementForm';

export const ControlAccesoView: React.FC = () => {
  const { stats, alerts, loading, refresh } = useOperativo();
  const { showNotification } = useNotification();
  const [recent, setRecent] = useState<Array<{ id: string; tipo: 'SUCCESS' | 'ERROR'; mensaje: string; fecha: Date }>>([]);

  const estadoGlobal = useMemo(() => {
    const tipos = alerts.map(a => String(a.tipo || '').toUpperCase());
    if (tipos.some(t => t.includes('PARQUEADERO_DESHABILITADO'))) return 'DESHABILITADO';
    if (tipos.some(t => t.includes('PARQUEADERO_LLENO'))) return 'LLENO';
    if (tipos.some(t => t.includes('UMBRAL_80'))) return 'ALERTA_80';
    if (stats.total > 0 && stats.disponibles === 0) return 'LLENO';
    return 'DISPONIBLE';
  }, [alerts, stats.disponibles, stats.total]);

  const estadoStyle = useMemo(() => {
    if (estadoGlobal === 'DESHABILITADO') return { bg: 'bg-[#D32F2F]', label: 'DESHABILITADO', sub: 'Bloqueo total de ingresos', ring: 'ring-[#D32F2F]/25' };
    if (estadoGlobal === 'LLENO') return { bg: 'bg-[#FF6B00]', label: 'LLENO', sub: 'Cupos agotados (100%)', ring: 'ring-[#FF6B00]/25' };
    if (estadoGlobal === 'ALERTA_80') return { bg: 'bg-[#FF6B00]', label: 'ALERTA 80%', sub: 'Ocupación alta', ring: 'ring-[#FF6B00]/25' };
    return { bg: 'bg-[#39A900]', label: 'DISPONIBLE', sub: 'Ingreso permitido', ring: 'ring-[#39A900]/25' };
  }, [estadoGlobal]);

  const pushRecent = (tipo: 'SUCCESS' | 'ERROR', mensaje: string) => {
    setRecent((prev) => [{ id: `${Date.now()}-${Math.random()}`, tipo, mensaje, fecha: new Date() }, ...prev].slice(0, 5));
  };

  if (loading) return null;

  return (
    <div className="space-y-8">
      {/* Estado del Parqueadero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-full ${estadoStyle.bg} text-white flex items-center justify-center shadow-lg shadow-black/5`}>
              {estadoGlobal === 'DESHABILITADO' ? <ShieldAlert size={40} /> : <AlertTriangle size={40} />}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">Estado del Parqueadero</p>
              <div className="flex items-center gap-3 mt-1">
                <div className={`w-3 h-3 rounded-full ${estadoStyle.bg} animate-pulse`} />
                <p className="text-4xl font-black text-[#003939] tracking-tight">{estadoStyle.label}</p>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-500">{estadoStyle.sub}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:min-w-[500px]">
            <Kpi label="Total" value={stats.total} />
            <Kpi label="Ocupados" value={stats.ocupados} />
            <Kpi label="Libres" value={stats.disponibles} highlight />
            <Kpi label="Ocupación" value={`${Math.round((stats.ocupados / (stats.total || 1)) * 100)}%`} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario de Acceso */}
        <div className="lg:col-span-8">
          <MovementForm
            onSuccess={(msg) => { showNotification(msg, 'success'); pushRecent('SUCCESS', msg); refresh(); }}
            onError={(msg) => { showNotification(msg, 'error'); pushRecent('ERROR', msg); }}
          />
        </div>

        {/* Acciones de Contingencia / Emergencia */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Protocolos</p>
              <p className="mt-1 text-lg font-black text-[#003939]">Contingencia</p>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors text-left group">
                <div>
                  <p className="text-sm font-black text-[#003939]">Registro Manual (Contingencia)</p>
                  <p className="text-[11px] font-bold text-slate-500">Registrar entrada o salida sin código</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                  <span className="text-slate-400">→</span>
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-red-100 bg-red-50/30 hover:bg-red-50 transition-colors text-left group">
                <div>
                  <p className="text-sm font-black text-red-600">Protocolo de Emergencia</p>
                  <p className="text-[11px] font-bold text-red-400">Gestionar situaciones de emergencia</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-white transition-colors text-red-500">
                  <AlertTriangle size={18} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Kpi: React.FC<{ label: string; value: string | number; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    <p className={`mt-1 text-2xl font-black ${highlight ? 'text-[#39A900]' : 'text-[#003939]'}`}>{value}</p>
  </div>
);
