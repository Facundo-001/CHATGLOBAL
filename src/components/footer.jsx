import React from 'react';
import { Link } from "react-router-dom";
// Si vas a usar íconos de Font Awesome, asegúrate de haber agregado
// la dependencia o el enlace en tu index.html o donde corresponda.

const Footer = () => {
  return (
    <footer
      className="py-5"
      style={{
        background: 'linear-gradient(135deg, #2a0845,#2f0a74)',
        // background: linear-gradient(135deg, #2a0845, #2f0a74);
        color: '#fff',
      }}
    >
      <div className="container">
        {/* Fila principal con 4 columnas en escritorio, se apilan en móviles */}
        <div className="row text-center text-md-start">
          
          {/* Acerca de nosotros */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Acerca de ChatGlobal</h5>
            <p className="small">
              ChatGlobal es un espacio donde la conversación cobra vida. Conecta con personas de todo el mundo, comparte ideas y haz nuevos amigos en un solo lugar.
            </p>
          </div>
          
          {/* Enlaces rápidos */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Inicio</a></li>
              <li><a href="#" className="text-white text-decoration-none">Características</a></li>
              <li><a href="#" className="text-white text-decoration-none">Precios</a></li>
              <li><Link to="/Contacto" className="text-white text-decoration-none">Contacto</Link></li>
            </ul>
          </div>
          
          {/* Redes sociales */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Síguenos</h5>
            <p className="small">Mantente al día en nuestras redes sociales:</p>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white me-2 fs-5"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white me-2 fs-5"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white fs-5"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
          
          {/* Newsletter */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Suscríbete</h5>
            <p className="small">
              Recibe las últimas novedades y actualizaciones de ChatGlobal en tu correo.
            </p>
            <form>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Ingresa tu email"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>
              <button type="submit" className="btn btn-outline-light w-100">
                Suscribirme
              </button>
            </form>
          </div>
        </div>
        
        <hr className="my-4" />
        
        {/* Línea final de derechos reservados */}
        <div className="text-center">
          <p className="mb-0">© 2025 ChatGlobal. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
