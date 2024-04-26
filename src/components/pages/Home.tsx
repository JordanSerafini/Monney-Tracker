import { useState, useEffect } from "react";
import axios from "axios";
import AddExpenseModal from "../modals/AddExpenseModal";
import Card from "../Card";

export interface Expense {
  id: string;
  name: string;
  amount: string;
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
      const expensesResponse = await axios.get("https://monney-traker-8d4a3e6cdc56.herokuapp.com/expense");
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
      const response = await axios.get("https://monney-traker-8d4a3e6cdc56.herokuapp.com/expense");
      setExpenses(response.data);
      console.log("Données mises à jour");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des dépenses :", error);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      await axios.delete(`https://monney-traker-8d4a3e6cdc56.herokuapp.com/expense/${expenseId}`);
      setExpenses(expenses.filter((expense) => expense.id !== expenseId));
      refreshExpenses();
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense :", error);
    }
  };

  const getTotal = (expenses: Expense[]): number => {
    const totalArray = expenses.map((expense) => parseFloat(expense.amount));
    const total = totalArray.reduce((sum, current) => sum + current, 0);
    const totalRounded = parseFloat(total.toFixed(2));
    return totalRounded;
  };

  const getDifference = (
    marieExpenses: Expense[],
    jordanExpenses: Expense[]
  ) => {
    const marieTotal = getTotal(marieExpenses);
    const jordanTotal = getTotal(jordanExpenses);
    const difference = marieTotal - jordanTotal;
    if (difference > 0) {
      return "Jordan doit à Marie" + parseFloat(difference.toFixed(2)) + " €";
    } else if (difference < 0) {
      return "Marie doit à Jordan " + parseFloat(difference.toFixed(2)) + " €";
    } else {
      return "Les comptes sont à jour";
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-light3 flex flex-col font-Poppins items-center gap-2 ">
      <div className="flex flex-row w-full min-h-8.5/10 pt-2 ">
        <section className="w-5/10 h-10/10 flex-col flex overflow-auto">
          {/* -------------------------------------------------------------------------------------------------------------------------------------------- */}

          <div className="w-full text-center">Jordan</div>
          {/* -------------------------------------------------------------------------------------------------------------------------------------------- */}
          <div className=" h-10/10 overflow-auto">
            <Card
              cards={jordanExpenses}
              deleteExpense={deleteExpense}
              fetchData={fetchData}
            />
          </div>
          <div className="flex flex-row w-9/10 gap-2 justify-end pt-2">
            Total: <span>{getTotal(jordanExpenses)} €</span>
          </div>
        </section>
        <section className="w-5/10 h-10/10 flex-col flex overflow-auto">
          <div className="w-full text-center">Marie</div>
          <div className=" h-10/10 overflow-auto">
            <Card
              cards={marieExpenses}
              deleteExpense={deleteExpense}
              fetchData={fetchData}
            />
          </div>
          <div className="flex flex-row w-9/10 gap-2 justify-end pt-2">
            Total: <span>{getTotal(marieExpenses)} €</span>
          </div>
        </section>
      </div>
      <div className="flex flex-col w-full h-full justify-center items-center">
        <div className="w-full justify-center flex flex-row items-center">
          {getDifference(marieExpenses, jordanExpenses)}
        </div>
        <div className="w-full h-full">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            onClick={() => setShowModal(true)}
          >
            Ajouter une dépense
          </button>
          <AddExpenseModal
            showModal={showModal}
            setShowModal={setShowModal}
            refreshExpenses={refreshExpenses}
          />
        </div>
      </div>
    </div>
  );
}

export default Main;
