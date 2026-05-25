import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import CreadoresPage from './pages/CreadoresPage';
import PerfilCreadorPage from './pages/PerfilCreadorPage';
import DashboardCreadorPage from './pages/DashboardCreadorPage';
import DashboardSeguidorPage from './pages/DashboardSeguidorPage';

function InicioPage() {
  return (
    <section className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-7">
          <span className="badge text-bg-warning mb-3">
            Plataforma para apoyar creadores
          </span>

          <h1 className="display-4 fw-bold text-warning-emphasis">
            Bienvenido a OnlyFlans
          </h1>

          <p className="lead mt-3">
            Apoya a tus creadores favoritos comprándoles flanes simbólicos.
          </p>

          <div className="d-flex gap-3 mt-4">
            <Link to="/registro" className="btn btn-warning btn-lg">
              Crear cuenta
            </Link>

            <Link to="/creadores" className="btn btn-outline-warning btn-lg">
              Ver creadores
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  useLocation();

  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold text-warning">
            OnlyFlans
          </Link>

          <div className="navbar-nav ms-auto gap-2 align-items-center">
            <Link to="/" className="nav-link">
              Inicio
            </Link>

            <Link to="/creadores" className="nav-link">
              Creadores
            </Link>

            {!usuario && (
              <>
                <Link to="/login" className="nav-link">
                  Iniciar sesión
                </Link>

                <Link to="/registro" className="btn btn-warning">
                  Registrarse
                </Link>
              </>
            )}

            {usuario && (
              <>
                {usuario.rol === 'creador' && (
                  <Link to="/panel-creador" className="nav-link">
                    Panel creador
                  </Link>
                )}

                {usuario.rol === 'seguidor' && (
                  <Link to="/panel-seguidor" className="nav-link">
                    Panel seguidor
                  </Link>
                )}

                <span className="badge text-bg-light">
                  {usuario.nombre} - {usuario.rol}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={cerrarSesion}
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/creadores/:id" element={<PerfilCreadorPage />} />
        <Route path="/panel-creador" element={<DashboardCreadorPage />} />
        <Route path="/panel-seguidor" element={<DashboardSeguidorPage />} />
        <Route path="/creadores" element={<CreadoresPage />} />
      </Routes>
    </>
  );
}

export default App;