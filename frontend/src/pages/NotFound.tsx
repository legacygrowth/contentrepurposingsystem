import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-black">404</h1>
        <p className="mt-4 text-2xl text-gray-600">Oops! Page not found.</p>
        <p className="text-md mt-2 text-gray-500">
          The page you’re looking for doesn’t exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 rounded-xl bg-black px-6 py-3 text-white shadow transition duration-200 hover:bg-black"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
