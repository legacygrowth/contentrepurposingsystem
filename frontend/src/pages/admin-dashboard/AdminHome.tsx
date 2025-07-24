import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ChartAreaInteractive } from "@/components/dashboard/chartArea/ChartArea";
import { SectionCards } from "@/components/dashboard/sectionCards/sectionCards";

const AdminHome = () => {
  const userDetails = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userDetails) {
      if (!userDetails.token) {
        navigate("/auth/login", { replace: true }); 
      } else {
        setIsLoading(false);
      }
    }
  }, [userDetails, navigate]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
