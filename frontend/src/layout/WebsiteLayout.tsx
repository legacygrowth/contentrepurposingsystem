import Footer from "@/components/website/footer/Footer";
import Navbar from "@/components/website/navbar/Navbar";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

const WebSiteLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default WebSiteLayout;
