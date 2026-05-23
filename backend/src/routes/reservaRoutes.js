'use strict';
const express = require('express');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../middleware/auth');
const { crearReserva, misReservas, cancelarReserva, todasLasReservas, cambiarEstado, verificarDisponibilidad, eliminarReserva } = require('../controllers/reservaController');
router.post('/', verificarToken, crearReserva);
router.get('/mis-reservas', verificarToken, misReservas);
router.put('/cancelar/:id', verificarToken, cancelarReserva);
router.get('/todas', verificarToken, soloAdmin, todasLasReservas);
router.put('/estado/:id', verificarToken, soloAdmin, cambiarEstado);
router.get('/disponibilidad', verificarToken, verificarDisponibilidad); 
router.delete('/:id', verificarToken, soloAdmin, eliminarReserva);

module.exports = router;