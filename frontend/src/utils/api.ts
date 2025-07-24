import axios from "axios";

// Get the API base URL from environment variables, with a fallback
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData._id) {
          config.headers["Authorization"] = `Bearer ${userData._id}`;
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Define user data type
interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  [key: string]: string | undefined; // Allow additional string properties
}

// Common API functions
export const apiService = {
  twitter: {
    postWithMedia: (formData: FormData, queryParams: URLSearchParams) => {
      return api.post(
        `/api/twitter/post-with-media?${queryParams.toString()}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
  },
  // Auth endpoints
  auth: {
    loginWithGoogle: () => {
      window.location.href = `${API_BASE_URL}/api/users/auth/google`;
    },

    // Update the loginWithTwitter function call
    loginWithTwitter: async (isConnectFlow = false) => {
      try {
        // Store flow type in localStorage
        localStorage.setItem(
          "twitterFlowType",
          isConnectFlow ? "connect" : "login",
        );

        const response = await api.post("/api/twitter/login");
        if (response.data?.authorizeUrl) {
          window.location.href = response.data.authorizeUrl;
        } else {
          throw new Error("Invalid Twitter login URL response");
        }
      } catch (error) {
        console.error("Twitter login failed:", error);
        throw new Error("Failed to initiate Twitter login");
      }
    },
    loginWithFacebook: () => {
      // Store the current location for redirect after OAuth
      localStorage.setItem(
        "oauth_redirect_url",
        window.location.origin + "/auth/oauth-callback",
      );
      window.location.href = `${API_BASE_URL}/api/users/auth/facebook`;
    },
    loginWithEmail: (email: string) => {
      return api.post("/api/tempuser/signup", { email });
    },
    verifyToken: (token: string) => {
      return api.get(`/api/users/verifytoken?token=${token}`);
    },
  },

  // User endpoints
  user: {
    updateUser: (id: string, userData: UserData) => {
      return api.put(`/api/users/updateUser/${id}`, userData);
    },
    updatePassword: (id: string, password: string) => {
      return api.put(`/api/users/updatePassword/${id}`, { password });
    },
  },

  // Social media endpoints
  social: {
    googleLogin: (token: string) => {
      return api.post("/api/users/google-login", {
        token,
      });
    },

    facebookLogin: (accessToken: string) => {
      return api.post("/api/users/facebook-login", { accessToken });
    },
    twitterConnect: (oauthToken: string, oauthVerifier: string) => {
      return api.get(
        `/api/twitter/callback?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`,
      );
    },
  },
};

export default api;
