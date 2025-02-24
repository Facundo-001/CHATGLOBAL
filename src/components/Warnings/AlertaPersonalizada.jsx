    import React, { useState } from "react";
    // import "bootstrap/dist/css/bootstrap.min.css";

    function AlertaPersonalizada() {
    const [showAlert, setShowAlert] = useState(false); // Estado para mostrar u ocultar la alerta

    // Función para mostrar la alerta
    const mostrarAlerta = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Ocultar después de 3 segundos
    };

    return (
        <div className="container mt-3">
        {/* Botón para activar la alerta */}
        <button className="btn btn-primary" onClick={mostrarAlerta}>
            Mostrar Alerta
        </button>

        {/* Alerta personalizada */}
        {showAlert && (
            <div className="alert alert-warning alert-dismissible fade show mt-3" role="alert">
            <strong>¡Atención!</strong> Esto es una alerta personalizada en Bootstrap.
            <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
            </div>
        )}
        </div>
    );
    }

    export default AlertaPersonalizada;
