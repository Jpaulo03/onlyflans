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

          <h1 className="display-4 fw-bold text-primary">
            Bienvenido a OnlyFlans
          </h1>

          <p className="lead mt-3">
            Apoya a tus creadores favoritos donándoles flanes.
          </p>

          <div className="d-flex gap-3 mt-4">
            <Link to="/registro" className="btn btn-primary btn-lg">
              Crear cuenta
            </Link>

            <Link to="/creadores" className="btn btn-outline-primary btn-lg">
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