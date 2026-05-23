import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Meta = sequelize.define('Meta', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    tableName: 'metas'
});

export default Meta;