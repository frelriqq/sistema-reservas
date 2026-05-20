import { useState, useEffect } from 'react';
import { todasLasReservas, cambiarEstado } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('todas');
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const { data } = await todasLasReservas();
      setReservas(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEstado = async (id, estado) => {
    try {
      await cambiarEstado(id, estado);
      cargarReservas();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSalir = () => {
    cerrarSesion();
    navigate('/login');
  };

  const coloresEstado = {
    pendiente: '#f59e0b',
    confirmada: '#10b981',
    cancelada: '#ef4444'
  };

  const reservasFiltradas = filtro === 'todas'
    ? reservas
    : reservas.filter((r) => r.estado === filtro);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.titulo}>🍽️ Panel Administrador</h1>
        <div>
          <span style={styles.bienvenida}>Hola, {usuario?.nombre}</span>
          <button style={styles.btnSalir} onClick={handleSalir}>Cerrar sesión</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.filtros}>
          {['todas', 'pendiente', 'confirmada', 'cancelada'].map((f) => (
            <button
              key={f}
              style={{ ...styles.btnFiltro, ...(filtro === f ? styles.btnFiltroActivo : {}) }}
              onClick={() => setFiltro(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3>{reservas.length}</h3>
            <p>Total reservas</p>
          </div>
          <div style={styles.statCard}>
            <h3>{reservas.filter(r => r.estado === 'pendiente').length}</h3>
            <p>Pendientes</p>
          </div>
          <div style={styles.statCard}>
            <h3>{reservas.filter(r => r.estado === 'confirmada').length}</h3>
            <p>Confirmadas</p>
          </div>
          <div style={styles.statCard}>
            <h3>{reservas.filter(r => r.estado === 'cancelada').length}</h3>
            <p>Canceladas</p>
          </div>
        </div>

        {reservasFiltradas.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>No hay reservas.</p>
        ) : (
          reservasFiltradas.map((r) => (
            <div key={r._id} style={styles.reservaCard}>
              <div style={styles.reservaInfo}>
                <p><strong>👤 Cliente:</strong> {r.usuario?.nombre} ({r.usuario?.correo})</p>
                <p><strong>📅 Fecha:</strong> {new Date(r.fecha).toLocaleDateString()}</p>
                <p><strong>🕐 Hora:</strong> {r.hora}</p>
                <p><strong>👥 Personas:</strong> {r.personas}</p>
                {r.nota && <p><strong>📝 Nota:</strong> {r.nota}</p>}
                <span style={{ ...styles.estado, background: coloresEstado[r.estado] }}>
                  {r.estado}
                </span>
              </div>
              <div style={styles.acciones}>
                {r.estado !== 'confirmada' && (
                  <button style={styles.btnConfirmar} onClick={() => handleEstado(r._id, 'confirmada')}>
                    Confirmar
                  </button>
                )}
                {r.estado !== 'cancelada' && (
                  <button style={styles.btnCancelar} onClick={() => handleEstado(r._id, 'cancelada')}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f0f4f8' },
  header: { background: '#1a4a8a', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { margin: 0, fontSize: '1.5rem' },
  bienvenida: { marginRight: '1rem' },
  btnSalir: { background: 'transparent', border: '1px solid white', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' },
  content: { padding: '2rem' },
  filtros: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  btnFiltro: { padding: '0.5rem 1.2rem', borderRadius: '20px', border: '1px solid #1a4a8a', background: 'white', color: '#1a4a8a', cursor: 'pointer' },
  btnFiltroActivo: { background: '#1a4a8a', color: 'white' },
  stats: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' },
  statCard: { background: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center', flex: 1, minWidth: '120px' },
  reservaCard: { background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  reservaInfo: { flex: 1 },
  estado: { display: 'inline-block', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', marginTop: '0.5rem' },
  acciones: { display: 'flex', gap: '0.5rem', flexDirection: 'column' },
  btnConfirmar: { background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' },
  btnCancelar: { background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }
};

export default Admin;