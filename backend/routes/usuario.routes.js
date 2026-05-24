import express from 'express';
import { registrar, login } from '../controllers/usuario.controller.js';
import { autenticar, permitirRol } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/registro', registrar);
router.post('/login', login);

router.get('/perfil', autenticar, permitirRol('creador'), (req, res) => {
  res.json({ mensaje: 'Accediste como creador', usuario: req.usuario });
});

export default router;