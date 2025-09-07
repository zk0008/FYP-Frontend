"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
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
import { useSendInvite, useToast, useUnifiedChatroomContext } from "@/hooks";

const inviteUserFormSchema = z.object({
  username: z.string()
    .min(2, "Username must be at least 2 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_.]+$/, "Username must only contain letters, numbers, underscores, and periods")
    .regex(/^\S+$/, "Username must not contain spaces")
});

export function InviteUserForm({ onSuccess }: { onSuccess?: () => void }) {
  const { sendInvite, isLoading } = useSendInvite();
  const { toast } = useToast();
  const { currentChatroom } = useUnifiedChatroomContext();

  const form = useForm<z.infer<typeof inviteUserFormSchema>>({
    resolver: zodResolver(inviteUserFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof inviteUserFormSchema>) => {
    if (!currentChatroom) {
      toast({
        title: "Error Sending Invite",
        description: "Chatroom context is not available.",
        variant: "destructive"
      });
      return;
    }

    const { success, error } = await sendInvite({
      chatroomId: currentChatroom.chatroomId,
      recipientUsername: data.username
    });

    if (success) {
      toast({
        title: "Invite Sent",
        description: `'${data.username}' has been invited to join chatroom '${currentChatroom.name}'.`,
      });

      form.reset();  // Reset the form after successful submission
      onSuccess?.();  // Call the success callback if provided
    } else if (error) {
      toast({
        title: "Error Sending Invite",
        description: error,
        variant: "destructive"
      });
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Submit form on Enter key press
    if (event.key === "Enter") {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8">
        <FormField
          control={ form.control }
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter username"
                  { ...field }
                  onKeyDown={ handleKeyDown }
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

        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="default" type="submit" disabled={ isLoading }>
            {isLoading ? "Sending..." : "Send Invite"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
