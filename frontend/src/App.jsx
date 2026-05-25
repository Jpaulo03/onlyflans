import { Link, Route, Routes } from 'react-router-dom';

import AppNavbar from './components/AppNavbar';

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

  return (
    <>
      <AppNavbar />

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