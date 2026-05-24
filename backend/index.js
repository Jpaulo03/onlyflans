import express from 'express';
import sequelize from './config/database.js';
import './models/asociaciones.js';
import usuarioRoutes from './routes/usuario.routes.js';
import postRoutes from './routes/post.routes.js';
import donacionRoutes from './routes/donacion.routes.js';
import metaRoutes from './routes/meta.routes.js';
import comentarioRoutes from './routes/comentario.routes.js';
import favoritoRoutes from './routes/favorito.routes.js';


const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/donaciones', donacionRoutes);
app.use('/api/metas', metaRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/favoritos', favoritoRoutes);

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