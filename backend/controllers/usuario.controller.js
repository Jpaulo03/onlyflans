import { Usuario } from '../models/asociaciones.js';
import { Op } from 'sequelize'; 
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

export async function actualizarPerfil(req, res) {
  try {
    const { nombre, foto, banner } = req.body;

    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (nombre) usuario.nombre = nombre;
    if (foto) usuario.foto = foto;
    if (banner) usuario.banner = banner;

    await usuario.save();

    res.json({
      mensaje: 'Perfil actualizado',
      usuario: { id: usuario.id, nombre: usuario.nombre, foto: usuario.foto, banner: usuario.banner },
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

export async function verPerfilCreador(req, res) {
  try {
    const { id } = req.params;

    const creador = await Usuario.findByPk(id, {
      attributes: ['id', 'nombre', 'foto', 'banner', 'rol'],
    });

    if (!creador || creador.rol !== 'creador') {
      return res.status(404).json({ mensaje: 'Creador no encontrado' });
    }

    res.json(creador);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}

export async function listarCreadores(req, res) {
  try {
    const { buscar } = req.query;

    const condiciones = { rol: 'creador' };

    if (buscar) {
      condiciones.nombre = { [Op.like]: `%${buscar}%` };
    }

    const creadores = await Usuario.findAll({
      where: condiciones,
      attributes: ['id', 'nombre', 'foto', 'banner'],
      order: [['nombre', 'ASC']],
    });

    res.json(creadores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
}