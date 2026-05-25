const IMAGEN_BANNER_DEFAULT = '/img/banner-generico.png';

function Banner({ src, nombre = 'Creador', height = 180, className = '' }) {
  return (
    <img
      src={src || IMAGEN_BANNER_DEFAULT}
      alt={`Banner de ${nombre}`}
      className={`w-100 ${className}`}
      style={{
        height: `${height}px`,
        objectFit: 'cover',
      }}
      onError={(e) => {
        e.currentTarget.src = IMAGEN_BANNER_DEFAULT;
      }}
    />
  );
}

export default Banner;