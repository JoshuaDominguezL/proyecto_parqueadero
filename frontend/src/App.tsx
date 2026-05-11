import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Registro from './registro';
import AppAdmin from './AppAdmin';
import AppPerOp from './AppPerOp';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider, useAuth } from './AuthContext';

function Saludo() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Conectado con éxito</h1>
      <p>Bienvenido, usuario {user?.nombreCompleto || 'Usuario'}</p>
      <button onClick={logout} style={{ padding: '10px', cursor: 'pointer' }}>
        Cerrar Sesión
      </button>
    </div>
  );
}

// Componente para manejar la redirección inicial según el rol
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;

  switch (user.idTipoUsr) {
    case 1: // Usuario
      return <Navigate to="/app" replace />;
    case 2: // Administrador
      return <Navigate to="/appadmin" replace />;
    case 3: // Personal Operativo
      return <Navigate to="/appperop" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          
          {/* Rutas Protegidas */}
          <Route path="/app" element={<ProtectedRoute><Saludo /></ProtectedRoute>} />
          <Route path="/appadmin" element={<ProtectedRoute><AppAdmin /></ProtectedRoute>} />
          <Route path="/appperop" element={<ProtectedRoute><AppPerOp /></ProtectedRoute>} />
          
          {/* Redirección Inicial */}
          <Route path="/" element={<RoleBasedRedirect />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
