// src/credenciales.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importar Storage

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCSeGv6PhRZ6Hm64R7DNeefUQUbaq7DxLc",
    authDomain: "projectochat-811e9.firebaseapp.com",
    projectId: "projectochat-811e9",
    storageBucket: "projectochat-811e9.appspot.com",
    messagingSenderId: "971770397018",
    appId: "1:971770397018:web:bf843d3708a7bf4527b363"
};

// Inicializar Firebase
const appFirebase = initializeApp(firebaseConfig);

// Exportar Firestore y Storage
export const db = getFirestore(appFirebase);
export const storage = getStorage(appFirebase); // Inicializar y exportar Storage

// Exportar la app (útil para Auth)
export default appFirebase;
