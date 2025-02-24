import { useState, useEffect } from "react";
import { db } from "../credenciales";
import { collection, addDoc, onSnapshot, orderBy, query, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function SuggestionBox() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [processingVotes, setProcessingVotes] = useState({}); // Para evitar múltiples clicks rápidos

  // Obtenemos el usuario autenticado
  const auth = getAuth();
  const user = auth.currentUser; // Se asume que el usuario ya está autenticado
  const userName = user ? (user.displayName || user.email) : "Usuario desconocido";

  useEffect(() => {
    const q = query(collection(db, "suggestions"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newSuggestions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSuggestions(newSuggestions);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      alert("Por favor, ingresa tu sugerencia.");
      return;
    }

    try {
      await addDoc(collection(db, "suggestions"), {
        text: text.trim(),
        author: userName,
        timestamp: new Date(),
        approved: 0,
        disapproved: 0,
      });
      setText("");
    } catch (error) {
      console.error("Error al agregar sugerencia:", error);
    }
  };

  const handleVote = async (id, type) => {
    // Si ya se está procesando un voto para esta sugerencia, se ignora el clic
    if (processingVotes[id]) return;

    setProcessingVotes((prev) => ({ ...prev, [id]: true }));

    const suggestionRef = doc(db, "suggestions", id);
    const suggestion = suggestions.find((s) => s.id === id);
    const userVoteKey = `vote_${id}`;
    const userVote = localStorage.getItem(userVoteKey);

    if (!suggestion) {
      setProcessingVotes((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      return;
    }

    try {
      if (!userVote) {
        // Si no ha votado antes, se registra el voto
        await updateDoc(suggestionRef, {
          [type]: suggestion[type] + 1,
        });
        localStorage.setItem(userVoteKey, type);
      } else if (userVote === type) {
        // Si ya ha votado igual, no se hace nada
        return;
      } else {
        // Cambio de voto: se resta el voto anterior y se suma el nuevo
        const updates = {
          [userVote]: suggestion[userVote] > 0 ? suggestion[userVote] - 1 : 0,
          [type]: suggestion[type] + 1,
        };
        await updateDoc(suggestionRef, updates);
        localStorage.setItem(userVoteKey, type);
      }
    } catch (error) {
      console.error("Error al actualizar sugerencia:", error);
    } finally {
      setProcessingVotes((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-3">💡 Caja de Sugerencias</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            className="form-control mb-2"
            placeholder="Escribe tu sugerencia aquí..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="3"
          />
          <button type="submit" className="btn btn-primary w-100">
            Enviar Sugerencia
          </button>
        </form>

        <h3 className="mt-4">📌 Últimas sugerencias</h3>
        <div className="suggestion-box">
          <ul className="list-group">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => {
                const userVote = localStorage.getItem(`vote_${suggestion.id}`);
                return (
                  <li
                    key={suggestion.id}
                    className="list-group-item d-flex justify-content-between align-items-start flex-column"
                  >
                    <small className="text-muted">
                      📅 {new Date(suggestion.timestamp?.seconds * 1000).toLocaleString()}
                    </small>
                    <p className="m-0">{suggestion.text}</p>
                    {suggestion.author && (
                      <p className="m-0">
                        <em>Por: {suggestion.author}</em>
                      </p>
                    )}
                    <div className="d-flex gap-2 mt-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleVote(suggestion.id, "approved")}
                        disabled={
                          processingVotes[suggestion.id] ||
                          userVote === "approved"
                        }
                      >
                        ✅ Aprobado ({suggestion.approved ?? 0})
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleVote(suggestion.id, "disapproved")}
                        disabled={
                          processingVotes[suggestion.id] ||
                          userVote === "disapproved"
                        }
                      >
                        ❌ Desaprobado ({suggestion.disapproved ?? 0})
                      </button>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="text-muted text-center mt-3">Aún no hay sugerencias.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SuggestionBox;
