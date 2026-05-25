const IMAGEN_PERFIL_DEFAULT = '/img/perfil-generico.png';

function Avatar({ src, nombre = 'Usuario', size = 80, className = '', style = {} }) {
  return (
    <img
      src={src || IMAGEN_PERFIL_DEFAULT}
      alt={`Foto de perfil de ${nombre}`}
      className={`rounded-circle bg-light ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'cover',
        ...style,
      }}
      onError={(e) => {
        e.currentTarget.src = IMAGEN_PERFIL_DEFAULT;
      }}
    />
  );
}

export default Avatar;