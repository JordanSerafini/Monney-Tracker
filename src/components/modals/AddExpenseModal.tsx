import React, { useState } from "react";
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
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const expense = {
        name: title,
        amount: Number(amount),
        date,
        category,
        utilisateur_id: selectedUserId,
      };
      await axios.post("http://localhost:5000/expense", expense);
      setShowModal(false);
      if (refreshExpenses) refreshExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="m-auto bg-white border-4 border-c2 rounded-lg w-8.5/10 shadow-2xl">
        {/* Tout le formulaire */}
        <form 
        onSubmit={handleAddExpense}
        className="flex flex-col justify-between p-2"
        >
          <label htmlFor="user"></label>
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

          <label htmlFor="title">Titre :</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="amount">Montant :</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <label htmlFor="date">Date :</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            
          />

          <label htmlFor="category">Catégorie :</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            
          />

          <div className="flex flex-row justify-evenly">
            <button 
            type="submit"
            className="bg-c1 text-c4 p-2 rounded shadow-md hover:bg-c2 hover:text-c1 transition-all duration-300 ease-in-out"
            >Ajouter</button>
            <button 
            type="button" 
            onClick={() => setShowModal(false)}
            className="bg-red-500 text-white p-2 rounded shadow-md hover:bg-red-700 transition-all duration-300 ease-in-out"
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
