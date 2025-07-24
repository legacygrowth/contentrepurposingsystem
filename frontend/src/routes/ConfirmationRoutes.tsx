import ConfirmationLayout from "@/layout/ConfirmationLayout";
import ConfirmationFile from "@/pages/ConfirmationFile";

const Confirmation = [
  {
    path: "/user",
    element: <ConfirmationLayout />,
    children: [{ path: "verify-token", element: <ConfirmationFile /> }],
  },
];

export default Confirmation;
