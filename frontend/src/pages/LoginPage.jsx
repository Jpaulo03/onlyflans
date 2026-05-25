import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setMensajeError('');
    setCargando(true);

    try {
      const respuesta = await api.post('/usuarios/login', {
        email,
        password,
      });

      localStorage.setItem('token', respuesta.data.token);
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario));

      if (respuesta.data.usuario.rol === 'creador') {
        navigate('/panel-creador');
      } else {
        navigate('/panel-seguidor');
      }
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || 'Error al iniciar sesión';

      setMensajeError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 text-primary">Iniciar sesión</h2>

              {mensajeError && (
                <div className="alert alert-danger">{mensajeError}</div>
              )}

              <form onSubmit={iniciarSesion}>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Ej: usuario@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={cargando}
                >
                  {cargando ? 'Ingresando...' : 'Entrar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;