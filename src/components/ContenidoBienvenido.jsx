import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DALLE from './Chatea Con Gente Del Mundo Aqui.webp';
import './Contenido.css';

const ContenidoBienvenido = () => {
  const [mensaje, setMensaje] = useState('');
  const textoCompleto = 'Un espacio donde la conversación cobra vida.';

  useEffect(() => {
    let i = 0;
    const intervalo = setInterval(() => {
      setMensaje(textoCompleto.slice(0, i));
      i++;
      if (i > textoCompleto.length) clearInterval(intervalo);
    }, 50);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="bienvenida-container">
      <div className="bienvenida-content">
        <header>
          <h1 className="fade-in">
            Bienvenido a <span>ChatGlobal</span> 🎉
          </h1>
        </header>
        <section>
          <h2 className="textoLindo">
            {mensaje}
            <span className="typing"></span>
          </h2>
          <p className="descripcion">
            Conéctate con personas de todo el mundo, comparte ideas y diviértete en un espacio seguro y dinámico. 🌎💬 ¡Explora, aprende y haz nuevos amigos en un solo lugar!
          </p>
        </section>
        <section className="botones">
          <Link to="/chat" className="btn btn-primary btn-lg">
            🚀 Comienza a chatear ahora
          </Link>
        </section>
        <figure>
          <img
            src={DALLE}
            alt="Ilustración de bienvenida, chatea con gente del mundo"
            className="imagen-bienvenida"
          />
        </figure>
      </div>
    </div>
  );
};

export default ContenidoBienvenido;
