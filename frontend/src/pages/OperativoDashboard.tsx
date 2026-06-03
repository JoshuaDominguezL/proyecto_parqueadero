import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Car, History, Settings, 
  Menu, Bell, LogOut,
  ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useOperativo } from '../hooks/useOperativo';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Importar sub-vistas
import { EstadoBahiasView } from './operativo/EstadoBahiasView';
import { MovimientosView } from './operativo/MovimientosView';
import { AlertasView } from './operativo/AlertasView';
import { ConfiguracionView } from './operativo/ConfiguracionView';

export const OperativoDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { stats, movimientos } = useOperativo();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Resumen');

  const navItems = [
    { icon: LayoutDashboard, label: 'Resumen' },
    { icon: Car, label: 'Estado Bahías' },
    { icon: History, label: 'Movimientos' },
    { icon: AlertTriangle, label: 'Alertas' },
    { icon: Settings, label: 'Configuración' },
  ];

  const statCards = [
    { 
      label: 'Ocupación Actual', 
      value: movimientos.filter(m => m.estado === 'ACTIVO').length || 0, 
      change: '+ 12% vs ayer', 
      icon: Car, 
      color: 'bg-green-50 dark:bg-green-900/10 text-[#39A900]',
      trend: 'up'
    },
    { 
      label: 'Usuarios registrados', 
      value: stats.usuariosRegistrados || 0, 
      change: '+ 5% vs la semana pasada', 
      icon: Users, 
      color: 'bg-green-50 dark:bg-green-900/10 text-[#39A900]',
      trend: 'up'
    },
    { 
      label: 'Plazas disponibles', 
      value: stats.disponibles, 
      subtext: `Total: ${stats.total} plazas`, 
      icon: TrendingUp, 
      color: 'bg-green-50 dark:bg-green-900/10 text-[#39A900]' 
    },
    { 
      label: 'Ingresos Hoy', 
      value: movimientos.length || 0, 
      change: '+ 8% vs ayer', 
      icon: History, 
      color: 'bg-green-50 dark:bg-green-900/10 text-[#39A900]',
      trend: 'up'
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'EN PARQUEADERO':
      case 'ACTIVO':
        return 'bg-green-100 dark:bg-green-900/20 text-[#39A900] border-green-200 dark:border-green-800';
      case 'COMPLETADO':
      case 'FINALIZADO':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-gray-950 font-sans overflow-hidden text-gray-900 dark:text-gray-100 transition-colors">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:relative
        ${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:w-0'}
        bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-500 flex flex-col overflow-hidden
      `}>
        {/* Header Sidebar - Estilo Institucional SENA */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#39A900] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-green-500/20 group hover:rotate-6 transition-transform">
              <img src="/logo.png" alt="SENA" className="w-7 h-7 brightness-0 invert" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col border-l border-gray-100 dark:border-gray-800 pl-4 animate-in fade-in slide-in-from-left-4">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800 dark:text-gray-200 leading-tight">Servicio Nacional</span>
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 leading-tight">de Aprendizaje</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-5 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(item.label);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-[20px] transition-all group relative ${
                activeTab === item.label
                  ? 'bg-green-50 dark:bg-[#39A900]/10 text-[#39A900] shadow-sm' 
                  : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform ${activeTab === item.label ? 'scale-110' : 'group-hover:scale-110'}`} />
              {sidebarOpen && <span className="font-bold text-[13px] tracking-tight">{item.label}</span>}
              {activeTab === item.label && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#39A900]" />
              )}
            </button>
          ))}
        </nav>

        {/* Perfil de Usuario en Sidebar */}
        <div className="p-6 border-t border-gray-50 dark:border-gray-800 relative z-10 bg-white dark:bg-gray-900">
          <div className={`flex items-center gap-4 p-4 rounded-[24px] bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-200/50 cursor-pointer transition-all duration-500 group border border-transparent hover:border-gray-100 dark:hover:border-gray-700`}>
            <div className="w-12 h-12 rounded-2xl bg-[#39A900] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-green-500/10 group-hover:scale-105 transition-transform">
              {user?.usuario?.nombreCompleto?.charAt(0) || 'D'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden animate-in fade-in">
                <p className="font-black text-[14px] text-gray-900 dark:text-gray-100 truncate leading-tight">{user?.usuario?.nombreCompleto || 'Daniela'}</p>
                <p className="text-[10px] text-[#39A900] font-black uppercase tracking-widest mt-1">
                  {user?.usuario?.idTipoUsr === 2 ? 'Administrador' : 'Operativo'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Onda Decorativa SENA en Sidebar (Inferior) */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none opacity-10 dark:opacity-5">
          <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-24">
            <path d="M0,120 C150,180 350,60 500,120 L500,200 L0,200 Z" fill="#39A900" />
          </svg>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 z-40 transition-colors">
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all border border-gray-50 dark:border-gray-800"
              title={sidebarOpen ? "Esconder menú" : "Sacar menú"}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg lg:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight truncate">
              <span className="hidden sm:inline">Panel Admin -</span> <span className="text-[#39A900]">Parking SENA</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative">
              <button className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all relative border border-gray-50 dark:border-gray-800">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#39A900] rounded-full border-2 border-white dark:border-gray-900 animate-pulse shadow-[0_0_8px_rgba(57,169,0,0.5)]"></span>
              </button>
            </div>

            <div className="flex items-center gap-4 pl-4 lg:pl-6 border-l border-gray-100 dark:border-gray-800">
              <div className="text-right hidden xl:block">
                <p className="font-bold text-[13px] text-gray-900 dark:text-gray-100 leading-tight">{user?.usuario?.nombreCompleto || 'Daniela'}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                  {user?.usuario?.idTipoUsr === 2 ? 'Administrador' : 'Operativo'}
                </p>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 p-2.5 lg:px-5 lg:py-2.5 bg-[#39A900] hover:bg-[#007832] text-white rounded-xl font-bold text-[13px] transition-all shadow-lg shadow-green-500/10 active:scale-95"
              >
                <span className="hidden md:block">Salir</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {activeTab === 'Resumen' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              {/* Welcome Section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    ¡Bienvenido/a, <span className="text-[#39A900]">{user?.usuario?.nombreCompleto?.split(' ')[0] || 'Daniela'}</span>!
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-sm italic">"Más trabajo, más oportunidades"</p>
                </div>
                
                {/* ESTADO DEL SISTEMA - VISUALIZACIÓN COMPLETA */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm animate-in slide-in-from-right-4 w-full xl:w-auto transition-colors">
                  <div className="flex flex-col gap-1 pr-4 border-r border-gray-50 dark:border-gray-800">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Servidor</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#39A900] animate-pulse shadow-[0_0_8px_rgba(57,169,0,0.4)]" />
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Activo</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 pr-4 border-r border-gray-50 dark:border-gray-800">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Base Datos</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#39A900]" />
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Sincronizada</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 pr-4 border-r border-gray-50 dark:border-gray-800">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Sensores</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">30/30 OK</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Último Scan</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">Hace 2m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-green-900/5 dark:hover:shadow-black/20 transition-all duration-500 group relative overflow-hidden">
                    <div className="flex items-start justify-between mb-5 relative z-10">
                      <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner border border-green-100/50 dark:border-green-900/20`}>
                        <card.icon className="w-6 h-6" />
                      </div>
                      {card.trend && (
                        <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${
                          card.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30 text-[#39A900]' : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                        }`}>
                          {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3 stroke-[3px]" /> : <ArrowDownRight className="w-3 h-3 stroke-[3px]" />}
                          <span>12%</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 relative z-10">
                      <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] leading-tight">{card.label}</p>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{card.value}</span>
                        {card.subtext && <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">{card.subtext}</span>}
                      </div>
                      {card.change && <p className="text-[11px] font-bold text-[#39A900] mt-4 flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 w-fit px-3 py-1.5 rounded-xl border border-green-100/50 dark:border-green-900/20">
                        <TrendingUp className="w-3 h-3" />
                        {card.change}
                      </p>}
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#39A900]/5 dark:bg-[#39A900]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  </div>
                ))}
              </div>

              {/* Recent Activity Table */}
              <div className="bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col transition-colors">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Actividad Reciente</h3>
                    <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Últimos movimientos detectados en el sistema</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Movimientos')}
                    className="text-[12px] font-black text-[#39A900] uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2"
                  >
                    Ver todo el historial <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Usuario</th>
                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Vehículo</th>
                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Ingreso</th>
                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {movimientos.slice(0, 5).map((mov, idx) => (
                        <tr key={idx} className="hover:bg-green-50/30 dark:hover:bg-[#39A900]/5 transition-all group">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 font-black text-sm group-hover:bg-[#39A900] group-hover:text-white transition-all">
                                {mov.usuario?.nombreCompleto?.charAt(0) || 'U'}
                              </div>
                              <span className="font-bold text-gray-900 dark:text-gray-100 text-sm tracking-tight">{mov.usuario?.nombreCompleto || 'Cargando...'}</span>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{mov.vehiculo?.placa || 'ABC-123'}</span>
                          </td>
                          <td className="px-10 py-6">
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                              {mov.fechaIngreso ? format(new Date(mov.fechaIngreso), 'hh:mm a', { locale: es }) : '--:--'}
                            </span>
                          </td>
                          <td className="px-10 py-6">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider ${getStatusStyle(mov.estado)}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${mov.estado.toUpperCase() === 'ACTIVO' ? 'bg-[#39A900] animate-pulse' : 'bg-blue-500'}`} />
                              {mov.estado === 'ACTIVO' ? 'En Parqueadero' : 'Completado'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Estado Bahías' && <EstadoBahiasView />}
          {activeTab === 'Movimientos' && <MovimientosView />}
          {activeTab === 'Alertas' && <AlertasView />}
          {activeTab === 'Configuración' && <ConfiguracionView />}
        </div>
      </main>
    </div>
  );
};
