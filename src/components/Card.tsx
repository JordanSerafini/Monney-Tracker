import { Expense } from "./pages/Home";

import loupe from "../assets/loupe.png";
import {  useState } from "react";

interface CardProps {
  cards: Expense[];
  deleteExpense: (expenseId: string) => void;
  fetchData: () => void;
}

function Card({ cards, deleteExpense, fetchData }: CardProps) {

  const [isDetail, setIsDetail] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Expense | null>(null);

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
  };

  const handleDetail = (id: string) => {
    setSelectedCard(cards.find((card) => card.id === id) || null);
    setIsDetail(!isDetail);
  };

  console.log(selectedCard);


  return (
    <div className="flex flex-col gap-2 text-xs p-2">
      {cards.map((card) => (
        <div
          key={card.id}
          className="relative border-1 p-2 flex flex-row w-full justify-between bg-white-perso2"
        >
          <div className="flex flex-row justify-between w-9/10">
            {isDetail ? (
              <div className="w-full">
                <div>{card.name}</div>
                <img src={loupe} alt="" className="w-6" onClick={() => handleDetail(card.id)} />

              </div>
            ) : (
              <>
                <div className="flex flex-col h-full justify-between">
                  <div>{card.amount} €</div>
                  <img src={loupe} alt="" className="w-6" onClick={() => handleDetail(card.id)} />
                </div>
                <div className="flex flex-col items-end">
                  <div className="mr-3">{convertToDayMonth(card.date)}</div>
                  <div className={`${getCatColor(card.category)} px-4 py-1 text-white-perso mt-2`}>
                    {card.category}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="absolute right-2" onClick={() => handleClick(card.id)}>X</div>
        </div>
      ))}
    </div>
  );
  
}

export default Card;
