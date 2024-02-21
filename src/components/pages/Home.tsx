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
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap -mx-2"> 
        <div className="w-full md:w-1/2 px-2 mb-4">
          <h2 className="text-xl font-bold mb-4">Dépenses</h2>
          {users.map((user) => (
            <div key={user.id}>
              <h3 className="text-lg font-semibold mb-2">{user.name} - Dépenses</h3>
              {expensesByUser[user.id]?.map((expense) => (
                <div key={expense.id} className="mb-3 p-2 shadow rounded">
                  <p className="font-semibold">{expense.name}</p>
                  <p>{expense.amount}€ - {expense.date}</p>
                  <p>Catégorie: {expense.category}</p>
                </div>
              )) || <p>Cet utilisateur n'a pas de dépenses enregistrées.</p>}
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={() => setShowModal(true)}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Ajouter une dépense
      </button>
      {showModal && (
        <AddExpenseModal
          showModal={showModal}
          setShowModal={setShowModal}
          users={users} 
        />
      )}
    </div>
  );
}

export default Main;

