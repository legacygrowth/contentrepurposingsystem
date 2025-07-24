import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Zod Schema
const formSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters."),
  username: z.string().min(6, "Username must be at least 6 characters."),
  email: z.string().email("Invalid email address."),
  googleEmail: z
    .string()
    .email("Invalid Google email.")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const Profile = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showEmailInput, setShowEmailInput] = useState(false);
  const [linkedEmails, setLinkedEmails] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      googleEmail: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
  } = form;

  const onSubmit = (data: FormData) => {
    console.log("Settings Form Data:", data);

    if (data.googleEmail) {
      setLinkedEmails((prev) => [...prev, data.googleEmail!]);
    }

    reset();
    setShowEmailInput(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mx-auto max-w-4xl dark:bg-background px-4 py-8 dark:text-white sm:px-6 lg:px-8">
      {/* Heading */}
      <h2 className="mb-2 text-xl font-semibold sm:text-2xl">
        Personal Information
      </h2>
      <p className="mb-6 text-sm text-gray-400">
        Update your personal information. This will be displayed on your profile
        and in account settings.
      </p>

      {/* Profile Image Section */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-medium">M Raza</h3>
          <p className="mb-2 text-sm text-gray-400">razabuck@example.com</p>
          <button
            type="button"
            onClick={triggerFileSelect}
            className="cursor-pointer text-sm font-medium"
          >
            Change Avatar
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- Third Party Accounts Section --- */}
          <div className="pt-2">
            <h3 className="mb-2 text-lg">Third party accounts</h3>
            <p className="mb-4 text-sm text-gray-400">
              Manage your linked accounts for signing in.
            </p>

            {/* Email List */}
            {linkedEmails.length > 0 && (
              <ul className="mb-4 space-y-2">
                {linkedEmails.map((email, index) => (
                  <li
                    key={index}
                    className="rounded-md border bg-gray-50 p-3 text-sm text-gray-700"
                  >
                    {email}
                  </li>
                ))}
              </ul>
            )}

            {/* Google Card */}
            <div className="rounded-lg border border-gray-200 bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="/profile/google-logo.png"
                    alt="Google"
                    className="h-8 w-8"
                  />
                  <div>
                    <p className="font-medium dark:text-white">Google</p>
                    <p className="text-sm text-gray-400">
                      Must match current email
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowEmailInput(!showEmailInput)}
                  className="text-xl font-bold"
                >
                  +
                </button>
              </div>

              {showEmailInput && (
                <FormField
                  control={form.control}
                  name="googleEmail"
                  render={({ field }) => (
                    <FormItem className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter Google email"
                          {...field}
                          className="w-full text-black"
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        className="rounded bg-black  px-4 py-2 text-sm dark:text-white"
                      >
                        Add
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-black px-6 py-2 dark:text-white"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {isSubmitSuccessful && (
            <p className="text-right text-sm text-green-500">
              Changes saved successfully!
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default Profile;
