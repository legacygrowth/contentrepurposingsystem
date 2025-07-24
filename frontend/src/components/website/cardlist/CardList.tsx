import Card from "../card/Card";

// Define the type for each card object
interface CardData {
  image: string;
  title: string;
  description: string;
  link: string;
}

// Define the type for the props of CardList
interface CardListProps {
  cardsData: CardData[];
}

const CardList: React.FC<CardListProps> = ({ cardsData }) => {
  return (
    <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
      {cardsData?.map((card, index) => <Card key={index} {...card} />)}
    </div>
  );
};

export default CardList;
