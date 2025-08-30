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
import { useToast, useUnifiedChatroomContext, useUserContext } from "@/hooks";

const createChatroomFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Chatroom name must be at least 2 characters long")
    .max(64, "Chatroom name must be at most 64 characters long")
});

const supabase = createClient();

export function CreateChatroomForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useUserContext();
  const { refresh } = useUnifiedChatroomContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createChatroomFormSchema>>({
    resolver: zodResolver(createChatroomFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof createChatroomFormSchema>) => {
    if (!user) {
      toast({
        title: "Error Creating Chatroom",
        description: "User not found.",
        variant: "destructive",
      });
      return;
    }

    const chatroomName = data.name.trim();

    // Error checking for empty chatroom name
    if (chatroomName === "") {
      toast({
        title: "Error Creating Chatroom",
        description: "Chatroom name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    // Insert new chatroom into database
    const { data: chatroomData, error: chatroomError } = await supabase
      .from("chatrooms")
      .insert({
        creator_id: user.userId,
        name: chatroomName
      })
      .select("chatroom_id");

    // Add creator as member of the chatroom
    const { error: memberError } = await supabase
      .from("members")
      .insert({
        user_id: user.userId,
        chatroom_id: chatroomData?.[0]?.chatroom_id
      });

    if (chatroomError || memberError) {
      const error = chatroomError || memberError;

      toast({
        title: "Error Creating Chatroom",
        description: error?.message || "An error occurred while creating the chatroom.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Chatroom Created",
      description: `'${chatroomName}' chatroom has been created.`,
    });

    refresh();      // Refresh chatroom context
    onSuccess?.();
  }

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8">
        <FormField
          control={ form.control }
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chatroom Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter chatroom name"
                  { ...field }
                  onKeyDown={(e) => e.stopPropagation()} // Required to allow spaces in input
                />
              </FormControl>
              <FormDescription>
                Chatroom name must be between 2 and 64 characters long.
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
            Create Chatroom
          </Button>
        </div>
      </form>
    </Form>
  )
}
