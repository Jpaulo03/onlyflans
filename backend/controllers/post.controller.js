import { Post, Comentario, Usuario } from '../models/asociaciones.js';

export async function crearPost(req, res) {
  try {
    const { texto, imagen } = req.body;

    if (!texto) {
      return res.status(400).json({ mensaje: 'El texto es obligatorio' });
    }

    const nuevoPost = await Post.create({
      texto,
      imagen: imagen || null,
      creador_id: req.usuario.id,
    });

    res.status(201).json({ mensaje: 'Post creado', post: nuevoPost });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

export async function listarPostsDeCreador(req, res) {
  try {
    const { creadorId } = req.params;

    const posts = await Post.findAll({
      where: { creador_id: creadorId },
      order: [['createdAt', 'DESC']],
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

export async function verPost(req, res) {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: [{ model: Comentario }],
    });

    if (!post) {
      return res.status(404).json({ mensaje: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}