import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const Usuario = sequelize.define('Usuario', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    foto: {
    type: DataTypes.STRING,
    allowNull: true,
    },
    banner: {
    type: DataTypes.STRING,
    allowNull: true, 
    },
}, {
    tableName: 'usuarios'
});


export default Usuario;