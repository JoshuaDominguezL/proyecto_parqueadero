import React, { useState } from 'react';
import api from './api/axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Zap, Circle, LogIn } from 'lucide-react';
import senaLogo from './assets/sena.registro.png';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: '',
    contra: '',
  });
  const [status, setStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Iniciando sesión...');
    setStatusType('loading');
    try {
      const response = await api.post('/usuarios/login', formData);
      console.log('Login exitoso:', response.data);
      login(response.data);
      setStatus(`Bienvenido, ${response.data.nombreCompleto}`);
      setStatusType('success');

      const rol = response.data.idTipoUsr;
      if (rol === 1) {
        navigate('/app');
      } else if (rol === 2) {
        navigate('/appadmin');
      } else if (rol === 3) {
        navigate('/appperop');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error en el login:', error);
      setStatus(`${error.response?.data?.message || 'Credenciales incorrectas o error de servidor'}`);
      setStatusType('error');
    }
  };

  return (
    <div className="h-screen flex bg-[#f4f7f6] font-sans overflow-hidden">

      {/* ── PANEL IZQUIERDO ── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col overflow-hidden">

        {/* Imagen de fondo + superposición cinematográfica */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: `url(${senaLogo})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col h-full px-12 py-12">

          {/* Logo / marca */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="SENA Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xs leading-tight tracking-wider">Servicio Nacional</span>
              <span className="text-white/80 text-[10px] font-medium">de Aprendizaje</span>
            </div>
          </div>

          {/* Texto principal */}
          <div className="mb-14">
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Bienvenido<br />
              <span className="text-[#39a900]">nuevamente</span>
            </h2>
            <div className="w-12 h-1 bg-[#39a900] mb-4" />
            <p className="text-white/90 text-base leading-relaxed max-w-sm">
              Gestiona los datos de tu vehículo fácilmente.
            </p>
          </div>

          {/* Tarjeta de características con Glassmorphism */}
          <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md px-6 py-6 space-y-4 mb-auto max-w-md">
            {[
              { 
                icon: <ShieldCheck size={20} className="text-[#39a900]" />, 
                title: 'Acceso seguro',
                desc: 'Protegemos tu información con seguridad.'
              },
              { 
                icon: <Zap size={20} className="text-[#39a900]" />, 
                title: 'Gestión de perfil',
                desc: 'Actualiza la foto de tu vehículo, documentos y datos personales de forma rápida y fácil.'
              },
              { 
                icon: <Circle size={14} className="fill-[#39a900] text-[#39a900]" />, 
                title: 'Disponible 24/7',
                desc: 'Accede a la plataforma en cualquier momento desde cualquier dispositivo.'
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#39a900]/10 border border-[#39a900]/20 flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-white text-sm font-bold">{title}</span>
                  <span className="text-white/70 text-[10px] leading-snug">{desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Onda inferior + Conexión Segura */}
          <div className="relative mt-auto -mx-12 -mb-8 pt-8">
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
               <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-24 w-full fill-[#39a900]/40">
                <path d="M0,80 C150,150 350,0 500,80 L500,150 L0,150 Z"></path>
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
               <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-20 w-full fill-[#39a900]">
                <path d="M0,100 C150,160 350,40 500,100 L500,150 L0,150 Z"></path>
              </svg>
            </div>
            
            <div className="relative z-20 px-12 pb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Lock size={16} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xs">Conexión segura</span>
                <span className="text-white/80 text-[10px]">Tu información está protegida.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── PANEL DERECHO ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-6 bg-[#f4f7f6] relative overflow-hidden">
        
        {/* Tarjeta */}
        <div className="w-full max-w-lg bg-white rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.08)] p-8 sm:p-12 relative z-10">

          {/* Logo para móviles */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 flex items-center justify-center">
              <img src="/logo.png" alt="SENA Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 font-bold text-sm leading-tight">Servicio Nacional</span>
              <span className="text-gray-500 text-xs font-medium">de Aprendizaje</span>
            </div>
          </div>

          {/* Encabezado */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 shadow-inner">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                <Lock size={24} className="text-[#39a900]" />
              </div>
            </div>
            <h1 className="text-gray-900 text-3xl font-black tracking-tight mb-3">Iniciar sesión</h1>
            <p className="text-gray-500 text-sm">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Correo */}
            <div className="space-y-2">
              <label htmlFor="correo" className="block text-sm font-semibold text-gray-700">
                Correo electrónico
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#39a900] transition-colors duration-200" />
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  onChange={handleChange}
                  required
                  placeholder="ejemplo@correo.com"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border-2 border-gray-100 text-gray-900 placeholder-gray-400 text-sm
                    focus:outline-none focus:border-[#39a900] transition-all duration-200"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label htmlFor="contra" className="block text-sm font-semibold text-gray-700">
                Contraseña
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#39a900] transition-colors duration-200" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="contra"
                  name="contra"
                  onChange={handleChange}
                  required
                  placeholder="••••••••••••"
                  className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white border-2 border-gray-100 text-gray-900 placeholder-gray-400 text-sm
                    focus:outline-none focus:border-[#39a900] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Recordarme + Olvidaste contraseña */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
                    ${rememberMe ? 'bg-[#39a900] border-[#39a900]' : 'bg-white border-gray-200'}`}>
                    {rememberMe && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-600 text-sm font-medium">Recordarme</span>
              </label>
              <a href="/recuperar" className="text-sm text-[#39a900] hover:underline transition-all duration-200 font-bold">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Banner de estado */}
            {status && (
              <div className={`rounded-2xl px-5 py-4 text-sm font-medium flex items-start gap-3 border transition-all duration-300
                ${statusType === 'success' ? 'bg-green-50 border-green-100 text-[#39a900]' : ''}
                ${statusType === 'error' ? 'bg-red-50 border-red-100 text-red-600' : ''}
                ${statusType === 'loading' ? 'bg-gray-50 border-gray-100 text-gray-500' : ''}
              `}>
                <span className="mt-0.5 shrink-0">
                  {statusType === 'loading' && (
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {statusType === 'success' && <ShieldCheck size={20} />}
                  {statusType === 'error' && <span className="text-xl leading-none">⚠</span>}
                </span>
                <span className="leading-tight">{status}</span>
              </div>
            )}

            {/* Botón de ingreso */}
            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-[#39a900] hover:bg-[#328700] active:scale-[0.98]
                text-white font-bold text-base shadow-lg shadow-[#39a900]/20
                transition-all duration-200 flex items-center justify-center gap-3 mt-4"
            >
              <LogIn size={20} />
              Ingresar
            </button>

          </form>

          {/* Tarjeta de pie de página */}
          <div className="mt-10 flex flex-col items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
               <ShieldCheck size={14} className="text-[#39a900]" />
             </div>
             <div className="text-center">
               <p className="text-gray-500 text-xs font-medium">Servicio Nacional de Aprendizaje SENA</p>
               <p className="text-gray-400 text-[10px]">Plataforma académica para la gestión de parqueaderos</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;