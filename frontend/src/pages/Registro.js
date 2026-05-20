import { useState } from 'react';
import { registrar } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Registro = () => {
  const [form, setForm] = useState({ nombre: '', correo: '', password: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrar(form);
      setExito('Cuenta creada correctamente, redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrarse');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Crear Cuenta</h2>
        {error && <p style={styles.error}>{error}</p>}
        {exito && <p style={styles.exito}>{exito}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button style={styles.btn} type="submit">Registrarse</button>
        </form>
        <p style={styles.link}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f4f8' },
  card: { background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  titulo: { textAlign: 'center', marginBottom: '1.5rem', color: '#1a4a8a' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.75rem', background: '#1a4a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center', marginBottom: '1rem' },
  exito: { color: 'green', textAlign: 'center', marginBottom: '1rem' },
  link: { textAlign: 'center', marginTop: '1rem' }
};

export default Registro;