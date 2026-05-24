import { Donacion, Usuario } from '../models/asociaciones.js';
import { Op } from 'sequelize';

export async function enviarFlanes(req, res) {
  try {
    const { creador_id, cantidad } = req.body;

    if (!creador_id) {
      return res.status(400).json({ mensaje: 'Falta el creador destino' });
    }

    const creador = await Usuario.findByPk(creador_id);
    if (!creador || creador.rol !== 'creador') {
      return res.status(404).json({ mensaje: 'Creador no encontrado' });
    }

    const donacion = await Donacion.create({
      seguidor_id: req.usuario.id,
      creador_id,
      cantidad: cantidad || 1,
    });

    res.status(201).json({ mensaje: 'Flanes enviados', donacion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}
export async function historialSeguidor(req, res) {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const condiciones = { seguidor_id: req.usuario.id };

    if (fechaInicio && fechaFin) {
      condiciones.createdAt = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)],
      };
    }

    const donaciones = await Donacion.findAll({
      where: condiciones,
      include: [{ model: Usuario, as: 'creador', attributes: ['id', 'nombre'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(donaciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

export async function reporteCreador(req, res) {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const condiciones = { creador_id: req.usuario.id };

    if (fechaInicio && fechaFin) {
      condiciones.createdAt = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)],
      };
    }

    const donaciones = await Donacion.findAll({
      where: condiciones,
      include: [{ model: Usuario, as: 'seguidor', attributes: ['id', 'nombre'] }],
      order: [['createdAt', 'DESC']],
    });

    const totalFlanes = donaciones.reduce((suma, d) => suma + d.cantidad, 0);

    res.json({
      totalFlanes,
      cantidadDonaciones: donaciones.length,
      historial: donaciones,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}