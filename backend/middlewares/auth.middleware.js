import { verifyToken } from '../utils/jwt.utils.js';

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