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
  const [date] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [category, setCategory] = useState<Array<string>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleAddExpense = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
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
        refreshExpenses?.();
      } catch (error) {
        console.error(error);
        // Ici, ajoutez la gestion des erreurs (par exemple, un état pour afficher un message d'erreur)
      }
    },
    [
      title,
      amount,
      date,
      category,
      selectedUserId,
      refreshExpenses,
      setShowModal,
    ]
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setCategory(selectedOptions);
    },
    []
  );

  // Convertissez le tableau des catégories en chaîne de caractères pour l'affichage
  const selectedCategoriesText =
    category.length > 0
      ? category.join(", ")
      : "Sélectionnez une ou plusieurs catégories";

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

          {/* Catégorie */}
          <div className="flex flex-row gap-2">
            <label htmlFor="category">Catégorie :</label>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer"
            >
              {selectedCategoriesText}
            </div>
            {isDropdownOpen && (
              <select
                id="category"
                value={category}
                onChange={handleCategoryChange}
                multiple
                size={5}
                className="w-full"
              >
                <option value="Courses">Courses</option>
                <option value="Appartement">Appartement</option>
                <option value="Autres">Autres</option>
              </select>
            )}
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
