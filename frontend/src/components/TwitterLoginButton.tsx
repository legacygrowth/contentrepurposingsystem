// src/components/TwitterLoginButton.tsx
import React, { useState } from "react";
import { Twitter } from "lucide-react";

interface TwitterLoginButtonProps {
  onLoginSuccess: (user: any, token: string) => void;
}

const TwitterLoginButton: React.FC<TwitterLoginButtonProps> = ({
  onLoginSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTwitterLogin = () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the API base URL from environment variables
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

      // Store the current location for redirect after OAuth
      localStorage.setItem(
        "oauth_redirect_url",
        window.location.origin + "/auth/twitter-callback",
      );

      // Redirect to Twitter OAuth endpoint
      window.location.href = `${API_BASE_URL}/api/users/auth/twitter`;
    } catch (err) {
      setIsLoading(false);
      setError("Failed to initiate Twitter login.");
      console.error("Twitter login error:", err);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <p className="mb-2 text-center text-sm text-red-500">{error}</p>
      )}
      <button
        onClick={handleTwitterLogin}
        disabled={isLoading}
        className={`flex w-full items-center justify-center gap-2 rounded-md bg-[#1DA1F2] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a91da] focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70`}
      >
        <Twitter size={18} />
        <span>
          {isLoading ? "Redirecting to Twitter..." : "Continue with Twitter"}
        </span>
      </button>
    </div>
  );
};

export default TwitterLoginButton;
