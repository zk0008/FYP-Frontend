"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { signUp } from "@/utils/auth";
import { useToast } from "@/hooks";

const signUpFormSchema = z.object({
  username: z.string()
    .min(2, "Username must be at least 2 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_.]+$/, "Username must only contain letters, numbers, underscores, and periods")
    .regex(/^\S+$/, "Username must not contain spaces"),
  email: z.string()
    .email("Please enter a valid email address")
    .regex(/^\S+$/, "Email must not contain spaces"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
    .regex(/^\S+$/, "Password must not contain spaces"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpFormSchema>) => {
    const { user, error } = await signUp({
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if (user) {
      router.push("/");
      toast({
        title: "Sign up successful",
        description: "Please check your mailbox, a confirmation email will be sent to you shortly.",
      })
    } else if (error) {
      toast({
        title: "Sign up failed",
        description: error,
        variant: "destructive",
      });
    }
  };

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-4 max-w-xs">
        <FormField
          control={ form.control }
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="rounded-md px-1 border-2 border-black w-full h-8"
                  { ...field }
                />
              </FormControl>
              <FormDescription>
                <span className="block">• Username must be between 2 and 20 characters long</span>
                <span className="block">• Username must only contain letters, numbers, underscores, and periods</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={ form.control }
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-md px-1 border-2 border-black w-full h-8"
                  { ...field }
                />
              </FormControl>
              <FormDescription>
                <span className="block">• Email address must be valid; a confirmation email will be sent to this email address</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={ form.control }
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="rounded-md px-1 border-2 border-black w-full h-8"
                  { ...field }
                />
              </FormControl>
              <FormDescription>
                <span className="block">• Password must be between 8 and 20 characters long</span>
                <span className="block">• Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={ form.control }
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="rounded-md px-1 border-2 border-black w-full h-8"
                  { ...field }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button type="submit" className="w-full">Sign Up</Button>
        </div>
      </form>
    </Form>
  );
}
