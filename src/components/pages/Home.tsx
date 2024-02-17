import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  category: string;
}

function Main() {
  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // Créer une fonction asynchrone à l'intérieur de useEffect
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    // Exécuter la fonction asynchrone
    fetchData();
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une fois, après le premier rendu

  return (
    <div>
      {/* Vous pouvez afficher les données ici, par exemple */}
      <h2>Utilisateurs</h2>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.name} - {user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default Main;
