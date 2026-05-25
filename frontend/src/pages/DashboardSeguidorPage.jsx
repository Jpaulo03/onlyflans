import { useEffect, useState } from 'react';
import api from '../api/api';

import Avatar from '../components/Avatar';

function DashboardSeguidorPage() {
  const [usuarioGuardado] = useState(() =>
    JSON.parse(localStorage.getItem('usuario') || 'null')
  );

  const [posts, setPosts] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [comentarios, setComentarios] = useState({});

  const [historialDonaciones, setHistorialDonaciones] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [buscarCreador, setBuscarCreador] = useState('');

  const [cargandoFeed, setCargandoFeed] = useState(true);
  const [cargandoFavoritos, setCargandoFavoritos] = useState(true);

  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const totalFlanesHistorial = historialDonaciones.reduce(
    (total, donacion) => total + Number(donacion.cantidad || 0),
    0
  );

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      try {
        const respuestaFeed = await api.get('/posts/feed');
        const respuestaFavoritos = await api.get('/favoritos');

        if (activo) {
          setPosts(respuestaFeed.data);
          setFavoritos(respuestaFavoritos.data);
        }
      } catch (error) {
        if (activo) {
          const mensaje =
            error.response?.data?.mensaje ||
            'Error al cargar datos del seguidor';

          setMensajeError(mensaje);
        }
      } finally {
        if (activo) {
          setCargandoFeed(false);
          setCargandoFavoritos(false);
        }
      }
    };

    if (usuarioGuardado) {
      cargarDatos();
    }

    return () => {
      activo = false;
    };
  }, [usuarioGuardado]);

  const quitarFavorito = async (creadorId) => {
    setMensajeError('');
    setMensajeExito('');

    try {
      await api.delete(`/favoritos/${creadorId}`);

      const favoritosActualizados = favoritos.filter(
        (favorito) => Number(favorito.creador_id) !== Number(creadorId)
      );

      setFavoritos(favoritosActualizados);

      const postsActualizados = posts.filter(
        (post) => Number(post.creador_id) !== Number(creadorId)
      );

      setPosts(postsActualizados);

      setMensajeExito('Creador quitado de favoritos');
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || 'Error al quitar favorito';

      setMensajeError(mensaje);
    }
  };

  const cambiarComentario = (postId, texto) => {
    setComentarios({
      ...comentarios,
      [postId]: texto,
    });
  };

  const enviarComentario = async (postId) => {
    setMensajeError('');
    setMensajeExito('');

    const texto = comentarios[postId];

    if (!texto || texto.trim() === '') {
      setMensajeError('El comentario no puede estar vacío');
      return;
    }

    try {
      await api.post('/comentarios', {
        post_id: postId,
        texto,
      });

      setComentarios({
        ...comentarios,
        [postId]: '',
      });

      setMensajeExito('Comentario enviado correctamente');
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || 'Error al enviar comentario';

      setMensajeError(mensaje);
    }
  };

  const cargarHistorialDonaciones = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setMensajeError('');
    setMensajeExito('');
    setCargandoHistorial(true);

    try {
      const respuesta = await api.get('/donaciones/historial', {
        params: {
          fechaInicio,
          fechaFin,
        },
      });

      let datos = respuesta.data;

      if (buscarCreador.trim() !== '') {
        datos = datos.filter((donacion) =>
          donacion.creador?.nombre
            ?.toLowerCase()
            .includes(buscarCreador.toLowerCase())
        );
      }

      setHistorialDonaciones(datos);
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje ||
        'Error al cargar historial de donaciones';

      setMensajeError(mensaje);
    } finally {
      setCargandoHistorial(false);
    }
  };

  if (!usuarioGuardado) {
    return (
      <section className="container py-5">
        <div className="alert alert-warning">
          Debes iniciar sesión para ver el panel del seguidor.
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold text-primary">Feed de publicaciones</h1>
        <p className="text-muted">
          Bienvenido, {usuarioGuardado?.nombre}.
        </p>
      </div>

      {mensajeError && (
        <div className="alert alert-danger">{mensajeError}</div>
      )}

      {mensajeExito && (
        <div className="alert alert-success">{mensajeExito}</div>
      )}

      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="mb-3">Feed de publicaciones</h3>

              {cargandoFeed && (
                <div className="alert alert-info">
                  Cargando publicaciones...
                </div>
              )}

              {!cargandoFeed && posts.length === 0 && (
                <div className="alert alert-warning">
                  Todavía no hay publicaciones para mostrar. Agrega creadores a
                  favoritos para ver su contenido aquí.
                </div>
              )}

              {posts.map((post) => (
                <div className="border rounded p-3 mb-3" key={post.id}>
                  <div className="d-flex align-items-center mb-3">
                    {post.Usuario?.foto ? (
                      <img
                        src={post.Usuario.foto}
                        alt={post.Usuario.nombre}
                        className="rounded-circle me-2"
                        style={{
                          width: '42px',
                          height: '42px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-warning-subtle d-flex align-items-center justify-content-center me-2 ms-2"
                        style={{ width: '42px', height: '42px' }}
                      >
                        <a href={`/creadores/${post.Usuario.id}`}>
                          <Avatar src={post.Usuario?.foto} nombre={post.Usuario?.nombre || 'Creador'} size={80} />
                        </a>
                      </div>
                    )}

                    <div>
                      <strong>{post.Usuario?.nombre || 'Creador'}</strong>
                      <br />
                      <small className="text-muted ms-3">
                        {new Date(post.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>

                  <p>{post.texto}</p>

                  {post.imagen && (
                    <img
                      src={post.imagen}
                      alt="Imagen de la publicación"
                      className="img-fluid rounded"
                      style={{
                        maxHeight: '300px',
                        objectFit: 'cover',
                      }}
                    />
                  )}

                  <div className="mt-3">
                    <label className="form-label">Dejar comentario</label>

                    <textarea
                      className="form-control mb-2"
                      rows="2"
                      placeholder="Escribe un comentario para el creador..."
                      value={comentarios[post.id] || ''}
                      onChange={(e) =>
                        cambiarComentario(post.id, e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => enviarComentario(post.id)}
                    >
                      Enviar comentario
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="mb-3">Mis favoritos</h3>

              {cargandoFavoritos && (
                <div className="alert alert-info">Cargando favoritos...</div>
              )}

              {!cargandoFavoritos && favoritos.length === 0 && (
                <div className="alert alert-warning">
                  Todavía no tienes creadores favoritos.
                </div>
              )}

              {favoritos.map((favorito) => (
                <div className="border rounded p-3 mb-3" key={favorito.id}>
                  <a href={`/creadores/${favorito.creador_id}`} className= "text-decoration-none text-dark">
                    <h5>{favorito.creador?.nombre}</h5>
                  </a>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => quitarFavorito(favorito.creador_id)}
                  >
                    Quitar de favoritos
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="mb-3 text-primary">Historial de donaciones</h3>

              <form
                className="row g-3 mb-4"
                onSubmit={cargarHistorialDonaciones}
              >
                <div className="col-md-3">
                  <label className="form-label">Fecha inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Fecha fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Buscar por creador</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: testcreador"
                    value={buscarCreador}
                    onChange={(e) => setBuscarCreador(e.target.value)}
                  />
                </div>

                <div className="col-md-2 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary w-100">
                    Filtrar
                  </button>
                </div>
              </form>

              {cargandoHistorial && (
                <div className="alert alert-info">Cargando historial...</div>
              )}

              {!cargandoHistorial && historialDonaciones.length === 0 && (
                <div className="alert alert-warning">
                  No hay donaciones para mostrar. Usa el botón Filtrar para
                  cargar el historial.
                </div>
              )}

              {historialDonaciones.length > 0 && (
                <>
                  <div className="alert alert-success">
                    Total de flanes enviados: <strong>{totalFlanesHistorial}</strong>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-striped align-middle">
                      <thead>
                        <tr>
                          <th>Creador</th>
                          <th>Cantidad de flanes</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>

                      <tbody>
                        {historialDonaciones.map((donacion) => (
                          <tr key={donacion.id}>
                            <td>{donacion.creador?.nombre || 'Creador'}</td>
                            <td>{donacion.cantidad}</td>
                            <td>
                              {new Date(donacion.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardSeguidorPage;