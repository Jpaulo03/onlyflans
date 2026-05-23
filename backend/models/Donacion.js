import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Donacion = sequelize.define('Donacion', {
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, {
        tableName: 'donaciones'
    });

export default Donacion;