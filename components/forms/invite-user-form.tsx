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
import { Input } from "@/components/ui/input";
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

    // Error checking for own username
    if (data.username === user.username) {
      toast({
        title: "Error Sending Invite",
        description: "You cannot invite yourself to the chatroom.",
        variant: "destructive",
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

    // Check if recipient is already in the chatroom
    const { data: existingMember, error: memberError } = await supabase
      .from("members")
      .select()
      .eq("user_id", recipient.user_id)
      .eq("chatroom_id", currentChatroom.chatroomId);

    if (existingMember && existingMember.length > 0) {
      toast({
        title: "Error Sending Invite",
        description: `'${data.username}' is already a member of chatroom '${currentChatroom.name}'.`,
        variant: "destructive",
      });
      return;
    } else if (memberError) {
      toast({
        title: "Error Checking Membership",
        description: memberError.message || "An unexpected error occurred while checking membership.",
        variant: "destructive",
      });
      return;
    }

    // Check if a pending invite to the user already exists for the current chatroom
    const { data: existingInvite, error: existingInviteError } = await supabase
      .from("invites")
      .select()
      .eq("recipient_id", recipient.user_id)
      .eq("chatroom_id", currentChatroom.chatroomId)
      .eq("status", "PENDING");

    if (existingInvite && existingInvite.length > 0) {
      toast({
        title: "Invite Already Exists",
        description: `'${data.username}' has been invited to join chatroom '${currentChatroom.name}'. Please wait for them to respond.`,
        variant: "destructive",
      });
      return;
    } else if (existingInviteError) {
      toast({
        title: "Error Checking Existing Invites",
        description: existingInviteError.message || "An unexpected error occurred while checking existing invites.",
        variant: "destructive",
      });
      return;
    }

    // Insert invite into database
    const { error: insertInviteError } = await supabase
      .from("invites")
      .insert({
        sender_id: user.userId,
        recipient_id: recipient.user_id,
        chatroom_id: currentChatroom.chatroomId,
        status: "PENDING"
      });

    if (insertInviteError) {
      toast({
        title: "Error Sending Invite",
        description: insertInviteError.message || "An unexpected error occurred while sending the invite.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invite Sent",
      description: `'${data.username}' has been invited to join chatroom '${currentChatroom.name}'.`,
    });

    form.reset();  // Reset the form after successful submission
    onSuccess?.();  // Call the success callback if provided
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
          <Button variant="default" type="submit">
            Send Invite
          </Button>
        </div>
      </form>
    </Form>
  );
}
