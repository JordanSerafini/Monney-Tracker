import { useState, useEffect } from 'react';
import axios from 'axios';
import AddExpenseModal from '../modals/AddExpenseModal';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  utilisateur_id: string; 
  category: string;
}

function Main() {
  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/expense');
        setExpenses(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
    fetchExpenses();
  }, []);

  // Regroupez les dépenses par utilisateur_id
  const expensesByUser = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    if (!acc[expense.utilisateur_id]) {
      acc[expense.utilisateur_id] = [];
    }
    acc[expense.utilisateur_id].push(expense);
    return acc;
  }, {});

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          {expensesByUser[user.id] ? (
            <div>
              {expensesByUser[user.id].map(expense => (
                <div key={expense.id}>
                  <p>{expense.name} - {expense.amount}€ - {expense.date} - {expense.category}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Cet utilisateur n'a pas de dépenses enregistrées.</p>
          )}
        </div>
      ))}
      <button onClick={() => setShowModal(true)}>Ajouter une dépense</button>
      <AddExpenseModal
        showModal={showModal}
        setShowModal={setShowModal}
        users={users} 
      />
    </div>
  );
}

export default Main;
