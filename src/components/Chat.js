import React, { useState, useEffect, useRef } from "react";
import { db } from "../credenciales";
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { FaCaretDown, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import "./chat.css";

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef(null);

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

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: mensaje,
        userName: user.displayName || user.email,
        timestamp: serverTimestamp(),
        userId: user.uid,
      });

      setMensaje("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  const eliminarMensaje = async (id) => {
    try {
      const docRef = doc(db, "messages", id);
      await deleteDoc(docRef);
      setShowOptions(null);
    } catch (error) {
      console.error("Error al eliminar mensaje:", error);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const agregarEmoji = (emojiObject) => {
    setMensaje((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-container p-3">
      <h2 className="text-center text-light mb-3">Chat en Vivo</h2>

      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.userId === user.uid ? "my-message" : "other-message"}`}
          >
            <p className="user-name">{msg.userName}</p>
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
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={enviarMensaje} className="input-container">
      <div className="emoji-wrapper">
        <button
          type="button"
          className="emoji-button btn rounded-2 text-warning"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          {/* 🤩 logo para el emoji */}
          <FaSmile size={30} />
        </button>

        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker onEmojiClick={agregarEmoji} />
          </div>
        )}
      </div>


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
