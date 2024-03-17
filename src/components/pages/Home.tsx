import { useState, useEffect } from "react";
import axios from "axios";
import AddExpenseModal from "../modals/AddExpenseModal";

import trashLogo from "../../assets/trashLogo.png";

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
      setExpenses(expenses.filter((expense) => expense.id !== expenseId));
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

  const jordanExpenses = expenses.filter(
    (expense) => expense.utilisateur_id === 1
  );
  const marieExpenses = expenses.filter(
    (expense) => expense.utilisateur_id === 2
  );

  const jordanTotal = jordanExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const marieTotal = marieExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );


  function getCategoryClass(category:string) {
    switch (category) {
      case 'Courses':
        return 'bg-green-light';
      case 'Appartement':
        return 'bg-blue-base';
      // Ajoutez autant de cas que vous avez de catégories avec des styles différents...
      default:
        return 'bg-gray-100';
    }
  }
  

  return (
    <div className=" h-screen w-screen text-xs sm:text-base flex justify-center items-center">
      <div className="flex flex-col h-9.5/10 w-8.5/10 justify-stard bg-white rounded-xl">
        <section className="h-1/10">
          <h2 className="text-xl font-bold border-b-2 border-c2 pb-4 p-2 text-c2 ">
            Dépenses
          </h2>
        </section>
        {/* Affiche les dépenses par utilisateur */}
        <section className="h-8/10">
          <div className="flex flex-row justify-evenly py-4 h-9/10  w-10/10">
            {users.map((user) => (
              <div
                key={user.id}
                className="h-full flex flex-col bg-white border- gap-2 w-10/10 p-2 justify-center items-center"
              >
                {/* Affiche le nom de l'utilisateur */}
                <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
                <div className="flex flex-col overflow-auto h-full w-full gap-2 justify-start bg-">
                  {/* Affiche MAP dépenses de l'utilisateur par ID*/}
                  {expensesByUser[user.id]?.map((expense) => (
                    <div
                      key={expense.id}
                      className={`flex flex-row w-full items-center justify-between p-2 rounded-xl font-Shadows-Into-Light text-gray-50 ${getCategoryClass(expense.category)}`}
                    >
                      <div className="">
                        <p className="font-semibold">{expense.category}</p>
          
                        <p> {expense.amount}€</p>
                      </div>

                      <img
                        src={trashLogo}
                        alt=""
                        onClick={() => deleteExpense(expense.id)}
                        className="h-8 w-8"
                      />
                    </div>
                  )) || (
                    <p>Cet utilisateur n'a pas de dépenses enregistrées.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
           {/* Affiche la différence de dépenses entre Jordan et Marie */}
           <div className="text-center">
            {jordanTotal > marieTotal ? (
              <p>
                Jordan a dépensé {jordanTotal - marieTotal}€ de plus que Marie
              </p>
            ) : (
              <p>
                Marie a dépensé {marieTotal - jordanTotal}€ de plus que Jordan
              </p>
            )}
          </div>
        </section>
        <section>
          {/* Bouton pour ajouter une dépense */}
          <button
            onClick={() => setShowModal(true)}
            className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2"
          >
            
            Ajouter une dépense
          </button>
        </section>
        {showModal && (
          <AddExpenseModal
            showModal={showModal}
            setShowModal={setShowModal}
            users={users}
            refreshExpenses={refreshExpenses}
          />
        )}
      </div>
    </div>
  );
}

export default Main;
