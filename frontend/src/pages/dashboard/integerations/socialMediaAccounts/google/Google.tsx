/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoginSocialGoogle } from "reactjs-social-login";
import { GoogleLoginButton } from "react-social-login-buttons";

const Google = () => {
  const handleGoogleLogin = (response: any) => {
    console.log("Google login response:", response);
    // Handle the response here - you can send the token to your backend
    if (response.access_token) {
      // Send token to backend for verification
      // apiService.social.googleLogin(response.access_token);
    }
  };

  const handleGoogleError = (error: any) => {
    console.error("Google login error:", error);
  };

  return (
    <>
      <LoginSocialGoogle
        client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
        onResolve={handleGoogleLogin}
        onReject={handleGoogleError}
        scope="profile email"
        redirect_uri={`${window.location.origin}/auth/oauth-callback`}
      >
        <div className="custom-google-btn">
          <GoogleLoginButton text="Continue with Google" />
        </div>
      </LoginSocialGoogle>
    </>
  );
};

export default Google;
