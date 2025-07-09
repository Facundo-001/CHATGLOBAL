import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { db } from "../credenciales";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FaCaretDown, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import "./chat.css";

// Componente memoizado para cada mensaje. Esto evita re-renders innecesarios
// de mensajes individuales si sus props no han cambiado.
const ChatMessage = React.memo(function ChatMessage({
  msg,
  user,
  showOptions,
  onToggleOptions,
  onDeleteMessage,
}) {
  const isMyMessage = msg.userId === user.uid;

  return (
    <div
      key={msg.id}
      className={`message ${isMyMessage ? "my-message" : "other-message"}`}
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

      {isMyMessage && (
        <div className="options-btn">
          <FaCaretDown onClick={() => onToggleOptions(msg.id)} />
          {showOptions === msg.id && (
            <div className="options-menu">
              <button
                onClick={() => onDeleteMessage(msg.id)}
                className="option-btn"
              >
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
  );
});

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [waitTime, setWaitTime] = useState(0);
  const chatEndRef = useRef(null);

  // Memoiza la función de formateo para evitar su recreación innecesaria
  const formatTime = useCallback((ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  // Efecto para verificar el tiempo de registro del usuario
  useEffect(() => {
    if (!user || !user.metadata || !user.metadata.creationTime) {
      // Si no hay usuario o metadatos, salimos
      return;
    }

    const creationTime = new Date(user.metadata.creationTime);
    const fifteenMinutes = 15 * 60 * 1000;

    const checkTime = () => {
      const currentTime = new Date();
      const diff = currentTime - creationTime;

      if (diff < fifteenMinutes) {
        setCanSendMessage(false);
        setWaitTime(fifteenMinutes - diff);
      } else {
        setCanSendMessage(true);
        setWaitTime(0);
      }
    };

    checkTime(); // Chequeo inicial

    // Configura un intervalo solo si aún no puede enviar mensajes
    let intervalId;
    if (!canSendMessage) {
      intervalId = setInterval(checkTime, 1000);
    }

    // Limpieza del intervalo
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, canSendMessage]); // Añadimos canSendMessage a las dependencias para re-evaluar si el intervalo debe correr.

  // Efecto para escuchar los mensajes en tiempo real
  useEffect(() => {
    const messagesColRef = collection(db, "messages");
    const messagesQuery = query(messagesColRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Limpia la suscripción al desmontar el componente
  }, []);

  // Función para enviar mensaje (memoizada para evitar recreaciones innecesarias)
  const enviarMensaje = useCallback(
    async (e) => {
      e.preventDefault();
      if (!mensaje.trim()) return;

      if (!canSendMessage) {
        alert(`Debes esperar ${formatTime(waitTime)} para enviar mensajes.`);
        return;
      }

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
    },
    [mensaje, canSendMessage, user, formatTime, waitTime]
  ); // Dependencias para useCallback

  // Función para eliminar mensaje (memoizada)
  const eliminarMensaje = useCallback(
    async (id) => {
      try {
        const docRef = doc(db, "messages", id);
        await deleteDoc(docRef);
        setShowOptions(null); // Oculta las opciones después de eliminar
      } catch (error) {
        console.error("Error al eliminar mensaje:", error);
      }
    },
    [] // No tiene dependencias externas que cambien
  );

  // Auto-scroll al final del chat (se dispara cada vez que los mensajes cambian)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Función para agregar emoji (memoizada)
  const agregarEmoji = useCallback((emojiObject) => {
    setMensaje((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  }, []);

  // Función para alternar opciones de mensaje (memoizada)
  const handleToggleOptions = useCallback((msgId) => {
    setShowOptions((prevShowOptions) =>
      prevShowOptions === msgId ? null : msgId
    );
  }, []);

  return (
<div className="chat-container p-3">
  <div className="chat-header">
    <h2>Chat en Vivo</h2>
    <span className="red-point" aria-label="Grabando"></span>
  </div>

  <div className="chat-box">
    {messages.map((msg) => (
      <ChatMessage
        key={msg.id}
        msg={msg}
        user={user}
        showOptions={showOptions}
        onToggleOptions={handleToggleOptions}
        onDeleteMessage={eliminarMensaje}
      />
    ))}
    <div ref={chatEndRef} />
  </div>


      {/* Si el usuario aún no puede enviar mensajes, mostramos un aviso */}
      {!canSendMessage && (
        <div className="alert alert-warning text-center mb-3">
          ⏳ Eres un usuario nuevo, espera {formatTime(waitTime)} para empezar a
          escribir.
        </div>
      )}

      <form onSubmit={enviarMensaje} className="input-container">
        <div className="emoji-wrapper">
          <button
            type="button"
            className="emoji-button btn rounded-2 text-warning"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            aria-label="Abrir selector de emojis" // Mejor accesibilidad
          >
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
          disabled={!canSendMessage}
          aria-label="Campo de entrada de mensaje" // Mejor accesibilidad
        />
        <button
          type="submit"
          className="send-button"
          disabled={!canSendMessage || !mensaje.trim()} // Deshabilita si el mensaje está vacío también
          aria-label="Enviar mensaje" // Mejor accesibilidad
        >
          Enviar
        </button>
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
