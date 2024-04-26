import { useState, useEffect } from "react";
import axios from "axios";
import AddExpenseModal from "../modals/AddExpenseModal";
import Card from "../Card";

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  utilisateur_id: string;
  category: string;
}

function Main() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [marieExpenses, setMarieExpenses] = useState<Expense[]>([]);
  const [jordanExpenses, setJordanExpenses] = useState<Expense[]>([]);

  const fetchData = async () => {
    try {
      const expensesResponse = await axios.get(
        "http://localhost:5000/expense"
      );
      const expensesData = expensesResponse.data;

      setExpenses(expensesData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const marieExpenses = expenses.filter(
      (expense) => expense.utilisateur_id == "1"
    );
    setMarieExpenses(marieExpenses);

    const jordanExpenses = expenses.filter(
      (expense) => expense.utilisateur_id == "2"
    );
    setJordanExpenses(jordanExpenses);
  }, [expenses]);


  const refreshExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/expense");
      setExpenses(response.data);
      console.log("Données mises à jour");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des dépenses :", error);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      await axios.delete(`http://localhost:5000/expense/${expenseId}`);
      setExpenses(expenses.filter((expense) => expense.id !== expenseId));
      refreshExpenses();
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense :", error);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-light3 flex flex-col">
      <div className="flex flex-row w-full h-9/10 ">
        <section className="w-5/10  flex-col flex overflow-auto">
          <div>Jordan</div>
          <div>
            < Card cards={jordanExpenses} deleteExpense={deleteExpense}  />
          </div>
        </section>
        <section className="w-5/10">
          marie
          </section>
      </div>
    </div>
  );
}

export default Main;
