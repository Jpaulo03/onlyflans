import express from 'express';
import { enviarFlanes, historialSeguidor, reporteCreador } from '../controllers/donacion.controller.js';
import { autenticar, permitirRol } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', autenticar, permitirRol('seguidor'), enviarFlanes);

router.get('/historial', autenticar, permitirRol('seguidor'), historialSeguidor);

router.get('/reporte', autenticar, permitirRol('creador'), reporteCreador);

export default router;