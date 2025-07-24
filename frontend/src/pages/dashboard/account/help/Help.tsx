import { useEffect } from 'react';
import {
  FaVideo,
  FaBookmark,
  FaQuestionCircle,
  FaSearch,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // adjust path as needed
import { setUser } from "@/store/AppStore";
import { useNavigate } from "react-router-dom";

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
    link: "#",
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
    link: "#",
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
    link: "#",
  },
];

export default function Help() {

 const userDetails = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    if(!userDetails.token){      
      navigate("/auth/login");
    }
});

  //const location = useLocation();
  const navigate = useNavigate();
  //const { token } = location.state || {};

  return (
    <div className="min-h-screen bg-white text-black dark:bg-background dark:text-white">
      {/* Header Section */}
      <div className="px-4 py-8 sm:px-6 lg:px-8 border-b">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Help Center</h2>

          {/* Search Bar */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search for articles..."
              className="w-full rounded-lg bg-gray-700 px-4 py-3 pl-10 text-gray-200 placeholder:text-gray-400 focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-lg text-gray-400" />
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:flex-wrap">
          {cards.map((card, index) => (
            <a
              key={index}
              href={card.link}
              className="w-full max-w-xs rounded-lg border bg-primary p-6 shadow-md transition duration-300 hover:shadow-lg"
            >
              <div className="mb-3 text-gray-100 dark:text-gray-500">{card.icon}</div>
              <h2 className="text-lg font-semibold text-white dark:text-black">
                {card.title}
              </h2>
              <p className="text-sm text-gray-300 dark:text-gray-700">
                {card.description}
              </p>
              <div className="mt-4 flex items-center flex-wrap">
                {card.authors.map((author, i) => (
                  <img
                    key={i}
                    src={author.img}
                    alt={author.name}
                    className="-ml-2 h-8 w-8 rounded-full border border-gray-300 first:ml-0"
                  />
                ))}
                <p className="ml-2 text-sm text-gray-300 dark:text-gray-600">
                  {card.authors.length} author
                  {card.authors.length > 1 ? "s" : ""} • {card.articles} articles
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
