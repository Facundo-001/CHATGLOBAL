import { useState, useEffect } from "react";
import { db } from "../credenciales";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./SuggestionBox.css";

function SuggestionBox() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [processingVotes, setProcessingVotes] = useState({});

  const auth = getAuth();
  const user = auth.currentUser;
  const userName = user ? user.displayName || user.email : "Usuario desconocido";

  useEffect(() => {
    const q = query(collection(db, "suggestions"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSuggestions(fetched);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return alert("Escribe algo, porfis 💌");

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
      console.error("Error al enviar sugerencia:", error);
    }
  };

  const handleVote = async (id, type) => {
    if (processingVotes[id]) return;
    setProcessingVotes((prev) => ({ ...prev, [id]: true }));

    const ref = doc(db, "suggestions", id);
    const suggestion = suggestions.find((s) => s.id === id);
    const userVoteKey = `vote_${id}`;
    const userVote = localStorage.getItem(userVoteKey);

    if (!suggestion) return;

    try {
      if (!userVote) {
        await updateDoc(ref, { [type]: suggestion[type] + 1 });
        localStorage.setItem(userVoteKey, type);
      } else if (userVote !== type) {
        const updates = {
          [userVote]: Math.max(0, suggestion[userVote] - 1),
          [type]: suggestion[type] + 1,
        };
        await updateDoc(ref, updates);
        localStorage.setItem(userVoteKey, type);
      }
    } catch (error) {
      console.error("Error al votar:", error);
    } finally {
      setProcessingVotes((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  return (
    <div className="suggestion-box-wrapper">
      <h2>💡 Caja de Sugerencias</h2>

      <form onSubmit={handleSubmit} className="suggestion-form">
        <textarea
          placeholder="Escribe tu sugerencia aquí..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="3"
        />
        <button type="submit">Enviar Sugerencia</button>
      </form>

      <h3>📌 Últimas sugerencias</h3>

      <div className="suggestion-box">
        <ul>
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => {
              const userVote = localStorage.getItem(`vote_${suggestion.id}`);
              return (
                <li key={suggestion.id}>
                  <small>
                    📅 {new Date(suggestion.timestamp?.seconds * 1000).toLocaleString()}
                  </small>
                  <p>{suggestion.text}</p>
                  {suggestion.author && (
                    <em>✍️ {suggestion.author}</em>
                  )}
                  <div className="vote-buttons">
                    <button
                      className="approve"
                      onClick={() => handleVote(suggestion.id, "approved")}
                      disabled={
                        processingVotes[suggestion.id] || userVote === "approved"
                      }
                    >
                      ✅ Aprobado ({suggestion.approved ?? 0})
                    </button>
                    <button
                      className="disapprove"
                      onClick={() => handleVote(suggestion.id, "disapproved")}
                      disabled={
                        processingVotes[suggestion.id] || userVote === "disapproved"
                      }
                    >
                      ❌ Rechazado ({suggestion.disapproved ?? 0})
                    </button>
                  </div>
                </li>
              );
            })
          ) : (
            <p className="no-suggestions">Aún no hay sugerencias 😶</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SuggestionBox;
