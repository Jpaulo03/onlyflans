import express from 'express';
import sequelize from './config/database.js';
import Usuario from './models/Usuario.js';
import './models/asociaciones.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hola mundo desde el backend!');
});

async function iniciarServidor(){
    try{
        await sequelize.authenticate();
        console.log('Conexion a la base de datos exitosa');

        await sequelize.sync();
        console.log('Tablas sincronizadas');

        app.listen(PORT, () =>{
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch(error){
        console.error('Error al iniciar: ', error);
    }
}

iniciarServidor();