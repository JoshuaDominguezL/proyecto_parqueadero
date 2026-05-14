import React, { useState } from 'react';
import api from './api/axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Zap, Circle, LogIn } from 'lucide-react';

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
    <div className="min-h-screen flex bg-zinc-950 font-sans">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[40%] relative flex-col overflow-hidden">

        {/* Background image + cinematic overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "./assets/sena.registro.png" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950/95" />

        {/* Green accent curve bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden pointer-events-none">
          <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="absolute bottom-0 w-full">
            <path d="M0,40 Q100,0 200,30 T400,10 L400,80 L0,80 Z" fill="#16a34a" opacity="0.18" />
            <path d="M0,60 Q120,20 250,45 T400,30 L400,80 L0,80 Z" fill="#22c55e" opacity="0.10" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-10 py-12">

          {/* Logo / brand */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <span className="text-white font-black text-sm tracking-tight">S</span>
            </div>
            <span className="text-white/80 font-semibold text-sm tracking-widest uppercase">SENA</span>
          </div>

          {/* Main text */}
          <div className="mb-10">
            <h2
              className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4"
              style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.02em' }}
            >
              Bienvenido<br />
              <span className="text-green-400">nuevamente.</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Accede a la plataforma institucional y continúa tu experiencia académica.
            </p>
          </div>

          {/* Glassmorphism feature card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-5 space-y-4 mb-12">
            {[
              { icon: <ShieldCheck size={15} className="text-green-400" />, label: 'Acceso seguro' },
              { icon: <Zap size={15} className="text-green-400" />, label: 'Gestión eficiente' },
              { icon: <Circle size={12} className="fill-green-400 text-green-400" />, label: 'Disponible 24/7' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <span className="text-zinc-300 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 relative overflow-hidden">

        {/* Card */}
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl shadow-black/60 p-9">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-9">
            <div className="w-12 h-12 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center mb-4 shadow-lg shadow-green-500/10">
              <LogIn size={20} className="text-green-400" />
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Iniciar sesión</h1>
            <p className="text-zinc-500 text-sm">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Correo */}
            <div className="space-y-1.5">
              <label htmlFor="correo" className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                Correo electrónico
              </label>
              <div className="relative group">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-400 transition-colors duration-200" />
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  onChange={handleChange}
                  required
                  placeholder="tucorreo@sena.edu.co"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white placeholder-zinc-600 text-sm
                    focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                    hover:border-zinc-600 transition-all duration-200"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label htmlFor="contra" className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                Contraseña
              </label>
              <div className="relative group">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-400 transition-colors duration-200" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="contra"
                  name="contra"
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-12 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white placeholder-zinc-600 text-sm
                    focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20
                    hover:border-zinc-600 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Recordarme + Olvidaste contraseña */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center
                    ${rememberMe ? 'bg-green-500 border-green-500' : 'bg-zinc-800 border-zinc-600'}`}>
                    {rememberMe && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-zinc-400 text-xs">Recordarme</span>
              </label>
              <a href="/recuperar" className="text-xs text-green-400 hover:text-green-300 transition-colors duration-200 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Status banner */}
            {status && (
              <div className={`rounded-xl px-4 py-3 text-sm font-medium flex items-start gap-2.5 border transition-all duration-300
                ${statusType === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : ''}
                ${statusType === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
                ${statusType === 'loading' ? 'bg-zinc-800/80 border-zinc-700 text-zinc-400' : ''}
              `}>
                <span className="mt-0.5">
                  {statusType === 'loading' && (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {statusType === 'success' && <ShieldCheck size={16} />}
                  {statusType === 'error' && <span>⚠</span>}
                </span>
                {status}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-400 active:scale-[0.98]
                text-white font-bold text-sm tracking-wide
                shadow-lg shadow-green-500/25 hover:shadow-green-400/35
                transition-all duration-200 flex items-center justify-center gap-2 mt-1"
            >
              <LogIn size={16} />
              Ingresar
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-zinc-600 text-xs mt-7">
            Plataforma institucional SENA
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;