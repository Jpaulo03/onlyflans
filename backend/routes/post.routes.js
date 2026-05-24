import express from 'express';
import { crearPost, listarPostsDeCreador, verPost, feedSeguidor } from '../controllers/post.controller.js';
import { autenticar, permitirRol, verificarDonacion } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/feed', autenticar, permitirRol('seguidor'), feedSeguidor);

router.post('/', autenticar, permitirRol('creador'), crearPost);

router.get('/creador/:creadorId', autenticar, verificarDonacion, listarPostsDeCreador);

router.get('/:id', autenticar, verPost);

export default router;