import { Outlet } from "react-router-dom";

export default function OnBoardingLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header or sidebar if any */}
      <Outlet /> {/* ✅ THIS is required to render child routes */}
    </div>
  );
}
