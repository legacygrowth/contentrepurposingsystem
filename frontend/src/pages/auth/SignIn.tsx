import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBrandGoogle,
  IconBrandTwitter,
  IconMail,
  IconLock,
} from "@tabler/icons-react";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { InboxIcon } from "lucide-react";
import { apiService } from "@/utils/api";
import { postRequest } from "@/utils/genericapi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/AppStore";
import { RootState } from "@/store";

type SignInRequest = {
  email: string;
  password?: string;
};

type SignInResponse = {
  message: string;
  userType: string;
  email: string;
  token: string;
  firstName: string;
  lastName: string;
  agencyName: string;
  workspaceName: string;
  agencyId: string;
  workspaceId: string;
  isPaymentVerified: boolean;
  userId: string;
};

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().optional(),
});

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoadingTwitter, setIsLoadingTwitter] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const magicLinkMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await postRequest<SignInRequest, SignInResponse>(
        "/api/tempuser/signup",
        { email },
      );
      return res;
    },
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      setShowConfirmation(true);
      form.reset();
    },
    onError: (error: AxiosError) => {
      const message =
        (error?.response?.data as { message?: string })?.message ||
        "Something went wrong. Try again.";
      form.setError("root", { message });
    },
  });

  const token = useSelector((state: RootState) => state.user.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values: { email: string; password?: string }) => {
    if (!showPassword) {
      magicLinkMutation.mutate({ email: values.email });
    } else {
      // Use the correct login endpoint
      try {
        const res = await postRequest<SignInRequest, SignInResponse>(
          "/api/users/login", // Changed to match backend
          {
            email: values.email,
            password: values.password,
          },
        );

        console.log("Login successful:", res);

        if (res?.token) {
          dispatch(
            setUser({
              token: res.token,
              userId: res.userId,
              email: res.email,
              agencyName: res.agencyName,
              workspaceName: res.workspaceName,
              firstName: res.firstName,
              lastName: res.lastName,
              agencyId: res.agencyId,
              workspaceId: res.workspaceId,
            }),
          );
          navigate("/dashboard");
        }
      } catch (error) {
        const message = "Invalid credentials";
        form.setError("root", { message });
        console.error("Login error:", error);
      }
    }
  };

  const handleTwitterLogin = async () => {
    setIsLoadingTwitter(true);
    try {
      localStorage.setItem("post_twitter_redirect", window.location.pathname);
      await apiService.auth.loginWithTwitter(false);
    } catch (error) {
      form.setError("root", {
        message: "Failed to start Twitter login. Please try again.",
      });
      setIsLoadingTwitter(false);
    }
  };

  const handleGoogleLogin = () => {
    apiService.auth.loginWithGoogle();
  };

  return (
    <div className="bg-background relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border">
      <DotPattern
        className={cn(
          "h-full w-full [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
        )}
      />

      {showConfirmation ? (
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 text-center md:rounded-2xl md:p-8 dark:bg-black">
          <InboxIcon className="mx-auto mb-2 h-6 w-6" />
          <h2 className="text-xl font-bold">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            We've sent a magic link to{" "}
            <strong className="underline">{submittedEmail}</strong>. Click the
            link to sign in.
          </p>
        </div>
      ) : (
        <div className="shadow-input relative mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
          <h2 className="text-center text-xl font-bold text-neutral-800 dark:text-neutral-200">
            Login to ES
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-300">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-neutral-600 underline">
              Sign up
            </Link>
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="my-8 space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="elon@spacex.com"
                          type="email"
                          className="pl-10"
                          {...field}
                        />
                        <IconMail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showPassword && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type="password"
                            className="pl-10"
                            {...field}
                          />
                          <IconLock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.formState.errors.root && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
              )}

              <button
                type="submit"
                className="flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-black font-medium text-white transition hover:opacity-90 dark:bg-zinc-800"
                disabled={magicLinkMutation.isPending}
              >
                {showPassword ? (
                  <>
                    <IconLock className="h-4 w-4" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <IconMail className="h-4 w-4" />
                    <span>
                      {magicLinkMutation.isPending
                        ? "Sending..."
                        : "Send me a magic link"}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="flex h-10 w-full cursor-pointer items-center justify-center space-x-2 rounded-md bg-gray-100 font-medium text-black transition hover:bg-gray-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                <IconLock className="h-4 w-4" />
                <span>
                  {showPassword
                    ? "Use magic link instead"
                    : "Login using password"}
                </span>
              </button>

              <div className="my-4 flex items-center space-x-2">
                <div className="h-px flex-1 bg-gray-300 dark:bg-neutral-700" />
                <span className="text-xs text-gray-500">OR</span>
                <div className="h-px flex-1 bg-gray-300 dark:bg-neutral-700" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex h-10 w-full cursor-pointer items-center justify-center space-x-2 rounded-md border bg-white font-medium text-black transition hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-zinc-800"
              >
                <IconBrandGoogle className="h-4 w-4" />
                <span>Continue with Google</span>
              </button>

              {/* <div className="flex items-center justify-center">
                <FacebookLoginButton
                  onLoginSuccess={handleLoginSuccess}
                  onLogout={handleLogout}
                />
              </div> */}

              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleTwitterLogin}
                  disabled={isLoadingTwitter}
                  className="flex h-10 w-full cursor-pointer items-center justify-center space-x-2 rounded-md border bg-white font-medium text-black transition hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-zinc-800"
                >
                  <IconBrandTwitter className="h-4 w-4" />
                  <span>
                    {isLoadingTwitter
                      ? "Redirecting to Twitter..."
                      : "Continue with Twitter"}
                  </span>
                </button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default SignIn;
