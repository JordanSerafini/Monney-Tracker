import { useState, useEffect } from "react";
import axios from "axios";
import AddExpenseModal from "../modals/AddExpenseModal";

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
  utilisateur_id: number;
  category: string;
}

function Main() {
  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/expense");
        setExpenses(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
    fetchExpenses();
  }, []);

  // Regroupez les dépenses par utilisateur_id
  const expensesByUser = expenses.reduce<Record<string, Expense[]>>(
    (acc, expense) => {
      if (!acc[expense.utilisateur_id]) {
        acc[expense.utilisateur_id] = [];
      }
      acc[expense.utilisateur_id].push(expense);
      return acc;
    },
    {}
  );

  // Fonction pour supprimer une dépense
  const deleteExpense = async (expenseId: string) => {
    try {
      await axios.delete(`http://localhost:5000/expense/${expenseId}`);
      // Supprime la dépense du state pour mettre à jour l'UI
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
    } catch (error) {
      console.error(error);
    }
  };


const refreshExpenses = async () => {
  try {
    const response = await axios.get("http://localhost:5000/expense");
    setExpenses(response.data); 
  } catch (error) {
    console.error(error);
  }
};

const jordanExpenses = expenses.filter(expense => expense.utilisateur_id === 1);
const marieExpenses = expenses.filter(expense => expense.utilisateur_id === 2);

const jordanTotal = jordanExpenses.reduce((acc, expense) => acc + expense.amount, 0);
const marieTotal = marieExpenses.reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <div className="p-4 h-screen w-full text-xs sm:text-base">
      <div className="flex flex-col  h-9/10 justify-stard">
        <h2 className="text-xl font-bold mb-4 border-b-2 border-c2 pb-4 text-c2 ">Dépenses</h2>
        
        {/* Affiche les dépenses par utilisateur */}
        <div className="flex flex-row justify-evenly p-2 h-4/5 gap-6 ">
          {users.map((user) => (
            <div key={user.id} className="h-full flex flex-col bg-white border-2 gap-2 w-1/2 p-2">

              {/* Affiche le nom de l'utilisateur */}
              <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
              <div className="flex flex-col overflow-auto h-full gap-8 justify-start">
              
                {/* Affiche MAP dépenses de l'utilisateur par ID*/}
                {expensesByUser[user.id]?.map((expense) => (
                  <div key={expense.id} className="text-xs flex flex-row gap-2 mb-3 p-2 shadow rounded border-r-2 border-spacing-2 bg-quaternary  font-Dancing bg-c1 text-c4 items-center justify-evenly">
                    <p className="font-semibold">{expense.name}</p>
                    <p>
                      {expense.amount}€ -{" "}
                      {new Date(expense.date).toLocaleDateString("fr-FR")}
                    </p>
                    <p>{expense.category}</p>
              
                    {/* Affiche le bouton pour supprimer une dépense */}
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      X
                    </button>
                  </div>
                )) || <p>Cet utilisateur n'a pas de dépenses enregistrées.</p>}
              </div>
            </div>
          ))}
        </div>
        {/* Affiche la différence de dépenses entre Jordan et Marie */}
        <div className="text-center">
        {jordanTotal > marieTotal ? <p>Jordan a dépensé {jordanTotal - marieTotal}€ de plus que Marie</p> : <p>Marie a dépensé {marieTotal - jordanTotal}€ de plus que Jordan</p>}
        </div>
      </div>

      {/* Bouton pour ajouter une dépense */}
      <button
        onClick={() => setShowModal(true)}
        className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Ajouter une dépense
      </button>
      {showModal && (
        <AddExpenseModal
          showModal={showModal}
          setShowModal={setShowModal}
          users={users}
          refreshExpenses={refreshExpenses}
        />
      )}
    </div>
  );
}

export default Main;
