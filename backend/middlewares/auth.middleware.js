import { verifyToken } from '../utils/jwt.utils.js';
import { Donacion } from '../models/asociaciones.js';

export function autenticar(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'No se proporcionó token' });
    }
    const token = authHeader.split(' ')[1];

    const datos = verifyToken(token);

    req.usuario = datos;

    next();

  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

export function permitirRol(rolPermitido) {
  return (req, res, next) => {
    if (req.usuario.rol !== rolPermitido) {
      return res.status(403).json({ mensaje: 'No tienes permiso para esta acción' });
    }
    next();
  };
}

export async function verificarDonacion(req, res, next) {
  try {
    const creadorId = req.params.creadorId;

    if (req.usuario.rol === 'creador' && req.usuario.id == creadorId) {
      return next();
    }

    const donacion = await Donacion.findOne({
      where: {
        seguidor_id: req.usuario.id,
        creador_id: creadorId,
      },
    });

    if (!donacion) {
      return res.status(403).json({
        mensaje: 'Debes donar al menos un flan para ver las publicaciones de este creador',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}