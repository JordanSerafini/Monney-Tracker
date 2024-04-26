import React, { useState, useCallback } from "react";
import axios from "axios";

interface AddExpenseModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  refreshExpenses?: () => Promise<void>;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  showModal,
  setShowModal,
  refreshExpenses,
}) => {
  // Définit les états
  const currentDate = new Date().toISOString().split("T")[0];
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(currentDate); // Date par défaut
  const [selectedUserId, setSelectedUserId] = useState<string>(); // Définit un utilisateur par défaut ou une valeur vide
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = ["Courses", "Appartement", "Autres", "Avances"];

  const handleAddExpense = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!selectedUserId || !title || !amount || !date || !selectedCategory) {
        console.error("Tous les champs sont obligatoires");
        return;
      }

      try {
        const expense = {
          name: title,
          amount: Number(amount),
          date,
          utilisateur_id: selectedUserId,
          category: selectedCategory,
        };

        await axios.post("https://monney-traker-8d4a3e6cdc56.herokuapp.com/expense", expense);
        setShowModal(false);
        if (refreshExpenses) {
          refreshExpenses();
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de la dépense :", error);
      }
    },
    [
      title,
      amount,
      date,
      selectedCategory,
      selectedUserId,
      refreshExpenses,
      setShowModal,
    ]
  );

  const handleOutClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-gray-strong"
      onClick={(e) => handleOutClick(e)}
    >
      <div className="m-auto bg-white border-4 border-c2 rounded-lg h-4.5/10 w-8.5/10 shadow-2xl justify-evenly">
        <form
          onSubmit={handleAddExpense}
          className="flex flex-col justify-between p-2 gap-5"
        >
          {/* Sélection de l'utilisateur */}
          <div>
            <label htmlFor="user">Utilisateur :</label>
            <select
              id="user"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)} 
              required 
            >
              <option value="">Sélectionnez un utilisateur</option>
              <option value={2}>Jordan</option>
              <option value={1}>Marie</option>
            </select>
          </div>

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

          <div>
            <label htmlFor="date">Date :</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

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

          {/* Boutons d'action */}
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
