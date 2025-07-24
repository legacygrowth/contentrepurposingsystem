import OnBoardingLayout from "@/layout/OnBoardingLayout";

import ReAuthenticateScreen from "@/pages/auth/ReAuthenticateScreen";
import StepFlow from "@/pages/auth/StepFlow";
import SubPage from "@/pages/auth/Subpage";
import UserDetailsForm from "@/pages/auth/UserForm";

const Onboard = [
  {
    path: "/onboarding",
    element: <OnBoardingLayout />,
    children: [
      { path: "flow", element: <StepFlow /> },
      { path: "re-authenticate", element: <ReAuthenticateScreen /> },

      { path: "user-details", element: <UserDetailsForm /> },
      { path: "choose-plan", element: <SubPage /> },
    ],
  },
];

export default Onboard;
