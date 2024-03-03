import React, { useState, useCallback } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AddExpenseModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  users: User[];
  refreshExpenses?: () => Promise<void>;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  showModal,
  setShowModal,
  users,
  refreshExpenses,
}) => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Définition des catégories disponibles
  const categories = ["Courses", "Appartement", "Autre"];

  const handleAddExpense = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const expense = {
        name: title,
        amount: Number(amount),
        date,
        utilisateur_id: selectedUserId,
        category: selectedCategory, // Utilisez la catégorie sélectionnée
      };
      await axios.post("http://localhost:5000/expense", expense);
      setShowModal(false);
      if (refreshExpenses) {
        refreshExpenses();
      }
    } catch (error) {
      console.error(error);
    }
  }, [title, amount, date, selectedCategory, selectedUserId, refreshExpenses, setShowModal]);

  if (!showModal) return null;


  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="m-auto bg-white border-4 border-c2 rounded-lg w-8.5/10 shadow-2xl">
        <form
          onSubmit={handleAddExpense}
          className="flex flex-col justify-between p-2"
        >
          {/* Utilisateur */}
          <div>
            <label htmlFor="user">Utilisateur :</label>
            <select
              id="user"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="">Sélectionnez un utilisateur</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Titre */}
          <div>
            <label htmlFor="title">Titre :</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Montant */}
          <div>
            <label htmlFor="amount">Montant :</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
              {/* Date */}
              <div>
            <label htmlFor="date">Date :</label>
            <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />

          </div>
           {/* Catégorie */}
           <div>
            <label htmlFor="category">Catégorie :</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

         
          {/* Boutons */}
          <div className="flex flex-row justify-evenly">
            <button
              type="submit"
              className="bg-c1 text-c4 p-2 rounded shadow-md"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white p-2 rounded shadow-md"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
