import React, { useMemo } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Scan, LayoutGrid, ClipboardList, 
  Bell, Settings, LogOut, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../AuthContext';

/**
 * Layout Principal para el Panel Operativo.
 * Basado en el diseño institucional SENA con navegación lateral.
 */
export const OperativoLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/appperop', label: 'Control de Acceso', icon: <Scan size={20} /> },
    { path: '/appperop/bahias', label: 'Estado de Bahías', icon: <LayoutGrid size={20} /> },
    { path: '/appperop/movimientos', label: 'Movimientos', icon: <ClipboardList size={20} /> },
    { path: '/appperop/alertas', label: 'Alertas', icon: <Bell size={20} /> },
    { path: '/appperop/configuracion', label: 'Configuración', icon: <Settings size={20} /> },
  ];

  const pageMeta = useMemo(() => {
    const path = location.pathname;
    const base = '/appperop';

    const segment = path.replace(base, '').split('/').filter(Boolean)[0] || '';

    const metaMap: Record<string, { title: string; subtitle: string }> = {
      '': { title: 'Control de Acceso', subtitle: 'Registra la entrada o salida de vehículos' },
      bahias: { title: 'Estado de Bahías', subtitle: 'Visualiza la disponibilidad en tiempo real' },
      movimientos: { title: 'Movimientos', subtitle: 'Consulta el historial de entradas y salidas' },
      alertas: { title: 'Alertas', subtitle: 'Revisa las alertas y eventos del sistema' },
      configuracion: { title: 'Configuración', subtitle: 'Ajusta las preferencias del sistema' },
    };

    return metaMap[segment] || metaMap[''];
  }, [location.pathname]);

  const operadorNombre = user?.usuario?.nombreCompleto || 'Operador';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* Sidebar Lateral */}
      <aside className="w-72 bg-[#003939] text-white flex flex-col sticky top-0 h-screen shadow-xl z-50">
        <div className="p-8 flex flex-col h-full">
          {/* Logo y Marca */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h2 className="text-lg font-black text-white leading-tight">SENA</h2>
                <span className="text-[10px] font-black text-[#39A900] uppercase tracking-tighter">PARKING</span>
              </div>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Operativo</p>
            </div>
          </div>

          {/* Navegación Principal */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 group font-bold text-sm ${
                    isActive 
                      ? 'bg-[#39A900] text-white shadow-lg shadow-[#39A900]/20' 
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Info Usuario y Logout */}
          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                <div className="w-10 h-10 rounded-full bg-slate-400/20 flex items-center justify-center text-white font-black text-sm uppercase">
                  {operadorNombre.substring(0, 2)}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black text-white truncate">{operadorNombre}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse" />
                  <p className="text-[10px] font-bold text-white/60 uppercase truncate">En línea</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 p-4 text-white/80 font-black text-[11px] uppercase tracking-widest hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200"
            >
              <LogOut size={18} className="rotate-180" /> Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Superior */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-black text-[#003939] tracking-tight">{pageMeta.title}</h1>
            <p className="text-sm font-semibold text-slate-500">{pageMeta.subtitle}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#39A900]" />
              <p className="text-[11px] font-black uppercase tracking-widest text-[#003939]">Sistema operativo <span className="text-slate-400 ml-1">Conectado</span></p>
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-[#003939] transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="text-right">
              <p className="text-[11px] font-black text-[#003939] uppercase tracking-widest">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </header>

        {/* Contenido Dinámico */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>

        {/* Footer Institucional */}
        <footer className="bg-[#003939] text-white/60 px-8 py-4 flex items-center justify-between border-t border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest">Sistema Institucional de Parqueadero SENA - Sede Ibague</p>
          <p className="text-[10px] font-bold uppercase tracking-widest">© 2026 SENA. Todos los derechos reservados.</p>
        </footer>
      </main>
    </div>
  );
};
