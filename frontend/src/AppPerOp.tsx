import React from 'react';
import { useAuth } from './AuthContext';

const AppPerOp: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Panel de Personal Operativo</h1>
      <p>Bienvenido, {user?.nombreCompleto}</p>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '20px', backgroundColor: '#f9f9f9' }}>
        <h3>Control de Operaciones</h3>
        <p>Aquí puedes registrar entradas, salidas y movimientos de vehículos.</p>
      </div>
      <button 
        onClick={logout} 
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default AppPerOp;
