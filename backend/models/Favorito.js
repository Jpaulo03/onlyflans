import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Favorito = sequelize.define('Favorito',{

}, {
    tableName: 'favoritos'
});

export default Favorito;