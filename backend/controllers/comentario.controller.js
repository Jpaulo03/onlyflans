import { Comentario, Post, Usuario } from '../models/asociaciones.js';

export async function crearComentario(req, res) {
  try {
    const { post_id, texto } = req.body;

    if (!post_id || !texto) {
      return res.status(400).json({ mensaje: 'Faltan datos (post_id y texto)' });
    }

    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ mensaje: 'El post no existe' });
    }

    const comentario = await Comentario.create({
      post_id,
      texto,
      seguidor_id: req.usuario.id,
    });

    res.status(201).json({ mensaje: 'Comentario publicado', comentario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

export async function comentariosDePost(req, res) {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ mensaje: 'El post no existe' });
    }

    if (post.creador_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'Solo el creador del post puede ver los comentarios' });
    }

    const comentarios = await Comentario.findAll({
      where: { post_id: postId },
      include: [{ model: Usuario, as: 'seguidor', attributes: ['id', 'nombre'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}