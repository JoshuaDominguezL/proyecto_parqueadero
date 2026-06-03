import React from 'react';
import { useAuth } from './AuthContext';

const AppAdmin: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Panel de Administrador</h1>
      <p>Bienvenido, {user?.usuario?.nombreCompleto}</p>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>Gestión Administrativa</h3>
        <p>Aquí puedes gestionar usuarios, bahías y reportes.</p>
      </div>
      <button 
        onClick={logout} 
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default AppAdmin;
