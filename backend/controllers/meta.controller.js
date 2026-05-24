import { Meta } from '../models/asociaciones.js';

export async function crearMeta(req, res) {
  try {
    const { titulo, descripcion } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({ mensaje: 'Título y descripción son obligatorios' });
    }

    const meta = await Meta.create({
      titulo,
      descripcion,
      creador_id: req.usuario.id,
    });

    res.status(201).json({ mensaje: 'Meta creada', meta });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

export async function listarMetasDeCreador(req, res) {
  try {
    const { creadorId } = req.params;

    const metas = await Meta.findAll({
      where: { creador_id: creadorId },
      order: [['createdAt', 'DESC']],
    });

    res.json(metas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

export async function borrarMeta(req, res) {
  try {
    const { id } = req.params;

    const meta = await Meta.findByPk(id);
    if (!meta) {
      return res.status(404).json({ mensaje: 'Meta no encontrada' });
    }

    if (meta.creador_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No puedes borrar metas de otro creador' });
    }

    await meta.destroy();
    res.json({ mensaje: 'Meta eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}