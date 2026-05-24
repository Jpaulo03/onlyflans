import Usuario from './Usuario.js';
import Post from './Post.js';
import Meta from './Meta.js';
import Favorito from './Favorito.js';
import Donacion from './Donacion.js';
import Comentario from './Comentario.js';

Usuario.hasMany(Post, { foreignKey: 'creador_id'});
Post.belongsTo(Usuario, {foreignKey: 'creador_id'});

Usuario.hasMany(Meta, {foreignKey: 'creador_id'});
Meta.belongsTo(Usuario, {foreignKey: 'creador_id'});

Post.hasMany(Comentario, {foreignKey: 'post_id'});
Comentario.belongsTo(Post, {foreignKey: 'post_id'});

Usuario.hasMany(Comentario, {foreignKey: 'seguidor_id'});
Comentario.belongsTo(Usuario, {foreignKey: 'seguidor_id'});

Usuario.hasMany(Donacion, { foreignKey: 'seguidor_id', as: 'donacionesEnviadas' });
Usuario.hasMany(Donacion, { foreignKey: 'creador_id', as: 'donacionesRecibidas' });
Donacion.belongsTo(Usuario, { foreignKey: 'seguidor_id', as: 'seguidor' });
Donacion.belongsTo(Usuario, { foreignKey: 'creador_id', as: 'creador' });

Usuario.hasMany(Favorito, { foreignKey: 'seguidor_id' });
Usuario.hasMany(Favorito, { foreignKey: 'creador_id' });
Favorito.belongsTo(Usuario, { foreignKey: 'seguidor_id', as: 'seguidor' });
Favorito.belongsTo(Usuario, { foreignKey: 'creador_id', as: 'creador' });

export {Usuario, Post, Meta, Favorito, Donacion, Comentario}; 