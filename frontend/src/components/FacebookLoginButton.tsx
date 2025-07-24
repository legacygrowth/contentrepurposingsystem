import React, { useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login";
import {
  ReactFacebookFailureResponse,
  ReactFacebookLoginInfo,
} from "react-facebook-login";
import { Facebook } from "lucide-react";
import { FacebookUser } from "../types/Facebook";
import { loadFacebookSDK } from "../utils/facebookSdk";

interface FacebookLoginButtonProps {
  onLoginSuccess: (user: FacebookUser, token: string) => void;
  onLogout: () => void;
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({
  onLoginSuccess,
  onLogout,
}) => {
  const [isSdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadFacebookSDK()
      .then(() => setSdkLoaded(true))
      .catch(() => setError("Failed to load Facebook SDK"));
  }, []);

  const isFacebookLoginInfo = (
    res: ReactFacebookLoginInfo | ReactFacebookFailureResponse,
  ): res is ReactFacebookLoginInfo => {
    return !!(res as ReactFacebookLoginInfo).accessToken;
  };

  const handleResponse = (
    response: ReactFacebookLoginInfo | ReactFacebookFailureResponse,
  ): void => {
    if (!isFacebookLoginInfo(response)) {
      setError("Login failed or user canceled.");
      setIsLoggedIn(false);
      return;
    }

    const user: FacebookUser = {
      id: response.userID,
      name: response.name ?? "",
      email: response.email ?? "",
      picture: {
        data: {
          url: response.picture?.data?.url ?? "",
        },
      },
    };

    setIsLoggedIn(true);
    onLoginSuccess(user, response.accessToken);
  };

  const handleFailure = () => {
    setError("User cancelled or denied permissions");
  };

  const logout = () => {
    window.FB.logout(() => {
      setIsLoggedIn(false);
      onLogout();
    });
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      {isSdkLoaded && !isLoggedIn && (
        <FacebookLogin
          appId="1417585822997480"
          autoLoad={false}
          fields="name,email,picture"
          scope="public_profile,email"
          callback={handleResponse}
          onFailure={handleFailure}
          render={(renderProps: any) => (
            <button
              type="button"
              onClick={renderProps.onClick}
              className="flex h-10 w-full cursor-pointer items-center justify-center space-x-2 rounded-md border bg-white font-medium text-black transition hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-zinc-800"
            >
              <Facebook className="h-4 w-4" />
              <span>Continue with Facebook</span>
            </button>
          )}
        />
      )}

      {isLoggedIn && (
        <button
          onClick={logout}
          className="rounded bg-red-600 px-4 py-2 text-white"
        >
          Logout
        </button>
      )}
    </>
  );
};

export default FacebookLoginButton;
