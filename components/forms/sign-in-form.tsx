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
    if (user) {
      window.location.href = "/chats";    // Full reload required for proper realtime subscription
      toast({
        title: "Signed In",
        description: `Hello ${user?.user_metadata?.username || "there"}, welcome back!`,
      })
    } else if (error) {
      toast({
        title: "Sign In Failed",
        description: error,
        variant: "destructive",
      })
    }
  };

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-4 max-w-xs">
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