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
import { useEditChatroom, useToast, useUnifiedChatroomContext } from "@/hooks";

const editChatroomFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Chatroom name must be at least 2 characters long")
    .max(64, "Chatroom name must be at most 64 characters long")
});

export function EditChatroomForm({ onSuccess }: { onSuccess?: () => void }) {
  const { editChatroom, isEditing } = useEditChatroom();
  const { refresh, currentChatroom } = useUnifiedChatroomContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof editChatroomFormSchema>>({
    resolver: zodResolver(editChatroomFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof editChatroomFormSchema>) => {
    const newChatroomName = data.name.trim();

    // Error checking for empty chatroom name
    if (newChatroomName === "") {
      toast({
        title: "Error Editing Chatroom",
        description: "Chatroom name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const { success, error } = await editChatroom({ chatroomName: newChatroomName });

    if (success) {
      toast({
        title: "Chatroom Edited",
        description: `Chatroom name changed to '${newChatroomName}'.`,
      });

      refresh();  // Refresh chatroom context
      onSuccess?.();
    } else if (error) {
      toast({
        title: "Error Editing Chatroom",
        description: error.message || "An error occurred while editing the chatroom.",
        variant: "destructive",
      });
      return;
    }
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
                  placeholder={ currentChatroom ? currentChatroom.name : "Enter new chatroom name" }
                  { ...field }
                  onKeyDown={(e) => e.stopPropagation()}  // Required to allow spaces in input
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
          <Button variant="default" type="submit" disabled={ isEditing }>
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
