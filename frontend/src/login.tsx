import React, { useState } from 'react';
import api from './api/axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import senaLogo from './assets/sena.registro.png';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: '',
    contra: '',
  });

  const [codigoOtp, setCodigoOtp] = useState('');
  const [mostrarOtp, setMostrarOtp] = useState(false);

  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ─────────────────────────────
  // 1. LOGIN (envía credenciales)
  // ─────────────────────────────
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setStatus('Iniciando sesión...');
    setStatusType('loading');

    try {
      await api.post('/auth/login', formData);

      setStatus('Código OTP enviado. Revisa tu correo o terminal.');
      setStatusType('success');
      setMostrarOtp(true);

    } catch (error: any) {
      setStatus(error.response?.data?.message || 'Credenciales incorrectas');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────
  // 2. OTP
  // ─────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setStatus('Verificando código...');
    setStatusType('loading');

    try {
      const response = await api.post('/auth/verificar-otp', {
        correo: formData.correo,
        codigo: codigoOtp
      });

      const userData = response.data.data ?? response.data;

      login(userData);

      setStatus('Acceso autorizado');
      setStatusType('success');

      const rol = userData?.usuario?.idTipoUsr;

      if (rol === 2) navigate('/appadmin');
      else if (rol === 3) navigate('/appperop');
      else navigate('/app');

    } catch (error: any) {
      setStatus(error.response?.data?.message || 'Código inválido');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────
  // UI
  // ─────────────────────────────
  return (
    <div className="h-screen flex bg-[#f4f7f6] font-sans overflow-hidden">

      {/* ───────── PANEL IZQUIERDO ───────── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${senaLogo})` }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 p-12 text-white">
          <h1 className="text-4xl font-black">
            Sistema de <span className="text-[#39a900]">Parqueadero</span>
          </h1>
          <p className="mt-4 text-white/80 text-sm">
            Acceso institucional seguro SENA
          </p>
        </div>
      </div>

      {/* ───────── PANEL DERECHO ───────── */}
      <div className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-lg bg-white rounded-[40px] shadow-xl p-10">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-[#39a900]/10 rounded-full flex items-center justify-center mb-4">
              {mostrarOtp ? <ShieldCheck className="text-[#39a900]" /> : <LogIn className="text-[#39a900]" />}
            </div>

            <h1 className="text-2xl font-black">
              {mostrarOtp ? 'Verificación OTP' : 'Iniciar sesión'}
            </h1>
          </div>

          {/* ───────── LOGIN ───────── */}
          {!mostrarOtp ? (
            <form onSubmit={handleSubmitLogin} className="space-y-5">

              <input
                type="email"
                name="correo"
                placeholder="Correo"
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="contra"
                  placeholder="Contraseña"
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#39a900] text-white p-4 rounded-2xl font-bold"
              >
                {loading ? 'Cargando...' : 'Ingresar'}
              </button>

            </form>
          ) : (
            /* ───────── OTP ───────── */
            <form onSubmit={handleVerifyOtp} className="space-y-5">

              <input
                type="text"
                maxLength={6}
                value={codigoOtp}
                onChange={(e) => setCodigoOtp(e.target.value)}
                placeholder="Código OTP"
                className="w-full p-4 text-center text-xl tracking-[10px] border rounded-2xl"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#39a900] text-white p-4 rounded-2xl font-bold"
              >
                Verificar
              </button>

              <button
                type="button"
                onClick={() => setMostrarOtp(false)}
                className="w-full text-sm text-gray-500"
              >
                Volver
              </button>

            </form>
          )}

          {/* STATUS */}
          {status && (
            <div className="mt-6 text-center text-sm text-gray-600">
              {status}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;