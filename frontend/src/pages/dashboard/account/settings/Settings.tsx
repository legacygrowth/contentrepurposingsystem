import { useEffect } from 'react';
import Profile from "@/components/profile/Profile";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppearenceCard from "../appearence/Appearence";
import NotificationCard from "../notification/Notification";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // adjust path as needed
import { setUser } from "@/store/AppStore";
import { useNavigate } from "react-router-dom";

export default function Settings() {

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
    <div className="container mx-auto">
      <h2 className="mb-6 ml-5 text-xl text-black dark:text-white font-semibold">Profile Settings</h2>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="flex w-full justify-start gap-2 border-b border-gray-200">
          <TabsTrigger
            value="profile"
            className="rounded-md px-3 py-1 text-sm data-[state=active]:bg-white"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="rounded-md px-3 py-1 text-sm data-[state=active]:bg-white"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-md px-3 py-1 text-sm data-[state=active]:bg-white"
          >
            Calender
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-md px-3 py-1 text-sm data-[state=active]:bg-white"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="mt-4 p-4">
            <Profile />
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="mt-4 p-4">
          <AppearenceCard/>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="mt-4 p-4">
            <NotificationCard/>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="mt-4 p-4">
            <p>Security settings go here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
