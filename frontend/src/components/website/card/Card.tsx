interface CardProps {
  image: string;
  title: string;
  description: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ image, title, description, link }) => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 w-full sm:w-80 flex flex-col items-start">
      <img src={image} alt={title} className="w-12 h-12 object-center" />
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-3">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2">{description}</p>
      <a href={link} className="text-black font-medium mt-3">
        Learn more →
      </a>
    </div>
  );
};

export default Card;
