import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Chat from "./Chat";
import './home.css';
// import Bonfire from './fogata/Bonfire'


const ContenidoBienvenido = () => {
    const [mensaje, setMensaje] = useState('');
    const textoCompleto = "Un espacio donde la conversación cobra vida.";
    // // const [mostrarSugerencia, setMostrarSugerencia] = useState(false);

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
                <h1 className="fade-in">Bienvenido a <span>ChatGlobal</span> 🎉</h1>
                <h2 className="textoLindo">{mensaje}<span className="typing"></span></h2>
                
                <p className="descripcion">
                    Conéctate con personas de todo el mundo, comparte ideas y diviértete en un espacio seguro y dinámico. 🌎💬  
                    ¡Explora, aprende y haz nuevos amigos en un solo lugar!
                </p>

                <div className="botones">
                    <Link to="/chat" className="btn btn-primary btn-lg">🚀 Comienza a chatear ahora</Link>
                </div>
                {/* <Bonfire /> */}
            </div>
        </div>
    );
};

export default ContenidoBienvenido;
