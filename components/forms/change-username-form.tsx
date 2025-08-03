"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
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
import { useToast, useUserContext } from "@/hooks";

interface ChangeUsernameFormProps {
  handleBack: () => void;
}

const changeUsernameFormSchema = z.object({
  newUsername: z.string()
    .min(2, "Username must be at least 2 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_.]+$/, "Username must only contain letters, numbers, underscores, and periods")
    .regex(/^\S+$/, "Username must not contain spaces"),
});

const supabase = createClient();

export function ChangeUsernameForm({ handleBack }: ChangeUsernameFormProps) {
  const { toast } = useToast();
  const { user, refresh } = useUserContext();

  const form = useForm<z.infer<typeof changeUsernameFormSchema>>({
    resolver: zodResolver(changeUsernameFormSchema),
    defaultValues: {
      newUsername: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof changeUsernameFormSchema>) => {
    if (!user) {
      toast({
        title: "Error Changing Username",
        description: "User not found.",
        variant: "destructive",
      });
      return;
    }
    
    const newUsername = data.newUsername.trim();

    // Error checking for empty username
    if (newUsername === "") {
      toast({
        title: "Error Changing Username",
        description: "Username cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    // Error checking for own username
    if (newUsername === user.username) {
      toast({
        title: "Error Changing Username",
        description: `'${newUsername}' is your current username.`,
        variant: "destructive",
      });
      return;
    }

    const { data: userData, error } = await supabase
      .from("users")
      .update({ username: newUsername })
      .eq("user_id", user.userId)
      .select();
    
    if (userData) {
      refresh();
      toast({
        title: "Username Changed Successfully",
        description: `Your username has been updated to '${newUsername}'.`,
      });
      handleBack();
    } else if (error) {
      if (error.code === "23505") {
        toast({
          title: "Error Changing Username",
          description: `'${newUsername}' is already taken.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error Changing Username",
          description: error.message || "An error occurred while changing your username.",
          variant: "destructive",
        });
      }
      return;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const isPlainEnter = event.key === 'Enter' && 
      !(event.shiftKey || event.ctrlKey || event.altKey || event.metaKey);
      
    if (isPlainEnter) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form onKeyDown={ handleKeyDown } onSubmit={ form.handleSubmit(onSubmit) } className="space-y-6">
        <FormField
          control={ form.control }
          name="newUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Username</FormLabel>
              <FormControl>
                <Input placeholder={ user ? user.username : "Enter new username" } { ...field } />
              </FormControl>
              <FormDescription>
                <span className="block">• Username must be between 2 and 20 characters long</span>
                <span className="block">• Username must only contain letters, numbers, underscores, and periods</span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button variant="outline" type="button" onClick={ handleBack }>
            Back
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}