import express from 'express';
import { registrar, login, actualizarPerfil, verPerfilCreador, listarCreadores } from '../controllers/usuario.controller.js';
import { autenticar, permitirRol } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/registro', registrar);
router.post('/login', login);

router.get('/creadores', autenticar, listarCreadores);

router.put('/perfil', autenticar, permitirRol('creador'), actualizarPerfil);

router.get('/creador/:id', autenticar, verPerfilCreador);

export default router;