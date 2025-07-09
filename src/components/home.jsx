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

const auth = getAuth(appFirebase);

function Home({ user }) {
  const cerrarSesion = () => {
    signOut(auth);
  };

  return (
    <div className="bg-dark min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #290066, #2a0845)' }}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center mx-auto logo-container" to="/">
            <img
              src="https://i.redd.it/s4woy1dkqmn91.png"
              alt="Logo"
              width="50"
              height="50"
              className="rounded-5 logo-img"
              loading="lazy"
            />
            <span className="LetterHome ms-2" style={{ letterSpacing: '3px', fontSize: '18px' }}>ChatGlobal</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/Chat" className="textColor nav-link">Chat</Link>
              </li>
              <li className="nav-item">
                <Link to="/sugerencias" className="textColor nav-link">Caja De Sugerencias</Link>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.displayName || user.email}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <button className="dropdown-item" onClick={cerrarSesion}>Cerrar sesión</button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="boxhome pt-5 pb-5">
        <Routes>
          <Route path="/" element={<ContenidoBienvenido user={user} />} />
          <Route path="/Chat" element={<Chat user={user} />} />
          <Route path="/Contacto" element={<ContactForm user={user} />} />
          <Route path="/Lista" element={<UserList user={user} />} />
          <Route path="/sugerencias" element={<SuggestionBox user={user} />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
