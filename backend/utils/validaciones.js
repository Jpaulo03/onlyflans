import Joi from 'joi';

export const esquemaRegistro = Joi.object({
  nombre: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  rol: Joi.string().valid('creador', 'seguidor').required(),
});

export const esquemaLogin = Joi.object({ 
  email: Joi.string().email().required(),
  password: Joi.string().required(),
 });