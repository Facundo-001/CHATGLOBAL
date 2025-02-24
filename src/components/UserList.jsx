    import React, { useState, useEffect } from "react";
    import { db } from "../credenciales";
    import { collection, getDocs } from "firebase/firestore";

    function UserList({ onSelectUser }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, "Usuarios"));
            const usersList = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
            setUsers(usersList);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
        };

        fetchUsers();
    }, []);

    return (
        <div>
        <h2>Usuarios Registrados</h2>
        <ul>
            {users.length > 0 ? (
            users.map((user) => (
                <li key={user.id} onClick={() => onSelectUser(user)}>
                <strong>{user.name}</strong> - {user.email}
                </li>
            ))
            ) : (
            <p>No hay usuarios registrados aún.</p>
            )}
        </ul>
        </div>
    );
    }

    export default UserList;
