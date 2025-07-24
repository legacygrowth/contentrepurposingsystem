import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store"; // adjust path as needed
import { setUser } from "@/store/AppStore";
import { postRequest } from "@/utils/genericapi";
import axios from "axios";

type UserDataRequest = {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
  agencyname: string;
  workspaceName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  twitterId?: string;
  twitterAccessToken?: string;
  twitterAccessSecret?: string;
};

type UserDataResponse = {
  message: string;
  userType?: string;
  email: string;
  token: string;
  firstName?: string;
  lastName?: string;
  agencyName: string;
  workspaceName: string;
  agencyId: string;
  workspaceId: string;
  isPaymentVerified?: boolean;
  userId: string;
  UserID?: string; // Backend returns UserID
  workspacename?: string; // Backend returns workspacename (lowercase)
};

type TempTokenResponse = {
  message: string;
  token: string;
};

const formSchema = z
  .object({
    firstName: z.string().min(1, "Please enter your first name"),
    lastName: z.string().min(1, "Please enter your last name"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    agencyName: z.string().min(1, "Please enter your agency name"),
    workspaceName: z.string().min(1, "Please enter your workspace name"),
    streetAddress: z.string().min(1, "Please enter your street address"),
    city: z.string().min(1, "Please enter your city"),
    state: z.string().min(1, "Please enter your state"),
    zipCode: z.string().min(1, "Please enter your zip code"),
    country: z.string().min(1, "Please enter your country"),
    email: z.string().email("Please enter a valid email"), // Add email field
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function UserDetailsForm() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [isCreatingTempToken, setIsCreatingTempToken] = useState(false);

  useEffect(() => {
    // token validation
    if (!userDetails.token || userDetails.token.trim() === "") {
      console.log("No valid token found, redirecting to login");
      navigate("/auth/login");
      return;
    }

    console.log("Current token:", userDetails.token);
    console.log("Is Twitter user:", !!userDetails.twitterUserId);
  }, [userDetails.token, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      agencyName: "",
      workspaceName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      email: userDetails.email || "",
    },
  });

  const createTempToken = async (email: string): Promise<string> => {
    try {
      console.log("Creating temp token for email:", email);
      const response = await postRequest<{ email: string }, TempTokenResponse>(
        "/api/tempuser/signup",
        { email },
      );
      console.log("Temp token created:", response.token);
      return response.token;
    } catch (error) {
      console.error("Error creating temp token:", error);
      throw new Error("Failed to create temporary token");
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!userDetails.token) {
      navigate("/auth/login");
      return;
    }

    try {
      setIsCreatingTempToken(true);

      // Determine which token to use
      let actualToken = userDetails.token;

      // If this is a Twitter user, create a temp token first
      if (userDetails.twitterUserId) {
        console.log("Twitter user detected, creating temp token...");
        actualToken = await createTempToken(data.email);
        console.log("Using temp token:", actualToken);
      }

      const reqData: UserDataRequest = {
        token: actualToken, // Use temp token for Twitter users
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        password: data.password,
        agencyname: data.agencyName.trim(),
        workspaceName: data.workspaceName.trim(),
        streetAddress: data.streetAddress.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        zipCode: data.zipCode.trim(),
        country: data.country.trim(),
      };

      // Add Twitter info if available
      if (userDetails.twitterUserId) {
        reqData.twitterId = userDetails.twitterUserId;
        reqData.twitterAccessToken = userDetails.twitterAccessToken;
        reqData.twitterAccessSecret = userDetails.twitterAccessSecret;
      }

      console.log("Submitting user registration:", reqData);

      const responseData = await postRequest<UserDataRequest, UserDataResponse>(
        "/api/tempuser/temptoken",
        reqData,
      );

      console.log("Registration response:", responseData);

      // Handle response - backend returns slightly different field names
      if (responseData) {
        dispatch(
          setUser({
            token: responseData.token,
            userId: responseData.UserID || responseData.userId,
            email: responseData.email,
            agencyName: responseData.agencyName,
            workspaceName:
              responseData.workspacename || responseData.workspaceName,
            firstName: data.firstName,
            lastName: data.lastName,
            agencyId: responseData.agencyId,
            workspaceId: responseData.workspaceId,
          }),
        );
        navigate("/onboarding/choose-plan");
      }
    } catch (error) {
      console.error("Submission error:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        if (status === 404) {
          alert("Invalid token - please try logging in again");
          navigate("/auth/login");
        } else if (status === 400) {
          if (message.includes("Token expired")) {
            alert("Session expired - please log in again");
            navigate("/auth/login");
          } else if (message.includes("User already exists")) {
            alert("An account with this email already exists");
          } else {
            alert(`Error: ${message}`);
          }
        } else {
          alert(`Error: ${message}`);
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsCreatingTempToken(false);
    }
  };

  const inputStyle =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-6">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-6 rounded-lg bg-white p-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Complete Your Profile
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            ["email", "Email Address", "email"],
            ["firstName", "First Name"],
            ["lastName", "Last Name"],
            ["password", "Password", "password"],
            ["confirmPassword", "Confirm Password", "password"],
            ["agencyName", "Agency Name"],
            ["workspaceName", "Workspace Name"],
            ["streetAddress", "Street Address"],
            ["city", "City"],
            ["state", "State"],
            ["zipCode", "Zip Code"],
            ["country", "Country"],
          ].map(([name, placeholder, type = "text"]) => (
            <div key={name}>
              <input
                type={type}
                placeholder={placeholder}
                className={inputStyle}
                {...form.register(name as keyof FormData)}
              />
              {form.formState.errors[name as keyof FormData] && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors[name as keyof FormData]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isCreatingTempToken}
          className="w-full rounded bg-black px-4 py-2 text-white transition duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isCreatingTempToken ? "Setting up account..." : "Next"}
        </button>

        {userDetails.twitterUserId && (
          <p className="text-center text-sm text-gray-600">
            🐦 Connected with Twitter account: @{userDetails.twitterUserId}
          </p>
        )}
      </form>
    </div>
  );
}
