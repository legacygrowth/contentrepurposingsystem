import { FaVideo, FaBookmark, FaQuestionCircle } from "react-icons/fa";

const cards = [
  {
    icon: <FaVideo size={24} />,
    title: "Trounce University",
    description: "Your essential guide to everything Trounce",
    authors: [
      {
        name: "Author 1",
        img: "/featureNav/content/helpcenter/Profile_Picture-1623931754.png",
      },
    ],
    articles: 7,
    link: "#", // Replace with actual URL
  },
  {
    icon: <FaBookmark size={24} />,
    title: "Help Articles",
    description: "Have an issue? You'll probably find the answer here",
    authors: [
      {
        name: "Author 1",
        img: "/featureNav/content/helpcenter/Profile_Picture-1623931754.png",
      },
      {
        name: "Author 2",
        img: "/featureNav/content/helpcenter/photo-1682068614.jpg",
      },
    ],
    articles: 102,
    link: "#", // Replace with actual URL
  },
  {
    icon: <FaQuestionCircle size={24} />,
    title: "FAQ",
    description: "Your essential guide to everything Trounce",
    authors: [
      {
        name: "Author 1",
        img: "/featureNav/content/helpcenter/Profile_Picture-1623931754.png",
      },
    ],
    articles: 20,
    link: "#", // Replace with actual URL
  },
];

export default function HelpCards() {
  return (
    <div className="flex justify-center gap-4 py-6">
      {cards.map((card, index) => (
        <a
          key={index}
          href={card.link}
          className="w-80 cursor-pointer rounded-lg border bg-primary p-6 shadow-md transition duration-300 hover:shadow-lg"
        >
          <div className="mb-3 text-gray-600">{card.icon}</div>
          <h2 className="text-lg text-white font-semibold">{card.title}</h2>
          <p className="text-gray-500">{card.description}</p>
          <div className="mt-4 flex items-center">
            {card.authors.map((author, i) => (
              <img
                key={i}
                src={author.img}
                alt={author.name}
                className="-ml-2 h-8 w-8 rounded-full border border-gray-300 first:ml-0"
              />
            ))}
            <p className="ml-2 text-sm text-gray-500">
              {card.authors.length} author{card.authors.length > 1 ? "s" : ""} •{" "}
              {card.articles} articles
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
