import express from 'express';
import { crearMeta, listarMetasDeCreador, borrarMeta } from '../controllers/meta.controller.js';
import { autenticar, permitirRol } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', autenticar, permitirRol('creador'), crearMeta);

router.get('/creador/:creadorId', autenticar, listarMetasDeCreador);

router.delete('/:id', autenticar, permitirRol('creador'), borrarMeta);

export default router;