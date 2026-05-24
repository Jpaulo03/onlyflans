import express from 'express';
import { crearPost, listarPostsDeCreador, verPost } from '../controllers/post.controller.js';
import { autenticar, permitirRol } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', autenticar, permitirRol('creador'), crearPost);

router.get('/creador/:creadorId', autenticar, listarPostsDeCreador);

router.get('/:id', autenticar, verPost);

export default router;