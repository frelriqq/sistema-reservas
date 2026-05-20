import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Reservas from './pages/Reservas';
import Admin from './pages/Admin';

const RutaPrivada = ({ children, soloAdmin }) => {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" />;
  if (soloAdmin && usuario.rol !== 'admin') return <Navigate to="/reservas" />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/reservas" element={
            <RutaPrivada>
              <Reservas />
            </RutaPrivada>
          } />
          <Route path="/admin" element={
            <RutaPrivada soloAdmin>
              <Admin />
            </RutaPrivada>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;