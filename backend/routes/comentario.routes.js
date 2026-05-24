import express from 'express';
import { crearComentario, comentariosDePost } from '../controllers/comentario.controller.js';
import { autenticar, permitirRol } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', autenticar, permitirRol('seguidor'), crearComentario);

router.get('/post/:postId', autenticar, permitirRol('creador'), comentariosDePost);

export default router;