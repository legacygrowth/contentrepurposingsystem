import AuthLayout from "@/layout/AuthLayout";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import OAuthCallback from "@/pages/auth/OAuthCallback";
import TwitterCallback from "@/pages/auth/TwitterCallback"; // Add this import

const authRoutes = [
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "oauth-callback", element: <OAuthCallback /> },
      { path: "twitter-callback", element: <TwitterCallback /> }, // Add this route
    ],
  },
];

export default authRoutes;
