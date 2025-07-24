import AdminLayout from "@/layout/AdminLayout";
import { RouteObject } from "react-router-dom";
import Workspaces from "@/pages/admin-dashboard/Workspaces";
import Companies from "@/pages/admin-dashboard/Companies";
import Roles from "@/pages/admin-dashboard/Roles";
import PaymentPlans from "@/pages/admin-dashboard/PaymentPlans";
import Users from "@/pages/admin-dashboard/Users";
import AdminHome from "@/pages/admin-dashboard/AdminHome";
import AdminSocialAccounts from "@/pages/admin-dashboard/Admin-Social-Accounts";
import Configurations from "@/pages/admin-dashboard/Configurations";


const AdminRoutes: RouteObject[] = [
  {
    path: "admin-dashboard",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminHome /> },
      { path: "companies", element: <Companies /> },
      { path: "workspaces", element: <Workspaces /> },

      {
        path: "users",
        element: <Users />,
      },
      {
        path: "roles",
        element: <Roles />,
      },
      
      {
        path: "paymentplans",
        element: <PaymentPlans />,
      },
      {
        path: "admin-social-accounts",
        element: <AdminSocialAccounts />,
      },
      {
        path: "configurations",
        element: <Configurations />,
      },
      
    ],
  },
];

export default AdminRoutes;
