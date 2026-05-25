import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function RegistroPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('seguidor');

  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const registrarUsuario = async (e) => {
    e.preventDefault();

    setMensajeError('');
    setCargando(true);

    try {
      const respuesta = await api.post('/usuarios/registro', {
        nombre,
        email,
        password,
        rol,
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
        error.response?.data?.mensaje || 'Error al registrar usuario';

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
              <h2 className="text-center mb-4 text-primary">Crear cuenta</h2>

              {mensajeError && (
                <div className="alert alert-danger">{mensajeError}</div>
              )}

              <form onSubmit={registrarUsuario}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Juan Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

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

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Crea una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Tipo de usuario</label>
                  <select
                    className="form-select"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                  >
                    <option value="seguidor">Seguidor</option>
                    <option value="creador">Creador</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={cargando}
                >
                  {cargando ? 'Registrando...' : 'Registrarme'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegistroPage;