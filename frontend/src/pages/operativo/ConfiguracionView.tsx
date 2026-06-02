import React, { useState } from 'react';
import { Save, Laptop, Users, Clock, Database, Settings } from 'lucide-react';

export const ConfiguracionView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex gap-8">
      {/* Tabs Lateral Interno */}
      <div className="w-64 space-y-2">
        <ConfigTab 
          active={activeTab === 'general'} 
          onClick={() => setActiveTab('general')} 
          label="General" 
          icon={<Settings size={18} />} 
        />
        <ConfigTab 
          active={activeTab === 'dispositivos'} 
          onClick={() => setActiveTab('dispositivos')} 
          label="Dispositivos" 
          icon={<Laptop size={18} />} 
        />
        <ConfigTab 
          active={activeTab === 'usuarios'} 
          onClick={() => setActiveTab('usuarios')} 
          label="Usuarios" 
          icon={<Users size={18} />} 
        />
        <ConfigTab 
          active={activeTab === 'turnos'} 
          onClick={() => setActiveTab('turnos')} 
          label="Turnos" 
          icon={<Clock size={18} />} 
        />
        <ConfigTab 
          active={activeTab === 'respaldos'} 
          onClick={() => setActiveTab('respaldos')} 
          label="Respaldos" 
          icon={<Database size={18} />} 
        />
      </div>

      {/* Formulario de Configuración */}
      <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10">
        <div className="max-w-2xl space-y-8">
          <div>
            <h2 className="text-xl font-black text-[#003939]">Configuración general</h2>
            <p className="text-sm font-semibold text-slate-400 mt-1">Ajusta los parámetros básicos del sistema</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Nombre del parqueadero</label>
              <input 
                type="text" 
                defaultValue="Parqueadero SENA - Sede Itagüí"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#39A900]/20 focus:border-[#39A900] outline-none transition-all text-sm font-bold text-[#003939]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Capacidad total de plazas</label>
              <input 
                type="number" 
                defaultValue="30"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#39A900]/20 focus:border-[#39A900] outline-none transition-all text-sm font-bold text-[#003939]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Tiempo de espera sin escaneo (minutos)</label>
              <input 
                type="number" 
                defaultValue="2"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#39A900]/20 focus:border-[#39A900] outline-none transition-all text-sm font-bold text-[#003939]"
              />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">Tiempo antes de mostrar alerta de inactividad en el lector.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Tema de la interfaz</label>
              <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#39A900]/20 focus:border-[#39A900] outline-none transition-all text-sm font-bold text-[#003939] appearance-none cursor-pointer">
                <option value="claro">Claro</option>
                <option value="oscuro">Oscuro</option>
                <option value="sistema">Sistema</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button className="flex items-center gap-3 px-8 py-4 bg-[#39A900] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#39A900]/20 active:scale-95">
              <Save size={18} />
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfigTab: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
      active 
        ? 'bg-white text-[#39A900] border border-slate-200 shadow-sm' 
        : 'text-slate-500 hover:bg-white/50'
    }`}
  >
    <span className={active ? 'text-[#39A900]' : 'text-slate-400'}>{icon}</span>
    {label}
  </button>
);
