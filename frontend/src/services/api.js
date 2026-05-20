import axios from 'axios';

const API = axios.create({
  baseURL: 'https://sistema-reservas-backend-w6hp.onrender.com/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registrar = (datos) => API.post('/auth/registro', datos);
export const login = (datos) => API.post('/auth/login', datos);
export const crearReserva = (datos) => API.post('/reservas', datos);
export const misReservas = () => API.get('/reservas/mis-reservas');
export const cancelarReserva = (id) => API.put(`/reservas/cancelar/${id}`);
export const todasLasReservas = () => API.get('/reservas/todas');
export const cambiarEstado = (id, estado) => API.put(`/reservas/estado/${id}`, { estado }); 