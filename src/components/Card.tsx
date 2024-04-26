import { Expense } from "./pages/Home";

interface CardProps {
  cards: Expense[];
  deleteExpense: (expenseId: string) => void;
  fetchData: () => void;
}

function Card({ cards, deleteExpense, fetchData }: CardProps) {

  console.log(cards);

  function convertToDayMonth(isoDate: string) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${day}/${month}`;
  }

  return (
    <div className="flex flex-col gap-5 text-xs p-2">
      {cards.map((card) => (
        <div key={card.id} className="border-1 p-2 flex w-9.5/10 justify-between">
          <div>
            <div>{card.name}</div>
            <div>{card.amount} €</div>
          </div>
          <div className="flex flex-col justify-center items-end">
            <div>{convertToDayMonth(card.date)}</div>
            <div>{card.category}</div>
          </div>
          <div onClick={() => deleteExpense(card.id)}>
            X
          </div>
        </div>
      ))}
    </div>
  );
}

export default Card;
