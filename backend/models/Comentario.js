import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Comentario = sequelize.define('Comentario', {
    texto: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    tableName: 'comentarios'
});

export default Comentario;
