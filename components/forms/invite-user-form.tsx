"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
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
import {
  useUnifiedChatroomContext,
  useToast,
  useUserContext
 } from "@/hooks";

const inviteUserFormSchema = z.object({
  username: z.string()
    .min(2, "Username must be at least 2 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_.]+$/, "Username must only contain letters, numbers, underscores, and periods")
    .regex(/^\S+$/, "Username must not contain spaces")
});

const supabase = createClient();

export function InviteUserForm({ onSuccess }: { onSuccess?: () => void }) {
  const { currentChatroom } = useUnifiedChatroomContext();
  ;;;
  const { toast } = useToast();
  const { user } = useUserContext();

  const form = useForm<z.infer<typeof inviteUserFormSchema>>({
    resolver: zodResolver(inviteUserFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof inviteUserFormSchema>) => {
    if (!currentChatroom || !user) {
      toast({
        title: "Error Sending Invite",
        description: "Invalid chatroom or user context.",
        variant: "destructive"
      });
      return;
    }

    // Check if recipient exists
    const { data: recipient, error: recipientError } = await supabase
      .from("users")
      .select("user_id")
      .eq("username", data.username)
      .single();

    if (!recipient || recipientError) {
      toast({
        title: "Error Sending Invite",
        description: "Recipient not found. Please check the username and try again.",
        variant: "destructive",
      });
      return;
    }

    // Insert invite into database
    const { error: inviteError } = await supabase
      .from("invites")
      .insert({
        sender_id: user.userId,
        recipient_id: recipient.user_id,
        chatroom_id: currentChatroom.chatroomId,
        status: "PENDING"
      });

    if (inviteError) {
      toast({
        title: "Error Sending Invite",
        description: inviteError.message || "An unexpected error occurred while sending the invite.",
        variant: "destructive",
      });
    }

    toast({
      title: "Invite Sent",
      description: `'${data.username}' has been invited to join chatroom '${currentChatroom.name}'.`,
    });

    form.reset(); // Reset the form after successful submission
    onSuccess?.(); // Call the success callback if provided
  }

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
                <input
                  type="text"
                  placeholder="Enter username"
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

        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="default" type="submit">
            Send Invite
          </Button>
        </div>
      </form>
    </Form>
  );
}
