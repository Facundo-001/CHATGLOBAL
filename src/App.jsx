import { BrowserRouter as Router } from "react-router-dom"; // Importa el Router
import { useState, useEffect } from "react";
import "./App.css";

// Importamos la app de Firebase y el Auth
import appFirebase from "./credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Importamos nuestros componentes
import Login from "./components/loginand";
import Home from "./components/home";

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Escucha cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase ? usuarioFirebase : null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router> {/* Aquí envolvemos la app con el Router */}
      <div className="m-0">
        {usuario ? <Home user={usuario} /> : <Login />}
      </div>
    </Router>
  );
}

export default App;
