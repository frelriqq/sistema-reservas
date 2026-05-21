import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { crearReserva, misReservas, cancelarReserva, verificarDisponibilidad } from '../services/api';

const Reservas = () => {
  const [form, setForm] = useState({ fecha: '', hora: '', personas: 1, nota: '' });
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const { usuario, cerrarSesion } = useAuth();
  const [disponibilidad, setDisponibilidad] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const { data } = await misReservas();
      setReservas(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFechaHora = async (e) => {
  handleChange(e);
  const nuevaFecha = e.target.name === 'fecha' ? e.target.value : form.fecha;
  const nuevaHora = e.target.name === 'hora' ? e.target.value : form.hora;
  if (nuevaFecha && nuevaHora) {
    try {
      const { data } = await verificarDisponibilidad(nuevaFecha, nuevaHora);
      setDisponibilidad(data);
    } catch (err) {
      console.error(err);
    }
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearReserva(form);
      setExito('Reserva creada correctamente');
      setError('');
      setForm({ fecha: '', hora: '', personas: 1, nota: '' });
      cargarReservas();
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear reserva');
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    try {
      await cancelarReserva(id);
      cargarReservas();
    } catch (err) {
      setError('Error al cancelar la reserva');
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.titulo}>🍽️ Sistema de Reservas</h1>
        <div>
          <span style={styles.bienvenida}>Hola, {usuario?.nombre}</span>
          <button style={styles.btnSalir} onClick={handleSalir}>Cerrar sesión</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.subtitulo}>Nueva Reserva</h2>
          {error && <p style={styles.error}>{error}</p>}
          {exito && <p style={styles.exito}>{exito}</p>}
          <form onSubmit={handleSubmit}>
            <input 
  style={styles.input} 
  type="date" 
  name="fecha" 
  value={form.fecha} 
  onChange={handleChange} 
  min={new Date().toISOString().split('T')[0]}
  required 
/> 
            <input style={styles.input} type="time" name="hora" value={form.hora} onChange={handleFechaHora} required />

{disponibilidad && (
  <p style={{ 
    color: disponibilidad.disponible ? 'green' : 'red', 
    marginBottom: '1rem',
    fontWeight: 'bold'
  }}>
    {disponibilidad.disponible 
      ? `✅ ${disponibilidad.mesasDisponibles} mesa(s) disponibles` 
      : '❌ No hay mesas disponibles para ese horario'}
  </p>
)}
            <input style={styles.input} type="number" name="personas" min="1" max="10" value={form.personas} onChange={handleChange} required placeholder="Número de personas" />
            <textarea style={styles.input} name="nota" value={form.nota} onChange={handleChange} placeholder="Nota opcional (alergias, ocasión especial...)" rows="3" />
            <button style={styles.btn} type="submit">Reservar mesa</button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.subtitulo}>Mis Reservas</h2>
          {reservas.length === 0 ? (
            <p style={{ color: '#888' }}>No tienes reservas aún.</p>
          ) : (
            reservas.map((r) => (
              <div key={r._id} style={styles.reservaCard}>
                <div style={styles.reservaInfo}>
                  <p><strong>📅 Fecha:</strong> {new Date(r.fecha).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>🕐 Hora:</strong> {r.hora}</p>
                  <p><strong>👥 Personas:</strong> {r.personas}</p>
                  {r.nota && <p><strong>📝 Nota:</strong> {r.nota}</p>}
                  <span style={{ ...styles.estado, background: coloresEstado[r.estado] }}>
                    {r.estado}
                  </span>
                </div>
                {r.estado !== 'cancelada' && (
                  <button style={styles.btnCancelar} onClick={() => handleCancelar(r._id)}>
                    Cancelar
                  </button>
                )}
              </div>
            ))
          )}
        </div>
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
  content: { display: 'flex', gap: '2rem', padding: '2rem', flexWrap: 'wrap' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', flex: '1', minWidth: '300px' },
  subtitulo: { color: '#1a4a8a', marginBottom: '1rem' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.75rem', background: '#1a4a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  error: { color: 'red', marginBottom: '1rem' },
  exito: { color: 'green', marginBottom: '1rem' },
  reservaCard: { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  reservaInfo: { flex: 1 },
  estado: { display: 'inline-block', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', marginTop: '0.5rem' },
  btnCancelar: { background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }
};

export default Reservas;