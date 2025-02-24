import React, { useState, useEffect, useRef } from "react";
import { db } from "../credenciales"; // Importar Firestore
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { FaCaretDown } from "react-icons/fa"; // Importamos el ícono de la flechita hacia abajo
import "./chat.css";

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [showOptions, setShowOptions] = useState(null); // Estado para mostrar las opciones
  const chatEndRef = useRef(null); // Referencia para auto-scroll

  // Suscripción en tiempo real
  useEffect(() => {
    const colRef = collection(db, "messages");
    const q = query(colRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(docs);
    });

    return () => unsubscribe();
  }, []);

  // Función para enviar mensaje
  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return; // No enviar si el mensaje está vacío

    try {
      await addDoc(collection(db, "messages"), {
        text: mensaje,
        userName: user.displayName || user.email,
        timestamp: serverTimestamp(),
        userId: user.uid,
      });

      setMensaje(""); // Limpiar el campo de texto
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  // Función para eliminar un mensaje
  const eliminarMensaje = async (id) => {
    try {
      const docRef = doc(db, "messages", id);
      await deleteDoc(docRef); // Elimina el mensaje de Firestore
      setShowOptions(null); // Cierra el menú de opciones
    } catch (error) {
      console.error("Error al eliminar mensaje:", error);
    }
  };

  // Auto-scroll al último mensaje
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container p-3">
      <h2 className="text-center text-light mb-3">Chat en Vivo</h2>

      {/* Lista de mensajes */}
      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.userId === user.uid ? "my-message" : "other-message"}`}
          >
            <p className="user-name">{msg.userName}</p>

            {/* Texto del mensaje */}
            {msg.text && (
              <p className="text-message">
                {msg.text.startsWith("http") ? (
                  <a href={msg.text} target="_blank" rel="noopener noreferrer">
                    {msg.text}
                  </a>
                ) : (
                  msg.text
                )}
              </p>
            )}

            {/* Botón para mostrar opciones */}
            {msg.userId === user.uid && (
              <div className="options-btn">
                <FaCaretDown onClick={() => setShowOptions(showOptions === msg.id ? null : msg.id)} />
                {showOptions === msg.id && (
                  <div className="options-menu">
                    <button onClick={() => eliminarMensaje(msg.id)} className="option-btn">
                      Eliminar mensaje
                    </button>
                  </div>
                )}
              </div>
            )}

            {msg.timestamp && (
              <small className="timestamp">
                {new Date(msg.timestamp.toDate()).toLocaleString()}
              </small>
            )}
          </div>
        ))}
        <div ref={chatEndRef} /> {/* Para el auto-scroll */}
      </div>

      {/* Formulario de envío */}
      <form onSubmit={enviarMensaje} className="input-container">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="send-button">Enviar</button>
      </form>
    </div>
  );
}

export default Chat;




// EL VIEJO CODIGO POR SI SE LLEGA A ROMPER EL NUEVO

// import React, { useState, useEffect, useRef } from "react";
// import { db } from "../credenciales";
// import {
//   collection,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
//   query,
//   orderBy,
// } from "firebase/firestore";
// import './chat.css'

// function Chat({ user }) {
//   const [messages, setMessages] = useState([]);
//   const [mensaje, setMensaje] = useState("");
//   const chatEndRef = useRef(null); // Referencia para hacer scroll automático

//   // Suscripción en tiempo real
//   useEffect(() => {
//     const colRef = collection(db, "messages");
//     const q = query(colRef, orderBy("timestamp", "asc"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const docs = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(docs);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Enviar mensaje
//   const enviarMensaje = async (e) => {
//     e.preventDefault();
//     if (!mensaje.trim()) return;

//     try {
//       await addDoc(collection(db, "messages"), {
//         text: mensaje,
//         userName: user.displayName || user.email,
//         timestamp: serverTimestamp(),
//         userId: user.uid, // Guardamos el ID para diferenciar usuarios
//       });
//       setMensaje("");
//     } catch (error) {
//       console.error("Error al enviar mensaje:", error);
//     }
//   };

//   // Auto-scroll al último mensaje
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="chat-container p-3 ">
//       <h2 className="text-center text-light mb-3">Chat en Vivo</h2>

//       {/* {Lista de mensaje} */}
//       <div className="chat-box">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`message ${
//               msg.userId === user.uid ? "my-message" : "other-message"
//             }`}
//           >
//             <p className="user-name">{msg.userName}</p>
//             <p className="text-message">{msg.text}</p>
//             {msg.timestamp && (
//               <small className="timestamp">
//                 {new Date(msg.timestamp.toDate()).toLocaleString()}
//               </small>
//             )}
//           </div>
//         ))}
//         <div ref={chatEndRef} /> {/* Para el auto-scroll */}
//       </div>

//       {/* Formulario de envío */}
//       <form onSubmit={enviarMensaje} className="input-container">
//         <input
//           type="text"
//           placeholder="Escribe tu mensaje..."
//           value={mensaje}
//           onChange={(e) => setMensaje(e.target.value)}
//           className="chat-input"
//         />
//         <button type="submit" className="send-button">Enviar</button>
//       </form>
//     </div>
//   );
// }

// export default Chat;
