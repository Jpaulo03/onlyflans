import { useEffect, useState } from 'react';
import api from '../api/api';

function DashboardCreadorPage() {
  const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || 'null');

  const [nombre, setNombre] = useState(usuarioGuardado?.nombre || '');
  const [foto, setFoto] = useState(usuarioGuardado?.foto || '');
  const [banner, setBanner] = useState(usuarioGuardado?.banner || '');

  const [tituloMeta, setTituloMeta] = useState('');
  const [descripcionMeta, setDescripcionMeta] = useState('');
  const [metas, setMetas] = useState([]);

  const [textoPost, setTextoPost] = useState('');
  const [imagenPost, setImagenPost] = useState('');
  const [posts, setPosts] = useState([]);

  const [comentariosPorPost, setComentariosPorPost] = useState({});
  const [postComentariosAbierto, setPostComentariosAbierto] = useState(null);

  const [reporteIngresos, setReporteIngresos] = useState(null);
  const [cargandoReporte, setCargandoReporte] = useState(false);
  const [fechaInicioReporte, setFechaInicioReporte] = useState('');
  const [fechaFinReporte, setFechaFinReporte] = useState('');

  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargandoMetas, setCargandoMetas] = useState(true);
  const [cargandoPosts, setCargandoPosts] = useState(true);

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      try {
        const respuestaMetas = await api.get(
          `/metas/creador/${usuarioGuardado.id}`
        );

        const respuestaPosts = await api.get(
          `/posts/creador/${usuarioGuardado.id}`
        );

        if (activo) {
          setMetas(respuestaMetas.data);
          setPosts(respuestaPosts.data);
        }
      } catch (error) {
        if (activo) {
          const mensaje =
            error.response?.data?.mensaje ||
            'Error al cargar datos del creador';

          setMensajeError(mensaje);
        }
      } finally {
        if (activo) {
          setCargandoMetas(false);
          setCargandoPosts(false);
        }
      }
    };

    if (usuarioGuardado?.id) {
      cargarDatos();
    }

    return () => {
      activo = false;
    };
  }, [usuarioGuardado?.id]);

  const actualizarPerfil = async (e) => {
    e.preventDefault();

    setMensajeError('');
    setMensajeExito('');

    try {
      const respuesta = await api.put('/usuarios/perfil', {
        nombre,
        foto,
        banner,
      });

      const usuarioActualizado = {
        ...usuarioGuardado,
        nombre: respuesta.data.usuario.nombre,
        foto: respuesta.data.usuario.foto,
        banner: respuesta.data.usuario.banner,
      };

      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

      setMensajeExito('Perfil actualizado correctamente');
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || 'Error al actualizar perfil';

      setMensajeError(mensaje);
    }
  };

  const crearMeta = async (e) => {
    e.preventDefault();

    setMensajeError('');
    setMensajeExito('');

    try {
      const respuesta = await api.post('/metas', {
        titulo: tituloMeta,
        descripcion: descripcionMeta,
      });

      setMetas([respuesta.data.meta, ...metas]);
      setTituloMeta('');
      setDescripcionMeta('');
      setMensajeExito('Meta creada correctamente');
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al crear meta';

      setMensajeError(mensaje);
    }
  };

  const eliminarMeta = async (id) => {
    setMensajeError('');
    setMensajeExito('');

    try {
      await api.delete(`/metas/${id}`);

      const metasActualizadas = metas.filter((meta) => meta.id !== id);
      setMetas(metasActualizadas);

      setMensajeExito('Meta eliminada correctamente');
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al eliminar meta';

      setMensajeError(mensaje);
    }
  };

  const crearPost = async (e) => {
    e.preventDefault();

    setMensajeError('');
    setMensajeExito('');

    try {
      const respuesta = await api.post('/posts', {
        texto: textoPost,
        imagen: imagenPost || null,
      });

      setPosts([respuesta.data.post, ...posts]);
      setTextoPost('');
      setImagenPost('');
      setMensajeExito('Publicación creada correctamente');
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || 'Error al crear publicación';

      setMensajeError(mensaje);
    }
  };

  const verComentarios = async (postId) => {
    setMensajeError('');
    setMensajeExito('');

    if (postComentariosAbierto === postId) {
      setPostComentariosAbierto(null);
      return;
    }

    try {
      const respuesta = await api.get(`/comentarios/post/${postId}`);

      setComentariosPorPost({
        ...comentariosPorPost,
        [postId]: respuesta.data,
      });

      setPostComentariosAbierto(postId);
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || 'Error al cargar comentarios';

      setMensajeError(mensaje);
    }
  };

  const cargarReporteIngresos = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setMensajeError('');
    setMensajeExito('');
    setCargandoReporte(true);

    try {
      const respuesta = await api.get('/donaciones/reporte', {
        params: {
          fechaInicio: fechaInicioReporte,
          fechaFin: fechaFinReporte,
        },
      });

      setReporteIngresos(respuesta.data);
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || 'Error al cargar reporte de ingresos';

      setMensajeError(mensaje);
    } finally {
      setCargandoReporte(false);
    }
  };

  if (!usuarioGuardado) {
    return (
      <section className="container py-5">
        <div className="alert alert-warning">
          Debes iniciar sesión para ver el panel del creador.
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold text-warning-emphasis">Panel del creador</h1>
        <p className="text-muted">
          Bienvenido, {usuarioGuardado?.nombre}. Desde aquí puedes administrar
          tu perfil, tus metas, tus publicaciones, los comentarios recibidos y
          tus ingresos.
        </p>
      </div>

      {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

      {mensajeExito && (
        <div className="alert alert-success">{mensajeExito}</div>
      )}

      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="mb-3">Mi perfil público</h3>

              <form onSubmit={actualizarPerfil}>
                <div className="mb-3">
                  <label className="form-label">Nombre público</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Limberg Creador"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">URL de foto de perfil</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pega una URL de imagen"
                    value={foto}
                    onChange={(e) => setFoto(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">URL de banner</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pega una URL para el banner"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-warning w-100">
                  Guardar perfil
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-7 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="mb-3">Crear meta de apoyo</h3>

              <form onSubmit={crearMeta}>
                <div className="mb-3">
                  <label className="form-label">Título de la meta</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Nueva cámara para grabar contenido"
                    value={tituloMeta}
                    onChange={(e) => setTituloMeta(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Explica para qué necesitas el apoyo..."
                    value={descripcionMeta}
                    onChange={(e) => setDescripcionMeta(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-warning">
                  Crear meta
                </button>
              </form>

              <hr />

              <h4 className="mb-3">Mis metas</h4>

              {cargandoMetas && (
                <div className="alert alert-info">Cargando metas...</div>
              )}

              {!cargandoMetas && metas.length === 0 && (
                <div className="alert alert-warning">
                  Todavía no tienes metas creadas.
                </div>
              )}

              {metas.map((meta) => (
                <div
                  className="border rounded p-3 mb-3 d-flex justify-content-between align-items-start"
                  key={meta.id}
                >
                  <div>
                    <h5>{meta.titulo}</h5>
                    <p className="text-muted mb-0">{meta.descripcion}</p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => eliminarMeta(meta.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="mb-3">Crear publicación</h3>

              <form onSubmit={crearPost}>
                <div className="mb-3">
                  <label className="form-label">Texto de la publicación</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Escribe algo para tus seguidores..."
                    value={textoPost}
                    onChange={(e) => setTextoPost(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">URL de imagen opcional</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pega una URL de imagen"
                    value={imagenPost}
                    onChange={(e) => setImagenPost(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-warning w-100">
                  Publicar
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-7 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="mb-3">Mis publicaciones</h3>

              {cargandoPosts && (
                <div className="alert alert-info">
                  Cargando publicaciones...
                </div>
              )}

              {!cargandoPosts && posts.length === 0 && (
                <div className="alert alert-warning">
                  Todavía no tienes publicaciones.
                </div>
              )}

              {posts.map((post) => (
                <div className="border rounded p-3 mb-3" key={post.id}>
                  <p>{post.texto}</p>

                  {post.imagen && (
                    <img
                      src={post.imagen}
                      alt="Imagen de la publicación"
                      className="img-fluid rounded"
                      style={{ maxHeight: '260px', objectFit: 'cover' }}
                    />
                  )}

                  <small className="text-muted d-block mt-2">
                    Publicado el: {new Date(post.createdAt).toLocaleString()}
                  </small>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm mt-3"
                    onClick={() => verComentarios(post.id)}
                  >
                    {postComentariosAbierto === post.id
                      ? 'Ocultar comentarios'
                      : 'Ver comentarios'}
                  </button>

                  {postComentariosAbierto === post.id && (
                    <div className="mt-3 bg-light rounded p-3">
                      <h6 className="fw-bold">Comentarios recibidos</h6>

                      {comentariosPorPost[post.id]?.length === 0 && (
                        <p className="text-muted mb-0">
                          Esta publicación todavía no tiene comentarios.
                        </p>
                      )}

                      {comentariosPorPost[post.id]?.map((comentario) => (
                        <div className="border-bottom py-2" key={comentario.id}>
                          <strong>
                            {comentario.seguidor?.nombre || 'Seguidor'}
                          </strong>

                          <p className="mb-1">{comentario.texto}</p>

                          <small className="text-muted">
                            {new Date(comentario.createdAt).toLocaleString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
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
              <h3 className="mb-3">Reporte de ingresos</h3>

              <p className="text-muted">
                Consulta los flanes recibidos en un rango de fechas.
              </p>

              <form className="row g-3 mb-4" onSubmit={cargarReporteIngresos}>
                <div className="col-md-4">
                  <label className="form-label">Fecha inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaInicioReporte}
                    onChange={(e) => setFechaInicioReporte(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Fecha fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaFinReporte}
                    onChange={(e) => setFechaFinReporte(e.target.value)}
                  />
                </div>

                <div className="col-md-4 d-flex align-items-end">
                  <button type="submit" className="btn btn-warning w-100">
                    Generar reporte
                  </button>
                </div>
              </form>

              {cargandoReporte && (
                <div className="alert alert-info">Cargando reporte...</div>
              )}

              {reporteIngresos && (
                <>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <div className="border rounded p-3 bg-warning-subtle">
                        <h5>Total de flanes recibidos</h5>
                        <h2 className="fw-bold mb-0">
                          {reporteIngresos.totalFlanes}
                        </h2>
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <div className="border rounded p-3 bg-light">
                        <h5>Cantidad de donaciones</h5>
                        <h2 className="fw-bold mb-0">
                          {reporteIngresos.cantidadDonaciones}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {reporteIngresos.historial.length === 0 && (
                    <div className="alert alert-warning">
                      No hay donaciones en el rango seleccionado.
                    </div>
                  )}

                  {reporteIngresos.historial.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped align-middle">
                        <thead>
                          <tr>
                            <th>Seguidor</th>
                            <th>Cantidad de flanes</th>
                            <th>Fecha</th>
                          </tr>
                        </thead>

                        <tbody>
                          {reporteIngresos.historial.map((donacion) => (
                            <tr key={donacion.id}>
                              <td>
                                {donacion.seguidor?.nombre || 'Seguidor'}
                              </td>
                              <td>{donacion.cantidad}</td>
                              <td>
                                {new Date(
                                  donacion.createdAt
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {!reporteIngresos && !cargandoReporte && (
                <div className="alert alert-warning">
                  Usa el botón Generar reporte para ver tus ingresos.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardCreadorPage;