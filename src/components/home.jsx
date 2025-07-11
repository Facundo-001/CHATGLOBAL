import { Routes, Route, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import appFirebase from "../credenciales";
import Chat from "./Chat";
import Footer from "./footer";
import SuggestionBox from "./SuggestionBox";
import ContenidoBienvenido from "./ContenidoBienvenido.jsx";
import ContactForm from "./ContactForm.jsx";
import UserList from "./UserList.jsx";
import './home.css';
import { useState, useRef, useEffect } from "react"; // Importamos 'useRef' y 'useEffect' para la funcionalidad de cerrar al hacer clic fuera

const auth = getAuth(appFirebase);

function Home({ user }) {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar la visibilidad del menú principal (hamburguesa)
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Estado para controlar la visibilidad del menú de usuario
  // Creamos una referencia para el elemento 'li' que contiene el botón del usuario y su menú desplegable.
  // Esto nos permitirá detectar clics fuera de este contenedor.
  const userMenuRef = useRef(null);

  // Función para cerrar la sesión del usuario
  const cerrarSesion = () => {
    signOut(auth);
  };

  // Función para alternar la visibilidad del menú principal (responsive)
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Función para alternar la visibilidad del menú de usuario
  const toggleUserMenu = () => {
    setUserMenuOpen(prev => !prev); // Alterna el estado actual
  };

  // --- Inicio de la lógica para cerrar el menú al hacer clic fuera ---
  useEffect(() => {
    // Esta función se ejecutará cada vez que se detecte un 'mousedown' (clic) en el documento
    const handleClickOutside = (event) => {
      // 1. Verificamos si el menú de usuario está abierto.
      // 2. Verificamos si 'userMenuRef.current' existe (es decir, si la referencia está adjunta a un elemento DOM).
      // 3. Verificamos si el clic (event.target) NO está dentro del contenedor del menú de usuario ('userMenuRef.current').
      // 4. Verificamos que el clic NO fue directamente en el botón del usuario (para permitir que el botón lo alterne).
      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        !event.target.closest('.user-button')
      ) {
        setUserMenuOpen(false); // Si todas las condiciones se cumplen, cerramos el menú.
      }
    };

    // Si el menú de usuario está abierto, añadimos un 'event listener' al documento completo.
    // Esto nos permite detectar clics en cualquier parte de la pantalla.
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Función de limpieza:
    // Se ejecuta cuando el componente se desmonta o cuando 'userMenuOpen' cambia de estado (ej. de true a false).
    // Esto es crucial para evitar pérdidas de memoria y asegurar que el 'event listener' se elimine cuando no se necesita.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]); // Este 'useEffect' se re-ejecuta cada vez que el estado 'userMenuOpen' cambia.
  // --- Fin de la lógica para cerrar el menú al hacer clic fuera ---

  return (
    <div className="home-wrapper">
      {/* Barra de navegación (Navbar) */}
      <nav className="navbar-custom">
        <div className="navbar-container">
          {/* Enlace del logo a la página de inicio */}
          <Link className="logo-link" to="/">
            <img
              src="https://i.redd.it/s4woy1dkqmn91.png"
              alt="Logo"
              className="logo-img"
              loading="lazy"
            />
            <span className="logo-text">ChatGlobal</span>
          </Link>

          {/* Botón para alternar el menú principal en dispositivos pequeños */}
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>

          {/* Lista de enlaces de navegación */}
          <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
            <li><Link to="/Chat" className="nav-item">Chat</Link></li>
            <li><Link to="/sugerencias" className="nav-item">Sugerencias</Link></li>
            {/* Elemento de la lista para el menú del usuario */}
            <li className="nav-user" ref={userMenuRef}> {/* Adjuntamos la referencia aquí */}
              {/* Botón del usuario que al hacer clic alterna el menú.
                  Añadimos la clase 'open' condicionalmente para el estilo de la flecha. */}
              <button
                className={`user-button ${userMenuOpen ? 'open' : ''}`}
                onClick={toggleUserMenu}
              >
                {user.displayName || user.email} <span className="dropdown-arrow">▼</span>
              </button>
              {/* El menú desplegable del usuario se muestra solo si 'userMenuOpen' es verdadero */}
              {userMenuOpen && (
                <div className="user-menu">
                  <button className="user-menu-item" onClick={cerrarSesion}>Cerrar sesión</button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Contenido principal, donde se renderizan las rutas */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ContenidoBienvenido user={user} />} />
          <Route path="/Chat" element={<Chat user={user} />} />
          <Route path="/Contacto" element={<ContactForm user={user} />} />
          <Route path="/Lista" element={<UserList user={user} />} />
          <Route path="/sugerencias" element={<SuggestionBox user={user} />} />
        </Routes>
      </main>

      {/* Componente de pie de página */}
      <Footer />
    </div>
  );
}

export default Home;