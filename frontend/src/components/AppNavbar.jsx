import { Link, useLocation, useNavigate } from 'react-router-dom';

function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  const cerrarSesion = () => { 
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const esActivo = (ruta) => {
    return location.pathname === ruta ? 'nav-link active-link' : 'nav-link';
  };

  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand brand-logo">
          <div>
            <strong>OnlyFlans</strong>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2 mt-3 mt-lg-0">
            <Link to="/" className={esActivo('/')}>
              Inicio
            </Link>

            <Link to="/creadores" className={esActivo('/creadores')}>
              Creadores
            </Link>

            {!usuario && (
              <>
                <Link to="/login" className={esActivo('/login')}>
                  Iniciar sesión
                </Link>

                <Link to="/registro" className="btn btn-warning btn-sm px-3">
                  Crear cuenta
                </Link>
              </>
            )}

            {usuario && (
              <>
                {usuario.rol === 'creador' && (
                  <Link
                    to="/panel-creador"
                    className={esActivo('/panel-creador')}
                  >
                    Panel creador
                  </Link>
                )}

                {usuario.rol === 'seguidor' && (
                  <Link
                    to="/panel-seguidor"
                    className={esActivo('/panel-seguidor')}
                  >
                    Panel seguidor
                  </Link>
                )}

                <div className="usuario-mini">
                  <div className="usuario-avatar">
                    {usuario.nombre?.charAt(0).toUpperCase()}
                  </div>

                  <div className="usuario-info">
                    <strong>{usuario.nombre}</strong>
                    <small>{usuario.rol}</small>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={cerrarSesion}
                >
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;