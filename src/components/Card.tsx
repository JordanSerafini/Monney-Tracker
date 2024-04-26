import { Expense } from "./pages/Home";

interface CardProps {
  cards: Expense[];
  deleteExpense: (expenseId: string) => void;
  fetchData: () => void;
}

function Card({ cards, deleteExpense, fetchData }: CardProps) {

  function convertToDayMonth(isoDate: string) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${day}/${month}`;
  }

  const handleClick = async (id: string) => {
    deleteExpense(id);
    await fetchData();
  };

  const getCatColor = (category: string) => {
    switch (category) {
      case "Appartement":
        return "bg-green-500";
      case "Courses":
        return "bg-yellow-500";
      case "Autres":
        return "bg-blue-500";
      case "Avances":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  }

  return (
    <div className="flex flex-col gap-2 text-xs p-2">
      {cards.map((card) => (
        <div
          key={card.id}
          className="relative border-1 p-2 flex flex-row w-9.5/10 justify-between bg-white-perso2"
        >
          <div className="flex flex-row justify-between w-9/10">
            <div className="flex flex-col h-full justify-between">
              <div>{card.name}</div>
              <div>{card.amount} €</div>
            </div>
            <div className="flex flex-col items-end">
              <div>{convertToDayMonth(card.date)}</div>
              <div className={`${getCatColor(card.category)} px-4 py-1 text-white-perso mt-2`}>{card.category}</div>
            </div>
          </div>
          <div
            className="absolute right-2"
            onClick={() => handleClick(card.id)}
          >
            X
          </div>
        </div>
      ))}
    </div>
  );
}

export default Card;
