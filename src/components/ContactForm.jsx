import React, { useState } from "react";
import { db } from "../credenciales"; // Ajusta la ruta según tu estructura
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    // Validar campos básicos (opcional)
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Guarda en la colección "contacts" de Firestore
      await addDoc(collection(db, "contacts"), {
        name: name,
        email: email,
        message: message,
        timestamp: serverTimestamp(),
      });

      // Limpia los campos
      setName("");
      setEmail("");
      setMessage("");

      // Mensaje de éxito
      setSuccessMsg("¡Mensaje enviado con éxito! Pronto me pondré en contacto contigo.");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setErrorMsg("Hubo un error al enviar tu mensaje. Intenta de nuevo más tarde.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Contáctame</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {successMsg && <p style={styles.success}>{successMsg}</p>}
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <div style={styles.formGroup}>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="email">Correo:</label>
          <input
            type="email"
            id="email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="message">Mensaje:</label>
          <textarea
            id="message"
            style={styles.textarea}
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button type="submit" style={styles.button}>
          Enviar
        </button>
      </form>
    </div>
  );
}

// Ejemplo de estilos inline (puedes usar CSS a tu gusto)
const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    backgroundColor: "#f4f4f4",
    padding: "20px",
    borderRadius: "8px",
    fontFamily: "sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "5px",
    resize: "vertical",
  },
  button: {
    backgroundColor: "#9b5bfb",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  success: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "10px",
  },
};

export default ContactForm;
