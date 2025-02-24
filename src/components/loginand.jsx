import React, { useState } from 'react';
import imagen from '../assets/login-bg.png';
import imageProfile from '../assets/v1.jpg';
import '../App.css';
import appFirebase from '../credenciales';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const auth = getAuth(appFirebase);

const Login = () => {
  const [registrando, setRegistrando] = useState(false);

  const functAutenticacion = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contraseña = e.target.password.value;
    const nickname = e.target.nickname?.value;

    try {
      if (registrando) {
        const userCredential = await createUserWithEmailAndPassword(auth, correo, contraseña);
        const user = userCredential.user;
        if (nickname) {
          await updateProfile(user, { displayName: nickname });
        }
      } else {
        await signInWithEmailAndPassword(auth, correo, contraseña);
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      alert('Error en correo o contraseña');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row shadow-lg p-4 rounded" style={{ maxWidth: '900px', width: '100%', background: 'white' }}>
        <div className="col-md-6 d-flex flex-column align-items-center">
          <img src={imageProfile} alt="Perfil" className="estilo-profile mb-3 rounded-circle border" style={{ width: '80px', height: '80px' }} />
          <h3 className="text-center mb-3">{registrando ? 'Regístrate' : 'Inicia Sesión'}</h3>
          <form onSubmit={functAutenticacion} className="w-100">
            <input type="email" name="email" className="form-control mb-2" placeholder="Ingresar Email" required />
            <input type="password" name="password" className="form-control mb-2" placeholder="Ingresar Contraseña" required />
            {registrando && <input type="text" name="nickname" className="form-control mb-2" placeholder="Ingresa tu Apodo" />}
            <button className="btn btn-primary w-100">{registrando ? 'Registrate' : 'Inicia Sesión'}</button>
          </form>
          <p className="mt-3">
            {registrando ? 'Si ya tienes cuenta' : '¿No tienes cuenta?'}
            <button onClick={() => setRegistrando(!registrando)} className="btn btn-link p-0 text-decoration-none ms-1">
              {registrando ? 'Inicia Sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
        <div className="col-md-6 d-none d-md-block">
          <img src={imagen} alt="Fondo" className="img-fluid rounded" style={{ maxHeight: '400px', objectFit: 'cover' }} />
        </div>
      </div>
    </div>
  );
};

export default Login;
