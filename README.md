# 🍽️ Sistema de Reservas para Restaurante

Aplicación web full-stack para gestión de reservas de mesas en restaurantes y cafeterías.

## 🚀 Demo

- **Frontend:** https://sistema-reservas-gray.vercel.app
- **Backend:** https://sistema-reservas-backend-w6hp.onrender.com

## 📋 Funcionalidades

- Registro e inicio de sesión de usuarios
- Reserva de mesas por fecha, hora y número de personas
- Cancelación de reservas por parte del cliente
- Panel de administrador para gestionar todas las reservas
- Cambio de estado de reservas (pendiente / confirmada / cancelada)

## 🛠️ Tecnologías

**Frontend:** React.js, Axios, React Router DOM  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs  
**Base de datos:** MongoDB Atlas  
**Despliegue:** Vercel (frontend) + Render (backend)

## ⚙️ Instalación local

### Backend
```bash
cd backend
npm install
# Crea un archivo .env con las variables de .env.example
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔑 Variables de entorno

Ver `.env.example` en la carpeta backend.

## 📡 API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/registro | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |

### Reservas
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/reservas | Crear reserva |
| GET | /api/reservas/mis-reservas | Ver mis reservas |
| PUT | /api/reservas/cancelar/:id | Cancelar reserva |
| GET | /api/reservas/todas | Ver todas (admin) |
| PUT | /api/reservas/estado/:id | Cambiar estado (admin) |

## 👤 Autor

Andrés — Universidad de la Costa (CUC)