import React, { useState } from 'react';
import api from './api/axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: '',
    contra: '',
  });
  const [status, setStatus] = useState<string>('');

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
    try {
      const response = await api.post('/usuarios/login', formData);
      console.log('Login exitoso:', response.data);
      login(response.data); // Guardar estado de autenticación
      setStatus(`Bienvenido, ${response.data.nombreCompleto}`);
      
      // Redirigir según el rol
      const rol = response.data.idTipoUsr;
      if (rol === 1) {
        navigate('/app');
      } else if (rol === 2) {
        navigate('/appadmin');
      } else if (rol === 3) {
        navigate('/appperop');
      } else {
        navigate('/'); // Redirección por defecto
      }
    } catch (error: any) {
      console.error('Error en el login:', error);
      setStatus(`Error: ${error.response?.data?.message || 'Credenciales incorrectas o error de servidor'}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label htmlFor="correo">Correo Electrónico:</label>
        <input 
          type="email" 
          id="correo" 
          name="correo" 
          onChange={handleChange} 
          required 
        />
        
        <label htmlFor="contra">Contraseña:</label>
        <input 
          type="password" 
          id="contra" 
          name="contra" 
          onChange={handleChange} 
          required 
        />
        <a href="/registro">No tienes cuenta? Regístrate aquí</a>
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          Ingresar
        </button>
      </form>
      {status && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{status}</p>}
    </div>
  );
}

export default Login;