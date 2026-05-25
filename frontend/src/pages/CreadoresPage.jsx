import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import Avatar from '../components/Avatar';
import Banner from '../components/Banner';

function CreadoresPage() {
  const [creadores, setCreadores] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    let componenteActivo = true;

    const cargarCreadoresIniciales = async () => {
      try {
        const respuesta = await api.get('/usuarios/creadores');

        if (componenteActivo) {
          setCreadores(respuesta.data);
        }
      } catch (error) {
        if (componenteActivo) {
          const mensaje =
            error.response?.data?.mensaje || 'Error al cargar creadores';

          setMensajeError(mensaje);
        }
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarCreadoresIniciales();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const buscarCreadores = async (e) => {
    e.preventDefault();

    setCargando(true);
    setMensajeError('');

    try {
      const respuesta = await api.get('/usuarios/creadores', {
        params: {
          buscar,
        },
      });

      setCreadores(respuesta.data);
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || 'Error al buscar creadores';

      setMensajeError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold text-primary">Creadores</h1>
        <p className="text-muted">
          Explora creadores y entra a sus perfiles para apoyarlos con flanes.
        </p>
      </div>

      <form className="row g-2 mb-4" onSubmit={buscarCreadores}>
        <div className="col-md-10">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar creador por nombre..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            Buscar
          </button>
        </div>
      </form>

      {mensajeError && (
        <div className="alert alert-danger">
          {mensajeError}
        </div>
      )}

      {cargando && (
        <div className="alert alert-info">
          Cargando creadores...
        </div>
      )}

      {!cargando && creadores.length === 0 && (
        <div className="alert alert-warning">
          No se encontraron creadores.
        </div>
      )}

      <div className="row">
        {creadores.map((creador) => (
          <div className="col-md-4 mb-4" key={creador.id}>
            <div className="card shadow-sm border-0 h-100">
              <Banner
                src={creador.banner}
                nombre={creador.nombre}
                height={140}
                className="card-img-top"
              />

              <div className="card-body text-center">
                {creador.foto ? (
                  <img
                    src={creador.foto}
                    alt={creador.nombre}
                    className="rounded-circle mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      marginTop: '-50px',
                      border: '4px solid white',
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      marginTop: '-50px',
                      border: '4px solid white',
                    }}
                  >
                    <Avatar src={creador.foto} nombre={creador.nombre} size={80} />
                  </div>
                )}

                <h5 className="card-title">{creador.nombre}</h5>

                <Link
                  to={`/creadores/${creador.id}`}
                  className="btn btn-outline-warning w-100 mt-3"
                >
                  Ver perfil
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CreadoresPage;