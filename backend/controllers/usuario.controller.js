import { Usuario } from '../models/asociaciones.js';
import { sha1Encode } from '../utils/text.utils.js';
import { generateToken  } from '../utils/jwt.utils.js';
import { esquemaRegistro  } from '../utils/validaciones.js';
import { esquemaLogin } from '../utils/validaciones.js';

export async function registrar(req, res) {
    try{
        const {error} = esquemaRegistro.validate(req.body);
        if(error) {
            return res.status(400).json({ mensaje: error.details[0].message });
        }
        const { nombre, email, password, rol } = req.body;

        const existe = await Usuario.findOne({ where: {email} });
        if(existe) {
            return res.status(400).json({ mensaje: 'El email ya esta registrado'});
        }

        const passwordEncriptada = sha1Encode(password);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: passwordEncriptada,
            rol
        });

        const token = generateToken({ id: nuevoUsuario.id, rol: nuevoUsuario.rol });

        res.status(201).json({
            mensaje: 'Usuario registrado con exito',
            token,
            usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol }
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message }); 
    }
}

export async function login(req, res) {
  try {
    const { error } = esquemaLogin.validate(req.body);
    if (error) {
      return res.status(400).json({ mensaje: error.details[0].message });
    }

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    const passwordEncriptada = sha1Encode(password);
    if (passwordEncriptada !== usuario.password) {
      return res.status(400).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    const token = generateToken({ id: usuario.id, rol: usuario.rol });

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}