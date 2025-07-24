import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/AppStore";
import { apiService } from "@/utils/api";

const TwitterCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const oauthToken = queryParams.get("oauth_token");
  const oauthVerifier = queryParams.get("oauth_verifier");

  useEffect(() => {
    const handleTwitterLogin = async () => {
      try {
        const flowType = localStorage.getItem("twitterFlowType");
        localStorage.removeItem("twitterFlowType");

        if (flowType === "connect") {
          // Connect flow - attach to existing account
          const response = await apiService.social.twitterConnect(
            oauthToken,
            oauthVerifier,
          );

          // Store Twitter credentials in Redux
       dispatch(
         setUser({
           twitterAccessToken: response.data.oauth.oauth_token,
           twitterAccessTokenSecret: response.data.oauth.oauth_token_secret, // Fixed field name
           twitterUsername: response.data.oauth.screen_name,
           twitterUserId: response.data.oauth.user_id,
           twitterProfileImage:
             response.data.userDetails.data.profile_image_url,
         }),
       );

          // Redirect back to social media page
          const returnPath =
            localStorage.getItem("twitterReturnPath") ||
            "/dashboard/social-media-accounts";
          navigate(returnPath);
        } else {
          const response = await apiService.social.twitterLogin(
            oauthToken,
            oauthVerifier,
          );

          // Extract the data from the response
          const { data } = response;
          console.log("Twitter login response:", data);

          // Extract user details from the response
          const userDetails = data.userDetails.data;
          const oauthData = data.oauth;

          // Create a mock user object with the data we have
      const user = {
        token: oauthToken, // Using oauthToken as temporary token
        userId: userDetails.id,
        email: "", // Twitter doesn't provide email by default
        firstName: userDetails.name.split(" ")[0] || "",
        lastName: userDetails.name.split(" ").slice(1).join(" ") || "",
        agencyName: "",
        workspaceName: "",
        agencyId: "",
        workspaceId: "",
        twitterAccessToken: oauthData.oauth_token,
        twitterAccessTokenSecret: oauthData.oauth_token_secret, // Fixed field name
        twitterUsername: oauthData.screen_name,
        twitterUserId: oauthData.user_id,
      };

          dispatch(setUser(user));

          // Since we don't have payment verification info, redirect to onboarding
          navigate("/onboarding/flow");
        }
      } catch (error) {
        console.error("Twitter login failed:", error);
        navigate("/auth/signin", { state: { error: "Twitter login failed" } });
      }
    };

    handleTwitterLogin();
  }, [oauthToken, oauthVerifier, dispatch, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Processing Twitter Login...</h2>
        <p>Please wait while we authenticate your account</p>
      </div>
    </div>
  );
};

export default TwitterCallback;
