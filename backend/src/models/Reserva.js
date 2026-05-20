const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  personas: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  mesa: {
  type: Number,
  default: null
},
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente'
  },
  nota: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Reserva', reservaSchema);