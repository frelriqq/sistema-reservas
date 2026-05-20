const Reserva = require('../models/Reserva');

const crearReserva = async (req, res) => {
  try {
    const { fecha, hora, personas, nota } = req.body;
    const reserva = new Reserva({ usuario: req.usuario.id, fecha, hora, personas, nota });
    await reserva.save();
    res.status(201).json({ mensaje: 'Reserva creada correctamente', reserva });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
  }
};

const misReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find({ usuario: req.usuario.id }).sort({ fecha: 1 });
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
  }
};

const cancelarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    if (reserva.usuario.toString() !== req.usuario.id) return res.status(403).json({ mensaje: 'No tienes permiso' });
    reserva.estado = 'cancelada';
    await reserva.save();
    res.json({ mensaje: 'Reserva cancelada', reserva });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
  }
};

const todasLasReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find().populate('usuario', 'nombre correo').sort({ fecha: 1 });
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, { estado }, { new: true });
    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    res.json({ mensaje: 'Estado actualizado', reserva });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
  }
};

module.exports = { crearReserva, misReservas, cancelarReserva, todasLasReservas, cambiarEstado };