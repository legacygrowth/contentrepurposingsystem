import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Common from "@/components/website/common/Common";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // adjust path as needed
import { setUser } from "@/store/AppStore";


const SubPage = () => {

 const userDetails = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    if(!userDetails.token){      
      navigate("/auth/login");
    }
});

  //const location = useLocation();
  const navigate = useNavigate();
  //const { token } = location.state || {};


  

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <div className="mb-10 px-4 text-center">
        <h2 className="text-3xl font-bold text-black dark:text-white">Choose your plan</h2>
        <p className="mx-auto mt-2 max-w-2xl text-gray-600">
          Pick the plan that fits your needs. Whether you're just getting
          started or scaling a large team, we’ve got you covered.
        </p>
      </div>

      <Common />

      <div className="mt-8 text-center">
        <button
          onClick={handleSkip}
          className="text-blue-600 hover:underline text-sm"
        >
          Skip for now &rarr;
        </button>
      </div>
    </>
  );
};

export default SubPage;
