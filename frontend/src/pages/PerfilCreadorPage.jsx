import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

import Avatar from '../components/Avatar';
import Banner from '../components/Banner';

function PerfilCreadorPage() {
  const { id } = useParams(); 

  const [creador, setCreador] = useState(null);
  const [metas, setMetas] = useState([]);
  const [cantidadFlanes, setCantidadFlanes] = useState(1);

  const [cargando, setCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const cargarPerfil = async () => {
    setCargando(true);
    setMensajeError('');

    try {
      const respuestaPerfil = await api.get(`/usuarios/creador/${id}`);
      setCreador(respuestaPerfil.data);

      const respuestaMetas = await api.get(`/metas/creador/${id}`);
      setMetas(respuestaMetas.data);
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || 'Error al cargar el perfil del creador';

      setMensajeError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  const enviarFlanes = async () => {
    setMensajeError('');
    setMensajeExito('');

    try {
      await api.post('/donaciones', {
        creador_id: id,
        cantidad: Number(cantidadFlanes),
      });

      setMensajeExito('Flanes enviados correctamente');
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || 'Error al enviar flanes';

      setMensajeError(mensaje);
    }
  };

  const agregarFavorito = async () => {
    setMensajeError('');
    setMensajeExito('');

    try {
      await api.post('/favoritos', {
        creador_id: id,
      });

      setMensajeExito('Creador agregado a favoritos');
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || 'Error al agregar favorito';

      setMensajeError(mensaje);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, [id]);

  if (cargando) {
    return (
      <section className="container py-5">
        <div className="alert alert-info">Cargando perfil...</div>
      </section>
    );
  }

  if (mensajeError && !creador) {
    return (
      <section className="container py-5">
        <div className="alert alert-danger">{mensajeError}</div>
      </section>
    );
  }

  return (
    <section className="container py-5">
      {mensajeError && (
        <div className="alert alert-danger">{mensajeError}</div>
      )}

      {mensajeExito && (
        <div className="alert alert-success">{mensajeExito}</div>
      )}

      <div className="card shadow-sm border-0 mb-4">
        <Banner
          src={creador?.banner}
          nombre={creador?.nombre}
          height={240}
          className="card-img-top"
        />

        <div className="card-body text-center">
          {creador?.foto ? (
            <img
              src={creador.foto}
              alt={creador.nombre}
              className="rounded-circle mb-3"
              style={{
                width: '110px',
                height: '110px',
                objectFit: 'cover',
                marginTop: '-70px',
                border: '5px solid white',
              }}
            />
          ) : (
            <div
              className="rounded-circle bg-light mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: '110px',
                height: '110px',
                marginTop: '-70px',
                border: '5px solid white',
                fontSize: '40px',
              }}
            >
              <Avatar src={creador.foto} nombre={creador.nombre} size={80} />
            </div>
          )}

          <h1 className="fw-bold text-primary">{creador?.nombre}</h1>
          <p className="text-muted">Creador de contenido en OnlyFlans</p>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={agregarFavorito}
          >
            Marcar como favorito
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-7">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h3 className="mb-3">Metas de apoyo</h3>

              {metas.length === 0 && (
                <p className="text-muted">
                  Este creador todavía no tiene metas publicadas.
                </p>
              )}

              {metas.map((meta) => (
                <div className="border rounded p-3 mb-3" key={meta.id}>
                  <h5>{meta.titulo}</h5>
                  <p className="mb-0 text-muted">{meta.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3 className="mb-3">Enviar flanes</h3>

              <p className="text-muted">
                Cada flan representa un apoyo simbólico para el creador.
              </p>

              <label className="form-label">Cantidad de flanes</label>
              <input
                type="number"
                min="1"
                className="form-control mb-3"
                value={cantidadFlanes}
                onChange={(e) => setCantidadFlanes(e.target.value)}
              />

              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={enviarFlanes}
              >
                Enviar flanes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PerfilCreadorPage;