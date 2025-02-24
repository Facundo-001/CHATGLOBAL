    import { Routes, Route, Link } from "react-router-dom";
    import Chat from "./Chat";
    import { getAuth, signOut } from "firebase/auth";
    import appFirebase from "../credenciales";
    import Footer from "./footer";
    import SuggestionBox from "./SuggestionBox"; // Nuevo componente para la caja de sugerencias
    import './home.css'
    import ContenidoBienvenido from "./ContenidoBienvenido.jsx";
    import ContactForm from "./ContactForm.jsx";
    import UserList from "./UserList.jsx";
    // ContactForm
    
    

    const auth = getAuth(appFirebase);

    function Home({ user }) {
    const cerrarSesion = () => {
        signOut(auth);
    };

    return (
        <div className="bg-dark min-vh-100">
        {/* Barra de navegación de Bootstrap */}
        <nav className="navbar navbar-expand-lg navbar-dark" style={{        background: 'linear-gradient(135deg, #290066, #2a0845)' }}>
            <div className="container-fluid">
            <Link className="navbar-brand d-flex align-items-center mx-auto logo-container" to="/">
                <img
                src="https://i.redd.it/s4woy1dkqmn91.png"
                alt="Logo"
                width="50"
                height="50"
                className="rounded-5"
                />
                <span className="LetterHome" style={{marginLeft: '5px',letterSpacing: '3px',fontSize: '18px'}}>ChatGlobal</span>
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
                {/* Enlaces de navegación */}
                <li className="nav-item">
                    <Link to="/Chat" className="textColor nav-link">Chat</Link>
                </li>
                <li className="nav-item">
                    <Link to="/sugerencias" className="textColor nav-link">Caja De Sugerencias</Link>
                </li>

                {/* Dropdown con el nombre del usuario y la opción de cerrar sesión */}
                <li className="nav-item dropdown">
                {/* <img
                    src={user.photoURL || "./assets/v1.jpg"}
                    alt="Foto de perfil"
                    width="30"
                    height="30"
                    className="rounded-circle me-2"/> */}
                <button
                        className="nav-link dropdown-toggle btn"
                        id="userDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        >
                        
                        {user.displayName || user.email}
                        </button>

                        <ul
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="userDropdown"
                        >
                        <li>
                            <button className="dropdown-item" onClick={cerrarSesion}>
                            Cerrar sesión
                            </button>
                        </li>
                        </ul>
                </li>
                </ul>
            </div>
            </div>
        </nav>

        {/* Contenedor principal donde se renderizan los componentes según la ruta */}
        {/* <div className="alert alert-info">
            Esta página: aún está en fase de creación. Lo nuevo: ¡Ya tenemos disponible la caja de sugerencias!
        </div> */}
        <div className="boxhome pt-5 pb-5">
        {/* container py-4 */}
            <Routes>
                <Route path="/" element={<ContenidoBienvenido user={user} />} />
                <Route path="/Chat" element={<Chat user={user} />} />
                <Route path="/Contacto" element={<ContactForm user={user} />} />
                <Route path="/Lista" element={<UserList user={user} />} />
                <Route path="/sugerencias" element={<SuggestionBox user={user} />} />
            </Routes>
        </div>
        {/* Footer fijo */}
        <Footer />
        </div>
    );
    }

    export default Home;


// ideas guardadas para mas adelante


{/* Podrías agregar una imagen de perfil si tu usuario tiene photoURL */}
{/* <img
src={user.photoURL || "./assets/default-profile.png"}
alt="Foto de perfil"
width="30"
height="30"
className="rounded-circle me-2"
/> */}



    // // Inicializamos Auth
    // const auth = getAuth(appFirebase);

    // function Home({ user }) {
    // // Función para cerrar sesión
    // const cerrarSesion = () => {
    //     signOut(auth);
    // };

    // // Estado para controlar la clase 'active'
    // // // const [active, setActive] = useState(false);

    // const ManejarClick = () =>{
    //     // setActive(!active);
    //     // AlertaPersonalizada();
    //     alert('Disculpe aun no esta disponible esta opcion estamos trabajando en ello. 😊 , gracias por su paciencia')
    // };

    // return (
    // <div
    //     style={{
    //         // background: "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMfLabHNe1Itg_Sf9siSS56y531k04hioLNA&s) center/cover no-repeat",
    //         minHeight: '100vh'
    //     }}
    //     className="bg-dark"
    // >
    //     {/* Barra de navegación de Bootstrap */}
    //     <nav className="navbar navbar-expand-lg navbar-dark" style={{background: '#9b5bfb'}}>
    //         <div className="container-fluid">
    //         {/* LOGO o nombre del sitio */}
    //         <a 
    //             className="navbar-brand d-flex align-items-center justify-content-center mx-auto" 
    //             href="#"
    //             >
    //             <img
    //                 src="https://preview.redd.it/let-get-the-ultrakill-logo-on-v0-80ipp9q32edb1.png?width=225&format=png&auto=webp&s=4f39c2a435402e204f0e61b9f0e2a93dea02eb67"
    //                 alt="Logo"
    //                 width="50"
    //                 height="50"
    //                 className="d-inline-block me-2 rounded-5"
    //             />
    //             <span>ChatGlobal</span>
    //         </a>

    //         {/* Botón toggler para móviles */}
    //         <button
    //             className="navbar-toggler"
    //             type="button"
    //             data-bs-toggle="collapse"
    //             data-bs-target="#navbarNav"
    //             aria-controls="navbarNav"
    //             aria-expanded="false"
    //             aria-label="Toggle navigation"
    //         >
    //             <span className="navbar-toggler-icon"></span>
    //         </button>

    //         {/* Contenido colapsable */}
    //         <div className="collapse navbar-collapse" id="navbarNav">
    //             <ul className="navbar-nav ms-auto">
    //             {/* Dropdown del usuario */}
    //             <li className="nav-item dropdown">
    //                 <a href="#" onClick={ManejarClick} className="nav-link btn active">Soporte</a>
    //             </li>
    //             <li className="nav-item dropdown">
    //                 <a href="#" onClick={ManejarClick} className="nav-link btn active">Buscar Usuario</a>
    //             </li>
    //             <li className="nav-item dropdown">
    //                 <a href="#" onClick={ManejarClick} className="nav-link btn active">Caja De Sugerencias</a>
    //             </li>
    //             <li className="nav-item dropdown">
    //                 {/* Podrías agregar una imagen de perfil si tu usuario tiene photoURL */}
    //                 {/* <img
    //                 src={user.photoURL || "./assets/default-profile.png"}
    //                 alt="Foto de perfil"
    //                 width="30"
    //                 height="30"
    //                 className="rounded-circle me-2"
    //                 /> */}

    //                 <button
    //                 className="nav-link dropdown-toggle btn"
    //                 id="userDropdown"
    //                 data-bs-toggle="dropdown"
    //                 aria-expanded="false"
    //                 >
    //                 {user.displayName || user.email}
    //                 </button>
    //                 <ul
    //                 className="dropdown-menu dropdown-menu-end"
    //                 aria-labelledby="userDropdown"
    //                 >
    //                 <li>
    //                     <button className="dropdown-item" onClick={cerrarSesion}>
    //                     Cerrar sesión
    //                     </button>
    //                 </li>
    //                 </ul>
    //             </li>
    //             </ul>
    //         </div>
    //         </div>
    //     </nav>

    //     <div className="alert alert-warning">Esta pagina se esta trabajando todavia, Gracias por leer :)</div>

    //     {/* Aquí va el contenido principal, por ejemplo el Chat */}
    //     <div
    //             className="container py-4"
    //     >
    //         <Chat user={user} />
    //     </div>
    //     <Footer/>
    //     </div>
    // );
    // }

    // export default Home;