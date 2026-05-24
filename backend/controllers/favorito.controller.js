import { Favorito, Usuario } from '../models/asociaciones.js';

export async function marcarFavorito(req, res) {
  try {
    const { creador_id } = req.body;

    if (!creador_id) {
      return res.status(400).json({ mensaje: 'Falta el creador' });
    }

    const creador = await Usuario.findByPk(creador_id);
    if (!creador || creador.rol !== 'creador') {
      return res.status(404).json({ mensaje: 'Creador no encontrado' });
    }

    const yaExiste = await Favorito.findOne({
      where: { seguidor_id: req.usuario.id, creador_id },
    });
    if (yaExiste) {
      return res.status(400).json({ mensaje: 'Ya tienes a este creador en favoritos' });
    }

    const favorito = await Favorito.create({
      seguidor_id: req.usuario.id,
      creador_id,
    });

    res.status(201).json({ mensaje: 'Creador agregado a favoritos', favorito });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

export async function listarFavoritos(req, res) {
  try {
    const favoritos = await Favorito.findAll({
      where: { seguidor_id: req.usuario.id },
      include: [{ model: Usuario, as: 'creador', attributes: ['id', 'nombre'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

export async function quitarFavorito(req, res) {
  try {
    const { creadorId } = req.params;

    const favorito = await Favorito.findOne({
      where: { seguidor_id: req.usuario.id, creador_id: creadorId },
    });

    if (!favorito) {
      return res.status(404).json({ mensaje: 'No está en tus favoritos' });
    }

    await favorito.destroy();
    res.json({ mensaje: 'Creador quitado de favoritos' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}