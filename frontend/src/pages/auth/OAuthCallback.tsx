import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/AppStore";
import { Loader2 } from "lucide-react";

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const error = searchParams.get("error");
        const user = searchParams.get("user");

        // Handle errors first
        if (error) {
          setError(decodeURIComponent(error));
          setIsProcessing(false);
          return;
        }

        // All providers should return a user parameter
        if (!user) {
          setError("No user data received");
          setIsProcessing(false);
          return;
        }

        // Parse user data from your backend
        const decodedUser = decodeURIComponent(user);
        const userInfo = JSON.parse(decodedUser);

        // Generate a token (using user ID as token)
        const token = userInfo._id;

        if (token) {
          // Store user data in Redux
          dispatch(
            setUser({
              token: token,
              userId: userInfo._id,
              email: userInfo.email,
              agencyName: userInfo.agencyName || "",
              workspaceName: userInfo.workspaceName || "",
              firstName:
                userInfo.firstName || userInfo.name?.split(" ")[0] || "",
              lastName: userInfo.lastName || userInfo.name?.split(" ")[1] || "",
              agencyId: userInfo.agencyId || "",
              workspaceId: userInfo.workspaceId || "",
            }),
          );

          // Navigate based on payment verification
          if (userInfo.isPaymentVerified) {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/onboarding/choose-plan", { replace: true });
          }
        } else {
          setError("Invalid user data received");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError("Failed to process authentication");
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 p-3">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Authentication Failed
            </h3>
            <p className="mb-4 text-sm text-gray-600">{error}</p>
            <button
              onClick={() => navigate("/auth/login")}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Completing Sign In
          </h3>
          <p className="text-sm text-gray-600">
            Please wait while we complete your authentication...
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
