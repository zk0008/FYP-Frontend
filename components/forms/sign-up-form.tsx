"use client";

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
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUp, signIn } from "@/utils/auth";
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
    const { error: signUpError } = await signUp({
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    // Unsuccessful sign up
    if (signUpError) {
      toast({
        title: "Sign Up Failed",
        description: signUpError,
        variant: "destructive",
      });
      return;
    }

    // Successful sign up
    /* Email confirmation flow (to be set in Supabase), but verification emails get blocked by NTU firewall */
    // router.push("/");
    // toast({
    //   title: "Confirmation Email Sent",
    //   description: "Please check your mailbox and click the confirmation link to complete your sign up.",
    // })

    /* Directly log the user in upon successful sign up since users cannot receive verification emails */
    const { user, error: signInError } = await signIn({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      toast({
        title: "Sign In Failed",
        description: signInError,
        variant: "destructive",
      });
      return;
    }

    window.location.href = "/chats";  // Full reload required for proper realtime subscription
    toast({
      title: "Signed In",
      description: `Hello ${user?.user_metadata?.username || "there"}, welcome!`,
    });
  };

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-4 w-full max-w-xs">
        <FormField
          control={ form.control }
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your username"
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
                <Input
                  type="email"
                  placeholder="Enter your email"
                  { ...field }
                />
              </FormControl>
              <FormDescription>
                <span className="block">• Email address must be valid</span>
                {/* <span className="block">• Email address must be valid; a confirmation email will be sent to this email address</span> */}
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
                <Input
                  type="password"
                  placeholder="Enter your password"
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
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  { ...field }
                />
              </FormControl>
              <FormDescription>
                <span className="block">• Entered passwords must match</span>
              </FormDescription>
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
