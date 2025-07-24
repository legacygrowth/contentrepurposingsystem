import DashboardLayout from "@/layout/DashboardLayout";
import Home from "@/pages/dashboard/home/Home";
import CreatePost from "@/pages/dashboard/postContent/createPost/CreatePost";
import { RouteObject } from "react-router-dom";
import SocialMediaAccounts from "@/pages/dashboard/integerations/socialMediaAccounts/SocialMediaAccounts";
import ThirdPartyIntegrations from "@/pages/dashboard/integerations/thirdPartyIntegrations/ThirdPartyIntegrations";
import Subscription from "@/pages/dashboard/account/subscription/Subscription";
import Settings from "@/pages/dashboard/account/settings/Settings";
import MediaLibrary from "@/pages/dashboard/mediaLibrary/MediaLibrary";
import Members from "@/pages/dashboard/members/Members";
import Calendar from "@/pages/dashboard/postContent/calendar/Calendar";
import Team from "@/pages/dashboard/account/team/Team";
import { Apikey } from "@/pages/dashboard/account/api key/Api key";
import Help from "@/pages/dashboard/account/help/Help";

const dashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "create-post", element: <CreatePost /> },
      { path: "calendar", element: <Calendar /> },

      {
        path: "social-media-accounts",
        element: <SocialMediaAccounts />,
      },
      {
        path: "third-party-integrations",
        element: <ThirdPartyIntegrations />,
      },
      {
        path: "subscription",
        element: <Subscription />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "media-library",
        element: <MediaLibrary />,
      },
      {
        path: "members",
        element: <Members />,
      },
      {
        path: "team",
        element: <Team />,
      },
      {
        path: "apikey",
        element: <Apikey />,
      },
    ],
  },
];

export default dashboardRoutes;
