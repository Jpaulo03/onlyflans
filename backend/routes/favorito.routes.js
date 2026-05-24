import express from 'express';
import { marcarFavorito, listarFavoritos, quitarFavorito } from '../controllers/favorito.controller.js';
import { autenticar, permitirRol } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', autenticar, permitirRol('seguidor'), marcarFavorito);
router.get('/', autenticar, permitirRol('seguidor'), listarFavoritos);
router.delete('/:creadorId', autenticar, permitirRol('seguidor'), quitarFavorito);

export default router;