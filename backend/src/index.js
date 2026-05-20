const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservaRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando ✅' });
});

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log('MongoDB conectado ✅'))
  .catch(() => console.log('MongoDB sin conexión (se intentará al desplegar)'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT} ✅`);
});