import React, { useState } from 'react';
import axios from 'axios';

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
  refreshExpenses 
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

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
      await axios.post('http://localhost:5000/expense', expense);
      setShowModal(false);
      if (refreshExpenses) refreshExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <form onSubmit={handleAddExpense}>
          <label htmlFor="user">Utilisateur :</label>
          <select id="user" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required>
            <option value="">Sélectionnez un utilisateur</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>

          <label htmlFor="title">Titre :</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label htmlFor="amount">Montant :</label>
          <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />

          <label htmlFor="date">Date :</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

          <label htmlFor="category">Catégorie :</label>
          <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

          <div className="modal-actions">
            <button type="submit">Ajouter Dépense</button>
            <button type="button" onClick={() => setShowModal(false)}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
