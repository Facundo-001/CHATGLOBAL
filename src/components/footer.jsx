import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="py-5"
      style={{
        background: 'linear-gradient(135deg, #2a0845, #2f0a74)',
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
              <li>
                <Link to="/" className="text-white text-decoration-none">
                  Inicio
                </Link>
              </li>
              <li>
                <a
                  href="https://portfolionox.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none"
                >
                  Mi Portfolio
                </a>
              </li>
              {/* <li>
                <Link to="/Contacto" className="text-white text-decoration-none">
                  Contacto
                </Link>
              </li> */}
            </ul>
          </div>
          
          {/* Redes sociales */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Síguenos</h5>
            <p className="small">Mantente al día en nuestras redes sociales:</p>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white me-3 fs-5"
              aria-label="Discord"
            >
              <i className="fa-brands fa-discord"></i>
            </a>
            <a
              href="https://www.youtube.com/channel/UCRvtMPmOKIaYBk7_GQBo6hg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white fs-5"
              aria-label="YouTube"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
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
