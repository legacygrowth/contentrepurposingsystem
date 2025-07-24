import { FaSearch } from "react-icons/fa";
export default function HelpHeader() {
  return (
    <div className="bg-primary px-4 py-8 text-secondary">
      <div className="mx-auto max-w-4xl">
        {/* Top Section with Logo & Language Selector */}
        <div className="flex items-center justify-between"></div>

        {/* Left Aligned Heading */}
        <h2 className="mt-6 text-left text-2xl font-bold">Help Center</h2>

        {/* Search Bar */}
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search for articles..."
            className="w-full rounded-lg bg-gray-700 px-4 py-3 pl-10 text-gray-200 focus:outline-none"
          />
          <FaSearch className="absolute top-3 left-3 text-lg text-gray-400" />
        </div>
      </div>
    </div>
  );
}
