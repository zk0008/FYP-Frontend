"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/utils/auth";
import { useToast } from "@/hooks";

const signInFormSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long"),
});

export function SignInForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInFormSchema>) => {
    const { user, error } = await signIn({ email: data.email, password: data.password });

    if (error) {
      toast({
        title: "Sign In Failed",
        description: error,
        variant: "destructive",
      });
      return;
    }

    window.location.href = "/chats";  // Full reload required for proper realtime subscription
    toast({
      title: "Signed In",
      description: `Hello ${user?.user_metadata?.username || "there"}, welcome back!`,
    });
  };

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-4 w-full max-w-xs">
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button type="submit" className="w-full">Sign In</Button>
        </div>
      </form>
    </Form>
  )
}