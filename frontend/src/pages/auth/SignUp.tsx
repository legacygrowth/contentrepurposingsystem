import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaGoogle } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { InboxIcon } from "lucide-react";
import { useState } from "react";
import { Link, Navigate } from "react-router";
import { apiService } from "@/utils/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// const baseUrl = import.meta.env.VITE_API_BASE_URL;

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const SignUp = () => {
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleGoogleLogin = () => {
    apiService.auth.loginWithGoogle();
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await axios.post(
        `http://localhost:5000/api/tempuser/signup`,
        {
          email,
        },
      );
      console.log(res.data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      setShowConfirmation(true);
      form.reset();
    },
    onError: (error: AxiosError) => {
      interface ErrorResponse {
        message?: string;
      }
      const message =
        (error?.response?.data as ErrorResponse)?.message ||
        "Something went wrong. Try again.";
      form.setError("root", { message });
    },
  });
  const token = useSelector((state: RootState) => state.user.token);
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    form.clearErrors(); // Clear previous server-side error
    mutation.mutate(values);
  };

  return (
    <div className="bg-background relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border">
      <DotPattern
        className={cn(
          "h-full w-full [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
        )}
      />

      {showConfirmation ? (
        <Card className="relative z-[9999999] mx-auto mt-10 max-w-sm p-6">
          <CardContent>
            <InboxIcon />
            <h2 className="font-semibol mb-2 text-xl">Check your email</h2>
            <p className="mb-4 text-sm font-light">
              We emailed a magic link to{" "}
              <strong className="underline">{submittedEmail}</strong>. Click the
              link in the email to continue.
            </p>

            <div className="my-4">
              <Separator />
            </div>

            <p className="mt-4 text-xs">
              By continuing, you agree to the{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="relative z-[9999999] mx-auto mt-10 max-w-sm p-6">
          <CardContent>
            <h2 className="mb-2 text-xl font-semibold">Sign up to Ocoya</h2>
            <p className="mb-4 text-sm">
              Already have an account?{" "}
              <Link to="/auth/login" className="underline">
                Login
              </Link>
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="elon@spacex.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Global Form Error (Server-side) */}
                {form.formState.errors.root && (
                  <FormMessage>
                    {form.formState.errors.root.message}
                  </FormMessage>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Sending..." : "Send magic link"}
                </Button>
              </form>
            </Form>

            <div className="my-4">
              <Separator />
            </div>

            <Button
              variant="outline"
              className="flex w-full items-center gap-2"
              onClick={handleGoogleLogin}
            >
              <FaGoogle size={18} />
              Continue with Google
            </Button>

            <p className="mt-4 text-xs">
              By continuing, you agree to the{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignUp;
