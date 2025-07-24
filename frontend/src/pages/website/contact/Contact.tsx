"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define form schema with zod
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

const Contact = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
  } = form;

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    reset(); // Reset form on success
  };

  return (
    <div className="mt-24 flex min-h-screen flex-col items-center justify-center bg-[var(--base-color)] px-6 text-[var(--contrast-color)]">
      <h2 className="mb-6 text-3xl font-bold">Get in Touch</h2>
      <p className="mb-8 max-w-md text-center text-lg text-gray-600 dark:text-gray-300">
        Feel free to reach out for collaborations or just a friendly chat.
      </p>

      <div className="mb-10 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-center rounded-2xl border bg-[var(--base-color)] p-6 shadow-lg transition hover:scale-105">
          <Mail size={28} className="mb-4 text-[var(--contrast-color)]" />
          <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
          <p className="font-medium">contact@example.com</p>
        </div>
        <div className="flex flex-col items-center rounded-2xl border bg-[var(--base-color)] p-6 shadow-lg transition hover:scale-105">
          <Phone size={28} className="mb-4 text-[var(--contrast-color)]" />
          <p className="text-sm text-gray-600 dark:text-gray-300">Phone</p>
          <p className="font-medium">+123 456 7890</p>
        </div>
        <div className="flex flex-col items-center rounded-2xl border bg-[var(--base-color)] p-6 shadow-lg transition hover:scale-105">
          <MapPin size={28} className="mb-4 text-[var(--contrast-color)]" />
          <p className="text-sm text-gray-600 dark:text-gray-300">Location</p>
          <p className="font-medium">New York, USA</p>
        </div>
      </div>

      {/* Contact Form */}
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl space-y-6 rounded-2xl bg-[var(--base-color)] p-6 shadow-lg"
        >
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message Field */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full rounded-lg border bg-[var(--base-color)] p-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    placeholder="Your Message"
                  ></textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="border-contrast w-full rounded-lg border text-[var(--contrast-color)] transition-colors duration-300 hover:bg-[var(--contrast-color)] hover:text-[var(--base-color)]"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>

          {/* Success Message */}
          {isSubmitSuccessful && (
            <p className="mt-4 text-center text-green-500">
              Message sent successfully!
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default Contact;
