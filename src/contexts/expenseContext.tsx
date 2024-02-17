import  { createContext, useState, FC, ReactNode } from 'react';

// Interface pour définir le type des données dans le contexte
interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (newExpense: Expense) => void;
  deleteExpense: (id: string) => void;
  editExpense: (id: string, newExpense: Expense) => void;
}

// Interface pour définir le type d'une dépense
interface Expense {
  id: string;
  name: string;
  amount: number;
  date: Date;
  comment: string;
}

// Création du contexte avec le type spécifié
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Provider du contexte
interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: FC<ExpenseProviderProps> = ({ children }) => {
  // État local pour stocker la liste des dépenses
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Fonction pour ajouter une dépense à la liste
  const addExpense = (newExpense: Expense) => {
    setExpenses([...expenses, newExpense]);
  };

  // Fonction pour supprimer une dépense de la liste
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // Fonction pour modifier une dépense dans la liste
  const editExpense = (id: string, newExpense: Expense) => {
    setExpenses(expenses.map((expense) => expense.id === id ? newExpense : expense));
  };

  // Valeur fournie par le contexte
  const value: ExpenseContextType = {
    expenses,
    addExpense,
    deleteExpense,
    editExpense
  };

  // Rendu du Provider avec le contexte
  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
